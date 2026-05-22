# Squad Inventory (36 squads)

**Mapped:** 2026-05-15 (Phase 2 prep)
**Source:** `D:/AIOS/squads/`

## Squad-* (21 novos — TASK-FORMAT-V1)

| # | Squad | Domain | Provável domínio HYDRA |
|---|---|---|---|
| 1 | squad-ai | AI Strategy | ai-ml |
| 2 | squad-behavioral | Behavioral Science | ai-ml, negocios |
| 3 | squad-community | Community Mgmt | marketing |
| 4 | squad-content | Content Production | marketing, design-systems |
| 5 | squad-customer-success | Customer Success | customer-ops, negocios |
| 6 | squad-data | Data Engineering | engenharia, ai-ml |
| 7 | squad-design | Design Systems | design-systems |
| 8 | squad-education | Edu / Onboarding | customer-ops |
| 9 | squad-engineering | Software Engineering | engenharia |
| 10 | squad-executive | C-suite strategy | negocios, innovation |
| 11 | squad-finance | Finance Ops | negocios |
| 12 | squad-growth | Growth Marketing | marketing |
| 13 | squad-health | Healthcare | saude-mental, health-tech |
| 14 | squad-legal | Legal | legal |
| 15 | squad-operations | Ops/Process | negocios |
| 16 | squad-people | HR/People | negocios |
| 17 | squad-platform | Platform Eng | engenharia |
| 18 | squad-product | Product Mgmt | product |
| 19 | squad-research | UX/Market Research | product, ai-ml |
| 20 | squad-sales | Sales | marketing, negocios |
| 21 | squad-security | Cybersecurity | cybersecurity |

## Legacy (15)

| # | Squad | Domain | Provável domínio HYDRA |
|---|---|---|---|
| 22 | ai-science | AI Science Research | ai-ml |
| 23 | customer-ops | Customer Operations | customer-ops |
| 24 | design-terapeutico | Therapeutic Design | saude-mental, design-systems |
| 25 | executive-team | Executive Cluster | negocios, innovation |
| 26 | expert-council | Expert Advisory | mixed |
| 27 | growth | Growth Hacking | marketing |
| 28 | health-data | Health Data Eng | health-tech, engenharia |
| 29 | health-tech | Health Tech | health-tech |
| 30 | innovation | Innovation R&D | innovation, ai-ml |
| 31 | legal | Legal Advisory | legal |
| 32 | marketing-ops | Marketing Ops | marketing |
| 33 | product-research | Product Research | product |
| 34 | sales-ops | Sales Operations | marketing, negocios |
| 35 | therapy | Therapy Cluster | saude-mental |
| 36 | traffic-masters | Paid Traffic | marketing |

## Total: 36 squads

**Coverage HYDRA domains usados:**
- ai-ml (8 squads relevantes)
- marketing (8)
- engenharia (5)
- negocios (8)
- design-systems (3)
- saude-mental / health-tech (5)
- legal (2)
- product (3)
- cybersecurity (1)
- customer-ops (3)
- innovation (2)

## Phase 2 Strategy

Após Phase 1 (HYDRA run completo), analisar `digest` da run pra ver:
1. Quais clones receberam ≥ N items (cobertura OK)
2. Quais clones receberam < 5 items (gap → enrich targeted)
3. Quais sources/domains performaram melhor por squad

Plano de research targeted por squad será criado em `02-departments/{squad-name}.md` após análise do digest.
