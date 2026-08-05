from __future__ import annotations

import hashlib
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent / "03-proposal-mockups" / "_nacional-2026-07" / "_clientes" / "lote-03" / "09-salamandra"
PDF = ROOT / "catalogo-oficial.pdf"
OUT = ROOT / "fotos"

OUT.mkdir(parents=True, exist_ok=True)
doc = fitz.open(PDF)
seen: set[str] = set()
saved = 0

for page_number, page in enumerate(doc, start=1):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    pix.save(OUT / f"catalogo-pagina-{page_number:02d}.jpg")
    for image in page.get_images(full=True):
        xref = image[0]
        data = doc.extract_image(xref)
        width = int(data.get("width", 0))
        height = int(data.get("height", 0))
        raw = data["image"]
        digest = hashlib.sha256(raw).hexdigest()
        if digest in seen or min(width, height) < 500 or len(raw) < 30000:
            continue
        seen.add(digest)
        saved += 1
        ext = data.get("ext", "png")
        (OUT / f"catalogo-imagem-{saved:02d}.{ext}").write_bytes(raw)

print({"pages": len(doc), "embedded_images": saved, "output": str(OUT)})
