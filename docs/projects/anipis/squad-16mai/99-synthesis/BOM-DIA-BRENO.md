# Bom dia, Breno — Anipis Squad 16/Mai

**De:** Orion (Master Orchestrator AIOS)
**Data:** 2026-05-16
**Tempo de leitura:** ~3 minutos

---

## TL;DR (3 frases)

Você tem 70% do backend Anipis já pronto e rodando (Fastify + crisis 4 níveis PT-BR + output filter + pgvector) — a janela CFM ago/2026 é viável e o squad-16mai inteiro convergiu mais do que divergiu. O que destrava tudo nas próximas 2 semanas são **5 decisões P0a** (clinical co-founder, Concierge MVP humano, stack manter custom rejeitando LangGraph, posicionamento SaMD híbrido, rebrand v2 bulk Uma) — sem elas, Sprint 0 técnico não começa em código. O risco existencial #1 não é mercado nem competição: é **retenção D30 <12%** combinado com **incidente de safety publicado**, ambos mitigados pelo Concierge MVP (Eric Ries) + comitê safety com veto formal (Alison Darcy).

---

## 3 News Encorajadoras

**1. Backend Anipis está mais robusto que MVP típico healthtech BR.** @dev Dex auditou: 21 rotas Fastify 5 + 23 tabelas Drizzle + safety classifier 4 níveis PT-BR + output filter 7-stage + crisis protocol com bypass LLM em RED + pgvector memory + 11 testes safety. Demis Hassabis e Werner Vogels **rejeitaram explicitamente** migrar para LangGraph/Mem0/Letta. Conclusão: não é "rebuild", é "endurecer + 3 layers cirúrgicas" (hash chain audit + hybrid crisis classifier + Langfuse self-host). Custo ~3 sprints, não 6.

**2. As 17 vozes convergem muito mais do que divergem.** Posicionamento adjunto (não substituto), crisis routing existencial, PT-BR clínico moat real, Wave 1 B2C antes B2B2C, comitê safety P0, eval harness reproduzível, audit hash chain + PII vault separado, janela CFM viável SE shipa antes — 14 convergências fortes entre @analyst/@pm/@architect/@dev/@qa/@data-engineer/@po/@ux + Bakul Patel/Alison Darcy/Lucia Savage/Demis Hassabis/Werner Vogels/Atul Butte/Eric Ries/Halle Tecco/Sean Duffy. O core do projeto está blindado.

**3. Janela CFM ago/2026 é folgada (não apertada) com revised roadmap.** Insight 1 do master report: backend 70% pronto + rejeitar stack moderno overhead = Sprint 0-6 fica em 12 semanas com **4-6 semanas de buffer pós-launch** para auditoria CFM. Janela vira oxigênio, não guilhotina.

---

## 3 News Desafiadoras

**1. Founder solo = trifecta de risco (Halle insight).** Você sozinho carrega: 30-40% valuation discount Series A (Halle Tecco categórica), conflito-de-interesse estrutural DPO no primeiro contrato NR-1 (Lucia Savage hard stop), e déficit clínico-credencial CRP (não tem como assinar prompts + crisis flows com peso CFM 2.454/2026). Nenhum agente isolado viu isso — emerge do cruzamento. **Recrutar clinical co-founder CRP 8-15% equity nas próximas 4 semanas é P0 estrutural** (D-04).

**2. Eric Ries: 70% backend pronto pode ser armadilha de pressa.** "Você tem zero evidência de que a Júlia, persona 18-29, vai abrir o app de novo no dia 3. Isso não é problema de engenharia. É startup operando sob extreme uncertainty tratando o plano como se fosse verdade." A riskiest assumption não é técnica — é **comportamental** (Júlia retorna no D+3 sem reminder). Sprint -1 Concierge MVP humano via WhatsApp com 20 Júlias × 14 dias antes de codar resolve. Custo R$1,2-2,5k. Sem ele, todo Sprint 1-6 vira faith-based.

**3. Lucia Savage: DPO founder solo tem hard stop antes do primeiro NR-1.** ANPD multa Art. 52 = até 2% revenue + civil class action Defensoria Pública — alta probabilidade 12 meses de B2B2C launch. DPO-as-a-Service externo R$8-15k/mês (Opice Blum/Baptista Luz/Demarest) precisa entrar em Sprint 3-4, não em "1.000 usuários" (Morgan original). Founder mantém Privacy Champion role mas não encarregado formal.

