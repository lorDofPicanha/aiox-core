# Auditoria Meta — Clean, Mônaco e Nobus — 2026-07-28

## Resultado

Três campanhas isoladas foram criadas na conta Meta Ads exclusiva da Tocks (`act_1221671265457624`). Todos os objetos foram entregues em `PAUSED`; nenhum gasto foi iniciado.

## Inventário criado

| Modelo | Campaign ID | Adset ID | Ads |
|---|---|---|---|
| Clean | `120253694999830230` | `120253695004620230` | `120253695007410230`, `120253695007550230`, `120253695007680230` |
| Mônaco | `120253694999910230` | `120253695005030230` | `120253695007930230` |
| Nobus | `120253695000270230` | `120253695005560230` | `120253695008350230` |

## Configuração validada

- Campaign objective: `OUTCOME_ENGAGEMENT`.
- Campaign status: `PAUSED`.
- Adset status: `PAUSED`.
- Daily budget: R$ 30,00 por adset.
- Optimization: `CONVERSATIONS`.
- Destination: `WHATSAPP`.
- Billing: `IMPRESSIONS`.
- Bid strategy: `LOWEST_COST_WITHOUT_CAP`.
- Promoted Page: `386367957897981`.
- Idade: 30–65.
- Geo: Espírito Santo, Minas Gerais, Paraná, Rio de Janeiro, Rio Grande do Sul, Santa Catarina e São Paulo.
- Location type: `home`.
- Advantage Audience: desativado.
- Placements: Facebook e Instagram, iguais ao molde C007.

## Criativos Clean

| Ad | Creative ID | Foto | CTA |
|---|---|---|---|
| `[CLN-01] Clean — Modo Jogo` | `1120663133861116` | `15.30.39.jpeg` | `WHATSAPP_MESSAGE` |
| `[CLN-02] Clean — Modo Jantar` | `1537452660698787` | `15.30.36.jpeg` | `WHATSAPP_MESSAGE` |
| `[CLN-03] Clean — Transformação` | `2811950475855764` | `15.30.37 (1).jpeg` | `WHATSAPP_MESSAGE` |

Os três links usam o número Tocks `554730419811` e a mensagem inicial “Ola, quero conhecer a Mesa Clean da Tocks.” Não foram declarados preço, material, medidas, prazo, garantia ou personalização.

## Criativos reutilizados

- Mônaco: creative existente `1119330047002472`.
- Nobus: creative existente `1199418335340725`.
- A campanha antiga mista `120238958044830230` permaneceu `PAUSED` e não foi alterada.

## Estado de revisão

Diagnóstico final às 20:31 BRT:

- Clean Modo Jogo: `PENDING_REVIEW`.
- Clean Modo Jantar: `PENDING_REVIEW`.
- Clean Transformação: `PENDING_REVIEW`.
- Mônaco: `PENDING_REVIEW`.
- Nobus: `PENDING_REVIEW`.

Esses estados são normais imediatamente após a criação e não autorizam ativação.

## Bloqueadores de ativação

1. Saldo disponível exibido pela Meta: `R$0,00 BRL`.
2. Os cinco anúncios ainda precisam sair de revisão sem erro.
3. As campanhas atuais C007 e QUALIDADE estão configuradas como `ACTIVE`; após recarga, elas podem voltar a consumir saldo.
4. O público das três campanhas novas é idêntico; ativar as três simultaneamente cria sobreposição.
5. Falta preview visual e smoke test bidirecional do WhatsApp aprovados pelo founder.

## Recomendação de ativação

Recarregar pelo menos sete dias de runway e ativar uma campanha nova por vez a R$ 30/dia. Antes, decidir se C007 e QUALIDADE continuam ativas. Começar pela Clean, medir CPMsg e qualidade por sete dias e só então testar Mônaco ou Nobus.

## Rollback

O estado atual já é o rollback seguro: todos os objetos novos permanecem pausados. Não excluir objetos; se houver reprovação ou erro de configuração, corrigir em uma nova versão pausada e manter os IDs inválidos documentados.
