# CRM Novo — Roadmap v1.0 Final (pós-conclave)

**Date:** 2026-05-15
**Status:** Locked V0, scoped V1, directional V2
**Timeline declared:** 12 weeks MVP → V1 → Q3 V2
**Timeline budgeted internally:** 16 weeks (margin of safety Buffett)

**🎯 Tenants Strategy:**
- **Phase 1 primários:** Tocks (pilot Week 8) + Bretda (migration Week 9-12)
- **Phase 2+ futuros (multi-tenant ready):** qualquer negócio Breno criar — Vorza/Site-Prospector/Anipis/Skara/novos. Onboarding <1 dia via arquitetura RLS.

---

## 📅 Calendar Reference

| Date BR | Week | Phase | Activity |
|---------|------|-------|----------|
| 2026-05-15 | W0 start | Pre-Sprint | Concierge MVP + entrevistas Tocks |
| 2026-05-22 | W1 start | Alpha | Foundation + Supabase setup |
| 2026-06-05 | W3 start | Alpha | WhatsApp Core |
| 2026-06-12 | W4 end | **🚨 GATE 1** | Business Verification + Inbox check |
| 2026-06-19 | W5 start | Beta | Bridge + Pipeline |
| 2026-07-03 | W7 end | **🚨 GATE 2** | Bridge E2E success |
| 2026-07-10 | W8 end | **🚨 GATE 3** | Tocks pilot review |
| 2026-07-17 | W9 start | GA | V1 features (PWA + Email + Calendar) |
| 2026-08-14 | W12 end | GA close | V1 stable + Bretda live |
| 2026-08-21 | W13 start | Buffer | Stabilization + polish |
| 2026-09-04 | W16 end | V1 done | Vorza migration window |
| 2026-09-15 onwards | Q3 | V2 | AIOS-native differentiators |

---

## 🌱 Phase Overview

```
Week 0      ▸ Concierge MVP (validate need) ▸ KILL if Customer Need Pivot triggered
                                              │
Week 1-4    ▸ Alpha (Tocks low volume + Breno dogfooding)
              │                                                  
              ▼  🚨 GATE 1: Business Verification + Inbox
                                              │
Week 5-8    ▸ Beta (Tocks production + Bretda ride-along + Bridge live)
              │                                                  
              ▼  🚨 GATE 2: Bridge E2E + 🚨 GATE 3: Tocks pilot review
                                              │
Week 9-12   ▸ GA (V1 features + Bretda full + Vorza prep)
              │                                                  
              ▼  
                                              │
Week 13-16  ▸ Buffer (stabilization + polish + V2 prep)
                                              │
                                              ▼
Q3 2026     ▸ V2 (AIOS-native differentiators: mind clones, AI agents)
```

---

## 🚨 KILL Gates (non-negotiable)

### Gate 0 (Week 0 end) — Customer Need Pivot Check

**Date:** 2026-05-21
**Trigger:** Vendedor Tocks (entrevistas + dogfooding) sinaliza preferência por status quo (planilha + WhatsApp Web).
**Decision tree:**
- ✅ Need confirmed → Proceed Sprint 1
- ❌ Need rejected → PIVOT to Bridge-only product (skip full CRM build) OR ABANDON

### Gate 1 (Week 4) — Foundation Check

**Date:** 2026-06-12
**Hard criteria:**
- [ ] Meta WhatsApp Business Verification approved
- [ ] Inbox real-time funcional (Tocks +55 47 3041-9811 webhook receiving)
- [ ] Multi-tenant RLS verified (cross-tenant query returns empty)
- [ ] Audit log functional
- [ ] Smoke test endpoint responds (KR prevention)

**Decision tree:**
- ✅ All criteria met → Proceed Sprint 3
- ⚠️ Verification delayed → Activate BSP fallback (Take Blip temp Tocks number) + Re-eval Week 6
- ❌ Inbox not working → DEEPER ISSUE — pause Sprint 3 + debug

### Gate 2 (Week 7) — Bridge E2E Success

**Date:** 2026-07-03
**Hard criteria:**
- [ ] 1 real Bretda lead → marked "Lead Qualificado" → Meta CAPI uploaded (count match)
- [ ] Same lead → Google Ads OC uploaded (count match)
- [ ] Reconcile cron daily running + 0 mismatch alerts
- [ ] Dead-letter queue tested (force fail + retry success)
- [ ] Idempotency tested (replay event = no dupe upload)

**Decision tree:**
- ✅ All criteria met → Proceed Sprint 4
- ❌ Bridge incomplete → PAUSE V1, extend Sprint 3 +2 weeks. Re-eval Week 9.

### Gate 3 (Week 8) — Tocks Pilot Review

