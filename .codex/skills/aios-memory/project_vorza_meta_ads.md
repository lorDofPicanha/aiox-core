---
name: Vorza Meta Ads - BM Separado
description: Conta Meta Ads Vorza em BM separado da Bretda/Tocks, com App e token proprios. Config no MCP bridge.
type: project
---

A conta Meta Ads da Vorza (Low Ticket 10k) pertence a um **Business Manager separado** da Bretda/Tocks.

**Dados da conta:**
- **Ad Account ID:** `act_793656664671388`
- **App ID:** `2007697866847741`
- **App Secret:** `7b686de644173b11c1ec8ab667355b4a`
- **Token:** configurado em `D:\jarvis\mcp-ads-bridge\.env` (linha META_ADS_ACCOUNT_VORZA_TOKEN)

**Configuracao MCP Bridge:**
- Arquivo: `D:\jarvis\mcp-ads-bridge\.env`
- Account name no bridge: `vorza`
- Requer restart do Claude Code apos alterar .env

**Why:** BM separado significa token separado. O token da Bretda/Tocks nao funciona para Vorza (erro 403 ads_management permission).
**How to apply:** Sempre usar `account: "vorza"` nas chamadas Meta Ads do MCP bridge para este projeto. Se token expirar, gerar novo no App 2007697866847741 do BM da Vorza.
