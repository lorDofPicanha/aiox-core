# Fase A — Estruturação em detalhe

Esta fase é onde a research é ganha ou perdida. 80% do retorno vem do trabalho feito aqui, antes de qualquer fonte ser consultada.

## 1. Chegando na pergunta real

A pergunta inicial do solicitante quase nunca é a pergunta certa. Aplique **5 Whys** para descer da superfície ao substrato:

**Exemplo:**
- Pergunta inicial: "Quero pesquisar sobre frameworks de UI."
- Why 1: Para escolher um para o novo produto.
- Why 2: Porque o produto precisa de interface rica e responsiva.
- Why 3: Porque vai ser usado em desktop e mobile por usuários simultâneos.
- Why 4: Porque tem componente de colaboração em tempo real.
- Why 5: Porque a proposta de valor é "trabalho compartilhado sem fricção".

**Pergunta real:** "Qual framework de UI sustenta colaboração em tempo real cross-device com baixa fricção de sincronização, para um time pequeno construir e manter em 18 meses?"

A pergunta real tem restrições embutidas que filtram 80% das fontes que a pergunta inicial atrairia.

## 2. Restrições não-negociáveis

Liste tudo que **não pode** ser violado. Categorias típicas:

- **Técnicas:** stack existente, integrações obrigatórias, escala, latência, custo de infra
- **Regulatórias:** leis aplicáveis, normas setoriais, certificações exigidas
- **Financeiras:** orçamento, runway, unit economics mínimos viáveis
- **Temporais:** deadline, janela de oportunidade, dependências de outros projetos
- **Éticas/culturais:** princípios da empresa, sensibilidade do público, contexto cultural
- **Recursos:** tamanho do time, expertise disponível, dependências externas

Restrição não-negociável aparece como filtro absoluto na seleção de alternativas. Se uma opção viola, é descartada antes da análise — não importa se é tecnicamente superior.

## 3. Decisão pendente e valor implícito

Toda research justifica seu custo pela decisão que vai informar. Documente:

- **Qual decisão será tomada?** (build vs buy, A vs B vs C, entrar vs não entrar, agora vs depois)
- **Quem decide?** (você, o time, board, cliente)
- **Quando precisa estar tomada?** (deadline real)
- **Qual o custo de errar?** (reversível barato → research enxuta; irreversível caro → research profunda)
- **Qual o critério de sucesso da decisão?** (o que precisa ser verdade para a recomendação ser confiável?)

Decisões reversíveis baratas merecem 2–8h de research. Decisões irreversíveis caras merecem 20–80h. Calibre antes de começar.

## 4. Hipóteses iniciais

Antes de pesquisar, escreva o que você **acha** que vai descobrir. Esse registro serve para dois propósitos:

- Expõe vieses do solicitante ao luz do dia — vai permitir caçar evidência contrária deliberadamente
- Permite medir o valor informacional da research depois (quanto suas crenças mudaram?)

Para cada hipótese, registre o nível de confiança inicial (0–100%) e a evidência que sustenta. Ao final da research, compare: confirmou? refutou? refinou? Hipótese refutada é o resultado mais valioso de uma research — significa que ela evitou um erro real.

## 5. Dimensões aplicáveis

Reveja as quatro dimensões canônicas (técnica, científica, regulatória, mercado) e marque quais entram. Critérios:

- **Técnica:** sempre que houver implementação envolvida
- **Científica:** sempre que houver claim de eficácia, performance medida, ou base de pesquisa acadêmica relevante
- **Regulatória:** sempre que o domínio for regulado (saúde, finanças, dados pessoais, infantil, alimentos, transporte, telecom, energia) ou houver expansão geográfica
- **Mercado:** sempre que a decisão envolver competição, pricing, GTM, ou viabilidade comercial

A maior parte das researches sérias usa duas ou três. Quatro é raro e indica scope muito amplo — considere quebrar em sub-researches.

## 6. Perguntas-mestre

Da pergunta real e das dimensões aplicáveis, derive **perguntas-mestre específicas** — cada uma respondível com evidência triangulada e suficientemente concreta para gerar uma recomendação.

Boas perguntas-mestre:
- São específicas o bastante para serem respondidas (não "como funciona X" mas "qual a latência típica de X em workloads tipo Y a 95º percentil?")
- Têm critério de resposta claro (numérico, binário, comparativo)
- Mapeiam para uma dimensão dominante
- Levam a uma sub-decisão

Quantidade típica: 4–8 perguntas-mestre por dimensão ativa. Mais que isso, o escopo está inflado.

## 7. Critério de scoring de fontes (calibrado)

O scoring genérico (autoridade, recência, relevância — 30/20/50) é o ponto de partida. Calibre por dimensão:

- **Técnico:** recência sobe (35%), relevância 50%, autoridade 15%
- **Científico:** autoridade sobe (45%), relevância 40%, recência 15%
- **Regulatório:** autoridade 45%, recência 35%, relevância 20%
- **Mercado:** relevância 50%, recência 30%, autoridade 20%

Documente a calibração para auditoria posterior.

## 8. Critério de parada

Defina explicitamente os três gatilhos de saturação para cada sub-pergunta:

- Saturação semântica: 5 fontes consecutivas sem claim novo
- Cota: mínimo de N fontes-âncora com score ≥ 4 (N varia: 8 para perguntas estreitas, 15 para perguntas amplas)
- Timebox: prazo absoluto

Sem critério de parada explícito, agentes entram em loop infinito e humanos viram analysis paralysis.

## 9. Sequenciamento e gates

Mapeie quem faz o quê e onde estão os pontos de revisão:

- Quem executa a Fase A? (geralmente um analista coordenador)
- Quem executa cada dimensão na Fase B? (idealmente um agente/pessoa por dimensão, em paralelo)
- Quem faz a síntese? (volta para o coordenador)
- Quem faz o adversarial review? (alguém DIFERENTE do coordenador, com mandato real)
- Quem consome o entregável? (cada conclusão tem destino mapeado)

Gates explícitos previnem retrabalho. Não pule o Gate A (revisão do plano pelo solicitante) — 20 minutos aqui poupam dias depois.

## 10. Plano de Pesquisa v1

Output da Fase A. Estrutura mínima:

1. Pergunta real (após 5 Whys)
2. Restrições não-negociáveis
3. Decisão pendente, valor e critério de sucesso
4. Hipóteses iniciais (com confiança e evidência)
5. Dimensões aplicáveis e justificativa
6. Perguntas-mestre por dimensão
7. Scoring calibrado por dimensão
8. Critério de parada por sub-pergunta
9. Sequenciamento de agentes/pessoas e gates
10. Timebox total e por fase
11. Entregável esperado (formato, audiência, distribuição)
12. Riscos da própria research (o que pode dar errado no processo)

Este plano é o contrato. Sem ele aprovado, a Fase B não começa.
