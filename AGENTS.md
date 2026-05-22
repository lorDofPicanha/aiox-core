# AGENTS.md — Synkra AIOS (Codex CLI Primary)

Project: AIOS framework + 20 active projects.
Founder: Breno Cerqueira (`brenodecerqueira@gmail.com`).
Migrated from Claude Code → Codex on 2026-05-19.

---

## 1. Constitution (NON-NEGOTIABLE)

Fonte de verdade: `.aios-core/constitution.md` (v1.1.0). 7 artigos:

| # | Princípio | Severidade |
|---|---|---|
| I | CLI First (CLI > Observability > UI) | NON-NEGOTIABLE |
| II | Agent Authority (agentes têm escopo claro) | NON-NEGOTIABLE |
| III | Story-Driven Development | MUST |
| IV | No Invention (verificar antes de citar) | MUST |
| V | Quality First (gates pre-push) | MUST |
| VI | Absolute Imports | SHOULD |
| VII | No Programmatic Claude for Automation (evitar `claude -p` em bulk/CI; interativo OK) | MUST |

Quality gates pre-push: `npm run lint && npm run typecheck && npm test`.

---

## 2. Workflow obrigatório

1. Trabalhar a partir de uma **story** em `docs/stories/` (ou criar via `@sm`/`@pm`)
2. Implementar apenas o que os **acceptance criteria** pedem
3. Atualizar checklist (`[ ]` → `[x]`) e file list
4. Rodar quality gates antes de concluir
5. Push só via `@devops` (autoridade exclusiva)

---

## 3. Agent shortcuts

Atalhos preferenciais:
1. `/skills` e selecionar `aios-<agent-id>` em `.codex/skills/`
2. Ou `@<agent>` direto: `@architect`, `@dev`, `@qa`, etc.
3. Ou `/<agent>` slash command em `.codex/prompts/`

**Core agents AIOS:** `@aios-master`, `@analyst`, `@architect`, `@data-engineer`, `@dev`, `@devops`, `@pm`, `@po`, `@qa`, `@sm`, `@squad-creator`, `@ux-design-expert`

**Squad chiefs (Tier 0 routing):** `@cyber-chief`, `@design-chief`, `@data-chief`, `@legal-chief`, `@story-chief`, `@copy-chief`, `@traffic-masters-chief`, `@design-system`, `@oalanicolas`, `@pedro-valerio`, `@sop-extractor`

**Mind clones (250 via brain-bridge MCP + `/skills` shortcuts):** `@<person-slug>`. Exemplos: `@patricia-peck`, `@martin-fowler`, `@april-dunford`, `@cassie-kozyrkov`, etc. Cada clone tem atalho `aios-<id>` em `.codex/skills/` (246 SKILL.md com frontmatter name/description) que carrega a persona de `.aios-core/development/agents/` ou `squads/*/agents/`.

Carregue o arquivo correspondente de `.codex/agents/` ao ativar atalho. Mostre 3-6 comandos principais (`*help`, `*create`, etc.). Stay in character até receber `*exit`.

---

## 4. Mind clone consultation (obrigatório antes de decisões significativas)

**Triggers** (consultar antes de finalizar):
- Story creation, PRD, architecture, pricing, security, UX flows, DB schema

**Skip:** typos, padrões já estabelecidos, bug fixes óbvios, hotfixes, usuário diz "skip consultation"

**Como consultar:**
```bash
node .aios-core/core/jarvis/self-consultation.js conclave \
  --question "{question}" --project {project} --agent {agent} [--experts 3]
```
Retorna prompts individuais + síntese de debate (CONSENSUS / DISSENT / BLIND SPOTS / VERDICT).

**Via MCP aios-brain-bridge:**
- `request_expert_consultation(expert, question, context)` → retorna consultation ID
- `get_consultation_response(id)` → texto

**Mind clone index:** `.aios-core/data/jarvis-mind-clone-index.json` (250 entries; sources: mega-brain 55, aios-agent 58, codex-agent 127, squad-agent 10). Cada registro tem `membership` (core 51 / pool 186 / governance 6 / runtime 7), `domain` e `squads`.

---

## 4-bis. Squad routing & governance gates

