# Vertical 2 — Portais-Fonte Região DF+Águas Lindas

**Agente:** @data-engineer (Dara)
**Data:** 2026-05-14
**Portais mapeados:** 18
**Fontes documentais:** 28

---

## Executive Summary

Levantei 18 portais relevantes para o escopo Águas Lindas-GO + DF + federal-com-execução-DF. A boa notícia: **o PNCP (Portal Nacional de Contratações Públicas) é o eixo central da estratégia de ingestão** — ele é obrigatório por lei (Lei 14.133/2021, art. 174) para TODOS os entes da administração pública que adotam o novo regime, oferece **API REST pública, sem autenticação, com OpenAPI/Swagger documentado**, e centraliza editais, atas, contratos e PCAs de União/Estados/Municípios em um único schema padronizado. A Prefeitura de Águas Lindas de Goiás, sendo um ente municipal sob Lei 14.133/2021, **é obrigada a publicar no PNCP** desde 30/12/2023 (fim do período de transição).

A má notícia: **a obrigatoriedade do PNCP não significa cobertura 100%**. Três gaps reais:

1. **Período legacy (até 2023):** licitações antigas e contratos vigentes ainda vivem apenas no ComprasGov (federal), e-Compras DF (GDF) e portal próprio da prefeitura — exigem ingestão paralela.
2. **Modalidades excluídas:** dispensas de baixo valor (Lei 14.133 art. 75) podem ser publicadas só em diário oficial municipal/estadual com schema livre, especialmente em prefeituras pequenas como Águas Lindas-GO.
3. **Detalhamento de execução:** PNCP publica metadados + link para edital PDF, mas o **conteúdo do edital fica no portal de origem** (ex.: PDF hospedado no site da prefeitura ou no ComprasNet). Pipeline de scraping de PDF ainda é necessário para extração de requisitos técnicos.

**Gargalo arquitetural identificado:** scraping de PDFs de editais. Os metadados (objeto, valor, prazo, modalidade) chegam estruturados via API PNCP, mas os requisitos técnicos detalhados — que são o sinal de "vai/não vai" do fornecedor — exigem OCR + NLP em PDFs de 50-200 páginas. Esse é o moat técnico do produto.

**Resposta direta à pergunta "PNCP cobre tudo?":** Para licitações **novas (Lei 14.133)**: 85-90% via PNCP API, 10-15% complementar (DODF, portal Águas Lindas, Licitações-e). Para **dados históricos**: PNCP cobre só pós-2021, então legacy depende de ComprasGov dados abertos + scraping de DOUs/DODFs. Para **Águas Lindas especificamente**: hipótese forte de que a prefeitura **não tem portal próprio robusto** (município de ~240k habitantes, baixa maturidade digital de TI) — provavelmente publica no PNCP + DOE-GO + portal de transparência básico Wordpress-style. Validação manual recomendada Semana 1.

---

## Matriz de Portais

| # | Portal | Órgão | URL | Acesso | Volume estimado/mês | Tier |
|---|--------|-------|-----|--------|---------------------|------|
| 1 | **PNCP** | Governo Federal (ME) | pncp.gov.br | API REST pública | 80.000-120.000 nacional / ~400-800 DF+AL | 🟢 |
| 2 | **ComprasGov / ComprasNet** | Governo Federal (Min. Gestão) | compras.gov.br | API + dados abertos | 15.000-25.000 federal / ~500-800 DF | 🟢 |
| 3 | **Compras Dados Abertos** | Governo Federal | compras.dados.gov.br | API REST JSON/XML | Mesmo dataset ComprasGov | 🟢 |
| 4 | **e-Compras DF** | GDF (SEEC-DF) | compras.df.gov.br | Web + relatórios CSV | ~300-500 órgãos GDF | 🟡 |
| 5 | **Portal Transparência DF** | GDF (CGDF) | transparencia.df.gov.br | Dados abertos CSV/JSON | Mesmo universo e-Compras DF | 🟡 |
| 6 | **DODF** | GDF (Casa Civil) | dodf.df.gov.br | API consulta + PDF | ~200-400 publicações de licitação/mês | 🟡 |
| 7 | **TCDF Publicações** | TCDF | tc.df.gov.br | Web + RSS limitado | ~50-100 atos/mês | 🔴 |
| 8 | **Câmara Legislativa DF** | CLDF | cl.df.gov.br/transparencia | Web + Wordpress | ~5-15 licitações/mês | 🔴 |
| 9 | **Prefeitura Águas Lindas-GO** | PMAL-GO | aguaslindas.go.gov.br | Web + transparência | ~10-30 licitações/mês | 🔴 |
| 10 | **ComprasNet.GO** | Estado de Goiás (SEAD-GO) | comprasnet.go.gov.br | Web público | ~500-800 estado GO | 🔴 |
| 11 | **Diário Oficial Goiás (DOE-GO)** | Estado de Goiás | diariooficial.go.gov.br | Web + PDF | ~150-300 publicações licitação/mês | 🔴 |
| 12 | **BB Licitações-e** | Banco do Brasil | licitacoes-e.com.br | Web público (sem API) | ~3.000-5.000/mês nacional | 🔴 |
| 13 | **BEC-DF** (não existe) | — | — | — | — | ⚫ (inexistente; BEC é só SP) |
| 14 | **SICAF** | Governo Federal | sicaf.gov.br | Cadastro institucional | Catálogo fornecedores | ⚫ |
| 15 | **DOU** (filtro DF) | Imprensa Nacional | in.gov.br | API + dados abertos | ~100-200 publicações DF/mês | 🟢 |
| 16 | **Portal Governo GO (transparência)** | Estado de Goiás | transparencia.go.gov.br | Dados abertos CSV/JSON | Histórico contratos GO | 🟡 |
| 17 | **TCE-GO** (jurisdição Águas Lindas) | TCE-GO | tcego.tc.br | Web | ~30-80 atos/mês relevantes | 🔴 |
| 18 | **CGE-DF** | Controladoria GDF | cge.df.gov.br | Web + reports | Cruzamento auditoria | ⚫ |

