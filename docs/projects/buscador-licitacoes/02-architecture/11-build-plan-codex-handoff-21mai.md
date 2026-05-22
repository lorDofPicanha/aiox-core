# Noyce — Build Plan / Handoff para construção no Codex — 21/Mai/2026

**Autor:** Orion (aios-master) · **Para:** build no Codex (owner constrói; este doc é raciocínio + pesquisa, não código)
**Fontes:** CONTEXT v5 + spikes `02-spike`..`10-spike` + dataset real `01-research/04-editais-reais-21mai.md`

> **Como usar:** alimente este doc + o CONTEXT.md + os spikes citados ao Codex. Ele tem o "o quê / por quê / em que ordem / com quais gates". Decisões abertas (§7) e itens de pesquisa (§8) devem ser resolvidos antes ou durante o respectivo sprint.

---

## 1. O que estamos construindo
**Noyce** — workflow-as-a-service para uma operação de obras/engenharia que disputa licitações. 6 estágios + base:
`1 Monitorar → 2 Analisar 6m → 3 Indicar → 4 Habilitar → 5 Acompanhar → 6 Recorrer` (livro caixa = SaaS BR externo, fora do build).

**Disciplina inegociável (gate-first):** rodar os **2 experimentos de gate** (§5) ANTES de escalar o build. Se o moat (Stage 2) não se sustenta nos dados reais, descobre-se cedo e barato.

## 2. Stack confirmada
| Camada | Escolha |
|---|---|
| Frontend/Backend | **Next.js 16** (App Router, Route Handlers, Server Actions) |
| Workers/Cron/Retry | **Inngest** |
| DB + Auth + Storage + RLS | **Supabase** (Postgres + pgvector) |
| Busca | Postgres FTS (`portuguese`) + pgvector (híbrido BM25+cosine) |
| Embeddings PT-BR | **`BAAI/bge-m3`** (MIT, `vector(1024)`, contexto 8192) — A/B vs Legal-BERTimbau-sts. Ver `01-research/10-embeddings-legal-bertimbau` |
| PDF parsing | **Docling (MIT)** + pdf-lib (NÃO Marker/GPL, NÃO PyMuPDF/AGPL) |
| LLM | **Claude Sonnet 4.x** + prompt caching |
| Scraping | Playwright em workers Inngest |
| Notificação | WhatsApp Cloud API + Resend (email) + PWA push |
| Validação CNPJ alfanumérico | `cpf-cnpj-validator` (MIT) |
| OCDS BR | OCDS Kit (BSD-3) |
| Observability | Sentry (+ Axiom opcional) |

**Escopo geográfico:** filtro **haversine ~500km** da sede Águas Lindas (lat -15,75 / lon -48,28), configurável. Cobertura nacional via PNCP filtrada por distância. Dataset de municípios IBGE (lat/long) para o cálculo de raio.

## 3. Estrutura de repo sugerida (Codex monta)
```
noyce/
  app/                 # Next.js 16 (feed, detalhe edital, dossiê, config perfil/empresa)
  lib/
    sources/           # X1: adapters (pncp, pcp, bll, bnc, comprasgov, sislog) — interface comum
    geo/               # haversine + dataset municípios IBGE (filtro raio)
    parsing/           # Docling client + extração estruturada (Stage 4)
    enrich/            # resumo IA + embeddings (Legal-BERTimbau)
    matching/          # perfil × edital (lexical + semântico)
    synthesis/         # Stage 3: gerador 5-frases (RAG ancorado)
    legal/             # Stage 6: classificador substantivo/sanável + minuta (RAG TCU)
    vault/             # X3: credenciais cifradas + docs da cliente
  inngest/             # functions: ingest.*, process.enrich, match.run, notify.send, session.watch
  supabase/            # migrations + RLS policies (X2)
```

