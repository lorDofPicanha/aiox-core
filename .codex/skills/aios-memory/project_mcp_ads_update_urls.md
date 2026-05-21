---
name: MCP Ads Bridge - Tool google_ads_update_ad_urls
description: Nova ferramenta criada no mcp-ads-bridge para atualizar URLs de anuncios Google Ads
type: project
originSessionId: bec23607-5d01-4c86-84dc-a5d26661c39d
---
Ferramenta `google_ads_update_ad_urls` adicionada ao MCP ads bridge (13/Abr/2026).

**Arquivos modificados:**
- `D:\jarvis\mcp-ads-bridge\src\providers\google-ads.ts` — funcao `updateAdFinalUrls()`
- `D:\jarvis\mcp-ads-bridge\src\ads-core.ts` — tool definition + handler `googleUpdateAdUrls()` + switch case

**Why:** Nao existia ferramenta para editar URLs de criativos. Nota: NAO funciona com RSAs (campo imutavel), mas funciona com outros tipos de anuncio.

**How to apply:** Usar via MCP tool `google_ads_update_ad_urls` com params: ad_group_id, ad_id, final_urls (array), account. Para RSAs, usar fluxo create+pause.
