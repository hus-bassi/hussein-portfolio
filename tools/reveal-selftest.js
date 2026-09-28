/* ============================================================
   SELFTEST: prove the reveal assertions can FAIL.

   A check that cannot fail is worse than no check. Each case below breaks
   ONE thing the way the real bug broke it, and the audit must notice.

   Every case here is a defect that actually happened in this project, or
   that this engine is specifically built to make impossible:

     · the head's entry state unconditional  — the bug that made the Records
       page title invisible for good
     · a second observer / a scroll listener — the three-copies drift that
       reveal.js was written to end
     · a second timer — a chain where a net was asked for
     · the min() clamp removed — a list that takes seconds to appear
     · display:none on a reveal — the page that jumps while it is read

   Note the STRICTNESS of `caught` below: it looks for a line that is BOTH
   the FAIL marker and the assertion's own name. Matching the name alone
   would pass on every run, because a passing audit prints the name too —
   which is precisely the "check that silently finds nothing" failure mode
   AGENTS.md warns about.

   Run: node tools/reveal-selftest.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const F = {
  reveal: path.join(root, 'assets', 'js', 'reveal.js'),
  page: path.join(root, 'assets', 'js', 'page.js'),
  site: path.join(root, 'assets', 'js', 'site.js'),
  records: path.join(root, 'assets', 'js', 'records.js'),
  css: path.join(root, 'assets', 'css', 'site.css'),
  index: path.join(root, 'index.html'),
};
const AUDIT = path.join(__dirname, 'reveal-audit.js');

const orig = {};
for (const k of Object.keys(F)) orig[k] = fs.readFileSync(F[k], 'utf8');

/* The project is not uniform: assets/js/reveal.js is CRLF and everything
   else is LF. A mutation written against one and run against the other
   silently does not apply — and a selftest whose mutations do not apply is
   a selftest that proves nothing while looking green. So each file is
   flattened to LF, mutated, and written back in the ending it came with. */
const CRLF = {};
for (const k of Object.keys(F)) CRLF[k] = orig[k].indexOf('\r\n') !== -1;
const flat = (s) => s.replace(/\r\n/g, '\n');
const unflat = (s, k) => (CRLF[k] ? s.replace(/\n/g, '\r\n') : s);

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  process.stdout.write((ok ? '  ok  ' : '  FAIL ') + name + (detail ? ' - ' + detail : '') + '\n');
}

