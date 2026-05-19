# CRM-1.6 — Audit log middleware + cross-tenant E2E test

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 8h · **Agent:** @qa

---

## User Story

**As a** Breno (operador + responsible LGPD),
**I want** middleware automático que loga toda ação CRUD em `audit_log` + teste E2E que valida zero cross-tenant leak,
**so that** LGPD Art. 37 (relatório de impacto) seja defendível em auditoria sem código boilerplate em cada endpoint.

---

## Acceptance Criteria

- [ ] Middleware Next.js `withAudit()` wrapper aplicável em qualquer Server Action / Route Handler
- [ ] Captura: action (view/create/update/delete/export), resource_type, resource_id, payload_before, payload_after
- [ ] Inserção em `audit_log` é assíncrona (não bloqueia response — fire-and-forget)
- [ ] Falha de audit log NÃO derruba request principal (logado em Sentry, mas não throws)
- [ ] Helper `auditLog()` chamável manualmente em casos custom (ex: outside HTTP context)
- [ ] Captura IP + User-Agent automaticamente
- [ ] Aplica em Sprint 2+ wherever CRUD futuro acontece
- [ ] **E2E test (Playwright)** valida que User A (tenant=tocks) não vê dado de User B (tenant=bretda) em 5 endpoints
- [ ] **E2E test** valida que tentativa de injeção (`?tenant_id=bretda` query param) é ignorada
- [ ] Documentação `apps/crm/docs/audit.md` mostra "como usar" em 3 exemplos

---

## Technical Notes

### Middleware design

```typescript
// apps/crm/lib/audit/middleware.ts
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { getServiceClient } from '@/lib/supabase/service';

export type AuditAction = 'view' | 'create' | 'update' | 'delete' | 'export';

interface AuditContext {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  payloadBefore?: unknown;
  payloadAfter?: unknown;
}

export async function auditLog(ctx: AuditContext): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return; // ações anon não auditadas (Sprint 2 reavaliar)

  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headerStore.get('user-agent') ?? 'unknown';

  // Fire-and-forget — não await
  const supabase = getServiceClient();
  void supabase
    .from('audit_log')
    .insert({
      tenant_id: user.tenant_id,
      user_id: user.user.id,
      action: ctx.action,
      resource_type: ctx.resourceType,
      resource_id: ctx.resourceId,
      ip,
      user_agent: userAgent,
      payload_before: ctx.payloadBefore as never,
      payload_after: ctx.payloadAfter as never,
    })
    .then(({ error }) => {
      if (error) {
        // Log em Sentry mas não throw
        console.error('audit log insert failed', error);
      }
    });
}

/**
 * Higher-order wrapper pra Server Actions.
 * Uso:
 *   export const updateDeal = withAudit('update', 'deal')(async (input) => { ... });
 */
export function withAudit<TArgs extends unknown[], TResult>(
  action: AuditAction,
  resourceType: string
) {
  return (fn: (...args: TArgs) => Promise<TResult>) => {
    return async (...args: TArgs): Promise<TResult> => {
      const result = await fn(...args);
      // Tenta extrair resourceId do resultado se for objeto com id
      const resourceId =
        typeof result === 'object' && result !== null && 'id' in result
          ? String((result as { id: unknown }).id)
          : undefined;
      void auditLog({
        action,
        resourceType,
        resourceId,
        payloadAfter: result as never,
      });
      return result;
    };
  };
}
```

### Uso em Server Action

```typescript
// apps/crm/app/actions/deal.ts
'use server';
import { withAudit } from '@/lib/audit/middleware';

export const createDeal = withAudit('create', 'deal')(async (input: CreateDealInput) => {
  // ... cria deal ...
  return deal;
});

// OR manualmente:
import { auditLog } from '@/lib/audit/middleware';

export async function exportContacts(format: 'csv' | 'json') {
  const data = await fetchContacts();
  await auditLog({
    action: 'export',
    resourceType: 'contact',
    payloadAfter: { format, count: data.length },
  });
  return data;
}
```

### E2E Test setup (Playwright)

