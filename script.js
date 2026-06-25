const slidesTrack = document.getElementById("slides");
const slideItems = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const currentSlide = document.getElementById("currentSlide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slider = document.getElementById("slider");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicText = document.getElementById("musicText");

let activeIndex = 0;
let autoSlideTimer;
let touchStartX = 0;
let touchEndX = 0;

function updateSlider(index) {
  activeIndex = (index + slideItems.length) % slideItems.length;
  slidesTrack.style.transform = `translateX(-${activeIndex * 100}%)`;

  slideItems.forEach((slide, idx) => {
    slide.classList.toggle("is-active", idx === activeIndex);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("is-active", idx === activeIndex);
  });

  currentSlide.textContent = String(activeIndex + 1).padStart(2, "0");
}

function nextSlide() {
  updateSlider(activeIndex + 1);
}

function prevSlide() {
  updateSlider(activeIndex - 1);
}

function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(nextSlide, 4500);
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  startAutoSlide();
});

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    updateSlider(idx);
    startAutoSlide();
  });
});

slider.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 45) {
    distance < 0 ? nextSlide() : prevSlide();
    startAutoSlide();
  }
}, { passive: true });

function setMusicUI(isPlaying, label) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicText.textContent = label;
}

async function tryPlayMusic() {
  if (!bgMusic) return;

  try {
    bgMusic.volume = 0.55;
    await bgMusic.play();
    setMusicUI(true, "Music on");
  } catch (error) {
    setMusicUI(false, "Tap music");
  }
}

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    await tryPlayMusic();
  } else {
    bgMusic.pause();
    setMusicUI(false, "Music off");
  }
});

["click", "touchstart", "keydown"].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    if (bgMusic.paused) tryPlayMusic();
  }, { once: true, passive: true });
});

bgMusic.addEventListener("error", () => {
  setMusicUI(false, "Add music");
});

updateSlider(0);
startAutoSlide();
tryPlayMusic();
