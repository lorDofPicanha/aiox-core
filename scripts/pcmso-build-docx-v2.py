#!/usr/bin/env python3
"""Build .docx from PCMSO PDF — clean corrected text only, no tables/metadata.

Strategy: for each PDF page, extract text in reading order. For each annotation,
identify the exact text it marks, then:
- "retirar X" / "tirar X"  → delete X
- "acrescentar Y" / "adicionar Y" / "incluir Y"  → insert Y after marked text
- declarative text (long, ends with period, starts with capital) → replace marked text with comment
- short fragments → replace marked text with comment
- instructions ("verificar", "esclarecer", "pretende", ?) → SKIP silently

Output: .docx with the corrected text, page by page.
"""
import sys
import re
import json
from pathlib import Path
import fitz
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

if len(sys.argv) < 2:
    print("Usage: pcmso-build-docx-v2.py <pdf_path>"); sys.exit(1)

pdf_path = Path(sys.argv[1])
out_path = Path(f"D:/AIOS/tmp/pcmso/{pdf_path.stem} - CORRIGIDO.docx")


def categorize(content):
    """Return (action, payload) where action is REMOVE/INSERT/REPLACE/SKIP and payload is the text/word to use."""
    c = (content or "").strip()
    if not c:
        return ("SKIP", "")
    cl = c.lower()
    # REMOVE
    m = re.match(r'^(?:retirar|tirar|remover|excluir|deletar)\s+(?:a\s+|o\s+|as\s+|os\s+)?(?:palavra|termo|express[ãa]o|frase)?\s*["\']?(.+?)["\']?\s*$', c, re.IGNORECASE | re.DOTALL)
    if m and re.match(r'^(retirar|tirar|remover|excluir|deletar)', cl):
        word = m.group(1).strip(' .,;:!?"\'').split()[-1] if m.group(1).strip() else ''
        # better: try to extract just the target word(s)
        # "retirar a palavra PLENA" → "PLENA"
        m2 = re.search(r'(?:palavra|termo|express[ãa]o|frase)\s+["\']?([^"\']+?)["\']?\s*$', c, re.IGNORECASE)
        if m2:
            return ("REMOVE", m2.group(1).strip())
        # else last meaningful word
        return ("REMOVE", word)
    # INSERT
    m = re.match(r'^(?:acrescentar|adicionar|incluir|colocar|inserir|por)\s+(.+)$', c, re.IGNORECASE | re.DOTALL)
    if m:
        return ("INSERT", m.group(1).strip())
    # SKIP instructions
    if cl.endswith('?') or re.match(r'^(verificar|esclarecer|pretende|conferir|revisar(?!\s+\w))', cl):
        return ("SKIP", "")
    # Otherwise: treat as replacement / observation to integrate
    return ("REPLACE", c)


def get_annotation_text_span(page, annot_rect):
    """Find the exact text content that the annotation rect covers.
    Returns the full text from the words intersecting the rect."""
    words = page.get_text("words")  # [(x0,y0,x1,y1,word,block,line,word_no), ...]
    matched = []
    for w in words:
        wrect = fitz.Rect(w[:4])
        # Use a small intersection threshold
        if annot_rect.intersects(wrect):
            inter = annot_rect & wrect
            # Require at least 40% overlap of the word
            if inter.get_area() / max(wrect.get_area(), 1) > 0.3:
                matched.append(w[4])
    return " ".join(matched).strip()


def extract_full_marked_phrase(page, annot):
    """For Highlight annots with vertices, get all the highlighted quads' text."""
    rect = annot.rect
    # Try vertices (multi-line highlights)
    verts = annot.vertices
    if verts and len(verts) >= 4 and len(verts) % 4 == 0:
        spans = []
        for i in range(0, len(verts), 4):
            quad = verts[i:i+4]
            xs = [p[0] for p in quad]; ys = [p[1] for p in quad]
            qrect = fitz.Rect(min(xs), min(ys), max(xs), max(ys))
            spans.append(get_annotation_text_span(page, qrect))
        return " ".join(s for s in spans if s).strip()
    return get_annotation_text_span(page, rect)


