---
name: polymarket-kill-18-mai
description: "Polymarket Trader KILLED 18/Mai/2026 (D+14 do pivot, D+3 da extensão). Audit revelou bot dead, watchdog silencioso 3d, 100% trades crypto (zero weather), PF<0.6, -$15.63 PnL. Bug C ARB drift confirmado código (cross-platform-arb.ts:404-405 emite via eventBus bypassing filter). Mid-verdict KILL threshold atingido 6d antes. Tasks Disabled, snapshot arquivado, 2 docs criados (post-mortem + reusable-patterns)."
metadata:
  node_type: memory
  type: project
  originSessionId: 18-mai-2026
---

# Polymarket Trader — KILLED 18/Mai/2026

## Decisão
KILL após audit completo revelar projeto estruturalmente quebrado em 3 eixos:
1. Vertical errado executando (100% crypto ARB, zero weather)
2. Monitoring quebrado (watchdog silente 3 dias, daily-checkup falhando 0x80070520)
3. PF<0.6 em 16 resolved — mid-verdict KILL threshold atingido 6 dias antes do scheduled (24/Mai)

## Ações executadas

**Phase 1 — Stop infra (reversível):**
- `PolymarketBotWatchdog` task → Disabled (XML exportado)
- `PolymarketDailyCheckup` task → Disabled (XML exportado)
- Bot process (PID 9560) → já estava dead, nada a stopar

**Phase 2 — Archive data:**
- `docs/projects/polymarket-trader/archive-18mai/data-snapshot/` (1.3MB)
  - trades-final.json (1.195 trades histórico)
  - open-positions.json (13 crypto positions)
  - journal.md
  - heartbeat.json
  - bot-final-500lines.log

**Phase 3 — Post-mortem:**
- `docs/projects/polymarket-trader/POST-MORTEM-18mai.md` (5 lições estruturais + bugs root cause + timeline)

**Phase 4 — Extract reusable patterns:**
- `docs/learnings/reusable-patterns-from-polymarket.md` (6 patterns: heartbeat JSON, kill criteria framework, watchdog corrigido, dead-man-switch externo, data archival, conclave protocol)

**Phase 5 — Memory update (este arquivo + supersede 2 reminders ativos)**

## Bugs root cause documentados

### Bug 1 (Bug C from 15/Mai memo) — ARB vertical filter bypass
`apps/polymarket-trader/src/strategies/cross-platform-arb.ts:404-405` emite `signal:detected` direto no eventBus, contornando filtro `enabledVerticals` do `auto-trader.ts:275`. Por isso 29/29 trades desde pivot = crypto.

### Bug 2 — Watchdog auto-restart silenciosamente quebrado
Task scheduled `Ready`, LastRunTime atualizando, **mas log silente desde 15/Mai 21:35**. Bot ficou ≥40min DEAD sem restart. O "fix" 15/Mai 22:02 não foi testado E2E.

### Bug 3 — Daily-checkup
LastTaskResult `2147946720` = `0x80070520 ERROR_NO_SUCH_LOGON_SESSION`. Resultou em 6 dias gap no journal.

### Bug 4 — Sizing weather inviável
Signals weather observados (`edge=2.0% size=$1.03`) gerariam EV $0.02/trade. PF 1.415 backtest viraria $0.30 em 15 signals → payoff irrelevante.

## Performance final

| Métrica | Valor |
|---|---|
| Trades all-time | 1.195 |
| Crypto | 1.148 (96.1%) |
| Weather (vertical-alvo) | **0** |
| PnL acumulado | -$25.88 |
| Tempo total | ~6 semanas |
| Tempo de produto = 0% |

## Triggers ressuscitação (caso mude de ideia)
- `revive polymarket` — re-enable tasks + restart
- `polymarket weather-only fix bug-1` — fix ARB bypass primeiro
- `polymarket sizing redesign` — min size $25 + min edge 5%

**Recomendação:** ressuscitar SÓ após fix Bug 1 + test E2E confirmando que `verticals:["weather"]` resulta em 100% weather trades em 24h. Senão é repetir o mesmo loop.

## SUPERSEDES
- `reminder_polymarket_resume_15mai_noite.md` — RESUME point obsoleto
- `session_polymarket_extension_d30_15mai.md` — extension cancelada
