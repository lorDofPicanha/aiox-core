# #10 — LLM Cost Optimizer (Cloud → Codex auto-migration)

**Tier:** C
**Status:** ⚪ pending (trojan horse — fazer eventualmente quando 15/Jun chegar)

---

## DSPC

**D — Dor cara:**
A partir de 15/Jun/2026, Cloud Code começa a cobrar automações que antes vinham incluídas na assinatura. Builders com pipelines AIOS automatizados vão tomar surpresa de custo (potencialmente +200-500% conta mensal). Codex 5.5 é 5x mais barato em tokens. Mas migrar manualmente cada agent/skill demora 1-3 dias por projeto.

**Custo semanal visível:** builder com pipeline 24/7 que custava R$200/sem em Cloud Code automation passa a custar R$1000-2000/sem após 15/Jun. Caos.

**S — Squad:**
- `agent-codebase-scanner` — detecta calls Cloud Code (skill invocations, automation hooks)
- `agent-codex-equivalent-mapper` — mapeia cada call pra equivalente Codex
- `agent-rewriter` — reescreve agents/skills/commands pra Codex
- `agent-sync-validator` — usa squad-chief sync pra garantir paridade
- `agent-cost-projector` — projeta economia mensal pré-migração
- `agent-benchmark-runner` — roda mesmo prompt nos dois e compara qualidade

**P — Pitch:**
> "Eu ajudo builders AIOS a reduzir 60-80% do custo de tokens migrando Cloud Code → Codex em 1 dia em vez de 1 mês, usando squad de migração com benchmark de qualidade automático"

**C — Modelo:**
- **Free tier** (trojan horse): migração básica gratuita pra captar leads → eles viram clientes do AIOS Pro
- **Premium R$500-2k**: migração completa + benchmark + suporte 30d

---

## Vertical inicial sugerido

**Internal-first:** usar pra migrar nossos próprios projetos (Anipis, Tocks, Bretda) antes de 15/Jun.

Depois: comunidade AIOS + cliente AIOS Pro/Enterprise.

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `squad-chief` sync command | Já existe! Faz parte do trabalho |
| `IDS impact analysis` | Quem usa o quê — quem é afetado pela migração |
| `@dev` + `@qa` | Implementação + validação |

---

## Stack proposto

- Codebase scanner: AST PT-BR (simple)
- Codex equivalent map: spec já documentado pelo Alan ("ao invés de `/` use `#`")
- Benchmark: rodar agent X com prompt Y em ambos LLMs e comparar via LLM-as-judge

---

## Quando começar

Próximo aos 15/Jun (deadline Cloud Code policy change). Antes disso, internalmente migrar nossos próprios projetos.

Trigger: `kickoff llm-optimizer`
