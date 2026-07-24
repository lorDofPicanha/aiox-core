# Direção Visual v2 — "Editorial Notebook" (via Stitch)

> Projeto Stitch `15872673328705083719`, design system asset `7bc414d6e963427690fb1454cbbf8a18`. Screenshots em `stitch/`. Validada em 2 telas (Hoje + Diário).

## Conceito

**Caderno emocional** — santuário de reflexão. Minimalist-Editorial: papel creme, serif literária pro conteúdo, sans utilitária invisível pra UI, FLAT absoluto (zero sombras — profundidade por camadas tonais), formas pill/rounded-3xl ("seixos sobre papel"), respiro generoso (ritmo 8px frouxo, gaps 48px+).

## Tipografia (página em branco preenchida)

- **Newsreader (serif)** — wordmark (só itálico), voz da Anipis, entradas do diário, títulos. Line-height 1.5-1.6.
- **Libre Franklin (sans)** — TODA a UI funcional (labels, botões, nav, metadados). Substitui o Inter.
- Escala: display-italic 48/56 · headline 32/40 (28/36 mobile) · body-serif 20/32 · body-sans 16/24 · label-md 14/20 · label-caps 12/16 +5% tracking.

## Camadas tonais (mapeadas nos tokens invariantes)

L0 canvas `#f7f4ed` → L1 containers `#efeae0` (cards/bolha usuária) → L2 indicadores `#d7e4d0` (chips/hover). Tinta `#1a1814`. Verde floresta `#2f5235` SÓ ação/marca/ativo. Emotion chips: alegria pêssego / calma azul / tristeza lilás / ansiedade sálvia (invariantes).

## Componentes-chave (confirmados nas telas)

- Botão primário: pill verde floresta, texto branco. Secundário: outline tinta 1px sem fill.
- Bolha da usuária: `#efeae0`, rounded-3xl, padding generoso. **Anipis: serif full-width sem bolha sem avatar.**
- Inputs: fill creme sutil OU linha; foco = borda inferior 1.5px verde (sem glow).
- Chips: sálvia/emotions + sans label-md, sem borda.
- Listas: hairline 0.5px tinta; ícones só funcionais.
- Header app: wordmark "anipis." itálico esquerda + "precisa de ajuda agora?" verde direita (crise sempre a um toque).
- Tab bar: 3 destinos (Hoje/Diário/Você), creme, ativo verde, sem sombra.
- Gráfico "seu caminhar": linha fina verde orgânica sobre creme, SEM grid/números/eixos.

## Telas geradas (referência)

- `stitch/hoje-mobile.png` — conversa estilo página (aprovada como direção)
- `stitch/diario-mobile.png` — timeline de dias com mood chips (aprovada)

## Adaptações obrigatórias na implementação

- Dark mode: mapear camadas tonais pro tema noite-floresta invariante.
- Crise: tijolo #8f2c1b (não o error vermelho do Stitch), zero motion.
- Contraste: manter 30/30 (text-muted #67635b nos metadados, não os cinzas do Stitch).
- Touch 44px, focus-visible verde.
