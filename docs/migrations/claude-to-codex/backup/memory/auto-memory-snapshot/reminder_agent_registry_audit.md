---
name: Agent Registry Drift Audit
description: AUTOPILOT 04/Mai. 3 fases concluídas. Diagnóstico revisado: zero phantoms reais. Patch 1 linha em consultation engine resolveu 148 SKILL_ONLY.
type: project
originSessionId: 5b84a4d4-29e6-4b10-81d9-313660d13595
---
# Agent Registry Drift Audit — COMPLETED 2026-05-04

**Status:** ✅ DONE (autopilot, staged for @devops)
**Trigger original:** `"audit phantom agents"`
**Tempo real:** ~45min (vs 2-3h estimado — fix muito menor que esperado)

## Diagnóstico final

**Inicial (4 fontes):** 128 PHANTOMS reportados.
**Re-audit com 5ª fonte (`.claude/commands/AIOS/agents/`):** zero true phantoms.

O drift era **layer mismatch**, não phantoms. 148 mind clones existiam como skills
em `.claude/commands/AIOS/agents/*.md` mas o consultation engine não procurava nesse path.

## Counts pós-patch

| Status | Count | Decisão |
|---|---|---|
| OK | 56 | Status quo |
| SKILL_ONLY | 148 | Patched (consultation engine SEARCH_PATHS) |
| CONSULT_ONLY | 40 | Intencional (operational layer Mega Brain) |
| PHANTOM | 0 | Gate criado |
| INDEX_PHANTOM | 0 | Gate criado |
| REDIRECT | 4 | Documentado |

## Artefatos criados (8 files staged, +2522 LOC)

- `D:/AIOS/.aios-core/development/scripts/audit-agent-registry.js` — auditor 5-source
- `D:/AIOS/.aios-core/development/scripts/pre-commit-agent-drift.js` — gate hook
- `D:/AIOS/.aios-core/data/agent-registry-policy.md` — policy canônica
- `D:/AIOS/docs/audits/agent-registry-drift-2026-05-04.md` — relatório
- `D:/AIOS/.aios-core/development/tasks/validate-agents.md` — Step 7b adicionado

## Patch crítico (1 linha funcional)

`D:/AIOS/.aios-core/core/jarvis/self-consultation.js`:
- Adicionou `path.join(AIOS_ROOT, '.claude', 'commands', 'AIOS', 'agents')` em `SEARCH_PATHS`
- `resolveExpert()` agora retorna `source: 'aios-skill'` para 148 mind clones antes invisíveis

## Verificação

- `node .aios-core/core/jarvis/self-consultation.js consult --expert dieter-rams` → resolve agora
- `node .aios-core/development/scripts/audit-agent-registry.js --strict` → exit 0
- `node .aios-core/development/scripts/pre-commit-agent-drift.js` → skip when no relevant files staged

## Pendente

- [ ] @devops faz commit dos 6 files staged + push
- [ ] Wire `pre-commit-agent-drift.js` em `.git/hooks/pre-commit` (manual ou via husky)
- [ ] (Futuro) Substituir `SKILL_REGISTRY_IDS` hardcoded inline por live import quando skill loader expor manifesto programático

## Conclave

3 personas consultadas via self-consultation.js (engine local — Antigravity 503 evitado):
aios-master, architect, pm. Verdict consensual: corrigir engine, não registry.
Detalhes em `.aios-core/data/agent-registry-policy.md` § 6.

## NÃO commitado nesta sessão

Per instrução user "deixa staged pra @devops separado".
