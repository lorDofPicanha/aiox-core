# FASE 1 — Pre-flight Manifest

**Data execução:** 2026-05-19
**Status:** ✅ COMPLETO
**Working branch:** `feat/hydra-resilience-sprint` (WIP preservado — branch de migração só na FASE 2)

---

## 1. Backup completo (zero perda)

### Configs salvos em `docs/migrations/claude-to-codex/backup/`

```
backup/
├── claude/
│   ├── CLAUDE.md                       (5 KB — raiz do projeto)
│   └── dot-claude-CLAUDE.md            (9 KB — .claude/CLAUDE.md)
├── codex/
│   ├── AGENTS.md                       (3 KB — Codex equivalente)
│   ├── config.toml                     (1 KB — .codex/ local MCPs)
│   ├── global-config.toml              (2 KB — ~/.codex/ global)
│   ├── hooks.json                      (232 B — PreToolUse rtk)
│   └── mcp.json                        (2 KB — .mcp.json raiz)
├── memory/
│   └── auto-memory-snapshot/           (1.5 MB — cópia bit-by-bit)
│       ├── MEMORY.md                   (207 linhas, índice)
│       └── 200 arquivos .md            (decisions_, feedback_, project_, reminder_, session_, user_)
└── manifest/
    └── commands-list.txt               (207 paths)
```

**Integridade:** todos os arquivos source ainda intactos. Backup é cópia, não move. Posso reverter qualquer mudança via copy reverso.

---

## 2. Fix aplicado: YAML parse error

**Arquivo:** `.aios-core/development/agents/daniel-miessler.md`
**Linha:** 56 (YAML linha 47 relativa ao bloco)
**Problema:** valor de `style:` continha inline colons (`Asks:`) e apóstrofes (`what's`) sem quotes, causando bad indentation parser error.
**Fix aplicado:** wrap o valor em aspas duplas. **Conteúdo 100% preservado.**

Antes:
```yaml
style: Clear, essayistic, ... AI-native security thinker. Asks: what's the underlying meaning, ...
```

Depois:
```yaml
style: "Clear, essayistic, ... AI-native security thinker. Asks: what's the underlying meaning, ..."
```

**Validação pós-fix:** `npm run validate:codex-sync --strict` agora roda limpo (sem parse error). Reporta apenas drift esperado (47 missing + 4 drift) — esses são alvo da FASE 2.

---

## 3. Inventário dos 207 slash commands

### Distribuição

| Categoria | Quantidade | Localização |
|---|---|---|
| **AIOS:agents/** (mind clones + core agents) | 188 | `.claude/commands/AIOS/agents/*.md` |
| **AIOS:stories/** | 1 | `.claude/commands/AIOS/stories/story-6.1.4.md` |
| **synapse/** | 9 | `.claude/commands/synapse/{manager,tasks/*,utils/*}.md` |
| **standalone** | 9 | `.claude/commands/{greet,mission,expert-consult,enrich-prd,doc-project,bridge-status,auto-bridge,sync-insights,start-planning}.md` |
| **TOTAL** | **207** | |

### Estratégia de conversão para Codex (FASE 3)

**Bom news:** 188 dos 207 são template-based (1 por agent/clone), gerados automaticamente. Conversão = 1 script + 188 outputs.

| Grupo | Estratégia | Esforço |
|---|---|---|
| AIOS:agents/* (188) | Script único `convert-agent-commands.js` → gera `.codex/commands/AIOS/agents/*` ou skills equivalentes | 1-2h |
| AIOS:stories (1) | Cópia direta | 5 min |
| synapse/* (9) | Cópia + ajuste paths Claude → Codex | 30 min |
| standalone (9) | Cópia + revisão individual (alguns invocam scripts Node.js) | 1h |
| **TOTAL ESTIMADO** | | **~3-4h** |

Inventário completo em: `backup/manifest/commands-list.txt`

---

## 4. Auto-memory snapshot

**Tamanho:** 1.5 MB (não 1.6 conforme estimativa inicial — discrepância natural por filesystem overhead)
**Arquivos:** 201 (MEMORY.md + 200 detail files)
**MEMORY.md:** 207 linhas, índice apontando para os 200 detail files

### Tipos de memória detectados (por prefixo dos arquivos)

| Prefixo | Significado | Quantidade aprox |
|---|---|---|
| `decisions_*` | Decisões founder em projetos específicos | ~3-5 |
| `feedback_*` | Padrões aprovados/rejeitados, lições aprendidas | ~60+ |
| `project_*` | Estado/contexto de projetos ativos | ~15+ |
| `reminder_*` | Lembretes ativos com triggers | ~10+ |
| `session_*` | Sessões importantes preservadas | ~80+ |
| `user_*` | Perfil do founder, preferências, role | ~5-10 |

### Plano de preservação (decisão founder: zero loss)

**Tripla preservação aprovada:**

1. **Snapshot intacto** em `backup/memory/auto-memory-snapshot/` → reference read-only permanente
2. **Skill Codex `aios-memory`** (FASE 3) → carrega memory.md + detail files on-demand quando agent invoca
3. **Síntese executiva** (FASE 3) → top-15 reminders ativos comprimidos em ~20 KiB embutidos no AGENTS.md (cap Codex = 32 KiB)

**Cobertura:**
- Histórico curto-prazo (decisions, sessions recentes): AGENTS.md (immediate context)
- Padrões e feedback: skill aios-memory (load on demand)
- Histórico completo: snapshot read-only (reference, nunca perdido)

---

## 5. Validação pré-FASE-2

| Check | Status |
|---|---|
| Backup configs Claude+Codex+MCP | ✅ |
| Backup auto-memory 1.5 MB | ✅ |
| YAML parse error eliminado | ✅ |
| `validate:codex-sync` roda sem error (só reporta drift) | ✅ |
| Inventário 207 commands com categorização | ✅ |
| WIP do founder preservado (sem branch destrutivo) | ✅ |
| Sync infrastructure validada (npm scripts existem e funcionam) | ✅ |

**Verdict:** Pronto para FASE 2 quando founder autorizar.

---

## 6. O que NÃO foi feito (intencional)

- ❌ `npm run sync:ide:codex` — vai materializar 47 arquivos no `.codex/`. **FASE 2.**
- ❌ Criar branch `migration/codex-cutover` — vai isolar mudanças. **FASE 2 (após sync).**
- ❌ Converter 207 commands — script de conversão. **FASE 3.**
- ❌ Gerar skill `aios-memory` — depende de spec do path Codex skills. **FASE 3.**
- ❌ Editar `.codex/config.toml` para `agents.max_depth = 2`. **FASE 2.**
- ❌ Bateria de testes funcionais Codex — **FASE 3.**

---

## 7. Próximo passo

Aguardar OK do founder para iniciar **FASE 2**:
1. `git checkout -b migration/codex-cutover` (a partir do estado atual com WIP, ou da main limpa)
2. `npm run sync:ide:codex` (gera os 47 faltantes)
3. `npm run sync:skills:codex` (atualiza skills)
4. Adicionar `[agents] max_depth = 2, max_threads = 8` ao `.codex/config.toml`
5. `npm run validate:codex-sync` → deve retornar 0 missing
6. `npm run validate:codex-integration` → testa MCPs

Tempo estimado FASE 2: **1-2h ativas.**
