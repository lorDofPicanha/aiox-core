---
name: Tocks LP - Landing Page Luxury
description: Tocks Custom LP em Next.js 15. UltraPlan audit completa (32 fixes). Hero video pronto para MP4. Deploy Vercel gru1.
type: project
originSessionId: 87735a47-4354-4e97-9f5a-9df5c9a2374c
---
## Tocks LP — Landing Page Multi-Page Luxury

**Status:** 32 issues corrigidos (12 CRITICAL + 20 HIGH). Build OK. Awaiting hero video.
**Repo:** `D:\AIOS\apps\tocks-lp\`
**Commit:** `feat(tocks-lp): UltraPlan audit — fix 32 issues (12 CRITICAL + 20 HIGH)`
**Deploy config:** Vercel region `gru1` (São Paulo)

### Stack
- Next.js 15.3 + React 19 + Tailwind v4 + GSAP 3.14 + Three.js + Lenis
- 8 páginas: Home, Coleção, Produto [slug], Atelier, Processo, Projetos, Contato, Personalizar (removida da nav)

### UltraPlan Audit (10/Abr/2026)
- 5 agentes paralelos: UX Visual, UX Animações, Copy Chief, Performance, UX Páginas
- Score antes: 6.6/10 → Score depois: ~8.5/10 (estimado)
- 12 CRITICAL + 20 HIGH resolvidos em sessão única

### Principais mudanças
- page.tsx convertido para Server Component (3.94 kB JS)
- Hero: vídeo player pronto (`/videos/hero-curve.mp4`), logo SVG, frase "Não é uma mesa. É uma declaração."
- GSAP cleanup (gsap.context + ctx.revert) em 5 componentes
- useReducedMotion hook + CSS prefers-reduced-motion
- Product type expandido: description, images[], specs por produto
- 7 depoimentos (era 4), com detalhes concretos
- Breadcrumbs, Lightbox, Trust bar, focus-visible states
- Nav throttle rAF, cursor quickTo, WhatsApp FAB throttle
- Personalizar removido da nav (decisão do usuário)

### Pendente
1. **Vídeo hero** — prompt pronto para Runway Gen-3 (mesa Curve, estilo 11ravens.com)
   - Salvar em: `public/videos/hero-curve.mp4`
   - Player autoplay/muted/loop já configurado
2. **Fotos de renders com ambientes** — usuário vai enviar conteúdo
3. **MCP Design Studio** — ativada mas precisa reiniciar sessão para carregar 24 tools
4. **Mind Clones consultados** — Refika Anadol, Don Norman, Dieter Rams (respostas pendentes)

### Referência de estilo
- 11ravens.com — dark, moody, spotlight dramático, slow orbit camera

**Why:** LP é o funil principal de conversão para ads Google+Meta (R$180/dia budget). Precisa converter visitantes em leads WhatsApp.
**How to apply:** Quando usuário falar de tocks-lp, lembrar que hero video está pendente e fotos de renders são o próximo passo.
