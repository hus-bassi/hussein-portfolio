/* ============================================================
   SELFTEST: prove the new details-media assertions can FAIL.

   A check that cannot fail is worse than no check. Each case below breaks
   ONE thing the way the real bug broke it, and the audit must notice.

   Run: node tools/details-media-selftest.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const JS = path.join(root, 'assets', 'js', 'records.js');
const CSS = path.join(root, 'assets', 'css', 'records.css');
const AUDIT = path.join(root, 'tools', 'card-layout-audit.js');

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
  fs.writeFileSync(JS, js0.replace(re, rep));
  try { fn(); } finally { fs.writeFileSync(JS, js0); }
}
function withCss(re, rep, fn) {
  fs.writeFileSync(CSS, css0.replace(re, rep));
  try { fn(); } finally { fs.writeFileSync(CSS, css0); }
}
function caught(needle, out) {
  return out.includes(needle);
}

/* 0. the baseline must be GREEN, or every case below proves nothing */
check('the real files pass the audit before anything is broken', audit() === '');

console.log('\n— the bug this file exists for —');
/* 1. THE ACTUAL DEFECT: the media frame is the grid item again, so
      `overflow: hidden` makes it a scroll container and its row collapses
      to a zero minimum. Structurally identical to the real regression. */
withJs(/var region = el\('div', 'detail-media'\);[\s\S]*?region\.appendChild\(mediaFrame\(rec, media\)\);\n      frame\.appendChild\(region\);/,
  'frame.appendChild(mediaFrame(rec, media));',
  () => check('caught: the media frame mounted as the grid item (the 0px row)', caught('primary media region', audit())));

/* 2. and the CSS half of it: an overflow on the region */
withCss(/(\.detail-media \{[\s\S]*?)(\n\})/, '$1\n  overflow: hidden;$2',
  () => check('caught: overflow on the media region', caught('PLAIN block', audit())));

/* 3. the stretch that came back with it */
withCss(/(\.detail-media \{[\s\S]*?)(\n\})/, '$1\n  min-height: 100%;$2',
  () => check('caught: min-height:100% back in the media region', caught('does NOT stretch the column', audit())));

withCss(/(\.detail-media \{[\s\S]*?)(\n\})/, '$1\n  margin-top: auto;$2',
  () => check('caught: margin-top:auto back in the media region', caught('does NOT stretch the column', audit())));

console.log('\n— the media budget —');
/* 4. an unbounded image: the old dead-space bug in a new coat.
      GLOBAL, because the ceiling is stated on both the mount and the file
      and removing only one of them is half the regression. */
withCss(/max-height:\s*min\(42svh,\s*460px\);/g, 'max-height: none;',
  () => check('caught: an unbounded media height', caught('bounded by a RESPONSIVE budget', audit())));

withCss(/max-width:\s*min\(100%,\s*760px\)/, 'max-width: 100%',
  () => check('caught: a width with no 760px ceiling', caught('bounded by a RESPONSIVE budget', audit())));

/* 5. the aspect ratio: stretching or cropping a certificate.
      Scoped to the .detail-media rule — the CARD's `.record-shot img` has
      the same declaration and must not be the one that gets edited. */
withCss(/(\.detail-media img,[\s\S]*?\{[^}]*?)width:\s*auto;\s*height:\s*auto;/, '$1width: 100%; height: 100%;',
  () => check('caught: the file stretched to fill the box', caught('keeps its own aspect ratio', audit())));

withCss(/(\.detail-media img,[\s\S]*?\{[^}]*?)object-fit:\s*contain;/, '$1object-fit: cover;',
  () => check('caught: object-fit:cover cropping the certificate', caught('keeps its own aspect ratio', audit())));

withCss(/(\.detail-media img,[\s\S]*?\{[\s\S]*?)(\n\})/, '$1\n  aspect-ratio: 16 / 9;$2',
  () => check('caught: a forced aspect-ratio on the certificate', caught('keeps its own aspect ratio', audit())));

/* 6. a filter or a tint over the document */
withCss(/(\.detail-media img,[\s\S]*?\{[\s\S]*?)(\n\})/, '$1\n  filter: invert(1);$2',
  () => check('caught: a filter over the certificate', caught('reused verbatim', audit())));

console.log('\n— centring, in every language —');
/* the file is CRLF, so a `;\n` anchor silently matches nothing */
withCss(/\s*justify-self:\s*center;\r?\n/, '\n',
  () => check('caught: the media no longer centred', caught('centred without physical left/right', audit())));

withCss(/(\.detail-media \{[\s\S]*?)(\n\})/, '$1\n  left: 50%;$2',
  () => check('caught: physical left/right positioning', caught('centred without physical left/right', audit())));

