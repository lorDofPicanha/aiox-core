---
name: Sessão Polymarket Pivot Real-Only 27/Abr
description: Auditoria completa do bot revelou 95.5% trades synthetic (placebo). User pivotou pra mercados reais Polymarket+Kalshi ≤7d (regra capital-travado=morto). 8 agentes (5 análise + conclave 3 mind clones). @dev implementou PM-PIVOT-1: delete synth, MarketSelector puro, NSSM+heartbeat+budget cap. Story Ready for QA, bot NÃO religado.
type: project
originSessionId: session-27abr-polymarket-pivot
---

# Sessão Polymarket Pivot Real-Only — 27/Abr/2026

## Trigger
User: "como esta meu bot de polymarket"

## Descoberta (auditoria DB real, sem fé na memory)

**Memory antiga dizia:** "🟢 24/Abr 20h06 RELIGADO, PID 24404 ATIVO, 99% real markets" — **TUDO FALSO**:

1. **Bot DOWN há 3 dias.** PID 24404 hoje é o MCP memory server (PID reciclado). bot.pid stale.
2. **Daily budget OpenAI esgotou 24/Abr 22:43**, processo morreu até 25/Abr 01:39. Auto-start Startup folder NÃO recupera crash mid-session (só dispara em logon).
3. **trades.db: 1.150 trades total**, 750 PENDING, 400 resolved (WR 89%).
4. **95.5% dos 1.150 trades são SYNTHETIC** (`synth-bitcoin-below-X-Yh-...`). Bot inventa "Will BTC < $X em 24h", resolve com Binance — **placebo, sem counterparty real**.
5. **4.5% (52 trades)** em mercados reais Polymarket — todos pré-refactor (9-15/Abr). Pós-religar 24/Abr: ZERO reais executados.
6. **WR 89% pré-refactor** = viés direcional do BTC pump 71→84k em 5 dias, NÃO skill.
7. **Pós-refactor 0 trades resolvidos** — bot morreu antes de resolver. Logo "WR persistente pós-P1-P5" não tinha dado pra afirmar.

## Causa-raiz do bias 100% synth pós-religar

- `auto-trader.ts:362-381` faz balance 30/70 ✅
- `auto-trader.ts:384-391` sort "short-term first ≤14d" → synth (12-48h) sempre vence reais (60d+)
- `market-analyzer.ts:309-323` re-sorta + slice top-30 → LLM batch = 100% synth
- Sort duplicado em 2 lugares (bug oculto pior)

## Regra do User (clarificada na sessão)

> "Esforço ≤ ganho POR TRADE. Capital travado 4 meses = capital morto. Velocidade de capital > absolute return."

**Implicações:**
- Synth crypto: resolução 12-48h ✅, mas zero edge real ❌ (placebo)
- Polymarket "World Cup 2026" (75d), "Stanley Cup" (60d), "Trump out before GTA VI" (eterno) → ❌ capital trava demais
- Filtro correto: source ∈ {polymarket, kalshi} + endDate set + `now < endDate ≤ 7d` + liquidity threshold

## Conclave (8 agentes, 2 fases)

### Fase 1 — Análise multi-perspectiva (5 paralelos)
- **Aria** (architect): GO-AJUSTE, fix em preFilter+auto-trader (centralize). Esforço S, ganho L.
- **Quinn** (QA): GO-COM-TESTES, re-sort em market-analyzer.ts é bug oculto. 0 coverage de market selection.
- **Alex** (analyst): PIVOT — arb cross-platform PM↔Kalshi (1-3d, 70% código pronto, $50-200/mês paper) + weather diário (NOAA, edge documentado).
- **Damodaran** (ROI): ABANDONAR. EV 90d: A=-$115 / B=-$165 / C=+$4.6k (foco Tocks/Bretda) / D=-$520. Sunk cost fallacy + "1 mais fix resolve" = padrão de infinite-loop debugging.
- **Domer** (PM trader): PIVOT — weather-only (NOAA grátis, retail aposta por feeling, 8-15%/mês paper) + sports nicho (NCAA "least efficient"). Mata synth crypto e short-horizon (Polymarket fee dinâmica 3.15% mata latency arb).

### Fase 2 — Conclave dos 3 (chip-huyen + andrew-ng + guillermo-rauch)
- **Rauch (winner em arquitetura):** "Synth não é bug de balanceamento, é bug de EXISTÊNCIA. Delete cryptoClient inteiro. -200 LOC, +20 linhas teste. The best code is no code."
- **Ng:** "Get the data right first. Supervisor inegociável (NSSM Windows Service + heartbeat watchdog + OpenAI budget cap) ANTES de pivot. Backtest histórico Brier vs market baseline antes de paper. Se Brier ≥ baseline, ABORTAR pivot — Damodaran tava certo."
- **Chip Huyen:** "Production é onde a verdade vive. Não substitua placebo por placebo. 4 não-negociáveis: fill model com book real, NOAA climatology baseline, fill-rate tracking arb, shuffle test. Gate: N ≥ 100 trades por vertical (weather E arb separados), Brier <0.22, profit factor ≥1.15, bootstrap 95% CI."

