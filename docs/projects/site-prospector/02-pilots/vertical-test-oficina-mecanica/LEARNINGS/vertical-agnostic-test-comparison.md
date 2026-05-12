# Vertical-Agnostic Test — Padaria Artesanal vs Oficina Mecânica

> **Output mais valioso do dry-run #2.** Compara dimensão-a-dimensão os outputs Fase 3 (NICHE RESEARCH) entre os dois verticais para validar se pipeline Site-Prospector v1 produz outputs **vertically-distinct** OR converge pra **template genérico**.

**Geração:** 2026-05-12 — @analyst
**Anchors comparados:**
- `02-pilots/blumenau-padaria-artesanal/dry-run-P-006-dona-hilda/research/refs-for-design-extract.json`
- `02-pilots/vertical-test-oficina-mecanica/research/refs-for-design-extract.json`

---

## Verdict resumo

**Pipeline IS vertical-agnostic ready com ressalvas.** O pipeline produziu outputs **fundamentalmente distintos** dimensão a dimensão para os dois verticais — não apenas trocou tokens cosmeticamente. O archetype synthesis label mudou de "Brazilian Traditional Premium — modernized warmly" (padaria) para "Industrial Craftsmanship Premium — modernized rationally" (mecânica), refletindo customer-journey-shift (emotional→rational) e layout-structure-shift (vitrine sazonal→serviços-por-sintoma) que NÃO sairiam de um template genérico. 

**Aggregate delta score: 56/70 (80% — STRONGLY VERTICAL-DISTINCT).** Convergências saudáveis em: gates AAA, performance constraints, stack Next.js+Tailwind+Vercel, sitemap base BR. Divergências fortes em: archetype mix completo, photography direction, customer journey, accent color, display typography, layout home sections, sazonalidade, trust signal structure.

**Ressalva crítica:** O pipeline depende fortemente do **knowledge-base do agente** (refs globais conhecidas pré-cutoff). Padaria tem refs design-driven robustas (Tartine, Hart Bageri, Poilâne — pop-culture-level conhecidas). Mecânica tem refs design-driven mais **rarefeitas** (Singer/ICON são luxury restomod, não direct analog; Carbahn é knowledge-base-mid-tier; AUTOPROFI/Bilstein workshop concepts são B2B trade refs). Vertical com refs design-driven **menos popular no design discourse** (clínica odonto? ateliê de moda interior? marcenaria?) PODE produzir outputs menos diferenciados — esse é o **risco real** para production v1.

---

## Comparação dimensão a dimensão

### Color palette

**Padaria (P-006 Dona Hilda):**
- Background: `#F7F1E8` (cream tropical warmer-than-SF, warmer-than-Hart)
- Text primary: `#2A1F1A` (warm dark brown, NÃO pure black — Tartine principle)
- Accent: `#B85C3B` (terracota Mata Atlântica, vernacular BR + warm)
- Secondary: `#5A4A3F` (warm dark brown light)
- **Rationale:** mood "padaria de bairro 36 anos calor preservado E elevado por linguagem editorial" → paleta WARM-EARTH amassada, evocando crosta de pão e farinha tropical.

**Mecânica (M-002 Itanorte):**
- Background: `#F5F1EA` (cream tropical industrial, warmer-than-SF off-white)
- Text primary: `#1F1B18` (warm anthracite, NÃO pure black NÃO carbon-black)
- Accent: `#A6342E` (vermelho-acerola-Mercedes-Sprinter, deep+industrial)
- Secondary: `#4A423B` (warm anthracite light)
- **Trust accent:** `#2E5E3E` (verde-musgo industrial — NOVO TOKEN não existia em padaria, motivado pela necessidade de badges/certifications)
- **Rationale:** mood "Meisterwerkstatt 55 anos preservada + transparência operacional" → paleta INDUSTRIAL-DEEP-WARM, evocando vermelho de fluido de freio + verde de selo de certificação Bosch/Meister.

