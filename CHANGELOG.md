# Changelog

All notable changes to this project are tracked here.

---

## v1.10.0 — Compact experience cards + reveal/cursor fixes

A presentation-layer pass on the universal event system: the volunteering /
experience cards become a **compact, scannable, premium horizontal row**
instead of a tall image-on-top card, so the list reads like an academic
journal — more information, less empty space — with the full detail one click
away in the viewer. No data changed; only how it's shown. Two rendering bugs
are fixed at the root.

### Changed
- **Universal experience card is now a compact horizontal row.** Rebuilt
  `buildCard` in `academic/js/media-system.js` + a new "Section C2" in
  `academic/css/main.css`:
  - A small, controlled media thumbnail on the **inline start** (capped so it
    can never dominate the row — ≈216 px / well under a third), with the
    content column beside it: type badge, title, role, meta
    (date · location · organization), a **2-line clamped** description, and an
    actions row. Card height is **content-driven** — a short entry makes a
    short row
  - The row **auto-flips under RTL** (media to the inline end) with no
    direction-specific CSS — it's the first flex child, so it follows `dir`
  - **Mobile** stacks to a vertical compact card with a modest media band, not
    a giant hero image
  - Event grids render as a **single-column journal** (`[data-events-grid]`
    only); the certificate catalog keeps its multi-column vertical cards
- **Conditional on-card quick actions** — *Photos*, *Certificate*, *Vlog*
  pills render **only when that data exists** (never an empty/dead button).
  Each is independent: it opens its own gallery / certificate viewer or the
  external vlog link and **stops propagation** so it never triggers the card's
  detail modal — verified for both mouse and keyboard. The whole card remains
  the click target (opens the full detail viewer) with `role="button"`,
  `aria-haspopup="dialog"`, Enter/Space support, and focus-visible styling
- Premium hover preserved and extended: the row lifts, the media subtly comes
  forward (scale + accent frame), the CTA arrow nudges — all transform/shadow
  so nothing reflows, and all **motion-gated for `prefers-reduced-motion`**
- New trilingual labels (EN/AR/RU) for the card actions in
  `academic/data/translations.js` (`eventViewExperience`, `eventPhotos`,
  `eventCertificate`, `eventVlog` — Arabic uses "فلوج" for the vlog)

### Fixed
- **Dynamically-injected cards no longer get stuck invisible.** The
  scroll-reveal system (`academic/js/animations.js`) now keeps watching for
  `.reveal` elements added **after** load — a shared `IntersectionObserver`
  fed by a `MutationObserver` plus a `window.ScrollReveal.refresh()` hook the
  renderers call after injecting markup (and on every language re-render).
  Previously the volunteering event card was present in the DOM but held at
  `opacity:0` because it was built after the one-shot observer had run
- **Custom cursor no longer sticks in its "hovering a control" state** after a
  media viewer or detail modal closes. When the hovered zoom/close button is
  hidden (not exited by motion), no `mouseout` fires, so the ring used to stay
  enlarged. `academic/js/cursor.js` now recomputes on `mouseover`, relaxes on
  `mouseout` via `relatedTarget`, and listens for a `cursor:reset` event that
  `media-system.js` dispatches on every viewer/modal close — closing also
  restores body scroll and returns focus

---

## v1.9.0 — Living Atmosphere (shooting stars) + legacy pages mirrored

An additive, performance-first "atmosphere" pass: the whole site now feels
alive — real animated shooting stars on every page and quiet, themed motion
in every section — without touching any content, layout, or reading order.
The orphaned legacy root `pages/` are brought fully up to the new system,
and the Russian House volunteering entry is finalized with its real date,
VK link, and photos.

