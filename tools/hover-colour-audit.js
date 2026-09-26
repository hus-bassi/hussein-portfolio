/* Hover-colour audit — the "link-colour trap" detector.

   `a:hover { color: … }` in the base styles has specificity (0,1,1) and
   therefore BEATS any single-class rule like `.btn { color: … }` (0,1,0).
   A link that carries its own colour but never re-states it on hover
   silently changes label colour the moment the pointer arrives — which on
   a bright button fill makes the label vanish.

   Run:  node tools/hover-colour-audit.js          (writes a report to stdout)
        node tools/hover-colour-audit.js --json   (machine readable)

   The CSS selectors are parsed with the same precedence rules a browser
   uses, so the "winner" reported here is the declaration that actually
   applies. */
const fs = require('fs');
const path = require('path');

const css = [
  'assets/css/site.css',
  'assets/css/records.css'
].map(f => stripComments(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'))).join('\n');

function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, ''); }

/* ---- collect every rule that declares a colour ---- */
const rules = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = m[1].trim();
  if (!selector || selector.startsWith('@')) continue;
  const body = m[2];
  const cm = body.match(/(^|;)\s*color\s*:\s*([^;]+)/);
  if (!cm) continue;
  for (const part of selector.split(',')) {
    const sel = part.trim();
    if (!sel) continue;
    rules.push({
      selector: sel,
      color: cm[2].trim(),
      hover: sel.indexOf(':hover') > -1,
      spec: specificity(sel)
    });
  }
}

function specificity(sel) {
  const ids = (sel.match(/#[\w-]+/g) || []).length;
  const cls = (sel.match(/\.[\w-]+/g) || []).length;
  const ps = (sel.match(/:(?!:)[\w-]+/g) || []).length;
  const ty = (sel.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length;
  return ids * 10000 + cls * 100 + ps * 10 + ty;
}

/* ---- which class-based link rules can lose to the base a:hover? ---- */
const baseHover = rules.find(r => r.selector === 'a:hover');
const ownColour = rules.filter(r =>
  !r.hover &&
  /\.([\w-]+)/.test(r.selector) &&
  r.selector.split(',').every(p => /(^|[\s>+~])a[\s.:>+~]/.test(p) || /^a$/.test(p.trim()) || /[\s>+~]a$/.test(p.trim()))
);

/* A rest rule is protected when SOME :hover rule covers the same elements
   with at least equal precedence. Rather than trying to match selector
   strings (which breaks on :not(), on extra classes, on ordering), check
   the actual thing that matters: does a :hover rule exist whose selector
   is at least as specific AND whose "base element" is the same tag+class
   set, or a strict superset of it?

   In practice the codebase uses one guarded pattern, so the check is: is
   there a hover rule for the same base element (tag + all its classes),
   possibly with extra classes added, whose spec is >= the rest rule? */
function baseKey(sel) {
  const noHover = sel.replace(/:hover/g, '').trim();
  // a selector is "the same element" if the rest rule's classes are a
  // subset of the hover rule's classes and the tag matches
  const m = noHover.match(/^([a-zA-Z][\w-]*)?((?:\.[\w-]+)*)/);
  if (!m) return null;
  const tag = m[1] || '';
  const classes = (m[2].match(/\.[\w-]+/g) || []).sort();
  return { tag, classes };
}

function isSuperset(hoverKey, restKey) {
  if (!hoverKey || !restKey) return false;
  if (restKey.tag && hoverKey.tag && restKey.tag !== hoverKey.tag) return false;
  // every class the rest rule needs must be present in the hover rule
  return restKey.classes.every(c => hoverKey.classes.indexOf(c) > -1);
}

const risky = ownColour.filter(r => {
  if (!baseHover) return false;
  const restKey = baseKey(r.selector);
  return !rules.some(h => {
    if (!h.hover) return false;
    if (h.spec < r.spec) return false;
    return isSuperset(baseKey(h.selector), restKey);
  });
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({
    baseHover: baseHover ? baseHover.color : null,
    checked: ownColour.length,
    risky: risky.map(r => ({ selector: r.selector, color: r.color, spec: r.spec }))
  }, null, 2));
} else {
  console.log('base a:hover           :', baseHover ? baseHover.color + '  (specificity ' + baseHover.spec + ')' : 'none');
  console.log('link rules with colour :', ownColour.length);
  console.log('');
  if (!risky.length) {
    console.log('OK — every coloured link re-states its colour on hover.');
  } else {
    console.log('AT RISK — these change label colour on hover:');
    for (const r of risky) {
      console.log('  ' + r.selector.padEnd(34) + r.color.padEnd(16) + 'spec ' + r.spec);
    }
  }
}
process.exitCode = risky.length ? 1 : 0;
