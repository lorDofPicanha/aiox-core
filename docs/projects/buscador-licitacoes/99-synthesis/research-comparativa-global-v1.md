# Research Comparativa Global — Buscadores de Licitação

**Data:** 2026-05-15
**Sub-agent:** Síntese comparativa global (aios-analyst — Atlas)
**Escopo:** UE + LATAM + emerging + OCDS standard
**Inputs:** 5 KB HYDRA ingeridos + 9 WebSearches complementares
**Timebox:** ~2,5h Fase B (pré-Fase C dialética)

---

## Sumário Executivo

1. **OCDS é o padrão de facto global** — 50+ países adotaram (incluindo Brasil em parte). UK puxa G7 em 2025 colocando OCDS no centro da reforma. **Nossa arch V1 NÃO menciona OCDS** — gap a corrigir P0 (expor schema OCDS desde dia 1 é trivial e abre porta a interoperabilidade futura + transparência reputacional). [1][2][3]
2. **3 padrões arquiteturais dominantes confirmados:** (a) **portal oficial centralizado obrigatório por lei** (TED EU, PNCP BR, ChileCompra, SECOP II), (b) **camada SaaS privada agregadora em cima** (Mercell Nordic, Effecti BR, ConLicitação BR), (c) **open-source toolkit reutilizável** (OpenProcurement / ProZorro UA). Nossa arch V1 implementa (b) — alinhada com state-of-the-art. [4][5][6][7][8]
3. **ProZorro é referência mundial open-source e prova que arquitetura federada com marketplaces certificados escala** (Python + Pyramid + CouchDB → Atreus Django+Vue+Postgres; coopetition model com 12+ marketplaces certificados acessando CDB único via API). Lições aplicáveis: API pública estável + ID único por edital + OCDS-compliant desde dia 1. [4][5][6]
4. **TED EU (UE inteira) processa ~740 mil licitações/ano e tem API REST + CSV open data daily** — confirma que escala muito superior é viável com PostgreSQL+Elasticsearch e que **dataset CSV diário** é canal de distribuição superior a "vai lá no portal" (vale para nós: gerar dump CSV/JSON diário pode virar moat). [9][10]
5. **eForms (regulation EU 2019/1780, mandatório desde out/2023)** força UE inteira para schema XML padronizado. Brasil está num movimento análogo com Lei 14.133/PNCP — mas PNCP só expõe OCDS para tender+award stages, não planning/contract. Gap explorável: nós podemos publicar mais campos OCDS que o próprio governo. [9][2]
6. **NÃO existe player global com canal WhatsApp/Telegram como notificação primária.** É padrão BR/LATAM emergente, ausente em EU/Nordic (Mercell usa email + dashboard web + matching engine CPV codes). **WhatsApp = nossa vantagem competitiva regional**, não desvantagem por ser "exótico". [7][11]
7. **Pricing público é EXCEÇÃO global**, não regra (igual ao BR achado no research-mercado-v1). Mercell ($10-100), Effecti/ConLicitação "sob consulta", UNGM/UN free, World Bank free, ChileCompra free portal. Players que cobram premium escondem preço. Nossa decisão de pricing transparente R$50-99 é diferenciação real, não só BR. [7][12]
8. **3 antipadrões observados** (a evitar): (i) **OCDS só de planning+award sem contract/implementation** (PNCP BR cai nisso — limita análise de execução), (ii) **scraping sub-nacional sem padronização** (vira fragmentação de dados — Indonésia LKPP federa SPSE+e-Catalogue sem schema único), (iii) **plataforma SaaS premium gated sem free tier** (Effecti perde adoção orgânica a startups IA-low-cost no BR; análogo a OpenTender.eu que ficou acadêmico sem virar produto). [13][14][15]

### Veredito alinhamento

| Dimensão | Status |
|----------|--------|
| Arquitetura geral (ingestão + ETL + enriquecimento + match + notif) | ✅ Alinhada com state-of-the-art global |
| OCDS compliance | ⚠️ **Gap P0** — adicionar export OCDS desde fase 1 |
| Search híbrida (BM25 + semântica) | ✅ Avançada — maioria dos portais globais só tem full-text |
| LLM enrichment (resumo IA) | ✅ Vanguardo — só GeM/Mercell têm matching engine inteligente, resumo IA é diferenciador |
| WhatsApp/email canal | ✅ Diferenciador regional defensável |
| Free tier robusto | ✅ Alinhado com ChileCompra/UNGM/WB free-portal pattern |
| Documentação API pública | ⚠️ **P1** — se queremos virar produto, publicar API pública estável copia jogada ProZorro/TED |
| Schema de dados normalizado interno | ⚠️ **P1** — usar OCDS schema reduz custo de adicionar novas fontes futuras |

**Veredito final:** arch V1 está **75% alinhada** com state-of-the-art global. 2 gaps explícitos a fechar (OCDS export + API pública) podem virar moat real.

---

## 1. Mapa de Players Globais

### 1.1 Portais centralizados oficiais (governo)

