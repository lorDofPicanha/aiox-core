---
name: contador-ecac-date-boundary
description: e-CAC saúde fiscal usa diff por timestamp (não por dia-calendário) — bug off-by-one mascarado pelo seed, ativa com adapter real
metadata:
  type: project
---

No add-on e-CAC (`apps/contador/app/ecac/saude-fiscal-model.ts`), `situacaoPrazo` e `prioridadeRenovacao` usam `diffDias` = `Math.floor((b-a)/86400000)` sobre timestamps ISO completos (com hora).

**Bug:** a classificação de prazo de intimação (S3) e de validade de CND (S5) é conceitualmente de **dia-calendário** ("vence hoje", "expirado"), mas o cálculo é por **delta de timestamp**. Quando `refIso` (hoje, com hora real via `new Date().toISOString()`) e `prazoLimiteIso` têm horas-do-dia diferentes, o floor introduz off-by-one:
- prazo que vence AMANHÃ 00:00 com hoje 23:00 → diff 0 → classificado "no_limite/Vence hoje" (falso alarme).
- prazo que vence HOJE 08:00 com hoje 14:00 → diff -1 → "expirado" (falso prazo-perdido).
- timezone -03:00 no prazo desloca a fronteira.

**Por que os 46 testes passam:** o seed sintético deriva TODO prazo de `maisDias(refIso, n)`, preservando a mesma hora-do-dia do refIso → diff sempre múltiplo exato de 24h → bug invisível. Os testes usam a mesma técnica. O bug só ativa quando um **adapter real** (Integra/Infosimples) entrega data de calendário (meia-noite ou TZ Brasília).

**Why:** num produto fiscal, prazo de intimação classificado errado = alerta crítico perdido ou falso — risco de boa-fé.
**How to apply:** o fix é normalizar AMBAS as datas para meia-noite UTC (ou TZ fixa de Brasília) antes do diff, e re-testar com prazos à meia-noite e em -03:00. Não é bloqueante enquanto roda só mock, mas é dívida que deve ser fechada ANTES de S1/S4 (adapters). `new Date(invalida)` também retorna NaN → cai silenciosamente em "folgado"; adicionar guarda.

Liga [[contador-verifier-slicing]].
