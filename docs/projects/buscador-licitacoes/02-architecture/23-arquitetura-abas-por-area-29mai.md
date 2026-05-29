# Arquitetura por Abas/Áreas + profundidade busca→analisa→entrega — 29/Mai/2026

**Origem:** owner — "o que foi entregue é só DATA; quero um sistema que BUSCA, ANALISA e ENTREGA. Separe por ABA o que cada uma é responsável, PRIMEIRO, pra trabalharmos por área. Muito superficial, muito potencial inexplorado." Workflow de design (7 agentes: IA + 5 áreas + síntese) aterrado no código real, PNCP e Lei 14.133.

**Princípio reitor:** cada aba é um loop fechado **BUSCAR → ANALISAR → ENTREGAR**, onde ENTREGAR = um artefato/decisão na mão do operador (não um painel de números). Teste de aceite: *"ao sair da aba, o operador leva [X]"* — se X = "uns números", a aba está errada.

## Mapa final — 7 abas

| # | Aba | Responsabilidade | Loop busca→analisa→entrega |
|---|-----|------------------|----------------------------|
| 0 | **Mesa** | Trabalho do dia priorizado + roteia pra próxima ação | Busca tudo por `lifecycle.phase` → ordena urgência×consequência → **lista "faça X em Y" + deep-link** |
| 1 | **Monitorar** | Achar editais novos no raio/CNAE (PNCP) e triar | Varre `/contratacoes` → triagem (fit/dist/valor/prazo) → **fila Vai/Olha/Pula + push WhatsApp** |
| 2 | **Analisar** | Julgar a oportunidade: dá pra ganhar, a que preço, contra quem | Cruza MarketStructure (HHI/share/preço reais) + prazo → **veredito Vai/Não-Vai + 5 frases (Stage 3)** |
| 3 | **Habilitar** | Saber se qualifica + montar dossiê | Casa requisitos edital × acervo ENIAC → **dossiê montado + GO/NO-GO + lacunas como tarefas** |
| 4 | **Acompanhar** | Vigiar sessão/movimentação (DOR #1) | Monitora prazos + sessão → tiers de risco → **alerta acionável + baton de recurso (~10min)** |
| 5 | **Recorrer** | Decidir se há fundamento + minutar | Docs do vencedor + edital + RAG Lei 14.133/TCU → **go/no-go + minuta** (protocolo bloqueado) |
| 6 | **Acessos & Governança** | Portais/vault/ToS/readiness — fora do fluxo | `portalAccess`+readiness → **status de prontidão + bloqueios c/ dono** |

**Decisões:** Stage 3 "Indicar" NÃO é aba — é a **entrega** da Analisar. Abas **globais por verbo** (não rotas per-opportunity) — a unidade de trabalho é uma *fase do dia*, não um edital (equipe de 4 divide por função). Oportunidade selecionada via `?op=<id>`. Mesa e Governança são abas próprias (rotear o dia ≠ executar estágio; configurar ≠ caçar licitação).

**Estado novo que destrava tudo:** campo `Lifecycle` persistido na `Opportunity` (phase + triageVerdict + history com quem/quando), substituindo o `stage` estático. Sem DB, abas são read-only sobre fixtures; colaboração/fluxo real = PR 4 (persistência).

**Invariante anti-regressão:** nenhum veredito/mercado/readiness/recurso pode derivar de `opportunityScore`/`confidenceScore`. Todo `grounded` rastreia fonte; todo `inferred`/`gap` renderiza com chip visível.

## Plano — SEPARAR PRIMEIRO

**PR 1 (separação, zero mudança de comportamento, build verde):** route group `(workspace)` + layout com Rail (7 abas + badges) + LifecycleBreadcrumb + OpportunityProvider. Mover painéis do god-component `page.tsx` (~650 linhas) para componentes por área (`components/{mesa,monitorar,analisar,habilitar,acompanhar,recorrer,governanca}/`). Deletar rota duplicada `app/analysis-runs.json/route.ts`. Server Components por padrão; só inbox/provider são client.

**Mapa de migração (linhas atuais → aba):** metric-row→Mesa · opportunity-list+filtros+cards→Monitorar · detail-header/decision-summary/evidence/score-breakdown+MarketSection→Analisar · habilitation+lacuna-tasks+legal requirements/documents→Habilitar · timeline+legal events→Acompanhar · appeal-box+decision-points→Recorrer · portal-matrix+readiness→Governança.

**PR 2+ (profundidade, rankeado por alavancagem):** PR2 Mesa+Monitorar (plugar fetcher PNCP órfão) · PR3 Analisar (veredito + 5 frases sobre o market-snapshot que já existe) · PR4 Persistência DB do Lifecycle (destrava colaboração) · PR5 Habilitar (Docling+vault, flag) · PR6 Acompanhar/DOR#1 (deadline-watch já; sessão autenticada atrás de vault+ToS) · PR7 Recorrer (docs vencedor + RAG).

## De "só DATA" para "analisa e entrega" (por área)

| Aba | Hoje | Depois | Grounded já? |
|---|---|---|---|
| Monitorar | 4 fixtures + botão morto | Fila Vai/Olha/Pula + push | ✅ query/score; ⚠️ scheduler |
| Analisar | mostra HHI e para no número | Veredito Vai/Não-Vai + 5 frases | ✅ ranking/preço; ⚠️ diferencial/risco = gap |
| Habilitar | checklist hardcoded | Matcher requisito×acervo + GO/NO-GO | ⛔ Docling + vault |
| Acompanhar | timeline estática, push off | Alerta acionável + baton recurso | ✅ deadline-watch; ⛔ sessão+push |
| Recorrer | strings cravadas | Go/no-go + minuta | ✅ recorrido/preclusão; ⛔ docs+RAG |
| Mesa | inexistente | Lista do dia priorizada | ✅ agrega |
| Governança | misturada no fluxo | Status isolado + dono | ✅ já real |

**Honestidade:** entrega valor real JÁ em Monitorar/Analisar/Mesa/Governança (dado PNCP grounded). As duas dores caras — Habilitar (Docling+vault) e Acompanhar (sessão+push, DOR#1) — exigem fonte/infra nova, ficam atrás de flag com `gap` visível. Persistência (PR4) transforma demo em ferramenta de equipe.

## STATUS — PR 1 (separação) FEITO 29/Mai

✅ God-component `app/page.tsx` (~650 linhas) quebrado em **shell de abas + 1 componente por área**:
`components/shell/{tabs.ts,Rail.tsx,LifecycleBreadcrumb.tsx,bits.tsx}` + `components/{mesa,monitorar,analisar,habilitar,acompanhar,recorrer,governanca}/*Tab.tsx`. Rail com 2 grupos (Operação/Config) + badges (Acompanhar com ⚡ urgente). Breadcrumb de lifecycle nas abas de detalhe. `?op` shared via estado do shell (DB fica pro PR4).
✅ **Build + typecheck + 22 testes verdes.** Render confirmado (HTTP 200): 7 abas, Mesa abre com "Trabalho do dia" priorizado.
✅ Slice 0 (actionability) também entrou: `noyce-operational.ts` (`buildNextStep`/`describeLacuna`/`legalDecisionAction`) + testes.
🟡 Rota duplicada `app/analysis-runs.json/route.ts` mantida por ora (cleanup trivial). Migração para rotas reais (App Router por aba) = refinamento futuro; hoje é tab-switch client.

## STATUS — PR 2 (Monitorar + Mesa ao vivo) FEITO 29/Mai

✅ **Discovery real do PNCP:** `scripts/noyce/build-discovery-snapshot.js` puxa contratações (modalidade 4+6) de 9 municípios do cluster (GO ≤170km + DF) via `/contratacoes/publicacao` (endpoint estável) → **593 editais reais** (Águas Lindas 43, Brasília 300, Anápolis 74, Goiânia 156, Pirenópolis 20; 11 queries falharam por instabilidade). Enxugado p/ 150 recentes em `apps/noyce/lib/data/discovery-snapshot.json` (full gitignored).
✅ **App sourced do dado real:** `noyce-data.ts` deixou de usar 4 fixtures hardcoded — agora deriva as oportunidades do discovery snapshot (top 80 por triagem), enriquecidas (analysisRun + market via CNPJ do órgão + legalProcess sintético) + **triagem**.
✅ **Triagem Vai/Olha/Pula:** `buildTriage` em `noyce-operational.ts` (obras-relevância + raio + valor + prazo → verdict + razão; nunca deriva de score). Monitorar mostra badge+razão+filtro por verdict+contadores; Mesa mostra a fila do dia (drop Pula, Vai primeiro, cap 12). Teste `noyce-triage.test.mjs`.
✅ **Build + typecheck + 28 testes verdes.**
🟡 Raio completo 500km (444 municípios via IBGE haversine) = follow-up; hoje cluster GO real. Mercado real só p/ os 5 órgãos do competitor-snapshot; demais órgãos → market null (honesto). Lifecycle ainda não persiste (PR4).

⬜ **Próximo:** Analisar (veredito vai/não-vai + 5 frases sobre o snapshot — PR3) · PR4 persistência DB do `Lifecycle` · Habilitar (Docling+vault) · Acompanhar (sessão+push, dor#1) · Recorrer (RAG) · expandir raio/competitor coverage.

---
*Design por workflow de 7 agentes (Orion/aios-master). Full report: `tasks/wd80zl49b`. Supersede a abordagem de micro-fix do Slice 0 — separação estrutural primeiro.*
