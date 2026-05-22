# Concierge KPI Dashboard — Innovation Accounting (Ries) PT-BR

**Filosofia:** Innovation Accounting Eric Ries (`04-clone-conclave/c-gtm-beta/eric-ries.md` linhas 20-28) — métricas accionáveis sobre **comportamento**, não output. Vanity metrics explicitamente proibidas.

**Stack operacional:** Google Sheets multi-tab (single source of truth) + Notion link de leitura + PDF snapshot diário 23h BRT.

**Cadência:** atualização ≥1×/dia EOD (founder); review semanal advisor + facilitadoras.

---

## 1. North Star Metric

### D+7 Unprompted Return Rate

**Definição operacional:**

> Número de participantes do cohort que enviaram ≥1 mensagem espontânea ao canal Anipis-Concierge entre D+3 (2/Jun/2026 00:00 BRT) e D+7 (6/Jun/2026 23:59 BRT) **SEM ter recebido outbound nas 12h anteriores à mensagem**
>
> dividido por
>
> total participantes ativas (cohort inicial 20 menos dropouts confirmados D0-D+3)

**Target:** **≥35%** (≥7 de 20)

**Razão do target 35% (não 50%, não 25%):** Eric Ries linha 21 — "Per-cohort D+7 unprompted return rate (≥35%) — value hypothesis core". 35% é piso operacional para sinal forte em digital health behavior (vs benchmark Wysa ~20% D+7 segundo public references; Woebot RCT 2017 ~40% prompted). Acima 35% = signal claro Júlia volta; abaixo 20% = signal claro produto não engaja; 20-34% = ambiguous → PIVOT discussion.

**Operacionalização técnica:**

- Cada outbound facilitadora→Júlia tem timestamp logged no Google Sheet "Outbound Log"
- Cada inbound Júlia→facilitadora tem timestamp logged no Google Sheet "Inbound Log"
- "Unprompted" = inbound `t` onde `t - max(outbound_to_this_juxia) ≥ 12h`
- Calculation D+7: para cada participante, contabiliza ≥1 inbound entre D+3 00:00 e D+7 23:59 que seja unprompted

**Edge cases:**
- Se Júlia responde ack a outbound + manda mensagem nova 14h depois = a mensagem nova conta como unprompted ✓
- Se Júlia responde ack D+0 e silencia até D+8 = não conta D+7 ✗
- Se Júlia drop-out (silence ≥48h consecutivas + sem response a follow-up) D+3 = removida do denominador ative

---

## 2. Drivers (3 métricas acionáveis)

### Driver 1 — Average Sessions/Week por participante ativa

**Definição:** sessão = bloco de ≥1 inbound + ≥1 outbound dentro de janela 30min, separados de outros blocos por ≥4h gap. Calculation 7-day rolling.

**Target:** ≥2.5 sessions/week (Eric Ries linha 22)

**Razão:** sessions/week mede engagement depth — quantas vezes Júlia se engaja substancialmente (não só ack). 2.5 é baseline conservador wellness apps; 4+ é peak behavioral activation.

### Driver 2 — Vulnerability Latency

**Definição:** tempo (em dias) entre D0 e primeira mensagem inbound Júlia classificada como YELLOW ou maior (vulnerability moderada+) pelo julgamento de facilitadora (sem ML — humano).

**Target:** ≤4 dias média (Eric Ries linha 23 — "leading indicator")

**Razão:** Eric Ries linha 23 — "Se ela só faz small talk no D+1, não há trust formation acontecendo." Latência ≤4 dias indica trust formation rápido; >7 dias = produto não construindo intimidade necessária.

### Driver 3 — PHQ-9 Delta D+14 vs D-1 (post-baseline)

**Definição:** PHQ-9 D+14 score − PHQ-9 D-1 baseline score. Score range 0-27. Positivo = piora; negativo = melhora.

