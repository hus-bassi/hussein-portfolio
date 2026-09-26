/* ============================================================
   Shared premium-layer helpers — loaded by every page BEFORE its
   own behaviour script (site.js / page.js / records.js).

   · UI.sectionIndex()  injects the ghost numeral (01, 02, …) behind
                        every visible section heading. Decorative only:
                        the span is aria-hidden, so screen readers and
                        the language switcher never see it.
   · UI.progress()      draws the 2px reading-progress rail at the top
                        of the viewport. It is a scroll STATE, not an
                        animation, so it costs nothing under
                        prefers-reduced-motion.
   · UI.marquee()       rebuilds the keyword strip in the current
                        language (two identical groups = seamless loop).

   No framework, no build step.
   ============================================================ */
(function () {
  'use strict';

  var UI = window.UI = window.UI || {};

  /* ---------- 0. atmosphere: the field and the pointer light ----------
     The single entry point for the two decorative canvas/DOM layers.
     Each is optional: a missing module, a reduced-motion setting or a
     touch device all mean "do nothing", never "break something". */
  UI.atmosphere = function () {
    try { if (window.Field) Field.mount(document.body); } catch (e) { /* decorative only */ }
    try { if (window.Cursor) Cursor.mount(document.body); } catch (e) { /* decorative only */ }
  };

  /* ---------- 1. ghost section numerals ---------- */
  UI.sectionIndex = function (scope) {
    var heads = (scope || document).querySelectorAll('.sec-head');
    heads.forEach(function (h, i) {
      if (h.querySelector('.sec-index')) return;
      var s = document.createElement('span');
      s.className = 'sec-index';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      h.insertBefore(s, h.firstChild);
    });
  };

  /* ---------- 2. reading progress rail ---------- */
  UI.progress = function () {
    var bar = document.querySelector('.read-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'read-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }

    var ticking = false;
    function update() {
      ticking = false;
      var d = document.documentElement;
      var max = (d.scrollHeight - d.clientHeight) || 1;
      var y = d.scrollTop || document.body.scrollTop || 0;
      var p = Math.min(1, Math.max(0, y / max));
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      bar.classList.toggle('is-full', p >= 0.999);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  };

  /* ---------- 3. hero parallax ----------
     The hero is the only place on the site where the visitor is looking
     while the page is still moving under them, which is what makes the
     opening feel cinematic rather than static: the name and the copy
     leave more slowly than the orbit figure, and the whole composition
     sinks and fades as the next section arrives.

     Three rules, and they matter:
       · it is written as ONE transform per element per frame, batched
         through a single rAF — never a layout read inside the loop;
       · it is completely inert under prefers-reduced-motion (this is the
         movement that rule exists to suppress);
       · it clamps at both ends, so a fast flick cannot fling the hero
         off-screen.                                            */
  UI.parallax = function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    /* Motion.isStill() already resolves three things: the visitor's own
       choice, the OS setting, and whether the full layer is wanted. This
       is the one place that decides, so nothing else has to re-ask. */
    if (window.Motion && Motion.isStill()) return;

    var layers = [
      { sel: '.hero-head',   depth: 26 },
      { sel: '.hero-copy',   depth: 54 },
      { sel: '.hero-visual', depth: 92 },
      { sel: '.hero-quote',  depth: 40 }
    ].map(function (l) {
      return { el: hero.querySelector(l.sel), depth: l.depth };
    }).filter(function (l) { return l.el; });

    if (!layers.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y > window.innerHeight * 1.15) return;   // off screen: let it rest

      layers.forEach(function (l) {
        var shift = y * (l.depth / 100);
        var fade = 1 - Math.min(1, y / (window.innerHeight * .85));
        l.el.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0)';
        l.el.style.opacity = fade.toFixed(3);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* If the visitor switches to still mode mid-visit, put the hero back
       exactly where it belongs, immediately. */
    if (window.Motion) {
      Motion.onChange(function (still) {
        if (!still) return;
        layers.forEach(function (l) { l.el.style.transform = ''; l.el.style.opacity = ''; });
      });
    }

    update();
  };

  /* ---------- 4. keyword marquee (needs I18N for the words) ---------- */
  UI.marquee = function (root) {
    var strip = root || document.getElementById('marquee');
    if (!strip) return;
    var track = strip.querySelector('.marquee-track');
    if (!track) return;

    var words = ((window.I18N && window.I18N.t('marquee.items')) || '')
      .split('|')
      .map(function (w) { return w.trim(); })
      .filter(Boolean);
    if (!words.length) { track.innerHTML = ''; return; }

    function group() {
      var g = document.createElement('div');
      g.className = 'marquee-group';
      words.forEach(function (w) {
        var s = document.createElement('span');
        s.className = 'marquee-item';
        s.textContent = w;
        g.appendChild(s);
      });
      return g;
    }

    track.innerHTML = '';
    track.appendChild(group());
    track.appendChild(group());   /* the duplicate makes the loop seamless */
  };
})();
