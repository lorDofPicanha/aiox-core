# -*- coding: utf-8 -*-
"""
Tocks — extrai dados de compradores dos PDFs/DOCX de Ordem de Compra (OC) e Propostas.
Gera CSV no formato Meta Custom Audience + CSVs de auditoria.
"""
import os, re, csv, subprocess, glob, sys, zipfile

SRC = r"C:/Users/kingp/Downloads/tocks-pedidos"
OUT = r"C:/Users/kingp/Downloads"

UFS = {"AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
       "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO","UY"}

def pdf_text(path):
    try:
        r = subprocess.run(["pdftotext","-layout","-enc","UTF-8",path,"-"],
                           capture_output=True, timeout=60)
        return r.stdout.decode("utf-8","replace")
    except Exception as e:
        return ""

def docx_text(path):
    try:
        import docx
        d = docx.Document(path)
        return "\n".join(p.text for p in d.paragraphs)
    except Exception:
        return ""

def get_text(path):
    return docx_text(path) if path.lower().endswith(".docx") else pdf_text(path)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
PHONE_LBL_RE = re.compile(r"(?:CELULAR|TELEFONE|FONE|TEL|WHATSAPP|WHATS)[ \t]*:?[ \t]*(\+?[0-9()\.\- \t]{7,18})", re.I)
CLIENTE_RE = re.compile(r"CLIENTE\s*:?\s*(.+?)(?:\s{2,}|\s*DATA\s*:|\n|$)", re.I)
CPF_RE = re.compile(r"(?:CPF/CNPJ|CNPJ/CPF|CPF|CNPJ)\s*:?\s*([\d./\-]{8,})", re.I)
CEP_RE = re.compile(r"CEP\s*:?\s*(\d{5}\-?\d{3})")
DATA_RE = re.compile(r"DATA\s*:?\s*(\d{2}/\d{2}/\d{4})")
VALOR_RE = re.compile(r"R\$\s*([\d\.]+,\d{2})")

# palavras que indicam que o "CLIENTE" capturado e lixo (campo vazio no PDF)
JUNK_NAME = re.compile(r"\b(portando|documento|mediante|entrega|termo|assinar|responsabilidade|frete|montagem|garantia)\b", re.I)

def clean_name(raw):
    if not raw: return ""
    raw = re.sub(r"\s+", " ", raw).strip()
    if len(raw) > 45 or JUNK_NAME.search(raw):
        return ""
    return raw

def parse_cidade_uf(text):
    # procura "Cidade - UF" (UF valido) em UMA linha, preferindo perto de ENDERECO
    cands = []
    for m in re.finditer(r"([A-Za-zÀ-ÿ' ]{2,40}?)\s*-\s*([A-Z]{2})(?![A-Za-z])", text):
        cidade = m.group(1).strip(" |.\t")
        uf = m.group(2)
        if uf not in UFS or len(cidade) < 2:
            continue
        if "@" in cidade or ".com" in cidade.lower() or any(ch.isdigit() for ch in cidade):
            continue
        if "|" in cidade:                      # tira bairro, fica com ultimo segmento
            cidade = cidade.split("|")[-1].strip()
        cands.append((cidade, uf, m.start()))
    if not cands:
        return "", ""
    end_pos = text.upper().find("ENDERE")
    if end_pos >= 0:
        after = sorted([c for c in cands if c[2] > end_pos], key=lambda c: c[2])
        if after:
            return after[0][0], after[0][1]
    return cands[0][0], cands[0][1]

def norm_phone(raw, uf=""):
    if not raw: return ""
    d = re.sub(r"\D","", raw)
    if not d: return ""
    if uf == "UY":
        if not d.startswith("598"): d = "598"+d
        return "+"+d
    # Brasil: normaliza para nacional (DDD + numero = 10 ou 11 digitos)
    if d.startswith("55") and len(d) in (12,13):
        d = d[2:]                      # remove DDI 55
    if len(d) > 11:
        d = d[:11]                     # captura contaminada: fica com os 1os 11
    if len(d) in (10,11):
        return "+55"+d
    return ""                          # invalido (ex: 8-9 digitos sem DDD) -> nao usa

def split_name(full):
    full = re.sub(r"\s+"," ", full).strip()
    parts = full.split(" ")
    if len(parts) == 1: return parts[0], ""
    return parts[0], " ".join(parts[1:])

def classify(fname):
    up = fname.upper()
    if "CANCELAD" in up: return "cancelado"
    if up.startswith("PROPOSTA") or "ORCAMENTO" in up or "ORÇAMENTO" in up: return "proposta"
    if up.startswith("OC"): return "oc"
    return "outro"

def fname_name_uf(fname):
    base = os.path.splitext(fname)[0]
    base = re.sub(r"\s*\(\d+\)\s*$","", base).strip()
    if " - " in base:
        tail = base.split(" - ",1)[1]
    else:
        tail = base
    toks = tail.split()
    uf = ""
    if toks and toks[-1].upper() in UFS:
        uf = toks[-1].upper(); toks = toks[:-1]
    return " ".join(toks).strip(), uf

