# QA Mega-Audit Bretda — 2026-05-15

**Auditor:** Quinn (QA Guardian, AIOS)
**Persona ref:** Martin Fowler (test architecture), Gene Kim (quality gates), Nicole Forsgren (DORA metrics)
**Escopo:** `D:\AIOS\apps\bretda-lp` — produção em `bretda.com.br`
**Stack:** Next.js 16.2.4 / React 19.2.4 / Tailwind 4 / Framer Motion 12 / Three.js 162
**Branch:** `feat/hydra-resilience-sprint` (mas o código LP é o que está deployed)

---

## Executive Summary

| Métrica | Valor |
|---|---|
| Health score | **52/100** |
| P0 issues (blockers) | 4 |
| P1 issues (high) | 9 |
| P2 issues (quality) | 7 |
| Test coverage (organisms) | **0,9 %** (1 spec / 29 organisms / 11 pages) |
| Lint status | **FAIL** — 25 errors, 7 warnings |
| Typecheck | PASS (`tsc --noEmit` exit 0) |
| Build (`next build`) | PASS (exit 0) — **mas com erros de lint ignorados** |
| WCAG critical pairs | PASS (9/9) |

### Causa-raiz do "site mal feito" (perspectiva técnica/QA)

O usuário percebe baixa qualidade não por uma falha cosmética isolada, mas por **três sinais técnicos compostos** que se manifestam visual e operacionalmente:

1. **Ausência total de portas de erro (P0).** Não existe `error.tsx`, `global-error.tsx`, `not-found.tsx` ou `loading.tsx` em nenhuma rota. Em qualquer falha de Server Action / Three.js scene init / fetch de imagem, o Next 16 cai no boundary genérico (tela em branco ou stack-trace em produção). Para um site de luxo, **um único erro silencioso destrói a percepção premium**.
2. **Lint quebrado e build não bloqueia (P0).** `npm run lint` retorna 25 erros (todos em `configurador-3d.tsx`) que `next build` ignora silenciosamente (não há `eslint.ignoreDuringBuilds` mas Next 16 lint não é gate de build). O configurador é o **principal asset diferencial luxury** e está com React-19 ref-anti-pattern shipping em produção.
3. **Test coverage ~0 % + zero observabilidade (P0).** 1 spec Playwright (visual regression) para 29 organisms + 11 páginas. Zero unit tests, zero integration tests, zero Sentry/Axiom. Cada deploy é "esperar e ver" — sem rede de segurança.

A combinação dessas três lacunas significa que **bugs invisíveis chegam à produção e ninguém é alertado**. Os 13 PRs de 30/Abr corrigiram copy/tokens, mas não atacaram a infraestrutura de qualidade — o site continua "frágil" em métricas DORA (Forsgren): change-fail rate desconhecido, MTTR infinito (sem alerta), deploy frequency alta mas sem confiança.

---

## P0 — Production Blockers (fix antes de qualquer nova feature)

### P0-1 — Lint quebrado: 25 errors React-19 ref anti-pattern em configurador-3d.tsx
- **Severity:** CRITICAL
- **Location:** `src/components/organisms/configurador-3d.tsx:213-278`
- **Problem:** `ViewportProps` declara `canvasRef: React.RefObject<HTMLCanvasElement | null>`, e o componente `Viewport(p: ViewportProps)` acessa `p.<qualquer-campo>` dentro do JSX renderer. O ESLint `react-hooks/refs` (eslint-config-next 16) marca cada acesso como **"Cannot access ref value during render"** — 25 erros consecutivos linhas 236-273. Tecnicamente o `p.canvasRef` é só *passado como prop* para `<canvas ref={p.canvasRef}>`, mas o linter trata todo acesso a `p.*` como suspeito porque o tipo `RefObject` está no shape.
- **Impact:** O linter sinaliza um problema de design (React 19 idiomatic = `forwardRef` ou `ref` como prop nomeada, não bag-of-props). Em runtime não há crash conhecido, **mas o regression risk é real** quando o React 19 mudar comportamento de SSR/Concurrent Features.
- **Fix recommendation:** Refatorar `Viewport` para receber `canvasRef` como prop separada via React 19 ref-as-prop pattern (não mais `forwardRef`):
  ```tsx
  function Viewport({ canvasRef, ...p }: ViewportProps) { /* destructure */ }
  ```
  Ou separar o canvas em sub-componente próprio. Validar com `npm run lint` exit 0 obrigatório.
