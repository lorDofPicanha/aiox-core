# -*- coding: utf-8 -*-
import os, json, sys, re
SRC = sys.argv[1]
with open(os.path.join(SRC, "_dump.json"), encoding="utf-8") as fh:
    data = json.load(fh)
pp = [r for r in data if r["kind"] == "PROPOSTA"]
for r in pp:
    snippet = re.sub(r"\s+", " ", r["text"])[:280]
    print(f"--- {r['file']} | chars={r['chars']} | email={len(r['emails'])} tel={len(r['phones'])}")
    print(f"    {snippet}")
