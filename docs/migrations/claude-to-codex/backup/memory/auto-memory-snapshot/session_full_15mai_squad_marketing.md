---
name: session-full-15mai-squad-marketing
description: Dia completo 15/Mai — squad marketing-traffic built + Bretda full audit/exec + Tocks full audit/exec + Sales AI deprecated + CRM new project pending
metadata: 
  node_type: memory
  type: project
  originSessionId: 4caaf143-bfd8-4b9f-88f9-0c482fa87ad5
---

# Sessão Full 15/Mai 2026 — Squad Marketing-Traffic + Bretda + Tocks + CRM Project

## 🏗️ Squad marketing-traffic — CONSOLIDADO

- Renomeado `traffic-masters` → `marketing-traffic` (Opção A unification)
- Aposentados: `marketing-ops`, `growth`, `squad-growth` → `squads/.deprecated/`
- **11 specialists** Tier 0/1/2/3 + chief (`.claude/agents/traffic-masters-chief.md`)
- **16 tasks + 5 checklists + 4 workflows + 4 data files** em `squads/marketing-traffic/`
- Playbooks: bretda.md + **tocks.md (NEW hoje)**
- Gotchas: v1.1 com G-022 + G-023 novos (Bretda+Tocks discoveries)
- Commit `b4f46587` chief activator
- Total ~13.400 linhas squad material

## 🎯 Bretda — Estado pós Plan C + Operação Google

### Meta (act_381618241134624)
- CJ8v2 R$60/d ACTIVE
- CP1 R$30/d ACTIVE (forms ainda BAD, swap D+1)
- AD05-v2 + AD04-v2 PAUSED → IN_PROCESS Meta review ~24h
- AD05/AD04 originais PAUSED
- AD03 ACTIVE (form bom)
- Daily total: R$90/d
- Spend cap DINÂMICO (memory `feedback_bretda_meta_spend_cap_dynamic`)

### Google (8167636084)
- 4 canon ENABLED: Brand-Defense R$10 + MesaBilhar R$20 + MesaJantar R$20 + RTG R$10 = R$60/d
- Bid R$8 → R$25 (Aslam 2-4 compliant)
- WhatsApp-CLICK demoted PRIMARY → SECONDARY
- F6 zumbi `[AGD] Lead 7138711130` immutable via API (G-022, precisa UI)
- Saldo R$318,71 → runway 5,3d
- Smoke test F7 `Lead-Pagina-Obrigado` PENDENTE

### F-codes descobertos Bretda
- **F-Meta-LEAD-VOID** — leads chegam Meta Leads Center, ninguém vê (resolvido via swap form)
- **F-Sales-Data-Void** — vendedor atende mas não atualiza status (não resolvido — automação only)
- **G-022** codeless conv type=37 immutable via API

### Deliverables Bretda 15/Mai (10 arquivos)
- `docs/projects/bretda/audits/` — 6 arquivos
- `docs/projects/bretda/reports/` — 1 arquivo
- `docs/projects/bretda/actions/` — 4 arquivos

## 🎯 Tocks — Estado pós Operação 30d

### Meta (descobrir via list, pixel 1382948639707224)
- 19 camps total (2 ACTIVE: C005 R$95 + C007 R$60 / 17 PAUSED)
- C007 Monaco preserved (winner R$11.79/msg, F8 47% mas worth)
- 5 lixo archived (3 com creative Reel broken — archive manual user)

### Google (8146675397)
- 18 camps total (1 ACTIVE TOCKS_Search_Alta-Intencao R$75/d)
- 11 lixo archived (G-023 workaround `.remove()`)
- 8 PRIMARY → 4 PRIMARY (target 2 após UI fix 2 type=28)
- Smart Bidding 21d reset começou 15/Mai
- SIS Lost-Rank 79% (espera recovery 21d)
- Saldo R$969,95 → 13d runway

### F-codes descobertos Tocks
- **G-013 CONV-CHAOS** — 8 PRIMARY (canon 2) — pageview era PRIMARY enganando Smart Bidding
- **G-022** type=28 (Local actions + Clicks to call) immutable — precisa UI
- **G-023 NEW** — Google API PAUSED→REMOVED requer `.remove()` não `.update()`
- **F-CRM-Upload-Void** — Sales AI → Google offline conv bridge offline (Lead Qualificado R$13k = 0 fires/30d)
- **F-Bidding-NoCap** C007 (deferido pós-CRM-bridge)

### Daily spend Tocks
- R$230/d total (R$155 Meta + R$75 Google)
- Sem scaling até 05/Jun (D+21 gate Smart Bidding rebuild)

### Deliverables Tocks 15/Mai (6 arquivos)
- audit-spike + audit chief
- inventory google + meta
- operacao-tocks-30d-chief
- playbook tocks

## 🚫 Sales AI Tocks — DEPRECATED

