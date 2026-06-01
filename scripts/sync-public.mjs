import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

const copyDirs = [
  "about",
  "applications",
  "ar",
  "assets",
  "blog",
  "cases",
  "contact",
  "download",
  "en",
  "es",
  "factory",
  "faq",
  "fr",
  "guides",
  "inquiry",
  "lp",
  "products",
  "pt",
  "resources",
  "ru"
];

const copyFiles = [
  "index.html",
  "robots.txt",
  "scripts.js",
  "sitemap.xml",
  "social-links.js",
  "social-links.json",
  "styles.css"
];

async function copyIfExists(source, target) {
  if (!existsSync(source)) return;
  await cp(source, target, { recursive: true, force: true });
}

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

for (const dir of copyDirs) {
  await copyIfExists(path.join(root, dir), path.join(publicDir, dir));
}

for (const file of copyFiles) {
  await copyIfExists(path.join(root, file), path.join(publicDir, file));
}

await copyIfExists(path.join(root, "index.html"), path.join(publicDir, "404.html"));

await writeFile(
  path.join(publicDir, "_headers.txt"),
  "Static files are generated from the project root by scripts/sync-public.mjs.\n",
  "utf8"
);
