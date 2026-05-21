---
name: Sales AI Deploy 05/Mai
description: User confirmou deploy Sales AI em 05/Mai/2026. Desbloqueia Fase 2 ECL Bretda Google Ads. Possível Cenário A (Sales AI ready, só falta sender ECL = 2-3d) em vez de Cenário C/D (10-15d).
type: project
originSessionId: b1b9eedd-94a7-4cf1-9524-fa8a5009067b
---
# Sales AI Deploy — 05/Mai/2026

User: "o sales ia acabei de fazer o deploy" (05/Mai ~14h30 BRT, durante execução Fase 0+1+2+3 Bretda Google Ads Reactivation).

## Contexto

Deploy mais provável (per memória `session_tocks_d_plus_plus_04_05mai.md`):
- **Tocks Sales AI D++ Railway** — bloqueador era `targetPort=None`, user fix manual em dashboard. Após `port setado` → redeploy → migration 006 + Tray webhooks + storefront pixel + PR #645 merge.

Mas pode ser:
- **Bretda Sales AI** dedicado, separado do Tocks
- **Multi-tenant Sales AI** servindo ambos

**A audit Fase 2 ECL Bretda em curso (agentId `ac10101ed2bc1d15e`) deve descobrir capacidade real.**

## Implicação para runbook Bretda Google Ads Reactivation

**Fase 2 — ECL Sales AI → Google Ads** — estimate inicial:
- Cenário A "Sales AI já tem tudo, só falta sender ECL": 2-3d ✅ AGORA MAIS PROVÁVEL
- Cenário B "Sales AI tem leads table, falta integrações": 5-7d
- Cenário C "Sales AI minimal, precisa CRM lite + ECL": 10-15d
- Cenário D "Não há Sales AI Bretda": 15-20d

**Antes do deploy:** estimate provável Cenário C/D (10-15d).
**Depois do deploy:** estimate provável Cenário A (2-3d).

## Implicação para timeline Bretda Google Ads launch

**Antes:** Janela primeiro R$ Google ativo D+11 a D+12 (~17/Mai).
**Depois (se Cenário A confirmado):** Janela poderia acelerar 5-7 dias → ~12-13/Mai.

Mas ainda dependente de:
- Reauth user (5min, hoje)
- GCP Production submit (24-72h Google fila)
- PIX Meta Bretda (saldo crítico)
- Conv actions cleanup (Fase 1.2)
- URL audit (Fase 1.1)

## Action Items pós-deploy

1. **Audit Fase 2 ECL** (já em curso) deve confirmar:
   - Sales AI Bretda existe? Onde?
   - Endpoints outbound Google Ads API existem?
   - Schema tem `gclid`, `email_hashed`, `value_real`?
2. **Story criada** se necessário — implementação ECL sender + Adjustments
3. **Atualizar runbook** com timeline acelerada se confirmado Cenário A

## Trigger retomada

Quando audit Fase 2 retornar:
- Cenário A → `executa story ecl bretda` (2-3d implementation)
- Cenário B/C/D → manter timeline original 10-15d

## Caveat

Sales AI Tocks D++ token está NO chat history (per memória `session_tocks_d_plus_plus_04_05mai.md`) — rotação em 30d. Se Bretda usa mesmo token, mesma rotação.

Smart Bidding reset window pós-GTM-fix Tocks → não julgar performance Tocks antes de 21/Mai.
