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
   .empty-state") or a filename inside one must never be reported. The
   comment is BLANKED rather than deleted, and keeps its newlines, so every
   "line N" below points at the line N in the file a person opens. Deleting
   it squashed the line numbers and sent every report to the wrong place. */
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
const css = cssFiles.map(f => stripComments(fs.readFileSync(path.join(root, f), 'utf8'))).join('\n');

/* ---- 1. unused custom properties ---- */
const declared = new Set();
/* a declaration, not a selector: `.foo--bar:hover` and `.x--y::after` must
   not read as tokens, so the name has to follow `{`, `;` or whitespace —
   exactly the contexts a real `--x:` declaration can appear in */
for (const m of css.matchAll(/(^|[;{\s])(--[a-z0-9-]+)\s*:/g)) declared.add(m[2]);
/* `@property --name {}` declares a token too; without it the registered
   --enter-blur would read as undeclared */
for (const m of css.matchAll(/@property\s+(--[a-z0-9-]+)/g)) declared.add(m[1]);
const unusedTokens = [];
for (const v of declared) {
  const uses = (css.match(new RegExp('var\\(' + v + '[,\\) ]', 'g')) || []).length;
  if (uses === 0) unusedTokens.push(v);
}

/* ---- what the markup actually uses ----
   assets/ is NOT skipped: the runtime classes are created in
   assets/js/*.js, and skipping that folder is exactly how .motion-switch
   came to be reported as dead when it very much is used.

   .kilo/ IS skipped, and it has to be. It holds Agent Manager worktrees,
   which are whole copies of this site at some past commit. A leftover
   worktree kept .of-ring, .of-ring-2 and .of-nodes alive here for a whole
   revision: the classes were dead in the live site and the check was
   satisfied by a file nobody is looking at. Evidence has to come from the
   site being checked, not from a copy of it. */
const SKIP = new Set(['node_modules', '.git', '.kilo']);
const used = new Set();
const scan = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
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
    /* assets/js/reveal.js builds its behaviour classes as
       'reveal-' + kind, from the data-reveal attribute in the markup, so no
       literal class name ever appears in a script. Reading the kinds out of
       the markup is the only honest way to know which of them exist — and
       it means a .reveal-<kind> rule with no matching data-reveal anywhere
       is reported, which is a rule written for a behaviour that is never
       asked for. */
    for (const m of text.matchAll(/data-reveal="([a-z-]+)"/g)) {
      used.add('reveal-' + m[1]);
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
  'is-loading',   /* added and removed by assets/js/intro.js, never in markup */
  /* the four media states of a record card. assets/js/records.js picks one out
     of a small map by media kind, so the three non-image modifiers never
     appear as a literal class attribute — the image state deliberately keeps
     the bare `.record-shot` class so the approved certificate card is
     unchanged. */
  'is-video', 'is-document', 'is-none'
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

/* ---- 4. the motion must be slow enough to appreciate and quick enough to
        answer ----
   Both failure modes here are silent, and both have actually happened:

     · an interaction that answers in 100–150ms does not read as an
       answer, it reads as a flash. The button's light used to cross in
       300ms and nobody could see it happen.
     · a loop fast enough to be caught in the act is a screensaver. This
       site had a button aura on 3.4s and a grain crawl on 1.1s.
   · and loops that are far too slow read as a still image, which is how an
       earlier version of this site was reported as having no animation at
       all. A 45s light field is a decision now, not a fault, and a check
       that cannot tell the difference will keep forbidding the thing it
       was written to protect.

   So the vocabulary in :root is the thing being checked, plus every raw
   time that is written where a token cannot go (each star owns its own
   clock, so those must stay per-element):

     --motion-*   250ms … 2s      interaction, and strictly increasing
     --stagger     60ms … 200ms   the gap inside a sequence
     --ambient-*  4s … 60s        a loop
     any raw time  same bounds as the family it sits in

   The reduced-motion block is exempt from the raw-time rules, because its
   whole job is to be short. It is located by brace-matching rather than
   guessed at, so a declaration is only exempt if it really is inside that
   one media query. */
const reduceBlock = /@media[^{]*prefers-reduced-motion[^{]*\{/g;
const reduceRanges = [];
for (const m of css.matchAll(reduceBlock)) {
  let depth = 0, i = m.index + m[0].length - 1;
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) break;
  }
  reduceRanges.push([m.index, i]);
}
const inReduced = idx => reduceRanges.some(r => idx >= r[0] && idx <= r[1]);

const motionProblems = [];
let loopsRead = 0, transitionsRead = 0;

const ms = (v, u) => (u === 'ms' ? parseFloat(v) : parseFloat(v) * 1000);
const BOUNDS = {
  motion: [80, 2000, '--motion-* (interaction)'],
  stagger: [60, 200, '--stagger (a gap in a sequence)'],
  ambient: [4000, 60000, '--ambient-* (a loop)']
};
/* the ladder itself, and the order it claims to be in */
const ladder = {};
for (const m of css.matchAll(/(--(?:motion|ambient|stagger)-[a-z0-9-]+)\s*:\s*([\d.]+)(ms|s)\s*;/g)) {
  const family = m[1].startsWith('--ambient') ? 'ambient' : (m[1] === '--stagger' ? 'stagger' : 'motion');
  const [lo, hi, label] = BOUNDS[family];
  const value = ms(m[2], m[3]);
  const line = css.slice(0, m.index).split('\n').length;
  if (value < lo || value > hi) {
    motionProblems.push(`line ${line}: ${m[1]} is ${value}ms — ${label} must be between ${lo}ms and ${hi}ms`);
  }
  (ladder[family] = ladder[family] || []).push([m[1], value]);
}
/* The ladder, slowest last. Every name here is asserted to exist just below,
   so a rung cannot be deleted from :root without this list being updated too
   — a token with no use and no rung is decoration, and the loop below is what
   notices. */
const ORDER = ['--motion-instant', '--motion-fast', '--motion-normal', '--motion-slow', '--motion-reveal', '--motion-cinematic'];
for (const [family, names] of [['motion', ORDER], ['ambient', ['--ambient-pulse', '--ambient-slow', '--ambient-long', '--ambient-cinematic']]]) {
  const found = (ladder[family] || []).filter(e => names.includes(e[0])).sort((a, b) => names.indexOf(a[0]) - names.indexOf(b[0]));
  for (let i = 1; i < found.length; i++) {
    if (!(found[i][1] > found[i - 1][1])) {
      motionProblems.push(`${found[i][0]} (${found[i][1]}ms) is not slower than ${found[i - 1][0]} (${found[i - 1][1]}ms) — the ladder must increase, or it is not a hierarchy`);
    }
  }
  for (const n of names) {
    if (!(ladder[family] || []).some(e => e[0] === n)) motionProblems.push(`${n} is missing from :root — the ladder has a hole where a step should be`);
  }
}

/* (b) raw times, for the places a token cannot go: each star owns its clock */
for (const m of css.matchAll(/animation(?:-duration)?\s*:[^;}]*?(\d+(?:\.\d+)?)s/g)) {
  if (inReduced(m.index)) continue;
  loopsRead++;
  const secs = parseFloat(m[1]);
  const line = css.slice(0, m.index).split('\n').length;
  if (secs < 4) {
    motionProblems.push(`line ${line}: ${secs}s loop — under 4s is caught in the act, so it reads as a screensaver rather than as depth`);
  } else if (secs > 60) {
    motionProblems.push(`line ${line}: ${secs}s loop — over 60s is a still image with a stylesheet attached`);
  }
}

for (const m of css.matchAll(/transition(-duration)?\s*:\s*([^;}]+)/g)) {
  if (inReduced(m.index)) continue;
  const isLonghand = !!m[1];
  const list = m[2];
  transitionsRead++;
  /* In a `transition` SHORTHAND the first time in each comma group is the
     duration and the second is the DELAY — and a delay is not a duration.
     Scanning the whole value flagged every staggered child in the site
     (`... var(--ease) 120ms`) as a 120ms transition, which it is not. Worse,
     "take the first number" is wrong too, because in `var(--motion-cinematic)
     var(--ease) 120ms` the first NUMBER is the delay. So: a group whose
     duration is a token has only delays in it and is skipped; a group with
     no duration token has its first raw time checked. */
  const times = isLonghand
    ? [...list.matchAll(/(\d+(?:\.\d+)?)ms/g)]
    : list.split(',')
        .filter(g => !/var\(--motion/.test(g))
        .map(g => g.match(/(\d+(?:\.\d+)?)ms/))
        .filter(Boolean);
  for (const t of times) {
    const value = parseFloat(t[1]);
    const line = css.slice(0, m.index).split('\n').length;
    /* Under 250ms is a flash with one deliberate exception: a PRESS. A
       finger going down has to be answered inside about a tenth of a second
       or the button feels broken, and a press travels exactly one pixel, so
       it cannot be mistaken for a transition that was too quick to see. It
       is written with --motion-instant, which the token check above keeps
       honest, and the raw-number rule below still catches anyone who
       hard-codes 90ms instead. */
    if (value < 80) {
      motionProblems.push(`line ${line}: ${value}ms transition — below 80ms even a press is a flicker; use a --motion-* token`);
    } else if (value < 250 && !/instant/.test(list) && !m[0].includes(':active')) {
      motionProblems.push(`line ${line}: ${value}ms transition — under 250ms is a flash, not an answer; use a --motion-* token`);
    } else if (value > 2000) {
      motionProblems.push(`line ${line}: ${value}ms transition — over 2s stops feeling like a response to the visitor`);
    }
  }
}

/* A LINK COLOUR RULE WHOSE SELECTOR CANNOT MATCH.
   `a.primary-nav a` reads as "an anchor inside an anchor with a class" —
   and `.primary-nav` is on a <nav>. The selector is well formed, the
   specificity is right, and it matches nothing at all, so every label in
   the header silently fell back to the base `a` colour (azure at rest,
   gold on hover) while the stylesheet said something else entirely. The
   hover-colour audit could not see it: it asks whether a hover rule
   EXISTS, not whether the selector is reachable from the markup.

   So: a type-qualified ANCESTOR link rule is only honest if the class it
   names is on an element in the markup that is not itself an anchor. */
const classOwners = new Map();
for (const f of ['index.html', 'story.html', 'records.html', 'volleyball.html', 'academic.html', 'projects.html', 'project.html']) {
  const file = path.join(root, f);
  if (!fs.existsSync(file)) continue;   /* a partial tree is still worth auditing */
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<([a-zA-Z][a-z0-9-]*)\b[^>]*\bclass="([^"]+)"/g)) {
    const tag = m[1].toLowerCase();
    for (const c of m[2].split(/\s+/)) {
      if (!c) continue;
      if (!classOwners.has(c)) classOwners.set(c, new Set());
      classOwners.get(c).add(tag);
    }
  }
}
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1];
  if (!/\bcolor\s*:/.test(m[2])) continue;
  const bad = /^a\.([a-zA-Z][a-z0-9_-]*)\s+a\b/.exec(sel.trim());
  if (!bad) continue;
  /* `a.CLASS a` needs an anchor that carries CLASS, and an anchor inside it.
     In this site `.primary-nav` and `.footer-nav` are on a <nav>, so those
     selectors never matched a single element. */
  const owners = classOwners.get(bad[1]);
  const reachable = owners && owners.has('a');
  if (!reachable) {
    motionProblems.push(`line ${css.slice(0, m.index).split('\n').length}: ${sel.trim().slice(0, 46)} cannot match — .${bad[1]} is on ${owners ? [...owners].join('/') : 'nothing in the markup'}, and a rule that matches nothing outranks nothing (drop the type qualifier)`);
  }
}

