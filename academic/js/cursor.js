/* ============================================================
   JS/CURSOR.JS
   A custom two-part cursor (a small solid dot + a larger ring that
   trails slightly behind it) for desktop/mouse visitors on the
   Academic side. Deliberately does nothing on touch devices — a
   custom cursor has no meaning without a mouse, and forcing it
   there would just be wasted code and a worse experience.

   This is a first version: the dot/ring follow the pointer and the
   ring grows + highlights over interactive elements. The "nested
   frame" hover effect Hussein asked for is a distinct, more
   involved visual treatment — built separately in a later step,
   layered on top of this same foundation.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
});

function initCustomCursor() {
  // Bail out entirely on touch/coarse-pointer devices — matches
  // the brief's own note: "يتوقف على الأجهزة اللمسية."
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    // The dot tracks the pointer exactly — no lag, so it always
    // feels precisely attached to the real cursor position.
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // The ring eases toward the pointer instead of snapping to it,
  // which is what gives it that "trailing" premium feel. Runs on
  // requestAnimationFrame rather than the mousemove event itself,
  // so the easing stays smooth even if mousemove fires irregularly.
  function animateRing() {
    const EASE = 0.18;
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Grows and highlights the ring over anything clickable, so the
  // cursor itself signals "this is interactive" before the person
  // even reads it.
  const interactiveSelector = 'a, button, .cert-card--clickable, [role="button"], input, .filter-chip';

  function isInteractive(node) {
    return !!(node && node.closest && node.closest(interactiveSelector));
  }
  function setHovering(on) {
    ring.classList.toggle('is-hovering-interactive', !!on);
  }

  // Recompute the state from whatever the pointer moves ONTO. mouseover
  // fires for every element entered, so moving off a control onto any
  // ordinary element clears the grown ring — this is what fixes the
  // "stuck as if still over the zoom / close control" case: even if that
  // control vanished from under the pointer (a viewer/modal that just
  // closed), the very next move onto normal content relaxes the ring
  // instead of only reacting to a mouseout that never came.
  document.addEventListener('mouseover', (event) => {
    setHovering(isInteractive(event.target));
  });

  // Leaving an element toward empty space or out of the window
  // (relatedTarget null or non-interactive) relaxes immediately too.
  document.addEventListener('mouseout', (event) => {
    if (!isInteractive(event.relatedTarget)) setHovering(false);
  });

  // Explicit reset for the case where the hovered control is hidden or
  // removed WITHOUT any pointer event firing — a modal / media viewer
  // closing, or the viewer swapping images. js/media-system.js dispatches
  // `cursor:reset` on every close so the ring never stays stuck.
  document.addEventListener('cursor:reset', () => setHovering(false));

  // Fades the cursor out entirely when it leaves the browser window,
  // instead of leaving a static dot stuck at the last known position —
  // and relaxes the ring so it doesn't return in a stale grown state.
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    setHovering(false);
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
