---
name: Bretda Criativos Rodada 1
description: Sprint de produção de criativos Bretda 17/Abr — v1→v6 com diagnose Python + Editorial Spread sem crop
type: project
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Bretda Criativos Rodada 1 — Sprint 17/Abr/2026

## Contexto

Usuário pediu criativos novos pras contas de Google Display + Meta Feed + Stories/Reels. Produção intensiva com 6 iterações (v1→v6) até acertar design + copy + crop. Workflow Python-data-driven estabelecido.

## Jornada v1→v6 (cada versão aprendeu algo)

| Versão | O que tinha | Por que falhou | Aprendizado |
|--------|-------------|----------------|-------------|
| **v1** | 9 PNGs — 3 variações (A Editorial Ambar / B Minimal Espinela / C Curatorial Aurora) × 3 formatos | Design "catálogo" + copy vago ("Sua." cliffhanger) + imagens cortadas cover cego | `cover` sem calibração = crop garantido |
| **v2** | 3 PNGs Aurora com Copy C revisado (Copy Chief) + Editorial Spread (Design Chief) | Copy C mencionava "Jacarandá, peroba, imbuia" — **madeiras inexistentes na linha Bretda** | Validar copy factual com cliente ANTES de produzir |
| **v3** | 3 PNGs Aurora com copy correto (Freijó/nogueira/pau de ferro) | Ainda havia crop percebido, só Aurora, 1 ângulo | Cover horizontal crop era sistemático |
| **v4** | 9 PNGs — 3 linhas × 3 formatos em 3x retina | **Diagnóstico Python pós-fato confirmou: 2/9 tinham crop real** (Aurora e Espinela 1080x1350 direito) | Validação visual por olho do dev é insuficiente — **precisa Python automated** |
| **v5** | 9 PNGs Cutout Atelier total (PNG isolated + gradient temático) | User rejeitou: queria manter visual Editorial Spread do v4, não cutout puro | Cutout é safe pra anti-crop mas sacrifica storytelling ambiente |
| **v6 ✅** | 9 PNGs Editorial Spread Hybrid: background ambiente `blur(18px) + brightness(0.48) + scale(1.12)` + mesa PNG cropped overlay | **9/9 PASS validação Python com margem ≥10-19% lateral** | Hybrid = melhor dos 2 mundos (feel editorial + zero crop) |

## Copy final aprovado (v3+)

- **Headline:** *"Freijó, nogueira, pau de ferro. Cada peça escolhe sua forma."*
- **Subline:** *"Sob medida em madeira nobre brasileira."*
- **CTA:** *"visite o atelier →"*
- Arquétipo: Schwartz (mecanismo único) + Halbert (drama contido). Hopkins score 91/100.

**Madeiras reais Bretda (correção de 17/Abr):**
- Lâminas: Cabreúva, Carvalho Eur., Cinamomo, Freijó, Nogueira, Pau de Ferro, Rovere, Teca, Ébano-Linheiro
- Nobre madeira maciça: Guarapeira, Ipê Champ., Marupá, Pau de Ferro

## Design final aprovado (v6)

- **Paleta:** grafite `#1A1A1A`, off-white `#F5F2EA`, dourado `#C9A96E` (WCAG AA)
- **Fontes:** Cormorant (serif, headline) + Raleway (thin 200/regular 400, subline/CTA)
- **Layout 300x600:** Cutout Atelier + PNG mesa isolada em radial gradient
- **Layout 1080x1350 + 1080x1920:** Editorial Spread Hybrid — ambiente blurred/darkened background + PNG mesa cropped overlay + typography zone bottom
- **Quality:** `deviceScaleFactor: 3` (3x retina) + Chrome font antialiasing flags
- **Grain noise:** SVG fractalNoise 6% opacity mix-blend overlay

## Descoberta matemática-chave

Renders Paulinho 3508×2479 (aspect 1.415:1 landscape) têm mesa em tight framing (86-96% da width). Viewport 1080x1350 em `object-fit: cover` só exibe 57% (1908/3508) da width — **matematicamente impossível** caber mesa sem crop lateral. Solução: Caminho 2 Hybrid.

## v7 Final APROVADO — 54 PNGs + 36 comprimidos

**Status:** ✅ Usuário aprovou tudo 17/Abr ("ótimo gostei de tudo").

**54 PNGs v7** — 6 linhas (Aurora, Ambar, Espinela, Citrino, Opal, Zurita) × 3 ângulos (_01, _02, _03) × 3 formatos (300x600, 1080x1350, 1080x1920) em 3x retina:
- 300x600 (Cutout puro): ~1.0 MB cada × 18
- 1080x1350 (Editorial Hybrid): ~7.5 MB cada × 18
- 1080x1920 (Editorial Hybrid): ~9.6 MB cada × 18

**36 comprimidos Google Display** (300x600 only — 18 source × 2 métodos):
- JPG quality 88: 16-20 KB (avg 18.2 KB) — RECOMENDADO
- PNG pngquant: 30-43 KB (avg 35.5 KB) — alternativa com transparência

Todos ≤150KB Google Display limit (JPG passou com 12% do budget).

**Tint por linha aplicado:** warm (Ambar, Citrino) / cool (Zurita) / neutral (Aurora, Opal, Espinela).

**Validação automated:** 54/54 PASS — margem lateral média 13.5-13.7% em 1080×*, 7.7-11.0% em 300×600. Zero crop.

**Nomenclatura:** `{formato}-v7-{linha}-{angulo}.{png,jpg}`

## Pendente (próximas sessões, se desejar)

1. **Upload Meta** — user optou por "ainda não" no 17/Abr. Próxima sessão: 36 PNGs 1080×1350 + 1080×1920 via `mcp-ads-bridge meta_ads_upload_image`
2. **Upload Google Display** — 18 JPGs q88 via Google Ads UI ou MCP
3. **Vídeos** — briefs prontos `video-briefs.md` (2 × 15s 9:16 Orbit Ambar + Noir Espinela) — produção via `fal-ai-media` MCP OU ffmpeg local
4. **Expandir vídeos pras 6 linhas** — brief editorial pode ser replicado pra Citrino/Opal/Zurita

## Stack técnico estabelecido

- **Puppeteer via mermaid-cli** install global (`C:\Users\kingp\AppData\Roaming\npm\node_modules\@mermaid-js\mermaid-cli\node_modules\puppeteer`) — contorna conflito mem0ai em D:\AIOS
- **Chrome system** em `C:\Program Files\Google\Chrome\Application\chrome.exe`
- **Render flags:** `--font-render-hinting=none --enable-font-antialiasing --force-device-scale-factor=3 --allow-file-access-from-files`
- **Tmp profile** pra evitar lock de outra instância Chrome

## Lições aprendidas

1. **Validação visual por olho do dev é insuficiente** — Python PIL + bbox automated é obrigatório pra crop
2. **Copy factual sempre confirma com cliente** — Jacarandá/peroba não estavam na linha, perdemos 1 ciclo
3. **Caminho Hybrid > puro cover ou puro cutout** quando aspect mismatch é severo
4. **Arquivar versões antigas** economiza tempo — quando user flagou v4, pudemos voltar ao conceito pra v6
5. **Python scripts reutilizáveis** pagam tempo ao final: diagnose-crop + autocrop + validate viram base pra próximas rodadas
