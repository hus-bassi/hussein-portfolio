/* ============================================================
   JS/CERTIFICATES.JS
   Handles two things, both built around the same certificatesData
   array from data/certificates.js:

   1. The homepage preview grid (first 3 certificates)
   2. The full Certificates page (all certificates, search + filter)

   Both render the SAME compact experience card as the rest of the
   site and open the SAME universal detail viewer + fullscreen
   MediaViewer on click (js/media-system.js's EventSystem) — a
   certificate is just one more "type" of experience (§3/§4). This
   file owns the certificate-specific PRESENTATION and the catalog's
   filter / search / category / count logic; it no longer owns a
   separate card or modal system. The Compact Card here is purely a
   presentation layer, NOT a rebuild of the certificate system.

   Each piece checks for its own DOM elements before doing anything,
   so this one file works safely on both index.html and
   pages/certificates.html without extra configuration.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderCertificatesPreview();
  initCertificatesPage();
});

// Re-render the homepage preview grid when the language changes at
// runtime. (The full Certificates page re-renders itself from inside
// initCertificatesPage, where its grid-render function is in scope.)
document.addEventListener('i18n:languagechange', renderCertificatesPreview);

/* ------------------------------------------------------------
   LANGUAGE HELPERS
   A certificate's `title` and `description` can each be a plain
   string OR a { en, ar, ru } object (see data/certificates.js).
   These helpers are the single place that turns
   "current language + field" into the right string, so every render
   path (cards, search, modal, CV) stays consistent.
------------------------------------------------------------- */

/**
 * WHAT:  Returns the active language code ('ar' | 'en' | 'ru').
 * WHY:   Certificates render on their own DOMContentLoaded, which can
 *        run before language.js has set <html lang> for this load, so
 *        we read the saved choice straight from localStorage (the same
 *        key language.js uses), then fall back to <html lang>, then 'en'.
 */
function getActiveCertLang() {
  try {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved === 'ar' || saved === 'en' || saved === 'ru') return saved;
  } catch (e) { /* storage blocked — fall through to the DOM/default */ }
  const htmlLang = document.documentElement.lang;
  if (htmlLang === 'ar' || htmlLang === 'en' || htmlLang === 'ru') return htmlLang;
  return 'en';
}

/**
 * WHAT:  Resolves a possibly-multilingual field to a single string.
 * HOW:   Plain string → returned unchanged (keeps old single-language
 *        entries working). { en, ar, ru } object → the active language,
 *        falling back to English, then to any value present — so a card
 *        can never render "[object Object]" or an empty gap.
 */
function localizeCertField(value) {
  if (value && typeof value === 'object') {
    const lang = getActiveCertLang();
    return value[lang] || value.en || Object.values(value)[0] || '';
  }
  return value;
}

/**
 * WHAT:  Escapes a string for safe use inside an HTML attribute.
 * WHY:   The card's image preview puts the (possibly future,
 *        possibly quote-containing) title into an aria-label — a
 *        stray quote would break the markup. Text content elsewhere
 *        is set the browser-safe way; this is only for attributes.
 */
