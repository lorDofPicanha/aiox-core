---
name: vorza-bm-ban-12mai
description: "Vorza BM 2744791262542284 restringido 12/Mai por automation flag — consequência esperada do ad_account-ban anterior, NÃO correlação sistêmica com KR/Tocks/Bretda/MCP."
metadata: 
  node_type: memory
  type: project
  originSessionId: 98ba60f8-9c33-403c-8964-868077e07db2
---

# Vorza BM Ban — 12/Mai/2026

## Fato
Meta restringiu BM Vorza `2744791262542284` em 12/Mai.
- Motivo declarado: "regras automáticas / atividade criada rapidamente por máquina"
- Status: não pode criar/apresentar ads, não pode usar/partilhar públicos

## Por que NÃO é sinal sistêmico
O ad_account Vorza já estava banido há um tempo (pré-12/Mai). O BM-ban é desdobramento natural — Meta tipicamente escala restrição de ad_account → BM quando padrão persiste. **Esperado, não surpresa.**

## Por que NÃO é correlação com KR/Tocks/Bretda
- KR policy hold (16/Mai, subcode 2446325) é caso isolado próprio
- Tocks/Bretda não compartilham BM com Vorza
- MCP-ads-bridge usage NÃO é o gatilho (descartado pelo founder)

## How to apply
**Não levantar hipótese de cascata MCP-driven** quando topics tipo BM-ban Vorza surgirem novamente. Já investigado e descartado.

## UPDATE 19/Mai — cascata SÍ existe via System User
Diagnóstico KR token revelou: System User da Vorza BM, mesmo quando assigned a outra BM (KR), retém o ban contagious. Resultado prático: token "Conversions API System User" originado via Vorza falha com `subcode 2446325` em qualquer operação write em ad_accounts. Fix: trocar System User pra outro BM limpo. Ver [[session_kr_oauth_attempt_19mai]] pro diagnóstico completo. **Atualiza a cláusula original**: cascata MCP-pattern-driven seguiu não-existindo; cascata System-User-membership-driven existe.

Vorza Meta-side está morto desde 05/Mai (pivot email — [[session_vorza_email_pivot_05mai]]). BM-ban consolida o estado.

## Refs
- supersedes hipótese transitória discutida 19/Mai (Orion levantou cascade risk, founder descartou)
- relates [[session_vorza_email_pivot_05mai]]
- não-relacionado [[session_kr_v4_link_clicks_18mai]]
