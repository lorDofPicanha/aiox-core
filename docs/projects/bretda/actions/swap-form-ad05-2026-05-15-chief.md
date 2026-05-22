# Bretda — Lead Form Swap AD05+AD04 — 2026-05-15 — Chief + Kusmich

> **Op:** swap `lead_gen_form_id` em 2 ads ACTIVE de CJ8v2 do form atual (sem budget question + Thank You site) para form `25022395347422134` (com budget question + Thank You WhatsApp). Mission ratificada user 15/Mai. Chief orquestrou, persona Nicholas Kusmich (lead gen Tier 1) lente. Saga executada via Graph API direta (mesma token validada na drill 30min antes). PAUSED-first. Smoke test pendente user-side.

---

## TL;DR

✅ **SAGA COMPLETE.** 2 ads criados PAUSED com form qualificador (5 perguntas incl. budget + Thank You WhatsApp). Verificação server-side confirmou form_id correto nos dois. Rollback não acionado. Restou: **(1) smoke test user 60s** → **(2) Chief routes PAUSE originais + ENABLE v2 sequencial** anti-spam. ETA total user: ~5min. ETA total Chief execução pós-aprovação: ~30s.

| Métrica | Valor |
|---|---|
| Ads criados | 2 (AD05-v2 + AD04-v2) |
| Status criação | PAUSED ✅ |
| Form id verificado match | 2/2 ✅ |
| Gate 7 destination_type | PASS (Instant Form → Instant Form, mesmo ON_AD, sem subcode 1892040) |
| Gate 6 Lead Quality | PASS (5 qualifiers no form alvo) |
| Tempo total saga | 16,4 segundos (15:07:37Z → 15:07:53Z) |
| Idempotency keys | 2 UUID v4 únicos, gravados |
| Rollback steps prep | declarado e armado (não acionado) |

---

## 1. Operation summary

### Alvo

| Ad legado | Novo ad (PAUSED) | Form antigo | Form novo |
|---|---|---|---|
| AD05 `120244164995160737` | **AD05-v2 `120246293646000737`** | `1795323604460936` (Thank You site, sem budget) | `25022395347422134` (Thank You WhatsApp + budget) |
| AD04 `120244164992490737` | **AD04-v2 `120246293653980737`** | `1373886644143591` (Thank You site, sem budget) | `25022395347422134` (idem) |
| AD03 (não tocado) | — | já usa `25022395347422134` ✅ | — |

### Account context

- act_id: `act_381618241134624`
- Campaign: `120236735188220737` (CP2)
- Adset: `120237168468370737` (CJ8v2 — Sudeste+Sul R$60/d)
- Page: `249440611589045` (bretda.com.br)
- Pixel CANON: `3348133485496539` ✅

### Saga timeline

```
2026-05-15T15:07:37.157Z  Step A start: AD05-v2 idempotency 855b7791…768d
2026-05-15T15:07:37.???Z  CREATE response 120246293646000737
2026-05-15T15:07:??.???Z  VERIFY form_id=25022395347422134 status=PAUSED  ✅
2026-05-15T15:07:45.439Z  Step B start: AD04-v2 idempotency 9ab4345b…b97d
2026-05-15T15:07:??.???Z  CREATE response 120246293653980737
2026-05-15T15:07:53.558Z  VERIFY form_id=25022395347422134 status=PAUSED  ✅
                          SAGA COMPLETE
```

Action log persistido: `D:\jarvis\mcp-ads-bridge\data\bretda-15mai-swap-form-saga.json` (full trail com idempotency keys + verify outputs).

---

## 2. Pre-flight findings (correção crítica do payload)

A spec da mission referenciava `object_story_spec.link_data.lead_gen_form_id`. **A API real para os ads AD05/AD04 da Bretda usa `object_story_spec.video_data.call_to_action.value.lead_gen_form_id`** (ambos os ads são `object_type=VIDEO`, não link_data). Spec ajustada na execução. Sem correção, o create_ad falharia silenciosamente (lead_gen_form_id não aparece em link_data quando o ad é video).

Outros findings de reconhecimento:

| Field | AD05 source | AD04 source | Decisão |
|---|---|---|---|
| video_id | 1530798794307957 | 732152653304403 | Preservado por ad |
| image_hash | 44b234942178a02b560cd427bd970891 | 842707ff642ac0c5bc367c378002b11a | Preservado por ad |
| CTA type | LEARN_MORE | GET_QUOTE | Preservado por ad |
| Link cosmético | `https://bretda.com.br/` | `http://fb.me/` | Preservado por ad |
| url_tags (UTM) | (none) | `utm_source=...&utm_content={{ad.name}` (sic typo trailing `}` missing) | Preservado exato com typo p/ paridade até user decidir corrigir |
| Page + IG | `249440611589045` + `17841465690590299` | idem | Preservado |
| Title + body + message | "Solicite seu orçamento!" + copy idêntica entre os 2 | idem | Preservado verbatim |
| degrees_of_freedom_spec (Advantage+) | OPT_IN vs OPT_OUT divergente | divergente | **Não replicado nos clones** — Meta defaults vão decidir. Não-bloqueador. Se precisar paridade exata, ação follow-up. |

### Target form 25022395347422134 — validação completa

- Status: ACTIVE ✅
- 5 qualifiers + 3 PII:
  1. Qual mesa? (Bilhar / Pebolim / Tênis de Mesa / Shuffleboard)
  2. Ambiente pronto ou em projeto com arquiteto?
  3. Já adquiriu/pesquisou mesas alto padrão antes?
  4. Orçamento p/ uso pessoal / arquiteto / condomínio?
  5. **Budget question:** Até R$20k / Até R$30k / Acima R$30k
  6. First name (PII)
  7. Phone (PII)
  8. Email (PII)
- Thank You page: `button_type=WHATSAPP` ✅ ("Conversar no WhatsApp")
- leads_count atual: 4 (vai subir após ENABLE dos v2)

---

## 3. Gates executados (Kusmich Section 5 + Chief Section 5)

| Gate | Status | Detalhe |
|---|---|---|
| **Gate 1** — Pre-write triple-gate | ✅ PASS | Sem mudança de budget. PAUSED-first hardcoded. Action log persistido em JSON. |
| **Gate 2** — Idempotency UUID v4 | ✅ PASS | Step A `855b7791-69d9-4b8e-82d8-d1f5db55768d` / Step B `9ab4345b-9b77-41bc-84f6-b6299af1b97d` — únicos, gerados via `crypto.randomUUID()`, persistidos no action log. |
| **Gate 3** — Saga rollback | ✅ ARMED, NÃO ACIONADO | Compensating action declarada antes de cada step (`DELETE /{created_id}` em ordem reversa). Step A success → Step B success → rollback dormente. |
| **Gate 4** — Account context loaded | ✅ PASS | `bretda.md` playbook + audit 2026-05-15 + drill Meta Leads 2026-05-15 + memória `feedback_meta_destination_type_validation` carregados antes do write. |
| **Gate 5** — Budget circuit breaker | N/A | Operação não altera budget. Daily R$60/d CJ8v2 permanece intocado. |
| **Gate 6** (Kusmich) — Lead Quality | ✅ PASS | Form alvo tem **5 qualifier questions** (target 3-5 para AOV >R$3k). Budget question presente. Não viola "Lead form sem qualifier" failure mode. |
| **Gate 7** (Kusmich) — destination_type validation | ✅ PASS | Source AD05/AD04 ambos `destination_type=ON_AD` (Instant Form). Target form é Instant Form. Operação é Instant Form → Instant Form **com qualifier melhor**, sem cross-destination. Sem risco de subcode 1892040. |

---

## 4. USER ACTION REQUIRED

### USER ACTION 1 — Smoke test do form alvo (ETA 60-120s)

> **Por quê:** Kusmich Section 6 #4 + memória `feedback_meta_ctm_waba_wrong_number` exigem smoke manual antes de declarar lead form "funcional" — KR 99 conversas/R$437 viraram void em 12d por WhatsApp errado configurado pelo gestor antigo. Não repetimos esse erro. **AD03 já roda esse form com 4 leads históricos** → baixa probabilidade de void, mas o gate é não-negociável.

