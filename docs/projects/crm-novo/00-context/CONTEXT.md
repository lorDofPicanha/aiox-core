# CRM Novo — CONTEXT.md

**Project ID:** crm-novo
**Started:** 2026-05-15
**Owner:** Breno (lordofpicanha)
**Status:** Planning Phase — Mega Research → Brainstorm → UltraPlan → Conclave → Architecture
**Workspace:** `docs/projects/crm-novo/`

---

## 🎯 Mission

Construir CRM próprio (greenfield, custom build) para substituir Sales AI deprecated.

**Tenants primários (Phase 1 — Week 0-12):**
- **Tocks** — móveis de luxo high-ticket (pilot Tocks Week 8)
- **Bretda** — mesas de bilhar high-ticket (migration Week 9-12)

**Tenants futuros (Phase 2+ — Q3 2026 onward):**
- Qualquer novo negócio Breno (AIOS) criar — arquitetura multi-tenant preparada desde dia 1
- Candidatos potenciais (não-garantidos, dependem de evolução):
  - **Vorza** — IF email pivot ready (4 opções A/B/C/D pending decisão)
  - **Site-Prospector** — IF pilot SUCCESS (review 09/Jun) escala pra agência operação
  - **Anipis (Serenity-AI)** — IF saúde mental product LIVE (CFM 2.454/2026 ago/2026)
  - **Skara** — IF spin-off CRM as SaaS Q3 2026 (separate decision)
  - Qualquer outro negócio futuro Breno → onboarding em <1 dia

**Foco:** WhatsApp-first, Meta/Google offline conv bridge, LGPD-compliant, multi-tenant RLS.

---

## 📋 Decisões Aplicadas (defaults sensatos da session 15/Mai)

| Q | Decisão | Rationale |
|---|---------|-----------|
| Q1 Escopo | **Médio (b)** — Core CRM + automação + integrações críticas | Não enterprise, não MVP-só. Equilíbrio entre tempo de build e valor |
| Q2 Build vs Buy | **Custom build (c)** — Next.js + Supabase + WhatsApp Business API | Controle total, AIOS-native, custo recorrente baixo, mind clones podem integrar |
| Q3 Persona | **Multi-tenant from day 1** — Tocks team (2-4 users) + Bretda + qualquer negócio futuro Breno onboarded em <1 dia | Tenants infinitos via RLS, não hardcoded |
| Q4 Integrations must-have | WhatsApp Business + Meta/Google offline conv bridge + Email + Calendar + Pixel/CAPI + LGPD + PT-BR mobile-first | Operação BR real, conversões pra ad platforms |
| HYDRA strategy | **Caminho C — Squad research direto** | HYDRA pipeline com bug Distribution 0 clones (14/Mai). Squad subagents paralelos = mesma cobertura, mais robusto |

---

## 🔥 Por que esse CRM existe — Pain Points do Sales AI (deprecated)

1. **F-CRM-Upload-Void** — Sales AI → Google offline conv bridge offline (Lead Qualificado R$13k = 0 fires/30d)
2. **User: "este sales só me deu trabalho"** — overengineering, AI features que não entregaram valor
3. **Falta de visibility** sobre leads reais quentes (WhatsApp inbox fragmentado)
4. **Sem multi-tenant** — não escala pra Bretda
5. **Sem bridge bidirecional** Meta ↔ Google offline conv que conta como conversion real

---

## 📦 Stack Hipótese (validar via research)

```
Frontend:    Next.js 16 (App Router) + React 19 + Tailwind + shadcn/ui
Backend:     Next.js API routes + Supabase (Postgres + Auth + Realtime + Storage)
Auth:        Supabase Auth (multi-tenant via RLS)
WhatsApp:    Meta Cloud API (oficial) — não 3rd party
Email:       Resend (já usado em Vorza)
Calendar:    Google Calendar API + iCal sync
Tracking:    Pixel client-side + CAPI server-side + Google offline conv upload
Hosting:     Vercel (frontend + edge) + Supabase (DB) + Railway (workers se precisar)
LGPD:        Multi-region BR data + DPA + consent ledger + ROPA
Mobile:      PWA-first, app nativo se demanda
```

---

## 🎯 Success Metrics (12 meses)

- 100% leads WhatsApp/Email/Form aparecem no CRM com SLA <60s
- 100% Lead Qualificado evento dispara Google offline conv em <5min
- 0 leads perdidos por config errada (smoke test obrigatório, padrão KR 12/Mai)
- Multi-tenant funcionando: Tocks + Bretda sem cross-leak
- Onboarding novo tenant (qualquer negócio futuro Breno) em <1 dia
- Tempo de fechamento real medido por lead (Bretda gate D+7 22/Mai)

---

## 🚫 Out-of-Scope (até prova em contrário)

- Sales AI features (lead scoring por IA, chat sales bot) — DEFERRED até CRM core funcionar
- Mobile native apps — PWA primeiro
- White-label venda externa — só uso interno AIOS
- Marketplace integrations além WhatsApp/Email/Calendar/Ads — DEFERRED
- Voice features — DEFERRED

---

## 📚 Referências Cruzadas

- Session 15/Mai: `C:/Users/kingp/.claude/projects/D--AIOS/memory/session_full_15mai_squad_marketing.md`
- KR WhatsApp Void (smoke test pattern): `memory/session_kr_whatsapp_void_12mai.md`
- Sales AI deprecated decision: linha 5 session 15/Mai
- HYDRA bug (caminho A blocked): `memory/reminder_hydra_distribution_bug_14mai.md`
- Tocks Sales AI deploy: `memory/session_sales_ai_deploy_05mai.md`

---

## 🗺️ Roadmap Planning

| Fase | Etapa | Status |
|------|-------|--------|
| 0 | Workspace + CONTEXT.md | ✅ Done |
| 1 | Mega research paralelo (5 subagents) | 🔄 Next |
| 2 | Tech research (market + tooling) | ⏳ |
| 3 | Brainstorming (features) | ⏳ |
| 4 | UltraPlan (deep planning) | ⏳ |
| 5 | Conclave (multi-expert review) | ⏳ |
| 6 | Final architecture + features + roadmap | ⏳ |

---

## 🚨 Known Dead-Ends (a evitar)

- ❌ Comprar SaaS BR (PipeRun/RD CRM/etc) — falta bridge Meta/Google offline conv robusto + custo recorrente alto
- ❌ HubSpot — caro, lock-in, integrações BR fracas
- ❌ Salesforce — overkill, R$XXk/mo, curva 6m
- ❌ No-code (Notion/Airtable) — não escala WhatsApp real-time + LGPD frágil
- ❌ 3rd party WhatsApp wrapper (Z-API, UnoFlow) — perdeu KR 99 leads em 12d via WABA Cloud API errada (12/Mai)

---

*Generated by Orion (aios-master) — 2026-05-15*
