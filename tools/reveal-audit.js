/* ============================================================
   Reveal audit.  node tools/reveal-audit.js

   The reveal system is the one part of this site whose failure looks
   like the design working. A block that never arrives is indistinguishable
   from a page that simply has fewer sections, and nobody reports it —
   they report "the site feels empty". So the things worth checking are the
   things that cannot be seen in a screenshot, and this file reads them from
   the FILES rather than from a frame.

   The architecture under audit, in full:

     assets/js/reveal.js   the ONE engine
       ├ Reveal.enter()     the page head — an entrance, not a scroll reveal
       ├ Reveal.scan()      arm + watch, for a page arriving
       └ Reveal.resolve()   put it in its final state, for a re-render
     assets/css/site.css   §14 the head's entry state
                           §15 .reveal and the five behaviours

   Three invariants carry the whole thing, and each of them was broken at
   some point, so each has a check:

   1. NOTHING IS EVER HELD BACK. An element either reveals or is already in
      its final state. The head's entry state is therefore declared only
      inside `prefers-reduced-motion: no-preference` — in still mode the
      hidden value is not written down at all, so there is nothing to
      override and no JavaScript decision can leave the page's own name
      invisible.

   2. THERE IS NO CLOCK. One IntersectionObserver, and no scroll handler, no
      rAF loop, no interval, no timer chain. A reveal that needs a timer to
      be seen is a reveal that can be missed.

   3. THE TRAVEL IS ON `translate`, and only opacity/transform/filter/
      scale/clip-path change. A reveal that animates a layout property
      reflows the page on every frame, and one that owns `transform` fights
      every `.card:hover` on the site for it.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const revealJs = read('assets/js/reveal.js');
const pageJs = read('assets/js/page.js');
const siteJs = read('assets/js/site.js');
const recordsJs = read('assets/js/records.js');
const siteCssRaw = read('assets/css/site.css');

/* Assertions run against CODE and against RULES, never against prose. The
   comment above the head's entry state names `opacity: 0` and `is-in` at
   length while explaining precisely why they are conditioned; a comment
   documenting a refusal must not trip the check that forbids it. */
const code = (revealJs + '\n' + pageJs)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
/* every stylesheet body, with comments removed, for the rule checks */
const css = siteCssRaw.replace(/\/\*[\s\S]*?\*\//g, '');

const html = ['index.html', 'story.html', 'records.html'].map(read).join('\n');

/* the head's ENTRY state only — the declaration group inside the
   no-preference query that hides the head. Found by what it DOES (opacity 0
   on a .page-head selector) rather than by how it is spelled, so that a
   change of selector is caught by the assertions below instead of making
   this read nothing. */
const entryBlock = (() => {
  const open = css.indexOf('@media (prefers-reduced-motion: no-preference)');
  if (open === -1) return '';
  let depth = 1, i = css.indexOf('{', open) + 1;
  const start = i;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') depth--;
    i++;
  }
  const inside = css.slice(start, i - 1);
  return (inside.match(/[\s\S]{0,140}?\.page-head[^{]*\{[^}]*opacity:\s*0[^}]*\}/) || [''])[0];
})();
/* whether that block is the one thing inside the query, or shares it */
const entryIsAloneInNoPref = (() => {
  const open = css.indexOf('@media (prefers-reduced-motion: no-preference)');
  if (open === -1) return true;
  let depth = 1, i = css.indexOf('{', open) + 1;
  const start = i;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') depth--;
    i++;
  }
  const inside = css.slice(start, i - 1);
  return (inside.match(/\{/g) || []).length === 1;
})();
/* the resting state of the head, if one is still declared unconditionally */
const unconditionalHeadRule = (css.match(/^\.page-head \.eyebrow,[\s\S]{0,200}?\{[^}]*\}/m) || [''])[0];

/* Reveal.enter, the function whose whole job is the head */
const enterFn = (code.match(/Reveal\.enter = function \(\) \{[\s\S]*?\n  \};/) || [''])[0];
const iStill = enterFn.search(/still\(\)/);
const iEntering = enterFn.indexOf("classList.add('is-entering')");
const iRaft = enterFn.indexOf('requestAnimationFrame');
const iIn = enterFn.indexOf("classList.add('is-in')");
const iNet = enterFn.indexOf('setTimeout');

