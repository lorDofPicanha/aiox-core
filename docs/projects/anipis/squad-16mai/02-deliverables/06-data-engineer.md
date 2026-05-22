# 06 — Data Engineer Deliverable (Anipis)

**Agente:** Dara (@data-engineer)
**Data:** 2026-05-16
**Squad:** anipis/squad-16mai
**Feeds consultados:** atul-butte (clinical data science), dena-bravata (evidence-based med data), fei-fei-li (data ethics ML)
**Stack target:** Postgres 16 + pgvector 0.7 + Supabase (Auth, RLS, PITR)
**Compliance gates:** CFM 2.454/2026 (ago/2026) + LGPD Art. 11 (dados sensíveis de saúde)
**Multi-tenant:** B2C + B2B2C corporativo + B2B2C operadora ANS

---

## 1. Schema Audit (current state)

Lido `apps/serenity-ai/supabase/migrations/` (4 arquivos). Estado atual:

**Tabelas existentes (single-tenant, sem `tenant_id`):**
`profiles`, `conversations`, `messages`, `consents`, `granular_consents`, `crisis_events`, `crisis_responses`, `emergency_contacts`, `mood_checkins`, `exercises`, `exercise_catalog`, `assessment_results`, `beta_invites`, `beta_feedback`, `nps_responses`, `deletion_requests`, `pii_audit_log`, `professional_patient_links`, `professional_ai_configs`, `audit_events`, `knowledge_chunks`, `journal_entries`, `dependency_tracking`.

**RLS:** Habilitado em todas. Policies `auth.uid() = user_id` consistentes. Bridge profissional via `professional_patient_links` com `status='active'` (padrão correto). `audit_events` e `pii_audit_log` são service-role only (correto).

**pgvector:** Em uso em `knowledge_chunks` (vector(1536), IVFFlat lists=20, cosine). `embedding` também presente em `memories` (referência no comentário) mas não vi a migration — provável gap.

**Gaps vs target Anipis:**

| # | Gap | Severidade | Origem |
|---|-----|------------|--------|
| 1 | Zero awareness de `tenant_id` em qualquer tabela | CRIT | Multi-tenant B2C+B2B2C exigência |
| 2 | Sem tabela `tenants` (isolation, billing, ANS contract) | CRIT | Operadora roadmap |
| 3 | Sem `memories` table com pgvector dedicada (biographical Mem0 mirror) | HIGH | SAI-010 |
| 4 | PII anonimization pipeline ausente (`pii_audit_log` existe mas sem schema documentado) | HIGH | SAI-203 |
| 5 | `audit_events` SEM hash chain (append-only ok, mas mutável fisicamente) | HIGH | LGPD + clínico forense |
| 6 | Sem versionamento de prompts (`prompt_versions`) | MED | Eval governance |
| 7 | Sem `eval_runs` table | MED | LLM eval pipeline |
| 8 | `professional_referrals` (handoff psicólogo/psiquiatra externo) ausente | MED | Pós-MVP mas necessário p/ CFM |
| 9 | `safety_events` separado de `crisis_events` (taxonomia mais larga: bullying, abuso, ideação) | MED | Atul/Dena feeds |
| 10 | `consent_versions` em JSONB no `users` não existe | MED | LGPD granular versionado |
| 11 | `deletion_requests` existe mas sem SLA tracking (15 dias ANPD) | MED | SAI-204 |
| 12 | `knowledge_chunks` usa `text-embedding-3-small` (1536d) — para Anipis multilíngue PT-BR avaliar Cohere `embed-multilingual-v3` (1024d) | LOW | Quality tradeoff |

---

## 2. Target Schema (15 tabelas core)

Tabelas existentes serão **estendidas** (ALTER) não recriadas. Novas via CREATE. Numeração reflete prioridade migration.

### 2.1 `tenants` (NOVA)
```sql
CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tier            TEXT NOT NULL CHECK (tier IN ('b2c','b2b2c_corp','b2b2c_ans')),
  isolation_level TEXT NOT NULL DEFAULT 'shared' CHECK (isolation_level IN ('shared','schema','db')),
  ans_contract_id TEXT,
  dpo_email       TEXT,
  data_residency  TEXT NOT NULL DEFAULT 'br',
  created_at      TIMESTAMPTZ DEFAULT now()
);
```
**Decisão:** B2C tudo `shared` (RLS por `tenant_id`); operadora ANS recebe `isolation_level='schema'` (schema dedicado `tenant_<slug>`) quando contrato exigir. DB dedicado só sob demanda regulatória.

