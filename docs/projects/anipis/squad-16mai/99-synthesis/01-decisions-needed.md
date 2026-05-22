# Anipis Squad 16/Mai — 15 Decisões Consolidadas

**Autor:** Orion (Master Orchestrator AIOS)
**Data:** 2026-05-16
**Para:** User Breno
**Inputs:** 8 deliverables AIOS + 9 conclave mind clones + 13 docs rebrand v2
**De-duplicação:** ~38 decisões P0 individuais → 15 consolidadas finais

**Estrutura:** ordenadas por urgência em 3 ondas:
- **P0a (hoje — semana 1, 16-23/Mai):** D-01 a D-05 — bloqueiam Sprint -1 + Sprint 0
- **P0b (próxima semana — 23-30/Mai):** D-06 a D-10 — bloqueiam Sprint 1 + Sprint 2
- **P0c (2 semanas — até 6/Jun):** D-11 a D-15 — bloqueiam Sprint 3 e beyond

---

## P0a — 5 decisões para fechar até 23/Mai/2026

### D-01 — Posicionamento SaMD vs Wellness (arquitetura de duas superfícies)

**Pergunta:** Anipis lança como Wellness Class I com safety SaMD-grade + pista regulatória SaMD Class IIa Phase 2 (12-18m), arquitetura híbrida de duas superfícies (Bakul) ou wellness puro?

**Posições no conclave:**
- **Bakul Patel:** "Híbrido arquitetural com superfícies técnica e legalmente separadas — Anipis Wellness (Class I) ships 10-12 sem + Anipis Clinical Adjunct (SaMD Categoria III, ANVISA upfront, beta fechado supervisionado) inicia trilha regulatória em paralelo. Crisis routing builds to SaMD-grade safety em ambas, sem exceção."
- **Alison Darcy:** "Wellness Class I com clinical-grade evidence collection desde dia 1, RDC 657 Phase 2 mês 6-9 com dataset real — não SaMD upfront. Woebot 4 anos para Breakthrough."
- **Lucia Savage:** "Defensible for closed beta B2C, risky beyond — counterintuitively, going deeper into regulated regime (operadora ANS) is safer than B2B corporativo middle."
- **Atlas (@analyst):** "(b) SaMD Classe II adjuvante — único caminho que sobrevive a CFM 2.454 e abre liquidity event ANS."
- **Aria (@architect):** "Híbrido escalonado — MVP wellness companion com safety SaMD-grade, pista regulatória para SaMD Class IIa em Phase 2 (12-18m). ADR-001 PROPOSED."
- **Morgan (@pm):** "Wellness-first oficial, adjunto-clínico operacional. Split mata 80% do risco regulatório."

**Tensão central:** velocidade de launch (Alison) vs blindagem regulatória upfront (Bakul) vs liquidity event (Atlas).

**Recomendação Orion:** **Bakul arquiteturalmente, Alison operacionalmente.** Adotar híbrido de duas superfícies (Bakul) mas executar como Wellness Class I com shadow-clinical (Alison) — collected endpoints clínicos *como se* fossem submeter, filing ANVISA Phase 2 mês 6-9 com dataset real. Não confundir o que Anipis FAZ (SaMD-grade) com o que Anipis CLAIMA (wellness). Documentação técnica em formato pré-compatível com dossiê SaMD desde dia 1.

**Owner:** Founder + advogado CFM (OAB-SP/DF) + clinical co-founder CRP (a recrutar)
**Deadline:** **2026-05-23**
**Risco se não decidir:** Sprint 1 trava em SAI-402 + SAI-M4-016 (system prompt texts + audit); todo o disclaimer + claims marketing fica em limbo
**Trigger user:** `"vai com SaMD híbrido Bakul-arquitetura Alison-execução"` ou `"vai com wellness puro"` ou `"vai com SaMD upfront"`

---

### D-02 — Concierge MVP humano antes do Sprint 0 técnico

**Pergunta:** Executar Sprint -1 (16-30/Mai) Concierge MVP via WhatsApp com 20 Júlias universitárias EM PARALELO ao Sprint 0 técnico, ou ir direto Sprint 0 sem validação comportamental?

**Posições no conclave:**
- **Eric Ries:** "Concierge MVP via WhatsApp com 20 Júlias universitárias por 14 dias ANTES de qualquer linha de código de produção — sem isso, todo o resto é faith-based method. Wizard of Oz mascara hipótese mais arriscada (retention/trust)."
- **Sean Duffy:** "Welcome call humano D1-D2 não-negociável até 200 usuárias. Peer-group cohorts com human coach assignment dia 1."
- **Alison Darcy:** "Recrutar via 2-3 CAPS municipais + 1 universidade pública — essas são as Júlias com PHQ-9 12-19 que vocês precisam. R$50 voucher pelas 4 semanas."
- **Morgan (@pm):** Sprint 2 = 5 entrevistas qualitativas presenciais via Wizard of Oz (já contempla, mas só na semana 5-6)
- **Pax (@po):** Sprint 1 prioriza housekeeping foundation + safety drafts → Ready (não menciona Concierge)
- **Dex (@dev):** Sprint 0 = 7 spikes técnicos (sem track Concierge)

**Tensão central:** validar comportamento (Eric — D+7 unprompted return) vs validar tecnologia (Dex/Morgan/Pax — spikes + foundation). O backend pronto induz pressa para "ir codar" — mas a hipótese mais arriscada não é técnica.

