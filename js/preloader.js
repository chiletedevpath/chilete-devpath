/* =========================================================
   PRELOADER.JS
   ========================================================= */

import { t, onLanguageChange } from "./ui/i18n.js";

export function initPreloader(onComplete) {

  /* =========================================================
     REFERENCIAS DOM
     ========================================================= */

  const preloader = document.getElementById("preloader");
  const statusEl  = document.getElementById("preloaderStatus");
  const bar       = preloader?.querySelector(".preloader-bar");

  /* =========================================================
     FALLBACK ABSOLUTO
     ========================================================= */

  if (!preloader || !bar) {
    document.querySelector(".hero-section")?.classList.add("is-ready");
    document.dispatchEvent(new CustomEvent("preloader:done"));
    onComplete?.();
    return;
  }

  /* =========================================================
     ESTADO GLOBAL
     ========================================================= */

  document.body.classList.add("is-loading");
  preloader.setAttribute("aria-busy", "true");

  /* =========================================================
     MENSAJES NARRATIVOS
     ========================================================= */

  function getSteps() {
    return [
      t("preloader.steps.0"),
      t("preloader.steps.1"),
      t("preloader.steps.2"),
      t("preloader.steps.3")
    ];
  }

  let steps = getSteps();
  let stepIndex = 0;

  /* 1: PINTAR TEXTO INICIAL INMEDIATAMENTE */
  if (statusEl) {
    statusEl.textContent = steps[stepIndex];
  }

  /* 2: REACTUALIZAR TEXTO AL CAMBIAR IDIOMA */
  onLanguageChange(() => {
    steps = getSteps();
    if (statusEl) {
      statusEl.textContent = steps[stepIndex];
    }
  });

  const msgTimer = setInterval(() => {
    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    if (statusEl) {
      statusEl.textContent = steps[stepIndex];
    }
  }, 520);

  /* =========================================================
     FINALIZADOR
     ========================================================= */

  let finalized = false;

  function finalizePreloader() {
    if (finalized) return;
    finalized = true;

    clearInterval(msgTimer);
    clearTimeout(safetyTimer);

    preloader.setAttribute("aria-busy", "false");
    preloader.classList.add("is-done");
    document.body.classList.remove("is-loading");

    setTimeout(() => {
      preloader.remove();
      document.querySelector(".hero-section")?.classList.add("is-ready");
      document.dispatchEvent(new CustomEvent("preloader:done"));
      onComplete?.();
    }, 400);
  }

  /* =========================================================
     SINCRONIZACIÓN CSS
     ========================================================= */

  bar.addEventListener("animationend", finalizePreloader, { once: true });

  /* =========================================================
     FALLBACK DE SEGURIDAD
     ========================================================= */

  const SAFETY_TIMEOUT = 4200;
  const safetyTimer = setTimeout(finalizePreloader, SAFETY_TIMEOUT);
}
