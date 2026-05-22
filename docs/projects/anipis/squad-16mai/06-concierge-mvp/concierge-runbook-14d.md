# Concierge MVP — Runbook Operacional 14 Dias

**Janela:** D-7 (23/Mai/2026) → D+14 (13/Jun/2026)
**Owner orchestrator:** Founder Breno
**Operadoras:** 3 facilitadoras psi (Ana / Beatriz / Carla) — pseudônimos
**Safety oversight:** Clinical advisor pro-bono (CRP ativo, a confirmar)
**Advisory:** Orion (Master Orchestrator AIOS) — dashboards + decisão
**Status:** Ready (versão 1.0)
**Hash D-2:** TBD (sha256 do arquivo + script consolidados D-2)

---

## 0. Roles + Decision Authority Matrix

| Role | Pessoa | Capacity (h/dia) | Decisões que toma | Decisões que escalas |
|------|--------|------------------|-------------------|----------------------|
| **Founder (Orchestrator)** | Breno | 4-6h/d D-7 a D-1; 2-3h/d D0-D13; 6-8h D+14 | Setup, recrutamento, recursos, KPI dashboard, decisão final GO/PIVOT/KILL | Crise YELLOW+ → advisor; mudança de protocol mid-experiment → advisor + Orion |
| **Facilitadora Ana** | A confirmar | 4h/dia D0-D13 (turnos rotativos D+0 a D+13) | Touchpoints daily, mood capture, validação CBT-light, IF/THEN level GREEN/YELLOW | ORANGE+ → founder + advisor ≤30min |
| **Facilitadora Beatriz** | A confirmar | Idem Ana | Idem Ana | Idem Ana |
| **Facilitadora Carla** | A confirmar | Idem Ana | Idem Ana | Idem Ana |
| **Clinical advisor (CRP ativo)** | A confirmar (CISM/USP ou rede CFP) | 30min/dia avg D0-D13; 2h D-2 (script review); 2h D+14 (decision) | Safety oversight, crisis protocol final, encaminhamento formal, weekly supervision | Litígio/incidente → Founder + DPO interim |
| **Orion (advisory)** | AI agent | Sob demanda + daily summary 23h BRT | KPI dashboards, gate report D+7, GO/PIVOT/KILL recomendação D+14, cross-agent synthesis | — (advisory only) |

---

## 1. D-7 a D-1 (23-29/Mai) — Setup

**Goal:** start the cohort em D0 (30/Mai 19h-21h BRT) com 20 participantes prontas, 3 facilitadoras onboarded, clinical advisor assinou ata, dry-run completado.

### D-7 (sáb 23/Mai)

**Founder tasks (4-6h):**
- T1.1 Adquirir SIM card dedicado (operadora indistinta, R$30 ativação)
- T1.2 Registrar WhatsApp Business com número dedicado, configurar profile completo
- T2.1 Iniciar outreach para 3 candidatas facilitadoras via CRP regional + redes USP IPq + indicação clinical advisor
- T3.1 Cold email para 2 CAPS municipais (templates `concierge-recruitment-plan.md` §1)
- T3.2 Cold email para psi grad coordinators USP IPq + UNIFESP saúde mental

**Output esperado:** 5 candidatas facilitadoras retornaram interesse + 2 CAPS confirmaram receber proposta + 2 univs marcaram call.

### D-6 (dom 24/Mai)

**Founder tasks (3-4h):**
- T2.2 Schedule 5 calls 30min cada com candidatas facilitadoras (segunda-feira D-5)
- T4.1 Drafting script base `concierge-script-pt-br.md` (já criado neste pacote — verify com advisor)
- T5.1 Setup Google Sheet "Concierge KPI Dashboard" com 5 tabs structure

### D-5 (seg 25/Mai)

**Founder tasks (4-5h):**
- T2.2 5 calls com candidatas facilitadoras (manhã)
- T2.3 Selecionar 3 finalistas + draft contrato R$800 cada × 14d + termo confidencialidade
- T3.3 Receber retorno CAPS (telefone follow-up se >24h sem resposta)
- T4.2 Schedule review session com clinical advisor para D-3

**Output esperado:** 3 facilitadoras assinaram, contrato em hand.

### D-4 (ter 26/Mai)

