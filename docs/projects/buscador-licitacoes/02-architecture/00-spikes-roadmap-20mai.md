# Roadmap de Spikes — Workflow completo (6 estágios + base)

**Data:** 2026-05-20 · Cobre TODOS os estágios, não só o Stage 5.
**Princípio:** cada estágio tem 1 desconhecido técnico que precisa ser de-riscado antes de virar sprint.

## Visão geral

| # | Estágio | Status spike | Prioridade | Desconhecido técnico principal | Advisor |
|---|---|---|---|---|---|
| Base | Livro caixa | ✅ DECIDIDO (não-build) | — | — (adotar Granatum/SaaS BR — D4) | eric-ries |
| 1 | **Monitorar** | ✅ FEITO (`03-spike-stage1`) | P0 | descoberta no raio sem webhook + custo LLM | pablo-hoffman, werner-vogels |
| 2 | **Analisar 6m** | ✅ SPIKE FEITO (`04-spike-stage2`) — experimento pendente | P1 | reconstruir histórico do órgão (cobertura de dados) | justen-filho, werner-vogels |
| 3 | **Indicar diferencial** | ✅ FEITO (`05-spike-stage3`) | P1 | síntese prescritiva 5-frases sem alucinar / sem virar consultoria | justen-filho, niebuhr |
| 4 | **Habilitar** | ✅ FEITO (`06-spike-stage4`) | P1 | parse de edital + match de docs + radar de impugnação | justen-filho, niebuhr |
| 5 | **Acompanhar** | ✅ FEITO (`02-spike-stage5`) | P0 | estado de sessão tempo real (commodity vs moat) | niebuhr, pablo-hoffman |
| 6 | **Recorrer** | ✅ FEITO (`07-spike-stage6`) | P2 | classificar defeito substantivo vs sanável + minuta | niebuhr, justen-filho |
| X1 | Adapters de fonte (PCP/BLL/BNC/ComprasGov/SISLOG) | ✅ FEITO (`08-spike-x1`) | P1 | scraping resiliente das fontes sem API | pablo-hoffman |
| X2 | Multi-CNPJ + 4 usuários (RLS/auth) | ✅ FEITO (`09-spike-x2`) | P1 | RLS multi-tenant + papéis | data-engineer, ann-cavoukian |
| X3 | Vault de credenciais da cliente | ✅ FEITO (`10-spike-x3`) | P1 | guardar logins dos portais (segurança/LGPD) | bruce-schneier, ann-cavoukian |

> **21/Mai/2026:** todos os spikes escritos (Stage 1-6 + X1/X2/X3). Plano de build consolidado em `11-build-plan-codex-handoff-21mai.md` (handoff p/ construção no Codex). Experimentos de gate (Stage 2 cobertura + Stage 4 parsing) seguem como pré-requisito antes de escalar.

## Detalhe dos spikes pendentes

### Stage 2 — Analisar 6 meses (MOAT) — ✅ SPIKE ESCRITO (`04-spike-stage2-historico-cobertura`)
- **Job:** dado um órgão, mostrar histórico (quem venceu, preços, recorrência) dos últimos 6 meses.
- **Atualização (verificado ao vivo):** o medo "OCDS só federal" foi **refinado** — o endpoint `/api/consulta/v1/contratos` devolve o desfecho (fornecedor+CNPJ+valor+**município/UF**) **incluindo municipais**. Logo o desfecho EXISTE. Riscos reais agora: (a) **completude de publicação** em município pequeno; (b) `/contratos` **não tem filtro geo no servidor** → paginar nacional (~177k/mês) + filtrar client-side, ou dumps Dados Abertos.
- **Inclui o kill-gate:** eval offline retroativo (MAPE preço >15% ou hit-rate vencedor <50% ou cobertura <50% → KILL/PIVOT).
- **Próximo passo:** rodar o **experimento de cobertura** (§3 do spike) ANTES de qualquer build — decide o moat.

