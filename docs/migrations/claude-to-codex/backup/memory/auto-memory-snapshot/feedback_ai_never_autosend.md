---
name: feedback-ai-never-autosend
description: "🚫 IA NUNCA manda mensagem pro cliente. AI = decision-support pra vendedor humano. Apenas operator manda. Razão: Sales AI Tocks deprecated 15/Mai."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ebc3b731-9d6b-4767-b83b-150411c4d83b
---

# Feedback: AI NUNCA Auto-Envia Mensagem ao Cliente

**REGRA ABSOLUTA:** Toda integração de IA em sistemas Synkra é **decision-support** pro operador humano. **IA nunca dispara mensagens pro cliente** (WhatsApp, email, SMS, voice, qualquer canal). Não há "auto-responder", "auto-qualificação que responde", "auto-DM", nada. IA classifica, sumariza, sugere — operador HUMANO aprova + envia.

User confirmou 17/Mai/2026 logo após implementação CRM-A.1 (lead scoring):
> "lembrando que não quero que a ia mande mensagem para o cliente"

## Where the rule applies

| Sistema | Permitido | Proibido |
|---|---|---|
| **CRM Novo `contact-ai-score` worker** | Ler msgs, chamar Claude, gravar contacts.ai_* | Chamar /api/whatsapp send, meta-conversion, Meta Graph send endpoints |
| **CRM Novo conversation UI** | Mostrar ai_summary + ai_next_action como **sugestão** | Pré-popular textarea + auto-submit, scheduled send via AI |
| **Tocks/Bretda CAPI** (Meta/Google) | Server-side conversion upload only | Não relevante (são webhooks, não envios pro cliente) |
| **Futuras integrações IA** | Default: decision-support apenas | Default: proibido sem aprovação explícita do user em sessão |

## Why (Reason)

User pivotou Sales AI Tocks → Closed Beta AI (Anipis) → "no autopilot" sequence:
- **Sales AI Tocks deployed 05/Mai → DEPRECATED 15/Mai** (`session_sales_ai_deploy_05mai.md` + ops decision doc). Motivação:
  - **Métricas Meta infladas:** `messaging_first_reply` contava AI-bot replies como engagement real → CPL parecia bom mas leads convertiam mal
  - **Qualificação fraca:** AI respondia sem contexto humano, levava cliente pra fundo errado do funil
  - **Preferência humano-first:** user prefere conversa de vendedor a bot pra ticket alto (R$8-50k furniture)
- **Anipis Closed Beta AI** (16-17/Mai pivot): mesmo padrão revisitado — beta com AI Anipis respondendo direto mas com **clinical advisor CRP monitorando logs sem intervir**. Saúde mental tem barreira regulatória maior; CRM de vendas não tem essa cobertura humana automática, então proibido.
- **Cost guard:** unbounded AI replies = unbounded LLM cost + unbounded Meta spend nas conversas geradas

## How to apply

### Em código novo

Antes de adicionar qualquer chamada `sendWhatsAppText`, `sendEmail`, `sendSMS` ou outro outbound a partir de:
- Inngest worker
- Cron job
- Trigger automático (Realtime, DB trigger)
- AI agent
- Webhook handler

**STOP. Mude o design pra:**
1. Worker/cron grava `ai_draft_*` em alguma tabela (ex: `contacts.ai_draft_reply text`)
2. UI exibe o draft com botão "Enviar como está" + textarea editável
3. Operador clica → form POST server action → AÍ chama send

### Em CRM Novo especificamente

`apps/crm-novo/CLAUDE.md` agora tem **Non-negotiable #7**:
> "AI NEVER auto-sends messages to clients. All AI workers in `src/lib/ai/`, `src/lib/inngest/functions/contact-ai-score.ts`, and any future AI-derived feature are decision-support for the human operator only. The ONLY code path that calls `sendWhatsAppText` or any Meta send endpoint is `sendMessageAction` in `src/app/[slug]/inbox/[contact_id]/actions.ts`, which is gated by an operator form POST."

Doc comments adicionados em:
- `src/lib/inngest/functions/contact-ai-score.ts` (top of file, with "What IS / MUST NOT" lists)
- `src/lib/ai/claude-client.ts` (top of file, scope note)

### Edge cases (allowed exceptions, explicitly)

- ✅ **Status notifications pro OPERADOR** (não cliente): "lead X esfriou", "lead Y voltou a falar" — Slack/email pro vendedor, OK
- ✅ **Confirmação automática de recebimento** (transactional only, não-AI): "Obrigado, recebemos sua mensagem" — gated por template Meta-approved + flag tenant.whatsapp_config.auto_confirm_enabled = true (opt-in explícito). NÃO É AI, é template fixo.
- ❌ **Qualquer AI-generated draft enviado sem operator review**

## Triggers (próximas sessões)

- `revisita sales ai` → eu lembro: deprecated 15/Mai por user decision, não reabrir
- `cria autoresponder X` → eu paro e pergunto: humano aprova ou auto-fire? Default: humano aprova
- `bot whatsapp` → checa se é AI-decision-only ou AI-action; se action, recusa
- `anipis launch` → contexto diferente (clinical advisor monitora), mas mesma regra base aplica

## Related

- [[feedback_use_mind_clones]] — IA é consultoria, não substitui human
- [[session_full_15mai_squad_marketing]] — Sales AI Tocks DEPRECATED 15/Mai contexto
- [[session_anipis_squad_16mai]] — Closed Beta AI (área clínica, diferente)
- [[project_crm_novo_15mai]] — CRM Novo planning