**Founder tasks (4h):**
- T2.4 Setup grupo Notion + WhatsApp interno (founder + 3 facilitadoras + advisor)
- T3.3 Receber primeiros leads CAPS + univ — fazer screening PHQ-9 + GAD-7 + critérios inclusão (Google Forms)
- T3.4 Schedule onboarding individual D-1 com participantes confirmadas

**Output esperado:** ≥10 leads triadas, ≥5 com PHQ-9 12-19 confirmadas em pipeline.

### D-3 (qua 27/Mai)

**Founder + advisor (4h founder, 2h advisor):**
- T4.2 Review session clinical advisor: script PT-BR completo, 8 IF/THEN trees, 3 crisis phrases. Ata assinada.
- T2.4 Onboard 3 facilitadoras: brief 2h sobre script + WABA + dashboard + roles
- T3.3 Continuação screening (target 20 leads confirmadas até D-1)

**Output esperado:** Script hash assinado pelo advisor + ata + facilitadoras onboarded.

### D-2 (qui 28/Mai)

**Founder + facilitadoras (4h founder, 4h facilitadoras):**
- T-test-1 Dry-run com 2 voluntárias-teste (não-cohort): cenários A/B/C/D/E (`SAI-CON-001` §5 Testing)
- T-test-2 Crisis runbook stress test às 23h: 1 RED simulado, facilitadora de plantão responde ≤90s, advisor ≤30min
- T3.3 Final screening — confirmar 20 participantes + estratificação 5/10/5

**Output esperado:** Dry-run PASS (5 cenários × 3 facilitadoras = 15 OK) + 20 participantes confirmadas.

### D-1 (sex 29/Mai)

**Founder + facilitadoras (5h founder, 3h cada facilitadora):**
- T3.4 Onboarding individual via WhatsApp (≤30min cada): consent form signed (PDF assinado digital) + baseline PHQ-9 + GAD-7 + 5 perguntas qualitativas + emergency contact opt-in
- T-test-3 Privacy + right-to-delete walkthrough com 1 participante (validação)
- T5.2 Notion runbook page publicada + acessível a 3 facilitadoras + advisor
- Build cohort registry final: 20 entries com (anonymous_id, severity_strata, facilitator_assigned, baseline_metrics)

**Output esperado:** 20/20 onboarded + baseline locked + facilitadoras com 7 participantes cada (7+7+6 distribuição).

---

## 2. D0 (30/Mai/2026, sáb) — Cohort kick-off

**Goal:** 20/20 participantes recebem welcome message + primeiro touchpoint, ack rate ≥18 nas primeiras 24h.

**Janela operacional:** 19h-21h BRT.

**Plano por hora:**

| Horário BRT | Owner | Ação |
|-------------|-------|------|
| 18h | Founder | Daily stand-up pre-kick-off: 3 facilitadoras + advisor, 15min call |
| 19h-19h30 | Ana | Send Welcome Message 4-bubble a 7 participantes |
| 19h-19h30 | Beatriz | Send Welcome Message 4-bubble a 7 participantes |
| 19h-19h30 | Carla | Send Welcome Message 4-bubble a 6 participantes |
| 19h30-21h | Todas | Monitorar acks, responder primeira interaction |
| 21h-21h30 | Founder | Day-end report: ack rate, qualquer flag, dropouts |
| 22h | Founder | Snapshot Sheet + advisor notify (ata digital) |

**Critério PASS D0:** ≥18 de 20 ack-ed (90%); ≥15 de 20 com ≥1 mensagem além do ack (75%).

**Se <18 ack:** advisor + founder discutem D+1 outreach personalizado para 2-5 silenciosas; não tirar do cohort no D0 (dar 48h grace period).

**Safety:** mesmo no D0, qualquer ORANGE+ → escala imediato. Plantão D0: Founder (até 23h) + Ana (até 1h BRT) + advisor on-call.

---

## 3. D1 a D6 (31/Mai - 5/Jun) — Cohort warm-up + first vulnerability window

**Goal:** estabelecer ritmo daily, capturar vulnerability latency, primeiro mood signal, identificar dropouts cedo.

### Daily rotina (cada dia D1-D6)