### Added
- **Site-wide living atmosphere** — new `academic/js/ambient.js` +
  "Section J" in `academic/css/main.css`, two decorative (aria-hidden,
  pointer-events:none) layers behind all content:
  - **Global shooting stars (meteors)** on every page. The flavour
    (direction, colour, cadence) is chosen *per page* from the URL, so each
    page reads distinctly. In **Day mode** the same streaks become warm
    golden glints — a daylight analogue of the night meteors
  - **Per-section themed motifs** — each section grows its own quiet animated
    glyphs, matched to its meaning: math (∑ ∫ π √ ∞) for values/story,
    geometry (△ ◇ ○ ⬡) for identity/CV, code ({ } < > =>) for projects,
    data (• ◦ ∴ μ σ) for research/certificates, stars (✦ ✧ ⋆) for
    hero/journey/goals — so every "box" has something distinctive
  - **Performance-first & accessible**: meteors are capped and paused when
    the tab is hidden; motif glyphs animate only while their section is on
    screen (IntersectionObserver) and are paused otherwise; the entire
    module is a **no-op under `prefers-reduced-motion`** and hidden in print
  - Wired into all 12 canonical pages (academic home + 9 inner pages +
    the volleyball page + the portal)

### Changed
- **Legacy root `pages/` (9 files) rebuilt to match the new system.**
  Regenerated as faithful mirrors of their academic counterparts — shared
  `academic/css/main.css`, Day/Night theme, trilingual i18n, data-driven
  footer, the Work dropdown nav, custom cursor and the new shooting stars.
  The old hardcoded `YOUR_*_URL` footers are gone; each page's canonical URL
  points at its academic original (clean de-duplication). The old root
  `css/`, `js/`, `data/` copies are kept on disk (never deleted) but are now
  unused by these pages
- **Russian House volunteering entry finalized.** Real date added —
  **June 2, 2026** (EN / AR / RU); only the given day/month/year is shown, no
  weekday invented. The three photos (certificate / receiving-certificate /
  event) are present and now render through the viewer and gallery
- **VK profile added** — `https://vk.ru/hus.bassi` — so VK now appears in the
  Digital Presence panel and every footer automatically

### Preserved
- Golden Rule intact: nothing removed, restarted, or invented. The person who
  handed over the certificate remains unnamed. Dark (Night) stays the default,
  and every reduced-motion / RTL / trilingual guarantee still holds

---

## v1.8.0 — Volunteering, Digital Presence & Volleyball

A content + UI upgrade built entirely on the universal EventSystem and
design system shipped earlier — additive only. Nothing was removed,
restarted, or invented: the first real volunteering experience is added
honestly, a premium social presence is introduced, and the volleyball
side is brought up to the same standard as a ready (still content-free)
space. Everything is trilingual (EN / AR / RU) with full RTL, theme-aware,
and reduced-motion friendly.

### Added
- **First real volunteering experience — Russian House in Cairo.** Added
  to `academic/data/events.js` as the single real entry, rendered through
  the universal card → detail modal → fullscreen viewer / gallery, with a
  "View certificate" action and the YouTube vlog embedded. Honest and
  un-padded: only what actually happened. Shows on both the homepage
  preview (limited to 2) and the full Volunteering page
- **Premium Digital Presence panel (homepage).** A data-driven social
  panel (`academic/data/social.js` → `academic/js/social.js`) — one card
  per platform with icon, name and a short trilingual label — replacing a
  plain link list. Each platform contributes only a small accent (icon
  tint + hover border); the cards stay on the site's calm theme
- **Discord community CTA.** A distinct, premium "Join the Community" card
  for the Discord server — glow + hover, but never louder than the
  CV / Journey / Certificates identity
- **Data-driven footer social row, site-wide.** Every footer (10 academic
  pages + the volleyball page) now pulls its links from the same
  `data/social.js`, replacing the old hardcoded placeholder links —
  editing one file updates every footer at once
- **Volleyball page, upgraded in place.** `sports/index.html` now shares
  the academic design system (`../academic/css/main.css`) and the
  EventSystem, so it feels like one website: cosmic identity, Day/Night
  theme, custom cursor, language switcher and RTL. It reads real entries
  from the new `academic/data/volleyball.js` (currently empty on purpose)
  and shows an honest "More volleyball stories coming soon." empty state

### Changed
- **Certificate card, resting state.** The preview is now a compact fixed
  banner (122px desktop / 108px phone) instead of a tall image — no giant
  empty container. On hover / focus the certificate emerges (lift, scale,
  glow, border highlight); on click it opens the same fullscreen viewer.
  No layout shift, and transforms are neutralised under reduced-motion
