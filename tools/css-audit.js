/* Dead-code check for the stylesheets.
   Run:  node tools/css-audit.js

   Reports three kinds of rot:
     1. custom properties that are declared but never read
     2. class selectors that match nothing in the HTML or the JS
     3. @keyframes that are declared but never referenced

   This is the check behind "no dead code" — anything it prints is either
   deleted or is a bug. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssFiles = ['assets/css/site.css', 'assets/css/records.css'];
/* Comments are prose, not selectors: a class named in a comment ("e.g.
   .empty-state") or a filename inside one must never be reported. */
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const css = cssFiles.map(f => stripComments(fs.readFileSync(path.join(root, f), 'utf8'))).join('\n');

/* ---- 1. unused custom properties ---- */
const declared = new Set();
for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
const unusedTokens = [];
for (const v of declared) {
  const uses = (css.match(new RegExp('var\\(' + v + '[,\\) ]', 'g')) || []).length;
  if (uses === 0) unusedTokens.push(v);
}

/* ---- what the markup actually uses ----
   assets/ is NOT skipped: the runtime classes are created in
   assets/js/*.js, and skipping that folder is exactly how .motion-switch
   came to be reported as dead when it very much is used. */
const used = new Set();
const scan = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!/\.(html|js|md)$/.test(e.name)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/class="([^"]+)"/g)) {
      m[1].split(/\s+/).forEach(c => { if (c) used.add(c); });
    }
    // el('div', 'my-class', …)
    for (const m of text.matchAll(/el\('[a-z0-9]+',\s*'([^']+)'/g)) {
      m[1].split(/\s+/).forEach(c => { if (c) used.add(c); });
    }
    // el.className = 'my-class'  /  classList.add('my-class')
    for (const m of text.matchAll(/\.className\s*=\s*'([^']+)'/g)) {
      m[1].split(/\s+/).forEach(c => { if (c) used.add(c); });
    }
    /* classList.add('x') / .remove('x') / .toggle('x')
       and .toggle('x', bool) — the second form must be matched too, or
       every conditionally-applied state class is reported as dead. */
    for (const m of text.matchAll(/classList\.\w+\(\s*'([^']+)'/g)) {
      used.add(m[1]);
    }
  }
};
scan(root);

/* classes the JS creates at runtime — they never appear in a class=
   attribute, so scanning the markup alone would call them dead */
const runtimeOnly = new Set([
  'sec-index', 'read-progress', 'marquee-group', 'marquee-item',
  'record', 'record-title', 'record-meta', 'record-text', 'record-action', 'is-plain',
  'stat', 'stat-num', 'stat-label', 'stat-link',
  'social', 'social-ico', 'social-name', 'social-label',
  'reveal', 'is-in', 'is-open', 'is-active', 'is-current',
  'tag', 'tag-all', 'is-wide',
  'is-loading'   /* added and removed by assets/js/intro.js, never in markup */
]);

/* ---- 2. class selectors that match nothing ---- */
const selected = new Set();
for (const m of css.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
  let selector = m[1].replace(/url\([^)]*\)/g, 'url()').replace(/"[^"]*"/g, '""');
  if (selector.trim().startsWith('@')) continue;   // at-rule prelude
  if (/^\s*\d|^\s*from|^\s*to/.test(selector)) continue;
  for (const s of selector.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) selected.add(s[1]);
}
const deadClasses = [...selected].filter(c => !used.has(c) && !runtimeOnly.has(c));

/* ---- 3. keyframes never referenced ---- */
const frames = new Set();
for (const m of css.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)) frames.add(m[1]);
const deadFrames = [...frames].filter(k => !new RegExp('animation[^;]*\\b' + k + '\\b').test(css));

/* ---- 4. the motion must actually be visible ----
   Two failures that made the site look dead, and both are silent:
     · `animation-duration: .001ms !important` in the reduced-motion block
       compresses EVERY animation into one frame on any machine with the
       OS setting on. That is what "there is no animation" was.
     · a loop longer than ~10s is not perceived as motion at all.
   Both are checked here so they cannot come back unnoticed. */
const motionProblems = [];

for (const m of css.matchAll(/animation-duration:\s*([\d.]+m?s)/g)) {
  const v = m[1];
  if (v.endsWith('ms')) {
    const ms = parseFloat(v);
    if (ms < 50) {
      const line = css.slice(0, m.index).split('\n').length;
      motionProblems.push(`line ${line}: animation-duration ${v} — this freezes the animation to a single frame`);
    }
  }
}

// literal loop durations written straight into animation shorthands
for (const m of css.matchAll(/animation:[^;}]*?(\d+(?:\.\d+)?)s/g)) {
  const secs = parseFloat(m[1]);
  if (secs > 12) {
    const line = css.slice(0, m.index).split('\n').length;
    motionProblems.push(`line ${line}: ${secs}s loop — longer than 12s is not perceived as motion`);
  }
}

console.log('tokens declared:', declared.size, '| classes referenced:', used.size);
console.log('');
console.log('UNUSED TOKENS :', unusedTokens.length ? unusedTokens.join(', ') : 'none');
console.log('DEAD CLASSES  :', deadClasses.length ? deadClasses.join(', ') : 'none');
console.log('DEAD KEYFRAMES:', deadFrames.length ? deadFrames.join(', ') : 'none');
console.log('MOTION PROBLEMS:', motionProblems.length ? '' : 'none');
motionProblems.forEach(p => console.log('   - ' + p));
const total = unusedTokens.length + deadClasses.length + deadFrames.length + motionProblems.length;
process.exitCode = total ? 1 : 0;
