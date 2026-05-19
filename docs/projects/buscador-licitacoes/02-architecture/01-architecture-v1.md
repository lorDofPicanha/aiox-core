# Arquitetura V1 — Buscador de Licitações DF + Águas Lindas

**Versão:** V1 (será validada com achados HYDRA quando pipeline completar)
**Data:** 2026-05-14
**Princípios:** KISS, boring tech first, free tier máximo, LGPD-by-design

---

## 1. Visão de Sistema (C4 Level 1)

```
                       ┌────────────────────────────────┐
                       │      USUÁRIOS (Fornecedores)    │
                       │  Breno · Amigo · Beta users     │
                       └────────────────────────────────┘
                                  │ HTTPS
                                  ▼
   ┌──────────────────────────────────────────────────────┐
   │           BUSCADOR DE LICITAÇÕES (App)                │
   │  ─ Web App (Next.js 15, Vercel)                      │
   │  ─ Email digest (Resend)                              │
   │  ─ WhatsApp alerts (WAHA self-host) [v2]              │
   └──────────────────────────────────────────────────────┘
       │              │                  │             │
       ▼              ▼                  ▼             ▼
   ┌────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────┐
   │ PNCP   │  │ ComprasGov  │  │ e-Compras  │  │ Águas    │
   │ API    │  │ scrape      │  │ DF scrape  │  │ Lindas   │
   │ JSON   │  │ HTML+PDF    │  │ HTML+PDF   │  │ scrape   │
   └────────┘  └─────────────┘  └────────────┘  └──────────┘
       │              │                  │             │
       └──────┬───────┴────────┬─────────┴─────────────┘
              ▼                ▼
       ┌──────────────────────────────────┐
       │   INGESTÃO + ETL + ENRIQUECIMENTO │
       │   (Inngest workers + LLM)         │
       └──────────────────────────────────┘
                       │
                       ▼
       ┌──────────────────────────────────┐
       │   SUPABASE Postgres + pgvector    │
       │   + Supabase Storage (PDFs)       │
       └──────────────────────────────────┘
```

## 2. Camada de Ingestão (detalhe)

### 2.1 Hierarquia de fontes

| Prioridade | Fonte | Método | Frequência | Volume estimado |
|------------|-------|--------|------------|-----------------|
| P0 | **PNCP** (federal mandatório Lei 14.133) | API REST JSON oficial | 15min | ~50-200 editais/dia (cobertura nacional, filtro UF=DF/GO) |
| P0 | **ComprasGov** (federal legacy) | Scrape Playwright + PDF | 1h | ~10-50 editais/dia (filtro DF/GO) |
| P1 | **e-Compras DF** | Scrape Playwright | 1h | ~5-20 editais/dia |
| P1 | **DODF** (publicações) | Scrape RSS + HTML | 1h | ~10-30 publicações/dia |
| P2 | **Águas Lindas-GO** | Scrape direto site municipal | 6h | ~1-5 editais/semana |
| P2 | **ComprasNet GO** | Scrape | 6h | ~5-15 editais/dia |
| P2 | **TCDF / TCE-GO** (acórdãos) | Scrape | daily | informativo, não-edital |
| P3 | **Licitações-e BB** (pregões eletrônicos) | Scrape | daily | overlap c/ ComprasGov |

### 2.2 Cliente PNCP (API oficial)