- **Event cards now show a role line** (e.g. "Volunteer · Event Setup &
  Coordination") under the title, on both card and detail modal

### Data & i18n
- 13 new trilingual keys: the shared volunteering empty state, the Digital
  Presence panel (eyebrow / heading / lead / creator line), the Discord
  CTA (title / subtitle / button), an "opens in a new tab" a11y label, and
  the volleyball page (eyebrow / title / lead / empty state)
- Media paths are written once (relative to `academic/`) and resolved per
  page by `media-system.js`, so a single path works on the homepage, the
  inner pages and the volleyball page with no per-page edits

### Honesty & pending (never invented)
- **Volunteering date** is deliberately omitted until the exact day is
  provided — not guessed from a filename or EXIF
- **The person** who handed over the certificate is not named or titled —
  only an honest photo caption
- **VK** is kept build-ready with an empty URL — no dead button shows
  until a real link is provided
- **Assets to add** (then everything lights up automatically):
  `academic/assets/volunteering/russian-house/certificate.jpg`,
  `receiving-certificate.jpg`, and `event.jpg`

### Files
- Added: `academic/data/social.js`, `academic/js/social.js`,
  `academic/data/volleyball.js`,
  `academic/assets/volunteering/russian-house/` (folder)
- Changed: `academic/css/main.css`, `academic/data/events.js`,
  `academic/data/translations.js`, `academic/js/media-system.js`,
  `academic/index.html`, all 9 `academic/pages/*.html`,
  `sports/index.html`

---

## v1.7.1 — Certificate UX & Viewer Fix

Repairs (never rebuilds) the certificate card + image viewer shipped in
v1.7.0, which sized and behaved poorly for a real portrait / A4 scan.
Purely corrective and additive — no data, markup, or feature was removed,
and the fix is written to stay universal for all future media.

### Fixed
- **The whole card is now the click + hover target.** Previously only
  the image (or a corner button) reacted. The image preview is now a
  decorative, `pointer-events: none` layer, so a click — or Enter /
  Space — anywhere on a certificate card opens it. On the Certificates
  page that opens the detail viewer; on the homepage preview (which has
  no detail markup) it opens the fullscreen image viewer
- **Non-cropped, balanced preview.** The card frame now *hugs* the
  certificate (portrait or landscape) instead of forcing a short fixed
  strip inside a large empty box — no crop, no dead space. The preview
  image shows large and clear (up to 360px tall on desktop, 300px on
  phones) and eases gently forward as the card lifts
- **Full-size certificate, readability first.** The detail modal and the
  fullscreen viewer now render the certificate at full width and natural
  height — it is never shrunk to fit. When it's taller than the viewport
  it **scrolls inside** the viewer while the page body stays locked
- **Simpler, cleaner zoom.** The viewer's old free-scale + drag-to-pan
  was replaced with a single click-to-zoom (fit-width ↔ 1:1 natural
  width, scroll to explore) — easier on both mouse and touch, and it
  never fights the browser's own scrolling
- **Theme-aware scrollbars everywhere.** The page scrollbar and the
  in-viewer / in-modal scrollbars are now driven by shared CSS tokens
  (`--scrollbar-track / -thumb / -thumb-hover`) that recolour instantly
  on the Day / Night switch — no default gray bar left inside the viewer
- **Trilingual viewer & media controls.** The fullscreen viewer's
  controls (Close, Previous, Next, its dialog label, and the "image not
  available" message) — and the reusable event modal's control labels
  and section titles (Close, View certificate, Watch video, Open image,
  What I did / learned, Skills, People, Gallery, Video, Links) — now
  follow the active language. Because these are built in JS (not
  `data-i18n` elements), they resolve their labels from `translations.js`
  at build time and re-apply live on every AR / EN / RU switch. 17 new
  keys were added to all three languages (169 keys each, still verified
  identical); English literals remain in the markup only as the
  no-translations fallback

### Preserved
- The certificate detail modal keeps every field (category, title,
  provider, date, description, credential link), its search, filters,
  focus trap, Escape / backdrop close, and body-scroll lock. The viewer
  keeps its gallery chrome, keyboard nav, focus trap and scroll lock.
  Motion still honors `prefers-reduced-motion`, and the system stays
  reusable for future courses, events, volleyball, projects and galleries

### Notes / correction
- The earlier "**Action needed: drop the certificate image**" note is now
  resolved — `academic/assets/certificates/elements-of-ai-for-business.jpg`
  is present (a portrait scan), which is exactly what surfaced the sizing
  issues this entry fixes
- The viewer / event control labels flagged in v1.7.0 as "the honest
  next i18n step" are now done (see the trilingual bullet above), so the
  media system is fully AR / EN / RU. Certificate **content** already
  followed the active language and still does

---

## v1.7.0 — Premium Media & Event System (foundation)

A universal, reusable system for presenting any media-rich item —
certificates, courses, volunteering, competitions, achievements,
projects, research, future activities, and every volleyball activity —
with the same premium visual quality and interaction. This ships the
**system**, not content: no fake certificates, photos, people, videos,
results, or events were invented. It makes the site ready for real data.

### Added
- **Universal fullscreen media viewer** (`academic/js/media-system.js`,
  `window.MediaViewer`) — a single same-page lightbox (never a new tab)
  that opens **above** the cosmic background with a dark, blurred
  backdrop, soft glow, and a smooth fade + scale. Centered, fully
  **contained** image (never cropped), with **zoom** (double-click /
  wheel) and drag-to-**pan**, a **gallery** (‹ › Prev/Next, `n / N`
  counter, keyboard arrows, touch swipe) that appears only when there's
  more than one image, **Escape** to close, click-outside-to-close,
  a focus trap, and scroll lock. A missing image shows a clean message,
  not a broken icon
- **Certificate image, fully visible** — certificate cards now show an
  elegant, **non-cropped** framed preview (`object-fit: contain`), and
  the certificate modal image was switched from `cover` (which cropped
  the edges of portrait / A4 scans) to `contain`, so the whole
  certificate is always visible. Clicking a card's image — or the image
  inside the detail modal — opens it in the fullscreen viewer, on the
  same page
- **One universal card interaction language** for every card on the
  site (certificates, skills, focus/mission, projects, research, future
  events). On hover a card gently rises, gains a soft glow and a
  brightening border, and — on desktop pointers only — a subtle light
  follows the cursor with a tiny (≤2.4°) perspective tilt. Content
  "feels alive," not a spinning 3D card. Pure CSS does the rise/glow
  everywhere; the pointer polish is progressive enhancement and is fully
  **disabled** for touch devices and under `prefers-reduced-motion`
- **Unified Event / Activity data model** (`academic/data/events.js`) —
  one documented shape covering every item type (including volleyball:
  team / opponent / result / stats / notes). Every field is optional
  except the title; text fields can be `{ en, ar, ru }` like the
  certificate data. The file is intentionally **empty** — real items
  drop straight in later
- **Reusable event renderer** (`EventSystem` in `media-system.js`) — one
  card template + one detail modal that adapt to whatever an event
  actually has: certificate button, gallery, video (safe YouTube embed
  or an external link), people, skills, "what I did / learned", links —
  each shown **only if present** (no empty rows, no dead buttons). It
  renders nothing until a page provides real events, so it adds zero
  visible content today

### How it works
- `js/media-system.js` is loaded once on every academic page (a single
  `<script>` tag). It self-guards: on pages with no cards it does
  nothing, and the viewer / event modal DOM is created lazily on first
  use, so idle pages carry no extra markup
- All new CSS was **appended to `css/main.css`** (the one stylesheet
  every page loads), so the visual system applies everywhere with no
  per-page HTML edits. The viewer sits at `z-index: 300` — above the
  header and any open modal, below the custom cursor
- The viewer captures keyboard events so that, when opened on top of the
  certificate detail modal, Escape / arrows / Tab drive the viewer only;
  closing it returns you to the modal exactly as before

### Accessibility & performance
- Viewer and event modal both trap focus, restore focus on close, expose
  accessible control labels, and honor `prefers-reduced-motion` (the
  scale / tilt motion is removed — things simply appear)
- Images use `loading="lazy"` + `decoding="async"`; the gallery only
  loads the image being viewed; nothing is eagerly loaded. Designed to
  scale to many certificates / photos / events without a rebuild

### Honesty (unchanged rule)
- Nothing was fabricated. `data/events.js` is empty, no volleyball data
  was added, and no future goal was implied to be complete. The single
  real certificate is unchanged and still framed exactly as before

### Preserved (nothing lost)
- The existing certificate cards, search, filters, detail modal,
  timeline, theme system, RTL, and all translations are untouched — this
  is purely additive. The certificate detail modal keeps its original
  behavior; the image inside it simply gained a click-to-zoom path

### Notes / next scope
- **Action needed (unchanged):** drop the certificate image at
  `academic/assets/certificates/elements-of-ai-for-business.jpg`. Until
  then the card preview stays hidden and the modal shows its clean
  placeholder — nothing breaks
- The viewer / event UI control labels (Close, Next, …) are English
  symbols for now; wiring them into the AR/EN/RU `translations.js`
  (keeping the key counts identical across languages) is the honest next
  i18n step. Certificate/event **content** already follows the active
  language
- No events page is wired up yet — `EventSystem` and `data/events.js`
  are the ready architecture. When real events/volleyball data arrive, a
  page just needs a `<div data-events-grid>` plus these two files

---

### Added
- **Hussein's first real, earned certificate is now live**:
  *Elements of AI for Business* (MinnaLearn · University of Helsinki),
  a 4-week program completed **13 July 2026**. It becomes the first
  genuine entry on the Certificates page and the CV, with a working
  "View Credential" link to the official verification page
- **Certificate titles and descriptions are now multilingual**
  (AR / EN / RU). A certificate's `title` and `description` may now be
  **either** a plain string (as before) **or** a `{ en, ar, ru }`
  object — the cards, the search index, the fullscreen modal, and the
  CV list all show the active language and update live when it's switched
- A small **`i18n:languagechange` event**, dispatched by
  `js/language.js` on load and on every switch, lets JS-rendered
  sections (like the certificate cards, which aren't `data-i18n`
  elements) re-render themselves in the new language — the first piece
  of the "translate the data-driven content" step flagged in v1.5.0

### Honesty (unchanged rule)
- The certificate is described **exactly as what it is** — practical AI
  *literacy* and hands-on exposure to modern AI tools and workflows for
  learning, productivity, content creation, and business tasks. It is
  **not** presented as AI expertise, AI engineering, or any advanced
  qualification, in any of the three languages
- No skill percentages were invented and no future goal was implied to
  be complete

### Preserved (nothing lost)
- The 3 demo placeholder entries were **not deleted** — they're kept,
  commented out, at the bottom of `data/certificates.js` as a reference
  template for adding the next certificate. Visitors simply no longer
  see placeholder cards now that a real certificate exists
- Single-language certificates still render exactly as before — the
  multilingual support is fully backward-compatible

### Notes / next scope
- **Action needed:** drop the certificate image file at
  `academic/assets/certificates/elements-of-ai-for-business.jpg`. Until
  it's there, the modal shows a clean "Certificate image not added yet"
  placeholder — nothing breaks
- Certificate **category** labels and **dates** stay English-only for
  now (the category doubles as the filter key, and no localized dates
  were provided). The volunteering, skills, projects and research data
  files remain single-language — still the honest next step, now with
  the `i18n:languagechange` plumbing ready for them

---

## v1.5.0 — Multilingual Internal Pages

### Added
- The **AR / EN / RU language system now covers all 9 internal
  academic pages** (About, Journey, Goals, Certificates, Volunteering,
  Projects, Research, Skills, CV) — previously only the homepage was
  translated. Every static heading, paragraph, timeline entry, value,
  goal, empty-state, and button on these pages now switches language
- The **language switcher** (AR / EN / RU) is now present in the header
  of every internal page. It's **injected once by `academic/js/language.js`**
  — the same single-source-of-truth approach `theme.js` takes for the
  theme toggle — rather than pasted into 9 files. The homepage keeps its
  own hard-coded switcher and is left untouched
- **~130 new translation keys** across all three languages in
  `academic/data/translations.js` (152 keys per language, verified
  identical across en / ar / ru), plus two new attribute hooks —
  `data-i18n-placeholder` (the certificates search box) and
  `data-i18n-aria-label` (the certificate modal's Close button) — since
  the old text-only mechanism couldn't translate attributes

### How it works
- Same mechanism as the homepage: `data-i18n="key"` on an element,
  `language.js` fills in the matching string and sets `<html lang>` +
  `<html dir>` (RTL only for Arabic — that single `dir` flip drives
  every logical-property rule in `main.css`, so **no new RTL CSS was
  needed**). The choice persists in `localStorage` (`preferredLanguage`)
  and carries across every page
- Each page loads `data/translations.js` then `js/language.js` before
  the rest of its scripts, so translations are ready before first paint
  of the switcher

### Honesty (unchanged rule)
- All future goals stay phrased as **goals, not achievements, in all
  three languages** — the Master's, PhD, Astroinformatics research, and
  NASA-adjacent aims read as clearly not-yet-reached in Arabic and
  Russian exactly as they do in English. No skill percentages were
  invented; no progress was implied

### Preserved
- The homepage and its existing translations are untouched
- No content, layout, or data was removed — this is purely additive
- The Day / Night theme system, RTL layout, and all existing keys
  continue to work as before

### Notes / next scope
- **Data-driven content is still English for now** — the certificate
  cards and category filters (`data/certificates.js`), the volunteering
  timeline (`data/volunteering.js`), the skills groups (`data/skills.js`),
  and the CV's JS-injected Skills / Certificates / Volunteering lists
  pull their text straight from the data files, which are single-language.
  Translating those means adding language variants to the data schema —
  a separate, honest next step, not silently faked here
- The Volleyball side (`sports/`) is still single-language (English),
  as it remains an honest "coming soon" placeholder

---

## v1.4.0 — Day / Night Mode

### Added
- A **Day mode** — the same cosmic universe seen in warm daylight —
  alongside the existing dark **Night mode**. Night mode is unchanged
  and stays the default, so nothing is lost and no first-time visitor
  sees anything different than before
- A **theme toggle** (sun / moon) that lives permanently in the top
  bar of every page, and floats in the top corner of the Portal (which
  has no header bar). Injected once by `academic/js/theme.js` — a single
  source of truth instead of pasted markup in 11 files
- A **cinematic circular reveal** when switching: the incoming theme
  wipes in from the toggle button via the View Transitions API
  (`clip-path` circle, ~650ms). Browsers without the API — and anyone
  with `prefers-reduced-motion` — get an instant, still-smooth switch
- The choice is remembered in `localStorage` (`preferredTheme`),
  mirroring the existing language system, and persists across pages
  and reloads

### How it works
- Day mode is a re-declaration of the same CSS design tokens under
  `:root[data-theme="light"]` — because every component already draws
  its colours from those tokens, **no component rule had to change**.
  Palette: "Warm Sunrise" — cream sky, a warm gold sun glow, deep
  violet ink text, keeping the site's violet + gold identity, tuned to
  hold the same WCAG AA contrast as Night
- The starfields / nebula fade out in daylight and the Hero glow
  becomes a warm sun; the constellation and orbit arcs are recoloured
  so they read on a light sky instead of vanishing
- A tiny inline script in each page's `<head>` applies the saved theme
  **before first paint**, so a Day-mode visitor never sees a flash of
  dark on load

### Preserved
- The entire existing dark design is untouched — it simply became the
  named "Night mode" default. No content, data, or layout changed
- `@media print` (the CV page) is unaffected — still clean black on
  white regardless of the active theme

### Notes
- Scope: the **whole site** is themed — the Academic side, the Portal,
  and the Volleyball side (`sports/`). The Volleyball side keeps its own
  separate "Court Lights" design system, so it got its own Day palette
  (a bright warm court, keeping the orange + red athletic identity)
  rather than the Academic cream — but it shares the same toggle, the
  same `localStorage` choice, and the same circular-reveal transition,
  so switching mode carries across both sides seamlessly

---

## v1.3.0 — Site-Wide Cosmic Backdrop

### Added
- A single, continuous "Personal Digital Universe" backdrop now sits
  behind **every** page (Academic pages, internal pages, and the
  Portal) — not just the homepage Hero. Pages that used to go flat
  below their header now float over deep space, nebula, distant
  starfield, and atmospheric glow, so the whole site reads as one
  continuous cosmos instead of a lit Hero over a flat body
- Implemented as two fixed pseudo-elements on `body`
  (`body::before` = nebula + atmospheric glow blobs,
  `body::after` = tiled far starfield / cosmic dust)

### Notes
- Zero-cost by design: pure CSS, painted once, `position: fixed`
  (no scroll or per-frame work), no canvas, no new JS, no HTML
  changes — so it applies to every existing and future page
  automatically, with nothing to wire up per page
- All layers kept under ~0.11 alpha and pinned at `z-index: -1`
  (above the body base colour, below all content) so text contrast
  is never touched; opaque section bands still cover parts of it,
  which is what creates the sense of depth
- The richer, animated Hero detail from v1.2.0 (orbit arcs,
  constellation, moving starfields) stays exclusive to the homepage
  Hero — the site-wide layer is deliberately calmer, per the
  "premium, not overloaded" direction
- Hidden in `@media print` so it never wastes ink on the CV page

---

## v1.2.0 — Premium Cosmic Background

### Added
- Cosmic dust layer — a third, finer star-like texture behind the
  existing two starfield layers, on the homepage Hero only
- Constellation detail — 6 points, 4 connecting lines, very low
  opacity — deliberately sparse per the brief's "not overloaded"
  direction
- Two large, slowly-sweeping orbit arcs behind the Hero content,
  echoing the portrait's own orbit ring at atmospheric scale
- A third, subtler nebula glow blob added to the existing two

### Notes
- Scoped to the homepage Hero only, not every page-header — repeating
  this much detail on every page would work against the "premium,
  not overloaded" direction from the brief
- Orbit arcs hidden below 768px (not resized) — at that scale they
  added visual noise without the sweep being visible
- Everything here is pure CSS/SVG, no canvas, no new JS — same
  prefers-reduced-motion handling as every other animation on the site

---

## v1.1.0 — Skills System Redesign

### Added
- Circular progress ring visualization for Skills — replaces the
  previous text-badge design, per your request for a premium
  presentation
- `percentage` and `level` fields added to the skill data schema
  (`academic/data/skills.js`)
- Animated count-up (0 → real percentage) the first time a skill
  card scrolls into view, with a static fallback for
  `prefers-reduced-motion`
- An honest "Not yet rated" state for any skill without a real
  percentage — never a ring stuck at 0%, since that would wrongly
  imply zero ability rather than "not measured yet"
- This `CHANGELOG.md`, and a version-numbering convention for future
  updates (see `README.md`)

### Fixed
- `academic/js/cv.js` would have printed literal "null" next to any
  skill without an old-style text level, now that the schema changed
  — fixed before it could ever appear on the live CV page

### Preserved
- All 7 existing skill entries (Python, Mathematics, Statistics,
  Data Analysis, English, Russian, Academic Research) — names and
  categories unchanged, no data lost
- No percentage was invented for any skill — all 7 are currently
  `percentage: null` ("Not yet rated") until real numbers are provided

---

## v1.0.0 — Initial Complete Site

Baseline release. Includes:

- Full Academic site: Home, About, Certificates (search + filter +
  modal), Volunteering, Academic Journey, Future Goals, Projects,
  Research, Skills, CV (Print/Save-as-PDF)
- Portal landing page choosing between Academic and Sports sides
- Sports side foundation (honest "not started yet" placeholder)
- Multilingual infrastructure (AR/EN/RU, auto-detect, RTL) — applied
  to the homepage, with other pages still to migrate
- Simplified navigation ("Work" dropdown), premium custom cursor,
  nested-frame button hover effect, animated starfield background,
  cross-side page-transition loading overlay
- Responsive (320px–1920px), performance, accessibility (WCAG AA
  contrast, skip link, modal focus trap), and SEO audits complete
- `README.md` with setup and content-editing instructions
