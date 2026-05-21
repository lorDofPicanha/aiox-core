---
name: Anipis Founder Decisions 19/Mai (14 + 1 pivot)
description: 14 decisões founder fechadas via DECISIONS.html + pivot histórico "sem Patricia / sem advogado externo pré-Beta · squad legal AIOS assume + founder DPO interim assina + founder assume risco regulatório". Bundle compliance finalizado internamente. R5 Upstash cutover ARQUIVADO.
type: project
originSessionId: anipis-founder-decisions-19mai
---

## Sessão 19/Mai/2026 ~21h — Founder decisions batch + pivot legal

### Trigger
User abriu `DECISIONS.html` interativo, fechou 14 escolhas, copiou markdown e colou. No meio, decidiu pivot: "ignore Patricia, não vou fazer nada com eles agora nem com nenhum outro advogado, só depois. Seja com squad legal AIOS. Eu assumo o risco."

### 14 decisões fechadas

| # | Decisão | Escolha | Squad rec? |
|---|---------|---------|------------|
| **D5** | Design system | **Caderno status quo** | ✅ Recommended |
| **D6** | SCC Edição 2 caminho | **A doc-only** | ✅ Recommended |
| **D7** | DPIA 4 caminhos A | **Confirmar todos** | ✅ Default |
| **D8** | CNPJ / PJ | **MEI bridge + LTDA pós-Beta** | ✅ Recommended (pragmático) |
| **D9** | DPO interim | **Breno** | ✅ Beta-fit |
| **D10** | Honorários Patricia | **Aceito R$12-30k** | ✅ Default (porém moot pós-pivot) |
| **D11** | Email Patricia | **Hoje** (porém **CANCELADO** pós-pivot) | ✅ Default → MOOT |
| **D12** | Migration 011 | **Agora** | ✅ Safe |
| **D13** | R1 Railway | **Hoje noite** | ✅ Buffer |
| **D14** | R2 OpenAI ZRT | **Hoje** | ✅ Crítico |
| **D15** | Patricia formato | **.md como está** → MOOT pós-pivot | (não importa mais) |
| **D16** | Upstash Pro + cutover SP | **Pular (anti-pattern)** | ❌ Founder rejeitou rec |
| **D17** | Sentry server-side scrub | **Pós-Beta primeira semana** | ✅ Aceitável |
| **D18** | Anthropic 25/Mai critério | **DPA enterprise + ZDR explícito** | ✅ Padrão LGPD |

### Pivot crítico (mid-batch)

Após responder D14, founder disse:

> "ignore a parte da patricia, não vou fazer nada com eles agora nem com nenhuma outro advogado so depois, seja com nosso squad legal as decisões que faltam, eu assumo o risco"

**Implicações:**
- **D10** Honorários Patricia → MOOT
- **D11** Email Patricia → **CANCELADO** (arquivo movido para `12-compliance/archive-pulled-19mai/`)
- **D15** Formato anexos → MOOT
- **D6/D7** caminhos A → squad legal AIOS valida + founder assina como DPO interim
- **Bundle completo** (SCC v2 + DPIA v2 + Privacy Policy v2 + Termos Beta v2 + LIAs) → finalizado internamente, sem revisão OAB externa
- **Founder assume risco** de não ter chancela OAB em audit ANPD eventual. Engajamento OAB reavaliado pós-Beta (provavelmente Q3/2026).

**Decisão nova (Opção A escolhida):**
- Opção A · Squad legal AIOS finaliza tudo internamente. Founder assina como DPO interim. Docs disponíveis pra ANPD em audit eventual. Sem custo externo. Risco assumido.

### Ações executadas autonomamente pós-decisões

**D5 (token fix):**
- `apps/web/src/components/onboarding/InternationalTransferConsent.tsx` — tokens inventados (`--pergaminho-*`) → tokens reais Caderno (`--surface-raised`, `--text-primary`, `--brand-spot`, `--border-strong`, `--border-subtle`, `--font-serif`)
- `apps/web/src/components/onboarding/SubprocessorList.tsx` — mesmo refactor

**D16 (revert Upstash cutover):**
- `anipis-RIPD-DPIA-v2.md` §5 Tabela 4 — Upstash row: status "MIGRANDO sa-east-1" → "ATIVA us-east-1" + nota "cutover adiado D16"
- Sumário Executivo — "até 6 operadoras" → "5 operadoras estrangeiras efetivamente ativas"
- R2(e) mitigação — "Em curso" → "Roadmap pós-Beta, adiado D16"
- `Privacy-Policy-v2-draft.md` §7 Tabela — Upstash "MIGRANDO" → "ATIVA us-east-1"
- `apps/web/src/app/(legal)/transferencia-internacional/page.tsx` SUBPROCESSORS — Upstash status: 'migrando' → 'ativa', jurisdiction "Em migração..." → "Estados Unidos (AWS us-east-1)", notes adiada
- `15-runbooks/R5-upstash-sao-paulo-cutover.md` — header com **OBSOLETO PELO FOUNDER D16** banner + Decision referenciada preservada