console.log('\n— one recipe, not a certificate-only path —');
/* 7. a second .detail-media rule, which is how a recipe forks */
withCss(/(\.detail-media \{[\s\S]*?\n\})/, '$1\n.detail-media { justify-content: flex-start; }',
  () => check('caught: a second .detail-media rule (a forked recipe)', caught('ONE recipe', audit())));

/* 8. a record-specific rule, the thing that makes one certificate special */
withCss(/(\.detail-media \{)/, '.detail-media.is-datacamp { max-width: 400px; }\n$1',
  () => check('caught: a record-specific rule in the stylesheet', caught('ONE recipe', audit())));

/* 9. dropping the other three media kinds off the recipe */
withCss(/\.detail-media > \.record-shot\.is-video,[\s\S]*?\.detail-media > \.record-shot\.is-none \{[\s\S]*?\n\}/, '',
  () => check('caught: the video/document/none states dropped from the recipe', caught('ONE recipe', audit())));

console.log('\n— the click opens a viewer, it does not download —');
/* 10. a preview that downloads instead of opening the viewer */
withJs(/btn\.addEventListener\('click', function \(\) \{ openMedia\(rec, openable\); \}\);/,
  "btn.addEventListener('click', function () { var a = document.createElement('a'); a.href = openable.src; a.download = ''; a.click(); });",
  () => check('caught: a media click that downloads', caught('never downloads', audit())));

/* 11. a second dialog for the details media */
withJs(/region\.appendChild\(mediaFrame\(rec, media\)\);/,
  "region.appendChild(mediaFrame(rec, media)); var d2 = document.createElement('dialog'); region.appendChild(d2);",
  () => check('caught: a second dialog in the details', caught('EXISTING image viewer', audit())));

/* 12. a placeholder region for a record with no media at all */
withJs(/if \(media\.kind === 'image' \|\| media\.kind === 'video' \|\| media\.kind === 'document'\) \{/,
  'if (true) {',
  () => check('caught: a media region for a record with no media', caught('NO media gets no region', audit())));

/* 13. a second resolver, which is how media-path logic gets duplicated */
withJs(/function resolveRecordMedia\(rec\) \{/,
  'function resolveRecordMedia2(rec) { return resolveRecordMedia(rec); }\nfunction resolveRecordMedia(rec) {',
  () => check('caught: a duplicated media resolver', caught('not a second one', audit())));

/* 14. a frame builder of its own, the other half of duplication */
withJs(/function mediaFrame\(rec, m\) \{/,
  'function mediaFrame2(rec, m) { return mediaFrame(rec, m); }\nfunction mediaFrame(rec, m) {',
  () => check('caught: a duplicated media-frame builder', caught('not a second one', audit())));

console.log('\n— the scroll reset must survive all of this —');
/* 15. the reset deleted outright: the record then opens wherever the last
      one left it, which is the regression this line exists to prevent */
withJs(/\s*frame\.scrollTop = 0;\r?\n/, '\n',
  () => check('caught: the details scroll reset removed', caught('resets the container itself', audit())));

/* the reset moved to the very TOP, before any content is appended.
      Surgical rather than a whole-file regex: the swap is done on the
      substring that runs from the cleared frame to the reset itself, so
      the statement really does end up above the content mount instead of
      being duplicated somewhere the function does not own. */
withJs(/frame\.innerHTML = '';[\s\S]*?\n(\s*)frame\.scrollTop = 0;/,
  (m, indent) => indent + 'frame.scrollTop = 0;\n\n    ' + m.replace(/\n[ \t]*frame\.scrollTop = 0;\s*$/, ''),
  () => check('caught: the reset moved BEFORE the content is mounted', caught('resets the container itself', audit())));

/* and after showModal, which paints the old position first */
withJs(/frame\.scrollTop = 0;\r?\n\r?\n(\s*)if \(typeof viewer\.showModal === 'function'\) viewer\.showModal\(\);\r?\n(\s*)else/,
  "if (typeof viewer.showModal === 'function') viewer.showModal();\n$1frame.scrollTop = 0;\n$2else",
  () => check('caught: the reset moved AFTER showModal', caught('resets the container itself', audit())));

/* a delayed or animated reset, which was refused for a reason */
withJs(/frame\.scrollTop = 0;/, 'setTimeout(function () { frame.scrollTop = 0; }, 50);',
  () => check('caught: a DEFERRED scroll reset', caught('never animated or deferred', audit())));

withJs(/frame\.scrollTop = 0;/, "frame.scrollTo({ top: 0, behavior: 'smooth' });",
  () => check('caught: a smooth-scroll reset', caught('never animated or deferred', audit())));

console.log('\n— no new machinery —');
withJs(/(var region = el\('div', 'detail-media'\);[\s\S]*?)frame\.appendChild\(region\);/,
  '$1var io = new IntersectionObserver(function () {}); frame.appendChild(region);',
  () => check('caught: an observer added for the media', caught('no animation loop, observer or scroll listener', audit())));

withJs(/(var region = el\('div', 'detail-media'\);[\s\S]*?)frame\.appendChild\(region\);/,
  "$1frame.addEventListener('scroll', function () {}); frame.appendChild(region);",
  () => check('caught: a scroll listener added for the media', caught('no animation loop, observer or scroll listener', audit())));

console.log('\n— the gallery keeps its own name —');
withJs(/var fig = el\('figure'\);/, "var fig = el('figure', 'detail-shot');",
  () => check('caught: the gallery borrowing the primary-media class', caught('gallery no longer borrows', audit())));

/* 16. the media pushed below the overview, which is the reported symptom */
withJs(/([\s\S]*?)(var region = el\('div', 'detail-media'\);[\s\S]*?frame\.appendChild\(region\);\n)([\s\S]*?)(s = section\(t\('rec\.d\.overview'\))/,
  '$1$3$4$2',
  () => check('caught: the media mounted AFTER the overview', caught('FIRST thing mounted', audit())));

console.log('\n— closing the viewer must come back to the details —');
/* the regression that was actually there: the certificate at the top of the
   details is a route into the viewer, and closing it dropped the visitor on
   the records list with the answer to their own question thrown away */
withJs(/    viewer\.close\(\);\n    openDetails\(back\);/, '    viewer.close();',
  () => check('caught: closing the viewer does NOT return to the details', caught('returns to the details it was opened from', audit())));

withJs(/\[data-close\]'\)\.addEventListener\('click', function \(\) \{ closeViewer\(\); \}\)/,
  "[data-close]').addEventListener('click', function () { d.close(); })",
  () => check('caught: the close button bypasses the routing', caught('all three ways out', audit())));

withJs(/d\.addEventListener\('click', function \(e\) \{ if \(e\.target === d\) closeViewer\(\); \}\)/,
  "d.addEventListener('click', function (e) { if (e.target === d) d.close(); })",
  () => check('caught: the backdrop bypasses the routing', caught('all three ways out', audit())));

withJs(/d\.addEventListener\('cancel',[\s\S]*?closeViewer\(\);\n    \}\);/, '',
  () => check('caught: Escape no longer routes through the return', caught('all three ways out', audit())));

/* the return has to close before it re-renders: showModal() on a dialog that
   is already open throws, and that would take the details down with it */
withJs(/    viewer\.close\(\);\n    openDetails\(back\);/, '    openDetails(back);\n    viewer.close();',
  () => check('caught: the details re-rendered before the dialog was closed', caught('returns to the details it was opened from', audit())));

/* a route set unconditionally would drag a card-opened viewer back into some
   record's details, which is not where the visitor was */
withJs(/returnTo = viewer\.open && viewer\.classList\.contains\('is-details'\) \? rec : null;/, 'returnTo = rec;',
  () => check('caught: the return route set without asking which mode was open', caught('cleared by the details', audit())));

/* and asking the class ALONE is the same bug wearing a hat: a card thumbnail
   opens the viewer while the dialog is closed, and `is-details` is still on
   the element from the last details view, so the card viewer inherits a
   return to a details that was never on screen and refuses to close */
withJs(/returnTo = viewer\.open && viewer\.classList\.contains\('is-details'\) \? rec : null;/,
  "returnTo = viewer.classList.contains('is-details') ? rec : null;",
  () => check('caught: the return route asked the stale class, not what was on screen', caught('asked of `open`', audit())));

/* and if the details do not clear it, the return never terminates */
withJs(/(function openDetails\(rec\) \{\n    if \(!viewer\) viewer = buildViewer\(\);\n)([\s\S]*?)returnTo = null;\n/, '$1$2',
  () => check('caught: the details never clears the return route', caught('cleared by the details', audit())));

/* a return that smuggles in its own scroll position, a second dialog, or history */
withJs(/(function closeViewer\(\) \{\n    var back = returnTo;)/, '$1\n    viewer.scrollTop = 0;',
  () => check('caught: the return writes a scroll position of its own', caught('scroll reset included', audit())));

withJs(/function closeViewer\(\) \{\n    var back = returnTo;/,
  "function closeViewer() {\n    var back = returnTo; var d2 = document.createElement('dialog');",
  () => check('caught: a second dialog built by the return', caught('no second dialog', audit())));

withJs(/function closeViewer\(\) \{\n    var back = returnTo;/,
  "function closeViewer() {\n    var back = returnTo; history.pushState({}, '', '#x');",
  () => check('caught: the return pushing a history entry', caught('no second dialog', audit())));

/* the baseline must still be green after all that churn */
check('the files are back to green after every case ran', audit() === '');

process.stdout.write(failed ? '\ndetails-media-selftest FAILED (' + failed + ')\n' : '\ndetails-media-selftest passed\n');
process.exitCode = failed ? 1 : 0;
