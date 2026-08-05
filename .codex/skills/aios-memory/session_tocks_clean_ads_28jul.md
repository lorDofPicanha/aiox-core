# Tocks — campanhas Clean, Mônaco e Nobus — 28/Jul/2026

## Estado persistido

Em 28/Jul/2026, o founder pediu uma campanha nova para a Mesa Clean usando oito fotos reais e campanhas para Mônaco e Nobus.

O traffic-masters-chief recomendou três campanhas isoladas, um adset por campanha, orçamento preparado de R$30/dia e ativação sequencial para evitar sobreposição.

## Objetos Meta criados

Conta exclusiva Tocks: `act_1221671265457624`.

| Modelo | Campaign ID | Adset ID | Ads |
|---|---|---|---|
| Clean | `120253694999830230` | `120253695004620230` | `120253695007410230`, `120253695007550230`, `120253695007680230` |
| Mônaco | `120253694999910230` | `120253695005030230` | `120253695007930230` |
| Nobus | `120253695000270230` | `120253695005560230` | `120253695008350230` |

Todos foram criados em `PAUSED`. Estado final dos cinco anúncios: `PENDING_REVIEW`.

## Configuração

- Objective: `OUTCOME_ENGAGEMENT`.
- Optimization: `CONVERSATIONS`.
- Destination: `WHATSAPP`.
- Budget: R$30/dia por adset.
- Público: 30–65.
- Geo: ES, MG, PR, RJ, RS, SC e SP.
- Location type: `home`.
- Página: `386367957897981`.
- WhatsApp: `554730419811`.

## Criativos

- Clean: três fotos reais — hero preto `15.30.39`, modo jantar `15.30.36` e transformação `15.30.37 (1)`.
- Mônaco: creative reutilizado `1119330047002472`.
- Nobus: creative reutilizado `1199418335340725`.
- Campanha antiga mista `120238958044830230` permaneceu pausada e inalterada.

## Gates e risco

- Saldo Meta real no encerramento: `R$0,00 BRL`.
- C007 e QUALIDADE continuam configuradas como `ACTIVE`; após recarga podem voltar a gastar.
- Não ativar as três campanhas novas simultaneamente: público idêntico gera sobreposição.
- Ativar uma por vez após aprovação da Meta, recarga para sete dias, preview visual e smoke test bidirecional do WhatsApp.
- Começar pela Clean e medir CPMsg + qualidade por sete dias antes de Mônaco/Nobus.

## Artefatos

- Story: `docs/stories/tocks/TOCKS-META-CLEAN-MONACO-NOBUS-2026-07-28.md`.
- Auditoria: `docs/projects/tocks/audits/meta-clean-monaco-nobus-2026-07-28.md`.
- Oito fotos preservadas: `docs/projects/tocks/assets/clean/2026-07-27/`.

## Triggers

- `audit clean meta`
- `saldo tocks recarregado`
- `ative clean`
- `teste monaco`
- `teste nobus`

