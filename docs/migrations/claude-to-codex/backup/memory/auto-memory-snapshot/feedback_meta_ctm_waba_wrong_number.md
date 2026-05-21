---
name: meta-ctm-waba-wrong-number-routing
description: "Click-to-WhatsApp Meta ads podem rotear mensagens pra WABA Cloud API com número errado configurado por gestor antigo — métricas Meta seguem reportando \"messaging_conversation_started\" mas mensagens nunca chegam no celular do dono real. Smoke test manual obrigatório antes de escalar."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: df35c3b8-a422-47ff-a98d-7da9ff983f37
---

# Meta CTM WABA Wrong Number Routing — Smoke Test Obrigatório

## A regra

Antes de declarar campanha Click-to-WhatsApp como funcional (mesmo se Meta reporta CPL conversa baixo e CTR saudável), **EXECUTAR smoke test manual**:

1. Usuário clica próprio ad no Instagram (do perfil pessoal, não business)
2. WhatsApp abre com mensagem pré-preenchida
3. Edita texto pra signature única (ex: "TESTE BRENO 12/MAI")
4. Manda
5. Dono confirma recepção no app WhatsApp Business do celular dele

**Se NÃO chegar no celular do dono real:** bug de roteamento WABA. Pausar campanha imediatamente. R$30+/d batendo void.

## Why

KR Interiores 12/Mai/2026: gastou R$437 em 12 dias com Meta reportando 99 messaging_conversation_started_7d (CPL R$3,60). Kell relatou "clientes não chegam no WhatsApp dela". Discovery: wa.me da Page configurado pra `+55 61 9872-0330` (12 dígitos, faltando 1 "9"). Número real dela: `+55 61 99872-0330` (13 dígitos). Mensagens iam pra WhatsApp Business Cloud API virtual visível só em Meta Business Suite Inbox aba WhatsApp, nunca no app do celular dela.

Bug pattern paralelo Bretda 12/Mai mesma data: ads com `destination_type=ON_AD` (Instant Form) onde `link_url` era cosmético, mensagens ficavam em Instant Form Meta-side, dono pensava ser LP form. Categoria geral comum: **"Gestor antigo configurou destino errado, métricas Meta seguem reportando, dono real opera no escuro por meses"**.

## How to apply

**Sempre ao herdar conta Meta Click-to-WhatsApp:**
1. Pedir dono mandar print Page Settings → WhatsApp connection (qual número/WABA está vinculado)
2. Comparar com número WhatsApp Business app dele de fato
3. Se diferir → bug provável, smoke test obrigatório ANTES de escalar
4. Se igual → smoke test ainda recomendável (pode ter outros gotchas)

**Sinais de alerta sem smoke test:**
- Dono diz "leads não chegam" mesmo com Meta reportando volume saudável
- Auto-reply count alto sem ele ter configurado nada
- Filtro inbox "Respostas a anúncios" mostra 0 mesmo com `conversations` > 0 na Ads API
- wa.me link na Page tem dígito a menos/mais que o esperado
- Replies aparecem em Meta Business Suite Inbox mas não no celular

**Fix path (após confirmar bug):**
1. Page Settings → WhatsApp → desconectar WABA antiga
2. Conectar WhatsApp Business app do dono real via SMS verification do celular dele
3. Smoke test repetir, confirma msg chega no app WhatsApp Business
4. Reativar campanha

**Salvamento de leads históricos antes do fix:**
1. Antes de mexer config, full-page screenshot da inbox WABA antiga (F12 → Ctrl+Shift+P → "capture full size screenshot")
2. OU vídeo scrolando inbox 2-3 min
3. Extrai phones via OCR/multimodal vision (Claude lê imagem direto)
4. CSV para reach-out manual pelo número correto após fix

**Pre-flight check ao começar diagnóstico de "leads não chegam":**
1. Smoke test antes de qualquer outra investigação (60s, resolve 60% dos casos)
2. Se passar → investigar qualidade lead / sales process
3. Se falhar → investigar routing (este pattern)

## Related

- [[session_kr_whatsapp_void_12mai]] — caso original onde descobrimos o pattern
- [[session_bretda_restore_12mai]] — bug pattern paralelo (Instant Form com link_url cosmético)
- [[feedback_meta_pixel_attach_before_offsite_conv]] — outro Meta misconfig pattern (pixel attach order)
- [[feedback_check_out_of_scope_first]] — meta-pattern de check antes de propor
- [[feedback_meta_partnership_assets]] — segregação de assets em partnership Meta
