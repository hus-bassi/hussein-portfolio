/* ============================================================
   PORTAL.JS — Gateway interactions (progressive enhancement)
   ------------------------------------------------------------
   Adds three things to the portal cards, all optional:

     1) Entrance hand-off — once a card's CSS entrance animation
        ends, add `.is-entered` so interactive transforms (hover
        lift / tilt) take over. A finished `forwards` animation
        would otherwise out-rank the :hover transform.

     2) Pointer spotlight — track the cursor and expose --mx/--my
        so the card's radial "spotlight" follows it.

     3) Subtle 3D tilt — expose --rx/--ry from the cursor offset.

   Guards: prefers-reduced-motion → no motion (cards just made
   visible). Tilt / spotlight tracking only on hover-capable,
   fine-pointer devices, so touch never jitters. Framework-free.
   The markup, links and text are never touched.
   ============================================================ */
(function () {
  'use strict';

  var cards = document.querySelectorAll('.portal-card');
  if (!cards.length) return;

  var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = !!(mqReduce && mqReduce.matches);

  // 1) Entrance hand-off (or immediate visibility under reduced motion).
  cards.forEach(function (card) {
    if (reduce) { card.classList.add('is-entered'); return; }
    var enter = function () { card.classList.add('is-entered'); };
    card.addEventListener('animationend', enter, { once: true });
    // Safety net if animationend never fires (e.g. tab was backgrounded).
    setTimeout(enter, 2400);
  });

  if (reduce) return;

  // 2 + 3) Spotlight + tilt — pointer-fine, hover-capable devices only.
  var mqFine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mqFine || !mqFine.matches) return;

  cards.forEach(function (card) {
    var frame = null;
    var px = 0.5, py = 0.5;

    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((py - 0.5) * -7).toFixed(2) + 'deg');
      });
    });

    card.addEventListener('pointerleave', function () {
      if (frame) { cancelAnimationFrame(frame); frame = null; }
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
})();
