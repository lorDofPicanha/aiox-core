#!/usr/bin/env python3
"""Build Guia de Amamentação .docx with Ease Health design tokens."""
from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement
from copy import deepcopy

OUT = "C:/Users/kingp/Downloads/Guia-Amamentacao.docx"

# Color tokens
FOREST = RGBColor(0x0f, 0x3e, 0x17)
FOREST_SOFT = RGBColor(0x1f, 0x5b, 0x2a)
MINT_GLAZE = "b1dbb8"
SLATE_MIST = "b6ced5"
KEYLIME = "e1f4df"
MINT_KISS = "cfe7d3"
CREAM = "fffefc"
BORDER = "e5e7eb"
INK = RGBColor(0x22, 0x22, 0x22)
CHARCOAL = RGBColor(0x33, 0x33, 0x33)
MUTED = RGBColor(0x6e, 0x6e, 0x66)
ALERT = RGBColor(0xa2, 0x39, 0x39)
ALERT_SOFT = "f0d8d8"
BRAND_BG_HEX = "0f3e17"  # for back cover

FONT_DISPLAY = "Fraunces"   # falls back to Georgia if not installed
FONT_BODY = "Inter"         # falls back to Calibri
FONT_MONO = "IBM Plex Mono" # falls back to Consolas


def set_cell_bg(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)


def set_cell_borders(cell, color="e5e7eb", size=4):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side in ('top', 'left', 'bottom', 'right'):
        el = OxmlElement(f'w:{side}')
        el.set(qn('w:val'), 'single')
        el.set(qn('w:sz'), str(size))
        el.set(qn('w:color'), color)
        tcBorders.append(el)
    tcPr.append(tcBorders)


