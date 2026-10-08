/* ============================================================
   THE GATEWAY — portal.js, the choice engine for portal.html ONLY.

   One module owns the gateway's response to the visitor. It publishes
   three custom properties onto the <section class="gateway"> and the
   stylesheet consumes them — the split pointer.js uses:

      --ath      0…1   how far the VOLLEYBALL door is lit (physical left)
      --aca      0…1   how far the ACADEMIC door is lit   (physical right)
      --lean-px  px    the lean of the gate as a physical shift

   THE INPUTS (last action wins):
      · pointer X over the gateway — fine pointers, motion allowed. The X
        is PHYSICAL: 0 = far left, 1 = far right, so the two doors hold
        their sides in every language. The gate leans and the world under
        the pointer lights through its doorway.
      · focus on a doorway — keyboard: the doors are real links to the
        two world pages. Focusing one leans the portal toward that world;
        blurring to nothing returns it to the centre.
      · a doorway press — click, touch or Enter: this file only plays the
        surge; ui.js's transition owns the actual departure. It never
        calls location.href and never prevents navigation.

   THE CHARACTER SLOT is a contract, not a placeholder. The gateway
   markup carries an empty [data-portal-character] stage inside the gate,
   and this module paints transparent character layers into it the moment
   an asset is configured below — base / volleyball / academic states,
   one <img> per state, crossfaded by CSS on .gateway-character[data-state].
   Until an asset exists the slot renders its CSS aura (portal.css), which
   is designed to stand alone: a deliberate presence in the gate, never
   the words "image here".

   Reduced motion / reduced fidelity (the SAME media query CSS reads,
   via motion.js): the first pointer, focus or press sets a neutral
   stance — both worlds present at .45, gate centred — and the gateway
   stops reacting after that. Under motion allowed, a full press parks
   the stance in that world: the choice is felt one last time and holds
   through the navigation.
   ============================================================ */
(function () {
  'use strict';

  var Portal = window.Portal = window.Portal || {};
  var gate = document.querySelector('.gateway');
  if (!gate) return;                      /* the gateway page only, by design */

  /* ----------------------------------------------------------
     CHARACTER ASSETS — fill these in when the art exists.
     Leave an entry '' and the slot keeps its CSS aura for that
     state (see the header): the page is complete either way.
     e.g.  base: 'assets/images/character/hussein-base.webp'
     ---------------------------------------------------------- */
  var CHARACTER = {
    base: '',
    volleyball: '',
    academic: ''
  };

  var slot = gate.querySelector('[data-portal-character]');
  var built = false, images = null;

  function buildCharacter() {
    if (!slot || built) return;
    built = true;
    images = {};
    ['base', 'volleyball', 'academic'].forEach(function (state) {
      var src = CHARACTER[state];
      if (!src) return;
      var img = document.createElement('img');
      img.className = 'hero-character-img';
      img.setAttribute('data-state', state);
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      img.setAttribute('draggable', 'false');
      slot.appendChild(img);
      images[state] = img;
    });
    /* Nothing configured yet: `built` still flips true so an empty slot
       does not retry — and the CSS aura remains the rendered state. */
  }

  function setState(state) {
    if (slot && slot.getAttribute('data-state') !== state) {
      slot.setAttribute('data-state', state);
    }
    if (images) {
      Object.keys(images).forEach(function (k) {
        if (images[k]) images[k].draggable = k === state;
      });
    }
  }

  /* Exposed so the stance can be set from elsewhere without reaching
     into the pointer machinery. */
  Portal.setCharacter = function (state) {
    if (['base', 'volleyball', 'academic'].indexOf(state) === -1) return;
    buildCharacter();
    setState(state);
  };

  var fine = Motion.isFinePointer();
  var still = Motion.isStill();
  var active = false;

  function write(ath, aca, state) {
    gate.style.setProperty('--ath', ath.toFixed(3));
    gate.style.setProperty('--aca', aca.toFixed(3));
    /* THE LEAN: toward whichever world is lit — up to 18px, zero at the
       neutral bridge. The gate and the figure both read it (portal.css),
       so the mouth and whoever stands in it move as one object. */
    gate.style.setProperty('--lean-px', ((aca - ath) * 18).toFixed(1) + 'px');
    setState(state);
  }

  /* Neutral stance — both doors present, gate centred. Used for the
     reduced-motion handshake and as the resting state. */
  var NEUTRAL = [0.45, 0.45, 'base'];
  /* Which world a stance parks in, keyed by the doorway's data-portal-path */
  var STANCE = { volley: [0.9, 0, 'volleyball'], academic: [0, 0.9, 'academic'] };

  function stanceFor(which) { return STANCE[which] || NEUTRAL; }

  /* ---------- the press: surge, stance, and (motion allowed) park ---------- */
  function surge(which) {
    buildCharacter();
    if (still) { write(NEUTRAL[0], NEUTRAL[1], NEUTRAL[2]); return; }

    var s = stanceFor(which);
    gate.classList.add('is-opening');
    write(s[0], s[1], s[2]);

    /* park the stance in this world — the last beat before the page goes */
    window.setTimeout(function () {
      gate.classList.remove('is-opening');
      if (active) write(s[0], s[1], s[2]);
    }, 420);
  }

  /* ---------- pointer: the X axis, physical ---------- */
  function onPointer(e) {
    if (!fine || still) return;
    var r = gate.getBoundingClientRect();
    if (!r.width) return;
    var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    buildCharacter();
    active = true;
    if (x < 0.5) write(1 - x * 2, 0, 'volleyball');
    else if (x > 0.5) write(0, (x - 0.5) * 2, 'academic');
    else write(0, 0, 'base');   /* dead centre: the neutral bridge */
  }

  function leave() {
    if (still) { write(NEUTRAL[0], NEUTRAL[1], NEUTRAL[2]); active = false; return; }
    write(0, 0, 'base');
    active = false;
  }

  if (fine && !still) {
    gate.addEventListener('pointermove', onPointer, { passive: true });
    gate.addEventListener('pointerleave', leave, { passive: true });
  }

  /* ---------- keyboard: the doorway entries are real links ---------- */
  var doors = gate.querySelectorAll('[data-portal-path]');
  Array.prototype.forEach.call(doors, function (door) {
    door.addEventListener('focus', function () {
      var s = stanceFor(door.getAttribute('data-portal-path'));
      buildCharacter();
      active = true;
      write(s[0], s[1], s[2]);
    });
    door.addEventListener('blur', function () {
      if (still) { write(NEUTRAL[0], NEUTRAL[1], NEUTRAL[2]); active = false; return; }
      write(0, 0, 'base');
      active = false;
    });
    /* click, touch or Enter: ui.js owns the departure — the surge is
       purely decorative and never calls or blocks anything. */
    door.addEventListener('click', function () {
      surge(door.getAttribute('data-portal-path'));
    });
  });

  /* ---------- handshake with CSS: same media query, live answer ----------
     Motion.onChange hands over the boolean answer itself (motion.js
     `notify(still)`), not an object — the fidelity half is re-read. */
  Motion.onChange(function (stillNow) {
    still = stillNow;
    fine = Motion.isFinePointer();
    if (still) {
      write(NEUTRAL[0], NEUTRAL[1], NEUTRAL[2]);
      active = false;
      gate.classList.remove('is-opening');
    } else if (!fine) {
      leave();
    }
  });

  /* The slot is an empty stage until an asset exists — buildCharacter is
     idempotent, and setState only writes when the value changes, so the
     focus/press paths above can call it freely. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildCharacter, { once: true });
  } else {
    buildCharacter();
  }
})();
