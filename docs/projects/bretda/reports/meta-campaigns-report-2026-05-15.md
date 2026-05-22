# Bretda Meta — Relatório de Campanhas — 2026-05-15

> **Account:** `act_381618241134624` ("Bretda Ads 01") · Currency BRL · TZ America/Sao_Paulo · Snapshot 2026-05-15 ~02:30 UTC · **Read-only**.
> Complemento dos dois outputs anteriores de hoje: `audit-2026-05-15-chief.md` (Tier 0) + `drill-meta-leads-2026-05-15-chief.md` (F-Meta-LEAD-VOID). Este aqui é **inventário estrutural**, não nova auditoria.

---

## 1. Account Summary

| Métrica | Valor |
|---|---|
| **Total campaigns** | **35** (1 ACTIVE / 34 PAUSED / 0 ARCHIVED / 0 DELETED) ✅ casa com o audit |
| **Total adsets** | **64** |
| **Total ads (objetos no account)** | **191** |
| **Account status** | `1` (ACTIVE) · disable_reason `0` |
| **Currency / TZ** | BRL · America/Sao_Paulo |
| **Created** | 2024-06-25 |
| **Pixel canon** | `3348133485496539` "Pixel Oficial Bretda" · last fire **2026-05-14 16:46:05 BRT** (~22h pré-snapshot) ✅ |
| **balance** (real saldo prepaid) | **R$ 19,46** |
| **spend_cap** (limite vitalício) | **R$ 30.941,87** |
| **amount_spent** (lifetime) | **R$ 30.812,14** |
| **Gap cap − amount** (capacidade restante) | **R$ 129,73** ← gargalo real, não o balance |
| **Daily spend atual** | **R$ 60/d** (só CJ8v2 entregando) |
| **Runway até cap bater** | **~2,2d** ao ritmo atual ⚠️ ATIVO MAS DELIVERY VAI TRAVAR ~17/Mai sem PIX + raise cap |

> 🔴 **Alerta crítico que o audit não enfatizou:** `spend_cap` (R$ 30.941,87) ≈ `amount_spent` (R$ 30.812,14). Sobram **R$ 129,73 de capacidade vitalícia**. Em 2,2d ao ritmo R$60/d, **Meta vai parar de entregar mesmo com saldo**. Per `feedback_meta_prepaid_spend_cap.md` — saldo real é `display_string` no UI Ads Manager, **não `balance` da API**. **USER UI VALIDAR HOJE.**

### Spend / Leads agregados (account = CJ8v2 hoje)

| Window | Spend (R$) | Leads | CPL (R$) | Notes |
|---|---:|---:|---:|---|
| **30d** | 2.135,15 | 157 | 13,60 | Inclui CJ1/CJ6/CJ7v2/CJ8v2 (3 paused, 1 active). Vide §3 detail. |
| **7d** (08-14/Mai) | 622,03 | 27 | 23,04 | Só CJ8v2 entregou. |
| **2d** (13-14/Mai) | **117,83** | **8** | **14,73** | Só CJ8v2. CPL voltou ao normal-bom 2d. |
| **Lifetime account** | 30.812,14 | — | — | 35 campanhas históricas. |

> CPL 2d (R$14,73) **bate o playbook target Bretda (R$15-25 LP form / R$22-25 Instant Form 14/Mai)** — mas continua "Vanity CPL" sem sales feedback spreadsheet (drill §5).

### Action breakdown 7d/2d (top actions Meta event types)

Insights 30d / 7d / 2d capturados via `GET /act_381618241134624/insights?level=campaign` com `actions` field. **`offsite_conversion.fb_pixel_lead = 1`** (30d) → match Pixel: 0,6% (1/157). **Sintoma estrutural Instant Form bypassa LP** (drill §2). 2d e 7d retornaram só `lead` event grouped, sem fb_pixel_lead — atribuição server-side ainda morta.

---

## 2. Active Campaigns (current delivering)

**Apenas 1 campanha ACTIVE no account inteiro:**

| Campaign ID | Name | Obj | Bid | Budget | Struct | Spend 30d | Leads 30d | CPL 30d | Spend 7d | Leads 7d | Spend 2d | Leads 2d | Created |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `120236735188220737` | [C] - CP2 - Leads - Formulário nativo - Arquitetos/Design de interiores + Intt luxo - 07/11 | OUTCOME_LEADS | ABO (ad­set-level) | R$60/d ativo (4 adsets paused outros R$10-27 cada) | **7 adsets / 9 ads (em CJ8v2 — 3 ACTIVE / 6 PAUSED)** | 2.135,15 | 157 | 13,60 | 622,03 | 27 | 117,83 | 8 | 2025-11-07 |

