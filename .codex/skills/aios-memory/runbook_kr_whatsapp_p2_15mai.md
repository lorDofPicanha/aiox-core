---
name: kr-whatsapp-p2-runbook-15-mai
description: "Runbook passo-a-passo pro Breno executar P2 (trocar conexão WhatsApp da Page KR) já que Kell não está conseguindo. Caminho Page Settings, com salvamento prévio dos 99 leads. Inclui caveats sobre admin role, 2FA, SMS code, e como evitar apagar histórico."
metadata:
  node_type: memory
  type: project
  originSessionId: 15-mai-2026
---

# KR — Runbook P2 Trocar WhatsApp da Page (Breno executa pela Kell)

## Contexto

User decidiu operar P2 pela Kell em 15/Mai (Kell não conseguiu sozinha). Bug original: wa.me da Page KR aponta pra `+55 61 9872-0330` (12 dígitos, faltando 2º "9"), número correto é `+55 61 99872-0330`. Campanha V3 `120246823605310268` ainda PAUSED. Ver [[session_kr_whatsapp_void_12mai]] e [[reminder_kr_kell_pending_12mai]].

## Pré-requisitos

1. **Login Facebook admin da Page** (conta Breno com role admin OU login Kell)
2. **Celular Kell ligado + ela próxima** — Meta manda SMS/voice code pro número novo durante vinculação
3. **WhatsApp Business app `99872-0330`** ativo no celular Kell
4. **Confirmar se número Kell já está vinculado a outra Page passada** — se sim, vai pedir sobrescrever
5. ⚠️ **P0 dos 99 leads históricos** — capturar screenshot full-page ANTES do passo 1, senão vira void permanente

## Caminho A — Page Settings (mais simples)

### Passo 0 — Salvar 99 leads (obrigatório antes)
1. `business.facebook.com` → Caixa de Entrada → WhatsApp
2. Remove filtro "Respostas a anúncios" (clica de novo pra desativar — bug Meta)
3. F12 → Ctrl+Shift+P → "capture full size screenshot" → PNG
4. Backup: vídeo 2-3 min scrollando topo→base

### Passo 1 — Localizar WABA errada
1. `business.facebook.com` → Configurações do negócio (engrenagem)
2. Contas → Contas do WhatsApp
3. Tira print da WABA `+55 61 9872-0330` + anota WABA ID

### Passo 2 — Desconectar via Page Settings
1. `facebook.com/krinteriores` → Configurações da Página
2. Menu lateral → WhatsApp (ou Mensagens → WhatsApp)
3. Print do número atual
4. Botão "Desconectar" / "Remover número"
5. ⚠️ **NÃO marcar "Apagar histórico de mensagens"** se aparecer — mantém leads
6. Confirma

### Passo 3 — Conectar número correto
1. Page Settings → WhatsApp → "Conectar WhatsApp" / "Adicionar número"
2. Escolhe "Usar WhatsApp existente" (não criar novo)
3. Digita `+55 61 99872-0330` (com os 2 noves)
4. Meta envia SMS ou voice code pro celular Kell
5. Kell passa o código → Breno digita
6. Se pedir PIN 2FA WhatsApp Business: Kell fornece

### Passo 4 — Validar
1. `business.facebook.com` → Inbox → aba WhatsApp
2. Conta listada agora deve ser a do Business app da Kell
3. Conferir profile número = `+55 61 99872-0330`

### Passo 5 — Smoke test (com Kell)
**5a — Via Page CTA (sem religar ad):**
1. Breno celular → `facebook.com/krinteriores`
2. Clica "Enviar mensagem" / "WhatsApp" botão da Page
3. WhatsApp abre → manda "TESTE BRENO 15/MAI pós-fix"
4. Kell confere recepção no Business app

**5b — Religando 1 ad temp (se 5a não validar):**
- Orion reativa AD17-v2-Qualificada por 10min, Breno clica do IG, depois pausa

## Caveats / riscos

| Risco | Mitigação |
|---|---|
| Kell não atende SMS | 3 tentativas → escolher "ligação de voz" no Meta flow |
| Número `99872-0330` já vinculado a outra Page | Vai aparecer "sobrescrever?" → SIM |
| Breno sem admin role na Page | Kell adicionar Admin em Page Settings → Roles antes |
| Apagar 99 leads ao desconectar | P0 obrigatório antes do Passo 2. Não marcar delete mensagens |
| 2FA WhatsApp Business | Kell precisa fornecer PIN |
| Profile pic / nome sobrescrito | Conferir após — costuma manter |

## Pós-P2 (não esquecer)

- Religar campanha V3 `120246823605310268` (audset B + C ativos, A PAUSED por freq saturada)
- Ativar AD 17 v2 Qualificada (PAUSED desde 04/Mai — copy 5× melhor que v1)
- Mudar pre-filled text dos ads ("Olá, estava no seu site..." é genérico)
- Instalar Pixel 495385076720880 via PixelYourSite em krinteriores.com.br (3 semanas pendente)

## Triggers
- `kr p2 done` — quando Breno completar passo 4, executar smoke test 5a/5b
- `kr smoke test fail` — se mensagem do Breno não chegar no celular Kell pós-fix, escalar diagnóstico
- `religa kr v3` — pós-smoke OK
- `kr pixel install` — quando finalmente Kell instalar PixelYourSite
