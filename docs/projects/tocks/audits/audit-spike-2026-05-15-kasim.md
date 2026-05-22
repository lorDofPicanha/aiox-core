# Tocks Audit — Spike Forensics — 2026-05-15 (Kasim Aslam)

Read-only audit. Specialist: @kasim-aslam (Google authority) + co-pilot data on Meta side.
Account: Google Ads `8146675397` MCC `7943699417` + Meta `act_1221671265457624`.

---

## 1. OAuth + connection

- Google Ads: LIVE pós-reauth 15/Mai (`contato@tockscustom.com.br`) — `searchStream` 200 OK
- Meta Ads: Token Tocks (compartilhado com Bretda BM) ACEITO, `act_1221671265457624` OK
- Pixel Meta: `1382948639707224` "Pixel [tockscustom.com.br] - [OFICIAL]" last fired **14/Mai 19:48 BRT** — pixel ALIVE.

---

## 2. Google Ads inventory

**17 campanhas total** (1 ENABLED + 16 PAUSED):

| ID | Name | Status | Type | Budget |
|----|------|--------|------|--------|
| **23703520246** | **TOCKS_Search_Alta-Intencao** | **ENABLED** | SEARCH | **R$75/d** |
| 23743031426 | TOCKS_Shopping_Mesas_Artesanais | PAUSED | SHOPPING | R$20/d |
| 23652946232 | [00-CLICK] [PMAX] - LEADS 01/04 | PAUSED | PMAX | R$20/d |
| 23270645251 | PESQUISA - 14/11 | PAUSED | SEARCH | R$28/d |
| 23261461677 | SHOPPING - 14/11 | PAUSED | SHOPPING | R$37.89/d |
| 23261417670 | P-MAX _14/11 | PAUSED | PMAX | R$66/d |
| (legacy [EB], [ORN], TESTE, P-MAX_22_10, etc.) | 11 mais | PAUSED | | |

**Single ENABLED:** Search Alta-Intencao R$75/d (consome 84% spend 30d).

### 30/7/14d Overview
| Window | Spend | Impr | Clicks | Conv | Conv_value | Avg CPC |
|--------|-------|------|--------|------|-----------|---------|
| 30d | R$1,815 | 42,810 | 719 | **50** | R$0 | R$2.52 |
| 14d | R$554 | 1,958 | 139 | **0** | R$0 | R$3.99 |
| 7d  | R$213 | 652 | 39 | **0** | R$0 | R$5.46 |

**Spike Google 30d (daily):**
- 23/Abr R$346 — anomaly (Brand fluct, 6025 impr — KW broad burned)
- 22/Abr R$230
- 04/Mai R$150
- Avg ~R$60/d
- **47 conversions in 15/Abr** com só R$70 spend → **conversion burst data anomaly** (likely upload backfill or test fires)

**No real spend spike on Google.** Spike narrative is Meta-side.

### Conv actions state (10 ENABLED, **8 PRIMARY** — F-Google-CONV-CHAOS)

| ID | Name | Cat | Type | Primary | always_default | default_value | 30d conv |
|----|------|-----|------|---------|---------------|---------------|----------|
| 7161904202 | Compras Loja Tray Tocks | PURCHASE | WEBPAGE | **false** | false | 1 | 0 |
| 7224690183 | Android installs | DOWNLOAD | ANDROID | false | true | 0 | 0 |
| 7347581492 | Local actions - Website visits | PAGE_VIEW | GOOGLE_HOSTED | **true** | true | 1 | 6 all-conv |
| 7382426793 | **[LEAD] COMPRA WHATSAPP SITE** | **OUTBOUND_CLICK** | WEBPAGE | **true** | false | 1 | **1** |
| 7399079937 | Clicks to call | CONTACT | GOOGLE_HOSTED | true | true | 1 | 3 all-conv |
| 7540631962 | WhatsApp - CLICK | CONTACT | WEBPAGE | true | true | 0 | 1 all-conv |
| 7540631965 | Adicionar ao carrinho - CLICK | ADD_TO_CART | WEBPAGE | true | false | 1 | 0 |
| 7540631968 | Iniciar finalização de compra - CLICK | BEGIN_CHECKOUT | WEBPAGE | true | true | 0 | 0 |
| **7540774791** | **Visualização de página - CLICK** | **PAGE_VIEW** | WEBPAGE | **true** | **true** | **0** | **631 all-conv / 49 conv** |
| 7550396040 | Lead Qualificado Tocks | SUBMIT_LEAD_FORM | UPLOAD_CLICKS | true | false | **13000** | 0 (upload never done) |

