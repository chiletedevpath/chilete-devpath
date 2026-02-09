/* =========================================================
    MAIN.JS | CHILETE DEVPATH
    Orquestador principal del frontend
    ========================================================= */

/* =========================================================
    IMPORTS CORE
    ========================================================= */

import { initNavMenu, initActiveSectionNav, initLogoScrollReset } from "./ui/nav.js";
import { initScrollAnimations } from "./ui/scroll.js";

import { initPreloader } from "./preloader.js";
import { initHero } from "./hero/hero.js";
import { initHeroTerminal } from "./hero/terminal.js";

import { initAboutMe } from "./ui/about-me.js";
import { initConnect } from "./ui/connect.js";
import { initConnectMail } from "./ui/connect-mail.js";

/* =========================================================
    LOG GLOBAL
    ========================================================= */

console.info("%cChilete DevPath iniciado correctamente", "color:#8fd3f4;font-weight:600");

/* =========================================================
    DOM READY — ORQUESTACIÓN CENTRAL
    ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------
      1) HEADER / NAV (CRÍTICO · INDEPENDIENTE)
      ------------------------------------------------------- */
  initHeader();

  /* -------------------------------------------------------
      2) PRELOADER (BLOQUE VISUAL CONTROLADO)
      ------------------------------------------------------- */
  initPreloader(async () => {
    /* -----------------------------------------------------
          3) SIDE EFFECTS POST- (LAZY)
          ----------------------------------------------------- */
    try {
      const [{ initParticles }, { default: initI18n }] = await Promise.all([
        import("./ui/particles.js"),
        import("./ui/i18n.js")
      ]);

      if (typeof initI18n === "function") {
        initI18n();
      } else {
        console.warn("i18n: export default inválido");
      }

      if (typeof initParticles === "function") {
        initParticles();
      }
    } catch (err) {
      console.warn("Side-effects fallaron:", err);
    }

    /* -----------------------------------------------------
          4) HERO
          ----------------------------------------------------- */
    initHeroSection();
    initScrollAnimations();

    /* -----------------------------------------------------
          5) MARCA GLOBAL
          ----------------------------------------------------- */
    document.body.classList.add("hero-ready");

    /* -----------------------------------------------------
          6) DEVPATH
          ----------------------------------------------------- */
    requestAnimationFrame(() => {
      initDevPathAnimation();
      initQuoteSlide();
    });
    /* -----------------------------------------------------
          7) ABOUT ME
          ----------------------------------------------------- */
    initAboutMe();

    /* -----------------------------------------------------
          8) CONNECT
          ----------------------------------------------------- */
    initConnect();
    initConnectMail();
  });
});

/* =========================================================
    INICIALIZADORES DE ALTO NIVEL
    ========================================================= */

/* Protección contra doble init */
let headerInitialized = false;

function initHeader() {
  if (headerInitialized) return;
  headerInitialized = true;

  initNavMenu();
  initActiveSectionNav();
  initLogoScrollReset();
}
function initHeroSection() {
  initHero();
  initHeroTerminal();

  const enableParallax = () => {
    initHeroParallax();
    window.removeEventListener("scroll", enableParallax);
  };

  window.addEventListener("scroll", enableParallax, { once: true, passive: true });
}

/* =========================================================
    HERO — PARALLAX
    ========================================================= */

function initHeroParallax() {
  const hero = document.querySelector("#hero");
  const heroBg = document.querySelector(".hero-bg");
  if (!hero || !heroBg) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);

      heroBg.style.transform = `translateY(${progress * 40}px)`;

      ticking = false;
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* =========================================================
    DEVPATH — ANIMACIÓN SEMÁNTICA
    ========================================================= */

function initDevPathAnimation() {
  const section = document.querySelector("#devpath");
  const nodes = document.querySelectorAll(".devpath-scheme .node");
  if (!section || !nodes.length) return;

  let isActive = false;
  let timers = [];

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const reset = () => {
    clearTimers();
    section.classList.remove("is-visible");
    nodes.forEach((n) => n.classList.remove("is-active"));
  };

  const activate = () => {
    section.classList.add("is-visible");
    nodes.forEach((node, i) => {
      timers.push(setTimeout(() => node.classList.add("is-active"), i * 420));
    });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isActive) {
        isActive = true;
        activate();
      } else if (!entry.isIntersecting && isActive) {
        isActive = false;
        reset();
      }
    },
    { threshold: 0.35 }
  );

  observer.observe(section);
}

/* =========================================================
    CITA EDITORIAL
    ========================================================= */

function initQuoteSlide() {
  const quote = document.querySelector(".section-quote");
  if (!quote) return;

  const observer = new IntersectionObserver(
    ([entry], obs) => {
      if (!entry.isIntersecting) return;
      quote.classList.add("is-visible");
      obs.unobserve(quote);
    },
    { threshold: 0.3 }
  );

  observer.observe(quote);
}
