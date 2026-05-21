---
name: project-slide-creator-skill-18mai
description: External slide-creator skill (Opção B integration) wrapped as @slide-creator agent (Sloan). Skill bundle nested wrong — needs manual flatten. 10 architectural lessons documented for AIOS adoption.
metadata: 
  node_type: memory
  type: project
  originSessionId: 68a3d76b-c640-4fbc-be2b-a6a40d1b73fb
---

🟡 **Skill integrada parcialmente 18/Mai.** External `slide-creator.zip` (Anthropic skill format, narrative-first deck creation, ~7.830 linhas, 67 arquivos) analisada e wrappeada como AIOS agent.

**Estado atual:**
- ✅ Agent file criado: `.aios-core/development/agents/slide-creator.md` (persona Sloan ♍ Virgo, Narrative Architect, 22.6KB)
- ✅ Entity registry atualizada: `entity-registry.yaml` agora tem 1326 entidades (slide-creator entry @ linha ~26628)
- ⚠️ Skill bundle NESTED ERRADO: `.claude/skills/slide-creator/slide-creator/SKILL.md` (deveria ser `.claude/skills/slide-creator/SKILL.md`)
- ⚠️ Cleanup `mv` foi BLOCKED pelo Claude Code auto-mode classifier (Self-Modification em `.claude/skills/`)

**Founder action manual necessária:**
```powershell
cd D:/AIOS/.claude/skills/slide-creator
mv slide-creator/* .
rmdir slide-creator
rm -rf __MACOSX
```

**Why:** O wrap via Bash mv foi bloqueado por security classifier. Após flatten manual, agent `@slide-creator` funciona end-to-end.

**How to apply:**
- Quando precisar criar deck (sales/board/webinar/keynote/pitch) → `@slide-creator *create-deck {brief}`
- Para deck rápido → `*quick-deck`
- Para melhorar deck ruim → `*improve-deck` (usa regression fixtures)
- Para validar package → `*score-deck` (roda 5 validators Python)

**Architectural lessons documentadas** (10 padrões de design que AIOS deveria adotar):
1. Separação 3-tier: contract / knowledge / validators
2. `pick_when[]` + `skip_when[]` em cada artefato (arrays explícitos)
3. `block_if[]` hard-coded (gates determinísticos, não LLM judgment)
4. Decision tree EXPLÍCITO no contract (não delegado ao LLM)
5. Validators Python determinísticos FORA do LLM
6. `absorbed_from` como first-class field (provenance auditável)
7. Three-tier lazy loading (SKILL.md sempre → references on-trigger → templates on-select)
8. Output contracts numerados com schemas
9. Regression fixtures — falha vira gate
10. Schemas separados de instances (`schemas/*.schema.yaml`)

**Lição mestre:** "O LLM não decide; o contract decide. O LLM só executa o ramo já documentado." slide-creator inverteu paradigma — reduz custo de inferência 30-40% e aumenta reprodutibilidade.

**9 projetos open-source absorbidos pela skill original:** Presenton, PPTAgent, ppt-master, presentation-ai, banana-slides (AGPL caveat), powerpoint-skill, slide-deck-ai, PresentAgent-2, deepH. Matriz completa em `.claude/skills/slide-creator/references/bench-absorption-map.md`.

**Composição da skill:**
- SKILL.md (239 lh, contract operacional)
- references/ (10 markdown, 2.450 lh, lazy-loaded)
- templates/ (44 YAML, 4.193 lh: 45 roteiros + 240+ structures + 18 visual + 11 runtime + 6 schemas + 6 QA gates)
- scripts/ (5 Python: validate_chart_data, validate_deck_package, check_pptx_placeholders, build_evidence_ledger, build_template_examples)
- wireframes/ (5 HTML refs)

**Quality bar:** weighted score (Narrativa 30 / Editorial 25 / Proof 15 / Didático 10 / CTA 10 / Técnico 10), block_if <75 = "diagnostic draft", <85 = revise.

**Triggers:** `vai com slide-creator {projeto}`, `cria deck {topic}`, `score deck {path}`, `flatten skill manual feito`, `aplica lesson N em aios`.

Related: [[session_anipis_squad_08mai]] (precisa de deck pra clinical advisor), [[session_tocks_master_assets_06mai]] (assets prontos para deck de apresentação Tocks), [[project_design_squad_rebuild]] (squad design existente, agora ganha narrative deck capability).
