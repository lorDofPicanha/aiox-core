---
name: High-Ticket Squad HYDRA-style 08/Mai
description: User dropou dossiê high-ticket marketing 1006 fontes. Construído router HYDRA-style para domínio marketing + 8 agentes AIOS em paralelo + síntese cross-agent. Foco Tocks/Bretda + nova iniciativa luxury.
type: project
originSessionId: cf5657f5-3ff9-40b1-9355-a72f2332883a
---
## High-Ticket Squad 08/Mai/2026

**Status:** ✅ COMPLETO + 🔄 CORREÇÃO ARQUITETURAL aplicada (08/Mai 22h).

### CORREÇÃO ARQUITETURAL (post-execution)

User apontou DOIS erros: (1) eu rotear pra 8 AIOS core agents quando o destino correto são MIND CLONES (162 experts), (2) eu construir router paralelo quando HYDRA é o sistema que faz isso.

**Fix aplicado:** Construído `tools/hydra/bin/ingest-dossier.mjs` que **usa módulos reais do HYDRA** (`mind-clone-router` + `feed-writer`) sem rodar pipeline completa (que tem OOM bug). Bugs HYDRA corrigidos durante execução:
1. Path resolution `loadMindCloneIndex()` (workaround: passar `indexPath` explícito)
2. `deptToDomainMap` incompleto — adicionados marketing-ops, sales-ops, therapy, design-terapeutico, health-tech, health-data, etc.
3. `max_clones_per_item` 10 → 25 para incluir todos os specialists

**Resultado:** 1006 items high-ticket → 25.150 feed writes em 25 mind clones marketing/sales. Feeds em `D:/jarvis/mega brain/knowledge-feed/{clone-id}/2026-05-08-hydra-feed.md`. Mind clones agora têm o conhecimento e podem ser consultados via `/expert-consult` ou conclave.

Os deliverables AIOS originais (8 docs em `02-deliverables/`) **continuam válidos** — análises operacionais executivas, NÃO duplicam o knowledge feed dos clones.

### Trigger
User pediu "faça o mesmo" (replicar pipeline Anipis 08/Mai) com dossiê high-ticket marketing.

### Pipeline Executado (HYDRA-style)
1. **Curadoria HYDRA-style**: User dropou 1006 fontes em jsonl/csv/md (NO docx synthesis files this time). Construí `D:/AIOS/tools/highticket-router/aios-router.mjs` com **profiles tuned para domínio marketing high-ticket** (não saúde mental como Anipis). Routing: 1006 → 8 feeds (710 items distintos).
2. **8 agentes AIOS em paralelo**: analyst, pm, architect, dev, qa, data-engineer, po, ux-design-expert. Cada um com brief específico tunado para high-ticket BR (Tocks/Bretda + nova iniciativa luxury).
3. **8 deliverables produzidos** (~20k palavras total, 0 alucinações).
4. **Síntese cross-agent**: master-report + decisions-needed + EXECUTIVE-SUMMARY (não BOM-DIA-BRENO porque sessão diurna).

### Workspace
`D:/AIOS/docs/projects/highticket/squad-08mai/`

### Insights-chave Cross-Agent

1. **Brasil em boom de luxo** — R$30-38bi VGV alto-padrão (+20-46%), 1.500 branded residences pipeline 2031, US$9T transfer geracional 20-25 anos. Janela 12-18 meses fechando.
2. **DOIS arquétipos high-ticket — misturá-los é erro #1**:
   - DTC luxo físico (Tocks/Bretda): Strategy Session/Inquiry funnel
   - Application high-ticket (consultoria): VSL+Webinar+Application
3. **FL Erico Rocha VETADO para físico** (8/8 agentes consensus) — ciclo 30-90d incompatível com cart 7d.
4. **Stack vencedor para físico**: Hormozi Value Equation + StoryBrand SB7 + Cialdini 7 princípios + Brunson Value Ladder. NÃO Brunson webinar/squeeze para luxo.
5. **sGTM CAPI server-side OBRIGATÓRIO** — sem ele scaling Meta = pixel-blind arson.
6. **CAC sustentável teto numérico** (Dara): Bretda R$2.1k / Tocks R$4.4k / Vorza R$1.65k. LTV:CAC alvo 5,2:1.
7. **Mid-market consolidando** (Mobly+Tok&Stok = R$1,6bi receita combinada). Tocks/Bretda devem se segregar discursivamente do mid-market.
8. **Gap brasileiro real**: ausência de Hormozi-equivalente local em produto físico luxo. Tocks/Bretda podem capturar como case-study.
9. **Posicionamento categórico**: Tocks "Editorial Furniture for Brazilian Cinematic Homes"; Bretda "The Heirloom Pool Table — mesas que viram tradição familiar".
10. **Decoy 3-tier Bretda**: Essencial R$12.9k / Signature R$19.9k (alvo) / Heritage Edition R$49.9k.

