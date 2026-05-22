# LENS — KPI Dashboard Operacional Concierge MVP Anipis

**Persona:** LENS (Marketing Analytics Agent, marketing-ops)
**Date:** 2026-05-16
**Project:** Anipis — Concierge MVP Sprint -1 (decisão D-02)
**Scope:** Innovation Accounting Ries-style — 14 dias, 20 Júlias, 3 facilitadoras + founder + clinical advisor pro-bono
**Stack ops:** Notion + Google Sheets. Zero analytics tools complexos. Zero código de produto Anipis envolvido.

---

## TL;DR

Sem Innovation Accounting, qualquer atividade visível parece progresso. Esse dashboard separa **aprendizado validado** de **theater de output**. Uma north star, três drivers, sete guardrails, cinco vanity metrics banidas, três templates Notion. Founder + 3 facilitadoras preenchem 5 campos por dia às 19h BRT. D+7 dispara verdict go/pivot/kill. D+14 vira input do Sprint 1.

---

## 1. North Star Metric — D+7 unprompted return rate

**Definição operacional:**

> **% das 20 Júlias que enviaram ≥1 mensagem espontânea entre 00:00 BRT do D+7 e 23:59 BRT do D+7, SEM ter recebido mensagem da facilitadora nas 24h anteriores ao envio.**

**Target:** ≥35% (≥7 de 20)

**Regras de contagem:**

| Regra | Conta? |
|-------|--------|
| Júlia manda "oi" às 22h do D+7 sem ter recebido nada da facilitadora desde 22h do D+6 | SIM |
| Júlia responde mensagem da facilitadora enviada às 14h do D+7 | NÃO |
| Júlia manda áudio espontâneo no D+7 após silêncio ≥24h | SIM |
| Facilitadora enviou "como você está?" às 23:30 do D+6, Júlia responde 00:15 do D+7 | NÃO (dentro janela 24h) |
| Júlia desistiu no D+3, não conta | NÃO (denominador continua 20, churn é informação) |

**Por que não "% volta nos 7 dias":** Ries é claro — *engagement seconds* e métricas cumulativas são *compass that always points somewhere*. Retorno espontâneo num dia específico isola trust formation de novelty effect.

**Quem mede:** facilitadora marca timestamp + flag `unprompted=true/false` no Notion no momento da mensagem. Founder consolida no D+7 às 20h BRT.

---

## 2. Driver Metrics (3) — actionable, não vanity

| # | Métrica | Target | Definição operacional | Quem coleta |
|---|---------|--------|------------------------|-------------|
| D1 | **Sessions/week por Júlia ativa** | ≥2.5 | Sessão = janela de mensagens com gap ≤30min entre msgs. Cada Júlia tem média = total sessões D1-D7 / Júlias ativas (que não desistiram). Computa de novo D8-D14. | Facilitadora tagga início/fim sessão no Notion |
| D2 | **Vulnerability latency** | ≤4 dias mediana | Tempo (em dias inteiros) entre primeira mensagem da Júlia (D0) e primeira mensagem flaggeada como "vulnerável" pela facilitadora usando trigger word list co-criada com clinical advisor (ansiedade explícita, crying, sleep, family conflict, body image, suicidal language). Mediana entre as 20. | Facilitadora flag `vulnerability=true` na mensagem; clinical advisor valida amostra 20% semanal |
| D3 | **PHQ-9 delta D14 vs D0** | ≥3 pts mediana | PHQ-9 aplicado por facilitadora via Notion form no D0 (opt-in) e D14 (wrap-up). Delta = D0 score − D14 score. Mediana entre as 20 (ou as ativas, com flag "n=X completou"). | Facilitadora administra; clinical advisor revisa scoring |

**Por que estes 3 e não outros:**

- **Sessions/week** é proxy de profundidade de engajamento sem cair em "tempo total" (Ries veta).
- **Vulnerability latency** é o *leading indicator* do Ries — se a Júlia só faz small talk até D+4, não há trust formation. Mata o experimento antes do D+7 falhar.
- **PHQ-9 delta** é *outcome, não output*. É o sinal mais barato de que o companion entrega valor clínico real, não só feeling-good.

