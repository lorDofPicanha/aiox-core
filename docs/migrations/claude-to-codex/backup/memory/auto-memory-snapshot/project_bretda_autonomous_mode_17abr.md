---
name: Bretda Autonomous Mode 17/Abr
description: Usuario viajou 17/Abr 22h30 — Orion autoriza execucao Meta-only sem input humano, decisoes pendentes tomadas com defaults responsaveis, kill switches automaticos
type: project
originSessionId: f22f701a-7d0b-4665-8fab-9002dd86602e
---
# Bretda Meta-Only — Autonomous Mode (17/Abr → 24/Abr)

## Contexto
User disse "rode tudo sem precisar de mim, estou indo viajar" em 17/Abr 22h30 BRT. Orion assumiu as 5 decisoes pendentes do plano Meta-only com defaults responsaveis. Google congelado (R$70/dia sem novas acoes ate retorno).

## 5 Decisoes assumidas (defaults autorizados)

### D1 — CAPI path: HYBRID backend-first + Zapier fallback
- **Plano:** @dev bretda-lp implementa rota `/api/meta-conversion` via Vercel Functions (Next.js 16). Envia Lead + A-Lead + WA_click direto pra Meta Conversions API via `fb-server-events`.
- **Fallback se dev demorar >48h:** Zapier Free (webhook form → Meta CAPI), max 100 tasks/mes = cobre prospecting inicial.
- **Access token Meta:** reusar do BM Bretda (system user, sem expiry).

### D2 — Criativos v7 priorizados: `aurora-01 + citrino-02 + opal-01`
- Aprovado conforme Chief recomendou. Alto contraste, 1080x1350 prontos.
- Upload como AD06/07/08 em CJ7v2 e CJ8v2 via @ralph-burns.

### D3 — A-Lead scoring: thresholds Neil Patel
```
A-Lead = (scroll >=75% AND time_on_page >=90s) OR click_configurador_3d OR (form_completion AND tempo_preenchimento <90s)
```
- Enviar como Custom Event `meta_a_lead` via CAPI, peso 3x no algoritmo.

### D4 — Research JTBD: formato ASSINCRONO enquanto user viaja
- @analyst prepara roteiro 5 perguntas killer + form longo typed.
- Envia link para 5 targets (2 clientes, 2 leads perdidos 90d, 1 aspiracional) via WA quando user retornar.
- Entrevistas ao vivo ficam para D+8+ (apos retorno).
- Substituto assincrono: form estruturado com video de 90s para engajamento.

### D5 — MCP recorrente autorizado DENTRO DE GUARDRAILS
**Chief pode executar mudancas em Meta Ads automaticamente desde que:**
- Nao ultrapassar +50% do budget atual por campanha sem gate
- Nao criar campanha nova sem plano pre-aprovado
- Pausar adset/campanha e OK se CPL disparar (kill switch)
- Qualquer mudanca estrutural >R$100/dia requer log em agent-memory

**Kill switches automaticos (Chief executa):**
- CPL blended >R$30 por 48h → pausa expansoes
- A-lead ratio <10% em D+5 → nao unpause LAL
- RTG-WARM freq >4.0 E CPL >R$25 em D+2 → pausa
- Creative v7 CTR <0.8% em 48h → reverte AD05+AD04

## Execucoes autorizadas em andamento

### D+0 (17/Abr noite) — STATUS
- Chief: plano entregue (agent ID a0de8933b800ad899)
- @aios-dev: rodando em background (agent ID a48384f384151db12) — CAPI route + lead scoring + A/B LP preco em branch `feat/meta-only-auto-17abr`
- @aios-analyst: **CONCLUIDO** 5 artefatos em `D:\AIOS\.claude\agent-memory\aios-analyst\bretda_jtbd_*.md`:
  1. `bretda_jtbd_form_roteiro.md` — 12-15 perguntas, 3 flows (Cliente/Lead perdido/Aspiracional)
  2. `bretda_jtbd_outreach_templates.md` — WA/email/DM + follow-up 72h + respostas prontas
  3. `bretda_jtbd_recruitment_list.md` — schema 5+3 targets, fontes CRM/WA/Forms/Meta
  4. `bretda_jtbd_findings_TEMPLATE.md` — analise pos-coleta Christensen + Go/Hold/Kill
  5. `bretda_jtbd_activation_plan.md` — cronograma D+1 a D+14 com kill switches
- @ralph-burns: aguardando Chief handoff para upload AD06/07/08

### D+1 (18/Abr)
- Upload criativos v7 — @ralph-burns
- CAPI workaround implementation — @dev
- Briefing final research sprint — @analyst

### D+2 (19/Abr) — Gate automatico
- Checar freq+CPL RTG-WARM e decidir escala por matriz Neil
- Unpause LAL com 3 criativos (AD05+AD04+v7) se criterios OK
- Agendado via cron/schedule

### D+3 (20/Abr 19h) — Revisao 72h
- Midweek review RTG-WARM + criativos v7
- Agendado via cron/schedule

### D+5 (22/Abr)
- A-lead ratio check — se <10%, nao unpause LAL
- Creative CTR review

### D+7 (24/Abr) — Gate consolidado Meta-only
- Criterios Go/Hold/Kill avaliados
- Relatorio completo gerado

## Paths
- Plano canonical: `D:\AIOS\.claude\agent-memory\traffic-masters-chief\project_bretda_meta_only_plan_17abr.md`
- Insights bridge: `D:\jarvis\bridge-data\aios-insights\bretda-meta-only-17abr2026.json`
- Chief agent ID para continuar: **a0de8933b800ad899**

## Proxima acao user (apos retorno)
1. Revisar logs execucao em `.claude/agent-memory/traffic-masters-chief/`
2. Confirmar gates D+2/D+3/D+5/D+7 (executados sem voce)
3. Aprovar ou nao Research Sprint ao vivo (assincrono ja coletado)
4. Decidir proximo passo com base no gate 24/Abr
