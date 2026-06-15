---
title: Noyce — Visão geral e divisão IA × humano
docId: overview
tags: [noyce, eniac, licitacao, fluxo, buscar-analisar-entregar, human-required-acts, escopo, disclaimer]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
  - docs/projects/buscador-licitacoes/02-architecture/23-arquitetura-abas-por-area-29mai.md
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - apps/noyce/lib/noyce-source-registry.ts
---

## O que é o Noyce

O Noyce é o buscador/analisador de licitações da **ENIAC EMPREENDIMENTOS LTDA** (CNPJ 36.819.268/0001-05), uma construtora ME do Simples Nacional sediada em Águas Lindas de Goiás-GO que disputa obras e serviços de engenharia. O sistema atende uma equipe de 4 pessoas (workspace compartilhado) e cobre o ciclo completo de uma licitação: **achar o edital, julgar se vale a pena, verificar se a ENIAC qualifica, montar o dossiê documental e acompanhar/recorrer**.

O princípio reitor de produto é: cada aba é um loop fechado **BUSCAR → ANALISAR → ENTREGAR**, onde ENTREGAR significa um artefato ou decisão na mão do operador (um dossiê, um veredito, uma lista de tarefas) — nunca "um painel de números". Teste de aceite de qualquer funcionalidade: *"ao sair da aba, o operador leva [X]"* — se X for só "uns números", a entrega está errada.

> Fonte: doc 23 (princípio reitor das abas); doc 26 §0 (identidade canônica ENIAC); doc 29 §1 (escopo confirmado pela cliente).

## O fluxo geral (busca → análise → entrega)

1. **Descoberta** (aba Monitorar): varre o PNCP por raio/CNAE, triaga cada edital em **Vai / Olha / Pula**.
2. **Priorização** (aba Mesa): organiza o trabalho do dia por urgência × consequência e roteia para a próxima ação.
3. **Análise** (aba Analisar): cruza estrutura de mercado (HHI/share/preço do órgão) + prazo → veredito Vai/Não-Vai decomposto em **elegibilidade** (gate) + **competitividade** (probabilístico).
4. **Habilitação** (aba Habilitar): casa requisitos do edital × acervo da ENIAC (CCP) → dossiê montado + **GO / NO-GO / GO-com-tarefas** + lacunas como tarefas.
5. **Acompanhamento e recurso** (abas Acompanhar/Recorrer): vigia prazos/sessão e, se houver fundamento, minuta o recurso para revisão humana.

Status real da entrega à cliente (15/Jun): hoje funciona o **buscador + análise**; o workflow completo de geração de planilha/proposta depende do banco de dados (ETA 2-3 dias na data do doc 29). Agentes não devem prometer geração automática de proposta como já operacional sem confirmar o estado do DB.

> Fonte: doc 23 (mapa das 7 abas + loop); doc 29 §9 (status real e timeline).

## O que os agentes fazem (autônomo)

- **Puxar** todas as licitações de fontes públicas (PNCP é a espinha de descoberta; agrega BLL/BNC/PCP/ComprasGov).
- **Análise técnica do edital**: fonte, raio de cobertura, evidência, score determinístico, pendências, lacunas a preencher, citação obrigatória da cláusula de origem.
- **Montar** proposta, planilha, declarações e o processo documental (rascunho).
- **Gerar o dossiê final** (PDF, HTML, planilha) — a equipe revisa, aprova ou corrige (loop de correção).

> Fonte: doc 29 §1 (Noyce faz / humano faz).

## O que é SEMPRE humano (a IA não pode, por design)

A automação termina onde começa o **ato vinculante**. O registry de fontes define `HUMAN_REQUIRED_ACTS = ["lance", "declaracao", "proposta", "recurso"]` — estes atos exigem **clique humano** sempre, em qualquer fonte, e nunca são executados pelo Noyce. A justificativa é dupla: a plataforma bloqueia tecnicamente, e a responsabilidade jurídica é irretratável e pode ser criminal (BLL Art. 13§3/27/32; Lei 14.133 art. 155).

Concretamente, é humano:
- **Dar lances** — a IA não consegue e a plataforma bloqueia.
- **Qualquer ação dentro das plataformas** (BLL, Portal de Compras, BNC): o Noyce só **puxa** informação, não atua dentro do portal.
- **Aprovar/corrigir** todo documento gerado pela IA (proposta, recurso, habilitação). A cliente foi explícita: "as entregas da IA não são 100% verídicas" → revisão humana é obrigatória.

> Fonte: doc 29 §1; noyce-source-registry.ts (`HUMAN_REQUIRED_ACTS`, comentários de calibração legal); doc 26 §9 invariante 3.

## Disclaimer obrigatório em toda saída

Toda saída do motor para a cliente carrega o disclaimer: *"Noyce organiza evidências e lacunas para revisão humana; não substitui análise jurídica, contábil ou decisão da ENIAC."* As bases doutrinárias usadas no design (clones Justen-Filho/Niebuhr) são apoio à decisão de produto — não substituem parecer de advogado habilitado para o caso concreto.

> Fonte: noyce-habilitation.ts (constante `DISCLAIMER`); doc 26 §10 (disclaimer exigido pelos clones).
