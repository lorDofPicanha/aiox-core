---
name: RAM Bloat Diagnosis & Fix
description: Claude Code + AIOX consome 5GB+ RAM por sessao — causas identificadas e solucoes
type: feedback
originSessionId: 27cde9de-584b-4a2f-a469-0688661d1c4e
---
## Problema
Claude Code atinge 5GB+ de RAM por sessao quando rodado no diretorio AIOX.

## Causa Raiz: Skills importados massivos

O diretorio `.claude/skills/` contem **~240,000 arquivos .md** que o Claude Code precisa scanear ao iniciar:

| Local | Arquivos | Causa |
|-------|----------|-------|
| `skills/imported/clawhub/` | 192,893 | **58,088 subdiretórios** — lixo importado |
| `skills/.duplicates/` | ~77,236 dirs | Duplicatas acumuladas de imports |
| `skills/imported/tonsofskills/` | 6,338 | Import em massa |
| Outros imported | ~3,400 | alirezarezvani, scientific, microsoft, etc |

**Total: ~280,000+ arquivos** sendo escaneados no startup.

## Causas Secundarias

1. **9 hooks em cada interacao** — 2 Node.js (UserPromptSubmit) + 6 Python (PreToolUse) + 1 Node.js (PreCompact). Cada um spawna processo novo.
2. **184 agent .md files** (5.5MB) registrados como skills
3. **MCP brain-bridge** sempre rodando (65MB)
4. **Vercel plugin** carregado no startup

## Solucao Recomendada

**Prioridade 1 — DELETAR skills importados nao usados:**
```bash
rm -rf D:/AIOS/.claude/skills/.duplicates/
rm -rf D:/AIOS/.claude/skills/imported/clawhub/
rm -rf D:/AIOS/.claude/skills/imported/tonsofskills/
```
Isso elimina ~275,000 arquivos e deve reduzir RAM de 5GB para <1GB.

**Prioridade 2 — Consolidar hooks:**
Combinar os 6 hooks Python de PreToolUse em um unico script dispatcher.
Combinar os 2 hooks Node.js de UserPromptSubmit em um unico.

**Prioridade 3 — Avaliar imported restantes:**
Verificar se alirezarezvani, scientific, microsoft, etc sao realmente usados.

**Why:** O Claude Code precisa indexar TODOS os .md em skills/ para montar a lista de skills disponiveis no system prompt. 280K arquivos = scan massivo + memória gigante.

**How to apply:** Antes de qualquer sessao AIOX, limpar skills nao usados. Manter apenas skills nativos + os realmente utilizados.

## UPDATE 10/Abr/2026 — RESOLVIDO

- Deletados: 4,588 imported skills, registry.json, curated-skills.json
- Remaining: 185 SKILL.md (15 nativos + 165 mind clones + 5 standalone)
- MAX_SKILLS_PER_AGENT=300 adicionado como hard limit no skills-engine.js
- Doctor check atualizado: FAIL se >5000 files, WARN se >300 per agent
- skill-curator.js criado para curadoria futura se necessário
