/**
 * Kefi-Fresh — Carrusel accesible con soporte de teclado, con auto-avance
 * infinito y lento que se pausa mientras el usuario interactúa con él.
 */
(function initCarousel() {
  const AUTOPLAY_DELAY_MS = 5000;

  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));

  let currentIndex = 0;
  let autoplayId = null;

  function goToSlide(index) {
    const total = slides.length;
    currentIndex = ((index % total) + total) % total;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, AUTOPLAY_DELAY_MS);
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  prevButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.carouselDot));
      startAutoplay();
    });
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
      startAutoplay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
      startAutoplay();
    }
  });

  // Se pausa mientras el usuario interactúa con el carrusel (hover o teclado),
  // para no interrumpirlo ni competir con la navegación manual.
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  carousel.setAttribute("tabindex", "0");
  goToSlide(0);
  startAutoplay();
})();