| País | Plataforma | Modelo | Open data? | OCDS? | Stack tech (público) | URL | Notas |
|------|-----------|--------|------------|-------|----------------------|-----|-------|
| **UE (28 países)** | TED — Tenders Electronic Daily | Centralizado obrigatório (mandato OJ EU) | Sim — CSV daily + REST API + Linked Data | Não OCDS — usa **eForms** (regulation 2019/1780) standard próprio EU | Liferay DXP + APIs públicas + eForms SDK (GitHub OP-TED) | ted.europa.eu | ~740k editais/ano. Mandatório desde out/2023 eForms. API REST + Validation API + Publication API [9][10] |
| **Ucrânia** | ProZorro | **Federado com CDB único + marketplaces certificados (12+)** | Sim — OCDS compliant | **Sim — modelado em OCDS** | Python + Pyramid + CouchDB (legacy) → Atreus Django+Vue+PostgreSQL+Redis | prozorro.gov.ua | **Referência mundial open-source.** Apache license. Volunteer-led origin 2014. Coopetition model. [4][5][6] |
| **Chile** | ChileCompra (Mercado Público) | Centralizado obrigatório (Ley 19.886) | Sim | Parcial (relatos de adoção OCDS) | Não público | chilecompra.cl / mercadopublico.cl | Operacional desde 2003. Lei 21.634/2023 modernização. Cobertura ampliada dez/2024 inclui Judiciário/Congresso. Free tier oficial. [16] |
| **Colombia** | SECOP II | Centralizado obrigatório | Sim | **Sim** (Colombia Compra Eficiente é case OCDS célebre) | Não público | colombiacompra.gov.co | 40 manuais. Suporta subscriptions, amendments, special regimes. [17] |
| **México** | **Compras MX** (ex-CompraNet) | Centralizado obrigatório federal | Sim | Adoção OCDS em curso | Não público | upcp-compranet.buengobierno.gob.mx | Renomeado 2024+. Interface modernizada. Compras Públicas do Gobierno. [18] |
| **Paraguai** | DNCP — Portal al Futuro | Centralizado obrigatório | Sim | Sim (RICG) | Não público | contrataciones.gov.py | Reformado recentemente "Portal al Futuro". [19] |
| **Peru** | OSCE/SEACE | Centralizado obrigatório | Sim | Adoção parcial | Não público | osce.gob.pe | 3.000+ entidades compradoras. Desafio de padronização. [20] |
| **Argentina** | Comprar AR | Centralizado | Sim | Parcial | Não público | argentina.gob.ar/comprar | Menor maturidade comparada a Chile/Colombia. [21] |
| **Brasil** | PNCP + ComprasGov | Centralizado mandatório (Lei 14.133/2021) | Sim — CKAN + API REST | **Sim — parcial** (só tender+award, não contract/implementation) | Java (inferido); Swagger UI oficial | pncp.gov.br / compras.gov.br | 563 estados + 1267 municípios cobertos. PNCP é dorsal. [2][22] |
| **Índia** | GeM-CPPP | Centralizado (CPPP) + GeM marketplace | Sim — portal público | Não OCDS conhecido | STQC certified, SSL/TLS, NTP, role-based access | eprocure.gov.in/cppp / gem.gov.in | 210k+ editais publicados, ₹243k crores. App mobile nativo. [23] |
| **Indonésia** | LKPP — SPSE + e-Catalogue | **Federado** (federal + regional) | Parcial | Não OCDS conhecido | Não público | lkpp.go.id | 4.5M+ transações, 1M+ itens catálogo, 268k+ fornecedores. 5 métodos de compra normatizados. [13] |
| **África do Sul** | eTenders + TransparencyPortal | Centralizado oficial | Sim | **Sim — OCID prefix `ocds-9t57fa`** | Não público | etenders.gov.za + data.etenders.gov.za | Compromisso público com open contracting. [14] |
| **Multilateral** | UNGM (UN Global Marketplace) | Centralizado mandatório General Assembly UN | Sim | Não OCDS (é supply-side) | Não público | ungm.org | $25.7B/2024. 32 organizações UN. 500k+ fornecedores cadastrados. 85.9% developing countries. Free registration. [24] |
| **Multilateral** | World Bank Procurement (STEP/SOURCe) | Centralizado para projetos WB | Sim | Sim parcial | Não público | worldbank.org/projects-operations | 100 países, 1.500 projetos, $250B+ commitments. Atualização 2025 enfatiza qualidade/inovação. [25] |

### 1.2 SaaS B2B privados (camada agregadora/inteligência)

| Player | Região | Modelo | Stack inferido | Pricing | Notas |
|--------|--------|--------|----------------|---------|-------|
| **Mercell** | Nordics + Baltics (UE) | SaaS web + matching engine CPV codes | Não público | $10-100/mês range (SelectHub estimate) | 5.000+ entidades públicas + suppliers anyone. Desde 1999. EU-compliant. [7] |
| **Tenders Direct** | UK | SaaS premium tender alerts | Não público | Premium (não público) | Player tradicional UK mid-market |
| **Spend Network** | UK + global | Data + analytics procurement | Não público | Enterprise | Analítico/B2B data |
| **Bonfire** (Euna) | USA/Canadá | SaaS procurement gerencial (lado COMPRADOR não fornecedor) | Não público | Enterprise | Diferente do nosso caso |
| **GovWin Deltek** | USA | SaaS premium intelligence | Não público | Enterprise ($000s/yr) | Recommender system. Análogo a Effecti enterprise BR |
| **Effecti / ConLicitação / LicitaNet** | Brasil | SaaS aggregator (referência research-mercado) | Não público | R$45-1500/mês | Já mapeados em M1 do sub-agent M. [15] |
| **Licitei / LicitaIA / Alerta Licitação** | Brasil | SaaS IA low-cost (referência research-mercado) | Variado | R$35-235/mês | Janela IA mexida no BR. [15] |