function escCertAttr(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * WHAT:  Resolves a UI-label translation KEY for the active language.
 * WHY:   The compact card builds its own "View certificate" affordance in
 *        JS, so — like the media/event system — it can't rely on language.js
 *        filling a data-i18n element; it reads the shared `translations`
 *        table the same way. Guarded so a page without translations just
 *        gets the English fallback instead of throwing.
 */
function certT(key, fallback) {
  try {
    if (typeof translations !== 'undefined' && translations) {
      const lang = getActiveCertLang();
      if (translations[lang] && translations[lang][key] != null) return translations[lang][key];
      if (translations.en && translations.en[key] != null) return translations.en[key];
    }
  } catch (e) { /* fall through to the literal fallback */ }
  return fallback != null ? fallback : key;
}

/**
 * WHAT:  Resolves a certificate image path for the page it's rendering on.
 * WHY:   Certificate image paths in data/certificates.js are written relative
 *        to the academic/ folder (e.g. "assets/certificates/x.jpg"), so the
 *        SAME data works from the homepage, the certificates page and the
 *        root mirror without a build step. Delegates to EventSystem's
 *        resolveMediaPath (one source of truth for page-depth hops); returns
 *        the path unchanged if the event system isn't loaded yet.
 */
function resolveCertImage(path) {
  if (path && window.EventSystem && typeof window.EventSystem.resolveMediaPath === 'function') {
    return window.EventSystem.resolveMediaPath(path);
  }
  return path;
}

/**
 * WHAT:  Opens the fullscreen media viewer on one certificate's image.
 * WHY:   The shared, universal viewer (js/media-system.js) — same zoom +
 *        internal scroll + full cleanup every other image uses. Kept as the
 *        direct-to-image fallback for openCertDetail() when the event system
 *        isn't present, so a click always shows the certificate.
 * HOW:   Looks the certificate up by index, resolves its image path, and
 *        passes the localized title as the caption. Safe no-op if the viewer
 *        script isn't loaded or the cert has no image.
 */
function openCertImageViewer(index) {
  const cert = certificatesData[index];
  if (!cert || !cert.image || !window.MediaViewer) return;
  const title = localizeCertField(cert.title);
  window.MediaViewer.open([{ src: resolveCertImage(cert.image), alt: `Certificate: ${title}`, caption: title }], 0);
}

/* ------------------------------------------------------------
   SHARED: CARD BUILDING
------------------------------------------------------------- */

/**
 * WHAT:  Builds ONE compact certificate card — the SAME horizontal
 *        experience-card layout the rest of the site uses (media thumbnail
 *        on the inline start + content column: category badge, title,
 *        provider · date, a 2-line description, and a "View certificate"
 *        affordance). Small, controlled, scannable — never a huge cert image
 *        with empty space. "SAME DESIGN SYSTEM, DIFFERENT CONTENT."
 * WHY:   §1/§4 — certificates read as compact cards like volunteering /
 *        volleyball / projects, so the whole site is one visual language.
 * WHERE: Called by both renderCertificatesPreview() and renderFullGrid().
 * HOW:   Reuses the .event-card classes (so it inherits the shared compact
 *        layout + hover-emerge + responsive stacking from main.css) while
 *        keeping data-cert-index for this file's own click wiring. The full,
 *        uncropped certificate lives one click away in the detail viewer, so
 *        the card image stays small (§ CERTIFICATE IMAGE rule).
 */
function buildCertificateCard(certificate, index, clickable) {
  const demoBadge = certificate.isDemo
    ? '<span class="demo-badge">Demo</span>'
    : '';

  const interactiveAttrs = clickable
    ? `data-cert-index="${index}" tabindex="0" role="button" aria-haspopup="dialog"`
    : '';
  const interactiveClass = clickable ? ' cert-card--clickable' : '';

  const title = localizeCertField(certificate.title);

  // Small controlled media on the inline start — the SAME thumbnail frame as
  // every experience card (capped well under a third of the row, never
  // cropped-to-fit in a way that loses content; the full image opens in the
  // viewer). Decorative + pointer-events:none (css) so the whole card is the
  // single click target; a missing file adds .is-empty and CSS hides the
  // frame — no broken icon, no empty box, no reflow.
  let media = '';
  if (certificate.image) {
    media =
      `<span class="event-card-media" aria-hidden="true">` +
      `<img class="event-card-img" src="${escCertAttr(resolveCertImage(certificate.image))}" alt="" ` +
      `loading="lazy" decoding="async" ` +
      `onerror="this.closest('.event-card-media').classList.add('is-empty')" /></span>`;
  }

  // Non-interactive primary affordance (pointer-events:none in css) — signals
  // the whole card opens the full certificate; the click falls through to the
  // card itself, never a nested button inside the role="button" card.
  const cta =
    `<span class="event-card-cta" aria-hidden="true">` +
      `${escCertAttr(certT('eventViewCert', 'View certificate'))}` +
      `<span class="event-card-cta-arrow">→</span>` +
    `</span>`;

  return `
    <article class="cert-card event-card event-card--compact reveal${interactiveClass}" ${interactiveAttrs} aria-label="${escCertAttr(title)}">
      ${demoBadge}
      ${media}
      <div class="event-card-body">
        <span class="event-type-badge">${escCertAttr(certificate.category)}</span>
        <h3 class="cert-title">${escCertAttr(title)}</h3>
        <p class="cert-provider">${escCertAttr(certificate.provider)} &middot; ${escCertAttr(certificate.date)}</p>
        <p class="cert-description event-card-desc">${escCertAttr(localizeCertField(certificate.description))}</p>
        <div class="event-card-actions">${cta}</div>
      </div>
    </article>
  `;
}

/**
 * WHAT:  Adapts a certificate record to the universal Event shape so it opens
 *        in the SAME detail viewer every other experience uses.
 * WHY:   §3/§4 — one universal card + one universal viewer. A certificate is
 *        just an experience whose `type` is its category. Nothing is invented:
 *        every field maps 1:1 from the real certificate data.
 * HOW:   category → type; provider → provider (leads the meta line);
 *        date → date; description → description; image → the modal's hero,
 *        whose click opens the fullscreen MediaViewer (zoom + internal scroll
 *        + full cleanup); credentialUrl → an external "View credential" link
 *        (trilingual label). Title/description stay { en, ar, ru } objects —
 *        the event system localizes them exactly as this file does.
 */
function certToEvent(cert) {
  const ev = {
    type: cert.category,
    title: cert.title,
    provider: cert.provider,
    date: cert.date,
    description: cert.description,
    image: cert.image,
  };
  if (cert.credentialUrl) {
    ev.externalLinks = [{
      label: { en: 'View credential', ar: 'التحقّق من الشهادة', ru: 'Проверить сертификат' },
      url: cert.credentialUrl,
    }];
  }
  return ev;
}

/**
 * WHAT:  Opens one certificate in the universal detail viewer.
 * WHY:   A single click path for BOTH the homepage preview and the full page,
 *        so certificates behave identically everywhere and inherit the event
 *        system's whole lifecycle (open → scroll lock + focus move → close →
 *        scroll restore + focus return + cursor reset + no leftover state).
 * HOW:   Prefers EventSystem.openDetail (unified modal; the certificate image
 *        is its hero, one click from fullscreen zoom/scroll). Falls back to
 *        the fullscreen image viewer directly if the event system isn't loaded,
 *        so a click always shows the certificate.
 */
function openCertDetail(index) {
  const cert = certificatesData[index];
  if (!cert) return;
  if (window.EventSystem && typeof window.EventSystem.openDetail === 'function') {
    window.EventSystem.openDetail(certToEvent(cert));
  } else {
    openCertImageViewer(index);
  }
}

/* ------------------------------------------------------------
   1. HOMEPAGE PREVIEW
------------------------------------------------------------- */

/**
 * WHAT:  Fills #certificates-preview-grid with the first 3 certificates.
 * WHY:   Gives homepage visitors a taste without duplicating the
 *        full page's filter/search/modal logic.
 * WHERE: Runs once on page load. Does nothing if the homepage's
 *        grid element isn't present (e.g. on the Certificates page).
 * HOW:   Slices the first 3 entries from certificatesData and
 *        builds a non-clickable card for each.
 */
function renderCertificatesPreview() {
  const grid = document.getElementById('certificates-preview-grid');
  if (!grid || typeof certificatesData === 'undefined') return;

  const PREVIEW_COUNT = 3;
  grid.innerHTML = certificatesData
    .slice(0, PREVIEW_COUNT)
    .map((cert, i) => buildCertificateCard(cert, i, true))
    .join('');

  // Every card opens the SAME universal detail viewer as the full page
  // (§2/§3/§4) — a click or Enter/Space anywhere on the card. The decorative
  // image never steals the click.
  grid.querySelectorAll('.cert-card--clickable').forEach((card) => {
    card.addEventListener('click', () => {
      openCertDetail(Number(card.dataset.certIndex));
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCertDetail(Number(card.dataset.certIndex));
      }
    });
  });

  // These cards carry `.reveal` and are injected after animations.js set up
  // its scroll-reveal observer, so nudge it to pick them up now (the same fix
  // the event grids use) — otherwise they'd stay stuck at opacity:0.
  if (window.ScrollReveal && typeof window.ScrollReveal.refresh === 'function') {
    window.ScrollReveal.refresh();
  }
}

