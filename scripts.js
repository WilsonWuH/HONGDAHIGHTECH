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
