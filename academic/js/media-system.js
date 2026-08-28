/* ============================================================
   JS/MEDIA-SYSTEM.JS  —  Universal Premium Media & Event System
   ------------------------------------------------------------
   The single, reusable engine behind every piece of rich media on
   the site. It is intentionally content-agnostic: it ships the
   SYSTEM, not the content. Nothing here invents data — it only
   renders whatever real data a page hands it, and stays completely
   inert on pages that have none.

   Three self-contained parts, all framework-free vanilla JS:

     1. MediaViewer   — one global fullscreen lightbox / gallery.
                        Same-page overlay (never a new tab), sits
                        ABOVE the cosmic background and any open
                        modal, with fade+scale in, click-to-zoom,
                        internal scroll for tall images, keyboard +
                        swipe navigation, a Prev/Next + counter
                        gallery, focus trap and scroll lock.
                        Used by the certificate viewer today; ready
                        for galleries, volunteering, volleyball, etc.

     2. CardInteractions — the universal, subtle "content feels
                        alive" pointer polish (cursor-follow light +
                        a tiny perspective tilt) shared by EVERY card
                        on the site. Desktop-pointer only, and fully
                        disabled under prefers-reduced-motion. The
                        rise / glow / border part is pure CSS in
                        main.css, so it works even without this file.

     3. EventSystem   — a reusable, data-driven renderer for the
                        unified Event / Activity model (see
                        data/events.js). One card template + one
                        detail modal that adapt to whatever fields an
                        event actually has (certificate, gallery,
                        video, people, links, …) and hide everything
                        it doesn't. Renders nothing until real events
                        exist — no page wires it up yet, so it is the
                        ready-for-future-data architecture, not fake
                        content.

   Everything is exposed on window.MediaViewer / window.EventSystem
   so any current or future page/script can use it. Load this file
   once per page (a single <script> tag) and it wires itself up on
   DOMContentLoaded.
   ============================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     SHARED HELPERS
  ---------------------------------------------------------- */

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  var POINTER_FINE = window.matchMedia('(hover: hover) and (pointer: fine)');

  /**
   * Escapes a value for safe insertion into HTML text or attributes.
   * The site's data is author-controlled, but the media/event system
   * is meant to survive arbitrary future content (titles with quotes,
   * captions with <, …) without breaking markup — so everything the
   * renderers inject goes through here.
   */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Reads the active language the same way js/certificates.js does
   * (saved choice → <html lang> → 'en'), so localized content in the
   * media/event system matches the rest of the trilingual site.
   */
  function activeLang() {
    try {
      var saved = localStorage.getItem('preferredLanguage');
      if (saved === 'ar' || saved === 'en' || saved === 'ru') return saved;
    } catch (e) { /* storage blocked — fall through */ }
    var htmlLang = document.documentElement.lang;
    if (htmlLang === 'ar' || htmlLang === 'en' || htmlLang === 'ru') return htmlLang;
    return 'en';
  }

  /**
   * Resolves a field that may be a plain string OR a { en, ar, ru }
   * object to a single string — the same multilingual contract the
   * certificate data already uses, reused for every event field.
   */
  function localize(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      var lang = activeLang();
      return value[lang] || value.en || Object.values(value)[0] || '';
    }
    return value == null ? '' : value;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  /**
   * Resolves a UI-label translation KEY for the active language, from
   * the `translations` table (data/translations.js). The media / event
   * system builds its own controls in JS, so — unlike the page's
   * data-i18n elements — language.js can't fill them; they resolve their
   * labels through here at build time and again on i18n:languagechange.
   * `translations` is a top-level `const` in a classic script, so it's a
   * bare global (NOT a property of window) shared with language.js — we
   * read it exactly as language.js does, guarded by typeof so a page
   * that never loaded it doesn't throw. Falls back to the active-language
   * value, then English, then the literal `fallback` (always passed in
   * English), so a control is never left blank or broken.
   */
  function t(key, fallback) {
    try {
      if (typeof translations !== 'undefined' && translations) {
        var lang = activeLang();
        if (translations[lang] && translations[lang][key] != null) return translations[lang][key];
        if (translations.en && translations.en[key] != null) return translations.en[key];
      }
    } catch (e) { /* fall through to the literal fallback */ }
    return fallback != null ? fallback : key;
  }

  /**
   * Tells the custom cursor (js/cursor.js) to relax its "hovering an
   * interactive control" state. Closing the viewer or a detail modal
   * hides the button that was under the pointer WITHOUT any mouseout /
   * mouseleave firing (the element is hidden, not exited by motion), so
   * the cursor ring would otherwise stay stuck in its enlarged /
   * highlighted state — looking as if the pointer were still over the
   * zoom / close control — until the next hover. cursor.js listens for
   * this event and clears the state. No-op when the custom cursor isn't
   * active (touch devices) or CustomEvent is unavailable.
   */
  function resetCursorState() {
    try {
      document.dispatchEvent(new CustomEvent('cursor:reset'));
    } catch (e) { /* CustomEvent unsupported — cursor self-corrects on next move */ }
  }

  /* =========================================================
     1. MEDIA VIEWER  —  fullscreen lightbox / gallery
     ========================================================= */

  var MediaViewer = (function () {
    var root = null;        // the overlay element
    var stage = null;       // scroll container that holds the image
    var imgEl = null;
    var placeholderEl = null;
    var captionEl = null;
    var counterEl = null;
    var prevBtn = null;
    var nextBtn = null;

    var items = [];         // [{ src, alt, caption }]
    var index = 0;
    var lastFocused = null;
    var prevBodyOverflow = '';

    // Zoom / swipe state. Zoom is a simple 1:1 toggle: the image grows
    // to its natural width and the stage scrolls to reach any part of
    // it — no manual pan. `pointerActive` + the down coords let us tell
    // a tap/click (toggle zoom) from a horizontal swipe (gallery nav).
    var isZoomed = false;
    var pointerActive = false;
    var downX = 0;
    var downY = 0;

    /**
     * Builds the viewer DOM once and appends it to <body>. Kept out
     * of the page HTML so a single <script> tag is all any page needs.
     */
    function ensureDom() {
      if (root) return;

      root = document.createElement('div');
      root.className = 'media-viewer';
      root.id = 'media-viewer';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Media viewer');
      root.setAttribute('aria-hidden', 'true');

      root.innerHTML = [
        '<div class="media-viewer-backdrop" data-mv-close></div>',
        '<div class="media-viewer-inner">',
        '  <button type="button" class="media-viewer-btn media-viewer-close" data-mv-close aria-label="Close viewer">&times;</button>',
        '  <button type="button" class="media-viewer-btn media-viewer-nav media-viewer-prev" data-mv-prev aria-label="Previous image">&#8249;</button>',
        '  <div class="media-viewer-stage" data-mv-stage>',
        '    <img class="media-viewer-img" alt="" draggable="false" />',
        '    <div class="media-viewer-placeholder" data-mv-placeholder hidden>Image not available.</div>',
        '  </div>',
        '  <button type="button" class="media-viewer-btn media-viewer-nav media-viewer-next" data-mv-next aria-label="Next image">&#8250;</button>',
        '  <div class="media-viewer-bar">',
        '    <p class="media-viewer-caption" data-mv-caption></p>',
        '    <p class="media-viewer-counter" data-mv-counter></p>',
        '  </div>',
        '</div>',
      ].join('');

      document.body.appendChild(root);

      stage = root.querySelector('[data-mv-stage]');
      imgEl = root.querySelector('.media-viewer-img');
      placeholderEl = root.querySelector('[data-mv-placeholder]');
      captionEl = root.querySelector('[data-mv-caption]');
      counterEl = root.querySelector('[data-mv-counter]');
      prevBtn = root.querySelector('[data-mv-prev]');
      nextBtn = root.querySelector('[data-mv-next]');

      // Close: the ✕ button and clicking the backdrop (outside the image).
      root.querySelectorAll('[data-mv-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      prevBtn.addEventListener('click', function () { go(-1); });
      nextBtn.addEventListener('click', function () { go(1); });

      // A broken/missing image shows a clean message instead of a
      // broken-image icon — same honest empty-state idea as the rest
      // of the site.
      imgEl.addEventListener('error', function () {
        imgEl.style.visibility = 'hidden';
        placeholderEl.hidden = false;
      });
      imgEl.addEventListener('load', function () {
        imgEl.style.visibility = 'visible';
        placeholderEl.hidden = true;
      });

      // A tap/click toggles zoom; a clear horizontal swipe navigates a
      // gallery. Vertical drags fall through to the stage's own native
      // scroll — that's how a taller-than-viewport certificate is
      // explored (§10/§16), so we don't intercept pointermove/wheel.
      stage.addEventListener('pointerdown', onPointerDown);
      stage.addEventListener('pointerup', onPointerUp);
      stage.addEventListener('pointercancel', onPointerUp);

      // Localize the controls the viewer builds in JS (the English text
      // in the markup above is the baseline / no-translations fallback),
      // and keep them in sync if the language is switched while a page
      // — or the viewer itself — is open.
      applyViewerLabels();
      document.addEventListener('i18n:languagechange', applyViewerLabels);

      // Keyboard is handled in the CAPTURE phase so the viewer, when
      // open on top of another modal (e.g. the certificate detail
      // modal), swallows Escape / arrows / Tab before that modal's own
      // document-level handlers can react to them.
      document.addEventListener('keydown', onKeydown, true);
    }

    /**
     * Writes the active-language labels onto the viewer's controls.
     * Called once after the DOM is built and again on every language
     * switch, so aria-labels + the empty-state text always match the
     * rest of the trilingual site.
     */
    function applyViewerLabels() {
      if (!root) return;
      root.setAttribute('aria-label', t('mvLabel', 'Media viewer'));
      var closeBtn = root.querySelector('.media-viewer-close');
      if (closeBtn) closeBtn.setAttribute('aria-label', t('mvClose', 'Close viewer'));
      if (prevBtn) prevBtn.setAttribute('aria-label', t('mvPrev', 'Previous image'));
      if (nextBtn) nextBtn.setAttribute('aria-label', t('mvNext', 'Next image'));
      if (placeholderEl) placeholderEl.textContent = t('mvUnavailable', 'Image not available.');
    }

    function isOpen() {
      return !!root && root.classList.contains('is-open');
    }

    /**
     * Opens the viewer.
     * @param {Array} list  array of { src, alt?, caption? } (or bare
     *                      src strings) — the gallery to show.
     * @param {number} start  index to open on (default 0).
     */
    function open(list, start) {
      ensureDom();
      items = normalize(list);
      if (!items.length) return;

      index = clamp(start || 0, 0, items.length - 1);
      lastFocused = document.activeElement;

      render();
      show();
    }

    function normalize(list) {
      if (!Array.isArray(list)) list = [list];
      return list
        .map(function (item) {
          if (typeof item === 'string') return { src: item, alt: '', caption: '' };
          if (!item || !item.src) return null;
          return {
            src: item.src,
            alt: item.alt != null ? localize(item.alt) : '',
            caption: item.caption != null ? localize(item.caption) : '',
          };
        })
        .filter(Boolean);
    }

    function show() {
      // Preserve whatever overflow was already set (an underlying modal
      // may have locked scrolling); restore exactly that on close so we
      // never accidentally unlock a still-open modal behind us.
      prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');

      // Focus the close button so keyboard users land inside the viewer.
      var closeBtn = root.querySelector('.media-viewer-close');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (!root) return;
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = prevBodyOverflow;
      resetView();

      // Reset pointer state so a stale swipe/zoom isn't carried into
      // the next open.
      pointerActive = false;
      downX = 0;
      downY = 0;

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
      lastFocused = null;
      resetCursorState();
    }

    /** Paints the current item and updates gallery chrome. */
    function render() {
      var item = items[index];
      if (!item) return;

      resetView();
      placeholderEl.hidden = true;
      imgEl.style.visibility = 'hidden';
      imgEl.alt = item.alt || item.caption || '';
      imgEl.src = item.src;

      captionEl.textContent = item.caption || '';
      captionEl.hidden = !item.caption;

      // Gallery chrome only appears when there's actually a gallery.
      var isGallery = items.length > 1;
      counterEl.textContent = isGallery ? (index + 1) + ' / ' + items.length : '';
      counterEl.hidden = !isGallery;
      prevBtn.hidden = !isGallery;
      nextBtn.hidden = !isGallery;
    }

    function go(delta) {
      if (items.length < 2) return;
      index = (index + delta + items.length) % items.length;
      render();
    }

    /* ---- zoom & swipe ---- */

    // Reset to the fit-to-width, top-aligned state. Called on open,
    // on navigate, and on close.
    function resetView() {
      isZoomed = false;
      if (stage) {
        stage.classList.remove('is-zoomed');
        stage.scrollTop = 0;
        stage.scrollLeft = 0;
      }
    }

    // Simple 1:1 zoom toggle (§16): zoomed in, the image is its natural
    // width and the stage scrolls to reach any part of it; zoomed out,
    // it fits the stage width. No scale math, no pan — the browser's own
    // scrolling does the work, which stays crisp and touch-friendly.
    function toggleZoom() {
      isZoomed = !isZoomed;
      stage.classList.toggle('is-zoomed', isZoomed);
      if (!isZoomed) { stage.scrollTop = 0; stage.scrollLeft = 0; }
    }

    function onPointerDown(e) {
      pointerActive = true;
      downX = e.clientX;
      downY = e.clientY;
    }

    function onPointerUp(e) {
      if (!pointerActive) return;
      pointerActive = false;

      var dx = e.clientX - downX;
      var dy = e.clientY - downY;
      var absX = Math.abs(dx);
      var absY = Math.abs(dy);

      // A clear, mostly-horizontal swipe navigates a gallery — but only
      // while fit-to-width, so a swipe on a zoomed image scrolls it
      // instead of jumping. A near-stationary release on the image
      // itself toggles zoom (tap / click).
      if (absX > 50 && absX > absY * 1.4 && items.length > 1 && !isZoomed) {
        go(dx < 0 ? 1 : -1);
        return;
      }
      if (absX < 8 && absY < 8 && e.target === imgEl) {
        toggleZoom();
      }
    }

    function onKeydown(e) {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        go(-1);
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        go(1);
      } else if (e.key === 'Tab') {
        // Trap focus among the viewer's visible controls.
        e.stopPropagation();
        var focusable = Array.prototype.filter.call(
          root.querySelectorAll('.media-viewer-btn'),
          function (btn) { return !btn.hidden; }
        );
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    return { open: open, close: close, isOpen: isOpen };
  })();

  window.MediaViewer = MediaViewer;

  /* =========================================================
     2. CARD INTERACTIONS  —  universal pointer polish
     ---------------------------------------------------------
     The shared rise / glow / border hover is pure CSS (main.css)
     and works on every page with no JS. This layer adds only the
     progressive-enhancement pointer feel — a cursor-following soft
     light and a very subtle perspective tilt — and ONLY on real
     pointer devices with motion allowed. Uses event delegation so
     it automatically covers cards rendered later (certificates,
     future events, …) with nothing to re-wire.
     ========================================================= */

  var CARD_SELECTOR = '.cert-card, .skill-card, .focus-item, .u-card, .event-card';
  var MAX_TILT = 2.4; // degrees — deliberately tiny ("alive", not a spinning 3D card)

  function initCardInteractions() {
    if (!POINTER_FINE.matches) return; // touch / no-pointer → skip entirely

    var activeCard = null;
    var rect = null;
    var rafId = 0;
    var pendingX = 0;
    var pendingY = 0;

    function allowTilt() {
      return !REDUCED_MOTION.matches;
    }

    function resetCard(card) {
      if (!card) return;
      card.style.setProperty('--pointer-x', '50%');
      card.style.setProperty('--pointer-y', '50%');
      card.style.transform = '';
    }

    function paint() {
      rafId = 0;
      if (!activeCard || !rect) return;

      var px = pendingX - rect.left;
      var py = pendingY - rect.top;

      activeCard.style.setProperty('--pointer-x', px + 'px');
      activeCard.style.setProperty('--pointer-y', py + 'px');

      if (allowTilt()) {
        var ry = (px / rect.width - 0.5) * (MAX_TILT * 2);
        var rx = (0.5 - py / rect.height) * (MAX_TILT * 2);
        // translateY matches the CSS --card-lift so tilt composes with
        // the hover rise instead of fighting it.
        activeCard.style.transform =
          'perspective(760px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
      }
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var card = e.target.closest ? e.target.closest(CARD_SELECTOR) : null;

      if (card !== activeCard) {
        resetCard(activeCard);
        activeCard = card;
        rect = card ? card.getBoundingClientRect() : null;
      }
      if (!card) return;

      // Refresh rect lazily (cheap) so scroll/resize don't desync the glow.
      rect = card.getBoundingClientRect();
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(paint);
    }, { passive: true });

    // Leaving the window entirely should relax the last card.
    document.addEventListener('pointerleave', function () {
      resetCard(activeCard);
      activeCard = null;
    });
  }

  /* =========================================================
     3. EVENT SYSTEM  —  data-driven universal renderer
     ---------------------------------------------------------
     Turns the unified Event / Activity model (data/events.js) into
     a consistent card + detail modal. Every section is conditional:
     no certificate → no certificate button, no gallery → no gallery,
     and so on (the "never show an empty field" rule). It renders
     nothing until a page provides real events, so it adds zero
     visible content today — it is the ready architecture for the
     future certificates-as-events, volunteering events, competitions,
     projects, and volleyball activities.
     ========================================================= */

  var EventSystem = (function () {
    var modalRoot = null;
    var lastFocused = null;
    var prevBodyOverflow = '';

    /* ---- small field helpers ---- */

    function has(v) {
      if (v == null) return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v.trim() !== '';
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    }

    /**
     * Resolves a data-authored media path so the SAME data file works
     * from every page depth without a build step. Event data writes
     * paths relative to the academic/ folder (e.g.
     * "assets/volunteering/russian-house/cert.jpg"); this prepends the
     * right hop for where the page actually lives:
     *   • academic/index.html            → "" (already correct)
     *   • academic/pages/*.html           → "../"
     *   • sports/index.html               → "../academic/"
     * Absolute URLs (http, //, /, data:) and already-"../"-relative
     * paths are returned untouched, so external videos/images and legacy
     * page-relative paths keep working.
     */
    function resolveMediaPath(src) {
      if (!src) return src;
      if (/^(https?:)?\/\//i.test(src) || src.charAt(0) === '/' ||
          src.indexOf('data:') === 0 || src.indexOf('../') === 0) {
        return src;
      }
      var path = location.pathname;
      var prefix = path.indexOf('/pages/') !== -1
        ? '../'
        : (path.indexOf('/sports/') !== -1 ? '../academic/' : '');
      return prefix + src;
    }

    function firstImage(ev) {
      if (has(ev.image)) return resolveMediaPath(typeof ev.image === 'string' ? ev.image : ev.image.src);
      if (has(ev.images)) {
        var m = ev.images[0];
        return resolveMediaPath(typeof m === 'string' ? m : m.src);
      }
      return '';
    }

    // Normalizes the gallery (images[] of strings or {src,alt,caption})
    // into the shape MediaViewer.open expects.
    function galleryItems(ev) {
      var list = [];
      if (has(ev.images)) {
        ev.images.forEach(function (m) {
          if (typeof m === 'string') list.push({ src: resolveMediaPath(m), alt: '', caption: '' });
          else if (m && m.src) list.push({ src: resolveMediaPath(m.src), alt: localize(m.alt), caption: localize(m.caption) });
        });
      }
      return list;
    }

    function certImage(ev) {
      if (!has(ev.certificate)) return '';
      if (typeof ev.certificate === 'string') return resolveMediaPath(ev.certificate);
      return resolveMediaPath(ev.certificate.image || ev.certificate.src || '');
    }

    function metaLine(ev) {
      var parts = [];
      // `provider` leads (certificates read "Provider · Date"); the rest are
      // the event fields. Every part is optional, so one field or five all
      // render as a single clean middot-separated line.
      if (has(ev.provider)) parts.push(escapeHtml(localize(ev.provider)));
      if (has(ev.date)) parts.push(escapeHtml(localize(ev.date)));
      if (has(ev.time)) parts.push(escapeHtml(localize(ev.time)));
      if (has(ev.location)) parts.push(escapeHtml(localize(ev.location)));
      if (has(ev.organization)) parts.push(escapeHtml(localize(ev.organization)));
      return parts.join(' &middot; ');
    }

    /**
     * SPORTS metadata line — "My team vs Opponent · Result" — shown only
     * when an event actually carries team / opponent / result (volleyball
     * matches, tournaments, …). Every piece is optional and independently
     * conditional, so a training session with only a team, or a match with
     * only a result, still reads cleanly. Built from escaped parts, so the
     * inline <span>/<strong> markup is the ONLY unescaped HTML. Returns ''
     * for non-sports events (volunteering, certificates), which keeps it a
     * no-op everywhere until real volleyball data exists.
     */
    function matchLine(ev) {
      var team = has(ev.team) ? escapeHtml(localize(ev.team)) : '';
      var opp = has(ev.opponent) ? escapeHtml(localize(ev.opponent)) : '';
      var vs = '';
      if (team && opp) {
        vs = team + ' <span class="event-vs">' + escapeHtml(t('eventVs', 'vs')) + '</span> ' + opp;
      } else {
        vs = team || opp;
      }
      var parts = [];
      if (vs) parts.push(vs);
      if (has(ev.result)) parts.push('<strong class="event-result">' + escapeHtml(localize(ev.result)) + '</strong>');
      return parts.join(' &middot; ');
    }

    /**
     * SPORTS stats — a small { label: value } map (points, aces, sets, …)
     * rendered as chips, e.g. "12 Points". Accepts either a plain object or
     * an array of { label, value }. Values and labels are localized +
     * escaped. Returns '' when there are no stats, so the modal's Stats
     * section only appears for events that carry them.
     */
    function statsBlock(ev) {
      if (!has(ev.stats)) return '';
      var entries = [];
      if (Array.isArray(ev.stats)) {
        ev.stats.forEach(function (s) {
          if (s && (has(s.value) || has(s.label))) entries.push([localize(s.label), localize(s.value)]);
        });
      } else if (typeof ev.stats === 'object') {
        Object.keys(ev.stats).forEach(function (k) {
          entries.push([k, localize(ev.stats[k])]);
        });
      }
      if (!entries.length) return '';
      return '<div class="event-chips event-stats">' + entries.map(function (pair) {
        var label = escapeHtml(pair[0]);
        var value = escapeHtml(pair[1]);
        return '<span class="skill-chip event-stat">' +
          (value ? '<strong>' + value + '</strong>' : '') +
          (label ? ' ' + label : '') +
        '</span>';
      }).join('') + '</div>';
    }

    function youTubeId(url) {
      var m = String(url).match(
        /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
      );
      return m ? m[1] : null;
    }

    /* ---- CARD ---- */

    // Tiny inline glyphs for the optional quick-action pills. Stroke-only
    // (fill:none, stroke:currentColor via .ev-ico in css) so they inherit the
    // pill's text colour and adapt to light/dark themes automatically.
    var CARD_ICON = {
      photos: '<svg class="ev-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M20 15l-5-4-8 7"/></svg>',
      cert: '<svg class="ev-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="9" r="5"/><path d="M9 13l-1.5 8L12 19l4.5 2L15 13"/></svg>',
      play: '<svg class="ev-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5L10 15.5z"/></svg>',
    };

    /**
     * Builds ONE compact experience card: a horizontal row — a small,
     * controlled media thumbnail on the inline start (auto-flips to the
     * inline end under RTL because it is the first flex child) and the
     * content column beside it (type badge, title, role, meta, a 2-line
     * description, and an actions row). The FULL, uncropped content lives in
     * the detail modal (openDetail) — the card stays small BECAUSE the detail
     * is one click away. The whole card is the click target (role="button");
     * the optional quick-action pills stop propagation so they fire their OWN
     * action (open the gallery / certificate viewer, or the external vlog
     * link) rather than the card's detail modal — no nested-click ambiguity.
     */
    function buildCard(ev, index) {
      var title = escapeHtml(localize(ev.title));
      var img = firstImage(ev);
      var typeBadge = has(ev.type)
        ? '<span class="event-type-badge">' + escapeHtml(localize(ev.type)) + '</span>'
        : '';
      var media = img
        ? '<span class="event-card-media" aria-hidden="true">' +
            '<img class="event-card-img" src="' + escapeHtml(img) + '" alt="" loading="lazy" decoding="async" ' +
            'onerror="this.closest(\'.event-card-media\').classList.add(\'is-empty\')" /></span>'
        : '';
      var meta = metaLine(ev);
      var match = matchLine(ev);
      var desc = has(ev.description)
        ? '<p class="cert-description event-card-desc">' + escapeHtml(localize(ev.description)) + '</p>'
        : '';

      // Optional quick actions — rendered ONLY when the underlying data
      // exists, so a card never shows an empty or dead button. Each carries
      // data-event-quick; renderInto wires the behaviour.
      var quick = [];
      if (galleryItems(ev).length) {
        quick.push(
          '<button type="button" class="event-quick-btn" data-event-quick="gallery">' +
          CARD_ICON.photos + '<span>' + escapeHtml(t('eventPhotos', 'Photos')) + '</span></button>'
        );
      }
      if (certImage(ev)) {
        quick.push(
          '<button type="button" class="event-quick-btn" data-event-quick="cert">' +
          CARD_ICON.cert + '<span>' + escapeHtml(t('eventCertificate', 'Certificate')) + '</span></button>'
        );
      }
      if (has(ev.videoUrl)) {
        quick.push(
          '<a class="event-quick-btn" data-event-quick="vlog" href="' + escapeHtml(ev.videoUrl) + '" ' +
          'target="_blank" rel="noopener">' +
          CARD_ICON.play + '<span>' + escapeHtml(t('eventVlog', 'Vlog')) + '</span></a>'
        );
      }
      var quickHtml = quick.length ? '<div class="event-quick-actions">' + quick.join('') + '</div>' : '';

      // Non-interactive primary affordance: signals the whole card opens the
      // full experience. pointer-events:none (in css) so the click falls
      // through to the card itself — never a nested button inside role=button.
      var cta =
        '<span class="event-card-cta" aria-hidden="true">' +
          escapeHtml(t('eventViewExperience', 'View experience')) +
          '<span class="event-card-cta-arrow">→</span>' +
        '</span>';

      return (
        '<article class="cert-card event-card event-card--compact reveal cert-card--clickable" ' +
        'data-event-index="' + index + '" tabindex="0" role="button" aria-haspopup="dialog" ' +
        'aria-label="' + title + '">' +
          media +
          '<div class="event-card-body">' +
            typeBadge +
            '<h3 class="cert-title">' + title + '</h3>' +
            (has(ev.role) ? '<p class="event-role">' + escapeHtml(localize(ev.role)) + '</p>' : '') +
            (meta ? '<p class="cert-provider">' + meta + '</p>' : '') +
            (match ? '<p class="cert-provider event-match-line">' + match + '</p>' : '') +
            desc +
            '<div class="event-card-actions">' + cta + quickHtml + '</div>' +
          '</div>' +
        '</article>'
      );
    }

    /**
     * Renders a list of events into a container, wiring each card to
     * open its detail modal. Shows the container's [data-empty] child
     * (if any) when there are no events, so empty states stay honest.
     */
    function renderInto(container, list) {
      if (!container) return;
      list = Array.isArray(list) ? list : [];

      var emptyEl = container.parentElement
        ? container.parentElement.querySelector('[data-events-empty]')
        : null;

      if (!list.length) {
        container.innerHTML = '';
        if (emptyEl) emptyEl.hidden = false;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;

      container.innerHTML = list.map(function (ev, i) { return buildCard(ev, i); }).join('');

      container.querySelectorAll('.event-card').forEach(function (card) {
        card.addEventListener('click', function () {
          openDetail(list[Number(card.dataset.eventIndex)]);
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail(list[Number(card.dataset.eventIndex)]);
          }
        });
      });

      // Optional quick-action pills inside a card must NOT bubble up to the
      // card's own "open detail" handler — an independent button fires its
      // OWN action (open the gallery / certificate viewer, or follow the
      // external vlog link), never the card viewer. stopPropagation on both
      // click and Enter/Space keeps them independent; the vlog pill is a real
      // <a target="_blank"> so its own navigation simply proceeds.
      container.querySelectorAll('[data-event-quick]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var card = btn.closest('.event-card');
          if (!card) return;
          var ev = list[Number(card.dataset.eventIndex)];
          if (!ev) return;
          var kind = btn.getAttribute('data-event-quick');
          if (kind === 'gallery') {
            var items = galleryItems(ev);
            if (items.length) MediaViewer.open(items, 0);
          } else if (kind === 'cert') {
            var c = certImage(ev);
            if (c) MediaViewer.open(
              [{ src: c, alt: 'Certificate: ' + localize(ev.title), caption: localize(ev.title) }], 0
            );
          }
          // 'vlog' is an external link — its default navigation proceeds.
        });
        btn.addEventListener('keydown', function (e) {
          // Keep Enter/Space on the pill from ALSO reaching the card handler.
          if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
        });
      });

      // The cards just injected carry `.reveal` and are added AFTER
      // animations.js set up its scroll-reveal observer (this file loads
      // later), and again on every language re-render. Nudge the reveal
      // system to pick them up now, so they animate in instead of staying
      // stuck at opacity:0 (present but invisible). Guarded so the system
      // still works if animations.js isn't on the page.
      if (window.ScrollReveal && typeof window.ScrollReveal.refresh === 'function') {
        window.ScrollReveal.refresh();
      }
    }

    /* ---- DETAIL MODAL ---- */

    // Built lazily on first open so pages that never show an event
    // detail carry no extra DOM.
    function ensureModal() {
      if (modalRoot) return;

      modalRoot = document.createElement('div');
      modalRoot.className = 'cert-modal event-modal';
      modalRoot.id = 'event-modal';
      modalRoot.setAttribute('aria-hidden', 'true');
      modalRoot.innerHTML = [
        '<div class="cert-modal-backdrop" data-event-close></div>',
        '<div class="cert-modal-content event-modal-content" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">',
        '  <button type="button" class="cert-modal-close" data-event-close aria-label="Close">&times;</button>',
        '  <div data-event-body></div>',
        '</div>',
      ].join('');
      document.body.appendChild(modalRoot);

      modalRoot.querySelectorAll('[data-event-close]').forEach(function (el) {
        el.addEventListener('click', closeDetail);
      });

      document.addEventListener('keydown', function (e) {
        if (!modalRoot.classList.contains('is-open')) return;
        if (MediaViewer.isOpen()) return; // viewer on top handles its own keys
        if (e.key === 'Escape') {
          closeDetail();
        } else if (e.key === 'Tab') {
          var focusable = modalRoot.querySelectorAll(
            'a[href], button:not([hidden]), [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable.length) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    function section(titleText, innerHtml) {
      if (!innerHtml) return '';
      return (
        '<div class="event-section">' +
          '<h4 class="event-section-title">' + escapeHtml(titleText) + '</h4>' +
          innerHtml +
        '</div>'
      );
    }

    function chips(list) {
      if (!has(list)) return '';
      return '<div class="event-chips">' + list.map(function (s) {
        return '<span class="skill-chip">' + escapeHtml(localize(s)) + '</span>';
      }).join('') + '</div>';
    }

    function peopleBlock(people) {
      if (!has(people)) return '';
      var cards = people.map(function (p) {
        var avatar = has(p.image)
          ? '<img class="event-person-avatar" src="' + escapeHtml(p.image) + '" alt="" loading="lazy" ' +
            'onerror="this.style.display=\'none\'" />'
          : '<span class="event-person-avatar event-person-avatar--fallback" aria-hidden="true">' +
            escapeHtml((localize(p.name) || '?').charAt(0)) + '</span>';
        return (
          '<li class="event-person">' +
            avatar +
            '<span class="event-person-info">' +
              '<span class="event-person-name">' + escapeHtml(localize(p.name)) + '</span>' +
              (has(p.role) ? '<span class="event-person-role">' + escapeHtml(localize(p.role)) + '</span>' : '') +
              (has(p.note) ? '<span class="event-person-note">' + escapeHtml(localize(p.note)) + '</span>' : '') +
            '</span>' +
          '</li>'
        );
      }).join('');
      return '<ul class="event-people">' + cards + '</ul>';
    }

    function galleryBlock(ev) {
      var items = galleryItems(ev);
      if (items.length < 1) return '';
      var thumbs = items.map(function (m, i) {
        return (
          '<button type="button" class="event-thumb" data-event-gallery="' + i + '" ' +
          'aria-label="' + escapeHtml(t('eventOpenImage', 'Open image')) + ' ' + (i + 1) + '">' +
          '<img src="' + escapeHtml(m.src) + '" alt="' + escapeHtml(m.alt) + '" loading="lazy" decoding="async" ' +
          'onerror="this.closest(\'.event-thumb\').style.display=\'none\'" /></button>'
        );
      }).join('');
      return '<div class="event-gallery">' + thumbs + '</div>';
    }

    function videoBlock(ev) {
      if (!has(ev.videoUrl)) return '';
      var url = ev.videoUrl;
      var id = youTubeId(url);
      if (id) {
        return (
          '<div class="event-video">' +
          '<iframe src="https://www.youtube-nocookie.com/embed/' + escapeHtml(id) + '" ' +
          'title="' + escapeHtml(t('eventVideo', 'Video')) + '" loading="lazy" frameborder="0" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen></iframe></div>'
        );
      }
      return (
        '<a class="btn btn-secondary event-video-link" href="' + escapeHtml(url) + '" ' +
        'target="_blank" rel="noopener">' + escapeHtml(t('eventWatchVideo', 'Watch video')) + '</a>'
      );
    }

    function linksBlock(links) {
      if (!has(links)) return '';
      return '<div class="event-links">' + links.map(function (l) {
        var href = typeof l === 'string' ? l : l.url;
        var label = typeof l === 'string' ? l : localize(l.label) || l.url;
        if (!href) return '';
        return '<a class="btn btn-secondary" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' +
          escapeHtml(label) + '</a>';
      }).join('') + '</div>';
    }

    function openDetail(ev) {
      if (!ev) return;
      ensureModal();

      var title = localize(ev.title);
      var meta = metaLine(ev);
      var match = matchLine(ev);
      var cert = certImage(ev);

      var mediaTop = firstImage(ev)
        ? '<button type="button" class="event-modal-media" data-event-hero aria-label="' + escapeHtml(t('eventViewFull', 'View image full screen')) + '">' +
          '<img src="' + escapeHtml(firstImage(ev)) + '" alt="' + escapeHtml(title) + '" ' +
          'onerror="this.closest(\'.event-modal-media\').classList.add(\'is-empty\')" /></button>'
        : '';

      var certButton = cert
        ? '<button type="button" class="btn btn-primary event-cert-btn" data-event-cert>' + escapeHtml(t('eventViewCert', 'View certificate')) + '</button>'
        : '';

      var body =
        (has(ev.type) ? '<span class="event-type-badge">' + escapeHtml(localize(ev.type)) + '</span>' : '') +
        '<h3 class="cert-title" id="event-modal-title">' + escapeHtml(title) + '</h3>' +
        (has(ev.role) ? '<p class="event-role">' + escapeHtml(localize(ev.role)) + '</p>' : '') +
        (has(ev.position) ? '<p class="event-role">' + escapeHtml(t('eventPosition', 'Position')) + ': ' + escapeHtml(localize(ev.position)) + '</p>' : '') +
        (meta ? '<p class="cert-provider">' + meta + '</p>' : '') +
        (match ? '<p class="cert-provider event-match-line">' + match + '</p>' : '') +
        mediaTop +
        (certButton ? '<div class="event-actions">' + certButton + '</div>' : '') +
        (has(ev.description) ? '<p class="event-description">' + escapeHtml(localize(ev.description)) + '</p>' : '') +
        section(t('eventWhatIDid', 'What I did'), has(ev.whatIDid) ? '<p>' + escapeHtml(localize(ev.whatIDid)) + '</p>' : '') +
        section(t('eventWhatILearned', 'What I learned'), has(ev.whatILearned) ? '<p>' + escapeHtml(localize(ev.whatILearned)) + '</p>' : '') +
        section(t('eventSkills', 'Skills'), chips(ev.skills)) +
        section(t('eventStats', 'Stats'), statsBlock(ev)) +
        section(t('eventPeople', 'People'), peopleBlock(ev.people)) +
        section(t('eventGallery', 'Gallery'), galleryBlock(ev)) +
        section(t('eventVideo', 'Video'), videoBlock(ev)) +
        section(t('eventNotes', 'Notes'), has(ev.notes) ? '<p>' + escapeHtml(localize(ev.notes)) + '</p>' : '') +
        section(t('eventLinks', 'Links'), linksBlock(ev.externalLinks || ev.links));

      modalRoot.querySelector('[data-event-body]').innerHTML = body;

      // Wire the media affordances to the shared viewer.
      var heroBtn = modalRoot.querySelector('[data-event-hero]');
      if (heroBtn) {
        heroBtn.addEventListener('click', function () {
          MediaViewer.open([{ src: firstImage(ev), alt: title, caption: title }], 0);
        });
      }
      var certBtn = modalRoot.querySelector('[data-event-cert]');
      if (certBtn) {
        certBtn.addEventListener('click', function () {
          MediaViewer.open([{ src: cert, alt: 'Certificate: ' + title, caption: title }], 0);
        });
      }
      var gitems = galleryItems(ev);
      modalRoot.querySelectorAll('[data-event-gallery]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          MediaViewer.open(gitems, Number(thumb.dataset.eventGallery));
        });
      });

      // Open.
      lastFocused = document.activeElement;
      prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      modalRoot.classList.add('is-open');
      modalRoot.setAttribute('aria-hidden', 'false');
      var closeBtn = modalRoot.querySelector('.cert-modal-close');
      if (closeBtn) {
        // Built once in ensureModal with an English baseline; refresh per
        // open so it matches the active language.
        closeBtn.setAttribute('aria-label', t('eventClose', 'Close'));
        closeBtn.focus();
      }
    }

    function closeDetail() {
      if (!modalRoot) return;
      modalRoot.classList.remove('is-open');
      modalRoot.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = prevBodyOverflow;
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      lastFocused = null;
      resetCursorState();
    }

    /**
     * Auto-render: if a page has a [data-events-grid] container and a
     * global `eventsData` array, render it. Both absent today, so this
     * is a no-op everywhere until a real events page is built.
     */
    /**
     * Resolves a grid's data source. A grid may name a global array via
     * data-events-source (e.g. "volleyballData"); otherwise it falls back
     * to the shared window.eventsData. Always returns a fresh array copy
     * so per-grid filtering never mutates the source.
     */
    function resolveSource(name) {
      var src = name && typeof window[name] !== 'undefined'
        ? window[name]
        : (typeof window.eventsData !== 'undefined' ? window.eventsData : []);
      return Array.isArray(src) ? src.slice() : [];
    }

    /**
     * Builds the list for ONE grid from its data-* attributes:
     *   data-events-source  — global array name (default: eventsData)
     *   data-events-type    — comma-separated type filter (e.g. "volunteering")
     *   data-events-limit   — max cards to show (e.g. a homepage preview)
     * All optional — an attribute-free grid just shows its whole source.
     */
    function selectFor(grid) {
      var data = resolveSource(grid.getAttribute('data-events-source'));

      var typeAttr = grid.getAttribute('data-events-type');
      if (typeAttr) {
        var types = typeAttr.split(',').map(function (s) {
          return s.trim().toLowerCase();
        }).filter(Boolean);
        if (types.length) {
          data = data.filter(function (ev) {
            return types.indexOf(String(localize(ev.type) || '').toLowerCase()) !== -1;
          });
        }
      }

      var limit = parseInt(grid.getAttribute('data-events-limit'), 10);
      if (!isNaN(limit) && limit > 0) data = data.slice(0, limit);

      return data;
    }

    /**
     * Auto-render: every [data-events-grid] on the page renders its own
     * data (filtered/limited per its attributes) and re-renders on a
     * language switch so localized fields follow. A grid with no source
     * and no data simply shows its [data-events-empty] sibling — the
     * honest empty state used by the volleyball foundation page. No page
     * without a grid is touched.
     */
    function autoInit() {
      var grids = document.querySelectorAll('[data-events-grid]');
      if (!grids.length) return;

      function renderAll() {
        Array.prototype.forEach.call(grids, function (grid) {
          renderInto(grid, selectFor(grid));
        });
      }

      renderAll();
      document.addEventListener('i18n:languagechange', renderAll);
    }

    return {
      buildCard: buildCard,
      renderInto: renderInto,
      openDetail: openDetail,
      autoInit: autoInit,
      // Exposed so js/certificates.js can resolve its own card <img> paths
      // through the SAME page-depth logic the event renderer uses — one
      // source of truth for "where does this asset live from here".
      resolveMediaPath: resolveMediaPath,
    };
  })();

  window.EventSystem = EventSystem;

  /* ---------------------------------------------------------
     BOOTSTRAP
  ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    initCardInteractions();
    EventSystem.autoInit();
  });
})();
