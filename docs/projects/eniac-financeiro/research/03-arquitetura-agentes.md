# Frente 3 — Arquitetura de Referência: camada de IA + fundação de dados

> Autor: aios-architect (Aria) · Data: 2026-06-20 · Status: arquitetura de referência (pré-PRD)
> Escopo: camada de IA + fundação de dados, plataforma financeira multi-empresa (3 empresas ENIAC)

## 0. Decisões opinativas (travadas pela arquitetura, sujeitas a conclave)
1. **Partida dobrada, não caixa simples.** Append-only; correção = lançamento reverso. Torna conciliação/consolidação/auditoria *prováveis*, não *afirmadas*. Mesmo DNA do Contador.
2. **Determinístico-primeiro; LLM é fallback/apresentador, nunca fonte da verdade de número.** Todo número exibido é computado por SQL ou função tipada sobre o ledger.
3. **Postgres único (Supabase) com RLS por `company_id`** (não schema-por-empresa). Consolidação das 3 = query de 1ª classe. (= CRM Novo ADR-001.)
4. **pg-boss + worker dedicado Railway** pra todo trabalho IA/pesado. Server actions Vercel só no caminho síncrono. Evita cold-start/timeout; jobs idempotentes e retryable.
5. **Claude por job:** Haiku 4.5 (classificação volume) · Sonnet 4.6 (copiloto + raciocínio de conciliação) · Opus 4.8 (casos difíceis raros + insights offline). Pinar versões em config.

## 1. Duas pistas de execução
- **Async (queue → worker):** ingestão, categorização, conciliação, forecasting, insights/anomalia. Batch, retryable, idempotente.
- **Sync (server action):** copiloto conversacional. Baixa latência, tool-calling, sem escrita no ledger.

## 2. Os 4 agentes

### Agente 1 — Categorização + Conciliação (carro-chefe, 80% do valor e do risco)
Cascata: (1) regras determinísticas → (2) memória/correções (merchant+empresa) → (3) embedding pgvector (cosine ≥0.92 e categoria dominante única) → (4) LLM Haiku (confiança ≥0.85 E valor < limite) → (5) fila humano (HITL) → escreve `correction_log` → realimenta (1)/(2).
- **Conciliação determinística:** match exato (mesmo valor + janela ±2 dias úteis + mesma conta); duplicata (mesmo `external_id` = idempotência; valor+data+merchant repetido c/ external_id diferente = *suspeita*, nunca auto-deletar); divergência (linha OF sem contrapartida = "transação não registrada"; lançamento sem linha bancária = "faltando no banco/pendente").
- LLM só em match *fuzzy*, sempre confirmado por humano acima do limite de valor.
- **Aprendizado:** cada correção humana → `correction_log`, consultado ANTES de qualquer LLM; promovido a `category_rule` quando (merchant,categoria) estabiliza (3+ correções). Flywheel: share do LLM CAI com o uso.
- **Guardrails:** LLM nunca posta no ledger (só propõe; função valida débito=crédito + conta pertence à empresa); auto-assign travado por confiança E valor (R$50k sempre vai pra humano); todo assign carrega `source`+rationale no audit log; idempotência `(aggregator, external_id)`.

### Agente 2 — Previsão de Fluxo de Caixa (heurística primeiro, ML depois, LLM só narra)
- **MVP heurístico (sem LLM):** eventos futuros conhecidos (boletos/Pix agendados = fatos → `cash_event` scheduled); detecção de recorrência (merchant+valor+cadência → projeta próximas N ocorrências = predicted); projeção de saldo `saldo + Σentradas agendadas − Σsaídas agendadas + Σrecorrentes` por empresa/dia + **consolidado** (soma das 3, intercompany neta a zero); alerta de risco quando saldo projetado cruza limite.
- **Fase-2 ML** (só se heurística estagnar): time-series leve (Prophet/GBM) p/ saídas irregulares.
- **LLM (Sonnet):** transforma forecast computado em parágrafo; lê números, não computa.
- **Guardrails:** projeções marcadas scheduled(fato)/predicted(heurística)/ml; reproduzível via `input_snapshot_hash`.

