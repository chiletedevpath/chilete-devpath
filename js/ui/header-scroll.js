/* =========================================================
   HEADER-SCROLL.JS
   ========================================================= */

export function initHeaderScroll() {

  const header = document.querySelector(".site-header");
  if (!header) return;

  // Respeta reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Umbral semántico
  const SCROLL_THRESHOLD = header.offsetHeight * 0.15;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let isScrolled = false;

  function updateHeaderState(currentScrollY) {
    const shouldBeScrolled = currentScrollY > SCROLL_THRESHOLD;

    // Evita toggles innecesarios
    if (shouldBeScrolled === isScrolled) return;

    isScrolled = shouldBeScrolled;
    header.classList.toggle("scrolled", isScrolled);
  }

  function onScroll() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      // En reduced motion solo estado binario
      if (prefersReducedMotion) {
        updateHeaderState(currentScrollY);
        ticking = false;
        return;
      }

      // Evita micro scrolls (ruido)
      if (Math.abs(currentScrollY - lastScrollY) < 2) {
        ticking = false;
        return;
      }

      updateHeaderState(currentScrollY);
      lastScrollY = currentScrollY;
      ticking = false;
    });
  }

  // Estado inicial (reload en medio de la página)
  updateHeaderState(window.scrollY);

  window.addEventListener("scroll", onScroll, { passive: true });
}
