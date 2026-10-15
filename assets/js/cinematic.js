/* ============================================================
   assets/js/cinematic.js — Interactive Sound Engine
   Synthesises subtle, gentle, always-on interactive sound
   design natively across the entire site via Web Audio API.
   Zero floating modals, zero intrusive toggle buttons.
   Supports full accessibility and honours prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

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
      var target = e.target.closest('.btn, .world-switch-link, .primary-nav a, .lang-btn, .tag, .card, .record, .stat');
      if (!target) return;
      var now = Date.now();
      if (now - lastSoundTime < 80) return;
      lastSoundTime = now;

      if (target.classList.contains('lang-btn')) {
        playMicroTone(659.25, 'sine', 0.08, 0.012);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSoundInteractions);
  } else {
    setupSoundInteractions();
  }
})();
