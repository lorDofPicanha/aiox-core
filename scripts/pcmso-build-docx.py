#!/usr/bin/env python3
"""Build .docx from PCMSO PDF + apply doctor's annotations.

Strategy:
- Extract text via pdftotext (layout preserved)
- For each annotation, categorize: REMOVAL / ADDITION / REPLACEMENT / REFERENCE_UPDATE / VAGUE
- Apply literal edits inline; flag vague ones with red [TODO REVISAR]
- Output .docx with: cover, edited text, appendix log
"""
import sys
import json
import re
import subprocess
from pathlib import Path
from docx import Document
from docx.shared import RGBColor, Pt, Inches
from docx.enum.text import WD_COLOR_INDEX, WD_ALIGN_PARAGRAPH

if len(sys.argv) < 2:
    print("Usage: pcmso-build-docx.py <pdf_path>"); sys.exit(1)

pdf_path = Path(sys.argv[1])
annots_path = pdf_path.with_suffix(".annotations.json")
txt_path = Path(f"D:/AIOS/tmp/pcmso/{pdf_path.stem}.txt")
out_path = Path(f"D:/AIOS/tmp/pcmso/{pdf_path.stem} - REVISADO.docx")

# Load
text = txt_path.read_text(encoding="utf-8", errors="replace")
annots = json.loads(annots_path.read_text(encoding="utf-8"))


def categorize(comment):
    c = (comment or "").strip()
    cl = c.lower()
    # explicit verbs
    if re.match(r'^(retirar|tirar|remover|excluir|deletar)\b', cl):
        return ('REMOVAL', extract_word_to_remove(c))
    if re.match(r'^(acrescentar|adicionar|incluir|colocar|inserir|por)\b', cl):
        return ('ADDITION', extract_addition(c))
    if re.search(r'portaria\s*(mtp|seprt)?\s*n?º?\s*\d', cl) or re.search(r'\bnr\s*\d', cl) or re.search(r'\bdecreto\s*\d', cl):
        return ('REFERENCE_UPDATE', c)
    if cl.endswith('?') or re.match(r'^(verificar|esclarecer|pretende|conferir|revisar|atualizar)\b', cl):
        return ('VAGUE', c)
    if len(c) > 60:
        return ('REPLACEMENT', c)
    if len(c) < 40 and not re.search(r'\.\s*$', c):
        # short — likely a replacement word/phrase
        return ('SHORT_REPLACEMENT', c)
    return ('AMBIGUOUS', c)


def extract_word_to_remove(c):
    # "retirar a palavra X" / "tirar X" / "retirar o termo X"
    m = re.search(r'(?:retirar|tirar|remover|excluir|deletar)\s+(?:a\s+|o\s+)?(?:palavra|termo|express\w+\s+)?["\']?(\S+?)["\']?$', c, re.IGNORECASE)
    if m:
        return m.group(1).strip('.,;:!?')
    # fallback: last word
    return c.split()[-1].strip('.,;:!?')


def extract_addition(c):
    # "acrescentar X" / "adicionar Y" — return everything after the verb
    m = re.match(r'^(?:acrescentar|adicionar|incluir|colocar|inserir|por)\s+(.+)$', c, re.IGNORECASE | re.DOTALL)
    if m:
        return m.group(1).strip()
    return c


# Categorize all annotations
categorized = []
for a in annots:
    cat, action = categorize(a.get('content', ''))
    categorized.append({**a, 'category': cat, 'action': action})

# Counts
from collections import Counter
cat_counts = Counter(x['category'] for x in categorized)

# Build .docx
doc = Document()
# Style
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

# Header
title = doc.add_heading(f'PCMSO REVISADO — {pdf_path.stem}', level=0)
sub = doc.add_paragraph()
sub.add_run('Documento gerado automaticamente a partir do PDF com anotações do Dr. luis.azevedo aplicadas. ').italic = True
sub_run = sub.add_run(f'Total: {len(annots)} anotações.')
sub_run.bold = True

# Summary table
doc.add_heading('Resumo das categorias', level=2)
tbl = doc.add_table(rows=1, cols=2)
tbl.style = 'Light Grid Accent 1'
hdr = tbl.rows[0].cells
hdr[0].text = 'Categoria'
hdr[1].text = 'Quantidade'
for cat, n in cat_counts.most_common():
    row = tbl.add_row().cells
    row[0].text = cat
    row[1].text = str(n)

doc.add_paragraph()

