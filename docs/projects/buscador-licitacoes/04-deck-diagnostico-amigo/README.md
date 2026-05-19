# Deck — Diagnóstico Amigo (Call Discovery)

**Projeto:** buscador-licitacoes (Holding Virtual)
**Audiência:** Amigo do Breno (fornecedor B2B regional, 4 CNPJs, AL+DF)
**Goal:** Sair da call com diagnóstico escrito + Sprint 0 confirmado
**Status:** 🟡 **v1 draft — QA score 84.5** (REVIEW, abaixo de 85 PASS)
**Versão:** v1
**Data:** 2026-05-18
**Generado por:** Sloan via Orion (`@slide-creator` AIOS agent)
**Skill source:** `.claude/skills/slide-creator/` (Anthropic skill format)

---

## 🎬 Tese central do deck

> **"Holding Virtual para fornecedor B2B de licitação.**
> Você nunca mais perde edital por CRF vencido, recurso por preclusão,
> ou hora refazendo dossiê."

---

## 📋 12 slides — sequência canônica

| # | Função | Estrutura | Action title |
|---:|---|---|---|
| 1 | hook | H03 Cost of inaction | Quanto custou o último CRF FGTS que você não viu vencer? |
| 2 | diagnosis | D11 Cost leak map | 7 furos diários que o manual não vê — mas o seu calendário sente |
| 3 | reframe | R09 Means vs end | O problema não é organizar 4 empresas. É operar como se fosse uma. |
| 4 | stakes | P03 Before/after | Hoje 4h pra montar dossiê. Com o sistema: 28 minutos. |
| 5 | mechanism | M04 Layer cake | A Holding Virtual: 1 sistema que enxerga suas 4 empresas como grupo |
| 6 | mechanism | M16 Input-process-output | 5 pipelines que conversam entre si — não 5 produtos separados |
| 7 | mechanism | M02 4-block | Anti-conluio Lei 14.133 art. 14 IV — o sistema bloqueia antes de você errar |
| 8 | proof | P11 Case teardown | Caso CRF FGTS: você não esquece mais |
| 9 | proof | P09 Demo result | Caso ACT matcher: score 0-10 evita atestado errado |
| 10 | plan | E14 Pilot-to-scale | 22 semanas, 6 vitórias mensuráveis |
| 11 | objection | O13 Stack 3 | 3 perguntas que você tá fazendo na sua cabeça agora |
| 12 | cta | O08 CTA hero | Sprint 0 começa segunda. Preciso de 45min e 8 respostas suas. |

---

## 📁 Pacote — 14 artefatos entregues

### Foundation (4)
- `briefing-normalized.yaml` — context, audience, constraints
- `audience-belief-shift.yaml` — current → desired belief + resistance map
- `story-arc.yaml` — narrative compression em 12 stages
- `slide-function-map.yaml` — função + structure + action title + key message

### Selection (5)
- `roteiro-template-selection.yaml` — primary #5 Sales B2B + secondary #26
- `slide-structure-selection.yaml` — 12 structures justificadas (+ 7 rejected)
- `visual-template-selection.yaml` — 7 visual patterns + 1 chart dataset
- `theme-profile-selection.yaml` — executive_clean justificado
- `runtime-job-selection.yaml` — manuscript-first pipeline reutilizando briefing v2

### Research (1)
- `research-route-selection.yaml` — local_file_retrieval + evidence handling

### Production (3)
- `design-direction.yaml` — visual thesis + grid + palette + motif Holding Virtual
- `deck-spec.yaml` — slide-a-slide (visible copy + visual + speaker notes + evidence)
- `speaker-notes.md` — 45min de fala + matriz de riscos durante call

### Validation (3)
- `source-ledger.yaml` — 21 claims mapped, 5 blockers identificados
- `qa-report.yaml` — score ponderado 84.5 + block_if audit completo
- `key-slide-gate.yaml` — 5 slides decisivos com validation methods

### Process (2)
- `revision-notes.md` — histórico v1, trade-offs, próximos passos
- `planning-reflection.jsonl` — 14 decisões registradas para audit

---

## 🚨 5 blockers antes de usar este deck na call

1. **Slide 11 #3 (preço)** — Decisão B3 Breno pendente (cobrar piloto vs case-âncora grátis). Default = grátis.
2. **Slide 1 faixa edital R$5-50k** — Validar com amigo (médio real dele)
3. **Slide 8 R$180k CRF case** — Substituir por caso real do amigo (se compartilhar)
4. **Slide 9 ACT matcher scores** — Substituir por ACT real (se houver no vault)
5. **Render visual** — Recomendado produzir 5 key-slide mockups HTML antes da call

---

## ✅ Como usar este pacote

### Pré-call (Breno)
1. Ler `revision-notes.md` (decisões + caveats)
2. Decidir B3 → ajustar `deck-spec.yaml` slide 11 #3
3. Revisar `speaker-notes.md` (matriz de riscos durante call)
4. Opcional: produzir HTML mockup dos 5 key slides (key-slide-gate)

### Durante call
- Imprimir/PDF do `deck-spec.yaml` slides para anotação
- Ter `speaker-notes.md` aberto em outro device/janela
- Bloco C: 8 perguntas anotadas separadas (mais fácil para áudio)

### Pós-call (mesma noite)
- Substituir 4 exemplos construídos com dados reais
- Atualizar slide 10 priorities baseado em dor #1 (Bloco C6)
- Re-rodar QA → target score ≥ 90 para deck v2

---

## 🎯 Próximos passos sugeridos

Triggers para Orion após Breno revisar:

- `aprovo deck v1 sem mudanças` → produzir mockups HTML dos 5 key slides
- `ajusta deck v1` → especificar mudanças
- `render visual completo` → produzir HTML interativo dos 12 slides
- `pula key-slide gate` → ir direto para render completo (override)
- `marca data call amigo {YYYY-MM-DD}` → preparar materiais finais

---

## 📊 Métricas do pacote

| Métrica | Valor |
|---|---|
| Slides | 12 |
| Visible words total | 746 |
| Average per slide | 62 |
| Max per slide | 92 (slide 12) |
| Min per slide | 28 (slide 1) |
| Claims mapped | 21 |
| Sourced | 14 (66%) |
| Assumption | 5 (24%) |
| Validate | 2 (10%) |
| Structures distintas | 12/12 |
| Function distribution | hook×1, diagnosis×1, reframe×1, stakes×1, mechanism×3, proof×2, plan×1, objection×1, cta×1 |
| QA weighted score | 84.5 |
| Block_if violations | 0 (12 pass, 2 defer, 2 na) |

---

*Deck-package v1 — Sloan (Narrative Architect) via Orion @ aios-master*
*Pronto para revisão Breno + ajustes pré-call*
