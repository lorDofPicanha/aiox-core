---
title: As 7 abas do workflow Noyce — responsabilidade, agente, entradas/saídas, escalonamento
docId: workflow-abas
tags: [abas, mesa, monitorar, analisar, habilitar, acompanhar, recorrer, governanca, triagem, lifecycle, workflow]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/23-arquitetura-abas-por-area-29mai.md
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - docs/projects/buscador-licitacoes/02-architecture/29-requisitos-reuniao-cliente-eniac-15jun.md
  - apps/noyce/lib/noyce-operational.ts
---

## Princípio comum a todas as abas

Cada aba é um loop **BUSCAR → ANALISAR → ENTREGAR**. As abas são **globais por verbo**, não rotas por oportunidade: a unidade de trabalho é uma *fase do dia* (a equipe de 4 divide por função), e a oportunidade é selecionada via `?op=<id>`. Estado que liga tudo: o campo `Lifecycle` persistido na `Opportunity` (phase + triageVerdict + history com quem/quando).

**Invariante anti-regressão (vale para todas):** nenhum veredito, mercado, readiness ou recurso pode derivar de `opportunityScore`/`confidenceScore`. Todo dado `grounded` rastreia a fonte; todo `inferred`/`gap` renderiza com chip visível. Ao sair de qualquer aba, o operador leva um artefato/decisão — não números soltos.

> Fonte: doc 23 (princípio reitor + invariante anti-regressão + estado Lifecycle).

## Aba 0 — Mesa

**Responsabilidade:** trabalho do dia priorizado + roteamento para a próxima ação. É a primeira tela: "o que faço agora".

- **Entrada:** todas as oportunidades por `lifecycle.phase`.
- **Análise:** ordena por urgência × consequência; aplica a fila de triagem (descarta Pula, Vai primeiro, cap ~12 itens/dia).
- **Saída (ENTREGAR):** lista "faça X em Y" com deep-link para a aba certa. O agente operacional usa `buildNextStep` (verbo + objeto + dono + prazo + porquê).
- **Quando escalar:** quando o próximo passo é um ato vinculante (lance/proposta) → roteia para o humano dono (Comercial/Operação ENIAC).

> Fonte: doc 23 (Mesa); noyce-operational.ts (`buildNextStep`).

## Aba 1 — Monitorar

**Responsabilidade:** achar editais novos no raio/CNAE (via PNCP) e triá-los. Agente: descoberta/busca (papel da Giovanna na ENIAC).

- **Entrada:** varredura `/contratacoes` do PNCP (modalidades 4+6) no cluster geográfico.
- **Análise (triagem `buildTriage`):** combina relevância-obras (regex de objeto: obra/engenharia/reforma/pavimentação/drenagem/UBS/escola/creche etc.) + distância + valor + prazo → verdict + razão humana. Nunca deriva de score opaco.
  - **Vai** = obra dentro do raio próximo (≤170 km), valor na faixa (R$80k–R$8M), prazo ≥3 dias.
  - **Olha** = é obra mas tem ressalva: prazo curto, valor fora da faixa típica, ou distância maior.
  - **Pula** = objeto fora de obras/engenharia, fora do raio operacional (>500 km), prazo encerrado, OU mercado muito concentrado (concorrente que venceu repetidamente o mesmo objeto).
- **Saída:** fila Vai/Olha/Pula com badge + razão + filtro + contadores, e push (WhatsApp) — além do chip de suspeita do detector R3 (doc 26 §6).
- **Quando escalar:** licitação que permite consórcio e a ENIAC não fecha sozinha → sinalizar para buscar parceiro (campo `permiteConsorcio`, backlog doc 29).

> Fonte: doc 23 (Monitorar + triagem); noyce-operational.ts (`buildTriage`, faixas e regex); doc 29 §6 (Vai/Olha/Pula, raio, Pula por concentração); doc 26 §6 (chip de suspeita).

## Aba 2 — Analisar

**Responsabilidade:** julgar a oportunidade — dá para ganhar, a que preço, contra quem. Agente: análise (papel da Alice no processo final).

- **Entrada:** estrutura de mercado real (HHI/share/incumbente/preço do órgão, do market-snapshot) + prazo + elegibilidade vinda da Habilitar.
- **Análise — veredito decomposto em DOIS fatores nunca fundidos num número opaco:**
  1. **Elegibilidade (gate):** `GO / NO-GO / GO-com-lacunas`, 100% grounded em requisito × acervo. Sem elegibilidade, probabilidade é irrelevante.
  2. **Competitividade (probabilístico):** dado que elegível, qual a chance — HHI/share/incumbente/preço + força relativa do acervo (folga de quantitativo derruba concorrentes menores).
