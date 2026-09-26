/* ============================================================
   THE CURSOR — a soft light that follows the pointer.

   This is NOT a cursor replacement. The real cursor stays exactly where
   it is and remains the thing that clicks; this is light cast on the
   page. That distinction matters for accessibility: hiding the native
   cursor breaks every affordance people rely on, and the site must never
   do that.

   Three parts, in one rAF, all transform-only:
     · a soft light that trails the pointer with easing
     · a small dot that tracks the pointer exactly
     · a state ring that grows and changes colour over links and buttons

   The state is driven by ONE pointerover listener on the document that
   asks what the element is, rather than attaching listeners to every
   card. That keeps it O(1) in the number of interactive elements.

   Disabled on: reduced-motion, touch pointers, and coarse pointers.
   ============================================================ */
(function () {
  'use strict';

  var Cursor = window.Cursor = window.Cursor || {};

  Cursor.mount = function (root) {
    if (window.Motion && Motion.isStill()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var light = document.createElement('div');
    light.className = 'cursor-light';
    light.setAttribute('aria-hidden', 'true');

    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    root.appendChild(light);
    root.appendChild(ring);
    root.appendChild(dot);

    /* the target position, and the eased position that actually draws */
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var lx = tx, ly = ty;          /* the light lags — that is the trail   */
    var rx = tx, ry = ty;          /* the ring lags, a little more         */
    var visible = false, raf = 0, running = false;

    function onMove(e) {
      tx = e.clientX; ty = e.clientY;
      if (!visible) {
        visible = true;
        light.classList.add('is-on');
        ring.classList.add('is-on');
        dot.classList.add('is-on');
        /* first appearance: start under the finger, no swoop in from centre */
        lx = rx = tx; ly = ry = ty;
      }
    }

    function onLeave() {
      visible = false;
      light.classList.remove('is-on');
      ring.classList.remove('is-on');
      dot.classList.remove('is-on');
    }

    /* ONE listener for the whole page: work out what the pointer is over,
       then set one class. Cheaper than a listener per card, and it cannot
       drift out of sync with the markup. */
    function onOver(e) {
      var t = e.target;
      if (!t || t.nodeType !== 1) return;
      var hot = t.closest('a, button, .card, .record, .stage, .stat, .social, .lang-btn, .tag, .search, .to-top');
      ring.classList.toggle('is-hot', !!hot);
      light.classList.toggle('is-bright', !!hot);
    }

    function frame() {
      raf = window.requestAnimationFrame(frame);
      /* frame-rate independent easing: the same feel at 60 and 120 Hz */
      lx += (tx - lx) * 0.11;
      ly += (ty - ly) * 0.11;
      rx += (tx - rx) * 0.19;
      ry += (ty - ry) * 0.19;
      light.style.transform = 'translate3d(' + (lx - 190).toFixed(1) + 'px,' + (ly - 190).toFixed(1) + 'px,0)';
      ring.style.transform = 'translate3d(' + (rx - 17).toFixed(1) + 'px,' + (ry - 17).toFixed(1) + 'px,0)';
      dot.style.transform = 'translate3d(' + (tx - 3).toFixed(1) + 'px,' + (ty - 3).toFixed(1) + 'px,0)';
    }

    function start() { if (running) return; running = true; raf = window.requestAnimationFrame(frame); }
    function stop() { if (!running) return; running = false; window.cancelAnimationFrame(raf); }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', function () { ring.classList.add('is-down'); }, { passive: true });
    window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); onLeave(); } else start();
    });

    start();

    if (window.Motion) {
      Motion.onChange(function (still) {
        if (still) { stop(); light.remove(); ring.remove(); dot.remove(); }
      });
    }
  };
})();
