# Squad Review F1 Foundation

> Data: 2026-06-15
> Escopo: revisao pos-build local da Fundacao F1 do Projeto Contador.
> Status: PASS TECNICO - correcoes criticas aplicadas; smoke Postgres 15.18 e rollback real passando. Sign-off fiscal/juridico segue pendente antes de producao.

---

## 1. Squad de revisao

| Area | Revisor | Resultado inicial |
|---|---|---|
| DB/RPC/RLS | `@data-engineer` | FAIL |
| Arquitetura/SOLID | `@architect` | CONCERNS |
| QA/Gates | `@qa` | CONCERNS / NEEDS_WORK |
| Juridico-fiscal | `@legal-chief` | FAIL para producao; CONCERNS para foundation interna |

---

## 2. Achados criticos recebidos

| Severidade | Achado | Status |
|---|---|---|
| Critical | `SECURITY DEFINER` exposto demais, sem revoke de `PUBLIC` e sem tenant/reviewer checks | Corrigido |
| Critical | `motor` podia executar RPCs humanas (`aprovar`, `rejeitar`, `superar`) | Corrigido |
| Critical | `registrar_analise` usava `ON CONFLICT DO UPDATE` em tabela append-only | Corrigido |
| High | `base_versao_id` nullable quebrava idempotencia por unique em Postgres | Corrigido |
| High | RLS habilitado sem grants/policy suficiente para leitura esperada | Corrigido parcialmente; validar em Postgres |
| High | Postgres smoke ausente | Corrigido; smoke real passou em Postgres 15.18 |
| Medium | Smoke script Windows usava `$DATABASE_URL` estilo POSIX | Corrigido |
| Medium | Verifier TS nao provava equivalencia com hash gerado por Postgres | Corrigido; fixture Postgres adicionada e validada |
| Medium | Motor sem CLI JSON estavel | Corrigido |

---

## 3. Correcoes aplicadas

### DB/RPC

- `core_api_v1` agora revoga execute de `PUBLIC`.
- `motor` recebe execute somente em `core_api_v1.registrar_analise(...)`.
- RPCs humanas ficam para `authenticated`.
- `aprovar_apontamento`, `rejeitar_apontamento` e `superar_apontamento` validam:
  - apontamento no estado correto;
  - tenant;
  - revisor do mesmo escritorio;
  - `papel='contador'`;
  - `crc_situacao='ativo'`;
  - `crc is not null`.
- `registrar_analise` deixou de usar `DO UPDATE` em objetos append-only.
- `base_versao_id` passou a `NOT NULL` em `analise_execucao` e `apontamento_auditoria`.
- Adicionado `tg_apont_exige_evento` como constraint trigger P20.
- Smoke script virou `scripts/smoke-psql.mjs`, compatível com Windows/PowerShell.

### Motor

- Adicionado CLI `contador-motor-classificar`.
- Adicionado teste de contrato JSON do CLI.

### Verifier

- Payload canonicalizado mais proximo de `jsonb::text` do Postgres.
- Timestamp normalizado com seis digitos de microssegundos.
- Golden hash atualizado para a nova formula.

### Fitness/tests

- Testes estaticos agora cobrem:
  - revoke de `PUBLIC`;
  - motor sem RPC humana;
  - validacao de CRC;
  - constraint trigger P20;
  - `base_versao_id NOT NULL`.

---

## 4. Gates rodados apos correcoes

```powershell
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

Resultado: PASS nos quatro workspaces.

---

## 5. Pendencias restantes

1. Rodar revisao final `@qa` sobre os artefatos modificados nesta rodada.
2. Antes de producao, obter sign-off fiscal/juridico sobre:
   - semantica de decisao individualizada;
   - payload de evidencia;
   - linguagem de confianca/acuracia;
   - papel do contador CRC.

## 5-bis. Fechamento tecnico 2026-06-16

Ambiente: Postgres 15.18 descartavel em `localhost:55432`.

```powershell
npm run smoke:psql --workspace @synkra/contador-db
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

Resultado: PASS.

Rollback real: migration aplicada em banco limpo, rollback executado e contagem final dos schemas da foundation = `0`.

Achado adicional corrigido: `smoke-psql.mjs` passava o `DATABASE_URL` antes das opcoes do `psql`, fazendo `-v`/`-f` serem ignorados no Windows. Script corrigido e validado em banco novo.

Achado adicional corrigido: verifier TS ordenava chaves JSON alfabeticamente, mas o trigger usa `jsonb::text` do Postgres. Adicionada fixture produzida pelo Postgres real e ajustada a canonicalizacao do verifier.

Achado adicional corrigido em F1.1: `digest()` sem schema quebrava dentro de RPC `SECURITY DEFINER` com `search_path` restrito. Corrigido para `public.digest(...)`.

F1.1 adicionada: `002_decision_evidence.sql` reforca eventos humanos com `revisor_snapshot` e `evidencia_ref`. O contrato `002_decision_evidence_contract.sql` cria dados minimos, chama `aprovar_apontamento` e valida o payload real.

F1.2 adicionada apos revisao `@data-engineer`/`@qa`: `003_secure_decision_rpc.sql` exige tenant claim, `sub = p_revisor_id`, papel `contador`, `fiscal_snapshot` e `evidencia_hash`. O verifier agora valida fixture Postgres com microsegundos.

---

## 6. Gate atual

**PASS TECNICO.**

A foundation F1/F1.1/F1.2 passa nos gates locais, no smoke real de Postgres 15.18, no rollback real da foundation e na equivalencia do verifier contra hash-chain produzida pelo trigger real, inclusive com microsegundos.

Ainda nao e liberacao de producao: o gate fiscal/juridico sobre decisao individualizada, payload de evidencia e linguagem de confianca continua obrigatorio.
