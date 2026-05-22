# #04 — Research Dashboard (HYDRA + 162 clones)

**Tier:** A
**Status:** ⚪ pending (depende de #03 maduro + UI Next.js)
**Case validador:** Alan próprio — afirma rodar 10 pesquisas profundas por dia, cobra consultorias/services em cima dos relatórios.

---

## DSPC

**D — Dor cara:**
Consultor estratégico / pesquisador / empresário decisor precisa **pesquisa profunda** (concorrência, mercado, tech, regulação) ANTES de tomar decisão de R$50k-5M. Hoje gasta 8-40h num analista lendo 50-200 fontes manualmente. Trabalho repetitivo, frágil (vies do analista), demora 1-3 semanas.

**Custo semanal visível:** consultora boutique com 3 analistas × 30h/sem em research × R$150/h = R$13.500/sem só em research. + 70% das decisões esperando research = lentidão de pipeline.

**S — Squad:**
- `agent-question-decomposer` — quebra pergunta em sub-perguntas Tier S/A/B
- `agent-source-discoverer` — busca fontes (HYDRA pipeline)
- `agent-fetcher` — baixa conteúdo (RSS, sites, papers, GitHub)
- `agent-llm-router` — distribui fontes para LLMs (Cloud + Codex + Gemini em paralelo conforme tipo)
- `agent-evidence-scorer` — quality + recência + autoridade da fonte
- `agent-curiosity-waves` — 3-4 ondas de aprofundamento em gaps identificados
- `agent-synthesizer` — escreve relatório com tier list, mind map, decision tree
- `agent-mind-clone-validator` — 3-5 clones revisam (Cassie Kozyrkov, Aswath Damodaran, Philip Tetlock, etc.)
- `agent-slide-generator` — gera deck visual usando #00 Slide Creator

**P — Pitch:**
> "Eu ajudo consultorias estratégicas e fundos a tomar decisões de alto valor com research profunda em 2 horas em vez de 2 semanas, usando squad com 162 mind clones especialistas e validação cruzada para alcançar 5-10x velocidade sem perder rigor"

**C — Contrato:**
- Por relatório: R$5k-15k cada (depende de profundidade e ondas)
- Pacote: R$30-60k pra 5 relatórios + dashboard de monitoramento contínuo
- Recorrência enterprise: R$15-30k/mês acesso ao dashboard + 3-5 relatórios mês

---

## Vertical inicial sugerido

**Recomendado: Consultorias estratégicas boutique** (fundos VC, M&A advisory, due diligence)

**Alternativas:**
- Diretorias de inovação em corporações grandes
- Empreendedores tomando decisão de pivot/expansão
- Agências de mercado precisando validar tendências (Bretda, Tocks?)

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| **HYDRA pipeline** (tools/hydra/) | Core absoluto — discovery + fetch + distribution |
| **162 mind clones** | Diferencial único vs concorrência (Perplexity Pro, Exa.ai, etc.) |
| **brain-bridge MCP** | Consultation engine entre clones |
| **squad-creator** | Cria squads ad-hoc por research domain |
| **Pedro Valerio** | Garante pipeline tem checkpoint coverage |
| **Slide Creator (#00)** | Gera deck visual do relatório |
| `martin-fowler`, `cassie-kozyrkov`, `aswath-damodaran`, `philip-tetlock`, `nate-silver`, `daniel-kahneman` | Validation clones para decision-quality |

---

## Stack técnico proposto

- **Backend:** já existe pipeline HYDRA em `tools/hydra/`
- **UI:** Next.js 16 dashboard read-only para cliente
- **Multi-LLM:** Cloud Opus + Codex 5.5 + Gemini 3.1 em paralelo (igual Alan demonstrou)
- **Storage:** Supabase pra histórico + Vector store (já temos OOM fix em curso — verificar status pós Anipis)
- **Output formats:** Markdown report + slide deck HTML + mind map (Mermaid) + decision tree
- **Hospedagem:** rodar no nosso ambiente + cliente acessa via dashboard (read-only) — não é SaaS self-service

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC** | 2h | ICP + ROI confirmado |
| **Discovery** | 3-5 dias | 1 consultoria piloto |
| **PRD detalhado** | 1 dia | Spec dos 9 agents |
| **MVP backend** | 1 semana | Pipeline e2e funcionando (HYDRA + clones validation) |
| **MVP UI dashboard** | 1 semana | Visualizador tier-list + decision tree + slides |
| **Smoke test** | 1-2 semanas | Cliente piloto solicita 3-5 pesquisas reais |
| **Refinamento** | 1 semana | Ajustes pós-feedback |

**Tempo total até primeiro cliente:** ~6-8 semanas (depende de UI ser polida).

---

## Hipóteses críticas

1. ✅ HYDRA pipeline já validado (4000+ sources/run, atualmente OOM bloqueado mas em fix)
2. ✅ 162 mind clones ativos no registry
3. ❓ Qualidade do relatório final vs Perplexity Pro Enterprise / Exa.ai — precisa benchmark
4. ❓ Dashboard UI exige design forte — usar ux-design-expert + design-chief
5. ❓ Quem é o primeiro cliente? Consultoria estratégica próxima?

---

## Riscos

- **Risk-1:** Concorrência forte (Perplexity, Exa, Glean, custom GPTs) → diferencial = 162 clones + Pedro Valerio governance
- **Risk-2:** HYDRA OOM ainda não 100% fixado → bloqueador técnico
- **Risk-3:** Custo de tokens em produção alto → mitigar com cache + routing inteligente Cloud→Codex (igual #10)
- **Risk-4:** Cliente vê output e copia metodologia → mitigar: vender RELATÓRIO + manutenção, não acesso ao squad

---

## Diferencial vs concorrência

| Concorrente | Eles têm | Nós temos |
|---|---|---|
| Perplexity Pro | Velocidade | + 162 clones com Voice DNA |
| Exa.ai | Fontes ricas | + Validation cruzada por clones |
| Glean | Enterprise | + Squad orchestration custom por vertical |
| ChatGPT Deep Research | Multi-step | + Pedro Valerio veto gates |
| Custom GPTs | Personalização | + Saída em slide deck pronto pra cliente |

---

## Próximas ações

- [ ] Resolver HYDRA OOM (já em curso pós Anipis P0s)
- [ ] Spike UI dashboard (1 dia, mockup)
- [ ] Benchmark vs Perplexity Pro Enterprise (5 perguntas idênticas, comparar output)
- [ ] Identificar cliente piloto (Tocks consultoria? Network Vale Silício do Rodrigo Feldman?)

Trigger: `kickoff research-dashboard`