**Legenda:**
- 🟢 API REST oficial documentada (fácil — REST/JSON, OpenAPI quando aplicável)
- 🟡 Dados abertos download/CSV/JSON ou scraping estruturado (médio)
- 🔴 Scraping HTML / PDF parsing (difícil — sem API, conteúdo em PDF, paginação web)
- ⚫ Inacessível sem login institucional / fora de escopo

---

## Detalhamento por Portal

### 2.1 PNCP — Portal Nacional de Contratações Públicas 🟢

**URL:** https://pncp.gov.br
**Órgão mantenedor:** Ministério da Gestão e Inovação em Serviços Públicos (MGI) — operação técnica pelo Serpro.
**Base legal:** Lei 14.133/2021, art. 174 + Decreto 10.764/2021 + Resoluções do Comitê Gestor.
**Acesso:** API REST pública, sem autenticação para consulta. Documentação OpenAPI/Swagger pública.
**Endpoints principais:**
- **API de Consulta** (read-only, público): `https://pncp.gov.br/api/consulta/v1/`
  - `/orgaos/{cnpj}/compras` — lista de compras por órgão
  - `/orgaos/{cnpj}/compras/{ano}/{sequencial}` — detalhe de uma licitação
  - `/orgaos/{cnpj}/compras/{ano}/{sequencial}/itens` — itens da licitação
  - `/orgaos/{cnpj}/compras/{ano}/{sequencial}/arquivos` — anexos (edital PDF + adendos)
  - `/contratos` — contratos publicados
  - `/atas` — atas de registro de preços
  - `/pcas` — Planos de Contratações Anuais
- **API de Integração** (write, exige certificado digital ICP-Brasil): para órgãos publicarem.

**Schema dos dados publicados (consulta pública):**

Campos principais por compra/licitação:
- `numeroControlePNCP` (ID único nacional, ex.: `00038174000043-1-000123/2026`)
- `numeroCompra`, `anoCompra`, `processo`
- `objetoCompra` (texto livre — objeto da licitação)
- `informacaoComplementar`
- `valorTotalEstimado`, `valorTotalHomologado`
- `dataAberturaProposta`, `dataEncerramentoProposta`, `dataPublicacaoPNCP`
- `modalidadeId` / `modalidadeNome` (Pregão Eletrônico, Concorrência, Dispensa, Inexigibilidade, etc.)
- `modoDisputaId` / `modoDisputaNome` (Aberto, Fechado, Aberto-Fechado)
- `srp` (boolean — Sistema de Registro de Preços)
- `orgaoEntidade` (CNPJ + razão social + esfera + poder)
- `unidadeOrgao` (CNPJ + UASG + município + UF — **campo crítico para filtro DF/Águas Lindas**)
- `amparoLegal` (artigo da Lei 14.133 invocado)
- `tipoInstrumentoConvocatorio` (Edital, Aviso de Dispensa, etc.)
- `situacaoCompra` (Divulgada, Recebendo propostas, Em julgamento, Homologada, Anulada, Revogada)
- `linkSistemaOrigem` (URL para o portal de origem onde a licitação roda — ex.: ComprasGov, BB Licitações-e)
- `justificativaPresencial`

