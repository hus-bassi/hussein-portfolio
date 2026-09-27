/* ============================================================
   REVEAL — one observer, one vocabulary, four behaviours.

   Every section that arrives with the scroll goes through here. The markup
   says what it wants:

       data-reveal="up"       rises and resolves out of blur   (default)
       data-reveal="mask"     wipes open from one edge
       data-reveal="scale"    settles down from slightly larger
       data-reveal="line"     a hairline that draws itself across
       data-reveal="stagger"  the children arrive in order

   WHY ONE MODULE
   --------------
   The previous version had the reveal logic written out three times — once
   in site.js, once in page.js, and once again for the records page — each
   with its own IntersectionObserver, its own threshold, and its own
   `transitionDelay` bookkeeping. They had already drifted apart. This is
   the single copy, and the stagger is expressed in CSS (`--i` × 90ms)
   rather than in JavaScript timers, so nothing has to be cleaned up
   afterwards.

   The contract that matters: content is never held back. An element either
   reveals on arrival or is in its final state already — never invisible.
   Under still mode, and where IntersectionObserver is missing, `is-in` is
   applied immediately and synchronously.

   Two callers, two intentions. `scan` is for a page arriving, and it
   watches. `resolve` is for markup that was just re-rendered after the
   page had already arrived — a filtered list, a language change — where
   arriving is the wrong verb: that content should simply BE there.
   ============================================================ */
(function () {
  'use strict';

  var Reveal = window.Reveal = window.Reveal || {};

  var io = null;

  function still() {
    return window.Motion ? Motion.isStill()
                         : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function observer() {
    if (io || !('IntersectionObserver' in window)) return io;
    io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var en = entries[i];
        if (!en.isIntersecting) continue;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
      /* threshold .01, with a FIFTH of the viewport held back at the bottom:
         an element starts arriving while it is still a fifth of a screen
         below the fold, so the page is already assembling itself as it
         comes up — the reveal no longer starts after the eye has landed on
         it. The margin is also what guarantees the last item on a page is
         never left sitting at opacity 0. */
    }, { rootMargin: '0px 0px -20% 0px', threshold: .01 });
    return io;
  }

  /* Mark up one element (or, for a stagger group, its children) and return
     the nodes that should be watched. */
  function arm(el, immediate) {
    if (el.hasAttribute('data-reveal-armed')) return [];
    el.setAttribute('data-reveal-armed', '');

    var kind = (el.getAttribute('data-reveal') || 'up').toLowerCase();
    var out = [];

    if (kind === 'stagger') {
      var kids = el.children;
      for (var i = 0; i < kids.length; i++) {
        var kid = kids[i];
        kid.classList.add('reveal');
        kid.style.setProperty('--i', String(i));
        out.push(kid);
      }
    } else {
      el.classList.add('reveal');
      if (kind === 'mask') el.classList.add('reveal-mask');
      else if (kind === 'scale') el.classList.add('reveal-scale');
      else if (kind === 'line') el.classList.add('reveal-line');
      else if (kind === 'blur') el.classList.add('reveal-blur');
      /* no class for 'up': it IS the base arrival, and a class with no rule
         behind it is a hook for nothing */
      out.push(el);
    }

    if (immediate) {
      for (var j = 0; j < out.length; j++) out[j].classList.add('is-in');
      return [];
    }
    return out;
  }

  /* Scan a scope for anything not yet armed. Called on load, and again
     after a render that added markup to the page. */
  Reveal.scan = function (scope) {
    var root = scope || document;
    /* querySelectorAll only ever looks INSIDE the scope, so a list that was
       just re-rendered — records.js hands this the <ul> itself — would never
       match its own data-reveal. The scope is therefore considered first,
       then its descendants. */
    var found = [];
    if (root !== document && root.matches && root.matches('[data-reveal]:not([data-reveal-armed])')) found.push(root);
    var nodes = root.querySelectorAll('[data-reveal]:not([data-reveal-armed])');
    for (var i = 0; i < nodes.length; i++) found.push(nodes[i]);
    if (!found.length) return;

    var immediate = still() || !('IntersectionObserver' in window);
    var watch = [];
    for (var i = 0; i < found.length; i++) {
      watch = watch.concat(arm(found[i], immediate));
    }
    if (!watch.length) return;

    var ob = observer();
    for (var j = 0; j < watch.length; j++) ob.observe(watch[j]);
  };

  /* Put a scope in its final state now, without watching it. This is what a
     re-rendered list calls: the content is new but the page is not new, and
     an archive that fades its results in on every keystroke is an archive
     nobody can search. */
  Reveal.resolve = function (scope) {
    var root = scope || document;
    var found = [];
    if (root !== document && root.matches && root.matches('[data-reveal]')) found.push(root);
    var nodes = root.querySelectorAll('[data-reveal]');
    for (var i = 0; i < nodes.length; i++) found.push(nodes[i]);
    for (var j = 0; j < found.length; j++) {
      var el = found[j];
      if ((el.getAttribute('data-reveal') || 'up').toLowerCase() === 'stagger') {
        var kids = el.children;
        for (var k = 0; k < kids.length; k++) {
          kids[k].classList.add('reveal', 'is-in');
          kids[k].style.removeProperty('--i');
        }
        el.setAttribute('data-reveal-armed', '');
      } else {
        el.classList.add('reveal', 'is-in');
        el.setAttribute('data-reveal-armed', '');
      }
    }
  };

  /* If the visitor turns still mode on while the page is open, anything
     still waiting is resolved at once rather than left as a hole. */
  if (window.Motion) {
    Motion.onChange(function (isStill) {
      if (!isStill) return;
      var waiting = document.querySelectorAll('.reveal:not(.is-in)');
      for (var i = 0; i < waiting.length; i++) waiting[i].classList.add('is-in');
    });
  }
})();
