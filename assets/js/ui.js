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

  /* ---------- 3. keyword marquee (needs I18N for the words) ---------- */
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
