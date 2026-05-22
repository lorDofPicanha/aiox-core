# AIOS Memory + Graphiti

## Goal

AIOS needs durable memory across Codex, Claude, Gemini, Jarvis, and local scripts.

The implemented design is local-first:

```text
AIOS agents / scripts
  |
  |-- aios-memory CLI
        |
        |-- local canonical memory
        |     .aios-core/data/memory/events.jsonl
        |     .aios-core/data/memory/facts.json
        |     .aios-core/data/memory/decisions.json
        |     .aios-core/data/memory/summaries/*.md
        |
        |-- graphiti outbox
              .aios-core/data/memory/graphiti-outbox.jsonl
              .aios-core/data/memory/graphiti-state.json
```

Graphiti is optional. Local memory works even when Graphiti is not installed.

## Why Graphiti

Graphiti is the open-source temporal context graph engine from Zep. It stores evolving facts, relationships, and provenance as episodes and temporal graph edges. This fits AIOS better than flat chat history because AIOS has changing projects, squads, clients, decisions, and agent responsibilities.

Use Graphiti when you need:

- temporal facts: what was true then vs now;
- entity relationships: projects, agents, squads, clients, decisions;
- provenance: which memory episode produced a fact;
- hybrid retrieval beyond simple keyword recall.

Sources:

- Graphiti GitHub: https://github.com/getzep/graphiti
- Zep/Graphiti paper: https://arxiv.org/abs/2501.13956

## Commands

Initialize memory:

```powershell
npm run memory:init
```

Remember an event/fact/decision:

```powershell
npm run memory -- remember "AIOS agents are activated through scripts/aios-agent-aliases.ps1" --type fact --project aios --agent codex --tags agents,activation
```

Recall memory:

```powershell
npm run memory -- recall "como chamar agentes" --project aios
```

Save a decision:

```powershell
npm run memory -- decide "Use local-first memory with a Graphiti outbox" --project aios --agent codex --tags memory,graphiti
```

Status:

```powershell
npm run memory:status
```

Export Graphiti episodes:

```powershell
npm run memory:graphiti:export
```

PowerShell wrapper:

```powershell
D:\AIOS\scripts\aios-memory.ps1 status
D:\AIOS\scripts\aios-memory.ps1 recall "squads clones"
```

## Graphiti Setup

Graphiti requires Python and a graph backend. The default local setup uses Kuzu because it is embedded and does not require Docker or Java.

Create a Python 3.12 environment with `uv`:

```powershell
cd D:\AIOS
uv venv .venv-graphiti312 --python 3.12
uv pip install --python .\.venv-graphiti312\Scripts\python.exe graphiti-core kuzu
```

Set required environment:

```powershell
$env:OPENAI_API_KEY="..."
$env:AIOS_GRAPHITI_BACKEND="kuzu"
$env:KUZU_DB_PATH="D:\AIOS\.aios-core\data\memory\graphiti-kuzu"
```

Or fill:

```text
D:\AIOS\.aios-core\infrastructure\graphiti\.env
```

Dry run:

```powershell
.\.venv-graphiti312\Scripts\python.exe .aios-core\core\memory\graphiti-sync.py --dry-run
```

Sync pending episodes:

```powershell
.\.venv-graphiti312\Scripts\python.exe .aios-core\core\memory\graphiti-sync.py
```

Alternative FalkorDB backend:

```powershell
cd D:\AIOS\.aios-core\infrastructure\graphiti
docker compose up -d
$env:AIOS_GRAPHITI_BACKEND="falkordb"
```

Alternative Neo4j backend:

```powershell
$env:AIOS_GRAPHITI_BACKEND="neo4j"
$env:NEO4J_URI="bolt://localhost:7687"
$env:NEO4J_USER="neo4j"
$env:NEO4J_PASSWORD="password"
```

## Operating Rules

- Local memory is canonical until Graphiti is fully operational.
- Do not put secrets in memory.
- Use `project`, `agent`, and `tags` on every important memory.
- Use `decision` for architectural choices, pricing choices, legal choices, and process changes.
- Use `fact` for stable state, such as current clone counts or active routes.
- Use `summary` for session summaries and longer retrospectives.
- Graphiti sync should be treated as an index/update step, not as the only source of truth.

## Current Seed Memory

The memory store has been seeded with:

- AIOS has 250 indexed mind clones and all are allocated to squads.
- AIOS memory should be local-first with a Graphiti-ready outbox.
- AIOS agent aliases are loaded through `scripts/aios-agent-aliases.ps1`.

## Future Work

- Add automatic session summarization.
- Add retrieval injection into `agent-call.js`.
- Add Graphiti search command once the backend is installed and validated.
- Add privacy filters for secrets and credentials before `remember`.
- Add per-project namespaces and retention policy.
