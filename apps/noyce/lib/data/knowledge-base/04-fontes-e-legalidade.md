---
title: Fontes de licitação — calibração legal e atos só-humano
docId: fontes-e-legalidade
tags: [fontes, pncp, bll, bnc, pcp, comprasgov, sislog, scraping, tos, descoberta, vault, human-required-acts, legalidade]
audience: agents
sourceRefs:
  - apps/noyce/lib/noyce-source-registry.ts
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
---

## Princípio: descoberta SEMPRE via PNCP

A espinha de descoberta é o **PNCP** (open data, Lei 14.133 art. 174), que já agrega editais de BLL/BNC/PCP/ComprasGov. Adapters específicos por portal só são necessários para **acesso autenticado ao certame da própria ENIAC** — e esses ficam `blocked_until_vault`. Regra prática para os agentes: **nunca raspar o HTML de um portal privado para descobrir editais**; o discovery vem do PNCP, mesmo quando a leitura pública daquele portal seria tolerada.

> Fonte: noyce-source-registry.ts (comentário de topo + `discoveryVia`); doc 29 §1.

## Calibração legal por fonte

| Fonte | Política de scraping | Leitura pública agora? | Descoberta via | Automação autenticada |
|---|---|---|---|---|
| **PNCP** | open_data | Sim (API oficial) | self | livre (0 gates) |
| **Compras.gov.br** | open_data | Sim (API oficial) | self | login SICAF só pós-vault (1 gate) |
| **BLL** | silent_tolerated | Sim (consulta/download públicos, mas HTML) | **pncp** | só certame ENIAC pós-vault (1 gate) |
| **BNC** | silent_tolerated | Sim (HTML público sem login) | **pncp** | só certame ENIAC pós-vault (1 gate) |
| **PCP (Portal de Compras Públicas / ECUSTOMIZE)** | **prohibited** | **NÃO automatizada** (só manual/pontual) | **pncp** | vault + permissão expressa (2 gates) |
| **SISLOG** | unknown | Não | pncp | revisão legal pendente (1 gate) |

Detalhes que os agentes devem respeitar:
- **PNCP / ComprasGov:** API oficial, leitura permitida e incentivada por lei. Operação autônoma liberada agora.
- **BNC / BLL:** operadores privados, silentes sobre robots; leitura pública tolerada (baixo risco), mas **não raspar o HTML** — descoberta via PNCP. Autenticação → vault.
- **PCP (ECUSTOMIZE):** o regulamento **proíbe expressamente** robôs/spider/page-scraping (Reg. 5.3.1.1/5.3.1.2). **Nunca raspar**; descoberta só via PNCP; login exige vault **e** permissão expressa da ECUSTOMIZE (API/parceiro).

> Fonte: noyce-source-registry.ts (`noyceSources`, campos `scrapingPolicy`/`publicReadAllowedNow`/`discoveryVia`/`vaultGates`/`legalReview`); revisões em docs/.../03-legal/.

## Atos vinculantes — sempre humano, em qualquer fonte

O registry define `HUMAN_REQUIRED_ACTS = ["lance", "declaracao", "proposta", "recurso", "contrarrazoes", "impugnacao_edital", "resposta_diligencia"]` (lista ampliada — I1/C-NOVO-6, unificada com `MAESTRO_BINDING_ACTS` em 02/Jul). Estes atos **nunca** são executados pelo Noyce em nenhuma fonte — exigem clique humano. A responsabilidade jurídica é irretratável e pode ser criminal (BLL Art. 13§3/27/32; Lei 14.133 art. 155). O Noyce **só puxa** informação; não atua dentro do portal.

Helpers de referência no registry:
- `canRunSourceNow(source)` — pode operar a fonte autonomamente agora (descoberta/leitura pública).
- `canReadPublicNow(source)` — leitura pública (consulta/download) legalmente clara agora.
- `getDiscoveryRoute(source)` — onde obter descoberta (própria API ou PNCP).
- `isScrapingProhibited(source)` — true para PCP; nunca crawl.
- `requiresHumanAct(act)` — true para todo `BindingAct`.

> Fonte: noyce-source-registry.ts (`HUMAN_REQUIRED_ACTS` + funções exportadas).

## Gates de vault e prontidão

A coluna `vaultGates` indica quantas travas faltam para ligar a automação autenticada de cada fonte. Enquanto não destravado, a aba Governança mostra o bloqueio com dono e o `nextHumanInput` (ex.: "Login só no certame da ENIAC, pós-vault. E-mail à BLL pedindo API/parceiro"). Agentes não devem assumir acesso autenticado a BLL/BNC/PCP/SISLOG até o vault estar configurado e (no caso do PCP) a permissão expressa concedida.

> Fonte: noyce-source-registry.ts (`vaultGates`, `nextHumanInput`, `automationStatus`).

## Backlog confirmado pela cliente sobre fontes

- **Expandir o raio** de busca além dos 170 km atuais (→ 500 km via IBGE haversine). O raio foi limitado de propósito; vai crescer.
- **`permiteConsorcio`** como flag por licitação já na busca (descoberta) — para já filtrar habilitação técnica e, se não dá solo mas permite consórcio, procurar parceiro.

> Fonte: doc 29 §6 (raio), §7 (`permiteConsorcio`), Backlog NOVO.
