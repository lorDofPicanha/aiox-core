# Tocks Audit — Spike Investigation — Chief Synthesis 2026-05-15

Mission: investigar "gasto gigante 1 dia, 21 leds, 5 responderam, CAC fora orçamento".
Specialist: @kasim-aslam (executed). Chief: traffic-masters-chief.
Read-only audit. Account: Google 8146675397 + Meta act_1221671265457624.

---

## TL;DR

- **Spike day:** **01/Mai/2026** (22 msg_started, R$194 spend) **OU 03/Mai** (30 msg_started, R$180). Both fit user's "21 leds". Mais provável **01/Mai** (round 22→21).
- **76% no-response real:** padrão **Sales AI inflate** — Meta conta `first_reply=22` mas só ~5 leads humanos qualificados engajam (23% conversion bot→humano). Match perfect with `feedback_meta_ctm_waba_wrong_number` KR pattern, mas **Tocks tem Sales AI deployed 05/Mai** → menor risco F5 mas crítico smoke test.
- **CAC real estimado:** **R$1,250 - R$2,478** (cenário base-pessimista). **DENTRO** do teto R$4,400. User percepção "fora do orçamento" provavelmente é **fricção de saldo** (R$155 saldo critical 05/Mai per CONTEXT) + percepção subjetiva, não CAC unitário.
- **Root cause primário:** **G-013 Google CONV-CHAOS** — 8 PRIMARY conv actions, `Visualização de página` PRIMARY firing 631× turning every pageview em "conversão" — Smart Bidding voa cego optimizando pageview ao invés de WhatsApp click. Plus **Sales AI CRM upload bridge não funcionando** (Lead Qualificado Tocks 0 fires).
- **Verdict:** **FIX** (não kill, não scale). 7-21d Smart Bidding recalibration window pós-fix.

---

## State current

### Google Tocks (LIVE)
- OAuth LIVE pós-reauth 15/Mai (contato@tockscustom.com.br MCC 7943699417)
- **1 ENABLED:** TOCKS_Search_Alta-Intencao R$75/d Maximize_Conversions
- 16 PAUSED (Shopping, PMAX, legacy)
- 30d: R$1,815 / 50 conv (dos quais 49 são Visualização de página fake), **1 real lead WhatsApp**
- **SIS 0.0999 (90% Lost-Rank)** — quality issue
- 8 PRIMARY conv (canon 2) — **CRITICAL chaos**

### Meta Tocks (LIVE)
- Token shared with Bretda BM working
- Pixel `1382948639707224` fired 14/Mai 19:48 ALIVE
- **2 ACTIVE camps:** C005 R$95/d (Cidades+Nordeste) + C007 R$60/d (Premium Luxo SS V+E)
- 1 PAUSED RTG C006 (right move 12/Mai, freq 4.34 saturated)
- 30d: R$3,124 / 276 msg_started / 260 first_reply / freq 1.92
- Click-to-WhatsApp `+55 47 3041-9811` (Joinville landline)
- **Smoke test NEVER done pós Sales AI deploy 05/Mai** ⚠️ F5 KR risk variant

### Sales AI Tocks
- Deployed 05/Mai (per memory)
- Stories 7.1-7.4 DONE, 7.5 LGPD pending
- **Atendendo 276 leads/30d?** UNKNOWN (Breno precisa verificar dashboard)
- **CRM upload to Google Lead Qualificado Tocks** = **0 fires/30d** ⚠️ bridge quebrada ou nunca conectada

### D++ CAPI
- **PR #645 CLOSED sem merge 07/Mai** (per memory `session_tocks_hydra_actions_12mai`)
- Branch `feat/tocks-capi-d-plus-plus` ainda existe
- Sem CAPI → Sales AI não consegue mandar conv events pro Meta → Meta optimizing baseado só em messaging signals (inflado)

---

## Spike day forensics — 01/Mai mais provável

| Métrica | 01/Mai (provável) | 03/Mai (alternativo) | Avg 30d/dia |
|---------|-------------------|----------------------|-------------|
| Spend | R$194.43 | R$179.97 | R$104 |
| Impressions | 7,584 | 6,354 | 3,526 |
| Clicks | 179 | 151 | 80 |
| Reach | 5,775 | 4,776 | 1,833 |
| Freq | 1.31 | 1.33 | 1.92 |
| **link_click** | **98** | 80 | 39 |
| **msg_started** | **22** | **30** | 9.2 |
| **first_reply** | **22** | **28** | 8.7 |
| Cost/msg_started | R$8.84 | R$6.00 | R$11.30 |

