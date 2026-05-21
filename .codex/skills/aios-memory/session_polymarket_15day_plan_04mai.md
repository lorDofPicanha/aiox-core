---
name: Sessão Polymarket 15-day Plan 04/Mai
description: Squad verdict + 3 bug fixes para destravar bot Polymarket (weather-only por backtest PF 1.415, heuristic fallback gate, ACE override). 15-day deadline 19/Mai. Kill criterion D+10 PF<1.0.
type: project
originSessionId: 04-mai-2026
---
# Sessão Polymarket 15-day Plan — 04/Mai/2026

User retornou 04/Mai (após viagem Bretda 30/Abr-03/Mai), perguntou status do bot Polymarket. Diagnostiquei 3 bugs em camadas + apliquei fixes minimal-surface + restart. Bot LIVE com signals fluindo.

**ULTIMATO:** 15 dias (D+0=04/Mai → D+14=19/Mai). Se bot não trazer resultado validado, user mata o projeto.

## Contexto Pré-Sessão

- Backtest 29-30/Abr (BACKTEST-1+2 Tier 1, N=7.809) entregou veredito: **weather é a única vertical com edge estatisticamente significativo (PF 1.415, Brier signal 0.1338 < baseline 0.1347, CI lower 0.0005 > 0)**. Crypto/sports/politics/finance EMPATAM com mid-price baseline.
- Bot continuou rodando multi-vertical pós-backtest. Cenário A do BACKTEST-MORNING-RUNBOOK ("@dev adaptar auto-trader.ts ao MarketSelector real-only com weather + crypto filter") **NUNCA EXECUTADO**.
- 30/Abr-03/Mai journal: 8 trades em 4 dias (todos crypto, vertical NO-EDGE), 1 LOSS resolved -$10,25, **0 signals/dia** todos os dias.
- 04/Mai manhã: bot DOWN (PID 26832 morto), watchdog last tick 04/Mai 07:35 BRT (4h gap). PC dormiu.

## Squad Verdict (acting as orchestrator with backtest data)

**Scope collapse to weather-only.** Crypto trading desde pivot 27/Abr era aleatório (zero edge no backtest). Bot apostando em vertical errada há 7 dias.

**Plano 15 dias:**

| Fase | Dias | Critério |
|---|---|---|
| 1. Scope Collapse | D+0 | Weather-only filter + restart + remover tag_id 403 |
| 2. Sample Generation | D+1 → D+10 | Daily Telegram countdown, weather-only paper. N≥30 trades |
| 3. Honest Verdict | D+10 → D+14 | PF/WR real vs backtest 1.415. PF<1.0 → KILL |

**Guardrails:**
- 🔒 Stay paper, NÃO ir live
- 🔒 D+10 (14/Mai): PF<1.0 → kill antes pra não desperdiçar 5 dias
- 🔒 D+14 (19/Mai): kill final se não houver edge claro

## Bugs Diagnosticados Hoje (3 layers)

### Bug 1 — Discovery layer
- `.env` tinha `PM_CATEGORIES=sports,weather,crypto` → fetch tag_id de 3 categorias, sendo sports e crypto NO-EDGE
- Polymarket API retornava 403 em alguns tag_id endpoints (intermitente)
- **Fix:** `.env` PM_CATEGORIES=weather (single category, 100 markets/scan da página weather)

### Bug 2 — Filter layer
- `defaults.ts:60` (PAPER_UNLIMITED_CONFIG) tinha `enabledVerticals: [...all 7 verticals]`
- Mesmo com PM filter, Kalshi traz 50 markets multi-vertical. Sem este filtro, multi-vertical passava no preFilter.
- **Fix:** `enabledVerticals: ['weather']` + `enabledStrategies: ['weather_model', 'info_arb']`

### Bug 3 — Heuristic fallback layer (CRÍTICO — não documentado)
- `auto-trader.ts:324`: `if (this.marketAnalyzer)` tinha objeto truthy mesmo com DISABLE_LLM=true (provider='none')
- LLM path retornava `[]` (linha 728 market-analyzer: `if (this.provider === 'none') return [];`)
- Heuristic fallback (linha 348) NUNCA rodava
- **Resultado:** bot effectively cego há ~5 dias (zero signals em 9k+ scans)
- **Fix:** mudou condição para `const hasActiveLLM = this.marketAnalyzer && this.marketAnalyzer.getProvider() !== 'none'`

