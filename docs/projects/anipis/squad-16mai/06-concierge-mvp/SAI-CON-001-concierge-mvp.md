# SAI-CON-001 — Concierge MVP Humano Sprint -1 (WhatsApp Business + 20 Júlias)

**Story ID:** SAI-CON-001
**Epic:** EPIC-CON — Concierge MVP Pre-Sprint Validation
**Tipo:** Validation experiment (Eric Ries Concierge MVP pattern)
**Status:** Ready
**Owner:** Founder Breno + 3 facilitadoras psi supervisionadas
**Reviewers:** Clinical co-founder candidate (a recrutar) + Orion (advisory)
**Sprint:** Sprint -1 (16-30/Mai/2026)
**Janela operacional do MVP:** 30/Mai/2026 → 13/Jun/2026 (14 dias)
**Decisão originária:** D-02 (`01-decisions-needed.md` linhas 41-61) — fechada 2026-05-16 via bulk trigger `aceito recomendações orion p0a`
**Story Points:** N/A (não é código produto — é experimento operacional pré-Sprint 0)

---

## 0. Why this story exists (1 parágrafo)

O backend Anipis está ~70% implementado (Fastify 5 + Drizzle + 23 tabelas + safety classifier 4 níveis PT-BR + output filter 7-stage + crisis protocol). Apesar disso, **zero Júlias reais conversaram com qualquer protótipo de Anipis** — todo o roadmap Sprint 1-6 do PRD assume comportamento humano não-validado: "Júlia 18-29 vai abrir o app no dia 3+ sem reminder". Eric Ries (`D:/AIOS/docs/projects/anipis/squad-16mai/04-clone-conclave/c-gtm-beta/eric-ries.md` linha 16) é categórico: "Behavior, não survey. Wizard of Oz mascara a hipótese mais arriscada (retention/trust) porque a UI completa cria placebo de produto. Concierge expõe o nervo." Esta story executa **um Concierge MVP humano via WhatsApp Business com 20 Júlias recrutadas via CAPS + universidade pública** (Alison Darcy linha 30: "Recrutem via parceria com 2-3 CAPS municipais + 1 universidade pública — essas são as Júlias com PHQ-9 12-19 que vocês precisam"), operado por 3 facilitadoras psi supervisionadas, durante 14 dias (30/Mai → 13/Jun), medindo **D+7 unprompted return rate ≥35%** como gate primário antes de Sprint 1 começar em código.

---

## 1. Story

**As a** founder não-técnico (Breno) operando em condições de incerteza extrema (Ries) com 3 facilitadoras psi supervisionadas e 1 clinical advisor pro-bono,
**I want** rodar um Concierge MVP humano de 14 dias via WhatsApp Business com 20 Júlias 18-29 recrutadas exclusivamente via CAPS municipal + universidade pública (não Instagram, não Meta Ads),
**so that** validamos a assumption comportamental mais arriscada do Anipis ("Júlia volta no dia 3+ sem reminder") **antes** de gastar Sprint 1-6 (10 semanas) em código que pode ser baseado em premissa falsa — e produzimos um GO/PIVOT/KILL decision documentado D+14 baseado em métrica acionável (D+7 unprompted return ≥35%) + PHQ-9 delta + qualitative interviews.

---

## 2. Acceptance Criteria

Sequenciados D-7 → D+14 (calendar absoluto: D0 = 30/Mai/2026; D-7 = 23/Mai; D+14 = 13/Jun).

### Setup (D-7 a D-1, 23-29/Mai)

