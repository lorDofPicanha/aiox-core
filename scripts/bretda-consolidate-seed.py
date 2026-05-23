# -*- coding: utf-8 -*-
"""Consolidate Bretda buyer seed: OC buyers (cleaned) + prior 17-list, deduped,
tagged architect vs end-client. Cross buyer CEPs -> affluent geo."""
import os, re, json, sys, csv

SRC = sys.argv[1]
PRIOR = r"C:\Users\kingp\Downloads\Lista-Clientes-Bretda-META.csv"
OUT = r"C:\Users\kingp\Downloads\Bretda-SEED-COMPRADORES.csv"

with open(os.path.join(SRC, "_dump.json"), encoding="utf-8") as fh:
    data = json.load(fh)

# --- junk rules ---
BRETDA_OWN_EMAILS = {"vendas@bretda.com.br"}
BRETDA_OWN_PHONES = {"47992259554", "5547992259554"}
GARBAGE_PHONES = {"5467068600"}      # malformed 10-digit, shared across records
GARBAGE_EMAILS = {"ago@gmail.com"}   # truncated parse

# architect / specifier domains (heuristic) + filename tags
ARCH_DOMAIN_HINTS = ("arq", "arquitet", "interiores", "design", "ae.com", "eng",
                     "crescenti", "jacobsenar", "pasquaegraziano", "vassoler",
                     "olegariodesa", "sammybork", "vieirasampaio")

def norm_phone(p):
    d = re.sub(r"\D", "", p or "")
    if d.startswith("55") and len(d) > 11:
        d = d[2:]
    return d if 10 <= len(d) <= 11 else ""

def first_last(filename):
    base = os.path.splitext(filename)[0]
    person = base.split(" - ", 1)[1] if " - " in base else base.replace("OC", "").strip()
    person = re.sub(r"\b(SP|RJ|RS|SC|PR|MS|MG|GO|DF|PI|BA|CE|ARQ|INT)\b", "", person).strip()
    return person.title()

def is_arch(emails, fname):
    if "ARQ" in fname.upper():
        return True
    for e in emails:
        dom = e.split("@")[-1].lower()
        if any(h in dom for h in ARCH_DOMAIN_HINTS):
            return True
    return False

# --- build buyer records from OC ---
oc = [r for r in data if r["kind"] == "OC"]
buyers = {}
for r in oc:
    key = first_last(r["file"]).upper()
    b = buyers.setdefault(key, {"name": first_last(r["file"]), "emails": set(),
                                "phones": set(), "ceps": set(), "ufs": set(),
                                "files": [], "arch": False})
    em = [e for e in r["emails"] if e.lower() not in BRETDA_OWN_EMAILS and e.lower() not in GARBAGE_EMAILS]
    ph = [norm_phone(p) for p in r["phones"]]
    ph = [p for p in ph if p and p not in BRETDA_OWN_PHONES and p not in GARBAGE_PHONES]
    b["emails"].update(em); b["phones"].update(ph)
    b["ceps"].update(r["ceps"]); b["ufs"].update(r["ufs"]); b["files"].append(r["file"])
    if is_arch(em, r["file"]):
        b["arch"] = True

# merge same-entity by shared email (RAMIRO==FERNANDO via fernando@suprema.group)
by_email = {}
for k, b in list(buyers.items()):
    for e in b["emails"]:
        by_email.setdefault(e.lower(), []).append(k)
for e, keys in by_email.items():
    if len(keys) > 1:
        keys = sorted(keys)
        master = keys[0]
        for k in keys[1:]:
            if k in buyers and master in buyers:
                buyers[master]["emails"].update(buyers[k]["emails"])
                buyers[master]["phones"].update(buyers[k]["phones"])
                buyers[master]["ceps"].update(buyers[k]["ceps"])
                buyers[master]["ufs"].update(buyers[k]["ufs"])
                buyers[master]["files"].extend(buyers[k]["files"])
                buyers[master]["arch"] = buyers[master]["arch"] or buyers[k]["arch"]
                del buyers[k]

# --- load prior 17 list ---
prior = []
with open(PRIOR, encoding="utf-8") as fh:
    rd = csv.DictReader(fh)
    for row in rd:
        em = (row.get("email") or "").strip().lower()
        ph = norm_phone(row.get("phone") or "")
        fn = (row.get("fn") or "").strip()
        ln = (row.get("ln") or "").strip()
        arch = is_arch([em] if em else [], "")
        prior.append({"email": em, "phone": ph, "fn": fn, "ln": ln, "arch": arch})

