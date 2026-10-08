/* ============================================================
   ACADEMIC-PAGE — builds academic.html's dynamic bands.
   ------------------------------------------------------------
   The page owns no facts: the certificate list reads
   academic/data/certificates.js (the same source the records page
   reads) and the featured project card is ProjectCard.build on the
   Elmajd record — the one project card recipe, never forked. Both
   bands re-render on `site-lang-change`, exactly like the homepage
   lists, so a switch of language rebuilds every { ar, en, ru }
   string in place.

   Media paths follow the records.js contract: `../` files live at
   the project root and are stripped; everything else resolves
   under academic/.
   ============================================================ */
(function () {
  'use strict';

  var certList = document.getElementById('ap-certs-list');
  var projList = document.getElementById('ap-projects-list');
  var certData = (typeof window !== 'undefined') && window.certificatesData;
  var projData = (typeof window !== 'undefined') && window.projectsData;

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
  function mediaPath(p) {
    if (!p) return '';
    var s = String(p);
    if (/^\.\.\//.test(s)) return s.slice(3);
    if (/^(\/|https?:)/i.test(s)) return s;
    return 'academic/' + s.replace(/^academic\//, '');
  }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /* the certificate list: every completed record, one row per record,
     title · provider · date, the document's own scan as a thumbnail and
     the official PDF (or the scan, when there is no PDF) as the open
     action — a file that actually exists, never an invented credential */
  function renderCerts() {
    if (!certList || !certData || !certData.length) return;
    certList.textContent = '';
    certData.forEach(function (c) {
      var li = el('li', 'ap-cert');

      var scan = mediaPath(tv(c.image));
      if (scan) {
        var thumb = document.createElement('img');
        thumb.className = 'ap-cert-thumb';
        thumb.src = scan;
        thumb.alt = tv(c.alt) || tv(c.title) || '';
        thumb.loading = 'lazy';
        li.appendChild(thumb);
      }

      li.appendChild(el('em', null, tv(c.title) || ''));
      var provider = el('span', null, tv(c.provider));
      provider.setAttribute('dir', 'auto');
      li.appendChild(provider);

      var when = tv(c.date);
      if (when) {
        var time = el('time', null, when);
        if (c.dateISO) time.dateTime = c.dateISO;
        li.appendChild(time);
      }

      var doc = mediaPath(tv(c.pdf)) || scan;
      if (doc) {
        var view = el('a', 'record-action', t('ap.certOpen'));
        view.href = doc;
        view.target = '_blank';
        view.rel = 'noopener noreferrer';
        li.appendChild(view);
      }

      certList.appendChild(li);
    });

    /* see volley-page.js: the mount scan armed this group while it was
       empty; resolve() re-deals with it for the rebuild */
    if (window.Reveal) Reveal.resolve(certList);
  }

  /* the featured project — the one card recipe for the whole site */
  function renderProjects() {
    if (!projList || !projData || !window.ProjectCard) return;
    projList.textContent = '';
    projData.forEach(function (p) {
      projList.appendChild(window.ProjectCard.build(p));
    });
    if (window.Reveal) Reveal.resolve(projList);
  }

  renderCerts();
  renderProjects();
  document.addEventListener('site-lang-change', function () {
    renderCerts();
    renderProjects();
  });
})();