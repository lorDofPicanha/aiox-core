---
name: Stitch MCP Setup
description: Google Stitch MCP configurado via stdio proxy com STITCH_API_KEY (v0.5.3+). Auth mudou de gcloud para API Key.
type: reference
originSessionId: f4017ef6-826b-419a-80ba-e931174f0f2c
---
## Google Stitch MCP — Setup Reference

**Problema original:** Claude Code forca OAuth Dynamic Client Registration (RFC 7591), Google nao suporta.
**Solucao:** Usar `@_davideast/stitch-mcp` como proxy stdio local.

### Config em `~/.claude.json` > mcpServers:
```json
"stitch": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
  "env": {
    "STITCH_API_KEY": "AQ.Ab8RN6LTuiSdlde8Ln0txA45dZcjyCWK655chaUp0zad95Dmaw"
  }
}
```

### Mudanca v0.5.3+ (16/Abr/2026):
- **ANTES:** Usava gcloud application-default login (OAuth)
- **AGORA:** Requer `STITCH_API_KEY` como env var
- Key obtida em: **stitch.withgoogle.com** > Profile > Stitch Settings > API Key
- gcloud auth NAO e mais suficiente sozinho

### Pre-requisitos:
- **gcloud CLI:** Instalado via winget em `$LOCALAPPDATA/Google/Cloud SDK/`
- **Projeto:** `gen-lang-client-0705408761` (Default Gemini Project)
- **API:** `stitch.googleapis.com` habilitada no projeto

### Se key expirar:
1. Ir em stitch.withgoogle.com > Settings > Create new key
2. Atualizar `STITCH_API_KEY` em `~/.claude.json`
