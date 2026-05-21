---
name: Polymarket Trader Project
description: Sistema autonomo de trading no Polymarket — UltraPlan v2 com LLM-in-the-loop, multi-provider, active learning, 305-doc knowledge base
type: project
originSessionId: 2b910485-fdb5-46a5-b369-f9dc4750622a
---
## Projeto: Polymarket Autonomous Trading System

**Status:** UltraPlan v2 — Fases 0-3 COMPLETAS, Fase 4 (paper trading 30d) PENDENTE
**Local:** `apps/polymarket-trader/`
**UltraPlan v1:** `docs/projects/polymarket-trader/ULTRAPLAN.md` (2026-04-03, superseded)
**UltraPlan v2:** `docs/projects/polymarket-trader/ULTRAPLAN-v2-intelligence-overhaul.md` (2026-04-07)
**Audit:** `docs/projects/polymarket-trader/RESEARCH-INTELLIGENCE-AUDIT-2026-04-07.md`
**Conclave v2:** chip-huyen, aswath-damodaran, andrew-ng, bruce-schneier, guillermo-rauch

## Decisoes v2 (Delta do v1)

| Decisao | v1 | v2 | v2.1 (09/Abr) |
|---------|----|----|---------------|
| Kelly | 15% | 5% | 5% |
| Verticals | 4 | 2 (weather+crypto) | **7 (todas)** — fix: DEFAULT_CONFIG atualizado |
| LLM | N/A | Ollama+vLLM+Claude | **OpenAI gpt-4o-mini** + Knowledge Base 305 docs |
| Strategies | 8 | 2 | **5** (all active for learning) |
| Learning | "Layer 0" mas desconectado | **Experience Store no loop de decisao + auto-lessons** |
| Evaluation | Backtest na Phase 1 | **Evaluation harness PRIMEIRO (Fase 0)** |
| Execution | Taker only | **Maker-first (0% fee quando spread < 3%)** |
| Edge target | 60% win rate | **2-4% net edge, profit factor > 1.2** |

## Multi-Provider LLM

- **Ollama**: qwen2.5:7b (4.7GB), GTX 1660 SUPER 6GB — INSTALADO
- **vLLM**: PolarQuant models do caiovicentino1 (precisa 8GB+ VRAM)
- **Claude API**: Haiku, ~$3-8/dia, fallback pago
- Auto-detect: Ollama → vLLM → Claude → heuristica
- Config: `LLM_PROVIDER`, `OLLAMA_MODEL`, `VLLM_HOST`, `ANTHROPIC_API_KEY`

## Fases

| Fase | Status | Resultado |
|------|--------|-----------|
| 0 Evaluation | COMPLETO | Baseline: 0% WR, -$126, heuristica pior que random |
| 1 Learning | COMPLETO | Experience Store ativo, Deribit vol, Kelly 5% |
| 2 LLM | COMPLETO | Multi-provider analyzer, calibration, budget |
| 3 Execution | COMPLETO | Maker-first, orderbook slippage |
| 4 Paper 30d | **ATIVO** | Bot rodando com OpenAI + 305-doc KB, 7 verticals |
| 5 Live $500 | PENDENTE | Apos Gate PASS |

## Performance Nota

- GTX 1660 SUPER 6GB — Ollama + bot consome quase toda a VRAM

## Knowledge Base Integration (09/Abr/2026)

- **305 docs** carregados em ~200ms, 8.092 keywords, 239k palavras
- **Novo modulo:** `src/intelligence/knowledge-store.ts` — TF-IDF retrieval, zero deps
- **LLM prompt augmentado:** top-5 docs relevantes injetados (~500 tokens)
- **Heuristic Signal 4:** favorite-longshot, anchoring, recency bias por vertical
- **LLM edge: 8.5% → 11.6%** (+36%), LLM trades: 3 → 5 (+67%)
- **307 arquivos** em `D:/jarvis/mega brain/knowledge/prediction-markets/` (8 subdominios)
- **Bug fix:** .env loader movido para index.ts, DEFAULT_CONFIG → 7 verticals

## Bot Antigo Performance (67 trades, pre-KB)
- 64 arbs: $209 profit estimado (81% ROI)
- 3 LLM: $1 profit (8.5% edge)
- Total: ~$210 sobre $285 investido
- Caveat: paper mode, execucao simulada
- PC trava se rodar junto com programas pesados
- **Recomendacao**: fechar outros programas antes, ou rodar em horarios ociosos
- Upgrade para RTX 4060 8GB desbloqueia PolarQuant 9B models