def remove_cell_borders(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side in ('top', 'left', 'bottom', 'right'):
        el = OxmlElement(f'w:{side}')
        el.set(qn('w:val'), 'nil')
        tcBorders.append(el)
    tcPr.append(tcBorders)


def add_para(doc, text, font=FONT_BODY, size=11, color=INK, bold=False, italic=False,
             align=WD_ALIGN_PARAGRAPH.LEFT, space_after=6, space_before=0, line_spacing=1.5):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.line_spacing = line_spacing
    r = p.add_run(text)
    r.font.name = font
    r.font.size = Pt(size)
    r.font.color.rgb = color
    r.bold = bold
    r.italic = italic
    return p, r


def add_eyebrow(doc, text, color=None):
    if color is None:
        color = FOREST
    p, r = add_para(doc, text.upper(), font=FONT_MONO, size=9, color=color, bold=True, space_after=4)
    # Letter spacing approximated via tracking is not directly supported; just use uppercase mono
    return p


def add_h1(doc, text, color=None):
    if color is None:
        color = FOREST
    p, r = add_para(doc, text, font=FONT_DISPLAY, size=36, color=color, space_after=10, space_before=14, line_spacing=1.1)
    return p


def add_h2(doc, text, color=None):
    if color is None:
        color = FOREST
    p, r = add_para(doc, text, font=FONT_DISPLAY, size=24, color=color, space_after=8, space_before=12, line_spacing=1.15)
    return p


def add_h3(doc, text, color=None):
    if color is None:
        color = FOREST
    p, r = add_para(doc, text, font=FONT_DISPLAY, size=15, color=color, bold=False, space_after=4, space_before=6, line_spacing=1.2)
    return p


def page_break(doc):
    from docx.enum.text import WD_BREAK
    p = doc.add_paragraph()
    p.add_run().add_break(WD_BREAK.PAGE)


def add_callout_table(doc, title, body, bg_color, border_color=None, text_color=INK, title_color=None):
    """Single-row, single-col table styled as a colored card."""
    if title_color is None:
        title_color = FOREST
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_bg(cell, bg_color)
    remove_cell_borders(cell)
    cell.width = Cm(17)
    # Title
    p1 = cell.paragraphs[0]
    p1.paragraph_format.space_after = Pt(4)
    r1 = p1.add_run(title.upper())
    r1.font.name = FONT_MONO
    r1.font.size = Pt(9)
    r1.font.color.rgb = title_color
    r1.bold = True
    # Body
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    p2.paragraph_format.line_spacing = 1.45
    if isinstance(body, str):
        r2 = p2.add_run(body)
        r2.font.name = FONT_BODY
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = text_color
    elif isinstance(body, list):
        # list of bullet items
        for i, item in enumerate(body):
            if i > 0:
                p2 = cell.add_paragraph()
                p2.paragraph_format.space_after = Pt(0)
                p2.paragraph_format.line_spacing = 1.4
            r_bullet = p2.add_run("→ ")
            r_bullet.font.name = FONT_BODY; r_bullet.font.size = Pt(10.5); r_bullet.font.color.rgb = title_color; r_bullet.bold = True
            r_item = p2.add_run(item)
            r_item.font.name = FONT_BODY; r_item.font.size = Pt(10.5); r_item.font.color.rgb = text_color
    # Inner padding via cell margin
    set_cell_margins(cell, top=180, bottom=180, left=240, right=240)
    return tbl


def set_cell_margins(cell, top=100, bottom=100, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for side, val in (('top', top), ('left', left), ('bottom', bottom), ('right', right)):
        el = OxmlElement(f'w:{side}')
        el.set(qn('w:w'), str(val))
        el.set(qn('w:type'), 'dxa')
        tcMar.append(el)
    tcPr.append(tcMar)


def add_complication_card(doc, num, title_text, nicknames, blurb, symptoms, causes, treatment, prevention, alert=None, myth=None):
    """Render one complication block as a styled section using tables for backgrounds."""
    # Heading row (number + title)
    tbl = doc.add_table(rows=1, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    num_cell = tbl.cell(0, 0)
    title_cell = tbl.cell(0, 1)
    num_cell.width = Cm(2)
    title_cell.width = Cm(15)
    set_cell_bg(num_cell, KEYLIME)
    remove_cell_borders(num_cell)
    remove_cell_borders(title_cell)
    p_n = num_cell.paragraphs[0]
    r_n = p_n.add_run(num)
    r_n.font.name = FONT_MONO; r_n.font.size = Pt(11); r_n.font.color.rgb = FOREST; r_n.bold = True
    p_n.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_cell_margins(num_cell, top=80, bottom=80, left=80, right=80)

    p_t = title_cell.paragraphs[0]
    r_t = p_t.add_run(title_text)
    r_t.font.name = FONT_DISPLAY; r_t.font.size = Pt(15); r_t.font.color.rgb = FOREST
    set_cell_margins(title_cell, top=80, bottom=20, left=80, right=80)

    # Nicknames + blurb
    p_nick, _ = add_para(doc, nicknames, font=FONT_DISPLAY, size=10, color=CHARCOAL, italic=True, space_after=4)
    add_para(doc, blurb, font=FONT_BODY, size=11, color=INK, space_after=10, line_spacing=1.5)

    # 2x2 grid of info blocks via 2x2 table
    info_tbl = doc.add_table(rows=2, cols=2)
    info_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_tbl.autofit = False

    blocks = [
        ("SINTOMAS-CHAVE", symptoms, MINT_GLAZE),
        ("CAUSAS", causes, KEYLIME),
        ("COMO TRATAR", treatment, MINT_KISS),
        ("COMO PREVENIR", prevention, KEYLIME),
    ]
    for idx, (label, items, bg) in enumerate(blocks):
        row = idx // 2
        col = idx % 2
        cell = info_tbl.cell(row, col)
        set_cell_bg(cell, bg)
        remove_cell_borders(cell)
        cell.width = Cm(8.5)
        # label
        p_lbl = cell.paragraphs[0]
        p_lbl.paragraph_format.space_after = Pt(6)
        r_lbl = p_lbl.add_run(label)
        r_lbl.font.name = FONT_MONO; r_lbl.font.size = Pt(8.5); r_lbl.font.color.rgb = FOREST; r_lbl.bold = True
        # items
        for item in items:
            p_i = cell.add_paragraph()
            p_i.paragraph_format.space_after = Pt(2)
            p_i.paragraph_format.line_spacing = 1.4
            r_arrow = p_i.add_run("→ ")
            r_arrow.font.name = FONT_BODY; r_arrow.font.size = Pt(9.5); r_arrow.font.color.rgb = FOREST; r_arrow.bold = True
            r_it = p_i.add_run(item)
            r_it.font.name = FONT_BODY; r_it.font.size = Pt(9.5); r_it.font.color.rgb = INK
        set_cell_margins(cell, top=150, bottom=150, left=180, right=180)

    # Alert callout
    if alert:
        doc.add_paragraph().paragraph_format.space_after = Pt(4)
        add_callout_table(doc, "QUANDO PROCURAR MÉDICO", alert, SLATE_MIST)

    # Myth mini
    if myth:
        p_myth, _ = add_para(doc, "", font=FONT_BODY, size=10, color=CHARCOAL, italic=True, space_after=4, space_before=6)
        r_myth_lbl = p_myth.add_run("Mito relacionado: ")
        r_myth_lbl.font.name = FONT_BODY; r_myth_lbl.font.size = Pt(10); r_myth_lbl.font.color.rgb = ALERT; r_myth_lbl.bold = True
        r_myth_text = p_myth.add_run(myth)
        r_myth_text.font.name = FONT_DISPLAY; r_myth_text.font.size = Pt(10); r_myth_text.font.color.rgb = CHARCOAL; r_myth_text.italic = True

    # Spacer
    doc.add_paragraph().paragraph_format.space_after = Pt(8)


def add_mvt(doc, num, mito, verdade):
    """Add a Myth vs Truth styled block."""
    # Number badge row
    tbl_num = doc.add_table(rows=1, cols=1)
    cell = tbl_num.cell(0, 0)
    set_cell_bg(cell, BRAND_BG_HEX)
    remove_cell_borders(cell)
    p = cell.paragraphs[0]
    r = p.add_run(f"MITO {num:02d}")
    r.font.name = FONT_MONO; r.font.size = Pt(10); r.font.color.rgb = RGBColor(0xff, 0xfe, 0xfc); r.bold = True
    set_cell_margins(cell, top=80, bottom=80, left=200, right=200)

    # Myth claim
    tbl_m = doc.add_table(rows=1, cols=1)
    cm = tbl_m.cell(0, 0)
    set_cell_bg(cm, ALERT_SOFT)
    remove_cell_borders(cm)
    p_lbl = cm.paragraphs[0]
    p_lbl.paragraph_format.space_after = Pt(4)
    r_lbl = p_lbl.add_run("O QUE DIZEM")
    r_lbl.font.name = FONT_MONO; r_lbl.font.size = Pt(8.5); r_lbl.font.color.rgb = ALERT; r_lbl.bold = True
    p_text = cm.add_paragraph()
    p_text.paragraph_format.space_after = Pt(0)
    r_text = p_text.add_run(f'"{mito}"')
    r_text.font.name = FONT_DISPLAY; r_text.font.size = Pt(13); r_text.font.color.rgb = CHARCOAL; r_text.italic = True
    set_cell_margins(cm, top=180, bottom=180, left=260, right=260)

    # Truth
    tbl_v = doc.add_table(rows=1, cols=1)
    cv = tbl_v.cell(0, 0)
    set_cell_bg(cv, KEYLIME)
    remove_cell_borders(cv)
    p_lbl2 = cv.paragraphs[0]
    p_lbl2.paragraph_format.space_after = Pt(4)
    r_lbl2 = p_lbl2.add_run("O QUE A EVIDÊNCIA DIZ")
    r_lbl2.font.name = FONT_MONO; r_lbl2.font.size = Pt(8.5); r_lbl2.font.color.rgb = FOREST; r_lbl2.bold = True
    p_text2 = cv.add_paragraph()
    p_text2.paragraph_format.space_after = Pt(0)
    p_text2.paragraph_format.line_spacing = 1.5
    # Parse bold markers **text**
    import re
    parts = re.split(r'(\*\*[^*]+\*\*)', verdade)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            r_b = p_text2.add_run(part[2:-2])
            r_b.font.name = FONT_BODY; r_b.font.size = Pt(11); r_b.font.color.rgb = FOREST; r_b.bold = True
        else:
            r_n = p_text2.add_run(part)
            r_n.font.name = FONT_BODY; r_n.font.size = Pt(11); r_n.font.color.rgb = INK
    set_cell_margins(cv, top=180, bottom=180, left=260, right=260)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)


def add_help_card(doc, label, items, bg, label_color=None):
    if label_color is None:
        label_color = FOREST
    tbl = doc.add_table(rows=1, cols=1)
    cell = tbl.cell(0, 0)
    set_cell_bg(cell, bg)
    remove_cell_borders(cell)
    p_lbl = cell.paragraphs[0]
    p_lbl.paragraph_format.space_after = Pt(8)
    r_lbl = p_lbl.add_run(label.upper())
    r_lbl.font.name = FONT_MONO; r_lbl.font.size = Pt(9); r_lbl.font.color.rgb = label_color; r_lbl.bold = True
    for item in items:
        p_i = cell.add_paragraph()
        p_i.paragraph_format.space_after = Pt(2)
        p_i.paragraph_format.line_spacing = 1.45
        r_a = p_i.add_run("→ ")
        r_a.font.name = FONT_BODY; r_a.font.size = Pt(10.5); r_a.font.color.rgb = label_color; r_a.bold = True
        # parse bold
        import re
        for part in re.split(r'(\*\*[^*]+\*\*)', item):
            if part.startswith('**') and part.endswith('**'):
                rb = p_i.add_run(part[2:-2])
                rb.font.name = FONT_BODY; rb.font.size = Pt(10.5); rb.font.color.rgb = INK; rb.bold = True
            else:
                rn = p_i.add_run(part)
                rn.font.name = FONT_BODY; rn.font.size = Pt(10.5); rn.font.color.rgb = INK
    set_cell_margins(cell, top=200, bottom=200, left=280, right=280)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)


def add_refs_card(doc, title, items, bg=None):
    tbl = doc.add_table(rows=1, cols=1)
    cell = tbl.cell(0, 0)
    if bg:
        set_cell_bg(cell, bg)
    set_cell_borders(cell, BORDER, 4)
    p_h = cell.paragraphs[0]
    p_h.paragraph_format.space_after = Pt(8)
    r_h = p_h.add_run(title)
    r_h.font.name = FONT_DISPLAY; r_h.font.size = Pt(14); r_h.font.color.rgb = FOREST
    for item in items:
        p_i = cell.add_paragraph()
        p_i.paragraph_format.space_after = Pt(4)
        p_i.paragraph_format.line_spacing = 1.5
        r_dot = p_i.add_run("●  ")
        r_dot.font.name = FONT_BODY; r_dot.font.size = Pt(9); r_dot.font.color.rgb = FOREST
        import re
        for part in re.split(r'(\*\*[^*]+\*\*)', item):
            if part.startswith('**') and part.endswith('**'):
                rb = p_i.add_run(part[2:-2])
                rb.font.name = FONT_BODY; rb.font.size = Pt(10); rb.font.color.rgb = FOREST; rb.bold = True
            else:
                rn = p_i.add_run(part)
                rn.font.name = FONT_BODY; rn.font.size = Pt(10); rn.font.color.rgb = INK
    set_cell_margins(cell, top=220, bottom=220, left=280, right=280)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)