**Policy completa:** `.aios-core/routing-and-gates-policy.md`. Modelo híbrido: determinístico por padrão, pool dinâmico na incerteza, council só em escalação. Hierarquia `chief → specialist → clone`.

**Roteamento (intent → chief Tier 0):** engenharia→@architect · plataforma→@kelsey-hightower · dados→@data-engineer · IA→@demis-hassabis · design→@design-lead · comportamental→@bj-fogg · segurança→@bruce-schneier · jurídico/privacidade→@heather-meeker · tráfego/growth→@traffic-masters-chief · conteúdo→@ann-handley · vendas→@alex-hormozi · CS→@lincoln-murphy · produto→@pm · pesquisa→@analyst · operações/QA→@sm · finanças→@aswath-damodaran · mercados→@luana-lopes-lara · saúde(Anipis)→@alison-darcy · pessoas→@patty-mccord · comunidade→@sarah-drasner · inovação→@clayton-christensen · meta/orquestração→@aios-master.

**Gates obrigatórios** (disparam por gatilho material, não em toda tarefa): Story-driven (Art.III, BLOCK) · No-invention (Art.IV, BLOCK + hook) · Quality (Art.V, BLOCK pre-push) · Data-quality (hook sql-governance) · Security→@bruce-schneier · Legal→@heather-meeker · Privacy/LGPD→@ann-cavoukian · Finance→@aswath-damodaran · Brand→@ann-handley · **Human approval** (ação irreversível/externa: deploy prod, push, envio a terceiro, gasto → OK do Founder; push só via @devops).

---

## 5. Active context (snapshot 2026-05-19)

**Projeto prioritário:** Anipis (closed beta 30/Mai/2026 — slip seguro 7/Jun).
**Projetos paralelos ativos:** Tocks, Bretda, Buscador-Licitações, IOX-Services, Site-Prospector.
**Projetos KILLED:** Polymarket (18/Mai, PF<0.6, archivado), Vorza Meta (05/Mai, pivot email).

### 5.1 Active reminders (top-15 mais relevantes)

