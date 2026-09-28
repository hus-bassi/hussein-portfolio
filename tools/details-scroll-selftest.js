/* ============================================================
   SELFTEST: prove the details-scroll assertions can FAIL.

   A check that cannot fail is worse than no check. Each case below breaks
   ONE thing the way the real bug broke it, and the audit must notice.

   Note the STRICTNESS of `caught` here: it looks for a line that is both
   the FAIL marker and the assertion's own name. Matching the name alone
   would pass on every run, because a passing audit prints the name too —
   which is precisely the "check that silently finds nothing" failure mode
   AGENTS.md warns about.

   Run: node tools/details-scroll-selftest.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const JS = path.join(root, 'assets', 'js', 'records.js');
const CSS = path.join(root, 'assets', 'css', 'records.css');
const AUDIT = path.join(root, 'tools', 'details-scroll-audit.js');

const js0 = fs.readFileSync(JS, 'utf8');
const css0 = fs.readFileSync(CSS, 'utf8');
let failed = 0;

function audit() {
  try {
    execFileSync(process.execPath, [AUDIT], { cwd: root, stdio: 'pipe' });
    return '';
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}
function check(name, ok, detail) {
  if (!ok) failed++;
  process.stdout.write((ok ? '  ok  ' : '  FAIL ') + name + (detail ? ' - ' + detail : '') + '\n');
}
function withJs(re, rep, fn) {
  const out = js0.replace(re, rep);
  if (out === js0) { check('MUTATION DID NOT APPLY (js): ' + re, false); return; }
  fs.writeFileSync(JS, out);
  try { fn(); } finally { fs.writeFileSync(JS, js0); }
}
function withCss(re, rep, fn) {
  const out = css0.replace(re, rep);
  if (out === css0) { check('MUTATION DID NOT APPLY (css): ' + re, false); return; }
  fs.writeFileSync(CSS, out);
  try { fn(); } finally { fs.writeFileSync(CSS, css0); }
}
function caught(needle, out) {
  return out.split('\n').some(function (l) {
    return l.indexOf('FAIL') !== -1 && l.indexOf(needle) !== -1;
  });
}

/* 0. the baseline must be GREEN, or every case below proves nothing */
check('the real files pass the audit before anything is broken', audit() === '');

/* and `caught` must be strict, proven BOTH ways: it has to fire on a real
   FAIL line, and it has to stay silent on a green run. Matching the name
   alone would pass every time, because a passing audit prints the name too
   — which is the "check that silently finds nothing" failure mode. */
check('caught() fires on a FAIL line and stays silent on a green run (two-sided)',
  caught('the footer is NOT absolute', '  FAIL 4. the footer is NOT absolute - x\n') === true &&
  caught('the footer is NOT absolute', audit()) === false);

console.log('\n— §26 the eleven the brief names —');
/* 1. .detail-body loses overflow-y: auto */
withCss(/(\.detail-body \{[\s\S]*?)\n  overflow-y: auto;/, '$1',
  () => check('caught: overflow-y:auto removed from the scroll container',
    caught('the scroll container scrolls vertically', audit())));

/* 2. .detail-body loses min-height: 0 */
withCss(/(\.detail-body \{[\s\S]*?)\n  min-height: 0;/, '$1',
  () => check('caught: min-height:0 removed from the scroll container',
    caught('the scroll container has no automatic minimum', audit())));

/* 3. the footer goes absolute */
withCss(/(\.cert-foot \{[\s\S]*?)\n  display: flex;/, '$1\n  position: absolute; bottom: 0;',
  () => check('caught: the footer became absolute',
    caught('the footer is NOT absolute', audit())));

/* 4. the footer goes fixed */
withCss(/(\.cert-foot \{[\s\S]*?)\n  display: flex;/, '$1\n  position: fixed; bottom: 0;',
  () => check('caught: the footer became fixed',
    caught('the footer is NOT fixed', audit())));

/* 5. a second scroll container appears */
withCss(/(\.detail-section \{)/, '$1 overflow-y: auto;',
  () => check('caught: a second scroll container was introduced',
    caught('there is EXACTLY ONE vertical scroller', audit())));

/* 6. window.scrollTo() in the details */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/, '$1window.scrollTo(0, 0);$2',
  () => check('caught: window.scrollTo() in the details',
    caught('the details never scrolls the PAGE', audit())));

/* 7. scrollIntoView() in the details */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/, '$1frame.scrollIntoView();$2',
  () => check('caught: scrollIntoView() in the details',
    caught('the details never scrolls the PAGE', audit())));

/* 8. setTimeout() in the details init */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/, '$1setTimeout(function () {}, 0);$2',
  () => check('caught: setTimeout() in the details init',
    caught('no setTimeout was added', audit())));

/* 9. rAF in the details init */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/, '$1requestAnimationFrame(function () {});$2',
  () => check('caught: requestAnimationFrame() in the details init',
    caught('no rAF was added', audit())));

/* 10. wheel interception — the "just add a handler" non-fix */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/,
  '$1frame.addEventListener(\'wheel\', function (e) { e.preventDefault(); });$2',
  () => check('caught: a wheel listener was added to the details',
    caught('nothing can cancel the details wheel', audit())));

