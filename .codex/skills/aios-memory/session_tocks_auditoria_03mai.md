---
name: Sessão Tocks Auditoria Estrutural 03/Mai
description: Auditoria profunda Google Ads + Meta Ads Tocks executada via traffic-chief. Score Google 3,5/10 + Meta 6,5/10. Bug crítico Google value=0 + SIS Lost-Rank 62,5% + CAPI Meta indeterminado.
type: project
originSessionId: b7bf7d9c-775d-4f7c-8f80-d27a60b58985
---
# Sessão Tocks Auditoria 03/Mai 2026 (sábado)

User pediu auditoria balanceada Google + Meta (não só Meta). Traffic-chief entregou raio-X estrutural completo. Modo análise apenas — ZERO execuções.

## Veredito Comparativo

| Dimensão | Google (3,5/10) | Meta (6,5/10) |
|---|---|---|
| Tracking | Bug crítico value=0 | Pixel vivo, CAPI indeterminado |
| Estrutura | 17 zumbis + 1 sobrevivente | Limpa, 3 active 29 paused |
| Targeting | SIS Lost-Rank 62,5% | Premium bem segmentado |
| Audiences | n/a | 51 disponíveis sem LAL nova |
| Performance | CTR 10% mas value=0 | CTR 2,44% acima média BR |

**Google = mais doente. Meta = saudável mas trava no CAPI.**

## Google Ads (`8146675397`) — Score 3,5/10

**Estrutura:** 18 camp, só 1 ENABLED (`TOCKS_Search_Alta-Intencao`). 17 paused/zumbi gestor antigo.

**Performance 30d:**
- Search Alta-Intencao: R$1.119 / 117 conv / **R$0 valor** / CTR 10,52%
- Total conta: R$1.766 / 124 conv / R$0 valor

**Bug `conversion_value=0` triplo diagnóstico:**
1. GTM/Tray não popula `transaction_value` no Purchase event
2. `Lead Qualificado Tocks` (R$13k default) sem CRM upload — fluxo offline morto
3. Goal `OUTBOUND_CLICK` é BIDDABLE → algoritmo otimiza clique-WA R$3,10, não venda

**SIS Diagnóstico crítico:**
- Search_budget_lost = 28,4%
- **Search_rank_lost = 62,5%** ← Ad Rank é gargalo, NÃO budget
- Subir budget sem corrigir QS/lance = desperdício

**Search Terms 30d top:**
- OK: mesa de sinuca R$54/10conv, mesa de bilhar preço R$6/4conv, quanto custa mesa sinuca R$5/3conv
- Desperdícios sem negativos: pebolim, mesa de toto, bilhar bol campinas, pica pau bilhares

**Bugs MCP bridge Google:** `getRecommendations` + `getChangeHistory` quebrados (schema v20).

## Meta Ads (`act_1221671265457624`) — Score 6,5/10

**Pixel:** `1382948639707224` OFICIAL last_fired 02/Mai 20:41 BRT (vivo). 2 lixo (Skara + VU NÃO USADO) poluindo.

**CAPI:** Indeterminado via API. Bloqueador #1 pra scaling >R$300/d.

**Account 30d:** R$2.056 / CTR 2,44% (acima média BR 1,6%) / freq 1,87 / 214 messaging connections.

**Adsets ACTIVE targeting:**
- C007 Premium Luxo SS: 30-65, 5 estados Sul-SE, Art Coll/Bens Luxo
- C005 Cidades SS: 25-60, DF/ES/MT/MG/PR, Design Int/Arq Mod
- C005 Nordeste Capitais: 25-60, 5 capitais NE
- C006 RTG Site+Social: custom audience

✅ Idade/geo/interesses alinhados luxo R$15-20k
🟡 Placements só FB+IG (sem Reels/AN testados)
🟡 Advantage Audience OFF em todos — restritivo

**Audiences (51):**
- LAL Compradores + LAL ConversaIniciada NÃO EXISTEM — só LAL Seguidores velha
- 9 ViewProduct + 6 AddToCart sem campanha puxando
- 2 RTG ativas em C006: Engajamento Social 30d + Visitantes Site 30d

**SEM bloqueio anti-spam** (diferente Vorza). API limpa.

## Recomendações Priorizadas (não executadas)

**P0 GOOGLE — Tracking value:**
1. Corrigir GTM/Tray Purchase mandar `transaction_value`
2. Cabear CRM upload Lead Qualificado R$13k
3. Tornar OUTBOUND_CLICK não-biddable

**P0 META — CAPI auditoria** (conclave 30/Abr "audita capi tocks" pendente)

**P1 GOOGLE — QS/Ad Rank:**
- Revisar headlines/extensions Search Alta-Intencao + LP
- Negativar pebolim, mesa de toto, concorrentes locais

**P1 META — Audiences rebuild** (depende CAPI funcionar)

**P2 GOOGLE** — Limpar 17 zumbis
**P2 META** — Testar Reels + Advantage Audience ON em C007

## Insight Estratégico

Tocks tem **dois bloqueadores compostos**:
1. Google cego de valor (124 conv R$0 → bid mira clique-WA barato)
2. Meta cego de venda (CAPI indeterminado → algoritmo sem sinal real)

**Ambos resolvem com mesma fundação:** CAPI server-side via Sales AI CRM (Opção D++ conclave 30/Abr). Maior alavancagem antes de mexer budget/criativo.

## Performance C007 D+3 (gate 04/Mai)

3d 30/Abr-02/Mai, R$60/d:
- AD [VRT-CLS] Linhas: CPL R$3,91 (CTR 3,15%) **WINNER**
- AD [ELP-CLS] Geracional: CPL R$10,03 (CTR 4,23%)
- AD [VRT-AMB] Design Statement: CPL R$6,90
- AD [ELP-AMB] Top of Line: CPL R$7,33 (volume morto, pausar)

C007 médio R$5,10 vs C005 baseline R$8,12 (-37%). **GO LOUD aprovado.**
C005 Monaco fatigando: CPL D-3d R$10,02 vs baseline R$8,12.

## Próximas ações user

- "executa P0 tocks" → traffic-chief sobe C007 R$60→R$120 + pausa AD morto
- "audita capi tocks" → @aios-dev confirma se Sales AI tem CAPI cabeado
- Decisão tocks-tracking deploy postergada até CAPI server funcionar (D++ pode tornar deploy desnecessário)

## Agent IDs

- traffic-chief sessão 1 (análise inicial): `a2c352e640e8cd50b`
- traffic-chief sessão 2 (auditoria estrutural): `adbdf625f72d4e9d4`
