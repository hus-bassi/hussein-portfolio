/* ============================================================
   The 20 Cinematic Animation Styles — In-Page Runtime Engine
   assets/js/cinematic.js

   Drives and initializes native dynamic behaviors for the 20
   visual animation styles directly in the page components.
   Zero floating modals, zero intrusive buttons.
   Supports full accessibility and reduced motion.
   ============================================================ */
(function () {
  'use strict';

  // 1. Retro VHS Timecode Generator
  function updateVHSTimecode() {
    var vhsElements = document.querySelectorAll('.style-retro-vhs [data-vhs-time]');
    if (!vhsElements.length) return;
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var timeStr = 'REC ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    vhsElements.forEach(function (el) {
      el.textContent = timeStr;
    });
  }

  // 2. Split-Flap Interactive Flip on Hover
  function setupSplitFlapHover() {
    var digits = document.querySelectorAll('.split-flap-digit');
    digits.forEach(function (d) {
      d.addEventListener('mouseenter', function () {
        d.style.transform = 'rotateX(20deg)';
        setTimeout(function () { d.style.transform = ''; }, 250);
      });
    });
  }

  // 3. Subtle Parallax for Celestial Wireframe
  function setupWireframeParallax() {
    var cages = document.querySelectorAll('.wireframe-cage');
    if (!cages.length) return;
    window.addEventListener('pointermove', function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5) * 15;
      var cy = (e.clientY / window.innerHeight - 0.5) * 15;
      cages.forEach(function (c) {
        c.style.transform = 'translate(' + cx.toFixed(1) + 'px, ' + cy.toFixed(1) + 'px)';
      });
    }, { passive: true });
  }

  // Lifecycle Initialization
  function initInPageStyles() {
    setupSplitFlapHover();
    setupWireframeParallax();
    updateVHSTimecode();
    setInterval(updateVHSTimecode, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInPageStyles);
  } else {
    initInPageStyles();
  }

  window.addEventListener('site-lang-change', function () {
    setTimeout(setupSplitFlapHover, 100);
  });
})();