| Horário BRT | Owner | Ação |
|-------------|-------|------|
| 18h-22h | Facilitadoras | Daily touchpoint conforme script §2 (D1: check-in suave, D2: sono, D3: marco "voltar", D4: especificidade, D5: body, D6: rede apoio) |
| 18h-22h | Facilitadoras | Responder inbound participantes (incl. unprompted returns) |
| 22h-22h15 | Founder + 3 facilitadoras | Stand-up 15min (Notion ou call): flags do dia, dropouts, ajustes |
| 22h15-22h45 | Founder | Update KPI Dashboard + safety log entries |
| 23h | Founder | Day-end PDF snapshot + advisor digital ack |

**Métricas trackadas dia-a-dia:**
- Daily ack rate (% participantes que responderam outbound do dia)
- Unprompted returns count (mensagens espontâneas SEM outbound recente 12h)
- Vulnerability latency: D+N até primeira mensagem com flag YELLOW ou maior
- Flags count: GREEN / YELLOW / ORANGE / RED (target: 0 RED não-resolvidos)
- Dropouts: participante que silenciou ≥48h consecutivas (D6: ≥3 dias)

### Mid-week supervision (5/Jun, sex D+6 noite)

**60min call:** advisor + 3 facilitadoras + founder
- Cases anonimizados (3-5 cases revisados)
- Calibragem IF/THEN trees
- Identificar drift no script (facilitadora ad-libbing)
- Saúde mental facilitadoras (Sean Duffy: "self-care P0")

---

## 4. D+7 (6/Jun, sáb) — GATE CHECKPOINT (CRÍTICO)

**Goal:** decisão go/yellow-flag/pivot-discussion sobre PASS D+7 unprompted return rate ≥35%.

### D+7 morning (8h-12h BRT)

**Founder + Orion (4h):**
- Consolidar KPI dashboard D0-D+6 (todos os dados)
- Calcular north star metric: **D+7 unprompted return rate**
  - Definição operacional: # participantes que enviaram ≥1 mensagem espontânea ao Anipis-Concierge entre D+3 (2/Jun) e D+7 (6/Jun) **SEM ter recebido outbound nas 12h anteriores** ÷ total participantes ativas (subtraindo dropouts confirmados D0)
  - Target: ≥35% (7 de 20)
- Calcular drivers:
  - Average sessions/week por participante (target: ≥2.5)
  - Vulnerability latency média (target: ≤4 dias)
  - Flags distribution (target: 0 RED não-resolvidos)
- Generate D+7 Gate Report (`concierge-kpi-dashboard.md` §D7 Gate Report Template)

### D+7 afternoon (14h-18h BRT)

**Founder + advisor + 3 facilitadoras: 90min decision call**

**Decision criteria:**

| Outcome | Critério | Ação |
|---------|----------|------|
| **GREEN — Continue** | D+7 unprompted ≥35% + 0 RED não-resolvidos + facilitator NPS ≥7 | Continuar D+8-D+13 conforme plano, sem mudanças |
| **YELLOW — Continue but flag** | D+7 unprompted 20-34% + 0 RED não-resolvidos | Continuar com ajuste tático (ex: D+8 touchpoint mais especifico, retention call pra silenciosas) — Orion advisory ajusta script |
| **RED — Pivot discussion D+8** | D+7 unprompted <20% OU ≥1 RED não-resolvido OU facilitator NPS <6 | Pause outbound D+8 manhã. Founder + advisor + Orion fazem session 3h discussing: continuar com pivot de cohort (substituir 5 sub-clinical por 5 moderate-severe?) / pivot de script (mais structured CBT? menos open-ended?) / extend 7 dias / kill early |

### D+7 evening (19h-22h)

- Daily touchpoint D+7 do script ("uma semana já. Como descreveria 7 dias em uma frase?")
- Daily stand-up 22h
- Day-end report incluindo Gate decision

**Document output:** `concierge-kpi-dashboard.md` D+7 Gate Report assinado por founder + advisor (digital signature + ata Notion).

---

## 5. D+8 a D+13 (7-12/Jun) — Behavioral activation window + wrap prep

**Goal:** behavioral activation opt-in (D8), data-back longitudinal (D11), preparar fechamento (D12-D13).

### Daily rotina D+8-D+13

Idem D1-D6 (touchpoints conforme script §2 D8-D13). Diferenças:

- **D+8 (7/Jun):** behavioral activation opt-in. Track quantas optaram in (target ≥40% — Sean Duffy: behavioral activation > companion).
- **D+9 (8/Jun):** follow-up D8 ação (se experimentou anotar 3 coisas) + validate sem positivity tóxica.
- **D+10 (9/Jun):** permissão de pausa explícita (Ethical UX Charter commandment 6). Esperado: 1-2 participantes pausarão (não dropout — sinal saudável).
- **D+11 (10/Jun):** data-back longitudinal — facilitadora cita tema X de D1-D5. Sinal de escuta.
- **D+12 (11/Jun):** antecipar fechamento, abrir espaço pré-wrap.
- **D+13 (12/Jun):** preparar PIX + 2 perguntas finais combinado.

### Mid-week supervision D+11 (10/Jun, qua noite)

Idem D+6 — 60min advisor session.

---

## 6. D+14 (13/Jun, sex) — Wrap-up + Decision

**Goal:** PHQ-9 + GAD-7 post coletados ≥17 de 20 (85%), qualitative interviews agendadas ≥15, voucher PIX 100% das participantes ≥7d, decisão GO/PIVOT/KILL documentada EOD.

### D+14 morning (9h-13h BRT)

**Founder + Orion (4h):**
- Consolidar KPI dashboard D0-D+13 final
- Calcular métricas finais:
  - D+7 unprompted return rate (confirmar)
  - D+14 unprompted return rate (broader window)
  - Sessions/week average por cohort + per stratum (sub-clinical/mild/moderate)
  - PHQ-9 delta médio (post-D14 vs baseline D-1) — coleta in-flight, dado parcial
  - GAD-7 delta médio (idem)
  - Vulnerability latency average
  - Safety event rate (count RED + ORANGE)
  - Facilitator NPS (3 facilitadoras × 10-point)
  - Complaint rate (count IF/THEN 8 occurrences)

### D+14 afternoon (14h-18h BRT)

**3 facilitadoras (3h cada — paralelo):**
- Enviar wrap message 5-bubble conforme script §7
- Enviar PHQ-9 + GAD-7 forms link
- Solicitar audio 1-2min qualitative
- Solicitar consent post-data uso
- Confirmar chave PIX
- Enviar PIX R$50 em ≤6h (founder executa via banco app)

**Founder (3h paralelo):**
- Track PHQ-9/GAD-7 form completions
- Aggregate qualitative quotes (10 mais reveladoras)
- Cross-check vouchers enviados

### D+14 evening (19h-23h BRT) — DECISION SESSION

**Founder + advisor + Orion + 3 facilitadoras (4h):**

**Step 1 (1h) — Apresentação dados:**
- KPI dashboard final
- 10 quotes anonimizadas mais reveladoras
- Stratum analysis (sub-clinical vs mild vs moderate ótimo)
- Safety events review
- Facilitator NPS breakdown

**Step 2 (1.5h) — Decision criteria evaluation:**

| Outcome | Critério absoluto | Trigger user explícito |
|---------|-------------------|------------------------|
| **GO — Sprint 1 começa** | ALL of: D+7 unprompted ≥35% + sessions/week ≥2.5 média + PHQ-9 delta ≥3pts média + 0 RED não-resolvidos + facilitator NPS ≥8 + ≥10 de 20 desejam continuar | `vai com sprint 1 anipis` |
| **PIVOT — Adjust before Sprint 1** | 1-2 dimensões abaixo + tendência positiva (ex: D+7 30% mas qualitative reveals friction acionável; PHQ-9 delta 2pts mas sub-clinical strata diluiu) | `pivot anipis para [nicho/segmento/script]` ou `extend concierge +7d` |
| **KILL — Pause Anipis 2027** | ≥3 dimensões abaixo + qualitative reveals friction estrutural não-acionável (ex: D+7 <20% + PHQ-9 delta <1pt + facilitator NPS <6 + complaint rate >25%) | `kill anipis volta 2027` |

**Step 3 (1h) — Recomendação tripla:**
- Orion recomenda (cross-agent synthesis + KPI dashboard)
- Clinical advisor recomenda (safety + clinical lens)
- 3 facilitadoras consensus (operational lens)

Discrepância entre 3? Discutir até concordância OU founder decide tie-break (autoridade final).

**Step 4 (0.5h) — Document final decision:**

Em `concierge-runbook-14d.md` §"Final Decision" (preencher em D+14 EOD):

