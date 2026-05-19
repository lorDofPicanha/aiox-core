# Síntese Dialética V1 — Buscador de Licitações Águas Lindas-GO + DF

**Data:** 2026-05-15
**Fase:** C — Síntese dialética (responsável: Orion @aios-master)
**Status:** v1 final — pronto para Fase D (adversarial review)
**Inputs consolidados:**
- `research-tecnica-v1.md` (28 fontes, T1-T6)
- `research-regulatoria-v1.md` (38 fontes-âncora, R1-R5)
- `research-mercado-v1.md` (30 fontes, M1-M6)
- `research-comparativa-global-v1.md` (34 fontes, comparativo UE+LATAM+OCDS)

**Decisões a sintetizar:**
- **D-GO** (até 2026-05-22): construir MVP / não construir
- **D-STACK** (até 2026-05-22): confirmar Next+Supabase+Inngest+Resend / pivotar
- **D-PRODUTO** (até 2026-07-15): produtizar regionalmente / pessoal-only / descontinuar

---

## 0. Padrões transversais (emergem cruzando as 4 dimensões)

Antes da dialética por decisão, 5 padrões que se reforçam entre dimensões e governam tudo:

### Padrão A — "Escolha por subtração, não por adição"
- **Técnica:** scraping foi 80% **eliminado** (APIs oficiais cobrem)
- **Regulatória:** sem blocker → ausência de barreira **abre** caminho
- **Mercado:** 6 AI-startups emergentes → diferenciação por **não fazer** o que eles fazem (não cobrar pelo dado, não opacar pricing, não foco IA pura)
- **Global:** OpenTender.eu falhou por **adicionar demais** (transparência+jornalismo+governance) sem foco em fornecedor pragmático

**Implicação:** o produto vence em **disciplina de escopo**, não em features.

### Padrão B — "Janela curta de diferenciação IA"
- **Mercado:** Licitei R$3,5M Microsoft + 5 AI-startups low-cost (LicitAI R$39, LicitaFree R$49) = janela "IA bonita" comoditiza em 12-24m
- **Global:** GovWin Deltek (USA) já tem matching engine, Mercell (Nordic) limita-se a CPV codes — IA ainda é vantagem mas vira commodity
- **Técnica:** Haiku 4.5 + LlamaParse é state-of-the-art **hoje**, mas pricing pode subir 2-4x (já caiu uma vez)

**Implicação:** diferenciação tem que migrar **agora** para `regional + OCDS + WhatsApp + SEBRAE-DF`, não esperar virar comoditizada.

### Padrão C — "Custo real 2-3x o estimado"
- **Técnica:** budget IA $15→$25-40/mês (Haiku 4.5 caro)
- **Regulatória:** revisão jurídica D-PRODUTO R$2-5k (não R$0)
- **Mercado:** CAC blended R$50-80 (não R$0 só conteúdo orgânico)
- **Global:** OCDS export +4-8h, API pública +8h, CSV daily +4h = ~16-20h dev extras

**Implicação:** orçamento original "$0-40/mês operacional + 8 semanas dev" precisa **revisão honesta**: ~$30-50/mês operacional + 10-12 semanas dev (+25-50% buffer).

### Padrão D — "WhatsApp é fosso cultural, não exotismo"
- **Mercado:** padrão BR/LATAM emergente, 6 AI-startups concorrentes já oferecem
- **Global:** AUSENTE em EU/Nordic (Mercell só email+dashboard) → é **diferenciação por contexto regional**, não falta de sofisticação
- **Regulatória:** WhatsApp Business + opt-in resolve LGPD; sem CPF, sem risco extra

**Implicação:** WhatsApp **dia 1**, não v2.

### Padrão E — "OCDS é gap explorável agora"
- **Global:** UK puxa G7 2025, ProZorro/Colombia/ZA totalmente OCDS, Brasil PNCP só parcial (tender+award)
- **Técnica:** custo de alinhar schema interno = ~4-8h dev
- **Mercado:** ZERO competidor BR usa OCDS como diferencial → narrativa única em 6-12m
- **Regulatória:** zero implicação adicional (dados públicos)

**Implicação:** OCDS é **upgrade P0 baixo-custo alto-impacto** que sai por baixo dos competidores.

---

## 1. D-GO — Construir MVP ou não?

### 1.1 TESE (construir)