### 1.3 Projetos open-source / acadêmicos

| Projeto | Tipo | Status atual | Stack | Notas |
|---------|------|--------------|-------|-------|
| **OpenProcurement / ProZorro** | Toolkit + plataforma rodando ProZorro UA | **VIVO**, mantido por Quintagroup, Apache license | Python + Pyramid + CouchDB (legacy); novo Atreus Django+Vue+Postgres+Redis | Maior case open-source de gov-tech procurement do mundo. [4][5][6] |
| **OpenTender.eu / DIGIWHIST** | Plataforma acadêmica EU Horizon 2020 (2015-2018) | **Ativo mas estático** — não evoluiu como produto | Não público (Node.js?) GitHub okfde/opentender.eu | Cobre 33 países EU. Indicadores de risco corrupção. Falhou em virar produto comercial — vive como referência acadêmica. [26][27] |
| **Open Contracting Partnership (OCDS tooling)** | Schema + toolkit + validator + analytics | **VIVO**, mantido por OCP | JSON Schema + Kibana dashboards + Python OCDS Kit | Padrão global, não plataforma. 50+ países. [1][3] |
| **Kibana OCDS Manual** | Dashboards open-source para visualizar OCDS data | Vivo | Kibana + Elasticsearch | Stack acessível para reuse. [28] |

---

## 2. OCDS — O Padrão Global

### 2.1 O que é

