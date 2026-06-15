---
title: Regras de negócio operacionais — proposta, triagem, prazo, export
docId: regras-de-negocio
tags: [proposta, valor-cheio, readequada, papel-timbrado, triagem, vai-olha-pula, prazo, edital-fechado, export, consolidado, individual, revisao-humana]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
  - docs/projects/buscador-licitacoes/02-architecture/23-arquitetura-abas-por-area-29mai.md
  - apps/noyce/lib/noyce-operational.ts
---

## Fluxo da proposta (valor cheio → readequada)

- O **modelo de proposta normalmente vem no próprio edital**. Quando o edital pede um modelo específico, a ENIAC adapta — mas sempre no **papel timbrado** dela.
- **Proposta inicial = valor cheio** da lista. Só **depois da etapa de lance** se manda a **proposta readequada**, com o desconto dado nos lances.
- O dado que a ENIAC de fato preenche = **só dados da empresa** (CNPJ, endereço — constantes). O resto vem do certame; o Noyce adapta.

Implicação para os agentes: nunca gerar a proposta readequada antes da etapa de lance; a sequência é cheia → lance (humano) → readequada. Toda proposta passa por revisão humana (Alice) antes do envio.

> Fonte: doc 29 §2 (fluxo de proposta); doc 26 §9 invariante 3 (revisão humana).

## Triagem Vai / Olha / Pula

A triagem (`buildTriage`) classifica cada contratação com um verdict + razão humana, combinando relevância-obras + distância + valor + prazo. Nunca deriva de score opaco.

- **Vai** = obra dentro do raio próximo (≤170 km), valor na faixa (R$80k–R$8M) e prazo ≥3 dias. Entra na fila do dia (Mesa).
- **Olha** = é obra mas há ressalva a checar: prazo curto (ex.: 26 dias é citado como caso real de prazo apertado para a operação), valor fora da faixa típica, ou distância maior (até 500 km).
- **Pula** = objeto fora de obras/engenharia (perfil ENIAC), fora do raio operacional (>500 km), prazo encerrado, OU **mercado muito concentrado**.

**Pula por concentração:** o sistema puxa os últimos 6 meses de licitações do mesmo objeto + empresas vencedoras + valores (ex.: um concorrente que venceu somando R$30M no mesmo objeto). É **recomendação** — a equipe decide se bate o concorrente.

As licitações exibidas são **reais, abertas e vão acontecer**.

> Fonte: doc 29 §6 (Vai/Olha/Pula, prazo curto, Pula por concentração, licitações reais); noyce-operational.ts (`buildTriage`, faixas).

## Regra de prazo: edital fechado não é oportunidade

O cálculo de prazo usa a **data real de hoje** (não um snapshot congelado). Um edital cujo prazo de proposta já passou **não** é exibido como oportunidade aberta — vira Pula com razão "Prazo encerrado há N dia(s)". Os prazos mínimos legais de publicação (art. 55, em dias úteis) alimentam a categoria de prazo na triagem; ver doc `02-legal-lei-14133`. A janela de impugnação (art. 164: até 3 dias úteis antes da abertura) também é prazo crítico — tarefa de esclarecimento/impugnação preventiva quando houver exigência de zona cinzenta.

> Fonte: noyce-operational.ts (`nowIso`/`isDeadlinePassed`/`daysUntil`); doc 29 §6 (categoria de prazo); legal-constants.json (art. 55, art. 164).

## Ação concreta, nunca rótulo passivo

Toda saída operacional é "verbo + objeto + dono + prazo + porquê", não um label. O agente usa:
- `buildNextStep` — o próximo passo da oportunidade (ex.: "Monte a proposta agora — prazo 18/06 (4 dias)", dono Comercial ENIAC).
- `describeLacuna` — transforma um token de pendência em tarefa com dono e impacto (ex.: visita técnica → "Agendar a visita técnica no órgão e emitir o atestado de visita", dono Engenharia ENIAC, bloqueante).
- `legalDecisionAction` — a ação recomendada de um ponto de decisão, com aviso de ato externo bloqueado quando aplicável.

> Fonte: noyce-operational.ts (`buildNextStep`, `describeLacuna`, `legalDecisionAction`); doc 23 (teste de aceite: operador leva um artefato, não números).

## Export: consolidado + individual

Dois modos obrigatórios de entrega de documentos:
- **Consolidado:** PDF + HTML + planilha juntando fiscal/trabalhista, qualificação técnica, econômico-financeiro, garantia de proposta, visita técnica, proposta e planilha — para o cadastro inicial (manda tudo de uma vez).
- **Individual por categoria:** salvos por licitação específica, baixáveis um a um — para quando o portal **devolve** um documento e precisa reenviar só aquele.

Vale também para os documentos de consórcio (da empresa parceira).

> Fonte: doc 29 §5 (dois modos), §7 (consórcio); doc 26 §7 (entrega Habilitar).

## Revisão humana é obrigatória

Tudo que a IA gera (proposta, planilha, declaração, recurso, dossiê) é **revisado por humano** antes de virar ato — exigência explícita da cliente ("as entregas da IA não são 100% verídicas"). Atos vinculantes (lance, declaração, proposta, recurso) são sempre clique humano dentro do portal (ver doc `04-fontes-e-legalidade` e `00-overview`). O Noyce organiza evidências e lacunas; a decisão e o protocolo são da ENIAC.

> Fonte: doc 26 §9 invariante 3; doc 25 R5/R9; noyce-source-registry.ts (`HUMAN_REQUIRED_ACTS`).