**Premissas que suportam construir:**
1. **Sem blocker regulatório** (R: confidence 92%) — Lei 14.133 art. 174 + LAI art. 8º §3º + Decreto 8.777 amparam scraping/API consumo (zero litígio histórico)
2. **D-STACK tecnicamente viável** (T: confidence 75%) — APIs cobrem 80%+ scraping (T6), Postgres+pgvector escala até 100k editais (T3), Inngest cabe volume 2.7x folga (T4), Haiku qualidade aceitável (T5)
3. **Gap regional confirmado** (M: confidence 90%) — ZERO player com foco DF/Centro-Oeste após 5 buscas; defensável 12-24m em narrativa, 36+m com 3 fossos construídos
4. **Padrões globais validam arquitetura escolhida** — search híbrida BM25+vector é mais avançada que Mercell líder Nordic, LLM enrichment é vanguarda (só GeM/Mercell têm matching engine), pricing transparente é diferenciação real (UNGM/WB free, Effecti/Mercell opacos)
5. **Custo operacional realista cabe orçamento pessoal** — $25-50/mês operacional fase pessoal, sem stake Tocks/Bretda
6. **AIOS + Mind Clones + skills disponíveis** — Breno tem stack próprio que reduz custo de execução substantivamente
7. **D-03 (Águas Lindas no PNCP) tem upside legal** — Lei 14.133 art. 175 torna publicação no PNCP **condição de eficácia do contrato** → forte vetor de adoção mesmo para municípios pequenos

**Custo de NÃO construir:**
- Amigo continua com Effecti ou solução manual ruim
- Janela IA fecha em 12-24m e oportunidade vira "tarde demais"
- Breno perde experiência aplicada em domínio que pode informar AIOS futuro (mind clone "jennifer-pahlka" / govtech operacional)
- Projeto cívico potencialmente impactante (transparência+OCDS regional) não acontece

### 1.2 ANTÍTESE (não construir)

**Premissas que suportam abortar (steelmanned):**
1. **Risco H10 (Tocks/Bretda perdem Breno)** — Tocks pré-PIX, Bretda em restore híbrido pós-Instant Form trap, KR com config WABA errada (R$437/12d voids). Se essas três precisarem de emergência simultânea (provável em maio), buscador licitações vira atrito real
2. **Custo de oportunidade** — 10-20h/sem × 10-12 semanas = 100-240h Breno. Se mesmas horas em Tocks/Bretda otimização → cenário Sales AI deployed + Tocks D++ CAPI live + Bretda lp form real estimado R$5-15k/mês receita nova vs R$0 buscador 60d
3. **D-PRODUTO não-trivial** — research-mercado mostra: SOM realista 200-500 contas em 24m = R$240-600k ARR, MAS exige execução disciplinada SEBRAE-DF + FIBRA + churn <6%/mês. Solo-dev com 4 outros projetos simultâneos = improvável atingir
4. **Mercado já mexido por IA-startups** — Licitei R$3,5M Microsoft significa player capitalizado vai entrar regional eventualmente. Não é "blue ocean" — é "fast-following window"
5. **D-03 (Águas Lindas) não validado empiricamente** — se prefeitura publica raramente no PNCP (município pequeno pode estar atrás), município-âncora fica fraco e produto perde narrativa hyper-regional
6. **Custo real subestimado em 30-50%** — orçamento V1 ignorava IA real ($25 não $15), revisão jurídica D-PRODUTO (R$2-5k), CAC blended (R$50-80), 16-20h dev OCDS/API extras
7. **OpenTender.eu syndrome** — projeto bem-intencionado, transparência, dados públicos, gov-tech... pode acabar parado em "MVP eterno" se o amigo não usar diariamente

**Custo de construir errado:**
- 100-240h Breno = oportunidade perdida em projetos com revenue real
- Tocks/Bretda pode deteriorar por falta de attention
- Validação ruim → amigo não usa diariamente → projeto-gaveta = aprendizado mas zero ROI
- Se ANPD começar fiscalizar "agregadores" 2025-2026 (Radar Tecnológico 3), exposição reputacional sem revenue para suportar

### 1.3 SÍNTESE D-GO

**🟢 GO — com 5 condições explícitas e timebox rígido**

