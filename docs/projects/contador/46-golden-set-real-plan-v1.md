# Golden-Set Real Plan v1

**Projeto:** Contador / Apuracao Defensavel
**Status:** plano pronto - execucao bloqueada por autorizacao founder, DPA/storage e rotulador
**Data:** 2026-06-18
**Gate:** G8 plano pronto; claim de acuracia fiscal real segue bloqueado.
**Consulta:** Conclave G8 `52d8a034-cd48-400d-9c9e-b34e656efdfd`.

---

## 1. Objetivo

Criar um conjunto versionado de itens fiscais reais, rotulados por profissional habilitado, para medir se o motor fiscal encontra divergencias relevantes com qualidade suficiente para apoiar uma revisao profissional.

O golden-set real nao serve para prometer credito, economia ou prova juridica plena. Ele serve para decidir se o motor pode sustentar claims quantitativos limitados, sempre com revisao humana.

## 2. Fases

| Fase | Tamanho | Objetivo | Gate |
|---|---:|---|---|
| F0 | 0 real | Contrato tecnico com fixtures sinteticas | Ja existente |
| F1 | 50 itens reais | Calibrar protocolo, rotulador, formato e discordancias | Founder autoriza coleta/gasto |
| F2 | 200 itens reais | Medir qualidade inicial por segmento/caso | DPA/storage/logs aprovados |
| F3 | 500 itens reais | Estabilizar metricas e thresholds de release | Dois rotuladores ou revisao independente |

## 3. Amostragem

A amostra deve ser estratificada, nao puramente aleatoria:

- Alta frequencia por volume de itens.
- Alta materialidade por valor.
- Casos ambiguos da Reforma.
- NCM/cClassTrib/CST/CFOP com maior risco de divergencia.
- Setores priorizados pelo concierge.
- Itens onde o motor tende a apontar e itens onde deve abstencao.

Evitar coletar itens apenas faceis; isso inflaria metricas e destruiria confianca.

## 4. Protocolo de Rotulagem

- Rotulador nao ve output do motor.
- Cada item recebe fundamentacao curta e nivel de confianca.
- Pelo menos 20% dos itens recebem duplo rotulo independente.
- Divergencia entre rotuladores vira `ambiguidade`, nao erro automatico.
- Itens de `confianca=baixa` ficam fora do gate duro de acuracia.
- Toda versao do golden-set e imutavel.

## 5. Campos Minimos por Item

Ver contrato de formato em `47-golden-set-real-fixture-contract-v1.md`.

Campos centrais:

- Identificador pseudonimizado do item.
- Snapshot fiscal minimo: descricao, NCM, CFOP, CST, cClassTrib informado, valor, data/fato gerador.
- Rotulo esperado: cClassTrib defendido, apontamentos esperados, decisao esperada do motor.
- Fundamentacao e base versao.
- Confianca, ambiguidade, abstencao esperada.
- Rotulador, CRC/identificador profissional e timestamp.

## 6. Metricas

Permitidas internamente apos F1/F2:

- Cobertura: percentual de itens em que o motor emite classificacao/apontamento.
- Abstencao correta: percentual de casos ambiguos/insuficientes em que o motor nao forca decisao.
- Precision de apontamento: quando aponta divergencia, quantas eram esperadas.
- Recall de apontamento: quantas divergencias esperadas foram encontradas.
- Falso positivo por valor/materialidade.
- Concordancia inter-rotulador nos 20% duplos.

Proibidas externamente ate F2/F3 aprovadas:

- "Acuracia fiscal de X%".
- "Economia estimada garantida".
- "Credito recuperavel".
- "Sem risco de multa".

## 7. Thresholds Iniciais

Nao fixar threshold comercial antes de F1. Usar F1 para calibrar.

Sugestao para F2, a validar:

- Precision alta em itens de alta/media confianca deve ser prioridade sobre recall.
- Falso positivo material deve ser tratado como falha grave.
- Abstencao em caso ambiguo e comportamento aceitavel.
- Qualquer metrica deve vir com denominador, segmento e criterio de exclusao.

## 8. Gates Antes de Coletar Real

- Founder autoriza contato/contratacao.
- DPA e suboperadores revisados.
- Storage real segregado definido.
- Matriz de retencao aprovada.
- Canal seguro de recebimento definido.
- Termo do rotulador assinado.
- Protocolo de descarte/export aprovado.

## 9. Gates Antes de Claim de Acuracia

- F2 completo com pelo menos 200 itens reais.
- Duplo rotulo em pelo menos 20%.
- Concordancia inter-rotulador reportada.
- Itens de baixa confianca excluidos do gate duro.
- Relatorio por segmento/materialidade, nao apenas media global.
- Founder + legal/fiscal aprovam frase exata do claim.

## 10. Proxima Acao Humana

Founder decidir:

1. Autoriza recrutamento de rotulador?
2. Qual teto de gasto?
3. Qual escritorio/cliente pode fornecer lote F1?
4. Quem assina DPA/termo antes da coleta?
