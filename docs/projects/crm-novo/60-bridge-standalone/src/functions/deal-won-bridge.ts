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
import { sendCapiEvent, buildPurchaseEvent } from '../lib/meta-capi.js';
import {
  uploadClickConversion,
  buildPurchaseConversion,
} from '../lib/google-oc.js';

const EVENT_TYPE: EventType = 'deal.won';
const MAX_RETRIES = 3;

function createDealWonFunction(tenantId: 'tocks' | 'bretda') {
  return inngest.createFunction(
    {
      id: `${tenantId}-deal-won-bridge`,
      name: `${tenantId} · Deal Won Bridge`,
      retries: MAX_RETRIES,
      onFailure: async ({ event, error }) => {
        const data = event.data.event.data as Record<string, unknown>;
        await createDLQ({
          tenantId: data.tenant_id as string,
          eventType: EVENT_TYPE,
          eventId: makeEventId({
            tenantId: data.tenant_id as string,
            eventType: EVENT_TYPE,
            entityId: data.deal_id as string,
            version: (data.version as string) ?? 'v1',
          }),
          destination: 'meta_capi',
          originalPayload: data,
          lastError: error.message,
          retryCount: MAX_RETRIES,
          auditLogIds: [],
        });
      },
    },
    { event: `${tenantId}/deal.won` },
    async ({ event, step, runId }) => {
      const d = event.data;
      const baseEventId = makeEventId({
        tenantId: d.tenant_id,
        eventType: EVENT_TYPE,
        entityId: d.deal_id,
        version: d.version ?? 'v1',
      });

      // Meta CAPI step
      await step.run('meta-capi', async () => {
        const startedAt = Date.now();
        const dedup = await checkIdempotency({
          eventId: baseEventId,
          destination: 'meta_capi',
        });
        if (dedup.isDuplicate) {
          await skipAudit({
            tenantId: d.tenant_id,
            eventType: EVENT_TYPE,
            eventId: baseEventId,
            entityId: d.deal_id,
            destination: 'meta_capi',
            payload: { dedup_hit: true },
            firstAuditId: dedup.firstAuditId!,
          });
          return { skipped: true };
        }

        const auditId = await startAudit({
          tenantId: d.tenant_id,
          eventType: EVENT_TYPE,
          eventId: baseEventId,
          entityId: d.deal_id,
          destination: 'meta_capi',
          payload: { ...d } as Record<string, unknown>,
          inngestRunId: runId,
        });

        try {
          const capiEvent = buildPurchaseEvent({
            eventId: baseEventId,
            whatsappE164: d.whatsapp_e164,
            email: d.email,
            valueBRL: d.valor_real,
            contentName: 'deal-won',
          });

          const response = await sendCapiEvent({
            pixelId: process.env.META_PIXEL_ID!,
            accessToken: process.env.META_ACCESS_TOKEN!,
            apiVersion: process.env.META_API_VERSION,
            testEventCode: process.env.META_TEST_EVENT_CODE,
            event: capiEvent,
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
          throw err;
        }
      });

      // Google OC step
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
            entityId: d.deal_id,
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
          entityId: d.deal_id,
          destination: 'google_oc',
          payload: { ...d } as Record<string, unknown>,
          inngestRunId: runId,
        });

        try {
          const conversionAction = process.env.GOOGLE_ADS_CONVERSION_ACTION_DEAL_WON!;
          if (!conversionAction) {
            throw new NonRetriableError(
              'GOOGLE_ADS_CONVERSION_ACTION_DEAL_WON missing'
            );
          }

          const conversion = buildPurchaseConversion({
            conversionActionResource: conversionAction,
            whatsappE164: d.whatsapp_e164,
            email: d.email,
            valueBRL: d.valor_real,
            gclid: d.gclid,
            orderId: d.order_id,
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

export const tocksDealWonBridge = createDealWonFunction('tocks');
export const bretdaDealWonBridge = createDealWonFunction('bretda');
