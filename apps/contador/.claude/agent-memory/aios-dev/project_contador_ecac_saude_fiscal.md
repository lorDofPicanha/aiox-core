---
name: contador-ecac-saude-fiscal
description: e-CAC saúde-fiscal slice (S3 triagem caixa postal + S5 renovação CND) — engines puros, provider, feed; mirror of parcelamentos/ pattern
metadata:
  type: project
---

A frente e-CAC do Contador (app/ecac/, add-on premium D9, separado do core) ganhou uma camada PROATIVA espelhando o gabarito `app/parcelamentos/`.

**Estrutura (fatia [build], sem adapter real — gate do founder):**
- `saude-fiscal-model.ts` — engines PUROS: `triarMensagens` (S3, caixa postal → crítico/atenção/informativo, detecta marca "!" Receita + prazo de intimação) e `detectarCndsAVencer` (S5, fila de renovação CND priorizada vencida>a-vencer). "Hoje" sempre por parâmetro (`refIso`), zero Date.now()/rede.
- `saude-fiscal-provider.ts` — `MockSaudeFiscalProvider` + interface `SaudeFiscalProvider`. Dialeto SERPRO/Infosimples isolado aqui (FF-1).
- `saude-fiscal-data.ts` — seed sintético ancorado em refIso, reusa os 3 clientes de `CARTEIRA_ECAC` (ecac-model.ts).
- `AlertasSaudeFiscal.tsx` — feed (espelha AlertasRescisao.tsx), plugado no topo de `ecac/page.tsx` (page virou async + force-dynamic).
- `saude-fiscal-model.test.mjs` — 46 asserções, runner sem framework.

**Decisão de modelagem chave (D9):** o evento de trilha de S5 (`SugestaoSaudeFiscal`, tipo `renovacao_cnd_sugerida`) é **dado PURO**, NÃO acoplado ao `registrarAnalise` do core. e-CAC é produto/bolso separado — misturar trilha da NOTA (core) com trilha da SITUAÇÃO FISCAL (add-on) violaria D9. TODO de wiring real = trilha própria do add-on.

**Gotcha de teste (Node 24):** testes do app rodam `.mjs` que importam `.ts` direto via type-stripping nativo do Node ≥24 (`import { x } from "./model.ts"`) — sem tsx/ts-node. Funciona porque engines só usam `import type` para os shared (@/lib/status), que é stripado em runtime. Ver [[contador-module-pattern]].

**Gotcha de build/ESLint:** `eslint.config.js` do app só dava `no-undef: off` para `**/*.ts(x)`. Arquivos `.mjs` caíam no `js.configs.recommended` sem globals Node → build falhava com `'console'/'process' is not defined`. Adicionado bloco `files: ['**/*.mjs']` com globals Node. Banlist G6 também varre `.mjs` em app/ — testes precisam ser G6-safe.
