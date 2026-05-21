---
name: Sessão KR Auditoria Estrutural 03/Mai
description: Auditoria profunda KR (krinteriores) Meta-only via traffic-chief. Score Meta 5/10 — caso mais cego das 3 contas auditadas hoje (sem pixel há 4 anos, sem CAPI). CPL R$18-31 conversa SAUDÁVEL apesar do tracking zerado. Google removido MCC 17/Abr.
type: project
originSessionId: b7bf7d9c-775d-4f7c-8f80-d27a60b58985
---
# Sessão KR Auditoria 03/Mai 2026 (sábado, D+3 LIVE)

User pediu auditoria equivalente Tocks/Bretda. Confirmou KR = Meta-only (Google removido). Traffic-chief entregou raio-X estrutural. Modo análise apenas. ZERO execuções.

**⚠ CAVEAT TÉCNICO IMPORTANTE:** MCP bridge `mcp-ads-bridge` estava OFFLINE nesta sessão. Auditoria estrutural baseou-se em estado registrado em memória 28-30/Abr + raciocínio gaps. **Dados D+3 LIVE não foram puxados via API**. Pra checkpoint +72h CPL real: rerodar com MCP bridge ativo.

## Veredito Final

**KR é a conta MAIS CEGA das três auditadas hoje** (Tocks 7/10, Bretda 6/10, **KR 5/10**). Razão: Tocks e Bretda pelo menos têm pixel disparando — KR otimiza no escuro há 4 anos.

**Apesar disso, entrega CPL R$18-31 conversa em ticket alto** (projeto designer R$5-50k+) — prova que produto + targeting são fortes. Bug é ESTRUTURAL: instalar pixel desbloqueia 2-3× eficiência sem mexer criativo/budget.

## Google Ads — Score 0/10

Conta `960-627-7774` REMOVIDA do MCC `7943699417` em 17/Abr (suspensão por evasão, CPF/device fingerprint queimado). Reinstatement chance 5-15%. Decisão estratégica: **NÃO submeter appeal** (admite evasão e expõe MCC Tocks/Bretda). Pular sem culpa, foco 100% Meta. Alternativa BoFU intent-based: SEO/conteúdo orgânico próximos 90d ou cliente operar via MEI separado em 12+ meses.

## Meta Ads (`act_210585430466029`) — Score 5/10

### Pixel + CAPI (BUG ESTRUTURAL #1)
- 2 pixels no BM: `495385076720880` (iMotion 2024) + `154170033555238` (Designer Kelline 2021)
- **NENHUM dispara em krinteriores.com.br** (WP+Elementor+Hello rodando há 4 anos com Google Tag mas zero Meta Pixel)
- **CAPI: ZERO** (sem PixelYourSite, sem Edge function, sem CAPI gateway)
- **Lifetime R$20.599,80 spent SEM 1 dia de atribuição site**
- Toda otimização é in-Meta only (`messaging_conversation_started_7d` + `page_engagement`)

### Audiences (FORÇA estrutural)
- 28 audiences mapeadas, todas engagement-only (IG/FB 7-365D + VV 75/95/ThruPlay)
- 🌟 **Joia: "Engajamento IG Todos 365D"** `120213977576940268` com **115.900–136.400 pessoas** — seed perfeita LAL/RTG (negócio local com 100k+ engajados é raríssimo)
- Adset B usa exatamente essa audience
- Adset C usa "Engajamento IG Publicação 90D" — RTG morno legítimo
- Gaps: zero RTG Pixel, zero LAL (impossível sem pixel), zero customer list (Kell sem CSV), zero excludes

### Campanha LIVE — `120246823605310268` "[REATIVAÇÃO] [MSG] [V3]"
30/Abr ACTIVE, R$50/d total, 3 adsets/ads:
- **A** `120246936876500268` R$20/d → AD14 Newlywed Brasília 16km 30-60 (creative `1452447039211036`)
- **B** `120246936885880268` R$20/d → AD17 Eng IG 365D DF 30-55 (creative `895134416591313`)
- **C** `120246936886890268` R$10/d → AD12 RTG IG 90D DF 30-55 (creative `1447235576435002`)

Optimization: CONVERSATIONS (CTM WhatsApp). Evento `messaging_conversation_started_7d`.

### Histórico inventário
- 32 campanhas históricas, 17 com dados
- Top performers in-Meta:
  - **V1 [ENG] [MSG]** — CPL **R$18,23 / 130 conversas** ⭐ ESCALA VALIDADA
  - **V2 [ENG] [MSG]** — CPL R$31,39 / 473 conversas / freq 3,6 (saturada)
