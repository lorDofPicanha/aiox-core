# Outbound Specialist — Clinical Co-Founder Anipis Outreach Playbook v1

**Author:** Blaze (@outbound-specialist) · sales-ops mind clone
**Data:** 2026-05-16
**Refina:** drafts v0 em `../outreach-template-{1,2,3}-*.md`
**Janela:** 4 semanas até LOI assinada (deadline 2026-06-13)
**Volume alvo semana 1:** 30-50 outreaches · response rate baseline ~10%

---

## 0 — Framing ético (lê primeiro)

Outbound em saúde mental não é outbound de SaaS B2B. As pessoas que recebem essas mensagens são clínicas/os que tratam pacientes vulneráveis. Três regras inegociáveis antes de qualquer sequence rodar:

1. **Zero growth-hacking grosso.** Sem "AI personalizer" que produz primeira linha falsa. Sem "ROI calculator" CTA. Sem agitação artificial.
2. **Founder-mode honesto.** Equity 8-15%, cash R$8-12k, deadline 2026-06-13 são fatos. Não inflacionar. Quem morde anzol inflado machuca depois.
3. **Saída graciosa em todo touch.** Toda mensagem tem opt-out explícito ("se não for fit ou timing, responde 'pass' que arquivo aqui mesmo"). Cadence para em D+7 (Tier 1/3) ou D+14 (Tier 2). Sem 8-touch grind.

Outbound saudável aqui = 8-12% reply rate, 30-40% positive sentiment entre replies, zero spam complaint. Tudo acima disso provavelmente é teatro; tudo abaixo significa que a tese ou o ICP estão errados.

---

## 1 — Sequence Tier 1 (Digital Health Alumni)

**ICP:** ex-Conexa / Zenklub / Vittude / Cíngulo / Psicologia Viva / TelaVita com 1-2+ anos na major + saída recente. Top priority.
**Canal primário:** LinkedIn DM (mais pessoal que cold email; alumni esperam mensagem direta nessa categoria).
**Canal fallback:** Email se mutual connection 2nd-degree existe (warm intro request via mutual).
**Cadence:** 4 touches em 10 dias. Para em D+10.

### Touch 1 — LinkedIn DM (D+0, 280 palavras)

**A/B Subject Test (LinkedIn preview line + Email subject se fallback):**
- Variant A — pergunta direta: `CFM 2.454: problema ou oportunidade?`
- Variant B — credencial alumni: `Ex-{Conexa/Zenklub} → co-founder Anipis?`
- Variant C — janela explícita: `4 semanas pra LOI: clinical co-founder BR`

Split 33/33/33 nas primeiras 30 mensagens. Vencedor (>open rate proxy via reply rate) promove pro pool ativo a partir da semana 2.

**Body:**

```
Oi {NomePrimeiro},

Vi seu trajeto na {Empresa} entre {AnoInicio}-{AnoFim}. Pergunta direta antes de qualquer pitch: você lê a janela CFM 2.454/2026 (ago/2026) + NR-1 punitiva (mai/2026) + ANS RN-627/2024 como ruído regulatório ou como moat de 18-24 meses pra quem chegar primeiro com SaMD-grade safety?

Sua resposta determina se essa conversa faz sentido.

Estou construindo o Anipis — companion AI saúde mental pra geração 18-29 BR. Pré-launch. 70% backend pronto (Fastify TS, pgvector, safety classifier 4-level, 7-stage output filter PT-BR). Voice DNA Dunker school (não DSM traduzido). Tese validada por 17 mind clones: Halle Tecco, Alison Darcy (ex-Woebot), Lucia Savage (ex-ONC/HHS), Christian Dunker, Atul Butte.

O que falta é {NomePrimeiro}: clinical co-founder CRP. Estrutural, não advisor.
- Equity 8-15% common stock, vesting 4y/1y cliff, cap table #2
- R$8-12k/mês founder mode (deferral 6m opcional)
- Decision rights veto sobre clinical surface
- LOI signed deadline 2026-06-13

Sua experiência {Empresa} é exatamente o que falta — você já viu o que falha em scale BR, sabe diferenciar Cíngulo-clone de Calm-pra-saúde-mental, e provavelmente tem opinião forte sobre safety gaps que ninguém endereçou.

Ask: 30min call essa ou próxima semana. Sem deck pesado. Sua tese vs minha tese.

Se não for fit ou timing, responde "pass" — arquivo aqui mesmo, sem follow-up.

Breno
```

