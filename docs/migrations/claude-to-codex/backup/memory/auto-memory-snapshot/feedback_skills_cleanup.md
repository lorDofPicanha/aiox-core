---
name: Skills Cleanup — Delete Imported, Keep Native Only
description: 4,588 imported skills deletados por não serem consumidos por nenhum runtime. Só 15 nativos + 165 mind clones funcionam de verdade.
type: feedback
originSessionId: a66a9b8a-0757-4ed9-bfec-6858fa61845a
---
Skills importados (.claude/skills/imported/) NUNCA foram consumidos pelo AIOX runtime. SkillsEngine, SkillDispatcher e Claude Code operam independentemente. Curated-skills.json e registry.json eram metadata morta.

**Ação tomada (10/Abr/2026):**
- Deletados: 4,588 SKILL.md importados, registry.json, curated-skills.json
- Mantidos: 15 nativos + 165 mind clones em native/ + 5 standalone .md
- Total agora: 185 SKILL.md files

**Why:** 4,588 arquivos causavam scan pesado no startup sem benefício. Nenhum código runtime lia os importados.
**How to apply:** Não re-importar skills em massa. Se precisar de skills novos, criar nativos via /skill-creator. O limite MAX_SKILLS_PER_AGENT=300 existe no skills-engine.js como guard.
