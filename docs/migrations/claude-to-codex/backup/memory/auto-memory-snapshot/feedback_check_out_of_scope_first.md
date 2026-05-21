---
name: Check .out-of-scope/ before proposing
description: Before proposing approach in any project, grep .out-of-scope/ for known rejections. Pattern adopted from mattpocock/skills 05/Mai/2026.
type: feedback
originSessionId: 09b2e57c-7c0a-4b78-b991-87164fbc7336
---
Antes de propor qualquer approach (architecture, ad strategy, design pivot, tech choice), fazer:

```bash
grep -ri "{keyword}" .out-of-scope/
```

**Why:** Pattern adopted 05/Mai/2026 do mattpocock/skills. Rejeições documentadas vivem em `.out-of-scope/{slug}.md` com why + when + trigger to revisit. MEMORY.md já estourou 34KB > limite 24KB porque rejeições viviam só lá. Grep em `.out-of-scope/` é searchable, escalável, scoped por projeto.

**How to apply:**
- Antes de propor em sessões futuras: grep keywords primeiro
- Quando user/conclave/mind clones rejeitarem algo novo: criar `.out-of-scope/{slug}.md` seguindo template em `.out-of-scope/README.md`
- Ao trabalhar em projeto: ler `docs/projects/{project}/00-context/CONTEXT.md` (que linka rejeições relevantes via section 8 "Known Dead Ends")

**Seed inicial 05/Mai/2026 (9 rejeições migradas de MEMORY.md):**
- bretda-meta-events-with-value
- luxury-redesign-without-benchmark
- meta-bulk-create-activate-fresh-account
- mocked-database-tests
- polymarket-non-weather-verticals
- polymarket-synth-markets
- tocks-pivot-outcome-conversions
- tocks-shopping-google-ads
- vorza-ai-creatives-generic

Skill `diagnose` (`.aios-core/development/tasks/diagnose.md`) já chama essa verificação no Step 0.