## 4. Sequência de sprints (gate-first)
| Sprint | Entrega | Spikes | Gate de saída |
|---|---|---|---|
| **0 — Fundação** | Schema canônico + RLS multi-tenant (X2) + Supabase + auth + adapter PNCP (descoberta) + filtro raio 500km | X2, X1(PNCP), Stage 1 | Editais GO+entorno aparecem filtrados por raio; 0 vazamento cross-tenant |
| **GATE — Moat** | **Experimento de cobertura (Stage 2)** com os 11 editais reais | Stage 2 | Cobertura ≥50% + hit-rate vencedor ≥50% + MAPE preço ≤15% (senão KILL/PIVOT) |
| **1 — Monitorar+Notificar** | Match perfil×edital + push WhatsApp <15min + adapter PCP (API) | Stage 1, X1(PCP) | Cliente recebe alerta relevante real |
| **2 — Habilitar** | Docling parse + extração de requisitos + matcher vs vault de docs (X3) | Stage 4, X3 | Recall requisitos críticos ≥90% nos editais reais |
| **3 — Indicar** | Gerador 5-frases ancorado (RAG histórico+edital) | Stage 3 | Cliente julga ≥60% das frases úteis, 0 alucinação |
| **4 — Acompanhar** | Monitor de sessão (auth-poll OU robô-parceiro — D3/X3 ToS) | Stage 5, X3 | Push de movimentação na licitação em disputa |
| **5 — Recorrer** | Classificador substantivo/sanável + minuta (revisão humana) | Stage 6 | ≥70% concordância com especialista; nunca auto-submit |

## 5. Experimentos de gate (rodar primeiro — usam os 11 editais reais)
1. **Cobertura Stage 2 (KILL-GATE):** para cada um dos 11 editais, consultar PNCP (API Consulta, UF=GO + data) e verificar se edital + desfecho (vencedor/valor) aparecem. Foco em municípios pequenos (Abadiânia, Novo Gama). Mede se o moat de "histórico do órgão" é viável. → **plano executável (com CNPJs + curls) em `12-experimento-cobertura-stage2-21mai.md`**; origem `04-spike-stage2`.
2. **Parsing Stage 4:** Docling em 3 editais (1 PCP, 1 BLL, 1 BNC) → extrair objeto, valor, modalidade, requisitos de habilitação técnica (atestados/CAT/CREA/garantia/BDI). Comparar com leitura manual. → spike `06-spike-stage4`.

### 5.1 Resultado do gate Stage 2 — execução Codex 21/Mai/2026

Comando executado:

```bash
rtk npm run noyce:gate:stage2 -- --timeout-ms 15000 --retries 2 --delay-ms 700
```

Saídas:
- `docs/projects/buscador-licitacoes/outputs/stage2-coverage-resultado.csv`
- `docs/projects/buscador-licitacoes/outputs/stage2-coverage-summary.json`

Resultado inicial:

| Métrica | Resultado | Gate |
|---|---:|---|
| Cobertura descoberta | 6/11 = 54,5% | PASS |
| Hit-rate desfecho | 6/6 = 100% | PASS |
| MAPE médio | 16,8% | FAIL |
| Metadados incompletos | 6/11 | risco de amostra |

**Decisão:** não criar scaffold Next.js ainda. O Stage 2 é promissor, mas não passou limpo: MAPE ficou acima do limite de 15% e metade da amostra ainda tem metadados incompletos. Próximo passo é completar CNPJ/valores faltantes e refinar matching de contrato por `numeroControlePNCP`/sequencial antes de liberar Sprint 0 schema+RLS.

Resultado refinado após extração de metadados dos TXT:

| Métrica | Resultado | Gate |
|---|---:|---|
| Cobertura descoberta | 7/11 = 63,6% | PASS |
| Hit-rate desfecho | 5/7 = 71,4% | PASS |
| MAPE médio | 14,9% | PASS |
| Metadados incompletos | 3/11 | risco |
| Linhas MAPE preliminar | 6 | risco |
| Joins exatos por `numeroControlePncpCompra` | 0 | risco |

**Decisão atualizada:** `PIVOT`, não `GO`. Os thresholds passam, mas o MAPE segue preliminar porque o vínculo contrato↔edital caiu em aproximação por valor/CNPJ ou homologação na publicação, não em identificador PNCP exato. Auditoria adicional em `outputs/stage2-preliminary-match-audit.md`: nenhum dos 7 `numeroControlePNCP` de compra apareceu como `numeroControlePncpCompra` em `/contratos`. Próximo passo: auditoria manual das 6 linhas preliminares gravadas na última execução no PNCP/UI dos portais ou resolver desfecho via IDs do portal de origem antes de criar scaffold do app.

