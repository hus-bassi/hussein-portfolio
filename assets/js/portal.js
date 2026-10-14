/* ============================================================
   THE GATEWAY — portal.js, the choice engine for the Portal.
   Used on portal.html and index.html (root gateway).
   ============================================================
   Publishes three custom properties onto <section class="gateway">:
      --ath      0…1   how far the VOLLEYBALL door is lit (physical left)
      --aca      0…1   how far the ACADEMIC door is lit   (physical right)
      --lean-px  px    the lean of the gate as a physical shift

   BEHAVIOURS:
      · Pointer X over gateway (with sensible center dead zone).
      · Focus on doorways (keyboard navigation).
      · Doorway activation / departure.
      · Sound design toggle (Web Audio API, off by default).
      · Character slot integration ([data-portal-character]).
      · Full prefers-reduced-motion compliance.
   ============================================================ */
(function () {
  'use strict';

  var Portal = window.Portal = window.Portal || {};
  var gate = document.querySelector('.gateway');
  if (!gate) return;

  /* ----------------------------------------------------------
     CHARACTER ASSETS — fill these in when the art exists.
     Leave an entry '' and the slot keeps its CSS celestial aura.
     e.g. base: 'assets/images/character/hussein-base.webp'
     ---------------------------------------------------------- */
  var CHARACTER = {
    base: '',
    volleyball: '',
    academic: ''
  };

  var slot = gate.querySelector('[data-portal-character]');
  var built = false;
  var images = null;

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
  }

  function setState(state) {
    if (slot && slot.getAttribute('data-state') !== state) {
      slot.setAttribute('data-state', state);
    }
  }

  Portal.setCharacter = function (state) {
    if (['base', 'volleyball', 'academic'].indexOf(state) === -1) return;
    buildCharacter();
    setState(state);
  };

  /* ----------------------------------------------------------
     MOTION & POINTER CAPABILITIES
     ---------------------------------------------------------- */
  var fine = window.Motion ? window.Motion.isFinePointer() : true;
  var still = window.Motion ? window.Motion.isStill() : false;
  var active = false;

  function write(ath, aca, state) {
    gate.style.setProperty('--ath', ath.toFixed(3));
    gate.style.setProperty('--aca', aca.toFixed(3));
    /* THE LEAN: up to 18px toward the lit world; 0 at neutral */
    gate.style.setProperty('--lean-px', ((aca - ath) * 18).toFixed(1) + 'px');
    setState(state);
  }

  /* Neutral stance: quiet, centered, mysterious */
  var NEUTRAL = [0, 0, 'base'];
  var STANCE = {
    volley: [0.95, 0, 'volleyball'],
    academic: [0, 0.95, 'academic']
  };

  function stanceFor(which) {
    return STANCE[which] || NEUTRAL;
  }

  /* ----------------------------------------------------------
     SOUND DESIGN — SUBTLE, GENTLE & ALWAYS ACTIVE
     Synthesises pleasant harmonic chimes via Web Audio API.
     Always enabled by default — zero manual button toggling.
     ---------------------------------------------------------- */
  var audioCtx = null;
  var soundEnabled = true;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      try {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      } catch (e) {
        audioCtx = null;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
  }

  function unlockAudio() {
    initAudio();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  }
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  function playChime(freq, type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      /* Gentle volume curve: soft entry, delicate fade out */
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      /* Audio failures fail silently */
    }
  }

  /* ----------------------------------------------------------
     INTERACTION: POINTER WITH CENTER DEAD ZONE
     ---------------------------------------------------------- */
  var lastSide = 'none';

  function onPointer(e) {
    if (!fine || still) return;
    var r = gate.getBoundingClientRect();
    if (!r.width) return;
    var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));

    buildCharacter();
    active = true;

    /* Center Dead Zone [0.44 to 0.56]: keeps neutral state stable */
    if (x < 0.44) {
      var ath = (0.44 - x) / 0.44;
      write(ath, 0, 'volleyball');
      if (lastSide !== 'volley' && ath > 0.4) {
        lastSide = 'volley';
        playChime(261.63, 'triangle'); /* Warm C4 for athletic side */
      }
    } else if (x > 0.56) {
      var aca = (x - 0.56) / 0.44;
      write(0, aca, 'academic');
      if (lastSide !== 'acad' && aca > 0.4) {
        lastSide = 'acad';
        playChime(392.00, 'sine'); /* G4 for academic side */
      }
    } else {
      /* Neutral center bridge */
      write(0, 0, 'base');
      lastSide = 'none';
    }
  }

  function leave() {
    if (still) {
      write(0.45, 0.45, 'base');
      active = false;
      return;
    }
    write(0, 0, 'base');
    active = false;
    lastSide = 'none';
  }

  if (fine && !still) {
    gate.addEventListener('pointermove', onPointer, { passive: true });
    gate.addEventListener('pointerleave', leave, { passive: true });
  }

  /* ----------------------------------------------------------
     KEYBOARD & DESTINATION LINKS
     ---------------------------------------------------------- */
  var doors = gate.querySelectorAll('[data-portal-path]');
  Array.prototype.forEach.call(doors, function (door) {
    var pathKey = door.getAttribute('data-portal-path');

    door.addEventListener('focus', function () {
      var s = stanceFor(pathKey);
      buildCharacter();
      active = true;
      write(s[0], s[1], s[2]);
      if (pathKey === 'volley') playChime(261.63, 'triangle');
      else if (pathKey === 'academic') playChime(392.00, 'sine');
    });

    door.addEventListener('blur', function () {
      if (still) {
        write(0.45, 0.45, 'base');
        active = false;
        return;
      }
      write(0, 0, 'base');
      active = false;
    });

    door.addEventListener('click', function () {
      buildCharacter();
      if (pathKey === 'volley') playChime(329.63, 'triangle');
      else if (pathKey === 'academic') playChime(523.25, 'sine');

      if (!still) {
        var s = stanceFor(pathKey);
        gate.classList.add('is-opening');
        write(s[0], s[1], s[2]);
        window.setTimeout(function () {
          gate.classList.remove('is-opening');
        }, 420);
      }
    });
  });

  /* ----------------------------------------------------------
     REDUCED MOTION SUPPORT
     ---------------------------------------------------------- */
  if (window.Motion) {
    window.Motion.onChange(function (stillNow) {
      still = stillNow;
      fine = window.Motion.isFinePointer();
      if (still) {
        write(0.45, 0.45, 'base');
        active = false;
        gate.classList.remove('is-opening');
      } else if (!fine) {
        leave();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildCharacter, { once: true });
  } else {
    buildCharacter();
  }
})();
