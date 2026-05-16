# Conclave Synthesis — CRM Novo Plan Validation

**Conclave ID:** `11c08364-a9f7-4afd-9446-335e8ef6f3ee`
**Question:** CRM Novo MVP V0 8-12 weeks plan validation. Dealbreakers?
**5 experts auto-selected by brain-bridge:** proposal-writer, campaign-manager BLITZ, guillaume-moubeche, eric-ries, warren-buffett
**Date:** 2026-05-15
**Mode:** Inline synthesis (prompts generated, responses synthesized via expert principles)

---

## 🎯 Why these 5 experts?

Brain-bridge auto-routing detectou pergunta como "business validation + execution" (não puramente technical). Routing entregou business + lean + sales experts. **Complemento ideal ao UltraPlan que já cobriu técnico** (martin-fowler, paul-copplestone, werner-vogels inline).

Cobertura dos 5:
- **proposal-writer** — internal selling do CRM pra Tocks team
- **campaign-manager BLITZ** — launch como campanha estruturada
- **guillaume-moubeche** — founder-led validation (Breno na trincheira)
- **eric-ries** — Concierge MVP, validation antes de build
- **warren-buffett** — economic moats, capital allocation, margin of safety

---

## 🔥 Expert-by-Expert Analysis

### 1. **Proposal Writer** — "Sell the plan internally first"

**Frameworks aplicados:**
- Executive Summary First
- Pain-Solution-Outcome Structure
- ROI Quantification (conservative/moderate/aggressive scenarios)
- Competitive Differentiation Without Naming

**Verdict on CRM Plan:**
> ⚠️ **CONCERN**: Plan is technical-first. Onde está o ROI quantification pro Tocks team? Antes de pedir 1 vendedor full-time 5 dias (Week 8 pilot), o vendedor precisa ENTENDER o valor.

**Recommendation:**
- Adicionar **internal pitch doc** Week 0 (1-página):
  - **Pain:** "Quantos leads você perde por dia respondendo lento? 99 leads/12d = R$X em CAC desperdiçado (KR pattern)"
  - **Solution:** "Inbox WhatsApp real-time. 1 clique pra ver histórico. Bridge automático para Google Ads contar Lead Qualificado"
  - **Outcome (conservative):** "Resposta < 60s; Lead Qualificado tracked"
  - **Outcome (moderate):** "+15% close rate em 90 dias"
  - **Outcome (aggressive):** "+30% close rate + R$50k recovered/quarter"

**Action item:** Criar `01-internal-pitch-tocks.md` Week 0.

---

### 2. **BLITZ — Campaign Manager** — "Launch como campanha, não como deploy"

**Frameworks aplicados:**
- Alpha/Beta Campaign Structure
- ROAS-Driven Budget Allocation
- Modular Creative Testing Matrix

**Verdict on CRM Plan:**
> ⚠️ **CONCERN**: Plan trata Tocks como "tenant #1 = pilot". Mas Tocks vai TER campanhas Meta/Google ativas durante o pilot — o CRM precisa lidar com volume real desde dia 1, NÃO usuário curioso.

**Recommendation:**
- **Alpha launch (Week 1-4):** Tocks SOMENTE. Volume baixo controlado (max 50 leads/d). Bugs OK.
- **Beta launch (Week 5-8):** Tocks volume real. Bretda em ride-along (lê inbox, não opera). Bridge LIVE.
- **GA launch (Week 9-12):** Bretda full operação. Vorza migra quando email pivot ready.

**Modular testing matrix** (validação CRM Novo):
| Variable | Test variants | Significance threshold |
|----------|---------------|------------------------|
| Onboarding flow | Magic link vs Google OAuth | 80% Tocks team prefers |
| Inbox layout | Inbox-first vs Pipeline-first | NPS ≥7 sustained 2 weeks |
| Bridge upload | Real-time vs Batch 5min | 99%+ success rate |
| Mobile experience | PWA vs Web only | 60%+ daily mobile usage |

**Action item:** Adicionar Alpha/Beta/GA phases ao roadmap. Criar testing matrix tracking.

---

### 3. **Guillaume Moubeche** — "Founder in the trenches"

**Principles aplicados:**
- Execution > Idea
- Profit-Led Growth (Charge from day one)
- Trust Is the Currency
- Show Up Every Day
- Founder Is the Growth Engine

**Verdict on CRM Plan:**
> 🔴 **DEALBREAKER risk**: "Solo dev sustainable pace" assumption. Breno está spreading too thin (Bretda + Tocks + Vorza + CRM build + AIOS framework + Site-Prospector + HYDRA). **Activation NOW** principle violado.

**Recommendation:**
- **Fix activation NOW:** Antes de Sprint 1 (Week 1), Breno faz **5 entrevistas de 30min com vendedor(es) Tocks**. Listen for real pain (não validation theater).
- **Founder back in demos:** Breno é o primeiro user. Week 1-4 Breno opera Tocks Meta inbox **através do CRM v0 esqueleto** (mesmo que feio). Force dogfooding.
- **Kill vanity metrics:** Não medir "features shipped". Medir:
  - Lead → response time (Tocks current vs CRM)
  - Lead Qualificado fire rate (current 0/30d vs CRM Novo target 1/d)