## 6. Modelo de dados (ponto de partida)
- Tabela canônica `licitacoes` + `perfis_fornecedor` + `matches`: ver `00-arch-skeleton.md` (ajustar: `uf`/`municipio` → filtro por raio; `modalidade` inclui `concorrencia_eletronica`/`pregao_eletronico`; perfil com `cnaes` de construção 41/42/43).
- Multi-tenant: `organizacoes` / `empresas (cnpj)` / `usuarios` / `papeis` + RLS — ver `09-spike-x2`.
- Vault: credenciais cifradas + docs da cliente — ver `10-spike-x3`.

## 7. Decisões abertas que bloqueiam (resolver na call de discovery)
| ID | Decisão | Bloqueia |
|---|---|---|
| **C1** | Nomes das 3 empresas + qual licita | onboarding / vault |
| **D1** | Raio ~500km **mantido** (owner) — fixo ou ajustável por contrato? | filtro geo |
| **D2** | Prioridade das 5 fontes (PCP/BLL/BNC/ComprasGov/**SISLOG**) — sai da frequência real, não da amostra | ordem dos adapters |
| **D3** | Stage 5: ⚠️ **pesquisa recomenda BUILD** (não há API de sessão; Lance Fácil é SaaS fechado, não integrável). Automação Playwright **operada pela cliente com a credencial/cert dela** + consentimento. Confirmar com a cliente se já usa robô (B2). Detalhe: `01-research/08-fontes-disputa-stage5` | Sprint 4 |
| **D4** | Livro caixa: SaaS BR (recomendado) — confirma estar fora do build | escopo |
| **D5** | Papéis dos 4 usuários (busca/habilita/lance/recorre) | RLS (X2) |
| **D-X1.2** | Solicitar chave API PCP (lead ~7 dias úteis) | Sprint 1 |
| **D-X3.2** | Auditoria de ToS das plataformas (automação autenticada) | Sprint 4 (gate legal) |

## 8. Itens de pesquisa ainda necessários (antes do sprint que dependem)
1. ✅ **API PCP** — pesquisado em `01-research/05-pcp-api-21mai.md`. **Achado crítico:** API pública SEM filtro por órgão/UF/modalidade (só status + data + paginação) → **filtrar client-side**. Auth = `publicKey` (query-param); chave em ~7 dias úteis (solicitar já se PCP P0).
2. **PNCP** — já verificado (CONTEXT §10.2.1): API Consulta + Integração, sem webhook, lag D+1/D+2. Confirmar rate limit real no experimento (§5.1 / doc `12-experimento-cobertura-stage2`).
3. ✅ **Docling** — pesquisado em `01-research/06-docling-21mai.md`. MIT; Python 3.10+; ~3s/pág CPU nativo / ~13s/pág OCR (GPU ~6×); servir via `docling-serve` (Docker CUDA); `TableFormerMode.ACCURATE` p/ planilhas; `lang=["pt"]`. Verificar licença dos pesos + RAM real.
4. ✅ **BLL/BNC/SISLOG** — pesquisado em `01-research/08-fontes-disputa-stage5`. Editais → todos sincronizam ao PNCP (não scrapear p/ descoberta). Sessão ao vivo só via automação de credencial. BNC tem feed de e-mail (atalho MVP). ToS: BLL/BNC cinza, SISLOG desconhecido (maior risco).
5. ✅ **Lance Fácil** — SaaS fechado, sem API/parceria → **não integrável**; confirma decisão BUILD do Stage 5 (D3).
6. ✅ **Embeddings** — `01-research/10-embeddings-legal-bertimbau`: recomendado **`bge-m3`** (`vector(1024)`, contexto 8192) > Legal-BERTimbau (é MLM, não serve p/ embedding; cap 512). pgvector `vector(1024)` + HNSW + cosine; A/B sem mudar schema.
7. ✅ **Dataset municípios IBGE** — `01-research/09-pncp-ibge-deep`: usar **IBGE Localidades geoespacial** (geoftp, .gpkg/.shp tem lat/long; a REST API não tem). Código 7-díg == `codigoMunicipioIbge` do PNCP. Atalho: CSV `kelvins/municipios-brasileiros` (não-oficial).
8. **Confirmar valores faltantes** dos editais CEASA/Anápolis/Novo Gama (anexos de planilha). *(pendente)*

**✅ Premissa resolvida (teste ao vivo 21/Mai — doc `09-pncp-ibge-deep`):** os filtros `cnpj`/`codigoMunicipioIbge` em `contratacoes/publicacao` e `cnpjOrgao` em `contratos` **funcionam server-side** (refuta §10.2.1). → Descoberta = consultar por **município (raio→códigos IBGE)** ou **órgão** direto, sem paginar a UF inteira. Histórico do órgão (Stage 2) via `contratos?cnpjOrgao`. NÃO há dump de `/orgaos` (só por CNPJ) → mapa geo vem do IBGE Localidades. Rate limit não documentado → throttle + retry (alguns requests deram falha transitória no teste).

## 9. Restrições duras (não negociáveis no build)
- **LGPD** desde o dia 1 (dados de CNPJs + credenciais). Minimização + log de acesso + consentimento.
- **Vault:** credencial nunca em claro em log/trânsito; lida só no worker (X3).
- **Stage 6:** minuta é rascunho assistido — **sempre revisão humana**, nunca protocolo automático.
- **Gate legal (ToS):** Stage 5 autenticado só onde a ToS permite; senão, robô-parceiro ou descartar a fonte.
- **Boring tech:** cada componente extra paga seu custo de complexidade.

## 10. Correcao de rota - Sprint 0 workflow-first (2026-05-22)

O gate PNCP confirmou que a fonte e util para descoberta, cobertura e historico parcial, mas tambem mostrou um limite importante: o PNCP sozinho nao deve ser tratado como fonte unica para vencedor, contrato ou inteligencia completa de concorrencia.

Portanto, o Sprint 0 do Noyce deve ser conduzido como `workflow-first + multi-source canonical model`, nao como `PNCP-first`.

### Tese operacional

Noyce e um workflow de licitacoes que:

- monitora oportunidades em PNCP, PCP, BLL, BNC, ComprasGov e SISLOG;
- normaliza editais, itens, orgaos, prazos, eventos e documentos;
- analisa oportunidade, concorrentes, valores medios, risco de habilitacao e urgencia;
- acompanha o processo vivo ate sessao, impugnacao, recurso e contrato;
- mostra evidencias e nivel de confianca por campo, evitando prometer certeza quando ha lacuna de dado.

### Nova story de execucao

A story ativa para o proximo passo e:

- `docs/stories/active/STORY-NOYCE-S0-MVP-WORKFLOW.md`

Ela substitui a leitura estreita de "buscador PNCP" por um Sprint 0 focado em:

- schema canonico multi-fonte;
- contrato de adapters;
- fixtures PNCP + fonte secundaria;
- score v0 explicavel;
- workflow Monitorar -> Analisar -> Indicar -> Habilitar -> Acompanhar -> Recorrer;
- primeira superficie operacional usando a identidade Noyce existente.

### Implicacao para agentes

AIOS Master deve rotear o trabalho assim:

- `@product`: tese, escopo MVP, workflow e decisoes humanas C1/D1/D2/D5/D6.
- `@backend`: modelo canonico, adapters, dedupe, evidencias e qualidade dos dados.
- `@data`: embeddings, score, concorrencia, preco medio e confianca.
- `@frontend`: experiencia operacional com a identidade Noyce.
- `@qa`: gates com fixtures, regressao de ingestao e testes de score.
- `@devops`: ambiente, secrets, jobs e observabilidade.

---
*Handoff por Orion (aios-master). Raciocínio + pesquisa consolidados para construção no Codex. Gate-first: experimentos do §5 antes de escalar.*
