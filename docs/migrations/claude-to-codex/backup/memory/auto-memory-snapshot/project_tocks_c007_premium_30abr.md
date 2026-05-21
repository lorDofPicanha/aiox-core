---
name: Tocks C007 Premium Vértice+Elipse — LIVE 30/Abr
description: Campanha nova Tocks Meta lançando 2 modelos premium (Vértice R$15.990 + Elipse R$19.900). LIVE desde 30/Abr ~14h, R$60/d, separada do C005 Monaco winner pra não canibalizar. Watch list 7-10d pra winner emergir.
type: project
originSessionId: a0acc2a9-03cf-4a25-b1f0-434eaf42c505
---
# Tocks [C007] Sinuca Premium V+E — LIVE 30/Abr

## Estado pós-build (30/Abr ~14h BRT)

**Account:** `act_1221671265457624` (tocks)
**Pixel oficial:** `1382948639707224` ATIVO

### IDs Meta (todos ACTIVE)
| Objeto | ID |
|---|---|
| Campaign `[C007] [CSD] — [WHATSAPP] — Sinuca Premium V+E` | `120248300177020230` |
| Adset `Premium Luxo SS` (R$60/d) | `120248300213400230` |
| AD01 `[VRT-AMB] Design Statement — V` (Vértice ambiente) | `120248300215240230` |
| AD02 `[VRT-CLS] Linhas — V` (Vértice close) | `120248300216710230` |
| AD03 `[ELP-AMB] Top of Line — E` (Elipse ambiente) | `120248300218060230` |
| AD04 `[ELP-CLS] Geracional — E` (Elipse close) | `120248300218790230` |

### Image hashes (4 PNGs limpas SEM TEXTO)
- AD01 Vértice ambiente: `4e7a811bba3cbaf906274b92b0d8fd34` (foto `13_53_39`)
- AD02 Vértice close: `49b7aaef05bbb06dc3b586e575e2bfcb` (foto `13_53_27`)
- AD03 Elipse ambiente: `5c8138135a855794b874dd8267b70c51` (foto `13_53_48`)
- AD04 Elipse close: `3aec9bb60ec7952838d92d1774c48d1c` (foto `13_54_18`)

### Identificadores compartilhados
- Page Tocks: `386367957897981`
- WhatsApp destination: `554730419811`
- Pixel: `1382948639707224`

### Configuração
- **Objetivo:** OUTCOME_ENGAGEMENT (WhatsApp Click-to-Message)
- **Buying:** AUCTION (ABO, budget no adset)
- **Optimization:** CONVERSATIONS · billing IMPRESSIONS · bid LOWEST_COST_WITHOUT_CAP (mesmo do C005 Monaco winner)
- **destination_type:** WHATSAPP (não MESSENGER — fix 1 retry no build)
- **Geo:** 7 regions Sul+Sudeste (SP 460, RJ 454, MG 449, ES 445, PR 452, SC 459, RS 456) com `location_types=["home"]` PRESENCE explícito
- **Idade:** 30-65
- **advantage_audience:** OFF (cirúrgico)
- **Interests (4 reais via API, não inventados):**
  - `6003383672196` Art Collecting (1.6M-1.9M)
  - `6003567952103` Architecture & Interior Design (8.8M-10.4M)
  - `6007828099136` Bens de luxo (varejo)
  - `6780072442946` Mídia de arquitetura (design) (850k-1M)
- **Placements:** FB feed/reels/marketplace/story + IG stream/story/explore/reels/explore_home

## Estratégia (por que campanha SEPARADA do C005)

C005 winner Monaco 2em1 SS roda CPL R$12,22 (77% spend, mesa dual-purpose jantar+sinuca). Vértice e Elipse são **mesa sinuca pura** tier acima do Monaco — ICP diferente (não dual-purpose, mais luxury cirúrgico). Subir dentro do C005 diluiria delivery do Monaco. Camp separada **isola dados** + permite Meta rotacionar entre Vértice/Elipse pra encontrar winner sem mexer no Monaco.

