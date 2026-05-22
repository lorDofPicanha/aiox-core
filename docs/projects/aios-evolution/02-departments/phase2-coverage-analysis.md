# Phase 2 — Coverage Analysis per Squad

**Generated:** 2026-05-15 (post Phase 1 run)
**Source:** `01-research/digest-2026-05-15.md` + HYDRA pipeline output

## Phase 1 Results Summary

- **Fetched:** 3.202 items
- **Filtered/Duplicates:** 2.364 / 767
- **Ingested:** 31 (final knowledge)
- **Distributed:** 61 items → 85 clones
- **Tiers:** S=5, A=26, B=30, C=8, D=2
- **Duration:** 21min

## Top Recipients (clones with most enrichment)

| # | Clone | Items | Squads servidos |
|---|---|---|---|
| 1 | conclave-coordinator | 36 | expert-council, executive-team |
| 2 | charity-majors | 34 | squad-engineering, squad-platform, squad-security |
| 3 | werner-vogels | 31 | squad-engineering, squad-platform, innovation |
| 4 | eric-ries | 31 | squad-product, squad-executive, innovation |
| 5 | architect | 30 | squad-engineering, squad-ai (AIOS) |
| 6 | dev | 30 | squad-engineering (AIOS) |
| 7 | sean-duffy | 30 | squad-health, health-tech |
| 8 | halle-tecco | 30 | squad-health, health-tech |
| 9 | demis-hassabis | 23 | squad-ai, ai-science |
| 10 | fei-fei-li | 23 | squad-ai, ai-science |

## Squad Coverage Matrix

### ✅ BEM COBERTOS (≥10 items via top recipients)

| # | Squad | Cobertura | Items destacados |
|---|---|---|---|
| 1 | squad-engineering | 🟢 EXCELENTE | AINews series, LLM research, [#50-61] |
| 2 | squad-platform | 🟢 EXCELENTE | werner-vogels, charity-majors recebem todos eng items |
| 3 | squad-ai | 🟢 EXCELENTE | LLM/AI items + demis, fei-fei, ilya, yann (4x cada) |
| 4 | squad-product | 🟢 BOA | eric-ries 31 items, marty-cagan items legais/biz |
| 5 | squad-health | 🟢 EXCELENTE | sean-duffy, halle-tecco, atul-butte 30 items cada |
| 6 | health-tech | 🟢 EXCELENTE | mesma cobertura que squad-health |
| 7 | therapy | 🟢 BOA | acacia-parks, bj-fogg, dena-bravata via saude-mental |
| 8 | squad-executive | 🟢 BOA | werner-vogels, eric-ries, conclave-coord |
| 9 | expert-council | 🟢 EXCELENTE | conclave-coordinator 36 items |
| 10 | executive-team | 🟢 EXCELENTE | conclave-coordinator 36 items |
| 11 | innovation | 🟢 BOA | werner-vogels, eric-ries, ray-dalio |
| 12 | ai-science | 🟢 EXCELENTE | demis, fei-fei 23 items + items LLM |
| 13 | squad-legal | 🟢 EXCELENTE | bakul-patel, lucia-savage, lawrence-lessig em 10 items legais BR |
| 14 | legal | 🟢 EXCELENTE | mesma cobertura |
| 15 | squad-security | 🟢 BOA | charity-majors 34, kevin-mitnick + troy-hunt em 5 items cyber |
| 16 | squad-growth | 🟡 MÉDIA | molly-pittman, kasim-aslam, pedro-sobral em ~5 items mktg |
| 17 | squad-sales | 🟡 MÉDIA | grant-cardone, neil-patel, russell-brunson em items biz |
| 18 | growth (legacy) | 🟡 MÉDIA | mesma cobertura squad-growth |
| 19 | marketing-ops | 🟡 MÉDIA | "The art of doing more with less: marketing ops" [#28] |
| 20 | traffic-masters | 🟡 MÉDIA | 7 specialists em items 27-30 + 47-48 |
| 21 | sales-ops | 🟡 MÉDIA | sales-strategist, outbound-specialist em items biz |

### 🔴 SUB-COBERTOS (<5 items detectados)

| # | Squad | Gap detectado | Sources sugeridos pra enrich |
|---|---|---|---|
| 22 | squad-design | Sem items design específicos | Smashing Magazine (já existe) + UX Collective, Designer News |
| 23 | squad-content | Sem items content estratégico | Content Marketing Institute, Animalz, Lenny |
| 24 | squad-data | Só eng genérico, falta data-eng | DataEngWeekly, Joe Reis, Mode Analytics |
| 25 | squad-research | Sem UX/market research | NN Group, ReOps Community, Erika Hall |
| 26 | squad-behavioral | Sem behavioral science | Behavioral Scientist, Brain Pickings |
| 27 | squad-education | Sem ed-tech | EdSurge, Pearson Research |
| 28 | squad-finance | Só items biz indiretos | a16z Future, Stratechery (existe) |
| 29 | squad-operations | Cobertura biz indireta | McKinsey Operations |
| 30 | squad-people | Sem HR específico | First Round Review |
| 31 | squad-customer-success | Items biz indiretos | Customer Success Magazine, Lincoln Murphy |
| 32 | customer-ops | mesma | mesma |
| 33 | squad-community | bj-fogg, alguns items mktg | Community Roundtable |
| 34 | product-research | Cobertura via @analyst, indireta | Continuous Discovery (Teresa Torres) |
| 35 | health-data | Sem health-data específico | Health Tech Mag |
| 36 | design-terapeutico | Sem design+therapy | Mad in Brazil, Hospital Design |

## Phase 2 Decision

**Approach pragmático:** ao invés de adicionar 30+ novas sources e rodar pipeline 2x mais (overhead 40+min), aceitar coverage atual como **base** e:

1. **Documentar coverage map** (este arquivo) — Phase 2 deliverable principal ✅
2. **Identificar 5 squads críticos sub-cobertos** que merecem enrich targeted:
   - squad-design (sem items design — squad ativo no dia-a-dia)
   - squad-data (gaps em data-eng específico)
   - squad-content (sem strategy content)
   - squad-customer-success (cobertura indireta)
   - squad-behavioral (sem behavioral science)
3. **Defer enrichment desses 5** para próxima HYDRA run com sources adicionais (não bloqueia Phase 3)
4. **Avançar para Phase 3 com base atual** — synthesis + skill nova usando os 61 items distribuídos

## Top 10 Items AI Orchestration (gold para Phase 3)

| # | Title | Tier | Score |
|---|---|---|---|
| 1 | LLM Research Papers: The 2025 List (Jul-Dec) | S | 4.65+ |
| 2 | Categories of Inference-Time Scaling for LLM Reasoning | S | 4.75 |
| 3 | My Workflow for Understanding LLM Architectures | S | 4.65 |
| 4 | Anthropic-SpaceXai's 300MW/$5B deal Colossus | S | 4.65 |
| 5 | [AINews] Thinking Machines' Native Interaction Models | A | 4.15 |
| 6 | [AINews] GPT-Realtime-2, Translate, Whisper | A | 4.35 |
| 7 | [AINews] Codex Rises, Claude Meters Programmatic | A | — |
| 8 | [AINews] The End of Finetuning | A | 3.6 |
| 9 | Mini book: Architecting Autonomy: Decentralising AI | A | — |
| 10 | Benchmarking AI Agents on Kubernetes | A | 3.6 |