**Razão central:** as condições para "construir bem" são todas pequenas e auditáveis. As condições para "não construir bem" exigem renunciar a learning + projeto cívico + ferramenta para o amigo. **Reversibilidade alta** (custo afundado <R$50, pivot/abortar barato), **decisão eficiente** mesmo se errar a tese de produto.

**5 condições para o GO ser válido:**

| # | Condição | Bloqueante? | Quando validar | Mitigação se falhar |
|---|----------|-------------|----------------|---------------------|
| **C1** | D-03 validado empiricamente — Águas Lindas-GO publica licitações no PNCP via curl real (last 90d) | 🟡 SOFT-bloqueante | **Semana 1** (~2h dev) | Se publica zero: ampliar geo para "DF + outros municípios RIDE-DF" |
| **C2** | ToU footer `portal.compras.df.gov.br` lido manualmente — sem cláusula que veda scraping | 🔴 HARD-bloqueante | **Semana 1** (~1h Breno) | Se vedar: 100% PNCP API (cobertura ≥80% já garantida por Lei 14.133 art. 175) |
| **C3** | POC Haiku 4.5 com 1 edital real PNCP — validar qualidade resumo PT-BR + custo real (~$0.005-0.02) | 🟡 SOFT-bloqueante | **Semana 1** (~3h dev) | Se qualidade <3/5: fallback OpenAI 4o-mini ou Sonnet 4.5 (custo dobra mas qualidade vale) |
| **C4** | Mascaramento CPF na ingestão implementado **antes** do primeiro deploy | 🔴 HARD-bloqueante | **Semana 1** dia 1 | Sem isso, exposição LGPD desnecessária — não pode pular |
| **C5** | Timebox 90 dias até "amigo usa diariamente ≥30d e reporta ≥3 oportunidades que perderia sem o produto" | 🟡 SOFT-bloqueante (governance) | **Semana 12** review | Se falhar: descontinuar como produto, manter como ferramenta pessoal Breno (cost zero) |

**Hard-bloqueantes (C2 + C4) são pré-condições de Semana 1.** Sem isso, NÃO iniciar coding além de POC.

**Soft-bloqueantes (C1, C3, C5)** podem rodar em paralelo no início da Sprint 1; falha aciona pivot, não kill.

**Orçamento revisado honesto:**
- Tempo: **10-12 semanas** dev solo (não 8) — buffer 25-50% para learnings + OCDS/API extras
- Custo operacional fase pessoal: **$30-50/mês** (não $40)
- Custo dev pré-MVP: **$0** (hard cap mantido)
- Custo único pré-MVP: **~R$0** (revisão jurídica adiada para D-PRODUTO)

**Governance:**
- Checkpoint semanal Tocks/Bretda — se EMERGÊNCIA acionada nos outros 2 projetos, **buscador pausa imediatamente** (não negociável)
- Saturação de attention: máximo 15h/sem buscador (deixar 5-10h/sem para Tocks/Bretda/outros)
- Sprint 1 = validação técnica pura (C1+C2+C3+C4); Sprint 2-3 = MVP free para amigo; Sprint 4+ = OCDS export + WhatsApp

---

## 2. D-STACK — Confirmar Next+Supabase+Inngest+Resend ou pivotar?

### 2.1 TESE (confirmar stack original)

**Premissas que suportam confirmar:**
1. **Cada componente tem free tier validado para volume real** — Inngest 50k execuções (2.7x folga), Supabase Pro $25 escala até 100k editais, Vercel free hobby, LlamaParse 30k pages/mês free, Resend 3k/mês free
2. **Breno tem proficiência Next.js** — outros AIOS projetos (Tocks, Bretda, Anipis) usaram stack análogo com sucesso → curva de learning zero
3. **Padrão arquitetural alinhado com state-of-the-art global** — Postgres+search engine ainda é mainstream (ProZorro Atreus migra para Postgres, TED EU usa Postgres+Elasticsearch, ChileCompra/SECOP II não público mas similar)
4. **Search híbrida BM25+vector com pgvector é mais avançada que Mercell** (líder SaaS Nordic limitado a CPV codes) — vantagem real, não retórica
5. **Sem alternativa mais barata viável** — alternativas (Astro+SQLite, PocketBase, Trigger.dev self-host) trariam custo de aprendizado sem ganho de capacidade
6. **Multi-provider LLM via abstraction layer** mitiga risco Anthropic 529 — pode-se trocar Haiku 4.5 por OpenAI 4o-mini ou DeepSeek se preço/uptime piorar
7. **AIOS já tem skills + scripts para todo o stack** — pipeline de execução acelerado vs stack desconhecido

