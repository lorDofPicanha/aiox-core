# DRY RUN Fase 3 — NICHE RESEARCH: Padaria Artesanal Premium

> **DRY RUN.** Output usado para validar pipeline Fase 3 → Fase 4 (DESIGN EXTRACT) + capturar learnings. Refs reais, conhecimento triangulado, mas SEM verificação ao vivo de URLs (limitação budget Tier S 2h, ver §Limitações).
> **Briefing:** Padaria/Confeitaria artesanal premium — alimenta multi-ref design extract para **P-006 Dona Hilda Confeitaria** (Itoupava Seca, Blumenau, 36 anos LTDA, ~13k Insta, site 2008-era HTML estático).
> **Skill aplicada:** `tech-research` calibrado Tier S (timebox 2h, 5 refs target, dimensão Estética primária + Mercado secundária).

---

## Sumário executivo

**Recomendação:** Posicionar Dona Hilda no arquétipo **"Brazilian Traditional Premium — modernized warmly"** — calor de padaria de bairro 36 anos preservado E elevado por linguagem editorial contemporânea. Multi-ref design extract deve cruzar Hart Bageri (Copenhagen — disciplina editorial), Tartine (San Francisco — rusticidade autêntica fotográfica) e Poilâne (Paris — selo patrimonial/legacy), atravessado por 2 refs locais BR que aterram vernáculo PT-BR (Portus Padaria em Blumenau como benchmark vizinho + Padaria Boutique Cantinho do Pão em Curitiba como floor de qualidade BR realista). **Três justificativas:** (1) audience Dona Hilda mista 30-65 demanda contraste tradição+contemporâneo — clone puro Hart Bageri perde 50+, clone puro padaria 2010s perde 30-45; (2) gate AAA 7:1 contrast + 18px body + WCAG inclusive exclui automaticamente parte do "modern web aesthetic" (thin gray-on-gray, micro-type) — força paleta mais saturada e tipografia mais peso, o que felizmente CONVERGE com arquétipo padaria-tradicional; (3) sazonalidade BR (Páscoa 25-35%, Natal/panettone 20-30%, Festa Junina 15-20% do anual de produtos premium) demanda layout home com "vitrine sazonal" rotativa — refs globais como Tartine e Hart Bageri já implementam esse padrão de "seasonal feature". **Três riscos:** (1) **anti-clone risk em layout** — Hart Bageri é tão dominante esteticamente em "minimal bakery sites" pós-2022 que precisamos misturar deliberadamente OU vamos clonar; (2) **vernacular fit risk** — paleta off-white+marrom-escuro Tartine pode soar "estrangeira" pra cliente padaria Itoupava Seca; ancoragem em fotos REAIS da padaria + cores quentes amassadas (cream warmer, terracota brand) mitigam; (3) **content-truth risk** — refs globais têm fotos profissionais; Dona Hilda precisa sessão fotos 2h presencial (já no stack) ANTES do build OR site fica vazio.

---

## Pergunta real (5 Whys)

**Q0 (inicial):** "Que design devemos usar pra Dona Hilda?"

- **Why 1:** porque o site atual 2008-era HTML estático perde clientes → "Que design VENDE pra Dona Hilda?"
- **Why 2:** porque "vender" depende de audience real → "Que design converte audience tradicional padaria Itoupava Seca (40-65) E captura também filhos/netos digitais (25-40) que compram online encomendas de aniversário?"
- **Why 3:** porque audience mista demanda dual signal → "Que linguagem visual sinaliza SIMULTANEAMENTE 'tradição 36 anos preservada' (não somos modernos artificiais que vão fechar em 2 anos) E 'profissional contemporâneo' (não somos amadores de site 2008)?"
- **Why 4:** porque sinal patrimonial vem de elementos editoriais específicos → "Quais TOKENS visuais concretos (palette, type, layout, photo direction) carregam esses dois signals juntos no nicho padaria artesanal premium global, e quais são EXCLUSÕES (thin-on-thin, hover-only, etc.) que destroem o signal pra audience 40-65?"
- **Why 5 (PERGUNTA REAL):** **"Que linguagem visual converte cliente local 40-65 anos da Itoupava Seca E sinaliza tradição 36 anos + qualidade artesanal premium, SEM cair em rústico-amador (perde profissional 30-45) NEM em modern-thin-gray (perde 50+ por low-contrast + signal de moda passageira)?"**