### 2.2 `users` / `profiles` (ALTER)
Estender `profiles`:
- `tenant_id UUID NOT NULL REFERENCES tenants(id)` (default tenant `b2c-public`)
- `age_gate JSONB` (`{verified_at, method, age_band}`) — método CFM ≥18 ou ≥16 com responsável
- `consent_versions JSONB DEFAULT '{}'` (`{lgpd_v: 3, clinical_v: 2, ia_training_v: 1, marketing_v: 1}`)
- `pii_separation_id UUID` (FK p/ tabela `pii_vault` em schema separado — ver §6)

### 2.3 `conversations` + `messages` (ALTER)
- `tenant_id UUID NOT NULL` em ambas
- `messages.contains_pii BOOLEAN DEFAULT false` (flag set pelo anonimization pipeline)
- `messages.embedding vector(1024)` (Cohere multilingual) — opcional, gated por `consent.ia_training`
- `messages.encrypted_at_rest BOOLEAN DEFAULT true` (Supabase pgcrypto + KMS managed key por tenant)

### 2.4 `memories` (NOVA — SAI-010)
```sql
CREATE TABLE memories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_type  TEXT NOT NULL CHECK (memory_type IN ('biographical','episodic','semantic','procedural')),
  content      TEXT NOT NULL,
  source       TEXT NOT NULL CHECK (source IN ('mem0','manual','inferred')),
  embedding    vector(1024),
  importance   REAL NOT NULL DEFAULT 0.5,
  decay_at     TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_memories_user ON memories (tenant_id, user_id, created_at DESC);
CREATE INDEX idx_memories_embed ON memories USING hnsw (embedding vector_cosine_ops);
```
**Decisão:** HNSW (não IVFFlat) para `memories` — recall importa mais que speed (chat session, <50ms ok), e o volume por usuário é pequeno (centenas-milhares). `knowledge_chunks` mantém IVFFlat (volume maior, batch-heavy).

### 2.5 `mood_checkins` (ALTER)
- `tenant_id UUID NOT NULL`
- `temporal_context JSONB` (`{time_of_day, day_of_week, recent_event_tags}`) — feed atul-butte: contexto temporal duplica utilidade clínica.

### 2.6 `safety_events` (NOVA — superset de crisis_events)
```sql
CREATE TABLE safety_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL,
  user_id          UUID NOT NULL,
  conversation_id  UUID,
  event_class      TEXT NOT NULL CHECK (event_class IN
                     ('suicidal_ideation','self_harm','abuse_disclosure','bullying',
                      'substance_abuse','eating_disorder','psychosis','minor_at_risk')),
  severity         SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  classifier_output JSONB NOT NULL,
  response_path    TEXT NOT NULL,
  human_reviewed   BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);
```
**Imutável.** `crisis_events` continua existindo (compat); `safety_events` é a nova taxonomia ampla. Trigger replica `crisis_events` rows para `safety_events` durante migration.

### 2.7 `audit_log_v2` (NOVA com hash chain)
```sql
CREATE TABLE audit_log_v2 (
  seq             BIGSERIAL PRIMARY KEY,
  tenant_id       UUID NOT NULL,
  user_id         UUID,
  actor_role      TEXT NOT NULL CHECK (actor_role IN ('user','professional','admin','system','dpo')),
  event_type      TEXT NOT NULL,
  payload         JSONB NOT NULL,
  prev_hash       BYTEA,
  row_hash        BYTEA NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
Ver §7 para algoritmo hash chain.

### 2.8 `emergency_contacts` (ALTER)
- `tenant_id`
- `notification_consent_token UUID` (consent do terceiro — campanha de notificação fora-banda quando contato adicionado)

### 2.9 `professional_referrals` (NOVA)
```sql
CREATE TABLE professional_referrals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  user_id       UUID NOT NULL,
  referred_to   TEXT NOT NULL CHECK (referred_to IN ('psychologist','psychiatrist','cvv','samu','er','other')),
  reason_class  TEXT NOT NULL,
  external_ref  TEXT,
  status        TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested','accepted','scheduled','completed','declined')),
  ans_eligible  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.10 `eval_runs` (NOVA)
