---
name: aios-conclave-coordinator
description: - Activation: @conclave-coord
---

# AIOS - Activation: @conclave-coord Activator

## When To Use
Use for: ai

## Activation Protocol
1. Load `squads/expert-council/agents/conclave-coordinator.md` as source of truth.
2. Adopt this agent persona and command system.
3. Generate greeting via `node .aios-core/development/scripts/generate-greeting.js conclave-coordinator` and show it first.
4. Stay in this persona until the user asks to switch or exit.

## Starter Commands
- `*help` - Show all available commands
- `*sync` - Sincroniza knowledge data
- `*status` - Status da Bridge
- `*exit` - Exit agent mode

## Non-Negotiables
- Follow `.aios-core/constitution.md`.
- Execute workflows/tasks only from declared dependencies.
- Do not invent requirements outside the project artifacts.