rows = []
files = sorted(glob.glob(os.path.join(SRC,"*.pdf")) + glob.glob(os.path.join(SRC,"*.docx")))
for path in files:
    fname = os.path.basename(path)
    typ = classify(fname)
    txt = get_text(path)
    cliente = ""
    m = CLIENTE_RE.search(txt)
    if m: cliente = clean_name(m.group(1))
    email = ""
    me = EMAIL_RE.search(txt)
    if me: email = me.group(0).lower().strip(".")
    phone_raw = ""
    mp = PHONE_LBL_RE.search(txt)
    if mp: phone_raw = mp.group(1)
    cpf = ""
    mc = CPF_RE.search(txt)
    if mc: cpf = mc.group(1)
    cep = ""
    mz = CEP_RE.search(txt)
    if mz: cep = re.sub(r"\D","", mz.group(1))
    data = ""
    md = DATA_RE.search(txt)
    if md: data = md.group(1)
    valores = VALOR_RE.findall(txt)
    valor = ""
    if valores:
        def tonum(v): return float(v.replace(".","").replace(",","."))
        valor = max(valores, key=tonum)
    cidade, uf = parse_cidade_uf(txt)
    fn_name, fn_uf = fname_name_uf(fname)
    if not cliente: cliente = fn_name
    if not uf: uf = fn_uf
    phone = norm_phone(phone_raw, uf)
    rows.append({
        "arquivo": fname, "tipo": typ, "cliente": cliente,
        "email": email, "telefone": phone, "telefone_raw": phone_raw.strip(),
        "cidade": cidade, "uf": uf, "cep": cep, "cpf_cnpj": cpf, "valor": valor, "data": data,
        "_text_len": len(txt),
    })

# DEDUP compradores (oc) por email > telefone > cliente+uf
def dedup(records):
    seen = {}
    order = []
    for r in records:
        key = r["email"] or r["telefone"] or (r["cliente"].lower()+"|"+r["uf"])
        if key in seen:
            ex = seen[key]
            # merge: preenche faltantes
            for f in ("email","telefone","cidade","uf","cep","cpf_cnpj","valor","data","telefone_raw"):
                if not ex[f] and r[f]: ex[f] = r[f]
            ex["arquivo"] += " ; " + r["arquivo"]
        else:
            seen[key] = dict(r); order.append(key)
    return [seen[k] for k in order]

oc = [r for r in rows if r["tipo"]=="oc"]
prop = [r for r in rows if r["tipo"]=="proposta"]
canc = [r for r in rows if r["tipo"]=="cancelado"]
outro = [r for r in rows if r["tipo"]=="outro"]

oc_dedup = dedup(oc)
def tier(r):
    if r["email"] or r["telefone"]: return "forte"   # email/telefone = match alto
    if r["cep"] or r["cidade"]:     return "fraco"    # so endereco/CEP = match baixo
    return "sem"
strong = [r for r in oc_dedup if tier(r)=="forte"]
weak   = [r for r in oc_dedup if tier(r)=="fraco"]
nomatch= [r for r in oc_dedup if tier(r)=="sem"]
uploadable = strong + weak   # tudo que tem ALGUM identificador

# === CSV 1: Meta upload (todos com algum identificador) ===
def country_for(uf): return "UY" if uf=="UY" else "BR"
with open(os.path.join(OUT,"Tocks-Compradores-META.csv"),"w",newline="",encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["email","phone","fn","ln","ct","st","zip","country"])
    for r in uploadable:
        fn,ln = split_name(r["cliente"])
        w.writerow([r["email"], r["telefone"], fn, ln, r["cidade"],
                    "" if r["uf"]=="UY" else r["uf"], r["cep"], country_for(r["uf"])])

# === CSV 2: Auditoria compradores ===
with open(os.path.join(OUT,"Tocks-Compradores-AUDIT.csv"),"w",newline="",encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["match","cliente","email","telefone","cidade","uf","cep","cpf_cnpj","valor","data","arquivo"])
    for r in oc_dedup:
        w.writerow([tier(r), r["cliente"], r["email"], r["telefone"], r["cidade"], r["uf"],
                    r["cep"], r["cpf_cnpj"], r["valor"], r["data"], r["arquivo"]])

# === CSV 3: Propostas (leads) ===
prop_dedup = dedup(prop)
with open(os.path.join(OUT,"Tocks-Propostas-AUDIT.csv"),"w",newline="",encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["cliente","email","telefone","cidade","uf","valor","data","arquivo"])
    for r in prop_dedup:
        w.writerow([r["cliente"], r["email"], r["telefone"], r["cidade"], r["uf"],
                    r["valor"], r["data"], r["arquivo"]])

# === RESUMO ===
print("=== RESUMO TOCKS ===")
print(f"Arquivos totais          : {len(rows)}")
print(f"  OC (compradores brutos): {len(oc)}  -> dedup: {len(oc_dedup)}")
print(f"  Propostas              : {len(prop)} -> dedup: {len(prop_dedup)}")
print(f"  Cancelados (excluidos) : {len(canc)}")
print(f"  Outros                 : {len(outro)} {[r['arquivo'] for r in outro]}")
print("-"*50)
print(f"COMPRADORES UNICOS         : {len(oc_dedup)}")
print(f"  com email                : {sum(1 for r in oc_dedup if r['email'])}")
print(f"  com telefone             : {sum(1 for r in oc_dedup if r['telefone'])}")
print(f"  match FORTE (email|tel)  : {len(strong)}")
print(f"  match FRACO (so CEP/end) : {len(weak)} {[r['cliente'] for r in weak]}")
print(f"  sem contato (descarta)   : {len(nomatch)} {[r['cliente'] for r in nomatch]}")
print(f"  >> VAO PRO ARQUIVO META  : {len(uploadable)}")
print("-"*50)
# distribuicao UF
from collections import Counter
ufc = Counter(r["uf"] for r in uploadable if r["uf"])
print("UF dos compradores matchaveis:", dict(sorted(ufc.items(), key=lambda x:-x[1])))
print("\nArquivos gerados em Downloads:")
print("  - Tocks-Compradores-META.csv   (upload no Gerenciador)")
print("  - Tocks-Compradores-AUDIT.csv  (revisao founder)")
print("  - Tocks-Propostas-AUDIT.csv    (leads/propostas)")