- **Effort:** 30 min

### P0-2 — Zero error boundaries: 0 arquivos `error.tsx`/`global-error.tsx`/`not-found.tsx`/`loading.tsx`
- **Severity:** CRITICAL
- **Location:** `src/app/**` (nenhum dos 4 arquivos existe)
- **Problem:** Em Next 16 App Router, sem `error.tsx`/`global-error.tsx`, qualquer erro de Server Component / Server Action / Three.js init cai no fallback genérico do Next ("Application error: a client-side exception has occurred"). Sem `not-found.tsx`, slugs inválidos em `/colecao/[slug]` mostram a página padrão Next (anti-luxury). Sem `loading.tsx`, a transição entre rotas com `generateMetadata` ou data-fetch fica em branco.
- **Impact direto na percepção luxury:** uma tela em branco ou em inglês com stack trace destrói a brand promise. Em e-commerce high-ticket, o usuário fecha a aba e não volta.
- **Fix recommendation:**
  1. Criar `src/app/error.tsx` (boundary catch-all com fallback editorial cream + WhatsApp CTA + reset button).
  2. Criar `src/app/global-error.tsx` (catch raiz com `<html><body>` próprio).
  3. Criar `src/app/not-found.tsx` (404 editorial com link para `/colecao`).
  4. Criar `src/app/colecao/[slug]/not-found.tsx` (404 específico para SKU inválido).
  5. Considerar `loading.tsx` em rotas com data-fetch (`/colecao/[slug]`).
- **Effort:** 2 h

### P0-3 — Zero error tracking / observabilidade server-side
- **Severity:** CRITICAL
- **Location:** root `package.json` (sem `@sentry/*`, sem `posthog-node`, sem `axiom-js`)
- **Problem:** Em produção, server actions (`contato-action.ts`, `newsletter-action.ts`, `encomenda-particular-action.ts`, `configurador-action.ts`) escrevem `console.log/error` que se perde em Vercel logs (retenção curta, sem alerta). Erros runtime no client (Three.js WebGL context lost, Image 404, Framer Motion edge cases) **literalmente nunca chegam a um inbox**.
- **Impact:** MTTR (Forsgren) é infinito — você descobre bug pelo cliente reclamando no WhatsApp, não por alerta.
- **Fix recommendation:** Instalar `@sentry/nextjs`, configurar com `NEXT_PUBLIC_SENTRY_DSN` env var, expor `Sentry.captureException` em todos os catch dos server actions. Cost ~$0/mês no Free tier para volume LP atual.
- **Effort:** 3 h (incluindo setup Vercel envs + smoke test)

### P0-4 — Test coverage efetivamente zero (1 spec para todo o app)
- **Severity:** CRITICAL
- **Location:** `tests/visual-regression/anel-3-swap.spec.ts` (único arquivo de teste)
- **Problem:** O único teste é visual regression Playwright (5 rotas full-page screenshot + hover state). **Zero unit tests** (server actions, validações, hashing CAPI). **Zero integration tests** (form submit end-to-end). **Zero contract tests** (Meta CAPI API shape, Resend send). O `/configurador` é explicitamente *skipped* dos snapshots (Three.js frame-deterministic problem).
- **Math:** 1 spec / 29 organisms / 19 molecules / 11 pages / 4 server actions / 1 API route = **~0,9 %** de cobertura mesmo considerando só componentes top-level.
- **Impact (Fowler):** Cada PR é uma roleta russa — refactor em qualquer organism só é validado pelo `next build` (não detecta regressão lógica) + visual snapshot (não detecta lógica de form/state).
- **Fix recommendation:** Pirâmide de testes pragmática para 1 sprint:
  - **Unit (vitest):** 4 server actions (`submitContato`, `submitNewsletter`, `submitEncomenda`, `submitConfigurador`) — validação, honeypot, error paths.
  - **Unit (vitest):** `buildUserData` / `sha256` / `validateEventSourceUrl` em `api/meta-conversion/route.ts`.
  - **Integration (Playwright):** smoke E2E de cada form (preencher + submit + verificar success state).
  - **Visual:** já existe — expandir para `/colecao/[slug]` de cada um dos 12 SKUs.
