# Brief Executável — Dona Hilda Confeitaria

> DRY RUN — compõe Fase 2 DIAGNOSE + Fase 3 RESEARCH + Fase 4 DESIGN SYNTHESIS em entregável acionável para Fase 6 BUILD.

**Cliente:** P-006 Dona Hilda Confeitaria
**Gerado:** 2026-05-12
**Próxima fase:** BUILD (Fase 6) — Next.js 16 + Tailwind + Vercel

---

## 1. Contexto crítico do cliente

**Operação atual (descoberta Fase 2 — fato-de-negócio crítico):**
- Suspendeu atendimento nas mesas em **agosto/2025** após 35 anos (NSC Total + O Município)
- Operação ativa: **balcão + encomendas + iFood**
- **Site precisa REFLETIR essa realidade** — foco em encomenda/delivery, NÃO em "venha visitar nosso salão"

**Patrimônio reputacional:**
- 36 anos LTDA (desde 1990)
- 2.500+ reviews públicas combinadas (RestaurantGuru 2.118 + Tripadvisor 162 + Google 4,7★ + Yelp)
- Itoupava Seca, Blumenau/SC
- 13k followers Instagram (mas só 138 posts — concorrente Benkendorf tem 956)

**Gaps técnicos atuais (do site donahilda.com.br):**
- HTTP não HTTPS (Chrome avisa "Não seguro")
- Endereço listado "Vila Nova" (real é Itoupava Seca)
- Estrutura HTML estática `.html` 2008-era
- Sem WhatsApp Business tappable
- Sem schema LocalBusiness
- Sem LGPD/cookies banner
- Horário divergente entre canais (Google 8:30-19 vs Insta 9:30-18:30)

---

## 2. Sitemap (5 páginas mínimas)

```
/                       → Home (foco encomenda + WhatsApp + cardápio sazonal)
/sobre                  → História 36 anos + família + Itoupava Seca + fechamento mesas explicação
/cardapio               → Produtos atuais (com preços OR "consulte WhatsApp")
/encomendas             → CTA principal — formulário simples + WhatsApp button proeminente
/contato                → Endereço CORRETO + Mapa Google + Telefone + WhatsApp + Horário ÚNICO
/privacidade            → LGPD policy template (ADR-0002 Patricia Peck)
/termos                 → Termos uso template
/cookies                → Política cookies + banner consent
```

**Schema.org:** LocalBusiness + Bakery JSON-LD em todas as páginas.

---

## 3. Home — seções (vertical scroll editorial Hart-pattern)

| Order | Section | Conteúdo principal | Visual primary |
|---|---|---|---|
| 1 | **Hero** | H1: "Dona Hilda Confeitaria" + sub "Tradição artesanal Blumenau desde 1990" + CTA "Encomendar pelo WhatsApp" | Foto close-up cuca/sonho/produto-âncora (sessão presencial obrigatória) |
| 2 | **Sazonal banner** | "Páscoa 2026 — encomendas até DD/MM" OU "Festa Junina — cuca de uva fresca" (editável mensalmente) | Foto produto sazonal |
| 3 | **Sobre 36 anos** | 2-3 parágrafos história família + "Desde 1990" stamp + foto histórica (se houver) | Foto fachada Itoupava Seca + heritage signal |
| 4 | **Cardápio destaque** | 4-6 produtos âncora com nome+preço (ou "consulte") | Grid 2-col mobile, 3-col desktop |
| 5 | **Como pedir** | 3 passos visuais: WhatsApp / iFood / Balcão Itoupava Seca | Icons + endereço CORRETO |
| 6 | **Reviews social proof** | Carrossel ESTÁTICO (zero autoplay) com 3-5 quotes reais Google/Tripadvisor + nota agregada | Quotes + stars |
| 7 | **Contato + Mapa** | Endereço + Maps embed + Telefone tappable + WhatsApp button + Horário ÚNICO | Mapa interativo |
| 8 | **Footer** | Logo + endereço + horário + redes sociais + LGPD links | Cream-on-ink |

---

## 4. Copy seed (6th-grade PT-BR — CDC-compliant)

### Hero
- **H1:** Dona Hilda Confeitaria
- **Subtitulo:** Tradição artesanal de Blumenau desde 1990
- **CTA principal:** Encomendar pelo WhatsApp
- **CTA secundário:** Ver cardápio

### Sobre
> "Há 36 anos, a família Hilda assa todos os dias na Itoupava Seca. Pão de fubá, cuca, sonho, torta de banana. O mesmo cuidado de 1990, agora também por encomenda e iFood."

### Encomendas
> "Encomende seu bolo, torta ou doce para festa. Atendemos pelo WhatsApp e respondemos em horário comercial. Para pedidos do dia, use o iFood ou venha no balcão na Itoupava Seca."

