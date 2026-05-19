# Next Steps — Breno · O que VOCÊ precisa fazer

**Status:** 🔴 Materiais prontos · execução fisicamente pendente
**Data ref:** 2026-05-19 (Day 0)
**Pessoa que executa:** Breno (não há como Orion fazer estes — são ações humanas reais)

---

## 🚨 HOJE (Day 0 · Segunda 19/Mai) — 90 minutos total

### Bloco 1 · Buscador Licitações (15 min)

- [ ] **Mandar deck pro amigo** via WhatsApp
  - Anexo: `docs/projects/buscador-licitacoes/06-deck-workflow-cliente/deck.pdf` (647KB)
  - Texto sugestivo: *"Cara, montei um deck de 10 slides com o workflow completo pro buscador de licitações. Dá uma olhada quando puder + me marca uma call pra fechar 6 perguntas (45min). Se gostar, segunda que vem começamos."*
  - Bônus opcional: anexar também `BRIEFING-CLIENTE-Workflow.pdf` (853KB) — explicação mais detalhada se ele quiser ler aprofundado

### Bloco 2 · CRM Novo · WhatsApp agendamento (10 min)

- [ ] **Mandar convite Cristiane** (template em `04-whatsapp-templates-agendamento.md` §1)
  - Propor terça (Day 2) 10h ou quinta (Day 4) 16h — escolha 2 horários reais seus
- [ ] **Mandar convite Rudson** (template §2)
  - Propor quarta (Day 3) 11h ou quinta (Day 4) 17h

### Bloco 3 · CRM Novo · Provisionamento de credenciais (45 min)

**🚨 BLOQUEIO CRÍTICO — começar HOJE porque Google Ads Dev Token demora 24h aprovação.**

- [ ] **Google Ads Developer Token** (5 min envio + 24h espera)
  1. `ads.google.com/aw/apicenter` → API Center
  2. Aplica pra Developer Token (Standard access)
  3. Justificativa: "Building internal CRM for offline conversion uploads (Lead Qualified, Purchase events) to improve attribution accuracy in our own ad campaigns."
  4. Salva o token quando aprovar (24h depois)

- [ ] **Meta System User Token** (15 min)
  1. `business.facebook.com` → Business Settings → Users → System Users
  2. Cria novo System User: "CRM Bridge"
  3. Atribui assets: Pixel `[YOUR_PIXEL_ID]` + Page Tocks
  4. Generate New Token → Permissions: `ads_management`, `business_management`
  5. **Token never expires** — salva em 1Password

- [ ] **Supabase project** (10 min)
  1. `supabase.com` → New project
  2. Nome: `crm-novo-staging` (pra ambos Bridge + Sprint 1)
  3. Region: **São Paulo (sa-east-1)** — não esqueça
  4. Database password: salva em 1Password
  5. Project URL + anon key + service_role key → 1Password

- [ ] **Vercel project + Inngest account** (10 min)
  1. `vercel.com` → New Project (vincula ao monorepo aios)
  2. `app.inngest.com` → Sign up + New App `crm-bridge-staging`
  3. Generate Event Key + Signing Key → 1Password

### Bloco 4 · Bloquear agenda própria (5 min)

Calendário Google da semana:

- [ ] **Day 2 (Ter 20/Mai)** · 30min auto-entrevista Breno (15h)
- [ ] **Day 3 (Qua 21/Mai)** · 90min Bridge deploy + entrevista Rudson
- [ ] **Day 5 (Sex 23/Mai)** · 8h dogfooding INTEIRO (calendário trancado)
- [ ] **Day 7 (Dom 25/Mai)** · 90min Gate 0 review

### Bloco 5 · Opcional (15 min)

- [ ] **Decidir naming** Buscador (`Hopper` / `Ediac` / `Ada`) — ver `docs/projects/buscador-licitacoes/00-context/NAMING-OPTIONS.md`
- [ ] **Aplicar copy review** ao briefing cliente Buscador (25-35min mudanças cirúrgicas) — ver `06-deck-workflow-cliente/COPY-REVIEW-BRIEFING-CLIENTE.md`

---

## 📅 ESTA SEMANA · Cronograma diário

```
SEG 19/Mai (Day 0)  ──► Bloco 1-5 acima ✓
TER 20/Mai (Day 1)  ──► Confirma horários com Cristiane/Rudson
                       Follow-up se não responderam (template §4)
                       Recebe Google Ads Dev Token (esperado)
QUA 21/Mai (Day 2)  ──► 10h · Entrevista Cristiane (script §Bloco 1-5)
                       15h · Auto-entrevista Breno (mesma estrutura)
                       Anota Top 3 dores cada, score 0-10
QUI 22/Mai (Day 3)  ──► 09h-12h · Bridge Standalone setup
                          cd docs/projects/crm-novo/60-bridge-standalone
                          pnpm install
                          cp .env.example .env.local (preenche com tokens reais)
                          pnpm db:migrate
                          pnpm google:oauth (gera refresh token)
                          pnpm dev → http://localhost:3000
                          pnpm test:event → verifica audit_log row criada
                       11h · Entrevista Rudson (paralelo se possível, senão deslocar)
                       18h · Deploy Vercel staging
SEX 23/Mai (Day 4)  ──► Reserva · processar 3 entrevistas (transcrição + scorecard)
                       Preencher Google Sheets aba `entrevistas`
SAB 24/Mai (Day 5)  ──► DOGFOODING DIA INTEIRO
                       Operar Tocks 8h via WhatsApp + planilha + Bridge
                       Tracking simultâneo no dashboard HTML
                       Debrief 30min ao final
DOM 25/Mai (Day 6)  ──► Reserva · recovery + dormir com evidência
                       Não tomar decisão Gate 0 hoje
SEG 26/Mai (Day 7)  ──► 14h-15h30 · GATE 0 REVIEW (90min)
                       Aplica checklist `03-gate-0-review-checklist.md`
                       Documenta verdict em `04-gate-0-decision-2026-05-25.md`
                       Verdict: 🟢 / 🟡 / 🔴 / ⚫
```

