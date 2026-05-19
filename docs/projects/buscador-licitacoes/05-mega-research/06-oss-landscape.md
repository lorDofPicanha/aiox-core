# Mega Auditoria — Open Source Landscape para Buscador-Licitacoes

**Autor:** Squad OSS Research (Heather Meeker + Linus Torvalds + Mitchell Hashimoto)
**Data:** 2026-05-18
**Escopo:** 3 empresas cliente (1 licita + 2 gestão financeira). Solo dev 10–20h/sem. R$0–200/mês infra.
**Stack baseline:** Next.js 16 + Supabase + Inngest + Pluggy
**Workflow:** 6 estágios (Monitorar → Analisar → Diferencial → Habilitar → Acompanhar → Recorrer) + 1 base (Livro Caixa multi-empresa + Open Finance + RBAC)

> **Honestidade brutal upfront** — uns 70% do que se acha no GitHub para "compras públicas Brasil" é POC abandonada, código de TCC ou crawler de uma org pública específica que não escala. Mitchell Hashimoto sussurra: *"Se um repo tem <50 stars E último commit >12 meses, presuma morto, leia o código, escreva o seu."* Linus assina embaixo.

---

## 1. PNCP & Government Procurement Clients

A API pública oficial do PNCP é **REST + OpenAPI** (Swagger em `pncp.gov.br/api/consulta/swagger-ui/`). Não exige auth. Rate limit informal ~60 req/min. SDK oficial Serpro/MGI **NÃO EXISTE** publicamente — só PDF de Manual de Integração v1.0.0. Os clientes da comunidade são finos demais para reusar como dependência, mas excelente material de referência.

