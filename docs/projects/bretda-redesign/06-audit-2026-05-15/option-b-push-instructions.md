# Bretda LP — Option B Push Instructions
**Branch:** `feat/mobile-bugs-photos-2026-05-15`
**Created:** 2026-05-15
**Author:** Dex (autonomous AIOS dev agent)
**Scope decision:** Cherry-pick conservative + hero responsive (NÃO rebuild homepage)

---

## Resumo da Missão

User pediu literalmente:
> "opção b, so troque as fotos, a que estão no site são piores, as que voce me mostrou estão melhores, conseguer a home page do jeito que da so redimencione a hero para celuar"

Tradução operacional:
- Manter homepage como está em produção (7 sections, layout atual)
- Trocar APENAS as fotos da coleção (cards: cutout PNG → whiteImage charcoal-card)
- Hero: **redimensionar** pra celular (NÃO rebuild) — preservar estrutura/copy/CTAs atuais, só fazer responsivo

---

## Conteúdo do Branch (18 commits ahead `origin/main`)

### Cherry-picked de `feat/mobile-recovery-2026-05-15`

**Sprint 0 (3 commits — bugs críticos):**
- `92b61bf` — fix(configurador-3d): corrige 25 lint errors React-19 ref anti-pattern [S0.1]
- `b4a8912` — feat(error-handling): adiciona error.tsx + not-found.tsx + loading.tsx globais [S0.2]
- `a918d1d` — refactor(collection-gallery): substitui cutout PNGs por renders charcoal-card + lista 12 SKUs para fotografia real [S0.5]

**Sprint 1 (9 commits — observability + security + SEO + perf):**
- `2444ed2` — feat(observability): Sentry SDK + source maps + per-route boundaries [S1.1]
- `5410f47` — ci(github-actions): quality gates pre-merge + Lighthouse CI budgets [S1.2]
- `9ead4b8` — chore(build): typecheck como gate obrigatório em next build + npm script [S1.3]
- `a27631e` — feat(security): rate-limit em 4 server actions via Upstash wrapper [S1.4]
- `4cd37bb` — fix(contato): honeypot anti-spam (paridade com 3 outras forms) [S1.5]
- `4fc7035` — feat(seo): robots + sitemap + manifest + favicon set completo [S1.6]
- `2f8ee29` — perf: img→Image atelier + hero video lazy + Three.js already dynamic [S1.7]
- `7b9670d` — perf(cache): avaliado Next 16 cacheComponents — deferido pra Sprint 2 [S1.8]
- `79524a9` — docs(observability): DORA dashboard URLs + baseline 2026-05-22 [S1.9]

**5 Hotfixes mobile audit 2026-05-15:**
- `77b6f3d` — fix(colecao/todas): heading visível em mobile (charcoal sobre charcoal void) [HOTFIX-P0-1]
- `265da7f` — fix(encomenda-particular): vídeo slug sensorial→sentidos (asset real path) [HOTFIX-P0-4]
- `c2b8949` — fix(contato): copy PT-BR (remove 2 strings em inglês) [HOTFIX-P0-5]
- `877c71e` — feat(a11y): touch targets ≥44px em footer + navbar + WhatsApp FAB [HOTFIX-P1-7] ⚠ resolved manually
- `4a553c5` — fix(navbar): mobile menu overlap pos-scroll (z-index/stacking context) [HOTFIX-P0-NAVBAR-MOBILE] ⚠ resolved manually

### Novo commit (criado nesta missão)
- `b13290a` — fix(hero): responsivo mobile — 100svh + padding reduzido [HOTFIX-P0-HERO-MOBILE]
  - `min-height: 100vh` → adicionado `100svh` (small-viewport-height, ignora URL bar mobile)
  - Padding mobile reduzido: top 120→80px, bottom 72→56px, lateral 40→24px
  - Desktop preserva valores originais via clamp (escala por viewport)
  - **ZERO mudança em estrutura/copy/CTAs do hero**

---

## ❌ O Que NÃO Está Incluído (DEFERRED — não aplicado)

| Commit | Mudança | Por quê deferido |
|--------|---------|------------------|
| `658b6e6` | S0.3 — homepage 7→3 sections | User quer manter homepage atual |
| `71a10d6` | S0.4 — hero rebuild caption ≤5 words | User quer hero atual responsive, não rebuild |
| `0a43abe` | S0.6 — navbar Conversar + footer 4→2 cols | User não pediu, mudança visual agressiva |
| `72af2f4` | S0.7 — italic budget = 1 site-wide | Depende de S0.3/S0.4 estarem aplicados |
| `58ec89a` | S0.8 — organisms órfãos quarantine | Depende de S0.3/S0.6 |
| `50bc496` | S0.9 — 3 fonts removidas | Mudança visual agressiva, deferred |