### Bug 4 — ACE Evolver inflation (BUG MAIS GRAVE — silencioso)
- `auto-trader.ts:481`: `effectiveMinEdge = aceParams?.minEdge ?? this.config.minEdge`
- ACE Evolver tinha bumpado `aceParams.minEdge` para **0.08** após 1158 trades (crypto-dominados, alto loss rate)
- Heurística max signal = 0.020 (midRangeEdge), nunca passa floor 0.08
- Backtest PF 1.415 usou minEdge ESTÁTICO 0.02 — produção evoluído pro 0.08 não tem suporte estatístico
- **Fix:** force `effectiveMinEdge = this.config.minEdge` (0.02), ignorando ACE até weather ter 50+ trades pra seed evolution clean

## Patches Aplicados (não-commitados)

| Arquivo | Mudança |
|---|---|
| `apps/polymarket-trader/.env:29` | `PM_CATEGORIES=sports,weather,crypto` → `PM_CATEGORIES=weather` |
| `apps/polymarket-trader/src/config/defaults.ts:60-61` | `enabledVerticals: ['weather']`, `enabledStrategies: ['weather_model', 'info_arb']` |
| `apps/polymarket-trader/src/engine/auto-trader.ts:324` | Heuristic fallback condition fix (`hasActiveLLM`) |
| `apps/polymarket-trader/src/engine/auto-trader.ts:481` | ACE override: `effectiveMinEdge = this.config.minEdge` |
| `apps/polymarket-trader/scripts/daily-checkup.ps1:275` | 15-day countdown line in Telegram daily summary |

## Estado Final 04/Mai 12:40 BRT

- Bot **PID 1488** rodando, weather-only, heuristic-only (DISABLE_LLM=true)
- Heartbeat: scan=6 eligible=5 signals=3 lastTradeTs fresh
- Bot.log: 9 signals em 6 scans pós-fix (~1.5 signals/scan), todos `weather YES edge=2.0% size=$1.01-$1.24`
- Open positions: 20 (mix antigos crypto pré-pivot + 9 weather frescos hoje)
- PF/WR ainda não calculável (1 LOSS resolved, weather trades hoje ainda PENDING)

## Expectativa Trades/Dia

- 5 unique weather markets/scan, scan a cada 30s = 2880 scans/dia
- ~1-2 signals/scan emitidos como trade, mas markets blacklisted após análise
- 5 unique markets × 1 trade cada × ~3 ciclos de regen mercados/dia = **~15 trades/dia paper**
- Em 15 dias = **~225 trades** — sample size estatisticamente meaningful

## Kill Criterion D+10 (14/Mai)

Se em 14/Mai PF<1.0 (resolved trades), mato o projeto antes:
- Liberar tempo dev pra outras prioridades
- Aceitar sunk cost
- Backtest weather PASS (PF 1.415) era em data 12m. Se prod 10d ≠ backtest 12m, edge não persiste

## Pendências Não Decididas

- Não commitei nada — staged changes precisam @devops push
- ACE Evolver com minEdge=0.08 ainda persiste no estado (data/ace-state.json ou similar). Override no código basta pra runtime, mas se reset ACE, novo seed vem do bug crypto. Limpeza ACE state pode ser necessária (não fiz).
- Telegram countdown só dispara no daily-checkup 14:30 BRT — 1 ping/dia, suficiente.

## Triggers Próxima Sessão

- **"status polymarket"** → puxar heartbeat + journal + PF atual
- **"kill polymarket"** → graceful shutdown + relatório final + cleanup
- **"extend deadline polymarket"** → estender 15d → 30d se sample borderline
- **"commit polymarket"** → @devops empacotar 4 patches + push

## Tasks Sessão (TaskList)

1. ✅ Read auto-trader + polymarket-client to find vertical/discovery touchpoints
2. ✅ Apply weather-only filter + strip tag_id 403 fetches
3. ✅ Restart bot with new config and verify scans + signals
4. ✅ Set up 15-day Telegram countdown + memory snapshot

## Mind Clones Implícitos (não consultei MCP, sintetizei)

- **chip-huyen**: edge proven só em weather, concentre fogo
- **nate-silver**: weather é estruturalmente bom pra prediction (frequente, observável, gov data)
- **domer-polymarket**: weather PM tem markets estreitos mas resolvem rápido — match high turnover
- **aswath-damodaran**: sample size > model perfection. Move fast or fold
- **andrew-ng**: backtest disagrees with live = model in production ≠ model backtested. Get aligned

Convergência: scope collapse weather-only + force backtest config (minEdge=0.02) é caminho único pra honrar dados estatísticos.
