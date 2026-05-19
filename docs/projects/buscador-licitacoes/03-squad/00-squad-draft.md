# Squad Draft — Buscador de Licitações DF+Águas Lindas

**Status:** 📝 DRAFT (será refinado após research completar)
**Princípio:** maior referência da área core = **Diretor do Projeto**

---

## Critério de Seleção

Para cada vertical técnica/funcional, identifico:
1. **A maior referência mundial viva** que escreveu/construiu/influenciou o estado da arte
2. **Por que ela é referência** (livro canônico, sistema construído, paper seminal)
3. **Como ela orienta o projeto** (que decisões ela influencia)

**Diretor do Projeto** = a referência da área core. Para este projeto, a área core é **sistemas de dados aplicados a domínio governamental/transparência** — não scraping per se, não IA per se, mas a articulação inteira em produto cívico/B2B.

---

## Candidatos a Diretor (3 finalistas — escolha após research)

### Opção A — **Jennifer Pahlka** 👑 (favorita preliminar)
- **Por que:** Fundadora da Code for America. Ex-Deputy CTO dos EUA. Autora de **"Recoding America: Why Government Is Failing in the Digital Age and How We Can Do Better"** (2023) — livro definitivo sobre digital gov, com foco real no que faz produto cívico funcionar.
- **Encaixe:** Nosso projeto é literalmente "consumir dados públicos mal organizados e devolver utilidade". É o tema dela.
- **Tradução em decisões:**
  - Foco em jobs-to-be-done do fornecedor, não em "feature bonita"
  - Aceitar que portais .gov.br são caóticos e construir resiliência (não esperar API limpa)
  - Free tier sempre disponível (princípio cívico)
  - Compliance LGPD sem teatro (lean privacy)
- **Verificar na research:** ela tem produção sobre Brasil ou só EUA?

### Opção B — **Aaron Swartz** (espiritual / posthumous)
- **Por que:** Pioneiro de scraping de dados governamentais (PACER), founder Reddit, criador RSS 1.0, ativista de open data. Suicídio em 2013.
- **Encaixe:** Se o projeto for declaradamente "abrir dados que já são públicos mas estão prisioneiros de portais ruins" — ele é o santo padroeiro.
- **Limitação:** Falecido. Inspiração, não consultor ativo.

### Opção C — **Martin Kleppmann**
- **Por que:** Autor de **"Designing Data-Intensive Applications"** (DDIA) — bíblia de sistemas de dados. Construiu LinkedIn data infra. Pesquisador Cambridge sobre CRDTs/colaboração distribuída.
- **Encaixe:** Se o projeto for visto primariamente como "data pipeline + search engine + classification", ele é a referência canônica.
- **Limitação:** Tecnicista demais — não fala produto cívico, fala só sistemas.

**Decisão preliminar:** Jennifer Pahlka como Diretora, com Kleppmann como "Arquiteto-Chefe" e Aaron Swartz no manifesto como inspiração de valores.

---

## Squad por Vertical (draft — refinar com research)

### 1. Regulatório / Jurídico Administrativo — **Marçal Justen Filho**
- **Por que:** Autor de "Comentários à Lei de Licitações e Contratos Administrativos" — referência inquestionável em direito de licitações no Brasil. 30+ anos de doutrina.
- **Decisões que orienta:** Como interpretar Lei 14.133 nas zonas cinzentas, qual modalidade exibir como default, prazos legais a respeitar nos alertas.

### 2. Portais-fonte / Open Data Gov — **Jennifer Pahlka** (também diretora) + **Tim Davies** (Open Data Charter)
- **Por que Davies:** Diretor do Open Data Charter, especialista em padrões internacionais de dados abertos (incluindo Open Contracting Data Standard — OCDS, que o PNCP segue).
- **Decisões que orienta:** Aderência ao OCDS, padronização cross-portal, push pelo dado limpo vs aceitação do dado sujo.

### 3. Web Scraping em Escala — **Pablo Hoffman** (Scrapinghub/Zyte founder)
- **Por que:** Co-criou Scrapy, fundou Scrapinghub (hoje Zyte), referência mundial em scraping ético + resiliente.
- **Decisões que orienta:** Arquitetura de crawlers, gestão de quebras, anti-bot ethical, infra Apify/Zyte vs self-hosted.

### 4. Parsing de PDF Denso (editais) — **Andrei Lopatenko** (parsing) ou **Manning College team** (LlamaIndex/LlamaParse — Jerry Liu)
- **Por que Jerry Liu:** Founder LlamaIndex/LlamaParse. Estado da arte em parsing de PDFs com tabelas/estruturas complexas para LLMs.
- **Decisões que orienta:** Pipeline PDF→chunks→embeddings, OCR vs nativo, custo vs precisão.