### 2.2 ANTÍTESE (pivotar para alternativa)

**Premissas que suportam pivot (steelmanned):**
1. **Custo Haiku 4.5 é 2-4x estimativa V1** — viola hard cap $0-40/mês operacional (T5). Pivot para OpenAI 4o-mini ($0.15/$0.60 por 1M) ou DeepSeek (mais barato ainda) pode trazer back para $15-25/mês
2. **Supabase free tier 500MB RAM aperta cedo com pgvector** — pode-se ir Neon free + pg_search ou Postgres self-host (Hetzner €5/mês) e ter mais headroom
3. **Inngest free tier limita 5 concurrent steps** — pode virar gargalo se ingestion for paralelizada agressivamente. Trigger.dev self-host (Apache 2.0) tem runs ilimitados
4. **PocketBase ou Astro+SQLite** simplificariam stack para "tudo num docker container" com hosting €5/mês fixo (no surprises)
5. **eForms / OCDS-style schemas** apontam para JSON-first databases (CouchDB ProZorro legacy, MongoDB) — Postgres é OK mas não é "natural fit" para OCDS releases
6. **Java/Python ecosystem domina gov-tech procurement globalmente** — Next.js é "outlier" no setor (ainda viável, mas sem ecosistema templates/libs específicos)
7. **Vendor lock-in cumulativo** — Supabase + Vercel + Inngest + Resend + Anthropic + LlamaParse = 6 vendors externos. Pivot ou fechamento de qualquer um obriga refactor

### 2.3 SÍNTESE D-STACK

**🟢 CONFIRMAR STACK ORIGINAL — com 7 ajustes táticos pré-codificados**

**Razão central:** custo real $30-50/mês é **acima de cap original mas razoável**. Pivots propostos trazem complexidade de aprendizado sem ganho de capacidade. Stack é "boring tecnológico" que libera atenção para o que importa (regional + OCDS + WhatsApp + GTM SEBRAE).

**7 ajustes táticos (incorporar em arch v2 antes de Sprint 1):**

| # | Ajuste | Origem | Custo dev | Impacto |
|---|--------|--------|-----------|---------|
| **A1** | Adicionar **Docling self-hosted** como Plano B obrigatório de LlamaParse desde dia 1 (Docker worker) | T2 | 4-6h | Robustez infra; remove dependência crítica de free tier 3p |
| **A2** | **HNSW index** (não ivfflat) + **halfvec** (pgvector 0.7+) — 50% menos RAM | T3 | 1-2h | Escala 2x no mesmo plano Supabase |
| **A3** | **Multi-provider LLM router** (Claude/OpenAI/DeepSeek) com Haiku 4.5 default + fallback automático | T5 + Padrão C | 6-8h | Mitiga custo + uptime + lock-in |
| **A4** | **Reordenar fontes** — PNCP API + `api.compras.dados.gov.br` + `dados.df.gov.br` CKAN ANTES de scraping. Investigar Megasoft API para Águas Lindas/GO municípios | T6 | 0h (decisão) | Reduz escopo scraping ~80% |
| **A5** | **Schema OCDS-shape interno** — modelar tabela `licitacoes` como release→tender→award com OCID universal | Global P0 | 4-8h | Cross-source dedup + credibility moat + export futuro trivial |
| **A6** | Endpoint **`/api/ocds/releases?date=YYYY-MM-DD`** desde fase 1 (mesmo só com tender stage) | Global P0 | 4h | Marketing diferencial + Open Contracting Partnership outreach |
| **A7** | **Two-tier model strategy** preparado (Haiku default + Sonnet 4.5 sob demanda para "análise profunda") — feature toggle pronto, ativação v2 | T5 | 2h | Captura willingness-to-pay para análise jurídica fina |

**Custo total ajustes:** 21-30h dev em cima do MVP original = ~3 dias intensos OR Sprint 1.5 dedicada.

