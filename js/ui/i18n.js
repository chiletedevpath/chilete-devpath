/* =========================================================
   I18N.JS 
   ========================================================= */

import { translations } from "../i18n/translations.js";

/* =========================================================
   ESTADO ÚNICO DE IDIOMA
   ========================================================= */

const DEFAULT_LANG = "es";
let currentLang = localStorage.getItem("lang") || DEFAULT_LANG;

/* =========================================================
   OBSERVADORES (JS REACTIVO)
   ========================================================= */

const languageListeners = new Set();

/**
 * Permite a otros módulos reaccionar al cambio de idioma
 * @param {(lang:string)=>void} cb
 */
export function onLanguageChange(cb) {
  if (typeof cb === "function") {
    languageListeners.add(cb);
  }
}

function notifyLanguageChange() {
  languageListeners.forEach((cb) => {
    try {
      cb(currentLang);
    } catch (err) {
      console.warn("[i18n] listener error:", err);
    }
  });
}

export function getCurrentLang() {
  return currentLang;
}

/* =========================================================
   TRADUCCIÓN PROGRAMÁTICA (JS)
   ========================================================= */

/**
 * Traducción segura para JS
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  const value = translations[currentLang]?.[key];
  return typeof value === "string" ? value : key;
}

/* =========================================================
   APLICACIÓN DE IDIOMA AL DOM
   ========================================================= */

function applyLanguage(lang, root = document) {
  const dict = translations[lang];
  if (!dict) return;

  /* ---- TEXTO VISIBLE ---- */
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = dict[key];
    if (typeof value === "string" && el.textContent !== value) {
      el.textContent = value;
    }
  });

  /* ---- ARIA ---- */
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    const value = dict[key];
    if (typeof value === "string") {
      el.setAttribute("aria-label", value);
    }
  });

  /* ---- DOCUMENTO ---- */
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  localStorage.setItem("lang", lang);

  /* ---- LANGUAGE TOGGLE ---- */
  const toggle = document.getElementById("langToggle");
  if (toggle) {
    const isEN = lang === "en";

    // Texto visible = idioma destino
    toggle.textContent = isEN ? "ESPAÑOL" : "ENGLISH";

    toggle.setAttribute(
      "aria-label",
      isEN ? "Cambiar idioma a español" : "Cambiar idioma a inglés"
    );

    // Estado lógico
    toggle.setAttribute("aria-pressed", String(isEN));
  }

  notifyLanguageChange();
}

/* =========================================================
   API PÚBLICA
   ========================================================= */

/**
 * Cambia el idioma de forma explícita
 * @param {"es"|"en"} lang
 */
export function setLanguage(lang) {
  if (lang === currentLang) return;
  currentLang = lang;
  applyLanguage(currentLang);
}

/* =========================================================
   INIT (SIDE-EFFECT CONTROLADO)
   ========================================================= */

export default function initI18n() {
  applyLanguage(currentLang);

  const toggle = document.getElementById("langToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    setLanguage(currentLang === "es" ? "en" : "es");
  });
}