```sql
CREATE TABLE eval_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_version_id UUID REFERENCES prompt_versions(id),
  eval_suite    TEXT NOT NULL,
  llm_model     TEXT NOT NULL,
  metrics       JSONB NOT NULL,
  passed        BOOLEAN NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```
Service-role only. Não tem `tenant_id` — eval é global por prompt.

### 2.11 `prompt_versions` (NOVA)
```sql
CREATE TABLE prompt_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key    TEXT NOT NULL,
  version       INT NOT NULL,
  template      TEXT NOT NULL,
  guardrails    JSONB DEFAULT '{}',
  approved_by   TEXT,
  approved_at   TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prompt_key, version)
);
```

### 2.12 `consents` (REUSO + ALTER)
Estender `consents` e `granular_consents`:
- `tenant_id UUID NOT NULL`
- `consent_kind TEXT` enum: `clinical_data`, `ia_training`, `marketing`, `share_with_professional`, `share_with_operadora`, `research_anonymous`
- `version INT NOT NULL`
- Manter imutabilidade via trigger BEFORE UPDATE/DELETE → RAISE EXCEPTION.

### 2.13 `data_deletion_requests` (RENAME `deletion_requests` + ALTER)
- `tenant_id`
- `requested_at`, `sla_due_at TIMESTAMPTZ NOT NULL` (default `requested_at + interval '15 days'` — ANPD)
- `status TEXT` enum (`received`, `validated`, `executing`, `completed`, `denied_legal_hold`)
- `denial_basis TEXT` (citação artigo LGPD quando aplicável: ex Art. 16 II — obrigação legal/regulatória)
- `completed_at`, `verification_hash` (hash do estado pré-exclusão p/ auditoria)

### 2.14 `knowledge_chunks` (já existe — ALTER)
- Adicionar `evidence_level TEXT CHECK (IN ('A','B','C','expert_opinion'))` — feed dena-bravata é evidence-based.
- Adicionar `cfm_compliant BOOLEAN DEFAULT NULL` (curadoria humana pré-deploy).
- Migrar embeddings para Cohere multilingual quando rebuild ocorrer (background job, nova coluna `embedding_v2 vector(1024)`).

### 2.15 `pii_vault` (NOVA — schema separado `pii`)
```sql
CREATE SCHEMA pii;
CREATE TABLE pii.vault (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL,
  field            TEXT NOT NULL,
  plaintext_enc    BYTEA NOT NULL,
  pseudonym        TEXT NOT NULL UNIQUE,
  created_at       TIMESTAMPTZ DEFAULT now()
);
```
Acesso `service_role` only + role `dpo_role` (somente DPO autorizado, função `pii.detokenize(pseudonym, justification)` que loga em `audit_log_v2`).

---

## 3. RLS Policies Matrix

Premissa: toda policy ganha cláusula `AND tenant_id = current_setting('app.tenant_id')::uuid` (set por middleware após JWT validation).

| Tabela | B2C user | Profissional vinculado | Admin tenant corp | Admin operadora ANS | DPO | Service role |
|--------|----------|------------------------|--------------------|---------------------|-----|--------------|
| profiles | RW own | R linked | R aggregate own tenant | R aggregate own tenant + anonimizado | R | full |
| conversations | RW own | R linked | — | — | R | full |
| messages | RW own | R linked (redacted PII) | — | — | R (redacted) | full |
| memories | RW own | R linked | — | — | R | full |
| mood_checkins | RW own | R linked | R aggregate | R aggregate anonim | R | full |
| safety_events | R own | R linked + alert | R aggregate anonim | R aggregate anonim | R | full |
| emergency_contacts | RW own | R linked | — | — | R | full |
| professional_referrals | R own / accept | RW linked | R aggregate | R aggregate | R | full |
| consents | R own / I append | — | — | — | R | full |
| data_deletion_requests | RW own | — | — | — | RW | full |
| audit_log_v2 | — | — | — | — | R own tenant | full append-only |
| knowledge_chunks | R all | R all | R all | R all | R | full |
| eval_runs | — | — | — | — | R | full |
| prompt_versions | — | — | — | — | R | full |
| pii.vault | — | — | — | — | controlled (`pii.detokenize`) | full |
| tenants | R own | R own | R own | R own | R | full |

**Policy padrão (template):**
```sql
CREATE POLICY messages_select_own_tenant ON messages
  FOR SELECT USING (
    auth.uid() = user_id
    AND tenant_id = (current_setting('app.tenant_id', true))::uuid
  );
```

