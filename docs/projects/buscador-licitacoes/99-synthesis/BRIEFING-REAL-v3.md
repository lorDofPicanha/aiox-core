# Noyce — Briefing Real v3 (consolidado + evidência empírica)

**Data:** 2026-05-21
**Autor:** Orion (aios-master)
**Status:** 🟢 Supersede `BRIEFING-REAL-CONSOLIDADO.md` (v2) e `PROJECT-BRIEF-18mai-expansion.md` (v1).
**Base:** CONTEXT v5 (§9 correções v3 + §10 divergência v4 + §11 dataset real). Pendência da §9 (gerar v3) — **fechada aqui**.

---

## 0. TL;DR
**Noyce** é um **workflow-as-a-service** (não SaaS genérico) para uma operação de **3 empresas** — uma delas disputa licitações públicas de **obras/engenharia** em Goiás e entorno. Cobre o ciclo real de 6 estágios (monitorar → analisar → indicar → habilitar → acompanhar → recorrer). Pricing R$ 2.800/mês (modelo Hormozi, ROI ~12×). Ainda em **pré-Sprint 0**: branding pronto, arquitetura de-riscada por spikes, kill-gate do Stage 2 pendente.

---

## 1. Quem é o cliente (CORRIGIDO v3 — eram "4 empresas", são 3)
- **3 empresas reais** (nomes a confirmar na call — decisão C1).
- **1 das 3 faz licitação pública** (a empresa-licitante).
- **As outras 2** são operação financeira (livro caixa) — fora do buscador.
- **Equipe de licitação: 4 usuários** (não usuário solo idoso — corrige v2). RBAC multi-usuário no módulo licitação.

## 2. Dor #1 (validada pelos áudios 20/Mai)
> *"Aconteceu de a gente não acompanhar e acabar perdendo a licitação."*

A dor central é **notificação de movimentação em tempo real** numa licitação em disputa (Stage 5). Secundárias confirmadas: busca manual portal-a-portal (Stage 1), análise de habilitação manual (Stage 4), recurso para inabilitar vencedor (Stage 6).

## 3. Workflow real — 6 estágios
```
1. MONITORAR    — descobrir editais no raio (PNCP + PCP + BLL + BNC + ComprasGov + SISLOG), push <15min
2. ANALISAR 6M  — histórico do mesmo órgão (quem venceu/preço/recorrência)   [KILL-GATE do moat]
3. INDICAR      — 5 frases prescritivas (preço/diferencial/concorrente/risco/timing)
4. HABILITAR    — dossiê <30min: parse do edital + match de atestados/CAT/CRF/CND
5. ACOMPANHAR   — monitorar sessão/lances em tempo real → push de movimentação   [DOR #1]
6. RECORRER     — minuta jurídica (template + RAG Lei 14.133/TCU); analisar doc do vencedor
```
Livro caixa: **desacoplado** — usar SaaS BR (Granatum/Conta Azul), não construir (commodity).

## 4. Sinal direcional — 11 editais reais (NOVO em v3, §11 do CONTEXT)
Cliente entregou 11 editais dos últimos meses. ⚠️ **Amostra PEQUENA — sinal direcional, não base estatística. NÃO estreita escopo nem rebaixa fontes.**

| Dimensão | Sinal na amostra | Leitura |
|---|---|---|
| **Segmento** | 100% **OBRAS/ENGENHARIA CIVIL** (galpão, creche, UBS, praça, reformas) | Filtro = CNAE construção 41/42/43; NÃO pregão de bens |
| **Modalidade** | Concorrência eletrônica (14.133); CEASA = pregão (13.303) | Modelo de habilitação por obras |
| **Plataformas** | PCP=4 · BLL=4 · BNC=2 · ComprasGov=1 · SISLOG=0 | PCP/BLL fortes na amostra; **SISLOG e as 5 fontes MANTIDAS**; prioridade real sai da call |
| **Geografia** | 100% GO, cluster ≤170km de Águas Lindas | Concentração no período; **raio ~500km mantido** como escopo (owner) |
| **Habilitação** | Atestados técnico-operacional/profissional, CAT/CREA, garantia ~1%, planilha/BDI | Define o parsing do Stage 4 |
| **Valores** | R$ 174k – R$ 2,83M | Obras municipais de médio porte |

