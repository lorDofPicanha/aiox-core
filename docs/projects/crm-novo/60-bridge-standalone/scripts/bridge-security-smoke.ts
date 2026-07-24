import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type Severity = 'pass' | 'warn' | 'fail';

interface CheckResult {
  id: string;
  severity: Severity;
  message: string;
  evidence?: unknown;
}

const root = process.cwd();

function listFiles(dir: string, suffixes: string[]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...listFiles(full, suffixes));
    } else if (suffixes.some((suffix) => full.endsWith(suffix))) {
      results.push(full);
    }
  }
  return results;
}

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

function rel(path: string): string {
  return relative(root, path).replace(/\\/g, '/');
}

const sourceFiles = listFiles(join(root, 'src'), ['.ts', '.tsx']);
const scriptFiles = listFiles(join(root, 'scripts'), ['.ts']);
const sql = read(join(root, 'db', '0001_initial.sql'));
const manualTrigger = read(join(root, 'src', 'api', 'manual-trigger.ts'));
const dlqReplay = read(join(root, 'src', 'functions', 'dlq-replay.ts'));

const results: CheckResult[] = [];

const serviceRoleRefs = [...sourceFiles, ...scriptFiles]
  .filter((file) => read(file).includes('SUPABASE_SERVICE_ROLE_KEY'))
  .map(rel);

const unexpectedServiceRoleRefs = serviceRoleRefs.filter(
  (file) =>
    ![
      'src/lib/supabase.ts',
      'src/lib/env-smoke.ts',
      'scripts/bridge-live-smoke.ts',
      'scripts/bridge-security-smoke.ts',
    ].includes(file)
);

results.push({
  id: 'service-role-server-only',
  severity: unexpectedServiceRoleRefs.length === 0 ? 'pass' : 'fail',
  message:
    unexpectedServiceRoleRefs.length === 0
      ? 'SUPABASE_SERVICE_ROLE_KEY is used only in src/lib/supabase.ts; smoke scripts only check presence.'
      : 'SUPABASE_SERVICE_ROLE_KEY appears outside the centralized server-only Supabase module.',
  evidence: { serviceRoleRefs, unexpectedServiceRoleRefs },
});

results.push({
  id: 'manual-trigger-bearer-auth',
  severity:
    manualTrigger.includes("request.headers.get('authorization')") &&
    manualTrigger.includes('MANUAL_TRIGGER_TOKEN')
      ? 'pass'
      : 'fail',
  message: 'Manual trigger must require Authorization: Bearer MANUAL_TRIGGER_TOKEN.',
});

results.push({
  id: 'idempotency-destination-key',
  severity: sql.includes('PRIMARY KEY (event_id, destination)') ? 'pass' : 'fail',
  message: 'Bridge idempotency must be keyed by event_id + destination.',
});

results.push({
  id: 'bridge-tables-rls-enabled',
  severity:
    sql.includes('ALTER TABLE bridge_audit_log ENABLE ROW LEVEL SECURITY') &&
    sql.includes('ALTER TABLE bridge_idempotency ENABLE ROW LEVEL SECURITY') &&
    sql.includes('ALTER TABLE bridge_dlq ENABLE ROW LEVEL SECURITY')
      ? 'pass'
      : 'fail',
  message: 'Bridge tables must have RLS enabled.',
});

results.push({
  id: 'dlq-replay-audit-gap',
  severity: dlqReplay.includes('requested_by') && dlqReplay.includes('resolved_by')
    ? 'warn'
    : 'fail',
  message:
    'DLQ replay records requested_by/resolved_by, but authorization remains Inngest-event-level and must be hardened before production.',
});

results.push({
  id: 'whatsapp-webhook-signature-gap',
  severity: 'warn',
  message:
    'No WhatsApp webhook exists yet. Sprint 2 webhook must include Meta signature verification before ingesting live messages.',
});

const summary = {
  pass: results.filter((result) => result.severity === 'pass').length,
  warn: results.filter((result) => result.severity === 'warn').length,
  fail: results.filter((result) => result.severity === 'fail').length,
};

console.log(JSON.stringify({ summary, results }, null, 2));

if (summary.fail > 0) {
  process.exitCode = 1;
}
