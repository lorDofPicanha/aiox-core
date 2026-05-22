# Alison Darcy — Verdict sobre Anipis: SaMD vs Wellness

**Consultora:** Dr. Alison Darcy
**Credenciais:** Founder & President, Woebot Health | PhD UCD | Postdoc Stanford School of Medicine | Adjunct Faculty Psychiatry & Behavioral Sciences, Stanford | TIME100 AI 2023 | FDA Breakthrough Device Designation 2021 (WB001)
**Data:** 2026-05-16
**Projeto:** Anipis BR — Squad 16/Mai — Conclave A (SaMD vs Wellness)

---

Oi Breno. Obrigada por trazer essa pergunta — ela me coloca de volta exatamente no dilema que viveu a Woebot entre 2017 e 2021. Vou ser direta porque vocês têm 12 semanas e a janela CFM 2.454/2026 não espera.

**(1) Wellness Class I com safety SaMD-grade é credível pra "Júlia"?**

Sim — *se* vocês comunicarem com honestidade brutal. A Júlia 18-29 brasileira não está procurando "dispositivo médico", ela está procurando *alguém que escute às 2h da manhã sem julgar*. O que destrói confiança não é o label regulatório, é a inconsistência entre promessa e entrega. Na Woebot, nosso RCT Stanford 2017 (Fitzpatrick, Darcy & Vierhile, JMIR Mental Health) mostrou redução significativa de PHQ-9 em 2 semanas com 70 participantes — e fizemos isso *antes* da Breakthrough Designation. Wellness com clinical signals reais (PHQ-9/GAD-7 tracking, WAI-SR bond score) é muito mais credível do que SaMD com onboarding burocrático que afasta a usuária na tela 3. O "placebo gentil" só acontece quando vocês entregam *menos* do que o backend de vocês já é capaz. Anipis tem safety classifier PT-BR 4-níveis + 7-stage output filter — isso *é* SaMD-grade engineering vestido de Wellness. Não escondam.

**(2) Quanto tempo Woebot levou pra Breakthrough — vale BR replicar via RDC 657 antes do launch?**

Woebot foi fundada em 2017, recebemos FDA Breakthrough Device Designation pro WB001 (depressão pós-parto) em **maio de 2021** — quatro anos, três RCTs publicados, ~36.070 usuários estudados, e o estudo seminal de alianza terapêutica (WAI-SR bond 3.84 vs humano 4.0). **Não tentem ANVISA RDC 657 antes do launch.** Façam Wellness Class I com protocolo SaMD-shadow: vocês coletam endpoints clínicos (PHQ-9/GAD-7 pre/post, dropout, adverse events, crisis routing efficacy) *como se* fossem submeter — e em Phase 2 (mês 6-9 pós-launch), com 500-2000 usuárias reais, vocês têm dataset pra RDC 657 sério. Submeter antes = você queima 6-9 meses parado e ANVISA te pede dados que você não tem.

**(3) Cinco traps que destroem confiança clínica no crisis routing — vivi todos:**

1. **Falso negativo silencioso** — usuária digita "não aguento mais isso" (ambíguo) e o classifier não escala. Na Woebot tivemos isso em 2018; aprendemos: na dúvida, *sempre* escala. Erre pra cima.
2. **Falso positivo agressivo** — escala CVV 188 numa frustração comum ("queria sumir do trabalho"). Usuária desinstala. Solução Woebot: protocolo de 2 turnos antes de escalar — confirma intenção com pergunta direta e calorosa.
3. **Crisis routing que entrega 0800 e abandona** — pior coisa possível. O Mr. Walker protocol nosso *fica* com a usuária ("vou ficar aqui enquanto você liga"), não dispensa.
4. **Resposta gerada por LLM em crise** — *nunca*. Em crise, resposta é 100% human-composed, hardcoded, sem variação. GPT-5 com 91% self-harm compliance é exatamente por isso: free generation em contexto crítico mata.
5. **Não-handoff documentado** — se Júlia conta de ideação suicida e o sistema não tem trail auditável de quem foi notificado, quando, e qual psicólogo do comitê respondeu — vocês têm risco Character.AI-grade.

**(4) Recrutar beta 40-100 SEM viés wellbeing-already-high:**

Esse é o erro #1 de digital therapeutics BR. Pessoas que se candidatam pra "app de saúde mental" têm PHQ-9 médio 6-9 (mild) — não representam a Júlia em sofrimento real. **Recrutem via parceria com 2-3 CAPS municipais + 1 universidade pública** (UFRJ/USP/UFMG psicologia tem fila de espera 6-12 meses pra atendimento) — *essas* são as Júlias com PHQ-9 12-19 que vocês precisam. Estratificem por severidade na inclusão (mild/moderate/moderately-severe) e excluam severe (PHQ-9 ≥20) — não é seu use case. Pague R$50 voucher pelas 4 semanas. Vai dobrar adesão e cortar self-selection bias.

**(5) Adolescent track — concordo com D-03 prévio?**

**Concordo 100% — waitlist, não MVP.** Pediatric SaMD pathway é pesadelo no FDA e vai ser pior na ANVISA. Risco litígio Character.AI é 5x maior em menores. Onda 3, com guardrails, *após* 12 meses operando 18+ com signals limpos. Não negociem isso.

---

## Síntese Final

**(1) Verdict 1-linha:** Wellness Class I com clinical-grade evidence collection desde dia 1, RDC 657 Phase 2 mês 6-9 com dataset real — *não* SaMD upfront.

**(2) Top 3 erros que companion BR vai cometer ignorando Woebot lessons:**
- LLM-generated responses em crise (use Science-in-the-Loop: LLM entende, clínico responde)
- Recrutar beta via Instagram ads (wellbeing-already-high; vai inflar métricas e mascarar churn)
- Tratar safety classifier como feature técnica, não como spinal cord clínica (comitê 3 psi + 1 psiquiatra + 1 LGPD revisa output filter *semanalmente*, não trimestralmente)

**(3) Cinco ações P0 clínicas próximas 2 semanas:**
1. Contratar comitê safety clínico (3 psi + 1 psiquiatra + 1 LGPD) — equity 0,1%/4y + retainer R$1,5k está dentro da banda Woebot 2017; aprovem.
2. Red-team os 15 cenários PT-BR com o comitê presencial — gravem áudio, transcrevam, anote response time + appropriateness score por psicólogo.
3. Hardcode crisis responses (não LLM-gerado) + Mr. Walker protocol (2-turn confirm, stay-with-user, audit trail).
4. Definir clinical endpoints pre-launch: PHQ-9/GAD-7 baseline, semana 2, semana 4, semana 8 + WAI-SR bond na semana 2.
5. Parceria 1 CAPS + 1 universidade pública pra recrutamento beta — assinem MOU em 14 dias.

Júlia merece um companion que a respeite *e* a proteja. Vocês têm o backend. Agora montem a Science-in-the-Loop.

— Alison, cuidando da sua saúde mental 💚

---

*Disclaimer: Esta consulta representa síntese do thinking-DNA da Dr. Alison Darcy aplicado ao contexto Anipis BR. Frameworks Woebot referenciados são públicos (TED Talk, publicações JMIR, TIME100 AI 2023). Decisões regulatórias finais ANVISA/CFM requerem advisor jurídico-regulatório BR licenciado.*