- **Saída:** veredito Vai/Não-Vai + 5 frases, cada uma com fonte. Ex.: "ELEGÍVEL (solo) · folga técnica alta · órgão com incumbente forte (share 40%) · preço-alvo R$ X".
- **Regra de ouro:** probabilidade nunca deriva de `opportunityScore`; deriva de dados citáveis (acervo + histórico do órgão). Frase sem fonte = "dado insuficiente".
- **Quando escalar:** veredito final é apoio à decisão; quem decide entrar é humano.

> Fonte: doc 23 (Analisar); doc 26 §5 (decomposição elegibilidade × competitividade + regra de ouro).

## Aba 3 — Habilitar

**Responsabilidade:** saber se a ENIAC qualifica + montar o dossiê. Agente: habilitação técnica (motor `buildHabilitationResult`).

- **Entrada:** ERM (requisitos extraídos do edital, com citação de cláusula) × CCP (acervo/RTs/financeiro/regularidade da ENIAC). Toggle **com/sem consórcio** definido antes de abrir a análise.
- **Análise:** 4 avaliadores independentes (técnico-profissional, técnico-operacional, econômico-financeira, jurídica/fiscal/trabalhista), cada um devolvendo `{status, evidência, lacuna?, sanabilidade}`. Régua sanável × insanável (art. 64).
- **Saída:** dossiê montado (checklist tenho/não-tenho por bloco) + **GO/NO-GO solo e consórcio** + lacunas como tarefas (ex.: "falta CND municipal", "anexar vínculo do RT Rodrigo", "acervo de drenagem 200 m² abaixo do exigido"). Dois modos de export: consolidado (PDF/HTML/planilha) **e** individual por categoria (re-envio pontual ao portal).
- **Quando escalar:** toda declaração/proposta gerada vai para revisão humana (Alice corrige 100%); o envio ao portal é ato humano.

> Fonte: doc 23 (Habilitar); doc 26 §3, §7 (4 avaliadores, entrega); noyce-habilitation.ts; doc 29 §5 (dois modos de export).

## Aba 4 — Acompanhar

**Responsabilidade:** vigiar sessão/movimentação (a "DOR #1" do cliente). Agente: acompanhamento operacional.

- **Entrada:** prazos + sessão do certame.
- **Análise:** monitora deadlines (cálculo com a data real, não snapshot congelado) → tiers de risco.
- **Saída:** alerta acionável + "baton" de recurso (~10 min para o operador agir). Push depende de sessão autenticada (atrás de vault + ToS).
- **Quando escalar:** acompanhar sessão autenticada e dar lance são atos dentro do portal → humano.

> Fonte: doc 23 (Acompanhar, DOR #1); noyce-operational.ts (`daysUntil`/`isDeadlinePassed`).

## Aba 5 — Recorrer

**Responsabilidade:** decidir se há fundamento e minutar o recurso. Agente: análise jurídica por IA (apoio).

- **Entrada:** documentos do vencedor + edital + RAG (Lei 14.133/TCU).
- **Análise:** avalia recorrido/preclusão → go/no-go de recurso.
- **Saída:** go/no-go + minuta. **O protocolo é bloqueado** — `recurso` é `HUMAN_REQUIRED_ACT`; humano revisa e protocola.
- **Quando escalar:** sempre — a decisão final e o protocolo são humanos (doc 25 R9).

> Fonte: doc 23 (Recorrer); doc 25 R9 (IA analisa, humano protocola); noyce-source-registry.ts (`recurso` em HUMAN_REQUIRED_ACTS).

## Aba 6 — Acessos & Governança

**Responsabilidade:** portais/vault/ToS/prontidão — fora do fluxo de caça à licitação.

- **Entrada:** `portalAccess` + readiness por fonte.
- **Saída:** status de prontidão + bloqueios com dono (ex.: "BLL aguarda vault", "PCP precisa de permissão expressa").
- **Quando escalar:** configurar credenciais e aceitar ToS são atos humanos/de governança.

> Fonte: doc 23 (Governança); noyce-source-registry.ts (`vaultGates`, `nextHumanInput`).

## Usuários e papéis

4 logins, workspace **compartilhado** (todos veem o trabalho uns dos outros — não há sessões individuais). **Aline** = administrador; os outros 3 = login normal. Papéis para otimizar a UI: **Alice** → proposta + planilhas + análise do processo final; **Giovanna** → busca + monta documentações.

> Fonte: doc 29 §8 (4 logins, papéis, workspace compartilhado).
