/* ============================================================
   NAVIGATION.JS
   Everything related to the header and primary navigation lives
   here, separate from main.js, so each file has one clear job.

   MOBILE MENU — Architecture (v2):
   The <nav id="primary-nav"> lives inside <header>. On scroll,
   the header gains backdrop-filter:blur(10px) which per CSS spec
   creates a containing block that BREAKS position:fixed on the nav.
   Fix: JS strips backdrop-filter via body.menu-open class while
   the overlay is open; CSS removes it from .site-header.is-scrolled.

   Scroll lock uses the "body.fixed + negative top" technique
   (not overflow:hidden) so the exact scroll position is preserved
   on close — including on iOS Safari.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initActiveLink();
  initDropdown();
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
 *        nav itself. Also closes the menu automatically when an
 *        actual navigation link is clicked — deliberately scoped
 *        to `a.nav-link` (not the "Work" dropdown's trigger
 *        <button>), otherwise opening the dropdown on mobile would
 *        instantly close the whole overlay.
 *
 *   SCROLL LOCK — uses body.fixed + negative top (not overflow:hidden)
 *   because it preserves the exact scroll position across all browsers
 *   including iOS Safari, and avoids layout shifts.
 *
 *   FOCUS — moves focus to the nav on open; restores it to the
 *   hamburger button on close.
 *
 *   ESC — pressing Escape closes the menu (same as clicking the
 *   hamburger).
 */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  let savedScrollY = 0;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  nav.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    setMenuState(false);
    toggle.focus();
  });

  function setMenuState(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);

    if (open) {
      // Save current scroll position before locking
      savedScrollY = window.scrollY;

      // Lock scroll: fix body in place, offset by current scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Move focus into the nav for keyboard accessibility
      const firstLink = nav.querySelector('a.nav-link, button');
      if (firstLink) firstLink.focus();
    } else {
      // Unlock scroll: restore body and jump back to saved position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      window.scrollTo(0, savedScrollY);

      // Reset cursor if custom cursor system is active
      document.dispatchEvent(new CustomEvent('cursor:reset'));
    }
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
    // Don't update scroll state while mobile menu is open —
    // body is position:fixed and scrollY is meaningless
    if (document.body.classList.contains('menu-open')) return;
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateHeaderState(); // handles the case of loading mid-scroll (e.g. anchor links)
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/**
 * WHAT:  Marks the nav link that matches the current page as active
 *        — and, if that link is inside the "Work" dropdown, marks
 *        the dropdown's own trigger button as active too.
 * WHY:   So the person always sees where they are in the site, even
 *        when the matching link is hidden inside a collapsed dropdown.
 * WHERE: Runs once on page load.
 * HOW:   Compares each nav link's path to the current page's path.
 */
function initActiveLink() {
  const links = document.querySelectorAll('[data-nav-link]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath !== currentPath) return;

    link.classList.add('active-page');

    const parentDropdown = link.closest('.nav-dropdown');
    if (parentDropdown) {
      const trigger = parentDropdown.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.classList.add('active-page');
    }
  });
}

/**
 * WHAT:  Wires up the "Work" dropdown (Certificates / Volunteering /
 *        Projects / Research / Skills) that replaced 5 separate
 *        top-level nav links — this is what cut the nav down from
 *        10 links to 6.
 * WHY:   Click-to-toggle (not just hover) so it works identically
 *        with mouse, touch, and keyboard.
 * WHERE: Runs once on page load. Safe no-op if no dropdown exists
 *        on this page (defensive, though every page has one now).
 * HOW:   Toggles `aria-expanded` on the trigger and `.is-open` on
 *        the `.nav-dropdown` wrapper. Closes on: clicking outside,
 *        pressing Escape, or selecting one of its own links (the
 *        link click also closes the mobile overlay via initMobileMenu).
 */
function initDropdown() {
  const dropdown = document.getElementById('work-dropdown');
  const trigger = document.getElementById('work-dropdown-trigger');
  if (!dropdown || !trigger) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    setDropdownState(!isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) setDropdownState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setDropdownState(false);
  });

  dropdown.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => setDropdownState(false));
  });

  function setDropdownState(open) {
    trigger.setAttribute('aria-expanded', String(open));
    dropdown.classList.toggle('is-open', open);
  }
}
