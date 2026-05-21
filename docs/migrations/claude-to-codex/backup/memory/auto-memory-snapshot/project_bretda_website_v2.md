---
name: Bretda Website v2 — New Luxury Site
description: Novo site Bretda from scratch. Next.js 16 + Tailwind v4 + GSAP + Lenis + Three.js. Dark theme, identidade visual oficial, configurador Porsche-style planejado. Deploy Vercel ativo.
type: project
originSessionId: e33169c2-065b-4f2b-aebe-828a0688fa4b
---
## Bretda Website v2 — Status 16/Abr/2026

**Projeto:** `D:/AIOS/apps/bretda-v2/`
**Stack:** Next.js 16.2.4, Tailwind v4, GSAP + ScrollTrigger, Lenis smooth scroll, Framer Motion, Three.js (R3F), clsx
**Deploy:** https://bretda-v2.vercel.app (precisa redeploy com paginas novas)
**Dev Server:** porta 3004 (ou 3003 se disponivel)
**Build:** PASSING — 19 paginas (6 rotas + 11 SSG produtos)

### Identidade Visual Oficial
- **Display Font:** TAN Aegean (serif) — `public/fonts/TAN-Aegean.woff2`
- **Body Font:** Century Gothic (sans) — `public/fonts/CenturyGothic.woff2`
- **Background:** #0A0A0A (deep black)
- **Charcoal:** #2A2B25 (cor do logo)
- **Gold accent:** #C9A96E (matte, nunca brilhante)
- **Text:** #F0EDE6 (off-white)
- **Cream sections:** #F5F3EF
- **Logo SVGs:** `public/img/logo-white.svg`, `logo-black.svg`, `simbolo-white.svg`
- **Brand identity extraida de:** `docs/projects/bretda-website-v2/brand-identity/Identidade Visual/`

### Paginas Implementadas
1. `/` — Home (hero video + stats + colecao + craftsmanship + CTA)
2. `/mesas` — Catalogo com filtros (Sinuca/Pebolim/Ping Pong)
3. `/mesas/[modelo]` — Detalhe produto (11 modelos SSG)
4. `/sobre` — Historia + processo + CEO
5. `/contato` — Form + info + mapa
6. `/mesa-bilhar-jantar` — LP dedicada Google Ads (keyword otimizada para QS)

### Animacoes Implementadas
- Lenis smooth scroll (`smooth-scroll-provider.tsx`)
- GSAP ScrollTrigger reveals (fade-up, fade-left/right, scale, counter)
- Hero parallax + film grain + mouse-follow gold light
- Navbar shrink on scroll + active link gold underline
- Product cards gold glow + "Conhecer" reveal on hover
- Framer Motion page transitions

### Pesquisa Completa (5 documentos)
- `docs/projects/bretda-website-v2/research/design-research.md`
- `docs/projects/bretda-website-v2/research/copy-research.md`
- `docs/projects/bretda-website-v2/research/marketing-research.md`
- `docs/projects/bretda-website-v2/research/competitive-analysis.md`
- `docs/projects/bretda-website-v2/research/configurator-research.md`

### Decisoes Tomadas (16/Abr)
1. Next.js from scratch (nao evoluir HTML antigo)
2. Seguir identidade visual oficial (TAN Aegean + Century Gothic)
3. Site completo primeiro, configurador depois
4. Deploy Vercel primeiro, depois apontar dominio bretda.com.br
5. Timeline full 4-6 semanas

### Proximos Passos
1. **Redeploy Vercel** com todas as paginas novas
2. **Design Squad + MCP Design Studio** (nano-banana-2, 21st.dev magic, stitch) para refinar visual
3. **Configurador Porsche-style** — 4 steps (Modelo → Personalizar → Tampo Jantar WOW → Resumo)
4. **Copy final** do Copy Chief aplicada nas paginas
5. **Assets reais** (fotos profissionais, video hero HD) — depende do cliente
6. **GTM + GA4** tracking setup

### Google Ads Bretda (otimizacoes 16/Abr)
- 19 negativas adicionadas
- "Grupo de anuncios 1" PAUSADO (queimava R$1.700/mes)
- Arquitetos B2B e Brand Bretda PAUSADOS (0 impressoes)
- CPCs ajustados: Bilhar+Tampo R$4,50 | Bilhar Luxo R$3,50 | Sinuca Luxo R$3,50
- 18 keywords migradas para AGs ativos
- Meta: 10+ leads CPL < R$90 em 30 dias, senao realocar para Meta

**Why:** Site antigo HTML nao suporta configurador nem SEO avancado. Novo site posiciona Bretda como first-mover em experiencia digital luxury no nicho de mesas de bilhar.
**How to apply:** Continuar iterando com squads. Proximo milestone: refinar com MCP Design Studio + configurador MVP.
