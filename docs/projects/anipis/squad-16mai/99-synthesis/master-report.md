# Anipis Squad 16/Mai — Master Report (Cross-Agent Synthesis)

**Autor:** Orion (Master Orchestrator AIOS)
**Data:** 2026-05-16
**Squad:** anipis/squad-16mai
**Inputs consolidados:** 8 deliverables AIOS + 13 docs rebrand v2 + 9 consultations mind clones (3 conclaves × 3 experts)
**Status:** v1 — entrega final ao user Breno
**Janela crítica:** CFM Res. 2.454/2026 vigor ago/2026 — ~12 semanas operacionais

---

## 1. Executive Summary

Anipis retoma operação após 38 dias parado em situação **paradoxalmente boa**: o backend já está ~70% implementado (Fastify 5 + Drizzle + 23 tabelas + safety classifier 4 níveis PT-BR + output filter 7-stage + crisis protocol + pgvector memory) — o que Atlas (@analyst) chamou de "espaço vazio S+" e Halle Tecco confirmou como "primeira mental health AI BR com pathway SaMD começando AGORA = barrier estrutural 18-24 meses". A janela CFM 2.454/2026 (ago/2026) é **viável**, mas **somente se** três condições simultâneas se cumprirem nas próximas duas semanas: (1) Concierge MVP humano via WhatsApp valida que Júlia volta no D+3 sem reminder (Eric Ries — riskiest assumption não-validada), (2) Comitê safety clínico contratado em 14 dias com retainer híbrido (3 psi + 1 psiquiatra + 1 advogado LGPD), (3) decisão SaMD-vs-Wellness fechada em arquitetura **híbrida com superfícies separadas** (Bakul Patel + Alison Darcy convergem). Os 17 vozes consultadas (8 agentes AIOS + 9 mind clones) **convergem muito mais do que divergem** — a dissensão real está em sequenciamento (não em substância) e em ousadia regulatória (SaMD upfront vs adjunct-Phase-2). O verdict cross-agent é **GO condicional** com recomendação primária Orion: **Concierge MVP Sprint -1 (16-30/Mai) antes de Sprint 0 — sem isso, todo Sprint 1-6 do PRD vira faith-based execution**. A dívida não é técnica; é de processo (zero stories com Status: Done) e de validação humana (zero Júlias reais conversaram com a interface real ainda). O moat real está em **três camadas defensáveis simultâneas** que ninguém no mercado BR tem: PT-BR clínico nativo + compliance CFM/CFP ago/2026 first-mover + parceria CISM/USP RWE publicável 12 meses. Custo total dos próximos 12 semanas: ~R$35-55k em compromissos cash + 0,5% equity comitê + tempo founder solo. Risco existencial #1 não é mercado nem competição: é **retenção D30 < 12%** combinado com **incidente de safety publicado**. Os 4 KILL gates Orion propostos protegem contra ambos.

---

## 2. State of the Union — O Que Existe HOJE vs Target

| Camada | Status real (auditado por @dev em `apps/serenity-ai/`) | Target MVP/Beta | Magnitude do gap |
|--------|--------------------------------------------------------|-----------------|------------------|
| Monorepo + CI | Turbo 2 + npm workspaces + CI workflow live | Mantido + branch protection + crisis-redteam gate | **Pequena** — adicionar gates CI |
| Backend Fastify 5 | 21 rotas implementadas, Drizzle 0.36, 23 tabelas, 14 migrations | + 12 migrations (multi-tenant, audit hash chain, memories HNSW, eval_runs, prompt_versions, pii_vault) | **Média** — Dara mapeou as 12 ALTER/CREATE |
| LLM Router | GPT-4o-mini primary → Claude 3.5 Haiku fallback, streaming, timeout 10s/15s | GPT-5 primary + Claude 4.5 fallback + tier 3 degraded local (Llama 3.2) | **Pequena** — env-driven swap |
| Safety Classifier | 4-level GREEN/YELLOW/ORANGE/RED PT-BR, keyword/regex, audit log entries | + Hybrid (small model BERTimbau/DistilBERT-PT) + critic-actor seletivo + adversarial 500 golden set | **Média** — SPIKE-002 valida em Sprint 0 |
| Crisis Protocol | RED bypassa LLM, response template `crisis_responses`, fallback hardcoded CVV/SAMU | + Human-in-the-loop queue + hash chain audit + Mr. Walker protocol 2-turn confirm | **Média** — Quinn 22 gates Tier S |
| Output Filter | 7-stage pipeline, 35 forbidden phrases, term substitutions | + ML classifier semântico (não só regex) + versionamento por hash + CI regression gate | **Média** — S-02 do Quinn |
| Memory Service | pgvector + Redis Upstash + Bio + Extraction services | Manter custom + adicionar source_utterance_id + extraction_confidence + clinician_reviewed (Demis Hassabis rejeita Mem0/Letta) | **Pequena** — schema hardening |
| Frontend Next.js 15 | 4 route groups, Zustand, Tailwind 4, Supabase SSR, chat/mood/exercises/breathing/settings live | Mobile-first audit + PWA manifest + rebrand v2 implant (5 stories SAI-B2-*) | **Média** — SPIKE-007 + EPIC-8 |
| Stories | 50 stories em `docs/stories/serenity-ai/active/`, **0 com Status: Done formal**, 7 declarados Done, 16 In Progress | 21 P0 hard fechados antes do beta abrir | **Grande de processo, pequena de código** — Pax detectou |
| Observability | Pino + Sentry configurados, sem traces LLM | + Langfuse self-host BR (Magalu) + 6 SLO panels + PII redaction pré-trace | **Média** — SPIKE-006 |
| LGPD compliance | Consentimento granular base + RLS + PII audit log + account deletion | + DPO externo + DPIA submetida + hash chain audit + 10 stories M4 TODO | **Grande** — EPIC-7 Pax todo |
| CFM 2.454/2026 readiness | Disclaimers parciais, sem médico-responsável, sem CRP supervisor, sem classificação risco documentada | Risk Classification Memo + nomeação CRM + CRP + Termo Compromisso + safety committee | **Grande** — 4 dos 22 Tier S |
| Beta cohort | Zero usuários, zero Júlias reais conversaram | 40-100 Júlias recrutadas via CAPS + universidades públicas (não Instagram ads — Alison Darcy) | **Grande** — Sprint 4 do @pm |
| Parceria acadêmica | Zero contato CISM/USP IPq formal | MoU assinado Sprint 5 + protocolo RCT v0.1 n=190 com pré-registro ClinicalTrials.gov (Atul) | **Média** — Sprint 1-5 |

