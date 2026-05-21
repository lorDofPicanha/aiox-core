---
name: project-buscador-workflow-v3-18mai
description: "Buscador-Licitacoes v3 — workflow real 6 estágios + base, correção 4→3 empresas, MOAT redefinido pós-mega-research, modelo workflow-as-a-service R$30-42k/ano por cliente. Substitui session_buscador_expansion_18mai.md."
metadata: 
  node_type: memory
  type: project
  originSessionId: 68a3d76b-c640-4fbc-be2b-a6a40d1b73fb
---

🟢 **SESSÃO 18/Mai noite — workflow real + mega research + pricing model**

**Substitui** [[session_buscador_expansion_18mai]] (briefing v2 estava errado em 2 pontos críticos).

---

## CORREÇÕES MATERIAIS do briefing v2

**1. SÃO 3 EMPRESAS, NÃO 4.** O briefing v2 listou INYAC/INC/CENTINELA/ENHAC. Realidade: **3 empresas, apenas 1 faz licitação pública**. As outras 2 são gestão financeira. Anti-conluio Lei 14.133 art. 14 IV **cai de severidade** (era pilar central do v2, agora é nota de rodapé).

**2. MOAT v2 estava parcialmente fechado.** Briefing v2 dizia "ninguém faz análise histórica 6m do mesmo órgão". **Falso** — Effecti, ConLicitação e LicitaGov já entregam isso desde 2024 como dashboards descritivos. **Moat real redefinido em 3 camadas:**
  - (a) Síntese **prescritiva** 5-frases (preço/diferencial/concorrente/risco/timing) — janela 6-18m
  - (b) **Backstage integration** (livro caixa + ACT vault + RLS multi-CNPJ) — janela 3-5 anos
  - (c) Verticalização regional DF + relacionamento longo prazo

---

## WORKFLOW REAL (corrigido)

**6 estágios + 1 base. Stages 2+3 são o moat.**

```
BASE: Livro caixa 3 empresas (Pluggy + categorização IA + auto-BP/DRE)
   ↓ alimenta
1. MONITORAR — PNCP+DF+AL 24/7, push WhatsApp <15min
2. ANALISAR 6M — histórico do mesmo órgão (MOAT)
3. INDICAR DIFERENCIAL — 5 frases acionáveis (MOAT)
4. HABILITAR — dossiê <30min (ACT matcher + Auto-BP/DRE + CRF/CND)
5. ACOMPANHAR — vencedor declarado → docs baixados <3min
6. RECORRER — minuta jurídica <8min (template + RAG Lei 14.133/TCU)
```

**Why:** o workflow v2 enfatizava livro caixa como pilar; **o real é vice-versa** — licitação é o core, livro caixa é fundação que alimenta Stage 4.

**How to apply:** sempre que retomar o projeto, partir do workflow 6+base, não da metáfora "Holding Virtual". Anti-conluio só aparece se outras 2 empresas do grupo tentarem entrar em edital — não é o problema diário.

---

## SURPRESAS DA MEGA RESEARCH (6 agents × 3-5 mind clones cada)

**Why importantes:** mudam decisões arquiteturais e sequenciamento de sprints.