- **Charge from day one** internamente: cada tenant aceita pagar R$50/mo "preço simbólico" pra criar accountability + força roadmap user-driven.

**Action item:** Pre-Sprint 1, 5 entrevistas + dogfooding desde Week 1.

---

### 4. **Eric Ries** — "Concierge MVP before code"

**Frameworks aplicados:**
- Concierge MVP (recruit users manually)
- Value Hypothesis + Growth Hypothesis
- Customer Need Pivot (validate need exists)

**Verdict on CRM Plan:**
> ⚠️ **VALIDATION GAP**: Plan assume Tocks team WANTS um CRM novo. Onde está a evidência? Sales AI failure ≠ CRM Novo success. Talvez Tocks team prefira WhatsApp Web + planilha (current reality).

**Recommendation:**
- **Week 0 Concierge MVP:** Antes de codar UMA linha, rodar manualmente 1 semana:
  - Breno + 1 vendedor Tocks usa apenas **planilha Google + WhatsApp Web + Inngest workflow standalone** pra Bridge Lead Qualificado.
  - Mede: 99 leads/dia processados? Bridge funciona standalone? Vendedor sente friction real?
- **Value Hypothesis:** "Vendedor Tocks valoriza inbox unificado WhatsApp + deal tracking suficiente pra usar daily" — testar Week 0.
- **Growth Hypothesis:** "CRM Novo permite Tocks escalar de 1 vendedor pra 3 vendedores Q3 2026" — testar pós-V0.
- **Customer Need Pivot trigger:** Se Week 0 Concierge mostra que vendedor PREFERE WhatsApp Web + planilha, **PIVOT**: build apenas o Inngest Bridge + LGPD layer, deixa UI mínima.

**Action item:** Week 0 = 1 semana Concierge MVP antes Sprint 1.

---

### 5. **Warren Buffett** — "Capital preservation + Economic Moats"

**Principles aplicados:**
- Rule No. 1: Never lose money
- Economic Moats (durable competitive advantage)
- Circle of Competence
- Margin of Safety
- Price Is What You Pay, Value Is What You Get

**Verdict on CRM Plan:**
> 🟡 **MIXED**: Plan tem moat real (Bridge Meta+Google offline conv é raro), mas Circle of Competence questionável (CRM full features é vasto domínio).

**Recommendation:**
- **Identify the moat clearly:** CRM Novo's moat é **Bridge bidirecional Meta CAPI + Google offline conv built-in com idempotency + dead-letter queue**. Tudo o resto é commodity. NÃO disperse foco.
- **Circle of Competence:** Breno conhece Meta CAPI (Bretda) + WhatsApp (Tocks/KR) + Supabase (AIOS). NÃO conhece: CRM enterprise features (forecasting, complex permissions, custom workflows). **STAY IN CIRCLE.**
- **Margin of Safety:**
  - 12 semanas declared, 16 semanas budgeted internally (Buffett: "It is far better to buy a wonderful company at a fair price than a fair company at a wonderful price" — translation: aceita 4 semanas extras pra ter MVP estável)
  - $0 raised externally — bootstrap mantém Profit-Led Growth (alinha com Moubeche)
- **Erosion risks reais:**
  - Platform shift: Se WhatsApp Meta muda Cloud API model 2027 (volume tiers já mudaram Jul/25)
  - AI displacement: GPT-6/Opus 6 inline CRM via prompt poderia obsoletar CRMs custom 2027-28
  - Regulatory: ANPD data residency BR obrigatório poderia forçar migration Supabase US → Magalu Cloud

**Action item:** Documentar **moat statement** explícito no FEATURES.md. Defer enterprise CRM features pra fora do circle.

---

## 🎯 CONSENSUS (5/5 agree)

1. **Plan technically solid mas business validation thin** — Week 0 obrigatório (Concierge MVP + entrevistas + internal pitch)
2. **Solo dev burnout é #1 risk** — 16 semanas budgeted, 12 declared. Margin of safety 33%.
3. **Bridge Meta/Google é moat real** — single feature que vence todos SaaS. Stay focused.
4. **Tocks pilot Week 8 precisa preparação** — não last-minute. Co-design Week 2-4.
5. **Founder dogfooding desde Week 1** — Breno opera CRM antes de pedir Tocks operar.

---

## ⚠️ DISSENT (não 5/5)

**Proposal-writer vs Buffett:**
- proposal-writer push aggressive ROI claims (+30% close rate aggressive scenario)
- Buffett "Never lose money" + Margin of Safety = conservative ROI claims
- **Resolução:** Pitch interno usa ROI tiers explicit. Conservative = Tocks responds <60s. Moderate = +15%. Aggressive = +30%. Don't oversell.

**Eric Ries vs BLITZ Campaign Manager:**
- Ries: Concierge MVP first, validate need
- BLITZ: Launch like campaign, A/B/B variations from day 1
- **Resolução:** Week 0 Concierge serve as Pre-Alpha. Alpha (Week 1-4) introduz A/B variants gradually.

