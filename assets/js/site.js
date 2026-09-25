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

  /* Social platform names in Arabic script (no Latin in the Arabic UI). */
  var SOCIAL_AR = {
    linkedin: 'لينكد إن',
    github: 'غيت هب',
    youtube: 'يوتيوب',
    vk: 'فك',
    tiktok: 'تيك توك',
    facebook: 'فيسبوك',
    discord: 'ديسكورد',
    qabilah: 'قابلية'
  };

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
     5. Render — certificates
     ============================================================ */
  var certs = window.certificatesData || [];
  var certsList = $('#certs-list');
  var certsNone = $('#certs-none');
  var certTags = $('#cert-tags');
  var learningEmpty = $('#learning-empty');

  /* Tag every certificate by concept.
     Preferred path: an explicit `tags` array in the data file — that is the
     controlled vocabulary, and it is never guessed at render time.
     The regex list below is only a fallback so a new record never ends up
     untagged; it is written to tolerate the Arabic definite article
     (الـ), which is why "الذكاء الاصطناعي" must not be tested for
     "ذكاء اصطناعي" — that substring does not exist. */
  var TAGS = {
    ai:          { ar: 'الذكاء الاصطناعي' },
    'first-aid': { ar: 'الإسعافات الأولية' },
    data:        { ar: 'تحليل البيانات' },
    python:      { ar: 'بايثون' },
    excel:       { ar: 'إكسل' }
  };
  var TAG_RULES = [
    { re: /ذكاء|اصطناعي|artificial intelligence|\bai\b/i, tag: 'ai' },
    { re: /إسعاف|إسعافات|first aid|\bcpr\b/i,              tag: 'first-aid' },
    { re: /بيانات|بياناتية|data analysis|data science/i,  tag: 'data' },
    { re: /بايثون|\bpython\b/i,                            tag: 'python' },
    { re: /إكسل|\bexcel\b/i,                              tag: 'excel' }
  ];

  function tagsFor(record) {
    var explicit = Array.isArray(record.tags) ? record.tags.slice() : [];
    if (explicit.length) return explicit;

    var hay = ar(record.title) + ' ' + ar(record.description) + ' ' + ar(record.category);
    var found = [];
    TAG_RULES.forEach(function (rule) {
      if (rule.re.test(hay) && found.indexOf(rule.tag) === -1) found.push(rule.tag);
    });
    return found;
  }

  function renderCert(record) {
    var li = el('li', 'record');
    li.appendChild(el('h3', 'record-title', ar(record.title)));

    var meta = el('p', 'record-meta');
    [ar(record.provider), ar(record.date), ar(record.category)]
      .filter(Boolean)
      .forEach(function (t) { meta.appendChild(el('span', null, t)); });
    li.appendChild(meta);

    if (ar(record.description)) li.appendChild(el('p', 'record-text', ar(record.description)));

    var link = record.credentialUrl || (record.verificationUrl && ar(record.verificationUrl));
    if (link) {
      var a = el('a', 'record-action', 'عرض الشهادة');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
    }
    li.dataset.tags = tagsFor(record).join(' ');
    return li;
  }

  if (certs.length) {
    certsList.innerHTML = '';
    certs.forEach(function (c) { certsList.appendChild(renderCert(c)); });

    /* build the filter buttons from the tags actually in use */
    var used = [];
    certsList.querySelectorAll('.record').forEach(function (n) {
      (n.dataset.tags || '').split(' ').filter(Boolean).forEach(function (t) {
        if (used.indexOf(t) === -1) used.push(t);
      });
    });

    used.forEach(function (slug) {
      var label = (TAGS[slug] || { ar: slug }).ar;
      var b = el('button', 'tag', label);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.dataset.tag = slug;
      certTags.appendChild(b);
    });

    certTags.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag');
      if (!btn) return;
      var slug = btn.dataset.tag;
      var wasOn = btn.getAttribute('aria-pressed') === 'true';
      var turningOn = !wasOn;   // clicking an active tag clears the filter

      certTags.querySelectorAll('.tag').forEach(function (b) {
        b.setAttribute('aria-pressed', (b === btn && turningOn) ? 'true' : 'false');
      });

      var shown = 0;
      certsList.querySelectorAll('.record').forEach(function (n) {
        /* clearing the filter restores every record, not none of them */
        var hit = turningOn
          ? (n.dataset.tags || '').split(' ').indexOf(slug) !== -1
          : true;
        n.hidden = !hit;
        if (hit) shown++;
      });
      certsNone.hidden = shown > 0;
    });
  } else {
    certTags.hidden = true;
    learningEmpty.hidden = false;
  }

  /* ============================================================
     6. Render — volunteering
     ============================================================ */
  var events = (window.eventsData || []).filter(function (e) { return e.type === 'volunteering'; });
  var volList = $('#volunteer-list');

  events.forEach(function (ev) {
    var li = el('li', 'record');
    li.appendChild(el('h3', 'record-title', ar(ev.title)));

    var meta = el('p', 'record-meta');
    [ar(ev.organization), ar(ev.role), ar(ev.date)]
      .filter(Boolean)
      .forEach(function (t) { meta.appendChild(el('span', null, t)); });
    li.appendChild(meta);

    if (ar(ev.description)) li.appendChild(el('p', 'record-text', ar(ev.description)));

    var cert = (ev.images || []).map(function (i) { return i.src; })
      .filter(function (s) { return /certificate/i.test(s); })[0] || ev.image;
    if (cert && /certificate/i.test(cert)) {
      var a = el('a', 'record-action is-plain', 'شهادة التطوّع');
      a.href = 'academic/' + cert.replace(/^academic\//, '');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
    }
    volList.appendChild(li);
  });

  if (!events.length) volList.parentNode.hidden = true;

  /* ============================================================
     7. Render — volleyball
     ============================================================ */
  var volley = window.volleyballData || [];
  var volleyList = $('#volley-list');

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
    .filter(function (p) { return SOCIAL_AR[p.key] && SOCIAL_ICONS[p.key]; })
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
    txt.appendChild(el('span', 'social-name', SOCIAL_AR[p.key]));
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
