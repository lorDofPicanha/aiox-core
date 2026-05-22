# 05 — Applications Cross-Account (HYDRA-Validated)

**Autor:** Atlas
**Data:** 2026-05-15
**Sujeito:** Aplicações Atlas baseline atualizadas contra evidência HYDRA + squad antecipated synthesis
**Predecessor:** `docs/projects/highticket/study-15mai/04-applications.md`

---

## 1. Bretda — KEEP-CURRENT + CAPI + VALIDATE-CLOSE-RATE (P0 atualizado)

### Atlas baseline action plan
- Não tocar estrutura
- Adicionar CAPI server-side deploy (PR Caminho B pendente)
- Adicionar sales feedback spreadsheet com source attribution
- Escalada segura +30%/sem
- Confidence: HIGH 90%

### HYDRA evidence applied

**E2 + E6 + E7 + E11** (4 evidências independentes) PROMOVE CAPI deploy de "P0 nice-to-have" pra **HARD-BLOCKER**. Não escalar > R$120/d até CAPI live.

**E16** (Tier S 4.6, fresh ingestion 2026-05-15) — NOVA URGÊNCIA: **Google Offline Conversion Imports via Google Ads API se aposenta JUNE 15**:

> "Google is phasing out offline conversion imports through the Google Ads API for some developers starting June 15th."
> "Advertisers and martech providers that rely on offline conversion imports, including enhanced conversions for leads, will need to migrate workflows to the Data Manager API to avoid disruptions."

**Bretda Google Ads usa enhanced conversions for leads** (memory `session_bretda_audit_07mai`). Tem ~30 dias pra migrar. Se não migrar, perde offline conversion attribution Google Ads simultaneamente quando precisa mais.

**E17** (Tier A 4.15, fresh) — Volume vs Effectiveness: "Volume is easier to scale than effectiveness." Bretda 8 ads mix CTA está optimizando pra volume, não effectiveness.

**E14** — Sample window 90d insuficiente, reframe pra 180d.

### Updated action plan

**P0 hard-blockers próximos 14 dias (Atlas vs HYDRA delta):**

| Action | Atlas baseline | HYDRA-updated | Why changed |
|--------|---------------|--------------|-------------|
| CAPI Caminho B deploy | P0 within 7-14d | **P0 D+0-D+7 HARD-BLOCKER** | E2+E6+E7+E11 confirma |
| Sales spreadsheet | P0 within 7d | **P0 D+0 today** | E6 boardroom 4 metrics + Aslam clone consensus |
| Google Data Manager API migration | NÃO mencionado | **P0 D+0-D+14 HARD-BLOCKER** | E16 fresh — June 15 deadline |
| Sample window calculation | 30d (implied) | **180d retroativo** | E14 + Hormozi clone consensus |
| Visual audit 9 ads anti-AI | NÃO mencionado | **P0 D+0-D+7** | E3+E17+Aslam+Kusmich consensus |
| 1P data value exchange (PDF spec book) | NÃO mencionado | **P1 D+7-D+21** | E10+Hormozi+Kusmich consensus |
| Consolidate CJ8v2 ads 8 → 4-5 | NÃO mencionado | **P1 D+14-D+30 (após visual audit)** | E17+E1+Hormozi+Kusmich+Pittman 4/5 consensus |
| D-04 posicionamento categórico | mentioned P1 D+30 | **HARD-BLOCKER D+30-D+60** | E4+E12+E15+Dunford consensus |
| A/B broad targeting test (CJ8v3) | NÃO mencionado | **P1 D+28-D+42 (post CAPI)** | E1+Pittman clone, sequenced Aslam |
| Scaling > R$120/d | Conditional on close rate | **HARD-BLOCKER até CAPI + sales sheet running** | All 5 clones consensus |

### Bretda Updated Confidence

- Diagnóstico estrutural: HIGH 90% → **HIGH 92%** (E9, E11 reforçam)
- Aplicação P0 plan: HIGH 90% → **HIGH 95%** (mais blocos identificados, sequencing clearer)
- CAC qualified: LOW 35% → **LOW 35% + HARD-BLOCKER explícito** (não mudou, mas criticality reconhecida)

### Bretda Recommendation

**Hold posição atual R$90/d até:**
- CAPI Caminho B deployed + 7-day data validation
- Sales feedback spreadsheet running diariamente (Breno owner)
- Google Data Manager API migrado (before June 15)
- Visual audit dos 9 ads concluído

**Então scaling +30%/sem condicional em CAC qualified <R$2.100 (memory `session_highticket_squad_08mai`).**

---

## 2. Tocks — REPLICATE-TEMPLATE com 5 ajustes (P1, atualizado)

### Atlas baseline action plan
- Replicar estrutura Bretda com 4 ajustes
- Excluir interesse "Pool/Billiards"
- 5 SKUs hero re-mapped (sofá / mesa jantar / poltrona / painel / bench)
- Budget total inicial menor (R$40-50/d)
- Form com 2 campos qualifier extras
- Confidence: MEDIUM-HIGH 75%

