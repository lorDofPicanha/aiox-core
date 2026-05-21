---
name: hydra-mega-research-15mai-squad-ai-completo
description: Squad-AI mega research via HYDRA real pipeline — 1/32 squads done. 5352 fetched / 252 distributed. Anthropic+OpenAI quota exceeded mid-run. Pattern validated. 31 squads pendentes.
metadata:
  type: project
  originSessionId: 4caaf143-bfd8-4b9f-88f9-0c482fa87ad5
---

# HYDRA Mega Research 15/Mai — Squad-AI Completo (1/32)

## 🎯 Decisão estratégica do user

User rejeitou Caminho B/C (Claude agent curando dossier JSONL) e exigiu **HYDRA pipeline real**. Regra adicional: **≥4000 items por squad**.

Pivot: matei caminho do agent (general-purpose pesquisando 18 sources curated) e fui HYDRA pipeline puro.

## 🏗️ Estrutura criada/atualizada

### `.aios-core/data/jarvis-mind-clone-index.json`
- **Antes:** 115 clones
- **Depois:** 126 clones (+11 squad-ai members)
- 11 entries novos: andrew-ng, andrej-karpathy, chip-huyen, cassie-kozyrkov, harrison-chase, jerry-liu, alan-nichol, timnit-gebru, swyx, lilian-weng, jim-fan
- Todos com department=`ai-science`, source=`aios`, keywords inferidas do role descriptor

### `tools/hydra/src/config/routing.yaml`
- `forced_routes.ai-ml` agora tem 18 entries: 15 squad-ai members + 3 AIOS consumers (architect, dev, aios-master)

### `tools/hydra/src/config/sources.yaml`
- Caps `max_items` removidos de 8 sources (lifted permanente pra futuros runs)
- Total: 115 sources cadastradas em 9 domains

## 📊 Resultados pipeline (run v2 mega — 7386s = 2h03min)

| Métrica | Valor |
|---|---|
| Fetched | **5352** ✅ (passa 4000) |
| Filtered (content rules) | 3045 |
| Duplicates | 1525 |
| Processed | 253 |
| **Ingested KB** | **249** |
| **Distributed** | **252** itens |
| Clones recebendo | 24 (do total 126) |
| Tiers | S=124, A=129, B=3, C=1 |
| Errors API (OpenAI 429 quota) | 529 |
| LLM Provider | openai/gpt-4o-mini |

**Diversity warning:** ArXiv cs.AI dominou 99% — blogs (LangChain/Anthropic/OpenAI engineering/Simon Willison) foram filtered ou quota'd.

## ✅ Validação per-member feeds (15/15 ✅)

```
4 seniors (forced_routes ai-ml desde antes — feed cumulativo v1+v2+anteriores):
  demis-hassabis      657KB / 10.597 lines
  fei-fei-li          657KB / 10.597 lines
  ilya-sutskever      655KB / 10.580 lines
  yann-lecun          656KB / 10.580 lines

11 novos members (só recebido do v2 hoje):
  andrew-ng           5.8KB / 120 lines
  andrej-karpathy     5.9KB / 120 lines
  chip-huyen          5.8KB / 120 lines
  cassie-kozyrkov     5.8KB / 120 lines
  harrison-chase      5.8KB / 120 lines
  jerry-liu           5.8KB / 120 lines
  alan-nichol         5.8KB / 120 lines
  timnit-gebru        5.8KB / 120 lines
  swyx                5.4KB / 112 lines
  lilian-weng         5.4KB / 112 lines
  jim-fan             5.4KB / 112 lines

TOTAL clones com feed hoje: 111
```

## 🔴 Bloqueador descoberto: budget LLM API

**Dois providers zeraram quota num único run mega.**
- Anthropic (v1): 763 errors `credit balance too low`
- OpenAI (v2): 529 errors `429 quota exceeded`

Pra 32 squads, sequential mega-runs cobrindo todos domains, estimativa:
- $300-500 em API se sequenciar com top-ups
- OU bypass LLM (skip extractor, route por keyword+authority only) → custo $0 mas qualidade menor
- OU adicionar `DEEPSEEK_API_KEY` (10-20x mais barato)

## 🛠️ Estado dos arquivos pós-run

