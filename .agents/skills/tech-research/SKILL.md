---
name: tech-research
description: Use whenever the user needs structured investigation before a decision — evaluating technologies, tools, frameworks, markets, competitors, regulations, scientific evidence, business opportunities, or any complex topic where multiple sources must be synthesized into an actionable recommendation. Trigger on phrases like "pesquisar sobre X", "tech research", "avaliar a viabilidade de Y", "comparar opções", "fazer due diligence", "mapear o mercado de Z", "research", "deep research", "investigar", "qual a melhor escolha entre A/B/C", "preciso entender X antes de decidir", or whenever the user is gathering evidence to support a build/buy/invest/architecture decision. Also use when the user has accumulated a raw corpus of sources (links, PDFs, papers, repos) that needs to be triaged, synthesized, and turned into structured knowledge. Do NOT use for simple factual lookups, single-source summaries, or conversational answers — this skill is for substantive multi-source investigations that drive decisions.
---

# Tech Research — método estruturado para investigação decisória

## Propósito

Transformar uma pergunta vaga em uma **recomendação acionável com evidência triangulada**, em qualquer área (tecnologia, mercado, ciência, regulatório, produto, financeiro). O método é dimensão-agnóstico: serve tanto para "qual stack de banco escolher" quanto para "vale a pena entrar no mercado de luxo X" ou "qual a evidência clínica para o tratamento Y".

A skill cobre o ciclo completo: pergunta → plano → coleta → síntese → revisão adversarial → entregável → roteamento downstream.

---

## Princípio central: decision-driven, não topic-driven

Toda research começa de trás para frente: **qual decisão será tomada com isso?** Se a resposta é "não sei", o trabalho ainda não está pronto para começar — é procrastinação intelectual disfarçada.

Antes de qualquer fonte ser consultada, três artefatos devem existir:

1. **A pergunta real** (não a de superfície), com restrições não-negociáveis explícitas
2. **A decisão pendente** que a research vai informar, com seu valor implícito (quanto custa errar)
3. **As hipóteses iniciais** do solicitante, registradas para serem testadas — incluindo a busca deliberada por evidência contrária

Sem esses três, não inicie a coleta. Volte para o solicitante.

---

## Workflow completo

A skill opera em 6 fases. Cada fase tem entrada, saída e gate de qualidade.

### Fase A — Estruturação

Antes de qualquer coleta:

- Aplicar 5 Whys sobre a pergunta inicial até chegar na pergunta real
- Listar restrições não-negociáveis (regulatórias, técnicas, financeiras, temporais, éticas, culturais)
- Definir o critério de sucesso da decisão (o que precisa ser verdade para a recomendação ser confiável?)
- Registrar hipóteses iniciais explicitamente
- Mapear dimensões relevantes (ver §Dimensões abaixo) — nem toda research precisa de todas as quatro
- Calibrar profundidade ao valor da decisão (decisão de 5 anos → 40h de research; decisão de uma semana → 2h)
- Produzir um **Plano de Pesquisa v1** com perguntas-mestre, dimensões, fontes-âncora previstas, critério de scoring, critério de parada

**Gate A:** plano revisado pelo solicitante antes de prosseguir. Se a skill estiver sendo executada autonomamente por um agente, o plano é apresentado para validação humana ou para um agente revisor.

Para o detalhe operacional desta fase, leia `references/phase-structuring.md`.

### Fase B — Coleta multidimensional

A coleta acontece em paralelo nas dimensões aplicáveis, com **uma frente isolada por dimensão** para evitar contaminação cruzada.

As quatro dimensões canônicas:

- **Técnico-arquitetural** — funciona? como funciona? em que condições quebra?
- **Científico-evidencial** — qual o peso da evidência? qual o nível na hierarquia (meta-análise → RCT → coorte → opinião)?
- **Regulatório-legal** — quais leis, normas, compliance se aplicam? quais são as implicações arquiteturais ou operacionais concretas?
- **Mercado-negócio** — quem joga, como, com que unit economics, onde estão os fracassos documentados?

**Nem toda research usa todas as quatro.** Uma decisão puramente técnica pode dispensar a dimensão científica. Uma análise de mercado pode dispensar a regulatória. A Fase A define quais entram.

Cada dimensão segue a mesma disciplina:
- Curadoria de fontes com scoring (autoridade, recência, relevância)
- Extração estruturada (claims, evidências, contra-evidências, limitações)
- Triangulação obrigatória para claims decisórios
- Documentação do que foi descartado e por quê

**Gate B:** cada frente entrega coleta bruta scoreada, com mínimo de fontes-âncora identificadas, antes de avançar para síntese.

Para o detalhe operacional de cada dimensão, leia as references aplicáveis em `references/`.

### Fase C — Síntese dialética

A parte que cria valor real. Aqui você não agrega fontes, você sintetiza conhecimento. Para cada decisão crítica:

- **Tese:** a posição mais forte a favor, com as melhores evidências
- **Antítese:** a posição mais forte contra, com as melhores evidências
- **Síntese:** conclusão informada, com condições explícitas de validade ("válida enquanto X; deve ser reavaliada se Y")

Para escolhas entre N alternativas, construir **matriz de decisão multicritério** com análise de sensibilidade (se o peso de um critério mudar 20%, a decisão muda? Esse é o eixo real da decisão).

Ao final, separar incógnitas residuais em:
- **Redutíveis** — mais research resolve (possivelmente em sub-ciclo)
- **Irredutíveis** — só validação empírica resolve (POC, MVP, experimento, beta)

Reconhecer incógnitas irredutíveis é maturidade epistêmica. A tentação é sempre ler mais um paper.

Para o detalhe operacional, leia `references/phase-synthesis.md`.

### Fase D — Adversarial review

Um revisor dedicado tenta **derrubar cada conclusão**. Mandato real, não cerimônia. Caça especificamente:

- Confirmation bias na seleção de fontes
- Claims sem triangulação adequada
- Alternativas descartadas sem justificativa registrada
- Hipóteses não-falsificáveis ("para cada conclusão, o que faria você mudar de ideia?")
- Fontes fracas suportando claims fortes
- Generalização indevida (evidência de domínio A aplicada ao domínio B)
- Recency bias e authority bias

**Gate D:** apenas conclusões que sobrevivem ao adversarial review entram no entregável final. As que caem voltam para a Fase C (refinamento) ou para a Fase B (mais coleta) ou são rebaixadas a hipóteses não-validadas.

Para o checklist completo do adversarial review, leia `references/adversarial-review.md`.

### Fase E — Entregável final

Documento consolidado com estrutura não-negociável:

1. Sumário executivo (1 página): pergunta, recomendação, três principais justificativas, três principais riscos
2. Contexto e escopo: o que estava em jogo, o que foi e não foi investigado
3. Metodologia: fontes consultadas, critérios de inclusão/exclusão, método de síntese, limitações
4. Findings por dimensão: cada dimensão aplicada, com evidências e citações
5. Análise dialética e matrizes: tese/antítese/síntese e matrizes multicritério com sensibilidade
6. Recomendações: rastreáveis a perguntas-mestre, com condições de validade
7. Riscos e mitigação: sinais de alerta antecipados
8. Incógnitas residuais: redutíveis vs irredutíveis, com plano de validação para as irredutíveis
9. Próximos passos acionáveis
10. Anexos: bibliografia anotada, queries usadas, alternativas descartadas com justificativa

O formato físico depende do contexto — markdown denso para fluxo de agentes, DOCX formal para deliverable, JSON estruturado para ingestão em sistemas de conhecimento. Use o template em `assets/deliverable-template.md` como ponto de partida.

### Fase F — Roteamento e ciclo de vida

Research que mora isolada não existe. Para cada conclusão:

- Definir data de validade estimada
- Definir gatilhos de reavaliação ("se X lançar v2", "se norma Y mudar", "se concorrente Z entrar")
- Rotear para os consumidores downstream (arquitetura, produto, GTM, knowledge base, decisões executivas)
- Versionar o documento (v1.0, incrementar em revisões; changelog explícito)

Quando a research alimenta um sistema de conhecimento estruturado (knowledge graph, vault, segunda-mente), atomizar findings em unidades discretas com linkagens cruzadas.

---

## Dimensões — quando aplicar cada uma

Cada dimensão tem uma reference dedicada com sinais de qualidade, hierarquia de fontes, e armadilhas específicas. Carregue só as que se aplicam.

| Dimensão | Quando aplicar | Reference |
|---|---|---|
| Técnico-arquitetural | Escolhas de stack, ferramentas, frameworks, build vs buy, viabilidade técnica | `references/dimension-technical.md` |
| Científico-evidencial | Claims de eficácia (saúde, educação, performance), produtos com pretensão científica, decisões baseadas em pesquisa acadêmica | `references/dimension-scientific.md` |
| Regulatório-legal | Produtos sob jurisdição (saúde, finanças, dados pessoais, infantil, alimentos), expansão geográfica, compliance | `references/dimension-regulatory.md` |
| Mercado-negócio | Decisões de entrada/saída de mercado, pricing, GTM, sizing, análise competitiva | `references/dimension-market.md` |

A maior parte das researches sérias usa **duas a três dimensões em cruzamento**. O insight raramente está dentro de uma dimensão isolada — está no atrito entre elas (ex: a tecnologia ideal tecnicamente é proibida regulatoriamente; o mercado existe mas a evidência científica não sustenta o claim).

---

## Critério universal de scoring de fontes

Cada fonte recebe três notas de 0 a 5:

- **Autoridade** — credenciais do autor/instituição, peer-review, reputação verificável no campo
- **Recência** — 0–12 meses = 5; 12–24 meses = 3; 24+ meses = 1 (exceto fundacionais clássicos do campo)
- **Relevância** — quão diretamente responde a pergunta específica do briefing