### HYDRA evidence applied

**E15 (Databricks Industry Imperatives)** ADICIONA layer não previsto: sub-vertical segmentation entry-points distintos:
- Arquiteto residencial alto-padrão (priority: completar projeto cliente HNW 12-week)
- Hospitality boutique/resort (priority: diferenciar instalação vs Marriott-standard)
- Corporate executive (priority: club room legado/memorabilia)

Cada sub-vertical = entry point creative + landing page diferente, mesma capability (Tocks móvel custom luxe artesanal).

**Dunford clone consensus (Q2):** prefere 1 sub-vertical PRIMÁRIO (residencial alto-padrão) primeiro até market presence, depois fragmentar.

**E1 + Pittman:** broad targeting + creative qualifier viável também pra Tocks (com sub-vertical specific creative).

### Updated action plan

**Adjustments vs Atlas baseline (5 não 4):**

| # | Adjustment | Atlas | HYDRA-updated |
|---|-----------|-------|---------------|
| 1 | Excluir "Pool/Billiards" interest | ✓ | ✓ preserved |
| 2 | 5 SKUs hero re-mapped | ✓ | ✓ preserved (Vértice/Elipse + 3 outros — memory `session_tocks_master_assets_06mai`) |
| 3 | Budget R$40-50/d initial | ✓ | ✓ preserved |
| 4 | Form 2 campos qualifier extras | ✓ | refined: "Tipo projeto" + "Etapa" + "Profissional/End-buyer" (3 campos) |
| 5 | (NEW) Industry Imperative entry point | — | START em "residencial alto-padrão" sub-vertical only. Hospitality + corporate added Q4 2026 |

**Tocks Updated P0 blockers (validation antes de launch):**

