---
name: Bretda Design Squad v3 from Scratch — PAUSED 07/Mai
description: Plano completo do redesign 10/10 luxury Bretda from scratch — pausado para fix urgente do site atual (fotos + configurador não carregando)
type: project
originSessionId: acae07e5-7070-4d8c-9f68-ea4360bb2607
---
# Bretda Design Squad v3 — PAUSADO 07/Mai

**Status:** 🟡 BRIEFADO mas NÃO disparado. User pivotou pra urgência (fix preview Vercel).
**Trigger pra retomar:** "vai com bretda design squad v3" ou "1A 2A 3" / "Orion go"

## Contexto user (07/Mai)
User aprovou conceito de redesign **from scratch** após gostar do resultado do Tocks design squad. Pediu:
- Total liberdade
- **Foco APENAS em luxo**
- Não aproveitar NADA já criado
- **Preservar:** configurador 3D + imagens + vídeos + identidade visual + tipografia
- 10/10 profissional

## Assets preservados (mapeados, validados)
**Repo LP:** `D:\AIOS\apps\bretda-lp` (Next.js 16, atomic design)

| Asset | Localização | Qtd |
|---|---|---|
| Configurador 3D | `src/app/configurador/` + `public/models/*.glb` | 13 modelos GLB |
| Imagens | `public/img/` (acabamentos, ambientes, ambientes-enscape, categoria-thumbs, colecao, logos) | 148 |
| Vídeos hero | `public/videos/` (aurora/espinela/opal/zurita) | 4 |
| Logos | `public/img/logos/` | 6 |
| **Tipografia OFICIAL** | `public/fonts/` | **Century Gothic + TAN-AEGEAN** |

⚠️ **Achado crítico:** DESIGN.md atual (Cormorant Garamond + Raleway) **foi invenção do sprint 30/Abr que user rejeitou**. Fontes oficiais reais: Century Gothic + TAN-AEGEAN. Squad novo DEVE usar as oficiais.

## Rejection Knowledge respeitada
`.out-of-scope/luxury-redesign-without-benchmark.md` — implementar luxo sem benchmark visual lado-a-lado = 5ª falha garantida. Aston Martin deep dive (33 PNGs / 19 tactics, 04/Mai) já existe e é válido.

## 3 Decisões propostas (aguarda resposta user)
**DECISÃO 1 — Aston Martin research existente**
- A) Usar como base + 3 refs novas (Cassina + Bottega + Aman) — economiza 1d
- B) Descartar tudo + benchmark novo (Hermès, Loro Piana, Brunello, Edra, Bonacini) — +1d

**DECISÃO 2 — Sitemap**
Routes atuais: /, /atelier, /colecao, /configurador, /contato, /encomenda-particular, /legal, /newsletter
- A) Total liberdade squad redefinir IA + sitemap
- B) Travar rotas, só redesign visual

**DECISÃO 3 — 3 Thesis Paralelas (recomendado)**
- **A. Editorial Magazine** — Typography-led, longform, revista impressa (Loro Piana Journal / Hermès Magazine)
- **B. Atelier Gallery Cinematográfico** — Black canvas, IMAX feel, full-bleed video, copy escassa (Cassina / Edra / Bocci)
- **C. Concierge Discreto (Ghost Luxury)** — Whitespace radical, copy minimalista assinada (Aman Resorts / Brunello Cucinelli)

## Flow proposto (7-8d)
```
Phase 0  (1d) — Visual benchmark + DNA extraction
Phase 1  (1d) — Brief 10/10 + 3 thesis briefs + Conclave (Rams/Neumeier/Schneider/Anadol/Friedman)
Phase 2  (2d) — 3 squads paralelos → variants Stitch/HTML
Phase 3  (½d) — User triage → winner ou frankenstein
Phase 4  (3d) — Implementação Next.js (preserva assets)
Phase 5  (½d) — A/B gate vs benchmarks
```

## Tasks no TaskList (aguardando retomada)
1. [completed] Map preserved assets
2. [completed] Audit out-of-scope dead-ends
3. [pending] Mind Clone Conclave (luxury experts)
4. [pending] Brief 10/10 Luxury Bretda
5. [pending] Spawn Design Squad (3 thesis paralelas)

## Trigger pra retomar
- `vai com bretda design squad v3` — autopilot
- `1A 2A 3` — confirma decisões e dispara
- `Orion go` — eu decido tudo (Aston Martin base + total liberdade sitemap + 3 thesis A/B/C)
