const form = document.querySelector("#b2bInquiryForm");
const statusEl = form?.querySelector(".form-status");
const submitButton = form?.querySelector(".inquiry-submit");

const validators = {
  name: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
  phone: (value) => /^\+?[0-9\s().-]{7,20}$/.test(value.trim()),
  captcha: (value) => value.trim() === "9",
};

function setError(name, message = "") {
  const field = form.querySelector(`[name="${name}"]`);
  const error = form.querySelector(`[data-error-for="${name}"]`);
  if (!field || !error) return;
  field.classList.toggle("is-invalid", Boolean(message));
  error.textContent = message;
  error.classList.toggle("is-visible", Boolean(message));
}

function validateForm() {
  const data = new FormData(form);
  let valid = true;

  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid business email.",
    phone: "Please enter a valid international phone number.",
    captcha: "Please answer the anti-spam question correctly.",
  };

  Object.entries(validators).forEach(([name, validate]) => {
    const value = String(data.get(name) || "");
    const ok = validate(value);
    setError(name, ok ? "" : messages[name]);
    if (!ok) valid = false;
  });

  return valid;
}

function formPayload() {
  const data = new FormData(form);
  return {
    name: data.get("name")?.toString().trim(),
    email: data.get("email")?.toString().trim(),
    phone: data.get("phone")?.toString().trim(),
    company: data.get("company")?.toString().trim(),
    country: data.get("country")?.toString().trim(),
    product: data.get("product")?.toString().trim(),
    message: data.get("message")?.toString().trim(),
    source: "HDPTH website inquiry page",
  };
}

form?.addEventListener("input", (event) => {
  const name = event.target?.name;
  if (name && validators[name]) setError(name);
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form) return;

  if (form.website?.value) {
    statusEl.textContent = "Submission blocked.";
    statusEl.className = "form-status is-error";
    return;
  }

  if (!validateForm()) {
    statusEl.textContent = "Please complete the required fields before submitting.";
    statusEl.className = "form-status is-error";
    return;
  }

  const endpoint = form.dataset.endpoint?.trim();
  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Submitting...";
  statusEl.textContent = "";
  statusEl.className = "form-status";

  try {
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload()),
      });
      if (!response.ok) throw new Error("Request failed");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.info("Demo inquiry payload:", formPayload());
    }

    statusEl.textContent = "Submitted successfully. Our team will contact you soon.";
    statusEl.className = "form-status is-success";
    form.reset();
  } catch (error) {
    statusEl.textContent = "Submission failed. Please email us or try again later.";
    statusEl.className = "form-status is-error";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Submit Inquiry";
  }
});