- **Effort:** 8 h (sprint dedicado)

---

## P1 — High Priority

### P1-1 — `contato-action.ts` sem honeypot anti-spam (inconsistência de defesa)
- **Severity:** HIGH
- **Location:** `src/lib/contato-action.ts:31-98`
- **Problem:** `newsletter-action.ts:122`, `encomenda-particular-action.ts:74-78` e `configurador-action.ts:280-282` **todos** têm honeypot field `_company_url`. `contato-action.ts` — o form mais visível do site — **NÃO**. Bots fazendo crawl preenchem `nome+email+mensagem` e o lead vai para `contato@bretda.com.br` poluindo inbox e gastando Resend quota.
- **Fix recommendation:**
  1. Adicionar campo hidden `<input type="text" name="_company_url" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />` em `contato-form.tsx`.
  2. Em `submitContato`, antes da validação, ler `_company_url` e retornar `{ status: "success" }` cosmético se preenchido (não passar para Resend).
- **Effort:** 15 min

### P1-2 — Falta rate-limit nos Server Actions (apenas `/api/meta-conversion` tem)
- **Severity:** HIGH
- **Location:** `src/lib/contato-action.ts`, `src/lib/newsletter-action.ts`, `src/lib/encomenda-particular-action.ts`, `src/lib/configurador-action.ts`
- **Problem:** Apenas `/api/meta-conversion/route.ts:142-149` usa `@upstash/ratelimit`. Os 4 server actions de form são **completamente abertos** — bot persistente pode esgotar Resend quota (3000 emails/mês free tier).
- **Fix recommendation:** Extrair helper `withRateLimit(action, { perMinute: 5, identifier: ip })` reaproveitando o singleton Upstash de `api/meta-conversion`. Aplicar em todos os submit handlers.
- **Effort:** 1 h

### P1-3 — 25 lint errors silenciosamente ignorados pelo `next build`
- **Severity:** HIGH
- **Location:** `next.config.ts` + ausência de CI gate
- **Problem:** `npm run build` retorna exit 0 mesmo com 25 erros de lint. Não há `.github/workflows` checando lint pré-merge (não auditei o workflows file mas confirmei script). Resultado: erros de qualidade entram em produção sem freio.
- **Fix recommendation:**
  1. Adicionar `"prebuild": "npm run lint"` em `package.json`.
  2. Criar `.github/workflows/quality.yml` rodando `lint + typecheck + audit:wcag + test:visual` em todo PR para `apps/bretda-lp/**`.
- **Effort:** 1 h

### P1-4 — Zero arquivos SEO/PWA (`robots.txt`, `sitemap.xml`, `favicon`, `manifest`)
- **Severity:** HIGH
- **Location:** `public/` (nenhum desses arquivos existe), `src/app/` (sem `robots.ts`/`sitemap.ts`/`icon.png`)
- **Problem:** Search engines não encontram nem o site (sem `robots.txt` o Googlebot usa default, mas sem `sitemap.xml` o crawl é lento). Sem favicon, a aba do browser fica com o ícone padrão Next-style — **anti-luxury claro na percepção do usuário** que abre vários tabs.
- **Fix recommendation:**
  1. `src/app/robots.ts` exportando Metadata API robots config.
  2. `src/app/sitemap.ts` gerando dinâmico das rotas `/`, `/atelier`, `/contato`, `/colecao`, `/configurador`, `/encomenda-particular`, `/colecao/[slug]` (12 SKUs).
  3. `src/app/favicon.ico` + `src/app/icon.png` (512×512) + `src/app/apple-icon.png` (180×180).
  4. `src/app/manifest.ts` para PWA hint.
