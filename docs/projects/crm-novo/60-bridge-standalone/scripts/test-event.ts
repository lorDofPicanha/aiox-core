#!/usr/bin/env tsx
/**
 * Test event dispatcher — roda lead.qualified + deal.won contra dev local OU staging.
 * Uso:
 *   pnpm test:event
 *   pnpm test:event --target=staging
 *   pnpm test:event --tenant=bretda --skip-deal
 */

import { setTimeout as sleep } from 'node:timers/promises';

interface Args {
  target: 'local' | 'staging';
  tenant: 'tocks' | 'bretda';
  skipLead: boolean;
  skipDeal: boolean;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const out: Args = {
    target: 'local',
    tenant: 'tocks',
    skipLead: false,
    skipDeal: false,
  };
  for (const a of args) {
    if (a.startsWith('--target=')) out.target = a.split('=')[1] as Args['target'];
    if (a.startsWith('--tenant=')) out.tenant = a.split('=')[1] as Args['tenant'];
    if (a === '--skip-lead') out.skipLead = true;
    if (a === '--skip-deal') out.skipDeal = true;
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const baseUrl =
    args.target === 'staging'
      ? process.env.STAGING_BASE_URL ?? 'https://your-vercel-staging.vercel.app'
      : 'http://localhost:3000';
  const token = process.env.MANUAL_TRIGGER_TOKEN;
  if (!token) {
    console.error('MANUAL_TRIGGER_TOKEN env var required (em .env.local)');
    process.exit(1);
  }

  const ts = Date.now();
  const leadId = `test_lead_${ts}`;
  const dealId = `test_deal_${ts}`;

  console.log(`\n→ Target: ${baseUrl}`);
  console.log(`→ Tenant: ${args.tenant}\n`);

  // Lead Qualified
  if (!args.skipLead) {
    console.log('▶ Disparando lead.qualified...');
    const r1 = await fetch(`${baseUrl}/api/manual-trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'lead.qualified',
        tenant: args.tenant,
        lead_id: leadId,
        whatsapp_e164: '+5511999998888',
        email: 'test@example.com',
        valor_estimado: 18000,
        ad_source: 'test_event_script',
        gclid: 'Cj0KCQiAxxxxxxxx_test_xxx',
      }),
    });
    const j1 = (await r1.json()) as Record<string, unknown>;
    console.log(`  ${r1.status} →`, j1);
  }

  // Aguarda Inngest processar antes do Deal Won
  if (!args.skipLead && !args.skipDeal) {
    console.log('\n⏳ Aguardando 5s pra Inngest processar lead...\n');
    await sleep(5000);
  }

  // Deal Won (referencia mesmo lead)
  if (!args.skipDeal) {
    console.log('▶ Disparando deal.won...');
    const r2 = await fetch(`${baseUrl}/api/manual-trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'deal.won',
        tenant: args.tenant,
        deal_id: dealId,
        lead_id: leadId,
        whatsapp_e164: '+5511999998888',
        email: 'test@example.com',
        valor_real: 18500,
        gclid: 'Cj0KCQiAxxxxxxxx_test_xxx',
        order_id: `order_${ts}`,
      }),
    });
    const j2 = (await r2.json()) as Record<string, unknown>;
    console.log(`  ${r2.status} →`, j2);
  }

  console.log('\n✓ Done. Verifica:');
  console.log(`   - Inngest dashboard: http://localhost:8288 (ou app.inngest.com)`);
  console.log(`   - Supabase bridge_audit_log → 4 rows (lead × meta+google, deal × meta+google)`);
  console.log(`   - Meta Events Manager → Test Events (TEST12345)`);
  console.log(`   - Google Ads → Conversions upload (~24h delay)\n`);
}

main().catch((err) => {
  console.error('Test event failed:', err);
  process.exit(1);
});
