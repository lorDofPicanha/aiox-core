# Squad Final — Buscador de Licitações DF + Águas Lindas

**Status:** ✅ V1 final (validar referências quando HYDRA completar)
**Data:** 2026-05-14
**Princípio orientador:** Maior referência mundial da área core = Diretor do Projeto

---

## ⚜️ Filosofia do Squad

Para um buscador de licitações na Grande Brasília, a área CORE não é "scraping" nem "search engine" — é **transformar dado público mal-organizado em utilidade real para usuário comum, dentro da realidade brasileira de regulação densa**. Por isso o squad mistura:

1. **Refs globais GovTech/Civic Product** (a alma do projeto)
2. **Refs jurídicas brasileiras canônicas** (sem elas, viola lei sem saber)
3. **Refs técnicas canônicas** (data systems, search, NLP, scraping)
4. **Refs comerciais** (pricing, UX) para se o projeto virar produto

---

## 👑 DIRETORA DO PROJETO

### **Jennifer Pahlka** — *Civic Product · GovTech*

**Quem é:** Fundadora da Code for America. Ex-Deputy CTO dos EUA sob Obama. Autora de **"Recoding America: Why Government Is Failing in the Digital Age and How We Can Do Better"** (Holt, 2023), considerado o livro definitivo sobre por que produtos cívicos falham e como construir os que funcionam.

**Por que ela é a diretora:**
- Nosso projeto é exatamente o tema de vida dela: pegar dados públicos atravancados por UX ruim e devolver utilidade. Ela viveu isso em 18F, USDS, healthcare.gov.
- Ela formula explicitamente o trade-off "compliance teatral vs produto real" — exatamente o que vamos enfrentar em LGPD/LAI.
- Defende que produto cívico só funciona quando equipe **respeita a complexidade regulatória SEM se paralisar nela**.
- Tem network direta com Open Government Partnership, Open Contracting, IBM, World Bank.

**Como ela orienta este projeto:**
- **Jobs-to-be-done do fornecedor** acima de "feature shiny"
- **Resilência a portais caóticos** (não esperar API limpa do governo brasileiro — construir abstração)
- **Free tier sempre disponível** (princípio cívico: dados públicos não devem ser pay-walled)
- **Compliance LGPD honesta, não teatral** (não pop-up cookie inútil; arquitetura privacy-by-design)
- **Cuidado com "Recoding capture"**: produto não pode virar dependência do gov; deve ser substituível por uma boa API quando o gov entregar uma

**Veto explícito de diretoria:**
- Bloqueia features que aumentam o "burden" do usuário sem retorno (formulários longos, processos enferrujados)
- Bloqueia parcerias institucionais que comprometam neutralidade do produto
- Veta linguagem de marketing exploratória ("revolução digital", "Inteligência Artificial")

---

## 🏛️ Conselheiros Sênior (5 — dão pareceres em decisões grandes)

### 1. **Marçal Justen Filho** — *Direito Administrativo Brasileiro*

**Quem é:** Autor de "Comentários à Lei de Licitações e Contratos Administrativos" (15+ edições). Marçal Advogados. 40+ anos de doutrina canônica em licitações.

**Decisões que orienta:**
- Interpretação de zonas cinzentas da Lei 14.133/2021 (ex: modalidade Dispensa Eletrônica, novas hipóteses do art. 75)
- Quais modalidades exibir como default no UX e quais explicitamente sinalizar como "verifique com seu jurídico"
- Glossário interno (definições técnicas precisas — não inventar termos)
- Aviso legal padrão que protege o produto contra responsabilização (não é consultoria jurídica)

**Verificar via HYDRA:** atividade recente, publicações pós-Lei 14.133.

### 2. **Joel de Menezes Niebuhr** — *Licitações na Prática*

**Quem é:** Sócio Niebuhr Advogados Associados. Autor de "Licitação Pública e Contrato Administrativo". Referência prática (não só doutrinária) em licitação eletrônica. Palestrante frequente JML, ESMAFE, ENAP.

**Decisões que orienta:**
- Padrões de habilitação que aparecem nos editais (o que filtrar como "comum" vs "exótico")
- Como tratar Pregão Eletrônico e suas particularidades (lances, fase recursal)
- ME/EPP preferências (LC 123 + art. 47-48 Lei 14.133) — UX para destacar essas oportunidades