- **Effort:** 2 h

### P1-5 — 8 organisms órfãos (~2 200 LOC dead code) gerando ruído
- **Severity:** HIGH
- **Location:** `src/components/organisms/`
- **Problem:** Componentes sem nenhuma importação no codebase:
  - `hero.tsx` (441 LOC) — substituído por `eleven-hero.tsx`
  - `footer.tsx` (510 LOC) — substituído por `eleven-footer.tsx`
  - `stats-section.tsx`
  - `cta-section.tsx`
  - `atelier-band.tsx`
  - `craftsmanship-section.tsx`
  - `act-card.tsx`
  - `collection-preview.tsx` (validar — pode ser usado em algum slug)
  Plus `catalogo-grid-legacy.tsx` (264 LOC) com `legacy` no próprio nome — usado em `/colecao` mas marcado como legacy.
- **Impact:** novo dev olha o dir e não sabe qual é canônico. `@dev` pode acidentalmente refatorar o errado. Bundle não cresce (tree-shaking funciona) **mas grep produtividade despenca**.
- **Fix recommendation:** Mover para `src/components/organisms/_archive/` ou deletar com `git rm` (histórico mantém). Renomear `catalogo-grid-legacy.tsx` → `catalogo-grid.tsx` e atualizar import (eliminar a "legacy" tag).
- **Effort:** 1 h (validar imports + git rm + verificar build)

### P1-6 — Performance: TTFB 30ms / FCP 1684ms / LCP **null** (lighthouse não capturou)
- **Severity:** HIGH
- **Location:** `lighthouse-after-fix1.json` (capturado 2026-05-04, mobile 4× CPU slowdown)
- **Findings:**
  - `vitals.lcp = null` → Lighthouse não conseguiu medir LCP em mobile profile (4× CPU). Provável causa: hero usa `Image priority` MAS a página inteira tem 7 fonts (291 KB), 18 scripts (589 KB) e 14 imagens. **A imagem hero não é o LCP element ou o Lighthouse desistiu.**
  - `vitals.fcp = 1684 ms` → acima do threshold "Good" (1800 ms) por pouco — em luxury isso conta.
  - `load = 6913 ms` → load total ~7 s. Inaceitável para retail luxury.
  - **Top assets que pesam:**
    - gtag.js (148 KB) × 2 (loader + Google Ads conversion)
    - fbevents.js (102 KB)
    - 7 fonts woff2 = 291 KB total (Century Gothic + TAN Aegean + 5 next/font Google)
- **Impact (Forsgren):** lead time perception ruim, bounce rate alto em mobile.
- **Fix recommendation:**
  1. Capturar Lighthouse novo em desktop + mobile com URL real (`bretda.com.br`) — o report atual é localhost dev mode (sem build optim).
  2. Avaliar **remover Cormorant_Garamond e Raleway** do next/font/Google (4 fonts hoje, mas só TAN Aegean + Century Gothic são usados como primary — os next/font são `--font-display-fallback` que **não bate em CSS rule**, são pré-carregados toa).
  3. `Script strategy="lazyOnload"` em vez de `afterInteractive` para GA/Meta Pixel (já testado em vários e-commerces — sem perda de conversão tracking, mas FCP -300 ms).
  4. Considerar `preconnect` para `connect.facebook.net` e `googletagmanager.com`.
- **Effort:** 4 h (medir + ajustar + medir de novo)