User decision: "este sales só me deu trabalho". Substituição via novo CRM.
- Kill switch code READY pelo @aios-dev (`apps/tocks-sales-ai/src/integrations/whatsapp-client.ts` linha 151, env var `SALES_AI_ENABLED=false`)
- NÃO deployed — user precisa adicionar env var no Railway + restart
- Rollback: 1min (deletar env var ou setar `true`)
- Tests: `whatsapp-client.killswitch.test.ts` 6 cases passing
- Deliverable: `docs/projects/tocks/actions/disable-sales-ai-2026-05-15-aios-dev.md`

## 📦 CRM Novo Project — PENDING DECISIONS

User pediu rebuild greenfield (Sales AI deprecated). Pendente:

### Q1 — Escopo
(a) Simples / (b) Médio / (c) Completo / (d) Enterprise

### Q2 — Build vs Buy
(a) SaaS existente / (b) No-code / (c) Custom build / (d) Híbrido

### Q3 — Persona
Só você / equipe Tocks 2-4 / Bretda também / multi-tenant AIOS

### Q4 — Integrations must-have
WhatsApp Business / Meta+Google offline conv / Email / Calendar / Pixel / LGPD / Multi-language / Mobile

### HYDRA research strategy
- (A) Fix HYDRA pipeline + run mega research
- (B) Fallback ingest-dossier.mjs (proven 08/Mai)
- (C) Squad research direto (analyst + content team)

Default sensato (se user disser "vai"):
- Médio (b) escopo
- Custom build (c) Next.js + Supabase + WhatsApp Business API
- Multi-user (você + Tocks team)
- WhatsApp + Meta/Google offline conv + LGPD must-have
- 8-10 SaaS benchmarks + open-source CRMs + stack patterns + BR specifics

## 📋 USER ACTIONS PENDENTES (priorizado)

### 🔴 Urgente
1. Smoke test F7 Bretda LP `/obrigado` (5min)
2. **D+1 16/Mai 09h:** invocar "@orion bretda D+1" → swap CP1 forms + scale CJ8v2 R$60→R$72
3. **D+5 20/Mai:** PIX Google Bretda R$500-1000 (hard deadline)
4. **D+7 22/Mai:** gate close rate Bretda

### 🟡 Esta semana
5. Saldo Meta Tocks UI check + PIX se <R$200
6. Saldo Google Tocks UI confirm R$969
7. Smoke test Tocks WhatsApp +55 47 3041-9811 (F5 prevention)
8. Audit Sales AI Tocks dashboard chat sessions 01-14/Mai (~30min)
9. Decidir CRM Qs 1-4 + HYDRA caminho A/B/C

### 🟢 Quando possível
10. UI fix Bretda F6 zumbi `[AGD] Lead 7138711130`
11. UI fix Tocks 2 conv type=28 (Local actions + Clicks to call)
12. Archive Tocks 3 Meta camps com creative Reel broken (manual UI)
13. Investigate C005-01 destination_type=UNDEFINED
14. Sales AI Tocks kill switch deploy (Railway env var) — opcional, pode esperar CRM novo
15. @aios-dev D++ CAPI Tocks reopen PR #645
16. @aios-dev Sales AI → Google offline conv bridge fix (CRM bridge)

## 📅 Calendar gravado nos memories chief

- `D:\AIOS\.claude\agent-memory\traffic-masters-chief\bretda_scaling_calendar_15mai.md` — D+1/D+3/D+7 Bretda
- `D:\AIOS\.claude\agent-memory\traffic-masters-chief\tocks_scaling_calendar_15mai.md` — D+7/D+21 Tocks

## 🎓 Lições aprendidas + memory drift discoveries

- Playbook canon ≠ realidade — sempre validar via API live (07/Mai Bretda QW1 claimed done, era PENDING)
- Squad chief activator deve refletir realidade — 4 canon ENABLED memory, mas 3 estavam PAUSED 12/Mai sem update
- Codeless conv `type=37` (Bretda) e `type=28` (Tocks) IMMUTABLE via API — UI only
- Google API PAUSED→REMOVED requer `.remove()` não `.update({status:'REMOVED'})`
- Spend cap dinâmico Bretda ≠ outras contas (não usar gap como runway)
- Lead form Thank You button_type=WHATSAPP = diferenciador (vs VIEW_WEBSITE = void)
- Manual CPC = sem learning window (mudanças imediatas) — diferente Smart Bidding (21d)
- Bot inflando métrica Meta first_reply = ~23% são humanos reais (Sales AI Tocks pattern)

## 🔗 Related memories chave

- `feedback_bretda_meta_spend_cap_dynamic.md`
- `session_bretda_full_day_15mai.md`
- `feedback_meta_destination_type_validation.md`
- `feedback_meta_budget_jump_no_more_2x.md`
- `feedback_meta_ctm_waba_wrong_number.md`
- `feedback_no_shopping_bretda_tocks.md`
- `feedback_check_out_of_scope_first.md`
- `feedback_squad_delegation.md` — squad only handles in-scope (campaigns), reject scope creep
- `project_hydra.md` — HYDRA state degraded RESUME POINT
- `reminder_hydra_distribution_bug_14mai.md`
- `reminder_hydra_mega_research_resume_12mai.md`
- `project_tocks_sales_ai.md` — Sales AI deprecated (user 15/Mai)
