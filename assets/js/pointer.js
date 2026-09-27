/* ============================================================
   THE POINTER — one module owns every response to the pointer.

   It publishes, and the CSS consumes. That is the whole design: this file
   writes a handful of custom properties onto <html> and onto the single
   surface under the pointer, and the stylesheet does the rest. No element
   gets its own transform written from JavaScript, so there is exactly one
   place to look when something moves wrong.

   What it publishes
   -----------------
      --mag-x/--mag-y  a small pull toward the pointer, for [data-magnetic]

   What it deliberately does NOT do
   --------------------------------
   It does not look inside surfaces. There is no per-card position, no
   spotlight that follows the pointer across a card, and no tilt: a surface
   reacts to `:hover` in CSS and needs nothing from here. That is not only
   the cleaner architecture, it is also the fast one — tracking the pointer
   inside a card meant a `getBoundingClientRect()` plus two style writes on
   every pointer frame for a visual that was, in the end, a pale patch
   moving across the card. Nothing on this page reads a layout box on the
   pointer path any more; the only per-frame writes are the two transforms
   on the elements this module owns, and the one magnetic pair.

   What it draws
   -------------
     · a soft light that trails the pointer with easing
     · a small dot that tracks it exactly
     · a ring that grows and warms over anything interactive

   The REAL cursor is never hidden. This is light cast on the page, not a
   replacement for the thing people click with.

   Cost control: one pointermove and one pointerover listener, both passive,
   both on the document. Nothing on the pointer path reads a layout box
   except a magnetic element's own, and only when the page has scrolled
   since. No custom property is published at all: the light, the ring and
   the dot are positioned by their own transforms, so the pointer path does
   arithmetic and nothing else.

   Absent entirely under still mode and on touch or coarse pointers.
   ============================================================ */
