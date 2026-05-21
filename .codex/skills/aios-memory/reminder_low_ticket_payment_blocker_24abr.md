---
name: Low Ticket 10k - Payment Method Blocker 24/Abr
description: BM Vorza sem metodo de pagamento ativo. Bloqueador para criar 4 ads ja preparados. Estado salvo para retomada.
type: project
originSessionId: 675d4b8a-59cc-4739-8079-16f268c3d827
---
# 🔴 LOW TICKET 10k — BLOQUEADOR PAGAMENTO META (24/Abr/2026)

## Status atual

Tentativa de executar plano dos 7 passos pos-restart parou no passo 6 (criar 4 ads).

**Erro Meta API:** `error_subcode: 1359188 — "Nenhum metodo de pagamento. Atualiza o metodo de pagamento."`

Conta Vorza `act_793656664671388` (BM separado, App ID `2007697866847741`) sem cartao/pix valido.

## ✅ Passos 1-5 COMPLETOS (nao refazer)

### 1. Targeting C1 aplicado
adset_id `120242729974200621` (C1-TOPO -- INT Advocacia + OAB) com:
```
flexible_spec: [
  {interests: [Advogado/a 6003392101554, Bar association 6003029225585]},
  {interests: [Law firm 6003057724244, Branches of law 6797095139936]}
]
```
age 25-55, behaviors Compradores envolvidos, BR home+recent, OFFSITE_CONVERSIONS, R$37/dia.

### 2. C3 advantage desligado
adset_id `120242729976720621` (C3-TOPO -- BROAD Superior + Compradores):
- `advantage_audience` 1→0
- `age_max` 65→55
- BR home+recent, OFFSITE_CONVERSIONS, R$37/dia.

### 3. Page ID Facebook descoberto
`1064235853441529` (Metodo 3c) — confirmado via /me/accounts no token Vorza.

### 4. 4 image_hashes uploadados (validos 90d)
- `c6ae0645cb4c6d929123c6809b70b395` ad01-dor-tempo (C1-A)
- `2e29073d7010ea32a1f505b4901815e0` ad04-autoridade-oab (C1-B)
- `50a0c65ea92c393e75c69aa8e19b09fa` ad02-fomo-concorrencia (C3-A)
- `55d9fc41f86474c85e22c0c7c12d4ff0` ad09-objecao (C3-B)

### 5. 20 PNGs criativos restaurados de snapshot 541921eb
Path: `docs/projects/low-ticket-10k/criativos-finais/` (working tree).
Tambem restaurado: `META-ADS-CAMPAIGN-PLAN.md` + `CRIATIVOS-META-ADS-12.md`

## 🔴 Passo 6 PENDENTE — criar 4 ads

Formato Meta correto (descoberto na tentativa):
```json
{
  "object_story_spec": {
    "page_id": "1064235853441529",
    "link_data": {
      "image_hash": "<hash>",
      "message": "<copy completo>",
      "link": "https://vorza-metodo3c.netlify.app",
      "name": "<headline>",
      "description": "<descricao>",
      "call_to_action": {"type": "LEARN_MORE", "value": {"link": "https://vorza-metodo3c.netlify.app"}}
    }
  }
}
```

NAO usar `degrees_of_freedom_spec.standard_enhancements` — Meta deprecou (subcode 3858504).

Copies completos em `docs/projects/low-ticket-10k/META-ADS-CAMPAIGN-PLAN.md`:
- C1-A: Criativo 1 "Teste do Cronometro" (linha ~357)
- C1-B: Criativo 5 "Advogado do Futuro" (linha ~518)
- C3-A: Criativo 2 "Matematica Cruel" (linha ~396)
- C3-B: Criativo 9 "Pergunta Provocativa" (linha ~667)

## Passo 7 PENDENTE — ativar campanha + C1 + C3

```
meta_ads_update_status object_id=120242728863470621 status=ACTIVE  (campaign)
meta_ads_update_status object_id=120242729974200621 status=ACTIVE  (C1)
meta_ads_update_status object_id=120242729976720621 status=ACTIVE  (C3)
```

NAO ativar C2 (`120243622860290621`), C4 (`120243622876870621`), LINK_CLICKS adsets, ou campanha duplicata.

## 🔴 Acao do user requerida

1. Acessar https://business.facebook.com/billing_hub/payment_methods
2. Selecionar BM Vorza (App ID 2007697866847741)
3. Adicionar cartao OR pix
4. Definir como principal em `act_793656664671388`
5. Avisar Orion → retomar do passo 6

**Why:** Sem metodo de pagamento, Meta bloqueia create_ad. Acao administrativa nao pode ser feita por API.
**How to apply:** Apos pagamento OK, retomar criacao dos 4 ads usando hashes/page_id/copies acima. Depois ativar com kill rules: R$100 sem Purchase = pause; CPA > R$24 = pause.