**G-013 SEVERE — 8 PRIMARY conv actions.** Canon = 2 max.

**Smoking gun #1:** `Visualização de página - CLICK` (id 7540774791) — PAGE_VIEW WEBPAGE PRIMARY firing **631 all_conv / 49 conv** em 30d. **This is what Smart Bidding "TOCKS_Search_Alta-Intencao" otimiza para.** Não é lead — é pageview tagged as conversion.

**Smoking gun #2:** `[LEAD] COMPRA WHATSAPP SITE` (id 7382426793) — REAL WhatsApp click — only **1 conv em 30d**. The PRIMARY signal Smart Bidding should optimize is starving (1/30d). 

**Smoking gun #3:** `Lead Qualificado Tocks` (UPLOAD_CLICKS, R$13k default_value) — 0 conv since creation. **CRM not uploading offline conversions.** Sales AI deployed 05/Mai but CRM bridge NÃO está alimentando `Lead Qualificado Tocks`. This is the conv action that should carry close_rate/AOV truth.

### Search terms 14d (top 8 by cost)

| Term | KW | Cost | Conv | Verdict |
|------|----|------|------|---------|
| casa do bilhar teixeira | loja mesa de sinuca | R$49.23 | 0 | **G-018 reverse — competitor brand** |
| mesa de sinuca e jantar | mesa de sinuca e jantar | R$33.75 | 0 | OK relevant |
| venda de mesa de sinuca | venda de mesa de sinuca | R$28.22 | 0 | OK |
| mesa de sinuca 2 20 x 1 20 | mesa de bilhar preco | R$25.13 | 0 | medida específica |
| venda mesa de sinuca | mesa de sinuca venda | R$22.95 | 0 | OK |
| mesa de sinuca | loja mesa de sinuca | R$18.94 | 0 | **broad, low-intent** |
| bilhares palacio curitiba | onde comprar mesa de bilhar | R$17.00 | 0 | **competitor brand** |
| bilhar sena uberlandia | loja mesa de bilhar | R$11.14 | 0 | **competitor brand** |

**~R$77 / 14d (14%) wasted on competitor brand searches** (Bilhares Palácio, Casa do Bilhar Teixeira, Bilhar Sena). Negative kw missing.

**SIS metric 0.0999** = 10% Search Impression Share. **90% Lost-Rank** (per memory `session_tocks_oauth_google_status_22abr.md`). Quality issue, not budget cap (camp daily R$75 spending only R$60-R$150/d real).

---

## 3. Meta Ads inventory + spike

**Active campaigns (3):**
| ID | Name | Status | Objective | Budget |
|----|------|--------|-----------|--------|
| 120248300177020230 | [C007] [CSD] — [WHATSAPP] — Sinuca Premium V+E | **ACTIVE** | OUTCOME_ENGAGEMENT | adset-level |
| 120245795233250230 | [C005] [CSD] - [WHATSAPP] [25.03.26] | **ACTIVE** | OUTCOME_ENGAGEMENT | R$95/d camp |
| 120245795709980230 | [C006] [RTG] - [WHATSAPP] [25.03.26] | **PAUSED** (12/Mai per memory) | OUTCOME_ENGAGEMENT | R$15/d camp |

