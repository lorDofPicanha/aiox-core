---
name: reminder-google-oc-api-eol-15jun
description: RESOLVED 16/Mai. Bretda Google OC pipeline LIVE via Google Ads API v20 uploadClickConversions. Smoke 7/7 PASS. 15/Jun EOL desbloqueado.
metadata:
  node_type: memory
  type: project
  priority: RESOLVED
  resolved_at: 2026-05-16
  deadline: 2026-06-15
  discovered: 2026-05-15
  source: hydra-study-15mai-hydra E16
  originSessionId: 15f7ca39-36a4-4e78-950c-75e0a8836181
---

# Google OC API Sunset — 15/Jun/2026

🟢 **RESOLVED 16/Mai/2026** — 30 dias antes do EOL.

## Solução entregue

Server-side Google Ads Offline Conversion pipeline implementado em **bretda-lp monolith**, espelhando o padrão Meta CAPI Caminho B+C (LIVE 04/Mai). Endpoints LIVE em `https://www.bretda.com.br/api/google-conversion`:

- `GET /api/google-conversion` — health check (8/8 env_presence true)
- `POST /api/google-conversion/lead` — captura form submit + gclid no Upstash Redis (CORS + rate-limit + idempotency por gclid)
- `POST /api/google-conversion/close-sale` — upload OC quando Breno marca venda fechada (auth HMAC X-Bretda-OC-Secret + timing-safe compare)

Stack: Google Ads API v20 `customers/{cid}:uploadClickConversions` (NÃO o endpoint legacy que está sendo deprecated). Conv action target `customers/8167636084/conversionActions/7612768697` ("Bretda Sale Closed (Offline OC)" UPLOAD_CLICKS R$1500 PRIMARY).

## Smoke tests 7/7 PASS (16/Mai 13h16 BRT)

S1 health → S2 capture (`lead_id=mp8jtkrpxae4zhpzia`) → S2.5 idempotency (deduped) → S3 close-sale (`uploaded:true, value:R$1500`) → S4 CORS deny → S5 missing auth → S5b wrong secret.

## Why resolveu antes do prazo

User priorizou hoje em vez de aceitar "PR CODE READY desde Abril" da memória anterior. **Descoberta crítica:** essa memória estava errada — não existia PR pra Bretda Google CAPI. Era confusão com PR #645 (Tocks Meta CAPI, fechado 07/Mai sem merge). Bretda Google nunca tinha sido codado. Build feito do zero em ~1h reusando padrão de tocks-sales-ai/src/integrations/google-ads-* (Sales AI deprecated 15/Mai mas código local sobrevive como source pattern).

## How to apply (se algo quebrar pós-prazo)

**Symptom:** `/close-sale` retorna `{"uploaded":false,"reason":"oauth_failed"}`.

**Cause:** OAuth refresh_token expirou (Testing-mode app, ~7d expiry). Permanent fix em curso ([[project_oauth_production_05mai]] — GCP verification pending).

**Quick fix:**
1. Reauth via `D:/jarvis/mcp-ads-bridge/` oauth flow
2. Atualizar `GOOGLE_ADS_REFRESH_TOKEN` em (a) jarvis/.env (b) Vercel bretda-lp production env
3. `vercel --prod` redeploy bretda-lp

**Permanente:** Aguardar GCP verification aprovar (1-6 semanas).

## Operação

Pra reportar uma venda real:
```bash
curl -X POST https://www.bretda.com.br/api/google-conversion/close-sale \
  -H "Content-Type: application/json" \
  -H "X-Bretda-OC-Secret: <secret>" \
  -d '{"lead_id":"...","sale_value_cents":240000,"order_id":"venda-X"}'
```

BRETDA_OC_API_SECRET salvo no Vercel Encrypted production. Pra recuperar valor: `vercel env pull` ou pedir pra mim regenerar (precisa redeploy).

Para listar leads pending no Upstash Redis: `ZRANGE bretda:pending 0 -1 WITHSCORES` via Upstash CLI. Dashboard UI ficou pro CRM Novo ([[project_crm_novo_15mai]]).

## Triggers (post-resolve)

- `audit capi google bretda` → re-roda smoke S1+S3 + check Google Ads Events Manager
- `bretda google oauth expired` → reauth runbook
- `reportar venda bretda` → guidance pra curl /close-sale

## Files entregues (12, ~1135 LOC)

`apps/bretda-lp/`:
- `src/lib/google-ads/{logger,types,oauth,conversions-client,config,lead-store}.ts`
- `src/app/api/google-conversion/{,lead,close-sale}/route.ts`
- `src/lib/tracking.ts` (+readGclid + trackGoogleOcLead)
- `src/components/organisms/contato-form.tsx` (wired)
- `docs/google-oc-runbook.md`

PR: branch `feat/google-oc-pipeline-2026-05-16` mergeado em `main` do fork `lorDofPicanha/bretda-lp` (commit `5935919`). NUNCA tocou SynkraAI/aios-core (cf [[feedback_git_pr_destination]]).

## Related

- [[session_bretda_full_day_15mai]] — Bretda Google state pré-EOL
- [[session_bretda_restore_12mai]] — Caminho B pattern Meta
- [[project_oauth_production_05mai]] — OAuth GCP verification track
- [[project_crm_novo_15mai]] — futura unificação multi-tenant
- [[feedback_git_pr_destination]] — push rule fork-only
