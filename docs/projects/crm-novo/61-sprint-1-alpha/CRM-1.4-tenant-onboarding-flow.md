# CRM-1.4 — Tenant onboarding flow (create Tocks/Bretda + admin user)

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 4h · **Agent:** @dev

---

## User Story

**As a** Breno (owner do CRM Novo),
**I want** um fluxo CLI/admin pra criar tenant + admin user em <5 minutos,
**so that** Tocks e Bretda estejam configurados antes do Sprint 2 e qualquer novo negócio futuro entre em <1 dia.

---

## Acceptance Criteria

- [ ] Script CLI `pnpm onboard:tenant` aceita prompts interativos OU args (`--id=tocks --name="Tocks Móveis"`)
- [ ] Cria row em `tenant` table com id, display_name, business_type, config default
- [ ] Cria 1 pipeline default ("Vendas Padrão") com 5 stages (Novo · Qualificado · Proposta · Ganho · Perdido)
- [ ] Aceita lista de emails admins (`--admins=email1,email2`)
- [ ] Cria invite token Supabase Auth pra cada admin (não envia magic link ainda — só prepare)
- [ ] Cria row em `tenant_membership` pra cada admin com role `owner`
- [ ] Idempotente: rodar 2× com mesmo tenant_id não duplica (no-op + warning)
- [ ] Dry-run mode (`--dry-run`) imprime o que faria sem executar
- [ ] Output mostra: tenant_id criado, pipeline_id, stage_ids, admin user_ids, invite URLs
- [ ] Tocks + Bretda onboarded com sucesso ao final

---

## Technical Notes

### Script structure

```typescript
// scripts/onboard-tenant.ts
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { createInterface } from 'node:readline/promises';

const ArgsSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'must be lowercase kebab-case'),
  name: z.string().min(1),
  business_type: z.enum(['b2b_high_ticket', 'b2c', 'mixed']).default('b2b_high_ticket'),
  admins: z.array(z.string().email()).min(1),
  dry_run: z.boolean().default(false),
});

const DEFAULT_PIPELINE_STAGES = [
  { name: 'Novo', sort_order: 1, is_won: false, is_lost: false },
  { name: 'Qualificado', sort_order: 2, is_won: false, is_lost: false },
  { name: 'Proposta', sort_order: 3, is_won: false, is_lost: false },
  { name: 'Ganho', sort_order: 4, is_won: true, is_lost: false },
  { name: 'Perdido', sort_order: 5, is_won: false, is_lost: true },
];

async function onboardTenant(args: z.infer<typeof ArgsSchema>) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // 1. Check idempotência
  const { data: existing } = await supabase
    .from('tenant')
    .select('id')
    .eq('id', args.id)
    .maybeSingle();

  if (existing) {
    console.warn(`⚠ Tenant ${args.id} já existe — skipping creation`);
    return existing;
  }

  if (args.dry_run) {
    console.log('DRY RUN — would create:', args);
    return null;
  }

  // 2. Cria tenant
  const { data: tenant } = await supabase
    .from('tenant')
    .insert({
      id: args.id,
      display_name: args.name,
      business_type: args.business_type,
      config: { default_currency: 'BRL', timezone: 'America/Sao_Paulo' },
    })
    .select()
    .single();

  // 3. Cria pipeline default
  const { data: pipeline } = await supabase
    .from('pipeline')
    .insert({ tenant_id: tenant!.id, name: 'Vendas Padrão', is_default: true })
    .select()
    .single();

  // 4. Cria stages
  await supabase.from('pipeline_stage').insert(
    DEFAULT_PIPELINE_STAGES.map((s) => ({
      tenant_id: tenant!.id,
      pipeline_id: pipeline!.id,
      ...s,
    }))
  );

  // 5. Pra cada admin: invite via Supabase Auth + criar membership
  for (const email of args.admins) {
    // Generate invite link (não envia email ainda)
    const { data: invite } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { tenant_id: tenant!.id, role: 'owner' },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    });

    if (invite?.user) {
      await supabase.from('tenant_membership').insert({
        tenant_id: tenant!.id,
        user_id: invite.user.id,
        role: 'owner',
      });

      console.log(`  ✓ ${email} invited as owner`);
    }
  }

  console.log(`✓ Tenant ${tenant!.id} created with ${args.admins.length} owner(s)`);
  return tenant;
}

// CLI entry
const args = parseArgs(); // implementa parseArgs com process.argv + readline pra prompts
ArgsSchema.parseAsync(args).then(onboardTenant).catch(console.error);
```

### Uso esperado

```bash
# Onboard Tocks
pnpm onboard:tenant \
  --id=tocks \
  --name="Tocks Móveis de Luxo" \
  --admins="brenodecerqueira@gmail.com,cristiane@tocks.com.br,rudson@tocks.com.br"

# Onboard Bretda
pnpm onboard:tenant \
  --id=bretda \
  --name="Bretda Mesas de Bilhar" \
  --admins="brenodecerqueira@gmail.com"
```

### Side-effects

Ao final do onboarding Tocks:
- 1 row `tenant`
- 1 row `pipeline`
- 5 rows `pipeline_stage`
- 3 rows `tenant_membership` (Breno + Cristiane + Rudson como owners)
- 3 invite emails serão enviados quando Breno trigger magic link via admin UI ou manualmente

---

## Dependencies

- ✅ **CRM-1.1** (Supabase project + Next.js)
- ✅ **CRM-1.2** (Auth setup)
- ✅ **CRM-1.3** (schema tenant + tenant_membership + pipeline + pipeline_stage existem)

---

## Definition of Done

- [ ] PR `feat/crm-1.4-onboarding` mergeado
- [ ] `pnpm onboard:tenant --id=tocks ...` executado com sucesso
- [ ] `pnpm onboard:tenant --id=bretda ...` executado com sucesso
- [ ] Login funciona pra owner (Breno) em ambos tenants — JWT contém tenant_id correto
- [ ] Verificar no Supabase Dashboard: 2 rows em tenant, 2 em pipeline, 10 em pipeline_stage, 4 em tenant_membership (Tocks 3 + Bretda 1)
- [ ] Re-run idempotente (warning + no-op)
- [ ] Code review @architect — 1 approval

---

## File List

```
apps/crm/scripts/
└── onboard-tenant.ts

apps/crm/docs/
└── onboarding-runbook.md           # Runbook humano-friendly de onboarding
```

---

## Bônus: UI admin (Sprint 2+)

Pra novo tenant entrar em <1 dia (success metric do CONTEXT), Sprint 2 vai ter:
- `/admin/tenants` UI list
- "Add new tenant" wizard 5 steps
- Bulk invite via CSV

Mas pra Sprint 1, CLI é suficiente.

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| Invite email não chega pro Cristiane/Rudson | Logar invite URL no output do CLI — Breno copia/cola manualmente se preciso |
| `tenant_id` colado com typo (`Tocks` vs `tocks`) | Zod regex lowercase enforce |
| Race condition em paralelos invites | Aceitar — só Breno roda script, não concurrent |
| Pipeline default name muda futuramente | Stage names + sort_order ficam em constante; mudança = nova story |

---

## Onboarding runbook humano-readable

```markdown
# Como adicionar novo tenant (5 min)

1. SSH/local com env vars carregadas (Supabase service role)
2. Coleta emails dos admins do novo tenant
3. Run: pnpm onboard:tenant --id=ID --name="Display Name" --admins="email1,email2"
4. Verificar Supabase Dashboard → tenant table → row criada
5. Compartilhar invite URLs com admins
6. Admin clica link → magic link auth → entra no CRM
7. Done.
```

---

*Story CRM-1.4 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