# Process
doc = fitz.open(pdf_path)
output_doc = Document()
# Title
title = output_doc.add_heading(pdf_path.stem.replace(" (1)", ""), level=1)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

style = output_doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

edits_applied = 0
edits_skipped = 0

for page_num, page in enumerate(doc, start=1):
    # Get all annotations on this page with their marked text + action
    annots_data = []
    for annot in page.annots() or []:
        info = annot.info
        content = info.get("content", "").strip()
        if not content:
            continue
        marked = extract_full_marked_phrase(page, annot)
        action, payload = categorize(content)
        annots_data.append({
            "marked": marked,
            "content": content,
            "action": action,
            "payload": payload,
            "rect": annot.rect,
        })

    # Get plain text of the page
    page_text = page.get_text("text")

    # Sort annotations by vertical position then horizontal (top to bottom, left to right)
    annots_data.sort(key=lambda a: (a["rect"].y0, a["rect"].x0))

    # Apply each annotation to page_text
    # For each annot: find marked text, replace with edited version
    for a in annots_data:
        if a["action"] == "SKIP" or not a["marked"]:
            edits_skipped += 1
            continue

        marked = a["marked"]
        # try literal find in page_text
        # Normalize whitespace to avoid match failures
        def normalize(s):
            return re.sub(r'\s+', ' ', s).strip()
        norm_marked = normalize(marked)
        norm_text = normalize(page_text)
        # Build a replacement
        if a["action"] == "REMOVE":
            word_to_remove = a["payload"]
            # remove first occurrence near the marked area
            pattern = re.compile(r'\b' + re.escape(word_to_remove) + r'\b', re.IGNORECASE)
            new_text, n = pattern.subn('', page_text, count=1)
            if n > 0:
                # Clean up double spaces
                new_text = re.sub(r'  +', ' ', new_text)
                page_text = new_text
                edits_applied += 1
        elif a["action"] == "INSERT":
            insertion = a["payload"]
            # Insert AFTER the marked text
            # Find the marked text in page_text (with flexible whitespace)
            words = [re.escape(w) for w in norm_marked.split() if len(w) > 2][:6]  # use first 6 long words
            if words:
                pattern = re.compile(r'\s+'.join(words), re.IGNORECASE | re.DOTALL)
                m = pattern.search(page_text)
                if m:
                    # Insert " (INSERT_TEXT)" after match
                    page_text = page_text[:m.end()] + " " + insertion + page_text[m.end():]
                    edits_applied += 1
                else:
                    edits_skipped += 1
            else:
                edits_skipped += 1
        elif a["action"] == "REPLACE":
            replacement = a["payload"]
            words = [re.escape(w) for w in norm_marked.split() if len(w) > 2][:6]
            if words:
                pattern = re.compile(r'\s+'.join(words), re.IGNORECASE | re.DOTALL)
                m = pattern.search(page_text)
                if m:
                    page_text = page_text[:m.start()] + replacement + page_text[m.end():]
                    edits_applied += 1
                else:
                    edits_skipped += 1
            else:
                edits_skipped += 1

    # Write to docx as paragraphs (split by blank lines)
    for para in re.split(r'\n\s*\n', page_text):
        para = para.strip()
        if not para:
            continue
        # Collapse internal newlines (keep paragraph structure only)
        clean = re.sub(r'\s*\n\s*', ' ', para)
        clean = re.sub(r'  +', ' ', clean).strip()
        if clean:
            output_doc.add_paragraph(clean)

doc.close()
output_doc.save(out_path)
print(f"Generated: {out_path}")
print(f"Edits applied: {edits_applied}")
print(f"Edits skipped (instruction-only or unmatched): {edits_skipped}")
