/* ============================================================
   Card-layout audit.  node tools/card-layout-audit.js

   eyebrow -> title -> meta -> description -> actions directly beneath them, with the
   facts (duration, credential) shown only in the DETAILS view - with no
   record-specific hacks, no
   invented fields, no absolute-positioned buttons, no arbitrary
   min-heights, no physical left/right, and no new animation machinery.

   WHAT CHANGED, AND WHY IT MATTERS. An earlier version of this file
   asserted the OPPOSITE: that the info column is a stretched flex column
   with the action row resting at `margin-top: auto`. That produced a large
   dead area under a tall portrait certificate — the text column was forced
   to the media's height, and the buttons were then pushed to the far end of
   it. Those two assertions now test the composition instead: the column
   takes its own height, the buttons follow the facts they belong to, and
   the media preview is bounded by a responsive ceiling rather than being
   allowed to decide the height of the card.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'assets', 'js', 'records.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets', 'css', 'records.css'), 'utf8');
/* assertions run against CODE, never against prose: several of these rules
   are things a comment is allowed to SAY (a comment that names the thing it
   refuses to do must not trip the check that forbids it) */
const code = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const certData = fs.readFileSync(path.join(root, 'academic', 'data', 'certificates.js'), 'utf8');
/* the site-wide stylesheet, for the things that are site-wide: the scrollbar
   treatment and its tokens live in site.css because they style the PAGE's
   scrollbar too, not only the dialog's */
const siteCss = fs.readFileSync(path.join(root, 'assets', 'css', 'site.css'), 'utf8');
const allCss = css + '\n' + siteCss;
const allCssNoComments = allCss.replace(/\/\*[\s\S]*?\*\//g, '');
/* the details builder, for the checks that need to know what it renders */
const detailFn = (code.match(/function openDetails\(rec\)[\s\S]*?\n  \}/) || [''])[0];

let failed = 0;
function check(name, ok, detail) {
  process.stdout.write((ok ? '  ok  ' : '  FAIL') + ' ' + name + (detail ? ' — ' + detail : '') + '\n');
  if (!ok) failed++;
}

/* the builder emits its own comment so the literals can be found honestly */
const nodeFn = (js.match(/function recordNode\(rec, qWords\)[\s\S]*?return li;\s*\}/) || [''])[0];
const nodeCode = nodeFn.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const nodeBlock = (js.match(/One card recipe for every record[\s\S]*?function factNode/) || [''])[0];

/* 1. the five editorial groups, in order, from one generic builder.
      The facts are NOT among them: duration and the credential number moved
      to the details view, because a card answers "what is this?" and a
      credential number answers "exactly what is it?". */
const order = ['record-eyebrow', 'record-title', 'record-meta', 'record-text', 'record-actions']
  .map(function (c) { return nodeCode.indexOf("'" + c + "'"); });
check('recordNode builds eyebrow → title → meta → text → actions in order',
  order.every(function (i) { return i !== -1; }) && order.slice().sort(function (a, b) { return a - b; }).join() === order.join());
check('the CARD renders no facts block at all (no empty row left behind)',
  !/record-facts/.test(nodeCode) && !/record-facts/.test(js) &&
  !/\.record-facts/.test(css) && !/record-fact'/.test(nodeCode),
  'the facts belong to the details view; their wrapper must not survive on the card');
