# Arquitetura — Esqueleto Preliminar (V0)

**Status:** 📝 DRAFT (será reescrito após research completar com escolhas justificadas)
**Princípio orientador:** Maior boring tech possível. Cada componente extra precisa pagar seu custo de complexidade.

---

## Decisões já travadas pelo CONTEXT

- **Escopo geo:** Águas Lindas-GO + DF → ~5-12 portais-fonte (não 5000)
- **Volume estimado:** 50-500 editais/dia (ordem de grandeza, validar)
- **Persona:** Uso pessoal + amigo fornecedor → 1-10 usuários iniciais
- **Compliance:** LGPD desde o dia 1
- **Custo:** $0-15/mês fase pessoal, escalando se virar produto

## Estrutura de Camadas (proposta)

```
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 1: INGESTÃO (Crawlers + APIs)                          │
│  ─ PNCP API client (oficial JSON)                              │
│  ─ ComprasGov scraper (Playwright)                             │
│  ─ e-Compras DF scraper                                        │
│  ─ Águas Lindas / DODF watcher                                 │
│  ─ Goiás portal (se houver)                                    │
│  Cron: 30min - 6h (por portal, baseado em volume)              │
└────────────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 2: NORMALIZAÇÃO (ETL)                                  │
│  ─ Schema canônico interno (subset OCDS + extensões BR)        │
│  ─ Dedup por hash de objeto + órgão + data                     │
│  ─ Validação Zod                                               │
│  ─ Persistência Postgres                                       │
└────────────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 3: ENRIQUECIMENTO (LLM/NLP)                            │
│  ─ Download PDF do edital                                      │
│  ─ Parse PDF → texto/markdown (LlamaParse OU Unstructured)     │
│  ─ Resumo executivo (Claude Sonnet 4.x — 300 tokens)           │
│  ─ Classificação CNAE (embeddings + threshold)                 │
│  ─ Extração de campos chave (prazo, valor, requisitos)         │
│  ─ Embeddings p/ busca semântica (text-embedding-3-small)      │
└────────────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 4: INDEXAÇÃO + BUSCA                                   │
│  ─ Postgres FTS (tsvector) — busca lexical PT-BR               │
│  ─ pgvector — busca semântica (embeddings 1536d)               │
│  ─ Híbrido: BM25 + cosine (rerank simples)                     │
│  ─ Meilisearch SE volume crescer >50k docs                     │
└────────────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 5: MATCH + ALERTAS                                     │
│  ─ Perfil-fornecedor: CNAEs, palavras-chave, valor min/max     │
│  ─ Match diário: cron compara perfil × novos editais           │
│  ─ Score: lexical + semântico + filtros hard                   │
│  ─ Notificações: email (Resend), WhatsApp (WAHA), push (PWA)   │
└────────────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────────────┐
│  CAMADA 6: APRESENTAÇÃO (Next.js)                              │
│  ─ Feed/Busca avançada (facets)                                │
│  ─ Detalhe edital + resumo IA + chat sobre PDF                 │
│  ─ Saved searches / alertas                                    │
│  ─ Dashboard (volume por órgão, tendências)                    │
│  ─ Configuração de perfil-fornecedor                           │
└────────────────────────────────────────────────────────────────┘
```

## Stack Recomendado (V0 — validar com Aria @architect)

| Camada | Escolha | Por quê |
|--------|---------|---------|
| Frontend | Next.js 15 (App Router) | User conhece, SSR + ISR, deploy Vercel free |
| Backend | Next.js Route Handlers + Server Actions | Monolito simples, sem N services |
| Workers | **Inngest** (free tier 50k steps/mês) | Cron + retry + observability built-in |
| DB | **Supabase** (Postgres + pgvector + Auth + Storage) | Tudo num só, generoso free tier, RLS |
| Search Lex | Postgres FTS (tsvector) com config 'portuguese' | Suficiente até 50k docs |
| Search Vec | pgvector na mesma Supabase | Sem service extra |
| Scraping | Playwright em workers Inngest | Sem servers dedicados |
| PDF Parse | **LlamaParse** (free 1000/mês) OU Unstructured.io self-hosted | Edital tem tabelas chatas |
| LLM | **Claude Sonnet 4.x** + cache prompts (90% off em re-resumos) | Qualidade × custo |
| Embeddings | OpenAI text-embedding-3-small ($0.02/1M tokens) | Mais barato que Claude |
| Email | **Resend** | Já usado em Vorza, free 3k/mês |
| WhatsApp | **WAHA** self-hosted (free) OU Z-API (R$X) | LP primeiro sem WhatsApp |
| Deploy frontend | **Vercel** free tier | Padrão do user |
| Deploy workers/cron | Inngest cloud (free) | Sem infra |
| Cron | Inngest scheduled functions | Sem GitHub Actions/Vercel Cron complicado |
| Auth | Supabase Auth (magic link + Google) | Built-in |
| Storage PDFs | Supabase Storage (1GB free) ou Cloudflare R2 | Ambos baratos |
| Observability | **Axiom** (free 0.5GB/mês) + Sentry (free) | Logs estruturados |

