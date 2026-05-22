# Noyce - Sprint 0 Council Routing

Data: 2026-05-22
Status: em consolidacao
Fonte principal: `docs/stories/active/STORY-NOYCE-S0-MVP-WORKFLOW.md`
ADR: `ADR-001-equal-priority-multisource-canonical-model-22mai.md`
Build plan: `14-sprint0-schema-adapters-implementation-plan-22mai.md`
SQL reference: `sql/0001_noyce_equal_priority_canonical_schema.sql`
Adapter contract: `contracts/source-adapter.contract.ts`

## Objetivo

Consolidar a execucao em modo council para o Sprint 0 do Noyce, usando a arquitetura atual de 25 squads / 210+ especialistas.

O ponto central e manter a rota correta:

- Noyce nao e apenas um buscador PNCP.
- Nao existe fonte principal no produto: PNCP, PCP, BLL, BNC, ComprasGov, SISLOG e novos portais descobertos no raio operacional devem ter o mesmo nivel de importancia no modelo.
- O Sprint 0 deve construir o modelo canonico multi-fonte e o workflow operacional.
- A experiencia precisa cobrir Monitorar -> Analisar -> Indicar -> Habilitar -> Acompanhar -> Recorrer.

## Councils Acionados

| Council | Lentes/especialistas | Pergunta principal |
|---|---|---|
| Produto/MVP | `@marty-cagan`, `@teresa-torres`, `@april-dunford` | Qual deve ser o recorte minimo vendavel e validavel do Sprint 0? |
| Juridico/Licitacoes | `@marcal-justen-filho`, `@joel-de-menezes-niebuhr`, `@patricia-peck` | Quais limites legais, operacionais e de compliance precisam travar o desenho? |
| Arquitetura/Adapters | `@martin-kleppmann`, `@martin-fowler`, `@joe-reis`, `@data-engineer` | Como modelar dados, adapters, dedupe, evidencias e confianca por campo? |
| Dados/Score | `@cassie-kozyrkov`, `@chip-huyen`, `@nate-silver` | Como criar score v0 explicavel sem caixa-preta? |
| UX/Brand | `@ux-design-expert`, `@don-norman`, `@julie-zhuo`, `@marty-neumeier` | Como deve ser a primeira experiencia operacional usando a identidade Noyce? |
| Seguranca/QA/DevOps | `@ann-cavoukian`, `@bruce-schneier`, `@tanya-janca`, `@charity-majors`, `@gene-kim`, `@kent-beck` | Quais gates, controles e observabilidade sao obrigatorios antes de automatizar? |

## Decisoes Consolidadas

### 1. Escopo Sprint 0

Construir o minimo necessario para provar que o Noyce e uma mesa de inteligencia e acompanhamento de licitacoes, nao um buscador de edital.

O Sprint 0 deve entregar:

- Inbox de oportunidades priorizadas com arquitetura multi-fonte desde o inicio.
- Adapters/fixtures em paralelo para todas as fontes priorizadas conhecidas: PNCP, PCP, BLL, BNC, ComprasGov e SISLOG.
- Registro de novas fontes candidatas quando a busca no raio de 500 km encontrar edital em portal fora da lista.
- Modelo canonico multi-fonte com origem, evidencia e confianca por campo.
- Score v0 explicavel e separado de confianca da analise.
- Detalhe da oportunidade com resumo, evidencias, lacunas, preco, concorrencia, habilitacao e timeline.
- Workflow simples: Monitorar -> Analisar -> Indicar -> Habilitar -> Acompanhar -> Recorrer.
- Registro de responsavel, prazo, estagio e motivo da decisao.

Pergunta que o MVP deve responder:

> Essa oportunidade vale minha atencao agora, por que, qual o risco, quem costuma competir, quanto costuma custar e qual o proximo movimento?

### 2. Modelo Canonico

O Noyce deve tratar fontes como eventos observados, nao como verdade absoluta.

Schema minimo recomendado:

- `sources`
- `source_candidates`
- `source_records`
- `buyers`
- `suppliers`
- `opportunities`
- `opportunity_items`
- `notice_documents`
- `process_events`
- `deadlines`
- `price_references`
- `competitor_signals`
- `analysis_runs`
- `field_evidence`
- `field_confidence`
- `dedupe_links`

Regras estruturais:

