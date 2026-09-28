/* ============================================================
   REVEAL — one observer, one vocabulary, six behaviours.

   Every section that arrives with the scroll goes through here. The markup
   says what it wants:

       data-reveal="up"       rises and resolves out of blur   (default)
       data-reveal="mask"     wipes open from one edge
       data-reveal="scale"    settles down from slightly larger
       data-reveal="line"     a hairline that draws itself across
       data-reveal="blur"     a large statement — the same arrival, unhurried
       data-reveal="stagger"  the children arrive in order

   Plus the one arrival that is not a scroll reveal at all: the page's own
   heading, which is above the fold, is answered by Reveal.enter() below.

   WHY ONE MODULE
   --------------
   The previous version had the reveal logic written out three times — once
   in site.js, once in page.js, and once again for the records page — each
   with its own IntersectionObserver, its own threshold, and its own
   `transitionDelay` bookkeeping. They had already drifted apart. This is
   the single copy, and the stagger is expressed in CSS (`--i` × --stagger)
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
      flushPassed();
      /* threshold .01, with a FIFTH of the viewport held back at the bottom:
         an element starts arriving while it is still a fifth of a screen
         below the fold, so the page is already assembling itself as it
         comes up — the reveal no longer starts after the eye has landed on
         it. The margin is what keeps the LAST item on a page from sitting at
         opacity 0, and the callback above is what keeps a target the margin
         could never reach from sitting there too. */
    }, { rootMargin: '0px 0px -20% 0px', threshold: .01 });
    return io;
  }

  /* ============================================================
     THE ONES A FAST SCROLL JUMPS OVER.

     An IntersectionObserver reports a target when the two states DISAGREE.
     An element that a single scroll step carries from below the band to
     above it is outside the root rect before and after, so its ratio is 0
     on both sides of the change, no threshold is crossed, and no entry is
     ever queued for it. It is not late. It is never coming, and it sits at
     opacity 0 for the rest of the session.

     That is not hypothetical here: reading it in this browser, a page
     scrolled in 200px steps revealed 41 of 42 targets, and the same page
     scrolled in 1200-2000px steps left six of them permanently blank —
     a whole section heading, three stat cards, a record and another
     heading. Anything that moves the scroll position in one go does it:
     a flicked wheel, End, a restored position on reload, a deep link.
     A slow reader never sees it, which is exactly why it survives.

     So the observer's own callback also settles what it has already passed.
     Anything still waiting whose bottom edge is above the top of the screen
     can never intersect again, and arriving is no longer a verb that
     applies to it.

     WHAT THIS COSTS, precisely, because the whole point of the reveal
     system is that it is not a scroll loop: no new observer, no new clock,
     no listener, nothing per frame. It runs only when the observer has just
     fired — a handful of times in a page's life, not once per scroll event —
     it reads only elements that are still hidden (a number that falls to
     zero and never rises), and it does all of its reads before its first
     write, so a whole pass costs at most one reflow. There is no layout
     read on a scroll event anywhere in this file.

     BUT NOT ANYTHING WITH NO BOX. getBoundingClientRect() on an element
     inside a hidden or display:none container returns all zeros - top 0,
     bottom 0, height 0 - and the test for a bottom edge at or above the top
     of the screen read that as 'scrolled past', so the flush was settling
     content that had never been on screen at all. Measured: a .reveal
     inside a hidden div came back reveal is-in one observer tick later, and
     when the container was finally shown the element sat at opacity 1 with
     zero running transitions - permanently un-animatable, which is the one
     failure this engine exists to prevent. index.html ships #projects-list
     hidden and renders into it.

     Skipping a zero-height element is not a second way to leave content
     blank, and that is the whole reason it is safe: an
     IntersectionObserver reports a target whose box appears and intersects,
     because the ratio changes from 0 to non-zero. The moment a hidden list
     is shown and its children have real boxes, the observer queues an entry
     and they animate as they should have. And if they are shown already
     scrolled past, this same pass catches them a moment later, now with a
     real height.
     ============================================================ */
  function flushPassed() {
    var waiting = document.querySelectorAll('.reveal:not(.is-in)');
    if (!waiting.length) return 0;
    var passed = [];
    for (var i = 0; i < waiting.length; i++) {
      var box = waiting[i].getBoundingClientRect();
      if (!box.height) continue;
      if (box.bottom <= 0) passed.push(waiting[i]);
    }
    for (var j = 0; j < passed.length; j++) passed[j].classList.add('is-in');
    return passed.length;
  }

  /* The nodes one data-reveal element actually arms, and where each one sits
     in a cascade. PURE: nothing is touched, so a caller can decide what to do
     with a node before committing a class to it. That is what lets resolve()
     leave a boxless node alone and come back to it later. */
  function targets(el) {
    var kind = (el.getAttribute('data-reveal') || 'up').toLowerCase();
    if (kind !== 'stagger') return [{ node: el, order: null, kind: kind }];
    var kids = el.children, out = [];
    for (var i = 0; i < kids.length; i++) out.push({ node: kids[i], order: i, kind: 'up' });
    return out;
  }

  /* THE ONE RECIPE for what an armed target looks like: the arrival class, the
     behaviour its kind asks for, and its place in the sequence. Both entry
     points go through here, so a group and a single element can never drift. */
  function mark(t) {
    t.node.classList.add('reveal');
    if (t.order === null) t.node.style.removeProperty('--i');
    else t.node.style.setProperty('--i', String(t.order));
    if (t.kind === 'mask') t.node.classList.add('reveal-mask');
    else if (t.kind === 'scale') t.node.classList.add('reveal-scale');
    else if (t.kind === 'line') t.node.classList.add('reveal-line');
    else if (t.kind === 'blur') t.node.classList.add('reveal-blur');
    /* no class for 'up': it IS the base arrival, and a class with no rule
       behind it is a hook for nothing */
  }

  /* Arm a whole data-reveal element and return the nodes to watch, or settle
     them now if the page is still. */
  function arm(el, immediate) {
    if (el.hasAttribute('data-reveal-armed')) return [];
    el.setAttribute('data-reveal-armed', '');
    var list = targets(el), out = [];
    for (var i = 0; i < list.length; i++) { mark(list[i]); out.push(list[i].node); }
    if (immediate) {
      for (var j = 0; j < out.length; j++) out[j].classList.add('is-in');
      return [];
    }
    return out;
  }

  /* ============================================================
     THE PAGE'S OWN HEADING.

     `.page-head` is an ENTRANCE, not a scroll reveal: it is above the fold,
     so there is nothing to scroll to, and it is already on screen when the
     page arrives. That is why it is answered here instead of by the
     observer.

     It used to live in page.js, behind two nested requestAnimationFrames,
     and that arrangement failed in three separate ways. records.html does
     not load page.js, so its title was never revealed at all and sat at
     opacity 0 for good. A page whose frames never ran — a tab restored in
     the background, a prerender, a hidden tab on mobile — left the name
     hidden for as long as it stayed that way. And nothing about it was
     covered by the reduced-motion block, so a visitor who has asked for
     still mode was given the longest, blurriest arrival on the site.

     So it is HERE, it answers to the same `still()` every other reveal
     answers to, and it self-initialises. Self-initialising is the part that
     matters: a page cannot forget to call this, which is the only reason
     the first version of it broke.

     Under still mode — and wherever there is no requestAnimationFrame to be
     had — `is-entering` is never set at all, and the final state is
     therefore the initial state. Nothing is hidden for even one frame, so
     the CSS alone carries the still-mode contract and this function is not
     load-bearing for readability.
     ============================================================ */
  Reveal.enter = function () {
    var head = document.querySelector('.page-head');
    if (!head) return false;
    if (still() || typeof window.requestAnimationFrame !== 'function') {
      head.classList.add('is-in');
      return true;
    }
    /* Two frames, not one: the first lets the browser lay out and paint the
       entry state, and only the second flips to the final one, so the
       transition has a start value to travel from. */
    document.documentElement.classList.add('is-entering');
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { head.classList.add('is-in'); });
    });
    /* The net under those frames, and the reason this is not a rAF-shaped
       hole: if they never arrive, the page's own name must not be the thing
       left invisible. One timer, not a chain — it puts the head in its
       final state and drops the class that carries the entry delays, which
       is what makes a still page stop being a slow one.

       1600ms, and the number is not a guess: the entrance is the last
       element's delay (--stagger * 2) plus its duration (--motion-reveal),
       which is 240 + 800 = 1040ms. The net has to outlast that, and it used
       to be 2800 — sized for a 2.6s sequence that no longer exists, which
       meant that on any page where the frames did not arrive the name sat
       blank for nearly three seconds before anything rescued it. */
    window.setTimeout(function () {
      head.classList.add('is-in');
      document.documentElement.classList.remove('is-entering');
    }, 1600);
    return true;
  };

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

  /* ============================================================
     TWO STATES, and the whole point is that they are not the same verb.

     A re-rendered list - a search, a tag filter, a language switch - is not a
     new page. What it puts on screen is a SWAP, and a swap must not make the
     visitor wait: an archive that fades its results in on every keystroke is
     an archive nobody can search. So anything at or above the fold goes
     straight to its final state, exactly as this always did.

     What it got wrong was doing that to EVERYTHING. A filtered list of thirty
     cards is mostly below the fold, and those were settled as well - so they
     were already at opacity 1 by the time the visitor scrolled to them, and
     no arrival was ever left to see. That is the same defect as the
     collapsed-container flush, reached from the other end: content made
     visible before it has been on screen can never animate. Below the fold is
     an ARRIVAL and it is watched, like any other; at or above it is a swap
     and it is simply there.

     A node with no box is neither. It is not on the page yet - a list still
     hidden, another language not yet rendered - so it is left UNARMED rather
     than committed, and a later resolve or scan picks it up once it has a
     real box. Committing to it here is what used to leave a hidden list
     permanently un-animatable.

     And note what is NOT filtered out here. The armed flag lives on the GROUP,
     and a re-render replaces the group's CHILDREN while the group element
     itself survives - so a group that was armed on first paint is still armed
     after its contents have been thrown away and rebuilt. Excluding armed
     groups therefore matched nothing at all, and the new cards were never
     armed: not settled, not watched, just present and un-animatable. mark()
     only ever adds classes, so re-marking a node that is already revealed is
     a no-op, and the group is simply re-dealt with every time.
     ============================================================ */
  Reveal.resolve = function (scope) {
    var root = scope || document;
    var found = [];
    if (root !== document && root.matches && root.matches('[data-reveal]')) found.push(root);
    var nodes = root.querySelectorAll('[data-reveal]');
    for (var i = 0; i < nodes.length; i++) found.push(nodes[i]);
    if (!found.length) return;

    var settledPage = still() || !('IntersectionObserver' in window);
    var watch = [];
    for (var j = 0; j < found.length; j++) {
      found[j].setAttribute('data-reveal-armed', '');
      var list = targets(found[j]);
      for (var k = 0; k < list.length; k++) {
        var node = list[k].node;
        var box = node.getBoundingClientRect();
        if (!box.height) continue;
        mark(list[k]);
        if (settledPage || box.top < window.innerHeight) node.classList.add('is-in');
        else watch.push(node);
      }
    }
    if (!watch.length) return;
    var ob = observer();
    for (var m = 0; m < watch.length; m++) ob.observe(watch[m]);
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

  /* The page head, answered on every page that has one, including the ones
     whose own script has never heard of it. */
  Reveal.enter();
})();