# ════════════════ BUILD DOC ════════════════
doc = Document()

# Set default style
style = doc.styles['Normal']
style.font.name = FONT_BODY
style.font.size = Pt(11)

# Page setup A4
section = doc.sections[0]
section.page_height = Mm(297)
section.page_width = Mm(210)
section.top_margin = Mm(20)
section.bottom_margin = Mm(20)
section.left_margin = Mm(20)
section.right_margin = Mm(20)

# ─── COVER ───
add_eyebrow(doc, "Guia clínico · Saúde materno-infantil")
add_h1(doc, "Amamentar sem medo, sem mito.")
add_para(doc, "Complicações reais, sinais de alerta e o que a ciência diz sobre os mitos mais difundidos no Brasil — em uma leitura que cabe na bolsa da maternidade.", font=FONT_DISPLAY, size=14, color=CHARCOAL, italic=True, space_after=20, line_spacing=1.4)

# Cover meta strip
cover_tbl = doc.add_table(rows=1, cols=3)
cover_tbl.autofit = False
for i, (k, v) in enumerate([
    ("CONTEÚDO", "12 complicações\n18 mitos vs verdades"),
    ("BASEADO EM", "SBP 2024 · ABM #36/2022\nOMS · Ministério da Saúde"),
    ("REVISÃO", "2026\nVersão 1.0"),
]):
    cell = cover_tbl.cell(0, i)
    remove_cell_borders(cell)
    pk = cell.paragraphs[0]
    pk.paragraph_format.space_after = Pt(2)
    rk = pk.add_run(k)
    rk.font.name = FONT_MONO; rk.font.size = Pt(8); rk.font.color.rgb = MUTED; rk.bold = True
    pv = cell.add_paragraph()
    pv.paragraph_format.space_after = Pt(0)
    rv = pv.add_run(v)
    rv.font.name = FONT_DISPLAY; rv.font.size = Pt(11); rv.font.color.rgb = FOREST

page_break(doc)

