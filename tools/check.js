/* ============================================================
   Run every check in one go.  node tools/check.js

   The CSS checks are static and instant. The browser checks (QA harness,
   screenshots) are separate — this script only covers what can be proven
   from the files themselves, which is the layer that catches a mistake
   before it ever reaches a page.
   ============================================================ */
const { execFileSync } = require('child_process');
const path = require('path');

const node = process.execPath;
const checks = [
  ['css-parse-check', ['assets/css/site.css'], 'CSS parses, braces balance, no dangling var()'],
  ['css-audit', [], 'no unused tokens, dead classes or keyframes'],
  ['motion-audit-selftest', [], 'the motion rules above can still fail'],
  ['hover-colour-audit', [], 'no link loses its label colour on hover'],
  ['contrast-audit', [], 'every text pair clears 4.5:1, grain included']
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
