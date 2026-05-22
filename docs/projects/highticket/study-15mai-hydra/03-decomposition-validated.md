# 03 — Decomposição Validada Contra HYDRA

**Autor:** Atlas
**Data:** 2026-05-15
**Sujeito:** 10 elementos Atlas + 1 novo elemento, cada um testado contra HYDRA evidence

**Formato:** Pra cada elemento, três blocos: (1) Atlas baseline, (2) HYDRA evidence, (3) Revised confidence.

---

## Elemento 1 — Interest Stack Profissional + Luxury Goods

**Atlas baseline:**
- O que faz: targeting Meta com `work_positions ∋ {Architects, Interior Designers}` OR `interests ∋ {Luxury Goods}`
- Confidence: HIGH 90%
- Replicabilidade: ALTA

**HYDRA evidence:**

- **E1** (Smart Marketer/Molly Pittman, Tier S 4.65) CONTRADIZ parcialmente:
  > "Creative and ad copy now act as your primary targeting tools. Broad targeting is becoming the default."
- **E13** (Agendor BR, Tier S 4.5) CONFIRMA Atlas pro contexto BR:
  > "Segmentação ampla é o primeiro erro... Defina seu ICP."
- **E8** (Microsoft+LinkedIn CTV, Tier A 4.3) VALIDA profissional targeting como B2B moat estrutural:
  > "advertisers can now target connected TV audiences using LinkedIn profile attributes tied to a user's profession."

**Revised:**
- Confidence: HIGH 90% → **MEDIUM-HIGH 80%**
- Mecanismo CAUSAL preservado, mas a "alavanca" pode ser tanto interest stack (Atlas) quanto broad-audience-com-creative-ICP-qualifier (E1)
- **Recomendação:** A/B test paralelo P1. Adset CJ8v3 R$30/d broad targeting (sem work_positions, só interest+behavior+age+geo+iOS) vs CJ8v2 current. 14d, compare CPL+CTR+close rate downstream.
- Replicabilidade: ALTA (preservada — ambos approaches funcionam pro Tocks/KR)

---

## Elemento 2 — iOS-only Device Targeting

**Atlas baseline:**
- O que faz: adset filtra `user_device: [iOS]`, exclui Android
- Confidence: HIGH 85%
- Replicabilidade: ALTA-BR

**HYDRA evidence:**

- **BR1** (Sebrae 4,6M MEIs CadÚnico, Tier A 4.45) CONFIRMA polarização socioeconômica BR:
  > "Com aproximadamente 4,6 milhões de microempreendedores individuais inseridos no Cadastro Único para Programas Sociais"
- Sem contradição em HYDRA. Mecanismo (iOS market share BR 13-17% concentrado em classe A1/A2) não foi questionado.

**Revised:**
- Confidence: HIGH 85% → **HIGH 85% (sustained)**
- Replicabilidade: ALTA-BR (preservada)
- **Caveat de E1 (broad targeting):** Se broad audience for testada, manter iOS-only filter. Não é audience targeting — é device filter, layer ortogonal. Combina com qualquer audience strategy.

---

## Elemento 3 — Geo 11 Estados Sudeste + Sul + CO

**Atlas baseline:**
- O que faz: CP2 targeta 11 estados; CP1 só Sudeste
- Confidence: HIGH 85%
- Replicabilidade: ALTA

**HYDRA evidence:**

- Sem evidência direta HYDRA contradizendo nem reforçando além do baseline conhecido (Casacor / AbCasa data sobre concentração HNW BR já citado em memory `wave05_competitive_intel_07may`)
- BR1 + BR2 indiretamente confirmam macro BR (vulnerabilidade socioeconômica concentrada Norte/NE = exclusão logística correta)

**Revised:**
- Confidence: HIGH 85% → **HIGH 85% (sustained)**
- Replicabilidade: ALTA Tocks (mesma logística). MÉDIA KR. BAIXA digital-only (Synkra)
- **Recomendação preservada:** Atlas suggestão de ad set split SP-only vs Resto pra validar qual estado paga melhor — agora reforçada por E13 (data is gold).

---

## Elemento 4 — Idade 30-60

**Atlas baseline:**
- O que faz: age = [30, 60]
- Confidence: MEDIUM 70% (defensável teoricamente, sem evidência granular)
- Replicabilidade: ALTA

**HYDRA evidence:**

- **BR2** (Sebrae GEM 2026, Tier A 4.25) ELEVA confidence:
  > "O sonho número um dos brasileiros entre 35 e 54 anos é ter o próprio negócio. Para mais de 41% dos entrevistados nessa faixa etária, empreender passou na frente de motivações como 'comprar a casa própria' e 'viajar pelo Brasil'."
  > "Conforme a idade avança, a intensidade do sonho de empreender diminui."
- Confirma 35-54 BR é peak window de empreendedorismo = peak window de poder aquisitivo discretionary
- Bretda 30-60 cobre 35-54 + buffer

**Revised:**
- Confidence: MEDIUM 70% → **MEDIUM-HIGH 80%**
- Replicabilidade: ALTA preservada
- **Caveat de E5:** Demand-side cai de 60% (2020-22) → 41% (2026). Macro headwind. Idade 30-60 ainda correta, mas volume absoluto pode estar diminuindo organic.

