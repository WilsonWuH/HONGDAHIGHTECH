from __future__ import annotations

import re
import os
from pathlib import Path
from urllib.parse import unquote

from lxml import etree, html
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images"
HTML_EXTENSIONS = {".html"}
SOURCE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
RESPONSIVE_WIDTHS = (640, 960, 1280, 1920)
CRITICAL_CSS = (
    "body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#0b1118;background:#fff}"
    ".topbar{background:#0b1118;color:rgba(255,255,255,.78);font-size:13px}"
    ".header{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.96);border-bottom:1px solid #d9dee6}"
    ".container{width:min(1180px,calc(100% - 40px));margin:0 auto}"
    ".nav{display:flex;align-items:center;justify-content:space-between;min-height:74px}"
    ".hero,.page-hero{background:#0b1118;color:#fff}"
    "img{max-width:100%;height:auto;display:block}"
)


def image_size(path: Path) -> tuple[int, int] | None:
    try:
        with Image.open(path) as img:
            return img.size
    except Exception:
        return None


def variant_path(source: Path, width: int | None, ext: str) -> Path:
    suffix = f"-{width}" if width else ""
    return source.with_name(f"{source.stem}{suffix}.{ext}")


def save_variant(source: Path, width: int | None, ext: str) -> Path | None:
    target = variant_path(source, width, ext)
    try:
        with Image.open(source) as img:
            img = img.convert("RGB")
            if width and img.width > width:
                height = round(img.height * width / img.width)
                img = img.resize((width, height), Image.Resampling.LANCZOS)
            elif width and img.width <= width:
                return None

            if ext == "webp":
                img.save(target, "WEBP", quality=82, method=6)
            elif ext == "avif":
                img.save(target, "AVIF", quality=50, speed=6)
            else:
                return None
        return target
    except Exception as exc:
        print(f"skip {source.name} {ext}: {exc}")
        return None


def build_modern_images() -> dict[str, tuple[int, int]]:
    dimensions: dict[str, tuple[int, int]] = {}
    for source in IMAGE_DIR.iterdir():
        if source.suffix.lower() not in SOURCE_IMAGE_EXTENSIONS:
            continue
        size = image_size(source)
        if not size:
            continue
        dimensions[source.as_posix()] = size
        for ext in ("webp", "avif"):
            save_variant(source, None, ext)
            for width in RESPONSIVE_WIDTHS:
                save_variant(source, width, ext)
    return dimensions


def rel_to_root(path: Path, value: str) -> Path | None:
    if value.startswith(("http://", "https://", "data:", "#")):
        return None
    clean = unquote(value.split("?", 1)[0].split("#", 1)[0])
    return (path.parent / clean).resolve()


def rel_from_html(path: Path, target: Path) -> str:
    return Path(os.path.relpath(Path(target).resolve(), path.parent.resolve())).as_posix()


def srcset_for(path: Path, source: Path, ext: str, original_width: int) -> str:
    items: list[str] = []
    for width in RESPONSIVE_WIDTHS:
        variant = variant_path(source, width, ext)
        if variant.exists() and width < original_width:
            items.append(f"{rel_from_html(path, variant)} {width}w")
    full = variant_path(source, None, ext)
    if full.exists():
        items.append(f"{rel_from_html(path, full)} {original_width}w")
    return ", ".join(items)


def is_lcp_candidate(img, index: int) -> bool:
    src = (img.get("src") or "").lower()
    classes = " ".join(
        filter(None, [img.get("class"), img.getparent().get("class") if img.getparent() is not None else ""])
    ).lower()
    return index == 0 or "hero" in src or "hero" in classes or "banner" in src


def ensure_preloads(head, html_path: Path, preload_targets: list[Path]) -> None:
    existing = {node.get("href") for node in head.xpath(".//link[@rel='preload']")}
    for target in preload_targets[:2]:
        avif = variant_path(target, 1280, "avif")
        webp = variant_path(target, 1280, "webp")
        full_avif = variant_path(target, None, "avif")
        full_webp = variant_path(target, None, "webp")
        preload = (
            avif
            if avif.exists()
            else full_avif
            if full_avif.exists()
            else webp
            if webp.exists()
            else full_webp
            if full_webp.exists()
            else target
        )
        href = rel_from_html(html_path, preload)
        if href in existing:
            continue
        link = html.Element("link")
        link.set("rel", "preload")
        link.set("as", "image")
        link.set("href", href)
        if preload.suffix == ".avif":
            link.set("type", "image/avif")
        elif preload.suffix == ".webp":
            link.set("type", "image/webp")
        head.append(link)


def ensure_critical_css(head) -> bool:
    if head.xpath('.//style[@data-critical="true"]'):
        return False
    style = html.Element("style")
    style.set("data-critical", "true")
    style.text = CRITICAL_CSS
    first_stylesheet = head.xpath('.//link[@rel="stylesheet"]')
    if first_stylesheet:
        first_stylesheet[0].addprevious(style)
    else:
        head.append(style)
    return True


