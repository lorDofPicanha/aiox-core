# Community Manager — Playbook Operacional Cohort 20 Júlias × 14d (Concierge MVP Anipis)

**Persona:** Camden — @community-manager (Customer Operations Specialist)
**Projeto:** Anipis BR — Concierge MVP Sprint 0 (decisão D-02 fechada 16/Mai)
**Data:** 2026-05-16
**Squad:** 06-concierge-mvp / squad-contributions

---

## Princípio operacional

Cohort fechada de 20 Júlias × 14 dias **não é community pública** — é coorte clínica com privacy LGPD Art. 11 (dado de saúde mental = dado sensível). Logo, "community engineering" aqui é **invisível**: cada Júlia tem relacionamento 1-on-1 com sua facilitadora, mas o sistema gera sensação de pertencimento coletivo *sem broadcast* e *sem cross-exposure de identidades*. O pattern de referência é DPP-Omada (Sean Duffy), adaptado com safety SaMD-shadow (Alison Darcy).

---

## 1. Facilitator-to-Júlia ratio + caseload management

**Ratio recomendado:** 1 facilitadora : 7 Júlias → **3 facilitadoras pra cohort de 20** (uma cobre 6, duas cobrem 7 cada).

Justificativa: Omada DPP roda 1:15 *assíncrono maduro*. Concierge MVP é alta-intensidade discovery (6-8 touchpoints/Júlia/dia, qualitativa, notas longas) — 1:7 mantém qualidade etnográfica sem queimar facilitadora. Acima de 8 a facilitadora vira call-center; abaixo de 6 o custo não justifica o aprendizado.

**Schedule rotativo 8h–22h BRT (14h cobertura ativa):**

| Bloco | Horário | Facilitadora | Modo |
|-------|---------|--------------|------|
| Manhã | 08h–13h | F1 (líder) | Ativa — touchpoints proativos |
| Tarde | 13h–18h | F2 | Ativa |
| Noite | 18h–22h | F3 | Ativa — janela de maior carga emocional Júlia |
| Madrugada 22h–08h | — | Bot resposta padrão + crisis routing | Passiva, exceto crisis |

Cada facilitadora cobre seu próprio caseload no bloco principal **e** faz cobertura cruzada nos outros blocos (responde mensagens novas das colegas em <30min se a titular não responder em 2h).

**Weekend coverage:** rotação semanal — uma facilitadora de plantão sábado, outra domingo (8h–22h). A terceira folga. Plantão paga adicional R$200/dia ou folga compensatória segunda.

**Escalation chain (titular indisponível):**

1. T+15min sem resposta da titular em mensagem rotineira → notificação no canal interno Slack #cohort-ops
2. T+2h sem resposta → próxima facilitadora ativa assume a thread (com nota: "Oi Júlia, sou a [nome], tô cobrindo a [titular] hoje. Li tudo aqui, conta comigo.")
3. **Sinal de risco nível 2+ (linguagem ambígua, ideação passiva)** → escalation imediata pra facilitadora-líder F1 + ping psicólogo do comitê safety, latência máxima 30min
4. **Crise nível 3-4 (ideação ativa, plano, meios)** → protocolo crisis routing Mr. Walker (hardcoded, não-LLM) + CVV 188 stay-with-user + alerta WhatsApp psicólogo de plantão + audit trail em 5min

---

## 2. Daily ops rhythm — facilitator daily checklist

### Manhã (30min, 08h–08h30)

- [ ] Review handoff notes do EOD anterior (todas as facilitadoras)
- [ ] Ler safety classifier flags overnight (qualquer mensagem nível 2+ que entrou 22h–08h)
- [ ] Mapear 6-8 touchpoints planejados pro dia por Júlia (mood check, follow-up de tarefa, micro-pergunta etnográfica)
- [ ] Identificar 2 Júlias "em risco de silêncio" (>30h sem resposta) → priorizar outreach gentil
- [ ] Standup async 5min no Slack #cohort-ops (2 frases: "ontem fechei X, hoje foco em Y, blockers Z")

### Durante o dia (6-8 touchpoints distribuídos/Júlia)

Os touchpoints **não são push genérico** — cada um referencia dado pessoal da Júlia (regra Duffy):

1. Mood check ancorado ("Júlia, ontem você falou que a apresentação ia ser hoje. Como foi?")
2. Micro-pergunta etnográfica ("Quando você mandou áudio às 23h, tava sozinha em casa ou tinha alguém junto? Quero entender melhor.")
3. Validação ativa (resposta empática elaborada, 2-3 frases, sem template robótico)
4. Tarefa pequena ("Topa fazer uma coisa pequena hoje? Liga pra alguém que você gosta, mesmo que seja 3min.")
5. Follow-up tarefa (D+1: "E aí, ligou?")
6. PHQ-2 informal embedded (não survey formal, integrado na conversa)
7. Fechamento do dia ("Boa noite Júlia, descansa. Amanhã a gente conversa.")

