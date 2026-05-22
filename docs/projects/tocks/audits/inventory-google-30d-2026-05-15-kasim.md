# Tocks Google Ads — Inventory 30d — Kasim — 2026-05-15

**Account:** `8146675397` (Tocks, MCC `7943699417`)
**OAuth:** LIVE pós-reauth 15/Mai (`contato@tockscustom.com.br`)
**Specialist:** @kasim-aslam (Tier 1 Google)
**Inventory script:** `D:\jarvis\mcp-ads-bridge\tocks-google-15mai-inventory.cjs`
**Inventory JSON:** `D:\jarvis\mcp-ads-bridge\data\tocks-google-15mai-inventory.json`

---

## State summary

| Status | Count |
|---|---|
| ENABLED | **1** |
| PAUSED | 16 |
| REMOVED | 1 |
| **TOTAL** | **18** |

**Account budget remaining:** R$969.95 (spending_limit R$22,703 served R$21,894.62) → **runway ~13d** ao current burn R$75/d.

---

## CANON (1)

| ID | Name | Status | 30d Spend | 30d Conv | 7d Spend | 7d Conv | SIS | SIS Lost (rank) |
|---|---|---|---|---|---|---|---|---|
| `23703520246` | **TOCKS_Search_Alta-Intencao** | ENABLED | R$1,534.02 | 49 | R$213.07 | **0** | 0.0999 | 0.7943 |

**Bidding:** `Maximize_Conversions` (`bidding_strategy_type=10`)
**Budget:** R$75/d
**Lifetime:** R$1,906.74 / 211 conv (mostly Visualização de página fake — see Conv chaos)

### Ad groups (focus)

| AG ID | Name | Status | CPC bid |
|---|---|---|---|
| 197860071827 | 01 - Compra Direta | ENABLED | R$4 |
| 197861050547 | 02 - Premium Artesanal | ENABLED | R$4 |
| 194892667676 | 03 - Marca Tocks | ENABLED | R$2 |
| 195505567875 | 04 - Mesa Jantar Bilhar 2em1 | ENABLED | R$4 |

> Note Maximize_Conversions ignores `cpc_bid_micros` floor — Smart Bidding controls. Manual cpc_bid not the lever right now. After 21d Smart Bidding reset (post conv demote), evaluate manual CPC fallback if SIS doesn't recover.

---

## LIXO (11) — RECOMMEND ARCHIVE

PAUSED + zero conv lifetime OR PMAX/Shopping non-canon. All can be safely set to REMOVED — no historical analytical loss.

| ID | Name | Status | Lifetime Spend | Lifetime Conv | Channel | Reason |
|---|---|---|---|---|---|---|
| 23270645251 | PESQUISA - 14/11 | PAUSED | R$1,978.45 | 0 | SEARCH | Burned R$1978 zero conv |
| 23174865736 | P-MAX _22_10 | PAUSED | R$1,912.08 | 0 | PMAX | Burned R$1912 zero conv |
| 23098386371 | [ORN] Shopping Padrão | PAUSED | R$495.24 | 0 | SHOPPING | Burned R$495 zero conv + veto |
| 23097456893 | [ORN] Search | PAUSED | R$1,789.59 | 0 | SEARCH | Burned R$1789 zero conv |
| 22781039655 | [CONV] [TOCKS - SINUCA] 12.07 | PAUSED | R$1,000.49 | 0 | SEARCH | Burned R$1000 zero conv |
| 22753167811 | [EB] Shopping 2 | PAUSED | R$0 | 0 | SHOPPING | Shell/draft |
| 22746719673 | [EB] Shopping Padrão | PAUSED | R$0 | 0 | SHOPPING | Shell/draft |
| 22745574150 | Performance Max Shopping | PAUSED | R$0 | 0 | PMAX | Shell/draft |
| 22743215034 | [EB] PMAX Tocks | PAUSED | R$0 | 0 | PMAX | Shell/draft |
| 22739773366 | [EB] Shoping | PAUSED | R$161.48 | 0 | SHOPPING | Burned zero conv + veto |
| 22715195913 | [EB] Merchant Center Tocks | PAUSED | R$41.52 | 0 | PMAX | Shell/draft |

**Total LIXO burn lifetime:** R$7,378.85 com **ZERO conversões** = a história do que NÃO funcionou para Tocks (Shopping/PMAX/old Search). Pattern: Tocks high-ticket NÃO converte Purchase event (consistent com `feedback_no_shopping_bretda_tocks`).

---

## RESERVA (5) — KEEP PAUSED

| ID | Name | Status | Lifetime Spend | Lifetime Conv | Channel |
|---|---|---|---|---|---|
| 23743031426 | TOCKS_Shopping_Mesas_Artesanais | PAUSED | R$280.91 | 1 | SHOPPING |
| 23652946232 | [00-CLICK] [PMAX] - LEADS 01/04 | PAUSED | R$1,522.36 | 45.65 | PMAX |
| 23261461677 | SHOPPING - 14/11 | PAUSED | R$4,400.47 | 1 | SHOPPING |
| 23261417670 | P-MAX _14/11 | PAUSED | R$5,717.82 | 202.35 | PMAX |
| 22670752984 | [EB] - PMAX | PAUSED | R$811.66 | 0.05 | PMAX |

