/* ============================================================
   SCROLL — one reader for the page's position, and nothing else.

   The old arrangement had a scroll listener in site.js, another in page.js,
   another in records.js, and two more inside ui.js — five listeners all
   reading `scrollY` and all batching their own rAF. This replaces them with
   one, and publishes the result as CSS custom properties so the stylesheet
   can compose movement instead of JavaScript writing transforms element by
   element.

   What it publishes on <html>
   ---------------------------
     --scroll-p   how far down the page we are, 0 … 1  (the progress rail)
     --scroll-v   speed of travel, 0 … 1, smoothed and decaying
                  (glow responses: the marquee, the rail, the light field)
     --scroll-d   -1 up, 0 still, 1 down            (direction-aware detail)
     --hero-y     how far the hero has travelled out, 0 … 1
                  (every hero layer multiplies this by its own depth)

   On each [data-track] element
   ----------------------------
     --p          that section's own 0 … 1 progress through the viewport,
                  from the moment its top enters at the bottom of the screen
                  to the moment its bottom leaves at the top. Used by the
                  timeline rail, the roadmap trajectory and the data bus.

   Also owned here, because they are the same measurement:
     · the header's stuck state
     · whether the back-to-top button is on screen

   Velocity is zeroed under still mode — nothing should visibly react to a
   flick when the visitor has asked for calm — but the progress and the
   stuck state still work, because those are states, not movement.
   ============================================================ */
(function () {
  'use strict';

  var Scroll = window.Scroll = window.Scroll || {};
  var root = document.documentElement;

  var y = 0, prevY = 0, v = 0, p = 0, hero = 0, heroH = 0;
  var dir = 0, heroEl = null, header = null, toTop = null;
  var tracks = [];
  var last = {};

  function clamp(n, a, b) { return n < a ? a : (n > b ? b : n); }

  function still() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setVar(name, value) {
    if (last[name] === value) return;
    last[name] = value;
    root.style.setProperty(name, value);
  }

  function cache() {
    heroEl = document.querySelector('.hero');
    heroH = heroEl ? heroEl.offsetHeight : 0;
    header = document.getElementById('site-header');
    toTop = document.getElementById('to-top');
    tracks = Array.prototype.slice.call(document.querySelectorAll('[data-track]'));
  }

  /* The chrome: header tint and the back-to-top button. Both are binary
     states, so nothing here runs every frame — only when the state flips. */
  function chrome() {
    if (header) {
      var stuck = y > 40;
      if (header.classList.contains('is-stuck') !== stuck) header.classList.toggle('is-stuck', stuck);
    }
    if (toTop) {
      /* a class, not the `hidden` attribute: display is not transitionable,
         and a button that blinks into existence is not an arrival. The CSS
         owns the 450ms rise and keeps it out of the tab order while it is
         away (see .to-top). */
      var show = y > 600;
      if (toTop.classList.contains('is-on') !== show) toTop.classList.toggle('is-on', show);
    }
  }

  /* One read of the page's geometry per frame, then every write. Reads
     first, writes second — a write never invalidates a read we still need.
     `force` is for the first call and for a refresh: the section progress
     has to be measured at least once without the page moving, or a
     trajectory that draws with scroll starts out already finished. */
  function measure(dt, now, force) {
    prevY = y;
    y = now;

    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - d.clientHeight);
    setVar('--scroll-p', clamp(y / max, 0, 1).toFixed(4));

    if (!still() && dt) {
      /* px per second, normalised against a brisk 1400px/s flick, with a
         per-second decay so the glow settles instead of snapping off */
      var raw = (y - prevY) / dt;
      var target = clamp(Math.abs(raw) / 1400, 0, 1);
      var k = 1 - Math.pow(1 - 0.16, dt * 60);
      v += (target - v) * k;
      if (v < 0.002) v = 0;
      setVar('--scroll-v', v.toFixed(3));
      if (y !== prevY) dir = y > prevY ? 1 : -1;
      setVar('--scroll-d', String(dir));
    }

    if (heroH) {
      hero = clamp(y / (heroH * 0.85), 0, 1);
      setVar('--hero-y', hero.toFixed(4));
    }

    if (y !== prevY || force) {
      var h = window.innerHeight;
      for (var i = 0; i < tracks.length; i++) {
        var el = tracks[i];
        var r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;      /* hidden or not laid out */
        var t = clamp((h - r.top) / ((r.height || 1) + h), 0, 1);
        var key = '@' + i;
        var val = t.toFixed(3);
        if (last[key] === val) continue;
        last[key] = val;
        el.style.setProperty('--p', val);
      }
    }

    chrome();
  }

  /* One frame. `pageYOffset` is a cheap read; the layout reads and the style
     writes further down are not, so they happen only when the page has
     actually moved or the speed glow is still settling. */
  function frame(dt) {
    var now = window.pageYOffset || root.scrollTop || 0;
    if (now === y && v === 0) return;
    measure(dt, now);
  }

  /* Re-read everything and repaint the derived state at once. Called on load
     and whenever the page's height can have changed — a resize, or a
     language switch, which re-renders every list on the site. */
  Scroll.refresh = function () {
    last = {};
    cache();
    v = 0;
    measure(0, window.pageYOffset || root.scrollTop || 0, true);
  };

  Scroll.mount = function () {
    Scroll.refresh();
    if (window.Tick) Tick.subscribe(frame);
    window.addEventListener('load', Scroll.refresh);
    window.addEventListener('resize', Scroll.refresh, { passive: true });
    document.addEventListener('site-lang-change', Scroll.refresh);
    if (window.Motion) Motion.onChange(Scroll.refresh);
  };
})();

