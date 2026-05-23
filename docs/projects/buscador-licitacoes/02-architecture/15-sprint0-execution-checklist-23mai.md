# Noyce - Sprint 0 execution checklist

Data: 2026-05-23
Status: active execution checklist
Fonte: `STORY-NOYCE-S0-MVP-WORKFLOW.md`, ADR-001, plano 14, SQL 0001 e contrato de adapter

## Objetivo

Transformar os artefatos de arquitetura do Sprint 0 em uma fila executavel, sem esperar dados reais da cliente nem iniciar automacao autenticada.

A rota vigente e:

- workflow-first;
- modelo canonico multi-fonte com fontes equivalentes;
- evidencias e confianca por campo;
- score explicavel;
- nenhuma acao externa sem aprovacao humana, ToS, vault e auditoria.

## Estado atual

Artefatos ja existentes:

- `ADR-001-equal-priority-multisource-canonical-model-22mai.md`
- `13-sprint0-council-routing-22mai.md`
- `14-sprint0-schema-adapters-implementation-plan-22mai.md`
- `sql/0001_noyce_equal_priority_canonical_schema.sql`
- `contracts/source-adapter.contract.ts`
- `docs/stories/active/STORY-NOYCE-S0-MVP-WORKFLOW.md`

Decisao operacional:

- nao criar scaffold de app ate fechar pelo menos contrato, schema, fixtures anonimizadas e testes de contrato;
- continuar apenas com trabalho nao critico: docs, fixtures anonimizadas, pseudo-testes, gate plan e auditoria de consistencia.

## Fila de execucao

### 1. Revisao de schema

Status: updated in SQL reference

Checklist:

- Confirmar se todas as tabelas tenant-scoped tem `org_id`.
- Confirmar se todas as tabelas tenant-scoped tem RLS habilitado.
- Confirmar se `sources` continua global e somente leitura para usuarios autenticados.
- Revisar `source_records` para a combinacao `source_candidate_id + external_id + raw_hash`, ja que a constraint atual cobre `source_id` e pode nao impedir duplicatas em fontes candidatas com `source_id` nulo.
- Revisar FKs de `price_references` e `competitor_signals` para garantir que `evidence_id` nunca aponte para evidencia de outro tenant.
- Definir se `organizations` e criado apenas por service role ou se precisa policy de insert controlada.
- Criar nota explicita de que service-role workers devem validar `org_id` no app antes de escrever.

Resultado 2026-05-23:

- Adicionados indices unicos parciais para dedupe de `source_records` por fonte conhecida e fonte candidata.
- `price_references`, `competitor_signals` e `field_confidence` agora referenciam `field_evidence` por `(org_id, evidence_id)`.
- Comentario de service-role atualizado para explicitar validacao obrigatoria de `org_id` no worker.

Gate:

- 0 tabela de dados do cliente sem `org_id`.
- 0 tabela de dados do cliente sem RLS.
- 0 policy com vazamento cross-tenant.
- 0 dependencia estrutural em fonte principal.

### 2. Revisao do contrato de adapter

Status: contract tests specified

Checklist:

- Tornar `fieldEvidence` obrigatorio para campos criticos ou registrar lacuna como `QualityIssue`.
- Adicionar tipo explicito para lacuna de campo, se a implementacao preferir separar de `QualityIssue`.
- Confirmar que `SourceRecord.rawPayload` nunca sera logado inteiro.
- Confirmar que `authContext: "user_credential"` fica bloqueado no Sprint 0.
- Confirmar que `candidate:*` tem caminho claro para preencher `source_candidate`.
- Definir versao inicial do contrato: `source-adapter.contract.v0`.

Resultado 2026-05-23:

- Criado `contracts/source-adapter.contract-tests.md`.
- Testes especificam cobertura de fontes, integridade de `SourceRecord`, rastreabilidade de `CanonicalCandidate`, lacunas, conflitos, fonte candidata e seguranca de fixtures.
- Criado `fixtures/validate-fixtures.mjs` e validado com sucesso: 7 `SourceRecord`, 7 `CanonicalCandidate`.

Gate:

- Nenhum adapter decide score final.
- Nenhum adapter decide merge final.
- Nenhum adapter omite origem, evidencia ou lacuna.
- Nenhum adapter autenticado roda sem feature flag e aprovacao.

### 3. Fixtures anonimizadas multi-fonte

Status: complete for fixture v0

Fixtures esperadas:

- `pncp`
- `pcp`
- `bll`
- `bnc`
- `comprasgov`
- `sislog`
- `candidate:<portal>`

Artefatos iniciais:

- `fixtures/README.md`
- `fixtures/source-records.v0.json`
- `fixtures/canonical-candidates.v0.json`
- `fixtures/validate-fixtures.mjs`
- `contracts/source-adapter.contract-tests.md`

Regras:

- Usar os 11 editais reais apenas como base estrutural; anonimizar ou reduzir qualquer dado sensivel antes de fixture publica do workspace.
- Cada fixture deve conter `rawPayload`, `rawHash`, `externalUrl` ou justificativa de ausencia.
- Cada fixture deve incluir pelo menos uma lacuna declarada.
- Pelo menos uma fixture deve ter conflito de valor, data ou modalidade entre fontes.
- Pelo menos uma fixture deve representar portal novo dentro do raio de 500 km como `source_candidate`.

Gate:

- 2 fontes, no minimo, normalizam para o canonico.
- Nenhuma fixture exige credencial real.
- Nenhuma fixture contem segredo, token, certificado, cookie ou dado privado de login.

Resultado 2026-05-23:

- PASS local em `node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`.
- Cobertura v0: `pncp`, `pcp`, `bll`, `bnc`, `comprasgov`, `sislog`, `candidate:portal-regional-fixture`.

### 4. Normalizacao e evidencia

Status: specified

Fluxo esperado:

```text
SourceRecord
-> CanonicalCandidate
-> fieldEvidence
-> fieldConfidence
-> dedupeLinks
-> Opportunity
```

Campos criticos:

- objeto;
- CNPJ/nome do orgao;
- municipio/UF/codigo IBGE;
- modalidade;
- numero do processo;
- valor estimado;
- prazo de proposta;
- data de disputa;
- itens;
- requisitos tecnicos;
- vencedor;
- valor final;
- contrato/homologacao.

Gate:

- todo campo critico tem evidencia, confianca ou lacuna;
- inferencia aparece como inferencia;
- conflito aparece como `conflicting`, nao sobrescrita silenciosa.

Resultado 2026-05-23:

- Criado `16-sprint0-normalization-dedupe-score-spec-23mai.md`.
- Especificada a passagem `SourceRecord -> CanonicalCandidate -> source_records -> buyers -> opportunities -> evidence -> confidence -> dedupe -> analysis_runs`.

### 5. Dedupe/link v0

Status: specified

Regras:

- `>=80`: auto-merge;
- `60-79`: candidate link;
- `<60`: manter separado.

Casos obrigatorios:

- mesmo edital observado por PNCP e fonte privada;
- contrato PNCP relacionado sem identificador forte de compra;
- conflito entre valores estimados;
- fonte candidata descoberta no raio.

Gate:

- nenhum contrato/homologacao vira merge automatico sem identificador forte;
- nenhum merge destrutivo apaga evidencia conflitante.

Resultado 2026-05-23:

- Regras de dedupe/link v0 especificadas em `16-sprint0-normalization-dedupe-score-spec-23mai.md`.

### 6. Score v0

Status: specified

Formula inicial:

```text
25% fit com a empresa
20% atratividade financeira
15% concorrencia esperada
15% risco operacional/habilitacao
10% urgencia/prazo
10% qualidade das evidencias
5% sinal estrategico/manual
```

Gate:

- `opportunity_score` e `confidence_score` ficam separados;
- `analysis_runs` salva versao, inputs, componentes, motivos e lacunas;
- score alto com confianca baixa vira alerta de incompletude, nao recomendacao forte.

Resultado 2026-05-23:

- Formula, `confidence_total` e mensagens de produto especificadas em `16-sprint0-normalization-dedupe-score-spec-23mai.md`.

### 7. Superficie operacional

Status: pending

Primeira experiencia:

- inbox operacional de oportunidades priorizadas;
- detalhe com fato, inferencia e lacuna;
- preco e concorrentes por evidencia;
- checklist de habilitacao;
- timeline do processo;
- estagio atual do workflow.

Bloqueios:

- sem landing page;
- sem chat como experiencia principal;
- sem automacao autenticada;
- sem promessa de vencedor, contrato exato ou cobertura total.

## Pendencias que aguardam founder

- CNPJ/razao social da ENIAC;
- confirmar usuarios e papeis reais da ENIAC;
- prioridade real das fontes por frequencia de uso; ENIAC confirmou uso de PNCP, PCP, BLL, BNC, ComprasGov e SISLOG;
- login/acesso aos buscadores via vault, sem salvar segredo em repo;
- autorizacao para automacao autenticada;
- uso de login, certificado digital, token ou credencial;
- decisao em ToS cinza;
- execucao contra banco de producao.

## Proximo passo recomendado

Executar o dry-run Sprint 0 antes de scaffold de app:

```bash
node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs
```

Isso valida o nucleo do Sprint 0 sem depender de Supabase real, sem credenciais e sem automatizar portal.

Resultado 2026-05-23:

- PASS: `sprint0 dry-run ok: 7 candidates, 1 dedupe links, 7 analysis runs`.
- Outputs gerados em `outputs/sprint0-dry-run/`.
- O caso PNCP + BLL conflitante gerou `candidate_link`, nao merge destrutivo.
- `same-opportunity-private-conflict` apareceu como `revisao obrigatoria`.
- `candidate:portal-regional-fixture` permaneceu processavel como fonte candidata.
