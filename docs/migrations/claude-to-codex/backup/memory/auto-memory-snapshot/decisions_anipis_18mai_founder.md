---
name: Anipis Founder Decisions 18/Mai pre-Closed-Beta
description: 4 decisões founder registradas (+3 correções) para destravar pré-Beta 30/Mai. API host Railway BR, Anthropic deferir 7d, Beta date firme com slip 7/Jun, Júlias rede pessoal pré-selecionada (sem open application).
type: project
originSessionId: anipis-founder-decisions-18mai
---

## Sessão 18/Mai/2026 ~22:30 — Founder decisions Anipis pre-Closed-Beta

### Disparada por user pós Full Security Review
User pediu "vamos com as decisões" para destravar pré-Beta. Orion estruturou 4 perguntas críticas via AskUserQuestion, founder respondeu, gerou 3 correções importantes na 2ª rodada.

### 4 Decisões registradas

| # | Decisão | Escolha | Implicação |
|---|---------|---------|------------|
| **D1** | API Host | **Railway (BR region)** | Setup 5min, BR region, Postgres add-on integrado. Custo: ~$5-20/mês Beta |
| **D2** | Anthropic Claude Haiku fallback | **DEFERIR 7 dias** (reavaliar 25/Mai) | Setar `ANTHROPIC_API_KEY=undefined` em prod. Boot passa sem ANTHROPIC_ZDR. Perde resilience multi-provider temporariamente. Custo: $0 |
| **D3** | Beta date 30/Mai | **MANTER FIRME com slip seguro 7/Jun** | Pressão alta mas mantém momentum. Hard gate 27/Mai (Patricia v2). Slip > 7/Jun = VETADO (colide D-04 LOI 13/Jun) |
| **D4** | Recrutamento 20 Júlias | **REVERTIDA** (era open application) → **REDE PESSOAL PRÉ-SELECIONADA** | "Eu já tenho as pessoas para testarem a aplicação". Remove necessidade de LP captação, marketing orgânico, triagem formal |

### 3 Correções founder na 2ª rodada (importantes!)

**Correção C1 — Reverteu D4 inicial:**
- User: "eu ja tenho as pessoas para testarem a aplicação"
- Implicação: ZERO open application work. Volta pra rede pessoal/profissional pré-selecionada.
- Remove: LP de captação (2h), marketing orgânico (5d), triagem clinical advisor formal (7h)
- Adiciona: lista das 20 + envio de convite (~30min)

**Correção C2 — Desconstruiu necessidade de triagem:**
- User: "isso não pode ser automatizado e por que eu preciso de triagem"
- Insight correto: triagem formal só faz sentido em open application. Quando founder pré-seleciona conhecidos, pré-seleção JÁ É a triagem. Adicionar processo formal seria redundante, bottleneck e ofensivo (transforma convite em entrevista).
- Substituição leve: incluir 1 linha no email convite tipo "Esse Beta é experimental. Se você está atravessando uma crise grave agora, sugiro adiar — pode pular sem problema." = auto-screening voluntário, não triagem.

**Correção C3 — LP de captação adiada:**
- User: "pesquisar sobre o assunto, preciso de dados para validar esta decisão"
- Não vai usar LP pra Beta fechado. Pesquisa fica pra **public launch (13/Jun+)** quando estratégia de aquisição importa.
- Item futuro: `pesquisar LP captação Anipis public launch` (pós-Beta).

### Plano de execução atualizado pós-decisões

**Founder (você) — 12 itens:**

Esta semana (19-23/Mai):
1. ✅ D1 — Railway BR setup (vou criar runbook)
2. OpenAI ZDR enrollment via dashboard (~30min + 24h vendor)
3. ✅ D2 — Remover `ANTHROPIC_API_KEY` do env prod (1 mudança)
4. Supabase Pro upgrade (~5min, $25/mês)
5. Sentry projetos criar (Anipis API + Anipis Web) (~30min)
6. `security@anipis.com.br` provisionar (~15min)
7. CNPJ Preâmbulo SCC preencher (~5min)
8. Email Patricia v2 enviar (texto pronto em `12-compliance/email-Patricia-v2.md`)

