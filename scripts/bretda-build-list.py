# -*- coding: utf-8 -*-
"""Build deduped buyer records from the extraction dump; flag empty/image files."""
import os, re, json, sys, csv

SRC = sys.argv[1]
with open(os.path.join(SRC, "_dump.json"), encoding="utf-8") as fh:
    data = json.load(fh)

def first_last(filename):
    # OC AURORA - RAMIRO SP.pdf  ->  RAMIRO
    base = os.path.splitext(filename)[0]
    if " - " in base:
        person = base.split(" - ", 1)[1]
    else:
        person = base.replace("OC", "").replace("PROPOSTA", "").strip()
    # strip trailing UF and role tags
    person = re.sub(r"\b(SP|RJ|RS|SC|PR|MS|MG|GO|DF|PI|BA|CE)\b", "", person)
    person = re.sub(r"\b(ARQ|INT|RJ|SP)\b", "", person)
    person = person.replace(".", "").strip()
    return person

oc = [r for r in data if r["kind"] == "OC"]

# image/empty OC candidates (need OCR or manual)
print("== OC SEM CONTATO (candidatos a OCR/manual) ==")
for r in oc:
    if not r["emails"] and not r["phones"]:
        print(f"  [{r['chars']:>5} chars] {r['file']}  ufs={r['ufs']} cnpj={r['cnpjs']} cep={r['ceps']}")

# Build buyer records keyed by person name (merge docx+pdf dups + same client)
buyers = {}
for r in oc:
    person = first_last(r["file"])
    key = person.upper()
    b = buyers.setdefault(key, {"name": person, "emails": set(), "phones": set(),
                                "ceps": set(), "ufs": set(), "files": []})
    b["emails"].update(r["emails"])
    b["phones"].update(r["phones"])
    b["ceps"].update(r["ceps"])
    b["ufs"].update(r["ufs"])
    b["files"].append(r["file"])

print(f"\n== COMPRADORES UNICOS (por nome): {len(buyers)} ==")
print(f"{'NAME':22} {'EMAIL':28} {'TEL':12} {'UF':4} {'CEP':10} FILES")
with_contact = 0
for k, b in sorted(buyers.items()):
    em = next(iter(b["emails"]), "")
    ph = next(iter(b["phones"]), "")
    uf = ",".join(sorted(b["ufs"])) or ""
    cep = next(iter(b["ceps"]), "")
    if b["emails"] or b["phones"]:
        with_contact += 1
    print(f"{b['name'][:22]:22} {em[:28]:28} {ph:12} {uf:4} {cep:10} {len(b['files'])}")

print(f"\ncompradores unicos COM contato (email ou tel): {with_contact}")

# Write Meta-format CSV (one row per buyer, multi-field)
out_csv = os.path.join(SRC, "_compradores-bretda-META.csv")
with open(out_csv, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["email", "phone", "fn", "ln", "st", "zip", "country"])
    for k, b in sorted(buyers.items()):
        if not (b["emails"] or b["phones"]):
            continue
        parts = b["name"].split()
        fn = parts[0] if parts else ""
        ln = parts[-1] if len(parts) > 1 else ""
        em = next(iter(b["emails"]), "")
        ph = next(iter(b["phones"]), "")
        ph = ("55" + ph) if ph else ""
        uf = next(iter(sorted(b["ufs"])), "")
        cep = next(iter(b["ceps"]), "").replace("-", "")
        w.writerow([em, ph, fn, ln, uf, cep, "BR"])
print(f"\nCSV escrito: {out_csv}")
