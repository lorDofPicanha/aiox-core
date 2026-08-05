# -*- coding: utf-8 -*-
"""Enriquece as construtoras qualificadas com dado publico da Receita (BrasilAPI):
razao social, porte, situacao cadastral, CNAE, telefone, e-mail e QUADRO SOCIETARIO.

O socio importa mais que o e-mail: a copy exige nome de decisor real, e caixa
generica (contato@) tem taxa de resposta muito pior que nominal.
Cache em disco — reexecucao nao repete chamada.
"""
import json, os, time, urllib.request, urllib.error, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = os.path.join(BASE, "construtoras-qualificadas.json")
CACHE = os.path.join(BASE, "tools", ".cache-cnpj")
SAIDA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")
os.makedirs(CACHE, exist_ok=True)

SO_QUALIFICADAS = "--todas" not in sys.argv


def consulta(cnpj):
    p = os.path.join(CACHE, f"{cnpj}.json")
    if os.path.exists(p):
        return json.load(open(p, encoding="utf-8")), "cache"
    url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj}"
    req = urllib.request.Request(url, headers={"User-Agent": "prospeccao-b2b/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            d = json.loads(r.read())
        json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False)
        return d, "api"
    except urllib.error.HTTPError as e:
        return {"_erro": f"HTTP {e.code}"}, "erro"
    except Exception as e:
        return {"_erro": str(e)[:80]}, "erro"


d = json.load(open(ENTRADA, encoding="utf-8"))
alvos = [c for c in d["construtoras"] if c["qualifica_4obras"]] if SO_QUALIFICADAS else d["construtoras"]
print(f"enriquecendo {len(alvos)} construtoras...\n")

saida, erros = [], 0
for i, c in enumerate(alvos, 1):
    info, origem = consulta(c["cnpj"])
    if origem == "api":
        time.sleep(1.2)  # educado com a API publica
    if "_erro" in info:
        erros += 1
        c["_erro"] = info["_erro"]
        saida.append(c)
        print(f"  {i:3d}/{len(alvos)}  ERRO {info['_erro']:12s} {c['name'][:44]}")
        continue

    socios = [{"nome": s.get("nome_socio"), "qualificacao": s.get("qualificacao_socio")}
              for s in (info.get("qsa") or [])]
    tel = info.get("ddd_telefone_1") or ""
    c.update({
        "razao_social": info.get("razao_social"),
        "nome_fantasia": info.get("nome_fantasia") or "",
        "situacao": info.get("descricao_situacao_cadastral"),
        "porte": info.get("porte") or info.get("descricao_porte"),
        "abertura": info.get("data_inicio_atividade"),
        "cnae": info.get("cnae_fiscal_descricao"),
        "municipio": info.get("municipio"),
        "uf": info.get("uf"),
        "telefone": tel,
        "email": (info.get("email") or "").lower(),
        "socios": socios,
        "capital_social": info.get("capital_social"),
    })
    saida.append(c)
    marca = "ok " if c["email"] else "SEM E-MAIL"
    print(f"  {i:3d}/{len(alvos)}  {marca:10s} {c.get('porte',''):22s} "
          f"{len(socios)} socio(s)  {c['name'][:40]}")

com_email = [c for c in saida if c.get("email")]
com_socio = [c for c in saida if c.get("socios")]
ativas = [c for c in saida if c.get("situacao") == "ATIVA"]

print(f"\n=== resultado ===")
print(f"   consultadas: {len(saida)}   erros: {erros}")
print(f"   ATIVAS na Receita: {len(ativas)}")
print(f"   com e-mail: {len(com_email)}")
print(f"   com nome de socio (decisor): {len(com_socio)}")

json.dump({"geradoEm": __import__("datetime").date.today().isoformat(),
           "fonte": "PNCP + Receita Federal via BrasilAPI",
           "total": len(saida), "comEmail": len(com_email), "ativas": len(ativas),
           "construtoras": saida},
          open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nsalvo: {SAIDA}")
