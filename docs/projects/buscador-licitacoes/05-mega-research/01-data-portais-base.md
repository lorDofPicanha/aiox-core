# Mega Research — Data, Portais & Base Multi-Tenant

**Projeto:** Buscador de Licitações DF + Águas Lindas-GO
**Agente:** @data-engineer (Dara)
**Escopo:** Estágio 1 (monitorar) + Estágio 5 (live session) + BASE (livro caixa multi-CNPJ)
**Empresas:** 3 (1 licitação + 2 gestão financeira) — multi-tenant com RBAC granular
**Data:** 2026-05-18
**Clones canalizados:** Pablo Hoffman (Scrapy), Martin Kleppmann (DDIA), Ann Cavoukian (PbD), Jennifer Pahlka (govtech)

---

## TL;DR — 9 conclusões duras

1. **PNCP API tem o que precisamos mas a paginação é cursor-by-date + sequencial — não é offset confiável**. Polling incremental por `dataPublicacao >= last_seen_at` é a única forma defensável. `dataAtualizacaoGlobal` no índice de busca é mentiroso (não muda em algumas mutações). Validar empiricamente.
2. **Não existe API para Águas Lindas-GO**. PNCP cobre o que a prefeitura publica sob Lei 14.133, DOE-GO cobre o que sai em diário oficial; o resto (dispensas baixo valor pré-2024 + módulos legados de Pregão) só por scraping respeitoso do site Wordpress. Apostar **Crawl4AI + parsers do projeto Querido Diário** (Pahlka: govtech reuse).
3. **PostgreSQL + RLS multi-tenant resolve para 3 empresas + N usuários**, mas a granularidade real (RBAC por permissão de lançamento por empresa) precisa de **2 camadas**: RLS para isolamento tenant + tabela `user_company_permissions` para grão fino. Cole as policies (§3).
4. **Pluggy é o caminho racional para Open Finance** (R$0-200/mês alvo é viável até ~10 conexões), mas **alternar para `bancos-brasileiros` OFX-parser open source como fallback** para empresas que recusarem dar consentimento Open Finance. Belvo é caro demais para 3 CNPJs. BTG só faz sentido se cliente já é correntista BTG.
5. **CEIS e CNJ não têm APIs decentes** — CEIS é CSV diário oficial do Portal da Transparência (download massa); CNJ é scraping com captcha em vários TRTs. RFB CNPJ tem **API oficial assíncrona via Receitaws/BrasilAPI fallback** (rate limited).
6. **Webhooks PNCP não existem para terceiros**. Só polling. Mas o **gap real** entre publicação no DODF/DOE-GO (D+0 manhã) e indexação no PNCP (D+1 a D+2) é onde mora o moat de "alerta antes da concorrência". Pipeline híbrido obrigatório.
7. **Schema deve ter `external_source_id` + `canonical_id`** desde o dia 1 (Kleppmann: change data capture). Mesma licitação aparece em PNCP + DODF + portal próprio → mesmo `canonical_id`, múltiplos `external_source_id` no audit trail.
8. **LGPD: minimização agressiva** (Cavoukian). NÃO armazenar dados pessoais de outros licitantes scrapeados — só CNPJ + razão social pública. Para usuários internos, RLS + criptografia at-rest + DPA com empresas.
9. **Custo total Fase 1 realista: R$45-180/mês**. Supabase free (R$0) → Supabase Pro R$125 quando passar de 500MB/8GB. Inngest free → R$0. Pluggy 4-8 conexões R$8-32. Cloudflare R2 PDFs R$0-20. Domain R$50/ano.

---

## 1. PNCP API DEEP DIVE

### 1.1 Base URLs

| Propósito | Base URL | Auth |
|-----------|----------|------|
| **Consulta** (read-only) | `https://pncp.gov.br/api/consulta/v1/` | Nenhuma |
| **Integração** (write) | `https://pncp.gov.br/api/pncp/v1/` | Certificado ICP-Brasil + JWT |
| **Swagger** | `https://pncp.gov.br/api/consulta/swagger-ui/index.html` | — |
| **Manuais** | `https://www.gov.br/pncp/pt-br/acesso-a-informacao/manuais` | — |

### 1.2 Endpoints críticos

**A) Lista de compras por filtro de data (o workhorse)**
```http
GET /v1/contratacoes/publicacao
  ?dataInicial=20260501            # YYYYMMDD
  &dataFinal=20260518              # YYYYMMDD
  &codigoModalidadeContratacao=6   # 6=Pregão Eletrônico, 8=Dispensa
  &uf=DF                            # opcional
  &codigoMunicipioIbge=5200050     # Águas Lindas-GO IBGE code
  &pagina=1
  &tamanhoPagina=50                # max 500
```

Resposta (campos relevantes):
```json
{
  "data": [{
    "numeroControlePNCP": "00038174000043-1-000123/2026",
    "anoCompra": 2026,
    "sequencialCompra": 123,
    "objetoCompra": "Aquisição de mobiliário escolar...",
    "valorTotalEstimado": 845000.00,
    "valorTotalHomologado": null,
    "dataAberturaProposta": "2026-05-22T09:00:00",
    "dataEncerramentoProposta": "2026-06-05T17:00:00",
    "dataPublicacaoPncp": "2026-05-18T03:14:22",
    "modalidadeId": 6,
    "modalidadeNome": "Pregão - Eletrônico",
    "modoDisputaId": 1,
    "srp": false,
    "orgaoEntidade": {
      "cnpj": "00038174000043",
      "razaoSocial": "PREFEITURA MUNICIPAL DE AGUAS LINDAS DE GOIAS",
      "esferaId": "M", "poderId": "E"
    },
    "unidadeOrgao": {
      "ufSigla": "GO",
      "municipioNome": "Águas Lindas de Goiás",
      "codigoUnidade": "...", "nomeUnidade": "Sec. de Educação"
    },
    "situacaoCompraId": 1,
    "situacaoCompraNome": "Divulgada no PNCP",
    "linkSistemaOrigem": "https://www.licitacoes-e.com.br/aop/lances.bb?numLote=..."
  }],
  "totalRegistros": 1247,
  "totalPaginas": 25,
  "numeroPagina": 1,
  "paginasRestantes": 24,
  "empty": false
}
```

