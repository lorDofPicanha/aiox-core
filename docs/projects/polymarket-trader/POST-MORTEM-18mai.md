# Polymarket Trader — Post-Mortem & Kill Decision

**Data:** 2026-05-18
**Decisor:** Breno
**Estado final:** KILLED (scheduled tasks disabled, bot dead, data archived)
**Duração do projeto:** ~6 semanas (início real ~10/Mar/2026 → final 18/Mai/2026)
**P&L papel total:** -$25,88 acumulado (5W 11L em 16 resolved desde pivot, +1L $-10,25 pré-pivot)

---

## TL;DR

Bot rodou 6 semanas, gerou 1.195 paper trades, **zero** trades resolvidos no vertical-alvo (weather) e perdeu dinheiro em crypto ARB que não devia estar executando. A tese estrutural (edge em weather markets) **nunca foi testada em produção** por causa de um bug de bypass do filtro de vertical. Decisão: matar, extrair lições, reciclar padrões de infra (watchdog, heartbeat, kill criteria) para outros projetos.

---

## Linha do tempo das decisões

| Data | Evento | Mind clones consultados |
|---|---|---|
| 27/Abr | Pivot PM-PIVOT-1 (Conclave) | (varios) |
| 28/Abr | Backtest Tier 1/2 — só weather PASS | nate-silver, chip-huyen |
| 02-03/Mai | Primeiros trades em paper-mode (crypto) | — |
| 04/Mai | Pivot weather-only — config `enabledVerticals:['weather']`, LLM disabled, heurística-only | chip-huyen, andrew-ng |
| 04-14/Mai | Operação degradada — 6 dias de gaps no journal | — |
| 15/Mai (D+11) | Triagem: OOM, watchdog cego, 0W weather. User escolhe Extend D+30 ao invés de kill | chip-huyen, andrew-ng, aswath-damodaran, nate-silver |
| 15/Mai 22:02 | Fixes aplicados: watchdog auto-restart + node heap 2GB | — |
| 18/Mai (D+14) | Audit revela bot dead, watchdog silencioso 3 dias, 100% trades crypto, PF<0.6. Mid-verdict threshold atingido com folga 6 dias antes do scheduled | (sessão atual) |
| 18/Mai | **KILL** | — |

---

## Causas raiz (3 bugs estruturais inter-relacionados)

### Bug 1 — ARB strategy bypassa filtro de vertical

**Local:** `apps/polymarket-trader/src/strategies/cross-platform-arb.ts:404-405`

```typescript
eventBus.emit('signal:detected', buySignal);
eventBus.emit('signal:detected', sellSignal);
```

A estratégia emite signals direto no eventBus, **contornando** o filtro `enabledVerticals` em `auto-trader.ts:275`:

```typescript
if (!this.config.enabledVerticals.includes(m.vertical)) return false;
```

O filtro só protege o caminho heurístico/LLM. ARB roda em `auto-trader.ts:303-308` mas usa `this.arbStrategy.scanForArbitrage(eligible)` que já foi pré-filtrado — porém `toSignals()` emite via eventBus, e o `paperTrader` ouve esse evento sem checar `vertical` contra config.

**Consequência:** 29/29 trades desde o pivot foram `cross_platform|crypto`. Zero weather. A configuração `verticals:["weather"]` foi cosmética por 14 dias.

### Bug 2 — Watchdog auto-restart silenciosamente quebrado

**Local:** `apps/polymarket-trader/scripts/watchdog.ps1`

Scheduled task `PolymarketBotWatchdog` ficou em estado `Ready` com `LastRunTime` atualizando a cada 5 min, **mas log silente desde 15/Mai 21:35** (3 dias). Possíveis causas:
- `Start-Process` falha silenciosamente (sem `-PassThru` ou error capture)
- Log path quebrado no script
- `start-bot.bat` retorna erro mas não é capturado

Bot ficou DEAD ≥40 min sem restart antes do kill manual. O "fix" aplicado em 15/Mai 22:02 não foi testado end-to-end.

### Bug 3 — Daily-checkup falhando silenciosamente

Task `PolymarketDailyCheckup` retornava `LastTaskResult = 2147946720` (`0x80070520 = ERROR_NO_SUCH_LOGON_SESSION`) — falha pra abrir sessão interativa. Resultado: journal com 6 dias de gaps (06, 07, 09, 10, 13, 14/Mai).

### Bug 4 (descoberto post-mortem) — Sizing weather inviável

Mesmo sem os bugs acima, signals weather observados em log (`bot.log`):
```
Signal #65: weather YES edge=2.0% size=$1.03
```