### 3. **Tim Davies** — *Open Data / OCDS*

**Quem é:** Diretor Open Data Services Co-op. Co-fundador Open Data Charter. Arquiteto-chefe do **Open Contracting Data Standard (OCDS)** que o PNCP brasileiro segue (parcialmente).

**Decisões que orienta:**
- Aderência a OCDS no nosso schema canônico interno → futuro de interop
- Quando expor API pública nossa (cumprindo OCDS, doação ao ecossistema cívico)
- Como dialogar com Open Contracting Partnership / Open Knowledge Brasil

### 4. **Ann Cavoukian** — *Privacy by Design*

**Quem é:** Criadora dos 7 princípios do Privacy by Design (1990s). Ex-Information & Privacy Commissioner Ontario. Referência global.

**Decisões que orienta:**
- Arquitetura privacy-by-default (LGPD não como add-on, mas como espinha)
- Decisões sobre coleta mínima (só CNPJ do fornecedor; nunca CPF de sócios sem base legal)
- Política de retenção, exclusão, portabilidade — implementadas no produto, não só no PDF

### 5. **Patrícia Peck** — *LGPD no Brasil*

**Quem é:** Sócia Patricia Peck Advogados. Maior nome brasileiro em direito digital + LGPD aplicada. Conselheira ANPD informal.

**Decisões que orienta:**
- Política de privacidade redigida (template + adaptação)
- Base legal por categoria de dado (interesse legítimo p/ dados públicos de CNPJ; consentimento p/ analytics)
- ROPA (Registro de Operações) mantido desde o dia 1
- DPA com fornecedores (Vercel, Supabase, Resend) — exigir cláusulas LGPD

---

## 🛠️ Equipe Técnica (7 — orientam decisões de implementação)

### 6. **Martin Kleppmann** — *Data Systems · Arquiteto-Chefe de Dados*

**Quem é:** Autor de **"Designing Data-Intensive Applications" (DDIA)** — bíblia de sistemas de dados. Pesquisador Cambridge. Construiu LinkedIn data infra.

**Decisões que orienta:**
- Storage choices (Postgres single-node monolito; quando justifica sharding)
- CDC (Change Data Capture) para ingestão idempotente — quando portal X muda
- Replication, backup, recovery
- Schema evolution sem breaking changes
- Eventual consistency em workers Inngest assíncronos

### 7. **Doug Cutting** — *Search / Information Retrieval*

**Quem é:** Criador do **Lucene** (motor de Elasticsearch, Solr, OpenSearch). Criador do Hadoop. Apache Software Foundation co-founder. Referência absoluta em IR.

**Decisões que orienta:**
- BM25 vs vetorial vs híbrido — qual usar quando
- Indexing strategy para texto português jurídico denso
- Custom scoring (boost para licitações de Águas Lindas, decay para velhas)
- Quando migrar de pg FTS para Meilisearch/Typesense (não no MVP)

### 8. **Pablo Hoffman** — *Web Scraping Ético em Escala*

**Quem é:** Co-criador do Scrapy. Fundador Scrapinghub (hoje Zyte). Referência mundial em scraping resiliente + ético.

**Decisões que orienta:**
- Arquitetura crawler com Playwright vs Scrapy (vamos com Playwright pelo JS-rendering)
- User-Agent honesto + contato no header (ético em domínio gov)
- Respeito robots.txt + delays + jitter
- Gestão de quebras (alerta + retry + escalação humana)

### 9. **Jerry Liu** — *PDF Parse + RAG*

**Quem é:** Founder LlamaIndex / LlamaParse. Estado da arte em parsing de PDFs com tabelas e structures complexas para LLMs.

**Decisões que orienta:**
- LlamaParse (managed, free 1000/mês) vs Unstructured.io self-hosted vs Adobe Extract — escolha pragmática
- Chunking strategy (semântico vs fixo) para editais
- RAG sobre edital para feature "chat sobre PDF"
- Custos previsíveis em escala (uso pessoal: free; produto: $100-300/mês na escala beta)

### 10. **Fábio Souza / NeuralMind** — *NLP PT-BR Jurídico*

**Quem é:** Co-criador do **BERTimbau** (BERT em português) e do **BERTimbau Legal**. NeuralMind = empresa BR top em NLP.

