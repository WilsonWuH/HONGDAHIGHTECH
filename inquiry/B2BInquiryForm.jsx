import { useState } from "react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  product: "",
  message: "",
  captcha: "",
  website: "",
};

export default function B2BInquiryForm({ endpoint = "" }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = "Please enter a valid business email.";
    if (!/^\+?[0-9\s().-]{7,20}$/.test(values.phone.trim())) next.phone = "Please enter a valid international phone number.";
    if (values.captcha.trim() !== "9") next.captcha = "Please answer the anti-spam question correctly.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (values.website) return setStatus({ type: "error", message: "Submission blocked." });
    if (!validate()) return setStatus({ type: "error", message: "Please complete the required fields before submitting." });

    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, source: "HDPTH website inquiry page" }),
        });
        if (!response.ok) throw new Error("Request failed");
      }
      setStatus({ type: "success", message: "Submitted successfully. Our team will contact you soon." });
      setValues(initialValues);
    } catch {
      setStatus({ type: "error", message: "Submission failed. Please email us or try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <input className="form-trap" name="website" value={values.website} onChange={update} tabIndex="-1" autoComplete="off" aria-hidden="true" />
      <div className="field-grid">
        <Field label="Name" name="name" required value={values.name} onChange={update} error={errors.name} placeholder="Your full name" />
        <Field label="Email" name="email" type="email" required value={values.email} onChange={update} error={errors.email} placeholder="name@company.com" />
        <Field label="Phone / WhatsApp" name="phone" type="tel" required value={values.phone} onChange={update} error={errors.phone} placeholder="+1 555 123 4567" />
        <Field label="Company" name="company" value={values.company} onChange={update} placeholder="Company name" />
        <Field label="Country / Region" name="country" value={values.country} onChange={update} placeholder="United States, Germany, UAE..." />
        <label className="field">
          <span>Product Requirement</span>
          <select name="product" value={values.product} onChange={update}>
            <option value="">Select product type</option>
            <option>High-Speed Slitting Machines</option>
            <option>Nonwoven Rewinding Machines</option>
            <option>Perforating Production Lines</option>
            <option>Automatic Knife Systems</option>
            <option>Complete Nonwoven Converting Solution</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" value={values.message} onChange={update} placeholder="Tell us material type, parent roll width, finished roll width, speed target, roll diameter and application." />
      </label>
      <Field label="Anti-spam Check" name="captcha" required value={values.captcha} onChange={update} error={errors.captcha} placeholder="What is 6 + 3?" />
      <button className="inquiry-submit" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Inquiry"}</button>
      {status.message && <p className={`form-status is-${status.type}`}>{status.message}</p>}
    </form>
  );
}

function Field({ label, name, required, error, ...props }) {
  return (
    <label className="field">
      <span>{label} {required && <b>*</b>}</span>
      <input name={name} className={error ? "is-invalid" : ""} required={required} {...props} />
      {error && <small className="is-visible">{error}</small>}
    </label>
  );
}
