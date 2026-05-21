---
name: Tocks D++ CAPI Activation Session 04-05/Mai
description: Sprint completo Tocks Meta CAPI D++ — audit/stories/dev/QA/devops/Sales AI Railway deploy. End-state ANTES da ativação live = targetPort fix em dashboard (último user action).
type: project
originSessionId: 60020527-c949-4341-81da-1aa3cc54a729
---
# Tocks D++ CAPI Activation — Session 04-05/Mai

> **⚠️ STATUS UPDATE 12/Mai/2026** — PR #645 foi **CLOSED SEM MERGE** em 2026-05-07 22:33Z (verificado via `gh pr view 645`). **CAPI Tocks NÃO está deployed** em prod. Branch `feat/tocks-capi-d-plus-plus` ainda existe local + fork remote (mergeStateStatus BEHIND main). Para retomar: reabrir PR após rebase OR refazer implementação. Ver `session_tocks_hydra_actions_12mai.md` (12/Mai).


## Decisões base

- **Caminho A confirmado:** Tocks first, Bretda depois (multi-tenant via 2 Railway projects separados, NÃO refactor multi-tenant no codebase)
- **Verdict D++ via Sales AI:** rejeitado pivot OUTCOME_CONVERSIONS site (conclave 30/Abr 5/5). PARK tocks-tracking (Sales AI absorve `/api/capture-gclid`).
- **SLA 07/Mai (3 dias)** → cumprível com folga
- **GO 1+2+3:** D++ + GTM fix + PARK aprovados

## Squads disparados (em ordem)

1. **aios-architect** — audit CAPI Sales AI codebase. Verdict PARTIAL READY: Lead path completo (`MetaCapiClient.sendLeadEvent()` + dispatch via WhatsApp hot-score), Purchase missing.
2. **traffic-masters-chief** — diagnose Google Ads tracking gaps. Root cause `conv_value=0` em 124 conv = GTM Tray Purchase tag sem `transaction_value` DLV.
3. **aios-devops** (1ª onda) — Sales AI Railway link drift catch (`apps/tocks-sales-ai/.railway` apontava pra `anipis-api` Serenity → ABORT deploy). PR #645 OPEN em SynkraAI/aiox-core via fork lorDofPicanha (cherry-pick b5f6244c only, PARK commit d6cac559 SKIPPED por arquivos referenciados não existirem em main).
4. **aios-sm** — draft 3 stories em `docs/stories/active/`: STORY-TOCKS-CAPI-D++.md, STORY-TOCKS-PARK-TRACKING.md, STORY-TOCKS-GTM-FIX.md
5. **aios-dev** (1ª onda) — implementação. 16 testes novos, 969/969 PASS. Commits locais b5f6244c (D++ apps/tocks-website) + d6cac559 (PARK).
6. **aios-qa** — Gate PASS 9/10. 1 MED hashing parity bug (browser hashes email ANTES de POST, server re-hash → email_hash = sha256(sha256(email))). Não-bloqueador → STORY-TOCKS-CAPI-FBC-LOOKUP-FIX P1 post-deploy.
7. **aios-devops** (2ª onda) — runbook Railway init em `docs/runbooks/tocks-sales-ai-railway-init.md` (8 steps, 25min ETA, 39 env vars cataloged).
8. **aios-dev** (2ª onda HOTFIX) — `js-yaml` faltava em deps (importado por 5 módulos, vinha como transitive de dev pkg, `npm prune --omit=dev` matou em prod). Adicionado js-yaml@^4.1.1 + @types/js-yaml@^4.0.9. Audit completo: 12 pacotes externos cobertos após fix.

## Estado das contas Tocks (post-audit)

- **Pixel ID Tocks:** `1382948639707224`
- **Ad Account Tocks:** `act_1221671265457624`
- **Google Ads Tocks Customer ID:** `8146675397` (LOGIN MCC: `7943699417`)
- **System User Tocks:** "Conversions API System User" ID `122227374668268695`
- **App linked:** "Sales Ia" ID `1471521401018296`
- **Token Meta CAPI:** PERMANENTE (`expires_at: 0`), scopes: ads_management + business_management + whatsapp_business_messaging + 7 mais
- **Railway project:** `tocks-sales-ai` ID `824d287e-f04d-4ec6-b0a5-f63590e30672` workspace lordofpicanha personal
- **Service ID:** `8d0911bc-612a-43d7-a7b2-4444e19a19fd`
- **Domain:** https://tocks-sales-ai-production.up.railway.app (targetPort=None ⚠️)

