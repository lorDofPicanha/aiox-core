# Noyce - Sprint 0 gates and test plan

Data: 2026-05-22
Status: ready for QA handoff

## Scope

Validar o nucleo multi-fonte equivalente do Noyce antes de qualquer banco real, credencial real ou automacao autenticada.

Artefatos sob teste:

- `ADR-001-equal-priority-multisource-canonical-model-22mai.md`
- `sql/0001_noyce_equal_priority_canonical_schema.sql`
- `contracts/source-adapter.contract.ts`
- `contracts/source-adapter.contract-tests.md`
- `fixtures/source-records.v0.json`
- `fixtures/canonical-candidates.v0.json`
- `14-sprint0-schema-adapters-implementation-plan-22mai.md`

## Gate 0 - Critical founder wait

Nao executar sem o fundador:

- credencial real;
- certificado digital;
- login em BLL/BNC/SISLOG/ComprasGov/PCP autenticado;
- protocolo;
- lance;
- intencao recursal;
- assinatura;
- migration em banco de producao;
- decisao de ToS cinza;
- cadastro de CNPJ real se nao tiver autorizacao.

Pode executar sem o fundador:

- fixture;
- export manual anonimo;
- dry-run;
- teste local;
- validacao estatica;
- documentacao;
- schema review;
- contrato de adapter.

## Gate 1 - Schema static review

Checks:

- Todas as tabelas tenant-scoped possuem `org_id`.
- Todas as tabelas tenant-scoped possuem RLS enabled.
- Policies usam `is_org_member` ou `is_org_admin`.
- `sources` e global read-only para usuarios autenticados.
- `source_candidates` existe.
- `field_evidence` e `field_confidence` existem.
- `dedupe_links` existe.
- `document_chunks.embedding` usa `vector(1024)`.
- Nao ha coluna de senha/token/cookie em claro.

Expected result:

- PASS somente se nenhum dado de cliente puder existir fora de `org_id`.

## Gate 2 - Adapter contract review

Checks:

- Todo adapter implementa `discover`.
- Todo adapter implementa `fetchDetail`.
- Todo adapter implementa `fetchDocuments`.
- Todo adapter implementa `normalize`.
- `fetchEvents` e opcional.
- `fetchOutcomes` e opcional.
- `healthcheck` e obrigatorio.
- `CanonicalCandidate` contem `fieldEvidence`, `qualityIssues`, `sourceLinks` e `adapterMeta`.
- `candidate:*` e aceito como `SourceCode`.

Expected result:

- PASS somente se nenhuma fonte exigir contrato especial.

## Gate 3 - Fixture coverage

Status 2026-05-23: fixture v0 criada em `fixtures/` e validada por `fixtures/validate-fixtures.mjs`.

Fixtures minimas:

- PNCP.
- PCP.
- BLL.
- BNC.
- ComprasGov.
- SISLOG.
- Pelo menos uma `candidate:<portal>`.

Cada fixture deve conter:

- `sourceCode`.
- `externalId` ou URL estavel.
- `rawPayload`.
- `rawHash`.
- pelo menos 3 campos canonicos.
- pelo menos 1 evidencia.
- pelo menos 1 lacuna ou warning.

Expected result:

- PASS somente se todas as fontes conhecidas puderem atravessar o mesmo contrato, mesmo que algumas sejam export/manual fixture.

Resultado local:

- PASS: `fixture validation ok: 7 source records, 7 candidates`.

## Gate 4 - Canonical normalization

Status 2026-05-23: dry-run local criado em `scripts/sprint0-dry-run.mjs`.

Checks por oportunidade:

- `opportunity.object`.
- `buyer.name`.
- `city_ibge_code` ou lacuna.
- `modality` ou lacuna.
- `estimated_value` ou lacuna.
- `proposal_deadline` ou lacuna.
- `documents`.
- `fieldEvidence`.
- `fieldConfidence`.

Expected result:

- 100% dos campos criticos com evidencia, confianca ou lacuna declarada.

Resultado local:

- PASS estrutural: `outputs/sprint0-dry-run/field-confidence.v0.json` gerou 98 linhas de confianca/lacuna para 7 candidatos.
- Observacao: confianca media baixa e esperada nesta fase porque fixtures ainda nao incluem documentos, itens, requisitos tecnicos, vencedores ou contratos.

## Gate 5 - Dedupe/link safety

Casos obrigatorios:

- Mesmo edital em duas fontes com identificador forte.
- Mesmo edital em duas fontes sem identificador forte.
- Contrato relacionado sem identificador forte.
- Objeto parecido, mas edital diferente.
- Valor parecido, mas orgao diferente.

Expected result:

- Identificador forte pode gerar `auto_merge`.
- Sem identificador forte deve gerar `candidate_link` ou `related_contract`.
- Merge indevido e FAIL.

Resultado local:

- PASS: PNCP + BLL conflitante gerou 1 `candidate_link` com score 82 e `hasConflict: true`.
- Nenhum merge destrutivo foi gerado.

## Gate 6 - Source candidate discovery

Caso:

- Edital relevante dentro do raio de 500 km aparece em portal fora da lista.

Expected result:

- Criar `source_candidate`.
- Guardar URL, municipio/UF, orgao, exemplo, tipo de acesso, risco ToS e prioridade de adapter.
- Nao descartar por nao ser PNCP/PCP/BLL/BNC/ComprasGov/SISLOG.

## Gate 7 - Score and confidence

Checks:

- `opportunity_score` e `confidence_score` separados.
- Componentes salvos em `analysis_runs.score_components`.
- Motivos salvos em `top_reasons`.
- Lacunas salvas em `missing_data`.
- Score alto + confianca baixa aparece como "promissora, mas incompleta".

Expected result:

- PASS somente se todo score for explicavel.

Resultado local:

- PASS estrutural: `outputs/sprint0-dry-run/analysis-runs.v0.json` gerou 7 analises com `opportunityScore`, `confidenceTotal`, componentes, lacunas e motivos.
- Alerta correto: conflito aparece como `revisao obrigatoria`; score promissor com baixa confianca aparece sem recomendacao forte.

## Gate 8 - Security and audit

Checks:

- Nenhum segredo em logs/fixtures.
- `audit_events` registra acao sensivel.
- Sem tabela de credencial real no Sprint 0.
- Automacao autenticada bloqueada.
- Dry-run disponivel para jobs futuros.

Expected result:

- FAIL se existir senha, token, certificado, cookie ou payload autenticado real.

## Gate 9 - UX readiness

Checks:

- Inbox operacional consegue mostrar fonte, score, confianca, prazo, orgao, municipio e acao recomendada.
- Detalhe separa fato, inferencia e lacuna.
- Preco aparece como faixa e amostra, nao numero unico.
- Concorrente aparece como sinal com nivel de evidencia.
- Timeline mostra prazo critico e risco de preclusao.

Expected result:

- PASS se a primeira experiencia responder: vale olhar agora, por que, qual risco, qual prazo e qual proximo movimento?

## Minimum pass criteria

Sprint 0 so deve virar build real quando:

- Gates 1-8 passarem em fixtures.
- Gate 0 nao for violado.
- Decisoes humanas C1/D1/D2/D5/D6 estiverem marcadas como pendentes ou confirmadas, nunca assumidas silenciosamente.

## Open critical decisions

Aguardar fundador/cliente:

- C1: empresas/CNPJs.
- D1/D6: raio fixo ou configuravel por contrato/tipo de obra.
- D2: fontes usadas com mais frequencia pela cliente.
- D5: usuarios/papeis.
- ToS e autorizacao para qualquer automacao autenticada.