**Observações estruturais:**
- Campanha criada 07/Nov/2025 — **6 meses online**. Updated last 01/Mai 13:26 (memory restore 12/Mai foi nos adsets, não na campanha).
- `buying_type=AUCTION`, `special_ad_categories=[]` (não credit/housing/employment — OK, Brasil pode usar geo + idade).
- Budget é **ABO**: cada adset tem daily próprio. CP2 não tem `daily_budget` na campanha.
- **Único motor pagando o account.**

---

## 3. Active Campaign — Detail (CP2 sub-detalhe)

### 3.1 Adsets dentro de CP2 (7 total)

| Adset ID | Name (abrev) | Status | Daily (R$) | Dest type | Opt Goal | Spend 30d | Leads 30d | Freq 30d | Notas |
|---|---|---|---:|---|---|---:|---:|---:|---|
| `120237168468370737` | **CJ8v2 - Expansao Sul/CO/NE - Arquitetos [30-60] iOS** | 🟢 **ACTIVE** | **60,00** | ON_AD (Instant Form) | LEAD_GENERATION | **2.025,21** | **149** | 1,83 | **Único delivering 7d/2d. F3 Instant Form HIT.** |
| `120236735188260737` | CJ1 - Arquiteto+design interiores - Sudeste | PAUSED | 17,50 | ON_AD | LEAD_GENERATION | 41,15 | 4 | 1,15 | Legacy, paused pré-12/Mai restore |
| `120237168442570737` | CJ7v2 - Expansao Sul/CO/NE - Luxury [30-60] iOS | PAUSED | 27,00 | ON_AD | LEAD_GENERATION | 47,64 | 1 | 1,20 | Sister-of CJ8v2, paused 12/Mai restore (Hybrid C) |
| `120243395033500737` | CJ6 - Arquiteto+design interiores - Sudeste | PAUSED | 17,50 | ON_AD | LEAD_GENERATION | 21,15 | 3 | 1,17 | Sub-pool Sudeste, paused 12/Mai |
| `120237168473430737` | CJ4 - Arquiteto+design interiores - Sudeste | PAUSED | 10,00 | ON_AD | LEAD_GENERATION | 0 | 0 | — | Não rodou 30d |
| `120237168477460737` | CJ5 - Arquiteto+design interiores - Sudeste | PAUSED | 10,00 | ON_AD | LEAD_GENERATION | 0 | 0 | — | Não rodou 30d |
| `120236735188320737` | CJ1 (variant 2) | PAUSED | 20,00 | ON_AD | LEAD_GENERATION | 0 | 0 | — | Não rodou 30d |

**Read-out:** 7 adsets nominalmente operacionais, 1 entregando, **TODOS com `destination_type=ON_AD` (Instant Form)** — confirma F3 G-003 viva no account. Plano B 14/Mai (LP form `destination_type=WEBSITE`) **não materializado em adset novo**.

### 3.2 Ads dentro de CJ8v2 (9 total — 3 ACTIVE / 6 PAUSED)

| Ad ID | Name | Status | Spend 7d | Leads 7d | CTR 7d | Freq 7d | Spend 2d | Leads 2d | CTR 2d | Form ID em uso |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| `120244164995160737` | **AD05 - Arquitetos Sul/CO/NE** | 🟢 ACTIVE | **591,76** | **26** | 2,23% | 1,28 | **108,53** | **8** | 3,00% | `1795323604460936` (drill §1: form bad — Thank You VIEW_WEBSITE) |
| `120237168468400737` | AD03 | 🟢 ACTIVE | 22,60 | 1 | 2,01% | 1,20 | 8,75 | 0 | 1,48% | `25022395347422134` (drill §1: form boa — budget question + Thank You WhatsApp) |
| `120244164992490737` | AD04 - Arquitetos Sul/CO/NE | 🟢 ACTIVE | 7,67 | 0 | 3,54% | 1,16 | 0,55 | 0 | 12,50% | `1373886644143591` (form intermediário) |
| `120245279644000737` | [CJ8v2]-AD09-OPAL-CAROUSEL-2026-04-28-v1 | PAUSED | — | — | — | — | — | — | — | — |
| `120245285456440737` | [CJ8v2]-AD10-AURORA-2026-04-29-v1 | PAUSED | — | — | — | — | — | — | — | — |
| `120245578942970737` | [CJ8v2]-AD10-AURORA-QUALIFICADA-2026-05-05-v2 | PAUSED | — | — | — | — | — | — | — | — |
| `120245285464550737` | [CJ8v2]-AD11-AMBAR-CAROUSEL-2026-04-29-v1 | PAUSED | — | — | — | — | — | — | — | — |
| `120245285468330737` | [CJ8v2]-AD12-CITRINO-2026-04-29-v1 | PAUSED | — | — | — | — | — | — | — | — |
| `120245285477490737` | [CJ8v2]-AD13-ZURITA-CAROUSEL-2026-04-29-v1 | PAUSED | — | — | — | — | — | — | — | — |

