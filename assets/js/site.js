/* ============================================================
   حسين البسيوني — site behaviour (home page)
   · mobile nav, sticky header, scroll-spy
   · renders volleyball / projects / socials / stat summary from
     academic/data/ in the CURRENT language (ar / en / ru)
   · re-renders everything on `site-lang-change`
   · honours prefers-reduced-motion
   No framework, no build step.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() {
    return (window.I18N && window.I18N.getLang()) || 'ar';
  }
  function t(key) {
    return (window.I18N && window.I18N.t(key, lang())) || '';
  }
  function tv(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    var l = lang();
    return v[l] || v.en || v.ar || '';
  }

  var SOCIAL_ICONS = {
    linkedin: '<path d="M4.9 3.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM3.5 8.6h2.8V20H3.5zM9 8.6h2.7v1.6h.04c.38-.72 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3V20h-2.8v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H9z"/>',
    github: '<path d="M12 2.2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2.2z"/>',
    youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.13 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77c.27-1.6.4-3.2.4-4.8s-.13-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2z"/>',
    vk: '<path d="M12.8 16.9c-5 0-8-3.5-8.1-9.2h2.5c.1 4.2 2 6 3.5 6.4V7.7h2.3v3.6c1.5-.2 3-1.9 3.6-3.6h2.2c-.4 2.2-2 3.9-3.2 4.6 1.2.6 3.1 2.1 3.9 4.6h-2.5c-.6-1.7-2.1-3-4-3.2v3.2z"/>'
  };

  function svgIcon(pathData) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + pathData + '</svg>';
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ============================================================
     1. Header: stuck state
     ============================================================ */
  var header = $('#site-header');
  var toTop = $('#to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 40);
    if (toTop && !toTop.hidden) toTop.hidden = y < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     2. Mobile navigation (labels follow the language)
     ============================================================ */
  var navToggle = $('#nav-toggle');
  var primaryNav = $('#primary-nav');

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', t('nav.open'));
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? t('nav.close') : t('nav.open'));
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

    document.addEventListener('click', function (e) {
      if (!primaryNav.classList.contains('is-open')) return;
      if (!e.target.closest('#primary-nav') && !e.target.closest('#nav-toggle')) closeNav();
    });
  }

  /* ============================================================
     3. Scroll-spy
     ============================================================ */
  function initSpy() {
    if (!primaryNav || !('IntersectionObserver' in window)) return;
    var navLinks = Array.prototype.slice.call(primaryNav.querySelectorAll('a[href^="#"]'));
    var spyTargets = navLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!spyTargets.length) return;
    var visible = new Set();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target.id);
        else visible.delete(en.target.id);
      });
      var activeId = null;
      spyTargets.forEach(function (t) { if (visible.has(t.id)) activeId = t.id; });
      navLinks.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + activeId);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }
  initSpy();

  /* ============================================================
     4. Reveal on scroll
     ============================================================ */
  function initReveal(scope) {
    var targets = (scope || document).querySelectorAll(
      '.tl-item, .stage, .card, .record, .empty-state, .chain li, .tagbar, .stat'
    );
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (n) { n.classList.add('reveal', 'is-in'); });
      return;
    }
    targets.forEach(function (n) { if (!n.classList.contains('is-in')) n.classList.add('reveal'); });
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        rev.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    targets.forEach(function (n) {
      if (!n.classList.contains('is-in')) rev.observe(n);
    });
  }

  /* ============================================================
     5. Stat labels with real plural agreement
     ============================================================ */
  function ruPlural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function statNoun(kind, n, l) {
    if (l === 'en') {
      if (kind === 'certs') return n === 1 ? 'verified certificate' : 'verified certificates';
      if (kind === 'vol') return n === 1 ? 'volunteering record' : 'volunteering records';
      return n === 1 ? 'volleyball tournament' : 'volleyball tournaments';
    }
    if (l === 'ru') {
      if (kind === 'certs') return ruPlural(n, 'подтверждённый сертификат', 'подтверждённых сертификата', 'подтверждённых сертификатов');
      if (kind === 'vol') return ruPlural(n, 'волонтёрская запись', 'волонтёрские записи', 'волонтёрских записей');
      return ruPlural(n, 'волейбольный турнир', 'волейбольных турнира', 'волейбольных турниров');
    }
    /* ar */
    if (kind === 'certs') {
      if (n === 1) return 'شهادة موثقة';
      if (n === 2) return 'شهادتان موثقتان';
      if (n >= 3 && n <= 10) return 'شهادات موثقة';
      return 'شهادة موثقة';
    }
    if (kind === 'vol') {
      if (n === 1) return 'عملية تطوع';
      if (n === 2) return 'عمليتا تطوع';
      if (n >= 3 && n <= 10) return 'عمليات تطوع';
      return 'عملية تطوع';
    }
    if (n === 1) return 'بطولة كرة طائرة';
    if (n === 2) return 'بطولتا كرة طائرة';
    if (n >= 3 && n <= 10) return 'بطولات كرة طائرة';
    return 'بطولة كرة طائرة';
  }

  /* ============================================================
     6. Dynamic rendering — rebuilt on every language change
     ============================================================ */
  function renderStats() {
    var statRow = $('#stat-row');
    if (!statRow) return;
    var l = lang();
    var certs = window.certificatesData || [];
    var events = (window.eventsData || []).filter(function (e) { return e.type === 'volunteering'; });
    var volley = window.volleyballData || [];
    statRow.innerHTML = '';
    [
      { n: certs.length, kind: 'certs', href: 'records.html' },
      { n: events.length, kind: 'vol', href: 'records.html#volunteering' },
      { n: volley.length, kind: 'tourney', href: '#volleyball' }
    ].forEach(function (s) {
      var li = el('li', 'stat');
      li.appendChild(el('span', 'stat-num', String(s.n)));
      li.appendChild(el('span', 'stat-label', statNoun(s.kind, s.n, l)));
      var a = el('a', 'stat-link', t('stat.view'));
      a.href = s.href;
      a.setAttribute('aria-label', statNoun(s.kind, s.n, l) + ' — ' + t('stat.viewRecord'));
      li.appendChild(a);
      statRow.appendChild(li);
    });
  }

  function renderVolleyball() {
    var volleyList = $('#volley-list');
    if (!volleyList) return;
    var volley = window.volleyballData || [];
    volleyList.innerHTML = '';
    volley.forEach(function (v) {
      var li = el('li', 'record');
      li.appendChild(el('h3', 'record-title', tv(v.title)));
      var meta = el('p', 'record-meta');
      [tv(v.organization), tv(v.position), tv(v.date), tv(v.result)]
        .filter(Boolean)
        .forEach(function (x) { meta.appendChild(el('span', null, x)); });
      li.appendChild(meta);
      if (tv(v.description)) li.appendChild(el('p', 'record-text', tv(v.description)));
      var cover = v.image || (v.images && v.images[0] && v.images[0].src);
      if (cover) {
        var a = el('a', 'record-action is-plain', t('volley.viewImage'));
        a.href = 'academic/' + cover.replace(/^academic\//, '');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
      }
      volleyList.appendChild(li);
    });
  }

  function renderProjects() {
    var projects = window.projectsData || [];
    var projList = $('#projects-list');
    var projEmpty = $('#projects-empty');
    if (!projList || !projEmpty) return;
    projList.innerHTML = '';
    if (!projects.length) {
      projEmpty.hidden = false;
      projList.hidden = true;
      return;
    }
    projEmpty.hidden = true;
    projList.hidden = false;
    projects.forEach(function (p) {
      var li = el('li', 'card');
      li.appendChild(el('h3', 'card-title', tv(p.title) || p.title || ''));
      var desc = tv(p.description) || p.description;
      if (desc) li.appendChild(el('p', 'card-text', desc));
      if (p.image) {
        var img = document.createElement('img');
        img.src = 'academic/' + String(p.image).replace(/^academic\//, '');
        var altTitle = tv(p.title) || p.title;
        img.alt = altTitle ? altTitle + ' — ' + t('projects.screenshot') : t('projects.screenshotDefault');
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:auto;border-radius:9px;margin-block-start:16px';
        li.appendChild(img);
      }
      projList.appendChild(li);
    });
  }

  function renderSocials() {
    var socials = ((window.socialData && window.socialData.platforms) || [])
      .filter(function (p) { return SOCIAL_ICONS[p.key]; })
      .slice(0, 4);
    var socialList = $('#social-list');
    var contactPending = $('#contact-pending');
    if (!socialList) return;
    socialList.innerHTML = '';
    socials.forEach(function (p) {
      var li = el('li');
      var a = el('a', 'social');
      a.href = p.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      var ico = el('span', 'social-ico', svgIcon(SOCIAL_ICONS[p.key]));
      var txt = el('span');
      txt.appendChild(el('span', 'social-name', p.name));
      if (p.label) txt.appendChild(el('span', 'social-label', tv(p.label)));
      a.appendChild(ico);
      a.appendChild(txt);
      li.appendChild(a);
      socialList.appendChild(li);
    });
    if (contactPending) contactPending.hidden = socials.length > 0;
  }

  function renderAll() {
    renderStats();
    renderVolleyball();
    renderProjects();
    renderSocials();
    var fy = $('#footer-year');
    if (fy) fy.textContent = String(new Date().getFullYear());
    initReveal(document);
  }

  renderAll();
  initReveal(document);
  document.addEventListener('site-lang-change', renderAll);
})();
