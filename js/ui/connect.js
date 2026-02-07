/* =========================================================
   CONNECT.JS
   ========================================================= */

export function initConnect() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* =======================================================
     1) MANIFIESTO
     ======================================================= */

  const manifesto = document.querySelector(".connect-manifesto");
  if (manifesto) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#conversemos",
        start: "top 75%"
      }
    });

    tl.from(manifesto, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: "power2.out"
    }).from(
      manifesto.children,
      {
        opacity: 0,
        y: 14,
        duration: 0.55,
        stagger: 0.14,
        ease: "power2.out"
      },
      "-=0.45"
    );
  }

  /* =======================================================
     2) EMAIL
     ======================================================= */

  const emailEntry = document.querySelector(".connect-entry.is-primary");
  if (emailEntry) {
    gsap.from(emailEntry, {
      scrollTrigger: {
        trigger: emailEntry,
        start: "top 80%"
      },
      opacity: 0,
      scale: 0.965,
      duration: 0.6,
      ease: "power2.out"
    });
  }

  /* =======================================================
     3) HOVER
     ======================================================= */

  if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".connect-entry").forEach((entry) => {
      entry.addEventListener("mouseenter", () => {
        gsap.to(entry, {
          y: -3,
          duration: 0.25,
          ease: "power2.out"
        });
      });

      entry.addEventListener("mouseleave", () => {
        gsap.to(entry, {
          y: 0,
          duration: 0.25,
          ease: "power2.out"
        });
      });
    });
  }
}
