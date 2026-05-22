# Eric Ries — Learning & Pivot Framework for Concierge MVP Anipis

**Agente:** eric-ries
**Squad:** 16/Mai — Concierge MVP Anipis (Sprint -1)
**Contribuição:** 2 de 2 — Learning & Pivot Framework operacional
**Data:** 16/Mai/2026

---

Here's the thing — quando o conclave me chamou de volta, eu sabia que tinha mais a dizer. Métricas o analytics-agent já cuidou. Mas métrica sem framework de aprendizado é uma bússola que aponta pra qualquer direção e parece sempre estar funcionando — vanity metrics em forma de dashboard bonito. Eu vi isso na IMVU, eu vi isso na There.com (onde gastamos cinco anos construindo um mundo virtual antes de descobrir que ninguém queria nosso mundo virtual), e eu vou ver isso de novo no Concierge Anipis se a gente não montar o sistema de aprendizado **antes** de rodar o experimento.

Então vamos pelo que importa: **how we learn**, não o que medimos.

---

## 1. The Riskiest Assumption — qual é a hipótese mais arriscada?

A maioria das pessoas vai me dizer que a hipótese mais arriscada do Concierge é **"Júlia volta no dia 3"**. Elas estão erradas. Isso é uma **métrica**, não uma hipótese. A métrica é o instrumento; a hipótese é o que o instrumento testa.

Aqui está a stack real de assumptions abaixo da retenção D+7 ≥35%, ordenada da MENOS arriscada (já validada por research) pra MAIS arriscada (faith-based até as Júlias mostrarem):

| # | Layer | Assumption | Quão arriscada? | Como Concierge testa? |
|---|-------|------------|-----------------|----------------------|
| 1 | **Motivation** | Júlia 18-29 com PHQ-9 5-14 quer ativamente reduzir ansiedade/sintomas depressivos | Baixa (validada por literatura) | Conversion da landing pra signup |
| 2 | **Ability** | Júlia consegue usar um companion conversacional async em WhatsApp sem fricção técnica | Baixa-Média | Drop-off no onboarding D0 |
| 3 | **Fit** | A interação Concierge (3 facilitadoras humanas + scripts estruturados) endereça o problema que Júlia ACHA que tem | Média-Alta | Qualitativo D+3, D+7, D+14 |
| 4 | **Trust** | Júlia confia o suficiente num produto sem registro CFM/SaMD pra compartilhar estado emocional vulnerável | **ALTA** | Depth of disclosure por sessão |
| 5 | **Value** ⚠️ | Júlia percebe valor único que não consegue de Cara (a amiga), terapeuta atual, ChatGPT, ou Calm/Headspace — e esse valor é **suficiente pra mudar comportamento** | **A MAIS ALTA** | **Behavior return D+7 + qualitativo "o que mudou"** |

**The riskiest assumption is Layer 5: Value.** Não retenção como número — retenção como **proxy comportamental de valor percebido único e suficiente**.

Aqui está o ponto contraintuitivo: se a gente atinge D+7 ≥35% mas as Júlias descrevem o Concierge como "tipo um ChatGPT mais simpático" ou "tipo a Cara que sempre responde", a gente **falhou** a hipótese mesmo passando a métrica. Por quê? Porque o valor não é defensible — não é único, não é suficiente pra justificar pivot pra um produto regulado pós-CFM. Vanity metric disfarçado de actionable.

A hipótese de valor real que Concierge testa, em formato falsificável:

> "Júlias 18-29 com PHQ-9 5-14, após 14 dias de Concierge async-first em WhatsApp com 3 facilitadoras humanas, vão (a) retornar ≥35% no D+7 sem prompt, (b) descrever o valor recebido em termos que não são substituíveis por amiga/terapeuta/ChatGPT genérico, e (c) mostrar redução PHQ-9 ≥2 pontos no D+14."

Falsifiable. Específico. Cliente real. Comportamento real. Não opinião.

---

## 2. Three Pivot Types possíveis pós-D14 (com triggers numéricos)

Pivot é **structured course correction**, não failure. Como rocket ship corrigindo curso pra lua — não voa reto, ajusta continuamente. Aqui estão os 3 pivots que eu mantenho carregados na mira pra D+14:

### Pivot A — **Zoom-in pivot (feature subset)**
**Quando:** Retenção D+7 entre 35-50% (passou o gate, mas no limite) **+ uma sub-feature do Concierge tem retenção significativamente maior** que a média.

**Trigger numérico:**
- D+7 retention: 35-50%
- Sub-feature instrumentada (ex: "check-in matinal estruturado", "diário de gratidão guiado", "intervenção crise — facilitadora humana on-demand") tem retention >65% entre quem usou pelo menos 2x
- N≥6 Júlias no segmento da sub-feature