**Caveats analytics:**

- N=20 não permite poder estatístico. Reportar mediana + IQR + n efetivo, nunca média sem desvio. Atul Butte canon: power análise de verdade só com n≥190 no RCT da semana 16. Aqui é learning, não inferência causal.
- PHQ-9 baseline coletado no opt-in (D0). Sem baseline, D14 vira ruído puro.

---

## 3. Guardrail Metrics (7)

Métricas que **não definem sucesso** mas **bloqueiam continuação** se violadas. São veto, não driver.

| # | Guardrail | Target | Threshold de pausa | Quem mede |
|---|-----------|--------|---------------------|-----------|
| G1 | **Safety event rate** | 0 ocorrências | ≥1 evento Tier-1 (ideação suicida explícita não roteada em <5min) pausa MVP imediato | Facilitadora + clinical advisor real-time |
| G2 | **Facilitator quality NPS** | ≥8/10 mediana | <7/10 mediana D+7 dispara retraining ou troca facilitadora | Júlia responde 1x no D+7 e D+14 via form Notion |
| G3 | **Complaint rate** | ≤5% | >2 Júlias reclamarem formalmente (tone, intrusivo, off-topic) pausa pra triagem | Founder tagga "complaint" na conversa, conta semanal |
| G4 | **Drop-off rate** | ≤25% (≤5 de 20) | >35% (≥7) D+7 → soft-kill, redesenha recrutamento Sprint 1 | Facilitadora marca "dropped" após 72h sem resposta + opt-out check |
| G5 | **Opt-out rate** | ≤10% (≤2 de 20) | ≥3 Júlias pedirem exclusão LGPD = pausa pra audit de tone/safety | Facilitadora registra opt-out timestamp + reason no Notion |
| G6 | **Response time facilitadora** | <2h mediana | >4h mediana ou >8h p95 fora janela noturna (00-08 BRT) pausa pra reescalar turno | Notion calcula timestamp_msg_julia → timestamp_resposta automático |
| G7 | **Qualitative quote captured/dia** | ≥3/dia | <2/dia por 3 dias seguidos = facilitadora não está extraindo aprendizado (treinar) | Facilitadora cola quote literal em campo Notion daily |

**Princípio:** guardrails são *circuit breakers*, não goals. Se G1 dispara, não há "vamos esperar D+7 ver". Pausa, audit, decide.

---

## 4. Vanity Metrics — BANIR explicitamente

Listadas para que ninguém na squad meça, reporte, ou celebre. Eric Ries canon: cumulative anything é o inimigo.

| Vanity metric | Por que é vanity | O que reportar no lugar |
|---------------|------------------|--------------------------|
| **Total mensagens trocadas** | Cresce automático com tempo. Não correlaciona com PMF. Mais msg pode ser ansiedade rolando, não valor. | Sessions/week (D1) |
| **Total tempo no chat (engagement seconds)** | Ries veto explícito + Quinn flag: "usuária ansiosa rolando 40min no chat às 2am é dano, não valor". | PHQ-9 delta (D3) |
| **NPS isolado do produto** ("você indicaria Anipis?") | Hype semântico, não comportamento. Júlia diz sim e nunca volta. | Unprompted return D+7 (North Star) |
| **Total Júlias recrutadas** (cumulativo) | Cresce monotonicamente. N=20 é fixo. Reportar isso é theater. | % das 20 que cruzaram thresholds D1/D2/D3 |
| **Sentiment score médio das mensagens** | Júlia pode escrever "tudo ótimo!" 14 dias e cair fora. Sentiment positivo pode ser politeness, não valor. | Vulnerability latency (D2) |

Se aparecer em qualquer report, riscar com vermelho e substituir. Sem exceção.

---

## 5. Daily Report Template — Notion 1 página, 5 campos, 19h BRT

**Local:** Notion database `Anipis-Concierge-MVP-Daily`. Founder + 3 facilitadoras preenchem todo dia até 19h BRT. Cada dia = 1 row.