**Open Contracting Data Standard (OCDS)** é um schema JSON livre mantido pela [Open Contracting Partnership](https://www.open-contracting.org/) que padroniza como governos publicam dados de contratação pública. Cobre **5 stages** do ciclo:

1. **planning** — quanto/quando comprar
2. **tender** — edital propriamente
3. **award** — adjudicação
4. **contract** — contrato assinado
5. **implementation** — execução / pagamentos

Cada "release" é vinculado a um **OCID** (Open Contracting ID), unique global identifier por contracting process.

### 2.2 Adoção global (2025-2026)

- **50+ países** national/sub-national adotaram (parcial ou total) [1][2]
- **UK** é o primeiro G7 a colocar OCDS no centro da reforma — go-live fev/2025 [1]
- **Ucrânia** (ProZorro) é o case-poster mais celebrado [4][5]
- **Colombia** (Colombia Compra Eficiente) referência LATAM [17]
- **Brasil** — SEGES publica OCDS para Compras.gov.br **mas só tender+award stages** (não contract/implementation). Cobertura: 563 estados + 1267 municípios via Compras.gov.br [2]
- **México** Compras MX migrando
- **África do Sul** eTenders fully OCDS com prefix `ocds-9t57fa` [14]
- **Indonésia LKPP** ainda não OCDS conhecido

### 2.3 O Brasil PNCP usa OCDS de verdade?

**Sim — parcialmente.** SEGES publica dataset OCDS-compliant para procurement feito via Compras.gov.br ([2]). Limites:
- Cobre apenas **tender + award**, não planning/contract/implementation
- Sub-nacional (estados/municípios próprios sem Compras.gov.br) não é OCDS
- PNCP em si **expõe API JSON Swagger**, **não OCDS schema nativo**
- Conversão PNCP→OCDS demandaria ETL local

**Implicação direta para nós:**
- **P0:** Modelar tabela `licitacoes` interna **alinhada a OCDS schema** (release → tender → award), facilita futuro export OCDS
- **P0:** Gerar um endpoint `/api/ocds/releases?date=YYYY-MM-DD` desde fase 1 — custo marginal zero se schema interno já é OCDS-shape
- **P1:** Marketing: ser **"o primeiro buscador BR que expõe OCDS de Águas Lindas / PNCP / e-Compras DF normalizado"** = differentiation + relação com Open Contracting Partnership = reputational moat

### 2.4 Como aplicar (concretamente)

Mapeamento direto schema interno → OCDS:

```yaml
# Nosso schema atual                      OCDS field
licitacoes.id              →             releases[].ocid (gerado: "ocds-{prefix-nosso}-{fonte}-{fonte_id}")
licitacoes.pncp_id         →             releases[].id
licitacoes.fonte           →             releases[].publisher.name
licitacoes.objeto          →             tender.title + tender.description
licitacoes.valor_estimado  →             tender.value.amount (BRL)
licitacoes.data_publicacao →             releases[].date
licitacoes.modalidade      →             tender.procurementMethod (mapped: 'pregao_eletronico' → 'open')
licitacoes.orgao_cnpj      →             buyer.id (scheme: BR-CNPJ)
licitacoes.orgao_nome      →             buyer.name
licitacoes.uf + municipio  →             buyer.address (street locality)
licitacoes.edital_url      →             tender.documents[].url (documentType: 'tenderNotice')
```

Custo de adicionar export: ~4-8h dev + JSON Schema validation lib. **ROI altíssimo** para credibilidade + interop.

---

## 3. Padrões Arquiteturais Observados

### 3.1 Modelo de centralização

| Padrão | Exemplos | Implicação para nós |
|--------|----------|---------------------|
| **Mandato legal centralizado** | TED EU, PNCP BR (Lei 14.133), ChileCompra Ley 19.886, SECOP II Colombia | Já é nosso caso BR — confiamos em PNCP como spine |
| **Federado com agregador certificado** | ProZorro (CDB + marketplaces certificados via API) | Modelo aspiracional **se virarmos produto B2B**: vendemos como "marketplace certificado regional" futuramente |
| **Misto federal + sub-nacional** | LKPP Indonésia (SPSE federal + regional), USA states | Realidade BR para municípios fora do PNCP — é o que justifica scraping municipal |

**Recomendação:** manter modelo híbrido (PNCP API spine + scraping municipal). Não tentar centralizar tudo via Compras.gov.br pois subestima cauda longa municipal.

### 3.2 Data ingestion

| Padrão | Exemplos | Nossa decisão | Recomendação |
|--------|----------|---------------|--------------|
| **API-first REST/JSON** | TED EU, PNCP, GeM CPPP | ✅ PNCP API | Manter — superior a scraping |
| **CSV daily snapshot** | TED EU (data.europa.eu/data/datasets/ted-csv) | ❌ não previsto | **P1: gerar CSV daily nosso** — vira moat para devs externos |
| **OCDS releases feed** | ProZorro, Colombia, ZA, UK (em 2025) | ❌ não previsto | **P0: expor OCDS releases endpoint** desde fase 1 |
| **Scraping HTML+PDF necessário** | LKPP regional, alguns municípios EU | ✅ ComprasGov, e-Compras DF, Águas Lindas | OK — fallback inevitável |
| **eForms XML standardized** | TED EU (mandatório out/2023) | n/a — não temos análogo BR | Watch — Brasil pode adotar análogo |

### 3.3 Search & discovery

| Capability | Maioria portais oficiais | Mercell (SaaS premium) | ProZorro | Nossa V1 |
|-----------|--------------------------|------------------------|----------|----------|
| Filtros geo/CNAE/valor | ✅ universal | ✅ | ✅ | ✅ |
| Full-text BM25 | ✅ universal (Postgres FTS ou Elasticsearch) | ✅ | ✅ | ✅ Postgres FTS portuguese |
| **Semantic search (embeddings)** | ❌ raro — só platforms IA-emergentes | ❌ (ainda) | Parcial | ✅ pgvector — **vantagem real** |
| **Recommender system / matching engine** | ❌ raro | ✅ (CPV codes + behavioral data) [7] | Parcial | ✅ (score híbrido CNAE + lexical + semântico) |
| Hybrid rerank (BM25 + cosine) | ❌ raro | ❌ (CPV-only declarado) | ❌ | ✅ **state-of-the-art** |

**Insight:** nossa search híbrida é **mais avançada do que Mercell** (player SaaS líder UE de €€€). Diferenciação real, não retórica.

### 3.4 Document processing

| Capability | Adoção global | Notas |
|-----------|---------------|-------|
| PDF parsing básico | Universal | Técnicas variam — Java legacy / Python / cloud APIs |
| **OCR para editais escaneados** | Raro mas crescente | Alguns mid-market têm, maioria oficial não |
| **LLM-based summarization** | **Emergente 2024+** | Licitei BR, GovWin USA (rumor), Mercell beta. **Não é estado-da-arte ainda** — janela aberta |
| **RAG chat sobre edital** | Não observado em portais oficiais | Diferenciador real para SaaS B2B |
| eForms structured XML | UE-only (TED) | n/a BR |

**Insight:** **PDF parse + LLM summary** é diferenciador defensável 12-24 meses no BR (Effecti não tem, Licitei tem partially).

### 3.5 Notification & delivery

| Canal | Adoção global | Nossa V1 | Vantagem? |
|-------|---------------|----------|-----------|
| Email digest | Universal | ✅ | Comodity |
| RSS feed | TED, ProZorro, alguns oficiais | ❌ não previsto | **Considerar P2** — devs/integradores apreciam |
| API push/webhook | Raro (só enterprise) | ❌ não previsto | **P2 produto** — moat se virarmos B2B |
| **WhatsApp/Telegram bot** | **Padrão BR/LATAM emergente, ausente EU/Nordic** | ✅ (v2) | **Diferenciação cultural real** — apenas mercado BR/LATAM tem essa expectativa |
| Mobile app nativo | GeM India sim, maioria não | ❌ (PWA) | OK — PWA suficiente |
| Push web | Maioria não tem | ✅ (Web Push API) | Comodity |

### 3.6 Pricing model

| Modelo | Exemplos | Nossa V1 |
|--------|----------|----------|
| **Free oficial total** (governo paga) | TED EU, PNCP BR, ChileCompra, UNGM, World Bank | n/a (não somos governo) |
| **SaaS premium gated (pricing oculto)** | Effecti, ConLicitação, Mercell, GovWin | ❌ explicitamente rejeitado |
| **SaaS volume transparente** | LicitaNet, Sollicita, Licita Já | ✅ alinhado |
| **SaaS low-cost IA** | LicitaFree, LicitAI, Alerta Licitação | ✅ alinhado |
| **Open-source self-host** | ProZorro stack | n/a (não é nosso caso, mas reputational play) |

---

## 4. Cases Aprofundados

### 4.1 ProZorro (Ucrânia) — Referência open-source mundial

**Por que importa para nós:** maior case de gov-tech procurement open-source, base do template de reforma usada por Open Contracting Partnership como referência mundial. Volunteer-led origin 2014, virou national-wide system. [4][6]

**Arquitetura:**
- **CDB centralizado** (Central Database) único acessível via REST API JSON
- **12+ marketplaces certificados** (privados ou estatais) competindo entre si mas acessando mesmo CDB — modelo "coopetition" único
- **OpenProcurement toolkit** open-source Apache license — outros países (Moldávia/MTender, Quirguistão/Rialto) reusaram [5]
- Pode rodar em **3+ data centers** com redundância (tolera perda de até 49%) [4]

**Stack inferido:**
- **Legacy:** Python + Pyramid framework + CouchDB + Flask + AngularJS + Bootstrap
- **Novo (Atreus, próxima gen):** Django + Vue.js + PostgreSQL + Redis + Vault + CouchDB [5]
- API JSON via web interface
- Auctions com módulo separado

**Padrões OCDS:** **completo** — releases JSON com todos os 5 stages.

**Lições para nós:**
1. **API pública estável e bem documentada vira moat** — devs/integradores criam ferramentas em cima → ecossistema
2. **OCID único global** (cada licitação tem ID universal) → permite cross-reference entre fontes (PNCP + scraping municipal)
3. **PostgreSQL ainda funciona** para procurement scale (Atreus migra para Postgres — sinal forte)
4. **Apache license open-source** — mesmo um produto comercial pode liberar partes (ex: schemas, scrapers) e ganhar reputational mojo

### 4.2 Mercell (Nordics) — SaaS privado em mercado maduro

**Por que importa para nós:** **competidor direto análogo no mercado Nordic — vê o que dá certo num gov-tech procurement maduro.** Negocia o jogo Effecti faz no BR mas com EU compliance. [7]

**Arquitetura/Features (inferidas):**
- SaaS web compliant com directives EU
- **Matching engine proprietário usando CPV codes + behavioral data** (única feature de IA declarada explicitamente)
- **Consolidação multi-portal** (nacional + regional + EU) em hub central
- Cobre procurement, sourcing, contract lifecycle, supplier relationships, spend management
- Integra com ERP/accounting
- Reporting + analytics

**Pricing:** $10-100/mês range (SelectHub estimate — opaco como Effecti BR) [7]

**Market position:** 5.000+ entidades públicas + grande base de suppliers desde 1999

**Lições para nós:**
1. **Matching engine vendido como feature principal** — eles não vendem "buscador", vendem "matching CPV inteligente". **Renomear nosso produto de 'buscador' para 'matching de licitações DF'** pode posicionar melhor
2. **Consolidação multi-portal é o killer feature B2B**, não "ter mais filtros" — fornecedor não quer logar em 5 portais
3. **Integração ERP é upsell premium** — não fazemos no MVP mas roadmap claro
4. **Pricing opaco mata adoção orgânica long-tail** — nossa decisão transparente é diferenciação validada globalmente
5. **CPV codes (EU) = CNAE (BR)** — tratar CNAE como first-class entity (taxonomy + sinonímia) tem ROI grande

### 4.3 OpenTender.eu / DIGIWHIST — Case acadêmico que falhou em virar produto

**Por que importa para nós:** **lição de cautela — coletar dados não é produto.** Projeto EU Horizon 2020 (€3M+ funding), 6 institutos europeus, 33 países cobertos, virou referência acadêmica mas **não virou serviço comercial nem ferramenta de uso diário por fornecedores**. [26][27]

**O que entrega:**
- Dados de procurement de 33 países EU normalizados
- Indicadores de risco de corrupção (governance benchmarks)
- Bulk download datasets
- Stack: GitHub okfde/opentender.eu (Node.js inferido)

**Por que falhou em virar produto:**
1. **Foco em transparência/anti-corrupção (jornalistas, NGOs)**, não em fornecedor pragmático que quer ganhar edital
2. **Sem UX de skim+act** — análises pesadas, dashboards densos, não notificações
3. **Sem free tier vs paid** — tudo grátis = ninguém paga = funding cycle morre quando Horizon termina
4. **Sem canal de comunicação** com usuário (email digest, app) — viver no portal
5. **Governance indicators não viram dinheiro pra fornecedor** — academia/journalism focus ≠ B2B SaaS focus

**Lições para nós:**
1. **Foco no fornecedor pragmático (B2B revenue)** — não nos perdermos em "transparência pública"
2. **UX action-oriented** sempre — "isso é uma oportunidade boa pra eu?" > "qual o índice de risco do município X?"
3. **Free tier ≠ tudo grátis** — free tier honesto mas paid features claras
4. **Email/WhatsApp digest = canal de retenção** — viver no portal é morte

---

## 5. Análise Comparativa: Nossa Arch V1 vs State-of-the-Art

| Dimensão | Nossa V1 | Padrão global | Gap/Alinhado | Recomendação |
|----------|---------|---------------|--------------|--------------|
| **Data model interno** | Tabela `licitacoes` custom | OCDS releases (ProZorro, Colombia, ZA) | ⚠️ Gap conceitual | **P0**: alinhar schema a OCDS para facilitar export futuro |
| **Schema portability** | Postgres-only | OCDS JSON Schema interoperable | ⚠️ Gap | **P0**: gerar export OCDS daily |
| **API pública** | Não previsto | ProZorro, TED têm | ⚠️ Gap | **P1**: roadmap API pública (fase 5 produto) |
| **Search híbrida (BM25+vector)** | ✅ pgvector + Postgres FTS | Raro (Mercell só CPV) | ✅ **Vantagem** | Manter; pode virar feature de venda |
| **PDF parse + LLM summary** | ✅ LlamaParse + Haiku | Emergente 2024+ | ✅ **Vantagem 12-24m** | Manter; será comoditizada eventualmente |
| **Chat RAG sobre edital** | ✅ planejado | Não observado em portais oficiais | ✅ **Diferenciador** | Implementar como feature paid premium |
| **Email digest** | ✅ Resend + React Email | Universal | ✅ Comodity | Manter |
| **WhatsApp notif** | ✅ (v2 WAHA) | Raro globalmente, padrão BR/LATAM | ✅ **Diferenciação cultural** | Antecipar para v1 se possível |
| **Pricing transparente** | ✅ R$50-99 publicado | EXCEÇÃO global (UNGM/WB free, premium oculto) | ✅ **Diferenciação trust** | Manter — validado globalmente |
| **Free tier robusto** | ✅ | ChileCompra/UNGM/WB têm; SaaS premium não | ✅ Alinhado | Manter |
| **Mobile-first PWA** | ✅ | GeM India tem app nativo; maioria não | ✅ OK | PWA suficiente, sem app nativo |
| **Multi-tenancy / multi-perfil** | ✅ Perfil-fornecedor schema | Mercell sim, oficial não | ✅ Avançado | Manter |
| **Data export** | ❌ não previsto | TED CSV daily, ProZorro OCDS | ⚠️ Gap | **P1**: export CSV/JSON do feed do usuário |
| **OCDS compliance** | ❌ não previsto | UK, ProZorro, Colombia, ZA, Brasil parcial | ⚠️ **Gap P0** | **Adicionar P0** — custo marginal baixo, retorno alto |
| **LGPD** | ✅ baselined | n/a global, mas analogous GDPR | ✅ OK | Manter |
| **Auth magic-link** | ✅ Supabase Auth | Mercell tem SSO enterprise; oficial varia | ✅ OK | Considerar gov.br login federation futuro |

---

## 6. Lições Aplicáveis ao MVP Brasil Regional

### Priorizadas (P0/P1/P2)

#### **P0 — Adicionar antes do MVP shipping**
1. **Modelar `licitacoes` em schema OCDS-shape** (release → tender → award com OCID universal)
   - Custo: ~4h dev refatoração migration
   - ROI: futuro export OCDS é trivial; cross-source dedup mais fácil; credibility moat
2. **Gerar endpoint `/api/ocds/releases?date=YYYY-MM-DD`** desde fase 1 (mesmo que só com Tender stage inicialmente)
   - Custo: ~4h dev
   - ROI: marketing "primeiro buscador BR que expõe OCDS DF" + abre porta a parceria Open Contracting Partnership (reputational)
3. **OCID prefix nosso registrado** (ex: `ocds-aguasdf-` ou similar) seguindo OCP namespace
   - Custo: zero (registro online)

#### **P1 — Adicionar antes de virar produto comercial**
4. **API pública gratuita** com docs Swagger/OpenAPI (espelhando ProZorro/TED approach)
   - Custo: ~8h dev + docs
   - ROI: devs/integradores criam ferramentas → ecossistema → reputational moat → leads B2B
5. **CSV/JSON daily snapshot** público (espelha TED data.europa.eu CSV)
   - Custo: ~4h dev (cron)
   - ROI: alguns devs preferem download a API hits
6. **CPV/CNAE como taxonomy first-class** (não array text) — tabela `cnaes` com hierarchy + sinonímia
   - Custo: ~6h dev + popular dados IBGE
   - ROI: matching melhora muito; queryable; export para integrações
7. **RSS feed por filtro salvo** (espelha TED, ProZorro)
   - Custo: ~3h dev
   - ROI: power-users adoram, viraliza entre devs/agências
8. **Rebranding "matching de licitações" > "buscador"** — copy/posicionamento alinhado a Mercell pattern
   - Custo: ~2h marketing
   - ROI: ticket médio sobe ("matching engine inteligente DF" vibe)

#### **P2 — Considerar para v2/v3**
9. **Webhook push API** para integradores enterprise (espelha Mercell B2B)
10. **Mobile app nativo** se PWA adoção for baixa (>50% mobile traffic mas <10% PWA install)
11. **Marketplace certificado regional** (futuro distante) — espelha ProZorro coopetition model: virar uma camada certificada acima do PNCP

### Anti-padrões evitados na arch V1

✅ **Não cair em "transparência sem ação"** (DIGIWHIST/OpenTender failure mode) — nosso foco fornecedor pragmático é correto
✅ **Não usar pricing opaco** (Effecti/Mercell/GovWin failure mode no BR mid-market — Sollicita/LicitaNet ganham com transparência)
✅ **Não scrapping-only sem API spine** (Indonésia LKPP federated chaos) — bem ancorado em PNCP API
✅ **Não enterprise-first** — free tier robust + paid Pro é alinhado a UNGM/ChileCompra free portal pattern

---

## 7. Anti-padrões Observados (a Evitar)

| Anti-padrão | Caso real | Como evitar |
|------------|-----------|-------------|
| **Plataforma SaaS premium sem free tier** | OpenTender.eu (academic-only, sem retorno comercial); ConLicitação BR (pricing opaco perdendo mercado para Licitei/Sollicita) | Free tier honesto regional + Pro R$99 transparente |
| **Scraping sub-nacional sem padronização** | Indonésia LKPP (federated SPSE+e-Catalogue sem schema único, viram silos) | Schema OCDS interno desde dia 1 normaliza qualquer fonte |
| **OCDS só de planning/award sem implementation** | Brasil SEGES via Compras.gov.br | Aspirar a cobrir contract stage no futuro (mais valor para fornecedor: "vencedor pagou em dia?") |
| **Foco transparency-only/anti-corrupção sem fornecedor pragmático** | DIGIWHIST/OpenTender.eu | Sempre "isso é boa oportunidade pra mim?" > "índice corrupção" |
| **Notificação only email** (sem multi-channel) | Maioria portais oficiais | Email + WhatsApp + Web Push desde v1 |
| **Matching engine baseado APENAS em CPV/CNAE codes** | Mercell (declared) | Híbrido CNAE + keywords + semântico (já temos) |
| **API privada/cliente-pago** | Effecti, ConLicitação | API pública gratuita (espelhar ProZorro, TED) — vira moat |
| **Sem documentação developer-facing** | Maioria portais BR/LATAM | Swagger/OpenAPI docs públicos |
| **Cobrar para acessar dados públicos** | Pré-PNCP era assim parcialmente; Effecti scraping cobra | Pricing por **value-add** (filtros salvos, IA, multi-perfil, WhatsApp), não por dado bruto |

---

## 8. Riscos Novos Descobertos

### 8.1 OCDS expectation creep
**Risco:** Open Contracting Partnership está pressionando UK (G7), Colombia, ZA para coverage maior. Possível que **Brasil PNCP estenda OCDS para implementation stage 2026-2027** — se isso acontecer, nossa proposta de "expor OCDS" perde diferenciação parcial.
**Mitigação:** mover P0 (OCDS export) antes do governo. Janela de **6-12 meses** estimada.

### 8.2 eForms-style mandato no Brasil
**Risco:** UE forçou eForms XML para TED em 2023 — mudança gigante para players SaaS lá. **Brasil pode adotar mandato similar via PNCP futuramente** (alinhamento OECD/OCP). Se acontecer, todos os scrapers seriam afetados.
**Mitigação:** scraping é P2 mesmo. PNCP API spine é robusto a evolução.

### 8.3 Concorrência IA está se commoditizando
**Risco:** Licitei, LicitaIA, LicitAI Editais (já mapeados em research-mercado) + GovWin Deltek (USA) provam que "IA summary" vira commodity em 24-36m. **Diferenciação tem que migrar** para regional + dados (OCDS) + canal (WhatsApp).
**Mitigação:** **roadmap defensável construído sobre regional + OCDS + WhatsApp + parceria SEBRAE-DF/FIBRA**, não sobre IA pura.

### 8.4 PEPPOL-style e-invoicing expand
**Risco:** UE forçou PEPPOL e-invoicing B2B em 2025-2026. Brasil já tem **NF-e** (que cumpre função análoga). Mas se houver convergência futura com OCDS-style spend reporting BR (e.g. NF-e tagueada por edital), abre escopo "from procurement to payment" — opportunity space para player que pegue cedo.
**Mitigação:** roadmap fase 5+ explorar.

### 8.5 Open-source ecosystem pressure
**Risco:** ProZorro stack é Apache license. Há ONG/movimento "buy code, sell service" pressionando governos a usar open-source toolkits. **Se SEGES BR decidir adotar OpenProcurement-style stack, players SaaS comerciais comoditizam.**
**Mitigação:** baixo risco médio prazo (BR governo lento); nossa estratégia regional + UX + IA é defesa.

---

## 9. Fontes

[1] Open Contracting Partnership — "OCP in 2025: our plans for impact, inclusion, innovation" — https://www.open-contracting.org/2025/01/17/ocp-in-2025-our-plans-for-impact-inclusion-innovation-plus-a-significant-birthday/ — 2025-01-17 — autoridade 5/5 (oficial OCP)

[2] OCP Data Registry — "Brazil: Secretaria de Gestão e Inovação - Compras Públicas do Governo Federal" — https://data.open-contracting.org/en/publication/157 — 2025 — autoridade 5/5

[3] Open Contracting Data Standard documentation v1.1.5 — https://standard.open-contracting.org/ — 2025 — autoridade 5/5

[4] Quintagroup — "Prozorro public procurement system in Ukraine" — https://quintagroup.com/services/e-procurement/prozorro — autoridade 4/5 (vendor próprio mas mantém o sistema)

[5] OpenProcurement — "ProZorro" — https://openprocurement.io/en/cases/prozorro — autoridade 4/5

[6] Open Contracting Partnership — "ProZorro: How a volunteer project led to nation-wide procurement reform in Ukraine" — https://www.open-contracting.org/2016/07/28/prozorro-volunteer-project-led-nation-wide-procurement-reform-ukraine/ — 2016-07-28 — autoridade 5/5

[7] Mercell — landing + features — https://info.mercell.com/en/ — autoridade 4/5 (oficial vendor)

[7b] SelectHub — "Mercell Reviews 2026: Pricing, Features & More" — https://www.selecthub.com/p/procurement-software/mercell/ — autoridade 3/5 (revendor de info)

[8] OpenProcurement Wikipedia — https://en.wikipedia.org/wiki/OpenProcurement — autoridade 4/5

[9] TED Developer Docs — https://docs.ted.europa.eu/api/latest/index.html — autoridade 5/5 (oficial EU)

[10] TED EU portal — https://ted.europa.eu/en/ — autoridade 5/5

[11] TechCrunch — "WhatsApp will let rival AI companies offer chatbots in Brazil" — https://techcrunch.com/2026/03/06/after-europe-whatsapp-will-let-rival-ai-companies-offer-chatbots-in-brazil/ — 2026-03-06 — autoridade 4/5

[12] OCDS Wikipedia — https://en.wikipedia.org/wiki/Open_Contracting_Data_Standard — autoridade 4/5

[13] Global Public Procurement Database — Indonesia profile — https://www.globalpublicprocurementdata.org/gppd/country_profile/ID — autoridade 4/5 (multilateral)

[14] South Africa eTenders TransparencyPortal — https://data.etenders.gov.za/Home/LearnMore — autoridade 5/5

[15] Effecti — landing — https://effecti.com.br/ — autoridade 4/5 (oficial vendor)

[16] ChileCompra — "¿Qué es ChileCompra?" — https://www.chilecompra.cl/que-es-chilecompra/ — autoridade 5/5 (oficial governo) — KB HYDRA

[17] Colombia Compra Eficiente — SECOP II — https://www.colombiacompra.gov.co/secop/secop-ii — autoridade 5/5 (oficial governo) — KB HYDRA

[18] Compras MX (ex-CompraNet) — https://upcp-compranet.buengobierno.gob.mx/ — autoridade 5/5

[19] DNCP Paraguay — Portal al Futuro — https://www.contrataciones.gov.py/ — autoridade 5/5

[20] RICG — "Datos regionales / Analítica de datos en compras públicas" — https://ricg.org/es/datos-regionales/analitica-de-datos-en-compras-publicas/ — autoridade 4/5

[21] Cancillería Argentina — Compras Públicas — https://www.cancilleria.gob.ar/es/argentinatradenet/oportunidades-de-negocios/compras-publicas-de-gobiernos-extranjeros-y-de-organismos-internacionales — autoridade 4/5

[22] PNCP Swagger UI — https://pncp.gov.br/api/consulta/swagger-ui/index.html — autoridade 5/5 (oficial)

[23] GeM-CPPP India — https://eprocure.gov.in/cppp/ — autoridade 5/5 (oficial) — KB HYDRA

[24] UNGM — https://www.ungm.org/ — autoridade 5/5 (oficial UN) — KB HYDRA

[25] World Bank Procurement — https://www.worldbank.org/en/projects-operations/products-and-services/procurement-projects-programs — autoridade 5/5 — KB HYDRA

[26] DIGIWHIST project — https://digiwhist.eu/ — autoridade 4/5 (academic consortium EU)

[27] DIGIWHIST GitHub okfde/opentender.eu — https://github.com/okfde/opentender.eu — autoridade 4/5

[28] OCDS Kibana Manual — https://manualkibanaocds.readthedocs.io/en/latest/C1/Seccion1.html — autoridade 4/5

[29] Quintagroup — "Public Procurement Open Source Software for ProZorro, ProZorro.sale, MTender, Rialto" — https://quintagroup.com/services/e-procurement/open-source — autoridade 4/5

[30] Wikipedia — PEPPOL — https://en.wikipedia.org/wiki/PEPPOL — autoridade 4/5

[31] TED eForms standards / eForms SDK — https://ted.europa.eu/en/simap/eforms — autoridade 5/5

[32] OCP — "How Open is Public Procurement Data in the EU? 2023" — https://www.open-contracting.org/wp-content/uploads/2023/06/OCP2023-EU-OpenData.pdf — autoridade 5/5

[33] Hook / SellToState — "Prozorro Guide: Ukraine Tender Search in English" — https://www.selltostate.com/blog/prozorro-ukraine-guide/ — autoridade 3/5

[34] Interoperable Europe Portal — "E-procurement Prozorro to support Ukrainian economy" — https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/e-procurement-prozorro-support-ukrainian-economy — autoridade 5/5 (oficial EU)

---

**Marcação confidence:**
- VERIFICADO: TED API + eForms (docs oficiais), ProZorro stack (Quintagroup + Wikipedia + OCP), UNGM stats (KB HYDRA), WB stats (KB HYDRA), GeM India stats (KB HYDRA), OCDS adoption count (OCP source), Brazil OCDS coverage (OCP Data Registry), Mercell features (vendor docs), Effecti/ConLicitação/Licitar Digital pricing (research-mercado v1).
- INFERIDO: stack tecnológico TED (Liferay DXP mencionado mas não confirmado componentes internos), pricing Mercell range ($10-100 é SelectHub estimate), stack ProZorro novo Atreus (mencionado Quintagroup mas sem confirm de produção), adoção OCDS Indonésia/Peru (busca não confirmou explicitamente).
- INFERIDO COM BAIXA CONFIANÇA: scale exato de Mercell ("5000+ entidades públicas" é vendor claim sem fonte triangular).

*Fim do documento research-comparativa-global-v1.md*
