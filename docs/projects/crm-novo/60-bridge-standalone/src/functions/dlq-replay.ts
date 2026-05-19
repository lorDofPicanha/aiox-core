import { inngest } from '../client.js';
import { getSupabase } from '../lib/supabase.js';

/**
 * DLQ Replay — manual trigger via Inngest event `bridge/dlq.replay-requested`.
 * Pega 1 DLQ row, re-dispara o event original, marca como resolving.
 */
export const dlqReplay = inngest.createFunction(
  {
    id: 'bridge-dlq-replay',
    name: 'Bridge · DLQ Replay (manual)',
    retries: 1,
  },
  { event: 'bridge/dlq.replay-requested' },
  async ({ event, step }) => {
    const { dlq_id, requested_by } = event.data;
    const supabase = getSupabase();

    // 1. Fetch DLQ row
    const dlqRow = await step.run('fetch-dlq', async () => {
      const { data, error } = await supabase
        .from('bridge_dlq')
        .select('*')
        .eq('id', dlq_id)
        .eq('status', 'open')
        .single();

      if (error || !data) {
        throw new Error(`DLQ row ${dlq_id} not found or not open: ${error?.message}`);
      }
      return data;
    });

    // 2. Mark replaying
    await step.run('mark-replaying', async () => {
      await supabase
        .from('bridge_dlq')
        .update({ status: 'replaying' })
        .eq('id', dlq_id);
    });

    // 3. Re-dispatch original event
    const originalEventName = `${dlqRow.tenant_id}/${dlqRow.event_type}`;
    await step.sendEvent('replay-original', {
      name: originalEventName,
      data: dlqRow.original_payload,
    });

    // 4. Mark resolved (otimista — se falhar de novo cria nova DLQ row)
    await step.run('mark-resolved', async () => {
      await supabase
        .from('bridge_dlq')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: requested_by,
          resolved_notes: 'replayed via dlq-replay function',
        })
        .eq('id', dlq_id);
    });

    return { ok: true, replayed: originalEventName, dlq_id };
  }
);
