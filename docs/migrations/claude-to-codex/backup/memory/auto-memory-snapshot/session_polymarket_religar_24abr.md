---
name: Sessão Polymarket Religar+Crash 24-25/Abr (atualizado 27/Abr)
description: Bot religado 24/Abr 20h06, rodou ~5h até daily budget OpenAI esgotar, processo morreu. Em 27/Abr verificado DOWN — auto-start Startup folder não recuperou crash. bot.pid 24404 stale (PID reciclado pelo OS).
type: project
originSessionId: 2e314f6f-f432-4035-bdb5-01281a2dad56
---
# Sessão Polymarket Religar — 24/Abr/2026 + Auditoria 27/Abr

## ATUALIZAÇÃO 27/Abr (truth-check)

**Bot está DOWN, não ativo.**

Verificação 27/Abr 18h50 BRT:
- `bot.pid` = 24404, mas PID 24404 hoje é o **MCP memory server** (`@modelcontextprotocol/server-memory`), não o bot. PID foi reciclado pelo OS.
- `bot.log` última linha: 24/Abr 22:43 BRT — sequência de "[MarketAnalyzer] Daily budget exhausted — skipping" em loop até parar.
- `trades.db` última escrita: 25/Abr 01:39 BRT (algumas horas além do log)
- `open-positions.json` última escrita: 25/Abr 01:39 BRT
- Nenhum processo node ativo rodando o bot.

**Linha do tempo real:**
1. 24/Abr 20:06 — religado ok
2. 24/Abr 22:43 — daily budget OpenAI esgotou, log mostra skipping em loop
3. 25/Abr 01:39 — última escrita em trades.db / open-positions.json
4. Entre 25/Abr 01:39 e 27/Abr — processo morreu silenciosamente
5. **Auto-start Startup folder NÃO recuperou** — só dispara em logon, não em crash mid-session

## User Intent (24/Abr)
- "como esta meu bot do polymarkte" → status (bot morto havia 9d na época)
- Escolheu religar paper-only

## Status Inicial (24/Abr)
Bot morto 15/Abr 01:11. Refactor P1-P5 (commits 16/Abr) nunca religou. 9 dias parado.

## Bloqueador Resolvido: DNS Vivo Fibra
Router `menuvivofibra.br` NXDOMAIN para `gamma-api.polymarket.com` e `api.elections.kalshi.com`.

**Fix em 2 iterações:**
- Tentativa 1 (falhou): `dns.setServers(['1.1.1.1','8.8.8.8'])` — Windows ignora para `dns.lookup` (usado pelo undici).
- **Tentativa 2 (funcionou):** undici global dispatcher com `connect.lookup` customizado usando `dns.resolve4`.

**Arquivo:** `apps/polymarket-trader/src/dns-override.ts`
- `dns.setServers(['1.1.1.1', '8.8.8.8', '1.0.0.1', '8.8.4.4'])`
- `setGlobalDispatcher(new Agent({ connect: { lookup: customLookup } }))`
- customLookup: try `dns.resolve4` first, fallback `dns.lookup`
- Disable: `DNS_OVERRIDE=0`

**Importado PRIMEIRO em 4 entry points:** `src/index.ts`, `src/cli/index.ts`, `src/scripts/scan-once.ts`, `src/scripts/execute-trade.ts`.

## Performance Inicial (24/Abr 20:06-20:10, 4min de uptime — DESATUALIZADA)

Antes do crash, 4min iniciais haviam mostrado:
- 11 scan cycles, 330 markets/scan (PM:100 + KA:50 + CR:180)
- 50 eligible/scan, R:49/S:1
- 120 LLM analyses
- 843 trades em 4min (daquele momento — number questionable em retrospecto)

**Caveat 27/Abr:** alegação "99% real markets" da memory original NÃO bate com trades.db atual. Ver project_polymarket_trader.md.

## Arquivos Criados/Modificados (24/Abr)

| Path | Tipo | Descrição |
|------|------|-----------|
| `src/dns-override.ts` | NEW | DNS fix undici |
| `src/index.ts` | MOD | import dns-override first |
| `src/cli/index.ts` | MOD | import dns-override first |
| `src/scripts/scan-once.ts` | MOD | import dns-override first |
| `src/scripts/execute-trade.ts` | MOD | import dns-override first |
| `scripts/start-bot.bat` | NEW | Windows restart launcher |
| `scripts/test-dns.ts` | NEW | DNS validation helper |
| `%APPDATA%\Startup\PolymarketBot.bat` | NEW | Auto-start no logon (NÃO recupera crash mid-session) |

## Lições Aprendidas (atualizadas 27/Abr)

1. **DNS Vivo Fibra pode bloquear domínios** — workaround undici override é preferível a mudar DNS sistema.
2. **Windows ignora dns.setServers para fetch** — precisa do global dispatcher.
3. **schtasks bloqueado em PS restrito** — fallback Startup folder funciona sem admin, **MAS só dispara em logon, não recupera crash mid-session**.
4. **Daily budget OpenAI é single point of failure** — sem fallback de orçamento, bot trava em loop "skipping" e eventualmente morre. Precisa de:
   - Alerta/notify quando budget chegar a X% (não há)
   - Fallback 100% heurística automático com flag (parece estar implementado mas não previne morte)
   - Monitor processo + auto-restart (não há — bot.pid stale)
5. **bot.pid não é fonte da verdade** — verifica sempre process command line antes de inferir estado.

## Para próximo religar (não fazer agora)

Usuário pediu 27/Abr para NÃO religar agora. Antes de religar:
1. Validar daily budget OpenAI (qual é, quanto sobrou no mês)
2. Investigar 89% WR persistente (auditar resolved trades por timestamp pré/pós refactor 16/Abr)
3. Investigar bias crypto 96% (dos 1,150 trades em DB, apenas 47 são não-crypto)
4. Decidir destino das 35 posições stale de 9/Abr
5. Considerar wrapper systemd-like que faça restart em crash (não só logon)

## Commands para diagnóstico

```bash
# Status real (não confia em bot.pid):
tasklist | grep node  # ver se algum processo é o bot

# Tail log:
tail -50 apps/polymarket-trader/data/bot.log

# Estado portfolio (paper):
cd D:/AIOS/apps/polymarket-trader && npx tsx src/cli/index.ts status

# Religar (quando autorizado):
scripts/start-bot.bat
```
