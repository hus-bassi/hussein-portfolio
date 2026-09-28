/* ============================================================
   Details-scroll audit.  node tools/details-scroll-audit.js

   The one thing the details panel may get wrong is its SCROLL
   ARCHITECTURE, and when it does it does not look broken — it looks like a
   scrollbar that has stopped working, which is the most expensive kind of
   bug to diagnose from a screenshot.

   The architecture under audit, in full:

       .cert-dialog        the top-layer box, bounded
       └ .cert-panel       grid: auto · minmax(0,1fr) · auto, bounded
         ├ .cert-head      fixed row — never scrolls
         ├ .cert-frame     the middle row
         │  └ .detail-body  THE ONLY scroll container
         └ .cert-foot      fixed row — never scrolls, never overlays

   Only the middle row scrolls, and it is bounded BY THE LAYOUT. The
   interesting part is what it is NOT allowed to rely on:

   A `height: 100%` on the scroll container is what this file exists to
   keep out. A percentage resolves against the grid area, and the panel's
   height is INDEFINITE — it carries a max-height, not a height — until the
   clamp engages. Read strictly, the percentage is `auto`, the box falls
   back to its content height, it runs past the row it lives in, and the
   content paints UNDER the footer while the panel's own `overflow: hidden`
   clips the rest. Chromium resolves it after clamping, so the bug is
   invisible in the browser it was written in and real everywhere the spec
   is followed. The row and the default stretch are the architecture; the
   percentage was a guess that happened to hold.

   Everything here is read from the FILES. Nothing about this check
   depends on a rendered frame — see AGENTS.md: a headless browser reports
   `prefers-reduced-motion: reduce`, does not run rendering steps, and can
   serve a cached stylesheet, so a browser reading of "it looks fine" is
   not evidence about the code.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'assets', 'js', 'records.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets', 'css', 'records.css'), 'utf8');
const siteCss = fs.readFileSync(path.join(root, 'assets', 'css', 'site.css'), 'utf8');
/* assertions run against CODE, never against prose. The comment above
   `.detail-body` NAMES `height: 100%`, `align-items` and friends while
   explaining why they are gone; a comment that documents the refusal must
   not trip the check that forbids it. */
