# QA Final - F1 Foundation

> Data: 2026-06-16
> Escopo: `CONTADOR-F1-FOUNDATION` + F1.1/F1.2 decision evidence/security - schema, RPCs, motor puro, verificador de trilha, fitness functions, payload probatorio de decisao humana e binding de caller autenticado.
> Revisor: `@qa` aplicado por Orion/Codex em modo evidencial.
> Decisao: **PASS TECNICO**.
> Observacao: CodeRabbit nao rodou porque WSL nao esta instalado nesta maquina.

---

## 1. Evidencias executadas

```powershell
npm run smoke:psql --workspace @synkra/contador-db
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

Resultado: **PASS**.

Ambiente adicional: Postgres 15.18 descartavel em `localhost:55432`.

O smoke atual aplica:

1. `migrations/001_foundation.sql`
2. `migrations/002_decision_evidence.sql`
3. `migrations/003_secure_decision_rpc.sql`
4. `tests/sql/001_foundation_contract.sql`
5. `tests/sql/002_decision_evidence_contract.sql`
6. `tests/sql/003_secure_decision_rpc_contract.sql`

Rollback real: migration aplicada em banco limpo, rollback executado e contagem final dos schemas da foundation = `0`.

Rollback incremental F1.2: `001_foundation.sql` + `002_decision_evidence.sql` + `003_secure_decision_rpc.sql` + `003_secure_decision_rpc.rollback.sql` + `002_decision_evidence_contract.sql` passaram em Postgres 15.18 descartavel. Checagem de catalogo confirmou remocao dos helpers F1.2 e retorno dos comentarios F1.1 nas RPCs humanas.

## 2. Trace dos acceptance criteria

| AC | Status | Evidencia |
|---|---|---|
| AC-1 Migration aplica limpa em Postgres 15+ vazio | PASS | `smoke:psql` em Postgres 15.18 |
| AC-2 Rollback existe e funciona | PASS | rollback real + schema count `0` |
| AC-3 Patches D0 implementados/contratados | PASS | `contador-db` static validation |
| AC-4 RPCs em `core_api_v1`; motor so materializa via `registrar_analise` | PASS | grants/RPC checks + static validation |
| AC-5 SQL/static tests cobrem constraints-chave/RLS/grants/hash/imutabilidade | PASS | `contador-db` + `contador-fitness` |
| AC-6 Motor TS puro sem banco/rede/filesystem | PASS | varredura de imports; sem Supabase/Postgres/fetch |
| AC-7 Golden-set sintetico sinalizado como nao-acuracia real | PASS | `run-golden-set.mjs` |
| AC-8 Verifier CLI detecta adulteracao e guarda `hash_ver` | PASS | `contador-trilha-verifier` |
| AC-9 FF-1 import boundary | PASS | `contador-fitness` |
| AC-10 FF-2 schema boundary | PASS | `contador-fitness` |
| AC-11 FF-3 RLS coverage seed | PASS | `contador-fitness` |
| AC-12 FF-6 ledger immutability | PASS | `contador-fitness` |
| AC-13 SOLID gate aplicado | PASS | pacotes isolados por responsabilidade |
| AC-14 Sem UI/captura/RAG/Gestorize/add-on | PASS | escopo de arquivos limitado a packages/docs |

## 3. Achados QA

### Corrigidos nesta rodada

1. **Smoke falso-positivo no Windows.**
   `smoke-psql.mjs` passava o `DATABASE_URL` antes de `-v`/`-f`; o `psql` ignorava os arquivos SQL e retornava `0`. Corrigido para `psql -v ON_ERROR_STOP=1 -f file DATABASE_URL` e validado em banco novo.

2. **Verifier nao provava equivalencia com Postgres.**
   A canonicalizacao TS ordenava chaves JSON alfabeticamente, enquanto o trigger usa `jsonb::text`. Adicionada fixture gerada pelo trigger real e ajustada a ordenacao do verifier.

3. **`digest()` quebrava dentro de RPC `SECURITY DEFINER`.**
   O trigger do ledger chamava `digest()` sem schema. Dentro de RPCs com `search_path` restrito, `pgcrypto` em `public` nao era encontrado. Corrigido para `public.digest(...)` e validado por teste runtime.

4. **Payload de decisao humana fraco para uso produtivo.**
   A migration `002_decision_evidence.sql` agora grava `revisor_snapshot` e `evidencia_ref` em eventos humanos. O contrato SQL cria dados minimos, chama `aprovar_apontamento` e valida CRC/base/analise/nota no payload real.

5. **RPC humana permitia impersonacao por parametro `p_revisor_id`.**
   A migration `003_secure_decision_rpc.sql` exige tenant claim, `sub` do caller igual ao `p_revisor_id` e papel `contador` no JWT. O contrato SQL valida que chamada sem claim falha e que contador A nao aprova como contador B.

6. **`evidencia_ref` era referencia, nao snapshot material.**
   F1.2 adicionou `fiscal_snapshot` e `evidencia_hash` calculado sobre campos fiscais materiais de nota/item/apontamento.

7. **Verifier perdia microsegundos.**
   O verifier agora preserva timestamps Postgres com seis digitos de microssegundos e valida fixture gerada pelo Postgres real com `0.123456`/`0.654321`.

### Residual / nao bloqueante

1. **CodeRabbit nao executado.**
   WSL nao esta instalado. Mitigacao: revisao manual focada em seguranca/DB/fronteiras e gates locais completos.

2. **`dist/` gerado localmente.**
   `dist/` esta ignorado no `.gitignore`. Nao incluir como artefato versionavel; os pacotes devem ser buildados por `npm test`/CI.

3. **PostgreSQL installer deixou processos `postgres` externos ao cluster descartavel.**
   O cluster do smoke foi parado com `pg_ctl`. Os processos remanescentes pertencem a instalacao do PostgreSQL 15 e nao foram encerrados por QA.

4. **Rollback incremental da 003 criado apos QA.**
   `003_secure_decision_rpc.rollback.sql` restaura o contrato F1.1 e remove helpers F1.2. Gate estatico cobre existencia/remocao dos helpers; runtime 001+002+003+rollback003+contrato 002 passou em Postgres 15.18 descartavel.

## 4. Riscos restantes

| Risco | Severidade | Status |
|---|---:|---|
| Sem sign-off fiscal/juridico sobre decisao individualizada, payload de evidencia e linguagem de promessa | Alta antes de producao | Bloqueia producao, nao bloqueia PASS tecnico |
| Golden-set real ainda nao rotulado por tributarista externo | Alta para acuracia real | Bloqueia claim de acuracia/producao |
| Carimbo de tempo ICP-Brasil ainda nao integrado | Media/Alta para prova pericial completa | Fora da F1, obrigatorio antes de cliente pago |
| Data map LGPD ainda nao revisado por especialista | Alta para dados reais | Bloqueia XML real em piloto pago |

## 5. Gate

**PASS TECNICO para F1 Foundation.**

A F1/F1.1/F1.2 esta apta a virar checkpoint tecnico interno: migrations 001+002+003, contratos SQL, gates locais, smoke Postgres real e verifier contra fixtures Postgres reais passam. Producao continua bloqueada por gate fiscal/juridico, LGPD, golden-set real e fecho/carimbo.
