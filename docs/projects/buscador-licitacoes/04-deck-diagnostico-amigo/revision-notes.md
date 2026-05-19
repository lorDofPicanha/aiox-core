# Revision Notes — Deck Diagnóstico Amigo v1

## Histórico de versões

### v1 — 2026-05-18 (Sloan via Orion)

**Decisões arquiteturais do deck:**

1. **Roteiro primary = "Sales deck B2B" (slide-creator #5)** — não webinar (#1) nem investor (#4). Razão: setting é 1-on-1 consultativo, não palestra coletiva nem captação.

2. **Secondary borrowed = "Sales call deck / live close" (#26)** — para objection handling + risk reversal em real-time.

3. **12 slides target** — abaixo do default 8-12 do Sales B2B porque domínio é complexo (4 empresas + 5 pipelines + Lei 14.133 + ACT matcher) e cliente precisa ver MAIS proof, não menos. Justificado por:
   - 3 mechanism slides (M04+M16+M02) — domínio requer 3 facetas distintas
   - 2 proof slides (P11+P09) — confiança Breno está dada, mas mechanism é abstrato
   - 1 objection stack — call live demanda

4. **Theme = executive_clean** (não webinar editorial, não observatory dark). Razão: cliente é PJ B2B 40-50 anos provavelmente lendo no celular sob luz natural. Credibilidade calma > emoção persuasiva.

5. **Motif "Holding Virtual" = 4 squares coloridos + 1 outline acima** — visual recorrente que cliente sai da call lembrando.

6. **Sem AI image generation** — deck v1 é Markdown denso + diagramas declarativos. Render visual é fase 2.

7. **Manuscript pre-existente reutilizado** — briefing v2 consolidado (867 lh) cumpre função de manuscript. Pulei steps de planner + research no manuscript-pipeline.

**Trade-offs aceitos:**

- **Slide 4 promete "28min"** quando ainda é projeção pós-M4. Mitigado: speaker notes marcam como "projeção honesta, sprint 4 entrega esse marco".
- **Slides 8-9 usam exemplos construídos** (R$180k CRF case, scores ACT 8.5/7.8/4.0). Mitigado: speaker notes admitem "é construído com números do briefing — me conta o seu".
- **Slide 11 #3 (preço) tem CAVEAT INTERNO** sobre decisão B3 pendente Breno. Default = case-âncora grátis Fase 1.
- **12 slides em 45min** é apertado (~3.5 min/slide + Bloco C ao final). Speaker notes preveem split em 2 calls se cliente preferir.

---

## O que mudou da concepção inicial

| Versão | Antes | Depois | Razão |
|---|---|---|---|
| Hook | H05 (One number opener) | H03 (Cost of inaction) | Frio vs evocar dor passada concreta |
| Diagnosis | D02 (Friction map) | D11 (Cost leak map) | Não quantifica vs quantifica cada leak |
| Reframe | R01 (Old/new model) | R09 (Means vs end) | Cosmético vs muda hierarquia mental |
| Mechanism (pipelines) | M05 (Pipeline) | M16 (Input-process-output) | Linear vs cross-pipeline data sharing |
| Plan | E01 (Milestone timeline) | E14 (Pilot-to-scale staircase) | Datas-only vs marcos de uso real |
| Proof timing | 1 slide | 2 slides (P11+P09) | Complexidade do mechanism exige mais ancoragem |
| CTA visual | O07 (Next-step ladder) | O08 (CTA hero) | Múltiplas paths vs ação única dominante |

---

## O que o QA detectou + ação tomada

**Score 84.5 (REVIEW, 0.5 abaixo de 85 PASS).** Não foi promovido a "final" — apresentado como diagnostic draft v1.

### Killer issues identified:

1. **Deck não renderizado visualmente** → Action: produzir 5 key-slide mockups (cover, reframe, mechanism5, proof8, CTA) antes de investir em deck completo
2. **Decisão B3 (preço) pendente Breno** → Action: alinhar antes da call
3. **4 exemplos construídos a substituir pós-call** → Action: documentado em source-ledger.yaml com blocker tag

### Block_if audit results:

12 conditions checked, **0 fail**. 2 defer (chart validation, key-slide-gate) → não bloqueiam v1 Markdown, rodar antes de render.

---

## O que vai melhorar em v2 (pós-call)

1. **Slide 1**: faixa edital R$5-50k → faixa real informada pelo amigo
2. **Slide 8**: CRF case com caso real do amigo (se compartilhado)
3. **Slide 9**: ACT matcher exemplo com ACT real (se houver no vault)
4. **Slide 10**: priorities ajustadas baseado em dor #1 do Bloco C6
5. **Slide 11 #3**: decisão B3 finalizada (cobrar ou grátis)
6. **Re-rodar QA**: target score >= 90 (vs 84.5 atual)
7. **Render visual**: HTML mockup dos 5 key slides → rendered-eval
8. **Key-slide gate**: validar 5 slides decisivos antes de render completo

---

## Considerações para Breno antes de usar este deck

### ✅ Pronto pra usar

- Estrutura narrativa (story arc, slide functions)
- Source mapping (claims rastreáveis ao briefing v2)
- Speaker notes (45min de fala com pausas + perguntas)
- Theme + design direction (executive_clean documentado)
- Anti-features explícitas

### ⚠️ Precisa de input seu antes da call

1. **Decisão B3** (slide 11 #3 — case-âncora grátis ou piloto pago?)
2. **Validação tom** (consultivo está OK? Ou mais formal/informal?)
3. **Formato call** (45min apertado para 12 slides → split em 2 calls?)
4. **Material de apoio** (printar PDF para amigo? Compartilhar tela?)

### 🚫 NÃO use ainda sem revisão

- Deck v1 NÃO é entregável visual final
- Score 84.5 está abaixo do threshold PASS (85)
- Recomendado: produzir 5 key-slide mockups visuais antes de render completo
- Após call, fazer v2 com dados reais do amigo → re-QA → target >= 90

---

## Decisões para próximos decks da família "buscador"

Quando produzir Deck B (go/no-go interno Breno) ou Deck C (investor narrative se virar SaaS), reusar:

- ✅ Theme profile executive_clean (mesmo cliente-mental-model)
- ✅ Motif Holding Virtual (consistência visual cross-deck)
- ✅ Source-ledger pattern (todo claim mapped)
- ✅ Block_if validation
- ❌ Estrutura específica (cada deck tem audience belief shift diferente)
- ❌ Speaker notes (deck B é leitura solo, deck C é pitch coletivo)

---

*Revision notes v1 — Sloan via Orion @ 2026-05-18*
*Próximo gate: revisão Breno → key-slide mockups → call discovery amigo*