```typescript
// services/pncp-client.ts
const PNCP_BASE = 'https://pncp.gov.br/api/consulta';

interface PncpQueryParams {
  dataInicial: string;  // YYYYMMDD
  dataFinal: string;
  codigoModalidadeContratacao?: number;  // 6=Pregão Eletrônico, 7=Concorrência, 8=Dispensa, 9=Inexigibilidade
  uf?: string;          // 'DF', 'GO'
  codigoMunicipioIbge?: string;  // ex: 5300108 (Brasília), 5200175 (Águas Lindas)
  pagina: number;
  tamanhoPagina: number; // max 50
}

async function fetchPncpLicitacoes(params: PncpQueryParams) {
  const url = `${PNCP_BASE}/v1/contratacoes/publicacao?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`PNCP ${res.status}`);
  return res.json();
}
```

**Códigos IBGE relevantes:**
- 5300108 — Brasília/DF
- 5200175 — Águas Lindas de Goiás/GO

### 2.3 Scrapers (Playwright + Inngest)

```typescript
// inngest/functions/scrape-compras-df.ts
export const scrapeComprasDf = inngest.createFunction(
  { id: 'scrape-compras-df', concurrency: 1 },
  { cron: '0 * * * *' },  // a cada hora
  async ({ step }) => {
    const items = await step.run('fetch', async () => {
      const browser = await chromium.launch({ headless: true });
      const ctx = await browser.newContext({
        userAgent: 'BuscadorLicitacoesDF/1.0 (+contato@dominio.br)',  // ético, identifica
      });
      const page = await ctx.newPage();
      await page.goto('https://www.compras.df.gov.br/...');
      // Extração estruturada (selectors)
      return await page.evaluate(() => /* DOM extraction */);
    });

    await step.run('persist', async () => {
      await supabase.from('licitacoes').upsert(items, { onConflict: 'fonte,fonte_id' });
    });
  }
);
```

**Princípio:** robots.txt respeitado, user-agent identificado (contato), backoff exponencial em 429/5xx, alerta se 0 novos items por >24h (scraper provavelmente quebrou).

## 3. Camada de Enriquecimento (LLM)

### 3.1 Pipeline assíncrono

Quando `licitacao` é criada, dispara evento `licitacao.created` → função Inngest:

```typescript
export const enrichLicitacao = inngest.createFunction(
  { id: 'enrich-licitacao', concurrency: 5 },
  { event: 'licitacao.created' },
  async ({ event, step }) => {
    const lic = event.data;

    // Step 1: Download PDF (se houver)
    const pdfBuffer = await step.run('download-pdf', async () => {
      if (!lic.edital_url) return null;
      return await downloadAndStore(lic.edital_url, lic.id);
    });

    // Step 2: Parse PDF → markdown
    const editalText = await step.run('parse-pdf', async () => {
      if (!pdfBuffer) return lic.objeto;  // usa só objeto se não tem PDF
      return await llamaparseExtract(pdfBuffer);  // OU unstructured.io
    });

    // Step 3: Resumo executivo
    const resumo = await step.run('resumir', async () => {
      return await claude.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Resuma este edital em 5-8 bullets executivos. Foco em: objeto, valor estimado, prazo de entrega, requisitos críticos, modalidade, órgão. PT-BR claro, sem juridiquês.\n\n${editalText.slice(0, 12000)}`
        }]
      });
    });

    // Step 4: Classificação CNAE (embeddings)
    const embedding = await step.run('embedding', async () => {
      return await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${lic.objeto}\n${resumo}`,
      });
    });

    // Step 5: Persist
    await step.run('persist', async () => {
      await supabase.from('licitacoes')
        .update({ resumo_ia: resumo, embedding: embedding.data[0].embedding, edital_pdf_path: pdfPath })
        .eq('id', lic.id);
    });

    // Step 6: Dispara match
    await step.sendEvent('match.trigger', { name: 'licitacao.enriched', data: { licitacao_id: lic.id } });
  }
);
```

### 3.2 Estimativa de custo IA (por edital)

| Operação | Modelo | Tokens médio | Custo |
|----------|--------|-------------|-------|
| Resumo (Haiku) | claude-haiku-4-5 | 8k in + 600 out | $0.0035 |
| Embedding (text-3-small) | OpenAI | ~10k tokens | $0.0002 |
| Match score por perfil | Haiku (batch 20 perfis) | 2k in + 200 out | $0.0008 |
| **TOTAL por edital** | | | **~$0.005** |

**100 editais/dia × $0.005 × 30d = $15/mês de IA** (assumindo 100% PDFs presentes; realisticamente metade tem PDF rico).

## 4. Camada de Match + Notificação

### 4.1 Algoritmo de scoring

```typescript
function calculateMatchScore(licitacao: Licitacao, perfil: PerfilFornecedor): MatchScore {
  // Hard filters (eliminam)
  if (!perfil.ufs.includes(licitacao.uf)) return null;
  if (licitacao.valor_estimado && perfil.valor_max && licitacao.valor_estimado > perfil.valor_max) return null;
  if (licitacao.valor_estimado && perfil.valor_min && licitacao.valor_estimado < perfil.valor_min) return null;

  // Soft scoring (0-1)
  const cnaeMatch = perfil.cnaes.includes(licitacao.cnae_principal) ? 1.0 :
                    perfil.cnaes.some(c => licitacao.cnae_secundarios?.includes(c)) ? 0.7 : 0.2;

  const lexicalScore = computeBM25(licitacao.objeto_fts, perfil.keywords_inclusao);

  const semanticScore = cosineSimilarity(licitacao.embedding, perfil.embedding);

  const exclusionPenalty = perfil.keywords_exclusao.some(k =>
    licitacao.objeto.toLowerCase().includes(k.toLowerCase())
  ) ? -0.5 : 0;

  const finalScore =
    cnaeMatch * 0.40 +
    lexicalScore * 0.25 +
    semanticScore * 0.30 +
    exclusionPenalty;

  return {
    score_final: Math.max(0, Math.min(1, finalScore)),
    score_lexical: lexicalScore,
    score_semantico: semanticScore,
    motivos: { cnae: cnaeMatch, keywords: [...], exclusion_hits: [...] }
  };
}
```

### 4.2 Notificações

| Canal | Quando | Stack |
|-------|--------|-------|
| Email digest diário (07:00) | Sempre, todos perfis ativos | Resend + React Email |
| Email realtime | Score ≥ 0.85 (alta confiança) | Resend |
| WhatsApp (v2) | Score ≥ 0.85 + opt-in | WAHA self-host |
| Push web | Sempre, se PWA instalada | Web Push API nativo |

### 4.3 Template email (React Email)

```tsx
// emails/digest-diario.tsx
<DigestEmail>
  <Heading>Bom dia, {nome}. {count} editais combinam com seu perfil hoje.</Heading>
  {licitacoes.map(lic => (
    <LicitacaoCard>
      <Badge>{lic.uf} · {lic.modalidade}</Badge>
      <Title>{lic.objeto}</Title>
      <SubText>{lic.orgao_nome} · R$ {lic.valor_estimado?.toLocaleString('pt-BR')}</SubText>
      <Summary>{lic.resumo_ia}</Summary>
      <Cta href={`{APP}/licitacao/{lic.id}`}>Ver edital completo →</Cta>
      <Deadline>Propostas até: {format(lic.data_fim_propostas, 'dd/MM HH:mm')}</Deadline>
    </LicitacaoCard>
  ))}
  <Footer>Recebeu por engano? <Unsubscribe /></Footer>
