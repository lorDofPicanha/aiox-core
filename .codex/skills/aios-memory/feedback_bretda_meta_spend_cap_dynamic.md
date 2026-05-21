---
name: feedback-bretda-meta-spend-cap-dynamic
description: Bretda Meta account has DYNAMIC spend_cap — não usar gap (cap - amount_spent) como métrica de runway
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4caaf143-bfd8-4b9f-88f9-0c482fa87ad5
---

Bretda Meta account `act_381618241134624` tem **spend_cap DINÂMICO** — o limite aumenta automaticamente conforme o gasto cresce. Não é prepaid card / cap fixo.

**Why:** Confirmado por Breno 2026-05-15 ("ele sempre vai ficar assim mesmo se aumentar o gasto ele aumenta em conjunto"). Tipo provável: Meta Business credit line ou conta com cap automático.

**How to apply:**
- **NÃO usar gap `spend_cap - amount_spent` como runway** pra Bretda (foi falso alerta P0 hoje — 2.2d / 1.4d projetado, mas Meta nunca pausa pq cap acompanha).
- Pra runway real Bretda Meta: usar `balance` field (saldo prepaid) OU validar UI Ads Manager `display_string`.
- Em conta com cap dinâmico, runway só depende de fundo disponível e ciclo de cobrança.
- Esta regra é **conta-específica** Bretda — outras contas (KR, Tocks, Vorza, Low-Ticket-10k) podem ter cap fixo, validar caso a caso.

**Related:** `feedback_meta_prepaid_spend_cap` (regra geral pra contas prepaid — Bretda é exceção).