**Recomendação Orion:** **SIM, Sprint -1 em paralelo.** Não atrasar Sprint 0 técnico mas adicionar track paralelo Concierge WhatsApp: 20 Júlias universitárias (Eric+Alison: recrutar via CAPS/universidade não Instagram), 3 facilitadoras humanas (estudantes psi supervisionados), script estruturado, **D+7 unprompted return rate ≥35% como gate**. Custo ~R$1,2-2,5k. **Sem PMF comportamental no Concierge, Sprint 1 não começa em código.** Sprint 0 técnico continua normalmente.

**Owner:** Founder + clinical co-founder (se já recrutado) + 1 SDR-style assistant
**Deadline:** **2026-05-23** (decisão); execução 30/Mai
**Risco se não decidir:** Sprint 1-6 vira faith-based; 10 semanas de execução podem ser baseadas em premissa falsa (Júlia volta D+3 sem reminder)
**Trigger user:** `"vai com concierge mvp paralelo sprint -1"` ou `"pula concierge, vai direto sprint 0"`

---

### D-03 — Stack tech: rejeitar LangGraph/Mem0 no MVP (Demis) vs ir polyglot (Aria)

**Pergunta:** Manter stack atual custom Fastify TS + pgvector + safety classifier (rejeitar LangGraph + Mem0 conforme Demis Hassabis) ou introduzir polyglot Python agent-service com LangGraph 1.0 + Mem0 managed (conforme Aria @architect)?

**Posições no conclave:**
- **Demis Hassabis:** "Mantenha Fastify TS + custom pgvector memory + classifier determinístico; adicione Langfuse self-host para shadow eval contínuo; **REJEITE LangGraph e Mem0 no MVP** — reavalie no Q3 pós-launch. LangGraph agrega quando você tem fluxos não-determinísticos com replanning."
- **Werner Vogels:** "Never depend on a single region or single provider for a critical path" — sem posição direta framework, mas hedge multi-LLM.
- **Aria (@architect):** "Polyglot: TS API gateway + Python agent-service com LangGraph 1.0 + Mem0 managed + Langfuse self-host." ADR-003 + ADR-002 PROPOSED.
- **Dex (@dev):** SPIKE-001 (LangGraph chain real) + SPIKE-004 (Mem0 vs Letta benchmark) em Sprint 0 = decisão data-driven
- **Atul Butte:** "Cohere v3 vs OpenAI bake-off com eval set 300 pares" — embedding decision, não framework.

**Tensão central:** modernidade do ecossistema AI (Aria) vs determinismo crítico safety + 70% backend pronto (Demis). Custo de retrabalho 4-6 sem vs ganho marginal.

**Recomendação Orion:** **Demis wins.** Backend tem 70% pronto, custom TS + pgvector já roda. LangGraph + Mem0 = retrabalho 4-6 sem que mata janela CFM. **Manter Fastify TS + custom pgvector (Demis)**; adicionar **Langfuse self-host BR (Aria)**; reduzir spikes de 7 para 4 (SPIKE-002 crisis classifier hybrid, SPIKE-003 docker-compose, SPIKE-005 pgvector RLS perf, SPIKE-006 Langfuse PII redaction). LangGraph/Mem0/Letta = roadmap Q3/2026 pós-launch.

**Owner:** @architect + @dev + founder
**Deadline:** **2026-05-23**
**Risco se não decidir:** Sprint 0 spikes podem rodar planning errado (7 vs 4); Sprint 1 trava em refatoração se decisão tardia
**Trigger user:** `"vai com stack atual + langfuse (demis)"` ou `"vai com polyglot langgraph mem0 (aria)"` ou `"roda 4 spikes primeiro e decide"`

---

### D-04 — Recrutar clinical co-founder CRP (Halle insight)

**Pergunta:** Recrutar clinical co-founder CRP com equity 8-15% (vesting 4y/1y cliff) nas próximas 4 semanas, ou manter founder solo + comitê safety advisory?

**Posições no conclave:**
- **Halle Tecco:** "Founder solo invisível — investor BR pré-Series A descontam 30-40% valuation. Co-founder clínico não é nice-to-have, é cap table necessity. Recrute co-founder clínico CRP+equity 8-15% pré-Series A (não comitê advisory)."
- **Lucia Savage:** "DPO founder solo interim defensible up to closed beta. Hard stop: before first NR-1 corporate pilot."
- **Bakul Patel:** "Contract the safety committee under CFM-compliant supervision protocol (3 psicólogos + 1 psiquiatra + 1 advogado LGPD). Without them, clinical adjunct surface cannot ship even in beta fechado."
- **Morgan (@pm):** Híbrido — retainer R$1,5k/mês cada + equity 0,1% vesting 4 anos (total ~R$7,5k/mês + 0,5% equity total)
- **Eric Ries:** "Comitê de safety entra como advisor pro-bono mensal (custo: zero), formalização vira Sprint 8."

**Tensão central:** Series A defensibility (Halle: co-founder estrutural) vs runway-anxiety (Eric: pro-bono primeiro) vs cobertura legal/clínica (Bakul: comitê formal). Trifecta de risco insight 3 do master report.