**Target:** delta ≤ -3 pts média (Eric Ries linha 23 — "PHQ-9/GAD-7 delta @ 4 semanas ≥3 pontos"; ajustado 14d via Atul + Alison evidence calibration)

**Razão:** Atul Butte (`02-deliverables/01-analyst.md` referenciado) sugere PHQ-9 delta como outcome clínico real (não output). -3pts em 14 dias é clinicamente meaningful em mild-moderate. Outcome > vanity.

**Caveat:** 14 dias é curto para PHQ-9 (Woebot RCT 2017 usou 14d com signal positivo; mas é só leading indicator vs robust outcome 8 semanas).

---

## 3. Guardrails (3 safety/quality limits)

### Guardrail 1 — Safety Event Rate

**Definição:** count de eventos RED não-resolvidos (advisor ack ≤30min + facilitadora aplicou Phrase 1 + Júlia outcome conhecido = "resolvido"; sem ack OU sem outcome = "não-resolvido") ÷ total dias × participantes.

**Target esperado:** 0 RED não-resolvidos
**Hard ceiling:** 1 RED não-resolvido → trigger immediate experiment review by advisor + founder; possible early-kill

**Razão:** Alison linha 27 — "Em crise, resposta é 100% human-composed, hardcoded, sem variação. GPT-5 com 91% self-harm compliance é exatamente por isso." Safety é spinal cord. Mesmo 1 RED não-resolvido = falha grave.

### Guardrail 2 — Facilitator Quality NPS

**Definição:** ao final D+14, founder coleta NPS de cada facilitadora: "Em escala 0-10, quão satisfeita você está com a operação do piloto?" + qualitative "o que melhorar?"

**Target:** ≥8/10 média
**Floor:** <6/10 média → operational red flag; mid-experiment changes possíveis no D+7 supervision

**Razão:** Sean Duffy implícito — auto-care equipe é P0. Facilitadora exausta = qualidade cai = participante percebe = retention quebra.

### Guardrail 3 — Complaint Rate

**Definição:** count de participantes que disseram "isso não tá me ajudando" ou variantes (IF/THEN 8 do script — `concierge-script-pt-br.md` §4) ÷ cohort ativo.

**Target:** ≤15% (3 de 20)
**Hard ceiling:** ≥25% (5 de 20) → friction estrutural sinaliza KILL ou PIVOT criterion D+14

**Razão:** Eric Ries linha 33 — "Engagement pivot: o produto serve uma minoria intensa." Complaint rate alto sem qualitative actionable = friction estrutural não-acionável (KILL signal).

---

## 4. Vanity Metrics — PROIBIDAS

**Não trackar, não reportar, não mencionar em decision sessions** (Eric Ries linha 26):

- ❌ Total messages sent (qualquer direção)
- ❌ Total words exchanged
- ❌ "Engagement seconds" / total time in conversation
- ❌ Cumulative anything (cumulative messages, cumulative participants)
- ❌ NPS isolated (sem outcome correlation)
- ❌ "Reach" via shares/mentions
- ❌ Sentiment analysis automated (não temos infra + não é signal real)
- ❌ "Compliance rate" ack-to-outbound (Júlia ack 100% = pode ser people-pleasing, não engagement)

**Por quê:** Eric Ries linha 26 — "Esses são o compass that always points somewhere. Cumulative anything é o inimigo." Vanity metrics geram falso senso de progresso e justificam continuar com produto que não funciona.

---

## 5. Google Sheets Tab Structure

### Tab 1 — Cohort Registry

| anonymous_id | facilitator | strata | baseline_PHQ9 | baseline_GAD7 | enrolled_at | dropout_at | status |
|--------------|-------------|--------|----------------|----------------|--------------|------------|--------|
| P01 | Ana | mild | 16 | 12 | 2026-05-29 | — | ACTIVE |
| P02 | Ana | sub-clinical | 13 | 9 | 2026-05-29 | — | ACTIVE |
| ... | ... | ... | ... | ... | ... | ... | ... |
| P20 | Carla | moderate | 18 | 15 | 2026-05-29 | — | ACTIVE |