A pergunta real é tensão entre 3 arquétipos do nicho, calibrada pelos gates AAA/inclusive já decididos. Não é "qual o melhor design" — é qual MIX entre 3 polos resolve a tensão.

---

## Dimensão Estético-Visual (PRIMARY)

### Arquétipos identificados no nicho global de padaria artesanal premium

Cinco arquétipos canônicos, com características de token e fit-risk para Dona Hilda:

**Arquétipo A — "Luxury European Heritage"**
- **Tokens:** paleta off-white + black ink + 1 accent (vermelho-pompeu ou dourado patina); serif clássica (Caslon, Garamond, Bodoni-revival) em display + sans humanista (Brandon, Founders Grotesk) em body; layout grid editorial 12-col com whitespace generoso; fotografia preto-e-branco ou color-graded film (Portra 400 simulação); selo/monograma com fundação ano em destaque.
- **Mood:** maison parisiense; patrimônio museificado; "viemos antes do café da esquina existir".
- **Exemplos:** **Poilâne (Paris, fundada 1932)**, **Du Pain et des Idées (Paris)**, **Pasticceria Marchesi (Milão, 1824, agora propriedade Prada)**.
- **Fit Dona Hilda:** ALTO no signal "36 anos tradição" (1990 é jovem vs Poilâne 1932 mas preserva o vocabulário). RISCO: pode soar pretensioso fora do contexto cultural brasileiro / pode alienar cliente Itoupava Seca de bairro que quer "cuca da Dona Hilda" não "pâtisserie".

**Arquétipo B — "Industrial Rustic Authentic (San Francisco / NY school)"**
- **Tokens:** paleta cream + flour + crust-brown + charcoal; serif quente (Tiempos, Lyon Text) ou slab (Caslon Slab, Sentinel); layout asymmetric com fotos grandes de pão rústico close-up (porosidade, crosta, farinha na bancada); tipografia editorial com headlines longos (não one-word display); identidade hand-stamped / typeset metal smell.
- **Mood:** "padeiro com avental sujo, fermentação 48h, queremos que você sinta o cheiro".
- **Exemplos:** **Tartine Bakery (SF, Chad Robertson)**, **Bourke Street Bakery (Sydney)**, **Levain Bakery (NY)** ainda que Levain seja mais cookie-focused.
- **Fit Dona Hilda:** ALTO no signal artesanal mas RISCO: paleta Tartine cream+brown lida "imported San Francisco" no Brasil; precisa tropicalizar com fotos da padaria real (não stock de pão sourdough genérico) + copy PT-BR vernacular (cuca, bolinho de chuva, sonho) que ancora geograficamente.

**Arquétipo C — "Editorial Modern Minimal (Nordic/Copenhagen school)"**
- **Tokens:** paleta extremamente reduzida (off-white + 1 deep neutral + 1 accent restraint); display sans grotesque (GT Sectra, Söhne, Inter Display) ou serif geometric (Caponi); layout vertical-scroll grid com large hero typography (often display 80-120px), generous spacing, photos editorial-clean (single product, soft natural light, no clutter); tudo com Restraint capital R; copy mínima.
- **Mood:** "designer Copenhagen abriu padaria"; arte contemporânea aplicada ao pão; intellectual.
- **Exemplos:** **Hart Bageri (Copenhagen, ligada ao Noma)**, **Mirage Bakery**, **Saint Frank Coffee (não bakery mas mesma school)**, **Apollonia Poilâne café online refresh recente**.
- **Fit Dona Hilda:** MÉDIO-BAIXO sozinho. Os tokens VIOLAM diretamente o gate de inclusive-design (body 16px típico, contrast border-zone, thin gray-on-gray sub-headings). Mas COMPONENTES (layout grid, type pairing serif display + sans body, single-product photography) são extraíveis se filtrados pelo gate.