**Ação:** Sprint 1 reduz o produto pra **essa sub-feature como produto inteiro**. Cortar tudo o resto. O que era uma feature do MVP vira o MVP.

**Exemplo aplicado:** Se 8 das 20 Júlias engajam profundamente com "check-in matinal" e retornam D+7 a 70%, mas as outras 12 usam genericamente e retornam a 25%, o produto não é "companion conversacional" — o produto é "check-in matinal estruturado com facilitadora humana". Zoom-in.

---

### Pivot B — **Customer segment pivot**
**Quando:** Retenção D+7 ≥35% global, mas há **gap significativo entre sub-segmentos** de idade ou contexto.

**Trigger numérico:**
- Júlias 18-22 (n≥8): D+7 retention <25%
- Júlias 25-29 (n≥8): D+7 retention >55%
- Delta entre grupos ≥30pp

**Ação:** Sprint 1 reposiciona produto pra Júlia 25-29 (early career, ansiedade laboral). Não é "expandir mercado depois" — é **estreitar agora**. O segmento que não retém **não é teu cliente**, mesmo que demograficamente parecesse. Steve Blank chama isso de customer pivot. Eu chamo de "evidence over wishful thinking".

**Caveat crítico:** Se o gap for inverso (18-22 retém, 25-29 não), pode indicar que produto endereça vulnerabilidade aguda (universidade, primeiro emprego) e não ansiedade laboral. Mesmo pivot mecânico, persona diferente, **GTM completamente diferente** pós-CFM ago/26.

---

### Pivot C — **Technology pivot (outcome substitution)**
**Quando:** Retenção D+7 OK (≥35%) **MAS** delta PHQ-9 D+14 ruim (<1pt redução) ou neutro.

**Trigger numérico:**
- D+7 retention ≥35%
- D+14 PHQ-9 delta médio: <1 ponto OR n com delta ≥2 pts ≤30%
- Qualitativo: Júlias dizem "gostei" mas "não mudou nada"

**Ação:** Produto entrega **engajamento sem outcome clínico**. Isso é o pior cenário disfarçado — vanity metric (engagement) sem actionable metric (clinical outcome). Como compass que sempre aponta pra algum lugar mas nunca pro norte.

Pivot pra: trocar mecânica core do companion (async-first chat → talvez intervenção estruturada CBT digital de 4 semanas; ou peer-support facilitado em vez de 1-on-1; ou screening + handoff humano pago em vez de companion contínuo). **O canal pode ser o mesmo (WhatsApp). A intervenção muda.**

Esse é o pivot que ninguém quer fazer porque dói. Mas é o único que respeita a missão: se a gente vai pedir certificação CFM 2.454/2026, melhor mover ponteiro clínico.

---

## 3. Three ZOOM-OUT Antipatterns — pivots a NÃO fazer pós-D14

A maioria dos founders, quando bate em D+14 sem clareza, faz exatamente o oposto do que deveria. Os três pivôs que eu **vetaria explicitamente** pra Anipis pós-Concierge:

### Antipattern 1 — **"Mais features" pivot (premature scaling de escopo)**
"Retenção tá em 30%, vamos adicionar gamificação, streaks, badges, comunidade peer."

**Por que não:** Adicionar feature antes de validar valor é colocar mais água num balde furado. Se Júlia não retém com o core, não é o badge que vai segurar. Mais features = mais waste = mais código pra manter pós-CFM (compliance overhead exponencial). Você ainda não sabe **qual** feature core entrega valor — adicionar mais cinco features só dilui o sinal experimental.

**A pergunta certa não é "que feature falta?". É "que parte do que já tem ENTREGA valor mensurável?".**

---

### Antipattern 2 — **"Mais segmentos" pivot (loss of focus)**
"Júlia 18-29 não rolou bem. Vamos abrir pra 30-45, pra homens, pra adolescentes 13-17."

**Por que não:** Em condições de extrema incerteza, ampliar superfície de hipótese **dilui aprendizado** em vez de multiplicar. Se 20 Júlias não validam, 20 Júlias + 20 Sandras + 20 Pedros vão te dar 60 conversas confusas, não 3x mais aprendizado. Adolescente 13-17 especificamente adiciona regulatório (ECA, consentimento parental, SaMD pediátrico — outro mundo) num momento em que você ainda não validou adult. Toyota não otimiza dois modelos de carro ao mesmo tempo no kaizen — um por vez.

**Single-piece flow vence batch every time.**

---

### Antipattern 3 — **"Mais facilitadoras" pivot (scale before learn)**
"Engajamento bom em 20 Júlias, vamos contratar mais 7 facilitadoras pra rodar 100 Júlias e provar escalabilidade."

