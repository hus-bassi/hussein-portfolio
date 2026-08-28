/* ============================================================
   JS/CERTIFICATES.JS
   Handles three things, all built around the same certificatesData
   array from data/certificates.js:

   1. The homepage preview grid (first 3 certificates, no interaction)
   2. The full Certificates page (all certificates, search + filter)
   3. The certificate modal (fullscreen view, only used on the full page)

   Each piece checks for its own DOM elements before doing anything,
   so this one file works safely on both index.html and
   pages/certificates.html without extra configuration.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderCertificatesPreview();
  initCertificatesPage();
});

/* ------------------------------------------------------------
   SHARED: CARD BUILDING
------------------------------------------------------------- */

/**
 * WHAT:  Builds the HTML string for a single certificate card.
 * WHY:   One template used everywhere a certificate is shown as a
 *        card, so every card looks consistent.
 * WHERE: Called by both renderCertificatesPreview() and the full
 *        page's renderFullGrid().
 * HOW:   `index` and `clickable` are only used on the full page —
 *        `index` lets a click look the certificate back up in the
 *        data array, `clickable` adds the attributes that make the
 *        card open the modal. The homepage preview leaves both
 *        unset, so its cards stay plain and non-interactive.
 */
function buildCertificateCard(certificate, index, clickable) {
  const demoBadge = certificate.isDemo
    ? '<span class="demo-badge">Demo</span>'
    : '';

  const interactiveAttrs = clickable
    ? `data-cert-index="${index}" tabindex="0" role="button" aria-haspopup="dialog"`
    : '';
  const interactiveClass = clickable ? ' cert-card--clickable' : '';

  return `
    <article class="cert-card reveal${interactiveClass}" ${interactiveAttrs}>
      ${demoBadge}
      <p class="cert-category">${certificate.category}</p>
      <h3 class="cert-title">${certificate.title}</h3>
      <p class="cert-provider">${certificate.provider} &middot; ${certificate.date}</p>
      <p class="cert-description">${certificate.description}</p>
    </article>
  `;
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
    .map((cert) => buildCertificateCard(cert))
    .join('');
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
  initModal();

  searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderFullGrid();
  });

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
          >${category}</button>
        `
      )
      .join('');

    filtersContainer.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        filtersContainer
          .querySelectorAll('.filter-chip')
          .forEach((b) => b.classList.toggle('is-active', b === btn));
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
      const haystack = `${cert.title} ${cert.provider} ${cert.description}`.toLowerCase();
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

    grid.querySelectorAll('.cert-card--clickable').forEach((card) => {
      card.addEventListener('click', () => openCertModal(Number(card.dataset.certIndex)));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCertModal(Number(card.dataset.certIndex));
        }
      });
    });
  }
}

/* ------------------------------------------------------------
   3. CERTIFICATE MODAL
------------------------------------------------------------- */

let certModalEl = null;

/**
 * WHAT:  Wires up the modal's close interactions (button, backdrop, Escape).
 * WHY:   Separated from openCertModal() so these listeners are only
 *        ever attached once, not re-attached on every card click.
 * WHERE: Called once by initCertificatesPage().
 */
function initModal() {
  certModalEl = document.getElementById('cert-modal');
  if (!certModalEl) return;

  certModalEl.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeCertModal);
  });
  document.getElementById('cert-modal-close-btn').addEventListener('click', closeCertModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && certModalEl.classList.contains('is-open')) {
      closeCertModal();
    }
  });

  // Same fallback pattern as the Hero portrait: hide the broken image,
  // show a clean placeholder instead.
  const modalImage = document.getElementById('cert-modal-image');
  modalImage.addEventListener('error', () => {
    modalImage.style.display = 'none';
    document.getElementById('cert-modal-image-placeholder').style.display = 'flex';
  });
}

/**
 * WHAT:  Opens the modal populated with one certificate's details.
 * WHY:   Lets a visitor see the full certificate without leaving the page.
 * WHERE: Called when a clickable card is activated (click or Enter/Space).
 * HOW:   Looks the certificate up by its index in certificatesData,
 *        fills in the modal's fields, and reveals it.
 */
function openCertModal(index) {
  const cert = certificatesData[index];
  if (!cert || !certModalEl) return;

  const modalImage = document.getElementById('cert-modal-image');
  const modalPlaceholder = document.getElementById('cert-modal-image-placeholder');
  modalPlaceholder.style.display = 'none';
  modalImage.style.display = 'block';
  modalImage.src = cert.image;
  modalImage.alt = `Certificate: ${cert.title}`;

  document.getElementById('cert-modal-category').textContent = cert.category;
  document.getElementById('cert-modal-title').textContent = cert.title;
  document.getElementById('cert-modal-provider').textContent = `${cert.provider} · ${cert.date}`;
  document.getElementById('cert-modal-description').textContent = cert.description;

  const credentialLink = document.getElementById('cert-modal-credential-link');
  if (cert.credentialUrl) {
    credentialLink.href = cert.credentialUrl;
    credentialLink.hidden = false;
  } else {
    credentialLink.hidden = true;
  }

  certModalEl.classList.add('is-open');
  certModalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * WHAT:  Hides the modal and restores normal page scrolling.
 * WHERE: Called by the close button, the backdrop, and the Escape key.
 */
function closeCertModal() {
  if (!certModalEl) return;
  certModalEl.classList.remove('is-open');
  certModalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
