---
name: Bretda Creatives — Paths & Scripts
description: Localização de artefatos da Rodada 1 Bretda (HTMLs, PNGs, scripts Python/JS, logs)
type: reference
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Bretda Creatives Rodada 1 — Artifacts

## Localização raiz

`D:\conteudos bretda\creatives\`

## Estrutura atual (pós-v6)

```
creatives/
├── html/                     # 9 HTMLs v6 ATIVOS
│   ├── 300x600-v6-{aurora,ambar,espinela}.html
│   ├── 1080x1350-v6-{aurora,ambar,espinela}.html
│   ├── 1080x1920-v6-{aurora,ambar,espinela}.html
│   ├── v1-rejeitado/           # 9 HTMLs v1 (design catálogo, copy vago)
│   ├── v2-wrong-woods/         # 3 HTMLs v2 (Jacarandá incorreto)
│   ├── v3-aprovado-aurora-only/ # 3 HTMLs v3 (copy ok, só Aurora, crop)
│   ├── v4-com-crop/            # 9 HTMLs v4 (HQ mas 2/9 com crop)
│   └── v5-cutout-consistente/  # 9 HTMLs v5 (cutout puro, rejeitado)
├── png/                      # 9 PNGs v6 ATIVOS (~62 MB total)
│   ├── [mesma nomenclatura]
│   └── [mesmo histórico archive]
├── assets/
│   └── cropped/              # 9 PNGs auto-cropped intermediários (whitespace removido)
├── scripts/
│   ├── diagnose-crop.py             # bbox detection em PNGs pós-render
│   ├── diagnose-9-ambientes.py      # bbox em renders source (ambientes)
│   ├── autocrop-isolated-pngs.py    # remove whitespace de PNGs alpha
│   ├── generate-v5-htmls.py         # programatic HTML generation (cutout)
│   ├── generate-v6-htmls.py         # programatic HTML generation (hybrid)
│   ├── validate-v5.py               # exit 1 se crop detectado (threshold 2.5%)
│   ├── validate-v6.py               # exit 1 se margin <10% lateral (threshold rigoroso)
│   ├── render-creatives.js          # v1 original (deprecado pelos .js-hq)
│   ├── render-creatives-hq.js       # 3x retina + Chrome antialiasing + flags custom
│   └── upload-creatives.js          # placeholder pra Meta upload via mcp-ads-bridge
├── logs/
│   ├── render.log                   # log v1-v3
│   ├── render-hq.log                # log v4-v6 (3x retina)
│   ├── crop-diagnosis.json          # dados bbox completos (v4-v5)
│   └── diagnose-9-ambientes.json    # dados bbox dos 9 renders source
├── briefs/
│   └── 2026-04-17-banner-display-300x600-editorial.md  # brief D5 original
├── video-briefs.md          # 2 briefs 15s 9:16 (Orbit Ambar + Noir Espinela), não produzidos
├── README.md                # onboarding general
├── node_modules/            # deps locais (puppeteer instalado inicialmente mas falhou Chrome download)
└── package.json
```

## Renders source (fotos oficiais)

`D:\conteudos bretda\Produtos\Imagens dos produtos\Renders novos - Paulinho\001 - Prontos para uso no site e Redes Sociais\`

**6 linhas × 6 arquivos cada = 36 arquivos:**
- `{Linha}_01.png, _02.png, _03.png` — product shots isolados (alpha transparente)
- `{Linha}_Ambiente_01.jpg, _02.jpg, _03.jpg` — mesa em cenário renderizado

Linhas: **Ambar, Aurora, Citrino, Espinela, Opal, Zurita** (Aurora/Ambar/Espinela já produzidas; Citrino/Opal/Zurita pendentes).

Dimensões: todos **3508×2479** (aspect 1.415:1 landscape).

## Puppeteer + Chrome local (paths críticos)

- **Puppeteer via mermaid-cli:** `C:\Users\kingp\AppData\Roaming\npm\node_modules\@mermaid-js\mermaid-cli\node_modules\puppeteer`
- **Chrome system:** `C:\Program Files\Google\Chrome\Application\chrome.exe`
- **Temp profile:** gerado dinamicamente em `os.tmpdir()/puppeteer-bretda-{timestamp}` por run

## Comandos úteis

```bash
# Render todos os HTMLs ativos em PNG 3x retina
cd "/d/conteudos bretda/creatives/scripts"
node render-creatives-hq.js

# Render apenas v6
node render-creatives-hq.js --only-v6

# Diagnose crop em PNGs existentes
python diagnose-crop.py

# Validar v6 (exit 1 se algum crop detectado)
python validate-v6.py

# Gerar variantes pra Citrino/Opal/Zurita (modificar generate-v6-htmls.py pra incluir essas linhas)
python generate-v6-htmls.py  # (ainda sem suporte Citrino/Opal/Zurita — adicionar)
```

## Copy final aprovado (v3+)

- **Headline:** *"Freijó, nogueira, pau de ferro. Cada peça escolhe sua forma."*
- **Subline:** *"Sob medida em madeira nobre brasileira."*
- **CTA:** *"visite o atelier →"*

## Paleta + Fontes locked

- Grafite `#1A1A1A` · Off-white `#F5F2EA` · Dourado `#C9A96E`
- Cormorant (500) + Raleway (200/400) via Google Fonts CDN

## Próxima sessão — checklist rápido

1. `start "" "D:\conteudos bretda\creatives\png"` pra preview
2. Se user aprovar: rodar `generate-v6-htmls.py` expandido pra Citrino/Opal/Zurita
3. Script de compressão JPG pra Google Display: `compress-for-display.py` (criar, ainda não existe)
4. Upload Meta via Claude Code session com `mcp-ads-bridge` ativo — invocar `meta_ads_upload_image` pra cada PNG
5. Vídeos: sessão com `fal-ai-media` MCP OU ffmpeg local + stills dos PNGs