```
┌──────────────────────────────────────────────────────────────┐
│ ANIPIS CONCIERGE MVP — DAILY LOG                             │
│ Data: [DD/Mai/2026]  •  Dia: [D+N]  •  Preenchido: 19:00 BRT │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. ATIVAS HOJE (n / 20)                                      │
│    Júlias que enviaram ≥1 msg: [____ / 20]                   │
│    Júlias unprompted (sem reminder 24h): [____]              │
│                                                              │
│ 2. SESSIONS COUNT                                            │
│    Total sessions hoje (todas Júlias): [____]                │
│    Média por Júlia ativa: [____]                             │
│                                                              │
│ 3. VULNERABILITY FLAGS                                       │
│    Júlias com 1ª msg vulnerável HOJE (IDs): [____, ____]     │
│    Total cumulative com flag: [____ / 20]                    │
│                                                              │
│ 4. GUARDRAILS STATUS (🟢/🟡/🔴)                              │
│    Safety events Tier-1: [🟢 0  /  🔴 X]                     │
│    Response time mediana hoje: [____ min]  [🟢<120 / 🔴>240] │
│    Drop-offs novos: [____]                                   │
│    Opt-outs novos: [____]                                    │
│                                                              │
│ 5. QUOTE OF THE DAY (literal, ≥1)                            │
│    "[copiar/colar quote real, com pseudonym ID]"             │
│    Contexto: [1 linha — o que estava acontecendo]            │
│    Insight: [1 linha — o que isso ensina sobre Júlia]        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Regra:** 5 campos, máx 5 minutos preenchimento. Se virou 20 campos, virou fricção e ninguém preenche. Daily report serve facilitadora primeiro, founder segundo.

---

## 6. D+7 Gate Report Template — Decisão go/pivot/kill

**Quando:** D+7 às 20h BRT. Founder + clinical advisor + facilitadora-lead presentes. 30min máx.

**Critérios numéricos absolutos:**

| Métrica | GO | PIVOT | KILL |
|---------|----|----|------|
| **North Star — D+7 unprompted return** | ≥35% (≥7/20) | 20-34% (4-6/20) — segment ou tech pivot | <20% (<4/20) — kill ou redesign completo |
| **D1 — Sessions/week** | ≥2.5 média | 1.5-2.4 | <1.5 |
| **D2 — Vulnerability latency** | ≤4 dias mediana | 5-6 dias | >6 dias |
| **Guardrails** | 0 violações G1; ≤1 G2-G7 | 1 G1 contornado OU 2-3 G2-G7 | ≥2 G1 OU G1 fatal OU ≥4 G2-G7 |

**Regra de decisão:**

- **GO** se North Star + ≥2 drivers + zero G1 → continuar D8-D14 como planejado.
- **PIVOT engagement** se NS 20-34% mas usuárias ativas fazem ≥5 sessões/sem → nicho mais agudo (Ries canon).
- **PIVOT segment** se NS <35% mas universitárias 18-22 engajam 3x mais que 25-29 → mata segundo segmento.
- **PIVOT technology** se NS ≥35% mas D3 PHQ-9 delta projeta <1pt → companion conversa bonito sem mudar comportamento → CBT modules estruturados.
- **KILL** se NS <20% OR ≥2 safety events Tier-1 → não há learning rescue. Sprint 1 não acontece sem rerecrutar / replanear.

**Output do gate:** 1 página Notion `D7-Verdict-[date]` com 4 seções: (a) números observados, (b) decisão tomada (1 dos 5 caminhos), (c) o que muda nos D8-D14, (d) hipóteses revisadas para Sprint 1.

**Anti-pattern proibido:** "vamos esperar mais um dia". D+7 é o gate. Se números pedem kill, kill no D+7. Founder ansiedade ≠ data signal.

---

## 7. D+14 Wrap-Up Dashboard — 10 cards, input Sprint 1

**Quando:** D+14 às 18h BRT. Dashboard Notion publicado em `Anipis-Concierge-D14-Wrap`. Audiência: founder, clinical advisor, eventual investidor, time Sprint 1.

**Os 10 cards (formato fixo, 1 número grande + 1 contexto + 1 implicação):**

| # | Card | Conteúdo |
|---|------|----------|
| C1 | **D+7 Unprompted Return** | %, n/20, contexto, decisão tomada no gate |
| C2 | **D+14 Unprompted Return** | %, n/20 ativas, delta vs D+7 |
| C3 | **Sessions/week por coorte ativa** | mediana D1-D7 / D8-D14, IQR |
| C4 | **Vulnerability Latency** | mediana dias, distribuição (histograma simples Notion) |
| C5 | **PHQ-9 Delta D14 vs D0** | mediana pts, n que completaram, distribuição |
| C6 | **Drop-off & Opt-out final** | absolute counts, momento (D+N), reason categorizado |
| C7 | **Safety Events Totais** | n por tier, root cause cada um, mitigation tomada |
| C8 | **Facilitator NPS** | mediana, comentários qualitativos top-3 |
| C9 | **Top 5 Qualitative Quotes** | quotes literais que mais ensinaram (Júlia voz) |
| C10 | **Pricing Willingness Probe** | n de 10 Júlias oferecidas R$39 continuação que aceitaram, % conversion |

**Regra de qualidade:** zero cards com cumulative metrics. Zero cards com média sem distribuição (mediana + IQR sempre). Cada card termina com 1 linha "implicação para Sprint 1".

**Output Sprint 1 brief:** após cards, 1 página única com 3 decisões — (a) Sprint 1 continua DTC Júlia? (b) Stack tecnológica muda? (c) Qual é a próxima riskiest assumption?

---

## 8. Data Collection Workflow — Notion + Sheets + LGPD

### 8.1. Onde dados vivem

**Notion (operacional, real-time):**

- DB `Anipis-Julias` — 20 rows, 1 por Júlia. Cols: `julia_id` (pseudonym), `recruited_at`, `phq9_d0`, `gad7_d0`, `consent_signed_at`, `dropout_at`, `optout_at`, `facilitator_assigned`, `phq9_d14`, `gad7_d14`, `pricing_probe_response`.
- DB `Anipis-Messages` — 1 row por mensagem. Cols: `julia_id`, `direction` (julia→fac, fac→julia), `timestamp_brt`, `session_id`, `unprompted` (bool), `vulnerability_flag` (bool), `safety_tier` (0-3), `content_redacted` (sumário sem PII, não texto cru).
- DB `Anipis-Sessions` — 1 row por sessão. Cols: `session_id`, `julia_id`, `start_brt`, `end_brt`, `n_messages`, `unprompted_initiated`.
- DB `Anipis-Daily-Log` — 14 rows (1/dia), template §5.
- DB `Anipis-Events` — eventos discretos (safety, complaint, opt-out, gate decisions).

### 8.2. Backup Google Sheets

**Frequência:** export automático Notion → Google Sheets via Notion API + script Apps Script daily às 23h BRT.

**Sheets criadas:**

- `anipis-julias-backup.xlsx` — espelho `Anipis-Julias`
- `anipis-messages-anon.xlsx` — espelho `Anipis-Messages` SEM `content_redacted` (só metadata)
- `anipis-daily-log.xlsx` — espelho daily
- `anipis-events.xlsx` — espelho events

Retenção Sheets: **5 anos** (alinhado LGPD/CFP para dados derivados de saúde mental, mesmo que pseudonimizados — match com Atul Butte canon §RWE pipeline).

### 8.3. Privacy LGPD — anonimização pré-share + access log

**Pseudonimização desde recrutamento:**

- Cada Júlia recebe `julia_id` formato `J01` até `J20`. Mapa `julia_id ↔ nome real ↔ telefone` vive em **single Notion DB privado** `Anipis-PII-Vault` com acesso apenas founder + clinical advisor. Bloqueado para facilitadoras (elas conhecem nome real pelo WhatsApp mas nunca cruzam com analytics).
- Daily logs, weekly reports, wrap-up dashboard → SOMENTE `julia_id`. Nunca nome real, nunca número telefone, nunca CPF.
- Quotes qualitativos (C9 wrap-up): facilitadora redige sumário ou cola quote textual com checagem de PII manual. Se quote contém nome de terceiro (mãe, namorado, terapeuta), substituir por `[mãe]`, `[parceiro]`, `[terapeuta]`.

**Pre-share scrubbing:**

Antes de qualquer share externo (investidor, advisor, time Sprint 1):

1. Filtrar coluna `content_redacted` de qualquer export.
2. Substituir `julia_id` por `P##` (participant ##) — segunda camada de pseudonimização.
3. Founder revisa export em 5min checklist:
   - [ ] Nenhum nome próprio brasileiro
   - [ ] Nenhum telefone (regex `\d{10,11}`)
   - [ ] Nenhum CPF (regex `\d{3}\.\d{3}\.\d{3}-\d{2}`)
   - [ ] Nenhum email
   - [ ] Quotes revistas manualmente

