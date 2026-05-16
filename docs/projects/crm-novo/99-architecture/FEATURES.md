# CRM Novo — Features List (final pós-conclave)

**Date:** 2026-05-15
**Status:** Locked V0, V1 scoped, V2 directional
**Total features:** 85 (30 V0 + 25 V1 + 30 V2)

---

## 🛡️ The Moat (stay in this circle)

> **CRM Novo's moat = Bridge bidirecional Meta CAPI + Google offline conv com idempotency, dead-letter queue e audit trail.**

Tudo o resto é commodity bem-feita. **Não disperse foco.**

---

## 📦 Phase V0 — MVP (Weeks 0-8)

### Week 0 — Pre-Sprint (Concierge MVP — Eric Ries gate)

| ID | Feature | Why | Owner |
|----|---------|-----|-------|
| W0-01 | 5 entrevistas vendedor Tocks (30min cada) | Validar Customer Need antes build | Breno |
| W0-02 | Internal pitch doc 1-página (Tocks team) | Sell internamente — Proposal Writer | Breno |
| W0-03 | Inngest Bridge standalone (sem UI) Lead Qualificado upload | Validate killer feature isoladamente | Breno |
| W0-04 | Dogfooding: 1 dia Breno opera Tocks Meta inbox via planilha + WhatsApp Web + Bridge standalone | Customer Need Pivot check | Breno |
| W0-05 | Moat statement locked | Stay in circle (Buffett) | Breno |
| W0-06 | 16-week budget confirmed (4-week margin of safety) | Realistic timeline | Breno |

**Customer Need Pivot trigger:** Se vendedor prefere status quo (planilha + WhatsApp Web), **PIVOT** to Bridge-only product (skip full CRM build).

---

### Sprint 1 (Week 1-2) — Foundation

| ID | Feature | Description | Story | Effort |
|----|---------|-------------|-------|--------|
| F-001 | Supabase project bootstrap | sa-east-1 + project setup | CRM-1.1 | 8h |
| F-002 | Next.js 16 monorepo | App Router + Tailwind + shadcn/ui | CRM-1.1 | 8h |
| F-003 | Supabase Auth | Magic link + Google OAuth + JWT tenant_id claim | CRM-1.2 | 8h |
| F-004 | Multi-tenant schema base | tenants, tenant_users, contacts, deals, activities, whatsapp_messages, consent_ledger, audit_log | CRM-1.3 | 16h |
| F-005 | RLS policies + pgTAP tests | Cross-tenant assertion mandatory | CRM-1.3 | 8h |
| F-006 | Tenant onboarding flow | Create Tocks/Bretda/futuros tenants | CRM-1.4 | 4h |
| F-007 | Inngest setup | Signing keys + first workflow scaffold | CRM-1.5 | 4h |
| F-008 | Audit log middleware | Every mutation logged | CRM-1.6 | 8h |

### Sprint 2 (Week 3-4) — WhatsApp Core [GATE 1 Week 4]

| ID | Feature | Description | Story | Effort |
|----|---------|-------------|-------|--------|
| F-010 | WhatsApp Cloud API webhook receiver | Signature verify SHA-256, dedupe by message_id | CRM-2.1 | 12h |
| F-011 | Contact upsert via webhook | (tenant_id, phone) UNIQUE | CRM-2.2 | 6h |
| F-012 | Multi-number per tenant routing | Tocks +55 47 3041-9811, etc | CRM-2.3 | 8h |
| F-013 | Inbox view real-time | Supabase Realtime channel scoped per tenant | CRM-2.4 | 12h |
| F-014 | Conversation view + send (free-form CSW + HSM) | 24h customer service window | CRM-2.5 | 16h |
| F-015 | Media attachments | Image, doc, audio via Supabase Storage RLS | CRM-2.6 | 8h |
| F-016 | Smoke test endpoint | `/api/whatsapp/smoke-test` KR prevention | CRM-2.7 | 4h |
| F-017 | E2E test: send → inbox → reply | Playwright critical flow | CRM-2.8 | 8h |

**🚨 GATE 1 (Week 4):** Business Verification approved + Inbox funcional. **KILL trigger:** ainda em approval review OR inbox não funcional.

### Sprint 3 (Week 5-7) — Bridge + Pipeline [GATE 2 Week 7]

