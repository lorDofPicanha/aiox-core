# Anipis — Architecture Deliverable (Architect: Aria)

**Status:** DRAFT for review
**Date:** 2026-05-16
**Author:** Aria (@architect)
**Project:** Anipis — AI mental health companion (BR)
**Squad:** squad-16mai
**Scope:** MVP + Phase 2 evolution; technical foundations for CFM 2.454/2026 deadline (ago/2026)
**Codebase reality check:** stack atual em `apps/serenity-ai/` é Fastify 5 + Drizzle ORM + Supabase (Postgres) + Anthropic SDK + OpenAI SDK + Upstash Redis + Sentry — confirmado em `apps/api/package.json`.

> Convenção de citação: fontes do dossiê 08-mai são citadas como `[H-{content_id_suffix}]` ligadas aos feeds de `demis-hassabis`, `fei-fei-li`, `atul-butte` e `alison-darcy`. Decisões não auto-deriváveis da evidência são explicitamente marcadas `[AUTO-DECISION]` conforme regra do agente.

---

## 1. Architecture Overview

### 1.1 Logical Block Diagram (textual)

```
                +-------------------------------------------------------+
                |                        EDGE / CDN                     |
                |  Vercel (Next.js 15 App Router) — apps/web            |
                |  - SSR/RSC, route handlers, Edge middleware (auth)    |
                |  - Static assets + ISR for marketing                  |
                +-------------------------+-----------------------------+
                                          |
                       WSS (chat stream)  |  HTTPS (REST + SSE)
                                          v
                +-------------------------------------------------------+
                |                BACKEND API (Fastify 5)                |
                |                 apps/api  (Railway/Fly)               |
                |  Plugins: helmet, cors, rate-limit, websocket, auth   |
                |  Middleware: role-guard (patient|professional|admin)  |
                +---+-----------+-------------+--------------+----------+
                    |           |             |              |
                    v           v             v              v
              +-----------+ +---------+ +------------+ +-------------+
              |  AGENT    | | SAFETY  | |  MEMORY    | |  LLM ROUTER |
              | ORCHESTR. | | LAYER   | |  LAYER     | |   LAYER     |
              | LangGraph | | Class.  | |  Mem0      | |  GPT-5      |
              |   1.0     | | Injec.  | |  (managed) | |  Claude 4.5 |
              | (Python   | | Guard   | |  + pgvec.  | |  + fallback |
              | service)  | | OutFilt | |  semantic  | |  + cache    |
              +-----+-----+ +----+----+ +-----+------+ +------+------+
                    |            |            |               |
                    +------------+------------+---------------+
                                         |
                                         v
                +-------------------------------------------------------+
                |                 DATA LAYER  (Supabase)                |
                |  Postgres 16 + pgvector + RLS                         |
                |  Drizzle ORM (TS) + Alembic (Python)                  |
                |  Tables: profiles, conversations, messages, mood,     |
                |  assessments, granular_consents, crisis_events,       |
                |  pii_audit_log, professional_patient_links,           |
                |  professional_ai_configs, knowledge_chunks (RAG),     |
                |  memory_episodes, memory_semantic                     |
                |  Auth: Supabase Auth (JWT, RLS via auth.uid())        |
                |  Storage: encrypted assets (KMS), avatars             |
                +-------------------------+-----------------------------+
                                          |
                       +------------------+-----------------+
                       v                                    v
              +-----------------+                  +------------------+
              | OBSERVABILITY   |                  |  CRISIS RAILS    |
              |  Langfuse       |                  |  CVV 188 / 192 / |
              |  (self-host)    |                  |  CAPS dir. SUS   |
              |  + Sentry +     |                  |  + human review  |
              |  pino + OTEL    |                  |  queue           |
              +-----------------+                  +------------------+
```

### 1.2 Layered Responsibilities

| Camada | Responsabilidade | Stack escolhido | Por quê |
|---|---|---|---|
| **Edge/CDN** | UI, autenticação edge, SEO | Vercel + Next.js 15 RSC | Já em produção em `apps/web`; baixa latência BR (POP GRU) |
| **API** | REST/WSS, auth, RLS bypass server-side controlado | Fastify 5 (TS) | Já em produção em `apps/api`; throughput >40k req/s, ecosystem maduro |
| **Agent Orchestration** | Grafo de estado conversacional, ferramentas, HITL | LangGraph 1.0 (Python service) | GA out/2025, state-graph orchestration, 47M downloads/mês `[H-642743ad9061795a]` |
| **Safety** | Classificação crise, injection guard, output filter | Híbrido: serviço Python + regras TS | Crisis classifier precisa fine-tuning PT-BR (ver §5); guards leves ficam no API TS |
| **Memory** | Episódica + semântica + perfil | Mem0 (managed) + pgvector | Mem0 paper arXiv 2504.19413 = production-ready, simpler than Letta `[H-cd761c60a62c52d4]` |
| **LLM Router** | Roteamento + fallback + cache | GPT-5 default, Claude 4.5 fallback | Benchmarks clínicos: ambos abaixo de 4/6 mas melhores disponíveis `[H-aa1094dcc85b37ed]` |
| **Data** | Persistência, RLS, vetores | Supabase (Postgres 16 + pgvector) | Já em uso; 4 migrations existentes em `supabase/migrations/` |
| **Observability** | Traces, evals, A/B | Langfuse self-host | 19k+ stars, OTEL nativo, evals + datasets, LGPD-friendly `[H-487a19443972682f]` |
| **Crisis Rails** | Roteamento humano + 188/192/CAPS | Worker dedicado + queue | CFM 2.454/2026 obriga não delegar diagnóstico a IA `[H-c12bee063238f718]` |