### Como pedir (3 passos)
1. **WhatsApp** — encomende seu bolo, torta, salgados para festa
2. **iFood** — receba em casa o cardápio do dia
3. **Balcão** — passe na Itoupava Seca, R. Antônio da Veiga 440

### Disclaimer rodapé
> "Resultados de presença digital dependem de múltiplos fatores. Site administrado por Site-Prospector. Política de Privacidade · Termos de Uso · Cookies"

### Anti-padrões evitados (Patricia Peck + Kat Holmes)
- ❌ "Site que vende às 22h" → **✅ "Recebe e direciona pedidos 24/7 via WhatsApp"**
- ❌ "Achável no Google" → **✅ "Otimizado para buscas em Blumenau, sem garantia de posição"**
- ❌ Hover-only nav → **✅ Tap-friendly mobile-first**
- ❌ Autoplay carousel → **✅ Static social proof**
- ❌ Icon-only WhatsApp button → **✅ "Falar pelo WhatsApp" texto + ícone**

---

## 5. Stack & build constraints

```yaml
framework: Next.js 16 (App Router + Server Components)
styling: Tailwind CSS (config from tokens.json)
hosting: Vercel (gru1 BR region)
forms: Server Action + Resend (transactional) OR direct wa.me link only
analytics: Plausible (privacy-first) OR Vercel Analytics
fonts: Google Fonts subset Latin-Extended (Fraunces 400/700 + Inter 400/600/700)
images: AVIF primary + WebP fallback, Next/Image optimizado
CMS: MDX file-based (cardápio em /content/cardapio.mdx — editável Breno + Dona Hilda)
schema_org: LocalBusiness + Bakery JSON-LD em todas pages
LGPD: Cookie banner Google Consent Mode v2 + PoP + ToU links rodapé
sitemap_xml: gerado automático + robots.txt
PWA: manifest + favicon + touch icons
```

### Performance gates (Osmani — Quality squad)

| Métrica | Target | Onde validar |
|---|---|---|
| LCP field 3G BR | ≤ 2.0s | WebPageTest gru1 + Moto G Power |
| LCP lab | ≤ 1.2s | Lighthouse CI |
| INP | ≤ 200ms | RUM (Vercel Analytics) |
| CLS | ≤ 0.05 | Lighthouse + RUM |
| TTFB | ≤ 600ms | Lighthouse field |
| JS inicial gzip | ≤ 80KB (hard cap 100KB) | Next.js build report |
| Total first view | ≤ 500KB | Lighthouse |
| Hero image AVIF | ≤ 180KB | Manual asset check |

### Accessibility gates (Kat Holmes — Quality squad)

| Gate | Target | Como validar |
|---|---|---|
| Body type | ≥ 18px | CSS direto |
| Line-height body | ≥ 1.5 | CSS |
| Touch targets | ≥ 48×48px com ≥8px spacing | Manual check + axe |
| Body contrast primary | ≥ 7:1 AAA | DevTools contrast checker |
| Focus ring | ≥ 3px ≥3:1 contrast | DevTools |
| Icon-only actions | ZERO | Manual audit |
| Autoplay carousels | ZERO | Manual audit |
| Native HTML inputs | Sempre | Code review |
| `tel:`/`wa.me`/map deep-link | Presentes e clickables | Manual click test |
| `prefers-reduced-motion` | Honored | Test em DevTools emulation |

---

## 6. Photo strategy (CRITICAL — brand essence não capturável em tokens)

**Aprendizado Fase 4:** static CSS extraction NÃO captura brand essence. **Brand vem das fotos** (descoberta Tartine pattern).

### Sessão presencial 2h em Itoupava Seca

| Asset | Quantidade | Spec |
|---|---|---|
| Hero produto-âncora | 1 | 1920×1080 AVIF, close-up, natural light golden hour |
| Produto detail shots | 6-8 | 800×800 cada, fundo cream cohesivo, color-grade warm |
| Mão padeiro com farinha | 2 | Lifestyle shots — heritage signal |
| Fachada Itoupava Seca | 2 | Exterior daytime + golden hour |
| Família Hilda (opcional) | 1 | Group shot — só se família topar |
| Interior balcão | 2 | Vitrine de produtos do dia |
| Historic photo (se houver) | 1 | Scan B&W de 1990s — heritage stamp |

### Direção (resumo)
- Natural light golden hour (manhã 8-10h ou tarde 16-18h)
- Color grading warm (Portra 400 vibe — Tartine reference)
- Single product center, generous negative space, vertical-friendly mobile
- ZERO stock photo. ZERO filter overlay heavy. ZERO macro pure-white-sugar.

### Cessão direitos (CDC + Lei 9.610/98)
Contrato fotógrafo tripartite (Breno + Dona Hilda + fotógrafo terceirizado se houver):
- Cessão patrimoniais à Dona Hilda — uso comercial perpétuo
- Direitos morais retidos pelo fotógrafo
- Liberação imagem pessoas (família/funcionários) se aparecerem (CC art. 20)

