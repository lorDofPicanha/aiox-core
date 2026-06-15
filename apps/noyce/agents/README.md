# Squad de Agentes Noyce (LLM-driven)

Os agentes que operam **dentro** do Noyce, no formato dos agentes AIOS (`.aios-core/development/agents/`).
Cada arquivo é, ao mesmo tempo, a **especificação** do agente e a fonte do seu **system-prompt** —
o `agent-runtime` (doc 31) carrega `persona` + `core_principles` como o `system` da chamada Claude.

> Arquitetura completa: `docs/projects/buscador-licitacoes/02-architecture/31-arquitetura-camada-agentes-llm-15jun.md`.
> Base de conhecimento (RAG): `apps/noyce/lib/data/knowledge-base/`.

## A esteira BUSCA → ANALISA → ENTREGA

```
                          ┌─────────────── Maestro (orquestrador) ───────────────┐
PNCP/ComprasGov ─► Faro ─►│ Prisma ─► Forja ─► Escriba ─► [GATE HUMANO] ─► Sentinela ─► Tribuno │
  (descoberta)   (triagem)│ (análise)(habilit.)(docs+planilha)  (aprova)   (acompanha) (recurso) │
                          └──────────────────── Lastro (governança/proveniência) ────────────────┘
```

## Os agentes

| Arquivo | Nome | Aba | Responsabilidade | Modelo padrão | Saída (tipo `noyce-model.ts`) |
|---|---|---|---|---|---|
| `maestro.md` | Maestro 🎼 | — | Orquestra a esteira; aplica gates humanos | Opus 4.8 | pipeline state |
| `faro.md` | Faro 🔭 | Monitorar/Mesa | Descoberta + triagem Vai/Olha/Pula | **Haiku 4.5** (volume) | `DiscoveryTriage` |
| `prisma.md` | Prisma 🔬 | Analisar | Julga oportunidade, preço, concorrência, risco | Opus 4.8 | `AnalysisRun` |
| `forja.md` | Forja 🛡️ | Habilitar | Casa acervo/CCP × edital; gaps; consórcio | Opus 4.8 | `HabilitationResult` |
| `escriba.md` | Escriba ✍️ | Habilitar/Entregar | Proposta `.docx` + **planilha `.xlsx`** + declarações | Opus 4.8 (Fable 5 nos críticos) | conteúdo estruturado → render |
| `sentinela.md` | Sentinela ⏱️ | Acompanhar | Vigia prazo/sessão; alerta | Haiku 4.5 | `OperationalState` |
| `tribuno.md` | Tribuno ⚖️ | Recorrer | Avalia fundamento + minuta recurso | Fable 5 / Opus 4.8 | minuta + parecer |
| `lastro.md` | Lastro 🧭 | Governança | Auditoria de proveniência (guardrail, não LLM livre) | — | relatório de auditoria |

## Provider — decisão 15/Jun: **tudo Claude por enquanto**

Todos os agentes rodam em **Claude** agora (cliente default `clients/claude-client.ts`), com tiering de custo **dentro da Claude**: Haiku 4.5 no volume (Faro/Sentinela), Opus 4.8 no raciocínio (Prisma/Forja/Escriba), Fable 5 no crítico (Tribuno). O teste cego (15/Jun, n=4 editais) **comprovou paridade do GPT-5.5** na análise/habilitação/consórcio a ~metade do custo do Opus — fica como **opção pronta para depois** (a camada é provider-agnóstica: troca-se o modelo/cliente por agente sem mexer no runtime). Por ora, **não ligar GPT/Gemini**.

## Invariantes da squad (valem para TODOS)

1. **Proveniência obrigatória** — toda afirmação factual cita fonte (chunk RAG / cláusula edital / campo PNCP). Sem fonte → `PENDENTE_DADO`.
2. **Atos vinculantes = humano** — lance, declaração, proposta, recurso: o agente **prepara**, o humano **aprova/clica** (`HUMAN_REQUIRED_ACTS`).
3. **Número fora da LLM** — valores/prazos/quantitativos vêm de dado estruturado; a LLM referencia, nunca inventa.
4. **Saída estruturada** — todo agente devolve JSON validado (`output_config.format`) nos tipos de `noyce-model.ts`.
5. **Edital fechado ≠ oportunidade** — `isDeadlinePassed` filtra antes da Mesa.

## Como o runtime usa estes arquivos

```ts
// agent-runtime.ts (esboço)
const def = loadAgentDefinition("faro");          // este .md
const system = buildSystemPrompt(def);            // persona + core_principles + invariantes
const context = await assembleContext(edital);    // RAG + CCP/acervo + edital + constantes legais
const out = await client.messages.parse({ model: def.model, system, output_config: { format: def.schema }, ... });
return guardrails.validate(out, def);             // proveniência, prazo, ato humano, schema
```
