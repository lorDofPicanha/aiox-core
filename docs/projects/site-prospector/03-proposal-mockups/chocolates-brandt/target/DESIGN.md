# Chocolates Brandt — Target DESIGN.md

> Tokens e direção de arte da marca-alvo (ADR-0004). Derivados de mídia first-party REAL
> (logo, feed @chocolatesbrandt, loja). NÃO copiam a referência-mestra premiada — só substituem
> a identidade dela. Fonte de cada token = asset real listado no `../asset-manifest.md`.

## Essência

- **Nome:** Chocolates Brandt · **Tagline real:** "Amor em forma de Chocolate"
- **Arquétipo:** chocolateria artesanal de fábrica, familiar (25 anos), afetiva e celebratória — não luxo frio de Paris. Calor + presente + tradição alemã de Joinville.
- **Ícone de marca:** roundel vermelho com "B" em script branco (foto de perfil real).

## Cores (extraídas do logo + loja reais)

| Token | Hex (aprox.) | Origem real | Uso |
|---|---|---|---|
| `--brand-red` | `#E11B22` | roundel do logo / fachada da loja | primária, CTA, marca |
| `--brand-red-deep` | `#B0141A` | sombra do vermelho | hover, profundidade |
| `--chocolate-900` | `#2A1A12` | chocolate/marrom escuro dos produtos | texto display, fundo escuro |
| `--chocolate-700` | `#4A2E1E` | marrom médio | texto secundário sobre claro |
| `--cream` | `#F7F1E8` | fundo studio das fotos de produto | fundo de seção, respiro |
| `--gold` | `#C9962B` | fita "FELIZ PÁSCOA" / laço de presente | acento de gifting, detalhes finos |
| `--white` | `#FFFFFF` | script do logo | texto sobre vermelho/chocolate |
| `--foliage` | `#2F5D3A` | parede verde do neon da loja | acento ambiental opcional |

Contraste (gate inclusive-design ADR-0004): corpo em `--chocolate-900` sobre `--white`/`--cream` = AAA. Texto sobre `--brand-red` sempre `--white`.

## Tipografia

- **Display / wordmark:** script caloroso (ecoa o "B" e o neon "Amor em forma de Chocolate") — usar com PARCIMÔNIA (títulos de seção, hero). Candidatos livres de licença: *Playfair Display* italic, *Cormorant*, ou script tipo *Sacramento* só no wordmark. **Não** clonar a fonte da referência.
- **Corpo:** sans humanista legível, **≥18px** (gate), line-height ≥1.5. Candidatos: *Inter*, *Source Sans 3*, *Mulish*.
- **Números/preço:** mesmo sans, peso medium.

## Forma

- `--radius-card`: 16px (suave, acolhedor — não duro/tech)
- `--radius-pill`: 999px (botões e tags, ecoa o roundel)
- Sombras: suaves e quentes (nada de sombra azulada fria)
- Motion: discreto; respeitar `prefers-reduced-motion`. Zero carrossel autoplay (gate).

## Direção de arte (foto)

- **Hero:** foto de produto limpa em fundo `--cream` (ex.: ovo de pistache real, post03) — ver `../asset-manifest.md`.
- **Ambiente/história:** fotos da loja com neon + parede verde (autenticidade familiar).
- **Gifting:** cestas com laço dourado (ocasião real que eles oferecem).
- **Regra ADR-0004:** só mídia first-party do Brandt. Permitido crop/limpeza/ajuste de cor; **proibido** gerar produto por IA ou usar banco de imagem como se fosse deles. Overlays de promo devem ser cropados fora nas fotos de hero.

## Voz

Calorosa, familiar, primeira pessoa ("aqui na Brandt"), afetiva. Copy real do feed: "Amor em forma de Chocolate", "momentos doces". Nível de leitura simples (gate ≤6º ano).