**Veredito Orion sobre o estado:** O backend é mais robusto que o típico MVP healthtech BR no momento de re-início, mas o **gap é de validação humana e processo** — não de código. Dex tem razão ao afirmar "70% backend, 40% frontend"; Pax tem razão ao apontar dívida de processo (status nunca atualizado); Eric Ries tem razão ao apontar **zero evidência comportamental** de que Júlia volta no D+3. As 3 vozes não se contradizem — descrevem o mesmo problema em camadas diferentes.

---

## 3. Cross-Agent Convergences

Convergências fortes (≥6 vozes concordam) extraídas do cruzamento dos 17 inputs:

| Tópico | Convergência | Vozes concordantes |
|--------|--------------|---------------------|
| **Posicionamento adjunto, não substituto** | "Adjunct/companion, never replacement" — citações literais CFP Res. 09/2024 + APA Nov/2025 + FDA GenAI MH Devices Nov/2025 + CFM 2.454/2026 | @analyst, @pm, @architect, @qa, @ux, halle-tecco, bakul-patel, alison-darcy, lucia-savage |
| **Crisis routing é existencial** | Pipeline 3-stage com HITL + audit imutável + p95 <1s + recall ≥99% severity≥2 + Mr. Walker protocol (stay-with-user) + bypass LLM nos RED | @architect, @qa, @dev, demis-hassabis, werner-vogels, alison-darcy, bakul-patel |
| **PT-BR clínico nativo é moat real** | Cíngulo é guiado-modular não conversacional, Wysa não tem PT-BR clínico, Replika sem compliance, Zenklub não é AI — Anipis ocupa "espaço vazio S+" | @analyst, @pm, halle-tecco, alison-darcy, atul-butte |
| **Wave 1 B2C antes de B2B2C** | "Value before growth, value in ONE segment before any second segment" — outcome moat via consumer wave gera dados que vendem enterprise | @analyst, @pm, eric-ries, halle-tecco, sean-duffy |
| **Comitê safety clínico é P0 não-negociável** | 3 psicólogas + 1 psiquiatra + 1 advogado LGPD com sign-off formal em prompts + crisis flows | @pm, @qa, @ux, bakul-patel, alison-darcy, lucia-savage |
| **Eval harness reproduzível** | Golden set ≥500 cenários estratificados PT-BR + adversarial set separado + CI gate bloqueia regressão >2pp | @dev, @qa, demis-hassabis, atul-butte |
| **Audit hash chain Postgres + PII vault separado** | Append-only com sha256(prev_hash || row) + content em vault eraseable (LGPD-compatible) | @architect, @qa, @data-engineer, werner-vogels, lucia-savage |
| **Janela CFM ago/2026 viável SE compliance shipa antes** | 12 semanas operacionais, com lock features Sprint 8 e mock audit Sprint 10 | @analyst, @pm, @qa, bakul-patel, halle-tecco |
| **Rebrand v2 vai com defaults Uma (bulk trigger)** | D3 Breathing Form + Multi-theme B + 3 fonts + Caixinha Cartas roadmap + 3 renders Warm | Uma + conclave 9 mind clones rebrand |
| **DPIA + DPO + RIPD são pré-launch obrigatórios** | LGPD Art. 38 + Art. 41 + Art. 11 não negocia para dados sensíveis de saúde mental | @qa, @data-engineer, @po, lucia-savage |
| **CISM/USP IPq parceria acadêmica é go** | Modelo CONEMO Indaiatuba replicável, MoU semana 4-8, RCT n=190 pré-registrado | @analyst, @pm, atul-butte, alison-darcy |
| **Adolescent track (P5 André) EXCLUÍDO do MVP** | CFM 2.454/2026 + parental consent + safeguards = +6-8 semanas, mata janela | @ux, @analyst, alison-darcy, bakul-patel |
| **Anti-pattern: Meta Ads para recrutar beta** | Self-selection bias + wellbeing-already-high + categoria sensível restringida | @pm, eric-ries, alison-darcy, sean-duffy |
| **Anti-pattern: streaks visíveis + push agressivo** | Trauma para vulneráveis + dark pattern em SM = Ethical UX Charter de Calvo bloqueia | @ux, eric-ries, sean-duffy |

**Síntese das convergências:** Não há divergência ideológica entre AIOS agents e mind clones — todos concordam que Anipis é uma oportunidade real **com guardrails clínico-regulatórios não-negociáveis**. As 14 convergências formam o "core que não se mexe" do projeto.

---

## 4. Cross-Agent Dissensions

Onde os 17 vozes divergem (10 dissensões mapeadas com recomendação Orion):

### Dissensão 1 — SaMD upfront vs Wellness-com-shadow-clinical vs Híbrido arquitetural

- **Bakul Patel:** "Híbrido arquitetural com superfícies técnica e legalmente separadas — Anipis Wellness (Class I) ships 10-12 sem + Anipis Clinical Adjunct (SaMD Categoria III, ANVISA upfront, beta fechado supervisionado)"
- **Alison Darcy:** "Wellness Class I com clinical-grade evidence collection desde dia 1, RDC 657 Phase 2 mês 6-9 com dataset real — não SaMD upfront. Woebot levou 4 anos para Breakthrough."
- **Lucia Savage:** "Defensible for closed beta B2C, risky beyond — counterintuitively, going deeper into regulated regime (operadora ANS) is safer than B2B middle"
- **@analyst (Atlas):** "SaMD Classe II adjuvante" — único caminho que sobrevive a CFM 2.454 e abre liquidity event ANS
- **@architect (Aria):** "Híbrido escalonado — MVP wellness companion com safety SaMD-grade, pista regulatória para SaMD Class IIa em Phase 2 (12-18m)"

