---
name: Tocks Scale R$250/dia 17-Abr
description: Escalonamento Tocks R$45→R$250/dia + diagnóstico dos 3 problemas urgentes (ROAS, MC, CAPI)
type: project
originSessionId: 6116b521-7291-48f0-8c83-940271d3cf4a
---
# Tocks — Scale R$ 250/dia (16-17/Abr/2026)

## Alocação executada
- **Google Search Alta-Intencao** (23703520246): R$ 35 → **R$ 150/dia** (unicorn, Lost-IS 83%)
- **Google PMAX LEADS 01/04** (23652946232): R$ 108 → **PAUSED** (CPA R$ 108, donkey)
- **Google Shopping Mesas Artesanais** (23743031426): R$ 20/dia (zumbi por MC)
- **Meta C005 CSD WhatsApp** prospecting: R$ 35 → **R$ 50/dia**
- **Meta C006 RTG WhatsApp**: R$ 15 → **R$ 30/dia**
- **Total:** R$ 250/dia nominal (R$ 230 efetivo)

## 3 Problemas Urgentes — Root Cause

### 1. ROAS cego (Google) — NÃO era falta de Enhanced Conversions
Root cause REAL: conversion action "WhatsApp - CLICK" (7540631962) tem `default_value=0` + `always_use_default_value=true`. 99% das 116 conv vêm de "Visualização de página - CLICK" (7540774791) marcada como Primary com valor 0.
**Fix:** editar WhatsApp-CLICK para valor R$ 13.000 + remover Visualização de Primary. UI manual.

### 2. Merchant Center 5665639473 — Content API bloqueada
Refresh token Google Ads NÃO tem scope `https://www.googleapis.com/auth/content` → 403 PERMISSION_DENIED.
Impossível diagnosticar policies via API sem gerar novo token. 2 merchants na conta: 5601646871 (legado) + 5665639473 (atual). Precisa UI manual em merchants.google.com.

### 3. CAPI Meta — JÁ ESTÁ ATIVO (descoberta)
Pixel 1382948639707224 rodando **50.5% server / 49.5% browser = benchmark ouro do Meta**. has_pii 97%, external_id dominante. O "problema" real não é CAPI — é que **só manda eventos de navegação** (PageView/ViewContent), ZERO Lead/Contact/Purchase. Match keys fracas (só 7 zip em 3421 eventos).
**Fix:** backend precisa mandar evento `Contact` (clique WhatsApp) e `Lead` (1ª msg no WhatsApp Cloud API) via CAPI com email/phone SHA-256.

## Próxima revisão: 24/Abr/2026
- Se P1 resolvido (value>0) → scale Search R$150→R$200 + tROAS 600%
- Se P2 não resolvido em 7d → pausar Shopping, realocar R$20 para Search
- Se Meta Lead events >20/dia → trocar otim C005 de CONVERSATIONS para LEADS (+15-30% volume)

## Why
Usuário pediu para escalar pra R$ 250/dia direcionando majoritariamente ao que funciona. Search Alta-Intencao tinha CPA R$ 1,83 com Lost-IS 83% — claro winner. PMAX LEADS 01/04 CPA R$ 108 com 342 clicks/1 conv — claro donkey.

## How to apply
- Referência para próxima sessão: pular rediagnóstico dos 3 problemas, partir dos fixes
- Se usuário perguntar "CAPI tá funcionando?" → sim, 50/50 saudável, falta só eventos de conversão
- Se usuário pedir scale >R$250 → exigir P1 resolvido antes (senão ML otimiza cego)
- Arquivos técnicos em `D:/AIOS/tmp-ads/tocks-*-17abr.*` e memória detalhada em `.claude/agent-memory/traffic-masters-chief/project_tocks_3urgentes_17abr.md`
