# CRM-0.2 — Google Data Manager Research

**Date:** 2026-07-10  
**Story:** `docs/stories/active/CRM-0.2-google-data-manager-fallback-probe.md`

---

## Official Findings

1. Google Ads API docs warn that starting **2026-06-15**, `UploadClickConversion` requests fail when the developer token has not previously sent offline conversions or enhanced conversions for leads. Google directs those integrations to the Data Manager API.
2. Google recommends enhanced conversions for leads for offline conversion imports because GCLIDs plus user-provided data improve durability and performance.
3. Data Manager API supports sending Google Ads offline conversions and enhanced conversions for leads.
4. Data Manager event sending requires a `Destination` plus formatted/hashed event data; success responses return a `requestId` for diagnostics.
5. For Google Ads offline conversions/enhanced conversions for leads, `productDestinationId` must be the Google Ads conversion action ID with type `UPLOAD_CLICKS`.

Sources:

- Google Ads API offline conversions: https://developers.google.com/google-ads/api/docs/conversions/upload-offline
- Data Manager Google Ads offline conversions: https://developers.google.com/data-manager/api/devguides/events/google-ads/offline
- Data Manager send events: https://developers.google.com/data-manager/api/devguides/events/send-events

---

## Decision

Classification remains `data-manager-needed` unless Breno confirms that the existing Google Ads developer token successfully uploaded offline/enhanced lead conversions before **2026-06-15**.

The bridge can keep the existing `uploadClickConversions` code path as a legacy/grandfathered route, but production planning should assume Data Manager API is required.

---

## Implementation Notes

Added:

- `src/lib/google-conversion-route.ts`
- `scripts/google-route-probe.ts`
- `pnpm google:probe`

The probe is intentionally no-credential by default. It:

- checks env shape
- classifies the route
- emits a Data Manager sample request in `validateOnly` mode shape
- does not call live Google APIs