# --- merge into unified rows keyed by email-or-phone ---
rows = {}
def add_row(email, phone, fn, ln, st, zipc, arch):
    key = email or phone or (fn + ln)
    if not key:
        return
    rec = rows.setdefault(key, {"email": email, "phone": phone, "fn": fn, "ln": ln,
                                "st": st, "zip": zipc, "arch": arch})
    # fill blanks
    for f, v in (("email", email), ("phone", phone), ("st", st), ("zip", zipc)):
        if not rec[f] and v:
            rec[f] = v
    rec["arch"] = rec["arch"] or arch

for k, b in buyers.items():
    em = next(iter(sorted(b["emails"])), "").lower()
    ph = next(iter(sorted(b["phones"])), "")
    parts = b["name"].split()
    fn = parts[0] if parts else ""
    ln = parts[-1] if len(parts) > 1 else ""
    st = next(iter(sorted(b["ufs"])), "")
    zipc = next(iter(sorted(b["ceps"])), "").replace("-", "")
    add_row(em, ph, fn, ln, st, zipc, b["arch"])

for p in prior:
    add_row(p["email"], p["phone"], p["fn"], p["ln"], "", "", p["arch"])

# dedupe: if a phone-keyed row duplicates an email-keyed row by same phone, merge
phone_index = {}
for k, r in list(rows.items()):
    if r["phone"]:
        phone_index.setdefault(r["phone"], []).append(k)
for ph, keys in phone_index.items():
    if len(keys) > 1:
        keys = sorted(keys, key=lambda k: 0 if rows[k]["email"] else 1)
        master = keys[0]
        for k in keys[1:]:
            if k != master and k in rows:
                for f in ("email", "st", "zip"):
                    if not rows[master][f] and rows[k][f]:
                        rows[master][f] = rows[k][f]
                rows[master]["arch"] = rows[master]["arch"] or rows[k]["arch"]
                del rows[k]

allrows = list(rows.values())
end_client = [r for r in allrows if not r["arch"]]
arch = [r for r in allrows if r["arch"]]

# --- write CSV (Meta format, end-client first = the gold seed) ---
with open(OUT, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["email", "phone", "fn", "ln", "ct", "st", "zip", "country"])
    for r in end_client + arch:
        ph = ("+55" + r["phone"]) if r["phone"] else ""
        w.writerow([r["email"], ph, r["fn"], r["ln"], "", r["st"], r["zip"], "br"])

print(f"== SEED CONSOLIDADO ==")
print(f"total unico: {len(allrows)} | cliente-final: {len(end_client)} | arquiteto/especificador: {len(arch)}")
print(f"com email: {sum(1 for r in allrows if r['email'])} | com telefone: {sum(1 for r in allrows if r['phone'])}")
print(f"CSV: {OUT}")

print("\n-- CLIENTE-FINAL (seed ouro) --")
for r in sorted(end_client, key=lambda r: r['fn']):
    print(f"  {r['fn']:12} {r['ln']:10} {r['email'][:30]:30} {r['phone']:12} {r['st']:3} {r['zip']}")
print("\n-- ARQUITETO/ESPECIFICADOR (canal B2B separado / exclusao) --")
for r in sorted(arch, key=lambda r: r['fn']):
    print(f"  {r['fn']:12} {r['ln']:10} {r['email'][:30]:30} {r['phone']:12}")

# --- CEP -> affluent geo cross ---
CEP_MAP = {
    "05416": "Sao Paulo/SP (Pinheiros)", "05621": "Sao Paulo/SP (Morumbi) [NOBRE]",
    "06470": "Barueri/SP (Alphaville) [NOBRE]", "12918": "Braganca Paulista/SP [condominio belt]",
    "13288": "Vinhedo/SP [NOBRE]", "13299": "Itupeva/SP (Fazenda da Grama) [NOBRE]",
    "13310": "Itu/SP", "18030": "Sorocaba/SP", "18548": "Porto Feliz-Itu/SP",
    "22030": "Rio de Janeiro/RJ (Copacabana)", "25725": "Petropolis/RJ",
    "64051": "Teresina/PI", "88080": "Florianopolis/SC",
}
print("\n== CRUZAMENTO CEP -> GEO REAL DOS COMPRADORES ==")
seen = {}
for r in allrows:
    z = r["zip"]
    if z and len(z) >= 5:
        pref = z[:5]
        seen.setdefault(pref, CEP_MAP.get(pref, "??? (checar)"))
for pref, loc in sorted(seen.items(), key=lambda x: x[1]):
    print(f"  {pref}  ->  {loc}")