→ Os 11 editais viram **corpus-semente** do kill-gate (Stage 2) e do parsing (Stage 4) — não fonte de decisão de escopo/fontes.

## 5. Moat (redefinido pós-mega-research)
Effecti/ConLicitação já fazem análise histórica 6m. O moat real do Noyce está em **3 camadas**:
1. **Síntese prescritiva 5-frases** (Stage 3) — recomendação acionável, não só dado.
2. **Backstage integration** — habilitação casada com atestados/CAT reais da cliente (vault + RLS).
3. **Verticalização** — obras/engenharia no raio de ~500km da sede, com o ciclo completo até recurso.

## 6. Escopo geográfico — raio ~500km MANTIDO (decisão owner 21/Mai)
- Filtro = **haversine ~500km configurável** a partir de Águas Lindas (lat -15,75 / lon -48,28).
- Cobertura teórica: DF + GO inteiro + oeste/triângulo MG + sul TO + bordas BA/MT.
- Amostra recente concentra em GO ≤170km → usar para **priorizar cobertura P0**, não para estreitar o raio.
- Cobertura nacional via **PNCP filtrado por distância** (não "5-12 portais hiper-regional").

## 7. Stack OSS confirmada
- PDF: **Docling (MIT)** + pdf-lib. (NÃO Marker/GPL-3, NÃO PyMuPDF/AGPL-3.)
- Embeddings PT-BR jurídico: **`rufimelo/Legal-BERTimbau-large-v2`** (MIT).
- Vector: **pgvector** no Supabase. CNPJ alfanumérico: cpf-cnpj-validator (MIT). OCDS BR: OCDS Kit.
- Base: Next.js 16 + Supabase + Inngest + WhatsApp Cloud API + Resend + Sentry. Livro caixa: SaaS BR externo.

## 8. Pricing (workflow-as-a-service, modelo Hormozi)
| Fase | Clientes | Infra/mês | Preço/mês | Margem/ano |
|---|---|---|---|---|
| 1 — Piloto | 1 case-âncora | R$ 80-220 | R$ 0 | — |
| 2 — Beta | 5 pagantes | R$ 700-900 | R$ 2.800 | R$ 115-165k |
| 3 — Escala | 50 regional | R$ 4.500-6.000 | R$ 2.800 médio | ~R$ 14k/mês |

ROI alegado: economiza ~R$ 381k/ano de custo manual escondido (~12×).

## 9. Estado dos spikes (de-risking)
| Estágio | Spike | Status |
|---|---|---|
| 1 Monitorar (P0) | ✅ escrito | — |
| 5 Acompanhar (P0) | ✅ escrito | DOR #1 |
| 2 Analisar 6m (P1) | ✅ escrito | **experimento NÃO rodado — kill-gate** |
| 3 / 4 / 6 + X1/X2/X3 | 🔲 escopados | pendentes |

**Gate-first:** rodar o eval offline do Stage 2 (cobertura PNCP/OCDS) **antes** de qualquer build. Os 11 editais reais são o conjunto-semente.

## 10. Decisões pendentes (call de discovery)
- **C1** Nomes das 3 empresas + qual licita.
- **D2** Prioridade das 5 fontes (PCP/BLL/BNC/ComprasGov/**SISLOG mantido**) — sai da frequência real de uso da cliente, não da amostra.
- **D3** Stage 5: construir monitor de sessão OU integrar Lance Fácil (BLL)?
- **D4** Livro caixa: adotar Granatum/SaaS BR (recomendado).
- **D5** Papéis dos 4 usuários (quem busca/habilita/dá lance/recorre).
- **D6** Raio ~500km mantido — fixo ou ajustável por tipo de contrato?

## 11. Próximo passo recomendado
1. **Rodar o coverage test do Stage 2** com os 11 editais reais (kill-gate).
2. **Parsing test (Stage 4)** com Docling em 3 editais (1 PCP, 1 BLL, 1 BNC).
3. **Call de discovery** (C1 + D2-D6).

---
*v3 por Orion (aios-master). Fecha a pendência §9 do CONTEXT. Incorpora dataset real (§11) e mantém o raio ~500km por decisão do owner.*