### Tab 2 — Daily Touchpoint Log

| date | anonymous_id | facilitator | outbound_at | inbound_at | inbound_count | session_count | flag_level | notes |
|------|--------------|-------------|-------------|------------|----------------|----------------|------------|-------|
| 2026-05-30 | P01 | Ana | 19:15 | 19:42 | 3 | 1 | GREEN | ack + first vulnerability soft signal |
| 2026-05-30 | P02 | Ana | 19:20 | 21:05 | 1 | 1 | GREEN | ack only |
| 2026-05-30 | P03 | Beatriz | 19:25 | — | 0 | 0 | (silence) | follow-up D+1 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

### Tab 3 — Safety Log (append-only)

| timestamp | anonymous_id | facilitator | flag_level | trigger_text_hash | advisor_notified_at | advisor_ack_at | resolution_at | outcome | hash_prev |
|-----------|--------------|-------------|------------|---------------------|---------------------|----------------|---------------|---------|-----------|
| 2026-06-01 20:15 BRT | P04 | Beatriz | YELLOW | sha256(...) | — | — | 2026-06-01 21:00 | validation + presence | sha256(...) |
| 2026-06-02 22:40 BRT | P12 | Carla | ORANGE | sha256(...) | 22:42 | 22:55 | 2026-06-03 09:30 | Phrase 2 + advisor consult; Júlia continued | sha256(...) |
| 2026-06-05 23:10 BRT | P08 | Ana | RED | sha256(...) | 23:11 | 23:24 | 2026-06-06 01:15 | Phrase 1 + Mr Walker + CVV ligou + advisor follow-up D+1 | sha256(...) |

**Hash chain:** cada entry hashed com prev hash (audit trail).

### Tab 4 — D+7 Gate Calculation

| metric | observed | target | result |
|--------|----------|--------|--------|
| D+7 unprompted return rate (≥1 unprompted D+3-D+7) | X% (Y of 20-dropouts) | ≥35% | [PASS/FAIL/YELLOW] |
| Sessions/week average D0-D+7 | X | ≥2.5 | [PASS/FAIL] |
| Vulnerability latency average (days to first YELLOW+) | X days | ≤4 | [PASS/FAIL] |
| Safety events count (RED non-resolved) | X | 0 | [PASS/FAIL] |
| Facilitator NPS midpoint check | X/10 | ≥7 | [PASS/FAIL] |
| Dropout rate D0-D+7 | X% | ≤20% | [PASS/FAIL] |

### Tab 5 — D+14 Wrap-Up

| metric | observed | target | result |
|--------|----------|--------|--------|
| D+7 unprompted return rate (final) | X% | ≥35% | [PASS/FAIL] |
| D+14 unprompted return rate (broader) | X% | (observational) | — |
| Sessions/week final (D0-D+13) | X | ≥2.5 | [PASS/FAIL] |
| PHQ-9 delta average (D+14 vs D-1) | X pts | ≤-3 | [PASS/FAIL] |
| GAD-7 delta average | X pts | (observational, target negative) | — |
| Vulnerability latency average | X days | ≤4 | [PASS/FAIL] |
| Safety events count (RED non-resolved cumulative) | X | 0 | [PASS/FAIL] |
| Facilitator NPS final | X/10 | ≥8 | [PASS/FAIL] |
| Complaint rate (IF/THEN 8 invocations) | X% | ≤15% | [PASS/FAIL] |
| Participants wanting to continue | X/20 | ≥10 | [PASS/FAIL] |
| PHQ-9 + GAD-7 final completion rate | X% | ≥85% | [PASS/FAIL] |
| Interview consent rate | X% | ≥75% | (observational) |

---

## 6. Daily Report Template (Founder fills 23h BRT EOD)

