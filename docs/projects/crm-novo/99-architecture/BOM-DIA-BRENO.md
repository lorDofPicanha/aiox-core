# 🌅 Bom Dia Breno — CRM Novo Planning Complete

**Status:** Planning complete (research → brainstorm → ultraplan → conclave → arquitetura). **Code não iniciado** (Concierge MVP Week 0 first).

**Workspace:** `D:/AIOS/docs/projects/crm-novo/`

**🎯 Escopo Tenants:**
- **Phase 1 primários:** Tocks + Bretda
- **Phase 2+ futuros (multi-tenant ready):** qualquer negócio Breno criar — Vorza/Site-Prospector/Anipis/Skara/novos. Onboarding <1 dia.

---

## 📦 O que foi entregue (15/Mai/2026)

| Fase | Output | Localização |
|------|--------|-------------|
| 1 | Context + decisões aplicadas | `00-context/CONTEXT.md` |
| 2 | HYDRA pipeline real (145 sources, 1160 fetched, 136 distribuídos a 24 clones) | `10-research/00-hydra-run-summary.md` + 7 squad outputs |
| 3 | Tech research (6 fases) | `10-research/06-tech-research.md` |
| 4 | Brainstorming features (85 features V0/V1/V2) | `20-brainstorm/01-features-brainstorm.md` |
| 5 | UltraPlan (5 fases + risk matrix + 24 stories Sprints 1-4) | `30-ultraplan/01-implementation-blueprint.md` |
| 6 | Conclave 5 experts (proposal-writer, BLITZ, guillaume-moubeche, eric-ries, warren-buffett) | `40-conclave/01-conclave-synthesis.md` |
| 7 | **ARCHITECTURE + FEATURES + ROADMAP** finais | `99-architecture/` |

---

## 🎯 The Moat (locked v1.0)

> **CRM Novo's moat = Bridge bidirecional Meta CAPI + Google offline conv com idempotency, dead-letter queue e audit trail completo.**

Tudo o resto é commodity bem-feita. **Não disperse foco.**

---

## ⚡ Stack Final (não-negociável)

```
Frontend:    Next.js 16 (App Router) + React 19 + Tailwind + shadcn/ui + PWA
Backend:     Next.js Route Handlers + Server Actions
Database:    Supabase Postgres sa-east-1 (multi-tenant RLS single-DB)
Auth:        Supabase Auth (magic link + Google OAuth + JWT tenant_id)
Workflows:   Inngest (durable, retries, idempotency)
WhatsApp:    Meta Cloud API DIRETO (não BSP wrapper)
Email:       Resend
Hosting:     Vercel Pro
LGPD:        Consent ledger + audit_log + ROPA auto-gen
Custo:       ~$70/mo + WhatsApp variable
```

---

## 🗓️ Timeline (12 weeks declared, 16 weeks budgeted)

```
Week 0      ▸ Concierge MVP (5 entrevistas + dogfooding + Bridge standalone) → Gate 0
Week 1-4    ▸ Alpha (Foundation + WhatsApp Core) → 🚨 Gate 1
Week 5-7    ▸ Beta (Bridge + Pipeline) → 🚨 Gate 2
Week 8      ▸ LGPD + Pilot → 🚨 Gate 3
Week 9-12   ▸ GA (V1: PWA + Email + Calendar + Forms + Reports) + Bretda migrate
Week 13-16  ▸ Buffer (margin of safety Buffett)
Q3 2026     ▸ V2 (Mind clones + AI agents)
```

---

## 🚨 4 KILL Gates

| Gate | When | Trigger |
|------|------|---------|
| **Gate 0** | Week 0 end | Vendedor Tocks prefere status quo (planilha + WhatsApp Web) → PIVOT Bridge-only |
| **Gate 1** | Week 4 end | Meta Business Verification ainda em review OR Inbox não funcional |
| **Gate 2** | Week 7 end | Bridge E2E incomplete (1 Bretda lead → Google Ads sem count match) |
| **Gate 3** | Week 8 end | Tocks team rejects UX OR critical bugs blocking ops |

**Default KILL action:** Reabsorve tempo em Tocks/Bretda ops + Site-Prospector pilot.

