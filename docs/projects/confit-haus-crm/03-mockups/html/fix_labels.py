#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aplica PT-BR + botão consistente nos HTML das telas (camada de edição do Stitch)."""
import pathlib

HERE = pathlib.Path(__file__).parent

# substituições comuns (tag-delimitadas, seguras)
COMMON = [
    (">Inbox<", ">Caixa de Entrada<"),
    (">Pipeline<", ">Funil<"),
    (">Contacts<", ">Contatos<"),
    (">Analytics<", ">Análise<"),
    (">Settings<", ">Configurações<"),
    (">Help<", ">Ajuda<"),
    (">Sign Out<", ">Sair<"),
    (">Logout<", ">Sair<"),
    (">Export<", ">Exportar<"),
    (">Filters<", ">Filtros<"),
    ("CRM Management", "CRM & Relacionamento"),
    ("CRM Dashboard", "CRM & Relacionamento"),
    ("Artisanal CRM", "CRM & Relacionamento"),
    ('placeholder="Search..."', 'placeholder="Buscar..."'),
]

# botão principal — variações para "+ Novo lead"
BUTTONS = [">New Lead<", ">New Entry<", ">New Deal<", ">Add Lead<",
           ">+ New Lead<", ">+ New Deal<", "New Lead", "New Entry", "New Deal", "Add Lead"]

# ficha usa labels "bare" (sem >...<) — trocas específicas só nela
FICHA_BARE = [
    ("Inbox", "Caixa de Entrada"),
    ("Pipeline", "Funil"),
    ("Contacts", "Contatos"),
    ("Analytics", "Análise"),
    ("Settings", "Configurações"),
    ("Help", "Ajuda"),
    ("New Entry", "+ Novo lead"),
]

files = ["01-inbox.html", "02-pipeline.html", "04-analise.html", "03-ficha.html"]
for fn in files:
    p = HERE / fn
    s = p.read_text(encoding="utf-8", errors="ignore")
    before = s
    if fn == "03-ficha.html":
        for a, b in FICHA_BARE:
            s = s.replace(a, b)
        s = s.replace("Artisanal CRM", "CRM & Relacionamento")
    else:
        for a, b in COMMON:
            s = s.replace(a, b)
        for bt in BUTTONS:
            if bt.startswith(">"):
                s = s.replace(bt, ">+ Novo lead<")
            else:
                s = s.replace(bt, "+ Novo lead")
    p.write_text(s, encoding="utf-8")
    print(f"{fn}: {'ALTERADO' if s != before else 'sem mudança'} ({len(s)} bytes)")
