/* ============================================================
   THEME.JS — Day / Night mode
   The whole existing dark "cosmic universe" design is Night mode
   (the default, exactly as it was). This adds a bright, cheerful
   Day mode — the SAME universe seen in daylight — and a toggle
   button that always sits in the top bar, on every page.

   Design decisions:
   - Theme is stored as data-theme="light" | "dark" on <html>.
     Dark is the default (no attribute needed), so nothing changes
     for a first-time visitor: they still land on Night mode.
   - The tiny inline script in each page's <head> reads the saved
     choice and sets data-theme BEFORE first paint, so a Day-mode
     visitor never sees a flash of dark on load. This file only
     handles the interactive part (the button + the switch effect).
   - Switching uses the View Transitions API to play a circular
     "reveal" that expands from the toggle button — the premium
     transition. Browsers without it, and anyone who prefers
     reduced motion, get an instant (still smooth via CSS) switch.
   ============================================================= */

const THEME_STORAGE_KEY = 'preferredTheme';
const THEMES = ['dark', 'light'];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});

/**
 * WHAT:  Makes sure <html> reflects the saved/active theme, injects
 *        the toggle button into the header, and wires up the switch.
 * WHY:   Single entry point, mirroring how language.js initializes.
 */
function initTheme() {
  applyThemeAttribute(getActiveTheme());
  const button = injectToggleButton();
  if (!button) return;

  updateToggleButton(button, getActiveTheme());
  button.addEventListener('click', () => {
    const next = getActiveTheme() === 'light' ? 'dark' : 'light';
    switchTheme(next, button);
  });
}

/**
 * WHAT:  The theme currently in effect.
 * HOW:   Reads the attribute the inline <head> script already set;
 *        falls back to any saved value, then to dark (the default).
 */
function getActiveTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  if (THEMES.includes(current)) return current;

  let saved = null;
  try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { /* storage blocked */ }
  return THEMES.includes(saved) ? saved : 'dark';
}

/**
 * WHAT:  Writes the theme onto <html> and remembers the choice.
 * WHY:   data-theme on the root is the single switch that every
 *        [data-theme="light"] rule in main.css keys off of.
 */
function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = 'dark';
  applyThemeAttribute(theme);
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) { /* storage blocked */ }

  const button = document.querySelector('.theme-toggle');
  if (button) updateToggleButton(button, theme);
}

function applyThemeAttribute(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * WHAT:  Switches the theme, playing the circular reveal when possible.
 * WHY:   The reveal is the "wow" moment the brief asked for, but it
 *        must degrade gracefully — an instant switch is always correct.
 * HOW:   Uses document.startViewTransition (snapshots the page, then
 *        we animate a growing clip-path circle on the new snapshot,
 *        centered on the toggle button). Skipped entirely for
 *        reduced-motion or browsers without the API.
 */
function switchTheme(next, originEl) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || prefersReduced) {
    applyTheme(next);
    return;
  }

  // Center of the toggle button — the reveal grows out from here.
  const rect = originEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  // Radius large enough to reach the farthest corner of the viewport.
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => applyTheme(next));

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 650,
        easing: 'cubic-bezier(0.76, 0.05, 0.31, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  });
}

/**
 * WHAT:  Creates the sun/moon toggle button and places it in the top
 *        bar. On the Academic pages it goes into the header, grouped
 *        with the mobile menu button so it's always visible (even on
 *        mobile, where the nav links collapse). On the Portal — which
 *        has no header — it becomes a floating top-corner button.
 * WHY:   Injecting it here keeps one source of truth for the button
 *        instead of pasting identical markup into every page.
 * RETURNS: the button element, or null if there's nowhere to put it.
 */
function injectToggleButton() {
  // Idempotent — never add a second button if this somehow runs twice.
  const existing = document.querySelector('.theme-toggle');
  if (existing) return existing;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.innerHTML = `
    <span class="theme-toggle-icons" aria-hidden="true">
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </span>
  `;

  const headerInner = document.querySelector('.header-inner');
  if (headerInner) {
    // Group the theme toggle with the existing mobile menu button so
    // both stay pinned to the top-bar's end, on every screen size.
    const navToggle = headerInner.querySelector('.nav-toggle');
    let controls = headerInner.querySelector('.header-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'header-controls';
      headerInner.appendChild(controls); // last child → sits after the nav
      if (navToggle) controls.appendChild(navToggle); // move the hamburger inside
    }
    controls.insertBefore(button, controls.firstChild); // theme toggle before hamburger
    return button;
  }

  // Portal / any page without a header bar: float it in the top corner.
  button.classList.add('theme-toggle--floating');
  document.body.appendChild(button);
  return button;
}

/**
 * WHAT:  Keeps the button's accessible label in sync with the state.
 * WHY:   The icon alone isn't enough for screen-reader users; the
 *        label announces what pressing it will DO.
 */
function updateToggleButton(button, theme) {
  const isLight = theme === 'light';
  button.setAttribute('aria-pressed', String(isLight));
  const label = isLight ? 'Switch to night mode' : 'Switch to day mode';
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
}
