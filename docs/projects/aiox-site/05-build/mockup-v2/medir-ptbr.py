# Mede, nos .woff2 REAIS que o mockup serve, a altura de caixa alta portuguesa
# contra a inglesa, e o line-height minimo que acomoda A-til sobre C-cedilha.
from fontTools.ttLib import TTFont
import json, sys

paths = {
    "Inter": r"D:\AIOS\docs\projects\aiox-site\05-build\mockup\fonts\InterVariable.woff2",
    "JetBrainsMono": r"D:\AIOS\docs\projects\aiox-site\05-build\mockup\fonts\JetBrainsMono.woff2",
}

out = {}
for nome, p in paths.items():
    f = TTFont(p)
    upm = f["head"].unitsPerEm
    cmap = f.getBestCmap()
    glyf = f["glyf"] if "glyf" in f else None
    gs = f.getGlyphSet()
    from fontTools.pens.boundsPen import BoundsPen

    def bounds(ch):
        cp = ord(ch)
        if cp not in cmap:
            return None
        gname = cmap[cp]
        bp = BoundsPen(gs)
        gs[gname].draw(bp)
        return bp.bounds  # (xMin, yMin, xMax, yMax)

    dados = {}
    for ch in ["H", "A", "\u00c3", "\u00c7", "\u00c1", "\u00c2", "\u00d5", "\u00c9", "x", "\u00e7", "\u00e3", "g", "p"]:
        b = bounds(ch)
        dados[ch] = None if b is None else {
            "yMin_em": round(b[1] / upm, 4),
            "yMax_em": round(b[3] / upm, 4),
        }

    capH = dados["H"]["yMax_em"]
    atil = dados["\u00c3"]["yMax_em"]
    ced = dados["\u00c7"]["yMin_em"]     # negativo
    # extremos de TODA a caixa alta acentuada usada em PT-BR
    caps_pt = ["\u00c3", "\u00c1", "\u00c2", "\u00d5", "\u00c9", "\u00c7"]
    topo_pt = max(dados[c]["yMax_em"] for c in caps_pt if dados[c])
    base_pt = min(dados[c]["yMin_em"] for c in caps_pt if dados[c])

    out[nome] = {
        "unitsPerEm": upm,
        "cap_height_H_em": capH,
        "topo_maiuscula_acentuada_em": round(topo_pt, 4),
        "base_maiuscula_acentuada_em": round(base_pt, 4),
        "vao_vertical_caixa_alta_PT_em": round(topo_pt - base_pt, 4),
        "vao_vertical_caixa_alta_EN_em": round(capH, 4),
        "acrescimo_PT_sobre_EN_pct": round(((topo_pt - base_pt) / capH - 1) * 100, 1),
        "line_height_minimo_caixa_alta": round(topo_pt - base_pt, 3),
        "detalhe": dados,
    }

print(json.dumps(out, ensure_ascii=False, indent=1))

print("\n--- LINE-HEIGHT MINIMO POR TOKEN (Inter) ---")
i = out["Inter"]
span = i["vao_vertical_caixa_alta_PT_em"]
# caixa baixa: acento de minuscula (a-til) sobre descendente de minuscula (g / c-cedilha)
lower_top = i["detalhe"]["\u00e3"]["yMax_em"]
lower_bot = min(i["detalhe"]["g"]["yMin_em"], i["detalhe"]["\u00e7"]["yMin_em"], i["detalhe"]["p"]["yMin_em"])
span_lower = lower_top - lower_bot
print(f"caixa ALTA  PT: span {span:.4f} em  -> line-height minimo {span:.3f}")
print(f"caixa BAIXA PT: span {span_lower:.4f} em -> line-height minimo {span_lower:.3f}")
for tok, px, lh in [("--t-display", 62, 1.08), ("--t-h2", 44, 1.06), ("--t-h3", 32, 1.10),
                    ("--t-h4", 21, 1.30), ("--t-h5", 18, 1.40), ("--t-label", 11, 1.20),
                    ("--t-micro", 10, 1.20)]:
    caixa_alta = tok in ("--t-label", "--t-micro")
    need = span if caixa_alta else span_lower
    folga_em = lh - need
    print(f"{tok:12} {px}px lh {lh}  precisa >= {need:.3f}  folga {folga_em:+.3f} em = {folga_em*px:+.1f} px  {'OK' if folga_em>0.02 else 'AJUSTAR'}")
