# -*- coding: utf-8 -*-
"""Extrai contratos do PNCP e agrega por FORNECEDOR, no mesmo formato dos extratos
que ja existiam — assim `qualificar-construtoras.py` roda por cima sem mudanca.

Por que duas chamadas por contrato: o endpoint `/api/search/` e rapido e filtra por UF,
palavra e data, mas devolve so o ORGAO COMPRADOR. Quem ganhou o contrato so aparece no
detalhe (`/api/pncp/v1/orgaos/{cnpj}/contratos/{ano}/{seq}` → `niFornecedor`).
O `/api/consulta/v1/contratos`, que traria tudo de uma vez, responde 504 (testado 03/Ago).

⚠️ A API oscila: 504 e connection reset sao normais. Toda chamada tem retentativa com
recuo exponencial, e o detalhe fica em cache — reexecucao nao repete trabalho.

Uso:
  python extrair-pncp.py --uf SC --desde 2026-05-01 --ate 2026-07-31
  python extrair-pncp.py --uf SC RS PR --desde 2026-06-01 --ate 2026-07-31 --saida obras-sul.json
"""
import argparse, json, os, sys, time, urllib.request, urllib.error, datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(BASE, "tools", ".cache-pncp")
os.makedirs(CACHE, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept": "application/json",
      "Accept-Language": "pt-BR", "Connection": "close"}

# termos que aparecem no objeto de quem EXECUTA obra (tem canteiro, mestre, diario)
TERMOS = ["pavimentação", "execução de obra", "construção", "terraplenagem",
          "drenagem", "reforma e ampliação", "recapeamento"]


def pega(url, tentativas=5, timeout=70):
    espera = 2.0
    for t in range(1, tentativas + 1):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and t < tentativas:
                time.sleep(espera); espera = min(espera * 2, 30); continue
            return None
        except Exception:
            if t < tentativas:
                time.sleep(espera); espera = min(espera * 2, 30); continue
            return None
    return None


def busca(uf, termo, pagina, tam=50):
    from urllib.parse import quote
    return pega("https://pncp.gov.br/api/search/?tipos_documento=contrato"
                f"&ordenacao=-data&pagina={pagina}&tam_pagina={tam}&status=todos"
                f"&ufs={uf}&q={quote(termo)}")


def detalhe(orgao_cnpj, ano, seq):
    """Devolve (dado, veio_da_rede). O segundo importa: so faz sentido pausar entre
    chamadas de rede — pausar em acerto de cache jogou ~7 min fora na 1a execucao."""
    chave = f"{orgao_cnpj}-{ano}-{seq}.json"
    p = os.path.join(CACHE, chave)
    if os.path.exists(p):
        try:
            return json.load(open(p, encoding="utf-8")), False
        except Exception:
            pass
    d = pega(f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/contratos/{ano}/{seq}",
             tentativas=3, timeout=45)
    if d:
        json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False)
    return d, True


def data_de(item):
    for c in ("data_publicacao_pncp", "data_assinatura", "createdAt"):
        v = item.get(c)
        if v:
            return str(v)[:10]
    return ""


ap = argparse.ArgumentParser()
ap.add_argument("--uf", nargs="+", default=["SC"])
ap.add_argument("--desde", required=True, help="AAAA-MM-DD")
ap.add_argument("--ate", required=True, help="AAAA-MM-DD")
ap.add_argument("--termos", nargs="+", default=TERMOS)
ap.add_argument("--saida", default=None)
ap.add_argument("--max-paginas", type=int, default=40, help="teto por UF+termo")
ap.add_argument("--pausa", type=float, default=0.7, help="segundos entre chamadas de detalhe")
a = ap.parse_args()

# ---------------------------------------------------------------- 1. busca
# Checkpoint gravado A CADA PAGINA, nao no fim: neste ambiente tarefa longa em segundo
# plano e morta sem aviso, e SIGKILL nao roda handler nenhum. Salvar so no fim ja custou
# duas execucoes inteiras (1075/1739 detalhes e 2145 contratos de busca, ambos perdidos).
CKPT = os.path.join(CACHE, f"_busca-{'-'.join(a.uf)}-{a.desde}-{a.ate}.json")
estado = {"contratos": {}, "feitos": []}
if os.path.exists(CKPT):
    try:
        estado = json.load(open(CKPT, encoding="utf-8"))
        print(f"checkpoint retomado: {len(estado['contratos'])} contratos, "
              f"{len(estado['feitos'])} pares uf/termo ja varridos", flush=True)
    except Exception:
        pass
contratos = estado["contratos"]