- [ ] **AC1.** WhatsApp Business account registrada e verificada com número dedicado ao Concierge (não usar número pessoal do founder), Display Name "Anipis Companion (piloto)", profile photo placeholder, business description com disclaimer "experimento de pesquisa, não substitui profissional".
- [ ] **AC2.** 3 facilitadoras psi recrutadas e onboarded: graduandas finais ou pós-graduandas psicologia em CRP-supervisão clínica formal documentada (supervisor com CRP ativo assinou ata de supervisão semanal), aceitaram termo de confidencialidade + sigilo LGPD-compatible, completaram dry-run de 4h com 2 voluntárias-teste.
- [ ] **AC3.** Clinical advisor pro-bono identificado (CRP ativo, idealmente CISM/USP ou rede CFP regional — D-04 D-08 do squad) e aceitou role de safety oversight com SLA ≤4h resposta a flags amarelo/vermelho, ≤30min a flags vermelho confirmado, mensagens de boas-vindas + closure assinadas por ele/ela.
- [ ] **AC4.** Recrutamento das 20 Júlias completado e estratificado conforme Alison Darcy (deliverable §3): 5 PHQ-9 12-14 (sub-clinical) + 10 PHQ-9 15-17 (mild-moderate) + 5 PHQ-9 18-19 (moderate); **0** participantes com PHQ-9 ≥20 (encaminhadas a terapia formal) ou ideação suicida ativa (encaminhadas CAPS/CVV imediatamente). Critério inclusão: 18-29F (ou gender amplo conforme self-id), via 2 CAPS municipais + 1 universidade pública.
- [ ] **AC5.** Baseline coletado das 20 participantes em D-1 ou D0: PHQ-9 + GAD-7 + 5 perguntas qualitativas semi-estruturadas + consent form LGPD-compliant assinado (digital ou imagem). Resultados em planilha imutável (Notion + Google Sheets + snapshot PDF assinado pelo clinical advisor).
- [ ] **AC6.** Script CBT-light + positive psychology revisado e assinado pelo clinical advisor antes de D0 (ata + version-hash do script registrada). Todas as 8 IF/THEN clinical decision trees + 3 crisis escalation phrases + 5 do/don't language patterns validados (cross-reference com `07-VOICE-REFINED.md`).
- [ ] **AC7.** Crisis escalation runbook testado em dry-run com 2 voluntárias simulando RED flags ("não aguento mais viver"): as 3 facilitadoras responderam ≤90s com phrase canônica, advisor confirmou recebimento em ≤30min, log imutável escrito.

### Execução (D0 a D+13, 30/Mai a 12/Jun)

- [ ] **AC8.** D0 (30/Mai) — Welcome message enviada a 20/20 participantes em janela 19h-21h BRT, primeiro touchpoint personalizado por facilitadora (não broadcast genérico) executado conforme `concierge-script-pt-br.md` §"Mensagem de boas-vindas dia 0", todas as 20 retornaram ack no canal nas primeiras 24h (se <18 retornarem, AC10 trigger).
- [ ] **AC9.** Daily touchpoints D1-D6 e D8-D13 executados conforme protocol (`concierge-script-pt-br.md` §"14 daily touchpoints"): 1 mensagem outbound por dia por participante, janela 18h-22h BRT, ≤4 facilitadoras-mensagem por participante por dia (anti-spam), log diário em Google Sheets com 5 campos (`concierge-kpi-dashboard.md` §Daily report).
- [ ] **AC10.** Safety log imutável mantido durante todos os 14 dias: append-only Google Sheet com timestamp + participant_anonymized_id + flag_level (GREEN/YELLOW/ORANGE/RED) + facilitator_id + advisor_notified_at + resolution_at + outcome. **0 RED flags não-resolvidos** ao fim de D+14; toda RED documentada com ≤30min advisor escalation.
- [ ] **AC11.** **D+7 (6/Jun) gate checkpoint** — KPI dashboard report gerado com unprompted return rate calculado: número de participantes que enviaram mensagem espontânea ao Anipis-Concierge em qualquer momento entre D+3 e D+7 SEM ter recebido outbound nas 12h anteriores. **Target: ≥35% (7 de 20).** Resultado documentado em `concierge-kpi-dashboard.md` D7 report; se <20%, trigger PIVOT discussion D+8.
- [ ] **AC12.** D+14 (13/Jun) wrap-up: post-PHQ-9 + post-GAD-7 coletados de ≥17 de 20 participantes (85% retention mínima na coleta — não na intervenção), qualitative interview 10-15min agendada e executada com ≥15 de 20 participantes, voucher R$50 (PIX) enviado a 100% das participantes que completaram ≥7 dias.

### KPI + Decision (D+14, 13/Jun EOD)

