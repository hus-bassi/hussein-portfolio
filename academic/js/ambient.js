/* ============================================================
   AMBIENT.JS  —  Site-wide living atmosphere (§ shooting stars)
   ------------------------------------------------------------
   Two layers, both purely decorative and framework-free:

     1) A GLOBAL "sky" layer — real animated shooting stars
        (meteors) streak across every page, always present. The
        flavour (direction, colour, frequency) is chosen per-page
        from the URL, so each page feels distinct. In Day mode the
        same streaks become warm golden glints (recoloured in CSS).

     2) PER-SECTION motif fields — each section gets its own quiet,
        themed animated glyphs (math symbols, geometric shapes,
        code, data dots, stars) picked from the section's meaning,
        so every "box" has something distinctive of its own. Fields
        only animate while on screen (IntersectionObserver), sit
        BEHIND the content, and never touch the markup's meaning.

   PERFORMANCE & ACCESSIBILITY (§ hard constraints):
     • CSS / vanilla JS only — no canvas heavy loops, no WebGL.
     • Meteors are capped and paused when the tab is hidden.
     • Motif glyphs are paused unless their section is visible.
     • prefers-reduced-motion: reduce  →  the whole module is a
       no-op. The site renders exactly as it did before, untouched.

   All nodes are aria-hidden and pointer-events:none — assistive
   tech and clicks pass straight through. No data is changed.
   ============================================================ */
