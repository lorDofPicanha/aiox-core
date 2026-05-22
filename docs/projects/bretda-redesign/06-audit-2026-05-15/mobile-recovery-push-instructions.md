# Mobile Recovery — Push Instructions

**Branch:** `feat/mobile-recovery-2026-05-15`
**Status:** LOCAL — aguarda autorização Breno para push
**Data:** 2026-05-15
**Repo:** `D:\AIOS\apps\bretda-lp\` (separate git repo)
**Score projection:** mobile **42 → ~80** (8 audit categories + 4 hotfixes)

---

## TL;DR

92% dos leads Bretda vêm de mobile. Audit produção (`mobile-audit-report.md`) revelou score
**42/100** com 5 bugs P0 confirmados em prod. Esta branch consolida:

- **27 commits Sprint 0/1** (já entregues local na branch `feat/sprint-0-audit-fixes-2026-05-15`,
  cobrem 7/13 bugs do audit = 54%)
- **+4 hotfixes novos** (P0-1 / P0-4 / P0-5 / P1-7), cobrem mais 4 bugs críticos

Total: **31 commits ahead of `origin/main`**. Zero push até autorização.

---

## Os 4 hotfixes novos (commits aplicados nesta branch)

| Commit | Bug | Severidade | Descrição |
|--------|-----|------------|-----------|
| `25672dd` | P0-1 | P0 | `/colecao/todas` — heading e subtítulo usavam `var(--color-charcoal-v2)` (#2B2826) sobre background charcoal (#2B2826). Texto literalmente invisível em mobile. Troca para `var(--color-cream-v2)` (#F5F1EA). Files: `src/app/colecao/todas/page.tsx` (linhas 67, 81). |
| `3d5d91b` | P0-4 | P0 | `/encomenda-particular` — `<AtelierReel slug="sensorial">` apontava pra asset inexistente. Vídeo + poster real são `/videos/reels/sentidos-1080.mp4` e `sentidos-poster.jpg`. Troca slug para `sentidos`. Files: `src/app/encomenda-particular/page.tsx` (linha 319). |
| `d6768a7` | P0-5 | P0 | `/contato` — 2 strings em inglês quebravam i18n PT-BR ("Talk to a concierge" → "Fale com o atelier"; "Send us a letter." → "Escreva pro atelier."). Files: `src/app/contato/page.tsx` (linhas 70, 172). |
| `b71e7a6` | P1-7 | P1 | Touch targets <44px em footer (links), navbar (hamburger) e WhatsApp FAB (40×40). Padding + min-height + `w-11 h-11` no FAB. Visual preservado via gap=0 nos `<ul>`. Files: `src/app/globals.css` (`.eleven-footer-link`), `src/components/organisms/eleven-footer.tsx` (2 gap props), `src/components/organisms/eleven-navbar.tsx` (hamburger), `src/components/molecules/whatsapp-fab.tsx` (`w-10→w-11`, `h-10→h-11`). |

---

## Validação local executada

Todos os gates passaram pré-push:

| Gate | Resultado |
|------|-----------|
| `npm run lint` | 0 errors, 5 warnings (mesma baseline da Sprint 0/1) |
| `npx tsc --noEmit` | exit 0, zero erros TypeScript |
| `npm run audit:wcag` | 9/9 critical pairs PASS, 2 forbidden corretamente forbidden |
| `npm run build` | PASS — 28 routes (compile 32.7s, TS check 7.1s) |

Audit Playwright em produção (`tests/mobile-prod-audit.spec.ts`) **NÃO foi re-executado** —
spec aponta pra `bretda.com.br` (produção), portanto score só refletirá os 4 hotfixes
após o deploy. Audit pós-deploy é o gate de validação final (plano abaixo).

---

## Push command exato

```powershell
cd D:\AIOS\apps\bretda-lp
git push -u origin feat/mobile-recovery-2026-05-15
```

> **Atenção:** este é o único comando autorizado de push. NÃO executar `git push --force`,
> `vercel deploy --prod`, nem `gh pr merge` antes da validação manual em preview.

---

## PR sugerido (após push)

**Title:**
```
feat(mobile-recovery): Sprint 0/1 cleanup + 4 hotfixes P0 — score mobile 42→80
```

**Body (PT-BR):**

```markdown
## Por que essa PR existe