| ID | Feature | Description | Story | Effort |
|----|---------|-------------|-------|--------|
| F-020 | Inngest workflow: lead.created → Meta CAPI Lead | First Bridge upload | CRM-3.1 | 8h |
| F-021 | Inngest workflow: deal.qualified → Meta CAPI Lead Qualified | Custom event | CRM-3.2 | 8h |
| F-022 | Inngest workflow: deal.qualified → Google Ads OC | Batch upload | CRM-3.3 | 12h |
| F-023 | Idempotency keys + dead-letter queue + alert | `deal.id + event_type` | CRM-3.4 | 8h |
| F-024 | Conversion event dashboard | Status, retry, manual trigger | CRM-3.5 | 8h |
| F-025 | Pipelines + stages + deal CRUD | Pre-installed default pipeline per tenant | CRM-3.6 | 12h |
| F-026 | Kanban board view | Mobile-friendly drag | CRM-3.7 | 12h |
| F-027 | Deal detail + linked WhatsApp + activities | Inline conversation | CRM-3.8 | 8h |
| F-028 | Reconcile cron daily | CRM count vs Meta vs Google daily match | CRM-3.9 | 6h |
| F-029 | E2E test: Bretda lead → qualified → Google Ads receives | Bridge validation | CRM-3.10 | 8h |

**🚨 GATE 2 (Week 7):** Bridge E2E success (1 lead Bretda real → Google Ads receives + count match). **KILL trigger:** Bridge incomplete.

### Sprint 4 (Week 8) — LGPD + Reports + Pilot [GATE 3 Week 8]

| ID | Feature | Description | Story | Effort |
|----|---------|-------------|-------|--------|
| F-030 | Consent ledger captures | CTW source logged (Ad ID) + revoke endpoint | CRM-4.1 | 8h |
| F-031 | Right to erasure | Cascade delete + audit + 15d SLA monitor | CRM-4.2 | 8h |
| F-032 | Right to access | JSON export per contact | CRM-4.3 | 4h |
| F-033 | ROPA auto-gen | Daily cron + tenant admin view | CRM-4.4 | 6h |
| F-034 | Reports basic | Funnel + source attribution + time-in-stage | CRM-4.5 | 12h |
| F-035 | Tocks pilot kickoff | 1 vendedor full-time 5 dias | (User action) | — |

**🚨 GATE 3 (Week 8):** Tocks operating 100% via CRM Novo. **KILL trigger:** Tocks team rejects UX OR critical bugs blocking ops.

**V0 Total: 35 features (incluindo Week 0). 280h dev + 32h QA = 312h.**

---

## 📦 Phase V1 — Production-ready (Weeks 9-12)

### Sprint 5 (Week 9-10) — PWA + Email + Calendar

| ID | Feature | Description |
|----|---------|-------------|
| F-040 | PWA install prompt | Manifest + service worker |
| F-041 | Offline inbox cache | Last 100 msgs per conversation |
| F-042 | Push notifications | Web Push API |
| F-043 | Bottom-sheet mobile nav | NÃO hamburger |
| F-044 | Tap-to-call → log activity | Auto activity creation |
| F-045 | Camera quick-capture | Photo attachment inline |
| F-046 | Resend transactional | Notifications + confirmations |
| F-047 | Email outbound from CRM | Track opens + clicks |
| F-048 | Email inbound parse | Forward CRM-specific address |
| F-049 | Google Calendar 2-way sync | Events ↔ deals link |
| F-050 | Calendar reminders | → notification |

### Sprint 6 (Week 11-12) — Forms + Reports advanced + Templates

| ID | Feature | Description |
|----|---------|-------------|
| F-060 | Form builder no-code | Drag fields |
| F-061 | Embed code generation | iframe + JS snippet |
| F-062 | Form spam protection | Honeypot + reCAPTCHA opt-in |
| F-063 | PT-BR field types | CPF, CNPJ, phone DDD auto-detect |
| F-064 | LGPD consent checkbox | Obrigatório + audit |
| F-065 | Form submission → contact + deal | Configurable mapping |
| F-066 | Reports cohort analysis | Time-to-close by source |
| F-067 | Win/loss reason tagging | Drop-down + freeform |
| F-068 | Revenue projections | Pipeline weighted |
| F-069 | Reports export CSV/Excel | Per-tenant download |
| F-070 | Scheduled reports email | Weekly digest |
| F-071 | Message templates library | Per tenant + HSM linked |
| F-072 | Saved replies | Quick insert |
| F-073 | Auto-assignment rules | Round-robin, by source, by region |
| F-074 | SLA alerts | Lead not responded in 15min |

**V1 Total: 25 features cumulative 60. Estimate 4 weeks.**

---

## 📦 Phase V2 — AIOS-native Differentiators (Q3 2026)

### Mind Clones Integration