check('the DATA still carries duration and credentialId',
  /duration:\s*\{/.test(certData) && /credentialId:\s*'#/.test(certData));
check('the details view can still render both',
  /addFact\(h, t\('rec\.duration'\), rec\.duration/.test(detailFn) &&
  /addFact\(h, t\('rec\.credential'\), rec\.credentialId/.test(detailFn));
check('details facts use ONLY duration + credentialId (no invented fields)',
  /rec\.duration/.test(detailFn) && /rec\.credentialId/.test(detailFn) &&
  !/factNode\(t\('rec\.(provider|date|category|title|body)'/.test(detailFn));
check('facts and actions are conditional (missing data leaves no UI)',
  /addFact\(h, t\('rec\.duration'\), rec\.duration/.test(detailFn) &&
  /hasAction/.test(nodeCode) && !/['"]N\/A['"]/.test(nodeFn));
check('no record-specific branches (datacamp/elements/first-aid/russian/chess) in the builder',
  !/datacamp|elements-of-ai|first-aid|russian|chess/i.test(nodeBlock.match(/function recordNode[\s\S]*?return li;/)?.[0] || 'x'));

/* 2. the CSS recipe: the column takes its own height, the media is bounded,
      and nothing is ever positioned to fill a space it does not have */
const bodyRule = (css.match(/\.record-body\s*\{[^}]*\}/) || [''])[0];
const actionsRule = (css.match(/\.record-actions\s*\{[^}]*\}/) || [''])[0];
const hasMediaRule = (css.match(/\.record\.has-media\s*\{[^}]*\}/) || [''])[0];
const shotRule = (css.match(/\.record-shot\s*\{[^}]*\}/) || [''])[0];
const shotImgRule = (css.match(/\.record-shot\s+img\s*\{[^}]*\}/) || [''])[0];
check('.record-body is a flex column that takes its OWN height',
  /display:\s*flex/.test(bodyRule) && /flex-direction:\s*column/.test(bodyRule) &&
  !/align-self:\s*stretch/.test(bodyRule) && !/min-height:\s*100%/.test(bodyRule),
  /align-self:\s*stretch/.test(bodyRule) || /min-height:\s*100%/.test(bodyRule) ? 'it still stretches to the media height' : '');
check('.record-actions follows the content (a fixed gap above it, never auto)',
  !/margin-(block-start|top):\s*auto/.test(actionsRule) && /margin-block-start:\s*var\(--s-4\)/.test(actionsRule));
check('the media column is a bounded budget, not a fixed width',
  /grid-template-columns:\s*minmax\(/.test(hasMediaRule), hasMediaRule.slice(0, 60));
check('the media has a RESPONSIVE height ceiling (on the media, not the box)',
  /max-height:\s*clamp\(/.test(shotRule + shotImgRule),
  'without a ceiling a portrait scan decides the card height');
check('the mount hugs its media (no fixed column of empty mat beside it)',
  /width:\s*fit-content/.test(shotRule), 'a fixed media width pads a portrait preview with empty space');
check('the preview contains its media (a certificate is never cropped)',
  /object-fit:\s*contain/.test(shotImgRule));
check('no absolute-positioned .record-action buttons', !/\.record-action[^{]*\{[^}]*position:\s*absolute/.test(css));
check('no artificial card min-height (any 300px-style filler)', !/\.record[^{]*\{[^}]*min-height:\s*[3-9]\d\dpx/.test(css));
check('action gap is 10–14px (var(--s-3) = 12px)', /gap:\s*var\(--s-3\)/.test(actionsRule));
check('no new animation machinery for the layout (no rAF/observer in builder)', !/requestAnimationFrame|IntersectionObserver|new MutationObserver/.test(nodeCode));

/* 3. responsive + RTL: logical properties, stacked mobile actions, no horizontal leak */
const cardCss = css;
check('no physical left/right margins in the card layout', !/\.record[^{]*\{[^}]*(margin-left|margin-right)\s*:/.test(cardCss));
check('mobile stacks media over text and lets actions wrap', /max-width:\s*760px[\s\S]*?\.record\.has-media\s*\{[^}]*grid-template-columns:\s*1fr/.test(cardCss));
check('the facts divider is a hairline, not a box (no fill/glow/radius on .detail-facts)',
  /border-block-start:\s*1px solid/.test(css.match(/\.detail-facts\s*\{[^}]*\}/)?.[0] || '') &&
  !/background|box-shadow|border-radius/.test(css.match(/\.detail-facts\s*\{[^}]*\}/)?.[0] || ''));

/* 4. the classes the builder emits all exist in the stylesheet */
['record-eyebrow', 'record-title', 'record-meta', 'record-text', 'record-fact', 'record-fact-k', 'record-fact-v', 'record-actions', 'detail-facts'].forEach(function (c) {
  check('.' + c + ' exists in records.css', new RegExp('\\.' + c + '(?![\\w-])').test(css));
});

/* 5. THE CARD IS A PREVIEW; THE DETAILS VIEW IS THE RECORD.
   A card that grew to hold a course description would put the empty-space
   problem straight back, so the information has somewhere else to go — and
   that somewhere has to be reachable by keyboard, must not steal a click
   from the controls inside the card, and must not invent anything. */
check('the title is a real <button> — the keyboard route to the details',
  /el\('h3', 'record-title'\)[\s\S]{0,220}el\('button', 'record-open'/.test(nodeCode) &&
  /aria-haspopup/.test(nodeCode) && !/<li[^>]*onclick/.test(js));
check('the whole-card click yields to every nested control',
  /closest\('a, button, input, select, textarea, video, iframe'\)/.test(nodeCode));
check('the details body is built on request, not on page load',
  /function openDetails/.test(js) && !/detail-body/.test(nodeCode) &&
  (js.match(/openDetails\(rec\)/g) || []).length <= 3,
  'only the two click routes and the function itself may call it');
check('the title button carries its own route to the details',
  /el\('button', 'record-open'[\s\S]{0,300}openDetails\(rec\)/.test(nodeCode),
  'the card guard ignores buttons, so the title must handle itself');
check('the details view is a MODE of the existing dialog, not a second one',
  /viewer\.classList\.add\('is-details'\)/.test(detailFn) && !/createElement\('dialog'\)/.test(detailFn));
check('every details section is conditional (a section with no data does not exist)',
  /function section\(title, build\)/.test(js) &&
  /return 0/.test(js.slice(js.indexOf('function section(title, build)'), js.indexOf('function openMedia'))));
check('no empty-state words anywhere in the details builder',
  !/N\/A|Not available|Unknown|TBD/.test(detailFn), 'a missing field must render nothing, not a placeholder');
check('details carry no career or outcome claim the data does not make',
  !/learningOutcome|certified|professional certification/i.test(code + detailFn),
  'a course completion is not a certification and never becomes one in prose either');
check('the details model reads only existing fields plus one optional block',
  /tv\(c\.description\)|tv\(e\.whatIDid\)|tv\(e\.whatILearned\)/.test(js) &&
  /c\.details \|\| \{\}/.test(js));
check('details are NOT in the search index',
  !/allLangs\((c|e)\.details\)/.test(js), 'adding them to the index would be a deliberate choice, not an accident');
check('the details actions reuse the same media paths as the card',
  /openMedia\(rec, \{ kind: 'document'/.test(detailFn) &&
  /openMedia\(rec, \{ kind: 'image'/.test(detailFn) &&
  /openMedia\(rec, \{ kind: 'video'/.test(detailFn));
check('the image viewer still has its own zoom machinery (details are not zoomable)',
  /d\.resetZoom = function/.test(js) && /data-zoom/.test(js) && !/data-zoom/.test(css));
check('no new animation machinery for the details view',
  !/requestAnimationFrame|IntersectionObserver|MutationObserver/.test(detailFn));
check('the details view has styles of its own and reuses the tokens',
  ['detail-body', 'detail-h', 'detail-text', 'detail-list', 'detail-chapters', 'detail-actions', 'is-details']
    .every(function (c) { return new RegExp('\\.' + c.replace('is-', '\\.'), '').test(css) || css.indexOf(c) > -1; }));

/* 5b. THE PRIMARY MEDIA IN THE DETAILS.
   The details view already called the shared resolver and the shared
   `mediaFrame`, so a certificate image was never MISSING from the DOM — it
   was mounted at 0px tall and clipped out of sight. `.record-shot` carries
   `overflow: hidden` to clip a certificate to its radius, which makes it a
   scroll container, and a scroll container contributes a minimum size of
   ZERO to its grid row. The details column is a grid, so the media was an
   `auto` row sized from that zero, and it only stayed zero while the column
   had no free space — which is why exactly one record lost its certificate:
   DataCamp, the only one whose details fill the panel. These assertions
   exist so the reason cannot come back quietly. */
const mediaRule = css.match(/\.detail-media\s*\{[^}]*\}/)?.[0] || '';
const mediaMountRule = css.match(/\.detail-media > \.record-shot\s*\{[^}]*\}/)?.[0] || '';
const mediaImgRule = css.match(/\.detail-media img,[\s\S]*?\{[^}]*\}/)?.[0] || '';
check('the details has a primary media region',
  /el\('div', 'detail-media'\)/.test(detailFn) && /\.detail-media\s*\{/.test(allCssNoComments));
check('the media region reuses the shared resolver, and is not a second one',
  /var media = resolveRecordMedia\(rec\)/.test(detailFn) &&
  /mediaFrame\(rec, media\)/.test(detailFn) &&
  (code.match(/function resolveRecordMedia/g) || []).length === 1 &&
  (code.match(/function mediaFrame/g) || []).length === 1,
  'one resolver, one frame builder — the details calls them, it does not re-derive media');
check('the media region is a PLAIN block, so its grid row is sized by the media',
  /display:\s*grid/.test(mediaRule) && !/overflow/.test(mediaRule),
  'no overflow on the region: a scroll container contributes a minimum size of zero, which is the whole bug');
check('the media is the FIRST thing mounted in the details, right after the header is cleared',
  detailFn.indexOf("el('div', 'detail-media')") < detailFn.indexOf("section(t('rec.d.overview')"),
  'header, then the certificate, then the overview — not the certificate after four sections');
check('the existing image is reused verbatim: no crop, no tint, no filter, no generated preview',
  /img\.src = m\.src/.test(code) && !/filter:|mix-blend|object-position:\s*(?!center)/.test(allCssNoComments.match(/\.detail-media[\s\S]*?\n\}/g)?.join('') || ''));
check('the media keeps its own aspect ratio and is never stretched',
  /width:\s*auto;\s*height:\s*auto/.test(mediaImgRule) && /object-fit:\s*contain/.test(mediaImgRule) &&
  !/aspect-ratio/.test(mediaImgRule),
  'no forced ratio: a portrait certificate stays portrait, a landscape one stays landscape');
check('the media is bounded by a RESPONSIVE budget, not a fixed size',
  /max-width:\s*min\(100%,\s*760px\)/.test(mediaRule) && /min\(42svh/.test(mediaImgRule) &&
  /min\(42svh/.test(mediaMountRule),
  'min(100%, 760px) wide and a viewport-relative ceiling tall — on the FILE and on the mount');
check('the media region is centred without physical left/right',
  /place-items:\s*center/.test(mediaRule) && /justify-self:\s*center/.test(mediaRule) &&
  !/left:|right:/.test(mediaRule),
  'centred, so it is centred in Arabic and Russian too, for free');
check('the media is clickable and opens the EXISTING image viewer',
  /openMedia\(rec, openable\)/.test(code) &&
  /function openMedia/.test(code) && !/createElement\('dialog'\)/.test(detailFn),
  'one media route into the one dialog; the details add no viewer of their own');
check('a media click never downloads, and download stays an explicit action',
  !/download\s*=/.test(detailFn) && !/\.click\(\)/.test(detailFn) &&
  /rec\.viewImage/.test(detailFn) && /rec\.openCert/.test(detailFn),
  'the preview opens the viewer; the PDF is reached only through its own button');
check('the PDF is a SEPARATE action, not the preview',
  /openMedia\(rec, \{ kind: 'document', src: rec\.pdf \}\)/.test(detailFn) &&
  !/rec\.pdf.*img|img.*rec\.pdf/.test(code));
check('a record with NO media gets no region at all — no placeholder, no empty box',
  /media\.kind === 'image' \|\| media\.kind === 'video' \|\| media\.kind === 'document'/.test(detailFn) &&
  !/detail-media/.test(detailFn.replace(/el\('div', 'detail-media'\)[\s\S]*?frame\.appendChild\(region\)/, '')),
  'the region is built inside the kind test and nowhere else');
check('the media region does NOT stretch the column (the old dead-space bug, in a new coat)',
  !/min-height:\s*100%/.test(allCssNoComments.match(/\.detail-media[\s\S]*?\n\}/g)?.join('') || '') &&
  !/margin-top:\s*auto/.test(allCssNoComments.match(/\.detail-media[\s\S]*?\n\}/g)?.join('') || ''),
  'no min-height:100% and no margin-top:auto in the media region');
check('the media region adds no animation loop, observer or scroll listener',
  !/requestAnimationFrame|IntersectionObserver|MutationObserver|addEventListener\('scroll'|addEventListener\('wheel'/.test(
    (detailFn.match(/el\('div', 'detail-media'\)[\s\S]*?frame\.appendChild\(region\)/) || [''])[0]));
check('the details media rule is ONE recipe for all four media kinds',
  (allCssNoComments.match(/\.detail-media\s*\{/g) || []).length === 1 &&
  /\.detail-media > \.record-shot\.is-video,/.test(allCssNoComments) &&
  !/detail-media.*datacamp|detail-media.*first-aid|detail-media.*elements-of-ai/i.test(allCssNoComments),
  'no record-specific rules in the stylesheet');
check('the gallery no longer borrows the primary-media class name',
  !/detail-shot/.test(code) && !/detail-shot/.test(allCssNoComments),
  'the gallery has its own contact-sheet styles and its own name');

/* 5c. CLOSING THE VIEWER COMES BACK TO THE DETAILS.
   The certificate at the top of a record's details is a real route into the
   viewer, so closing it has to answer "was I right about this record?" — it
   puts the details back. The alternative, which is what it did, drops the
   visitor onto the records list with the dialog gone and the answer lost.
   This is a routing decision, so it lives in one function and all three exit
   routes — the button, the backdrop, and Escape — go through it. */
const closeFn = (code.match(/function closeViewer\(\)\s*\{[\s\S]*?\n  \}/) || [''])[0];
check('closing the viewer returns to the details it was opened from',
  /var back = returnTo;/.test(closeFn) && /openDetails\(back\)/.test(closeFn) &&
  /viewer\.close\(\);\s*\n\s*openDetails\(back\);/.test(closeFn),
  'close FIRST, then re-render: showModal() throws on a dialog that is already open');
/* Typed out rather than searched for loosely: the close BUTTON's own handler
   is named, because `closeViewer()` within a hundred characters of
   `[data-close]` is also true of the backdrop handler on the next line — the
   loose form let a button that called d.close() straight through. The
   selftest case for it is how that was found. */
check('all three ways out of the viewer ask the same question',
  /\[data-close\]'\)\.addEventListener\('click', function \(\) \{ closeViewer\(\); \}\)/.test(code) &&
  /e\.target === d\) closeViewer\(\)/.test(code) &&
  /addEventListener\('cancel'[\s\S]{0,200}closeViewer\(\)/.test(code),
  'the close button, the backdrop and Escape must not disagree');
check('Escape is left to the browser when there is nothing to go back to',
  /if \(!returnTo\) return;/.test(code) && /e\.preventDefault\(\);/.test(code),
  'no returnTo means the native close stands; preventDefault is only for the return path');
/* The clear is located INSIDE openDetails rather than counted across the
   file: `var returnTo = null;` and `returnTo = null;` inside closeViewer are
   two more occurrences, so a tally of two passed even with the details clear
   deleted — which is the mutation that makes the return loop forever. */
check('the return route is set from the details, and cleared by the details',
  /returnTo = viewer\.open && viewer\.classList\.contains\('is-details'\) \? rec : null;/.test(code) &&
  /function openDetails\(rec\) \{[\s\S]*?returnTo = null;/.test(code),
  'set from the mode that was ON SCREEN, cleared inside the details builder — so it terminates');
check('"was a details on screen?" is asked of `open`, not of the class alone',
  /viewer\.open && viewer\.classList\.contains/.test(code) &&
  !/returnTo = viewer\.classList\.contains\('is-details'\) \? rec : null;/.test(code),
  'a card opens the viewer while the dialog is closed and is-details is a leftover — the class alone is a lie');
check('the return path adds no history, no second dialog and no new machinery',
  !/history\.|pushState|replaceState/.test(code) && (code.match(/createElement\('dialog'\)/g) || []).length === 1 &&
  !/requestAnimationFrame|IntersectionObserver/.test(closeFn));
check('the return rebuilds the details through the same builder, scroll reset included',
  /openDetails\(back\)/.test(closeFn) && /frame\.scrollTop = 0;/.test(detailFn) &&
  !/scrollTop|scrollTo|scrollIntoView/.test(closeFn),
  'one builder, and the return itself writes no scroll position of its own');

/* 6. THE SCROLL ARCHITECTURE.
   The details panel had a flex column with a max-height and `min-height: 0`
   on the wrong element, so the box that scrolls was never the box that
   got the bounded height: the content ran past the frame, the panel's own
   `overflow: hidden` swallowed the rest, and a wheel over the details did
   nothing. A wheel that does nothing is not a scrollbar-design problem, so
   these are the rules that would have caught it. */
const panelRule = css.match(/\.cert-panel\s*\{[^}]*\}/)?.[0] || '';
const frameRule = css.match(/\.cert-frame\s*\{[^}]*\}/)?.[0] || '';
const bodyRule2 = css.match(/\.detail-body\s*\{[^}]*\}/)?.[0] || '';
check('the dialog is a bounded panel: three rows with a definite middle one',
  /grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto/.test(panelRule) &&
  /max-height:\s*92svh/.test(panelRule),
  'auto · minmax(0,1fr) · auto, or the clamp never engages');
check('the frame has no automatic minimum (minmax(0,…) exists for this)',
  !/flex:\s*1\b/.test(frameRule) && /min-height:\s*0/.test(frameRule));
check('EXACTLY ONE details scroll container, bounded by the row and not by a percentage',
  (() => {
    /* read the rule with its comment stripped: the comment above it NAMES
       `height: 100%` while explaining why it is gone, and a comment that
       documents the refusal must not trip the check that forbids it */
    const b = bodyRule2.replace(/\/\*[\s\S]*?\*\//g, '');
    return /min-height:\s*0/.test(b) && /overflow-y:\s*auto/.test(b) &&
      /overflow-x:\s*hidden/.test(b) && !/height:\s*100%/.test(b) &&
      (allCssNoComments.match(/overflow-y:\s*auto\s*;/g) || []).length === 1;
  })(),
  'minmax(0,1fr) + min-height:0 bounds it; a percentage would resolve to auto in the panel\'s indefinite height');
check('scroll chaining out of the details is contained',
  /overscroll-behavior:\s*contain/.test(bodyRule2));
check('the details scroll region is focusable and named',
  /frame\.tabIndex = 0/.test(js) && /aria-labelledby/.test(js) && /id="cert-viewer-title"/.test(js));
check('the media stage is NOT a scroll container (the image must not scroll)',
  !/overflow-y:\s*auto/.test(css.match(/\.cert-frame:has\([^)]*\)\s*\{[^}]*\}/)?.[0] || ''));
check('scrolling is native: the ONLY scroll offset written anywhere is the details reset',
  (code.match(/scrollTop\s*(\+|-)?=/g) || []).length === 1 &&
  /scrollTop\s*(\+|-)?=/.test(detailFn) &&
  !/scrollLeft\s*(\+|-)?=/.test(code) && !/requestAnimationFrame/.test(code),
  'one write, in openDetails, on the details container — nothing else scrolls anything');
check('the details open path resets the container itself, after mounting AND after showing',
  /frame\.scrollTop = 0/.test(detailFn) &&
  detailFn.indexOf('frame.scrollTop = 0') > detailFn.lastIndexOf('frame.appendChild') &&
  detailFn.indexOf('frame.scrollTop = 0') > detailFn.indexOf('showModal'),
  'mount, then showModal, then scrollTop = 0 — in the same task, before any paint. A reset placed BEFORE showModal is discarded: a closed <dialog> is display:none, so its frame has no scrolling box');
check('the details reset never touches the page, and is never animated or deferred',
  !/window\.scrollTo/.test(code) && !/document\.scroll/.test(code) &&
  !/behavior:\s*'smooth'/.test(detailFn) && !/scrollIntoView/.test(detailFn) &&
  !/setTimeout|requestAnimationFrame|setInterval/.test(detailFn),
  'no page scroll, no smooth reset, no delayed reset, no polling');
check('the only wheel listener is the image zoomer, which stops the page default',
  (code.match(/addEventListener\('wheel'/g) || []).length === 1 &&
  /stage\.addEventListener\('wheel'/.test(code) && /e\.preventDefault\(\)/.test(code),
  'one listener, on the image stage, and it zooms rather than scrolls');
check('the page scroll lock is the native one, not a second system',
  !/document\.body\.style\.overflow/.test(js) && !/classList\.\w+\('scroll-locked'/.test(js) &&
  /showModal/.test(js));
check('the page and the details share ONE scrollbar treatment',
  /html,\s*\.detail-body\s*\{[^}]*scrollbar-color/.test(allCss) &&
  /html::-webkit-scrollbar,\s*\.detail-body::-webkit-scrollbar/.test(allCss));
check('scrollbar colours are palette tokens, never hand-picked',
  /--scroll-thumb:\s*color-mix\(in srgb, var\(--violet-d\)/.test(allCss) &&
  /--scroll-thumb-hi:\s*color-mix\(in srgb, var\(--azure\)/.test(allCss) &&
  !/::-webkit-scrollbar[^}]*#[0-9a-f]{3,6}/i.test(allCssNoComments));
check('a scrollbar appears only when there is something to scroll',
  /overflow-y:\s*auto/.test(bodyRule2) && !/overflow-y:\s*scroll/.test(allCssNoComments));

process.stdout.write(failed ? '\ncard-layout-audit FAILED (' + failed + ')\n' : '\ncard-layout-audit passed\n');
process.exitCode = failed ? 1 : 0;