Score composto = média ponderada. Pesos sugeridos: relevância 50%, autoridade 30%, recência 20%. **Ajustar por dimensão:** para técnico, recência sobe; para científico, autoridade sobe; para regulatório, autoridade e recência empatam no topo.

**Fontes com score < 3 → descarte ou background apenas.**

### Triangulação obrigatória

Nenhuma claim decisória sobrevive em uma só fonte. Regra: três fontes **independentes** que convergem, ou divergência documentada explicitamente. Três blogs citando o mesmo paper original contam como uma fonte, não três.

Para sinais de qualidade por tipo de fonte (papers, repos, blogs, relatórios, reviews), leia `references/source-scoring.md`.

---

## Critério universal de parada

Para evitar loop infinito de coleta, cada sub-pergunta tem três gatilhos de saturação. Encerrar quando **qualquer um** for atingido:

1. **Saturação semântica:** 5 fontes consecutivas não trazem claim novo
2. **Cota atingida:** mínimo de fontes-âncora com score ≥ 4 (calibrar por dimensão; típico: 8–15 por pergunta-mestre)
3. **Timebox:** prazo definido na Fase A esgotado

Atingido o critério: **decidir com a informação que houver**. Documentar incógnitas residuais. A regra dos 70% se aplica — com 70% da informação ideal, a decisão geralmente já é viável; os 30% restantes têm rendimento marginal decrescente.

---

## Anti-padrões que matam research

Caçar ativamente durante todo o ciclo e reportar quando detectar:

- **Confirmation bias passivo** — consultar só fontes que concordam. Antídoto: cota mínima de fontes contrárias por dimensão.
- **Recency bias** — supervalorizar o que saiu ontem. Antídoto: cruzar com fontes de 2–3 anos para detectar moda vs sinal.
- **Authority bias** — aceitar acríticamente porque é lab de elite ou autor famoso. Antídoto: o argumento se sustenta pela evidência, não pelo logo.
- **Analysis paralysis** — research virar fim em si. Antídoto: timebox rígido + regra dos 70%.
- **Não-falsificabilidade** — conclusões tão genéricas que nada poderia contradizê-las. Antídoto: para cada conclusão, escrever explicitamente o que faria mudar de ideia.
- **Não documentar descartado** — daqui a 6 meses ninguém vai lembrar por que rejeitou a alternativa B. Registre.
- **Mistura de domínios** — somar evidência de "X em formato A" com "X em formato B" como se fossem o mesmo corpo. Mantenha-os separados até a síntese.
- **Reconstrução narrativa pós-fato** — escrever a conclusão antes da análise e selecionar evidências que a sustentam. Antídoto: ordem invertida — análise primeiro, conclusão emerge dela.

Para o checklist completo de anti-padrões com exemplos, leia `references/anti-patterns.md`.

---

## Calibração ao contexto

A skill é universal, mas o contexto manda. Antes de executar, identifique:

- **Valor da decisão:** alto valor justifica mais profundidade e mais dimensões; baixo valor justifica research enxuta
- **Velocidade vs rigor:** decisões reversíveis comportam menos rigor; decisões irreversíveis exigem mais
- **Stakeholders:** quem vai consumir o entregável? executivo precisa de sumário executivo curto; engenheiro precisa de evidência técnica densa
- **Ciclo de vida do conhecimento:** research one-off ou alimentação contínua de uma base de conhecimento?

A Fase A é onde essa calibração acontece.

---

## Quando esta skill NÃO é a ferramenta certa

- Lookup factual simples ("qual a capital de X")
- Resumo de uma única fonte ("resuma este artigo")
- Pergunta de opinião pura sem decisão associada
- Tarefa puramente operacional (escrever código, redigir email)
- Brainstorm criativo divergente (research é convergente; brainstorm é o oposto)

Se a pergunta cabe em uma busca rápida ou na sua memória, não invoque o método. O custo cognitivo do método só compensa quando a decisão é substantiva.

---

## Estrutura de arquivos da skill

```
tech-research/
├── SKILL.md (este arquivo — método e workflow)
├── references/
│   ├── phase-structuring.md       # Fase A em detalhe
│   ├── phase-synthesis.md         # Fase C em detalhe
│   ├── adversarial-review.md      # Fase D em detalhe
│   ├── dimension-technical.md     # Dimensão técnica
│   ├── dimension-scientific.md    # Dimensão científica
│   ├── dimension-regulatory.md    # Dimensão regulatória
│   ├── dimension-market.md        # Dimensão mercado
│   ├── source-scoring.md          # Scoring por tipo de fonte
│   └── anti-patterns.md           # Checklist de anti-padrões
└── assets/
    ├── deliverable-template.md    # Template do entregável final
    └── research-plan-template.md  # Template do Plano de Pesquisa v1
```

Carregue apenas as references aplicáveis ao caso atual — progressive disclosure mantém o contexto enxuto.