**Access log:**

- Notion DB `Anipis-Access-Log` — append-only manual. Cada vez que founder ou facilitadora acessa `Anipis-PII-Vault`, adiciona row: `actor`, `timestamp_brt`, `julia_id_accessed`, `reason` (1 linha).
- Sweep semanal: founder revisa access log toda segunda 09h BRT. Acessos sem reason justificada = retrain facilitadora.
- Clinical advisor pro-bono acessa sob solicitação formal Notion thread (não DM, não verbal).

**Consent stack:**

- Cada Júlia assina termo digital antes de mensagem #1: (a) participação 14d, (b) coleta PHQ-9/GAD-7 D0 e D14, (c) uso anonimizado para learning interno e eventual paper, (d) direito de exclusão Art. 18 LGPD a qualquer momento, (e) dados retidos 5 anos.
- Termo digitalizado em PDF, armazenado em `Anipis-PII-Vault` com hash SHA-256 do conteúdo.
- Sem termo = sem mensagem. Hard gate.

**Audit trail integrity:**

- N=20 não justifica hash chain Atul-style, mas justifica `Anipis-Access-Log` append-only + revisão semanal. Custo: 5min/sem.
- Se MVP escala para Sprint 1 com N>50, migrar para schema `audit_log` SQL com hash chain (Atul §7.1) — não é problema do Sprint -1.

