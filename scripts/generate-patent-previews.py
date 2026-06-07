from pathlib import Path

import fitz
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "assets" / "patents"
OUTPUT_DIR = ROOT / "assets" / "images" / "patent-previews"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
        output_path = OUTPUT_DIR / f"{pdf_path.stem}-preview.webp"
        document = fitz.open(pdf_path)
        page = document.load_page(0)

        scale = min(1.8, 760 / page.rect.width)
        pixmap = page.get_pixmap(
            matrix=fitz.Matrix(scale, scale),
            alpha=False,
            colorspace=fitz.csRGB,
        )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        image.save(output_path, "WEBP", quality=76, method=6)
        document.close()

    print(f"Generated {len(list(OUTPUT_DIR.glob('*.webp')))} patent previews.")


if __name__ == "__main__":
    main()