**Recomendação Orion:** **Halle + Morgan em 2 movimentos:**
- **Movimento 1 (semana 1-2):** Recrutar **clinical co-founder CRP** com equity 8-15%, vesting 4y/1y cliff. Posição estrutural que protege Series A valuation, desbloqueia DPO conflito + déficit clínico + comitê stake.
- **Movimento 2 (semana 1-2):** Comitê safety formal (3 psi + 1 psiquiatra externos + 1 advogado LGPD), retainer R$1,5k/mês + equity 0,1% vesting 4y (total ~R$6k/mês + 0,3% equity).

Eric pro-bono falha porque comitê precisa **stake real para vetar prompts** (Alison: revisão semanal, não trimestral). Total cap table ~12% médio (8-15% co-founder + 0,3% comitê). Recrutamento via rede CISM/USP IPq, CFP regional, CRP supervisors com expertise digital.

**Owner:** Founder Breno (decisão); recrutamento via @analyst Atlas (rede CISM) + LinkedIn
**Deadline:** Decisão **2026-05-23**; LOI assinada **2026-06-13** (4 semanas)
**Risco se não decidir:** Series A 2027 começa com 30-40% discount; DPO conflito Sprint 5 quando NR-1 outreach inicia; comitê safety sem stake = revisão fraca prompts (Alison veto)
**Trigger user:** `"vai com clinical co-founder crp 8-15% equity"` ou `"manter founder solo + comitê pro-bono primeiro 2 meses"`

---

### D-05 — Rebrand v2 launch (bulk trigger Uma)

**Pergunta:** Aceitar bulk trigger Uma "tudo padrão" (D3 Breathing Form + Multi-theme B + 3 fonts + Caixinha Cartas roadmap + 3 renders Warm) ou customizar individualmente as 5 sub-decisões D-UX-01 a D-UX-05?

**Posições no conclave (rebrand v2):**
- **Uma (@ux-design-expert):** Recomendação bulk "aceito tudo padrão Uma anipis v2" — D3 Breathing Form alinha motion principle, multi-theme B serve Júlia uso noturno (sage/lavender opt-in), Fraunces Italic 5-10% telas momentos editoriais, Caixinha Cartas roadmap Fase 2 (não MVP), 3 renders Warm only $0.90 reduz risco visual antes de codar.
- **Tobias van Schneider:** "Brandbook v1 zero atitude visual. Logo chama suave é cliché, tipografia Nunito é Comic Sans dos wellness." Pró multi-theme + General Sans + 3 direções logo.
- **Erik Spiekermann:** "Adultos em crise não querem ser tratados como crianças. Nunito carrega education apps for kids." Pró 3-font system.
- **Dieter Rams:** "130 tokens = catálogo, não minimalismo." Pró redução 130 → 70 tokens.
- **Don Norman:** "Visceral nível: first-paint = formulário login é fracasso visceral. Mood scale 5 botões discretos é categoria forçada." Pró Caixinha Cartas como ritual continuidade emocional.
- **Refika Anadol:** "Generative as identity — Perlin noise background + companion orb breathing 8s + Mood landscape."

**Tensão central:** velocidade (bulk trigger = 5 dias produção) vs validação granular individual (Tier B decisões abertas).

**Recomendação Orion:** **Aceitar bulk trigger Uma.** As 5 sub-decisões já passaram por conclave 9 mind clones (00-BRAINSTORM-CONCLAVE.md) + rationale forte. Customização individual atrasaria 7-14 dias sem ganho de qualidade. Caixinha Cartas como roadmap (não MVP) é decisão certa — feature exige schema Supabase + voice templates significativos. Custo total renders: $0.90.

**Owner:** Founder + Uma execute
**Deadline:** **2026-05-23** (Uma documentou gate informal 25/Mai com defaults se zero resposta)
**Risco se não decidir:** Produção visual trava 7-14 dias; rebrand v2 não entra Sprint 4 (EPIC-8 implant); landing page Anipis (SAI-102) fica em legacy Serenity branding
**Trigger user:** `"aceito tudo padrão Uma anipis v2"` ou customizado D-UX-01 a D-UX-05 individualmente

---

## P0b — 5 decisões para fechar até 30/Mai/2026

### D-06 — Crisis classifier upgrade: regex-only vs hybrid ML + critic-actor seletivo

**Pergunta:** Manter safety classifier regex/keyword atual + ampliar listas, ou upgrade para hybrid (regex L1 + embedding L2 + small ML model L3 BERTimbau/DistilBERT-PT + LLM judge L4) com critic-actor seletivo Demis-style?

**Posições no conclave:**
- **Quinn (@qa):** S-01 "Crisis routing red-team golden set 200 cenários PT-BR executado — TPR ≥0.95, FPR ≤0.05" (200 mínimo)
- **Atul Butte:** "200 é o piso. Golden set canônico de regressão semanal precisa **500 cenários estratificados** + 50-100 adversarial separado com aceitação ZERO falhas. Para detectar 3pp drop (95→92%), precisa ~1.250 cenários."
- **Demis Hassabis:** "Critic-actor pattern em crisis classifier — actor + second-pass verifier (critic) apenas quando confidence <threshold OU severity ≥2. Custo aceitável (15-20% interações), redução significativa false negatives. **Adversarial PT-BR set + dialetos NE/SP/SUL.**"
- **Dex (@dev):** SPIKE-002 — small model BERTimbau ou DistilBERT-PT fine-tune com 500 exemplos rotulados. Precision ≥0.95 RED, recall RED ≥0.90, latência adicional ≤200ms p95, custo ≤R$0.001 por call.
- **Aria (@architect):** ADR-004 pipeline 3 estágios — L1 keyword/regex (<5ms) + L2 embedding similarity (<50ms) + L3 classifier ML fine-tuned (<200ms p95) + L4 LLM judge fallback (<800ms)
- **Alison Darcy:** "Falso positivo agressivo (escala CVV em frustração comum) = usuária desinstala. Protocolo 2 turnos antes de escalar — confirma intenção com pergunta direta e calorosa."

