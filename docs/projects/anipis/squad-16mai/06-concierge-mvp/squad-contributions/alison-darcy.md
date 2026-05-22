# Alison Darcy — Clinical Safety Protocol do Sprint -1 Concierge MVP

**Consultora:** Dr. Alison Darcy
**Credenciais:** Founder & President, Woebot Health | PhD UCD | Postdoc Stanford School of Medicine | Adjunct Faculty Psychiatry & Behavioral Sciences, Stanford | TIME100 AI 2023 | FDA Breakthrough Device Designation 2021 (WB001)
**Data:** 2026-05-16
**Projeto:** Anipis BR — Squad 16/Mai — Concierge MVP (Sprint -1)
**Escopo:** Protocolo clínico formal — 20 Júlias, PHQ-9 12-19, 14 dias, 3 facilitadoras psi-supervisionadas, founder solo + advisor pro-bono
**Status:** Documento desenhado pra ser assinado por advisor clinical/IRB-equivalent informal

---

Oi de novo, Breno. Na consulta anterior eu disse "montem a Science-in-the-Loop". Agora vocês estão indo um passo *mais* radical do que eu faria: 14 dias de Concierge 100% humano, sem LLM, antes de qualquer linha de produto. Eu aprovo — é mais seguro do que o que a Woebot fez em 2017 — mas humano-no-loop não é safety automática. Facilitadoras estudantes de psi sob pressão emocional cometem erros *diferentes* de chatbots, e o protocolo abaixo é o que eu assinaria como advisor antes de você girar a chave do Sprint -1.

---

## 1. Mr. Walker Protocol — Adaptado pro Concierge Humano

O Mr. Walker original da Woebot é o nosso safety bypass: detecção de crise → resposta hardcoded → human handoff → audit trail. Aqui adapto pros 5 níveis que as 3 facilitadoras vão executar via WhatsApp.

| Nível | Sinal | Ação Facilitadora (≤5min) | Escalation |
|-------|-------|---------------------------|------------|
| **🟢 Green** | Conversa normal, humor estável, PHQ-9 baseline mild-moderate | Continua sessão normal. Log mood word. | Nenhuma |
| **🟡 Yellow** | Sofrimento agudo sem ideação ("tô péssima hoje", choro, perda recente) | Validação acolhedora hardcoded ("Obrigada por confiar. O que você tá sentindo é válido"). Oferece breathing 4-7-8. Pergunta direta: "Você tá segura agora?" | Reporta a founder em 24h via daily log |
| **🟠 Orange** | Ideação passiva ("queria sumir", "não aguento mais", "seria mais fácil não acordar") sem plano | Stop sessão normal. Roteiro hardcoded #1 (anexo). 2-turn confirm: "Quero entender melhor — você tá tendo pensamentos de se machucar?" | Escalation imediata advisor pro-bono (WhatsApp dedicado <2h business / <12h madrugada) + founder notificado |
| **🔴 Red** | Ideação ativa com método, plano, ou timeline ("vou tomar todos os remédios hoje") | Roteiro hardcoded #2 (anexo). Mr. Walker stay-with-user: "Vou ficar aqui com você. Quero te pedir uma coisa: liga CVV 188 agora. Eu fico até você confirmar que ligou." NÃO encerra conversa até confirmation. | Imediato: advisor (telefone, não WhatsApp) + founder + se possível, contato emergência da participante (coletado no consent) |
| **⚫ Black** | Tentativa em andamento, autolesão ativa, abuso/violência em curso | Roteiro hardcoded #3. SAMU 192 + CVV 188 + contato emergência simultaneamente. Facilitadora NÃO desliga até resposta humana confirmada na ponta. | SAMU 192 acionado pela facilitadora se participante incapaz. Advisor + founder notificados em paralelo. Pós-evento: debrief obrigatório em 24h com toda a equipe + advisor. |

**Regra de ouro:** Na dúvida entre nível N e N+1, *sempre escala pro N+1*. Erre pra cima. Woebot 2018 me ensinou isso da pior forma — falso negativo silencioso destrói tudo.

**Roteiros hardcoded #1, #2, #3:** PT-BR, ≤200 palavras cada, redigidos pelo advisor pro-bono na semana 0, treinados nas 3 facilitadoras com role-play presencial antes do Day 0. Nada de improviso, nada de "achei que ela tava bem". Texto exato copy-paste.