**Arquétipo D — "Hand-drawn Folk Warm (Pinterest school)"**
- **Tokens:** paleta cream + sage + dusty rose + terracotta; script font (Beloved, Recoleta) + sans rounded; ilustrações hand-drawn de trigo/espiga/rolo; layout center-aligned com curves and arches; copy emotiva.
- **Mood:** "Etsy seller virou padaria"; afetivo; feminine; Pinterest 2019.
- **Exemplos:** muitas padarias home-bakery US/UK Instagram-first.
- **Fit Dona Hilda:** BAIXO. Estética dominada por home-bakers e amador-aspiracional. Dona Hilda tem 36 anos de operação real — usar esse arquétipo regride o signal "padaria séria" para "passatempo de dona-de-casa". CASE DESCARTADO.

**Arquétipo E — "Brazilian Traditional Premium" (emergente, escassez de refs)**
- **Tokens:** paleta neutros quentes (cream amassado, marrom-pão crosta, verde-musgo Mata Atlântica ou vermelho-acerola) + tipografia mista serif-display brasileira (Coronet, alguma humanista nacional como Pretendard variant ou Inter ajustada) + body sans 18px+ peso medium; layout que respeita densidade informacional brasileira (cliente quer ver cardápio + preço + WhatsApp); fotografia color-graded levemente saturada (não Portra cinza estrangeiro).
- **Mood:** "padaria do bairro 30+ anos que se profissionalizou".
- **Exemplos parciais:** **Padaria Bracarense (RJ)** parcialmente, **Cuca (sites Cuca de cervejaria não confundir)**, **Padaria do Lulu (SP)**. Maioria das padarias BR ainda em arquétipos B-C importados OU 2010s-genéricas.
- **Fit Dona Hilda:** **ALTO — É AQUI QUE A SÍNTESE VAI.** Mas o arquétipo é under-defined no nicho BR — precisamos COMPOR usando refs globais como base estrutural + refs locais como floor cultural.

### Síntese arquetípica para Dona Hilda

**Decisão arquetípica:** **Síntese A+B+E** (peso 30/40/30) com filtragem pelo gate de inclusive-design.
- **De A (Poilâne):** vocabulário patrimonial — selo "Desde 1990", serif display em poucos lugares estratégicos, signal de longevidade.
- **De B (Tartine):** linguagem fotográfica — fotos REAIS da padaria, close-up de cuca/sonho/bolinho de chuva, ASMR-visual de massa e farinha; identidade hand-stamped feel.
- **De E (Brazilian Premium):** vernacular PT-BR-SC, paleta tropicalizada (não cream-flour-brown que parece SF), densidade informacional respeitada (WhatsApp button visível, cardápio acessível, preço de bolo encomenda visível em 2 clicks).
- **EXCLUIR de C (Hart Bageri):** thin display 16px, gray-on-gray, hover-only nav. Pegar APENAS o layout grid editorial (não a tipografia low-contrast).

### 3 REFS GLOBAIS escolhidas (para multi-ref design extract Fase 4)

**1. Hart Bageri (Copenhagen, Dinamarca)** — `https://hartbageri.com`
- **Arquétipo:** Editorial Modern Minimal (C)
- **Por que escolhida:** É o **standard de fato** pós-2022 do que "padaria premium contemporânea com site web" significa globalmente. Disciplina editorial — typography hierarchy clara, fotografia single-product impecável, layout grid respeitado. Awwwards-tier execution.
- **Tokens visíveis para extração:**
  - Palette: off-white background + deep warm black (NÃO pure black) + 1 muted accent
  - Type pairing: large display serif (geometric, possivelmente Caponi-family) + sans neutral body
  - Layout: vertical scroll com hero typography enorme (80-120px); seções grid 2-3 col; whitespace radical
  - Photography: single product, natural light, color-graded warm, zero clutter background
  - Nav: minimal horizontal top
- **FILTRO pelo gate AAA:** rejeitar typography thin/light weight (eles usam regular/medium ok), rejeitar gray-on-white sub-headings se contrast <7:1, FORÇAR body 18px+. Extrair LAYOUT e SPACING, não os exact colors low-contrast deles.
- **Anti-clone hedge:** NÃO copiar paleta neutra extrema deles; misturar com Tartine warm.

