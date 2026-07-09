# SÍNTESE — ENIAC Financeiro (plataforma de gestão financeira multi-empresa com IA + Open Finance)

> Data: 2026-06-20 · Orion (aios-master) · Cruza 4 frentes: repos GitHub (01), Open Finance+mercado (02),
> arquitetura agentes IA (03), corpus HYDRA (04). Status: pré-PRD.

## TL;DR — o que a pesquisa decidiu
1. **Comprar a commodity, construir o moat.** Open Finance via **agregador (Pluggy primário)**; ledger via **Formance (MIT)** ou padrão Postgres próprio; cálculo de imposto IBS/CBS via **TecnoSpeed/PlugNotas (buy-not-build)**. Construir in-house só o que é diferencial: **consolidação multi-empresa + os 4 agentes IA**.
2. **Núcleo = partida dobrada append-only** (não caixa simples). Dá conciliação/consolidação provável + auditoria.
3. **Determinístico-primeiro; LLM nunca inventa número.** Copiloto = tools SQL tipadas, não text-to-SQL livre.
4. **Stack:** Next 15 + React 19 + Supabase (Postgres+RLS, sa-east-1) + worker Railway (pg-boss) + Claude por tier (Haiku/Sonnet/Opus). Esqueleto base = `apps/crm-novo` (Supabase já wired).
5. **O produto não é só financeiro — é compliance-aware.** A janela 2026 da Reforma Tributária é timing e diferencial.

## 1. Fundação técnica (frente 01)
- **Open Finance:** **Pluggy** (`pluggy-node` TS-nativo + quickstart Vercel + `pluggy-mcp` como tool dos agentes). Belvo fallback (repos OSS fechados → só API comercial). **Camada de ingestão agnóstica via adapter.**
- **Núcleo financeiro:** **Formance Ledger + Numscript (MIT, Go)** como microserviço de ledger; OU — pra ficar single-stack — padrão **medici** reimplementado em Postgres com invariantes do **TigerBeetle** como checklist. (Decisão = ADR.)
- **Skeleton/UX:** **Midday** (Next+Supabase+TS, gêmeo do stack, com reconciliation+AI) como **referência apenas (AGPL ⛔)**; **Actual Budget (MIT)** como poço de código copiável (importers, sync).
- **🔴 Traps de licença (não forkar):** Midday/Firefly/Lago/Maybe = AGPL · Akaunting = BSL (proíbe exatamente multi-empresa SaaS) · Invoice Ninja = Elastic. Blocos limpos: Formance/Numscript/Actual/Fava-UI (MIT), TigerBeetle/Hyperswitch (Apache).
- IA-em-finanças OSS = raso → construir o categorizador/copiloto in-house.

## 2. Open Finance + posicionamento (frente 02)
- **Agregador, não participante regulado** (só IF/IP autorizadas BACEN podem; ENIAC levaria 12+ meses + custo alto).
- **Pluggy primário:** categorização nativa + Pix/iniciação + aposta PJ 2026 (CIBA multi-sócio + JSR PJ desde 22/abr/2026) + trial grátis 14d/20 contas (prova as 3 empresas). Floor ~R$2.500/mês.
- **Critério de seleção nº1 = maturidade PJ (JSR/CIBA), não cobertura bruta** — Open Finance PJ ainda imaturo (99% dos 154M consentimentos são CPF).
- **Whitespace AI-native:** consolidação multi-empresa de grupo + forecast preditivo + copiloto + pagar de dentro do copiloto (JSR PJ). Incumbentes (Conta Azul/Omie/Nibo/Granatum) são single-empresa empilhado, sem IA real.

## 3. Arquitetura dos agentes (frente 03)
- **4 agentes:** (1) Categorização+Conciliação — cascata regras→memória→embeddings→Haiku→humano, flywheel de correções; (2) Forecast — heurística (recorrência+agendados+consolidado) primeiro, ML depois, LLM só narra; (3) Copiloto — tools SQL tipadas RLS-scoped, número vem do resultado não da prosa; (4) Alertas/Anomalia — detectores estatísticos computam, LLM ranqueia/escreve.
- **Dados:** partida dobrada append-only; CoA por empresa + mapeamento consolidado; OF crú preservado e linkado ao lançamento; ingestão idempotente `(aggregator, external_id)`; RLS por `company_id`; 3 roles least-privilege (`copilot_ro` SELECT-only).
- **Build faseado:** Fase 0 fundação sem IA → Fase 1 Agente 1 determinístico + LLM + copiloto → Fase 2 forecast + alertas → Fase 3 ML/semantic layer/WhatsApp. **Mantra: a IA financeira mais barata/precisa/auditável é a que em grande parte NÃO é IA.**

