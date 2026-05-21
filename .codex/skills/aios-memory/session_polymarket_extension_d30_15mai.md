---
name: polymarket-extension-d30-15-mai
description: "Extensão do plano 15-day → 30-day Polymarket. Verdict D+11 (15/Mai): bot DEAD por OOM, watchdog cego (só alert Telegram sem restart), 0 resolved trades weather pós-pivot. Aplicou 2 fixes: heap=2GB + watchdog auto-restart. Restart bot PID 5644 22:02 BRT. Nova deadline D+30=03/Jun. Pendência: drift ARB cross_market e memory leak root cause."
metadata:
  node_type: memory
  type: project
  originSessionId: 15-mai-2026
---

# Polymarket — Extensão D+30 (15/Mai/2026)

User triagem 15/Mai D+11 retornou: bot morto desde 18:05 BRT (OOM weather fetch), watchdog cego (só Telegram alert sem restart), 0 resolved trades pós-pivot 04/Mai. Escolheu **Extend D+30** ao invés de kill (acredita estruturalmente em weather edge).

## Verdict cru D+11 (15/Mai)

| Métrica | Valor |
|---|---|
| Dias rodando | 11 |
| Scans acumulados | ~19.226 |
| Signals heurística weather | 15 |
| Trades 24h totalizados | 34 paper |
| Resolved trades pós-pivot weather | **0W 0L** |
| Resolved total | 0W 1L (crypto antigo 02/Mai $-10.25) |
| PnL papel | -$10.25 |
| Daily-checkup gaps | 6 dias sem journal (06,07,09,10,13,14/Mai) |
| Crash atual | OOM `Failed to allocate memory` em tag_id=84 weather fetch |

## Diagnóstico 3 bugs estruturais

### Bug A — Watchdog não restart
- `scripts/watchdog.ps1` original (Conclave-Ng 27/Abr) só **enviava Telegram alert** quando heartbeat stale (>10min)
- Restart só via `daily-checkup.ps1` que roda 14:30 BRT/dia
- Bot morto 18:05 → ficaria down até 14:30 dia seguinte (até 20h downtime/incidente)
- 6 dias de gaps no journal são evidence histórica do bug

### Bug B — OOM no PolymarketClient após ~1000 scans
- Default node heap ~1.5GB
- Após ~1038 scans acumula state que dispara OOM no `fetch` weather (tag_id=84)
- Root cause não identificado nessa sessão (poss. EventEmitter leak, Map state, blacklist cresce indefinido)
- Patch tactic: bump heap 2GB via `--max-old-space-size=2048`

### Bug C — ARB cross_market drift (pendente investigação)
- `bot.log` mostrou `[AutoTrader] ARB cross_market: profit=1.52% cost=$0.966 (2 legs)` antes do crash
- `open-positions.json` (15/Mai 05:13 BRT) registra position com `vertical:"crypto"` + `strategy:"cross_platform"`
- Significa: scope-collapse `enabledVerticals:['weather']` NÃO bloqueia ARB cross_platform que cria signals com qualquer market
- Filtro `auto-trader.ts:275` filtra market por vertical mas ARB pode hit ANTES
- **Sample real não é "weather-only puro"** → backtest PF 1.415 não aplica direto
- Não fixado nessa sessão. Documentado como conhecido pra Sprint 2 ou kill criterion

## Fixes Aplicados 15/Mai 22:02 BRT

### Fix 1 — Watchdog auto-restart
`apps/polymarket-trader/scripts/watchdog.ps1` linhas 93-115:
- Quando age > 10min, agora chama `start-bot.bat` via `Start-Process -WindowStyle Hidden`
- Telegram alert continua mas com texto "Auto-restarting..."
- Erro tracking se start-bot falhar
- Log line "OK — bot alive" agora inclui scan/signals/age pra forensics