**Guillaume vs Plan:**
- Guillaume: "Charge from day one" — internal R$50/mo per tenant
- UltraPlan: NOT FOR SALE Phase 1
- **Resolução:** Internal pricing simbólico (R$50/mo per tenant) cria accountability. Sale externa Q3 2026 review.

---

## 🚨 BLIND SPOTS surfaced

1. **No Week 0 in plan** — Concierge MVP + entrevistas + dogfooding missing
2. **No internal pitch doc** — Tocks team going to be asked to use without selling first
3. **No moat statement** — CRM has 85 features mapped; moat (Bridge) underemphasized
4. **No Customer Need Pivot trigger** — what if Week 0 reveals need ≠ CRM?
5. **No founder accountability** — Breno scattered across 6+ projects; CRM Novo competes for attention
6. **Erosion risks underweighted** — Platform shift Meta + AI displacement + regulatory

---

## 🎯 VERDICT

**Conclave decision:** PROCEED WITH MODIFICATIONS

**6 modifications to UltraPlan:**

1. **Add Week 0 Concierge MVP** (mandatory):
   - 5 entrevistas vendedor Tocks (30min cada)
   - 1 semana Breno + vendedor Tocks operando manualmente (planilha + WhatsApp Web + Inngest Bridge standalone)
   - Measure: response time, bridge fires/day, friction points
   - **Customer Need Pivot trigger:** if vendedor prefere status quo, PIVOT to Bridge-only product

2. **Add internal pitch doc Week 0:**
   - 1-página Pain-Solution-Outcome
   - 3-tier ROI (conservative/moderate/aggressive)
   - Present to Tocks team antes de Sprint 1

3. **Reframe phases as Alpha/Beta/GA:**
   - Alpha: Week 1-4 (Tocks low volume)
   - Beta: Week 5-8 (Tocks production + Bretda ride-along)
   - GA: Week 9-12 (Bretda live + Vorza migrate when ready)

4. **Adopt 16-week budget (4-week safety margin):**
   - Declared timeline 12 weeks (sandbag)
   - Internal budget 16 weeks (margin of safety Buffett)
   - Communication external: 12 weeks. Internal: 16.

5. **Add moat statement to FEATURES.md:**
   - The Moat: "Bridge bidirecional Meta CAPI + Google offline conv com idempotency + dead-letter queue + audit trail"
   - Everything else is commodity. Stay focused.

6. **Founder dogfooding constraint:**
   - Week 1-4: Breno opera Tocks Meta inbox via CRM v0 skeleton (mandatory)
   - Force eat-your-own-dogfood
   - Aceita janky UX Week 1-4, polished Week 5+

---

## ✅ Updated Roadmap

| Phase | Weeks | Mode | Critical activity |
|-------|-------|------|-------------------|
| **Week 0** | 1 week | Concierge MVP | 5 entrevistas + dogfooding manual + Bridge standalone |
| **Alpha** | W1-4 | Foundation + WhatsApp Core | Breno dogfoods Tocks via CRM v0 + Bridge live + Gate 1 |
| **Beta** | W5-8 | Bridge + Pipeline + LGPD | Tocks production + Bretda ride-along + Gate 2 + Gate 3 |
| **GA** | W9-12 | V1 features + scale | Bretda live + Vorza migrate + Q3 V2 planning |
| **Buffer** | W13-16 | Slack budget | Polish + stabilization + AI features Phase 3 prep |

---

## 📋 Action Items (Pre-Sprint 1)

- [ ] Breno: 5 entrevistas vendedor Tocks (30min cada) — **Week 0 Day 1-3**
- [ ] Breno: Internal pitch doc 1-página para Tocks team — **Week 0 Day 2**
- [ ] Breno: Setup Inngest Bridge standalone (sem UI) + test Lead Qualificado fire E2E — **Week 0 Day 3-5**
- [ ] Breno: Dogfood: opera 1 dia Tocks Meta inbox via planilha + WhatsApp Web + Bridge standalone — **Week 0 Day 5-7**
- [ ] User: Decide moat statement final — **Week 0 Day 7**
- [ ] User: Confirm 16-week budget (4-week margin) — **Week 0 Day 7**

---

## 🔄 Trigger Reavaliação

- **Concierge MVP Day 7:** se vendedor prefere status quo → PIVOT to Bridge-only product (não full CRM)
- **Week 4 Gate 1:** Business Verification + Inbox check (UltraPlan original)
- **Week 7 Gate 2:** Bridge E2E success (UltraPlan original)
- **Week 8 Gate 3:** Tocks production check (UltraPlan original)
- **Week 12 GA review:** Bretda migration health
- **Week 16 stability review:** all 3 tenants stable?

---

*Conclave v1.0 final | 5 experts auto-selected via brain-bridge MCP | Inline synthesis | Orion 2026-05-15*
*Conclave ID: 11c08364-a9f7-4afd-9446-335e8ef6f3ee*
