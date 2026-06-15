---
title: Documentos de habilitação e validades
docId: habilitacao-documentos
tags: [documentos, certidoes, cnd, fgts, balanco, atestado, cat, cao, validade, vault, vinculo-rt, declaracoes, regularidade]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - apps/noyce/lib/noyce-habilitation.ts
---

## Tabela mestra de documentos × validade

A cliente confirmou (reunião 15/Jun) os documentos que alimentam o banco de dados de habilitação e suas validades. A **validade na data da sessão** é o que define se o documento `ATENDE` ou vira lacuna.

| Categoria | Documentos | Validade |
|---|---|---|
| **Fiscal/trabalhista** | Certidões: trabalhista, municipal, estadual, federal, FGTS | **Municipal, falência e FGTS = atualizar todo mês**; demais conforme emissão |
| **Econômico-financeira** | Certidão negativa de falência + **balanços patrimoniais** | **Anual** (último exercício social exigível) |
| **Qualificação técnica** | **Atestados / CATs** (reforma → atestado de reforma; construção → de construção) | Conforme acervo (permanente, salvo perda de vínculo do RT) |
| **Empresa** | CNPJ, endereço | Constante |

**GAP declarado pela cliente:** a qualificação técnica (atestados) é onde falta dado/cobertura. Os atestados devem ficar **dentro do sistema** para alimentar as declarações que o edital pedir.

> Fonte: doc 29 §3 (tabela de documentos + validades + GAP atestados).

## Certidões de regularidade (fiscal/trabalhista/jurídica)

Modeladas como `RegularityDoc[]` no CCP: `{tipo, orgao, validade, status, arquivoRef}`. O avaliador casa cada CND exigida pelo ERM contra o CCP por tipo + validade na `dataSessao`:
- Documento `vigente` e válido na data da sessão → `ATENDE`.
- Vencido ou ausente → `PARCIAL` + tarefa "providenciar {documento}". Sempre **SANÁVEL** (é documento formal, não capacidade substantiva) → não bloqueia o GO.

Atenção operacional às validades **mensais** (municipal, falência, FGTS): são as que vencem com mais frequência e precisam de re-emissão antes de cada sessão.

> Fonte: noyce-habilitation.ts (`evaluateRegularity`, `isValidOn`); doc 26 §2.A(e) (`RegularityDoc`).

## Balanços patrimoniais e capacidade econômico-financeira

O balanço é **anual** e a capacidade é **temporal** — modelada como `FinancialSnapshot[]`, uma linha por exercício. O motor seleciona sempre o **snapshot mais recente válido** (o "último exercício social exigível"), nunca um obsoleto. Tratar a empresa por um número fixo de PL é bug de modelagem: o teto de habilitação solo sobe a cada exercício.

Campos do snapshot: `exercicio`, `patrimonioLiquido`, `capitalSocial`, `ativoCirculante`/`passivoCirculante` (para índices LC/LG/SG), `receitaBruta`, `resultado`, `fonte` (protocolo do balanço assinado). Cada campo carrega proveniência.

> Fonte: doc 26 §1.2, §2.A(d), §3.3; noyce-habilitation.ts (`latestFinancial`, `financialRatio`).

## Atestados / CATs — os dois eixos de acervo

A Lei 14.133 art. 67 separa dois eixos, e o dado real da ENIAC confirma:
- **Técnico-PROFISSIONAL (CAT):** atestado no nome do **engenheiro/RT** (Alice Ramos Silva — CREA-GO; Rodrigo Piloto Amaro — CREA-DF). Só vale para a ENIAC se o profissional estiver **no quadro técnico** dela no momento da habilitação. O vínculo é modelado como `{tipo: CLT/contrato/sócio/declaração, desde}` e é **SANÁVEL** (declaração de contratação futura basta — exigir CLT é ilegal).
- **Técnico-OPERACIONAL (CAO):** capacidade da **pessoa jurídica** (atestado em nome da empresa, emitido pelo **contratante** — CREA não emite acervo de PJ, art. 67, II + Res. CONFEA 1.025/2009). Hoje a ENIAC só tem CATs profissionais; o CAO operacional é dependência pendente (D-26.2). O motor reserva o slot e, quando falta CAO, a tarefa correta é "obter atestado de capacidade operacional emitido pelo contratante em nome da empresa" — nunca "emitir CAO via CREA".

**Tipo de atestado segue o objeto:** reforma → atestado de reforma; construção/execução → atestado de construção. O `Acervo` carrega `tipo ∈ {CAT_PROFISSIONAL, CAO_OPERACIONAL, ATESTADO_SIMPLES}`, `participacaoTecnica ∈ {Individual, Corresponsavel}` (gancho do consórcio), contratante, valor, período, status e os `itens[]` (serviço canônico + quantidade + unidade).

> Fonte: doc 26 §1.1, §2.A(b)(c), §3.1, §3.2; doc 29 §3; noyce-habilitation.ts (`evaluateTechnicalProfessional`, `evaluateTechnicalOperational`, `atestadoTask`).

## Quantitativo + unidade são a moeda do matching

Todo item de atestado tem `quantidade + unidade` (m², m³, kVA, m, un). A exigência do edital é "atestado de no mínimo X [un] de [serviço]". **O match é numérico, não textual.** A ponte entre o vocabulário CONFEA do atestado e a descrição do edital é a Service Taxonomy (ver doc `04-fontes-e-legalidade` e o motor de matching no doc 26 §4 / §2.C). Quando a quantidade soma os N maiores acervos da mesma classe respeitando `maxAtestados`, o resultado pode `ATENDE`; se nem somando cobre, é lacuna **INSANÁVEL**.

> Fonte: doc 26 §1.1 item 4, §2.C, §3.2; noyce-habilitation.ts (`acervoQuantities`, `topN`).

## Declarações e dois modos de export

As declarações exigidas pelo edital são auto-preenchidas (R4), sempre com **revisão humana** (Alice). O dossiê é entregue em dois modos:
- **Consolidado:** PDF + HTML + planilha juntando fiscal/trabalhista, qualificação técnica, econômico-financeiro, garantia de proposta, visita técnica, proposta e planilha — para o cadastro inicial (manda tudo junto).
- **Individual por categoria:** baixável um a um, por licitação específica — para quando o portal **devolve** um documento e precisa reenviar só aquele.

Para consórcio, os documentos da empresa parceira também saem nos dois modos.

> Fonte: doc 29 §5 (dois modos de export), §7 (consórcio individual+consolidado); doc 26 §7 (entrega Habilitar).

## Proveniência obrigatória

Invariante não-negociável: todo dado do CCP e todo requisito do ERM cita fonte/cláusula. Dado `inferred`/`gap` renderiza com chip visível. Nada no profile é "inferido" sem chip. Credenciais e arquivos sensíveis ficam **só no vault** — nunca em doc/JSON/git/print.

> Fonte: doc 26 §2.A (invariante de proveniência), §9 invariantes 1 e 4.