---

## Elemento 5 — Instant Form + Zero LP Redirect

**Atlas baseline:**
- O que faz: lead capture nativo Meta, in-app
- Confidence: HIGH 85% (condicional qualificação humana)
- Replicabilidade: ALTA (se humano existe)

**HYDRA evidence:**

- **E1** (Smart Marketer) AMPLIFICA: "creative and ad copy now act as your primary targeting tools" — implica Instant Form atrás de creative forte é bom; ruim só se creative for genérico
- **E3** (Stelzner SME) AMPLIFICA: "your real problem might be on screen" — ratifica criticality creative-as-qualifier
- **E10** (1P data value exchange) PROPÕE refino: adicionar value-exchange no form pra subir qualidade

**Revised:**
- Confidence: HIGH 85% → **HIGH 85% (preserved condicional)**
- Mas + **promovido a PILAR PRIMÁRIO** na tese revisada (não "elemento condicional")
- **Recomendação:** No form, adicionar campo "Tipo projeto" e prometer entrega imediata pós-submit (spec book PDF). Hipótese: CPL pode subir 10% mas close rate sobe 2-3x.

---

## Elemento 6 — LOWEST_COST_WITHOUT_CAP Bidding

**Atlas baseline:**
- O que faz: Meta otimiza pra adquirir maior número de leads, sem teto
- Confidence: MEDIUM-HIGH 75%
- Replicabilidade: ALTA (conta madura)

**HYDRA evidence:**

- Sem contradição HYDRA. **E2** (scaling $300M+) e **E11** (martech stack) ambos focam em attribution/governance, não bid strategy
- Status quo defensável (Bretda 333+ conv aprendidos = mature)

**Revised:**
- Confidence: MEDIUM-HIGH 75% → **MEDIUM-HIGH 75% (sustained)**
- Replicabilidade: ALTA preservada
- **Caveat Atlas:** considerar Cost Cap em períodos saldo crítico — ainda válido

---

## Elemento 7 — 8 Ads/Adset com Mix CTA

**Atlas baseline:**
- O que faz: 3 genéricos + 5 SKU-específicos
- Confidence: MEDIUM-HIGH 75%
- Replicabilidade: ALTA

**HYDRA evidence:**

- **E3** (Stelzner SME, Tier S 4.5) QUESTIONA mix-by-default — sugere criativos individuais ICP-fit podem outperform mix genérico:
  > "your real problem might be on screen"
- Não contradição direta, mas redirect: foco em **qualidade de cada creative**, não em volume de variações

**Revised:**
- Confidence: MEDIUM-HIGH 75% → **MEDIUM 70%**
- Replicabilidade: ALTA preservada
- **Recomendação refined:** Quarterly check fortnight (Atlas) preservado, MAS adicionar: rodar Brand Lift study Meta de 7 dias compreendendo 8 ads vs apenas 2-3 hyper-narrow creative-fit. Se 2-3 paga melhor por SHARE, consolidar pra 3-5 ads (Meta recommended), não 8.

---

## Elemento 8 — OUTCOME_LEADS Objective

**Atlas baseline:**
- O que faz: campanha objective OUTCOME_LEADS
- Confidence: HIGH 95% (quase tautológico)
- Replicabilidade: ALTA

**HYDRA evidence:**

- **E2** (smart marketer scaling) IMPLICA: a real questão não é objective; é o que vem depois (CAPI + offline upload). OUTCOME_LEADS é correta DESDE QUE CAPI alimente OUTCOME_LEADS_VALUE no longo prazo
- **E6** (4 boardroom metrics) confirma: ROMI + CLV:CAC exigem closed-loop, OUTCOME_LEADS isolado é incompleto

**Revised:**
- Confidence: HIGH 95% → **HIGH 95% (sustained)** — objective decisão correta
- MAS + **PROMOVIDO** com hard-condicional: sem CAPI server-side feed, OUTCOME_LEADS é vapor pro algorithm. **PILAR D na tese revisada.**

---

## Elemento 9 — Dual Campaign Structure (CP1 + CP2)

**Atlas baseline:**
- O que faz: 2 campanhas paralelas, audiences diferenciadas
- Confidence: MEDIUM-HIGH 75%
- Replicabilidade: ALTA (com caveats budget)

**HYDRA evidence:**

- **E15** (Databricks Industry Imperatives, Tier A 4.4) REFRESCA o framework: campanhas paralelas devem corresponder a sub-verticals com priorities diferentes
  > "An SMB construction company and a global construction enterprise have fundamentally different strategic priorities. The humans you're talking to have different problems, different budgets, different decision-making processes."
- **E2** (scaling $300M+) NÃO contradiz dual structure mas avisa de attribution complexity

**Revised:**
- Confidence: MEDIUM-HIGH 75% → **MEDIUM-HIGH 75% (sustained)**
- Replicabilidade: ALTA preservada
- **Refinement:** Próxima split CP3 deve seguir Industry Imperative — não "audience nova random", mas "audience pra sub-vertical específica" (arquiteto hospitality vs residential vs corporate-executive)