- "Joia" CPL R$1,33 era falso positivo (#achadinhos afiliado, não captação projeto)
- V3 reutiliza creatives validados V1/V2 (AD14/17/12) — lição da Kell foi correta, não pediu criativos novos

### Page + Domain Verification
- 28-29/Abr: Bloqueio crítico — Page `543056628881459` não atribuída ao System User do BM Vorza dentro do BM Kell. 30/Abr Kell resolveu (System User → Page com "Gerir Página"); erro `1487202` sumiu.
- ⚠ Nesta sessão NÃO consegui revalidar status atual (sem MCP)
- Domain verification krinteriores.com.br **AUSENTE** no BM — AEM iOS degradado
- Pixel `495385076720880` **NÃO compartilhado com BM Vorza** — bloqueia futuro RTG site via API

### Tracking conversão real
- Sem ROAS calculável via Meta (sem pixel)
- Kell precisa rastrear manual no WhatsApp: lead → SQL → projeto → ticket
- **Pendência antiga**: Kell exportar últimos 12 meses projetos fechados (denominador ROAS 70-495× estimado)
- Link WhatsApp **sem UTM** — atribuição cross-channel zero

### Conta otimizada CORRETAMENTE pra jornada longa
- Alto ticket + jornada longa = optimize CONVERSATION, não conversão direta
- Apesar tracking site zerado, escolha de objective está certa

## Pontos fortes estruturais

1. Maturidade targeting (16 adsets V2 históricos com geo hyper-local Brasília 3-16km, Newlywed life events, brand affinity Dior/Tom Ford/Bulgari, iOS 14+/iPhone)
2. Reuso creatives validados (V3 em cima de R$20k aprendizado in-Meta)
3. Audience seed gigante (Eng IG 365D 115k+ pessoas)
4. CPL histórico saudável vs ticket (R$18-31 × 70-495× ROAS estimado)
5. Partnership isolada e correta (BM Kell ownership; Vorza Partner) — cluster Meta separado de Tocks/Bretda

## Bugs/gaps confirmados

| # | Bug | Severidade |
|---|---|---|
| 1 | Site sem Meta Pixel há 4 anos | 🔴 P0 |
| 2 | Sem CAPI server-side | 🟠 P1 |
| 3 | Pixel não compartilhado com Vorza | 🟠 P1 |
| 4 | Domain verification ausente | 🟡 P2 |
| 5 | WhatsApp link sem UTM | 🟡 P2 |
| 6 | Customer list inexistente (LAL value-based bloqueada) | 🟡 P2 |
| 7 | Adsets sub-budgetados pra sair de learning phase | 🟡 P2 |

## Insight Estratégico — Bloqueador #1

**Pixel + CAPI no krinteriores.com.br.** Não é otimização adset, não é teste creative, não é escalada budget. É **destravar atribuição estrutural**. Sem isso, qualquer escala R$50→R$150/d amplifica o cego, não o ROAS.

Sequência correta:
1. **D+0 a D+3 (agora)**: Kell instala PixelYourSite Free + Pixel `495385076720880`. 2-4h.
2. **D+3 a D+7**: pixel coletando PageView/ViewContent/Contact baseline. Kell exporta CSV projetos fechados 12m.
3. **D+7 a D+14**: avaliar V3 com pixel funcionando + decidir escala R$100-150/d.
4. **D+14+**: CAPI (PixelYourSite Pro R$80/ano), LAL 1% value-based, RTG site, exclude visitantes WA.

## Veredito D+3 (sem dados live)

**NÃO TIRAR conclusão de winner em D+3 com este budget.** R$10-20/d × 3-4d = R$30-80 por adset = volume estatisticamente inviável.

Recomendação operacional D+3 (executar SÓ com MCP bridge ligado):
- Rodar `meta_ads_insights` por adset 30/Abr→03/Mai
- **Manter 3 ACTIVE até D+7** (07/Mai)
- Pausar critério único: adset gastou >R$50 e ZERO conversas em 7d → matar
- Escalar critério: só após D+14 com pixel funcionando + CPL real medido
- NÃO MEXER targeting/creative/budget durante learning phase

## Pendências User (ordem de impacto)

1. 🔴 **P0** — Kell instalar PixelYourSite + Pixel `495385076720880` (desbloqueia 2-3× ROAS visível)
2. 🟠 **P1** — Kell exportar CSV 12m projetos fechados
3. 🟠 **P1** — Kell compartilhar Pixel `495385076720880` com BM Vorza (Advertiser)
4. 🟡 **P2** — Verificar domínio no BM Kell (AEM iOS)
5. 🟡 **P2** — Anexar UTMs ao link WhatsApp nos 3 ads
6. 🟡 **P2** — Validar saldo/payment method partnership (D+3 hoje)

## Comparativo 3 contas auditadas hoje 03/Mai

| Conta | Score Google | Score Meta | Bloqueador #1 |
|---|---|---|---|
| **Tocks** | 3,5/10 | 6,5/10 | CAPI server (D++) + GTM Tray value |
| **Bretda** | 2,5/10 | 5,5/10 | CAPI Caminho B + saldo R$327 crítico |
| **KR** | 0/10 (removida) | **5/10** ⬇ mais cega | Pixel no site (4 anos sem) |

**Convergência diagnóstica:** todas 3 contas têm CAPI/tracking server-side como bloqueador raiz. Diferença: Tocks/Bretda têm pixel browser disparando, KR não tem nada.

## Agent ID

- traffic-chief sessão KR audit: `a9608230e26360f67`