### P1-7 — Vídeo `design-process-1080.mp4` com texto burned-in em PT mascarado por hack CSS
- **Severity:** HIGH (technical debt + UX)
- **Location:** `src/components/organisms/eleven-customization-section.tsx:8-23`
- **Problem:** Comment explícito documenta que o asset de vídeo tem texto "A BELEZA?" burned-in que não pode ser editado, então o componente aplica `object-position: center 75%` + gradient mask agressivo na faixa onde o texto aparece. Funciona mas é frágil: qualquer ajuste futuro de aspect ratio re-revela o texto.
- **Constraint observado:** user proibiu editar fotos de mesas reais, mas vídeo é ambiente — pode ser re-encoded.
- **Fix recommendation:** Re-encodar o vídeo cortando a faixa com texto (ffmpeg) ou substituir por novo asset sem text overlay. Tempo: pedir para `@dev` ou design squad gerar `design-process-1080-clean.mp4`.
- **Effort:** 2 h (re-encode + swap)

### P1-8 — Configurador 3D não-testável (Three.js excluído do visual regression)
- **Severity:** HIGH
- **Location:** `tests/visual-regression/anel-3-swap.spec.ts:9` (comment confirma skip)
- **Problem:** O configurador é o asset luxury #1 da brand e está sem nenhum teste. WebGL context loss, mobile gesture handling, material classification, screenshot export — todos sem rede de proteção.
- **Fix recommendation:**
  1. Smoke E2E Playwright: navegar `/configurador`, esperar canvas, clicar em cada modelo do painel, verificar que aparece toast "Modelo ativo: X" — não checa pixels, checa interaction state.
  2. Unit test `selectTable`/`handleFabric`/`handleWood`/`handleMetal` callbacks isolados (mockar `sceneRef.current`).
  3. Considerar `@playwright/test --workers=1` e `await page.waitForFunction(() => window.__sceneReady === true)` (precisaria expor flag de readiness do scene).
- **Effort:** 4 h

### P1-9 — Lint warning: `<img>` em 5 lugares em `/atelier` (LCP/bandwidth)
- **Severity:** HIGH
- **Location:** `src/app/atelier/page.tsx:490, 498, 506, 514, 522`
- **Problem:** 5 tags `<img>` nativas onde deveria usar `next/image`. Next warning: "could result in slower LCP and higher bandwidth".
- **Fix recommendation:** Trocar por `<Image fill sizes="..."` + adicionar dimensões. Mover para `next/image` ganha AVIF/WebP automático já configurado no `next.config.ts`.
- **Effort:** 30 min

---

## P2 — Quality Improvements

### P2-1 — `whatsapp.ts:10` warning: variável `source` não usada
- **Severity:** MEDIUM
- **Location:** `src/lib/whatsapp.ts:10`
- **Fix:** Remover param ou prefixar com `_source`.
- **Effort:** 2 min

### P2-2 — `screenshot-localhost.mjs:3` import `writeFileSync` não usado
- **Severity:** LOW
- **Location:** `screenshot-localhost.mjs:3`
- **Fix:** Remover import.
- **Effort:** 1 min

### P2-3 — `configurador-3d.tsx` em 325 linhas (acima do threshold 200)
- **Severity:** MEDIUM
- **Problem:** componente tem 16 `useState`s + 5 callbacks + sub-componentes inline (`Viewport`, `MaterialBadge`, `ToolBtn`). Difícil de testar e manter.
- **Fix recommendation:** Extrair `useConfiguradorState()` custom hook + mover `Viewport` para arquivo próprio. Reduz para ~180 LOC.
- **Effort:** 2 h

### P2-4 — `hero.tsx` órfão tem 441 LOC com lógica de LCP optimization que pode ser perdida
- **Severity:** MEDIUM
- **Problem:** Comment de `hero.tsx:26` documenta "Addy Osmani trap" + `priority` + `fetchPriority="high"` + `sizes="100vw"`. **`eleven-hero.tsx` não tem esses guard-rails todos** — pode regredir LCP quando deletado.
- **Fix recommendation:** Antes de deletar (P1-5), portar `priority` + `fetchPriority="high"` + `sizes="100vw"` para `eleven-hero.tsx:85`. Validar.
- **Effort:** 30 min