### Touch 2 — Follow-up D+3 (LinkedIn DM ou email — mesmo canal do T1, 90 palavras)

Hook: referenciar 1 evento público recente da pessoa ou da empresa anterior dela. Curto.

```
Oi {NomePrimeiro}, follow-up curto.

Vi {EventoRecente — post LinkedIn / fala em podcast / news ex-empresa}. Reforça a pergunta da semana passada: a janela regulatória mata os players atuais ou força adaptação? Sua leitura me interessa mais que minha.

30min essa semana — você diz o horário. Ou "pass" e fecho aqui.

Breno
```

### Touch 3 — Follow-up D+7 (mesmo canal, 60 palavras + 1 link público)

Hook: prova social light + saída graciosa explícita.

```
{NomePrimeiro}, último toque. LP Anipis live: {URL público quando disponível}. Dossier completo 9MB sob NDA upon mutual interest. Se timing mudar nas próximas semanas, brenodecerqueira@gmail.com fica aberto. Sem mais follow-ups daqui — não quero ser inconveniente.

Breno
```

### Touch 4 — Status update no tracker (D+10)

Não é mensagem. É housekeeping. Marcar status `not-interested` / `no-response` / `responded-other` no `outreach-tracker.csv`. Mover pro pool de Q3 nurture (newsletter quando Anipis lançar) — não pra lixo. Pessoa pode reaparecer em 6m com timing diferente.

---

## 2 — Sequence Tier 2 (Academic Researchers)

**ICP:** Pesquisadoras/es Psi Clínica + Psiquiatria com background RCT publicado. CISM/USP IPq, UNIFESP Psicobiologia, UFRJ IPUB, UFMG Saúde Coletiva.
**Canal primário:** Email institucional (com cc orientador se PhD candidate jovem). Academic etiquette = email > LinkedIn.
**Warm intro path:** Sempre tentar warm intro primeiro via rede AIOS (advisors médicos, contatos prévios USP/UNIFESP). Cold backup só se 0 mutual identificado em 48h.
**Cadence:** 3 touches em 14 dias. Academic timing é slow — não force.

### Path A — Warm Intro Request (preferred)

Antes de cold email, identificar 2nd-degree contact via LinkedIn search "{Nome} + {Universidade}" cruzado com rede pessoal/advisors. Mandar ao mutual:

```
Oi {Mutual},

Estou rodando search clinical co-founder pro Anipis (companion AI saúde mental BR, pré-launch RCT modelo CONEMO). Vi que você conhece {Pesquisador}. O trabalho dela/dele em {Tópico} encaixa em 3 vias possíveis: co-founder estrutural, PI do RCT, ou clinical advisor sênior.

Topa fazer warm intro? Preparei 5 linhas pra você forward, ou apresento eu mesmo — você escolhe.

Sem pressão. Se não rolar contexto, blz também.

Breno
```

Se mutual aceita warm intro, mandar este forward-ready text (90 palavras):

```
{Pesquisador} — Breno Cerqueira é founder do Anipis, companion AI saúde mental BR pré-launch. RCT pré-registrado modelo CONEMO Indaiatuba, n=190 alvo. Tese validada por Halle Tecco, Alison Darcy (Woebot), Lucia Savage (ex-ONC). Procura {co-founder | PI | senior advisor}, dependendo do seu interesse e disponibilidade. Queria 30min call sua agenda. Não é pitch — é mapeamento de fit. brenodecerqueira@gmail.com
```

