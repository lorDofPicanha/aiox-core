# AIOS — Modelo do Expert Pool (Fase 2 da reorganização)

**Autor:** Orion (aios-master) · **Data:** 2026-05-22
**Complementa:** `aios-clones-squads-review-RESPONSE-orion-21mai.md` + `aios-squads-full-allocation-report-orion-21mai.md`

---

## 1. O que mudou (Fase 2)
O índice `jarvis-mind-clone-index.json` agora classifica **membership** para cada um dos 250 clones — separando, pela primeira vez, **membro permanente de execução** de **expert consultivo**. Antes não havia essa distinção (era só `department`, e 185 estavam em buckets de fonte).

### Campos novos no índice (por clone)
| Campo | Valores | Uso |
|---|---|---|
| `membership` | `core` · `pool` · `governance` · `runtime` | classe operacional |
| `domain` | nome do squad primário | tag de roteamento/retrieval |
| `squads` | lista de squads que referenciam o clone | multi-membership (afinidade) |
| `department` | = `domain` (limpo dos source-buckets) | compatibilidade |

### Distribuição (250)
| Membership | Qtd | Significado |
|---|---|---|
| **pool** | 186 | Experts consultivos (mind clones). Lar primário por afinidade, **acionados on-demand** — não são "membros fixos" |
| **core** | 51 | DRIs de execução (dev, architect, data-engineer, role-agents de marketing/sales/customer, etc.) |
| **runtime** | 7 | Orquestração: aios-master, aios-orchestrator, sop-extractor, squad-creator, oalanicolas, conclave-coordinator, template-mind-clone |
| **governance** | 6 | C-levels (ceo, coo, cco, cfo, cmo, cro) — política/gate/escalação, não execução |

## 2. Como o Expert Pool funciona (infra já existente)
A Fase 2 **não** arrancou os mind clones dos `squad.yaml` (isso esvaziaria os squads e é risco alto). Eles permanecem listados por afinidade de domínio, mas agora marcados como `pool` = consultivos. A consulta usa a infra que já existe:

| Camada | Mecanismo |
|---|---|
| **Registro** | `jarvis-mind-clone-index.json` (250 clones, `membership` + `domain` + `squads`) |
| **Retrieval** | brain-bridge MCP (`request_expert_consultation`) + `self-consultation.js conclave` (debate multi-expert) |
| **Ponto de entrada** | `expert-council` (ponte Conclave/JARVIS) |
| **Ativação direta** | Atalhos de agente + `.codex/agents/<id>.md`; `.codex/skills` fica reservado para capacidades reutilizáveis |

## 3. Implicação para roteamento
- **core** (51) → executam dentro dos squads (DRIs). Roteamento determinístico por domínio.
- **pool** (186) → **não** são acionados por padrão; o chief do squad ou um workflow os **consulta por tag de domínio** quando a tarefa é nova/incerta/alto-risco. Evita over-calling.
- **governance** (6) → só em escalação / tradeoff cross-squad / gate de política.
- **runtime** (7) → o roteador/orquestrador.

## 4. Pool por domínio (top)
squad-ai 16 · squad-health 16 · squad-design 16 · marketing-traffic 16 · squad-engineering 14 · squad-security 14 · squad-legal 11 · squad-finance 10 · squad-sales 9 · innovation 8 · squad-people 8 · squad-platform 8 · squad-data 8 · squad-behavioral-design 7 · squad-content 7 · ... (todos com domínio real — 0 source-buckets, 0 órfãos).

## 5. Estado da reorganização
- **Fase 1 ✅** — 33 → 25 squads (saúde consolidada p/ Anipis; 2 squads novos: behavioral-design, markets-intelligence; 6 dedupes). `validate-all-squads 25/25`.
- **Fase 2 ✅** — Expert Pool extraído (membership + domain no índice). `validate 25/25`.
- **Fase 3 (pendente)** — roteamento híbrido + gates de governança (finance/legal/security/privacy/data/brand/QA/human-approval) como policies.
- **Naming** — decidido NÃO renomear (risco alto, ganho baixo).

---
*Modelo por Orion (aios-master). Pool consultivo, não membership fixo. Meta: qualidade de orquestração.*
