/* ============================================================
   Shared page furniture — loaded by every page BEFORE its
   own behaviour script (site.js / page.js / records.js).

   The three things that remain are page-level and language-aware:

     · UI.atmosphere()    the star field and the pointer light
     · UI.sectionIndex()  a ghost numeral behind every section heading,
                          aria-hidden, so it needs no translation
     · UI.marquee()       the keyword strip, rebuilt in the current
                          language (two groups = a seamless loop)

   Everything that used to live here and belonged somewhere else has
   moved, so that each idea has one implementation instead of two that
   drift apart:

     · the scroll reader, the reading rail and the hero parallax
       → assets/js/scroll.js, with the CSS consuming --scroll-*
     · the pointer light and its position
       → assets/js/pointer.js, replacing the old cursor.js
     · the reveal observer, with its four behaviours
       → assets/js/reveal.js

   And what is here is furniture that was in THREE files at once: the
   back-to-top button, the mobile navigation, the language indicator's
   position, and the page transition. Those had drifted — the three copies
   of the nav had grown different features — which is the reason they now
   have one.

   No framework, no build step.
   ============================================================ */
(function () {
  'use strict';

  var UI = window.UI = window.UI || {};
  var root = document.documentElement;

  function t(key) {
    return (window.I18N && I18N.t(key, I18N.getLang())) || '';
  }
  function still() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- 1. atmosphere: the field and the pointer light ----------
     The single entry point for the two decorative layers. Each is optional
     and each guards itself: a missing module, a reduced-motion setting or a
     touch device all mean "do nothing", never "break something". Neither
     layer is ever the only way to convey anything, and neither ever
     receives a pointer event. */
  UI.atmosphere = function () {
    try { if (window.Field) Field.mount(document.body); } catch (e) { /* decorative only */ }
    try { if (window.Pointer) Pointer.mount(document.body); } catch (e) { /* decorative only */ }
  };

  /* The two layers above refuse to mount when the OS is asking for calm,
     and tear themselves down if it starts asking. If the answer changes the
     other way while the page is open, the site should become alive again
     without a reload — so the same signal that removes them rebuilds them.
     Each layer guards itself, so calling this twice is harmless. */
  if (window.Motion) {
    Motion.onChange(function (still) { if (!still) UI.atmosphere(); });
  }

  /* ---------- 2. ghost section numerals ----------
     A decorative numeral behind every section heading, aria-hidden so the
     screen reader and the language switcher never see it. That is also why
     it needs no translation: 01 is 01 in all three languages. */
  UI.sectionIndex = function (scope) {
    var heads = (scope || document).querySelectorAll('.sec-head');
    heads.forEach(function (h, i) {
      if (h.querySelector('.sec-index')) return;
      var s = document.createElement('span');
      s.className = 'sec-index';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      h.insertBefore(s, h.firstChild);
    });
  };

  /* ---------- 3. keyword marquee (needs I18N for the words) ---------- */
  UI.marquee = function (root) {
    var strip = root || document.getElementById('marquee');
    if (!strip) return;
    var track = strip.querySelector('.marquee-track');
    if (!track) return;

    var words = ((window.I18N && window.I18N.t('marquee.items')) || '')
      .split('|')
      .map(function (w) { return w.trim(); })
      .filter(Boolean);
    if (!words.length) { track.innerHTML = ''; return; }

    function group() {
      var g = document.createElement('div');
      g.className = 'marquee-group';
      words.forEach(function (w) {
        var s = document.createElement('span');
        s.className = 'marquee-item';
        s.textContent = w;
        g.appendChild(s);
      });
      return g;
    }

    track.innerHTML = '';
    track.appendChild(group());
    track.appendChild(group());   /* the duplicate makes the loop seamless */
  };

  /* ---------- 4. the language indicator's position ----------
     The pill in the switcher is ONE element that moves; the CSS draws it
     from --lang-x / --lang-w. It is measured here rather than computed
     from a formula, because the three labels are three different widths in
     three different scripts, and Arabic lays the row out the other way —
     so the only correct position is the one the browser just laid out.

     One layout read per language change. Never per frame, never per
     pointer event. If anything is missing the CSS keeps its default
     (the first button, 40px) and the pill simply does not move, which is
     a decoration failing quietly rather than a broken switcher. */
  function placeLangIndicator() {
    var sw = document.querySelector('.lang-switch');
    if (!sw) return;
    var active = sw.querySelector('.lang-btn.is-active') || sw.querySelector('.lang-btn');
    if (!active) return;
    /* offsetLeft is relative to the switcher's padding box, which is what
       the absolutely positioned pill is measured against. */
    sw.style.setProperty('--lang-x', (active.offsetLeft - 3) + 'px');
    sw.style.setProperty('--lang-w', active.offsetWidth + 'px');
  }
  UI.placeLangIndicator = placeLangIndicator;
  UI.mount = function () {
    UI.currentPage();
    placeLangIndicator();
    UI.transitions();
    UI.chrome();
    document.addEventListener('site-lang-change', placeLangIndicator);
    window.addEventListener('resize', placeLangIndicator, { passive: true });
  };

  /* ---------- 5. back to top and the mobile navigation ----------
     Three copies of this existed, one per page script, and they had
     started to differ. One copy now. The click honours reduced motion
     without a script of its own: the smooth behaviour is the default and
     `auto` is the fallback for a visitor who has asked for calm. */
  UI.chrome = function () {
    var toTop = document.getElementById('to-top');
    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' });
      });
    }

    var navToggle = document.getElementById('nav-toggle');
    var primaryNav = document.getElementById('primary-nav');
    if (!navToggle || !primaryNav) return;

    function setOpen(open) {
      primaryNav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', t(open ? 'nav.close' : 'nav.open'));
    }
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', function () {
      setOpen(!primaryNav.classList.contains('is-open'));
    });
    primaryNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!primaryNav.classList.contains('is-open')) return;
      if (e.target.closest('#primary-nav') || e.target.closest('#nav-toggle')) return;
      setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !primaryNav.classList.contains('is-open')) return;
      setOpen(false);
      navToggle.focus();
    });
  };

  /* ---------- 6. page transitions ----------
     Two mechanisms, and only one of them runs. If the browser has the View
     Transitions API then a single line of CSS in site.css (§19) does the
     whole job and this function does nothing except record which way the
     visitor is going. If it has not, this plays the same shape by hand: the
     old page dims and drifts for up to 400ms, and then the browser
     navigates. It waits for the transition to end, with a timer as the
     guarantee, so a dropped transitionend can never trap a visitor on a
     page they have already clicked away from.

     Under reduced motion, and for anything that is not a real page link,
     it is not involved at all: the click behaves exactly as it always did. */
  /* Which page is the visitor on, and which one are they leaving for.
     Used for two things: the exit below, and the data-nav attribute the
     directional transitions in site.css §19 are written against. */
  var PAGES = ['index.html', 'story.html', 'records.html', 'projects.html', 'project.html'];
  function pageName(url) {
    var path = String(url).split('#')[0].split('?')[0];
    var file = path.substring(path.lastIndexOf('/') + 1);
    return PAGES.indexOf(file) > -1 ? file.replace('.html', '') : '';
  }
  function here() { return pageName(location.pathname); }

  function store(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }
  function read(key) {
    try { return sessionStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  /* Read on arrival, and written on every page link. The record is only
     consumed by the page that opens, which is why it is removed here. */
  function direction() {
    var to = here();
    if (!to) return;
    var from = read('site-nav-from');
    try { sessionStorage.removeItem('site-nav-from'); } catch (e) { /* ignore */ }
    if (from && from !== to) root.setAttribute('data-nav', from + '>' + to);
  }

  /* One listener that finds the page link, for BOTH mechanisms. The
     View Transitions path only needs the record; the fallback path also
     needs to stop the navigation and play the exit. */
  function pageLink(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
    if (a.origin !== location.origin) return null;
    var to = pageName(a.href);
    if (!to || to === here()) return null;    /* an anchor inside this page */
    return { a: a, to: to };
  }

  /* ---------- 6. which page are we on ----------
     The one thing the header has to know before anything else. It is
     derived from location, never from the visible text: the labels change
     between three languages and comparing "الرئيسية" is how a navigation
     ends up lying to somebody.

     `pathname` carries no query string and no hash, which is half the work
     done — `records.html?category=ai` and `/records.html/` both arrive here
     as a path that reduces to `records`. The variants a static host can
     produce (`/`, `/index.html`, `/index`, a trailing slash) all reduce to
     `home` rather than to three different answers.

     A link is a PAGE link when it has no hash, or when its hash is the
     site's own top anchor — which is what makes the home page's `#home`
     item a page link and `#plan` a section link rather than five links
     claiming to be the current page at once.
  */
  var TOP_ANCHORS = ['#home', '#top', '#main'];

  function pageKey(path) {
    var p = String(path || '');
    /* a directory root, or nothing at all */
    p = p.replace(/\/+$/, '');
    var file = p.substring(p.lastIndexOf('/') + 1).toLowerCase();
    if (!file || file === 'index' || file === 'index.html' || file === 'index.htm') return 'home';
    return file.replace(/\.html?$/, '');
  }
  function linkPageKey(a) {
    var href = a.getAttribute('href') || '';
    var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
    if (hash && TOP_ANCHORS.indexOf(hash.toLowerCase()) === -1) return '';   /* a section, not a page */
    return pageKey(a.pathname || href);
  }
  UI.currentPage = function () {
    var nav = document.getElementById('primary-nav');
    if (!nav) return;
    var here = pageKey(location.pathname);
    var links = nav.querySelectorAll('a[href]');
    var winner = null;
    for (var i = 0; i < links.length; i++) {
      /* the URL is the only authority: whatever the markup claimed is
         cleared first, so a hand-written aria-current can never survive
         being wrong */
      links[i].removeAttribute('aria-current');
      var key = linkPageKey(links[i]);
      if (key && key === here) winner = links[i];
    }
    if (winner) winner.setAttribute('aria-current', 'page');
  };

  UI.transitions = function () {
    direction();
    /* `typeof … === 'function'`, not `in`: a browser can expose the name and
       still not be able to run a transition, and `'x' in document` would
       then hand the navigation to a mechanism that does not work. */
    var native = typeof document.startViewTransition === 'function';
    var calm = still();

    document.addEventListener('click', function (e) {
      var link = pageLink(e);
      if (!link) return;
      store('site-nav-from', here());
      if (native || calm) return;      /* the browser, or the visitor, is in charge */

      /* the fallback: the old page dims and drifts, and the browser is
         sent there when it finishes — or after 400ms, whichever is first,
         because a dropped transitionend must never strand anyone */
      e.preventDefault();
      root.classList.add('is-leaving');
      var done = false;
      var go = function () {
        if (done) return;
        done = true;
        location.href = link.a.href;
      };
      var shell = document.querySelector('.shell');
      if (shell) shell.addEventListener('transitionend', go, { once: true });
      setTimeout(go, 400);
    });
  };
})();
