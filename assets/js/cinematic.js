/* ============================================================
   assets/js/cinematic.js — Tactile Audio & Interaction Engine
   Synthesises futuristic, tactile, luxury micro-interactions natively
   via Web Audio API across all pages:
     · Clicks: Buttons, links, cards, tags, controls (crisp mechanical micro-click)
     · Transitions: Page changes & exits (cinematic resonant sub-swoosh)
     · Arrival: Subtle settle tone when landing on a new page
     · Language Switch: Dual harmonic melodic chime
     · Modals & Expand: Smooth resonant sweeps
     · Hovers: Ultra-subtle micro-tick
   Zero external audio files (0 KB network overhead, instant response).
   Honours prefers-reduced-motion and requires no intrusive UI switches.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
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

  function isStill() {
    return window.Motion ? Motion.isStill()
                         : (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* 1. Snappy mechanical tactile micro-click (buttons, cards, links, tags) */
  function playClick() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'triangle';
      /* Fast pitch drop gives a satisfying mechanical snap */
      osc.frequency.setValueAtTime(1050, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.035);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {}
  }

  /* 2. Dual harmonic chime (language switch, modes) */
  function playChime() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var notes = [
        { f: 523.25, time: 0, dur: 0.14, vol: 0.05 },
        { f: 783.99, time: 0.045, dur: 0.16, vol: 0.065 }
      ];
      notes.forEach(function (note) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t + note.time);

        gain.gain.setValueAtTime(0.0001, t + note.time);
        gain.gain.linearRampToValueAtTime(note.vol, t + note.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + note.time);
        osc.stop(t + note.time + note.dur + 0.01);
      });
    } catch (e) {}
  }

  /* 3. Cinematic resonant sub-swoosh (page transitions & link exits) */
  function playTransition() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(200, t + 0.22);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {}
  }

  /* 4. Arrival settle tone (landing on a new page) */
  function playArrival() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.12);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } catch (e) {}
  }

  /* 5. Modal / Detail expand sweep */
  function playExpand() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.11);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch (e) {}
  }

  /* 6. Modal / Detail collapse snap */
  function playCollapse() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.09);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.11);
    } catch (e) {}
  }

  /* 7. Hover micro-tick */
  function playHover() {
    if (isStill()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1350, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.015, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.022);
    } catch (e) {}
  }

  function setupSoundInteractions() {
    /* Unlock audio context on first user interaction */
    var unlock = function () {
      getAudioContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });

    /* Hover listener with throttling */
    var lastHoverTime = 0;
    document.addEventListener('pointerover', function (e) {
      if (!e.target || typeof e.target.closest !== 'function') return;
      var target = e.target.closest('.btn, .lang-btn, .primary-nav a, .tag, .to-top, .world-switch-link');
      if (!target) return;
      var now = Date.now();
      if (now - lastHoverTime < 80) return;
      lastHoverTime = now;
      playHover();
    }, { passive: true });

    /* Universal click listener */
    document.addEventListener('click', function (e) {
      if (!e.target || typeof e.target.closest !== 'function') return;

      /* Language switcher */
      if (e.target.closest('.lang-btn, .lang-switch button')) {
        playChime();
        return;
      }

      /* Modals and close buttons */
      if (e.target.closest('.cert-close, .dialog-close, [data-close], [aria-label*="close" i], [aria-label*="إغلاق" i], [aria-label*="Закрыть" i]')) {
        playCollapse();
        return;
      }

      /* Page navigation transition */
      var a = e.target.closest('a[href]');
      if (a && a.origin === location.origin) {
        var href = a.getAttribute('href') || '';
        var isAnchor = href.charAt(0) === '#' || (href.indexOf('#') > -1 && a.pathname === location.pathname);
        if (!isAnchor && !a.hasAttribute('download') && a.target !== '_blank') {
          playTransition();
          return;
        }
      }

      /* Modal or detail card open */
      if (e.target.closest('.record-link, .record-card, .detail-gallery-open, [data-dialog], [aria-haspopup="dialog"]')) {
        playExpand();
        return;
      }

      /* Any interactive click */
      if (e.target.closest('button, .btn, a, .tag, .card, .record, .to-top, .nav-toggle, input, summary, [role="button"]')) {
        playClick();
      }
    }, { passive: true });

    /* Listen for language change event */
    document.addEventListener('site-lang-change', function () {
      playChime();
    });

    /* Check if this page was arrived at from another page via transition */
    if (root && root.hasAttribute('data-nav')) {
      setTimeout(playArrival, 60);
    }
  }

  window.Cinematic = {
    playClick: playClick,
    playChime: playChime,
    playTransition: playTransition,
    playArrival: playArrival,
    playExpand: playExpand,
    playCollapse: playCollapse,
    playHover: playHover
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSoundInteractions);
  } else {
    setupSoundInteractions();
  }
})();