**Patricia archive:**
- `12-compliance/email-Patricia-v2-READY-TO-SEND.md` → `archive-pulled-19mai/email-Patricia-v2-PULLED-19mai.md`
- `12-compliance/email-Patricia-v2.md` → `archive-pulled-19mai/email-Patricia-v2-draft-PULLED-19mai.md`
- `archive-pulled-19mai/README.md` criado explicando arquivamento + como reativar futuro

**SCC v2 FINAL (sem Patricia):**
- `SCCs-ANPD-19-2024-v2-FINAL.md` criado a partir de v1 + 4 edições aplicadas (Cláusulas 10.1(a), Anexo I Supabase §F, 12.1(f), 7.1(c.bis))
- Header v2 explica pivot + changelog + reverter path se Patricia for engajada futuramente
- Founder assina como DPO interim (pendente preenchimento CNPJ)

### Founder action items pós-decisões (pendentes)

**HOJE (19/Mai noite):**
1. **D12** Aplicar migration `011_ai_features_enabled` em Supabase prod → SQL Editor dashboard, ~30s
2. **D13** Começar R1 Railway BR setup (~45min) — usar `15-runbooks/R1-railway-br-setup.md`
3. **D14** Submit R2 OpenAI ZRT enrollment (~5min + 24-48h vendor) — usar `R2-openai-zdr-enrollment.md`

**Esta semana (D-7 a D-3, 23-27/Mai):**
4. **D8** Abrir MEI no portal MEI (gov.br) — ~1 dia, gratuito
5. **D9** Provisionar emails `dpo@anipis.com.br`, `privacidade@anipis.com.br`, `security@anipis.com.br`
6. **Preencher Tabela 1 DPIA v2** + Razão Social SCC v2 + §2 Privacy Policy v2 + §1 Termos Beta v2 com CNPJ + DPO + endereço
7. **DPO interim sign** (assina DPIA v2 + LIAs v1.1 + SCC v2 FINAL como Encarregado)

**Pós-Beta:**
8. **D17** Configurar Sentry server-side scrub dashboard (defense-in-depth pós-Beta semana 1)
9. **D18** Reavaliar Anthropic 25/Mai com critério: DPA enterprise + cláusula ZDR explícita (não dashboard-only)
10. **Reavaliar engajamento OAB advogada** (Q3/2026) — bundle squad-legal vira input pra revisão externa

### Triggers próxima sessão
- `migration 011 aplicada` — confirma + smoke test
- `r1 railway feito` — atualiza Closed-Beta-Checklist
- `r2 openai submitted` — agenda D-9 check
- `mei aberto cnpj recebido` — preenche bundle docs com dados reais
- `dpo sign bundle` — runbook assinatura DPO interim em todos os 6 docs
- `reavaliar anthropic 25mai` — gatilho D5
- `engajar advogada` — reativa pacote Patricia (mover de archive-pulled)

### Cross-doc consistency final (pós-pivot)

| Doc | Status |
|---|---|
| `SCCs-ANPD-19-2024-v2-FINAL.md` | ✅ Pronto, aguarda founder CNPJ + DPO sign |
| `anipis-RIPD-DPIA-v2.md` | ✅ Atualizado (D16 Upstash + pivot) |
| `Privacy-Policy-v2-draft.md` | ✅ Atualizado (D16) |
| `Termos-Beta-v2-draft.md` | ✅ Sem changes (não menciona Upstash specificamente) |
| `LIA-Sentry.md` v1.1 | ✅ Pronta |
| `LIA-Langfuse.md` v1.1 | ✅ Pronta |
| `transferencia-internacional/page.tsx` | ✅ Atualizado (D16) |
| `archive-pulled-19mai/` | ✅ Patricia bundle arquivado |
| `R5-upstash-cutover.md` | ✅ Marcado OBSOLETO |
| Suite testes | 889/889 (verificado em sessão anterior) |

**Why founder pivot:** decisão pragmática — engajar advogado adiciona R$12-30k + 5-15d cronograma + risco de v3/v4 iterations conflitando com Beta 30/Mai. Squad legal AIOS é qualitativamente comparável (Patricia Peck clone + 4 especialistas internacionais) com zero custo + zero delay. Trade-off: sem chancela OAB em audit. Founder julga risco aceitável pra Beta 20 usuárias pré-selecionadas (rede pessoal).

**How to apply próxima sessão:** assumir bundle squad-legal como source-of-truth. Patricia só volta ao radar se ANPD audit pós-Beta vier (Q3/2026+) OU se decidir entrar advogada full-time. Founder action items são fontes-de-trabalho próximas semanas.
