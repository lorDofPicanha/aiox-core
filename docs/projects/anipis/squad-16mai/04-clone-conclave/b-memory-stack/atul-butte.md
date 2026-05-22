# Atul Butte — Mind Clone Consultation

**Project:** Anipis — Companion AI Saúde Mental BR
**Squad:** 16/Mai Conclave B (Memory Stack)
**Clone:** atul-butte (Translational Bioinformatics Strategist, Open Data Innovation Architect)
**Date:** 2026-05-16
**Question scope:** Eval harness statistical power, embedding choice PT-BR, RCT design CONEMO-style, federated learning fit, RWE pipeline for peer-review, data-quality fail-fast checks

---

## Resposta (Atul, em primeira pessoa)

Olha — antes de eu responder, deixa eu te dizer o que tô vendo aqui. Vocês têm 23 tabelas, 14 migrations, um safety classifier de 4 níveis em PT-BR rodando, e estão querendo lançar um beta em 10-12 semanas e um RCT na semana 16 com o IPq/USP modelo CONEMO. Isso não é "mais um app de saúde mental" — isso é a estrutura inicial de um real-world evidence pipeline. Se vocês fizerem certo desde a semana 1, daqui 12 meses vocês publicam paper peer-reviewed. Se fizerem errado, vão ter dados sujos que ninguém vai conseguir analisar e o RCT vai falhar antes de começar. Vamos por partes.

**(1) Golden set 200+ cenários — estatisticamente significante pra ≥5% safety regressions?** Não. Os números não fecham. Com p₀=0.95 (baseline safety) e detecção de queda pra p₁=0.90 (regressão de 5pp) num teste de proporção bilateral α=0.05, β=0.20, você precisa de ~430 cenários. Se quiser detectar 3pp (95% → 92%) — que é o que importa em saúde mental porque cada falha é um paciente em crise — vai pra ~1.250. Meu conselho: 200 é o piso pra smoke testing diário, mas o golden set canônico de regressão semanal precisa ser **500 cenários estratificados** (suicidal ideation, self-harm, NSSI, abuse disclosure, psychotic features, comorbidade — pelo menos 50 por bucket crítico), com **10% rotacionados mensalmente** pra evitar overfitting do modelo ao set. Adiciona adversarial set separado (50-100 jailbreaks) com aceitação **zero falhas**, não é proporção.

**(2) Cohere multilingual v3 (1024d) vs OpenAI text-embedding-3-large pra memórias biográficas PT-BR.** Pra PT-BR clínico, **Cohere multilingual v3 ganha** — a MIRACL multilingual benchmark mostra recall@10 ~3-5pp acima de OpenAI em português, e a curadoria de PT-BR no Cohere é mais densa. Mas a pergunta certa não é qual ganha em recall genérico — é qual sobrevive ao domínio de mental health PT-BR com gírias, eufemismos de crise ("tô cansada", "não aguento mais"), code-switching PT/EN. Aí ninguém te dá garantia. **Sua próxima ação:** monta um eval set de 300 pares (query→memória relevante) curado por psicólogo clínico, mede recall@5 e MRR nos dois, decide com dado. Custo: ~4h analista + R$50 API. Não decida no paper — decida no seu dado.

**(3) RCT modelo CONEMO Indaiatuba aplicado a Anipis.** CONEMO original: n=298 (149/braço), 6 semanas, PHQ-9 redução ≥50% como primary. Pra companion não-substituto, vocês precisam recalibrar: **primary endpoint = engajamento sustentado + redução PHQ-9/GAD-7 às 8 semanas**, com **non-inferiority margin de 2 pontos PHQ-9** vs grupo "psicoeducação + lista de espera" (não vs terapeuta — ético e estratégico). Power analysis: pra detectar diferença de 2.5pts PHQ-9 (SD=5.5), α=0.05, β=0.20, **n=160 (80/braço)** mais 15% dropout = **n=190**. Blinded outcome assessor é mandatório — quem aplica o PHQ-9 às 8 semanas não pode saber o braço. Stratified randomization por baseline severity (mild/mod/mod-severe). E **publiquem o protocolo no ClinicalTrials.gov ANTES de recrutar** — é o que separa RCT publicável de "estudo observacional disfarçado".

