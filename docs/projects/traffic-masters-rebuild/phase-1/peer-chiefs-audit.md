# Peer Chiefs Audit — Pattern Extraction

**Sources read:** `copy-chief.md`, `design-chief.md`, `cyber-chief.md`, `story-chief.md`, `data-chief.md`, `legal-chief.md`, plus reference to `traffic-masters-chief.md` (current broken).

---

## Common Structural Patterns (Across 6 Peer Chiefs)

All peer chiefs share this canonical structure:

```
1. YAML frontmatter (name, description, model: opus, tools, permissionMode, memory: project)
2. Section 1: Persona Loading (read `.claude/commands/{Domain}/agents/{chief}.md`)
3. Section 2: Context Loading (mandatory):
   - git status + log
   - .aios/gotchas.json (filtered by domain)
   - .aios-core/data/technical-preferences.md
   - .aios-core/core-config.yaml
   - Domain KB (squads/{domain}/data/{domain}-kb.md)
4. Section 3: Mission Router (table grouping by sub-domain → task file → specialist)
5. Section 4: Tier System (Tier 0/1/2 hierarchy)
6. Section 5+: Decision matrices, routing logic, frameworks
7. Section N-2: Autonomous Elicitation Override (skip "ask user", document AUTO-DECISION)
8. Section N-1: Quality Checklist / Gates
9. Section N: Constraints (NEVER/ALWAYS rules)
```

---

## What Works Well to Copy (Best Practices)

### From copy-chief.md
- **Tier 0 ALWAYS first** rule — applies to traffic-masters perfectly (Molly diagnose → specialist)
- **Quality Control sub-section** with explicit task names (`audit-copy-hopkins.md`, `sugarman-30-triggers-check.md`) — should mirror with `account-audit.md`, `pre-launch-checklist.md`
- **Path resolution block** at end of each section (squads + .aios-core fallback)
- **Anti-patterns explicit** ("NEVER say '31 triggers' (it's 30!)") — encode known confusion points

### From design-chief.md
- **Multi-Specialist Workflows section** with named sequences (Full Rebrand, YouTube Optimization)
- **Keyword-Based Routing as YAML block** — easy to extend
- **Routing Decision Matrix** as flat table mapping request → specialist → why
- **Handoff Protocol template** as code block with placeholders

### From cyber-chief.md
- **Urgency Levels table** (CRITICAL/HIGH/MEDIUM/LOW) — perfect mirror for traffic crisis (saldo zerado = CRITICAL)
- **Triage rapid mode** — same shape needed for "diagnose this collapsing account"
- **Specialist routing matrix per problem type** with concrete examples ("VPS exposed", "N8N no auth")

### From data-chief.md
- **GOLDEN RULE in bold** ("Nunca implemente uma métrica sem passar por pelo menos 1 fundamentador") — needs traffic equivalent
- **Decision Matrix by Question** format ("Quem são nossos melhores clientes? → @peter-fader") — mirror with "Saldo R$0 hoje? → @molly-pittman crisis"
- **Anti-Patterns section explicit** ("NUNCA do these")
- **So What Validation checklist** — adopt as "ROI What Validation"

### From story-chief.md
- **Framework Selection by Length matrix** — adapt as "Specialist Selection by Account Stage"
- **Quality Checklist as bullet list** before delivery — adopt for pre-launch ad

### From legal-chief.md
- **Routing Decision Tree as pseudocode** (`IF investimento → @brad-feld`)
- **Tools (Validation) sub-section** explicit per tier — exactly what traffic needs (validation tasks like `pre-launch-meta.md`)
- **Legal Disclaimers always at end** — traffic equivalent: ROI/result disclaimers ("Esta projeção depende de variáveis não controláveis")

---

## What's MISSING in traffic-masters-chief vs Peers

