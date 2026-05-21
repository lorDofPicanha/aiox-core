---
name: bretda-form-wa-19mai
description: Bretda 4 ads ACTIVE migrados pra Thank You Screen com WhatsApp redirect controlado (wa.me + Copy Chief prefilled msg). 2 forms novos clonados + 4 creatives novos + 4 swaps via Graph API.
metadata: 
  node_type: memory
  type: session
  originSessionId: 98ba60f8-9c33-403c-8964-868077e07db2
---

# Bretda — Lead Form WhatsApp Redirect — 19/Mai/2026

## O que rodou

User pediu pra colocar WhatsApp no formulário Bretda. Diagnóstico revelou:
- 3 ads CP2 já redirecionavam (button_type WHATSAPP, page-managed default)
- 1 ad CP1 (AD11-AMBAR) ia pro site, NÃO pro WA
- Page WhatsApp confirmado `+5547992259554` (match com pedido user)

Copy Chief gerou TOP PICK: msg "Olá, preenchi o formulário da Bretda e gostaria de avançar no orçamento." + botão "Conversar sobre o projeto".

**User escolheu Caminho B (completo).** Upgrade dos 4 ads pra Thank You Screen controlada (VIEW_WEBSITE + wa.me URL + msg prefilled).

## Execução (3 fases, ~10min total via Graph API)

**Phase 1 — Clone forms:**
- CP2 `25022395347422134` → CP2 v3 `2336361236894429`
- CP1 `1795323604460936` → CP1 v3 `1493680715832924`
- Gotcha: para non-CUSTOM questions (FIRST_NAME/PHONE/EMAIL) o label NÃO pode ser enviado no payload (erro subcode 1892063). Solução: enviar apenas `type` para esses; mandar `key/label/options` só para CUSTOM.

**Phase 2 — New creatives:**
- 4 novos creatives criados via POST /act_{id}/adcreatives
- Gotcha: payload original do creative tem `image_url` (read-only) e `link_format` que devem ser strippeados. Manter só os writable fields. AD11-AMBAR (carousel) funcionou de primeira; 3 video_data falharam → retry com payload minimal (video_id, title, message, image_hash, call_to_action.value{type, link, lead_gen_form_id}) funcionou.

**Phase 3 — Ad swap:**
- POST /{ad_id} com `creative={creative_id: new_id}` em todos 4
- Throttle 1.2s entre ops (anti automation-flag pós-Vorza)
- All 4 retornaram `{success: true}`

## Estado pós-execução (verificado)

| Ad | ad_id | Status | Effective | Form novo | Creative novo |
|----|-------|--------|-----------|-----------|---------------|
| AD05-v2 | 120246293646000737 | ACTIVE | IN_PROCESS | 2336361236894429 | 1307987264061855 |
| AD04-v2 | 120246293653980737 | ACTIVE | IN_PROCESS | 2336361236894429 | 957780986859370 |
| AD03 | 120237168468400737 | ACTIVE | IN_PROCESS | 2336361236894429 | 1350539763607969 |
| AD11-AMBAR | 120245285464550737 | ACTIVE | PENDING_REVIEW | 1493680715832924 | 1464030995045228 |

Aguardando Meta review dos creatives (1-3h tipicamente). Após aprovação, leads que submitarem o form caem direto no WhatsApp `+5547992259554` com mensagem prefilled qualificadora.

## Aprendizados-âncora

1. **Page Access Token via `/{page_id}?fields=access_token`** funciona com USER token (não precisa System User), desde que user tenha admin role na page. Confirmado com token Cristiane Gaspar (granular scopes em target page Bretda 249440611589045).

2. **Meta Lead Form clone via API:**
   - questions: stripar `id` (server-assigned). Non-CUSTOM questions: enviar SÓ `type`, NÃO enviar key/label.
   - context_card: stripar `id`.
   - privacy_policy_url → enviar como `privacy_policy: {url, link_text}`.
   - thank_you_page: button_type VIEW_WEBSITE + website_url (full URL) + button_text. Para wa.me com mensagem, encode o param `text` em URL.

3. **Meta Ad Creative clone via API:**
   - Strippar `image_url` (read-only, regenerated Facebook URL).
   - Strippar `link_format` (read-only para algumas placements).
   - Manter `image_hash` (thumbnail do video).
   - `call_to_action.value.link` obrigatório mesmo quando é Instant Form — colocar landing default tipo `https://bretda.com.br/`.
   - Carousel (link_data) aceita payload completo; video_data exige minimal payload.

4. **Ad swap = `POST /{ad_id}` com `creative={creative_id: ...}`.** Não precisa pausar ad. Effective_status vira IN_PROCESS/PENDING_REVIEW temporariamente; reverte pra ACTIVE após Meta review.

5. **Anti automation-flag:** throttle 1.2s entre ops, todas 4 trocas em sequência (não concorrente). Sem burst pattern. Confirmado seguro pós-Vorza-ban-12/Mai.

## Artefatos persistentes em disco

- `D:/jarvis/mcp-ads-bridge/bretda-form-clone-19mai-phase1.json` — IDs dos forms novos
- `D:/jarvis/mcp-ads-bridge/bretda-form-clone-19mai-phase23.json` — Phase 2+3 inicial (3 erros + 1 ok)
- `D:/jarvis/mcp-ads-bridge/bretda-form-clone-19mai-phase23-retry.json` — Retry 3 video creatives (todos ok)

Scripts execução foram limpos pós-run. JSONs mantidos como audit trail.

## Triggers próxima sessão

- `audit bretda thank you wa` — verificar que ads ACTIVE pós-Meta-review estão entregando com forms novos
- `bretda form rollback` — reverter ads pros creatives antigos (`creative_id` original guardado nos JSONs)
- `bretda leads check {dias}` — checar volume de leads + cliques no botão WA do thank you screen

## Refs

- relates [[session_bretda_audit_07mai]] (Instant Form Trap discovery)
- relates [[session_bretda_full_day_15mai]] (8 ads ACTIVE structure)
- relates [[project_vorza_bm_ban_12mai]] (anti automation-flag context)
- não relacionado [[session_kr_v4_link_clicks_18mai]] (KR é wa.me em link_url ad-level; Bretda é wa.me no thank_you_page form-level — abordagens diferentes do mesmo objetivo)
