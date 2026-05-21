---
name: Tocks Pivot Decision — Conclave 30/Abr (NÃO pivote, faça D++)
description: Conclave 5 mind clones rejeitou pivot WhatsApp Engagement → OUTCOME_CONVERSIONS site. Verdict Opção D++ (CAPI server-side via CRM IA + LAL reconstruído). Próximo passo BLOQUEADOR: auditoria @aios-dev se Sales AI tem CAPI cabeado.
type: project
originSessionId: a0acc2a9-03cf-4a25-b1f0-434eaf42c505
---
# Tocks Pivot Decision — 30/Abr/2026

## Pergunta original do user
Vale pivotar Tocks Meta de WhatsApp Engagement (atual) para OUTCOME_CONVERSIONS site?

## Verdict 5/5: NÃO pivote. Resolva signal, não funnel.

### Conclave roster + voto

| Mind Clone | Voto | Razão |
|---|---|---|
| Alex Hormozi (unit econ) | ❌ NÃO B | Máquina já paga — pivotar antes de saturar = trocar dinheiro certo por possibilidade |
| Russell Brunson (funnel) | ❌ NÃO B | Site form quebra intent em high-ticket BR (R$33k não preenche form, conversa) |
| Peep Laja (CRO) | ❌ NÃO B | Measurement não justifica pivot do funnel inteiro |
| Larry Kim (Meta auction) | ❌ NÃO B | OUTCOME_ENGAGEMENT tem CPM 20-40% mais barato BR (vantagem estrutural) |
| Depesh Mandalia (BPM 3rd path) | ✅ Opção **D++** | Resolve signal não funnel — value-based events + LAL 1% reconstruído |

## Recomendação: Opção D++

**Why:** Funnel atual performa demais pra desmontar (CPL R$5,87 today / R$14,11 7d, ROAS provado em ticket R$13k-33k). Problema real é **signal economics** — Meta otimiza por messaging connections (proxy fraco) sem distinguir "conversa morta" de "lead R$33k". CAPI server-side disparando Lead event QUANDO CRM IA marca qualified = signal premium sem mudar funil.

**How to apply:** Path execução em 3 fases:
1. **Fase 1 — Auditoria @aios-dev** (1d, R$0) ⚠️ BLOQUEADOR — Sales AI Tocks tem CAPI integrado hoje? Memory diz Stories 7.1-7.4 DONE (Epic 7 Go Live) mas não confirma CAPI. Pergunta concreta: "Qual endpoint, qual event_name, quando dispara? Se não tem, qual é o gap mínimo?"
2. **Fase 2 — CAPI Lead event qualified** (2-3d dev) — trigger CRM IA marca conversa qualified, payload com `value=<ticket previsto>`, hash phone/email, `event_name=Lead`. Endpoint provável: `/api/meta-capi/qualified-lead` no Sales AI infra.
3. **Fase 3 — Audience reconstruct** (1d) — Custom Audience "Qualified Leads 90d" + LAL **1% (não 2-5%)** — luxury exige cirúrgico. **Duplicar 1 adset por camp em paralelo** (não substituir). Comparar 7d: CPL paralelo vs original.

**Custo total:** R$0 incremental spend, 3-7d dev, R$420-700 risco re-learning phase paralela
**ROI esperado:** 20-40% melhora CPL em 30-60d via audience targeting premium

## Por que NÃO as outras opções

- **A (status quo passivo):** Hormozi+Mandalia provaram teto saturação próximo, signal pobre limita LAL
- **B (pivot total site):** 5/5 rejeitaram — quebra intent + encarece CPM + polui audience high-ticket BR
- **C (híbrido dual-funnel):** Over-engineering hoje. Vira Fase 2 (60-90d) se D++ maduro + teto confirmado

## Bandeiras vermelhas (não-óbvias)

1. **CAPI pode nem estar integrado** apesar Stories DONE — auditoria é blocker de timeline
2. **Volume Lead qualificado pode ser <50/sem** — Meta exige pra sair learning. Começar com definição flexível, apertar depois
3. **Re-learning phase** ao trocar audience — CPL pode piorar 30-50% por 14d. Mitigar com paralelo (não substituição)
4. **User pode interpretar "não pivote" como "não faça nada"** — D++ é AÇÃO concreta. Status quo não é a recomendação
5. **Variância CPL alta** (R$5,87 today vs R$14,11 7d) — decisões grandes sob ruído alto é perigoso. Baseline limpo 7d antes de qualquer A/B
6. **D resolve eficiência, NÃO escala** (Hormozi) — Fase 2 (60-90d) pode considerar C-modificada Brunson (site como pré-ritual WA)

## Estado quando salvou (30/Abr ~22h BRT)

**Tocks Meta state:**
- C005 Monaco baseline today CPL R$8,12 (32,49 spend / 4 conv)
- C006 RTG today CPL R$3,72 (3,72 spend / 1 conv)
- C007 Premium V+E LIVE today CPL **R$3,58** (10,73 spend / 3 conv) — superou Monaco baseline já no D0
- Spend rate combinado R$170/d
- Pixel `1382948639707224` last_fired ontem (29/Abr 20:53) — NÃO usado pelos ads atuais
- Sales AI Stories 7.1-7.4 DONE, dashboard Supabase real
- Routine cloud `trig_01MM93j5GQJsu7oMsAyQnAxp` agendada D+5 (04/Mai 14h BRT) — gera briefing C007 automático

## Próxima ação user
Quando voltar e quiser executar D++:
1. Manda "audita capi tocks" → eu delego @aios-dev
2. Aguardar resultado auditoria pra timeline real Fase 2
3. Decidir se vai full path ou abortar

## Path absoluto do conclave detalhado
`D:\AIOS\docs\projects\bretda-landingpage\prototype\.claude\agent-memory\traffic-masters-chief\conclave_tocks_meta_pivot_30abr.md` (gravado pelo traffic-chief)
