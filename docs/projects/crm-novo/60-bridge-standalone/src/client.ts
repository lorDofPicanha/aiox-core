import { EventSchemas, Inngest as InngestClient } from 'inngest';
import { z } from 'zod';

/**
 * Event schemas — validados antes do dispatch.
 */
export const eventSchemas = {
  'tocks/lead.qualified': {
    data: z.object({
      tenant_id: z.literal('tocks'),
      lead_id: z.string().min(1),
      whatsapp_e164: z.string().regex(/^\+\d{10,15}$/, 'must be E.164 like +5511999999999'),
      email: z.string().email().optional(),
      valor_estimado: z.number().nonnegative(),
      ad_source: z.string().optional(),
      gclid: z.string().optional(),
      fbc: z.string().optional(),
      fbp: z.string().optional(),
      version: z.string().default('v1'),
    }),
  },
  'bretda/lead.qualified': {
    data: z.object({
      tenant_id: z.literal('bretda'),
      lead_id: z.string().min(1),
      whatsapp_e164: z.string().regex(/^\+\d{10,15}$/),
      email: z.string().email().optional(),
      valor_estimado: z.number().nonnegative(),
      ad_source: z.string().optional(),
      gclid: z.string().optional(),
      fbc: z.string().optional(),
      fbp: z.string().optional(),
      version: z.string().default('v1'),
    }),
  },
  'tocks/deal.won': {
    data: z.object({
      tenant_id: z.literal('tocks'),
      deal_id: z.string().min(1),
      lead_id: z.string().min(1),
      whatsapp_e164: z.string().regex(/^\+\d{10,15}$/),
      email: z.string().email().optional(),
      valor_real: z.number().positive(),
      gclid: z.string().optional(),
      order_id: z.string().min(1),
      version: z.string().default('v1'),
    }),
  },
  'bretda/deal.won': {
    data: z.object({
      tenant_id: z.literal('bretda'),
      deal_id: z.string().min(1),
      lead_id: z.string().min(1),
      whatsapp_e164: z.string().regex(/^\+\d{10,15}$/),
      email: z.string().email().optional(),
      valor_real: z.number().positive(),
      gclid: z.string().optional(),
      order_id: z.string().min(1),
      version: z.string().default('v1'),
    }),
  },
  'bridge/dlq.replay-requested': {
    data: z.object({
      dlq_id: z.string().uuid(),
      requested_by: z.string(),
    }),
  },
} as const;

/**
 * Inngest client. Importado em todos os arquivos de function + api handler.
 */
export const inngest = new InngestClient({
  id: 'crm-bridge-standalone',
  schemas: new EventSchemas().fromZod(eventSchemas),
  // eventKey + signingKey lidos automaticamente das env vars
});

export type CrmBridgeInngest = typeof inngest;
