# Rebrand v2 — Brainstorm Conclave

**Data:** 2026-05-16
**Facilitador:** Uma (@ux-design-expert)
**Modo:** Conclave virtual — perspectivas baseadas em research disponível + corpus público dos mind clones
**Objetivo:** Direcionar rebrand v2 do Anipis (sucessor da v1 03/Abr — Aurora Warm Coral + Nunito)
**Status:** Síntese pronta para handoff aos docs específicos (01-12)

---

## Contexto

O rebrand v1 (Aurora Warm Coral, 03/Abr/2026) está **divergente da implementação atual** (Teal #4A9BA8 + DM Sans no código vs Coral #E8764B + Nunito no brandbook). Sessão 27/Abr aprovou um v2 cujos docs sumiram. Esta v2 *retoma e refina* — não recomeça do zero. CFM ago/2026 + janela commercial pressionam por consolidação.

Esta sessão lê 8 perspectivas, cada uma com 2-3 ataques específicos ao estado atual + 1 contribuição construtiva. Síntese fecha no final.

---

## 1. Marty Neumeier — Brand Gap & Diferenciação Radical

> *"A brand is not what you say it is. It's what they say it is."*

**Diagnóstico:**
O Anipis tem um **brand gap** clássico — estratégia de marca (companion ético-clínico BR) está clara, mas a expressão visual é genérica wellness. Coral + sage + dourado é a paleta de 50% dos apps de meditação. Isso não é "Aurora Warm" — é **default-warm**.

**3 ataques:**
1. Diferenciação real exige **um** elemento ownable. Não 3, não 5 — UM. Headspace tem o círculo laranja. Calm tem o azul profundo. Anipis precisa de **um signature**.
2. O nome "Anipis" é forte (anima+elpis, único no mercado BR). Mas se trata como produto SaaS — "o app Anipis". Deveria tratar como **entidade** ("o Anipis", como você fala "o Google" ou "o Tinder"). Brandbook v1 acerta nisso §1.1 mas implementação não respeita.
3. Tagline "Um companheiro que te ouve, a qualquer hora" tem 49 caracteres + 2 vírgulas + uma quebra natural. **Não é estética. É funcional pra rádio/podcast**. Para BR funciona, mas falta uma **anti-tagline** — o que Anipis NÃO é. *"Não é terapeuta. É companheiro."* — 4 palavras, clarifica positioning.

**Contribuição construtiva:**
**ZAG framework** (extremo posicionamento via 17 perguntas): Anipis deveria responder em 1 frase "se eu fosse o único X no mundo, qual seria meu X?" → *"O único companheiro de IA brasileiro que sabe quando ficar quieto."* O **silêncio** (não responder no tempo de máquina, esperar 2-3s para responder, deixar usuário falar mais de uma mensagem) é radical em UX de chatbot e ownable.

---

## 2. Tobias van Schneider — Identidade & Atitude

> *"Brands are not built. They are felt."*

**Diagnóstico:**
A v1 do Anipis tem brandbook sólido mas **zero atitude visual**. Tudo é "suave", "gentil", "acolhedor" — palavras que descrevem 80% dos apps de wellness. Onde está o ponto de tensão? Onde está a opinião visual forte que faz alguém amar OU odiar?

**3 ataques:**
1. **Tipografia**: Nunito é a Comic Sans dos apps de wellness. Toda hora vejo Nunito em app de meditação. **General Sans** ou **PP Mori** seriam moves de atitude — sans-serif modernas com presença ownable.
2. **Imagery**: Brandbook §8.3 fala em "Unsplash filtrar por Brazilian + warm + natural" — isso é **buying generic**. Anipis precisa de **um sistema de ilustração proprietário**, não busca de fotos.
3. **Logo**: Brandbook §2.1 propõe "chama suave" — é uma das primeiras 5 ideias que qualquer designer terá pra um app que se chama "anima+elpis". **Anti-cliché test failed**.

**Contribuição construtiva:**
Direcionar v2 para **3 territórios distintos** e testar:
- **Mitológico** (chama-anima ressignificada, mas com construção geométrica precisa, não suave)
- **Arco aurora** (gradiente como gesture, não decoração — referência clara a "horizonte/elpis")
- **Forma respirando** (animação como brand element, logo em movimento — radical em UX, mas ownable)

E para tipografia: **General Sans** (Indian Type Foundry, free) — geométrica com calor sem ser rounded-baby como Nunito. Pair com **Inter** para body (manter).

---

## 3. Erik Spiekermann — Typography com Intenção

> *"Show me your type. That tells me everything I need to know."*

**Diagnóstico:**
Brandbook v1 trocou DM Sans por Nunito — substituiu uma escolha utilitária por outra (rounded é decoração de calor, não intenção). Para um produto que **lida com vulnerabilidade adulta**, tipografia infantilizada é falsa empatia.

**3 ataques:**
1. **Nunito** carrega bagagem de "education apps for kids" + "gym wellness". Adultos em crise não querem ser tratados como crianças.
2. **Hierarquia tipográfica** v1 está fraca — escala 1.25 (major third) é correta, mas **falta um momento serif**. Toda interface dura precisa de **um** elemento serif para humanizar (think: editorial pull-quotes).
3. **Line-height de 1.6 para body** é OK, mas o brandbook esqueceu **tracking**. Heading em sans deve ter tracking negativo levíssimo (-0.01em a -0.02em) para refinamento óptico.

**Contribuição construtiva:**
**3-font system** (não 2):
- **General Sans** (headings) — substitui Nunito, mais adulto, mesma feeling de calor sem infantilização
- **Inter** (body) — manter, é o standard de UI
- **Fraunces Italic** (pull-quotes, momentos editoriais) — quando o Anipis "diz" algo importante, vira italic serif. Cria momento. Usar ESCASSAMENTE (5-10% das telas).

Scale recomendada (clamp fluido):
```
display: clamp(2.25rem, 1.5rem + 3vw, 3.5rem)
h1: clamp(1.75rem, 1.3rem + 2vw, 2.5rem)
h2: clamp(1.5rem, 1.2rem + 1.2vw, 2rem)
body: clamp(1rem, 0.95rem + 0.2vw, 1.125rem)
small: 0.875rem (não fluido)
```

---

## 4. Dieter Rams — 10 Princípios Aplicados

> *"Weniger, aber besser." (Less but better)*

**Diagnóstico:**
Brandbook v1 é detalhista (130 tokens!) mas **não é minimalista — é farto**. Há 4 níveis de border-radius, 5 níveis de shadow, 3 paletas de cor + acentos + mood + crisis = 30+ cores nomeadas. Isso não é restraint, é catálogo.

**3 ataques:**
1. **Border-radius**: 8 valores tokenizados. Realmente preciso? Recomendação: **3 valores** apenas (sm 8px / md 16px / full pill). `--radius-wellness` 20px e `--radius-bubble` 20px são idênticos — duplicação.
2. **Shadows**: 5 valores. Para um produto que se quer minimalista, **2 valores** bastam (soft / elevated) + focus ring.
3. **Cores semânticas + crise + mood**: total 21 tokens com significado. Crisis-orange tem mesmo hex que mood-2 — sobreposição perigosa. Mood-3 e crisis-yellow têm mesmo hex `#D4960C` — ainda mais perigoso (confusão de "neutro" com "atenção").

**Contribuição construtiva:**
**Reduction matrix** para v2:
- Border-radius: 8 → 3
- Shadows: 5 → 2 (+ focus)
- Cores brand: 10 primary shades → 5 (50/100/300/500/700)
- Mood vs Crisis colors: **NÃO compartilhar hex**. Mood usa paleta própria mais dessaturada. Crisis usa paleta sat. Documentar separação como regra absoluta.
- Total tokens: 130 → ~70

Princípio: cada token que sobrevive deve ser **excelente**.

---

## 5. Don Norman — Modelo Conceitual & 3 Níveis

> *"Good design is invisible. Bad design is everywhere."*

**Diagnóstico:**
Modelo conceitual do Anipis v1 está confuso: é app, é companion, é serviço, é espaço? Brandbook fala "tratar como entidade" mas UI vira widget. **Quando user abre, o que ele entende que isso é?**

**3 ataques:**
1. **Visceral nível**: First-paint do app v1 é tela de login com formulário — **fracasso visceral**. Deveria ser orbe respirando + uma frase humana.
2. **Comportamental**: Mood scale com 5 botões discretos é **categoria forçada**. Emoções humanas são contínuas, não discretas. **Slider contínuo** comunica melhor a natureza da experiência.
3. **Reflexivo**: Nenhum user vai dizer "eu uso o Anipis" com identidade ligada. Falta um **ritual visual** — Finch tem "meu pet cresceu hoje", Calm tem "minha sequência de dias dormindo bem". Anipis precisa do equivalente sem ser gamificação coerciva.

**Contribuição construtiva:**
**Metáfora central única**: Anipis é **espaço-companheiro** (não app). Cada tela responde:
- "Estou em um lugar?" (background generative respirando, não tela branca)
- "Há alguém aqui?" (orbe sempre presente, mesmo em settings)
- "Posso sair quando quiser?" (botão "Falar com pessoa real" sempre visível)

Ritual reflexivo proposto: **Caixinha de Cartas** — ao final de cada sessão, Anipis "escreve uma carta curta" (1 frase) que fica guardada. User pode revisitar suas cartas em momentos difíceis. Não é gamificação — é continuidade emocional.

---

## 6. Refika Anadol — Generative as Identity

> *"Data has dreams. Let us make them visible."*

**Diagnóstico:**
A v1 trata cor como decoração estática. Mas o Anipis tem **dados emocionais únicos** de cada user — esses dados são pigmento. Está sendo desperdiçado.

**3 ataques:**
1. Background do chat é cor sólida. Deveria ser **generative subtle** (Perlin noise 0.5Hz, opacity 0.02) — quase imperceptível, mas presente. "O espaço respira."
2. Orbe do companion é estático ou faz fade básico. Deveria ser **flow field reactive** — quando user digita, orbe pulsa. Quando Anipis "pensa", expande. Sincronizado com respiração humana (6 ciclos/min ~ 10s).
3. Mood não tem visualização longitudinal **estética**. Charts atuais são bar-chart Recharts genéricos. **Mood garden** generativo — cada entrada de humor adiciona um "elemento" ao jardim único do user. Visualização ownable.

**Contribuição construtiva:**
**3 generative elements** para v2:
- **Background ambient** (chat + onboarding): Perlin noise + mood-aware palette shift. <2ms/frame mobile.
- **Companion orb** (presença persistente): SVG + Canvas, breathing 8s, reactive ao input.
- **Mood landscape** (analytics view): cada mood vira "pixel" em paisagem generativa única. NUNCA random — sempre data-driven.

Fallback: prefers-reduced-motion → todas viram estáticas. Devices low-end → 5 capturas pré-renderizadas (uma por mood level).

---

## 7. Rafael Calvo — Ética em Tech para Wellbeing

> *"Technology that pretends to care must actually care."*

**Diagnóstico:**
Brandbook v1 fala em "Acolhimento, Segurança, Acessibilidade, Autonomia, Presença" como valores. Mas **acolhimento pode virar dependência tóxica** se design otimiza engagement sobre wellbeing. Apps de SM são particularmente sujeitos a esse falso-positivismo.

**3 ataques:**
1. **Streaks visíveis** são dark pattern. Em app de SM = trauma para quem falha. Brandbook não menciona streaks, mas implementação atual tem.
2. **Push notifications "como você está hoje?"** parecem cuidado mas são interruption-driven engagement. Para user em pico de ansiedade, push errada amplifica.
3. **Mood logging diário** como nudge constante = surveillance emocional. Healthy seria opt-in real (não dark-pattern opt-in) + frequency adjustable.

**Contribuição construtiva:**
**Ethical UX charter** para v2 (10 commandments):
1. Zero streaks visíveis (logging interno OK)
2. Zero push proactive primeiros 14 dias
3. Default frequency: never (user ativa se quiser)
4. Memory toggle OFF default primeiros 7 dias
5. Export/delete em ≤2 cliques sempre
6. Pause feature visível ("vou dar um tempo, volto quando quiser")
7. "Falar com pessoa real" sempre 1 clique no header
8. Disclaimer compacto SEMPRE visível no chat
9. Crisis fast-path sem confirmação dupla
10. Telemetria opt-in granular (não bundled consent)

Essa charter vira **gate de PR** (legal + product review obrigatórios).

---

## 8. Donald Miller — StoryBrand Framework

> *"Customers don't buy the best products. They buy the products they can understand the fastest."*

**Diagnóstico:**
LP do Anipis precisa contar uma **história em 7 elementos** (Character / Problem / Guide / Plan / CTA / Success / Failure). Hoje LP é feature list + benefits. Não há narrativa, não há identificação.

**3 ataques:**
1. **Character**: LP atual não tem persona clara no hero. Júlia (24, ansiosa, Recife) deveria estar no hero — "para você que..." específico, não genérico.
2. **Plan**: 3 passos hoje são "Cadastre / Converse / Sinta-se melhor". Genérico. Plan deveria ser **descobrir + confiar + voltar** com promessa específica em cada.
3. **Failure**: LP não menciona o que acontece se user **não** usar. Story sem stakes é fraca. *"Sem apoio acessível, 4h da manhã vira eternidade."* — failure side.

**Contribuição construtiva:**
**LP v2 hero hierarchy**:
```
H1: "Pra você que precisa de alguém às 4h da manhã."
H2: Apoio emocional brasileiro, IA, R$29,90/mês. Não é terapeuta.
CTA1: Conversar agora (free trial 7 dias)
CTA2 (ghost): O que é isso?
```

Plan (How it works) — 3 passos:
1. **Descubra** (sem pressão, sem cadastro pra primeira conversa)
2. **Conte do seu jeito** (texto, voz, no seu tempo)
3. **Volte quando precisar** (sem cobrança de engagement, memória opt-in)

Failure side (CTA final): *"Esperar a próxima consulta. Aguentar mais uma 4h da manhã sozinho. Continuar fingindo que tá tudo bem."*

---

## 9. John Maeda — 10 Laws of Simplicity

> *"Simplicity is about subtracting the obvious and adding the meaningful."*

**Diagnóstico:**
Brandbook v1 confunde **simplicidade visual** com **simplicidade real**. Layout limpo, mas decisões complexas (4 raios, 5 sombras, 2 paletas, 3 acentos). Internamente é caos.

**3 ataques:**
1. **REDUCE** — reduzir o que? V1 reduziu personalidade, não complexidade.
2. **ORGANIZE** — paletas não têm hierarquia clara. Quando usar Aurora vs Serene vs Luz? Brandbook tenta mas não convence.
3. **EMOTION** — mais emoção, não menos. Mood colors são as únicas coisas emocionais e estão escondidas em variáveis CSS.

**Contribuição construtiva:**
**SHE framework para v2**:
- **S**hrink: cada decisão deve subtrair *algo* (token, variant, breakpoint)
- **H**ide: complexidade que sobra deve ser progressively disclosed (settings advanced)
- **E**mbody: estética deve transbordar a função (orbe respirando é função embodied)

Aplicar a cada componente como gate: "esse componente shrinks? hides? embodies?"

---

## 10. SÍNTESE — Direção Unificada Rebrand v2

Após 9 perspectivas, emergem **10 decisões consolidadas** que orientam todos os outros docs.

### Tier S — Mudanças estruturais

| # | Decisão | Owner doc |
|---|---------|-----------|
| **S1** | **Tipografia**: General Sans (heading) + Inter (body) + Fraunces Italic (pull-quotes, raro) | `03-TYPOGRAPHY.md` |
| **S2** | **Multi-theme**: Warm (Aurora Coral default) / Calm (Sage primary) / Soft (Lavender accent). User pode escolher. Default Warm para diferenciação de mercado. | `02-COLOR-SYSTEM.md` |
| **S3** | **Logo: 3 direções para test** (Mythological / Aurora Arc / Breathing Form) — escolha final user | `01-LOGO-DIRECTIONS.md` |
| **S4** | **Motion = brand element**: 5 motion principles (breathing / gentle / never-anxious / attentive / deliberate). Orbe respirando é signature ownable. | `05-MOTION-PRINCIPLES.md` |
| **S5** | **Ethical UX Charter** como gate de produto (10 commandments Calvo) | `07-VOICE-REFINED.md` + integrado em todo brandbook |

### Tier A — Refinamentos importantes

| # | Decisão | Owner doc |
|---|---------|-----------|
| **A1** | Redução tokens 130 → 70 (3 radius, 2 shadows + focus, 5 brand shades) | `09-TOKENS-DRAFT.md` |
| **A2** | Mood colors SEPARADAS de crisis colors — zero overlap de hex | `02-COLOR-SYSTEM.md` |
| **A3** | Iconography: Phosphor base + 4 custom (anipis-flame, breath, companion, bridge) | `04-ICONOGRAPHY.md` |
| **A4** | Illustration tier 1: custom hand-drawn warm minimal (sem stock photos) | `06-ILLUSTRATION-PHOTO.md` |
| **A5** | Voice refinement: "você" não "tu/vc/ceh", primeira pessoa do Anipis, anti-positividade tóxica reforçada | `07-VOICE-REFINED.md` |

### Tier B — Decisões abertas (esperam user)

| # | Pergunta | Default proposto |
|---|----------|------------------|
| **B1** | Logo direction final entre D1/D2/D3? | D3 Breathing Form (alinha com motion principle) |
| **B2** | Theme switcher MVP ou v2.1? | MVP (incremento marginal de complexidade, retorno de retenção alto para Júlia + Marcos) |
| **B3** | Fraunces Italic confirmada ou usar só General Sans? | Confirmada (uso 5-10% das telas, momentos editoriais) |
| **B4** | "Caixinha de Cartas" feature (Don Norman) — MVP ou roadmap? | Roadmap fase 2 (validar antes com user research) |
| **B5** | Re-render visual D2 ou D3 com Flux após escolha logo? | Aguardar D-UX-01 (decisão user) — custos Flux só após aprovação |

---

## Output deste brainstorm

Esta síntese vira **especificação canonical** para os docs 01-12 do rebrand v2. Cada doc subsequente referencia esta síntese e implementa Tier S / Tier A em detalhe técnico. Tier B vai pra `11-DECISIONS-LOG.md` como decisões pendentes.

**Trigger user pra fechar:** *"aceito direção rebrand v2"* — destrava produção de tokens-v2.css + Figma update + logo direction final.

---

*Conclave realizado em 2026-05-16 por Uma — perspectivas simuladas baseadas em corpus público dos mind clones e research disponível em `apps/serenity-ai/docs/research/`.*
