---
name: DESIGN.md Knowledge Integration
description: Integração do Google DESIGN.md spec + 69-brand awesome-design-md library nos 5 design agents do AIOS via HYDRA (27/Abr/2026)
type: project
originSessionId: 2df7be6b-1324-4a01-a9a0-779117d9a7d7
---
## DESIGN.md Integration — 27/Abr/2026

**Status:** COMPLETO. 4/4 tasks done, staged (não-commitado).

### O que foi integrado

1. **Google `@google/design.md` v0.1.1** instalado como devDep (`D:/AIOS/package.json`)
   - CLI: `npx @google/design.md {lint|diff|export|spec}`
   - Spec offline: `.aios-core/development/data/design-md-spec.md` (356 linhas)

2. **VoltAgent/awesome-design-md** clonado (gitignored): `.aios-core/development/data/design-md-library/`
   - 59 brand folders locais + 10 remote-only (path: null, remote_url usado)
   - 9 verticais: ai-llm-platforms, developer-tools, backend-db-devops, productivity-saas, design-creative, fintech-crypto, ecommerce-retail, media-consumer, automotive

3. **Index searchable**: `.aios-core/data/design-md-index.yaml` (69 brands, schema: id/name/path/remote_url/primary_color/tier/keywords)
   - Tiers: luxury, enterprise, saas, consumer, ai-platform
   - Builder script: `.aios-core/development/scripts/build-design-md-index.js` (idempotente)

### HYDRA wiring

- **2 GitHub sources** (`tools/hydra/src/config/sources.yaml`, weekly poll):
  - google-labs-code/design.md (S-tier)
  - VoltAgent/awesome-design-md (A-tier)
- **Novo domínio** `design-systems` em `domains.yaml` (separado de `design-interiores`)
- **Routing** em `routing.yaml`: 10 mind clones (dieter-rams, brad-frost, vitaly-friedman, val-head, don-norman, julie-zhuo, tobias-van-schneider, erik-spiekermann, john-maeda, kat-holmes)

### 5 Design Agents atualizados

`design-lead`, `design-systems-engineer`, `ui-designer`, `ux-design-expert`, `ux-designer` (em `.aios-core/development/agents/`).

**4 comandos novos por agente:**
- `*lookup-design {brand|vertical|tier}` — busca no index
- `*lint-design {filepath}` — `npx @google/design.md lint`
- `*export-design {filepath} --format {tailwind|dtcg}` — token export
- `*diff-design {a} {b}` — token-level diff

Persona injection tailored per role (design-lead audita visão; design-systems-engineer authoring tokens; ui-designer research+pre-commit lint; ux-design-expert anchored em proven systems; ux-designer interaction patterns).

### Edge cases conhecidos

- **10 brands remote-only** (path: null): Binance, Mastercard, Meta, Bugatti, PlayStation, Vodafone, WIRED, theverge, shopify, nike — content em `getdesign.md/{brand}/design-md`. Agents devem fetch via remote_url.
- **YAML style variance**: 4 agents usam object-map de comandos, ux-design-expert usa array-of-objects. Edits adaptaram per style.
- **Cross-dir data resolution**: `design-md-index.yaml` em `.aios-core/data/` (não `development/data/`). Validator emite warning mas aceita (mesmo padrão de `jarvis-mind-clone-map.yaml`).
- **`primary_color`/`primary_font` heurísticos** no index — agents devem fetch DESIGN.md real para tokens exatos.

### Próximos passos sugeridos

- [ ] Criar `apps/bretda-lp/DESIGN.md` canônico (Task #4 deletada, era bônus)
- [ ] Rodar `hydra fetch --sources github` para popular knowledge-feed dos 10 mind clones
- [ ] Commit + push das mudanças (staged em working tree)
- [ ] Adicionar comando `*lookup-design` ao Quick Commands de outros squad chiefs (design-chief, copy-chief)

### Trade-offs não-óbvios

- **HYDRA poll weekly** (não daily) — design systems mudam devagar, evita ruído nos mind clones.
- **`design-systems` separado de `design-interiores`** — para não cruzar contexto Bretda/KR (mesas/móveis) com design system tokens (Apple/Stripe/Linear).
- **Remote_url como fallback** preservado para os 10 brands sem clone — index único, sem fragmentação.
