/* ============================================================
   JS/SKILLS.JS
   Renders skillsData into #skills-groups, grouped by category.
   Skills with a real `percentage` get a premium circular progress
   ring (animated count-up from 0, triggered once the card scrolls
   into view). Skills with `percentage: null` get a simpler "not
   yet rated" card instead — never a ring stuck at 0%, since that
   would misleadingly read as "no ability" rather than "unmeasured".
   ============================================================= */

const SKILL_RING_RADIUS = 52;
const SKILL_RING_CIRCUMFERENCE = 2 * Math.PI * SKILL_RING_RADIUS;

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  initSkillRingAnimation();
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
 * WHAT:  Groups the flat skillsData array by `category`.
 * WHY:   Matches the promise in data/skills.js — categories are
 *        derived from the data, never hardcoded here.
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
          <div class="skills-ring-grid">
            ${categorySkills.map(buildSkillCard).join('')}
          </div>
        </div>
      `
    )
    .join('');
}

/**
 * WHAT:  Builds one skill card — a ring card if `percentage` is a
 *        real number, or a plain "not yet rated" card if it's null.
 */
function buildSkillCard(skill) {
  if (skill.percentage === null || skill.percentage === undefined) {
    return buildUnratedCard(skill);
  }
  return buildRingCard(skill);
}

function buildUnratedCard(skill) {
  return `
    <div class="skill-card skill-card--unrated reveal">
      <h4>${skill.name}</h4>
      <p class="skill-unrated-label">Not yet rated</p>
    </div>
  `;
}

function buildRingCard(skill) {
  const level = skill.level ? `<p class="skill-ring-level">${skill.level}</p>` : '';
  const description = skill.description
    ? `<p class="skill-ring-desc">${skill.description}</p>`
    : '';

  return `
    <div class="skill-card skill-card--rated reveal">
      <div class="skill-ring" data-percentage="${skill.percentage}">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="skill-ring-track" cx="60" cy="60" r="${SKILL_RING_RADIUS}" />
          <circle
            class="skill-ring-progress"
            cx="60" cy="60" r="${SKILL_RING_RADIUS}"
            style="stroke-dasharray: ${SKILL_RING_CIRCUMFERENCE}; stroke-dashoffset: ${SKILL_RING_CIRCUMFERENCE};"
          />
        </svg>
        <span class="skill-ring-value" role="img" aria-label="${skill.name}: ${skill.percentage} percent">0%</span>
      </div>
      <h4>${skill.name}</h4>
      ${level}
      ${description}
    </div>
  `;
}

/**
 * WHAT:  Animates every `.skill-ring` from 0 up to its real
 *        percentage — both the ring fill and the number — the
 *        first time it scrolls into view.
 * WHY:   A quiet, premium reveal instead of numbers just appearing.
 * HOW:   IntersectionObserver triggers the animation once per ring.
 *        If the person prefers reduced motion, the final value is
 *        set immediately instead of counting up — matches the
 *        prefers-reduced-motion handling used everywhere else on
 *        the site.
 */
function initSkillRingAnimation() {
  const rings = document.querySelectorAll('.skill-ring');
  if (!rings.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    rings.forEach(setRingToFinalValue);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateRing(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  rings.forEach((ring) => observer.observe(ring));
}

function setRingToFinalValue(ring) {
  const percentage = Number(ring.dataset.percentage);
  const progressCircle = ring.querySelector('.skill-ring-progress');
  const valueLabel = ring.querySelector('.skill-ring-value');
  const offset = SKILL_RING_CIRCUMFERENCE * (1 - percentage / 100);

  progressCircle.style.transition = 'none';
  progressCircle.style.strokeDashoffset = String(offset);
  valueLabel.textContent = `${percentage}%`;
}

function animateRing(ring) {
  const percentage = Number(ring.dataset.percentage);
  const progressCircle = ring.querySelector('.skill-ring-progress');
  const valueLabel = ring.querySelector('.skill-ring-value');
  const DURATION_MS = 1200;
  const startTime = performance.now();

  const finalOffset = SKILL_RING_CIRCUMFERENCE * (1 - percentage / 100);
  progressCircle.style.transition = `stroke-dashoffset ${DURATION_MS}ms ease`;
  // Triggers on the next frame so the transition actually animates
  // instead of jumping straight to the end value.
  requestAnimationFrame(() => {
    progressCircle.style.strokeDashoffset = String(finalOffset);
  });

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const currentValue = Math.round(progress * percentage);
    valueLabel.textContent = `${currentValue}%`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}
