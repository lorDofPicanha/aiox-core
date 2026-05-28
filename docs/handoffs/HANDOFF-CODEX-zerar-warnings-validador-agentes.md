# HANDOFF → Codex — Zerar 295 warnings do validador de agentes (sem violar No Invention)

> **De:** Orion (@aios-master, Claude interativo) · **Para:** Codex (motorista de execução)
> **Branch:** `migration/codex-cutover` · **Data:** 2026-05-27
> **Validador canônico:** `.aios-core/infrastructure/scripts/validate-agents.js`
> **Comando:** `npm run validate:agents` → hoje **0 errors / 295 warnings**
> **Status da política:** APROVADA em conclave (Fowler + Vogels + Beck) com 5 emendas — já embutidas aqui.

---

## 0. Objetivo

Levar `npm run validate:agents` de **0 errors / 295 warnings** para **0 / 0**, **sem criar arquivos-stub** e **sem inventar artefatos** (Constituição: No Invention, Quality First, Agent Authority, CLI First, Story-Driven).

**Regra de ouro:** _um warning é um descompasso de contrato, não um arquivo faltando automaticamente._ O próprio validador oferece as duas saídas legítimas: **"create the file OR remove from dependencies"** (`validate-agents.js:258`). Stub vazio para "passar validação" é **proibido**.

---

## 1. Diagnóstico já verificado (não re-investigar)

**295 warnings = 264 `MISSING_DEPENDENCY` + 31 `MISSING_AUTOCLAUDE`.**

### 1.1 Distribuição das deps ausentes (264)
| Tipo | Qtd |
|---|---|
| tasks | 202 |
| checklists | 26 |
| data | 21 |
| scripts | 9 |
| utils | 6 |

- Espalhadas por **51 agentes**, **228 arquivos distintos**, só **24 referenciados por >1 agente**.
- **Concentram nos agentes-clone/consulta** (warren-buffett, omar-santos, ann-cavoukian, jim-manico, wendi-whitmore, tanya-janca…), **NÃO** nos operacionais.

### 1.2 Os 31 sem `autoClaude` são exatamente os clones de consulta
```
ann-cavoukian, brene-brown, bruce-schneier, charity-majors, chris-sanders,
daniel-kahneman, daniel-miessler, georgia-weidman, hd-moore, ilya-sutskever,
jason-lemkin, jim-manico, joel-de-menezes-niebuhr, john-kindervag, kevin-mitnick,
lawrence-lessig, marcal-justen-filho, marcus-carey, mikko-hypponen, omar-santos,
pablo-hoffman, peter-kim, richard-thaler, scott-hanselman, simon-sinek,
sugata-mitra, tanya-janca, troy-hunt, warren-buffett, wendi-whitmore, yann-lecun
```

### 1.3 Os 11 agentes OPERACIONAIS passam limpos (têm `autoClaude` + deps reais)
```
dev, qa, pm, po, sm, architect, analyst, data-engineer, devops, ux-design-expert, aios-master
```

### 1.4 Três fatos que decidem a política
1. **O template canônico `.aios-core/product/templates/agent-template.yaml` NÃO tem `autoClaude`** e `dependencies` é **opcional** (`{{#IF_DEPENDENCIES}}`). → ausência de dep/autoClaude **não é** violação de contrato.
2. **Os clones declaram deps tipo `tasks/valuation-workflow.md` mapeando 1:1 aos comandos, SEM o prefixo `{agent-id}-`** que a convenção exige p/ deps próprias (template, linhas 9-31). São **intenção gerada por template**, não arquivos planejados. Os clones já têm um **"MISSING FILE PROTOCOL"** embutido ("reporte, não improvise"). → personas de **raciocínio**, não de **execução de workflow**.
3. **`autoClaude` É consumido por código real** (não é metadata morta):
   - `.aios-core/infrastructure/scripts/migrate-agent.js` → **gera** o bloco (specPipeline/execution/selfCritique/recovery/qa/memory/worktree).
   - `.aios-core/infrastructure/scripts/asset-inventory.js:133` → lê `autoClaude.version === '3.0'` (classifica V3).
   - `.aios-core/core/orchestration/gate-evaluator.js:100-101` → lê `autoClaude.orchestrator.gates`.
   - É um **bloco de capacidade de execução autônoma** → só faz sentido em agente que **roda** esse pipeline (operacional). Nome Claude-brandado, **conteúdo runtime-agnóstico**.

---

## 2. Princípios inegociáveis (guardrails)