**Stack final confirmado:**
- **Frontend:** Next.js 15 + React Server Components + Tailwind + shadcn/ui
- **Backend:** Next API routes + Inngest workers
- **DB:** Supabase Postgres + pgvector (halfvec) + FTS portuguese
- **Queue/Cron:** Inngest free → upgrade quando >70% limit
- **Email:** Resend free → upgrade aos 3k/mês
- **LLM:** Anthropic Haiku 4.5 (default) + OpenAI 4o-mini (fallback) via router → Sonnet 4.5 v2 premium
- **PDF parse:** LlamaParse free + Docling self-host fallback
- **Embeddings:** OpenAI text-embedding-3-small ($0.02/1M)
- **Auth:** Supabase Auth magic-link (sem senha)
- **WhatsApp:** WAHA self-host (v1.5) ou cloud API ($0.005/msg) (Padrão D)
- **Hosting:** Vercel free → Pro $20 quando virar produto
- **Observability:** Vercel Analytics + Sentry free tier
- **OCDS:** schema interno alinhado + export endpoint nativo (Padrão E)

---

## 3. D-PRODUTO — Produtizar regionalmente / pessoal-only / descontinuar?

### 3.1 TESE (produtizar)

**Premissas que suportam produtizar (cenário 60-90 dias pós-MVP):**
1. **Unit economics fecham** (M: ARPU R$99 / CAC blended R$50-80 / LTV/CAC 13-20x / payback <2 mês)
2. **SOM realista 200-500 contas em 24m = R$240-600k ARR** — sustenta hire CSM/suporte L1 no ano 2
3. **GTM regional já tem canais qualificados** — SEBRAE-DF + FIBRA com programa Compras Governamentais (500 MPE/ano em treinamento) = aquisição mid-funnel resolvida
4. **Posicionamento regional DF/Centro-Oeste é único** (M2: confidence 90%) — competitors nacionais oferecem só filtros, não posicionamento
5. **WhatsApp + Free tier regional + OCDS export = 3 fossos compostos** — sozinhos comoditizáveis, juntos defensáveis 36+m
6. **Reputational moat OCDS + API pública gratuita** abre porta a parceria Open Contracting Partnership (chancela internacional) — Mercell e Effecti não têm isso
7. **Janela legal favorável** — Lei 14.133 obriga PNCP, ANPD ATPP simplifica compliance solo, jurisprudência TCU/TCDF zero risco para agregadores
8. **Mercado-fim cresce** — GDF R$71,7bi orçamento 2026, MPE 60% fornecedores governo BR, vendas MPE→gov +93% 2018-2023

### 3.2 ANTÍTESE (manter pessoal-only ou descontinuar)

**Premissas que suportam não produtizar (steelmanned):**
1. **Solo-dev com 4 outros projetos simultâneos = improvável atingir SOM** — Tocks Sales AI 7.5+, Bretda PR #645 reabrir, KR config fix, Vorza email pivot, AIOS evolução. Buscador é o 5º projeto na pilha
2. **Cenário CONSERVADOR (80-150 contas / R$76-142k ARR)** é o mais provável dado restrição de attention — não justifica primeiro hire, vira lifestyle SaaS solo, não escala
3. **Effecti tem 150+ funcs e 11 anos** — não é startup vulnerável; Licitei R$3,5M Microsoft é capitalizado; vencer regionalmente é viável **em narrativa**, executar é outra coisa
4. **CAC blended R$50-80 depende crucialmente de SEBRAE-DF partnership** — sem isso, CAC vai pra R$200-400 (Google Ads broad) e unit economics quebram
5. **D-PRODUTO exige R$2-5k revisão jurídica + 25-35h dev compliance + DPO canal LGPD** — não é "só ligar pagamento", é overhead operacional permanente
6. **Janela IA-feature parity fechando** — se Licitei lança "modo regional" em 6-12m com R$3,5M atrás, defesa regional + WhatsApp pode não bastar
7. **Pessoal-only honesto pode capturar 90% do valor com 10% do esforço** — ferramenta para amigo + Breno = projeto-portfolio + learning + ferramenta cívica + zero risco operacional. Produtizar adiciona overhead 10x para captar (otimista) 5x receita marginal vs Tocks/Bretda
8. **OpenTender.eu syndrome existe** — projeto bem-intencionado pode virar referência acadêmica sem produto comercial. Ter SOM teórico ≠ ter contas pagantes

### 3.3 SÍNTESE D-PRODUTO

**🟡 DECISÃO ADIADA PARA 2026-07-15 com 4 sinais data-driven obrigatórios**

