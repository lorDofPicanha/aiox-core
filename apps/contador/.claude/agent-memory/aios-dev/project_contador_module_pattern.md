---
name: contador-module-pattern
description: How self-contained demo modules in apps/contador are structured and the gates they must pass
metadata:
  type: project
---

Each navigable demo module in `apps/contador/app/{modulo}/` is fully self-contained: `{modulo}-data.ts` (synthetic seed), `{modulo}-model.ts` (pure logic + StatusView maps), `page.tsx` (Server Component, `export const dynamic = "force-dynamic"`), `{Modulo}Explorer.tsx` (`"use client"` interactivity), `{modulo}.module.css`.

**Why:** modules are built in parallel by different agents; a module must NOT touch shared files (`components/Nav.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/api.ts`, other modules). It only IMPORTS shared components (`@/components/Card|Table|StatusBadge|TopBar`) and lib (`@/lib/format`, `@/lib/status`). The lead wires `Nav.tsx` afterward.

**How to apply:**
- Reuse global CSS classes (`card`, `badge`, `notice`, `disclaimer`, `tbl`, `num`, `mono`, `muted`, `kpi`, `semaforo-dot`, `risco`, `revisar`, `grid`/`grid-2`/`grid-3`). Anything else (e.g. a 4-col KPI grid) goes in the local `.module.css` — globals only has grid-2/grid-3.
- Deterministic synthetic dates: seed builds vencimentos relative to a `refIso` passed from the page (`new Date().toISOString()`), so the risk/status spread is stable over time. Keep model logic pure (no `Date.now()` inside).
- Gates before "done": `npm run typecheck`, `npm run banlist:g6` (G6 fiscal-language gate; `prebuild` also runs it), then `npm run build` to confirm the route compiles. Dev server on :3008.
- G6 ([[contador-g6-language]]): never promise outcomes ("evita cancelamento", "garante desconto", "apuração correta"). Use "indício de risco", "sugerimos revisar". The banlist allows a banned term only if negated in the immediate vicinity. Human-in-loop is design: platform signals, contador decides — actions must not automate or promise.