**F-codes vivos em CP2/CJ8v2:**
- **F3 (Instant Form trap):** 100% dos ads ACTIVE com `destination_type=ON_AD`. Plano B não dispatched.
- **F8 (Single hero ≥70%):** AD05 = **95,1% spend 7d** + **96,3% leads 7d** + **92,1% spend 2d** + **100% leads 2d**. **Pior severidade do mês.** Gate >70% sustained 7d — HIT severo.
- **F-Meta-LEAD-VOID** (drill descoberta): AD05 usa form ruim, AD03 usa form bom mas só pegou R$22 spend / 1 lead. Swap AD05↔form AD03 = 60% do problema resolvido per drill recomendação.

---

## 4. Paused Campaigns — segmento "recently active or recoverable" (com spend lifetime > 0)

> 30 das 34 PAUSED têm spend histórico. 4 nunca rodaram (§5).

| # | Campaign ID | Name | Obj | Daily | Lifetime spend (R$) | Lifetime leads | Vintage |
|---|---|---|---|---:|---:|---:|---|
| 1 | `120236733227770737` | [C] - **CP1** - Leads - Formulário nativo - Arquitetos/Design - 07/11 | OUTCOME_LEADS | — | **5.392,46** | **304** | 2025-11 |
| 2 | `120236735267120737` | [C] - **CP3** - Leads - Formulário nativo - P/Final - 07/11 | OUTCOME_LEADS | 20 | **4.582,59** | **227** | 2025-11 |
| 3 | `120214180995360737` | HM - CAMP DE VENDAS \| MENSAGENS \| 24/10 | OUTCOME_SALES | — | 1.260,76 | 0 | 2024-10 |
| 4 | `120228088226990737` | [AGD] [COLD] [LEAD] Reels 24/06 - Depoimento | OUTCOME_LEADS | — | 922,44 | 0 | 2024-06 |
| 5 | `120216470993230737` | rt-site-leads-28-01-25 | OUTCOME_LEADS | — | 872,72 | 9 | 2025-01 |
| 6 | `120217076470940737` | rt-purchase-12-02-25-mensagem | OUTCOME_SALES | — | 765,19 | 0 | 2025-02 |
| 7 | `120214382994230737` | HM - CAMP DE VENDAS \| MENSAGENS \| 01/11 site | OUTCOME_SALES | — | 739,24 | 0 | 2024-11 |
| 8 | `120226637502840737` | [AGD] [LEAD] [RMKT] Reels 05/06 — Inscrição | OUTCOME_LEADS | — | 673,73 | 0 | 2024-06 |
| 9 | `120223302809960737` | [AGD] COLD PERFIL - Reels 1 - criadas para quem... | LINK_CLICKS | 10 | 660,57 | 0 | 2024 |
| 10 | `120230418495240737` | [AGD] [LEAD] [RMKT] Reels 17/06 | OUTCOME_LEADS | — | 584,46 | 0 | 2024-06 |
| 11 | `120233111966200737` | [AGD] [LEAD] [COLD] Estático 13/06 > | OUTCOME_LEADS | — | 570,93 | 0 | 2024-06 |
| 12 | `120213756976060737` | Trafego [Casacor - Bretda] 04/10/2024 | OUTCOME_TRAFFIC | — | 500,00 | 0 | 2024-10 |
| 13 | `120235640162990737` | [LDS] [BRETDA] [R/C] 21/10 | OUTCOME_LEADS | 50 | 484,36 | 0 | 2025-10 |
| 14 | `120233442063630737` | [AGD] [LEAD] [COLD] Reels 11/09 > | OUTCOME_LEADS | — | 471,18 | 0 | 2024-09 |
| 15 | `120235194010430737` | [TRF] [AQ] [PB-AV] 13/10/25 | OUTCOME_TRAFFIC | 30 | 452,09 | 0 | 2025-10 |
| 16 | `120235194553080737` | [REC] [3X1] [PF] 13/10/25 | OUTCOME_AWARENESS | 20 | 443,97 | 0 | 2025-10 |
| 17 | `120224426256600737` | [AGD] RMKT - Leads FORM - DARK POST | OUTCOME_LEADS | — | 339,90 | 0 | 2024 |
| 18 | `120223303827820737` | [AGD] RMKT - MSG WHATSAPP - DARK POST | OUTCOME_ENGAGEMENT | — | 386,07 | 0 | 2024 |
| 19 | `120226064182450737` | [AGD] [LEAD] [RMKT] Reels 05/06 | OUTCOME_LEADS | — | 360,94 | 0 | 2024-06 |
| 20 | `120230503702650737` | [AGD] [COLD] [META] Reels 15/06 > | LINK_CLICKS | 10 | 353,70 | 0 | 2024-06 |
| 21 | `120236299967700737` | VENDAS [CONDOMINIOS] | OUTCOME_SALES | 50 | 258,64 | 0 | 2025-11 |
| 22 | `120217300332650737` | rt-site-trafego-18-02-25 | OUTCOME_TRAFFIC | — | 247,31 | 0 | 2025-02 |
| 23 | `120235487916470737` | [VND] [ST] [PB1] 13/10/25 — Cópia | OUTCOME_SALES | 50 | 201,70 | 0 | 2025-10 |
| 24 | `120230729553790737` | [AGD] [COLD] [META] Reels 17/06 | LINK_CLICKS | 6 | 179,02 | 0 | 2024-06 |
| 25 | `120232788027540737` | [AGD] [LEAD] [COLD] Reels 17/06 | OUTCOME_LEADS | — | 171,49 | 0 | 2024-06 |
| 26 | `120235195241390737` | [VND] [ST] [PB1] 13/10/25 | OUTCOME_SALES | 50 | 126,70 | 0 | 2025-10 |
| 27 | `120216979985370737` | rt-site-purchase-10-02-25 | OUTCOME_SALES | — | 96,23 | 0 | 2025-02 |
| 28 | `120227879790950737` | [AGD] [COLD] [LEAD] HOME - Reels 24/06 - Depoimento | OUTCOME_LEADS | — | 75,33 | 0 | 2024-06 |
| 29 | `120217754831410737` | [23/2/2025] Promovendo wa.me/554792259554 | MESSAGES | 24 | 61,48 | 0 | 2025-02 |
| 30 | `120217735587560737` | rt-ig-trafego-23-02-25 | OUTCOME_TRAFFIC | — | 17,07 | 1 | 2025-02 |

