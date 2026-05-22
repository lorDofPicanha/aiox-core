# Anti-padrões em tech research

Cada um destes é um modo conhecido de falha. Identificá-los nominalmente ajuda a caçá-los — quando o agente ou pesquisador reconhece o padrão, consegue corrigir.

## Confirmation bias passivo

**O que é:** consultar majoritariamente fontes que concordam com a hipótese inicial. Não exige intenção — basta seguir o caminho de menor resistência.

**Como detectar:** olhe a lista final de fontes. Menos de 25% sustenta evidência contrária? Suspeito.

**Antídoto:**
- Definir cota mínima de fontes contrárias por dimensão na Fase A
- Buscar deliberadamente termos opostos ("X doesn't work", "X failure", "X postmortem", "alternatives to X")
- Atribuir a alguém o papel explícito de defender a antítese durante a Fase C

## Recency bias

**O que é:** supervalorizar o que saiu ontem porque está fresco e visível. Em tech, o ciclo de hype é especialmente curto.

**Como detectar:** fontes-âncora todas dos últimos 60 dias, sem nenhuma referência ao histórico do campo.

**Antídoto:**
- Cruzar com fontes de 2–3 anos atrás para distinguir moda de sinal
- Verificar se o "novo" reconhece o trabalho anterior ou é amnésico
- Em tech, perguntar "o que era 'a próxima grande coisa' há 24 meses neste campo? onde está agora?"

## Authority bias

**O que é:** aceitar acríticamente porque é lab de elite, autor famoso ou empresa reconhecida.

**Como detectar:** a justificativa para uma claim é "porque a Google diz" ou "porque o paper da Anthropic afirma", sem engajamento com a evidência subjacente.

**Antídoto:**
- O argumento deve se sustentar pela evidência, não pelo logo
- Autores reconhecidos ainda fazem afirmações erradas; tratar como qualquer outra fonte
- Verificar se outras fontes independentes corroboram

## Analysis paralysis

**O que é:** research virar fim em si. "Só mais um paper" repetido até o prazo expirar.

**Como detectar:** semanas se passaram, dezenas de fontes lidas, mas nenhuma síntese ou matriz de decisão.

**Antídoto:**
- Timebox rígido por fase definido na Fase A
- Critério de parada (saturação semântica + cota + timebox)
- Regra dos 70%: com 70% da informação ideal, geralmente já se pode decidir; os 30% restantes têm rendimento marginal decrescente
- Reconhecer incógnitas irredutíveis cedo — quando algo só se resolve com experimento, parar de ler

## Não-falsificabilidade

**O que é:** conclusões formuladas tão genericamente que nenhuma evidência poderia contradizê-las.

**Exemplos:**
- "O mercado tem potencial significativo" — significa nada
- "A tecnologia tem trade-offs importantes" — diz nada de específico
- "Recomenda-se cautela" — não-decisão

**Como detectar:** para cada conclusão, pergunte "que evidência me faria mudar de ideia?". Se a resposta é vaga ou inexistente, a conclusão é não-falsificável.

**Antídoto:**
- Toda conclusão acompanhada da condição explícita de revisão
- Toda recomendação acompanhada de critério mensurável
- Banir formulações "depende", "talvez", "considerar" — substituir por condicionais específicas

## Não documentar o descartado

**O que é:** registrar só o que entrou no entregável, ignorando o que foi rejeitado.

**Por que importa:** em 6 meses ninguém vai lembrar por que a alternativa B foi cortada, e o trabalho será refeito. Ou pior: alguém vai sugerir B como nova ideia.

**Antídoto:**
- Apêndice obrigatório: "Alternativas avaliadas e descartadas"
- Para cada uma: por que entrou em consideração, em que critério falhou, em que condições poderia voltar à mesa
- Esse anexo é arquivo institucional, não cosmético

## Mistura de domínios

**O que é:** somar evidências de contextos próximos mas distintos como se fossem um único corpo.

**Exemplos comuns:**
- Evidência de "X em formato A" usada para sustentar "X em formato B" sem reconhecer a diferença
- Estudos em adultos aplicados a crianças
- Benchmark em workload Y aplicado a workload Z
- Comportamento em mercado A extrapolado para mercado B

**Antídoto:**
- Quando consolidar evidência, todas as fontes devem ter sido geradas no contexto que você pretende aplicar
- Quando houver salto de domínio, declará-lo explicitamente
- Desconte o peso da evidência proporcionalmente à distância de domínio

## Reconstrução narrativa pós-fato

**O que é:** escrever a conclusão antes da análise e selecionar evidências que a sustentam, montando a narrativa de research depois para parecer rigorosa.

**Como detectar:** a estrutura do documento conta uma história linear demais. Toda evidência aponta na mesma direção. Não há tensões internas.

**Antídoto:**
- Ordem invertida: registrar hipóteses iniciais antes da coleta; deixar a análise dirigir a conclusão
- Forçar a antítese ser tão forte quanto a tese
- Adversarial review com mandato real

## Confundir frequência com qualidade

**O que é:** assumir que uma tecnologia/abordagem é boa porque é frequentemente mencionada.

**Como detectar:** justificativa por popularidade ("todo mundo está usando X") sem evidência de adequação ao seu problema.

**Antídoto:**
- Investigar **por que** algo é popular (resolve problema real? marketing? momentum histórico?)
- Verificar se os adotantes são contextualmente similares ao seu
- "Todo mundo usa" frequentemente significa "todo mundo está preso" — lock-in viral

## Cargo culting

**O que é:** copiar a stack ou abordagem de empresa famosa (Netflix, Uber, Spotify) sem considerar diferenças de escala, contexto e recursos.

