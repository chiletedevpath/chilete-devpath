/* =========================================================
   ABOUT-ME.JS
   ========================================================= */

export function initAboutMe() {
  const section = document.querySelector(".about-me");
  if (!section) return;

  // Aísla animaciones globales SOLO si en el proyecto se está rompiendo cosas
  section.classList.remove("animate");
  section.style.pointerEvents = "auto";

  // Entrada por scroll
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          section.classList.add("is-visible");
        });
        observer.disconnect();
      }
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observer.observe(section);

  // Galería
  const photos = Array.from(section.querySelectorAll(".about-me-photo"));
  const captions = Array.from(section.querySelectorAll(".about-me-caption-item"));

  if (!photos.length || !captions.length) return;

  function setStackByActiveIndex(activeIndex) {
    const n = photos.length;

    photos.forEach((photo, i) => {
      photo.classList.remove("is-active", "is-back-1", "is-back-2");

      const isActive = i === activeIndex;

      // Orden correlativo circular
      const nextIndex = (activeIndex + 1) % n;
      const nextNextIndex = (activeIndex + 2) % n;

      if (isActive) photo.classList.add("is-active");
      else if (i === nextIndex) photo.classList.add("is-back-1");
      else if (i === nextNextIndex) photo.classList.add("is-back-2");

      photo.setAttribute("aria-pressed", String(isActive));
    });
  }

  function activateStage(key) {
    const activeIndex = photos.findIndex((p) => p.dataset.key === key);
    if (activeIndex < 0) return;

    // 1) Stack visual correlativo
    setStackByActiveIndex(activeIndex);

    // 2) Caption correlativa
    captions.forEach((caption) => {
      caption.classList.toggle("is-active", caption.dataset.key === key);
    });
  }

  // Estado inicial
  const initial = photos.find((p) => p.classList.contains("is-active")) || photos[0];
  activateStage(initial.dataset.key);

  // Click para activar
  photos.forEach((photo) => {
    photo.addEventListener("click", () => {
      activateStage(photo.dataset.key);
    });
  });
}