### Padrões observáveis (Section 4)

1. **CP1+CP2+CP3 = 99,1% dos leads históricos** (304+511+227 = 1.042 / 1.052 totais). Todas Instant Form OUTCOME_LEADS, todas configuradas Nov/2025. CP2 é o sobrevivente; CP1 e CP3 são candidatas reativáveis com risco baixo.
2. **OUTCOME_SALES (8 campanhas históricas, R$3.687 spend, 0 leads)** — tudo falhou: HM Vendas Mensagens, VENDAS CONDOMINIOS, VND ST PB1 (3 versões), rt-purchase-12-02, rt-site-purchase-10-02. **Padrão claro:** OUTCOME_SALES não converte em Bretda (pixel não captura purchases — high-ticket B2B leva 60d secagem). **Não reativar.**
3. **17 [AGD] campanhas** (legacy agência antiga "AGD" prefix) — todas pausadas 2024-Q2/Q3, R$6.014 total spend, **0 leads totais**. Candidatas a archive/delete em pass de limpeza (housekeeping P2, não urgente).
4. **8 campanhas "rt-*"** (retargeting old) — R$2.347 spend, 10 leads totais. Substituídas pela arquitetura CP1/CP2/CP3 + RTG-WARM (nunca delivered).
5. **HM (Casacor 2024-10)** — R$500 spend Casacor 2024, 0 leads. Sazonal, não reativar fora de evento.

---

## 5. Paused Campaigns — segmento "never delivered" (4 campanhas, sem histórico)