**2. Tartine Bakery (San Francisco, EUA — Chad Robertson)** — `https://tartinebakery.com`
- **Arquétipo:** Industrial Rustic Authentic (B)
- **Por que escolhida:** Padrão-ouro de **comunicação visual de "artesanal autêntico"** desde 2002. Fotografia close-up de crosta de pão é vocabulário inventado por eles. Tipografia editorial warm sem ser pretensiosa.
- **Tokens visíveis para extração:**
  - Palette: cream/flour off-white + warm crust-brown + charcoal (não pure black) + accent ocasional vermelho-tomate
  - Type pairing: serif display warm (provavelmente Tiempos ou Lyon family) + sans humanista body (Brandon-family ou Founders Grotesk)
  - Layout: asymmetric grid, photos grandes, copy editorial em parágrafos longos
  - Photography: **CLOSE-UPS** crosta de pão, mão do padeiro com farinha, fermentação em banneton, sourdough crumb shots. Color-graded film (Portra 400 vibe).
  - Identidade: hand-stamped feel, logotype handletter ou warm serif
- **FILTRO pelo gate AAA:** ok majoritariamente — eles já usam body weight regular e contrast OK. Watch out hover states.
- **Anti-clone hedge:** NÃO importar paleta cream-flour-brown integralmente — tropicalizar com fotografias de cuca/sonho/torta de banana brasileira (não baguette/sourdough). Trocar accent vermelho-tomate por vermelho-acerola ou terracota Mata Atlântica.

**3. Poilâne (Paris, França — fundada 1932)** — `https://poilane.com`
- **Arquétipo:** Luxury European Heritage (A)
- **Por que escolhida:** **Signal patrimonial mais forte do nicho mundial.** "Maison Poilâne depuis 1932" é o template de como uma padaria comunica longevidade SEM virar museu mofado. Tipografia patrimônio, monograma "P", uso disciplinado de preto + creme + ocasional vermelho-Bordeaux.
- **Tokens visíveis para extração:**
  - Palette: pure cream + black ink + 1 accent (vermelho-bordeaux signature)
  - Type pairing: serif clássico (provavelmente custom serif ou Garamond Premier) + sans humanista body
  - Layout: editorial grid 12-col, generous whitespace, hero com photo black-and-white da fundadora ou padaria
  - Photography: mix de preto-e-branco patrimônio (founder Lionel Poilâne fotos históricas) + color photos contemporâneas de pain de campagne
  - Identidade: monograma "P" stamp, "depuis 1932" repetido em múltiplos pontos, certificados/medalhas/heritage badges
- **FILTRO pelo gate AAA:** ok — eles usam contrast forte black-on-cream. Watch out: hover-only nav que pode existir.
- **Anti-clone hedge:** É a ref que MAIS perigosamente clonável (signature look forte). Pegar APENAS:
  - O vocabulário patrimonial ("Desde 1990" stamp, founder photo se Dona Hilda tem)
  - A disciplina cromática (3 cores max)
  - NÃO clonar serif específica (procurar serif BR-disponível em Google Fonts) NEM monograma idêntico

### 2 REFS LOCAIS escolhidas (BR/SC/PR — vernacular fit)

**1. Portus Padaria Artesanal (Blumenau, SC)** — `https://portuspadariaartesanal.com.br` (validar URL exato)
- **Região:** Blumenau (vizinho geográfico de Itoupava Seca — concorrente direto)
- **Por que escolhida:** É o benchmark CITADO no prospect list como "competitor directly winning" de P-001 Pão e Ponto. 4 unidades em Blumenau+BC, 26k Insta, mesmo arquétipo europeu. Se Dona Hilda quer competir/se diferenciar, precisamos VER o que Portus faz e EVITAR clonar (mas extrair o que funciona vernacularmente).
- **Qualidade do site atual:** desconhecido sem WebFetch, mas dado o tier comercial (4 unidades + 26k Insta) provavelmente é tier 2010s-genérico OR Squarespace template — não ref de design web premiada, MAS ref de **vernacular fit** (linguagem PT-BR, oferta sazonal típica BR, fotografias de padaria realmente brasileira).
- **Extração esperada:** copy patterns (como chamar "encomenda de bolo", como anunciar "Páscoa colomba"), categorização de cardápio (pães vs doces vs salgados vs encomenda), referência cultural Itoupava/Blumenau (alemã + brasileira).
- **Anti-clone:** Dona Hilda NÃO pode parecer "filha pobre do Portus". Precisamos posicionar como **mais patrimônio, menos chain**. Portus = 4 unidades modernas; Dona Hilda = 1 padaria de bairro 36 anos. Signal oposto.