Patrimônio histórico (lifetime R$12.7k spend, mostly Visualização fake conv) — manter PAUSED para audit lineage. Não archive até validar Shopping veto seguir definitivo.

---

## CONVERSION ACTIONS — G-013 CHAOS

**8 PRIMARY** detected (canon max 2). The "traidor" #1 is `Visualização de página` PRIMARY firing 631×/30d turning every pageview into "conversion" — Smart Bidding optimizing pageviews instead of WhatsApp clicks.

### Current state (10 ENABLED)

| ID | Name | Status | Type | Default Value | Verdict |
|---|---|---|---|---|---|
| 7161904202 | Compras Loja Tray Tocks | SECONDARY | 8 | R$1 | ok |
| 7224690183 | Android installs | SECONDARY | 25 | R$0 | ok |
| 7347581492 | Local actions - Website visits | **PRIMARY** | 28 | R$1 | **DEMOTE** |
| **7382426793** | **[LEAD] COMPRA WHATSAPP SITE** | **PRIMARY** | 8 | R$1 | **KEEP** |
| 7399079937 | Clicks to call | **PRIMARY** | 28 | R$1 | **DEMOTE** |
| 7540631962 | WhatsApp - CLICK | **PRIMARY** | 8 | R$0 | **DEMOTE** |
| 7540631965 | Adicionar carrinho - CLICK | **PRIMARY** | 8 | R$1 | **DEMOTE** |
| 7540631968 | Iniciar finalização - CLICK | **PRIMARY** | 8 | R$0 | **DEMOTE** |
| 7540774791 | Visualização de página - CLICK | **PRIMARY** | 8 | R$0 | **DEMOTE (the traitor)** |
| **7550396040** | **Lead Qualificado Tocks** | **PRIMARY** | 7 | **R$13,000** | **KEEP** (Sales AI CRM bridge target) |

### After fix (2 PRIMARY, 8 SECONDARY)

- PRIMARY: `[LEAD] COMPRA WHATSAPP SITE` (R$1) + `Lead Qualificado Tocks` (R$13,000)
- SECONDARY: rest (still tracked, but NOT bidding signal)

**Expected effect:** 21d Smart Bidding reset window. SIS recovers if WA-click + Lead Qualificado fire consistently. Risk: 7-21d learning limbo (per audit hoje cedo P1-1 warning).

---

## 30d performance flags

| Flag | Value | Severity |
|---|---|---|
| **SIS Lost-Rank** | **0.7943 (79.4%)** | HIGH — sub-bidding chronic |
| **SIS** | 0.0999 (9.99%) | HIGH — capturing only 10% available impressions |
| **7d Conv ZERO** | 0 conv last 7d (vs 49 last 30d) | **CRITICAL** — Smart Bidding crashed |
| 7d Spend trend | R$30.4/d avg (vs R$75 budget) | MEDIUM — under-delivery, budget not exhausted |

**Interpretation:** Smart Bidding lost trust in the conv signals during last 7d — possibly because Visualização de página fires fired so much that Smart Bidding "learned" pageview = success, then auction competition raised, lost ranks. Demote should reset.

---

## Recommended writes (saga executed hoje)

### Phase 1 — Conv hierarchy fix (6 writes)
1. `conv 7347581492 Local actions` PRIMARY → SECONDARY
2. `conv 7399079937 Clicks to call` PRIMARY → SECONDARY
3. `conv 7540631962 WhatsApp-CLICK` PRIMARY → SECONDARY
4. `conv 7540631965 Adicionar carrinho` PRIMARY → SECONDARY
5. `conv 7540631968 Iniciar finalização` PRIMARY → SECONDARY
6. `conv 7540774791 Visualização de página` PRIMARY → SECONDARY ← **THE TRAITOR**

### Phase 2 — LIXO archive (11 writes)
PAUSED + zero conv lifetime → REMOVED. Idempotency keys persisted in saga log.

### Skipped / out-of-scope
- ❌ Bid raise (Smart Bidding controls, bids cosmetic)
- ❌ Shopping/PMAX new (vetoed `feedback_no_shopping_bretda_tocks`)
- ❌ Sales AI offline conv upload bridge fix (HANDOFF @aios-dev, per audit hoje cedo P1-3)
- ❌ Brand-Defense create (not on radar yet, exists ad group "Marca Tocks" inside TOCKS_Search_Alta-Intencao)

---

## Cross-references

- Audit spike investigation: `D:\AIOS\docs\projects\tocks\audits\audit-spike-2026-05-15-chief.md`
- Saga log: `D:\jarvis\mcp-ads-bridge\data\tocks-15mai-operacao-saga.json`
- F-codes hit: G-013 (CONV-CHAOS), F4 (SIS Lost-Rank 79%), F-Smart-Bidding-Wrong-Signal, F-CRM-UPLOAD-VOID

---

*Kasim: 8 PRIMARY → 2 PRIMARY. Mata o pageview falso. Reabre o caminho. Espera 21d.*
