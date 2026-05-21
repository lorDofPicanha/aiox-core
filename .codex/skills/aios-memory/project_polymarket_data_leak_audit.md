---
name: Polymarket Bot Data Leak Audit
description: Auditoria forense 16/Abr/2026 provou que WR 89% e P&L +$1520 são 100% artefato (synthetic crypto bug), não edge real. NÃO RELIGAR sem fixes.
type: project
originSessionId: d307196f-ee05-4eb7-965b-bfddd25ba34b
---
# Polymarket Trader — Data Leak Audit (16/Abr/2026)

**Why:** Bot morto há ~46h com performance suspeita (WR 89%, PF 22.96 em 264 trades). Antes de religar ou ir live, auditoria provou que não há edge real — é artefato de 3 bugs críticos + 2 amplificadores. Crítico NÃO religar sem fixes, senão quando for live perde dinheiro real.

**How to apply:** Se alguém (inclusive eu) sugerir "religar o bot", LEMBRAR deste achado. Exigir os 5 fixes + 100 trades reais Polymarket/Kalshi (não synth) antes de qualquer consideração de live.

## Segmentação do P&L (264 resolved)

| Vertical | N | WR | P&L |
|----------|---|-----|-----|
| **Crypto Synthetic** | 262 | 89.7% | **+$1523.39 (99.8%)** |
| Sports reais | 2 | 0.0% | -$2.79 |
| Polymarket/Kalshi reais | **0** | — | — |

**Zero trades em markets reais resolvidos** → edge em mercados reais = indeterminado.

## Bug Inventory

### BUG-1 CRÍTICO — Information Perfection
- `src/integrations/crypto-price-client.ts:131-201`
- Bot cria synth market com strike -3% do preço Binance spot, entra NO em **mediana 31s depois (p95 102s)**
- Strike nunca foi "preço de mercado real" — é snapshot de 30s atrás
- Em BTC uptrend +18% em 6d, NO em "below -3%" ganha mecanicamente em 4h/12h/24h/48h
- **Bucket far-OTM (123 trades) teve WR 100% = p<10⁻³⁰, estatisticamente impossível**

### BUG-2 — Strike Bias Assimétrico
- `crypto-price-client.ts:65` → `PRICE_OFFSETS = [-3, -0.5, 1.5]`
- 2 strikes abaixo vs 1 acima → 2× mais markets "below" criados
- Combinado com uptrend → 242 NO-below (92.4%) vs 20 YES-above (7.6%)

### BUG-3 — Lookahead Leak no Resolver
- `auto-trader.ts:172-215` `resolveSyntheticPositions()`
- Linha 205: `cryptoClient.getPrice(symbol)` busca preço **atual no cron**, não no `endTime` exato
- Gap entre `endTime` e `resolutionTime` (até 5min) vaza dados do futuro
- Fix: usar Binance `/klines?endTime=X&limit=1`

### BUG-4 — Edge Cap Bypassed
- `market-analyzer.ts:665` tem `Math.min(rawEdge, 0.25)` mas **81/262 trades têm edge > 0.25** (max 0.774)
- `auto-trader.ts:539` heurística cap 0.05 também violado
- Kelly inflado → position sizing excessivo (quando for live = ruína acelerada)

### BUG-5 — Vertical Único (sem diversificação)
- 262/264 são crypto synth, 0 Polymarket, 0 Kalshi reais
- `minEdge` ou blacklist filtrando reais, ou eligible retorna zero
- Performance em mercados reais **indefinida** → não pode provar edge

## Por coin (synth)

| Coin | N | WR |
|------|---|-----|
| BTC | 88 | 100.0% |
| ETH | 92 | 95.7% |
| SOL | 82 | 72.0% (mais volátil = regride à média) |

SOL quebra o padrão confirmando que "edge" sobrevive só enquanto coin não se mexe >3% no horizon.

## Veredito

**Não há edge real. É 100% artefato.** $1520 de +paper = mecânica BTC-up + bias direcional forçado.

## 5 Fixes Obrigatórios Antes de Religar

1. **Desativar synth crypto** — `auto-trader.ts:297-304` comentar `cryptoClient.generateMarkets()` até consertar
2. **Se manter synth:** strike usar preço médio 24h (não spot), balancear PRICE_OFFSETS = [-3,-1.5,-0.5,+0.5,+1.5,+3], remover horizon 4h
3. **Resolver histórico:** usar Binance `/klines?endTime=X&limit=1` no endTime exato
4. **Rodar 14 dias somente Polymarket+Kalshi reais** → meta baseline: 100+ trades resolvidos, WR ≥55%, PF ≥1.3, Sharpe >0.5
5. **Confirmar cap edge aplicado** em todo caminho (synth + LLM + heurística)

## Gate LIVE bloqueado

- ✖ WR 89% inválido (artefato)
- ✖ Trades reais = 0 → sem baseline
- ✖ 5 bugs não corrigidos
- ✖ Sem Sharpe, sem Max DD calculados

**Meta original 10/Mai LIVE é INVIÁVEL** com plano atual. Realista: Jun/Jul após fixes + 30d paper em reais.

## Arquivos

- `D:\AIOS\apps\polymarket-trader\src\integrations\crypto-price-client.ts` (BUG-1, 2, 3)
- `D:\AIOS\apps\polymarket-trader\src\engine\auto-trader.ts:172-215, 297-304, 539` (resolver, pipeline, cap)
- `D:\AIOS\apps\polymarket-trader\src\engine\market-analyzer.ts:665` (LLM cap bypassed)
- `D:\AIOS\apps\polymarket-trader\data\trades.db` (dados auditados)
