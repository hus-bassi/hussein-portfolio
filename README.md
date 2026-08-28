# Hussein ElBassiouni — Personal Portfolio

## Project Overview

A personal digital identity site with two completely separate sides,
chosen from a portal landing page:

- **Academic & Professional** (`academic/`) — certificates, volunteer
  experience, academic journey, future goals, projects, research,
  skills, and a CV. Deep space visual identity: violet-black
  background, gold as the "achievement" accent, soft violet for
  interactive glow.
- **Volleyball & Sports** (`sports/`) — currently a honest "not
  started yet" placeholder, ready to grow once training begins in
  Russia. A completely different visual identity: charcoal, bold
  uppercase type, orange/red athletic accents.

Both sides are reached from the root portal (`index.html`), which lets
a visitor choose which one they're here for.

## Features

- Fully static — vanilla HTML/CSS/JS, no build step, no framework
- Certificates, Volunteering, Projects, Research and Skills are all
  data-driven (see `academic/data/`) — content is added by editing a
  data file, never by touching HTML or CSS
- Certificates page: live search + category filtering (generated
  automatically from whatever categories exist in the data) + a
  fullscreen modal viewer
- Multilingual: Arabic / English / Russian, auto-detected from the
  browser and switchable manually, with full RTL support (currently
  applied to the homepage — see Future Roadmap)
- Scroll-reveal animations, an animated starfield background, a
  premium custom cursor (desktop only), and a nested-frame hover
  effect on every button
- A themed loading transition when moving between the Portal,
  Academic, and Sports sides
- A live CV page with a "Print / Save as PDF" button — no static PDF
  file required
- Responsive from 320px to 1920px+, and audited for accessibility
  (WCAG AA color contrast, keyboard navigation, a skip-to-content
  link, and a real focus trap in the certificate modal)
- Basic SEO: canonical URLs, Open Graph, Twitter Card, JSON-LD person
  data, `sitemap.xml`, `robots.txt`

## Structure

```
hussein-portfolio/
├── index.html            # Portal — choose Academic or Sports
├── portal.css
├── transition.css/js     # Shared cross-side page-transition overlay
├── sitemap.xml
├── robots.txt
│
├── academic/
│   ├── index.html
│   ├── css/main.css
│   ├── js/                    # navigation, language, cursor, animations,
│   │                           # certificates, volunteering, projects,
│   │                           # research, skills, cv, main
│   ├── data/                  # certificates.js, volunteering.js, projects.js,
│   │                           # research.js, skills.js, translations.js
│   ├── pages/                 # about, certificates, volunteering, journey,
│   │                           # goals, projects, research, skills, cv
│   └── assets/
│       ├── images/            # profile.jpg goes here
│       ├── certificates/      # certificate images go here
│       ├── documents/         # any PDFs (e.g. volunteering certificates)
│       └── icons/favicon.svg
│
└── sports/
    ├── index.html
    ├── css/main.css
    └── assets/images/
```

## How to Run

No build step needed. Open `index.html` directly in a browser, or
serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## How to Add a Certificate

1. Open `academic/data/certificates.js`.
2. Copy one of the existing objects and fill in your real `title`,
   `provider`, `date`, `category`, `description`, and `credentialUrl`
   (leave it `''` if there isn't one).
3. Put the certificate image in `academic/assets/certificates/` and
   point `image` at it.
4. Set `isDemo` to `false`.
5. Save. Both the homepage preview and the full Certificates page
   pick it up automatically — no other file needs to change.

## How to Add Volunteer Experience

Same process, in `academic/data/volunteering.js` — see the comment
at the top of that file for the exact shape.

## How to Add a New Language

1. Open `academic/data/translations.js`.
2. Add a new top-level language key (e.g. `fr: { ... }`) with the
   same keys used under `en`/`ar`/`ru`.
3. Add that language code to `SUPPORTED_LANGUAGES` in
   `academic/js/language.js`. Add it to `RTL_LANGUAGES` too if the
   new language is right-to-left.
4. Add a matching button to the `.lang-switcher` in the HTML,
   e.g. `<button type="button" data-lang-switch="fr">FR</button>`.

## How to Customize

- **Colors**: every color on the Academic side is a CSS custom
  property at the top of `academic/css/main.css` (`:root`) —
  change a value there and it updates everywhere. Same pattern in
  `sports/css/main.css` for the Sports side.
- **Fonts, spacing**: same file, same `:root` block.
- **Copy/text**: homepage text lives in `academic/data/translations.js`;
  other pages currently have their English text directly in the HTML
  (not yet migrated to translations — see Future Roadmap).

## How to Add or Update a Skill

1. Open `academic/data/skills.js`.
2. To add a new skill, copy an existing object and fill in `name`,
   `category`, `percentage` (0–100, your own honest self-rating),
   `level` (your own words, e.g. `'Intermediate'`), and an optional
   `description`.
3. To update an existing skill's progress, just change its
   `percentage` (and `level`, if it changed too).
4. A skill with `percentage: null` shows as "Not yet rated" instead
   of a ring — leave it that way until you have a real number for it.
5. Save. `academic/pages/skills.html` regroups and re-renders
   everything automatically.

## Versioning

This project follows `MAJOR.MINOR.PATCH` versioning:

- **Patch** (`v1.0.1`) — a single new certificate, skill update, or
  small content addition
- **Minor** (`v1.1.0`) — a new feature or a redesigned section
- **Major** (`v2.0.0`) — a structural change (like the Portal/Sports split)

See `CHANGELOG.md` for the full version history. Each delivered ZIP
is named `Hussein-ElBassiouni-Portfolio-vX.X.X.zip` and always
contains the complete, current project — never just the changed files.

## Future Roadmap

- Finish migrating every Academic page (not just the homepage) to the
  translation system, so AR/EN/RU and RTL apply everywhere
- Real content: profile photo, real certificates, real volunteering
  history, real skill self-assessment
- Build out the Sports side once volleyball training actually starts
  in Russia (Matches / Training / Stats / Gallery)
- Replace `https://YOUR_DOMAIN.com` in every SEO tag, `sitemap.xml`,
  and `robots.txt` with the real domain once deployed
- Add real social links (GitHub, LinkedIn, etc.) in place of the
  `YOUR_..._URL` placeholders in every footer