**Como detectar:** justificativa "porque a [empresa grande] faz assim", sem análise de aplicabilidade.

**Antídoto:**
- Verificar se a empresa-referência tem escala/contexto realmente comparáveis
- Frequentemente a empresa-referência mudaria de abordagem se começasse hoje, no seu contexto
- Soluções complexas resolvem problemas complexos; replicar a complexidade sem ter o problema é dívida gratuita

## Resume-driven development

**O que é:** escolher tecnologia pelo que parece bom em currículo, não pelo que resolve o problema.

**Como detectar:** a tecnologia escolhida é nova, em alta, com pouca tração em produção, e não há justificativa funcional clara em comparação a alternativas estabelecidas.

**Antídoto:**
- Critério explícito: "que problema isso resolve melhor do que a alternativa madura?"
- Considerar custo total de propriedade, não excitação inicial

## NIH (Not Invented Here)

**O que é:** rejeitar soluções existentes em favor de reconstruir tudo internamente.

**Quando é razoável:** quando a solução existente tem custo de licença proibitivo, quando há diferenciação competitiva real, quando o lock-in é existencial.

**Quando é anti-padrão:** quando se reconstrói por orgulho ou por subestimar a complexidade da solução existente.

**Antídoto:**
- Custo realista de construção vs custo realista de uso da solução existente (incluindo manutenção em ambos os casos)
- Considerar build vs buy vs adapt vs contribute (contribuir para projeto open source frequentemente é melhor que reconstruir)

## NIH inverso

**O que é:** adotar tudo de terceiros sem avaliar viabilidade de manutenção, dependência e migração.

**Como detectar:** stack monta-se em torno de fornecedores únicos sem alternativas mapeadas; cada decisão é "qual serviço SaaS resolve isso?".

**Antídoto:**
- Para cada dependência crítica, mapear plano de migração caso o fornecedor desapareça
- Avaliar lock-in junto com viabilidade técnica
- Open standards quando possível

## Hype bias

**O que é:** confundir frequência de menção em mídia/redes com qualidade técnica ou viabilidade comercial.

**Como detectar:** justificativa baseada em buzz ("está em todo lugar"), sem evidência funcional comparativa.

**Antídoto:**
- Hype cycle de Gartner como referência mental: tecnologia no pico de expectativas frequentemente decepciona antes de amadurecer (vale do desencanto)
- Procurar adoção em produção, não em demos/posts
- Esperar 12–18 meses para tecnologias em pico antes de adotar em decisões caras

## Benchmark hacking

**O que é:** acreditar em benchmark sem reproduzir ou sem entender as condições.

**Como detectar:** comparação baseada em número único sem distribuição, sem contexto de workload, sem hardware comparável.

**Antídoto:**
- Reproduzir benchmarks críticos quando possível
- Verificar se o workload do benchmark é representativo do uso real
- Buscar benchmarks **independentes** (não do fabricante)
- Considerar p95/p99, não só mediana

## TAM inflado

**O que é:** sizing de mercado por top-down otimista. "Se pegarmos 1% deste mercado de US$ 100bi…"

**Como detectar:** justificativa começa com número grande sem decomposição bottom-up.

**Antídoto:**
- Sizing bottom-up obrigatório (população × prevalência × propensão × ticket × penetração)
- Comparar top-down e bottom-up; discrepância grande exige investigação
- Penetração realista para entrante novo é tipicamente 1–3% em 3 anos, não 10%

## Wishful interpretation regulatória

**O que é:** ler a norma do jeito que favorece o produto, ignorando interpretação oficial ou jurisprudencial.

**Como detectar:** o argumento regulatório depende de interpretação criativa da norma, sem suporte em precedente ou parecer oficial.

**Antídoto:**
- Norma é interpretada por regulador e juiz, não pelo time
- Cherry-picking de jurisprudência é detectado em adversarial review
- Quando há ambiguidade real, consultar especialista
- Calcular custo de estar errado, não custo de estar certo

## Achar que enforcement fraco = liberdade

**O que é:** assumir que como o regulador não fiscaliza, a norma não importa.

**Por que é arriscado:** reguladores mudam postura; produtos crescem e viram alvo; concorrentes podem denunciar; jurisprudência se forma.

**Antídoto:**
- Mapear histórico de enforcement como input, não como conclusão
- Considerar como o cenário muda em 24–36 meses
- Risco regulatório baixo hoje pode ser alto amanhã

## Confundir feature com diferencial

**O que é:** assumir que algo que diferencia hoje vai diferenciar amanhã.

**Como detectar:** "nosso diferencial é X" onde X é replicável em 6 meses por concorrente bem-financiado.

**Antídoto:**
- Diferenciais sustentáveis vêm de: efeitos de rede, dados proprietários, escala, marca, regulação, distribuição, integração profunda
- Features replicáveis são vantagens temporárias; planejar a próxima rodada

## Otimismo de adoção

**O que é:** assumir que o mercado vai adotar rapidamente, ignorando inércia, custo de troca, e fricção de aprendizado.

**Antídoto:**
- Curva de adoção tipicamente mais lenta que esperado
- Para cada adoção, mapear: barreira percebida, custo de troca, gatilho de mudança, friccão do onboarding
- Benchmarks de adoção em categorias similares

## Compliance teatral

**O que é:** processos formalmente em ordem mas operação real divergente. Política de privacidade impecável mas logs cheios de dados não anonimizados.

**Como detectar:** documentos de compliance descolados de evidência operacional.

**Antídoto:**
- Toda recomendação regulatória precisa de prova operacional, não apenas documental
- Auditoria interna periódica
- Treinamento real do time, não cerimônia
