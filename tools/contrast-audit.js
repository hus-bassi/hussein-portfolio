/* ============================================================
   Contrast audit — run:  node tools/contrast-audit.js

   Reads the LIVE token values out of assets/css/site.css, builds every
   background the night system can actually produce (bands are
   translucent, so the light field shows through them), and prints the
   WCAG ratio for each text/background pair — then re-measures it under
   the worst case of the 4% grain overlay (text and background both
   drifting 4% toward each other).

   The bar is 4.5:1 in BOTH columns. Anything that fails gets fixed in
   the stylesheet, not in this file.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'site.css'), 'utf8');
function token(name) {
  const m = css.match(new RegExp('--' + name + ':\\s*(#[0-9A-Fa-f]{6})'));
  if (!m) throw new Error('token not found: --' + name);
  return m[1];
}
function alphaOf(name) {
  const m = css.match(new RegExp('--' + name + ':\\s*rgba?\\(([^)]+)\\)'));
  if (!m) throw new Error('token not found: --' + name);
  return m[1].split(',').map(s => parseFloat(s.trim()));
}

const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const L = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const over = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));   /* alpha compositing */
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const cr = (x, y) => { const a = L(x), b = L(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const grain = (fg, bg, a = 0.04) => [mix(fg, bg, a), mix(bg, fg, a)];

/* ---------- the night, built the way the browser builds it ---------- */
const void_ = hex(token('void'));
const field = [                                    /* body::before clouds   */
  [hex('#7C5CFF'), 0.16], [hex('#D9A94C'), 0.10], [hex('#2E86FF'), 0.13]
];
/* the brightest background a band can ever present: every cloud at once
   over the void, then the band colour on top of that */
const fieldMax = field.reduce((acc, [c, a]) => over(c, acc, a), void_);
const night1 = hex('#090C16'), night1A = alphaOf('night-1')[3];
const night2 = hex('#05070E'), night2A = alphaOf('night-2')[3];
const bandBright = over(night1, fieldMax, night1A);      /* .band        */
const bandAlt = over(night2, fieldMax, night2A);          /* .band-alt    */
const paneTop = hex('#0E1421'), paneBot = hex('#141C2C'); /* pane gradient */

const T = {
  fg: token('fg'), fg2: token('fg-2'), fg3: token('fg-3'), fg4: token('fg-4'),
  violet: token('violet'), gold: token('gold'), azure: token('azure')
};

/* [label, text colour, background] */
const pairs = [
  ['fg / void (hero, footer)',        T.fg,  void_],
  ['fg-2 / void',                     T.fg2, void_],
  ['fg-3 / void',                     T.fg3, void_],
  ['fg-4 / void',                     T.fg4, void_],

  ['fg / band (brightest field)',     T.fg,  bandBright],
  ['fg-2 / band',                     T.fg2, bandBright],
  ['fg-3 / band',                     T.fg3, bandBright],
  ['fg-4 / band',                     T.fg4, bandBright],
  ['fg-2 / band-alt',                 T.fg2, bandAlt],
  ['fg-3 / band-alt',                 T.fg3, bandAlt],
  ['fg-4 / band-alt',                 T.fg4, bandAlt],

  ['fg / pane',                       T.fg,  paneBot],
  ['fg-2 / pane',                     T.fg2, paneBot],
  ['fg-3 / pane (meta, count)',       T.fg3, paneBot],
  ['fg-4 / pane (hint, placeholder)', T.fg4, paneTop],

  ['gold / band (tl-index, chain-num)', T.gold,   bandBright],
  ['gold / pane (stat-link hover)',  T.gold,   paneBot],
  ['violet / band (icon, tick)',      T.violet, bandBright],
  ['azure / band (sec-more, link)',   T.azure,  bandBright],
  ['azure / pane (social icon)',      T.azure,  paneBot],

  /* the lit spectrum carries near-black text: void on each of its stops */
  ['void / violet  (btn-primary)',   void_, T.violet],
  ['void / gold    (btn-primary)',   void_, T.gold],
  ['void / azure   (btn-primary)',   void_, T.azure],

  /* the gold match highlight on a pane */
  ['gold / gold-tinted pane (mark)', T.gold, over(hex(T.gold), paneBot, 0.26)],

  /* the gleam crossing a button: it is a BACKGROUND layer, so it sits
     UNDER the label. The worst moment is its 30% peak passing behind the
     text — measured here for both button kinds. */
  ['void / spectrum + gleam peak',  void_, over([1, 1, 1], hex(T.gold), 0.30)],
  ['fg / edge + gleam peak',       T.fg,  over([1, 1, 1], paneBot, 0.30)]
];

const toRgb = v => (Array.isArray(v) ? v : hex(v));

let fails = 0;
console.log('pair'.padEnd(38) + 'clean'.padStart(7) + 'grain@4%'.padStart(11));
console.log('-'.repeat(58));
for (const [name, fgHex, bgHex] of pairs) {
  const fg = toRgb(fgHex);
  const bg = toRgb(bgHex);
  const clean = cr(fg, bg);
  const dirty = cr(...grain(fg, bg));
  const ok = clean >= 4.5 && dirty >= 4.5;
  if (!ok) fails++;
  console.log((ok ? '  ok  ' : ' FAIL ') + name.padEnd(32) +
    clean.toFixed(2).padStart(7) + dirty.toFixed(2).padStart(11));
}
console.log('-'.repeat(58));
console.log(fails ? fails + ' PAIR(S) BELOW 4.5' : 'all pairs >= 4.5:1, clean AND under the grain');
console.log('brightest band background: #' + bandBright.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase());
process.exitCode = fails ? 1 : 0;