---

## 🔄 SEMANA QUE VEM (se Gate 0 = 🟢 Verde)

```
TER 27/Mai ──► Kickoff Sprint 1 Alpha
              Abre stories em ordem: CRM-1.1 → CRM-1.2 → CRM-1.3 → CRM-1.4 → CRM-1.5 → CRM-1.6
              48h estimate = 6 dias úteis (paralelizando algumas)
QUA 28-SEX 30/Mai ──► CRM-1.1 (bootstrap) + CRM-1.3 (schema) em paralelo
SEG 02/Jun ──► CRM-1.2 (auth) + CRM-1.5 (inngest)
QUA 04/Jun ──► CRM-1.4 (onboarding) + CRM-1.6 (audit middleware)
SEX 06/Jun ──► Sprint 1 Done · QA review
SEG 09/Jun ──► Sprint 2 kickoff (WhatsApp core)
```

**Material pronto:** `docs/projects/crm-novo/61-sprint-1-alpha/` — 6 stories com Technical Notes + Code snippets executáveis.

---

## 🔀 SEMANA QUE VEM (se Gate 0 = 🟡 Amarelo)

- Estender pra N=5 com 2 externos B2B Brasília
- Re-rodar análise com sample maior
- Re-Gate 0 em 7-10 dias

---

## 💀 SEMANA QUE VEM (se Gate 0 = 🔴 Vermelho)

- PIVOT Bridge-only confirmado
- Stories Sprint 1 vão pra `40-pivot-bridge-only/`
- Foco: deploy Bridge prod + integração 1 fluxo Tocks real
- Sem CRM UI, sem Sprint 2-4 do plano original

---

## ☠️ SEMANA QUE VEM (se Gate 0 = ⚫ Preto)

- KILL documentado em `99-synthesis/POST-MORTEM-CRM-NOVO.md`
- Tempo reabsorvido em:
  - **Anipis Beta 30/Mai** (12 P0 pendentes — ver memória)
  - **Tocks operação** (otimização Meta+Google atual)
  - **IOX-Services #01 Contract-on-Call** (~R$15-25k setup)

---

## 🎯 Outros projetos paralelos pendentes (informação)

Enquanto você executa Week 0, esses ficam congelados:

| Projeto | Status | O que falta |
|---------|--------|-------------|
| **Anipis Beta 30/Mai** | 🟢 11 dias até beta | 12 founder action items + 4 runbooks Orion pendentes autorização |
| **IOX-Services #01 Contract-on-Call** | 🟢 next | Kickoff (advocacia bancária litígio) |
| **KR LINK_CLICKS** | 🟡 policy hold | Esperar Meta destravar BM (subcode 2446325) |
| **Buscador Sprint 0** | 🟢 ready | Esperar amigo agendar call de 45min |
| **Site-Prospector pilot** | 🟢 review 09/Jun | Aguardar review date |

**Recomendação:** focar 100% em CRM Week 0 esta semana. Paralelizar só **Anipis Beta** (porque 30/Mai = 11 dias, tem deadline real).

---

## ⏰ Time budget realista

| Slot | Duração | Foco |
|------|---------|------|
| Hoje (19/Mai) | 90min | Bloco 1-4 acima (mandar mensagens + provisionar credenciais + bloquear agenda) |
| Day 2 (Ter) | 60min | 2 entrevistas + anotações |
| Day 3 (Qua) | 4h | Bridge setup + 1 entrevista |
| Day 4 (Qui) | 2h | Processar entrevistas |
| Day 5 (Sex) | 8h | Dogfooding dia inteiro |
| Day 6 (Sab) | 0h | Reserva |
| Day 7 (Dom) | 90min | Gate 0 review |
| **TOTAL Week 0** | **~17h** | Spread em 7 dias |

---

## 📋 Checklist consolidado HOJE

Você pode copiar isso e colar como TODO no seu sistema:

```
[ ] WhatsApp deck buscador pro amigo
[ ] WhatsApp convite Cristiane (template §1)
[ ] WhatsApp convite Rudson (template §2)
[ ] Aplica Google Ads Developer Token (24h espera)
[ ] Gera Meta System User Token + salva 1Password
[ ] Cria Supabase project sa-east-1 + salva creds
[ ] Cria Vercel + Inngest accounts + salva keys
[ ] Bloqueia Calendar: Day 2 (Ter 15h), Day 3 (Qua 9h-12h), Day 5 (Sex inteiro), Day 7 (Dom 14h-15h30)
[ ] Opcional: decide naming Buscador (Hopper/Ediac/Ada)
[ ] Opcional: aplica copy review briefing buscador (25-35min)
```

---

*Documento gerado por Orion 2026-05-19 · Atualize verdict Day 7 e arquive em pasta 04-gate-0-decision-*.md*
