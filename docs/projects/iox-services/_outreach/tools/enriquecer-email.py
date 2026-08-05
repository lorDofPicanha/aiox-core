# -*- coding: utf-8 -*-
"""Busca o e-mail cadastrado na Receita via publica.cnpj.ws e junta ao enriquecimento
que ja veio do BrasilAPI (que traz socio e telefone, mas devolve email nulo).

⚠️ O e-mail da Receita costuma ser PESSOAL (hotmail/gmail do socio) ou do CONTADOR.
Por isso o script classifica cada um — a base legal de legitimo interesse B2B do
`cold-outreach-v1.md` §7 pressupoe contato PROFISSIONAL. E-mail pessoal exige decisao
consciente do founder, nao entra em disparo por padrao.

Limite da API publica: 3 requisicoes/minuto. Cache em disco.
"""
import json, os, re, sys, time, urllib.request, urllib.error

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")
CACHE = os.path.join(BASE, "tools", ".cache-cnpjws")
SAIDA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")
os.makedirs(CACHE, exist_ok=True)

LIVRES = {"gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "yahoo.com",
          "bol.com.br", "uol.com.br", "terra.com.br", "live.com", "ig.com.br",
          "globo.com", "icloud.com", "msn.com", "outlook.com.br", "hotmail.com.br"}
CONTADOR = re.compile(r"contab|contad|escritorio|assessoria|fiscal", re.I)


def consulta(cnpj):
    p = os.path.join(CACHE, f"{cnpj}.json")
    if os.path.exists(p):
        return json.load(open(p, encoding="utf-8")), "cache"
    url = f"https://publica.cnpj.ws/cnpj/{cnpj}"
    req = urllib.request.Request(url, headers={"User-Agent": "prospeccao-b2b/1.0",
                                               "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            d = json.loads(r.read())
        json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False)
        return d, "api"
    except urllib.error.HTTPError as e:
        return {"_erro": f"HTTP {e.code}"}, "erro"
    except Exception as e:
        return {"_erro": str(e)[:80]}, "erro"


def classifica(email):
    if not email:
        return "sem e-mail"
    dom = email.split("@")[-1].lower()
    if dom in LIVRES:
        return "pessoal (provedor livre)"
    if CONTADOR.search(dom):
        return "provavel contador"
    return "corporativo"


# A API publica aceita 3 req/min, entao a lista inteira nao cabe numa execucao —
# e execucao longa vem sendo morta neste ambiente. --limite corta o lote; o cache faz
# a proxima execucao retomar de onde parou sem repetir chamada.
LIMITE = None
for arg in sys.argv:
    if arg.startswith("--limite="):
        LIMITE = int(arg.split("=", 1)[1])

d = json.load(open(ENTRADA, encoding="utf-8"))
alvos = d["construtoras"]
pendentes = sum(1 for c in alvos if not os.path.exists(os.path.join(CACHE, f"{c['cnpj']}.json")))
print(f"{len(alvos)} construtoras · {pendentes} ainda sem consulta"
      f"{f' · lote de {LIMITE}' if LIMITE else ''} (3 req/min)\n", flush=True)

chamadas = 0
for i, c in enumerate(alvos, 1):
    em_cache = os.path.exists(os.path.join(CACHE, f"{c['cnpj']}.json"))
    if LIMITE is not None and not em_cache and chamadas >= LIMITE:
        c.setdefault("email_receita", "")
        c.setdefault("email_tipo", "não consultado")
        continue
    info, origem = consulta(c["cnpj"])
    if origem == "api":
        chamadas += 1
        time.sleep(21)
    if "_erro" in info:
        c["email_receita"] = ""
        c["email_tipo"] = f"falhou: {info['_erro']}"
        print(f"  {i:3d}/{len(alvos)}  ERRO {info['_erro']:10s} {c['name'][:42]}", flush=True)
        continue
    est = info.get("estabelecimento") or {}
    email = (est.get("email") or "").strip().lower()
    c["email_receita"] = email
    c["email_tipo"] = classifica(email)
    tels = []
    for a, b in (("ddd1", "telefone1"), ("ddd2", "telefone2")):
        if est.get(a) and est.get(b):
            tels.append(f"({est[a]}) {est[b]}")
    if tels:
        c["telefones"] = tels
    c["situacao_ws"] = (est.get("situacao_cadastral") or "")
    print(f"  {i:3d}/{len(alvos)}  {c['email_tipo']:26s} {email[:34]:36s} {c['name'][:34]}", flush=True)

por_tipo = {}
for c in alvos:
    por_tipo[c.get("email_tipo", "?")] = por_tipo.get(c.get("email_tipo", "?"), 0) + 1

print("\n=== e-mails por tipo ===")
for k, v in sorted(por_tipo.items(), key=lambda x: -x[1]):
    print(f"   {v:3d}  {k}")

d["construtoras"] = alvos
d["comEmail"] = sum(1 for c in alvos if c.get("email_receita"))
json.dump(d, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nsalvo: {SAIDA}")