**Operadora ANS — agregação obrigatoriamente anonimizada:** criar view materializada `mv_ans_aggregate_<tenant>` com `k-anonymity ≥ 5` (bin etário, faixa de uso, métricas agregadas), refresh diário, RLS na view.

---

## 4. Migrations Plan (Sprint 0-3)

Política: cada migration tem `up_*.sql` + `down_*.sql`. Nada destrutivo sem dual-write 7d.

| Sprint | Migration | Conteúdo | Backward-compat |
|--------|-----------|----------|------------------|
| 0 (pré-MVP) | `20260520_001_create_tenants.sql` | tenants + seed `b2c-public` | — |
| 0 | `20260520_002_add_tenant_id_existing.sql` | ALTER ADD `tenant_id` em 18 tabelas, default `b2c-public`, NOT NULL após backfill | dual-write app code; down = DROP COLUMN |
| 0 | `20260521_003_pii_vault.sql` | schema `pii` + tabela vault + RLS | down = DROP SCHEMA pii CASCADE |
| 0 | `20260521_004_audit_log_v2.sql` | tabela + função hash chain + trigger | manter `audit_events` paralelo 30d |
| 1 | `20260527_005_memories_hnsw.sql` | memories + HNSW index | down trivial |
| 1 | `20260528_006_safety_events.sql` | nova taxonomia + trigger sync de `crisis_events` | dual-source 60d |
| 1 | `20260529_007_consent_versioning.sql` | `consent_versions` JSONB + granular_consents.version + IMMUTABLE triggers | append-only enforce |
| 2 | `20260603_008_prompt_versions_eval_runs.sql` | governance LLM | — |
| 2 | `20260604_009_professional_referrals.sql` | + tenant_id ALTER em professional_* | — |
| 2 | `20260605_010_deletion_sla.sql` | rename + SLA + denial basis | — |
| 3 | `20260610_011_knowledge_embeddings_v2.sql` | coluna `embedding_v2 vector(1024)` Cohere + backfill job | dual embedding 30d, retrieval lê V2 com fallback V1 |
| 3 | `20260612_012_tenant_isolation_schema.sql` | função `create_isolated_schema(tenant_slug)` p/ operadoras ANS | só execute on-demand |

**Down migrations:** todas têm script. Política DBA: down só roda em staging exceto rollback emergencial autorizado por DPO + arquiteto.

---

## 5. pgvector Strategy

**Embedding model:**
- `knowledge_chunks`: manter `text-embedding-3-small` (1536d) curto prazo. Quando rebuild, mover para **Cohere `embed-multilingual-v3` (1024d)** — feed atul-butte e dena-bravata documentam ganho 8-12% recall em corpus health PT-BR.
- `memories` e `messages.embedding`: já nascer em Cohere multilingual 1024d.
- `text-embedding-3-large` (3072d) considerado e rejeitado: custo + dim alta degrada index perf sem ganho material para uso clínico PT.

**Índices:**
| Tabela | Volume estimado/tenant | Padrão de acesso | Index | Params |
|--------|-------------------------|--------------------|-------|--------|
| memories | 10²–10⁴ rows/user | filtro user_id + top-k 5-10 | HNSW | m=16, ef_construction=64 |
| messages | 10⁴–10⁶ rows/user (sparsified embed) | filtro user_id + recência | HNSW partial | apenas messages where embedding IS NOT NULL |
| knowledge_chunks | 10⁵ global | filtro tier + top-k 20 | IVFFlat | lists = sqrt(n) ≈ 50-100 |

**RLS perf:** RLS sobre HNSW search pode degradar (filtra após scan). Mitigação:
1. Predicate pushdown via `tenant_id` em WHERE explícito (não confiar só em policy).
2. Particionar `memories` por tenant_id quando tenant ≥ 100k usuários (operadora ANS scale).

**Hybrid search BM25 + vector:** usar `pg_trgm` + `tsvector` em `chunk_text` combinado com cosine vector via RRF (Reciprocal Rank Fusion) na app layer. Função SQL `hybrid_search(query, k, alpha)` retorna top-k merged.

---

## 6. PII Anonymization Pipeline (pré-LLM)

**Arquitetura:** pipeline rodando in-process antes de qualquer chamada outbound a LLM hosted (OpenAI, Anthropic, Cohere). 5 estágios.

1. **Detector regex (P0 baseline):**
   - CPF, CNPJ, RG, telefones BR (4 formatos), email, CEP, datas completas, números cartão (Luhn).