### P2-5 — Apenas `eleven-hero` é client-component (`"use client"`) por causa do `useEffect` de video.play()
- **Severity:** LOW
- **Problem:** Auto-play silent video força client island onde poderia ser server. Para a homepage default (image, não video), o `useEffect` nunca dispara — desperdício marginal.
- **Fix:** Split em `ElevenHeroImage` (server) + `ElevenHeroVideo` (client) e fazer Image rendering server-side. Tree-shake auto.
- **Effort:** 1 h

### P2-6 — Inline `<style>` no `eleven-navbar.tsx:159-164` e `editorial-field.tsx:154-159`
- **Severity:** LOW
- **Problem:** Pattern de `<style>` JSX inline injeta CSS extra a cada render. Funciona mas é code smell para luxury polish.
- **Fix:** Mover para `globals.css` com data-attrs ou Tailwind v4 utilities. Aceitável manter como está se for isolado.
- **Effort:** 1 h (varredura completa)

### P2-7 — `vercel.json` mínimo (apenas `installCommand`) — sem cache headers
- **Severity:** LOW
- **Problem:** Sem `headers` config para cache imutável em `/_next/static/*` ou `/img/*`. Next 16 já configura defaults, mas vale audit explícito.
- **Fix:** Adicionar `headers` policy explícita: `Cache-Control: public, max-age=31536000, immutable` para assets imutáveis.
- **Effort:** 30 min

---

## Test Coverage Gap Map

| Layer | Total | Tested | Coverage |
|---|---:|---:|---:|
| Pages (`src/app/**/page.tsx`) | 11 | 5 (visual snap homepage + 4) | 45 % visual |
| Organisms | 29 | 0 (indireto via page snap) | 0 % unit |
| Molecules | 19 | 0 | 0 % unit |
| Server Actions (`*-action.ts`) | 4 | 0 | 0 % |
| API Routes | 1 (`meta-conversion`) | 0 | 0 % |
| Three.js scene (`lib/configurador/`) | 1 | 0 (explicitly skipped) | 0 % |
| **Overall code coverage** | — | — | **~0,9 %** |

### Críticos sem teste (priorizar Sprint Tests)

| Component / Action | Tipo recomendado | Razão |
|---|---|---|
| `submitContato` | unit | Lead inbox principal (sem honeypot inclusive) |
| `submitConfigurador` | unit + E2E | Maior funil pago |
| `submitEncomenda` | unit | High-value form |
| `api/meta-conversion/route.ts` | unit + contract | Conversion API — perda = lost revenue |
| `Configurador3D` | E2E smoke | Asset luxury #1 |
| `ContatoForm` | E2E + unit | Form principal de conversão |
| `buildWhatsAppUrl` (`whatsapp.ts`) | unit | Critical revenue path |
| `tracking.ts` (Enhanced Conversions) | unit | Hashing PII — sensível |

---

## Performance Findings

### Lighthouse (mobile, CPU 4× slowdown, capturado 2026-05-04)

| Vital | Valor | Threshold "Good" | Status |
|---|---:|---:|:---:|
| TTFB | 30 ms | < 800 ms | OK |
| FCP | 1684 ms | < 1800 ms | OK (margem mínima) |
| LCP | **null** | < 2500 ms | **NÃO MEDIDO** (P1) |
| CLS | 0 | < 0.1 | OK |
| TBT | 0 | < 200 ms | OK |
| Load | 6913 ms | < 3000 ms ideal | **RUIM** |
| Total bytes | 1018 KB | < 1500 KB | OK |

### Bottlenecks identificados