**Date:** 2026-07-10
**Hard criteria:**
- [ ] Tocks vendedor used CRM Novo 5 consecutive days
- [ ] Response time avg <60s (per lead)
- [ ] NPS Tocks team ≥7/10
- [ ] Zero leads "void" (vs Sales AI baseline)
- [ ] Critical bugs: 0 (P0/P1 closed)

**Decision tree:**
- ✅ All criteria met → Proceed V1 Sprint 5
- ❌ Tocks rejects UX → ROLL BACK Sales AI parcial + redesign Sprint 4 features +2 weeks
- ⚠️ Adoption uneven (some yes, some no) → Co-design Week 9 with rejecting users

---

## 📦 Phase V0 — Detailed (Weeks 0-8)

### Week 0 (2026-05-15 → 2026-05-21) — Concierge MVP

**Goals:**
- Validate Customer Need (Eric Ries)
- Pitch internal Tocks team (Proposal Writer)
- Founder dogfooding setup (Guillaume Moubeche)
- Bridge standalone proof-of-concept

**Activities:**
- Day 1-3: 5 entrevistas vendedor Tocks (30min cada)
- Day 2: Internal pitch doc 1-página
- Day 3-5: Inngest Bridge standalone (Lead Qualificado fires Meta CAPI + Google OC, sem UI)
- Day 5-7: Breno dogfoods (operating Tocks Meta inbox via planilha + WhatsApp Web + Bridge standalone, 1 day)
- Day 7: Gate 0 review + decision

**Deliverables:**
- `00-context/customer-interviews.md` (5 entrevistas summary)
- `00-context/internal-pitch.md` (1-página)
- Inngest Bridge prototype working
- Gate 0 verdict

### Week 1-2 (2026-05-22 → 2026-06-04) — Foundation

**Sprint 1 Stories:** CRM-1.1 to CRM-1.6
**Goals:** Supabase + Next.js + RLS + Inngest + Audit foundation
**Daily focus:** Schema correctness, RLS tests, no shortcuts

### Week 3-4 (2026-06-05 → 2026-06-12) — WhatsApp Core [GATE 1]

**Sprint 2 Stories:** CRM-2.1 to CRM-2.8
**Goals:** Inbox real-time, send/receive, multi-number, smoke test
**Daily focus:** Breno operating Tocks via CRM v0 skeleton (force dogfooding)
**Week 4 end:** 🚨 Gate 1 review

### Week 5-7 (2026-06-19 → 2026-07-03) — Bridge + Pipeline [GATE 2]

**Sprint 3 Stories:** CRM-3.1 to CRM-3.10
**Goals:** Bridge live, pipeline functional, reconcile cron, E2E success
**Daily focus:** Idempotency + dead-letter queue + reconcile (the moat)
**Week 7 end:** 🚨 Gate 2 review

### Week 8 (2026-07-04 → 2026-07-10) — LGPD + Pilot [GATE 3]

**Sprint 4 Stories:** CRM-4.1 to CRM-4.6
**Goals:** LGPD endpoints functional, reports basic, Tocks pilot live
**Daily focus:** 1 vendedor Tocks full-time using CRM. Monitor + iterate.
**Week 8 end:** 🚨 Gate 3 review

---

## 📦 Phase V1 — Detailed (Weeks 9-12)

### Week 9-10 (2026-07-17 → 2026-07-30) — PWA + Email + Calendar

**Sprint 5 Stories:** CRM-5.1 to CRM-5.11
**Goals:** PWA install, offline cache, push notifications, Email outbound/inbound, Calendar sync

### Week 11-12 (2026-07-31 → 2026-08-14) — Forms + Reports + Templates + Bretda migration

**Sprint 6 Stories:** CRM-6.1 to CRM-6.15
**Goals:** Form builder, reports advanced, templates library, Bretda live migration

**End of Week 12:** V1 GA. Bretda live. Tocks stable. Vorza prep.

---

## 📦 Buffer (Weeks 13-16)

### Weeks 13-14 — Stabilization

**Activities:**
- Bug fixes from Tocks/Bretda usage
- Performance optimization (Supabase query tuning, index health)
- Documentation update (ADRs, READMEs, runbooks)
- Pre-mortem V2 features

### Weeks 15-16 — Polish + V2 Prep

**Activities:**
- Onboarding playbook "new tenant in <1 day" (validate em qualquer futuro negócio)
- V2 spec writing (mind clones integration, AI agents)
- Infrastructure scale prep (Supabase Team tier evaluation if needed)
- Q3 planning

**Candidatos futuros tenant (não-garantidos, dependem evolução):**
- Vorza (IF email pivot decided + ready)
- Site-Prospector (IF pilot SUCCESS 09/Jun)
- Anipis/Serenity-AI (IF saúde mental product LIVE Ago 2026)
- Skara (IF spin-off SaaS Q3 decision)
- Qualquer novo projeto Breno: arquitetura preparada

---

## 📦 Phase V2 — Q3 2026 (~3 months)