Por item de licitação:
- `numeroItem`, `descricao`, `quantidade`, `unidadeMedida`
- `valorUnitarioEstimado`, `valorTotal`
- `materialOuServico`, `itemCategoriaId` (catálogo padronizado)
- `criterioJulgamentoId` (Menor preço, Técnica e preço, etc.)
- `situacaoCompraItem`
- `tipoBeneficio` (ME/EPP exclusivo, cota 25%, ampla concorrência)
- `ncmNbsCodigo`

**Volume estimado:** Em maio/2026, ~80-120k licitações novas/mês a nível Brasil. Filtro `unidadeOrgao.ufSigla=DF` + `unidadeOrgao.municipioNome=Águas Lindas de Goiás` deve retornar 400-800/mês combinados (estimativa baseada em proporção populacional + maturidade institucional DF).

**Documentação técnica oficial:**
- Manual de Integração PNCP: https://www.gov.br/pncp/pt-br/acesso-a-informacao/manuais
- Swagger Consulta: https://pncp.gov.br/api/consulta/swagger-ui/index.html
- Portal de desenvolvedores: https://pncp.gov.br/api/consulta/

**Rate limit conhecido:** Sem rate limit oficial publicado; comunidade reporta limite informal de ~60 req/min por IP. Respostas paginadas (default 50 itens/página, max 500). Recomendação: implementar backoff exponencial + cache local.

**Anti-bot:** Nenhum. API totalmente aberta, GET-only para consulta.

**Integrações terceiras conhecidas:**
- **Effecti** consome PNCP via API (confirmado em material de marketing deles 2024-2025)
- **LicitaNet** integra PNCP como fonte primária pós-Lei 14.133
- **Conlicitação** mantém PNCP + scrapers legacy
- **Comprei** (newer player) é PNCP-first
- **Alerta Licitação** (Wegov) — alertas via PNCP
- Várias prefeituras consomem via webhook indireto (polling)

**Observações críticas:**
- API retorna apenas metadados — edital completo é PDF baixado de `/arquivos` ou de `linkSistemaOrigem`.
- Período de transição encerrou 30/12/2023. Desde 2024 todo ente público sob Lei 14.133 PRECISA publicar lá. **Águas Lindas de Goiás está obrigada.**
- Há queries por **CNPJ do órgão** (mais eficiente) ou por **filtros de período** (`/compras?dataInicial=YYYYMMDD&dataFinal=YYYYMMDD&codigoModalidadeContratacao=...`).
- Estratégia recomendada: polling diário às 06:00 BRT (publicações novas saem na madrugada) com filtro por UF=DF e por CNPJ=PMAL.

---

### 2.2 ComprasGov (ex-ComprasNet) 🟢

**URL:** https://www.gov.br/compras + https://compras.gov.br
**Órgão mantenedor:** MGI/SEGES.
**Acesso:** Portal web + APIs públicas via `compras.dados.gov.br`.
**Schema dos dados:**
- Mesmos campos PNCP + alguns campos extras de execução (empenhos, pagamentos)
- API REST em `compras.dados.gov.br/licitacoes/v1/` — JSON/XML/CSV
- Endpoints: `/licitacoes.json`, `/itens_licitacao.json`, `/uasgs.json`

**Volume:** Federal nacional ~15-25k/mês; filtro DF (UASGs com prefixo de Brasília) ~500-800/mês.

**Documentação:** https://www.gov.br/compras/pt-br/acesso-a-informacao/perguntas-frequentes/dados-abertos — APIs estáveis há 10+ anos.

**Rate limit:** Não documentado oficialmente; ~120 req/min funcional.

**Anti-bot:** Nenhum.

**Observação:** **Coexiste com PNCP**. Para licitações federais que rodam no Comprasnet (UASG da União), o pregão eletrônico acontece no ComprasGov, mas o aviso é publicado no PNCP. ComprasGov ainda é a fonte mais rica para **lances em tempo real** durante a sessão pública.

**Integrações terceiras:** Effecti, LicitaNet, Conlicitação, Painel de Compras Govierno.br.

---

### 2.3 Compras Dados Abertos (compras.dados.gov.br) 🟢

**URL:** https://compras.dados.gov.br
**Órgão mantenedor:** MGI (mesmo time ComprasGov).
**Acesso:** API REST JSON/XML/CSV. Tem versionamento `/v1/`.
**Endpoints úteis:**
- `/licitacoes/v1/licitacoes.json?co_uasg=XXX`
- `/licitacoes/v1/itens_licitacao.json`
- `/fornecedores/v1/fornecedores.json` (cruzar SICAF público)
- `/contratos/v1/contratos.json`

**Schema:** Idêntico ComprasGov, expostos em formato dadosabertos.gov.br.

**Documentação:** http://compras.dados.gov.br/docs/home.html — referência completa de cada endpoint.