---

## ✅ User Actions Pendentes (em ordem)

### 🔴 Esta semana (Week 0)

1. **5 entrevistas vendedor Tocks** (30min cada — Day 1-3)
2. **Internal pitch doc 1-página Tocks team** (Day 2)
3. **Inngest Bridge standalone setup** (Lead Qualificado fires Meta CAPI + Google OC standalone — Day 3-5)
4. **Dogfooding: 1 dia Breno opera Tocks Meta inbox via planilha + WhatsApp Web + Bridge standalone** (Day 5-7)
5. **Decide moat statement final + 16-week budget confirm** (Day 7)
6. **Gate 0 review: validate Customer Need ou PIVOT Bridge-only** (Day 7)

### 🟡 Week 1

7. **Submit Meta WhatsApp Business Verification** (D+1 ASAP — Tocks Custom Móveis Ltda CNPJ + docs)
8. **Comprar domínio:** `crm.synkra.com.br` OR `skara.synkra.com.br`?
9. **Patricia Peck DPA bundle:** combinar com Site-Prospector legal pack (R$2.5-5k OAB-SC)

### 🟢 Quando possível

10. Reservar Tocks vendedor full-time 5 dias (Week 8 pilot)
11. BSP fallback prep (Take Blip account ready se Gate 1 fail)
12. Bretda team brief Week 6 (Beta ride-along)

---

## 🎯 Differentiators vs SaaS BR/global

| Differentiator | We | Competitors |
|----------------|----|-----|
| WhatsApp Cloud API direto | ✅ | BSP wrapper (markup + lock-in) |
| Bridge Meta CAPI + Google OC built-in | ✅ | Zapier fragile or manual |
| Multi-tenant RLS append-only audit | ✅ | None public |
| Mind clones integration (V2) | ✅ Q3 | None |
| PT-BR mobile-first PWA | ✅ | PipeRun parcial |
| LGPD 15d SLA + 72h breach runbook | ✅ | Manual ou ausente |

---

## 🧠 Conclave Insights (6 modifications adopted)

1. **Add Week 0 Concierge MVP** (mandatory — Ries) — entrevistas + dogfooding + Bridge standalone
2. **Internal pitch doc Week 0** (Proposal Writer) — sell internamente Tocks team
3. **Reframe phases Alpha/Beta/GA** (BLITZ) — não "pilot então prod"
4. **16-week budget** (Buffett margin of safety) — 4 weeks slack
5. **Moat statement explicit** (Buffett Circle of Competence) — Bridge é o moat
6. **Founder dogfooding Week 1-4** (Moubeche) — Breno opera Tocks via CRM v0 skeleton

---

## 🗂️ Quick Links

- **CONTEXT:** `docs/projects/crm-novo/00-context/CONTEXT.md`
- **Tech Research:** `docs/projects/crm-novo/10-research/06-tech-research.md`
- **HYDRA Summary:** `docs/projects/crm-novo/10-research/00-hydra-run-summary.md`
- **Brainstorm:** `docs/projects/crm-novo/20-brainstorm/01-features-brainstorm.md`
- **UltraPlan:** `docs/projects/crm-novo/30-ultraplan/01-implementation-blueprint.md`
- **Conclave:** `docs/projects/crm-novo/40-conclave/01-conclave-synthesis.md`
- **ARCHITECTURE:** `docs/projects/crm-novo/99-architecture/ARCHITECTURE.md`
- **FEATURES:** `docs/projects/crm-novo/99-architecture/FEATURES.md`
- **ROADMAP:** `docs/projects/crm-novo/99-architecture/ROADMAP.md`

---

## 💬 Triggers próxima sessão

- `vai com crm` → start Week 0 Concierge MVP
- `pivot crm bridge-only` → kill full CRM, build Bridge-only
- `kill crm` → reabsorve tempo em Tocks/Bretda
- `audit crm gate 0/1/2/3` → review checkpoint
- `expande feature F-XXX crm` → detail single feature
- `revisita conclave` → re-run com 5 experts diferentes

---

*Bom dia Breno! Planning ready. Week 0 mandatory antes Sprint 1.* 🚀

— Orion, orquestrando o sistema 🎯
