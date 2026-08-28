/* ============================================================
   JS/ANIMATIONS.JS
   Brought forward from Phase 14 at Hussein's request — a first,
   simple scroll-reveal effect. Fuller motion work (parallax,
   more elaborate transitions) still happens in Phase 14 later.

   Uses IntersectionObserver instead of a 'scroll' event listener:
   it only runs when an element's visibility actually changes,
   rather than on every single scroll frame — much cheaper, which
   matters given how strongly performance was emphasized in the brief.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

/**
 * WHAT:  Fades and lifts elements into place as they scroll into view.
 * WHY:   A quiet, premium motion detail — content arrives deliberately
 *        instead of just appearing, without being distracting or
 *        costing meaningful performance.
 * WHERE: Runs once on page load. Applies to any element carrying the
 *        `.reveal` class — new sections just need that class added,
 *        no changes needed here.
 * HOW:   IntersectionObserver watches each `.reveal` element and adds
 *        `.is-visible` (styled in css/main.css) the moment ~15% of it
 *        enters the viewport, then stops watching that element — the
 *        animation plays once per element, not every time it scrolls
 *        back into view.
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // If the browser doesn't support IntersectionObserver (very rare
  // today), just show everything immediately instead of leaving it
  // invisible forever.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}