def grava_ckpt():
    tmp = CKPT + ".tmp"
    json.dump(estado, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
    os.replace(tmp, CKPT)          # troca atomica: nunca deixa checkpoint pela metade


for uf in a.uf:
    for termo in a.termos:
        marca = f"{uf}|{termo}"
        if marca in estado["feitos"]:
            print(f"  busca {uf}/{termo[:14]:14s} — já varrido, pulando", flush=True)
            continue
        antigos_seguidos = 0
        for pag in range(1, a.max_paginas + 1):
            d = busca(uf, termo, pag)
            if not d or not d.get("items"):
                break
            for it in d["items"]:
                dt = data_de(it)
                if not dt:
                    continue
                if dt < a.desde:
                    antigos_seguidos += 1
                    continue
                if dt > a.ate:
                    continue
                contratos[it["numero_controle_pncp"]] = it
            print(f"  busca {uf}/{termo[:14]:14s} pag {pag:2d} → "
                  f"{len(contratos)} contratos na janela", flush=True)
            grava_ckpt()
            # a ordenacao e -data: se a pagina inteira ja e mais velha que a janela, para
            if antigos_seguidos >= 50:
                break
            time.sleep(0.5)
        estado["feitos"].append(marca)
        grava_ckpt()

print(f"\ncontratos unicos na janela {a.desde}..{a.ate}: {len(contratos)}")
if not contratos:
    sys.exit("nada encontrado — conferir janela de datas")

# ---------------------------------------------------------------- 2. detalhe → fornecedor
saida = a.saida or os.path.join(
    BASE, f"pncp-{'-'.join(a.uf)}-{a.desde.replace('-','')}-{a.ate.replace('-','')}.json")
if not os.path.isabs(saida):
    saida = os.path.join(BASE, saida)

forn = {}
faltou = 0
processados = 0


def grava_saida():
    lista = []
    for f in forn.values():
        f = dict(f)
        f["municipios"] = sorted(f["municipios"])
        f["objetos"] = sorted(f["objetos"])[:8]
        lista.append(f)
    lista.sort(key=lambda f: -f["totalBRL"])
    tmp = saida + ".tmp"
    json.dump({"generatedAt": datetime.datetime.now().isoformat(timespec="seconds"),
               "uf": "-".join(a.uf), "from": a.desde.replace("-", ""),
               "to": a.ate.replace("-", ""), "nicho": "obras/engenharia",
               "stats": {"contratos": len(contratos), "contratosProcessados": processados,
                         "completo": processados == len(contratos),
                         "fornecedores": len(lista), "semDetalhe": faltou,
                         "termos": a.termos},
               "suppliers": lista},
              open(tmp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    os.replace(tmp, saida)
    return len(lista)


try:
    for i, (chave, it) in enumerate(sorted(contratos.items()), 1):
        d, da_rede = detalhe(it["orgao_cnpj"], it["ano"], it["numero_sequencial"])
        processados = i
        if not d or not d.get("niFornecedor"):
            faltou += 1
        else:
            cn = str(d["niFornecedor"]).zfill(14)
            f = forn.setdefault(cn, {"cnpj": cn, "name": d.get("nomeRazaoSocialFornecedor") or "",
                                     "wins": 0, "totalBRL": 0.0,
                                     "municipios": set(), "objetos": set()})
            f["wins"] += 1
            f["totalBRL"] += float(d.get("valorGlobal") or d.get("valorInicial") or 0)
            if it.get("municipio_nome"):
                f["municipios"].add(it["municipio_nome"])
            if d.get("objetoContrato"):
                f["objetos"].add(d["objetoContrato"][:400])
        if i % 25 == 0 or i == len(contratos):
            print(f"  detalhe {i}/{len(contratos)} → {len(forn)} fornecedores "
                  f"({faltou} sem dado)", flush=True)
        if i % 100 == 0:
            grava_saida()
        if da_rede:
            time.sleep(a.pausa)
except KeyboardInterrupt:
    # Interrupcao NAO pode jogar fora o que ja custou minutos de rede.
    print(f"\ninterrompido em {processados}/{len(contratos)} — salvando o parcial", flush=True)

# ---------------------------------------------------------------- 3. saida
n = grava_saida()
completo = processados == len(contratos)
print(f"\ncontratos: {len(contratos)} | processados: {processados} | "
      f"fornecedores: {n} | sem detalhe: {faltou}")
print(f"completo: {completo}")
print(f"salvo: {saida}")
if not completo:
    print("PARCIAL — rodar de novo com os mesmos argumentos retoma do checkpoint.")
print("\nproximo passo: python qualificar-construtoras.py")
