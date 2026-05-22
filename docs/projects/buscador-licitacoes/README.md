# 🟦 Noyce — Workflow de Licitações (workspace)

> **O que é:** workflow-as-a-service para uma operação de **obras/engenharia** que disputa licitações públicas. Cobre 6 estágios: **Monitorar → Analisar → Indicar → Habilitar → Acompanhar → Recorrer**. Marca: **Noyce** (inspiração ENIAC / Robert Noyce).
>
> **Status (21/Mai/2026):** pré-Sprint 0. Research + spikes completos + branding pronto. **O build será feito no Codex** — este workspace entrega raciocínio, pesquisa e o handoff; não contém código de produção.

---

## 🚀 Comece por aqui (3 documentos)
1. **`00-context/CONTEXT.md`** — sistema de registro do projeto (intent, escopo, fontes, decisões, dataset real, histórico v1→v5). **Leia primeiro.**
2. **`02-architecture/11-build-plan-codex-handoff-21mai.md`** — plano de build para o Codex (stack, sprints gate-first, schema, decisões, pesquisa). **É o doc que você alimenta no Codex.**
3. **`01-research/07-discovery-call-script-21mai.md`** — roteiro da call de discovery (fecha as decisões humanas C1 + D1–D6).

## 🗂️ Mapa de pastas
| Pasta | Conteúdo |
|---|---|
| `00-context/` | CONTEXT.md, BRAND-SYSTEM.md, NAMING-OPTIONS.md, transcrições de áudios da cliente |
| `01-research/` | Pesquisa: portais-fonte, editais reais, APIs (PCP/PNCP), Docling, embeddings, discovery |
| `01-research/editais-reais/` | Texto extraído dos 11 editais reais da cliente (`.txt`) |
| `02-architecture/` | Spikes (Stage 1-6 + X1/X2/X3), build plan, experimento Stage 2 |
| `03-squad/` | Config de squad de agentes |
| `04`/`06`/`08-*` | Decks (diagnóstico, workflow cliente, apresentação) |
| `05-mega-research/` | 6 research files paralelos (data, arch, mercado, ux, pm, oss) |
| `07-brand-mockups/` | Identidade visual Noyce (logos SVG/PNG, brand-sheet, mockups) |
| `99-synthesis/` | Briefings (v3 = atual), master report, plano de execução |

## 📄 Documentos-chave por tema
**Arquitetura & build (`02-architecture/`)**
- `00-spikes-roadmap-20mai` — visão geral dos spikes + sequência gate-first
- `01-architecture-v1` — arquitetura vigente · `00-arch-skeleton` — schema preliminar (V0)
- Spikes: `02`(Stage5) `03`(Stage1) `04`(Stage2) `05`(Stage3) `06`(Stage4) `07`(Stage6) `08`(X1 adapters) `09`(X2 RLS) `10`(X3 vault)
- **`11-build-plan-codex-handoff`** (handoff) · **`12-experimento-cobertura-stage2`** (kill-gate executável)
- **`13-sprint0-council-routing-22mai`** — consolidação dos councils Sprint 0: produto, jurídico, arquitetura, dados, UX e segurança
- **`ADR-001-equal-priority-multisource-canonical-model-22mai`** — decisão arquitetural: multi-fonte sem fonte principal + `source_candidates`
- **`14-sprint0-schema-adapters-implementation-plan-22mai`** — sequência de build: schema, adapters, fixtures, score, UX e gates
- **`sql/0001_noyce_equal_priority_canonical_schema.sql`** — SQL de referência para Supabase/Postgres
- **`contracts/source-adapter.contract.ts`** — contrato único para todas as fontes

**Pesquisa (`01-research/`)**
- `04-editais-reais-21mai` — análise dos 11 editais reais
- `05-pcp-api` · `09-pncp-ibge-deep` — APIs de fonte (PNCP filtros confirmados ao vivo)
- `06-docling` — PDF parsing · `10-embeddings-legal-bertimbau` — embeddings (→ bge-m3)
- `08-fontes-disputa-stage5` — BLL/BNC/SISLOG + Lance Fácil + decisão Stage 5
- `07-discovery-call-script` — roteiro da call

**Síntese (`99-synthesis/`)**
- `BRIEFING-REAL-v3.md` — briefing atual (supersede v1/v2)

