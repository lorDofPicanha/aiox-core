#!/usr/bin/env python3
"""Ingest ENIAC CAT (Certidão de Acervo Técnico) PDFs into the Noyce knowledge base.

Extracts text (PyMuPDF), writes one markdown doc per CAT into
apps/noyce/lib/data/knowledge-base/eniac-acervo/ with frontmatter the retrieval engine reads.
These are ENIAC's OWN technical credentials — the acervo the matching agents reason over.
"""
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

DOWNLOADS = Path.home() / "Downloads"
OUT_DIR = Path(__file__).resolve().parents[2] / "apps" / "noyce" / "lib" / "data" / "knowledge-base" / "eniac-acervo"

# pdf filename -> (docId, title, extra tags)
CATS = {
    "CAT 1020250004388 - REFORMA CEO.pdf": ("acervo-cat-reforma-ceo", "CAT ENIAC — Reforma CEO", ["reforma", "ceo"]),
    "CAT 1020260001207 - MESTRE ZEZITO.pdf": ("acervo-cat-mestre-zezito", "CAT ENIAC — Mestre Zezito", ["construcao", "escola", "consorcio"]),
    "CAT Escola Ednalda Guedes.pdf": ("acervo-cat-escola-ednalda-guedes", "CAT ENIAC — Escola Ednalda Guedes", ["construcao", "escola"]),
    "CAT TOPOGRAFIA RODRIGO.pdf": ("acervo-cat-topografia-rodrigo", "CAT ENIAC — Topografia (RT Rodrigo)", ["topografia", "rt-rodrigo"]),
    "CAT- PRAÇA 1020250002836.pdf": ("acervo-cat-praca", "CAT ENIAC — Praça", ["praca", "urbanismo"]),
}

BASE_TAGS = ["cat", "acervo", "eniac", "qualificacao-tecnica", "atestado"]


def clean(text: str) -> str:
    text = text.replace(" ", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = []
    for fname, (doc_id, title, extra) in CATS.items():
        pdf = DOWNLOADS / fname
        if not pdf.exists():
            print(f"AUSENTE: {pdf}", file=sys.stderr)
            continue
        doc = fitz.open(pdf)
        parts = []
        for i, page in enumerate(doc, 1):
            t = clean(page.get_text())
            if t:
                parts.append(f"## Página {i}\n{t}")
        doc.close()
        tags = BASE_TAGS + extra
        body = "\n\n".join(parts) if parts else "_(sem texto extraível — PDF possivelmente escaneado; requer OCR)_"
        front = (
            "---\n"
            f"title: {title}\n"
            f"docId: {doc_id}\n"
            f"tags: [{', '.join(tags)}]\n"
            "audience: agents\n"
            f"sourceRefs: [Downloads/{fname}]\n"
            "---\n\n"
            f"> Documento real da ENIAC (acervo técnico). Extraído de `{fname}`. "
            "Use para matching de qualificação técnica (objeto, quantitativos, RT).\n\n"
        )
        out = OUT_DIR / f"{doc_id}.md"
        out.write_text(front + body + "\n", encoding="utf-8")
        written.append((out.name, len(body)))
        print(f"OK: {out.name} ({len(body)} chars, {len(parts)} páginas)")

    print(f"\n{len(written)} CATs ingeridos em {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
