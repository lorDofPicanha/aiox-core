# -*- coding: utf-8 -*-
"""
EXTRATOR LOCAL DA BASE DE CNPJ DA RECEITA FEDERAL
=================================================
Roda na sua máquina, sem depender de API e sem limite de requisição.
A saída sai no mesmo formato que o resto do pipeline já consome.

---------------------------------------------------------------------------
COMO USAR
---------------------------------------------------------------------------
1) Baixe os arquivos da Receita (ZIP). Precisa de dois grupos:
      Estabelecimentos0.zip ... Estabelecimentos9.zip   (~5 GB somados)
      Empresas0.zip ... Empresas9.zip                   (~1,5 GB somados)
   Espelho com CDN, mais rápido que o site da Receita:
      https://dados-abertos-rf-cnpj.casadosdados.com.br/
   Oficial:
      https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/

   NÃO precisa descompactar — o script lê de dentro do ZIP.

2) Jogue todos os ZIP numa pasta só, por exemplo D:\receita-cnpj\

3) Rode:
      python extrair-receita-local.py --pasta D:\receita-cnpj --uf SC
      python extrair-receita-local.py --pasta D:\receita-cnpj --uf SC PR RS --cnae 41 42 43
      python extrair-receita-local.py --pasta D:\receita-cnpj --uf SC --porte ME EPP --saida sc-pequenas.json

   Demora uns 10-25 min na primeira vez (é leitura de ~17 GB descompactados em fluxo).
   Memória usada fica baixa: o arquivo NUNCA é carregado inteiro.

---------------------------------------------------------------------------
O QUE ELE APLICA (critério do founder, 03/Ago)
---------------------------------------------------------------------------
  porte    : ME (01) e EPP (03) por padrão  → a faixa de R$250k a R$4,8 mi
             DEMAIS (05) fica de fora, porque é "acima de 4,8 mi SEM TETO"
  MEI      : sempre excluído (teto legal de R$81 mil, abaixo do seu piso)
  situação : só ATIVA
  tipo     : só MATRIZ (filial repete a mesma empresa)
  contato  : só quem tem e-mail OU telefone — sem contato não é prospect

---------------------------------------------------------------------------
LAYOUT (conferido no cnpj-metadados.pdf da Receita, não chutado)
---------------------------------------------------------------------------
  separador ';'  ·  aspas '"'  ·  encoding latin-1  ·  decimal com vírgula
"""
import argparse, csv, glob, io, json, os, sys, zipfile, datetime

# --- EMPRESAS (7 colunas) ---
E_CNPJ_BASE, E_RAZAO, E_NATUREZA, E_QUALIF, E_CAPITAL, E_PORTE, E_ENTE = range(7)
PORTE = {"01": "ME", "03": "EPP", "05": "DEMAIS", "00": "NAO INFORMADO"}

# --- ESTABELECIMENTOS (30 colunas) ---
S_CNPJ_BASE, S_ORDEM, S_DV, S_MATRIZ, S_FANTASIA, S_SITUACAO = 0, 1, 2, 3, 4, 5
S_INICIO, S_CNAE, S_CNAE2 = 10, 11, 12
S_UF, S_MUNICIPIO = 19, 20
S_DDD1, S_TEL1, S_DDD2, S_TEL2 = 21, 22, 23, 24
S_EMAIL = 27

LIVRES = {"gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "yahoo.com",
          "bol.com.br", "uol.com.br", "terra.com.br", "live.com", "ig.com.br",
          "globo.com", "icloud.com", "msn.com", "outlook.com.br", "hotmail.com.br"}


def classifica_email(email):
    """Mesma régua do resto do pipeline: caixa pessoal do dono não é contato profissional."""
    if not email:
        return "sem e-mail"
    dom = email.split("@")[-1].lower()
    raiz = dom.split(".")[0]
    if dom.endswith(".gov.br"):
        return "órgão público"
    if dom in LIVRES:
        return "pessoal (provedor livre)"
    if any(t in dom for t in ("contab", "contad", "escritorio", "assessoria", "fiscal")) \
            or raiz.endswith(("cont", "conta")):
        return "provável contador"
    return "corporativo"


def linhas_do_zip(padrao, pasta):
    """Le CSV de dentro dos ZIP, em fluxo. Nunca carrega o arquivo inteiro na memoria."""
    arquivos = sorted(glob.glob(os.path.join(pasta, padrao)))
    if not arquivos:
        sys.exit(f"nenhum arquivo casou com {padrao} em {pasta}\n"
                 f"   confira se os ZIP estao na pasta (Estabelecimentos*.zip / Empresas*.zip)")
    for caminho in arquivos:
        print(f"   lendo {os.path.basename(caminho)} ...", flush=True)
        with zipfile.ZipFile(caminho) as z:
            for nome in z.namelist():
                with z.open(nome) as bruto:
                    txt = io.TextIOWrapper(bruto, encoding="latin-1", errors="replace",
                                           newline="")
                    for linha in csv.reader(txt, delimiter=";", quotechar='"'):
                        yield linha


ap = argparse.ArgumentParser()
ap.add_argument("--pasta", required=True, help="pasta com os ZIP da Receita")
ap.add_argument("--uf", nargs="+", default=["SC"])
ap.add_argument("--cnae", nargs="*", default=[],
                help="prefixos de CNAE (ex: 41 42 43 = construcao). vazio = todos os setores")
