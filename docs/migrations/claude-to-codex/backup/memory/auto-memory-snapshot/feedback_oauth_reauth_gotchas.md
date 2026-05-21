---
name: OAuth Reauth Gotchas (Google Ads MCP Bridge)
description: Dois bugs recorrentes no script reauth-with-sheets.cjs — fallback hardcoded para client deletado e redirect_uri mismatch. Padrões para diagnosticar erros 401 deleted_client e 400 redirect_uri_mismatch
type: feedback
originSessionId: cbc6be62-f694-43dc-9cd6-2619f380aae7
---
Script `D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs` teve 2 bugs que quebraram reauth em 17/Abr/2026.

**Why:** Em 17/Abr quebrou com `deleted_client` porque script tinha fallback hardcoded (`506145955453-ep6tj...ac3h`) apontando para OAuth client já deletado no GCP — não lia do `.env`. Depois quebrou com `redirect_uri_mismatch` porque usava `http://localhost:3847` enquanto o client estava registrado com `/callback`. Ambos resolvidos.

**How to apply:**
- Se reauth retornar `Erro 401: deleted_client`: confira se script faz `require('dotenv').config()`. MCP server em produção usa `.env` (client vivo), mas scripts avulsos podem ter fallback hardcoded para client antigo. Remova fallback ou force leitura do `.env`.
- Se reauth retornar `Erro 400: redirect_uri_mismatch`: compare `REDIRECT_URI` com outros scripts que funcionavam (`get-refresh-token.cjs` usa `http://localhost:3847/callback`). O OAuth client do projeto GCP `506145955453` está registrado com `/callback` — manter consistência.
- Refresh tokens em Testing mode expiram em 7 dias. Publicar o OAuth consent screen estende indefinidamente.
- Todas 3 contas (Bretda/Tocks/KR) estão sob MCC `7943699417` com o mesmo client do `.env` — reauth único cobre as três.