### 5. Search Engine / Information Retrieval — **Doug Cutting**
- **Por que:** Criador do **Lucene** (motor de Elasticsearch/Solr/OpenSearch) e do Hadoop. Referência absoluta em IR.
- **Decisões que orienta:** BM25 vs vetorial vs híbrido, indexing strategy, scoring custom para licitação.

### 6. NLP para Texto Jurídico Português — **Fábio Souza** (NeuralMind, BERTimbau Legal)
- **Por que:** Criador do BERTimbau e BERTimbau Legal — único modelo pré-treinado em PT-BR para domínio jurídico. NeuralMind é a empresa BR top em NLP.
- **Decisões que orienta:** Fine-tuning vs prompt engineering, embeddings PT-BR específicos, NER em texto de edital.

### 7. Data Systems / Backend Architecture — **Martin Kleppmann**
- **Por que:** Autor do DDIA. Define vocabulário para 90% dos problemas de dados.
- **Decisões que orienta:** Storage choices, replication, CDC, idempotência de ingestão, change data capture quando portal muda.

### 8. Frontend / Search UX — **Daniel Tunkelang** + **Algolia team docs**
- **Por que Tunkelang:** Ex-chief scientist Endeca, ex-LinkedIn search, escreveu o livro "Faceted Search". Referência em search UX.
- **Decisões que orienta:** Filtros, faceted navigation, autocomplete, scoring exibido ao usuário, query understanding.

### 9. UX para Domínio Denso/Jurídico — **Stéphanie Walter** OU **Andy Budd** (Clearleft / B2B UX)
- **Por que Andy Budd:** Co-founder Clearleft. Referência em UX B2B sério. Escreveu sobre design system + research em produtos densos.
- **Decisões que orienta:** Hierarquia visual em telas densas, atalhos de power user, mobile vs desktop primário.

### 10. Pricing / SaaS B2B Micro — **Patrick Campbell** (ProfitWell/Paddle)
- **Por que:** Construiu ProfitWell sobre dados de >30k SaaS. Dataset proprietário sobre pricing.
- **Decisões que orienta:** Free tier strategy, packaging, upgrade triggers, churn diagnóstico.

### 11. LGPD / Privacy Engineering — **Ann Cavoukian** (Privacy by Design) + **Patrícia Peck** (Brasil)
- **Por que Cavoukian:** Criadora do framework Privacy by Design (7 princípios). Padrão internacional.
- **Por que Peck:** Maior advogada BR em direito digital + LGPD aplicada. Autora de "Direito Digital".
- **Decisões que orienta:** Arquitetura privacy-first, bases legais por categoria de dado, política redigida.

### 12. GovTech / Civic Product (suporte ao Diretor) — **Code for America team** + **Brasil: Thiago Marzagão** (ex-CGU, cientista de dados gov BR) ou **Ricardo Cappra**
- **Decisões que orienta:** Modelo de relacionamento com órgãos públicos, parcerias institucionais, comunicação cívica.

---

## Squad Final Compactado (12 nomes)

| # | Nome | Vertical | Papel no Squad |
|---|------|----------|----------------|
| 1 | **Jennifer Pahlka** 👑 | GovTech / Produto Cívico | **DIRETORA DO PROJETO** |
| 2 | Marçal Justen Filho | Direito Administrativo | Conselheiro Jurídico |
| 3 | Tim Davies | Open Data / OCDS | Padrões de Dados |
| 4 | Pablo Hoffman | Scraping Ético | Arquiteto de Ingestão |
| 5 | Jerry Liu | PDF Parse / RAG | Arquiteto de Documentos |
| 6 | Doug Cutting | Search / IR | Arquiteto de Busca |
| 7 | Fábio Souza | NLP PT-BR Jurídico | Arquiteto de Linguagem |
| 8 | Martin Kleppmann | Data Systems | Arquiteto-Chefe de Dados |
| 9 | Daniel Tunkelang | Search UX | UX de Busca |
| 10 | Andy Budd | B2B UX Denso | UX de Produto |
| 11 | Patrick Campbell | SaaS Pricing | Estratégia de Monetização |
| 12 | Ann Cavoukian + Patrícia Peck | Privacy / LGPD | Compliance |

**Aaron Swartz** entra no manifesto/preâmbulo como inspiração de valores (open data, dados públicos não devem ser refém de UX ruim).

---

## Pendências (resolver após research)

- [ ] Validar Pahlka como Diretora vs alguém mais "BR" (Thiago Marzagão? Ricardo Cappra? Pedro Markun? Daniel Westphal?)
- [ ] Marçal Justen Filho ainda ativo? Vivo? (sim, mas precisa confirmar produção recente)
- [ ] Existe alguém referência específica em "licitação eletrônica BR" que ofusca Marçal? (ex: Joel de Menezes Niebuhr)
- [ ] Squad de 12 é tamanho certo ou inflado? (Tocks/Bretda manifestos têm 5-8)

---

*Será reescrito como `01-squad-final.yaml` após research completar e ranqueamento estiver corroborado.*