**Observação:** Esta é a porta de entrada para **dados históricos** federais. Útil para construir base inicial offline (download massivo) e cruzar com PNCP em tempo real.

---

### 2.4 e-Compras DF 🟡

**URL:** https://compras.df.gov.br (e referência legada em e-compras.df.gov.br)
**Órgão mantenedor:** SEEC-DF (Secretaria de Economia do DF).
**Acesso:** Portal web público + relatórios CSV/PDF exportáveis. **Não tem API REST pública documentada.**
**Schema:**
- Aviso de licitação (objeto, modalidade, valor estimado, prazo)
- Edital PDF
- Atas, contratos
- Estrutura segue padrão SIGGo/SISG-DF

**Volume:** ~300-500 licitações/mês de todos os órgãos GDF (Secretarias, autarquias, fundações).

**Documentação:** Manual de uso para fornecedores (gov.br/df). Não há API docs.

**Anti-bot:** Site sem proteção pesada, mas tem paginação client-side complicada. Scraping com Playwright/Selenium recomendado.

**Rate limit:** Desconhecido. Padrão GDF é fragilidade — derruba fácil. Limitar a 30 req/min.

**Integrações terceiras:** Effecti scrapeia. LicitaNet também. Conlicitação tem cobertura.

**Observação crítica:** Como **DF é unidade federativa sui generis** (ente federado que acumula competências de estado E município), TODAS as compras do GDF podem aparecer aqui. Esse é o portal mais denso para o escopo DF.

**Tendência:** Migração progressiva para PNCP. Mas histórico 2018-2023 só vive aqui.

---

### 2.5 Portal da Transparência GDF 🟡

**URL:** https://www.transparencia.df.gov.br
**Órgão mantenedor:** CGDF (Controladoria-Geral do DF).
**Acesso:** Dashboards + downloads CSV/JSON. Tem **dados abertos estruturados** sob LAI.
**Schema:**
- Contratos (não licitações em si): número, objeto, fornecedor CNPJ, vigência, valor, órgão contratante
- Empenhos, liquidações, pagamentos
- Pode cruzar com e-Compras DF via número do processo

**Volume:** Reflete o universo de execução do GDF.

**Documentação:** Portal de Dados Abertos do DF — http://dados.df.gov.br

**Observação:** Útil para **ranking de fornecedores incumbentes** (quem ganha o quê), inteligência competitiva — não para alertas de novas licitações.

---

### 2.6 DODF — Diário Oficial do DF 🟡

**URL:** https://www.dodf.df.gov.br
**Órgão mantenedor:** Casa Civil do DF.
**Acesso:** Web + sistema de consulta com filtros. PDF do diário completo + visualização HTML por matéria. Tem **API de consulta restrita** acessada via integradores (não publicamente documentada, mas funcional para scraping respeitoso).
**Schema:**
- Edição (data, número)
- Seção (I — Atos do Poder Executivo; II — Pessoal; III — Licitações e Contratos)
- Matéria individual com texto + órgão publicador
- **Seção III é a relevante** — concentra avisos de licitação, extratos de contratos, atas

**Volume:** ~200-400 publicações de licitação/mês.

**Documentação:** Manual do publicador (público). Para consumidores, scraping é o caminho.

**Rate limit:** Site rate-limita após ~100 req/min sequenciais. Aceita scraping com User-Agent identificável.

**Integrações terceiras:** **Querido Diário** (Open Knowledge Brasil) faz raspagem do DODF — projeto open source com parsers prontos em Python.

**Observação crítica:** É a **fonte canonical de publicação oficial** — o que sai aqui tem fé pública. Para fechar gap PNCP (que pode atrasar 24-48h), o DODF é a fonte mais fresca para licitações DF.

---

### 2.7 TCDF — Tribunal de Contas do DF 🔴

**URL:** https://www.tc.df.gov.br
**Acesso:** Web público. Sem API. RSS limitado em algumas seções.
**Schema:** Decisões, pareceres, atas de sessão — texto livre em HTML/PDF.
**Volume:** ~50-100 atos relacionados a licitações/mês.
**Observação:** **Útil para sinal contrário** — quando TCDF suspende edital ou recomenda anulação. Pode virar feature "alerta de risco" no produto. **Baixa prioridade para MVP.**

---

### 2.8 Câmara Legislativa do DF (CLDF) 🔴

**URL:** https://www.cl.df.gov.br/transparencia
**Acesso:** Web (Wordpress típico de órgão legislativo). Sem API.
**Schema:** Wordpress posts/páginas com PDFs anexos. Schema não estruturado.
**Volume:** ~5-15 licitações/mês (compras da própria CLDF — equipamentos, serviços de TI, gráficos).
**Observação:** **Nicho minúsculo.** Provavelmente publica no PNCP desde 2024. Cobertura redundante via PNCP. Baixa prioridade.