Próxima semana (26-30/Mai):
9. DNS custom domains (`anipis.com.br`, `api.anipis.com.br`) (~1h + propagation)
10. DPO interim + clinical advisor CRP confirm
11. ✅ D4 — 20 Júlias convite (~30min) — emails com linha auto-screening
12. GO/NO-GO call 29/Mai 18h

**Orion (próxima execução possível):** 4 runbooks executáveis
- R1. Runbook Railway BR setup (founder segue passo-a-passo)
- R2. Runbook OpenAI ZDR enrollment
- R3. Refactor env.ts pra aceitar ANTHROPIC_API_KEY=undefined gracefully
- R4. Template email pras 20 Júlias

**Status:** Founder pediu "salve tudo" antes de autorizar Orion executar runbooks. Aguardando próxima sessão pra autorização.

### Conflito identificado + resolvido (timeline open application vs Beta date)

Open application orgânico requer 2-3 semanas. Founder tinha 12 dias (D-12). Apresentei 4 opções de mitigação:
- Aceitar 15-20 e começar Beta com o que tiver
- Hybrid (5 conhecidos + open application)
- Plano B pago (Meta Ads R$50/dia)
- Slip Beta date 7/Jun

User reverteu decisão original (Correção C1) tornando o conflito moot — rede pessoal pré-selecionada cabe perfeitamente em 12 dias.

### Cronograma final Sprint 1.5 (sem stress)

```
D-12 (18/Mai HOJE)  Sessão decisões salva
D-11 (19/Mai Seg)   Founder: Railway provisioning + remover ANTHROPIC_KEY + ZDR enrollment
D-11 (19/Mai Seg)   Dev: F1+F2+F3 hotfixes (~2h total)
D-10 (20/Mai Ter)   Founder: Supabase Pro + Sentry + security@anipis + CNPJ + Patricia email
D-10 (20/Mai Ter)   Dev: F5 RLS audit
D-7  (23/Mai Sex)   Dev: DEV-2 frontend (4-6h)
D-6  (24/Mai Sáb)   Dev: DEV-2 backend (2h)
D-5  (25/Mai Dom)   REAVALIAR D2 Anthropic (deferir prazo)
D-4  (26/Mai Seg)   Dev: smoke test staging full
D-3  (27/Mai Ter)   ⚠️ HARD GATE — Patricia SCC v2 deve chegar
D-2  (28/Mai Qua)   Founder: 20 Júlias convite emails enviados (+linha auto-screening)
D-2  (28/Mai Qua)   Founder: DNS apontando, DPO + CRP confirm
D-1  (29/Mai Qui)   GO/NO-GO call 18h
D-0  (30/Mai Sex)   Beta starts
```

### Triggers próxima sessão
- `vai executar runbooks` — Orion roda os 4 runbooks (Railway, ZDR, Anthropic refactor, email Júlias template)
- `fix f1 f2 f3 agora` — Orion executa os 3 dev hotfixes (F1+F2+F3)
- `dev2 implementar` — Orion começa build consent UI (4-6h frontend + 2h API)
- `reavaliar anthropic 25mai` — gatilho pra D2 reavaliação
- `go/no-go 29mai` — runbook final pre-Beta
- `update kpi dashboard anipis` — setup Langfuse + Sentry dashboards

**Why founder fez "salve tudo" antes de autorizar runbooks:** quer checkpoint antes de executar. Sessão longa (3+ horas), múltiplas decisões, prefere validar plano salvo antes de Orion autonomamente executar dev/config work. Boa prática.

**How to apply próxima sessão:** Ler este memo + Closed-Beta-Checklist + Full-Security-Review. Founder pode autorizar runbooks individuais OU em lote. Orion deve confirmar antes de cada bloco de execução autônoma significativo.
