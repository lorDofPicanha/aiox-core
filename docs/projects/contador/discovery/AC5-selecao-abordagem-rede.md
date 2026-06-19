# AC-5 - Selecao e abordagem da rede Renan

**Projeto:** Contador / Apuracao Defensavel
**Story:** CONTADOR-S0-DISCOVERY
**Status:** v0 operacional - pronto para rankeamento manual, nao enviar sem revisao fiscal/juridica final
**Data:** 2026-06-18

---

## Objetivo

Transformar a rede quente do Renan em uma primeira onda controlada de discovery: 8 a 10 conversas, buscando 5 oportunidades qualificadas e 3 pilotos concierge potenciais, sem coletar XML real e sem prometer credito, calculo fiscal ou prova juridica.

## Criterio de entrada

Cada contato deve ser pontuado de 0 a 10 usando o ICP de `AC1-icp-final.md`.

| Sinal | Peso | Evidencia minima |
|---|---:|---|
| Escritorio com 5 a 40 colaboradores | +2 | Informacao conhecida pelo Renan ou conferida antes da abordagem |
| Carteira com 50 a 500 CNPJs | +2 | Estimativa do decisor ou historico da relacao |
| Dono/socio acessivel via relacao quente | +2 | Renan consegue falar direto ou pedir indicacao nominal |
| Dor lembrada de prazo, pendencia, documento ou retrabalho | +2 | Reclamacao anterior, caso vivido ou percepcao forte |
| Ansiedade com Reforma Tributaria | +1 | Perguntas recentes, conteudo compartilhado ou demanda explicita |
| Ja paga sistema, pessoa, consultoria ou operacao para resolver rotina | +1 | Sinal de disposicao real a pagar |
| Pede calculo/apuracao/credito garantido como expectativa central | -3 | Reposicionar ou desqualificar |

Prioridade:

| Score | Acao |
|---:|---|
| 8 a 10 | Abordar na primeira onda |
| 6 a 7 | Manter como backup da primeira onda |
| 4 a 5 | So abordar se faltar volume |
| 0 a 3 | Nao abordar no S0 |

## Lista de selecao

Preencher antes de qualquer contato.

| Rank | Codigo | Score | Relacao Renan | Tamanho | Carteira estimada | Dor lembrada | Reforma? | Ja paga algo? | Decisor | Proximo passo |
|---:|---|---:|---|---|---|---|---|---|---|---|
| 1 | E-01 |  |  |  |  |  |  |  |  |  |
| 2 | E-02 |  |  |  |  |  |  |  |  |  |
| 3 | E-03 |  |  |  |  |  |  |  |  |  |
| 4 | E-04 |  |  |  |  |  |  |  |  |  |
| 5 | E-05 |  |  |  |  |  |  |  |  |  |
| 6 | E-06 |  |  |  |  |  |  |  |  |  |
| 7 | E-07 |  |  |  |  |  |  |  |  |  |
| 8 | E-08 |  |  |  |  |  |  |  |  |  |
| 9 | E-09 |  |  |  |  |  |  |  |  |  |
| 10 | E-10 |  |  |  |  |  |  |  |  |  |

## Abordagem permitida

Mensagem curta para convite de estudo, sem pitch de software:

> Estou conversando com alguns escritorios para entender como voces estao lidando com pendencias, prazos e a preparacao para a Reforma. Nao e venda nem implantacao agora. Queria 25 minutos para entender a rotina real e ver onde a dor e maior.

Se perguntarem "o que voces fazem?":

> Estamos validando um servico assistido para organizar indicios e evidencias de revisao, sempre com decisao humana do contador. Nesta fase a conversa e de discovery; nao coletamos XML real, nao calculamos imposto e nao prometemos credito.

Nao usar:

- "Garantimos credito."
- "Calculamos a Reforma para voce."
- "Suba seus XMLs agora."
- "A IA decide a classificacao fiscal."
- "Isso ja serve como prova juridica plena."

## Sequencia operacional

1. Renan preenche o score dos top 30 contatos lembrados.
2. Breno e Renan escolhem 10 para a primeira onda.
3. Renan envia convite ou faz warm intro.
4. Breno conduz a entrevista com `roteiro-entrevista-10q.md`.
5. Cada conversa vira nota anonimizada em `entrevistas/E-XX-*.md`.
6. Sinais consolidados entram em `AC4-matriz-dores-v0.md`.
7. Somente apos a entrevista, se houver dor forte, apresentar a oferta de `AC2-oferta-piloto.md`.

## Gate de AC-5

AC-5 so fecha quando houver 3 escritorios com:

- decisor identificado;
- dor compativel com ICP;
- disposicao explicita para proximo passo;
- nenhuma exigencia de XML real antes dos gates LGPD/security;
- registro anonimizado da conversa.

## Registro de status

| Metrica | Alvo | Atual |
|---|---:|---:|
| Contatos rankeados | 30 | 0 |
| Convites enviados | 10 | 0 |
| Entrevistas agendadas | 8 | 0 |
| Entrevistas realizadas | 8 a 10 | 0 |
| Pilotos potenciais | 3 | 0 |
