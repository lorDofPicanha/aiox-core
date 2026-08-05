# -*- coding: utf-8 -*-
"""Passe de peso do talos-site: TTF -> woff2 e og:image PNG -> JPEG.

O fork trouxe as Geist em .ttf cru (78 KB cada, sem compressao de fonte) e o og
gerado em PNG de 575 KB — o WhatsApp baixa esse arquivo a cada link compartilhado.
"""
import os, re, shutil
from fontTools.ttLib import TTFont
from PIL import Image

BASE = r"D:/AIOS/docs/projects/aiox-site/05-build/talos-site"
CSS = os.path.join(BASE, "styles.css")
PAGS = ["index.html", "licenca.html"]

# ---------------------------------------------------------------- fontes
print("=== fontes: ttf -> woff2 ===")
dfonts = os.path.join(BASE, "assets/fonts")
css = open(CSS, encoding="utf-8").read()
ganho_f = 0
for n in sorted(os.listdir(dfonts)):
    if not n.endswith(".ttf"):
        continue
    origem = os.path.join(dfonts, n)
    destino = origem[:-4] + ".woff2"
    antes = os.path.getsize(origem)
    f = TTFont(origem)
    f.flavor = "woff2"
    f.save(destino)
    depois = os.path.getsize(destino)
    ganho_f += antes - depois
    # a regra @font-face passa a oferecer woff2 primeiro e ttf como reserva
    alvo = f'url("assets/fonts/{n}") format("truetype")'
    novo = (f'url("assets/fonts/{n[:-4]}.woff2") format("woff2"), '
            f'url("assets/fonts/{n}") format("truetype")')
    if alvo in css:
        css = css.replace(alvo, novo)
        marca = "css atualizado"
    else:
        # a captura pode ter escrito a url sem aspas
        alvo2 = f"url(assets/fonts/{n})"
        if alvo2 in css:
            css = css.replace(alvo2, f'url("assets/fonts/{n[:-4]}.woff2") format("woff2"), url(assets/fonts/{n})')
            marca = "css atualizado (url sem aspas)"
        else:
            marca = "AVISO: nao achei a url no css"
    print(f"   {n}: {antes/1024:.0f} KB -> {depois/1024:.0f} KB  ({marca})")
open(CSS, "w", encoding="utf-8").write(css)
print(f"   ganho total nas fontes: {ganho_f/1024:.0f} KB")

# ---------------------------------------------------------------- og:image
print("\n=== og:image ===")
png = os.path.join(BASE, "assets/img/og-talos.png")
jpg = os.path.join(BASE, "assets/img/og-talos.jpg")
antes = os.path.getsize(png)
im = Image.open(png).convert("RGB")
# 1200x630 e o tamanho que os leitores de link usam; o PNG estava em 2x
im = im.resize((1200, 630), Image.LANCZOS)
im.save(jpg, "JPEG", quality=86, optimize=True, progressive=True)
depois = os.path.getsize(jpg)
print(f"   og-talos.png {antes/1024:.0f} KB (2400x1260)  ->  og-talos.jpg {depois/1024:.0f} KB (1200x630)")

for p in PAGS:
    caminho = os.path.join(BASE, p)
    h = open(caminho, encoding="utf-8").read()
    n = h.count("assets/img/og-talos.png")
    h = h.replace("assets/img/og-talos.png", "assets/img/og-talos.jpg")
    # og:image:type e dimensoes ajudam o leitor de link a nao precisar baixar para medir
    if 'property="og:image:width"' not in h:
        h = h.replace('<meta content="pt_BR" property="og:locale">',
                      '<meta content="1200" property="og:image:width">'
                      '<meta content="630" property="og:image:height">'
                      '<meta content="image/jpeg" property="og:image:type">'
                      '<meta content="pt_BR" property="og:locale">', 1)
    open(caminho, "w", encoding="utf-8").write(h)
    print(f"   {p}: {n} referencia(s) trocadas, +og:image:width/height/type")
os.remove(png)
print("   png antigo removido")

total = sum(os.path.getsize(os.path.join(r, a))
            for r, _, arqs in os.walk(BASE) if ".vercel" not in r for a in arqs)
print(f"\n   site em disco agora: {total/1024/1024:.1f} MB")