ap.add_argument("--porte", nargs="+", default=["ME", "EPP"], choices=["ME", "EPP", "DEMAIS"])
ap.add_argument("--saida", default="prospects-receita.json")
ap.add_argument("--exigir-email", action="store_true",
                help="so quem tem e-mail (por padrao aceita telefone tambem)")
a = ap.parse_args()

UFS = {u.upper() for u in a.uf}
PORTES_OK = {k for k, v in PORTE.items() if v in a.porte}

print(f"UF: {', '.join(sorted(UFS))} · porte: {', '.join(a.porte)} · "
      f"CNAE: {', '.join(a.cnae) if a.cnae else 'TODOS os setores'}")

# ---------------------------------------------------------------- passo 1
# Filtra ESTABELECIMENTOS primeiro. E o arquivo grande, mas o filtro corta cedo e
# so o que sobra vai pra memoria — por isso a ordem e essa, e nao o contrario.
print("\n[1/3] varrendo estabelecimentos...")
achados = {}
lidas = 0
for L in linhas_do_zip("Estabelecimentos*.zip", a.pasta):
    lidas += 1
    if lidas % 5_000_000 == 0:
        print(f"      {lidas:,} linhas · {len(achados):,} candidatos", flush=True)
    if len(L) < 28:
        continue
    if L[S_UF].strip().upper() not in UFS:
        continue
    if L[S_SITUACAO].strip() != "02":          # 02 = ATIVA
        continue
    if L[S_MATRIZ].strip() != "1":             # 1 = MATRIZ (filial repete a empresa)
        continue
    cnae = L[S_CNAE].strip()
    if a.cnae and not any(cnae.startswith(p) for p in a.cnae):
        continue
    email = L[S_EMAIL].strip().lower()
    tel = ""
    if L[S_DDD1].strip() and L[S_TEL1].strip():
        tel = f"({L[S_DDD1].strip()}) {L[S_TEL1].strip()}"
    if a.exigir_email:
        if not email:
            continue
    elif not email and not tel:
        continue
    base = L[S_CNPJ_BASE].strip()
    achados[base] = {
        "cnpj": base + L[S_ORDEM].strip() + L[S_DV].strip(),
        "cnpj_base": base,
        "nome_fantasia": L[S_FANTASIA].strip(),
        "cnae": cnae,
        "uf": L[S_UF].strip(),
        "municipio_cod": L[S_MUNICIPIO].strip(),
        "inicio_atividade": L[S_INICIO].strip(),
        "email": email,
        "email_tipo": classifica_email(email),
        "telefone": tel,
    }
print(f"      {lidas:,} linhas lidas · {len(achados):,} candidatos antes do porte")

# ---------------------------------------------------------------- passo 2
print("\n[2/3] cruzando com empresas (porte, razao social, capital)...")
casados = 0
for L in linhas_do_zip("Empresas*.zip", a.pasta):
    if len(L) < 6:
        continue
    base = L[E_CNPJ_BASE].strip()
    c = achados.get(base)
    if not c:
        continue
    porte = L[E_PORTE].strip().zfill(2)
    if porte not in PORTES_OK:
        achados.pop(base, None)
        continue
    c["razao_social"] = L[E_RAZAO].strip()
    c["porte"] = PORTE.get(porte, porte)
    try:
        c["capital_social"] = float(L[E_CAPITAL].strip().replace(",", "."))
    except Exception:
        c["capital_social"] = None
    casados += 1
# quem ficou sem razao social nao apareceu no arquivo de empresas
achados = {k: v for k, v in achados.items() if v.get("razao_social")}
print(f"      {len(achados):,} empresas dentro do porte pedido")

# ---------------------------------------------------------------- passo 3
print("\n[3/3] excluindo MEI...")
mei = 0
padrao_simples = "Simples*.zip"
if glob.glob(os.path.join(a.pasta, padrao_simples)):
    for L in linhas_do_zip(padrao_simples, a.pasta):
        if len(L) < 5:
            continue
        base = L[0].strip()
        if base in achados and L[4].strip().upper() == "S":   # OPCAO PELO MEI
            achados.pop(base, None)
            mei += 1
    print(f"      {mei:,} MEI removidos (teto de R$81 mil fica abaixo do seu piso)")
else:
    print("      ⚠️ Simples*.zip nao encontrado — MEI NAO foi removido. "
          "Baixe o arquivo Simples para o corte ficar correto.")

lista = sorted(achados.values(), key=lambda c: (c["email_tipo"] != "corporativo",
                                                c.get("razao_social") or ""))
por_tipo = {}
for c in lista:
    por_tipo[c["email_tipo"]] = por_tipo.get(c["email_tipo"], 0) + 1

saida = a.saida if os.path.isabs(a.saida) else os.path.join(os.getcwd(), a.saida)
json.dump({"geradoEm": datetime.datetime.now().isoformat(timespec="seconds"),
           "fonte": "Dados Abertos CNPJ — Receita Federal",
           "filtro": {"uf": sorted(UFS), "porte": a.porte,
                      "cnae": a.cnae or "todos", "somenteMatrizAtiva": True},
           "total": len(lista), "porTipoDeEmail": por_tipo,
           "empresas": lista},
          open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"\n{'='*62}")
print(f"RESULTADO: {len(lista):,} empresas")
for k, v in sorted(por_tipo.items(), key=lambda x: -x[1]):
    print(f"   {v:6,}  {k}")
print(f"\nsalvo: {saida}")
print("\nMe mande esse arquivo (ou so o caminho dele) que eu sigo daqui:")
print("  qualificacao por setor · escolha da abordagem · dossies com a copy")
