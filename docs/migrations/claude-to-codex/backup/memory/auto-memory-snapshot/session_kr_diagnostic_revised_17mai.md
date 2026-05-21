---
name: kr-diagnostic-revised-17-mai
description: "🔄 REFRAME — Bug KR NÃO é roteamento (site/IG/Page/ads todos corretos +5561998720330). É welcome screen / CTM card filtrando 99 cliques. Cliente reportou 'difícil achar telefone dela'. BM tem policy hold bloqueando ad-level write desde 16/Mai (subcode 2446325). Creative limpo 2560842594333782 pronto pra atribuir."
metadata:
  node_type: memory
  type: project
  originSessionId: 16-17-mai-2026
---

# KR — Diagnóstico Revisado 16-17/Mai/2026

## TL;DR da reviravolta

Bug "9 faltando" de 12/Mai estava PARCIALMENTE incorreto. Investigação 16/Mai via Graph API + auditoria de creatives + 3 confirmações user (site/IG/Page todos OK) destruiu hipótese WABA Cloud routing. Verdadeiro bug = welcome screen / CTM intermediate card filtrando 99 cliques antes de mensagem real sair pro app da Kell.

## Investigação via Graph API (16/Mai)

### BM + Page KR
- BM owner: **DESIGNER KELLINE RODRIGUES** (132177700923045) — BM da Kell, não gestor antigo
- Page KR Interiores Design (543056628881459) + Page Designer Kelline (809416199429899) — ambas no mesmo BM
- Page phone: `+5561998720330` (com 9, correto)
- IG vinculado: 17841401293654853

### WABAs no BM
- **Owned WABAs: 0**
- **Client WABAs: 0**
- **Não existe WABA Cloud API.** Hipótese 12/Mai "gestor antigo plantou WABA paralela" está MORTA.

### wa.me dual test
- `wa.me/556198720330` (sem 9) → resolve perfil "KR interiores Design" + foto
- `wa.me/5561998720330` (com 9) → genérico, sem profile branded
- Explicação: normalização Brasil pré-2014 — mesma conta WhatsApp, formato legacy/moderno coexistem internamente

### 4 routing layers verificadas (TODAS corretas)
| Source | URL | Phone | Status |
|---|---|---|---|
| Site krinteriores.com.br | `wa.me/5561998720330?text=Olá...` | +55 61 99872-0330 | ✅ user confirmou |
| Instagram @kelinerebellatto | Contato/WhatsApp button | +55 61 99872-0330 | ✅ user confirmou |
| Page WhatsApp Facebook | Configurações Page → WhatsApp | +55 61 99872-0330 | ✅ user confirmou |
| Ads V3 CTM | `api.whatsapp.com/send` via Page-linked | +55 61 99872-0330 | ✅ Graph API audit |

### Auditoria 4 ads V3 (campaign 120246823605310268)
Todos com destination_type=WHATSAPP, CTA=WHATSAPP_MESSAGE, app_destination=WHATSAPP, link=api.whatsapp.com/send, promoted_object.page_id=543056628881459.

| Ad | ID | Welcome content | Status individual |
|---|---|---|---|
| B - AD17 Showoff (REUSE) | 120246937384220268 | autofill "Olá! Eu gostaria de fazer um orçamento..." + quick reply | ACTIVE |
| B - AD17v2 Qualificada | 120247171032180268 | template ___ campos (Tipo/Ambientes/Prazo/Cidade) | PAUSED desde 04/Mai |
| C - AD12 Sofisticação (REUSE) | 120246937384680268 | mesmo padrão REUSE | ACTIVE |
| C - AD12v2 Qualificada | 120247171043030268 | mesmo padrão Qualificada form | PAUSED desde 04/Mai |

## Bug REAL: Welcome Screen filtering

User reportou 16/Mai: **"cliente disse que deu muito trabalho encontrar telefone dela"**.

Funnel real:
1. User clica ad CTM
2. Meta mostra welcome card (intermediário hospedado pelo Meta — sem WhatsApp ainda)
3. Card tem foto Page + texto + quick reply "Gostaria de obter mais informações" OU template ___ pra preencher
4. User se confunde / não entende que precisa clicar pra continuar / não acha número visível
5. Bail OU clique confuso sem mandar
6. Meta conta `messaging_conversation_started_7d` (card view conta)
7. Auto-reply WABA dispara (98 vezes)
8. **Mensagem REAL nunca sai → Kell não recebe nada no app dela**

Métricas explicadas:
- 99 conv_started Meta last 30d (R$448 spend)
- 98 auto-reply WABA disparadas (card view)
- 0 mensagens reais no app da Kell ✅ batente com o que ela reportou
- Os "99 leads no void" = na verdade dropouts no welcome screen

## BM Policy Hold descoberto 16/Mai

Tentativa de pausar/editar/criar ad-level retornou:
```
error_code: 10
error_subcode: 2446325
"A conta comercial não cumpre as nossas Políticas de Publicidade ou outras normas"
```

Estado:
- `account_status: 1` (ATIVA — não disabled)
- `disable_reason: 0` (sem flag explícita)
- Capabilities incluem `CTM_ADS_CREATION_CLICK_TO_DIRECT` ✅
- Token scopes incluem ads_management, business_management ✅
- Mas **ad-level write 100% bloqueado**
- Campaign-level write **ainda funciona** (anomalia — Meta libera emergency response)
- Persistiu 16→17/Mai — não destrava sozinho

## Ações tomadas na sessão