| Trigger | Estado | Próxima ação |
|---|---|---|
| **Anipis pre-Beta** | Closed Beta 30/Mai. 14 decisões 19/Mai fechadas via DECISIONS.html. Squad legal AIOS assumiu (founder rejeitou advogada externa pré-Beta). SCC v2 FINAL + DPIA v2 + LIAs Sentry/Langfuse v1.1. | Founder hoje: migration 011 + R1 Railway + R2 OpenAI ZRT. Semana: MEI + emails 20 Júlias + DPO sign bundle. |
| **Anipis stack** | Railway BR API host, Upstash us-east-1 (founder rejeitou cutover SP — D16), Supabase, Sentry pós-Beta (D17), Anthropic DPA enterprise + ZDR explícito 25/Mai (D18) | Aplicar migration 011 `ai_features_enabled` |
| **KR OAuth** | Token KR poisoned por BM Vorza banida. OAuth USER token bloqueado em redirect `connect/login_success.html` não whitelistado | Founder: adicionar URL em `developers.facebook.com/apps/1242013794801262/fb-login/settings/` |
| **KR V4 LINK_CLICKS** | Camp `120248219339400268` PAUSED, adcreatives prontos. Adset/ad bloqueados por policy hold subcode 2446325 + PIX R$500-700 | Trigger: `policy hold resolvido kr`, `religa kr`, `pix confirmado kr` |
| **Bretda Form WA 19/Mai** | 4 ads ACTIVE com Thank You Screen + WA redirect `wa.me/5547992259554`. Aguardando Meta review 1-3h | Audit: `audit bretda thank you wa` |
| **Bretda Images** | PR #19 + PR #20 merged + deployed. Schema final: lifestyleImage + cardImage + transparentImage. Configurador 3D direct-swap PAUSADO (precisa GLB calibration ~1h manual) | `retomar configurador direct swap` ou `caminho a configurador` (Paulinho re-export GLBs) |
| **Bretda Google OC** | LIVE em bretda.com.br/api/google-conversion via Ads API v20. 7/7 smoke PASS. EOL 15/Jun resolvido | Caveat: OAuth Testing-mode ~7d expiry até GCP verification |
| **Buscador Workflow v3** | 6 estágios + base, 3 empresas (1 faz licitação), MOAT parcial (Effecti faz desde 2024). Stack OSS: Docling + Legal-BERTimbau + pgvector + Pluggy R$48/mês + OCDS Kit. Pricing R$2.800/mês (ROI 12× para cliente) | Triggers: `continua buscador workflow`, `vai com sprint 0 buscador` |
| **IOX-Services Program** | 11 squads-serviços (NÃO-SAAS). #00 Slide Creator DONE. #01 Contract-on-Call NEXT (R$15-25k setup + R$2.5-5k/mês advocacia bancária) | ⚠️ Anipis tem precedência |
| **Site-Prospector v1** | Tier S R$3.497+R$247/mo Growth. Pilot manual 3 prospects 4 semanas até **2026-06-09** (hard review date). Padaria/confeitaria Blumenau anchor #1 | P0 founder: contrato OAB-SC R$2.5-5k, kit LGPD, ME ativa |
| **Squad Security v2.0** | 16 agentes em 6 divisões. validate-agents 0 errors 91 warnings benignos. 6 cross-division combinations | Triggers: `consult red team peter-kim`, `cyber-chief threat-model {project}`, `pre-beta review anipis` |
| **CRM Novo Planning** | HYDRA V3 + brainstorm 85 features + 24 stories + 5 conclaves. Tocks + Bretda primários, multi-tenant. Stack: Next.js 16 + Supabase + WhatsApp Cloud API + Inngest. 12-16w. Week 0 Concierge MVP mandatory | Triggers: `vai com crm`, `audit crm gate {0,1,2,3}` |
| **HYDRA Squad-AI** | 1/32 done. 15/15 squad-ai members feed OK. 31 squads pendentes — quota Anthropic+OpenAI exceeded | Triggers: `top-up anthropic`, `troca pra deepseek`, `bypass llm scoring` |
| **Polymarket** | KILLED 18/Mai. PF<0.6 -$15.63 PnL. Tasks PolymarketBotWatchdog + DailyCheckup Disabled (reversíveis). 6 patterns reaproveitáveis documentados | Triggers: `revive polymarket` (não recomendado) |
| **Migration Claude→Codex** | FASE 1 ✅ + FASE 2 ✅ (validate:codex-sync PASS 59/59). Branch `migration/codex-cutover`. FASE 3 em andamento | Founder: rodar test plan T1-T10 (ver `docs/migrations/claude-to-codex/03-fase3-test-plan.md`) |

### 5.2 Feedback patterns ativos (não repetir erros)

**Tráfego e ads:**
- **Never jump budget more than 2x** em single push (após incidente Bretda 28/Abr)
- **Meta spend_cap dynamic** — não usar lifetime cap
- **AI NEVER autosend** — sempre confirmar antes de disparar mensagem
- **Contas separadas** — não misturar ads entre projetos
- **Geo targeting Brazil** — sempre verificar estados explicitamente

**Quality e processo:**
- **Always use squads** — não consultar 1 expert quando 3 valem mais
- **Check `.out-of-scope/` first** — antes de propor abordagem, verificar dead-ends conhecidos
- **High-ticket = quality over quantity**
- **Kill sessions cleanly** — preservar learnings antes de KILL
- **Luxury taste calibration** — Tocks/Bretda exigem ref estética alta

**Bretda específico:**
- **Mesas reais** — sempre usar fotos reais, nunca renders genéricos
- **Anti-AI rigorosa Kodak Portra** — preset visual canônico
- **Disco C cheio** — atenção a storage local em scripts

**Git e PRs:**
- **PR destination check** — sempre confirmar branch alvo antes de push
- **`@devops` exclusive push authority**

(Lista completa em `.codex/skills/aios-memory/` — 60+ feedback files.)

---

## 6. Estrutura do projeto