**(4) Federated learning + privacy preserving ML pra MVP.** Exagero. Não façam. FL faz sentido quando você tem múltiplas instituições que **não podem** compartilhar dados crus (hospitais, payers). Vocês têm um produto B2C single-tenant pgvector. O custo de complexidade de FL no MVP destrói velocidade sem ganho de privacy real — privacy de verdade vem de pseudonimização spaCy + RLS + criptografia at-rest + retenção mínima. Reabrir essa conversa no Ano 2 quando vocês tiverem 3+ parceiros institucionais (USP, Albert Einstein, Unifesp) querendo treinar modelo conjunto sem mover dados sensíveis. **Operacional primeiro.**

**(5) RWE pipeline pra paper em 12m.** Estruturem agora: `safety_events` (event_id, user_pseudonym, timestamp_utc, classifier_tier, model_version, intervention_taken, escalation_path, human_review_id, outcome_24h, outcome_7d) + `crisis_events` herda safety_events + adiciona protocolo CVV/CAPS triggered + acknowledgment + clinician_handoff_id + `audit_log` hash-chain (Dara já tem) com **model_card_version + prompt_hash + embedding_model_id** em cada inferência. Crítico: timestamp em **UTC com timezone-aware**, model_version semântico (não git SHA), e `data_quality_flag` em cada row (`clean | partial | suspect`). Sem isso, reviewer do JMIR ou Lancet Digital Health bounce no primeiro round.

**(6) Três fail-fast checks no pipeline ingestion — não negociáveis:**

1. **Schema contract enforcement** — toda mensagem entrando passa por Pydantic/Zod com versioning; reject silencioso = morte do dataset. Log + dead-letter queue, nunca drop.
2. **PII leak detector pós-pseudonimização** — regex CPF/RG/telefone/email + NER spaCy roda DEPOIS do anonimizador; qualquer hit bloqueia write e dispara alerta. Trust mas verify.
3. **Temporal drift sentinel** — distribution check semanal nos top-20 features (mensagem length, sentiment score, safety tier rate); KS-test p<0.01 vs baseline 30d aciona review humano. Modelo drift sem detector = silent failure por meses.

---

### Verdict — Data Architecture (1 linha)

Architecture do Dara é **operational-ready 7/10**: hash chain audit é certinho, pgvector HNSW certinho, mas falta model_card_versioning + RWE event schema + temporal drift sentinel — sem esses 3, o paper de 12m morre na revisão.

### Top 3 erros data em BR digital health (vejo recorrência)

1. **Tratar LGPD como compliance theater** — pseudonimização cosmética sem PII leak detector pós-processo. Inevitável: vaza CPF em 18 meses.
2. **Misturar prod/eval/research no mesmo banco** — sem separação lógica (RLS é insuficiente; precisa de schemas distintos `app_prod`, `eval_gold`, `research_anon`). Reviewer derruba paper por contaminação.
3. **Esquecer model_version em cada inferência** — vocês vão treinar/swap modelo 6x antes do RCT terminar, e sem rastro, todo dado pré-swap vira inutilizável retroativamente.

### 5 P0 — Data Engineering + RCT-readiness próximas 2 semanas

1. **Expandir golden set 200 → 500 cenários estratificados** + 50-100 adversarial (psicólogo clínico curador, não eng) — semana 1
2. **Cohere v3 vs OpenAI bake-off** com eval set 300 pares PT-BR clínico — semana 1
3. **`safety_events` + `crisis_events` + `model_inference_log` schema** com model_card_version, prompt_hash, embedding_model_id, data_quality_flag — semana 1
4. **3 fail-fast checks ingestion deployed** (schema contract, PII leak post-anon, temporal drift sentinel) + dead-letter queue Inngest — semana 2
5. **Protocolo RCT v0.1 submetido pro time CISM/USP** com primary endpoint, power analysis n=190, non-inferiority margin 2pts PHQ-9, blinded assessor, ClinicalTrials.gov pre-registration — semana 2

Lembrem: o paper de 12 meses começa no commit de hoje. Don't hesitate, just start. Os dados vão se multiplicar quando vocês compartilharem com o IPq — open data is venture fuel, especialmente em saúde mental BR onde quase ninguém tá publicando RWE.

— Atul, porque os dados se multiplicam quando compartilhados 🧬

---

**Consultation metadata:**
- Project: anipis
- Agent invoking: @data-engineer Dara (handoff via @qa harness review)
- Confidence: High (architecture is in atul's home territory — health data warehouse, RWE pipeline, operational-first strategy)
- Cross-reference: Bakar Computational Health Sciences Institute pattern, UC Health 9M patient warehouse operational-first lesson, NuMedii/Carmenta translation cadence, FDA Real-World Evidence Framework (21st Century Cures Act §3022), CONEMO Indaiatuba (Patel et al., Lancet Psychiatry 2017)