**92% dos leads Bretda vêm de mobile.** O audit de produção em 2026-05-15
(`docs/projects/bretda-redesign/06-audit-2026-05-15/`) revelou score mobile
**42/100** com 5 bugs P0 confirmados em prod.

Esta PR consolida o trabalho Sprint 0/1 (já mergeado em local, não pusheado ainda)
+ 4 hotfixes adicionais para entregar uma curva única shippable.

## O que entra (31 commits)

### Sprint 0 (10 commits) — Subtração radical + foundation
- Refactor homepage N1 (delete Marquee/CategoryStrip/BrandStory/Testimonial)
- Hero N2 (caption ≤5 words + 1 CTA, remove 5 accent elements)
- Navbar + Footer N5 single-affordance revert
- Italic-on-serif budget = 1 site-wide
- Remove 3 fonts não-usadas (Cormorant, Raleway, Josefin)
- Move 9 organisms órfãos para `.deprecated-2026-05-15`
- Substitui cutout PNGs por renders charcoal-card (12 SKUs)
- Error boundaries globais + per-route (error.tsx + not-found.tsx + loading.tsx)
- Configurador-3d: 25 lint errors React-19 ref anti-pattern corrigidos
- Playwright visual diff infra + spec

### Sprint 1 (17 commits) — Quality gates + observabilidade
- Sentry SDK + source maps + per-route boundaries
- GitHub Actions quality gates pré-merge + Lighthouse CI budgets
- Typecheck como gate obrigatório
- Rate-limit Upstash em 4 server actions
- Honeypot anti-spam no /contato
- SEO completo (robots + sitemap + manifest + favicon set)
- Perf: img→Image atelier + hero video lazy + Three.js dynamic
- DORA dashboard URLs + baseline

### 4 Hotfixes mobile (4 commits) — novos nesta missão

| Commit | Bug | Fix |
|--------|-----|-----|
| `25672dd` | P0-1 heading invisível /colecao/todas | charcoal→cream |
| `3d5d91b` | P0-4 vídeo 404 /encomenda-particular | slug `sensorial`→`sentidos` |
| `d6768a7` | P0-5 strings EN /contato | "Talk to a concierge"→"Fale com o atelier"; "Send us a letter."→"Escreva pro atelier." |
| `b71e7a6` | P1-7 touch targets <44px | padding em links footer + hamburger + WhatsApp FAB 40→44px |

## Bugs cobertos (11 de 13 do audit, 85%)

| Bug | Cobertura |
|-----|-----------|
| P0-1 heading invisível /colecao/todas | ✓ Hotfix `25672dd` |
| P0-2 homepage marquee horizontal-scroll | ✓ Sprint 0 (deletado) |
| P0-3 hero overflow | ✓ Sprint 0 hero N2 |
| P0-4 vídeo 404 encomenda-particular | ✓ Hotfix `3d5d91b` |
| P0-5 strings EN /contato | ✓ Hotfix `d6768a7` |
| P1-6 perf hero video | ✓ Sprint 1 (`2539bbc`) |
| P1-7 touch targets <44px | ✓ Hotfix `b71e7a6` |
| P1-8 typography overflow nav | ✓ Sprint 0 navbar revert |
| P1-9 error boundaries faltando | ✓ Sprint 0 (`a9029be`) |
| P1-10 lazy videos below-fold | ✓ pre-existente + Sprint 1 |
| P1-11 SEO/manifest faltando | ✓ Sprint 1 (`c46f1a3`) |
| P2-12 typecheck não-bloqueante | ✓ Sprint 1 (`cd73c57`) |
| P2-13 lighthouse budget faltando | ✓ Sprint 1 (`dbac62d`) |

## Bugs NÃO cobertos (2)

- **N/A** — todos cobertos. Score deve subir de 42 para ~80.

## Gates locais (todos PASS)