/* the rules of both stylesheets, parsed once, comments removed, for the
   structural checks below (one owner per channel, an overlay inside a
   clipped box) — these are questions about the SHAPE of the sheet, not
   about a declaration in one place */
const ruleList = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2].replace(/\/\*[\s\S]*?\*\//g, '') }));

/* (g) A CONTROL HAS ONE OWNER PER MOTION CHANNEL.
   The button had three writers on one element: the arrival wrote
   `translate`, hover and the magnetic pull wrote `transform`, and the
   arrival ALSO wrote `filter: blur()` while hover wrote
   `filter: drop-shadow()` — one property, two systems, so the glow was a
   blur for two seconds and popped afterwards. Nothing looks broken in a
   screenshot of the result, which is why it needs a rule: there must be
   exactly ONE transform expression for the control family, no `translate`
   on a control at all, the arrival keyframe must write only registered
   variables, and every hover `filter` must keep the arrival's blur channel
   instead of replacing the whole property. */
const FAMILY = /(^|[\s,>+~])(:is|\.)(btn|btn-solid|btn-outline|record-action|to-top)([\s,.:>+~]|$)/;
const isState = sel => /:(hover|active|focus|focus-visible|disabled|is-[a-z-]+)|\.is-loading/.test(sel);
const cancelsMotion = body => /transform:\s*none|translate:\s*none/.test(body);
let canonicalTransforms = 0;
let familyRules = 0;
let familyTransforms = 0;
for (const r of ruleList) {
  /* a PSEUDO-ELEMENT is a different element and is allowed its own transform:
     the shine is supposed to travel inside the button, and that is what it is
     for. The rule is about writers on the CONTROL itself. */
  if (r.sel.includes('::')) continue;
  if (!FAMILY.test(r.sel) || r.sel.trim().startsWith('@')) continue;
  familyRules++;
  const declares = p => new RegExp('(^|[;{ ])' + p + '\\s*:').test(r.body);
  const line = css.slice(0, css.indexOf(r.sel)).split('\n').length;
  if (!cancelsMotion(r.body) && !isState(r.sel)) {
    if (declares('transform')) {
      familyTransforms++;
      if (/transform\s*:[^;]*var\(--enter-y\)/.test(r.body)) canonicalTransforms++;
      else if (!cancelsMotion(r.body)) {
        motionProblems.push(`line ${line}: ${r.sel.trim().slice(0, 46)} writes its own transform — the control family's ONE transform is the composed expression that reads --enter-y`);
      }
    }
    if (declares('translate')) {
      motionProblems.push(`line ${line}: ${r.sel.trim().slice(0, 46)} writes \`translate\` on a control — the arrival channel is \`--enter-y\`, and a second channel is how the body and its layers came apart`);
    }
    if (declares('filter') && /drop-shadow/.test(r.body) && !/var\(--enter-blur\)/.test(r.body) && !/filter:\s*none/.test(r.body)) {
      motionProblems.push(`line ${line}: ${r.sel.trim().slice(0, 46)} writes a bare drop-shadow — the arrival's blur channel must ride in the same filter or the glow is replaced mid-animation`);
    }
  }
}
/* only meaningful on a sheet whose controls actually MOVE: the self-test's
   fixtures deliberately have controls with no motion, and a rule that cannot
   be satisfied by a minimal stylesheet is a rule that reports noise */
if (familyTransforms && canonicalTransforms !== 1) {
  motionProblems.push(`the control family declares ${familyTransforms} transforms across ${familyRules} rules but only ${canonicalTransforms} composed one — exactly one expression may own a control's motion`);
}
for (const [, name, body] of css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)) {
  if (!/cta-in|arrive|enter/.test(name)) continue;
  if (/(^|[;{ ])(transform|translate|filter)\s*:/.test(body)) {
    motionProblems.push(`@keyframes ${name} writes a composed property directly — an arrival may only write registered variables and opacity, so the control's one expression is never contested`);
  }
  if (!/--enter-y/.test(body)) {
    motionProblems.push(`@keyframes ${name} does not move the control at all — the arrival belongs in --enter-y, which the one transform reads`);
  }
}

/* (f) A MOVING OVERLAY MUST LIVE INSIDE A CLIPPED BOX.
   The hero buttons lost `position: relative; overflow: hidden` when the
   button recipe was rewritten, and nothing noticed for a long time: the
   sweep and the tint are absolutely positioned with `inset: 0`, which
   resolves against the nearest POSITIONED ANCESTOR — so with no containing
   block of their own they were laid out against `.hero-copy`, and a
   100%-wide spectrum rectangle appeared BESIDE the control instead of on
   it. No offset was ever wrong; the coordinate system was.

   So for every absolutely positioned pseudo-element that TRAVELS (a
   translate, a transform, or a negative inset), the host must both
   establish a containing block and clip. A child cannot paint outside a
   clipped parent, which is why this is a structural rule and not a
   position-tweak rule. */
/* Overlays that are ALLOWED to be seen outside their host, and why. Each
   one is a designed halo rather than a surface that belongs to a control:
   the language pill's glow is the same kind of thing as the buttons' aura,
   and clipping it would cut a glow that was approved. The pill's own box is
   contained by measurement — it is placed from the active button's real
   offset — so it has no geometry to escape with. */
const haloIsDesigned = new Set(['.lang-switch']);
const declsFor = (base) => {
  const out = [];
  for (const r of ruleList) {
    if (r.sel === base || r.sel.split(',').map(s => s.trim()).includes(base)) out.push(r.body);
  }
  return out.join(';');
};
for (const r of ruleList) {
  const moving = /position:\s*absolute/.test(r.body) &&
    (/(^|[;{\s])translate:\s*(?!none)/.test(r.body) || /transform:\s*(?!none)\s*[a-z]/.test(r.body) ||
     /(^|[;{\s])(inset|inset-inline|inset-block|left|right|top|bottom|inset-inline-start|inset-inline-end)[^:;]*:\s*-/.test(r.body));
  if (!moving) continue;
  for (const part of r.sel.split(',')) {
    const t = part.trim();
    const m = t.match(/^(.+?)::(before|after)$/);
    if (!m) continue;
    const base = m[1].trim();
    if (!base || /[\s>+~]/.test(base) || base.includes(':')) continue;
    if (haloIsDesigned.has(base)) continue;
    const d = declsFor(base);
    const ctx = /position:\s*(relative|absolute|sticky)/.test(d);
    const clip = /overflow:\s*(hidden|clip)/.test(d);
    const line = css.slice(0, css.indexOf(r.sel)).split('\n').length;
    if (!ctx) {
      motionProblems.push(`line ${line}: ${t} is positioned against the nearest positioned ANCESTOR, not against ${base} — a moving overlay needs \`position: relative\` on its own host`);
    } else if (!clip) {
      motionProblems.push(`line ${line}: ${t} travels but ${base} does not clip — it will be seen outside the control it belongs to`);
    }
  }
}

/* (d) A DECORATIVE NUMERAL MUST NOT BE TAKEN OUT OF THE FLOW.
   `.sec-index` was absolutely positioned at `inset-inline-start: -.06em`,
   which put a 104px block of digits six hundredths of an em before the
   start of a 38px heading — the same box as the first four letters, in both
   directions, and the mirroring meant Arabic collided with denser glyphs.
   The repair was structural (its own line, plus --section-number-gap), not
   cosmetic, and the only way to put the collision back is to position it
   again. So: a numeral in the flow, and the gap token doing the separating. */
for (const m of css.matchAll(/([^{}]*\.sec-index[^{}]*)\{([^{}]*)\}/g)) {
  const pos = /\bposition:\s*(absolute|fixed|sticky)\b/.exec(m[2]);
  if (pos) {
    motionProblems.push(`line ${css.slice(0, m.index).split('\n').length}: ${m[1].trim().slice(0, 40)} is taken out of the flow (position: ${pos[1]}) — a decorative numeral belongs on its own line, separated by --section-number-gap, or it lands inside the heading`);
  }
}

/* (c) THE TRAP THIS FILE EXISTS FOR, restated. A reduced-motion rule that
   scales a duration by (1 - --still) at the TOP LEVEL is not a reduced
   motion rule at all: the multiply also runs when --still is 0, so every
   loop it touches is forced to its fallback. That is exactly what happened
   here — `calc(var(--real-dur, 1s) * (1 - var(--still)))` pinned the whole
   site to 1s, which is what "everything moves too fast" turned out to be.
   The rule belongs inside the media query, so this check refuses the
   arithmetic wherever it finds it. */
for (const m of css.matchAll(/(animation|transition)-duration\s*:[^;}]*var\(--still\)[^;}]*/g)) {
  if (inReduced(m.index)) continue;
  const line = css.slice(0, m.index).split('\n').length;
  motionProblems.push(`line ${line}: a duration scaled by var(--still) outside the reduced-motion query — it overrides every real duration while motion is ON`);
}

/* (d) A SURFACE MUST NOT PAINT A LIGHT INSIDE ITSELF.
   A surface that carries a radial gradient, or a white/near-white gradient
   layer, over its own content reads as a lamp pointed at it: the pale patch
   moves across the card whatever the card contains, it competes with the
   text, and it needs JavaScript to follow the pointer. The panes here are
   dark panels with a spectrum border; the light belongs to the page, not to
   the card. So a pane may not declare either, and a card may not be leaned
   in 3D. Both were tried and both are gone. */
const PANES = /\.(card|record|stage|stat|social|empty-state|search|btn|btn-solid|btn-outline|record-action|tag|to-top|search-clear)\b/;
const surfaceRules = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = m[1];
  if (selector.trim().startsWith('@')) continue;
  if (!PANES.test(selector)) continue;
  const body = m[2];
  const paints = /background[^;]*(radial-gradient|conic-gradient)/.test(body) ||
                 /background[^;]*rgba\(\s*2[0-5]\d\s*,\s*2[0-5]\d\s*,\s*2[0-5]\d/.test(body) ||
                 /background[^;]*(#fff\b|#ffffff|rgba\(\s*255\s*,\s*255\s*,\s*255)/.test(body);
  if (paints) {
    surfaceRules.push(`line ${css.slice(0, m.index).split('\n').length}: ${selector.trim().slice(0, 60)} paints a light inside the surface — the interior must stay dark and only the edge may react`);
  }
}
motionProblems.push(...surfaceRules);

/* A HOVER STATE MAY NOT LOOP. The light that crosses a button is one
   interaction: it plays once on the way in and is not replayed on the way
   out. An infinite animation on a :hover selector is either that sweep
   written carelessly — and a loop is exactly the "news ticker" that made
   the marquee feel cheap — or some other motion nobody asked to be
   continuous, and both read as a button that cannot settle. Ambient loops
   are fine; they are on :root and never on a hover. */
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = m[1];
  if (!/:hover|:focus-visible|:active/.test(selector)) continue;
  if (/infinite/.test(m[2])) {
    motionProblems.push(`line ${css.slice(0, m.index).split('\n').length}: ${selector.trim().slice(0, 60)} runs an infinite animation on an interactive state — a sweep is played once, not looped`);
  }
}

/* the lean, for the same reason: a card that rotates toward the pointer
   needs the pointer's position inside the card, which means a layout read
   and a style write on every frame of every hover */
for (const m of css.matchAll(/transform\s*:[^;}]*(perspective\(|rotate3d\(|rotateX\(|rotateY\()/g)) {
  motionProblems.push(`line ${css.slice(0, m.index).split('\n').length}: a 3D lean on ${m[0].slice(0, 40)} — surfaces do not rotate toward the pointer; the hover is a lift`);
}

/* (e) A CARD IS COMPOSED, NOT STRETCHED.
   The record card went through a pass that made the information column
   stretch to the media's height and pushed the action row to the bottom of
   it with `margin-top: auto`. It looked deliberate and produced a large
   dead area under a tall portrait certificate: the text did not need the
   height, the media did not need to be that tall, and the two together
   produced a mostly-empty panel.

   So three rules, all of them things that can be written by accident:
     · no record surface may carry an artificial min-height
     · the info column may not stretch to its row
     · the action row may not be pushed to the bottom of that column
   and one that keeps the fix generic: no per-record selector, ever. */
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim();
  if (!/^\.?record/.test(sel)) continue;
  const body = m[2];
  const line = css.slice(0, m.index).split('\n').length;
  const minH = /min-height:\s*(\d+)px/.exec(body);
  if (minH && parseInt(minH[1]) >= 300) {
    motionProblems.push(`line ${line}: ${sel.slice(0, 40)} sets a ${minH[1]}px min-height — a card's height comes from its content and a bounded preview, never from a number`);
  }
  if (/align-self:\s*stretch/.test(body) || /min-height:\s*100%/.test(body)) {
    motionProblems.push(`line ${line}: ${sel.slice(0, 40)} stretches the info column to the media's height — that is what leaves a dead area under a tall preview`);
  }
  if (/record-actions/.test(sel) && /margin-(top|block-start):\s*auto/.test(body)) {
    motionProblems.push(`line ${line}: the action row is pushed to the bottom of the column — the buttons follow the facts they belong to`);
  }
  if (/\[data-(id|record|slug)=/.test(sel) || /\.record\s*:nth-child/.test(sel) || /\.record\s*:first-child|\.record\s*:last-child/.test(sel)) {
    motionProblems.push(`line ${line}: ${sel.slice(0, 44)} targets ONE record — the card system is generic and every record must be laid out by the same rule`);
  }
}

/* ============================================================
   A DELAY ON A GATE THAT IS ONLY EVER LEFT.

   A transition takes its duration, its easing and its DELAY from the state
   it is ENTERING. `.is-loading` is added to <html> by assets/js/intro.js
   before any hero element is styled, and it is only ever REMOVED — the
   `released` flag in that file makes the removal idempotent, and nothing
   anywhere adds the class back. So it is a state the page only ever leaves,
   never enters from a rendered state, and there is therefore no transition
   into it for a delay to govern.

   Every beat in the hero's opening was written on the leaving side:

       .is-loading .hero-head { transition-delay: 800ms; }

   Measured, before this was fixed: the whole hero arrived as ONE 800ms block
   at delay 0, and the three CTAs rode 28px out from under the pointer
   together as a single rigid step. Seven beats, documented in the source,
   none of which had ever run — the choreography was a comment describing an
   intention rather than a behaviour.

   The repair is not to make the gate clever. The delay goes on the RESTING
   selector, which is the state being entered, and this check is what stops
   the whole class from coming back. */
for (const m of css.matchAll(/([^{}]*\.is-loading[^{}]*)\{([^{}]*)\}/g)) {
  if (!/transition-delay\s*:/.test(m[2])) continue;
  motionProblems.push(`line ${css.slice(0, m.index).split('\n').length}: \`${m[1].trim().replace(/\s+/g, ' ').slice(0, 46)}\` puts a transition-delay on \`.is-loading\` — that class is added before first paint and only ever removed (assets/js/intro.js), so nothing ever transitions INTO it and the delay governs nothing. The delay belongs on the resting selector, which is the state being entered`);
}

/* ============================================================
   ONE TRANSITION LIST PER ELEMENT — the shorthand trap.
   `transition` is a shorthand for the LIST of properties, not a property of
   its own, so a second declaration on the same element REPLACES the list
   instead of adding to it. Two rules can therefore each look correct and
   together quietly delete half the motion:

       .shot-media            { transition: opacity, translate }
       button.record-shot img { transition: scale }

   The picture that matches both is a video still inside a pressable frame.
   It got `transition-property: scale`, so its `opacity: 0 -> 1` arrival and
   its 14px rise had no transition on them at all: re-adding `is-loaded`
   produced zero animations and the still snapped into the card in one frame.
   The dialog's still was untouched, because `.cert-stage` is not a <button>
   and never met the second rule — which is what made it read as intentional.

   The same trap took the hero orbit: `.hero-visual` was given
   `transition: scale …` for the scroll-speed response, and that replaced all
   three of the opening sequence's properties — the live CSSOM read
   `transition-property: scale` and `transition-delay: 0s` on it, so the orbit
   never arrived and the 600ms beat written for it had nothing to delay. The
   check used to be scoped to pictures, which is precisely why it sat there
   green while the hero quietly lost its entrance.

   So it is no longer scoped. Any two rules that can reach the SAME element
   with a `transition` shorthand must name the SAME properties. That needs a
   selector engine, so there is a small one below: it reads the three pages,
   builds an element tree, and answers "is there an element both of these
   could match". It deliberately OVER-approximates — `:nth-child()`, `:is()`,
   `:not()` and `*` are read as always-true — because a check that misses a
   collision because it modelled a corner correctly is the failure mode this
   whole file exists to prevent. Being over-eager here costs a report line;
   being under-eager costs a silent half-dead animation. And it refuses to
   pass quietly on a selector it could not resolve. */
/* The pages, as a tree. Not a general parser — a tag scanner over
   the attributes this site's markup actually uses.

   `is-loading` is seeded onto <html> by hand for the one reason that matters
   here: intro.js puts it there, so it is the parent of everything on the
   page, and a rule scoped to it reaches every element. Without the seed the
   matcher resolves `.is-loading .hero-head` to nothing and every collision
   inside the opening sequence is invisible — the exact region this check
   exists to police, and a blind spot shaped like the bug it was written for
   is worse than no check at all. */
const elements = [];
for (const f of ['index.html', 'story.html', 'records.html', 'volleyball.html', 'academic.html', 'projects.html', 'project.html']) {
  const file = path.join(root, f);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const stack = [];
  const rootEl = { tag: 'html', file: f, classes: new Set(['is-loading']), attrs: new Set(), parent: null };
  elements.push(rootEl);
  stack.push(rootEl);
  const tagRe = /<(\/?)([a-zA-Z][a-z0-9-]*)((?:\s[^>]*?))?(\/?)>/g;
  let m;
  while ((m = tagRe.exec(html))) {
    const [, close, rawTag, rawAttrs, selfClose] = m;
    const tag = rawTag.toLowerCase();
    if (close) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    const attrs = rawAttrs || '';
    /* the real <html> IS the seeded node, not a child of it */
    if (tag === 'html' && stack[0] === rootEl) {
      for (const c of ((/\bclass="([^"]*)"/.exec(attrs) || [, ''])[1]).split(/\s+/)) if (c) rootEl.classes.add(c);
      for (const a of attrs.matchAll(/\b([a-zA-Z-]+)=/g)) rootEl.attrs.add(a[1].toLowerCase());
      continue;
    }
    const el = {
      tag,
      file: f,
      classes: new Set(((/\bclass="([^"]*)"/.exec(attrs) || [, ''])[1]).split(/\s+/).filter(Boolean)),
      attrs: new Set(Array.from(attrs.matchAll(/\b([a-zA-Z-]+)=/g), x => x[1].toLowerCase())),
      parent: stack.length ? stack[stack.length - 1] : null
    };
    elements.push(el);
    if (!selfClose && !/^(br|hr|img|input|meta|link|source|track|area|base|col|embed|param|wbr)$/.test(tag)) {
      stack.push(el);
    }
  }
}

/* split a selector list on its top-level commas only */
function splitTop(s, sep) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

/* one selector -> its compounds, outermost first. A dynamic pseudo decides
   WHEN, never WHICH element, so `:hover` is dropped: the element a hover
   rule reaches is the same element its base rule reaches, which is exactly
   why the shorthand collides with it. */
function parseSelector(sel) {
  const parts = splitTop(sel.replace(/\s*>\s*/g, ' > ').replace(/\s+/g, ' '), ' ')
    .flatMap(p => p.split('>').map(x => x.trim()).filter(Boolean));
  return parts.map(compound => {
    const c = { tag: null, classes: [], attrs: [], id: null };
    const head = /^[a-zA-Z][a-z0-9-]*/.exec(compound);
    let rest = compound;
    if (head) { c.tag = head[0].toLowerCase(); rest = compound.slice(head[0].length); }
    for (const t of rest.matchAll(/\.([a-zA-Z0-9_-]+)/g)) c.classes.push(t[1]);
    for (const t of rest.matchAll(/#([a-zA-Z0-9_-]+)/g)) c.id = t[1];
    for (const t of rest.matchAll(/\[[^\]]*?([a-zA-Z-]+)\s*[~|^$*]?=?/g)) c.attrs.push(t[1].toLowerCase());
    return c;
  });
}

function compoundMatches(c, el) {
  if (c.tag && c.tag !== el.tag) return false;
  for (const k of c.classes) if (!el.classes.has(k)) return false;
  for (const k of c.attrs) if (!el.attrs.has(k)) return false;
  return true;
}

function selectorMatches(compounds, el) {
  if (!compoundMatches(compounds[compounds.length - 1], el)) return false;
  let idx = compounds.length - 2;
  let node = el.parent;
  while (idx >= 0) {
    if (!node) return false;
    if (compoundMatches(compounds[idx], node)) idx--;
    else node = node.parent;
  }
  return true;
}

/* Which of two rules actually WINS the list. Without this the check reports
   every pair that differs, including the harmless case where the winner names
   a SUPERSET of the loser's properties and nothing is lost at all — which is
   exactly what `.primary-nav a { transition: color, background }` does to the
   bare `a { transition: color }`, and reporting that would be a check crying
   wolf on its first day.

   Specificity is the normal (a, b, c) triple; on a tie the LATER rule in the
   source wins, which is the second half of the real cascade. A `:hover` is a
   class, `::before` is a tag, and the arguments of `:not()` / `:is()` /
   `:where()` count as themselves. */
function specificity(sel) {
  let a = 0, b = 0, cc = 0;
  for (const m of sel.matchAll(/#([a-zA-Z0-9_-]+)/g)) { a++; }
  for (const m of sel.matchAll(/\.([a-zA-Z0-9_-]+)/g)) { b++; }
  for (const m of sel.matchAll(/\[[^\]]*\]/g)) { b++; }
  for (const m of sel.matchAll(/::[a-zA-Z-]+/g)) { cc++; }
  for (const m of sel.matchAll(/:(?!:)[a-zA-Z-]+/g)) { b++; }
  for (const m of sel.matchAll(/:(not|is|where|has)\(([^)]*)\)/g)) {
    b += (m[2].match(/[.#a-zA-Z][a-zA-Z0-9_-]*/g) || []).length;
  }
  /* the tag count has to exclude anything already counted as a class or id */
  const stripped = sel
    .replace(/#[a-zA-Z0-9_-]+/g, '')
    .replace(/\.[a-zA-Z0-9_-]+/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/::?[a-zA-Z-]+/g, '')
    .replace(/:(not|is|where|has)\([^)]*\)/g, '');
  for (const m of stripped.matchAll(/\b[a-zA-Z][a-z0-9-]*\b/g)) { cc++; }
  return [a, b, cc];
}
const specGreater = (x, y) => {
  for (let k = 0; k < 3; k++) if (x[k] !== y[k]) return x[k] > y[k];
  return false;   /* a tie is broken by source order, and `order` decides it */
};

/* every rule that can reach an element with a `transition` shorthand */
const listRules = [];
const unreadableSelectors = [];
for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
  const sel = m[1].trim();
  if (!sel || sel.startsWith('@')) continue;
  /* The reduced-motion block collapses the whole arrival into one plain
     400ms fade on purpose — `transition: opacity 400ms linear !important`
     is meant to replace a five-property list, because the whole point of
     still mode is LESS movement rather than a tidier version of the same
     movement. It is exempt here for the same reason it is exempt from the
     raw-time rules, and the header line reports how many blocks were
     skipped, so the exemption is visible rather than silent. */
  if (inReduced(m.index)) continue;
  /* `transition-property` / `-duration` / `-timing-function` / `-delay` are
     longhands and ADD to the list. Only the bare shorthand replaces it. */
  if (!/(^|[;{\s])transition\s*:/.test(m[2])) continue;
  const line = css.slice(0, m.index).split('\n').length;
  const order = m.index;
  const props = (/transition\s*:\s*([^;}]+)/.exec(m[2])[1]).split(',').map(p => p.trim().split(/[\s(]/)[0]).filter(Boolean);
  for (const one of splitTop(sel, ',')) {
    /* a pseudo-ELEMENT is a different box with its own list. `.x` and
       `.x::after` are two elements, not one, and their shorthands never
       touch each other — the sweep under a button lives on `::before`
       precisely so it can have its own clock. */
    if (one.includes('::')) continue;
    const compounds = parseSelector(one);
    /* a compound with nothing in it is a selector this matcher cannot
       resolve — `*`, `:is()`, a bare pseudo. Report it rather than skip it:
       a check that quietly ignores what it cannot parse has already missed
       one, which is the failure this file exists to prevent. */
    if (!compounds.length || compounds.some(c => !c.tag && !c.classes.length && !c.attrs.length)) {
      unreadableSelectors.push(one);
      continue;
    }
    /* one line, always: a selector written as a comma list spans lines, and a
       report that breaks mid-message cannot be grepped or asserted on */
    listRules.push({ sel: one.replace(/\s+/g, ' '), compounds, props, line, order, spec: specificity(one) });
  }
}
for (const one of unreadableSelectors) {
  motionProblems.push(`a \`transition\` shorthand on \`${one}\` could not be resolved to any element — a selector the check cannot parse is a collision it has already missed`);
}
/* A check that reads nothing has not passed, it has stopped working. Two ways
   this one goes blind without anyone noticing: the pages stop being found
   (every rule then reaches nothing, so no pair ever collides), or the
   shorthand stops being recognised. Both used to be silent. */
if (!elements.length) {
  motionProblems.push(`no markup was found for the transition-list check — it resolved ${listRules.length} rule(s) against ZERO elements, so it cannot detect a single collision. That is a broken check, not a clean stylesheet`);
} else if (!listRules.length) {
  motionProblems.push(`no \`transition\` shorthand was found in ${elements.length} elements of markup — the list-collision check has nothing to compare and is currently vacuous`);
}

const reached = listRules.map(r => new Set(elements.filter(el => selectorMatches(r.compounds, el))));
for (let i = 0; i < listRules.length; i++) {
  for (let j = i + 1; j < listRules.length; j++) {
    if (![...reached[i]].some(el => reached[j].has(el))) continue;
    /* which one owns the list, and what does the loser lose by it */
    const iWins = specGreater(listRules[i].spec, listRules[j].spec) ||
                 (!specGreater(listRules[j].spec, listRules[i].spec) && listRules[i].order > listRules[j].order);
    const win = iWins ? listRules[i] : listRules[j];
    const lose = iWins ? listRules[j] : listRules[i];
    /* only the LOSER's properties can be dropped: a winner that names MORE
       than the loser deletes nothing. That is the whole difference between a
       real collision and two rules that happen to differ. */
    const lost = lose.props.filter(p => !win.props.includes(p));
    if (!lost.length) continue;
    motionProblems.push(`line ${lose.line}: \`${lose.sel.slice(0, 40)}\` transitions ${lost.join(', ')} and \`${win.sel.slice(0, 40)}\` (line ${win.line}) wins the cascade on the same element without it — \`transition\` is a shorthand for the LIST, so it REPLACES rather than adds, and ${lost.join(' and ')} stop animating there. Write the list once as transition-property/-duration/-timing-function, or fold \`${lose.sel.split(/[ >:]/).pop()}\` into it`);
  }
}

/* A MEDIA PREVIEW IS BOUNDED AND NEVER CROPPED.
   The preview may be any size its own ratio asks for UP TO a ceiling; the
   ceiling is what keeps a portrait scan from deciding the height of the
   card. And it is contained, because a credential that loses its edges is
   not a preview of a credential. */
let shotRules = 0, shotBounded = 0, contained = 0;
for (const m of css.matchAll(/([^{}]*\.record-shot[^{}]*)\{([^{}]*)\}/g)) {
  shotRules++;
  if (/max-height:\s*(clamp\([^)]*\)|\d+px)/.test(m[2])) shotBounded++;
}
if (shotRules && !shotBounded) {
  motionProblems.push('.record-shot has no max-height — a preview without a ceiling lets a portrait image decide the height of the card');
}
if (shotRules && !/\.record-shot\s+img\s*\{[^}]*object-fit:\s*contain/.test(css)) {
  motionProblems.push('.record-shot img is not object-fit: contain — a preview must never crop or stretch what it previews');
}

console.log('tokens declared:', declared.size, '| classes referenced:', used.size);
console.log('motion read    :', (ladder.motion || []).length, 'interaction +', (ladder.ambient || []).length,
            'ambient tokens,', loopsRead, 'raw loops,', transitionsRead, 'transition shorthands' +
            (reduceRanges.length ? ', ' + reduceRanges.length + ' reduced-motion block(s) exempt' : ''));
console.log('');
console.log('UNUSED TOKENS :', unusedTokens.length ? unusedTokens.join(', ') : 'none');
console.log('DEAD CLASSES  :', deadClasses.length ? deadClasses.join(', ') : 'none');
console.log('DEAD KEYFRAMES:', deadFrames.length ? deadFrames.join(', ') : 'none');
console.log('MOTION PROBLEMS:', motionProblems.length ? '' : 'none');
motionProblems.forEach(p => console.log('   - ' + p));
const total = unusedTokens.length + deadClasses.length + deadFrames.length + motionProblems.length;
process.exitCode = total ? 1 : 0;
