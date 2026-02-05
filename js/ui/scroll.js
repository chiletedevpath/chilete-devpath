/* =========================================================
   SCROLL.JS
   ========================================================= */

import { ANIMATION } from "../core/animation-config.js";

let observer = null;

export function initScrollAnimations() {

  const elements = document.querySelectorAll(".animate");
  if (!elements.length) return;

  /* =====================================================
     CLEANUP PREVIO (re-entrable)
     ===================================================== */
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  /* =====================================================
     FALLBACK
     ===================================================== */
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  observer = new IntersectionObserver(onIntersect, {
    threshold: ANIMATION.THRESHOLD_BASE,
    rootMargin: ANIMATION.ROOT_MARGIN
  });

  elements.forEach(el => {
    el.classList.remove("is-visible"); // reset seguro
    observer.observe(el);
  });
}

/* =========================================================
   CALLBACK
   ========================================================= */

function onIntersect(entries, obs) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    el.classList.add("is-visible");
    obs.unobserve(el);
  });
}