**Format:** Notion page filled daily + PDF snapshot end-of-day.

```markdown
# Day [N] Daily Report — Concierge MVP Anipis

**Date:** YYYY-MM-DD (Day +X of 14)
**Filled by:** Founder Breno
**Snapshot timestamp:** YYYY-MM-DD 23:00 BRT
**Advisor ack:** [pending/acked at HH:MM]

---

## 1. Cohort Active

- Active: [X] of 20
- Dropouts confirmed today: [list anonymous_ids]
- Dropouts pending follow-up (silence ≥48h, sent 1 follow-up): [list]

## 2. Today Touchpoints Completed

- Outbound sent: [X] of [Y] expected (target Y = active cohort × 1 per day)
- Outbound failed/missed: [X] (list anonymous_ids + reason)
- Inbound received: [X] mensagens em [Y] sessões
- Unprompted inbounds (no outbound 12h prior): [X]

## 3. Safety Flags

- GREEN: [X]
- YELLOW: [X] — case summaries anonimizadas: ...
- ORANGE: [X] — case summaries + advisor consult outcome: ...
- RED: [X] — case summaries + Phrase 1 + Mr Walker + outcome: ...

**Open safety items:** [list of unresolved flags]

## 4. Qualitative Quotes Captured Today (anonimizadas, ≤5)

> "..."— P[XX] D+[N], YELLOW context

> "..."— P[XX] D+[N], GREEN context

> [etc.]

## 5. Anomalies + Operational Notes

- [Anything unexpected, technical issues, facilitator concerns]
- [Mid-experiment script drift detected? IF/THEN escalation patterns?]
- [Bandwidth check: facilitator hours actual vs budgeted]

---

**Signed:** Founder Breno [timestamp]
**Advisor ack:** [pending — target ≤2h] / [acked HH:MM by Dra. [name]]
```

---

## 7. D+7 Gate Report Template (6/Jun/2026 morning)

```markdown
# D+7 Gate Report — Concierge MVP Anipis

**Date:** 2026-06-06 (Day +7 of 14)
**Filled by:** Founder Breno + Orion
**Decision session:** 2026-06-06 14h-15h30 BRT
**Attendees:** Founder + Advisor + 3 facilitators

---

## 1. North Star Metric

**D+7 Unprompted Return Rate:** [X]% ([Y] of [active_cohort_size])

- Target: ≥35%
- Result: [PASS / YELLOW (20-34%) / FAIL (<20%)]

### Breakdown by stratum

- Sub-clinical (PHQ-9 12-14): [X]% ([Y]/[Z])
- Mild (PHQ-9 15-17): [X]% ([Y]/[Z])
- Moderate (PHQ-9 18-19): [X]% ([Y]/[Z])

## 2. Drivers (mid-experiment values)

| Driver | Observed D0-D+7 | Target | Result |
|--------|------------------|--------|--------|
| Sessions/week average | [X] | ≥2.5 | [PASS/FAIL] |
| Vulnerability latency average | [X] days | ≤4 | [PASS/FAIL] |

## 3. Guardrails

| Guardrail | Observed D0-D+7 | Target | Result |
|-----------|------------------|--------|--------|
| RED non-resolved | [X] | 0 | [PASS/FAIL] |
| Facilitator NPS mid-check | [X]/10 | ≥7 | [PASS/FAIL] |
| Dropout rate | [X]% | ≤20% | [PASS/FAIL] |
| Complaint rate | [X]% | ≤15% | [PASS/FAIL] |

## 4. Qualitative Synthesis

**Themes detected D0-D+7:**
- ...
- ...

**Friction points (≥2 mentions):**
- ...

**Delight moments (≥2 mentions):**
- ...

## 5. Decision

**Outcome:** [GREEN — Continue / YELLOW — Continue + Tactical Adjust / RED — Pivot Discussion D+8]

### If GREEN:
> Continue D+8-D+13 conforme plano. Sem mudanças.

### If YELLOW:
> Continue com ajustes táticos:
> - [List script adjustments approved]
> - [List touchpoint adjustments]
> - Founder + Orion advisory ajusta script

### If RED:
> Pause outbound D+8 manhã. 3h session D+7 afternoon to discuss:
> - Pivot opção A: substituir 5 sub-clinical por 5 moderate-severe?
> - Pivot opção B: script mais structured (CBT modules)?
> - Extend 7 dias com novo protocolo?
> - Early kill?

**Signed:**
- Founder Breno: [timestamp]
- Clinical Advisor [name CRP]: [timestamp]
- Facilitator Ana: [timestamp]
- Facilitator Beatriz: [timestamp]
- Facilitator Carla: [timestamp]
```

