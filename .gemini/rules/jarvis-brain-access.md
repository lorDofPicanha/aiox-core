# Jarvis Brain Access (Antigravity / Gemini) — CLI, não MCP

## Contexto
O cérebro do jarvis (mind clones, conhecimento, insights) é **file-based** em `D:/jarvis/bridge-data/` e `D:/jarvis/mega brain/`. O MCP `aios-brain-bridge` é apenas uma porta opcional — e **frágil**: quebra handshake no Antigravity. **Sempre use a CLI via terminal.**

## Como acessar o cérebro (qualquer agente, qualquer momento)

### Buscar / recomendar especialistas
```bash
node .aios-core/core/jarvis/consultation-engine.js search --topic "{tema}" --limit 3
node .aios-core/core/jarvis/consultation-engine.js recommend --agent {agent} --project {projeto}
```

### Consultar (retorna prompt do expert com conhecimento embutido — você responde na voz dele)
```bash
node .aios-core/core/jarvis/self-consultation.js consult --expert {id} --question "{q}" --project {p} --agent {a}
node .aios-core/core/jarvis/self-consultation.js conclave --question "{q}" --project {p} --agent {a} --experts 3
node .aios-core/core/jarvis/self-consultation.js batch --experts "a,b,c" --question "{q}" --project {p}
node .aios-core/core/jarvis/self-consultation.js list-available
```

### Salvar insight de volta (mantém o cérebro aprendendo)
```bash
node .aios-core/core/jarvis/self-consultation.js save-response --id {uuid} --expert {id} --response "{r}"
```

## Quando consultar (gate obrigatório)
Antes de finalizar: story creation, PRD, arquitetura, pricing, security, UX flows, DB schema.
**Skip:** typos, padrões estabelecidos, bug fixes óbvios, hotfixes.

## Mapa de conhecimento
| O quê | Onde |
|---|---|
| Índice de mind clones | `.aios-core/data/jarvis-mind-clone-index.json` |
| Minds (Mega Brain) | `D:/jarvis/mega brain/agents/minds/` |
| Estado de consultas/conclaves | `D:/jarvis/bridge-data/` |
| Memória dos projetos | `.codex/skills/aios-memory/MEMORY.md` + 200 detail files |
| Projetos ativos | `docs/projects/{projeto}/` |

## Princípio
MCP nunca é dependência crítica. Se falhar, a CLI sempre funciona. O cérebro é o mesmo independente do IDE (Claude, Codex, Antigravity, Gemini) — todos batem nos mesmos arquivos.