### Training Mode (atualizado 11/Abr/2026)

- **MAX_RESOLUTION_HOURS=72** (mudado de 24 → 72 em 11/Abr)
- 24h era muito restritivo: apenas 6/400 markets elegíveis (1.5%)
- 72h captura sports (Masters, NHL), politics, weather — 55/400 elegíveis (13.8%)
- Markets sem endDate (indefinidos como "before GTA VI") rejeitados em training mode
- Para desativar: setar MAX_RESOLUTION_HOURS=0
- Tag no log: `[TRAINING ≤72h]`
- **Bot roda via:** `node --import tsx/esm src/cli/index.ts bot --start` (de dentro de apps/polymarket-trader/)
- **Node path Windows:** `"C:/Program Files/nodejs/node.exe"`

### Multi-Platform (11/Abr/2026)

**3 fontes de markets agora:**

| Plataforma | Markets/scan | Tipo | Arquivo |
|-----------|-------------|------|---------|
| Polymarket | ~100 | Prediction markets (events) | `src/integrations/polymarket-client.ts` |
| Kalshi | ~50 | Prediction markets (events) | `src/integrations/kalshi-client.ts` (public API, sem auth) |
| **Crypto Synthetic** | **72** | Preço BTC/ETH/SOL (Binance API) | `src/integrations/crypto-price-client.ts` **NOVO** |

**Crypto Synthetic Markets:**
- Busca preço live de BTC, ETH, SOL via Binance public API
- Gera 72 markets sintéticos: 3 coins × 6 price levels × 4 horizontes (4h/12h/24h/48h)
- Resolução automática: compara preço real quando market expira
- Primeiro resultado crypto em **4 horas** (markets de 4h)
- Log: `[PM:92+KA:50+CR:72]`, 87 elegíveis vs 0 antes

**Arquivos criados/modificados:**
- `src/integrations/crypto-price-client.ts` — NOVO: CryptoPriceClient (Binance API + synthetic market generator)
- `src/engine/auto-trader.ts` — Kalshi + Crypto integrados no scan, resolução sintética
- `src/index.ts` — Bootstrap multi-platform

**Scan #1 resultado:** 214 markets, 87 elegíveis, 30 analisados LLM, 16 trades crypto executados (paper)

### Revisao e Fixes (16/Abr/2026)

**Resolucao manual de 268 trades sinteticos expirados:**
- Bot parou (PID 7208 morto), resolver nao rodou, 268 crypto synth expiraram sem fechar
- Resolvidos manualmente com precos live Binance: BTC=$74,905 ETH=$2,346 SOL=$86
- **Resultado: 253 wins / 15 losses (94.4% WR), P&L +$2,099.76 (paper)**
- Maioria NO em "BTC below $71-73k" → BTC subiu, NO ganhou (inflado por direcao unica)

**15 trades problematicos removidos ($252 stake):**
- 4 sem marketQuestion (dados corrompidos)
- 3 memes GTA VI (Jesus return, China/Taiwan, BTC $1M)
- 5 factualmente errados (NO em Barca/Arsenal/Inter/SGA/Haaland — LLM sem dados live)
- 3 com edge > 55% impossivel

**5 fixes aplicados no codigo (16/Abr):**
1. **Edge cap 25%** — `market-analyzer.ts:664` — `Math.min(rawEdge, 0.25)` impede edges irreais
2. **Crypto dedup** — `crypto-price-client.ts:62` — PRICE_OFFSETS de 6→3 levels
3. **Meme blacklist** — `auto-trader.ts:317-321` — filtra "before GTA VI", "Jesus Christ", questions vazias
4. **6 moedas** — `crypto-price-client.ts:52` — adicionado DOGE, AVAX, LINK (volatilidade 5.5-7%)
5. **Horizons 1h/2h** — `crypto-price-client.ts:59` — HORIZONS=[1,2,4,12,24,48] para feedback rapido

**Resolver atualizado:** `auto-trader.ts:201` — symbolMap inclui dogecoin, avalanche, chainlink

### Performance (16/Abr/2026 — trades.db, snapshot pré-refactor P1-P5)

