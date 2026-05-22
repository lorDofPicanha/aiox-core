# Fase D — Adversarial Review

A função do adversarial reviewer é **derrubar conclusões**, não validá-las. Sem mandato real para invalidar, a fase vira teatro e a research vai para produção com defeitos.

## Princípio

Um revisor adversarial é uma figura institucional, não pessoal. Não está atacando o autor — está testando se a conclusão sobrevive a um ataque inteligente. Se sobrevive, ganha credibilidade. Se cai, todos ganham (incluindo o autor): o erro foi caçado antes de virar decisão.

A regra cultural: **conclusões frágeis que passem sem oposição são falha do revisor, não vitória do autor.**

## Quem faz

Idealmente, alguém (ou algum agente) que **não participou da Fase B nem da Fase C**. Olho fresco vê armadilhas que o olho cansado normaliza. Se for absolutamente impossível, o autor pode fazer self-review com 48h de distância, mas é uma versão pior.

Em pipeline de agentes: o adversarial reviewer é um agente dedicado com prompt explícito de "tentar derrubar". Não compartilhe contexto desnecessário — quanto mais isolado, melhor.

## Checklist completo

Trabalhe cada item explicitamente. Não pule porque "parece OK".

### Seleção de fontes

- [ ] As fontes são realmente independentes? (Verificar que três fontes citadas não rastreiam ao mesmo paper original.)
- [ ] As fontes contrárias têm o mesmo nível de qualidade que as fontes a favor? (Se as a favor são peer-reviewed e as contra são blogs, há viés.)
- [ ] Há proporção razoável de fontes contrárias? (< 25% = suspeita de confirmation bias.)
- [ ] As fontes estão dentro do escopo de validade? (Paper sobre adultos aplicado a crianças? Estudo em EUA aplicado ao Brasil? Benchmark em workload A aplicado a workload B?)
- [ ] Fontes patrocinadas/com conflito de interesse foram identificadas e ponderadas adequadamente?

### Triangulação

- [ ] Toda claim decisória tem três fontes independentes convergentes ou divergência documentada?
- [ ] Claims com fonte única foram explicitamente marcados como provisórios?
- [ ] Métricas numéricas têm pelo menos uma fonte primária? (Não pode ser tudo "segundo relatório X que cita estudo Y".)

### Lógica da síntese

- [ ] A antítese é tão forte quanto a tese? (Se a antítese é um espantalho, o autor não fez o trabalho.)
- [ ] A síntese realmente integra tese e antítese, ou só endossa a tese ignorando a antítese?
- [ ] As condições de validade são específicas o bastante para serem testadas?
- [ ] A análise de sensibilidade foi feita ou pulada?
- [ ] Critérios da matriz têm pesos justificados pela decisão, ou foram inventados?

### Falsificabilidade

- [ ] Para cada conclusão, o autor articulou o que faria mudar de ideia?
- [ ] As condições de revisão são detectáveis? (Se a condição é "se o mercado mudar", isso não é detectável. "Se a participação de X cair abaixo de 30%" é.)
- [ ] Há conclusões formuladas de forma tão genérica que nenhuma evidência poderia contradizê-las? (Estas precisam ser reformuladas ou removidas.)

### Hipóteses iniciais

- [ ] Pelo menos uma hipótese inicial foi refutada ou substancialmente refinada? Se 100% foram confirmadas, suspeite de confirmation bias na coleta.
- [ ] Hipóteses confirmadas têm evidência **nova** suportando, ou só repetem o que o solicitante já achava?
- [ ] O nível de confiança final em cada hipótese está calibrado pelo peso da evidência, não pela preferência?

### Alternativas descartadas

- [ ] Cada alternativa descartada tem justificativa registrada?
- [ ] As alternativas descartadas foram avaliadas com o mesmo rigor que as finalistas, ou foram cortadas cedo?
- [ ] Há alternativa que mereceria estar entre as finalistas e não está?
- [ ] O critério de corte é defensável? (Cortar por preferência pessoal não vale; cortar por restrição não-negociável vale.)

### Domínio e generalização

- [ ] Evidência foi misturada entre domínios próximos mas distintos? (CBT digital com agente humano não é a mesma coisa que CBT digital com agente IA. SaaS B2B não é a mesma coisa que SaaS B2C. Mercado luxo SP não é igual a mercado luxo Rio.)
- [ ] Quando há generalização, ela está documentada com explicação de por que transfere?
- [ ] Benchmarks técnicos foram colhidos em condições representativas, ou em laboratório irrealista?

### Incógnitas residuais

- [ ] Incógnitas redutíveis estão separadas de incógnitas irredutíveis? (Confundi-las é grave: redutível mascarada de irredutível para de pesquisar; irredutível mascarada de redutível vai entrar em loop de leitura.)
- [ ] Para cada irredutível, há experimento mínimo viável proposto?
- [ ] Há "unknown unknowns" prováveis dado o domínio? (Adversarial reviewer pode flagar o que o autor não viu porque não sabia que existia.)

### Coerência interna

- [ ] As recomendações são consistentes entre si? (Recomendar A em uma seção e ~A em outra é falha.)
- [ ] As recomendações respeitam todas as restrições não-negociáveis listadas na Fase A?
- [ ] Os riscos identificados estão mapeados nas recomendações? (Identificar risco e não mitigar é meia-tarefa.)

### Apresentação

- [ ] O sumário executivo realmente sumariza, ou é só uma introdução?
- [ ] A recomendação é rastreável a uma pergunta-mestre específica?
- [ ] Um leitor que só ler o sumário toma a mesma decisão que um leitor que ler tudo?

## Resultado do review

O adversarial reviewer produz um documento separado com três classificações por conclusão:

- **Sobrevive** — passou em todos os checks. Entra no entregável final como está.
- **Sobrevive com refinamento** — o ataque revelou pontos fracos mas a conclusão é defensável após ajuste. Voltar para o autor com instruções específicas.
- **Cai** — o ataque foi bem-sucedido. A conclusão não está pronta. Voltar para Fase C (refinar) ou Fase B (mais coleta), ou rebaixar a hipótese não-validada.

Toda conclusão precisa de uma das três classificações. Não há "OK genérico".

## Postura do revisor

- **Não pessoal:** ataque o argumento, nunca o autor
- **Construtivo:** quando aponta falha, sugira o que faltou (não exija que o autor adivinhe)
- **Específico:** "esta claim está fraca" não é feedback; "esta claim depende da fonte X que tem viés Y porque Z" é
- **Calibrado:** nem todo defeito justifica derrubar a conclusão; defeitos pequenos viram refinamento, defeitos estruturais derrubam
- **Honesto:** se a conclusão sobrevive bem, dizer isso é parte do trabalho — credibilidade do reviewer vem de derrubar quando precisa **e** validar quando merece

Um adversarial reviewer que derruba 100% é tão suspeito quanto um que valida 100%.
