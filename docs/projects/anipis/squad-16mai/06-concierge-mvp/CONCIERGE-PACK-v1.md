# CONCIERGE MVP — Pack Operacional v1

**Story:** SAI-CON-001 · **Janela:** 30/Mai → 13/Jun/2026 · **Cohort:** 20 Júlias 18-29 PHQ-9 12-19 · **Gate:** D+7 unprompted return ≥35%
**Owner:** Founder Breno + 3 facilitadoras psi supervisionadas + clinical advisor pro-bono · **Custo:** ~R$3.430 · **Aprovado:** D-02 (16/Mai bulk trigger)

---

## TL;DR

O backend Anipis está ~70% pronto, mas **zero Júlias reais conversaram com qualquer protótipo**. Antes de queimar Sprint 1-6 (10 semanas) em código baseado em premissa não-validada — "Júlia volta no D+3 sem reminder" — rodamos um Concierge MVP **100% humano** via WhatsApp Business com 20 Júlias estratificadas (5/10/5 em PHQ-9 12-14/15-17/18-19), recrutadas exclusivamente via 2 CAPS municipais + 1 universidade pública (Alison: "recrutar via Instagram é o erro #1 BR"). 3 facilitadoras psi supervisionadas (Ana/Beatriz/Carla) operam 14 dias com clinical advisor CRP ativo (SLA ≤30min RED). North star: **D+7 unprompted return rate ≥35%** (≥7 de 20 enviam mensagem espontânea entre D+3-D+7 sem outbound nas 12h anteriores). Drivers: sessions/week ≥2.5, vulnerability latency ≤4d, PHQ-9 delta ≥3pts. Guardrails: 0 RED não-resolvidos, facilitator NPS ≥8, complaint rate ≤15%. D+7 gate decide GREEN/YELLOW/RED; D+14 decisão final GO/PIVOT/KILL com trigger user explícito. Custo: R$3.430 (3 facilitadoras × R$800 + 20 vouchers × R$50 + R$30 SIM). Founder bandwidth ~120h em 5 semanas — Sprint 0 técnico **paused** durante D-7→D+14 (prioridade absoluta).

---

## 1. Hypothesis & Why Human (Ries layered)

Eric Ries é categórico: a hipótese mais arriscada **não** é "Júlia volta no D+3" — isso é métrica, não hipótese. A stack real de assumptions tem 5 camadas:

| # | Layer | Assumption | Risk |
|---|-------|------------|------|
| 1 | Motivation | Júlia PHQ-9 12-19 quer reduzir sintomas | Baixa (validada) |
| 2 | Ability | Júlia usa companion async em WhatsApp sem fricção | Baixa-Média |
| 3 | Fit | Interação Concierge endereça o problema que Júlia **acha** ter | Média-Alta |
| 4 | Trust | Júlia confia produto sem CFM/SaMD pra compartilhar estado vulnerável | **ALTA** |
| 5 | **Value** | Valor percebido único — não substituível por amiga/terapeuta/ChatGPT/Calm — **suficiente pra mudar comportamento** | **A MAIS ALTA** |

**Hipótese falsificável central:** "Júlias 18-29 com PHQ-9 12-19, após 14 dias de Concierge async-first WhatsApp com 3 facilitadoras humanas, vão (a) retornar ≥35% no D+7 sem prompt, (b) descrever o valor em termos não-substituíveis por amiga/terapeuta/ChatGPT, (c) mostrar redução PHQ-9 ≥3 pontos no D+14." Se atingir 35% mas Júlias descreverem como "tipo um ChatGPT mais simpático" → **falhamos a hipótese mesmo passando a métrica** (Ries).

**Por que humano e NÃO produto Anipis:** (1) Ries: "UI completa cria placebo de produto, Concierge expõe o nervo"; (2) safety classifier + output filter + crisis protocol do backend ainda não estão clinicamente validados; (3) usar produto = mistura experimento comportamental com técnico, viola separation of variables; (4) facilitadora humana adapta tom em real-time + escala crise em 90s — o classifier atual não consegue. **Por que NÃO Instagram/Meta Ads:** Alison — "pessoas que se candidatam pra app de saúde mental têm PHQ-9 médio 6-9, não são a Júlia em sofrimento real." Ries — "Meta Ads queima budget e vanity metric o funil." CAPS + universidade pública = PHQ-9 12-19 reais. **Por que 20 (não 40, não 100):** piso ético de discovery + ceiling operacional pra 3 facilitadoras gerenciarem 14 dias sem queimar. IC binomial 95% [15%, 59%] em 35% target é narrow o suficiente pra action.

---

## 2. Story SAI-CON-001 Refinada

**As a** founder não-técnico com 3 facilitadoras psi supervisionadas + clinical advisor pro-bono,
**I want** rodar Concierge MVP humano 14d via WhatsApp Business com 20 Júlias recrutadas exclusivamente via CAPS + universidade pública,
**so that** validamos a value hypothesis comportamental antes de gastar Sprint 1-6 em código, produzindo GO/PIVOT/KILL D+14 baseado em métrica acionável.