/* ------------------------------------------------------------
   2. FULL CERTIFICATES PAGE — filters, search, grid
------------------------------------------------------------- */

/**
 * WHAT:  Sets up the entire Certificates page: filter buttons,
 *        search input, the grid itself, and the modal.
 * WHY:   Keeps all full-page logic in one place, separate from the
 *        simpler homepage preview above.
 * WHERE: Runs once on page load. Does nothing if the full page's
 *        grid element isn't present (e.g. on the homepage).
 * HOW:   Builds the filter chips from the categories actually found
 *        in the data, then re-renders the grid whenever the search
 *        text or active category changes.
 */
function initCertificatesPage() {
  const grid = document.getElementById('certificates-full-grid');
  if (!grid || typeof certificatesData === 'undefined') return;

  const searchInput = document.getElementById('certificates-search');
  const filtersContainer = document.getElementById('certificates-filters');
  const emptyState = document.getElementById('certificates-empty-state');

  let activeCategory = 'All';
  let searchTerm = '';

  buildFilterChips();
  renderFullGrid();

  searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderFullGrid();
  });

  // Re-render the grid when the language changes, so multilingual
  // titles/descriptions update live. The active category and search
  // term are closure state, so they're preserved across the re-render.
  document.addEventListener('i18n:languagechange', renderFullGrid);

  /**
   * WHAT:  Builds one filter button per unique category in the data,
   *        plus an "All" button at the start.
   * WHY:   So the filter list never needs manual updates — see the
   *        Option A/B decision above this file.
   * HOW:   Reads `certificate.category` off every entry, de-duplicates
   *        with a Set, and renders a button per unique value.
   */
  function buildFilterChips() {
    const categories = ['All', ...new Set(certificatesData.map((c) => c.category))];

    filtersContainer.innerHTML = categories
      .map(
        (category) => `
          <button
            type="button"
            class="filter-chip${category === activeCategory ? ' is-active' : ''}"
            data-category="${category}"
            aria-pressed="${category === activeCategory}"
          >${category}</button>
        `
      )
      .join('');

    filtersContainer.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        filtersContainer.querySelectorAll('.filter-chip').forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });
        renderFullGrid();
      });
    });
  }

  /**
   * WHAT:  Filters certificatesData by the active category and
   *        search term, then renders the result into the grid.
   * WHY:   Single source of truth for "what should be visible right
   *        now" — called every time either filter changes.
   * HOW:   Simple Array.filter + substring match across title,
   *        provider and description.
   */
  function renderFullGrid() {
    const filtered = certificatesData.filter((cert, originalIndex) => {
      const matchesCategory = activeCategory === 'All' || cert.category === activeCategory;
      const haystack = `${localizeCertField(cert.title)} ${cert.provider} ${localizeCertField(cert.description)}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    // Keep each card's data-cert-index pointing at its position in the
    // ORIGINAL certificatesData array (not the filtered list), so the
    // modal always opens the correct certificate.
    grid.innerHTML = filtered
      .map((cert) => buildCertificateCard(cert, certificatesData.indexOf(cert), true))
      .join('');

    // The WHOLE card is the click target (§2/§3/§4): a click or Enter/Space
    // anywhere on it opens the universal detail viewer. The image preview is
    // decorative (pointer-events:none in CSS), so there's no inner element
    // that could swallow the card's own click.
    grid.querySelectorAll('.cert-card--clickable').forEach((card) => {
      card.addEventListener('click', () => {
        openCertDetail(Number(card.dataset.certIndex));
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCertDetail(Number(card.dataset.certIndex));
        }
      });
    });

    // Nudge scroll-reveal for the freshly-injected .reveal cards (see the
    // preview grid above for why this is needed).
    if (window.ScrollReveal && typeof window.ScrollReveal.refresh === 'function') {
      window.ScrollReveal.refresh();
    }
  }
}

/* ------------------------------------------------------------
   3. CERTIFICATE DETAIL VIEWER — now the UNIVERSAL viewer
------------------------------------------------------------- */

/* The bespoke certificate modal that used to live here has been retired.
   Certificates now open the ONE universal detail viewer (EventSystem.openDetail
   in js/media-system.js) via openCertDetail() above — the same open / close /
   cleanup lifecycle every experience uses (scroll lock, focus restore, cursor
   reset, no leftover overlay / zoom / pointer state), with the full certificate
   image one click from fullscreen zoom + scroll in the shared MediaViewer.
   The old #cert-modal markup was removed from the certificate pages in the same
   change; if a page still ships it, it simply stays hidden and unused. */