## Env vars provisioned (42 total)

- 22 known-values via `scripts/railway-env-sync.sh --apply`
- 12 user-supplied piped silently de `apps/tocks-sales-ai/.env` (WhatsApp 5, Supabase 3, Claude API, Redis Upstash, Anonymization Salt, Webhook Secret)
- 4 Google Ads de `D:/jarvis/mcp-ads-bridge/.env`
- 1 TRAY_WEBHOOK_SECRET de `apps/tocks-tracking/.env.production.local`
- 2 KNOWN: META_CAPI_PIXEL_ID + CORS_ORIGINS
- 1 META_CAPI_ACCESS_TOKEN (token validado contra Meta Graph API antes de set)

⚠️ **Token foi colado no chat → Anthropic logs.** Recomendar rotação em 30d (Meta BM → System Users → Revoke + Regenerate).

## Bloqueador final = Railway targetPort

Domain `tocks-sales-ai-production.up.railway.app` tem `targetPort=None` porque `railway domain` foi rodado ANTES do primeiro deploy succeed → Railway nunca auto-atribuiu. Build #4 em curso vai falhar pelo mesmo motivo.

**FIX (user action manual no dashboard):**
1. Abre https://railway.com/project/824d287e-f04d-4ec6-b0a5-f63590e30672?environmentId=e2facee6-456c-4974-98bd-cae569e4644f
2. Service tocks-sales-ai → Settings → Public Networking → edita domain → Target Port = `3100` → Save
3. Manda "port setado" → Orion trigger `railway redeploy` → healthcheck deve verde

CLI Railway v4.36.0 não tem `domain remove` (única alternativa = recriar domain via dashboard).

## Pendências user pós-targetPort

- Apply migration 006 (`apps/tocks-sales-ai/supabase/migrations/006_capi_browser_cookies.sql`) no Supabase prod SQL editor (idempotente, ADD COLUMN IF NOT EXISTS)
- Tray painel Tocks → Webhooks → adicionar:
  - Pedido Pago → `https://tocks-sales-ai-production.up.railway.app/api/tray-webhook-purchase`
  - Carrinho Abandonado → `.../api/tray-webhook-lead`
- Tray storefront pixel: editar checkout sucesso template pra `fbq('track','Purchase',{value,currency:'BRL'},{eventID:<sha256(orderId+'-Purchase')>})` — third-party Tray, fora do repo
- Test Events validation no Meta Events Manager
- Merge PR #645 quando CodeRabbit review OK
- Demote OUTBOUND_CLICK ~13/Mai pós Fix#1 ter 7d data
- Share GTM container pra @aios-dev rodar STORY-TOCKS-GTM-FIX

## Caveat operacional importante

**Janela cega Smart Bidding pós GTM fix:** os 124 conv com `value=0` envenenaram o algoritmo. Após Purchase value fix, NÃO julgar performance Google Ads antes de **2026-05-21** (~14d reset). Dia 10/Mai vai parecer ruim — é normal.

## Commits locais (não pushed via this session)

- `b5f6244c` (PR #645 cherry-pick) — D++ apps/tocks-website + new analytics lib (capture-gclid, fbq eventID, trackers, gtag, hashing, normalize)
- `d6cac559` (skipped do push) — PARK runbook DEPRECATED + apps/tocks-tracking/README STATUS PARKED. Viaja quando feat/redesign-foundation-tokens mergear.
- Sales AI changes (gitignored monorepo whitelist `apps/*` exclui `apps/tocks-sales-ai`) — working tree only, vai por `railway up` mesmo

## Stories filed

- `D:/AIOS/docs/stories/active/STORY-TOCKS-CAPI-D++.md` — Ready for QA → PASS → ready to deploy
- `D:/AIOS/docs/stories/active/STORY-TOCKS-PARK-TRACKING.md` — applied
- `D:/AIOS/docs/stories/active/STORY-TOCKS-GTM-FIX.md` — pending GTM container access
- `STORY-TOCKS-CAPI-FBC-LOOKUP-FIX` — backlog P1 (hashing parity bug, post-deploy)

## Trigger retomada

- "port setado" → trigger redeploy + health verify
- "ativa capi tocks" → after all user actions done (token, env, migration, webhook, pixel)
- "vamos pra bretda" → repete fluxo análogo (Bretda Railway project + envs + already-done CAPI infra)
- Build #4 deployment ID: `0b5284ad-500c` (BUILDING when this memo saved)
