# Plano de Execução — O Melhor Buscador de Licitações DF + Águas Lindas-GO

**Data:** 2026-05-15
**Decisão user:** "Não pense em monetizar agora, apenas faremos o buscador. Foque em fazer o melhor buscador de licitações."
**Implicação:** D-PRODUTO arquivada (pessoal-only com escopo de qualidade SaaS). D-GO = ✅ build. D-STACK = ✅ confirmar com 7 ajustes (Orion v0) refinados pela tripla Scott/Tetlock/Snowden.

**Filosofia:** "Best buscador" significa qualidade técnica + cobertura empírica máxima + UX action-oriented + robustez infra + compliance LGPD desde dia 1. Não significa monetização-ready.

---

## 0. O que mudou após Scott+Tetlock+Snowden

| Antes (Orion v0) | Depois (síntese tripla + pivot user) |
|------------------|--------------------------------------|
| 3 decisões (D-GO/D-STACK/D-PRODUTO) | **1 decisão ativa (D-STACK)** + D-GO confirmado + D-PRODUTO arquivada |
| Confidence média ~75% (overconfident +13pp — Tetlock) | Recalibrado: timeline 10-14sem, custo $30-50/mês |
| 8 semanas dev → MVP free | **Sprint 0 (probe foundations) 1 sem** + Sprint 1-10 (10-14sem) |
| Sprint 1 começa coding | **Sprint 0 valida fundações** ANTES de coding produção |
| 7 ajustes táticos simultâneos | **4 P0 (Sprint 0-2)** + **3 P1 (Sprint 5+)** — Scott corte |
| "4 sinais data-driven 07/2026" produtizar/kill | **Arquivado** — user define monetização futura |
| Risco H10 Tocks/Bretda = 60% | Recalibrado **40%** (Tetlock) — checkpoint semanal mandatório |
| WhatsApp v2 | **WhatsApp Sprint 5-6** (não v2 nem dia 1) — table stakes BR, defere mas planeja |

**O que NÃO mudou:**
- Stack Next.js + Supabase + Inngest + Resend + Anthropic Haiku + LlamaParse
- Lei 14.133 + LAI + Decreto 8.777 amparam (regulatório green-light)
- Search híbrida BM25 + pgvector é diferenciação técnica real
- Mascaramento CPF na ingestão (Privacy by Default) — hard requirement
- OCDS-shape schema interno desde dia 1

---

## 1. Sprint 0 — Validar Fundações (Semana 1, ~12h Breno + 6h dev)

**Filosofia Snowden:** probe-sense-respond. Antes de investir 100+h em build, gastar 1 semana validando que as fundações empíricas são reais. Não é kill-option — é **construir sobre rocha, não sobre suposição**.

### S0.1 — Hard-bloqueantes (precisam passar antes de Sprint 1)

| ID | Validação | Quem | Esforço | Resultado esperado |
|----|-----------|------|---------|---------------------|
| **B1** | Ler ToU footer `portal.compras.df.gov.br` | Breno | 1h | Sem cláusula anti-scraping; se houver, focar 100% PNCP API |
| **B2** | CPF mask regex implementado + testado isolado em script | Dev | 2h | Função que recebe edital text e retorna texto com CPFs/RGs mascarados |

### S0.2 — Probes empíricos (informam Sprint 1 design)

| ID | Probe | Quem | Esforço | O que sabemos depois |
|----|-------|------|---------|----------------------|
| **P1** | `curl` PNCP `/contratacoes/publicacao?uf=DF&dataInicial=2026-02-15&tamanhoPagina=500` — analisar 1000+ editais | Dev | 1h | Volume real / quais campos vêm preenchidos / quais não / Águas Lindas tem editais reais? |
| **P2** | `curl` mesma query mas filtro `codigoMunicipioIbge=5200175` (Águas Lindas) — 365 dias | Dev | 30min | Confirma cobertura. **Se 0 editais, ajusta estratégia: focar DF + município é "best effort"** |
| **P3** | Baixar 3 editais PDF reais do PNCP (1 grande 100+p, 1 médio 30-50p, 1 pequeno 5-15p) | Dev | 30min | Sample real para POC parsing |
| **P4** | POC Haiku 4.5 — resumir os 3 PDFs com prompt v1 (bullets: objeto, valor, prazo, requisitos, modalidade) | Dev | 2h | Qualidade real PT-BR jurídico (1-5) + custo real ($/edital) |
| **P5** | POC LlamaParse free tier — parsear 5 PDFs editais, medir tempo + qualidade tabela | Dev | 1h | Confirma escolha vs Docling fallback |
| **P6** | Testar dados.df.gov.br CKAN — buscar dataset "licitações" via API, baixar 1 dump | Dev | 1h | Confirma fonte secundária GDF |
| **P7** | Investigar Megasoft Transparência (`*.megasofttransparencia.com.br`) — endpoint padrão? URL pattern para municípios GO? | Dev | 1h | Se padrão existe, destrava ~50 municípios GO com 1 integration |