---

## 2. ADR-001 — Posicionamento SaMD vs Wellness

**Status:** PROPOSED (decision needed by user)
**Context:** Anipis pode ser regulada como wellness app (sem ANVISA) ou Software as Medical Device (SaMD, ANVISA RDC 657/2022). A FDA já discutiu GenAI MH devices em Nov 2025 `[H-41a72cdd00b519c1]`. CFM 2.454/2026 vigora ago/2026 e classifica IA médica em baixo/médio/alto/inaceitável risco, com LGPD by design e proibição de delegar diagnóstico/prognóstico a IA `[H-c12bee063238f718]`. APA emitiu advisory Nov 2025 dizendo que apps wellness não resolvem crisis MH `[H-a25f80df02f85430]`.

**Decisão Aria:** **Híbrido escalonado** — MVP lança como **Wellness companion com safety SaMD-grade**, com pista regulatória para SaMD Class IIa formal em Phase 2 (mirando 12-18 meses pós-launch). Anipis NÃO faz diagnóstico, NÃO prescreve, NÃO trata isoladamente — posicionamento de "companion adjunto" alinhado com APA `[H-a25f80df02f85430]`.

**Trade-offs:**

| Dimensão | Wellness puro | SaMD Class IIa (ANVISA) | Híbrido (escolhido) |
|---|---|---|---|
| Tempo até launch | 0-2m | 12-24m | 2-3m |
| Custo certificação | R$0 | R$300k-R$1.5M (QMS ISO 13485 + RDC 657 audit) | R$0 MVP / preparado Phase 2 |
| Liability | Alta (sem amparo regulatório) | Baixa (cobertura SaMD) | Média (mitigado por safety SaMD-grade) |
| Claims permitidos | "bem-estar", "apoio" | "tratamento de transtorno X" | "companion adjunto"; sem claims terapêuticos |
| Reembolso ANS | Não | Sim (potencial) | Phase 2 |
| Diferencial competitivo | Baixo (Wysa, Woebot competem) | Alto (Limbic = Class IIa NHS 500k+ pacientes) `[H-Limbic]` | Médio crescente |

**Por quê híbrido (não wellness puro):**
1. CFM 2.454/2026 cria nova fronteira regulatória ago/2026 — competidores wellness ficam expostos `[H-c12bee063238f718]`.
2. Litígios Character.AI (settle teen suicide, Jan 2026 CNN) demonstram risco existencial para companion sem safety SaMD-grade `[H-Character-AI]`.
3. APA advisory Nov 2025 + CFP cartilhas Dez 2025 sinalizam apertão regulatório próximo `[H-a25f80df02f85430]` `[H-8293d2542ebba75f]`.
4. Custo arquitetural de adicionar safety SaMD-grade hoje é incremental (~15% effort); retrofit posterior é refactor traumático.

**Por quê não SaMD desde MVP:**
1. ANVISA RDC 657/2022 + QMS ISO 13485 = 12-24 meses + R$300k-1.5M, mata time-to-market.
2. Sem evidência clínica própria, dossiê SaMD é rejeitado — precisamos rodar RCT antes (referência Therabot NEJM AI Dartmouth `[H-989f369608fe8391]`).

**Implicações arquiteturais imediatas:**
- Audit log imutável de TODAS interações com PII (já temos `pii_audit_log` em `apps/api/src/services/`).
- Crisis classifier separado e auditável (não inline no LLM call) — ver §5.
- Versionamento de prompts + datasets de avaliação reprodutíveis (Langfuse, §8).
- Documentação técnica completa em formato pré-compatível com dossiê SaMD (mesmo que não submetido).

**Disclaimers obrigatórios no produto:**
- "Anipis não substitui psicólogo, psiquiatra ou tratamento médico"
- "Em crise, ligue CVV 188 ou SAMU 192"
- Banner permanente "companion adjunto" + termos.

---

## 3. ADR-002 — Memory Layer: Mem0 vs Letta

**Status:** PROPOSED
**Context:** LLMs precisam de memória persistente para companion MH (paciente espera continuidade entre sessões). Duas opções principais: **Mem0** (arXiv 2504.19413, simpler, managed) `[H-cd761c60a62c52d4]` e **Letta/MemGPT** (controle stateful complexo) `[H-195d00ba280dc21c]`. Feed atul-butte indica "Letta vs Mem0: Letta dá controle, Mem0 dá simplicidade — decisão técnica direta para Anipis" `[H-195d00ba280dc21c]`.

**Decisão Aria:** **Mem0 (managed) para MVP** + **camada `memory-service.ts` própria já existente** (`apps/api/src/services/memory/`) como abstração. Letta vira opção de Phase 2 se precisarmos de stateful agents complexos (multi-agente, planejamento longo).

**Pros/Cons:**

| Critério | Mem0 (managed/OSS) | Letta (OSS + cloud) |
|---|---|---|
| Time-to-value MVP | 1-2 sprints | 3-5 sprints |
| Simplicidade API | Alta (REST simples) | Média (state machine) |
| Stateful agents complexos | Limitado | Excelente |
| Custo cloud | $19-99/mo até 100k mem ops | $-cloud ou self-host pesado |
| Self-host BR (LGPD) | Sim, OSS license | Sim, mais ops overhead |
| Embeddings backend | Pluggable (OpenAI/local) | Pluggable |
| Citações (sourceability) | Sim | Sim |
| Latency p95 | 100-300ms | 200-500ms (state load) |