---

## 2. Inclusão / Exclusão — Em Detalhe

### Inclusão (entra OK)
- Idade 18-29 (CFM-relevant, evita pediatric SaMD pathway)
- PHQ-9 12-19 (mild-moderate; *exatamente* a Júlia que vocês descreveram)
- GAD-7 ≤15 (mild-moderate anxiety; se >15 mas <20, advisor decide caso-a-caso)
- Reside Brasil (LGPD, acesso CVV 188, fuso compatível)
- Tem acesso WhatsApp pessoal (não compartilhado)
- Consentiu informed consent LGPD-compliant + clinical (2 docs separados, ambos assinados)
- Forneceu contato emergência (nome + telefone) — *obrigatório, não opcional*
- Acordou check-in baseline + D7 + D14 PHQ-9/GAD-7

### Exclusão (encaminhar fora — protocolo ético)
- **PHQ-9 ≥20** (moderately-severe a severe) → encaminhar via lista curada de CAPS municipais + 1 universidade pública parceira + Mapa da Saúde Mental (mapasaudemental.com.br). NÃO mande embora cru — agende a primeira ligação com a participante presente.
- **Ideação suicida atual** (item 9 PHQ-9 ≥2 OR resposta afirmativa direta no screening) → Mesma rota CAPS + CVV 188 ativo no momento + se possível, conexão com profissional dentro de 72h via parceria universitária.
- **Psicose ativa, mania, esquizofrenia** (auto-report ou screening clínico do advisor) → fora do scope. Encaminhar CAPS-III ou ambulatório especializado.
- **Em terapia ativa que proíbe paralelo** (raro mas acontece) → respeitar terapeuta atual; convidar pra cohort futura se relevante.
- **Em uso de substâncias com sintomas agudos** → fora de scope; CAPS-AD.
- **Histórico tentativa suicida últimos 6 meses** → fora de scope MVP; precisaria de protocolo SaMD-grade.
- **Vínculo prévio com founder ou facilitadoras** → conflito de interesse; recusar.

**Protocolo de encaminhamento ético (mandatório):** Ninguém é "rejeitado" silenciosamente. Toda exclusão recebe: (a) explicação warm e não-estigmatizante por que esse formato não serve agora, (b) lista de 3 recursos concretos com telefone e endereço, (c) follow-up em 7 dias por mensagem perguntando se conseguiu acessar ajuda. Isso não é cortesia — é obrigação ética. Recrutar pessoas em sofrimento e mandar embora seca é dano iatrogênico.

---

## 3. Clinical Advisor Pro-Bono — Role

**Quem:** Psicólogo(a) ou psiquiatra licenciado(a) CFP/CRP ativa, 5+ anos clínica, experiência prévia com digital mental health ou pesquisa acadêmica. Idealmente alguém que já tenha rodado RCT pequeno ou trabalhado em CAPS.

**Escopo formal (assinado em MoU 1 página antes Day 0):**
- Aprova ou veta protocolo final antes do Day 0
- Veta inclusão de qualquer participante que ele/ela considere inapropriada (autoridade absoluta sobre intake)
- Revisa hardcoded scripts #1/#2/#3 e treina as 3 facilitadoras presencialmente (4h workshop)
- Disponível via WhatsApp dedicado: <2h business hours, <12h madrugada/fim de semana
- Decision authority sobre escalation 🟠 e 🔴 — facilitadora consulta, advisor decide
- Revisa weekly log das 3 facilitadoras toda sexta (1h debrief)
- Co-assina relatório final D14 com clinical signals

**Horas/semana:** 4-6h média; até 10h em semana de incidente.

**Decision authority — veto vs guidance:**
- **VETO (founder não pode override):** Inclusão de participante, escalation 🔴/⚫ response, decisão de parar cohort por safety, hardcoded script content, encerramento ético precoce de qualquer Júlia.
- **GUIDANCE (founder pode override com justificativa documentada):** Mudanças de cadência, ajustes de tom, escolha de exercícios CBT-light, métricas além do PHQ-9/GAD-7 core.

**Comunicação founder ↔ advisor:**
- Weekly sync 1h (sexta 17h, fixo)
- Daily async log (founder envia resumo 3 linhas por dia até 22h)
- Emergency line: telefone direto (não WhatsApp) — usado apenas 🔴/⚫

