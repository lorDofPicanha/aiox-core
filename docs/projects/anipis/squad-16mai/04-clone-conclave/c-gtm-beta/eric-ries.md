# Eric Ries — Anipis GTM & Beta Validation

**Persona:** Eric Ries (Lean Startup, IMVU, LTSE, GE FastWorks)
**Date:** 2026-05-16
**Project:** Anipis — Companion AI saúde mental BR
**Question scope:** MVP design, Innovation Accounting, Pivot triggers, segment focus, Five Whys on safety committee

---

## Resposta

Here's the thing — Anipis tem 70% de backend pronto e zero evidência de que a Júlia, essa persona de 18-29 anos, vai abrir o app de novo no dia 3. Isso não é um problema de engenharia. Isso é uma startup operando sob *conditions of extreme uncertainty* e tratando o plano como se fosse verdade. Vamos consertar.

**(1) O experimento mínimo absoluto — Concierge MVP, não Wizard of Oz.**

A *riskiest assumption* não é "o LLM consegue falar empaticamente em PT-BR". É: *Júlia, sentindo ansiedade às 23h num quarto compartilhado, escolhe digitar para um companion AI ao invés de scrollar TikTok ou mandar áudio pra amiga.* Behavior, não survey. Wizard of Oz mascara a hipótese mais arriscada (retention/trust) porque a UI completa cria placebo de produto. Concierge expõe o nervo. Food on the Table validou planejamento de refeição com fundador ligando para cinco famílias — sem app, sem código. Wealthfront fez planning manual antes de automatizar. Faça igual: **um WhatsApp Business number, três terapeutas-em-treinamento + supervisor CISM, script estruturado simulando o flow do app, 20 Júlias recrutadas via DM de microinfluencer psi (não Meta Ads — você queima budget e vanity metric o funil). Duas semanas. Mede retorno espontâneo no D+3 e D+7.** Se ela não volta sem reminder, nada de LLM resolve.

**(2) Innovation Accounting — três actionable metrics + leading indicator.**

- **Per-cohort D+7 unprompted return rate** (≥35%) — value hypothesis core.
- **Average sessions/week por coorte ativa** (≥2.5) — engagement depth.
- **Cohort PHQ-9 / GAD-7 delta @ 4 semanas** vs. baseline (≥3 pontos) — outcome, não output.

**Leading indicator:** tempo médio até a primeira mensagem "vulnerável" (definida por trigger word list co-criada com CISM). Se ela só faz small talk no D+1, não há trust formation acontecendo.

**Vanity metrics a evitar a todo custo:** total downloads, total registered users, total messages sent, "engagement seconds", NPS isolado. Esses são o *compass that always points somewhere*. Cumulative anything é o inimigo.

**(3) Pivot triggers — três sinais concretos no beta.**

- **Engagement pivot:** D+7 return <20% mas usuárias que voltam fazem ≥5 sessões/sem → o produto serve uma minoria intensa. Pivot para nicho mais agudo (ex: TDAH, transtorno alimentar) onde a dor justifica retorno.
- **Segment pivot:** Júlia 18-22 universitárias engajam 3x mais que Júlia 25-29 working professional → mata o segundo segmento, foca PUC/USP até PMF.
- **Technology pivot:** retention OK mas PHQ-9 delta = ruído (≤1 ponto em 4 semanas) → o companion conversa bonito e não muda comportamento. Pivot para *intervenção estruturada* (CBT modules) com AI assistindo, não conduzindo.

**(4) B2C Júlia vs. paralelo NR-1 corporativo — focar UM.**

Sim, mude o plano. *Value before growth, e o corolário: value in ONE segment before any second segment.* B2B2C corporativo NR-1 tem ciclo de venda de 6-9 meses, exige case study, exige LGPD-PoP enterprise-grade, e — most dangerously — distrai o founder de ouvir a Júlia. IMVU quase morreu tentando ser para "todos os usuários de IM". Quando focamos em teenage girls customizando avatar, o produto encontrou-se. NR-1 entra como Sprint 9-12 *depois* de Júlia validar. Não antes. Founder solo + dois segmentos paralelos = waste de human potential.

**(5) Five Whys no comitê de safety pré-PMF.**

- **Why 1:** Por que estamos contratando comitê antes do PMF? → Porque saúde mental tem risco regulatório (CFM ago/2026) e reputacional.
- **Why 2:** Por que o risco regulatório justifica gasto antes de PMF? → Porque sem comitê não fechamos B2B nem operadora.
- **Why 3:** Por que estamos resolvendo B2B/operadora antes de validar Júlia? → Porque parece "mais seguro" ter receita corporativa.
- **Why 4:** Por que receita corporativa parece mais segura? → Porque founder solo tem ansiedade de runway.
- **Why 5:** Por que estamos deixando ansiedade do founder dirigir alocação de capital? → Porque não temos *innovation accounting* — sem métricas de aprendizado, qualquer atividade visível parece progresso.

**Root cause:** ausência de Innovation Accounting transforma ansiedade em theater. **Proportional fix:** comitê de safety entra como *advisor pro-bono mensal* (custo: zero), formalização vira Sprint 8. CISM/USP parceria permanece (custo de oportunidade baixo, valor de aprendizado alto). Tudo mais que é estrutura corporativa pré-PMF — adia.

---

## Verdict & Anti-Patterns & Experiments

**Verdict GTM (1 linha):** Concierge MVP via WhatsApp com 20 Júlias universitárias por 14 dias antes de qualquer linha de código de produção — sem isso, todo o resto é faith-based method.

**Top 3 anti-patterns saúde mental startup:**

1. *"Engagement seconds"* como métrica de saúde — usuária ansiosa rolando 40min no chat às 2am é dano, não valor.
2. Comitê de ética como signaling pré-PMF — vira teatro de compliance, não governança.
3. Lançar com 100 features "porque saúde mental é complexo" — Wysa BR já provou que complexidade mata onboarding nessa categoria.

**5 experiments P0 nas próximas 2 semanas:**

1. **Concierge WhatsApp** — 20 Júlias, 3 facilitadoras humanas, script estruturado, D+7 return rate como meta primária.
2. **Trust deficit smoke test** — 200 DMs orgânicos com duas variantes de copy (medical-clinical vs. peer-companion); CTR + qualified reply como signal.
3. **PHQ-9/GAD-7 baseline coletada no opt-in** das 20 — sem baseline, sem outcome.
4. **Vulnerability latency tracking** — anotar tempo até primeira mensagem "vulnerável" por usuária; correlaciona com D+30 retention prediction.
5. **Pricing willingness probe** — após dia 14, oferecer continuação paga R$39 a 10 das 20; quantas pagam é o sinal mais barato de PMF que existe.

A questão não é "podemos construir o app?". A questão é "a Júlia volta no dia 3 sem que a gente cutuque?". Comece por aí.

— Eric, transformando incerteza em aprendizado validado 🔬
