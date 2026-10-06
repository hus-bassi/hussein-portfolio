/* ============================================================
   Run every check in one go.  node tools/check.js

   The CSS checks are static and instant. The browser checks (QA harness,
   screenshots) are separate — this script only covers what can be proven
   from the files themselves, which is the layer that catches a mistake
   before it ever reaches a page.

   ONE AT A TIME, AND NEVER LEFT MUTATED.
   Four of the checks below (the `*-selftest` family) prove they can still
   fail by writing a PLANTED BUG into the real source file and restoring it
   afterwards. That makes two accidents possible, and both happened in one
   session here:

     · two runs at once — each restores the bytes it read, so an interleave
       can write a mutation back as if it were the original. Measured: site.css,
       records.css and reveal.js were left holding planted bugs, and the next
       run reported six failures that were not defects in the site.
     · a run killed mid-flight — the restore never happens and the planted bug
       stays on disk, reading as a real site bug to whoever runs the next check.

   So a run now takes a lock and, before it exposes anything to mutation,
   journals those files to disk. A clean exit, Ctrl+C or a hard kill are all
   covered: the next run heals from the journal first and says so out loud.
   ============================================================ */
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const path = require('path');

const node = process.execPath;
const root = path.join(__dirname, '..');

/* every file a selftest writes to. Each one restores itself in a `finally`;
   this is the net under that net. */
const WATCH = [
  'assets/css/site.css', 'assets/css/records.css',
  'assets/js/reveal.js', 'assets/js/records.js',
  'assets/js/page.js', 'assets/js/site.js', 'index.html'
].filter(function (rel) { return fs.existsSync(path.join(root, rel)); });

const LOCK = path.join(os.tmpdir(), 'hussein-portfolio-check.lock');
const UNDO = path.join(os.tmpdir(), 'hussein-portfolio-check.undo.json');

function alive(pid) {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } }
function rm(p) { try { fs.unlinkSync(p); } catch (e) {} }
function snapshot() {
  const files = {};
  for (const rel of WATCH) files[rel] = fs.readFileSync(path.join(root, rel)).toString('base64');
  return files;
}
/* does any watched file differ from the bytes in a journal? */
function heal(files) {
  const healed = [];
  for (const rel of Object.keys(files || {})) {
    const p = path.join(root, rel);
    let now = null; try { now = fs.readFileSync(p); } catch (e) {}
    if (!now || now.toString('base64') !== files[rel]) {
      fs.writeFileSync(p, Buffer.from(files[rel], 'base64'));
      healed.push(rel);
    }
  }
  return healed;
}

const lock = readJson(LOCK);
if (lock && alive(lock.pid)) {
  process.stderr.write('tools/check.js is already running (pid ' + lock.pid + ').\n' +
    'The selftests patch the real source files, so two runs at once can leave a\n' +
    'planted bug behind. Wait for that run to finish, then run this again.\n');
  process.exit(2);
}
/* a lock whose owner is gone means the last run was killed before it could clean
   up — put its files back before measuring anything */
if (lock) {
  const und = readJson(UNDO);
  const healed = heal(und && und.files);
  rm(LOCK); rm(UNDO);
  process.stdout.write('\n!! a previous check run did not finish\n');
  process.stdout.write(healed.length
    ? '   restored from its journal: ' + healed.join(', ') + '\n'
    : '   it left nothing mutated\n');
}

/* the lock is taken EXCLUSIVELY, before anything is exposed to mutation: two
   runs cannot both believe they own the tree */
try {
  fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid }), { flag: 'wx' });
} catch (e) {
  process.stderr.write('another tools/check.js took the lock while this one was starting; nothing was run.\n');
  process.exit(2);
}
/* the journal is the undo: the exact pre-run bytes of every file a selftest may
   plant a bug in. Written here, so a kill at any point still leaves enough
   behind for the next run to restore. */
fs.writeFileSync(UNDO, JSON.stringify({ pid: process.pid, files: snapshot() }));
function release() { rm(LOCK); rm(UNDO); }
process.on('exit', release);
process.on('SIGINT', function () { release(); process.exit(130); });
process.on('SIGTERM', function () { release(); process.exit(143); });

const checks = [
  ['css-parse-check', ['assets/css/site.css'], 'CSS parses, braces balance, no dangling var()'],
  ['css-audit', [], 'no unused tokens, dead classes or keyframes'],
  ['motion-audit-selftest', [], 'the motion rules above can still fail'],
  ['hover-colour-audit', [], 'no link loses its label colour on hover'],
  ['contrast-audit', [], 'every text pair clears 4.5:1, grain included'],
  ['image-fit-audit', [], 'viewer fit is one generic orientation-blind formula'],
  ['card-layout-audit', [], 'record cards balance from one generic recipe'],
  ['details-media-selftest', [], 'the details-media rules above can still fail'],
  ['details-scroll-audit', [], 'details is header · one scroller · footer'],
  ['details-scroll-selftest', [], 'the details-scroll rules above can still fail'],
  ['reveal-audit', [], 'one reveal engine, and nothing is ever held back'],
  ['reveal-selftest', [], 'the reveal rules above can still fail']
];

let failed = 0;
for (const [tool, args, what] of checks) {
  process.stdout.write('\n=== ' + tool + ' — ' + what + '\n');
  try {
    const out = execFileSync(node, [path.join(__dirname, tool + '.js'), ...args], {
      encoding: 'utf8'
    });
    process.stdout.write(out);
  } catch (e) {
    failed++;
    process.stdout.write(e.stdout || '');
    process.stdout.write(e.stderr || '');
    process.stdout.write('  -> FAILED\n');
  }
}

process.stdout.write('\n' + '-'.repeat(60) + '\n');
process.stdout.write(failed
  ? failed + ' CHECK(S) FAILED\n'
  : 'all static checks passed\n');
process.exitCode = failed ? 1 : 0;