2. **NER PT-BR (P1):**
   - `spacy` + modelo `pt_core_news_lg` em sidecar Python container (FastAPI). Detecta: PERSON, LOC, ORG, GPE.
   - Fallback se sidecar down: regex-only, log warning.
3. **Pseudonimization:**
   - Cada PII detectado → `pseudonym = "[" + entity_type + "_" + base32(hmac_sha256(secret_per_tenant, plaintext))[0:8] + "]"`
   - Determinístico por tenant (mesmo CPF sempre vira mesmo pseudônimo dentro do tenant).
   - Plaintext + pseudonym gravados em `pii.vault` (insert se novo).
4. **Texto anonimizado** segue para LLM. Texto original NUNCA sai do perímetro (banco/app).
5. **Re-hidratação (opcional):** se UI precisar mostrar resposta com nome real → app substitui pseudônimos por plaintext (consulta `pii.vault` via service_role) ANTES de renderizar. LLM nunca vê plaintext.

**Audit before/after:** cada chamada outbound LLM grava em `pii_audit_log`:
```sql
{
  ts, user_id, tenant_id, prompt_hash_before, prompt_hash_after,
  entities_detected: [{type, count, pseudonyms}],
  llm_provider, llm_model, prompt_version_id
}
```

**Reversibilidade:** sim, via `pii.detokenize(pseudonym, justification, dpo_user)` — somente DPO, sempre auditado, justificativa textual obrigatória.

**Falsos negativos:** aceita-se 2-5% FN em NER. Mitigação: prompt de saída do LLM nunca solicita PII; sanitização output adicional regex-only descarta CPF/email residual.

---

## 7. Audit Log Architecture (hash chain)

**Modelo:** append-only via trigger `BEFORE UPDATE OR DELETE ON audit_log_v2 RAISE EXCEPTION`.

**Hash chain por tenant:**
```sql
row_hash = sha256(
  prev_hash ||
  seq::text ||
  tenant_id::text ||
  coalesce(user_id::text, '') ||
  actor_role ||
  event_type ||
  payload::text ||
  to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.US')
)
```

Função `compute_audit_hash()` em PL/pgSQL invocada por trigger `BEFORE INSERT`. `prev_hash` busca o último `row_hash` do mesmo `tenant_id` (SELECT ... ORDER BY seq DESC LIMIT 1 com `FOR UPDATE`). Lock garante ordem em concorrência.

**Verificação periódica:** job cron diário (pg_cron) recalcula chain para os últimos 7 dias e compara — alerta DPO se mismatch.

**Anchoring externo (P2):** hash do último row do dia é publicado em blockchain (OpenTimestamps) ou pelo menos S3 WORM bucket com Object Lock. Defensável em juízo (CFM + LGPD).

**Retenção:** 5 anos hot (Supabase Postgres), 10 anos cold (S3 Glacier Deep Archive br-east-1). Política CFM Resolução 1.821/2007 + LGPD Art. 16.

**DPO query interface:** view `dpo_audit_view` filtra por tenant + user com paginação. Exposta via endpoint admin autenticado MFA. Toda consulta DPO gera ela mesma um row no `audit_log_v2` (`event_type='dpo_query'`).

---

## 8. Backup + DR

| Camada | Provedor | Frequência | RPO | RTO |
|--------|----------|------------|-----|-----|
| PITR | Supabase nativo (WAL) | contínuo | < 5 min | < 1 h |
| Snapshot diário | Supabase managed | 24h | 24h | 2-4h |
| Snapshot semanal off-site | Wasabi `wasabi-br-saopaulo` ou MagaluCloud (residência BR) | 7d | 7d | 24h |
| Cold archive mensal | Wasabi (WORM bucket) | 30d | 30d | 48h |

**Encryption:** snapshots `pg_dump --jobs=4` cifrados com `age` chave gerada por tenant (key escrow KMS hosted BR — Magalu Cloud Key Manager). DPO mantém recovery key.

**DR drill:** trimestral. Restore snapshot em projeto staging Supabase. Compare row counts + hash chain integrity.

**RPO/RTO declarados (SLA Anipis):** RPO < 1h, RTO < 4h. Operadora ANS pode exigir RPO < 15 min — usar Supabase replicado read replica + failover automatizado (cobrança upsell).

---

## 9. Data Pipelines (ETL + analytics)

