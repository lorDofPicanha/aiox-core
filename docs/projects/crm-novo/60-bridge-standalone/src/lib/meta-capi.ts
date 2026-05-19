import { z } from 'zod';
import { hashPII } from './idempotency.js';

const CapiUserDataSchema = z.object({
  em: z.array(z.string()).optional(),
  ph: z.array(z.string()).optional(),
  fn: z.array(z.string()).optional(),
  ln: z.array(z.string()).optional(),
  external_id: z.array(z.string()).optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
});

const CapiEventSchema = z.object({
  event_name: z.enum(['Lead', 'Purchase', 'CompleteRegistration', 'Subscribe']),
  event_time: z.number().int().positive(),
  event_id: z.string().min(1).max(40),
  action_source: z.enum(['website', 'app', 'phone_call', 'chat', 'email', 'system_generated', 'other']),
  user_data: CapiUserDataSchema,
  custom_data: z
    .object({
      value: z.number().optional(),
      currency: z.string().length(3).optional(),
      content_name: z.string().optional(),
      content_category: z.string().optional(),
    })
    .optional(),
});

export type CapiEvent = z.infer<typeof CapiEventSchema>;

export interface CapiResponse {
  events_received: number;
  fbtrace_id: string;
  messages?: string[];
}

/**
 * Envia evento ao Meta CAPI v21.0.
 * @throws Error com detalhe da resposta se status != 200
 */
export async function sendCapiEvent(args: {
  pixelId: string;
  accessToken: string;
  apiVersion?: string;
  testEventCode?: string;
  event: CapiEvent;
}): Promise<CapiResponse> {
  const validated = CapiEventSchema.parse(args.event);

  const apiVersion = args.apiVersion ?? 'v21.0';
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${args.pixelId}/events`);
  url.searchParams.set('access_token', args.accessToken);

  const body: Record<string, unknown> = {
    data: [validated],
  };
  if (args.testEventCode) {
    body.test_event_code = args.testEventCode;
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    const errMsg = JSON.stringify(json);
    throw new Error(`Meta CAPI ${res.status}: ${errMsg}`);
  }

  return {
    events_received: (json.events_received as number) ?? 0,
    fbtrace_id: (json.fbtrace_id as string) ?? '',
    messages: json.messages as string[] | undefined,
  };
}

/**
 * Helper: builda CapiEvent pra lead.qualified com PII hash automático.
 */
export function buildLeadEvent(args: {
  eventId: string;
  whatsappE164: string;
  email?: string;
  valueBRL: number;
  fbc?: string;
  fbp?: string;
  contentName?: string;
}): CapiEvent {
  const userData: z.infer<typeof CapiUserDataSchema> = {
    ph: [hashPII(args.whatsappE164.replace(/\D/g, ''))],
  };
  if (args.email) userData.em = [hashPII(args.email)];
  if (args.fbc) userData.fbc = args.fbc;
  if (args.fbp) userData.fbp = args.fbp;

  return {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: args.eventId,
    action_source: 'chat',
    user_data: userData,
    custom_data: {
      value: args.valueBRL,
      currency: 'BRL',
      content_name: args.contentName ?? 'lead-qualified',
    },
  };
}

/**
 * Helper: builda CapiEvent pra deal.won.
 */
export function buildPurchaseEvent(args: {
  eventId: string;
  whatsappE164: string;
  email?: string;
  valueBRL: number;
  contentName?: string;
}): CapiEvent {
  const userData: z.infer<typeof CapiUserDataSchema> = {
    ph: [hashPII(args.whatsappE164.replace(/\D/g, ''))],
  };
  if (args.email) userData.em = [hashPII(args.email)];

  return {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: args.eventId,
    action_source: 'chat',
    user_data: userData,
    custom_data: {
      value: args.valueBRL,
      currency: 'BRL',
      content_name: args.contentName ?? 'deal-won',
    },
  };
}
