/* ============================================================
   The 20 Cinematic Animation Styles & Sound Engine
   assets/js/cinematic.js

   Drives native dynamic behaviors for the 20 animation styles
   and synthesises subtle, gentle, always-on interactive sound
   design natively across the entire site via Web Audio API.
   Zero floating modals, zero intrusive toggle buttons.
   Supports full accessibility and reduced motion.
   ============================================================ */
(function () {
  'use strict';

  // 1. Retro VHS Timecode Generator
  function updateVHSTimecode() {
    var vhsElements = document.querySelectorAll('.style-retro-vhs [data-vhs-time]');
    if (!vhsElements.length) return;
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var timeStr = 'REC ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    vhsElements.forEach(function (el) {
      el.textContent = timeStr;
    });
  }

  // 2. Split-Flap Interactive Flip on Hover
  function setupSplitFlapHover() {
    var digits = document.querySelectorAll('.split-flap-digit');
    digits.forEach(function (d) {
      d.addEventListener('mouseenter', function () {
        d.style.transform = 'rotateX(20deg)';
        setTimeout(function () { d.style.transform = ''; }, 250);
      });
    });
  }

  // 3. Subtle Parallax for Celestial Wireframe
  function setupWireframeParallax() {
    var cages = document.querySelectorAll('.wireframe-cage');
    if (!cages.length) return;
    window.addEventListener('pointermove', function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5) * 15;
      var cy = (e.clientY / window.innerHeight - 0.5) * 15;
      cages.forEach(function (c) {
        c.style.transform = 'translate(' + cx.toFixed(1) + 'px, ' + cy.toFixed(1) + 'px)';
      });
    }, { passive: true });
  }

  // 4. Subtle Cinematic Sound Engine (Always Active by Default)
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
      } catch (e) {
        audioCtx = null;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  function playMicroTone(freq, type, duration, maxVol) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq || 523.25, ctx.currentTime);
      var dur = duration || 0.12;
      var vol = maxVol || 0.018;

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    } catch (e) {}
  }

  function setupSoundInteractions() {
    var unlock = function () {
      getAudioContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });

    var lastSoundTime = 0;
    document.addEventListener('pointerover', function (e) {
      if (!e.target || typeof e.target.closest !== 'function') return;
      var target = e.target.closest('.btn, .world-switch-link, .primary-nav a, .lang-btn, .tag, .split-flap-digit, .card, .vw-panel');
      if (!target) return;
      var now = Date.now();
      if (now - lastSoundTime < 80) return;
      lastSoundTime = now;

      if (target.classList.contains('lang-btn')) {
        playMicroTone(659.25, 'sine', 0.08, 0.012);
      } else if (target.classList.contains('split-flap-digit')) {
        playMicroTone(440, 'triangle', 0.06, 0.015);
      } else if (target.classList.contains('tag')) {
        playMicroTone(587.33, 'sine', 0.08, 0.012);
      } else {
        playMicroTone(523.25, 'sine', 0.12, 0.016);
      }
    }, { passive: true });

    document.addEventListener('click', function (e) {
      if (!e.target || typeof e.target.closest !== 'function') return;
      var target = e.target.closest('.btn, .world-switch-link, .lang-btn, .tag, .primary-nav a');
      if (!target) return;
      playMicroTone(783.99, 'triangle', 0.1, 0.02);
    }, { passive: true });
  }

  // Lifecycle Initialization
  function initInPageStyles() {
    setupSplitFlapHover();
    setupWireframeParallax();
    setupSoundInteractions();
    updateVHSTimecode();
    setInterval(updateVHSTimecode, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInPageStyles);
  } else {
    initInPageStyles();
  }

  window.addEventListener('site-lang-change', function () {
    setTimeout(setupSplitFlapHover, 100);
  });
})();
