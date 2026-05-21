---
name: project-crm-novo-15mai
description: 🟢 CRM Novo planning completo 15/Mai. HYDRA pipeline real (V3 145 sources/1160 fetched/136 distribuídos/24 clones) + tech-research + brainstorm 85 features + UltraPlan 24 stories + Conclave 5 experts + ARCHITECTURE/FEATURES/ROADMAP finais. 4 KILL gates. Week 0 Concierge MVP mandatory antes Sprint 1.
metadata: 
  node_type: memory
  type: project
  originSessionId: 6bca5a3d-67f9-4ad9-a3f3-1c5310fef7af
---

# CRM Novo — Planning Completo 15/Mai/2026

**Status:** 🟢 Planning fase done. **Code não iniciado** (Concierge MVP Week 0 first).

## Decisões aplicadas (defaults sensatos da session 15/Mai)

- Escopo: Médio (b)
- Stack: Custom build (Next.js 16 + Supabase + WhatsApp Cloud API direto + Inngest + Resend + Vercel)
- Persona: Multi-tenant **Tocks + Bretda primários** + qualquer negócio futuro Breno (Vorza/Site-Prospector/Anipis/Skara IF/WHEN ready)
- Arquitetura: novo tenant onboarded em <1 dia, RLS-based, sem hardcode
- HYDRA caminho: A (pipeline real, bug resolvido 15/Mai ~02:30)

## Workspace

`D:/AIOS/docs/projects/crm-novo/`:
- `00-context/CONTEXT.md` — defaults + decisões
- `10-research/00-hydra-run-summary.md` + `06-tech-research.md`
- `20-brainstorm/01-features-brainstorm.md`
- `30-ultraplan/01-implementation-blueprint.md`
- `40-conclave/01-conclave-synthesis.md` + raw output
- `99-architecture/ARCHITECTURE.md` + `FEATURES.md` + `ROADMAP.md` + `BOM-DIA-BRENO.md`

## HYDRA pipeline V3 (15/Mai)

- 145 sources configured (60 RSS + 85 GitHub repos OSS CRMs)
- 1160 items fetched (target 4000+ não atingido devido Anthropic API balance low + 392 errors)
- 275 processed → 136 distribuídos
- Tier S=4, A=21, B=111, C=129
- 24 clones receberam feeds enriquecidos (martin-fowler 179 lines, paul-copplestone 131, jason-lemkin 299, etc.)

**Squad CRM config:** `D:/AIOS/tools/hydra/configs/squads/squad-crm/`

## The Moat (locked)

> **CRM Novo's moat = Bridge bidirecional Meta CAPI + Google offline conv com idempotency, dead-letter queue e audit trail.**

Tudo o resto é commodity bem-feita. Stay in circle.

## Timeline

- Declared: 12 weeks
- Budgeted: 16 weeks (margin of safety Buffett)
- Week 0 Concierge MVP MANDATORY antes Sprint 1
- 4 KILL gates: Week 0 / Week 4 / Week 7 / Week 8

## Conclave 5 experts (auto-selected via brain-bridge MCP)

- proposal-writer (executive summary, ROI quantification)
- BLITZ — Campaign Manager (Alpha/Beta/GA framework)
- guillaume-moubeche (founder dogfooding, charge day one)
- eric-ries (Concierge MVP, Customer Need Pivot trigger)
- warren-buffett (margin of safety, moat statement, circle of competence)

**Conclave ID:** `11c08364-a9f7-4afd-9446-335e8ef6f3ee`

## 6 modifications adopted from conclave

1. Week 0 Concierge MVP mandatory
2. Internal pitch doc 1-página
3. Phases reframed Alpha/Beta/GA (não pilot/prod)
4. 16-week budget (4-week margin)
5. Moat statement explicit em FEATURES.md
6. Founder dogfooding Week 1-4

## User Actions Pendentes (em ordem)

### Week 0 (esta semana)
1. 5 entrevistas vendedor Tocks (30min cada)
2. Internal pitch doc Tocks team
3. Inngest Bridge standalone setup
4. Dogfooding 1 dia
5. Decide moat + 16-week budget confirm
6. Gate 0 review (Customer Need Pivot check)

### Week 1
7. Submit Meta WhatsApp Business Verification
8. Comprar domínio (crm.synkra.com.br ou skara.synkra.com.br)
9. Patricia Peck DPA bundle (com Site-Prospector legal pack)

## Triggers próxima sessão

- `vai com crm` → start Week 0 Concierge MVP
- `pivot crm bridge-only` → kill full CRM, build Bridge-only product
- `kill crm` → reabsorve tempo em Tocks/Bretda
- `audit crm gate {0,1,2,3}` → review checkpoint
- `expande feature F-XXX crm` → detail single feature
- `revisita conclave crm` → re-run com 5 experts diferentes

## Why

User pediu rebuild greenfield (Sales AI deprecated 15/Mai — "este sales só me deu trabalho"). F-CRM-Upload-Void (Sales AI → Google offline conv bridge offline, R$13k Lead Qualificado 0 fires/30d) é root cause. CRM Novo resolve com Bridge built-in idempotency + audit + reconcile daily.

## How to apply

Próxima sessão começar com:
1. Ler `99-architecture/BOM-DIA-BRENO.md`
2. Checar Week 0 status (entrevistas done? dogfooding done?)
3. Se Week 0 passed → start Sprint 1 (story CRM-1.1)
4. Se Customer Need Pivot triggered → discutir Bridge-only product scope
