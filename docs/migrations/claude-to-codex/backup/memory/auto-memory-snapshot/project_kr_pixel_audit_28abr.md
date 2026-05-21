---
name: KR Pixel Audit + Plano Reativação Final 28/Abr
description: 28/Abr/2026 — auditoria pós-restart confirmou KR no MCP, mas descobriu que site não tem pixel instalado há 4 anos. Plano reativação reformulado.
type: project
originSessionId: 877b1996-ea12-4314-ba46-ebdb9d6fadcf
---
# KR Interiores — Pixel Audit + Plano Final 28/Abr/2026

## Achado crítico: site sem pixel há 4 anos

**Site:** krinteriores.com.br (WordPress + Elementor Pro + Hello theme + Google Site Kit)

**Tracking instalado HOJE:**
- ✅ Google Tag `GT-PLTDF9J5` (gtag.js direto, sem GTM)
- ✅ Google Site Kit consent mode plugin
- ❌ **Meta Pixel: ZERO** (nem 495385076720880 nem 154170033555238 disparando)
- ❌ **CAPI: ZERO**
- ❌ **Conversion events Meta: ZERO**
- ❌ **GTM: ZERO**
- ✅ WhatsApp link: `https://wa.me/5561998720330` (61 9 9872-0330) — sem UTM, sem evento

**Implicação:** R$20.599 gastos em Meta (4 anos) com **zero atribuição site**. Toda otimização foi in-Meta (messaging_conversation_started_7d, page_engagement). Por isso CPL R$31 é tão bom — é resultado bruto sem ajuda de Pixel/LAL/retargeting.

## Status MCP Bridge KR (validado 28/Abr pós-restart)

```
✅ act_210585430466029 aparece em meta_ads_list_accounts (4ª conta)
✅ Token Vorza funcionando via partnership
✅ Lifetime: R$20.599,80 spent / 32 campanhas / 1.594 conversas WhatsApp
✅ 28 custom audiences (engagement only — IG 365D = 115.900 pessoas)
❌ Pixel não dispara no site
❌ Customer list inexistente (Kell não tem CSV de clientes)
🟡 1 campanha ACTIVE com stop_time passado (PAUSADA por mim)
🟡 1 adset ACTIVE em V2 (R$44/dia) — mas zero spend nos últimos 30d
```

## Decisões da Kell (28/Abr)

| # | Pergunta | Resposta |
|---|---|---|
| 1 | Pixel canônico? | "Faça como achar melhor, mas não apagar" → manter ambos, instalar mais novo no site |
| 2 | Por que pausou? | "Já relatei" → gestor antigo disse "Meta não dá resultado" (incompetência) |
| 3 | Customer list? | "Não" → Kell não tem CSV de clientes históricos |
| 4 | Budget? | R$50/dia (R$1.500/mês) |
| 5 | Criativos? | "Tem muito conteúdo, criaria novos sem problema" |

## Argumentos contra a tese do gestor antigo (matemática)

CPL R$31/conversa WhatsApp (V2 atual) × ticket projeto Brasília Plano Piloto:
- Pessimista 3% × R$30k → ROAS **70×**
- Realista 5% × R$50k → ROAS **193×**
- Otimista 8% × R$80k → ROAS **495×**

Mesmo no pior cenário, R$1 → R$70. Gestor antigo nunca mediu ROAS — só olhou CPM/CPC.

## Plano Reativação Final (3 fases)

### Fase 1 — Instalação Pixel (CRÍTICO, antes de gastar 1 centavo)
- Instalar Pixel `495385076720880` (mais novo, "[iMotion]") no krinteriores.com.br
- Plugin recomendado: **PixelYourSite** (Free ou Pro R$80/ano)
- Setup CAPI server-side (PixelYourSite Pro inclui)
- Eventos a configurar:
  - `PageView` (auto)
  - `ViewContent` (em todas páginas de projeto)
  - `Contact` (click no WhatsApp)
  - `Lead` (submit do formulário de contato)
- UTMs no link WhatsApp: `?utm_source=meta&utm_medium=paid&utm_campaign={campaign_name}`
- Tempo estimado: 2-4h Kell ou dev

### Fase 2 — Reativação enxuta R$50/dia × 14d (R$700 budget total)

3 adsets em campanha nova ou na V1 (clonando o vencedor histórico):

**Adset A — Refresh V1 vencedor (CPL R$18 histórico)** — R$20/dia
- Clonar adset 120213559830090268 ("Recém Casados Região Ampla")
- Targeting: Newlywed 3m/6m/1y, idade 30-60, raio 16km Brasília Plano Piloto
- Criativo NOVO da Kell (hooks: "Antes x Depois", "Showoff narrado", "Apartamento Vazio")
- Optimization: CONVERSATIONS / WHATSAPP_MESSAGE
- Bid: LOWEST_COST_WITHOUT_CAP