const observerFn = (code.match(/function observer\(\)[\s\S]*?\n  \}/) || [''])[0];
const revealRule = (css.match(/^\.reveal \{[^}]*\}/m) || [''])[0];
const revealInRule = (css.match(/^\.reveal\.is-in \{[^}]*\}/m) || [''])[0];
const staggerRule = (css.match(/^\[data-reveal="stagger"\] > \.reveal \{[^}]*\}/m) || [''])[0];
const reduceBlock = (css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/) || [''])[0];
/* the head's own transition, which lives on a selector LIST, so it is read as
   "the group that names .page-title" rather than as one selector */
const headTransition = (css.match(/\.page-head \.eyebrow,[\s\S]{0,120}?\{[^}]*transition:[^}]*\}/) || [''])[0];

/* The head's three entry delays, read one rule at a time, and the number the
   safety net waits. These are the two things that made the entrance 2.6s. */
const headDelays = (css.match(/\.is-entering \.page-head[^{]*\{[^}]*transition-delay:[^}]*\}/g) || [])
  .map(r => (r.match(/transition-delay:\s*([^;}]+)/) || ['', ''])[1].trim());
const netMs = (enterFn.match(/setTimeout\([\s\S]*?,\s*(\d+)\s*\);/) || ['', ''])[1];

/* The two functions that decide "is this arriving, or is it already here". */
const flushFn = (code.match(/function flushPassed\(\)[\s\S]*?\n  \}/) || [''])[0];
const resolveFn = (code.match(/Reveal\.resolve = function \(scope\)[\s\S]*?\n  \};/) || [''])[0];

/* the other page scripts, comment-stripped: a comment may DISCUSS a reveal
   without performing one */
const otherCode = [pageJs, siteJs, recordsJs, read('assets/js/ui.js'), read('assets/js/scroll.js')]
  .map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''))
  .join('\n');

let failed = 0;
function check(name, ok, detail) {
  process.stdout.write((ok ? '  ok  ' : '  FAIL') + ' ' + name + (detail ? ' — ' + detail : '') + '\n');
  if (!ok) failed++;
}
/* A check that silently reads nothing is worse than no check. Every lookup
   that is expected to find something says so out loud. */
function read_(label, text) {
  if (!text || !text.trim()) {
    process.stdout.write('  FAIL ' + label + ' — READ NOTHING: the anchor this check looks for is gone from the file\n');
    failed++;
    return false;
  }
  return true;
}

console.log('— the engine —');
check('1. one reveal engine, and it is a real one',
  /Reveal\.scan\s*=/.test(code) && /Reveal\.resolve\s*=/.test(code) && /Reveal\.enter\s*=/.test(code),
  'scan, resolve and enter are the three public verbs; a fourth would be a second engine');
check('1b. there is exactly ONE IntersectionObserver, in one place',
  (code.match(/new IntersectionObserver/g) || []).length === 1,
  'counted ' + (code.match(/new IntersectionObserver/g) || []).length + ' in reveal.js — two observers is the first sign of a second engine');
check('2. the reveal engine is the one place a data-reveal is turned into a class',
  /getAttribute\('data-reveal'\)/.test(code) && /classList\.add\('reveal'\)/.test(code),
  'the markup names the behaviour, the engine applies it; a page doing it itself is the drift this replaced');
check('3. the head is answered by the engine, not by a page script',
  /Reveal\.enter\(\);\s*\}\)\(\);?\s*$/.test(code) || /Reveal\.enter\(\);\s*\n\}\)\(\);/.test(code),
  'Reveal.enter() self-initialises at the end of the module, so no page can forget to ask for it');
