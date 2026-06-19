# Story F1 Foundation - Checkpoint Versionavel

> Fonte local: `docs/stories/active/STORY-CONTADOR-F1-FOUNDATION.md`.
> Motivo deste espelho: `.gitignore` ignora `docs/stories/`, entao esta copia preserva a story dentro dos docs versionaveis do projeto Contador.
> Status: Implemented - squad review fixes applied, local gates passing, Postgres 15.18 smoke passing.

## Decisoes de Preflight

- P10: `core.nota` particionada no D0; `core.nota_item` nao particionada fisicamente no D0, mas carrega `competencia` para FK composta.
- Migration: `packages/contador-db/migrations/001_foundation.sql`.
- RPC API: schema `core_api_v1`.
- Pacotes: `packages/contador-db`, `packages/contador-motor-fiscal`, `packages/contador-trilha-verifier`, `packages/contador-fitness`.
- Metodo: SOLID como gate de construcao, sem abstracao prematura.

## Acceptance Criteria

- [x] AC-1 Migration aplica limpa em Postgres 15+ vazio.
- [x] AC-2 Rollback existe.
- [x] AC-3 Patches de schema D0 implementados/contratados.
- [x] AC-4 RPCs de escrita vivem em `core_api_v1`; motor executa somente `registrar_analise`.
- [x] AC-5 SQL/static tests cobrem constraints-chave, RLS/grants, hash-chain, imutabilidade, `PUBLIC` revoke e boundary motor/humano.
- [x] AC-6 Motor TS puro sem banco/rede/filesystem.
- [x] AC-7 Golden-set sintetico roda e declara que nao mede acuracia real.
- [x] AC-8 Verifier CLI detecta adulteracao e guarda `hash_ver`.
- [x] AC-9 FF-1 import boundary.
- [x] AC-10 FF-2 schema boundary.
- [x] AC-11 FF-3 RLS coverage seed.
- [x] AC-12 FF-6 ledger immutability.
- [x] AC-13 SOLID gate aplicado.
- [x] AC-14 Sem UI, captura, RAG, Gestorize ou add-on.

## Gates Rodados

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

Resultado: todos passaram localmente em 2026-06-15.

Rodada pos-squad review tambem passou em 2026-06-15 apos correcoes de grants/RPC/hash:

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

Rodada de fechamento em Postgres 15.18 descartavel passou em 2026-06-16:

```powershell
npm run smoke:psql --workspace @synkra/contador-db
```

Rollback real tambem passou em 2026-06-16: migration aplicada em banco limpo, rollback executado, contagem final dos schemas `core`, `core_api_v1`, `ref`, `gestao`, `ingestao`, `billing`, `ecac`, `app` = `0`.

Rollback incremental F1.2 tambem passou em 2026-06-16: `001_foundation.sql` + `002_decision_evidence.sql` + `003_secure_decision_rpc.sql` + `003_secure_decision_rpc.rollback.sql` + `002_decision_evidence_contract.sql` em Postgres 15.18 descartavel. O catalogo final manteve apenas `aprovar_apontamento`, `rejeitar_apontamento` e `superar_apontamento` com comentarios F1.1; helpers F1.2 removidos.

Fixture de hash-chain produzida pelo trigger real do Postgres foi adicionada ao verifier; `npm test --workspace @synkra/contador-trilha-verifier` valida equivalencia TS x Postgres.

Rodada final pos-rollback granular tambem passou em 2026-06-16:

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

## File List

- `packages/contador-db/package.json`
- `packages/contador-db/README.md`
- `packages/contador-db/migrations/001_foundation.sql`
- `packages/contador-db/migrations/002_decision_evidence.sql`
- `packages/contador-db/migrations/003_secure_decision_rpc.sql`
- `packages/contador-db/rollbacks/001_foundation.rollback.sql`
- `packages/contador-db/rollbacks/003_secure_decision_rpc.rollback.sql`
- `packages/contador-db/tests/sql/001_foundation_contract.sql`
- `packages/contador-db/tests/sql/002_decision_evidence_contract.sql`
- `packages/contador-db/tests/sql/003_secure_decision_rpc_contract.sql`
- `packages/contador-db/scripts/validate-sql.mjs`
- `packages/contador-db/scripts/smoke-psql.mjs`
- `packages/contador-motor-fiscal/package.json`
- `packages/contador-motor-fiscal/tsconfig.json`
- `packages/contador-motor-fiscal/README.md`
- `packages/contador-motor-fiscal/src/index.ts`
- `packages/contador-motor-fiscal/src/cli.ts`
- `packages/contador-motor-fiscal/tests/golden-set.synthetic.json`
- `packages/contador-motor-fiscal/scripts/run-golden-set.mjs`
- `packages/contador-motor-fiscal/scripts/run-cli-test.mjs`
- `packages/contador-motor-fiscal/tests/cli-payload.synthetic.json`
- `packages/contador-trilha-verifier/package.json`
- `packages/contador-trilha-verifier/tsconfig.json`
- `packages/contador-trilha-verifier/README.md`
- `packages/contador-trilha-verifier/src/index.ts`
- `packages/contador-trilha-verifier/src/cli.ts`
- `packages/contador-trilha-verifier/scripts/run-verifier-tests.mjs`
- `packages/contador-trilha-verifier/tests/postgres-chain.fixture.json`
- `packages/contador-trilha-verifier/tests/postgres-chain-microseconds.fixture.json`
- `packages/contador-fitness/package.json`
- `packages/contador-fitness/README.md`
- `packages/contador-fitness/scripts/ff1-import-boundary.mjs`
- `packages/contador-fitness/scripts/ff-summary.mjs`

## Pendencias

- QA revisar o pacote final com smoke Postgres real, grants/RLS e contrato `core_api_v1`.
- Legal/fiscal clones revisarem a semantica final de decisao individualizada antes de uso produtivo.
- Patricia revisar `31-data-map-lgpd-f1.md` antes de XML real.
- Founder/Renan recrutar tributarista rotulador conforme `32-tributarista-labeling-brief.md`.
- Revisao juridica/LGPD dos docs `35-time-stamp-closeout-runbook.md`, `36-lgpd-operational-pack-f1.md` e `37-concierge-demo-kit-f1.md`.
- Criar threat model F1 antes de XML real.
