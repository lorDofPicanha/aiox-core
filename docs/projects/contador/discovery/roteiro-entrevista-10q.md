# Roteiro de Entrevista — Contadores (Discovery Story 0.1, T1)

**Projeto:** Contador / Radar Fiscal
**Autor:** Atlas (@analyst)
**Data:** 2026-05-29
**Método:** Continuous Discovery / entrevista baseada em história (clone `teresa-torres`)
**Satisfaz:** AC-3 da `STORY-CONTADOR-S0-DISCOVERY.md`

---

## Princípios (Teresa Torres) — leia antes de entrevistar

1. **Pergunte por HISTÓRIAS, não opiniões.** "Conte sobre a última vez que..." revela comportamento real; "você gostaria de..." gera resposta educada e falsa.
2. **NÃO pitche o produto.** O objetivo é mapear o espaço de oportunidade (dores, necessidades), não validar a solução. Se você descrever a ferramenta, contaminou a entrevista.
3. **Cave no específico.** Quando a pessoa generalizar ("é sempre corrido"), traga de volta: "me conta de um caso concreto do mês passado".
4. **Silêncio é ferramenta.** Deixe a pessoa preencher a pausa — é onde sai a dor real.
5. **Nunca conte para o entrevistado o que você espera ouvir.** Sem perguntas-âncora ("não é frustrante quando...?").
6. **Anote verbatim.** Frases literais do entrevistado valem mais que sua paráfrase (vão para a matriz de dores e a copy).

> ⚠️ LGPD (ref. story §Data Handling): consentimento de gravação/uso antes de começar; **não pedir dados de clientes-final do escritório** (CNPJs/dados fiscais de terceiros). Identifique o entrevistado por código (ex.: E-01).

---

## Abertura (não conta como pergunta)

> "Obrigado pelo tempo. Não vim vender nada — estou estudando como escritórios contábeis tocam a rotina no dia a dia, e quero ouvir como **você** faz, com exemplos reais. Não existe resposta certa. Posso gravar só para eu não perder nada? Fica entre a gente."

Mapear contexto rápido: tamanho do escritório (nº pessoas), nº aproximado de CNPJs, regimes que mais atende (MEI/Simples/outros), papel do entrevistado.

---

## As 10 perguntas

> Formato: pergunta principal (baseada em história) + sondagens (probes). Cada uma marca os sinais do Gate Metrics (S1=dor top-3, S2=disposição a pagar, S3=medo CNPJ inapto/multa, S4=ansiedade Reforma).

**P1 — Rotina real do mês.** "Me conta como foi o fechamento do mês passado no escritório, do começo ao fim. O que tomou mais tempo?"
- Probes: o que deu errado? o que você refez? o que te tirou o sono?  · _Sinais: S1_

**P2 — Cobrança de documentos.** "Conte a última vez que você teve que correr atrás de um documento que um cliente não mandou. Como foi?"
- Probes: como você descobriu que faltava? por quais canais cobrou? quantas vezes? o que aconteceu no fim?  · _Sinais: S1_

**P3 — Prazo em risco.** "Me fala de uma vez recente em que uma obrigação quase passou do prazo (ou passou). O que aconteceu?"
- Probes: como você percebeu? quem percebeu? deu multa/retrabalho? como evitou (ou não)?  · _Sinais: S1, S3_

**P4 — Visibilidade da carteira.** "Hoje, se eu te perguntar agora quais clientes estão com pendência em aberto, como você me responde? Me mostra como você olha isso."
- Probes: planilha? sistema? cabeça? quem mais no time enxerga? com que frequência você olha?  · _Sinais: S1_

**P5 — Quando algo escapa.** "Conte uma situação em que algo passou batido — uma obrigação, um documento, um cliente sem dono. O que gerou?"
- Probes: como descobriram? qual foi o custo (multa, cliente bravo, retrabalho)? mudou algo depois?  · _Sinais: S1, S3_

**P6 — Risco de CNPJ inapto.** "Você já teve (ou teve medo de ter) um cliente caindo em situação irregular / CNPJ inapto? Me conta."
- Probes: o que você faz hoje para vigiar isso? é preocupação real ou rara?  · _Sinais: S3_  · (NÃO induza — se nunca aconteceu, registre isso, é dado.)

**P7 — Reforma Tributária.** "Como a Reforma Tributária está aparecendo no seu dia a dia hoje — clientes perguntando, você estudando, algo concreto?"
- Probes: o que os clientes perguntam? você se sente preparado? é urgência ou ainda distante?  · _Sinais: S4_

**P8 — Tentativas anteriores.** "O que você já tentou para organizar tudo isso? (planilha, sistema, contratar alguém, processo). O que funcionou e o que abandonou?"
- Probes: por que abandonou? o que faltou? quanto custou (tempo/dinheiro)?  · _Sinais: S1, S2_

**P9 — Custo da dor / disposição a pagar.** "Se você pensar no tempo e nas dores de cabeça que isso gera por mês, o que isso representa pro escritório? Já chegou a pagar por algo pra resolver?"
- Probes: quanto de hora-time? já contratou ferramenta/pessoa pra isso? quanto pagou/pagaria sem pestanejar vs. caro?  · _Sinais: S2_  · (Ancore em gasto REAL passado, não hipótese.)

**P10 — Varinha mágica (fecho aberto).** "Se você pudesse resolver UMA coisa dessa rotina amanhã, sem esforço, qual seria? Por quê essa?"
- Probes: por que essa e não outra? o que mudaria no seu dia?  · _Sinais: S1 (prioriza a dor #1)_

---

## Fecho

> "Isso me ajudou demais. Posso te procurar de novo se eu tiver mais uma dúvida? E você conhece outro contador que vive essa rotina e toparia conversar?" (recruta indicação → ajuda no AC-5, alvos do piloto).

---

## Mapeamento pergunta → AC / Gate

| Pergunta | Alimenta | Sinal Gate |
|---|---|---|
| P1, P4 | Matriz de dores (AC-4), ICP (AC-1) | S1 |
| P2, P5 | Matriz de dores | S1, S3 |
| P3 | Dor de prazo + risco | S1, S3 |
| P6 | Medo CNPJ inapto | S3 |
| P7 | Reforma como gatilho | S4 |
| P8, P9 | Disposição a pagar, oferta (AC-2) | S1, S2 |
| P10 | Priorização da dor #1 | S1 |
| Fecho | Alvos do piloto (AC-5) | — |

**Anti-indução conferido (Torres):** nenhuma pergunta descreve o produto, nenhuma é "você usaria...", todas pedem história/comportamento passado ou estado atual real. P6/P7 trazem o tema sem afirmar que é problema — se não for, o "não" é resultado válido.
