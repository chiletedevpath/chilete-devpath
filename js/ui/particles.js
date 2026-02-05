/* =========================================================
   PARTICLES.JS
   ========================================================= */

export async function initParticles() {
  if (!window.tsParticles) {
    console.warn("tsParticles no está cargado");
    return;
  }

  try {
    await tsParticles.load("global-particles", {
      fullScreen: { enable: false },
      fpsLimit: 60,

      particles: {
        number: { value: 65, density: { enable: true, area: 1200 } },
        color: { value: ["#8fd3f4", "#a5f3fc", "#60a5fa"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.18,
          animation: {
            enable: true,
            speed: 0.4,
            minimumValue: 0.08
          }
        },
        size: { value: { min: 1, max: 2.5 } },
        links: {
          enable: true,
          distance: 150,
          color: "#8fd3f4",
          opacity: 0.12,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.35,
          outModes: { default: "out" }
        }
      },

      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: true
        },
        modes: {
          repulse: { distance: 120, duration: 0.6 }
        }
      },

      detectRetina: true
    });
  } catch (err) {
    console.error("Error cargando partículas:", err);
  }
}