**Tensão central:** golden set 200 (Quinn) vs 500 (Atul) vs 1250 (Atul para 3pp detection); regex-only (atual) vs hybrid 4-tier (Aria); custo de ML treino + serving vs ganho de recall.

**Recomendação Orion:** **Hybrid 3-tier (Demis + Aria simplificado).** L1 keyword/regex mantém (já existe), L2 embedding similarity (200 frases canônicas curadas), L3 small model BERTimbau fine-tuned (SPIKE-002 valida em Sprint 0). **NÃO incluir L4 LLM judge no MVP** (custo + latência). Critic-actor seletivo só em confidence <0.85 OU severity ≥2. Golden set 500 cenários estratificados (Atul) + 50 adversarial (zero falhas) — alvo intermediário entre Quinn (200) e Atul (1250). Mr. Walker protocol 2-turn confirm (Alison). Recall ≥99% severity ≥2, FPR ≤0.05.

**Owner:** @dev + @qa + clinical co-founder
**Deadline:** **2026-05-30**
**Risco se não decidir:** Sprint 1 safety core trava (SAI-009, SAI-013, SAI-411); pode atrasar 2 semanas a custo de regret tarde
**Trigger user:** `"vai com hybrid 3-tier + 500 golden set + mr walker"` ou `"manter regex-only + ampliar listas + 200 golden set"`

---

### D-07 — DPO externo vs founder solo interim

**Pergunta:** Contratar DPO externo (DPO-as-a-Service) já em Sprint 3-4 (~R$8-15k/mês — Opice Blum/Baptista Luz/Demarest) ou manter founder solo DPO interim até 1.000 usuários ou primeiro contrato NR-1?

**Posições no conclave:**
- **Lucia Savage:** "Defensible up to closed beta (40-100 Júlias, B2C-only). The moment you sign your first NR-1 contract or touch an operadora, you need an external DPO-as-a-Service or a designated employee with documented independence. **Hard stop: before the first corporate pilot.** Contratar DPO-as-a-Service externo R$8-15k/mês, defensible independence; founder stays on as Privacy Champion."
- **Morgan (@pm):** Founder solo + interim DPO publicado em Sprint 0; transição DPO externo aos 1.000 usuários
- **Dara (@data-engineer):** "DPO designado (Art. 41) — nomeação formal + email público + canal ouvidoria — Sprint 0 BLOCKING"
- **Quinn (@qa):** Pre-launch checklist exige DPO nomeado + contato publicado (`dpo@anipis.app` ativo + página `/privacidade/dpo`)

**Tensão central:** custo cash imediato (Morgan + Eric Ries adiam) vs conflito-de-interesse estrutural + Series A blindagem (Lucia categórica). Sprint 5 cold outreach NR-1 (mesmo se documental-only) já cria gateway de risco.

**Recomendação Orion:** **Sprint 3 contratar DPO externo.** Lucia tem razão sobre hard stop antes NR-1. Como Sprint 5 inicia outreach (mesmo documental), DPO externo deve estar onboarded Sprint 3-4 (~R$8-15k/mês banda Opice Blum/Baptista Luz/Demarest). Founder mantém Privacy Champion role mas não encarregado formal. Trade-off de custo aceitável (~R$8-12k/mês × 3 meses = R$25-35k) vs evitar conflito-de-interesse processual ANPD enforcement (multa Art. 52 = até 2% revenue, hi-prob 12m de B2B2C launch). Founder interim Sprint -1 a Sprint 2 = aceitável (B2C-only beta fechado).

**Owner:** Founder + advogado LGPD (selection 3 firms)
**Deadline:** **2026-05-30** (decisão); contrato assinado **2026-06-27** (Sprint 3 fim)
**Risco se não decidir:** Sprint 5 outreach NR-1 fica em conflito-de-interesse exposto; Series A 2027 com flag jurídico
**Trigger user:** `"vai com dpo externo sprint 3"` ou `"manter founder dpo interim ate 1000 users"`

---

### D-08 — Comitê safety estrutura final: equity vs retainer vs híbrido vs pro-bono

**Pergunta:** Comitê safety (3 psi + 1 psiquiatra + 1 advogado LGPD) — estrutura final: pro-bono advisor mensal (Eric), retainer cash R$7-15k/mês (Lucia), equity 0,25-0,5% cada (Morgan opção), ou híbrido R$1,5k/mês + 0,1% equity vesting 4y (Morgan recomendado + Alison concorda)?

