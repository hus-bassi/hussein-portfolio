/* ============================================================
   Prove that the motion rules in css-audit.js can still fail.

   A check that cannot fail is worse than no check, and the motion rules
   were rewritten in a way that could very easily be vacuous: the ladder
   bounds only bite if the tokens are read, the exemption for the
   reduced-motion block only works if that block is found at all, and the
   trap that started all this is invisible unless the arithmetic is looked
   for by name. All three are exactly the kind of thing that silently
   stops working after a well-meaning edit.

   So: build a stylesheet that commits each mistake, run the real audit
   against it, and require it to fail with the right complaint.

   Run:  node tools/motion-audit-selftest.js
   ============================================================ */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const audit = path.join(__dirname, 'css-audit.js');

/* A minimal stylesheet that passes every rule, used as the base for each
   case so a failure can only come from the mistake being tested. It has to
   use every token it declares and every class it selects, or the dead-code
   rules would fire first and the case would prove nothing about motion. */
const CLEAN = `
:root {
  --ease: cubic-bezier(.22, .61, .36, 1);
  --motion-instant: 150ms;
  --motion-fast: 300ms;
  --motion-normal: 450ms;
  --motion-slow: 650ms;
  --motion-reveal: 800ms;
  --motion-cinematic: 1200ms;
  --motion-long: 1600ms;
  --stagger: 120ms;
  --ambient-pulse: 6s;
  --ambient-slow: 20s;
  --ambient-long: 30s;
  --ambient-cinematic: 45s;
}
/* ONE transition list, written as longhands, on the ONE element that carries
   all three of these classes. The fixture used to give each class its own
   'transition' shorthand, which is the real defect the generalised shorthand
   check is for: the second and third lists REPLACE the first, and the
   generalised check caught the fixture the moment it was switched on. It is
   left in that shape deliberately — this is what the shipped code has to look
   like, and the fixture is the example everyone copies from. */
.card {
  transition-property: transform, box-shadow, stroke-dashoffset, opacity;
  transition-duration: var(--motion-slow), var(--motion-normal), var(--motion-long), var(--motion-reveal);
  transition-timing-function: var(--ease), var(--ease), var(--ease), var(--ease);
  animation: edge-shine var(--ambient-long) var(--ease) infinite;
}
.card:hover { transition-duration: var(--motion-fast); }
.card:active { transform: translateY(1px); transition-duration: var(--motion-instant); }
.trajectory { animation: trace-run var(--ambient-slow) linear infinite; }
.hero-scroll { animation: orb-breathe var(--ambient-pulse) var(--ease) infinite alternate,
                          field-drift var(--ambient-cinematic) var(--ease) infinite alternate; }
.page-head { transition: opacity var(--motion-cinematic) var(--ease),
                         translate var(--motion-cinematic) var(--ease-out); }
.hero-scroll::after { animation: cue 4s linear infinite; }
[data-reveal] { transition-delay: calc(var(--i, 0) * var(--stagger)); }
@keyframes edge-shine { from { background-position: -80% 0; } to { background-position: 180% 0; } }
@keyframes trace-run { to { stroke-dashoffset: -1000; } }
@keyframes orb-breathe { from { transform: scale(.9); } to { transform: scale(1.1); } }
@keyframes cue { from { transform: scaleY(.35); } to { transform: scaleY(1); } }
@keyframes field-drift { from { background-position: 0% 0; } to { background-position: 100% 0; } }
@media (prefers-reduced-motion: reduce) {
  .card { animation: none; transition-duration: 200ms; }
}
`;

const MARKUP = '<div class="card trajectory hero-scroll"><span class="page-head" data-reveal="line"></span></div>';

/* The picture cases need the classes they select to be REAL, or the
   dead-class rule fires first and the case proves nothing about motion. And
   they carry the preview ceiling themselves: `.record-shot` in the markup
   is a rule about a preview, so a case about a picture's transition has to
   satisfy the preview rules too, or it fails for the wrong reason. */