(function () {
  'use strict';

  // --- Respect reduced motion: do nothing at all. ------------
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) return;

  // --- Run once. ---------------------------------------------
  if (window.__ambientReady) return;
  window.__ambientReady = true;

  // --- Tiny helpers ------------------------------------------
  function rnd(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  /* ==========================================================
     LAYER 1 — GLOBAL SHOOTING STARS
     ========================================================== */

  // Six "scenes" — each page deterministically gets one, so the
  // meteor mood (angle + colour + cadence) differs page to page.
  // hue index maps to a colour defined in main.css (.sky-layer[data-hue]).
  var SCENES = [
    { angle: 118, hue: 0, gapMin: 3200, gapMax: 6400, maxLive: 2 }, // cool blue-white, down-left
    { angle: 62,  hue: 1, gapMin: 3600, gapMax: 7200, maxLive: 2 }, // warm gold, down-right
    { angle: 132, hue: 2, gapMin: 3000, gapMax: 5800, maxLive: 2 }, // violet, steeper down-left
    { angle: 48,  hue: 3, gapMin: 4000, gapMax: 7600, maxLive: 2 }, // teal, shallow down-right
    { angle: 125, hue: 4, gapMin: 3400, gapMax: 6600, maxLive: 2 }, // rose, down-left
    { angle: 70,  hue: 5, gapMin: 2600, gapMax: 5200, maxLive: 3 }  // icy, denser, down-right
  ];

  var sceneKey = (document.body && document.body.dataset.sky) || location.pathname || 'default';
  var scene = SCENES[hash(sceneKey) % SCENES.length];

  var sky = null;
  var live = 0;          // meteors currently on screen
  var timer = null;      // next-spawn timer

  function buildSky() {
    sky = document.createElement('div');
    sky.className = 'sky-layer';
    sky.setAttribute('aria-hidden', 'true');
    sky.setAttribute('data-hue', String(scene.hue));
    document.body.appendChild(sky);
  }

  function spawnMeteor() {
    if (!sky) return;
    var m = document.createElement('span');
    m.className = 'meteor';

    // Travel a good fraction of the viewport, along the scene angle
    // (with a little per-meteor jitter so no two are identical).
    var angle = scene.angle + rnd(-8, 8);
    var rad = angle * Math.PI / 180;
    var dist = rnd(0.65, 1.15) * (window.innerWidth + window.innerHeight) / 2;
    var dx = Math.cos(rad) * dist;
    var dy = Math.sin(rad) * dist;

    // Start in the upper band, anywhere across the width.
    m.style.left = rnd(-6, 96) + '%';
    m.style.top = rnd(-12, 42) + '%';
    m.style.setProperty('--dx', dx.toFixed(1) + 'px');
    m.style.setProperty('--dy', dy.toFixed(1) + 'px');
    m.style.setProperty('--angle', angle.toFixed(1) + 'deg');
    m.style.setProperty('--len', rnd(120, 280).toFixed(0) + 'px');
    m.style.setProperty('--dur', rnd(0.85, 1.7).toFixed(2) + 's');

    live++;
    var done = function () { live = Math.max(0, live - 1); if (m.parentNode) m.parentNode.removeChild(m); };
    m.addEventListener('animationend', done);
    // Safety net in case animationend never fires (e.g. background tab).
    setTimeout(done, 2600);
    sky.appendChild(m);
  }

  function scheduleNext() {
    var gap = rnd(scene.gapMin, scene.gapMax);
    timer = setTimeout(function () {
      if (!document.hidden && live < scene.maxLive) spawnMeteor();
      scheduleNext();
    }, gap);
  }

  // Pause the whole spawner while the tab is hidden (saves work,
  // avoids a "burst" of queued meteors on return).
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (timer) { clearTimeout(timer); timer = null; } }
    else if (!timer) { scheduleNext(); }
  });

  /* ==========================================================
     LAYER 2 — PER-SECTION MOTIF FIELDS
     ========================================================== */

  // Glyph sets per motif. Kept short so each field reads as one
  // coherent idea rather than visual noise.
  var MOTIFS = {
    astro:    ['✦', '✧', '⋆', '✺', '⭑', '·'],       // ✦ ✧ ⋆ ✺ ⭑ ·
    math:     ['∑', '∫', 'π', '√', '∞', 'σ', 'θ', 'Δ', '≈'], // ∑ ∫ π √ ∞ σ θ Δ ≈
    code:     ['{ }', '< >', '//', '( )', '=>', '[ ]', ';'],
    data:     ['•', '◦', '∴', 'μ', 'σ', '±', '⋯'], // • ◦ ∴ μ σ ± ⋯
    geometry: ['△', '◇', '○', '⬡', '▽', '◻']         // △ ◇ ○ ⬡ ▽ ◻
  };

  // Choose a motif from a section's id/class — themed to meaning,
  // with a stable hash fallback so unknown sections still vary.
  function motifFor(el) {
    var s = (el.id + ' ' + (el.className || '')).toLowerCase();
    var volleyball = document.body && document.body.classList.contains('page-volleyball');
    if (volleyball) return 'geometry';
    if (/hero|header|journey|goal|vision|future|timeline|cta/.test(s)) return 'astro';
    if (/mission|focus|value|about|principle|story/.test(s)) return 'math';
    if (/project|build|repo/.test(s)) return 'code';
    if (/research|data|cert|learn/.test(s)) return 'data';
    if (/digital|social|contact|cv|footer|skill/.test(s)) return 'geometry';
    var keys = ['astro', 'math', 'code', 'data', 'geometry'];
    return keys[hash(s) % keys.length];
  }

  function buildField(host, motif) {
    if (host.classList.contains('ambient-host')) return;

    // Make the host a stacking context so the field can sit behind
    // the content (z-index:-1) without escaping behind the section's
    // own background. `isolation` does this without reordering the
    // section among its siblings; only add position if it's static.
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.isolation = 'isolate';
    host.classList.add('ambient-host');

    var field = document.createElement('div');
    field.className = 'ambient-field';
    field.setAttribute('aria-hidden', 'true');
    field.setAttribute('data-motif', motif);

    var glyphs = MOTIFS[motif];
    var count = window.innerWidth < 640 ? 4 : 6;
    for (var i = 0; i < count; i++) {
      var g = document.createElement('span');
      g.className = 'ambient-glyph';
      g.textContent = pick(glyphs);
      g.style.left = rnd(4, 92).toFixed(1) + '%';
      g.style.top = rnd(8, 86).toFixed(1) + '%';
      g.style.setProperty('--gs', rnd(0.85, 2.1).toFixed(2) + 'rem');   // size
      g.style.setProperty('--gd', rnd(0, 9).toFixed(2) + 's');          // delay
      g.style.setProperty('--gt', rnd(7, 16).toFixed(2) + 's');         // duration
      field.appendChild(g);
    }

    // Field is the first child and clips its own glyphs (overflow),
    // so the host's own overflow is never changed.
    host.insertBefore(field, host.firstChild);
    return field;
  }

  function initFields() {
    var hosts = [];
    var sections = document.querySelectorAll('main > section');
    for (var i = 0; i < sections.length; i++) hosts.push(sections[i]);
    var footer = document.querySelector('.site-footer');
    if (footer) hosts.push(footer);

    // Only animate a field while its section is near the viewport.
    var io = ('IntersectionObserver' in window)
      ? new IntersectionObserver(function (entries) {
          for (var j = 0; j < entries.length; j++) {
            entries[j].target.classList.toggle('is-active', entries[j].isIntersecting);
          }
        }, { rootMargin: '100px' })
      : null;

    hosts.forEach(function (h) {
      // Skip anything that is already a rich cosmic scene of its own.
      if (h.querySelector('.hero-starfield, .portal-starfield')) return;
      var field = buildField(h, motifFor(h));
      if (!field) return;
      if (io) io.observe(field);
      else field.classList.add('is-active'); // no IO → just run
    });
  }

  /* ==========================================================
     BOOT
     ========================================================== */
  function init() {
    // The Volleyball side ("page-volleyball") is its own premium sports
    // universe — NO sky / shooting stars here. Sections still get the
    // quiet "geometry" motif only (no astro glyphs), so the page stays
    // a distinct court-inspired space rather than a cosmic one.
    var volleyball = document.body && document.body.classList.contains('page-volleyball');
    if (!volleyball) { buildSky(); scheduleNext(); }
    initFields();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