## 🔁 Workflow & status dos spikes
| Estágio | Spike | Gate |
|---|---|---|
| 1 Monitorar (P0) | ✅ | descoberta via PNCP por município/órgão (confirmado ao vivo) |
| 2 Analisar 6m (P1) | ✅ + experimento executável | **KILL-GATE**: cobertura ≥50%, hit-rate ≥50%, MAPE ≤15% |
| 3 Indicar (P1) | ✅ | ≥60% frases úteis, 0 alucinação |
| 4 Habilitar (P1) | ✅ | recall requisitos críticos ≥90% |
| 5 Acompanhar (P0) | ✅ | **BUILD** automação de sessão (credencial da cliente) |
| 6 Recorrer (P2) | ✅ | ≥70% c/ especialista; revisão humana |
| X1 adapters · X2 RLS · X3 vault | ✅ | interface comum · 0 vazamento · credencial cifrada + ToS |

## ✅ Decisões resolvidas / ⏳ pendentes
**Resolvidas (research):** raio ~500km mantido · 5 fontes mantidas (PCP/BLL/BNC/ComprasGov/SISLOG) · Stage 5 = **BUILD** (D3) · embedding = **bge-m3** · PDF = **Docling** · PNCP filtra por município/órgão (confirmado ao vivo) · geo via IBGE Localidades · livro caixa = SaaS BR externo (D4).
**Pendentes (call de discovery):** C1 (empresas) · D1/D6 (raio fixo/config) · D2 (prioridade de fontes) · D5 (papéis dos 4 usuários).

## 📊 Dataset real (11 editais)
100% **Goiás** (Águas Lindas/Novo Gama/Abadiânia/Pirenópolis/Anápolis/CEASA), **obras/engenharia em Concorrência Eletrônica** (Lei 14.133; CEASA via Pregão/13.303). Plataformas na amostra: PCP=4, BLL=4, BNC=2, ComprasGov=1. ⚠️ Amostra **direcional**, não estatística — não estreita escopo nem rebaixa fontes.

## 🛠️ Como começar a construir (no Codex)
1. Alimentar o Codex com **`CONTEXT.md` + `11-build-plan-codex-handoff` + `STORY-NOYCE-S0-MVP-WORKFLOW.md` + os spikes citados**.
2. Usar o gate PNCP como evidência técnica, não como escopo total nem fonte principal. O Sprint 0 atual é **workflow-first + equal-priority multi-source canonical model**.
3. Se PCP confirmar P0 na call → **solicitar chave da API PCP** (lead ~7 dias úteis).
4. Sprint 0: schema canônico multi-fonte + RLS (X2) + contratos de adapters + score v0 + evidências/confiança por campo.

## Atualização 2026-05-22 — Sprint 0 atual
O projeto não deve começar como "buscador PNCP". A rota correta é construir o Noyce como workflow de licitações:

- **Monitorar:** PNCP, PCP, BLL, BNC, ComprasGov, SISLOG e novos portais encontrados no raio operacional de 500 km.
- **Analisar:** concorrência, oportunidade, valores médios, risco e confiança.
- **Indicar:** score explicável com evidências.
- **Habilitar:** checklist de requisitos e documentos.
- **Acompanhar:** sessão, eventos, prazos e risco de preclusão.
- **Recorrer:** minuta assistida com revisão humana.

A story operacional para os agentes é `docs/stories/active/STORY-NOYCE-S0-MVP-WORKFLOW.md`.

Roteamento atualizado: usar a arquitetura atual de **25 squads / 210+ especialistas**. O Sprint 0 deve ser conduzido por councils pequenos: produto, licitações/jurídico, arquitetura, dados/score, UX/brand, segurança e QA/DevOps. A matriz completa está na story acima.

Política de fontes atualizada: nenhuma fonte é principal. Todas as fontes conhecidas têm o mesmo nível de importância, e qualquer portal relevante encontrado dentro do raio de 500 km deve ser registrado como fonte candidata para adapter.

## 🧠 Triggers de memória (CONTEXT §7/§9/§11)
`continua buscador licitações` · `build noyce` / `handoff codex` · `fontes reais buscador` · `escopo geografico buscador` · `gate buscador licitações` · `agendar call amigo`.

---
*README mantido por Orion (aios-master). Última atualização: 2026-05-22.*
