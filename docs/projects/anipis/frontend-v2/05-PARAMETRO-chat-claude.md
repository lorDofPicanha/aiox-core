# Parâmetro de Referência — Chat do Claude (claude.ai)

> Extraído via Refero MCP (pedido do founder 12/Jun). Serve de PARÂMETRO pro chat do Anipis: a conversa deve ser turno-a-turno (como o Claude), nunca "juntando texto e ideia". Fonte: refero `47cb86b6` · screenshot: https://images.refero.design/styles/refero.design/image/42b2049c-bf65-4731-8f2c-69fecdf9148b.jpg

## North Star do Claude
> "Warm letterpress on cream paper — a literary workspace where ink-black text rests on ivory stock and color appears only as deliberate annotation."

**= praticamente idêntico ao nosso "Editorial Notebook".** O caminho do Anipis está alinhado com a referência que o founder pediu. Validação forte.

## Alinhamentos (já fazemos igual)
- Canvas creme/ivory (Claude `#faf9f5` · nós `#f7f4ed`), texto tinta near-black warm (Claude `#141413` · nós `#1a1814`).
- **FLAT, bordas hairline, ZERO sombra** — profundidade por contraste tonal + borda. Idêntico.
- **Serif p/ conteúdo editorial + sans p/ UI**, nunca misturar no mesmo bloco (Claude: Anthropic Serif + Anthropic Sans · nós: Newsreader + Libre Franklin).
- Acento único e racionado (Claude dust blue `#ccdbe8` · nós verde floresta `#2f5235`).
- Input: fill branco, borda hairline, **foco = borda escurece (sem ring/sombra)**. Idêntico ao nosso `.input-auth`.

## DIVERGÊNCIAS — decisões a considerar
1. **Raio: Claude usa 9.6px em botões/inputs/nav, NÃO pílula.** Regra dura deles: "Do not use rounded pill shapes (9999px) — 9.6px is the maximum". O nosso v2 usa pílula no `.btn-primary`. → **Decisão pendente:** alinhar ao Claude (cantos 9.6px) ou manter pílula (mais "macio", escolha do nosso conclave). Cards: Claude 16px, containers 24px, hero-panels 32px.
2. **Peso do serif display: Claude usa 330 (whisper-weight) a 56px** — autoridade por restrição, não volume. Nós usamos Newsreader italic. Considerar peso leve em displays.
3. **Botão primário do Claude = fill Charcoal (#1f1e1d) + texto branco** (escuro sobre creme), não colorido. Nós usamos verde floresta. Manter o verde (é a marca).

## Type scale do Claude (referência)
caption 11/1.5 · body 15/1.63 · subheading 18/1.56 · heading-sm 24/1.33 · heading 30/1.33 · display 56/1.2. ElementGap 8px · sectionGap 64px · cardPadding 32px.

## Para o CHAT especificamente (o que o founder quer)
- **Conversa turno-a-turno**, cada resposta da IA é uma mensagem FECHADA e separada — nunca acumular texto de turnos diferentes na mesma bolha (era o bug: `assistant_message` não finalizava o streaming → o turno seguinte era anexado ao anterior). **CORRIGIDO** em `use-chat.ts` (finalizeStreaming no `assistant_message`).
- Ordem cronológica estrita (mensagem do usuário → resposta da IA → próxima do usuário...).
- Layout editorial: texto da IA assenta no creme (no nosso caso serif full-width sem bolha, alinhado ao "letterpress" do Claude); input com foco por borda, sem sombra.

## Componentes-chave do Claude (resumo)
- **Primary Dark Button:** fill `#1f1e1d`, texto branco, sans 430/15px, radius 9.6px, 20×8px pad, sem sombra/borda.
- **Input:** branco, borda `#dedcd1` 1px, radius 9.6px, 16×12px, placeholder `#73726c`, foco borda→`#1f1e1d`.
- **Auth card:** branco, radius 16px, borda Linen, pad 32px, sem sombra.
- **Segmented toggle:** track parchment `#f0eee6`, ativo branco+borda, radius 9.6px.

Tabela de cores completa + dos/donts no JSON bruto (refero_get claude.ai).