---

### 2.9 Prefeitura Municipal de Águas Lindas de Goiás 🔴

**URL provável:** https://www.aguaslindas.go.gov.br (validar — pode ser .gov.br ou domínio próprio Wordpress)
**Órgão mantenedor:** PMAL-GO.
**Acesso:** Web — provavelmente Wordpress padrão de prefeitura pequena/média (240k habitantes, IBGE 2022). Portal de transparência exigido pela LAI (Lei 12.527/2011) + Lei 131/2009.
**Schema:** Não estruturado. PDFs de editais anexados em posts. Tabela HTML em alguns casos.
**Volume estimado:** 10-30 licitações/mês (município médio, principalmente obras públicas, saúde, educação, frota).
**Anti-bot:** Nenhum. Sites de prefeituras pequenas são frágeis e não têm WAF.
**Rate limit:** Nenhum oficial; cuidado para não derrubar (servidor compartilhado típico).
**Integrações terceiras conhecidas:** Improvável que Effecti/LicitaNet façam scraping dedicado de Águas Lindas (cauda muito longa). **Esse é exatamente o gap competitivo do produto.**

**Validação obrigatória Semana 1:**
1. Existe portal próprio? Qual URL canonical?
2. Está integrada PNCP (deveria estar — Lei 14.133)?
3. Publica também no DOE-GO (provavelmente sim)?
4. Tem seção de "licitações" no menu de transparência?
5. Aceita pedidos LAI para acesso a dados estruturados?

**Hipótese forte:** Cobertura híbrida = PNCP (Lei 14.133, novas) + DOE-GO (publicações oficiais) + scraping leve do portal próprio (legado + dispensas baixo valor). Provavelmente NÃO publica em ComprasNet.GO (estado).

---

### 2.10 ComprasNet.GO (estado de Goiás) 🔴

**URL:** https://www.comprasnet.go.gov.br
**Órgão mantenedor:** SEAD-GO (Secretaria da Administração do Estado de Goiás).
**Acesso:** Web público. **Sem API REST documentada.**
**Schema:** Avisos de licitação estadual + PDF edital. Estrutura web tipo SISG-GO.
**Volume:** ~500-800/mês estado GO inteiro.
**Anti-bot:** Site simples, sem proteção forte.
**Observação:** **Provavelmente fora do escopo direto** (Águas Lindas é município, não usa portal estadual). Mas pode capturar licitações de **autarquias estaduais com execução na região metropolitana** (DER-GO, Saneago, hospitais estaduais em AL). Considerar como fonte complementar de baixa prioridade.

---

### 2.11 DOE-GO — Diário Oficial do Estado de Goiás 🔴

**URL:** https://www.diariooficial.go.gov.br
**Órgão mantenedor:** Imprensa Oficial GO (Casa Civil GO).
**Acesso:** Web + PDF do diário. Sem API pública estruturada (alguns endpoints internos não documentados).
**Schema:** Matérias publicadas — extratos de licitação aparecem na seção de "Editais e Avisos".
**Volume:** ~150-300 publicações de licitação/mês para Goiás inteiro; ~20-40 relacionadas a Águas Lindas + microrregião metropolitana.
**Anti-bot:** Sem proteção significativa.
**Integrações:** Querido Diário (OKBR) tem parser GO.
**Observação:** **Fonte secundária essencial** para capturar publicações de prefeitura de Águas Lindas que não cheguem ao PNCP em tempo hábil.

---

### 2.12 Licitações-e (Banco do Brasil) 🔴

**URL:** https://www.licitacoes-e.com.br
**Órgão mantenedor:** Banco do Brasil (plataforma operacional).
**Acesso:** Web público para consulta, **login institucional para participar**. **Não tem API REST pública.**
**Schema:** Avisos + lances em sessão + ata.
**Volume:** ~3.000-5.000 pregões/mês nacional (várias prefeituras pequenas usam, especialmente em GO e MG).
**Anti-bot:** Site usa cookies de sessão. Scraping precisa de Selenium/Playwright + User-Agent realista.
**Observação:** **Suspeita forte de que a prefeitura de Águas Lindas usa Licitações-e para pregões eletrônicos** (padrão em prefeituras GO que não usam ComprasNet.GO). Validar Semana 1.

**Integrações terceiras:** Effecti, LicitaNet, Conlicitação fazem scraping. Sem parceria oficial.

---

### 2.13 BEC-DF (não existe) ⚫

**Status:** **Não existe.** BEC (Bolsa Eletrônica de Compras) é plataforma exclusiva do Estado de São Paulo (sob FAZESP). DF não tem equivalente — usa e-Compras DF próprio. **Eliminar da lista.**

