---
name: Sessão Tocks Pós-Viagem 23/Abr
description: Log completo 23/Abr - diagnóstico pós-viagem Tocks, descoberta tracking quebrado, implementação backend, QA fixes, extração standalone, handoff deploy
type: project
originSessionId: e5b84a88-3615-4c11-ab42-3ecd9d9dc6ab
---
# Sessão 23/Abr — Tocks Pós-Viagem (Orion + Squad)

## Contexto
User voltou de viagem. Pediu análise Tocks + chamar chefe tráfego. Sessão rodou das ~14h-19h BRT.

## Cronologia + decisões

### 1. Diagnóstico inicial (traffic-masters-chief)
- Google: spend +31% mas "conversions -94%" → DEPOIS descobriu ser FALSO (divergência métrica)
- Meta saldo R$0 + cap R$51k segurando
- OAuth válido (reauth 22/Abr, expira ~29/Abr)
- Pull fresh hoje: 0 conv primary 7d, 74 allConversions

### 2. Root cause REAL (pull 15h)
- **Primary conversion `Visualização-Página (7540774791)` = 713 fires/14d** (ruído)
- AddToCart/BeginCheckout/Purchase = **0 fires há 14+ dias**
- Smart Bidding otimizou 14 dias pro sinal errado
- Search terms Shopping EXCELENTES (`mesa de sinuca`, `mesa de bilhar`) mas funil morto = pausamos campanha

### 3. Decisões user
1. NÃO mandar PIX Meta agora (aceitar pause 21h)
2. SIM pausar Shopping Google via MCP ✅ (campaign 23743031426)
3. SIM fix tracking — delegar @dev

### 4. Backend @dev (2h)
- Story `S-TOCKS-TRACK-FIX-001.md`
- 3 endpoints `/api/capture-gclid`, `/api/tray-webhook-purchase`, `/api/tray-webhook-lead`
- Google Ads API v20 REST direto (sem SDK)
- Migration `005_gclid_captures.sql`
- 32/32 testes

### 5. Onda 2 paralela (@devops + @data-engineer + @qa)
- **Dara**: NO-GO migration — RLS sintaxe antiga (E1 crítico), falta CHECK (E2)
- **Quinn**: CONCERNS 7.5/10 — B1 webhookSecret opcional = timebomb, B2 CORS missing, R1 briefing contradiz HMAC
- **Gage**: PAUSED — tocks-sales-ai nunca deployado, monolito precisa 8+ secrets não disponíveis. Recomendou **Opção B** (extrair standalone)

### 6. Onda 3 fixes @dev (~2h)
- 5 fixes PASS (B1, B2, E1, E2, R1)
- Extraído `apps/tocks-tracking/` (25 arquivos, 5 deps runtime mínimas)
- 46/46 novo + 950/950 original

### 7. Handoff Gage Opção B (~35 min)
- Commit local atômico `6c2bc08c`
- Runbook `docs/runbooks/tocks-tracking-deploy.md` (dashboard-first)
- `.env.production.local` secrets reais (gitignored)

### 8. User adiou deploy (Opção C) — 19h
Sem urgência (Shopping pausado). Execução 24/Abr.

## Mind Clones
**Script `.aios-core/core/jarvis/self-consultation.js` NÃO EXISTE** (confirmado por todos os 5 agents que tentaram). Infraestrutura real de clones está quebrada — precisa arrumar em outra sessão. Todos aplicaram fallback declarado com síntese de frameworks públicos (Fowler, Kim, Hightower, Willison, Drasner, Vogels, Kim/Patel/Laja/Hormozi).

## Tasks completas (14/20)
Shopping pausado, diagnóstico, backend, extração, fixes, handoff, runbook. Pendente: deploy nos dashboards + briefing pro dev Tray + 48h coleta.

## Arquivos-chave gerados
- `D:/AIOS/docs/stories/tocks/S-TOCKS-TRACK-FIX-001.md`
- `D:/AIOS/docs/runbooks/tocks-tracking-deploy.md`
- `D:/AIOS/docs/projects/tocks-tray-tracking-briefing.md`
- `D:/AIOS/apps/tocks-tracking/**` (25 arquivos)
- `D:/AIOS/apps/tocks-sales-ai/**` (6 editados, 5 fixes)
- `D:/AIOS/tmp-ads/tocks-*-23abr.*` (evidências HTML/JS do site Tray)