| Arquivo | Estado |
|---------|--------|
| `.env` | Restaurado (ANTHROPIC + OPENAI ambos habilitados, HYDRA_MODEL=claude-sonnet-4-5) |
| `sources.yaml` | Restaurado para 115 sources full, **caps lifted permanente** |
| `routing.yaml` | Atualizado com forced_routes 15 squad-ai members |
| `jarvis-mind-clone-index.json` | 126 entries (gained 11) |
| Logs | `hydra-data/runs/squad-ai-run.log` (v1) + `mega-run.log` (v2 2h03) |
| Feed dir | `D:/jarvis/mega brain/knowledge-feed/{clone-id}/2026-05-15-hydra-feed.md` (111 clones) |

## 📋 TaskList Status (10/32 visíveis)

- ✅ #1 Squad-AI (15 members feeds OK)
- ⏳ #2 squad-engineering (~10 clones, domain `engenharia` — 56 sources OK pra 4000)
- ⏳ #3 squad-platform
- ⏳ #4 squad-data
- ⏳ #5 squad-security
- ⏳ #6 marketing-traffic (já validado 15/Mai — pode pular o pipeline novo)
- ⏳ #7 squad-sales + sales-ops
- ⏳ #8 squad-product + product-research
- ⏳ #9 squad-content
- ⏳ #10 squad-design

Faltam tasks #11-32 (squad-research, squad-executive, executive-team, innovation, squad-behavioral, squad-health, health-tech, health-data, design-terapeutico, therapy, customer-ops, squad-customer-success, squad-community, squad-education, ai-science, legal, squad-legal, squad-finance, squad-operations, squad-people, expert-council).

## 🎯 Pattern validado pra reutilizar nos 31 squads restantes

```
Per squad:
1. Identify squad's domain(s) em routing.yaml (engenharia, marketing, etc.)
2. Confirm squad members existem em jarvis-mind-clone-index.json
   - Se não: extrair keywords do role descriptor de squad.yaml + add ao index
3. Adicionar squad members ao forced_routes[domain] em routing.yaml
4. (Opcional) Filter sources.yaml pra domain ou rodar mega run cobrindo todos
5. HYDRA_SKIP_VECTOR_STORE=1 node --max-old-space-size=8192 bin/hydra.js run --verbose
6. Validar feeds em D:/jarvis/mega brain/knowledge-feed/{member}/
```

**Domain-by-domain coverage de sources.yaml:**
```
engenharia:    56  ← bate 4000 fácil
ai-ml:         50  ← validado 5352 fetched
negocios:      21  ← provavelmente 1500-2500
cybersecurity: 18  ← ~1000-1500
marketing:     11  ← ~700-1000 (squad já validado 15/Mai)
design-interiores: 3
design-systems: 2
saude-mental:  2
legal:         1
```

Domains baixos (design-interiores, design-systems, saude-mental, legal) precisam **suplemento de sources** antes do squad correspondente atingir 4000.

## 🔗 Triggers retomar

- `continua hydra squad N` — próximo squad da lista priorizada
- `top-up anthropic + retomar hydra` — quando user adicionar crédito
- `troca pra deepseek hydra` — adicionar DEEPSEEK_API_KEY + retry
- `bypass llm scoring hydra` — modo skip-extractor (qualidade menor, $0 LLM)
- `expandir sources domain X` — antes de rodar squad de domain com poucos sources

## 🎓 Lições

1. HYDRA pipeline REAL funciona ponta-a-ponta (fetch → filter → score → extract → distribute). Provado.
2. Distribution bug 14/Mai foi resolved (15/Mai forced_routes corrigido) — confirmado: items distribuídos pra 24 clones.
3. Mega run único é 7x mais eficiente que 32 sequenciais (2h vs 14h+).
4. Diversity gating do HYDRA agressivo — ArXiv 99% dominou. Pra forçar diversidade, ajustar `max_source_share` em config.
5. Budget LLM é o gargalo real, não infra. Pre-filter mais agressivo (size, age, language) pode reduzir LLM calls em 50%+.
6. Index `jarvis-mind-clone-index.json` precisa script auto-rebuild — atualmente manual ao adicionar clones.

**Why:** Squad-ai consolida fase 1 do plano original 12/Mai (AI orchestration mega research). Os 4 seniors viram knowledge canon (~10k linhas cada). 11 novos têm bootstrap.

**How to apply:** Próximo squad usa mesmo pattern. Quando user topar provider, rodar mega-run cobrindo todos domains que faltam.
