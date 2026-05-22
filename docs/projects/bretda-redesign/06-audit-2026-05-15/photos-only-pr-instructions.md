# Photos-Only Minimal PR — Cherry-pick S0.5 Instructions

**Data:** 2026-05-15
**Agente:** Dex (aios-dev)
**Status:** Branch local pronta. Aguardando autorização do Breno pra push.

---

## TL;DR

Cherry-pick limpo do commit **S0.5** (`11d6809`) isolado para uma branch nova a partir de `origin/main`. Zero conflitos, zero dependências indesejadas, build PASS, lint PASS no arquivo tocado.

Mudança visual: cards do `/colecao` deixam de mostrar PNG cutout transparente (efeito "silhueta flutuante" anti-luxury) e passam a usar JPG charcoal-card real (fundo neutro).

---

## Branch Pronta (Local)

| Campo | Valor |
|---|---|
| Branch name | `feat/colecao-photos-update-2026-05-15` |
| Base | `origin/main` (commit `9cc6795`) |
| Commits ahead | 1 |
| Commit hash local | `96b7409` (cherry-pick de `11d6809`) |
| Working dir | `D:\AIOS\apps\bretda-lp` |
| Remote alvo | `github.com/lorDofPicanha/bretda-lp` |

---

## Diff Stat

```
 .gitignore                                         |  6 ++++
 .../organisms/eleven-collection-gallery.tsx        | 34 ++++++++++++----------
 2 files changed, 25 insertions(+), 15 deletions(-)
```

**LOC delta:** +25 / -15 = **+10 net**.

### Files Changed (lista exata)

1. `.gitignore` — adiciona regras de ignore para `.tmp-sprint-0-screenshots/`, `.deprecated-2026-05-15/` (exceto markdowns), `playwright-report/`, `test-results/`.
2. `src/components/organisms/eleven-collection-gallery.tsx` — substitui `sku.cardImage` (PNG cutout) por `sku.whiteImage` (JPG charcoal-card) + ajusta `objectFit: contain` → `cover` + remove `background: transparent`.

**Nada mais.** Zero arquivos de navbar/footer/layout/hero/configurador tocados.

---

## Mudança Visual (resumo)

**Antes (produção atual em bretda.com.br/colecao):**
- `<Image src={sku.cardImage ?? '/img/colecao/{modelo}/orbit-1.png'} />` (PNG transparente)
- Card com `background: transparent`
- `objectFit: contain` (mesa não preenche todo o card)
- Resultado: efeito "silhueta flutuante" — mesa parece pairar sobre o charcoal da página

**Depois (branch nova):**
- `<Image src={sku.whiteImage} />` (JPG render charcoal-card, fundo neutro real)
- Card sem override transparente (herda eleven-card padrão)
- `objectFit: cover` (preenche todo o card)
- Resultado: cards com fundo neutro consistente, sem o efeito silhueta anti-luxury

> **Asset gap reconhecido (sem ação neste PR):** nenhum SKU tem lifestyle JPG real ainda. Renders charcoal-card são fallback honesto até fotografia comercial ou Enscape commissioned chegar. Doc detalhada em `06-audit-2026-05-15/lifestyle-assets-gap.md`.

---

## Validations Locais (executadas pelo Dex)

| Check | Status | Notas |
|---|---|---|
| `git cherry-pick 11d6809` | PASS | Zero conflitos |
| `git diff origin/main..HEAD --name-only` | PASS | Apenas 2 arquivos, ambos esperados |
| `npm run build` | PASS exit 0 | Compiled in 108s. 25 páginas estáticas geradas |
| TypeScript (via Next build) | PASS | Finished in 119s, zero erros |
| `npm run lint` | N/A no arquivo tocado | 25 erros pré-existentes em `origin/main` (configurador-3d.tsx + whatsapp.ts) — não introduzidos por este PR |

**Lint baseline:** os 25 erros react-hooks/refs em `configurador-3d.tsx` e o warning em `whatsapp.ts` já existem em `main`. Este PR **não piora** o lint score.

---

## Push Command (para Breno copiar/colar quando autorizar)

```bash
cd D:\AIOS\apps\bretda-lp
git push -u origin feat/colecao-photos-update-2026-05-15
```

Não há nada além disso pra rodar. A branch já está com o tracking configurado (`branch '...' set up to track 'origin/main'`), mas o `-u` no push reaponta o upstream pra `origin/feat/colecao-photos-update-2026-05-15`.

---

## PR Title Sugerido

```
feat(colecao): substitui cutout PNGs por renders charcoal-card [mobile-priority]
```

## PR Body Sugerido (PT-BR)

