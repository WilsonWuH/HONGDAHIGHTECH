document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Thank you. Our sales team will contact you soon with a suitable machine configuration.";
    }
    form.reset();
  });
});
const heroVideo = document.querySelector(".hero-video[data-loop-start]");

if (heroVideo) {
  const loopStart = Number.parseFloat(heroVideo.dataset.loopStart) || 0;

  const startHeroVideo = () => {
    if (loopStart > 0 && heroVideo.duration > loopStart) {
      heroVideo.currentTime = loopStart;
    }
    heroVideo.play().catch(() => {});
  };

  if (heroVideo.readyState >= 1) {
    startHeroVideo();
  } else {
    heroVideo.addEventListener("loadedmetadata", startHeroVideo, { once: true });
  }

  heroVideo.addEventListener("ended", () => {
    heroVideo.currentTime = loopStart;
    heroVideo.play().catch(() => {});
  });
}
