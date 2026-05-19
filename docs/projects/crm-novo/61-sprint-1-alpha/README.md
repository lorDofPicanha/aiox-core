# Sprint 1 Alpha — Foundation (Week 1-2)

> ⚠️ **PENDING GATE 0 VERDE** — Não iniciar execução antes da decisão Day 7 do Week 0.

**Status:** 🟡 Stories detalhadas · execução bloqueada até Gate 0
**Período:** Week 1-2 pós-Gate 0 (estimativa: 2026-05-26 a 2026-06-08)
**Effort total:** 48h (~8h/dia × 6 dias úteis)
**Goal:** Base técnica multi-tenant rodando — Tocks + Bretda + Anipis (3 tenants) com auth, schema, Inngest, audit log.

---

## Stories desta Sprint

| ID | Title | Agent | Effort | Status |
|----|-------|-------|--------|--------|
| **CRM-1.1** | Supabase project + Next.js 16 monorepo bootstrap | @dev | 8h | 📋 ready |
| **CRM-1.2** | Supabase Auth + JWT tenant_id claim + magic link | @dev | 8h | 📋 ready |
| **CRM-1.3** | Schema v0 migrations + RLS policies + pgTAP tests | @data-engineer | 16h | 📋 ready |
| **CRM-1.4** | Tenant onboarding flow (create Tocks/Bretda) | @dev | 4h | 📋 ready |
| **CRM-1.5** | Inngest setup + signing keys + first workflow | @dev | 4h | 📋 ready |
| **CRM-1.6** | Audit log middleware + cross-tenant E2E test | @qa | 8h | 📋 ready |

---

## Dependências entre stories

```
CRM-1.1 (bootstrap)
  ├─► CRM-1.2 (auth)
  │     └─► CRM-1.4 (onboarding)
  ├─► CRM-1.3 (schema RLS) ────┘
  │     └─► CRM-1.6 (audit)
  └─► CRM-1.5 (inngest)
```

Execução paralela possível: CRM-1.1 → (CRM-1.2 || CRM-1.3 || CRM-1.5) → (CRM-1.4 || CRM-1.6).

---

## Definition of Done Sprint 1 (overall)

- [ ] `pnpm dev` sobe local sem erro
- [ ] Magic link funciona com 2 emails (Breno + Cristiane)
- [ ] Schema v0 deployed Supabase prod sa-east-1
- [ ] RLS impede cross-tenant leak em testes pgTAP (5+ scenarios)
- [ ] Onboarding cria tenant `tocks` + `bretda` + admin user
- [ ] Inngest dashboard visível, 1 workflow hello-world executa
- [ ] Audit log row criada em cada ação CRUD via middleware
- [ ] CI pipeline rodando (lint + typecheck + test) em GitHub Actions
- [ ] Deploy Vercel preview funciona em PR

---

## Riscos Sprint 1

| Risco | Mitigação |
|-------|-----------|
| Supabase RLS performance ruim (>3min queries) | Index em `(tenant_id, *)` em todas tabelas. pgbench antes de Sprint 2 |
| Magic link email caindo em spam | Resend domain authentication + SPF/DKIM (esperar 24h propagar DNS) |
| Inngest signing key vazando em log | Sentry filter + grep CI |
| RLS bypass acidental via service_role no client | Code review checklist: service_role só em `/api/*` server-only |

---

## O que NÃO está em Sprint 1

Defererido pra Sprint 2 (Week 3-4):
- WhatsApp Cloud webhook (CRM-2.x)
- Contact / Lead model (CRM-2.x)
- Realtime inbox (CRM-2.x)
- UI completa (Sprint 2 entra Tailwind+shadcn polish)

Sprint 1 é **infraestrutura pura** — sem feature visível pro user final.

---

## Pré-requisitos antes de começar

- [ ] Gate 0 verde documentado em `50-week-0/04-gate-0-decision-*.md`
- [ ] Bridge Standalone funcional Week 0 (já feito antes do Gate)
- [ ] Decisão de domínio: `crm.synkra.com.br` OU naming definitivo (ver `00-context/NAMING-OPTIONS.md` no buscador como referência de processo)
- [ ] Supabase project criado sa-east-1 (pode reusar do Bridge Standalone)
- [ ] Vercel project linked
- [ ] GitHub Actions secrets configurados

---

## Como executar uma story

1. Abrir story file (`CRM-1.X-*.md`)
2. Verificar Dependencies → todos completed?
3. Marcar status `in_progress`
4. Implementar seguindo Acceptance Criteria + Technical Notes
5. Marcar checkboxes conforme avança
6. Atualizar File List ao final
7. Pass Definition of Done checklist
8. Hand off para @qa pra review
9. Marcar status `done` após QA pass

---

## Referências cruzadas

- `30-ultraplan/01-implementation-blueprint.md` — visão geral 24 stories
- `99-architecture/ARCHITECTURE.md` — stack + decisões arquiteturais
- `99-architecture/FEATURES.md` — feature list + priorização
- `99-architecture/ROADMAP.md` — calendário 12 semanas
- `60-bridge-standalone/` — Bridge code que vai migrar pra `apps/bridge/` em Sprint 3

---

*Stories scaffold geradas 2026-05-19 · execução condicional à Gate 0 verde*