```
D:\AIOS\
├── .aios-core/                       # Core framework (CLI, agents, tasks, workflows, scripts)
├── .codex/                           # Codex CLI configs (PRIMARY)
│   ├── agents/                       # 83 agent definitions (.toml + .md)
│   ├── skills/                       # 55 skills + aios-memory archive
│   ├── prompts/                      # 207 slash commands (convertidos de .claude/commands)
│   ├── hooks/                        # 12 hooks (rtk, jarvis-auto-consult, etc.)
│   ├── hooks.json
│   └── config.toml                   # MCPs + [agents] max_depth=2 max_threads=8
├── .claude/                          # Claude Code legacy (DEPRECATED — backup-only, removido em 90d)
├── .mcp.json                         # Root MCP config (legacy)
├── apps/                             # Apps (polymarket-trader, tocks-website, etc.)
├── bin/                              # CLI executables (aios-init.js, aios.js)
├── docs/                             # Documentation
│   ├── stories/                      # Development stories
│   ├── projects/                     # 20 active projects
│   │   ├── anipis/                   # PRIORITY: Closed Beta 30/Mai
│   │   ├── bretda*/                  # Loja sinucas
│   │   ├── tocks*/                   # Móveis design
│   │   ├── buscador-licitacoes/      # Workflow-as-a-service
│   │   ├── crm-novo/                 # CRM multi-tenant
│   │   ├── iox-services/             # 11 squads-serviços
│   │   ├── site-prospector/          # Agência autônoma
│   │   ├── polymarket-trader/        # KILLED
│   │   └── ...
│   └── migrations/claude-to-codex/   # Migration docs
├── packages/                         # Shared packages
└── tests/                            # Tests
```

---

## 7. MCP servers

Configurados em `.codex/config.toml` (local) e `~/.codex/config.toml` (global):

| MCP | Onde | Para quê |
|---|---|---|
| `aios-brain-bridge` | Local | Mind clone consultation (request/get/respond) — **16 tools** |
| `mcp-ads-bridge` | Local | Google/Meta Ads management — **52 tools** |
| `mcp-design-studio` | Local | Figma, Unsplash, Iconify, tokens |
| `mcp-image-studio` | Local | Image generation (Replicate) |
| `refero` | Local | Reference design extraction |
| `playwright` | Global | Browser automation, screenshots |
| `@21st-dev/magic` | Global | UI component generation |
| `nano-banana-2` | Global | AI image gen (Gemini 3.1 Flash) |
| `stitch` | Global | Google Stitch UI prototyping |

Bridge data: `D:/jarvis/bridge-data/`. Ads data: `D:/jarvis/ads-data/`.

**MCP é opcional, nunca dependência crítica.** Se um MCP falhar (handshake, versão), use o CLI-Bridge (Seção 7-bis). MCP frágeis conhecidos: playwright, nano-banana, magic.

---

## 7-bis. Cross-Tool Bridge (CLI, não MCP)

Conexão Codex ↔ Gemini ↔ jarvis via **subprocess + arquivos** (zero handshake, funciona em todo IDE). Doc completo: `docs/migrations/claude-to-codex/05-cli-bridge-architecture.md`.

**Delegate universal:**
```bash
# Raciocínio + bulk/programmatic → Codex (superfície primária, billing OpenAI)
node .aios-core/infrastructure/scripts/delegate.js --to codex "task"
# Classificação / bulk barato → Gemini (Flash; --agent escolhe Flash/Pro)
node .aios-core/infrastructure/scripts/delegate.js --to gemini --agent {a} "{task}"
# Mind clone / conclave → jarvis (file-based, sem MCP)
node .aios-core/infrastructure/scripts/delegate.js --to jarvis --topic "{tema}" --limit 3
node .aios-core/infrastructure/scripts/delegate.js --to jarvis --project {p} --agent {a} "{pergunta}"
# --to claude (claude -p) = programático → pool separado caro pós-15/Jun; pontual, nunca em automação
```

**Mind clones direto (qualquer IDE, sem MCP):**
```bash
node .aios-core/core/jarvis/consultation-engine.js search --topic "{tema}" --limit 3
node .aios-core/core/jarvis/self-consultation.js conclave --question "{q}" --project {p} --agent {a} --experts 3
```

**Regra de papéis (Constitution Art. VII — MUST):** Codex é a superfície primária programática (raciocínio + execução) · Gemini para classificação/bulk barato · jarvis aconselha (local) · **Claude interativo** (você digita) é ótimo p/ raciocínio longo e segue **inalterado** no billing. ⚠️ Evitar **Claude programático** (`claude -p`, Agent SDK, GitHub Actions) em bulk/automação/CI — pós-15/Jun cai em **pool separado caro** (rates de API, sem rollover).

