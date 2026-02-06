/* =========================
   TERMINAL.JS
   ========================= */

import {
  CONSOLE_LINES_ES,
  CONSOLE_LINES_EN
} from "../i18n/console-lines.js";

import {
  getCurrentLang,
  onLanguageChange
} from "../ui/i18n.js";

/* =========================
   DEVICE FLAGS
   ========================= */

const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* =========================
   UTIL
   ========================= */

function getConsoleLines(lang) {
  return lang === "en"
    ? CONSOLE_LINES_EN
    : CONSOLE_LINES_ES;
}

function isSystemReady() {
  const hero = document.querySelector(".hero-section");
  const pre  = document.getElementById("preloader");

  if (!hero) return false;

  return !pre || hero.classList.contains("is-ready") || document.body.classList.contains("hero-ready");
}

function isHeroVisible(hero) {
  const rect = hero.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.75 && rect.bottom > vh * 0.25;
}

/* =========================
   RENDER
   ========================= */

function renderHeroTerminal() {

  const output = document.getElementById("console-output");
  if (!output) return null;

  if (output.dataset.running === "true") return null;
  output.dataset.running = "true";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cursor = document.createElement("span");
  cursor.className = "terminal-cursor";

  const lines = getConsoleLines(getCurrentLang());

  let index = 0;
  let active = true;
  let timer = null;

  output.innerHTML = "";
  output.appendChild(cursor);

  const LINE_DELAY  = reduceMotion ? 0 : (isMobile ? 140 : 220);
  const BLOCK_DELAY = reduceMotion ? 0 : (isMobile ? 260 : 420);
  const START_DELAY = reduceMotion ? 0 : (isMobile ? 120 : 250);

  function write() {
    if (!active) return;
    if (!output.contains(cursor)) return;

    if (index >= lines.length) return;

    const line = lines[index++];
    cursor.insertAdjacentHTML("beforebegin", line + "<br>");

    const delay =
      line.includes("System.out") || line.includes("String")
        ? BLOCK_DELAY
        : LINE_DELAY;

    timer = setTimeout(write, delay);
  }

  timer = setTimeout(write, START_DELAY);

  return () => {
    active = false;
    clearTimeout(timer);
    output.innerHTML = "";
    delete output.dataset.running;
  };
}

/* =========================
   INIT
   ========================= */

export function initHeroTerminal() {

  const hero   = document.querySelector(".hero-section");
  const output = document.getElementById("console-output");

  if (!hero || !output) return;

  let cleanup = null;
  let observer = null;

  function startObserver() {
    if (observer) return;

    observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting && !cleanup) {
          cleanup = renderHeroTerminal();
        }

        if (!entry.isIntersecting && cleanup && !isMobile) {
          cleanup();
          cleanup = null;
        }

      },

      { threshold: isMobile ? 0.25 : 0.6}

    );

    observer.observe(hero);

    if (isHeroVisible(hero) && !cleanup) {
      cleanup = renderHeroTerminal();
    }
  }

  function boot() {
    startObserver();
  }

  if (isSystemReady()) {
    boot();
  } else {
    document.addEventListener("preloader:done", boot, { once: true });
  }

  onLanguageChange(() => {
    if (cleanup) cleanup();
    cleanup = renderHeroTerminal();
  });

}
