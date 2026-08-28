/* ============================================================
   MAIN.JS — Application entry point
   This is the only script loaded by index.html right now.
   As the project grows, this file becomes the orchestrator that
   imports and initializes the other modules:

     js/navigation.js    → mobile menu, sticky nav, active states   (Phase 02)
     js/language.js      → language detection + switching          (Phase 12)
     js/animations.js    → scroll reveals, orbit/glow effects       (Phase 14)
     js/certificates.js  → renders data/certificates.js into cards  (Phase 04)

   For now it only does two small, real things:
   1. Confirms the DOM is ready and the script is wired up correctly.
   2. Fills in the current year in the footer, so that piece never
      needs to be updated by hand.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initPortraitFallback();
});

/**
 * WHAT:  Writes the current year into the footer's #current-year element.
 * WHY:   So the copyright line stays correct automatically, every year,
 *        without editing HTML.
 * WHERE: Called once on page load, from the DOMContentLoaded listener above.
 * HOW:   Reads the browser's current date and sets it as text content.
 */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * WHAT:  Falls back to a placeholder (initials) if assets/images/profile.jpg
 *        doesn't exist yet.
 * WHY:   The real photo hasn't been added to the project yet. Rather than
 *        showing a browser's broken-image icon, the visitor sees a clean
 *        placeholder that already matches the site's design.
 * WHERE: Called once on page load.
 * HOW:   Listens for the image's `error` event (fires if the file 404s),
 *        hides the <img>, and reveals the placeholder <div> next to it.
 *        Once a real profile.jpg is added to assets/images/, this fallback
 *        simply never triggers — no code changes needed later.
 */
function initPortraitFallback() {
  const image = document.getElementById('portrait-image');
  const placeholder = document.getElementById('portrait-placeholder');
  if (!image || !placeholder) return;

  image.addEventListener('error', () => {
    image.style.display = 'none';
    placeholder.style.display = 'flex';
  });
}