**Divisão de trabalho — quando escalar para cada cérebro:**

| Cérebro | Papel | Quando |
|---|---|---|
| ⚙️ **Codex** | Motorista primário | Execução, refactor, scaffolding, varredura, automação, o grosso do código |
| 🧩 **Claude** (interativo) | Consultor de raciocínio profundo | Arquitetura, alto risco, legal, síntese de muito contexto, code review crítico, **segunda opinião** sobre o Codex |
| ⚡ **Gemini** | Classificador barato | Triagem em volume, tagging, bulk de baixo risco (Flash) |
| 🔮 **jarvis** | Conselho de especialistas | Pricing, security, UX, schema — antes de decisões |

**Task Router (agnóstico de CLI — use antes de tarefas não-triviais):**
```bash
node .aios-core/infrastructure/scripts/route.js "descreva a tarefa"
# ROTA: codex|gemini|jarvis|claude|current + comando pronto
node .aios-core/infrastructure/scripts/route.js --exec "..."   # auto-roda o delegate (codex/gemini/jarvis)
```
- **codex/gemini/jarvis** → o router roda o `delegate.js` (programático).
- **claude** → HANDOFF: o router salva o prompt em `.aios-core/tmp/route-handoff/` e pede pra você **abrir uma sessão Claude interativa** e trazer o output de volta (NUNCA `claude -p`).
- **current** → faça direto na CLI atual.

---

## 8. Skills disponíveis

55 skills em `.codex/skills/`. Ativar via `/skills <name>`.

**Core AIOS:** `aios-master`, `aios-architect`, `aios-dev`, `aios-qa`, `aios-pm`, `aios-po`, `aios-sm`, `aios-analyst`, `aios-data-engineer`, `aios-devops`, `aios-ux-design-expert`, `aios-squad-creator`

**Squad chiefs:** `aios-copy-chief`, `aios-cyber-chief`, `aios-data-chief`, `aios-design-chief`, `aios-legal-chief`, `aios-story-chief`, `aios-traffic-masters-chief`

**Memory & docs:** `aios-memory` (archive completo Claude era), `agent-evals`, `synapse`, `architect-first`, `brainstorming`, `tech-research`

**Production:** `design-system`, `ui-ux-pro-max`, `brand`, `theme-factory`, `pdf`, `video-editing`, `canvas-design`

**Special:** `oalanicolas` (Voice DNA cloning), `pedro-valerio` (process validation), `sop-extractor`, `slide-creator`

---

## 9. Codex CLI specifics

**Modelo:** gpt-5.5 medium reasoning (config global)
**Approval mode:** untrusted (prompt every action), pode subir para `on-request` ou `never` via `/permissions`
**Sandbox:** workspace-write (default), pode subir para `danger-full-access` se necessário
**Session resume:** `codex resume` (picker) ou `codex resume <SESSION_ID>`
**Custom prompts:** filename in `.codex/prompts/` minus `.md` = command name
**Subagents:** TOML em `.codex/agents/`, `max_depth=2` (decisão founder), `max_threads=8`

---

## 10. IDE sync infrastructure (multi-IDE parity)

Manter paridade Claude / Codex / Gemini / Antigravity / Cursor:

```bash
npm run sync:ide                      # sync all IDEs
npm run sync:ide:check                # validate parity (strict)
npm run validate:parity               # cross-IDE diff
npm run sync:ide:codex                # codex only
npm run sync:skills:codex             # skills only
npm run validate:codex-sync           # strict codex validation
npm run validate:codex-integration    # MCP integration test
npm run validate:codex-skills         # skills validation
```

**Local-first:** preferir `.codex/skills/` versionado no projeto sobre `~/.agents/skills/` global.

---

## 11. Convenções

**Naming:**
- Componentes: PascalCase (`WorkflowList`)
- Hooks: prefix `use` (`useWorkflowOperations`)
- Arquivos: kebab-case (`workflow-list.tsx`)
- Constantes: SCREAMING_SNAKE_CASE
- Interfaces: PascalCase + suffix (`WorkflowListProps`)

