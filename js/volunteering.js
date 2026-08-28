/* ============================================================
   JS/VOLUNTEERING.JS
   Handles two things, both built around the volunteeringData
   array from data/volunteering.js:

   1. The homepage preview list (all demo entries, simple cards)
   2. The full Volunteering page (a proper timeline)

   Each checks for its own DOM element first, so this one file
   works safely on both index.html and pages/volunteering.html.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderVolunteeringPreview();
  renderVolunteeringTimeline();
});

/* ------------------------------------------------------------
   SHARED: the certificate link, reused by both views
------------------------------------------------------------- */

/**
 * WHAT:  Returns a "View Certificate" link, or nothing at all.
 * WHY:   Not every volunteer entry has a certificate — this keeps
 *        that optional logic in one place instead of repeating it.
 */
function buildCertificateLink(entry) {
  if (!entry.certificateUrl) return '';
  return `<a href="${entry.certificateUrl}" class="btn btn-secondary volunteer-cert-link" target="_blank" rel="noopener">View Certificate</a>`;
}

/**
 * WHAT:  Returns the skills-gained list as small pill chips.
 * WHY:   One shared renderer so preview and full page match visually.
 */
function buildSkillChips(skillsGained) {
  return skillsGained.map((skill) => `<span class="skill-chip">${skill}</span>`).join('');
}

/* ------------------------------------------------------------
   1. HOMEPAGE PREVIEW
------------------------------------------------------------- */

/**
 * WHAT:  Fills #volunteering-preview-list with all demo/real entries.
 * WHERE: Runs once on page load. No-ops if the homepage list isn't present.
 */
function renderVolunteeringPreview() {
  const list = document.getElementById('volunteering-preview-list');
  if (!list || typeof volunteeringData === 'undefined') return;

  list.innerHTML = volunteeringData.map(buildPreviewItem).join('');
}

function buildPreviewItem(entry) {
  const demoBadge = entry.isDemo ? '<span class="demo-badge">Demo</span>' : '';

  return `
    <li class="volunteer-item reveal">
      ${demoBadge}
      <h3 class="volunteer-role">${entry.role} &middot; ${entry.organization}</h3>
      <p class="volunteer-date">${entry.date}</p>
      <p class="volunteer-description">${entry.description}</p>
      <p class="volunteer-skills">Skills gained: ${entry.skillsGained.join(', ')}</p>
    </li>
  `;
}

/* ------------------------------------------------------------
   2. FULL VOLUNTEERING PAGE — timeline
------------------------------------------------------------- */

/**
 * WHAT:  Fills #volunteering-timeline with every entry as a full
 *        timeline item — organization, role, event, date, full
 *        description, skill chips, and an optional certificate link.
 * WHERE: Runs once on page load. No-ops if that element isn't present
 *        (i.e. we're not on pages/volunteering.html).
 */
function renderVolunteeringTimeline() {
  const timeline = document.getElementById('volunteering-timeline');
  if (!timeline || typeof volunteeringData === 'undefined') return;

  timeline.innerHTML = volunteeringData.map(buildTimelineItem).join('');
}

function buildTimelineItem(entry) {
  const demoBadge = entry.isDemo ? '<span class="demo-badge">Demo</span>' : '';

  return `
    <li class="timeline-item is-experience reveal">
      ${demoBadge}
      <span class="timeline-date">${entry.date}</span>
      <h3>${entry.role} &middot; ${entry.organization}</h3>
      <p class="volunteer-event">${entry.event}</p>
      <p>${entry.description}</p>
      <div class="skill-chips">${buildSkillChips(entry.skillsGained)}</div>
      ${buildCertificateLink(entry)}
    </li>
  `;
}