**Como executar:**

1. Abrir preview do form alvo no Meta Ads Manager:
   - Direct URL: `https://www.facebook.com/leadgen/api_preview/?id=25022395347422134`
   - OU navegar: Ads Manager → conta `act_381618241134624` → menu hambúrguer → "Formulários instantâneos" → form `CP2 - Arquiteto/Designer + Intt luxo-copy`
2. Preencher como lead fake:
   - Mesa: Bilhar
   - Ambiente: Em projeto com arquiteto
   - Já pesquisou: Sim
   - Orçamento: Uso pessoal
   - **Budget: Acima de R$30.000 se fizer sentido**
   - Nome: TESTE BRENO 15-MAI
   - Phone: seu celular real
   - Email: brenodecerqueira@gmail.com
3. Submeter
4. **Validar no Thank You page:**
   - [ ] Aparece botão **"Conversar no WhatsApp"**?
   - [ ] Clicando, abre `wa.me/55...` com número da Bretda (não Vorza/gestor antigo)?
   - [ ] Mensagem pré-preenchida (se houver) faz sentido?
5. **Validar fora do form:**
   - [ ] Em <1min, o lead apareceu em Leads Center? Direct: `https://business.facebook.com/leads_center/?page_id=249440611589045&form_id=25022395347422134`
6. **Validar follow-up real:**
   - [ ] Notification Meta chegou em algum email que VOCÊ acessa? (Se não → P0 separado da drill — "Page notification email dormido")

**Resultado esperado:** 6/6 ✅ → pode ir para USER ACTION 2.
**Resultado red flag:** botão WhatsApp aponta para número errado (KR-style F5) → **NÃO ENABLE v2**, abrir ticket pedro-sobral/chief para validar wa.me da Page primeiro.

### USER ACTION 2 — Aprovar sequência ENABLE (chief executa, anti-spam)

Após smoke pass, responder no chat com **"go ENABLE v2 bretda"** (ou equivalente). Chief então executa em ordem sequencial (per `feedback_meta_api_anti_spam` — não disparar em paralelo em conta fresh):

```
1. PAUSE AD05 (120244164995160737)     — espera 3-5s
2. PAUSE AD04 (120244164992490737)     — espera 3-5s
3. ENABLE AD05-v2 (120246293646000737) — espera 3-5s
4. ENABLE AD04-v2 (120246293653980737) — fim
```

ETA execução: ~20-30s. Cada passo logado em action snapshot JSON com idempotency UUID próprio. Smoke test do form alvo (USER ACTION 1) é pré-req para esta sequência.

### USER ACTION 3 — Opcional: corrigir typo do url_tags AD04-v2

O AD04 original tinha `url_tags=...&utm_content={{ad.name}` (sic — falta `}` final). Foi preservado idêntico no v2 para paridade. Se quiser corrigir agora (recomendado, mas não-bloqueador), pedir "fix url_tags AD04-v2 bretda" — Chief routes 1 update_creative call. Sem fix: UTM `ad.name` quebra parcial em alguns destinos analytics.

---

## 5. D+1 review schedule (16/Mai 09:00 BRT)

Quando user comandar `audit bretda d+1` ou Chief auto-dispatcha:

| Métrica | Threshold | Ação se ultrapassar |
|---|---|---|
| CPL AD05-v2 vs AD05 baseline (R$22 média 7d pré-swap) | <+50% (i.e. até R$33) | OK — manter |
| CPL AD05-v2 spike | >+50% | Pausar AD05-v2, reabrir AD05, postmortem |
| Lead com budget acima R$30k / total leads | tracking ratio | Sinaliza qualificação 3-5x melhor (KPI Kusmich) |
| Show-up rate (Breno reporta) | >40% | Decisão **HOLD Plano B 14/Mai** sustentada (form WhatsApp basta) |
| Show-up rate | <40% | Acelera Plano B (LP form de verdade) — escala @aios-dev |
| AD04-v2 spend share | <10% adset spend ou =0 | Esperado (AD04 historicamente moribundo); aceitável |

---

## 6. Tool gaps encontrados (Sprint 2 backlog)

