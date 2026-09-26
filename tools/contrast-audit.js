/* ============================================================
   Contrast audit — run:  node tools/contrast-audit.js

   Reads the LIVE token values out of assets/css/site.css (so the table
   can never drift from the stylesheet), prints the clean WCAG ratio for
   every text/background pair the site uses, and then re-measures each
   pair under the worst case produced by the 5% grain overlay
   (body::after): text and background both drifting 5% toward each
   other. The bar is 4.5:1 for BOTH columns.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'site.css'), 'utf8');
function token(name) {
  const m = css.match(new RegExp('--' + name + ':\\s*(#[0-9A-Fa-f]{6})'));
  if (!m) throw new Error('token not found: --' + name);
  return m[1];
}

const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const L = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const cr = (x, y) => { const a = L(x), b = L(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const grain = (fg, bg, a) => [mix(fg, bg, a), mix(bg, fg, a)];
const alpha = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));

const T = {
  ink: token('ink'), ink2: token('ink-2'), ink3: token('ink-3'),
  sky600: token('sky-600'), sky300: token('sky-300'), warm: token('warm-400'),
  navy900: token('navy-900'), navy800: token('navy-800'),
  onNavy: token('on-navy'), onNavySoft: token('on-navy-soft'),
  paper: token('paper'), paper2: token('paper-2'),
  white: '#FFFFFF', heroEnd: '#16283F'
};

/* [label, foreground, background]  — foreground may be a [color, alpha] pair */
const pairs = [
  ['ink / paper',                     [T.ink],                    T.paper],
  ['ink-2 / paper',                   [T.ink2],                   T.paper],
  ['ink-2 / paper-2',                 [T.ink2],                   T.paper2],
  ['ink-3 / paper',                   [T.ink3],                   T.paper],
  ['ink-3 / paper-2',                 [T.ink3],                   T.paper2],
  ['ink-3 / white',                   [T.ink3],                   T.white],
  ['sky-600 / white (links)',         [T.sky600],                 T.white],
  ['sky-600 / paper (links)',         [T.sky600],                 T.paper],
  ['sky-600 / paper-2 (sec-more)',    [T.sky600],                 T.paper2],
  ['sky-600 / paper (tl-index)',      [T.sky600],                 T.paper],
  ['sky-600 / paper-2 (chain-num)',   [T.sky600],                 T.paper2],
  ['white / sky-600 (primary btn)',   [T.white],                  T.sky600],
  ['white / navy-800 (record btn)',   [T.white],                  T.navy800],
  ['white / navy-900',                [T.white],                  T.navy900],
  ['navy-800 / white (active tag)',   [T.navy800],                T.white],
  ['navy-900 / sky-300 (active lang)',[T.navy900],                T.sky300],
  ['on-navy / navy-900',              [T.onNavy],                 T.navy900],
  ['on-navy-soft / navy-900 (marquee)',[T.onNavySoft],            T.navy900],
  ['on-navy-soft / hero end',         [T.onNavySoft],             T.heroEnd],
  ['on-navy-soft 75% / navy-900 (copy)', [T.onNavySoft, 0.75],    T.navy900],
  ['sky-300 80% / navy-900 (eyebrow)', [T.sky300, 0.8],           T.navy900],
  ['on-navy-soft / hero end (cue)',   [T.onNavySoft],             T.heroEnd],
  ['warm-400 / navy-900',             [T.warm],                   T.navy900],
  ['sky-300 / navy-900',              [T.sky300],                 T.navy900]
];

let fails = 0;
console.log('pair'.padEnd(34) + 'clean'.padStart(7) + 'grain@5%'.padStart(11) + '   bar');
console.log('-'.repeat(60));
for (const [name, fgSpec, bgHex] of pairs) {
  const bg = hex(bgHex);
  const base = hex(fgSpec[0]);
  const fg = fgSpec[1] !== undefined ? alpha(base, bg, fgSpec[1]) : base;
  const clean = cr(fg, bg);
  const dirty = cr(...grain(fg, bg, 0.05));
  const ok = clean >= 4.5 && dirty >= 4.5;
  if (!ok) fails++;
  console.log(
    (ok ? '  ok  ' : ' FAIL ') + name.padEnd(28) +
    clean.toFixed(2).padStart(7) + dirty.toFixed(2).padStart(11) +
    '   4.50'
  );
}
console.log('-'.repeat(60));
console.log(fails ? fails + ' PAIR(S) BELOW 4.5' : 'all pairs >= 4.5:1, clean AND under the grain');
console.log('tokens: sky-600=' + T.sky600 + '  ink-3=' + T.ink3);
process.exitCode = fails ? 1 : 0;
