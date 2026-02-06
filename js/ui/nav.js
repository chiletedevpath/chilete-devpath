/* =========================================================
   NAV.JS | CHILETE DEVPATH
   Desktop + Mobile Overlay (dual menu)
   Alineado a HTML/CSS FINAL:
   - Button: #navToggle
   - Nav container: .nav (con data-state)
   - Overlay root: #mobile-nav-root (aria-hidden true/false)
   - Mobile menu: #mobile-navigation (ul.nav-menu--mobile)
   ========================================================= */

/* =========================================================
   MENÚ MOBILE (TOGGLE + AUTOCIERRE + ACCESIBILIDAD)
   ========================================================= */
export function initNavMenu() {
  const toggle = document.getElementById("navToggle");
  const nav    = document.querySelector(".nav");
  const root   = document.getElementById("mobile-nav-root");
  const menu   = document.getElementById("mobile-navigation");

  // Guardrails: si falta algo, no hacemos nada.
  if (!toggle || !nav || !root || !menu) return;

  // Evitar doble inicialización (hot reload / reimports / etc.)
  if (toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  let isOpen = false;

  /* -------------------------------------------------------
     Helpers: estado ARIA consistente
     ------------------------------------------------------- */
  function setOpenState(open) {
    nav.dataset.state = open ? "open" : "closed";

    // Overlay (lo usa CSS para mostrar/ocultar)
    root.setAttribute("aria-hidden", open ? "false" : "true");

    // Menú (buen patrón ARIA)
    menu.setAttribute("aria-hidden", open ? "false" : "true");

    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");

    document.body.classList.toggle("nav-locked", open);
  }

  /* -------------------------------------------------------
     Focus helpers
     ------------------------------------------------------- */
  function focusFirstLink() {
    // Primer link disponible en el menú móvil
    const first = menu.querySelector("a[href]");
    first?.focus();
  }

  function restoreFocusToToggle() {
    toggle.focus?.();
  }

  /* -------------------------------------------------------
     OPEN
     ------------------------------------------------------- */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    setOpenState(true);

    // Enfoca el primer link (accesibilidad)
    // Pequeño defer para asegurar que el overlay ya está "visible"
    requestAnimationFrame(() => focusFirstLink());

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("pointerdown", onPointerDownOutside, { passive: true });
  }

  /* -------------------------------------------------------
     CLOSE
     ------------------------------------------------------- */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    setOpenState(false);

    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("pointerdown", onPointerDownOutside);

    // Devuelve el foco al toggle
    restoreFocusToToggle();
  }

  /* -------------------------------------------------------
     TOGGLE CLICK
     ------------------------------------------------------- */
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  /* -------------------------------------------------------
     AUTOCIERRE AL NAVEGAR (MÓVIL)
     ------------------------------------------------------- */
  menu.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  /* -------------------------------------------------------
     ESC para cerrar
     ------------------------------------------------------- */
  function onKeydown(e) {
    if (e.key === "Escape") closeMenu();
  }

  /* -------------------------------------------------------
     Click fuera (robusto)
     - Si haces click en el overlay fuera del UL → cierra
     - Si haces click en toggle → no hace nada (ya está controlado)
     ------------------------------------------------------- */
  function onPointerDownOutside(e) {
    if (!isOpen) return;

    // Si clickeas el botón toggle, no cierres (evita parpadeo)
    if (toggle.contains(e.target)) return;

    // Si clickeas dentro del menú, no cierres
    if (menu.contains(e.target)) return;

    // Si clickeas en cualquier parte del overlay root (fuera del menu), cierra
    if (root.contains(e.target)) closeMenu();
  }

  /* -------------------------------------------------------
     SAFETY: al volver a desktop, cerramos
     ------------------------------------------------------- */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  /* -------------------------------------------------------
     Estado inicial coherente (por si el HTML viene raro)
     ------------------------------------------------------- */
  setOpenState(false);
}

/* =========================================================
   LINK ACTIVO (DESKTOP + MOBILE)
   ========================================================= */
export function initActiveSectionNav() {
  const sections = document.querySelectorAll("section[id]");

  // Incluimos explícitamente desktop + mobile (claridad semántica)
  const navLinks = document.querySelectorAll(
    ".nav-menu--desktop a[href^='#'], .nav-menu--mobile a[href^='#']"
  );

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}