- [ ] **AC13.** KPI dashboard live durante todos os 14 dias acessível ao founder + advisor + Orion (read-only para facilitadoras), atualizado ≥1×/dia EOD com métricas conforme `concierge-kpi-dashboard.md`: north star (unprompted return rate), 3 drivers (sessions/week, vulnerability latency, PHQ-9 delta), 3 guardrails (safety event rate, facilitator NPS, complaint rate).
- [ ] **AC14.** Gate criteria documentado e versionado em `concierge-runbook-14d.md` §"D+7 GATE" e §"D+14 GO/PIVOT/KILL": critérios numéricos absolutos para GO Sprint 1 (≥35% D+7 unprompted + ≥2.5 sessions/week média + PHQ-9 delta ≥3pts média + 0 RED não-resolvidos + facilitator NPS ≥8) vs PIVOT (1-2 dimensões abaixo do GO mas tendência positiva — pivot de segmento/cohort/script) vs KILL (≥3 dimensões abaixo + qualitative interviews revelam friction estrutural não-acionável).
- [ ] **AC15.** **GO/PIVOT/KILL decision documentada D+14 EOD (13/Jun 23:59 BRT)** em `concierge-runbook-14d.md` §"Final Decision" com: (a) métricas absolutas observadas vs critérios, (b) qualitative summary 10 quotes anonimizadas mais reveladoras, (c) recomendação Orion + clinical advisor + facilitadoras concordância, (d) trigger user explícito (`vai com sprint 1 anipis` / `pivot anipis para nicho X` / `kill anipis volta 2027`), (e) signatures founder + advisor + 1 facilitator.

### Operational Hygiene (em paralelo D-7 a D+14)

- [ ] **AC16.** Consent + LGPD trail: cada participante tem (1) consent form assinado + ID validado (foto RG mascarada last 4 dig), (2) anonymous_id mapping em vault separado acessível só ao founder, (3) right-to-delete enforced (apagar com ≤24h request). Voucher R$50 enviado via PIX por contato anônimo (no nome on PIX transfer = "ANIPIS PESQUISA").
- [ ] **AC17.** Não-código: zero implementação de produto Anipis (sem deploy serenity-ai, sem fluxo no Fastify, sem chamada LLM, sem schema novo). Toda interação é via WhatsApp Business app oficial + Google Sheets + Notion. Tools usadas: WhatsApp Business + Google Sheets + Notion + 1 telefone dedicado.

---

## 3. Tasks (operacionais — não código)

### T1 — Setup técnico WhatsApp Business (D-7 a D-5) — Owner: Founder Breno
- T1.1 Adquirir SIM card dedicado (operadora indistinta, R$30) + chip ativo BR
- T1.2 Registrar WhatsApp Business com número dedicado, configurar Display Name "Anipis Companion (piloto)", profile photo neutra, business description com disclaimer pesquisa
- T1.3 Configurar etiquetas WABA: GREEN / YELLOW / ORANGE / RED + um por participante (P01..P20)
- T1.4 Validar 3 facilitadoras acessam WABA via WhatsApp Business multi-device (até 4 dispositivos), cada uma com identificação visual (selo letras: "Ana", "Beatriz", "Carla" — pseudônimos)

### T2 — Recrutamento facilitadoras + advisor (D-7 a D-3) — Owner: Founder + @analyst Atlas (rede CISM/USP)
- T2.1 Identificar 3 candidatas via CRP regional, redes psicólogas USP IPq, indicação clinical advisor pro-bono
- T2.2 Validar: graduanda 9-10 sem ou pós-graduanda em psi + CRP-supervisão clínica formal + supervisor com CRP ativo assina ata
- T2.3 Assinatura: termo confidencialidade + sigilo + LGPD-compatible + remuneração R$800 cada pelos 14d (R$2.4k total cash)
- T2.4 Dry-run 4h supervisionada com 2 voluntárias-teste (não conta para 20 cohort) + RED flag simulado

### T3 — Recrutamento 20 Júlias via CAPS + universidade pública (D-5 a D-1) — Owner: Founder
- T3.1 Cold outreach 2 CAPS municipais (via templates `concierge-recruitment-plan.md`)
- T3.2 Cold outreach USP IPq + UNIFESP saúde mental grad recruitment
- T3.3 Screening PHQ-9 + GAD-7 + critérios inclusão/exclusão + estratificação 5/10/5 conforme Alison
- T3.4 Onboarding individual D-1: consent form + baseline + agendamento welcome message D0

