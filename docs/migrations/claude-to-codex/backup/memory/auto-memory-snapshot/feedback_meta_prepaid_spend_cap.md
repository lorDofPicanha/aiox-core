---
name: Meta API Saldo Conta Pré-Paga BR — 2 Campos Confusos
description: Saldo real prepago é `funding_source_details.display_string`, NÃO `balance`. Confundir os 2 leva a falso diagnóstico de "throttling por cap".
type: feedback
originSessionId: c8595901-4335-43dc-83cd-b238e5d68c59
---

Meta API retorna 2 campos com nomes parecidos em conta pré-paga BR:

- `balance` (no overview) = **limiar de cobrança residual**, geralmente baixo (R$28 típico). NÃO é saldo real disponível.
- `funding_source_details.display_string` = **saldo prepago real** (o que UI Ads Manager mostra em "Faturamento → Saldo disponível"). Ex: R$ 635,45.

Também: `spend_cap` em conta pré-paga BR **NÃO é editável** — nem via API (`error 1487840`) nem via UI Ads Manager (Meta bloqueia mudança em accounts prepaid BR). E **não importa**: em prepago, quem limita gasto é o **saldo em conta**, não o cap. Cap é métrica interna Meta, inerte pro operador. Confirmado pelo user 04/Mai 2026: "trabalho com saldo em conta, isso não faz diferença, mesmo se quisesse não consigo alterar".

**Why:** descoberta 01/Mai 2026 conta Bretda `act_381618241134624`. Diagnóstico inicial leu `balance: R$28` + `amount_spent/spend_cap = 98%` e concluiu "throttling crítico, PIX urgente". User questionou "fiz recarga R$1k quarta, por que tão alto?". Investigação revelou que saldo real era R$635, ratio 98% era lifetime spend (~R$29k acumulados desde criação da conta) vs lifetime cap (~R$30k). Throttling não existia — era pacing normal de manhã + learning phase volatility.

**How to apply:**
- SEMPRE pull `funding_source_details.display_string` quando avaliar saldo prepago BR
- NÃO usar `balance` cru como saldo disponível — é métrica de billing threshold
- NÃO usar ratio `amount_spent/spend_cap` como pacing — esses são lifetime, não daily
- Para pacing real, calcular `daily_spend / daily_budget` ou comparar últimos N dias
- Para runway, usar `funding_source_details.display_string / avg_daily_spend`
- Cap de CAMPANHA (`campaign.spend_cap`) é editável via API mas raramente é o bottleneck — inerte na maioria dos casos
- **NUNCA alertar user pra "subir spend cap account" em prepago BR** — não é editável e não importa. Apenas alertar saldo em conta.
- Contas pós-pagas (cartão crédito) têm campos diferentes — esses caveats são específicos de pré-pago BR
