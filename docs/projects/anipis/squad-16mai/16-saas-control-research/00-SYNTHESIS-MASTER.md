# Anipis — SaaS Control & Observability · HYDRA Research Synthesis

**Data:** 19/Mai/2026 (D-11 ao Closed Beta 30/Mai)
**Metodologia:** HYDRA-style — 5 agentes paralelos + 2 transcrições de vídeo, 24 mind clones canalizados, ~50 fontes web 2025-2026
**Pergunta do founder:** "Como vou controlar a aplicação, monitorar processos, e garantir que erros não dependam do usuário me contactar? Esta é a parte mais crítica, principalmente em saúde mental."
**Verdict:** O controle de SaaS pra Anipis NÃO é o problema técnico padrão. É um **problema de segurança clínica disfarçado de observability**. A métrica que importa não é uptime — é **recall do classificador de crise**.

---

## 0. A TESE CENTRAL (se você ler só isto)

> **Em SaaS normal, você monitora pra não perder dinheiro/usuários. Na Anipis, você monitora pra não perder VIDAS.**

Os 5 agentes convergiram independentemente na mesma conclusão:

**O HTTP 200 é mentira.** Uma resposta de chat pode retornar `200 OK` com latência ótima e mesmo assim ter classificado uma crise suicida como GREEN. O sucesso técnico é irrelevante se o classificador errou. **Tudo downstream do classificador, não do status code.**

Por isso o artefato #1 que você constrói este mês **não é** dashboard de latência. É o **Safety SLO** — tratado como controle regulatório, não métrica de vaidade.

---

## 1. O GAP CRÍTICO (lives-at-stake) — descoberto por 2 agentes independentes

**Anipis HOJE não tem detector de falso-negativo no classificador de crise.**

```
Fluxo atual:
  mensagem → classificador → SE crise: crisis_event_logger dispara
                          → SE NÃO crise (GREEN): ...nada é logado

Problema: uma crise MISSED (classificada GREEN por erro) não alerta NADA.
          Você nunca fica sabendo. Silêncio = "tudo bem". Mentira mortal.
```

### A solução (Agente 2 + Agente 3 convergem)

**Shadow LLM-as-judge** rodando assíncrono em 100% das mensagens:
- Modelo de família DIFERENTE (Anthropic Haiku, não OpenAI — evita viés do mesmo modelo errar igual; ponto do Hassabis clone)
- Quando o shadow DISCORDA do classificador primário → escreve numa **fila de revisão clínica** (SLA 24h)
- Mais o **golden dataset noturno**: 80-100 prompts de teste rodando toda madrugada validando que o classificador não regrediu

**Custo:** o Langfuse (que você JÁ tem) faz isso via Datasets + Evaluations. Você usa só ~30% do Langfuse hoje. Zero ferramenta nova.

---

## 2. OS 5 RELATÓRIOS — destilados

### 📁 Agente 1 · SRE/Observability (`agents/01-sre-observability.md`)
**Clones:** Charity Majors, Niall Murphy, Brendan Gregg, Casey Rosenthal, Nicole Forsgren

- **Beta = stack "chato, grátis e honesto"**: Sentry free + Better Stack free + Railway logs + Grafana Cloud free + Langfuse existente = **$0/mês**. Honeycomb/Datadog = procrastinação disfarçada de engenharia em 20 usuárias.
- **4 Golden Signals + 1 (Safety)** instrumentados em EXATAMENTE 5 endpoints (`/chat/message`, `/crisis/alert-contact`, `/api/beta-signup`, `/auth/*`, `/journal/*`). Não boilar o oceano.
- **Crisis path tem latency floor próprio:** p95 < 1.5s (vs 3.5s chat normal) — em saúde mental, resposta lenta de crise ≈ dano.
- **Regra solo-founder (Murphy):** <2 pages/semana ou você queima. Só 2 coisas acordam você às 3h: outage total + Safety SLO fast-burn. Resto = digest 9h.
- **Burn-rate multi-window** (Google SRE Ch.5) é a ÚNICA fórmula anti-fadiga. Nunca alertar em threshold cru ("CPU>80%").
- **Murphy é explícito:** on-call de 1 pessoa é quebrado desde o dia 1. Tratar como risco que bloqueia fundraising, não otimização.

