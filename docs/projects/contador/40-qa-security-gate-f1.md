# QA + Security Gate F1/F1.3

**Projeto:** Contador / Apuracao Defensavel
**Status:** CONCERNS - PASS tecnico/runtime descartavel G1-G3; XML real bloqueado
**Data:** 2026-06-18
**Agentes:** `@qa`, `@cyber-chief`, `@legal-chief`, `@data-engineer`
**Clones/consultas:** Bruce Schneier `aacb01fb-20b8-48d4-a44a-21136177edac`, `bff6b875-63f7-4da3-8786-84ce0744b85e`; Conclave G2/G3 `58cd5fdb-691f-4715-b7d9-5a276defff69`; Conclave G6 `bfd0b64a-8924-4723-8790-7b7b93b54127`; Gene Kim `d98d3136-1084-4fe3-b480-9aac9ee9fa62`; Patricia Peck `d2eeb203-c4df-4899-b8be-79fd8e5a0f7e`; Heleno Taveira Torres `e6ba0d81-1f02-4bc3-9db8-b6e38dd3978e`

---

## 1. Veredito

| Uso | Gate |
|---|---|
| Desenvolvimento local com fixtures | PASS |
| Demo sem dados reais | PASS com disclaimer |
| Persistencia de closeout em Postgres descartavel | PASS |
| XML real em ambiente controlado | FAIL ate security + LGPD v1 + golden-set real |
| Claim de prova juridica plena/ICP/PAdES | FAIL |
| Claim de acuracia fiscal real | FAIL ate golden-set real |

## 2. Evidencia tecnica atual

Comandos PASS em 2026-06-18:

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-fitness
```

Preflight de smoke criado em 2026-06-18:

```powershell
npm run smoke:preflight --workspace @synkra/contador-db
```

Resultado final: PASS em PostgreSQL 15.18 descartavel. O preflight confirmou `DATABASE_URL`, `PSQL_PATH`, arquivos e conexao nao-interativa.

CLI validada contra fixture Postgres:

```powershell
node packages/contador-trilha-verifier/dist/closeout-cli.js --input packages/contador-trilha-verifier/tests/postgres-chain.fixture.json --escritorio 11111111-1111-4111-8111-111111111111 --inicio 2026-06-15T00:00:00Z --fim 2026-06-16T00:00:00Z --tipo diario
```

`--format sql` tambem esta coberto por teste e gera chamada para `core_api_v1.registrar_closeout(...)`.

## 3. Smoke runtime

O servico local `postgresql-x64-15` exige senha para `postgres`, entao o smoke foi executado em cluster temporario `trust` sob `D:\AIOS\.tmp\contador-smoke-pg`, porta `55433`, removido ao final.

```powershell
$env:PSQL_PATH = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
$env:DATABASE_URL = "postgresql://postgres@127.0.0.1:55433/contador_smoke"
npm run smoke:psql --workspace @synkra/contador-db
```

Resultado 2026-06-18: PASS. Foram aplicadas migrations `001+002+003+004`; contratos SQL `001+002+003+004` passaram, incluindo: sem execute por `PUBLIC` em `core_api_v1`, sem INSERT direto em `closeout_lote`, `registrar_closeout` persistindo manifesto tecnico e rejeitando token quando `time_stamp_provider='none'`.

Contrato G2/G3 incluido no smoke:

```powershell
packages/contador-db/tests/sql/005_rls_export_runtime_contract.sql
```

Resultado 2026-06-18: PASS. O contrato usa `SET ROLE authenticated` e `request.jwt.claims` para provar que `core.evento_boa_fe` e `core.closeout_lote` retornam apenas linhas do tenant da claim e retornam zero linhas quando a claim de tenant esta ausente.

## 4. Itens must-fix antes de XML real

| ID | Area | Item | Status |
|---|---|---|---|
| G1 | DB | Smoke Postgres `001+002+003+004` em banco descartavel | PASS |
| G2 | Security | Validar RLS/grants runtime com tenant claim Supabase simulada | PASS |
| G3 | Security | Politica de export de `events.json` e manifestos: storage, acesso, retencao, criptografia | PASS tecnico; requer aprovacao juridica antes de dado real |
| G4 | LGPD | DPA operador/controlador e suboperadores | Artefato v1 pronto; requer revisao juridica/founder |
| G5 | LGPD | Matriz de retencao aprovada para XML, evento, manifesto e laudo | Artefato v1 pronto; requer revisao juridica/fiscal |
| G6 | Fiscal | Linguagem permitida: indicio/evidencia/trilha tecnica; proibido prova plena, credito garantido, apuracao correta | Artefato v1 pronto; usar `45-safe-fiscal-language-claims-v1.md` |
| G7 | QA | Smoke do `registrar_closeout` provando que INSERT direto falha e RPC passa | PASS |
| G8 | Golden-set | Lote real minimo iniciado ou sem claim de acuracia | Plano v1 pronto; execucao bloqueada por founder/rotulador/dados reais |
| G9 | QA | Export de eventos inclui `id`, hashes em hex e timestamp UTC canonico | PASS static |
| G10 | QA | `--format sql` recusa export sem `id` de evento | PASS local |
| G11 | DevOps | Diagnostico nao-interativo de smoke (`DATABASE_URL`, `PSQL_PATH`, arquivos, conexao) | PASS |

## 5. Proxima acao

Proximo corte: runbook de incidente/expurgo testavel. XML real e claims de acuracia continuam bloqueados ate revisao juridica/fiscal dos artefatos G4/G5/G6 + execucao real do G8.