## Decisão do User: SEGUIR pivot real-only ≤7d

User: "eu quero seguir, quando falo o esforço e ganho e em relação as trades, não adinta eu esperar 4 meses por uma unica trade"
User: "faça como achar melhor, so lembre de usar os squads completos e os clones"

## Implementação (Story PM-PIVOT-1, executada autônoma)

**Story:** `D:/AIOS/docs/stories/PM-PIVOT-1-real-only-7d.md` (Status: Ready for QA)

### Fase 0 (entregue) — Supervisor + Heartbeat + Budget Cap
- `data/heartbeat.json` reescrito a cada scan
- `scripts/watchdog.ps1` — PowerShell, lê heartbeat, dispara Telegram se stale >10min
- `scripts/install-watchdog-task.bat` — Windows Task Scheduler 5min
- `scripts/install-nssm-service.bat` + `playbooks/nssm-install.md` — NSSM Windows Service (substitui Startup folder)
- `OpenAIBudgetTracker` em `market-analyzer.ts` — track dailySpend, persistido `data/llm-budget.json`, pause LLM se atinge `OPENAI_DAILY_BUDGET_USD=5`, fallback heurística

### Fase 1 (entregue) — Delete synth + simplification
- `src/integrations/crypto-price-client.ts` DELETED (-314 LOC)
- `src/index.ts`: removidos import + bootstrap CryptoPriceClient
- `src/engine/auto-trader.ts`: removidos cryptoClient field/getter/fetch, balance 30/70 block, sort short-term, synthWeight config, resolveSyntheticPositions
- `src/engine/market-selector.ts` NOVO (~80 LOC com types) — `selectMarkets(markets, {maxResolutionHours, minLiquidity, batchLimit})` puro: filter (source PM/KA + endDate set + ≤max + liquidity ≥ min) → sort (volume*liquidity DESC) → slice
- `market-analyzer.ts::preFilter()` delega para selectMarkets
- `.env`: MAX_RESOLUTION_HOURS=168 (7d), LLM_BATCH_SIZE=5, OPENAI_DAILY_BUDGET_USD=5. Removido: SYNTH_WEIGHT
- CLI `pm-trader cleanup-stale [--yes]`: lista stale (synth-* OR >7d), backup, remove

### Tests (Quinn entregou, @dev consumiu)
- `tests/market-selector.test.ts` — 14 cenários (story pediu 5)
- `tests/budget-cap.test.ts` — 12 cenários (story pediu 3)
- `tests/paper-review-source-filter.test.ts` — extraído (preserva realOnly winRate)
- `tests/crypto-price-client.test.ts` REMOVIDO

### Quality Gates
- `tsc --noEmit` → 0 erros
- `npm test` → 924/928 passing (4 falhas pré-existentes em cross-platform-arb não-relacionadas)
- `lint` → 0 NEW erros (baseline ~511 erros no-undef pré-existentes em todo o repo)

### Net LOC
- Production: ~-200 LOC (alinhado com Rauch's prediction)
- Tests: +431 LOC

## Risk Profile (Quinn) — para validação final QA round

1. **paper-review winRate contaminado por synth legacy** (L/M) — verificar filter
2. **OpenAIBudgetTracker JSON write não-atômico** (M/L) — write-temp-then-rename
3. **Heartbeat fresh ilusório** (M/L) — escrito DEPOIS do scan, não antes

QA final review pendente.

## Próximas Fases (FORA escopo PM-PIVOT-1)

- **Fase 2:** Backtest histórico 6 meses Polymarket subgraph + Kalshi REST + NOAA GHCN. Brier score vs market baseline. Stop-loss da decisão.
- **Fase 3:** Paper trading 30d com fill model real (book ± 1tick durante TTL 60s) + fees realistas (PM 2% taker + KA 1% + spread).
- **Fase 4:** Gate Go/No-Go (≥100 trades/vertical, Brier <0.22, PF ≥1.15, bootstrap 95% CI, calibration ±5pp).
- **Fase 5:** LIVE com $500 USDC Polygon + Kelly fracionário 0.25x.

## Estado Final

- ✅ Story PM-PIVOT-1 Ready for QA, todas tasks `[x]`
- ✅ Memory atualizada
- ❌ Bot NÃO religado (constraint do user)
- ❌ Não commitado (orion fará commit final após QA pass)
- ⏳ Aguardando: QA final round + decisão do user (religar agora ou avançar Fase 2 backtest primeiro)

## Lições

1. **Memory pode mentir** — sempre cruzar com DB real antes de afirmar estado.
2. **PIDs são reciclados pelo OS** — bot.pid não é fonte da verdade, sempre verificar command line.
3. **Synthetic markets não ensinam nada** — sem counterparty real, edge é fictício, WR é viés de regime.
4. **Velocidade de capital > absolute return** — capital travado 4 meses é morto mesmo se trade for excelente.
5. **Sort cego à origem destrói split** — fix de balance era cosmético, root cause era a EXISTÊNCIA do synth.
6. **Conclave de 3 perspectivas distintas (Rauch simplicidade, Ng MLOps, Chip evaluation) > conclave de 5 do mesmo viés.**