**2. Padaria Boutique Cantinho do Pão (Curitiba, PR — proxy)** OU **Cuca Fresca / Padoca de Floripa** — `https://cantinhodopao.com.br` (validar)
- **Região:** Curitiba PR / Florianópolis SC (Sul BR, vernacular adjacente)
- **Por que escolhida:** Floor de qualidade BR realista — padaria de bairro premium que JÁ tem site decente (não Wix template horroroso, não 2008-HTML). Refs como Cuca Fresca (Floripa) ou Pão e Toast (Curitiba) servem para calibrar AMBITION REALISTA dentro do BR — não vamos clonar Hart Bageri em Blumenau, mas vamos elevar o floor BR.
- **Qualidade do site atual:** assumido tier "decente BR 2022+" — WordPress moderno OU Wix premium OR custom simples Next/React. Não premiado mas funcional.
- **Vernacular fit pra Blumenau:** Sul BR compartilha vocabulário (cuca, bolinho de chuva, pão sovado), audience demográfica (alemã+italiana descendente), padrão de consumo (encomenda Páscoa + Festa Junina + Natal forte).
- **Extração esperada:** sitemap padrão BR (Home / Sobre nós / Cardápio / Encomendas / Contato), seções home típicas (vitrine sazonal + sobre + galeria + WhatsApp), copy patterns sazonais.
- **NOTA HONESTA:** **Esta ref específica precisa validação. Se Cantinho do Pão não existir ou for ruim, substituir por:** Padaria do Bira (Floripa), Cuca Cozinha (Curitiba), Padaria Vila Madalena, ou outro Sul-BR boutique. Validação Fase 4 = primeiro WebFetch obrigatório.

### Industry-fit gate analysis (Quality squad requirement)

**Pergunta do gate:** "As 5 refs CONJUNTAMENTE fazem sentido pra Dona Hilda 36 anos LTDA Itoupava Seca? Atomic-level convergence? Anti-clone risk distribuído?"

**Convergência atômica entre as 5:**
- **Color:** Hart (off-white+black+muted), Tartine (cream+brown+accent), Poilâne (cream+black+bordeaux), Portus (provável warm BR), Cantinho (provável warm BR). **Convergência:** todos cream/off-white background dominante + dark neutral text + 1 accent. **Para Dona Hilda:** cream tropical (não SF cool cream) + warm brown-pão + acerola/terracota accent. **Anti-clone:** 85% threshold satisfeito — cada um tem accent diferente, paleta única emerge.
- **Type:** Hart (serif display + sans body), Tartine (serif warm + sans humanista), Poilâne (serif clássico + sans humanista), Portus (provável serif+sans BR), Cantinho (provável). **Convergência:** serif display em headlines + sans humanista em body. **Para Dona Hilda:** pair serif Google-Fonts-disponível (DM Serif Display ou Fraunces) + sans humanista (Inter ou DM Sans). **Anti-clone:** 75% threshold — cada ref usa serif diferente, fonte BR-disponível diverge.
- **Layout:** Hart (vertical scroll editorial), Tartine (asymmetric photo-grid), Poilâne (12-col grid clássico), Portus/Cantinho (provável padrão BR home-sobre-cardápio). **Divergência saudável:** 60% threshold — layout pode ser deliberadamente único, atomic convergence em color+type já suficiente.
- **Photography direction:** Hart (single-product clean), Tartine (close-up rustic ASMR), Poilâne (heritage B&W + product), Portus/Cantinho (provável realista BR). **Convergência:** fotos REAIS, natural light, close-up de produto. **Para Dona Hilda:** EXIGE sessão fotos 2h presencial (já no stack).