---

## ⚠ Conflitos Resolvidos Manualmente

### 1. `eleven-footer.tsx` (HOTFIX-P1-7 touch targets)
**Tipo:** Estrutural — hotfix foi escrito assumindo S0.6 aplicado (2 cols Atelier+Legal), mas branch base preserva 4 NAV_COLUMNS originais.
**Resolução:** Manter footer ORIGINAL (4 NAV_COLUMNS via array). O fix real está em `.eleven-footer-link` no `globals.css` (display: inline-flex + min-height: 44px + padding-block: 6px) — funciona em qualquer estrutura.
**Risco:** Mínimo. Touch target a11y aplicado via classe CSS, independente de quantas colunas.

### 2. `eleven-navbar.tsx` (HOTFIX-navbar overlap)
**Tipo:** Estrutural — hotfix foi escrito assumindo S0.6 (sem CTA "Fale com o atelier"), mas branch base preserva CTA.
**Resolução:** Preservei o CTA "Fale com o atelier" + apliquei as 3 mudanças core do hotfix:
1. `zIndex: menuOpen ? 70 : 50` (header dinâmico)
2. `createPortal(..., document.body)` (escapa stacking context da navbar blurred)
3. Overlay zIndex 30 → 60
**Risco:** Mínimo. CTA WhatsApp continua dentro do portal, funcionalidade preservada.

---

## ✅ Gates Validados Localmente

```
npm run lint              # exit 0 — 5 warnings preexistentes (não-bloqueantes)
npx tsc --noEmit          # exit 0 — PASS
npm run audit:wcag        # 9/9 PASS — todas combinações WCAG AA
npm run build             # exit 0 — 28/28 páginas geradas
```

---

## Score Projection

- **Atual (origin/main):** ~42/100
- **Pós-merge (estimado):** ~75/100

**Por quê só 75 e não 90+:**
- Não inclui S0.3/S0.4 (homepage rebuild) que dariam +10-15 pontos visuais
- Não inclui S0.8/S0.9 (cleanup de organisms órfãos + 3 fonts) que dariam +5 pontos performance/cleanliness
- Inclui 100% dos bug fixes + 100% das melhorias técnicas Sprint 1 + 100% mobile hotfixes + hero responsive

---

## Push Commands (aguarda autorização do user)

```bash
cd D:\AIOS\apps\bretda-lp
git push -u origin feat/mobile-bugs-photos-2026-05-15
```

### PR Sugerido

**Title:**
```
feat(mobile): bug fixes + photos + hero responsive (conservative scope, mantém homepage atual)
```

**Body (PT-BR):**
```markdown
## Contexto

92% dos leads da Bretda chegam via mobile. Esta PR aplica:
- **Bug fixes Sprint 0/1** (configurador-3d lint, error/loading boundaries, segurança rate-limit, SEO completo, observability Sentry/Lighthouse)
- **Photos refresh na coleção** (cutout PNG → charcoal-card renders, lista 12 SKUs para fotografia real)
- **5 hotfixes mobile audit 2026-05-15** (heading invisível /colecao/todas, vídeo slug encomenda, copy PT-BR contato, touch targets ≥44px, navbar overlap pós-scroll)
- **Hero responsive mobile** (100vh→100svh + padding reduzido — **ZERO mudança em estrutura/copy/CTAs**)

## Scope Decision (Conservative)

Mantém homepage atual em produção (7 sections, layout atual). NÃO aplica:
- ❌ S0.3 homepage rebuild 7→3 sections
- ❌ S0.4 hero rebuild caption ≤5 words
- ❌ S0.6 navbar/footer collapse
- ❌ S0.7/S0.8/S0.9 cleanup radical

Esses ficam para uma PR separada quando user autorizar mudança visual agressiva.

## Validação Local

- ✅ npm run lint (0 errors)
- ✅ npx tsc --noEmit (PASS)
- ✅ npm run audit:wcag (9/9 PASS)
- ✅ npm run build (28/28 páginas)

## Plano Pós-Push

1. Vercel preview build
2. Breno valida em iPhone real (375px, 320px) — focar:
   - Hero não vaza/quebra
   - Menu hamburger não sobrepõe nav pós-scroll
   - Heading /colecao/todas legível em charcoal
   - Touch targets clicáveis sem erro
3. Se OK → merge main
4. Se ajuste → reabre branch
```

---

## Próximas Etapas (depois deste push)

1. **Preview Vercel** valida deploy
2. **Smoke test mobile real** (Breno em iPhone próprio)
3. **Merge se OK**
4. **Sprint 2 planning** com S0.3/S0.4/S0.6 quando user autorizar mudanças visuais