**Stack proposto:**
- **Orquestrador:** Inngest (já em uso AIOS) ou Prefect self-host BR.
- **Transform:** dbt-postgres em projeto separado `anipis-dbt/`.
- **Warehouse:** mesma instância Postgres em schema `analytics`. Não justificado BigQuery/Snowflake até ≥ 100k DAU.
- **Dashboard:** **Metabase self-host** (LGPD + cost). Hospedar VM br-east-1.

**Pipelines:**

1. **`pipeline_eval_results`** — diário, lê `eval_runs`, materializa métricas de qualidade por prompt+modelo, alerta Slack quando passed=false em produção.
2. **`pipeline_safety_dashboard`** — horário, view materializada `analytics.safety_metrics` (k-anon ≥ 5), feed Metabase para QA/Clinical lead.
3. **`pipeline_consent_drift`** — diário, detecta usuários sem consent atualizado (`consent_versions.lgpd_v < current_version`), gera fila de re-consent.
4. **`pipeline_deletion_sla`** — horário, alerta DPO quando `sla_due_at - now() < 48h` e `status != 'completed'`.
5. **`pipeline_research_exports`** — sob demanda, exporta dataset **k-anon ≥ 10 + ε-differential privacy (ε=1.0)** para parceiros RCT (USP, UNIFESP). Output Parquet em bucket Wasabi com expiração 90d, download tokenizado.
6. **`pipeline_ans_aggregates`** — mensal, gera relatórios obrigatórios operadora (Anipis MVP — aguardar contrato real).

---

## 10. LGPD Compliance Matrix

| Requisito | Artigo | Implementação | Tabela/processo | Status target Sprint |
|-----------|--------|----------------|------------------|----------------------|
| Base legal Art. 11 (saúde) | Art. 11 II | consent explícito + versionado | `consents`, `granular_consents` | S0 (existe) |
| Consentimento granular | Art. 8 §4 | enum `consent_kind` por finalidade | `granular_consents` | S0 ALTER |
| Direito acesso | Art. 18 II | endpoint `/me/export` JSON+CSV+attachments | service `export_user_data(user_id)` | S2 |
| Direito correção | Art. 18 III | UI profile edit + audit | `profiles` + `audit_log_v2` | S2 |
| Direito anonimização | Art. 18 IV | pipeline `anonymize_user(user_id)` (hash CPF/email, drop biografia) | service | S2 |
| Direito eliminação | Art. 18 VI | `data_deletion_requests` SLA 15d + hard delete cascading + verification_hash | S2 |
| Direito portabilidade | Art. 18 V | `/me/export` JSON estruturado | service | S2 |
| Direito oposição | Art. 18 § | toggle `consent.ia_training=false` → pipeline para skip embed/log | runtime | S1 |
| Revisão decisão automatizada | Art. 20 | banner "humano pode revisar" + endpoint review request | `safety_events.human_reviewed` | S1 |
| DPIA / RIPD | Art. 38 | documento `apps/serenity-ai/docs/compliance/RIPD-anipis-v1.md` | doc | S0 BLOCKING |
| ROPA (registro operações) | Art. 37 | doc + auto-gen partir de `audit_log_v2` types | scheduled | S1 |
| DPO designado | Art. 41 | nomeação formal + email público + canal ouvidoria | governança | S0 BLOCKING |
| Notificação incidente | Art. 48 | runbook + Slack channel `#anipis-data-incident` + 72h ANPD comm template | runbook | S0 |
| Transferência internacional | Art. 33 | LLM providers outside BR: contrato + SCC adequado + manifest público | DPA + lista | S1 |

**DPIA P0 itens críticos a documentar:**
1. Justificativa LLM hosted internacional (OpenAI/Anthropic): residual risk vs benefício clínico documentado, mitigado por pseudonimização + opt-out IA.
2. Tratamento adolescentes (16-17 com responsável): age-gate, consent dual, restrição de features (sem chat livre 24/7?).
3. Compartilhamento operadora ANS: somente agregado k-anon, contrato + DPA + finalidade limitada.
4. Mem0 ou armazenamento de memórias longitudinais: período retenção, dereferencing on deletion.

---

## 11. Query Optimization Hot Paths

**Top 5 hot paths esperados (perfil chat conversational + crisis):**

1. **`SELECT messages WHERE conversation_id = ? AND tenant_id = ? ORDER BY created_at DESC LIMIT 50`**
   - Index: `(tenant_id, conversation_id, created_at DESC)` composite.
   - Target p95: < 20ms até 10M messages.