## 4. Eixo regulatório BR — molda o PRODUTO (frente 04)
Isto eleva o projeto de "livro-caixa" a "gestão financeira compliance-aware". Constraints que viram features:
- **🔴 CNPJ alfanumérico** → modelo de dados NÃO pode assumir CNPJ numérico (impacto de schema desde o dia 1).
- **Reforma Tributária IBS/CBS — destaque obrigatório ago/2026, 2026 = fase de testes** → ingerir NF-e/NFS-e com layouts duais; cálculo via PlugNotas (buy).
- **NFS-e Nacional obrigatória Simples set/2026** → lógica de receita/recebíveis.
- **Anexo do Simples por CNAE** → as 3 empresas (segmentos diferentes) provavelmente em anexos diferentes → modelar **anexo/regime por empresa**, não alíquota global.
- **Features de radar de compliance (alto valor, baixo custo):** prazo DASN-SIMEI (bloqueia DAS+NF-e), status **CND** por empresa (trava crédito), CSLL, IOF de crédito. → o Agente 4 (alertas) ganha um eixo fiscal além do financeiro.
- **Padrões IA validados:** RAG+citação p/ perguntas fiscais; explicabilidade determinística nos flags; retrieve+ensemble no forecast; agente **opt-in/convocável** (não "Clippy").
- **Timing competitivo:** Visma/Dootax consolidando automação tributária; OpenAI+Plaid validam a tese (e ameaçam no futuro). Janela = agora, com a dor da Reforma.

## 5. Riscos principais (consolidados)
1. **LLM inventa número** no copiloto → Sev-1. Mit: tools SQL-only + UI bind a resultado + eval suite em CI.
2. **Drift de ingestão / miscount silencioso** (cicatriz CRM Novo). Mit: idempotência + smoke test diário + divergências de 1ª classe.
3. **Vazamento RLS cross-empresa** → breach LGPD. Mit: policy canônica + teste de isolamento automatizado.
4. **Dependência de provider** (preço Pluggy só floor público; SDK sem LICENSE SPDX). Mit: adapter agnóstico + confirmar termos em call comercial + trial.
5. **Reforma Tributária instável em 2026** (PLP 140 ainda não é lei; layouts em teste). Mit: camada fiscal via PlugNotas (eles absorvem a mudança); tratar simulador/anexo como config, não hard-code.
6. **Anti-conluio coligadas (Lei 6.404)** ao consolidar 3 CNPJs — ver memória `buscador_livro_caixa_research_18may`.

## 6. Decisões abertas → conclave Jarvis antes do PRD
A arquitetura sinalizou 2 (mind-clone gate):
- **(a) Partida dobrada vs caixa simples** — martin-fowler + werner-vogels (modelo de dados) + heleno-taveira-torres (o contador da ENIAC aceita o modelo de consolidação?).
- **(b) Garantia de correção numérica do copiloto** — guardrail de maior stakes.
- **(c) [novo, da frente 04]** Formance microserviço Go vs ledger Postgres single-stack — werner-vogels/martin-fowler (custo operacional de um serviço a mais vs reimplementar).

## 7. Próximos passos sugeridos
1. **Confirmar com o cliente (ENIAC):** as 3 empresas (segmentos, regime tributário/anexo por entidade, porte, ferramentas atuais), e quem é o contador (aceita partida-dobrada/consolidação?).
2. **Conclave Jarvis** nas 3 decisões abertas (§6).
3. **Trial Pluggy** (grátis) ligando as 3 contas PJ → validar cobertura/categorização/JSR real.
4. **PRD (@pm)** — 4 agentes como epics, Fase 0 = épico-fundação inegociável, eixo de compliance fiscal explícito.
5. **ADRs:** ledger (Formance vs Postgres) · copiloto (tools vs text-to-SQL) · forecast (heurística vs ML) · RLS shared-schema · CNPJ alfanumérico no schema.
6. **@data-engineer** — schema + RPC de posting + RLS + pgvector a partir do esqueleto `crm-novo`.

## Arquivos
- `research/01-repos-github.md` · `research/02-open-finance-mercado.md` · `research/03-arquitetura-agentes.md` · `research/04-hydra-corpus.md`
- `00-context/CONTEXT.md` (escopo travado)
- Reaproveitar: `docs/projects/contador/{12,06,11,00}` · `.claude/agent-memory/aios-analyst/{eniac_open_finance_research_20jun, buscador_livro_caixa_research_18may}.md` · `apps/crm-novo` (skeleton Supabase)
