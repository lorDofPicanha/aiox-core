---
name: Bretda Gate D+7 14/Mai
description: Gate 14/Mai/2026 — comparar CPL real (sobre fechamento) LP form vs Instant Form pós-correção 07/Mai. Decisão: manter LP, voltar Instant, ou hybrid.
type: project
originSessionId: 0eee011f-e894-468b-8892-5b3852f170af
---
# Bretda — Gate D+7 14/Mai/2026

## Contexto

07/Mai executei Opção A: pausei 4 ads Instant Form (AD09/AD10v1/AD10v2/AD12) + reativei AD03/AD04 LP form. Trade-off esperado: CPL aparente sobe R$11 → R$25-50, volume cai 148→40-80/30d, close rate sobe 3-5x.

Ver: `session_bretda_instant_form_trap_07mai.md`

## O que medir 14/Mai (D+7)

### Métricas Meta (MCP `meta_ads_insights` adset CJ8v2)
- CPL aparente últimos 7d (LP form era) vs 7d anterior (Instant Form era)
- Volume leads 7d
- LPV (landing page views) — deve subir vs ~75/30d pré-correção
- Pixel match rate — deve subir vs 0.7%

### Métricas qualidade (Sales Feedback Spreadsheet — Neil clone)
- Close rate sobre lead (real, não Meta-attributed)
- CAC real (spend / fechamento)
- Tempo médio lead → primeira resposta sales
- Score qualidade subjetivo (1-5) por lead

### Comparação obrigatória
- LP form 7d (07-14/Mai) vs Instant Form 7d (30/Abr-06/Mai)
- MESMA semana de spend (R$120/d × 7 = R$840 cada cohort)

## Decisões possíveis

| Cenário | Métrica chave | Ação |
|---------|---------------|------|
| LP form ganha em close rate >3x | Close LP > 3% vs Instant <1% | Manter LP only, deletar Instant variants, dobrar budget |
| LP form perde em close rate ou empata | Close LP <2x Instant | Voltar Instant Form, otimizar form fields |
| Volume LP insuficiente (<3 leads/7d) | <3 leads | Plano B: criar LP variants das coleções |
| Inconcluso (sample size baixo) | Confidence <80% | Estender gate +7d (21/Mai) |

## Pré-requisitos antes do gate

1. **Sales feedback spreadsheet criado** (Neil clone do conclave) — backfill 30d cruzando lead_id × source × close_status. Sem isso, o gate é cego.
2. **AD05 validado UI Meta** — confirmar se é instant form ou LP form (link_url vazio é ambíguo)
3. **CAPI Caminho B deployed** (já planejado) — pra alimentar pixel/CAPI corretamente da LP

## Triggers ao acordar 14/Mai

- `audit bretda d+7` → executar análise completa
- `gate bretda 14/mai` → mesmo
- `bretda lp vs instant` → focar comparação binária
- Se sales spreadsheet não existir: `cria sales feedback spreadsheet` primeiro

## Risk flags pra monitorar D+1 a D+7

- 🔴 Saldo Meta crítico (memory 03/Mai: R$327 = 2.7d runway pré-conclave) — checar diariamente
- 🔴 AD03/AD04 com 0 entrega 24-48h → pausar AD05 ambíguo + acelerar Plano B variants
- 🟡 Spend redirecionando 100% pra AD03+AD04 mas sem leads → flag pra LP UX issue (form quebrado?)