def ensure_home_background_preload(head, html_path: Path) -> bool:
    if html_path.name != "index.html":
        return False
    target = ROOT / "assets" / "images" / "hero-banner-clean.avif"
    if not target.exists():
        target = ROOT / "assets" / "images" / "hero-banner-clean.webp"
    if not target.exists():
        return False
    href = rel_from_html(html_path, target)
    if head.xpath(f'.//link[@rel="preload"][@as="image"][@href="{href}"]'):
        return False
    link = html.Element("link")
    link.set("rel", "preload")
    link.set("as", "image")
    link.set("href", href)
    link.set("type", "image/avif" if href.endswith(".avif") else "image/webp")
    head.append(link)
    return True


def optimize_html_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    parser = html.HTMLParser(encoding="utf-8")
    doc = html.fromstring(raw.encode("utf-8"), parser=parser)
    head = doc.find("head")
    if head is None:
        return False

    changed = False
    if ensure_critical_css(head):
        changed = True
    if ensure_home_background_preload(head, path):
        changed = True
    css_links = head.xpath('.//link[@rel="stylesheet"]')
    for link in css_links:
        href = link.get("href")
        if href and href.endswith("styles.css"):
            # Keep CSS render-safe, but make the browser discover it as early as possible.
            preload = html.Element("link")
            preload.set("rel", "preload")
            preload.set("as", "style")
            preload.set("href", href)
            if not head.xpath(f'.//link[@rel="preload"][@as="style"][@href="{href}"]'):
                link.addprevious(preload)
                changed = True

    imgs = doc.xpath("//img[not(ancestor::picture)]")
    preload_targets: list[Path] = []
    for index, img in enumerate(imgs):
        src = img.get("src")
        if not src:
            continue
        source = rel_to_root(path, src)
        if not source or not source.exists() or source.suffix.lower() not in SOURCE_IMAGE_EXTENSIONS:
            continue
        size = image_size(source)
        if not size:
            continue
        width, height = size
        img.set("width", str(width))
        img.set("height", str(height))
        img.set("decoding", "async")
        img.set("sizes", img.get("sizes") or "(max-width: 760px) 100vw, 50vw")
        if is_lcp_candidate(img, index):
            img.set("loading", "eager")
            img.set("fetchpriority", "high")
            preload_targets.append(source)
        else:
            img.set("loading", "lazy")

        picture = html.Element("picture")
        avif_set = srcset_for(path, source, "avif", width)
        webp_set = srcset_for(path, source, "webp", width)
        if avif_set:
            avif = html.Element("source")
            avif.set("type", "image/avif")
            avif.set("srcset", avif_set)
            avif.set("sizes", img.get("sizes"))
            picture.append(avif)
        if webp_set:
            webp = html.Element("source")
            webp.set("type", "image/webp")
            webp.set("srcset", webp_set)
            webp.set("sizes", img.get("sizes"))
            picture.append(webp)
        parent = img.getparent()
        if parent is not None and len(picture):
            parent.replace(img, picture)
            picture.append(img)
            changed = True

    ensure_preloads(head, path, preload_targets)

    for script in doc.xpath("//script[@src]"):
        src = script.get("src", "")
        if "ld+json" in script.get("type", ""):
            continue
        if not script.get("defer") and not script.get("async"):
            script.set("defer", "")
            changed = True
        if "social-links.js" in src and not script.get("async"):
            script.set("async", "")
            changed = True

    if not changed:
        return False

    rendered = etree.tostring(doc, method="html", encoding="unicode", doctype="<!doctype html>")
    rendered = re.sub(r"<html([^>]*)>", r"<html\1>", rendered, count=1)
    path.write_text(rendered, encoding="utf-8")
    return True


def optimize_css() -> None:
    css_path = ROOT / "styles.css"
    css = css_path.read_text(encoding="utf-8")
    css = css.replace(
        'font-family: Arial, Helvetica, sans-serif;',
        'font-family: Arial, Helvetica, sans-serif;',
    )
    css = css.replace(
        'img { max-width: 100%; display: block; }',
        'img { max-width: 100%; height: auto; display: block; }\n'
        'picture { display: block; }\n'
        '@font-face { font-family: "HDPTHSystem"; src: local("Arial"); font-display: swap; }',
    )
    css = css.replace(
        'url("assets/images/manual-slitting-machine.jpg") center / cover no-repeat;',
        'image-set(url("assets/images/manual-slitting-machine.avif") type("image/avif"), url("assets/images/manual-slitting-machine.webp") type("image/webp"), url("assets/images/manual-slitting-machine.jpg") type("image/jpeg")) center / cover no-repeat;',
    )
    css = css.replace(
        'url("assets/images/hero-banner-clean.png") center / cover no-repeat;',
        'image-set(url("assets/images/hero-banner-clean.avif") type("image/avif"), url("assets/images/hero-banner-clean.webp") type("image/webp"), url("assets/images/hero-banner-clean.png") type("image/png")) center / cover no-repeat;',
    )
    css_path.write_text(css, encoding="utf-8")


def main() -> None:
    build_modern_images()
    optimize_css()
    changed = 0
    for path in ROOT.rglob("*.html"):
        if any(part in {"public", ".next", "node_modules", "manual-html-export"} for part in path.parts):
            continue
        if optimize_html_file(path):
            changed += 1
    print(f"optimized html files: {changed}")


if __name__ == "__main__":
    main()