</DigestEmail>
```

## 5. Camada de Apresentação (UI)

### 5.1 Telas principais

```
/                           Landing (público, free tier robust)
/feed                       Feed de novas licitações (logged)
/buscar                     Busca avançada com facets
/licitacao/[id]             Detalhe + resumo IA + chat sobre PDF
/perfil                     CRUD perfil-fornecedor (CNAE, keywords, valor)
/alertas                    Saved searches + frequência
/dashboard                  Volume por órgão, tendências, scores históricos
/conta                      Billing (Stripe Customer Portal), preferences
```

### 5.2 Componentes-chave

- **`<LicitacaoCard>`** — exibe edital com badge modalidade, valor, prazo destacado, score de match colorido
- **`<EditalViewer>`** — split view: PDF original (esquerda) + chunks com resumo IA + chat (direita)
- **`<FacetedFilter>`** — sidebar com facets: UF, município, órgão, modalidade, faixa valor, CNAE, prazo
- **`<MatchScoreBadge>`** — visual: 🟢 ≥0.85, 🟡 0.6-0.85, ⚪ <0.6 com tooltip explicando motivos
- **`<AlertConfig>`** — modal de criar/editar alerta (saved search)

### 5.3 UX principles aplicados

- **Mobile-first** (gestores comerciais usam em campo) com desktop denso para power users
- **Skim primeiro, profundidade sob demanda** — card mostra resumo IA 3-bullet, click → detalhe completo
- **Resumo IA sempre VISÍVEL** (não trancado) — é o killer feature
- **Acessibilidade WCAG AA** (essencial para domínio com usuários gov-adjacentes)
- **Sem dark patterns** — cancelamento óbvio, dados exportáveis, free tier honesto
- **Design tokens compatíveis com gov.br DS** (preparar para integração futura)

## 6. Stack Final Recomendado

```yaml
frontend:
  framework: Next.js 15 (App Router, RSC, Server Actions)
  ui: shadcn/ui + Tailwind 4
  state: Zustand (client) + Server Components (server-side)
  forms: react-hook-form + zod
  email_components: react-email

