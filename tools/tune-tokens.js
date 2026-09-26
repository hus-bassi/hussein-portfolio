const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const L = r => 0.2126 * lin(r[0]) + 0.7152 * lin(r[1]) + 0.0722 * lin(r[2]);
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const cr = (x, y) => { const a = L(x), b = L(y), hi = Math.max(a, b), lo = Math.min(a, b); return (hi + .05) / (lo + .05); };
const g = (f, b, a) => cr(mix(f, b, a), mix(b, f, a));

const BG = { white: '#FFFFFF', paper: '#F7F9FC', paper2: '#EDF1F7' };

function row(label, fg) {
  const out = [label];
  for (const k of ['paper2', 'paper', 'white']) {
    out.push(k + '=' + g(hex(fg), hex(BG[k]), 0.05).toFixed(2));
  }
  // white text ON this colour (buttons)
  out.push('whiteOnIt=' + g(hex('#FFFFFF'), hex(fg), 0.05).toFixed(2));
  console.log(out.join('  '));
}

console.log('--- ink-3 candidates (worst-case grain 5%) ---');
['#55677E', '#51637A', '#4E6076', '#4C5E74', '#4A5C72'].forEach(c => row(c, c));
console.log('--- sky-600 candidates (worst-case grain 5%) ---');
['#2E6A9E', '#2C6598', '#2A6291', '#296089', '#275E86'].forEach(c => row(c, c));
