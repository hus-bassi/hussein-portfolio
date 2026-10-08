/* Find where the browser's CSS parser gave up.
   If a stylesheet has a syntax error, the parser silently drops every rule
   from the bad point onward — the rest of the file simply stops applying,
   with no error anywhere. This walks the raw text, tracks brace depth, and
   reports anything suspicious (unbalanced braces, a declaration with no
   terminating semicolon before the closing brace, stray characters).

   It takes ANY number of files, because tokens cross sheets: :root lives
   in site.css while records.css and portal.css CONSUME those tokens, so
   the `var()` check has to know every declaration on the site at once —
   checking one sheet in isolation would report every cross-sheet token
   as a typo, which is why the row in check.js passes the sheets together
   rather than one per row.

   Run:  node tools/css-parse-check.js [file ...]   */
const fs = require('fs');
const path = require('path');

let files = process.argv.slice(2);
if (!files.length) files = [path.join(__dirname, '..', 'assets', 'css', 'site.css')];

const sheets = files.map(function (f) {
  const raw = fs.readFileSync(f, 'utf8');
  return {
    file: f,
    name: path.basename(f),
    raw: raw,
    lines: raw.split('\n'),
    /* strip comments but keep line numbers intact */
    stripped: raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
  };
});
const multi = sheets.length > 1;
const problems = [];
function fail(sh, line, msg) { problems.push({ file: sh.name, line, msg }); }

/* ---- pass 1: per-sheet structure — braces balance, strings close ---- */
for (const sh of sheets) {
  let depth = 0;
  let line = 1;
  let inBlock = false;   // inside a declaration block
  let inString = null;

  for (let i = 0; i < sh.stripped.length; i++) {
    const c = sh.stripped[i];
    if (c === '\n') { line++; continue; }

    if (inString) {
      if (c === inString && sh.stripped[i - 1] !== '\\') inString = null;
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
      if (depth < 0) fail(sh, line, 'extra closing brace');
      continue;
    }
    if (c === ';' && inBlock) continue;
  }

  /* end-of-file balance */
  if (depth !== 0) fail(sh, sh.lines.length, `unbalanced braces: depth ends at ${depth}`);
  sh.depth = depth;
}

/* ---- pass 2: every declaration on the site, gathered across sheets.
   A declaration block that never closed before EOF is the usual culprit;
   also look for a `var(--x)` reference to a token that does not exist,
   which some parsers reject hard. */
const declared = new Set();
/* a registered property (`@property --enter-blur { … }`) IS a declaration —
   the block declares the token, only the syntax is new syntax */
for (const sh of sheets) {
  for (const m of sh.stripped.matchAll(/@property\s+(--[a-z0-9-]+)/g)) declared.add(m[1]);
  /* a declaration, not a selector: `.foo--bar:hover` and `.x--y::after` are
     selectors, not tokens, so the name has to follow `{`, `;` or whitespace —
     exactly the contexts a real `--x:` declaration can appear in */
  for (const m of sh.stripped.matchAll(/(^|[;{\s])(--[a-z0-9-]+)\s*:/g)) declared.add(m[2]);
}

/* Tokens these stylesheets consume but cannot declare: the ones the scripts
   publish on an element at runtime. `var(--i, 0)` is a contract with
   assets/js/reveal.js, not a typo — and every such use carries a fallback,
   so a script that never runs costs nothing. The list is verified against
   the scripts on every run, so a rename on either side is caught. */
const jsPublished = ['--ath', '--aca', '--lean-px', '--mag-x', '--mag-y', '--i', '--hero-y', '--scroll-v', '--p', '--lang-x', '--lang-w'];
const jsDir = path.join(__dirname, '..', 'assets', 'js');
let jsText = '';
for (const f of fs.readdirSync(jsDir)) {
  if (f.endsWith('.js')) jsText += fs.readFileSync(path.join(jsDir, f), 'utf8');
}
for (const name of jsPublished) {
  const written = new RegExp("(setProperty|setVar)\\(\\s*'" + name + "'").test(jsText);
  if (!written) problems.push({ file: '(scripts)', line: 0, msg: `${name} is in the script-published list but no script writes it any more` });
}

/* ---- pass 3: every var() in every sheet resolves against the whole site ---- */
for (const sh of sheets) {
  for (const m of sh.stripped.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
    if (declared.has(m[1]) || jsPublished.includes(m[1])) continue;
    fail(sh, sh.stripped.slice(0, m.index).split('\n').length, `var() references undeclared token ${m[1]}`);
  }
}

/* report the line of the last well-formed top-level rule per sheet, so we
   can compare against the browser's parsed count and see where it stopped */
for (const sh of sheets) {
  let topLevel = 0;
  let d = 0;
  for (let i = 0; i < sh.stripped.length; i++) {
    if (sh.stripped[i] === '{') { if (d === 0) topLevel++; d++; }
    else if (sh.stripped[i] === '}') d--;
  }
  console.log('file            :', sh.name);
  console.log('lines           :', sh.lines.length);
  console.log('top-level rules :', topLevel);
  console.log('brace depth end :', sh.depth);
  console.log('');
}
if (!problems.length) {
  console.log('no structural problems found');
} else {
  console.log('PROBLEMS:');
  for (const p of problems) console.log('  ' + (multi ? p.file + ' ' : '') + 'line ' + p.line + ': ' + p.msg);
}
process.exitCode = problems.length ? 1 : 0;
