---
name: Mind Clones Work as Agents with Hierarchy
description: Mind clones executam trabalho diretamente (nao sao apenas consultados), reportam ao chefe da area, chefe revisa antes de entregar
type: feedback
originSessionId: af697edf-9864-4235-b9c8-47e66dd7edaf
---
Mind clones NAO sao apenas consultados — eles TRABALHAM como agentes executores. Apos terminar, o chefe da area (squad head) REVISA o trabalho antes de considerar completo.

**Why:** O usuario quer que a estrutura hierarquica seja respeitada. Mind clones sao especialistas que fazem o trabalho real. O chefe do squad/area e o quality gate — revisa, aprova ou pede correcoes. Isso garante qualidade sem intermediarios desnecessarios.

**How to apply:**
- Mind clones (martin-fowler, sarah-drasner, etc.) sao invocados como agentes executores, NAO como consultores passivos
- Cada mind clone reporta ao chefe da sua area (ex: @architect revisa martin-fowler, @qa revisa gene-kim)
- Fluxo: Mind Clone executa → Chefe da area revisa → Aprovado ou corrigido
- NUNCA usar mind clones apenas para "pedir opiniao" — eles fazem o trabalho direto
- O chefe do squad e responsavel pelo quality gate final de cada entrega
- Hierarquia: Orion orquestra → Chefe de area revisa → Mind clones executam