### Agente 3 — Copiloto Conversacional (onde "não inventar número" é vida-ou-morte)
- **Decisão: tools predefinidas tipadas, NÃO text-to-SQL livre.** Modelo nunca escreve SQL. Catálogo fixo de funções parametrizadas RLS-scoped: `get_spend_by_category`, `compare_companies`, `get_balance`, `top_counterparties`, `cashflow_this_month`… Modelo faz: intenção → seleção de tool → extração de args → enquadramento em linguagem natural + escolha de chart spec. Aritmética: nenhuma.
- Modelo: Sonnet 4.6, temperatura baixa. Opus só se a pergunta exigir decomposição multi-passo.
- **Guardrails (joia da coroa):** (1) modelo sem calculadora e sem SQL, só tools; sem tool que sirva → "não consigo responder isso ainda" (recusar = correto, inventar = Sev-1). (2) Números na UI vêm do *objeto resultado da tool*, não da prosa. (3) Toda tool RLS-scoped. (4) Tudo logado + reproduzível. (5) Read-only por construção (role `SELECT`-only).
- **Fase-2:** semantic layer (Cube/dbt-metrics) atrás do copiloto p/ escalar cobertura.

### Agente 4 — Alertas/Insights/Anomalia proativos (detectores computam sinal, LLM ranqueia/escreve)
- **Detectores (sem LLM):** gasto anômalo (baseline rolling por empresa+categoria, mediana+MAD/z-score); vencimentos próximos (boletos/Pix em X dias, ranqueados por impacto de caixa); risco de pagamento duplicado (mesmo fornecedor+valor parecido entre as 3 empresas — risco real de grupo); oportunidades de economia (recorrência que subiu, assinatura sem uso).
- **LLM (Sonnet, batch offline):** dedup/ranqueia em digest diário, escreve explicação em PT com números computados, suprime ruído.
- **Guardrails:** trigger e números sempre do detector; LLM só explica/prioriza; cada alerta com `evidence_links` pras transações.

## 3. Fundação de dados

### 3.1 Modelo (partida dobrada, append-only)
- CoA por empresa + mapeamento p/ CoA consolidada de grupo; contas intercompany tagueadas (netam a zero na consolidação).
- **Mapeamento Open Finance:** conta agregador → conta bancária do ledger; transação OF → (após categorização) lançamento c/ 2 linhas (banco + conta de resultado). Linha OF preservada verbatim em `of_transaction` e *linkada* ao lançamento. Dados crus e contabilidade separados mas joinados.
- Lançamentos manuais entram pela MESMA função de posting (caminho único, validação única débito=crédito, audit único).
- **Ingestão idempotente:** unique `(aggregator, external_id)`. Webhook + pull agendado dão upsert; replays = no-op. + smoke test diário (re-pull de conta conhecida, asserta zero linhas novas + paridade de saldo).

### 3.2 Schema Supabase (tabelas-chave)
`company`, `membership(role: owner|finance|accountant|viewer)`, `chart_of_accounts(type, parent_id, consolidated_account_id, is_intercompany)`, `journal_entry(source, reverses_entry_id, input_snapshot_hash)`, `journal_line(debit, credit — CHECK Σdebit=Σcredit)`, `category`, `of_account`, `of_transaction(external_id UNIQUE, merchant_normalized, kind, journal_entry_id, category_id, categ_source/confidence/rationale)`, `reconciliation_match(match_type, status)`, `category_rule`, `correction_log`, `merchant_embedding(vector(1536) + ivfflat)`, `forecast_run(method)`, `cash_event(kind: scheduled|predicted|ml)`, `insight(computed_facts jsonb, evidence_links)`, `alert`, `agent_action_log(INSERT-only: inputs_hash, output_hash, model, tokens, cost_usd, rationale)`.

### 3.3 RLS / isolamento
- Toda tabela com `company_id` (consolidado = `company_id IS NULL` + check de grupo). Policy canônica via `membership WHERE user_id=auth.uid()`. Consolidado exige pertencer a TODAS as empresas do grupo.
- **3 roles least-privilege:** `copilot_ro` (SELECT only, Agente 3) · `worker_rw` (escreve só via RPCs de posting) · `auditor_ro` (lê audit log).
- MFA TOTP obrigatório p/ owner. Região **sa-east-1** (LGPD + latência).