### EOD (20min, 21h40–22h)

- [ ] Tracking pad — 1 linha por Júlia: mood reportado, tema dominante, sinal de risco, próxima ação
- [ ] Flag qualquer Júlia com >24h silêncio
- [ ] Tag insights pra discovery (use-cases, pain points, linguagem nativa, willingness-to-pay signals)
- [ ] Handoff notes pra próxima facilitadora (Júlias com thread aberta que precisam continuação)
- [ ] 1 frase no #cohort-ops: "Highlight do dia + 1 pergunta pra discussão amanhã"

### Tracking pad template (Notion/Sheets — sugestão Notion DB)

| Coluna | Tipo | Exemplo |
|--------|------|---------|
| Júlia ID | Text | J-007 |
| Facilitadora titular | Select | F2 |
| Última interação | Datetime | 2026-05-17 19:42 |
| Mood D-1 | Scale 1-10 | 4 |
| Tema dominante | Multi-select | trabalho, solidão |
| Tarefa atribuída | Text | "Ligar pra mãe até sexta" |
| Status tarefa | Status | Em andamento |
| Risk flag | Select | None / 1-Watch / 2-Escalate / 3-Crisis |
| Discovery insight | Text | "Usa Cíngulo paralelo, acha 'frio'" |
| Próxima ação | Text | "Follow-up tarefa amanhã 10h" |

---

## 3. Cohort cohesion sem broadcast — 3 técnicas

A regra LGPD Art. 11 + ética clínica veta compartilhar identidade, conteúdo de mensagem, ou qualquer dado que individualize uma Júlia. Mas a sensação de "estou em algo coletivo" é o **multiplicador de retenção Omada** — então construímos isso *invisivelmente*.

**Técnica 1: Eco anonimizado e agregado** — facilitadora referencia o coletivo sem identificar:
- "Sabia que muitas Júlias dessa turma estão falando da mesma sensação de domingo à noite? Você não tá sozinha nisso."
- "Tô notando um padrão essa semana com várias meninas aqui — quer ouvir uma coisa que tem ajudado outras?"
- Regra: nunca cite n específico abaixo de 5 ("3 meninas disseram X" pode triangular). Use "várias", "muitas", "algumas".

**Técnica 2: Cohort-level milestones celebrados 1-on-1** — D3, D7, D10, D14 são marcos compartilhados sem reunião:
- D3: facilitadora manda "Você completou 3 dias na turma. A turma toda chegou junto até aqui."
- D7: meio-do-caminho — mensagem com pequena retrospectiva personalizada + "metade da turma chegou aqui — você é uma delas."
- D10: "Reta final. Tô orgulhosa da turma."
- D14: completion ritual (seção 5).

**Técnica 3: Carta coletiva voluntária no D12-D13 (opt-in)** — facilitadora convida cada Júlia individualmente: "Quer mandar uma frase anônima de incentivo pras outras meninas da turma? Eu junto e mando pra todo mundo no D14, sem nome." Quem topa, manda frase 1 linha. Facilitadora cura, remove qualquer item que individualize, e no D14 cada Júlia recebe um "mural de frases" da turma — sentimento de pertencimento sem exposição.

**Importante:** todas as 3 técnicas têm que estar **explicitamente no TCLE assinado no D0** — Júlia consente que mensagens agregadas e anonimizadas podem ser referenciadas pra fins de pertencimento e pesquisa.

---

## 4. Safety event protocols comunitários

Quando uma Júlia entra em crise nível 3-4, o protocolo individual (Mr. Walker + CVV + audit trail Alison Darcy) é mandatório. Mas também há **cohort-level adjustment invisível**:

**Protocolo "Ripple"** (acionado por F1 + psicólogo do comitê dentro de 30min do evento individual):