backend:
  runtime: Next.js Route Handlers + Server Actions (monolito)
  workers: Inngest (cron + retry + observability built-in)
  db: Supabase Postgres + pgvector + Storage + Auth
  search:
    lexical: Postgres FTS (tsvector com config 'portuguese')
    semantic: pgvector ivfflat
    rerank: BM25 + cosine híbrido (custom function)

ai:
  llm_main: Claude Haiku 4.5 (resumo, classificação, chat)
  llm_escalation: Claude Sonnet 4.5 (PDFs complexos, análise risco)
  embeddings: OpenAI text-embedding-3-small (1536d)
  pdf_parse: LlamaParse (free 1000/mês) → fallback Unstructured.io self-hosted

scraping:
  browser: Playwright
  pdf_download: undici (fast HTTP)
  queue: Inngest
  monitoring: alerta Telegram/email se 0 novos items >24h

notif:
  email: Resend (free 3k/mês, React Email)
  whatsapp: WAHA self-host (free) [v2]
  push: Web Push API nativo

deploy:
  frontend: Vercel free tier
  workers/cron: Inngest cloud free
  db: Supabase free (500MB → upgrade Pro $25/mês quando estourar)
  storage_pdfs: Supabase Storage 1GB free → Cloudflare R2 $0.015/GB
  observability: Axiom 0.5GB free + Sentry free

auth:
  provider: Supabase Auth (magic link Resend + Google OAuth)
  rbac: RLS Postgres policies + Next.js middleware

billing: # (v2 quando virar produto)
  gateway: Stripe (cartão internacional) + Asaas (PIX/boleto BR)
  pricing_engine: custom no Stripe Products

compliance:
  lgpd:
    base_legal_dados_publicos: "interesse legítimo (dados de CNPJ são públicos por LAI)"
    base_legal_usuario: "consentimento + execução de contrato"
    dpo: brenodecerqueira@gmail.com
    privacy_policy: gerado via iubenda ou template manual
    cookie_consent: vanilla-cookieconsent (open-source LGPD-friendly)
