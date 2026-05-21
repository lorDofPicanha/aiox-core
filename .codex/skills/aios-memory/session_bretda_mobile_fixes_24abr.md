---
name: Sessão Bretda Mobile Fixes 24/Abr
description: Fix 3 bugs mobile no site Bretda (prototype HTML). Descoberta crítica — transitionDelay "150s" (150 SEGUNDOS) fazia seções "fecharem sozinhas" em desktop E mobile.
type: project
originSessionId: f7109563-875f-476e-ac8a-8dbc5cd60eba
---
## Bretda Mobile Fixes — 24/Abr/2026 (noite)

**Contexto:** User reportou 3 bugs via 5 screenshots WhatsApp do iPhone real em `bretda.com.br`. Site no ar é HTML estático (não Next.js).

### Projeto canônico (IMPORTANTE — fácil confundir)

**Site NO AR = `D:/AIOS/docs/projects/bretda-landingpage/prototype/`** (HTML estático + Vercel)
- `index.html` (1140 linhas)
- `bretda.css` + `luxury-animations.css` + `luxury-animations.js`
- `vercel.json` (rewrites + headers)
- Deploy: `prototype-tawny-omega.vercel.app` → `bretda.com.br` (DNS pendente)

**Apps Next.js NÃO estão no ar** (fácil se enganar):
- `D:/AIOS/apps/bretda-lp/` — Next 16, tem configurador 3D, NÃO deployado
- `D:/AIOS/apps/bretda-v2/` — descontinuado

### Bugs Reportados

1. **Overflow horizontal em títulos display** (mobile iPhone)
   - "ELEVANDO O **ENTRETENIMENTO**" estourava laterais
   - "ONDE TRADIÇÃO ENCONTRA **VANGUARDA**" cortava topo
   - "**FERRAMENTA** 3D PARA ARQUITETOS" invisível no topo

2. **Seção "BRETDA EM NÚMEROS" vazia** — só "200+" + espaço gigante
   - User: "todas minhas seções fecharam sozinhas"

3. **Depoimentos: 3 cards (1 real + 2 fakes)** — manter só BH e trocar imagem da mesa por foto da pessoa

### 🔴 DESCOBERTA CRÍTICA (bug 2)

**Root cause das "seções fechadas"**: `transitionDelay: "150s"` ao invés de `"0.15s"`.

Código antigo em `luxury-animations.js`:
```js
const delay = el.getAttribute('data-reveal-delay') || 0;
element.style.transitionDelay = delay + 's';  // "150" + "s" = "150s" = 150 SEGUNDOS
```

HTML usava `data-reveal-delay="200"` (ms), `"400"` (ms) — o JS concatenava "s" direto e virava 150/200/400 SEGUNDOS de atraso. Afetava desktop também — user nunca esperava 2,5min.

**Fix:** parse como ms + divide por 1000 → `delay + 'ms'` direto + safety net `setTimeout(4000)` que força `.revealed .visible` em qualquer `[data-reveal]` pendente.

### Arquivos editados (NÃO commitados — working tree local)

| Arquivo | Mudança |
|---|---|
| `prototype/luxury-animations.js` | Reescrita `initScrollReveal()` (linhas 405-454) + fallback sem IntersectionObserver + safety net 4s |
| `prototype/luxury-animations.css` | `clamp()` mais agressivo em `.hero-xl/.hero-md/.hero-sm` + `word-break: break-word !important` + `hyphens: auto` + breakpoint novo `@media (max-width: 379px)` (iPhone SE) |
| `prototype/index.html` | Depoimentos linhas 694-743: removidos "Arquiteto Parceiro" + 3º card. Card BH centralizado `max-w-xl mx-auto` + avatar placeholder "AC" + `<!-- TODO: foto real cliente BH -->`. Observer inline (linhas 1015-1025): guard IntersectionObserver + threshold 0.05 + safety net 4s |

### Mind Clones (regra "Always Squads")

Script `.aios-core/core/jarvis/self-consultation.js` **quebrado** (MODULE_NOT_FOUND) — confirmado por aios-dev. Memória anterior (23/Abr) já documentava bug. Dev aplicou heurísticas consolidadas:

- **Don Norman**: safety net temporal para animações que não disparam → `setTimeout(4000)`
- **Vitaly Friedman** (Smashing Mag 2025): `clamp()` + `hyphens: auto` + `overflow-wrap` + `word-break` como última linha de defesa em títulos display uppercase
- **Brad Frost** (atomic design): breakpoint `<380px` específico para iPhone SE

### Avisos importantes

- **Foto cliente BH faltando**: `D:/conteudos bretda/Imagens diversas/` só tem PDF de identidade visual. Card ficou com avatar de iniciais "AC". Quando user conseguir foto real (com consentimento LGPD Art.7 I): salvar em `img/clientes/cliente-bh-ana-carolina.jpg` (160x160 WebP) + substituir avatar.
- **Regressão visual intencional** em desktop: depoimentos de 3-col → 1 card centralizado. Alinhado com "Quality Over Easy Path".
- **Bug do transitionDelay afeta todas as páginas** (`catalogo.html`, `configurador.html`, `produto.html`, `contato.html`, `arquiteto.html`) — fix em `luxury-animations.js` é global, propaga automaticamente.

### Próximos passos

1. User valida local (via `serve-nocache.py` ou `file://`)
2. Deploy Vercel (@devops authority) → redeploy `prototype-tawny-omega.vercel.app`
3. Validar mobile real (iPhone SE 375px, Android 360-400px)
4. DNS switch bretda.com.br (lembrete ativo separado)
5. Foto cliente BH quando disponível

### Regra reforçada (pra próximas sessões)

**"Always Squads" aplicada corretamente:** user lembrou "mande os agentes e clones fazerem isso" após Orion começar investigação. Orion delegou aios-dev autônomo com brief completo + consulta mind clones — NÃO implementou direto. Mesmo padrão da memória `feedback_always_squads.md`.
