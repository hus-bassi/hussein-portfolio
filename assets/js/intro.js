/* ============================================================
   The opening sequence — runs BEFORE first paint.

   Puts the hero in its "one step away" state, then releases it on the
   first animation frame. Two safeguards, because a hidden hero is the
   worst possible failure for this site:

     1. rAF runs it, so the release is tied to the real first paint.
     2. a setTimeout fallback removes the class regardless, so if rAF is
        throttled, scripts are blocked, or anything throws, the content
        is visible within 1.2s no matter what.

   The class is added and removed here rather than in site.js so it works
   on all three pages without a dependency, and so the hero never paints
   in its final position and then jumps.
   ============================================================ */
(function () {
  var root = document.documentElement;
  root.classList.add('is-loading');

  var released = false;
  function release() {
    if (released) return;
    released = true;
    root.classList.remove('is-loading');
  }

  if (window.requestAnimationFrame) {
    requestAnimationFrame(function () { requestAnimationFrame(release); });
  }
  /* the safety net: whatever happens — throttled rAF, a blocked script,
     an exception — the content is visible within 1.2s. A hidden hero is
     the worst possible failure for this site, and it must never be able
     to happen. */
  setTimeout(release, 1200);
})();