### Path B — Cold Email Backup (D+0, 280 palavras)

Usar SOMENTE se warm intro não materializar em 48h. Assunto institucional, tom acadêmico, três caminhos explícitos.

**A/B Subject Test:**
- Variant A: `Anipis × {Universidade}: três caminhos de colaboração (RCT, PI, co-founder)`
- Variant B: `Companion AI saúde mental BR — proposta de partnership acadêmica`

```
Prezada/o Profa./Prof. {Sobrenome},

Cumprimentos. Sou Breno Cerqueira, founder do Anipis — companion AI de saúde mental para a geração 18-29 brasileira, pré-launch (Sprint -1 Concierge MVP iniciando 2026-05-23, beta fechado n=40-100 Sprint 4-5 em Indaiatuba modelo CONEMO).

Escrevo porque seu trabalho em {Paper1, ano} e {Paper2, ano} aborda exatamente o ponto cego que estamos tentando cobrir: {específico — adesão digital adolescente | adaptação cultural PHQ-9 | acesso APS+companion}. A tese Anipis foi pressure-tested por 17 vozes de squad incluindo Halle Tecco, Alison Darcy (ex-Woebot), Lucia Savage (ex-ONC/HHS), Atul Butte (UCSF), Christian Dunker.

Três caminhos possíveis — você escolhe qual ressoa:

(1) Clinical Co-Founder estrutural — equity 8-15% common, vesting 4y/1y cliff, cap table #2, decision rights veto clinical surface, R$8-12k/mês founder mode, PI do RCT pré-registrado ReBEC + ClinicalTrials.gov, LOI deadline 2026-06-13.

(2) Principal Investigator + paper bridge — sua {Universidade} como IRB-issuer (Plataforma Brasil). Anipis funda o ensaio (n=190). Co-authorship em papers submetidos a JMIR Mental Health, RBP, Lancet Psychiatry. Stipend negociável.

(3) Senior Clinical Advisor — cadeira no Clinical Safety Committee. Equity 0,1-0,25% + retainer R$1,5k/mês. ~4h/mês review prompts + crisis flows + protocolo RCT.

Dossier 9MB (rebrand v2 + conclaves + voice DNA + ADRs + sprint plan) compartilho sob NDA upon mutual interest.

Ask: 30min call em horário que te servir nas próximas 2 semanas — entender qual via faz sentido pra sua agenda.

Cordialmente,

Breno Cerqueira
brenodecerqueira@gmail.com · LinkedIn: /in/brenodecerqueira
```

### Touch 2 — Follow-up D+7 (email, 80 palavras)

```
Prezada/o Profa./Prof. {Sobrenome},

Follow-up breve. Re-leitura do seu paper {PaperEspecífico} levantou pergunta concreta sobre metodologia: {questão técnica genuína — ex: como vocês resolveram drop-off entre sem4 e sem8 no protocolo X?}. Mesmo que as três vias de colaboração não façam sentido agora, agradeceria input metodológico em 15min de call.

Cordialmente,

Breno
```

### Touch 3 — Follow-up D+14 (email, 60 palavras)

```
Prezada/o Profa./Prof. {Sobrenome},

Último contato daqui. Sei que timing acadêmico é diferente — caso queira retomar em qualquer ponto dos próximos 6-12 meses (defesa, sabático, semestre novo), brenodecerqueira@gmail.com fica aberto. LP Anipis quando live: {URL}.

Grato pela atenção.

Breno
```

---

## 3 — Sequence Tier 3 (CFP Cold)

**ICP:** Psicólogas/os com CRP ativo via listas públicas CFP SP-06 / RJ-05 / MG-04, cross-referenced com LinkedIn pra sinal mínimo de digital health (já trabalhou em telehealth, posta sobre TCC online, menciona Conexa/Zenklub em bio).
**Canal:** LinkedIn DM (preferred); email se LinkedIn não disponível.
**Cadence:** 2 touches em 7 dias. Cold puro tem reply rate baixo (5-10%); evitar grind.

