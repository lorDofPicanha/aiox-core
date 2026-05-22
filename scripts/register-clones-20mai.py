#!/usr/bin/env python3
"""Registra os 2 novos mind clones no jarvis-mind-clone-index.json, preservando estilo."""
import json, re, os

IDX = r"D:\AIOS\.aios-core\data\jarvis-mind-clone-index.json"
AGENTS = r"D:\AIOS\.aios-core\development\agents"

raw = open(IDX, encoding="utf-8").read()
ensure_ascii = bool(re.search(r"\\u00", raw))   # detecta se original usa escapes
data = json.loads(raw)

existing = {e.get("id") for e in data}

new = [
    {
        "id": "marcal-justen-filho",
        "name": "marcal-justen-filho",
        "department": "aios-agent",
        "source": "aios-agent",
        "role": "Doutrina em Direito Administrativo - Licitacoes e Contratos (Lei 14.133/2021)",
        "keywords": [
            "licitacao", "lei 14.133", "lei 8.666", "pregao eletronico", "edital",
            "habilitacao", "habilitacao juridica", "habilitacao fiscal", "habilitacao tecnica",
            "atestado de capacidade tecnica", "dispensa eletronica", "recurso administrativo",
            "inabilitacao", "modalidade", "concorrencia", "direito administrativo",
            "contratos administrativos", "me/epp", "isonomia", "vinculacao ao edital",
            "julgamento objetivo", "proporcionalidade", "formalismo", "pncp", "compliance"
        ],
        "frameworks": [],
        "commands": [],
        "filePath": os.path.join(AGENTS, "marcal-justen-filho.md"),
    },
    {
        "id": "pablo-hoffman",
        "name": "pablo-hoffman",
        "department": "aios-agent",
        "source": "aios-agent",
        "role": "Senior Web Crawling Engineering - Resilient, Ethical Scraping at Scale",
        "keywords": [
            "scraping", "web scraping", "crawler", "scrapy", "spider", "middleware",
            "item pipeline", "throttling", "autothrottle", "politeness", "robots.txt",
            "anti-bot", "playwright", "splash", "ingestion", "crawl frontier",
            "broad crawl", "breakage", "resilience", "scraping ethics", "data extraction",
            "selectors", "rate limit", "idempotency", "pncp", "portal scraping"
        ],
        "frameworks": [],
        "commands": [],
        "filePath": os.path.join(AGENTS, "pablo-hoffman.md"),
    },
]

added = []
for e in new:
    if e["id"] in existing:
        print("JA EXISTE, pulando:", e["id"])
        continue
    data.append(e)
    added.append(e["id"])

with open(IDX, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=ensure_ascii, indent=2)
    f.write("\n")

print(f"ensure_ascii={ensure_ascii} | total agora: {len(data)} | adicionados: {added}")