### S0.3 — Friend-discovery sessão (Snowden+Scott convergente)

| ID | Atividade | Quem | Esforço |
|----|-----------|------|---------|
| **F1** | Sessão 1h com amigo: "enumera 3 licitações que perdeu/quase perdeu nos últimos 6 meses" | Breno+amigo | 1h |
| **F2** | Para cada uma: onde foi publicada? Em que portal? Que campos foram decisivos? Que filtro teria pego? | Breno | 1h |
| **F3** | Mapear filtros default do perfil-amigo (CNAE, valor min/max, keywords positivas/negativas, geo) | Breno | 1h |

### S0 Deliverable

- **Documento `sprint-0-findings.md`** consolidando:
  - Volume real PNCP DF + Águas Lindas (números empíricos)
  - Qualidade Haiku 4.5 PT-BR (score 1-5 + custo real)
  - Confirmação stack (LlamaParse + CKAN + Megasoft pattern)
  - Perfil canônico do amigo (filtros)
  - 3 licitações perdidas como casos de teste para UX

**Gate Sprint 0 → Sprint 1:** B1 + B2 passam + P1+P2+P4 dão sinais aceitáveis (Haiku ≥3/5, PNCP cobre ≥50% Águas Lindas OU plano B para fontes municipais). Falha = ajustar plano de fonte, não kill.

---

## 2. Sprint 1-3 — MVP Core (Semanas 2-4, ~30h Breno + 30h dev)

**Foco:** ingestion + storage + search básico funcionando para o amigo + Breno. UI minimalist, lógica completa.

### Sprint 1 — Schema + Ingestion Skeleton

- **DB schema OCDS-shape interno** (release → tender → award com OCID prefix `ocds-aguasdf-`)
- Migration Supabase Postgres + pgvector (halfvec) + HNSW index + FTS portuguese + unaccent
- Tabelas: `releases`, `parties` (buyers/suppliers), `documents`, `awards`, `perfis_fornecedor`, `alertas`, `feedback`
- Inngest worker: `fetch-pncp-publicacao` (cron 15min) — busca novos, salva raw + normalizado
- CPF mask aplicado no pipeline de ingestão (B2 do Sprint 0)
- LlamaParse worker assíncrono: `parse-edital-pdf` — disparado para Tier S/A (filtro depois)

### Sprint 2 — Match Engine + Enriquecimento IA

- `enrichLicitacao` worker (Inngest): download → parse PDF → resumo IA Haiku → embedding text-embedding-3-small → persist
- Multi-provider LLM router básico (Anthropic + OpenAI fallback) — abstraction layer mas sem two-tier ainda
- Match engine v1: score = keyword match (BM25) × CNAE match × geo match × valor match
- Perfil-fornecedor schema completo (Sprint 0 F3 baseline)

### Sprint 3 — Notifications + UI básica

- Email digest diário Resend (top 5 matches do perfil)
- Web Push se usuário aceitar
- Dashboard Next.js: lista de matches, filtros básicos, link para edital PDF
- Search bar (input texto → BM25 + cosine rerank)

### Sprint 1-3 Deliverable

- MVP rodando para amigo. Recebe email diário com 5 matches relevantes. Busca por keyword. Vê resumo IA + score match.

---

## 3. Sprint 4-6 — Quality + WhatsApp + Compliance (Semanas 5-7, ~30h Breno + 30h dev)

### Sprint 4 — Robustez infra

- **Docling self-hosted fallback** (Docker container worker) — para overflow LlamaParse free + maior resiliência
- Retry exponencial 5xx em todas as fontes externas
- Circuit breaker para PNCP API (se >3 falhas em 5min, pausa 10min)
- Cache HTTP local 15min
- Self-throttling client PNCP (1 req/s baseline)
- User-Agent identificável: `BuscadorLicitacoesDF/1.0 (+contato@dominio.br)`
- Observability: Sentry + Vercel Analytics + log estruturado pino

### Sprint 5 — WhatsApp (table stakes BR/LATAM)

- WhatsApp integration via WAHA self-host (Docker) ou Cloud API ($0.005/msg)
- Opt-in granular: usuário escolhe receber alerts via Email / WhatsApp / Web Push
- Alert WhatsApp: top 1 match Tier S do dia (não spam — 1 msg/dia máx)
- Botão "Ver no app" → deep-link para edital

### Sprint 6 — LGPD compliance hardening

