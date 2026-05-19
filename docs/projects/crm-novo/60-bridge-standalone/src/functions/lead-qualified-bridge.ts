import { NonRetriableError } from 'inngest';
import { inngest } from '../client.js';
import {
  checkIdempotency,
  recordIdempotency,
  makeEventId,
} from '../lib/idempotency.js';
import {
  startAudit,
  completeAudit,
  failAudit,
  skipAudit,
  createDLQ,
  type EventType,
} from '../lib/audit.js';
import { sendCapiEvent, buildLeadEvent } from '../lib/meta-capi.js';
import {
  uploadClickConversion,
  buildLeadConversion,
} from '../lib/google-oc.js';

const EVENT_TYPE: EventType = 'lead.qualified';
const MAX_RETRIES = 3;

/**
 * Lead Qualified Bridge — dispara Meta CAPI + Google Ads offline conv em paralelo.
 *
 * Pipeline:
 *  1. Gera idempotency key
 *  2. Verifica duplicata (idempotency table) → skip se já disparado
 *  3. Step paralelo: Meta CAPI + Google OC
 *  4. Cada chamada cria audit_log row (pending → completed/failed)
 *  5. Falha definitiva → DLQ row pra replay manual
 */
function createBridgeFunction(tenantId: 'tocks' | 'bretda') {
  return inngest.createFunction(
    {
      id: `${tenantId}-lead-qualified-bridge`,
      name: `${tenantId} · Lead Qualified Bridge`,
      retries: MAX_RETRIES,
      onFailure: async ({ event, error }) => {
        // Esgotou retries → DLQ
        const data = event.data.event.data as Record<string, unknown>;
        await createDLQ({
          tenantId: data.tenant_id as string,
          eventType: EVENT_TYPE,
          eventId: makeEventId({
            tenantId: data.tenant_id as string,
            eventType: EVENT_TYPE,
            entityId: data.lead_id as string,
            version: (data.version as string) ?? 'v1',
          }),
          destination: 'meta_capi', // pode ter falhado em ambos; marca o overall
          originalPayload: data,
          lastError: error.message,
          retryCount: MAX_RETRIES,
          auditLogIds: [],
        });
      },
    },
    { event: `${tenantId}/lead.qualified` },
    async ({ event, step, runId }) => {
      const d = event.data;
      const baseEventId = makeEventId({
        tenantId: d.tenant_id,
        eventType: EVENT_TYPE,
        entityId: d.lead_id,
        version: d.version ?? 'v1',
      });

      // ─────────────────────────────────────────────────────────
      // META CAPI step
      // ─────────────────────────────────────────────────────────
      await step.run('meta-capi', async () => {
        const startedAt = Date.now();

        // 1. Idempotency check
        const dedup = await checkIdempotency({
          eventId: baseEventId,
          destination: 'meta_capi',
        });
        if (dedup.isDuplicate) {
          await skipAudit({
            tenantId: d.tenant_id,
            eventType: EVENT_TYPE,
            eventId: baseEventId,
            entityId: d.lead_id,
            destination: 'meta_capi',
            payload: { dedup_hit: true },
            firstAuditId: dedup.firstAuditId!,
          });
          return { skipped: true };
        }

        // 2. Audit pending
        const auditId = await startAudit({
          tenantId: d.tenant_id,
          eventType: EVENT_TYPE,
          eventId: baseEventId,
          entityId: d.lead_id,
          destination: 'meta_capi',
          payload: { ...d } as Record<string, unknown>,
          inngestRunId: runId,
        });

        try {
          const capiEvent = buildLeadEvent({
            eventId: baseEventId,
            whatsappE164: d.whatsapp_e164,
            email: d.email,
            valueBRL: d.valor_estimado,
            fbc: d.fbc,
            fbp: d.fbp,
            contentName: d.ad_source,
          });

          const pixelId = process.env.META_PIXEL_ID!;
          const accessToken = process.env.META_ACCESS_TOKEN!;
          const testCode = process.env.META_TEST_EVENT_CODE;
          const apiVersion = process.env.META_API_VERSION;

          const response = await sendCapiEvent({
            pixelId,
            accessToken,
            apiVersion,
            testEventCode: testCode,
            event: capiEvent,
          });

          await completeAudit({
            auditId,
            response: response as unknown as Record<string, unknown>,
            durationMs: Date.now() - startedAt,
          });

          // Marca idempotency só após success
          await recordIdempotency({
            eventId: baseEventId,
            tenantId: d.tenant_id,
            eventType: EVENT_TYPE,
            destination: 'meta_capi',
            firstAuditId: auditId,
          });

          return response;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          await failAudit({
            auditId,
            error: msg,
            durationMs: Date.now() - startedAt,
          });
          throw err; // re-throw pra Inngest retentar
        }
      });

      // ─────────────────────────────────────────────────────────
      // GOOGLE OC step (paralelo lógico, mas serial no Inngest)
      // ─────────────────────────────────────────────────────────
      await step.run('google-oc', async () => {
        const startedAt = Date.now();

        const dedup = await checkIdempotency({
          eventId: baseEventId,
          destination: 'google_oc',
        });
        if (dedup.isDuplicate) {
          await skipAudit({
            tenantId: d.tenant_id,
            eventType: EVENT_TYPE,
            eventId: baseEventId,
            entityId: d.lead_id,
            destination: 'google_oc',
            payload: { dedup_hit: true },
            firstAuditId: dedup.firstAuditId!,
          });
          return { skipped: true };
        }

        const auditId = await startAudit({
          tenantId: d.tenant_id,
          eventType: EVENT_TYPE,
          eventId: baseEventId,
          entityId: d.lead_id,
          destination: 'google_oc',
          payload: { ...d } as Record<string, unknown>,
          inngestRunId: runId,
        });

        try {
          const conversionAction = process.env.GOOGLE_ADS_CONVERSION_ACTION_LEAD_QUALIFIED!;
          if (!conversionAction) {
            throw new NonRetriableError(
              'GOOGLE_ADS_CONVERSION_ACTION_LEAD_QUALIFIED missing — config error, no retry'
            );
          }

          const conversion = buildLeadConversion({
            conversionActionResource: conversionAction,
            whatsappE164: d.whatsapp_e164,
            email: d.email,
            valueBRL: d.valor_estimado,
            gclid: d.gclid,
            orderId: d.lead_id, // lead_id serve como order_id no upload
          });

          const response = await uploadClickConversion({
            customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
            loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
            conversion,
          });

          await completeAudit({
            auditId,
            response: response as unknown as Record<string, unknown>,
            durationMs: Date.now() - startedAt,
          });

          await recordIdempotency({
            eventId: baseEventId,
            tenantId: d.tenant_id,
            eventType: EVENT_TYPE,
            destination: 'google_oc',
            firstAuditId: auditId,
          });

          return response;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          await failAudit({
            auditId,
            error: msg,
            durationMs: Date.now() - startedAt,
          });
          throw err;
        }
      });

      return { ok: true, eventId: baseEventId };
    }
  );
}

export const tocksLeadQualifiedBridge = createBridgeFunction('tocks');
export const bretdaLeadQualifiedBridge = createBridgeFunction('bretda');