```

## 7. Schemas SQL (Supabase Postgres)

### 7.1 Migração inicial (000_initial.sql)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- TABELA: licitacoes (canônica)
-- ============================================================
CREATE TABLE licitacoes (
  id TEXT PRIMARY KEY,
  pncp_id TEXT UNIQUE,
  fonte TEXT NOT NULL CHECK (fonte IN ('pncp','comprasgov','compras-df','aguas-lindas','comprasnet-go','licitacoes-e','dodf','manual')),
  fonte_id TEXT NOT NULL,
  fonte_url TEXT,
  orgao_cnpj TEXT NOT NULL,
  orgao_nome TEXT NOT NULL,
  orgao_esfera TEXT NOT NULL CHECK (orgao_esfera IN ('federal','estadual','municipal','autarquia')),
  uf CHAR(2) NOT NULL,
  municipio TEXT,
  municipio_ibge CHAR(7),
  modalidade TEXT NOT NULL,
  objeto TEXT NOT NULL,
  objeto_fts tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', unaccent(objeto))) STORED,
  valor_estimado NUMERIC(15,2),
  valor_homologado NUMERIC(15,2),
  data_publicacao TIMESTAMPTZ NOT NULL,
  data_abertura TIMESTAMPTZ,
  data_fim_propostas TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'publicada',
  edital_url TEXT,
  edital_pdf_path TEXT,
  cnae_principal CHAR(7),
  cnae_secundarios TEXT[],
  resumo_ia TEXT,
  embedding vector(1536),
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fonte, fonte_id)
);

CREATE INDEX idx_lic_fts ON licitacoes USING GIN (objeto_fts);
CREATE INDEX idx_lic_embedding ON licitacoes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_lic_pub ON licitacoes (data_publicacao DESC);
CREATE INDEX idx_lic_uf ON licitacoes (uf, municipio);
CREATE INDEX idx_lic_cnae ON licitacoes (cnae_principal);
CREATE INDEX idx_lic_valor ON licitacoes (valor_estimado);
CREATE INDEX idx_lic_modalidade ON licitacoes (modalidade);
CREATE INDEX idx_lic_status ON licitacoes (status, data_fim_propostas);

-- ============================================================
-- TABELA: perfis_fornecedor
-- ============================================================
CREATE TABLE perfis_fornecedor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cnaes TEXT[] NOT NULL DEFAULT '{}',
  keywords_inclusao TEXT[] NOT NULL DEFAULT '{}',
  keywords_exclusao TEXT[] NOT NULL DEFAULT '{}',
  valor_min NUMERIC(15,2),
  valor_max NUMERIC(15,2),
  ufs CHAR(2)[] NOT NULL DEFAULT ARRAY['DF','GO']::CHAR(2)[],
  municipios TEXT[],
  modalidades_aceitas TEXT[] DEFAULT ARRAY['pregao_eletronico','dispensa','inexigibilidade'],
  embedding vector(1536),  -- embedding do perfil para match semântico
  notif_email BOOLEAN DEFAULT TRUE,
  notif_whatsapp BOOLEAN DEFAULT FALSE,
  notif_frequency TEXT DEFAULT 'daily' CHECK (notif_frequency IN ('realtime','daily','weekly')),
  whatsapp_number TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_perfil_user ON perfis_fornecedor (user_id);
CREATE INDEX idx_perfil_ativo ON perfis_fornecedor (ativo) WHERE ativo = TRUE;

-- ============================================================
-- TABELA: matches
-- ============================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id UUID NOT NULL REFERENCES perfis_fornecedor(id) ON DELETE CASCADE,
  licitacao_id TEXT NOT NULL REFERENCES licitacoes(id) ON DELETE CASCADE,
  score_lexical FLOAT NOT NULL,
  score_semantico FLOAT NOT NULL,
  score_final FLOAT NOT NULL,
  motivos JSONB,
  notificado_email_at TIMESTAMPTZ,
  notificado_whatsapp_at TIMESTAMPTZ,
  visualizado_at TIMESTAMPTZ,
  reacao TEXT CHECK (reacao IN ('interessei','descartei','submeti_proposta','ganhei','perdi')),
  reacao_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(perfil_id, licitacao_id)
);

CREATE INDEX idx_match_perfil ON matches (perfil_id, score_final DESC);
CREATE INDEX idx_match_pendente ON matches (perfil_id, notificado_email_at) WHERE notificado_email_at IS NULL;

-- ============================================================
-- RLS Policies (LGPD compliance)
-- ============================================================
ALTER TABLE licitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_fornecedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Licitações são públicas (LAI 12.527/2011 ampara)
CREATE POLICY "licitacoes leitura pública" ON licitacoes FOR SELECT USING (true);
CREATE POLICY "licitacoes write service-role" ON licitacoes FOR ALL USING (auth.role() = 'service_role');

-- Perfis são privados
CREATE POLICY "perfis owner" ON perfis_fornecedor FOR ALL USING (auth.uid() = user_id);

-- Matches só do dono do perfil
CREATE POLICY "matches owner" ON matches FOR ALL USING (
  auth.uid() = (SELECT user_id FROM perfis_fornecedor WHERE id = perfil_id)
);
```

