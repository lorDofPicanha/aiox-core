# Story F1.3 - Closeout CLI e Manifesto de Trilha

**Project:** Contador / Apuracao Defensavel
**Story ID:** CONTADOR-F1.3-CLOSEOUT
**Status:** Implemented - local/static/unit/Postgres smoke passing
**Created:** 2026-06-18
**Orchestrator:** `@aios-master`
**Agents:** `@architect`, `@data-engineer`, `@qa`, `@cyber-chief`, `@legal-chief`
**Mind clones:** Roberto Dias Duarte, Anderson Hernandes, Erik Nymanczuk
**Conclave ID:** `7c877c2c-3479-4e74-a623-e98df75347ac`
**Consultas adicionais:** Bruce Schneier `aacb01fb-20b8-48d4-a44a-21136177edac`, `bff6b875-63f7-4da3-8786-84ce0744b85e`; Patricia Peck `d2eeb203-c4df-4899-b8be-79fd8e5a0f7e`; Heleno Taveira Torres `e6ba0d81-1f02-4bc3-9db8-b6e38dd3978e`

---

## Goal

Transformar a trilha `core.evento_boa_fe` em um fecho tecnico operacional: export verificavel, manifesto versionado e contrato DB para registrar lotes de closeout por tenant e janela, ainda sem carimbo ICP-Brasil/PAdES.

## User Story

**As a** time tecnico do Contador,
**I want** gerar e validar manifestos de fecho diario/mensal da trilha de boa-fe,
**so that** a foundation F1/F1.1/F1.2 tenha uma rotina operacional de integridade antes de processar XML real, emitir laudo assinado ou prometer prova juridica plena.

## Scope

**IN:**

- Migration `004_closeout_lote.sql` com tabela `core.closeout_lote`.
- Rollback correspondente.
- Contrato SQL/static para garantir campos obrigatorios e bloqueios de promessa ICP.
- Manifesto JSON deterministico a partir de eventos exportados.
- CLI/script local para gerar manifesto a partir de `events.json`.
- Teste de manifesto valido e tamper detection reaproveitando `contador-trilha-verifier`.
- Documentacao de uso local-first.

**OUT:**

- Carimbo ICP-Brasil/ACT real.
- PAdES ou assinatura digital.
- XML real.
- Captura/provider.
- RAG/LLM.
- UI.
- e-CAC.
- Claim de acuracia fiscal ou prova juridica plena.

## Acceptance Criteria

- [x] **AC-1 DB Contract:** `core.closeout_lote` existe com tenant, janela, contagem, hashes extremos, manifesto, hash do manifesto e provider de carimbo. Escrita publicada via `core_api_v1.registrar_closeout`; INSERT direto segue revogado. _(static gate PASS; Postgres smoke PASS em banco descartavel)_
- [x] **AC-2 No False Promise:** F1.3 permite `time_stamp_provider='none'`; campos de token externo ficam nulos ate integracao real.
- [x] **AC-3 Imutabilidade:** closeout aprovado nao pode ser alterado/deletado por roles de app.
- [x] **AC-4 Manifest CLI:** gerador cria manifesto JSON a partir de export de eventos.
- [x] **AC-5 Chain Verification:** manifesto so sai `pass` quando `verificarCadeia` passar.
- [x] **AC-6 Tamper Detection:** teste altera evento e confirma falha.
- [x] **AC-7 Versioning:** manifesto inclui `manifest_schema_version`, `verifier_version` e `hash_ver`.
- [x] **AC-8 No Scope Creep:** nenhum codigo de UI, XML real, captura, RAG, e-CAC, ICP/PAdES e criado.
- [x] **AC-9 Gates:** `contador-db`, `contador-trilha-verifier` e fitness local passam.
- [x] **AC-10 Persistable Export Guard:** `--format sql` exige `id` de evento; export sem `id` e recusado para persistencia.

## Tasks

- [x] **T1 @architect:** fechar escopo F1.3 e fronteiras contra `35-time-stamp-closeout-runbook.md`.
- [x] **T2 @data-engineer:** criar migration/rollback/contrato SQL do `closeout_lote`.
- [x] **T3 @dev:** implementar manifest builder no verifier.
- [x] **T4 @qa:** cobrir manifesto valido, adulterado e hash deterministico.
- [x] **T5 @cyber-chief:** abrir threat model F1 como proxima story/gate, sem bloquear F1.3 local.
- [x] **T6 @legal-chief:** manter linguagem `time_stamp_provider=none`; sem claim ICP/PAdES.
- [x] **T7 @aios-master:** atualizar board e runbook.

## Gate

F1.3 libera apenas **fecho tecnico local**. Uso com dados reais segue bloqueado ate LGPD v1, threat model F1 e sign-off fiscal/juridico.

## Files

- `packages/contador-db/migrations/004_closeout_lote.sql`
- `packages/contador-db/rollbacks/004_closeout_lote.rollback.sql`
- `packages/contador-db/tests/sql/004_closeout_lote_contract.sql`
- `packages/contador-db/scripts/validate-sql.mjs`
- `packages/contador-db/scripts/preflight-smoke.mjs`
- `packages/contador-db/scripts/smoke-psql.mjs`
- `packages/contador-db/queries/export-closeout-events.sql`
- `packages/contador-trilha-verifier/src/index.ts`
- `packages/contador-trilha-verifier/src/closeout-cli.ts`
- `packages/contador-trilha-verifier/scripts/run-verifier-tests.mjs`
- `packages/contador-trilha-verifier/package.json`
- `docs/projects/contador/38-story-f1-3-closeout.md`

## Gates

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-fitness
npm run smoke:preflight --workspace @synkra/contador-db
npm run smoke:psql --workspace @synkra/contador-db
```

Resultado 2026-06-18: PASS local para testes sem banco e PASS runtime em PostgreSQL 15.18 descartavel. `smoke:preflight` confirmou `DATABASE_URL`, `PSQL_PATH`, arquivos e conexao nao-interativa; `smoke:psql` aplicou migrations `001+002+003+004` e executou contratos `001+002+003+004`. O cluster temporario foi removido ao final.

## Uso local

Gerar manifesto JSON:

```powershell
node packages/contador-trilha-verifier/dist/closeout-cli.js --input events.json --escritorio <uuid> --inicio 2026-06-15T00:00:00Z --fim 2026-06-16T00:00:00Z --tipo diario
```

Gerar SQL para persistir via RPC publicada:

```powershell
node packages/contador-trilha-verifier/dist/closeout-cli.js --input events.json --escritorio <uuid> --inicio 2026-06-15T00:00:00Z --fim 2026-06-16T00:00:00Z --tipo diario --format sql
```

O SQL chama `core_api_v1.registrar_closeout(...)`. Ele exige tenant claim no Postgres/Supabase e nao deve ser usado com XML real antes de LGPD/security PASS.

O `--format sql` exige que o export de eventos inclua `id`; use `packages/contador-db/queries/export-closeout-events.sql`. Exports sem `id` continuam validos para verificar cadeia em JSON, mas sao recusados para gerar SQL persistivel.

O contrato `004_closeout_lote_contract.sql` tambem chama `core_api_v1.registrar_closeout(...)` e valida rejeicao de token quando `time_stamp_provider='none'`. Essa parte passou no `smoke:psql` em banco descartavel em 2026-06-18.
