# -*- coding: utf-8 -*-
"""Consolida os 4 extratos do PNCP e devolve so quem e CONSTRUTORA de verdade,
qualificada pelos criterios do produto (DECISAO-PRODUTO-v1.md secao 5).

Por que filtrar por objeto e nao por contagem de contrato: 3 dos 4 arquivos sao
extratos genericos de fornecedor do poder publico. Contar contrato sem olhar o que
foi contratado traz Volkswagen Truck, concessionaria de veiculo e casa de software
para uma lista de RDO de obra.
"""
import json, re, glob, os, unicodedata

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(BASE, "construtoras-qualificadas.json")


def normal(s):
    s = unicodedata.normalize("NFKD", (s or "").lower())
    return "".join(c for c in s if not unicodedata.combining(c))


# executa obra fisica -> tem canteiro, mestre, diario de obra
EXECUTA = [
    "execucao de obra", "construcao", "reforma", "pavimentacao", "terraplanagem",
    "edificacao", "drenagem", "saneamento", "ampliacao", "recuperacao de pavimento",
    "obra de arte", "ponte", "calcamento", "recapeamento", "urbanizacao",
    "revitalizacao", "infraestrutura", "engenharia civil", "reforma e ampliacao",
]
# nao tem canteiro proprio: vende, aluga, projeta ou faz servico continuado
DESCARTA_OBJ = [
    "aquisicao", "fornecimento", "locacao de veiculo", "veiculo", "combustivel",
    "medicamento", "genero alimenticio", "material de expediente", "licenca de uso",
    "software", "sistema de gestao", "consultoria", "elaboracao de projeto",
    "servico de transporte", "coleta de residuo", "manutencao de equipamento",
    "curso", "capacitacao", "seguro", "vale ", "mao de obra terceirizada",
]
DESCARTA_NOME = [
    "veiculo", "comercio de", "distribuidora", "sistemas ltda", "informatica",
    "concessionaria de veiculos", "maquinas para", "equipamentos ltda", "auto pecas",
    "farmac", "aliment", "combustiveis", "transportes ltda", "seguros",
    # revendedor entra pelo objeto (fornece material PARA obra) mas nao tem canteiro:
    "importacao", "exportacao", "atacado", "varejo", "comercial ltda", "com. e ",
    # ente publico aparece como fornecedor no PNCP, mas venda pra ele passa por licitacao:
    "consorcio", "intermunicipal", "autarquia", "prefeitura", "municipio de",
]
# nome que confirma construtora
NOME_BOM = ["construtora", "construcoes", "engenharia", "empreiteira", "terraplanagem",
            "pavimentacao", "empreendimentos", "incorporadora", "obras"]

tot = {}
for f in sorted(glob.glob(os.path.join(BASE, "*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    for x in d.get("suppliers", []):
        c = x["cnpj"]
        if c not in tot:
            tot[c] = {"cnpj": c, "name": x["name"], "wins": 0, "totalBRL": 0.0,
                      "municipios": set(), "objetos": set(), "fontes": set()}
        t = tot[c]
        t["wins"] += x.get("wins", 0)
        t["totalBRL"] += x.get("totalBRL", 0.0)
        t["municipios"] |= set(x.get("municipios") or [])
        t["objetos"] |= set(x.get("objetos") or [])
        t["fontes"].add(os.path.basename(f))

print(f"CNPJs consolidados: {len(tot)}")


def classifica(t):
    nome = normal(t["name"])
    objs = normal(" || ".join(t["objetos"]))
    if any(p in nome for p in DESCARTA_NOME):
        return None, "nome de comercio/servico"
    exec_hits = [p for p in EXECUTA if p in objs]
    desc_hits = [p for p in DESCARTA_OBJ if p in objs]
    nome_hit = any(p in nome for p in NOME_BOM)
    if not exec_hits and not nome_hit:
        return None, "nenhum objeto de execucao de obra"
    # objeto majoritariamente de compra/servico e nome nao confirma
    if desc_hits and not exec_hits and not nome_hit:
        return None, "objeto de aquisicao/servico"
    return (exec_hits, nome_hit), None


construtoras, descartes = [], {}
for t in tot.values():
    ok, motivo = classifica(t)
    if not ok:
        descartes[motivo] = descartes.get(motivo, 0) + 1
        continue
    exec_hits, nome_hit = ok
    t2 = dict(t)
    t2["municipios"] = sorted(t["municipios"])
    t2["objetos"] = sorted(t["objetos"])[:6]
    t2["fontes"] = sorted(t["fontes"])
    t2["sinais_obra"] = exec_hits[:5]
    t2["nome_confirma"] = nome_hit
    # criterios do produto: 4+ obras E presta contas a terceiro (obra publica = sempre)
    t2["qualifica_4obras"] = t["wins"] >= 4
    t2["cidades"] = len(t["municipios"])
    construtoras.append(t2)

print(f"descartados: {sum(descartes.values())}")
for k, v in sorted(descartes.items(), key=lambda x: -x[1]):
    print(f"   {v:4d}  {k}")

construtoras.sort(key=lambda t: -t["totalBRL"])
qual = [c for c in construtoras if c["qualifica_4obras"]]

print(f"\nCONSTRUTORAS identificadas: {len(construtoras)}")
print(f"   dessas, com 4+ contratos (criterio do produto): {len(qual)}")
print(f"   soma dos contratos qualificados: R$ {sum(c['totalBRL'] for c in qual)/1e6:,.1f} mi")

json.dump({"geradoEm": __import__("datetime").date.today().isoformat(),
           "criterio": "objeto de execucao de obra ou nome de construtora; obra publica = presta contas a terceiro",
           "total": len(construtoras), "qualificadas": len(qual),
           "construtoras": construtoras},
          open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nsalvo: {SAIDA}")

print("\n=== top 15 qualificadas ===")
for c in qual[:15]:
    print(f"  {c['wins']:3d}x  R$ {c['totalBRL']/1e6:7.2f} mi  {c['cidades']:2d} cid  {c['name'][:56]}")