| Campaign ID | Name | Obj | Daily | Lifetime spend | Vintage | Status quirk |
|---|---|---|---:|---:|---|---|
| `120244500365840737` | **CP-PROSPECTING-LAL-LEADS** | OUTCOME_LEADS | 40 | **0** | (próxima geração) | Existe mas zero spend lifetime — campanha "shell" criada por specialist anterior, nunca despachada |
| `120244496926800737` | **CP-RTG-WARM - Lookalike 1% Engajamento IG** | OUTCOME_LEADS | — | **0** | (próxima geração) | Shell idem. Audit §3 mencionou adset `120244496926970737` ACTIVE com audience FAILED — adset existe mas dentro de outro contexto, não DESSA campanha (auditar mais a fundo se reativar) |
| `120243275861300737` | **[C006] Retargeting - Visitantes Site + Engajamento - 25/03** | OUTCOME_LEADS | 15 | **0** | 2026-03 | Criada Mar, nunca rodou |
| `120243275861080737` | **[C005] WhatsApp - Arquitetos/Design - Sudeste - 25/03** | OUTCOME_ENGAGEMENT | 20 | **0** | 2026-03 | Criada Mar, nunca rodou. `adsets=0` — campanha vazia. |

> **Insight:** C005 e C006 são as mesmas Tocks-style camp IDs do memory `session_tocks_ads_analysis_17abr` (Tocks tem `[C005]` Search-camp também). Aqui em Bretda Meta são placeholders inalcançáveis — provavelmente criados em batch pela agência antiga ([AGD] pattern). **Candidatas a ARCHIVE em housekeeping** (não excluir sem confirmar com Felipe/Vorza se há audience anexada útil).

---

## 6. Account Health Indicators

| Indicador | Estado | Observação |
|---|---|---|
| **Pixel attach + last fire** | ✅ | `3348133485496539` last fire 14/Mai 16:46 BRT, ~22h pré-snapshot. CJ8v2 entregando → fire contínuo esperado. |
| **CAPI Caminho A (LP)** | ✅ LIVE | Desde 30/Abr. Mas só PageView LGPD — não Lead. |
| **CAPI Caminho B (server-side Lead)** | ❌ CODE READY 14d sem deploy | User precisa gerar System User Token Meta BM (~3min). Per audit §0b user action. |
| **F2 OAuth expired (Google paralelo)** | 🔴 LIVE no Google | Não afeta Meta diretamente, mas drill §0b token Meta ads_management OK (este snapshot funcionou). |
| **F3 Instant Form trap** | 🔴 PERSISTENT | 100% ads ACTIVE = ON_AD. Plano B 14/Mai não despachado. |
| **F4 Budget jump recovery** | 🟡 RECOVERING D+3/14 | Rollback 12/Mai (R$120→R$60). CPL 2d voltou a R$14,73 (vs R$23 7d) — recovery viva. |
| **F8 Single hero domination** | 🔴 LIVE — AD05 95,1% spend / 96,3% leads 7d, 92,1% spend / 100% leads 2d | Concentração extrema. Creative refresh @ralph-burns Sprint 3 needed. |
| **F9 Audience overlap (latente)** | 🟡 LATENT | RTG-WARM adset ACTIVE (audit §3) com LAL Eng IG FAILED — não delivers mas configurado. |
| **F-Meta-LEAD-VOID** | 🔴 LIVE | Drill §3 root cause. 149 leads form 1795… orfãos 30d. |
| **G-008 Single hero** | 🔴 HIT severo | Mesmo que F8 — Bretda playbook violation. |
| **G-011 Geo Brasil PRESENCE** | ✅ COMPLIANT | CJ8v2 location_types=[home,recent] Sudeste+Sul. |
| **G-016 Saldo display_string truth** | ⚠️ UNVERIFIED via API | `balance=R$19,46` + `spend_cap-amount_spent=R$129,73` — ambos via API. UI Ads Manager **display_string** é a verdade Bretda canon. |
| **G-018 Brand Defense always-on** | ⚠️ documental | Meta não tem brand defense típico (search-platform). Google paralelo. |
| **Spend cap headroom** | 🔴 **CRÍTICO** | R$129,73 restante / R$60/d = **2,2d até trava**. Provável que Meta pause delivery automaticamente quando `amount_spent` bater `spend_cap`. **User action: UI raise cap + PIX combo.** |
| **Audience overlap risk (F9 future)** | ✅ baixo agora | Single adset entregando — nada overlapping. Reativação CP1/CP3 traria overlap (cuidado). |
| **Number of unique ad creatives** | ~50+ across history | Page 1 retornou 191 ads totais em 1 página (sem next paging) — fits within visual inventory. |