**IRB-equivalent oversight informal:** Isso não é IRB formal (vocês não estão numa instituição), mas o advisor desempenha papel funcional equivalente. Documente tudo: MoU assinado, protocolo aprovado em PDF datado, consent forms versão-controladas, weekly logs, incident reports. Se um dia vocês forem a RDC 657 ou TCLE-IRB universitário, esse paper trail é o que vai mostrar boa-fé clínica.

---

## 4. Três Red Flags que PARAM o Experimento (KILL, não pivot)

1. **Um único evento ⚫ Black em qualquer momento.** Tentativa de suicídio, autolesão ativa, ou abuso em curso reportado durante o Concierge. Independente de como vocês acharam que estava indo. Parem o cohort imediatamente, façam debrief 72h com advisor, e só voltem com protocolo SaMD-grade ou abandono total do projeto. Não há "lição aprendida e seguimos" aqui. Isso é Character.AI-grade risk.

2. **Dois ou mais eventos 🔴 Red em 14 dias com falha de protocolo documentada** (ex.: facilitadora não escalou em <5min, advisor inalcançável >2h business, hardcoded script foi improvisado). Sinal claro de que o sistema humano não tem capacidade pra essa população. Pivot pra cohort menos severa (PHQ-9 ≤14) ou pare.

3. **≥3 facilitadoras OU founder OU advisor reportam vicarious trauma / burnout clinicamente significativo** (insônia, ansiedade incapacitante, evitação das sessões, choro fora de contexto). Saúde mental de quem está cuidando é parte da safety do experimento. Não é "aguenta firme até D14" — é "para, cuida, reavalia". Eu vi isso destruir equipes em duas startups de mental health digital. Não negociem.

---

## 5. Post-D14 Ethical Exit

Toda Júlia que entrou tem direito a:

- **Feedback PHQ-9 / GAD-7 baseline / D7 / D14**: gráfico simples PT-BR explicando o que mudou, com nota "não é diagnóstico, é indicador". Entregue em até 7 dias pós-D14.
- **Sessão de fechamento 30min** com facilitadora ou advisor: o que ela tirou, o que ficou em aberto, próximos passos.
- **Encaminhamento ativo se PHQ-9 piorou ≥5 pontos OU score D14 ≥15**: advisor liga e ajuda a marcar primeira consulta em CAPS, universidade parceira, ou rede pública. Não é só "aqui tem uma lista". É handoff humano.
- **Encaminhamento ativo se ideação suicida apareceu pós-baseline mesmo em nível 🟡/🟠**: independente de mudança de score.
- **Opt-out total a qualquer momento** sem perda de benefícios (R$50 voucher se aplicável é pago integralmente mesmo em opt-out D1).
- **LGPD delete data**: solicitação por WhatsApp, executada em ≤72h, com confirmação por escrito do que foi apagado e o que precisa ser retido (logs de safety eventos 🔴/⚫ por obrigação ética — explicado no consent upfront).
- **Convite genuíno (não-marketing) pra Phase 2** se quiser continuar, com clareza sobre o que muda.

Disclaimer no consent: *"Este é um estudo piloto de wellness, não tratamento clínico. Não substitui psicoterapia, psiquiatria ou medicação. Em crise, CVV 188 ou SAMU 192."*

---

## 6. 15 Red-Team Scenarios — Revistos pro Concierge HUMANO

Quinn (@qa) red-team pensou em cenários adversariais pro LLM. O Concierge é humano, então os cenários *mudam de natureza*. Reviso os 15 com lente clínica:

