---
name: polymarket-resume-15-mai-noite
description: "RESUME POINT — sessão pausada pelo user mid-orquestração 15/Mai noite. Fixes runtime feitos (watchdog + heap), bot LIVE PID 5644. Pendentes (user pediu mas não executei): correção tudo P0 (ARB drift + OOM root cause + ACE reset + daily-checkup) + MEGA PESQUISA 250+ fontes Tier S/A pra projeto Polymarket. HYDRA pipeline location ainda não localizado nessa sessão."
metadata:
  node_type: memory
  type: project
  originSessionId: 15-mai-2026-noite
---

# Polymarket — Resume Point 15/Mai Noite

User interrompeu mid-orquestração e pediu "salve tudo". Esta memória documenta o estado exato pra retomada limpa.

## ✅ FEITO nessa sessão

### Fixes runtime aplicados (não-commitados)
1. `apps/polymarket-trader/scripts/watchdog.ps1` — auto-restart logic (chama start-bot.bat quando heartbeat stale >10min). Antes só mandava Telegram alert. Logs de "ALERT FIRED" + "OK alive scan=X" pra forensics.
2. `apps/polymarket-trader/scripts/start-bot.bat` — `--max-old-space-size=2048` (heap 2GB vs 1.5GB default). Mitigação OOM no Gamma fetcher.

### Bot restart confirmado
- **PID 5644** ativo desde 15/Mai 22:02 BRT
- scan #2 em 30s: 150 fetched (PM:100 + KA:50), 5 weather markets eligible, 0 signals (heurística conservadora restart limpo)
- Config: `verticals: ["weather"]`, `pollMs: 30000`, `unlimited: true`, `mode: paper`, LLM disabled
- Watchdog scheduled task = Ready, next tick 22:10 BRT

### Memórias salvas
- `runbook_kr_whatsapp_p2_15mai.md` — Breno executar P2 pela Kell (5 passos Caminho A)
- `session_polymarket_extension_d30_15mai.md` — extensão D+30=03/Jun + diagnóstico 3 bugs
- MEMORY.md atualizada com 2 novos entries

## 🔴 NÃO FEITO — User pediu mas interrompeu

### A. "Corrija tudo" — 4 bugs P0 estruturais (Sprint 2)

1. **ARB cross_market drift** — `apps/polymarket-trader/src/strategies/cross-platform-arb.ts`
   - Bot.log antes do crash: `[AutoTrader] ARB cross_market: profit=1.52%`
   - Open positions hoje 05:13 BRT: `vertical:"crypto" + strategy:"cross_platform"`
   - Filtro `enabledVerticals: ['weather']` em auto-trader.ts:275 NÃO bloqueia ARB que cria signals com qualquer market
   - Fix needed: filtrar legs por vertical no strategies/cross-platform-arb.ts (ambas as legs precisam ser weather, senão skip)

2. **OOM root cause** — não identificado, só mitigado com heap bump
   - Suspeitos: EventEmitter listeners não removidos, blacklist Map cresce sem limit, tagIdCache, market history acumulando
   - Approach next session: adicionar `process.memoryUsage()` log a cada 50 scans no auto-trader.ts, identificar growth pattern (heap_used, external, arrayBuffers)
   - Fix tactico: TTL no blacklist Map, max size cap, periodic GC hint, audit removeAllListeners no event-bus

3. **ACE state reset** — `apps/polymarket-trader/data/ace-state.json` (se existir)
   - ACE Evolver pode ter bumpado minEdge=0.08 após 1158 trades crypto-dominados
   - Override de 04/Mai em auto-trader.ts:481 força effectiveMinEdge=config.minEdge (0.02) em runtime
   - Mas se o state file persiste seed bug, ACE re-evolui errado on next iteration
   - Fix: delete data/ace-state.json + restart, ou reset ACE state via CLI command se existir

4. **Daily-checkup gaps** — Journal sem entries em 06,07,09,10,13,14/Mai (6 dias)
   - scripts/daily-checkup.ps1 roda 14:30 BRT/dia via Task Scheduler
   - Gaps sugerem: Task Scheduler missed fires (PC dormindo? Login state?) OU script falhou silencioso
   - Fix: adicionar `-WakeToRun` no Task Scheduler trigger, audit script error handling

### B. Mega Research 250+ fontes Tier S/A pra projeto Polymarket

**NÃO INICIEI.** Estava em fase de discovery (localizar pipeline HYDRA + mind clones relevantes) quando user interrompeu.

