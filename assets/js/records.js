/* ============================================================
   Records page — instant search + tag filtering, trilingual
   · haystack indexes ALL three languages, so a query matches no
     matter which UI language is active
   · display language follows the global switcher (ar / en / ru)
   · results appear as you type; no Enter, no button
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
  /* all language versions, for the search index */
  function allLangs(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return [v.ar, v.en, v.ru].filter(Boolean).join('  ');
  }

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Arabic normalisation (plus generic lowercasing) ---------- */
  function normalise(s) {
    return String(s == null ? '' : s)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
      .replace(/[\u0649\u06CC]/g, '\u064A')
      .replace(/\u0624/g, '\u0648')
      .replace(/\u0626/g, '\u064A')
      .replace(/[\u0660-\u0669]/g, function (d) {
        return String(d.charCodeAt(0) - 0x0660);
      })
      .replace(/[\u066A\u061B\u061F\u00AB\u00BB\u2018\u2019\u201C\u201D]/g, ' ')
      .replace(/[.,;?!'"()\[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function withinEditDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      var best = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return false;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[b.length] <= max;
  }

  /* ---------- controlled vocabulary, trilingual ---------- */
  var TAGS = {
    ai:           { ar: 'الذكاء الاصطناعي', en: 'AI',               ru: 'ИИ' },
    'first-aid':  { ar: 'الإسعافات الأولية', en: 'First aid',       ru: 'Первая помощь' },
    data:         { ar: 'تحليل البيانات',   en: 'Data analysis',    ru: 'Анализ данных' },
    python:       { ar: 'بايثون',            en: 'Python',           ru: 'Python' },
    excel:        { ar: 'إكسل',              en: 'Excel',            ru: 'Excel' },
    volunteering: { ar: 'التطوّع',           en: 'Volunteering',     ru: 'Волонтёрство' }
  };
  function tagLabel(slug) {
    var e = TAGS[slug];
    if (!e) return slug;
    var l = lang();
    return e[l] || e.en || e.ar;
  }

  function index(rec) {
    rec.hay = normalise(rec.hayAll);
    rec.words = rec.hay.split(' ').filter(Boolean);
    return rec;
  }

  function certLink(c) {
    if (c.credentialUrl) return c.credentialUrl;
    if (c.verificationUrl) {
      if (typeof c.verificationUrl === 'string') return c.verificationUrl;
      return tv(c.verificationUrl);
    }
    return '';
  }

  function buildCerts() {
    return (window.certificatesData || []).map(function (c) {
      var tags = Array.isArray(c.tags) ? c.tags : [];
      var l = lang();
      return index({
        title: tv(c.title),
        meta: [tv(c.provider), tv(c.date), tv(c.category)].filter(Boolean).join(' · '),
        body: tv(c.description),
        tags: tags,
        tagsText: tags.map(tagLabel).join(' '),
        hayAll: [
          allLangs(c.title), allLangs(c.provider), allLangs(c.date),
          allLangs(c.category), allLangs(c.description),
          tags.map(function (sg) {
            var e = TAGS[sg] || {};
            return [e.ar, e.en, e.ru].filter(Boolean).join(' ');
          }).join(' ')
        ].join('  '),
        link: certLink(c),
        actionKey: 'rec.viewCert',
        _lang: l
      });
    });
  }

  function buildVolunteering() {
    return (window.eventsData || [])
      .filter(function (e) { return e.type === 'volunteering'; })
      .map(function (e) {
        var cert = (e.images || []).map(function (i) { return i.src; })
          .filter(function (s) { return /certificate/i.test(s); })[0] || e.image;
        var hasCert = cert && /certificate/i.test(cert);
        var skillsAll = (e.skills || []).map(allLangs).join(' ');
        return index({
          title: tv(e.title),
          meta: [tv(e.organization), tv(e.role), tv(e.date)].filter(Boolean).join(' · '),
          body: tv(e.description),
          tags: ['volunteering'],
          tagsText: (e.skills || []).map(function (s) { return tv(s); }).filter(Boolean).join(' '),
          hayAll: [
            allLangs(e.title), allLangs(e.organization), allLangs(e.role),
            allLangs(e.date), allLangs(e.description), skillsAll,
            [TAGS.volunteering.ar, TAGS.volunteering.en, TAGS.volunteering.ru].join(' ')
          ].join('  '),
          link: hasCert ? 'academic/' + cert.replace(/^academic\//, '') : '',
          actionKey: 'rec.viewVolCert'
        });
      });
  }

  function score(rec, q, qWords) {
    if (!q) return 1;
    var h = rec.hay;
    if (h === q) return 100;
    /* whole-word match outranks a mere substring: "AI" should find the
       AI certificate first, not "First Aid" (which only contains "ai"
       inside "aid") */
    if (q.indexOf(' ') === -1 && rec.words.indexOf(q) !== -1) return 95;
    if (h.indexOf(q) !== -1) return 90;
    if (qWords.every(function (w) { return h.indexOf(w) !== -1; })) return 80;
    var starts = 0;
    qWords.forEach(function (w) {
      if (rec.words.some(function (hw) { return hw.indexOf(w) === 0; })) starts++;
    });
    if (starts) return 60 + starts * 5;
    var subs = 0;
    qWords.forEach(function (w) { if (h.indexOf(w) !== -1) subs++; });
    if (subs) return 40 + subs * 5;
    var typos = 0;
    qWords.forEach(function (w) {
      if (w.length < 4) return;
      var tol = w.length > 7 ? 2 : 1;
      if (rec.words.some(function (hw) {
        return Math.abs(hw.length - w.length) <= tol && withinEditDistance(w, hw, tol);
      })) typos++;
    });
    if (typos) return 20 + typos * 5;
    return 0;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- plural-aware hint text ---------- */
  function ruPlural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  function arRecords(n) {
    if (n === 1) return 'سجل واحد';
    if (n === 2) return 'سجلان';
    if (n <= 10) return n + ' سجلات';
    return n + ' سجلاً';
  }
  function arResults(n) {
    if (n === 1) return 'نتيجة واحدة';
    if (n === 2) return 'نتيجتان';
    if (n <= 10) return n + ' نتائج';
    return n + ' نتيجة';
  }
  function hintText(total, raw, q) {
    var l = lang();
    if (!total) {
      if (l === 'en') return q ? 'No results for “' + raw.trim() + '”' : 'No results in this field';
      if (l === 'ru') return q ? 'Ничего не найдено по запросу «' + raw.trim() + '»' : 'В этом направлении ничего нет';
      return q ? 'لا توجد نتائج لـ «' + raw.trim() + '»' : 'لا توجد نتائج في هذا المجال';
    }
    if (l === 'en') {
      if (q) return (total === 1 ? '1 result' : total + ' results') + ' for “' + raw.trim() + '”';
      return total === 1 ? '1 record' : total + ' records';
    }
    if (l === 'ru') {
      if (q) return ruPlural(total, 'Найдена ', 'Найдено ', 'Найдено ') +
        total + ' ' + ruPlural(total, 'запись', 'записи', 'записей') +
        ' по запросу «' + raw.trim() + '»';
      return total + ' ' + ruPlural(total, 'запись', 'записи', 'записей');
    }
    if (q) return arResults(total) + ' لـ «' + raw.trim() + '»';
    if (total === 0) return 'لا توجد سجلات';
    return arRecords(total);
  }

  function highlight(text, qWords) {
    var safe = escapeHtml(text);
    var parts = qWords.filter(function (w) { return w.length > 1; })
      .sort(function (a, b) { return b.length - a.length; });
    if (!parts.length) return safe;
    var pattern = parts.map(function (w) {
      return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|');
    try {
      return safe.replace(new RegExp('(' + pattern + ')', 'gi'), '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  function recordNode(rec, qWords) {
    var li = el('li', 'record');
    li.appendChild(el('h3', 'record-title', highlight(rec.title, qWords)));
    li.appendChild(el('p', 'record-meta', highlight(rec.meta, qWords)));
    if (rec.body) li.appendChild(el('p', 'record-text', highlight(rec.body, qWords)));
    if (rec.link) {
      var a = el('a', 'record-action', t(rec.actionKey));
      a.href = rec.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
    }
    return li;
  }

  var certsList = $('#certs-list');
  var volList = $('#volunteer-list');
  var certsNone = $('#certs-none');
  var volNone = $('#vol-none');
  var hint = $('#search-hint');
  var input = $('#search');
  var clearBtn = $('#search-clear');
  var tagbar = $('#tagbar');
  var certsCount = $('#certs-count');
  var volCount = $('#vol-count');

  var allCerts = [];
  var allVol = [];
  var activeTag = '';

  function rebuildData() {
    allCerts = buildCerts();
    allVol = buildVolunteering();
  }

  function paintTags() {
    if (!tagbar) return;
    tagbar.querySelectorAll('.tag').forEach(function (b) {
      var slug = b.dataset.tag || '';
      b.setAttribute('aria-pressed', slug === activeTag ? 'true' : 'false');
    });
  }

  function buildTags() {
    if (!tagbar) return;
    tagbar.innerHTML = '';
    var allBtn = el('button', 'tag tag-all', t('search.all'));
    allBtn.type = 'button';
    allBtn.setAttribute('aria-pressed', activeTag === '' ? 'true' : 'false');
    allBtn.dataset.tag = '';
    tagbar.appendChild(allBtn);

    var used = [];
    allCerts.concat(allVol).forEach(function (r) {
      r.tags.forEach(function (sg) { if (used.indexOf(sg) === -1) used.push(sg); });
    });
    used.forEach(function (slug) {
      var b = el('button', 'tag', tagLabel(slug));
      b.type = 'button';
      b.setAttribute('aria-pressed', slug === activeTag ? 'true' : 'false');
      b.dataset.tag = slug;
      tagbar.appendChild(b);
    });
  }

  function apply() {
    if (!input || !certsList || !volList) return;
    var raw = input.value;
    var q = normalise(raw);
    var qWords = q ? q.split(' ').filter(Boolean) : [];

    function run(list, target, noneEl, countEl) {
      var hit = [];
      list.forEach(function (rec) {
        if (activeTag && rec.tags.indexOf(activeTag) === -1) return;
        var s = score(rec, q, qWords);
        if (s > 0) hit.push({ rec: rec, s: s });
      });
      hit.sort(function (a, b) { return b.s - a.s; });
      target.innerHTML = '';
      hit.forEach(function (x) { target.appendChild(recordNode(x.rec, qWords)); });
      noneEl.hidden = hit.length > 0;
      countEl.textContent = hit.length ? String(hit.length) : '';
      return hit.length;
    }

    var c = run(allCerts, certsList, certsNone, certsCount);
    var v = run(allVol, volList, volNone, volCount);
    var total = c + v;

    clearBtn.hidden = !raw;

    var certsSec = $('#certificates');
    var volSec = $('#volunteering');
    if (volSec) volSec.hidden = (v === 0);
    if (certsSec) certsSec.hidden = (c === 0);

    hint.textContent = hintText(total, raw, q);
  }

  function fullRefresh() {
    rebuildData();
    buildTags();
    apply();
  }

  if (input) {
    input.addEventListener('input', function () {
      if (activeTag) { activeTag = ''; paintTags(); }
      apply();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; apply(); }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = ''; apply(); input.focus();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey) return;
    if (!input) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    input.focus();
  });

  if (tagbar) {
    tagbar.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag');
      if (!btn) return;
      var wasOn = btn.getAttribute('aria-pressed') === 'true';
      activeTag = wasOn ? '' : (btn.dataset.tag || '');
      if (input) { input.value = ''; }
      if (clearBtn) clearBtn.hidden = true;
      paintTags();
      apply();
    });
  }

  /* ---------- header / to-top / nav ---------- */
  var header = $('#site-header');
  var toTop = $('#to-top');
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
        closeNav(); navToggle.focus();
      }
    });
  }

  var fy = $('#footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());

  rebuildData();
  buildTags();
  apply();

  /* premium layer: ghost numerals + progress rail.
     Records themselves are never animated in — filtering must feel
     instant on every keystroke. */
  if (window.UI) { UI.sectionIndex(); UI.progress(); }

  document.addEventListener('site-lang-change', fullRefresh);
})();
