# Memory Patterns Extracted — traffic-masters-chief

**Source:** `D:\AIOS\.claude\agent-memory\traffic-masters-chief\` (43 files, Apr-May 2026) + cross-references with user MEMORY.md (~50 entries traffic-related).

This document distills operational patterns into a knowledge base the rebuilt squad MUST encode.

---

## 1. Recurring FAILURE Patterns

### F1. Saldo Crítico Sem Alarm (Meta + Google)
**Frequency:** 9+ events across 30 days (Bretda Mar-Mai, Tocks Apr-Mai, Vorza)
**Pattern:** account spend chega em saldo R$0 ou spend_cap exausto sem alerta proativo. User só descobre quando ads param de delivery.
**Examples:**
- Tocks 11/Mai: balance R$0, spend_cap R$53.284 == amount_spent (cap exausto)
- Bretda 28/Abr: cap exausto R$869 gap em 7d via budget jump
- Bretda 22/Abr: saldo R$30,35
**Root cause:** `meta_ads_account_balance` nunca é chamada proativamente. `display_string` é a fonte real, não `balance` field (feedback `meta_prepaid_spend_cap`).
**Fix in rebuild:** chief MUST run `meta_ads_account_balance` daily; threshold 3 days runway = WARN; 1 day = CRITICAL escalate to user.

### F2. OAuth Re-auth Required (Google primarily)
**Frequency:** 6+ events (17/Abr, 22/Abr, 29/Abr, 05/Mai, 07/Mai, ongoing)
**Pattern:** OAuth Google expira ~30 dias, token Production verification pendente. Toda operação 403 hard-fail.
**Examples:**
- 17/Abr Tocks/Bretda 403 cascata
- 05/Mai Bretda OAuth Production migration session
- 07/Mai contato@tockscustom.com.br reauth restored
**Fix in rebuild:** pre-action protocol checks token freshness. If <72h to expire, escalate to user.

### F3. Instant Form vs LP Form Trap (Meta)
**Pattern:** ad parece LP form (link_url cosmético) mas é Instant Form (`destination_type=ON_AD`). Lead quality colapsa silenciosamente.
**Smoking gun:** Bretda AD10v2 12/Mai descobriu que TODOS ads (AD03/04/05/10v2) eram Instant Form. Memórias 07/Mai+11/Mai estavam erradas.
**Root cause:** Meta API `link_url` field is cosmetic when `destination_type=ON_AD`. Validation requires `destination_type` check.
**Fix in rebuild:** mandatory `meta_ads_destination_type_check` before ANY ad creation OR before declaring "this is an LP form ad".

### F4. Budget Jump Destroyed Learning Phase
**Pattern:** subir budget >+50%/dia em CBO/adset → Meta resetar learning → CPL explode 2-4x → 14d limbo recovery.
**Smoking gun:** Bretda 28/Abr R$27 → R$120 (+344%) em uma noite + 5 creatives novos = colapso pós-28/Abr (gate 12/Mai descobriu raiz real).
**Pre-existing rules ignored:** Mandalia "Cost cap dancing +/- 15%", Ralph "+20%/dia max".
**Fix in rebuild:** `ads_guardrails` pre-write check: BLOCK any budget update >+30%/dia. Override requires explicit user confirmation.

### F5. WhatsApp Wrong Number Routing (CTM trap)
**Smoking gun:** KR Interiores 12/Mai — wa.me da Page apontava para +55 61 9872-0330 (12 dígitos, faltando 1 "9"). 99 conversas em 12d (R$437 spend) foram para WABA Cloud API inacessível à Kell.
**Pattern:** Click-to-WhatsApp campaign reporta volume de mensagens normal mas leads não chegam ao celular do dono.
**Root cause:** Meta dashboard reporta "messages" sem validar handover real. Atribuição fragmentada Ads vs Inbox.
**Fix in rebuild:** mandatory smoke test (manual sender) before declaring CTM campaign functional. Checklist `ctm-whatsapp-smoke-test.md`.

### F6. Pixel Codeless Conversion Bug (Google)
**Pattern:** conversion `[AGD] Lead` codeless template (R$100 default value) dispara em ANY page navigation, fantasma R$100 corrompendo Smart Bidding.
**Smoking gun:** Bretda Caminho C 06/Mai — `7138711130` codeless, Manual CPC 21d adotado para neutralizar.
**Fix in rebuild:** post-conversion-creation check — if `default_value > 0` AND `category == codeless`, FLAG and require user confirmation.

### F7. ROAS Cego (Tocks pattern)
**Pattern:** Smart Bidding rodando MAXIMIZE_CONVERSIONS sem signal de conv real. 14d, R$446, 0 conv "verdadeiras". Vanity events (PageView, Local actions Website visits) firing only.
**Smoking gun:** Tocks 11/Mai — Lead Qualificado upload offline 0 fires 14d (ECL nunca conectada).
**Fix in rebuild:** Foundation First gate — `meta_ads_pixel_check` + `google_ads_conversion_actions_list` MUST show ≥1 PRIMARY firing in last 7d before any scaling.

### F8. AD05 Single Hero Domination (Bretda)
**Pattern:** 1 ad pega 96-97% spend → freq saturation iminente → CPL explode em 7-14d.
**Smoking gun:** AD05 Bretda 28/Abr — 97% spend, 42 leads R$5,21 CPL → quebrou em 12/Mai.
**Fix in rebuild:** Creative Lab gate — alert if any single ad >70% spend within adset for >7d.

### F9. Audience Overlap Massive (Bretda 17/Abr)
**Pattern:** 4+ adsets mirando "arquitetos/luxury BR" simultaneamente disputando mesmo inventário Meta. CPL quadruplica em 48h.
**Fix in rebuild:** weekly `meta_ads_audience_overlap` audit; auto-flag if >40% overlap between active adsets.

### F10. Manual Tracking Tags Never Installed (GTM)
**Pattern:** GTM tags propostas no plano mas nunca instaladas. ROAS data missing por meses.
**Examples:**
- Tocks "WhatsApp - CLICK" tag não dispara 14d
- Tocks "[LEAD] COMPRA WHATSAPP SITE" tag não dispara
- Tocks Tray legacy: "tags Google nunca instaladas no GTM Tray" (root cause Tocks 23/Abr)
**Fix in rebuild:** task `gtm-tag-validation.md` validates each tag fires real events ≥1x/24h.

---

## 2. Recurring SUCCESS Patterns

### S1. "Brand-Defense Fire NOW"
**Origin:** Bretda Conclave 07/Mai (3/3 mind clones consensus larry-kim, neil-patel, peep-laja)
**Pattern:** Brand-Defense Google R$5-10/d sempre on, mesmo em crise. Concorrentes pagam para roubar searches branded.
**Application:** Bretda 06/Mai greenfield — Brand-Defense `23821730141` foi primeira camp ENABLED.
**Encode:** chief Crisis Response Protocol — Brand-Defense é último a pausar (only after total kill switch).

### S2. AD03+AD04 Reactivation (Bretda Hybrid C)
**Pattern:** quando AD ativo recente colapsa, voltar para old proven winners (CTA different — GET_QUOTE → LP form em vez de SIGN_UP → Instant Form).
**Application:** Bretda 12/Mai Restore Híbrido C — CJ8v2 R$60/d + AD03+AD04+AD05 ACTIVE, AD10v2 PAUSED.
**Encode:** task `creative-fallback.md` — quando creative fatigue, ressuscitar ad com performance hist >30 leads/CPL <baseline.

### S3. KR Setup com BM Próprio (Identity Cluster Separation)
**Pattern:** novo cliente em mídia paga = novo BM CNPJ próprio. Operador entra como Analista, não Admin. Identity cluster separado.
**Source:** plan_kr_meta_ads_migration.md — "Google flagged Kell, Meta é cluster separado, mas se cair em BM operador queima cluster Meta também".
**Encode:** task `account-onboarding-meta.md` enforça setup limpo.

### S4. ABC Structure Brasil (Pedro Sobral)
**Pattern:** info-product/ecommerce BR sempre em estrutura ABC (Atrair/Bater/Captar). Geo Brasil 2076 PRESENCE.
**Application:** KR plan, Vorza pre-pivot, Low-Ticket-10k.
**Encode:** task `metodologia-abc.md` é template default para qualquer conta BR ecommerce.

### S5. CBO Stable + ABO Test
**Pattern:** Mandalia rule — CBO em escala estável, ABO para testar.
**Application:** Bretda CJ8v2 mantém CBO baseline, novos adsets nascem ABO até validar.
**Encode:** task `meta-campaign-create.md` defaults ABO para new tests.

### S6. Manual CPC 21d Antes de Smart Bidding
**Pattern:** novo Google Ads / pós-bug → Manual CPC 21d para acumular sinal real → migrar para Maximize Conv com value tracking.
**Application:** Bretda 05/Mai greenfield, conv-value-fix neutraliza fantasma.
**Encode:** task `google-bidding-strategy-migration.md`.

### S7. PIX Recurring (Cash Flow Predictable)
**Pattern:** todas contas BR rodam pré-pago. PIX recurring evita zero-saldo crisis.
**Encode:** task `cash-flow-management.md` projeta runway diário.

### S8. Sales Feedback Spreadsheet (Neil Clone)
**Pattern:** lead que vira venda? só vendedor sabe. Sem sales feedback structured, todo CPL/ROAS é estimativa.
**Application:** Bretda Conclave 07/Mai recommendou D+1.
**Encode:** task `sales-feedback-loop.md` cria spreadsheet template.

---

## 3. Per-Account Playbook Nuggets

### Bretda
- **Pixel:** `3348133485496539` (CANON, only one). CAPI Caminho B LIVE desde 04/Mai.
- **Account:** Meta `act_381618241134624`, Google `8167636084` MCC `7943699417`
- **Default geo:** Brasil 2076 PRESENCE (Sudeste+Sul prioritário, NUNCA Sudeste isolado)
- **Default offer:** mesa de bilhar high-ticket R$3-8k AOV, lead form qualifier "tipo+orçamento+prazo"
- **Pricing rule:** NUNCA mencionar preço em RSAs Google (`feedback_check_out_of_scope_first`)
- **No Shopping/Merchant** (`feedback_no_shopping_bretda_tocks`)
- **Architecture:** 4 campaigns greenfield (Brand-Defense + Bilhar + Jantar + RTG)
- **Creative pillar:** Aurora/Citrino/Opal/Zurita/Âmbar coleções, IA generates ambientes (NUNCA altera mesa real `feedback_bretda_mesas_reais`)
- **Critical gates:** D+7 (19/Mai), D+14 (26/Mai)

### Tocks
- **Pixel:** `1382948639707224`
- **Account:** Meta `act_1221671265457624`, Google `8146675397` MCC `7943699417`
- **Default geo:** Brasil 2076 PRESENCE (Sul+Sudeste foco, expansão NE conditional)
- **Default offer:** móveis luxo high-ticket >R$30k AOV (Vértice, Elipse, Monaco, Gabe, Skara)
- **Sales AI:** WhatsApp+IA, Stories 7.1-7.4 DONE, Story 7.5 LGPD pendente
- **Pricing rule:** NÃO usar Shopping/Merchant
- **Critical pendência:** D++ CAPI PR #645 STATUS CLOSED (NÃO deployed) → memory antiga errada
- **Quality gate:** SIS Lost-Rank deve ser <50% (atual 90%+ = quality issue, not budget)
- **Tag GTM:** `OUTBOUND_CLICK Google → SECONDARY` (resolve `7382426793` not-biddable)

### KR Interiores
- **Owner:** Kell Rodrigues (autonomous client, technical novice)
- **Account:** `act_210585430466029` (próprio BM Kell, NÃO Vorza BM)
- **Default geo:** Brasília-DF + cidades satélites premium (Águas Claras, Lago Sul/Norte, Sudoeste, Noroeste, Plano Piloto)
- **Default offer:** design interiores alto-padrão R$30-150k por projeto, lead via WhatsApp
- **Pixel:** `495385076720880` (NÃO instalado em krinteriores.com.br — Kell pendente)
- **CRITICAL warning:** WhatsApp wrong number bug 12/Mai — wa.me da Page → número errado +55 61 9872-0330 (12 dígitos, falta 1 "9"). Smoke test obrigatório.
- **Architecture:** ABC 3-adset (Precision High-Intent + Broad Lifestyle + Open Algorithm)
- **Budget:** R$50/d inicial, escala R$100-150 D+14

### Vorza
- **Status:** Meta PAUSED 05/Mai. Pivô email-marketing.
- **BM:** próprio (não compartilha com KR ou Bretda)
- **Pixel:** `26458851600417959` (não atribuído à `act_793656664671388` — bug pending)
- **Default offer:** info-product low-ticket R$37, funnel R$10k+/mês
- **Stack pivot:** Resend + Supabase + mail.vorza.com.br
- **Decision pending:** opção A/B/C/D triagem oferta

### Low-Ticket-10k
- **Status:** LP v5 LIVE, 4 adsets PAUSED, R$74/d
- **Default offer:** R$37 SKU low-ticket
- **Setup pattern:** `feedback_meta_api_anti_spam` — fresh account exige PAUSED + sequential creates

---

## 4. Decision Points That ALWAYS Need Human

| Decision | Why human | Reference |
|---|---|---|
| Saldo PIX confirmation (BR pré-pago) | Financial commitment | F1 |
| OAuth re-auth | Identity verification | F2 |
| Production OAuth verification submit | Google review | OAuth 05/Mai |
| Spend cap raise | Financial commitment | feedback_meta_prepaid_spend_cap |
| Deploy CAPI/code | @aios-dev authority | Bretda CAPI Caminho B |
| Push to remote | @devops authority | Constitution Article II |
| Account suspension recovery | Meta/Google support manual | KR suspension 17/Abr |
| Pricing decision (show price or "sob consulta") | Business/strategy | Bretda Shopping decision |
| Smoke test execution (manual sender CTM) | Physical validation | F5 |
| Account onboarding (new BM creation) | Identity verification | S3 |

---

## 5. Quality Gates That SHOULD Be Automated

| Gate | Check | Tool |
|---|---|---|
| Pre-launch pixel attached | `meta_ads_pixel_check` returns active | Foundation First |
| Pre-launch CAPI alive | `meta_ads_capi_status_check` returns 7d signal | Foundation First |
| Pre-launch geo Brazil PRESENCE | `meta_ads_set_geo_targeting` includes 2076 + PRESENCE | feedback_geo_targeting_brazil |
| Pre-launch destination_type validated | `meta_ads_destination_type_check` matches intent | F3 |
| Pre-launch saldo runway >5d | `meta_ads_account_balance` projected | F1 |
| Pre-budget-jump throttle | `ads_guardrails` blocks >+30%/d | F4 |
| Pre-conversion-creation codeless check | Flag `default_value > 0` + `codeless` | F6 |
| Daily creative single-hero alert | Single ad >70% adset spend for 7d | F8 |
| Weekly audience overlap audit | `meta_ads_audience_overlap` >40% flag | F9 |
| Weekly Quality Score audit (Google) | `google_ads_quality_score_audit` flag <5 | Aslam framework |
| Daily search terms hygiene | `google_ads_search_terms` review for negatives | Aslam framework |
| Weekly DPI² alert | DPI² <0.7 or >1.3 alert | Ralph framework |
| CTM smoke test pre-launch | Manual sender + dashboard verify | F5 |

---

## Total Encoded Knowledge

- **10 failure patterns** with concrete examples + fixes
- **8 success patterns** with concrete applications
- **5 account playbooks** (Bretda, Tocks, KR, Vorza, Low-Ticket)
- **10 human-required decisions** documented
- **13 automatable quality gates** specified

This is the operational core the rebuilt squad must absorb.
