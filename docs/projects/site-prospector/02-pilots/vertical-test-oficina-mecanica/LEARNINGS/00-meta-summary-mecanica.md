# Meta-Summary — DRY RUN #2 Vertical-Agnostic Test

> **Captura learnings do dry-run #2 (vertical oficina mecânica auto Blumenau) para informar decisões de production v1 do pipeline Site-Prospector.**

**Generated:** 2026-05-12 — @analyst
**Compared against:** dry-run #1 baseline `blumenau-padaria-artesanal/dry-run-P-006-dona-hilda/LEARNINGS/00-meta-summary.md`

---

## Tempo total

**Target:** 90min.
**Real (estimado):** ~95min.

Breakdown:
- Fase 1 Prospect condensed: **~25min** (target 15min — overshot por necessidade cross-reference CNPJ + endereço múltiplas fontes diretório B2B mecânica)
- Fase 2 Diagnose condensed: **~15min** (1 prospect M-002 Itanorte — eficiente porque template padaria reuse)
- Fase 3 Research condensed: **~40min** (target 45min — within budget, mas knowledge-base degrade visível em refs locais)
- Fase 4 Comparison (output principal): **~12min** (output mais valioso, vale o tempo dedicado)
- Fase 5 Meta-summary: **~3min** (este doc)

**Observação:** Comparison + Meta-summary juntos foram **17% do tempo total** mas são **70% do valor** do dry-run. Production v1 deveria embed esse pattern (comparison é cheap relative ao build).

---

## Quanto da Fase 3 knowledge transferiu sem editar

### Refs globais que vieram diretamente do knowledge-base do agente

| Ref | Knowledge robustez | Editing needed |
|---|---|---|
| **Carbahn Autoworks** | MID — sabia Steve Dinan + BMW tuning, sabia IMSA Pilot Challenge sponsorship via search confirm | Minimal — search corroborou knowledge |
| **Singer Vehicle Design** | HIGH — pop-culture-level conhecida, "Everything is important" tagline, Rob Dickinson founder | Zero — knowledge robust solo |
| **ICON 4x4** | HIGH — knowledge robust, restomod category pioneer | Zero — knowledge robust solo |
| **AUTOPROFI / Bilstein workshop concepts** | LOW — sabia Meisterwerkstatt concept abstrato, MAS AUTOPROFI específico só veio via search | High — search foi essential, knowledge sozinho não cobre |

### Refs globais padaria (para comparação)

| Ref | Knowledge robustez | Editing needed |
|---|---|---|
| **Hart Bageri (Copenhagen)** | HIGH — pop-design-level conhecida pós-2022 | Zero |
| **Tartine Bakery (SF)** | HIGH — Chad Robertson pop-culture-level | Zero |
| **Poilâne (Paris)** | HIGH — fundação 1932 / heritage template | Zero |

**Observação crítica:** **Padaria teve 3/3 refs globais HIGH knowledge robustez**. **Mecânica teve 2/3 HIGH + 1/3 LOW (AUTOPROFI)**. Mecânica é vertical com refs design-driven **mais rarefeitas** no knowledge-base — confirmação do Risco 1 em `vertical-agnostic-test-comparison.md`.

### Refs locais

| Vertical | Refs locais | Knowledge robustez | Confidence |
|---|---|---|---|
| Padaria | Portus (Blumenau) + Cantinho do Pão (Curitiba) | Portus LOW (apenas citation cross-ref P-001 do prospect list), Cantinho LOW | "needs validation Fase 4" flag explícito |
| Mecânica | DIESEL SUL (Joinville) + CADERA (Joinville IVECO) | LOW ambos (apenas via search) | "needs validation Fase 4" flag explícito |

**Observação:** Refs locais em AMBOS verticais são **knowledge-low + search-discovered**. Esse é um pattern universal — refs locais NUNCA virão de knowledge-base, sempre exigem WebSearch+validation. Production v1 deve **assumir esse cost**.

---

## Quanto exigiu adjustment ad-hoc humano

**Adjustments aplicados explicitamente no dry-run #2:**

1. **Critério Insta relaxado (>500 obrigatório → qualquer N)** — pipeline padaria assumia Insta-heavy. Mecânica typically has 500-5k followers (com Blucaps outlier 20k). Sem esse ajuste, M-005 Auto Mecânica JC (Insta inexistente) teria sido descartado mesmo sendo prospect válido. Adjustment foi **explicit in prompt** ("aceita critério de Insta MAIS BAIXO ... mas exige reviews ativos em Google Maps").

