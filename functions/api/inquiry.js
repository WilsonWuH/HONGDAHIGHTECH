// Cloudflare Pages Function：询盘表单提交 → FormSubmit 发信
// 与 senfu 官网使用相同的 FormSubmit 收件邮箱，无需任何 API 密钥。
// 前端请求方式与原 Resend 版本完全兼容（POST /api/inquiry，响应 {ok, message}）。

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/wh1007209170@gmail.com";
const FALLBACK_PAGE = "HDPTH website";

function clean(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
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

export async function onRequestPost({ request }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid inquiry payload." }, { status: 400 });
  }

  const fields = normalizeFields(payload);

  // 蜜罐字段：正常用户不会填写
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

  const page = clean(payload?.page || payload?.source || request.headers.get("referer") || FALLBACK_PAGE, 1000);
  const country = firstValue(fields, ["country", "country_region"]);
  const product = firstValue(fields, ["product", "product_requirement"]);

  const subjectParts = ["New HDPTH inquiry", name];
  if (country) subjectParts.push(country);
  if (product) subjectParts.push(product);

  // 组装 FormSubmit AJAX 载荷：下划线开头为控制字段，其余为表单内容
  const formPayload = {
    _subject: subjectParts.join(" - "),
    _template: "table",
    _captcha: "false",
    _replyto: email,
    Name: name,
    Email: email,
  };
  if (phone) formPayload.Phone = phone;
  if (country) formPayload.Country = country;
  if (product) formPayload.Product = product;
  formPayload.Page = page;

  // 其余自定义字段一并带上（跳过已用过的键和控制字段）
  const usedKeys = new Set(
    Object.entries(fields)
      .filter(([, v]) => [name, email, phone, country, product].includes(v))
      .map(([k]) => k)
  );
  Object.entries(fields).forEach(([key, value]) => {
    if (key === "website" || key === "captcha") return;
    if (usedKeys.has(key)) return;
    const label = labelFromKey(key);
    if (!(label in formPayload)) formPayload[label] = value;
  });

  let formSubmitResponse;
  try {
    formSubmitResponse = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formPayload),
    });
  } catch (err) {
    console.error("FormSubmit request failed:", err);
    return Response.json({ ok: false, message: "Email delivery failed." }, { status: 502 });
  }

  if (!formSubmitResponse.ok) {
    const errorBody = await formSubmitResponse.text();
    console.error("FormSubmit delivery failed:", formSubmitResponse.status, errorBody);
    return Response.json(
      { ok: false, message: "Email delivery failed." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