**Active adsets under active camps (3):**
1. **C007 "Premium Luxo SS"** R$60/d — Sudeste+Sul, 30-65y, *Art Collecting / Architecture & Interior Design / Bens de luxo (varejo) / Mídia de arquitetura* — nicho premium
2. **C005 "01 Cidades Selecionadas"** budget shared — 9 estados Sudeste+Sul+CO, 25-60y, *Design de interiores / Arquitetura moderna / Mobília moderna*
3. **C005 "02 Nordeste Capitais"** budget shared — 9 cidades NE, 25-60y, same interests

### 30/14/7d Overview Meta

| Window | Spend | Impr | Reach | Clicks | Freq | CTR | CPC | msg_started | first_reply | depth_5 |
|--------|-------|------|-------|--------|------|-----|-----|-------------|-------------|---------|
| 30d | R$3,124 | 105,775 | 55,002 | 2,410 | 1.92 | 2.28% | R$1.30 | **276** | 260 | 259 |
| 14d | R$1,645 | 58,812 | 35,726 | 1,322 | 1.65 | 2.25% | R$1.24 | **150** | 141 | 138 |
| 7d  | R$586 | 18,218 | 13,556 | 371 | 1.34 | 2.04% | R$1.58 | **42** | 38 | 33 |

### Daily Meta 30d — spike candidates for "21 leads em UM dia":

| Date | Spend | msg_started | first_reply | link_click | Notes |
|------|-------|-------------|-------------|-----------|-------|
| 13/Mai | **R$269** | 19 | 18 | 79 | **HIGHEST SPEND day** |
| 07/Mai | R$235 | 20 | 20 | 115 | 2nd highest, 115 clicks insane |
| **03/Mai** | R$180 | **30** | **28** | 80 | **HIGHEST CONV** (Sales AI debut + 2d) |
| 02/Mai | R$169 | 18 | 17 | 92 | |
| **01/Mai** | R$194 | **22** | **22** | 98 | **Closest match "21 leads"** |
| 24/Abr | R$167 | 12 | 12 | 37 | |
| 04/Mai | R$154 | 8 | 7 | 64 | |
| 08/Mai | R$146 | 8 | 7 | 54 | |
| 14/Mai | R$157 | 13 | 11 | 51 | yesterday |

**Spike day identified — most likely 01/Mai (22 leads = "21" rounded) or 03/Mai (30 leads = "~21+").**

