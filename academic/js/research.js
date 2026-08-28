/* ============================================================
   JS/RESEARCH.JS
   Renders researchData into #research-grid on pages/research.html.
   Same empty-state pattern as js/projects.js.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderResearch();
});

function renderResearch() {
  const grid = document.getElementById('research-grid');
  const emptyState = document.getElementById('research-empty-state');
  if (!grid || typeof researchData === 'undefined') return;

  if (researchData.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  grid.innerHTML = researchData.map(buildResearchCard).join('');
}

/**
 * WHAT:  Builds the HTML string for a single research entry card.
 * HOW:   `link` and `pdf` only render as buttons if provided —
 *        same optional-link pattern used for certificates and projects.
 */
function buildResearchCard(entry) {
  const linkBtn = entry.link
    ? `<a href="${entry.link}" class="btn btn-secondary" target="_blank" rel="noopener">View Publication</a>`
    : '';

  const pdfBtn = entry.pdf
    ? `<a href="${entry.pdf}" class="btn btn-secondary" target="_blank" rel="noopener">PDF</a>`
    : '';

  return `
    <article class="cert-card reveal">
      <p class="cert-category">${entry.journal || 'Unpublished'}</p>
      <h3 class="cert-title">${entry.title}</h3>
      <p class="cert-provider">${entry.authors.join(', ')} &middot; ${entry.date}</p>
      <p class="cert-description">${entry.abstract}</p>
      <div class="project-links">${linkBtn}${pdfBtn}</div>
    </article>
  `;
}