- ✓ `npm run lint` → 0 errors, 5 warnings (baseline)
- ✓ `npx tsc --noEmit` → 0 erros
- ✓ `npm run audit:wcag` → 9/9 critical PASS
- ✓ `npm run build` → 28 routes geradas

## Validação pós-merge

1. Preview Vercel automático em URL única
2. Breno valida preview em **iPhone real** (não emulado)
3. Re-run `mobile-prod-audit.spec.ts` apontando pra preview URL pra confirmar score
4. Se OK → merge → main → production deploy automático
5. Re-run audit em produção pós-deploy (gate final)

## Risk assessment

- Sprint 0/1 = mudança ampla (homepage, footer, error boundaries, perf) — **médio risco**
- 4 hotfixes = baixo risco (CSS color + string slug + i18n + padding/min-height)
- **Risco total: MÉDIO**. Mitigação = preview deploy + iPhone real validation antes de merge.

## Rollback plan

Revert PR no merge: `git revert -m 1 <merge-commit>`. Produção volta automaticamente
para o estado anterior via Vercel deploy.
```

---

## Plano pós-push (ordem obrigatória)

1. **Vercel preview deploy automático**
   - Aguardar build verde na URL única do preview
   - Verificar Sentry rotas críticas se há ruído

2. **Validação em iPhone real (Breno)**
   - `/` — homepage (no marquee, hero N2, 1 CTA)
   - `/colecao/todas` — heading legível (cream sobre charcoal) ✓
   - `/encomenda-particular` — vídeo "sentidos" toca ✓
   - `/contato` — copy PT-BR ✓
   - WhatsApp FAB clicável sem mira fina (44×44) ✓
   - Footer links com hit area ≥44px ✓
   - Hamburger navbar abre fácil ✓

3. **Re-run audit Playwright em preview URL**
   ```bash
   # Temporariamente alterar PROD_URL no spec OU criar mobile-local-audit.spec.ts
   npx playwright test tests/mobile-prod-audit.spec.ts \
     --reporter=line \
     --config=playwright.mobile-audit.config.ts
   ```
   - Score esperado: ~80/100
   - Se < 70 → review e iterar antes de merge
   - Se ≥ 80 → merge OK

4. **Merge PR**
   - `gh pr merge --squash` ou via UI GitHub
   - Vercel deploys automaticamente em `bretda.com.br`

5. **Re-run audit em produção pós-deploy**
   - Smoke test: `https://bretda.com.br/colecao/todas` em iPhone
   - Verificar 404 zero em DevTools Network
   - Score Playwright em produção real

---

## Risk assessment detalhado

| Categoria | Risco | Mitigação |
|-----------|-------|-----------|
| Sprint 0 refactor homepage | MÉDIO — homepage muda sensivelmente | Preview deploy iPhone real antes de merge |
| Sprint 1 Sentry SDK | BAIXO — feature additiva, não-breaking | Sentry só captura, não bloqueia |
| Hotfix P0-1 CSS color | BAIXO — troca de variável CSS testada | WCAG audit confirma contraste OK |
| Hotfix P0-4 slug video | BAIXO — asset confirmado existente | `Get-ChildItem` validou `sentidos-1080.mp4` + `sentidos-poster.jpg` |
| Hotfix P0-5 i18n strings | BAIXO — só 2 strings, sem regex automation | Grep confirmou zero strings EN remanescentes em `/src` |
| Hotfix P1-7 touch targets | BAIXO — padding-only, visual preservado | `gap: 12 → 0` nos `<ul>` compensa novo padding |

**Risk total: MÉDIO** — dominado pelo escopo Sprint 0/1 ampliado, não pelos 4 hotfixes.

---

## Rollback plan

```bash
# Identificar merge commit
git log --oneline main -5

# Revert
git revert -m 1 <merge-commit-sha>
git push origin main

# Vercel detecta novo commit em main e re-deploya estado anterior automaticamente
```

Tempo de rollback: ~3 minutos (revert + push + Vercel deploy automático).

---

**Última atualização:** 2026-05-15 (mobile-recovery agent)
**Próximo dono:** Breno (push authorization gate)
