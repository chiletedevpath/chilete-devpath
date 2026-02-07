/* ============================================================
   HERO.JS
   ============================================================ */

import { ANIMATION } from "../core/animation-config.js";

export function initHero() {
  /* =========================================================
     PRELOADER YA TERMINÓ, SE EJECUTA:
     ========================================================= */

  if (document.body.classList.contains("hero-ready")) {
    initHeroBadgesAnimation();
    return;
  }

  /* =========================================================
     ESPERA SEÑAL DEL PRELOADER
     ========================================================= */

  document.addEventListener("preloader:done", initHeroBadgesAnimation, { once: true });
}

/* ============================================================
   HERO – BADGES / PILARES
   ============================================================ */

function initHeroBadgesAnimation() {
  const heroSection = document.querySelector(".hero-section");
  const badges = document.querySelectorAll(".hero-badge");

  if (!heroSection || !badges.length) return;

  /* =========================================================
     ESTADO INICIAL
     ========================================================= */

  gsap.set(badges, {
    opacity: 0,
    y: 28,
    scale: 0.96
  });

  let isAnimated = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isAnimated) {
        isAnimated = true;

        gsap.to(badges, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.18,
          delay: ANIMATION.HERO_BADGE_DELAY / 1000
        });
      }
    },
    {
      threshold: ANIMATION.THRESHOLD_HERO
    }
  );

  observer.observe(heroSection);
}