1. ❌ **NUNCA** criar arquivo-stub/vazio para passar validação.
2. ❌ **NUNCA** adicionar capacidade que o agente não tem (No Invention) — ex.: não dar `autoClaude` (selfCritique/recovery/worktree) a um clone que só raciocina.
3. ❌ **NUNCA** editar `.claude/` ou `.codex/` diretamente — são **gerados** por `npm run sync:ide`. Edição direta = **drift**, sobrescrito no próximo sync.
4. ✅ **Só** editar os 58 canônicos em `.aios-core/development/agents/` + o validador + (se formalizar) o template/gerador.
5. ✅ **Passos pequenos**, validador deve continuar **0 errors** a cada commit.
6. ✅ **Story-Driven**: cada fase referencia a story; classificação revisada **antes** de qualquer mutação.

---

## 3. Política decidida

### 3.1 Dependências — critério objetivo CREATE vs REMOVE (viés **REMOVE > CREATE**)

**CRIAR artefato real** — só se **TODAS** verdadeiras:
- Representa procedimento/conhecimento **real e reutilizável** (conteúdo verdadeiro escrevível — não stub).
- Um agente **de fato carrega/executa** em runtime, **OU** é referência genuína compartilhada por **≥2 agentes** (ex.: alguns `data/*-guide.md` como `wcag-compliance-guide`, `atomic-design-principles`).
- A ausência causa **gap funcional real** (comando falharia/degrada), não só warning.
- Backed por **story** + segue convenção de nomes + barra de qualidade.

**REMOVER a declaração** — se **QUALQUER** verdadeira:
- Intenção aspiracional/gerada por template numa **persona de consulta que raciocina nativamente** (nenhum arquivo é carregado).
- Não existe procedimento real para escrever sem **inventar**.
- O comando funciona sem ela (a persona **é** a capacidade).

> **Aplicação esperada:** maioria dos 264 (os `tasks/*-workflow.md` de clones) → **REMOVE**. Bolso de **CREATE** legítimo é pequeno e mora em `data/` reusável (≥2 consumidores) e em qualquer task que um **operacional** realmente execute (≈0 no estado atual).

### 3.2 `autoClaude`
- **NÃO** tornar universal. **NÃO** adicionar aos 31 clones (seria inventar capacidade).
- Os 31 warnings somem **corrigindo o validador**: tornar o check de `autoClaude` **condicional à classe do agente** — exigido p/ `operational`, ignorado p/ `consultation`.
- **Rename `autoClaude` → nome runtime-agnóstico** (ex.: `autonomy` / `execution-runtime`): **NÃO** entra neste trabalho. Vira **story separada** com **alias de retrocompat** (Claude Code continua lendo), tocando os 3 consumidores. "APIs are forever" — não acoplar rename à limpeza de warnings.

### 3.3 Escopo
- Editar **só** os 58 canônicos + `validate-agents.js` (+ gerador/template). Depois: `npm run validate:agents` (0/0) → `npm run sync:ide` → `npm run sync:ide:check` (strict; reconfirmar 201/201, 0 drift).

---

## 4. Emendas do conclave (Fowler · Vogels · Beck) — OBRIGATÓRIAS

1. **Campo `class:` explícito, NÃO allowlist.** (Fowler/Vogels) A classe do agente (`operational`|`consultation`) é **fonte única de verdade** declarada no próprio agente. Allowlist de IDs no validador **duplicaria a verdade** → re-drift. Adicionar `class:` aos 58 canônicos (1 linha, metadata verdadeira e auto-documentada).
2. **Fail-closed.** (Vogels) Classe **ausente/desconhecida → tratar como `operational`** (exigir `autoClaude`). Nunca pular o check em silêncio — senão um operacional sem capacidade passa verde falso.
3. **🔴 Consertar a FÁBRICA, não só o produto.** (Beck — blind spot principal) Quem **emite** deps aspiracionais é `migrate-agent.js` + templates do `squad-creator`. Se limpar só a saída, **os warnings voltam no próximo agente criado**. Ajustar o gerador para **não declarar deps que não cria** e para **setar `class:`** no nascimento.
4. **Unit-test do branch do validador.** (Beck) Adicionar testes: operational-sem-autoClaude→**fail** · consultation-sem→**pass** · class-desconhecida→**fail-closed (fail)**. Não adicionar lógica não-testada ao quality gate.
5. **Relocar intenção + review do dono.** (Fowler/Vogels) Remoção **≠** deleção silenciosa: as tasks aspiracionais são roadmap. A capacidade já vive em `whenToUse`/`commands` do agente; se houver intenção de roadmap real, registrar em backlog/`.out-of-scope/` antes de remover. Donos dos clones (squad/oalanicolas) revisam a remoção das próprias deps.

---