1. **OCDS já normalizado no BR** ([data.open-contracting.org/en/publication/157](https://data.open-contracting.org/en/publication/157)) — 563 estados + 1267 municípios via JSON normalizado, atualização diária. **Stage 2 (análise histórica) pode rodar em paralelo com Stage 1, não sequencial.** OCDS Kit (BSD-3) consume direto. Achado pela general-purpose agent.

2. **Pai (60+) é maior risco UX.** PWA + push + Pluggy OAuth + LGPD + categorização contábil = 5 conceitos novos em 72h. **WhatsApp Bot precisa cobrir 100% comandos do pai desde Sprint 1**, não Sprint 6 (briefing v2 errado). Achado por Uma/ux.

3. **Marker é GPL-3** (PDF parsing) → contamina SaaS comercial. **Docling (IBM, MIT)** é a escolha segura. Também: PyMuPDF AGPL-3, jina-embeddings-v3 CC-BY-NC. Achado por Aria/architect + general-purpose.

4. **Stack OSS final destravada:**
   - PDF: Docling (MIT) + pdf-lib (MIT) + LlamaParse premium fallback
   - Embeddings: `rufimelo/Legal-BERTimbau-large-v2` (MIT) state-of-art PT-BR jurídico, self-host R$0 marginal
   - Vector: pgvector dentro do Supabase (não Qdrant/Weaviate)
   - Validação CNPJ alfanumérico (RFB jul/2026): `carvalhoviniciusluiz/cpf-cnpj-validator` (MIT)
   - Pattern absorvido: Querido Diário (okfn-brasil) — spider-por-fonte
   - Endpoints PNCP+RFB validados: Licinexus MCP

5. **PNCP não tem webhooks** — só polling. Gap real está entre publicação DODF/DOE-GO (D+0 manhã) e indexação PNCP (D+1 a D+2). **Pipeline híbrido PNCP + Querido Diário obrigatório.**

6. **Pluggy é o único viável no orçamento** — Belvo USD 500/mês mínimo, Klavi enterprise, BTG só se já é correntista. **R$ 6-24/conexão.** OFX manual upload como fallback obrigatório.

---

## CUSTO DE INFRAESTRUTURA (real)

| Fase | Clientes | Custo infra/mês | Custo infra/ano |
|---|---|---|---|
| 1 — Piloto | 1 (case-âncora) | R$ 80-220 | R$ 1-2.7k |
| 2 — Beta | 5 pagantes | R$ 700-900 | R$ 8.4-10.8k |
| 3 — Escala regional | 50 | R$ 4.500-6.000 | R$ 54-72k |

**Os 3 vilões de custo:** Pluggy (escala linear), LLM (escala linear), Supabase Pro quando passa free tier.

**Tudo o resto cabe em free tier:** Vercel Hobby, Inngest Free, Resend Free, Sentry Free, Docling self-host, Legal-BERTimbau local, WhatsApp 1k conversations grátis.

---

## PRICING MODEL — NÃO É SAAS, É WORKFLOW-AS-A-SERVICE

**Insight central (correção do user):** o projeto não é SaaS, é serviço gerenciado. Breno opera. Cliente paga pelo resultado.

### Custo manual escondido do cliente (Cenário A, ~80% do mercado):

```
Plataforma Effecti              R$    4.800/ano  ← o que ele VÊ
Tempo do sócio (80h/mês)        R$  240.000/ano  ← invisível
Editais perdidos por CRF        R$   60.000/ano  ← invisível
Recursos perdidos preclusão     R$   90.000/ano  ← invisível
Erros habilitação               R$   20.000/ano  ← invisível
─────────────────────────────────────────────
TOTAL REAL                      R$  414.800/ano
```

### Sweet spot de cobrança (5-15% do valor entregue):

| Tier | Mensal | Anual | ROI cliente |
|---|---|---|---|
| Starter | R$ 1.500 | R$ 18k | 23× |
| **Pro** | **R$ 2.800** | **R$ 33.6k** | **12×** |
| Enterprise | R$ 4.500+ | R$ 54k+ | 7× |

**Recomendação:** **Pro tier R$ 2.800/mês = R$ 33.600/ano.** Cliente economiza R$ 381k, ROI 12×.

### Margem para Breno (com 5 clientes pagantes):

```
Receita 5 × R$ 30-40k    R$ 150-200k/ano
Infra Fase 2             R$  10k/ano
Tempo de operação        R$  25k/ano (estimado)
────────────────────────────────────
MARGEM LÍQUIDA           R$ 115-165k/ano
```

**Why:** Em 12 meses isso vira projeto principal, não back-burner. Modelo Hormozi (cobrar % do valor entregue) + Lemkin (B2B sub-$500 ARR precisa 3 refs pagantes) + AIOX (workflow vendável > cargo velho).

**How to apply:** quando virar deck para call do amigo, **não pitch "compre meu software"** — pitch "contrata meu serviço gerenciado". Setup grátis pra case-âncora, primeiro pagante (indicação) entra mês 4.

---

## SKILL @slide-creator USADA

External slide-creator skill ([[project_slide_creator_skill_18mai]]) foi instalada como @slide-creator (persona Sloan). **Funcionou** na geração do deck v1 (84.5 QA score) e do deck v2 AIOX (HTML real). Bundle ainda nested em `.claude/skills/slide-creator/slide-creator/` — flatten manual pendente.

**Why:** o decision tree explícito + block_if + pick_when/skip_when funcionaram. Aplicou as 10 lições arquiteturais do slide-creator pra forçar narrativa-primeiro em vez de outline-dump.

---

## ARTEFATOS GERADOS HOJE (todos em disco)

```
docs/projects/buscador-licitacoes/
├── 04-deck-diagnostico-amigo/
│   ├── deck.html               ← DECK AIOX VISUAL (13 slides 16:9)
│   ├── deck-spec.yaml          ← 12 slides full spec
│   ├── speaker-notes.md        ← 45min de fala
│   ├── source-ledger.yaml      ← 21 claims rastreáveis
│   ├── qa-report.yaml          ← score 84.5
│   └── + 12 outros yamls/md    ← pacote completo
└── 05-mega-research/           ← 183 KB
    ├── 01-data-portais-base.md (24KB · Dara/data-engineer)
    ├── 02-architect-pdf-act-recurso.md (29KB · Aria/architect)
    ├── 03-analyst-moat-mercado.md (39KB · Alex/analyst)
    ├── 04-ux-mobile-bot.md (28KB · Uma/ux)
    ├── 05-pm-roadmap-business.md (14KB · Morgan/pm)
    └── 06-oss-landscape.md (49KB · general-purpose)
```

**Mind clones canalizados (25):** Pablo Hoffman, Kleppmann, Cavoukian, Pahlka, Fowler, Vogels, Chip Huyen, Justen Filho, Cassie Kozyrkov, April Dunford, Wes Bush, Damodaran, Don Norman, Cathy Pearl, Julie Zhuo, Kat Holmes, Rams, Ries, Lemkin, Cagan, Alan Nicolas, Hormozi, Heather Meeker, Linus, Hashimoto.

---

## GATES & DECISÕES PENDENTES

### Kill gates (Cassie Kozyrkov methodology):
- **Pré-Sprint 4** — Eval offline retroativo: rodar Stage 2+3 contra últimos 6 meses do cliente. Se MAPE preço >15% OU hit-rate vencedor <50% → KILL ou PIVOT.
- **Pós-M3 (Sprint 3 fim, semana 10)** — Se cliente classifica <60% dos alertas como "úteis" → filtros errados, refazer.
- **Pós-M1 (semana 4)** — Se pai abandonou app na semana 2 → WhatsApp Bot vira produto principal.

### Decisões para o Breno antes do Sprint 0:
1. **B3 pricing** — Opção D (case-âncora grátis + indicação obrigatória de 3 pagantes mês 4+) recomendada pelo Morgan/PM.
2. **Sprint sequencing** — devido OCDS, antecipar Stage 2 para Sprint 1 (paralelo a Stage 1).
3. **WhatsApp Bot prioritário** — Sprint 1, não Sprint 6.
4. **Stack OSS confirmada** — Docling + Legal-BERTimbau + pgvector + Pluggy + OFX fallback.

---

## TRIGGERS PARA RETOMAR

- `continua buscador workflow` → carrega este memory + workflow real
- `revisa briefing v3` → gera novo BRIEFING-REAL-CONSOLIDADO.md com correções
- `atualiza deck` → regenera deck.html com pricing model novo (workflow-as-a-service)
- `agendar call amigo` → prepara material de discovery
- `pergunta agent N` → SendMessage a um dos 6 agents (agentIds salvos: data-eng a66b8c, architect a579d7, analyst a59998, ux a2ccf7, pm ab4afe, oss a02563)
- `vai com sprint 0 buscador` → dispara discovery + schema design
- `kill buscador` → arquiva, supersede triggers acima

---

**Próxima ação esperada do Breno:**
1. Validar workflow real (6 estágios + base) — está como ele entende?
2. Confirmar pricing model (R$ 2.800/mês Pro tier)
3. Decidir flatten manual da skill `.claude/skills/slide-creator/`
4. Marcar call discovery com amigo (objetivo: validar dor + responder Bloco C reduzido para 6 perguntas)

Related: [[project_slide_creator_skill_18mai]] (skill que gerou o deck), [[session_buscador_expansion_18mai]] (briefing v2, SUPERSEDED por este).
