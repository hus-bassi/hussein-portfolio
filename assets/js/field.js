/* ============================================================
   THE FIELD — a canvas starfield that gives the page its depth.

   Why a canvas and not more DOM: the brief asks for a sparse, slow,
   elegant sky with particles on orbital paths. DOM nodes would mean
   hundreds of elements to composite, and the drift would be animating
   `top`/`left` — layout properties. One canvas animates a single
   transform-free repaint and costs almost nothing.

   Design constraints, all of them deliberate:
     · sparse     — never a starfield wallpaper; ~1 star per 14k px²
     · slow       — drift well under a pixel per second, so it reads as
                    depth rather than as motion
     · orbital    — a third of the stars ride actual ellipses, which is
                    what makes it feel astronomical instead of random
     · cheap      — one shared animation loop (assets/js/tick.js), no
                    per-star objects beyond a plain array, no allocation
                    inside the loop, paused off-screen
     · optional   — absent entirely on reduced-motion, touch and small
                    screens (see counts() below)

   It is decorative: the canvas is aria-hidden, pointer-events:none, and
   nothing here is ever the only means of conveying information.
   ============================================================ */
(function () {
  'use strict';

  var Field = window.Field = window.Field || {};

  var TAU = Math.PI * 2;
  var COLOURS = ['167,139,250', '240,206,126', '111,195,255'];

  function isStill() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Density is a function of the viewport, not a fixed number: a 27" monitor
     and a phone should not get the same count. Touch gets a fraction. */
  function counts(w, h) {
    var area = w * h;
    var base = Math.round(area / 14000);
    if (window.matchMedia('(hover: none)').matches) base = Math.round(base * 0.45);
    return Math.max(14, Math.min(110, base));
  }

  Field.mount = function (host) {
    if (isStill()) return;                       // reduced motion: no movement at all
    if (window.matchMedia('(hover: none)').matches && window.innerWidth < 900) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'field-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) { canvas.remove(); return; }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);   // cap: 3x is not worth it
    var w = 0, h = 0, stars = [], running = false;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var n = counts(w, h);
      var arr = new Array(n);
      for (var i = 0; i < n; i++) {
        /* a third ride an orbit: they travel an ellipse around a centre,
           which is what gives the field its astronomical character */
        var orbital = i % 3 === 0;
        arr[i] = {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.25 + 0.35,
          /* the twinkle phase is pre-rolled so the sky is never in step */
          phase: Math.random() * TAU,
          speed: 0.25 + Math.random() * 0.55,
          colour: COLOURS[i % 3 === 0 ? 1 : (i % 7 === 0 ? 2 : 0)],
          orbital: orbital,
          /* orbit centre + radii + rate, all only used when orbital */
          cx: Math.random() * w,
          cy: Math.random() * h * 0.7,
          rx: 60 + Math.random() * 240,
          ry: 24 + Math.random() * 110,
          a: Math.random() * TAU,
          spin: (Math.random() * 0.06 + 0.015) * (Math.random() < 0.5 ? -1 : 1)
        };
      }
      stars = arr;
    }

    /* The loop belongs to assets/js/tick.js: this file contributes one
       subscriber and nothing else. dt arrives already clamped, so a
       backgrounded tab returning after a minute cannot teleport every star
       on the page. */
    function frame(dt) {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.phase += s.speed * dt;

        if (s.orbital) {
          s.a += s.spin * dt;
          s.x = s.cx + Math.cos(s.a) * s.rx;
          s.y = s.cy + Math.sin(s.a) * s.ry;
        } else {
          /* a whisper of drift — under a pixel a second, so it reads as
             parallax rather than as movement */
          s.y -= s.speed * 0.16 * dt;
          if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        }

        /* The twinkle: a sine at 0.6 × the star's own rate, so every star
           takes between roughly 19 and 42 seconds to breathe once and no
           two of them are in step — the sky is a field, not a strobe. */
        var tw = 0.5 + 0.5 * Math.sin(s.phase * 0.6);
        var alpha = 0.10 + tw * 0.42;
        var rad = s.r * (0.75 + tw * 0.45);

        ctx.beginPath();
        ctx.arc(s.x, s.y, rad, 0, TAU);
        ctx.fillStyle = 'rgba(' + s.colour + ',' + alpha.toFixed(3) + ')';
        ctx.fill();

        /* the brighter ones get a halo, which is what sells depth */
        if (s.r > 1.05 && tw > 0.72) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, rad * 3.2, 0, TAU);
          ctx.fillStyle = 'rgba(' + s.colour + ',' + (alpha * 0.07).toFixed(3) + ')';
          ctx.fill();
        }
      }
    }

    function start() { if (running) return; running = true; if (window.Tick) Tick.subscribe(frame); }
    function stop() { if (!running) return; running = false; if (window.Tick) Tick.unsubscribe(frame); }

    resize();
    start();

    var rt;
    window.addEventListener('resize', function () {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 180);     // debounce: resizing seeds a new field
    }, { passive: true });

    /* and if the OS starts asking for calm while the page is open */
    if (window.Motion) {
      Motion.onChange(function (still) { if (still) { stop(); canvas.remove(); } });
    }
  };
})();