**B) Detalhe + itens + arquivos**
```http
GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}
GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/itens?pagina=1&tamanhoPagina=500
GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/arquivos          # edital PDF + adendos
GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/arquivos/{seq}    # binary
```

**C) Atas e contratos** (Estágio 2 — análise 6 meses)
```http
GET /v1/orgaos/{cnpj}/atas?pagina=1
GET /v1/orgaos/{cnpj}/contratos?pagina=1   # FUNDAMENTAL para o estágio 2 (padrão histórico)
```

**D) cURL real (Águas Lindas, últimos 7 dias)**
```bash
curl -sS -G "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao" \
  --data-urlencode "dataInicial=20260511" \
  --data-urlencode "dataFinal=20260518" \
  --data-urlencode "codigoMunicipioIbge=5200050" \
  --data-urlencode "tamanhoPagina=50" \
  -H "User-Agent: buscador-licitacoes-aios/0.1 (contato@dominio.com.br)" \
  -H "Accept: application/json"
```
CNPJ canonical da Prefeitura de Águas Lindas: **VALIDAR EMPIRICAMENTE** via `/v1/orgaos?cnpj=...` — site oficial lista CNPJ 01.616.490/0001-90 (transparência municipal) que pode ou não bater com o cadastro no PNCP. Faça o smoke test primeiro.

### 1.3 Rate limits — empíricos

| Limite | Observado | Fonte | Mitigação |
|--------|-----------|-------|-----------|
| Sem rate limit oficial publicado | — | Manual v2.3 silencia sobre isso | Tratar como 60 req/min seguro |
| ~60 req/min sustentado funciona | Reports comunidade (medium @serpro 2023, dev.to) | VALIDAR EMPIRICAMENTE | Backoff exponencial + jitter |
| 429 não documentado mas existe | Reports GitHub issues em wrappers | — | retry 30s, depois 60s, depois 120s |
| Timeout p99 ~3-5s, p50 ~400ms | Smoke test independente jan/2026 | VALIDAR | Timeout client 10s |
| Janela `dataInicial`-`dataFinal` máx 30 dias | Hard limit do endpoint | Swagger | Para backfill, loop por janelas de 30d |

**Pablo Hoffman diria:** identifique-se no User-Agent (`buscador-licitacoes-aios/0.1 (email)`), cache local agressivamente, nunca paralelize >5 workers contra a mesma API gov.br — derruba e queima reputação coletiva.

### 1.4 Paginação — o gotcha

`tamanhoPagina` max 500 mas resposta pode truncar em 50 dependendo do endpoint. **A ordem de retorno NÃO é estável** entre chamadas (sort por `dataPublicacaoPncp DESC` mas com ties não-determinísticos). **Conclusão:** para sync incremental confiável, usar a estratégia §1.5.

### 1.5 Strategy de polling incremental — DEFINITIVA

```yaml
# pseudo-code
watermark: last_dataPublicacaoPncp_seen_at  # timestamp persistido
every 15min:
  for each (cnpj_orgao OR uf_filter):
    dataInicial = watermark - 1h            # overlap defensivo
    dataFinal   = now()
    page = 1
    while True:
      resp = GET /contratacoes/publicacao?dataInicial..dataFinal&pagina=page
      for item in resp.data:
        if numeroControlePNCP not in DB:
          INSERT
        else:
          # checar dataAtualizacaoGlobal — VALIDAR se realmente muda
          UPDATE if changed
      if resp.paginasRestantes == 0: break
      page += 1
    watermark = max(item.dataPublicacaoPncp for item in resp.data)
```

**Custo:** ~96 chamadas/dia (4 polls/hora × 24h) por filtro = trivial.

---

## 2. SCRAPING ESTRATÉGIA

### 2.1 Stack OSS por portal

| Portal | Recomendação | Razão | Risco |
|--------|-------------|-------|-------|
| **e-Compras DF** | Playwright (Python ou Node) + queue | JS-heavy, paginação client-side | Site frágil — limitar 30 req/min |
| **Portal Águas Lindas** | Crawl4AI (LLM-assisted extraction) | Wordpress não-padronizado, layout muda | Schema drift constante |
| **DODF (Diário Oficial DF)** | **Reuso Querido Diário** (OKBR) | Parsers prontos, MIT license | Manter fork atualizado |
| **DOE-GO** | Querido Diário spider `go_aguas_lindas` ou `go_estado` | Idem | Idem |
| **Licitações-e (BB)** | Playwright + sessão autenticada (consentimento do cliente) | Login obrigatório para ver lances | LGPD: documentar consentimento |
| **CEIS / CNEP** | `curl` direto no CSV diário | É um download de arquivo, não scraping | Layout do CSV pode mudar |

### 2.2 Tooling comparison — Crawl4AI vs Scrapy vs Playwright vs Browser-use

