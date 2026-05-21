---
name: Tocks Sales AI - CRM WhatsApp
description: Tocks Sales AI - CRM WhatsApp+IA, Epic 7 Go Live em andamento, Stories 7.1-7.4 DONE, WhatsApp API ativa, dashboard conectado Supabase real.
type: project
originSessionId: f1bf1d80-5f67-4cfe-a17f-78de4a038d26
---
## Tocks Sales AI

App CRM de vendas via WhatsApp com IA para Tocks Custom (moveis de luxo).
- **Path backend:** `D:/AIOS/apps/tocks-sales-ai`
- **Path dashboard:** `D:/AIOS/apps/sales-dashboard`
- **Stack backend:** Node.js, Express, Supabase, Redis/Upstash, BullMQ, Claude AI
- **Stack frontend:** Next.js 14, React Query, Supabase SSR, Recharts, Zustand, shadcn/ui
- **Porta:** 3100 (API backend + dashboard dev)
- **Endpoints:** `/health`, `/webhook/whatsapp`
- **Supabase:** `spiwgzahtmlvpuqgwehc.supabase.co`

### Epic 6: Dashboard CRM — DONE (11/Abr/2026)
Todas 6 stories completadas (design system, KPIs, leads, conversas, metricas, navigation).

### Epic 7: Go Live Pipeline (14/Abr/2026)

| Story | Titulo | Status |
|-------|--------|--------|
| 7.1 | Supabase Real — Schema, Migrations, RLS, Seed | ✅ DONE |
| 7.2 | WhatsApp Integration Real — Meta Business API | ✅ DONE (16/Abr) |
| 7.3 | AI Pipeline Real — Claude com contexto Supabase | ✅ DONE (ja implementado) |
| 7.4 | Dashboard Live Data — Kill Mock, Connect Supabase | ✅ DONE (16/Abr) |
| 7.5 | LGPD & Security Audit — Dados Reais | PROXIMO |
| 7.6 | Staging Deploy + Vendedor Piloto | TODO |

### Story 7.2 — WhatsApp Details (16/Abr)
- **Token:** Permanente via System User (Employee) — WABA `1513719883686703`, Phone `1031300120074280`
- **Token temporario ativo** (expira ~24h) — precisa resolver System User com WABA correto para token permanente
- **Webhook:** Cloudflare tunnel → `localhost:3100/webhook/whatsapp`
- **Envio testado:** 3 mensagens OK (wamid confirmados)
- **Numeros teste:** 5547992789991, 554730419811, 5547992259554
- **Pipeline completo:** webhook → Supabase → BullMQ → Claude AI (intent/sentiment/priority) → Response Suggestion → Mind Clone → Profile Enrichment → Lead Score

### Story 7.4 — Dashboard Migration (16/Abr)
- **10 mind clones** trabalharam em 3 fases (Foundation → Implementacao → Quality Gate)
- **Fase 1:** @martin-fowler (queries.ts + types.ts), @craig-kerstiens (012_dashboard_views.sql — 8 views + 4 RPCs), @dan-abramov (6 hooks React Query)
- **Fase 2:** @sarah-drasner (Overview), @kent-c-dodds (Leads+Pipeline), @simon-willison (Conversations+Realtime), @vitaly-friedman (Metrics+Orders), @addy-osmani (Settings+Reports+Ads — 3 new hooks)
- **Fase 3:** @gene-kim (QA) — encontrou 2 residuais, corrigidos por Orion
- **Resultado:** Zero mock imports, zero TS errors, build OK, 4400+ linhas novas
- **DB migration:** `012_dashboard_views.sql` precisa ser aplicada no Supabase

### Pendencias
- Token permanente WhatsApp: System User precisa WABA `1513719883686703` como asset (atualmente tem `1402258661921331`)
- Migration `012_dashboard_views.sql` precisa rodar no Supabase
- Story 7.5 LGPD & Security Audit — proximo
