/* ============================================================
   Records page — instant search + tag filtering
   · Arabic-normalised matching (normalise() below is the most
     important function on the page)
   · ranked tiers: exact → phrase → all-words → word-start →
     substring → typo-tolerant
   · results appear as you type; no Enter, no button
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function ar(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v.ar || v.en || '';
  }

  /* ============================================================
     Arabic normalisation
     Arabic is written with optional diacritics, several forms of
     alef, Eastern Arabic digits, and tatweel. Without folding these,
     a perfectly normal query silently returns nothing.
     ============================================================ */
  function normalise(s) {
    return String(s == null ? '' : s)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')   /* تشكيل + تطويل */
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') /* آأإٱ → ا */
      .replace(/[\u0649\u06CC]/g, '\u064A')            /* ى ی → ي  */
      .replace(/\u0624/g, '\u0648')                   /* ؤ → و    */
      .replace(/\u0626/g, '\u064A')                   /* ئ → ي    */
      .replace(/[\u0660-\u0669]/g, function (d) {      /* ٠-٩ → 0-9 */
        return String(d.charCodeAt(0) - 0x0660);
      })
      .replace(/[\u066A\u061B\u061F\u00AB\u00BB\u2018\u2019\u201C\u201D]/g, ' ')
      .replace(/[.,;?!'"()\[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /* ---------- bounded Levenshtein ---------- */
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
      var t = prev; prev = cur; cur = t;
    }
    return prev[b.length] <= max;
  }

  /* ---------- controlled vocabulary (see "The Tagging Rule") ---------- */
  var TAGS = {
    ai:          { ar: 'الذكاء الاصطناعي' },
    'first-aid': { ar: 'الإسعافات الأولية' },
    data:        { ar: 'تحليل البيانات' },
    python:      { ar: 'بايثون' },
    excel:       { ar: 'إكسل' },
    volunteering:{ ar: 'التطوّع' }
  };

  function index(rec) {
    rec.hay = normalise([rec.title, rec.meta, rec.body, rec.tagsText].filter(Boolean).join('  '));
    rec.words = rec.hay.split(' ').filter(Boolean);
    return rec;
  }

  function buildCerts() {
    return (window.certificatesData || []).map(function (c) {
      var tags = Array.isArray(c.tags) ? c.tags : [];
      return index({
        title: ar(c.title),
        meta: [ar(c.provider), ar(c.date), ar(c.category)].filter(Boolean).join(' · '),
        body: ar(c.description),
        tags: tags,
        tagsText: tags.map(function (t) { return (TAGS[t] || {}).ar || t; }).join(' '),
        link: c.credentialUrl || (c.verificationUrl && ar(c.verificationUrl)),
        action: 'عرض الشهادة'
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
        return index({
          title: ar(e.title),
          meta: [ar(e.organization), ar(e.role), ar(e.date)].filter(Boolean).join(' · '),
          body: ar(e.description),
          tags: ['volunteering'],
          tagsText: (e.skills || []).map(ar).filter(Boolean).join(' '),
          link: hasCert ? 'academic/' + cert.replace(/^academic\//, '') : '',
          action: 'شهادة التطوّع'
        });
      });
  }

  function score(rec, q, qWords) {
    if (!q) return 1;
    var h = rec.hay;
    if (h === q) return 100;
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

  /* ---------- Arabic plural agreement ----------
     Arabic does not use "number + singular" the way English does.
     "4 سجل" is wrong; it must be "٤ سجلات". These five forms cover
     0 / 1 / 2 / 3-10 / 11+ */
  function plural(n, f) {
    if (n === 0) return f[0];
    if (n === 1) return f[1];
    if (n === 2) return f[2];
    if (n <= 10) return n + ' ' + f[3];
    return n + ' ' + f[4];
  }

  var SIHILL = ['لا توجد سجلات', 'سجل واحد', 'سجلان', 'سجلات', 'سجلاً'];
  var NATIJA = ['لا توجد نتائج', 'نتيجة واحدة', 'نتيجتان', 'نتائج', 'نتيجة'];

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
      var a = el('a', 'record-action', rec.action);
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

  var allCerts = buildCerts();
  var allVol = buildVolunteering();
  var activeTag = '';

  function apply() {
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
      /* just the numeral here — the heading supplies the noun, so no
         plural agreement is needed and none is invented */
      countEl.textContent = hit.length ? String(hit.length) : '';
      return hit.length;
    }

    var c = run(allCerts, certsList, certsNone, certsCount);
    var v = run(allVol, volList, volNone, volCount);
    var total = c + v;

    clearBtn.hidden = !raw;

    /* hide a whole section when the filter leaves it empty, so the page
       never shows a bare heading over nothing */
    $('#volunteering').hidden = (v === 0);
    $('#certificates').hidden = (c === 0);

    if (!total) {
      hint.textContent = q
        ? 'لا توجد نتائج لـ «' + raw.trim() + '»'
        : 'لا توجد نتائج في هذا المجال';
    } else if (q) {
      hint.textContent = plural(total, NATIJA) + ' لـ «' + raw.trim() + '»';
    } else {
      hint.textContent = plural(total, SIHILL);
    }
  }

  input.addEventListener('input', function () {
    /* Search is deliberately global — it always looks across every record,
       never just the currently selected tag. Typing therefore returns the
       filter to "الكل", so the two controls can never silently disagree. */
    if (activeTag) { activeTag = ''; paintTags(); }
    apply();
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; apply(); }
  });
  clearBtn.addEventListener('click', function () {
    input.value = ''; apply(); input.focus();
  });

  /* "/" focuses search, like any serious tool */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey) return;
    var t = (document.activeElement && document.activeElement.tagName) || '';
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    e.preventDefault();
    input.focus();
  });

  /* ---------- Tag buttons ----------
     "الكل" is always first and is the default state. Search is global:
     typing always searches across everything, and a tag is only for
     browsing. The two therefore never fight each other — choosing a tag
     clears the search, and typing resets the tag back to "الكل". */
  function paintTags() {
    tagbar.querySelectorAll('.tag').forEach(function (b) {
      var slug = b.dataset.tag || '';
      b.setAttribute('aria-pressed', slug === activeTag ? 'true' : 'false');
    });
  }

  var used = [];
  allCerts.concat(allVol).forEach(function (r) {
    r.tags.forEach(function (t) { if (used.indexOf(t) === -1) used.push(t); });
  });

  var allBtn = el('button', 'tag tag-all', 'الكل');
  allBtn.type = 'button';
  allBtn.setAttribute('aria-pressed', 'true');
  allBtn.dataset.tag = '';
  tagbar.appendChild(allBtn);

  used.forEach(function (slug) {
    var b = el('button', 'tag', (TAGS[slug] || { ar: slug }).ar);
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.dataset.tag = slug;
    tagbar.appendChild(b);
  });

  tagbar.addEventListener('click', function (e) {
    var btn = e.target.closest('.tag');
    if (!btn) return;
    var wasOn = btn.getAttribute('aria-pressed') === 'true';
    activeTag = wasOn ? '' : (btn.dataset.tag || '');
    /* browsing by tag, so any search text is no longer relevant */
    input.value = '';
    clearBtn.hidden = true;
    paintTags();
    apply();
  });

  /* ---------- header / to-top / nav ---------- */
  var header = $('#site-header');
  var toTop = $('#to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-stuck', y > 40);
    toTop.hidden = y < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

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
      closeNav(); navToggle.focus();
    }
  });

  var fy = $('#footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());

  apply();
})();
