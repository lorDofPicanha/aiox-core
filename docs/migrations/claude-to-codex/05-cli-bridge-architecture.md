# Arquitetura CLI-Bridge — Claude + Codex + jarvis conectados (sem MCP frágil)

**Data:** 2026-05-19
**Decisão founder:** "fazer de uma forma melhor que o MCP" — MCP quebrou no Antigravity e custou a ferramenta.
**Princípio:** conexão via **CLI + arquivos compartilhados**, não MCP. Zero handshake = funciona em TODO IDE.

---

## 1. Por que NÃO MCP como backbone

| Problema MCP observado | Evidência |
|---|---|
| Handshake falha | playwright + nano-banana-2 quebraram no Codex 0.131 |
| Quebra em IDE inteiro | jarvis MCP inutilizou o Antigravity |
| Regex de nome rejeita | `@21st-dev/magic` rejeitado |
| Version mismatch | gpt-5.5 exigiu upgrade; SDK 0.116 incompatível |
| Stdio frágil | `rmcp transport: serde error` em runtime |

**Insight central:** o `aios-brain-bridge` MCP é só um *wrapper sobre arquivos* em `D:/jarvis/bridge-data`. O jarvis SEMPRE foi file-based. O MCP é uma porta opcional — e a mais frágil.

---

## 2. A arquitetura: 4 camadas, tudo CLI + arquivos

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 4 — ROUTING (humano + agent files)                   │
│  Quem faz o quê: AGENTS.md (Codex) + CLAUDE.md (Claude)      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 3 — DELEGATE (cola universal)                        │
│  .aios-core/infrastructure/scripts/delegate.js               │
│   --to codex  → codex exec (OpenAI billing, bulk)            │
│   --to jarvis → self-consultation.js (mind clones)          │
│   --to claude → claude -p (CARO pós-15/Jun, evitar)         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 2 — INTERFACES CLI (sem handshake, qualquer IDE)     │
│  • codex exec "task"          (delegação a Codex)           │
│  • node self-consultation.js  (mind clones / conclaves)     │
│  • node consultation-engine.js (search/recommend experts)   │
│  • claude -p "task"           (Claude headless — caro)      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 1 — ESTADO COMPARTILHADO (arquivos, fonte da verdade)│
│  • .aios-core/        (55 agents, tasks, workflows, scripts)│
│  • docs/projects/     (20 projetos)                         │
│  • D:/jarvis/bridge-data/  (consultations, conclaves, etc.) │
│  • .codex/skills/aios-memory/  (1.5MB memory archive)       │
│  • entity-registry.yaml + jarvis-mind-clone-index.json      │
└─────────────────────────────────────────────────────────────┘
```

**Todas as 4 camadas funcionam em Claude Code, Codex, Antigravity, Gemini, Cursor** — porque dependem só de terminal + filesystem, nunca de MCP handshake.

---

## 3. O delegate.js (cola validada)

Criado em `.aios-core/infrastructure/scripts/delegate.js`. Testado e funcionando.

```bash
# Delegar trabalho bulk ao Codex (billing OpenAI, barato)
node .aios-core/infrastructure/scripts/delegate.js --to codex "refatore X nestes arquivos"

# Consultar mind clone (jarvis, file-based, zero LLM no roteamento)
node .aios-core/infrastructure/scripts/delegate.js --to jarvis --topic "pricing" --limit 3

# Conclave de N experts
node .aios-core/infrastructure/scripts/delegate.js --to jarvis --project anipis --agent architect "devo usar Mem0 ou Letta?"

# Codex com sandbox de escrita + modelo específico
node .aios-core/infrastructure/scripts/delegate.js --to codex --sandbox workspace-write --model gpt-5.5 "task"

# Stdin para tasks longas
echo "task longa..." | node .aios-core/infrastructure/scripts/delegate.js --to codex -
```

**Testes de validação (19/Mai):**
- `--to jarvis --topic "security audit"` → retornou stephen-hahn (score 21) ✓
- `--to codex "Responda: BRIDGE OK"` → retornou "BRIDGE OK" (gpt-5.5, 34k tokens) ✓
- Funcionou MESMO com MCP do Codex falhando (`rmcp transport error`) → prova robustez

---

## 4. Fluxos billing-optimal (pós 15/Jun)

| Cenário | Caminho | Quem paga |
|---|---|---|
| Raciocínio alto risco (legal Anipis, arquitetura) | Claude Code interativo (você digita) | Subscription Claude (barato, inalterado) |
| Execução bulk (refactor, scaffolding, varredura) | `delegate --to codex` | OpenAI (Codex auth) |
| Consulta mind clone | `delegate --to jarvis` | Local (roteamento) + LLM do clone se houver |
| Pipeline HYDRA (fetch/score em massa) | OpenAI/DeepSeek direto via script | OpenAI/DeepSeek |
| Automação/cron | `codex exec` headless | OpenAI |
| ❌ EVITAR: Claude programmatic em massa | `claude -p` (delegate avisa) | Pool separado caro |

**Regra de ouro:** Claude pensa (interativo, barato). Codex executa volume (OpenAI). jarvis aconselha (local).

---

## 5. Mind clones em QUALQUER IDE (resolve o Antigravity)

O jarvis nunca precisou de MCP. Em qualquer IDE com terminal:

```bash
# Buscar experts relevantes
node .aios-core/core/jarvis/consultation-engine.js search --topic "{tema}" --limit 3

