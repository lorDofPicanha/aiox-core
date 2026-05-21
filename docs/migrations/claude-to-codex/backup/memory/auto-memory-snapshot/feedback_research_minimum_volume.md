---
name: research-minimum-volume
description: "🆕 15/Mai/2026 — Toda pesquisa (HYDRA, mega research, squad research, brainstorm com inputs externos) precisa ter VOLUME MÍNIMO de 4000 items processados. Pipelines menores são insuficientes."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6bca5a3d-67f9-4ad9-a3f3-1c5310fef7af
---

# Research Minimum Volume — 4000 items

**Regra:** Toda pesquisa que envolva ingestão de fontes externas (HYDRA pipeline, squad research, multi-source synthesis) precisa atingir **volume mínimo de 4000 items**.

**Why:** 15/Mai/2026 — Pipeline HYDRA CRM rodou com 73 sources e fetchou apenas ~105 items, distribuiu 20. User reagiu: "isso é muito pouco para o que o HYDRA faz, ele pode consumir até 1000 items" → escalou de novo pra 4000+. Volume baixo = research raso, conclusões superficiais. HYDRA foi projetado pra escala alta (filter S/A/B/C tiering, AI slop detection, anti-echo-chamber) — usar sub-volume desperdiça a infraestrutura.

**How to apply:**

1. **Configuração mínima de sources HYDRA:**
   - 100+ sources distintas (RSS + GitHub + web + youtube + podcast quando aplicável)
   - max_items por source: 50-200 (não 15-30)
   - max_age_days: 1095 (3 anos) para conteúdo evergreen
   - filtros AI slop relaxados (max_filler_ratio 0.35, min_lexical_diversity 0.28)

2. **Target fetch/process:**
   - Fetched: 4000+ items
   - Processed (after filter): 1500-3000
   - Distributed: 500-1500
   - Clones recebendo feeds: 50-100+

3. **Pre-flight check antes de rodar pipeline:**
   - `grep -c "name:" configs/squads/{squad}/sources.yaml` → deve ser >100
   - Memory: `--max-old-space-size=8192` (8GB) ou maior
   - `HYDRA_SKIP_VECTOR_STORE=1` mantido (OOM hotfix válido)

4. **Squad research direto (alternativa quando HYDRA pipeline tá quebrado):**
   - Mínimo 6-8 subagents em paralelo, cada um cobrindo ângulo distinto
   - Cada subagent deve consumir 200-500+ sources via WebSearch/WebFetch
   - Total: 1200-4000 fontes consumidas

**Aplicado a:**
- CRM Novo (15/Mai)
- Próximas mega-research (high-ticket, anipis, qualquer novo projeto)
- HYDRA squad expansions

**NÃO aplicar a:**
- Quick lookups single-source
- Bug fixes pontuais
- Tarefas que não envolvem síntese cross-source
