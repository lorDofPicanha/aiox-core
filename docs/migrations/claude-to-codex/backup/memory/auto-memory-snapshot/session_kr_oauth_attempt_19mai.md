---
name: kr-oauth-attempt-19mai
description: "KR — tentativa de rotacionar token via OAuth User (Kell). Diagnóstico: token KR atual é SU poisoned pela BM Vorza banida. Caminho B (OAuth Kell) bloqueado por redirect_uri não whitelistado no App. Fix simples pending founder ação."
metadata: 
  node_type: memory
  type: project
  originSessionId: 98ba60f8-9c33-403c-8964-868077e07db2
---

# KR Token Rotation — Caminho B (OAuth) — 19/Mai/2026

## Contexto
User retomou KR (`vamos com a kr`). Probe 1ª tentativa de criar adset V4-B retornou novo cenário: erro intermediário de validação seguido pelo mesmo subcode `2446325`. Conclusão: policy hold persiste, mas hipótese era account-level.

## Diagnóstico (cross-token test)

| Token | Tentativa KR | Erro |
|-------|--------------|------|
| KR token (SU "Conversions API System User" `122112582098913280`) | Criar adset | `subcode 2446325` policy hold |
| KR token | Read BM Vorza `2744791262542284` | ✅ SUCCESS — confirma SU tem acesso à BM banida |
| Bretda token (USER Cristiane Gaspar) | Read KR ad_account | `code 200` permission not granted (erro diferente!) |
| Bretda token | Read KR V4 campaign | `subcode 33` missing permissions |

**Conclusão:** KR ad_account `act_210585430466029` está SAUDÁVEL (`account_status:1`, `disable_reason:0`, business=Designer Kelline Rodrigues `132177700923045`). O **token KR é o problema** — System User foi originado/atribuído via BM Vorza (banida 12/Mai), Meta cascateou restrição.

**Hipótese inicial "policy hold appeal pending" rejeitada.** Não precisa esperar Meta — precisa trocar token.

## Caminhos possíveis

**A — Partnership Bretda BM** (cleanest, ~20min)
- Kell adiciona Bretda BM como Business Partner em `business.facebook.com/settings/partners/132177700923045`
- Atribui acesso a ad_account `act_210585430466029` + Page + Pixel KR
- Breno gera SU na Bretda BM → Conversions API flow → novo token
- Atualiza .env

**B — Token USER da Kell via OAuth** (mais rápido se whitelist OK, ~10min)
- Kell autoriza App "Bretda Ads Bridge" via OAuth dialog
- Code → short-lived → long-lived 60d via app_id+app_secret
- Atualiza .env

**C — Esperar appeal Vorza** (não recomendado, indefinido)

User escolheu **B**.

## Tentativa B — BLOQUEADA

URL OAuth montada com:
- client_id: `1242013794801262` (App "Bretda Ads Bridge")
- redirect_uri: `https://www.facebook.com/connect/login_success.html`
- 7 scopes: ads_management, ads_read, pages_manage_ads, leads_retrieval, pages_read_engagement, pages_show_list, business_management
- response_type: code

**Kell viu erro "Recurso indisponível":**
> "Como estamos atualizando detalhes adicionais para esse aplicativo, o Login do Facebook está indisponível para ele no momento."

**Diagnóstico API direto via /oauth/authorize:**
```
"message": "Não é possível carregar a URL: O domínio dessa URL não está incluído nos domínios do app."
"code": 191
```

**Bug real:** redirect URI `connect/login_success.html` NÃO está em "Valid OAuth Redirect URIs" do App Settings. Erro técnico aparece pra user final como "Recurso indisponível".

## Achados secundários do App "Bretda Ads Bridge"

- App ID: `1242013794801262`
- 2 admins: Cristiane Gaspar (`4519015641711215`) + user `122114445032955251`
- `privacy_policy_url`: `https://www.tockscustom.com.br/pagina/politica-de-privacidade.html` ← **aponta pra Tocks, não Bretda** (cosmético hoje, vira problema se fizer App Review)
- `app_type: 0` (Consumer) — correto pra OAuth ads
- Nenhuma restrição visível na info pública

## Fix bloqueado em (founder action)

1. Abrir `https://developers.facebook.com/apps/1242013794801262/fb-login/settings/`
2. Adicionar em "Valid OAuth Redirect URIs": `https://www.facebook.com/connect/login_success.html`
3. Salvar Alterações
4. Kell tenta o link de novo

Quando isso for feito, Kell consegue logar, retorna code, Orion executa `kr-oauth-exchange-19mai.cjs <code>` → script faz: short-lived → long-lived (60d) → debug_token validate → ad_account read test → backup .env → substitui `META_ADS_ACCOUNT_KR_TOKEN`.

## Estado V4 KR (intacto, esperando token)

| Artefato | ID | Status |
|----------|-----|--------|
| Campaign V4 | `120248219339400268` | PAUSED, OUTCOME_TRAFFIC |
| Adcreative B Showoff | `1552546419626127` | READY |
| Adcreative C Qualificada | `2435561066925630` | READY |
| Adsets B+C | — | aguarda token destravar |
| Ads B+C | — | aguarda token destravar |
| Saldo | R$10.41 (= 18/Mai) | sem PIX novo |

## Aprendizado-âncora

**Cascata Vorza-ban → SU poisoning:** Meta restringe System Users membros de BMs banidas mesmo quando o SU operava ad_accounts de outras BMs limpas. Sintoma: erro `2446325` policy hold no ad_account-target (não no SU-source). Solução = swap SU pra outro BM limpo.

**Erro "Recurso indisponível" do FB Login = código 191 (redirect_uri não whitelistado)** disfarçado. Diagnose via API call direto pra `/v22.0/oauth/authorize` retorna a mensagem técnica.

**Redirect URI `connect/login_success.html` NÃO é universal whitelist.** Mesmo sendo página Meta-hosted, App precisa explicitamente listar em "Valid OAuth Redirect URIs". Equivocou aqui inicialmente.

## Artefatos persistentes

- `D:/jarvis/mcp-ads-bridge/kr-oauth-exchange-19mai.cjs` — script pronto pra rodar quando code chegar
- `D:/jarvis/mcp-ads-bridge/app-diagnose-19mai.cjs` — diagnose tool reutilizável

## Triggers próxima sessão

- `redirect adicionado` — Orion reenvia URL pra Kell tentar de novo
- `code da kell aqui {code}` — Orion roda exchange + retest + religa kr
- `caminho a kr` — pivot pra Bretda BM Partnership
- `religa kr` (após token novo + PIX) — finaliza V4

## Refs

- supersedes [[runbook_kr_whatsapp_p2_15mai]]
- relates [[session_kr_v4_link_clicks_18mai]] (V4 artefatos pré-criados)
- relates [[project_vorza_bm_ban_12mai]] (mudou semântica: cascata SÍ existe via SU, NÃO via API call patterns)
- relates [[session_kr_diagnostic_revised_17mai]]
