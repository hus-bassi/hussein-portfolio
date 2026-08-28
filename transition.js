/* ============================================================
   TRANSITION.JS
   Builds the overlay (see transition.css) and shows it briefly
   before following any link that jumps between the Portal,
   Academic, and Sports sides — `.site-switch-link` (the small
   "Portal / Volleyball / Academic" links in every header) and
   `.portal-card` (the two big choice cards on the Portal page).
   Ordinary in-page links and same-side navigation are completely
   untouched — this only intercepts the specific links that cross
   between sides, so it never gets in the way of normal browsing.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
});

function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="page-transition-mark"></div>';
  document.body.appendChild(overlay);

  const TRANSITION_DELAY_MS = 550;

  document.querySelectorAll('.site-switch-link, .portal-card').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      event.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(() => {
        window.location.href = href;
      }, TRANSITION_DELAY_MS);
    });
  });
}
