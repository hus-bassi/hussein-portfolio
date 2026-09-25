/* ============================================================
   حسين البسيوني — site behaviour
   · mobile nav, sticky header, scroll-spy
   · renders certificates / volunteering / volleyball from the
     real data files in academic/data/
   · honours prefers-reduced-motion
   No framework, no build step.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Arabic-friendly value reader ----------
     Data files store localised fields as { en, ar, ru }.
     Read the Arabic, fall back to English only if Arabic is missing. */
  function ar(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value.ar || value.en || '';
  }

  /* Arabic names for the certificate providers, so that no Latin
     characters appear anywhere in the Arabic version of the site.
     `provider`, `date` and `category` are localised objects in the
     data file — ar() picks the right one automatically. */

  /* Platform names are brand names — they are written by the platform,
     not translated. Hussein's instruction: keep them exactly as the brand
     writes them (LinkedIn, GitHub, YouTube, VK) even inside the Arabic
     version, and keep the role/description underneath in Arabic.
     The name therefore comes straight from the data file. */

  var SOCIAL_ICONS = {
    linkedin: '<path d="M4.9 3.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM3.5 8.6h2.8V20H3.5zM9 8.6h2.7v1.6h.04c.38-.72 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3V20h-2.8v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H9z"/>',
    github: '<path d="M12 2.2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2.2z"/>',
    youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.13 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77c.27-1.6.4-3.2.4-4.8s-.13-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2z"/>',
    vk: '<path d="M12.8 16.9c-5 0-8-3.5-8.1-9.2h2.5c.1 4.2 2 6 3.5 6.4V7.7h2.3v3.6c1.5-.2 3-1.9 3.6-3.6h2.2c-.4 2.2-2 3.9-3.2 4.6 1.2.6 3.1 2.1 3.9 4.6h-2.5c-.6-1.7-2.1-3-4-3.2v3.2z"/>'
  };

  function svgIcon(pathData) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + pathData + '</svg>';
  }

  /* ---------- Small DOM helpers ---------- */
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
    header.classList.toggle('is-stuck', y > 40);
    if (!toTop.hidden) toTop.hidden = y < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     2. Mobile navigation
     ============================================================ */
  var navToggle = $('#nav-toggle');
  var primaryNav = $('#primary-nav');

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

  document.addEventListener('click', function (e) {
    if (!primaryNav.classList.contains('is-open')) return;
    if (!e.target.closest('#primary-nav') && !e.target.closest('#nav-toggle')) closeNav();
  });

  /* ============================================================
     3. Scroll-spy — mark the section currently in view
     ============================================================ */
  var navLinks = Array.prototype.slice.call(primaryNav.querySelectorAll('a[href^="#"]'));
  var spyTargets = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && spyTargets.length) {
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

  /* ============================================================
     4. Reveal on scroll (skipped entirely when motion is reduced)
     ============================================================ */
  var revealTargets = document.querySelectorAll(
    '.tl-item, .stage, .card, .record, .empty-state, .chain li, .tagbar'
  );
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (n) { n.classList.add('reveal', 'is-in'); });
  } else {
    revealTargets.forEach(function (n) { n.classList.add('reveal'); });
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        rev.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    revealTargets.forEach(function (n) { rev.observe(n); });
  }

  /* ============================================================
     5. Learning summary
     The full searchable record lives on records.html. The home page
     only shows the honest totals, each linking to that page.
     ============================================================ */
  var certs = window.certificatesData || [];
  var events = (window.eventsData || []).filter(function (e) { return e.type === 'volunteering'; });
  var volley = window.volleyballData || [];
  var statRow = $('#stat-row');

  if (statRow) {
    [
      { n: certs.length,    label: 'شهادة موثّقة',   href: 'records.html' },
      { n: events.length,   label: 'عملية تطوّع',     href: 'records.html#volunteering' },
      { n: volley.length,   label: 'بطولة كرة طائرة', href: '#volleyball' }
    ].forEach(function (s) {
      var li = el('li', 'stat');
      li.appendChild(el('span', 'stat-num', String(s.n)));
      li.appendChild(el('span', 'stat-label', s.label));
      var a = el('a', 'stat-link', 'عرض');
      a.href = s.href;
      a.setAttribute('aria-label', s.label + ' — عرض السجل');
      li.appendChild(a);
      statRow.appendChild(li);
    });
  }

  /* ============================================================
     6. Render — volleyball
     ============================================================ */
  var volleyList = $('#volley-list');
  if (volleyList) {
    volley.forEach(function (v) {
      var li = el('li', 'record');
      li.appendChild(el('h3', 'record-title', ar(v.title)));

      var meta = el('p', 'record-meta');
      [ar(v.organization), ar(v.position), ar(v.date), ar(v.result)]
        .filter(Boolean)
        .forEach(function (t) { meta.appendChild(el('span', null, t)); });
      li.appendChild(meta);

      if (ar(v.description)) li.appendChild(el('p', 'record-text', ar(v.description)));

      var cover = v.image || (v.images && v.images[0] && v.images[0].src);
      if (cover) {
        var a = el('a', 'record-action is-plain', 'عرض الصورة');
        a.href = 'academic/' + cover.replace(/^academic\//, '');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
      }
      volleyList.appendChild(li);
    });
  }

  /* ============================================================
     8. Render — projects (stays empty until real ones exist)
     ============================================================ */
  var projects = window.projectsData || [];
  var projList = $('#projects-list');
  var projEmpty = $('#projects-empty');

  if (projects.length) {
    projEmpty.hidden = true;
    projList.hidden = false;
    projects.forEach(function (p) {
      var li = el('li', 'card');
      li.appendChild(el('h3', 'card-title', p.title || ''));
      if (p.description) li.appendChild(el('p', 'card-text', p.description));
      if (p.image) {
        var img = el('img', null, null);
        img.src = 'academic/' + p.image.replace(/^academic\//, '');
        img.alt = p.title ? p.title + ' — لقطة شاشة' : 'لقطة شاشة للمشروع';
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:auto;border-radius:9px;margin-block-start:16px';
        li.appendChild(img);
      }
      projList.appendChild(li);
    });
  }

  /* ============================================================
     9. Render — social links
     ============================================================ */
  var socials = ((window.socialData && window.socialData.platforms) || [])
    /* the professional / academic ones that serve this audience */
    .filter(function (p) { return SOCIAL_ICONS[p.key]; })
    .slice(0, 4);
  var socialList = $('#social-list');
  var contactPending = $('#contact-pending');

  socials.forEach(function (p) {
    var li = el('li');
    var a = el('a', 'social');
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    var ico = el('span', 'social-ico', svgIcon(SOCIAL_ICONS[p.key]));
    var txt = el('span');
    /* the platform writes its own name — keep it exactly as it is,
       even in the Arabic version. Only the description below is Arabic. */
    txt.appendChild(el('span', 'social-name', p.name));
    if (p.label) txt.appendChild(el('span', 'social-label', ar(p.label)));

    a.appendChild(ico);
    a.appendChild(txt);
    li.appendChild(a);
    socialList.appendChild(li);
  });

  /* No e-mail on file yet — say so honestly rather than invent one. */
  if (!socials.length && contactPending) contactPending.hidden = false;

  /* ============================================================
     10. Footer year
     ============================================================ */
  var fy = $('#footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());

  /* Reveal elements injected after the observer was set up */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.querySelectorAll('#certs-list > *, #volunteer-list > *, #volley-list > *, #social-list > *')
      .forEach(function (n) {
        n.classList.add('reveal');
        requestAnimationFrame(function () { n.classList.add('is-in'); });
      });
  }
})();
