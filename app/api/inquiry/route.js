export const runtime = "nodejs";

const RESEND_API_URL = "https://api.resend.com/emails";
const FALLBACK_TO_EMAIL = "wh1007209170@gmail.com";
const FALLBACK_FROM_EMAIL = "HDPTH Website <onboarding@resend.dev>";

function clean(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value, 5000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function labelFromKey(key) {
  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeFields(payload) {
  const rawFields = payload?.fields && typeof payload.fields === "object" ? payload.fields : payload;
  const fields = {};

  Object.entries(rawFields || {}).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = String(key || "")
      .trim()
      .toLowerCase()
      .replace(/\s*\/\s*/g, "_")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (!normalizedKey) return;
    fields[normalizedKey] = clean(value, 1200);
  });

  return fields;
}

function firstValue(fields, keys) {
  for (const key of keys) {
    if (fields[key]) return fields[key];
  }
  return "";
}

function buildEmailHtml(fields, page) {
  const rows = Object.entries(fields)
    .filter(([key]) => key !== "website" && key !== "captcha")
    .map(
      ([key, value]) =>
        `<tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;">${escapeHtml(
          labelFromKey(key)
        )}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.55;">
      <h1 style="font-size:22px;margin:0 0 16px;">New HDPTH Website Inquiry</h1>
      <p style="margin:0 0 16px;">A visitor submitted an inquiry from the HDPTH website.</p>
      <table style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #e5e7eb;">${rows}</table>
      <p style="margin:18px 0 0;"><strong>Page:</strong> ${escapeHtml(page)}</p>
      <p style="margin:8px 0 0;color:#6b7280;">Please reply directly to the customer's email when possible.</p>
    </div>
  `;
}

function buildEmailText(fields, page) {
  const lines = Object.entries(fields)
    .filter(([key]) => key !== "website" && key !== "captcha")
    .map(([key, value]) => `${labelFromKey(key)}: ${value}`);

  return ["New HDPTH Website Inquiry", "", ...lines, "", `Page: ${page}`].join("\n");
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid inquiry payload." }, { status: 400 });
  }

  const fields = normalizeFields(payload);

  if (fields.website) {
    return Response.json({ ok: true });
  }

  const name = firstValue(fields, ["name", "your_full_name"]);
  const email = firstValue(fields, ["email", "business_email", "your_email"]);
  const phone = firstValue(fields, ["phone", "phone_whatsapp", "your_whatsapp_phone", "whatsapp", "tel"]);

  if (!name || !email) {
    return Response.json(
      { ok: false, message: "Name and email are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  if (phone && !/^\+?[0-9\s().-]{7,24}$/.test(phone)) {
    return Response.json({ ok: false, message: "Please enter a valid phone number." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.INQUIRY_TO_EMAIL || FALLBACK_TO_EMAIL)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = process.env.INQUIRY_FROM_EMAIL || FALLBACK_FROM_EMAIL;
  const page = clean(payload?.page || payload?.source || request.headers.get("referer") || "HDPTH website", 1000);
  const country = firstValue(fields, ["country", "country_region"]);
  const product = firstValue(fields, ["product", "product_requirement"]);

  if (!apiKey) {
    console.error("Inquiry email is not configured: missing RESEND_API_KEY.");
    return Response.json(
      { ok: false, message: "Email service is not configured." },
      { status: 500 }
    );
  }

  const subjectParts = ["New HDPTH inquiry", name];
  if (country) subjectParts.push(country);
  if (product) subjectParts.push(product);

  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: subjectParts.join(" - "),
      html: buildEmailHtml(fields, page),
      text: buildEmailText(fields, page),
    }),
  });

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text();
    console.error("Inquiry email delivery failed:", resendResponse.status, errorBody);
    return Response.json(
      { ok: false, message: "Email delivery failed." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