**Por quê Mem0:**
1. Survey memory agents arXiv 2512.13564 mostra Mem0 como referência produção-ready `[H-d8296f99e3767cb7]`.
2. MVP precisa shipping — Letta é arma para Phase 2 quando tivermos múltiplos agentes (triage + companion + crisis).
3. Já temos `memory-service.ts` + `embedding-service.ts` + `bio-memory.ts` — Mem0 entra como driver, não exige rebuild.

**Por quê camada própria por cima:**
1. Vendor lock-in: se Mem0 ficar inadequado, swap para Letta/Zep/custom é localizado.
2. Auditoria LGPD precisa logar TODA operação de memória (gravação, leitura, deleção, esquecimento por solicitação titular) — fica nosso, não dependemos de provider.

**Implementação:**
```
memory-service.ts (TS, façade)
  ├── adapters/mem0-adapter.ts          [MVP]
  ├── adapters/pgvector-direct.ts       [fallback / RAG]
  └── adapters/letta-adapter.ts         [Phase 2 ifNeeded]
```

**Risco aceito:** Mem0 OSS license pode mudar (visto em ecossistema 2024-2025); mitigação = capa de abstração + checkpoint trimestral de licença.

---

## 4. ADR-003 — Backend Stack: Python (AI) + TS (frontend/edge) vs Full-TS

**Status:** PROPOSED
**Context:** LangGraph maturidade é primariamente Python (47M downloads/mês, ecossistema rico, `awesome-LangGraph` indexa healthcare/diagnosis/multi-agent) `[H-642743ad9061795a]` `[H-295]`. LangChain.js existe mas tem ~1/5 do ecossistema, e LangGraph.js é catch-up. Stack atual Anipis (`apps/serenity-ai/`) é full-TS (Fastify 5 + Drizzle).

**Decisão Aria:** **Híbrido polyglot** — manter `apps/api` em **TS** como API gateway + lógica de negócio + auth + RLS, e introduzir novo serviço **`apps/agent-service`** em **Python** especializado em LangGraph + memory + RAG + crisis classifier fine-tuning. Comunicação via REST/gRPC interno.

**Arquitetura:**
```
[Next.js 15] --HTTP--> [Fastify 5 TS API] --internal HTTP--> [Python agent-service]
                              |                                       |
                              +-> Supabase                             +-> Mem0 / pgvector / Langfuse
                              +-> Auth / RLS / Stripe                  +-> LangGraph runtime
```

**Pros/Cons:**

| Dimensão | Full-TS | Híbrido polyglot (escolhido) | Full Python |
|---|---|---|---|
| Maturidade LangGraph | LangGraph.js (~1/5 ecosystem) | Python LangGraph 1.0 GA | Python LangGraph 1.0 GA |
| Reuso codebase atual | 100% | 100% (TS API mantido) | 0% (rebuild Fastify→FastAPI) |
| Hiring | Wide (JS/TS) | Médio (precisa Python ML também) | Mais difícil para frontend full-stack |
| Cold start | Excelente (Node) | Médio (Python uvicorn pode ser ajustado) | Pior |
| Type safety end-to-end | Excelente | Bom (Pydantic ↔ Zod schema) | Bom (Pydantic) |
| Acesso a modelos locais (Llama, Qwen) | Limitado | Total (transformers, vLLM, llama.cpp) | Total |
| Tooling AI ecosystem | Limitado | Total (LangGraph, LlamaIndex, Letta, etc.) | Total |

**Por quê híbrido:**
1. Stack atual já roda Fastify 5 + Drizzle em produção — descartar = retrabalho desnecessário.
2. LangGraph 1.0 + Mem0 + Langfuse + ferramentas de fine-tuning (LoRA, QLoRA) `[H-7669]` `[H-7790]` são primeiro-classe em Python; replicação em JS é amadora.
3. Crisis classifier provavelmente vai precisar fine-tuning PT-BR (CONEMO/MedPT 384k Q&A `[H-cd7a6a7d0d905271]`) — pipeline ML é Python.
4. Mantém porta aberta para self-host Llama/Qwen2.5-1M contexto BR (`Qwen2.5-14B-Instruct adaptado BR, 83.9% HealthBench-BR` `[H-d5ea0e9df23abb46]`).

**Contratos entre serviços:**
- Schemas compartilhados via JSON Schema → gera Zod (TS) + Pydantic (Python).
- Repo dedicado `packages/agent-contracts` (já temos `packages/db` shared).
- Auth interno: mTLS ou serviço-token rotativo via Supabase Vault.

**Deploy:**
- TS API: Railway / Fly.io (já em uso).
- Python agent-service: Railway / Fly.io (separado, scaling independente).
- VPS BR (RD, ST, BlueHost) reservado para Phase 2 quando ANS exigir (ver §10).

---

## 5. ADR-004 — Crisis Routing Engine

**Status:** PROPOSED (highest-priority architectural concern)
**Context:** APA Nov 2025 advisory + CFM 2.454/2026 + Character.AI litigations `[H-Character-AI]` `[H-a25f80df02f85430]` `[H-c12bee063238f718]` `[H-NPR-teens]` colocam crisis routing como gate existencial. Categorias mínimas: **suicide ideation/plan**, **self-harm (non-suicidal)**, **violência sexual/doméstica**, **abuso infantil** (CONANDA reporting), **psicose aguda/risco terceiros**.

