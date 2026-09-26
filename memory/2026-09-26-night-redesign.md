# 2026-09-26 (part 2) — the night redesign

## What Hussein asked for

The site was "نهاري" (light) and he wanted the opposite: **black at the base**,
with a gradient **violet → gold → azure**, everything luminous, everything
animated — buttons, text, hovers, all of it — and buttons that are *always*
lit, not just on hover. He could not describe it in design terms, so the brief
was: "أسود في الأساس، الأولان اللي حكيتهالك، عايز الموقع كانه ليه هيبة كانه
له aura، انيميشن كتير، فخامة رهيبة، حاجات بتنور بجدد… كل زر دايماً ينور… وموقع
كامل مترباط ببعض".

**And a standing engineering rule, in his words:**

> "عايز قاعدة أساسية اما تيجي أقولك تعديل تشيل القديم وتبني التصميم الجديد،
> يعني متحطش حاجات فوق بعض، ملهاش لازمة اللي ملوش لازمة امسحه، عشان كود
> بتاعنا يكون نضيف"

→ **When a design change comes, REWRITE, don't stack.** Delete what the change
made pointless. No "section 20" appended under a "section 19". See the
*No Stacking Rule* in AGENTS.md — it is now a standing instruction.

## What was done

**`assets/css/site.css` was rewritten from scratch** (1154 lines / 19 sections
→ 1055 lines / 18 ordered sections). Nothing from the light theme was kept
except structure that still made sense. The old file is gone, not overridden.

The night system:
- `--void #04050A` page floor; bands are **translucent** so the light field
  shows through them (that is what gives the page depth)
- **one spectrum, two tiers**: `--spectrum` (deep: borders, glows, hairlines)
  and `--spectrum-lit` (light: anything that carries text or a fill). Two
  tiers is the whole rule — a third would be decoration for its own sake.
- `body::before` = the light field: three slow colour clouds
  (violet .16 / gold .10 / azure .13) drifting on a 38s alternate cycle.
  Alphas are deliberately low: the brightest composite a band can present is
  `#101422`, and every text colour is audited against exactly that.
- `body::after` = 4% grain, so the black is not flat digital void.
- **The shared pane recipe** — `--edge` (opaque fill) + `--spectrum` (edge) as
  two background layers, with `--edge-rest` / `--edge-hi` as the two positions.
  One recipe, used by card/record/stage/stat/social/empty-state/search/button.
  Hover sweeps the edge to `--edge-hi`. Written once, hovers everywhere.
- `@keyframes aura` — the glow every button breathes on, cycling violet →
  gold → azure box-shadow over 6s. This is the "always lit" button.
- The spectrum threads down the page: one hairline per band (`.band::before`),
  one under each section head (`.sec-head::after`), the progress rail, the
  marquee, the ghost numerals, the name, the titles, the footer watermark.
  Same three colours everywhere = one object, not a set of pages.
- `prefers-reduced-motion`: every animation stops, **the spectrum stays**.
  Only the movement goes.

**`assets/css/records.css` rewritten** to own only what exists on the records
page (search, filters, match highlight). `.sr-only` moved to site.css — it is
used on all three pages, so it was never this file's business.

**Dead code deleted** (Hussein's rule, applied literally):
- `.sub-head` — had rules, zero users
- `cards-projects` — a class on the markup with no rules
- `btn-ghost` — a modifier with no rules left; `.btn` covers it
- `--s-10` — a scale step nothing used

## New tools

- **`tools/css-audit.js`** — the enforcement mechanism for the no-stacking rule.
  Reports unused custom properties, class selectors that match nothing, and
  unreferenced `@keyframes`. Strips comments first (a class named in prose is
  not a class) and knows the classes the JS builds at runtime. Current state:
  **0 unused tokens, 0 dead classes, 0 dead keyframes.**
- **`tools/contrast-audit.js`** — rewritten for the night. Builds the real
  background stack (void → colour clouds → translucent band) instead of
  assuming flat colours, and re-measures under the grain. **24/24 pairs ≥ 4.5:1**
  clean and worst-case. Run it after any colour change.

## QA

**63/63 cases clean** (3 pages × 3 languages × 7 widths, 360→1440).

### Two harness bugs found and fixed (both were mine, not the site's)

1. **`visibleWidth()`** — the harness window is ~484px wide but it renders cases
   up to 1440px. An iframe wider than its window is **clipped**, and
   IntersectionObserver reports intersections against the *clipped* area, so an
   element plainly inside the page reported `isIntersecting: false`. Every
   on-screen test now measures against the visible slice; overflow is still
   measured against the page's own nominal width, because that is a property of
   the layout, not of the window.
2. **settle needed two consecutive clean samples** — one is not enough, because
   fonts and images can still be landing: an item below the fold at the first
   sample may be inside the viewport at the next, legitimately awaiting its
   observer.

### Environment limitation (important, do not re-litigate)

The browser window here **cannot be made visible** (`document.visibilityState`
stays `hidden`, `document.timeline.currentTime` stays 0, rAF and
IntersectionObserver are completely silent). Verified directly: a trivial
`requestAnimationFrame` never fires and a trivial `IntersectionObserver` on
`document.body` never delivers. The harness detects this and skips the
scroll-driven checks with a `framesOff` note instead of reporting false
alarms. The reveal contract itself was verified through computed style
(`.reveal` → opacity 0, `.reveal.is-in` → opacity 1).

**Note on stale computed styles in this environment:** because no rendering
step runs, `getComputedStyle` can return values from before a mutation. A
`.stage.reveal` read back `opacity: 1`; after detaching and re-attaching the
node it read `0` — the rule was always correct. When a reading here looks
wrong, force a reflow before believing it.

## Still open

1. **WhatsApp number** — the contact section is built around `wa.me`.
2. **The empty «مشاريعي» section** — stays honestly empty until he decides.
3. Russian copy still needs a native-speaker review before the scholarship
   committee sees it.