### T4 — Script + decision tree + crisis runbook (D-7 a D-2) — Owner: Founder + clinical advisor
- T4.1 Redigir script-base `concierge-script-pt-br.md` (deliverable #2 deste pacote)
- T4.2 Review clínico advisor: 8 IF/THEN trees + 3 crisis phrases + ata assinada
- T4.3 Hash do script versionado (`sha256` do arquivo final) registrado em ata D-2

### T5 — KPI dashboard + safety log setup (D-3 a D-1) — Owner: Founder + Orion
- T5.1 Google Sheet "Concierge KPI Dashboard" com 5 tabs: cohort registry / daily log / safety log / D+7 gate / D+14 wrap
- T5.2 Notion runbook page com SOPs facilitadoras
- T5.3 Cron diário 23h BRT: founder consolida day-end report + Orion summary

### T6 — Operação 14 dias D0 a D+13 (30/Mai a 12/Jun) — Owner: 3 facilitadoras + founder orchestrator
- T6.1 D0 welcome 20/20, D1-D13 daily touchpoints
- T6.2 Daily 23h founder summary + advisor check-in (assinatura digital)
- T6.3 D+7 gate calculation + report
- T6.4 D+14 wrap: post-PHQ-9 + post-GAD-7 + interviews + voucher PIX

### T7 — Decision GO/PIVOT/KILL documentation (D+14 EOD) — Owner: Founder + advisor + Orion
- T7.1 Métricas finais consolidadas vs critérios numéricos absolutos
- T7.2 Qualitative summary 10 quotes anonimizadas
- T7.3 Recomendação tripla + signature + trigger explícito

### T8 — Right-to-delete + LGPD enforcement (em paralelo D-7 a D+30) — Owner: Founder
- T8.1 Vault anonymous_id ↔ identidade real (acessível só founder, encriptado AES-256 local)
- T8.2 Snapshot D+14 publicado em PDF assinado (zero PII) — relatório final
- T8.3 Apagar dados brutos D+30 OU upon request, mantendo só relatório anonimizado

### T9 — Founder bandwidth budget (operational hygiene) — Owner: Founder
- T9.1 4-6h/dia D-7 a D-1 (setup); 2-3h/dia D0-D13 (orchestration + advisor sync); 6-8h D+14 (decision)
- T9.2 Não disparar Sprint 0 técnico em paralelo (já aconteceu) — Concierge tem prioridade absoluta de bandwidth founder durante D-7 a D+14

---

## 4. Dev Notes

**Zero código produto Anipis envolvido.** Esta story NÃO toca `apps/serenity-ai/`, NÃO cria PR, NÃO faz deploy, NÃO chama LLM, NÃO usa pgvector, NÃO usa output filter do Fastify. **Tudo via WhatsApp Business app oficial + Google Sheets + Notion + 1 chip dedicado.**

**Stack operacional:**
- WhatsApp Business app oficial (Android/iOS) — Tier 0 free, 4 dispositivos simultâneos
- Google Sheets (Workspace business) — KPI dashboard + cohort registry + safety log + daily log
- Notion (free tier) — runbook + scripts + decision tree
- 1 SIM card dedicado BR (R$30 ativação)
- 1 PIX pagamento R$50 × 20 participantes = R$1.000 (vouchers D+14)
- Facilitadoras: R$800 × 3 = R$2.400 (cash, 14 dias)
- Total cash burn: **R$3.430** (compatível com `master-report.md` §9 banda R$1.2-2.5k Concierge + R$2.4k facilitadoras)

**Por que NÃO usar produto Anipis pronto:** (1) Ries linha 16 — "UI completa cria placebo de produto", precisamos do "Concierge expõe o nervo"; (2) safety classifier + output filter + crisis protocol do código não estão validados clinicamente (S-01 a S-04 do Quinn não fechados); (3) usar produto = mistura experimento comportamental com experimento técnico — viola separation of variables; (4) facilitadora humana adapta tom em real-time + escala crise em 90s, o que o classifier não consegue na maturidade atual.

**Por que NÃO recrutar via Instagram/Meta Ads:** Alison Darcy linha 30 — "Pessoas que se candidatam pra 'app de saúde mental' têm PHQ-9 médio 6-9 (mild) — não representam a Júlia em sofrimento real." Eric Ries linha 16 — "não Meta Ads — você queima budget e vanity metric o funil". CAPS + universidade pública atingem PHQ-9 12-19 (target Júlia).

**Por que 20 Júlias (não 40, não 100):** 20 é o piso ético de discovery + ceiling operacional para 3 facilitadoras gerenciarem 14 dias sem queimar. Eric Ries linha 16: "20 Júlias universitárias por 14 dias". Alison: 20 estratificadas 5/10/5 dá power suficiente para D+7 detection (35% target = 7 unprompted returns observadas é signal forte se IC binomial 95% [15%, 59%] — narrow enough para action).

**Por que D+7 unprompted return rate como north star (não DAU, não message volume, não NPS):** Eric Ries linha 26: "Vanity metrics a evitar a todo custo: total downloads, total registered users, total messages sent, 'engagement seconds', NPS isolado". Unprompted return mede *behavior* (Júlia voltou sem reminder), não output. Backup metrics (PHQ-9 delta, vulnerability latency) complementam mas não substituem.

**Crisis protocol é spinal cord:** Alison linha 45 — "Tratar safety classifier como spinal cord clínica". As 3 crisis escalation phrases são literais hardcoded, sem variação, sem LLM (Alison linha 27 ponto 4: "Resposta gerada por LLM em crise — nunca").

**Mr. Walker protocol (stay-with-user):** Alison linha 24 — "O Mr. Walker protocol nosso fica com a usuária ('vou ficar aqui enquanto você liga'), não dispensa." Facilitadoras NÃO mandam só "ligue CVV 188" — ficam no canal até confirmar Júlia ligou ou está segura.

---

## 5. Testing

### Pre-launch (D-7 a D-1)

**T-test-1:** Dry-run com 2 voluntárias-teste (não-cohort, pode ser amiga psi do founder + clinical advisor desempenhando papel):
- Cenário A: small talk + mood neutral (GREEN flag)
- Cenário B: vulnerability "tô muito triste essa semana" (YELLOW flag)
- Cenário C: indireto "não aguento mais isso, não vejo saída" (ORANGE escalating)
- Cenário D: direto "não aguento mais viver" (RED — full protocol Mr. Walker)
- Cenário E: alguém ataca facilitadora ou tenta jailbreak ("você é IA né?")

Pass criteria: cada facilitadora completa 5 cenários em ≤90s response + advisor concorda com resolution.

**T-test-2:** Crisis runbook stress test — 1 cenário RED disparado às 23h BRT com facilitadora de plantão (rotativo) + advisor responde ≤30min.

**T-test-3:** Privacy + consent walkthrough — 1 voluntária assina consent, founder enforça right-to-delete em ≤24h, validate vault encripted.

### Durante operação (D0 a D+13)

**Daily monitoring:**
- KPI dashboard atualizado 23h BRT ≥1×/dia
- Safety log review com advisor 1×/dia EOD
- Facilitator stand-up 1×/dia 22h BRT (15min calls)

**Mid-experiment checkpoint (D+7, 6/Jun):**
- Gate criteria: ≥7 de 20 participantes (35%) com ≥1 unprompted return entre D+3-D+7
- Se <4 de 20 (20%): PIVOT discussion imediata D+8
- Se 4-6 de 20 (20-34%): continuar até D+14 mas flag yellow
- Se ≥7 de 20 (≥35%): GREEN, prossegue D+14

### Post-experiment (D+14 a D+21)

**Post-analysis qualitative:**
- 15 entrevistas 10-15min cada (via WhatsApp call agendado ou Zoom) com participantes
- Coding qualitativo: temas recurring + friction points + delight moments
- Comparação stratification (sub-clinical vs mild vs moderate) para detectar segmento ótimo

**Decision documentation:**
- GO criteria absolute: ≥35% D+7 + ≥2.5 sessions/wk + PHQ-9 delta ≥3pts + 0 RED não-resolvidos + facilitator NPS ≥8 + ≥10 de 20 desejam continuar
- PIVOT criteria: 1-2 dimensões abaixo + tendência positiva
- KILL criteria: ≥3 dimensões abaixo + qualitative reveals friction estrutural não-acionável

---

## 6. File List

**Criados nesta story (pacote operacional Sprint -1):**

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `06-concierge-mvp/SAI-CON-001-concierge-mvp.md` | Esta story (formal AIOS template) | Ready |
| `06-concierge-mvp/concierge-script-pt-br.md` | Script estruturado 14 daily touchpoints + crisis | Ready |
| `06-concierge-mvp/concierge-runbook-14d.md` | Operacional D-7 a D+14 + roles + GO/PIVOT/KILL | Ready |
| `06-concierge-mvp/concierge-recruitment-plan.md` | CAPS + univ pública + templates outreach | Ready |
| `06-concierge-mvp/concierge-kpi-dashboard.md` | North star + drivers + guardrails + daily report | Ready |
| `06-concierge-mvp/README.md` | Índice do pacote operacional | Ready |

**Referenciados (já existentes):**

- `04-clone-conclave/c-gtm-beta/eric-ries.md` — Concierge MVP rationale + Innovation Accounting
- `04-clone-conclave/a-samd-vs-wellness/alison-darcy.md` — Recrutamento CAPS + crisis traps + Mr. Walker
- `04-clone-conclave/c-gtm-beta/sean-duffy.md` — Cohort design + welcome call humano + 2 push/dia max
- `02-deliverables/08-ux-design-expert.md` — Personas Júlia + crisis UX wireframes
- `03-rebrand-v2/07-VOICE-REFINED.md` — Voice canon PT-BR (1ª pessoa + anti-positividade tóxica + 7 do/don't)
- `99-synthesis/master-report.md` — Síntese cross-agent + insight 4 (Sprint -1 não-codificado)
- `99-synthesis/01-decisions-needed.md` — D-02 decision document

**NÃO toca (proibido):**
- `apps/serenity-ai/**` — zero deploy, zero PR, zero código produto
- `apps/serenity-ai/docs/stories/active/**` — esta story vive no squad, não no produto

---

## 7. Status Changelog

| Data | Status | Autor | Notas |
|------|--------|-------|-------|
| 2026-05-16 12:50 BRT | Draft | Orion | Criação inicial da story após D-02 fechada via bulk trigger `aceito recomendações orion p0a` |
| 2026-05-16 13:10 BRT | Ready | Orion | Pacote operacional completo (5 arquivos + README); aguardando founder kick-off D-7 (23/Mai) |
| TBD 23/Mai | In Progress | Founder | Sprint -1 setup begins (T1-T5) |
| TBD 30/Mai | In Progress (D0) | Founder + 3 facilitadoras | Cohort kick-off |
| TBD 6/Jun | In Progress (D+7 gate) | Founder + advisor | Gate checkpoint AC11 |
| TBD 13/Jun | Done OR Pivot OR Killed | Founder + advisor + Orion | Decision documented AC15 |

---

## 8. Definition of Done

Esta story está Done quando:

1. ✅ Todos os 17 ACs marcados como concluídos (signature de cada owner)
2. ✅ KPI dashboard final D+14 publicado em PDF assinado (zero PII)
3. ✅ Decision GO/PIVOT/KILL documentada com trigger user explícito
4. ✅ Vault anonimizado (data brutos apagados D+30 OU upon request)
5. ✅ Lessons learned doc anexado: 5 things that worked + 5 things to fix se PIVOT + 5 reasons se KILL
6. ✅ Cap table cash burn reconciliado: R$3.430 ± 10% observed vs budgeted
7. ✅ Hand-off para Sprint 1 (se GO) com retention curve + qualitative quotes + recommended cohort target

---

## 9. Cross-References

- **Decisão originária:** D-02 `01-decisions-needed.md` linhas 41-61
- **Eric Ries rationale:** `04-clone-conclave/c-gtm-beta/eric-ries.md` linhas 14-46
- **Alison Darcy recrutamento + crisis:** `04-clone-conclave/a-samd-vs-wellness/alison-darcy.md` linhas 22-46
- **Sean Duffy cohort + welcome:** `04-clone-conclave/c-gtm-beta/sean-duffy.md` linhas 20-42
- **Master report insight 4 (Sprint -1 não-codificado):** `99-synthesis/master-report.md` linhas 201-204
- **Voice canon PT-BR:** `03-rebrand-v2/07-VOICE-REFINED.md` (toda)

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · SAI-CON-001 Sprint -1 Concierge MVP*
*"Não construa o que não validou. A Júlia decide se Anipis existe ou não — e ela decide pelo dedo no telefone, não pela nossa fé no backend."*
