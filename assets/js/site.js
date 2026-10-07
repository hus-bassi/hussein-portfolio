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
    vk: '<path d="M12.8 16.9c-5 0-8-3.5-8.1-9.2h2.5c.1 4.2 2 6 3.5 6.4V7.7h2.3v3.6c1.5-.2 3-1.9 3.6-3.6h2.2c-.4 2.2-2 3.9-3.2 4.6 1.2.6 3.1 2.1 3.9 4.6h-2.5c-.6-1.7-2.1-3-4-3.2v3.2z"/>',
    telegram: '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>',
    discord: '<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>',
    instagram: '<path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
    facebook: '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
    x: '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>',
    tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'
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
     1-2. Header state, the back-to-top button and the mobile
     navigation all live in assets/js/ui.js now, together with the
     page transition. They were copied into all three page scripts
     and the copies had started to differ; there is one of each.

     What is left here is the scroll-spy, which is about the NAVIGATION
     and only exists on this page.
     ============================================================ */
  var primaryNav = $('#primary-nav');

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
    if (window.Reveal) Reveal.scan(scope);
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
    animateStats(statRow);
  }

  /* The three numbers count up the first time they scroll into view.
     Under prefers-reduced-motion (or without IntersectionObserver) the
     real value is simply left on screen — no animation at all. */
  var statsObserver = null;

  function countUp(node, to) {
    var start = null, dur = 850;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(to * eased));
      if (p < 1) window.requestAnimationFrame(step);
      else node.textContent = String(to);
    }
    window.requestAnimationFrame(step);
  }

  function animateStats(statRow) {
    if (statsObserver) { statsObserver.disconnect(); statsObserver = null; }
    var nums = Array.prototype.slice.call(statRow.querySelectorAll('.stat-num'));
    if (reduceMotion || !('IntersectionObserver' in window) || !nums.length) return;
    var to = nums.map(function (n) { return parseInt(n.textContent, 10) || 0; });
    nums.forEach(function (n) { n.textContent = '0'; });
    statsObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      statsObserver.disconnect();
      statsObserver = null;
      nums.forEach(function (n, i) { countUp(n, to[i]); });
    }, { threshold: .5 });
    statsObserver.observe(statRow);
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

  /* The card recipe now lives in project-card.js, so the home page and
     projects.html render the SAME card. The card opens the project's
     detail page (project.html?id=<id>); the engineering story lives
     there, never in a disclosure inside the card. */
  function renderProjects() {
    var projects = window.projectsData || [];
    var projList = $('#projects-list');
    var projEmpty = $('#projects-empty');
    var projCta = $('#projects-cta');
    if (!projList || !projEmpty) return;
    projList.innerHTML = '';
    if (!projects.length) {
      projEmpty.hidden = false;
      projList.hidden = true;
      if (projCta) projCta.hidden = true;
      return;
    }
    projEmpty.hidden = true;
    projList.hidden = false;
    if (projCta) projCta.hidden = false;
    projects.forEach(function (p) {
      if (window.ProjectCard) projList.appendChild(window.ProjectCard.build(p));
    });
  }

  function renderSocials() {
    var socials = (window.socialData && window.socialData.platforms) || [];
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
      var path = SOCIAL_ICONS[p.key];
      var ico;
      if (path) {
        ico = el('span', 'social-ico', svgIcon(path));
      } else {
        /* A platform with no official glyph gets an honest monogram in the
           icon's own box, never a borrowed or invented brand mark. */
        ico = el('span', 'social-ico');
        ico.classList.add('social-mono');
        ico.setAttribute('aria-hidden', 'true');
        ico.textContent = p.name.charAt(0).toUpperCase();
      }
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
    if (window.UI) UI.marquee();      /* the keyword strip follows the language */
    var fy = $('#footer-year');
    if (fy) fy.textContent = String(new Date().getFullYear());
    initReveal(document);
  }

  renderAll();
  initReveal(document);
  if (window.Scroll) Scroll.mount();
  if (window.UI) { UI.sectionIndex(); UI.atmosphere(); UI.mount(); }
  document.addEventListener('site-lang-change', renderAll);
})();