Edge 2% × size $1 = EV $0,02 por trade. Mesmo PF 1.415 do backtest não justifica execução — payoff abaixo do ruído. Os 15 signals weather do período provavelmente foram bloqueados por `MIN_CONFIDENCE` ou `adaptiveVolume.shouldTrade()` → nunca viraram trade.

---

## Distribuição final de trades (all-time 1.195 trades)

| Vertical | Trades | % |
|---|---|---|
| crypto | 1.148 | 96,1% |
| sports | 20 | 1,7% |
| politics | 19 | 1,6% |
| pop_culture | 7 | 0,6% |
| finance | 1 | 0,1% |
| **weather (vertical-alvo)** | **0** | **0%** |

---

## Lições estruturais (5)

1. **Filtros de scope devem ser validados ponto-a-ponto, não confiados por config.** O `enabledVerticals` virou placebo — config dizia "weather", execução era 100% crypto. Lição: integration test por vertical antes de validar pivot. **Princípio reusável:** "Config sem teste é cosplay."

2. **Monitoring frágil mata projeto antes do produto.** Watchdog, daily-checkup e heartbeat falharam silenciosamente em sequência. Bot esteve dead 40+ min em uma janela de 14 dias de avaliação crítica. **Princípio reusável:** "Monitoramento que falha silencioso é pior que ausência de monitoramento" — exige dead-man-switch externo ao próprio bot.

3. **Backtest PF não autoriza execução se sizing é ruído.** PF 1.415 em backtest viraria $0,30 em 15 signals weather de $1 size. Backtests devem reportar EV absoluto esperado por janela, não só PF. **Princípio reusável:** "PF é métrica relativa; sample size × edge × size é EV absoluto — o que realmente importa."

4. **Extensão de prazo sem fix de root cause = throwing time at problem.** 15/Mai extendeu D+15→D+30 sem fixar Bug 1 (ARB drift). Resultado: mais 3 dias do mesmo erro. **Princípio reusável:** "Extend só faz sentido se root cause foi atacada — senão é confirmation bias."

5. **Mind clones convergiram CONTRA extend.** Em 15/Mai, chip-huyen ("structural problem"), andrew-ng ("scope-collapse rigor"), aswath-damodaran ("sample size matters"), nate-silver ("weather still good"). 3 contra, 1 a favor — user escolheu o lado do nate-silver. **Princípio reusável:** "Quando 75% do conclave aponta para mesmo gap estrutural, esse gap é o sinal — não o ruído."

---

## O que está sendo aproveitado (extracted value)

Documento separado: `docs/learnings/reusable-patterns-from-polymarket.md`

Resumo:
- **Watchdog pattern (corrigido)** — pode servir Anipis, CRM, qualquer bot 24/7
- **Heartbeat schema** — `heartbeat.json` simples mas eficaz quando monitorado externamente
- **Kill criteria framework** — PF threshold + sample size + janela temporal, reusável para validação de qualquer produto/feature/strategy
- **Conclave protocol** — pattern de consultar N mind clones com pesos divergentes antes de extend/kill
- **Data archival pattern** — `archive-{date}/data-snapshot/` com trades.db + open-positions + journal + heartbeat + 500 linhas finais de log

---

## Decisão final + estado do sistema

- ✅ `PolymarketBotWatchdog` — **Disabled** (XML em `archive-18mai/`)
- ✅ `PolymarketDailyCheckup` — **Disabled** (XML em `archive-18mai/`)
- ✅ Bot process — já estava DEAD (PID 9560)
- ✅ Data snapshot — `archive-18mai/data-snapshot/` (1,3MB git-friendly)
- ✅ Source code — preservado em `apps/polymarket-trader/` (sem `git rm`, pode ressuscitar)
- ❌ NÃO commitado/empacotado os 4 patches 04/Mai + 2 patches 15/Mai (weather filter, enabledVerticals, hasActiveLLM, ACE override, watchdog auto-restart, heap 2GB) — ficam staged mas não pushed

**Custo total estimado do projeto:** 6 semanas × ~6h/sem = ~36h trabalho dedicado. Pode ser amortizado parcialmente via patterns extraídos.

---

## Triggers ressuscitação (se Breno mudar de ideia)

- `revive polymarket` — habilita scheduled tasks, restart bot
- `polymarket weather-only fix bug-1` — fix ARB bypass via filtro no `cross-platform-arb.ts:scanForArbitrage` antes do eventBus emit
- `polymarket sizing redesign` — força minimum size $25 + minimum edge 5% antes de qualquer execução

**Recomendação Orion:** se ressuscitar, fazer só após fix do Bug 1 + escrever test E2E confirmando que `verticals:["weather"]` resulta em 100% weather trades em 24h de sample. Senão é repetir o mesmo loop.

---

*— Orion, orquestrando o sistema 🎯*