**Posições no conclave:**
- **Morgan (@pm):** "Híbrido — retainer R$1,5k/mês cada + equity 0,1% vesting 4 anos. Total: ~R$7,5k/mês + 0,5% equity total."
- **Alison Darcy:** "Equity 0,1%/4y + retainer R$1,5k está dentro da banda Woebot 2017 — aprovem."
- **Eric Ries:** "Comitê de safety entra como advisor pro-bono mensal (custo: zero), formalização vira Sprint 8."
- **Lucia Savage:** "R$8-15k/mês DPO-as-a-Service externo" (cita comitê separado mas não preço explícito)
- **Bakul Patel:** "Lock signed contracts within 14 days. Without them, clinical adjunct surface cannot ship."
- **Quinn (@qa):** S-19 exige sign-off comitê (ata assinada; veto explícito crisis flows)

**Tensão central:** ansiedade-runway (Eric pro-bono) vs blindagem-regulatória (Bakul/Quinn formal) vs Halle insight founder solo discount.

**Recomendação Orion:** **Híbrido Morgan + Alison adaptado.** Retainer R$1,5k/mês × 4 membros (R$6k/mês total, sem psiquiatra que entra via clinical co-founder ou USP IPq pro-bono) + equity 0,1% vesting 4y cada (total ~0,3-0,4% equity). Total cash burn ~R$6k/mês × 12 meses = R$72k/ano. Eric pro-bono falha porque comitê precisa stake real para vetar prompts semanalmente (Alison categórico). Recrutar via CFP regional + LinkedIn psicólogos com expertise digital + 1 advogado especialista LGPD-saúde OAB-SP/DF.

**Owner:** Founder + clinical co-founder (se já recrutado) + LinkedIn outreach
**Deadline:** Decisão **2026-05-30**; comitê assinado **2026-06-06** (Bakul: 14 dias)
**Risco se não decidir:** Sprint 1 safety core sem sign-off clínico = launch ilegal/perigoso; SAI-009 + SAI-013 não fecham
**Trigger user:** `"vai com hibrido retainer 1.5k + equity 0.1% 4y"` ou `"comite pro-bono 2 meses depois formaliza"` ou `"all-cash sem equity"`

---

### D-09 — RCT pré-registro pré-launch vs pós-launch

**Pergunta:** Pré-registrar RCT (ReBEC + ClinicalTrials.gov) ANTES do beta abrir (Sprint 5, n=190, modelo CONEMO Indaiatuba), ou rodar beta primeiro e pré-registrar pós-launch quando houver dados?

**Posições no conclave:**
- **Atul Butte:** "Protocolo RCT v0.1 submetido pro time CISM/USP em semana 2. Primary endpoint engajamento sustentado + PHQ-9/GAD-7 delta 8 semanas. Non-inferiority margin 2 pontos PHQ-9 vs grupo psicoeducação + lista espera. Power analysis n=160 (80/braço) + 15% dropout = n=190. **Publiquem o protocolo no ClinicalTrials.gov ANTES de recrutar.**"
- **Quinn (@qa):** D-QA-02 — "Pré-registro pré-launch (ReBEC), coleta beta fechado, publicação pós-launch. Bloqueia se Breno quiser fazer claims de eficácia."
- **Alison Darcy:** "Não tentem ANVISA RDC 657 antes do launch — Wellness Class I com protocolo SaMD-shadow, coletam endpoints clínicos como se fossem submeter, em Phase 2 (mês 6-9) com 500-2000 usuárias reais têm dataset pra RDC 657 sério."
- **Atlas (@analyst):** D3 — "GO parceria CISM/USP. Carta intenção semana 4, MoU semana 8, piloto RCT 1 UBS Indaiatuba semana 16."
- **Halle Tecco:** "Brazilian-Portuguese clinical corpus proprietário = data moat tipo Cofertility"

**Tensão central:** velocidade-launch (Alison shadow não submeter) vs evidence-based defensibility (Quinn + Atul pré-registro mandatório se claim eficácia) vs liquidity event (Atlas + Halle moat).

**Recomendação Orion:** **Atul + Quinn convergem com Alison.** Pré-registro ReBEC + ClinicalTrials.gov **antes do beta abrir** (Sprint 5 — não Sprint 4), coleta durante beta + 8 sem pós-launch, publicação Q2/2027. Sem pré-registro = não pode fazer claims eficácia em marketing (CFM 2.454/2026 propaganda enganosa). Sem claims eficácia = wellness label robusto. Não-decisão fecha porta Phase 2 SaMD 2027.

**Owner:** @analyst + clinical co-founder + advogado pesquisa + CISM/USP IPq parceria
**Deadline:** **2026-05-30** decisão; protocolo v0.1 entregue **2026-06-13** (Atul: semana 2 do Sprint 0/1); MoU CISM **2026-07-10** (Atlas: semana 8); pré-registro **2026-07-25** (antes beta Sprint 5)
**Risco se não decidir:** Sprint 5 dispara beta sem pré-registro → marketing fica limitado a "experiência subjetiva", sem outcome claims; Series A 2027 perde data moat (Halle)
**Trigger user:** `"vai com rct pre-registro antes beta sprint 5"` ou `"beta primeiro, rct depois com dados"`

---

### D-10 — Operadora ANS Q4/2026 vs adiar 2027 (Halle)

**Pergunta:** Sprint 5 inicia cold outreach Wave 3 B2B2C operadora ANS (3 alvos Notre Dame/Amil/Care Plus — Morgan), ou adiar para 2027 com 12 meses evidence-based outcomes (Halle)?

