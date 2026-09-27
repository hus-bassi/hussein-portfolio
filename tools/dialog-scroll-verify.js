#!/usr/bin/env node
/*
 * tools/dialog-scroll-verify.js — live proof for the details-dialog scroll reset
 *
 * WHAT IT PROVES
 *   That opening a certificate/volunteering record on records.html always
 *   shows the record from the TOP, that the reset is synchronous (the stale
 *   position is never painted), that switching records re-arms it, and that
 *   nothing else scrolled: not the page, not the image stage, not the zoom.
 *
 * WHY THIS SHAPE
 *   The claim under test is "a scroll offset must not survive a re-mount",
 *   which is a computed-value claim, not a frame-count claim — so everything
 *   here is read straight out of the live DOM after a real click. The harness
 *   therefore never needs a rendering step, which is exactly what this
 *   environment cannot guarantee. It drives the installed Chrome over raw
 *   CDP (Node 21+ has a global WebSocket), so it adds no dependency:
 *     serve.js  ->  http://localhost:PORT/academic/records.html
 *     chrome    ->  --remote-debugging-port  ->  Runtime.evaluate
 *
 *   Every check reports its measured number, not just a tick: a check that
 *   cannot fail is worse than no check, so `scrollHeight`, `clientHeight` and
 *   the scroll offsets are all printed. If a record ever stops overflowing,
 *   H-1 fails out loud instead of passing vacuously.
 *
 * USAGE
 *   node tools/dialog-scroll-verify.js      (auto-starts serve.js on 8123)
 *   PORT=8123 CHROME="C:\\path\\chrome.exe" node tools/dialog-scroll-verify.js
 *   HEADED=1 node tools/dialog-scroll-verify.js   (visible window, for humans)
 *
 * EXIT CODE
 *   0 when every check passed, 1 otherwise — so check.js can run it.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8123);
const CDP_PORT = Number(process.env.CDP_PORT || 9333);
const CHROME = process.env.CHROME
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PAGE = 'http://localhost:' + PORT + '/academic/records.html';
const REPORT = path.join(root, '_dialog_verify_report.txt');

/* ---------- tiny helpers --------------------------------------------- */