**Decisão Aria:** **Pipeline dedicado de 3 estágios, paralelo ao LLM principal**, com SLA `< 1s` para classificação, **human-in-the-loop** para todos casos `severity >= medium`, e **audit log imutável** (write-once).

### 5.1 Pipeline

```
[user message]
     |
     +--> [LLM principal] (async, vai responder em ~5-8s)
     |
     v
[Stage 1: Crisis Classifier] (< 200ms)
     |   Modelo: classifier dedicado, fine-tuned PT-BR
     |   Output: {category, severity 0-3, confidence}
     |
     v
[Stage 2: Decision Engine] (< 50ms)
     |   Reglas:
     |    - severity 0 (none) → continua fluxo normal
     |    - severity 1 (low) → injeta safety message + recursos passivos
     |    - severity 2 (medium) → INTERROMPE LLM principal,
     |       resposta scripted + CVV 188 + CAPS link + queue
     |       human review (4h SLA)
     |    - severity 3 (high) → INTERROMPE + resposta crisis
     |       + sugere SAMU 192 + log emergência + alerta admin
     |
     v
[Stage 3: Action Router] (< 750ms)
     |   - Substitui LLM stream se severity >= 2
     |   - Notifica crisis-handler (worker dedicado)
     |   - Grava em crisis_events (imutável)
     |   - Tagueia conversa para review
     |
[FINAL OUTPUT]
```

### 5.2 Classificador (Stage 1)

**Abordagem em camadas:**

| Camada | Tech | Latência | Falsos negativos esperados |
|---|---|---|---|
| L1: Keyword/regex PT-BR | Trie compilada + variações | <5ms | Alta (10-15%), captura óbvios |
| L2: Embedding similarity vs frases-canônicas | pgvector + 200 frases curadas | <50ms | Médio (3-5%) |
| L3: Classificador ML fine-tuned | Llama-3.1-8B-PT QLoRA ou Qwen2.5-7B-PT `[H-Llama-7B-QLoRA-MH]` `[H-d5ea0e9df23abb46]` | <200ms p95 | Baixo (target <1%) |
| L4: LLM judge (fallback se L3 unsure) | GPT-5 com prompt rigorous + structured output | <800ms | <0.5% |

**Lógica:** se L1 dispara → severity >= 1 garantido. Se L2 confirmar → severity >= 2. L3 dá categoria + confidence; se confidence < 0.7 → L4 LLM judge.

**Dataset de treino/eval:** combinação de
- CONEMO transcripts (UBS Indaiatuba) `[H-51761c2297e74de5]`
- MedPT 384k Q&A pares paciente-médico PT-BR `[H-cd7a6a7d0d905271]`
- Sintéticos via GPT-5 com prompts adversariais (data augmentation)
- Anotações próprias com 2 psicólogos clínicos (gold standard ~500 amostras)

**Métricas de aceite (Sprint 0-1):**
- Sensibilidade (recall) severity≥2: **>=99%** (falso negativo é existencial)
- Especificidade: **>=85%** (falso positivo desgasta UX mas é aceitável)
- p95 latência total pipeline crisis: **<1s** (orçamento §11)

### 5.3 Escalation Paths

| Severity | Resposta automática | Ação ativa | SLA |
|---|---|---|---|
| 0 (none) | Nenhuma | Nenhuma | — |
| 1 (low) | Mensagem cuidadosa + recursos (Mapa Saúde Mental SUS, CVV 188 mencionado) | Tagueia review opcional | 24h review |
| 2 (medium) | INTERROMPE LLM. Mensagem scripted: "Notei sinais de sofrimento. CVV 188 (24h), CAPS mais próximo: [link]. Quer que eu te ajude a achar um profissional?" | Cria item crisis-queue (human review 4h SLA); notifica responsável de plantão | 4h |
| 3 (high) | INTERROMPE. "Estou preocupado com sua segurança. Por favor ligue agora SAMU 192 ou CVV 188. Posso te conectar a um profissional de emergência?" + safety plan template | Cria item P0 crisis-queue; alerta pager (PagerDuty); audit immutable | 15min ack |

**Recursos BR canônicos (codificados em config):**
- **CVV 188** — Centro de Valorização da Vida, 24/7, voz + chat + email — referência Stanley & Brown safety plan `[H-suicidesafetyplan]`
- **SAMU 192** — emergência médica
- **CAPS** — Centros de Atenção Psicossocial (SUS) — diretório com geolocalização
- **Mapa Saúde Mental** (Ministério da Saúde) — link público

### 5.4 Human-in-the-Loop

**Crisis-handler service** (worker dedicado, FIFO queue):
- Operadores clínicos certificados (psicólogos CRP) revisam fila.
- Tools: view conversation (read-only RLS), reach out via canal externo (não pelo Anipis), close case com resolução.
- SLA enforcement (alerta se >SLA).

**Por quê HITL é NON-NEGOTIABLE:** CFM 2.454/2026 proíbe delegar diagnóstico/prognóstico a IA `[H-c12bee063238f718]`. Crisis routing automatizado SEM revisão humana viola spirit da resolução e expõe a litígio Character.AI-style `[H-Character-AI]`.

### 5.5 Audit Imutável

