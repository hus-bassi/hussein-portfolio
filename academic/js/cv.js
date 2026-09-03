/* ============================================================
   JS/CV.JS
   Two jobs:
   1. Wire up the "Print / Save as PDF" button.
   2. Render compact summaries of skills, certificates, and
      volunteering onto the CV — reusing the same data as the rest
      of the site (skillsData, certificatesData, and the real
      type:'volunteering' entries from data/events.js), so the CV
      can never drift out of sync with them.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPrintButton();
  renderCvSkills();
  renderCvCertificates();
  renderCvVolunteering();
});

// The certificate AND volunteering lists can hold multilingual fields, so
// re-render both when the language changes at runtime. (Skills are still
// single-language, so they don't need re-rendering here.)
document.addEventListener('i18n:languagechange', () => {
  renderCvCertificates();
  renderCvVolunteering();
});

/**
 * WHAT:  Returns the active language code ('ar' | 'en' | 'ru').
 * WHY:   The CV renders on its own DOMContentLoaded and re-renders on
 *        i18n:languagechange; it needs the current language to resolve
 *        multilingual fields. js/certificates.js (which exposes
 *        localizeCertField) is NOT loaded on the CV page, so cv.js
 *        resolves the language itself — the same way certificates.js
 *        does: the saved choice first, then <html lang>, then English.
 */
function cvActiveLang() {
  try {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved === 'ar' || saved === 'en' || saved === 'ru') return saved;
  } catch (e) { /* storage blocked — fall through to the DOM/default */ }
  const htmlLang = document.documentElement.lang;
  if (htmlLang === 'ar' || htmlLang === 'en' || htmlLang === 'ru') return htmlLang;
  return 'en';
}

/**
 * WHAT:  Resolves a possibly-multilingual field to a single string in the
 *        active language.
 * WHY:   certificatesData titles and the events.js volunteering fields can
 *        be { en, ar, ru } objects; this keeps the CV's certificate and
 *        volunteering lists in the same language as the rest of the page.
 * HOW:   Plain string → returned unchanged (legacy single-language data).
 *        { en, ar, ru } → active language, falling back to English, then to
 *        any value present — so it can never render "[object Object]".
 */
function cvLocalizeCert(value) {
  if (value && typeof value === 'object') {
    const lang = cvActiveLang();
    return value[lang] || value.en || Object.values(value)[0] || '';
  }
  return value;
}

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
/**
 * WHAT:  Formats one skill for the compact CV list.
 * WHY:   skillsData now uses percentage/level (either can be `null`
 *        for a skill that hasn't been self-rated yet) instead of
 *        the old always-present text level — this keeps the CV
 *        from ever printing "Python (null)".
 */
function formatCvSkill(skill) {
  if (skill.percentage !== null && skill.percentage !== undefined) {
    return `${skill.name} (${skill.percentage}%)`;
  }
  if (skill.level) {
    return `${skill.name} (${skill.level})`;
  }
  return skill.name;
}

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
          <span class="cv-skill-names">${skills.map(formatCvSkill).join(', ')}</span>
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
            <span>${cvLocalizeCert(cert.title)}</span>
            <span class="cv-list-date">${cert.date}</span>
          </div>
          <p>${cert.provider}</p>
        </li>
      `
    )
    .join('');
}

/**
 * WHAT:  Returns the volunteering entries to show on the CV, in order.
 * WHY:   The Volunteering PAGE renders every type:'volunteering' entry from
 *        data/events.js (through the EventSystem). The CV must show those
 *        SAME real entries, in the same order — so it reads that same array,
 *        the single source of truth, rather than a separate list that can
 *        silently drift (which is exactly how a stale placeholder used to
 *        surface here).
 * HOW:   Prefers window.eventsData filtered to type:'volunteering'. Falls
 *        back to the legacy volunteeringData array only if events.js hasn't
 *        loaded, so cv.js is still safe on its own.
 */
function getCvVolunteeringEntries() {
  if (typeof window !== 'undefined' && Array.isArray(window.eventsData)) {
    const fromEvents = window.eventsData.filter((e) => e && e.type === 'volunteering');
    if (fromEvents.length) return fromEvents;
  }
  if (typeof volunteeringData !== 'undefined' && Array.isArray(volunteeringData)) {
    return volunteeringData;
  }
  return [];
}

/**
 * WHAT:  Renders the real volunteering entries as a compact CV-style list.
 * HOW:   Each field (role / organization / date / description) may be a
 *        { en, ar, ru } object (events.js) or a plain string (legacy data);
 *        cvLocalizeCert resolves either to the active language, so the CV
 *        volunteering list localizes exactly like the certificate list.
 */
function renderCvVolunteering() {
  const list = document.getElementById('cv-volunteering');
  if (!list) return;

  const entries = getCvVolunteeringEntries();

  if (entries.length === 0) {
    list.innerHTML = '<li><p class="cv-empty">Nothing recorded yet.</p></li>';
    return;
  }

  list.innerHTML = entries
    .map((entry) => {
      const role = cvLocalizeCert(entry.role) || '';
      const organization = cvLocalizeCert(entry.organization) || '';
      const date = cvLocalizeCert(entry.date) || '';
      const description = cvLocalizeCert(entry.description) || '';
      const heading = [role, organization].filter(Boolean).join(' &middot; ');
      return `
        <li>
          <div class="cv-list-heading">
            <span>${heading}</span>
            <span class="cv-list-date">${date}</span>
          </div>
          <p>${description}</p>
        </li>
      `;
    })
    .join('');
}