**Razão central:** decidir D-PRODUTO **hoje** com base em research seria pré-julgar o experimento. A regra de ouro é: o MVP gratuito 90 dias **é o experimento**. Decisão sai dos sinais empíricos, não de hipótese.

**4 sinais data-driven obrigatórios em 2026-07-15 (90 dias pós-MVP shipping):**

| Sinal | Threshold para "verde" | Como medir |
|-------|-----------------------|-----------|
| **S1 — Adoção do amigo + 4 fornecedores DF** | 5 fornecedores usando ≥30d, ≥3 alertas que "teriam perdido sem o produto" | Logs de uso + entrevista qualitativa |
| **S2 — Willingness-to-pay validada** | 3 dos 5 dizem "pagaria R$50-99/mês se virasse pago" | Entrevista direta com pricing test |
| **S3 — Churn 30d em coorte gratuita** | <40% churn aos 30d (proxy de retenção em pago) | Logs de uso |
| **S4 — Canal SEBRAE-DF/FIBRA confirmado** | 1 reunião com SEBRAE-DF ou FIBRA com sinal "interesse em parceria/aval" | Comunicação documentada |

**Regra de decisão 2026-07-15:**
- **3-4 sinais verdes** → 🟢 **PRODUTIZAR** (Sprint compliance LGPD + Stripe + landing pricing pública + outreach SEBRAE-DF)
- **2 sinais verdes** → 🟡 **PESSOAL+** (mantém para amigo + 5-10 fornecedores indicados, sem cobrar, observa 90d adicionais até 2026-10-15)
- **0-1 sinais verdes** → 🔴 **DESCONTINUAR PRODUTO**, manter como ferramenta pessoal Breno (cost zero) + commitar aprendizados em mind clones / AIOS frameworks

**Sinais antecedentes (vigiar entre 2026-05-15 e 2026-07-15):**
- Licitei lança landing "regional" → acelera urgência produto OU força pivot escopo
- ANPD inicia fiscalização agregadores (Radar Tecnológico 3 prioridade) → eleva custo D-PRODUTO compliance (R$2-5k vira R$10k+)
- Tocks/Bretda EMERGÊNCIA simultânea → pausa buscador imediatamente, decisão D-PRODUTO desliza para 2026-10-15

---

## 4. Tensões cruzadas (recomendações de mitigação)

### Tensão 1 — Velocidade vs Rigor
- **Lado velocidade:** janela IA fechando, Tocks/Bretda demandam attention, amigo precisa de ferramenta agora
- **Lado rigor:** OCDS export, multi-provider LLM router, mascaramento CPF, Docling fallback = 21-30h extras vs MVP "raw"
- **Mitigação:** ordenar ajustes A1-A7 em ordem de criticidade. **A2 + A4 + A5 + A6** (P0 do P0) fazem Sprint 1.5 (1 semana). **A1 + A3 + A7** podem entrar Sprint 3-4.

### Tensão 2 — Free tier honesto vs Unit economics
- **Lado free:** validado globalmente (UNGM, WB, ChileCompra) e BR (Sollicita R$30-45 entry); fosso de adoção orgânica
- **Lado unit economics:** se 80% dos users ficam no free tier, ARPU médio cai e CAC fica difícil
- **Mitigação:** **Free Regional limitado** (1 alerta salvo + 1 perfil + email diário; SEM chat PDF, SEM WhatsApp, SEM export CSV). Pro R$99 = 10 alertas + WhatsApp + chat PDF (5/mês) + export. **Free é demonstração, não substituto.**

### Tensão 3 — Pessoal vs Produto (governance de attention)
- **Lado pessoal:** ferramenta pra amigo, zero overhead, ferramenta cívica
- **Lado produto:** R$240-600k ARR potencial, learning aplicável em outros AIOS projetos
- **Mitigação:** **D-GO autoriza apenas pessoal-MVP até 2026-07-15.** Produtização explícita exige Gate 2026-07-15 com 4 sinais. Não construir "pré-produto" antes desse gate (sem Stripe, sem landing pricing, sem pricing pública, sem outreach SEBRAE).

