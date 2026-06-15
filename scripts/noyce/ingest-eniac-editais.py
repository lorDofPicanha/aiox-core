#!/usr/bin/env python3
"""Ingest the ENIAC reference editais (PDFs the client sent) into the Noyce knowledge base.

Auto-discovers EDITAL*/CE*/edital* PDFs in Downloads, de-duplicates the "(N)" copies by
content size, extracts text (PyMuPDF) and writes one markdown doc per unique edital into
knowledge-base/editais-ref/. These are reference bids the agents can consult for habilitation
clauses, proposal models and deadlines.
"""
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

DOWNLOADS = Path.home() / "Downloads"
OUT_DIR = Path(__file__).resolve().parents[2] / "apps" / "noyce" / "lib" / "data" / "knowledge-base" / "editais-ref"

BASE_TAGS = ["edital", "referencia", "licitacao", "habilitacao", "eniac"]


def slugify(name: str) -> str:
    s = name.lower().replace(".pdf", "")
    s = re.sub(r"\(\d+\)", "", s)  # drop "(1)" dup markers
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60] or "edital"


def clean(text: str) -> str:
    text = text.replace(" ", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def discover() -> dict:
    """Return {slug: Path} keeping the largest file per slug (drops smaller dup copies)."""
    chosen: dict = {}
    for pdf in DOWNLOADS.glob("*.pdf"):
        low = pdf.name.lower()
        if not (low.startswith("edital") or low.startswith("ce ") or "edital" in low or low.startswith("sei_")):
            continue
        if low.startswith("cat"):
            continue
        slug = slugify(pdf.name)
        if slug not in chosen or pdf.stat().st_size > chosen[slug].stat().st_size:
            chosen[slug] = pdf
    return chosen


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chosen = discover()
    if not chosen:
        print("Nenhum edital encontrado em Downloads.", file=sys.stderr)
        return 1
    written = 0
    for slug, pdf in sorted(chosen.items()):
        try:
            doc = fitz.open(pdf)
        except Exception as e:  # noqa: BLE001
            print(f"FALHA abrir {pdf.name}: {e}", file=sys.stderr)
            continue
        parts = []
        for i, page in enumerate(doc, 1):
            t = clean(page.get_text())
            if t:
                parts.append(f"## Página {i}\n{t}")
        n = doc.page_count
        doc.close()
        doc_id = f"edital-{slug}"[:60]
        body = "\n\n".join(parts) if parts else "_(sem texto extraível — PDF escaneado; requer OCR)_"
        front = (
            "---\n"
            f"title: Edital de referência — {pdf.name.replace('.pdf', '')}\n"
            f"docId: {doc_id}\n"
            f"tags: [{', '.join(BASE_TAGS)}]\n"
            "audience: agents\n"
            f"sourceRefs: [Downloads/{pdf.name}]\n"
            "---\n\n"
            f"> Edital de referência (arquivo enviado pela ENIAC). Extraído de `{pdf.name}` ({n} págs). "
            "Use para consultar cláusulas de habilitação, modelos de proposta e prazos reais.\n\n"
        )
        out = OUT_DIR / f"{doc_id}.md"
        out.write_text(front + body + "\n", encoding="utf-8", newline="\n")
        written += 1
        print(f"OK: {out.name}  <- {pdf.name} ({n} págs, {len(body)} chars)")

    print(f"\n{written} editais ingeridos em {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
