---
name: Sem Shopping em Bretda nem Tocks
description: User directive 05/Mai 2026 — não usar Shopping campaigns em Bretda nem Tocks. Aplicar em Bretda Google Ads Reactivation runbook + pausar Shopping ativo em Tocks.
type: feedback
originSessionId: b1b9eedd-94a7-4cf1-9524-fa8a5009067b
---
# Sem Shopping em Bretda nem Tocks

**Regra:** NÃO usar campanhas Shopping (Google Merchant Center / Shopping ads) em Bretda nem Tocks Google Ads.

**Why:** User directive direta 05/Mai/2026. Possíveis razões inferidas (não confirmadas):
- Bretda: posicionamento luxury "preço sob consulta" (range R$33k-R$89k) conflita com requirement Shopping de exibir preço público no feed Merchant.
- Tocks: Shopping performance histórica ruim (1 conv/14d, audit 03/Mai). Smart Bidding aprende em Search OK, Shopping desperdício.
- Custo de manutenção feed Merchant Center não justifica volume.

**How to apply:**

### Para Bretda Google Ads Reactivation runbook
- **Fase 4.4 Gate D+21:** SKIP Shopping decision branch. Pular direto para PMAX consideration em D+45 (com gates rigorosos).
- **Decision matrix:** marcar "Shopping standalone" como REJECTED.
- **Stack final D+90+:** Search + RTG + (PMAX condicional). NUNCA Shopping.

### Para Tocks Google Ads
- **Pausar campanhas Shopping ativas** (per audit 03/Mai, 1 conv/14d → garbage).
- **NÃO criar novas Shopping camps.**
- Migrar budget Shopping → Search top-performers ou pausar (se Smart Bidding learning fragile).

### Para outros projetos high-ticket (KR, Vorza, etc)
- Default: NÃO Shopping até user explicitamente pedir.
- Exceção: low-ticket commodity products (papelaria, descartáveis) onde feed faz sense.

**Trade-off aceito:**
- Perde 30-40% receita potencial Google em high-intent shopping queries (segundo Larry Kim mind clone consultation 05/Mai).
- Mantém posicionamento luxury "preço não é objeção, é gate de qualificação".
- Stack mais simples = menos manutenção feed/Merchant Center.

**Documentos atualizados:**
- `D:\AIOS\docs\projects\bretda-google-ads-reactivation\00-runbook-master.md` — Fase 4.4 + decision matrix + trade-offs
- `D:\AIOS\docs\projects\bretda-google-ads-reactivation\02-decision-matrix.md` (se existe)
- `D:\AIOS\docs\projects\bretda-google-ads-reactivation\03-kpi-gates.md` — Gate 4.4 simplificado

**Trigger de revisão:**
Se 6+ meses depois user pedir reconsiderar, validar:
- Bretda mudou política preço público?
- Tocks tem feed Merchant atualizado + volume conv >5/dia?
- Concorrência Shopping aumentou ROAS minimum aceitável?
