# -*- coding: utf-8 -*-
"""Repinta o anel de texto do selo circular: 'conicorn' (cravado no pixel pelo template)
vira 'talos'. Preserva a estrela do centro, que e o simbolo da marca.

Medido no original (160x160): estrela = raio 0-35 | vazio = 36-65 | anel = raio 66-79.
"""
import math, os, sys
from PIL import Image, ImageDraw, ImageFont

BASE = r"D:/AIOS/docs/projects/aiox-site/05-build/talos-site"
ORIG = os.path.join(BASE, "assets/img/69afccbca1e3cd77b38c7422_curve_20text.png")
# Regular, nao Medium: com Medium o anel fica 56% mais pesado que o original (medido
# por cobertura de alfa na faixa do anel).
FONTE = os.path.join(BASE, "assets/fonts/69abbcf306b3cfc08aeaf20d_Geist-Regular.ttf")
PALAVRA = "talos"
S = 8  # supersampling

im = Image.open(ORIG).convert("RGBA")
W, H = im.size
assert (W, H) == (160, 160), im.size

# 1. estrela do centro, preservada (tudo dentro do raio 50)
grande = im.resize((W * S, H * S), Image.LANCZOS)
cx = cy = W * S / 2
mascara = Image.new("L", grande.size, 0)
ImageDraw.Draw(mascara).ellipse(
    [cx - 50 * S, cy - 50 * S, cx + 50 * S, cy + 50 * S], fill=255)
estrela = Image.new("RGBA", grande.size, (0, 0, 0, 0))
estrela.paste(grande, (0, 0), mascara)

# 2. anel novo
# A LINHA DE BASE fica no raio interno da faixa: as letras crescem para FORA.
# 'conicorn' nao tem ascendente nenhuma e ocupava so ate a altura de x; 'talos' tem
# 't' e 'l', que sobem ~0,73em. Ancorar no centro da faixa estoura a borda do canvas
# (raio 80) e a arte sai cortada — por isso a base vai no raio 65.
RAIO = 66.0 * S
ALTURA_X = 9.5 * S       # altura de x medida no original (faixa util 67..76)
fonte = ImageFont.truetype(FONTE, 1000)
bb = fonte.getbbox("x")
escala = ALTURA_X / (bb[3] - bb[1])
fonte = ImageFont.truetype(FONTE, max(1, int(round(1000 * escala))))

unidade = PALAVRA + " \u2022 "
medidor = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
larg_unidade = medidor.textlength(unidade, font=fonte)
circunf = 2 * math.pi * RAIO
n = max(1, round(circunf / larg_unidade))
texto = unidade * n
larg_total = medidor.textlength(texto, font=fonte)
ajuste = circunf / larg_total  # tracking para fechar o circulo exatamente

print(f"fonte {fonte.size}px | unidade {larg_unidade:.0f}px | circunferencia {circunf:.0f}px")
print(f"repeticoes: {n}  ('{PALAVRA}' aparece {n}x)  | ajuste de tracking {ajuste:.4f}")

anel = Image.new("RGBA", grande.size, (0, 0, 0, 0))
ang = -90.0  # comeca no topo
for ch in texto:
    av = medidor.textlength(ch, font=fonte) * ajuste
    d_ang = (av / circunf) * 360.0
    if ch.strip():
        cbb = fonte.getbbox(ch)
        cw, chh = cbb[2] - cbb[0], cbb[3] - cbb[1]
        pad = int(max(cw, chh)) + 20
        tile = Image.new("RGBA", (pad * 2, pad * 2), (0, 0, 0, 0))
        ImageDraw.Draw(tile).text((pad, pad), ch, font=fonte, fill=(255, 255, 255, 255), anchor="ms")
        # letra de pe em relacao ao circulo, texto do lado de fora, sentido horario
        giro = -(ang + d_ang / 2) - 90
        tile = tile.rotate(giro, resample=Image.BICUBIC, center=(pad, pad))
        a = math.radians(ang + d_ang / 2)
        px = cx + RAIO * math.cos(a) - pad
        py = cy + RAIO * math.sin(a) - pad
        anel.alpha_composite(tile, (int(round(px)), int(round(py))))
    ang += d_ang

final = Image.alpha_composite(estrela, anel).resize((W, H), Image.LANCZOS)
final.save(ORIG)
print(f"salvo: {ORIG} ({os.path.getsize(ORIG):,} bytes)")

# conferencia visual em fundo escuro
prev = Image.new("RGBA", (W, H), (20, 20, 24, 255))
prev.alpha_composite(final)
saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(ORIG), "_preview-anel.png")
prev.convert("RGB").resize((640, 640), Image.LANCZOS).save(saida)
print("preview:", saida)