## 8. Roadmap Faseado

### Fase 0 — Setup (1 semana)
- [ ] Provision Supabase (free tier)
- [ ] Provision Vercel + Inngest
- [ ] Bootstrap Next.js 15 + shadcn
- [ ] Schemas + migrations
- [ ] Auth (magic link)

### Fase 1 — Ingestão MVP (2 semanas)
- [ ] PNCP API client (federal, filtro DF+GO+Águas Lindas)
- [ ] Persistência canônica
- [ ] Enrichment IA (resumo + embedding)
- [ ] Feed básico no app (sem filtros avançados ainda)
- [ ] Email digest diário (1 perfil hardcoded p/ amigo)

### Fase 2 — Match + Notificação (1 semana)
- [ ] Schema perfil-fornecedor
- [ ] Algoritmo de match (CNAE + keywords + semântico)
- [ ] Email digest com matches scoreados
- [ ] UI CRUD perfil

### Fase 3 — Scrapers adicionais (2 semanas)
- [ ] ComprasGov scraper
- [ ] e-Compras DF scraper
- [ ] DODF watcher
- [ ] Águas Lindas scraper (low-volume, scan diário)

### Fase 4 — UI Power-User (2 semanas)
- [ ] Busca avançada com facets
- [ ] Detalhe edital + chat sobre PDF (RAG)
- [ ] Dashboard analítico
- [ ] Saved searches / multi-perfil

### Fase 5 — Hardening + Produto (1-2 semanas SE virar produto)
- [ ] Billing (Stripe + Asaas)
- [ ] Onboarding UX
- [ ] WhatsApp notif
- [ ] DPA + privacy policy formal
- [ ] Landing page comercial

**Total Fase 0-4 (uso pessoal):** ~8 semanas de dev solo
**Fase 5 (produtizar):** +2 semanas

## 9. Riscos Arquiteturais (V1)

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| PNCP API rate-limit ou breaking change | Média | Alto | Cache local + fallback scrape ComprasGov + monitor de schema |
| PDFs gigantes estourando custo IA | Média | Médio | Parse só primeiras 20p para resumo; chat usa RAG paginado |
| Free tier Supabase estourar 500MB | Alta (~6 meses uso) | Médio | Plano upgrade $25/mês; ou rotação PDFs antigos para R2 |
| pgvector lento >100k docs | Baixa (fase pessoal) | Médio | Migrar para Qdrant ou Pinecone v2 |
| Scrapers quebrando (mudança HTML gov) | Alta (frequente) | Médio | Alerta + retry + dependência primária PNCP API |
| LGPD enforcement em CPF de sócios em editais | Baixa | Alto | Não exibir CPF; redact PII na ingestão |
| OpenAI/Anthropic preço subir | Média (já aconteceu) | Médio | Multi-provider abstraction (LLM Router) |
| Concorrente comoditiza com IA | Alta (Effecti já está nesse caminho) | Médio | Vantagem regional + UX superior + free tier |

## 10. Métricas / North Star

- **North Star:** "matches de alta qualidade entregues por usuário/semana" (score ≥ 0.85)
- **Leading:** % de editais ingeridos vs. publicados (cobertura), latência de ingestão (do publicado ao visível), taxa de resumos IA bem-classificados
- **Lagging:** retention W1/W4, NPS, % de matches que viraram proposta submetida, taxa de ganho (se virar produto)

---

*Esta arquitetura V1 será confrontada com os achados HYDRA quando o pipeline completar. Ajustes esperados: confirmação ou pivotagem dos stacks recomendados (LlamaParse vs Unstructured, Inngest vs Trigger.dev, etc).*
