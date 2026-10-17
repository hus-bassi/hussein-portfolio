/* ============================================================
   assets/js/cinematic.js — Silent Mode
   Sound is completely deactivated per user instruction to ensure
   maximum performance and zero audio overhead.
   Zero audio contexts created, zero listeners attached.
   ============================================================ */
(function () {
  'use strict';

  function noop() {}

  window.Cinematic = {
    playClick: noop,
    playChime: noop,
    playTransition: noop,
    playArrival: noop,
    playExpand: noop,
    playCollapse: noop,
    playHover: noop
  };
})();