```typescript
// apps/crm/tests/e2e/cross-tenant.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cross-tenant isolation', () => {
  test('User tocks cannot see bretda contacts via API', async ({ page, request }) => {
    // 1. Login as Tocks user
    await page.goto('/auth/login');
    await page.fill('input[name=email]', 'tocks-test@example.com');
    await page.click('button[type=submit]');
    // (mock magic link flow — usa Supabase auth.admin.signInWithToken em test setup)

    // 2. Tentar buscar contact que pertence a bretda via API direta
    const response = await request.get('/api/contacts/BRETDA-CONTACT-ID');
    expect(response.status()).toBe(404); // RLS filtra como inexistente

    // 3. List contacts → só tocks
    const list = await request.get('/api/contacts');
    const json = await list.json();
    expect(json.every((c: { tenant_id: string }) => c.tenant_id === 'tocks')).toBe(true);
  });

  test('Query param injection ?tenant_id= é ignorado', async ({ request }) => {
    const response = await request.get('/api/contacts?tenant_id=bretda');
    // Endpoint deve usar JWT tenant_id, NÃO query param
    const json = await response.json();
    expect(json.every((c: { tenant_id: string }) => c.tenant_id === 'tocks')).toBe(true);
  });

  test('JWT tampering rejeitado', async ({ request }) => {
    const tamperedJwt = 'eyJ...adulterado-com-tenant-bretda';
    const response = await request.get('/api/contacts', {
      headers: { Authorization: `Bearer ${tamperedJwt}` },
    });
    expect(response.status()).toBe(401); // Supabase verify falha
  });

  test('audit_log row criada em update deal', async ({ page, request }) => {
    // ... cria deal, atualiza ...
    // Query audit_log e valida row existe com tenant_id correto + action='update'
  });

  test('Export endpoint loga em audit_log', async ({ request }) => {
    // ... chama /api/contacts/export ...
    // Valida audit row com action='export'
  });
});
```

### Setup test users

```typescript
// apps/crm/tests/setup/seed-test-users.ts
// Cria 2 users em 2 tenants pra testes E2E
// Roda 1× via `pnpm test:e2e:setup`
```

---

## Dependencies

- ✅ **CRM-1.1** (Next.js + Supabase)
- ✅ **CRM-1.2** (Auth + JWT tenant_id)
- ✅ **CRM-1.3** (audit_log + RLS policies)
- ✅ **CRM-1.4** (tenants Tocks + Bretda existem pra usar em testes)

---

## Definition of Done

- [ ] PR `feat/crm-1.6-audit` mergeado
- [ ] Middleware funciona em 1 Server Action de teste (criar deal dummy → audit_log row)
- [ ] 5 E2E tests passando em CI
- [ ] CI pipeline configurado com Playwright + test users seed
- [ ] Docs `apps/crm/docs/audit.md` com 3 exemplos de uso
- [ ] Code review @architect (LGPD compliance) — 1 approval
- [ ] Sentry rule: audit insert failure → low priority alert (não pager)

---

## File List

```
apps/crm/
├── lib/audit/
│   ├── middleware.ts
│   └── helpers.ts
├── tests/e2e/
│   ├── cross-tenant.spec.ts
│   ├── audit-log.spec.ts
│   └── setup/
│       └── seed-test-users.ts
├── docs/audit.md
└── playwright.config.ts
```

---

## E2E test scenarios obrigatórios

| # | Scenario | Expected |
|---|----------|----------|
| 1 | User tocks GET contact-bretda direct ID | 404 (RLS filtra) |
| 2 | User tocks GET /api/contacts list | só tocks rows |
| 3 | Query param `?tenant_id=bretda` injection | ignorado (JWT prevalece) |
| 4 | JWT manipulado | 401 (Supabase verify falha) |
| 5 | Export endpoint loga audit row | row criada com action='export' |
| 6 | Update deal cria payload_before + payload_after no audit | both populated |
| 7 | Audit insert falha (DB down) NÃO derruba request | response 200, Sentry log |
| 8 | Anon user (sem JWT) em endpoint protegido | 401 |

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| Audit insert lento atrasa response (5s+) | Fire-and-forget (`void`) — não awaita |
| Audit table cresce sem limite | Sprint 3+ adiciona partitioning por mês OR retention policy |
| PII em payload_before/after | Sprint 2 redação automática (email/phone hash) — Sprint 1 mantém raw, mas docs avisa |
| RLS test passa local mas falha prod (config diff) | Roda smoke test E2E em preview deploy automático |
| Playwright timing-flakey em CI | retry 2× + screenshots em failure |
| Service role bypass acidental | Code review checklist: `getServiceClient()` só em `/lib/audit/` e `/api/`, nunca em components |

---

## LGPD compliance map

| Lei 13.709/2018 | Implementação |
|------------------|---------------|
| Art. 9 (acesso) | audit_log com `action='view'` + `payload_after` |
| Art. 18 III (acesso aos dados) | export endpoint loga `action='export'` |
| Art. 18 VI (eliminação) | Future CRM-4.x. Atual: trigger DB pra registrar tentativa |
| Art. 37 (registro operações) | audit_log table inteira atende esse requisito |

---

*Story CRM-1.6 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
