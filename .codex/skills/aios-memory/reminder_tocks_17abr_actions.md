---
name: LEMBRETE — Tocks Ações 17/Abr/2026
description: Checklist urgente para o usuário executar em 17/Abr após escalonamento Tocks R$250/dia
type: project
originSessionId: 6116b521-7291-48f0-8c83-940271d3cf4a
---
# 🔔 LEMBRETE ATIVO — 17/Abr/2026

**Se for dia 17/Abr ou depois, AVISAR O USUÁRIO no início da conversa sobre essas ações pendentes.**

## Contexto
Ontem (16/Abr) escalamos Tocks pra R$ 250/dia. 3 problemas urgentes identificados. Usuário precisa executar manualmente.

## 🚨 P0 NOVO DESCOBERTO 17/Abr — BALANCE BAIXO
- Saldo atual: R$ 250 vs budget R$ 170/dia Google = 1,47 dias runway
- Hoje 17/Abr: 2 imp / R$ 0 gasto (Google estrangulou delivery)
- Ontem 16/Abr: R$ 11,88 gasto de R$ 170 budget (6,9%) — estrangulamento preventivo
- **AÇÃO:** adicionar R$ 2.750 via PIX (total R$ 3.000, 17 dias runway) + ativar Auto-refill
- Detalhes: [project_tocks_balance_crisis_17abr.md](project_tocks_balance_crisis_17abr.md)

## Checklist urgente do usuário

### 🔴 P1 — Google Ads UI (ads.google.com conta 8146675397)
Bloqueio: ROAS cego — sem isso, scale acima de R$ 150/dia é cego.
- [ ] Tools > Conversions → remover "Visualização de página - CLICK" (7540774791) de Primary Goals
- [ ] Editar "WhatsApp - CLICK" (7540631962): value = R$ 13.000 fixo
- [ ] Ativar Enhanced Conversions for Leads nessa ação
- [ ] Aguardar 14 dias antes de migrar bid para Max Conversion Value + tROAS 600%

### 🟡 P2 — Merchant Center UI (merchants.google.com conta 5665639473)
Bloqueio: 9 Shopping zumbi gastando R$ 20/dia à toa.
- [ ] Diagnostics > Product issues → anotar TODAS policies violadas
- [ ] Corrigir feed (provável: GTIN missing, image quality, custom-made)
- [ ] Se < 50% produtos aprovados até 24/Abr → pausar Shopping e realocar R$ 20 pra Search (indo pra R$ 170/dia)

### 🟢 P3 — Backend tockscustom.com.br (dev)
Descoberta: CAPI Meta JÁ ESTÁ ATIVO (50/50 server/browser). Falta só eventos de conversão.
- [ ] Mandar evento `Contact` via CAPI quando clicam WhatsApp (com email/phone SHA-256)
- [ ] Mandar evento `Lead` quando WhatsApp Cloud API recebe 1ª msg
- [ ] Adicionar email/phone SHA-256 ao pixel browser
- [ ] Alternativa sem codar: Stape.io ($20/mês) ou Make.com

## Próxima revisão: 24/Abr/2026

Eu (Orion) vou checar:
- Se P1 resolvido → autorizo scale Search R$ 150 → R$ 200 + tROAS 600%
- Se Meta Lead events > 20/dia → troco otimização C005 CONVERSATIONS → LEADS
- Se Shopping ainda zerado → pauso e realoco

## Why
Usuário pediu pra salvar no calendário mas MCP Google Calendar precisa auth (ele dispensou). Lembrete local no sistema AIOX funciona como fallback — MEMORY.md é carregado a cada conversa, então na próxima sessão eu vejo este arquivo.

## How to apply
- Início de CADA conversa a partir de 17/Abr: checar se essas ações foram executadas
- Se usuário perguntar "Tocks?" → referenciar este checklist
- Se hoje for 24/Abr ou depois: rodar revisão completa + delegar pro traffic-masters-chief
- Quando usuário confirmar que P1-P3 foram resolvidos: mover este arquivo pra `.completed/` ou deletar
