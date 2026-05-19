# CRM-1.2 — Supabase Auth + JWT tenant_id claim + magic link

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 8h · **Agent:** @dev

---

## User Story

**As a** usuário Tocks (Cristiane/Rudson) ou Breno (multi-tenant admin),
**I want** logar com email magic link e ter automaticamente o `tenant_id` correto no JWT,
**so that** RLS no Supabase isole meus dados sem código de aplicação se preocupar.

---

## Acceptance Criteria

- [ ] Auth flow magic link funciona end-to-end em prod (sa-east-1)
- [ ] Custom claim `tenant_id` adicionado ao JWT via Auth Hook (custom_access_token_hook)
- [ ] Endpoint `/api/auth/callback` valida sessão + redireciona pra `/dashboard`
- [ ] Server component `getCurrentUser()` retorna `{ user, tenant_id, roles[] }`
- [ ] Browser client (`@supabase/ssr`) configurado com cookies persistentes
- [ ] Logout funciona (limpa cookies + invalida session)
- [ ] Magic link email com domínio Resend autenticado (não cai em spam)
- [ ] Login bloqueado se email não está em `tenant_membership` table (CRM-1.4 cria)
- [ ] 2 emails de teste funcionam: `brenodecerqueira@gmail.com` + email teste Cristiane

---

## Technical Notes

### Custom Auth Hook (Supabase Edge Function)

Supabase Auth Hooks permitem injetar claims custom no JWT. Setup:

```typescript
// supabase/functions/custom-access-token-hook/index.ts
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const { user_id, claims } = await req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Lookup tenant_id from tenant_membership table
  const { data } = await supabase
    .from('tenant_membership')
    .select('tenant_id, role')
    .eq('user_id', user_id)
    .maybeSingle();

  if (!data) {
    // Sem membership = login bloqueado em downstream check
    return new Response(JSON.stringify({ claims }));
  }

  return new Response(
    JSON.stringify({
      claims: {
        ...claims,
        tenant_id: data.tenant_id,
        role: data.role,
      },
    })
  );
});
```

Deploy: `supabase functions deploy custom-access-token-hook`
Enable em Dashboard → Authentication → Hooks → Custom Access Token

### Browser client (@supabase/ssr)

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

### Server client com cookies

```typescript
// lib/supabase/server.ts (ampliado da CRM-1.1)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore in Server Components
          }
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    user,
    tenant_id: user.app_metadata.tenant_id as string | undefined,
    role: user.app_metadata.role as string | undefined,
  };
}
```

### Magic link template (Resend)

Configure email template em Supabase Dashboard → Authentication → Email Templates:

- Subject: `Seu link de acesso ao CRM Novo`
- Body: incluir link com `{{ .ConfirmationURL }}`
- Branding: usar logo provisório CRM (até naming final)

DNS records pra Resend domain auth:
- SPF: `v=spf1 include:resend.com ~all`
- DKIM: 3 CNAMEs fornecidos pelo Resend
- DMARC opcional Sprint 2

### Callback route handler

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(`${origin}/dashboard`);
  }

  redirect(`${origin}/auth/error`);
}
```

---

## Dependencies

- ✅ **CRM-1.1** (bootstrap)
- 🔄 **CRM-1.3** (schema com `tenant_membership` table) — pode começar em paralelo mas hook depende de schema existir

---

## Definition of Done

- [ ] PR `feat/crm-1.2-auth` mergeado
- [ ] Hook deployed Supabase
- [ ] DNS Resend propagado + email não cai em spam (testar 24h depois)
- [ ] Magic link funciona pros 2 emails de teste
- [ ] Logout limpa cookies validado em DevTools
- [ ] Code review @architect (security focus) — 1 approval
- [ ] Sem PII em logs (Sentry filter regex)

---

## File List

```
apps/crm/
├── app/auth/
│   ├── callback/route.ts
│   ├── login/page.tsx
│   ├── logout/route.ts
│   └── error/page.tsx
├── lib/supabase/
│   ├── client.ts
│   └── server.ts (ampliado)
└── lib/auth.ts (helper getCurrentUser)

supabase/functions/custom-access-token-hook/
└── index.ts
```

---

## Testes manuais

1. `/auth/login` → digita email → recebe magic link em <30s
2. Click no link → redireciona pra `/dashboard`
3. DevTools → cookies tem `sb-access-token` + `sb-refresh-token`
4. JWT decoded em jwt.io → contém `tenant_id` e `role`
5. `/auth/logout` → cookies limpos, redireciona pra `/auth/login`

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| DNS Resend não propaga em 24h | Backup: Supabase SMTP default (mas marca como Supabase) |
| Custom claim hook timing-out (>500ms) | Hook fica lean: 1 query, sem joins. Index em `tenant_membership.user_id` |
| Email cai spam mesmo com SPF/DKIM | Pedir Cristiane add `noreply@crm.synkra.com.br` em contatos |
| Session cookie HttpOnly bloqueia JS client | Sempre usar client criado via `createBrowserClient` (handles cookies right) |
| Login antes de CRM-1.4 (membership) | Hook retorna sem `tenant_id` → middleware redireciona pra `/onboarding` |

---

*Story CRM-1.2 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