**Target:** AIOS-native differentiators (mind clones integration, AI agents contextual)

**Sub-phases:**
- Month 1: Mind clones integration (F-080 to F-083)
- Month 2: AI agents contextual (F-090 to F-094)
- Month 3: Advanced integrations + multi-channel expansion

**Decision deferred Q3:**
- Spin-off CRM as SaaS Skara (venda externa)? Re-eval based on V0/V1 success.

---

## 📊 Resource Allocation

### Per-week dev hours (solo Breno + agentes)

| Week | CRM Novo | Tocks/Bretda Ops | Other AIOS | Total |
|------|----------|-------------------|------------|-------|
| W0 | 20h (entrevistas + Bridge) | 15h | 5h | 40h |
| W1-2 | 30h | 8h | 2h | 40h |
| W3-4 | 30h | 8h | 2h | 40h |
| W5-7 | 32h | 6h | 2h | 40h |
| W8 | 25h (pilot + iterate) | 12h (Tocks pilot support) | 3h | 40h |
| W9-12 | 25h | 12h | 3h | 40h |
| W13-16 | 15h (buffer) | 20h | 5h | 40h |

**Total CRM Novo dev:** ~260h-300h (V0 + V1 + Buffer)
**Total cost extern:** ~$70/mo × 4 meses = $280 + WhatsApp variable

### External dependencies timeline

| When | What | Who |
|------|------|-----|
| W1 D1 | Submit Meta WhatsApp Business Verification | Breno |
| W2-3 | Patricia Peck DPA template (bundle Site-Prospector) | Lawyer OAB-SC |
| W4 | First Tocks tenant data import | Breno + Tocks |
| W6 | Bretda team brief (Beta ride-along) | Breno + Bretda |
| W8 | Tocks pilot vendedor confirmed | Breno + Tocks |
| W10 | Google Calendar OAuth setup | Breno |
| W11 | Resend domain verify mail.crm.synkra.com.br | Breno |
| W12 | Bretda migration data ETL | Breno + Bretda |

---

## 🎯 Success Metrics by Phase

### V0 (Week 8 review)

**Hard:**
- Bridge upload success rate >99%
- Tocks response time avg <60s
- Zero leads void (vs Sales AI 0 fires/30d)
- Tocks NPS ≥7/10
- 0 critical bugs

**Soft:**
- Breno sustainable pace (não burnout)
- Solo dev velocity ≥80% estimate
- Documentation atualizada

### V1 (Week 12 review)

**Hard:**
- Bretda live operação 100%
- PWA install rate >40% Tocks users
- Calendar sync 0 conflitos
- Form leads → CRM end-to-end working
- Reports daily emails working

### V2 (Q3 end review)

**Hard:**
- Mind clones consult usage >5x/week per active user
- AI suggestion adoption rate >30%
- Multi-channel expansion (Instagram DM at least)

---

## ⚠️ Trigger Reavaliação

| Trigger | Action |
|---------|--------|
| Week 0 Concierge shows status quo preferred | PIVOT Bridge-only product |
| Week 4 Gate 1 fail (Verification) | BSP fallback Take Blip temp |
| Week 7 Gate 2 fail (Bridge) | Extend Sprint 3 +2w |
| Week 8 Gate 3 fail (Tocks UX) | Roll back + redesign +2w |
| Solo dev velocity <50% | Extend MVP to 16w. V1 → Q3 |
| Anthropic balance crisis | Defer V2 AI features Phase 3 |
| ANPD data residency BR mandatory | Migrate Supabase US → Magalu Cloud |
| Meta Cloud API pricing +50% | Reavaliar BSP options |
| Tocks demands feature outside V0 | Decline + add V1/V2 backlog |
| Bretda gate D+7 22/Mai precisar Bridge | Manter Sales AI parallel até Week 8 |

---

## 📋 Pré-Sprint 1 Pending User Actions

- [ ] **D-01 Week 0 Day 1:** Reservar 1 vendedor Tocks (entrevistas + pilot futuro)
- [ ] **D-02 Week 0 Day 7:** Decidir moat statement final + 16-week budget confirm
- [ ] **D-03 Week 1 Day 1:** Submit Meta WhatsApp Business Verification
- [ ] **D-04 Week 1 Day 1:** Comprar domínio + setup (crm.synkra.com.br OR skara.synkra.com.br?)
- [ ] **D-05 Week 2 Day 1:** Patricia Peck DPA template bundle (Site-Prospector + CRM Novo)
- [ ] **D-06 Week 4 Day 1:** Confirmar BSP fallback plan (Take Blip account ready se Gate 1 fail)
- [ ] **D-07 Week 8 Day 1:** Confirmar Tocks vendedor full-time 5 days pilot

---

*Roadmap v1.0 Final | Locked V0, scoped V1, directional V2 | Orion 2026-05-15*
