# CRM-1.5 — Inngest setup + signing keys + first workflow scaffold

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 4h · **Agent:** @dev

---

## User Story

**As a** developer prep'ing CRM Novo pra background jobs (envio CAPI, sync Open Finance, recompute pipelines),
**I want** Inngest configurado com signing keys + 1 workflow hello-world rodando,
**so that** Sprint 2-3 (WhatsApp + Bridge migration) tenha plumbing pronta sem refator.

---

## Acceptance Criteria

- [ ] Inngest app criado em `app.inngest.com` com nome `crm-novo-prod`
- [ ] `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` em env vars Vercel
- [ ] Endpoint `/api/inngest` configurado via `inngest/next` serve handler
- [ ] 1 workflow `hello-world` rodando — dispara via curl, executa, retorna result
- [ ] Workflow `hello-world` faz: log start → sleep 2s → query Supabase `tenant` table → log end
- [ ] Inngest Dashboard mostra function rodando + retentando em failure
- [ ] Dev local: `pnpm dev` + `inngest-cli dev` sobem juntos sem conflito
- [ ] Documentação `apps/crm/docs/inngest.md` com 5 passos de "como adicionar nova function"
- [ ] Signing key rotation runbook documentado (caso vazamento futuro)

---

## Technical Notes

### Setup Inngest

```typescript
// apps/crm/lib/inngest/client.ts
import { Inngest, EventSchemas } from 'inngest';
import { z } from 'zod';

// Schema definitions (vai crescer em Sprint 2+)
export const eventSchemas = {
  'crm/hello-world': {
    data: z.object({
      tenant_id: z.string(),
      message: z.string().default('hello'),
    }),
  },
} as const;

export const inngest = new Inngest({
  id: 'crm-novo',
  schemas: new EventSchemas().fromZod(eventSchemas),
});
```

### Hello-world function

```typescript
// apps/crm/lib/inngest/functions/hello-world.ts
import { inngest } from '../client';
import { getServiceClient } from '@/lib/supabase/service';

export const helloWorld = inngest.createFunction(
  {
    id: 'crm-hello-world',
    name: 'CRM · Hello World (smoke test)',
    retries: 2,
  },
  { event: 'crm/hello-world' },
  async ({ event, step, logger }) => {
    logger.info('Hello world function started', { event });

    // Wait 2s
    await step.sleep('wait-2s', '2s');

    // Query DB usando service role
    const tenant = await step.run('fetch-tenant', async () => {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from('tenant')
        .select('id, display_name, business_type')
        .eq('id', event.data.tenant_id)
        .single();
      if (error) throw new Error(`tenant fetch failed: ${error.message}`);
      return data;
    });

    logger.info('Tenant fetched', { tenant });

    return {
      ok: true,
      tenant_id: tenant.id,
      message: `Hello from CRM Novo, ${tenant.display_name}!`,
      processed_at: new Date().toISOString(),
    };
  }
);
```

### Webhook handler

```typescript
// apps/crm/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { helloWorld } from '@/lib/inngest/functions/hello-world';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
```

### Service-role Supabase helper (server-only)

```typescript
// apps/crm/lib/supabase/service.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let cached: ReturnType<typeof createClient> | null = null;

export function getServiceClient() {
  if (cached) return cached;
  cached = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
```

### Dev local

```bash
# Terminal 1
pnpm dev --filter=@aios/crm

# Terminal 2
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Inngest dev UI abre em `localhost:8288`.

### Test dispatch

```bash
# Pelo Inngest dev UI:
# 1. Abre http://localhost:8288
# 2. Send event → name `crm/hello-world`
# 3. Payload: { "data": { "tenant_id": "tocks", "message": "test" } }
# 4. Watch function run + steps

# Ou via curl direto pra dev server:
curl -X POST http://localhost:8288/e/test \
  -H "Content-Type: application/json" \
  -d '{"name": "crm/hello-world", "data": {"tenant_id": "tocks"}}'
```

### Prod env vars

```bash
INNGEST_EVENT_KEY=xxx     # gerar em app.inngest.com → Manage → Event Keys
INNGEST_SIGNING_KEY=xxx   # idem → Signing Keys
```

---

## Dependencies

- ✅ **CRM-1.1** (Next.js app + Supabase project)
- 🔄 **CRM-1.3** (tabela `tenant` precisa existir pra hello-world query funcionar)
- ⏸ **CRM-1.4** opcional (tenant `tocks` precisa ter sido onboarded pra query retornar data — caso contrário hello-world dá empty)

---

## Definition of Done

- [ ] PR `feat/crm-1.5-inngest` mergeado
- [ ] Inngest production app criado e linkado ao Vercel deploy
- [ ] Hello-world executou 1× em prod com sucesso (log visível Inngest dashboard)
- [ ] Failure retry comprovado (mata DB temporariamente, função retenta 2× e falha cleanly)
- [ ] Docs `apps/crm/docs/inngest.md` escritos
- [ ] Code review @architect — 1 approval

---

## File List

```
apps/crm/
├── app/api/inngest/route.ts
├── lib/inngest/
│   ├── client.ts
│   └── functions/
│       └── hello-world.ts
├── lib/supabase/service.ts
└── docs/inngest.md
```

---

## Migração Bridge Standalone → Sprint 3

Quando Sprint 3 (week 5-7) começar, Bridge Standalone migra de `docs/projects/crm-novo/60-bridge-standalone/` pra `apps/crm/lib/inngest/functions/bridges/`.

Estrutura final em Sprint 3:

```
apps/crm/lib/inngest/
├── client.ts (com schemas extras)
└── functions/
    ├── hello-world.ts            # mantém pra smoke test
    ├── bridges/
    │   ├── lead-qualified.ts     # vem do Bridge Standalone
    │   ├── deal-won.ts           # vem do Bridge Standalone
    │   └── dlq-replay.ts         # vem do Bridge Standalone
    ├── whatsapp/
    │   ├── webhook-process.ts    # Sprint 2
    │   └── outbound-send.ts      # Sprint 2
    └── ...
```

CRM-1.5 só prepara plumbing — não move código ainda.

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| Signing key exposed em PR | `.env.local` em .gitignore + secret scanning GitHub Actions |
| Inngest free tier excedido (50k steps/mês) | Hello-world chamado raramente. Monitorar dashboard mensal |
| Dev server Inngest conflita Next.js port | Inngest dev usa 8288, Next.js 3000 — sem overlap |
| Function timeout em prod (Vercel Hobby 10s) | Workflows usam `step.sleep` e `step.run` — cada step <10s independente |

---

*Story CRM-1.5 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