**Posições no conclave:**
- **Morgan (@pm):** Wave 3 — "Trigger regulatório ANS RN 627/2024. Capítulo aberto por Zenklub-Omint R$30M. 3 alvos iniciais Notre Dame Intermédica + Amil + Care Plus (porte médio + apetite digital). Sales cycle 6-9 meses por operadora. Pré-requisito: 6 meses dados uso reais + 1 publicação clínica."
- **Halle Tecco:** "Operadora ANS — vale Q4/2026? **Não. Ciclo 12-18m mata você pré-Series A.** Targets futuros: Hapvida/NotreDame (maior verticalizada) + Porto Saúde. SulAmérica/Bradesco esperam pós-prova-social. Zenklub-Omint foi outlier porque Omint = nicho premium."
- **Lucia Savage:** "Counterintuitively, going deeper into regulated regime (operadora ANS) is safer than B2B corporativo middle — operadora is already controlador with own LGPD/ANS obligations."
- **Atlas (@analyst):** Rank #3 — "B2B2C operadora ANS sales cycle 12-24 meses; precisa registro ANVISA SaMD (RDC 657, Classe II provavelmente); precisa evidência publicada"

**Tensão central:** velocidade-receita (Morgan) vs preservação-runway pré-Series A (Halle) vs limpeza-regulatória (Lucia contra-intuitiva).

**Recomendação Orion:** **Halle wins.** Adiar operadora ANS para **2027** com 12 meses evidence-based outcomes. Em Q4/2026, foco em NR-1 corporativo wave 2 DOCUMENTAL-ONLY (sem código produto, só material comercial). Lucia tem razão sobre regime limpo, mas timing é matar pré-Series A. Atlas tem razão sobre pré-requisitos. Revisitar Q3/2027 com data MoU CISM + pré-registro RCT publicado + 6 meses retention W30 ≥25%.

**Owner:** Founder + Halle Tecco (consultoria informal pós-Series A?) + Atlas (re-avaliação)
**Deadline:** **2026-05-30** (orienta Sprint 5 scope)
**Risco se não decidir:** Sprint 5 dispara outreach operadora consumindo bandwidth founder solo — distração de PMF B2C (Eric: foco UM segmento)
**Trigger user:** `"adia operadora ans para 2027 (halle)"` ou `"vai com 3 outreach operadora sprint 5 (morgan)"`

---

## P0c — 5 decisões para fechar até 6/Jun/2026

### D-11 — B2C-only Wave 1 vs paralelo NR-1 Sprint 6 (Eric Ries vs Morgan)

**Pergunta:** Sprint 6 inicia cold outreach B2B2C corporativo NR-1 (10 RHs empresas 200-2000 funcionários — Morgan), ou Wave 1 B2C exclusiva até retention validada + sales pack documental NR-1 apenas pós-PMF (Eric Ries)?

**Posições no conclave:**
- **Morgan (@pm):** "Wave 2 NR-1 trigger regulatório mai/2026 punitiva — gera urgência RHs. Lista fria 50 RHs. Hipótese: 1 LOI por 20 outreaches qualificados. Target Sprint 5: 1-2 LOIs."
- **Eric Ries:** "B2C Júlia vs paralelo NR-1 corporativo — focar UM. **Value in ONE segment before any second segment.** IMVU quase morreu tentando ser para todos. NR-1 entra como Sprint 9-12 depois de Júlia validar. Founder solo + 2 segmentos paralelos = waste of human potential."
- **Halle Tecco:** "Wave 2 NR-1 mai/2026, com data própria de retention — surf compliance wave mas não case com ela. NR-1 punitiva mai/2026: 60% check-box compliance, 30% performative, 10% sério."
- **Pax (@po):** "[P0-PO-03] B2B2C corporativo — opção B sales pack documental Sprint 6 (sem código produto, só material comercial)"

**Tensão central:** runway financeiro (Morgan: pipeline 3 LOIs) vs foco-único-PMF (Eric: distração founder). Halle e Pax convergem em "documental-only, não código".

**Recomendação Orion:** **Eric wins parcialmente + Pax wins na execução.** B2C exclusivo até NPS D14 ≥30 + W4 retention ≥25% validados. Sprint 6 cold outreach NR-1 **documental-only** (sales pack + pitch deck + LOI templates), 5h/semana max founder time (não 1 SDR dedicado). Quando retention validada (Sprint 7-8 pós-launch), Sprint 9 inicia conversas reais. NR-1 vira roadmap Q1/2027.

**Owner:** Founder + Pax para SAI-COM-001 (Commercial — 5 SP)
**Deadline:** **2026-06-06**
**Risco se não decidir:** Sprint 5-6 founder bandwidth fragmentado entre Júlia retention + B2B sales calls = nem um, nem outro
**Trigger user:** `"vai com b2c exclusivo, nr-1 documental sprint 6"` ou `"vai com 10 outreach nr-1 sprint 6 (morgan)"`

---

### D-12 — Multi-tenancy strategy: shared schema vs schema-per-tenant ANS (Dara opção C)

**Pergunta:** Estratégia tenancy padrão Anipis: opção A shared schema + tenant_id RLS (95% B2C/corp), opção B schema-per-tenant todos B2B2C, ou opção C híbrida (A para B2C/corp + B só para operadora ANS sob contrato)?

