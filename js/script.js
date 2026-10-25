const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const slideButtons = Array.from(document.querySelectorAll(".slide-dot"));
const slideToggle = document.querySelector(".slide-toggle");
const heroIndex = document.querySelector(".hero-index");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (slides.length && slideButtons.length === slides.length && slideToggle && heroIndex) {
  let activeSlide = 0;
  let intervalId;
  let paused = reducedMotion.matches;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });
    slideButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeSlide;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    heroIndex.innerHTML = `${String(activeSlide + 1).padStart(2, "0")} <span>/</span> ${String(slides.length).padStart(2, "0")}`;
  };

  const stopRotation = () => {
    window.clearInterval(intervalId);
    intervalId = undefined;
  };

  const startRotation = () => {
    stopRotation();
    if (!paused && !reducedMotion.matches) {
      intervalId = window.setInterval(() => showSlide(activeSlide + 1), 6000);
    }
  };

  slideButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      paused = true;
      showSlide(index);
      slideToggle.textContent = "Play";
      slideToggle.setAttribute("aria-label", "Play slideshow");
      stopRotation();
    });
  });

  slideToggle.addEventListener("click", () => {
    paused = !paused;
    slideToggle.textContent = paused ? "Play" : "Pause";
    slideToggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} slideshow`);
    startRotation();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRotation();
    } else {
      startRotation();
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      paused = true;
      slideToggle.textContent = "Play";
      slideToggle.setAttribute("aria-label", "Play slideshow");
    }
    startRotation();
  });

  if (paused) {
    slideToggle.textContent = "Play";
    slideToggle.setAttribute("aria-label", "Play slideshow");
  } else {
    startRotation();
  }
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");

if (lightbox instanceof HTMLDialogElement && lightboxImage instanceof HTMLImageElement && lightboxClose instanceof HTMLButtonElement) {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.full || "";
      lightboxImage.alt = item.dataset.alt || "";
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
  lightbox.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}