### Fix 2 — Node heap bump 2GB
`apps/polymarket-trader/scripts/start-bot.bat` linha 13-15:
- Adicionou `--max-old-space-size=2048` no node spawn
- Bot agora roda com 2GB heap (vs 1.5GB default)
- Mitigação OOM até root cause memory leak achar fix definitivo

## Restart Executado

- **22:02 BRT** — start-bot.bat fired
- PID 5644 ativo
- Scan #2 em 30s: 150 fetched (PM:100 + KA:50), 5 eligible weather markets, 0 signals (heurística conservadora restart limpo)
- Config confirmada: `verticals: ["weather"]`, `pollMs: 30000`, `unlimited: true`, `mode: paper`
- LLM disabled (heuristic-only)

## Novo Plano D+30 (até 03/Jun)

| Fase | Dias | Critério |
|---|---|---|
| 4. Sample Generation Extended | D+11 → D+25 (15/Mai → 29/Mai) | Watchdog auto-restart deve manter bot >95% uptime. Target: ≥20 trades weather resolved |
| 5. Mid-Verdict | D+20 (24/Mai) | PF<0.9 com ≥10 resolved trades → KILL antecipado |
| 6. Pre-Final Verdict | D+25 (29/Mai) | PF<1.0 com ≥20 resolved trades → KILL antecipado |
| 7. Final Verdict | D+30 (03/Jun) | PF≥1.0 com ≥30 resolved trades → continue. Senão → KILL |

## Pendências P0 pra Sprint 2 (próxima sessão dedicada)

1. **Investigate cross_market ARB drift** — confirmar se ARB pega cross-platform (Polymarket × Kalshi) com markets non-weather. Se sim, filtrar legs por vertical no `strategies/cross-platform-arb.ts`
2. **Memory leak root cause** — adicionar log `process.memoryUsage()` a cada 50 scans no auto-trader, identificar growth pattern, fix vazamento (suspeitos: EventEmitter listeners, blacklist Map, tagIdCache, marketHistory)
3. **Daily-checkup robustness** — fix gap dias 13-14/Mai (script falhou silencioso? Task Scheduler missed?)
4. **Reset ACE state** — `data/ace-state.json` se existir com `minEdge=0.08` pollue restart. Force minEdge=0.02 já no código mas state file pode rebooter ACE com seed bug crypto

## Triggers próxima sessão

- `status polymarket` — heartbeat + journal + uptime since 15/Mai 22:02
- `kill polymarket` — graceful shutdown se decidir abortar antes do D+30
- `polymarket mid-verdict` — 24/Mai check PF + decisão kill ou continue
- `polymarket arb fix` — investigar e fixar drift cross_market
- `polymarket memory leak` — diagnose + fix vazamento heap

## Mind Clones implícitos (não consultei MCP)

- **chip-huyen**: "extending without root-cause fix = throwing time at structural problem"
- **andrew-ng**: "production drift from spec is the iceberg — fix the scope-collapse rigor before extending"
- **aswath-damodaran**: "sample size matters > model perfection. 30d gives ~60 resolved trades, sufficient"
- **nate-silver**: "weather still structurally good for prediction. Worth the extension"

Convergência: extend é defensável SE bugs estruturais fixados. Watchdog + heap = mínimo viável. ARB drift + memory leak são P0 Sprint 2.

## Commits pendentes (NÃO commitados nessa sessão)

- `apps/polymarket-trader/scripts/watchdog.ps1` — auto-restart logic
- `apps/polymarket-trader/scripts/start-bot.bat` — heap=2048 bump
- 4 patches 04/Mai ainda staged (weather filter, enabledVerticals, hasActiveLLM, ACE override)

User decide quando @devops empacota tudo + push.

## Files temp

- `data/bot.pid` agora = 5644
- `data/heartbeat.json` 15/Mai 22:02 BRT
- `data/bot.log` ~4.7MB (não-rotated, vale rotação preventiva)
- `data/watchdog.log` 285KB