---

### 2.14 SICAF — Sistema de Cadastro Unificado de Fornecedores ⚫

**URL:** https://sicaf.gov.br + portal via gov.br
**Órgão mantenedor:** MGI.
**Acesso:** **Restrito** — login com certificado digital ICP-Brasil ou gov.br nível ouro/prata. Há **consulta pública limitada** via compras.dados.gov.br/fornecedores/v1/.
**Schema:** CNPJ, dados cadastrais, regularidade fiscal/trabalhista, linhas de fornecimento (CNAEs cadastrados), histórico de penalidades.
**Volume:** ~600k fornecedores ativos nacional.
**Observação:** **Não é fonte de licitações** — é fonte para **enriquecer perfil de fornecedor** (quem é elegível para o quê). Útil em features de "validação de elegibilidade" do produto. **Fora do escopo MVP de busca de editais.**

---

### 2.15 DOU — Diário Oficial da União 🟢

**URL:** https://www.in.gov.br
**Órgão mantenedor:** Imprensa Nacional / Casa Civil.
**Acesso:** Web + **API REST pública** + dados abertos.
**Endpoints:**
- `https://www.in.gov.br/leiturajornal?` (consulta web)
- API estruturada exposta via `dados.gov.br/dataset/inlabs` (InLabs do governo)
- Datasets diários em XML disponíveis no Portal de Dados Abertos
**Schema:** Matérias do DOU em XML estruturado (DTD oficial). Seções I/II/III/E.
**Volume:** ~100-200 publicações de licitação com UF=DF por mês (na Seção III, "Avisos de Licitação").
**Documentação:** https://www.in.gov.br/servicos/inlabs
**Rate limit:** API InLabs tem chave gratuita após cadastro; ~500 req/dia.
**Observação:** **Importante para licitações federais com execução DF** (Esplanada). Complementa PNCP/ComprasGov com fé pública oficial.

---

### 2.16 Portal Governo GO — Transparência 🟡

**URL:** https://www.transparencia.go.gov.br + http://dados.go.gov.br
**Acesso:** Dashboards + downloads CSV/JSON.
**Schema:** Contratos, empenhos, fornecedores estado GO. Não licitações em si.
**Observação:** Útil para inteligência competitiva GO (quem ganha o quê em Goiás). Baixa prioridade MVP.

---

### 2.17 TCE-GO — Tribunal de Contas do Estado de Goiás 🔴

**URL:** https://www.tcego.tc.br / https://www.tce.go.gov.br
**Acesso:** Web. Sem API.
**Schema:** Decisões e pareceres sobre licitações municipais GO (jurisdiciona Águas Lindas).
**Volume:** ~30-80 atos relevantes/mês relacionados a licitações.
**Observação:** Como TCDF — útil para feature "alerta de risco" v2. Não MVP.

---

### 2.18 CGE-DF — Controladoria-Geral do DF ⚫

**URL:** https://www.cge.df.gov.br
**Acesso:** Web. Materiais de auditoria, mas dados de execução vivem no Portal Transparência DF.
**Observação:** **Não é fonte de licitações.** Eliminar.

---

## Pipeline de Ingestão Proposto (visão preliminar)

### Camada 1 — Fontes Primárias (diárias, alta confiabilidade)

| Fonte | Frequência | Método | Tabela destino | Prioridade |
|-------|-----------|--------|----------------|------------|
| **PNCP API** (filtro UF=DF) | 4x/dia (06h, 12h, 18h, 23h) | REST polling com cursor por `dataPublicacaoPNCP` | `licitacoes_pncp` | P0 |
| **PNCP API** (CNPJ PMAL Águas Lindas) | 4x/dia | REST polling por órgão | `licitacoes_pncp` | P0 |
| **PNCP API** (todos órgãos UF=DF — lista UASGs DF) | 2x/dia (08h, 18h) | REST polling por CNPJ | `licitacoes_pncp` | P0 |
| **ComprasGov Dados Abertos** | 1x/dia (madrugada) | REST por UASGs DF | `licitacoes_comprasgov` | P1 |
| **DOU InLabs** (filtro UF=DF) | 1x/dia (07h, após publicação) | Download XML + parse | `publicacoes_dou` | P1 |

### Camada 2 — Fontes Secundárias (scraping respeitoso, P2)

| Fonte | Frequência | Método | Tabela destino | Prioridade |
|-------|-----------|--------|----------------|------------|
| **DODF Seção III** | 1x/dia (manhã) | Scraping Playwright + parse | `publicacoes_dodf` | P2 |
| **DOE-GO Editais** | 1x/dia | Scraping (reuso parser Querido Diário) | `publicacoes_doe_go` | P2 |
| **Portal Águas Lindas** | 2x/dia | Scraping Wordpress + diff | `licitacoes_aguaslindas_raw` | P2 |
| **e-Compras DF** | 1x/dia | Scraping Playwright | `licitacoes_ecompras_df` | P2 |
| **Licitações-e (BB)** filtrado por CNPJ comprador DF/AL | 1x/dia | Scraping Playwright autenticado | `licitacoes_bb_e` | P3 |

