# Contador DB

F1-D0 database foundation for Projeto Contador.

This package owns:

- `migrations/001_foundation.sql`
- `rollbacks/001_foundation.rollback.sql`
- SQL contract tests for the foundation
- static validation for preflight decisions

Scope is database contract only. No UI, capture provider, RAG runtime, Gestorize integration, or billing jobs live here.

## Commands

```powershell
npm test --workspace @synkra/contador-db
```

Optional Postgres smoke, when `DATABASE_URL` points to a disposable Postgres 15+ database:

```powershell
npm run smoke:preflight --workspace @synkra/contador-db
npm run smoke:psql --workspace @synkra/contador-db
```

On Windows, if `psql.exe` is installed but not on `PATH`, set `PSQL_PATH`:

```powershell
$env:PSQL_PATH = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
npm run smoke:psql --workspace @synkra/contador-db
```

## Closeout export

F1.3 closeout manifests require event identity (`id`) as well as tenant sequence and hashes. Use the export query instead of hand-built JSON:

```powershell
& $env:PSQL_PATH $env:DATABASE_URL `
  -v escritorio_id="'11111111-1111-4111-8111-111111111111'" `
  -v periodo_inicio="'2026-06-15T00:00:00Z'" `
  -v periodo_fim="'2026-06-16T00:00:00Z'" `
  -f packages/contador-db/queries/export-closeout-events.sql
```