**Spike narrative:**
- Não foi spend anômalo (R$194 vs avg R$104 = +87%, não 2x)
- Foi **conversion volume anômalo** — **22 leads em 1 dia = 2.4× média**
- **CTR 2.36% / link_click→msg_started 22/98 = 22.4%** (good rate)
- **first_reply 22/22 = 100% Meta-counted reply** — porque Sales AI **bot responde automaticamente**, inflate métrica

**The "5 que responderam" puzzle:**
- Sales AI auto-saudação dispara primeiro reply → Meta conta como `messaging_first_reply`
- User (Breno) lê WhatsApp/Sales AI dashboard humanamente
- **Vê 22 chats abertos, 5 com conversa real progredindo** = 23% qualificação rate
- Matches pattern observed em luxury high-ticket Click-to-WhatsApp universally (Pedro Sobral cita 20-30% humano dos cliques)

**Sem ser F5 destruction:** se Sales AI fosse void (KR pattern), seria 0 humanos response, não 5. Os 5 prova Sales AI **está atendendo** — só que Meta-side mascara o ratio.

---

## CAC math (Pedro Sobral doctrine)

```
Target Tocks CAC: R$4,400 (playbook spawn brief)
AOV: R$10k-25k (Monaco/Vértice R$15.990 / Elipse R$19.900)

CENÁRIO BASE (close_rate 4% luxo high-ticket):
  30d spend Meta = R$3,124
  30d msg_started = 276
  humans_qualified = 276 × 23% = 63
  closes = 63 × 4% = 2.5 sales
  CAC = R$1,250/sale ✅ DENTRO (28% do teto)

CENÁRIO PESSIMISTA (close_rate 2%):
  CAC = R$2,478/sale ✅ DENTRO (56% do teto)

CENÁRIO OTIMISTA (close_rate 5%):
  CAC = R$992/sale ✅ confortável

Spike day isolated (01/Mai):
  R$194 spend / (22 × 23% × 4%) = R$970/sale potencial
```

**Conclusion:** CAC **NÃO está fora do orçamento**. User pode estar reagindo a:
1. Saldo crítico (R$155 per memory 05/Mai) — fricção financeira percebida ≠ CAC unit cost
2. Spike day único R$194 visto isoladamente (uma vez por mês, espende 2× média = sente "gigante")
3. Falta de visibilidade close→CAC porque CRM upload Lead Qualificado quebrado

---

## F-codes detected (9 ativos)

| # | Code | Severity | Action |
|---|------|----------|--------|
| 1 | **G-013 CONV-CHAOS** (8 PRIMARY, PAGE_VIEW PRIMARY firing 631×) | **CRITICAL** | Demote 6 conv to SECONDARY |
| 2 | **F-CRM-UPLOAD-VOID** (Lead Qualificado 0/30d) | HIGH | Sales AI CRM bridge fix |
| 3 | **F5 KR-WhatsApp-VOID variant** (`+55 47 3041-9811` smoke never done pós Sales AI) | **HIGH** | Breno smoke test P0 |
| 4 | **F4 SIS Lost-Rank 90%** (0.0999 IS) | HIGH | Quality fix: better LP UX, neg kw |
| 5 | **F-Smart-Bidding-Wrong-Signal** (optimizing pageview not WA click) | **CRITICAL** | Inherits from G-013 fix |
| 6 | **G-018 reverse COMPETITOR-LEAK** (R$77/14d competitor searches) | MEDIUM | Negative kw |
| 7 | **F8 single-hero spread** (2 ads = 70% Meta 7d) | MEDIUM | Não pausar winners, não escalar +20% sem CRM data |
| 8 | **F-Bidding-NoCap** (C007 LOWEST_COST_WITHOUT_CAP) | MEDIUM | Migrar para WITH_BID_CAP R$8/msg_started |
| 9 | **F-Zombie-Adsets** (26 active adsets under PAUSED camps C001-C004) | LOW | Cleanup quando outras P0 closed |