**Tensão central:** velocidade de launch (Alison) vs blindagem regulatória upfront (Bakul) vs liquidity event (Atlas).

**Recomendação Orion:** **Bakul wins arquiteturalmente, Alison wins operacionalmente.** Adotar arquitetura de duas superfícies (Bakul) mas executar como Wellness-Class-I-com-shadow-clinical (Alison) — collected endpoints clínicos *como se* fossem submeter, mas filing ANVISA Phase 2 em mês 6-9 com dataset real. O importante é **não confundir o que Anipis FAZ (SaMD-grade) com o que Anipis CLAIMA (wellness)**. Crisis routing builds to SaMD-grade safety em ambas superfícies, sem exceção.

### Dissensão 2 — Concierge MVP humano antes do Sprint 0 (Eric Ries) vs ir direto para Sprint 1 com 70% backend pronto (@pm + @dev)

- **Eric Ries:** "Concierge MVP via WhatsApp com 20 Júlias universitárias por 14 dias ANTES de qualquer linha de código de produção — sem isso, todo o resto é faith-based method"
- **@pm (Morgan):** Sprint 0 = Foundation (decisões + advisory board + spikes técnicos), Sprint 1 = Safety Core, Sprint 2 = Chat Core + Onboarding com 5 entrevistas Wizard of Oz
- **@dev (Dex):** Sprint 0 = 7 spikes timeboxed (LangGraph, crisis classifier, docker-compose, Mem0 vs Letta, pgvector RLS, Langfuse, mobile-PWA)
- **@po (Pax):** Sprint 1 = fechar dívidas técnicas (foundation close + safety drafts → Ready)

**Tensão central:** validar comportamento (Eric) vs validar tecnologia (Dex/Morgan/Pax). O backend pronto induz pressa para "ir codar" — mas a hipótese mais arriscada não é técnica.

**Recomendação Orion:** **Sprint -1 (16-30/Mai) = Concierge MVP humano em paralelo a Sprint 0 técnico.** Não atrasar Sprint 0 (decisões + spikes) mas adicionar **track paralelo Concierge WhatsApp** sem código produto: 20 Júlias universitárias recrutadas via CAPS + universidade pública (Alison Darcy), 3 facilitadoras humanas, script estruturado, D+7 unprompted return rate ≥35% como gate primário. Custo: ~R$1k voucher (50/usuária) + 2 semanas founder time. **Sem PMF comportamental no Concierge, Sprint 1 não começa em código.**

### Dissensão 3 — Operadora ANS Q4/2026 vs adiar para 2027

- **@pm (Morgan):** Wave 3 (B2B2C Operadora ANS) → Q4/2026 → 2027, 3 alvos iniciais Notre Dame/Amil/Care Plus, sales cycle 6-9m
- **Halle Tecco:** "Operadora ANS — vale Q4/2026? Não. Ciclo 12-18m mata você pré-Series A. Targets futuros: Hapvida/NotreDame + Porto Saúde. Zenklub-Omint foi outlier porque Omint = nicho premium"
- **Lucia Savage:** "Counterintuitively, going deeper into regulated regime (operadora) is safer than B2B corporativo middle — operadora is already controlador with own LGPD/ANS obligations"

**Tensão central:** velocidade-de-receita (Morgan) vs preservação-de-runway (Halle) vs limpeza-regulatória (Lucia).

**Recomendação Orion:** **Halle wins.** Adiar operadora ANS para 2027 com 12 meses de evidence-based outcomes. Em Q4/2026, foco em **NR-1 corporativo wave 2** com data própria do beta (15-18 meses pós-Concierge). Lucia tem razão sobre regime mais limpo, mas timing é matar pré-Series A.

### Dissensão 4 — Paralelo NR-1 Sprint 6 vs B2C exclusivo até PMF

- **@pm (Morgan):** Sprint 5 inicia cold outreach B2B2C (10 RHs empresas 200-2000 funcionários NR-1 punitiva mai/2026)
- **Eric Ries:** "B2C Júlia vs paralelo NR-1 corporativo — focar UM. Value in ONE segment before any second segment. IMVU quase morreu tentando ser para todos os usuários. NR-1 entra como Sprint 9-12 depois de Júlia validar"
- **Halle Tecco:** "Wave 2 NR-1 mai/2026, com data própria de retention — surf compliance wave mas não case com ela"

**Tensão central:** runway financeiro (Morgan) vs foco-único-PMF (Eric). Halle fica no meio (B2C primeiro mas com NR-1 surf paralelo quando tiver dados).

**Recomendação Orion:** **Eric wins parcialmente.** B2C exclusivo até **NPS D14 ≥30 + W4 retention ≥25%** validados no beta. Sprint 5 cold outreach NR-1 fica como **documental-only** (sales pack, pitch deck, LOI templates) — não código, não distração founder. Quando retention validada (provavelmente Sprint 7-8 pós-launch beta), aí Sprint 9 inicia conversas reais. NR-1 vira **roadmap Q1/2027**, não Q4/2026.

### Dissensão 5 — LangGraph + Mem0 + Letta stack moderno vs custom Fastify TS + pgvector

- **@architect (Aria):** LangGraph 1.0 Python service + Mem0 managed + Langfuse self-host — "Polyglot híbrido"
- **@dev (Dex):** Spikes Sprint 0 validam viabilidade (SPIKE-001 LangGraph TS, SPIKE-004 Mem0 vs Letta benchmark)
- **Demis Hassabis:** "Mantenha Fastify TS + custom pgvector memory + classifier determinístico; adicione Langfuse self-host para shadow eval contínuo; REJEITE LangGraph e Mem0 no MVP — reavalie no Q3 pós-launch"
- **Werner Vogels:** "Never depend on a single region or single provider for a critical path — hedge with second LLM" (não toma posição direta sobre framework)

**Tensão central:** modernidade do ecossistema AI (Aria) vs determinismo crítico safety (Demis). 5 dias de spikes vs decisão upfront.