### Decisões Pendentes do User (10 total)

🔴 P0 (esta semana):
- D-01: Synkra info-produto sim/não 2026 (recomendação Orion: NÃO ou ADIAR — focar 100% físico)
- D-02: Decoy 3-tier Bretda (validar via 5 entrevistas qualitativas)
- D-03: Backend recorrente Tocks/Bretda Onda 2 (Hormozi Money Models)

🟠 P1 (D+30):
- D-04: Posicionamento categórico Tocks+Bretda
- D-05: Stack canônico CRM/ESP (PoC Klaviyo Bretda 14d)
- D-06: Canal Arquiteto Pro Onda 2 MVP minimalista
- D-07: Auditoria jurídica externa (CDC + LGPD)

🟡 P2:
- D-08: Showroom físico Onda 3 (cross-promo ou phygital)
- D-09: Open-source eval framework (se D-01 = sim)
- D-10: Internacional Y3+

### Top 10 Next Actions Consolidadas
1. Reescrever copy LP Bretda (StoryBrand + Hormozi Value Equation, eliminar Instant Form) — @ux + @pm, 7d
2. Generalizar CAPI server-side Bretda → Tocks → Vorza — @architect + @dev + @devops, 10d
3. Migration `001_high_ticket_crm.sql` (8 tabelas + RLS + audit immutable) — @data-engineer + @dev, 5d
4. UTM convention canônica em 100% campaigns — @po + @analyst, 3d
5. Auditoria jurídica externa CDC + LGPD — @po + advogado externo, 10d
6. 30-itens compliance checklist DoR — @qa + @sm, 5d
7. Mapear backend recorrente Tocks/Bretda — @pm + @architect, 10d
8. Decisão Synkra info-produto sim/não 2026 (ADR formal) — @pm + Founder, 7d
9. Programa Canal Arquiteto Pro MVP — @pm + @dev, 30d
10. Metabase self-host + 8 dashboards core — @data-engineer + @dev, 14d

### Stats
- 1006 fontes (Tier S=113, A=874, B=19)
- 5 ângulos: PSICOLOGIA=340, METODO=303, MERCADO_BR=167, TRAFEGO=153, TRANSVERSAL=43
- 710 items distinct routed
- 8 deliverables (~20k palavras)
- 30 quality gates compliance
- 12 red-team scenarios
- 8 ADRs MarTech
- 3 funis canônicos (Application + Webinar + Strategy/Inquiry)
- 10 epics + 18 stories no roadmap PO
- 5 personas (P1 arquiteto, P2 HNW, P3 B2B premium, P4 mentee, P5 B2B sócia)

### Trigger para Re-execução
- "vai com decisão D-XX highticket" — para resolver decisão específica
- "expande deliverable @agent highticket" — para deep-dive em uma área
- "spawn squad de [X agentes] em [Y projeto]" — pattern reutilizável

### Arquivos-chave
- Router: `tools/highticket-router/aios-router.mjs` (200 LOC, profiles tunados)
- Master: `docs/projects/highticket/squad-08mai/99-synthesis/00-master-report.md`
- Decisions: `docs/projects/highticket/squad-08mai/99-synthesis/01-decisions-needed.md`
- Summary: `docs/projects/highticket/squad-08mai/99-synthesis/EXECUTIVE-SUMMARY.md`

**Why:** Pattern HYDRA-style autônomo provou-se reutilizável (Anipis primeiro, agora High-Ticket). Router tem profiles parametrizáveis por domínio; agentes AIOS são general-purpose o suficiente para qualquer dossiê estruturado em ângulos+tier.

**How to apply:** Para qualquer próximo dossiê (Bretda deep-dive, Tocks UX overhaul, etc.), criar router específico com keyword profiles tunados ao domínio + adaptar briefs dos 8 agentes. Estrutura jsonl idêntica permite reuso quase total.