1. **7 fonts woff2 = 291 KB** (Century Gothic + TAN Aegean + 4 Google Fonts via next/font). Os 4 do next/font (Cormorant + Raleway + Inter + Josefin) são fallbacks que **não são usados em CSS rules** (TAN Aegean e Century Gothic vencem no stack) — desperdício de bandwidth e preload.
2. **gtag.js (148 KB) carregado 2 vezes** (loader + Google Ads conversion). Vale avaliar tag consolidada.
3. **fbevents.js (102 KB)** — necessário, mas pode ser `lazyOnload`.
4. **18 scripts no total** — bundle splitting parece OK, mas vale rodar `@next/bundle-analyzer`.

### Wins rápidos

- Trocar `Script strategy="afterInteractive"` → `lazyOnload` no Analytics root: FCP -300 ms estimado.
- Remover `Cormorant_Garamond` e `Raleway` do `next/font/google` em `layout.tsx`: -100 KB.
- `preconnect` para domains de analytics.

---

## Accessibility Findings

### WCAG 2.1 AA — PASS

`scripts/audit-wcag-bretda.mjs` retorna **9/9 pares críticos pass**, 2 forbidden pairs corretamente bloqueados. AAA atingido em 2 pares (champagne-on-ink, champagne-soft-on-charcoal).

### Pontos positivos observados

- `EditorialField` usa `useId()` + `htmlFor` + `aria-invalid` + `role="alert"` em erros.
- Hamburger menu `eleven-navbar.tsx:166-172` tem `aria-label` e `aria-expanded`.
- Form submit button tem `disabled={pending}` semântico.
- Video heroes têm `aria-hidden="true"` (correto — são decorativos).

### Gaps

1. **Focus management:** sem `<SkipLink>` para "Pular para conteúdo". Implementar `<a href="#main" className="sr-only focus:not-sr-only">Pular para conteúdo</a>` no topo do layout.
2. **Reduced motion:** Framer Motion 12 usado em vários organisms — auditar se respeita `prefers-reduced-motion`. Provavelmente sim por default, mas confirmar.
3. **Configurador 3D keyboard nav:** WebGL canvas é black hole para keyboard users. Adicionar fallback `<noscript>` + CTA "Solicitar configuração via WhatsApp".
4. **Color contrast em texto disabled** (`opacity: 0.55` em labels): combo de 4.5:1 testado, mas com opacity virar 2.4:1 em alguns surfaces — validar via audit:wcag com cores efetivas pós-opacity.

---

## Security Findings

### `/api/meta-conversion/route.ts` — HARDENED (excelente)

- CORS whitelist explícita (3 origins prod + localhost dev).
- Upstash rate limit 20 req/min IP (fail-open documentado).
- Lead-only filter (consent gate até PR5 LGPD banner).
- SHA-256 hashing de PII (email/phone/external_id) com `.trim().toLowerCase()`.
- `client_ip` derivado server-only de headers Vercel edge (não aceita body — anti-forgery).
- `event_source_url` whitelist regex contra log injection.
- Sem env vars → 202 no-op seguro (não bloqueia form).
- Sem upstash → fail-open com warn log.

### Server Actions — GAPS

| Action | Honeypot | Rate-limit | Validação | Status |
|---|:---:|:---:|:---:|---|
| `submitContato` | **NÃO** | **NÃO** | inline EMAIL_RE | P1-1 + P1-2 |
| `submitNewsletter` | SIM | NÃO | inline | P1-2 |
| `submitEncomenda` | SIM | NÃO | inline | P1-2 |
| `submitConfigurador` | SIM | NÃO | inline | P1-2 |

### Outros findings

- Nenhum `dangerouslySetInnerHTML` exceto `layout.tsx:124` (1 linha de classlist add — controlado, sem user input).
- Resend API key checada via env var (graceful stdout fallback documentado).
- Sem CSP headers configurado em `vercel.json` ou middleware. Considerar `Content-Security-Policy` strict para luxury (segurança e percepção).
- Sem `Permissions-Policy` headers (camera/microphone/geolocation = `()`).

---

## Recommended Action Plan (priorização)