# ─── TOC ───
add_h2(doc, "Sumário")
toc_items = [
    ("PARTE 1", "Complicações principais — 12 condições com sintomas, tratamento e prevenção"),
    ("PARTE 2", "Mitos & Verdades — O que circula no boca-a-boca vs evidência atual"),
    ("PARTE 3", "Quando procurar ajuda — Sinais de alerta vermelhos (red flags)"),
    ("PARTE 4", "Onde buscar apoio — Fontes oficiais brasileiras e internacionais"),
]
toc_tbl = doc.add_table(rows=len(toc_items), cols=2)
toc_tbl.autofit = False
for i, (n, txt) in enumerate(toc_items):
    cn = toc_tbl.cell(i, 0); ct = toc_tbl.cell(i, 1)
    cn.width = Cm(3); ct.width = Cm(15)
    remove_cell_borders(cn); remove_cell_borders(ct)
    pn = cn.paragraphs[0]
    pn.paragraph_format.space_after = Pt(8); pn.paragraph_format.space_before = Pt(8)
    rn = pn.add_run(n)
    rn.font.name = FONT_MONO; rn.font.size = Pt(9); rn.font.color.rgb = FOREST; rn.bold = True
    pt = ct.paragraphs[0]
    pt.paragraph_format.space_after = Pt(8); pt.paragraph_format.space_before = Pt(8)
    rt = pt.add_run(txt)
    rt.font.name = FONT_BODY; rt.font.size = Pt(11); rt.font.color.rgb = INK

page_break(doc)

# ════════════════ PARTE 1 ════════════════
add_eyebrow(doc, "— Parte 01")
add_h1(doc, "Complicações principais")
add_para(doc, "Doze condições que aparecem com frequência na amamentação. A maioria começa com uma única causa: pega inadequada. Por isso ela vem em primeiro lugar.", font=FONT_DISPLAY, size=13, color=CHARCOAL, italic=True, space_after=14, line_spacing=1.4)