**Recomendação Orion:** **Demis wins.** Backend tem 70% pronto, custom TS + pgvector já roda — adicionar LangGraph + Mem0 = retrabalho de 4-6 semanas que vira CFM-window-killer. Manter Fastify TS + custom pgvector (Demis); adicionar **Langfuse self-host BR (Aria)**; spikes Sprint 0 reduzem para 4 (não 7): SPIKE-002 crisis classifier hybrid, SPIKE-003 docker-compose local, SPIKE-005 pgvector RLS perf, SPIKE-006 Langfuse PII redaction. LangGraph/Mem0/Letta = roadmap Q3/2026 pós-launch (reavalie quando precisar long-horizon memory consolidation).

### Dissensão 6 — Multi-tenancy: schema-per-tenant operadora ANS vs RLS soft-tenancy

- **@architect (Aria):** Soft-tenancy via `tenant_id` column + RLS, upgrade para hard-tenancy via schema-per-tenant quando contrato exigir
- **@data-engineer (Dara):** "C — hybrid (A para B2C/corp, B só para operadora ANS sob contrato)"
- **Werner Vogels:** "RLS para B2C e B2B2C-corporate, mas para ANS operadora hard-isolate at schema level — blast radius + compliance ergonomics + noisy neighbor"
- **Lucia Savage:** "Schema-per-tenant é a defensible posture quando ANS RN-627 §3º compartilhamento de beneficiário kicks in — physical separation as evidence of proportionality"

**Tensão central:** simplicidade ops (Aria) vs hard isolation regulatory defensibility (Werner + Lucia).

**Recomendação Orion:** **Dara wins** (Aria + Werner + Lucia convergem na opção C híbrida). Codificar em ADR-006: RLS shared schema para B2C + B2B2C corporativo, schema-per-tenant para operadoras ANS quando contrato exigir. Função `create_isolated_schema(tenant_slug)` (migration 012 Sprint 3) só executa on-demand.

### Dissensão 7 — DPO founder solo interim vs externo desde dia 1

- **@pm (Morgan):** Founder solo DPO interim até hire #2; transição DPO externo aos 1.000 usuários
- **@qa (Quinn):** S-19 exige sign-off comitê safety (3 psi + 1 psiquiatra + 1 advogado LGPD)
- **Lucia Savage:** "Defensible up to closed beta (40-100 Júlias, B2C-only). Hard stop: before first NR-1 corporate pilot — DPO-as-a-Service externo R$8-15k/mês"
- **@data-engineer (Dara):** "Designar DPO formal Sprint 0 — P0 BLOCKING"

**Tensão central:** custo cash (Morgan adia) vs conflito-de-interesse estrutural (Lucia categórica).

**Recomendação Orion:** **Lucia wins.** Founder solo DPO interim é defensável até closed beta B2C, mas tem **deadline absoluto: antes do primeiro contrato NR-1**. Como Sprint 5 inicia outreach (documental ou real), DPO externo deve ser contratado **Sprint 3-4** (R$8-15k/mês — banda Opice Blum/Baptista Luz/Demarest). Founder mantém Privacy Champion role mas não encarregado formal.

### Dissensão 8 — Comitê safety equity vs retainer cash vs híbrido vs pro-bono

- **@pm (Morgan):** Híbrido — retainer R$1,5k/mês cada + equity 0,1% vesting 4 anos (total ~R$7,5k/mês + 0,5% equity)
- **Alison Darcy:** "Equity 0,1%/4y + retainer R$1,5k está dentro da banda Woebot 2017 — aprovem"
- **Eric Ries:** "Five Whys → comitê de safety entra como advisor pro-bono mensal (custo: zero), formalização vira Sprint 8"
- **Halle Tecco:** "Recrute co-founder clínico CRP+equity 8-15% pré-Series A (não comitê advisory) — investor BR descontam 30-40% valuation por founder solo"

**Tensão central:** ansiedade-de-runway (Eric: pro-bono first) vs blindagem regulatória (Morgan + Alison: estrutura formal) vs Series A defensibility (Halle: co-founder clínico).

**Recomendação Orion:** **Híbrido em 2 movimentos.**
- **Movimento 1 (semana 1-2):** Halle wins — recrutar **clinical co-founder CRP** (equity 8-15%, vesting 4y/1y cliff). É a posição estrutural que protege Series A valuation e desbloqueia tudo abaixo.
- **Movimento 2 (semana 1-2):** Morgan + Alison wins — comitê safety formal (3 psi + 1 psiquiatra externos + 1 advogado LGPD), retainer híbrido R$1,5k/mês + equity 0,1% vesting 4y (total ~R$6k/mês + 0,3% equity).
Total cap table: 8-15% (co-founder) + 0,3% (comitê) = ~12% médio. Eric pro-bono falha porque o comitê precisa ter **stake real para vetar prompts** (Alison: revisão semanal output filter, não trimestral).

### Dissensão 9 — RCT pré-launch vs pós-launch

- **@qa (Quinn):** "Pré-registro pré-launch (ReBEC), coleta beta fechado, publicação pós-launch. Bloqueia se Breno quiser fazer claims de eficácia"
- **Atul Butte:** "Protocolo RCT v0.1 submetido pro time CISM/USP em semana 2 — primary endpoint, power analysis n=190, non-inferiority margin 2pts PHQ-9, blinded assessor, ClinicalTrials.gov pre-registration"
- **Alison Darcy:** "Não tentem ANVISA RDC 657 antes do launch — Wellness Class I com protocolo SaMD-shadow, coletam endpoints clínicos como se fossem submeter"
- **@analyst (Atlas):** GO — carta de intenção semana 4, MoU semana 8, piloto RCT 1 UBS Indaiatuba semana 16

**Tensão central:** velocidade-de-launch (Alison: shadow, não submeter) vs evidence-based defensibility (Quinn + Atul: pré-registro mandatório se claim de eficácia) vs liquidity event (Atlas).