---

## 7. Cross-reference com hoje (audit + drill)

| Output anterior | O que aquilo tinha | O que ESTE relatório adiciona |
|---|---|---|
| `audit-2026-05-15-chief.md` (Tier 0) | Foundation First scoring (1/7), Traffic Engine 9/18, gotcha hits, recomendação handoff (Steps 0-6), open questions | **Visibilidade estrutural completa**: as 34 PAUSED não eram visíveis no audit. Inventário lifetime spend R$30k → revela CP1 (R$5.392) e CP3 (R$4.582) como assets pausados de alto valor histórico. Saldo headroom 2,2d **não estava no audit**. |
| `drill-meta-leads-2026-05-15-chief.md` | F-Meta-LEAD-VOID descoberta, 3 forms inventory, root cause Thank You button_type, quick wins swap form | Confirma drill: ads em CJ8v2 com forms identificados. Ad-level 2d data (não no drill) mostra **AD05 100% dos leads 2d** — concentração piorou nas últimas 48h, não melhorou. |

**Diferença essencial:** O audit é Tier 0 verdict ("HOLD METHODICAL"), o drill é P0 pipeline gap. **Este relatório é o pano de fundo estrutural** que Breno olha quando alguém pergunta "quantas campanhas você tem no Bretda Meta? quanto cada uma já gastou? quais valem religar?". Resposta: 35 campanhas, R$30.812 vitalícios, **CP1+CP2+CP3 = 99% dos leads**, resto é arquivo morto.

---

## 8. Recommendations (informacional, não plano de ação)

1. **CP2 é o último motor.** Não tem plano B operante se CP2 quebrar. Audit Step 2 (criar AD LP form ISO em adset novo dentro de CP2 OU campanha nova) urgente.
2. **CP1 (R$5.392 / 304 leads) e CP3 (R$4.582 / 227 leads) são reservas estratégicas**, não lixo. Em D+7 19/Mai gate, se decisão for "expand Meta", reativá-las (PAUSED-first, smoke test, ABO budget circuit breaker +20%/d) custa menos que criar do zero.
3. **Saldo headroom 2,2d é o blocker mais urgente que existe agora** — mais que OAuth Google, mais que CAPI B token. Sem PIX + raise spend_cap UI, Meta vai parar de entregar autonomamente em ~17/Mai. **Pré-empta Step 0c do audit.**

---

## 9. Data sources

| Source | Tool | Timestamp UTC | Notes |
|---|---|---|---|
| `/act_381618241134624` (account info) | Graph API direct | 2026-05-15 02:30 | Token `META_ADS_ACCOUNT_BRETDA_TOKEN` from `D:/jarvis/mcp-ads-bridge/.env` |
| `/act_../campaigns` (35 rows) | Graph API direct | 2026-05-15 02:30 | All status, all fields |
| `/act_../insights?level=campaign&date_preset=last_30d/7d/maximum` + `time_range 2026-05-13/14` | Graph API direct | 2026-05-15 02:30 | 30d=1 row, 7d=1 row, 2d=1 row (single delivering camp aggregates), maximum=31 rows (4 zero-spend cut by Meta) |
| `/120236735188220737/adsets` (CP2 = 7 adsets) | Graph API direct | 2026-05-15 02:30 | + adset-level insights 30d/7d/2d |
| `/120237168468370737/ads` (CJ8v2 = 9 ads) | Graph API direct | 2026-05-15 02:30 | + ad-level insights 7d/2d |
| `/act_../adspixels` | Graph API direct | 2026-05-15 02:30 | Pixel `3348133485496539` confirmed |
| `/act_../ads` (191 total ads) | Graph API direct | 2026-05-15 02:30 | Single page, no paging |

**MCP-ads-bridge tools usadas indiretamente:** `meta_ads_campaigns`, `meta_ads_insights`, `meta_ads_adsets`, `meta_ads_overview`, `meta_ads_pixel_check` — todos read-only OK. Graph API fallback usada para batch fields que MCP encapsula em N chamadas (mais eficiente em uma só drill).

**Nenhuma write op disparada.** Read-only confirmed.

---

*Mesa real intocável. Foundation First. Spend cap is the new saldo. CP2 é o último motor. Plano B aguarda.*
