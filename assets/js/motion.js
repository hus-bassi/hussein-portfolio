/* ============================================================
   MOTION â€” the single source of truth for movement on this site.

   Everything animated asks this module one question: is the operating
   system asking for calm? There is exactly one trigger, and it is the
   operating system. A page cannot change `prefers-reduced-motion`, and
   pretending otherwise is a lie the visitor can see.

   WHY THERE IS NO SWITCH IN THE HEADER
   ------------------------------------
   There used to be a small control here that let a visitor override the
   OS setting for this site. It was removed: it was a button in the corner
   that meant nothing to most people, it duplicated a decision the visitor
   had already made in their system settings, and the only code that
   existed to serve it was a localStorage key that could leave a page
   fighting the machine it was running on. Reduced motion is now exactly
   what the operating system says it is.

   WHAT "REDUCED" MEANS HERE
   ------------------------
   Less travel, never less life. The still layer lives in one media query
   at the bottom of assets/css/site.css and it turns movement OFF â€” the
   loops, the drift, the field, the pointer light. Every gradient, glow
   and colour stays, and every state a visitor can reach is still
   reachable. Freezing the whole page into one frame is what once made the
   site look broken rather than calm, and it is not how this is done.

     Motion.isStill()      is the OS asking?
     Motion.onChange(fn)   run fn(true) the moment the OS answer changes
     Motion.isFinePointer()  a hover-capable, precise pointer
   ============================================================ */
(function () {
  'use strict';

  var Motion = window.Motion = window.Motion || {};
  var listeners = [];
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Read, not decide. One media query is queried for the whole site, so
     the stylesheet and the scripts can never disagree about it. */
  Motion.isStill = function () { return mq.matches && !/[?&]motion=full/.test(location.search); };

  /* Is this a touch-first device? The custom cursor and the heavy field
     are desktop-only; on touch they cost battery and buy nothing. */
  Motion.isFinePointer = function () {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  Motion.onChange = function (fn) { listeners.push(fn); };

  /* Follow the OS live: a visitor who turns animation off (or back on) in
     their system settings while the page is open must not have to reload
     to be obeyed. Subscribers clean up (or rebuild) the layers they own. */
  function notify(still) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](still); } catch (e) { /* one bad subscriber is not the page's problem */ }
    }
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) { notify(e.matches); });
  }
})();