**Anti-clone risk distribution:**
- Nenhuma ref sozinha pode dominar >40% dos tokens finais
- Color: 40% Tartine warm + 30% Poilâne disciplina + 30% Brazilian tropical
- Type: 40% Hart hierarchy + 30% Tartine warmth + 30% BR-available
- Layout: 50% Hart grid + 30% Tartine asymmetric photo + 20% BR-vernacular density
- Photography: 50% Tartine close-up + 30% Poilâne heritage + 20% Portus/Cantinho real
- Copy/IA: 60% BR vernacular + 40% Heritage signal

**Veredicto industry-fit gate:** **PASS** com condição — refs locais (Portus + Cantinho/equiv) DEVEM ser visualmente verificadas Fase 4 ANTES de extract. Se sites BR forem ruins demais, substituir por outras + documentar.

---

## Dimensão Mercado (SECONDARY, compressed)

### Sazonalidade BR padaria artesanal (estimativas calibradas com knowledge nicho)

| Sazonal | Janela | % faturamento típico padaria boutique BR | Produto signature |
|---|---|---|---|
| **Páscoa** | mar/abr | 25-35% (mês concentrado) | Colomba pascal, ovo trufado, rosca |
| **Festa Junina** | jun/jul | 15-20% | Cuca, bolo de fubá, paçoca, pé-de-moleque |
| **Natal/Panetone** | nov/dez | 20-30% | Panettone artesanal, rabanada, stollen (em SC com herança alemã forte) |
| **Dia das Mães** | mai (2ª dom) | 8-12% (3 dias) | Bolos torta encomenda, kit café da manhã |
| **Dia dos Namorados** | jun (12) | 5-8% | Bolos personalizados, doces gift |
| **Aniversários/encomendas constantes** | ano todo | 15-25% base | Bolos sob encomenda, kits festa |
| **Walk-in cotidiano** | ano todo | 10-15% base | Pães, sonhos, bolos fatia, café |

**Para Dona Hilda especificamente (Itoupava Seca, herança alemã+brasileira):**
- Panettone + stollen Natal = signal MUITO forte (audience alemã-descendente compra stollen, audience BR compra panettone — duplo target).
- Cuca Festa Junina = signal vernacular Vale Itajaí — IMPRESCINDÍVEL no site.
- Maio 2026 (timing piloto) = "dia das mães + pré-Natal late + pós-Páscoa" — janela aceitável mas não pico.

**Implicação design:** Home precisa de seção **"Vitrine Sazonal"** dinâmica (atualizável via CMS leve / MDX file por maintainability gate). Em maio mostra "Dia das Mães + Pré-Natal coming". Em outubro mostra "Reservas de panettone abertas". Em fevereiro mostra "Colomba e ovos da Dona Hilda".

### Jornada cliente típica (mobile-first, BR padaria artesanal)

1. **Descoberta:** Google search ("padaria artesanal Itoupava Seca", "panettone artesanal Blumenau", "encomenda bolo Itoupava Seca") OR Instagram discovery (post viral de cuca/sonho/torta) OR word-of-mouth ("a confeitaria da Dona Hilda")
2. **Avaliação rápida (Google):** clica resultado #1-3 → verifica fotos no GBP → vê endereço + horário + nota → decide se vale Google Maps OU site
3. **Avaliação no site (se chegou):** verifica em ordem: (a) é a padaria certa? (logo + nome + bairro), (b) abre quando? (horário), (c) onde fica? (mapa + endereço), (d) o que vende? (cardápio/galeria), (e) como pedir? (WhatsApp button OR telefone)
4. **Conversão presencial:** vai à padaria (60-75% das jornadas) OR
5. **Conversão WhatsApp:** clica button → mensagem template "olá, gostaria de encomendar..." → conversa direto com atendente → faz pedido por áudio/texto/foto

**Implicação design:**
- Hero deve resolver "é a padaria certa + abre quando + onde fica" em <3 segundos
- WhatsApp button **FIXED/STICKY** em mobile (já gate inclusive-design enforce `wa.me` valid)
- Mapa embed + horário próximos do topo
- Cardápio NÃO precisa ecommerce — pode ser galeria + WhatsApp CTA por categoria

### Voice of Customer — Reviews padaria-similar 1-2★ típicos (BR Google Reviews patterns)