| Metrica | Valor |
|---------|-------|
| Trades resolvidos | 264 |
| Win Rate | 89.0% (235W/29L) |
| P&L Total | +$1,520.60 (paper) |
| ROI | 63.9% |
| Profit Factor | 22.96 |
| Avg Win/Loss | +$6.77 / -$2.39 |
| Periodo | 10-15/Abr (5 dias) |
| Por vertical | Crypto 90% WR (+$1,523) / Sports 0% WR (-$2.79) |

**Caveat:** 100% do lucro e de crypto sintetico (BTC pump $71k→$84k). Nao prova edge sistematico. P1-P5 commits 16/Abr deveriam ter corrigido leak — ver auditoria 27/Abr abaixo.

### Estado atual (27/Abr/2026 — VERIFICADO, bot DOWN)

**Bot DOWN desde 25/Abr 01:39.** Daily budget OpenAI esgotou em 24/Abr 22:43 (loop "skipping"), processo morreu em algum momento até 27/Abr. Auto-start Startup folder não recuperou.

**trades.db: 1,150 total**
- PENDING: 750 (65%)
- WIN: 356, LOSS: 44 → **WR 89%** (mantido pós-refactor — suspeito de leak residual)
- PnL paper: +$2,137
- **432/1,150 (38%) tagged `source:synth`** — discrepa da claim "99% real markets" da sessão 24/Abr
- Verticais: crypto 96% (1,103) / sports 1.7% (20) / politics 1.6% (19) / pop_culture 0.6% (7) / finance 0.1% (1)
- Estratégias: info_arb 954 / cross_platform 196

**open-positions.json: 467 posições abertas**
- 432 últimos 7 dias (21-25/Abr) — Polymarket reais, todas crypto
- **35 stale de 9/Abr** — pré-refactor, mercados em curso (Stanley Cup, World Cup) ou presos a "before GTA VI"
- Exposição paper total: $2,667
- 5 mais novas (25/Abr 01:39) sem `marketQuestion` — formato cross_platform diferente, size=25 (5x média)

### Achados Pendentes de Investigação

1. **WR 89% persistente pós-P1-P5** — auditar 400 resolvidos por timestamp; quantos são pré-16/Abr (artefato) vs pós (real)?
2. **Bias crypto 96%** — apesar de scan ter `[PM:93+KA:50+CR:180]`, trades só caem em crypto. Signal generator favorecendo crypto?
3. **38% synthetic ainda no DB** — claim "99% real markets" foi observação de 4min iniciais, não condizente com universo total.
4. **Daily budget OpenAI sem fallback automático efetivo** — bot trava em loop e morre.

### Portfolio histórico (16/Abr/2026 — snapshot legado)

- 171 posicoes abertas (136 synth 48h + 35 non-synth reais)
- 136 synth expiram em ~9h, resolvem automaticamente
- Bot rodava PID 19056, PAPER_UNLIMITED=true
- Config: 6 coins × 3 offsets × 6 horizons = 108 markets/scan
- Primeiro resultado novo: 1h (antes era 4h)

### Caminho para LIVE

**Go/No-Go Gate — criterios obrigatorios:**
- Paper >= 30 dias (hoje: 6 dias, faltam ~24 → meta: **10/Mai/2026**)
- Trades >= 500 (hoje: 264, com 1h horizons acumula rapido)
- Profit factor >= 1.5 ✅
- EV/trade > $0.50 ✅
- Win rate >= 55% ✅
- Sharpe >= 1.0 (nao calculado ainda)
- Max drawdown <= 20% (nao calculado ainda)

**Para ir live (apos gate PASS):**
1. Criar conta + API key em polymarket.com
2. Depositar USDC na Polygon (min $500)
3. Preencher .env: POLYMARKET_API_KEY, API_SECRET, PRIVATE_KEY, FUNDER_ADDRESS
4. PAPER_UNLIMITED=false, rodar `gate` command
5. Se GO: `bot --start --mode live` (max $50/trade, 25% Kelly)

**Decisao:** Esperar 24 dias restantes de paper (ate ~10/Mai) antes de ir live.

**Why:** Prediction markets (Polymarket/Kalshi) não têm crypto curto prazo. Synthetic markets via Binance preenchem essa lacuna para training.
**How to apply:** Bot roda paper ate 10/Mai. Rodar `gate` periodicamente. Nunca deploy live sem Go/No-Go gate PASS.