### Touch 1 — LinkedIn DM (D+0, 210 palavras)

**A/B Subject Test:**
- Variant A: `Anipis — clinical co-founder estrutural (não advisor)`
- Variant B: `Vaga founder #2 cap table: CRP + digital health BR`

```
Oi {NomePrimeiro},

Direto ao ponto: Anipis (companion AI saúde mental BR, pré-launch) abre cadeira clinical co-founder #2 do cap table. Não advisor, não consultant, não part-time — founder estrutural.

Quem busco:
- CRP ativo SP/RJ/MG
- 2-3+ anos prática clínica + 1-2 anos digital health (Conexa/Zenklub/Vittude/Cíngulo/Psicologia Viva alumni = sinal forte)
- Mestre/PhD Psi Clínica (negociável se digital health track record robusto)
- Bilingue PT-BR/EN
- Quer founder hours, não side-project

Compensação:
- Equity 8-15% common stock, vesting 4y/1y cliff
- R$8-12k/mês founder mode (deferral 6m opcional)
- Decision rights veto clinical surface (prompts, crisis flows, banned phrases, RCT protocol)

Janela: LOI deadline 2026-06-13. 30-day trial pós-LOI com vesting iniciando.

Por que agora: CFM 2.454/2026 + NR-1 punitiva mai/2026 + ANS RN-627/2024 = moat regulatório 18-24m pra quem chegar primeiro com SaMD-grade safety.

Se interesse → responde com CV/LinkedIn + CRP número + 1 parágrafo "por que eu". Filtro 6 perguntas antes da intro call (pra não queimar seu tempo nem o meu).

Se não fit mas conhece alguém → R$2k bounty referral se candidato indicado fechar LOI.

Se não fit nem referral → responde "pass" que arquivo aqui.

Breno
```

### Touch 2 — Follow-up D+5 (LinkedIn DM, 40 palavras)

```
{NomePrimeiro}, último toque rápido. LP Anipis: {URL}. Se não for sua hora, sem stress. Se conhecer alguém que encaixa, bounty R$2k continua de pé. Fechando aqui — sem mais follow-up.

Breno
```

### Touch 3 — Status no tracker (D+7)

Marcar `cold-no-response` ou `cold-pass`. Não retomar. Esse pool é volume, não nurture.

---

## 4 — Personalization Framework (5 datapoints por candidato)

Antes de qualquer outreach sair, capture os 5 datapoints abaixo em 8-12 min de pesquisa por candidato. Sem os 5, mensagem não dispara. Tier 1 e Tier 2 exigem os 5 completos; Tier 3 aceita 3/5 mínimo.

| # | Datapoint | Fonte | Uso na mensagem |
|---|-----------|-------|-----------------|
| 1 | **LinkedIn history** — tempo na empresa anterior, cargo, ano de saída | LinkedIn profile | Hook abertura: "vi seu trajeto na {Empresa} entre {AnoInicio}-{AnoFim}" |
| 2 | **Papers / Outputs públicos** — 1-2 papers acadêmicos (Tier 2), 1 post LinkedIn / podcast / palestra (Tier 1/3) | Google Scholar, Lattes, LinkedIn Posts, Spotify podcasts | Tier 2: cita paper específico no corpo. Tier 1/3: referencia post/fala no follow-up D+3/D+5 |
| 3 | **Current frustrations / signal** — post ou comentário recente onde a pessoa expressou frustração com status quo (digital health superficial, falta de safety, CFM ambíguo) | LinkedIn activity últimos 90d | Hook validador no Tier 1 — "vi seu post sobre {tópico}, ressoa com a tese Anipis" |
| 4 | **Network bridge** — 2nd-degree connection via LinkedIn cruzada com rede AIOS / advisors / contatos USP-UNIFESP | LinkedIn Search + memória contatos prévios | Tier 2: tentar warm intro PRIMEIRO. Tier 1: mencionar mutual se forte ("Vi que conhecemos {Mutual}") |
| 5 | **Timing signal** — defesa de tese, saída recente, sabático, mudança de cargo | LinkedIn updates + Lattes (Tier 2) + Twitter/X opcional | Determina urgência: PhD finishing 2026 = caminho flexível com start Q4; recém-saída de Conexa em Q1/2026 = urgência alta, possivelmente já procurando |