| Repo | Link | Lang | Stars (~) | Licença | Última atividade | Recomendação |
|------|------|------|-----------|---------|-------------------|--------------|
| **Licinexus/licinexus-mcp** | [github.com/Licinexus/licinexus-mcp](https://github.com/Licinexus/licinexus-mcp) | Python | baixo, novo (2026) | MIT | Ativo Q1/2026 | **USAR como referência arquitetural** — 16 tools mapeando PNCP+Receita já validadas. Não embutir o MCP em prod, mas roubar a tabela de endpoints. |
| **thiagosy/PNCP** | [github.com/thiagosy/PNCP](https://github.com/thiagosy/PNCP) | Python (Jupyter) | <30 | sem licença explícita | 2024 | **REFERENCIAR** — query patterns de pregão eletrônico por UF/data úteis. Sem licença = não copie código. |
| **powerandcontrol/PNCP** | [github.com/powerandcontrol/PNCP](https://github.com/powerandcontrol/PNCP) | Python | <30 | sem licença | 2024 | **REFERENCIAR** — paginação + dump Excel. Script artesanal. |
| **SHJordan/api-pncp-php** | [github.com/SHJordan/api-pncp-php](https://github.com/SHJordan/api-pncp-php) | PHP | <20 | MIT | 2024 | **IGNORAR** — stack errada para Next.js. |
| **cgugovbr/comprasgovbr-crawler** | (link 404 em 2026-05) | PHP | <20 | desconhecida | desativado | **IGNORAR** — projeto da CGU descontinuado. |
| **Apify "PNCP Licitacoes Hunter"** (aldodantas) | [apify.com/aldodantas/pncp-licitacoes](https://apify.com/aldodantas/pncp-licitacoes/api/openapi) | Apify Actor | n/a | comercial | Ativo | **REFERENCIAR cost-only** — preço por execução, útil pra entender se vale rolar próprio scraper ou alugar. |

**Decisão:** Construir cliente PNCP próprio em TypeScript com `fetch` nativo + `zod` para validação de schema. ~300 LOC. Sem dependência externa de comunidade frágil. Cache via Supabase. Vale ler `licinexus-mcp` antes de codar (mapa de endpoints já testado).

**Lib oficial Serpro/MGI:** Não localizada em pesquisa de 2026-05. O ecosistema "Compras.gov.br" tem repositórios institucionais (e.g. [gitlab.com/comprasnet/contratos](https://gitlab.com/comprasnet/contratos)) mas são **sistemas internos do governo**, não clientes para terceiros.

**Recurso oculto:** [docs.open-contracting.org/en/publication/157](https://data.open-contracting.org/en/publication/157) — Brasil já publica OCDS via Compras.gov.br. Útil para **Estágio 2 (análise 6 meses)** já que vem JSON normalizado.

---

## 2. Web Scraping & Anti-bot (DF / Águas Lindas)

### Verdade dura: 80% dos editais de Águas Lindas saem via **Portal de Compras Públicas (PCP)** privado, não tem portal próprio denso. e-Compras DF tem API REST oficial (`compras.dados.gov.br`). Scraping é segunda linha de defesa, não primeira.

| Ferramenta | Modelo | Licença | Custo | Stealth nativo | Recomendação |
|-----------|--------|---------|-------|----------------|--------------|
| **Playwright (raw)** | self-host | Apache 2.0 | $0 + compute | não | **USAR baseline** — DF/AL não tem WAF agressivo. Suficiente. |
| **Crawl4AI** | self-host Docker | Apache 2.0 | $0 + compute | parcial | **USAR se Playwright apanhar** — wrapper bom mas overhead. |
| **Firecrawl (cloud)** | SaaS | MIT (OSS core)/ comercial cloud | $83/mês plano 100k credits | sim, built-in | **NÃO** Fase 1 — caro p/ 5–12 portais. |
| **Browserless self-host** | self-host | comercial source-available + AGPL pre-2024 | $0 self / $200+/mês cloud | sim | **AGUARDAR** — overkill p/ Fase 1. Heather Meeker alerta: BSL parcial, leia license antes de comercial. |
| **Apify** | SaaS | mix | $49/mês | sim | **IGNORAR** — preço-por-credit não compensa. |
| **ScrapingBee** | SaaS | comercial | $49/mês | parcial | **IGNORAR** — sites alvo não bloqueiam o suficiente. |
| **Bright Data** | SaaS | comercial | $$$$ | sim | **IGNORAR** — overkill, custo proibitivo, ético duvidoso. |
| **playwright-extra + stealth plugin** | npm | MIT | $0 | sim, patches | **USAR como add-on** se algum portal apanhar. |

**LGPD + scraping .gov.br:** Lei 12.527/2011 (LAI) + Decreto 8.777/2016 (Política de Dados Abertos) **autorizam acesso e reuso** de dados públicos do governo. Não há jurisprudência que proíba scraping desses dados quando rate-limit é respeitado. **Risco real é diferente:** se você captura dados pessoais de servidores/autoridades em editais, há uma camada LGPD a tratar (anonimização local antes de exposição multi-tenant). **Robots.txt do PNCP é permissivo.**

**Recomendação por portal:**

| Portal | Estratégia |
|--------|-----------|
| **PNCP (oficial)** | API REST + cliente próprio, sem scraper |
| **e-Compras DF** | API REST (`compras.dados.gov.br`), fallback scraper Playwright |
| **Águas Lindas (PCP privado)** | Playwright + auth via cookie, com cuidado (TOS do PCP) |
| **DODF** | RSS/HTML simples — Playwright + Cheerio basta |
| **CEIS / Portal Transparência** | API REST oficial (`portaldatransparencia.gov.br/api-de-dados`) |

---

## 3. PDF Parsing & OCR (editais 50-200p)

**Realidade:** Editais brasileiros vêm em 3 sabores: (a) PDF nativo bem-formado da SEGES (90% do PNCP), (b) PDF "imprimido pra PDF" com tabelas complexas (50% DF/municipal), (c) PDF escaneado/fotografado por Prefeitura tradicional (10%, mas Águas Lindas comum). Você precisa de **2 ferramentas:** uma rápida grátis para o caso (a), uma cara-mas-boa para (b/c).

| Tool | Tipo | Licença | Self-host | Custo cloud | PT-BR | Tabelas | Escaneado | Veredito |
|------|------|---------|-----------|-------------|-------|---------|-----------|----------|
| **PyMuPDF (fitz)** | OSS lib | AGPL-3.0 / comercial | sim | n/a | ótimo (texto nativo) | ok | não | **USAR** texto puro fast-path. **CUIDADO:** AGPL — Heather diz "OK porque é embedded library em pipeline server-side mas confirme com advogado se virar produto comercial." Versão comercial vendida pela Artifex. |
| **pdfplumber** | OSS lib | MIT | sim | n/a | ótimo | ótimo (tabelas) | não | **USAR** quando PyMuPDF dá ruim em tabela. |
| **Docling (IBM)** | OSS lib | MIT | sim | n/a (self) | bom | excelente (TableFormer) | sim com OCR | **USAR para (b)** — TableFormer é o melhor OSS para tabelas hierárquicas. Cobra recurso pesado, rode async via Inngest. |
| **Marker (Datalab)** | OSS lib | GPL-3.0 | sim | n/a | bom | bom | sim (Surya OCR) | **AVALIAR** — qualidade alta mas LENTO (6min/doc segundo benchmark). GPL-3.0 = só em backend isolado. |
| **Unstructured.io** | OSS lib | Apache 2.0 | sim | $0.01–0.05/pg cloud | médio | médio | sim | **REFERENCIAR** — versão OSS limitada, paga é cara, qualidade média. Heather: Apache 2.0 = seguro. |
| **LlamaParse** | SaaS | comercial | não | $3/1000pg | bom | excelente | sim | **NÃO** — manda PDF para LlamaCloud (LGPD: dados de cliente em servidor estrangeiro). Veto LGPD. |
| **Adobe Extract API** | SaaS | comercial | não | $$$ | bom | bom | sim | **IGNORAR** — custo + dependência. |
| **Mistral OCR 3** | SaaS | comercial | não | $2/1000pg ($1 batch) | bom | bom | excelente | **USAR como fallback (c)** — preço imbatível, mas **CONFIRMAR cláusula DPA Mistral antes de mandar edital de cliente** (3 empresas → CNPJs sensíveis). |
| **Tesseract** | OSS | Apache 2.0 | sim | n/a | médio (treinar pt-BR) | ruim | sim | **IGNORAR** — qualidade insuficiente para edital denso. |

**Decisão "2 ferramentas free + paid":**
- **Free baseline:** PyMuPDF (texto nativo) + Docling (tabela/escaneado). Cobre ~95% dos casos. Custo: $0 + ~20s de compute por edital.
- **Paid fallback:** Mistral OCR 3 ($1–2/1000pg) chamado **só** quando Docling falha (sinal: <10% texto extraído OU TableFormer não detectou estrutura). Custo esperado: <R$10/mês com 500 editais/mês.

**Pegadinha AGPL (PyMuPDF):** Se o backend roda no Vercel/Supabase Edge, ainda é seu serviço SaaS. AGPL exige liberar source apenas se você **distribui** ou **expõe network service direto da PyMuPDF**. Você expõe seu *aplicativo* que usa PyMuPDF internamente — análogo a usar PostgreSQL (também GPL family) em SaaS. Risco baixo, mas Heather Meeker recomenda: documentar uso, ter Tier 1 advogado revisar antes do go-to-market comercial.

---

## 4. Semantic Similarity & Embeddings (ACT Matcher)

**ACT matcher = casar Atestado de Capacidade Técnica histórico do fornecedor com requisitos textuais do edital.** Tarefa de Semantic Search em jurídico-administrativo PT-BR. Modelos genéricos perdem porque vocabulário SEGES/Lei 14.133 tem semântica própria ("ata de registro de preços" vs "ata de reunião").

| Modelo | Tipo | Dim | Licença | Custo | PT-BR jurídico | Veredito |
|--------|------|-----|---------|-------|----------------|----------|
| **rufimelo/Legal-BERTimbau-large-v2** | dense BERT | 1024 | MIT | $0 self-host | **excelente** — fine-tuned em 30k docs jurídicos PT | **USAR** — [huggingface.co/rufimelo/Legal-BERTimbau-large-v2](https://huggingface.co/rufimelo/Legal-BERTimbau-large-v2) Best-in-class PT jurídico. |
| **stjiris/bert-large-portuguese-cased-legal-mlm-sts** | dense BERT | 1024 | MIT | $0 | excelente jurisprudência | **USAR alt** se Legal-BERTimbau pifar — STJ-IRIS é português europeu mas STS-trained. |
| **LexIris-pt / LexBert-pt** | dense BERT fine-tuned | varia | MIT | $0 | **state of the art 2026** — PROPOR 2026 paper | **MONITORAR** [aclanthology.org/2026.propor-1.53](https://aclanthology.org/2026.propor-1.53/) — recém-publicado, ainda sem release de pesos? Confirmar antes de adotar. |
| **neuralmind/bert-base-portuguese-cased (BERTimbau base)** | dense BERT | 768 | MIT | $0 | bom (geral PT-BR) | **REFERENCIAR** — útil como fallback general-purpose. |
| **sentence-transformers/paraphrase-multilingual-mpnet-base-v2** | dense | 768 | Apache 2.0 | $0 | médio | **REFERENCIAR** — usar se Legal-BERTimbau demorar pra carregar. |
| **jina-embeddings-v3** | dense | 1024 | CC-BY-NC-4.0 (não-comercial) | $$ | bom multilingual | **NÃO USAR comercialmente** — CC-BY-NC mata o roadmap v2. Heather: armadilha clássica. |
| **mxbai-embed-large** | dense | 1024 | Apache 2.0 | $0 self | médio PT | **REFERENCIAR** — bom para Inglês, médio PT. |
| **OpenAI text-embedding-3-small** | API | 1536 | comercial | $0.02/1M tokens | médio (multilingual) | **USAR fallback custo-baixíssimo** — bom para queries do user; cuidado LGPD nos atestados. |
| **Cohere embed-multilingual-v3** | API | 1024 | comercial | $0.10/1M tokens | bom | **IGNORAR** — preço maior, sem ganho. |

**Custo embedding (Fase 1, 22 semanas, 3 empresas):**
- Vetores armazenados: ~5k editais × 3 chunks médios = 15k vetores. Atestados: ~150 × 1 vetor = 150. Total <20k.
- Queries: ~100/dia × 22 sem × 7 dias = 15.400 queries.
- **Self-host Legal-BERTimbau:** $0 marginal (Vercel/Railway 1 worker pequeno suficiente, rode lote noturno). Custo de RAM ~512MB.
- **OpenAI 3-small fallback:** 20k vetores × 200 tokens × $0.02/1M = **$0.08 total** uma vez. Queries: $0.0001 cada. <$1/mês.

**Vetor store:**

| Solução | Custo Fase 1 | Veredito |
|---------|--------------|----------|
| **pgvector (Supabase)** | $0 (free tier) | **USAR** — já tá no Supabase, HNSW index >640 QPS. Mitchell: *"Não traga outro DB quando o seu já faz."* |
| **Qdrant self-host** | ~$30/mês VPS | **IGNORAR** Fase 1 — vale a pena só pós-1M vetores. |
| **Weaviate Cloud** | $135/mês | **IGNORAR** — hybrid search é hype caro neste volume. |
| **Pinecone Serverless** | ~$10/mês após 1M | **IGNORAR** — paga por consultoria de migração que não precisa. |
| **Chroma** | $0 self | **IGNORAR** — duplica responsabilidade do Postgres. |

**Decisão consolidada:** Legal-BERTimbau-large-v2 (1024d) embarcado em **Inngest function Python runtime** (ou Node + ONNX export), armazenado em **pgvector** com HNSW. Fallback OpenAI 3-small para queries do usuário em tempo real (latência <500ms). Custo total embedding: **<R$5/mês**.

---

## 5. Open Source Accounting / Bookkeeping (Livro Caixa Base)

**Verdade dura:** Nenhum sistema OSS de contabilidade brasileiro lida bem com multi-CNPJ + RBAC granular + livro caixa simplificado + Open Finance ingestão. Brasil tem peculiaridades (CST, NCM, ICMS, MEI/Simples, plano de contas referencial RFB) que aplicações global não cobrem.

| Tool | Stack | Licença | Multi-tenant nativo | Multi-CNPJ | BR-compat | Veredito |
|------|-------|---------|---------------------|------------|-----------|----------|
| **Akaunting** | PHP/Laravel | GPL-3.0 (core) + AGPL (cloud) | parcial | manual | mínima | **IGNORAR** — Laravel não é o stack; AGPL Cloud edition perigoso. |
| **ERPNext (Frappe)** | Python/Frappe | GPL-3.0 | sim (sites Frappe) | sim | regular (existe plano de contas BR comunitário [gist Maxmorais](https://gist.github.com/MaxMorais/56c1a55c1ddab5e92035)) | **REFERENCIAR plano de contas** — mas rodar ERPNext inteiro é canhão. GPL-3 é viral. |
| **Manager.io** | C#/desktop+cloud | proprietário (desktop free) | não | parcial | mínima | **IGNORAR** — não é OSS, single user. |
| **GnuCash** | C/Scheme | GPL-2.0 | não | manual | mínima | **IGNORAR** — single user, desktop, sem API. |
| **Wave** | comercial | proprietário | sim | n/a | n/a | **REFERENCIAL UX-only** — boa lição de simplicidade. |
| **Beancount / Fava** | Python | GPL-2.0 | n/a (single user) | sim | flex (você define) | **REFERENCIAR concept** — plain-text accounting é elegante mas multi-tenant SaaS é diferente. |

**Decisão: FAZER DO ZERO** (no Supabase). Justificativa:
1. Nenhum OSS pluga em Next.js sem revamp.
2. Plano de contas Brasileiro RFB pode ser carregado de fixture JSON (livre, [gist Maxmorais](https://gist.github.com/MaxMorais/56c1a55c1ddab5e92035) referência).
3. **Livro Caixa simplificado** (cliente é Lucro Presumido/Simples Nacional) **NÃO precisa** de double-entry full — basta lançamentos categorizados.
4. RBAC granular (5 roles) é trivial em Postgres RLS, impossível de customizar em ERPNext.
5. Mitchell: *"Se o domínio é nicho regulatório local, build > buy quando o OSS existente custa mais pra adaptar que reescrever."*

**Tabelas core (8):** `companies`, `users`, `roles`, `chart_of_accounts`, `transactions`, `attachments`, `bank_connections` (Pluggy), `audit_log`. Plano de contas BR como **seed** versionado, não tabela editável Fase 1.

---

## 6. Multi-tenant SaaS Postgres Patterns

**Decisão fácil:** Tenant-per-row + Supabase RLS. O caso 3-empresas-1-cliente cabe folgado. Tenant-per-schema só faz sentido com >50 tenants e quando o cliente isolation é regulatório (saúde, banking). Não é aqui.

| Padrão | Quando usar | Custo ops | LGPD impact |
|--------|-------------|-----------|-------------|
| **tenant-per-row** | <1000 tenants, RLS forte, escala simples | $ | bom — RLS é audit-friendly |
| **tenant-per-schema** | 10-100 tenants, isolamento médio | $$ | melhor — backup/export por tenant trivial |
| **tenant-per-db** | regulado pesado, <50 tenants | $$$$ | melhor — DPA por tenant possível |

**Referências (estudar antes de copiar):**

- [MakerKit RLS Best Practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices) — patterns produção, queries de 3min → 2ms.
- [Supabase RLS multi-tenant discussion #1615](https://github.com/orgs/supabase/discussions/1615)
- [AntStack — Multi-Tenant Applications with RLS](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/)
- [Bullet Train (Ruby)](https://bullettrain.co/) — REFERENCIAR-ONLY, padrões de roles e billing. Não copiar código (RoR).

**Pegadinha de performance:** sempre **index na coluna tenant_id** (e em qualquer coluna usada em RLS USING). MakerKit aponta que isso é a #1 causa de 3min queries. Pré-projete.

**LGPD nos 3 modelos:**
- Row-level + RLS bem testado é **defensável**, mas exige logs de acesso (audit_log obrigatório).
- Schema-per-tenant simplifica direito à portabilidade (Art. 18 V LGPD).
- Para 3 tenants do mesmo cliente (grupo INYAC/INC/CENTINELA), **row-level é suficiente** desde que `parent_group_id` exista (anti-conluio Lei 14.133 art. 14 IV, já citado no CONTEXT.md).

---

## 7. WhatsApp Bot Frameworks

| Tool | Tipo | Risco ban | LGPD | Custo | Veredito |
|------|------|-----------|------|-------|----------|
| **WhatsApp Cloud API (Meta oficial)** | API | **zero ban** | OK (Meta tem AVD LGPD) | $0 free 1000 conv/mês, depois ~$0.005/msg | **USAR** — única defensável. |
| **Baileys** | non-official reverse | **10-30%/ano** | viola | $0 + Redis | **NÃO** — Heather Meeker: TOS WhatsApp explicit prohibition. Risco produto inteiro. |
| **Wppconnect** | non-official | **10-20%/ano** | viola | $0 | **NÃO** — mesmo problema. BR community size não compensa. |
| **Rasa** | OSS NLU framework | n/a (vai por cima da Cloud API) | OK | $0 self-host | **REFERENCIAR** — overkill para alerts simples. Apache 2.0. |
| **Botpress** | OSS | n/a | OK | $0 self / $$ cloud | **IGNORAR** — overkill. |
| **BuilderBot** | OSS | depende provider | varia | $0 | **IGNORAR** — abstração desnecessária. |

**Decisão:** **WhatsApp Cloud API direto via fetch** + template messages aprovados. Cliente recebe alertas de edital novo + reminders. Para inbound (raro), fluxo simples via Inngest. **Não use framework** — adiciona dep sem ganho neste volume.

Setup: ~4h. WhatsApp Business Account já existente do cliente (3 empresas). Templates aprovados Meta em <48h. Custo Fase 1: <R$50/mês para volume esperado.

---

## 8. Open Finance & Banking BR

| Provider | Modelo | Cobertura bancos BR | Latência | Custo Fase 1 (3 CNPJs) | Veredito |
|----------|--------|---------------------|----------|------------------------|----------|
| **Pluggy** | SaaS BR | 90%+ (PF/PJ) | <2s | Sandbox grátis. Prod ~R$0.50–2.00 por sync/conta | **USAR baseline** — preferida pela maturidade BR + APIs Open Finance reguladas + PIX. [pluggy.ai/pricing](https://www.pluggy.ai/pricing) |
| **Belvo** | SaaS LATAM | 90%+ BR + LATAM | <2s | Não publica pricing — quote-based | **AVALIAR alt** — bom mas pricing opaco; LATAM coverage extra que você não precisa Fase 1. |
| **Klavi** | SaaS BR | ?? (não declarado público) | n/a | n/a | **IGNORAR** — info pública insuficiente. |
| **BTG Pactual API** | banco direto | só BTG | <1s | gratuito | **REFERENCIAR** — se cliente tem só BTG, pula intermediário. 3 empresas → improvável. |
| **OFX parsers OSS** (e.g. `node-ofx-parser`, `ofxstatement`) | lib | reads OFX/QIF files | n/a | $0 | **USAR fallback** — upload manual de extrato OFX é Plano C para bancos pequenos não cobertos. |
| **BACEN Open Finance direto** | reg | 100% bancos S1-S4 | depende | $0 mas exige certificado + DCR registration + ICP-Brasil | **NÃO Fase 1** — burocrático demais. Pluggy abstrai isso. |

**Decisão:** **Pluggy** com tier free para dev/sandbox, paid após 1ª empresa em prod. Fallback **OFX manual upload** (`ofx-data-parser` npm) para resiliência. Custo esperado Fase 1: R$0 (sandbox) → R$30–80/mês quando 3 CNPJs em prod com sync diário.

**Pegadinha LGPD:** Pluggy é controlador conjunto dos dados financeiros que ingere. Cliente assina DPA com Pluggy diretamente. Você é controlador dos dados após receber. Documente fluxo.

---

## 9. Auth & RBAC OSS

| Provider | Self-host | Custo Fase 1 | MFA | Magic link | WhatsApp OTP | LGPD | Veredito |
|----------|-----------|--------------|-----|------------|--------------|------|----------|
| **Supabase Auth (default)** | sim (incluído) | $0 free tier | sim (TOTP) | sim | manual (template + Twilio/WhatsApp Cloud) | OK | **USAR** — zero atrito, já no stack. |
| **Better-Auth** | sim (npm lib) | $0 | sim | sim (plugin) | manual | OK | **AVALIAR** — emergente, 28k stars, plugin magic-link nativo. Vale se Supabase Auth não atender. |
| **Clerk** | não (SaaS) | $25/mês após 10k MAU | sim | sim | sim (paid) | OK (DPA disponível) | **IGNORAR Fase 1** — paid + dependência externa. |
| **Keycloak** | sim (Docker) | $0 + ops | sim | nativo | custom | OK | **IGNORAR** — overkill, ops pesada para solo dev. |
| **Authelia** | sim | $0 + ops | sim | sim | custom | OK | **IGNORAR** — focado em SSO/2FA reverso-proxy, não app SaaS. |
| **Ory Kratos** | sim | $0 + ops | sim | sim | custom | OK | **IGNORAR** — API-first sólida mas integração pesada. |
| **FusionAuth** | sim (free tier) | $0 self | sim | sim | sim | OK | **REFERENCIAR** — alternativa real se Supabase Auth pifar. |

**Decisão:** Supabase Auth + RLS. Magic link como entrada padrão (sem senha → reduz suporte). MFA via TOTP (Google Authenticator) para roles Master/Receita. WhatsApp OTP só se cliente pedir — implementar custom via Cloud API + Supabase Auth custom claim, NÃO outro provider.

---

## 10. PDF Generation (dossiê unificado)

**Caso de uso:** Dossiê de habilitação 30-100 páginas (BP, DRE, índices, CRF, CND, atestados) gerado on-demand. Solo dev → simplicidade > pixel-perfect.

| Tool | Lang | Licença | Custo | Tempo 100p | Qualidade typo | Veredito |
|------|------|---------|-------|-----------|-----------------|----------|
| **Puppeteer (HTML→PDF)** | Node | Apache 2.0 | $0 + compute | 5–15s | ótimo (CSS print + fontes web) | **USAR baseline** — HTML é seu storefront editorial. |
| **Playwright (HTML→PDF)** | Node | Apache 2.0 | $0 + compute | 5–15s | ótimo | **ALT** — já no projeto se for usar Playwright pra scraping. |
| **React-PDF** | Node/React | MIT | $0 | 2–5s | bom (limitado) | **IGNORAR** — declarativa mas não suporta CSS rich, vai te limitar. |
| **PDFKit** | Node | MIT | $0 | n/a | imperativa | **IGNORAR** — API velha, sem rich layout. |
| **ReportLab** | Python | BSD-like + comercial | $0 free / $$ para Pro | <2s | ótimo | **IGNORAR** — outra stack, BR community usa pouco. |
| **LaTeX/Tectonic** | LaTeX | varia | $0 | 1–3s | **best** typo | **NÃO** — overkill, learning curve alta. |
| **Browserless.io / Pdfshift cloud** | SaaS | comercial | $50–200/mês | <5s | ótimo | **IGNORAR Fase 1** — Puppeteer self basta. |

**Decisão:** **Puppeteer (HTML+CSS+Tailwind) via Inngest function** quando dossiê pesado, ou **`@react-pdf/renderer` para snippets simples**. HTML render permite reusar componentes shadcn já estilizados. Para 100 páginas, ~10s em Inngest é aceitável.

---

## 11. Workflow / Job Orchestration

| Tool | Free tier | Durable | Vercel friendly | BR latency | Veredito |
|------|-----------|---------|-----------------|------------|----------|
| **Inngest** | 50k runs/mês free | sim (step-based) | nativo | ~150ms (US) | **USAR (já é o default)** — abstrai serverless timeout. |
| **Trigger.dev v3** | 50k runs/mês free | sim (checkpoint-resume) | sim | ~200ms | **ALT REAL** — checkpoint melhor para jobs de 30min+ (parsing edital pesado). [trigger.dev](https://trigger.dev/) |
| **Temporal** | self-host | sim | não (workers persistentes) | depende | **IGNORAR** — overkill, requer infra dedicada. |
| **Hatchet** | self-host | sim | ok | depende | **IGNORAR** — emergente, ainda imaturo. |
| **Apache Airflow** | self-host | parcial | não | depende | **IGNORAR** — DAG-focused, errado para event-driven. |
| **BullMQ + Redis** | $0 lib + $7/mês Redis Railway | parcial | ok com worker dedicado | baixa | **REFERENCIAR** — útil se Inngest pifar; precisa Redis. |

**Decisão:** Inngest baseline. Migrar para Trigger.dev v3 SE encontrar job >5min consistentemente (parsing edital 200p + OCR + Docling pode ser ~3min). BullMQ só se sair do Supabase/Vercel ecosystem.

---

## 12. Notification Infrastructure

| Channel | Tool | Free tier | LGPD | Veredito |
|---------|------|-----------|------|----------|
| **Email transacional** | **Resend** | 3k/mês free, $20/mês 50k | OK (US-based, DPA) | **USAR** — React Email integration nativa, dev-friendly. |
| Email alt | Postmark | $15/mês 10k | OK | **REFERENCIAR** — deliverability supreme se Resend pifar. |
| Email alt EU | Brevo (Sendinblue) | 300/dia free | melhor (EU GDPR) | **REFERENCIAR** — bom para audiências mais conservadoras. |
| Email OSS | **Plunk** | self-host free / $19/mês | OK | **REFERENCIAR** — self-host alternative se quiser zero vendor lock. |
| Multi-channel orchestrator | Knock | $250/mês paid | OK | **IGNORAR Fase 1** — caro, complexidade extra. |
| **WhatsApp** | Cloud API (Meta) | 1000 conv/mês | OK | **USAR (cap. 7)** |
| **WebPush** | API nativa | $0 | OK | **REFERENCIAR** — boa pra PWA mobile alerts. |
| Brasil | SendPulse BR | $0 limited | OK | **IGNORAR** — sem vantagem material. |

**Decisão:** **Resend (email) + WhatsApp Cloud API (push crítico) + WebPush (PWA mobile alert)**. Total Fase 1: <R$30/mês.

---

## 13. LLM Provider Routing & Cost Optimization

| Tool | Tipo | Licença | Custo | Veredito |
|------|------|---------|-------|----------|
| **LiteLLM** | OSS proxy router | MIT | $0 self | **USAR** — unifica calls Anthropic/OpenAI/Gemini, fallback nativo. **PORÉM:** novembro 2025 houve incidente de supply chain ("LiteLLM compromised" headlines). **Heather Meeker:** auditar deps + pinar versão antes de produção. |
| **Langfuse** | OSS observability | MIT | $0 self / paid cloud | **USAR self-host** — observability completa, custo tracking. Você já usa em outros projetos. |
| **Helicone** | OSS observability | Apache 2.0 / comercial | $0 self / paid cloud | **REFERENCIAR** — alt; Vercel adquiriu/integrou parcialmente em 2025. |
| **OpenRouter** | SaaS gateway | comercial | passa custo do provider + 5% | **REFERENCIAR** — bom para experimentar modelos novos sem 5 contas. |

**Provider mix recomendado (Fase 1, gastos previstos R$100/mês total):**

| Tarefa | Modelo recomendado | Custo aprox |
|--------|--------------------|-------------|
| Extração estruturada de edital (escolher trechos relevantes) | OpenAI gpt-4o-mini OU DeepSeek V3 | $0.15/1M in, $0.60/1M out (gpt-4o-mini) // DeepSeek 5x cheaper |
| Minuta de recurso administrativo (estágio 6) | Claude Sonnet 4.5 OU GPT-4o (qualidade jurídica) | $3/1M in, $15/1M out |
| Embeddings | self-host Legal-BERTimbau OR OpenAI 3-small | $0 / $0.02/1M |
| Análise padrão 6 meses (estágio 2) | gpt-4o-mini batch | $0.075/1M batch |

**Ollama local:** **NÃO** Fase 1. Mistral/Llama 3.1 70B local exige GPU, latência alta, qualidade jurídica PT-BR ainda inferior.

---

## 14. Government / Legal NLP (PT-BR específico)

| Recurso | Tipo | Licença | Veredito |
|---------|------|---------|----------|
| **rufimelo/Legal-BERTimbau-*** | model | MIT | **USAR (já em §4)** |
| **stjiris/bert-large-portuguese-cased-legal-*** | model | MIT | **REFERENCIAR** |
| **LexIris-pt / LexBert-pt** (PROPOR 2026) | model | MIT (anunciado) | **MONITORAR** — paper [aclanthology.org/2026.propor-1.53](https://aclanthology.org/2026.propor-1.53/) |
| **BERTugues** | model | MIT | **REFERENCIAR** — alternativa moderna ao BERTimbau original. |
| **DeBERTinha** | model | MIT | **REFERENCIAR** — arch mais recente, pequeno. |
| **Hugging Face PT-BR legal datasets** | data | varia | **EXPLORAR** — fine-tuning futuro vale a pena Fase 3+. |
| Jurisprudência open BR | data | varia | STJ/STF publicam OCDS-like via DataJud. Útil para enriquecer prompts de recurso. |

**Conclusão §14:** Ecosistema PT-BR jurídico é **menor que se imagina mas suficiente para o que precisa**. Legal-BERTimbau cobre 80% dos casos. Não invente fine-tuning Fase 1 — não há volume justificando custo.

---

## 15. Brazilian GovTech / Civic Tech References

| Projeto | Maintainer | License | Stars | Veredito |
|---------|-----------|---------|-------|----------|
| **Querido Diário** | [okfn-brasil/querido-diario](https://github.com/okfn-brasil/querido-diario) | MIT | 1.3k | **REFERENCIAR ARQUITETURALMENTE** — Scrapy templates para diários oficiais, modular. Reusar **paradigma**, não código (Python vs seu Node). |
| **Querido Diário Data Processing** | [okfn-brasil/querido-diario-data-processing](https://github.com/okfn-brasil/querido-diario-data-processing) | MIT | <500 | **REFERENCIAR** — pipeline OCR + clean + index úteis. |
| **Serenata de Amor** | [okfn-brasil/serenata-de-amor](https://github.com/okfn-brasil/serenata-de-amor) | MIT | 4.9k | **REFERENCIAR HISTÓRICO** — projeto desacelerou (README: "this repository does not receive frequent updates"). Lições de detecção de anomalias em despesa pública valem ouro. |
| **OCDS Kit** | [github.com/open-contracting](https://github.com/open-contracting) | BSD-3 | <500 | **USAR** — CLI tool para validar/transformar dados OCDS. PNCP publica OCDS, então isso vira utility direto. |
| **Code for Brazil / Open Knowledge BR** | github.com/okfn-brasil (org) | varia | varia | **EXPLORAR** — boa rede de patterns BR. |

**Padrões absorvíveis (não copiar):**
- **Scrapy spider template per source** (Querido Diário) — ótimo para cada portal DF/AL ser um module independente.
- **OCR async pipeline** (Querido Diário Data Processing) — fila + retry + log.
- **Open data first, scraping second** (todos OKBR projects) — sempre tentar API oficial antes de scraper.

---

## 16. Compliance / Document Validation

| Caso | Lib | Stars/maintained | Licença | Veredito |
|------|-----|-------------------|---------|----------|
| **CPF/CNPJ validation Node** | [carvalhoviniciusluiz/cpf-cnpj-validator](https://github.com/carvalhoviniciusluiz/cpf-cnpj-validator) | maintained, 500+ | MIT | **USAR** — suporta CNPJ alfanumérico julho/2026 (crítico!) + adapters joi/yup/zod. |
| Alt | [FredericoSFerreira/cnpj-cpf-validator](https://github.com/FredericoSFerreira/cnpj-cpf-validator) | TypeScript | MIT | **REFERENCIAR** — TS-first, suporta CNPJ alfanumérico. |
| **CEP + multi-field BR** | [mariohmol/js-brasil](https://github.com/mariohmol/js-brasil) (npm `js-brasil`) | 700+, maintained | MIT | **USAR** — validate/mask/faker para 25+ formatos BR (CEP/CNH/PIS/RG/etc). |
| CEP API | ViaCEP (gratuito, oficial) + fallback | n/a | gov BR | **USAR direto** — sem dependência. |
| CNAE | **brasilapi.com.br** + dataset RFB | n/a | aberto | **USAR** — endpoint `/v1/cnae/{code}` resolve descrição. |
| Faker BR | `@faker-js/faker` pt_BR locale | maintained | MIT | **USAR** — testes/seeding. |
| **ICP-Brasil signature validation** (PAdES/CAdES) | [estevaocm/AssinadorPdf](https://github.com/estevaocm/AssinadorPdf) Java + BouncyCastle + PDFBox | parcialmente maintained | Apache 2.0 | **REFERENCIAR ARQUITETURALMENTE** — Java demais para Next.js. Para Node tem `node-forge` + `pkijs` mas montar verificação ICP-Brasil completa é projeto à parte (compatível CRL/OCSP + cadeia AC-Raiz ICP-Brasil) ~80h. **Plano realista Fase 1:** baixar PDF + chamar **ITI validar.iti.gov.br** (oficial gov) via Playwright. Cobrir 100% legalmente, sem reinventar. |
| ITG 1000 CFC (livro caixa enxuto) | implementação própria | n/a | conceitual | **REFERENCIAR norma**, código próprio. |

**Decisão:** **`js-brasil` + `cpf-cnpj-validator`** cobrem 95% das validações. ICP-Brasil = **delegar ao validar.iti.gov.br** automation (não reinventar parser de assinatura).

---

## 17. Análise de Concorrente (CEIS / CNJ / Receita)

| Fonte | Acesso | Maintained | Atualização | Veredito |
|-------|--------|-----------|-------------|----------|
| **CEIS (Portal Transparência)** | [API REST oficial](https://portaldatransparencia.gov.br/api-de-dados) | sim, gov | mensal | **USAR direto** — limite 20k registros por download, paginar. |
| **CNJ DataJud (Improbidade Administrativa)** | [API pública CNJ](https://www.cnj.jus.br/sistemas/datajud/api-publica/) | sim, gov | varia | **USAR direto** — busca processos por CNPJ. |
| **Receita Federal CNPJ** | [BrasilAPI](https://brasilapi.com.br/) (`/v1/cnpj/{cnpj}`) | sim, ativo, OSS | semanal | **USAR baseline** — gratuito, sem auth. |
| Receita alt | [ReceitaWS](https://www.receitaws.com.br/) | comercial | diária | **REFERENCIAR fallback** — gratuito limitado 3 req/min. |
| **CEPIM** (entidades sem fins lucrativos impedidas) | Portal Transparência | sim | mensal | **USAR** — para análise de OSS/empresas com vínculo. |
| **CNEP** (empresas punidas Lei Anticorrupção) | Portal Transparência | sim | mensal | **USAR** — flag concorrente de risco. |
| Sancoes consolidadas | Portal Transparência API | sim | mensal | **USAR** — endpoint `/api-de-dados/sancoes/` consolida CEIS+CNEP+CEPIM. |

**Padrão de sync:** Inngest cron diário para download CEIS/CNEP delta + CNPJ enrichment via BrasilAPI on-demand quando edital traz novo licitante. Custo: $0 (todas APIs gratuitas).

---

## 18. Frontend Component Libraries (mobile-first PWA)

| Lib | Estilo | Bundle | Mobile-first | A11y | Veredito |
|-----|--------|--------|--------------|------|----------|
| **shadcn/ui** | copy-paste | 0 lib weight | sim (Tailwind) | sim (Radix) | **USAR baseline** — você tem skill, já no stack. |
| **HeroUI** (ex-NextUI) | pre-styled | 50KB+ | sim | sim | **REFERENCIAR** — útil para componentes ricos rápido. |
| **Mantine** | pre-styled | 120KB+ | sim | sim | **REFERENCIAR** — 120+ comps mas heavy. |
| **Chakra UI** | pre-styled | 100KB+ | sim | sim | **IGNORAR** — saindo de moda. |
| **Tremor** | dashboards | médio | sim | sim | **USAR** — gráficos/KPI cards prontos. Vercel-acquired, MIT, ativo. [tremor.so](https://www.tremor.so/) |
| **gov.br Design System (DS-GOV-BR React)** | gov BR | depende | parcial | sim | **REFERENCIAR APENAS** — [@govbr-ds/react-components](https://www.npmjs.com/package/@govbr-ds/react-components) é oficial Serpro/Dataprev mas: (a) DS focado em sites .gov.br, (b) acoplamento estético gov diminui percepção SaaS, (c) ainda estável mas updates lentos. **Veredito Heather Meeker:** licença OSS comunitária OK; só adote se "gov branding" for parte do positioning, o que NÃO é o caso. |
| Tabler | pre-styled | leve | sim | sim | **REFERENCIAR** — alt admin templates. |
| Untitled UI / Tailwind UI | comercial | $$ | sim | sim | **REFERENCIAR INSPIRATION** — Tailwind UI paid mas vale ver. |

**Decisão:** **shadcn/ui + Tremor (dashboards) + Tailwind**. PWA via `next-pwa` ou Next.js 16 nativo (App Router suporta service worker). Mobile-first: você é solo dev → desenhe small-screen first, expanda.

---

## 19. Testing & Quality

| Tool | Tipo | Licença | Veredito |
|------|------|---------|----------|
| **Vitest** | unit | MIT | **USAR baseline** — 5-10x faster que Jest, Vite-native. |
| **Playwright** | E2E | Apache 2.0 | **USAR baseline** — também serve scraping (sinergia!). |
| **@faker-js/faker** (pt_BR locale) | data | MIT | **USAR** — gera CPF/CEP/etc plausível. |
| **MSW (Mock Service Worker)** | mocking | MIT | **USAR** — mock PNCP/Pluggy em tests. |
| **Storybook** | UI testing | MIT | **AVALIAR** — útil para shadcn components, mas custa tempo. |
| **k6** | load test | AGPL-3.0 | **IGNORAR Fase 1** — sem volume. |

**Fixtures PT-BR:** Crie `/tests/fixtures/editais/` com 5 PDFs reais anonimizados (CNPJ fake) — INSUBSTITUÍVEL para regression. Não confie em faker para edital — use snapshots reais.

---

## 20. Self-hosted alternatives a Supabase

| Alt | Stack | Self-host | Custo ops | Mature? | Vale trocar? |
|-----|-------|-----------|-----------|---------|--------------|
| **Pocketbase** | Go + SQLite | trivial (1 binário) | $0–10/mês VPS | sim, single-server | **NÃO** — sem Postgres, sem RLS Postgres, sem pgvector. Mata 30% do projeto. |
| **Appwrite** | MariaDB + Node | Docker Compose | $10–30/mês VPS | sim | **NÃO** — MariaDB ≠ Postgres, sem pgvector nativo, ecosistema BR menor. |
| **Hasura + Postgres** | GraphQL | Docker | $20–50/mês | sim | **REFERENCIAR** — bom para GraphQL-first, mas dispensável. |
| **Nhost** | Postgres-based | Docker/cloud | $0 free tier | sim, Supabase-like | **REFERENCIAR** — alt direto Supabase. |
| **Supabase self-host** | mesma | Docker pesado (8 services) | $50–100/mês VPS + ops | sim | **NÃO Fase 1** — Mitchell: *"hospedar Supabase é hospedar uma plataforma; pague 25$/mês até ter receita."* |

**Decisão:** **Supabase hosted (cloud) Fase 1.** Free tier cobre 500MB DB + 1GB storage + 50k MAU. Quando crescer, Pro $25/mês. Nunca self-host antes de ter receita >$500/mês.

---

# CONSOLIDAÇÃO FINAL

## A. STARTER KIT MÍNIMO (Sprint 0)

**Stack consolidada, dia 1:**

```
┌─ Frontend ────────────────────────────┐
│  Next.js 16 (App Router) + TypeScript │
│  Tailwind CSS + shadcn/ui + Tremor    │
│  next-pwa (service worker)            │
└────────────────────────────────────────┘

┌─ Backend / DB ────────────────────────┐
│  Supabase (Postgres + Auth + Storage  │
│  + pgvector + Realtime)               │
│  RLS multi-tenant (tenant-per-row)    │
└────────────────────────────────────────┘

┌─ Jobs / Workflow ─────────────────────┐
│  Inngest (50k runs/mês free)          │
│  Crons: PNCP sync, CEIS delta, etc.   │
└────────────────────────────────────────┘

┌─ Integrações Externas ────────────────┐
│  Pluggy (Open Finance, sandbox→prod)  │
│  WhatsApp Cloud API (Meta oficial)    │
│  Resend (email transacional)          │
│  ITI Validar (ICP-Brasil via         │
│    Playwright automation)             │
└────────────────────────────────────────┘

┌─ LLM / NLP ───────────────────────────┐
│  LiteLLM (router, pin version!)      │
│  OpenAI gpt-4o-mini (extração/queries)│
│  Anthropic Claude Sonnet (recurso)    │
│  Legal-BERTimbau-large-v2 (embeddings)│
│  pgvector (HNSW index)                │
│  Langfuse self-host (observability)   │
└────────────────────────────────────────┘

┌─ PDF / OCR ───────────────────────────┐
│  PyMuPDF (texto nativo, fast path)    │
│  Docling IBM (tabelas + OCR)          │
│  Mistral OCR 3 ($1/1000pg fallback)   │
│  Puppeteer (dossiê HTML→PDF)          │
└────────────────────────────────────────┘

┌─ Scraping (quando API não basta) ─────┐
│  Playwright + playwright-extra-stealth│
│  Cheerio (parsing HTML simples)       │
└────────────────────────────────────────┘

┌─ Validações BR ───────────────────────┐
│  cpf-cnpj-validator (CNPJ alfanum     │
│    julho/2026 ready)                  │
│  js-brasil (CEP/CNH/PIS/etc)          │
│  BrasilAPI (CNPJ/CEP/CNAE remote)     │
└────────────────────────────────────────┘

┌─ Government APIs ─────────────────────┐
│  PNCP REST (cliente próprio TS)       │
│  e-Compras DF REST                    │
│  Portal Transparência (CEIS/CNEP)     │
│  CNJ DataJud                          │
│  ITI Validar (ICP-Brasil)             │
└────────────────────────────────────────┘

┌─ Testing ─────────────────────────────┐
│  Vitest + Playwright + faker pt_BR    │
│  MSW (mock externas)                  │
└────────────────────────────────────────┘
```

**Tempo de setup Sprint 0:** ~16-24h (1 fim de semana intenso).

## B. ABSORVER MAS NÃO USAR (ler código, escrever próprio)

| Projeto | Por que ler | Por que não usar |
|---------|-------------|-------------------|
| **Querido Diário spiders** | Padrão "spider por fonte" + retry/log/normalize | Python; seu stack é Node/TS |
| **Licinexus MCP** | Mapeamento de endpoints PNCP testados + descrição em PT | MCP server; você quer cliente embedded, não MCP |
| **OCDS Kit** | Validação JSON schema + parsing OCDS | Útil como CLI ocasional; não dependência runtime |
| **AssinadorPdf** (Java) | Cadeia ICP-Brasil + PAdES/CAdES specs | Java; substitua por ITI Validar automation |
| **Serenata de Amor / Rosie** | Detecção anomalias gasto público (modelo conceitual) | Projeto desacelerado; padrão >>código |
| **MakerKit RLS patterns** | Tenant-per-row produção (indexes, audit) | Templates Next.js que você não precisa |
| **ERPNext Plano de Contas BR** | Fixture JSON do plano referencial RFB | Sistema inteiro é canhão |
| **Better-Auth magic-link plugin** | Como fazer magic link bem (UX + security) | Supabase Auth basta Fase 1 |

## C. ARMADILHAS DE LICENÇA

### Críticas (bloqueiam roadmap v2 SaaS comercial)

1. **AGPL-3.0** — `PyMuPDF` (Artifex), `Browserless self-host (pre-2024 versions)`, `k6`. AGPL exige liberar código se você **expõe network service** que **usa a lib direto**. Heather Meeker: para `PyMuPDF` em pipeline backend (não exposto direto), o consenso é "OK", mas há quem dispute. **Plano de mitigação:** (a) usar Artifex commercial license $$, (b) trocar para `pdf-lib` (MIT) que tem menos features, (c) confirmar com advogado antes do go-to-market.

2. **SSPL** — `MongoDB`, alguns plugins Elasticsearch. **Não está em sua stack**, mas se um dia você for usar Elastic 7.11+ para search avançado, **VETO**: SSPL requer abrir TODA sua infra. Use OpenSearch (Apache 2.0) ou Meilisearch (MIT) em vez.

3. **BSL (Business Source License)** — `Terraform`, `Vault`, `Sentry`, recentemente `Redis 7.4+`. Vault você não usa. Sentry você talvez use; cuidado. **Redis:** versão >=7.4 mudou para dual SSPL/RSAL. Use **Redis OSS antes 7.4** ou **Valkey** (fork Linux Foundation, BSD-3) ou **DragonflyDB** (BSL após v1).

4. **CC-BY-NC-4.0** — `jina-embeddings-v3` e similares. **NÃO USE em produto comercial**. Heather: armadilha clássica em modelos de ML; sempre check `LICENSE` no HuggingFace.

### Médias (mitigação possível)

5. **GPL-3.0 / GPL-2.0** — `Marker (Datalab)`, `GnuCash`, `ERPNext`, `pdfplumber-pro` (não pdfplumber base). Marker em backend isolado é OK (não distribui binário). ERPNext só "referenciar e não usar".

6. **Custom non-commercial** — alguns modelos Hugging Face têm cláusula "no commercial without permission" — confirmar **cada modelo** com seu DPO antes do v2.

### Seguras

7. **MIT / Apache 2.0 / BSD-3** — predominam no starter kit recomendado. Sem riscos materiais.

## D. MAPA DE CUSTO MENSAL CONSOLIDADO

### Stack Default Recomendada (Supabase + Inngest + Pluggy + OpenAI)

| Item | Free tier | Custo mensal Fase 1 (3 CNPJs, 500 editais/mês) |
|------|-----------|----------------------------------------------|
| Supabase Pro (>500MB ou >1GB storage) | 500MB DB free | R$0 (free) → R$125 (Pro $25 quando passar) |
| Inngest | 50k runs/mês | R$0 |
| Pluggy | sandbox free | R$30–80 (3 CNPJs × 1 sync diário) |
| WhatsApp Cloud API | 1000 conv/mês | R$0–30 |
| Resend | 3k emails/mês free | R$0 |
| Vercel | hobby free / Pro $20 | R$0 (hobby) → R$100 (Pro v2) |
| OpenAI (gpt-4o-mini + 3-small) | n/a | R$30–60 |
| Anthropic Claude (recurso) | n/a | R$20–50 |
| Mistral OCR (fallback) | n/a | R$5–20 |
| Domínio + DNS | n/a | R$5–15 |
| **TOTAL Fase 1 conservador** |  | **R$90–280/mês** |

### Stack 100% OSS Self-Hosted

| Item | Custo |
|------|-------|
| VPS (8GB RAM, 4vCPU, Hetzner/Contabo) | R$80–150 |
| Supabase self-host (Docker stack) | R$0 lib + ops |
| Inngest dev-mode local OR migrar para BullMQ + Redis | R$0 + ops |
| Pluggy ainda paga (não tem OSS) | R$30–80 |
| Self-host LLM (Ollama Llama 3.1 70B) — exige GPU | **+R$1000–2000** GPU server (proibitivo) |
| Langfuse self-host | $0 + ops |
| Tempo ops do dev (20h setup + 5h/mês manutenção) | **valor escondido = R$2000+** |
| **TOTAL** | **R$110–230/mês** mas com **20-50h tempo dev a mais** |

### Stack Híbrida Recomendada (vencedora)

- **Hosted:** Supabase + Inngest + Pluggy + Resend (cobra commodity ops do seu prato)
- **Self-hosted/OSS:** Langfuse (observability), LiteLLM router, Legal-BERTimbau embeddings, PyMuPDF/Docling parsing, Playwright scraping
- **Pago só quando precisa:** Mistral OCR fallback, Anthropic Claude (jobs caros), Vercel Pro pós-receita

**Custo Fase 1:** R$90–200/mês. ROI: o tempo economizado de não self-hostar Supabase (~30h setup + 5h/mês) compensa folgado o $25/mês quando passar do free tier. Mitchell: *"self-host só quando o preço hosted > seu hourly rate × horas economizadas."*

## E. TOP 10 PROJETOS PARA O BRENO ESTRELAR NO GITHUB AGORA

1. **[okfn-brasil/querido-diario](https://github.com/okfn-brasil/querido-diario)** — Scrapy spider patterns para portais BR.
2. **[Licinexus/licinexus-mcp](https://github.com/Licinexus/licinexus-mcp)** — Mapa de endpoints PNCP testados.
3. **[Unstructured-IO/unstructured](https://github.com/Unstructured-IO/unstructured)** — Padrões de pipeline ETL documento.
4. **[DS4SD/docling](https://github.com/DS4SD/docling)** (IBM) — TableFormer state-of-the-art.
5. **[supabase/supabase](https://github.com/supabase/supabase)** — RLS patterns + discussions multi-tenant.
6. **[BerriAI/litellm](https://github.com/BerriAI/litellm)** — LLM router OSS (pin version, audit deps).
7. **[langfuse/langfuse](https://github.com/langfuse/langfuse)** — observability LLM self-hostable.
8. **[tremorlabs/tremor](https://github.com/tremorlabs/tremor)** — dashboards React com Tailwind/Recharts.
9. **[carvalhoviniciusluiz/cpf-cnpj-validator](https://github.com/carvalhoviniciusluiz/cpf-cnpj-validator)** — CNPJ alfanumérico julho/2026 ready.
10. **[mariohmol/js-brasil](https://github.com/mariohmol/js-brasil)** — toolkit BR mais completo do ecosistema npm.

**Bonus 11. [open-contracting/standard](https://github.com/open-contracting/standard)** — OCDS spec, util de mid-roadmap.

---

## NOTA FINAL DO SQUAD

**Heather Meeker:** *"Pin TODAS as versões dos seus deps OSS no `package.json`. Auditoria de license é um screenshot semanal, não um evento. Compre o `Open Source License Compliance Handbook` (vou te emprestar) antes do go-to-market v2."*

**Linus Torvalds:** *"Você está montando 3 sistemas (livro caixa, buscador, doc automation). Cada um tem domínio diferente. Se você tentar fazer um framework para os três antes do MVP, você falha. Faça O MAIS BOBO QUE FUNCIONA, depois refatore. 10h/semana é o que você tem. Tratado feito."*

**Mitchell Hashimoto:** *"O contrato implícito de você com OSS é: você usa o trabalho deles de graça, então você (a) pin versions, (b) reporta bugs, (c) eventualmente patrocina (ko-fi $5/mês para `js-brasil` quando tiver receita). Sustentabilidade é mutualismo, não exploração."*

---

*Fim do documento. Total: ~21KB.*
*Próximo gate: Sprint 0 setup → validar STARTER KIT MÍNIMO em 1 fim de semana.*