**4 ads concorrendo internamente:**
- 2 Vértice (R$15.990): ângulo "Design Statement" (ambiente) + "Linhas que revelam" (close)
- 2 Elipse (R$19.900): ângulo "Top of Line" (ambiente) + "Investimento Geracional" (close)

Meta rotaciona, eu mato perdedores em D+5 a D+7, escalo winner.

## Modelos — diferenciação visual

| Atributo | Vértice | Elipse |
|---|---|---|
| Preço from | R$ 15.990 | R$ 19.900 |
| Base | Cunha invertida trapezoidal monolito | 2 pedestais cilíndricos com ripas verticais + base bronze |
| Feltro | Preto | Creme/bege |
| Bronze | Só caçapa | Caçapa + cap superior + base dourada |
| Estética | Angular/brutalist-modern | Art déco / clássico-luxo |

## Copy honestidade

**Mantido (verificável no C005):** Itajaí-SC desde 1988 + fabricação artesanal + walnut maciço + produção sob encomenda + preços R$15.990/R$19.900.
**REMOVIDO da v1 do briefing:** "garantia 5 anos" + "90 dias produção" — não confirmáveis no C005 atual, traffic-chief tirou pra não inventar dado.

## Kill rules (T0 = 30/Abr ~14h)

1. **R$50 gasto sem 1 conversa** → pause ad
2. **CPL conversation > R$25** com 200+ impressões → pause ad
3. **Winner emerge** (CPL <R$15 + CTR >2%) → 80% budget pra ele
4. **Não mexer 72h** após primeira conversa real (Meta learning phase)

## Checkpoints

- **24-48h:** primeira conversa WhatsApp esperada
- **D+5 (~04/Mai):** primeiro gate — comparar CPL Premium vs Monaco baseline R$12,22
- **D+7 (~06/Mai):** kill perdedores + scale winner

## Saldo Tocks (atenção)

Traffic-chief flagou ~R$5 saldo no momento do build. User mandou "GO" — assumiu provisão antes/junto do despause. **Monitorar:** se ad pausar por low_balance no 1º dia, a learning phase corrompe e Meta classifica conta como volátil.

**Spend rate combinado conta Tocks pós-C007:**
- C005 CSD Monaco: R$ 95/d
- C006 RTG: R$ 15/d
- C007 Premium V+E: R$ 60/d
- **Total: R$ 170/d** = R$ 5.100/30d. Provisão semanal mínima R$1.190.

## Aprendizados API Meta v21 (do build)

1. `is_adset_budget_sharing_enabled` agora obrigatório no create campaign (default `false` resolve quando não usa CBO)
2. `video_feeds` deprecated em `facebook_positions` desde v21+ → remover
3. `reels` em `facebook_positions` deve ser `facebook_reels` (Instagram usa `reels` direto)
4. **Adset CTM exige `destination_type=WHATSAPP`** (não MESSENGER) pra aceitar ads com `call_to_action.type=WHATSAPP_MESSAGE`. Mismatch = error_subcode 2490279

## Paths relevantes

- Build script: `D:/jarvis/mcp-ads-bridge/scripts/tocks-c007-30abr-fix.mjs`
- Verify script: `D:/jarvis/mcp-ads-bridge/scripts/tocks-c007-30abr-verify.mjs`
- Result JSON: `D:/jarvis/mcp-ads-bridge/scripts/tocks-c007-30abr-result.json`
- Memory traffic-chief: `D:/AIOS/.claude/agent-memory/traffic-masters-chief/project_tocks_c007_premium_30abr.md`

## Próxima ação user

Conversar de novo daqui ~24h pra olhar primeiros sinais (impressões + 1ª conversa). Em D+5 eu rodo gate completo (CPL ad-level + decisão kill/scale).