- Política de Privacidade real (não placeholder) — usando research-regulatoria-v1.md checklist
- Termos de Uso (placeholder válido)
- Canal contato titular: `privacidade@dominio.br`
- Cookie banner LGPD (apenas se houver analytics; senão, sem banner)
- ROPA simplificado preenchido (8 campos ANPD)
- DPAs aceitos: Supabase, Vercel, Anthropic, Resend, Inngest, LlamaParse
- Runbook notificação incidente (6 dias úteis ATPP)
- Footer: atribuição fonte ODbL + links Privacidade/Termos

### Sprint 4-6 Deliverable

- MVP robusto + WhatsApp + LGPD-compliant. Pronto para 5-10 fornecedores DF testarem além do amigo.

---

## 4. Sprint 7-9 — Quality Differentiators (Semanas 8-10, ~30h Breno + 30h dev)

### Sprint 7 — OCDS export + API pública

- Endpoint `/api/ocds/releases?date=YYYY-MM-DD` retornando JSON OCDS-shape
- Endpoint `/api/ocds/releases/{ocid}` para release individual
- Docs Swagger/OpenAPI público
- Registrar OCID prefix `ocds-aguasdf-` no Open Contracting Partnership namespace (custo zero)
- Linkable: cada match no app mostra ".ocds" link

### Sprint 8 — Chat RAG sobre edital (diferenciador real)

- Embedding por chunk de edital (semantic + RAG)
- Chat interface: usuário pergunta sobre o edital ("qual o prazo de entrega?", "quais documentos preciso?")
- Limit: 5 chats/dia/usuário no MVP (custo controlado)
- Two-tier: Haiku para chat simples + Sonnet 4.5 quando usuário clica "análise profunda"

### Sprint 9 — Search semantic + recommender básico

- Search híbrida BM25 + cosine rerank (já avançada que Mercell líder Nordic)
- Saved searches: usuário salva query, recebe alertas
- Recommender: "editais similares ao que você favoritou" (cosine vetor médio dos favoritos)

### Sprint 7-9 Deliverable

- Buscador de qualidade técnica state-of-the-art global. OCDS-compliant, RAG chat, search semântica + híbrida, multi-canal notif, LGPD-compliant. Diferenciado vs Effecti/LicitaNet/Sollicita em **dimensões reais**.

---

## 5. Sprint 10 — Polish + Documentation + Onboarding (Semanas 11-12, ~20h Breno + 15h dev)

- UX polish: micro-animations, empty states, error states, loading states
- Mobile-first PWA otimizado (Lighthouse ≥90)
- Documentação técnica interna (ADRs, schema, deployment)
- Onboarding flow para novo usuário: 5 passos guiados (perfil, fontes, alertas, primeiro match, settings)
- Spot-check humano nos primeiros 50 resumos IA (qualidade)
- README + LICENSE (Apache 2.0?) → reputational moat se virar open-source

---

## 6. Orçamento honesto (recalibrado por Tetlock)

### Tempo
- **Sprint 0:** 1 semana × ~18h = **18h**
- **Sprint 1-10:** 11 semanas × ~12-15h = **132-165h**
- **Total dev MVP:** **150-183h** distribuídas em **12 semanas** (Tetlock: 14 semanas é mais realista, P=45%)
- **Buffer realista:** **+20%** (Tetlock planning fallacy) = **180-220h em 14-15 semanas**

### Custo financeiro
- **Pré-MVP (Sprint 0-10):** R$0 — tudo free tier
- **Operacional fase MVP:** $30-50/mês (Anthropic Haiku $25 + Resend free + Supabase free→Pro quando aperta + Vercel free + Inngest free + LlamaParse free)
- **Operacional pós-MVP (≥10 usuários):** $50-80/mês (Supabase Pro $25 + buffers)
- **Hard cap user:** $80/mês operacional pessoal

### Risco H10 (Tocks/Bretda) — checkpoint mandatório

- **Toda segunda-feira:** Breno revisa metrics Tocks (saldo, CPL, conv) + Bretda (CPL, conv, atribuição) + KR (WABA fix status) — 15min
- **Gatilho de pausa:** qualquer um dos 3 em EMERGÊNCIA (saldo zerado / CPL > 2x baseline / config quebrada) → buscador pausa pelo tempo necessário
- **Não-negociável.** Buscador é o 5º projeto na pilha de attention.

---

## 7. Padrões de qualidade não-negociáveis

Estes são o que torna "best buscador" e não "yet another buscador":

