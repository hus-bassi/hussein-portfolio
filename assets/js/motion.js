/* ============================================================
   MOTION — the single source of truth for movement on this site.

   Everything animated goes through here, so there is exactly one place
   that knows about:
     · the user's motion preference
     · the fact that a browser cannot change prefers-reduced-motion from
       a stylesheet
     · what "reduced" means: less travel, never less life

   WHY THIS FILE EXISTS
   -------------------
   `prefers-reduced-motion` is an operating-system setting. A page cannot
   turn it off, and should not pretend to. But it can offer a choice of
   its own that the visitor controls, which is what this does:

     default   → follow the OS setting
     full      → the full cinematic layer, whatever the OS says
     still     → reduced: no travel, no loops, but the site is alive

   That distinction matters. An earlier version answered "reduced" by
   compressing every animation to 0.001ms, which made the site look
   broken rather than calm — and it was the reason for the report that
   the site had no animation at all.
   ============================================================ */
(function () {
  'use strict';

  var Motion = window.Motion = window.Motion || {};

  var KEY = 'site-motion';
  var root = document.documentElement;
  var listeners = [];

  function osPrefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ }
  }

  /* 'auto' | 'full' | 'still' */
  Motion.mode = function () {
    var saved = read();
    if (saved === 'full' || saved === 'still') return saved;
    return 'auto';
  };

  Motion.isStill = function () {
    var m = Motion.mode();
    if (m === 'still') return true;
    if (m === 'full') return false;
    return osPrefersReduced();
  };

  /* Is this a touch-first device? The custom cursor and the heavy field
     are desktop-only; on touch they cost battery and buy nothing. */
  Motion.isFinePointer = function () {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  Motion.set = function (mode) {
    if (mode !== 'full' && mode !== 'still' && mode !== 'auto') return;
    write(mode);
    Motion.apply();
    listeners.forEach(function (fn) { fn(Motion.isStill()); });
  };

  /* One attribute on <html> is the whole contract:
       data-motion="still"  → the CSS reduced layer applies
       data-motion="full"   → the full layer applies, OS setting ignored
     Every animated system in the codebase reads this single flag. */
  Motion.apply = function () {
    var still = Motion.isStill();
    root.setAttribute('data-motion', still ? 'still' : 'full');
    root.classList.toggle('motion-still', still);
    root.classList.toggle('motion-full', !still);
  };

  Motion.onChange = function (fn) { listeners.push(fn); };

  /* Follow the OS live: if the visitor flips the system setting while the
     page is open, and they have not made an explicit choice here, honour it. */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (Motion.mode() === 'auto') Motion.apply();
    });
  }

  Motion.apply();
})();