# Complications data
complications = [
    {
        "num": "01", "title": "Pega incorreta / Dor ao amamentar",
        "nicknames": "Pega inadequada · suboptimal latch",
        "blurb": "O bebê abocanha apenas o mamilo (e não a aréola), gerando trauma mecânico, dor e baixa transferência de leite. É a causa raiz da maioria das complicações.",
        "symptoms": ["Dor durante toda a mamada (não só nos primeiros segundos)", "Mamilo sai achatado ou em forma de batom", "Estalos da língua audíveis", "Bebê não engole audivelmente", "Bochechas encovam ao sugar"],
        "causes": ["Boca pouco aberta", "Bebê longe do corpo da mãe", "Cabeça desalinhada do tronco", "Anquiloglossia (língua presa)"],
        "treatment": ["Corrigir pega: boca bem aberta, lábios evertidos, queixo encostado", "Aréola abocanhada assimetricamente (mais parte inferior)", "Consultora de amamentação (IBCLC) ou banco de leite", "Frenotomia se língua presa significativa"],
        "prevention": ["Orientação ainda na gestação", "Primeira mamada na sala de parto", "Pele a pele imediato"],
        "myth": "Dor faz parte do começo. — Verdade: dor leve nos primeiros segundos pode ocorrer, mas dor persistente indica pega errada.",
    },
    {
        "num": "02", "title": "Fissura mamilar",
        "nicknames": "Trauma mamilar · rachadura, ferida no bico",
        "blurb": "Lesão cutânea no mamilo ou aréola causada por trauma mecânico repetido.",
        "symptoms": ["Rachaduras visíveis no mamilo", "Sangramento", "Dor em pontada durante a mamada", "Crosta cicatricial", "Mamilo branco ou roxo após mamar (vasoespasmo)"],
        "causes": ["Pega incorreta (causa #1)", "Bomba com flange de tamanho errado", "Sucção do bebê com língua presa", "Retirada do bebê sem desfazer o vácuo"],
        "treatment": ["Corrigir a pega primeiro — sem isso, nada cicatriza", "Começar pela mama menos dolorida", "Expor mamilo ao ar entre mamadas", "Aplicar o próprio leite materno e deixar secar — propriedades antimicrobianas", "Lanolina purificada (HPA); silver caps em casos refratários"],
        "prevention": ["Pega correta desde a primeira mamada", "Desfazer vácuo com dedo mínimo antes de retirar o bebê", "Não usar sabonete no mamilo"],
        "alert": "Sinais de infecção: pus, vermelhidão expandida, febre. Fissura que não cicatriza em 7 dias mesmo com pega corrigida.",
    },
    {
        "num": "03", "title": "Ingurgitamento mamário",
        "nicknames": "Engorgement · leite empedrado",
        "blurb": "Acúmulo de leite somado a congestão linfática e vascular, geralmente entre 3º e 5º dia pós-parto (apojadura) ou em qualquer intervalo prolongado.",
        "symptoms": ["Mamas duras, brilhantes, edemaciadas", "Dor difusa", "Aréola tensa dificultando pega", "Febre baixa <38°C possível", "Calor local"],
        "causes": ["Apojadura natural", "Mamadas espaçadas demais", "Pega ruim impedindo esvaziamento", "Desmame abrupto"],
        "treatment": ["Amamentar em livre demanda", "Compressas FRIAS entre as mamadas — mudança recente do protocolo", "Ordenha manual suave da aréola (pressão reversa de Cotterman)", "Ibuprofeno é seguro", "Evitar massagem agressiva — pode piorar o edema"],
        "prevention": ["Mamadas frequentes em livre demanda desde o nascimento", "Não pular mamadas durante a apojadura", "Desmame gradual quando chegar a hora"],
    },
    {
        "num": "04", "title": "Bloqueio de ductos (ducto entupido)",
        "nicknames": "Estase ductal · ductal narrowing with stromal edema",
        "blurb": "Inflamação localizada com estreitamento de um ducto. Atualização ABM 2022: não é literalmente um ducto entupido por leite, mas inflamação peri-ductal.",
        "symptoms": ["Nódulo localizado, vermelho, quente", "Dor pontual (não difusa)", "Sem febre alta", "Pode ter pontinho branco no mamilo (bolha de leite)"],
        "causes": ["Mamada incompleta", "Pressão local (sutiã apertado, alça de bolsa)", "Dormir de bruços", "Hiperlactação"],
        "treatment": ["Amamentar do lado afetado normalmente — sem forçar esvaziamento extra", "Gelo entre mamadas + ibuprofeno", "Massagem linfática suave (toque de pluma em direção às axilas)", "Lecitina de soja 5-10g/dia em casos recorrentes", "EVITAR: bombear excessivamente, massagem vigorosa, vibradores"],
        "prevention": ["Sutiãs sem aros e bem ajustados", "Alternar mamas regularmente", "Esvaziamento por sucção do bebê (não bomba)"],
        "alert": "Evoluir para febre >38,5°C, vermelhidão expandida ou nódulo flutuante.",
    },
    {
        "num": "05", "title": "Mastite",
        "nicknames": "Mastite lactacional · infecção na mama",
        "blurb": "Inflamação da mama, com ou sem infecção bacteriana. A ABM redefiniu mastite como espectro contínuo, não só infecção.",
        "symptoms": ["Área vermelha, quente, dolorida em forma de cunha", "Febre >38,5°C", "Calafrios, mialgia", "Sensação de gripe"],
        "causes": ["Disbiose do microbioma mamário", "Trauma mamilar com entrada de bactérias", "Estase prolongada", "Estresse e fadiga materna"],
        "treatment": ["MANTER a amamentação — interromper PIORA o quadro", "Gelo + ibuprofeno + paracetamol", "Repouso, hidratação", "Antibiótico se sintomas sistêmicos >24h: dicloxacilina, cefalexina, clindamicina por 10-14 dias", "Probióticos L. fermentum ou L. salivarius"],
        "prevention": ["Pega correta para evitar trauma", "Esvaziamento adequado das mamas", "Repouso e gerenciamento de estresse"],
        "alert": "Febre >38,5°C por mais de 24h · vermelhidão expansiva · área flutuante (abscesso) · pus saindo do mamilo · não-melhora após 48h de antibiótico.",
        "myth": "Mastite contamina o leite, tem que jogar fora. — Falso. O leite continua seguro para o bebê.",
    },
    {
        "num": "06", "title": "Abscesso mamário",
        "nicknames": "Complicação grave da mastite não tratada",
        "blurb": "Coleção de pus encapsulada — red flag absoluto. Não pode esperar.",
        "symptoms": ["Nódulo flutuante, muito dolorido", "Pele tensa, brilhante", "Febre alta persistente", "Estado geral comprometido"],
        "causes": ["Mastite não tratada ou tratada de forma inadequada"],
        "treatment": ["Drenagem por punção guiada por ultrassom (1ª linha hoje, menos invasiva)", "Antibiótico sistêmico", "Manutenção da amamentação na mama saudável e idealmente também na afetada"],
        "prevention": ["Tratar mastite a tempo e adequadamente", "Buscar atendimento médico cedo"],
    },
    {
        "num": "07", "title": "Candidíase mamária (sapinho)",
        "nicknames": "Candidíase mamária · sapinho, monilíase",
        "blurb": "Infecção fúngica (Candida albicans) do mamilo, aréola e/ou ductos, frequentemente associada a sapinho oral no bebê.",
        "symptoms": ["Dor em agulhada ou queimação que persiste após a mamada", "Coceira", "Mamilo rosa-brilhante ou descamativo", "Bebê com placas brancas na boca", "Dor entre mamadas sem febre"],
        "causes": ["Uso recente de antibiótico", "Trauma mamilar prévio", "Diabetes", "Imunossupressão"],
        "treatment": ["MÃE E BEBÊ tratados juntos, mesmo se um não tem sintoma", "Mãe: nistatina creme 2-3x/dia por 14 dias; miconazol ou cetoconazol; casos resistentes: fluconazol 150-400mg dose única", "Bebê: nistatina suspensão oral 1mL 4x/dia por 7-14 dias", "Esterilizar chupetas, bicos, bombas diariamente"],
        "prevention": ["Secar mamilos após mamada", "Trocar protetores de seio frequentemente", "Tratar candidíase vaginal antes do parto"],
    },
    {
        "num": "08", "title": "Hipogalactia (baixa produção real)",
        "nicknames": "Baixa produção de leite — só ~5% dos casos são reais",
        "blurb": "Verdadeira hipogalactia é rara. A hipogalactia percebida (achar que tem pouco leite quando tem o suficiente) é extremamente comum e principal causa de desmame precoce.",
        "symptoms": ["Bebê não recupera peso de nascimento até 14-21 dias", "Ganho de peso <20g/dia após 1ª semana", "Menos de 6 fraldas de xixi/dia após 5º dia", "Xixi escuro / cristais de urato", "Bebê letárgico, desidratado"],
        "causes": ["Sinais que ENGANAM: mama mole, bebê mamando frequente, tempo curto de mamada, bebê chora", "Causas reais: retenção placentária, síndrome de Sheehan, hipoplasia, cirurgia mamária, hipotireoidismo, SOP, diabetes mal controlada, tabagismo pesado"],
        "treatment": ["Investigar e tratar a causa", "Aumentar frequência de mamadas + ordenha", "Consultora IBCLC", "Suplementação medicamentosa só em casos selecionados", "Relactação é possível"],
        "prevention": ["Pega correta desde o início", "Evitar fórmula desnecessária nas primeiras 72h"],
    },
    {
        "num": "09", "title": "Hipergalactia / Reflexo de ejeção forte",
        "nicknames": "Hiperlactação · ABM #32",
        "blurb": "Produção >1.200mL/dia somada a uma ejeção muito intensa que sufoca o bebê. Tão problemática quanto a baixa produção.",
        "symptoms": ["MÃE: mamas sempre pesadas, vazamento constante, dor, ductos bloqueados recorrentes, mastites recorrentes", "BEBÊ: engasgos durante a mamada, solta o peito chorando, gases excessivos, refluxo, fezes verdes espumosas, ganho de peso acelerado"],
        "causes": ["Ordenhar muito entre mamadas nos primeiros dias", "Resposta hormonal acentuada", "Galactogogos exógenos"],
        "treatment": ["Block feeding: mesma mama por 2-4h antes de trocar", "Posição reclinada (bebê por cima) — gravidade desacelera o fluxo", "Ordenhar um pouco antes da mamada para tirar o primeiro jato", "Casos refratários: cabergolina 0,25-0,5mg (prescrição)"],
        "prevention": ["NÃO ordenhar entre mamadas para guardar sem necessidade nos primeiros dias", "Confiar na demanda do bebê"],
    },
    {
        "num": "10", "title": "D-MER · Reflexo de Ejeção Disfórico",
        "nicknames": "Dysphoric Milk Ejection Reflex · ~14% das lactantes",
        "blurb": "Onda BREVE de emoções negativas (tristeza, ansiedade, vazio, repulsa) que começa segundos antes do leite descer. Causa: queda súbita de dopamina. NÃO é depressão pós-parto, NÃO é aversão à amamentação. É fisiológico.",
        "symptoms": ["Desânimo súbito ao mamar ou bombear", "Sensação de buraco no estômago", "Náusea", "Melhora rápida após descer o leite (30s a poucos minutos)"],
        "causes": ["Queda fisiológica de dopamina associada à subida da prolactina", "Causa biológica — não emocional"],
        "treatment": ["Conhecimento e validação já reduzem o sofrimento", "Hidratação, sono, redução de cafeína", "Casos severos: avaliação psiquiátrica; bupropiona testada em casos refratários"],
        "prevention": ["Não há prevenção (é fisiológico) — mas saber que existe muda tudo"],
        "alert": "Depressão pós-parto: sintomas contínuos, não atrelados ao reflexo. Aversão à amamentação: raiva sustentada durante toda a mamada.",
    },
    {
        "num": "11", "title": "Galactocele",
        "nicknames": "Cisto benigno preenchido por leite",
        "blurb": "Cisto benigno geralmente formado durante desmame ou redução de mamadas.",
        "symptoms": ["Nódulo macio/elástico, INDOLOR, móvel", "Sem vermelhidão", "Sem febre"],
        "causes": ["Desmame", "Redução abrupta de mamadas", "Ducto crônicamente obstruído"],
        "treatment": ["Ultrassom mamário (padrão-ouro de diagnóstico)", "Punção aspirativa esvazia", "Tende à reabsorção espontânea após cessar lactação", "Cirurgia raramente necessária"],
        "prevention": ["Desmame gradual"],
        "alert": "Todo nódulo persistente na mama lactante precisa de ultrassom — para descartar outras causas, incluindo câncer de mama gestacional/lactacional.",
    },
    {
        "num": "12", "title": "Mamilo invertido / Plano",
        "nicknames": "Variação anatômica · grau I/II/III",
        "blurb": "Mamilo invertido NÃO impede amamentar. A maioria das mulheres consegue amamentar com sucesso com apoio adequado nas primeiras 2 semanas.",
        "symptoms": ["Grau I — sai com estímulo", "Grau II — sai parcialmente", "Grau III — não sai (mais difícil)"],
        "causes": ["Variação anatômica congênita"],
        "treatment": ["Foco na TÉCNICA — o bebê mama na aréola, não no mamilo", "Bomba manual ou seringa invertida 30 segundos antes da mamada para evertir", "Bico de silicone (nipple shield) — uso pontual com acompanhamento", "Exercícios de Hoffman e conchas mamárias NÃO mais recomendados (sem evidência)"],
        "prevention": ["Não aplicável (variação anatômica)"],
    },
    {
        "num": "13", "title": "Crise de crescimento / Cluster feeding",
        "nicknames": "NÃO é doença — mas é a #1 causa de desmame precoce no Brasil",
        "blurb": "Períodos de 2-7 dias em que o bebê mama muito mais frequente — o corpo está aumentando a produção via aumento da demanda.",
        "symptoms": ["Bebê chora, mama, solta, chora de novo", "Vontade de mamar o tempo todo", "Comum especialmente no fim da tarde"],
        "causes": ["QUANDO: ~7-10 dias, 3 semanas, 6 semanas, 3 meses, 6 meses, 9 meses"],
        "treatment": ["NÃO suplementar com fórmula — reduz o estímulo e baixa a produção", "Mamar em livre demanda resolve em poucos dias", "Confiar no processo"],
        "prevention": ["Conhecer os marcos para não confundir com leite fraco"],
    },
]