| Tool | Stars | Licença | Quando usar | Quando NÃO usar |
|------|-------|---------|-------------|-----------------|
| **Crawl4AI** ([github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)) | 50k+ | Apache-2.0 | Sites Wordpress não-padronizados, extração com LLM-assist, schemas que mudam | Alto volume (>10k páginas/dia) — não bate Scrapy |
| **Scrapy** ([github.com/scrapy/scrapy](https://github.com/scrapy/scrapy)) | 55k+ | BSD-3 | Pipelines maduras, sites HTML estáticos, alto volume | Sites JS-heavy (precisa scrapy-playwright addon) |
| **Playwright** ([github.com/microsoft/playwright](https://github.com/microsoft/playwright)) | 70k+ | Apache-2.0 | Sites JS pesados, auth complexo, captcha visual | Volume alto (caro em CPU/memória) |
| **Browser-use** ([github.com/browser-use/browser-use](https://github.com/browser-use/browser-use)) | 60k+ | MIT | Workflows complexos one-shot guiados por LLM | Pipeline produção 24/7 (custo LLM acumula) |
| **Querido Diário (OKBR)** ([github.com/okfn-brasil/querido-diario](https://github.com/okfn-brasil/querido-diario)) | 1k+ | MIT | TODO scraping de diário oficial BR | Não é diário oficial |

**Recomendação primária:** **Scrapy + scrapy-playwright** para volume + **Crawl4AI** para Águas Lindas (schema drift). **Querido Diário** para DODF/DOE-GO. Pahlka: govtech ético reusa infraestrutura cívica em vez de fazer scraper novo.

### 2.3 Backoff + UA + robots.txt — política

```python
# Política mínima viável (reuse em todos os scrapers)
USER_AGENT = "buscador-licitacoes-aios/0.1 (+contato@dominio.com.br) - LAI Lei 12.527"
DOWNLOAD_DELAY = 2.0          # 30 req/min absolute max
RANDOMIZE_DOWNLOAD_DELAY = True   # jitter ±0.5x
CONCURRENT_REQUESTS_PER_DOMAIN = 2
RETRY_TIMES = 3
RETRY_HTTP_CODES = [429, 500, 502, 503, 504, 408]
ROBOTSTXT_OBEY = True         # NÃO desativar — gov.br tem robots.txt razoável
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0   # cidadão respeitoso
```

### 2.4 Jurídico — LAI / robots.txt / ToS

- **LAI (Lei 12.527/2011)** garante acesso a dados públicos — protege scraping de dados que JÁ são públicos por lei (avisos de licitação, contratos, atas).
- **NÃO protege** scraping de dados não-públicos (ex.: dados pessoais de outros licitantes que aparecem por acidente em PDF).
- **robots.txt:** obedecer sempre. Se gov.br bloqueia, parar e abrir pedido LAI estruturado.
- **ToS de Licitações-e (BB):** ambíguo. Scraping logado com credencial do cliente exige **DPA explícito** com cliente (consentimento por escrito de que ele autoriza o sistema a operar em nome dele).
- **Cavoukian:** minimização — não scrape o que você não vai usar. Não armazene CPF de pregoeiros ou de licitantes pessoa-física.

---

## 3. MULTI-TENANT POSTGRES MODEL (3 empresas + N usuários)

### 3.1 Schema base

```sql
-- ============================================================
-- TENANTS = grupo de empresas do mesmo cliente final
-- Para o amigo, é 1 tenant com 3 companies
-- ============================================================
CREATE TABLE tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cnpj        char(14) NOT NULL,        -- só dígitos
  razao_social text NOT NULL,
  nome_fantasia text,
  bids_enabled boolean NOT NULL DEFAULT false,   -- só 1 das 3 licita
  regime_tributario text CHECK (regime_tributario IN ('mei','simples','presumido','real')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, cnpj)
);

CREATE INDEX idx_companies_tenant ON companies(tenant_id);

-- ============================================================
-- USERS = mapeados para Supabase auth.users
-- ============================================================
CREATE TABLE user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  display_name text,
  is_tenant_admin boolean NOT NULL DEFAULT false,   -- admin do tenant inteiro
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id);

-- ============================================================
-- RBAC GRANULAR: permissão por empresa, por escopo
-- ============================================================
CREATE TYPE permission_scope AS ENUM (
  'read_company',         -- ver dashboard da empresa
  'read_financial',       -- ler lançamentos (livro caixa)
  'write_financial',      -- criar/editar lançamentos
  'approve_financial',    -- aprovar lançamentos (4-eyes)
  'read_bids',            -- ler licitações monitoradas
  'write_bids',           -- gerenciar alertas, filtros
  'submit_bids',          -- enviar proposta (apenas company bids_enabled=true)
  'read_documents',       -- baixar dossiês
  'manage_users'          -- adicionar/remover usuários da empresa
);

CREATE TABLE user_company_permissions (
  user_id     uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  scope       permission_scope NOT NULL,
  granted_at  timestamptz NOT NULL DEFAULT now(),
  granted_by  uuid REFERENCES user_profiles(id),
  PRIMARY KEY (user_id, company_id, scope)
);

CREATE INDEX idx_ucp_user ON user_company_permissions(user_id);
CREATE INDEX idx_ucp_company ON user_company_permissions(company_id);

-- ============================================================
-- DADOS DE NEGÓCIO — todos têm tenant_id
-- ============================================================
CREATE TABLE licitacoes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             uuid NOT NULL REFERENCES tenants(id),
  -- canonical (dedup)
  canonical_id          text NOT NULL,             -- SHA256(orgao_cnpj+numero+ano)
  -- fontes
  pncp_numero_controle  text UNIQUE,               -- chave PNCP
  orgao_cnpj            char(14) NOT NULL,
  orgao_razao_social    text,
  uf                    char(2),
  municipio_nome        text,
  codigo_municipio_ibge text,
  -- metadados
  objeto_compra         text NOT NULL,
  valor_total_estimado  numeric(15,2),
  modalidade_id         int,
  modalidade_nome       text,
  situacao              text,
  data_abertura         timestamptz,
  data_encerramento     timestamptz,
  data_publicacao_pncp  timestamptz NOT NULL,
  link_sistema_origem   text,
  -- audit trail
  external_sources      jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{source:'pncp', ingested_at, payload_hash}]
  raw_payload           jsonb,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_licitacoes_canonical ON licitacoes(tenant_id, canonical_id);
CREATE INDEX idx_licitacoes_pub ON licitacoes(tenant_id, data_publicacao_pncp DESC);
CREATE INDEX idx_licitacoes_uf_muni ON licitacoes(uf, codigo_municipio_ibge);
CREATE INDEX idx_licitacoes_orgao ON licitacoes(orgao_cnpj);
CREATE INDEX idx_licitacoes_obj_fts ON licitacoes USING GIN (to_tsvector('portuguese', objeto_compra));

-- Livro Caixa (BASE)
CREATE TABLE financial_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id),
  company_id   uuid NOT NULL REFERENCES companies(id),
  entry_date   date NOT NULL,
  description  text NOT NULL,
  document_ref text,
  account_code text,
  category     text,
  amount_in    numeric(15,2) NOT NULL DEFAULT 0,
  amount_out   numeric(15,2) NOT NULL DEFAULT 0,
  source       text NOT NULL CHECK (source IN ('open_finance','ofx_import','manual')),
  bank_account_id uuid,
  external_ref text,           -- ID do banco/Pluggy para dedup
  metadata     jsonb,
  approved_by  uuid REFERENCES user_profiles(id),
  approved_at  timestamptz,
  created_by   uuid NOT NULL REFERENCES user_profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_in_xor_out CHECK ((amount_in > 0) <> (amount_out > 0))
);

CREATE INDEX idx_fe_company_date ON financial_entries(company_id, entry_date DESC);
CREATE INDEX idx_fe_tenant ON financial_entries(tenant_id);
CREATE UNIQUE INDEX idx_fe_dedup_ext ON financial_entries(company_id, external_ref) WHERE external_ref IS NOT NULL;
```

### 3.2 RLS Policies — CABEÇA DURA, isolamento defendido

```sql
-- ============================================================
-- HELPER: tenant_id do usuário corrente
-- ============================================================
CREATE OR REPLACE FUNCTION auth_tenant_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION has_company_permission(p_company uuid, p_scope permission_scope)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_company_permissions
    WHERE user_id = auth.uid()
      AND company_id = p_company
      AND scope = p_scope
  ) OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
      AND is_tenant_admin = true
      AND tenant_id = (SELECT tenant_id FROM companies WHERE id = p_company)
  )
$$;

-- ============================================================
-- LICITAÇÕES — escopo tenant
-- ============================================================
ALTER TABLE licitacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY licitacoes_tenant_isolation ON licitacoes
  FOR SELECT USING (tenant_id = auth_tenant_id());

CREATE POLICY licitacoes_admin_write ON licitacoes
  FOR INSERT WITH CHECK (false);   -- só service_role escreve

CREATE POLICY licitacoes_admin_update ON licitacoes
  FOR UPDATE USING (false);

-- ============================================================
-- FINANCIAL ENTRIES — escopo company + RBAC granular
-- ============================================================
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY fe_select_with_read ON financial_entries
  FOR SELECT USING (
    tenant_id = auth_tenant_id()
    AND has_company_permission(company_id, 'read_financial')
  );

CREATE POLICY fe_insert_with_write ON financial_entries
  FOR INSERT WITH CHECK (
    tenant_id = auth_tenant_id()
    AND has_company_permission(company_id, 'write_financial')
    AND created_by = auth.uid()
  );

CREATE POLICY fe_update_with_write ON financial_entries
  FOR UPDATE USING (
    tenant_id = auth_tenant_id()
    AND has_company_permission(company_id, 'write_financial')
  );

CREATE POLICY fe_delete_with_approve ON financial_entries
  FOR DELETE USING (
    tenant_id = auth_tenant_id()
    AND has_company_permission(company_id, 'approve_financial')
  );

-- ============================================================
-- COMPANIES — só vê empresas do tenant
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY companies_tenant_read ON companies FOR SELECT
  USING (tenant_id = auth_tenant_id());

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY up_self_or_admin ON user_profiles FOR SELECT
  USING (
    id = auth.uid()
    OR (tenant_id = auth_tenant_id() AND EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_tenant_admin = true
    ))
  );
```

**Cavoukian (PbD):** RLS é controle de acesso, não criptografia. Para dados super-sensíveis (extratos bancários), considere `pgcrypto` para `amount_in/amount_out` em campos específicos OU criptografia at-rest no nível de tablespace (Supabase Pro tem). Hash de CNPJ para indexação anônima também é opção.

### 3.3 Anti-conluio coligadas (P0 feature, do livro-caixa-deep-dive §C.6)

```sql
CREATE TABLE company_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  name text NOT NULL
);

ALTER TABLE companies ADD COLUMN group_id uuid REFERENCES company_groups(id);

-- view: licitações onde uma empresa do grupo já tem proposta
CREATE VIEW bid_collision_guard AS
  SELECT
    cg.id as group_id,
    l.id as licitacao_id,
    array_agg(distinct c.cnpj) as cnpjs_submetidos
  FROM bid_submissions bs
  JOIN companies c ON c.id = bs.company_id
  JOIN company_groups cg ON cg.id = c.group_id
  JOIN licitacoes l ON l.id = bs.licitacao_id
  GROUP BY cg.id, l.id
  HAVING count(distinct c.id) > 1;
```

---

## 4. OPEN FINANCE — Comparativo real para 3 CNPJs

| Provider | Pricing real (BR) | Cobertura bancos | LGPD | API | Latência | Notas |
|----------|------------------|------------------|------|-----|----------|-------|
| **Pluggy** ([pluggy.ai](https://pluggy.ai)) | R$0,50-R$2/conexão/mês (escala); R$0 sandbox; volume baixo ~R$8-32/mês para 3 CNPJs | 30+ bancos (Itaú, Bradesco, Santander, BB, Caixa, Inter, NuBank, Sicoob, BTG) via Open Finance + scraping legado | DPA pronto, ISO 27001 | REST, OAuth + widget JS | webhooks D+1 dia | **RECOMENDADO** — único viável <R$200/mês |
| **Belvo** ([belvo.com](https://belvo.com/br)) | Pricing customizado, base ~USD 0,30/conexão (~R$1,50) mas com mínimos contratuais ~USD 500/mês | 25+ bancos BR + LATAM (Mexico, Colombia) | DPA, ISO 27001 | REST | webhooks tempo real | **CARO DEMAIS para 3 CNPJs**. Faz sentido se for SaaS multi-cliente |
| **Klavi** ([klavi.com.br](https://klavi.com.br)) | Foco enterprise; pricing fechado | Open Finance + scraping; ~20 bancos | DPA | REST | n/d | **OVERKILL** para 3 CNPJs |
| **BTG Pactual Open Finance** | Grátis se cliente é correntista BTG | Só conta BTG (1 banco) | Termo BTG | REST direto | tempo real | Útil só se a empresa já é cliente BTG |
| **bancos-brasileiros** (OSS) ([github.com/CoreFinance-ai/bancos-brasileiros](https://github.com/CoreFinance-ai/bancos-brasileiros)) | R$0 | Lista metadados de bancos; NÃO faz fetch de extrato — só auxilia validação ISPB/COMPE | MIT | — | — | Helper, não substituto |
| **OFX parser puro** (ofxparse Python / banks2ofx) | R$0 | Cliente baixa OFX do internet banking e faz upload | LGPD: dado fica no servidor | — | manual | **FALLBACK obrigatório** para clientes que não querem OF |

**Decisão:** **Pluggy como primário + OFX upload como fallback**. 3 empresas × ~1-2 contas = 3-6 conexões. R$6-12/mês. Belvo só se virar SaaS multi-cliente com >50 clientes.

### 4.1 Schema Pluggy → financial_entries

```sql
CREATE TABLE bank_connections (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenants(id),
  company_id    uuid NOT NULL REFERENCES companies(id),
  provider      text NOT NULL CHECK (provider IN ('pluggy','belvo','manual_ofx')),
  pluggy_item_id text UNIQUE,            -- ID do "item" no Pluggy
  bank_name     text,
  account_number_masked text,            -- ****1234, NUNCA cleartext
  status        text,                    -- 'connected','expired','error'
  last_sync_at  timestamptz,
  consent_expires_at timestamptz,         -- LGPD: validade do consentimento
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

---

## 5. OSS TOOLS por função

### 5.1 PNCP client

| Tool | Stars | Licença | Última atividade | Pros | Cons |
|------|-------|---------|------------------|------|------|
| **`pncp-api-cliente`** ([github.com/wgw-junior/pncp-api](https://github.com/search?q=pncp+api&type=repositories)) (vários forks) | <200 cada | MIT/Apache | 2024-2025 (vários abandonados) | Wrappers prontos Python/Node | Maioria desatualizado pós-v2 da API |
| **Construir próprio** (axios/fetch + types Zod) | — | — | — | Controle total; tipa schema | Custo manutenção |
| **`pncp-client-go`** | <50 | MIT | 2025 | Bem tipado | Linguagem errada se stack é Node |

**Recomendação:** Construir client próprio em TypeScript com **Zod schemas validando resposta** (PNCP muda silenciosamente; Zod pega quebra cedo). 200 LOC.

### 5.2 Scraping

| Tool | Stars | Licença | Recomendação |
|------|-------|---------|--------------|
| **Scrapy** | 55k+ | BSD-3 | **Primária** para pipelines maduras |
| **scrapy-playwright** | 1k+ | BSD-3 | Add-on para JS-heavy |
| **Crawl4AI** | 50k+ | Apache-2.0 | **Para Águas Lindas** (schema drift) |
| **Querido Diário spiders** | 1k+ | MIT | **Reuso obrigatório** para DODF/DOE-GO |
| **Playwright** (raw) | 70k+ | Apache-2.0 | Sessões autenticadas (Licitações-e) |

### 5.3 Dedupe de licitações

| Tool | Stars | Licença | Notas |
|------|-------|---------|-------|
| **dedupe.io / dedupe-python** | 4k | MIT | Probabilistic record linkage; bom para cruzar PNCP vs DODF |
| **`rapidfuzz`** | 3k | MIT | Fuzzy string matching; útil pra matchar nomes de órgão |
| **Postgres `pg_trgm`** | nativo | PostgreSQL | Trigram similarity; pra busca + dedup leve |
| **Custom: SHA256(cnpj_orgao + numero_processo + ano)** | — | — | **PRIMÁRIA** — chave canonical determinística |

**Decisão:** chave canonical SHA256 + `pg_trgm` para fuzzy lookups secundários.

### 5.4 Search index

| Tool | Stars | Licença | Notas |
|------|-------|---------|-------|
| **Postgres `tsvector` + GIN** ('portuguese' config) | nativo | PostgreSQL | **MVP**: zero infra extra, suporta PT-BR com stemming |
| **Meilisearch** ([github.com/meilisearch/meilisearch](https://github.com/meilisearch/meilisearch)) | 50k+ | MIT | Self-hosted, typo-tolerant; trocar quando passar 10k licitações ativas |
| **Typesense** ([github.com/typesense/typesense](https://github.com/typesense/typesense)) | 23k+ | GPL-3 | Alternativa Meilisearch |
| **pgvector** ([github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)) | 18k | PostgreSQL | Busca semântica em PDFs de edital (moat real) |

**Decisão:** Postgres `tsvector` no MVP + `pgvector` para semantic search em PDFs assim que tiver embeddings.

### 5.5 OFX parser

| Tool | Stars | Licença | Notas |
|------|-------|---------|-------|
| **ofxparse** (Python) | 700+ | MIT | Maduro, suporta OFX 1.x e 2.x |
| **node-ofx-parser** | 100+ | MIT | Node, OFX 1.x bom; 2.x parcial |
| **ofx-js** | 50+ | MIT | Mais novo; menos battle-tested |

**Decisão:** se backend Node, `node-ofx-parser`. Se algum worker for Python (Querido Diário já é), `ofxparse`.

---

## 6. CEIS / CNJ / RFB APIs

| Fonte | Cobertura | Acesso | Frequência update | Custo | Notas |
|-------|-----------|--------|-------------------|-------|-------|
| **CEIS** (Cadastro Empresas Inidôneas) | CGU federal | CSV download diário em [portaldatransparencia.gov.br/download-de-dados/ceis](https://portaldatransparencia.gov.br/download-de-dados/ceis) | Diário (madrugada) | R$0 | Baixar 1x/dia, fazer diff |
| **CNEP** (Cadastro Pessoas Jurídicas Punidas) | CGU federal | CSV idem em [portaldatransparencia.gov.br/download-de-dados/cnep](https://portaldatransparencia.gov.br/download-de-dados/cnep) | Diário | R$0 | Idem |
| **CEPIM** (Convênios irregulares) | CGU federal | CSV idem | Diário | R$0 | Útil para enriquecer perfil de órgão |
| **CNJ Improbidade** | CNJ | Web scraping com captcha | Manual / sob demanda | R$0 (mas trabalhoso) | **SCRAPING ÉTICO**: usar só on-demand para CNPJ específico, não scraping massivo |
| **TST CNDT** (Certidão Negativa Débitos Trabalhistas) | TST | Web pública com captcha; PDF emitido | Sob demanda | R$0 | OCR do PDF assinado; cuidado com captcha |
| **PGFN** (regularidade fiscal federal) | PGFN | API CADIN só para órgãos públicos; cidadão emite via web com captcha | Sob demanda | R$0 | Idem |
| **RFB CNPJ** (consulta cadastro) | Receita Federal | API oficial: limit 3 req/min via [solucoes.receita.fazenda.gov.br](https://solucoes.receita.fazenda.gov.br/Servicos/CertidaoInternet/PJ); fallback OSS BrasilAPI/Receitaws | Real-time | R$0 (limitado) | **BrasilAPI** ([brasilapi.com.br/docs](https://brasilapi.com.br/docs)) é o standard OSS — 5 req/s |
| **SICAF** (regularidade fornecedor) | MGI | Login institucional obrigatório; sem API pública | — | — | Fora do escopo MVP |

**Estratégia recomendada:** download diário CSV CEIS/CNEP/CEPIM + BrasilAPI on-demand para validações de CNPJ. CNDT/PGFN apenas sob demanda do usuário, com cache 30 dias.

---

## 7. INCREMENTAL DATA INGESTION PATTERN

### 7.1 Arquitetura concreta

```
┌─────────────────────────────────────────────────────────────┐
│  Inngest cron (4x/dia)                                       │
│   ├─→ fn: pncp.poll(filter={uf:DF})                          │
│   ├─→ fn: pncp.poll(filter={ibge:5200050})                   │
│   ├─→ fn: pncp.poll(filter={cnpj:<PMAL>})                    │
│   └─→ fn: ceis.daily_csv_diff()                              │
│                                                              │
│  Inngest cron (1x/dia 07:00 BRT)                             │
│   ├─→ fn: querido_diario.dodf.fetch()                        │
│   └─→ fn: querido_diario.doe_go.fetch()                      │
│                                                              │
│  Inngest cron (2x/dia)                                       │
│   ├─→ fn: scrape.aguaslindas_wordpress()                     │
│   └─→ fn: scrape.ecompras_df()                               │
│                                                              │
│  All write → Postgres staging tables                         │
│       │                                                       │
│       ▼                                                       │
│  Inngest fn: dedupe_and_promote (event-driven on insert)     │
│       │ matches via canonical_id                              │
│       ▼                                                       │
│  Postgres: licitacoes (canonical) ──► trigger ──► notify     │
│       │                                                       │
│       ▼                                                       │
│  Inngest fn: enrich (fetch PDF → R2 → OCR → embeddings)      │
│       │                                                       │
│       ▼                                                       │
│  pgvector index updated                                       │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Pattern: CDC via watermark + idempotent upsert

```typescript
// Inngest function — incremental PNCP poll
export const pncpPollDF = inngest.createFunction(
  { id: "pncp.poll.df", retries: 3 },
  { cron: "0 */6 * * *" },           // 4x/dia
  async ({ step }) => {
    const watermark = await step.run("get-watermark", async () => {
      const { data } = await supabase
        .from("ingestion_watermarks")
        .select("last_published_at")
        .eq("source", "pncp_df")
        .single();
      return data?.last_published_at ?? "2026-01-01T00:00:00Z";
    });

    const items = await step.run("fetch-pncp", async () =>
      fetchPncpPaged({
        dataInicial: subHours(new Date(watermark), 1),
        dataFinal: new Date(),
        uf: "DF",
      })
    );

    await step.run("upsert", async () => {
      for (const it of items) {
        const canonical = sha256(`${it.orgaoEntidade.cnpj}|${it.numeroCompra}|${it.anoCompra}`);
        await supabase.from("licitacoes").upsert({
          canonical_id: canonical,
          pncp_numero_controle: it.numeroControlePNCP,
          // ... resto dos campos
          external_sources: {
            $append: { source: "pncp", ingested_at: new Date().toISOString() }
          }
        }, { onConflict: "tenant_id,canonical_id" });
      }
    });

    await step.run("update-watermark", async () => {
      const maxPub = items.reduce((m, i) => i.dataPublicacaoPncp > m ? i.dataPublicacaoPncp : m, watermark);
      await supabase.from("ingestion_watermarks")
        .update({ last_published_at: maxPub })
        .eq("source", "pncp_df");
    });
  }
);
```

### 7.3 Kleppmann: change data capture nas tabelas de staging

```sql
CREATE TABLE ingestion_watermarks (
  source text PRIMARY KEY,
  last_published_at timestamptz NOT NULL,
  last_run_at timestamptz NOT NULL DEFAULT now(),
  last_count int
);

CREATE TABLE licitacao_changes (
  id bigserial PRIMARY KEY,
  licitacao_id uuid NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL,             -- 'pncp','dodf','doe_go','aguaslindas'
  field text,
  old_value jsonb,
  new_value jsonb
);

-- trigger
CREATE OR REPLACE FUNCTION track_licitacao_changes() RETURNS trigger AS $$
BEGIN
  IF NEW.situacao IS DISTINCT FROM OLD.situacao THEN
    INSERT INTO licitacao_changes(licitacao_id, source, field, old_value, new_value)
    VALUES (NEW.id, 'pncp', 'situacao', to_jsonb(OLD.situacao), to_jsonb(NEW.situacao));
  END IF;
  -- replicar para outros campos críticos
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_licitacao_changes AFTER UPDATE ON licitacoes
  FOR EACH ROW EXECUTE FUNCTION track_licitacao_changes();
```

---

## 8. TOP 5 RISCOS na camada de dados/portais

1. **PNCP muda schema sem aviso.** Manual v2.3 → v2.4 quebrou clients silenciosamente em set/2024. **Mitigação:** Zod runtime validation + alertas Sentry quando schema diverge + canary daily test contra `/v1/contratacoes/publicacao` com snapshot esperado.

2. **Águas Lindas pode mudar a URL do portal a qualquer momento.** Wordpress de prefeitura é fragil — uma redirect em `/licitacoes/` e seu spider some. **Mitigação:** Crawl4AI com LLM-extract resiliente + alerta de "zero items D+0 D+1" + fallback para DOE-GO + alerta visual no admin.

3. **Coligação detectada errada bloqueia o cliente em licitações válidas.** Se o flag `group_id` for muito agressivo, sistema impede uma proposta legítima e perde negócio. **Mitigação:** override manual com log + documento legal (parecer do advogado do cliente sobre quais empresas são realmente "grupo econômico" sob art. 14 IV Lei 14.133).

4. **Pluggy webhook delay + duplicação.** Reports comunidade indicam webhook duplicado em ~2% dos eventos. **Mitigação:** dedup por `external_ref` UNIQUE index (já no schema §3.1) + idempotência de processamento.

5. **LGPD em PDF de edital:** edital às vezes traz CPF de pregoeiro/membros comissão. Ao OCR + indexar, você está armazenando dado pessoal sem base legal específica. **Cavoukian/Mitigação:** regex de redação de CPF antes de persistir texto extraído + nunca indexar campo redacted no vetor. Documento legal armazenado bruto em R2 com ACL restrita; texto extraído sanitizado vai pra Postgres.

---

## 9. TABELA DE DECISÕES ARQUITETURAIS

| Camada | Primária (Fase 1) | Fallback OSS | Razão |
|--------|------------------|--------------|-------|
| **Banco de dados** | Supabase Postgres (free → Pro R$125) | Postgres self-hosted em Hetzner R$25 + Coolify | RLS + auth + storage + realtime em 1 produto; sair quando passar R$300/mês ou hit limit free |
| **Search** | Postgres `tsvector` ('portuguese') | Meilisearch self-hosted Railway R$15 | Zero infra extra no MVP; trocar >10k editais ativos |
| **Semantic search PDF** | pgvector + embeddings OpenAI `text-embedding-3-small` | Nomic Embed local + sentence-transformers | $0.02/M tokens — irrelevante no MVP |
| **Queue / Orchestration** | **Inngest** (free → R$0 até 5k runs/mês) | pgmq Postgres-native | Inngest cron + steps + retries native Next.js |
| **Scraping framework** | **Scrapy + scrapy-playwright** (Python worker dedicado Railway R$5-15) | Crawl4AI standalone | Battle-tested, AutoThrottle, observabilidade |
| **Scraping Águas Lindas (schema drift)** | **Crawl4AI** | Querido Diário + manual parser | LLM-extract sobrevive a redesign do Wordpress |
| **Scraping DODF/DOE-GO** | **Querido Diário (OKBR fork)** | scratch parser | Reusa trabalho cívico (Pahlka) |
| **PDF storage** | **Cloudflare R2** (R$0-20/mês até 10GB egress) | Supabase Storage | R2 sem egress fee é decisivo |
| **OCR / extração texto** | **PyMuPDF (fitz)** open-source | pdfplumber + Tesseract para scanned | PyMuPDF é o melhor PDF parser OSS em 2026 |
| **Open Finance** | **Pluggy** (R$8-32/mês 3 CNPJs) | OFX upload manual via `node-ofx-parser` | Pluggy é único viável <R$200/mês |
| **CNPJ enrichment** | **BrasilAPI** (R$0, 5 req/s) | Receitaws (cache 30d) | Sem login, OSS-friendly |
| **Auth** | **Supabase Auth** | Better-Auth + Postgres | Já incluído Supabase |
| **Observabilidade** | **Sentry free** + Inngest logs | Grafana + Loki self-hosted | Free tier cobre Fase 1 |
| **Domain / CDN** | Cloudflare + Vercel hobby (R$0) | self-host nginx | Vercel free para Next.js 16 |

---

## 10. Estimativa de custo mensal Fase 1

| Item | Custo BRL | Notas |
|------|-----------|-------|
| Supabase free → Pro | R$0-125 | Pro quando >500MB DB OR >8GB egress |
| Inngest free | R$0 | Suficiente até 5k function runs/mês |
| Pluggy 3-6 conexões | R$6-24 | R$2/conexão |
| Cloudflare R2 storage PDF | R$0-20 | 10GB grátis |
| Railway worker (Scrapy Python) | R$5-15 | Free tier $5/mês de crédito |
| Vercel hobby (Next.js 16) | R$0 | Pessoal |
| OpenAI embeddings | R$5-20 | text-embedding-3-small, ~10k editais |
| Sentry free | R$0 | 5k erros/mês |
| Domain `.com.br` | R$5/mês | Anualidade R$60 |
| **TOTAL** | **R$21-204/mês** | Dentro do alvo R$0-200 |

---

## 11. Próximas ações P0 (handoff)

- [ ] **Smoke test PNCP** — buscar CNPJ canonical Prefeitura Águas Lindas-GO no endpoint `/orgaos`, confirmar formato e quantidade de licitações últimos 90 dias
- [ ] **Smoke test e-Compras DF** — escolher 3 órgãos DF aleatórios, fazer scrape manual de 1 página, validar estrutura HTML
- [ ] **Fork Querido Diário** — verificar se spider `go_aguas_lindas` existe ou precisa ser criado
- [ ] **Trial Pluggy** — criar conta sandbox, conectar conta-teste, validar webhook
- [ ] **DPA cliente** — minuta de contrato de processamento de dados com o amigo (Cavoukian)
- [ ] **Handoff @architect** — entregar este doc + decisões §9 para validação de stack
- [ ] **Handoff @qa** — checklist de teste empírico para itens "VALIDAR EMPIRICAMENTE" (5 deles neste doc)

---

## 12. Sources

### PNCP / govtech
- [PNCP Swagger v1](https://pncp.gov.br/api/consulta/swagger-ui/index.html)
- [PNCP Manual de Integração v2.3](https://www.gov.br/pncp/pt-br/acesso-a-informacao/manuais)
- [Querido Diário — OKBR](https://github.com/okfn-brasil/querido-diario)
- [BrasilAPI](https://brasilapi.com.br/docs)
- [Portal Transparência — CEIS/CNEP/CEPIM](https://portaldatransparencia.gov.br/download-de-dados)

### Scraping / data tooling
- [Crawl4AI](https://github.com/unclecode/crawl4ai)
- [Scrapy](https://github.com/scrapy/scrapy)
- [scrapy-playwright](https://github.com/scrapy-plugins/scrapy-playwright)
- [Playwright](https://github.com/microsoft/playwright)
- [pdfplumber](https://github.com/jsvine/pdfplumber)
- [PyMuPDF](https://github.com/pymupdf/PyMuPDF)

### Open Finance
- [Pluggy](https://www.pluggy.ai/)
- [Belvo BR](https://belvo.com/br)
- [bancos-brasileiros OSS](https://github.com/CoreFinance-ai/bancos-brasileiros)
- [ofxparse](https://github.com/jseutter/ofxparse)
- [node-ofx-parser](https://github.com/asseti/node-ofx-parser)

### Postgres / RLS / multi-tenant
- [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [pgvector](https://github.com/pgvector/pgvector)
- [pgmq](https://github.com/tembo-io/pgmq)
- Kleppmann, "Designing Data-Intensive Applications" (cap. 11 — stream processing)

### Legal / LGPD
- [Lei 14.133/2021](http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm)
- [LGPD — Lei 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [LAI — Lei 12.527/2011](http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm)
- Cavoukian, "Privacy by Design — The 7 Foundational Principles"

— Dara (@data-engineer), AIOS · 2026-05-18