**Adset B — LAL 1% Engajamento IG 365D** — R$20/dia (sem customer list, usa engagement)
- Audience seed: `120213977576940268` (Engajamento IG Todos 365D, 115.900-136.400 pessoas)
- LAL 1% Brasília
- Mesma idade/criativo do A
- Optimization: CONVERSATIONS

**Adset C — Retargeting Engajamento IG 90D** — R$10/dia (audiência morna)
- Audience: `120213977616790268` (Engajamento IG Publicação 90D)
- Exclude (após pixel rodar): visitantes que já clicaram WhatsApp
- Criativo orientado a "fundo de funil" (depoimento, antes/depois)

### Fase 3 — Relatório ROAS pra Kell (após 14d)

- Tabela: gasto / conversas iniciadas / conversas qualificadas / projetos fechados (Kell rastreia manual via WhatsApp) / receita real / **ROAS**
- Comparar com baseline gestor antigo (CPL R$31, sem ROAS calculado)
- Decisão: escalar pra R$100-200/dia ou desligar

## ✅ ATUALIZAÇÃO 30/Abr — KR LIVE

Bloqueios resolvidos (28-30/Abr):
1. **Page permission `1487202`** ✅ — Kell atribuiu System User Vorza → Page com "Gerir Página"
2. **`advantage_audience` flag `1870227`** ✅ — movido pra dentro de `targeting`
3. **Política não-discriminação `2859024`** ✅ — user aceitou no BM Vorza

Stack ACTIVE (30/Abr):
- Camp `120246823605310268` ACTIVE
- Adset A `120246936876500268` R$20/d Newlywed Brasília 16km 30-60 → Ad `120246937383360268` AD 14 "Sua casa custou Milhões" (creative `1452447039211036`)
- Adset B `120246936885880268` R$20/d Eng IG 365D DF 30-55 → Ad `120246937384220268` AD 17 "Showoff narrado" (creative `895134416591313`)
- Adset C `120246936886890268` R$10/d RTG IG 90D DF 30-55 → Ad `120246937384680268` AD 12 "Sofisticação Elegância" (creative `1447235576435002`)
- **R$50/d total = R$1.500/mês**

Strategy: reaproveitamos creatives validados em vez de pedir novos pra Kell (acelerou ativação em ~7 dias).

## 🚨 BLOQUEIO descoberto 28/Abr noite — Page permission (HISTÓRICO, RESOLVIDO)

Tentei criar adsets na campanha `120246823605310268` ([REATIVAÇÃO] [MSG] [V3]) e bati erro Meta API `error_subcode: 1487202`:

> "Permissões da Página insuficientes para apresentar anúncios. Precisas de acesso para criar anúncios para esta Página."

**Causa-raiz:** O setup do partnership de 28/Abr compartilhou a **ad account** (act_210585430466029) mas **não a Página FB** (`543056628881459` - KR Interiores Design). Partnership Meta tem assets separados — ad account ≠ page ≠ pixel ≠ catalog.

**Resolução (Kell faz em 5min):**
1. Acessar Business Settings da BM Kell em business.facebook.com
2. Accounts → Pages → selecionar "KR Interiores Design"
3. Add Partner → Business ID: `2744791262542284` (BM Vorza)
4. Assign role: **Advertiser** (suficiente; Admin se quiser dar full access)
5. Bonus: compartilhar também o Pixel `495385076720880` ([iMotion]) pra desbloquear retargeting/CAPI futuro

**Estado atual no MCP:**
- ✅ Campanha `120246823605310268` criada (PAUSED, zero risco)
- ❌ Adsets A/B/C bloqueados pendente permission da página
- 📌 Page ID confirmado via meta_ads_audience: `543056628881459`

## O que vou executar autônomo

Sem aprovação adicional, **somente leitura/análise**:
- ✅ Auditoria completa do BM/ad account (já feito)
- ✅ Pausa campanha zumbi 120237058548130268 (já feito)
- ✅ Documentação de achados (este arquivo)

**Aguardo aprovação explícita** pra:
- Criar adsets PAUSED (mesmo com guardrail R$100/dia automático)
- Modificar custom audiences existentes
- Qualquer mudança em campanhas live

## Próxima sessão — checkpoint

1. Decisão Kell sobre instalação pixel (ela mesma via plugin OU contratar dev)
2. Criativos novos da Kell (4 hooks: Antes x Depois, Showoff, Apartamento Vazio, Chave do AP)
3. Aprovar criação dos 3 adsets PAUSED com seeds e targeting acima
4. Pedir Kell pra começar a logar projetos fechados últimos 12m + ticket médio (denominador do ROAS)

## Arquivos relacionados

- `project_kr_meta_setup_28abr.md` — setup partnership Vorza ↔ BM Kell
- `project_kr_interiores.md` — histórico Google Ads (suspensa)
- `project_kr_suspension_17abr.md` — Google removida MCC 17/Abr
- `session_28abr_rtk_kr_setup.md` — log da sessão 28/Abr noite
