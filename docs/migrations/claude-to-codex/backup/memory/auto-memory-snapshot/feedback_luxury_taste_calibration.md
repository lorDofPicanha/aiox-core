---
name: Luxury Taste Calibration — Bretda
description: Squad/Orion entrega "token swap + copy update" mas continua amador visualmente em projeto luxo R$33k. Falha repetida 4× (24/Abr, 30/Abr, agora 30/Abr noite). Brief estrutural não é suficiente — precisa benchmarking obrigatório contra sites luxo REAIS antes de implementação.
type: feedback
originSessionId: 89ef72d8-a25d-4b87-b1bd-9d1d5e777a99
---
# Luxury Taste Calibration — Bretda 2026-04-30

## Regra

Pra qualquer projeto luxury (Bretda, Tocks, futuros): ANTES de squad implementar, **fazer audit visual contra benchmarks luxo reais** (Cassina, Bottega, Aman, Brunello, Aesop, Hermès, Loro Piana, Patek). Squad/agents seguem briefs literalmente — se brief diz "italic champagne em ornaments" eles fazem isso, mas não percebem que **a implementação inteira não tem o "olhar" de luxo** que cada um desses sites tem.

**Why:** User Breno aceita conceitualmente um plano (mockups Claude.ai aprovados, briefs estruturais aprovados), mas quando vê o site renderizado fica irritado porque o resultado parece "startup tentando ser premium" em vez de "Cassina/Brunello digital". Falha 4× consecutivas — não é problema de squad ruim, é problema de **calibração de gosto** ausente no fluxo.

**How to apply:**
1. Antes de despachar implementação, despachar @analyst (com Playwright + WebFetch) pra capturar 5-10 sites luxo REAIS no mesmo nicho/tier do projeto
2. Análise side-by-side: tipografia escala/peso/spacing, paleta exata (não só "cream + champagne"), white space, motion (luxo quase NÃO anima), photography crops, hairline frequency
3. Brief implementação só sai DEPOIS desse benchmark — incluindo medidas exatas: "headline display 56px (não 92px), Cormorant 300 (não 400), letter-spacing -0.01em (não -0.018em), line-height 1.05"
4. Após implementação, audit visual obrigatório: rodar localhost + screenshots + comparar 1-pra-1 com benchmarks. Se gap >threshold, REJECT.

**Não suficiente:** mockups Claude.ai (HTML) servem como wireframe estrutural mas NÃO substituem benchmark real porque Claude.ai gera HTML editorial OK mas sem a calibração específica de cada nicho.

**Casos:** Bretda 24/Abr (sprint 4 fases falhou visualmente), Bretda 30/Abr manhã (13 PRs squad token-swap), Bretda 30/Abr meio-dia (Claude.ai brief), Bretda 30/Abr noite (8 PRs aios-dev — atual). Padrão: cada vez user diz "não" → Orion replaneja → squad implementa cumprindo brief → user diz "não" de novo → repeat.

**Quebra do loop:** mind clone roundtable obrigatório (van-schneider taste, rams less-but-better, spiekermann typography, neumeier brand gap, housel narrative) ANTES de implementar, com benchmarks visuais reais.

## Update 2026-05-04 — Refero integration evaluated + 5 patches applied

Refero.design (`styles.refero.design` MCP open-source) avaliado e adotado como **fonte SECUNDÁRIA** de tokens extraídos. Refero Pro ($96-144/yr) DEFERIDO até primeiro projeto SaaS testar.

**Routing por niche (codificado no Design Squad):**
- **luxury-craft** (Bretda, Tocks, Anipis-luxe, hospitality, fashion houses, haute horlogerie):
  - Method PRIMARY: **Playwright capture própria** + Godly.website (manual browse)
  - Pool benchmark: cassina.com, bottegaveneta.com, aman.com, brunellocucinelli.com, hermes.com, aesop.com, bulgari.com, loropiana.com, audemarspiguet.com
  - Refero NÃO cobre essas brands (catalog bias é SaaS/product). Capturar próprio.
- **saas | wellness | internal | low-ticket | prediction-markets**:
  - Method PRIMARY: Refero MCP (`refero_search`, `refero_design_md`)
  - Fallback: Playwright capture
  - Custo $0 via open-source Styles MCP

**Refero Skill 4-step methodology MANDATÓRIA mesmo sem Pro:**
1. Discovery — niche + archetype + brand position
2. Research — 5+ searches → 50+ raw → narrow to 5-10 deep
3. Steal List — 5+ stealable tactics, cada uma rastreavel (source URL/UUID + tactic + how-to-apply-here)
4. 80/20 Split — 80% proven patterns + 20% brand-unique + anti-AI-slop checklist

**5 patches aplicados (2026-05-04):**
1. `.aios-core/development/agents/ux-design-expert.md` — seção `external-references` com routing por niche + gate Steal_List
2. `.aios-core/development/workflows/design-system-build-quality.yaml` — novo step `phase_0: visual-references-curation` ANTES de build, gate `HALT_IF Steal_List < 5 tactics`
3. Esta memória (update presente)
4. `.aios-core/product/templates/front-end-spec-tmpl.yaml` — campo obrigatório `visual-references` com min 5 items
5. `.aios-core/development/tasks/collect-visual-references.md` — nova task codifica Refero Skill 4-step

**Workflow gate inalterado:** 5+ tactics Steal List traceable to real benchmark ANTES de implementar. Bretda 5ª iteração luxo NÃO sairá como "startup tentando ser premium" porque o gate bloqueia.

Doc canônico: `D:\AIOS\docs\projects\design-squad-rebuild\refero-integration-research.md` (research completo + sourced).