- `source_records` guarda o bruto versionado, com hash, URL, fonte e horario de coleta.
- O adapter retorna `CanonicalCandidate`, nao verdade final.
- A promocao para `opportunity` canonica passa por dedupe, merge e confidence.
- Todo campo critico precisa de evidencia ou lacuna declarada.
- Contrato/homologacao nao deve ser associado automaticamente ao edital sem identificador forte.
- Nenhuma fonte pode assumir prioridade estrutural. A prioridade do usuario aparece no score/configuracao, nao no modelo de dados.
- `source_candidates` registra portais ainda nao integrados encontrados dentro do raio operacional.

Politica de fontes:

- Fontes conhecidas P0: PNCP, PCP, BLL, BNC, ComprasGov, SISLOG.
- Fontes novas: qualquer portal recorrente encontrado nos municipios/orgaos dentro de 500 km deve ser cadastrado como `source_candidate`.
- A fonte candidata deve guardar: nome do portal, URL, municipio/UF, orgao, exemplos de editais, frequencia observada, tipo de acesso, necessidade de login/API, risco ToS e prioridade de adapter.
- Se a fonte candidata aparece em oportunidade relevante da area de 500 km, ela entra no backlog de adapter; nao deve ser descartada por nao estar na lista original.

Contrato conceitual dos adapters:

```ts
interface SourceAdapter {
  sourceCode: SourceCode;
  discover(params: DiscoverParams): Promise<SourceRecord[]>;
  fetchDetail(record: SourceRecord): Promise<SourceRecord>;
  fetchDocuments(record: SourceRecord): Promise<NoticeDocumentInput[]>;
  normalize(record: SourceRecord): Promise<CanonicalCandidate>;
  fetchEvents?(opportunity: OpportunityRef): Promise<ProcessEventInput[]>;
  fetchOutcomes?(opportunity: OpportunityRef): Promise<OutcomeSignalInput[]>;
  healthcheck(): Promise<AdapterHealth>;
}
```

Dedupe v0:

- Forte: `source_code + external_id`, `numeroControlePNCP`.
- Provavel: `buyer_cnpj + modalidade + numero_processo + ano`.
- Fuzzy: orgao, municipio, janela de data, similaridade do objeto, valor estimado e modalidade.
- `>=80`: auto-merge.
- `60-79`: candidate link/revisao.
- `<60`: manter separado.

### 3. Score v0

Score deterministico, explicavel e calibravel. Nao usar modelo preditivo opaco no Sprint 0.

Formula inicial:

```text
Score =
  25% fit com a empresa
+ 20% atratividade financeira
+ 15% concorrencia esperada
+ 15% risco operacional/habilitacao
+ 10% urgencia/prazo
+ 10% qualidade das evidencias
+ 5% sinal estrategico/manual
```

O produto deve mostrar dois numeros separados:

- `opportunity_score`: vale olhar?
- `confidence_score`: quanto confiar nessa leitura?

Concorrencia v0 deve ser classificada por evidencia:

- `confirmed`: contrato/resultado historico confirmado.
- `probable`: recorrencia forte por orgao/regiao/objeto.
- `possible`: fornecedor conhecido no segmento, mas sem vinculo direto.
- `no_evidence`: sem dado suficiente.

Preco deve ser faixa, nao numero unico:

- P25.
- Mediana.
- P75.
- Outliers separados.
- Tamanho da amostra.
- Nivel de confianca.

Embeddings/RAG:

- Usar `BAAI/bge-m3` para recuperar evidencias, nao para decidir sozinho.
- Chunk por secao logica.
- Toda resposta deve manter referencia a documento, pagina/secao e trecho.

### 4. UX Operacional

A primeira tela deve ser uma mesa de operacao, nao landing page, dashboard executivo ou busca simples.

Home operacional:

- Lista ranqueada de oportunidades.
- Acao recomendada: `Analisar`, `Preparar habilitacao`, `Acompanhar sessao`, `Avaliar recurso`, `Ignorar`.
- Score e confianca.
- Prazo critico.
- Valor/faixa.
- Orgao, municipio, distancia.
- Fonte e status do processo.

Detalhe da oportunidade:

- Cabecalho com objeto, orgao, municipio, valor, prazo e fonte.
- Bloco "Decisao Noyce" com recomendacao e score.
- Evidencias separando `fato`, `inferencia` e `lacuna`.
- Secoes: `Resumo`, `Preco`, `Concorrentes`, `Habilitacao`, `Timeline`, `Documentos`.

