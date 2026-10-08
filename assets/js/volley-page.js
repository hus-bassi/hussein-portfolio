/* ============================================================
   VOLLEY-PAGE — builds volleyball.html's tournament cards.
   ------------------------------------------------------------
   The page owns no facts: every visible string comes from
   academic/data/volleyball.js (the same source the sports page
   reads) or the i18n dictionary in the CURRENT language, and the
   whole band re-renders on `site-lang-change`, exactly like the
   certificates and volunteering lists. The card recipe (.v-card
   etc.) lives in site.css §8d.

   Media paths in the data are written relative to the academic/
   folder, so a root-level page like this one resolves them the
   same way records.js does: an academic/ prefix is added, a `
   leading `../` is stripped (the file sits at the project root),
   and absolute / https: paths are handed through untouched.
   ============================================================ */
(function () {
  'use strict';

  var list = document.getElementById('v-list');
  var data = (typeof window !== 'undefined') && window.volleyballData;
  if (!list || !data || !data.length) return;

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
  function img(src, alt) {
    var i = document.createElement('img');
    i.src = src;
    i.alt = alt || '';
    i.loading = 'lazy';
    return i;
  }

  function render() {
    list.textContent = '';
    data.forEach(function (r) {
      var li = el('li', 'v-card');

      if (r.image) {
        var fig = el('figure', 'v-cover');
        fig.appendChild(img(mediaPath(r.image), tv(r.title)));
        li.appendChild(fig);
      }

      var body = el('div', 'v-card-body');

      body.appendChild(el('h3', 'v-card-title', tv(r.title)));

      var meta = el('p', 'v-card-meta');
      [tv(r.date), tv(r.location), tv(r.result), tv(r.role)].forEach(function (m) {
        if (m) meta.appendChild(el('span', null, m));
      });
      body.appendChild(meta);

      if (r.description) body.appendChild(el('p', 'v-card-text', tv(r.description)));
      if (r.whatIDid) body.appendChild(el('p', 'v-card-text', tv(r.whatIDid)));

      /* a real tournament certificate is a document, not a claim: when the
         data has one, it opens here in a new tab, rel="noopener" */
      if (r.certificate) {
        var cert = el('a', 'record-action', t('vp.certView'));
        cert.href = mediaPath(r.certificate);
        cert.target = '_blank';
        cert.rel = 'noopener noreferrer';
        body.appendChild(cert);
      }
      li.appendChild(body);

      if (r.images && r.images.length) {
        var gal = el('div', 'v-gallery');
        r.images.forEach(function (g) {
          var f = el('figure');
          f.appendChild(img(mediaPath(g.src), tv(g.caption)));
          f.appendChild(el('figcaption', null, tv(g.caption)));
          gal.appendChild(f);
        });
        li.appendChild(gal);
      }

      list.appendChild(li);
    });

    /* the rebuilt list goes back through the reveal engine: page.js's mount
       scan armed this <ul> while it was still EMPTY (this script runs after
       it), so scan() would skip the group. resolve() re-deals with it
       whatever its armed state — the NEW children get armed, the ones on
       screen settle, the ones below the fold are watched. A swap, not an
       arrival. */
    if (window.Reveal) Reveal.resolve(list);
  }

  render();
  document.addEventListener('site-lang-change', render);
})();