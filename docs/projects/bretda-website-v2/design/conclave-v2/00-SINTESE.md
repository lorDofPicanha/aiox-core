# Conclave v2 — Reavaliação (motion/espetáculo) do site Bretda

Disparado após o founder reprovar o v3 estático: "muito feio, não parece luxo, texto demais, SEM motion/parallax". 3 vozes independentes (DNA real). Data 2026-06-24.

## Notas
| Voz | Lente | Nota |
|-----|-------|-----:|
| Tobias van Schneider | espetáculo/art direction | **4/10** ("template Webflow, não atelier de $40k") |
| Val Head | sistema de motion | **3/10** ("se comporta como PDF; ossos certos, está morto") |
| BJ Fogg | conversão sob motion | **6,5/10** ("certo p/ Motivação, errado se for o plano todo") |

## Prescrição consolidada (o que o chefe está construindo)
**Espetáculo (Tobias):** regradar tudo p/ "joia no veludo" (luz rasante dura, void quase-preto + bloom, macro) · Hero "Carved from the Dark" (mesa surge do escuro c/ varredura champanhe, 1 palavra Bodoni 14-22vw, **matar os parágrafos**) · **The Orbit** (turntable scrubbado pelo scroll = jogada-assinatura) · coleção como palco (1 peça full-bleed por vez, não grid) · Lenis + power3.out + film-grain.

**Motion (Val Head) — tokens:** ease-luxe `cubic-bezier(0.16,1,0.3,1)`, ease-curtain `(0.77,0,0.175,1)`, ease-settle `(0.22,1,0.36,1)`, ease-micro `(0.4,0,0.2,1)`. Durações hero 1200-1400 / reveal 800-1000 / settle 600-800 / micro 180-250 / stagger 90-140ms. SEM bounce/spring. 5 moves: curtain-lift, hero-parallax 0.6×, bands masked reveal (play once), cards stagger só na faixa visível, 1 cena PINADA. Jank: **Lenis+ScrollTrigger num único rAF**, só transform/opacity, prefers-reduced-motion via matchMedia, reveal-once, parallax ≤12-15%, mobile cai p/ fades.

**Conversão (BJ Fogg) — guarda-corpos:** CTA persistente ao alcance + CTA por peça no pico de desejo (sem zona morta cinematográfica) · manter "spec moment" enxuto por peça (âncora de preço/dimensões/materiais/lead time/Ships US-EU = Ability, não cortar) · CTA no hero ANTES do scroll-jack + degrau menor (lookbook/WhatsApp/call).

## Asset-chave descoberto
**Vídeos REAIS** no acervo (`apps/bretda-lp/public/videos/`): aurora-hero / espinela-hero / opal-hero / zurita-hero / opal/detail + reels (design-process, depoimentos). Hero = **vídeo real de produto** (não parallax de JPG; não é IA). 13 GLB + opal/detail p/ orbit/macro.

## Build
`design/v2/home-motion.html` (Lenis + GSAP ScrollTrigger via CDN, vídeo real, nomes ORIGINAIS, $/€, zero IA).
