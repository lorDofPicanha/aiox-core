---
name: kr-kell-pending-actions-12-mai
description: "4 ações pendentes Kell pós-discovery WhatsApp void. Ordem P0→P3. Sem isso, ads ficam PAUSED indefinidamente. Bloqueador é a Kell, não o sistema."
metadata: 
  node_type: memory
  type: project
  originSessionId: df35c3b8-a422-47ff-a98d-7da9ff983f37
---

# KR Pendências Kell — Pós Discovery 12/Mai

## Estado atual

- Campanha `120246823605310268` PAUSED 12/Mai 14h
- Bug confirmado: WhatsApp Page conectado a número errado (sem o 2º "9")
- 99 leads na inbox WABA Meta Business Suite, nenhum no celular Kell em 12 dias
- Smoke test Breno confirmou bug visualmente

## Ações Kell — ordem

### P0 — Salvar os 99 leads históricos (HOJE 12/Mai, antes de mudar config)

1. Abre `business.facebook.com` no PC → KR Interiores Design → Caixa de Entrada → aba WhatsApp
2. **REMOVE o filtro "Respostas a anúncios"** clicando outra vez nele (zera resultado por bug Meta tagueamento WABA)
3. Full-page screenshot:
   - F12 (DevTools Chrome/Edge)
   - Ctrl+Shift+P
   - "capture full size screenshot" → Enter
   - Salva PNG
4. **Manda PNG pro Breno** → Orion extrai CSV 99 contatos

**Alternativa B**: vídeo 2-3 min scrollando inbox completa do topo ao fim (mais lento mas funciona se DevTools falhar)

### P1 — Triagem manual hot leads (enquanto config errada ainda live)

Responder manualmente os 30-40 mais recentes do filtro removido. Foco em:
- Buying signals tipo "Quanto fica?" (visto: Wedson 5561939...)
- Mensagens personalizadas (não pré-preenchidas)
- Datas recentes (últimos 7d, ainda quentes)

Mensagem de retomada sugerida: *"Oi! Aqui é a Kell, recebi tua mensagem dia X pelo Instagram sobre projeto, ainda tem interesse? Quero te entender melhor pra ver se posso ajudar."*

Auto-reply genérico não conta — precisa ela escrever cada uma de forma real.

### P2 — Trocar conexão WhatsApp da Page

1. Configurações da Página KR Interiores Design → menu lateral → WhatsApp
2. **Print do número atual conectado** → manda pro Breno (provavelmente +55 61 9872-0330 sem 2º 9)
3. Desconectar WABA antiga
4. Conectar WhatsApp Business app dela: `+55 61 99872-0330` (com OS DOIS 9)
5. Validar código SMS/WhatsApp que chega no celular real dela

### P3 — Smoke test pós-fix (Breno + Kell)

1. Breno clica ad Instagram → WhatsApp → manda "TESTE 2 BRENO 12/MAI"
2. Kell confirma chegou no WhatsApp Business app do celular
3. SE SIM: Orion reativa campanha + ativa AD 17 v2 Qualificada paralelo
4. SE NÃO: re-escalar diagnóstico (talvez outro bug oculto)

## Pendências paralelas KR (não bloqueiam mas continuam abertas)

- Pixel `495385076720880` instalar no krinteriores.com.br via PixelYourSite (3 semanas pendente — Kell não priorizou)
- CSV projetos fechados 12m pra denominador ROAS real
- AD 17 v2 Qualificada PAUSED desde 04/Mai — ativar quando religar (copy 5× melhor que v1)
- Pre-filled text dos 3 ads atualmente "Olá, estava no seu site..." é genérico, mudar pra "Oi Kell, vi seu anúncio sobre projeto pra [APTO/CASA] em [BAIRRO]..."

## Triggers

- `audit kr d+1` — checar progresso Kell 13/Mai (próximo dia)
- `csv leads kr` — quando screenshot chegar, extrair contatos
- `religa kr v3` — pós-smoke test OK
- `kr stuck` — se Kell não responder em 48h, decidir se pausa indefinida vale a pena ou se Breno cobra direto
- `kr pixel install` — quando finalmente Kell instalar PixelYourSite
