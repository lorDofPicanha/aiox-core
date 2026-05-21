---
name: OAuth Reauth Google Ads Tocks — RESOLVIDO 22/Abr
description: Reauth do MCP bridge com contato@tockscustom.com.br (owner MCC 7943699417) restaurou acesso Google Ads aos 3 CIDs (Tocks/Bretda/KR). Token ativo via .env.
type: project
originSessionId: 53e176e8-9688-4857-a8db-b79e7496809e
---
**22/Abr/2026 — Bloqueio 403 USER_PERMISSION_DENIED resolvido.**

**Why:** Desde 17/Abr o refresh token do MCP bridge era de `contato@bretda.com.br` — só tinha acesso direto a Bretda. Tocks/KR/MCC davam 403 persistente. Reauth com email owner do MCC resolveu tudo em 1 call.

**How to apply:**
- **Email owner MCC 7943699417:** `contato@tockscustom.com.br` (NÃO `contato@bretda`)
- **Script funcionou:** `D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs` (sem bugs recorrentes — dotenv OK, redirect_uri /callback OK)
- **Novo refresh token** salvo em `D:/jarvis/mcp-ads-bridge/.env:9` (iniciando com `1//0hB0ep0mg8vR_` — atualizado 29/Abr)
- **Header MCC ativo:** `GOOGLE_ADS_LOGIN_CUSTOMER_ID=7943699417` adicionado ao `.env:12`
- **Após editar .env:** matar processos `node D:/jarvis/mcp-ads-bridge/dist/index.js` (foram PIDs 6836+10112) e rodar `/mcp` no Claude Code para reconectar — MCP carrega .env na inicialização
- **Validado:** 3 CIDs (Tocks 8146675397, Bretda 8167636084, KR 9606277774) todos acessíveis via MCC; overview Tocks retornou R$505 spend 7d
- **Em Testing mode, expira 7 dias** — rotação confirmada: 22/Abr → 29/Abr → próximo ~06/Mai. Promover consent screen pra Production resolve definitivo.

**Update 05/Mai/2026:** Ver `project_oauth_production_05mai.md` para status atualizado da migração Production. Token validado vivo 05/Mai 14:00, plano de submit Verification + reauth fresh documentado em `D:/AIOS/docs/projects/bretda-google-ads-reactivation/fase-0/`.
