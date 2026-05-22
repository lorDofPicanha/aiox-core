# Task Router — escolha o melhor cérebro por tarefa (agnóstico de CLI)

Antes de executar uma tarefa não-trivial, classifique o destino com o roteador
(funciona em qualquer CLI — só depende de node + arquivos):

```bash
node .aios-core/infrastructure/scripts/route.js "descreva a tarefa"
node .aios-core/infrastructure/scripts/route.js --exec "..."   # auto-roda o delegate
node .aios-core/infrastructure/scripts/route.js --json "..."   # saída machine-readable
```

## Destinos
| Rota | Significado | Ação |
|---|---|---|
| ⚙️ **codex** | Execução / código / volume | `delegate --to codex` (auto com `--exec`) |
| ⚡ **gemini** | Classificação / bulk barato | `delegate --to gemini` (auto com `--exec`) |
| 🔮 **jarvis** | Consulta de especialista | `delegate --to jarvis` (auto com `--exec`) |
| 🧩 **claude** | Raciocínio profundo / alto risco | **HANDOFF**: abra uma sessão Claude **interativa**, cole o prompt salvo em `.aios-core/tmp/route-handoff/` e traga o output de volta. NUNCA `claude -p` (Art. VII). |
| ✅ **current** | Trivial | Faça direto na CLI atual. |

## Regra
Programático → Codex/Gemini/jarvis. Raciocínio de alto risco → Claude **interativo** (você
digita; subscription inalterado). O Claude programático (`claude -p`) é evitado em automação
(pool metered pós-15/Jun). Ver `.gemini/rules/claude-programmatic-usage.md`.
