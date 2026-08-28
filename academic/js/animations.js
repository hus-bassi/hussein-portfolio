/* ============================================================
   JS/ANIMATIONS.JS
   Brought forward from Phase 14 at Hussein's request — a first,
   simple scroll-reveal effect. Fuller motion work (parallax,
   more elaborate transitions) still happens in Phase 14 later.

   Uses IntersectionObserver instead of a 'scroll' event listener:
   it only runs when an element's visibility actually changes,
   rather than on every single scroll frame — much cheaper, which
   matters given how strongly performance was emphasized in the brief.

   IMPORTANT (dynamically-injected content):
   Several parts of the site build their cards in JS AFTER this file
   runs — the certificate / project / skills renderers, and especially
   the universal EventSystem (js/media-system.js) that renders the
   volunteering / event cards. Those cards carry `.reveal` too, so the
   reveal system must keep watching for elements added later, not just
   the ones present at load. It does that two ways: a MutationObserver
   picks up anything injected into the page automatically, and a small
   window.ScrollReveal.refresh() hook lets a renderer force an immediate
   re-scan right after it injects markup (and again on a language
   re-render). Without this, a card built after load would stay stuck at
   opacity:0 — present in the DOM, taking up space, but invisible.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

/**
 * WHAT:  Fades and lifts elements into place as they scroll into view.
 * WHY:   A quiet, premium motion detail — content arrives deliberately
 *        instead of just appearing, without being distracting or
 *        costing meaningful performance.
 * WHERE: Runs once on page load, then keeps watching for `.reveal`
 *        elements added later. New sections — static or JS-rendered —
 *        just need the `.reveal` class, no changes needed here.
 * HOW:   One shared IntersectionObserver watches each `.reveal` element
 *        and adds `.is-visible` (styled in css/main.css) the moment ~15%
 *        of it enters the viewport, then stops watching it — the
 *        animation plays once per element. A MutationObserver feeds any
 *        later-injected `.reveal` into that same observer.
 */
function initScrollReveal() {
  const supportsIO = 'IntersectionObserver' in window;

  // Track what we've already handled so re-scans (MutationObserver +
  // the public refresh hook + language re-renders) never double-observe
  // an element. A WeakSet lets removed nodes be garbage-collected.
  const tracked = new WeakSet();

  const observer = supportsIO
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      )
    : null;

  // Reveal-or-observe a single candidate element.
  function consider(el) {
    if (!el || tracked.has(el) || el.classList.contains('is-visible')) return;
    // No IntersectionObserver support (very rare today) → just show it,
    // rather than leaving it invisible forever.
    if (!observer) {
      el.classList.add('is-visible');
      return;
    }
    tracked.add(el);
    observer.observe(el);
  }

  // Scan a root (Document / Element) for not-yet-revealed `.reveal`
  // elements, including the root itself when it is one.
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.matches && root.matches('.reveal')) consider(root);
    if (root.querySelectorAll) {
      root.querySelectorAll('.reveal').forEach(consider);
    }
  }

  // 1) Initial pass over everything already in the document.
  scan(document);

  // 2) Future-proof: anything injected later (event cards, certificate /
  //    project / skills cards, a language re-render, or any renderer
  //    added in the future) is picked up automatically and animates in
  //    exactly like static content. This is what keeps dynamically-built
  //    cards — e.g. the volunteering event cards from media-system.js,
  //    which is loaded AFTER this file — from getting stuck invisible.
  if ('MutationObserver' in window && document.body) {
    const mo = new MutationObserver((records) => {
      for (let i = 0; i < records.length; i++) {
        const added = records[i].addedNodes;
        for (let j = 0; j < added.length; j++) {
          const node = added[j];
          if (node && node.nodeType === 1) scan(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // 3) Public hook: a renderer can force an immediate re-scan right after
  //    it injects markup, without waiting on the async MutationObserver
  //    callback. (media-system.js calls this after rendering each grid.)
  window.ScrollReveal = {
    refresh: function () { scan(document.body); },
    observe: scan,
  };
}