# Recomendar por agente/projeto
node .aios-core/core/jarvis/consultation-engine.js recommend --agent {agent} --project {project}

# Consultar 1 expert
node .aios-core/core/jarvis/self-consultation.js consult --expert {id} --question "{q}" --project {p} --agent {a}

# Conclave (mini-debate de N experts)
node .aios-core/core/jarvis/self-consultation.js conclave --question "{q}" --project {p} --agent {a} --experts 3

# Salvar resposta
node .aios-core/core/jarvis/self-consultation.js save-response --id {id} --expert {id} --response "{r}"
```

Estado em `D:/jarvis/bridge-data/` (consultations, conclaves, conclave-reports, etc.) — compartilhado entre todos os IDEs.

### Antigravity especificamente

- **Não configure jarvis como MCP** em `~/.gemini/antigravity/mcp_config.json` (deixe vazio — já está)
- Use o terminal do Antigravity para rodar os comandos CLI acima
- Ou cole no agent rules do Antigravity: "para consultar mind clones, rode `node .aios-core/core/jarvis/...`"
- Resultado: jarvis funciona no Antigravity sem o MCP que o quebrava

---

## 6. MCP: quando ainda vale a pena

MCP não é banido — é **opcional onde for confiável e agregar**:

| MCP | Manter? | Razão |
|---|---|---|
| `aios-brain-bridge` | Opcional no Claude Code | CLI faz o mesmo; MCP é conveniência onde o client é maduro |
| `mcp-ads-bridge` (52 tools) | **Sim** | Tools ricas Meta/Google, difícil replicar via CLin simples |
| `mcp-design-studio`, `mcp-image-studio` | Sim no Claude/Codex | Geração de imagem/design |
| `playwright`, `nano-banana`, `magic` | Por-IDE, best-effort | Frágeis; não dependa deles |
| jarvis MCP no **Antigravity** | **NÃO** | Quebra o IDE — usar CLI |

**Regra:** nunca DEPENDA de MCP para um caminho crítico. CLI é o fallback que sempre funciona.

---

## 7. Estado compartilhado entre os sistemas

Como os dois "cérebros" ficam sincronizados sem falar diretamente:

| Asset | Local | Lido por |
|---|---|---|
| Agents/tasks/workflows | `.aios-core/development/` | Ambos (via sync:ide) |
| Definições por-IDE | `.codex/` + `.claude/` | Codex + Claude |
| Projetos | `docs/projects/` | Ambos |
| Memory archive | `.codex/skills/aios-memory/` + auto-memory | Ambos |
| Mind clone state | `D:/jarvis/bridge-data/` | Ambos + Antigravity + Gemini |
| Registry | `entity-registry.yaml` | Ambos |

**Sincronização de definições:** `npm run sync:ide` propaga agents/skills para todos os IDEs. Roda quando mudar um agent.

---

## 8. Handoff entre sessões (continuidade)

- Hook `precompact-session-digest.cjs` (já existe) escreve digest antes de compactar contexto
- Codex: `codex resume <session-id>` retoma estado
- Claude: contexto + auto-memory
- Ponto de encontro: `docs/projects/{proj}/` e `D:/jarvis/bridge-data/` — ambos leem o mesmo

---

## 9. Setup mínimo para ativar

1. **delegate.js** — criado ✓ (testado)
2. **AGENTS.md** — adicionar seção "Cross-Tool Bridge" (Codex sabe delegar)
3. **.claude/CLAUDE.md** — adicionar mesma seção (Claude sabe delegar)
4. **Antigravity** — manter mcp_config.json vazio; usar CLI no terminal
5. **Opcional:** alias de shell `aios-delegate` para encurtar

Nenhum servidor novo, nenhum daemon, nenhum handshake. Só scripts + arquivos.

---

## 10. Resumo: o que mudou vs proposta MCP

| Antes (MCP-bridge) | Agora (CLI-bridge) |
|---|---|
| codex como MCP server no Claude | ❌ revertido |
| Depende de handshake stdio | ✅ subprocess direto |
| Quebra se versão muda | ✅ resiliente |
| Não funciona no Antigravity | ✅ funciona em todo IDE |
| jarvis via MCP frágil | ✅ jarvis via CLI (file-based) |

**Resultado:** os dois sistemas conectados pelo que cada um faz melhor, sem o ponto único de falha do MCP.
