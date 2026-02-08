/* =========================
   TERMINAL.JS
   ========================= */

import { CONSOLE_LINES_ES, CONSOLE_LINES_EN } from "../i18n/console-lines.js";
import { getCurrentLang, onLanguageChange } from "../ui/i18n.js";

/* =========================
   FLAGS
   ========================= */

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================
   UTIL
   ========================= */

function getConsoleLines(lang) {
  return lang === "en" ? CONSOLE_LINES_EN : CONSOLE_LINES_ES;
}

function isSystemReady() {
  const hero = document.querySelector(".hero-section");
  const pre = document.getElementById("preloader");
  return hero && (!pre || document.body.classList.contains("hero-ready"));
}

function isHeroVisible(hero) {
  const r = hero.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top < vh * 0.75 && r.bottom > vh * 0.25;
}

function followCursor(output) {
  output.scrollTop = output.scrollHeight;
}

/* =========================
   CORE
   ========================= */

function typeHtmlLine({ container, html, cursor, onDone }) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const nodes = Array.from(temp.childNodes);
  let nodeIndex = 0;
  let charIndex = 0;

  const CHAR_DELAY = prefersReducedMotion ? 0 : isMobile ? 18 : 26;

  function step() {
    if (nodeIndex >= nodes.length) {
      onDone();
      return;
    }

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      if (!container._textNode) {
        container._textNode = document.createTextNode("");
        cursor.before(container._textNode);
      }

      if (charIndex < node.textContent.length) {
        container._textNode.textContent += node.textContent.charAt(charIndex++);
        followCursor(container.parentElement);
        setTimeout(step, CHAR_DELAY);
        return;
      }

      charIndex = 0;
      container._textNode = null;
      nodeIndex++;
      step();
      return;
    }

    const clone = node.cloneNode(true);
    cursor.before(clone);
    nodeIndex++;
    followCursor(container.parentElement);
    setTimeout(step, CHAR_DELAY);
  }

  step();
}

function renderHeroTerminal() {
  const output = document.getElementById("console-output");
  if (!output || output.dataset.running === "true") return null;
  output.dataset.running = "true";

  const cursor = document.createElement("span");
  cursor.className = "terminal-cursor";

  const lines = getConsoleLines(getCurrentLang());

  let lineIndex = 0;
  let active = true;
  let timer = null;

  output.innerHTML = "";
  output.appendChild(cursor);

  const LINE_PAUSE = prefersReducedMotion ? 0 : isMobile ? 260 : 420;
  const BLOCK_PAUSE = prefersReducedMotion ? 0 : isMobile ? 420 : 650;

  function nextLine() {
    if (!active || lineIndex >= lines.length) return;

    const lineWrapper = document.createElement("div");
    lineWrapper.className = "terminal-line";
    cursor.before(lineWrapper);

    typeHtmlLine({
      container: lineWrapper,
      html: lines[lineIndex],
      cursor,
      onDone: () => {
        cursor.before(document.createElement("br"));
        followCursor(output);

        const pause =
          lines[lineIndex].includes("System.out") ||
          lines[lineIndex].includes("{") ||
          lines[lineIndex].includes("}")
            ? BLOCK_PAUSE
            : LINE_PAUSE;

        lineIndex++;
        timer = setTimeout(nextLine, pause);
      }
    });
  }

  nextLine();

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
  const hero = document.querySelector(".hero-section");
  const output = document.getElementById("console-output");
  if (!hero || !output) return;

  let cleanup = null;
  let observer = null;

  function start() {
    if (observer) return;

    observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !cleanup) cleanup = renderHeroTerminal();
        if (!e.isIntersecting && cleanup && !isMobile) {
          cleanup();
          cleanup = null;
        }
      },
      { threshold: isMobile ? 0.25 : 0.6 }
    );

    observer.observe(hero);
    if (isHeroVisible(hero) && !cleanup) cleanup = renderHeroTerminal();
  }

  if (isSystemReady()) start();
  else document.addEventListener("preloader:done", start, { once: true });

  onLanguageChange(() => {
    if (cleanup) cleanup();
    cleanup = renderHeroTerminal();
  });
}
