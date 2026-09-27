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
     The same trick as the hero: a class on <html> for one frame, so the
     browser never paints the final position and then jumps to it. The
     fallback timer is the safety net, and it is longer than the sequence
     it protects — 2.6s of delay plus a 1.6s arrival. */
  var root = document.documentElement;
  root.classList.add('is-entering');
  function enter() { root.classList.remove('is-entering'); }
  var head = document.querySelector('.page-head');
  if (head) requestAnimationFrame(function () { requestAnimationFrame(function () { head.classList.add('is-in'); }); });
  else enter();
  setTimeout(enter, 2800);

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
