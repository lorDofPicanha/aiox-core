---
name: contador-painel-cockpit
description: app/painel/ — cockpit unificado read-only que agrega o sinal-manchete de cada frente do Contador e dá deep-link
metadata:
  type: project
---

`apps/contador/app/painel/` é a PORTA DE ENTRADA (1º item do Nav, label "Painel", icon ◧). Server Component `force-dynamic` que COMPÕE READ-ONLY o sinal-manchete de 6 frentes já construídas e linka cada módulo. Só `page.tsx` + `painel.module.css`; Nav.tsx ganhou 1 linha. NÃO recalcula regra, NÃO escreve, NÃO toca engines/models/packages.

**Como cada manchete/top-item é lido (contratos reusados, sem alterar engine):**
- Auditoria (core): `lib/api` (`getApi`/`ESCRITORIO_ID`) + `lib/fila-model` `carregarFilaPendente` → nº pendentes, R$ em revisão, top da fila (fila já vem ordenada desc; usa `bloqueiaAutoAprovacao`).
- Health S12: `app/saude-carteira/health-score-data` `carregarEntradasHealth(api,esc,refIso)` + `health-score-model` `rankearCarteira`/`resumirHealth` → criticos/atencao/scoreMedio + pior cliente (ranking[0]).
- e-CAC S3/S5: `app/ecac/saude-fiscal-provider` `listarSaudeFiscal(ESCRITORIO_SAUDE_DEMO,refIso)` (devolve `{refIso,mensagens,cnds}`) + `saude-fiscal-model` `triarMensagens`/`resumirTriagem`/`detectarCndsAVencer`/`resumirRenovacao` → prazosNoLimite + cndsVencidas; top = 1ª intimação expirado/no_limite OU 1ª CND vencida.
- Parcelamentos: `parcelamentos-provider` `listarParcelamentos(ESCRITORIO_DEMO,refIso)` + `parcelamentos-model` `classificarCarteira`/`resumirCarteira`/`ehRisco` → emRisco; top = 1º `ehRisco`.
- Transação PAR-7: `transacao-provider` `listarPerfisFiscais(ESCRITORIO_DEMO,refIso)` + `transacao-model` `classificarCarteiraTransacao`/`resumirTransacao`/`ehOportunidade` → fortes+condicionais + ganchoPotencialTotal; top = 1º `ehOportunidade` (ranking por gancho.meio desc).
- Trilha: `@synkra/contador-trilha-verifier` `verificarCadeia` sobre `api.listarEventos` (mesma forma de mapeamento que `app/page.tsx`) → selo íntegra/inconsistente.

**Regras-chave (replicar se estender):**
- ⚠️ NÃO fazer join por-cliente cross-módulo: 3 esquemas de id (core UUID × e-CAC curto × parcelamento/transação `cli-*`). Agregar POR MÓDULO; cada frente traz seu próprio top item. Unificação por CNPJ = follow-up (adapters reais).
- `refIso = new Date().toISOString()` injetado UMA vez pela page e repassado aos engines e-CAC/parcelamentos/transação/health (todos puros, "hoje" por parâmetro).
- Os providers de parcelamentos e transação exportam ambos `ESCRITORIO_DEMO` → importar com alias (`ESCRITORIO_PARCELAMENTOS`/`ESCRITORIO_TRANSACAO`).
- Reusou `Card`/`StatusBadge`/`TopBar` + classes globais (kpi/grid/badge/notice/disclaimer); 4ª/6ª coluna de KPI vai no `.module.css` local (globals só tem grid-2/grid-3). Os badges da lista "revisar primeiro" reaproveitam o StatusView G6-safe do engine de origem.
- Gates passaram: `npm run typecheck`, `npm run banlist:g6` (76 arquivos), `npm run build` (rota `ƒ /painel`), smoke 200 (porta 3008 às vezes ocupada por server stale que dá 404 p/ /painel — subir em 3009 e curl é smoke válido).

Liga [[contador-module-pattern]], [[contador-g6-language]], [[contador-ecac-saude-fiscal]], [[contador-transacao-radar]].