| Missing Element | Severity | Where peers have it |
|---|---|---|
| **Persona file path resolves** (file doesn't exist) | CRITICAL | All peers reference real `.claude/commands/{Domain}/agents/` files |
| **Specialists exist** (7 referenced, 0 exist) | CRITICAL | All peers have specialists in `squads/{domain}/agents/` or `.aios-core/development/agents/` |
| **Task files exist** (referenced in router, 0 exist) | CRITICAL | All peers have tasks in `squads/{domain}/tasks/` |
| **Squad data directory** | HIGH | All peers have `squads/{domain}/data/` |
| **MCP tooling section** | HIGH | NONE of the peers have MCP-specific section, but traffic-masters NEEDS it (52 tools) |
| **Quality Checklist before delivery** | HIGH | story-chief, copy-chief have explicit pre-delivery checklist |
| **Multi-specialist workflows** | MEDIUM | design-chief has 4 named workflows (Full Rebrand, etc.) — traffic needs (account-audit, new-campaign, scale, crisis) |
| **Urgency Levels** | MEDIUM | cyber-chief has — traffic critical (saldo zerado, OAuth expired) |
| **Anti-patterns explicit** | MEDIUM | data-chief has — traffic needs (no Shopping for Bretda/Tocks, no >+30% budget jump, etc.) |
| **Pre-Action Protocol** | HIGH | NONE of peers have — traffic needs (jarvis consult triggers + budget jump check + smoke test) |
| **Post-Action Protocol** | HIGH | NONE of peers have — traffic needs (publish_aios_insights + memory updates) |
| **Account Context Loader** | HIGH | NONE of peers have — traffic needs (Pocock-style `docs/projects/{account}/00-context/CONTEXT.md` read) |
| **Crisis Response Protocol** | HIGH | NONE of peers have — traffic needs (saldo crítico, OAuth expirado, pixel quebrado, CPL 2x) |

---

## Best Peer-Chief as TEMPLATE for Rebuild

**Recommendation: copy-chief.md** is the strongest template because:

1. **Tier 0 mandatory diagnosis** matches traffic ("diagnose first, execute second")
2. **Quality Control sub-section explicit** matches traffic ("Hopkins audit" ≈ "pre-launch checklist")
3. **Anti-patterns inline with constraints** matches traffic ("never say 31 triggers" ≈ "never +50% budget")
4. **Specialist Selection Logic table** with row-per-scenario matches traffic perfectly
5. **Path resolution** block format is clean

**Augment with:**
- cyber-chief Urgency Levels (CRITICAL/HIGH/MEDIUM/LOW)
- design-chief Multi-Specialist Workflows
- data-chief Decision Matrix by Question + Anti-Patterns explicit
- legal-chief Tools (Validation) per tier
- **NEW (no peer has):** MCP Tooling Map + Pre/Post-Action Protocols + Account Context Loader + Crisis Response Protocol

---

## Structural Recommendation for Rebuilt traffic-masters-chief.md

```
1. YAML frontmatter
2. Section 1: Persona Loading (FIXED PATH)
3. Section 2: Context Loading (mandatory) — adds Account Context Loader (Pocock pattern)
4. Section 3: Mission Router (COMPLETE) — fixed task paths
5. Section 4: Tier System (CRITICAL) — kept similar
6. Section 5: MCP Tooling Map (NEW) — 52 tools by group + specialist authority
7. Section 6: Pre-Action Protocol (NEW) — jarvis consult + guardrails + smoke test triggers
8. Section 7: Post-Action Protocol (NEW) — insights publish + memory updates
9. Section 8: Account Context Loader (NEW) — read CONTEXT.md before any account work
10. Section 9: Crisis Response Protocol (NEW) — urgency levels + escalation
11. Section 10: Quality Gates (NEW) — pre-launch mandatory checks
12. Section 11: Multi-Specialist Workflows — adapted from design-chief
13. Section 12: Routing by Platform/Objective — kept similar
14. Section 13: Decision Tree — kept
15. Section 14: Handoff Protocol — kept
16. Section 15: Vocabulary
17. Section 16: Anti-Patterns (NEW explicit)
18. Section 17: Autonomous Elicitation Override
19. Section 18: Constraints (NEVER/ALWAYS)
```

This grows from current 11 sections to 19 sections, but each new section addresses a documented production failure mode from the memory.
