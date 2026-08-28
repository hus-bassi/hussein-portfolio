/* ============================================================
   JS/CV.JS
   Two jobs:
   1. Wire up the "Print / Save as PDF" button.
   2. Render compact summaries of skills, certificates, and
      volunteering onto the CV — reusing the same data arrays as
      the rest of the site (certificatesData, volunteeringData,
      skillsData), so the CV can never drift out of sync with them.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPrintButton();
  renderCvSkills();
  renderCvCertificates();
  renderCvVolunteering();
});

/**
 * WHAT:  Makes the "Print / Save as PDF" button trigger the browser's
 *        native print dialog.
 * WHY:   Every modern browser can save a print job as a PDF — this
 *        avoids needing a real PDF file to exist on the server at all.
 * HOW:   window.print() opens the browser's print dialog; the
 *        @media print rules in css/main.css control how the page
 *        actually looks once printed.
 */
function initPrintButton() {
  const btn = document.getElementById('print-cv-btn');
  if (!btn) return;
  btn.addEventListener('click', () => window.print());
}

/**
 * WHAT:  Renders skillsData, grouped by category, as a compact
 *        text list (no colored badges — keeps it print-friendly).
 */
function renderCvSkills() {
  const container = document.getElementById('cv-skills');
  if (!container || typeof skillsData === 'undefined') return;

  if (skillsData.length === 0) {
    container.innerHTML = '<p class="cv-empty">Nothing recorded yet.</p>';
    return;
  }

  const grouped = skillsData.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  container.innerHTML = Object.entries(grouped)
    .map(
      ([category, skills]) => `
        <div class="cv-skill-group">
          <span class="cv-skill-category">${category}:</span>
          <span class="cv-skill-names">${skills.map((s) => `${s.name} (${s.level})`).join(', ')}</span>
        </div>
      `
    )
    .join('');
}

/**
 * WHAT:  Renders certificatesData as a compact CV-style list.
 */
function renderCvCertificates() {
  const list = document.getElementById('cv-certificates');
  if (!list || typeof certificatesData === 'undefined') return;

  if (certificatesData.length === 0) {
    list.innerHTML = '<li><p class="cv-empty">Nothing recorded yet.</p></li>';
    return;
  }

  list.innerHTML = certificatesData
    .map(
      (cert) => `
        <li>
          <div class="cv-list-heading">
            <span>${cert.title}</span>
            <span class="cv-list-date">${cert.date}</span>
          </div>
          <p>${cert.provider}</p>
        </li>
      `
    )
    .join('');
}

/**
 * WHAT:  Renders volunteeringData as a compact CV-style list.
 */
function renderCvVolunteering() {
  const list = document.getElementById('cv-volunteering');
  if (!list || typeof volunteeringData === 'undefined') return;

  if (volunteeringData.length === 0) {
    list.innerHTML = '<li><p class="cv-empty">Nothing recorded yet.</p></li>';
    return;
  }

  list.innerHTML = volunteeringData
    .map(
      (entry) => `
        <li>
          <div class="cv-list-heading">
            <span>${entry.role} &middot; ${entry.organization}</span>
            <span class="cv-list-date">${entry.date}</span>
          </div>
          <p>${entry.description}</p>
        </li>
      `
    )
    .join('');
}