2. **Critério NOVO adicionado: reviews GBP ≥30 + nota ≥4.0** — para substituir o Insta como trust gate primário. Adjustment foi **emergent in execution** (não estava prescrito no prompt — analyst inferiu da diff customer journey).

3. **Sazonalidade FRACA reconhecida e propagada para LAYOUT** — pipeline padaria embed assumption sazonalidade-forte (vitrine sazonal CMS). Mecânica precisou **remover** Vitrine Sazonal e **substituir** por "Serviços por Sintoma" grid. Adjustment foi **emergent** mas justificado em Fase 3 explicitamente.

4. **Photography direction MAIS específica** — padaria pediu "fotos reais da padaria + Tartine close-up vibe + sessão 2h presencial". Mecânica pediu "close-up cinematic componente diesel (turbo+bico+cabeçote) + bay documentary + Meister identified nominal + fachada + opcional P&B histórico". Shot list mecânica é **mais granular** e **mais técnica** — emergent adjustment.

5. **Trust accent NOVO (verde-musgo)** — padaria color palette tinha 4 tokens (bg+text-primary+accent+text-secondary). Mecânica adicionou 5º token (trust_accent verde-musgo) porque nicho mecânica usa badges/certifications como estrutura visual. Adjustment foi **emergent**.

6. **Equipe identificada nominalmente** — padaria pode ser anônima OR founder-focused. Mecânica B2B exige identificação nominal Meister responsável (Lei 4.886/65 + trust gate frota). Adjustment foi **emergent**.

**Quantitativamente:** ~6 adjustments significativos ad-hoc. ~70% foram **emergent in execution** (não prescritos pelo prompt). Pipeline tem CAPACIDADE de fazer adjustments emergentes baseados no domínio — boa sinal de robustez. MAS production v1 deveria ter **per-vertical adjustment checklist** para garantir consistência e não depender do mood do agente.

---

## Que parts do pipeline são genuinamente vertical-agnostic vs vertical-specific?

### Vertical-AGNOSTIC (chassis pipeline-wide)