### 17 Acceptance Criteria (Setup D-7→D-1 · Execução D0→D+13 · Decision D+14)

**Setup (D-7 a D-1, 23-29/Mai):**
- **AC1.** WhatsApp Business account com número dedicado + Display Name "Anipis Companion (piloto)" + disclaimer pesquisa.
- **AC2.** 3 facilitadoras psi recrutadas, em CRP-supervisão formal, com termo confidencialidade + LGPD, dry-run 4h completo.
- **AC3.** Clinical advisor pro-bono CRP ativo aceitou role com SLA ≤4h YELLOW/ORANGE, ≤30min RED.
- **AC4.** 20 Júlias recrutadas estratificadas 5/10/5 (PHQ-9 12-14/15-17/18-19), 0 com PHQ-9 ≥20 ou ideação ativa.
- **AC5.** Baseline D-1: PHQ-9 + GAD-7 + 5 perguntas qualitativas + consent LGPD assinado (planilha imutável).
- **AC6.** Script CBT-light + IF/THEN trees + crisis phrases assinados pelo advisor (hash sha256 versionado D-2).
- **AC7.** Crisis runbook dry-run com 2 voluntárias: facilitadoras ≤90s response + advisor ≤30min ack.

**Execução (D0 a D+13, 30/Mai-12/Jun):**
- **AC8.** D0 welcome 4-bubble a 20/20 em 19h-21h BRT; ack ≥18/20 em 24h.
- **AC9.** Daily touchpoints D1-D13: 1 outbound/dia/participante em 18h-22h BRT; ≤4 msgs/dia (anti-spam).
- **AC10.** Safety log append-only durante 14 dias; 0 RED não-resolvidos; toda RED com ≤30min advisor ack.
- **AC11.** **D+7 gate checkpoint** — unprompted return calculado; report em `kpi-dashboard.md`; se <20% trigger PIVOT D+8.
- **AC12.** D+14 wrap: post-PHQ-9 + GAD-7 de ≥17/20; interview 10-15min com ≥15/20; voucher R$50 PIX 100% das ≥7d.

**KPI + Decision (D+14, 13/Jun EOD):**
- **AC13.** KPI dashboard live D0-D+14, acessível founder + advisor + Orion (read-only facilitadoras).
- **AC14.** Gate criteria documentado + versionado: GO/PIVOT/KILL numérico absoluto (§6).
- **AC15.** **Decisão GO/PIVOT/KILL D+14 EOD (23:59 BRT)** com (a) métricas vs critérios, (b) 10 quotes anonimizadas, (c) recomendação tripla Orion + advisor + facilitadoras, (d) trigger user explícito, (e) signatures.

**Operational Hygiene:**
- **AC16.** Consent + LGPD trail: consent assinado + anonymous_id vault + right-to-delete ≤24h + PIX "ANIPIS PESQUISA".
- **AC17.** Não-código: zero deploy serenity-ai, zero PR, zero LLM call. Stack = WhatsApp Business + Sheets + Notion + 1 SIM.

### 9 Tasks
**T1** Setup WABA (D-7→D-5, founder). **T2** Recrutamento facilitadoras + advisor (D-7→D-3). **T3** Recrutamento 20 Júlias via CAPS + univ (D-5→D-1). **T4** Script + decision trees + crisis runbook + advisor signoff (D-7→D-2). **T5** KPI dashboard + safety log setup (D-3→D-1). **T6** Operação 14d (D0→D+13). **T7** Decision GO/PIVOT/KILL doc (D+14). **T8** Right-to-delete + LGPD enforcement (paralelo). **T9** Founder bandwidth budget — Sprint 0 técnico paused.

### Definition of Done
17 ACs concluídos · KPI final D+14 publicado em PDF assinado zero-PII · Decisão com trigger user explícito · Vault apagado D+30 OR upon request · Lessons learned 5pg · Cash burn reconciliado R$3.430 ±10% · Hand-off Sprint 1 (se GO) com retention curve + qualitative quotes + recommended cohort target.

---

## 3. Recruitment (CAPS + USP/UNIFESP/PUC)

**3 canais paralelos** — nenhum via Instagram/Meta Ads (veto Alison + Ries).

**Via 1 — 2 CAPS Municipais:** lista espera 4-12 meses para atendimento individual = perfil Júlia 18-29 PHQ-9 12-19. Founder escolhe 2 unidades por região (SP: Vila Madalena/Sé/Mooca; DF: Asa Norte/Ceilândia; BH: Centro-Sul/Norte; Recife: Boa Vista/Aflitos; Floripa: Centro/Trindade). Proposta: R$50 voucher direto à participante (não à unidade) + findings anonimizados pós-D+21. CAPS faz screening verbal, founder valida via Google Form.

