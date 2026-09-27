/* ============================================================
   Image-viewer fit audit.  node tools/image-fit-audit.js

   Proves the fit math behind the certificate viewer is one generic,
   orientation-blind formula — no record-specific or
   landscape-vs-portrait branches. It loads the REAL fitScaleFor from
   assets/js/records.js, checks portrait / landscape / square all fit
   inside the stage with aspect preserved and no upscale, and fails if
   the source ever grows an orientation/record special-case or a
   hard-coded size patch (width:80%, max 700px, translateX …).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'assets', 'js', 'records.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets', 'css', 'records.css'), 'utf8');

let failed = 0;
function check(name, ok, detail) {
  process.stdout.write((ok ? '  ok  ' : '  FAIL') + ' ' + name + (detail ? ' — ' + detail : '') + '\n');
  if (!ok) failed++;
}

/* 1. extract the real function from the shipped source (not a copy) */
const m = src.match(/function fitScaleFor\([\s\S]*?\n  \}/);
check('fitScaleFor exists in records.js', !!m);
let fitScaleFor = null;
if (m) {
  try { fitScaleFor = new Function(m[0] + '\nreturn fitScaleFor;')(); }
  catch (e) { check('fitScaleFor parses', false, String(e)); }
}
check('fitScaleFor parses', !!fitScaleFor);

/* 2. orientation-blind fit: portrait, landscape, square, future ratio */
if (fitScaleFor) {
  const cases = [
    { name: 'landscape DataCamp 3750x2163 in 984x420 stage', n: [3750, 2163, 984, 420], w: 420 / 2163 },
    { name: 'portrait Elements-of-AI 1200x1700 in 984x420 stage', n: [1200, 1700, 984, 420], w: 420 / 1700 },
    { name: 'square 1500x1500 in 984x420 stage', n: [1500, 1500, 984, 420], w: 420 / 1500 },
    { name: 'mobile landscape 3750x2163 in 340x380 stage', n: [3750, 2163, 340, 380], w: 340 / 3750 },
    { name: 'mobile portrait 1200x1700 in 340x380 stage', n: [1200, 1700, 340, 380], w: 380 / 1700 },
    { name: 'small image never upscales (400x300 in 984x420)', n: [400, 300, 984, 420], w: 1 },
  ];
  for (const c of cases) {
    const got = fitScaleFor(c.n[0], c.n[1], c.n[2], c.n[3]);
    const dw = c.n[0] * got, dh = c.n[1] * got;
    const fits = dw <= c.n[2] + 0.5 && dh <= c.n[3] + 0.5;
    const noUpscale = got <= 1 + 1e-9;
    const fills = Math.abs(got - c.w) < 0.02;
    check(c.name, Math.abs(got - c.w) < 1e-9 && fits && noUpscale && fills,
      'scale=' + got.toFixed(4) + ' → ' + dw.toFixed(1) + 'x' + dh.toFixed(1));
  }
  check('zoom baseline: fit x 1 shows 100%, zoom x 4 caps display',
    fitScaleFor(3750, 2163, 984, 420) * 1 < 1 && fitScaleFor(3750, 2163, 984, 420) * 4 <= 4);
  check('bad input falls back to 1 (never NaN/0)',
    fitScaleFor(0, 0, 984, 420) === 1 && fitScaleFor(3750, 2163, 0, 0) === 1);
}

/* 3. no record-specific / orientation-specific hacks in the viewer code.
   NOTE: the words "landscape"/"portrait" legitimately appear in the EXPLANATORY
   comments and in the audit itself — the failure we guard against is a CODE
   BRANCH (if/ternary/switch keyed on orientation or record), not prose. */
const viewerCode = src;
check('no record-name branches (datacamp/elements/first-aid) in viewer fit',
  !/datacamp|elements-of-ai|first-aid/i.test(viewerCode.match(/fitScaleFor[\s\S]*?d\.fitImage = fitImage;/)?.[0] || ''));
const fitBlock = (src.match(/function fitScaleFor[\s\S]*?d\.fitImage = fitImage;/) || [''])[0];
const fitCodeOnly = fitBlock.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
check('no landscape/portrait branch in fit code (orientation-blind min())',
  !/\bif\b[^\n;{}]*(landscape|portrait)|landscape[^\n;{}]*\?|portrait[^\n;{}]*\?|switch[^\n;{}]*(landscape|portrait)/i.test(fitCodeOnly));
check('no hard-coded size patch in fit (80%, 700px, translateX, margin-left)',
  !/width:\s*80%|max-(width|height):\s*700px|translateX|margin-left/i.test(fitBlock));
check('fit budget is the measured chrome (stage width + panel cap − header/footer), never window size alone',
  /stageBudget/.test(fitCodeOnly) && /cert-head/.test(fitCodeOnly) && /cert-foot/.test(fitCodeOnly));
check('fit never sizes from window.innerWidth/innerHeight alone',
  !/window\.inner(Width|Height)\s*\/|Math\.min\(\s*window/.test(fitCodeOnly));
check('fit waits for natural size (naturalWidth/naturalHeight + load)',
  /naturalWidth/.test(src) && /addEventListener\('load'/.test(src));
check('fit recalcs on resize (ResizeObserver + resize fallback)',
  /ResizeObserver/.test(src) && /addEventListener\('resize'/.test(src));
check('reset returns to fit baseline without inheriting zoom (z=1, pan=0)',
  /d\.resetZoom[\s\S]*?z = 1; px = 0; py = 0/.test(src));
check('reset does NOT clear the fitted layout box (no width/height wipe)',
  !/resetZoom[\s\S]{0,600}?style\.(width|height)\s*=\s*['\"]{2}/.test(src));
check('zoom label stays 100%-at-fit (userZoom only)',
  /Math\.round\(z \* 100\)/.test(src));

/* 4. CSS: stage is a bounded box, image contained by stage (not viewport) */
check('CSS stage has bounded max-height (not an unbounded flex child)',
  /\.cert-frame:has\(\.cert-image\)[\s\S]*?max-height:/.test(css));
check('CSS image max-width is stage-relative (no vw leak past 1080px dialog)',
  !/\.cert-image\s*{[^}]*max-width:\s*\d+vw/.test(css));

process.stdout.write(failed ? '\nimage-fit-audit FAILED (' + failed + ')\n' : '\nimage-fit-audit passed\n');
process.exitCode = failed ? 1 : 0;