Tabela `crisis_events`:
- `id` (UUID), `user_id`, `conversation_id`, `message_id`
- `classifier_output` (JSONB, completo)
- `severity`, `category`, `confidence`
- `action_taken` (ENUM)
- `human_reviewed_at`, `reviewer_id`, `resolution`
- `created_at` — **write-once** via trigger; updates só em campos `human_reviewed_*`
- Replicação para storage WORM (S3 Object Lock equivalent / Supabase Storage com versioning).

---

## 6. ADR-005 — LLM Routing (GPT-5 default, Claude 4.5 fallback, local Llama opcional)

**Status:** PROPOSED
**Context:** Benchmarks clínicos arXiv 2510.19032 colocam GPT-5, Claude 4.5, Gemini 2.5 todos abaixo de 4/6 em escala clínica `[H-aa1094dcc85b37ed]` — ou seja, nenhum é "bom" sozinho. GPT-5 mental health update: 91% self-harm compliance, 97% emotional reliance `[H-cb3ec297a93b92dd]`. Sinal claro: precisamos multi-modelo + safety layer próprio sobreposto.

**Decisão Aria:** **Router dinâmico baseado em (intent, severity, latency budget, cost)**:

```
default → GPT-5 (OpenAI) | response timeout 8s, retries 1
fallback → Claude 4.5 (Anthropic) | quando GPT-5 5xx, timeout, content policy
crisis severity>=2 → Claude 4.5 (refusal behavior mais conservador historicamente)
RAG-only query → GPT-5-nano (cost) ou Claude 4.5 Haiku
embeddings → text-embedding-3-large (OpenAI) ou bge-m3 (local fallback)
local fallback (Phase 2) → Qwen2.5-14B-PT ou Llama-3.1-8B-PT QLoRA  [H-d5ea0e9df23abb46]
```

**Estratégia de fallback (cascata, hard limits):**

| Trigger | Action | Latency add |
|---|---|---|
| Primary 5xx | Retry 1x same provider | +200ms |
| Primary timeout 8s | Switch fallback provider | +0 (parallel hedging opcional) |
| Primary refusal | Re-route via fallback | +800ms |
| Both fail | Static safe message + cria incident ticket | +50ms |

**Cost optimization:**
- **Caching agresivo:** prompt template + user context hash → 30-60% hit rate esperado para onboarding/journaling.
- **Streaming sempre:** reduz percepção de latência.
- **Context window discipline:** Mem0 + RAG dão contexto curado; não fazer dump bruto de histórico (custo + latência + atenção dispersa).
- **Tiered model:** chat normal = GPT-5, classificação leve = GPT-5-nano, embedding = text-embedding-3-large.

**Latency budgets (p95):**

| Operação | Budget p95 |
|---|---|
| Auth + load context | 300ms |
| Crisis classifier (full pipeline) | 1000ms |
| Memory fetch (Mem0) | 300ms |
| RAG retrieval (pgvector top-k=8) | 250ms |
| LLM first token (TTFB) | 2000ms |
| LLM full response (avg msg ~300 tokens) | 8000ms |

**Failover topology:**
```
Request
  ├─ try GPT-5 (8s budget)
  │   └─ success → stream → done
  └─ timeout/error
      ├─ try Claude 4.5 (8s budget)
      │   └─ success → stream → done
      └─ timeout/error
          └─ static safe message + alert
```

**Por quê NÃO local-only (Phase 2 only):**
- Llama-3.1-8B fine-tuned MH ainda perde para frontier em quality `[H-aa1094dcc85b37ed]`.
- Hosting GPU BR custa >R$5k/mes para começar.
- Latência fica boa, mas qualidade é o gate.

**Quando local entra (Phase 2):**
- Crisis classifier (já é local-friendly, dataset PT-BR, decisão estruturada).
- Embeddings (bge-m3 self-host quando volume justificar).
- Fallback offline para mensagens curtas em queda de provider.

---

## 7. ADR-006 — Multi-tenant Schema + RLS

**Status:** PROPOSED
**Context:** Anipis tem B2C (paciente direto) + B2B2C (operadora de saúde, empresa corporativa) + profissionais. Operadora pode exigir isolamento de dados (contrato/HIPAA-equivalent). Já temos RLS habilitado em todas as tabelas (`20260406_enable_rls_all_tables.sql`). Profissional access já modelado em `professional-access-architecture.md` (2026-04-02).

**Decisão Aria:** **Soft-tenancy via `tenant_id` column + RLS**, com upgrade para **hard-tenancy via schema-per-tenant** quando contrato exigir. PII separation por tabela auxiliar `pii_vault`. Audit log imutável `pii_audit_log` (já existe).

### 7.1 Tenancy Model

```sql
-- Add to profiles (e demais tabelas core):
ALTER TABLE profiles
  ADD COLUMN tenant_id UUID REFERENCES tenants(id) DEFAULT NULL;
-- NULL = B2C direct (default tenant)

-- Indexes:
CREATE INDEX idx_profiles_tenant ON profiles(tenant_id) WHERE deleted_at IS NULL;
```

**Tabela `tenants`:**
```sql
CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,    -- 'unimed-bh', 'amil-corp'
  name            TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('b2c', 'operadora', 'corporate', 'gov')),
  isolation_level TEXT NOT NULL DEFAULT 'soft' CHECK (isolation_level IN ('soft', 'hard')),
  data_residency  TEXT NOT NULL DEFAULT 'br' CHECK (data_residency IN ('br', 'us', 'eu')),
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 7.2 RLS Policies (template)

```sql
-- conversations cross-tenant block
CREATE POLICY conversations_tenant_isolation ON conversations
  FOR ALL
  USING (
    user_id = auth.uid()
    OR (
      tenant_id IS NOT NULL
      AND tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
          AND role IN ('professional','admin')
      )
    )
  );