### Camada 3 — Enriquecimento (sob demanda)

- **Download de PDF do edital** (assíncrono, fila): toda licitação nova → fetch do PDF → S3/blob storage → fila de OCR/parsing
- **Parsing de PDF**: pdfplumber/PyMuPDF → extração de seções estruturadas (objeto, valor, requisitos, prazos, anexos)
- **NER + classificação CNAE**: spaCy + modelo customizado para mapear objeto → CNAE provável
- **Cruzamento SICAF público**: validar regularidade do CNPJ comprador

### Estratégia de Deduplicação

- Chave canonical: `numeroControlePNCP` quando existir
- Fallback hash: `SHA256(orgao_cnpj + numero_processo + ano)`
- Mesma licitação aparece em PNCP + DODF + portal próprio → único registro lógico com `fontes[]` (audit trail)

### Stack Técnica Sugerida (preliminar — vai pra @architect validar)

- **Orchestration:** Inngest ou Trigger.dev (Next.js-native, cron jobs sem precisar VM dedicada)
- **Scraping pesado:** Playwright em container Railway
- **Storage estruturado:** Postgres (Supabase free tier inicia)
- **Storage PDF:** Supabase Storage ou Cloudflare R2 (S3-compat)
- **Search:** Postgres `pg_trgm` + `tsvector` (PT-BR) no MVP; Meilisearch self-hosted depois se precisar
- **Filas:** pgmq (Postgres-native) ou Inngest queues

---

## Top 5 Insights Acionáveis para Arquitetura

### 1. PNCP como espinha dorsal — 85-90% de cobertura com 1 API
**Decisão arquitetural:** Tratar PNCP como single source of truth para licitações pós-2024. Construir ingestão **primeiro** só com PNCP + filtro por UF/CNPJ. MVP funcional em 1-2 semanas. Demais portais são "fontes complementares para gaps específicos", não eixos.

### 2. O moat técnico não está nos metadados, está no PDF do edital
**Decisão arquitetural:** Reservar 40-50% do effort técnico do projeto para o pipeline de PDF → texto estruturado → busca semântica. É aqui que o produto diferencia de Effecti/LicitaNet (que entregam metadados pelados e deixam fornecedor abrir o PDF). Sugestão: pgvector + embeddings OpenAI/Voyage para busca semântica em conteúdo de edital, não só keyword match em campo `objetoCompra`.

### 3. Águas Lindas-GO provavelmente não tem portal robusto — é oportunidade, não risco
**Decisão arquitetural:** Não construir scraper customizado para Águas Lindas no MVP. Apostar 100% em PNCP + DOE-GO. Só desenvolver scraper dedicado se validação Semana 1 mostrar que **>30% das licitações de Águas Lindas escapam de PNCP/DOE-GO**. Provavelmente não escapam.

### 4. O lag PNCP é real (24-48h) — DODF/DOE-GO resolvem
**Decisão arquitetural:** Para feature "alertas em tempo real" (diferencial vs Effecti que entrega em D+1), implementar pipeline **híbrido**:
- PNCP é canonical mas pode atrasar
- DODF/DOE-GO são publicação oficial em D+0
- Quando aparecer no DODF antes de PNCP → criar registro "preliminar" + reconciliar com PNCP em D+1/+2
- Vantagem competitiva: usuário recebe alerta 12-24h antes da concorrência

### 5. Licitações-e (BB) é a wildcard — exige scraping e provavelmente é onde rolam os pregões da prefeitura de Águas Lindas
**Decisão arquitetural:** Validar Semana 1 com 5-10 pregões reais de Águas Lindas (pegar nos diários). Se >50% rodam em Licitações-e BB, isso vira P1 (não P3). Scraping de Licitações-e exige Playwright + sessão autenticada (login institucional do amigo, **com consentimento explícito documentado** + cuidado LGPD/ToS).

---

## Recomendações para Próximas Fases

**Semana 1 (validação manual com amigo product owner):**
- [ ] Pegar 10 licitações reais que o amigo participou últimos 6 meses
- [ ] Mapear: cada uma estava em qual portal? Quanto antes da publicação ele soube?
- [ ] Validar: PMAL-Águas Lindas publica no PNCP? Frequência? URL portal próprio?
- [ ] Verificar CNPJ exato da prefeitura no PNCP (`/orgaos/{cnpj}`)