**Não inventar.** Se datapoint não foi achado em 12min, marcar `unknown` no tracker e usar Tier 1 (segment-level) genérico. Mensagem com personalization falsa é pior que mensagem genérica honesta.

---

## 5 — Response Handling Playbook

Replies acontecem em 5 padrões. Ter resposta pronta em 2-4h evita perder window. Todas as respostas abaixo são templates curtos (60-120 palavras), customizar 10% por candidato.

### IF: Positive Interest ("Topo conversar", "Faz sentido", "Manda horário")
**THEN:** Resposta em <2h. Calendly link específico co-founder search (NÃO genérico). 3 slots 30min próximos 5 dias úteis. Subject "Confirmando call Anipis × {NomePrimeiro}". Anexar NDA-light (1 página) se candidato indicou querer dossier antes.

```
{NomePrimeiro}, ótimo. Calendly aqui: {URL} — peguei 3 slots próximos 5 dias. Antes da call, manda 2 datapoints: (a) CRP número (se Tier 1/3) ou link Lattes (se Tier 2), (b) 1 frase sobre o que te faria dizer NÃO já no primeiro filtro — quero que a call seja produtiva pros dois lados.

NDA 1 página em anexo. Assina e mando o dossier 9MB antes da call (assim chega preparado/a).

Breno
```

### IF: Negative Pass ("Não é meu momento", "Pass", "Não tenho interesse")
**THEN:** Resposta em <24h. Curta. Pede 1 referral. Sem pushback. Arquiva.

```
{NomePrimeiro}, entendido — agradeço a sinceridade. Pergunta única antes de fechar: alguém na sua rede que encaixa no perfil (CRP + digital health BR + founder hours)? R$2k bounty se referral fechar LOI. Se não souber também tá ok. Aberto pra retomar daqui 6-12m se timing mudar.

Breno
```

### IF: "Tell me more" sem comprometimento ("Conta mais", "Como funciona")
**THEN:** NÃO mandar dossier 9MB ainda. Mandar 1-pager (200 palavras) com hook econômico (equity + cash + janela) + 3 perguntas filtro. Push pra call.

```
{NomePrimeiro}, mando 1-pager pra economizar seu tempo (em anexo). 3 perguntas antes da call de 30min — me responde quando puder:

(1) Você está full-time bookable nas próximas 4-6 semanas pra processo (intro → deep-dive → technical case)?
(2) Equity 8-15% common + R$8-12k cash faz sentido pra sua situação financeira atual? (Honest gate)
(3) Você tem opinião forte sobre safety em LLM clinical (já viu Wysa, Woebot, Replika)? Sim/não, sem certo/errado.

Se as 3 sinalizam GO, agendamos call essa semana.

Breno
```

### IF: "No time now" / "Vamos retomar em X meses"
**THEN:** Aceita. Marca data no calendar pra retomar. Adiciona ao Q3 nurture (LP launch update + RCT protocol public release).

```
{NomePrimeiro}, sem problema. Marquei aqui pra retomar contigo {Data — 4 semanas depois da data sugerida}. Vou te mandar 1 update curto quando LP Anipis for live ({Mês previsto}). Daí vê se faz sentido ou ignora — sem pressão.

Breno
```

### IF: Radio silence D+7 (Tier 1/3) ou D+14 (Tier 2)
**THEN:** Não escalar canal (não trocar de email pra LinkedIn pra phone — isso é stalker behavior). Status `no-response` no tracker. Adiciona ao Q3 nurture passive list. Movido pra cold storage.

---

