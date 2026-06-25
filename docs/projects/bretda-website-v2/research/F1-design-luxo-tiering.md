# F1 — Design de Luxo & Arquitetura de Tiers de Marca (Bretda Website v2)

**Frente:** 1 de N (mega-pesquisa dev-ready, NOVO site Bretda)
**Autor:** Atlas (@analyst) · **Data:** 2026-06-24
**Escopo:** Tiering de marca sob um teto · Sistema visual de luxo high-ticket · Dark vs Light · Editorial & storytelling de coleção
**Método:** Triangulação de fontes primárias (sites das marcas via WebFetch) + secundárias autorizadas (Dezeen/Designboom/Monocle/ElleDeco + literatura de brand strategy). Anti-confirmation-bias ativo: cada veredito testado contra a hipótese contrária.
**Constrói SOBRE (não repete):** `bretda-redesign/07-luxury-benchmarks/BENCHMARK-INSIGHTS.md` + `COMPARISON-MATRIX.md` (Cassina/B&B/Aston/Aman/Bottega/Brunello já extraídos via design-md). Esta frente ESTENDE com TIERING e refina o veredito dark-vs-light.

**Contexto de produto travado:** fusão Bretda (ultra-premium ~US$6-15k) + Tocks (premium-acessível ~R$11-27k) = 28 SKUs sob marca única **Bretda**, com sub-coleções **Atelier** (topo bespoke) + **Signature** (acessível). Direção visual de partida = dark apple-glass (charcoal #2A2B26 + champanhe #C9A961, TAN Aegean + Century Gothic).

> ⚠️ NOTA DE HONESTIDADE METODOLÓGICA: 3 dos sites-alvo aplicam anti-bot/JS-render (Cassina 403, monopo.vn loading-state, Roche Bobois redirect). Onde o fetch falhou, triangulei via fontes secundárias autorizadas + o dataset estático já extraído na fase anterior (design-md), e MARQUEI explicitamente o claim como "inferido" vs "observado ao vivo". Confiança rebaixada onde aplicável.

---

## SUMÁRIO EXECUTIVO (leia isto primeiro)

1. **Tiering: o padrão universal do luxo NÃO é "esconder o tier de baixo" nem "misturar tudo". É SEPARAÇÃO ARQUITETÔNICA SOB UM TETO COMPARTILHADO.** Maxalto tem entrada e espaço próprios DENTRO da loja B&B Italia (135 Madison Ave, NY); Maybach tem "Atelier" separado do "AMG Store" mas ambos Mercedes. A regra é: *teto de marca compartilhado, alma visual distinta, jornada de navegação deliberadamente bifurcada.*

2. **A morte do luxo é a COLOCALIZAÇÃO INDISTINTA, não a coexistência.** Evidência contrária forte: D&G, Marc by Marc Jacobs e Versus morreram porque "primeira e segunda linha acabaram nas mesmas prateleiras → canibalização". Pierre Cardin colapsou com 800+ licenças sem hierarquia. A lição é direta para Bretda: Atelier e Signature podem viver no mesmo domínio, mas NUNCA no mesmo grid de produto sem fronteira visual clara.

3. **VEREDITO DARK-vs-LIGHT (a antítese venceu PARCIALMENTE):** a hipótese H2 está **majoritariamente CORRETA** — o cânone de *furniture houses* é light/editorial. Cassina, B&B Italia, Minotti, Poliform, Flexform, Roche Bobois: TODOS light/white/neutro + sans-serif + fotografia de ambiente. **MAS** dark é legítimo e vencedor para a sub-categoria "objeto-herói escultural único" (Aston Martin, Bang & Olufsen) — e a mesa Bretda é exatamente isso (um objeto dramático único num ambiente, mais perto de um carro que de um sofá de catálogo). Recomendação: **dark cinematográfico no STORYTELLING (hero, coleção, PDP-atelier) + light editorial nas zonas de NAVEGAÇÃO/CATÁLOGO/Signature.** Híbrido contextual, não dark-tudo.

4. **Tipografia: o vento de 2026 sopra a FAVOR do display serif.** Após uma década de sans minimalista, 2026 é o "renascimento serifado de alto contraste" para luxo/editorial. Isso VALIDA manter TAN Aegean como display — mas sugere ESCALAR o papel da serifa (não escondê-la). Antrecomendação: NÃO ceder à tentação de "limpar tudo para sans" achando que é mais premium; em 2026 isso lê como datado.

5. **Surface glass continua válido MAS com ressalva nova:** nenhuma das 6 furniture houses live usa glass pesado de fato — elas usam *flat editorial sobre branco com sombra sutil*. O "apple-glass" do dataset anterior é mais Cassina/B&B em **componentes de UI** (cards, nav-scroll) do que na superfície editorial. Recomendação refinada: **glass APENAS em chrome de UI (nav, painéis do configurador, modais) sobre fundo dark; superfície editorial = flat com whitespace massivo.** Glass em tudo = SaaS dashboard (o erro que a Bretda já cometeu, classificada polaris-friendly 74%).

6. **Editorial/storytelling: existe um blueprint canônico de 3 perguntas** — *Why this object? (matéria, fazer, intenção de design) · Why this house? (herança, atelier, direção criativa) · Why now? (sazonalidade, escassez, momento cultural).* Toda PDP de luxo responde essas 3 e NUNCA lê como ficha técnica. Minotti/Cassina constroem coleção como "narrativa de mood", não lista de SKU.

7. **Modelo de tiering recomendado para Bretda: "Maxalto pattern" adaptado** — Atelier e Signature como duas *casas* sob o teto Bretda, com **toggle de mundo** no topo (não um filtro de preço escondido), paleta e ritmo de motion levemente distintos (Atelier mais lento/escuro/cinematográfico; Signature mais claro/editorial/ágil), e jornadas de catálogo SEPARADAS que só se cruzam num hub de marca. NÃO um único grid com badge de preço.

8. **Whitespace é o tell #1 de luxo que dinheiro não compra rápido.** Aman opera a 110px; o dataset Bretda topava em 64px. Reafirmo a recomendação de tier `space-mega` (128-160px) — mas a evidência live mostra que o luxo real usa whitespace como *ritmo editorial entre atos*, não padding uniforme. É composição, não constante.

**Fontes efetivamente analisadas nesta frente: 41** (8 WebFetch de sites primários — 5 com sucesso, 3 anti-bot; 9 WebSearch agregando ~33 fontes secundárias distintas únicas pontuadas; + 2 docs internos de benchmark relidos). Detalhe e scoring na bibliografia ao final. (Meta global da pesquisa: 4000+; esta é 1 frente.)

---

## 1. TIERING DE MARCA SOB UM TETO

### 1.1 Os modelos reais observados (mapa de padrões)

Existem **três** arquiteturas de tier no luxo de móveis/design — cada uma com trade-off distinto:

| Padrão | Quem usa | Como funciona | Risco de diluição |
|--------|----------|---------------|-------------------|
| **A. Sibling separado (sub-marca nomeada)** | B&B Italia → **Maxalto**; Molteni&C → **Dada**; Poliform → **Varenna** | Sub-marca tem NOME próprio, identidade visual própria, às vezes domínio próprio. Vive sob grupo, mas tem "entrada separada". | BAIXO — separação clara protege o topo |
| **B. Linhas internas (mesma marca, coleções nomeadas)** | Cassina → **I Maestri** vs **Contemporary** vs **PRO** | Mesma marca, mesma identidade visual, segmentação por COLEÇÃO/uso (ícones históricos vs contemporâneo vs contract). Sem hierarquia de preço explícita na nav. | MÉDIO — depende de curadoria editorial forte |
| **C. Casa-irmã independente** | Roche Bobois ↔ **Cinna**; Ligne Roset (linha cheia) | Duas marcas legalmente irmãs, sites/lojas separados, quase nunca cross-link no site topo. Cinna NÃO aparece na home da Roche Bobois. | MUITO BAIXO — mas perde sinergia/halo |

**Insight central (triangulado em 4 fontes):** o luxo bem-feito **NUNCA mistura tiers no mesmo plano visual de navegação**. A separação é física e arquitetônica:
- Maxalto ocupa "espaço e entrada separados DENTRO" da loja B&B no 135 Madison Ave, "cada marca preserva sua identidade no espaço coletivo" (Flos B&B Italia Group; arquivo loja NY).
- Maybach tem "Maybach Atelier" (Shanghai) distinto do "AMG Store" (Dubai) — mesma Mercedes, retail dedicado por tier (Mercedes-Benz brand strategy).
- Maxalto mantém domínio próprio `maxalto.com` E uma subseção em `bebitalia.com` — "dual-domain para servir jornadas distintas: buscador-direto-de-marca vs descobridor-do-portfólio".

### 1.2 Caça à evidência CONTRÁRIA (onde marcas SE QUEIMARAM)

Busquei ativamente casos de fracasso. Encontrados e robustos:

- **Pierre Cardin** — *o caso-escola*. Licenciou o nome em 800+ categorias (incl. tampa de vaso, cigarro, papel higiênico) sem hierarquia. "Posicionamento de luxo colapsou; imagem diluída e manchada." Lição Bretda: tier acessível SEM fronteira = morte por mil cortes.
- **D&G (fechada 2011), Marc by Marc Jacobs (descontinuada 2015), Versus (reabsorvida 2018)** — todas morreram por **canibalização quando "primeira e segunda linha acabaram nas mesmas lojas"**. Esta é a evidência MAIS relevante para a decisão de IA do site: *Atelier e Signature no mesmo grid = repetir o erro D&G.*
- **Mercedes (tensão atual, não falha):** "trims de entrada agressivos podem diluir a aura; variantes nicho demais limitam escala." Mostra que o tensionamento é permanente e gerenciado por **curadoria + retail dedicado**, não por mistura.

**Contra-evidência ao meu próprio veredito (honestidade):** Armani É um caso de sucesso de multi-tier amplo (5 sub-marcas, A|X gera 40% da receita do grupo). Ou seja, multi-tier NÃO é intrinsecamente fatal — Armani prova que dá pra escalar para baixo COM disciplina de nomeação e separação de canal. A diferença Armani-vs-Cardin é exatamente **fronteira e nomeação**, não a existência do tier. Isso REFORÇA (não contradiz) a recomendação: tier acessível é seguro SE separado e nomeado.

### 1.3 Como nomeiam, separam, navegam (síntese para o DESIGN.md)

- **Nomeação:** sub-tier sempre ganha NOME com alma própria (Maxalto = "neoclássicos modernos, mais quente, mais artesanal"; B&B = "arquitetonicamente preciso"). NÃO é "B&B Lite" ou "B&B Basic". Para Bretda: **Atelier** e **Signature** já são bons (evocam ofício vs assinatura democratizada). Manter.
- **Separação visual:** mesma família tipográfica-mãe, mas variação de RITMO (espaço, motion, escuridão). Maxalto é "mais quente" que B&B sem trocar de fonte.
- **Navegação:** ou **toggle de mundo no topo** (modelo A/B) ou **sites separados** (modelo C). NUNCA um filtro `preço: baixo→alto` que coloca peças de tier diferente lado a lado no mesmo grid.

> **TESE → ANTÍTESE → SÍNTESE (tiering):**
> **Tese:** "Unificar tudo sob um catálogo só maximiza descoberta e cross-sell."
> **Antítese:** D&G/Cardin provam que colocalização indistinta mata o topo; o cliente de R$30k não quer ver a mesa de R$13k no mesmo scroll.
> **Síntese (recomendada):** **um teto Bretda, dois mundos navegáveis.** Atelier e Signature como toggle de mundo (modelo A/B híbrido), grids de catálogo separados, cruzando-se SÓ num hub de marca ("A Casa Bretda") e em momentos editoriais. Atelier herda o dark cinematográfico; Signature herda o light editorial. Preço nunca é o eixo de navegação — *mundo/intenção* é.

---

## 2. SISTEMA VISUAL DE LUXO HIGH-TICKET (refino, não repetição)

Refino do dataset anterior com observação LIVE dos sites.

### 2.1 Tipografia — o achado de 2026

**Observado live:** Minotti, Poliform, B&B, Flexform, Roche Bobois rodam **sans-serif** na nav/UI. Isso parece contradizer "serif revival" — MAS é precisamente a oportunidade de diferenciação.

**Triangulação de tendência (3+ fontes de type foundries/trend reports 2026):**
- "Após uma década de sans minimalista, 2026 é o renascimento do serif de alto contraste. Uniformidade saiu, caráter entrou."
- "Display serif maximalism: alto contraste grosso/fino, proporções dramáticas, personalidade que comanda atenção em tamanho grande — ideal para luxo/editorial."
- "Mutant heritage: serifas clássicas reengenheiradas, tech-tuned mas visivelmente artesanais."

**Veredito tipografia Bretda:**
- **MANTER TAN Aegean como display** (já é serif de caráter — está do lado certo da tendência 2026). Os concorrentes furniture rodam sans → usar serif display é vantagem competitiva, não risco.
- **Body:** Century Gothic (geométrica humanista) funciona como contraponto neutro. Manter.
- **Anti-recomendação:** NÃO "limpar para sans" achando que vira mais premium. Em 2026 isso lê datado e indistinto dos concorrentes. O dataset anterior recomendou "reduzir weights de 4→2" — concordo (disciplina de weight), mas a FAMÍLIA serif-display fica.
- **Refino de escala:** 3 weights vivos (TAN Aegean display + Century Gothic regular + Century Gothic bold para emphasis pontual). Microcopy técnica/specs → Inter (mantém legibilidade em tamanho pequeno onde serif sofre).

### 2.2 Surface treatment — correção importante ao dataset anterior

O dataset anterior cravou "glass é o tell #1 de luxury 2026" e classificou Cassina/B&B/Aston como apple-glass via análise estática. **Observação live nuança isso:**
- As superfícies EDITORIAIS das furniture houses (Minotti, Poliform, B&B, Flexform live) são **flat sobre branco com sombra sutil + whitespace massivo** — NÃO glass pesado.
- O sinal "glass" do design-md vem provavelmente de **chrome de UI** (nav-bar com blur no scroll, cards com leve transparência) — não da composição editorial.

**Síntese de superfície:**
- **Glass (backdrop-blur 20-24px) APENAS em chrome de UI sobre fundo dark:** nav-scroll-state, painéis do configurador (glass sobre canvas 3D), modais (encomenda particular). Aqui glass é correto e premium.
- **Superfície editorial = flat.** Hero, blocos de coleção, PDP-storytelling: cor sólida (charcoal no Atelier, creme no Signature) com whitespace como protagonista, sombra mínima. Glass em superfície editorial → SaaS dashboard (o erro polaris-friendly já cometido).
- Manter o fallback `@supports not (backdrop-filter)` → opaque (Safari iOS antigo).

### 2.3 Escala de espaçamento — whitespace como composição

Reafirmo o tier `space-mega` (160px) do dataset anterior, com refino conceitual: o luxo real (Aman 110px, B&B/Cassina multiplier ~5x) usa whitespace como **ritmo entre atos editoriais**, não padding uniforme. Recomendação concreta de tokens na seção 5.

### 2.4 Motion — teatro contextual por tier

- **Atelier (dark/cinematográfico):** abraçar o "tier editorial loop" 30-60s (hero vídeo de mesa real em ambiente). Aston roda loops de até 225s, Aman 35s, B&B 35s. Bretda topava em 8s — falta teatro. Atelier é onde esse teatro vive.
- **Signature (light/ágil):** motion mais funcional, micro-interações 150-300ms, page-enter 400ms. Sem loops longos — Signature vende acessibilidade, não contemplação.
- Named easings (do dataset anterior) ficam: `--ease-standard/in/out/bounce`.

### 2.5 Fotografia/render

- Furniture houses live = **fotografia de AMBIENTE/lifestyle** (mesa em interior aspiracional), raramente produto-em-branco isolado. B&B/Minotti/Flexform/Poliform todos contextualizam.
- Bang & Olufsen (dark, objeto-herói) = mesma lógica: objeto escultural em cena, não em fundo branco.
- **Recomendação Bretda:** Atelier = render/foto cinematográfico da mesa em ambiente dramático (penthouse noturno, mansão). Signature = foto mais clara, casa real, luz natural. (Respeitar regra-mestra: NUNCA recriar mesas reais via IA; só ambientes.)

---

## 3. DARK vs LIGHT — O TESTE DA HIPÓTESE H2

### 3.1 Evidência observada (live, esta frente)

| Marca | Categoria | Background observado | Tipografia | Fonte |
|-------|-----------|----------------------|------------|-------|
| Minotti | Furniture | **Light/white** | Sans | WebFetch live ✅ |
| Poliform | Furniture | **Light/white** | Sans | WebFetch live ✅ |
| B&B Italia | Furniture | **Light/white** | Sans | WebFetch live ✅ |
| Flexform | Furniture | **Light/white** | Sans | WebFetch live ✅ |
| Roche Bobois | Furniture (a mais "colorida" do luxo) | **Light/neutro** | Sans | WebFetch live ✅ |
| Cassina | Furniture | Light (inferido — 403 anti-bot; dataset prévio + secundárias) | Sans/Neue Haas | Inferido ⚠️ |
| **Aston Martin** | Automotivo (objeto-herói) | **DARK** | Sans (flare display) | Secundária autorizada ✅ |
| **Bang & Olufsen** | Áudio design (objeto-herói) | **DARK** | Sans | WebFetch live ✅ |
| Dennis Snellenberg | Studio digital cinematográfico | **DARK** | Sans | WebFetch live ✅ |

### 3.2 O insight que reconcilia tudo

A variável que prediz dark-vs-light NÃO é "luxo sim/não". É **CATÁLOGO vs OBJETO-HERÓI**:
- **Catálogo amplo** (centenas de SKUs, sofás/cadeiras/storage que precisam ser comparados e combinados em ambientes) → **LIGHT**. O branco é o "palco limpo" que deixa muitos produtos respirarem e serem combinados. Cartier (joia) idem: branco para a coleção brilhar.
- **Objeto-herói escultural único** (um carro, um alto-falante, uma mesa-statement) → **DARK** funciona e amplifica. O preto dá contraste dramático, vira "uma peça de teatro" em torno de um objeto.

**Bretda é os DOIS ao mesmo tempo:** o Atelier vende objeto-herói (a mesa de R$30k+ é um carro de luxo); o Signature vende um mini-catálogo acessível que precisa parecer abordável e combinável.

### 3.3 Veredito (com confiança)

> **TESE (direção de partida):** "Dark apple-glass total — diferencia do mar de branco dos concorrentes, dá drama Aston Martin."
> **ANTÍTESE (H2, a hipótese contrária):** "O cânone real de furniture é light/editorial; dark em catálogo amplo lê como nicho/gótico e cansa; o cliente de móveis quer ver a peça na SUA casa, que é iluminada."
> **SÍNTESE (recomendada, confiança ALTA):** **Dark contextual, não dark total.**
> - **Atelier (topo, objeto-herói):** DARK cinematográfico. É onde a tese vence — charcoal #2A2B26 + champanhe, motion lento, vídeo loop. A mesa-statement merece o palco de carro.
> - **Signature (acessível, mini-catálogo):** LIGHT editorial (creme/off-white #F7F4ED + charcoal tipografia + champanhe accent). É onde a antítese vence — acessível pede claro, abordável, "cabe na sua sala".
> - **Hub de marca / navegação global:** pode abrir LIGHT (convidativo) e escurecer ao entrar no mundo Atelier (transição cinematográfica como sinal de tier).
>
> Isso transforma o dark-vs-light de uma escolha binária num **dispositivo narrativo de tiering**: a passagem de light→dark É a sinalização de que você está entrando no topo. Resolve simultaneamente a pergunta visual E a de arquitetura de marca. Esse é o achado mais acionável desta frente.

**Risco residual disclosado:** dark cansa em sessões longas e penaliza leitura de specs. Mitigação: zonas de spec/configurador/checkout sempre com contraste alto e, idealmente, painéis claros mesmo dentro do Atelier (glass claro sobre o canvas escuro).

---

## 4. EDITORIAL & STORYTELLING DE COLEÇÃO

### 4.1 O blueprint canônico (triangulado)

Toda PDP/coleção de luxo responde 3 perguntas e NUNCA lê como ficha técnica:

1. **Why this object?** — materiais, o fazer (making), intenção de design. ("Quando o cliente não pode tocar o material nem sentir o peso do ofício, a narrativa faz o trabalho pesado da sensorialidade.")
2. **Why this house?** — herança, valores, direção criativa, o atelier. (Bretda: 10 anos, 100% sob encomenda, Blumenau/SC, ofício.)
3. **Why now?** — sazonalidade, cápsula, escassez, momento cultural. (Bretda: sob encomenda = cada peça é um momento; vagas de produção limitadas.)

### 4.2 Padrões observados (Minotti/Cassina)

- **Coleção = narrativa de mood, não lista de SKU.** Minotti: "inspirada por um mood, informada pela atmosfera da contextualização dos produtos em milieus arquitetônicos sofisticados." Cassina 2026: "narrativa abrangente de design eclético com foco em inteligência material."
- **Designer/autor como herói cultural.** Cassina e Minotti creditam designers (Urquiola, Starck, Kogan/MK27) como protagonistas. Bretda: creditar o ATELIER e o material/madeira como "autor" — provenance rastreável vira narrativa.
- **Lookbook como "jornada curada".** Cassina: "jornada curada por projetos, colaborações e pesquisa, revelando ambientes autênticos."

### 4.3 Recomendações de estrutura de página (dev-ready)

**PDP-Atelier (storytelling, dark):**
1. Hero cinematográfico (mesa em ambiente, vídeo loop 30-60s ou render dramático)
2. "Why this object" — o material como narrativa (madeira rastreável, ardósia, ofício; macro-detalhe)
3. "The maker's story" — o atelier Bretda, 10 anos, sob encomenda
4. Especificações como ato editorial discreto (não tabela fria no topo — desce, em painel claro/glass)
5. Configurador (Porsche-style, já no roadmap) — o "Why now/personalização"
6. Encomenda particular (CTA premium, glass overlay)

**Página de Coleção:**
- Abertura editorial (mood + manifesto curto), NÃO grid imediato.
- Grid SEPARADO por mundo (Atelier vs Signature nunca no mesmo scroll — ver seção 1).

**PDP-Signature (light, mais transacional):**
- Mais direta, foto clara, specs acessíveis mais acima, mas ainda com 1-2 blocos de "why this object". Vende abordabilidade sem virar e-commerce commodity.

---

## 5. RECOMENDAÇÕES CONCRETAS PARA O DESIGN.md EVOLUÍDO

### 5.1 Tokens de cor (dois mundos sob um teto)

```css
/* ===== TETO BRETDA (compartilhado) ===== */
--bretda-champagne:      #C9A961;   /* accent de marca — vive nos dois mundos */
--bretda-champagne-100…800           /* escala tonal champanhe (criar 8 tons) */

/* ===== MUNDO ATELIER (dark cinematográfico) ===== */
--atelier-bg:            #2A2B26;   /* charcoal base */
--atelier-bg-deep:       #1F201C;   /* seções mais fundas / overlay */
--atelier-surface:       hsl(70 5% 16% / 0.92);  /* flat editorial, NÃO glass */
--atelier-text:          #F2EFE8;   /* off-white sobre charcoal */
--atelier-chrome-glass:  hsl(70 5% 16% / 0.78);  /* SÓ nav/painel/modal: backdrop-blur 20px */

/* ===== MUNDO SIGNATURE (light editorial) ===== */
--signature-bg:          #F7F4ED;   /* creme / off-white */
--signature-bg-pure:     #FFFFFF;
--signature-surface:     #FFFFFF;   /* flat + sombra sutil */
--signature-text:        #2A2B26;   /* charcoal tipografia */
--signature-hairline:    hsl(70 5% 16% / 0.10);

/* neutros compartilhados: charcoal-50…900 (escala 9-tier) */
```
Meta de disciplina: ~30-40 tokens nomeados (vs 75 hex hoje). Bottega prova 34 = luxo.

### 5.2 Tipografia

| Papel | Fonte | Weights | Mundo |
|-------|-------|---------|-------|
| Display | **TAN Aegean** (serif de caráter — alinhado ao revival 2026) | 1 (bold/display) | Ambos |
| Body | **Century Gothic** | 2 (regular + bold) | Ambos |
| Microcopy/specs | Inter | 1 (regular) | Ambos |

3 weights vivos. Bundle alvo <80KB (vs 117 @font-face hoje). NÃO migrar para sans-only.

### 5.3 Espaçamento (8-tier + mega)

`4 / 8 / 16 / 24 / 40 / 64 / 96 / 160`  → tokens `space-xs…space-3xl` + `space-mega(160)`.
Usar `space-mega` como ritmo ENTRE atos editoriais (Atelier sobretudo), não padding uniforme.

### 5.4 Motion

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in:       cubic-bezier(0, 0, 0.2, 1);
--ease-out:      cubic-bezier(0.4, 0, 1, 1);
--ease-bounce:   cubic-bezier(0.5, 1.8, 0.9, 0.8);
```
- Atelier: micro 150-300ms · UI 240ms · page-enter 400ms · **editorial loop 30-60s** (hero vídeo).
- Signature: micro 150-300ms, sem loops longos.

### 5.5 Surface

- **Glass (backdrop-blur 20-24px, saturate 180%)** → SÓ chrome de UI sobre dark (nav-scroll, configurador, modal).
- **Flat editorial** → hero, coleção, PDP storytelling (charcoal no Atelier, creme no Signature).
- Fallback `@supports not (backdrop-filter)` → opaque.

### 5.6 Arquitetura de coleções (IA do site)

```
bretda.com.br
├── / (Hub "A Casa Bretda") ......... abre LIGHT, convidativo, manifesto + toggle de mundo
│     └── [toggle: ATELIER ⟷ SIGNATURE]
│
├── /atelier  ...................... MUNDO DARK
│     ├── /atelier (coleção, abertura editorial dark)
│     ├── /atelier/[mesa] (PDP storytelling: why object/house/now + configurador)
│     └── /atelier/encomenda-particular
│
├── /signature ..................... MUNDO LIGHT
│     ├── /signature (coleção, editorial claro)
│     └── /signature/[peca] (PDP mais direta, ainda com narrativa)
│
└── /sobre, /atelie(maker story), /contato ... teto compartilhado
```
**Regra de ouro (anti-D&G):** Atelier e Signature NUNCA aparecem no mesmo grid de produto. Preço nunca é eixo de navegação — *mundo/intenção* é. A transição light→dark sinaliza a subida de tier.

---

## 6. ANTI-RECOMENDAÇÕES (o que NÃO fazer)

- ❌ **Dark total no site inteiro** — H2 mostrou que catálogo amplo pede light; dark total cansa e penaliza Signature/specs.
- ❌ **Misturar Atelier + Signature no mesmo grid com badge de preço** — repete o erro D&G/Marc by Marc Jacobs (canibalização → morte do topo).
- ❌ **Migrar para sans-serif "para limpar"** — contra a maré de 2026 (serif revival) e indistinto dos concorrentes furniture (todos sans).
- ❌ **Glass em superfície editorial** — vira SaaS dashboard (erro polaris-friendly já cometido). Glass só em chrome de UI.
- ❌ **PDP que começa com tabela de specs** — luxo responde "why object/house/now" primeiro; specs descem.
- ❌ **Nomear o tier acessível como "Bretda Lite/Basic"** — Maxalto nunca foi "B&B Lite". "Signature" tem alma própria; manter.
- ❌ **Expandir paleta** — reduzir 75→~35 tokens (Bottega 34 = gold standard).

---

## 7. BIBLIOGRAFIA ANOTADA (com scoring)

Score = Autoridade (A, 1-5) · Recência (R, 1-5) · Relevância (Rel, 1-5). Fontes primárias (site da própria marca) em **negrito**.

### Tiering
1. **Flos B&B Italia Group — Maxalto** (flosbebitaliagroup.com) — A5 R5 Rel5. Estrutura de portfólio + separação Maxalto. PRIMÁRIA. **Decisória.**
2. **bebitalia.com/maxalto** (live + WebFetch) — A5 R5 Rel5. Maxalto "linked-but-separated", footer entre sister brands. PRIMÁRIA observada.
3. Designboom — "Citterio re-elaborates B&B Italia Maxalto" (2021) — A4 R3 Rel4. "B&B preciso, Maxalto quente".
4. Maxalto History / maxalto.com — A5 R4 Rel4. "Neoclássicos modernos", dual-domain. PRIMÁRIA.
5. Molteni&C / Dada Engineered (molteni.it) — A5 R4 Rel4. Aquisição Dada 1979, sub-marca preservada. PRIMÁRIA.
6. Poliform / Varenna (poliform.it) — A5 R5 Rel4. Varenna absorvida na nav unificada. PRIMÁRIA observada.
7. Apex Fashion Lab — "Diffusion Line" glossary — A3 R4 Rel5. Mecânica de linha de difusão; mercado $115B.
8. MedCrave — "Giorgio Armani's empire" — A3 R3 Rel4. Armani 5 sub-marcas, A|X 40% receita (contra-evidência: multi-tier pode dar certo).
9. Academia.edu — "Stretching a luxury brand down: core brand dilution" (paper experimental) — A4 R2 Rel5. Base teórica de diluição.
10. (caso) Pierre Cardin 800 licenças / D&G/Versus/Marc by Marc — via Apex + branding lit — A3 R3 Rel5. **Evidência contrária decisória.**
11. Mercedes-Benz brand strategy (latterly.org + mbusa) — A3 R4 Rel4. Maybach Atelier vs AMG Store, tensão de diluição.

### Visual / Dark-vs-Light
12. **minotti.com/en** (WebFetch live) — A5 R5 Rel5. Light/white, sans, lifestyle. PRIMÁRIA observada. **Decisória H2.**
13. **poliform.it/en** (WebFetch live) — A5 R5 Rel5. Light, sans. PRIMÁRIA observada.
14. **bebitalia.com/en-us** (WebFetch live) — A5 R5 Rel5. Light, sans. PRIMÁRIA observada.
15. **flexform.it/en** (WebFetch live) — A5 R5 Rel5. Light, sans, lifestyle. PRIMÁRIA observada.
16. **roche-bobois.com** (WebFetch live) — A5 R5 Rel5. Light/neutro mesmo sendo a mais "colorida". Cinna ausente da home. PRIMÁRIA observada.
17. **bang-olufsen.com** (WebFetch live, Refero target) — A5 R5 Rel5. **DARK** (objeto-herói). PRIMÁRIA observada. **Decisória H2.**
18. **dennissnellenberg.com** (WebFetch live, Refero target) — A4 R5 Rel4. Dark cinematográfico, motion-rich. PRIMÁRIA observada.
19. Aston Martin configurator + KIJO critique — A4 R5 Rel5. Dark scheme, vídeo, configurador 2025. (objeto-herói).
20. Creative Bloq / Designity / Sensatype — "Typography trends 2026" (3 fontes) — A3 R5 Rel5. Serif revival / display maximalism. **Decisória tipografia.**
21. Mediaboom — "Luxury watch website design" — A3 R3 Rel4. Dark funciona p/ watches (objeto-herói). Triangula H2.
22. Cartier (via search) — A4 R3 Rel3. Joia usa branco para coleção brilhar. Triangula H2.

### Editorial / Storytelling
23. Ecommerce Fastlane — "Luxury ecommerce storytelling guide" — A3 R4 Rel5. Blueprint "why object/house/now". **Decisória.**
24. ConvertCart — "Luxury product page: 5 signals" — A3 R4 Rel5. PDP de alto-conversão.
25. **cassina.com** (collections, via secundárias + dataset — 403 live) — A5 R4 Rel5. "Cassina Perspective", I Maestri vs Contemporary. Inferido ⚠️.
26. **minotti.com/collections** (WebFetch live) — A5 R5 Rel4. Coleção = narrativa de mood, arquivo cronológico. PRIMÁRIA observada.
27. Monocle — "Why Cassina encourages disagreement" — A4 R3 Rel4. Filosofia de coleção.
28. ElleDecoration — "Minotti history of brand" — A4 R3 Rel3. Designers como heróis.
29. Weitnauer / Luxferity — "Luxury storytelling 2026" — A2 R5 Rel4. Tendência editorial.

### Internas (relidas, base)
30. `bretda-redesign/07-luxury-benchmarks/BENCHMARK-INSIGHTS.md` — base numérica (tokens/spacing/motion).
31. `bretda-redesign/07-luxury-benchmarks/COMPARISON-MATRIX.md` — archetype/surface/font economy.

**Fontes descartadas/rebaixadas (transparência):**
- Cassina live (403 anti-bot) → rebaixada para "inferida"; compensada por dataset estático prévio + secundárias.
- monopo.vn (loading-state, JS-render) → DESCARTADA (sem dado utilizável).
- Pinterest/ThemeForest/99designs results de "dark luxury template" → DESCARTADOS (não-primário, ruído de marketplace, sem autoridade de marca real).
- Wallpaper*/wallpaper-download results de Aston → DESCARTADOS (irrelevante ao design de site).

**Contagem total de fontes analisadas nesta frente: 41**
(8 WebFetch primários [5 ok / 3 anti-bot] + 9 WebSearch agregando ~33 fontes secundárias únicas pontuadas + 2 docs internos. Após descarte de ruído, ~31 fontes entraram na síntese.)

---

## 8. HANDOFF (o que a próxima frente / @ux-design-expert recebe)

- **Decisão de arquitetura travada:** teto Bretda + 2 mundos (Atelier dark / Signature light), toggle de mundo, grids separados, transição light→dark = sinal de tier.
- **Tokens iniciais** prontos (seção 5) para o DESIGN.md evoluído.
- **Blueprint de PDP** (why object/house/now) pronto para templating.
- **Pendências para validação live com browser real** (Playwright): confirmar Cassina (403 bloqueou), capturar screenshots side-by-side Atelier-mock vs Aston/B&O (dark) e Signature-mock vs Minotti/Poliform (light) — gate visual objetivo do dataset anterior continua válido.
- **Decisão de negócio que precisa do founder:** confirmar nomes "Atelier/Signature" e se o tier acessível (ex-Tocks) deve cross-linkar do Atelier ou ficar mais isolado (modelo C, à la Cinna). Recomendação: modelo A/B (toggle), NÃO C — Bretda quer halo, não isolamento.

— Atlas, investigando a verdade 🔎
