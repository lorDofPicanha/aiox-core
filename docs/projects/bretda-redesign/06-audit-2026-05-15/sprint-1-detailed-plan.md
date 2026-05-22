# Sprint 1 — Detailed Execution Plan (QUEUED)

**Status:** ⏸ AGUARDA Sprint 0 entregue + visual review aprovado pelo Breno
**Branch alvo:** mesma `feat/sprint-0-audit-fixes-2026-05-15` (continua, não cria nova) — Sprint 1 stacka em cima da limpeza do Sprint 0
**Effort:** ~30.5h dev · cabe em 1 semana
**Guardrails:** **mesmos do Sprint 0** — zero push, zero deploy, branch isolada, commits locais

---

## Pré-condições obrigatórias (gate de entrada)

Sprint 1 só dispara quando:
- [ ] Sprint 0 sprint-0-execution-report.md entregue
- [ ] Sprint 0 gate exit completo (9 commits S0.x locais, lint exit 0, build PASS, screenshots gerados)
- [ ] Breno revisou screenshots before/after e disse "vai com Sprint 1"
- [ ] Site bretda.com.br continua intacto (sem push acidental)

Se qualquer item falhar → STOP, reportar, não disparar Sprint 1.

---

## Sequência S1.1 → S1.9 (~30.5h)

### S1.1 (4h) — Sentry SDK setup + DSN + source maps
**Files novos:**
- `apps/bretda-lp/sentry.client.config.ts`
- `apps/bretda-lp/sentry.server.config.ts`
- `apps/bretda-lp/sentry.edge.config.ts`
- `apps/bretda-lp/.env.example` (adicionar `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`)
- Atualizar `next.config.ts` com `withSentryConfig` wrapper

**Action:**
1. `npm i @sentry/nextjs` (lockfile commit)
2. Inicializar com `--bash npx @sentry/wizard@latest -s -i nextjs` ou setup manual
3. Configurar:
   - `tracesSampleRate: 0.1` (10% prod)
   - `replaysSessionSampleRate: 0.0` + `replaysOnErrorSampleRate: 1.0` (replay só em erro)
   - `beforeSend` filter: PII sanitization
4. Validar throw forçado no `/configurador` em dev → erro aparece no Sentry dashboard

**Verificação:** preview deploy (NÃO neste sprint — sprint só prepara código) recebe erro em Sentry. Por enquanto, validar via `npm run dev` + erro forçado.

**Commit:** `feat(observability): adiciona Sentry SDK + source maps + per-route boundaries [S1.1 QA-P0.3]`

---

### S1.2 (3h) — GitHub Actions quality workflow
**File novo:** `.github/workflows/quality.yml` (na raiz do repo bretda-lp, não no AIOS root)

**Action:**
```yaml
name: Quality Gates
on: [pull_request, push]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint           # exit 0 obrigatório (já passa pós-S0.1)
      - run: npx tsc --noEmit       # typecheck
      - run: npm run audit:wcag     # WCAG critical pairs
      - run: npm run build          # build clean
      - run: npx lhci autorun       # Lighthouse CI (com lighthouse-budgets.json)
```