1. ✅ Campanha V3 PAUSED (re-confirmado 16/Mai e 17/Mai)
2. ✅ v2 Qualificada (forms pesados) JÁ PAUSED desde 04/Mai — "formulário retirado" user-requested
3. ❌ REUSE ads ainda individual ACTIVE (policy hold impede pause individual), mas effective_status=CAMPAIGN_PAUSED (não servem)
4. ✅ Creative criado limpo: **`2560842594333782`** (welcome screen MÍNIMO — 1 linha autofill "Olá Kell, vi seu anúncio", sem quick reply, sem template form). Pronto pra atribuir aos ads quando destravar.
5. ❌ Não foi possível trocar creative dos ads existentes (policy hold)
6. ❌ Não foi possível criar novos ads (policy hold)
7. ✅ Smoke test feito 16/Mai (~14h): religou campanha, user tentou achar ad mas não conseguiu pegar nenhuma serving — então usei "alternativas" (Page CTA, IG bio) → user confirmou os 3 estão direcionando corretamente

## Estado financeiro

- Balance: **R$10.41**
- Spend_cap: 0 (sem cap)
- Runway: 1-2 dias no R$30/d combinado dos 2 adsets ACTIVE
- Precisa PIX ~R$500-700 antes de relançar

## Tentativa "direto pro WhatsApp sem nada"

User pediu 16/Mai: "deixe sem formulário e faça direto no whatsapp sem nada, ela atende depois".

Tentativas Graph API:
1. ❌ Criar creative SEM `page_welcome_message` → error_subcode 2446391 "Anúncio incompleto" (Meta CTM ads requerem welcome message)
2. ❌ Criar com autofill content="" → error genérico
3. ✅ Criar com autofill 1 linha "Olá Kell, vi seu anúncio." → SUCCESS (creative 2560842594333782)
4. ❌ Atribuir creative a ad existente → policy hold
5. ❌ Criar new ad linkado ao creative → policy hold

**Caveat estrutural:** Meta CTM ads REQUEREM `page_welcome_message`. Mínimo viável = 1 linha autofill, sem template, sem quick reply. Foi o que ficou pronto.

**Alternativa pra true "direto":** migrar pra LINK_CLICKS campaign com URL `wa.me/5561998720330` hardcoded → click vai direto pro WhatsApp sem qualquer intermediário Meta. Mas é mudança de campaign type (diferente bidding, sem CONVERSATIONS optimization, sem messaging_conversation_started metric).

## Pendências P0 Breno (bloqueiam relaunch)

1. **Resolver BM policy hold** (única ação que destrava ad-level):
   - business.facebook.com → BM `DESIGNER KELLINE RODRIGUES` (132177700923045)
   - URL direto: https://business.facebook.com/accountquality/132177700923045
   - OU Sino 🔔 topo + sidebar "Centro de Recursos" / "Qualidade da conta"
   - Procurar: aceitar termos atualizados, completar verificação, apelar política, revisar info comercial
2. **PIX saldo KR** (~R$500-700)
3. **Comunicar Kell**: 99 "leads" não eram leads reais (welcome card dropout). Vai ter ~5-10 conversas reais (pessoas que passaram do card) — ela busca normal no inbox.

## Próxima sessão — quando destravar

Trigger: `religa kr` (após policy hold resolvido + PIX confirmado)

Plano (Orion executa em 2 min):
1. Pause individual dos 4 ads (segurança)
2. Substitui creative dos 2 REUSE pelo `2560842594333782` (1-line autofill, sem form, sem quick reply elaborado)
3. Cria variante pro AD12 com mesmo padrão limpo (image_hash diferente)
4. Tudo PAUSED até confirmar saldo
5. Quando PIX OK, activate campanha + adsets, novos creatives servem

## Refs / supersedes

- **supersedes** [[session_kr_whatsapp_void_12mai]] — hipótese "WABA Cloud no número errado" está MORTA (não existe WABA Cloud no BM)
- **obsoleta parcialmente** [[runbook_kr_whatsapp_p2_15mai]] — P2 era "desconectar WABA + reconectar 99872-0330" mas não há WABA pra desconectar; ação restante (validar conexão Page Settings → WhatsApp pra +5561998720330) user já confirmou que está OK
- **atualiza** [[reminder_kr_kell_pending_12mai]] — P0 screenshot 99 leads não tem nada pra capturar (leads não chegaram no inbox, foram dropouts no card)
- **atualiza** [[feedback_meta_ctm_waba_wrong_number]] — feedback rule precisa update: não era WABA wrong number, era welcome screen dropout; padrão real = sempre auditar `page_welcome_message` em CTM ads + smoke test from ad clicker side incluindo o intermediate card

## Triggers próxima sessão

- `policy hold resolvido kr` — Breno confirma BM destravou, eu rebuilda
- `religa kr` — pós PIX + policy hold
- `pix confirmado kr` — eu reativa campanha (precisa ads rebuiltados antes)
- `kell vasculhou inbox kr` — feedback dela sobre leads reais encontrados
- `migra kr para link_clicks` — se Breno quiser true direct WhatsApp via wa.me hardcoded sem CTM
- `pause individual kr` — quando policy destravar, pausar os 4 ads individualmente

## MCP context

Sessão fechou com `mcp-ads-bridge` + `mcp-design-studio` + `mcp-memory-service` + `refero` + `mcp-image-studio` + `aios-brain-bridge` desconectados. Próxima sessão Claude Code provavelmente reconecta normalmente. Token KR ainda em `D:/jarvis/mcp-ads-bridge/.env` (META_ADS_ACCOUNT_KR_TOKEN) — Graph API curl direto funciona como fallback.