**Recomendação Orion:** **Atul + Alison convergem** — pré-registro ReBEC + ClinicalTrials.gov **antes do beta abrir** (Sprint 5), coleta durante beta + 8 semanas pós-launch, publicação Q2/2027. Sem pré-registro = não pode fazer claims de eficácia em marketing (CFM 2.454/2026 pode interpretar como propaganda enganosa). Sem claims de eficácia = wellness label robusto. **A não-decisão fecha porta para Phase 2 SaMD em 2027.**

### Dissensão 10 — Recrutamento beta: Meta Ads vs orgânico-only vs CAPS/universidade pública

- **@pm (Morgan):** Sprint 4 orgânico-only (Instagram + LinkedIn + parcerias psicólogas)
- **@po (Pax):** Instagram orgânico + parceria psicoeducação + TikTok + PUC-SP/Campinas + USP IPq + faculdades centro-oeste; **não recrutar comunidades autolesão**
- **Eric Ries:** "Recrutadas via DM de microinfluencer psi (não Meta Ads — você queima budget e vanity metric o funil)"
- **Alison Darcy:** "Erro #1 de digital therapeutics BR. Pessoas que se candidatam pra 'app de SM' têm PHQ-9 médio 6-9 (mild). Recrutem via parceria 2-3 CAPS municipais + 1 universidade pública (UFRJ/USP/UFMG psicologia, fila 6-12m) — essas são as Júlias com PHQ-9 12-19. R$50 voucher pelas 4 semanas"
- **Sean Duffy:** "Peer-group cohorts com human coach assignment dia 1 — 40+60 dividido em 8 grupos de ~12 pessoas, canal Discord/Telegram privado moderado"

**Tensão central:** acessibilidade (Morgan: Instagram orgânico) vs representatividade-da-Júlia-em-sofrimento (Alison: CAPS) vs estrutura-de-coorte (Sean).

**Recomendação Orion:** **Alison wins (CAPS + universidade pública), Sean wins na estrutura de coorte.** Recrutar 40 ondas iniciais via 2 CAPS municipais + 1 universidade pública (PUC-SP ou USP IPq), R$50 voucher 4 semanas, estratificar por severidade (mild/mod/mod-severe), excluir severe (PHQ-9 ≥20), **dividir em 4 cohorts de 10 pessoas** com canal privado moderado + welcome call humano D1-D2 (founder até 200 — Sean). Sprint 4-5 paralela: 60 ondas adicionais via parceria psicólogas Instagram (microinfluencers 5k-50k followers). Total 100 beta, mas dividido em fonte qualitativa (CAPS) + escala orgânica (Instagram), nunca Meta Ads pagos.

---

## 5. The Big Insight — Top 5 que Ninguém Viu Sozinho

Insights emergentes do cruzamento das 17 vozes — nenhum agente/clone capturou individualmente, mas as junções revelam:

### Insight 1 — Não é "rebuild", é "endurecer + 2-3 layers cirúrgicas"

@dev revelou que backend está 70% pronto (21 rotas, 23 tabelas, safety classifier 4 níveis PT-BR, output filter 7-stage, crisis protocol, pgvector). Demis Hassabis e Werner Vogels rejeitaram explicitamente migração para LangGraph/Mem0/Letta no MVP. A combinação destas duas verdades cria um insight que **nem @architect Aria capturou sozinho**: a estratégia certa não é "modernizar a stack" mas **endurecer o que existe + adicionar 3 layers cirúrgicas** — (a) hash chain audit (Dara + Werner + Lucia), (b) hybrid crisis classifier ML (Demis crítico-actor + @qa SPIKE-002), (c) Langfuse self-host BR (Aria). Custo: ~3 sprints, não 6. **Impacto:** janela CFM ago/2026 vira folgada (4-6 semanas de buffer), não apertada.

### Insight 2 — Dívida é de PROCESSO (stories sem Status: Done), não de código

Pax detectou: 16 stories "In Progress" com ACs majoritariamente checados, mas status nunca atualizado para Done. @qa apontou: zero stories passou pelo gate formal de @qa. @dev confirmou: implementação 70% sólida. **A junção destas três verdades** revela um insight crítico: **o risco real não é bugs em produção, é "MVP declarado pronto" baseado em status falso**. ANPD/CFM auditando vai pedir trail formal: "qual o veredicto QA da SAI-009 crisis routing?" — e a resposta hoje é "ninguém formalizou". **Recomendação Orion (que nenhum agente isolado propôs):** Sprint 1 inteiro dedicado a **housekeeping retroativo formal** — @qa roda gate em SAI-001..013 + SAI-200..205, fecha status Done com File List + signatures, antes de tocar feature nova. Custo: 5-7 dias úteis. Ganho: regulatory trail defensible.

### Insight 3 — Founder solo = 30-40% valuation discount + DPO conflito + sem co-founder clínico = trifecta de risco

Halle Tecco: "investor BR pré-Series A descontam 30-40% valuation por founder solo". Lucia Savage: "DPO founder solo interim tem conflito de interesse estrutural a partir do primeiro NR-1". @ux Uma: persona Júlia + clinical responsibility exigem credenciais que founder solo (Breno, tech background) não tem. **Junção das três:** founder solo não é apenas "ansiedade de runway" (Eric Ries) — é **trifecta estrutural** que combina valuation discount + conflito legal + déficit clínico. **Recomendação Orion (emergente):** recrutar **clinical co-founder CRP** (não advisor, não comitê) é P0 com equity 8-15% nas próximas 4 semanas. Sem isso, Series A 2027 começa com 30% discount + DPO externo cash burn + comitê sem stake real. Halle viu parte, Lucia viu parte, ninguém viu o efeito combinado.

### Insight 4 — Concierge MVP humano (Eric Ries) antes do código + Cohort design (Sean Duffy) + recrutamento CAPS (Alison Darcy) formam o "Sprint -1" não-codificado

Eric Ries argumenta: validar comportamento (D+7 unprompted return) antes de qualquer código. Sean Duffy argumenta: peer-group cohorts + welcome call humano D1-D2 + Week-4 save-call. Alison Darcy argumenta: recrutar via CAPS, não Instagram. **Nenhum dos três viu sozinho** que estas três peças formam um **Sprint -1 não-codificado de 14 dias** que pode validar PMF comportamental antes de Sprint 0 técnico começar. Custo: ~R$2-3k (vouchers + WhatsApp Business + 3 facilitadoras humanas). Ganho: **se Concierge falha (D+7 <20%), Sprint 0 técnico não começa** — economiza 10 semanas de execução errada. Se Concierge passa (D+7 ≥35%), Sprint 0 começa com tração comprovada.

