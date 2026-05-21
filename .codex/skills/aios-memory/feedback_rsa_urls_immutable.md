---
name: RSA URLs Immutable in Google Ads API
description: Google Ads API nao permite editar final_urls de RSAs — precisa criar novo ad e pausar antigo
type: feedback
originSessionId: bec23607-5d01-4c86-84dc-a5d26661c39d
---
O campo `final_urls` de Responsive Search Ads (RSAs) e IMUTAVEL na Google Ads API v20. Tentativa de UPDATE retorna erro `IMMUTABLE_FIELD`.

**Why:** Restricao da API do Google — RSAs tratam URLs como parte da identidade do anuncio.

**How to apply:** Para "corrigir" URL de um RSA existente:
1. Criar novo RSA com mesmos headlines/descriptions + URL correta (criado como PAUSED)
2. Pausar o RSA antigo
3. Ativar o novo RSA

A ferramenta `google_ads_update_ad_urls` foi criada no MCP bridge mas so funciona para tipos de anuncio que permitem edicao (nao RSAs).
