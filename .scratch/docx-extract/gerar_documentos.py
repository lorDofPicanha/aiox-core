# -*- coding: utf-8 -*-
"""
Gera dois .docx:
1. analise_problemas_regimento.docx — parecer técnico explicando problemas
2. regimento_revisado.docx — regimento corrigido pronto para assembleia
"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUTPUT_DIR = r"C:\Users\kingp\Downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)


# -------------------------------------------------------------------
# Helpers de formatação
# -------------------------------------------------------------------

def add_page_number(paragraph):
    run = paragraph.add_run()
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = 'PAGE'
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'end')
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)


def set_cell_bg(cell, color_hex):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)
    tc_pr.append(shd)


def style_doc(doc):
    """Aplica estilo base ao documento"""
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)

    # Margens
    section = doc.sections[0]
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

    # Footer com número de página
    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fp.add_run("Página ")
    add_page_number(fp)


def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    return h


def add_para(doc, text, bold=False, italic=False, size=None, align=None):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    if size:
        r.font.size = Pt(size)
    if align:
        p.alignment = align
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(text, style='List Bullet')
    return p


def add_numbered(doc, text):
    p = doc.add_paragraph(text, style='List Number')
    return p


def add_table_with_header(doc, headers, rows, col_widths=None, header_color="1F4E79"):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Light Grid Accent 1'
    table.autofit = True

    # Header
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = ""
        p = hdr_cells[i].paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(10)
        set_cell_bg(hdr_cells[i], header_color)
        hdr_cells[i].vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Rows
    for row_idx, row in enumerate(rows):
        cells = table.rows[row_idx + 1].cells
        for col_idx, val in enumerate(row):
            cells[col_idx].text = ""
            p = cells[col_idx].paragraphs[0]
            r = p.add_run(str(val))
            r.font.size = Pt(9.5)
            # Severidade colorida — match by value
            if str(val) in ("CRÍTICO", "ALTO", "MÉDIO", "BAIXO"):
                colors = {"CRÍTICO": "C00000", "ALTO": "ED7D31", "MÉDIO": "FFC000", "BAIXO": "70AD47"}
                set_cell_bg(cells[col_idx], colors.get(val, "FFFFFF"))
                r.bold = True
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    return table


def add_divider(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("———")
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(0x80, 0x80, 0x80)


def add_capa(doc, titulo, subtitulo, condominio, autor, data):
    """Cria página de capa"""
    for _ in range(3):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(titulo)
    r.bold = True
    r.font.size = Pt(24)
    r.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(subtitulo)
    r.italic = True
    r.font.size = Pt(14)
    r.font.color.rgb = RGBColor(0x40, 0x40, 0x40)

    for _ in range(5):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(condominio)
    r.bold = True
    r.font.size = Pt(13)

    for _ in range(8):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(f"Elaborado por: {autor}")
    r.font.size = Pt(11)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(f"Data: {data}")
    r.font.size = Pt(11)

    doc.add_page_break()


# ===================================================================
# DOCUMENTO 1: ANÁLISE DE PROBLEMAS
# ===================================================================

def gerar_analise_problemas():
    doc = Document()
    style_doc(doc)

    add_capa(
        doc,
        titulo="PARECER TÉCNICO-JURÍDICO",
        subtitulo="Análise de Não-Conformidades e Riscos Legais do Regimento Interno",
        condominio="CONDOMÍNIO RESIDENCIAL ALAMEDA DOS IPÊS",
        autor="Squad Legal AIOS (Legal Chief + societarista + lgpd-specialist + ken-adams)",
        data="19 de maio de 2026"
    )

    # SUMÁRIO EXECUTIVO
    add_heading(doc, "1. Sumário Executivo", level=1)

    p = doc.add_paragraph()
    p.add_run("Objeto: ").bold = True
    p.add_run("Análise integral do Regimento Interno do Condomínio Residencial Alameda dos Ipês, "
              "com identificação de não-conformidades legais, riscos jurídicos e recomendações de correção. "
              "Inclui parecer específico sobre a proposta de gradação de multas por faixa de renda.")

    p = doc.add_paragraph()
    p.add_run("Metodologia: ").bold = True
    p.add_run("Diagnóstico Tier 0 (Legal Chief) → revisão de redação contratual (frameworks globais) → "
              "especialistas brasileiros em direito societário, LGPD e direito do trabalho → "
              "checklists de validação (Contract Risk Matrix + LGPD Compliance Checklist).")

    p = doc.add_paragraph()
    p.add_run("Veredicto: ").bold = True
    r = p.add_run("APROVAÇÃO CONDICIONADA")
    r.bold = True
    r.font.color.rgb = RGBColor(0xC0, 0x00, 0x00)
    p.add_run(" — o regimento tem estrutura formal adequada e redação acima da média de regimentos "
              "amadores, mas contém falhas materiais que comprometem a executoriedade de cláusulas "
              "centrais. Sem revisão, o condomínio expõe-se a: (i) anulação judicial de multas; "
              "(ii) responsabilização perante a ANPD; (iii) ações individuais por discriminação ou "
              "violação de privacidade; (iv) insegurança jurídica em assembleias virtuais.")

    add_heading(doc, "Os 3 Problemas Mais Graves", level=2)

    add_table_with_header(
        doc,
        headers=["#", "Artigo", "Problema em uma linha", "Severidade"],
        rows=[
            ["1", "Art. 49, V e VI",
             "Multa de 10x a cota condominial extrapola o teto legal do CC art. 1.336 §1º (máximo 5x)",
             "CRÍTICO"],
            ["2", "Art. 65 §2º",
             "Dispensa advertência prévia e contraditório — viola CF art. 5º LV e o próprio Art. 50 do regimento",
             "CRÍTICO"],
            ["3", "Anexo II item 1",
             "Base legal 'legítimo interesse' aplicada à biometria — dado sensível exige consentimento específico (LGPD art. 11)",
             "CRÍTICO"],
        ],
    )

    doc.add_page_break()

    # QUADRO COMPLETO DE NÃO-CONFORMIDADES
    add_heading(doc, "2. Quadro Completo de Não-Conformidades", level=1)

    add_para(doc, "A tabela abaixo lista todas as não-conformidades identificadas, com referência "
                  "ao dispositivo legal violado, severidade e correção recomendada.")

    non_conformidades = [
        ["Art. 49, V",
         "Multa de 10x a cota por divulgação CFTV/dados",
         "CC art. 1.336 §1º (teto 5x); art. 1.337 PU exige quórum 3/4",
         "CRÍTICO",
         "Reduzir para 5x OU enquadrar em art. 1.337 PU com quórum 3/4"],

        ["Art. 49, VI",
         "Multa de 10x a cota por vazamento de credenciais de assembleia virtual",
         "CC art. 1.336 §1º; Lei 14.309/2022",
         "CRÍTICO",
         "Mesma correção do inciso V"],

        ["Art. 49, IV",
         "Redação confusa: '100% da cota OU até 3 vezes ou seu valor'",
         "CC art. 1.336 §1º; princípio da legalidade sancionatória",
         "ALTO",
         "Reescrever: 'multa de até 5 (cinco) vezes o valor da cota condominial'"],

        ["Art. 65 §2º",
         "Multa imediata 'independentemente de advertência prévia'",
         "CF art. 5º LV (contraditório); colide com Art. 50 do próprio regimento",
         "CRÍTICO",
         "Manter o rito do Art. 50 (notificação + 10 dias defesa) também para infrações LGPD"],

        ["Anexo II item 1",
         "Base legal 'legítimo interesse' para todos os tratamentos, inclusive biometria",
         "LGPD art. 7º + art. 11 (dado sensível exige hipótese específica)",
         "CRÍTICO",
         "Segregar bases legais por finalidade (ver Seção 5)"],

        ["Anexo II item 4",
         "Lista incompleta de direitos do titular",
         "LGPD art. 18 (9 direitos)",
         "ALTO",
         "Listar os 9 direitos integralmente"],

        ["Capítulo XV",
         "Ausência de Encarregado (DPO) nomeado",
         "LGPD art. 41",
         "ALTO",
         "Nomear Encarregado em assembleia e publicar contato"],

        ["Capítulo XV",
         "Sem prazo de retenção de imagens CFTV",
         "LGPD art. 15 + 16; recomendação ANPD",
         "ALTO",
         "Fixar prazo (30 a 90 dias, salvo investigação ativa)"],

        ["Capítulo XV",
         "Sem procedimento para resposta a incidentes",
         "LGPD art. 48",
         "MÉDIO",
         "Protocolo: comunicar ANPD em até 72h após constatação"],

        ["Capítulo XV",
         "Sem DPA com administradora, portaria, escritório de cobrança",
         "LGPD art. 39 (operador)",
         "ALTO",
         "Exigir DPA com cláusulas mínimas de confidencialidade, finalidade, sigilo"],

        ["Regimento integral",
         "Ausência de menção a acessibilidade (PCD)",
         "Lei 13.146/2015 (Estatuto PCD); CF art. 244",
         "MÉDIO",
         "Incluir capítulo: rampas, vagas PCD, comunicação acessível"],

        ["Art. 36-39",
         "Sem ressalva a animais de assistência",
         "Lei 11.126/2005; Dec. 5.904/2006",
         "MÉDIO",
         "Excepcionar cães-guia e animais de assistência das restrições"],

        ["Regimento integral",
         "Sem regra sobre locação por temporada (Airbnb)",
         "STJ REsp 1.819.075/RS; jurisprudência consolidada 2023",
         "ALTO",
         "Capítulo definindo se permitida, critérios, quórum"],

        ["Proposta original",
         "Gradação de multas por faixa de renda",
         "CF art. 5º (igualdade); LGPD art. 6º III; CC art. 1.336 §1º",
         "CRÍTICO",
         "NÃO IMPLEMENTAR — ver Seção 4 deste parecer"],

        ["Art. 10",
         "Não especifica quóruns de cada deliberação",
         "CC art. 1.352-1.353; Lei 4.591/64",
         "MÉDIO",
         "Tabela explícita de quóruns por matéria"],

        ["Art. 32",
         "Horário 22h-7h pode contrariar lei municipal de silêncio",
         "Lei municipal aplicável (Lei do Silêncio local)",
         "BAIXO",
         "Acrescentar 'observada a legislação municipal aplicável'"],

        ["Art. 49 V (final)",
         "Menciona 'penalizações criminais' — condomínio não aplica sanção criminal",
         "CF art. 5º XXXIX (legalidade penal)",
         "MÉDIO",
         "Reescrever: 'sem prejuízo das responsabilizações cabíveis perante autoridades competentes'"],
    ]

    add_table_with_header(
        doc,
        headers=["Artigo", "Problema", "Lei/Dispositivo violado", "Severidade", "Correção recomendada"],
        rows=non_conformidades,
    )

    doc.add_page_break()

    # PROBLEMAS CRÍTICOS APROFUNDADOS
    add_heading(doc, "3. Análise Aprofundada dos Problemas Críticos", level=1)

    add_heading(doc, "3.1 Art. 49, incisos V e VI — Multa de 10x a cota", level=2)
    add_para(doc, "Os incisos V e VI do Art. 49 estabelecem multa de 10 (dez) vezes o valor da cota "
                  "condominial nas seguintes hipóteses:")
    add_bullet(doc, "Inciso V — divulgar, compartilhar ou vazar imagens do CFTV ou dados pessoais "
                    "em redes sociais, aplicativos de mensagens ou meios não oficiais")
    add_bullet(doc, "Inciso VI — compartilhar links, senhas ou credenciais de acesso às assembleias "
                    "virtuais com terceiros não autorizados")

    p = doc.add_paragraph()
    p.add_run("Problema: ").bold = True
    p.add_run("o Código Civil, em seu art. 1.336, §1º, estabelece como teto da multa por "
              "descumprimento de deveres do condômino o equivalente a ")
    r = p.add_run("até cinco vezes")
    r.bold = True
    p.add_run(" o valor da contribuição mensal. O valor de 10x somente pode ser aplicado no caso "
              "específico do art. 1.337, parágrafo único, que exige: (i) caracterização de conduta "
              "antissocial reiterada, geradora de incompatibilidade de convivência; (ii) deliberação "
              "específica em assembleia com ")
    r = p.add_run("quórum de 3/4 dos condôminos")
    r.bold = True
    p.add_run(". O regimento atual fixa 10x diretamente, sem observar nenhum desses requisitos.")

    p = doc.add_paragraph()
    p.add_run("Risco prático: ").bold = True
    p.add_run("qualquer condômino multado em 10x simplesmente recorre ao Judiciário, e o juiz "
              "reduz a multa ao teto legal (5x) por nulidade parcial. Pior: a frustração da sanção "
              "é pública e gera precedente interno desencorajando aplicações futuras.")

    add_heading(doc, "3.2 Art. 65 §2º — Multa sem advertência prévia", level=2)
    add_para(doc, "O §2º do Art. 65 diz que o descumprimento da norma de proteção de dados "
                  "'sujeitará o infrator à aplicação imediata de multa, independentemente de "
                  "advertência prévia'.")

    p = doc.add_paragraph()
    p.add_run("Problema: ").bold = True
    p.add_run("o Art. 50 do próprio regimento estabelece o rito do contraditório — notificação "
              "com prazo de 10 dias para defesa. Não é possível, no mesmo regimento, criar uma "
              "exceção que dispense esse rito. A regra geral do contraditório e ampla defesa "
              "(CF art. 5º LV) aplica-se inclusive a sanções privadas; ato sancionatório sem "
              "contraditório é nulo, mesmo que a infração esteja claramente provada.")

    p = doc.add_paragraph()
    p.add_run("Correção: ").bold = True
    p.add_run("aplicar o rito do Art. 50 a TODAS as multas, inclusive gravíssimas. Quando "
              "houver risco contínuo (ex.: vazamento em andamento), o síndico pode requerer "
              "medida cautelar judicial, mas a multa só é lançada após contraditório.")

    add_heading(doc, "3.3 Anexo II — Base legal de tratamento de dados", level=2)
    add_para(doc, "O Anexo II declara que o condomínio trata dados com base em 'legítimo "
                  "interesse, execução de contratos e cumprimento de obrigações legais'. Aplicar "
                  "esse rol genérico a TODOS os tratamentos é tecnicamente incorreto.")

    add_para(doc, "Em especial, os dados biométricos (impressão digital, reconhecimento facial) "
                  "são classificados pela LGPD como 'dados pessoais sensíveis' (art. 5º, II). "
                  "Para tratá-los, o condomínio precisa de uma das hipóteses do art. 11 — "
                  "tipicamente, consentimento específico e destacado do titular, OU cumprimento "
                  "de obrigação legal, OU exercício regular de direitos em processo judicial. "
                  "'Legítimo interesse' NÃO está entre as hipóteses do art. 11.")

    p = doc.add_paragraph()
    p.add_run("Risco: ").bold = True
    p.add_run("o tratamento biométrico é considerado irregular. A ANPD pode aplicar sanções, "
              "que vão de advertência até multa de 2% do faturamento (máx R$50 milhões). "
              "Para condomínios pequenos, a sanção é proporcional, mas a advertência pública "
              "gera dano reputacional. Além disso, qualquer morador pode ingressar com ação "
              "individual de dano moral por uso indevido de seu dado sensível.")

    doc.add_page_break()

    # PARECER SOBRE FAIXA DE RENDA
    add_heading(doc, "4. Parecer sobre a Proposta de Multas por Faixa de Renda", level=1)

    p = doc.add_paragraph()
    r = p.add_run("PARECER CONTRÁRIO. ")
    r.bold = True
    r.font.color.rgb = RGBColor(0xC0, 0x00, 0x00)
    p.add_run("Após análise integral, este squad recomenda formalmente NÃO implementar gradação "
              "de multas por faixa de renda do morador. As razões estão organizadas em três "
              "blocos: (4.1) viabilidade jurídica; (4.2) por que não funciona na prática; "
              "(4.3) alternativas legais que atingem o mesmo objetivo.")

    add_heading(doc, "4.1 Viabilidade Jurídica", level=2)

    add_para(doc, "A proposta é juridicamente inviável e a cláusula resultante teria alta "
                  "probabilidade de nulidade, pelos seguintes motivos:")

    p = doc.add_paragraph()
    p.add_run("1. Teto legal absoluto. ").bold = True
    p.add_run("O CC art. 1.336 §1º fixa multa de até 5x a quota condominial para descumprimento "
              "de deveres. O art. 1.337 caput permite até 5x para condômino antissocial; o "
              "parágrafo único permite até 10x apenas em caso de 'reiterado comportamento "
              "antissocial', com quórum de 3/4 dos condôminos. Qualquer gradação por renda que "
              "extrapole esses tetos é nula. Qualquer gradação que pretenda fixar multa 'X vezes "
              "maior para condômino mais rico' dentro do teto continua exposta aos demais vícios "
              "abaixo.")

    p = doc.add_paragraph()
    p.add_run("2. Princípio constitucional da igualdade. ").bold = True
    p.add_run("Sanção condominial é instituto de natureza civil-privada. Gradação por renda "
              "introduz discriminação patrimonial sem fundamento legal, equiparando-se à vedação "
              "do tratamento desigual entre iguais (CF art. 5º caput). Todos são condôminos, "
              "com mesma fração ideal proporcional à unidade. A jurisprudência do STJ rejeita "
              "tratamento diferenciado entre condôminos não fundado em lei ou convenção.")

    p = doc.add_paragraph()
    p.add_run("3. LGPD — violação do princípio da minimização. ").bold = True
    p.add_run("Para aplicar multa proporcional à renda, o condomínio precisaria coletar e "
              "tratar dados de renda de todos os moradores. Renda não é dado necessário à "
              "finalidade condominial (administração, segurança, cobrança da quota). Coletar "
              "declarações de IR, holerites ou autodeclarações de renda configura tratamento "
              "excessivo, sem base legal adequada, e expõe o condomínio a sanção da ANPD "
              "(LGPD art. 6º III e art. 52).")

    p = doc.add_paragraph()
    p.add_run("4. Função social do contrato e boa-fé objetiva. ").bold = True
    p.add_run("Cláusulas que introduzem discriminação econômica em ambiente de convivência "
              "tendem a ser interpretadas como abusivas (CC art. 421 e 422). Por analogia ao "
              "CDC art. 51, IV (cláusulas que estabeleçam obrigações iníquas), o juiz pode "
              "declarar nulidade.")

    p = doc.add_paragraph()
    p.add_run("5. Jurisprudência STJ. ").bold = True
    p.add_run("O Superior Tribunal de Justiça tem reiteradamente reduzido multas excessivas "
              "ou aplicadas sem contraditório (REsp 1.247.020, REsp 1.365.279 e congêneres). "
              "Multa por faixa de renda seria desafiada com altíssima probabilidade de êxito "
              "do condômino.")

    add_heading(doc, "4.2 Por que NÃO funciona na prática", level=2)

    add_numbered(doc, "Privacidade. Forçar declaração de renda gera ação judicial individual de "
                      "cada condômino contrariado — antes mesmo de qualquer multa ser aplicada.")
    add_numbered(doc, "Prova de renda inverificável. O condomínio não tem instrumentos para "
                      "auditar autodeclarações. Condômino de alta renda pode declarar baixa, e o "
                      "condomínio não tem como contestar sem acessar dados fiscais (o que é vedado).")
    add_numbered(doc, "Discriminação reversa. Morador de alta renda argumenta que está pagando "
                      "'imposto privado' sem base legal — fundamento sólido para nulidade.")
    add_numbered(doc, "Custo operacional supera o ganho. Atualizar renda anualmente, segregar "
                      "penalidades, manter base de dados sensível, auditar — custo administrativo "
                      "elevado para sanção que será judicialmente derrubada.")
    add_numbered(doc, "Efeito reverso na convivência. Em vez de coibir condutas, estimula "
                      "litigiosidade. Condôminos passam a discutir renda alheia em assembleia.")
    add_numbered(doc, "Ineficácia dissuasória. Multa proporcional à renda não muda comportamento — "
                      "quem quer barulho às 23h continua querendo. Dissuasão efetiva vem de "
                      "reincidência progressiva, não de valor absoluto.")

    add_heading(doc, "4.3 Alternativas Legais que Atingem o Mesmo Objetivo", level=2)

    add_para(doc, "Existem quatro modelos juridicamente robustos que entregam proporcionalidade "
                  "econômica sem os vícios da gradação por renda:")

    alternativas = [
        ["(A) Multa em % da quota",
         "Multa = X% ou X vezes a quota. A quota já é proporcional à fração ideal (área da unidade), "
         "então é proxy legítimo de capacidade econômica.",
         "Juridicamente blindado pelo CC art. 1.336 §1º; unidade maior paga quota maior.",
         "Não captura totalmente quem é rico em apto pequeno."],

        ["(B) Multa progressiva por reincidência",
         "1ª ocorrência = advertência; 2ª = 1x quota; 3ª = 2x; 4ª+ = 5x; antissocial reiterado = "
         "até 10x com quórum 3/4.",
         "Dissuasão real (custo cresce com persistência); fácil de operacionalizar.",
         "Exige sistema de registro de ocorrências confiável."],

        ["(C) Indexador uniforme",
         "Multa em salário mínimo, UFM municipal, SELIC ou IPCA-IBGE como teto extra-quota.",
         "Atualização automática; sem coleta de renda.",
         "Pode gerar discussão de teto se não bem ancorado no CC."],

        ["(D) Conversão em trabalho voluntário",
         "Para infrações leves, condômino pode optar por horas de serviço voluntário no condomínio "
         "(jardinagem, limpeza pontual) em substituição à multa, mediante adesão expressa.",
         "Pedagógico; fortalece comunidade; não viola CF art. 5º II porque é alternativa.",
         "Operacionalização complexa; exige supervisão."],
    ]

    add_table_with_header(
        doc,
        headers=["Modelo", "Como funciona", "Vantagens", "Limitações"],
        rows=alternativas,
    )

    p = doc.add_paragraph()
    p.add_run("Recomendação do squad: ").bold = True
    p.add_run("combinar modelos ")
    r = p.add_run("(A) + (B)")
    r.bold = True
    p.add_run(" — multa em % da quota condominial com progressão obrigatória por reincidência. "
              "Reservar o art. 1.337 PU (até 10x) somente para conduta antissocial reiterada com "
              "quórum de 3/4. O modelo (D) pode ser oferecido como alternativa opcional para "
              "infrações leves, mediante deliberação assemblear específica. Esta combinação atinge "
              "a proporcionalidade econômica desejada sem coleta de dados sensíveis, sem risco de "
              "nulidade e com dissuasão real.")

    doc.add_page_break()

    # LGPD APROFUNDADO
    add_heading(doc, "5. Riscos LGPD Específicos", level=1)

    add_para(doc, "O Capítulo XV e o Anexo II têm boa intenção mas falhas técnicas que "
                  "comprometem a defensabilidade do tratamento de dados. Esta seção detalha cada "
                  "uma, com referência ao dispositivo da LGPD violado e correção sugerida.")

    add_heading(doc, "5.1 Base legal incorreta no Anexo II", level=2)
    add_para(doc, "O Anexo II declara 'legítimo interesse, execução de contratos e cumprimento "
                  "de obrigação legal' como bases gerais. Isso é tecnicamente errado. A base correta "
                  "deve ser segregada por finalidade:")
    add_bullet(doc, "Cobrança e administração — execução de contrato (LGPD art. 7º V) e "
                    "cumprimento de obrigação legal (art. 7º II — CC art. 1.348 obriga o síndico a cobrar)")
    add_bullet(doc, "CFTV em áreas comuns — legítimo interesse (art. 7º IX) com avaliação de impacto (LIA)")
    add_bullet(doc, "Biometria — consentimento específico do titular (art. 11 I), nunca legítimo interesse")
    add_bullet(doc, "Dados de menores — consentimento específico de pelo menos um dos pais (art. 14 §1º)")

    add_heading(doc, "5.2 Encarregado (DPO) não nomeado", level=2)
    add_para(doc, "LGPD art. 41 obriga a nomeação de Encarregado. Para condomínios, a Resolução "
                  "CD/ANPD 2/2022 permite simplificação (agentes de pequeno porte podem dispensar a "
                  "divulgação ostensiva mas precisam manter canal). Mínimo: nomear em ata, divulgar "
                  "e-mail/contato no quadro de avisos, registrar em ROPA.")

    add_heading(doc, "5.3 Direitos do titular incompletos", level=2)
    add_para(doc, "Anexo II item 4 lista apenas 'acesso, correção e info sobre compartilhamento'. "
                  "LGPD art. 18 garante 9 direitos:")
    for i, d in enumerate([
        "Confirmação da existência de tratamento",
        "Acesso aos dados",
        "Correção de dados incompletos, inexatos ou desatualizados",
        "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade",
        "Portabilidade dos dados",
        "Eliminação dos dados pessoais tratados com base no consentimento",
        "Informação sobre entidades públicas e privadas com as quais o controlador compartilhou dados",
        "Informação sobre a possibilidade de não consentir e suas consequências",
        "Revogação do consentimento",
    ], start=1):
        add_numbered(doc, d)

    add_heading(doc, "5.4 Prazo de retenção CFTV não fixado", level=2)
    add_para(doc, "ANPD recomenda 30 a 90 dias, salvo investigação ativa. Sem prazo, há violação "
                  "do princípio da necessidade (art. 6º III) — armazenar para sempre é desproporcional. "
                  "O regimento deve fixar prazo expresso.")

    add_heading(doc, "5.5 Procedimento de incidente ausente", level=2)
    add_para(doc, "LGPD art. 48 obriga o controlador a comunicar ANPD e titulares em prazo razoável "
                  "(recomendação: 72h após ciência do incidente com risco relevante). O regimento "
                  "não prevê esse procedimento, deixando o condomínio sem protocolo em caso de "
                  "vazamento (ex.: portão hackeado, banco de dados de moradores exposto).")

    add_heading(doc, "5.6 Operadores sem DPA", level=2)
    add_para(doc, "Administradora, portaria terceirizada, escritório de cobrança são 'operadores' "
                  "na linguagem da LGPD (art. 39). Cada um deve ter cláusula contratual de proteção "
                  "de dados (DPA) com obrigações de confidencialidade, finalidade, segurança, prazo "
                  "e devolução/eliminação dos dados ao fim do contrato. Atualmente, o regimento "
                  "menciona os operadores mas não exige DPA.")

    add_heading(doc, "5.7 Risco de sanção ANPD", level=2)
    add_para(doc, "LGPD art. 52 prevê sanções proporcionais: advertência, publicização da infração, "
                  "multa simples (até 2% do faturamento, máx R$50M). Para condomínio (agente de "
                  "pequeno porte), as sanções são proporcionais — mas mesmo a advertência pública "
                  "pode gerar dano reputacional e abrir caminho para ações individuais cíveis de "
                  "moradores prejudicados.")

    doc.add_page_break()

    # LACUNAS ESTRUTURAIS
    add_heading(doc, "6. Lacunas Estruturais (o que falta no regimento)", level=1)

    add_para(doc, "Além das não-conformidades, identificamos 16 temas relevantes que estão "
                  "ausentes do regimento atual e deveriam ser incluídos na revisão:")

    lacunas = [
        ("Acessibilidade e inclusão", [
            "Capítulo de acessibilidade ausente (Lei 13.146/2015 — Estatuto da Pessoa com "
            "Deficiência). Incluir: vagas PCD, rampas, comunicação acessível, adaptações "
            "razoáveis em áreas comuns.",
            "Ressalva expressa a animais de assistência (Lei 11.126/2005, Dec. 5.904/2006) — "
            "não se aplicam restrições gerais do Cap. IX a cães-guia e animais de assistência."
        ]),
        ("Convivência", [
            "Regras para crianças e idosos em áreas comuns (responsabilidade do tutor/cuidador, "
            "horários de uso de playground/salão se houver).",
            "Procedimento de mediação/conciliação prévia antes da multa (recomendação CNJ "
            "Resolução 125/2010) — barateia e desjudicializa."
        ]),
        ("Governança e assembleias", [
            "Periodicidade mínima de assembleia ordinária (sugestão: anual, conforme CC art. 1.350).",
            "Tabela explícita de quóruns por matéria (maioria simples, 2/3, 3/4, unanimidade).",
            "Regras detalhadas para assembleia virtual (Lei 14.309/2022): plataforma, registro, "
            "autenticação, voto, ata digital, validade jurídica.",
            "Sanções aos próprios membros (síndico, conselho) em caso de descumprimento — "
            "vácuo atual: regimento sanciona morador mas não administrador.",
            "Procedimento de denúncia / canal anônimo para infrações graves (especialmente "
            "assédio, discriminação, violência doméstica observada)."
        ]),
        ("Sustentabilidade e operação", [
            "Coleta seletiva de lixo (várias leis municipais já obrigam).",
            "Manutenção predial obrigatória (Lei 4.591/64; NBR 5674).",
            "Locação por temporada (Airbnb) — tema crítico. STJ tem decidido caso a caso; "
            "condomínio deve deliberar expressamente se permite, se exige cadastro/comunicação, "
            "e quais penalidades cabem."
        ]),
        ("LGPD (estrutural)", [
            "Nomeação formal do Encarregado (DPO).",
            "Registro de Operações de Tratamento (ROPA — LGPD art. 37).",
            "Procedimento de resposta a incidentes (LGPD art. 48).",
            "DPA com operadores (administradora, portaria, cobrança)."
        ]),
    ]

    for tema, itens in lacunas:
        add_heading(doc, tema, level=2)
        for item in itens:
            add_bullet(doc, item)

    doc.add_page_break()

    # PRÓXIMOS PASSOS
    add_heading(doc, "7. Próximos Passos Recomendados", level=1)

    proximos = [
        ("Convocar Assembleia Extraordinária de Revisão do Regimento",
         "Quórum: maioria absoluta dos condôminos para alterar regimento (verificar Convenção — "
         "pode exigir 2/3); para alteração das multas dentro do CC art. 1.336 §1º, maioria simples basta; "
         "para acionar o art. 1.337 PU (até 10x), quórum de 3/4."),
        ("Contratar advogado externo OAB",
         "Perfil: direito condominial + LGPD (dupla competência é essencial). Honorários "
         "referenciais: revisão integral R$ 4 mil a R$ 10 mil; parecer específico R$ 1,5 mil a R$ 4 mil."),
        ("Nomear Encarregado (DPO)",
         "Pode ser o síndico, conselheiro ou terceiro (administradora costuma oferecer). Registrar "
         "nomeação em ata e publicar contato no quadro de avisos e em comunicações oficiais."),
        ("Substituir Art. 49 integralmente",
         "Adotar a tabela revisada no documento de Regimento Revisado (entregue em paralelo a "
         "este parecer). NÃO implementar gradação por renda."),
        ("Reformular Anexo II",
         "Segregar bases legais por finalidade, listar os 9 direitos do titular, fixar prazo de "
         "retenção CFTV (30-90 dias) e procedimento de incidente."),
        ("Assinar DPA com operadores",
         "Administradora, portaria terceirizada, escritório de cobrança, escritório de advocacia "
         "— cláusulas mínimas de confidencialidade, finalidade, segurança e devolução de dados."),
        ("Criar ROPA (Registro de Operações de Tratamento)",
         "Planilha simples descrevendo: que dado, de quem, finalidade, base legal, com quem é "
         "compartilhado, prazo de retenção, medidas de segurança. ANPD pode requisitar."),
        ("Deliberar expressamente sobre locação por temporada",
         "Autorizada? Com restrições? Quórum de alteração? Evita litígio futuro com STJ."),
        ("Incluir canal de denúncia",
         "E-mail ou caixa física + protocolo de tratamento de denúncias."),
        ("Calendário",
         "Prazo razoável para todas as adequações: 90 dias a partir da assembleia de revisão."),
    ]

    for i, (titulo, corpo) in enumerate(proximos, start=1):
        p = doc.add_paragraph(style='List Number')
        r = p.add_run(titulo)
        r.bold = True
        p.add_run(". " + corpo)

    # DISCLAIMER
    add_divider(doc)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r = p.add_run("Disclaimer: ")
    r.bold = True
    r.italic = True
    r = p.add_run(
        "Esta análise é orientativa e não substitui consulta com advogado constituído. Antes "
        "da deliberação assemblear, recomenda-se parecer formal de advogado externo OAB com "
        "competência em direito condominial e LGPD. As citações de jurisprudência STJ e "
        "dispositivos legais foram conferidas pelo squad mas devem ser revalidadas pelo "
        "advogado responsável à luz de atualizações legislativas e decisões posteriores a "
        "maio/2026."
    )
    r.italic = True
    r.font.size = Pt(9)

    out = os.path.join(OUTPUT_DIR, "01_analise_problemas_regimento.docx")
    doc.save(out)
    print(f"OK: {out}")


# ===================================================================
# DOCUMENTO 2: REGIMENTO REVISADO
# ===================================================================

def gerar_regimento_revisado():
    doc = Document()
    style_doc(doc)

    add_capa(
        doc,
        titulo="REGIMENTO INTERNO",
        subtitulo="Versão Revisada e Adequada à Legislação Vigente",
        condominio="CONDOMÍNIO RESIDENCIAL ALAMEDA DOS IPÊS",
        autor="Revisão técnica: Squad Legal AIOS",
        data="19 de maio de 2026"
    )

    # NOTA EXPLICATIVA
    add_heading(doc, "Nota Explicativa Sobre Esta Versão Revisada", level=1)
    p = doc.add_paragraph()
    p.add_run("Este documento substitui integralmente o Regimento Interno anterior, corrigindo "
              "as não-conformidades apontadas no Parecer Técnico-Jurídico emitido em 19/05/2026. "
              "As principais alterações são:")
    add_bullet(doc, "Capítulo XII (Penalidades) integralmente reescrito — multas dentro do teto "
                    "do CC art. 1.336 §1º, com progressão por reincidência")
    add_bullet(doc, "Capítulo XV (LGPD) reformulado com bases legais corretas e procedimentos")
    add_bullet(doc, "Anexo II (Aviso de Privacidade) reformulado com os 9 direitos do titular "
                    "e segregação de bases legais")
    add_bullet(doc, "Capítulos novos: Acessibilidade, Mediação Prévia, Locação por Temporada, "
                    "Encarregado de Dados, Quóruns de Assembleia")
    add_bullet(doc, "Harmonização do contraditório (Art. 50 aplica-se a TODAS as multas)")

    p = doc.add_paragraph()
    p.add_run("Este texto deve ser submetido à revisão final de advogado constituído antes da "
              "aprovação em assembleia.").italic = True

    doc.add_page_break()

    # =================== CAPÍTULO I ===================
    add_heading(doc, "CAPÍTULO I — DISPOSIÇÕES GERAIS", level=1)

    doc.add_paragraph("Art. 1. O presente Regimento Interno tem por finalidade disciplinar a "
                      "convivência, o uso das áreas comuns, a administração e a proteção do "
                      "patrimônio do Condomínio Residencial Alameda dos Ipês, assegurando ordem, "
                      "segurança, salubridade, respeito e bem-estar coletivo, em conformidade "
                      "com a legislação vigente.")

    doc.add_paragraph("Art. 2. As disposições deste Regimento obrigam proprietários, possuidores, "
                      "inquilinos, ocupantes, visitantes, prestadores de serviço e quaisquer "
                      "pessoas que ingressem no condomínio.")

    doc.add_paragraph("Art. 3. O presente Regimento será interpretado em conjunto com a Convenção "
                      "do Condomínio, com a ata da assembleia de implantação e com a legislação "
                      "aplicável, especialmente o Código Civil (Lei 10.406/2002), a Lei de "
                      "Condomínios (Lei 4.591/1964), a Lei Geral de Proteção de Dados (Lei "
                      "13.709/2018), o Estatuto da Pessoa com Deficiência (Lei 13.146/2015) e a "
                      "Lei das Assembleias Virtuais (Lei 14.309/2022). Em caso de conflito, "
                      "prevalecerão a lei e a convenção.")

    doc.add_paragraph("Art. 4. Os casos omissos serão resolvidos em assembleia, sem prejuízo de "
                      "deliberações administrativas urgentes do síndico, sujeitas à posterior "
                      "ciência dos condôminos.")

    # =================== CAPÍTULO II ===================
    add_heading(doc, "CAPÍTULO II — DA ADMINISTRAÇÃO, REPRESENTAÇÃO E ASSEMBLEIAS", level=1)

    doc.add_paragraph("Art. 5. O condomínio será administrado por síndico regularmente eleito, "
                      "podendo haver subsíndico e conselho consultivo/fiscal, com composição e "
                      "mandato definidos em assembleia.")

    doc.add_paragraph("Art. 6. Compete ao síndico representar ativa e passivamente o condomínio, "
                      "cumprir e fazer cumprir este Regimento, zelar pelas áreas comuns, arrecadar "
                      "contribuições, efetuar pagamentos autorizados, contratar serviços essenciais, "
                      "prestar contas e convocar assembleias quando necessário.")

    doc.add_paragraph("Art. 7. O subsíndico substituirá o síndico em suas ausências e impedimentos, "
                      "auxiliando-o na administração ordinária.")

    doc.add_paragraph("Art. 8. O conselho consultivo/fiscal terá função de acompanhamento, "
                      "fiscalização e emissão de parecer sobre contas, orçamento e despesas "
                      "extraordinárias, sem prejuízo do poder deliberativo da assembleia.")

    doc.add_paragraph("Art. 9. As assembleias poderão deliberar sobre matérias administrativas, "
                      "financeiras, disciplinares e de convivência, observados os quóruns legais "
                      "e convencionais previstos no Art. 10-A.")

    doc.add_paragraph("Art. 10. Toda deliberação relevante deverá constar em ata clara e detalhada, "
                      "especialmente as referentes à eleição de representantes, fixação de taxa "
                      "condominial, fundo de reserva, contratação de serviços, abertura de conta "
                      "bancária, aplicação de multas e aprovação de regulamentos.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 10-A (NOVO). ")
    r.bold = True
    p.add_run("Os quóruns mínimos para deliberação em assembleia observarão a tabela abaixo, "
              "ressalvado o disposto na Convenção:")

    quoruns = [
        ["Maioria simples dos presentes", "Aprovação de contas; orientações administrativas "
                                          "rotineiras; aplicação de multas dentro do CC art. "
                                          "1.336 §1º (até 5x)"],
        ["Maioria absoluta dos condôminos", "Alteração de Regimento Interno; aprovação de "
                                            "orçamento anual; eleição de síndico"],
        ["2/3 dos condôminos", "Alteração da Convenção; obras úteis; contratação de "
                               "administradora externa"],
        ["3/4 dos condôminos", "Caracterização de comportamento antissocial reiterado e "
                               "aplicação de multa até 10x (CC art. 1.337 PU); decisão sobre "
                               "locação por temporada"],
        ["Unanimidade", "Alteração de matérias de uso exclusivo; modificação da fração ideal"],
    ]
    add_table_with_header(doc, headers=["Quórum exigido", "Matérias típicas"], rows=quoruns)

    p = doc.add_paragraph()
    r = p.add_run("Art. 10-B (NOVO). ")
    r.bold = True
    p.add_run("As assembleias poderão ser realizadas em formato virtual, híbrido ou presencial, "
              "observada a Lei 14.309/2022, com:")
    add_bullet(doc, "Convocação prévia com indicação de data, hora, modalidade, plataforma "
                    "tecnológica utilizada e pauta")
    add_bullet(doc, "Autenticação dos participantes por meio idôneo (login com senha individual, "
                    "vídeo, ou outro mecanismo aprovado)")
    add_bullet(doc, "Registro audiovisual ou ata eletrônica com assinatura digital")
    add_bullet(doc, "Sigilo das credenciais de acesso, sob pena das sanções do Capítulo XII")

    p = doc.add_paragraph()
    r = p.add_run("Art. 10-C (NOVO). ")
    r.bold = True
    p.add_run("É obrigatória a realização de pelo menos uma assembleia ordinária por ano, "
              "preferencialmente no primeiro trimestre, para prestação de contas, aprovação de "
              "orçamento e definição do calendário do exercício seguinte.")

    # =================== CAPÍTULO III ===================
    add_heading(doc, "CAPÍTULO III — DA REGULARIZAÇÃO FORMAL, DOCUMENTAÇÃO E CONTA BANCÁRIA", level=1)
    doc.add_paragraph("Art. 11. A assembleia de implantação deverá autorizar expressamente a "
                      "prática dos atos necessários à regularização do condomínio, inclusive "
                      "registro dos documentos pertinentes, inscrição no CNPJ, obtenção de "
                      "cadastro bancário e fiscal e demais providências administrativas "
                      "indispensáveis ao regular funcionamento do condomínio.")
    doc.add_paragraph("Art. 12. A arrecadação das contribuições condominiais deverá ocorrer, "
                      "preferencialmente, por meio de conta bancária em nome do condomínio, "
                      "vedada a utilização habitual de conta pessoal do síndico, de condômino "
                      "ou de terceiro para movimentação ordinária dos valores arrecadados.")
    doc.add_paragraph("Art. 13. Os documentos essenciais do condomínio deverão permanecer "
                      "organizados e acessíveis à administração e ao conselho, inclusive atas, "
                      "convenção, regimento, contratos, comprovantes de despesas, extratos, "
                      "balancetes, orçamentos, apólices de seguro, cadastro de moradores e "
                      "histórico de ocorrências.")

    # =================== CAPÍTULO IV ===================
    add_heading(doc, "CAPÍTULO IV — DAS CONTRIBUIÇÕES, DESPESAS, ORÇAMENTO E PRESTAÇÃO DE CONTAS", level=1)
    doc.add_paragraph("Art. 14. A taxa condominial inicial e as contribuições futuras serão "
                      "fixadas em assembleia, com base em previsão orçamentária que contemple, no "
                      "mínimo, despesas de energia das áreas comuns, limpeza, manutenção, portão, "
                      "interfone, sistema de segurança, serviços administrativos, tributos, seguro, "
                      "conservação e inadimplência estimada.")
    doc.add_paragraph("Art. 15. Poderá ser instituído fundo de reserva, com percentual definido em "
                      "assembleia, destinado a despesas urgentes, emergenciais, estruturais ou "
                      "extraordinárias, sem prejuízo de posterior prestação de contas.")
    doc.add_paragraph("Art. 16. Despesas extraordinárias não abrangidas pela taxa ordinária "
                      "dependerão de deliberação assemblear, salvo urgência devidamente justificada "
                      "pelo síndico.")
    doc.add_paragraph("Art. 17. O síndico deverá prestar contas periodicamente, mediante "
                      "apresentação de balancete, extratos, comprovantes e relatório resumido de "
                      "receitas e despesas, em periodicidade definida pela assembleia.")
    doc.add_paragraph("Art. 18. É recomendável a contratação de apoio contábil ou administradora, "
                      "ainda que em modelo simplificado, quando necessário à adequada arrecadação, "
                      "escrituração, controle financeiro e cumprimento de obrigações acessórias.")

    # =================== CAPÍTULO V ===================
    add_heading(doc, "CAPÍTULO V — DA INADIMPLÊNCIA E COBRANÇA", level=1)
    doc.add_paragraph("Art. 19. As contribuições condominiais deverão ser pagas até a data de "
                      "vencimento fixada em assembleia.")
    doc.add_paragraph("Art. 20. O atraso no pagamento sujeitará o devedor aos encargos aprovados "
                      "em assembleia ou previstos na convenção, observados os limites legais "
                      "(multa de 2% nos termos do CC art. 1.336 §1º, juros de 1% ao mês e "
                      "atualização monetária), sem prejuízo de cobrança extrajudicial ou judicial.")
    doc.add_paragraph("Art. 21. O proprietário responderá perante o condomínio pelos débitos da "
                      "unidade, ainda que decorrentes de ocupação por inquilino, comodatário, "
                      "visitante ou terceiro.")
    doc.add_paragraph("Art. 22. Eventuais parcelamentos, remissões, descontos ou acordos especiais "
                      "somente poderão ser concedidos de forma isonômica e documentada, evitando-se "
                      "favorecimentos individuais.")

    # =================== CAPÍTULO VI ===================
    add_heading(doc, "CAPÍTULO VI — DO USO DAS ÁREAS COMUNS, DA FACHADA E DA MANUTENÇÃO", level=1)
    doc.add_paragraph("Art. 23. É vedada a utilização das áreas comuns para armazenamento de "
                      "móveis, entulhos, materiais de construção, objetos pessoais ou quaisquer "
                      "itens que prejudiquem a circulação, a limpeza, a estética ou a segurança "
                      "do condomínio.")
    doc.add_paragraph("Art. 24. É proibido estender roupas, tapetes ou objetos em locais visíveis "
                      "da fachada, bem como promover alterações externas não autorizadas que "
                      "comprometam a padronização visual do condomínio.")
    doc.add_paragraph("Art. 25. A limpeza, conservação e manutenção das áreas comuns observarão "
                      "a forma aprovada em assembleia, podendo ocorrer por escala entre os "
                      "condôminos ou por contratação de serviço terceirizado.")
    doc.add_paragraph("Art. 26. Todo morador deverá zelar pela boa conservação das áreas comuns, "
                      "comunicando prontamente à administração qualquer dano, defeito ou risco "
                      "identificado.")

    # =================== CAPÍTULO VII ===================
    add_heading(doc, "CAPÍTULO VII — DO ESTACIONAMENTO E CIRCULAÇÃO DE VEÍCULOS", level=1)
    doc.add_paragraph("Art. 27. O estacionamento interno é de uso privativo dos moradores, "
                      "observada a disponibilidade e a forma de utilização aprovada em assembleia, "
                      "respeitada a reserva mínima de 2% das vagas para pessoas com deficiência, "
                      "nos termos da Lei 10.098/2000 e do art. 47 do Estatuto da PCD.")
    doc.add_paragraph("Art. 28. As vagas serão utilizadas de forma rotativa, salvo deliberação "
                      "diversa da assembleia ou previsão convencional específica.")
    doc.add_paragraph("Art. 29. É vedado estacionar em áreas comuns não destinadas a vaga, "
                      "obstruir circulação, impedir manobras, reservar vagas com cones, objetos "
                      "ou qualquer artifício, bem como permitir uso indevido por visitantes, salvo "
                      "autorização expressa definida em assembleia.")
    doc.add_paragraph("Art. 30. Veículos abandonados, sem condições de uso aparente ou mantidos "
                      "de forma irregular poderão ser objeto de notificação ao responsável para "
                      "regularização ou retirada, na forma definida pela administração.")

    # =================== CAPÍTULO VIII ===================
    add_heading(doc, "CAPÍTULO VIII — DO SOSSEGO, OBRAS, REFORMAS E MUDANÇAS", level=1)
    doc.add_paragraph("Art. 31. É obrigatório o respeito ao sossego e à boa convivência, sendo "
                      "vedada a produção de ruídos excessivos, algazarras, som em volume "
                      "incompatível com o ambiente residencial ou qualquer conduta perturbadora "
                      "do descanso e da tranquilidade alheios.")
    doc.add_paragraph("Art. 32. O horário de silêncio obrigatório compreende, no mínimo, o "
                      "período entre 22h00 e 07h00, observada a legislação municipal aplicável e "
                      "vedados excessos em qualquer horário.")
    doc.add_paragraph("Art. 33. Festas, encontros e comemorações somente serão admitidos desde "
                      "que não causem transtornos ao condomínio, devendo o responsável responder "
                      "por ruídos, sujeira, danos, excesso de pessoas ou infrações às regras internas.")
    doc.add_paragraph("Art. 34. Obras, reparos e reformas com emissão de ruídos, poeira, "
                      "circulação de materiais ou interferência nas áreas comuns somente poderão "
                      "ocorrer em dias úteis e/ou nos horários aprovados em assembleia, "
                      "recomendando-se o intervalo das 08h00 às 17h00, vedadas atividades "
                      "ruidosas em domingos e feriados, salvo urgência.")
    doc.add_paragraph("Art. 35. O morador que realizar obra ou mudança deverá comunicar "
                      "previamente à administração, adotar medidas de proteção das áreas comuns "
                      "e responder integralmente por danos decorrentes do transporte de materiais, "
                      "móveis, equipamentos ou entulhos.")

    # =================== CAPÍTULO IX ===================
    add_heading(doc, "CAPÍTULO IX — DOS ANIMAIS", level=1)
    doc.add_paragraph("Art. 36. É proibido manter animais soltos nas áreas comuns do condomínio.")
    doc.add_paragraph("Art. 37. A circulação de animais nas áreas comuns deverá ocorrer com guia, "
                      "coleira ou meio de contenção adequado, cabendo ao responsável recolher "
                      "imediatamente resíduos e adotar as cautelas necessárias para evitar riscos, "
                      "sujeira, agressões, barulho excessivo ou incômodo aos demais.")
    doc.add_paragraph("Art. 38. O tutor do animal responderá integralmente por danos materiais, "
                      "lesões, sujeira ou transtornos causados pelo animal a pessoas, áreas comuns, "
                      "veículos ou unidades vizinhas.")
    doc.add_paragraph("Art. 39. Havendo ocorrências reiteradas e comprovadas relacionadas a "
                      "perturbação, risco, sujeira ou descumprimento das regras de guarda "
                      "responsável, a assembleia poderá deliberar medidas restritivas proporcionais, "
                      "observados o contraditório e a razoabilidade.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 39-A (NOVO). ")
    r.bold = True
    p.add_run("As restrições deste capítulo NÃO se aplicam a cães-guia, cães de assistência ou "
              "animais de suporte emocional/terapêutico devidamente comprovados, garantido o "
              "direito de acesso e circulação em todas as áreas comuns nos termos da Lei "
              "11.126/2005 e do Decreto 5.904/2006. O tutor de animal de assistência permanece "
              "responsável por sua condução adequada e por eventuais danos.")

    # =================== CAPÍTULO X ===================
    add_heading(doc, "CAPÍTULO X — DA SEGURANÇA, ACESSO E CONTROLE", level=1)
    doc.add_paragraph("Art. 40. Portões, acessos e dispositivos de segurança deverão permanecer "
                      "fechados e em pleno funcionamento, cabendo a todos os moradores colaborar "
                      "para sua preservação.")
    doc.add_paragraph("Art. 41. É vedado permitir o ingresso de pessoas desconhecidas sem "
                      "identificação mínima ou sem autorização do morador responsável.")
    doc.add_paragraph("Art. 42. O condomínio poderá instituir cadastro de moradores, veículos, "
                      "empregados particulares, prestadores de serviço e visitantes frequentes, "
                      "com a finalidade exclusiva de organização e segurança, observada a LGPD "
                      "(Capítulo XV).")
    doc.add_paragraph("Art. 43. A assembleia poderá deliberar sobre a instalação de câmeras, "
                      "interfone, controle remoto de portão, fechaduras, iluminação, cerca "
                      "elétrica e outros meios de proteção, definindo regras mínimas de uso, "
                      "manutenção, prazo de retenção e acesso às imagens ou registros, observado "
                      "o disposto no Capítulo XV.")
    doc.add_paragraph("Art. 44. É vedado danificar, desativar, adulterar ou utilizar indevidamente "
                      "equipamentos de segurança, sujeitando-se o responsável ao ressarcimento "
                      "integral e às penalidades cabíveis.")

    # =================== CAPÍTULO XI ===================
    add_heading(doc, "CAPÍTULO XI — DA RESPONSABILIDADE POR DANOS", level=1)
    doc.add_paragraph("Art. 45. Qualquer dano causado ao patrimônio comum ou a terceiros no "
                      "interior do condomínio deverá ser integralmente reparado pelo morador "
                      "responsável, sem prejuízo da multa regimental e das medidas judiciais "
                      "cabíveis.")
    doc.add_paragraph("Art. 46. O proprietário responde solidariamente pelos atos e omissões de "
                      "seus familiares, dependentes, visitantes, inquilinos, empregados, "
                      "prestadores de serviço e animais.")
    doc.add_paragraph("Art. 47. A constatação de dano poderá ser formalizada por escrito, "
                      "imagens, vídeos, testemunhos ou outros meios idôneos, devendo a "
                      "administração registrar a ocorrência e notificar o responsável.")

    # =================== CAPÍTULO XII REVISADO ===================
    add_heading(doc, "CAPÍTULO XII — DAS PENALIDADES, DA MEDIAÇÃO, DO DIREITO DE DEFESA E DA REINCIDÊNCIA", level=1)

    p = doc.add_paragraph()
    p.add_run("(Capítulo integralmente revisado em conformidade com o CC art. 1.336 §1º e art. "
              "1.337 — multas dentro do teto legal, com progressão por reincidência.)").italic = True

    doc.add_paragraph("Art. 48. O descumprimento deste Regimento poderá acarretar advertência "
                      "escrita ou multa, conforme a natureza da infração, a reincidência, o "
                      "risco gerado e o prejuízo causado, observados os limites legais e o "
                      "contraditório previsto no Art. 50.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 48-A (NOVO). ")
    r.bold = True
    p.add_run("Antes da imposição de qualquer multa, sempre que viável e proporcional à "
              "gravidade da conduta, o síndico promoverá tentativa de mediação ou conciliação "
              "entre as partes envolvidas, registrando o resultado em ata. A mediação não "
              "suspende prazos legais e não é obrigatória nas infrações classificadas como "
              "graves ou gravíssimas.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 49 (INTEGRALMENTE REESCRITO). ")
    r.bold = True
    p.add_run("As infrações serão classificadas em quatro categorias, com penalidades progressivas "
              "por reincidência, conforme tabela a seguir. As multas têm como base o valor da cota "
              "condominial vigente e observam o teto do CC art. 1.336 §1º (até 5 vezes a cota):")

    penalidades = [
        ["Leve",
         "Ruído fora de hora isolado; descarte irregular de lixo; uso indevido eventual de área comum; estender roupa em fachada",
         "Advertência escrita",
         "0,5x quota",
         "1x quota"],
        ["Média",
         "Obstrução de vaga; animal solto em área comum; descumprimento de orientação administrativa; obras fora de horário",
         "0,5x quota",
         "1x quota",
         "2x quota"],
        ["Grave",
         "Dano ao patrimônio comum; agressão verbal; sabotagem de equipamento de segurança; reincidência reiterada em infração média",
         "2x quota",
         "3x quota",
         "5x quota + ressarcimento integral"],
        ["Gravíssima — dados pessoais e CFTV",
         "Divulgação, compartilhamento ou vazamento de imagens CFTV ou dados pessoais em meios não oficiais",
         "3x quota",
         "5x quota",
         "5x quota + comunicação à ANPD + ações cíveis cabíveis"],
        ["Gravíssima — assembleia virtual",
         "Compartilhar links, senhas ou credenciais de acesso a assembleia virtual com terceiros não autorizados",
         "3x quota",
         "5x quota",
         "5x quota"],
    ]
    add_table_with_header(
        doc,
        headers=["Categoria", "Infrações típicas", "1ª ocorrência", "2ª ocorrência (reincidência em 12 meses)", "3ª ocorrência ou maior gravidade"],
        rows=penalidades,
    )

    p = doc.add_paragraph()
    p.add_run("§ 1º. ").bold = True
    p.add_run("Considera-se reincidência a prática de nova infração da mesma natureza no prazo "
              "de 12 (doze) meses contados da última notificação válida.")

    p = doc.add_paragraph()
    p.add_run("§ 2º. ").bold = True
    p.add_run("Conduta antissocial reiterada que gere incompatibilidade de convivência poderá "
              "ensejar, mediante deliberação específica da assembleia com quórum de 3/4 dos "
              "condôminos, a aplicação de multa de até 10 (dez) vezes a cota condominial, nos "
              "termos do CC art. 1.337, parágrafo único.")

    p = doc.add_paragraph()
    p.add_run("§ 3º. ").bold = True
    p.add_run("O ressarcimento integral de danos é sempre cumulativo com a multa, jamais "
              "substitutivo.")

    p = doc.add_paragraph()
    p.add_run("§ 4º. ").bold = True
    p.add_run("Para infrações classificadas como leve ou média, o morador poderá optar, mediante "
              "manifestação expressa, pela conversão da multa em horas de serviço voluntário no "
              "condomínio (jardinagem, limpeza de área comum, organização documental), na "
              "proporção e nas condições deliberadas em assembleia. A opção é facultativa e não "
              "implica vínculo trabalhista.")

    doc.add_paragraph("Art. 50. Antes da aplicação de qualquer multa, o morador deverá ser "
                      "notificado, com descrição resumida dos fatos e prazo de 10 (dez) dias "
                      "corridos para apresentação de defesa por escrito ao síndico ou ao órgão "
                      "indicado em assembleia. A notificação poderá ser feita por carta, e-mail "
                      "ou aplicativo oficial do condomínio, com comprovação de recebimento.")

    doc.add_paragraph("Art. 51. Apresentada a defesa, o síndico analisará e decidirá em até "
                      "15 (quinze) dias úteis. Persistindo a infração, caracterizada a reincidência "
                      "ou rejeitada a defesa, a penalidade poderá ser aplicada e lançada em "
                      "cobrança própria, assegurada ao interessado a possibilidade de levar a "
                      "matéria à assembleia para revisão.")

    doc.add_paragraph("Art. 52. A aplicação das penalidades não afasta a obrigação de cessar a "
                      "irregularidade, reparar danos e cumprir imediatamente as normas internas.")

    # =================== CAPÍTULO XIII ===================
    add_heading(doc, "CAPÍTULO XIII — DO SEGURO E DAS PROVIDÊNCIAS ESSENCIAIS DE IMPLANTAÇÃO", level=1)
    doc.add_paragraph("Art. 53. Deverá ser providenciada, com prioridade, a contratação de seguro "
                      "da edificação e das áreas comuns, nos termos da legislação aplicável, além "
                      "de outras coberturas que a assembleia entender pertinentes.")
    doc.add_paragraph("Art. 54. Na implantação do condomínio, deverão ser levantados e formalmente "
                      "recebidos os manuais, garantias, controles, chaves, documentos técnicos, "
                      "contratos existentes, medidores, equipamentos e demais itens entregues "
                      "pela incorporadora ou construtora.")
    doc.add_paragraph("Art. 55. A assembleia de implantação deverá, sempre que possível, "
                      "deliberar também sobre: valor da taxa inicial, fundo de reserva, data de "
                      "vencimento, rotina de prestação de contas, abertura de conta bancária, "
                      "contratação de contador ou administradora, instalação de câmeras, "
                      "contratação de seguro, calendário de assembleias e nomeação do Encarregado "
                      "de Dados.")

    # =================== CAPÍTULO XIV ===================
    add_heading(doc, "CAPÍTULO XIV — DA ACESSIBILIDADE (NOVO)", level=1)

    p = doc.add_paragraph()
    r = p.add_run("Art. 55-A. ")
    r.bold = True
    p.add_run("O condomínio adotará providências para garantir a acessibilidade das áreas comuns "
              "a pessoas com deficiência ou mobilidade reduzida, observados a Lei 13.146/2015 "
              "(Estatuto da Pessoa com Deficiência), a Lei 10.098/2000 e a NBR 9050.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 55-B. ")
    r.bold = True
    p.add_run("Será reservado o mínimo de 2% (dois por cento) das vagas de estacionamento, com "
              "o mínimo de uma vaga, à utilização por pessoas com deficiência, devidamente "
              "sinalizadas e identificadas.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 55-C. ")
    r.bold = True
    p.add_run("Modificações em unidades autônomas que tenham por objetivo a adaptação de "
              "acessibilidade pelo morador com deficiência ou mobilidade reduzida não dependem "
              "de autorização da assembleia, desde que não comprometam a estrutura ou a estética "
              "geral da edificação, observado o art. 1.336 do Código Civil.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 55-D. ")
    r.bold = True
    p.add_run("As comunicações oficiais do condomínio (convocações, avisos, multas) serão "
              "prestadas em formato acessível sempre que solicitado pelo morador, incluindo, "
              "mas não limitado a: caracteres ampliados, leitor de tela, áudio, libras, "
              "conforme a necessidade do destinatário.")

    # =================== CAPÍTULO XV REVISADO ===================
    add_heading(doc, "CAPÍTULO XV — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD)", level=1)

    p = doc.add_paragraph()
    p.add_run("(Capítulo reformulado conforme LGPD — Lei 13.709/2018 — com segregação de bases "
              "legais, nomeação de Encarregado, prazos de retenção, procedimento de incidente e "
              "direitos integrais do titular.)").italic = True

    doc.add_paragraph("Art. 56. O tratamento de dados pessoais no âmbito do condomínio "
                      "observará a Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018), "
                      "sendo realizado exclusivamente para finalidades legítimas relacionadas à "
                      "administração, segurança, convivência, exercício regular de direitos e "
                      "cumprimento de obrigações legais.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 57. ")
    r.bold = True
    p.add_run("O condomínio figura como Controlador de Dados (LGPD art. 5º, VI). O síndico, na "
              "qualidade de representante legal, responde pelas operações de tratamento, "
              "respeitada a função do Encarregado nomeado.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 58. ")
    r.bold = True
    p.add_run("As bases legais aplicáveis ao tratamento de dados, segregadas por finalidade, são:")

    bases_legais = [
        ["Administração e cobrança", "Nome, CPF, contato, dados financeiros, débitos",
         "Execução de contrato (art. 7º V) + obrigação legal (art. 7º II + CC art. 1.348)"],
        ["Comunicação oficial", "E-mail, telefone, endereço",
         "Execução de contrato (art. 7º V)"],
        ["Controle de acesso", "Nome, RG/CPF, dados de veículos (placa/modelo), visitantes",
         "Legítimo interesse para segurança patrimonial (art. 7º IX)"],
        ["CFTV em áreas comuns", "Imagens de circuito interno de TV",
         "Legítimo interesse para segurança patrimonial (art. 7º IX) com LIA documentada"],
        ["Biometria (se houver)", "Impressão digital, reconhecimento facial",
         "Consentimento específico e destacado do titular (art. 11 I), com possibilidade de revogação"],
        ["Dados de menores", "Nome, idade, foto, biometria de crianças e adolescentes",
         "Consentimento específico de pelo menos um dos pais (art. 14 §1º)"],
    ]
    add_table_with_header(
        doc,
        headers=["Finalidade", "Dados tratados", "Base legal LGPD"],
        rows=bases_legais,
    )

    p = doc.add_paragraph()
    r = p.add_run("Art. 59. ")
    r.bold = True
    p.add_run("O tratamento será limitado ao mínimo necessário (princípio da minimização — art. "
              "6º III). É terminantemente vedado o uso de dados para fins discriminatórios, "
              "abusivos, comerciais ou ilícitos.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 60. ")
    r.bold = True
    p.add_run("Os prazos de retenção dos dados são:")
    add_bullet(doc, "Dados cadastrais — durante a vigência da condição de morador/proprietário "
                    "e por até 5 anos após o desligamento (prescrição financeira)")
    add_bullet(doc, "Imagens de CFTV — 30 a 90 dias, salvo investigação policial ou judicial em "
                    "andamento ou ocorrência registrada não resolvida")
    add_bullet(doc, "Dados biométricos — durante a vigência da autorização do titular; em caso "
                    "de revogação, eliminados em até 30 dias")
    add_bullet(doc, "Ata e documentos financeiros — conforme prazos legais aplicáveis (geralmente "
                    "5 anos para documentação fiscal/contábil)")

    p = doc.add_paragraph()
    r = p.add_run("Art. 61. ")
    r.bold = True
    p.add_run("O acesso aos dados será restrito ao síndico, conselho fiscal/consultivo (no "
              "exercício de suas funções), Encarregado de Dados, e a prestadores de serviço "
              "contratados (administradoras, portaria, escritórios de advocacia/cobrança), que "
              "figuram como Operadores (LGPD art. 39) e devem firmar instrumento contratual "
              "específico de proteção de dados (DPA) com cláusulas mínimas de confidencialidade, "
              "finalidade, segurança e devolução de dados ao fim do contrato.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 62. ")
    r.bold = True
    p.add_run("Os titulares dos dados poderão exercer, a qualquer tempo, junto à administração ou "
              "ao Encarregado, os seguintes direitos previstos no art. 18 da LGPD:")
    for i, d in enumerate([
        "Confirmação da existência de tratamento",
        "Acesso aos dados tratados",
        "Correção de dados incompletos, inexatos ou desatualizados",
        "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade",
        "Portabilidade dos dados",
        "Eliminação dos dados tratados com base no consentimento",
        "Informação sobre entidades públicas e privadas com as quais os dados foram compartilhados",
        "Informação sobre a possibilidade de não fornecer o consentimento e suas consequências",
        "Revogação do consentimento",
    ], start=1):
        add_numbered(doc, d)

    p = doc.add_paragraph()
    r = p.add_run("Art. 63. ")
    r.bold = True
    p.add_run("As imagens de CFTV serão utilizadas exclusivamente para fins de segurança "
              "patrimonial e pessoal, podendo ser disponibilizadas a autoridades policiais e "
              "judiciais quando solicitadas, ou aos envolvidos em sinistros internos mediante "
              "requerimento formal e deliberação fundamentada da administração, preservando a "
              "intimidade de terceiros.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 64 (REVISADO). ")
    r.bold = True
    p.add_run("É vedado aos condôminos, moradores, visitantes e funcionários capturar, "
              "compartilhar, divulgar ou vazar imagens do sistema de CFTV, bem como dados "
              "pessoais de outros condôminos ou colaboradores, em redes sociais, aplicativos de "
              "mensagens ou qualquer meio de comunicação não oficial. A proibição abrange a "
              "reprodução de telas, fotografias de monitores da portaria e o compartilhamento "
              "de áudios ou vídeos de assembleias sem autorização. O descumprimento sujeita o "
              "infrator às penalidades do Art. 49, observado o rito do Art. 50 (notificação "
              "e contraditório), sem prejuízo da responsabilização civil cabível.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 65 (NOVO). ")
    r.bold = True
    p.add_run("O condomínio nomeará formalmente um Encarregado pelo Tratamento de Dados (DPO), "
              "que poderá ser o síndico, conselheiro ou terceiro contratado. O nome e contato "
              "do Encarregado serão divulgados em quadro de avisos, comunicações oficiais e, "
              "quando aplicável, no site ou aplicativo do condomínio, observada a Resolução "
              "CD/ANPD 2/2022.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 66 (NOVO). ")
    r.bold = True
    p.add_run("Em caso de incidente de segurança envolvendo dados pessoais com risco ou dano "
              "relevante aos titulares, o Encarregado e o síndico providenciarão, no prazo de "
              "até 72 (setenta e duas) horas a contar da ciência do incidente, a comunicação à "
              "Autoridade Nacional de Proteção de Dados (ANPD) e aos titulares afetados, nos "
              "termos do art. 48 da LGPD.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 67 (NOVO). ")
    r.bold = True
    p.add_run("O condomínio manterá Registro de Operações de Tratamento (ROPA — LGPD art. 37), "
              "atualizado periodicamente pelo Encarregado, contendo no mínimo: finalidade, "
              "categorias de dados tratados, categorias de titulares, base legal, prazo de "
              "retenção, operadores envolvidos e medidas de segurança adotadas. O ROPA será "
              "apresentado à ANPD sempre que requerido.")

    # =================== CAPÍTULO XVI (NOVO) ===================
    add_heading(doc, "CAPÍTULO XVI — DA LOCAÇÃO POR TEMPORADA (NOVO)", level=1)

    p = doc.add_paragraph()
    r = p.add_run("Art. 68. ")
    r.bold = True
    p.add_run("A locação por temporada das unidades autônomas, inclusive por intermédio de "
              "plataformas digitais (Airbnb, Booking, congêneres), [PERMITIDA / VEDADA / "
              "PERMITIDA COM RESTRIÇÕES — a critério da assembleia, com quórum de 3/4].")

    p = doc.add_paragraph()
    p.add_run("Nota de redação: ").italic = True
    p.add_run("a redação acima deve ser preenchida em assembleia, conforme deliberação dos "
              "condôminos. O STJ tem reconhecido a competência do condomínio para regulamentar a "
              "matéria, exigindo deliberação expressa em convenção ou regimento. Sem decisão "
              "expressa, há insegurança jurídica.").italic = True

    p = doc.add_paragraph()
    r = p.add_run("Art. 69. ")
    r.bold = True
    p.add_run("Caso permitida ou permitida com restrições, o morador-locador deverá:")
    add_bullet(doc, "Comunicar previamente a administração sobre cada locação, com nome do "
                    "hóspede, prazo de permanência e contato")
    add_bullet(doc, "Cadastrar o hóspede no controle de acesso")
    add_bullet(doc, "Responder integralmente pelas condutas dos hóspedes em todas as áreas "
                    "comuns, inclusive multas e ressarcimentos")
    add_bullet(doc, "Comunicar aos hóspedes as regras de convivência e o Regimento Interno")

    # =================== CAPÍTULO XVII (NOVO) ===================
    add_heading(doc, "CAPÍTULO XVII — DO CANAL DE DENÚNCIAS (NOVO)", level=1)

    p = doc.add_paragraph()
    r = p.add_run("Art. 70. ")
    r.bold = True
    p.add_run("O condomínio manterá canal de denúncias por meio de e-mail específico, caixa "
              "física na portaria ou aplicativo oficial, para recebimento de comunicações sobre "
              "infrações ao Regimento, casos de assédio, discriminação, violência observada ou "
              "violações à LGPD.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 71. ")
    r.bold = True
    p.add_run("As denúncias serão tratadas com sigilo pelo síndico e Encarregado, garantida a "
              "proteção do denunciante contra retaliação. Denúncias anônimas serão consideradas "
              "para investigação inicial, mas penalidades só poderão ser aplicadas mediante "
              "instrução com contraditório, nos termos do Art. 50.")

    # =================== CAPÍTULO XVIII (DISPOSIÇÕES FINAIS) ===================
    add_heading(doc, "CAPÍTULO XVIII — DISPOSIÇÕES FINAIS", level=1)

    doc.add_paragraph("Art. 72. Este Regimento entra em vigor na data de sua aprovação em "
                      "assembleia, podendo ser alterado posteriormente pelos condôminos na "
                      "forma da convenção e da legislação aplicável.")

    doc.add_paragraph("Art. 73. Ficam revogadas as disposições internas anteriores em contrário, "
                      "especialmente a versão anterior do Regimento Interno e respectivos "
                      "anexos, ressalvados os atos já praticados em sua vigência.")

    p = doc.add_paragraph()
    r = p.add_run("Art. 74 (NOVO). ")
    r.bold = True
    p.add_run("Sanções por descumprimento deste Regimento aplicam-se também aos membros da "
              "administração (síndico, subsíndico, conselheiros) quando praticarem ou omitirem "
              "atos em violação às suas obrigações, assegurado o contraditório e a possibilidade "
              "de destituição em assembleia, nos termos do CC art. 1.349.")

    doc.add_page_break()

    # ===================== ANEXO II REVISADO =====================
    add_heading(doc, "ANEXO II — AVISO DE PRIVACIDADE E TERMO DE CIÊNCIA (LGPD)", level=1)
    p = doc.add_paragraph()
    p.add_run("CONDOMÍNIO RESIDENCIAL ALAMEDA DOS IPÊS").bold = True

    add_heading(doc, "1. Identificação do Controlador", level=2)
    doc.add_paragraph("O CONDOMÍNIO RESIDENCIAL ALAMEDA DOS IPÊS, inscrito no CNPJ "
                      "[a preencher], com sede em [endereço], representado por seu Síndico, é o "
                      "Controlador dos dados pessoais coletados, nos termos do art. 5º, VI, da LGPD.")

    add_heading(doc, "2. Encarregado pelo Tratamento de Dados (DPO)", level=2)
    doc.add_paragraph("Nome: [nome do encarregado]")
    doc.add_paragraph("Contato: [e-mail] | [telefone]")
    doc.add_paragraph("O Encarregado é o canal direto para esclarecimentos, exercício de direitos "
                      "e recebimento de comunicações dos titulares de dados.")

    add_heading(doc, "3. Finalidades e Bases Legais do Tratamento", level=2)
    bases_anexo = [
        ["Administração e cobrança das contribuições condominiais",
         "Execução de contrato (LGPD art. 7º V) e cumprimento de obrigação legal (art. 7º II)"],
        ["Comunicação oficial (convocações, avisos, multas)",
         "Execução de contrato (LGPD art. 7º V)"],
        ["Controle de acesso de moradores, visitantes e prestadores",
         "Legítimo interesse para segurança patrimonial (LGPD art. 7º IX)"],
        ["Monitoramento por CFTV em áreas comuns",
         "Legítimo interesse para segurança patrimonial (LGPD art. 7º IX) com Avaliação de Impacto (LIA)"],
        ["Coleta e uso de biometria (impressão digital, reconhecimento facial)",
         "Consentimento específico e destacado do titular (LGPD art. 11, I)"],
        ["Tratamento de dados de menores",
         "Consentimento específico de pelo menos um dos pais ou responsável legal (LGPD art. 14, §1º)"],
    ]
    add_table_with_header(
        doc,
        headers=["Finalidade", "Base legal LGPD"],
        rows=bases_anexo,
    )

    add_heading(doc, "4. Dados Tratados", level=2)
    add_bullet(doc, "Dados cadastrais: nome, RG, CPF, contatos telefônicos e eletrônicos, "
                    "unidade vinculada, condição (proprietário, inquilino, morador)")
    add_bullet(doc, "Dados de veículos: modelo e placa")
    add_bullet(doc, "Dados biométricos (quando houver autorização): impressão digital, "
                    "reconhecimento facial")
    add_bullet(doc, "Imagens captadas pelo sistema de CFTV")
    add_bullet(doc, "Dados financeiros decorrentes da relação condominial")

    add_heading(doc, "5. Compartilhamento de Dados", level=2)
    doc.add_paragraph("Os dados poderão ser compartilhados com os seguintes Operadores e "
                      "terceiros, todos sujeitos a Acordo de Tratamento de Dados (DPA):")
    add_bullet(doc, "Administradora condominial contratada")
    add_bullet(doc, "Empresa de portaria terceirizada (quando aplicável)")
    add_bullet(doc, "Escritórios de cobrança e/ou advocacia em caso de inadimplência")
    add_bullet(doc, "Instituições bancárias para emissão e cobrança de boletos")
    add_bullet(doc, "Autoridades públicas (policial, judicial) mediante requisição legítima")

    add_heading(doc, "6. Prazos de Retenção", level=2)
    retencao = [
        ["Dados cadastrais", "Durante a relação condominial + 5 anos após desligamento"],
        ["Imagens de CFTV", "30 a 90 dias, salvo investigação em andamento"],
        ["Dados biométricos", "Durante a autorização do titular; eliminação em 30 dias após revogação"],
        ["Ata e documentos financeiros", "Conforme prazos legais aplicáveis (geralmente 5 anos)"],
    ]
    add_table_with_header(doc, headers=["Tipo de dado", "Prazo de retenção"], rows=retencao)

    add_heading(doc, "7. Direitos do Titular", level=2)
    doc.add_paragraph("Nos termos do art. 18 da LGPD, o titular dos dados poderá, a qualquer "
                      "tempo, exercer junto ao Encarregado os seguintes direitos:")
    for i, d in enumerate([
        "Confirmar a existência de tratamento de seus dados",
        "Acessar os dados tratados",
        "Corrigir dados incompletos, inexatos ou desatualizados",
        "Anonimizar, bloquear ou eliminar dados desnecessários, excessivos ou tratados em desconformidade",
        "Solicitar a portabilidade dos dados",
        "Solicitar a eliminação dos dados tratados com base no consentimento",
        "Obter informação sobre entidades com as quais o condomínio compartilhou seus dados",
        "Obter informação sobre a possibilidade de não fornecer o consentimento e as consequências",
        "Revogar o consentimento, a qualquer tempo, por manifestação expressa",
    ], start=1):
        add_numbered(doc, d)

    add_heading(doc, "8. Procedimento em Caso de Incidente", level=2)
    doc.add_paragraph("Em caso de incidente de segurança envolvendo dados pessoais com risco ou "
                      "dano relevante aos titulares, o Encarregado e o síndico providenciarão, "
                      "no prazo de até 72 (setenta e duas) horas a contar da ciência do "
                      "incidente, a comunicação à ANPD e aos titulares afetados, nos termos do "
                      "art. 48 da LGPD.")

    add_heading(doc, "9. Segurança dos Dados", level=2)
    doc.add_paragraph("O condomínio adotará medidas técnicas e administrativas razoáveis para "
                      "proteger os dados pessoais contra acessos não autorizados, perda, "
                      "destruição ou alteração indevida, observados os padrões aplicáveis a "
                      "agentes de pequeno porte (Resolução CD/ANPD 2/2022).")

    add_heading(doc, "10. Termo de Ciência", level=2)
    doc.add_paragraph("Declaro ter recebido, lido e compreendido o presente Aviso de Privacidade, "
                      "estando ciente das finalidades, bases legais, dados tratados, prazos de "
                      "retenção e direitos que me assistem.")
    doc.add_paragraph()
    doc.add_paragraph("Nome: _______________________________________________")
    doc.add_paragraph("Unidade: _____________________________________________")
    doc.add_paragraph("Data: ____/____/______")
    doc.add_paragraph("Assinatura: __________________________________________")

    doc.add_page_break()

    # TERMO DE APROVAÇÃO
    add_heading(doc, "TERMO DE APROVAÇÃO", level=1)
    doc.add_paragraph("Aprovado em assembleia realizada em ____/____/______, com o quórum exigido "
                      "para alteração do Regimento Interno, conforme ata específica.")
    doc.add_paragraph()
    doc.add_paragraph()
    doc.add_paragraph("__________________________________")
    doc.add_paragraph("Síndico(a)")
    doc.add_paragraph()
    doc.add_paragraph("__________________________________")
    doc.add_paragraph("Subsíndico(a)")
    doc.add_paragraph()
    doc.add_paragraph()
    add_heading(doc, "ASSINATURA DOS CONDÔMINOS", level=2)
    for unidade in ["Apto 101", "Apto 102", "Apto 103", "Apto 104", "Apto 105", "Apto 106",
                    "Apto 107", "Apto 201", "Apto 202", "Apto 203", "Apto 204", "Apto 205",
                    "Apto 206", "Apto 207"]:
        doc.add_paragraph(f"{unidade}: _______________________________________________")

    out = os.path.join(OUTPUT_DIR, "02_regimento_revisado.docx")
    doc.save(out)
    print(f"OK: {out}")


# ===================================================================
# RUN
# ===================================================================

if __name__ == "__main__":
    gerar_analise_problemas()
    gerar_regimento_revisado()
    print("Documentos gerados em:", OUTPUT_DIR)