function audit() {
  try {
    execFileSync(process.execPath, [AUDIT], { cwd: root, stdio: 'pipe' });
    return '';
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

/* break one file, run the audit, put it back — always, even on throw */
function with_(file, re, rep, fn) {
  const base = flat(orig[file]);
  const out = base.replace(re, rep);
  if (out === base) {
    check('MUTATION DID NOT APPLY (' + file + '): ' + re, false,
      'the audit can never see this bug, because the text it breaks on is not there');
    return;
  }
  fs.writeFileSync(F[file], unflat(out, file));
  try { fn(); } finally { fs.writeFileSync(F[file], orig[file]); }
}

/* an assertion caught us only if a FAIL line carries ITS OWN name */
function caught(needle, out) {
  return out.split('\n').some(function (l) {
    return l.indexOf('FAIL') !== -1 && l.indexOf(needle) !== -1;
  });
}
/* ...and a green run must stay silent, or `caught` proves nothing */
function silentOnGreen(needle) {
  const out = audit();
  if (!out) return true;                 /* the audit failed for another reason: not a pass */
  return !out.split('\n').some(function (l) { return l.indexOf(needle) !== -1; });
}

console.log('— the harness itself —');
check('the real files pass the audit before anything is broken', audit() === '');
check('caught() is two-sided: it fires on a FAIL line and stays quiet on a green run', (() => {
  /* A known mutation that must make the audit exit non-zero AND print the
     name of the assertion it broke; and the real files must print that same
     name without FAIL. If either half is missing, every case below is
     decoration — the shape AGENTS.md calls "a check that cannot fail". */
  let brokenOut = '';
  with_('css', /transition-delay: calc\(min\(var\(--i, 0\), 3\) \* var\(--stagger\)\);/,
    'transition-delay: calc(var(--i, 0) * var(--stagger));',
    () => { brokenOut = audit(); });
  const NAME = '11. a staggered group is CLAMPED';
  return brokenOut !== '' && caught(NAME, brokenOut) && silentOnGreen(NAME);
})());

console.log('\n— the hidden page title: the defects that actually happened —');

/* THE BUG. records.html never loaded page.js, so nothing ever added is-in
   and the title sat at opacity 0. The fix was to re-key the entry state on
   the class that says an entrance is running — and to declare it only where
   motion is allowed. Both halves are load-bearing; break either one. */
with_('css', /@media \(prefers-reduced-motion: no-preference\) \{\n  \.is-entering \.page-head/, '/*MUT*/\n  .is-entering .page-head',
  () => check('caught: the head entry state taken OUT of the no-preference block',
    caught('READ NOTHING', audit()) || caught('9b.', audit()),
    'unconditional opacity:0 on the head is the original bug: three things had to be true for the title to be visible at all'));

with_('css', /\.is-entering \.page-head:not\(\.is-in\)/, '.is-entering .page-head',
  () => check('caught: :not(.is-in) dropped from the entry state',
    caught('9. the hidden state is conditional', audit())));

with_('css', /\.is-entering \.page-head:not\(\.is-in\)/, '.page-head',
  () => check('caught: the entry state no longer keyed on is-entering',
    caught('9. the hidden state is conditional', audit()),
    'keyed on the head alone, the resting page is the hidden page'));

/* THE SECOND BUG. The entrance lived in page.js behind two nested rAFs, and
   records.html does not load page.js. Putting it back is the regression. */
with_('page', /  \/\* ---------- reveal ---------- \*\//,
  "  document.documentElement.classList.add('is-entering');\n  var h = document.querySelector('.page-head');\n  requestAnimationFrame(function () { requestAnimationFrame(function () { h.classList.add('is-in'); }); });\n\n  /* ---------- reveal ---------- */",
  () => check('caught: page.js grew its own private page-head entrance again',
    caught('3b.', audit())));

with_('page', /  \/\* ---------- reveal ---------- \*\//,
  "  var h = document.querySelector('.page-head');\n  h.classList.add('is-in');\n\n  /* ---------- reveal ---------- */",
  () => check('caught: page.js flipping is-in itself',
    caught('14b.', audit()),
    'the entrance belongs to the engine; a page that also flips the class is a second switch that can be left off'));

/* THE THIRD BUG. A background tab, a prerender or a hidden tab can leave rAF
   unfired. The net is what stops the page's own name being what gets left
   invisible — and it is the failure this environment reproduced live. */
with_('reveal', /  \/\* The net under those frames[\s\S]*?\}, \d+\);\n/, '',
  () => check('caught: the safety net under the animation frames removed',
    caught('3c.', audit())));

with_('reveal', /if \(still\(\) \|\| typeof window\.requestAnimationFrame !== 'function'\) \{/,
  "document.documentElement.classList.add('is-entering');\n    if (still() || typeof window.requestAnimationFrame !== 'function') {",
  () => check('caught: still mode checked AFTER is-entering is set',
    caught('9d.', audit()),
    'the head would be hidden on the way to being safe'));

with_('reveal', /      head\.classList\.add\('is-in'\);\n      return true;/, '      return true;',
  () => check('caught: the still path no longer resolves the head at all',
    caught('9e.', audit())));

with_('reveal', /\n  \/\* The page head, answered on every page[\s\S]*?Reveal\.enter\(\);/, '',
  () => check('caught: Reveal.enter() no longer self-initialises',
    caught('3.', audit()),
    'a page must not be able to forget to ask for it — that is the only reason the first version broke'));

console.log('\n— no clock —');

with_('reveal', /(function observer\(\) \{)/,
  "$1\n  var watchdog = new IntersectionObserver(function () {}); watchdog.observe(document.body);",
  () => check('caught: a second IntersectionObserver in the engine',
    caught('1b.', audit())));

with_('reveal', /(var io = null;)/, "$1\n  window.addEventListener('scroll', function () { Reveal.scan(document); });",
  () => check('caught: a scroll listener driving the reveal',
    caught('4b.', audit()),
    'visibility is the observer\'s job; a scroll listener is the rAF loop by another name'));

with_('reveal', /(var io = null;)/, "$1\n  (function loop() { window.requestAnimationFrame(function () { Reveal.scan(document); loop(); }); })();",
  () => check('caught: a rAF loop re-scanning the page',
    caught('4.', audit())));

with_('reveal', /  function still\(\) \{/, "  function still() {\n    window.setTimeout(function () { still(); }, 50);",
  () => check('caught: a second timer in the engine',
    caught('5. the one timer', audit())));

with_('reveal', /      flushPassed\(\);/, '',
  () => check('caught: the skipped-target safety net no longer CALLED',
    caught('5b.', audit()),
    'a defined-but-uncalled function is a token that exists just in case; without the call a fast scroll leaves sections blank'));

with_('reveal', /  function flushPassed\(\) \{[\s\S]*?\n  \}\n/, '',
  () => check('caught: the skipped-target safety net removed entirely',
    caught('5b.', audit()),
    'a target a fast scroll jumps over is never reported by the observer, and stays at opacity 0 for good'));

with_('reveal', /io\.unobserve\(en\.target\);/, '',
  () => check('caught: the observer stops letting go of what it revealed',
    caught('4c.', audit())));

console.log('\n— what a reveal is allowed to touch —');

with_('css', /^(\.reveal \{\n  opacity: 0; translate: 0 18px; filter: blur\(5px\);)/m,
  '$1\n  display: none;',
  () => check('caught: display:none on the hidden reveal state',
    caught('6. the hidden state is opacity', audit())));

with_('css', /^(\.reveal \{\n  opacity: 0; translate: 0 18px; filter: blur\(5px\);)/m,
  '$1\n  height: 0;',
  () => check('caught: a layout property animated by a reveal',
    caught('6. the hidden state is opacity', audit()),
    'the page must not jump while it is being read'));

with_('css', /^(\.reveal \{\n  opacity: 0;) translate: 0 18px;/m, '$1 transform: translateY(18px);',
  () => check('caught: the travel moved onto `transform`',
    caught('6b.', audit()),
    'every card is both .reveal.is-in and .card:hover, and one of them would lose'));

with_('css', /^\.reveal\.is-in \{[^}]*\}\n/m, '',
  () => check('caught: the arrival state is never declared',
    caught('7. the arrival is the rest state', audit())));

with_('css', /^\.reveal \{[^}]*\}\n/m, '',
  () => check('caught: the .reveal rule itself deleted',
    caught('READ NOTHING', audit()),
    'a check that cannot find its anchor must say so loudly, not pass quietly'));

console.log('\n— the sequence —');

with_('css', /transition-delay: calc\(min\(var\(--i, 0\), 3\) \* var\(--stagger\)\);/,
  'transition-delay: calc(var(--i, 0) * var(--stagger));',
  () => check('caught: the stagger clamp removed',
    caught('11. a staggered group is CLAMPED', audit()),
    'uncapped, a list of forty records took nearly five seconds to appear'));

with_('css', /transition-delay: calc\(min\(var\(--i, 0\), 3\) \* var\(--stagger\)\);/,
  'transition-delay: calc(min(var(--i, 0), 3) * 200ms);',
  () => check('caught: a raw duration written into the stagger',
    caught('12. the stagger is read from the motion ladder', audit()),
    'a second motion ladder is the one that drifts'));

with_('css', /var\(--reveal-dur, var\(--motion-slow\)\)/g, '700ms',
  () => check('caught: the reveal duration taken off its token',
    caught('12b. the reveal duration is read from a token', audit())));

console.log('\n— still mode —');

with_('css', /  \.reveal \{ opacity: 1; translate: none; filter: none; transition-duration: 0s; \}/,
  '  .reveal { transition-duration: 0s; }',
  () => check('caught: the scroll reveal dropped from the reduced-motion block',
    caught('10. the reduced-motion block', audit())));

with_('reveal', /var immediate = still\(\) \|\| !\('IntersectionObserver' in window\);/,
  "var immediate = !('IntersectionObserver' in window);",
  () => check('caught: still mode no longer short-circuits the scan',
    caught('10b.', audit()),
    'the CSS says one thing and the script the other, and the page pays for the disagreement'));

with_('css', /(  \.reveal \{ opacity: 1; translate: none; filter: none; transition-duration: 0s; \})/,
  "$1\n  * { animation-duration: .001ms !important; }",
  () => check('caught: still mode answered with .001ms instead of `animation: none`',
    caught('10c.', audit())));

console.log('\n— one engine, in every caller —');

with_('records', /Reveal\.resolve\(target\);/, '',
  () => check('caught: a re-rendered list no longer resolved',
    caught('13. every page that renders content afterwards', audit())));

with_('index', / id="volley-list" data-reveal="stagger"/, ' id="volley-list"',
  () => check('caught: the volunteering list taken out of the reveal vocabulary',
    caught('16. the content groups that JS renders', audit()),
    'it and the projects list were the only card groups on the home page with no reveal'));

with_('index', / id="projects-list" data-reveal="stagger"/, ' id="projects-list"',
  () => check('caught: the projects list taken out of the reveal vocabulary',
    caught('16. the content groups that JS renders', audit())));

with_('site', /(  initReveal\(document\);)/,
  "$1\n  document.querySelectorAll('.card').forEach(function (c) { c.classList.add('reveal', 'is-in'); });",
  () => check('caught: a page script performing a reveal of its own',
    caught('14. no page script performs a reveal', audit())));

with_('index', /data-reveal="stagger"/, 'data-reveal="launch"',
  () => check('caught: the markup asks for a behaviour no rule exists for',
    caught('15. every data-reveal in the markup has a rule behind it', audit())));

with_('css', /^\.reveal-line \{ --reveal-dur: var\(--motion-reveal\); \}/m,
  '.reveal-line { --reveal-dur: var(--motion-reveal); }\n.reveal-swoop { opacity: 0; }',
  () => check('caught: a behaviour rule nothing in the markup ever asks for',
    caught('15b. every rule has a caller', audit()),
    'a class with no caller is a hook for nothing'));

/* ---------- how long the name takes, and the two states ---------- */

with_('css', /transition-delay: var\(--stagger\);/,
  'transition-delay: 500ms;',
  () => check('caught: the head cascade back to hand-typed delays',
    caught('9f. the head cascade is a stagger', audit()),
    '0/500/1000ms is what made the name invisible for half a second and the head 2.6s long'));

with_('css', /transition-delay: calc\(var\(--stagger\) \* 2\);/,
  'transition-delay: 1000ms;',
  () => check('caught: the last element of the head cascade given a whole second',
    caught('9f. the head cascade is a stagger', audit())));

with_('css', /  --stagger: 120ms;/,
  '  --motion-long: 1600ms;\n  --stagger: 120ms;',
  () => check('caught: a rung slower than --motion-reveal brought back',
    caught('9g. nothing arrives on a rung slower', audit())));

with_('reveal', /\}, 1600\);/, '}, 2800);',
  () => check('caught: the safety net sized for a slower entrance than exists',
    caught('9h. the safety net outlasts the entrance', audit()),
    'the net must outlast the entrance AND not be the delay; a net at 2800 leaves the name blank for three seconds whenever the frames never arrive'));

with_('reveal', /\n\s*if \(!box\.height\) continue;/, '',
  () => check('caught: the flush no longer distinguishing a node with no box',
    caught('14c. the flush cannot settle a node that has no box', audit()),
    'a hidden container reports bottom 0, which the test for "scrolled past" cannot tell apart'));

with_('reveal', /\n\s*if \(settledPage \|\| box\.top < window\.innerHeight\) node\.classList\.add\('is-in'\);/,
  "\n        node.classList.add('is-in');",
  () => check('caught: a re-rendered list settling everything again',
    caught('14d. a re-rendered list watches what is below the fold', audit()),
    'this is the bug that was reported as "no animation": every card below the fold already at opacity 1 before it was ever scrolled to'));

with_('reveal', /querySelectorAll\('\[data-reveal\]'\)/,
  "querySelectorAll('[data-reveal]:not([data-reveal-armed])')",
  () => check('caught: resolve() skipping groups that are already armed',
    caught('14e. resolve() does NOT skip a group for being already armed', audit()),
    'the group survives a re-render and its children do not, so this leaves every rebuilt card unarmed'));

console.log('\n' + '-'.repeat(60) + '\n');
if (failed) {
  process.stdout.write('reveal-selftest FAILED: ' + failed + ' case(s)\n');
  process.exitCode = 1;
} else {
  process.stdout.write('reveal-selftest passed\n');
}