const code = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const cssNoComments = (css + '\n' + siteCss).replace(/\/\*[\s\S]*?\*\//g, '');

function rule(src, sel) {
  const m = src.match(new RegExp('\\' + sel + '\\s*\\{[^}]*\\}'));
  return m ? m[0].replace(/\/\*[\s\S]*?\*\//g, '') : '';
}
const panel = rule(css, '.cert-panel');
const dialog = rule(css, '.cert-dialog');
const frame = rule(css, '.cert-frame');
const body = rule(css, '.detail-body');
const foot = rule(css, '.cert-foot');
const media = rule(css, '.detail-media');

/* the details builder, and the three lines whose ORDER is the whole
   scroll-reset contract */
const detailFn = (code.match(/function openDetails\(rec\)[\s\S]*?\n  \}/) || [''])[0];
const iReset = detailFn.indexOf('frame.scrollTop = 0');
const iMount = detailFn.lastIndexOf('frame.appendChild(');
const iShow = detailFn.indexOf('showModal(');

let failed = 0;
function check(name, ok, detail) {
  process.stdout.write((ok ? '  ok  ' : '  FAIL') + ' ' + name + (detail ? ' — ' + detail : '') + '\n');
  if (!ok) failed++;
}

console.log('— the three rows —');
check('1. the panel is three rows: header · content · footer',
  /display:\s*grid/.test(panel) && /grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto/.test(panel),
  'auto · minmax(0,1fr) · auto, or the clamp never engages and the content decides the height');
check('1b. the panel is BOUNDED, and the bound has a fallback',
  /max-height:\s*92vh/.test(panel) && /max-height:\s*92svh/.test(panel) &&
  /max-height:\s*92vh/.test(dialog) && /max-height:\s*92svh/.test(dialog),
  'without a bound the panel grows to its content and the footer falls below the fold');
check('1c. the JS builds header, then frame, then footer, in that order',
  (() => {
    /* the shell is one markup string, not three createElement calls */
    const a = code.indexOf('<header class="cert-head">');
    const b = code.indexOf('<div class="cert-frame">');
    const c = code.indexOf('<footer class="cert-foot">');
    return a !== -1 && b !== -1 && c !== -1 && a < b && b < c;
  })(),
  'header · frame · footer is also the grid order; reversed, the middle row would frame the actions');
check('1d. the panel does not switch the default stretch off',
  !/align-items:/.test(panel) && !/align-content:/.test(panel),
  'an align-items here would un-stretch the middle row and the bounded height would be lost');

console.log('\n— the scroll container —');
check('2. the scroll container has no automatic minimum',
  /min-height:\s*0/.test(body),
  'minmax(0,…) on the row is only half the contract; the item needs min-height:0 too');
check('3. the scroll container scrolls vertically, and only vertically',
  /overflow-y:\s*auto/.test(body) && /overflow-x:\s*hidden/.test(body));
check('3b. the bounded height comes from the LAYOUT, not from a percentage',
  !/height:\s*100%/.test(body) && !/min-height:\s*100%/.test(body) && !/block-size:\s*100%/.test(body) &&
  !/height:\s*100vh/.test(body),
  'a percentage against the panel\'s indefinite height resolves to auto — the box then runs past its row and paints under the footer');
check('3c. the container is told to track the gesture, not animate toward it',
  /scroll-behavior:\s*auto/.test(body) && /scroll-behavior:\s*smooth/.test(siteCss),
  'the page keeps smooth anchor links; the dialog is direct manipulation');
check('3d. the gesture is not chained out of the dialog to the page behind it',
  /overscroll-behavior:\s*contain/.test(body));

console.log('\n— the footer —');
check('4. the footer is NOT absolute',
  !/position:\s*absolute/.test(foot) && !/inset(-inline)?-(start|end|top|bottom)/.test(foot),
  'an overlaying footer is the defect being fixed, not a style to keep');
check('5. the footer is NOT fixed',
  !/position:\s*fixed/.test(foot) && !/position:\s*sticky/.test(foot));
check('5b. the footer occupies its own grid row, and JS never moves it',
  !/style\.(position|top|transform|inset)/.test(code.match(/function buildViewer[\s\S]*?\n  \}/)?.[0] || ''),
  'the footer\'s placement is the stylesheet\'s job alone');
check('5c. the footer background is opaque enough that content cannot read through it',
  !/rgba\([^)]*,\s*0?\.\d+\s*\)/.test(foot.match(/background:[^;]+/)?.[0] || 'x') ||
  (() => { const m = foot.match(/background:\s*rgba\([^)]*?,\s*([\d.]+)\s*\)/); return m && parseFloat(m[1]) >= 0.9; })(),
  'a translucent bar over a scrolling column is what made this read as "content under the footer"');

console.log('\n— exactly one scroll container —');
check('6. there is EXACTLY ONE vertical scroller in the whole site',
  (cssNoComments.match(/overflow-y:\s*auto\s*;/g) || []).length === 1 &&
  !/overflow-y:\s*scroll/.test(cssNoComments),
  'one scroller, and `auto` so a record that fits shows no scrollbar at all');