**Por que não:** Isso é literalmente o que matou There.com. Você prova que **algo funciona em pequena escala manual** e imediatamente quer provar que escala. Mas o que tornava funcional era o atendimento manual heroico — o que **não vai escalar é exatamente o que estava funcionando**. Você ainda não tem dados de qual parte do atendimento facilitadora é o ingrediente ativo. Escalar antes de identificar ingrediente ativo = burning runway buying noise.

**A regra: nunca escale o que ainda não destilou.**

---

## 4. Validated Learning Checklist — 8 perguntas binárias pós-D14

Pós-Day 14, founder solo se senta com as 20 transcrições, dados de retenção, PHQ-9 deltas, e responde estas 8 perguntas com **YES/NO honestos** (não "kinda", não "depende"). Sprint 1 só destrava se ≥6 YES, com YES obrigatório em #1, #4, #5, #8.

1. **[OBRIGATÓRIO]** Pelo menos 7 das 20 Júlias descreveram o valor do Concierge **sem prompting** em termos que NÃO são substituíveis por (a) amiga, (b) terapeuta, (c) ChatGPT, (d) Calm/Headspace?
2. Pelo menos 6 Júlias retornaram entre D+3 e D+7 **sem nudge ativo** das facilitadoras (organic return)?
3. Pelo menos 4 Júlias mencionaram espontaneamente algum **comportamento concreto fora do produto** que mudou (ex: "comecei a fazer X que não fazia")?
4. **[OBRIGATÓRIO]** Pelo menos 5 Júlias responderam YES a "Você recomendaria pra uma amiga na mesma situação?" — e conseguem **nomear a amiga específica**?
5. **[OBRIGATÓRIO]** Delta médio PHQ-9 do grupo é ≥1.5 pontos no D+14, com ≥30% das Júlias mostrando delta ≥2pts (minimum clinically important difference)?
6. Você consegue articular em uma frase **qual é o ingrediente ativo** do Concierge (não "o conjunto todo" — qual mecanismo específico)?
7. Clinical advisor revisou ≥30% das transcrições e **não levantou red flag** clínico ou ético material?
8. **[OBRIGATÓRIO]** Você consegue desenhar a **versão produto** do Concierge — qual parte vira automação, qual fica humana, qual sai — com confiança suficiente pra escrever PRD Sprint 1?

**Resultado:**
- ≥6 YES incluindo todos os obrigatórios → **Persevere**, escreve PRD Sprint 1
- 4-5 YES OU falta algum obrigatório → **Pivot** (consulta seção 2 acima pra qual tipo)
- ≤3 YES → **Kill ou Wait** (CFM ago/26 não justifica forçar)

---

## 5. Cinco Vanity Metrics a EVITAR no relatório D+14

Eu vi todas essas vezes demais. Se o relatório D+14 destacar qualquer uma destas como prova de progresso, founder está se enganando:

1. **"Total de mensagens trocadas"** — Compass que sempre sobe. Não diz se valor está sendo entregue, diz só que tráfico aconteceu. Substitua por: **mensagens por Júlia ativa por sessão, com curva de profundidade**.
2. **"NPS médio do grupo"** — Aggregated NPS em N=20 é estatisticamente sem sentido e emocionalmente manipulado (Júlia gosta da facilitadora ≠ produto entrega valor). Substitua por: **% que nomeia amiga específica pra indicar + transcrição da indicação**.
3. **"Tempo médio gasto no produto"** — Engagement bruto = balde furado disfarçado de oceano. Substitua por: **retenção D+7 por cohort de comportamento ativador**.
4. **"% de Júlias que disseram 'gostei'"** — Politeness bias em ambiente clínico vulnerável é gigantesco. O que cliente diz ≠ o que cliente faz. Substitua por: **% que retornou sem prompt + % que indicou + delta PHQ-9**.
5. **"Crescimento orgânico durante o piloto"** (se alguma Júlia trouxe amiga) — Em N=20 piloto, isso é anedota com viés massivo, não engine of growth signal. Substitua por: **medir engine of growth só pós-Sprint 1 com pelo menos 100 cohort**.

---

## 6. Go/Pivot/Kill Matrix — quadrante por D+7 × PHQ-9 delta

| | **PHQ-9 delta D+14 ≥1.5pts** | **PHQ-9 delta D+14 <1.5pts** |
|---|------------------------------|------------------------------|
| **D+7 retention ≥35%** | **GO — Sprint 1 com confidence.** Você tem engagement E outcome. Valida hipótese de valor real. Próximo: PRD Sprint 1 + spec de produto.  | **PIVOT C (Technology).** Engagement sem outcome = vanity engagement. Você prendeu atenção sem mover clínica. Trocar mecânica core. |
| **D+7 retention <35%** | **PIVOT A ou B.** Algo está funcionando profundamente pra uma sub-população OU sub-feature. Investiga zoom-in (feature) ou segment (persona). Não escala — destila. | **KILL ou WAIT.** Nem engagement nem outcome. Forçar Sprint 1 = burning runway. Opções: (a) Kill projeto e devolver tempo a Tocks/Bretda/CRM, (b) Wait — refazer Concierge com mecânica completamente diferente (intervenção CBT estruturada 4 semanas em vez de companion async). Decisão é do founder, mas evidência aponta pra reset. |