| ID | Feature | Description |
|----|---------|-------------|
| F-080 | In-app `@expert-consult` | Consult mind clone from CRM (any 115 clones) |
| F-081 | Auto-suggested replies | Claude/Opus 4.7 with context |
| F-082 | Deal coaching contextual | Consult neil-patel / russell-brunson on Bretda deals |
| F-083 | Copy review pre-send | ann-handley / joanna-wiebe review WhatsApp messages |

### AI Agents Contextual

| ID | Feature | Description |
|----|---------|-------------|
| F-090 | Lead qualification AI agent | Stage transition recommendation |
| F-091 | Conversation summarizer | Long threads → 3-bullet summary |
| F-092 | Sentiment analysis | Hot/warm/cold tagging auto |
| F-093 | Next-best-action per deal | AI suggestion |
| F-094 | Weekly AI reports | Text narrative + key insights |

### Advanced Integrations

| ID | Feature | Description |
|----|---------|-------------|
| F-100 | Meta Ads sync | Campaign performance inline |
| F-101 | Google Ads sync | Campaign + offline conv attribution loop |
| F-102 | Tocks/Bretda product catalog inline | Link to deals |
| F-103 | PIX payment links | BR-specific |
| F-104 | Nota fiscal integration | ME/EPP BR |

### Multi-channel Expansion

| ID | Feature | Description |
|----|---------|-------------|
| F-110 | Instagram DM ingestion | Meta unified inbox |
| F-111 | Email as channel | Mature inbound parse |
| F-112 | SMS fallback | Twilio when WhatsApp opt-out |
| F-113 | Voice notes transcription | Whisper auto |

### Observability + Admin

| ID | Feature | Description |
|----|---------|-------------|
| F-120 | Tenant admin dashboard | DPA, ROPA, audit access |
| F-121 | Performance metrics per tenant | Custom SLAs |
| F-122 | Cost per tenant breakdown | WhatsApp msg, Inngest steps, Supabase rows |
| F-123 | Alert thresholds per tenant | Configurable |
| F-124 | Customer pricing module | If venda externa Q3 decision |
| F-125 | White-label config | Logo, colors, domain (V3+) |

**V2 Total: 30 features cumulative 90. Q3 2026 (~3 months).**

---

## ❌ Killed Features (YAGNI ruthlessly)

| Killed | Reason |
|--------|--------|
| AI lead scoring V0/V1 | Defer V2 (Sales AI anti-pattern, don't repeat) |
| Video conferencing built-in | Google Meet link suffices |
| 3rd party marketplace V0/V1 | API stability not yet |
| White-label venda externa V0/V1 | NOT FOR SALE Phase 1 |
| Native mobile app V0/V1 | PWA suffices |
| Custom dashboards builder no-code | Overkill MVP |
| Workflow automation builder no-code | Defer Phase 3+ |
| Forecast AI V0/V1 | Defer Q3+ |
| Sales bot AI V0/V1 | Sales AI anti-pattern |
| AI suggestion CTA "you should..." | Anti-pattern, user controls |

---

## 🎯 Differentiators (vs SaaS BR/global)

| Differentiator | We have | Competitors |
|----------------|---------|-------------|
| WhatsApp Cloud API direto | ✅ | BSP wrapper (3rd party) |
| Bridge Meta CAPI + Google OC built-in | ✅ | Zapier fragile OR manual |
| Multi-tenant RLS append-only audit | ✅ | None public |
| Mind clones integration native | ✅ V2 | None |
| PT-BR mobile-first PWA | ✅ | Some yes (PipeRun) |
| Consent ledger + ROPA auto-gen | ✅ | Manual or absent |
| LGPD 15d SLA monitor + 72h breach runbook | ✅ | Optional/manual |

---

## ✅ V0 Acceptance Criteria (Week 8)

- [ ] Concierge MVP Week 0 validated need (NÃO triggered Customer Need Pivot)
- [ ] WhatsApp Business Verification approved (Tocks)
- [ ] Tocks vendedor responds lead em <60s do CRM
- [ ] 1 Bretda lead real → Lead Qualificado → Google Ads count match
- [ ] Inbox real-time funcionando (msg chega <2s pós-webhook)
- [ ] Multi-tenant RLS testado (cross-tenant returns empty)
- [ ] Consent ledger capturing + audit_log popula
- [ ] ROPA gerado automatically (Tocks + Bretda + Vorza)
- [ ] Right to erasure endpoint funcional
- [ ] Zero leads "void" (vs Sales AI 0 fires/30d baseline)
- [ ] Tocks team NPS ≥7/10

---

*Features Final v1.0 | Locked V0, scoped V1, directional V2 | Orion 2026-05-15*
