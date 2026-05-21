---
name: Bretda Banner Brief 17/Abr
description: Design spec do banner Google Display 300x600 para Bretda (direção EDITORIAL aprovada)
type: reference
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Bretda Banner Display 300x600 — Direção EDITORIAL

## Localização

**Spec completa:** `D:\conteudos bretda\briefs\2026-04-17-banner-display-300x600-editorial.md`

## Resumo

- **Produto:** mesas bilhar/snooker Bretda luxury (R$ 33.000+)
- **Direção aprovada:** **D5 — Editorial** (magazine-style, Architectural Digest aesthetic)
- **Canal:** Google Display Network Half Page (300x600)

## Hierarquia visual

1. Full-bleed foto real de mesa em ambiente IA editorial (60% altura = 360px)
2. Whitespace grafite (5% = 30px)
3. Headline Cormorant ~42-48px off-white: *"Herança. Customização. Sua."* (20% = 120px)
4. Subline Raleway thin: *"Mesas Bretda · sob medida no Brasil"* (8% = 48px)
5. Filete dourado hairline + CTA: *"projete a sua →"* (7% = 42px)

## Paleta

- Grafite `#1A1A1A` (fundo)
- Off-white `#F5F2EA` (texto)
- Dourado `#C9A96E` (accent)

Contrastes: grafite×off-white 14.2:1 (AAA), grafite×dourado 6.8:1 (AA)

## Restrições críticas

- **Mesa = foto real obrigatório** (fonte: `D:\conteudos bretda\Produtos` ou `Imagens diversas`)
- Ambiente AO REDOR pode ser IA, estética Architectural Digest (painéis madeira, piso concreto/taco, luz quente, arte moderna)
- Nunca gerar mesa sintética por IA

## Status

Brief aprovado via skill `obra/brainstorming` em 17/Abr. Produção do PNG final pendente — skill `ckm:banner-design` bloqueada por deps fantasmas (ver `feedback_agentskill_orchestrator_deps.md`).

**Workflow de produção adaptado proposto (ainda não executado):**
1. `/brainstorming` com brief (JÁ FEITO)
2. `nano-banana-2` MCP para gerar ambiente IA
3. Compositing manual ou `/canvas-design` para sobrepor foto real de mesa
4. `playwright` MCP para screenshot final 300x600 PNG

Autor do brief: Orion (aiox-master orchestrator) via skill brainstorming.