**Custo estimado fase pessoal (1-3 users):** $0/mês (tudo em free tier)
**Custo estimado beta (10-30 users, ~5k editais/mês):** $15-40/mês (LLM dominante)

## Schemas Principais (preliminar)

### Tabela `licitacoes` (canônico interno)
```sql
CREATE TABLE licitacoes (
  id TEXT PRIMARY KEY,                    -- hash determinístico
  pncp_id TEXT UNIQUE,                    -- ID do PNCP quando aplicável
  fonte TEXT NOT NULL,                    -- 'pncp', 'compras-df', 'aguas-lindas'
  fonte_id TEXT,                          -- ID original na fonte
  orgao_cnpj TEXT NOT NULL,
  orgao_nome TEXT NOT NULL,
  esfera TEXT NOT NULL,                   -- 'federal', 'estadual', 'municipal'
  uf TEXT NOT NULL,                       -- 'DF', 'GO'
  municipio TEXT,                         -- 'Águas Lindas de Goiás', 'Brasília'
  modalidade TEXT NOT NULL,               -- 'pregao_eletronico', 'concorrencia', 'dispensa'
  objeto TEXT NOT NULL,                   -- descrição
  objeto_fts tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', objeto)) STORED,
  valor_estimado NUMERIC,
  data_publicacao TIMESTAMPTZ NOT NULL,
  data_abertura TIMESTAMPTZ,
  data_fim_propostas TIMESTAMPTZ,
  status TEXT NOT NULL,                   -- 'publicada', 'em_andamento', 'homologada', 'cancelada'
  edital_url TEXT,
  edital_pdf_path TEXT,                   -- Supabase Storage path
  cnae_principal TEXT,
  cnae_secundarios TEXT[],
  resumo_ia TEXT,                          -- gerado por Claude
  embedding vector(1536),                  -- pgvector
  raw_payload JSONB NOT NULL,             -- dado bruto da fonte
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON licitacoes USING GIN (objeto_fts);
CREATE INDEX ON licitacoes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON licitacoes (data_publicacao DESC);
CREATE INDEX ON licitacoes (cnae_principal);
CREATE INDEX ON licitacoes (uf, municipio);
```

### Tabela `perfis_fornecedor`
```sql
CREATE TABLE perfis_fornecedor (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  nome TEXT NOT NULL,
  cnaes TEXT[] NOT NULL,
  keywords_inclusao TEXT[],
  keywords_exclusao TEXT[],
  valor_min NUMERIC,
  valor_max NUMERIC,
  ufs TEXT[] DEFAULT ARRAY['DF', 'GO'],
  municipios TEXT[],
  modalidades_aceitas TEXT[],
  notif_email BOOLEAN DEFAULT TRUE,
  notif_whatsapp BOOLEAN DEFAULT FALSE,
  notif_frequency TEXT DEFAULT 'daily',  -- 'realtime', 'daily', 'weekly'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `matches`
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  perfil_id UUID REFERENCES perfis_fornecedor,
  licitacao_id TEXT REFERENCES licitacoes,
  score_lexical FLOAT,
  score_semantico FLOAT,
  score_final FLOAT,
  motivos JSONB,                          -- {'cnae': true, 'keyword_match': ['servidor', 'TI']}
  notificado_at TIMESTAMPTZ,
  visualizado_at TIMESTAMPTZ,
  reacao TEXT,                             -- 'interessei', 'descartei', null
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(perfil_id, licitacao_id)
);
```

## Pipelines (Inngest Functions)

```typescript
// 1. Ingestão por portal
- ingest.pncp.recent (cron */15min) → fetch + persist novos
- ingest.compras-df (cron */1h)
- ingest.aguas-lindas (cron */6h, baixo volume)

// 2. Pós-processamento
- process.enrich-edital (event: licitacao.created) →
    download PDF → parse → resumo Claude → embedding → update row

// 3. Matching
- match.run-daily (cron 07:00) → for each perfil: SELECT match scores >threshold → criar notif
- notify.send (event: match.created) → email/whatsapp

// 4. Health
- health.scraper-check (cron */1h) → alertar se portal X sem novas há >24h
```

## Riscos Arquiteturais Identificados (V0)

1. **PNCP API rate limit desconhecido** — research vai dizer; mitigação: backoff exponencial + cache
2. **PDFs gigantes (100+p)** — custo IA pode explodir; mitigação: parse só primeiras 20p para resumo, full para chat
3. **Mudança de schema em portais** — quebra de scraper; mitigação: testes de contrato + alertas
4. **pgvector performance** — em <50k docs ok; >100k pode precisar Pinecone/Qdrant
5. **Free tier Supabase tem limite** — 500MB DB, 1GB storage; suficiente para fase pessoal mas estourará em produto

---

*Será reescrito como `01-arch-final.md` + diagramas após research completar.*