### 📁 Agente 2 · LLM Observability (`agents/02-llm-observability.md`)
**Clones:** Chip Huyen, Harrison Chase, Jerry Liu, Cassie Kozyrkov, Demis Hassabis, Atul Butte

- **Manter Langfuse como backbone + adicionar 3 camadas.** Langfuse OBSERVA mas não DEFENDE — sozinho é insuficiente pra app lives-at-stake.
- **Vercel AI Gateway** recomendado como proxy fino (zero markup de token, regiões EU, teto de custo por-key nativo + failover OpenAI→Anthropic). Rejeitou LangSmith/Braintrust/W&B por hosting US (LGPD). Rejeitou Helicone (redundante).
- **Crisis classifier SLO:** recall ≥0.95, safety_score zero-tolerância, "zero crises confirmadas perdidas em qualquer janela de 30 dias". Auto-page mesmo às 3h se recall noturno cair.
- **A/B testing com n=20 é estatisticamente impotente** — só champion/challenger offline no Beta; canary em 100 WAU; A/B estatístico real só ≥500 WAU. Prompts safety-critical NUNCA fazem A/B em prod.
- **Custo:** baseline ~$0.84/dia em 20 usuárias, 5-tier alert (GREEN→NUKE), teto $50/dia Beta.
- **Pré-Beta: 6 itens P0** (~5 dev-days + 2.5 clinical-days) + golden set noturno de 80 prompts (35 crisis / 15 calibration / 20 empathy / 10 adversarial PT-BR).

### 📁 Agente 3 · Healthcare Ops (`agents/03-healthcare-ops.md`)
**Clones:** Alison Darcy, Acacia Parks, Patricia Peck, Lucia Savage, Bruce Schneier, Halle Tecco, Eric Topol, Kate Ryder, Christian Dunker