Checklist de habilitacao:

- Juridico/fiscal.
- Tecnica.
- Economico-financeira.
- Proposta.
- Exigencias especificas do edital.

Timeline:

- Publicacao.
- Esclarecimento.
- Impugnacao.
- Proposta.
- Sessao.
- Lances.
- Habilitacao.
- Resultado.
- Recurso.
- Homologacao.
- Contrato.

Linguagem visual:

- Engenharia calma, precisao, vigilancia e decisao.
- Ambâr para sinal/alerta/radar.
- Azul para confianca/fonte/evidencia.
- Verde apenas para confirmacao.
- Vermelho apenas para risco real ou prazo critico.

### 5. Compliance, Seguranca e Gates

Noyce deve ser copiloto de licitacoes, nao agente autonomo.

Permitido no Sprint 0:

- Coleta publica.
- Normalizacao.
- Dedupe.
- Alertas internos.
- Score.
- Checklist.
- Analise de risco.
- Minutas para revisao humana.

Bloqueado por padrao:

- Protocolo automatico.
- Lance automatico.
- Intencao recursal automatica.
- Assinatura.
- Envio de mensagem em sessao.
- Alteracao cadastral.
- Aceite de termos.

Gates obrigatorios:

- `human approval gate` para qualquer ato externo.
- RLS desde o primeiro schema.
- Vault antes de qualquer credencial real.
- Logs sem segredo.
- Auditoria de uso de credencial.
- Matriz ToS por portal.
- Consentimento formal da cliente por portal autenticado.
- Feature flag por tenant/fonte.
- Jobs idempotentes com retry, timeout, rate limit e dry-run.
- 100% das oportunidades com fonte/evidencia ou lacuna declarada.
- Nenhuma inferencia apresentada como fato.

Jobs recomendados:

- `source.discover`
- `source.fetch_document`
- `document.parse`
- `canonical.normalize`
- `opportunity.score`
- `deadline.compute`
- `notification.send`
- `session.watch` somente depois do gate autenticado.

### 6. Fora de Escopo

Nao construir agora:

- Landing page.
- Robô de lance.
- Automacao autenticada em BLL/BNC/PCP/SISLOG/ComprasGov.
- Protocolo automatico de impugnacao/recurso.
- Gerador juridico final sem revisao humana.
- Livro caixa.
- CRM.
- BI completo.
- Todos os adapters.
- Chat como experiencia principal.
- App mobile nativo.
- Modelo de IA generativo como centro do produto.
- Promessa de vencedor, contrato exato ou cobertura total.

### 7. Sequencia Tecnica Fechada

1. Criar ADR-001: multi-fonte equivalente + confianca por campo. Status: feito em `ADR-001-equal-priority-multisource-canonical-model-22mai.md`.
2. Criar schema canonico minimo.
3. Preparar fixtures reais: 11 editais + respostas/exports representando PNCP, PCP, BLL, BNC, ComprasGov e SISLOG quando houver dado disponivel.
4. Implementar contrato comum de adapter antes de privilegiar qualquer fonte.
5. Implementar adapters/fixtures por fonte conhecida em fatias pequenas e equivalentes.
6. Implementar normalizer com `field_evidence`.
7. Implementar dedupe v0 sem merge destrutivo.
8. Implementar confidence engine v0.
9. Implementar score v0 deterministico.
10. Criar primeira superficie operacional.
11. Rodar gate end-to-end.

Gate de Sprint 0:

- 11 editais entram no pipeline.
- Pelo menos 2 fontes normalizam para o canonico.
- 100% dos campos criticos tem evidencia ou lacuna.
- Dedupe nao faz merge indevido.
- Score mostra componentes e confianca.
- Nenhum segredo aparece em log.
- Nenhuma automacao autenticada roda sem ToS + consentimento + vault.

## Proximo Artefato Esperado

Depois da consolidacao, atualizar:

- `docs/stories/active/STORY-NOYCE-S0-MVP-WORKFLOW.md`
- `docs/projects/buscador-licitacoes/02-architecture/11-build-plan-codex-handoff-21mai.md`
- `docs/projects/buscador-licitacoes/README.md`, se o ponto de entrada precisar mudar.