```

### 7.3 PII Separation

Coluna sensível → `pii_vault` (tabela apartada, encrypted-at-rest via pgcrypto):

```sql
CREATE TABLE pii_vault (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id),
  field_name  TEXT NOT NULL,   -- 'cpf', 'rg', 'phone', 'address'
  value_enc   BYTEA NOT NULL,  -- pgp_sym_encrypt(value, key)
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

Acesso só via service-role com key gerenciada em **Supabase Vault** ou KMS externo (AWS KMS São Paulo, opcional Phase 2).

### 7.4 pgvector + RLS

**Risco:** pgvector queries (`ORDER BY embedding <=> $1 LIMIT k`) ignoram RLS por padrão se índice HNSW for global. **Solução**:
- Embeddings particionados por `tenant_id` na cláusula WHERE.
- Índice composite: HNSW por embedding + B-tree por tenant_id (avaliar custo write).
- Spike obrigatório (ver §11) para validar p95 com RLS ativo em volume médio (100k vetores).

### 7.5 Imutabilidade Audit Log

`pii_audit_log` (já existe):
- INSERT-only via trigger.
- UPDATE/DELETE bloqueados via grants (revoke all from authenticated; only service-role writes).
- Replicação WORM para storage externo (S3 Object Lock — Phase 2 quando ANS auditar).

---

## 8. ADR-007 — Observability Stack

**Status:** PROPOSED
**Context:** Langfuse OSS 19k+ stars, Fortune 50 adoption, OTEL nativo, traces + prompts + evals + datasets `[H-487a19443972682f]`. Self-host = controle LGPD total. Comparativos Langfuse vs Helicone vs Langsmith favorecem Langfuse para self-host `[H-2913]`.

**Decisão Aria:** **Langfuse self-hospedado** em VPS BR (RD ou Magalu Cloud) + **Sentry** (errors) + **pino** (structured logs) + **OTEL** unificado.

### 8.1 Stack

| Camada | Tool | Self-host? | Por quê |
|---|---|---|---|
| LLM traces + evals | Langfuse | Sim (LGPD) | Conversas têm PII; mandar para SaaS US = risco |
| App errors | Sentry | Cloud OK (sem PII payload) | Maduro, alertas via Slack/email |
| Structured logs | pino → Loki (Grafana) | Sim | Já em uso (pino-pretty) |
| Metrics | Prometheus + Grafana | Sim | RED/USE para SLOs |
| Tracing distribuído | OTEL collector | Sim | Une Fastify + Python agent-service |
| Uptime sintético | Better Uptime / Healthchecks | Cloud | Não tem PII |

### 8.2 Langfuse Use-cases

1. **Trace por conversation:** cada turno LLM rastreado (input redacted via PII stripper, output, latency, model, tokens, cost).
2. **Datasets de avaliação:**
   - Crisis classifier eval set (500+ amostras gold)
   - Empatia eval (LLM-as-judge com critérios definidos)
   - Refusal eval (não falar de dosagem de medicamento, não diagnosticar)
3. **A/B testing harness:** versão de system prompt vs versão B, métricas: helpfulness, empatia, safety. Roll-back automático se safety cai.
4. **Cost dashboard:** spend por modelo, por tenant, por feature.

### 8.3 SLO Dashboard

| SLO | Target | Measurement |
|---|---|---|
| Availability API | 99.5% | uptime / total |
| Chat p95 TTFB | <2s | langfuse latency |
| Crisis classifier p95 | <1s | langfuse custom metric |
| Crisis review SLA | 95% met (4h med / 15min high) | crisis_events |
| Error rate | <0.5% | Sentry |
| LLM cost / DAU | <R$0.50 | langfuse cost / analytics_service |

### 8.4 PII Stripping

Já temos `pii-stripper.ts` em `apps/api/src/services/`. Reforço:
- Stripping antes de gravar em Langfuse (CPF, emails, telefones, nomes próprios).
- Hash determinístico (HMAC com key) para correlação cross-trace sem revelar identidade.

---

## 9. ADR-008 — Deployment Topology

**Status:** PROPOSED
**Context:** MVP precisa shipping rápido; Phase 2 pode precisar mover para VPS BR quando ANS/operadoras exigirem data residency formal. Custos < R$5k/mês na Phase 1, escalável.

**Decisão Aria:** **MVP cloud-managed (Supabase + Vercel + Railway/Fly)**, com **plano de migração documentado** para VPS BR ao gatilhar contrato com operadora ou exigência ANS formal.

### 9.1 MVP Topology

```
[Vercel POP GRU] -- Next.js 15 RSC
       |
       v
[Railway / Fly.io GRU] -- Fastify 5 TS API (apps/api)
       |
       v
[Railway / Fly.io GRU] -- Python agent-service (LangGraph)
       |                  +-- Mem0 (managed cloud OR self-host)
       |                  +-- Langfuse (self-host VPS BR — Magalu Cloud)
       v
[Supabase Cloud BR] -- Postgres 16 + pgvector + RLS + Auth + Storage
       |
       +-- Backup: Supabase PITR (7d) + lógico nightly para S3 BR
```

