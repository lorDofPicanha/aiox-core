---
name: Sessão Polymarket Backtest 28-29/Abr
description: Backtest histórico Phase 1+2 Tier 1 executado autônomo. Phase 0 scoping (Atlas/Analyst), Phase 1 ingest (Dara/Data Engineer 65k markets PM real-only ≤7d), Tier 1 replay heurístico (Dex/Dev). Squad hit org limit no Tier 2. User autorizou orion rodar resto autônomo durante a noite. Crypto re-incluído ao backtest universe pra testar empiricamente. NÃO commitado, bot DOWN.
type: project
originSessionId: session-28abr-polymarket-backtest
---

# Sessão Polymarket Backtest 28-29/Abr/2026

## Trigger
User: "vamos retorna com o nosso bot de polymarket, como ele esta"

## Diagnóstico inicial
Bot DOWN há 4 dias (24/Abr 22:43). bot.pid 24404 stale (PID reciclado pelo OS). Daily budget OpenAI esgotado, processo morreu, NSSM/watchdog do PM-PIVOT-1 nunca foi instalado, heartbeat.json nunca criado. Commit PM-PIVOT-1 (488901b0) local não-pushed.

## Caminho B escolhido: Backtest histórico antes de religar
3 caminhos foram apresentados (A=religar agora, B=backtest, C=stop). User: "b".

## Execução autônoma das 3 fases

### Phase 0 — Scoping (Atlas/Analyst, 5 min)
Output: `docs/projects/polymarket-trader/BACKTEST-1-scoping.md` (402 linhas, 9 seções).
- Endpoints verificados: Polymarket Gamma+CLOB+Subgraph; Kalshi REST; NOAA GHCN
- 6 decisões PENDING USER apresentadas, todas resolvidas (1=skip Kalshi pq governo BR proibiu, 2=major+soccer, 3=fees stress, 4=12m, 5=T-12h, 6=NO-GO em 0 verticais)
- Achados críticos: Polymarket aggregate Brier=0.187 (number to beat), fees PM divergem (KB 0.10% vs story 2%), CLOB price-history 12h granularity floor

### Phase 1 — Data ingest (Dara/Data Engineer, 700s, depois bot autônomo)
- Schema SQLite + 5 ingest scripts (Gamma/CLOB/Kalshi/NOAA/unify)
- DNS-BLOQUEIO descoberto: Vivo Fibra blocka polymarket.com via NXDOMAIN. Fix: undici dispatcher customizado em _lib.ts forçando Cloudflare 1.1.1.1
- Bug Gamma sort: `order=endDate&ascending=false` retorna markets `endDate=2028` (futuro, pausados early) primeiro → script abortava na pg 1. Fix: parar só quando oldest endTs < window start
- Bug Gamma offset: HTTP 422 em offset 250500 (limite duro PM API). Aceito.
- Decisão #1 revisada: SKIP Kalshi (cidadão BR não obtém SSN US), Manifold sem histórico, Betfair pago Aussie/NZ irrelevante

**Resultado Phase 1:**
- 68034 markets ingeridos (12m PM-only)
- Por vertical: finance 48866, weather 15018, sports 3167, politics 954
- 7647 elegíveis para Brier (resolved + outcome + baseline)
- TODOS 4 verticais batem gate N≥100 com folga (politics 4.7×, weather 43×)

### Phase 2 Tier 1 — Replay heurístico (Dex/Dev, $0)
Baseline number-to-beat:
- politics 0.1008, weather 0.1214, sports 0.1728, finance 0.2335

**Tier 1 verdict:**
| Vertical | Signal Brier | Baseline | Verdict |
|---|---|---|---|
| politics | 0.1006 | 0.1008 | FAIL (CI cruza 0) |
| sports | 0.1729 | 0.1728 | FAIL |
| finance | 0.2336 | 0.2335 | FAIL |
| weather | **0.1206** | 0.1214 | **PASS (CI lower 0.0004)** |

**Profit factor (PM 2% stress fees):**
- politics 1.103 (fail gate 1.15), sports 1.008, finance 0.935 LOSER, **weather 1.388 PASS**