/* 10b. THE REAL BUG, byte for byte. The zoomer cancels the wheel BEFORE it
        asks whether there is an image to zoom. The stage is the same element
        the details relabel into the scrolling column, so that cancel took the
        DETAILS' scrolling away instead of the page's — and since details mode
        has no `.cert-image` at all, the guard below it returned and the
        cancel had bought nothing. The wheel was swallowed whole and the
        column could only be moved by dragging its scrollbar. Reordering those
        two statements is the entire fix, so reordering them back must fail
        the audit. */
withJs(/(stage\.addEventListener\('wheel', function \(e\) \{[\s\S]*?)\n(\s*)if \(!img\(\)\) return;\n(\s*)e\.preventDefault\(\);/,
  '$1\n$3e.preventDefault();\n$2if (!img()) return;',
  () => check('caught: the zoomer cancels the wheel BEFORE its no-image guard (the real bug)',
    caught('nothing can cancel the details wheel', audit())));

/* 10c. the guard deleted outright — a zoomer that always cancels, which is
        the same swallowing with one fewer line to look at */
withJs(/(stage\.addEventListener\('wheel', function \(e\) \{[\s\S]*?)\n\s*if \(!img\(\)\) return;/, '$1',
  () => check('caught: the no-image guard removed from the zoomer wheel handler',
    caught('nothing can cancel the details wheel', audit())));

/* 10d. a second wheel listener that does not even cancel: harmless in
        isolation, and still a second system on the one element that both
        modes share. "It does not preventDefault today" is not a rule. */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)(frame\.scrollTop = 0;)/,
  '$1frame.addEventListener(\'wheel\', function () {});$2',
  () => check('caught: a second wheel listener on the shared element, cancelling or not',
    caught('nothing can cancel the details wheel', audit())));

/* 11. the giant bottom-padding hack */
withCss(/(\.detail-body \{[\s\S]*?)\n  padding: var\(--s-5\) var\(--s-6\);/, '$1\n  padding: var(--s-5) var(--s-6) 200px;',
  () => check('caught: a 200px bottom-padding hack',
    caught('the bottom spacing is a token', audit())));

console.log('\n— the defect class this change is actually about —');
/* 12. the percentage comes back: the box runs past its row and paints under
       the footer. This is the real bug, and the one that is invisible in
       Chromium and real wherever the spec is followed. */
withCss(/(\.detail-body \{[\s\S]*?)\n  min-height: 0;/, '$1\n  height: 100%;',
  () => check('caught: height:100% back on the scroll container',
    caught('the bounded height comes from the LAYOUT', audit())));

/* 13. the middle row stops being shrinkable */
withCss(/grid-template-rows: auto minmax\(0, 1fr\) auto;/, 'grid-template-rows: auto 1fr auto;',
  () => check('caught: the middle row lost its zero minimum',
    caught('the panel is three rows', audit())));

/* 14. something switches the default stretch off */
withCss(/(\.cert-panel \{[\s\S]*?)\n  grid-template-rows/, '$1\n  align-items: start;\n  grid-template-rows',
  () => check('caught: align-items on the panel un-stretches the middle row',
    caught('the panel does not switch the default stretch off', audit())));

/* 15. the bound loses its fallback: an engine without svh has no bound at all */
withCss(/(\.cert-panel \{[\s\S]*?)\n  max-height: 92vh;  \/\* fallback[^\n]*\n/, '$1\n',
  () => check('caught: the vh fallback removed from the panel bound',
    caught('the panel is BOUNDED', audit())));

/* 16. the reset moves BEFORE the content is mounted */
withJs(/(function openDetails\(rec\) \{[\s\S]*?)\n    frame\.innerHTML = '';/, '$1\n    frame.scrollTop = 0;\n    frame.innerHTML = \'\';',
  () => check('caught: the reset moved above the mount',
    caught('the reset happens AFTER the content is mounted', audit())));

/* 17. the reset moves BACK to before showModal — the exact defect this
       change fixes. A closed <dialog> is display:none, so the frame has no
       scrolling box and the assignment is thrown away, and showModal then
       re-applies the offset it was left at. */
withJs(/(if \(typeof viewer\.showModal === 'function'\) viewer\.showModal\(\);\n    else viewer\.setAttribute\('open', ''\);\n)(    frame\.scrollTop = 0;)/,
  '$2\n$1',
  () => check('caught: the reset moved back ABOVE showModal (the discarded write)',
    caught('the reset happens AFTER the dialog is shown', audit())));

/* 17b. and deferring it a frame later is equally wrong — that is a visible
        jump, and it is the "just add a rAF" non-fix */
withJs(/(    frame\.scrollTop = 0;\n  \})/, '    requestAnimationFrame(function () { frame.scrollTop = 0; });\n  }',
  () => check('caught: the reset deferred to a rAF',
    (caught('the reset happens AFTER the dialog is shown', audit()) ||
     caught('no rAF was added', audit()))));

/* 18. a compensating second reset */
withJs(/(    frame\.scrollTop = 0;)/, '$1\n    frame.scrollTop = 0;',
  () => check('caught: a second scroll reset',
    caught('the scroll reset exists EXACTLY ONCE', audit())));

/* 19. the footer goes translucent again */
withCss(/(\.cert-foot \{[\s\S]*?)\n  background: rgba\(8, 11, 19, \.98\);/, '$1\n  background: rgba(4, 5, 10, .6);',
  () => check('caught: the footer made translucent again',
    caught('the footer background is opaque enough', audit())));

/* 20. the dialog inherits the page's smooth scrolling */
withCss(/(\.detail-body \{[\s\S]*?)\n  scroll-behavior: auto;/, '$1',
  () => check('caught: scroll-behavior left to inherit on the dialog',
    caught('the container is told to track the gesture', audit())));

/* 21. overflow-x left to compute as auto, so the column can scroll sideways */
withCss(/(\.detail-body \{[\s\S]*?)\n  overflow-x: hidden;/, '$1',
  () => check('caught: overflow-x not pinned to hidden',
    caught('the scroll container scrolls vertically', audit())));

/* 22. a second scrollbar system bolted onto the dialog */
withCss(/(\n\.cert-panel \{)/, '\n.detail-body::-webkit-scrollbar { width: 14px; }\n$1',
  () => check('caught: the dialog grew its own scrollbar treatment',
    caught('the scrollbar treatment is the existing one', audit())));

/* 23. the gesture is chained out to the page behind the dialog */
withCss(/(\.detail-body \{[\s\S]*?)\n  overscroll-behavior: contain;/, '$1',
  () => check('caught: overscroll chaining restored',
    caught('the gesture is not chained out', audit())));

/* 24. the shell's row order is reversed so the frame frames the actions */
withJs(/'<header class="cert-head">' \+([\s\S]*?)<footer class="cert-foot">'/,
  '\'<footer class="cert-foot">\' +$1\'<header class="cert-head">\'',
  () => check('caught: the header/frame/footer order reversed',
    caught('the JS builds header, then frame, then footer', audit())));

process.stdout.write(failed
  ? '\ndetails-scroll-selftest FAILED (' + failed + ')\n'
  : '\ndetails-scroll-selftest passed\n');
process.exitCode = failed ? 1 : 0;