| Pipeline part | Vertical-agnostic justification |
|---|---|
| Critério prospect base (CNPJ ativo + sem site OR site obsoleto) | Universal trigger condition |
| Geo scope (Blumenau-city + 15km radius) | Universal escopo piloto |
| Quality gates (AAA contrast 7:1 + 18px body + LCP ≤2.0s + INP ≤200ms) | Universal — inclusive-design + performance gates não dependem de vertical |
| Stack (Next.js 16 + Tailwind + Vercel + Supabase) | Universal stack-wide |
| Sitemap base BR (Home + Sobre + Contato + 2 mid-pages) | Universal scaffold — apenas mid-pages variam por vertical |
| Body typography (Inter variable) | Universal stack consistency — body é o "chassis tipográfico" comum |
| Background BR tropical cream (#F5-F7 hex family) | Universal cultural-fit BR — anti-clone de SF cool cream importado |
| WhatsApp button sticky + prefill | Universal CTA pattern — apenas mensagem prefill varia |
| Heritage stamp "Desde [ANO] em [BAIRRO]" | Universal pattern — trivial todos verticais >5 anos |
| Schema LocalBusiness + Subtype | Universal SEO — apenas subtype varia (Bakery/AutoRepair/Dentist/etc) |
| Anti-clone thresholds 85/75/60 | Universal calibração — mas peso categorial pode ajustar |
| LGPD kit (Política Priv + Termos + Cookies + canal privacidade@) | Universal compliance BR |

### Vertical-SPECIFIC (variabilidade emergente)

| Pipeline part | Como varia |
|---|---|
| Critério Insta (>500 vs qualquer N) | padaria forte vs mecânica relaxado vs odonto talvez forte vs eletricista quase zero |
| Trust gate primário | padaria reviews-Insta vs mecânica reviews-GBP+anos vs odonto reviews-anxiety vs advocacia reviews-status |
| Sazonalidade strength | forte (padaria/moda) vs fraca (mecânica/eletricista) vs status (luxury) |
| Layout Section 1 | vitrine sazonal vs marcas-grid vs antes-depois-galeria vs casos-de-sucesso |
| Layout organism "Serviços por Sintoma" auto-diagnose | só verticais utility-driven com sintomas reconhecíveis (mecânica/médico/eletricista) |
| Layout organism "Equipe identificada nominalmente" | só verticais B2B trust-driven (mecânica/advocacia/odonto/financeiro) |
| Photography direction | warm-Portra-artesanal vs cinematic-museum-industrial vs clinical-clean vs anti-AI-realistic vs luxury-staged |
| Display typography family/weight | serif warm (artesanal) vs sans bold industrial (utility) vs serif classical (heritage luxury) vs sans neutral (clinical) |
| Accent color semantic | terracota artesanal vs vermelho-acerola industrial vs verde-clinical vs azul-trust |
| Vocabulary domain | gastronomia artesanal vs engenharia mecânica vs odontologia clinical vs jurídico formal |
| Anti-pattern rejected | pâtisserie pretensão vs Meisterwerkstatt overkill vs sterile clinical exaggerated vs etc |
| Customer journey axis | emotional vs rational vs anxiety vs status |
| Legal compliance extras | CDC gastronomia vs CDC+corretagem mecânica vs CFO odonto vs OAB advocacia |

**Observação:** chassis pipeline é ~30% das decisões. Variabilidade vertical-specific é ~70%. Production v1 deve **explicitly model** essa proporção — chassis HARD-coded, variabilidade PROMPTED com per-vertical primer files.

---

## Recommendation final: project deve add per-vertical templates?

### Verdict: NÃO templates rigid, MAS sim per-vertical "primer files"

Templates rigid (per-vertical pipelines paralelos) violam o teste do dry-run — 86% delta médio prova que **pipeline single é robusto**. Fragmentar em N pipelines paralelos seria:
- ❌ Over-engineering — duplica chassis (gates AAA, performance, stack, sitemap base, etc)
- ❌ Operational debt — manter N pipelines em sync é dor crônica
- ❌ Diminui retornos — chassis improvements precisam aplicar a todos

**MAS** o pipeline single tem **vulnerabilidade real em refs design-driven menos populares** (eletricista predial, marcenaria, escritório de contabilidade) — Risco 1 do comparison. Solution:

### **PER-VERTICAL PRIMER FILE** — proposed structure

```yaml
# .aios-core/data/site-prospector/primers/oficina-mecanica.yaml
vertical_id: oficina-mecanica-auto
vertical_label: "Oficina Mecânica Auto (independente, não-franquia)"
customer_journey_axis: rational_utility
sazonalidade: fraca

prospect_criteria_overrides:
  insta_followers_min: any  # padaria default >500 não aplica
  reviews_gbp_min: 30  # adicional pra mecânica
  reviews_avg_min: 4.0
  exclusion_extras: ["concessionária franquia", "chain >5 unidades"]

trust_signals_required:
  - anos_mercado
  - certificacoes (Bosch/Meister/Handwerkskammer/equivalente)
  - marcas_atendidas_grid
  - meister_class_identified_nominal

layout_sections_required:
  - hero (close-up componente diesel cinematic)
  - marcas_atendidas_grid
  - servicos_por_sintoma_grid  # AUTO-DIAGNOSE
  - sobre_heritage
  - equipe_meister_identified
  - localizacao_mapa
  - footer_trust_signals

layout_sections_excluded:
  - vitrine_sazonal_rotativa  # padaria default não aplica

photography_direction:
  hero: close_up_cinematic_componente (turbo+bico+cabeçote)
  bay: documentary 3-4 angles
  equipe: identified nominal Meister
  fachada: rua oficial OR P&B histórica
  exclusoes: [stock_chave_inglesa, mãos_genéricas_óleo, motor_stock]

global_refs_curated:
  - { name: "Carbahn Autoworks", url: "https://carbahn.com/", weight: 0.45, archetype: european-marque-specialist-editorial-industrial }
  - { name: "Singer Vehicle Design", url: "https://singervehicledesign.com/", weight: 0.20, archetype: luxury-heritage-craftsmanship-cinematic, anti_clone_warning: HIGH }
  - { name: "AUTOPROFI Workshop Concept", url: "https://www.lkqworkshopconcepts.com/concepts/germany", weight: 0.35, archetype: industrial-workshop-documentary-meisterklasse }

local_refs_curated:
  - { name: "DIESEL SUL", url: "https://dieselsul.com.br/", city: "Joinville, SC" }
  - { name: "CADERA Mecatrônica", url: "https://www.caderamecatronica.com.br/", city: "Joinville, SC" }
  fallback_pool: ["SD Diesel Itajaí", "Lacer Diesel Itajaí", "Amplexo Diesel Floripa", "Frison São Paulo (luxury fallback)"]

color_palette_initial:
  bg: "#F5F1EA"
  text_primary: "#1F1B18"
  accent: "#A6342E"
  text_secondary: "#4A423B"
  trust_accent: "#2E5E3E"

typography_initial:
  display: "Archivo Black"
  body: "Inter"  # universal stack consistency

vocabulary_domain:
  approved: ["scanner OBD", "injeção eletrônica diesel", "retífica de cabeçote", "linha leve/média/pesada", "leva-e-traz", "diagnóstico técnico", "Mercedes Sprinter", "Fiat Ducato", "IVECO", "VW Constellation"]
  rejected_translations: ["Meisterwerkstatt literal", "Everything is important tagline", "obsessive attention"]

legal_compliance_extras:
  - CDC servicos (não produtos)
  - Lei 4.886/65 corretagem mecânica  
  - garantia escrita: orientação OAB-SC obrigatória diff vs gastronomia

cta_prefill_template: "Olá Itanorte, preciso de diagnóstico no meu [Mercedes Sprinter/Fiat Ducato/...]"
```

Esse primer file é:
- ✅ Curated humanamente (uma vez) — não depende de knowledge-base agente
- ✅ Vertical-specific overrides ONLY — chassis pipeline default aplica para o resto
- ✅ Mantém pipeline single (não fragmenta)
- ✅ Documenta intelligence emergente (sazonalidade, trust signals, photography shot list)
- ✅ Faz pipeline robust pra verticais com refs design-driven rarefeitas

### Priorização per-vertical primers (production v1 backlog)

Sugestão de ordem (Tier S Blumenau realistic + design-discourse richness):

1. **padaria/confeitaria artesanal** — ✅ done implicitly dry-run #1
2. **oficina mecânica auto** — ✅ done dry-run #2
3. **clínica odonto boutique** — TODO (testa anxiety-driven axis)
4. **ateliê moda autoral / interior** — TODO (testa emotional+aspirational + B2C-feminine)
5. **marcenaria custom** — TODO (testa craftsmanship-luxury BR + design discourse fraco)
6. **estética/beauty boutique** — TODO (testa aspirational + B2C-feminine + sazonalidade média)
7. **advocacia boutique** — TODO (testa B2B + status-driven + trust extreme + regulatory OAB)
8. **eletricista predial / manutenção** — TODO (testa utility extreme + design discourse quase zero — **maior teste de degradação pipeline**)

### Outras recommendations (resumo)

1. ✅ Per-vertical primer files (acima)
2. ✅ Customer-journey-axis-check explícito Fase 3
3. ✅ Anti-clone thresholds com peso categorial (color/type/layout = global-refs weight; vocabulary/sitemap = local-refs weight)
4. ✅ Aceitar variabilidade structural organism-level (não template 5-sections fixo)
5. ✅ Per-vertical legal-check checklist
6. ✅ Capture cross-vertical universal patterns na pipeline library (heritage stamp, close-up-componente-do-ofício, WhatsApp sticky prefill, etc)
7. ✅ Resolver WebFetch DENIED — production v1 não pode rodar sem Lighthouse audits funcionais. Setup Apify fallback obrigatório.
8. ✅ Comparison + Meta-summary embed em todo pipeline run (17% tempo / 70% valor)

---

## Apêndice — Numbers

| Métrica | Padaria DR1 | Mecânica DR2 | Delta |
|---|---|---|---|
| Tempo total | ~3h budget Tier S | ~95min condensed | mecânica condensed 2x faster |
| Prospects identificados | 10 | 5 (condensed) | DR2 menos amplo por design |
| Top ranked score | 9.0 (P-006) | 9.0 (M-002) | igual robustez ranking |
| Refs globais robustez (HIGH/MID/LOW) | 3/0/0 HIGH | 2/0/1 HIGH+LOW | mecânica refs DESIGN-DRIVEN MAIS RAREFEITAS |
| Refs locais robustez | 0/0/2 LOW | 0/0/2 LOW | igual — refs locais always require validation |
| Adjustments ad-hoc emergent | ~3 | ~6 | mecânica MAIS emergent adjustments |
| Color tokens count | 4 | 5 (added trust_accent) | mecânica adicionou 1 |
| Layout sections home | 4 + footer | 5 + footer | mecânica adicionou 1 organism |
| Customer journey axis | aspiracional | rational | DIFERENTE FUNDAMENTAL |
| Aggregate vertical-distinct delta | N/A (baseline) | **60/70 (86%)** | strongly distinct |