**Custos estimados MVP (mês 1-6):**
- Supabase Pro: $25/mo (~R$140) — pode escalar até R$1k
- Vercel Pro: $20/mo (~R$110)
- Railway/Fly: ~R$300-800/mo (2 serviços, autoscale)
- Mem0 hosted: $19-99/mo (~R$110-560)
- Langfuse VPS (Magalu C2-2vCPU 8GB): ~R$200/mo
- OpenAI + Anthropic: variável (target R$0.50/DAU)
- Sentry: free tier (até 5k events/mo)

**Total infra ≈ R$1.5k-3k/mês até 5k DAU.**

### 9.2 Phase 2 Migration (gatilho: contrato operadora)

```
[Vercel POP GRU] (mantém — pode mover para EdgeOne BR se exigido)
       |
       v
[Fly Apps GRU] (mantém ou migra para VPS BR Magalu/RD)
       |
       v
[Self-hosted Postgres BR] -- pgvector + RLS + manual ops
       |                       (substitui Supabase quando contrato exigir)
       v
[VPS BR Magalu Cloud] -- Langfuse + Loki + Grafana + Prometheus
```

**Critérios para migração:**
1. Contrato operadora com cláusula explícita data-residency-BR.
2. Volume justifica (>50k DAU, ops dedicado).
3. Compliance ANS específica (precisamos saber qual antes de invest).

**Não migrar prematuramente:** Supabase BR atende LGPD; migração antes do gatilho é over-engineering.

---

## 10. Quality Attributes

### 10.1 Security

| Aspect | Requirement | Implementation |
|---|---|---|
| LGPD | Lei 13.709/2018 — art. 7 (consent), art. 11 (sensitive health), art. 18 (rights) | `granular_consents` table; explicit consent UI; right-to-delete via `account-deletion-service.ts` |
| CFM 2.454/2026 | Vigor ago/2026; classifica risco; LGPD by design; sem delegação de diagnóstico | Disclaimers permanentes; HITL crisis; sem claims diagnósticos `[H-c12bee063238f718]` |
| CFP cartilhas (Dez 2025) | Companion AI ético em psicologia BR | Referência pública nos termos `[H-8293d2542ebba75f]` `[H-3777d272b8661ae2]` |
| ANPD | DPO designado, RIPD para tratamento sensível | Designar DPO Sprint 0; rodar RIPD |
| Prompt injection | OWASP LLM01 | `injection-guard.ts` (já existe); reforça em prof config (1000 char limit) |
| RLS bypass | Defense in depth | RLS sempre ON; service-role só com auditoria |
| Secrets | Sem secrets em repo | Supabase Vault + Doppler/Infisical |
| Auth | OWASP ASVS L2 | Supabase Auth + MFA opcional + session rotation |

### 10.2 Privacy — Mozilla "Best Of" Target

Mozilla Privacy Not Included tem critérios públicos. Apontar para "Best Of":
- Encryption in transit + at rest (✅ Supabase)
- Minimal data collection (✅ define em data-policy.md)
- Right to delete (✅ implementado)
- Clear privacy policy in PT-BR (TODO Sprint 0)
- No data sale, no third-party tracking (sem GA/Meta Pixel em fluxo logado)
- Vulnerability disclosure program

### 10.3 Reliability

| SLO | Target | Plan |
|---|---|---|
| Availability | 99.5% (1d40min downtime/mês) | Multi-AZ Supabase + Railway autoscale; status page |
| Data durability | 99.999999999% (11 nines) | Supabase Pro PITR 7d + nightly logical to S3 BR (immutable lock) |
| RTO (recovery time) | <4h | Runbook documentado; restore drill trimestral |
| RPO (recovery point) | <15min | Supabase WAL replication |

### 10.4 Latency (resumo budget §6)

| Operação | p50 | p95 | p99 |
|---|---|---|---|
| Auth + page load | 300ms | 800ms | 1.5s |
| Crisis classifier | 400ms | 1000ms | 1500ms |
| Chat TTFB | 1.2s | 2000ms | 3500ms |
| Chat full response | 4s | 8000ms | 12s |
| RAG retrieve | 100ms | 250ms | 500ms |

---

## 11. Spikes — Sprint 0 e Sprint 1

7 spikes obrigatórios antes de comprometer arquitetura:

| # | Spike | Sprint | Effort | Gate de saída |
|---|---|---|---|---|
| S1 | **LangGraph chain real PT-BR** | 0 | 3-5d | Conversa multi-turn com Mem0 + crisis hook funcionando em dev |
| S2 | **Crisis classifier PT-BR (L1+L2 + L3 baseline)** | 0 | 5-8d | Recall >=99% em eval set v0 (200 amostras); p95 <1s |
| S3 | **Local-stack docker-compose** | 0 | 2-3d | Dev pode rodar tudo local (Postgres+Langfuse+API+agent-service) `docker compose up` |
| S4 | **Mem0 vs Letta benchmark** | 1 | 3-5d | Decisão data-driven em 5 dimensões: latency, recall@k, citation accuracy, cost, ops complexity |
| S5 | **pgvector + RLS perf** | 1 | 3d | p95 ≤250ms para top-k=8 em 100k vetores com RLS ativo, com índice HNSW + filtros tenant_id |
| S6 | **Langfuse self-host BR** | 1 | 2-3d | Up em Magalu Cloud / RD; traces fluindo; backup + retention configurado |
| S7 | **Mobile-first responsive baseline** | 1 | 5d | App funciona excelente em Galaxy A (low-end Android BR predominante); Lighthouse mobile ≥85 |

