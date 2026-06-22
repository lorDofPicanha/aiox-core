---
name: project-contador-verifier-slicing
description: Contador trilha-verifier exige cadeia hash contígua desde o genesis — não tolera subconjuntos fatiados (per-cliente)
metadata:
  type: project
---

`@synkra/contador-trilha-verifier` `verificarCadeia()` impõe `seq_tenant === index+1` desde o genesis (`hash_anterior` encadeado a partir de "00"). Por design ele só valida a **cadeia inteira** do tenant.

**Why:** a integridade hash-chain é por-tenant, append-only e contígua. Qualquer projeção que filtre eventos (ex.: só os de um cliente) produz seqs não-contíguos (ex.: `[1,2,3,8,9]`) → falhas `SEQ_GAP` + `PREVIOUS_HASH_MISMATCH` mesmo numa cadeia perfeitamente válida.

**How to apply:** ao auditar/usar o verificador em telas que mostram um SUBCONJUNTO (laudo por cliente, etc.), verifique a cadeia COMPLETA (ok/headHash do tenant) e mostre só a fatia como visualização — nunca rode `verificarCadeia` sobre a fatia. Bug confirmado na Fase 1 em `apps/contador/app/laudos/[clienteId]/page.tsx` e `app/laudos/actions.ts` (verificarCadeiaCliente). A home e `/trilha` verificam a cadeia inteira e estão corretas.