for c in complications:
    add_complication_card(
        doc, c["num"], c["title"], c["nicknames"], c["blurb"],
        c["symptoms"], c["causes"], c["treatment"], c["prevention"],
        alert=c.get("alert"), myth=c.get("myth")
    )

# ════════════════ PARTE 2 ════════════════
page_break(doc)
add_eyebrow(doc, "— Parte 02")
add_h1(doc, "Mitos & Verdades")
add_para(doc, "Dezoito crenças populares sobre amamentação confrontadas com a evidência mais atual. Os dois mais perigosos — \"leite fraco\" e \"cerveja preta aumenta o leite\" — são os principais culpados pelo desmame precoce no Brasil.", font=FONT_DISPLAY, size=13, color=CHARCOAL, italic=True, space_after=14, line_spacing=1.4)

mvts = [
    ("Tem que dar de mamar de 3 em 3 horas.",
     "**Esquema de 3 em 3 horas vem da cultura da mamadeira** (volume fixo, intervalo fixo). Ministério da Saúde e SBP recomendam **livre demanda**. Bebês em aleitamento exclusivo mamam de 8 a 12 vezes em 24h, sem horário. Restringir intervalos reduz produção e causa ingurgitamento."),
    ("Existe leite fraco — o meu leite é ralo.",
     "**Nenhum leite materno é fraco.** O leite muda de composição naturalmente — colostro (1-5 dias), de transição (6-15 dias), maduro (>25 dias). Dentro da mesma mamada o leite anterior é mais ralo e o posterior mais gorduroso. Até mães desnutridas leves/moderadas produzem leite nutricionalmente adequado."),
    ("Depois de 6 meses o leite vira água e não alimenta mais.",
     "Estudos mostram que **100mL de leite materno após 1 ano continuam densos em calorias e gordura — frequentemente mais calóricos que aos 3 meses.** OMS, UNICEF, SBP e Ministério da Saúde recomendam amamentação até 2 anos ou mais, com introdução alimentar a partir dos 6 meses."),
    ("Cerveja preta, canjica, água inglesa aumentam o leite.",
     "**Não há evidência científica** de que qualquer alimento ou bebida aumente a produção. O que aumenta o leite é a sucção do bebê + hidratação materna. Cerveja preta contém álcool (passa para o leite e INIBE o reflexo de ejeção). Canjica tem leite de vaca (pode causar cólica)."),
    ("Mãe magra / baixo peso / pequena produz menos leite.",
     "O IMC materno **não é** fator limitante em mulheres saudáveis. Apenas desnutrição severa pode reduzir o volume produzido. Curiosamente, mães com obesidade têm MAIOR chance de atraso na descida do leite, não menor."),
    ("Seio pequeno produz menos leite.",
     "O tamanho do seio é determinado pelo tecido **adiposo**, não pelo tecido **glandular**. A quantidade de glândulas é semelhante entre mulheres. O que muda é a capacidade de armazenamento — mães com mamas menores podem precisar amamentar com mais frequência, mas a produção em 24h é equivalente."),
    ("Mamilo invertido impede amamentação.",
     "O bebê mama na **aréola**, não no mamilo. Com técnica adequada, bomba ou seringa para evertir antes da mamada, e às vezes bico de silicone temporário, **a grande maioria das mulheres com mamilo invertido amamenta com sucesso.**"),
    ("Mãe com gripe / Covid não pode amamentar.",
     "Ao contrário — **deve** amamentar. O leite passa anticorpos contra o vírus para o bebê (imunidade passiva, mecanismo documentado). Cuidados: máscara, higiene de mãos, evitar tossir/espirrar próximo do bebê. Vale para gripe sazonal, Covid-19, resfriado comum."),
    ("Mãe que toma remédio não pode amamentar.",
     "**A maior parte dos medicamentos é compatível com amamentação.** Paracetamol, ibuprofeno, dipirona, maioria dos antibióticos, antidepressivos (sertralina) — todos seguros. Consulte **e-lactancia.org** e **LactMed** (NIH). Drogas realmente incompatíveis são poucas (alguns quimioterápicos, lítio, amiodarona, isotretinoína)."),
    ("Amamentar deforma os seios.",
     "Quem altera o formato dos seios é a **gestação** (alterações hormonais, ganho de peso) e a **genética/idade** — não a amamentação. Estudos mostram que ptose mamária correlaciona com IMC, número de gestações, idade e tabagismo — NÃO com tempo de amamentação."),
    ("Bico de silicone e mamadeira não atrapalham a pega.",
     "A **confusão de bicos é real** para muitos bebês — o padrão de sucção na mamadeira (fluxo passivo) é diferente do peito (sucção ativa). SBP: evitar mamadeira, chupeta e bico nas primeiras 4-6 semanas. Se precisar complementar, usar copinho, colher dosadora ou seringa."),
    ("Tomar chá X cura cólica do bebê via leite.",
     "Chás passam para o leite em quantidades mínimas e **não tratam cólica**. Alguns são PERIGOSOS (anis-estrelado verdadeiro pode causar convulsão; boldo, sene, erva-de-são-joão contraindicados). Cólica é fisiológica até 3-4 meses e melhora com colo, posição vertical, shantala e tempo."),
    ("Quem fez cesárea demora pra descer o leite.",
     "**Parcialmente verdade.** A cesárea é fator de risco para atraso na lactogênese II (~43% dos casos de atraso segundo estudos brasileiros). Mas isso não impede amamentação — só exige mais paciência, pele a pele precoce e mamadas frequentes desde a sala de recuperação."),
    ("Tem que acordar o bebê para mamar.",
     "**Depende.** Nos primeiros 15 dias e em bebês com baixo ganho de peso ou icterícia: SIM, acordar a cada 3h dia e 4h noite. Depois, com ganho de peso adequado, o bebê pode espaçar e o sono deve ser respeitado."),
    ("Bebê dorme mais com fórmula = fórmula alimenta mais.",
     "A fórmula é **mais difícil de digerir** que o leite materno, então o bebê fica mais tempo em digestão e dorme mais por isso — não porque está melhor alimentado. Leite materno: digerido em ~90 minutos. Fórmula: 3-4 horas."),
    ("Leite materno mata a fome igual fórmula.",
     "**Verdade — e muito mais.** O leite materno nutre, hidrata, IMUNIZA, fornece células-tronco, hormônios, microbiota viva e fatores de crescimento que nenhuma fórmula consegue replicar. Reduz infecções respiratórias (-50%), diarreia (-60%), otite (-50%), morte súbita (-36%), obesidade infantil, diabetes tipo 1 e 2 e leucemia."),
    ("Amamentação como anticoncepcional (LAM) é seguro.",
     "**Verdade — com condições rígidas.** O LAM é 98% eficaz SE todas estas condições forem atendidas: (1) bebê <6 meses; (2) aleitamento exclusivo, livre demanda, dia e noite, sem intervalos >4h dia e >6h noite; (3) mãe em amenorreia. Saindo de qualquer um dos três, a eficácia despenca."),
    ("Tem que lavar o seio antes e depois de cada mamada.",
     "Lavar o mamilo **retira a proteção natural** das glândulas de Montgomery (que produzem secreção antimicrobiana e lubrificante). Banho diário é suficiente. **Não usar sabonete no mamilo.** Após mamada, passar uma gota do próprio leite e deixar secar."),
]