| Princípio | O que significa | Onde se manifesta |
|-----------|-----------------|-------------------|
| **Privacy by Default** | CPF jamais entra no banco. LLM instruído a não preservar. | Sprint 0 (B2), Sprint 1, Sprint 8 |
| **OCDS-native interno** | Schema interno é OCDS-shape, OCID universal. | Sprint 1 + Sprint 7 |
| **API pública gratuita** | Devs podem integrar sem permissão nossa. | Sprint 7 |
| **Multi-provider resiliente** | Anthropic 529 ou OpenAI down ≠ produto down. | Sprint 2 |
| **Atribuição transparente** | Toda fonte tem `source_url` + `fetched_at` visível. | Sprint 1 |
| **No dark patterns** | Cookie banner sem dark pattern (LGPD strict). Notif opt-in real. | Sprint 5+6 |
| **Honest free tier** | Free regional é produto real, não bait. | Always |
| **Idempotência ingestion** | Ingerir 2x mesmo edital ≠ duplicar. OCID universal resolve. | Sprint 1 |
| **Spot-check qualidade IA** | Humano valida ≥50 primeiros resumos antes de liberar produção. | Sprint 10 |
| **Observability desde dia 1** | Sentry + logs estruturados antes de qualquer feature. | Sprint 4 |

---

## 8. Lessons aplicadas dos 3 clones

### De Scott Alexander
- **Friend's friend test não vai acontecer agora** (user disse: não monetizar). Mas estrutura de feedback fica: amigo + 2 fornecedores indicados por ele = 3 power-users de N≈3 para validar qualidade real
- **OpenTender.eu syndrome evitado** — foco fornecedor pragmático ("isso é oportunidade pra mim?") explícito desde Sprint 0 (F1-F3 do amigo)
- **Defer ambition:** 7 ajustes → 4 P0 (Docling, halfvec/HNSW, multi-provider, schema OCDS) + 3 P1 (API pública, two-tier model, Megasoft) — não simultâneo

### De Philip Tetlock
- **Timeline honesta:** 10-12sem → **12-14sem +20% buffer** = 14-16 semanas
- **Custo honesto:** $0-40/mês → $30-50/mês (multi-provider compensa parcial)
- **Checkpoint Tocks/Bretda semanal não-negociável** (F7 68% pausa forçada)
- **CPF mask hard requirement** (H11 recalibrado mas Privacy by Default mantém-se Sprint 0)

### De Dave Snowden
- **Sprint 0 = probe phase** (não kill option — refraseado para "validar fundações antes de build")
- **D-STACK é Complicated** → confirmar e construir. Sem mais análise.
- **Concierge experience embedded:** Sprint 0 F1-F3 captura "como amigo usaria isso manualmente" — informa Sprint 1-3 UX
- **Safe-to-fail experiments inline:** cada Sprint tem deliverable testável; falha não destroi build, redireciona

---

## 9. Próxima ação imediata (Breno: HOJE/AMANHÃ)

### Bloco de 2h "Sprint 0 kick-off"

1. **30min — Ler ToU footer portal.compras.df.gov.br** (B1)
2. **30min — Sessão amigo F1: "3 licitações que perdeu nos últimos 6 meses"**
3. **30min — Sessão amigo F3: filtros perfil (CNAE, valor min/max, geo)**
4. **30min — Setup repo Git novo, branch initial, .env template, README skeleton**

### Bloco de 6h "Sprint 0 dev validation" (próxima sessão)

5. **2h — P1+P2+P3: curl PNCP DF e Águas Lindas + baixar 3 PDFs reais**
6. **2h — P4: POC Haiku 4.5 com os 3 PDFs (medir qualidade + custo real)**
7. **1h — P5: POC LlamaParse free + Docling local Docker**
8. **1h — P6+P7: dados.df.gov.br CKAN + investigar Megasoft pattern**

### Documentar tudo em `sprint-0-findings.md` ao final

---

## 10. O que ESTE plano NÃO faz (escopo explícito)

- ❌ Stripe / pricing / planos pagos (D-PRODUTO arquivada por decisão user)
- ❌ Outreach SEBRAE-DF / FIBRA / LinkedIn / Google Ads (foco build, não GTM)
- ❌ Política de descontinuação / kill criterion (irrelevante para pessoal-only)
- ❌ 4 sinais data-driven 07/2026 (D-PRODUTO arquivada)
- ❌ Análise de competitors em detalhe operacional (research-mercado-v1 cobre, foco agora é build)
- ❌ Mobile app nativo (PWA suficiente)
- ❌ Multi-tenancy enterprise (single-user / single-org no MVP)

**Esse escopo enxuto é o que viabiliza "fazer o melhor" em vez de "fazer muitas coisas medianas".**

---

## 11. Triggers de retomada / pause

| Trigger | Ação |
|---------|------|
| `sprint 0 done` | Breno reporta findings; Orion atualiza plano se necessário |
| `pausa licitações tocks/bretda` | Pause imediato. Buscador retoma quando Tocks/Bretda estabilizar |
| `licitações monetização` | Reabrir D-PRODUTO com base no que user definir |
| `licitações ship` | Final MVP shipping check + Sprint 10 polish review |
| `licitações qualidade audit` | Spot-check IA + LGPD + OCDS compliance audit |

---

*Fim do plano. v1 — pronto para ação. Próximo passo: Breno executa Sprint 0 — Bloco de 2h pode rodar hoje mesmo.*