```markdown
## Contexto

92% dos leads Bretda chegam por mobile (Meta + Google Ads). A página `/colecao` é a
segunda mais visitada (after `/`). Os cards atuais usam PNG transparente (`orbit-1.png` /
`sku.cardImage`) sobre charcoal, criando efeito "silhueta flutuante" anti-luxury
detectado no Design audit (06-audit-2026-05-15/design-audit.md → N10 violation).

## O que muda

- `eleven-collection-gallery.tsx`: troca `sku.cardImage` (PNG cutout) por `sku.whiteImage`
  (JPG render charcoal-card com fundo neutro real)
- `objectFit: contain` → `cover` (mesa preenche todo o card, sem espaço vazio)
- Remove `background: transparent` do card media (herda eleven-card padrão)
- `.gitignore`: adiciona regras para artefatos de audit (`.tmp-*`, `.deprecated-*`,
  `playwright-report/`, `test-results/`)

## O que NÃO muda

- Navbar, footer, layout, hero, configurador 3D, ambientes, atelier — **nada**.
- Apenas o card visual da galeria `/colecao` e `/colecao/todas` (mesmo componente).

## Asset gap reconhecido (próximo sprint)

Nenhum SKU tem lifestyle JPG real (renders Enscape ambiente ou foto comercial). Os
renders charcoal-card são fallback honesto enquanto fotografia real não chega. Lista
dos 12 SKUs e roadmap em `docs/projects/bretda-redesign/06-audit-2026-05-15/lifestyle-assets-gap.md`.

**Não gerar lifestyle via IA** (Nano Banana / Stitch / DALL-E) — feedback rules
proibitivas em `feedback_ai_image_anti_tells.md` + `feedback_bretda_mesas_reais.md`.

## Validações

- `npm run build`: PASS (108s, 25 páginas estáticas)
- TypeScript: PASS (119s)
- Lint: zero issues no arquivo tocado (`eleven-collection-gallery.tsx`)
- Diff stat: +25 / -15 em 2 arquivos

## Risk Assessment

**Baixo.** `eleven-collection-gallery.tsx` é componente isolado consumido apenas em
`/colecao` e `/colecao/todas` (via mesma rota). Não afeta home, configurador, ambientes,
atelier, ou qualquer rota crítica de conversão (CTA-WhatsApp continua intacto).

Rollback: revert do single commit, deploy automático Vercel.
```

---

## Plano Pós-Push (passos pro Breno)

1. **Push manual** (comando acima) — triggers Vercel preview deploy automático.
2. **Aguardar Vercel preview** (~2-3min). URL aparece no PR como comment do bot Vercel.
3. **Validar preview em mobile real** (não simulação devtools): abrir preview URL no celular, navegar `/colecao`, scrollar cards, validar que:
   - Mesa preenche o card sem espaço vazio nas bordas
   - Fundo é consistente charcoal (sem efeito silhueta flutuante)
   - Performance LCP ainda < 2.5s em 4G
4. **Validar `/colecao/todas`** também (mesmo componente, lista expandida).
5. **Comparar visualmente** com `bretda.com.br/colecao` (produção atual) lado a lado.
6. **Se aprovado:** merge to `main` → Vercel deploya automaticamente → produção atualizada.
7. **Se reprovado:** comment no PR descrevendo o que quebrou, branch fica viva pra ajustes ou close PR sem merge (zero impacto produção).

---

## Risk Assessment

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Lifestyle JPG não existe pro SKU X | Baixa | `sku.whiteImage` é campo obrigatório no schema dos 12 SKUs (validado no commit-fonte). Build PASS confirma todos os imports resolvem. |
| LCP regression (JPG maior que PNG cutout) | Baixa-Média | JPGs charcoal-card já estavam servidos em outros lugares (lifestyle home Round 4). Next/Image continua aplicando `sizes` responsive. |
| Visual quebra em algum SKU específico | Baixa | Mesma estratégia já em uso na home (Round 4 R4.8). Se quebrar em SKU X, easy fix = ajustar `whiteImage` daquele SKU sem reverter o PR. |
| Conflito futuro com Sprint 1 | Baixa | Sprint 1 ainda local na `feat/sprint-0-audit-fixes-2026-05-15` — cherry-pick limpo significa que outros commits Sprint 1 não dependem de outras mudanças no `eleven-collection-gallery.tsx`. |

**Veredicto:** Risk LOW. Componente isolado, mudança visual contained, rollback trivial.

---

## Estado do Working Tree

Branch `feat/colecao-photos-update-2026-05-15` está checked out localmente.
Working tree tem muitos arquivos untracked (`.tmp-*`, `.commit-msg-*`, `scripts/round*.mjs`, `screenshot-localhost.mjs`, etc) que **não foram incluídos no commit cherry-picked** e ficam ignorados pelo `.gitignore` atualizado.

**Não há `git add` pendente.** Tudo que precisava entrar já está no commit `96b7409`.

---

## Comandos de Verificação Rápida (opcional, pro Breno conferir antes de push)

```bash
cd D:\AIOS\apps\bretda-lp

# Confirma branch correta
git branch --show-current
# Esperado: feat/colecao-photos-update-2026-05-15

# Confirma 1 commit ahead de origin/main
git log --oneline origin/main..HEAD
# Esperado: 96b7409 refactor(collection-gallery): substitui cutout PNGs...

# Confirma escopo do diff
git diff origin/main..HEAD --name-only
# Esperado:
#   .gitignore
#   src/components/organisms/eleven-collection-gallery.tsx
```

---

## Próximas Decisões (não bloqueantes deste PR)

1. **Lifestyle assets sprint:** quando contratar fotografia comercial / Enscape commissioned pros 12 SKUs?
2. **Sprint 1 push:** os outros 26 commits da branch `feat/sprint-0-audit-fixes-2026-05-15` ficam aguardando decisão separada (incluem QA fixes, SEO, robots, sitemap, contact honeypot, perf optimizations).
3. **Cleanup `.tmp-*`:** working tree tem ~30 arquivos `.tmp-*` untracked. Podem ser deletados quando convier (não bloqueia push).

---

**Status final:** Branch local pronta. Aguardando `git push -u origin feat/colecao-photos-update-2026-05-15` autorizado pelo Breno. Zero deploy automático até o push acontecer.