const PICTURE = MARKUP +
  '<button class="record-shot is-video"><img class="shot-media media-poster" alt=""></button>';
const PICTURE_CSS =
  '.record-shot { max-height: clamp(210px, 22vw, 280px); }\n' +
  '.record-shot img { object-fit: contain; }\n';

const CASES = [
  {
    name: 'the real bug: a duration scaled by --still at the top level',
    css: '.probe { transition: opacity 400ms linear; }\n' + CLEAN.replace(
      'animation: edge-shine var(--ambient-long) var(--ease) infinite;',
      'animation: edge-shine var(--ambient-long) var(--ease) infinite;\n  animation-duration: calc(var(--real-dur, 1s) * (1 - var(--still)));'
    ),
    markup: MARKUP + '<div class="probe"></div>',
    expect: /scaled by var\(--still\) outside the reduced-motion query/
  },
  {
    name: 'a loop fast enough to be a screensaver (the 1.1s grain crawl)',
    css: CLEAN.replace('animation: cue 4s', 'animation: cue 1.1s'),
    expect: /1\.1s loop — under 4s/
  },
  {
    name: 'a loop so slow it is a still image',
    css: CLEAN.replace('animation: cue 4s', 'animation: cue 90s'),
    expect: /90s loop — over 60s/
  },
  {
    name: 'an interaction that answers in a flash',
    css: CLEAN.replace('transition-duration: var(--motion-slow), var(--motion-normal), var(--motion-long), var(--motion-reveal);',
                        'transition-duration: 120ms, var(--motion-normal), var(--motion-long), var(--motion-reveal);'),
    expect: /120ms transition — under 250ms/
  },
  {
    name: 'a rung that is not slower than the one below it',
    css: CLEAN.replace('--motion-slow: 650ms;', '--motion-slow: 300ms;'),
    expect: /is not slower than --motion-normal/
  },
  {
    name: 'a hole in the ladder',
    css: CLEAN.replace(/--motion-cinematic: 1200ms;\n/, '')
             .replace('transition: opacity var(--motion-cinematic) var(--ease),\n              scale var(--motion-cinematic) var(--ease-out);', 'transition: opacity var(--motion-long) var(--ease);')
             .replace('opacity var(--motion-cinematic) var(--ease),\n                         translate var(--motion-cinematic) var(--ease-out);', 'opacity var(--motion-long) var(--ease),\n                         translate var(--motion-long) var(--ease-out);'),
    expect: /--motion-cinematic is missing from :root/
  },
  {
    name: 'an ambient rung outside the ambient family',
    css: CLEAN.replace('--ambient-cinematic: 45s;', '--ambient-cinematic: 120s;'),
    expect: /--ambient-cinematic is 120000ms/
  },
  {
    name: 'a still rule outside the block it belongs in (raw short time)',
    css: CLEAN + '\n.foot { transition: opacity 150ms linear; }\n',
    markup: MARKUP + '<div class="foot"></div>',
    expect: /150ms transition — under 250ms/
  },
  {
    name: 'a short time that IS inside the reduced-motion block (must pass)',
    css: CLEAN + '\n@media (prefers-reduced-motion: reduce) { .foot { transition: opacity 120ms linear; } }\n',
    markup: MARKUP + '<div class="foot"></div>',
    expect: null
  },
  {
    name: 'the white travelling band inside a card (the pale patch)',
    css: CLEAN + '\n.card { background-image: linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, .55) 50%, transparent 58%), var(--edge); }\n',
    expect: /paints a light inside the surface/
  },
  {
    name: 'a radial spotlight inside a record',
    css: CLEAN + '\n.record { background: radial-gradient(180px at 20% 30%, rgba(255, 255, 255, .3), transparent 70%); }\n',
    expect: /paints a light inside the surface/
  },
  {
    name: 'a card leaning toward the pointer',
    css: CLEAN + '\n.card:hover { transform: perspective(1100px) translateY(-4px) rotateY(2deg); }\n',
    expect: /3D lean/
  },
  {
    name: 'a dark pane with a bright edge (must pass)',
    css: CLEAN + '\n.card { background-image: var(--edge), var(--spectrum); }\n.card:hover { transform: translateY(-4px); background-position: var(--edge-hi); }\n',
    expect: null
  },
  {
    name: 'a rung removed from the middle of the ladder',
    css: CLEAN.replace(/--motion-reveal: 800ms;\n/, ''),
    expect: /--motion-reveal is missing from :root/
  },
  {
    name: 'a press that flickers instead of pressing',
    css: CLEAN + '\n.card:active { transition-duration: 40ms; }\n',
    expect: /40ms transition — below 80ms/
  },
  {
    name: 'a reveal behaviour nothing in the markup ever asks for',
    css: CLEAN + '\n.reveal-ghost { opacity: 0; }\n',
    expect: /DEAD CLASSES[\s\S]*reveal-ghost/
  },
  {
    name: 'a reveal behaviour the markup does ask for (must pass)',
    css: CLEAN + '\n.reveal-line { opacity: 0; transition: opacity var(--motion-reveal) var(--ease); }\n',
    expect: null
  },
  {
    name: 'a white highlight inside a button',
    css: CLEAN + '\n.btn::before { background: linear-gradient(100deg, transparent, rgba(255, 255, 255, .8), transparent); }\n',
    expect: /paints a light inside the surface/
  },
  {
    name: 'a radial spotlight driven by the pointer on a button',
    css: CLEAN + '\n.btn { background: radial-gradient(180px at var(--pxn) 50%, rgba(124, 92, 255, .5), transparent 70%); }\n',
    expect: /paints a light inside the surface/
  },
  {
    name: 'a sweep that loops for as long as the pointer is there',
    css: CLEAN + '\n.btn:hover::before { animation: btn-sweep var(--motion-cinematic) linear infinite; }\n@keyframes btn-sweep { to { opacity: 0; } }\n',
    expect: /infinite animation on an interactive state/
  },
  {
    name: 'a spectrum sweep played once on hover (must pass)',
    css: CLEAN + '\n.btn::before { background: linear-gradient(100deg, transparent 30%, rgba(240, 206, 126, .3) 50%, transparent 70%); opacity: 0; }\n.btn:hover::before { animation: btn-sweep var(--motion-cinematic) var(--ease-out) 1 both; }\n@keyframes btn-sweep { from { opacity: 0; } to { opacity: 1; } }\n',
    markup: MARKUP + '<button class="btn"></button>',
    expect: null
  },
  {
    name: 'the section numeral pulled out of the flow over its heading',
    css: CLEAN + '\n.sec-index { position: absolute; inset-inline-start: -.06em; font-size: 6rem; margin: 0; }\n',
    markup: MARKUP + '<span class="sec-index">01</span>',
    expect: /is taken out of the flow/
  },
  {
    name: 'a section numeral on its own line with a gap (must pass)',
    css: CLEAN + '\n.sec-index { position: static; display: block; margin: 0 0 .9rem; font-size: 6.5rem; }\n',
    markup: MARKUP + '<span class="sec-index">01</span>',
    expect: null
  },
  {
    name: 'a link colour rule whose selector can never match',
    css: CLEAN + '\na.primary-nav a { color: #888; }\n',
    markup: MARKUP + '<nav class="primary-nav"><a href="story.html">My story</a></nav>',
    expect: /cannot match/
  },
  {
    name: 'the same rule without the type qualifier (must pass)',
    css: CLEAN + '\n.primary-nav a { color: #888; }\n',
    markup: MARKUP + '<nav class="primary-nav"><a href="story.html">My story</a></nav>',
    expect: null
  },
  {
    name: 'a record card with an artificial min-height',
    css: CLEAN + '\n.record { min-height: 500px; }\n',
    markup: MARKUP + '<li class="record"></li>',
    expect: /500px min-height/
  },
  {
    name: 'an info column stretched to the media height (the dead space)',
    css: CLEAN + '\n.record-body { align-self: stretch; min-height: 100%; }\n',
    markup: MARKUP + '<li class="record"><div class="record-body"></div></li>',
    expect: /stretches the info column/
  },
  {
    name: 'an action row pushed to the bottom of the column',
    css: CLEAN + '\n.record-actions { display: flex; margin-block-start: auto; }\n',
    markup: MARKUP + '<div class="record-actions"></div>',
    expect: /pushed to the bottom of the column/
  },
  {
    name: 'a selector written for one record only',
    css: CLEAN + '\n.record[data-record="datacamp"] .record-shot { max-height: 120px; }\n',
    markup: MARKUP + '<li class="record" data-record="datacamp"><span class="record-shot"></span></li>',
    expect: /targets ONE record/
  },
  {
    name: 'a media preview with no ceiling',
    css: CLEAN + '\n.record-shot { aspect-ratio: 16 / 9; }\n.record-shot img { object-fit: contain; }\n',
    markup: MARKUP + '<span class="record-shot"><img alt=""></span>',
    expect: /no max-height/
  },
  {
    name: 'a bounded preview that is cropped instead of contained',
    css: CLEAN + '\n.record-shot { max-height: clamp(210px, 22vw, 280px); }\n.record-shot img { object-fit: cover; }\n',
    markup: MARKUP + '<span class="record-shot"><img alt=""></span>',
    expect: /not object-fit: contain/
  },
  {
    name: 'a bounded, contained preview (must pass)',
    css: CLEAN + '\n.record-shot { max-height: clamp(210px, 22vw, 280px); }\n.record-shot img { object-fit: contain; }\n.record-body { align-self: start; }\n.record-actions { display: flex; gap: var(--s-3); margin-block-start: var(--s-4); }\n',
    markup: MARKUP + '<li class="record"><span class="record-shot"><img alt=""></span><div class="record-body"><div class="record-actions"></div></div></li>',
    expect: null
  },

  /* ---- ONE TRANSITION LIST PER ELEMENT ----
     `transition` is a shorthand for the list, so two rules that each look
     right together delete half the motion on whatever matches both. The
     real instance was a video still: `.shot-media` named `opacity,
     translate` for its arrival and the hover rule named `scale`, the still
     matched both, and it arrived with no transition at all — measured as
     zero animations on the element, not as a missing declaration. */
  {
    name: 'the real bug: the hover rule replaces the poster\'s arrival list',
    css: CLEAN + PICTURE_CSS + '\n.shot-media { opacity: 0; translate: 0 14px; transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out); }\nbutton.record-shot img,\nbutton.record-shot .media-poster { scale: 1; transition: scale var(--motion-slow) var(--ease-out); }\n',
    markup: PICTURE,
    expect: /so it REPLACES rather than adds/
  },
  {
    /* The certificate dialog's still is an <img class="media-poster"> that is
       NOT inside a <button>, so it misses the rule above and meets a different
       one — which is exactly why the original bug read as intentional. The
       check resolves that from the markup now, so this case has to put the
       poster where the dialog really puts it. */
    name: 'the dialog\'s still also met a scale-only rule',
    css: CLEAN + PICTURE_CSS +
      '\n.shot-media { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out), scale var(--motion-slow) var(--ease-out); }\n' +
      '.cert-stage .media-poster { transition: scale var(--motion-slow) var(--ease-out); }\n',
    markup: PICTURE + '<div class="cert-stage"><img class="media-poster shot-media" alt=""></div>',
    expect: /so it REPLACES rather than adds/
  },
  {
    name: 'a property added to one picture rule later',
    css: CLEAN + PICTURE_CSS + '\n.shot-media { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out), scale var(--motion-slow) var(--ease-out); }\nbutton.record-shot:hover img { transition: filter var(--motion-normal) var(--ease); }\n',
    markup: PICTURE,
    expect: /so it REPLACES rather than adds/
  },
  {
    name: 'one complete list, shared by every picture (must pass)',
    css: CLEAN + PICTURE_CSS + '\n.shot-media,\nbutton.record-shot img,\nbutton.record-shot .media-poster { scale: 1; transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out), scale var(--motion-slow) var(--ease-out); }\n',
    markup: PICTURE,
    expect: null
  },

  /* ---- THE SHORTHAND TRAP, OUTSIDE PICTURES ----
     The check used to be scoped to `img / .media-poster / .shot-media`,
     which is why it sat there green while `.hero-visual` lost its entire
     opening sequence to a `transition: scale` written for the scroll
     response. It is generalised now — any two rules that can reach one
     element with the shorthand must name the same properties. These cases
     are the proof that generalising it did not make it vacuous. */
  {
    /* The real bug needs BOTH halves: a list the entrance owns, and the
       scroll response replacing it. A single stray list on one element is
       harmless, which is why this case writes the group as well. */
    name: 'the real bug: the orbit\'s scroll response ate its whole entrance',
    css: CLEAN + '\n.hero-head,\n.hero-visual { transition: opacity var(--motion-reveal) var(--ease), transform var(--motion-reveal) var(--ease-out); }\n.hero-visual { translate: 0 0; scale: 1; transition: scale var(--motion-slow) var(--ease); }\n',
    markup: MARKUP + '<div class="hero-head"></div><div class="hero-visual"></div>',
    expect: /so it REPLACES rather than adds/
  },
  {
    name: 'the same trap on a control: a hover list that drops the arrival',
    css: CLEAN + '\n.cta { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out); }\n.cta:hover { transition: filter var(--motion-slow) var(--ease); }\n',
    markup: MARKUP + '<a class="cta" href="#"></a>',
    expect: /so it REPLACES rather than adds/
  },
  {
    name: 'a winner that names a SUPERSET deletes nothing (must not be reported)',
    css: CLEAN + '\n.cta { transition: opacity var(--motion-reveal) var(--ease); }\n.cta.is-wide { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out); }\n',
    markup: MARKUP + '<a class="cta is-wide" href="#"></a>',
    expect: null
  },
  {
    name: 'a pseudo-element is its own box: its list never replaces the parent\'s (must pass)',
    css: CLEAN + '\n.cta { transition: opacity var(--motion-reveal) var(--ease); }\n.cta::before { transition: scale var(--motion-slow) var(--ease-out); }\n',
    markup: MARKUP + '<a class="cta" href="#"></a>',
    expect: null
  },
  {
    name: 'two lists on one element, on a rule that matches nothing in the markup',
    css: CLEAN + '\n.page-head[data-absent] { transition: opacity var(--motion-reveal) var(--ease); }\n.page-head[data-absent]:hover { transition: scale var(--motion-slow) var(--ease-out); }\n',
    markup: MARKUP,
    expect: null
  },
  {
    name: 'one list per element, written as longhands (must pass)',
    css: CLEAN + '\n.cta { transition-property: opacity, translate; transition-duration: var(--motion-reveal), var(--motion-reveal); transition-timing-function: var(--ease), var(--ease-out); }\n.cta:hover { transition-property: opacity, translate, filter; transition-duration: var(--motion-reveal), var(--motion-reveal), var(--motion-slow); }\n',
    markup: MARKUP + '<a class="cta" href="#"></a>',
    expect: null
  },
  {
    /* `is-loading` never appears in a class= attribute — intro.js puts it on
       <html> — so a matcher reading only the markup resolves this to nothing
       and the opening sequence becomes the one region the check cannot see.
       That is a blind spot shaped like the bug this check was written for. */
    name: 'a collision inside the opening sequence, behind a class the markup never carries',
    css: CLEAN + '\n.hero-scroll { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out); }\n.is-loading .hero-scroll { transition: scale var(--motion-slow) var(--ease); }\n',
    markup: MARKUP,
    expect: /so it REPLACES rather than adds/
  },
  {
    /* still mode deliberately collapses five properties into one plain fade —
       that IS the reduced-motion design, not a collision, and the block is
       exempt from the raw-time rules for the same reason */
    name: 'the still-mode collapse to one fade (must pass)',
    css: CLEAN + '\n.hero-scroll { transition: opacity var(--motion-reveal) var(--ease), translate var(--motion-reveal) var(--ease-out); }\n@media (prefers-reduced-motion: reduce) { .is-loading .hero-scroll { transition: opacity 400ms linear !important; } }\n',
    markup: MARKUP,
    expect: null
  },

  /* ---- A DELAY ON A GATE THAT IS ONLY EVER LEFT ----
     Seven beats were written on `.is-loading`, which intro.js only ever
     removes. Measured on the live site: the hero came in as one 800ms
     block at delay 0 and the CTAs rode 28px as a single rigid step. A
     check that cannot fail is worse than no check, so this one is proved
     both ways. */
  {
    name: 'the real bug: a beat written on the gate that only ever gets removed',
    css: CLEAN + '\n.is-loading .hero-scroll { transition-delay: 600ms; }\n',
    markup: MARKUP,
    expect: /puts a transition-delay on `\.is-loading`/
  },
  {
    name: 'a delay on a state that is entered (the resting selector — must pass)',
    css: CLEAN + '\n.hero-scroll { transition-delay: 600ms; }\n',
    markup: MARKUP,
    expect: null
  },
  {
    name: 'a still-mode delay inside the reduced-motion block (must pass)',
    css: CLEAN + '\n@media (prefers-reduced-motion: reduce) { .hero-scroll { transition-delay: 0s; } }\n',
    markup: MARKUP,
    expect: null
  }
];

