---
name: kr-whatsapp-routing-void-12-mai
description: "SMOKING GUN — wa.me da Page KR aponta pra +55 61 9872-0330 (faltando 1 dígito \"9\"), enviando 99 conversas em 12d (R$437) pra WABA Cloud API inacessível ao celular da Kell. Campanha PAUSED 12/Mai 14h. Bug pattern paralelo ao Bretda Instant Form 12/Mai."
metadata: 
  node_type: memory
  type: project
  originSessionId: df35c3b8-a422-47ff-a98d-7da9ff983f37
---

# KR — Discovery WhatsApp Void 12/Mai/2026

## Diagnóstico — bug definitivo

User reportou "clientes não chegam na Kelline". Investigação 60 min revelou:

**Smoking gun visual:** wa.me link na inbox Meta Business Suite mostra `https://wa.me/556198720330` (12 dígitos). Número correto da Kell é `+55 61 99872-0330` (13 dígitos). **Falta um "9"** — provavelmente WhatsApp Business Cloud API configurada com número errado (gestor antigo ou typo).

**Smoke test:** Breno clicou ad Instagram → WhatsApp abriu → mandou "TESTE BRENO 12/MAI" → Kell NÃO recebeu no celular dela. Mas inbox Meta Business Suite confirmou recebimento (painel direito mostra "Breno respondeu a You" + "Tá bom"). Confirma: mensagens chegam na WABA virtual, não no app do celular dela.

## Funil real (14d)

| Etapa | Volume |
|---|---|
| Link clicks | 525 |
| Meta "conv_started" | 99 |
| Auto-reply WABA | 98 |
| Kell viu no celular dela | **0** |

R$437,74 queimados em 12d. CPL conversa Meta R$3,60 era REAL — só que canalizado pra void.

## Adsets V3 (campaign `120246823605310268`)

- A Newlywed Brasília — PAUSED na descoberta (freq 5,23 antes)
- B Eng IG 365D 115k seed — R$234/d, 61 conv, CPL R$3,85
- C RTG IG 90D — R$118/d, 32 conv, CPL R$3,70

## Filtro "Respostas a anúncios" zera (descoberta secundária)

Meta NÃO tagueia mensagens vindas de CTM ad como "ad response" dentro da inbox WABA. As 99 conversas estão misturadas com orgânicas na aba WhatsApp SEM filtro. Pré-filled "Olá, estava no seu site..." é signature pra identificar ad-driven em meio às orgânicas.

Atribuição é fragmentada:
- Camada Ads Manager: 99 messaging_conversation_started_7d ✅
- Camada Inbox WABA: filtro "Respostas a anúncios" = 0 ❌
- APIs internas distintas, tag não cruza

## Página config

- Page ID: `543056628881459`
- Pixels: 2 (`495385076720880` iMotion 2024, `154170033555238` Designer Kelline 2021)
- WhatsApp Page connection: WABA com número errado `+55 61 9872-0330` (sem o 2º 9)
- WhatsApp app da Kell: `+55 61 99872-0330` (com os dois 9, ATIVO mas DESCONECTADO da Page)

## Hot leads vistos visualmente (precisam resposta urgente)

- `5561939...` — "Quanto fica?" (Wedson, buying signal puro)
- `556191918885` — Kell já respondeu "Entendi Tá joia Obrigada"
- `556185697871` — foto enviada
- `556184217089` — message can't be displayed (audio/sticker)
- `556184122042` — "Branco"
- `556199072454` — mensagem de voz
- `556196459640` — "está em jardim Obrigadaa"

## Ações tomadas

1. ✅ Campanha `120246823605310268` PAUSED 12/Mai 14h
2. ✅ Diagnóstico salvo: bug é routing WhatsApp Page→WABA errado, não tracking ou audience
3. 🟡 Pedido Kell: full-page screenshot inbox WhatsApp SEM filtro → extrair CSV 99 leads
4. 🟡 Pedido Kell: triagem manual 99 leads (responder hot leads enquanto config errada ainda live)
5. 🟡 Pedido Kell: Page Settings → WhatsApp → desconectar errado + conectar +55 61 99872-0330 (com SMS verification no celular dela)
6. 🟡 Pós-fix: smoke test Breno repete, confirma msg chega no celular Kell, libera ads

## Pendências user (Breno)

- Cobrar Kell pelos prints da Page Settings → WhatsApp + inbox completa
- Decidir se ativa AD 17 v2 Qualificada (PAUSED desde 04/Mai) quando religar — copy "alto padrão / Águas Claras / processo exclusivo" muito superior ao AD 17 v1 genérico
- Mexer no pre-filled text dos ads (atual "Olá, estava no seu site..." é genérico e não engaja)

## Trade-offs estratégicos

- CPL R$3,60 conversa = REAL mas misconfigured → potencial 5-10× quando config certa
- Audience B (Eng IG 365D 115k) valida — manter na religação
- Adset A (Newlywed) saturado freq 5,23 — refresh creative obrigatório
- Pixel site ainda pendente (2+ semanas — Kell não priorizou)
- Sem CSV projetos fechados 12m — sem denominador ROAS real ainda

## Bug pattern paralelo — Bretda 12/Mai

Mesma data, mesmo padrão estrutural: Bretda Meta ads com `destination_type=ON_AD` (Instant Form) configurado errado pelo gestor antigo, com `link_url` cosmético apontando pra LP que nunca era usada. Bug categoria geral: **"Gestor antigo configurou destino errado, métricas Meta enganaram diagnóstico por meses, dono real do funil opera no escuro"**.

Ver:
- [[feedback_meta_ctm_waba_wrong_number]] — feedback rule derivada
- [[session_bretda_restore_12mai]] — paralelo Bretda

## Comparativo contas auditadas 03/Mai vs 12/Mai

| Conta | Score 03/Mai | Discovery 12/Mai |
|---|---|---|
| Tocks | 6,5/10 Meta | (sem revisitar nesta sessão) |
| Bretda | 5,5/10 Meta | Todos ads sempre Instant Form, AD10v2 link cosmético |
| **KR** | 5/10 Meta | **wa.me número errado, 99 leads em void 12d** |

3/3 contas tinham bugs estruturais que métricas Meta mascaravam. Lição grande: **smoke test manual (Breno mandando msg teste pelo próprio ad, dono confirmando recepção) > toda métrica do Ads Manager**.

## Files temp (não persistentes, só nesta sessão)

- `C:\Users\kingp\Downloads\WhatsApp Video 2026-05-12 at 11.58.03.mp4` — vídeo inbox Kell (44s)
- `C:\Users\kingp\Downloads\WhatsApp Image 2026-05-12 at 12.16.02.jpeg` — screenshot inbox WhatsApp tab
- `C:\Users\kingp\Downloads\WhatsApp Image 2026-05-12 at 13.11.58.jpeg` — screenshot pós-filter "Respostas a anúncios" zerado
- `C:\Users\kingp\AppData\Local\Temp\kr-video-frames\` — 22 frames extraídos via ffmpeg

## Triggers próxima sessão

- `audit kr d+1` (13/Mai) — verificar se Kell trocou WhatsApp Page + triagem leads
- `csv leads kr` — quando screenshot completo chegar, extrair 99 contatos pra planilha
- `religa kr v3` — pós-smoke test OK confirmar funciona
- `pausa kr` / `religa kr` — state changes campanha
- `kr stuck` — se Kell não responder em 48h, decidir próximo passo
- `bretda kr pattern review` — futuro: review formal dos 2 bugs misconfigured-destination