for i, (mito, verdade) in enumerate(mvts, start=1):
    add_mvt(doc, i, mito, verdade)

# ════════════════ PARTE 3 — RED FLAGS ════════════════
page_break(doc)
add_eyebrow(doc, "— Parte 03")
add_h1(doc, "Quando procurar ajuda")
add_para(doc, "Sinais que separam o \"espera amanhã\" do \"vai agora\". Saber distinguir é o que evita complicações graves.", font=FONT_DISPLAY, size=13, color=CHARCOAL, italic=True, space_after=14, line_spacing=1.4)

add_help_card(doc, "⚠  Pronto-socorro / médico AGORA", [
    "**Febre >38,5°C** persistente por mais de 24h",
    "Vermelhidão na mama que **se expande** ou tem aspecto de casca de laranja",
    "Nódulo com **flutuação** (sensação de líquido por baixo) — pode ser abscesso",
    "**Pus saindo do mamilo**",
    "Calafrios intensos com prostração severa",
    "Mastite que **não melhora em 48h** com antibiótico",
    "Sangramento abundante do mamilo",
], SLATE_MIST, label_color=ALERT)

add_help_card(doc, "→ Consultora de amamentação / banco de leite em até 48h", [
    "Dor durante toda a mamada (não passa após corrigir pega)",
    "Bebê não está ganhando peso ou perdeu >10% do peso de nascimento",
    "Bebê faz menos de 6 fraldas de xixi/dia após o 5º dia",
    "Bebê com aspecto letárgico, difícil de acordar",
    "Xixi escuro com manchas alaranjadas (cristais de urato após 3º dia)",
    "Fissura que não cicatriza em 1 semana",
], MINT_GLAZE)