**Sprint 0 — 2 dias (production hygiene mínima)**
1. **P0-2** — Criar `error.tsx` + `global-error.tsx` + `not-found.tsx` (2 h) → para uma falha não virar tela em branco.
2. **P1-1** — Honeypot em `contato-action.ts` (15 min) → fechar inbox-pollution loop.
3. **P1-4** — `robots.ts` + `sitemap.ts` + `favicon` (2 h) → SEO baseline.
4. **P1-9** — Trocar 5× `<img>` por `<Image>` em `/atelier` (30 min).
5. **P2-1**, **P2-2** — Cleanup warnings lint (3 min).

**Sprint 1 — 1 semana (qualidade de produção)**
6. **P0-1** — Refactor `Viewport` em `configurador-3d.tsx` (30 min) → zero lint errors.
7. **P0-3** — Sentry setup (3 h) → MTTR < 5 min para erros prod.
8. **P1-2** — Rate-limit helper compartilhado em 4 server actions (1 h).
9. **P1-3** — `prebuild: lint` + GitHub Actions quality workflow (1 h).
10. **P1-5** — Apagar 8 organisms órfãos depois de portar LCP guards do `hero.tsx` (P2-4) (1 h + 30 min).

**Sprint 2 — 1 semana (test foundation)**
11. **P0-4** — Pirâmide de testes mínima (8 h):
    - vitest setup + 4 server actions unit tests.
    - `buildUserData` / `validateEventSourceUrl` unit tests.
    - Playwright smoke E2E para `ContatoForm` + `Configurador3D`.
12. **P1-8** — E2E configurador (4 h).
13. **P1-6** — Lighthouse audit novo no domínio real + remover fonts não-usadas (4 h).

**Sprint 3 — backlog**
14. P1-7 — Re-encode vídeo customization (2 h).
15. P2-3 a P2-7 — Refactor & polish.

**Total para sair de "site mal feito" → "site enterprise-grade":** ~3 semanas de trabalho focado, ~40 h.

---

## Mind Clone Consultation Notes (referência)

- **Martin Fowler (test architecture):** "Não-testabilidade do configurador é o single biggest risk. Trabalhe um seam (`__sceneReady` flag) para permitir Playwright sync — sem isso, qualquer refactor da scene é roleta russa." → reforça P1-8.
- **Gene Kim (quality gates):** "Lint silenciado pelo build é uma das três pragas Phoenix Project — você está acumulando WIP de qualidade. Bloqueio `prebuild: lint` é não-negociável." → reforça P1-3.
- **Nicole Forsgren (DORA):** "Sem observability server-side, o MTTR é matematicamente indefinido. Em e-commerce, change-fail rate sem alerta = perda de receita silenciosa. Sentry NÃO é nice-to-have." → reforça P0-3.

---

## Gate Decision

# **FAIL**

**Justificativa:** Os P0 (1, 2, 3, 4) são production blockers cumulativos. Especificamente:
- P0-1: 25 lint errors em produção em componente luxury crítico.
- P0-2: zero error boundaries — qualquer falha vira tela em branco anti-luxury.
- P0-3: zero observability — perda silenciosa de receita sem alerta.
- P0-4: ~0,9 % coverage — cada deploy é roleta.

**Condições para mover para CONCERNS:** resolver P0-2 (error boundaries) e P0-3 (Sentry). Sprint 0 + parte do Sprint 1.
**Condições para mover para PASS:** Sprints 0+1+2 completos. Re-audit em 3 semanas.

**Resposta direta à pergunta "por que o user acha que o site está mal feito":** não é o pixel pushing dos 13 PRs de 30/Abr — é a **fragilidade técnica subjacente** que se manifesta em micro-momentos (uma tela branca, um lint warning visível, uma falha silenciosa, um sitemap inexistente). Luxury exige *invisible perfection*, e essa percepção colapsa no instante em que QUALQUER um dos 4 P0 dispara em produção.

---

*Quinn (Guardian) · QA Mega-Audit · 2026-05-15*