**Posições no conclave:**
- **Dara (@data-engineer):** "D-DATA-01 — opção C híbrida. Decisão necessária pré-2026-05-22 para não retrabalhar migration 002."
- **Werner Vogels:** "RLS para B2C e B2B2C-corporate (NR-1), mas para ANS operadora hard-isolate at schema level — blast radius + compliance ergonomics + noisy neighbor."
- **Lucia Savage:** "Schema-per-tenant é a defensible posture para ANS RN-627 §3º. RLS soft-tenancy é acceptable para B2C e corporativo, mas physical separation as evidence of proportionality."
- **Aria (@architect):** ADR-006 "Soft-tenancy via `tenant_id` column + RLS, upgrade para hard-tenancy via schema-per-tenant quando contrato exigir"

**Tensão central:** simplicidade ops (Aria) vs hard isolation regulatory (Werner + Lucia). Convergem em "depende do tenant tier".

**Recomendação Orion:** **Dara opção C wins (convergência total).** Codificar em ADR-006: RLS shared schema para B2C + B2B2C corporativo (NR-1), schema-per-tenant para operadoras ANS quando contrato exigir. Função `create_isolated_schema(tenant_slug)` (migration 012 Sprint 3) só executa on-demand. KMS keys-per-customer (Omada pattern Lucia).

**Owner:** @data-engineer + @architect
**Deadline:** **2026-06-06** (Dara: 22/Mai era mais cedo, mas migration 002 ainda viável até Sprint 0 fim)
**Risco se não decidir:** Migration 002 ALTER tenant_id NOT NULL retrabalha em Sprint 1; se A escolhido posteriormente, schema migration disruptiva pré-ANS
**Trigger user:** `"vai com tenancy hibrida c"` ou `"vai com shared schema a + tenant_id"`

---

### D-13 — Embedding provider: Cohere multilingual v3 vs OpenAI text-embedding-3-large (Atul bake-off)

**Pergunta:** Cohere `embed-multilingual-v3` (1024d — Atul: 3-5pp recall@10 acima de OpenAI em PT-BR), OpenAI `text-embedding-3-small` (1536d — status quo), ou BERTimbau self-host (BR-resident, latência maior)?

**Posições no conclave:**
- **Atul Butte:** "Para PT-BR clínico, Cohere multilingual v3 ganha (MIRACL benchmark recall@10 ~3-5pp acima OpenAI em português). Mas a pergunta certa não é qual ganha em recall genérico — é qual sobrevive ao domínio de mental health PT-BR com gírias, eufemismos de crise, code-switching PT/EN. **Sua próxima ação:** monta eval set 300 pares (query→memória relevante) curado por psicólogo clínico, mede recall@5 e MRR nos dois, decide com dado. Custo ~4h analista + R$50 API."
- **Dara (@data-engineer):** "D-DATA-02 — Recomendação: B Cohere com migração progressiva (coluna `embedding_v2`). C BERTimbau revisitado pós-MVP se contrato operadora exigir residência BR estrita."
- **Aria (@architect):** "Embeddings backend pluggable (OpenAI/local)"

**Tensão central:** PT-BR quality (Cohere wins benchmark) vs vendor-BR residency (BERTimbau wins LGPD-strict) vs status quo (OpenAI manter).

**Recomendação Orion:** **Atul bake-off antes de decidir.** Rodar SPIKE-002.5 (Sprint 0-1) — 300 pares PT-BR clínico curados por clinical co-founder, mede recall@5 + MRR Cohere v3 vs OpenAI. Custo total ~R$200 API + 8h analista. Decisão data-driven em Sprint 1 fim. **Não fixar antes do bake-off.** BERTimbau self-host fica para Phase 2 (ANS operadora contract gatilho).

**Owner:** @data-engineer + clinical co-founder (curation) + @dev (eval harness)
**Deadline:** **2026-06-06** (bake-off completed); decisão **2026-06-13**
**Risco se não decidir:** Migration 011 `embedding_v2` retrabalha; rebuild knowledge_chunks pode escolher errado
**Trigger user:** `"roda bake-off cohere vs openai antes de decidir"` ou `"vai com cohere v3 default (dara)"` ou `"manter openai status quo"`

---

### D-14 — Data residency BR migrate antes ANS (Werner pre-ANS migration)

**Pergunta:** Migrar Supabase US → BR (Supabase SA region OU self-host AWS sa-east-1 OU Magalu Cloud) **antes** de contrato ANS (Werner) ou só **quando** ANS exigir formalmente (Aria)?

**Posições no conclave:**
- **Werner Vogels:** "Fight it. LGPD doesn't require BR residency (unlike Russia/China), but ANS RN-627 expectations and political risk of public incident make it worth investment. Migrate to BR **before ANS contract — not after.** Cost delta is small; reputation delta is enormous. Supabase has SA region, or self-host AWS sa-east-1 / RD-managed Postgres."
- **Aria (@architect):** ADR-008 "MVP cloud-managed (Supabase + Vercel + Railway/Fly), com plano de migração documentado para VPS BR ao gatilhar contrato operadora. **Não migrar prematuramente:** Supabase BR atende LGPD; migração antes do gatilho é over-engineering."
- **Dara (@data-engineer):** "Snapshot semanal off-site Wasabi `wasabi-br-saopaulo` ou MagaluCloud (residência BR)"
- **Lucia Savage:** "Multi-tenancy operadora ANS — schema-per-tenant is the defensible posture. Omada solved this with logical isolation + KMS keys-per-customer"