**Conclusão Tier 1:** Heurística atual EMPATA com PM mid-price em politics/sports/finance. Edge real = SÓ weather (Domer mind clone tinha previsto isso).

### Tier 2 LLM — BLOQUEADO
Squad hit org monthly limit ao tentar spawnar Tier 2 LLM. Próximo reset ~1/Mai.

### Crypto re-add (autônomo de madrugada — 2 rodadas)

User pediu pra incluir crypto. Sanity check Gamma confirmou ~10k markets crypto ≤7d, ~2.8k volume ≥$10k (top: BTC weekly markets $4M+).

**Round 1 (01h-02h) FALHOU silenciosamente:**
- `vertical-classifier.ts`: crypto re-aceito (return `{vertical: 'crypto'}` em vez de null)
- `schema.sql`: CHECK constraint inclui 'crypto'
- DB migration inline (FK off + CREATE new + INSERT + RENAME) preservando 65034 markets
- Re-rodou gamma+clob+unify+replay+report
- **TIER1-RESULTS.md round 1 NÃO tem crypto** (5760 markets) — bug oculto.

**Bug raiz descoberto:**
- Gamma logs em LOOP: `[ingest-polymarket-gamma] upsert failed for pm:1788807: invalid_enum_value, received: 'crypto'`
- Causa: Zod schema em `_lib.ts:81` validava enum vertical SEM 'crypto'.
- DB schema CHECK aceitava (migration ok), mas Zod barrava antes do INSERT.

**Round 2 (02h+) FIX:**
- `_lib.ts:81`: `vertical: z.enum([..., 'crypto'])`
- Limpei checkpoints, re-disparei pipeline completo bg (gamma → clob → unify → replay → brier → report)
- DB 02h12: crypto = 1742 markets ✅ (vs 0 antes do fix)
- Pipeline final em andamento.

Replay heurístico re-rodado dentro do pipeline final.

## Estado ao final da noite (29/Abr ~01h)

- ✅ Story PM-PIVOT-1: QA CONCERNS, NÃO pushed
- ✅ BACKTEST-1 Phase 0 + Phase 1 + Phase 2 Tier 1: COMPLETO
- ⏳ Crypto re-ingest: rodando em BG, replay queued após
- ❌ Tier 2 LLM: BLOQUEADO (org limit)
- ❌ Nada commitado (Orion espera resultado de manhã)
- ❌ Bot ainda DOWN (4 dias)

## Arquivos importantes (paths absolutos)

- `D:/AIOS/docs/projects/polymarket-trader/BACKTEST-1-scoping.md`
- `D:/AIOS/docs/projects/polymarket-trader/BACKTEST-MORNING-RUNBOOK.md` ← user lê de manhã
- `D:/AIOS/apps/polymarket-trader/data/backtest/INGEST-REPORT.md`
- `D:/AIOS/apps/polymarket-trader/data/backtest/TIER1-RESULTS.md` ← resultado final
- `D:/AIOS/apps/polymarket-trader/data/backtest/historical-markets.db` (~419MB)

## Lições

1. **Squad é melhor que Orion sozinho até bater limit** — depois disso, autonomia precisa breaking de "Always Squads" rule.
2. **DNS-block ISP do BR é silencioso** — `polymarket.com` retorna NXDOMAIN. Fix técnico (undici dispatcher) evita ter que mexer no DNS do Windows.
3. **Polymarket Gamma `order=endDate desc` não significa "mais antigos primeiro"** — tem markets `endDate=2028` (futuros, pausados early). Lógica de paginação precisa parar baseado no OLDEST endTs da página, não em "page fully out of window".
4. **Gamma offset cap em 250500** — depois disso HTTP 422. PM provavelmente tem 250k+ markets total.
5. **Heurística atual EMPATA com PM mid-price em 3/4 verticais** — confirma que mercado de prediction é eficiente. Edge real precisa fonte informacional (LLM + KB ainda a testar via Tier 2).
6. **Damodaran-aligned sanity check** = computar Brier baseline ANTES de gastar $$ em LLM. Salvou nos de meses de paper trading sem edge real.
