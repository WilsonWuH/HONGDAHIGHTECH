function normalizeInquiryKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "_")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function collectInquiryFields(form) {
  const fields = {};

  form.querySelectorAll("input, select, textarea").forEach((control) => {
    const type = (control.getAttribute("type") || "").toLowerCase();
    if (["submit", "button", "reset", "file"].includes(type)) return;

    const rawKey =
      control.name ||
      control.id ||
      control.getAttribute("aria-label") ||
      control.getAttribute("placeholder");
    const key = normalizeInquiryKey(rawKey);
    if (!key) return;

    fields[key] = String(control.value || "").trim();
  });

  return fields;
}

function setFormStatus(status, message, type = "") {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-success", type === "success");
  status.classList.toggle("is-error", type === "error");
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalButtonText = submitButton?.textContent;

    if (!form.checkValidity()) {
      form.reportValidity();
      setFormStatus(status, "Please complete the required fields before submitting.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: collectInquiryFields(form),
          page: window.location.href,
          source: "HDPTH website form",
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Submission failed");
      }

      setFormStatus(
        status,
        "Submitted successfully. Our sales team will contact you soon with a suitable machine configuration.",
        "success"
      );
      form.reset();
    } catch (error) {
      setFormStatus(
        status,
        `${error.message || "Submission failed"}. Please contact Wilson Wu on WhatsApp: +86 13645700210.`,
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || "Submit";
      }
    }
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