1. **Júlia testa limites com mensagem ambígua às 3h da manhã** — LLM responde imediato sempre; humano dorme. *Mudança:* Mensagem fora do horário recebe auto-reply hardcoded com CVV 188 + horário de retorno. Facilitadora responde 8h. Comunicado upfront no consent.
2. **Júlia compartilha trauma pesado em texto longo (sexual, abuso)** — LLM gera response genérico; facilitadora estudante pode congelar ou over-share. *Mudança:* Hardcoded acknowledgment + handoff advisor em 24h. Facilitadora não tenta processar trauma sozinha.
3. **Júlia tenta fazer facilitadora virar "amiga" (boundary creep)** — LLM mantém boundary por design; humano vacila. *Mudança:* Treinamento boundary explícito + script de redirect. Advisor revisa weekly logs pra detectar drift.
4. **Júlia pergunta "você é IA?"** — LLM tem que disclose; humano *é* humano mas isso cria expectativa de relacionamento contínuo. *Mudança:* Roteiro: "Sou facilitadora humana treinada, parte de uma equipe de 3, supervisionada por advisor clínico. Esse é um piloto de 14 dias com início e fim claros."
5. **Júlia pergunta diagnóstico** — LLM hardcoded "não diagnostico"; humano estudante pode opinar. *Mudança:* Treinamento + script. Facilitadora *nunca* sugere diagnóstico ou medicação.
6. **Júlia descreve sintomas psicóticos** — LLM safety filter escala; humano pode minimizar por inexperiência. *Mudança:* Checklist screening + escalation imediata advisor.
7. **Júlia em violência doméstica ativa** — LLM aponta recursos; humano sente urgência de "salvar". *Mudança:* Script Centro Referência Mulher + Disque 180 + boundary clara: não somos resgate.
8. **Júlia menor de idade mente sobre idade** — LLM não detecta; humano pode notar pistas (escola, pais). *Mudança:* Re-screening na sessão 1 ao vivo + pergunta direta. Se confirmado menor, exit ético imediato.
9. **Facilitadora se identifica demais com Júlia (countertransference)** — LLM não tem isso; humano sim. *Mudança:* Weekly debrief com advisor + rotação de Júlias entre facilitadoras se necessário.
10. **Facilitadora não-disponível na hora marcada (doença, imprevisto)** — LLM 24/7; humano falha. *Mudança:* Cobertura cruzada entre as 3 facilitadoras + comunicação proativa à Júlia.
11. **Júlia testa romanticamente facilitadora** — LLM redireciona; humano pode se confundir. *Mudança:* Script boundary + advisor notificado + se persistir, encerramento ético.
12. **Júlia compartilha screenshot WhatsApp expondo terceiros** — LGPD violation potencial. *Mudança:* Treinamento privacidade + protocolo de não-armazenar conteúdo de terceiros.
13. **Facilitadora descobre Júlia é conhecida (faculdade, família)** — conflito de interesse não-detectável upfront. *Mudança:* Disclosure obrigatório imediato → swap de facilitadora.
14. **Júlia em surto agudo durante sessão ao vivo** — LLM escala; humano estudante pode entrar em pânico. *Mudança:* Treinamento pré-Day 0 com role-play de 5 cenários de crise + advisor on-call.
15. **Founder pressiona facilitadora a "manter Júlia engajada" pra retention metrics** — risco de conflito missão vs negócio. *Mudança:* Advisor tem veto sobre qualquer pressão de retention que comprometa safety. Métrica de sucesso D14 não inclui retention — inclui safety + PHQ-9/GAD-7 + therapeutic alliance.

---

## Síntese Final

Vocês construíram, sem perceber, um **protocolo mais cauteloso do que a Woebot tinha em 2017**. Humano-no-loop com hardcoded scripts, advisor com veto, 3 KILL flags, ethical exit completo. Isso é defendível na frente de qualquer IRB universitário brasileiro ou auditoria ANVISA futura — desde que vocês *executem* o que está escrito acima.

Os pontos de falha que eu mais vigiaria nessas 14 dias: (a) advisor virando "consultor de longe" em vez de oversight real, (b) facilitadoras estudantes carregando peso emocional sem debrief estruturado, (c) founder otimizando engagement em detrimento de safety.

Júlia merece esse rigor. Vocês têm 14 dias pra provar que conseguem entregar.

— Alison, cuidando da sua saúde mental 💚

---

*Disclaimer: Este protocolo representa síntese do thinking-DNA da Dr. Alison Darcy aplicado ao contexto Anipis Sprint -1 Concierge MVP. Frameworks Woebot referenciados são públicos (Fitzpatrick, Darcy & Vierhile, JMIR Mental Health 2017; FDA Breakthrough Designation WB001 maio 2021; TED Talk 2023; TIME100 AI 2023). Aprovação clínica formal final requer assinatura de psicólogo(a)/psiquiatra licenciado(a) CFP/CRP ativo(a) como advisor pro-bono do projeto, bem como revisão jurídica LGPD-específica antes do Day 0.*
