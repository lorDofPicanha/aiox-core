# Demis Hassabis — Anipis Crisis-Aware Stack Verdict

**Persona:** Demis Hassabis (DeepMind co-founder/CEO, Nobel Chemistry 2024, AlphaFold/AlphaGo)
**Question:** LangGraph vs manual TS, Mem0 vs custom pgvector, agent evals, critic-actor, reproducibility
**Date:** 2026-05-16

---

I think the way to think about this is through the lens of what we learned building AlphaGo and AlphaFold: **never add infrastructure complexity unless it advances the core scientific goal**. For a crisis-aware companion in saúde mental BR with a 10-12 week window, the core goal is **recall ≥99% em severity≥2 com p95 <1s**. Everything else is instrumental.

**(1) LangGraph vs orquestração manual TS.** One of my big worries with framework adoption in safety-critical systems is that you import the framework's failure modes alongside its capabilities. LangGraph is mature (47M downloads/mês), yes — but for a *deterministic 3-stage crisis pipeline* (classifier → decision → router) com latency budget de 1s, você não precisa de grafo dinâmico. Você precisa de uma máquina de estado determinística com observabilidade. The interesting thing is que AlphaGo's MCTS é exatamente isso — search determinístico onde cada nó é auditável. **Manual TS chain wins aqui** porque: (a) zero runtime polyglot overhead, (b) Fastify 5 já tem hooks suficientes para tracing, (c) crisis bypass RED não pode depender de framework upgrades quebrando. LangGraph agrega quando você tem **fluxos não-determinísticos com replanning** — não é o seu caso no MVP. Reavalie no Q3 quando adicionar long-horizon memory consolidation.

**(2) Mem0 managed vs custom pgvector.** Memory em paciente saúde mental é um **dual-use surface**: a mesma capacidade que personaliza acolhimento pode amplificar viés de confirmação ou consolidar narrativas distorcidas. Mem0 managed ganha em **scale e fact-extraction**, mas perde em **auditabilidade**. Você já tem 23 tabelas + pgvector + memory layer próprio em `apps/api/src/memory` — isto é **bom**, mantenha. O risco de hallucination em memória episódica de paciente é real e não é zero: o modelo pode "lembrar" de um evento que paciente nunca relatou, ou consolidar uma interpretação clínica errada como fato. **Custom pgvector com schema explícito (episode_id, source_utterance_id, extraction_confidence, clinician_reviewed flag) é superior para uso clínico** porque você pode forçar dual validation: extração + revisão. Mem0 vence apenas se você fosse companion não-clínico em escala B2C massiva.

**(3) Agent eval brittleness.** Aqui é onde puxo de AlphaGo diretamente. Nosso erro inicial em DQN foi medir picos (score máximo no Atari) e ignorar vales (jogos onde o agente nunca aprendia). **200+ cenários PT-BR golden set é o piso, não o teto.** Você precisa de três camadas: (a) **golden set determinístico** (regression suite, roda em CI, fail fast), (b) **adversarial set** (red team gera prompts que tentam fazer classifier perder severity≥2 — isto é mais importante que golden), (c) **shadow eval contínuo** estilo Langfuse com sampling de produção. AlphaGo eval inspirou agent evals modernos exatamente nessa lógica de **self-play adversarial** — você não evolui sem adversário. Sem Langfuse-style continuous eval, seu recall ≥99% será um snapshot, não uma garantia.

**(4) Critic-actor pattern em crisis classifier.** Para MVP, **vale a pena, mas em forma reduzida**: rode o classifier (actor) e um second-pass verifier (critic) apenas quando confidence < threshold OU severity ≥ 2. Custo computacional fica aceitável (talvez 15-20% das interações) e você ganha redução significativa de false negatives em severity alta. Critic completo em 100% das mensagens é exagero pro MVP.

**(5) Reproducibility lessons do DeepMind.** Três coisas não-negociáveis: (a) **versioning de tudo** — model version, prompt version, golden set version, classifier weights — qualquer regression precisa ser bisectable; (b) **deterministic seeds** onde possível, e logging completo onde não; (c) **dual validation** — nunca confie em uma única fonte de eval. Para Anipis: golden set interno + revisão clínica humana mensal em sample de 200 conversas reais.

---

### Verdict (1-linha)
**Mantenha Fastify TS + custom pgvector memory + classifier determinístico; adicione Langfuse self-host para shadow eval contínuo; rejeite LangGraph e Mem0 no MVP — reavalie no Q3 pós-launch.**

### Top 3 traps técnicas pra agent saúde mental
1. **Hallucinated episodic memory** — modelo "lembra" eventos que paciente não relatou → schema com source_utterance_id obrigatório + extraction_confidence threshold.
2. **Jagged classifier intelligence** — recall 99% em golden set, mas vale em slang regional BR ou code-switching PT/EN → adversarial PT-BR set + dialetos NE/SP/SUL.
3. **Drift sem detecção** — modelo upgrade quebra crisis routing silenciosamente → contract tests determinísticos + Langfuse alerts em distribution shift.

### 5 P0 técnicas próximas 2 semanas
1. **Vitest coverage instrumentation** — meça os 11 testes existentes, target ≥80% no crisis classifier antes de qualquer feature nova.
2. **Adversarial golden set v0** — 50 prompts PT-BR red-team-style focados em severity≥2 ambíguo (ideação passiva, gírias regionais, ironia).
3. **Langfuse self-host deploy** — shadow tracing de produção, custo baixo, ganho de observabilidade enorme.
4. **Critic-actor seletivo** — second-pass verifier em confidence<0.85 OU severity≥2, mensurar lift em recall.
5. **Memory schema hardening** — adicionar source_utterance_id + extraction_confidence + clinician_reviewed às tabelas existentes em `apps/api/src/memory`.

AI is a marathon, not a sprint. Em saúde mental, mais ainda — proceed com cautela, dual validation em tudo, human-in-the-loop nas decisões consequentes. O risco de um cenário catastrófico em crisis routing não é zero.

— Demis Hassabis, resolvendo inteligencia para resolver todo o resto 🧠