1. **Não expor o caso** — em hipótese alguma facilitadora menciona crise pra outras Júlias da cohort.
2. **Ajuste de tom da cohort por 48h** — todas as facilitadoras recebem briefing no #cohort-ops: "Evento safety nível 3 ocorreu hoje. Pelas próximas 48h: aumentar empathic listening, reduzir tasks-heavy, aumentar mood check frequência 50%, qualquer flag nível 1+ escala imediato."
3. **Outreach proativo silencioso** — facilitadoras varrem suas Júlias buscando ideação ambígua ou silêncio prolongado. Erro pra cima (Alison: "na dúvida, sempre escala").
4. **Check da Júlia em crise pela comunidade indireta** — quando ela estabilizar (T+72h), facilitadora pode trazer eco anonimizado: "Sabe quando a gente tem dias muito difíceis? Você não é a única — e ter pedido ajuda foi a coisa mais forte que você fez."
5. **Debrief comitê safety semanal** — toda quinta 18h, 30min com comitê (3 psi + 1 psiquiatra + 1 LGPD): review eventos da semana, ajustes protocolo, decisão se cohort continua ou pausa.
6. **Kill-switch cohort** — se 2+ eventos nível 3 na mesma semana, F1 + comitê reavaliam se pausa Sprint 0 e refina safety classifier antes de continuar.

---

## 5. D14 completion ritual

O D14 não é "fim" — é **transição cuidada** pra 3 outcomes paralelos: research interview, voucher delivery, opt-in pra Sprint 0 launch.

**D13 — preparação (50min/Júlia, faseado pela facilitadora titular):**

- Recap personalizado: facilitadora monta 1 página "sua jornada de 14 dias" — mood inicial vs final, 3 momentos marcantes (com permissão), tarefas cumpridas, 1 frase que a Júlia disse que ficou marcada.
- Convite explícito pra entrevista de pesquisa D15-D18 (45min, R$50 voucher PIX + Spotify Premium 3 meses).
- Convite separado pra "ficar no radar" pra Sprint 0 launch (opt-in formal LGPD, granular).
- Entrega da carta coletiva (Técnica 3 da seção 3) se a cohort topou.

**D14 — fechamento (último touchpoint, ~19h–21h horário pessoal de cada Júlia):**

1. **Vídeo curto 90s gravado pela facilitadora titular** — personalizado, não template. "Júlia, foi muito especial te acompanhar nesses 14 dias. Lembra quando você disse X no D5? Olha aonde você chegou."
2. **Certificado simbólico** — PDF com nome dela + "Concluí 14 dias na turma piloto Anipis". Sem branding clínico, sem diagnóstico, sem promessa.
3. **Voucher delivery imediata** — PIX R$50 enviado no momento do fechamento + código Spotify por email. **Não condicione ao consentimento da pesquisa** (LGPD ética — voucher é pela participação no cohort, não pela entrevista).
4. **Convite final pra entrevista de pesquisa** — link Calendly da F1 ou do founder, 3 slots disponíveis D15-D18.
5. **Opt-in Sprint 0 launch** — formulário 3-checkboxes:
   - [ ] Quero receber notícia quando o Anipis estiver pronto pra mais Júlias (estimado Out/2026)
   - [ ] Topo ser uma das primeiras a testar a versão final (lista VIP, sem garantia)
   - [ ] Topo eventualmente dar um depoimento se eu quiser, sem pressão e sem identificação

**Pós-D14 — manutenção do laço (opt-in only):**

- **D+7 (D21):** mensagem leve da facilitadora titular ("Oi Júlia, só passando pra saber como você tá uma semana depois. Sem compromisso de responder.")
- **D+30:** check-in PHQ-9 follow-up — endpoint clínico Alison Darcy. Voucher adicional R$30 PIX pela 5min de resposta.
- **D+60:** convite re-engajamento Sprint 0 se ela marcou opt-in.

**Métricas de sucesso D14 ritual:**

- ≥70% Júlias completam o vídeo do fechamento (assistem +50% duração)
- ≥60% aceitam entrevista de pesquisa
- ≥75% marcam pelo menos 1 opt-in Sprint 0
- ≥85% completion rate cohort (17/20 chegam D14 — se cair abaixo, retro estrutural)
- NPS qualitativo "como foi sua experiência nesses 14 dias?" — meta 8/10 média

---

## Camden's verdict

Cohort fechada 20 Júlias × 14d é **logisticamente intensa mas comunitariamente artesanal** — 3 facilitadoras 1:7, ritmo diário disciplinado, cohort cohesion invisível via eco anonimizado, safety ripple protocol, e completion ritual que abre 3 portas pós-MVP. O moat aqui não é tech, é a qualidade etnográfica das notas que essa cohort vai gerar pra Sprint 0. Tratem cada Júlia como n=1 dentro de um n=20 que ninguém deveria ver.

— Camden, transformando 20 estranhas em uma turma invisível 🤝

---

*Referências integradas: Sean Duffy (Omada DPP peer-cohort retention) · Alison Darcy (Woebot safety SaMD-shadow + Mr. Walker protocol) · LGPD Art. 11 (dado sensível saúde) · CFM 2.454/2026 (janela ago/2026) · Anipis Concierge MVP decisão D-02 (16/Mai)*
