#!/usr/bin/env python3
"""Extract all annotations (yellow boxes, comments, highlights) from PCMSO PDFs."""
import fitz  # PyMuPDF
import sys
import json
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: pcmso-extract-annotations.py <pdf_path>")
    sys.exit(1)

pdf_path = sys.argv[1]
doc = fitz.open(pdf_path)

annotations = []
for page_num, page in enumerate(doc, start=1):
    # Get text on the page (for context around annotation)
    for annot in page.annots() or []:
        info = annot.info
        rect = annot.rect
        # Try to capture surrounding text for context
        # Expand rect slightly to capture surrounding context
        ctx_rect = fitz.Rect(rect.x0 - 80, rect.y0 - 10, rect.x1 + 200, rect.y1 + 10)
        ctx_text = page.get_textbox(ctx_rect).strip().replace('\n', ' ')
        # Text inside the annot's rect (highlighted/marked text)
        marked_text = page.get_textbox(rect).strip().replace('\n', ' ')

        annotations.append({
            "page": page_num,
            "type": annot.type[1],  # e.g. "Highlight", "Text", "Square", "FreeText"
            "subject": info.get("subject", ""),
            "title": info.get("title", ""),  # usually author
            "content": info.get("content", ""),  # the comment body — THIS is what the doctor wrote
            "rect": [rect.x0, rect.y0, rect.x1, rect.y1],
            "marked_text": marked_text,
            "context": ctx_text,
            "color": annot.colors,
        })

doc.close()

print(f"=== {Path(pdf_path).name} ===")
print(f"Total annotations: {len(annotations)}\n")
for i, a in enumerate(annotations, start=1):
    print(f"--- Annot {i} | page {a['page']} | type={a['type']} ---")
    print(f"  Author: {a['title']!r}")
    if a['subject']:
        print(f"  Subject: {a['subject']!r}")
    if a['content']:
        print(f"  COMMENT: {a['content']!r}")
    if a['marked_text']:
        print(f"  Marked: {a['marked_text']!r}")
    if a['context'] and a['context'] != a['marked_text']:
        print(f"  Context: {a['context'][:200]!r}")
    print()

# Save JSON
out = Path(pdf_path).with_suffix(".annotations.json")
out.write_text(json.dumps(annotations, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Saved: {out}")
