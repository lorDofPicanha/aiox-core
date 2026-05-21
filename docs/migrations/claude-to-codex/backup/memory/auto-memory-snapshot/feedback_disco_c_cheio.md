---
name: Disco C Cheio — Recorrente
description: Disco C (111GB) enche frequentemente. Limpeza recorrente necessaria. ~/.claude.json ja corrompeu 2x.
type: feedback
originSessionId: f4017ef6-826b-419a-80ba-e931174f0f2c
---
Disco C: (111GB) enche com frequencia — monitorar e limpar periodicamente.

**Incidente 16/Abr/2026 (2o):**
- Disco C 100% cheio (0 bytes livre)
- `~/.claude.json` corrompeu (0 bytes) durante escrita — restaurado manualmente
- Limpeza: npm cache (2.2GB), Temp (613MB), Chrome cache (3GB), Discord cache (1GB)
- Resultado: 1.5GB livre

**Incidente 10/Abr/2026 (1o):**
- Claude Desktop vm_bundles: 11.6 GB
- Spotify cache: 765 MB, pnpm store: 675 MB, Discord: 1 GB
- Resultado: 3.5MB → 14GB livre

**Maiores consumidores conhecidos:**
- `Local\Packages` — 13.8 GB (Windows Store/WSL)
- `Local\Python\pythoncore-3.14-64` — 5.1 GB (verificar se necessario)
- Claude Desktop vm_bundles — recorrente, pode crescer 10GB+
- npm/Chrome/Discord caches — acumulam GB rapidamente

**Why:** Disco C lotou 2x em 6 dias, corrompendo configs criticas.
**How to apply:** ANTES de qualquer escrita no C:, verificar `df -h /c`. Se <2GB, limpar primeiro. Primeiro alvo: vm_bundles > npm cache > Chrome cache > Temp.