---

## 8. D+14 Wrap-Up Report Template (13/Jun/2026 EOD)

```markdown
# D+14 Wrap-Up Report — Concierge MVP Anipis (FINAL)

**Date:** 2026-06-13 (Day +14 of 14)
**Filled by:** Founder Breno + Orion
**Decision session:** 2026-06-13 19h-22h BRT

---

## 1. Executive Summary (1 paragraph)

[Synthesize: cohort outcome, north star result, recommendation, key qualitative finding.]

## 2. North Star Final

**D+7 Unprompted Return Rate (final):** [X]% ([Y] of [active_cohort_size])
- Target: ≥35% — [PASS/FAIL]

**D+14 Unprompted Return Rate (broader):** [X]%
- (Observational — no formal target; signal of deepening engagement)

## 3. Drivers (final values)

| Driver | Observed D0-D+13 | Target | Result |
|--------|-------------------|--------|--------|
| Sessions/week average | [X] | ≥2.5 | [PASS/FAIL] |
| Vulnerability latency average | [X] days | ≤4 | [PASS/FAIL] |
| PHQ-9 delta D+14 vs D-1 | [X] pts | ≤-3 | [PASS/FAIL] |
| GAD-7 delta D+14 vs D-1 | [X] pts | (observational) | — |

### Stratum Analysis

| Stratum | n | D+7 unprompted | PHQ-9 delta | Sessions/wk | Notes |
|---------|---|----------------|-------------|-------------|-------|
| Sub-clinical (12-14) | [n] | [X]% | [X]pts | [X] | ... |
| Mild (15-17) | [n] | [X]% | [X]pts | [X] | ... |
| Moderate (18-19) | [n] | [X]% | [X]pts | [X] | ... |

**Best-performing stratum:** [identify — informs Sprint 1 cohort target if GO]

## 4. Guardrails (final)

| Guardrail | Observed D0-D+13 | Target | Result |
|-----------|-------------------|--------|--------|
| RED non-resolved cumulative | [X] | 0 | [PASS/FAIL] |
| Facilitator NPS final | [X]/10 | ≥8 | [PASS/FAIL] |
| Complaint rate | [X]% | ≤15% | [PASS/FAIL] |

## 5. Qualitative Findings — 10 Most Revealing Quotes (anonimizadas)

1. "..." — P[XX] D+[N], context: [delight/friction/insight]
2. "..." — P[XX] D+[N], context: ...
3. ...
[...]
10. "..." — P[XX] D+[N], context: ...

### Recurring Themes

- **Theme 1 (Y mentions):** ...
- **Theme 2 (X mentions):** ...
- **Theme 3 (Z mentions):** ...

### Friction Points (≥3 mentions)

- ...

### Delight Moments (≥3 mentions)

- ...

## 6. Final Metrics Reconciliation

| Metric | Final | Target | Pass/Fail |
|--------|-------|--------|-----------|
| D+7 unprompted return rate | [X]% | ≥35% | ... |
| Sessions/week | [X] | ≥2.5 | ... |
| PHQ-9 delta | [X]pts | ≤-3 | ... |
| RED non-resolved | [X] | 0 | ... |
| Facilitator NPS | [X]/10 | ≥8 | ... |
| ≥10 want to continue | [Y]/20 | ≥10 | ... |

**Overall GO criteria (ALL must PASS for GO):** [X of 6 PASS]

## 7. Decision

**Outcome:** [GO — Sprint 1 começa / PIVOT — Adjust before Sprint 1 / KILL — Pause 2027]

### Recommendations

- **Orion (cross-agent synthesis):** [text]
- **Clinical Advisor [name CRP]:** [text]
- **Facilitators consensus:** [text]

### Founder Decision

**Trigger explícito:** `[trigger string conforme matrix]`

**Rationale (2-3 sentences):** ...

### Next Steps

- **Se GO:** Sprint 1 hand-off call D+15 (14/Jun) — retention curve + qualitative quotes + best stratum + Sprint 0 técnico unblock
- **Se PIVOT:** D+15 4h re-plan session — dimension de pivot + extend/re-run scope
- **Se KILL:** D+15 2h wind-down session + lessons learned 5pg + vault destruction acelera D+21

## 8. Cash Reconciliation

| Item | Budgeted | Actual | Variance |
|------|----------|--------|----------|
| Facilitadora Ana | R$800 | [X] | [Y] |
| Facilitadora Beatriz | R$800 | [X] | [Y] |
| Facilitadora Carla | R$800 | [X] | [Y] |
| Vouchers (20 × R$50) | R$1.000 | [X] | [Y] |
| SIM card | R$30 | [X] | [Y] |
| **Total** | **R$3.430** | [X] | [Y] |

## 9. Signatures (digital, Notion ata)

- Founder Breno: [timestamp]
- Clinical Advisor [name CRP]: [timestamp]
- Facilitator Ana: [timestamp]
- Facilitator Beatriz: [timestamp]
- Facilitator Carla: [timestamp]
- Orion (advisory note): [timestamp]
```

