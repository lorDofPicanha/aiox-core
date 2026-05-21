---
name: Bretda LP (site oficial)
description: Site Bretda migrado HTML→Next.js. Fontes Cormorant Garamond + Raleway, configurador 3D implementado, design tokens WCAG AA validados.
type: project
originSessionId: 06106f50-b64e-4019-814f-5025ac74129a
---
## Bretda LP — Status 16/Abr/2026

**Local:** `D:/AIOS/apps/bretda-lp/`
**Stack:** Next.js 16.2.1 + Tailwind v4 + Framer Motion
**Git:** working tree limpo, tudo commitado

### Fontes (trocadas)
- **Display:** Cormorant Garamond (via next/font/google)
- **Body:** Raleway (via next/font/google)
- Antes era TAN Aegean + Century Gothic (bretda-v2 — abandonado)

### Configurador 3D (implementado)
- Rota: `/configurador`
- Componentes: `src/components/organisms/configurador-3d.tsx` + `configurador-loader.tsx`
- Metadata: `robots: { index: false, follow: false }` (nao-indexado por enquanto)

### Design System
- Tokens WCAG AA validados via MCP Design Studio (text pairs min 5.64:1)
- Paleta: cream (#FEF7F2) / charcoal (#2A2B26) / gray-medium / whatsapp green
- Atomic design: atoms (button, divider, logo, section-heading) / molecules / organisms

### Paginas Ativas
1. `/` — Home
2. `/mesas` — Catalogo
3. `/sobre` — Historia + processo
4. `/contato` — Form + info
5. `/mesa-bilhar-jantar` — LP Google Ads
6. `/configurador` — Configurador 3D (noindex)

### bretda-v2 (abandonado)
Projeto paralelo em `apps/bretda-v2/` foi descontinuado em favor de evoluir o site antigo (bretda-lp). Decisao: evoluir o existente + trocar fontes + adicionar configurador.

**Why:** Manter SEO do site antigo + evoluir incrementalmente e mais seguro que refazer do zero.
**How to apply:** Trabalhar sempre em `apps/bretda-lp/`. Ignorar bretda-v2 exceto se houver decisao de retomar.
