/* =========================================================
   NAV.JS
   ========================================================= */

/* =========================================================
   MENÚ MOBILE (TOGGLE + AUTOCIERRE)
   ========================================================= */
export function initNavMenu() {

  const toggle = document.getElementById("navToggle");
  const menu   = document.getElementById("primary-navigation");
  const nav    = toggle?.closest("nav");

  if (!toggle || !menu || !nav) return;

  // Evita doble binding
  if (toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  function onKeydown(e) {
    if (e.key === "Escape") closeMenu();
  }

  function onClickOutside(e) {
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  }

  function openMenu() {
    menu.hidden = false;

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");

    nav.dataset.state = "open";
    document.body.classList.add("nav-locked");

    // Listener solo cuando está abierto
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("pointerdown", onClickOutside);

    // Accesibilidad: foco inicial
    menu.querySelector("a")?.focus();
  }

  function closeMenu() {
    menu.hidden = true;

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");

    nav.dataset.state = "closed";
    document.body.classList.remove("nav-locked");

    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("pointerdown", onClickOutside);
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Autocierre al navegar
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}


/* =========================================================
   LINK ACTIVO SEGÚN SECCIÓN VISIBLE
   ========================================================= */
export function initActiveSectionNav() {

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach(link => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${id}`
          );
        });
      });

    },
    {
      // Zona central del viewport manda
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
}