**Note:** Eu não tô recomendando "kill se gate falhar". Tô recomendando **proportional response baseada em qual quadrante a falha cai**. Falha por outcome ≠ falha por engagement ≠ falha por ambos. O que você faz a seguir é diferente em cada um.

---

## 7. The Five Whys post-D14 (template aplicado se gate FALHAR)

Quando founder vier dizer "Júlia não voltou", a resposta NÃO é "tenta de novo com mais features". A resposta é: vamos 5 níveis fundo, com investimento **proporcional** em cada nível. Toyota Production System, Taiichi Ohno, primeira coisa que se aprende.

Template prático aplicado:

**Sintoma:** D+7 retention foi 22%, não 35%. Júlias não voltaram.

**Why 1:** Por que Júlias não voltaram entre D+3 e D+7?
→ Hipótese a investigar: provavelmente não perceberam diferenciação suficiente vs. outras opções (amiga, ChatGPT, app meditação que já tinham).
**Proportional fix:** Revisar transcrições D+1 e D+2 pra identificar momento de desengajamento (4h founder).

**Why 2:** Por que não perceberam diferenciação?
→ Hipótese: facilitadoras não estavam executando o que tornaria Concierge único (ex: profundidade clínica, conexão humana) — estavam executando como suporte genérico simpático.
**Proportional fix:** Audit das interações por clinical advisor — identificar gap entre script e execução real (1 dia clinical advisor + 4h founder).

**Why 3:** Por que facilitadoras não executavam o que tornaria único?
→ Hipótese: scripts e treinamento Sprint -1 não eram operacionalmente específicos o suficiente — diziam "seja empática" sem **dar a técnica específica que diferencia**.
**Proportional fix:** Reescrever scripts pra técnicas nomeadas concretas (ex: validação afetiva específica de Linehan, não "empatia" genérica). 2 dias founder + clinical advisor.

**Why 4:** Por que scripts não foram operacionalmente específicos?
→ Hipótese: founder solo não tem expertise clínica profunda; clinical advisor entrou tarde no design dos scripts ou só revisou de longe.
**Proportional fix:** Mudar relação com clinical advisor — de "advisor revisor" para **co-designer dos protocolos**. Re-contratar com horas dedicadas, não consultivas (3 dias setup + 5 horas/semana ongoing).

**Why 5:** Por que clinical advisor entrou tarde?
→ Hipótese: founder priorizou velocidade de lançar Concierge sobre rigor clínico do design — assumindo que iteração rápida resolveria depois.
**Proportional fix sistêmico:** Estabelecer regra permanente — **nenhum protocolo de intervenção entra em campo sem co-design clinical advisor desde dia 0**. Isso vira política do projeto, não preferência (1 dia documentação + protocolo).

**Root cause:** Velocidade priorizada sobre rigor clínico no design **sistematicamente** subprovisiona a expertise que diferencia produto regulado mental health de qualquer chatbot genérico. Concierge falhou não por execução, falhou por design upstream que tratou ingrediente ativo (clinical depth) como afterthought.

**Be tolerant of all mistakes the first time. Never allow the same mistake to occur twice.** Proportional investment em cada nível — não joga 6 meses de redesign no primeiro why, não joga 0 esforço no quinto. Cada why tem custo proporcional ao impacto sistêmico.

---

## Closing

Olha, vou ser direto. O Concierge Anipis tem mais sinal positivo de validated learning potential do que 80% das coisas que eu vejo em pre-revenue health-tech. Founder solo + 14 dias + 20 Júlias + clinical advisor + gate numérico declarado upfront + janela CFM clara = isso é entrepreneurial management aplicado, não faith-based method.

Mas o gate número (35% D+7) **não é o aprendizado**. O gate é o instrumento que **dispara** o aprendizado. O aprendizado real está nas 8 perguntas binárias da seção 4, na matriz da seção 6, e na disciplina de aplicar Five Whys da seção 7 quando algo falha — em vez de buscar refúgio em mais features ou mais facilitadoras.

Runway não é dinheiro. Runway é **número de ciclos de aprendizado restantes antes de CFM ago/26**. Cada ciclo Concierge mal-projetado queima dois meses de janela. Você tem espaço pra 2 ciclos, no máximo 3. Faça cada um conta.

— Eric, transformando incerteza em aprendizado validado 🔬