### Tensão 4 — Solo-dev vs Ambição
- **Lado solo:** Breno faz tudo, sem coordination overhead
- **Lado ambição:** OCDS export + WhatsApp + multi-perfil + chat PDF + matching engine + alerts = stack ambicioso para 10-20h/sem
- **Mitigação:** **Roadmap fásico com freeze gates.**
  - Sprint 1 (1 sem): validação técnica (C1+C2+C3+C4)
  - Sprint 2-3 (2 sem): MVP free single-user para amigo + Breno
  - Sprint 4-5 (2 sem): A1+A2+A4+A5 (Docling, HNSW, fontes oficiais, schema OCDS)
  - Sprint 6-7 (2 sem): A3+A6 (multi-provider router, /api/ocds export) + WhatsApp básico
  - Sprint 8-9 (2 sem): perfil-fornecedor + matching score + email digest enriquecido
  - Sprint 10-12 (3 sem): bug-fix + UX polish + 4 fornecedores DF onboarded
  - **Gate 2026-07-15:** decisão D-PRODUTO baseada em sinais empíricos

### Tensão 5 — Risco H10 (Tocks/Bretda absorvem Breno)
- **Confirmado em memória:** Tocks pré-PIX (saldo R$0), Bretda restore híbrido pós-Instant Form, KR config WABA errada R$437 voids
- **Mitigação:** checkpoint **semanal** (toda segunda) revisar Tocks/Bretda metrics. Se EMERGÊNCIA acionada nos outros 2, buscador **pausa imediatamente**. Não-negociável. Documentar em runbook do projeto.

---

## 5. Veredictos consolidados

| Decisão | Veredict | Confidence |
|---------|----------|------------|
| **D-GO** | 🟢 GO com 5 condições (C1+C2 hard, C3+C4+C5 soft) e timebox 90d | 80% |
| **D-STACK** | 🟢 CONFIRMAR Next+Supabase+Inngest+Resend com 7 ajustes táticos A1-A7 | 85% |
| **D-PRODUTO** | 🟡 ADIAR para 2026-07-15 com 4 sinais data-driven obrigatórios (S1-S4) | 75% |

**Custos revisados explícitos:**
- Tempo dev MVP: **10-12 semanas** (era 8)
- Custo operacional: **$30-50/mês** (era $0-40)
- Custo único pré-MVP: **R$0** (revisão jurídica adiada para D-PRODUTO)
- Risco Tocks/Bretda: **CHECKPOINT SEMANAL OBRIGATÓRIO**, pausa imediata se EMERGÊNCIA

---

## 6. Lista pronta para Fase D — Adversarial Review

Hipóteses + decisões que **pedro-valerio** (Process Absolutist) + 1 mind clone adicional devem desafiar:

### Para pedro-valerio (workflow/process audit):
1. **Veto condition do GO:** "se Tocks/Bretda EMERGÊNCIA, pausa imediata" — está expresso, tem trigger objetivo, tem cláusula de retomada?
2. **Unidirectional flow:** D-GO → C1+C2+C3+C4+C5 → Sprint 1 → ... → Gate 2026-07-15 → D-PRODUTO. Tem caminho errado?
3. **Checkpoint coverage:** S1-S4 cobrem todas as dimensões críticas (técnica, mercado, regulatório, attention)? Falta algum sinal?
4. **Reversibilidade explícita:** cada Sprint pode abortar sem custo afundado >R$50?

### Para mind clone adicional (sugestão: **jennifer-pahlka** — govtech ops):
1. **OCDS adoption realistic?** Estamos sendo otimistas sobre custo 4-8h dev OCDS export? Pahlka conhece o stack real de implementação.
2. **SEBRAE-DF partnership realista?** Pahlka pode validar se "1 reunião com sinal de interesse" é threshold honesto para S4.
3. **Free tier governance:** UNGM e ChileCompra free tier worked, mas governo paga. Nosso modelo é "Effecti com free tier" — Pahlka pode atacar isso.
4. **OpenTender.eu syndrome real?** Pahlka conhece falhas similares — qual é a marca empírica de "vai virar produto" vs "vai virar OpenTender BR"?

### Alternativa de clone adicional: **marçal-justen-filho** (não criado ainda):
- Confirmação doutrinal R1 (Lei 14.133 art. 174 §4º) — confidence 92% pode ser ainda mais alta?
- Risco TCU/TCDF "vantagem indevida" — Justen tem opinião pública sobre agregadores?

### Output esperado de Fase D:
- Lista de "veto conditions detected" pelo pedro-valerio
- Sintese das críticas do clone escolhido
- Versão **filtrada** dos 3 vereditos consolidados (D-GO/D-STACK/D-PRODUTO)
- Hipóteses revisadas pós-adversarial

