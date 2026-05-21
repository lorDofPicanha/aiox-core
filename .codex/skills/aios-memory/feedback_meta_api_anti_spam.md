---
name: Meta API anti-spam — não ativar muitos objetos simultâneo em ad account fresh
description: Em ad account NOVA (sem histórico), criar muitos objetos + tentar ativar todos em paralelo dispara automated risk review = "API access blocked" code 200 instant. Solução: PAUSED + esperar + ativar UM POR VEZ.
type: feedback
originSessionId: bb9160a3-dc9c-41a7-a24c-e78fa5d58550
---
# Meta API — Anti-spam pattern em ad account fresh

## Regra
**Em ad account NOVA, NÃO criar+ativar muitos objetos em poucos minutos via API.**

Pattern que dispara bloqueio:
1. Criar 1 campaign (PAUSED) ✅ OK
2. Criar 2 adsets (PAUSED) ✅ OK
3. Criar 6 ads (PAUSED) ✅ OK
4. Tentar ativar 9 objetos em paralelo via API → ❌ `code 200 "API access blocked"` instant em TODAS as chamadas, mesmo READ

## Why
**Meta automated risk review** — ad accounts sem histórico de spend são monitoradas por antifraud. Criação rápida de muitos objetos seguida de ativação simultânea = pattern de bot/spam = bloqueia o token inteiro (até GET /me falha).

Combinado com **domain verification PENDENTE** no BM, fica pior — Meta não consegue confirmar onde o tracking acontece.

## How to apply

### Antes de criar campanha em ad account fresh
1. Confirmar `meta_ads_pixel_check account=X` retorna pixel attached + last_fired recente
2. Confirmar **domain verification** está OK no BM (Settings → Brand Safety → Domains)
3. Se possível, fazer um trade-up: rodar uma campanha pequena MANUAL pelo Ads Manager primeiro (R$5/d 1 dia) pra "warm up" a account com histórico real

### Ao criar via API
1. Criar todos PAUSED — ✅ pode em paralelo
2. **Aguardar ~30 min** entre criação e primeira ativação
3. Ativar SEQUENCIAL: campaign → adset 1 → adset 2 → ad 1 → ad 2 ... (não paralelo)
4. Se Meta bloquear mid-way: parar imediatamente, aguardar 1-2h, ativar resto manual no Ads Manager

### Se já bloqueou (token retorna `API access blocked` em qualquer call)
1. **NÃO insistir** — bloqueio amplifica
2. User loga em business.facebook.com → notifications + Account Quality + Security Center
3. Resolver compliance issue específico (geralmente domain verification ou identity check)
4. **Despausar manualmente** pelo Ads Manager (UI authenticated bypassa o token API bloqueado)
5. Aguardar ~24h pro token desbloquear automaticamente OU regenerar token via App Dashboard

## Caso real
30/Abr/2026 — Vorza M3C low-ticket. Criei via API: 1 campaign + 2 adsets + 6 ads em ~10 min. User mandou "go" pra ativar. Disparei 9 update_status paralelo. **Todos os 9 retornaram code 200 instant.** Bretda na mesma sessão funcionava normal (R$1.318 spent 30d). Confirmado via curl direto Graph API debug_token — token Vorza completamente bloqueado, até /me falhava. User precisou resolver compliance issue + restart Claude Code.

## Quando NÃO se preocupar
- Ad accounts maduras (≥30d de spend histórico): Meta confia mais, anti-spam menos sensível
- Update de OBJETOS EXISTENTES (vs criar novos): geralmente OK paralelo
- Read calls (overview, insights): raramente bloqueiam
