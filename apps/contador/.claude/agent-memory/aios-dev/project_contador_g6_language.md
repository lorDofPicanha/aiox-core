---
name: contador-g6-language
description: G6 safe-fiscal-language constraint enforced by the banlist gate in apps/contador
metadata:
  type: project
---

G6 (CONTEXT §5 #4; doc 45 §5) is a hard, machine-checked constraint in `apps/contador`. The gate is `scripts/banlist-g6.mjs` (`npm run banlist:g6`, also run via `prebuild`). It scans `app/**` + `components/**` for forbidden fiscal claims.

**Why:** the product sells defensibility to accountants; promising "crédito garantido", "apuração correta", "elimina multa", "prova jurídica plena", "garante", "a IA decide", "substitui contador" would be false and legally dangerous.

**How to apply:**
- The detector is negation-aware: a banned term is allowed when a negation cue (`não`, `nunca`, `nada`, `sem`, `nem`, `depende`, `promete`/`afirma` in disclaimer phrasing) appears within ~180 chars before it, OR a qualifier like "depende de…" follows. So disclaimers that cite a term to deny it pass.
- Safe vocabulary: "indício", "evidência", "trilha verificável", "revisão humana", "estimativa ilustrativa", "sujeito a análise/revisão do tributarista habilitado", "sugerimos revisar".
- Human-in-loop is design, not a footnote: actions SIGNAL/flag for the accountant's decision; never auto-resolve or promise an outcome.
- Self-test: `npm run banlist:g6:self-test` proves the detector catches a planted bad term and ignores a negated one.

Related: [[contador-module-pattern]].