---

## 7. Próximas ações imediatas (pós-aprovação Fase C)

### Esta semana (2026-05-15 a 2026-05-22)
1. ⏱️ **2h Breno:** Ler ToU footer `portal.compras.df.gov.br` (C2 hard-bloqueante)
2. ⏱️ **3h @dev:** POC empírico — curl PNCP `/contratacoes/publicacao` com filtro UF=DF + IBGE=5200175 (C1 + C3)
3. ⏱️ **2h @dev:** POC Haiku 4.5 com 1 edital real (C3 — qualidade + custo)
4. ⏱️ **1h Orion:** Triggerar Fase D (pedro-valerio + 1 mind clone adicional)
5. ⏱️ **30min Orion:** Atualizar `MASTER-REPORT.md` com decisões D-GO/D-STACK preliminares + D-PRODUTO adiado

### Próximas 2 semanas (após Fase D)
6. ⏱️ **Fase E** — Orion consolida vereditos pós-adversarial em `deliverable-tech-research-v1.md`
7. ⏱️ **Fase F** — Orion roteia decisões: atualizar `CONTEXT.md`, `02-architecture/01-architecture-v1.md` com ajustes A1-A7, criar `04-decisions/decision-log.md`
8. ⏱️ **Story Sprint 0** criada para @dev preparar setup + Sprint 1 começar 2026-05-29 (post-Gate D)

---

## 8. Hipóteses finais (Fase C revisadas)

| ID | Hipótese | Confidence Pós-Fase B | Confidence Pós-Fase C | Notas |
|----|----------|----------------------|----------------------|-------|
| H1 | PNCP API cobre ≥80% volume DF+Águas Lindas | 85% | **85%** | Inalterada — POC C1 vai validar empíricamente |
| H2 | Pagaria R$30-100/mês | 80% | **75%** | Reduzida 5% por tensão "amigo paga R$45 Sollicita sem fricção" |
| H3 | Stack entrega em 8 sem com $0-40/mês | 75% | **65%** | Reduzida — timeline real 10-12 sem, budget real $30-50/mês |
| H4 | Águas Lindas publica no PNCP | 75% | **70%** | C1 valida empiricamente |
| H5 | Free tier diferenciador | 60% | **65%** | Subida — confirmado globalmente (UNGM/ChileCompra pattern) |
| H6 | Haiku custa ≤$0.005/edital com qualidade aceitável | 50% | **55%** | Qualidade ok, custo $0.005-0.008 com batch+cache (atinge meta) |
| H7 | Scraping blocks → preciso contornar | 40% | **30%** | APIs oficiais cobrem 80%, scraping fica P2/P3 |
| H8 | Zero player regional | 90% | **88%** | Pequena redução — sinal "Effecti pode lançar DF" pesa |
| H9 | Lei 14.133+LAI ampara scraping | 92% | **92%** | Inalterada |
| H10 | Tocks/Bretda NÃO absorvem 10h/sem | 65% | **60%** | Reduzida — KR config fix + Tocks PIX + Bretda restore = 3 frentes simultâneas reais. CHECKPOINT semanal obrigatório |
| H11 | Mascarar CPF cobre ~95% risco LGPD | 85% | **85%** | Inalterada |
| H12 | DPAs prontos suficientes pré-ANPD adequação | 80% | **80%** | Inalterada |
| H13 | Sem auto-bidding → risco TCU = zero | 90% | **92%** | Subida — confirmado triangular |
| H14 | Janela ANPD 2025-2026 fiscaliza agregadores | 70% | **75%** | Subida levemente — Radar Tecnológico 3 prioridade explícita |
| H15 NOVA | OCDS é diferenciação P0 baixo-custo alto-impacto | — | **80%** | Nova hipótese da Fase C |
| H16 NOVA | WhatsApp dia 1 (não v2) é diferenciação cultural defensável | — | **85%** | Nova — global confirma BR/LATAM-only |
| H17 NOVA | SOM realista 200-500 contas exige SEBRAE-DF partnership | — | **80%** | Nova — sem isso CAC quebra |

---

*Fim da Fase C — Síntese Dialética. Próximo passo: Orion dispara Fase D — Adversarial Review (pedro-valerio + jennifer-pahlka clone). Timebox Fase D: 2h.*
