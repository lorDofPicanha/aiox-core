# ADR-001 — Modular Monolith and Provider Boundaries

**Date:** 2026-07-10  
**Status:** Accepted for V0/Sprint 1  
**Project:** CRM Novo  
**Decision owners:** `@aios-master`, `@architect`, `@dev`, `@data-engineer`

---

## Context

CRM Novo is being restarted as a Bridge-first, WhatsApp-first internal platform for Tocks and Bretda.

The project must solve:

- reliable Meta CAPI + Google conversions/Data Manager feedback
- tenant-safe lead operations
- WhatsApp-first sales workflow
- LGPD evidence and auditability

The main risk is not inability to create CRM screens. The risk is building a broad CRM before proving the bridge and operational workflow.

This ADR applies the clone review from:

- `docs/projects/crm-novo/70-restart-2026-07-10/02-real-clone-review.md`

And the Sprint 0 audit from:

- `docs/projects/crm-novo/70-restart-2026-07-10/03-sprint-0-bridge-audit.md`

---

## Decision

CRM Novo V0 will be a **modular monolith**.

One deployable app owns the product surface and bridge execution boundaries. Internal modules are kept explicit enough that they can be extracted later if operational pressure proves extraction is worth it.

No microservices in V0.

---

## Bounded Contexts

| Context | Responsibility | Must not do |
|---|---|---|
| `auth-tenants` | Auth, tenant membership, role claims, RLS context | Send conversion events or own sales domain logic |
| `crm-core` | Contacts, deals, pipeline stages, activities | Call Meta/Google directly |
| `messaging` | WhatsApp inbound/outbound, conversation timeline, media metadata | Decide attribution upload rules |
| `conversion-bridge` | Meta CAPI, Google UploadClick/Data Manager, idempotency, DLQ, reconcile | Render sales UI or bypass audit |
| `lgpd-compliance` | Consent ledger, DSAR tracking, audit policy, privacy evidence | Own ad optimization logic |
| `reports` | Funnel, response time, attribution health, bridge reconciliation | Mutate core CRM records |

---

## Provider Boundaries

External systems must be wrapped behind provider modules. Route handlers and UI code must not call vendor SDKs directly.

| Provider | Boundary | Notes |
|---|---|---|
| Google Ads UploadClick | `GoogleConversionProvider` | Legacy/grandfathered route only if token is eligible |
| Google Data Manager | `GoogleConversionProvider` | Default planning route after 2026-06-15 unless token eligibility is proven |
| Meta CAPI | `MetaConversionProvider` | Must use stable event IDs and audit every call |
| WhatsApp Cloud API | `WhatsAppProvider` | Must verify webhooks before live ingestion |
| Supabase | `TenantDataStore` / server-only client | Service role stays server-only; user reads go through RLS |
| Inngest | `WorkflowScheduler` | Durable retries, DLQ replay, reconcile jobs |

---

## Consequences

Positive:

- Faster Sprint 1 delivery.
- Lower operational complexity for solo-founder execution.
- Easier testing of tenant/RLS/data invariants.
- Provider boundaries preserve future extraction options.

Negative:

- Monolith discipline must be actively enforced.
- Inngest already introduces distributed workflow state, so idempotency and audit are mandatory.
- A poorly enforced boundary would become direct SDK calls scattered across route handlers.

---

## Kill Signals

Pause implementation and refactor before continuing if any of these happen:

1. A route handler calls Google/Meta directly instead of provider boundary.
2. `SUPABASE_SERVICE_ROLE_KEY` appears outside server-only data modules or smoke scripts.
3. A tenant table is created without RLS and a cross-tenant test.
4. A conversion event can be replayed without idempotency and audit.
5. UI work starts before bridge route is live-classified.

---

## Migration Path

If V1 volume or operational needs justify extraction:

1. Extract `conversion-bridge` first, because it has clear event contracts.
2. Keep `crm-core` and `messaging` together until WhatsApp volume proves otherwise.
3. Extract `reports` only if analytical queries interfere with operational writes.
4. Do not extract `lgpd-compliance`; keep compliance close to data ownership unless a dedicated governance service exists.

---

## Related Stories

- `CRM-0.1`
- `CRM-0.2`
- `CRM-0.3`
- `CRM-0.4`

