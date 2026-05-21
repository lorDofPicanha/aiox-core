---
name: OAuth Production Migration — Fase 0 Bretda 05/Mai
description: Status da migração OAuth Testing→Production do MCP Ads Bridge. Token validado vivo 05/Mai (4/4 customers 200 OK). Testing 7d expira ~06/Mai. Reauth + Verification submit pendentes user.
type: project
originSessionId: b1b9eedd-94a7-4cf1-9524-fa8a5009067b
---
**05/Mai/2026 — Fase 0 OAuth migration runbook Bretda Google Ads Reactivation.**

## Estado validado (05/Mai 14:00 BRT)
- **GCP Project:** `506145955453` (project_number, derived from client_id prefix)
- **OAuth Client ID:** `506145955453-1ukpk8339i3bbuokhmaneg8kto97ug1t.apps.googleusercontent.com`
- **Email owner:** `contato@tockscustom.com.br` (MCC 7943699417)
- **Refresh token age:** 6.5 dias (last reauth 29/Abr per `session_bretda_google_status_29abr.md`)
- **Modo provável:** Testing (refresh sobreviveu 6.5d; Production manteria 6 meses)
- **Validação live:** 4/4 customers retornam 200 OK (Tocks via MCC, Tocks direct, Bretda via MCC, MCC root)
- **Scopes ativos:** `adwords` + `spreadsheets`

## Próximo expiry conhecido
- **Atual:** ~05-06/Mai (Testing 7d rotation)
- **Após reauth de hoje:** ~12/Mai
- **Após Production verification:** indefinido (não rotaciona)

## Plano executado (@devops)
- ✅ 0.1 Validar status atual (GCP project, scopes, expiry probe)
- ✅ 0.1.x test queries Bretda + Tocks + MCC (todos 200 OK)
- ⚠️ 0.2 Submit Verification — PENDING USER (requer GCP Console UI, Privacy Policy URL, scope justifications)
- ⚠️ 0.3 Reauth Testing pra +7d — PENDING USER (interativo, requer browser consent)
- ✅ 0.4 Documentar próximo expiry (este memory + status report)

## Deliverables criados
- `D:/AIOS/docs/projects/bretda-google-ads-reactivation/fase-0/status-report.md` (procedimentos detalhados)
- `D:/AIOS/docs/projects/bretda-google-ads-reactivation/fase-0/mcp-validation.md` (test logs)

## User actions urgentes (HOJE/AMANHÃ)
1. **HOJE ~5min:** `node D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs` → atualizar `.env:9` → restart CC
2. **HOJE/AMANHÃ ~30min:** GCP Console `https://console.cloud.google.com/apis/credentials/consent` → "Publish App" → preencher Privacy Policy URL + scope justifications (textos sugeridos no status-report)
3. **D+3 a D+5:** aguardar email aprovação Verification

## Justifications sugeridas (para submit GCP)
- **adwords scope:** "Internal media-buying ops tool used by Synkra employees to manage Google Ads campaigns across multiple customer accounts under MCC 7943699417 (Tocks Manager). Access restricted to authorized employees with admin rights. Data used for reporting, optimization, automated bid adjustments. No end-user data exposed externally."
- **spreadsheets scope:** "Application writes performance reports to private Google Sheets owned by Synkra for cross-team analytics and historical archive. Read access used to ingest manual overrides from operations team into bidding pipeline."

## Gate 0 status: PARTIAL PASS
- ✅ MCP query Bretda 200 OK
- ✅ Próximo expiry documentado
- ⚠️ Production NÃO submetido ainda (mitigado por reauth de hoje + janela 7d)

## Caveats / Gotchas (per `feedback_oauth_reauth_gotchas`)
- Script reauth-with-sheets.cjs validado limpo (dotenv ok, redirect_uri /callback ok, sem fallback hardcoded)
- Após editar .env: PRECISA RESTART CC (MCP carrega .env no startup)
- Conclave self-consultation falhou em puxar gene-kim/kelsey-hightower (puxou stephen-hahn/pricing/mitnick) — usei julgamento próprio per fallback rule

## Trigger Fase 1
Quando user executar reauth + (idealmente) submit Verification: `audit url bretda` → traffic-chief faz raio-X URLs órfãs + conv actions cleanup.
