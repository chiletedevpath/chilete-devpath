/* =========================================================
   ANIMATION-CONFIG.JS
   ========================================================= */

export const ANIMATION = {
  /* =====================================================
     INTERSECTION OBSERVER – BASE GLOBAL
     ===================================================== */

  THRESHOLD_BASE: 0.18,

  ROOT_MARGIN: "0px 0px -40px 0px",

  /* =====================================================
     THRESHOLDS POR CONTEXTO
     ===================================================== */

  /* Hero: entrada más consciente */
  THRESHOLD_HERO: 0.45,

  /* Header: navegación activa */
  THRESHOLD_NAV: 0.6,

  /* =====================================================
     DELAYS BASE (ms)
     ===================================================== */

  /* Entrada inicial del hero (post-preloader) */
  HERO_ENTRY_DELAY: 320,

  /* Badges del hero (stagger)  */
  HERO_BADGE_DELAY: 220,

  /* =====================================================
     SECUENCIAS NARRATIVAS
     ===================================================== */

  /* DevPath: nodos principales */
  DEVPATH_NODE_DELAY: 260,

  /* Alternativo */
  DEVPATH_NODE_ALT_DELAY: 300
};
