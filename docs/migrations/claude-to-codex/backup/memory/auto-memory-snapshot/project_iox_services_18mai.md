---
name: iox-services-18-mai
description: "Programa de 11 squads-serviços derivados da análise da live Alan/LX Fundamentals T5 (4h29min transcrita 18/Mai). DECISÃO FOUNDER: NÃO-SAAS, todos entregues como SERVIÇO premium. Estrutura em docs/projects/iox-services/ com CONTEXT (DSPC, regra 10x, vale-da-morte, tangibilização), ROADMAP (ordem execução tier S→A→B→C), e 11 PRDs. #00 Slide Creator DONE, #01 Contract-on-Call NEXT."
metadata:
  node_type: memory
  type: project
  originSessionId: 18-mai-2026
---

# IOX-Services — Programa de 11 squads-serviços

## Contexto
Análise da live de 4h29min de Alan (founder IOEX/LX/Academia Lendária) em 18/Mai/2026 gerou 11 ideias de tools. **Decisão founder pós-análise: NÃO SaaS** — todos os 11 entregues como SERVIÇO premium com setup + manutenção mensal.

## Estrutura criada

`docs/projects/iox-services/`:
- `00-context/CONTEXT.md` — princípios (DSPC, 10x, vale-da-morte, tangibilização, no-SaaS)
- `00-context/SOURCE-analise-live-18mai.md` — análise estruturada da live
- `00-context/SOURCE-transcript-full.txt` — transcrição 239k chars (Whisper local CUDA, 74min)
- `00-context/SOURCE-transcript.srt` — subtítulos timestamped
- `ROADMAP.md` — ordem de execução + status atual
- 11 pastas (01-11), cada uma com `PRD.md`

## Status

| # | Nome | Tier | Status |
|---|---|---|---|
| 00 | Slide Creator | S | ✅ DONE (skill já adicionada — `session_slide_creator_skill_18mai.md`) |
| 01 | Contract-on-Call Generator | S | 🟢 **NEXT** |
| 02 | NF Emitter Multi-Município | S | ⚪ pending |
| 03 | Workflow Mapper | S | ⚪ pending |
| 04 | Research Dashboard | A | ⚪ pending |
| 05 | Anonymizer/Sanitizer LGPD | A | ⚪ pending |
| 06 | Tangibilização Engine | A | ⚪ pending (meta-orquestrador) |
| 07 | Squad Marketplace | B | ⚪ pending |
| 08 | Cohort OS | B | ⚪ pending |
| 09 | Vitrine Builder | B | ⚪ pending |
| 10 | LLM Cost Optimizer | C | ⚪ pending |
| 11 | Detox Coach | C | ⚪ pending |

## Cases validadores (live)
- **Lígia (TJ)**: jurídico premium → R$30k mentoria
- **Rodrigo Lins (advocacia bancária litígio)**: contract-on-call + +60% YoY
- **Lucas (fisioterapeuta!)**: NF multi-município + R$25k setup + R$3.8k MRR + pipeline R$180k+
- **Rodrigo Feldman (consultor estratégico)**: tangibilização → R$20k brief virou R$180k contrato

## Princípios-chave
1. **DSPC** (Dor cara → Squad → Pitch 1-frase → Contrato premium com continuidade)
2. **Regra 10x** (cobrar 10% do valor que economiza/ganha em 12m)
3. **Vale da morte = preço médio** — só barato (commodity) OU caro (premium >R$15k setup)
4. **Tangibilizar antes da call** — mockup funcional > PDF de proposta
5. **LLM-agnostic** (`.agents/` portátil entre Cloud/Codex/Manus/Antigravity)
6. **Vertical específico > horizontal** — nossos 162 clones permitem nicho impossível p/ concorrência

## Próxima ação
➡️ Kickoff #01 Contract-on-Call Generator — definir vertical, brainstorm DSPC formal, identificar primeiro cliente piloto. Trigger: `kickoff contract-on-call` ou `vai com tool 01`.

⚠️ **Cronograma é conservador** — Anipis Closed Beta 30/Mai tem precedência (DEV-1..7 + SCC Patricia v2). IOX-Services rola em paralelo conforme banda mental.

## Triggers
- `vai com tool {N}` / `kickoff tool {N}` — começa entrega do squad N
- `audit tool {N}` — revisa progresso
- `kill tool {N}` — descontinua
- `pivot tool {N} para {vertical}` — muda nicho
- `cliente {nome} interessado em tool {N}` — abre pasta cliente customizada
- `pausa iox-services` — se Anipis demanda 100%

## Sobreposição AIOS ↔ IOEX
Alan está pavimentando o mesmo caminho que nós. Pedro Valério (citado nominalmente na live) já está no nosso registry. Diferenciais nossos vs IOEX: **HYDRA pipeline + 162 mind clones + Bridge MCP + traffic/legal squad + Patricia Peck LGPD nativa**.