### 3.4 Onde IA roda / cache
- Sync (Vercel): só copiloto. Async (pg-boss→worker): resto.
- Cache: prompt caching Anthropic (catálogo de tools, CoA); embedding cache por merchant (custo ~zero em regime); forecast/insight materializados (sem LLM no load do dashboard).

## 4. Cross-cutting
- **Correção numérica:** posting validado antes de escrever; copiloto só tools SQL; UI bind a resultado, não prosa; forecast/insight de detectores determinísticos.
- **Auditabilidade:** `agent_action_log` INSERT-only; ledger append-only c/ reversos; alertas com evidence_links; forecast reproduzível por hash.
- **HITL:** categorização acima de valor/confiança → inbox; fuzzy match e suspeita de duplicata → confirmação humana.
- **Custo LLM:** tiering; cascata determinística mantém maioria fora do LLM; prompt+embedding cache; budget mensal por empresa com degradação graciosa (rules-only); insights em batch.

## 5. Ordem de build faseada
- **Fase 0 — Fundação (sem IA):** schema + RLS + ingestão OF idempotente + lançamentos manuais + função posting partida-dobrada + dashboards + smoke test diário. **Negócio roda só com isso.** Tem que ser sólido antes de qualquer agente.
- **Fase 1 — MVP IA:** (1) Agente 1 núcleo determinístico (regras + match exato + dup/divergência + HITL + correction_log, sem LLM) → (2) Agente 1 embedding + LLM Haiku → (3) Agente 3 copiloto com ~6-8 tools (arquitetura "sem número inventado" desde o dia 1).
- **Fase 2 — Proativo + forecast:** (4) Agente 2 heurístico → (5) Agente 4 detectores + digest diário.
- **Fase 3 — Profundidade (se merecida):** ML forecast; semantic layer; auto-promoção de regras; alerta WhatsApp; isolamento físico por tenant se exigido.
- **Mantra:** entregar Fase 0 + metade determinística do Agente 1 ANTES de escrever um prompt LLM. A IA financeira mais barata, precisa e auditável é a que em grande parte NÃO é IA.

## 6. Top 5 riscos
1. **LLM inventa número** no copiloto → Sev-1. Mit: tools SQL-only, sem calculadora; UI bind a resultado; recusar = correto; eval suite de respostas conhecidas em CI (validar a *métrica* — disciplina do founder).
2. **Drift de ingestão / miscount silencioso** (cicatriz CRM Novo). Mit: idempotência `(aggregator, external_id)`; smoke test diário; divergências como cidadãos de 1ª classe.
3. **Vazamento RLS cross-empresa / consolidação sobre-exposta** → breach LGPD. Mit: policy canônica em toda tabela; consolidado gated por membership total; `copilot_ro`; teste automatizado que asserta zero linhas das outras 2.
4. **Auto-categorização errada compõe** → relatórios/forecast silenciosamente errados. Mit: gating valor+confiança; ledger append-only (erro reversado); loop de correção; accuracy por source com auto-ajuste de threshold.
5. **Custo LLM dispara** com volume. Mit: cascata determinística; cache; Haiku no bulk; budget por empresa c/ degradação; insights em batch; custo no audit log.

## 7. Handoffs recomendados
@pm (PRD: 4 agentes como epics, Fase 0 = épico-fundação inegociável) · @data-engineer (schema+índices, RPC de posting, RLS, tuning pgvector) · @po (stories c/ HITL inbox + eval "sem número inventado" como AC) · @qa (smoke ingestão + teste isolamento RLS + eval correção numérica, em CI).
**ADRs:** partida-dobrada vs caixa; copiloto tools vs text-to-SQL vs semantic layer; forecast heurístico vs ML; RLS shared-schema.

## ⚠️ Pré-PRD: 2 decisões pra conclave Jarvis
(a) **Partida-dobrada vs caixa** (martin-fowler + werner-vogels no modelo de dados; heleno-taveira-torres se o contador da ENIAC aceita o modelo de consolidação).
(b) **Garantia de correção numérica do copiloto** — guardrail de maior stakes.
