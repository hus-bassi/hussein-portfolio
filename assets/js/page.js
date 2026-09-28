/* ============================================================
   Shared behaviour for the standalone pages (story.html, and any
   future page that only needs the header, nav, footer and reveal).
   The records page has its own richer script.

   The header, the back-to-top button, the mobile navigation and the page
   transition are NOT here: they are in assets/js/ui.js, which is loaded by
   every page, because three copies of "is the header stuck" and "what does
   back-to-top do" is three things that can disagree. What remains here is
   the order those things are started in.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- the page-head entrance ----------
     It is NOT here. The head used to be animated from this file, behind two
     nested requestAnimationFrames — which meant records.html, which does not
     load this file, never revealed its title at all. It belongs to the
     reveal engine now (Reveal.enter, which also self-initialises), so that
     a page cannot forget to ask for it and a page that never loads a script
     of its own still gets a heading. Nothing to start here. */

  /* ---------- reveal ---------- */
  if (window.Reveal) Reveal.scan();

  /* ---------- scroll tracking ---------- */
  if (window.Scroll) Scroll.mount();

  /* ---------- shared furniture: language indicator, transitions,
        back-to-top, mobile navigation ---------- */
  if (window.UI) {
    UI.sectionIndex();
    UI.atmosphere();
    UI.mount();
  }

  /* ---------- footer year ---------- */
  var fy = document.getElementById('footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());
})();