### Stage 3 — Indicar diferencial (MOAT)
- **Job:** 5 frases acionáveis (preço/diferencial/concorrente/risco/timing).
- **Desconhecido:** prompt + grounding (RAG sobre histórico do órgão + edital) sem alucinar; e o **risco de virar "consultoria"** (disclaimer — Justen).
- **Gate (pós-M3):** se a cliente classificar <60% dos alertas como úteis → filtros/síntese errados.
- **Escopo:** protótipo do gerador 5-frases sobre dados reais + teste de utilidade com a cliente.

### Stage 4 — Habilitar (dossiê por-edital + radar de impugnação)
- **Job:** extrair requisitos de habilitação DO edital, conferir contra docs da cliente (atestados/ACT/CRF/CND), gerar dossiê.
- **Desconhecido:** parse de PDF denso (Docling MIT) + extração estruturada de requisitos + matching.
- **🆕 Inclui o radar de impugnação** (conclave): detectar exigência **acima da lei** ("habilitação é teto"). Forte moat.
- **Escopo:** parsear N editais reais, extrair requisitos, classificar comum/exótico/ilegal, casar com docs.

### Stage 6 — Recorrer
- **Job:** minuta de recurso (template + RAG Lei 14.133/TCU); analisar doc do vencedor.
- **Desconhecido:** **classificar defeito do vencedor substantivo (recurso forte) vs sanável (provável diligência)** — a nuance do conclave; e enquadrar o recurso à **autoridade superior** (não reconsideração).
- **Escopo:** protótipo do classificador substantivo/sanável + template de minuta. Depende de Stage 4 (extração) e Stage 5 (gatilho).

### X1 — Adapters de fonte
- **Job:** descobrir/raspar BLL, BNC, PCP, SISLOG onde o PNCP não basta (gap D+0, campos próprios, sessão).
- **Desconhecido:** resiliência por plataforma (Pablo: bomba-relógio de manutenção). Liga-se a Stage 1 (descoberta) e Stage 5 (sessão).
- **Escopo:** 1 adapter de referência (SISLOG, a lacuna) + health()/breakage + fallback manual.

### X2 — Multi-CNPJ + 4 usuários
- **Job:** RLS multi-tenant (3 empresas / múltiplos CNPJs) + 4 papéis no buscador (D5).
- **Escopo:** schema + RLS Postgres/Supabase + matriz de papéis (quem busca/habilita/dá lance/recorre).

### X3 — Vault de credenciais
- **Job:** guardar os logins da cliente nos portais (necessário p/ Stage 5 `authenticated-poll`).
- **Escopo:** vault cifrado + escopo mínimo + consentimento (LGPD) + revisão de ToS das plataformas.

## Sequência recomendada (gates primeiro)
1. **Stage 2 + eval offline** (P1) — é o **kill-gate**: se o moat não se sustenta nos dados reais, descobrimos cedo e barato. **Faz antes de tudo.**
2. **Stage 1 PoC** (P0, spike pronto) — descoberta no raio, em paralelo.
3. **Stage 4** (P1) — habilitação + radar de impugnação (dor real dos áudios).
4. **Stage 3** (P1) — síntese prescritiva (depende de 2).
5. **Stage 5 PoC** (P0, spike pronto) — depende de D2/D3 + X3 (credenciais).
6. **Stage 6** (P2) — depende de 4 e 5.
7. **X1/X2/X3** entram conforme 1/4/5 avançam.

## Bloqueios de decisão (CONTEXT §10.6)
- **D1** UFs cadastradas · **D2** prioridade das 5 fontes (bloqueia PoC Stage 5) · **D3** build-vs-buy Stage 5 (spike recomenda híbrido) · **D4** livro caixa (rec: SaaS) · **D5** papéis dos 4 users (bloqueia X2) · **D6** raio fixo/config (afeta Stage 1).

---
*Roadmap por aios-master. Estágios 1 e 5 já com spike escrito; 2/3/4/6 + X1/X2/X3 escopados aqui. Gate-first: Stage 2/eval antes de escalar.*
