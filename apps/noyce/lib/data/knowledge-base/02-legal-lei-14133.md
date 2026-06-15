---
title: Lei 14.133/2021 — regras-chave que os agentes aplicam
docId: legal-lei-14133
tags: [lei-14133, habilitacao, art-15, art-67, art-69, art-55, art-58, art-64, art-164, sumula-tcu-263, consorcio, me-epp, prazos, modalidades]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - apps/noyce/lib/data/legal-constants.json
  - apps/noyce/lib/noyce-habilitation.ts
---

## Como usar este documento

Estas são as constantes legais que o motor trata como **regras de negócio de primeira classe**, não detalhes de prompt. Todas foram calibradas com dado real (12 editais + balanços ENIAC) e validadas no conclave Justen-Filho + Niebuhr (04/Jun). Regra de ouro transversal: **todo requisito deve citar a cláusula de origem**; requisito sem cláusula é marcado `nao_confirmado` e nunca tratado como exigência dura. Falso-negativo em requisito crítico (dizer NO-GO por algo que não bloqueia) é o pior dano ao negócio — o motor é conservador **só** em deficiência insanável.

> Fonte: doc 26 §2.B (anti-alucinação), §9 (invariantes), §10 (conclave).

## Habilitação — os 4 blocos

A habilitação se divide em quatro blocos avaliados independentemente. Cada um devolve `{status, evidência, lacuna?, sanabilidade}`.

- **Técnica (qualificação técnica):** dois eixos — **técnico-profissional** (atestado/CAT no nome do engenheiro/RT) e **técnico-operacional/CAO** (capacidade da pessoa jurídica). Base: Lei 14.133 art. 67.
- **Econômico-financeira:** patrimônio líquido / capital social mínimo + índices contábeis (LC/LG/SG) + certidão negativa de falência. Base: art. 69.
- **Jurídica:** contrato social, procuração, declarações exigidas pelo edital.
- **Fiscal/trabalhista:** CNDs (federal, estadual, municipal, FGTS, trabalhista) + SICAF quando exigido.

> Fonte: doc 26 §2.B (ERM, 4 blocos), §3 (4 avaliadores).

## Régua sanável × insanável (art. 64)

Toda lacuna carrega `sanabilidade ∈ {SANAVEL, INSANAVEL}`:
- **SANÁVEL** = documento existente/formal faltando ou vencido (CND vencida, declaração faltante, vínculo de RT por declaração) → vira **lacuna-tarefa, NÃO bloqueia o GO**.
- **INSANÁVEL** = ausência de capacidade substantiva (quantitativo real abaixo, RT inexistente, débito fiscal real) → **bloqueio-duro, NO-GO real**.

**GO/NO-GO:** NO-GO só se houver `NAO_ATENDE` insanável em requisito eliminatório. Lacuna sanável → `GO-com-tarefas`. Zona cinzenta (a lei permite mas a comissão pode divergir) → `ATENDE_COM_RESSALVA`.

> Fonte: doc 26 §3 (status 5 níveis, régua sanável×insanável — exigência de Niebuhr); noyce-habilitation.ts (`buildVerdict`).

## Qualificação técnica — art. 67 + Súmula TCU 263

- **Parcela de maior relevância vem do EDITAL, nunca inferida** (Justen): o edital deve designá-las e motivá-las (art. 67 §1º). Se o edital exige quantitativo **sem** designar a parcela → possível restrição ilegal (gancho com o detector de suspeita) → status `ATENDE_COM_RESSALVA`.
- **Teto de quantitativo = 50%:** quantitativos mínimos de capacidade técnico-operacional observam o teto de **50% da parcela de maior relevância** (Súmula TCU 263). `qtdMinExigivel = min(qtdEditalReq, ~50% × quantitativo da parcela)`.
- **Somatório de atestados = admitido como REGRA** (Justen): somar quantitativos da MESMA classe de serviço em múltiplos acervos da empresa. Vedação só vale se **expressa e justificada** no edital (varredura do corpus: 0/12 vedam).
  - Alguns editais admitem a soma mas **limitam o número de atestados** (ex.: Novo Gama `maxAtestados = 2`). O matcher seleciona os N maiores acervos que cubram o exigido.
  - Edital **silente** sobre soma (10/12 do corpus): a lei admite, mas comissões conservadoras inabilitam → não dar GO cego → `ATENDE_COM_RESSALVA` + tarefa "confirmar via esclarecimento ou impugnação preventiva".