## 5. Plano de execução (gate-first, passos pequenos, validador verde a cada passo)

**Fase 0 — Classificação (read-only, sem editar).**
- Gerar relatório: para cada um dos 58 agentes → `class` proposta (`operational`|`consultation`) + por dep ausente → decisão `CREATE`|`REMOVE` + justificativa.
- Revisar com os donos antes de mutar (emenda #5).
- **Gate:** relatório aprovado.

**Fase 1 — Campo `class:` + validador condicional + testes.**
- Adicionar `class:` aos 58 canônicos (operational = os 11 da §1.3; consultation = o resto, salvo exceção identificada na Fase 0).
- Patch em `validate-agents.js`: check de `autoClaude` condicional a `class` com **fail-closed** (emenda #2). Trecho atual a alterar: bloco `if (!parsed.autoClaude)` em `validateAgentFormat` (≈ linhas 335-343).
- Unit tests do branch (emenda #4).
- **Gate:** os 31 `MISSING_AUTOCLAUDE` → 0; `npm run validate:agents` segue 0 errors.

**Fase 2 — REMOVE pass (deps aspiracionais dos clones).**
- Remover, dos canônicos, as deps que caíram em REMOVE na Fase 0. Diff mecânico e revisável.
- Relocar intenção quando houver roadmap real (emenda #5).
- **Gate:** warnings de dep caem ao bolso CREATE restante; 0 errors.

**Fase 3 — CREATE pass (whitelist curta).**
- Criar **só** os artefatos que passaram nos 4 critérios da §3.1, com **conteúdo real** + story. Se nenhum qualificar → nenhum criado (correto).
- **Gate:** `npm run validate:agents` → **0 / 0**.

**Fase 4 — Consertar o gerador (anti-regressão).** (emenda #3)
- Ajustar `migrate-agent.js` + templates do `squad-creator` para não emitir deps-fantasma e setar `class:` no nascimento.
- **Gate:** criar um agente de teste via gerador → não introduz warnings.

**Fase 5 — Sync + trava.**
- `npm run sync:ide` → `npm run sync:ide:check` (strict) → confirmar **201/201, 0 drift, 0 orphaned**.
- Garantir que o validador agora **bloqueia regressão** (deps condicionais + `class` obrigatória em novos agentes).

---

## 6. Definition of Done

- [ ] `npm run validate:agents` → **0 errors / 0 warnings**.
- [ ] Nenhum arquivo-stub/vazio criado (toda criação tem conteúdo real).
- [ ] Nenhum `autoClaude` adicionado a clone de consulta.
- [ ] `.claude/` e `.codex/` **não** editados à mão; regenerados via `sync:ide`.
- [ ] `npm run sync:ide:check` → 201/201, 0 drift, 0 orphaned.
- [ ] Validador tem testes do branch condicional (fail-closed coberto).
- [ ] Gerador (`migrate-agent.js` + squad-creator) não re-emite deps-fantasma e seta `class:`.
- [ ] Intenção de roadmap relocada (não destruída) quando aplicável.

---

## 7. O que NÃO fazer (resumo)

- ❌ Criar 228 task-files vazios para "zerar" deps.
- ❌ Adicionar `autoClaude` aos 31 clones.
- ❌ Allowlist de IDs no validador (use o campo `class:`).
- ❌ Renomear `autoClaude` agora (é story separada com alias).
- ❌ Editar `.claude/.codex` diretamente.
- ❌ Mass-delete de deps sem o relatório da Fase 0 aprovado.

---

## 8. Referências (arquivos verificados)

- Validador: `.aios-core/infrastructure/scripts/validate-agents.js` (deps: `validateDependencies`; autoClaude: `validateAgentFormat` ≈ L335-343; `skipDepTypes` L214-224).
- Template canônico (sem autoClaude; deps opcionais): `.aios-core/product/templates/agent-template.yaml`.
- Gerador autoClaude: `.aios-core/infrastructure/scripts/migrate-agent.js`.
- Consumidores autoClaude: `asset-inventory.js:133`, `gate-evaluator.js:100-101`, `cli/commands/config/index.js:401`.
- Agentes canônicos: `.aios-core/development/agents/` (58).
- Sync: `npm run sync:ide` / `sync:ide:check` (gera `.claude` e `.codex` a partir do canônico).
- Exemplo de clone com missing-file protocol + deps sem prefixo: `.aios-core/development/agents/warren-buffett.md`.

---

*Documento de handoff gerado por Orion (@aios-master). Política aprovada em conclave jarvis (martin-fowler · werner-vogels · kent-beck) — 5 emendas embutidas. Não escrever código antes da Fase 0 (relatório de classificação) ser aprovada.*
