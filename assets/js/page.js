/* ============================================================
   Shared behaviour for the standalone pages (story.html, and any
   future page that only needs the header, nav, footer and reveal).
   The records page has its own richer script.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header + back to top ---------- */
  var header = document.getElementById('site-header');
  var toTop = document.getElementById('to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 40);
    if (toTop) toTop.hidden = y < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  function tt(key) {
    return (window.I18N && window.I18N.t(key)) || '';
  }

  if (navToggle && primaryNav) {
    function closeNav() {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', tt('nav.open'));
    }
    navToggle.addEventListener('click', function () {
      var open = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? tt('nav.close') : tt('nav.open'));
    });
    primaryNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- reveal ---------- */
  var targets = document.querySelectorAll('.tl-item, .story-end, .story-end-actions');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    targets.forEach(function (n) { n.classList.add('reveal'); });
    var rev = new IntersectionObserver(function (entries) {
      var order = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        /* small stagger, capped at ~350ms — content is never held back */
        if (order) en.target.style.transitionDelay = (order * 70) + 'ms';
        order++;
        en.target.classList.add('is-in');
        rev.unobserve(en.target);
        window.setTimeout(function () { en.target.style.transitionDelay = ''; }, 700);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: .01 });
    targets.forEach(function (n) { rev.observe(n); });
  }

  /* ---------- premium layer: ghost numerals + progress rail ---------- */
  if (window.UI) { UI.sectionIndex(); UI.progress(); }

  /* ---------- footer year ---------- */
  var fy = document.getElementById('footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());
})();