**Sequenciamento:** S1 e S2 paralelos (devs diferentes). S3 destravar onboarding. S4-S7 Sprint 1.

---

## 12. Top Risks Arquiteturais

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | **Vendor lock-in Supabase** | Média | Alto (se ANS exigir migração rápida) | Schema Drizzle puro Postgres + scripts de migração para Postgres self-host validados em CI |
| R2 | **Vendor lock-in OpenAI** | Média | Alto (preço + ToS + outage) | Multi-provider (ADR-005); abstraction `llm-router.ts` (já existe); Anthropic + future local |
| R3 | **Evals brittle (regressão silenciosa de safety/empatia)** | Alta | Crítico | Langfuse eval datasets versionados; CI bloqueia merge se eval cair >5%; review humano de eval mudanças |
| R4 | **Crisis routing latency tail** | Média | Crítico | Hedging em paralelo (L3 + L4 LLM judge correm juntos); circuit breaker; resposta scripted instantânea como floor |
| R5 | **Memory hallucination (Mem0 inventa fatos do usuário)** | Alta | Alto | Citations obrigatórias em cada memory recall; flag de "low confidence"; UI mostra "Lembro que você mencionou..." para usuário corrigir |
| R6 | **Prompt injection via profissional input** | Média | Alto | InjectionGuard (já existe); 1000-char limit; safety classifier roda APÓS injection; audit todo PUT em `professional_ai_configs` `[ref existing arch §3.3]` |
| R7 | **CFM 2.454/2026 reclassifica Anipis como "alto risco"** | Média | Crítico | Posicionamento wellness + safety SaMD-grade hoje (§2); aconselhamento jurídico especialista Sprint 0 |
| R8 | **Litígio civil tipo Character.AI no Brasil** | Baixa-Média | Existencial | HITL crisis + age verification + audit log; D&O insurance; disclaimer reforçado; bem-vindo seg+jurídico no board `[H-Character-AI]` |

---

## 13. Decisões P0 pendentes (max 3)

> **Acionável pelo user — bloqueiam Sprint 0:**

### D-01: Posicionamento SaMD vs Wellness (ADR-001)
**Pergunta:** Aprovar híbrido (wellness MVP + safety SaMD-grade + pista Phase 2 para Class IIa)?
**Por que P0:** Define disclaimers, claims de marketing, escopo de documentação técnica, e budget regulatório para Phase 2.
**Alternativa:** wellness puro (mais rápido, mais arriscado) ou SaMD desde MVP (12+ meses).
**Aria recomenda:** Híbrido.

### D-02: Memory Stack — Mem0 OR direct-pgvector-only
**Pergunta:** Subir Mem0 (managed/OSS) como driver primário, OR começar só com pgvector custom (`memory-service.ts` já existe) e adicionar Mem0 quando precisar?
**Por que P0:** Affecta sprint 0 — Mem0 adoption agora = aprendizado e abstração robusta; pgvector-only = mais simples mas pode forçar refactor.
**Aria recomenda:** Mem0 desde MVP via adapter pattern (mantém porta aberta).

### D-03: Backend Polyglot vs Full-TS
**Pergunta:** Aprovar introduzir `apps/agent-service` em Python (LangGraph + Mem0 client + crisis classifier + RAG), mantendo `apps/api` TS como gateway?
**Por que P0:** Define hiring, deploy pipeline, e contratos entre serviços para Sprint 0.
**Aria recomenda:** Polyglot (Python para AI/ML, TS para gateway/biz logic).

---

## 14. Resumo Executivo (para handoff @po + @pm)

| Decisão | Recomendação Aria | Status |
|---|---|---|
| Posicionamento | Wellness MVP + safety SaMD-grade + pista Class IIa Phase 2 | **P0 user decide** |
| Memory layer | Mem0 managed/OSS via adapter (Letta fica Phase 2) | **P0 user decide** |
| Backend stack | Polyglot: TS API + Python agent-service | **P0 user decide** |
| LLM router | GPT-5 default, Claude 4.5 fallback, local Phase 2 | Aprovado por padrão |
| Multi-tenant | Soft-tenancy `tenant_id` + RLS; hard-tenancy só quando contrato exigir | Aprovado por padrão |
| Observability | Langfuse self-host BR + Sentry + pino + OTEL | Aprovado por padrão |
| Deployment | Supabase Cloud + Vercel + Railway/Fly MVP; VPS BR Phase 2 gatilhada | Aprovado por padrão |
| Crisis Engine | Pipeline 3-stage + HITL + audit imutável + integration CVV 188 / SAMU 192 / CAPS | Aprovado por padrão — NON-NEGOTIABLE |

**Próximos passos:**
1. User decide D-01, D-02, D-03.
2. Sprint 0 abre: 3 spikes paralelos (S1, S2, S3).
3. @po refina stories Epic 1 (foundation) com base em ADRs aprovados.
4. @data-engineer revisa esquema multi-tenant + pgvector spike.
5. @qa monta eval datasets (crisis + empatia + refusal) para Langfuse.

---

**Aria assinatura:**
*"Arquitetura não é o que você desenha — é o que sobrevive quando o mundo real chega. Em Anipis, o mundo real chega ago/2026 (CFM 2.454) e quando o primeiro paciente em crise digitar suicide ideation. As duas datas valem mais que qualquer diagrama. Tudo aqui é desenhado para sobreviver às duas."*

— Fim do deliverable —
