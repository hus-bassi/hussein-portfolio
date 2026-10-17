/* ============================================================
   VOLLEY-PAGE — the volleyball page: the tournament cards, the
   honest count, and the figure slot.

   The page owns no facts. Every visible string comes from
   academic/data/volleyball.js (the same source the sports grid
   reads) or the i18n dictionary in the CURRENT language, and the
   whole list re-renders on `site-lang-change` — exactly like the
   certificates and the volunteering records. The card recipe
   (.vw-tcard and friends) lives in assets/css/volleyball.css, the
   page's own layer; site.css knows nothing about this page.

   Media paths in the data are written relative to the academic/
   folder, so a root-level page resolves them the way records.js
   does: an academic/ prefix is added, a leading `../` is stripped
   (this file sits at the project root), and absolute / https:
   paths are handed through untouched.
   ============================================================ */
(function () {
  'use strict';

  var list = document.getElementById('vw-tlist');
  var count = document.getElementById('vw-tcount');
  var slot = document.querySelector('[data-volleyball-character]');
  var data = (typeof window !== 'undefined') && window.volleyballData;

  /* The transparent cut-out of the athlete. It has not been drawn yet, and
     this page never invents a portrait: while this is empty the slot shows
     its aura and its frame, and the moment a real file exists its path is
     dropped in here (or passed to VolleyWorld.setCharacter at runtime). */
  var ASSETS = { character: '' };

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
    i.decoding = 'async';
    return i;
  }

  function render() {
    /* the count is the real number of tournaments in the data — never a
       number typed twice */
    if (count && data && data.length != null) count.textContent = String(data.length);
    if (!list || !data || !data.length) return;

    list.textContent = '';

    data.forEach(function (r) {
      var li = el('li', 'vw-tcard');

      if (r.image) {
        var fig = el('figure', 'vw-tcover');
        fig.appendChild(img(mediaPath(r.image), tv(r.title)));
        if (r.images && r.images.length) {
          fig.style.cursor = 'pointer';
          fig.setAttribute('title', t('vp.viewGallery'));
          fig.addEventListener('click', function () { openGallery(r); });
        }
        li.appendChild(fig);
      }

      var body = el('div', 'vw-tbody');

      /* Club / Center badge if present in data */
      if (r.badge) {
        body.appendChild(el('span', 'vw-tbadge', tv(r.badge)));
      }

      body.appendChild(el('h3', 'vw-ttitle', tv(r.title)));

      /* meta line: date, location (no result here — it gets its own visual) */
      var meta = el('p', 'vw-tmeta');
      [tv(r.date), tv(r.location)].forEach(function (m) {
        if (m) meta.appendChild(el('span', null, m));
      });
      if (meta.childNodes.length) body.appendChild(meta);

      /* Scoreboard vs Podium badge:
         If result contains a score pattern like "3–0" / "3–صفر", render
         a dedicated match scoreboard with fixture line.
         Otherwise render a sports podium badge (e.g. 3rd Place).
         Only verified data is used. */
      var resultText = tv(r.result);
      var scoreMatch = resultText.match(/(\d+)\s*[–\-—]\s*(\d+|صفر)/);
      if (scoreMatch) {
        var won = scoreMatch[1];
        var lost = scoreMatch[2] === 'صفر' ? '0' : scoreMatch[2];
        var board = el('div', 'vw-scoreboard');

        /* Fixture line if team and opponent exist in documented data */
        if (r.team && r.opponent) {
          var fix = el('div', 'vw-fixture-line');
          fix.appendChild(el('span', 'vw-team-name', tv(r.team)));
          fix.appendChild(el('span', 'vw-fixture-vs', 'VS'));
          fix.appendChild(el('span', 'vw-team-name is-opp', tv(r.opponent)));
          board.appendChild(fix);
        }

        var scoreLine = el('div', 'vw-score-line');
        scoreLine.appendChild(el('span', 'vw-score-num', won));
        scoreLine.appendChild(el('span', 'vw-score-sep', '—'));
        scoreLine.appendChild(el('span', 'vw-score-num is-lost', lost));
        scoreLine.appendChild(el('span', 'vw-score-tag', resultText));
        board.appendChild(scoreLine);

        body.appendChild(board);
      } else if (resultText) {
        var podium = el('div', 'vw-podium-badge');
        podium.appendChild(el('span', 'vw-podium-icon', '🥉'));
        podium.appendChild(el('span', 'vw-podium-text', resultText));
        body.appendChild(podium);
      }

      if (r.description) body.appendChild(el('p', 'vw-ttext', tv(r.description)));

      /* Athlete development takeaway from verified data */
      if (r.whatILearned) {
        var take = el('div', 'vw-takeaway');
        take.appendChild(el('span', 'vw-takeaway-lbl', t('rec.d.takeaway')));
        take.appendChild(el('p', 'vw-takeaway-txt', tv(r.whatILearned)));
        body.appendChild(take);
      }

      /* View Album Button — opens full tournament photo gallery */
      if (r.images && r.images.length) {
        var albumBtn = el('button', 'btn btn-outline vw-album-btn');
        albumBtn.type = 'button';
        albumBtn.setAttribute('aria-haspopup', 'dialog');
        albumBtn.appendChild(el('span', null, '📷 ' + t('vp.viewGallery') + ' (' + r.images.length + ' ' + t('vp.photos') + ')'));
        albumBtn.addEventListener('click', function () { openGallery(r); });
        body.appendChild(albumBtn);
      }

      /* a real tournament certificate is a document, not a claim: when the
         data has one it opens in a new tab, rel="noopener" */
      if (r.certificate) {
        var cert = el('a', 'record-action', t('vp.certView'));
        cert.href = mediaPath(r.certificate);
        cert.target = '_blank';
        cert.rel = 'noopener noreferrer';
        body.appendChild(cert);
      }
      li.appendChild(body);

      list.appendChild(li);
    });

    /* The rebuilt list goes back through the reveal engine: page.js armed
       this <ul> while it was still EMPTY (this script runs after it), so a
       fresh scan would skip the group. resolve() re-deals with it whatever
       its armed state — the new children get armed, the ones on screen
       settle, the ones below the fold are watched. A swap, not an arrival. */
    if (window.Reveal) Reveal.resolve(list);
  }

  /* -------------------------------------------------------------
     Tournament Photo Lightbox & Album Modal
     ------------------------------------------------------------- */
  var viewer = null;
  var currentGalleryItems = [];
  var currentGalleryIndex = 0;

  function ensureViewer() {
    if (viewer) return viewer;
    viewer = document.createElement('dialog');
    viewer.className = 'vw-gallery-dialog';
    viewer.setAttribute('aria-modal', 'true');
    viewer.innerHTML =
      '<div class="vw-dialog-panel">' +
        '<header class="vw-dialog-head">' +
          '<div class="vw-dialog-title-wrap">' +
            '<p class="vw-dialog-kicker"></p>' +
            '<h3 class="vw-dialog-title"></h3>' +
          '</div>' +
          '<button type="button" class="vw-dialog-close" aria-label="إغلاق">&times;</button>' +
        '</header>' +
        '<div class="vw-dialog-body">' +
          '<div class="vw-lightbox-frame">' +
            '<div class="vw-lightbox-img-wrap">' +
              '<img class="vw-lightbox-img" alt="" />' +
            '</div>' +
            '<div class="vw-lightbox-bar">' +
              '<p class="vw-lightbox-caption"></p>' +
              '<div class="vw-lightbox-controls">' +
                '<button type="button" class="vw-lightbox-btn is-prev" aria-label="السابق">&#8592;</button>' +
                '<span class="vw-lightbox-count">1 / 1</span>' +
                '<button type="button" class="vw-lightbox-btn is-next" aria-label="التالي">&#8594;</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="vw-gallery-strip"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(viewer);

    var closeBtn = viewer.querySelector('.vw-dialog-close');
    closeBtn.addEventListener('click', function () { viewer.close(); });
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer) viewer.close();
    });

    var prevBtn = viewer.querySelector('.is-prev');
    var nextBtn = viewer.querySelector('.is-next');
    prevBtn.addEventListener('click', function () {
      showPhoto(currentGalleryIndex - 1);
    });
    nextBtn.addEventListener('click', function () {
      showPhoto(currentGalleryIndex + 1);
    });

    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showPhoto(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showPhoto(currentGalleryIndex + 1);
      if (e.key === 'Escape') viewer.close();
    });

    return viewer;
  }

  function showPhoto(idx) {
    if (!currentGalleryItems.length) return;
    if (idx < 0) idx = currentGalleryItems.length - 1;
    if (idx >= currentGalleryItems.length) idx = 0;
    currentGalleryIndex = idx;

    var item = currentGalleryItems[idx];
    var v = ensureViewer();
    var imgEl = v.querySelector('.vw-lightbox-img');
    var capEl = v.querySelector('.vw-lightbox-caption');
    var countEl = v.querySelector('.vw-lightbox-count');
    var thumbs = v.querySelectorAll('.vw-strip-thumb');

    imgEl.src = item.src;
    imgEl.alt = item.caption || '';
    capEl.textContent = item.caption || '';
    countEl.textContent = (idx + 1) + ' / ' + currentGalleryItems.length;

    thumbs.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === idx);
    });
  }

  function openGallery(r) {
    var v = ensureViewer();
    var kicker = v.querySelector('.vw-dialog-kicker');
    var title = v.querySelector('.vw-dialog-title');
    var strip = v.querySelector('.vw-gallery-strip');

    kicker.textContent = t('vp.galleryTitle') + (r.badge ? ' • ' + tv(r.badge) : '');
    title.textContent = tv(r.title);

    currentGalleryItems = [];
    if (r.image) {
      currentGalleryItems.push({
        src: mediaPath(r.image),
        caption: tv(r.title) + ' — ' + (lang() === 'ar' ? 'غلاف البطولة' : lang() === 'ru' ? 'Обложка турнира' : 'Tournament Cover')
      });
    }
    if (r.images && r.images.length) {
      r.images.forEach(function (g) {
        currentGalleryItems.push({
          src: mediaPath(g.src),
          caption: tv(g.caption) || tv(r.title)
        });
      });
    }
    if (r.certificate) {
      currentGalleryItems.push({
        src: mediaPath(r.certificate),
        caption: t('vp.certView')
      });
    }

    strip.innerHTML = '';
    currentGalleryItems.forEach(function (item, i) {
      var btn = el('button', 'vw-strip-thumb');
      btn.type = 'button';
      btn.setAttribute('aria-label', item.caption || ('Photo ' + (i + 1)));
      var thumbImg = img(item.src, item.caption);
      btn.appendChild(thumbImg);
      btn.addEventListener('click', function () { showPhoto(i); });
      strip.appendChild(btn);
    });

    showPhoto(0);
    if (typeof v.showModal === 'function') {
      v.showModal();
    } else {
      v.setAttribute('open', '');
    }
  }

  /* Drop a transparent cut-out into [data-volleyball-character]. The aura,
     the frame and the layout are already there; this only adds the figure. */
  function setCharacter(src) {
    if (!slot || !src) return;
    slot.textContent = '';
    var i = document.createElement('img');
    i.className = 'vw-char-img';
    i.alt = '';
    i.decoding = 'async';
    i.addEventListener('load', function () { i.classList.add('is-set'); });
    i.src = src;
    slot.appendChild(i);
  }

  window.VolleyWorld = { setCharacter: setCharacter };

  if (ASSETS.character) setCharacter(ASSETS.character);

  render();
  document.addEventListener('site-lang-change', render);
})();