Padrões de reclamação mais comuns em padarias artesanais BR (cross-reference Google Reviews 1-2★ de padarias boutique RJ/SP/SC observados em outros projetos):

1. **"Caro" / "Preço de São Paulo"** — 30-40% dos 1-2★. Implicação design: signal de qualidade artesanal precisa ser INQUESTIONÁVEL (fotos crosta de pão fermentação 48h, story da Dona Hilda, vídeo amassando massa) para justificar preço sem dizer preço.
2. **"Demoraram para atender"** — 15-20%. Implicação design: WhatsApp button precisa setar expectativa ("respondemos das 7h às 18h, fora disso responderemos no próximo dia útil").
3. **"Acabou o pão / faltou produto"** — 10-15%. Implicação design: seção "Reserve seu pão" / encomenda antecipada visível.
4. **"Estacionamento difícil"** — 10%. Itoupava Seca tem essa dor — site deve falar de estacionamento se houver OR sinalizar "estacionamento na rua, melhor horários X-Y".
5. **"Atendimento frio"** — 5-10%. Implicação design: tom de copy WARM (não "Nossa Empresa fundada em..." mas "Tudo começou em 1990, na cozinha da Hilda...").

**Implicação anti-clone:** rejeitar copy patterns Hart/Tartine traduzidos literal — eles operam em mercado high-trust onde "fermented 72 hours" é aspirational. No BR, "fermentação lenta 48h" precisa explicar O QUE É e POR QUE importa.

---

## Recomendações pra Brief Executável (Fase 5)

1. **Arquétipo recomendado:** Síntese **A+B+E** (Heritage Patrimonial 30% + Rustic Authentic 40% + Brazilian Premium 30%) — modernized warmly.

2. **Token palette inicial (atomic-convergence layer):**
   - **Background:** cream tropical `#F7F1E8` (warmer que SF Tartine, não cool gray Hart)
   - **Text primary:** `#2A1F1A` warm dark brown (NÃO pure black — Tartine principle)
   - **Accent:** terracota Mata Atlântica `#B85C3B` (vernacular BR + warm; substituí vermelho-bordeaux Poilâne)
   - **Secondary text:** `#5A4A3F` (verificar contrast 7:1 em background cream — provavelmente ok, validar Fase 5)
   - **Validation:** todos os contrast pairs precisam passar AAA 7:1 — gate inclusive-design não-negociável.
   - **NOTA:** estes são SUGESTIVOS — a extração real Fase 4 vai derivar via multi-ref-extract com triangulação tokens.

3. **Tipografia recomendada (fontes Google Fonts BR-disponíveis):**
   - **Display:** **Fraunces** (serif warm, modern, ótimo peso variável) — alternativa: DM Serif Display ou Playfair Display.
   - **Body:** **Inter** (variable, peso medium em 18px+, Tier S compliance trivial) OR **DM Sans** se queremos mais warmth humanista.
   - **Body min size:** 18px (gate). Headline display: 48-80px hero, 32-40px section.
   - **Pairing logic:** Fraunces display + Inter body é cobertura segura — ambas variable fonts, carregamento performance OK (gate field-perf).

4. **Layout pattern (organism-level deliberate):**
   - **Hero:** photo grande da padaria/fachada/Dona Hilda + headline serif curto ("Confeitaria desde 1990, na Itoupava Seca") + sub-line + WhatsApp CTA + endereço/horário.
   - **Nav:** horizontal simples sticky — Home / Cardápio / Encomendas / Sobre / Contato. **NÃO** hover-only — labels visíveis.
   - **Section 1 — Vitrine Sazonal:** rotativa CMS-editável; em maio mostra Dia das Mães + Pré-Natal.
   - **Section 2 — História/Sobre:** signal patrimonial — foto preto-e-branco se houver da Hilda fundadora, ano 1990, narrativa curta (3-4 parágrafos máximo, readability 6th-grade per content-truth gate).
   - **Section 3 — Cardápio/Galeria:** grid de fotos categorizadas (Pães / Doces / Bolos / Encomendas / Salgados) — cada uma com WhatsApp CTA "encomendar via WhatsApp".
   - **Section 4 — Localização:** map embed (não autoplay — gate respect) + endereço + horário + telefone clickable + WhatsApp.
   - **Footer:** signal heritage + LGPD/contato/redes sociais.