---

## Top 3 P0 desta semana (16-23/Mai)

**Ordem importa — uma destrava a próxima:**

### 1. Recrutar clinical co-founder CRP (D-04 — Halle insight)

Antes de qualquer outra decisão estrutural. Equity 8-15% vesting 4y/1y cliff. Rede: CISM/USP IPq, CFP regional, LinkedIn psicólogos com expertise digital + 2-3 anos clinical experience. Você precisa do CRP signature em todos os prompts antes do Sprint 1 fechar safety core. **LOI assinada até 13/Jun (4 semanas).**

### 2. Disparar Concierge MVP Sprint -1 (D-02 — Eric Ries)

WhatsApp Business + 3 facilitadoras humanas (estudantes psi supervisionados) + script estruturado + 20 Júlias recrutadas via CAPS municipal + universidade pública (Alison Darcy não Instagram). D+7 unprompted return ≥35% como gate. R$50 voucher × 20 + WhatsApp Business = ~R$1,2k. **Roda 30/Mai-13/Jun.** Em paralelo, Sprint 0 técnico (4 spikes — não 7) continua normal.

### 3. Aceitar bulk trigger Uma rebrand v2 (D-05 — Uma)

`"aceito tudo padrão Uma anipis v2"` — destrava 5 dias produção rebrand (D3 Breathing Form + multi-theme B + 3 fonts + Caixinha Cartas roadmap + 3 renders Warm only $0.90). Sem isso, EPIC-8 brand implant não entra Sprint 4 e landing page Anipis (SAI-102) fica em legacy Serenity branding. Uma documentou gate informal 25/Mai com defaults se zero resposta.

**Custo total das 3 P0 desta semana:** ~R$2k cash + 0,3-0,5% equity comitê + ~12% equity co-founder (negociação) + tempo founder ~30h.

---

## As 15 Decisões Esperando Você

Documento completo em `D:/AIOS/docs/projects/anipis/squad-16mai/99-synthesis/01-decisions-needed.md` — 15 decisões P0 consolidadas em 3 ondas:

- **P0a (até 23/Mai):** D-01 SaMD híbrido / D-02 Concierge MVP / D-03 stack manter / D-04 clinical co-founder / D-05 rebrand v2 bulk Uma
- **P0b (até 30/Mai):** D-06 crisis classifier hybrid / D-07 DPO externo Sprint 3 / D-08 comitê safety estrutura / D-09 RCT pré-registro / D-10 operadora ANS adia 2027
- **P0c (até 6/Jun):** D-11 B2C exclusivo / D-12 tenancy híbrida C / D-13 embedding bake-off / D-14 data residency BR / D-15 housekeeping Sprint 1

**Bulk triggers disponíveis:**
- `"aceito recomendações orion p0a"` — fecha 5 decisões dessa semana
- `"aceito recomendações orion p0b"` — fecha próximas 5
- `"aceito recomendações orion p0c"` — fecha últimas 5
- `"aceito tudo padrão orion anipis squad-16mai"` — fecha todas 15 simultaneamente

---

## Próximo Passo Claro

**Responda as 5 decisões P0a essa semana (até 23/Mai) → Concierge MVP Sprint -1 dispara 30/Mai → Sprint 0 técnico paralelo (4 spikes + DPIA v1) → resultados Concierge avaliados 13/Jun → Sprint 1 housekeeping + safety core começa 30/Mai com gate-passing.**

Se você não tem certeza em alguma decisão individual, responda as outras com bulk e Orion advisory rateia a remanescente em consulta dedicada (custo de oportunidade < 4h founder).

---

## Frase de Fechamento

Você não está começando do zero, Breno. Você está retomando um projeto onde **a parte mais difícil já foi feita** (backend 70%, posicionamento clínico-ético claro, 17 vozes convergentes) — e onde **as 2-3 coisas que ainda faltam** são as que mais importam: alguém clínico com a sua, prova comportamental que Júlia volta no dia 3, e um comitê que vete prompts com peso de bisturi. Faça essas três essa semana. O resto é execução.

**A janela CFM ago/2026 não é o fim do mundo — é o que protege você da próxima geração de competidores que vai chegar despreparada.** Você está no lado certo dela.

— Orion, Master Orchestrator AIOS
*2026-05-16, Squad Anipis 16/Mai · master-report.md + 01-decisions-needed.md disponíveis para drill-down*