Adicionar `lighthouse-budgets.json`:
```json
{
  "ci": {
    "collect": { "url": ["http://localhost:3000", "http://localhost:3000/colecao", "http://localhost:3000/configurador"] },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.75 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**Verificação:** workflow file commitado, NÃO ativado em main ainda (push pendente). PR aberto contra branch sandbox dispara CI.

**Commit:** `ci(github-actions): quality gates obrigatórios pre-merge [S1.2 Conclave-Kim]`

---

### S1.3 (0.5h) — Lint-as-gate em build
**File:** `apps/bretda-lp/next.config.ts`

**Action:** Adicionar/garantir:
```ts
eslint: { ignoreDuringBuilds: false },
typescript: { ignoreBuildErrors: false }
```

**Verificação:** `npm run build` falha intencionalmente se houver lint error.

**Commit:** `chore(build): lint + typecheck como gate obrigatório em next build [S1.3 QA-P1.7]`

---

### S1.4 (4h) — Rate-limit nas 4 server actions
**Files novos:**
- `apps/bretda-lp/src/app/api/_lib/rate-limit.ts` (extrair pattern de `/api/meta-conversion/route.ts`)

**Files modificados:**
- `apps/bretda-lp/src/app/contato/_actions/contato-action.ts`
- `apps/bretda-lp/src/app/newsletter/_actions/newsletter-action.ts`
- `apps/bretda-lp/src/app/encomenda-particular/_actions/encomenda-action.ts`
- `apps/bretda-lp/src/app/configurador/_actions/handoff-action.ts`

**Action:**
1. Extrair `Ratelimit` (Upstash) do `/api/meta-conversion/route.ts` pra `_lib/rate-limit.ts`
2. Helper `withRateLimit(action, { limit: 5, window: '1 m' })`
3. Wrap cada server action
4. Retornar 429 com message luxury-tone se exceder

**Verificação:** dev local — submit form 6× rapidamente, 6º request rejeitado.

**Commit:** `feat(security): rate-limit em 4 server actions via Upstash wrapper [S1.4 QA-P1.6]`

---

### S1.5 (1h) — Honeypot em contato-action
**File:** `apps/bretda-lp/src/app/contato/_actions/contato-action.ts`

**Action:** Adicionar campo `honeypot` ao schema Zod, validar empty no action, copy pattern dos outros 3 (newsletter/encomenda/configurador já têm).

**Verificação:** `mcp__refero` ou grep cross-check com newsletter-action.ts.

**Commit:** `fix(contato): honeypot anti-spam (consistência com 3 outras forms) [S1.5 QA-P1.5]`

---

### S1.6 (4h) — SEO files
**Files novos:**
- `apps/bretda-lp/src/app/robots.ts`
- `apps/bretda-lp/src/app/sitemap.ts`
- `apps/bretda-lp/src/app/manifest.ts`
- `apps/bretda-lp/public/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (gerar a partir do logo Bretda)

**Action:**
1. `robots.ts`: allow all, sitemap URL
2. `sitemap.ts`: 11 rotas estáticas + SKUs dinâmicos (12) + última modificação
3. `manifest.ts`: PWA basics, name/short_name/icons/theme_color
4. Favicons: gerar via cli (`npx favicons` ou similar) a partir de `public/brand/logo.svg` ou logo equivalente

**Verificação:** `curl http://localhost:3000/sitemap.xml` retorna XML válido com todas as URLs.

**Commit:** `feat(seo): robots.ts + sitemap.ts + manifest.webmanifest + favicon set completo [S1.6 QA-P1.8]`

---

### S1.7 (8h) — Performance Sprint
**Files:**
- `apps/bretda-lp/src/app/atelier/page.tsx` (5× `<img>` → `<Image>`)
- `apps/bretda-lp/src/components/organisms/eleven-hero.tsx` (video lazy + poster)
- `apps/bretda-lp/src/components/organisms/configurador-wrapper.tsx` (dynamic import Three.js + Suspense)

**Action:**
1. **Atelier**: cada `<img>` recebe sizes + priority + width/height. Maior LCP em `/atelier` deve ser priority.
2. **Hero video**:
   - Adicionar `poster="/hero-poster.jpg"` (mesmo frame do vídeo)
   - `<video loading="lazy" preload="none">` se below fold (não é o caso aqui — hero), MAS `preload="metadata"` em hero
   - Considerar `<picture>` com WebP source + JPEG fallback como poster (Anadol pre-loader teatral)
3. **Configurador**:
   ```ts
   const Configurador3D = dynamic(() => import('@/components/organisms/configurador-3d'), {
     ssr: false,
     loading: () => <ConfiguradorLoader /> // pre-loader curado, S2 task
   });
   ```
   Three.js bundle (~600KB) sai do main chunk.

**Verificação:** Lighthouse mobile run local — LCP < 2500ms, TBT < 200ms.

**Commit:** `perf: img→Image atelier + hero video lazy + Three.js dynamic import [S1.7 QA-P1.10/11/13]`