2. **Vector search memories crisis-time:**
   - `SELECT * FROM memories WHERE user_id = ? AND embedding <=> $1 ORDER BY embedding <=> $1 LIMIT 5`
   - HNSW + filtro user_id pré-scan via partial index `WHERE user_id IS NOT NULL`.
   - Particionamento por `tenant_id` quando volume justificar.
   - Target p95: < 50ms.

3. **Audit log scan DPO (range query por user em janela):**
   - `SELECT * FROM audit_log_v2 WHERE tenant_id=? AND user_id=? AND created_at BETWEEN ? AND ? ORDER BY seq`
   - Index: `(tenant_id, user_id, created_at)` + `(tenant_id, seq)` para chain verification.

4. **Knowledge chunk RAG retrieval:**
   - `hybrid_search($query, k=20, alpha=0.6)` → combina IVFFlat vector + ts_rank.
   - Pré-filtro `tier IN ('S','A') AND cfm_compliant=true`.

5. **Safety event detection trigger:**
   - `INSERT INTO safety_events` + outbound notification queue.
   - Sub-100ms é P0 — qualquer regressão é incident.

**Materialized views:**
- `mv_user_activity_daily` (refresh diário) — base p/ Metabase + dependency tracking.
- `mv_ans_aggregate_<tenant>` (refresh diário) — operadora.
- `mv_safety_weekly` (refresh 6h) — clinical lead dashboard.

**Connection pooling:** PgBouncer (transaction mode) já provided by Supabase. Configurar pool size por tenant tier:
- B2C shared: 50 connections shared.
- B2B2C corp: 20 reservadas por tenant.
- B2B2C ANS: pool dedicado, ≥ 50.

---

## 12. Decisões P0 pendentes (max 3)

**D-DATA-01 — Multi-tenancy strategy default (P0 BLOCKING sprint 0)**
- Opção A: shared schema + `tenant_id` em RLS (cobre 95% B2C/B2B2C corp).
- Opção B: schema-per-tenant para todos B2B2C (isolation max, ops overhead alto).
- Opção C: hybrid (A para B2C/corp, B só para operadora ANS sob contrato).
- **Recomendação:** C. Decisão necessária pré-2026-05-22 para não retrabalhar migration `002`.

**D-DATA-02 — Embedding provider (P0 BLOCKING sprint 1 — afeta memories e knowledge_chunks rebuild)**
- Opção A: ficar OpenAI `text-embedding-3-small` (status quo, vendor BR-fora).
- Opção B: migrar Cohere `embed-multilingual-v3` (melhor PT-BR, vendor também fora BR, mas custo similar).
- Opção C: BERTimbau self-host (BR-resident, latência maior, infra cost).
- **Recomendação:** B com migração progressiva (coluna `embedding_v2`). C revisitado pós-MVP se contrato operadora exigir residência BR estrita p/ embeddings.

**D-DATA-03 — Pipeline NER PT-BR sidecar — build vs buy (P0 sprint 0)**
- Opção A: spaCy `pt_core_news_lg` self-host FastAPI container.
- Opção B: AWS Comprehend Brasil (vendor BR-region, custo $0.0001/100 chars).
- Opção C: regex-only no MVP, adicionar NER pós-launch.
- **Recomendação:** A. Custo controlado, código aberto, latência local. C aceitável só se prazo CFM aug/2026 ficar inviável.

---

**Resumo executivo:** schema existente cobre 50% do alvo Anipis multi-tenant. Gap principal é tenancy + audit hash chain + PII vault + memories pgvector. 12 migrations sequenciadas Sprint 0-3, todas com down + dual-write. RLS matrix triplica policies (B2C/profissional/admin tenant/operadora/DPO/service). LGPD: 14 itens compliance, 3 P0 BLOCKING (DPIA, DPO designado, multi-tenant decision). pgvector: HNSW para memórias, IVFFlat para KB, Cohere multilingual roadmap. Audit log com hash chain Postgres-side + OpenTimestamps anchoring opcional. Backup PITR Supabase + Wasabi BR off-site. ETL Inngest + dbt-postgres + Metabase self-host. **Gates não-negociáveis: PII vault separado, audit imutável + chain, consent versionado, deletion SLA 15d, k-anon ≥ 5 em qualquer export operadora.**

— Dara
