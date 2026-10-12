# Hussein ElBassiouni — Two-Worlds Portal & Portfolio

A cinematic personal website representing two distinct worlds in Hussein ElBassiouni's life:
1. **The Academic & Professional World** — Data science, programming, astronomy, academic progression, projects, certificates, research, and skills.
2. **The Volleyball World** — An athletic universe detailing tournament milestones, achievements (3–0 match win, 3rd place), Middle Blocker position, and future goals.

No build step, no frameworks, zero runtime dependencies. Fully trilingual (Arabic, English, Russian).

---

## 1. Architecture & Navigation

The visitor journey follows this model:

```
Root Website Entry (index.html / portal.html)
        │
        ├── Left Door  ──► Volleyball World (volleyball.html)
        │
        └── Right Door ──► Academic & Professional Portfolio (academic.html)
                                │
                                ├── Story (story.html)
                                ├── Projects (projects.html / project.html)
                                └── Learning & Certificates (records.html)
```

| Page | Role | Purpose & Contents |
| --- | --- | --- |
| `index.html` | Root Entry & Gateway | The dedicated Space Gateway served at the root URL (`/`). Dynamic pointer-reactive split glow (Ember left / Violet-Gold right), center dead-zone, optional Web Audio chime toggle, and doors to each world. |
| `portal.html` | Gateway Alternate Entry | Identical experience to `index.html`, preserving direct links and portal bookmarks. |
| `academic.html` | Academic World | Full portfolio homepage: Hero, About, Story, 5-stage Plan, Why Data + Astronomy, Interests, Projects, Volunteering, Learning & Certificates summary, Contact, Socials. |
| `volleyball.html` | Volleyball World | Independent athletic universe: Indoor arena hero with court lines, net visual, Middle Blocker identity, verified tournaments (Ramadan 2023 3rd place, Activation Tournament 3–0 win scoreboard), and future team ambitions. |
| `story.html` | Story Archive | The detailed narrative journey and reflection. |
| `records.html` | Records & Verification | Comprehensive trilingual certificate and volunteering database with tag filters and instant search. |
| `projects.html` · `project.html` | Projects System | Academic and data science projects showcase. |

---

## 2. Local Preview vs. GitHub Pages Deployment

### VS Code Live Server
- **Always open the repository root folder** (`d:\hussein-portfolio` in VS Code).
- Do **not** open subfolders like `academic/` — that folder contains data and media only.
- When opening Live Server at `http://127.0.0.1:5500/`, it serves `index.html`, which is the Dedicated Space Gateway.
- If styling ever appears cached, press `Ctrl+F5` (Live Server permits browser caching).

### Local Node Server
- Run `node serve.js` → <http://localhost:8000>.
- Sends `Cache-Control: no-store` headers so on-disk changes load immediately.

### GitHub Pages Deployment
- Deployed at: `https://hus-bassi.github.io/hussein-portfolio/`
- Serves `index.html` as the root gateway.
- Canonical URLs and relative asset paths are configured so both local servers and GitHub Pages resolve assets identically without broken relative links.

---

## 3. Stylesheet Ownership

To prevent stacking and version confusion, styling is strictly modularized:

- **`assets/css/site.css`**: Base tokens, typography, layout container (`.shell`), header, footer, buttons, common interactions, and the authentic Academic portfolio components.
- **`assets/css/portal.css`**: Dedicated styling for the Space Gateway (`index.html` & `portal.html`). Deep black background (`#050505`), pure starfield, split glow reactions (warm ember left, violet/gold right), and gateway doors.
- **`assets/css/volleyball.css`**: Dedicated styling for Volleyball World (`volleyball.html`). Arena atmosphere, court lines, scoreboard, middle blocker identity, and warm charcoal/ember palette (`#FF8A3D`).
- **`assets/css/records.css`**: Dedicated styling for the certificates & volunteering filtering grid on `records.html`.

---

## 4. Transparent Character Slots

The architecture includes dedicated character slots reserved for future 2D transparent artistic assets:
- **Portal character slots**: Inside each door on `index.html` and `portal.html` (`.gateway-char-slot`).
- **Volleyball character slot**: Inside the hero arena on `volleyball.html` (`[data-volleyball-character]`).
- **Academic character slot**: On `academic.html`.

These slots are styled with subtle aura lighting and remain clean when empty. When real transparent art assets are added (e.g. `assets/images/hussein-volleyball.webp`), they render through the slot API without altering page layout.

---

## 5. Verification & Quality Assurance

Run the comprehensive test suite before making any commits:
```bash
node tools/check.js
```
This runs 13 automated verification passes:
1. `css-parse-check`: CSS parses with balanced braces and valid variables.
2. `css-audit`: Zero unused tokens, zero dead classes, zero dead keyframes, strictly compliant motion ladder.
3. `motion-audit-selftest`: Proves motion rules catch planted regressions.
4. `hover-colour-audit`: Verifies link labels maintain high contrast in all hover states.
5. `contrast-audit`: WCAG AA 4.5:1 text contrast across all color combinations.
6. `image-fit-audit`: Orientation-blind certificate preview formula.
7. `card-layout-audit`: Balanced record card rendering.
8. `details-media-selftest`: Document and media preview verification.
9. `details-scroll-audit`: Single scroller contract.
10. `details-scroll-selftest`: Scroller regression tests.
11. `reveal-audit`: Complete coverage of the reveal animation engine across all pages.
12. `reveal-selftest`: Proves reveal rules catch planted bugs.
13. `certificates-audit`: Asserts all certificates match CV.md ledger, media assets exist on disk, credential numbers match, and accessibility alt texts are valid.

All tests must print `all static checks passed`.