check('7. nothing NESTED inside the details scrolls',
  !/overflow(-y|-x)?:\s*(auto|scroll)/.test(media) &&
  !/overflow(-y|-x)?:\s*(auto|scroll)/.test(frame) &&
  !/\.detail-section[^{]*\{[^}]*overflow(-y|-x)?:\s*(auto|scroll)/.test(cssNoComments),
  'a nested scroller is a second scrollbar, and the wheel has to choose between them');
check('7b. the scrollbar treatment is the existing one, reused — not a second system',
  /html,\s*\.detail-body\s*\{[^}]*scrollbar-color/.test(siteCss) &&
  /html::-webkit-scrollbar,\s*\.detail-body::-webkit-scrollbar\s*\{/.test(siteCss) &&
  /* scoped to BOTH stylesheets, and after removing the one shared rule the
     page and the panel legitimately share: a second rule elsewhere that
     restyles the details scrollbar on its own is a second system */
  !/detail-body::-webkit-scrollbar\s*\{/.test(
    (css + '\n' + siteCss).replace(/html::-webkit-scrollbar,\s*\.detail-body::-webkit-scrollbar\s*\{/, '')),
  'the details panel styles the page\'s scrollbar, on the same selector list');

console.log('\n— the reset, and only the reset —');
check('8. the scroll reset exists EXACTLY ONCE in the whole file',
  (code.match(/scrollTop\s*=\s*0/g) || []).length === 1,
  'two resets means one of them is compensating for the other');
check('9. the reset happens AFTER the content is mounted',
  iReset !== -1 && iMount !== -1 && iReset > iMount,
  'mount first, then reset — a reset before the mount resets nothing');
check('10. the reset happens AFTER the dialog is shown, in the same task',
  iReset !== -1 && iShow !== -1 && iReset > iShow &&
  !/setTimeout|requestAnimationFrame/.test(detailFn),
  'a closed <dialog> is display:none, so its frame has no scrolling box and the assignment is discarded; showModal then RE-APPLIES the old offset. Resetting straight after showModal is still before any paint');
/* THE ONE THAT WAS MISSING, and the reason the real bug reached a visitor.
   "No wheel listener was added for the details" was asserted by reading
   `openDetails` alone. That is TRUE and useless: the listener that stopped
   the wheel is not in `openDetails`, it is in `wireZoom`, wired to
   `.cert-frame` ONCE at build time — and the details RELABEL that same
   element `cert-frame detail-body` and make it the scrolling column. One
   element, two jobs, one listener, never re-wired. So the question is not
   "is there a wheel listener" but "can the one that exists cancel a wheel
   it has no use for", and that is a question about the ORDER of two
   statements inside one handler. A file containing both statements passes
   either way, so the order is what gets read. */
const wheelFn = (code.match(/stage\.addEventListener\('wheel'[\s\S]*?\}\s*,\s*\{\s*passive:\s*false\s*\}\s*\)/) || [''])[0];
check('11. nothing can cancel the details wheel: the scroller IS the zoomer\'s stage, and the zoomer guards before it cancels',
  /var stage = d\.querySelector\('\.cert-frame'\)/.test(code) &&
  /frame\.className = 'cert-frame detail-body'/.test(code) &&
  (code.match(/addEventListener\('wheel'/g) || []).length === 1 &&
  wheelFn.length > 0 &&
  /if \(!img\(\)\) return;/.test(wheelFn) &&
  wheelFn.indexOf('if (!img()) return;') < wheelFn.indexOf('e.preventDefault()'),
  'the stage is the element the details relabel into the scroller, and the only wheel listener returns before it cancels — so a wheel with no image to zoom scrolls the column natively');
check('12. no scroll listener was added for the details',
  !/addEventListener\('scroll'/.test(detailFn) && !/onscroll/.test(detailFn));
check('13. no rAF was added for the details',
  !/requestAnimationFrame/.test(detailFn));
check('14. no setTimeout was added for the details',
  !/setTimeout/.test(detailFn) && !/setInterval/.test(detailFn));
check('15. the bottom spacing is a token, not a padding that hides a defect',
  (() => {
    const p = body.match(/padding(?:-block-end|-bottom)?:\s*([^;]+)/)?.[1] || '';
    const ends = p.split(/\s+/).pop();
    return !/^\d{2,4}px$/.test(ends) || parseFloat(ends) < 100;
  })(),
  'the gap belongs to the layout; padding exists to keep the last item off the footer, not to cover a footer that overlays');
check('15b. the details never scrolls the PAGE to fake its own scroll',
  !/window\.scrollTo/.test(detailFn) && !/document\.documentElement\.scroll/.test(detailFn) &&
  !/scrollIntoView/.test(detailFn));

process.stdout.write(failed
  ? '\ndetails-scroll-audit FAILED (' + failed + ')\n'
  : '\ndetails-scroll-audit passed\n');
process.exitCode = failed ? 1 : 0;