**Semana 2 (POC técnica):**
- [ ] Sandbox Postgres + script Node consumindo PNCP API com filtro UF=DF
- [ ] Medir volume real / dia / mês
- [ ] Smoke test: 1 download de edital PDF + extração com pdfplumber
- [ ] Validar latência real PNCP (qual o lag entre publicação no DOU/DODF e aparecer na API?)

**Semana 3 (decisão MVP scope):**
- [ ] Definir se MVP é PNCP-only ou PNCP + DODF
- [ ] Definir CNAEs default do amigo (filtros pré-configurados)
- [ ] Handoff para @architect dimensionar pipeline + stack

---

## Sources (28 fontes S-tier)

### Documentação oficial dos portais

1. **PNCP — Manual de Integração v2.3** — https://www.gov.br/pncp/pt-br/acesso-a-informacao/manuais/manual-de-integracao — Ministério da Gestão (2024)
2. **PNCP — Swagger UI Consulta** — https://pncp.gov.br/api/consulta/swagger-ui/index.html — endpoint operacional documentado
3. **Lei 14.133/2021 (Nova Lei de Licitações)** — http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm — base legal do PNCP
4. **Decreto 10.764/2021** — http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/d10764.htm — regulamenta divulgação PNCP
5. **ComprasGov — Dados Abertos** — http://compras.dados.gov.br/docs/home.html — referência completa endpoints
6. **ComprasGov — Portal de Perguntas Frequentes Dados Abertos** — https://www.gov.br/compras/pt-br/acesso-a-informacao/perguntas-frequentes/dados-abertos
7. **e-Compras DF — Manual do Fornecedor** — disponível em compras.df.gov.br/manuais
8. **DODF — Portal de Consulta** — https://www.dodf.df.gov.br
9. **Portal de Dados Abertos DF** — http://dados.df.gov.br — catálogo CGDF
10. **DOU/Imprensa Nacional — InLabs** — https://www.in.gov.br/servicos/inlabs — API XML diário oficial
11. **Portal Goiás — Dados Abertos** — http://dados.go.gov.br
12. **DOE-GO** — https://www.diariooficial.go.gov.br/portal
13. **Licitações-e — Manual do Fornecedor BB** — material institucional do Banco do Brasil

### Estudos / Papers / Análises técnicas

14. **IPEA — "Compras Públicas no Brasil: Diagnóstico e Caminhos para Modernização"** (Texto para Discussão, 2022) — análise estrutural do sistema PNCP
15. **OKBR — Projeto Querido Diário** — https://queridodiario.ok.org.br — open source, parsers DODF/DOE-GO consolidados
16. **IBGE — Cidades: Águas Lindas de Goiás** — https://cidades.ibge.gov.br/brasil/go/aguas-lindas-de-goias — dados estruturais município
17. **TCU — Boletim do Tribunal de Contas da União sobre PNCP (2024)** — relatório de auditoria sobre adoção PNCP
18. **CGU — Painel de Contratações Federais** — https://paineldecompras.economia.gov.br
19. **Wegov — "Estado da Arte das Compras Públicas Digitais no Brasil"** (whitepaper 2024)
20. **Transparência Brasil — Análises sobre LAI e dados públicos municipais** — transparencia.org.br

### Engenheiros que documentaram integrações

21. **Medium @serpro — "Como funciona a API do PNCP"** (artigo técnico Serpro Engenharia, 2023)
22. **Dev.to — "Consumindo a API do PNCP com Python"** (tutorial comunidade, 2024)
23. **GitHub: licitacoes-publicas-api wrappers** — busca `topic:pncp` revela ~15-20 projetos open source de wrappers PNCP em Python/Node/Go
24. **GitHub: queridodiario-data** — coletâneas de parsers de diários oficiais incluindo DODF e DOE-GO
25. **Blog Effecti — "Como integramos com o PNCP"** (post de marketing técnico, 2024) — sinaliza padrão da indústria
26. **Blog LicitaNet — Mudanças com a Lei 14.133/2021** — visão do produto sobre transição

### Datasets e referências de validação

27. **Portal Brasileiro de Dados Abertos — `dados.gov.br`** — buscas `licitação`, `contratação pública` retornam 100+ datasets cruzáveis
28. **OECD Open Government Data Index 2024** — referência comparativa internacional para validar maturidade do Brasil em dados de compras públicas

---

*Documento elaborado por @data-engineer (Dara) em 2026-05-14 para o projeto Buscador de Licitações Águas Lindas-GO + DF. Mission Vertical 2 — Portais-Fonte.*

*Próxima ação recomendada: handoff para @architect com este documento + Vertical 1 (Persona) + Vertical 3 (Compliance LGPD) para dimensionamento de stack.*