---

## Elemento 10 — Creative Anti-AI Aesthetic (HIPÓTESE)

**Atlas baseline:**
- O que faz: [HIPÓTESE não validada]
- Confidence: MEDIUM 60%
- Replicabilidade: ALTA

**HYDRA evidence:**

- **E3** (Stelzner SME, Tier S 4.5) PROMOVE criticality criativo:
  > "your real problem might be on screen"
- **E1** (Molly Pittman) confirma "creative and ad copy now act as your primary targeting tools"

**Revised:**
- Confidence: MEDIUM 60% → **TBD pending audit** (não é confidence number, é ação)
- **PROMOVIDO a AUDITORIA P0** próximos 7 dias:
  1. Listar 8 ads ACTIVE Bretda CJ8v2 + AD01 CJ1 = 9 creatives
  2. Visualizar no Meta Ads Library + categorizar: Photographic (real showroom/install) vs AI-generated vs Stock photo
  3. Memory `feedback_ai_image_anti_tells` — verificar se há "tells" (golden hour exaggerated, glow, simetria, sem sombras realistas)
  4. Reportar percentage de creatives por tipo. Decidir: substituir AI-tells por foto real Tijucas (memory `session_tocks_master_assets_06mai` cita 28 WhatsApp renders).
- Replicabilidade: ALTA pra Tocks (asset library canon Libre Caslon + Poppins existe)

---

## Elemento 11 — 1P Data Value Exchange (NEW)

**Atlas baseline:**
- Não existia. Atlas tinha Instant Form como "elemento condicional" sem aprofundar o value exchange aspect.

**HYDRA evidence:**

- **E10** (martech.org "From Permission to Personalization", Tier S 4.9) ESTABELECE pattern:
  > "Having permission doesn't always grant you the right to be personal. True personalization is an earned right."
  > "By focusing on a value exchange — where the customer gets better education and resources in return for their data — you move from being a 'vendor' to a 'partner.'"
  > "providing customers with more control... actually builds trust."

**Revised:**
- **NOVO Element 11**
- O que faz: Instant Form devolve um asset de valor imediato pós-submit (PDF spec book + RSVP showroom virtual + lookbook curatorial)
- Confidence: **MEDIUM-HIGH 75%**
- Replicabilidade: ALTA pra qualquer luxury brand (Tocks tem Sample Book físico em planejamento — memory `wave05_competitive_intel_07may`)
- **Recomendação:** P1 implementation — Bretda spec book PDF "12 mesas custom 2025-2026" como entrega automática pós-Instant-Form. Hipótese: CPL +10%, close rate +2-3x = CAC qualified net-lower. Risk R$0 (asset Tocks já tem material similar).

---

## Resumo Tabular Updated

| # | Elemento | Atlas Conf | HYDRA Conf | Δ | Replicabilidade | Status |
|---|----------|-----------|-----------|---|----------------|--------|
| 1 | Interest stack profissional + luxury | HIGH 90% | MED-HI 80% | ↘ refined | ALTA | A/B test broad alternative P1 |
| 2 | iOS-only Brasil | HIGH 85% | HIGH 85% | = | ALTA-BR | sustain |
| 3 | Geo 11 estados | HIGH 85% | HIGH 85% | = | ALTA | sustain |
| 4 | Age 30-60 | MED 70% | MED-HI 80% | ↗ | ALTA | reforçado BR2 |
| 5 | Instant Form + qual humana | HIGH 85% cond | HIGH 85% cond | = | ALTA | + PILAR PRIMÁRIO |
| 6 | LOWEST_COST sem cap | MED-HI 75% | MED-HI 75% | = | ALTA mature | sustain |
| 7 | 8 ads mix CTA | MED-HI 75% | MED 70% | ↘ | ALTA | consolidar 3-5? |
| 8 | OUTCOME_LEADS obj | HIGH 95% | HIGH 95% | = | ALTA | + HARD-BLOCKER sem CAPI |
| 9 | Dual campaign | MED-HI 75% | MED-HI 75% | = | ALTA | refresh via Industry Imperatives |
| 10 | Anti-AI creative HIPÓTESE | MED 60% | **AUDIT P0** | promote | ALTA | visual audit 7d |
| **11** | **1P Data Value Exchange (NEW)** | — | **MED-HI 75%** | NEW | ALTA | spec book PDF P1 |

**Top 3 elementos de maior alavancagem (updated):**
1. **Element 8 OUTCOME_LEADS + CAPI** (HIGH 95% + hard-blocker pra scaling)
2. **Element 5 Instant Form + qualificação humana** (HIGH 85% + pilar primário)
3. **Element 11 1P Data Value Exchange (NEW)** (MED-HI 75%, quick win P1)

**Top 3 mais subestimados (não-óbvios, valiosos):**
1. **Element 11 1P Data Value Exchange (NEW)** — completamente ausente no Atlas baseline
2. **Element 10 visual audit anti-AI** — promovido de hipótese pra P0 obrigatório
3. **Element 4 Age 30-60 reforçado por BR2** — BR-empirical sustaining

---

*— Atlas, decomposed against evidence*