### Insight 5 — ANS regime mais limpo que B2B corporativo (Lucia counter-intuitive) + retention Sean Duffy peer-cohort + Halle ANS Q4/2026 adiada = sequência inversa do óbvio

@pm Morgan propôs Wave 1 B2C → Wave 2 NR-1 corp → Wave 3 ANS operadora. Halle Tecco confirmou ordem mas adiou ANS para 2027. Lucia Savage disse algo contra-intuitivo que ninguém pegou na ata: **"counterintuitively, going deeper into regulated regime (operadora ANS) is safer than B2B corporativo middle"**. Sean Duffy disse que Omada não cobra paciente, cobra payer (operadora). **Junção:** o caminho mais limpo regulatoriamente (operadora) é também o que tem ciclo mais longo (12-18m). NR-1 corporativo tem ciclo médio (4-9m) mas é regime "patchwork" (Lucia) com mais risco LGPD (DPO obrigatório, BAA-equivalent). **Insight emergente:** sequência ideal pode não ser B2C → NR-1 → ANS, mas **B2C → ANS (skip NR-1) com 18m de evidência**. Mais lento mas mais limpo. Recomendação Orion: revisitar sequência em Sprint 8 com dados.

---

## 6. Revised Roadmap — Fusion de @pm + Eric Ries + Halle

Adaptação do roadmap 6 sprints do @pm com Sprint -1 (Eric Ries) inserido + ajustes Halle moat-starts-now:

| Sprint | Janela | Goal | Gate de saída | Decisões P0 envolvidas |
|--------|--------|------|---------------|------------------------|
| **Sprint -1** | 16-30/Mai (paralela ao Sprint 0) | Concierge MVP humano via WhatsApp + decisões P0 + clinical co-founder + comitê safety contratados | D+7 return ≥35% (20 Júlias); 5 P0 decididas; clinical co-founder LOI; comitê assinado | D-01, D-02, D-04, D-05, D-08 |
| **Sprint 0** | 16-30/Mai (paralela) | Foundation técnica: 4 spikes (não 7), DPIA v1, nomeação DPO interno (externo Sprint 3), Risk Classification Memo CFM | 4 spikes PASS; DPIA v1; rebrand v2 produção 5 dias calendar | D-03, D-06, D-13 |
| **Sprint 1** | 30/Mai-12/Jun | Housekeeping retroativo (insight 2): @qa gate formal em SAI-001..013 + 200..205; safety core finalização | 16 stories In Progress → Done; pen-test sem critical/high; 0 escapes red-level | D-15 |
| **Sprint 2** | 13-26/Jun | Chat core + onboarding com 5 entrevistas qualitativas Júlia (Wizard of Oz) | 5/5 entrevistadas com 1ª conversa significativa; activation ≥65% | D-11 |
| **Sprint 3** | 27/Jun-10/Jul | Mood tracking + handoff manual + dashboards internos + DPO externo contratado | Crisis backlog = 0; PDF snapshot zero PII; DPO externo onboarded | D-07 |
| **Sprint 4** | 11-24/Jul | Beta fechado launch (40 ondas iniciais via CAPS + universidade pública) + rebrand v2 implant | 40 beta-users com ≥1 conversa significativa; 0 incidentes safety; NPS D14 ≥30 | — |
| **Sprint 5** | 25/Jul-7/Ago | Feedback loop + RCT pré-registro ReBEC + MoU CISM/USP + 60 beta adicionais (Instagram orgânico) | 100 beta total; W4 retention ≥25%; protocolo RCT submetido | D-09 |
| **Sprint 6** | Pós-7/Ago | Hardening pós-CFM + sales pack NR-1 documental-only (não código) + decisões pós-MVP | CFM compliance score ≥90%; 1 LOI documental NR-1 (sem código) | — |

**Marco final 7/Ago/2026:** 100 beta usuárias rodando há 30 dias, comitê safety operacional cadência mensal, DPIA + Política + Termos validados, CFM compliance ≥90%, RCT pré-registrado, MoU CISM/USP assinado. **NR-1 código fica para Q1/2027 (Halle wins).**

---

## 7. The 22 Tier-S Quality Gates (@qa) — Clusterizados

@qa Quinn listou 22 gates Tier S em 6 categorias. Clusterizados por categoria + owner primário + sprint target:

### Cluster A — Crisis Safety (5 gates)

| Gate | Owner | Sprint | Detalhe |
|------|-------|--------|---------|
| S-01 Crisis golden set 200 → 500 cenários PT-BR | @qa | 1 | TPR ≥0.95, FPR ≤0.05; Atul: 500 estratificados |
| S-02 Output filter ML semântico (não só regex) | @dev | 1 | Recall ≥0.92; p95 ≤80ms; versionado por hash |
| S-03 Detector piora clínica PHQ-9 dinâmico + handoff | @dev + @data-engineer | 3 | Trigger ≥2 sinais; SLA notificação ≤5min |
| S-04 Crisis regression suite por troca de LLM | @qa + @dev | 1 | CI gate bloqueia merge se safety cair >2% |
| S-22 Acessibilidade WCAG 2.2 AA crisis screens (AAA preferível) | @ux + @qa | 4 | axe-core CI gate + leitor tela PT-BR |

### Cluster B — Security & Auth (5 gates)

| Gate | Owner | Sprint | Detalhe |
|------|-------|--------|---------|
| S-05 Prompt injection guard em `customInstructions` (C-01) | @dev | 1 | 48 patterns + delimitadores; CVSS 8.6 aberto |
| S-06 RLS bloquear UPDATE role em `profiles` (H-02) | @data-engineer | 1 | Migration + teste escalation NEGADO |
| S-07 RLS profissional sobre conversations/messages (H-03) | @data-engineer | 1 | Policy EXISTS link active |
| S-08 Invite codes expires_at 48h + cron (H-01) | @dev | 1 | Migration + endpoint valida |
| S-09 INTERNAL_API_KEY obrigatória prod + timing-safe | @devops + @dev | 1 | timingSafeEqual; CI rejeita boot sem key |

