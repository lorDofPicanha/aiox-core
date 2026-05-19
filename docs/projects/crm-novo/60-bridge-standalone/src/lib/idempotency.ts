import { createHash } from 'node:crypto';
import { getSupabase } from './supabase.js';

/**
 * Gera idempotency key determinística a partir do payload do evento.
 * Mesmo input → mesma key, sempre. Permite retry seguro.
 *
 * Formato: `{tenant}_{type}_{entity}_{version}_{hash8}`
 * Ex: `tocks_lead.qualified_lead_abc123_v1_d4f2a1b8`
 */
export function makeEventId(args: {
  tenantId: string;
  eventType: string;
  entityId: string;
  version?: string;
  extra?: Record<string, unknown>;
}): string {
  const { tenantId, eventType, entityId, version = 'v1', extra } = args;

  const canonical = JSON.stringify({
    tenant: tenantId,
    type: eventType,
    entity: entityId,
    version,
    extra: extra ?? null,
  });

  const hash = createHash('sha256').update(canonical).digest('hex').slice(0, 8);
  return `${tenantId}_${eventType}_${entityId}_${version}_${hash}`;
}

/**
 * Hash PII (email, phone) com SHA-256 lowercase trimmed — formato exigido pelo Meta CAPI.
 */
export function hashPII(raw: string): string {
  return createHash('sha256').update(raw.toLowerCase().trim()).digest('hex');
}

/**
 * Checa se este event_id+destination já foi processado.
 * Retorna o audit_id da primeira chamada se duplicate.
 */
export async function checkIdempotency(args: {
  eventId: string;
  destination: 'meta_capi' | 'google_oc';
}): Promise<{ isDuplicate: boolean; firstAuditId?: string }> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('bridge_idempotency')
    .select('first_audit_id')
    .eq('event_id', args.eventId)
    .eq('destination', args.destination)
    .maybeSingle();

  if (error) {
    throw new Error(`idempotency check failed: ${error.message}`);
  }

  if (data) {
    return { isDuplicate: true, firstAuditId: data.first_audit_id as string };
  }

  return { isDuplicate: false };
}

/**
 * Registra event_id como processado (1ª chamada). Retorna false se conflito (duplicate race).
 * Race condition é safe: UNIQUE constraint no PK garante apenas 1 row.
 */
export async function recordIdempotency(args: {
  eventId: string;
  tenantId: string;
  eventType: string;
  destination: 'meta_capi' | 'google_oc';
  firstAuditId: string;
}): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase.from('bridge_idempotency').insert({
    event_id: args.eventId,
    tenant_id: args.tenantId,
    event_type: args.eventType,
    destination: args.destination,
    first_audit_id: args.firstAuditId,
  });

  // 23505 = unique_violation — race condition, outra chamada ganhou
  if (error?.code === '23505') return false;
  if (error) throw new Error(`idempotency record failed: ${error.message}`);
  return true;
}
