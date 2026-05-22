# Fase C — Síntese dialética em detalhe

A síntese é onde a research deixa de ser agregação e vira conhecimento. Sem este passo, você produz uma bibliografia comentada — útil, mas não decisória.

## Princípio: confronto deliberado de evidências

Síntese não é resumo. É **forçar evidências a se confrontarem** até que um padrão se estabilize. O método é dialético, em três tempos.

### Tese

A posição mais forte **a favor** de uma alternativa específica. Não a sua opinião — a melhor versão do argumento, montada com as melhores evidências disponíveis.

Estrutura típica:
- Claim central
- 2–4 evidências de suporte (com fontes triangulado)
- Contexto de validade (quando esse argumento se sustenta)

### Antítese

A posição mais forte **contra** a mesma alternativa. Também a melhor versão — não um espantalho fácil de derrubar.

Estrutura típica:
- Claim central oposto
- 2–4 evidências de suporte (com fontes trianguladas)
- Contexto de validade

Se você não consegue formular a antítese com força equivalente à tese, **a research está enviesada** — volte para a Fase B com a missão explícita de caçar evidência contrária. Pelo menos um quarto das fontes finais deve sustentar a antítese; se for menos, a coleta foi seletiva.

### Síntese

A conclusão que sobrevive ao confronto. Quase nunca é "tese vence" ou "antítese vence" puramente. Tipicamente é:

- "Tese vence sob condições X, Y; antítese vence sob condições Z"
- "Híbrido: usar A para subproblema 1, B para subproblema 2"
- "Tese vence agora, antítese pode vencer em 18 meses se Z acontecer"
- "Inconcluso com a evidência disponível — necessário validar empiricamente"

Toda síntese tem **condições explícitas de validade**: "esta conclusão vale enquanto X for verdade; deve ser reavaliada se Y mudar". Sem isso, a conclusão envelhece silenciosamente.

## Matriz de decisão multicritério

Para escolhas entre N alternativas:

1. **Liste critérios** (geralmente 5–9). Use as restrições não-negociáveis como filtros prévios, não como critérios pontuáveis — opção que viola restrição já está fora.
2. **Pese cada critério** (soma = 100%). O peso deve ser justificado pela decisão pendente, não inventado.
3. **Pontue cada alternativa em cada critério** (0–10 ou 1–5). Pontuação baseada em evidência triangulada, não em "feeling".
4. **Calcule score ponderado.**
5. **Faça análise de sensibilidade.** Esta é a parte que diferencia matriz amadora de matriz útil.

### Análise de sensibilidade

Pergunte: se o peso de um critério mudar 20% para cima ou para baixo, a recomendação muda?

- **Não muda:** o critério não é o eixo da decisão. Ele influencia mas não determina.
- **Muda:** o critério é o eixo real. Merece research adicional para garantir que a pontuação está bem fundamentada.

Geralmente em qualquer decisão real, 1–2 critérios são os eixos. Todos os outros são acessórios. Identificar isso muda como você apresenta a recomendação.

### Exemplo de uso

| Critério | Peso | Alt A | Alt B | Alt C |
|---|---|---|---|---|
| Performance | 25% | 8 | 7 | 9 |
| Custo | 20% | 6 | 9 | 4 |
| Manutenibilidade | 20% | 7 | 8 | 6 |
| Comunidade | 15% | 9 | 6 | 8 |
| Curva de aprendizado | 10% | 6 | 9 | 5 |
| Lock-in | 10% | 8 | 5 | 7 |
| **Score ponderado** | | **7.4** | **7.4** | **6.8** |

A e B empatam. A sensibilidade vira o desempate: se custo subir para 30% de peso (cenário "runway apertado"), B ganha clara. Se manutenibilidade subir (cenário "time pequeno crescer"), também B. A só ganha em cenário "performance é tudo". Recomendação emergente: B, salvo se performance for o critério não-negociável.

## Detecção de incógnitas residuais

Ao final da síntese, separe explicitamente:

### Incógnitas redutíveis

Coisas que mais research **pode** resolver. Sinais: o conhecimento existe em algum lugar, só não foi acessado ainda. Exemplos:

- "Não encontrei benchmark direto entre A e B no caso de uso Y" → mais research focada
- "Faltou opinião de quem implementou em produção" → entrevistas qualitativas
- "Documentação oficial é vaga sobre comportamento sob carga" → leitura de código-fonte

Se identificada uma incógnita redutível crítica, retornar à Fase B com escopo cirúrgico (não refazer tudo).

### Incógnitas irredutíveis

Coisas que **só validação empírica** resolve. Sinais: ninguém ainda fez o experimento; o conhecimento ainda não existe; o contexto é único o bastante para que evidência externa não transfira. Exemplos:

- "Não sei como nossos usuários específicos vão reagir ao fluxo X" → teste com usuários reais
- "Não sei se o modelo Y mantém qualidade nos nossos dados específicos" → POC com dataset real
- "Não sei se o canal Z funciona para nosso público" → experimento de aquisição controlado

Reconhecer incógnitas irredutíveis cedo é maturidade epistêmica. A tentação é sempre ler mais um paper. **Hora de parar de ler e construir.**

Para cada incógnita irredutível, especifique o experimento mínimo viável que a resolveria: hipótese, métrica, prazo, custo.

## Estrutura da síntese escrita

Para cada decisão crítica da research, produzir:

```
## Decisão: [pergunta específica]

### Recomendação
[1-3 frases, direta]

### Análise dialética
**Tese:** [argumento + evidências]
**Antítese:** [argumento + evidências]
**Síntese:** [conclusão + condições de validade]

### Matriz de decisão
[tabela + análise de sensibilidade]

### Condições de revisão
- Reavaliar se [gatilho 1]
- Reavaliar se [gatilho 2]
- Data de validade estimada: [prazo]

### Incógnitas residuais
- Redutíveis: [lista + plano]
- Irredutíveis: [lista + experimento proposto]
```

Esse formato é uniforme em qualquer área. O conteúdo muda, a estrutura não.

## Checagem antes de fechar a síntese

Antes de declarar a Fase C concluída, valide:

- [ ] Toda decisão crítica tem tese, antítese e síntese explícitas?
- [ ] Cada conclusão tem condições de validade documentadas?
- [ ] Cada matriz tem análise de sensibilidade?
- [ ] Incógnitas residuais estão separadas em redutíveis vs irredutíveis?
- [ ] Para cada incógnita irredutível, há experimento proposto?
- [ ] Hipóteses iniciais foram explicitamente confirmadas, refutadas ou refinadas?
- [ ] Pelo menos uma hipótese inicial foi refutada ou substancialmente refinada? (Se não, suspeite de confirmation bias.)

Aprovado tudo, segue para Fase D (adversarial review).
