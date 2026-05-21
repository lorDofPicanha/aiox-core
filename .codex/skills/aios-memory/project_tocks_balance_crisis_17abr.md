---
name: Tocks Balance Crisis 17/Abr
description: Sessão 17/Abr — descoberta que saldo R$ 250 + budget R$ 170/dia causou Google estrangular delivery. Hoje 2 imp / R$ 0. Ontem R$ 11.88 de R$ 170 budget. Pagamento R$ 2.750+ urgente.
type: project
originSessionId: 07516ba5-234e-447a-a124-b4d99ea7ac41
---
## Tocks — Balance Crisis (17/Abr/2026)

**Gatilho:** usuário reportou notificação Google Ads "Balance is running low" na conta 814-667-5397.

### Dados confirmados por API (17/Abr 10:53 BRT)

**Métricas HOJE:**
- Search Alta-Intenção (23703520246): 2 imp / 0 clicks / **R$ 0,00** / IS 9.99%
- Todas outras: 0 imp / 0 clicks / R$ 0
- **Total conta hoje: 2 imp, 0 clicks, R$ 0,00**

**Métricas ONTEM (16/Abr):**
- Search Alta-Intenção: 76 imp / 7 clicks / **R$ 11,88** / 2 conv / CTR 9.21%
- Todas outras: 0 imp
- **Total ontem: R$ 11,88 com budget R$ 170** (6,9% do budget entregue)

### Saldo atual: R$ 250

**Matemática que ativou threshold Google:**
- Budget Search ENABLED: R$ 150/dia
- Budget Shopping ENABLED: R$ 20/dia
- Total Google/dia = R$ 170
- Runway = R$ 250 / R$ 170 = **1,47 dias**
- Google tem regra não-documentada: saldo < ~2x daily budget → reduz delivery
- Por isso ontem só serviu 6,9% e hoje 0%

### Diagnóstico definitivo

**NÃO é:**
- Lost-IS Budget (era sintoma, não causa raiz)
- Merchant Center (MC aparentemente OK — Q1 linked, Q2 todos aprovados)
- Configuração de campanha

**É:**
- **Saldo insuficiente** vs budget escalado para R$ 250/dia
- Escala de ontem (R$ 35→150 Search) + saldo baixo = Google parou delivery

### Merchant Center — validação parcial (17/Abr)

Usuário validou na UI `merchants.google.com/mc/?a=5665639473`:
- **Q1 Linking Google Ads 8146675397:** ✅ CORRETO
- **Q2 Produtos:** ✅ TODOS APROVADOS
- **Q3 Motivos reprovação:** N/A (não há reprovações)
- **Q4 Website Verified+Claimed:** ❓ usuário não conseguiu identificar

MC aparentemente saudável. Shopping 0 imp histórico pode ter sido saldo + aguardando crawler Google descobrir feed (10/Abr campanha criada).

### Plano de ação

**PASSO 1 — PAGAR (faz agora):**
- Via PIX no Google Ads Billing
- **Mínimo:** R$ 1.250 (total R$ 1.500, 8 dias runway)
- **Recomendado:** R$ 2.750 (total R$ 3.000, 17 dias, atravessa revisão 24/Abr)
- **Ideal:** R$ 4.750 (total R$ 5.000, 29 dias)

**PASSO 2 — Aguardar 1–3h:**
- Após confirmação PIX, Google reativa delivery
- Search volta primeiro

**PASSO 3 — Ativar Auto-refill (prevenção):**
- Billing > Settings > Payment method
- Trocar Manual → Automatic OU configurar alerta saldo < R$ 500
- Cartão principal + backup

**PASSO 4 — Voltar ao plano original P1-P3 do lembrete 17/Abr:**
- P1 ROAS (Enhanced Conv + valor R$ 13k em WhatsApp-CLICK)
- P2 MC Q4 Website Claimed (confirmar)
- P3 Backend CAPI events (Contact + Lead)

### MCP Bug Fix aplicado (17/Abr)

- Arquivo: `D:/jarvis/mcp-ads-bridge/src/providers/google-ads.ts`
- Mudança: `campaign.shopping_setting.sales_country` → `feed_label` (campo removido na API v20)
- Build OK
- **Pendente restart Claude Code** para ativar
- Após restart: `google_ads_campaign_details` vai retornar `merchant_id` + `feed_label` sem erro

### Why

Usuário escalou ontem para R$ 250/dia nominal (R$ 170 efetivo Google) sem garantir runway mínimo de 7-10 dias em saldo. Threshold Google disparou notificação "Balance is running low" e começou a estrangular.

### How to apply

- Se usuário voltar a reportar "ads fraco" → PRIMEIRO checar saldo, só depois diagnosticar outras hipóteses
- Nunca escalar budget sem verificar saldo mínimo = 7x daily budget
- Após pagamento, rodar `google_ads_metrics TODAY` em 2-3h para confirmar delivery retomou
- Se saldo permanecer baixo cronicamente: Automatic payments OBRIGATÓRIO
