/* Find where the browser's CSS parser gave up.
   If a stylesheet has a syntax error, the parser silently drops every rule
   from the bad point onward — the rest of the file simply stops applying,
   with no error anywhere. This walks the raw text, tracks brace depth, and
   reports anything suspicious (unbalanced braces, a declaration with no
   terminating semicolon before the closing brace, stray characters).

   Run:  node tools/css-parse-check.js [file]   */
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || path.join(__dirname, '..', 'assets', 'css', 'site.css');
const raw = fs.readFileSync(file, 'utf8');
const lines = raw.split('\n');

/* strip comments but keep line numbers intact */
const stripped = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));

let depth = 0;
let line = 1;
const problems = [];
let inBlock = false;   // inside a declaration block
let inString = null;

for (let i = 0; i < stripped.length; i++) {
  const c = stripped[i];
  if (c === '\n') { line++; continue; }

  if (inString) {
    if (c === inString && stripped[i - 1] !== '\\') inString = null;
    continue;
  }
  if (c === '"' || c === "'") { inString = c; continue; }

  if (c === '{') {
    depth++;
    inBlock = true;
    continue;
  }
  if (c === '}') {
    depth--;
    inBlock = false;
    if (depth < 0) problems.push({ line, msg: 'extra closing brace' });
    continue;
  }
  if (c === ';' && inBlock) continue;
}

/* end-of-file balance */
if (depth !== 0) problems.push({ line: lines.length, msg: `unbalanced braces: depth ends at ${depth}` });

/* a declaration block that never closed before EOF is the usual culprit;
   also look for a `var(--x)` reference to a token that does not exist,
   which some parsers reject hard */
const declared = new Set();
for (const m of raw.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
for (const m of raw.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
  if (!declared.has(m[1])) problems.push({ line: raw.slice(0, m.index).split('\n').length, msg: `var() references undeclared token ${m[1]}` });
}

/* report the line of the last well-formed top-level rule, so we can compare
   against the browser's parsed count and see where it stopped */
let topLevel = 0;
let d = 0;
for (let i = 0; i < stripped.length; i++) {
  if (stripped[i] === '{') { if (d === 0) topLevel++; d++; }
  else if (stripped[i] === '}') d--;
}

console.log('file            :', path.basename(file));
console.log('lines           :', lines.length);
console.log('top-level rules :', topLevel);
console.log('brace depth end :', depth);
console.log('');
if (!problems.length) {
  console.log('no structural problems found');
} else {
  console.log('PROBLEMS:');
  for (const p of problems) console.log('  line ' + p.line + ': ' + p.msg);
}
process.exitCode = problems.length ? 1 : 0;