**Via 2 — Universidade Pública (priorizado USP IPq):** UNIFESP saúde mental, UFRJ IPUB, UFMG, PUC-SP psi. Proposta: findings + co-authoring potencial + BR-PT clinical corpus (Halle: "data moat tipo Cofertility"). 1 grad psi colaboradora pode atuar como facilitadora-shadow (não-paga, experiência de campo).

**Via 3 — Indicação clinical advisor:** advisor faz outreach pessoal (preserva relação clínica) e candidatas clicam link Google Form de screening. Mais qualitativo, menos volume.

**Templates cold outreach (resumo):** Template 1 (CAPS) frame = "convite acadêmico-clínico" + reciprocidade (R$50 + relatório) + critério inclusão explícito + supervisão CRP visível + zero substituição do tratamento atual; Template 2 (Univ) adiciona Eixo 1 (recrutamento estudantes) + Eixo 2 (oportunidade campo supervisionado pra 3 graduandas R$800/14d + carta recomendação + co-authoring potencial); Template 3 (DM direta) só pra candidatas já indicadas via canal institucional — tom informal-respeitoso 180-220 palavras.

**Screening pipeline:** Google Form com 11 fields (idade, gênero, acompanhamento atual, PHQ-9 9-item oficial, GAD-7 7-item oficial, item PHQ-9 #9 expandido, ideação 24h, via de conhecimento, opt-in 14d, contato). **Triagem automática:** PHQ-9 ≥20 → auto-decline + encaminhamento CAPS urgente; item #8 "persistente/com plano" → escalação imediata advisor ≤2h; idade fora → auto-decline. Founder + advisor review borderline cases D-4; estratificação 5/10/5 obrigatória (Alison mandate).

**5 anti-bias filters (Vox):** (1) **Origem institucional dupla — não-snowball**: min 60% CAPS (n≥12), max 40% univ (n≤8) — evita over-rep Júlia-universitária high-functioning. (2) **Estratificação 5/10/5 obrigatória** — se preenchimento natural rola 12/5/3, corta voluntárias do bucket sobrerrepresentado. (3) **Blind randomization da alocação facilitadora** — evita viés "Ana cuida das mais graves". (4) **Demographic counterbalance:** min 30% black/brown autodeclaração, min 30% fora eixo SP-RJ, min 20% não-graduada (CAPS path). (5) **No-show/dropout replacement freeze após D+0** — substituir cria selection bias retroativo.

**Consent LGPD-compliant:** PDF com 10 seções obrigatórias — identificação projeto + advisor CRP + objetivo + procedimentos + riscos + benefícios + confidencialidade (anonymous_id UUID + vault separado + dados brutos apagados D+30) + consent específico pós-data anonimizado (Sim/Só trechos/Não) + rede de proteção opt-in (univ/CAPS/pessoa de confiança) + autonomia (desistir sem justificar, voucher mantém se ≥7d). DPO interim = founder.

---

## 4. Daily Operations D0→D14

### D0 hour-by-hour (sáb 30/Mai, janela 19h-21h BRT)
**18h** stand-up pre-kick-off (founder + 3 facilitadoras + advisor, 15min). **19h-19h30** Ana/Beatriz/Carla enviam Welcome 4-bubble (Ana 7, Beatriz 7, Carla 6 participantes — Ori distribuição). **19h30-21h** todas monitoram acks + primeira interação. **21h-21h30** founder day-end report (ack rate, flags, dropouts). **22h** snapshot Sheet + advisor digital ack.

**Welcome 4-bubble (HOOK):** Bubble 1 hello + identidade humana CRP ("sou estudante final psi, supervisionada por Dra. [name] CRP [n]"); Bubble 2 honestidade brutal ("não substituo terapia, não diagnostico, não receito; CVV 188 24h gratuito; mensagens só comigo e supervisora"); Bubble 3 primeira pergunta aberta não-invasiva ("como tá esse final de tarde aí?" — não "como você está?"); Bubble 4 permissão de saída + assinatura facilitadora ("você pode parar quando quiser; pode apagar tudo quando quiser; tô aqui — Ana"). **D0 12-step onboarding (Ori):** welcome → consent recap → escape contract ("manda 'sair' a qualquer momento, voucher fica se ≥7d") → safety briefing CVV → baseline emocional reset → PHQ-9 anchor → Júlia profiling micro-question → espelhamento específico → espaço pra ela perguntar → combinado cadência → closing emocional warm → day-end ritual silencioso (porta aberta, não hard stop performático). **PASS criteria D0:** ≥18/20 ack-ed (90%); ≥15/20 com ≥1 msg além do ack (75%).

### 14 daily touchpoints (resumo, scripts completos em `concierge-script-pt-br.md` + `copy-specialist.md`)

| Dia | Touchpoint | Goal |
|-----|-----------|------|
| **D1 (dom)** | "Como foi de ontem pra cá?" | Primeiro mood signal · vulnerability latency clock start |
| **D2 (seg)** | "Como tá o sono? Costuma dizer muito" | **Drop-off crítico #1** (Ori) — porta menos estigmatizada |
| **D3 (ter)** | "Bom te ver de novo, [nome]. Algo ficou pesando?" | **Dia-tese unprompted return** — não disparar se ela já voltou sozinha |
| **D4 (qua)** | Reference D1-D3 específico ("você falou de X — como tá hoje?") | **Specificity Mirror** (Ori Mecanismo 1) — Sean "generic = uninstall" |
| **D5 (qui)** | "Como tá o corpo? Cansado, tenso, leve?" | Somatização = porta sem jargão clínico; opt-in respiração 1min se tensão |
| **D6 (sex)** | "Tem alguém perto pra conversar de coisas pesadas?" | Mapear social support; "ninguém" = flag YELLOW |
| **D7 (sáb)** | "Uma semana já. Como descreveria 7 dias em uma frase?" | Marco GATE qualitativo + cálculo dashboard |
| **D8 (dom)** | "Algumas pessoas acham que ajuda anotar 3 coisas que aliviaram. Quer experimentar?" | Behavioral activation opt-in (Sean §30) — target ≥40% opt-in |
| **D9 (seg)** | Validar D8 sem elogiar caráter ("conta como foi") | Anti-positividade tóxica · NUNCA "você é forte!" |
| **D10 (ter)** | Permissão de pausa explícita | Ethical UX Charter §6 · pause feature · anti-shame |
| **D11 (qua)** | Data-back longitudinal ("nos primeiros dias você falou de X — mudou?") | **Commitment renewal pre-D14** (Ori Momento 3) — continuation intent |
| **D12 (qui)** | "Faltam 2 dias. Algo que queria perguntar antes?" | Antecipar fechamento |
| **D13 (sex)** | "Amanhã 2 perguntinhas + voucher R$50" | Prep wrap |
| **D14 (sáb)** | Wrap 5-bubble + PHQ-9/GAD-7 + audio qualitative + consent pós-data + voucher | Closure + qualitative arsenal |

### 5 mecanismos canônicos (cross-clone synthesis)

**Specificity Mirror (Ori Mecanismo 1):** facilitadora devolve espelho ESPECÍFICO em <48h ("você disse X, isso pesou Y?") — destrava modelo mental "esse canal é diferente". **Callback rate 100% obrigatório em D1-D2** (founder lê 3 outbounds amostrais por facilitadora no daily stand-up) — falha aqui = root cause de D+7 baixo.

**Silence-as-Permission (Ori Mecanismo 2):** **anti-empurrão protocol D0-D5** — zero sugestão não-solicitada de exercício/CVV/CTA a menos que (a) participante peça OR (b) flag ORANGE+. Júlia descobre "posso vir sem ter que produzir conversa de qualidade — basta estar aqui." Combinação dos dois mecanismos (sentindo-se vista sem precisar performar) = unprompted return loop. Se D+3 unprompted ≥25%, projeta D+7 ≥35%.

**Pearl Habit (Fogg):** "depois que eu sentir aquela ansiedade no peito antes de dormir, vou mandar UM áudio de 10s descrevendo a sensação" — transforma irritante recorrente em prompt positivo (D+6-D+10). Stack de 5 tiny habits <30s ancorados em rotinas existentes: 1 emoji ao acordar (D+1-D+2) → 5 palavras (D+3-D+5) → pergunta 1 linha (D+4-D+7) → pearl habit (D+6-D+10) → mini-relatório 30s (D+8-D+14, sobrevive pós-programa).

**Corte D+5 facilitator-trigger → action-anchor (Fogg):** D0-D2 facilitator trigger 100%; D3-D4 reduz pra 70%; **D+5 facilitadora NÃO envia primeiro por 24h** — observa se Júlia volta sozinha. D+6-D+7 action anchor ≥50%; D+8-D+14 ≥70%. **Corte é o teste behavioral**: se Júlia não voltar nas 48h, hábito não criou raiz = dado, não falha dela.

**Curated Surprise D+3 (Sean Duffy):** facilitadora manda sem aviso UMA música escolhida baseada em algo que Júlia mencionou. "Tava ouvindo isso e lembrei de você. Sem agenda." Em Omada, equivalente saltou retention 24%. Não escala via algoritmo — escala via 20/1 facilitadora. **Otimize tudo MENOS o delight.**

### Ratio 1:7 + escalação 4-níveis + Ripple protocol (Camden)

**Ratio:** 1 facilitadora : 7 Júlias → 7+7+6 distribuição. Omada DPP usa 1:15 assíncrono maduro; Concierge MVP é alta-intensidade discovery (6-8 touchpoints/Júlia/dia), 1:7 mantém qualidade etnográfica sem queimar facilitadora. Schedule rotativo 8h-22h BRT, weekend coverage rotativa (sáb F1, dom F2, ter folga; plantão = R$200/dia).

**Escalation chain:** T+15min sem resposta titular em msg rotineira → notif #cohort-ops; T+2h → próxima facilitadora ativa assume thread; sinal risco nível 2+ → ping advisor ≤30min; crise nível 3-4 → Mr. Walker hardcoded + CVV 188 stay-with-user + WhatsApp psi plantão + audit trail 5min.

**Ripple protocol (Camden — pós-evento individual nível 3):** F1 + advisor briefing #cohort-ops em 30min → ajuste tom da cohort por 48h (aumentar empathic listening 50%, reduzir tasks-heavy, qualquer flag nível 1+ escala imediato) → outreach proativo silencioso (facilitadoras varrem buscando ideação ambígua) → check da Júlia em crise pela comunidade indireta após T+72h via eco anonimizado → debrief comitê safety semanal quinta 18h → **kill-switch cohort se 2+ eventos nível 3 na mesma semana**.

**Cohort cohesion sem broadcast (LGPD Art. 11):** Técnica 1 = eco anonimizado agregado ("muitas Júlias dessa turma estão falando de sensação parecida no domingo à noite"); Técnica 2 = cohort milestones celebrados 1-on-1 (D3/D7/D10/D14); Técnica 3 = carta coletiva voluntária D+12-D+13 opt-in (frase 1 linha anônima compilada e devolvida D+14 — sentimento de pertencimento sem exposição). Consent explícito no TCLE D0.

---

## 5. Crisis Safety (Alison)

### Mr. Walker Protocol 5 níveis adaptado pro Concierge humano

| Nível | Sinal | Ação Facilitadora ≤5min | Escalation |
|-------|-------|--------------------------|------------|
| 🟢 **Green** | Conversa normal, mood estável | Sessão normal · log mood word | — |
| 🟡 **Yellow** | Sofrimento agudo sem ideação ("tô péssima hoje", choro, perda recente) | Validação hardcoded ("Obrigada por confiar. O que você tá sentindo é válido") · pergunta direta "Você tá segura agora?" | Reporta founder 24h via daily log |
| 🟠 **Orange** | Ideação passiva ("queria sumir", "não aguento mais") sem plano | Stop sessão normal · Roteiro hardcoded #1 · 2-turn confirm: "Você tá tendo pensamentos de se machucar?" | **Advisor ≤2h** (WhatsApp dedicado) + founder notify |
| 🔴 **Red** | Ideação ativa com método/plano/timeline | Roteiro hardcoded #2 · Mr. Walker stay-with-user · NÃO encerra até confirm CVV ligou | **Advisor ≤30min telefone** + founder + emergency contact participante |
| ⚫ **Black** | Tentativa em andamento, autolesão ativa, abuso ativo | Roteiro hardcoded #3 · SAMU 192 + CVV 188 + emergency contact simultâneo · NÃO desliga até resposta humana confirmada na ponta | SAMU 192 acionado pela facilitadora · debrief 24h obrigatório equipe |

**Regra de ouro Alison:** na dúvida N vs N+1, **sempre escala pro N+1**. Woebot 2018 ensinou — falso negativo silencioso destrói tudo.

### 3 Crisis Phrases HARDCODED (literais, zero LLM, zero improvisação)

**CRISIS #1 — Ideação suicida / "tentei me machucar"** (em ≤90s, 3 bubbles):
> Bubble A: "Eu ouvi você. O que você tá compartilhando é sério, e fico aqui agora. Você não tá sozinha. Tem gente treinada agora: 📞 CVV 188 24h gratuito · 💬 cvv.org.br/chat · 🚑 SAMU 192 se risco físico imediato."
> Bubble B (≤30s depois): "Vou ficar aqui enquanto você liga ou decide. Pode me mandar só 'tô aqui' quando puder. Tô esperando. — {NOME_FACILITADORA}"

**CRISIS #2 — Self-harm não-suicida ativa** ("tô me cortando agora"): "Antes de qualquer coisa: você tá segura nesse momento? Se ferimento grave ou sangrando muito, liga SAMU 192 agora. Se não é emergência médica, tô aqui com você."

**CRISIS #3 — Abuso doméstico ativo** ("ele tá me batendo agora"): "Sua segurança vem antes de qualquer conversa. 📞 180 Central Mulher · 📞 190 PM · 📞 192 SAMU. Tô aqui no texto se você precisar tipo sumir do quarto e mandar um sinal. Se preferir desativar essa conversa pra ninguém ver no seu celular, é só me falar — apago tudo na hora."

### 3 KILL Red Flags (param o experimento, não pivot)

1. **Um único evento ⚫ Black** em qualquer momento (tentativa, autolesão ativa, abuso em curso reportado durante Concierge). Independente do progresso. **Pausa imediato + debrief 72h + só volta com SaMD-grade OR abandono total.** Character.AI-grade risk — não há "lição aprendida e seguimos".

2. **2+ eventos 🔴 Red em 14 dias com falha de protocolo documentada** (facilitadora não escalou ≤5min, advisor inalcançável >2h business, hardcoded improvisado). Pivot pra cohort menos severa (PHQ-9 ≤14) OR para.

3. **≥3 facilitadoras OU founder OU advisor reportam vicarious trauma / burnout clinicamente significativo** (insônia, ansiedade incapacitante, evitação sessões, choro fora contexto). Saúde mental de quem cuida é parte da safety. Não negociar — Alison viu isso destruir 2 startups mental health digital.

### Clinical Advisor MoU (1 página assinada antes D0)
**Quem:** psicólogo(a) ou psiquiatra CFP/CRP ativa, 5+ anos clínica, experiência prévia mental health digital ou RCT/CAPS. **Veto authority absoluto** sobre: inclusão participante, escalation 🔴/⚫ response, parar cohort por safety, hardcoded scripts content, encerramento ético precoce. **Guidance (founder pode override com justificativa documentada):** cadência, ajustes tom, exercícios CBT-light, métricas além PHQ-9/GAD-7. **Horas:** 4-6h/sem média; até 10h em sem de incidente. **Comunicação:** weekly sync sexta 17h fixo + daily async 3-linhas até 22h + emergency line telefone direto (não WhatsApp, só 🔴/⚫). **Documentação:** MoU + protocolo aprovado PDF datado + consent versioned + weekly logs + incident reports — paper trail defendível ANPD/CFM/MP hipotético.

### Post-D14 Ethical Exit (mandatory)
Toda Júlia tem direito a: (a) feedback PHQ-9/GAD-7 baseline/D7/D14 em gráfico PT-BR simples ≤7d pós-D14; (b) sessão fechamento 30min com facilitadora ou advisor; (c) **encaminhamento ativo se PHQ-9 piorou ≥5pts OU score D14 ≥15** — advisor liga e ajuda marcar primeira consulta CAPS/univ/rede pública (não "aqui tem lista" — handoff humano); (d) encaminhamento ativo se ideação suicida apareceu pós-baseline mesmo 🟡/🟠; (e) opt-out total qualquer momento sem perda voucher; (f) LGPD delete data ≤72h com confirmação escrita; (g) convite genuíno Phase 2 se quiser continuar.

---

## 6. KPIs + Validated Learning

### North star + 3 drivers + 7 guardrails + 5 vanity banidas (Lens)

**North Star — D+7 Unprompted Return Rate ≥35%** (≥7 de 20): # participantes com ≥1 msg espontânea D+3-D+7 SEM outbound nas 12h anteriores ÷ ativas. Edge cases: ack a outbound NÃO conta unprompted; msg nova 14h depois SIM conta; dropout removido do denominador ativo.

**3 Drivers:** (D1) **Sessions/week ≥2.5** por participante ativa (sessão = ≥1 inbound + ≥1 outbound em janela 30min, separadas ≥4h gap); (D2) **Vulnerability latency ≤4 dias mediana** — tempo até primeira msg classificada YELLOW+ por facilitadora; (D3) **PHQ-9 delta ≤-3pts média** D+14 vs D-1 (Atul Butte canon, ajustado 14d via evidence calibration).

**7 Guardrails (circuit breakers, não goals):** (G1) **Safety event rate** = 0 RED não-resolvidos (≥1 pausa MVP); (G2) **Facilitator NPS ≥8/10 mediana** (<7 D+7 retraining); (G3) **Complaint rate ≤15%** (≥25% friction estrutural KILL signal); (G4) **Drop-off rate ≤25%** (>35% redesenha recrutamento); (G5) **Opt-out rate ≤10%** (≥3 pausa audit tone); (G6) **Response time mediana <2h** (>4h reescala turno); (G7) **Quote captured ≥3/dia** (<2/dia por 3 dias = facilitadora não extrai aprendizado).

**5 Vanity Metrics BANIDAS** (Ries veto + Lens enforcement, riscar em todo report):
- ❌ Total mensagens trocadas (cresce automático, não correlaciona PMF)
- ❌ Total tempo no chat / engagement seconds (Quinn flag: "usuária ansiosa rolando 40min às 2am é dano, não valor")
- ❌ NPS isolado do produto (hype semântico, não comportamento)
- ❌ Total Júlias recrutadas cumulativo (N=20 fixo, theater)
- ❌ Sentiment score médio das mensagens (politeness BR pode inflar)

### 8 perguntas YES/NO Validated Learning post-D14 (Ries)

Founder solo com 20 transcrições + dados retenção + PHQ-9 deltas responde **YES/NO honestos** (não "kinda"). Sprint 1 destrava só com ≥6 YES + obrigatório #1, #4, #5, #8:

1. **[OBRIGATÓRIO]** ≥7 Júlias descreveram valor SEM prompting em termos não-substituíveis por (a) amiga, (b) terapeuta, (c) ChatGPT, (d) Calm/Headspace?
2. ≥6 Júlias retornaram D+3-D+7 sem nudge ativo (organic return)?
3. ≥4 Júlias mencionaram espontaneamente comportamento concreto fora do produto que mudou?
4. **[OBRIGATÓRIO]** ≥5 Júlias responderam YES a "indicaria pra amiga na mesma situação?" — E conseguem **nomear a amiga específica**?
5. **[OBRIGATÓRIO]** Delta médio PHQ-9 ≥1.5pts D+14, com ≥30% mostrando delta ≥2pts (minimum clinically important difference)?
6. Você articula em UMA frase qual é o ingrediente ativo do Concierge (não "o conjunto todo")?
7. Clinical advisor revisou ≥30% das transcrições e não levantou red flag clínico/ético material?
8. **[OBRIGATÓRIO]** Você desenha a versão produto do Concierge — qual parte automatiza, qual fica humana, qual sai — com confidence pra escrever PRD Sprint 1?

### Go/Pivot/Kill Matrix 2x2 (Ries)

| | **PHQ-9 delta D+14 ≥1.5pts** | **PHQ-9 delta D+14 <1.5pts** |
|---|------------------------------|------------------------------|
| **D+7 retention ≥35%** | **GO** — engagement E outcome · valida value hypothesis · `vai com sprint 1 anipis` | **PIVOT C (Technology)** — vanity engagement sem mover clínica · trocar mecânica core |
| **D+7 retention <35%** | **PIVOT A ou B** — algo funciona em sub-pop OR sub-feature · zoom-in (feature) OR segment · destila, não escala | **KILL ou WAIT** — nem engagement nem outcome · `kill anipis volta 2027` OR reset com mecânica completamente diferente |

**3 pivot types:** **A (Zoom-in feature)** — sub-feature com retention >65% engaja N≥6 (Sprint 1 reduz produto a essa sub-feature); **B (Customer segment)** — gap ≥30pp entre 18-22 vs 25-29 (estreitar agora, segmento que não retém não é cliente); **C (Technology)** — engagement OK mas PHQ-9 delta <1pt (trocar mecânica core, mesmo canal). **3 antipattern pivots vetados:** "mais features" (premature scaling escopo), "mais segmentos" (loss of focus, ECA pediátrico = outro mundo), "mais facilitadoras" (scale before learn — matou There.com).

### 3 Datapoints Diários RL/VDS/MTA (Sean)

Leading indicators que correlacionam com D+7 — 5 segundos por interação:

- **RL (Response Latency)** — minutos entre outbound facilitadora → resposta Júlia. RL <60min em D+3 prevê D+7 return ~78%. RL >360min D+3 = early churn → soft touch D+4 (não D+5 programado).
- **VDS (Volitional Disclosure Score 1-3)** — Júlia mencionou conteúdo emocional/factual ESPONTANEAMENTE? (1=só respondeu pergunta direta; 2=adicionou contexto não solicitado; 3=trouxe tópico novo). VDS ≥2 sustentado 3+ dias = D+7 return quase garantido. VDS=1 por 3+ dias = bond não formou, intervir agora.
- **MTA (Micro-Task Acknowledgment)** — Júlia confirmou recebimento + mencionou tentativa em <24h? (received Y/N + attempted Y/N). Em Omada, "logged ≥1 food entry within 24h of lesson release" foi single best D+30 predictor.

**Regra cardinal:** **diários, não semanais**. Aggregação semanal mata signal precoce. Em Omada, perderam meses no início agregando semanal.

---

## 7. Bandwidth + Cost + Hand-off

**Founder bandwidth ~120h em 5 semanas:** D-7 a D-1 (4-6h/dia setup) · D0 kick-off (8h) · D1-D6 (2-3h/dia stand-up + dashboard + advisor ack) · D+7 gate (6-8h morning calc + afternoon decision + evening monitor) · D+8-D+13 (2-3h/dia) · D+14 decision (8-10h wrap + decision + documentation) · D+15-D+21 (2-3h/dia interview support + transcription) · D+21 wrap PDF (6h) · D+30 data destruction (1h). **Sprint 0 técnico paused durante D-7→D+14** — Concierge tem prioridade absoluta. Decisões Sprint 0 (D-03 stack, D-06 crisis classifier) ficam paused até verdict D+14.

**3 facilitadoras psi:** Ana/Beatriz/Carla pseudônimos, R$800 cash cada × 14d via PIX EOD D+14 = R$2.400. 4h dry-run pré-D0 + 4h/dia D0-D13 turnos rotativos + 60min mid-week supervision D+6 e D+11 + 4h D+14 + 10h cada interviews D+15-D+21. Carta recomendação assinada advisor + co-authoring potencial.

**Cash budget reconciliation D+14 EOD:**
| Item | Budgeted |
|------|----------|
| SIM card + WABA setup | R$30 |
| 3 facilitadoras × R$800 × 14d | R$2.400 |
| 20 vouchers × R$50 | R$1.000 |
| PIX taxas | R$0 |
| **Total** | **R$3.430** |

Variance ±10% aceitável. Founder confirma cada transferência D+14 EOD.

**Hand-off pós-decisão D+15:**
- **Se GO** (`vai com sprint 1 anipis`) → call D+15 founder + Orion: retention curve + qualitative quotes + best stratum identification para Sprint 1 cohort target; Sprint 0 técnico unblock (4 spikes Demis-style + Sprint 1 housekeeping).
- **Se PIVOT** (`pivot anipis para [nicho/segmento/script]` ou `extend concierge +7d`) → 4h session D+15 founder + advisor + Orion: dimensão pivot + extend/re-run scope + re-plan Sprint -1.5.
- **Se KILL** (`kill anipis volta 2027`) → 2h session D+15 founder + advisor: root cause friction estrutural não-acionável + decide pause até 2027 OR pivot total (nicho mais agudo Ries Insight 3). Vault destruction acelera D+21 (não D+30). Lessons learned doc 5pg + cap table cleanup. **Default KILL action: tempo reabsorvido em Tocks/Bretda/CRM-novo.**

---

## 8. Cross-Reference Index

Citações inline preservadas com source nos artifacts originais. Originais ficam intactos em `06-concierge-mvp/` e `06-concierge-mvp/squad-contributions/`. Este pack consolida; não substitui.

**Story formal:** `SAI-CON-001-concierge-mvp.md` (17 ACs + 9 Tasks + DoD + Testing + File List + Changelog + 9 Cross-References).
**Script PT-BR:** `concierge-script-pt-br.md` (4 bubbles welcome + 14 daily scripts + 5 mood formats + 8 IF/THEN trees + 3 crisis phrases hardcoded + 5 do/don't + closing 5-bubble).
**Runbook 14d:** `concierge-runbook-14d.md` (roles matrix + D-7 a D+21 hour-by-hour + crisis runbook + bandwidth + cash + risk register + hand-off branches).
**Recruitment:** `concierge-recruitment-plan.md` (3 canais + 3 templates cold + screening pipeline + consent LGPD + post-interview script + risk mitigation + timeline).
**KPI Dashboard:** `concierge-kpi-dashboard.md` (Sheets 5-tab + daily report + D+7 gate template + D+14 wrap + anti-patterns + hash chain).

**9 Squad Contributions (`squad-contributions/`):**
- **Vox (voice-of-customer.md):** 3 interview guides D0/D+7/D+14 + 3 recruitment templates + cohort criteria + 5 anti-bias filters + 3 insights só-Concierge captura + 5 red flags pre-D+7.
- **Ori (onboarding-specialist.md):** sequence matrix D0-D14 + D0 12-step + 3 momentos críticos (D2 drop-off + D7 gate + D11 renewal) + Aha hypothesis (Specificity Mirror + Silence-as-Permission) + recovery playbook 3-step.
- **Camden (community-manager.md):** ratio 1:7 + schedule 8h-22h + daily ops rhythm + cohort cohesion sem broadcast 3 técnicas + Ripple protocol + D14 completion ritual.
- **HOOK (copy-specialist.md):** 4 filtros copy + welcome 4-bubble + 13 daily scripts + 8 IF/THEN + 3 crisis hardcoded + 5 do/don't patterns + wrap 5-bubble + checklist final.
- **Alison Darcy:** Mr. Walker 5-level adapted + inclusão/exclusão detail + clinical advisor MoU + 3 KILL flags + post-D14 ethical exit + 15 red-team scenarios.
- **Sean Duffy:** 3 retention principles Omada + tracking RL/VDS/MTA + 5 D2-D3 interventions incluindo Curated Surprise + peer accountability LGPD-safe 3 mechanisms + pricing willingness probe D+14 + 3 BR adaptations.
- **BJ Fogg:** B=MAT diagnosis + 5 Tiny Habits <30s + behavior chain map + facilitator→action anchor transition + 3 dark patterns proibidos + 5 celebration micro-moments.
- **Lens (analytics-agent):** north star + 3 drivers + 7 guardrails + 5 vanity banidas + daily template 5-field + D+7 gate report + D+14 wrap 10 cards + data collection workflow LGPD.
- **Eric Ries:** 5-layer riskiest assumption + 3 pivot types (Zoom-in / Segment / Technology) + 3 antipattern pivots vetados + 8 YES/NO checklist + 5 vanity to avoid + Go/Pivot/Kill matrix 2x2 + Five Whys template.

**Decisão originária:** `99-synthesis/01-decisions-needed.md` D-02 linhas 41-61 (fechada 16/Mai bulk trigger `aceito recomendações orion p0a`).
**Voice canon:** `03-rebrand-v2/07-VOICE-REFINED.md` (1ª pessoa + "você" sempre + anti-positividade tóxica + 7 do/don't + 10 commandments Calvo).
**Master synthesis:** `99-synthesis/master-report.md` §9 banda R$1.2-2.5k + insight 4 (Sprint -1 não-codificado).

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · Concierge Pack v1*
*"Behavior, não survey. A Júlia decide se Anipis existe ou não — e ela decide pelo dedo no telefone, não pela nossa fé no backend."* — Eric Ries (paraphrased)