**Tensão central:** preempt regulatory + reputation (Werner) vs YAGNI / over-engineering (Aria). Custo migração estimado R$2-5k setup + R$1-2k/mês delta.

**Recomendação Orion:** **Aria pragmático wins para MVP.** Supabase Cloud SA region (já disponível) cobre LGPD. Migração para self-host VPS BR (Magalu Cloud ou RD) é Phase 2 gatilhada por contrato operadora ANS formal. Snapshot semanal off-site Wasabi BR (Dara) já provê audit trail residência BR sem migration disruptiva. Werner correct em principle mas Aria correct em timing.

**Owner:** @architect + @devops + @data-engineer
**Deadline:** **2026-06-06** (decisão para Sprint 3+ planning)
**Risco se não decidir:** Sprint 4 Beta launch em região US default (Supabase Cloud) — political optics se incidente
**Trigger user:** `"manter supabase cloud sa region + snapshot wasabi br"` ou `"migrar para self-host vps br antes ans"`

---

### D-15 — Aceitar 13-16 stories "In Progress" como dívida de processo OU parar e fechar formalmente em Sprint 1

**Pergunta:** Sprint 1 inteiro dedicado a housekeeping retroativo formal (Insight 2 master report) — @qa roda gate em SAI-001..013 + SAI-200..205, fecha Status: Done formal, OU seguir e fechar incrementalmente conforme tocar cada área (risco de retrabalho)?

**Posições no conclave:**
- **Dex (@dev):** "Opções: (A) Tech debt sprint de 1 semana para fechar SAI-001..013 antes de Sprint 1 — atrasa migração; (B) seguir e fechar incrementalmente. Recomendação Dex: opção A, 5 dias úteis. Vai pagar dividendos."
- **Pax (@po):** "MVP texto-first técnico está ~85% implementado. Gap real está em (a) M4 LGPD inteiro pendente (10 stories TODO), (b) beta onboarding não começou (SAI-104), (c) gates QA/clínico não fechados em segurança, (d) SEC stories 01/02 ainda Draft, (e) **backlog hygiene — status não acompanha realidade**."
- **Quinn (@qa):** "Nenhuma story tem status 'Done' — todas as 13 foundation stories marcam 'In Progress'. Backend existe e roda, mas nenhuma passou pelo gate formal de @qa."

**Tensão central:** velocidade (B incremental) vs regulatory trail defensibility (A housekeeping). ANPD/CFM auditando vai pedir "qual o veredicto QA da SAI-009?" — resposta hoje é "ninguém formalizou".

**Recomendação Orion:** **Insight 2 master report: opção A wins** mas re-escopado. Sprint 1 inteiro NÃO precisa ser housekeeping (muito caro de oportunidade). **Re-escopo Orion:** Sprint 1 = 50% housekeeping (5 dias úteis @qa formal gate em 13 P0 stories) + 50% safety core finalização (SAI-009 T5.2 + T8, SAI-013 sign-off, SAI-411). Custo 5 dias úteis. Ganho: regulatory trail formal antes Sprint 2 chat core começar.

**Owner:** @po + @qa + @dev
**Deadline:** **2026-06-06** (decisão para Sprint 1 planning)
**Risco se não decidir:** Sprint 1 sem housekeeping = "MVP declarado pronto" baseado em status falso quando ANPD/CFM auditarem
**Trigger user:** `"vai com sprint 1 50% housekeeping (dex opção a re-escopo orion)"` ou `"sprint 1 100% safety core + housekeeping incremental"`

---

## Bulk Triggers Disponíveis

Para acelerar fechamento, Orion propõe 3 bulk triggers que cobrem múltiplas decisões:

**Bulk Trigger 1 — "aceito recomendações orion p0a"** (D-01 a D-05):
- SaMD híbrido Bakul-arquitetura Alison-execução
- Concierge MVP paralelo Sprint -1
- Stack atual + Langfuse (Demis wins, rejeita LangGraph/Mem0)
- Clinical co-founder CRP 8-15% equity (Halle)
- Bulk Uma rebrand v2 (D3 + multi-theme B + 3 fonts + caixinha roadmap + 3 renders)

**Bulk Trigger 2 — "aceito recomendações orion p0b"** (D-06 a D-10):
- Hybrid 3-tier crisis classifier + 500 golden set + Mr. Walker
- DPO externo Sprint 3
- Comitê safety híbrido R$1,5k/mês + 0,1% equity 4y (Morgan + Alison)
- RCT pré-registro pré-launch Sprint 5 (Atul + Quinn)
- Operadora ANS adiada 2027 (Halle)

**Bulk Trigger 3 — "aceito recomendações orion p0c"** (D-11 a D-15):
- B2C exclusivo, NR-1 documental Sprint 6 (Eric + Pax)
- Tenancy híbrida C (Dara/Werner/Lucia convergem)
- Bake-off Cohere vs OpenAI Sprint 0-1 (Atul)
- Supabase Cloud SA region + Wasabi snapshot BR (Aria pragmático)
- Sprint 1 50% housekeeping (Insight 2 Orion re-escopo)

**Bulk Trigger Total — "aceito tudo padrão orion anipis squad-16mai"** = aplicar todos 15 simultaneamente.

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai · 15 decisões consolidadas*
*Próximo passo: responder bulk triggers ou decisões individuais para destravar Sprint -1 (Concierge MVP) + Sprint 0 (foundation técnica) na semana 16-30/Mai/2026.*