```markdown
## Final Decision — D+14 (13/Jun/2026 EOD)

**Outcome:** [GO / PIVOT / KILL]

**Métricas observadas vs critérios:**
- D+7 unprompted return rate: [X]% (target ≥35%) — [PASS/FAIL]
- Sessions/week média: [X] (target ≥2.5) — [PASS/FAIL]
- PHQ-9 delta média: [X]pts (target ≥3) — [PASS/FAIL]
- GAD-7 delta média: [X]pts (no formal target, observational)
- Safety events não-resolvidos: [X] RED (target 0) — [PASS/FAIL]
- Facilitator NPS: [X]/10 (target ≥8) — [PASS/FAIL]
- ≥10 participantes desejam continuar: [Y/N] — [PASS/FAIL]
- Complaint rate: [X]% (target ≤15%)

**Qualitative summary — 10 quotes mais reveladoras anonimizadas:**
1. ...
2. ...
[...]
10. ...

**Stratum analysis:** [qual cohort funcionou melhor — sub-clinical/mild/moderate]

**Recomendação Orion:** [texto]
**Recomendação Clinical Advisor:** [texto]
**Consensus 3 facilitadoras:** [texto]

**Decisão founder:** [GO / PIVOT / KILL] com trigger explícito: `[trigger string]`

**Signatures (digital, Notion ata):**
- Founder Breno: [timestamp]
- Clinical Advisor [name CRP]: [timestamp]
- Facilitator Ana: [timestamp]
- Facilitator Beatriz: [timestamp]
- Facilitator Carla: [timestamp]
- Orion (advisory note): [timestamp]
```

**Step 5 (15min) — Comunicação:**
- Founder publica decision em squad Notion + WhatsApp interno
- Founder envia 1 mensagem agradecimento à 20 participantes
- Founder schedule call seguinte com Orion para hand-off Sprint 1 (se GO) ou pivot planning (se PIVOT) ou wrap kill (se KILL)

---

## 7. D+15 a D+21 (14-20/Jun) — Post-experiment analysis

**Goal:** completar 15 qualitative interviews, anonymize data, publish wrap report PDF.

### D+15-D+21 (semana pós-wrap)

- **3 facilitadoras (10h cada total):** conduzir 5 interviews cada (15 total) entre D+15 e D+21
  - Roteiro: 5 perguntas semi-estruturadas (`concierge-recruitment-plan.md` §5 post-interview script)
  - 10-15min cada
  - Gravar áudio (consent já capturado D+14)
- **Founder (15h durante semana):** transcrever áudios via Whisper (`D:\tools\transcrever.bat`) + coding qualitativo + relatório final

### D+21 (20/Jun, sex) — Wrap Report PDF assinado

**Outputs:**
- `concierge-mvp-wrap-report.pdf` — 8-12 páginas
  - Executive summary (1pg)
  - Methodology (1pg)
  - Quantitative results: north star + drivers + guardrails (2pg)
  - Stratum analysis (1pg)
  - Qualitative findings: themes + quotes (2-3pg)
  - Decision rationale (1pg)
  - Next steps (1pg)
- Signed digitalmente: founder + advisor + Orion (advisory note)
- Distribuição: squad Anipis + cap table relevant (clinical co-founder candidate se já recrutado)
- **Anonymized:** zero PII

### D+30 (29/Jun, dom) — Data deletion deadline

**Founder:**
- Apagar mensagens brutas WhatsApp Business (export trail destruction)
- Manter só relatório anonimizado + KPI dashboard sem PII
- Vault anonymous_id ↔ identidade real destruído (encrypted key apagada)
- Notion ata final: "Data destruction completed 29/Jun, signed Founder"

---

## 8. Crisis Escalation Runbook (always-on D0-D+14)

### Severity levels + SLA

| Level | Definition | Owner first response | SLA first response | Advisor escalation | Outcome required |
|-------|------------|----------------------|---------------------|---------------------|------------------|
| **GREEN** | Mood baseline ou positive | Facilitadora | ≤2h (operação 18h-22h) | — | Log entry only |
| **YELLOW** | Vulnerability moderada, sem ideação | Facilitadora | ≤30min | ≤4h (advisor read-only) | Validation + presence; log |
| **ORANGE** | Vulnerability alta, sinal indireto ideação | Facilitadora + advisor | ≤10min | ≤30min advisor consult | Phrase 2 (script §5) + plan |
| **RED** | Ideação direta OU autoagressão imediata | Facilitadora + advisor + founder | ≤90s | ≤30min advisor + decisão SAMU/CAPS | Phrase 1 (script §5) + Mr. Walker + outcome documented |

