/* ============================================================
   Records page — instant search + tag filtering, trilingual
   · haystack indexes ALL three languages, so a query matches no
     matter which UI language is active
   · display language follows the global switcher (ar / en / ru)
   · results appear as you type; no Enter, no button
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

  /* Image and PDF paths in the data are written relative to academic/ (see
     the note at the top of academic/data/certificates.js), because that is
     where the other certificates' files live. A path that starts with `../`
     is ALREADY relative to the project root, which is where the DataCamp
     certificate's own image and PDF are — those two files were left exactly
     where they were placed, and this is the whole of the accommodation. */
  function mediaPath(p) {
    if (!p) return '';
    var s = String(p);
    if (/^(\.\.\/|\/|https?:)/i.test(s)) return s;
    return 'academic/' + s.replace(/^academic\//, '');
  }
  function fileName(url) {
    return String(url).split('/').pop();
  }

  /* ---------- the details model ----------
     One optional shape, and it is built ONLY from fields the record
     already has. `details` in the data is the single exception and it is
     optional too, so a certificate without it simply produces fewer
     sections — no placeholder, no "N/A", no heading over nothing.

     Nothing here is a claim. There is no `learningOutcomes` and no
     personal takeaway anywhere in this function, because no record in the
     project states one: a neutral "what the course covered" list is the
     accurate form, and an activity's own `whatILearned` is shown only
     because Hussein wrote it in events.js. */
  /* A list in the data can arrive three ways: an array of plain strings, an
     array of objects, or a single {en: [ … ]} wrapper holding the array per
     language. This resolves the CONTAINER only and hands the elements back
     untouched, because only the caller knows which field inside an element
     to read — a chapter is `{title}` and a resource is `{label, url}`, and
     a helper that localised the element would return '' for both. */
  function listOf(v) {
    if (!v) return [];
    var list = Array.isArray(v) ? v : tv(v);
    if (typeof list === 'string') return list ? [list] : [];
    return Array.isArray(list) ? list : [];
  }
  function buildDetail(c) {
    var d = c.details || {};
    return {
      /* the record's own narrative fields, reused — never re-invented */
      overview: tv(c.description),
      role: tv(c.role),
      location: tv(c.location),
      organisation: tv(c.organization),
      whatIDid: tv(c.whatIDid),
      takeaway: tv(c.whatILearned),
      skills: (c.skills || []).map(function (s) { return tv(s); }).filter(Boolean),
      /* the optional course detail, in the data, for the record that has it */
      topics: listOf(d.topics),
      chapters: listOf(d.chapters).map(function (ch) {
        return { title: tv(ch && ch.title ? ch.title : ch), note: tv(ch && ch.note) };
      }).filter(function (ch) { return ch.title; }),
      resources: listOf(d.resources).map(function (r) {
        return { label: tv(r && r.label ? r.label : r), url: (r && r.url) || '' };
      }).filter(function (r) { return r.label; }),
      collaborators: listOf(d.collaborators),
      /* the volunteering gallery is real data in events.js and was never
         shown anywhere; the details view is where it belongs */
      gallery: (c.images || []).map(function (g) {
        return { src: mediaPath(g.src), caption: tv(g.caption) };
      }).filter(function (g) { return g.src; })
    };
  }

  function buildCerts() {
    return (window.certificatesData || []).map(function (c) {
      var tags = Array.isArray(c.tags) ? c.tags : [];
      var l = lang();
      return index({
        title: tv(c.title),
        titlePlain: tv(c.title),
        meta: [tv(c.provider), tv(c.date), tv(c.category)].filter(Boolean).join(' · '),
        /* the two fields the details view needs as their own facts rather
           than as a sentence, because they are facts there */
        metaPlain: tv(c.provider),
        datePlain: tv(c.date),
        body: tv(c.description),
        duration: tv(c.duration),
        credentialId: c.credentialId || '',
        /* Every record gets the media area. What goes IN it is the
           resolver's decision, and for a record with no media at all it is a
           designed placeholder — so a card is never missing a piece. */
        preview: true,
        detail: buildDetail(c),
        tags: tags,
        tagsText: tags.map(tagLabel).join(' '),
        hayAll: [
          allLangs(c.title), allLangs(c.provider), allLangs(c.date),
          allLangs(c.category), allLangs(c.description),
          allLangs(c.duration), c.credentialId || '',
          tags.map(function (sg) {
            var e = TAGS[sg] || {};
            return [e.ar, e.en, e.ru].filter(Boolean).join(' ');
          }).join(' ')
        ].join('  '),
        link: certLink(c),
        actionKey: 'rec.viewCert',
        kind: 'certificate',
        image: mediaPath(tv(c.image)),
        pdf: mediaPath(tv(c.pdf)),
        video: mediaPath(tv(c.videoUrl)),
        _lang: l
      });
    });
  }

  /* Volunteering records come from the shared events model, which already
     carries the same media fields as the certificates — `image`, `images`,
     `certificate` and `videoUrl` — plus the narrative fields. It is mapped
     onto the SAME shape a certificate produces, so the media resolver and
     the card below have exactly one shape to understand, and an activity
     with a video and no image renders its video without a single line of
     record-specific code. */
  function buildVolunteering() {
    return (window.eventsData || [])
      .filter(function (e) { return e.type === 'volunteering'; })
      .map(function (e) {
        /* the volunteering certificate photo, if the record has one */
        var cert = (e.images || []).map(function (i) { return i.src; })
          .filter(function (s) { return /certificate/i.test(s); })[0] || e.certificate;
        var hasCert = cert && /certificate/i.test(cert) && !e.videoUrlOnly;
        var skillsAll = (e.skills || []).map(allLangs).join(' ');
        return index({
          title: tv(e.title),
          titlePlain: tv(e.title),
          meta: [tv(e.organization), tv(e.role), tv(e.date)].filter(Boolean).join(' · '),
          metaPlain: tv(e.organization),
          datePlain: tv(e.date),
          body: tv(e.description),
          duration: '',
          credentialId: '',
          /* One preview per record, by DATA: the events model marks its
             certificate photo with the word "certificate" in the filename,
             so the media resolver can never mistake a certificate for a
             cover photo. */
          preview: true,
          kind: 'volunteering',
          detail: buildDetail(e),
          image: mediaPath(tv(e.image)),
          pdf: '',
          video: tv(e.videoUrl) || '',
          link: hasCert ? mediaPath(cert) : '',
          actionKey: 'rec.viewVolCert',
          tags: ['volunteering'],
          tagsText: (e.skills || []).map(function (s) { return tv(s); }).filter(Boolean).join(' '),
          hayAll: [
            allLangs(e.title), allLangs(e.organization), allLangs(e.role),
            allLangs(e.date), allLangs(e.description), skillsAll,
            tv(e.location), tv(e.videoUrl),
            [TAGS.volunteering.ar, TAGS.volunteering.en, TAGS.volunteering.ru].join(' ')
          ].join('  ')
        });
      });
  }

  /* ============================================================
     THE MEDIA RESOLVER.

     One function decides what a record shows, and the answer is always the
     same four steps in the same order:

         1. an IMAGE      the primary visual, at its own ratio, uncropped
         2. a VIDEO       when there is no image — including an activity
                          whose only evidence is a video
         3. a DOCUMENT    when there is neither, and a PDF exists: a
                          designed document frame, never the PDF inline
         4. a PLACEHOLDER when a record has no media at all

     Nothing above this function knows what a certificate is, and nothing
     in it names a record. The Russian House activity has a photo and a
     video and shows the photo; the chess activity has only a video and
     shows the video. Neither fact is written anywhere except the data.

     A video is a YouTube link or a file. A YouTube link becomes an embed
     in the existing viewer; a file becomes a <video> with controls. There
     are no local video files in the project today, so the file branch is
     the shape the system will use the moment one is added.
     ============================================================ */
  function youTubeId(url) {
    if (!url) return '';
    var s = String(url);
    if (!/youtu\.?be/.test(s)) return '';
    var m = s.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{6,})/);
    return m ? m[1] : '';
  }

  /* ============================================================
     THE POSTER — YouTube's own frame for that exact video.

     A record whose only evidence is a video used to render an empty
     violet rectangle with a play glyph on it: a control shaped like a
     video, showing nothing. YouTube already publishes a still for
     every video, at a fixed address derived from the id the record
     already stores, so the fix is to ASK FOR IT rather than to invent
     one: nothing here is authored, cropped or associated by hand, and
     a record with no video gets no poster at all.

     `hqdefault` is the one that is always there. `maxresdefault` is
     better and is 404 for a large share of uploads, so a chain through
     it would be an extra request on every miss; `hqdefault` is 480x360
     and exists for anything you can watch. It is 4:3 with black bars
     top and bottom, which `object-fit: cover` on a 16:9 frame crops
     away exactly — the frame is already 16:9, so the crop is free and
     the letterbox is the only thing lost.

     Not a fabricated poster: if YouTube has nothing, `error` sends the
     record down the same chain a dead image already took, and it lands
     on the designed placeholder. */
  function youTubePoster(url) {
    var id = youTubeId(url);
    return id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : '';
  }

  /* A picture ARRIVES: the hidden state is opted into by this function, and
     only ever by this function.

     `.shot-media` is added immediately before `src` is set, so the class is
     always in place before the browser has anything to paint, and a browser
     that never runs this file simply never gets the class — the image is
     then visible from its first frame rather than permanently invisible.
     The two halves use the element's own state for the same reason: an
     image served from cache is already `complete` before the listener is
     attached, and an event-only recipe leaves those at opacity 0 forever.
     `naturalWidth` is the discriminator — a failed image is also
     `complete`, and it has no width. */
  function fadeIn(img) {
    img.classList.add('shot-media');
    if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
  }

  function isRemote(u) { return /^(https?:)?\/\//i.test(String(u || '')); }

  function resolveRecordMedia(rec) {
    var yt = youTubeId(rec.video);
    var order = [
      /* 1 — an image, local or remote */
      { kind: 'image', src: rec.image },
      /* 2 — a video: a YouTube link, or any other video URL */
      { kind: 'video', video: rec.video, embed: yt ? 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0' : '', src: yt ? '' : rec.video, poster: youTubePoster(rec.video) },
      /* 3 — the official document, as a designed frame rather than a render */
      { kind: 'document', src: rec.pdf },
      /* 4 — nothing, which is a designed state and not a broken one */
      { kind: 'none', src: '' }
    ];
    var found = order[3];
    for (var i = 0; i < order.length; i++) {
      var c = order[i];
      if (c.kind === 'image' && c.src) { found = c; break; }
      if (c.kind === 'video' && (c.embed || c.src)) { found = c; break; }
      if (c.kind === 'document' && c.src) { found = c; break; }
    }
    found.alt = mediaAlt(rec);
    return found;
  }
  function mediaAlt(rec) {
    return rec.titlePlain + (rec.credentialId ? ' — ' + rec.credentialId : '');
  }

  /* What a record's MEDIA FRAME opens, decided by what the media IS and
     never by what the record also happens to have.

     An image opens the IMAGE viewer. That is the whole point of the
     separation, and it is also a bug fix: this used to send an image click
     to the record's document, so a browser that cannot embed a PDF in an
     iframe — which is most of them outside desktop Chrome — handed the
     request to the download manager, and a visitor inspecting a
     certificate got a download they never asked for. The document is now
     reachable only through its own action, where it belongs.

     A video opens the video. A document frame opens the document. A record
     with no media has no control at all. */
  function opensFor(rec, m) {
    if (m.kind === 'image') return m;
    if (m.kind === 'video' || m.kind === 'document') return m;
    return null;
  }

  /* The media area is a BUTTON only when it does something. A record whose
     image is the whole of its evidence still opens the image viewer, so
     the only frame that is not a control is a frame with no media. */
  function mediaFrame(rec, m) {
    var openable = opensFor(rec, m);
    var el2 = openable ? document.createElement('button') : document.createElement('div');
    var btn = el2;
    if (openable) btn.type = 'button';
    /* The image state keeps the bare class, so the approved certificate card
       is byte-for-byte what it was; the other three states add a modifier,
       written as literals so css-audit can see them. */
    var MODIFIER = { video: 'is-video', document: 'is-document', none: 'is-none' };
    btn.className = 'record-shot' + (MODIFIER[m.kind] ? ' ' + MODIFIER[m.kind] : '');
    if (openable) {
      var label = m.kind === 'image' ? t('rec.viewImage')
                : m.kind === 'video' ? t('rec.watchVideo') : t('rec.openCert');
      btn.setAttribute('aria-label', label + ' — ' + rec.titlePlain);
      btn.addEventListener('click', function () { openMedia(rec, openable); });
    }

    if (m.kind === 'image') {
      var img = document.createElement('img');
      img.src = m.src;
      img.alt = m.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      /* No aspect-ratio here, and no layout math: the mount is sized by the
         media itself (width: fit-content, and a responsive ceiling on the
         image), so a portrait scan comes out a narrow tall mount and a
         landscape one a wide short mount, with nothing to recompute and
         nothing to shift when the file lands. The image owns its ratio; the
         stylesheet owns the budget. */
      /* A dead path must never leave a broken icon in the card. The resolver
         picked this because it was first in the list, not because the file
         is there; if the browser says otherwise, the SAME record is re-rendered
         from the next step of the chain, and so on down to the placeholder. */
      img.addEventListener('error', function () { swapMediaDown(rec, btn, m); });
      btn.appendChild(img);
    } else if (m.kind === 'video') {
      var ytId = youTubeId(m.video);
      if (m.embed) {
        /* POSTER FIRST. The frame shows YouTube's own still for this video
           with a play control over it, so a record is recognisable from the
           list instead of from its title alone. Nothing is asked of YouTube
           beyond that one image: the embed is still only created on click,
           in the viewer, so a page of activities costs a page of thumbnails
           rather than a page of players.

           The poster is not trusted to exist. A dead one calls the same
           swapMediaDown a dead certificate image calls, so the worst case
           is the designed placeholder this branch used to always be. */
        if (m.poster) {
          var poster = document.createElement('img');
          poster.className = 'media-poster';
          poster.src = m.poster;
          poster.alt = '';
          poster.loading = 'lazy';
          poster.decoding = 'async';
          fadeIn(poster);
          poster.addEventListener('error', function () { swapMediaDown(rec, btn, m); });
          btn.appendChild(poster);
        }
        btn.appendChild(el('span', 'media-glyph', playGlyph()));
        btn.appendChild(el('span', 'media-kind', t('rec.watchVideo')));
      } else {
        var vid = document.createElement('video');
        vid.src = m.src;
        vid.preload = 'none';
        vid.controls = true;
        vid.setAttribute('aria-label', t('rec.watchVideo') + ' — ' + rec.titlePlain);
        vid.muted = true;
        btn.appendChild(vid);
      }
    } else if (m.kind === 'document') {
      btn.appendChild(el('span', 'media-glyph', docGlyph()));
      btn.appendChild(el('span', 'media-kind', t('rec.viewCert')));
    } else {
      btn.appendChild(el('span', 'media-glyph', emptyGlyph()));
      btn.appendChild(el('span', 'media-kind', t('rec.noMedia')));
    }
    if (rec.kind) {
      var tag = document.createElement('span');
      tag.className = 'media-badge';
      tag.textContent = kindLabel(rec.kind);
      btn.appendChild(tag);
    }
    return btn;
  }

  /* The chain, one step at a time: drop whatever failed and take the next.
     The order is the resolver's own, written out again here, so a record
     that loses its image still ends up on its video, its document, or the
     placeholder — in that order, and never on a broken icon. */
  function swapMediaDown(rec, oldBtn, failed) {
    var after = ['image', 'video', 'document', 'none'];
    after = after.slice(after.indexOf(failed.kind) + 1);
    var yt = youTubeId(rec.video);
    var candidates = [
      { kind: 'video', video: rec.video, embed: yt ? 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0' : '', src: '', poster: youTubePoster(rec.video) },
      { kind: 'document', src: rec.pdf },
      { kind: 'none', src: '' }
    ];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (after.indexOf(c.kind) === -1) continue;
      if (c.kind !== 'none' && !(c.embed || c.video || c.src)) continue;
      c.alt = mediaAlt(rec);
      if (oldBtn.parentNode) oldBtn.parentNode.replaceChild(mediaFrame(rec, c), oldBtn);
      return;
    }
  }

  function playGlyph() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 7.5l8 4.5-8 4.5z" fill="currentColor"/></svg>';
  }
  function docGlyph() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 3v4h4M10 12h6M10 15.5h6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
  }
  function emptyGlyph() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="12" rx="9" ry="9" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".5"/><ellipse cx="12" cy="12" rx="3.6" ry="9" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".35" transform="rotate(28 12 12)"/><circle cx="12" cy="12" r="1.4" fill="currentColor" opacity=".6"/></svg>';
  }
  /* The badge says what KIND of record this is, from the data. A type the
     vocabulary does not know falls back to the raw string, exactly as the
     events model documents. */
  function kindLabel(kind) {
    var known = { certificate: 'rec.kind.certificate', volunteering: 'rec.kind.volunteering' };
    if (known[kind]) return t(known[kind]);
    return String(kind || '');
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

  /* ---------- the one viewer ----------
     ONE <dialog> for the whole page, built the first time it is opened, and
     it serves all three kinds of evidence. <dialog> is used rather than a
     div and a backdrop because it brings the three things a hand-rolled
     modal always gets wrong: the focus trap, Escape, and the top layer —
     so the page behind cannot be scrolled, tabbed to, or reached by the
     reader, and the layout never jumps when it opens or closes.

       · an IMAGE     → the original file, at its own ratio, with a toolbar:
                        zoom, reset, and the ONLY download in the product
       · a VIDEO      → a YouTube embed (youtube-nocookie) or a <video>
       · a DOCUMENT   → an <iframe> on the real PDF

     The image is NOT rendered twice: the viewer holds one <img>, and each
     open re-points it at the file being inspected. The card's own thumbnail
     is a separate, lazy, small load; opening the viewer loads the full file
     once, on purpose. */
  var viewer = null;
  var ZOOM_MIN = 1, ZOOM_MAX = 4;
  /* WHERE "CLOSE" GOES, and it is one decision rather than three.
     The dialog has two modes — the details and a media stage — and the
     viewer can be opened from EITHER: a record card's thumbnail, or the
     certificate at the top of that record's own details. Closing the viewer
     must answer to where it was opened from: from a card it closes, because
     there is nothing behind it, and from the details it PUTS THE DETAILS
     BACK, because a visitor who closed a full-size certificate is asking
     the question "was I right about this record?" and dropping them onto the
     records list with the dialog gone throws that answer away.

     It is a stored record, not a boolean, because the details have to be
     re-rendered rather than merely un-hidden: the media stage owns the frame
     it emptied, so returning means rebuilding. Same dialog, same record, no
     second view and no history to keep. */
  var returnTo = null;

  function buildViewer() {
    var d = document.createElement('dialog');
    d.className = 'cert-dialog';
    d.innerHTML =
      '<div class="cert-panel">' +
        '<header class="cert-head">' +
          '<p class="cert-kicker"></p>' +
          '<h3 class="cert-title" id="cert-viewer-title"></h3>' +
          '<button type="button" class="cert-close" data-close>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
            '</svg>' +
          '</button>' +
        '</header>' +
        '<div class="cert-frame"></div>' +
        '<footer class="cert-foot">' +
          '<a class="btn btn-outline cert-open" target="_blank" rel="noopener noreferrer"></a>' +
          '<a class="record-action cert-dl"></a>' +
          '<div class="cert-tools" hidden>' +
            '<button type="button" class="zoom-btn" data-zoom="out">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 12h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
            '</button>' +
            '<span class="zoom-level" aria-live="polite">100%</span>' +
            '<button type="button" class="zoom-btn" data-zoom="in">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
            '</button>' +
            '<button type="button" class="zoom-btn" data-zoom="reset">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12a8 8 0 1 1 2.6 5.9M4 18v-5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<a class="record-action cert-save" download></a>' +
          '</div>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(d);
    d.querySelector('[data-close]').addEventListener('click', function () { closeViewer(); });
    d.addEventListener('click', function (e) { if (e.target === d) closeViewer(); });
    /* Escape is a close too, and it is the one a keyboard reaches first, so it
       has to answer to the same question. `preventDefault` only when there is
       a details to go back to: with nothing behind the viewer, Escape keeps
       the browser's own behaviour and the native close is left alone. */
    d.addEventListener('cancel', function (e) {
      if (!returnTo) return;
      e.preventDefault();
      closeViewer();
    });
    wireZoom(d);
    /* EVERY close path resets the state, so the next image always opens at
       1× and centred — including the browser's own Escape. The reset lives
       with the zoom state, because a function that only clears the DOM and
       not the numbers behind it resets the display and not the behaviour:
       the next image would silently open at whatever it was left at. */
    d.addEventListener('close', function () { d.resetZoom(); });
    return d;
  }

  /* The single exit. `viewer.close()` FIRST when returning, because the
     details re-render calls showModal() and a dialog that is already open
     throws — so the top layer is released and re-entered in the same
     gesture, and the native `close` event still fires and still resets the
     zoom. Nothing about zoom, pan, download, the PDF or the video is read or
     written here. */
  function closeViewer() {
    var back = returnTo;
    returnTo = null;
    if (!back) { viewer.close(); return; }
    viewer.close();
    openDetails(back);
  }

  /* ---------- zoom and pan, all of it event-driven ----------
     No animation loop and no Tick subscriber: a transform is written when
     something happens (a button, a wheel, a drag, a load, a resize) and the
     browser interpolates it. The transition is on the transform, so a zoom
     step eases; a drag turns the transition off for the duration of the
     gesture so the image tracks the pointer exactly.

     THE SCALE MODEL.
     CSS max-width/max-height alone is what CROPPED the landscape: the stage
     had no bounded height (flex + min-height:0 inside a max-height panel),
     so 84svh on the image exceeded the stage and the frame's overflow cut
     the right side off. The fix keeps that CSS as the pre-JS fallback and
     then writes the measured fit as EXPLICIT layout dimensions, so the box
     pan measures is already the fitted box:

       layout  w/h = natural × fitScale   (written inline, per image)
       transform   = translate(pan) scale(userZoom)

     · fitScale  = min(stageW / naturalW, stageH / naturalH, 1) — the whole
       document fits the stage on open, whatever its orientation. Never
       upscales: a small image stays at its natural size.
     · userZoom  = 1 … 4, shown as 100% … 400%. 100% means "fitted", not
       "native pixels", for exactly the large-landscape case above. */
  function fitScaleFor(naturalW, naturalH, stageW, stageH) {
    if (!(naturalW > 0) || !(naturalH > 0) || !(stageW > 0) || !(stageH > 0)) return 1;
    return Math.min(stageW / naturalW, stageH / naturalH, 1);
  }
  /* exposed for the static audit: the fit math is orientation-blind by
     construction, and the test proves portrait / landscape / square all
     fit without any record-specific branch */
  window.__fitScaleFor = fitScaleFor;
  function wireZoom(d) {
    var stage = d.querySelector('.cert-frame');
    var level = d.querySelector('.zoom-level');
    var z = 1, px = 0, py = 0, dragging = false, startX = 0, startY = 0;
    var natW = 0, natH = 0;
    /* The image element is REPLACED on every open, so it is looked up fresh
       each time rather than captured here. Capturing it at build time is
       the obvious mistake and it is a silent one: the element does not
       exist yet when the dialog is built, every handler would bail on a
       null, and the toolbar would look alive while doing nothing. */
    function img() { return d.querySelector('.cert-image'); }
    function bounds(el) {
      /* the image may never be dragged past the edge of the stage, so it
         can never be lost behind the panel or off the viewport. At zoom 1
         the layout box IS the fitted box (fitImage writes it explicitly),
         so the rect already is the truth — no raw-pixel math needed. */
      if (!el || !stage) return { x: 0, y: 0 };
      var s = stage.getBoundingClientRect();
      var i = el.getBoundingClientRect();
      var maxX = Math.max(0, (i.width - s.width) / 2);
      var maxY = Math.max(0, (i.height - s.height) / 2);
      return { x: Math.min(maxX, Math.abs(px)), y: Math.min(maxY, Math.abs(py)) };
    }
    function apply(animated) {
      var el = img();
      if (!el) return;
      stage.classList.toggle('is-dragging', animated === false);
      var b = bounds(el);
      px = (px < 0 ? -1 : 1) * b.x;
      py = (py < 0 ? -1 : 1) * b.y;
      el.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) scale(' + z.toFixed(3) + ')';
      if (level) level.textContent = Math.round(z * 100) + '%';
    }
    /* FIT, measured — not styled. Runs after the <img> has its natural size
       (on load, or immediately when cached) and after the dialog is open
       so the stage has a real box. The budget is the ACTUAL viewer chrome,
       measured live — never window.innerWidth/Height alone:
         width  = the stage's own content width (dialog-capped, real)
         height = the panel cap (92svh, the CSS rule) minus the measured
                  header + footer, so toolbar/padding/safe-areas are out.
       One orientation-blind min() covers portrait, landscape, square and
       whatever comes next. Deliberately NOT the stage rect's height: the
       frame is content-sized (flex + min/max-height), so its height depends
       on the image being fitted — measuring it would be circular. */
    function stageBudget() {
      var w = (stage && stage.clientWidth) || 0;
      if (!(w > 0) && stage) w = stage.getBoundingClientRect().width;
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      var cap = vh * 0.92;                       /* .cert-panel max-height */
      var chrome = 0;
      var head = d.querySelector('.cert-head');
      var foot = d.querySelector('.cert-foot');
      if (head) chrome += head.getBoundingClientRect().height;
      if (foot) chrome += foot.getBoundingClientRect().height;
      return { w: w, h: cap - chrome - 2 };      /* 2px: panel borders */
    }
    function fitImage(keepZoom) {
      var el = img();
      if (!el || !stage) return;
      var nw = el.naturalWidth || natW, nh = el.naturalHeight || natH;
      if (!(nw > 0) || !(nh > 0)) return;
      natW = nw; natH = nh;
      var b = stageBudget();
      if (!(b.w > 0) || !(b.h > 0)) return;
      var f = fitScaleFor(nw, nh, b.w, b.h);
      var fitW = Math.max(1, Math.floor(nw * f));
      var fitH = Math.max(1, Math.floor(nh * f));
      /* clamp to the stage's own CSS ceiling (its max-height, if any): the
         chrome math above is exact for header/footer, but on a short mobile
         viewport the CSS max-height is the tighter bound — never let the
         written box exceed the box the stage will actually be */
      try {
        var capH = parseFloat(window.getComputedStyle(stage).maxHeight);
        if (capH > 0 && fitH > capH) {
          fitH = Math.max(1, Math.floor(capH));
          fitW = Math.max(1, Math.floor(fitH * (nw / nh)));
        }
      } catch (e) { /* old engines: the min() fit already holds */ }
      /* the layout box becomes the fitted box: pan math, cursor-anchored
         zoom and the stage rect all agree from here on */
      el.style.width = fitW + 'px';
      el.style.height = fitH + 'px';
      if (!keepZoom) { z = 1; px = 0; py = 0; }
      apply(true);
    }
    d.fitImage = fitImage;
    /* Resize while open: re-baseline the fit, keep the visitor's relative
       level — a zoomed reader is never snapped back to 100% by a rotation.
       ResizeObserver watches the stage itself (dialog, split, orientation);
       window resize/orientationchange is the fallback for older engines. */
    if (typeof ResizeObserver !== 'undefined') {
      var fitRO = new ResizeObserver(function () {
        if (d.open && img()) fitImage(true);
      });
      fitRO.observe(stage);
    }
    window.addEventListener('resize', function () {
      if (d.open && img()) fitImage(true);
    });
    window.addEventListener('orientationchange', function () {
      if (d.open && img()) fitImage(true);
    });
    function setZoom(next, focusX, focusY) {
      var el = img();
      if (!el) return;
      var prev = z;
      z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
      if (z === prev) return;
      /* keep the point under the cursor, or the centre of the stage, still */
      var s = stage.getBoundingClientRect();
      var cx = focusX != null ? focusX - s.left - s.width / 2 : 0;
      var cy = focusY != null ? focusY - s.top - s.height / 2 : 0;
      var k = z / prev;
      px = cx - (cx - px) * k;
      py = cy - (cy - py) * k;
      apply(true);
    }
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-zoom]');
      if (!b) return;
      e.preventDefault();
      var how = b.dataset.zoom;
      if (how === 'in') setZoom(z * 1.5);
      else if (how === 'out') setZoom(z / 1.5);
      else { z = 1; px = 0; py = 0; apply(true); }
    });
    stage.addEventListener('wheel', function (e) {
      /* THE WHEEL BELONGS TO WHATEVER IS UNDER THE CURSOR, and `stage` is
         not always the zoom surface. One element serves both modes: details
         relabels it `cert-frame detail-body` and it becomes the scrolling
         column. Cancelling the wheel BEFORE the guard — which is what this
         used to do, "prevent the page moving first, and unconditionally" —
         therefore cancelled the DETAILS' own scrolling, not the page's: in
         details mode there is no `.cert-image` at all, the guard below
         returned, the toolbar stayed hidden, and the wheel did nothing
         anywhere. The details could only be scrolled by dragging the
         scrollbar. So the cancel is stated where the zoom actually happens
         and nowhere else, and the handler does nothing at all in a mode
         that has no image to zoom. */
      if (!img()) return;
      e.preventDefault();
      setZoom(z * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
    }, { passive: false });
    stage.addEventListener('dblclick', function (e) {
      if (!img()) return;
      e.preventDefault();
      if (z > 1) { z = 1; px = 0; py = 0; apply(true); }
      else setZoom(2, e.clientX, e.clientY);
    });
    stage.addEventListener('pointerdown', function (e) {
      if (!img() || z <= 1) return;
      dragging = true; startX = e.clientX - px; startY = e.clientY - py;
      stage.classList.add('is-dragging');
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not all pointers can be captured */ }
      }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      px = e.clientX - startX; py = e.clientY - startY;
      apply(false);
    });
    var end = function (e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (e && e.pointerId != null && stage.hasPointerCapture && stage.hasPointerCapture(e.pointerId)) {
        stage.releasePointerCapture(e.pointerId);
      }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);

    /* the one place the state itself is reset, reachable from every close
       path, and the thing that makes a reopened image start clean */
    d.resetZoom = function () {
      z = 1; px = 0; py = 0; dragging = false;
      stage.classList.remove('is-dragging');
      /* transform only: the fitted layout dims STAY — they are the baseline
         Reset returns to, not state to clear. (The old image and its dims
         are discarded with frame.innerHTML on the next open anyway.) */
      var el = img();
      if (el) el.style.transform = '';
      if (level) level.textContent = '100%';
      apply(true);
    };
  }

  /* ---------- the details view: the SAME dialog, a fourth mode ----------
     A record carries more than a card can show, and the answer is not a
     taller card — it is this. The dialog that already shows an image, a
     video and a document gains a mode, so there is still exactly one
     overlay on this page: one backdrop, one focus trap, one Escape, one
     scroll lock, and one place that can be wrong.

     The body is built HERE, when it is asked for. A page of records does
     not carry a hidden tree of detail sections; it carries five cards and
     one function.

     Every section is conditional on its data. A record with nothing to add
     gets a shorter view, which is the correct outcome and not a missing
     feature: no empty heading, no "N/A", no separator over nothing. */
  function section(title, build) {
    /* the section builds itself into a fragment; if it produced nothing, it
       does not exist. That is the whole of the "no empty sections" rule and
       it is enforced by construction rather than by a check afterwards. */
    var host = el('div', 'detail-section');
    if (build(host) === 0) return null;
    if (title) host.insertBefore(el('h4', 'detail-h', title), host.firstChild);
    return host;
  }
  function addText(host, text) {
    if (!text) return 0;
    host.appendChild(el('p', 'detail-text', text));
    return 1;
  }
  function addList(host, items) {
    if (!items || !items.length) return 0;
    var ul = el('ul', 'detail-list');
    var n = 0;
    items.forEach(function (i) { if (i) { ul.appendChild(el('li', null, i)); n++; } });
    /* a list of nothing but empties is a list that does not exist */
    if (!n) return 0;
    host.appendChild(ul);
    return 1;
  }
  function addFact(host, key, value, isolate) {
    if (!value) return 0;
    host.appendChild(factNode(key, value, isolate));
    return 1;
  }

  function openDetails(rec) {
    if (!viewer) viewer = buildViewer();
    /* Opening the details IS the answer to "where does close go": there is
       nothing further back than this, so the route is cleared here and the
       next close in this dialog closes it. It is also what makes the return
       terminate — `closeViewer` calls this function, and without the clear
       the re-rendered details would point at itself forever. */
    returnTo = null;
    var d = rec.detail || {};
    var frame = viewer.querySelector('.cert-frame');
    var tools = viewer.querySelector('.cert-tools');
    var open = viewer.querySelector('.cert-open');
    var dl = viewer.querySelector('.cert-dl');
    var media = resolveRecordMedia(rec);

    viewer.classList.add('is-details');
    frame.className = 'cert-frame detail-body';
    /* The scroll region is focusable and named. That is what makes arrows,
       Page Up/Down and Home/End scroll the DETAILS rather than doing
       nothing: without a focus target inside the region the browser has no
       scroll box to apply them to. It is labelled by the record's own title
       in the header above it, so a screen reader announces what region this
       is without inventing a string. It scrolls natively — no wheel
       handler, no rAF, nothing to get out of step with the hand. */
    frame.tabIndex = 0;
    frame.setAttribute('role', 'region');
    frame.setAttribute('aria-labelledby', 'cert-viewer-title');

    frame.innerHTML = '';

    /* THE PRIMARY MEDIA, and the first thing in the details after the
       header. It is the record's OWN media, chosen by the same resolver
       the card uses — image, then video, then document — and opened by the
       same `mediaFrame`, so the click lands in the existing image viewer
       and the PDF stays behind its own explicit action. Nothing here
       resolves a path, invents a thumbnail, or adds a second viewer.

       It sits in a WRAPPER rather than standing in the scroll column as the
       frame itself, and that is a bug fix, not styling. `.record-shot`
       carries `overflow: hidden` (it has to: it clips the certificate to
       its radius), which makes it a scroll container, and a scroll
       container's automatic minimum size is ZERO. The details column is a
       grid, so the media was its own `auto` row track sized from that zero
       — and the track only stayed zero while the column had no free space
       to give it. DataCamp is the one record whose details are long enough
       to fill the panel, so it was the one record whose certificate was
       measured at 0px tall and clipped out of sight, while every shorter
       record happened to grow its row and look fine. The wrapper is a plain
       block with no overflow of its own, so the row is sized by the
       certificate again, and the reason is gone rather than patched. */
    if (media.kind === 'image' || media.kind === 'video' || media.kind === 'document') {
      var region = el('div', 'detail-media');
      region.setAttribute('data-media-kind', media.kind);
      region.appendChild(mediaFrame(rec, media));
      frame.appendChild(region);
    }

    var sections = 0;
    var s;

    s = section(t('rec.d.overview'), function (h) { return addText(h, d.overview); });
    if (s) { frame.appendChild(s); sections++; }

    /* who and when, as facts rather than a sentence, because a certificate
       and an activity are not the same thing and the data knows which */
    var meta = 0;
    var metaHost = section(null, function (h) {
      meta += addFact(h, t('rec.d.provider'), rec.metaPlain || '');
      meta += addFact(h, t('rec.d.date'), rec.datePlain || '');
      meta += addFact(h, t('rec.duration'), rec.duration, false);
      meta += addFact(h, t('rec.credential'), rec.credentialId, true);
      meta += addFact(h, t('rec.d.role'), d.role);
      meta += addFact(h, t('rec.d.location'), d.location);
      return meta;
    });
    if (metaHost) { metaHost.classList.add('detail-facts'); frame.appendChild(metaHost); sections++; }

    /* What HE did and what HE took away — only ever from the record's own
       narrative fields, so a certificate can never inherit them. */
    s = section(t('rec.d.did'), function (h) { return addText(h, d.whatIDid); });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.takeaway'), function (h) { return addText(h, d.takeaway); });
    if (s) { frame.appendChild(s); sections++; }

    /* NEUTRAL wording: this is what the course covered, never "what I
       learned", unless he wrote it himself — which is the field above. */
    s = section(t('rec.d.topics'), function (h) { return addList(h, d.topics.map(tv)); });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.skills'), function (h) { return addList(h, d.skills); });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.chapters'), function (h) {
      if (!d.chapters.length) return 0;
      var ol = el('ol', 'detail-chapters');
      d.chapters.forEach(function (ch, i) {
        var li = el('li', 'detail-chapter');
        li.appendChild(el('span', 'detail-chapter-n', String(i + 1).padStart(2, '0')));
        var b = el('div', 'detail-chapter-b');
        b.appendChild(el('p', 'detail-chapter-t', ch.title));
        if (ch.note) b.appendChild(el('p', 'detail-chapter-n2', ch.note));
        li.appendChild(b);
        ol.appendChild(li);
      });
      h.appendChild(ol);
      return 1;
    });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.resources'), function (h) {
      if (!d.resources.length) return 0;
      var ul = el('ul', 'detail-list detail-chips');
      d.resources.forEach(function (r) {
        if (r.url) {
          var a = el('a', null, r.label);
          a.href = r.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          ul.appendChild(el('li', null, '')).appendChild(a);
        } else {
          /* a name with no verified address stays a name. Inventing a URL
             for it would be fabricating a resource. */
          ul.appendChild(el('li', null, r.label));
        }
      });
      h.appendChild(ul);
      return 1;
    });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.collaborators'), function (h) { return addList(h, d.collaborators.map(tv)); });
    if (s) { frame.appendChild(s); sections++; }

    s = section(t('rec.d.gallery'), function (h) {
      if (!d.gallery.length) return 0;
      var wrap = el('div', 'detail-gallery');
      d.gallery.forEach(function (g) {
        /* the gallery has its OWN styles (a uniform contact sheet), so it
           carries no class from the primary-media recipe above: one class
           per piece of UI, and no rule left behind for a name nothing uses */
        var fig = el('figure');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'detail-gallery-open';
        b.setAttribute('aria-label', g.caption || rec.titlePlain);
        var im = document.createElement('img');
        im.src = g.src;
        im.alt = g.caption || rec.titlePlain;
        im.loading = 'lazy';
        b.appendChild(im);
        b.addEventListener('click', function () { openMedia(rec, { kind: 'image', src: g.src, alt: im.alt }); });
        fig.appendChild(b);
        if (g.caption) fig.appendChild(el('figcaption', 'detail-caption', g.caption));
        wrap.appendChild(fig);
      });
      h.appendChild(wrap);
      return 1;
    });
    if (s) { frame.appendChild(s); sections++; }

    /* the footer becomes this record's own controls, and they call the very
       same media paths the card does — so the document, the image and the
       video behave identically from in here and from the card */
    tools.hidden = true;
    open.hidden = true;
    dl.hidden = true;
    var acts = el('div', 'record-actions detail-actions');
    if (rec.pdf) acts.appendChild(actionButton(t('rec.openCert'), function () { openMedia(rec, { kind: 'document', src: rec.pdf }); }));
    if (rec.image) acts.appendChild(actionButton(t('rec.viewImage'), function () { openMedia(rec, { kind: 'image', src: rec.image, alt: mediaAlt(rec) }); }));
    if (rec.video) acts.appendChild(actionButton(t('rec.watchVideo'), function () { openMedia(rec, { kind: 'video', video: rec.video }); }));
    if (rec.link) {
      var ext = el('a', 'record-action', t(rec.actionKey));
      ext.href = rec.link;
      ext.target = '_blank';
      ext.rel = 'noopener noreferrer';
      acts.appendChild(ext);
    }
    var foot = viewer.querySelector('.cert-foot');
    foot.hidden = false;
    /* rebuilt every time: an action row that closed over the first record
       it was ever built for would open the wrong document */
    if (foot.querySelector('.detail-actions')) foot.removeChild(foot.querySelector('.detail-actions'));
    foot.appendChild(acts);

    viewer.querySelector('.cert-kicker').textContent = rec.kind ? kindLabel(rec.kind) : '';
    viewer.querySelector('.cert-title').textContent = rec.titlePlain;
    viewer.querySelector('.cert-panel').classList.toggle('is-wide', true);
    viewer.resetZoom();

    /* START AT THE TOP, every time, synchronously.
       The scroll offset belongs to the SCROLL CONTAINER, not to its
       contents: there is one dialog and one frame element for the whole
       page, and this function swaps its children. Replacing children does
       not reset a scroll offset, so the previous record's position — or the
       position the media modes left behind — survived into the next
       details and the record opened halfway down.

       This reset used to sit BEFORE `showModal()`, which is where it reads
       most naturally and where it does nothing at all. A closed <dialog> is
       `display: none`, so its frame has no layout box and therefore no
       scrolling box: assigning `scrollTop` is silently discarded — measured,
       it reads back 0 — and `showModal()` then RE-APPLIES the offset the
       frame was left at, which is how a long record kept reopening at
       scrollTop 394 with a maximum of 483. The order was the bug, not the
       assignment.

       So the reset follows the dialog becoming visible, in the same task
       and before any frame is painted: the visitor still cannot see the old
       position, because nothing has been rendered between the two lines. No
       delay, no animation, no second frame to correct it on, no timer. The
       page behind is not touched; its scroll position is a different element
       and a different lock. */
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    frame.scrollTop = 0;
  }

  function openMedia(rec, m) {
    if (!viewer) viewer = buildViewer();
    /* Remembered BEFORE the mode is cleared, because this is the last moment
       the question "was I opened from a details view?" is still answerable.
       The question is asked as `viewer.open &&`, not as the class alone, and
       that second half is the whole fix: a card thumbnail opens the viewer
       while the dialog is CLOSED, and `is-details` is still sitting on the
       element from the last details view — a leftover, not a mode. Asked of
       the class alone, a card-opened viewer believed it had details to go
       back to and refused to close. `open` is the only thing that can tell a
       details that are on screen from a class that outlived them.
       A viewer opened from a CARD has nothing to go back to and closes; one
       opened from the details — the certificate at the top of the details is
       a real route in, and it is the whole reason this branch exists —
       returns. */
    returnTo = viewer.open && viewer.classList.contains('is-details') ? rec : null;
    /* the media modes take the panel back from the details view: one
       dialog, and whichever mode was asked for last is the one on screen */
    viewer.classList.remove('is-details');
    viewer.querySelector('.cert-panel').classList.remove('is-wide');
    var host = viewer.querySelector('.cert-frame');
    host.className = 'cert-frame';
    /* the details region's own focus and name go with the details: a media
       stage is not a named scroll region, and leaving tabindex behind
       would add a tab stop that scrolls nothing */
    host.removeAttribute('tabindex');
    host.removeAttribute('role');
    host.removeAttribute('aria-labelledby');
    var stale = viewer.querySelector('.cert-foot .detail-actions');
    if (stale) stale.parentNode.removeChild(stale);
    var frame = host;
    var open = viewer.querySelector('.cert-open');
    var dl = viewer.querySelector('.cert-dl');
    var tools = viewer.querySelector('.cert-tools');
    var save = viewer.querySelector('.cert-save');
    var isImage = m.kind === 'image';
    var isVideo = m.kind === 'video';
    var embed = isVideo ? youTubeId(m.video) : '';
    var url = isVideo ? (embed ? m.embed : m.src) : m.src;

    frame.innerHTML = '';

    if (isImage) {
      /* the ORIGINAL file, unfiltered, uncropped, at its own ratio — measured
         into the stage by fitImage once its natural size exists. Nothing is
         ever written to the pixels: only the transform carries fit × zoom. */
      var img = document.createElement('img');
      img.className = 'cert-image';
      img.decoding = 'async';
      img.alt = m.alt || rec.titlePlain;
      img.addEventListener('load', function () {
        if (typeof viewer.fitImage === 'function') viewer.fitImage(false);
      });
      img.src = m.src;
      frame.appendChild(img);
      tools.hidden = false;
      open.hidden = true;
      dl.hidden = true;
      save.href = m.src;
      save.setAttribute('download', fileName(m.src));
      save.textContent = t('rec.downloadImage');
      viewer.querySelector('.cert-kicker').textContent = t('rec.viewImage');
      viewer.resetZoom();
      if (img.complete && img.naturalWidth) viewer.fitImage(false);
    } else {
      tools.hidden = true;
      open.hidden = false;
      if (isVideo && !embed) {
        var v = document.createElement('video');
        v.src = m.src;
        v.controls = true;
        v.preload = 'metadata';
        v.setAttribute('aria-label', rec.titlePlain);
        frame.appendChild(v);
      } else if (isVideo && embed) {
        /* POSTER, THEN PLAYER. The dialog opens on the same still the card
           used, with a play control, and the iframe is built when — and only
           when — that control is pressed.

           Two reasons, and the second is the architecture one. A dialog that
           is open is a dialog YouTube is loading, running its player, its
           beacon and its ad scripts behind a visitor who may only be reading
           the details; and an embed that appears with no visible cause reads
           as a blank frame that filled in by itself, which is what the old
           version looked like whenever the network was slow.

           autoplay is deliberate here and nowhere else on the site: the
           visitor has just pressed play. It arrives muted, because that is
           YouTube's own rule for an embed nobody asked to unmute, so pressing
           play never starts sound at a visitor who did not expect it. */
        var stage = document.createElement('div');
        stage.className = 'cert-stage';
        if (m.poster) {
          var shot = document.createElement('img');
          shot.className = 'media-poster';
          shot.src = m.poster;
          shot.alt = '';
          shot.decoding = 'async';
          fadeIn(shot);
          stage.appendChild(shot);
        }
        var play = document.createElement('button');
        play.type = 'button';
        play.className = 'stage-play';
        play.setAttribute('aria-label', t('rec.watchVideo') + ' — ' + rec.titlePlain);
        play.innerHTML = playGlyph();
        play.addEventListener('click', function () {
          var f2 = document.createElement('iframe');
          f2.title = rec.titlePlain;
          f2.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          f2.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          f2.src = m.embed + '&autoplay=1';
          /* the poster leaves the tree in the same frame the player arrives
             in, so there is no moment with both and no reflow of the stage */
          if (stage.parentNode) stage.parentNode.replaceChild(f2, stage);
        });
        stage.appendChild(play);
        frame.appendChild(stage);
      } else {
        var f = document.createElement('iframe');
        f.title = rec.titlePlain;
        f.loading = 'lazy';
        f.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        f.src = url;
        frame.appendChild(f);
      }
      if (isVideo) {
        /* one action, not two: both links would point at the same address,
           and a "download" that is really an embed would be a lie */
        open.href = m.video;
        open.textContent = t('rec.watchVideo');
        dl.hidden = true;
      } else {
        open.href = url;
        open.textContent = t('rec.openPdf');
        dl.hidden = false;
        dl.href = url;
        dl.setAttribute('download', fileName(url));
        dl.textContent = t('rec.downloadPdf');
      }
      viewer.querySelector('.cert-kicker').textContent =
        isVideo ? t('rec.watchVideo') : t('rec.openCert');
    }

    viewer.querySelector('.cert-title').textContent = rec.titlePlain;
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');       /* very old engines: no top layer */
    /* fit AFTER the dialog is open: a closed dialog has no stage box to
       measure. The load listener above already fired for a cached image
       (before there was anything to measure), so re-fit once the stage is
       real — from scratch, so a landscape never inherits a portrait's
       numbers and zoom never survives a switch. Synchronous: showModal
       lays out before returning, so the stage rect is measurable here
       with no frame loop, no Tick, no extra listener. */
    if (isImage && typeof viewer.fitImage === 'function') viewer.fitImage(false);
  }

  /* One card recipe for every record, in five editorial groups:
       eyebrow (the record's own kind) → title → provider/date →
       description → actions (ONLY what the data has: document, video,
       link).
     The card is a PREVIEW and stays that way: anything richer than this
     lives in the details view, and a record with a lot to say does not get a
     taller card — it gets a view.
     The facts — duration, credential number — were in the card and are not
     any more. They are data the card never needed to answer "what is this?",
     they cost a divider, a row and four lines in the tightest column on the
     page, and they are still rendered in the details view, which is where a
     number like that belongs. Nothing is deleted: `duration` and
     `credentialId` stay on the record, and the details builder reads them.
     NO DATA = NO UI: a missing field leaves no label, no "N/A", no
     placeholder, nothing invented. */
  function recordNode(rec, qWords) {
    var li = el('li', 'record');
    /* the text lives in its own element so the two-column layout has exactly
       two children to place. */
    var body = el('div', 'record-body');
    var media = resolveRecordMedia(rec);

    if (rec.preview) {
      /* the modifier is added by name, not by concatenation, so that
         css-audit can see the class in the markup the way it sees every
         other one — a runtime class nobody can find is a dead rule */
      li.classList.add('has-media');
      li.appendChild(mediaFrame(rec, media));
    }

    if (rec.kind) body.appendChild(el('p', 'record-eyebrow', kindLabel(rec.kind)));

    /* THE TITLE IS THE KEYBOARD DOOR, not the card.
       A whole-card click is a pointer convenience; it cannot be the
       accessible control, because a container that is itself a button
       swallows its children — the image viewer, the document and the video
       would become unreachable from the keyboard. So the heading holds a
       real <button>, which Enter and Space operate for free, and the card's
       own click handler below is a second route to the same dialog. */
    var h3 = el('h3', 'record-title');
    var open = el('button', 'record-open', highlight(rec.title, qWords));
    open.type = 'button';
    open.setAttribute('aria-haspopup', 'dialog');
    /* its own handler, because the card's delegated guard below ignores
       clicks that land on a button — and this is one. Without this line
       the keyboard route would be silently dead while looking perfect. */
    open.addEventListener('click', function () { openDetails(rec); });
    h3.appendChild(open);
    body.appendChild(h3);

    if (rec.meta) body.appendChild(el('p', 'record-meta', highlight(rec.meta, qWords)));
    if (rec.body) body.appendChild(el('p', 'record-text', highlight(rec.body, qWords)));

    /* One action slot per thing the DATA has: the official document, the
       video, the issuing body's verification link. A record with none of
       them simply has no action row at all. */
    var actions = el('div', 'record-actions');
    var hasAction = false;
    if (rec.pdf) { actions.appendChild(actionButton(t('rec.openCert'), function () { openMedia(rec, { kind: 'document', src: rec.pdf }); })); hasAction = true; }
    if (rec.video) { actions.appendChild(actionButton(t('rec.watchVideo'), function () { openMedia(rec, { kind: 'video', video: rec.video }); })); hasAction = true; }
    if (rec.link) {
      var a = el('a', 'record-action', t(rec.actionKey));
      a.href = rec.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      actions.appendChild(a);
      hasAction = true;
    }
    if (hasAction) body.appendChild(actions);
    li.appendChild(body);

    /* THE WHOLE-CARD CLICK, without stealing anything.
       One delegated listener per list, and it only fires for a click that
       did not land on something already interactive: the media frame (image
       viewer, video viewer), the document button, the external link. Those
       all stop here, so one control can never trigger two dialogs. */
    li.addEventListener('click', function (e) {
      if (e.target.closest('a, button, input, select, textarea, video, iframe')) return;
      openDetails(rec);
    });
    return li;
  }

  /* One metadata fact: a small label over its value. The credential number
     needs a <bdi>: in an Arabic paragraph a leading "#" is a bidi-neutral
     character and the renderer is free to place it on either side of the
     digits; <bdi> isolates the number so it reads exactly, with no
     invisible control characters left in the text. */
  function factNode(key, value, isolate) {
    var f = el('div', 'record-fact');
    var k = el('span', 'record-fact-k');
    k.textContent = key;
    var v = el('span', 'record-fact-v');
    if (isolate) {
      var num = document.createElement('bdi');
      num.textContent = value;
      v.appendChild(num);
    } else {
      v.textContent = value;
    }
    f.appendChild(k);
    f.appendChild(v);
    return f;
  }

  function actionButton(label, onClick) {
    var b = el('button', 'record-action', label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
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

  /* The page ENTERS with a stagger, once. Every list rebuilt after that —
     a keystroke in the search box, a filter, a language change — resolves
     immediately instead, because an archive that re-animates its whole
     contents on every keypress is an archive nobody can search. One flag,
     one distinction, and it is the difference between a page that arrives
     and a page that keeps performing. */
  var firstPaint = true;

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
      /* the entrance, once. After this, every list is resolved in place. */
      if (window.Reveal) {
        if (firstPaint) Reveal.scan(target);
        else Reveal.resolve(target);
      }
      noneEl.hidden = hit.length > 0;
      countEl.textContent = hit.length ? String(hit.length) : '';
      return hit.length;
    }

    var c = run(allCerts, certsList, certsNone, certsCount);
    var v = run(allVol, volList, volNone, volCount);
    var total = c + v;
    firstPaint = false;

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

  /* ---------- shared furniture ----------
     The header's stuck state, the back-to-top button and the mobile
     navigation were three copies of code that scroll.js and ui.js already
     own; they were fighting each other over the same class. Everything
     page-furniture is UI.chrome(), and the button's arrival is a class now
     (see .to-top in site.css) rather than the `hidden` attribute, which is
     a display switch and can never be transitioned. */
  var fy = $('#footer-year');
  if (fy) fy.textContent = String(new Date().getFullYear());

  rebuildData();
  buildTags();
  apply();

  /* scroll tracking */
  if (window.Scroll) Scroll.mount();

  /* premium layer: ghost numerals + atmosphere */
  if (window.UI) {
    UI.sectionIndex();
    UI.atmosphere();
    UI.mount();
  }

  document.addEventListener('site-lang-change', fullRefresh);
})();