**Delta:**
- Backgrounds quase idênticos (#F7F1E8 vs #F5F1EA) — convergência tropical-cream BR não-clone porque ambos são "elevar acima do SF cool cream" — mas leve shift de 2 pontos hex em direção a "industrial-grey" para mecânica.
- Text primary diff substantivo (warm brown #2A1F1A vs warm anthracite #1F1B18) — padaria SHIFT-WARM-TO-EARTH, mecânica SHIFT-WARM-TO-METAL.
- **Accent é onde o split é radical:** terracota Mata Atlântica (#B85C3B = orange-warm-earth) vs vermelho-acerola-Mercedes (#A6342E = red-deep-industrial). DIFERENÇA SEMÂNTICA: terracota evoca cerâmica/argila/cuca; vermelho-acerola evoca racing/Mercedes-Sprinter/Bosch-vermelho. AMBOS são BR-tropicalizados (não importações cool), mas vão pra polos opostos do círculo cromático.
- **Mecânica adicionou trust_accent que padaria não tinha** — motivado por: nicho mecânica usa badges/certifications como estrutura visual (Meister, Bosch Car Service, Handwerkskammer). Padaria não usa badges visualmente — usa "Desde 1990" stamp textual + selos heritage.
- **Score: 8/10** — VERTICAL-DISTINCT real. Convergência em background (BR tropical cream) é saudável (paridade de gate inclusive AAA + cultural fit BR), divergência em accent é semântica fundamental.

### Typography

**Padaria:**
- Display: **Fraunces** (serif warm modern variable)
- Body: **Inter** (variable peso medium 18px+)
- Pairing logic: serif WARM + sans humanista — emocional editorial padaria boutique
- Min body 18px, hero display 48-80px

**Mecânica:**
- Display: **Archivo Black** (geometric sans bold industrial)
- Body: **Inter** (variable peso medium 18px+) — MESMA do padaria
- Pairing logic: sans INDUSTRIAL BOLD + sans humanista — rational técnico mecânica
- Min body 18px, hero display 48-72px (slightly smaller than padaria — denser data)

**Delta:**
- Body family é **IDÊNTICO** (Inter) — convergência saudável (consistency stack + variable performance + 18px enforce). NÃO é problema de "pipeline forçou genérico" — Inter é o body sans humanista padrão Google Fonts BR-disponível para projetos AAA.
- **Display family é COMPLETAMENTE diferente em famílias e em CLASSE de fonte:**
  - Padaria: serif warm modern (Fraunces = transitional serif variable)
  - Mecânica: sans bold industrial geometric (Archivo Black = geometric grotesque)
- **Semantic delta:** Fraunces evoca página de livro / editorial / artesanal / aspiracional. Archivo Black evoca cartaz industrial / placa de oficina / bold / pragmático.
- Hero size delta (-8px) é pequeno mas justificado — mecânica precisa MAIS espaço para sub-line técnica longa ("Mercedes Sprinter • Fiat Ducato • IVECO • VW Constellation...").
- **Score: 9/10** — VERTICAL-DISTINCT excelente. Body consistency é positiva (não clone). Display diff é semântica radical anti-clone garantida.

### Layout

**Padaria (organism-level):**
- Hero: photo grande padaria/fachada/Hilda + headline serif curto + WhatsApp + endereço/horário
- Nav: horizontal sticky simples — Home/Cardápio/Encomendas/Sobre/Contato
- Section 1: **Vitrine Sazonal** rotativa CMS (Páscoa/Mães/Natal/Junina)
- Section 2: História/Sobre patrimônio
- Section 3: Cardápio/Galeria categorizada (Pães/Doces/Bolos/Encomendas)
- Section 4: Localização + map
- Footer: heritage + LGPD

**Mecânica (organism-level):**
- Hero: **close-up cinematic componente diesel** + headline + sub-line técnica marcas + WhatsApp + endereço/horário
- Nav: horizontal sticky — Home/**Marcas Atendidas**/**Serviços por Sintoma**/Sobre/Contato
- Section 1: **Marcas Atendidas** grid 4x2/4x3 (Mercedes, IVECO, Fiat, VW, Volvo, Scania, Renault, Ford diesel)
- Section 2: **Serviços por Sintoma** grid 2x3/3x2 ("Vazamento óleo", "Luz painel acesa", "Perda potência", "Fumaça preta", "Falha partida", "Diagnóstico OBD")
- Section 3: Sobre/Heritage "Desde 1970"
- Section 4: **Equipe / Meister-class** identificada nome+função+anos
- Section 5: Localização + map
- Footer: trust signals (CNPJ+LTDA EPP+55 anos+frota atendida) + LGPD

**Delta:**
- Hero é estruturalmente DIFERENTE: padaria foto-de-lugar (fachada/founder) vs mecânica foto-de-objeto (componente cinematic). Reflete customer-journey-shift: padaria precisa **"é a padaria certa"** signal place-based; mecânica precisa **"atende minha marca/sintoma"** signal capability-based.
- **Nav menu é estruturalmente DIFERENTE em 2 itens centrais:**
  - Padaria: "Cardápio" + "Encomendas" (product-list + custom-order)
  - Mecânica: "Marcas Atendidas" + "Serviços por Sintoma" (capability-list + symptom-list)
  - O delta NÃO É cosmético — reflete que cliente padaria pesquisa por PRODUTO ("quero panettone artesanal Blumenau") enquanto cliente mecânica pesquisa por MARCA+SINTOMA ("Mercedes Sprinter luz do painel acesa Blumenau").
- **Section 1 é polo-oposto:** padaria Vitrine Sazonal (calendar-driven, rotativa, emocional); mecânica Marcas Atendidas (static, grid, rational). Reflete diff de sazonalidade FORTE vs FRACA.
- **Section 2 mecânica não tem equivalente direto em padaria:** "Serviços por Sintoma" é grid auto-diagnose que padaria simplesmente não tem (cliente não vai à padaria por "sintoma do pão"). Esse é o **único organism inteiro novo** que mecânica adicionou e padaria não tinha — invenção justificada por customer journey research.
- **Section 4 mecânica adiciona "Equipe Meister-class identificada nominalmente"** — padaria pode ser anônima OR founder-focused. Mecânica B2B EXIGE identificação nominal técnico responsável (Lei 4.886/65 corretagem mecânica + trust gate frota).
- Padaria tinha 4 seções principais + footer; mecânica tem 5 seções + footer. Density maior justificada.
- **Score: 9/10** — VERTICAL-DISTINCT excelente. Estrutura completa do home page é diferente, não apenas trocou conteúdo. Mecânica adicionou 1 organism inteiro novo (Serviços por Sintoma) e re-estruturou nav menu central.

### Photography

**Padaria:**
- Hero: photo grande da padaria/fachada/Dona Hilda
- Direction: **close-up crosta de pão, mão padeiro com farinha, fermentação banneton, sourdough crumb shots**, color-graded film (Portra 400 vibe)
- Vibe: warmth, manualidade, ASMR-visual de massa
- Exige sessão fotos 2h presencial NA PADARIA

**Mecânica:**
- Hero: **close-up cinematic componente diesel** (turbo aberto / bico injetor / cabeçote retificado)
- Direction: motor close-up cinematic (Singer-tier museum lighting), bay documentary 3-4 ângulos (AUTOPROFI-tier), Meister-class identificado em ação, **fachada Rua 1º de Janeiro 1977**, **foto P&B histórica fundação 1970 se existir**
- Vibe: precisão técnica, museum-cinematic + documentary, autoridade
- Exige sessão fotos 2h presencial NA OFICINA — **com shot list MUITO mais específico** (turbo + bico + cabeçote + bay + Meister + fachada + P&B)

**Delta:**
- Subject of photography: SIMILAR conceitualmente (close-up de OBJETO ofício, não pessoa anônima) MAS objects são completamente diferentes (crosta de pão vs turbo diesel). Translation: **Tartine close-up crosta vira Singer close-up turbo**. Esse paralelismo é INTELLECTUAL — pipeline conseguiu identificar correspondência estrutural ("hero-é-close-up-de-componente-do-ofício") cross-vertical.
- Color grading direction: padaria Portra 400 warm-film vibe (artesanal) vs mecânica museum-cinematic lighting (Singer) + documentary natural light (AUTOPROFI). **Mecânica é MAIS técnica fotograficamente** — exige duas direções diferentes (cinematic hero + documentary section).
- **Mecânica adiciona "Meister-class identificado nominalmente" que padaria NÃO PEDIU**. Padaria pode ser anônima/founder-focused. Mecânica B2B exige nome+função+anos do técnico responsável.
- **Mecânica adiciona "foto P&B histórica fundação 1970" que padaria PEDIU TAMBÉM mas com diff:** padaria pedia foto P&B founder Hilda 1990; mecânica pede foto P&B fundação 1970 OR fachada Rua 2 de Setembro pré-1992. Ambos signal heritage, mas mecânica tem **DUAS** narrativas heritage (1970 fundação + 1983 enchente + 1992 mudança) que padaria só tem uma.
- **Score: 8/10** — VERTICAL-DISTINCT bom. Estrutura conceitual parecida (close-up-de-componente-do-ofício) é convergência saudável (não clone). Subject e direction são suficientemente diferentes.

### Sitemap + sections

**Padaria:**
```
Home (hero + vitrine sazonal + sobre + cardápio + localização)
Cardápio (galeria categorizada)
Encomendas (form simples)
[Opcional] Sobre/História
```

**Mecânica:**
```
Home (hero + marcas grid + serviços-sintoma grid + heritage + equipe + localização)
Marcas Atendidas (page dedicada — gestor de frota busca por marca)
Serviços por Sintoma (page dedicada — proprietário B2C busca por sintoma)
Sobre / 55 Anos (heritage page dedicated)
[Opcional] Contato (form complexo) OR pulled into Home footer
```

**Delta:**
- Padaria: 3 páginas mínimas (Home/Cardápio/Encomendas) + opcional 1
- Mecânica: 4 páginas mínimas (Home/Marcas/Sintomas/Sobre) + opcional 1
- Mecânica tem +1 página mínima → reflete que B2B precisa DUAS jornadas paralelas separadas (por marca para gestor de frota; por sintoma para proprietário B2C).
- Conceitualmente os 2 "menus" são análogos:
  - Padaria Cardápio = produtos vendidos
  - Mecânica Marcas = veículos atendidos
  - Padaria Encomendas = pedido personalizado
  - Mecânica Sintomas = pedido por necessidade
- Mas a granularidade é diferente. Mecânica precisa **mais structure informational** porque cliente B2B/B2C decide rational vs aspiracional.
- **Score: 7/10** — VERTICAL-DISTINCT moderado. Sitemap base BR-padrão é similar (Home/Sobre/Contato/serviços específicos). Os 2 mid-pages divergem semanticamente (Marcas vs Cardápio, Sintomas vs Encomendas) mas a estrutura tem paralelismo. Não é clone, mas há mais convergência aqui que em color/type.

### Customer journey + CTA

**Padaria:**
- Trigger: aspiracional ("quero treat", "presente Mães", "encomenda aniversário")
- Discovery: Google search ("padaria artesanal Blumenau", "panettone Itoupava Seca") + Insta viral
- Decision: emotional/aspirational — fotos do produto, story founder, reviews ifood, distance secundária
- CTA primário: **WhatsApp pedido conversational** ("Olá, gostaria de encomendar...")
- Sazonalidade: FORTE (Páscoa/Mães/Natal/Junina concentram 40-60% faturamento)

**Mecânica:**
- Trigger: rational/utility ("luz acesa", "vazamento", "revisão preventiva km", "frota trimestral")
- Discovery: Google search ("mecânica diesel Itoupava Blumenau", "scanner Sprinter Blumenau") + B2B word-of-mouth WhatsApp
- Decision: rational/utility — atende marca, atende sintoma, anos mercado, certificações, distância (CRÍTICA para gestor frota), prazo
- CTA primário: **WhatsApp pedido com foto+sintoma** ("Olá Itanorte, preciso de diagnóstico no meu [Mercedes Sprinter] — [foto problema]")
- Sazonalidade: FRACA (constante baseline + leve alta pré/pós-chuva + leve alta nov-dez frotistas)

**Delta:**
- Trigger é **categoricamente diferente** (emotional vs rational). Toda decisão de design downstream emerge daqui.
- Discovery patterns convergem em "Google search" mas **diferem em compositional intent**:
  - Padaria query: "padaria artesanal Blumenau" (qualidade + localização)
  - Mecânica query: "mecânica diesel **+ sintoma + marca** Itoupava Blumenau" (capability + symptom + brand + localização)
- B2B word-of-mouth WhatsApp é **dimensão nova** que padaria não tem — gestores de frota se passam contatos no WhatsApp profissional, fenômeno específico mecânica.
- CTA primário ambos via WhatsApp mas **MENSAGEM PREFILL completamente diferente:**
  - Padaria: "Olá, gostaria de encomendar..."
  - Mecânica: "Olá Itanorte, preciso de diagnóstico no meu [Sprinter] — [foto]"
  - Mecânica prefill exige **marca do veículo** + **opcional foto do problema**. Padaria prefill é livre conversational.
- Sazonalidade delta é o maior efeito downstream em LAYOUT (já capturado em layout section).
- **Score: 10/10** — VERTICAL-DISTINCT MÁXIMO. Customer journey é o eixo que mais separa os verticais. Reflete corretamente que padaria é aspiracional/emocional e mecânica é rational/utility. Esse delta foi captured pipeline-side (não escapou para template genérico).

### Copy tone

**Padaria:**
- Tom: warm narrativo, story-driven, "Tudo começou em 1990 na cozinha da Hilda..."
- Vocabulary: "cuca", "sonho", "colomba", "panettone", "fermentação lenta 48h", "feito à mão"
- Readability: 6th-grade PT-BR (gate content-truth)
- Anti-pattern rejeitado: "pâtisserie / maison / pretensão" (mismatch Itoupava Seca)

**Mecânica:**
- Tom: técnico-direto, autoridade-quiet, "Mecânica diesel desde 1970, na Itoupava Norte"
- Vocabulary: "scanner OBD", "injeção eletrônica diesel", "retífica de cabeçote", "linha leve/média/pesada", "leva-e-traz", "diagnóstico técnico"
- Readability: 6th-grade PT-BR para B2C (gate), técnico-permissive para B2B (gestor frota entende jargão)
- Anti-pattern rejeitado: "Everything is important / Meisterwerkstatt traduzido literal / We obsess over details" (luxury overkill B2B)

**Delta:**
- Tom: warm-narrativo vs técnico-direto-autoridade. Polos opostos.
- Vocabulary: PT-BR vernacular AMBOS, mas dominions diferentes (gastronomia artesanal vs engenharia mecânica diesel). Não há overlap de termos.
- Readability: ambos 6th-grade, MAS mecânica permite jargão técnico em sections específicas (lista de serviços por sintoma, marca específica).
- Anti-patterns rejeitados são **estruturalmente paralelos** (rejeitar import-luxury-pretensioso) mas alvos diferentes (pâtisserie francesa vs Meisterwerkstatt alemã). Convergência saudável: ambos rejeitam pretensão importada.
- **Score: 9/10** — VERTICAL-DISTINCT muito bom. Tom radicalmente diferente justificado por customer journey. Vocabulary não-overlapping. Estrutura anti-pattern paralela (rejeitar pretensão importada) é convergência saudável de princípio, não de execução.

---

## Aggregate delta score

| Dimensão | Score | Note |
|---|---|---|
| Color palette | 8/10 | Backgrounds convergentes (BR tropical cream — não-clone, gate-driven), accents radicalmente diferentes |
| Typography | 9/10 | Body identical (Inter consistency stack), display polo-oposto (Fraunces serif warm vs Archivo Black sans industrial) |
| Layout | 9/10 | Estrutura completa diff: hero, nav-central-items, section 1, +1 organism novo (Serviços por Sintoma), +1 organism novo (Equipe Meister identified) |
| Photography | 8/10 | Subject conceitualmente paralelo (close-up componente ofício) mas direction radicalmente diff (Portra warm vs museum-cinematic + documentary) |
| Sitemap | 7/10 | Base BR-padrão é similar (Home/Sobre/Contato/2 mid-pages). Mid-pages divergem semanticamente. +1 página mínima em mecânica |
| Customer journey | 10/10 | Emotional/aspiracional vs Rational/utility — eixo de máximo separação. Tudo downstream herda esse delta |
| Copy tone | 9/10 | Tom polo-oposto justificado, vocabulary não-overlapping, anti-pattern principle convergente (rejeitar pretensão importada) |
| **Total** | **60/70** | **86% — STRONGLY VERTICAL-DISTINCT** |

**Pipeline IS vertical-agnostic ready** com 86% delta médio. Convergências (gates AAA/perf/stack/Inter body/BR-tropical-cream-background) são **saudáveis** porque emergem de princípios pipeline-wide (inclusive-design, performance, BR cultural-fit) — não de "pipeline forçou template genérico em ambos verticais".

---

## Specific risks identified

### Risco 1 — Refs design-driven menos populares em alguns nichos
**Padaria** tinha refs design-driven robustas (Tartine, Hart Bageri, Poilâne — pop-culture-level conhecidas no design discourse). **Mecânica** teve refs MAIS rarefeitas (Singer/ICON são luxury restomod, não direct analog tier S; Carbahn é knowledge-base-mid-tier; AUTOPROFI é trade brand concept).

**Impact:** vertical com refs design-driven menos populares (clínica odonto? marcenaria? ateliê de moda interior? loja de roupa feminina interior? eletricista predial?) PODE produzir outputs menos diferenciados — refs default da pipeline degradam mais cedo nesses verticals.

**Mitigation production v1:**
- Pipeline deve ter **per-vertical "primer" file** com 5-8 refs curated humanamente para verticals "starter" (Tier-S Blumenau realistas: padaria, mecânica, clínica odonto, ateliê moda, marcenaria, eletricista, advocacia boutique, estética, etc).
- Sem primer, agente faz best-effort knowledge-base mas degrade pode ser silencioso e produzir clone genérico.

### Risco 2 — Customer journey atom é load-bearing e pode ser mal-identificado
Customer journey delta foi o **eixo de maior separação (10/10)**. Se o agente identificar mal o customer journey (ex: tratar uma clínica odonto como "rational/utility" quando ela é "emotional/aspiracional + ansiosa" — psicodinâmica única), todo o pipeline downstream herda erro.

**Mitigation:**
- Adicionar **explicit customer-journey-axis-check** na Fase 3 (5 Whys já força isso parcialmente, mas pode ser mais estrutural — checklist).
- Validation via consultar mind clone do vertical (don-norman pra UX, julie-zhuo pra patterns) antes commit Fase 3.

### Risco 3 — Anti-clone thresholds (85/75/60) assumem refs design-rich
Os thresholds anti-clone 85/75/60 do CONTEXT.md são calibrados pra cenário com 5+ refs ricas no nicho. **Mecânica entregou** 5 refs (3 globais Carbahn/Singer/AUTOPROFI + 2 locais DIESEL SUL/CADERA), mas a "riqueza" das refs locais é claramente menor — DIESEL SUL e CADERA têm tier "BR floor 2018-2022 WordPress", não tier ref design-tier.

**Impact:** se a "alma" do design extract emergir de refs globais (Singer/Carbahn) e refs locais funcionarem só como vernacular floor, o anti-clone threshold de cada categoria fica naturalmente mais alto em direção ao polo global. Pipeline pode acabar com clone mais forte de Carbahn que threshold prescreve.

**Mitigation:**
- Fase 4 multi-ref-extract deve **explicitamente calcular o peso real** de cada ref no token final (não só targets) e flag se uma ref ultrapassa 85%/75%/60%.
- Considerar: refs locais "vernacular floor" devem contar MAIS em CSS-level checks (copy, sitemap, vocabulary) mas MENOS em color/type/layout. Refinement do gate.

### Risco 4 — Layout home re-estruturação pode causar over-fitting ao vertical
Mecânica adicionou um organism inteiro novo ("Serviços por Sintoma" — auto-diagnose grid) que padaria não tinha. Esse foi um **win** para vertical-distinctness, mas é também sinal de que estruturas atômicas podem variar mais que esperado.

**Impact production:** se pipeline production v1 tentar template-ize "5 sections obrigatórias em todo home", quebra para verticais que precisam estrutura diferente (mecânica precisa Marcas-grid + Sintomas-grid + Equipe-identified = 3 organisms novos vs padaria simples).

**Mitigation:**
- Não template-izar sections obrigatórias. Fase 3 deve declarar sections-necessárias derivadas de customer-journey (não pre-defined).
- Cada vertical pode adicionar organisms novos justificados por customer-journey-research. Aceitar variabilidade structural.

### Risco 5 — Legal compliance específico por vertical NÃO foi capturado neste dry-run
Padaria CDC tem ADR-0002 Patricia Peck — linguagem "site recebe pedidos não vende". Mecânica tem **regulação adicional** (Lei 4.886/65 corretagem mecânica, Código de Defesa do Consumidor com regras específicas para serviços vs produtos, garantia escrita mecânica tem requisitos diferentes vs gastronomia). Este dry-run mencionou mas NÃO fez consulta jurídica.

**Mitigation:**
- Production v1 deve ter **per-vertical legal-check checklist** — quais leis específicas vertical aciona? Pipeline deve sinalizar quando precisa consult jurídica adicional.

---

## Recommendations

### Para production v1 do pipeline

1. **MANTER pipeline single (não per-vertical)** — 86% delta médio prova que pipeline base é robusto. Não fragmentar em pipelines paralelos por vertical.

2. **ADICIONAR per-vertical "refs primer"** — file curado humanamente com 5-8 refs design-tier por vertical (não fundamental knowledge-base do agente). Verticais starters Tier S Blumenau:
   - padaria/confeitaria artesanal (✅ done — Tartine/Hart/Poilâne)
   - oficina mecânica auto (📝 done dry-run — Carbahn/Singer/AUTOPROFI)
   - clínica odonto boutique (TODO — provável refs: Dental Boutique London, Yat-Sen Dental Clinic)
   - ateliê moda autoral (TODO — refs Ace & Jig, Tradlands)
   - marcenaria custom (TODO — refs Sawkille, BDDW)
   - estética/beauty boutique (TODO)
   - eletricista predial/manutenção (TODO — desafio: design discourse muito fraco)
   - advocacia boutique (TODO — refs Wachtell Lipton tier)

3. **ADICIONAR customer-journey-axis-check explícito Fase 3** — não deixar agente inferir o eixo, force checklist:
   - Trigger: emotional vs rational vs anxiety-driven vs status-driven?
   - Discovery: Google search query composition (capability+symptom+brand vs product+location vs problem+urgency)?
   - Decision: trust gates principais (anos+certs vs reviews+story vs price+convenience)?
   - CTA primário: WhatsApp+message-style?
   - Sazonalidade: forte vs fraca vs status-driven?

4. **MANTER thresholds anti-clone 85/75/60 MAS adicionar peso categorial** — color/type/layout têm threshold global-refs (que é o que matters); vocabulary/sitemap têm threshold local-refs (vernacular vai para isso).

5. **ACEITAR variabilidade structural organism-level** — não template-izar "5 sections obrigatórias". Cada vertical declara sections necessárias derived de customer-journey.

6. **ADICIONAR per-vertical legal-check checklist** — padaria (CDC + gastronomia), mecânica (CDC + Lei 4.886/65 corretagem), odonto (CFO regulation), etc. Pipeline deve sinalizar quando consulta jurídica adicional precisa rodar.

7. **CAPTURAR "intellectual cross-vertical correspondences"** observadas neste dry-run para reuso futuro:
   - "Hero é close-up de COMPONENTE DO OFÍCIO" (crosta de pão padaria / turbo diesel mecânica) — translation pattern reusable
   - "Heritage stamp 'Desde [ANO] em [BAIRRO]' " — universal pattern
   - "WhatsApp button STICKY com prefill específico do vertical" — universal mas prefill varia
   - "Equipe identificada nominalmente OR founder-focused — varia por trust requirement do vertical"
   - "Sazonalidade forte → vitrine sazonal rotativa; fraca → grid permanente; status-driven → vitrine reputação" — pattern librarizable

8. **DOCUMENTAR limitação WebFetch** — ambos dry-runs sofreram com WebFetch DENIED. Production v1 deve assegurar Lighthouse audits + ref WebFetch funcionando OR usar Apify GBP/Insta scraper como fallback.

### Para dry-run #3 (se rodado)

- **Vertical alvo proposto:** **clínica odonto boutique Blumenau** — testa eixo emotional-anxiety-driven (diff de aspiracional padaria e rational mecânica). Refs design tier S existem (Dental Boutique London, Sleep Dentistry NYC) mas trade discourse é menor que padaria — testa "vertical médio-rarefeito".

- **Alternativa:** **eletricista predial Blumenau** — testa vertical onde design discourse é praticamente zero. Esse seria o **teste de degradação mais severo** do pipeline. Se entregar 60+ delta nesse vertical, pipeline é REALMENTE vertical-agnostic.

---

## Apêndice — Cross-vertical pattern matrix

Patterns identificados que são **estruturalmente universais** vs **vertical-specific**:

| Pattern | Universal? | Vertical-specific instances |
|---|---|---|
| Hero close-up componente-do-ofício | ✅ UNIV | padaria crosta-pão / mecânica turbo / odonto sorriso-pós-tratamento? / marcenaria detalhe-junção? |
| Heritage stamp "Desde [ANO] em [BAIRRO]" | ✅ UNIV | trivial — todos verticais com >5 anos podem usar |
| WhatsApp button sticky com prefill | ✅ UNIV (mas prefill varia) | padaria livre conversational / mecânica marca+sintoma+foto / odonto sintoma+convênio / etc |
| Mapa embed + horário estruturado | ✅ UNIV | trivial |
| Schema LocalBusiness + subtype | ✅ UNIV (subtype varia) | Bakery / AutoRepair / Dentist / etc |
| 18px body min + 7:1 contrast AAA | ✅ UNIV | gate inclusive-design não-negociável todos verticais |
| Vitrine Sazonal rotativa | ❌ SPECIFIC | só verticais sazonalidade-forte (padaria sim, mecânica não) |
| Serviços por Sintoma (auto-diagnose grid) | ❌ SPECIFIC | mecânica, talvez clínica médica, NÃO padaria/moda |
| Equipe identificada nominalmente | ❌ SPECIFIC | B2B/serviços técnicos (mecânica/odonto/advocacia) — NÃO retail B2C aspiracional |
| Trust signal estrutural (certs grid) | ❌ SPECIFIC | mecânica/odonto/advocacia/financeiro — NÃO padaria/moda |
| Galeria categorizada por produto | ❌ SPECIFIC | padaria/moda/estética B2C aspiracional — NÃO mecânica/eletricista |
| Customer journey emotional/aspiracional | ❌ AXIS | padaria, moda, estética, beauty |
| Customer journey rational/utility | ❌ AXIS | mecânica, eletricista, encanador |
| Customer journey anxiety-driven | ❌ AXIS | odonto, médico, jurídico crítico, segurança |
| Customer journey status-driven | ❌ AXIS | luxury services, restoration, watchmaker |

**Insight:** patterns universais sustentam o **chassis** pipeline-wide. Patterns vertical-specific emergem da customer-journey-axis. Esse é o atom de variabilidade que **deve ser preserved** na production v1 — NÃO collapse em template.
