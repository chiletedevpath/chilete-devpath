/* =========================================================
   MAIN.JS | CHILETE DEVPATH
   Orquestador principal del frontend
   ========================================================= */

/* =========================================================
   IMPORTS ESTÁTICOS (CORE UI)
   ========================================================= */

import { initNavMenu, initActiveSectionNav } from "./ui/nav.js";
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

console.info(
  "%cChilete DevPath iniciado correctamente",
  "color:#8fd3f4;font-weight:600"
);

/* =========================================================
   DOM READY — ORQUESTACIÓN CENTRAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     0) SCROLL ANIMATIONS (PRE-REGISTRO)
     ------------------------------------------------------- */
  initScrollAnimations();

  /* -------------------------------------------------------
     1) PRELOADER (BLOQUEANTE)
     ------------------------------------------------------- */
  initPreloader(async () => {

    /* -----------------------------------------------------
       2) SIDE-EFFECTS POST-PRELOADER (ESTADO GLOBAL)
       ----------------------------------------------------- */
    try {
      const [
        { initParticles },
        { default: initI18n }
      ] = await Promise.all([
        import("./ui/particles.js"),
        import("./ui/i18n.js")
      ]);

      if (typeof initI18n === "function") {
        initI18n();
      } else {
        console.warn("i18n no exporta una función default válida");
      }

      if (typeof initParticles === "function") {
        initParticles();
      }

    } catch (err) {
      console.warn("Side-effects fallaron:", err);
    }

    /* -----------------------------------------------------
       3) HEADER / NAV
       ----------------------------------------------------- */
    initHeader();

    /* -----------------------------------------------------
       4) HERO
       ----------------------------------------------------- */
    initHeroSection();

    /* -----------------------------------------------------
       5) MARCA GLOBAL
       ----------------------------------------------------- */
    document.body.classList.add("hero-ready");

    /* -----------------------------------------------------
       6) DEVPATH
       ----------------------------------------------------- */
    initDevPathAnimation();
    initQuoteSlide();

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

function initHeader() {
  initNavMenu();
  initActiveSectionNav();
  initHeaderScrollState();
}

function initHeroSection() {
  initHero();
  initHeroTerminal();
  initHeroParallax();
}

/* =========================================================
   HEADER — SCROLL STATE
   ========================================================= */

function initHeaderScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const headerHeight =
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")
    ) || 60;

  let ticking = false;

  const update = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      header.classList.toggle("scrolled", window.scrollY > headerHeight);
      ticking = false;
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
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
      const progress = Math.min(
        Math.max(-rect.top / rect.height, 0),
        1
      );
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
    nodes.forEach(n => n.classList.remove("is-active"));
  };

  const activate = () => {
    section.classList.add("is-visible");
    nodes.forEach((node, i) => {
      timers.push(
        setTimeout(() => node.classList.add("is-active"), i * 420)
      );
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