- **RT técnico-profissional:** o vínculo do RT é **SANÁVEL** — admite-se contrato de prestação de serviço, vínculo societário OU **declaração de contratação futura**. **Exigir CLT é ilegal** (TCU pacífico). RT sem vínculo formalizado vira lacuna-tarefa, não bloqueia o GO.

> Fonte: doc 26 §3.1, §3.2, §10 (conclave Justen+Niebuhr); §11 (corpus 0/12 vedam, 2 com teto 2); legal-constants.json (`technicalQuantityCeilingPct = 0.5`).

## Econômico-financeira — art. 69

- **Regra dos 10%:** o edital pode exigir capital social mínimo ou patrimônio líquido mínimo limitado a até **10% do valor estimado** (cláusula real 12.6.5). `ATENDE` se `PL(último exercício) ≥ percentualPL × valorEstimado`.
- **Capacidade é TEMPORAL** (`FinancialSnapshot` por exercício): o edital quase sempre exige o "balanço do último exercício social exigível". A capacidade não é atributo fixo da empresa; é snapshot datado. O **teto de habilitação solo é calculado, dinâmico e datado**: `valorMaxSolo = PL(último exercício) / 0,10`.
- **Índices** (quando exigidos): LC = AC/PC, LG, SG ≥ limiar do edital (tipicamente ≥1,0).

> Fonte: doc 26 §1.2, §1.3 (cláusula 12.6.5), §3.3; noyce-habilitation.ts (`evaluateEconomicFinancial`).

## Consórcio — art. 15

Base legal correta = **Lei 14.133/2021 art. 15** (corrige citação anterior a "art. 65/66").

| Dimensão | Regra de agregação em consórcio | Dispositivo |
|---|---|---|
| Técnica (CAT/CAO) | **SOMATÓRIO INTEGRAL** dos quantitativos de cada consorciado, sem proporcionalidade | art. 15 §2º |
| Econômico-financeira | **SOMATÓRIO na PROPORÇÃO** da participação de cada um | art. 15 §3º |
| Acréscimo | edital pode exigir **+até 30%** sobre o exigido do licitante individual… | art. 15 §4º |
| …exceção ME/EPP | **…dispensado se o consórcio for composto INTEGRALMENTE por ME/EPP** | art. 15 §4º |
| Formalização | compromisso de constituição assinado por todos + líder com poderes + responsabilidade solidária | art. 15 §1º |

Como a ENIAC é ME, um consórcio ENIAC + outra ME/EPP **dispensa o acréscimo de 30%** — vantagem a sinalizar. Ver detalhamento no doc `06-consorcio`.

> Fonte: doc 26 §4, §10 (conclave); noyce-habilitation.ts (`buildConsortiumEvaluation`).

## ME/EPP

A ENIAC é **ME · Simples Nacional**. Além da dispensa do acréscimo de 30% em consórcio 100% ME/EPP (art. 15 §4º), o porte ME/EPP carrega tratamento favorecido na Lei 14.133 (ex.: regularidade fiscal regularizável). Sempre registrar o porte da empresa parceira no toggle de consórcio para avaliar a dispensa.

> Fonte: doc 26 §0 (porte ME), §4 (dispensa ME/EPP).

## Prazos de publicação (art. 55) — usados na triagem por prazo

Prazos mínimos entre a divulgação do edital e a apresentação de propostas (em **dias úteis**). O **regime** (integrada/semi-integrada) prevalece sobre o critério de julgamento — testar regime ANTES do critério.

| Objeto / critério | Prazo mín. (dias úteis) | Dispositivo |
|---|---|---|
| Bens — menor preço/maior desconto | 8 | art. 55, I, a |
| Bens — demais | 15 | art. 55, I, b |
| Obras/serviços engenharia COMUNS — menor preço/maior desconto | 10 | art. 55, II, a |
| Obras/serviços engenharia ESPECIAIS — menor preço/maior desconto | 25 | art. 55, II, b |
| Técnica e preço / melhor técnica / maior retorno econômico | 35 | art. 55, III |
| Contratação INTEGRADA | 60 | art. 55, IV |
| Contratação SEMI-INTEGRADA | 35 | art. 55, V |

> Fonte: legal-constants.json (`publicationMinimums`, corrigido conclave 12/Jun com Justen).

## Outros limites legais relevantes

- **Garantia de proposta:** limitada a **1% do valor estimado** (art. 58).
- **Impugnação:** pedido até **3 dias úteis** antes da data de abertura do certame (art. 164). Janela curta → tarefa de esclarecimento/impugnação preventiva quando o edital tem exigência de zona cinzenta.

> Fonte: legal-constants.json (`proposalGuaranteeMaxPct`, `impugnationWindowBusinessDays`).
