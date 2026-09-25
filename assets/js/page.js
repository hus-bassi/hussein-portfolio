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

  if (navToggle && primaryNav) {
    function closeNav() {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'فتح قائمة التنقل');
    }
    navToggle.addEventListener('click', function () {
      var open = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل');
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
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        rev.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .1 });
    targets.forEach(function (n) { rev.observe(n); });
  }

  /* ---------- footer year ---------- */
  var fy = document.getElementById('footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());
})();
