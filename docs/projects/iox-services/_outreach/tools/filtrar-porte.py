# -*- coding: utf-8 -*-
"""Aplica o corte de PORTE definido pelo founder em 03/Ago, que substitui o corte por nicho.

  piso .............. R$ 250 mil/ano  (qualquer ramo)
  teto geral ........ R$ 2,5 milhoes/ano
  teto construtora .. R$ 15 milhoes/ano

⚠️ LIMITACAO HONESTA: faturamento nao e dado publico. O que existe:
  - `porte` da Receita, que e FAIXA e nao numero:
        MEI  ate R$ 81 mil   ·  ME  ate R$ 360 mil
        EPP  ate R$ 4,8 mi   ·  DEMAIS  acima de R$ 4,8 mi
  - soma dos contratos publicos no periodo (so serve pra construtora, e e piso, nao teto)
  - capital social (fraco)
Logo o corte de R$ 2,5 mi NAO da pra fazer com precisao: EPP vai ate 4,8 mi. O que da pra
fazer com honestidade e classificar em DENTRO / PROVAVEL / FORA e dizer qual e qual.
"""
import json, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")
SAIDA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")

PISO = 250_000
TETO_CONSTRUTORA = 15_000_000

d = json.load(open(ENTRADA, encoding="utf-8"))
cs = d["construtoras"]


def faixa_porte(p):
    p = (p or "").upper()
    if "MICRO EMPRESA" in p or p == "ME":
        return ("ME", 0, 360_000)
    if "PEQUENO PORTE" in p or p == "EPP":
        return ("EPP", 360_000, 4_800_000)
    if "MEI" in p:
        return ("MEI", 0, 81_000)
    return ("DEMAIS", 4_800_000, None)


def classifica(c):
    sigla, pmin, pmax = faixa_porte(c.get("porte"))
    contratos = c.get("totalBRL", 0.0)

    # MEI nao chega no piso de 250k por definicao legal
    if sigla == "MEI":
        return "FORA — abaixo do piso", sigla

    # contrato publico acumulado ja e piso de faturamento: se passou do teto, esta fora
    if contratos > TETO_CONSTRUTORA:
        return "FORA — acima do teto de construtora", sigla

    if sigla == "DEMAIS":
        # 🔴 "DEMAIS" e faturamento ACIMA de 4,8 mi SEM TETO — pode ser 5 mi ou 5 bilhoes.
        # Classificar pelo valor de contrato do periodo deixou passar CELESC e Parana
        # Equipamentos: contrato pequeno num semestre nao faz a empresa ser pequena.
        # Unico desempate publico disponivel: capital social.
        cap = c.get("capital_social") or 0
        if cap >= 10_000_000:
            return ("FORA — porte grande (capital social alto)", sigla)
        return ("VERIFICAR — porte >4,8 mi sem teto; so serve se for construtora <15 mi", sigla)

    if sigla == "ME":
        # teto legal 360k: passa do piso de 250k so na ponta de cima da faixa
        return ("PROVÁVEL — ME, faixa 0–360k encosta no piso", sigla)

    # EPP: 360k a 4,8 mi. Cobre o alvo (250k–2,5 mi) mas transborda ate 4,8.
    if contratos and contratos >= PISO:
        return ("DENTRO — EPP com contrato acima do piso", sigla)
    return ("PROVÁVEL — EPP, faixa 360k–4,8 mi", sigla)


cont = {}
for c in cs:
    v, sigla = classifica(c)
    c["faixa_porte"] = sigla
    c["veredito_porte"] = v
    cont[v] = cont.get(v, 0) + 1

print("=== corte de porte (piso 250k · teto 2,5 mi · construtora 15 mi) ===")
for k in sorted(cont, key=lambda x: (-cont[x])):
    print(f"   {cont[k]:4d}  {k}")

dentro = [c for c in cs if c["veredito_porte"].startswith(("DENTRO", "PROVÁVEL"))]
verificar = [c for c in cs if c["veredito_porte"].startswith("VERIFICAR")]
fora = [c for c in cs if c["veredito_porte"].startswith("FORA")]
com_email = [c for c in dentro if c.get("email_tipo") == "corporativo"]

print(f"\n   elegiveis (DENTRO + PROVAVEL): {len(dentro)}")
print(f"   a verificar (porte DEMAIS)...: {len(verificar)}")
print(f"   descartados por porte........: {len(fora)}")
print(f"   elegiveis COM e-mail corporativo: {len(com_email)}")

print("\n=== os 10 maiores que SAIRAM (acima do teto) ===")
for c in sorted(fora, key=lambda x: -x.get("totalBRL", 0))[:10]:
    print(f"   R$ {c['totalBRL']/1e6:7.1f} mi  {c.get('porte','?'):22s} "
          f"{(c.get('razao_social') or c['name'])[:44]}")

print("\n=== 10 elegiveis com e-mail corporativo, do menor pro maior ===")
for c in sorted(com_email, key=lambda x: x.get("totalBRL", 0))[:10]:
    print(f"   R$ {c['totalBRL']/1e6:6.2f} mi  {c['faixa_porte']:7s} {c.get('wins'):2d}x  "
          f"{(c.get('razao_social') or c['name'])[:38]:40s} {c.get('email_receita','')[:30]}")

d["construtoras"] = cs
json.dump(d, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nsalvo (campo veredito_porte gravado em cada linha): {SAIDA}")