add_help_card(doc, "→ Ginecologista", [
    "Nódulo persistente que não some em 1-2 semanas (mesmo sem dor)",
    "Secreção sanguinolenta unilateral persistente",
    "Retração de pele ou mamilo recente",
], KEYLIME)

add_help_card(doc, "→ Psicólogo / Psiquiatra", [
    "Tristeza/ansiedade que persiste fora dos episódios de descida do leite",
    "Pensamentos de fazer mal a si ou ao bebê",
    "Aversão sustentada à amamentação",
    "D-MER severo que comprometa a relação com o bebê",
], MINT_KISS)

# ════════════════ PARTE 4 — FONTES ════════════════
page_break(doc)
add_eyebrow(doc, "— Parte 04")
add_h1(doc, "Onde buscar apoio")
add_para(doc, "Fontes confiáveis para aprofundar, validar e — sobretudo — para receber atendimento gratuito quando precisar.", font=FONT_DISPLAY, size=13, color=CHARCOAL, italic=True, space_after=14, line_spacing=1.4)

add_refs_card(doc, "Brasil — Oficiais", [
    "**Ministério da Saúde** — Saúde da Criança / Aleitamento Materno · gov.br/saude",
    "**Sociedade Brasileira de Pediatria (SBP)** — Guia Prático de Aleitamento Materno (2024) · sbp.com.br",
    "**Rede Brasileira de Bancos de Leite Humano (rBLH/Fiocruz)** — 222 bancos em todos os estados · rblh.fiocruz.br · **Disque Saúde 136**",
    "**BVS-MS** — Guia \"Amamentação e Uso de Medicamentos\", 3ª edição",
    "**IBFAN Brasil** — ibfan.org.br · monitoramento do Código Internacional (NBCAL)",
])

add_refs_card(doc, "Internacionais", [
    "**OMS / UNICEF** — Estratégia Global para Alimentação de Lactentes e Crianças Pequenas",
    "**Academy of Breastfeeding Medicine (ABM)** — Protocolos clínicos #36 Mastitis Spectrum 2022; #32 Hyperlactation; #20 D-MER · bfmed.org",
    "**LactMed (NIH)** — base de dados gratuita sobre medicamentos e amamentação · ncbi.nlm.nih.gov/books/NBK501922",
    "**e-lactancia.org** — base espanhola, código de cores semafórico",
    "**International Breastfeeding Centre (Dr. Jack Newman)** — ibconline.ca · versão em português",
])

add_refs_card(doc, "Brasil — Profissionais e materiais leigos", [
    "**Liga Aleitamento Brasil** — formação IBCLC no Brasil · ligaaleitamentobrasil.com.br",
    "**IBCLC** (International Board Certified Lactation Consultant) — certificação internacional pelo IBLCE",
    "**aleitamento.com.br** — portal técnico de Marcus Renato de Carvalho",
    "**Mães com Ciência** — divulgação científica (Pamela Lockhart, médica)",
    "**Bruna Grazi** — consultora de amamentação · brunagrazi.com",
])

add_refs_card(doc, "Como encontrar ajuda gratuita", [
    "**Banco de Leite** mais próximo: site rBLH ou **Disque Saúde 136**",
    "**UBS / posto de saúde**: apoio inicial gratuito do SUS",
    "**Hospital Amigo da Criança** (IHAC) — programa OMS/UNICEF · unicef.org/brazil",
    "Muitos **bancos de leite municipais** oferecem orientação por WhatsApp",
], bg=MINT_GLAZE)

# ════════════════ BACK COVER ════════════════
page_break(doc)
add_h2(doc, "Amamentar é um aprendizado.", color=FOREST)
add_para(doc, "A grande maioria das dificuldades tem solução clínica simples quando se procura ajuda cedo.",
         font=FONT_DISPLAY, size=18, color=CHARCOAL, italic=True, space_after=24, line_spacing=1.4)
add_para(doc, "Guia da Amamentação · Edição 2026", font=FONT_MONO, size=9, color=MUTED)
add_para(doc, "Conteúdo baseado em evidência · Verifique sempre com profissional de saúde", font=FONT_MONO, size=9, color=MUTED)
add_para(doc, "Design system: Ease Health · calm clinical canvas", font=FONT_MONO, size=9, color=MUTED)

doc.save(OUT)
print(f"Saved: {OUT}")