- ⏳ PIX Tocks confirmation (memory `session_tocks_hydra_actions_12mai`)
- ⏳ CAPI Tocks (PR #645 reabrir — branch `feat/tocks-capi-d-plus-plus` existe)
- ⏳ Site validation (memory `session_tocks_verify_01mai`)
- ⏳ Google Data Manager API migration (June 15 deadline applies)

**Tocks NEW P1 quick wins (do Bretda study insights):**

- 1P data value exchange: Tocks tem **Sample Book físico em planejamento** (memory `wave05_competitive_intel_07may` cita "Source Book físico"). Aplicar como pós-Instant-Form digital asset.
- Hero ad com Value Equation (Hormozi clone consensus Q4) ao invés de SKU-only mix
- Industry Imperative single-vertical foco residencial alto-padrão (Dunford clone Q2)

### Tocks Updated Confidence

- Diagnóstico: MEDIUM-HIGH 75% → **HIGH 82%** (industry imperative adicionou framework, sub-vertical sequencing clearer)
- Replicabilidade Bretda → Tocks: HIGH (preserved)

---

## 3. KR — REPLICATE-TEMPLATE com 2 ajustes (P2, atualizado pós-WhatsApp Void)

### Atlas baseline action plan
- Replicar com 1 ajuste (audience secundária interesse direto Interior Design)
- Geo restrito à capacidade real
- P0 bloqueador: WhatsApp Void resolvido
- Confidence: MEDIUM-HIGH 75%

### HYDRA evidence applied

**E1 + Pittman clone consensus** sugere broad targeting + creative qualifier pra KR seria especialmente bom — interiores serviço residencial não é tão profissional-targeted quanto Bretda. End-buyer mais direto.

**E10 + Hormozi clone:** 1P data value exchange pra KR pode ser "Lookbook 12 interiores residenciais 2025-2026" + "RSVP visita projeto andamento KR".

### Updated action plan

**Adjustments vs Atlas baseline (2 não 1):**

| # | Adjustment | Atlas | HYDRA-updated |
|---|-----------|-------|---------------|
| 1 | Audience secundária interesse direto | ✓ | ✓ preserved (Interior Design, Home Decor, Casa Vogue) |
| 2 | (NEW) Lookbook PDF + RSVP pós-Instant-Form | — | E10 + Hormozi clone consensus apply |

**KR P0 unchanged blockers:**
- ⏳ WhatsApp Void resolved (memory `reminder_kr_kell_pending_12mai`)
- ⏳ Kell screenshot + CSV
- ⏳ Reconectar WABA correta +55 61 99872-0330
- ⏳ Smoke test pós-fix

Sem esses P0, ativos paid ficam PAUSED.

### KR Updated Confidence

- Diagnóstico: MEDIUM-HIGH 75% → **HIGH 80%** (E1+Pittman validates broader audience approach KR)
- Replicabilidade: HIGH preserved (preserved)

---

## 4. Vorza — NÃO REPLICAR (preserved)

### Atlas baseline
- Low-ticket fundamentalmente diferente
- iOS-only + interest profissional destroem economics low-ticket
- Manter pivot email
- Confidence: HIGH (não replicar)

### HYDRA evidence applied

Sem contradição. Memory `session_vorza_email_pivot_05mai` + `vorza_email_pivot_benchmark_05may` confirmam Cenário B email nurture + meta LEAD R$20/d.

### Vorza Recommendation
**Mantém Atlas baseline integralmente — não replicar high-ticket Bretda em low-ticket.**

---

## 5. Synkra Info-Produto — ADIAR / NÃO replicar Bretda (refined)

### Atlas baseline
- Brunson Value Ladder + VSL/Webinar, NÃO Bretda B2B2C físico
- Decisão estratégica D-01 (squad-08mai) pendente
- Recomendação Orion: NÃO ou ADIAR
- Confidence: LOW (não replicar Bretda template)

### HYDRA evidence applied

**E12 (Lemkin stop discounting start deploying)** aplicável: pra info-produto Synkra equivalent é "**deploy AIOS framework live em 1 sessão grátis**" antes de cobrar. Não é Bretda template, mas paradigma deployment-over-discount funciona.

**E15 (Databricks Industry Imperatives)** aplicável: AIOS framework universal, entry point diferente por sub-vertical (dev / qa / product / ux).

Mas tela cheia, **Atlas baseline (NÃO replicar Bretda) preserved**. Synkra precisa estratégia info-produto própria — Brunson Value Ladder, VSL/Webinar baseline + Lemkin deployment + Databricks Industry Imperatives mas não Bretda Instant Form structure.

### Synkra Recommendation
**Decisão D-01 (squad-08mai) ainda pendente.** Recomendação Atlas baseline preserved: NÃO replicar Bretda. Decision requires separate study não-este.

---

## 6. NEW — Site-Prospector (não estava em Atlas baseline)

### Mention contextual

Memory `session_site_prospector_legal_15mai` shows project active no Stage 1 com pilot manual 3 prospects 4 semanas até 2026-06-09. Não é Bretda template aplicável — site-prospector é **agência services**, não high-ticket B2B2C físico-luxury.

### Recommendation
**Site-Prospector segue própria methodology (pilot manual + hard review 09/Jun).** Pode usar Hormozi clone Value Equation framework E1 ("Stop Discounting Start Deploying" = "deploy site live em 1 hora antes cobrar") ao invés de Bretda template.

---

## Cross-Account Summary Matrix Updated

| Conta | Status | Atlas Conf | HYDRA Conf | Top P0 ações |
|-------|--------|-----------|-----------|--------------|
| Bretda | KEEP+ENHANCE | HIGH 90% | **HIGH 92%** | CAPI deploy / Sales sheet / Google API migration |
| Tocks | REPLICATE com 5 ajustes | MED-HI 75% | **HIGH 82%** | PIX confirmed / CAPI reabrir / sub-vertical residencial focus |
| KR | REPLICATE com 2 ajustes | MED-HI 75% | **HIGH 80%** | WhatsApp Void resolved / Lookbook PDF |
| Vorza | NÃO REPLICAR | HIGH (não) | **HIGH 95% (não)** | Email pivot mantém |
| Synkra | NÃO REPLICAR Bretda | LOW (não) | **LOW (não) + D-01 pending** | Decision squad-08mai |
| Site-Prospector | OWN methodology | n/a | **n/a — Stage 1 pilot 09/Jun** | Pilot ongoing |

---

## Sequencing Master Plan (16-week)

### Weeks 1-2 (D+0-D+14)
- Bretda CAPI Caminho B deploy
- Bretda sales spreadsheet (Breno owner, daily)
- Bretda Google Data Manager API migration (before June 15)
- Bretda visual audit 9 ads anti-AI categorization

### Weeks 3-4 (D+14-D+28)
- Bretda 1P data value exchange (PDF spec book) deploy
- Bretda consolidate CJ8v2 8 → 4-5 ads (post-audit)
- Tocks PIX confirmation + CAPI reabrir (parallel)
- KR WhatsApp Void resolved + Lookbook PDF design

### Weeks 5-8 (D+28-D+56)
- Bretda A/B broad targeting test CJ8v3 vs CJ8v2 (Pittman clone Q1, R$420 risk)
- Bretda sales window 180d retroativo CAC calculation
- Tocks Stage 1 launch (residencial alto-padrão focus only)
- KR restart paid Meta + Google

### Weeks 9-12 (D+56-D+84)
- Bretda decision point: close rate qualified validates scaling +30%/sem OR refine
- Bretda D-04 categoria study deep-dive (Dunford clone consensus Q4)
- Tocks Q2 validation: hospitality+corporate sub-verticals?
- KR scale OR refine

### Weeks 13-16 (D+84-D+112)
- Bretda Q3 review: scaling sustained OR plateau
- Tocks scale plan
- Vorza email pivot review
- Synkra D-01 decision time-box

---

*— Atlas, applications grounded*