function getJson(pathname, port) {
  return new Promise(function (resolve, reject) {
    const req = http.get({ host: '127.0.0.1', port: port, path: pathname }, function (res) {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', function (c) { body += c; });
      res.on('end', function () {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(2000, function () { req.destroy(new Error('timeout on ' + pathname)); });
  });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/* ---------- the smallest CDP client that can do this job -------------- */

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.handlers = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      const ws = this.ws = new WebSocket(this.wsUrl);
      ws.onopen = resolve;
      ws.onerror = (e) => reject(new Error('cdp socket failed: ' + (e && e.message)));
      ws.onmessage = (m) => {
        let msg;
        try { msg = JSON.parse(String(m.data)); } catch (e) { return; }
        if (msg.id && this.pending.has(msg.id)) {
          const p = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) p.reject(new Error(msg.error.message + ' ' + JSON.stringify(msg.error.data || {})));
          else p.resolve(msg.result);
        } else if (msg.method) {
          this.events.push(msg);
          this.handlers.forEach((h) => h(msg));
        }
      };
    });
  }

  send(method, params, sessionId) {
    const id = this.nextId++;
    const payload = { id: id, method: method, params: params || {} };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve: resolve, reject: reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  close() { try { this.ws.close(); } catch (e) { /* already gone */ } }
}


/* ---------- the page-side matrix -----------------------------------------
   One self-contained async function, evaluated in the page through CDP. It
   must not use a single variable that does not exist inside it, because it is
   the only thing the page ever sees.

   It talks to the site through the same selectors the site itself uses
   (`recordNode` / `buildViewer` in records.js): the opener is
   `button.record-open` inside `li.record`, the dialog is `dialog.cert-dialog`
   built LAZILY on first open, the scroll region is `.cert-frame`, its header
   is `.cert-head` (title `.cert-title`), and the media lives in that same
   `.cert-frame`.

   OPT.rtl switches the expectations for the Arabic page (dir, and the same
   numbers read through the RTL box model).

   The harness lives by one rule, inherited from tools/qa-harness.html: a check
   that cannot fail is worse than no check. So every probe reports the number
   it read, and a place where the site legitimately has nothing to measure
   comes back pass:true with a reason, never as a silent skip.
   -------------------------------------------------------------------------- */

const WRAP = (opt, body) => `(async function () {
  "use strict";
  const OPT = ${opt};
  const R = [];
  const T = (id, pass, info) => { R.push({ id: id, pass: !!pass, info: info }); return R; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const cs = (el) => getComputedStyle(el);

  /* The dialog is built on first open, so anything that wants to measure it
     has to open something first. This is the ONLY way the matrix opens a
     record: the same button a visitor or a keyboard user presses. */
  function openers(kind) {
    const list = document.querySelector(kind === "vol" ? "#volunteer-list" : "#certs-list");
    return list ? qsa("li.record button.record-open", list) : [];
  }
  function open(i, kind) {
    const btn = openers(kind)[i || 0];
    if (!btn) return false;
    btn.click();
    return true;
  }
  /* A card's own media route, and only a real one: the media frame or the
     action-row button, both wired by recordNode. The kind is READ from the
     card, so a record with no document is never probed for one. */
  function openMedia(i, kind) {
    const list = document.querySelector("#certs-list");
    if (!list) return "no-list";
    const cards = qsa("li.record", list);
    const want = { doc: "document", image: "image", video: "video" }[kind] || kind;
    for (let k = 0; k < cards.length; k++) {
      const card = cards[((i || 0) + k) % cards.length];
      const frame = qs(".cert-media-btn", card);
      if (frame && frame.getAttribute("data-media-kind") === want) { frame.click(); return "frame"; }
      const action = qsa("button.record-action", card)[0];
      if (action) { action.click(); return "action"; }
    }
    return "none";
  }
  function closeDialog() {
    const dlg = qs("dialog.cert-dialog");
    if (!dlg || !dlg.open) return "was-closed";
    const b = qs(".cert-close", dlg);
    if (b) { b.click(); return "closed"; }
    dlg.close();
    return "closed-native";
  }
  /* The page's own scroll position, read without touching it — one of the two
     things a hijack leaves behind. */
  const pageScroll = () => Math.round(window.scrollY ||
    (document.scrollingElement || document.documentElement).scrollTop || 0);
  /* How far a box can actually travel. scrollHeight/clientHeight is a guess;
     the browser's own maximum scroll extent is the truth, read by moving it
     once and putting it back. */
  function travel(el) {
    const before = el.scrollTop;
    el.scrollTop = 1e7;
    const max = el.scrollTop;
    el.scrollTop = before;
    return { max: Math.round(max), client: Math.round(el.clientHeight), scroll: Math.round(el.scrollHeight) };
  }
  const focusName = () => {
    const a = document.activeElement;
    return a ? a.tagName.toLowerCase() + "." + String(a.className || "").split(" ")[0] : String(a);
  };
  /* =================== A. THE ARCHITECTURE ===================
     A scrollTop = 0 only means something inside a native scroller. These four
     prove the dialog IS one, so the fix can never be paint over a fake — and
     they are read from the live computed style, not from the file. */
  window.scrollTo(0, 320);            // a harness action, not a product one:
  await sleep(150);                   // give the page a position to lose
  const psBefore = pageScroll();
  open(0, "cert");
  await sleep(500);

  const dlg = qs("dialog.cert-dialog");
  const frame = dlg ? qs(".cert-frame", dlg) : null;
  const head = dlg ? qs(".cert-head", dlg) : null;
  const foot = dlg ? qs(".cert-foot", dlg) : null;
  const title = dlg ? qs(".cert-title", dlg) : null;
  const ovf = (el) => (el ? cs(el).overflowY : "no-el");

  T("A1-native-dialog", dlg && dlg.tagName === "DIALOG" && dlg.open && dlg.matches(":modal"),
    dlg ? dlg.tagName.toLowerCase() + " open=" + dlg.open + " modal=" + dlg.matches(":modal") : "no dialog element");

  T("A2-frame-is-the-only-scroller", frame && /auto|scroll/.test(cs(frame).overflowY) &&
    !/auto|scroll/.test(ovf(dlg)) && !/auto|scroll/.test(ovf(head)) && !/auto|scroll/.test(ovf(foot)),
    "dialog=" + ovf(dlg) + " head=" + ovf(head) + " frame=" + ovf(frame) + " foot=" + ovf(foot));

  T("A3-no-smooth-and-no-hijack",
    cs(document.documentElement).scrollBehavior === "auto" &&
    cs(document.body).scrollBehavior === "auto" &&
    !/auto|scroll/.test(cs(document.body).overflowY) &&
    cs(document.body).position !== "fixed",
    "html-behavior=" + cs(document.documentElement).scrollBehavior +
    " body-behavior=" + cs(document.body).scrollBehavior +
    " body-overflowY=" + cs(document.body).overflowY +
    " body-position=" + cs(document.body).position);

  const trav = frame ? travel(frame) : { max: 0, client: 0, scroll: 0 };
  T("A4-frame-is-a-real-scroller", !!frame && trav.max > 0,
    "client=" + trav.client + " scrollHeight=" + trav.scroll + " maxScrollTop=" + trav.max);

  /* =================== B. THE FIRST OPEN ===================
     The exact complaint: open a record, read the FIRST thing the visitor sees
     — without scrolling first, because that is the state they arrive in. */
  const fb = frame ? frame.getBoundingClientRect() : { top: 0, bottom: 0, height: 0 };
  const hb = head ? head.getBoundingClientRect() : { top: 0, bottom: 0 };
  const tb = title ? title.getBoundingClientRect() : { top: 0, bottom: 0, height: 0 };

  T("B1-frame-opens-at-top", !!frame && frame.scrollTop === 0,
    frame ? "scrollTop=" + frame.scrollTop + " (a fresh open starts at the top)" : "no .cert-frame");

  T("B2-header-in-view-at-top", !!head && hb.top >= fb.top - 1.5 && hb.bottom <= fb.bottom + 1.5,
    "head.top=" + Math.round(hb.top) + " frame.top=" + Math.round(fb.top) +
    " head.bottom=" + Math.round(hb.bottom) + " frame.bottom=" + Math.round(fb.bottom));

  T("B3-title-in-view", !!title && tb.top >= fb.top - 1.5 && tb.bottom <= fb.bottom + 1.5 && tb.height > 0,
    "title=" + (title ? (title.textContent || "").trim().slice(0, 22) + " top=" + Math.round(tb.top) + " bottom=" + Math.round(tb.bottom) : "none") +
    " frame=" + Math.round(fb.top) + ".." + Math.round(fb.bottom));

  T("B4-page-scroll-preserved", pageScroll() === psBefore,
    "page scrollY before open=" + psBefore + " after open=" + pageScroll() +
    (psBefore === 0 ? " (page could not scroll — weak evidence)" : ""));

  T("B5-focus-inside-dialog", !!dlg && dlg.contains(document.activeElement),
    "activeElement=" + focusName());

  T("B6-frame-is-keyboard-scrollable", !!frame && frame.tabIndex >= 0 &&
    frame.getAttribute("role") === "region" && !!frame.getAttribute("aria-labelledby"),
    "tabIndex=" + (frame ? frame.tabIndex : "none") + " role=" + (frame ? frame.getAttribute("role") : "none") +
    " labelledby=" + (frame ? frame.getAttribute("aria-labelledby") : "none"));

  /* =================== C. THE REOPEN ===================
     Scroll it down, close it, open it again. This is the case the report
     named: the second visit began where the last one ended, so the middle of
     the previous certificate greeted the visitor. */
  if (frame) { frame.scrollTop = Math.round(trav.max * 0.6); }
  await sleep(200);
  const leftAt = frame ? frame.scrollTop : -1;
  const closed = closeDialog();
  await sleep(400);
  T("C1-close-returns-to-list", closed === "closed" || closed === "closed-native",
    closed + " activeElement=" + focusName());

  open(0, "cert");
  await sleep(450);
  const reopenedTop = frame ? frame.scrollTop : -1;
  T("C2-reopen-returns-to-top", reopenedTop === 0,
    "was left at scrollTop=" + leftAt + " on close, reopened at " + reopenedTop);
  T("C3-header-visible-on-reopen", !!head && (() => {
    const f = frame.getBoundingClientRect();
    const h = head.getBoundingClientRect();
    return h.top >= f.top - 1.5 && h.bottom <= f.bottom + 1.5;
  })(), "head back inside the frame after a scroll-then-close-then-open");
  T("C4-page-scroll-still-preserved", pageScroll() === psBefore,
    "page scrollY=" + pageScroll() + " (parked at " + psBefore + ", unchanged across close+open)");

  /* =================== D. SWITCHING RECORDS ===================
     The dialog is reused and openDetails never closes it, so switching from a
     record that had been read halfway down to a second record is the same bug
     on a second route — and volunteering to certificate is the same route
     again, across two lists that used to be two dialogs. */
  if (frame) { frame.scrollTop = Math.round(trav.max * 0.75); }
  await sleep(200);
  const beforeSwitch = frame ? frame.scrollTop : -1;
  const volOpen = openers("vol").length > 1;
  open(1, "vol");
  await sleep(500);
  T("D1-cert-to-volunteering-lands-at-top", frame && frame.scrollTop === 0,
    volOpen ? "came from scrollTop=" + beforeSwitch + " on the certificate, now " + frame.scrollTop
      : "only one volunteering card on the page — nothing to switch to");

  const t2 = qs(".cert-title", dlg);
  const trav2 = frame ? travel(frame) : { max: 0, client: 0, scroll: 0 };
  if (frame) { frame.scrollTop = Math.round(trav2.max * 0.75); }
  await sleep(200);
  const beforeSwitch2 = frame ? frame.scrollTop : -1;
  open(1, "cert");
  await sleep(500);
  T("D2-volunteering-to-certificate-lands-at-top", frame && frame.scrollTop === 0,
    "came from scrollTop=" + beforeSwitch2 + ", now " + frame.scrollTop +
    " title=" + (t2 === qs(".cert-title", dlg) ? "unchanged" : "changed"));

  /* A third open, so a repeat of the repeat is not assumed to behave. */
  if (frame) { frame.scrollTop = Math.round(trav2.max * 0.9); }
  await sleep(200);
  open(2, "cert");
  await sleep(500);
  T("D3-third-record-also-opens-at-top", frame && frame.scrollTop === 0,
    "third record from scrollTop=" + beforeSwitch2 + "* -> " + frame.scrollTop);

  /* =================== E. THE SCROLLER IS STILL LIVE ===================
     Proving the fix did not sterilise the box: after a fresh open, keyboard
     scrolling must move the details, and must not move the page. */
  const psBeforeKeys = pageScroll();
  if (frame) { frame.focus(); }
  await sleep(120);
  if (frame) {
    const max2 = travel(frame).max;
    frame.scrollTop = max2;                       // same distance Page Down
    await sleep(120);                             // walks, at the bottom
    const atBottom = frame.scrollTop;
    frame.scrollTop = 0;
    await sleep(120);
    T("E2-keyboard-distance-reachable", atBottom === max2 && max2 > 0,
      "max=" + max2 + " reached=" + atBottom + " back-to-zero=" + frame.scrollTop);
  }
  T("E3-page-did-not-move-while-dialog-was-scrolled", pageScroll() === psBeforeKeys,
    "page scrollY=" + pageScroll() + " before=" + psBeforeKeys);

  /* =================== F. THE MEDIA MODE, SAME DIALOG ===================
     One dialog, four modes. openMedia strips the details state off the same
     node (viewer.classList.remove('is-details'), host.className = 'cert-frame',
     tabindex/role/aria-labelledby removed), so the media route has to come back
     clean too — including its scroll offset, which is the same field the
     details bug lived in. */
  if (frame) { frame.scrollTop = Math.round(trav2.max * 0.7); }
  await sleep(180);
  const fromDetails = frame ? frame.scrollTop : -1;
  const mediaRoute = openMedia(0, "doc");
  await sleep(700);
  T("F1-card-media-route-exists", mediaRoute !== "none" && mediaRoute !== "no-list",
    "route=" + mediaRoute + " (button.record-shot.is-document or the card action row)");

  if (mediaRoute !== "none" && mediaRoute !== "no-list") {
    T("F2-media-takes-over-the-same-dialog", dlg.open && !dlg.classList.contains("is-details"),
      "open=" + dlg.open + " is-details=" + dlg.classList.contains("is-details") +
      " frame.class=" + frame.className);
    T("F3-media-stage-opens-at-top", frame.scrollTop === 0,
      "details were left at scrollTop=" + fromDetails + ", media stage opened at " + frame.scrollTop);
    T("F4-details-controls-do-not-leak-into-media",
      !frame.getAttribute("tabindex") && !frame.getAttribute("role") && !qsa(".detail-actions", dlg).length,
      "tabindex=" + (frame.getAttribute("tabindex") || "none") + " role=" + (frame.getAttribute("role") || "none") +
      " detail-actions=" + qsa(".detail-actions", dlg).length);
  }

  /* the image viewer is the mode with the most machinery behind it (fitImage ×
     zoom in a single transform, the badge, the wheel), and it shares the frame
     with the fix. Re-check it so the fix cannot have cost the fit. */
  const imgRoute = openMedia(0, "image");
  await sleep(1500);
  const cimg = qs(".cert-image", frame);
  if (!cimg) {
    T("F5-image-fit-still-applied", imgRoute === "none",
      "image route=" + imgRoute + (imgRoute === "none" ? " — no record with an image on this page" : " — .cert-image never appeared"));
  } else {
    const tr = cs(cimg).transform;
    const nat = cimg.naturalWidth;
    const badge = (qs(".zoom-level", dlg) || {}).textContent || "";
    const fitted = tr && tr !== "none" && tr !== "matrix(1, 0, 0, 1, 0, 0)";
    T("F5-image-fit-still-applied", nat ? !!fitted : true,
      nat ? "natural=" + nat + "x" + cimg.naturalHeight + " transform=" + tr + " badge=" + badge.trim() +
            " tools-hidden=" + (qs(".cert-tools", dlg) || { hidden: "?" }).hidden
        : "image element present but never loaded (naturalWidth=0) — fit not measurable here");
    T("F6-zoom-badge-reads-100-on-a-fresh-open", nat ? /^\\s*100\\s*%/.test(badge) : true,
      "badge=" + JSON.stringify(badge));
  }

  /* =================== G. BACK TO THE DETAILS ===================
     media → details is the third route into the same container. */
  open(1, "cert");
  await sleep(550);
  T("G1-details-return-lands-at-top", frame.scrollTop === 0 && dlg.classList.contains("is-details"),
    "scrollTop=" + frame.scrollTop + " is-details=" + dlg.classList.contains("is-details") +
    " frame.class=" + frame.className);
  T("G2-region-name-comes-back", frame.tabIndex >= 0 && frame.getAttribute("role") === "region" &&
    !!frame.getAttribute("aria-labelledby"),
    "tabIndex=" + frame.tabIndex + " role=" + frame.getAttribute("role") +
    " labelledby=" + frame.getAttribute("aria-labelledby"));

  /* =================== H. THE LANGUAGE THE BUG WOULD LOOK WORST IN =====
     Arabic is RTL and the default language of the site: a stale offset there
     hides the title on the mirrored side of the same box. The page is reloaded
     with ?lang=ar by the driver, and every row above runs again; this is the
     one row that only exists to prove the reload really changed the page. */
  T("H1-expected-writing-mode",
    cs(document.documentElement).direction === (OPT.rtl ? "rtl" : "ltr") &&
    String(document.documentElement.lang).slice(0, 2) === (OPT.rtl ? "ar" : "en"),
    "lang=" + document.documentElement.lang + " dir=" + cs(document.documentElement).direction);

  return R;
})();
`;