**Imports:** SEMPRE absolutos (`@/stores/...`), nunca relativos com `../..`.

**TypeScript:** sem `any` — use tipos ou `unknown` com type guards. Props sempre tipadas.

**Commits:** Conventional Commits. Reference story: `feat: implement X [Story 2.1]`. Branches: `feat/*`, `fix/*`, `docs/*`.

---

## 12. RTK (token optimization)

Sempre prefixar comandos com `rtk` (mesmo em chains com `&&`):

```bash
rtk git status        # 70% savings
rtk npm test          # 99% savings
rtk pnpm install      # 90% savings
rtk gh pr view        # 87% savings
```

PowerShell cmdlets (`Get-Content`, `Get-ChildItem`, `Select-Object`, etc.) nao sao binarios no PATH. Nao use `rtk Get-Content` nem `rtk Get-ChildItem`. Use:

```powershell
rtk powershell -NoProfile -Command "Get-Content -Path AGENTS.md -TotalCount 80"
rtk powershell -NoProfile -Command "Get-ChildItem -Path .codex\agents"
```

Hook ativo em `.codex/hooks.json` PreToolUse Bash matcher (auto-rewrite).

Lista completa: ver `CLAUDE.md` legado em backup.

---

## 13. Premissa arquitetural CLI First

```
CLI First → Observability Second → UI Third
```

1. A CLI é a fonte da verdade
2. Funcionalidades novas funcionam 100% via CLI antes de ter UI
3. UI nunca é requisito de operação
4. Observabilidade serve para entender o CLI, não controlá-lo
5. Ao decidir onde implementar: CLI > Observability > UI

---

## 14. Migration status (Claude Code → Codex)

| FASE | Status | Doc |
|---|---|---|
| 1. Pre-flight | ✅ COMPLETO | `docs/migrations/claude-to-codex/01-fase1-manifest.md` |
| 2. Sync completo | ✅ COMPLETO (59/59 PASS) | `docs/migrations/claude-to-codex/02-fase2-manifest.md` |
| 3. Functional validation | 🟡 EM EXECUÇÃO | `docs/migrations/claude-to-codex/03-fase3-test-plan.md` |
| 4. Parallel period | ⏳ Aguarda FASE 3 | — |
| 5. Cutover + cleanup | ⏳ Aguarda FASE 4 | — |

Branch: `migration/codex-cutover`. Backup completo em `docs/migrations/claude-to-codex/backup/` (claude+codex+memory+manifest).

---

## 15. Debug e troubleshooting

```bash
export AIOS_DEBUG=true
tail -f .aios/logs/agent.log
```

| Sintoma | Diagnóstico |
|---|---|
| "agent not found" | `npm run sync:ide:codex` |
| MCP timeout | Verificar paths em `.codex/config.toml` |
| "max_depth exceeded" | Confirmar `[agents] max_depth=2` |
| Slash command não funciona | Verificar `.codex/prompts/<name>.md` existe |
| Hook não roda | Verificar `.codex/hooks.json` matcher |

---

## 16. Frequently used commands

```bash
# AIOS framework
npx aios-core install                 # Instalar AIOS
npx aios-core doctor                  # Diagnóstico
npx aios-core info                    # Info

# Dev
npm run dev
npm test
npm run lint
npm run typecheck

# Self-consultation (mind clones)
node .aios-core/core/jarvis/self-consultation.js conclave --question "..." --project anipis --agent architect

# Sync IDEs
npm run sync:ide                      # all
npm run validate:codex-sync           # strict
```

---

## 17. Persona context — founder profile

- **Breno Cerqueira** — solo founder operando 20+ projetos paralelos
- **Stack preference:** Node.js / TypeScript / Next.js / Supabase / Vercel
- **Mode:** autônomo, prefere agentes que executam sem confirmação excessiva
- **Anti-patterns conhecidos:** ver Seção 5.2

Para histórico completo: skill `aios-memory` (1.5 MB, 201 arquivos).

---

*AGENTS.md v5.0 — Codex CLI primary, post-migration 2026-05-19*
*Mantenedor: Orion (aios-master) + Founder Breno*

@RTK.md
