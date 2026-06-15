---
title: Consórcio — quando, como e o toggle com/sem consórcio
docId: consorcio
tags: [consorcio, art-15, soma-integral, soma-proporcional, acrescimo-30, me-epp, parceiro, lider, compromisso, permite-consorcio, toggle]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
  - apps/noyce/lib/noyce-habilitation.ts
---

## Por que consórcio importa para a ENIAC

A ENIAC participa de algumas licitações em consórcio (e tem âncora real no dado: a CAT MESTRE ZEZITO foi executada como `Corresponsável` junto à SCB Engenharia). O motor precisa avaliar **ambos os modos** — solo e consórcio — e mostrar o melhor caminho. Consórcio é **feature de 1ª classe** priorizada pela cliente na reunião de 15/Jun.

> Fonte: doc 26 §1.1 item 2, §4; doc 29 §7 (consórcio = feature de 1ª classe).

## Regras de agregação (Lei 14.133 art. 15)

| Dimensão | Regra em consórcio | Dispositivo |
|---|---|---|
| **Técnica (CAT/CAO)** | SOMATÓRIO **INTEGRAL** dos quantitativos de cada consorciado, sem proporcionalidade | art. 15 §2º |
| **Econômico-financeira** | SOMATÓRIO na **PROPORÇÃO** da participação de cada um | art. 15 §3º |
| **Acréscimo** | edital pode exigir **+até 30%** sobre o exigido do licitante individual… | art. 15 §4º |
| **…exceção ME/EPP** | **…dispensado se o consórcio for composto INTEGRALMENTE por ME/EPP** | art. 15 §4º |
| **Formalização** | compromisso de constituição assinado por todos + líder com poderes + responsabilidade solidária; docs de cada consorciado | art. 15 §1º |

Citação correta = **art. 15** (corrige referência anterior a "art. 65/66"), validada no conclave Justen+Niebuhr.

> Fonte: doc 26 §4, §10.

## Quando a ENIAC precisa de parceiro

Desde a correção do PL (2025 = R$919.170,54, teto solo R$9,19mi), a ENIAC habilita **solo no econômico-financeiro em 100% do corpus**. Logo, o consórcio **não** é mais gatilhado por PL. O gatilho real migrou para a **lacuna técnica de acervo**: dispara quando o quantitativo da ENIAC em uma classe de serviço fica abaixo da parcela de maior relevância exigida, e a soma integral (art. 15 §2º) com um parceiro detentor desse acervo fecha a lacuna.

Saída comparativa atualizada que o motor deve produzir: *"Solo: GO no econ-fin (headroom 3,2×) · lacuna técnica em [classe X: faltam Y m²]. Consórcio com parceira detentora de acervo ≥ Y m² em [classe X]: GO pleno."* — a recomendação aponta **qual acervo procurar no parceiro**.

> Fonte: doc 26 §1.2, §3.3, §4 (revisão 10-11/Jun).

## Vantagem ME/EPP

Como a ENIAC é ME, um consórcio ENIAC + outra **ME/EPP** dispensa o acréscimo de até 30% (art. 15 §4º) — vantagem a sinalizar sempre. Por isso é obrigatório registrar o **porte da empresa parceira** no toggle: se ambas forem ME/EPP, `acrescimo30Dispensado = true` e `vantagemMeEpp = true`. Se a parceira não for ME/EPP, o consórcio pode sofrer o acréscimo conforme o edital.

> Fonte: doc 26 §4; noyce-habilitation.ts (`buildConsortiumEvaluation`, `allMeEpp`).

## O toggle com/sem consórcio (UX confirmada)

Antes de abrir a análise de habilitação, o operador escolhe **com / sem consórcio**:
- **Sem consórcio:** o motor roda os 4 blocos sobre o CCP da ENIAC.
- **Com consórcio:** o sistema entende que há mais uma empresa envolvida e **pede o documental dela** (dados da parceira) para já gerar as declarações de consórcio. O motor monta um `ConsortiumProfile` virtual = união de itens de acervo (soma integral) + PL somado na proporção dos membros, com `liderId`, `percentualParticipacao[]` e `acrescimo30`, e roda os 4 blocos sobre esse profile virtual.

Pedido explícito da cliente (backlog): já na **busca da licitação**, informar se o edital **permite consórcio ou não** (campo `permiteConsorcio`) — para olhar direto a habilitação técnica e, se não dá solo mas permite consórcio, já procurar parceiro.

> Fonte: doc 29 §7 (toggle + `permiteConsorcio`); doc 26 §4 (`ConsortiumProfile`); noyce-habilitation.ts (`ConsortiumOption`).

## Onde consórcios são inabilitados (atenção do dossiê)

O risco operacional não é a soma de números — é a **formalização**: compromisso de constituição mal feito (falta assinatura de algum consorciado) e líder sem poderes são as causas frequentes de inabilitação (Niebuhr). O dossiê (aba Habilitar) **deve montar e validar esses documentos**, não só somar capacidades. Emitir os documentos de consórcio nos dois modos (consolidado e individual por categoria).

> Fonte: doc 26 §4 (onde consórcios são inabilitados); doc 29 §5, §7 (export consolidado + individual).

## Anti-conluio (guardrail)

Como é single-company, o alerta de conluio é soft — só dispara se duas empresas do mesmo tenant entrarem no mesmo edital (CONTEXT §10.2 / art. 14). Mantido como guardrail, não pilar.

> Fonte: doc 26 §4 (anti-conluio).
