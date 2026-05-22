# #09 — Vitrine Builder

**Tier:** B
**Status:** ⚪ pending (componente de #06, pode standalone para volume baixo)
**Case validador:** Rodrigo Feldman → "85% das pessoas não sabem desenhar vitrine"

---

## DSPC

**D — Dor cara:**
Empreendedor solo / consultor / coach tem ÓTIMO produto/serviço, mas vitrine (LP, hero, social, DM) está fraca. Não consegue converter porque pessoa olha vitrine, não entende a transformação que vai receber, não entra. "Produto não é problema, vitrine é".

**Custo semanal visível:** 3-5 leads perdidos por semana × R$2-10k ticket = R$10-50k/sem em vendas não-realizadas.

**S — Squad:**
- `agent-discovery-interviewer` — 5 perguntas pra extrair ICP + dor + transformação
- `agent-headline-generator` — usa copy-chief com Alex Hormozi clone pra headlines
- `agent-hero-builder` — hero LP com headline + sub + CTA visualizado
- `agent-transformation-mapper` — before/after slide claro
- `agent-dm-script-writer` — scripts pra DM Instagram/LinkedIn
- `agent-carousel-generator` — carrossel 6-8 slides Instagram
- `agent-ad-creative-builder` — versão Meta Ads + Google Display

**P — Pitch:**
> "Eu ajudo empreendedores solo e consultores a construir vitrine que converte em 24 horas em vez de 2 meses, usando squad com Alex Hormozi e 24 copywriters lendários para alcançar 3-9x mais cliques + DMs respondidas"

**C — Contrato:**
- Setup: R$3-8k por vitrine completa
- Pacote: R$15-25k para 3 vitrines + treinamento + brand assets
- Manutenção: R$1-3k/mês (atualizações sazonais, tests)

---

## Vertical inicial sugerido

**Coaches / consultores high-ticket** (R$5-30k ticket) que querem profissionalizar funil de entrada.

**Alternativas:**
- Influencers virando mentor/consultor
- Profissionais especialistas (médico, advogado) saindo de área de carreira

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `copy-chief` + 24 clones (Hormozi, Hopkins, Halbert, etc.) | Core absoluto |
| `design-chief` + 9 specialists | Visual coerente |
| `traffic-masters-chief` | Validar que vitrine converte (CTR projeção) |
| Slide Creator #00 | Carrossel Instagram |
| `joanna-wiebe` (clone) | Conversion copy |
| `oli-gardner` (clone) | LP best practices |

---

## Stack proposto

- **Backend:** Next.js + Supabase
- **AI:** Cloud Opus pra copy crítica; Codex pra renderização HTML
- **Output:** ZIP com (a) LP HTML, (b) hero PSD/PNG, (c) carrossel 1080x1080, (d) DM scripts MD, (e) ad creatives 1200x628

---

## Hipóteses

1. ✅ copy-chief + 24 clones já existe e validado
2. ❓ Mercado coach saturado de "construa sua landing page" — diferencial?
3. ❓ Profundidade 24 clones gera vitrine notavelmente melhor que ChatGPT custom GPT?

---

## Quando começar

Após #06 (Tangibilização) estar em produção. #09 é frequentemente um componente de #06, então pode emergir naturalmente.

Trigger: `kickoff vitrine-builder`
