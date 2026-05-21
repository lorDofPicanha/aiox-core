---
name: Memorix — Procedural Learning System
description: Sistema de memória procedural dos agentes AIOX. Experience Store + Dreaming Engine + Lesson Extractor. Conectado ao pipeline em 10/Abr/2026.
type: project
originSessionId: a66a9b8a-0757-4ed9-bfec-6858fa61845a
---
## Memorix — Agent Procedural Memory

**Status:** CONECTADO E FUNCIONANDO (10/Abr/2026)
**Local:** `.aios-core/core/corporation/memory/`

### Módulos

| Módulo | Arquivo | Status |
|--------|---------|--------|
| ExperienceStore | experience-store.js | Ativo — persiste em .aios-core/data/experience-store.json |
| ExperienceRecorder | experience-recorder.js | **NOVO** — bridge entre execução e memória |
| ExperienceRetriever | experience-retriever.js | Ativo — busca experiências por relevância |
| LessonExtractor | lesson-extractor.js | Ativo — extrai lições de success/failure |
| DreamingEngine | dreaming-engine.js | Ativo — consolidação noturna de padrões |
| DreamScheduler | dream-scheduler.js | Ativo — agenda ciclos de dream |

### Pipeline

```
TaskRouter.complete() → ExperienceRecorder.recordFromTaskRouter()
CorporationHooks.onAgentCompletion() → ExperienceRecorder.recordFromHooks()
  → ExperienceStore.record() → experience-store.json
    → DreamingEngine.dream() → Patterns + Insights + Dream Reports
```

### Integração feita (10/Abr/2026)

- `task-router.js` — plugou recordFromTaskRouter() no complete()
- `corporation-hooks.js` — plugou recordFromHooks() no onAgentCompletion()
- Recorder tem dedup (5s window), graceful fallback, stats tracking

### Teste real

- 18 experiências gravadas de 5 agentes
- 1 insight detectado: "Agent dev has 60% failure rate (3/5)"
- DreamingEngine precisa min 3 ocorrências do mesmo taskType pra detectar patterns
- Vai acumular dados naturalmente com uso

**Why:** Agentes não tinham memória procedural — cada sessão começava do zero. Agora experiências são gravadas e consolidadas.
**How to apply:** Memorix funciona automaticamente. DreamingEngine pode ser rodado com `node .aios-core/core/corporation/memory/dreaming-engine.js`. Dream reports em .aios-core/data/dream-reports/.
