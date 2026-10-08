/* ============================================================
   THE PORTAL — the homepage's choice engine.

   One module owns the hero's response to the visitor. It publishes
   three custom properties onto the <section class="hero"> and the
   CSS consumes them — the same split pointer.js uses:

      --ath      0…1   how far the VOLLEYBALL world is lit
      --aca      0…1   how far the ACADEMIC world is lit
      --lean-px  px    the lean of the gate as a physical shift

   THE INPUTS (last action wins):
     · pointer X over the hero — fine pointers, motion allowed. The X is
       PHYSICAL: 0 = far left, 1 = far right, so the two worlds sit on
       their physical sides in every language (the brief's diagram is
       physical too). The gate leans and the world under the pointer
       brightens through the opening.
     · focus on a doorway — keyboard: the doorway entries below the gate
       are real links to the two world pages. Focusing one leans the
       portal toward that world; blurring to nothing returns it to the
       centre.
     · a doorway press — click, touch or Enter: hero.js only plays a
       decorative SURGE on the gate. The navigation is ui.js's page
       transition, one mechanism for every page on the site.

   SMOOTHING IS THE CSS'S JOB, NOT THIS FILE'S. Each event writes the
   target intensities; the stylesheet interpolates them on its own
   transition clock. There is no rAF loop and no easing math here.

   THE CHARACTER CONTRACT
   ----------------------
   Phase 2 will supply transparent images. Until then the URLs below are
   empty and the slot shows only its aura. When an asset is added here
   (or via Hero.setCharacter), the slot builds one <img> per state and
   crossfades them from a data-state attribute on the slot. The hero's
   structure does not change; nothing else has to be touched.
   ============================================================ */