- **7 SLOs lives-at-stake** que SaaS normal não tem. Principal: FN rate do classificador ≤2% (Beta) trackeado ACOPLADO ao FP rate (5-15% aceitável). Pesquisa medRxiv 2026: detecção de crise é "monitoramento de segurança online, não predição de acurácia".
- **3 BLOCKERS de launch** (vetores de dano irreversível): (1) baseline do classificador, (2) telemetria de render do banner CVV, (3) integridade do audit chain, (4) thresholds de sinal por-usuário. Se algum vermelho → NÃO lança, slip 7/Jun.
- **🚨 SOP do clinical advisor é FICÇÃO hoje.** Anipis tem advisor CRP "revisando logs" sem SLA. Escreveu SOP completo: SLA 24h-úteis revisão RED, retainer PAGO (oversight voluntário é a falha #1 em postmortems — Lucia Savage), advisor backup obrigatório pré-D-0, autoridade de halt-release em mudanças do crisis path.
- **⚖️ CORREÇÃO REGULATÓRIA:** o trigger Art. 48 / 3 dias úteis vive na **Res. CD/ANPD nº 15/2024**, NÃO na 19/2024 (que é transferência internacional/SCC). Pra Anipis tudo é dado sensível de saúde → relevância de risco presumida → maioria dos incidentes é reportável.
- **CFM 2.454/2026** publicada 11/Fev/2026, grace de 180 dias acaba ~Ago/2026. Governa IA em PRÁTICA MÉDICA. Anipis fica fora via "scope-protection monitors" (bloqueia claims de diagnóstico/medicação/substituição-de-terapia).
- **Gap forense:** hash chain 5y é necessário mas insuficiente. Faltam campos: `model_sha`, `prompt_template_sha`, `feature_flags_snapshot`, `monotonic_seq`, banner-ack, follow-up state + **Merkle root horário ancorado em storage write-once**. Logs de vendor (OpenAI/Anthropic/WhatsApp) expiram em 30-90d → postmortem de tentativa de suicídio precisa de preservation request em 24h.
- **Postmortems de concorrentes:** Tessa (upgrade silencioso de modelo bypassou change-control → crisis path é sagrado), Replika (deprecar surface emocional É um evento clínico), Woebot ("não sabemos fazer isso com segurança" é decisão de produto válida), Character.AI (completude de audit virou pré-requisito de seguro).
- **Christian Dunker (PT-BR):** classificador tem que ser treinado em idiomas expressivos brasileiros, não inglês traduzido, pra não patologizar intensidade normal.

### 📁 Agente 4 · Incident Response Solo (`agents/04-incident-response.md`)
**Clones:** Charity Majors, Casey Rosenthal, Gene Kim, Jez Humble, John Allspaw, Will Larson, Brendan Gregg, Niall Murphy

- **MODELO ON-CALL INVERTIDO (a tese central):** SaaS normal pageia humano pra PEGAR problema. Na Anipis, o caminho life-critical (crisis escalation) **NUNCA pode depender do Breno estar acordado** — é enforced no produto (Layer 0) + auto-remediation (Layer 1). On-call (Layer 2) é pra reparo/aprendizado, não pra pegar em tempo real. Isso resolve a tensão "não posso ser pageado por tudo, não posso perder sinal crítico".
- **Severity matrix é safety-first, não blast-radius:** single-user normalmente é P2 — EXCETO qualquer coisa tocando safety, que é sempre P0. "Júlia #7 chat ruim" = P2. "Júlia #7 diz que Anipis encorajou autolesão" = P0.
- **Tooling concreto:** Better Stack free todo o Beta (uptime + status page + heartbeat + on-call), upgrade $29/mo no public launch pra phone/SMS paging. Healthchecks.io ($0) em paralelo como dead-man switch de vendor independente. Phone call + Critical-Alert push são os únicos canais que acordam founder dormindo.
- **Status page: SEM página pública no Beta** (20 usuárias; página vermelha "DEGRADED" pode angustiar audiência de saúde mental) → banner in-app só. Pública pós-Beta com framing calmo.
- **2 dead-man switches:** app heartbeat + crisis-path synthetic heartbeat (a cada 5min afirma que a resposta contém 188/CVV). Human-liveness switch: sem ACK founder → escala pro clinical advisor (safety) ou amigo técnico (infra) → SAFE MODE automático.
- **Regra de design inegociável:** resposta de crisis support é um card estático sempre-disponível (188/CVV/192) que NÃO depende do LLM, de nenhum vendor, nem do Breno.
- Protocolo "Anipis me disse pra me machucar" em 4 fases (com avaliação de notificação LGPD/ANPD). Template de postmortem blameless. Mínimo-viável-safety se faltar tempo: heartbeats + SAFE MODE + backup contacts.

### 📁 Agente 5 · Cost Control (`agents/05-cost-control.md`)
**Clones:** Patrick Campbell, Will Larson, Werner Vogels, Aswath Damodaran, Jason Lemkin, Geoff Cook, David Ebersman

- **🔢 OS NÚMEROS DO BRIEFING ESTAVAM ERRADOS PRO BETA.** "$200-500/mo OpenAI" é número steady-state-at-volume, não realidade de 20 usuárias. Beta real (20 × 14d) = **~$5-11 típico, $22 worst-case all-in**. O depósito de $50 funda o Beta inteiro várias vezes — é ramp pra Tier 2, não estimativa de burn. Budget $25/mo, alerta em $50.
- **OpenAI = ~95% da variância controlável.** Custo unitário: ~$0.0077/turn blended, $0.06-0.19/usuária/dia. Forecast: 100 usuárias ≈ $265-570/mo, 1000 usuárias ≈ $2000-5300/mo (OpenAI = 70-85% do spend em escala).
- **Resposta saúde mental pra fail-open vs fail-closed:** "**fail-closed na carteira, fail-soft no humano**" — teto de gasto duro, MAS ao estourar, rota pra caminho degradado-mas-seguro com **bypass do classificador de crise** (mensagens de crise SEMPRE passam o teto). Um 429/500 cru pra alguém em sofrimento é incidente de product-safety, não só bad UX. **P0 test gate.**
- **Tooling é overkill até ~$3k/mo.** DIY cron → OpenAI native budget limits → Vantage free (<$2,500 tracked) → Vantage Pro $30. CloudZero/Datadog desnecessários. Threshold de anomalia: **>1.3× média-7d-trailing E >$3 absoluto** (gate duplo evita falso positivo em volume baixo; 5% dispara sempre).
- **NÃO consolidar** (Vercel-bundle) — economia ~$15/mo e enfraquece region-pinning LGPD. Única consolidação que vale: gateway LLM fino (Portkey/Helicone) no marco de 100 usuárias.
- **CORREÇÃO premissa:** SOC2 NÃO exige Sentry Team. O custo real de "compliance tier" é **Supabase Team $599/mo** (SOC2+ISO), revenue-gated — adiar até enterprise pagante exigir. Compliance de saída-de-Beta = só **Supabase Pro $25**. Anthropic deferido continua landmine de $30k/ano.

---

## 3. O QUE OS 2 VÍDEOS ENSINARAM

### 🎬 Vídeo 1 — Kubernetes HPA (o tema do chrisaleiro)
`video-01-k8s-hpa-transcript.txt` · [YouTube Iq7LIBwJ9pE](https://www.youtube.com/watch?v=Iq7LIBwJ9pE)

- A "1 linha que cria réplicas automáticas" é real: `kubectl autoscale deployment X --cpu-percent=50 --min=1 --max=10`
- MAS pressupõe cluster K8s + metric server + resource requests montados antes. Dias de setup.
- **Veredito Anipis:** overkill absoluto pro Beta. Equivalente sem virar SRE de K8s = **Railway Pro horizontal scaling** (slider) ou **Fly.io** (`fly autoscale set min=1 max=10`, 1 linha de verdade, sem cluster). O conceito é certo; o caminho K8s é o "modo difícil" desnecessário agora.

### 🎬 Vídeo 2 — Langfuse Walkthrough (já na sua stack)
`video-02-langfuse-walkthrough-transcript.txt` · [YouTube 2E8iTvGo9Hs](https://www.youtube.com/watch?v=2E8iTvGo9Hs)

- Você usa ~30% do Langfuse. As features ausentes (**Evaluations LLM-as-judge + Datasets golden set**) são EXATAMENTE o que resolve o gap crítico de falso-negativo do §1.
- Prompt versioning permite mudar system prompt sem deploy + comparar versões (mas safety prompts nunca A/B em prod — Agente 2).

---

## 4. PLANO DE AÇÃO CONSOLIDADO

### 🔴 P0 — Pré-Beta (D-11 a D-0) · bloqueia launch se vermelho

| # | Item | Esforço | Origem | Quem |
|---|------|---------|--------|------|
| 1 | **Safety SLO + golden dataset 80 prompts** (Langfuse Datasets) | 2 dev-days + 1 clinical-day | A1,A2,A3 | Orion + advisor |
| 2 | **Shadow LLM-as-judge** (Anthropic Haiku async em 100% msgs) → fila revisão clínica | 1.5 dev-days | A2,A3 | Orion |
| 3 | **Crisis-path synthetic heartbeat** (5min afirma resposta contém 188/CVV) | 0.5 dev-day | A4 | Orion |
| 4 | **Card crisis estático** (188/CVV/192 NÃO depende de LLM/vendor/founder) | 0.5 dev-day | A4 | Orion |
| 5 | **Clinical advisor SOP + retainer pago + backup advisor** | founder action | A3 | Founder |
| 6 | **SAFE MODE** + dead-man switch (founder offline 24h) | 1 dev-day | A4 | Orion |
| 7 | **fail-closed wallet + crisis bypass** (teto $50/dia, crise sempre passa) | 0.5 dev-day | A5 | Orion |
| 8 | **Banner CVV render telemetry** (confirma que apareceu, não só que foi enviado) | 0.5 dev-day | A3 | Orion |

### 🟢 TIER 1 — Pré-Beta observability ($0/mo) · ~半 dia

| # | Item | Tool |
|---|------|------|
| 9 | Pino structured logging nos 5 endpoints + Sentry tags (`crisis_level`, `error_class`) | Sentry free |
| 10 | Better Stack: 4 monitors + heartbeat crisis-path + on-call SMS founder | Better Stack free |
| 11 | Cron noturno: crisis eval job + Better Stack heartbeat | Railway cron |
| 12 | Daily 9h digest email (Pino → script → Resend) | $0 |
| 13 | `/internal/safety-dashboard` page (crisis events 24h + recall trend) | custom |
| 14 | OpenAI cost tracker → P1 em $25, P0 em $50 (gate >1.3× E >$3) | DIY cron |
| 15 | Cron daily Supabase ping (prevenir pause free-tier — já vimos hoje) | Railway cron |

### 🟡 TIER 2 — Pós-Beta semana 1+ (~$50-75/mo) · se tração

- Sentry Team $26 + Better Stack paid $29 (phone paging) + Supabase Pro $25
- Vercel AI Gateway (failover OpenAI→Anthropic + cost ceiling por-key)
- Anthropic reativada (D18: DPA enterprise + ZDR) → resilience multi-vendor
- Status page pública (framing calmo) + Merkle root forense horário

### 🔴 TIER 3 — Scale 1000+ (~$300/mo) · public launch

- Honeycomb Pro $130 (OTel) + Sentry Business + Railway/Fly autoscale (NÃO K8s ainda)
- On-call buddy #2 (Murphy: solo crisis SLO é insustentável)
- Vantage Pro $30 cost anomaly + DORA quarterly scorecard

---

## 5. CORREÇÕES QUE A PESQUISA TROUXE (importante)

1. **Custo Beta real = ~$11-25/mo**, não $200-500. Os $50 OpenAI fundam o Beta inteiro. (A5)
2. **Art. 48 / 3 dias = Res. ANPD 15/2024**, não 19/2024. Atualizar referências em DPIA/Privacy/Termos. (A3)
3. **SOC2 não exige Sentry Team.** Custo real de compliance é Supabase Team $599 — adiar até enterprise pagante. (A5)
4. **K8s autoscaling = adiável.** Railway/Fly fazem o mesmo sem complexidade. (Vídeo 1)
5. **Você usa só 30% do Langfuse.** As 70% restantes resolvem o gap crítico de graça. (Vídeo 2 + A2)

---

## 6. RECOMENDAÇÃO EXECUTIVA FINAL

**A parte mais crítica que você intuiu está CERTA — mas não é "o servidor cair".** É **o classificador de crise errar em silêncio**. Servidor caindo é visível e auto-recupera. Crise classificada como GREEN é invisível e mata.

**Sequência pra D-0:**
1. Fechar os 8 P0 (foco no §1 gap: shadow judge + golden set + crisis heartbeat)
2. TIER 1 observability $0/mo (meio dia de setup)
3. Clinical advisor SOP com retainer real (founder — sem isso, slip 7/Jun)
4. Os 3 blockers do Agente 3 verdes antes de lançar

**O que adiar sem culpa:** K8s, Honeycomb, Datadog, status page pública, multi-region, A/B testing, Anthropic. Tudo isso é pós-tração.

**Custo total pré-Beta:** ~$0/mo observability + ~$25/mo Supabase Pro + ~$11-25 OpenAI Beta = **<$60 total pro Beta inteiro.** O gargalo nunca foi dinheiro nem infra. É o gap de safety monitoring — e esse se fecha com o Langfuse que você já paga.

---

## Anexos

- `agents/01-sre-observability.md` (580 linhas)
- `agents/02-llm-observability.md` (480 linhas)
- `agents/03-healthcare-ops.md` (547 linhas)
- `agents/04-incident-response.md` (520 linhas)
- `agents/05-cost-control.md` (360 linhas)
- `video-01-k8s-hpa-transcript.txt`
- `video-02-langfuse-walkthrough-transcript.txt`

**Total pesquisa:** ~2500 linhas deliverables + 2 transcrições + ~50 fontes web 2025-2026 + 24 mind clones canalizados.
