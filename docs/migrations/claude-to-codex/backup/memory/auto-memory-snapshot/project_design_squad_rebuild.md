---
name: Design Squad Rebuild — Multi-Niche Universal Squad
description: Re-arquitetura completa do squad de design AIOS após 4 falhas visuais consecutivas em projeto luxury (Bretda). Discovery + research + roundtable + niche prototype em curso. Caminho C (re-arquitetar, não tapa-buraco).
type: project
originSessionId: 5812b244-6a76-4652-9aa0-0c93bdde2339
---
# Design Squad Rebuild — Status 01/Mai

## Trigger
User decepcionado com 4 falhas visuais Bretda. Diagnóstico Orion identificou 3 sistemas de design paralelos sem coordenação:
- A) AIOS Core agents (`.aios-core/development/agents/` — design-lead, ui-designer, ux-designer, design-systems-engineer, ux-design-expert)
- B) Claude Code Subagents (`.claude/agents/` — design-chief, design-system, aios-ux)
- C) Squad YAML (`squads/squad-design/squad.yaml` — 13 mind clones nominais, manifesto morto)

Os 3 não se falam. Mind clones consultados em cada sistema são DISJUNTOS (Brad Frost é o único nome em comum).

## Decisão tomada
Caminho C: re-arquitetar squad universal multi-nicho. Não tapa-buraco.

## Universo de nichos vivos (5 fixos)
1. **luxury-craft** — Bretda, Tocks
2. **wellness-saas** — Anipis (Serenity AI)
3. **low-ticket-funnel** — Low Ticket 10k
4. **prediction-markets** — Polymarket Trader
5. **internal-tooling** — Sales AI / CRM IA

NeuralCommand → virou Sales AI. NexusBI → desistido (mercado canibalizado).

## 5 decisões arquiteturais (fechadas)
1. Universo: 5 nichos vivos confirmados
2. Ingestão galerias: **(a)+(b)** Daily SOTD (Awwwards/CSSDA/WDA) + Weekly batch (Muzli/Maxibestof/Cosmos/SaaSUI.Design)
3. Detecção de nicho: **(c)+(a)** Conversa inicial COM tag obrigatória explícita
4. Squad RECUSA briefs ruins MAS educa user (concierge, não executor cego)
5. Métricas: research-driven (não vibes) — DONE em research sprint

## 🔴 Constraint operacional (fechado 01/Mai)
**Budget tipografia: TETO Google Fonts.** Não banca premium licenses ($500-$2k/face).

Implicação:
- Squad deve dominar Google Fonts pra luxo (Hermès já prova viável: EB Garamond + Manrope free + cream BG)
- Bretda Cormorant+Raleway atual NÃO É o problema — o problema é COMO usar (system depth, letter-spacing scale, type-pairing)
- PRD deve incluir matriz "Google Fonts pra cada nicho" como gate

## Pesquisa entregue (research sprint 01/Mai)
Em `docs/projects/design-squad-rebuild/research/`:
- Q1 `01-awards-rubrics.md` — Awwwards 40/30/20/10 (Design/Usability/Creativity/Content), Atlas-100 score model proposto
- Q2 `02-luxury-spec.md` — 7/8 sites capturados (Cassina, Bottega, Aesop, Brunello, Aman, Bulgari, Hermès; Maxmara BLOCKED HTTP/2 anti-bot). Medições reais via Playwright Chromium 1440×900 → DOM getComputedStyle
- Q3 `03-saas-spec.md` — 8/8 SaaS capturados (Linear, Vercel, Stripe, Notion, Figma, Loom, Calendly, Ramp)
- Q4 `04-visual-diff-stack.md` — Stack recomendado: Playwright + pixelmatch + Lost-Pixel OSS (~$0/yr vs Percy $4.8k/yr)
- Q5 `05-niche-detection-heuristic.md` — 5-niche decision tree + niche-calibration.yaml spec
- README.md + benchmark-captures/ (PNGs + JSON measurements raw)

## 4 surpresas que mudaram premissas
1. **Luxo NÃO é "menos motion"** — usa 2-4 durações distintas com easing sofisticado (cubic-bezier custom). SaaS usa 5-9 durações.
2. **4/7 luxury sites NÃO TÊM h1** — Bottega/Aman/Brunello deixam imagem/filme carregar hero
3. **SaaS headline mode 4-7 palavras**, não ≤12 (Calendly 3, Notion 4, Vercel 7)
4. **Cream BG vence pure white 4:3** em luxo — Hermès `rgb(252,247,241)` orange-tinted, Aesop `rgb(255,254,242)` warm, Aman `rgb(243,238,231)` parchment

