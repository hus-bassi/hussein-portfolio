/* ============================================================
   PROJECTS-PAGE — behaviour for projects.html and project.html.
   Renders from academic/data/projects.js (window.projectsData):

     · projects.html?id-free  the running count + the card list
     · project.html?id=<id>   the full engineering detail page

   The one card recipe lives in project-card.js; this file only decides
   WHICH project(s) to show and WHERE they go. Everything renders in the
   CURRENT language and re-renders on site-lang-change, and every newly
   added section is handed to the reveal engine after rendering — the
   same contract site.js and records.js follow.
   ============================================================ */
(function () {
  'use strict';

  var page = document.body && document.body.getAttribute('data-page');

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

  /* The word under the count numeral, in the current language. The three
     plural rules are real: Arabic counts 2 as a dual and 11+ as one form,
     Russian has its 1/2-4/5+ split with the 11-14 exception. */
  function countLabel(n) {
    var l = lang();
    if (l === 'en') return n === 1 ? 'Project' : 'Projects';
    if (l === 'ru') {
      var m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return 'проект';
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'проекта';
      return 'проектов';
    }
    if (n === 1) return 'مشروع';
    if (n === 2) return 'مشروعان';
    if (n >= 3 && n <= 10) return 'مشاريع';
    return 'مشروعًا';
  }

  /* the count derives from projectsData.length — never a hand-written 01 */
  function renderCount() {
    var num = document.getElementById('projects-count-num');
    var label = document.getElementById('projects-count-label');
    if (!num || !label) return;
    var n = (window.projectsData || []).length;
    num.textContent = (n < 10 ? '0' : '') + n;
    label.textContent = countLabel(n);
  }

  function renderList() {
    var list = document.getElementById('projects-list');
    if (!list) return;
    var projects = window.projectsData || [];
    list.innerHTML = '';
    list.hidden = !projects.length;
    var none = document.getElementById('projects-none');
    if (none) none.hidden = projects.length > 0;
    projects.forEach(function (p) {
      if (window.ProjectCard) list.appendChild(window.ProjectCard.build(p));
    });
  }

  /* ---------- project.html ---------- */
  function findProject(id) {
    var projects = window.projectsData || [];
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === id || projects[i].slug === id) return projects[i];
    }
    return null;
  }

  function resolveId() {
    var m = /(?:^|[?&])id=([^&#]+)/.exec(location.search);
    if (!m) return '';
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  }

  function setHead(head, project, notFound) {
    if (!head) return;
    var eyebrow = head.querySelector('#proj-eyebrow');
    var title = head.querySelector('#proj-title');
    var brand = head.querySelector('#proj-brand');
    var intro = head.querySelector('#proj-intro');
    var visit = head.querySelector('#proj-visit');
    if (eyebrow) eyebrow.textContent = notFound ? t('projects.pageTitle') : t('projects.featured');
    if (title) title.textContent = notFound ? t('projects.notFound.title') : (tv(project.title) || project.title || '');
    if (brand) {
      brand.textContent = notFound ? '' : (project.brand || '');
      brand.hidden = notFound || !project.brand;
    }
    if (intro) intro.textContent = notFound ? t('projects.notFound.text') : tv(project.details && project.details.intro) || '';
    if (visit) visit.hidden = notFound;
  }

  function renderDetail() {
    var head = document.getElementById('proj-head');
    var content = document.getElementById('proj-content');
    if (!content) return;

    var project = findProject(resolveId());
    content.innerHTML = '';
    setHead(head, project, !project);

    if (!project) {
      var notFound = el('section', 'band');
      var nfShell = el('div', 'shell');
      var nfText = el('p', 'no-match', t('projects.notFound.text'));
      nfText.setAttribute('data-reveal', 'up');
      nfShell.appendChild(nfText);
      var back = el('a', 'sec-more', t('projects.back'));
      back.href = 'projects.html';
      nfShell.appendChild(back);
      notFound.appendChild(nfShell);
      content.appendChild(notFound);
      armReveals(content);
      return;
    }

    var blocks = (project.details && project.details.blocks) || [];
    if (!blocks.length) {
      var empty = el('section', 'band');
      var eShell = el('div', 'shell');
      var eText = el('p', 'no-match', t('projects.empty'));
      eText.setAttribute('data-reveal', 'up');
      eShell.appendChild(eText);
      empty.appendChild(eShell);
      content.appendChild(empty);
      armReveals(content);
      return;
    }

    /* One band per engineering group, alternating like every other page,
       with a sec-head so UI.sectionIndex numbers them 01..07 in order. */
    blocks.forEach(function (b, i) {
      var section = el('section', i % 2 === 1 ? 'band' : 'band band-alt');
      var shell = el('div', 'shell');
      var heading = el('header', 'sec-head');
      heading.setAttribute('data-reveal', 'line');
      heading.appendChild(el('h2', null, tv(b.h) || ''));
      shell.appendChild(heading);
      if (tv(b.p)) {
        var para = el('p', 'proj-text', tv(b.p));
        para.setAttribute('data-reveal', 'up');
        shell.appendChild(para);
      }
      if (b.items && b.items.length) {
        var list = el('ul', 'proj-list');
        list.setAttribute('data-reveal', 'up');
        b.items.forEach(function (item) {
          var label = tv(item);
          if (label) list.appendChild(el('li', null, label));
        });
        shell.appendChild(list);
      }
      section.appendChild(shell);
      content.appendChild(section);
    });

    /* closing actions after the last group: visit + back to the list */
    var end = el('section', blocks.length % 2 === 0 ? 'band band-alt' : 'band');
    var endShell = el('div', 'shell');
    var actions = el('p', 'proj-actions');
    actions.setAttribute('data-reveal', 'up');
    if (project.url) {
      var visit = el('a', 'btn btn-primary', t('projects.visit'));
      visit.href = project.url;
      visit.target = '_blank';
      visit.rel = 'noopener noreferrer';
      actions.appendChild(visit);
    }
    var back2 = el('a', 'sec-more', t('projects.back'));
    back2.href = 'projects.html';
    actions.appendChild(back2);
    endShell.appendChild(actions);
    end.appendChild(endShell);
    content.appendChild(end);

    armReveals(content);
    if (window.UI) UI.sectionIndex(content);
  }

  /* Newly added markup gets the reveal treatment after every render. */
  function armReveals(root) {
    if (!window.Reveal) return;
    if (page === 'projects') Reveal.resolve(root);
    else Reveal.scan(root);
  }

  /* The head title and Open Graph fields are the one thing i18n.js owns:
     its apply() runs at DOMContentLoaded and would overwrite anything set
     earlier. So the content renders immediately, and the meta is synced
     AFTER apply() — on DOMContentLoaded when the document is still
     loading, at once otherwise (and again on every language change). */
  function syncMeta() {
    var project = findProject(resolveId());
    var title = (project ? (tv(project.title) || project.title || '') : t('projects.notFound.title')) + ' | ' + t('brand.name');
    document.title = title;
    var ogT = document.querySelector('meta[property="og:title"]');
    var ogD = document.querySelector('meta[property="og:description"]');
    if (ogT) ogT.setAttribute('content', title);
    if (ogD) ogD.setAttribute('content', project ? t('meta.project.desc') : t('projects.notFound.text'));
  }

  if (page === 'projects') {
    renderCount();
    renderList();
    armReveals(document.getElementById('projects-list') || document);
  } else if (page === 'project') {
    renderDetail();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncMeta);
    } else {
      syncMeta();
    }
  }

  document.addEventListener('site-lang-change', function () {
    if (page === 'projects') {
      renderCount();
      renderList();
      armReveals(document.getElementById('projects-list') || document);
    } else if (page === 'project') {
      renderDetail();
      syncMeta();
    }
  });
})();