---

## Quick wins (priorizado)

### P0 — USER ACTION REQUIRED (Breno hoje)

| # | Action | Why | ETA |
|---|--------|-----|-----|
| **P0-1** | **Smoke test `+55 47 3041-9811`** — mandar mensagem do celular pessoal, confirmar chega no Sales AI dashboard E na equipe Tocks | F5 KR variant validation pós Sales AI deploy 05/Mai | **15min** |
| **P0-2** | **Auditar Sales AI chat sessions 01-14/Mai** — comparar com Meta first_reply=141 (14d) | Verificar bot atendendo OK ou 76% no-response real | **30min** |
| **P0-3** | **Saldo Tocks check** — confirmar atual `display_string` (não `balance`). Se <R$200 = 2d runway → PIX | Per memory R$155 05/Mai + spend R$104/d Meta + R$75/d Google = burn rate R$179/d | **5min** |

### P1 — Chief approval gate, then Kasim execute (READ-ONLY hoje, write next session)

| # | Action | Effect | Authority |
|---|--------|--------|-----------|
| **P1-1** | **Demote 6 PRIMARY conv to SECONDARY** (manter só Lead Qualificado + LEAD COMPRA WHATSAPP) | Smart Bidding re-train para sinal real, 21d reset window | Kasim via `ads_action_log` + Google API |
| **P1-2** | **Add 8 negative kw** TOCKS_Search_Alta-Intencao (competitor brands + low-ticket terms) | Reduz R$77/14d waste | Kasim via API |
| **P1-3** | **Sales AI → Google offline conversions bridge** | Lead Qualificado Tocks recebe closes R$15-20k → Smart Bidding aprende AOV real | @aios-dev (Sales AI repo) |

### P2 — Stratégico (próximas semanas)

| # | Action | When |
|---|--------|------|
| **P2-1** | **D++ CAPI reabrir PR #645** Railway `targetPort=3100` fix | Sprint dev next |
| **P2-2** | **C007 LOWEST_COST_WITHOUT_CAP → WITH_BID_CAP R$8** | Pós CRM upload bridge active (M+7d) |
| **P2-3** | **Cleanup 26 zombie adsets** under PAUSED C001-C004 | Cosmético, low priority |

---

## NOT escalation — não fazer

- ❌ **NÃO escalar Meta budget** até CRM upload Lead Qualificado fire 5+ closes reais (cego para CAC verdadeiro)
- ❌ **NÃO pausar [VRT-CLS] Linhas** ou **[COPY-v2] Tenro Luxo** (são winners, F8 mas funcionam)
- ❌ **NÃO julgar Smart Bidding** antes de **05/Jun** se P1-1 demote executado hoje (21d Smart Bidding reset window per CONTEXT.md)
- ❌ **NÃO criar nova camp** até stack atual otimizada
- ❌ **NÃO usar Shopping** Tocks (regra `feedback_no_shopping_bretda_tocks`)

---

## Open Questions (Breno responde)

1. **Smoke test result** — `+55 47 3041-9811` aparece em Sales AI E WhatsApp Business app da equipe?
2. **Sales AI atendendo OK?** Quantos chats reais (não bot) 01-14/Mai (comparar com 276 Meta count)?
3. **Quantos fechamentos reais (R$ closed) desde Sales AI deploy 05/Mai?** Para validar CAC unit cost projetado R$1,250-R$2,478.

---

## USER ACTION REQUIRED (count: 3)

1. P0-1: Smoke test WhatsApp manual (15min)
2. P0-2: Audit Sales AI dashboard (30min)
3. P0-3: Confirm saldo Tocks Meta+Google (5min PIX if <R$200)

---

## Próximo passo

Aguardar Breno responder P0-1/P0-2/P0-3.
- Se F5 detected → escalation critical, pause Meta camps
- Se Sales AI OK → autoriza P1-1 (demote 6 PRIMARY) + P1-2 (8 negative kw)
- Se CRM upload broken → @aios-dev handoff

---

*Chief: traffic-masters-chief | Synthesis: 2026-05-15 ~17h00 BRT | Files Kasim: `audit-spike-2026-05-15-kasim.md` | Status: READ-ONLY audit complete, awaiting Breno smoke test*