## 3 riscos sinalizados pra PRD
1. **R1 typography custom mandatory** — 15/15 premium sites custom/licensed → MITIGADO 01/Mai com decisão "teto Google Fonts" + Hermès case prova viável
2. **R2 awards juízes não publicam rubric per-juror** — Atlas-100 model próprio é necessário
3. **R3 anti-convenções por nicho são reais** — luxo skipa h1, prediction-markets é dense data → squad universal NÃO pode normalizar

## Fase atual (01/Mai pós-research) — AMBOS SPAWNS DONE

### Spawn A — Mind Clone Roundtable ✅
File: `06-mind-clone-roundtable.md` (~3,400 words)

⚠️ Persona files MISSING em `.aios-core/development/agents/` pra van-schneider/spiekermann/frost/neumeier — agente fez fallback pra public framework synthesis (DESK / Stop Stealing Sheep / Atomic Design / Brand Gap). Investigar gap depois.

**3 CONSENSOS (gospel pro PRD):**
1. Atomic foundation primitivo + niche semantic layer + project component layer
2. "Restraint with one spike" — Atlas-100 ganha sub-criterion **Spike-Presence**
3. System depth na tipografia separa luxo de amador (não a license per se)

**2 OVERTURNED (gates críticos — explicam 4× Bretda failures):**
- **Gate #1 Spiekermann Type-System Depth**: ≥4 letter-spacing values + baseline grid + optical-size policy + italic policy + type-pairing matrix por nicho. Cassina tem 12 letter-spacings, Bretda tem 1-2. ESSE é o gate que faltava.
- **Gate #2 Frost NAMED Template Variants**: heroes nomeados (`hero-image-led`, `hero-film-led`, `hero-h1-led`, `hero-dense-data`), não improvisos.

**3 DISSENSOS — resoluções propostas (aguardando OK do user):**
1. Free vs Licensed fonts → resolver via Gate #1 (system depth, não license tier). Compatível com TETO Google Fonts.
2. Routing schema → archetype como first-class field (Neumeier wins). YAML: `niche: luxury-craft, archetype: lover`.
3. prediction-markets boundary → manter 5 nichos com regra "se public marketing layer → prediction-markets; senão internal-tooling".

### Spawn B — Niche Detection Prototype ✅
File: `07-niche-detection-prototype.md`

- Decision-tree exit accuracy: **100% (5/5)** — name-regex catches all
- Stress test keyword-only: **80% (4/5 clean, Polymarket margin 6pt apertado)**
- 2 failure modes: regex `R$\d` over-match + single-word collisions (`market`/`dashboard`)
- Veredicto: **READY com 3 patches cirúrgicos** (R$ regex tighter + bigram corroboration + `--target-app` flag pra Tocks multi-app)

## Conclave Q8 — Dissensos resolvidos ✅
Spawn aios-architect 01/Mai (5,200 words em `08-conclave-dissents.md`):
- **Dissent #1 (typography sob TETO Google Fonts) — verdict (c) HÍBRIDO** (4-1, Spiekermann under reservation): shortlist 10 Google Fonts (4 serif + 6 sans) + gate quantitativo system-depth + spike obrigatório
- **Dissent #2 (routing schema) — verdict 5-0**: tupla `{niche}+{archetype}` com niche dominante. Archetype PODE override primitivos (typeface family, weights, body LH, default bg)
- **Dissent #3 (prediction-markets boundary) — verdict 5-0**: mantém 5 nichos. Compartilha primitive pool com internal-tooling via `inherits_primitive_pool_from`. Boundary 3-trigger any-of. Per-surface routing.
- **5 concessões documentadas** (sinal de debate real, não monólogos paralelos)
- **15 PRD-ready rules** unlocked

## PRD COMPLETO ✅ (01/Mai)
Spawn aios-architect (Aria) entregou 13 docs + 4,957 lines em `docs/projects/design-squad-rebuild/prd/`:

| # | File | Lines |
|---|---|---|
| README | sumário + map | 132 |
| 00 | vision-and-scope | 151 |
| 01 | architecture-overview (5-layer) | 327 |
| 02 | niche-calibration-spec | 827 |
| 03 | quality-gates (5 gates) | 420 |
| 04 | token-architecture | 396 |
| 05 | knowledge-pipeline (HYDRA expansion) | 240 |
| 06 | squad-roles-and-responsibilities | 375 |
| 07 | mind-clone-routing | 501 |
| 08 | tooling-stack | 345 |
| 09 | migration-plan | 388 |
| 10 | roadmap-phases | 297 |
| 11 | open-risks-and-mitigations | 308 |
| 12 | success-metrics | 250 |

**Aria reported: READY FOR USER APPROVAL** (no novo bloqueador arquitetural)

## ✅ PRD APROVADO 01/Mai
User escolheu (A) aprovação direta sem leitura prévia. Defaults travados:
- **R3 archetype detection** → Phase 0 é o gate (halt migration se <80% accuracy)
- **R1 Google Fonts shortlist update** → cadência trimestral
- **R11 visual diff thresholds** → Bretda é calibration project (friction inicial aceita)

## ✅ Phase 0 PASS — 5/5 (100%) 01/Mai
@analyst (Atlas) entregou:
- `docs/projects/design-squad-rebuild/research/archetype-detection-heuristic.md` (heurística v0.1)
- `docs/projects/design-squad-rebuild/research/09-archetype-detection-prototype.md` (validation report)

**Tuples confirmadas:** Bretda=luxury-craft+ruler, Tocks(website)=luxury-craft+ruler, Anipis=wellness-saas+caregiver, Low Ticket 10k=low-ticket-funnel+hero, Polymarket Trader(bot)=internal-tooling+everyman.

**Stop condition NÃO triggered.** Migration autorizada a prosseguir.

**2 caveats não-bloqueadores:**
1. Creator/Innocent/Magician sem exemplos empíricos (validação só lógica)
2. Bretda Ruler/Creator Δ=2.20 banda HIGH (não VERY-HIGH) — atelier-narrative pode cair em ambiguity

**5 refinements v0.2 propostos** (não bloqueiam Phase 1, fold in antes de projetos NOVOS): Galloway-way Ruler signal, multi-decade-warranty Creator anti-signal, validate-before-explore Caregiver signal, branded-method Magician signal, Hero copywriter pedigree.

## Próximo: Phase 1 — aguardando user GO
Phase 1 = primeira escrita real no codebase (token foundation + agent re-wiring + 5 gates + HYDRA pipeline + niche-calibration.yaml live). ~7-9 dias trabalho, ~80% reuso.

User decisão pendente: PROCEED Phase 1 ou pausa pra revisão PRD + v0.2 refinements antes de começar implementação.

## Roadmap pós-aprovação
- Phase 0 (~0.5d): archetype detection ← em curso
- Phase 1-7: token foundation + agents + gates + HYDRA pipeline + niche-calibration
- Phase 8: primeiro projeto teste = **Bretda re-redesign** (gatilho original do rebuild)

Total: 13.5-15 dias calendário (10-12 com paralelismo).

## Trigger de retomada
Notificação spawn Phase 0 complete OU user disser "status design squad".

## Reuso vs novo (do diagnóstico)
| Componente | Status | Esforço |
|---|---|---|
| HYDRA pipeline (106+ fontes weekly poll) | ✅ existe | +7 sources galerias = ~1 dia |
| DESIGN.md library 69 brands | ✅ existe (27/Abr) | +screenshots = ~0,5 dia |
| 5 design agents core | ✅ existem | re-wire mind clones + niche calibration = ~1-2 dias |
| 162 mind clones (.aios-core/development/agents/) | ✅ existem | atualizar jarvis-mind-clone-map.yaml = ~2h |
| Skills + MCPs | ✅ instalados | doc when-to-use = ~0,5 dia |
| **Niche Calibration Engine** | ❌ NOVO | ~1 dia |
| **5 Quality Gates** | ❌ NOVO (gates 2 e 4) | ~2 dias |
| **Squad Operating Manual** | ❌ NOVO | ~1 dia |

Total estimado: 7-9 dias trabalho.

## Trigger pra retomada
Quando user disser "PRD design squad", "fecha squad", ou os 2 background agents finalizarem, retomar com a síntese.