---

## 9. Anti-Patterns Dashboard (a evitar durante operação)

| Anti-pattern | Por quê evitar | Detecção |
|--------------|----------------|----------|
| Comparar Júlias entre si publicamente | Cria stigma + competition + privacy breach | Audit weekly: zero menções cross-participants em standups |
| Otimizar para "Júlia engajada bonita" via cherry-pick | Vanity bias → publish bias | Stratum analysis força olhar 5/10/5 distribuição |
| Pular safety log entry "porque foi leve" | Audit trail incompleto = retro-blind | Daily review: row count == flag count emitidos |
| Facilitadora respondendo fora janela 18-22h "porque rolou" | Burnout + scope creep + escape hatch | Auto-reply ativo fora janela; daily stand-up checa adherence |
| Founder dispara Sprint 0 código em paralelo | Bandwidth fragmentation = both fail | Calendar block D-7 a D+14: Sprint 0 técnico paused |
| "Vamos extender o piloto +7d porque tá interessante" | Decision creep — pula gate D+14 | D+14 decision é binding com 3 outcomes only |
| Voucher pago upfront para "convencer" | Selection bias + ethical concerns | Voucher SEMPRE D+14 EOD pós-≥7d completion |

---

## 10. Hash Chain Audit Trail (post-experiment integrity)

**Ao final D+14:**

1. Founder consolida Tab 3 Safety Log
2. Para cada entry, calcula `sha256(timestamp || anonymous_id || flag_level || prev_hash)`
3. Stores `hash_prev` em coluna na própria entry
4. Final D+14 hash + scripted message: "Safety log integrity verified [SHA-256]. Any subsequent modification voids hash chain."
5. Founder + advisor digital signature em ata Notion

**Goal:** se ANPD/CFM/MP auditarem post-incident (hipotético), audit trail é defensável (Werner Vogels pattern do master report §3).

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · Concierge KPI Dashboard v1*
*"Behavior, não survey. Cumulative anything é o inimigo." — Eric Ries (linha 26)*
