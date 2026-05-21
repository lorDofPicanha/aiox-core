---
name: KR Meta Ads Setup 28/Abr (partnership Vorza)
description: 28/Abr/2026 — KR Interiores conectada via partnership Vorza ↔ BM Kell. Ad account act_210585430466029 adicionada ao .env do MCP bridge. Aguardando restart Claude Code.
type: project
originSessionId: 52e441df-798a-4add-ab62-7b45a8a40970
---
# KR Interiores — Meta Ads Setup 28/Abr/2026

**Status atual:** Partnership aceito ambos lados, .env do MCP bridge configurado, **aguardando restart Claude Code pra MCP enxergar a conta**.

## Estrutura Final (decidida 28/Abr)

Modelo escolhido: **BM Kell mantém ownership** + Vorza adicionada como **Business Partner** com role Anunciante na ad account.

```
BM Kell (KR Interiores Design)
  ├─ Ad Account "Designer Kelline Rodrigues" (act_210585430466029) ← propriedade dela
  ├─ Página FB KR Interiores Design
  ├─ Pixel KR Interiores
  └─ Partner: BM Vorza (2744791262542284) ← acesso de operação
```

**Why partnership ao invés de ad account dentro do Vorza:**
- Identidade da Kell isolada do BM Vorza (cluster Meta separado — protege Tocks/Bretda no caso de cascata)
- Tu não expõe user pessoal (era o pedido dele)
- Kell continua dona, se relação acabar ela só remove o partner

**How to apply:**
- Setup já feito 28/Abr (Kell adicionou Vorza como partner, tu aceitou do lado Vorza)
- Ad account ID: `act_210585430466029`
- BM Vorza ID: `2744791262542284`
- Token: usa o mesmo `META_ADS_ACCOUNT_VORZA_TOKEN` (partnership permite isso)

## Configuração no .env do MCP bridge (`D:/jarvis/mcp-ads-bridge/.env`)

Linhas adicionadas após bloco Vorza:

```env
# KR Interiores (Designer Kelline Rodrigues — BM próprio, partnership com Vorza)
META_ADS_ACCOUNT_KR_ID=act_210585430466029
META_ADS_ACCOUNT_KR_TOKEN=<mesmo do VORZA_TOKEN>
```

Backup pré-mudança: `D:/jarvis/mcp-ads-bridge/.env.pre-kr.bak`

## Próximos passos (após restart Claude Code)

1. `meta_ads_list_accounts` → confirmar KR aparece (4ª conta)
2. `meta_ads_pixel_check account=kr` → validar Pixel + CAPI no krinteriores.com.br
3. `meta_ads_overview account=kr date_preset=lifetime` → baseline (provavelmente vazio, conta nova)
4. Verificar campanhas existentes (provavelmente nenhuma)
5. Montar 3 ad sets PAUSED seguindo plano `plan_kr_meta_ads_migration.md`:
   - "Precision High-Intent" R$15/dia
   - "Broad Lifestyle" R$20/dia
   - "Open Algorithm" R$15/dia
6. Validar criativos (assets prontos pela Kell?)
7. User revisa, ativa quando quiser

## Riscos a monitorar

1. **Token compartilhado:** se Vorza token expirar/revogar, KR também perde acesso. Considerar System User token KR-específico depois.
2. **Pixel/CAPI:** plano de 17/Abr previa instalação no site. Confirmar se Kell fez (pode ter pulado esta parte).
3. **Permission cascade:** Meta partnership preserva isolamento, MAS se ad account da KR tiver problema sério, BM Vorza pode ser pingado. Risco baixo, monitorar.

## Histórico relevante

- 17/Abr: KR Google Ads suspensa por evasão de suspensão (caso anterior dela)
- 17/Abr: plano de migração escrito (`plan_kr_meta_ads_migration.md`)
- 18-27/Abr: Kell criou BM próprio + completou setup (assumido pelo user)
- 28/Abr: partnership Vorza aceito, .env configurado, aguardando restart
