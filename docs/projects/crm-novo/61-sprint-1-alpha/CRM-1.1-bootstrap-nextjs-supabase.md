# CRM-1.1 — Bootstrap Next.js 16 monorepo + Supabase project

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 8h · **Agent:** @dev

---

## User Story

**As a** developer iniciando o CRM Novo,
**I want** um monorepo Next.js 16 limpo conectado a um Supabase project sa-east-1,
**so that** as próximas stories tenham base sólida pra construir features sem refator estrutural.

---

## Acceptance Criteria

- [ ] Repositório aios-monorepo tem nova app `apps/crm/` com Next.js 16 (App Router + Turbopack)
- [ ] TypeScript strict mode + `noUncheckedIndexedAccess` habilitado
- [ ] ESLint + Prettier configurados (sem warnings em `pnpm lint`)
- [ ] `pnpm dev --filter=@aios/crm` sobe em `localhost:3000` sem erro
- [ ] Página `/` renderiza "CRM Novo · Sprint 1" com server component
- [ ] Supabase project criado em `sa-east-1` (region São Paulo)
- [ ] `@supabase/supabase-js` instalado e cliente server-only configurado em `lib/supabase/server.ts`
- [ ] `.env.local` template com vars Supabase (sem valores reais) em `apps/crm/.env.example`
- [ ] `pnpm typecheck` passa sem erros
- [ ] Deploy Vercel preview funciona via push em PR

---

## Technical Notes

### Estrutura de pastas

```
apps/crm/
├── app/
│   ├── (marketing)/          # rotas públicas
│   │   └── page.tsx
│   ├── (app)/                # rotas autenticadas (Sprint 1.2)
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── supabase/
│   │   ├── server.ts         # service_role + auth client (server-only)
│   │   └── client.ts         # anon key (browser-safe) — adicionado em 1.2
│   ├── utils/
│   └── env.ts                # zod-validated env loading
├── components/
├── public/
├── next.config.mjs
├── tsconfig.json
├── package.json
└── .env.example
```

### Stack confirmada

```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "@supabase/supabase-js": "^2.50.0",
  "@supabase/ssr": "^0.5.0",
  "zod": "^3.24.0",
  "typescript": "^5.6.0"
}
```

### Supabase project setup (manual via UI)

1. `supabase.com/dashboard` → New project
2. Name: `crm-novo-prod` (ou `crm-novo-staging` se duplo project)
3. Region: **South America (São Paulo)** — `sa-east-1`
4. Database password: salvar em 1Password
5. Anotar: `Project URL` + `anon key` + `service_role key` + `db connection string`

### Env vars necessárias

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx  # browser-safe
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx       # server-only, NUNCA expor
SUPABASE_DB_URL=postgresql://...         # pra migrations
```

### Validação env via zod

```typescript
// lib/env.ts
import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);
```

Garante que falta de env var quebra build, não runtime silencioso.

### tsconfig.json (strict)

Reusar config do Bridge Standalone (`60-bridge-standalone/tsconfig.json`), ajustar paths pra `@/*` → `./` dentro de `apps/crm/`.

---

## Dependencies

- ⛔ **Pré-Gate 0** — não iniciar antes do Day 7 verde
- Nenhuma story depende dela (é a primeira)

---

## Definition of Done

- [ ] PR criado em branch `feat/crm-1.1-bootstrap`
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` passam (test pode ser vazio)
- [ ] Vercel preview funciona (link no PR)
- [ ] Supabase project existe + credenciais salvas
- [ ] Code review por @architect (estrutura monorepo) — 1 approval
- [ ] Merged em `main`
- [ ] `apps/crm/README.md` documenta setup local em 5 passos

---

## File List (preencher ao executar)

```
apps/crm/
├── (todos os arquivos criados aqui)
```

---

## Testes (Sprint 1 não exige unit, só smoke)

```bash
# Smoke local:
pnpm dev --filter=@aios/crm
curl http://localhost:3000     # → 200 OK, HTML "CRM Novo · Sprint 1"
```

Sem necessidade de Jest/Vitest setup nessa story — vem em CRM-1.3 (pgTAP) ou Sprint 2.

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| Supabase project region errada (`us-east-1`) | Checar 2× antes de criar — região não muda depois |
| pnpm workspace path errado | Validar `pnpm-workspace.yaml` antes do install |
| Next.js 16 RC bugs | Se travar, fallback Next.js 15.x estável (documentar decisão) |

---

## Handoff para próxima story

Ao terminar:
- @dev passa pra @data-engineer (CRM-1.3 pode começar paralelo)
- @dev mesmo começa CRM-1.2 (Auth) sequencial

---

*Story CRM-1.1 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