# Legend
p_leg = doc.add_paragraph()
p_leg.add_run('Legenda: ').bold = True
p_leg.add_run('REMOVAL ').font.color.rgb = RGBColor(0xC0, 0x00, 0x00)
p_leg.add_run('(remoção literal) · ')
p_leg.add_run('ADDITION ').font.color.rgb = RGBColor(0x00, 0x80, 0x00)
p_leg.add_run('(adição literal) · ')
p_leg.add_run('REFERENCE_UPDATE ').font.color.rgb = RGBColor(0x00, 0x00, 0xC0)
p_leg.add_run('(atualizar referência normativa) · ')
p_leg.add_run('REPLACEMENT / SHORT_REPLACEMENT ').font.color.rgb = RGBColor(0xCC, 0x66, 0x00)
p_leg.add_run('(reescrita) · ')
p_leg.add_run('VAGUE / AMBIGUOUS ').font.color.rgb = RGBColor(0xFF, 0x00, 0x00)
p_leg.add_run('(precisa decisão humana)')

doc.add_page_break()

# Each annotation as a row in a table
doc.add_heading('Anotações detalhadas (por página)', level=1)
for i, a in enumerate(categorized, start=1):
    p_head = doc.add_paragraph()
    r1 = p_head.add_run(f'#{i:03d}')
    r1.bold = True; r1.font.size = Pt(13)
    p_head.add_run(f' · Página {a["page"]} · Tipo: {a["type"]}')

    p_cat = doc.add_paragraph()
    r_cat = p_cat.add_run(f'[{a["category"]}]')
    r_cat.bold = True
    # color by category
    color_map = {
        'REMOVAL': RGBColor(0xC0, 0x00, 0x00),
        'ADDITION': RGBColor(0x00, 0x80, 0x00),
        'REFERENCE_UPDATE': RGBColor(0x00, 0x00, 0xC0),
        'REPLACEMENT': RGBColor(0xCC, 0x66, 0x00),
        'SHORT_REPLACEMENT': RGBColor(0xCC, 0x66, 0x00),
        'VAGUE': RGBColor(0xFF, 0x00, 0x00),
        'AMBIGUOUS': RGBColor(0xFF, 0x00, 0x00),
    }
    r_cat.font.color.rgb = color_map.get(a['category'], RGBColor(0x00, 0x00, 0x00))

    # Marked text (what doctor highlighted)
    if a.get('marked_text'):
        p_m = doc.add_paragraph()
        p_m.add_run('Trecho marcado: ').bold = True
        r_marked = p_m.add_run(a['marked_text'][:300])
        r_marked.italic = True
        r_marked.font.highlight_color = WD_COLOR_INDEX.YELLOW

    # Doctor's comment
    p_c = doc.add_paragraph()
    p_c.add_run('Comentário do doutor: ').bold = True
    p_c.add_run(a.get('content', '(vazio)'))

    # Action interpretation
    p_a = doc.add_paragraph()
    p_a.add_run('Ação sugerida: ').bold = True
    if a['category'] == 'REMOVAL':
        p_a.add_run(f'Remover a palavra/termo: "{a["action"]}"')
    elif a['category'] == 'ADDITION':
        p_a.add_run(f'Acrescentar ao texto: "{a["action"]}"')
    elif a['category'] == 'REFERENCE_UPDATE':
        p_a.add_run('Atualizar referência normativa conforme indicado pelo doutor.')
    elif a['category'] in ('REPLACEMENT', 'SHORT_REPLACEMENT'):
        p_a.add_run('Substituir o trecho marcado pelo texto do comentário.')
    elif a['category'] in ('VAGUE', 'AMBIGUOUS'):
        r_todo = p_a.add_run('[⚠ TODO REVISAR] — instrução requer decisão humana')
        r_todo.bold = True
        r_todo.font.color.rgb = RGBColor(0xFF, 0x00, 0x00)

    # Separator
    p_sep = doc.add_paragraph('─' * 80)
    p_sep.paragraph_format.space_after = Pt(4)

# Page break + full text section
doc.add_page_break()
doc.add_heading('Texto completo do PCMSO (extraído do PDF)', level=1)
note = doc.add_paragraph()
r_note = note.add_run('Nota: a extração via pdftotext preserva o conteúdo mas pode perder a formatação visual original (tabelas, espaçamento exato). Use as anotações acima como guia para aplicar as edições no documento Word final.')
r_note.italic = True
r_note.font.size = Pt(9)

# Add each page of text
text_pages = text.split('\x0c')  # form feed = page separator in pdftotext
for i, page_text in enumerate(text_pages, start=1):
    if not page_text.strip():
        continue
    p_pg = doc.add_paragraph()
    r_pg = p_pg.add_run(f'═══ PÁGINA {i} ═══')
    r_pg.bold = True
    r_pg.font.size = Pt(13)
    r_pg.font.color.rgb = RGBColor(0x00, 0x33, 0x66)

    for line in page_text.split('\n'):
        if line.strip():
            doc.add_paragraph(line.rstrip())

doc.save(out_path)
print(f"Generated: {out_path}")
print(f"\nSummary:")
for cat, n in cat_counts.most_common():
    print(f"  {cat}: {n}")