### RED workflow detail

1. **T+0s** — Facilitadora detecta RED na mensagem (palavras-chave canônicas Voice v2 §"Crisis copy" + clinical judgment)
2. **T+90s** — Facilitadora envia Phrase 1 (3 bubbles consecutivos)
3. **T+2min** — Facilitadora aciona advisor via WhatsApp emergency channel + phone call se >5min sem advisor ack
4. **T+5min** — Founder notified
5. **T+30min** — Advisor decide:
   - Júlia ligou CVV + advisor confirma estabilização → ORANGE post-crisis (Phrase 3 stay-with-user)
   - Júlia recusa ligar OR sinal de risco físico imediato → advisor coordena SAMU 192 via emergency contact OR direct CAPS de referência
   - Júlia silent ≥30min após Phrase 1 → advisor tenta contato direto via call (consent form D-1 captura número alternativo emergency)
6. **T+1h** — Founder + advisor + facilitadora documentam em safety log: timestamp, full transcript, advisor decision, outcome
7. **T+24h** — Advisor escreve post-incident note + recommendation (continuar / encaminhar terapia formal / withdrawal from cohort with continued care)
8. **T+7d** — Wellness check follow-up if Júlia chose to continue cohort

### Off-hours coverage (22h BRT - 18h BRT next day)

- **Auto-reply WABA:** "Recebi sua mensagem. Volto a falar entre 18h-22h. Se for urgente: CVV 188."
- **Rotativo on-call:** 1 facilitadora monitora WABA das 22h-1h BRT (cada noite uma facilitadora)
- **Advisor on-call:** advisor disponível 24/7 via WhatsApp emergency channel (acordado D-3 ata)
- **Founder on-call:** 22h-7h BRT (acordado em consent form D-1: "se houver sinal de risco imediato, advisor pode autorizar contato direto founder")

### Documentation immutável

- Append-only Google Sheet "Safety Log"
- Cada entry: timestamp + anonymous_id + facilitator_id + flag_level + advisor_notified_at + resolution_at + outcome_text
- Hash chain (manual SHA-256 ao final D+14): cada linha hashed com previous hash (audit trail tipo Werner Vogels)

---

## 9. Bandwidth Budget Founder

| Período | Horas/dia | Tarefas |
|---------|-----------|---------|
| D-7 a D-1 (setup) | 4-6h/dia | Recrutamento, screening, dry-run, advisor sync |
| D0 (kick-off) | 8h | Daily kick-off + monitoring + day-end |
| D1-D6 | 2-3h/dia | Stand-up + dashboard + advisor ack |
| D+7 (gate) | 6-8h | Morning calc + afternoon decision + evening touchpoint monitor |
| D+8-D+13 | 2-3h/dia | Stand-up + dashboard + advisor ack |
| D+14 (decision) | 8-10h | Wrap monitor + decision session + documentation |
| D+15-D+21 | 2-3h/dia | Interview support + transcription + coding |
| D+21 (wrap PDF) | 6h | Final report writing |
| D+30 (data destruction) | 1h | Cleanup |

**Total bandwidth founder D-7 a D+30:** ~120 horas (3 semanas full-time equivalent fragmentado por 5 semanas).

**IMPORTANT — não disparar Sprint 0 técnico em paralelo durante D-7 a D+14.** Concierge tem prioridade absoluta de bandwidth founder neste período (Eric Ries linha 16). Sprint 0 técnico decisões (D-03 stack, D-06 crisis classifier) ficam paused até decisão D+14.

---

## 10. Cash Budget Reconciliation

| Item | Budgeted | Notes |
|------|----------|-------|
| SIM card + WABA setup | R$30 | Operadora indistinta |
| Facilitadora Ana (14d) | R$800 | Cash, PIX D+14 EOD |
| Facilitadora Beatriz (14d) | R$800 | Idem |
| Facilitadora Carla (14d) | R$800 | Idem |
| Vouchers participantes (20 × R$50) | R$1.000 | PIX D+14 cada |
| PIX taxas (estimativa) | R$0 | Geralmente gratuito |
| **Total cash burn** | **R$3.430** | Aderente master-report §9 banda |

