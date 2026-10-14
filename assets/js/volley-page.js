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
        var board = el('div', 'vw-scoreboard style-comic-action style-split-flap');
        board.appendChild(el('div', 'comic-rays'));

        /* Fixture line if team and opponent exist in documented data */
        if (r.team && r.opponent) {
          var fix = el('div', 'vw-fixture-line');
          fix.appendChild(el('span', 'vw-team-name', tv(r.team)));
          fix.appendChild(el('span', 'vw-fixture-vs', 'VS'));
          fix.appendChild(el('span', 'vw-team-name is-opp', tv(r.opponent)));
          board.appendChild(fix);
        }

        var scoreLine = el('div', 'vw-score-line');
        scoreLine.appendChild(el('span', 'vw-score-num split-flap-digit', won));
        scoreLine.appendChild(el('span', 'vw-score-sep', '—'));
        scoreLine.appendChild(el('span', 'vw-score-num is-lost split-flap-digit', lost));
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

      if (r.images && r.images.length) {
        var gal = el('div', 'vw-tgal');
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

    /* The rebuilt list goes back through the reveal engine: page.js armed
       this <ul> while it was still EMPTY (this script runs after it), so a
       fresh scan would skip the group. resolve() re-deals with it whatever
       its armed state — the new children get armed, the ones on screen
       settle, the ones below the fold are watched. A swap, not an arrival. */
    if (window.Reveal) Reveal.resolve(list);
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