---

## Resumo executivo — o que LENS entrega

| Categoria | Quantidade | Onde vive |
|-----------|-----------|-----------|
| North star metric | 1 (D+7 unprompted return ≥35%) | Daily log + D+7 gate |
| Driver metrics | 3 (sessions/wk, vuln latency, PHQ-9 delta) | Notion DBs + D+14 wrap |
| Guardrail metrics | 7 (safety, NPS, complaint, drop-off, opt-out, response time, quotes) | Notion + alarme manual |
| Vanity metrics banidas | 5 (total msgs, time, NPS isolado, total Júlias, sentiment) | Riscadas em todo report |
| Templates | 3 (daily 5 campos, D+7 gate, D+14 dashboard 10 cards) | Notion |
| Backup | Google Sheets daily export 23h BRT, retention 5 anos | `anipis-*-backup.xlsx` |
| Privacy controls | Pseudonimização 2 camadas + PII Vault isolado + access log semanal + consent stack | `Anipis-PII-Vault` + `Anipis-Access-Log` |

**Custo total ops:** 5min/dia preenchimento daily × 14 dias = 70min cumulativo. 30min gate D+7. 60min wrap D+14. **Total ≤3h por facilitadora em 14 dias.** Innovation Accounting com fricção mínima.

**Anti-pattern proibido em fechamento:** "vamos esperar mais data". N=20 em 14d é o experimento. Decisão D+7 sai com os números que existem, não com os que gostaríamos de ter. Se números pedem kill, kill. Se pedem pivot, pivot. Theater de "precisamos de mais um sprint pra ver" é exatamente o que o Innovation Accounting existe pra evitar.

— LENS, porque sem métricas actionable, toda atividade visível é theater 📊
