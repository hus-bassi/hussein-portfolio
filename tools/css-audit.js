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
const ORDER = ['--motion-instant', '--motion-fast', '--motion-normal', '--motion-slow', '--motion-reveal', '--motion-cinematic', '--motion-long'];
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
for (const f of ['index.html', 'story.html', 'records.html']) {
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
