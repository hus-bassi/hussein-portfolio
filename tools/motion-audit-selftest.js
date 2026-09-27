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
.card {
  transition: transform var(--motion-slow) var(--ease),
              box-shadow var(--motion-normal) var(--ease);
  animation: edge-shine var(--ambient-long) var(--ease) infinite;
}
.card:hover { transition-duration: var(--motion-fast); }
.card:active { transform: translateY(1px); transition-duration: var(--motion-instant); }
.trajectory { transition: stroke-dashoffset var(--motion-long) var(--ease);
              animation: trace-run var(--ambient-slow) linear infinite; }
.hero-scroll { transition: opacity var(--motion-reveal) var(--ease);
               animation: orb-breathe var(--ambient-pulse) var(--ease) infinite alternate,
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
    css: CLEAN.replace('transition: transform var(--motion-slow) var(--ease)',
                        'transition: transform 120ms var(--ease)'),
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