(function () {
  'use strict';

  var Pointer = window.Pointer = window.Pointer || {};

  /* what a surface can ask of this module. Buttons and controls: that is
     the whole list. Panes are not on it, because a pane's hover is CSS and
     an `is-lit` class on a card bought nothing but a style recalculation on
     every card the pointer crossed. */
  var LIT = '.btn, .record-action, .to-top';
  /* things that lean toward the pointer */
  var MAGNET = '[data-magnetic]';
  /* what counts as interactive for the ring */
  var HOT = 'a, button, .card, .record, .stage, .stat, .social, .lang-btn, .tag, .search, .to-top, .sec-more';

  function isStill() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  Pointer.mount = function (host) {
    if (Pointer.mounted) return;
    if (isStill()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    Pointer.mounted = true;

    var light = document.createElement('div');
    light.className = 'cursor-light';
    light.setAttribute('aria-hidden', 'true');

    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    host.appendChild(light);
    host.appendChild(ring);
    host.appendChild(dot);

    /* target position; the drawn positions lag behind it. The lag IS the
       trail — the light is heavier than the ring, which is heavier than the
       dot, and that difference is what makes it read as light rather than
       as a second cursor. */
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var lx = tx, ly = ty;
    var rx = tx, ry = ty;
    var visible = false;

    /* the magnetic element under the pointer, and its cached box */
    var mag = null, magRect = null, magScroll = -1;
    var lit = null;

    function paintMagnet() {
      if (!mag) return;
      var sy = window.pageYOffset || 0;
      if (sy !== magScroll) { magRect = mag.getBoundingClientRect(); magScroll = sy; }
      if (!magRect || !magRect.width) return;
      var cx = magRect.left + magRect.width / 2;
      var cy = magRect.top + magRect.height / 2;
      /* Three pixels across, two down. It was four, which is still inside
         the "maximum" but is not "extremely subtle" — and a pull nobody can
         feel is not worth a style write on every pointer frame. */
      var dx = Math.max(-1, Math.min(1, (tx - cx) / (magRect.width / 2))) * 3;
      var dy = Math.max(-1, Math.min(1, (ty - cy) / (magRect.height / 2))) * 2;
      mag.style.setProperty('--mag-x', dx.toFixed(2) + 'px');
      mag.style.setProperty('--mag-y', dy.toFixed(2) + 'px');
    }

    function clearLit() {
      if (lit) lit.classList.remove('is-lit');
      lit = null;
    }

    function clearMagnet() {
      if (!mag) return;
      mag.style.removeProperty('--mag-x');
      mag.style.removeProperty('--mag-y');
      mag = null;
      magRect = null;
      magScroll = -1;
    }

    function show(state) {
      visible = state;
      light.classList.toggle('is-on', state);
      ring.classList.toggle('is-on', state);
      dot.classList.toggle('is-on', state);
      if (state) return;
      clearLit();
      clearMagnet();
      ring.classList.remove('is-hot');
      ring.classList.remove('is-down');
      light.classList.remove('is-bright');
    }

    /* ---- the listeners ---- */

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        /* first appearance: start under the pointer, never swoop in from
           wherever the light happened to be resting */
        lx = rx = tx;
        ly = ry = ty;
        show(true);
      }

      var nextMag = e.target && e.target.nodeType === 1 ? e.target.closest(MAGNET) : null;
      if (nextMag !== mag) { clearMagnet(); mag = nextMag; paintMagnet(); }
    }

    /* ONE listener decides what the pointer is over. Attaching a handler per
       card would be O(n) in the number of cards and could drift out of sync
       with the markup however many a page renders; this is O(1) and cannot. */
    function onOver(e) {
      var t = e.target;
      if (!t || t.nodeType !== 1) return;

      var hot = t.closest(HOT);
      ring.classList.toggle('is-hot', !!hot);
      light.classList.toggle('is-bright', !!hot);

      /* only controls answer this, and only by lighting their own aura —
         there is nothing for a card to do with it */
      var next = t.closest(LIT);
      if (next === lit) return;
      clearLit();
      if (next) { next.classList.add('is-lit'); lit = next; }
    }

    function onLeave() { show(false); }

    /* ---- the frame ----
       Easing is expressed per second, not per frame, so the trail feels the
       same at 60 Hz and at 120 Hz. `1 - (1 - k)^(dt·60)` is the same curve
       sampled at a different rate.

       Three weights, and the order is the design: the dot is not eased at
       all (it is the cursor, and a cursor must never lag), the ring closes
       about 90% of the gap in ~170ms, and the light takes ~400ms because a
       380px glow is heavy and heavy things should trail. */
    function tick(dt) {
      var k = 1 - Math.pow(1 - 0.09, dt * 60);
      var kRing = Math.min(1, k * 2.2);
      lx += (tx - lx) * k;
      ly += (ty - ly) * k;
      rx += (tx - rx) * kRing;
      ry += (ty - ry) * kRing;

      light.style.transform = 'translate3d(' + (lx - 130).toFixed(1) + 'px,' + (ly - 130).toFixed(1) + 'px,0)';
      ring.style.transform = 'translate3d(' + (rx - 17).toFixed(1) + 'px,' + (ry - 17).toFixed(1) + 'px,0)';
      dot.style.transform = 'translate3d(' + (tx - 3).toFixed(1) + 'px,' + (ty - 3).toFixed(1) + 'px,0)';
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', function () { ring.classList.add('is-down'); }, { passive: true });
    window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('resize', function () { magRect = null; }, { passive: true });

    if (window.Tick) Tick.subscribe(tick);

    /* If the operating system starts asking for calm while the page is
       open, the light leaves the document rather than freezing on screen —
       there is no still version of a moving light. The guard is released so
       a visitor who switches motion back on gets it again without a
       reload (assets/js/ui.js re-runs the mount on the same signal). */
    if (window.Motion) {
      Motion.onChange(function (still) {
        if (!still) return;
        if (window.Tick) Tick.unsubscribe(tick);
        clearLit();
        clearMagnet();
        light.remove();
        ring.remove();
        dot.remove();
        Pointer.mounted = false;
      });
    }
  };
})();
