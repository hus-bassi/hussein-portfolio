/* ============================================================
   JS/SKILLS.JS
   Renders skillsData into #skills-groups on pages/skills.html,
   grouped by category. Each skill shows its honest text-label
   level (Learning / Familiar / Comfortable / ...) as a small
   badge — never a percentage.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
});

function renderSkills() {
  const container = document.getElementById('skills-groups');
  const emptyState = document.getElementById('skills-empty-state');
  if (!container || typeof skillsData === 'undefined') return;

  if (skillsData.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  container.innerHTML = buildGroupedSkills(skillsData);
}

/**
 * WHAT:  Groups the flat skillsData array by `category`, then
 *        builds one section per category.
 * WHY:   Matches the promise made in data/skills.js's own comment —
 *        "groups everything by category automatically."
 * HOW:   Reduces the array into a { categoryName: [skills] } object,
 *        then maps that into HTML sections.
 */
function buildGroupedSkills(skills) {
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(
      ([category, categorySkills]) => `
        <div class="skills-category reveal">
          <h3>${category}</h3>
          <div class="skills-list">
            ${categorySkills.map(buildSkillEntry).join('')}
          </div>
        </div>
      `
    )
    .join('');
}

function buildSkillEntry(skill) {
  // Turns "Learning" into "level-learning" for the CSS hook —
  // works automatically for any level word added later.
  const levelSlug = skill.level.toLowerCase().replace(/\s+/g, '-');

  return `
    <div class="skill-entry">
      <span class="skill-name">${skill.name}</span>
      <span class="skill-level-badge level-${levelSlug}">${skill.level}</span>
    </div>
  `;
}
