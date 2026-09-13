const form = document.querySelector("#b2bInquiryForm");
const statusEl = form?.querySelector(".form-status");
const submitButton = form?.querySelector(".inquiry-submit");

// 与 senfu 官网相同的收件方式：浏览器直发 FormSubmit，无需任何后端/密钥。
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/wh1007209170@gmail.com";

// 提交给 FormSubmit 的字段顺序与展示名（跳过内部字段）
const FIELD_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  company: "Company",
  country: "Country / Region",
  product: "Product of Interest",
  message: "Message",
};

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
  const payload = {};

  data.forEach((value, key) => {
    payload[key] = value?.toString().trim();
  });

  return payload;
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

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Submitting...";
  statusEl.textContent = "";
  statusEl.className = "form-status";

  const fields = formPayload();
  const subjectParts = [
    "New HDPTH inquiry",
    fields.name,
    fields.country,
    fields.product,
  ].filter(Boolean);

  const payload = {
    _subject: subjectParts.join(" - "),
    _template: "table",
    _captcha: "false",
    _replyto: fields.email,
  };
  Object.entries(FIELD_LABELS).forEach(([key, label]) => {
    if (fields[key]) payload[label] = fields[key];
  });
  payload.Page = window.location.href;

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== "true") throw new Error(result.message || "Request failed");

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