---

## 7. Tokens.json + tailwind.config.js

✅ Gerados em `dry-run-P-006-dona-hilda/design/tokens.json` + sintetizados no SYNTHESIS-dona-hilda.md.

**Resumo:**
- **Palette:** cream `#F7F1E8` / ink warm `#2A1F1A` / terracota `#B85C3B` / amber `#C49531` (semantic warning)
- **Type:** Fraunces (display) + Inter (body 18px+)
- **Spacing:** 8-point scale, hero-y 160px
- **Radius:** moderate (4/8/12/24/full)
- **Motion:** 240ms base, prefers-reduced-motion honored
- **Anti-clone:** PASS (color 55% / type 40% / layout 50% — todos abaixo dos thresholds)

---

## 8. Build phases (Fase 6 ahead)

```
Phase A — Scaffold (1h)
  - Next.js 16 init (App Router)
  - Tailwind config from tokens.json
  - Google Fonts setup (Fraunces + Inter, Latin-Extended)
  - Layout root: header + main + footer
  - Schema.org LocalBusiness JSON-LD

Phase B — Home full (3-4h)
  - Hero + sub + CTA
  - Sazonal banner (MDX-driven editable)
  - Sobre section
  - Cardápio destaque (MDX cards)
  - Como pedir 3 steps
  - Reviews static carousel
  - Mapa + contato
  - Footer com LGPD links

Phase C — Internal pages (2h)
  - /sobre (mesma estrutura, mais content)
  - /cardapio (full menu via MDX)
  - /encomendas (form simple OR wa.me deep link only)
  - /contato

Phase D — Legal pages (1h)
  - /privacidade (template ADR-0002 personalizado)
  - /termos
  - /cookies + banner consent (Google Consent Mode v2)

Phase E — Polish & gate (1-2h)
  - Image optim (AVIF + Next/Image)
  - Lighthouse + axe + manual a11y
  - WebPageTest BR
  - Schema validation (Google Rich Results Tester)
  - Build size audit

TOTAL: 8-12h target (Pricing squad gate ≤16h tolerance)
```

---

## 9. Production Gate checklist (Fase 7 — antes de entrega)

> Todos os 8 gates devem PASS antes do offer pack.

- [ ] **Synthesis-gate**: tokens.json provenance OK, anti-clone < thresholds (já PASS ✅ dry run)
- [ ] **Field-perf-gate**: WPT gru1 + Moto G + Slow 4G: LCP ≤2s, INP ≤200ms, CLS ≤0.05
- [ ] **Inclusive-design-gate**: 18px+ body, AAA contrast, 48px touch, focus ring, no autoplay, native inputs
- [ ] **Content-truth-gate**: NAP validado Google Maps API, horário único validado, menu real ou "consulte WA"
- [ ] **Local-SEO-gate**: Schema LocalBusiness+Bakery, OG image real ≥1200x630, sitemap+robots
- [ ] **Legal-gate**: LGPD banner ON, PoP+ToU+Cookies links, privacidade@ email
- [ ] **Maintainability-gate**: MDX content surface, handoff doc, sem rebuild necessário para edit menu
- [ ] **Visual-regression-gate**: SSIM ≥0.95 vs preview design (nesse dry run pode pular — sem preview de base)

---

## 10. Offer pack consumed by Fase 8

Quando build PASS production gate, gera:
- `offer-pack/02-keynote-5-slides.pdf` — pra apresentação presencial
- `offer-pack/01-dossier-de-dor.pdf` — versão final do dossier (corrige bugs Fase 2)
- `offer-pack/03-mockup-hand-drawn.png` — NÃO, agora temos preview URL real (use screenshots ao invés)
- `offer-pack/04-proposta-comercial.pdf` — CDC-compliant
- `offer-pack/05-script-outreach.md` — Dor → Teach → Reveal sequence
- `offer-pack/06-followup-templates.md` — WhatsApp + email
- **Preview URL Vercel** — único, watermarked se possível

---

## 11. Open questions pré-build

1. **Fotografias ainda não existem** — sessão presencial é Stage 2 deliverable, mas dry run não vai presencial. **Placeholder strategy:**
   - Use IG público da Dona Hilda como source (com disclaimer cliente DRY RUN)
   - OR usar fal.ai gerar imagens AI placeholder (com disclaimer "concept render")
   - OR placeholder Unsplash "bakery interior" + manual override depois

2. **Domain pra preview** — Vercel preview URL é suficiente OR criar dominhio temporário tipo `donahilda-preview.site-prospector.com`?

3. **MDX cardápio** — content real ou "[Cardápio em construção — consulte WhatsApp]" como placeholder ético?

**Para dry run:** vou usar Next.js scaffold simulado + foco em PROVAR que o flow funciona com tokens reais. Não vai a produção real — só artefatos pra LEARNINGS.
