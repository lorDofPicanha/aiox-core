# Claude: interativo OK · programático evitar (Constitution Article VII, MUST)

## Regra
- ✅ **Claude interativo** (terminal / IDE, você digita): excelente para **raciocínio longo e de alto risco**. Billing de subscription **inalterado** pós-2026-06-15.
- ⚠️ **Claude programático** (`claude -p`, Agent SDK, Claude Code GitHub Actions, subprocess automatizado): a partir de **2026-06-15** consome um **pool de créditos separado** — preço de API cheio, sem rollover ($20 Pro / $100 Max-5x / $200 Max-20x por mês). **Evitar em bulk, automação, CI ou cron.**

## Contexto (anúncio Anthropic 14/Mai/2026, vigência 15/Jun/2026)
A subscription se divide em dois pools: (1) **interativo** = inalterado; (2) **Agent SDK / programático** = crédito mensal medido a rates de API. O gatilho é a **superfície `-p`/SDK**, não a ausência de humano.

## Para onde mandar trabalho programático (em vez de `claude -p`)
| Necessidade | Destino | Comando |
|---|---|---|
| Raciocínio + execução programática | **Codex** | `delegate.js --to codex "task"` |
| Classificação / bulk barato | **Gemini** | `delegate.js --to gemini --agent {a} "task"` |
| Consulta de especialista | **jarvis** | `delegate.js --to jarvis --topic "{tema}" --limit 3` |

## Enforcement
`delegate.js` **avisa** (não bloqueia) ao usar `--to claude`, lembrando que `claude -p` saca do pool programático. Regra autoritativa: `.aios-core/constitution.md` (v1.1.0, Art. VII) → gerada em `.synapse/constitution`.
