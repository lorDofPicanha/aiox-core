# AIOX — Estrutura da Corporação Multi-Agente

**Versão:** 1.0 · **Data:** 2026-05-22 · **Autor:** Orion (aios-master)
**Fontes:** `jarvis-mind-clone-index.json` (250 clones) + 25 `squad.yaml` + `.aios-core/routing-and-gates-policy.md`
**Docs relacionados:** `aios-expert-pool-model-orion-22mai.md` · `aios-squads-full-allocation-report-orion-21mai.md` · `aios-clones-squads-review-RESPONSE-orion-21mai.md`

---

## 1. O que é o AIOX
O **AIOX** é um sistema operacional multi-agente organizado como uma **corporação virtual**. São **250 agentes** (mind clones + agentes funcionais) operando sob um modelo **híbrido** que separa quatro naturezas distintas — em vez de tratar tudo como "squad":

| Natureza | Qtd | Papel |
|---|---|---|
| 🟢 **core** | 51 | DRIs de **execução** — fazem o trabalho dentro dos squads |
| 🔵 **pool** | 186 | **Experts consultivos** (mind clones) — acionados on-demand, não membros fixos |
| 🏛️ **governance** | 6 | C-levels — **política, gates, escalação** (não executam) |
| ⚙️ **runtime** | 7 | **Orquestração** — o roteador do sistema |

**Princípio central:** *membership ≠ availability*. Um expert do pool tem um squad de afinidade, mas é **consultado por retrieval**, não "lotado" como membro permanente. Isso evita over-calling e mantém execução rápida.

## 2. Arquitetura em camadas
```
Founder (Operador)
│
├── 🏛️ EXECUTIVE COUNCIL (governança — não executa)
│      ceo · coo · cco · cfo · cmo · cro
│      → política, gates, escalação, tradeoffs cross-squad
│
├── ⚙️ ORCHESTRATION RUNTIME (o roteador)
│      aios-master (COO) · aios-orchestrator · sop-extractor · squad-creator
│      · oalanicolas · conclave-coordinator · template-mind-clone
│
├── 🟢 EXECUTION SQUADS (22 squads de domínio — core DRIs + especialistas)
│      cada um: 1 chief (Tier 0) → core (execução) → consulta pool
│
├── 🔵 EXPERT POOL (186 mind clones — consultivo, por domínio)
│      via brain-bridge MCP + Conclave + /skills · ponte: expert-council
│
└── 🧪 TASK FORCES (efêmeras — montadas por projeto a partir de squads + pool)
       ex.: Noyce/buscador-licitacoes, polymarket-trader
```

## 3. Os 25 squads (por grupo)

### 🔧 Engenharia & Plataforma
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **squad-engineering** | @architect (CTO) | 3 core · 14 pool · 17 | Arquitetura, dev, code quality, TS/runtime |
| **squad-platform** | @kelsey-hightower (VP Platform) | 1 core · 8 pool · 9 | DevOps, SRE, infra, cloud, observability |
| **squad-data** | @data-engineer (VP Data) | 1 core · 9 pool · 10 | Schema, migrations, query, pipelines, RLS |
| **squad-ai** | @demis-hassabis (CAIO) | 16 pool · 16 | IA/ML, MLOps, alignment, decision science |

### 🎨 Design & Comportamento
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **squad-design** | @design-lead | 7 core · 16 pool · 23 | UX/UI, design systems, motion, IA, visual |
| **squad-behavioral-design** 🆕 | @bj-fogg (VP Behavioral) | 7 pool · 7 | Behavior design, nudge, gamificação, ética de engajamento |

### 📦 Produto, Pesquisa & Inovação
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **squad-product** | @pm (CPO) | 2 core · 4 pool · 6 | Discovery, PM, positioning, estratégia de produto |
| **squad-research** | @analyst (VP Research) | 5 core · 6 pool · 11 | Pesquisa de mercado, competitor, foresight |
| **innovation** | @clayton-christensen | 8 pool · 8 | Lean startup, JTBD, disrupção, validação |

### 📈 Marketing, Conteúdo, Vendas & Cliente
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **marketing-traffic** | @traffic-masters-chief | 12 core · 16 pool · 28 | Tráfego pago, growth, SEO, CRO, funil |
| **squad-content** | @ann-handley (VP Content) | 1 core · 7 pool · 8 | Copy, narrativa, editorial, brand messaging |
| **squad-sales** | @alex-hormozi (CSO) | 8 core · 9 pool · 17 | Vendas, pricing, negociação, pipeline |
| **squad-customer-success** | @lincoln-murphy (VP CS) | 7 core · 3 pool · 10 | Onboarding, retenção, suporte, churn |
| **squad-community** | @sarah-drasner (VP DevRel) | 3 pool · 3 | DevRel, comunidade, open-source |

