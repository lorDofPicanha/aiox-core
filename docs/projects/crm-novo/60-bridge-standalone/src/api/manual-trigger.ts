import { z } from 'zod';
import { inngest } from '../client.js';

/**
 * Manual trigger endpoint — Week 0 dogfooding entry point.
 * Auth: Bearer token simples (substitui por Supabase JWT em Sprint 1).
 *
 * Uso:
 *   curl -X POST https://your-app/api/manual-trigger \
 *     -H "Authorization: Bearer $MANUAL_TRIGGER_TOKEN" \
 *     -H "Content-Type: application/json" \
 *     -d '{"type": "lead.qualified", "tenant": "tocks", ...}'
 */

const TriggerLeadSchema = z.object({
  type: z.literal('lead.qualified'),
  tenant: z.enum(['tocks', 'bretda']),
  lead_id: z.string().min(1),
  whatsapp_e164: z.string().regex(/^\+\d{10,15}$/),
  email: z.string().email().optional(),
  valor_estimado: z.number().nonnegative(),
  ad_source: z.string().optional(),
  gclid: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  version: z.string().default('v1'),
});

const TriggerDealSchema = z.object({
  type: z.literal('deal.won'),
  tenant: z.enum(['tocks', 'bretda']),
  deal_id: z.string().min(1),
  lead_id: z.string().min(1),
  whatsapp_e164: z.string().regex(/^\+\d{10,15}$/),
  email: z.string().email().optional(),
  valor_real: z.number().positive(),
  gclid: z.string().optional(),
  order_id: z.string().min(1),
  version: z.string().default('v1'),
});

const TriggerSchema = z.discriminatedUnion('type', [TriggerLeadSchema, TriggerDealSchema]);

export async function POST(request: Request): Promise<Response> {
  // 1. Auth
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const expected = process.env.MANUAL_TRIGGER_TOKEN;

  if (!expected || token !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const parsed = TriggerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'invalid payload', issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const payload = parsed.data;

  // 3. Dispatch Inngest event
  const eventName = `${payload.tenant}/${payload.type}` as const;
  const { type: _omit, tenant: _omit2, ...rest } = payload;

  try {
    const result = await inngest.send({
      name: eventName,
      data: { tenant_id: payload.tenant, ...rest } as never,
    });

    return Response.json({
      ok: true,
      event_id_inngest: result.ids[0],
      event_name: eventName,
      dispatched_at: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: 'dispatch failed', message: msg }, { status: 500 });
  }
}
