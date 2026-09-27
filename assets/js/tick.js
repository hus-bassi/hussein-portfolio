/* ============================================================
   TICK — the single animation loop for the whole site.

   WHY A LOOP AT ALL
   -----------------
   Three things on this page want to move every frame: the star field, the
   pointer light, and the scroll reader. Three separate rAF loops would mean
   three callbacks racing each other, three chances to write a style before
   the previous one has been read, and no single place to stop when the tab
   goes to the background. This module is that single place.

   CONTRACT
   --------
     Tick.subscribe(fn)    fn(dt, t) — dt is seconds, clamped, so a
                           backgrounded tab returning after a minute does not
                           teleport every animated object on the page
     Tick.unsubscribe(fn)
     Tick.size()           how many things are listening

   The loop runs ONLY while something is subscribed, and it stops the moment
   the document is hidden. A page nobody is looking at costs nothing.

   It is deliberately dependency-free: it loads before every other module,
   and nothing else may start its own rAF.
   ============================================================ */
(function () {
  'use strict';

  var Tick = window.Tick = window.Tick || {};

  var subs = [];
  var raf = 0;
  var last = 0;
  var running = false;

  function frame(t) {
    if (!running) return;
    raf = window.requestAnimationFrame(frame);

    /* frame-rate independent, and clamped: the same feel at 60 and 120 Hz,
       and no giant dt after the tab has been asleep. */
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
    last = t;

    /* A subscriber that throws must not take the whole loop down with it.
       The site keeps moving; the broken module simply stops updating. */
    for (var i = 0; i < subs.length; i++) {
      try {
        subs[i](dt, t);
      } catch (e) { /* one bad subscriber is not the page's problem */ }
    }
  }

  function start() {
    if (running || !subs.length || document.hidden) return;
    running = true;
    last = 0;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(raf);
  }

  Tick.subscribe = function (fn) {
    if (typeof fn !== 'function' || subs.indexOf(fn) > -1) return;
    subs.push(fn);
    start();
  };

  Tick.unsubscribe = function (fn) {
    var i = subs.indexOf(fn);
    if (i === -1) return;
    subs.splice(i, 1);
    if (!subs.length) stop();
  };

  Tick.size = function () { return subs.length; };

  /* The tab is backgrounded → nothing to draw. This is the cheapest win
     available on a page with a canvas on it. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