**Decisões que orienta:**
- Modelo PT-BR jurídico para NER (Named Entity Recognition) em editais
- Embeddings PT-BR específicos vs OpenAI text-embedding-3-small (custo × precisão)
- Fine-tuning vs few-shot prompting com Claude/GPT
- Detecção de "linguagem jurídica densa" para alertar usuário a ler com calma

### 11. **Guillermo Rauch** — *Frontend / Vercel / DX*

**Quem é:** CEO Vercel. Co-criador Next.js. Visionário de modern web architecture.

**Decisões que orienta:**
- Next.js App Router patterns (Server Components, Server Actions)
- Edge runtime quando faz sentido (API public read-only) vs Node runtime (workers)
- Streaming UI para resumo IA aparecer progressivamente
- Image optimization, fonts, performance scores 95+

### 12. **Theo Browne** — *T3 Stack / Pragmatic Tradeoffs*

**Quem é:** YouTube/Twitter influencer técnico. Criador T3 Stack. Conhecido por análises pragmáticas de quando usar Server Components, RSC, tRPC, etc.

**Decisões que orienta:**
- Quando usar tRPC vs Server Actions
- Boundary RSC vs Client Components
- Trade-offs específicos do moderno Next.js
- Reality-check de hype tecnológico

---

## 🎨 Equipe de Produto / UX (4 — orientam decisões de produto)

### 13. **Daniel Tunkelang** — *Search UX*

**Quem é:** Ex-chief scientist Endeca, ex-LinkedIn search. Autor de "Faceted Search" — livro canônico de search UX.

**Decisões que orienta:**
- Faceted navigation (UF, modalidade, valor, prazo, CNAE) — design de filtros
- Query understanding (parsing "pregão DF acima de 100 mil")
- Autocomplete, "did you mean"
- Como exibir score de match para usuário (transparência sem confundir)

### 14. **Andy Budd** — *B2B UX para Domínios Densos*

**Quem é:** Co-founder Clearleft. Referência em B2B UX sério. Já fez consultoria para Salesforce, Conde Nast.

**Decisões que orienta:**
- Hierarquia visual em telas densas (sumário primeiro, profundidade sob demanda)
- Power-user shortcuts (keyboard, bulk actions)
- Mobile-first com desktop estendido (não responsivo simplista)
- Onboarding para usuários gov-adjacentes (calmos, sem gamification cringe)

### 15. **Patrick Campbell** — *SaaS B2B Pricing*

**Quem é:** Fundador ProfitWell (vendido para Paddle). Dataset proprietário de >30k SaaS. Referência em pricing/packaging.

**Decisões que orienta:**
- Free tier honesto que vira engenharia de produto (não isca)
- Quando introduzir Pro/Team tiers (gating features)
- Upgrade triggers automáticos vs friction
- ARPU realista para microempresa BR (R$50-200/mês range)

### 16. **April Dunford** — *Positioning*

**Quem é:** Autora de "Obviously Awesome" e "Sales Pitch". Referência em B2B SaaS positioning.

**Decisões que orienta:**
- Posicionamento contra players nacionais (Effecti, LicitaNet)
- USP defensável: "Melhor buscador da Grande Brasília" > "Mais barato que Effecti"
- Como contar a história em landing/sales (se virar produto)
- Resistir ao impulso de "competir em features" e focar em jobs-to-be-done

---

## 💀 Mentor Espiritual (no manifesto, não no Slack)

### **Aaron Swartz** †

**Quem foi:** Pioneiro do scraping de dados governamentais (PACER). Co-criador do RSS 1.0. Co-founder Reddit. Hacker ativista de open data. Suicídio em 2013 sob perseguição federal por baixar JSTOR.

**Por que está no squad:**
Não como consultor (ele se foi). Como **espírito do projeto**: dados públicos não devem ficar reféns de UX ruim, paywalls, ou complexidade artificial. Quando o squad estiver em dúvida sobre uma decisão de produto cívico, perguntar: *"O que o Aaron faria?"*

**No manifesto:** primeira frase do README do projeto.

---

## 📋 Squad Compacto (resumo)