### Cluster C — LGPD Consent + PII (5 gates)

| Gate | Owner | Sprint | Detalhe |
|------|-------|--------|---------|
| S-10 Consentimento profissional granular Art. 11 LGPD | @dev + @po | 3 | Checkbox separado + escopo explícito |
| S-11 `professional_access_log` append-only Art. 18 VII | @data-engineer | 3 | Insert em cada SELECT; retenção 5 anos |
| S-12 Filtro temporal profissional pós-consent_given_at | @dev | 3 | Query WHERE started_at >= link.consent_given_at |
| S-15 Workflow exclusão LGPD revoga links + audita | @dev | 3 | DELETE /account cobre professional_patient_links |
| S-18 Age gate <18 + parental consent 16-18 Art. 14 | @dev + @ux | 1 | Bloqueio hard <16; parental 16-18 |

### Cluster D — Legal & Regulatory (4 gates)

| Gate | Owner | Sprint | Detalhe |
|------|-------|--------|---------|
| S-13 Termos profissional + DPA + sigilo CFP | @po + legal-chief | 4 | Aprovação OAB; remoção DraftBanner |
| S-14 Política Privacidade preenchida (DPO, CNPJ — não placeholders) | @po + legal-chief | 1 | OAB-SP ou OAB-DF parecer escrito |
| S-16 CFM 2.454/2026 disclaimer "não substitui profissional" toda screen | @ux + @po | 1 | Card persistente + spec aprovado por médico parecerista |
| S-17 DPIA submetido ANPD | legal-chief + @data-engineer | 1 | Documento publicado; protocolo ANPD |

### Cluster E — Operational (3 gates)

| Gate | Owner | Sprint | Detalhe |
|------|-------|--------|---------|
| S-19 Safety committee sign-off (2 psiquiatras + 1 CRP) | @po + clinical-co-founder | -1 | Ata assinada; veto explícito crisis flows |
| S-20 Plano resposta incidente clínico (suicídio reportado, vazamento) | @devops + legal-chief | 3 | Runbook SLA ≤2h ANPD/familiares/CVV |
| S-21 CORS sem `*` quando credentials: true (M-02) | @devops | 1 | Validação Zod; teste rejeita wildcard |

**Distribuição por sprint:** Sprint 1 = 12 gates / Sprint 3 = 6 gates / Sprint 4 = 2 gates / Sprint -1 = 1 gate (comitê) / Sprint 1 doubles up = 1.

**Veredict Quinn pre-launch:** 22 Tier S = PASS + 15 red-team ≥14/15 PASS + eval harness baseline + safety committee sign-off. Sem isso = launch ilegal/perigoso.

---

## 8. Top 10 Strategic Risks com Mitigation

| # | Risco | Likelihood | Impact | Vetor | Mitigação Orion (cross-agent) |
|---|-------|------------|--------|-------|-------------------------------|
| R1 | **Janela CFM ago/2026 perdida (compliance escorrega)** | Médio (40%) | Crítico (kill) | Falta CRM/CRP + classificação não documentada + ANVISA atrasada | Lock features Sprint 8; mock audit Sprint 10; clinical co-founder semana 1 (Halle); comitê safety semana 2 (Morgan + Alison) |
| R2 | **Retenção D30 <12% (padrão mercado MH)** | Alta (60%) | Crítico (unit econ quebra) | Onboarding sem valor 60s; sem peer cohort; sem proactive outreach | Concierge MVP Sprint -1 valida; Sean Duffy peer cohorts; welcome call humano D1-D2; PHQ-9 visual feedback (Sean) |
| R3 | **Incidente safety publicado (crise não rotada, AI psicose, identity discontinuity)** | Médio-Baixo (15-25%) | Crítico (reputational + regulatorio) | Crisis routing imaturo; sem detecção delírio (Psychiatric News 2025); LLM hallucination memória | SPI Stanley-Brown digital; CVV 188 nativo; Mr. Walker protocol (Alison); recall ≥99% severity≥2 (Demis); audit hash chain (Dara + Werner) |
| R4 | **Zenklub/Conexa lança "Anipis clone" ou compra Cíngulo** | Médio (30-40%) | Alto | Capital R$30M Zenklub + distribuição Omint+Vivest 300k + brand | First-mover CFM 2.454/2026 + parceria CISM/USP defensiva + PT-BR clínico moat (Halle) + pricing 10x abaixo telepsicologia |
| R5 | **CFP/CFM se opõe publicamente ("terapeuta IA")** | Baixo-Médio (20%) | Alto | Marketing exagera; UX confunde; sem disclaimers | Posicionamento "companheiro adjunto" todo touchpoint; cartilhas CFP literais; carta princípios anti-15-riscos Brown 2025; relacionamento ativo CRP regional |
| R6 | **Founder solo discount 30-40% valuation + DPO conflito + déficit clínico (trifecta)** | Alta (70%) | Alto (Series A) | Estrutural — não decidido | Clinical co-founder CRP equity 8-15% nas próximas 4 sem (Halle insight) + DPO externo Sprint 3 (Lucia hard stop) |
| R7 | **Eval brittle — regressão silenciosa safety/empatia** | Alta (50%) | Crítico | Sem golden set ≥500, sem CI gate, sem shadow eval | Langfuse self-host (Aria); 500 cenários estratificados (Atul); critic-actor seletivo (Demis); weekly full eval; PR bloqueia >2pp drop |
| R8 | **Cap table dilution irreversível (comitê + co-founder + futuro)** | Médio (40%) | Alto | Equity sem cálculo deixa pouco para Series A | Híbrido 2 movimentos: 8-15% clinical co-founder + 0,3% comitê (4y vesting 1y cliff); founder mantém 70%+ pré-Series A |
| R9 | **CFM reclassifica Anipis como "alto risco IA"** | Médio (35%) | Crítico | Crisis routing + uso clínico = provável tier alto | Posicionamento wellness + safety SaMD-grade (Aria); aconselhamento jurídico OAB-SP/DF Sprint 0; Termo Compromisso Médico-Responsável (Atlas semana 1) |
| R10 | **Litígio civil tipo Character.AI no Brasil** | Baixa-Média (15%) | Existencial | Falha crisis routing em menor + sem audit trail + Ministério Público | HITL crisis + age verification + audit log hash chain + D&O insurance Phase 2; bem-vindo seg+jurídico no board (Bakul); Mr. Walker stay-with-user (Alison) |