function auditAgainst(cssText, markup) {
  /* the audit resolves its paths from its own __dirname, so a sandbox with
     the same shape is the honest way to feed it something else */
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-selftest-'));
  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'assets', 'css'), { recursive: true });
  fs.copyFileSync(audit, path.join(dir, 'tools', 'css-audit.js'));
  fs.writeFileSync(path.join(dir, 'assets', 'css', 'site.css'), cssText);
  fs.writeFileSync(path.join(dir, 'assets', 'css', 'records.css'), '');
  fs.writeFileSync(path.join(dir, 'index.html'), markup || MARKUP);
  /* the audit reads all three pages for its link-selector rule, so the
     sandbox has to look like the real site rather than like one page */
  fs.writeFileSync(path.join(dir, 'story.html'), markup || MARKUP);
  fs.writeFileSync(path.join(dir, 'records.html'), markup || MARKUP);
  let out = '', code = 0;
  try {
    out = execFileSync(process.execPath, [path.join(dir, 'tools', 'css-audit.js')], { encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
    code = e.status;
  }
  fs.rmSync(dir, { recursive: true, force: true });
  return { out, code };
}

/* the baseline has to pass, or none of the failures below mean anything */
const base = auditAgainst(CLEAN, MARKUP);
if (base.code !== 0) {
  console.log('BROKEN BASELINE — the clean stylesheet is rejected, so the cases prove nothing:');
  console.log(base.out);
  process.exit(1);
}

let failed = 0;
for (const c of CASES) {
  const r = auditAgainst(c.css, c.markup);
  /* a case with no expectation is one that must NOT be reported: the
     exemption for the reduced-motion block is the easiest rule to get
     wrong, and a rule that exempts everything would pass every other case */
  const caught = c.expect ? (r.code !== 0 && c.expect.test(r.out)) : r.code === 0;
  if (caught) {
    console.log((c.expect ? 'ok   caught  ' : 'ok   allowed ') + c.name);
  } else {
    failed++;
    console.log('FAIL ' + c.name);
    console.log('     expected ' + (c.expect ? '/' + c.expect.source + '/' : 'no complaint') + ' but the audit exited ' + r.code);
    const line = r.out.split('\n').filter(l => / - /.test(l) || /BROKEN|Error/.test(l))[0] || r.out.split('\n')[0];
    console.log('     got: ' + line.trim());
  }
}

console.log('');
console.log(failed ? failed + ' case(s) NOT caught — the check cannot be trusted' : 'all ' + CASES.length + ' mistakes are caught');
process.exitCode = failed ? 1 : 0;
