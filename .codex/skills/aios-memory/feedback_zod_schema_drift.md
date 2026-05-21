---
name: Zod Schema Drift Trap
description: Quando alterar enum em SQL CHECK constraint, lembrar de atualizar Zod schema correspondente — falha silenciosa via "upsert failed" em loop.
type: feedback
originSessionId: f03dd075-4e1d-48e6-9d33-61f7db997f1f
---
Sempre que adicionar/remover valor de enum em `CHECK (col IN (...))` no schema SQL, atualizar TAMBÉM o `z.enum([...])` correspondente no código TypeScript.

**Why:** Zod valida ANTES do INSERT/UPDATE. Se Zod barra, INSERT nunca acontece. Schema CHECK aceitando + Zod barrando = upsert errors em loop e nada inserido. Bug silencioso porque o ingest "termina" com exit 0 (gamma só faz `console.warn`, não throw).

**How to apply:**
- Identificou divergência entre tipo TypeScript/Zod e schema SQL? Sincroniza ambos.
- Validar com 1 INSERT real após patch antes de spawnar pipeline de horas.
- Caso real: BACKTEST-1 crypto (29/Abr 02h). Mudei classifier + schema CHECK + DB migration mas esqueci `_lib.ts:81 z.enum`. Resultado: 250k markets processados, 0 crypto inseridos, pipeline completou e gerou report sem crypto.