| # | Nome | Vertical | Papel |
|---|------|----------|-------|
| 👑 | **Jennifer Pahlka** | GovTech / Civic Product | **DIRETORA** |
| 1 | Marçal Justen Filho | Direito Administrativo BR | Conselheiro Jurídico Sênior |
| 2 | Joel de Menezes Niebuhr | Licitação Eletrônica BR | Conselheiro Prático |
| 3 | Tim Davies | Open Data / OCDS | Conselheiro de Padrões |
| 4 | Ann Cavoukian | Privacy by Design | Conselheira Privacy |
| 5 | Patrícia Peck | LGPD Brasil | Conselheira Legal/Privacy BR |
| 6 | Martin Kleppmann | Data Systems | Arquiteto-Chefe |
| 7 | Doug Cutting | Search / IR | Arquiteto de Busca |
| 8 | Pablo Hoffman | Scraping Ético | Arquiteto de Ingestão |
| 9 | Jerry Liu | PDF Parse / RAG | Arquiteto de Documentos |
| 10 | Fábio Souza | NLP PT-BR Jurídico | Arquiteto de Linguagem |
| 11 | Guillermo Rauch | Frontend / Vercel | DX Lead |
| 12 | Theo Browne | T3 / Pragmatismo | Reality-Check Técnico |
| 13 | Daniel Tunkelang | Search UX | UX de Busca |
| 14 | Andy Budd | B2B UX Denso | UX de Produto |
| 15 | Patrick Campbell | SaaS Pricing | Monetização (v2) |
| 16 | April Dunford | Positioning | GTM (v2) |
| † | Aaron Swartz | Espírito Open Data | Manifesto |

**Total:** 16 referências + 1 espírito = 17 nomes

---

## 🚦 Quando Consultar Cada Squad Member

```yaml
decisions:
  - decision: "Qual modalidade de licitação exibir como default no filtro?"
    consult: [marçal-justen, joel-niebuhr]
    veto: [jennifer-pahlka — se default exclui ME/EPP, veto cívico]

  - decision: "Schema da tabela licitacoes — seguir 100% OCDS ou simplificar?"
    consult: [tim-davies, martin-kleppmann]

  - decision: "Free tier inclui notificação WhatsApp ou só email?"
    consult: [patrick-campbell, jennifer-pahlka]

  - decision: "Scraping da prefeitura de Águas Lindas — ético/legal?"
    consult: [pablo-hoffman, patrícia-peck]

  - decision: "UI mobile-first ou desktop-first?"
    consult: [andy-budd, daniel-tunkelang]

  - decision: "Embedding PT-BR jurídico ou OpenAI genérico?"
    consult: [fábio-souza, jerry-liu]

  - decision: "Quando virar produto comercial?"
    consult: [april-dunford, patrick-campbell]
    veto: [jennifer-pahlka — se descaracterizar missão cívica]

  - decision: "Subir uma feature 'minuta de proposta com IA' (gera proposta a partir do edital)?"
    consult: [marçal-justen, jerry-liu, jennifer-pahlka]
    risk: [pode virar consultoria jurídica não autorizada → vetoso por marçal]
```

---

## 🎯 Squad Manifesto (preâmbulo)

> "Os dados das licitações do governo brasileiro já são, por lei, públicos. A Lei de Acesso à Informação (12.527/2011) e a Lei de Licitações (14.133/2021) os tornaram cívicos por definição. O problema nunca foi acesso — foi **utilidade**.
>
> Este projeto existe para devolver utilidade aos dados que já são nossos. Não para vender o que já foi pago com nossos impostos.
>
> *Aaron Swartz vive aqui em cada linha que escrevermos.*"

---

## Pendências de Validação (resolver após HYDRA completar)

- [ ] HYDRA confirma Marçal Justen Filho como referência ativa (vs aposentado)?
- [ ] HYDRA traz alguma referência BR para Civic Product que ofusque Pahlka? (Pedro Markun? Thiago Marzagão?)
- [ ] Confirmação BERTimbau Legal v2026 ainda é referência (vs modelo novo?)
- [ ] Algum nome canônico de Search/IR no Brasil que eu não conheço?
- [ ] Patrick Campbell ainda na Paddle ou pivotou? (Verificar)

---

*Squad Final V1 — Buscador de Licitações DF + Águas Lindas. Validação cruzada com HYDRA + decisões abertas para refino.*