Per Kusmich Section 4 — flagrar tool gaps para @aios-dev / @devops:

1. `meta_ads_lead_form_inspect` — encapsular `GET /{form-id}` com fields essenciais (`questions`, `thank_you_page`, `leads_count`). Hoje usamos Graph direto.
2. `meta_ads_lead_form_swap_on_ad` — wrapper conveniência: dado `{ad_id, new_form_id}`, clona o creative ad-side com form_id substituído e retorna `{new_ad_id, status: PAUSED}`. Esconde o detalhe `video_data` vs `link_data` que pegou no pre-flight.
3. `meta_ads_action_log_persist` — persistir action log em disco (`data/action-log.json`) automaticamente, não só em memória. Hoje fizemos snapshot manual em JSON file por saga.

Nenhum desses foi **bloqueador** desta op — todos foram resolvidos via Graph API direta + script saga manual. Mas anotar para sprint MCP.

---

## 7. Não foi usada Route B (fallback UI manual)

A spec listava Route B fallback "se MCP tool não conseguir override `lead_gen_form_id` na criação". **Route A funcionou clean** — `meta_ads_create_ad` (na implementação real `metaPost /{account}/ads`) aceita `creative` como `Record<string, unknown>` que é JSON-stringified intacto. Override de `lead_gen_form_id` no `video_data.call_to_action.value` foi 100% honored pela API. Route B não necessário.

---

## 8. Memory + Insights

### Memory queued

- `session_bretda_swap_form_ad05_ad04_2026-05-15.md` (este op + lições)
- Lição técnica nova:
  - Confirmação que `meta_ads_create_ad` MCP-bridge aceita `creative` payload arbitrário JSON-stringificado → posso override **qualquer field** dentro do creative (lead_gen_form_id, call_to_action.value, video_data.title, etc) sem precisar tool especializado.
  - Para ads `object_type=VIDEO`, lead_gen_form_id mora em `video_data.call_to_action.value.lead_gen_form_id` (NÃO em `link_data`). Documentar como anchor para próximas migrações.
- Padrão confirmado: F-Meta-LEAD-VOID **mitigação** sem `Page subscribed_apps` webhook nem Sales AI fork. Apenas swap de form com Thank You button_type=WHATSAPP. Hipótese a medir em D+7 19/Mai.

### Insight publish queued

```json
{
  "project": "bretda",
  "insights": [{
    "type": "decision",
    "severity": "high",
    "summary": "Swap lead_gen_form_id AD05+AD04 → 25022395347422134 executado 15/Mai. Saga 2 creates PAUSED via Graph API direta. Gate 7 cross-destination skipped (ON_AD→ON_AD). Aguarda smoke test user para sequência PAUSE/ENABLE.",
    "context": "F-Meta-LEAD-VOID mitigation Phase 1 (form swap, sem webhook code). Phase 2 webhook + Sales AI Bretda fork deferred para pós D+7 19/Mai gate. Hipótese: form com budget question + Thank You WhatsApp resolve 60% do void sem código novo."
  }]
}
```

---

## 9. Cross-references

- Drill source: `D:\AIOS\docs\projects\bretda\audits\drill-meta-leads-2026-05-15-chief.md`
- Audit base: `D:\AIOS\docs\projects\bretda\audits\audit-2026-05-15-chief.md`
- Action log saga: `D:\jarvis\mcp-ads-bridge\data\bretda-15mai-swap-form-saga.json`
- Playbook: `D:\AIOS\squads\marketing-traffic\data\account-playbooks\bretda.md`
- Kusmich persona: `D:\AIOS\squads\marketing-traffic\agents\nicholas-kusmich.md`
- Anchor memórias: `feedback_meta_destination_type_validation`, `session_bretda_instant_form_trap_07mai`, `feedback_meta_ctm_waba_wrong_number`, `session_kr_whatsapp_void_12mai`

---

*Give Before Ask. Attention is the new currency. Cost Per Show-Up over CPL. Mesa real intocável. Brand Defense ENABLED. AD05-v2 + AD04-v2 PAUSED — bola está com Breno: smoke test + go ENABLE.*