---

## 9. Resource & Cost Estimate (12 semanas)

| Categoria | Estimativa baixa | Estimativa alta | Vozes |
|-----------|------------------|-----------------|-------|
| **Infra (Supabase + Vercel + Railway/Fly + Langfuse VPS + Mem0 rejeitado)** | R$1.500/mês | R$3.000/mês até 5k DAU; R$5k+ pós-launch | Aria §9.1 |
| **DPO externo (DPO-as-a-Service Sprint 3+)** | R$8.000/mês | R$15.000/mês (Opice Blum / Baptista Luz / Demarest) | Lucia §3 |
| **Comitê safety híbrido (4 membros)** | R$6.000/mês (R$1,5k cada) | R$10.000/mês + 0,3% equity 4y vesting | Morgan P0-3, Alison |
| **Clinical co-founder CRP** | Equity 8-15%, sem retainer cash imediato | Equity 8-15% + R$5-10k/mês após Series A | Halle |
| **Legal OAB-SP/DF (advogado LGPD/CFM)** | R$3.000 setup + R$2-3k/mês retainer | R$5-7k setup + R$3-5k/mês retainer | Morgan §7, Lucia |
| **Pentest externo light** | R$3.000 | R$8.000 (Cure53 / Trail of Bits scope reduzido) | @qa S-22, Aria spike S6 |
| **Concierge MVP Sprint -1 (vouchers R$50 × 20 Júlias + WhatsApp Business)** | R$1.200 | R$2.500 | Eric Ries, Alison |
| **Beta cohort Sprint 4 (R$50 voucher × 100 × 4 semanas = R$5k + Discord/Telegram premium)** | R$5.500 | R$8.000 | Alison, Sean |
| **CISM/USP MoU + 1 founder-trip BSB→SP** | R$3.000 | R$10.000 (R$10-30k contrapartida pesquisa Atlas §10) | Atlas, Atul |
| **Flux renders rebrand v2 (3 renders Warm only)** | $0.90 (~R$5) | $1.80 (~R$10) — D-UX-05 | Uma |
| **Marca INPI classes 9/35/42 + advogado** | R$2.000 | R$5.000 | Pax P0-M4-030, Atlas |
| **Tools (Langfuse self-host VPS Magalu, Mem0 NÃO usar)** | R$200/mês (Langfuse) | R$500/mês | Aria, Demis |

**Total Sprint -1 a Sprint 6 (12 sem):**
- **Cash burn baixo:** ~R$50-80k (founder R$0, infra mínima, comitê retainer, legal, pentest)
- **Cash burn médio:** ~R$80-130k (com DPO externo Sprint 3+, beta voucher 100 pessoas, CISM contrapartida)
- **Equity diluição:** 8-15% (clinical co-founder) + 0,3% (comitê) = ~11-15% pré-Series A

**Recomendação Orion sobre custos:** Se runway founder solo é <R$150k, executar opção **cash burn baixo (~R$60k)** = comitê pro-bono primeiros 2 meses (Eric Ries argumento parcial), legal R$3k setup + escalar pós-beta, DPO externo só Sprint 4 (não 3), CISM contrapartida R$5k inicial. **NÃO economizar em:** comitê safety final formal (Alison categórico), pentest externo light (Quinn), clinical co-founder (Halle estrutural).

---

## 10. Decision Authority Matrix

Quem decide o quê (founder vs comitê vs Orion advisory) — esclarece responsabilidade pós-comitê safety formal:

| Decisão | Founder Breno | Clinical Co-Founder CRP | Comitê Safety (3+1+1) | DPO externo | Orion advisory |
|---------|---------------|--------------------------|------------------------|-------------|----------------|
| Posicionamento SaMD vs Wellness | Final | Input | Veto se conflito CFM | Input LGPD | Cross-agent sintese |
| Stack tech (LangGraph etc.) | Final | — | — | — | Advisory + spikes evidence |
| Prompts CBT + crisis responses | Approval | Approval | **Veto formal mensal** | — | — |
| Output filter listas (medicamentos/diagnose) | — | Approval | **Veto formal** | — | — |
| LGPD DPIA + Política Privacidade | Approval | — | Review | **Final** | Advisory |
| Recrutamento beta canal | Final | Input | Veto se risco ético | — | Advisory |
| Pricing tiers (R$29/39/79) | Final | Input | — | — | Advisory |
| RCT design + pré-registro ReBEC | Approval | Approval | **Veto formal** | Review | Advisory |
| Marca INPI + rebrand v2 | **Final (bulk trigger Uma)** | — | — | — | Advisory |
| Cap table (equity comitê + co-founder + Series A futura) | **Final** | Negotiate | Negotiate | — | Advisory |
| Operadora ANS / NR-1 wave timing | **Final** | Input | — | Input (BAA) | Advisory |
| Sprint goals + scope cut | **Final** | Input crítico | Input | — | Advisory |

**Princípio:** Founder mantém autoridade executiva final. Comitê safety tem **veto formal** sobre prompts, crisis flows, output filter, RCT design (Alison categórico: "revisão semanal, não trimestral"). DPO externo é **final** em LGPD compliance. Clinical co-founder é **co-aprovador** em decisões clínicas + RCT. Orion permanece **advisory** (squad master, não autoridade decisória).

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · v1 master report*
*"A arquitetura é o que sobrevive quando o mundo real chega. O mundo real chega em ago/2026 (CFM) e quando a primeira Júlia digitar ideação às 4h da manhã. Tudo aqui é desenhado para sobreviver às duas."*

— Fim do master report —