### 🏥 Verticais especializados
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **squad-health** 🆕 | @alison-darcy (VP Digital Health) | 19 pool · 19 | **Vertical Anipis.** 5 divisões: Data & Informatics, Digital Care, Mental Health, Therapeutic Design, Regulatory & Privacy |
| **squad-markets-intelligence** 🆕 | @luana-lopes-lara | 9 pool · 9 | **Projeto polymarket.** Trading, prediction markets, crypto, forecasting |
| **squad-finance** | @aswath-damodaran (CFO) | 11 pool · 11 | Valuation, pricing, modelagem, macro |
| **squad-legal** | @heather-meeker (GC) | 13 pool · 13 | Jurídico BR, compliance, LGPD, OSS licensing, health-law |
| **squad-security** | @bruce-schneier (CISO) | 16 pool · 16 | 6 divisões: Strategy, Red Team, Blue Team, AppSec, GRC, Talent |

### 👥 Pessoas & Operações
| Squad | Chief | Composição | Faz |
|---|---|---|---|
| **squad-people** | @patty-mccord (CHRO) | 8 pool · 8 | Cultura, liderança, talento, org-psych |
| **squad-education** | @sal-khan (VP Education) | 3 pool · 3 | Currículo, deliberate practice, treinamento |
| **squad-operations** | @sm (Scrum Master) | 4 core · 4 pool · 9 | Sprint, QA, DevOps, processo, remote |

### 🏛️ Governança & Runtime
| Entidade | Head | Composição | Papel |
|---|---|---|---|
| **executive-team** | @ceo | 6 governance | Conselho executivo (C-levels) |
| **squad-executive** | @aios-master (COO) | 2 core · 6 pool · 4 runtime · 12 | Orquestração / meta-framework |
| **expert-council** | @conclave-coordinator | 2 runtime | Ponte Conclave/JARVIS = entrada do Expert Pool |

> 🆕 = squads criados na reorganização de 22/Mai. Totais por natureza (sem dupla contagem cross-squad): **core 51 · pool 186 · governance 6 · runtime 7 = 250**.

## 4. Expert Pool — como funciona
Os 186 experts **não** são acionados por padrão. O chief do squad (ou um workflow) os consulta **por tag de `domain`** quando a tarefa é nova/incerta/alto-risco:
- **Registro:** `jarvis-mind-clone-index.json` (cada clone tem `membership`, `domain`, `squads`).
- **Retrieval:** brain-bridge MCP (`request_expert_consultation`) + `self-consultation.js conclave` (debate multi-expert).
- **Ativação direta:** `.codex/skills/aios-<id>` (246 shortcuts no `/skills` do Codex).
- **Entrada:** `expert-council`.

## 5. Roteamento (modelo híbrido)
1. **Intent → domínio → chief** (determinístico — tabela em `routing-and-gates-policy.md`).
2. **Chief roteia** para core (execução) ou **consulta o pool** (sob incerteza).
3. **Gates disparam** por gatilho material.
4. **Council** só em escalação / tradeoff cross-squad.
Hierarquia: `chief → specialist → clone` (`config.toml max_depth=2`).

## 6. Gates de governança
| Gate | Owner | Enforcement |
|---|---|---|
| Story-driven · No-invention · Quality | @sm/@pm · todos · @qa | **BLOCK** (constituição) |
| **Data-quality** (SQL DDL) | @data-engineer | **BLOCK** — hook `sql-governance` ✅ ativo |
| **Mind-clone DNA** (criar clone novo) | @squad-creator | **BLOCK** — hook `mind-clone-governance` ✅ ativo |
| Security · Legal · Privacy/LGPD · Finance · Brand | CISO · GC · DPO · CFO · CMO | policy (review) |
| **Human approval** (ação irreversível/externa) | Founder | policy + push só via @devops |

## 7. Como acionar (referência rápida)
- **Agente/clone:** `@<id>` ou `/skills` → `aios-<id>` (Codex) · carrega persona de `.aios-core/development/agents/` ou `squads/*/agents/`.
- **Consulta multi-expert:** `node .aios-core/core/jarvis/self-consultation.js conclave --question "..." --experts 3`.
- **Chiefs (Tier 0):** ver tabela §3 (ex.: `@architect`, `@bruce-schneier`, `@traffic-masters-chief`).

---
*Estrutura mantida por Orion (aios-master). 25 squads · 250 clones · `validate-all-squads 25/25 OK`. Naming "nu" (marketing-traffic, executive-team, expert-council, innovation) mantido por decisão (renomear = risco alto, ganho baixo).*
