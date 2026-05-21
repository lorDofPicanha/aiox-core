---
name: Projeto Serenity AI
description: Jaci — plataforma SaaS saude mental com companheiro de bem-estar emocional IA texto-first. Rebrand para "Jaci" (2026-03-27). M3 CODE COMPLETE. M4 (Legal Compliance) PLANNED. Infra Supabase criada.
type: project
originSessionId: 1c3ebae7-8eb1-477b-872e-af2386e11573
---
## Serenity AI - Companheiro de Bem-Estar Emocional Inteligente

**Status:** M3 CODE COMPLETE. M4 (Legal Compliance) PLANNED — Conclave juridico unanime: LANCAR COM CONDICOES.
**Repo:** `D:\AIOS\apps\serenity-ai\` (monorepo Turborepo)
**Docs:** `D:\AIOS\docs\projects\serenity-ai\`
**Stories:** `D:\AIOS\docs\stories\serenity-ai\active\`

### O que e
Plataforma SaaS de saude mental com companheiro de bem-estar emocional IA texto-first (MVP). Framework CBT+DBT+ACT+Mindfulness. Memoria persistente. Protocolos de crise 4 niveis com CVV 188. Target: Brasil first. Primeiro AI companion de bem-estar emocional no mercado BR.

### Stack MVP (definido pela @architect)
- Frontend: Next.js 15 + Tailwind + DM Sans/Inter (Vercel)
- Backend: Fastify 5 monolito modular (Railway)
- Database: PostgreSQL (Supabase) + pgvector + Drizzle ORM
- LLM: GPT-4o-mini primario, Claude Haiku fallback
- Cache: Redis (Upstash)
- Auth: Supabase Auth (Magic Link)
- Custo: R$ 0.90/usuario/mes em LLM (margem 97% sobre R$29.90)

### Stories M1 — COMPLETO
- SAI-001 a SAI-008: Setup, Schema, Chat, Frontend, Prompt CBT, Onboarding, Auth (~142 arquivos)

### Stories M2 — COMPLETO
- SAI-009 a SAI-013: Crise 4 niveis, Memoria pgvector, Mood Check-in, Emergency Contacts, Output Filter (98 testes)

### Stories M3 — CODE COMPLETE (2026-03-26)
- SAI-100: Design Terapeutico — **DONE**. tokens.css, 7 componentes UI, WCAG AA pass, 100% token coverage
- SAI-101: Analytics & Retencao — **Code Done**. 8 metricas, dashboard interno, GET /internal/analytics. Pendente: T5 (testes com DB)
- SAI-102: Landing Page — **Code Done**. 14 arquivos, 10 componentes (Hero, Problem, HowItWorks, Benefits, Privacy, BetaSignup, FAQ, Footer, CrisisFooter). Deep research com 12 experts. Mind clone Rafael Calvo criado.
- SAI-103: Security Review — **In Progress**. data-map.md + security-review-beta.md criados. HIGH-001 FIXED (auth no metrics endpoint). HIGH-002 OPEN (DELETE /account). Security headers adicionados. Pendente: T5 stress test + pentest com app rodando.
- SAI-104: Beta Onboarding — **Code Done**. 19 arquivos criados. Sistema de convites, beta guide, feedback FAB, NPS survey. Pendente: T6 (testes runtime)

### Conclave Juridico (2026-03-27)
- **Veredicto:** LANCAR COM CONDICOES (4/4 unanime)
- **Experts:** Patricia Peck, Lucia Savage, Heather Meeker, Richard Susskind
- **Decisao principal:** Rebrand de "companheiro terapeutico" para "companheiro de bem-estar emocional"
- **Parecer completo:** `docs/projects/serenity-ai/legal/PARECER-JURIDICO-CONCLAVE.md`
- **Pesquisas:** `docs/projects/serenity-ai/legal/research-*.md` (4 documentos)

### Rebrand para ANIPIS (2026-04-01)
- **Nome definitivo:** ANIPIS — fusao de anima (alma, latim) + elpis (esperanca, grego) = "alma de esperanca"
- Jaci foi opcao anterior (27/Mar) mas usuario nao gostou
- Pesquisa profunda em 3 eixos: Filosofia (50+ conceitos), Psicologia (40+ conceitos), Mitologia/Etimologia (50+ conceitos)
- Nomes gregos classicos descartados (Eunoia, Aletheia, Kairos) — todos saturados no mercado
- Fusoes greco-latinas criadas: LUCERA, ANIMEL, ELVIDA, SERENOS, CORDEA — validados
- ANIPIS escolhido: campo TOTALMENTE LIMPO (zero conflito wellness/tech/saude mental)
- **Dominios:** anipis.com, anipis.app, anipis.ai — todos sem evidencia de uso
- **INPI:** nenhum resultado encontrado — campo livre
- **Pesquisas:** `docs/research/filosofia-nomes-app-bem-estar-2026-04-01.md`, `docs/research/psicologia-nomes-app-deep-research-2026-04-01.md`, `docs/research/naming-mythology-etymology-deep-research.md`
- **PENDENTE:** registrar dominios anipis.app + anipis.com.br
- **PENDENTE:** registrar INPI classes 9, 42, 44
- **PENDENTE:** criar brandbook Anipis (paleta, tipografia, tom, companion)
- **PENDENTE:** implementar rebrand no codigo (substituir "Serenity AI" e "Jaci")

### Infra Setup (2026-03-27)
- **Supabase:** projeto criado, 13 tabelas, pgvector, RLS, seeds
- **.env.local** configurado (Supabase + OpenAI)
- **API testada:** /health OK na porta 3002
- **Redis/Anthropic:** opcionais (nao configurados ainda)
- **Pendente:** Auth Magic Link, Upstash, deploy remoto

### Stories M4 — Legal Compliance (CODE COMPLETE — 01/Abr/2026)
- SAI-200: Disclaimers permanentes (3 variantes) + auditoria terminologica — **DONE**
- SAI-201: Age Gate 18+ (data nascimento server-side, tela empatica) — **DONE**
- SAI-202: Consentimento Granular 5 categorias LGPD Art. 11 — **DONE**
- SAI-203: PII Stripping pre-API (6 tipos BR, fail-closed, 48 testes) — **DONE**
- SAI-204: DELETE /account LGPD Art. 18 (export + 30d grace + hard delete) — **DONE**
- SAI-205: Politica de Privacidade + Termos de Uso (placeholder OAB) — **DONE**

### Epic 3 — Sistema TCC Interativo (CODE COMPLETE — 01/Abr/2026)
- 3 tabelas: exercise_catalog (8 seed), exercises, assessment_results
- Exercicios: Registro de Pensamento (5 steps), Respiracao 4-7-8 (animacao), Body Scan, Planejamento, Gratidao
- Assessments: PHQ-9 (9 questoes validadas), GAD-7 (7 questoes validadas), Q9 alerta CVV 188
- Dashboard: stats, SVG trend chart, mood mini 7 dias
- Catalogo /exercises com filtro por categoria

### Research & Mind Clones
- `docs/projects/serenity-ai/research-therapeutic-lp-design.md` — pesquisa profunda LP com 12 experts
- Rafael Calvo mind clone criado (Positive Computing, METUX, wellbeing design)
- Squad design-terapeutico: Acacia Parks, BJ Fogg, David Ebersman

### Testes
- Vitest: 269 testes (6 suites), 100% passing — inclui 48 PII stripper + 98 safety + 21 crisis + mais
- Security: 16 findings (0 CRITICAL, 0 HIGH open [HIGH-002 FIXED], 5 MEDIUM, 3 LOW, 5 INFO)

### Aprovacao Clinica (@alison-darcy, 2026-03-23)
- APROVADO PARA BETA COM AJUSTES MENORES (todos aplicados)
- Recomendacao pos-beta: revisao clinica trimestral

### Deploy Producao (02/Abr/2026)
- **Frontend:** https://serenity-ai-eight.vercel.app (Vercel, Turborepo build)
- **API:** https://api-production-ee1f.up.railway.app (Railway, Docker Node 22)
- **DB:** Supabase `qeaotfetegqcbueumxdi` — 19 tabelas, migrations 000-007 aplicadas
- **Railway Project:** `222bd80e-49cf-4360-a965-216f56397ab0`, servico `api`
- Dockerfile multi-stage com ESM fix (extensoes .js) e workspace shared bundled
- [Conversa deploy](conversas/2026-04-02-anipis-deploy-completo.md)

### Blockers (atualizados 02/Abr/2026)
- **Advogado OAB** — revisar politicas placeholder (/privacy, /terms). Estimativa R$5-15k.
- **Dominios** — anipis.app / anipis.com nao registrados. INPI pendente.
- **Auth Magic Link** — configurar redirect URLs prod no Supabase dashboard.
- **Secrets no git** — .env.local commitado, precisa limpar history.

### Roadmap
- M0 Pre-Alpha: Juridico + research — **COMPLETO**
- M1 Core Chat: **COMPLETO**
- M2 Seguranca + Memoria: **COMPLETO**
- M3 Polish + Beta: **CODE COMPLETE**
- M4 Legal Compliance: **CODE COMPLETE** — 6/6 stories implementadas
- Epic 3 TCC: **CODE COMPLETE** — feature principal do app
- **DEPLOY: COMPLETO** (02/Abr/2026) — Vercel + Railway + Supabase

### RAG Knowledge Base (07/Abr/2026)
- **2.556 chunks** no Supabase `knowledge_chunks` com pgvector embeddings
- **454 artigos** processados (339 HYDRA pipeline + 115 curated)
- **35 GitHub repos** processados (171 insights)
- **Tradução PT→EN** de queries via GPT-4o-mini (fix cross-language: +148% similaridade)
- Config: TOP_K=5, MIN_SIMILARITY=0.30, MAX_TOKENS=600, tier filter S/A
- API key `.env.local` corrigida (era expirada)
- **Estudos clinicos:** 87/89 em processamento (PubMed fallback)

### Diagnostico Alex (analyst) 27/Abr/2026
- Projeto parado 19 dias (ultima atividade 08/Abr)
- Vercel + Railway VERIFICADO UP em 27/Abr 22h11
- Doc: `docs/projects/serenity-ai/diagnostic-2026-04-27.md`
- **Cenario B aprovado: MVP Launch R$2-6k 14d**
  - Advogado OAB review R$2-5k (NAO redacao)
  - INPI R$660-1320 (3 classes, 50% MEI)
  - Dominios anipis.com.br + .app R$80
- Gate D+45 pos-beta privado: retencao D+7 ≥25% retomar Epic 4
- Quick wins 48h: dominios + INPI online + cotar 3 advogados

### Rebrand v2 entregue (27/Abr noite) — AGUARDANDO APROVACAO USER
- **13 docs (5.861 linhas)** em `docs/projects/serenity-ai/rebrand-2026-04-27/`
- **22 PNGs** (12 logos + 10 component previews) via Flux 1.1 Pro Replicate
- **Direcao:** "Aurora Brasileira" (warm-led, multi-theme)
- **Cor primaria v2:** Coral #DC6B3A (refinado de #E8764B v1, passa WCAG AA naturalmente)
- **Fonts v2:** General Sans (heading) + Inter (body) + Fraunces Italic (pull-quotes)
- **Logo recomendado:** D2 Aurora arc + D3 Breathing form sistema combinado
- v1.0 brandbook + design-tokens.css IMPLEMENTACAO ATUAL **intactos** (nao foi tocado)

### Proximo passo
1. **User revisa rebrand-2026-04-27/** (12-EXEC-SUMMARY + 11-DECISIONS-LOG + PNGs)
2. **User responde 5 decisoes abertas** (logo direction, fraunces, multi-theme, motion, fotografia)
3. Pos-aprovacao: abrir story SAI-RB-001 (50-80h dev / 1.5-2 sprints)
4. Quick wins paralelos: dominios + INPI + advogado OAB (R$2-6k)
5. Apos rebrand implantado: testar RAG end-to-end, configurar Auth Magic Link prod, deploy
6. Re-ingerir estudos clinicos pendentes (87/89 PubMed)

**Why:** Projeto pessoal do usuario, primeiro AI companion de bem-estar emocional no Brasil. 27/Abr Alex recomendou Cenario B (MVP Launch 14d) sobre retomar Epic 4 ou pausar. User aprovou e pediu rebrand completo via design-squad. Categoria sensivel (saude mental, LGPD).
**How to apply:** Quando usuario mencionar Anipis/Serenity/Jaci, consultar este contexto + session_anipis_rebrand_27abr.md. Status: M1-M4 + Epic 3 TCC CODE COMPLETE, deploy LIVE, RAG 2.556 chunks ativo, REBRAND v2 aguardando review do user. NAO IMPLANTAR codigo sem aprovacao explicita.
