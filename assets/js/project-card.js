/* ============================================================
   PROJECT-CARD — the one recipe for a project card.
   Loaded by the home page (inside site.js's renderProjects) and by
   projects.html (via projects-page.js), so the card NEVER exists in
   two shapes that drift apart.

   The title is the semantic anchor and its ::after (styled in site.css
   §10) stretches over the whole card — the card reads as one clickable
   target without wrapping the card in an anchor, and without losing the
   external website CTA, which lifts above the overlay.

   Every visible string comes from the project data or the dictionary in
   the CURRENT language, and the caller re-renders on site-lang-change.
   ============================================================ */
(function () {
  'use strict';

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
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /* the route lives in the data (`id`), not in the title — a title can
     change between languages, the route cannot */
  function detailHref(p) {
    var id = (p && (p.id || p.slug)) || 'project';
    return 'project.html?id=' + encodeURIComponent(id);
  }

  function build(p) {
    var li = el('li', 'card');
    if (p.featured) li.classList.add('is-featured');

    if (p.featured) li.appendChild(el('p', 'eyebrow', t('projects.featured')));

    var shownTitle = tv(p.title) || p.title || '';
    var heading = el('h3', 'card-title');
    var link = el('a', 'card-link', shownTitle);
    link.href = detailHref(p);
    /* the title link IS the open-details action; the label says so for
       screen readers instead of reading the bare title twice */
    link.setAttribute('aria-label', shownTitle + ' — ' + t('projects.viewProject'));
    heading.appendChild(link);
    li.appendChild(heading);

    /* A brand stays in the script its owner writes it in. `tv` returns the
       localised title, so the Latin line only appears where the two differ
       (i.e. on the Arabic page), isolated RTL exactly like a social name. */
    if (p.brand && p.brand !== shownTitle) li.appendChild(el('p', 'card-brand', p.brand));

    var summary = tv(p.summary) || p.summary || tv(p.description) || p.description;
    if (summary) li.appendChild(el('p', 'card-text', summary));

    /* The tech tags reuse the existing mono metadata recipe — the same
       one the volunteering records use — instead of inventing a chip. */
    var tags = p.tags || [];
    if (tags.length) {
      var meta = el('p', 'record-meta');
      tags.forEach(function (tag) {
        var label = tv(tag);
        if (label) meta.appendChild(el('span', null, label));
      });
      li.appendChild(meta);
    }

    if (p.image) {
      var img = document.createElement('img');
      img.src = 'academic/' + String(p.image).replace(/^academic\//, '');
      var altTitle = tv(p.title) || p.title;
      img.alt = altTitle ? altTitle + ' — ' + t('projects.screenshot') : t('projects.screenshotDefault');
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:auto;border-radius:9px;margin-block-start:16px';
      li.appendChild(img);
    }

    if (p.url) {
      var link2 = el('a', 'record-action', t('projects.visit'));
      link2.href = p.url;
      link2.target = '_blank';
      link2.rel = 'noopener noreferrer';
      li.appendChild(link2);
    }

    return li;
  }

  window.ProjectCard = { build: build, detailHref: detailHref };
})();