## 6 — Pipeline Targets Numéricos

Funil deliberadamente conservador. Reply rate baseline 10% em outbound de saúde mental é honesto; outbound SDR genérico vê 1-3%. Tier 1 alumni tendem a converter 15-20%; Tier 3 cold cai pra 3-5%.

| Métrica | Semana 1 (16-22/Mai) | Semana 2 (23-29/Mai) | Semana 3 (30/Mai-05/Jun) | Semana 4 (06-13/Jun) |
|---------|----------------------|----------------------|--------------------------|----------------------|
| **Outreaches enviadas** | 30-50 (T1: 12-18, T2: 6-10, T3: 12-22) | 20-30 (follow-ups + 2ª onda novos) | 10-15 (apenas T1/T2 promissores) | 5-10 (touch final) |
| **Replies recebidas** | 3-6 (10-12% target) | 4-8 | 3-5 | 2-4 |
| **Positive sentiment replies** | 2-4 | 3-5 | 2-3 | 1-2 |
| **Intro calls 30min agendadas** | **3-5** | 5-8 | 3-5 | 1-2 |
| **Deep-dive 60min** | 0 | **3-5** | 4-6 | 2-3 |
| **Technical case 90min** | 0 | 0 | **2-3** | 1-2 |
| **Reference calls (3 por finalista)** | 0 | 0 | 0-3 | 3-9 (1-3 finalistas × 3 refs) |
| **LOI signed** | 0 | 0 | 0 | **1** |

**Gates KILL signal:**
- Semana 1 < 2 intro calls agendadas → revisar copy (especialmente Tier 1 hook), considerar trocar canal primário pra email.
- Semana 2 < 3 deep-dive → revisar JD (provavelmente equity ou cash) ou ampliar ICP (incluir Pernambuco/Bahia, incluir advisors sêniores ex-CRP).
- Semana 3 < 2 technical case → cogitar extensão deadline pra 30-45 dias (LOI até final de Jun) e cogitar pivot pra senior advisor primeiro + co-founder hire em Q3.
- Semana 4 sem LOI → atual plano falhou. Acionar plano B (Recrutamento via Slow Ventures BR / DNA Capital / Astella; cogitar contratação executive search firm specialized digital health).

---

## 7 — Anti-Spam & Deliverability Ethics

Outbound em saúde mental tem amplificadores éticos extras. Lista abaixo é obrigatória — não é "nice to have".

1. **Domain warmup obrigatório se cold email volume > 20/dia.** Domain anipis.com.br warmup graduado: dia 1 = 5 emails, dia 3 = 15, dia 7 = 30, dia 14 = 50. Bounce rate > 3% pausa imediata. SPF/DKIM/DMARC configurados antes do primeiro send (responsabilidade @devops).
2. **LinkedIn connection limits.** Máximo 20 connection requests/dia por conta. DM cold (sem connection prévia) máximo 30/dia. InMail Recruiter usado SOMENTE pra Tier 2 academic onde email institucional bouncer.
3. **CAN-SPAM + LGPD compliance.** Toda comunicação outbound declara propósito comercial honesto ("estou conduzindo search co-founder pro Anipis"), nome real do sender, email real de contato, e mecanismo de opt-out claro ("responda 'pass' que arquivo"). Sem dark patterns.
4. **Saúde mental tone gate.** Antes de enviar, ler em voz alta. Se soa como SDR vendendo CRM, reescrever. Tom alvo: peer-to-peer entre profissionais que se respeitam, não comprador-vendedor.
5. **Suicide/crisis line removal.** Em NENHUMA mensagem de outbound mencionar ideação suicida, crisis flow detalhes, ou estatísticas brutas de mortalidade jovem como hook emocional. Isso é exploitative e quebra trust antes mesmo da call.
6. **CFP member list usage.** Listas públicas CFP são permitidas pra outreach profissional. Não vender, não compartilhar, não armazenar além do necessário pro processo. Após LOI ou arquivamento, dados são purgados em 90 dias.
7. **NDA upon mutual interest.** Dossier 9MB NÃO sai antes de NDA assinada. Sem exceção. Inclui equity dilution scenarios, RCT protocol draft, e safety classifier internals — sensível.
8. **Sender mailbox rotation.** Se volume cold email > 50/semana, rotacionar 2-3 mailboxes (breno@anipis.com.br, founders@anipis.com.br, breno+search@anipis.com.br) pra distribuir reputation risk. Cap 40-50/mailbox/dia.
9. **Reply latency SLA.** Toda resposta positiva respondida em < 4h (horário comercial BR) ou < 12h (off-hours). Latência > 24h em positive reply mata 30-40% das oportunidades.
10. **Sequence kill switch.** Se reply rate < 4% após 30 sends da mesma sequence, pausar e revisar copy. Não persistir em sequence morta — domain reputation cai.

