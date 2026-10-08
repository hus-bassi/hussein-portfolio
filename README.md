# Hussein ElBassiouni — Portfolio

One static website. No build step, no frameworks, no dependencies.

## The website root is THIS folder

`index.html` at the repository root is the entry point. When using
**VS Code Live Server / Go Live, open this folder** — not `academic/`,
not a subfolder. The `academic/` folder is a legacy name that holds the
site's **data and media only**; it has never been a second website and
contains no page to serve.

Two ways to preview, both serving these exact files:

- `node serve.js` → <http://localhost:8000>
  (sends `Cache-Control: no-store`, so what you see is what is on disk)
- VS Code Live Server, started from this root
  (if content ever looks stale, hard-refresh — Live Server allows caching)

## Pages

| page | what it is |
| --- | --- |
| `index.html` | the portal — Hussein's identity, then two doors: volleyball and academic |
| `volleyball.html` | the volleyball world |
| `academic.html` | the academic & professional world |
| `story.html` | the story page |
| `records.html` | certificates + volunteering records, with tag filters and search |
| `projects.html` · `project.html` | projects list and project details |

## Structure

```
index.html …            the pages (each declares its own <script> list)
assets/css/             fonts.css · site.css · records.css — the only stylesheets
assets/js/              one module per job (i18n, nav, motion, page engines…)
assets/fonts/ assets/icons/  self-hosted fonts, favicon
academic/data/          ALL content, trilingual — the single source of truth
academic/assets/        content media (certificates, tournaments, volunteering)
tools/                  audits — node tools/check.js is the gate before any commit
serve.js                minimal local preview server
```

## Rules that keep this repo honest

- **Content lives in `academic/data/`, never hardcoded in a page.** Every
  record there is `{ ar, en, ru }` and re-renders on `site-lang-change`.
- **Certificate images/PDFs that sit at the repository root** (the DataCamp
  files) are referenced from `academic/data/certificates.js` with a `../`
  prefix, which both renderers strip — so the path is root-relative from
  every page.
- **Verify with `node tools/check.js`** after any change; it must print
  "all static checks passed" (never run two at once, never kill one
  mid-flight).
- Arabic is فصحى with zero Latin except brand names (LinkedIn · GitHub ·
  YouTube · VK); Russian is written at native level.
