/* ============================================================
   NAVIGATION.JS
   Everything related to the header and primary navigation lives
   here, separate from main.js, so each file has one clear job.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initActiveLink();
});

/**
 * WHAT:  Opens and closes the full-screen mobile navigation overlay.
 * WHY:   On small screens the nav links are hidden by default
 *        (see the 768px breakpoint in css/main.css) and need a
 *        button to reveal them.
 * WHERE: Runs once on page load, attaches click listeners that
 *        then run for the lifetime of the page.
 * HOW:   Toggles `aria-expanded` on the button (which also drives
 *        the bars-to-X animation via CSS) and `.is-open` on the
 *        nav itself. Also closes the menu automatically when a
 *        link inside it is clicked, so tapping "About" doesn't
 *        leave the overlay stuck open on the next page.
 */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  function setMenuState(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    // Prevent the page from scrolling behind the full-screen overlay
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

/**
 * WHAT:  Adds a solid background to the header once the user has
 *        scrolled down a little.
 * WHY:   The header sits on top of page content (position: sticky),
 *        so it needs a background once there's something to
 *        separate itself from — otherwise nav text can become
 *        unreadable against busy content underneath it.
 * WHERE: Runs on page load, then listens to the scroll event.
 * HOW:   Toggles the `.is-scrolled` class (styled in main.css) once
 *        the user has scrolled past a small pixel threshold.
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 24;

  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateHeaderState(); // handles the case of loading mid-scroll (e.g. anchor links)
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/**
 * WHAT:  Marks the nav link that matches the current page as active.
 * WHY:   So the person always sees where they are in the site. This
 *        is done in JS instead of hardcoding a class in every HTML
 *        file, so every page automatically gets the right active
 *        state without us having to remember to set it by hand.
 * WHERE: Runs once on page load.
 * HOW:   Compares each nav link's path to the current page's path.
 */
function initActiveLink() {
  const links = document.querySelectorAll('[data-nav-link]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active-page');
    }
  });
}
