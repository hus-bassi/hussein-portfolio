/* ============================================================
   JS/PROJECTS.JS
   Renders projectsData into #projects-grid on pages/projects.html.
   Shows a clean, honest empty state when the array has nothing in
   it yet — see the comment at the top of data/projects.js for why
   no fake demo entries are used here, unlike certificates/volunteering.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
});

/**
 * WHAT:  Fills #projects-grid with project cards, or shows the
 *        empty-state message if there are none yet.
 * WHERE: Runs once on page load. No-ops if #projects-grid isn't
 *        present (i.e. we're not on pages/projects.html).
 */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const emptyState = document.getElementById('projects-empty-state');
  if (!grid || typeof projectsData === 'undefined') return;

  if (projectsData.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  grid.innerHTML = projectsData.map(buildProjectCard).join('');
}

/**
 * WHAT:  Builds the HTML string for a single project card.
 * HOW:   Technology tags reuse the same .skill-chip style as the
 *        Volunteering page's skills-gained chips — same idea
 *        (a short list of small labels), so the same CSS applies.
 *        GitHub / Live Demo links only render if a URL was provided.
 */
function buildProjectCard(project) {
  const techChips = project.technologies
    .map((tech) => `<span class="skill-chip">${tech}</span>`)
    .join('');

  const githubLink = project.github
    ? `<a href="${project.github}" class="btn btn-secondary" target="_blank" rel="noopener">GitHub</a>`
    : '';

  const demoLink = project.liveDemo
    ? `<a href="${project.liveDemo}" class="btn btn-secondary" target="_blank" rel="noopener">Live Demo</a>`
    : '';

  return `
    <article class="cert-card reveal">
      <p class="cert-category">${project.category}</p>
      <h3 class="cert-title">${project.title}</h3>
      <p class="cert-provider">${project.date}</p>
      <p class="cert-description">${project.description}</p>
      <div class="skill-chips">${techChips}</div>
      <div class="project-links">${githubLink}${demoLink}</div>
    </article>
  `;
}
