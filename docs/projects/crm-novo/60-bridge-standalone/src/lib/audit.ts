import { getSupabase } from './supabase.js';

export type AuditStatus = 'pending' | 'completed' | 'failed' | 'skipped_duplicate';
export type Destination = 'meta_capi' | 'google_oc';
export type EventType = 'lead.qualified' | 'deal.won' | 'lead.created';

export interface AuditRow {
  tenantId: string;
  eventType: EventType;
  eventId: string;
  entityId: string;
  destination: Destination;
  payload: Record<string, unknown>;
  inngestRunId?: string;
}

/**
 * Cria audit_log row em status `pending`. Retorna o id.
 */
export async function startAudit(args: AuditRow): Promise<string> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('bridge_audit_log')
    .insert({
      tenant_id: args.tenantId,
      event_type: args.eventType,
      event_id: args.eventId,
      entity_id: args.entityId,
      destination: args.destination,
      status: 'pending',
      payload: args.payload,
      inngest_run_id: args.inngestRunId,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`audit start failed: ${error?.message ?? 'no data'}`);
  }
  return data.id as string;
}

/**
 * Marca audit row como completed com response + duration.
 */
export async function completeAudit(args: {
  auditId: string;
  response: Record<string, unknown>;
  durationMs: number;
}): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('bridge_audit_log')
    .update({
      status: 'completed',
      response: args.response,
      duration_ms: args.durationMs,
      completed_at: new Date().toISOString(),
    })
    .eq('id', args.auditId);

  if (error) throw new Error(`audit complete failed: ${error.message}`);
}

/**
 * Marca audit row como failed com erro + duration.
 */
export async function failAudit(args: {
  auditId: string;
  error: string;
  response?: Record<string, unknown>;
  durationMs: number;
}): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('bridge_audit_log')
    .update({
      status: 'failed',
      error: args.error,
      response: args.response ?? null,
      duration_ms: args.durationMs,
      completed_at: new Date().toISOString(),
    })
    .eq('id', args.auditId);

  if (error) throw new Error(`audit fail update failed: ${error.message}`);
}

/**
 * Cria audit row com status `skipped_duplicate` (idempotency hit).
 */
export async function skipAudit(args: {
  tenantId: string;
  eventType: EventType;
  eventId: string;
  entityId: string;
  destination: Destination;
  payload: Record<string, unknown>;
  firstAuditId: string;
}): Promise<void> {
  const supabase = getSupabase();

  await supabase.from('bridge_audit_log').insert({
    tenant_id: args.tenantId,
    event_type: args.eventType,
    event_id: args.eventId,
    entity_id: args.entityId,
    destination: args.destination,
    status: 'skipped_duplicate',
    payload: { ...args.payload, _idempotency_match: args.firstAuditId },
    duration_ms: 0,
    completed_at: new Date().toISOString(),
  });
}

/**
 * Cria DLQ row quando função esgotou retries.
 */
export async function createDLQ(args: {
  tenantId: string;
  eventType: EventType;
  eventId: string;
  destination: Destination;
  originalPayload: Record<string, unknown>;
  lastError: string;
  retryCount: number;
  auditLogIds: string[];
}): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from('bridge_dlq').insert({
    tenant_id: args.tenantId,
    event_type: args.eventType,
    event_id: args.eventId,
    destination: args.destination,
    original_payload: args.originalPayload,
    last_error: args.lastError,
    retry_count: args.retryCount,
    audit_log_ids: args.auditLogIds,
  });

  if (error) throw new Error(`DLQ create failed: ${error.message}`);
}