---

## 8 — Tracker Integration

Os campos abaixo precisam estar no `outreach-tracker.csv` (sibling deste doc). Se faltarem, abrir issue pra @sales-ops-analyst adicionar antes da semana 1 começar.

`candidate_id, tier (1/2/3), name, source (CFP-SP / LinkedIn / Lattes / referral), linkedin_url, email, crp_or_lattes, datapoints_captured (1-5), variant_subject (A/B/C), touch_1_date, touch_1_channel, touch_2_date, touch_3_date, status (sent / replied / pass / intro-scheduled / deep-dive / technical-case / reference-check / loi-signed / archived), reply_sentiment (positive / neutral / negative / no-response), notes`

Status `replied` triggera handoff pra @lead-qualifier (60min deep-dive prep) em < 4h. @crm-manager loga toda atividade. @sales-ops-analyst gera weekly report sexta 18h BRT.

---

## 9 — Handoffs

| Etapa | Handoff de | Handoff pra | SLA |
|-------|------------|-------------|-----|
| Reply positive recebida | @outbound-specialist (Blaze) | @lead-qualifier | <4h |
| Intro call scheduled | @lead-qualifier | @sales-strategist (que conduz call com Breno) | 24h pré-call |
| Deep-dive marcado | @sales-strategist | @sales-closer (Breno conduz; closer prep doc) | 48h pré-call |
| Technical case scheduled | @sales-closer | Breno + clinical advisor #1 (review case answers) | 72h pré-case |
| LOI ready to send | @sales-closer | Breno + lawyer review | 5 dias pré-deadline |

---

## 10 — Resumo executivo

- **3 sequences refinadas** (Tier 1 LinkedIn-first 4 touches / Tier 2 email warm-or-cold 3 touches / Tier 3 LinkedIn cold 2 touches).
- **A/B subject test** ativo na semana 1 (3 variants Tier 1, 2 variants Tier 2/3); promove vencedor semana 2.
- **5 datapoints obrigatórios** por candidato Tier 1/2; 3/5 mínimo Tier 3.
- **Response playbook** com 5 IF/THEN flows + saída graciosa em todos.
- **Pipeline targets:** semana 1 30-50 sent → 3-5 intro; semana 4 1 LOI signed.
- **Anti-spam ethics:** 10 regras obrigatórias incluindo domain warmup, NDA gate, tone audit, e sequence kill switch < 4% reply rate.
- **KILL gates** explícitos por semana — se métrica falha, plano B (extensão deadline ou executive search firm).

Outbound em saúde mental funciona quando trata o destinatário como peer profissional, não como lead pra empilhar. Esse playbook força isso por design — touch count baixo, opt-out explícito, NDA-gate, e sentiment tracking acima de raw reply rate. Métricas de vaidade ficam fora.

---

*Outbound Specialist · Blaze · v1 · 2026-05-16 · `D:/AIOS/docs/projects/anipis/squad-16mai/07-cofounder-search/squad-contributions/outbound-specialist.md` · supersedes outreach-template-{1,2,3}-*.md v0*
