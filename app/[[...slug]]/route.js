import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function safePagePath(slug = []) {
  const parts = Array.isArray(slug) ? slug : [];
  const normalized = parts.filter(Boolean).join("/");
  const filePath = normalized
    ? path.join(PUBLIC_DIR, normalized, "index.html")
    : path.join(PUBLIC_DIR, "index.html");

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return path.join(PUBLIC_DIR, "404.html");
  }

  return filePath;
}

export async function GET(_request, { params }) {
  const htmlPath = safePagePath(params?.slug);

  try {
    const html = await readFile(htmlPath, "utf8");
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  } catch {
    const html = await readFile(path.join(PUBLIC_DIR, "index.html"), "utf8");
    return new Response(html, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  }
}
