---
name: Vorza Meta→Email Pivot 05/Mai
description: User pediu pause Meta + email marketing 05/Mai noite. Autopilot total disparado. Meta camp PAUSED. 3 squads em background (copy-chief, analyst, aios-dev) construindo estratégia + economics + tech. Resultados em docs/projects/low-ticket-10k/email-marketing-pivot/.
type: project
originSessionId: 09b2e57c-7c0a-4b78-b991-87164fbc7336
---
**Data:** 2026-05-05 (noite, user dormindo durante autopilot)
**Trigger user:** "desativa o meta ads do vorza e utilize outra estratégia, a de email marketing" → "faça como meus especialistas acham melhor e rode até o final, vou dormir"

## Estado pré-autopilot
- Vorza Meta Ads: 1 camp ACTIVE `6986644457499` "[ABO] M3C — TOPO Frio v2"
- 7d perf: spend R$233 / 0 purchases / 1 IC / 24 LPV / CTR 5.11% / CPC R$2.51
- 4 LPs (advogados/MEI/professores/obrigado) — **ZERO email capture forms**
- Pixel híbrido LGPD + Pixel Kiwify atracado
- Kiwify customers count: desconhecido, baixo (0 purchases 7d)

## Ações Orion (sem squad)
1. ✅ Pause campanha `6986644457499` via MCP (PAUSED 05/Mai noite)
2. ✅ Update CONTEXT.md Vorza com novo estado pivot
3. ✅ Commit local `1e9ebb9f` chore(vorza)
4. ✅ 3 squads disparados em background:
   - **copy-chief** (a854ab37eb67fdeb8) — strategy + 7+ emails + sequence + offer adaptation
   - **aios-analyst** (adc11f5e959aab9ee) — economics 3 cenários + benchmark BR + risk
   - **aios-dev** (a834b839274fd7b8e) — tech architecture + Resend setup + Kiwify webhook + DB schema + runbook

## Defaults Orion (squads podem contestar)
- Tool: **Resend** (dev-friendly, $0-20/mo, Vercel-native)
- Lista: **híbrido** Kiwify customers + Meta paralelo R$20/d otimizado pra LEAD
- Oferta: manter R$10-30 + bump R$17 + upsell SCV-3 R$147 (decisões anteriores)
- Timeline: avaliar 14d, Meta paralelo NÃO total OFF

## Deliverables esperados
Em `D:\AIOS\docs\projects\low-ticket-10k\email-marketing-pivot\`:
- 00-strategy.md (copy-chief)
- 01-lead-magnet.md (copy-chief)
- 02-email-sequence.md (copy-chief — 7+ emails completos)
- 03-offer-adaptation.md (copy-chief)
- 04-meta-parallel.md (copy-chief)
- 05-tools-stack.md (copy-chief)
- 06-success-metrics.md (copy-chief)
- 07-implementation-checklist.md (copy-chief)
- 08-market-benchmark.md (analyst)
- 09-economics-model.md (analyst)
- 10-risk-analysis.md (analyst)
- 11-tech-architecture.md (aios-dev)
- 12-lp-form-implementation.md (aios-dev)
- 13-resend-setup.md (aios-dev)
- 14-kiwify-integration.md (aios-dev)
- 15-database-schema.md (aios-dev)
- 16-runbook-deploy.md (aios-dev)

## ✅ AUTOPILOT COMPLETO (madrugada 06/Mai)
1. ✅ 3 squads entregaram 17 arquivos (~245KB)
2. ✅ README master criado em `email-marketing-pivot/README.md`
3. ✅ CONTEXT.md Vorza atualizado com novo estado + 4 opções triagem
4. ✅ Commit `dd311c90 feat(vorza): email marketing pivot strategy autopilot 05/Mai`
5. ⏭️ User triagem manhã: opções A/B/C/D documentadas

## ⚠️ CONCLAVE DISSIDENTE — descoberta crítica
3 de 5 mind clones (Hormozi+Brunson+Godin) DISCORDARAM do pivot direto:
- "Email não salva oferta perdedora — só amplifica oferta vencedora"
- 7d Meta com 0 purchases + LP view rate 71% pós-redesign sugere problema = OFERTA, não canal
- Recomendação: 5 entrevistas com não-compradores (R$10 gift card retargeting) ANTES de 23h em infra
- Documentado em 00-strategy.md §7

## Realismo financeiro (analyst)
- Cenário B (Meta R$20/d LEAD + Email Nurture) = único com breakeven 90d (dia 24-28)
- Cenário A (100% email lista zero): revenue 90d = R$0,18 — DESCARTAR
- Mês 1-3: ROAS 0.22-0.64× — email é ATIVO, não funil que se paga
- Cenário C endgame quando customers Kiwify ≥100 (mês 4-5)

## Tool decision
- **Resend** confirmado por aios-dev (free tier 3k/mo → $20-45/mo escala)
- **Supabase** RLS LGPD desde dia 0
- **Domain:** `mail.vorza.com.br` subdomain isolation
- **Warm-up:** 4 semanas obrigatório

## 4 Opções Triagem (user manhã)
- **A** Validar oferta (5 entrevistas) — recomendação 3/5 conclave
- **B** Email + Meta paralelo — recomendação analyst, default Orion, breakeven 90d
- **C** Híbrido sequencial — entrevistas → email se canal-problem confirmado
- **D** Pivot oferta — refazer R$27 + bump + value stack 5 itens

Default Orion se silêncio: **Opção C** (rigor + momentum equilibrados)

## Triggers
- `vai com opção A vorza`
- `vai com opção B vorza`
- `vai com opção C vorza`
- `vai com opção D vorza`
- `status vorza email` (resumo)

## Riscos identificados pre-execução
- Vorza tem ZERO emails — não é "use existing list", é "build list from scratch"
- Sem Meta = sem aquisição. Meta paralelo R$20/d default mantém pipeline
- Low-ticket R$10-30 não suporta tools caras (Mailchimp R$200+/mo) — Resend $0-20/mo certo
- LGPD: precisa double opt-in + consent text correto
- Domain verification (deliverability): user tem vorza.com.br? Senão usa subdomain Netlify (ruim pra deliverability)
