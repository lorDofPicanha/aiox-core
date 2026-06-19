# AC-4 - Matriz de dores priorizadas

**Projeto:** Contador / Apuracao Defensavel
**Story:** CONTADOR-S0-DISCOVERY
**Status:** v0 - estrutura pronta, bloqueada ate entrevistas reais
**Data:** 2026-06-18

---

## Objetivo

Consolidar as entrevistas reais em uma matriz de prioridade baseada em frequencia, gravidade e disposicao a pagar. Este arquivo nao fecha AC-4 sozinho: ele so vira evidencia depois de no minimo 8 entrevistas reais, meta 10.

## Regras de codificacao

- Usar codigos `E-01`, `E-02` etc.; nao registrar nomes pessoais em artefato versionado.
- Nao registrar CNPJ, XML, dados fiscais de cliente final ou informacoes identificaveis desnecessarias.
- Separar fala espontanea de resposta induzida.
- Marcar quando o entrevistado ja paga por solucao, pessoa, consultoria ou processo.
- Registrar objecoes textuais quando afetarem compra ou piloto.

## Sinais do gate

| Sinal | Criterio GO | Campo de evidencia |
|---|---:|---|
| S1 - dor top-3 de pendencias/prazos/documentos | >= 70% | Dor citada espontaneamente como prioridade |
| S2 - disposicao a pagar ou gasto real no problema | >= 50% | Ja paga algo ou aceita piloto/success-fee |
| S3 - medo de CNPJ inapto/multa | Informativo | Medo citado espontaneamente |
| S4 - Reforma gera ansiedade/urgencia | >= 50% como gatilho | Perguntas, pressao de cliente, inseguranca |

GO para proxima fase exige S1 e S2. S3 ajuda posicionamento, mas nao e kill isolado.

## Matriz por entrevista

| Codigo | Perfil ICP? | Dor top-3 espontanea | Gravidade 1-5 | Ja paga algo? | WTP/piloto | Reforma como gatilho | Medo multa/inapto | Objecao principal | Proximo passo |
|---|---|---|---:|---|---|---|---|---|---|
| E-01 |  |  |  |  |  |  |  |  |  |
| E-02 |  |  |  |  |  |  |  |  |  |
| E-03 |  |  |  |  |  |  |  |  |  |
| E-04 |  |  |  |  |  |  |  |  |  |
| E-05 |  |  |  |  |  |  |  |  |  |
| E-06 |  |  |  |  |  |  |  |  |  |
| E-07 |  |  |  |  |  |  |  |  |  |
| E-08 |  |  |  |  |  |  |  |  |  |
| E-09 |  |  |  |  |  |  |  |  |  |
| E-10 |  |  |  |  |  |  |  |  |  |

## Agregacao

Preencher apos cada nova entrevista.

| Metrica | Formula | Atual | Gate |
|---|---|---:|---|
| Entrevistas realizadas | total de codigos preenchidos | 0 | >= 8 |
| S1 confirmado | entrevistas com dor top-3 / total | 0% | >= 70% |
| S2 confirmado | entrevistas com gasto real ou WTP / total | 0% | >= 50% |
| S3 citado | entrevistas com medo multa/inapto / total | 0% | informativo |
| S4 confirmado | entrevistas com Reforma como gatilho / total | 0% | >= 50% |

## Ranking de dores

| Dor | Frequencia | Gravidade media | WTP associado | Segmento onde aparece | Implicacao |
|---|---:|---:|---|---|---|
| Pendencias/documentos invisiveis | 0 |  |  |  |  |
| Prazo estourado ou quase estourado | 0 |  |  |  |  |
| Dono como ponto unico de controle | 0 |  |  |  |  |
| Ansiedade com Reforma | 0 |  |  |  |  |
| Revisao fiscal por item | 0 |  |  |  |  |

## Decisao provisoria

Status atual: **BLOQUEADO EM CAMPO**.

Nao ha GO/PIVOT/KILL ate existirem entrevistas reais suficientes. Qualquer decisao antes disso e hipotese, nao evidencia.