**Spike day cost breakdown for 01/Mai (most likely "21 leds"):**
- Spend: **R$194.43**
- msg_started: 22 (matches user's "21" within rounding)
- first_reply: 22 (Sales AI bot likely auto-replying inflates this number)
- link_click: 98 (98 - 22 = 76 cliques que não viraram conv started — **77% click→msg drop**)
- Cost per msg_started: R$8.84
- Cost per first_reply: R$8.84

**The "5 que responderam"** (per Breno) = humans who engaged past Sales AI auto-saudação. **17 dos 22 "conv started" = bot quotes mas leads sumiram.** Pattern: 22 leads → ~5 humanos qualificados (23%). Compatible com luxury high-ticket WhatsApp behavior + lurkers + curiosos.

### Per-ad 7d (top by spend)

| Ad | Camp | Spend | Impr | Freq | CTR | CPC | link_clicks | msg_started | first_reply | depth_5 |
|----|------|-------|------|------|-----|-----|-------------|-------------|-------------|---------|
| **[VRT-CLS] Linhas — V** | C007 | R$214.50 | 9,334 | 1.34 | 2.11% | R$1.09 | **115** | 17 | 15 | 5 |
| **[COPY-v2] Tenro Luxo - SS** | C005 | R$194.05 | 4,667 | 1.30 | 2.14% | R$1.94 | 45 | 17 | 15 | **27** |
| [COPY-v2] Generica PAS - NE | C005 | R$93.57 | 1,935 | 1.29 | 1.91% | R$2.53 | 16 | 7 | 7 | 0 |
| [COPY-v2] Monaco 2em1 - SS | C005 | R$60.19 | 1,812 | 1.11 | 1.55% | R$2.15 | 12 | 1 | 1 | 0 |
| [COPY-v2] RTG - Objecao Preco | C006 PAUSED | R$14.24 | 284 | 1.57 | 1.76% | R$2.85 | 1 | 0 | 0 | 1 |
| [ELP-CLS] Geracional — E | C007 | R$4.67 | 73 | 1.09 | 2.74% | R$2.33 | 0 | 0 | 0 | 0 |
| [VRT-AMB] Design Statement | C007 | R$0.72 | 31 | 1.11 | 0% | 0 | 0 | 0 | 0 | 0 |
| [ELP-AMB] Top of Line — E | C007 | R$0.38 | 22 | 1.00 | 4.55% | R$0.38 | 1 | 0 | 0 | 0 |

**F8 detected:** **[VRT-CLS] Linhas — V** = R$214/R$586 (37% of 7d spend) + **2nd ad** [COPY-v2] Tenro Luxo R$194 (33%) = **2 ads carrying 70% spend**, 4 other ads spending <R$5 (zombie). Single-hero risk.

### Click-to-WhatsApp destination + F5 KR check

**TODOS os ads:** `destination_type=WHATSAPP`, `cta=WHATSAPP_MESSAGE`, `link_url=api.whatsapp.com/send?phone=`**`554730419811`** (47 = Joinville/SC, format `30419811` = fixed landline 47 3041-9811).

**RISK F5 KR variant:** Number `+55 47 3041-9811` é landline-format. Para WhatsApp funcionar precisa estar registrado como **WhatsApp Business** ou rotear via **WABA Cloud API**. Sales AI Tocks deployed 05/Mai — provavelmente WABA Cloud API.

**Smoke test crítico:** Breno precisa enviar mensagem manual de outro celular para `+55 47 3041-9811` AGORA e verificar se aparece no Sales AI dashboard **E** no WhatsApp Business app da equipe Tocks. Se aparecer só num lugar = F5 variant ativo (mensagens dos leads indo para void inacessível à equipe humana).

**Pattern lookbook:** KR 12/Mai — Kell perdeu 99 conversas em 12d (R$437 spent) porque WABA Cloud API apontava pra número errado. Tocks **TEM Sales AI deployed**, mas a verificação manual ainda não foi feita pós-deploy.

### High-frequency saturation

- **C006 RTG (PAUSED) 14d:** freq **4.34** — burned (boa decisão pausar 12/Mai)
- **C005 14d freq 1.53** — OK
- **C007 14d freq 1.69** — OK aproximando ceiling
- 30d account-wide freq **1.92** — heading toward 2.0 warning zone

---

## 4. CAC math

**Tocks playbook CAC target:** R$4,400 (per spawn brief).
**AOV:** Vértice R$15,990 / Elipse R$19,900 / Monaco 2em1 ~R$8,000-15,000.
**Close rate luxo high-ticket:** 3-5% (consultative).

### Meta-only CAC (Click-to-WhatsApp funnel)

```
30d:
  spend = R$3,124
  msg_started = 276 (Meta count, inflado pelo bot Sales AI)
  human_qualified_estimate = 276 × 23% = 63 (assumindo 23% match user's "5/22" pattern)
  close_estimate @ 4% close rate = 63 × 0.04 = 2.5 sales/30d
  CAC = 3124 / 2.5 = R$1,250

  Cenário pessimista @ 2% close:
  CAC = 3124 / (63 × 0.02) = R$2,478

  Cenário otimista @ 5% close:
  CAC = 3124 / (63 × 0.05) = R$992
```

### Spike day 01/Mai CAC isolado

```
spend = R$194.43
msg_started = 22 → human_qualified = 22 × 23% = ~5 (matches Breno "5 responderam")
close @ 4% = 5 × 0.04 = 0.2 sales
CAC isolated = 194 / 0.2 = R$970/sale (if 1 sale eventually closes)
```

**Verdict CAC:** Cenário base R$1,250 → **CAC ESTÁ DENTRO** do target R$4,400 (28% do teto). Cenário pessimista R$2,478 ainda **ABAIXO** do teto.

**But:** all this is **estimativa** porque `Lead Qualificado Tocks` (UPLOAD_CLICKS R$13k value) nunca recebeu upload de close. **Sem CRM upload, CAC verdadeiro é unknown.** Sales AI deveria estar fazendo isto desde 05/Mai mas o Lead Qualificado conv = 0.

---

## 5. F-codes detected

| Code | Pattern | Evidence | Severity |
|------|---------|----------|----------|
| **F-Google-CONV-CHAOS** (G-013 variant) | 8 PRIMARY conv actions, PAGE_VIEW firing 631× treated as conv | TOCKS_Search_Alta-Intencao optimizing for pageview | **CRITICAL** |
| **F-Google-CONV-VALUE-VOID** | Lead Qualificado Tocks R$13k value, 0 fires 30d (CRM never uploaded) | UPLOAD_CLICKS conv idle | HIGH |
| **F8 — Single-hero spend concentration** | 2 ads = 70% Meta 7d spend | [VRT-CLS] Linhas R$214 + [COPY-v2] Tenro Luxo R$194 | MEDIUM |
| **F-Google-COMPETITOR-BRAND-LEAK** (G-018 reverse) | R$77 / 14d in competitor brand searches | "Bilhares Palácio Curitiba", "Casa Bilhar Teixeira", "Bilhar Sena" | MEDIUM |
| **F5 KR-WhatsApp-Void variant (POTENTIAL)** | `+55 47 3041-9811` landline+WABA — smoke test never done post Sales AI deploy 05/Mai | All 18+ ads route to same number | **HIGH — needs verification** |
| **F4 — SIS Lost-Rank 90%** | 0.0999 Search Impression Share | Quality issue, not budget | HIGH |
| **F-Google-SMART-BIDDING-WRONG-SIGNAL** | Maximize_Conversions optimizing PAGE_VIEW conv that fires 631×, not LEAD that fires 1× | TOCKS_Search_Alta-Intencao | **CRITICAL** |
| **F-Meta-ZOMBIE-ADSETS** | 26 active adsets under PAUSED campaigns (C001-C004) | Adset registry bloat | LOW |
| **F-Bidding-Strategy** | C007 LOWEST_COST_WITHOUT_CAP (no cap = risk of CAC blowout when scaling) | adset Premium Luxo SS | MEDIUM |

---

## 6. State delta vs canon (Sprint 1 Tocks playbook)

Sprint 1 Tocks playbook não existe ainda. Construindo agora baseado em CONTEXT.md + memórias:

| Canon (proposed) | Real 15/Mai | Delta |
|------------------|-------------|-------|
| 1 Search Alta-Intencao R$75/d | ✅ ENABLED R$75/d | OK |
| 0 Shopping (regra `feedback_no_shopping_bretda_tocks`) | ✅ all Shopping PAUSED | OK |
| 0 PMAX (Shopping-adjacent ban) | ✅ all PMAX PAUSED | OK |
| 2 PRIMARY conv max (Lead Qualificado + Page View Compra) | ❌ 8 PRIMARY (chaos) | **FAIL** |
| `Lead Qualificado Tocks` ativo recebendo CRM uploads | ❌ 0 fires 30d | **FAIL** |
| 2 Meta active camps C005 (Mass Sudeste+NE) + C007 (Premium V+E) | ✅ C005 + C007 ACTIVE | OK |
| 1 RTG paused (freq saturado) | ✅ C006 PAUSED 12/Mai | OK |
| Smoke test WhatsApp pós Sales AI 05/Mai | ❌ never confirmed | **FAIL critical** |
| D++ CAPI Tocks deployed | ❌ PR #645 CLOSED no merge 07/Mai | FAIL (carryover) |

---

## 7. Quick wins recommended (P0/P1/P2)

### P0 — User actions (READ-ONLY audit, no writes by Kasim)

1. **SMOKE TEST WhatsApp `+55 47 3041-9811`** — Breno manda mensagem manual do celular pessoal, espera 5min, confirma aparece no **Sales AI dashboard** E no **WhatsApp Business app** da equipe Tocks. Se só Sales AI: F5 risk. Se só WhatsApp app: Sales AI desconectado.
2. **Auditar Sales AI deploy 05/Mai** — verificar se está atendendo automaticamente os 22 leads/dia spike days. Quantos chat sessions abertas na semana 01-08/Mai vs first_reply Meta? Diferença = bot inflando number.

### P1 — Approved by user, then chief delegates to Kasim execute

3. **G-013 fix — Demote 6 PRIMARY conv to SECONDARY:**
   - Keep PRIMARY: `[LEAD] COMPRA WHATSAPP SITE` (7382426793) — real intent
   - Keep PRIMARY: `Lead Qualificado Tocks` (7550396040, R$13k value) — para offline CRM upload
   - Demote SECONDARY: `Visualização de página - CLICK` (7540774791) — **biggest poisoner**
   - Demote SECONDARY: `Local actions - Website visits` (7347581492)
   - Demote SECONDARY: `Clicks to call` (7399079937)
   - Demote SECONDARY: `WhatsApp - CLICK` (7540631962)
   - Demote SECONDARY: `Adicionar ao carrinho - CLICK` (7540631965)
   - Demote SECONDARY: `Iniciar finalização de compra - CLICK` (7540631968)
   - **Smart Bidding reset window 21d post-fix** — não julgar performance Search até ~05/Jun
4. **Negative kw G-018 reverse:** add to TOCKS_Search_Alta-Intencao
   - `casa do bilhar teixeira` exact
   - `bilhares palacio` phrase
   - `bilhar sena` phrase
   - `palacio curitiba bilhar` phrase
   - Plus broader negs: `usado`, `usada`, `barato`, `popular`, `R$ 500`, `R$ 1000` (filter low-ticket searches)
5. **Sales AI CRM upload bridge fix** — Lead Qualificado Tocks conv recebendo close events. Sem isso, Smart Bidding está cego para AOV verdadeiro.

### P2 — Strategic

6. **F8 spread risk** — não pausar [VRT-CLS] Linhas ou [COPY-v2] Tenro Luxo (são winners). Mas **NÃO ESCALAR** mais que +20%/d budget até ter 5 fechamentos reais via CRM upload (não Meta first_reply count).
7. **C007 bid strategy** — mudar de LOWEST_COST_WITHOUT_CAP para LOWEST_COST_WITH_BID_CAP (R$8/msg_started cap) ou COST_CAP para proteger CAC quando escalar.
8. **D++ CAPI Tocks reabrir** — PR #645 foi CLOSED 07/Mai sem merge (per memória 12/Mai). Sem CAPI server-side, Sales AI não consegue mandar conv para Meta. @aios-dev fix branch `feat/tocks-capi-d-plus-plus` Railway `targetPort=3100`.

---

## 8. Open questions (3 max)

1. **Sales AI Tocks está atendendo automaticamente?** (Breno verifica dashboard 01-14/Mai chat sessions)
2. **`+55 47 3041-9811` smoke test result:** WABA Cloud API only? Or WhatsApp Business app accessível pela equipe?
3. **Quantos fechamentos reais (R$) dos 276 msg_started 30d?** Sem upload de CRM, Smart Bidding voa cego.

---

## 9. Verdict

**FIX** — não kill (winners exist), não scale (CAC unverified).

Sequence next 7d:
1. Smoke test + Sales AI audit (Breno P0)
2. Auth Kasim para G-013 demote + negative kw (Chief approval gate)
3. Wait 7-21d Smart Bidding re-calibration
4. Then decide: scale C007/C005 vs kill PR #645/Sales AI direction

---

*Specialist: @kasim-aslam | Audit type: spike + state | Read-only | 2026-05-15*
