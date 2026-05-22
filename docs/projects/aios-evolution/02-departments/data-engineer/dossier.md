---
squad: data-engineer (Dara)
date: 2026-05-14
phase: 2
gap_target: L1 (memory consolidation) + L3 (pruning)
sources_count: 10+
---

# 🗄️ Dossier @data-engineer — Memory Tier Architecture for AI Agents 2026

## 1. Princípios fundamentais

### 1.1 Tiered memory inspirado em OS memory

| Tier | Análogo | Função | Latency |
|------|---------|--------|---------|
| **Core memory** | RAM | Sempre no context window do LLM | 0 (in-context) |
| **Recall memory** | Disk cache | Conversation history searchable | ~50-200ms |
| **Archival memory** | Cold storage | External vector store, query explícito | ~200-500ms |

**Insight 2026:** Core memory deve ser COMPACT — pruning agressivo + reflection-based importance scoring antes de promover.

### 1.2 Hybrid store pattern (consenso 2026)

```
┌──────────── Single Postgres ────────────┐
│                                          │
│  pgvector  → embeddings (semantic)       │
│  graph tables → entity relationships     │
│  temporal indexes → fact lifespans       │
│  KV columns → fast lookups               │
│                                          │
└──────────────────────────────────────────┘
         ↑
    4 retrieval strategies em paralelo:
    - semantic search (vector)
    - entity-based (graph)
    - temporal filtering
    - graph traversal
```

> "If you're on PostgreSQL and under 10M vectors, add pgvector before adding a new database. Vectors and relational data in the same transaction, zero new infrastructure."

### 1.3 Quando NÃO migrar pra vector DB dedicada

| Critério | Use pgvector | Use dedicada (Qdrant/Milvus) |
|----------|--------------|-------------------------------|
| Vetores < 10M | ✅ | Overkill |
| Já roda Postgres | ✅ | Nova infra desnecessária |
| Precisa join com relational | ✅ | Requires ETL bridge |
| p99 < 15ms obrigatório | ❌ | ✅ |
| Workload puramente vector | ⚠️ Aceitável | ✅ Melhor |

### 1.4 Aplicação AIOS — gaps L1 + L3

**Estado atual AIOS:**
- Memory dispersa: `.claude/agent-memory/{agent}/MEMORY.md` (markdown plano), `D:/jarvis/bridge-data` (SQLite ad-hoc), HYDRA `dedup-store` (SQLite com vetores)
- Sem consolidation cross-agent (mesma feedback rule pode estar em 3 memorys)
- Sem pruning automatizado (MEMORY.md cresce indefinidamente)

**Proposta tier 1 (mínima viável):**
1. Migrar MEMORY.md de markdown → pgvector (1 Postgres central)
2. Schema:
   ```sql
   CREATE TABLE agent_memory (
     id UUID PRIMARY KEY,
     agent_id TEXT NOT NULL,
     type TEXT NOT NULL, -- user/feedback/project/reference
     content TEXT,
     embedding vector(1536),
     created_at TIMESTAMP,
     last_referenced_at TIMESTAMP,
     reference_count INT DEFAULT 0,
     archived BOOLEAN DEFAULT false
   );
   CREATE INDEX ON agent_memory USING hnsw (embedding vector_cosine_ops);
   ```
3. Cross-agent dedup: cron `aios memory consolidate` que:
   - Encontra entries com cosine similarity > 0.9 entre agents diferentes
   - Promove para `playbook_shared` (visível a todos os agents)
   - Marca originals como `superseded_by={playbook_id}`
4. Pruning: `last_referenced_at < NOW() - 60 days AND reference_count < 2` → archived=true (não deletar; permite review)

### 1.5 Migration path (não-disruptivo)

```
Fase A (1 sprint): pgvector em paralelo, MEMORY.md continua master
Fase B (1 sprint): hooks copy-on-write — toda atualização escreve em ambos
Fase C (1 sprint): MEMORY.md torna-se cache derivado (read-only render)
Fase D (1 sprint): MEMORY.md deprecated, aios CLI reads pgvector
```

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Migrar tudo pra vector DB dedicada quando pgvector basta | Infra cost + operational complexity |
| Sem temporal indexes (memory atemporal) | Stale facts permanecem high-relevance |
| Single-tier (tudo "long-term") | Context window inundado, pruning impossível |
| Dedupe só por hash exato | Perde 80% dos duplicados semânticos |

## 3. Quiz

**Q1.** Quais os 3 tiers de memory inspirados em OS? Quando promover de um pro outro?

**Q2.** Por que pgvector primeiro, vector DB dedicada depois? Cite 2 thresholds críticos.

**Q3.** O AIOS tem qual problema de consolidation hoje? Cite 1 exemplo concreto.

**Q4.** Descreva o schema pgvector que você criaria pra agent_memory. Quais campos críticos pra pruning?

**Q5.** Migration de MEMORY.md (markdown) → pgvector deve ser big-bang ou faseado? Justifique com risco.

**Q6.** Verdadeiro ou falso: "Cosine similarity > 0.9 entre 2 entries SEMPRE significa duplicação." Justifique.

## 4. Fontes

- [Best Vector Databases 2026 — MarkTechPost](https://www.marktechpost.com/2026/05/10/best-vector-databases-in-2026-pricing-scale-limits-and-architecture-tradeoffs-across-nine-leading-systems/)
- [Case Against External Vector DBs — Hindsight](https://hindsight.vectorize.io/blog/2026/05/12/case-against-external-vector-dbs-agent-memory)
- [Best AI Agent Memory Systems 2026 — Vectorize](https://vectorize.io/articles/best-ai-agent-memory-systems)
- [Vector Database Benchmarks 2026 — CallSphere](https://callsphere.ai/blog/vector-database-benchmarks-2026-pgvector-qdrant-weaviate-milvus-lancedb)
- [State of AI Agent Memory 2026 — Mem0](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [State of AI Agent Memory Research — DEV Community](https://dev.to/vektor_memory_43f51a32376/the-state-of-ai-agent-memory-in-2026-what-the-research-actually-shows-3aja)

## 5. Pass criteria

- 5/6 corretas; Q3 obrigatório citar exemplo real (cross-agent duplication ou MEMORY.md size); Q4 obrigatório schema com pruning fields
- Failure → re-study 1.2 + 1.4, re-quiz Q3+Q4