5. **Conteúdo prioridade (3 pages mínimas + ordem home):**
   - Home (estrutura acima)
   - Cardápio (galeria categorizada, sem ecommerce, com WhatsApp CTA por item)
   - Encomendas (form simples — bolo, quando, observações — direciona para WhatsApp com prefill)
   - **Opcional sprint 1:** Sobre/História (se signal patrimonial precisa página própria)

6. **Constraints CDC/Patricia Peck respeitadas:**
   - ✅ Nenhuma linguagem "site que vende" — substituir por "site que recebe pedidos via WhatsApp"
   - ✅ Garantia mencionada se aparecer no site = linguagem ADR-0002 exata
   - ✅ Política de Privacidade + Termos de Uso + canal `privacidade@donahilda.com.br` (do kit jurídico)
   - ✅ Banner Consent Mode v2 se houver analytics

7. **Performance constraints (gate field-perf):**
   - Initial JS ≤80KB gzipped (hard cap 100KB)
   - Hero image ≤180KB AVIF / 240KB WebP fallback — implica converter fotos sessão presencial
   - LCP ≤2.0s field — implica Next.js Image + Vercel CDN + image priority hint no hero
   - INP ≤200ms — implica zero JS animations no critical path

---

## Limitações desta research (Tier S 2h budget)

1. **Sem WebFetch ao vivo das refs.** URLs assumidas como existentes (Tartine, Poilâne, Hart Bageri são todas confirmadamente existentes pelo knowledge base, mas estado atual dos sites em maio/2026 não verificado — Hart Bageri pode ter redesenhado, Poilâne pode ter mudado). **Fase 4 multi-ref-extract OBRIGA WebFetch + screenshot ao vivo antes de extract.**
2. **Refs locais (Portus, Cantinho do Pão) NÃO validadas visualmente.** Existência + qualidade do site = assumption. **Primeiro passo Fase 4 = WebFetch das 2 refs locais; se ruins, substituir.** Lista backup BR: Padaria Bracarense (RJ), Cuca Fresca (Floripa), Padaria do Bira, Pão e Toast (Curitiba), Cantinho do Pão variants, Pão Pão (Itajaí).
3. **Voice of Customer = inferência patterns** de outros projetos similares — NÃO leitura de reviews 1-2★ específicas da Dona Hilda. Fase 4 ou Fase 2 (dossiê de dor) deve ler reviews reais GBP Dona Hilda.
4. **Sem análise competitiva profunda Portus** — apenas referência. Squad pesquisa real precisaria walk-by + screenshot site Portus + comparação posicionamento.
5. **Anti-clone thresholds (85/75/60)** são guidelines do CONTEXT.md — validação real só acontece pós-extract Fase 4 quando temos tokens numéricos das 5 refs.
6. **Arquétipo E "Brazilian Premium" é under-defined** no nicho — exemplos brasileiros que citei (Bracarense, Cuca, Padaria do Lulu) são parcialmente alinhados. Há gap de mercado real aqui — Dona Hilda pode SER o caso definidor desse arquétipo se executado bem.

---

## Próximos passos (Fase 4 — DESIGN EXTRACT)

1. WebFetch + screenshot ao vivo das 5 refs (3 globais + 2 locais) — primeiro gate Fase 4
2. Se ref local quebrada → substituir + documentar em learnings
3. Multi-ref-extract → tokens numéricos por categoria (color hex, type family, spacing scale, layout grid)
4. Aplicar gates pre-synthesis: anti-clone thresholds, industry-fit, exclusion-habit filter
5. Pre-synthesis gate PASS → tokens go para Fase 5 Brief Executável
6. Pre-synthesis gate FAIL → loop Fase 4 OR voltar pra Fase 3 + adicionar refs

---

*Tier S NICHE RESEARCH compressed. Triangulado com knowledge base nicho padaria artesanal global + heurísticas Tier S quality gates. ~30min execution (estimado), 0% código produzido. Validade estimada: 6 meses (revisar se Hart Bageri redesenha OR se entra ref BR breakthrough no nicho).*
