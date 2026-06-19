# CONTADOR-G2-G3: RLS Runtime e Politica de Export

## Status: Done

## Description

Validar em Postgres descartavel que os dados de trilha e closeout respeitam isolamento por tenant com claim Supabase simulada, e documentar a politica operacional minima para exportacao, armazenamento, retencao e descarte de `events.json`/manifestos antes de qualquer XML real.

## Acceptance Criteria

- [x] AC1: Smoke SQL prova que `authenticated` enxerga apenas `core.evento_boa_fe` do tenant da claim.
- [x] AC2: Smoke SQL prova que `authenticated` enxerga apenas `core.closeout_lote` do tenant da claim.
- [x] AC3: Smoke SQL prova que claim ausente nao retorna eventos/closeouts.
- [x] AC4: `core.closeout_lote` tem `GRANT SELECT` para `authenticated`, sem liberar INSERT/UPDATE/DELETE direto.
- [x] AC5: Politica de export/retencao documenta classificacao, acesso, storage, retencao, descarte, proibicoes de envio externo e incidente.
- [x] AC6: `smoke:psql` inclui contrato G2/G3 no fluxo descartavel.
- [x] AC7: Docs de gate F1 refletem G2/G3 PASS/pendencias reais.

## Technical Notes

- Sem XML real, sem nova UI, sem provider externo e sem envio a terceiros.
- Usar `SET ROLE authenticated` e `request.jwt.claims` para simular Supabase runtime.
- Preferir contrato SQL local e docs operacionais antes de criar nova API.
- Manter `PUBLIC`, `anon` e `motor` sem acesso indevido a RPCs/closeout.

## File List

- `docs/stories/CONTADOR-G2-G3-rls-export-policy.md` - story desta entrega.
- `packages/contador-db/tests/sql/005_rls_export_runtime_contract.sql` - contrato runtime de isolamento RLS/export.
- `packages/contador-db/migrations/004_closeout_lote.sql` - grant de SELECT para `authenticated` via RLS.
- `packages/contador-db/scripts/smoke-psql.mjs` - inclui contrato 005 no smoke.
- `packages/contador-db/scripts/validate-sql.mjs` - valida presenca dos gates 005.
- `docs/projects/contador/41-export-retention-policy-f1.md` - politica G3 de export/retencao.
- `docs/projects/contador/34-yolo-execution-board.md` - board atualizado.
- `docs/projects/contador/36-lgpd-operational-pack-f1.md` - referencia a politica G3.
- `docs/projects/contador/39-threat-model-f1.md` - threat model atualizado.
- `docs/projects/contador/40-qa-security-gate-f1.md` - gate G2/G3 atualizado.

## Dependencies

- `CONTADOR-F1.3-CLOSEOUT`
- Conclave `58cd5fdb-691f-4715-b7d9-5a276defff69`

## Definition of Done

- [x] All AC checked.
- [x] Static SQL validation passing.
- [x] Postgres disposable smoke passing.
- [x] Documentation updated.
- [x] No push/deploy performed.

## Evidence

- Static: `npm test --workspace @synkra/contador-db` PASS em 2026-06-18.
- Runtime: `smoke:preflight` + `smoke:psql` PASS em PostgreSQL 15.18 descartavel na porta `55433`; cluster removido ao final.
- Consultas: conclave `58cd5fdb-691f-4715-b7d9-5a276defff69`; Gene Kim `d98d3136-1084-4fe3-b480-9aac9ee9fa62`.