**Pendência discovery:**
- HYDRA scripts/pipeline location não confirmada nessa sessão
- Possível path: `D:/jarvis/mega brain/scripts/` (não existe) OU `apps/hydra*` (não existe localmente) OU repo separado `lorDofPicanha/hydra-content-intelligence` (showcase público)
- Memória `reminder_hydra_distribution_bug_14mai` diz: "HYDRA caminho A viável de novo — pra próximos projetos pode usar pipeline real ao invés de Caminho C"
- Memória `reminder_hydra_mega_research_resume_12mai` documenta pipeline travou OOM em 12/Mai, 3 opções pra retomar: (A) debug isolado, (B) fallback ingest-dossier.mjs 08/Mai, (C) manual hybrid

**Mind clones potencialmente relevantes pra Polymarket research:**
- `domer-polymarket` (já existe no roster AIOS)
- `theo-polymarket` (já existe)
- `nate-silver` (já existe)
- `philip-tetlock` (já existe — superforecasters)
- `robin-hanson` (já existe — market design)
- `aswath-damodaran` (já existe — valuation, statistical edge)
- `chip-huyen` (já existe — ML production)
- `andrew-ng` (já existe — ML)
- Faltam no roster: nassim-taleb (asymmetric bets), michael-mauboussin (luck vs skill)

**Approach a ser definido na retomada:**
- Caminho A: HYDRA pipeline real (Sprint #1 = 3/12 stories shipped, 617 tests passing)
- Caminho B: ingest-dossier.mjs proven 08/Mai (overnight pattern Anipis/HighTicket)
- Caminho C: manual hybrid feed-write
- **Recomendação:** Caminho B (proven 1006-1007 fontes em sessões 08/Mai) com router HYDRA-style → ~8-10 mind clones especializados em prediction markets, statistics, weather forecasting, arbitrage

**Topics a cobrir nas 250+ fontes Tier S/A:**
- Prediction markets theory (Robin Hanson, Polymarket whitepapers, Kalshi)
- Weather forecasting models (NOAA, ECMWF, ML weather models)
- Brier score optimization (calibration techniques)
- Arbitrage detection strategies (Polymarket × Kalshi inefficiencies)
- Market microstructure (CLOB dynamics)
- Sports betting analytics (transferable patterns)
- Behavioral finance (overpricing biases)
- ACE/evolutionary strategy tuning
- Memory profiling Node.js (bot stability)

## ⚠️ Estado código atual

**Não commitados:**
- 4 patches 04/Mai (weather filter, enabledVerticals, hasActiveLLM, ACE override em código — não state file)
- 2 patches 15/Mai (watchdog auto-restart, heap bump)
- Total: 6 patches aguardando @devops empacotar

**Commits pendentes outras frentes (não-Polymarket) na branch:**
- Branch atual: `feat/hydra-resilience-sprint`
- Git status mostrava muitos modificados + deleted (apps/tocks-website/docs/* deletados)
- NÃO consolidar/commitar sem user explicit approval

## 🎯 Triggers retomada

- `polymarket sprint 2 fixes` — executar 4 bugs P0 (ARB + OOM + ACE + daily-checkup)
- `polymarket mega research` — iniciar HYDRA 250+ fontes Tier S/A
- `polymarket status` — recheck bot heartbeat, watchdog uptime desde 15/Mai 22:02
- `polymarket mid-verdict` — 24/Mai check PF + decisão
- `commit polymarket` — @devops empacota 6 patches

## Files modificados nessa sessão

| Path | Status |
|---|---|
| `apps/polymarket-trader/scripts/watchdog.ps1` | M — auto-restart added |
| `apps/polymarket-trader/scripts/start-bot.bat` | M — heap=2048 |
| Memory files | 3 created |
| MEMORY.md | 3 edits |

## Critical reminders pra próxima sessão

1. **Bot vivo agora** — não restart se não precisar. Watchdog automático cobre crashes.
2. **Heartbeat check primeiro** — `cat apps/polymarket-trader/data/heartbeat.json` antes de qualquer fix
3. **Mid-verdict 24/Mai = D+20** — se PF<0.9 com ≥10 resolved weather trades, KILL antecipado
4. **Deadline final D+30 = 03/Jun**
5. **ARB drift = sample contamination** — sem fix, mesmo se hit PF≥1.0 não honra backtest 1.415 puro weather
