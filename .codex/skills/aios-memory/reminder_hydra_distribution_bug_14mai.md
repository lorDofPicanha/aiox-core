---
name: hydra-distribution-bug-14-mai
description: HYDRA pipeline ingere OK mas distribui ZERO. Bug confirmado mind-clone-router. Pendente fix.
metadata: 
  node_type: memory
  type: reminder
  originSessionId: 69c49007-4de6-4a71-bd15-84d4d2542d49
---

## ✅ RESOLVED 15/Mai — HYDRA Distribution Working

**Status:** RESOLVIDO 15/Mai/2026 ~02:30. Bug do router fixado pelo user (em sessão paralela). Orion adicionou os 7 traffic specialists ao jarvis-mind-clone-index.json (96→103 clones). End-to-end validado: Unbounce CRO Tier A → 3/7 specialists relevantes (molly-pittman, kasim-aslam, nicholas-kusmich). Feed format OK em D:/jarvis/mega brain/knowledge-feed/{specialist}/2026-05-15-hydra-feed.md.

---

## 🔴 ORIGINAL BUG (referência)

**Data:** 2026-05-14
**Pipeline run:** completou em 56min, ingested 231 items (54 S, 178 A, 53 B, 9 C), distribuiu 0.

### Sintoma exato

`Distribution: 284 items -> 0 clones`

NÃO é só os 7 traffic specialists novos. ZERO distribuição pra TODOS os 96 clones existentes (alex-hormozi, seth-godin, etc.).

### Root cause hipóteses

1. **Field mismatch**: sources.yaml usa `domains: ["marketing"]` mas mind-clone-router pode estar lendo outro field (department? tags?)
2. **routing.yaml staleness**: arquivo foi atualizado mid-pipeline (comentário "Fixed 2026-05-14 (Orion)") mas pipeline rodou com versão antiga
3. **Index path resolution**: router resolve `../../../.aios-core/data/jarvis-mind-clone-index.json` — pode estar lendo empty
4. **Score threshold**: `min_relevance_score: 0.3` — todos items podem estar abaixo (score = 0.6×kw + 0.3×dept + 0.1×tier)

### Estado dos arquivos

- `D:/jarvis/mega brain/knowledge-feed/{molly-pittman,depesh-mandalia,kasim-aslam,tom-breeze,nicholas-kusmich,ralph-burns,pedro-sobral}/` = TODAS dirs vazias (0 files)
- `.aios-core/data/jarvis-mind-clone-index.json` = 96 clones, NENHUM dos 7 traffic specialists
- `D:/AIOS/tools/hydra/src/distribution/mind-clone-router.js` = código intacto

### Sources adicionadas que funcionaram

9 das 11 paid traffic sources fetched OK em sources.yaml:
- ✅ DigitalMarketer Blog (6), Smart Marketer (10), Search Engine Land (10), Search Engine Journal (20), Social Media Examiner (20), MarTech (10), Adweek (10), WordStream (10), Rock Content (10)
- ❌ ConversionXL (XML entity error), Resultados Digitais (feed format error)

### Fix path quando retomar

```bash
# 1. Adicionar 7 traffic specialists ao index (após Sprint 1 criar agents/.md files)
node .aios-core/development/scripts/build-mind-clone-index.js  # se script existir
# OU manual: editar jarvis-mind-clone-index.json adicionando 7 entries com {id, name, department: "marketing", source: "aios", keywords: [...]}

# 2. Debug router antes de re-rodar:
cd D:/AIOS/tools/hydra
node -e "import('./src/distribution/mind-clone-router.js').then(m => console.log(m))"
# Verificar se loadMindCloneIndex() retorna 96 entries (não 0)

# 3. Re-rodar pipeline com cache (deve ser rápido):
HYDRA_SKIP_VECTOR_STORE=1 node --max-old-space-size=4096 bin/hydra.js run --sources rss --verbose
```

### Estado do .env

- Anthropic API estava overloaded 14/Mai — comentei e usei OpenAI fallback
- **RESTAURADO** 14/Mai 21:55 (Anthropic + HYDRA_MODEL=claude-sonnet-4-5 voltaram)

### Triggers pra retomar

- `fix hydra distribution`
- `add traffic specialists to clone index`
- `re-rodar hydra pipeline traffic`

**Why:** Sem distribuição, HYDRA escava ouro mas joga fora. Os 231 items ingested são research valioso pra paid traffic — só falta entregar pros consumidores certos. Fix é provavelmente <1h se conseguir reproduzir bug.

**How to apply:** Spawn aios-architect ou aios-dev pra debug `mind-clone-router.js` step-by-step com 1 item de teste. Adicionar logging detalhado pra entender onde o score = 0.