(function () {
  'use strict';

  var Hero = window.Hero = window.Hero || {};
  var hero = document.querySelector('.hero');
  if (!hero) return;                       /* hero page only, by design */

  /* ---------- the character contract ----------
     One place to point at future assets. Empty strings mean "no asset
     yet" — the slot renders as an aura until then. */
  var CHARACTER = {
    base: '',        /* e.g. 'assets/images/character/hussein-base.webp'    */
    athlete: '',     /* e.g. 'assets/images/character/hussein-athlete.webp' */
    academic: ''     /* e.g. 'assets/images/character/hussein-academic.webp' */
  };

  var slot = hero.querySelector('[data-hero-character]');

  function isStill() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function isFine() {
    return window.Motion ? Motion.isFinePointer()
                         : window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  var fine = isFine();
  var inHero = false;       /* the pointer is inside the hero box */
  var rect = null, scrolled = -1;

  /*   --lean-px is the gate's physical lean. A positive value (the
       academic world under the pointer) shifts the gate right; a warm
       world shifts it left — the gate opens toward the choice. */
  function write(ath, aca, state) {
    hero.style.setProperty('--ath', ath.toFixed(3));
    hero.style.setProperty('--aca', aca.toFixed(3));
    hero.style.setProperty('--lean-px', ((aca - ath) * 30).toFixed(1) + 'px');
    if (slot) slot.setAttribute('data-state', state || 'base');
  }

  /* the resting state, before any input: both worlds faintly present */
  if (!isStill()) {
    write(0, 0, 'base');
  } else {
    write(0.45, 0.45, 'base');   /* reduce: a quiet, even two-sided presence */
  }

  /* ---------- the discrete inputs: the two doorway links ---------- */
  function stanceFor(side) {
    return side === 'volley'   ? [0.9, 0, 'athlete']
         : side === 'academic' ? [0, 0.9, 'academic']
         :                        [0, 0,  'base'];
  }

  /* keyboard stance: focusing a doorway leans the portal toward that
     world; blurring to nothing returns it to the centre */
  hero.addEventListener('focusin', function (e) {
    var door = e.target && e.target.closest ? e.target.closest('.portal-path') : null;
    if (!door || !hero.contains(door)) return;
    var t = stanceFor(door.getAttribute('data-portal-path'));
    write(t[0], t[1], t[2]);
  });
  hero.addEventListener('focusout', function (e) {
    var related = e.relatedTarget;
    if (related && related.closest && related.closest('.portal-path')) return;
    var t = stanceFor('');
    write(t[0], t[1], t[2]);
  });

  /* the departure surge — decorative, on the gate only. The navigation
     itself belongs to ui.js; this flares in the same beat, and never in
     calm mode. Writing the chosen stance here is what lights the world
     the visitor picked: the cores brighten through the same vars the
     pointer uses, one opacity knob each. */
  hero.addEventListener('click', function (e) {
    var door = e.target && e.target.closest ? e.target.closest('.portal-path') : null;
    if (!door || !hero.contains(door) || isStill()) return;
    var side = door.getAttribute('data-portal-path');
    var t = stanceFor(side);
    write(t[0], t[1], t[2]);
    hero.classList.add('is-opening');
    window.setTimeout(function () {
      hero.classList.remove('is-opening');
    }, 800);
  });

  /* ---------- the continuous input: pointer X over the hero ---------- */
  function measure() {
    var sy = window.pageYOffset || 0;
    if (sy === scrolled && rect) return rect;
    rect = hero.getBoundingClientRect();
    scrolled = sy;
    return rect;
  }
  window.addEventListener('resize', function () { rect = null; });

  hero.addEventListener('pointermove', function (e) {
    if (!fine || isStill() || !inHero) return;
    var r = measure();
    if (!r || !r.width) return;
    /* a soft ramp: dead at the centre, full lean at the edges — the
       worlds brighten the further the pointer commits */
    var x = (e.clientX - r.left) / r.width;
    var lean = (x - 0.5) / 0.34;
    if (lean < -1) lean = -1; else if (lean > 1) lean = 1;
    write(Math.max(0, -lean), Math.max(0, lean),
      lean < 0 ? 'athlete' : lean > 0 ? 'academic' : 'base');
  });

  hero.addEventListener('pointerenter', function () { inHero = true; });
  hero.addEventListener('pointerleave', function () {
    inHero = false;
    /* a free pointer that leaves returns the hero to the centre */
    var t = stanceFor('');
    write(t[0], t[1], t[2]);
  });

  /* the centre is reachable by keyboard through blurring a doorway, and
     by pointer through the dead zone — two doors, no mouse-only */

  /* ---------- follow the OS setting live ---------- */
  if (window.Motion) {
    Motion.onChange(function (still) {
      if (still) {
        /* calm mode: no pointer following. The two worlds hold a quiet,
           even presence so the scene still reads as two-sided without
           moving — and the doorways keep working (instant stance). */
        fine = false;
        write(0.45, 0.45, 'base');
        inHero = false;
      } else {
        fine = isFine();
        write(0, 0, 'base');
      }
    });
  }

  /* ---------- the character slot ----------
     Builds one layer per configured state; a missing URL simply stays an
     aura. The layers crossfade on data-state, which the stance above
     already maintains. */
  var STATES = [['base', 'base'], ['athlete', 'athlete'], ['academic', 'academic']];

  function buildCharacter() {
    if (!slot) return;
    for (var i = 0; i < STATES.length; i++) {
      var url = CHARACTER[STATES[i][0]];
      if (!url) continue;
      var img = document.createElement('img');
      img.className = 'hero-character-img';
      img.setAttribute('data-state', STATES[i][1]);
      img.src = url;
      img.alt = '';
      slot.appendChild(img);
    }
  }

  Hero.setCharacter = function (cfg) {
    for (var k in cfg) {
      if (Object.prototype.hasOwnProperty.call(cfg, k) && k in CHARACTER) {
        CHARACTER[k] = cfg[k];
      }
    }
    buildCharacter();
  };

  /* ---------- mount ---------- */
  buildCharacter();
})();