check('3b. no page script brings the head back as its own private entrance',
  !/classList\.add\('is-entering'\)/.test(pageJs) && !/page-head/.test(pageJs.replace(/\/\*[\s\S]*?\*\//g, '')),
  'page.js used to add is-entering behind two nested rAFs; records.html never loads it, so its title stayed at opacity 0 for good');
check('3c. the head has a way out if the animation frames never run',
  iNet !== -1 && enterFn.indexOf('is-in', iNet) > iNet,
  'a background tab, a prerender or a hidden tab can leave rAF unfired; without the net the page\'s own name is what gets left invisible');

console.log('\n— no clock —');
const outsideEnter = code.replace(/Reveal\.enter = function \(\) \{[\s\S]*?\n  \};/, '');
check('4. the engine has no frame clock: the only frames are the two that prime the head',
  (code.match(/requestAnimationFrame/g) || []).length === 3 &&
  !/requestAnimationFrame/.test(outsideEnter),
  'counted ' + (code.match(/requestAnimationFrame/g) || []).length +
  ' in this file — three is the two-frame primer plus the guard for a browser that has none. Any fourth is a loop');
check('4b. no scroll or resize listener in the reveal engine',
  !/addEventListener\(\s*['"]scroll/.test(code) && !/addEventListener\(\s*['"]resize/.test(code),
  'visibility is decided by the observer; a scroll listener that computes positions is the rAF loop by another name');
check('4c. the observer is a plain reveal-once observer: unobserve on arrival',
  /io\.unobserve\(en\.target\)/.test(observerFn) && /classList\.add\('is-in'\)/.test(observerFn),
  'an element that stays observed can only be re-entered by a behaviour change nobody asked for');
check('5. the one timer is a single safety net, not a chain',
  (code.match(/setTimeout/g) || []).length === 1,
  'counted ' + (code.match(/setTimeout/g) || []).length + ' — a chain of timers is how a page ends up animating on a clock instead of on arrival');
check('5b. a target the observer can never report is still settled — AND actually called',
  /function flushPassed\(\)/.test(code) &&
  /flushPassed\(\);/.test(observerFn) &&
  /bottom <= 0/.test(code),
  'a target a fast scroll jumps clean over is outside the root rect before AND after, so no threshold is crossed and no entry is ever queued for it. A function nobody calls is a token that exists just in case');
check('5c. the safety net does not turn into a scroll loop',
  !/addEventListener\(\s*['"]scroll/.test(code) && /observer\(\)/.test(code),
  'flushPassed runs only from the observer callback, over elements that are still hidden — never per frame');

console.log('\n— the arrival, and what it is allowed to touch —');
if (read_('the .reveal rule', revealRule)) {
  check('6. the hidden state is opacity + translate + filter, and nothing else',
    /opacity:\s*0/.test(revealRule) && /translate:/.test(revealRule) && /filter:/.test(revealRule) &&
    !/display:|visibility:|height:|margin:|padding:|top:|left:|width:/.test(revealRule),
    'a reveal must not remove anything from layout, or the page jumps while it is being read');
  check('6b. the travel is on `translate`, not `transform`',
    !/transform:/.test(revealRule) && /translate:/.test(revealRule),
    'every card here is both .reveal.is-in and .card:hover; a shared property means one of them silently loses');
  check('7. the arrival is the rest state, and it is declared',
    read_('the .reveal.is-in rule', revealInRule) && /opacity:\s*1/.test(revealInRule) && /translate:\s*none/.test(revealInRule) && /filter:\s*none/.test(revealInRule),
    'opacity 1 / translate none / filter none is the final state; the initial value is not a place to stop');
  check('7b. nothing is revealed by an infinite animation on a hover selector',
    !/animation:[^;]*infinite[^;]*\}\s*$/.test(staggerRule) && !/:hover[^{]*\{[^}]*animation:[^}]*infinite/.test(css),
    'a loop is not a reveal, and a hover may not introduce an animation the rest state does not own');
}

console.log('\n— the head, which is an entrance and not a scroll reveal —');
if (read_('the head\'s entry state', entryBlock)) {
  check('8. the head\'s hidden state exists ONLY where motion is allowed',
    entryIsAloneInNoPref && /is-entering/.test(entryBlock) && /:not\(\.is-in\)/.test(entryBlock),
    'in still mode the hidden value is not written down at all, so there is nothing for JavaScript to override');
  check('9. the hidden state is conditional on an entrance actually running',
    /^\s*\.is-entering \.page-head:not\(\.is-in\)/.test(entryBlock.trim()),
    'keyed on is-entering, the resting page is the visible page — with no script, and before any frame');
}
check('9b. no unconditional hidden state is left on the head',
  !/opacity:\s*0/.test(unconditionalHeadRule),
  'an unconditional opacity:0 here is the original bug: three things had to be true for the title to be visible at all');
check('9c. the head is a transition, not an animation, and its travel is translate too',
  read_('the head\'s transition', headTransition) &&
  /opacity var\(--motion-reveal\)/.test(headTransition) &&
  /translate var\(--motion-reveal\)/.test(headTransition) &&
  /filter var\(--motion-reveal\)/.test(headTransition),
  'the same two-property split as .reveal: opacity and filter carry the arrival, translate carries the travel');
check('9d. the entrance asks the engine\'s own still() before it hides anything',
  iStill !== -1 && iEntering !== -1 && iStill < iEntering,
  'still mode must be answered BEFORE is-entering is set, or the head is hidden on the way to being safe');
check('9e. under still mode the head is resolved with no transition to sit through',
  /head\.classList\.add\('is-in'\)/.test(enterFn.slice(0, iEntering === -1 ? enterFn.length : iEntering)),
  'the still path returns before the class that carries the entry state is ever set');

console.log('\n— how long the name takes, which is the whole entrance a visitor sees —');
check('9f. the head cascade is a stagger, not three hand-typed delays',
  headDelays.length === 3 && headDelays.every(v => /^0ms$/.test(v) || /var\(--stagger\)/.test(v)),
  'it was 0/500/1000ms: the page\'s own name sat at opacity 0 for half a second, and the head took 2.6s to settle — a visitor who scrolls on load never sees it');
check('9g. nothing arrives on a rung slower than --motion-reveal',
  !/--motion-long/.test(css),
  'the title was the only user of the slowest rung on the site; a name is content, and 1.6s of blur is not an entrance');
check('9h. the safety net outlasts the entrance it protects, and is not itself the delay',
  /^\d+$/.test(netMs) && Number(netMs) > 1040 && Number(netMs) <= 2000,
  'the entrance is 240ms of delay plus 800ms of duration; the net was 2800ms, so on any page where the frames never arrived the name stayed blank for nearly three seconds before anything rescued it');

console.log('\n— arriving, or already here: the two states are not the same verb —');
if (read_('the skipped-target safety net', flushFn)) {
  check('14c. the flush cannot settle a node that has no box',
    /getBoundingClientRect\(\)/.test(flushFn) && /if \(!box\.height\) continue/.test(flushFn) && /box\.bottom <= 0/.test(flushFn),
    'a node inside a hidden container reports top 0 / bottom 0 / height 0, which reads as "scrolled past"; measured, such a node came back is-in and could never animate once shown');
}
if (read_('resolve()', resolveFn)) {
  check('14d. a re-rendered list watches what is below the fold and settles only what is on it',
    /if \(!box\.height\) continue/.test(resolveFn) &&
    /box\.top < window\.innerHeight/.test(resolveFn) &&
    /watch\.push\(/.test(resolveFn) && /ob\.observe\(/.test(resolveFn),
    'settling everything meant a filtered list of thirty cards was already at opacity 1 before the visitor scrolled to it — content made visible before it has been on screen can never animate');
  check('14e. resolve() does NOT skip a group for being already armed',
    /querySelectorAll\('\[data-reveal\]'\)/.test(resolveFn) &&
    !/\[data-reveal-armed\]\)/.test(resolveFn) &&
    !/if \(found\[j\]\.hasAttribute\('data-reveal-armed'\)\) continue;/.test(resolveFn),
    "the armed flag lives on the GROUP and a re-render replaces the group's CHILDREN while the group survives, so excluding armed groups matches nothing and the new cards are never armed at all — measured: armed groups, 330px children, zero of them carrying .reveal");
}

console.log('\n— still mode —');
if (read_('the reduced-motion block', reduceBlock)) {
  check('10. the reduced-motion block exists and covers the scroll reveal',
    /\.reveal \{[^}]*opacity:\s*1[^}]*translate:\s*none[^}]*filter:\s*none/.test(reduceBlock),
    'content must appear immediately, and not only because JavaScript decided to');
  check('10b. the still path is in the ENGINE as well, not only in the CSS',
    /var immediate = still\(\)/.test(code),
    'a check that cannot fail is worse than no check: the CSS says one thing and the script the other, and the page pays for the disagreement');
  check('10c. still mode is not answered with animation-duration: .001ms',
    !/animation-duration:\s*\.?0*\.?001ms/.test(reduceBlock) && !/\*\s*\(1\s*-\s*var\(--still\)\)/.test(css),
    'that freezes the site into a single frame; the loops go off with `animation: none` and the controls keep their light');
}

console.log('\n— the sequence —');
if (read_('the stagger rule', staggerRule)) {
  check('11. a staggered group is CLAMPED, so a long list cannot take seconds to appear',
    /min\(/.test(staggerRule) && /--stagger/.test(staggerRule),
    'capping the INDEX keeps the rhythm for the first few and lets the rest arrive together');
  check('12. the stagger is read from the motion ladder, not invented per group',
    /--stagger/.test(staggerRule) && !/\d+ms/.test(staggerRule),
    'a raw duration here is a second motion ladder, and it is the one that drifts');
  check('12b. the reveal duration is read from a token too',
    /--reveal-dur/.test(revealRule) && /--motion-/.test(revealRule),
    'one knob for how long an arrival may take, so the page head, a card and a heading cannot disagree');
}

console.log('\n— one engine, in every caller —');
check('13. every page that renders content afterwards goes back through the engine',
  /Reveal\.scan\(/.test(siteJs) && /Reveal\.resolve\(/.test(recordsJs),
  'markup that arrives after the page did must go back through the engine either way: settle what is on screen, watch what is below it. Left out of both, it is content that never arrives and never fades in');
check('13b. the home page re-scans after a language change',
  /site-lang-change/.test(siteJs) && /renderAll/.test(siteJs),
  'the dynamic lists on the home page are rebuilt on every switch; without the re-scan the new markup is never armed');
check('14. no page script performs a reveal of its own',
  !/classList\.add\('reveal/.test(otherCode) &&
  !/classList\.add\('is-in/.test(otherCode) &&
  !/getAttribute\('data-reveal'\)/.test(otherCode),
  'only the engine may turn a data-reveal into a class or flip is-in. The nav spy and the stat counter have their own observers on purpose — they are not reveals, and a check that forbade them would be forbidding features');
check('14b. the page head is not animated by a page script at all',
  !/classList\.add\('is-in'\)/.test(pageJs.replace(/\/\*[\s\S]*?\*\//g, '')),
  'the entrance belongs to the engine; a page that also flips the class is a second switch that can be left off');

console.log('\n— the markup asks for what the stylesheet has —');
const usedKinds = new Set();
const kindsRe = /data-reveal="([a-z-]+)"/g;
let m;
while ((m = kindsRe.exec(html))) usedKinds.add(m[1]);
check('15. every data-reveal in the markup has a rule behind it',
  [...usedKinds].every((k) => k === 'stagger' || new RegExp('\\.reveal-' + k + '\\b').test(css) || k === 'up'),
  'kinds used: ' + [...usedKinds].sort().join(', '));
check('15b. every rule has a caller — no behaviour nothing asks for',
  [...css.matchAll(/\.reveal-([a-z]+)\b/g)]
    .map((x) => x[1])
    .filter((v, i, a) => a.indexOf(v) === i)
    .every((k) => usedKinds.has(k)),
  'a behaviour class with no data-reveal anywhere is a hook for nothing');
check('16. the content groups that JS renders are in the reveal vocabulary',
  /id="projects-list"[^>]*data-reveal="stagger"|data-reveal="stagger"[^>]*id="projects-list"/.test(html) &&
  /id="volley-list"[^>]*data-reveal="stagger"|data-reveal="stagger"[^>]*id="volley-list"/.test(html),
  'the projects and volunteering lists are the only card groups on the home page that had no reveal at all');

process.stdout.write('\n');
if (failed) {
  process.stdout.write('reveal-audit FAILED: ' + failed + ' check(s)\n');
  process.exitCode = 1;
} else {
  process.stdout.write('reveal-audit passed\n');
}