**Reconciliação D+14 EOD:** founder confirma cada transferência foi executada e categorizada. Variance ±10% aceitável.

---

## 11. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CAPS não retorna em D-5 | Médio (40%) | Alto (cohort não preenchido) | Univ pública é fallback paralelo (USP IPq + UNIFESP); D-3 ainda hábil |
| ≥1 RED flag durante operação | Alta (50%) | Crítico (safety) | Runbook §8 + advisor SLA + Mr. Walker; dry-run D-2 valida |
| Facilitadora desiste mid-experiment | Médio (25%) | Alto (workload realloc) | Buffer 7 participantes/facilitadora deixa folga; founder pode assumir 3-4 dia se necessário |
| Dropout rate >30% D+7 | Médio (35%) | Alto (signal pollution D+7) | Stratify analysis controla; D+7 gate decisão considera dropout-adjusted rate |
| Advisor não disponível RED ≤30min | Baixa (10%) | Crítico | Backup advisor identificado D-3 (2º CRP); CVV é primary line de qualquer forma |
| Vazamento dados | Baixa (5%) | Crítico (LGPD + reputational) | Vault encriptado AES-256 + WABA non-cloud backup + facilitadoras assinaram NDA |
| Júlia identifica facilitadora real (privacidade reversa) | Baixa (15%) | Médio | Pseudônimos + número dedicado + perfil neutro; ack risk em consent |
| Founder bandwidth exhaustion | Alta (60%) | Médio | 4-6h/dia budget realista; Sprint 0 técnico paused durante D-7 a D+14 |

---

## 12. Hand-off pós-decisão (D+14 EOD)

### Se GO

Founder + Orion schedule call D+15:
- Hand-off retention curve + qualitative quotes + stratum analysis para Sprint 1 planning
- Definir cohort target para beta closed Sprint 4 (qual stratum funcionou melhor?)
- Trigger user: `vai com sprint 1 anipis` desbloqueia Sprint 0 técnico (4 spikes Demis-style + Sprint 1 housekeeping)

### Se PIVOT

Founder + advisor + Orion 4h session D+15:
- Identificar dimensão de pivot (cohort/script/extend)
- Re-plan Sprint -1.5 (extend 7d ou re-run com novo cohort?)
- Trigger user: `pivot anipis para [X]` documenta o pivot

### Se KILL

Founder + advisor 2h session D+15:
- Identificar root cause friction estrutural não-acionável
- Decide: pause projeto até 2027 (Halle wins de outra forma) OR pivot total (nicho mais agudo Eric Ries Insight 3 do master report)
- Trigger user: `kill anipis volta 2027` documenta wind-down
- Vault destruction acelera para D+21 (não D+30)
- Lessons learned doc 5pg + cap table cleanup

---

## 13. Final Decision Section (template — preencher D+14 EOD 13/Jun)

**(Preencher 13/Jun/2026 EOD após decision session — Step 4 §6)**

```markdown
## Final Decision — D+14 (13/Jun/2026 23:00 BRT)

**Outcome:** [GO / PIVOT / KILL — preencher]

**Métricas observadas vs critérios:**
[preencher cf template §6 Step 4]

**Qualitative summary — 10 quotes mais reveladoras anonimizadas:**
[preencher]

**Stratum analysis:**
[preencher]

**Recomendação Orion:** [preencher]
**Recomendação Clinical Advisor:** [preencher]
**Consensus 3 facilitadoras:** [preencher]

**Decisão founder:** [preencher] com trigger explícito: `[trigger]`

**Signatures (digital, Notion ata):**
- Founder Breno: [timestamp]
- Clinical Advisor [name CRP]: [timestamp]
- Facilitator Ana: [timestamp]
- Facilitator Beatriz: [timestamp]
- Facilitator Carla: [timestamp]
- Orion (advisory note): [timestamp]
```

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · Concierge Runbook 14d v1*
*"Behavior, não survey. A Júlia decide se Anipis existe ou não — e ela decide pelo dedo no telefone, não pela nossa fé no backend."* — Eric Ries (paraphrased)