---

### S1.8 (4h) — Next.js 16 Cache Components
**Files:**
- `apps/bretda-lp/src/app/page.tsx` (home cacheable)
- `apps/bretda-lp/src/app/atelier/page.tsx`
- `apps/bretda-lp/src/app/colecao/page.tsx`
- `apps/bretda-lp/src/app/colecao/[slug]/page.tsx`

**Action:**
1. Adicionar `'use cache'` directive nas pages estáticas
2. `cacheLife('hours')` ou `cacheLife('days')` conforme conteúdo
3. Dynamic slots permanecem dinâmicos (form CSRF tokens, configurador state)
4. Habilitar `cacheComponents: true` em `next.config.ts` (já default em 16.x stable, validar)

**Verificação:** preview build local mostra static-prerendered routes em build output. Lighthouse FCP < 1000ms em rotas cached.

**Commit:** `perf(cache): Next.js 16 Cache Components em home + atelier + colecao [S1.8 Research-Q2]`

---

### S1.9 (2h) — DORA dashboard public
**Files novos:**
- `apps/bretda-lp/docs/observability.md` (URLs + métricas)

**Action:**
1. Configurar Vercel Analytics + Speed Insights via env (não-push, só docs)
2. Documentar URLs:
   - Sentry: `https://sentry.io/organizations/bretda/projects/bretda-lp/`
   - Vercel Analytics: `https://vercel.com/bretda/bretda-lp/analytics`
   - Lighthouse CI: artifact link do GitHub Actions
3. Documentar 4 métricas DORA:
   - **Deployment frequency** — Vercel insights
   - **Lead time for changes** — GitHub PR merged-to-deployed
   - **MTTR** — Sentry incident → resolved
   - **Change failure rate** — Sentry error rate post-deploy / total deploys
4. Snapshot baseline em `apps/bretda-lp/docs/baseline-2026-05-22.md`

**Commit:** `docs(observability): DORA dashboard URLs + baseline 2026-05-22 [S1.9 Conclave-Forsgren]`

---

## Sprint 1 gate exit (rodar antes de marcar done)

- [ ] `git log feat/sprint-0-audit-fixes-2026-05-15 --oneline` mostra 9 commits S1.x ON TOP dos 9 do Sprint 0 = total 18 commits locais
- [ ] **NENHUM push pra origin** (verificar `git status` + `git log origin/main..HEAD`)
- [ ] `.github/workflows/quality.yml` existe mas só fará gate quando branch pushada (atualmente não-pushada — OK)
- [ ] `npm run build` PASS sem lint silenciado
- [ ] Sentry recebe erro em throw forçado local
- [ ] Lighthouse mobile local: LCP < 2500ms, TBT < 200ms, CLS < 0.1
- [ ] `/sitemap.xml` retorna XML válido
- [ ] Rate-limit dispara 429 após 5 requests/min em qualquer form
- [ ] DORA dashboard URLs documentados
- [ ] Build size delta documentado (esperado: -40% bundle após Three.js dynamic + 4 fonts removidas no S0.9 + Cache Components)

## Próximo passo pós-Sprint 1

Esperar Breno revisar entrega + decidir:
1. **GO Sprint 2** — fundação tests + a11y experiencial
2. **AJUSTES Sprint 1** — refinar item específico
3. **DEPLOY PREVIEW Vercel** — pela primeira vez, push em branch preview-only NÃO-main pra Breno ver em URL real (decisão dele se for esse o momento)

---

## Anti-patterns reforçados (não esquecer)

- ❌ NÃO push de feat/sprint-0-audit-fixes-2026-05-15 sem aprovação Breno
- ❌ NÃO mudar de branch durante Sprint 1
- ❌ NÃO mexer no main local nem origin/main
- ❌ NÃO rodar `vercel deploy` nem `vercel --prod`
- ✅ Cada commit é checkpoint local — Breno pode revisar a qualquer momento via screenshots

---

*Plano queue · pronto pra disparar após Sprint 0 entregue + visual review · 2026-05-15*
