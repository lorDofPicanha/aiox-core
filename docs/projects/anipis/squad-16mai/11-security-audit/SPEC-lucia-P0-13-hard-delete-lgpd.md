# Spec LUCIA P0 #13 — LGPD Art. 18 Hard Delete Completeness

**Autora:** Lucia Savage (Health Privacy & Regulatory Strategy, ex-Omada, ex-ONC/HHS)
**Status:** Implementation-ready, handoff direto pra Orion
**Resolve:** Bruce audit SEC-08 HIGH (P0 #13)
**Referências:** LGPD Art. 16/18/19/41; Res. ANPD 4/2023; Res. ANPD 15/2024; CDC Art. 27; HIPAA §164.530(j) (parallel)

---

## 1. Verdict + Why

O `account-deletion-service.ts` atual cobre **10 das ~17 tabelas relevantes**. Ele é um **patchwork** — bom no que faz, silencioso no que não faz. Cinco buracos materiais sob Art. 18:

1. **`audit_events` retido com `userId` cru** — não pseudonimizado. Bruce está certo: isso é dado pessoal sob LGPD mesmo dentro do escopo Art. 16, II. A obrigação de comprovar cumprimento (Art. 16) não autoriza reter PII identificável quando pseudonimização preserva a mesma comprovação;
2. **`auth.users` (Supabase) nunca tocado** — comentário "should be handled via admin API" virou tombstone. Usuário pede exclusão, perfil some, mas o e-mail e o JWT continuam vivos no Supabase Auth. Isso é **deception by omission**;
3. **`journal_entries`, `granular_consents` (PII strip apenas em consents legado), `professional_patient_links`, `professional_ai_configs`, `pii_audit_log`, `dependency_tracking`** — não cobertos;
4. **Export (Art. 18 V — portabilidade)** não inclui `journal_entries`, `granular_consents`, `audit_events` resumidos, nem dados de relacionamento profissional;
5. **Subprocessadores US (OpenAI, Anthropic, Sentry)** — usuária não é avisada que o controlador não tem capacidade técnica de deletar lá.

**ANPD enforcement scenario realista:** Júlia denuncia. ANPD pede `verify_audit_chain()` + provas de exclusão. Founder mostra que `auth.users` reteve e-mail dela por 18 meses pós-pedido. Sanção Art. 52 — 2% faturamento, **R$ 50MM teto por infração**. Em uma startup B2C de saúde mental, a sanção é simbólica; o **dano reputacional é existencial**. *Honesty is non-negotiable. Once it's out there, it's pretty hard to get it back.*

---

## 2. Tabela: Anipis tables × Deletion treatment

| Table | Owns user PII? | Current | Required (Art. 18) | Legal basis se retain | Action item Orion |
|---|---|---|---|---|---|
| `profiles` | YES | HARD_DELETE (tx step 14) | HARD_DELETE | — | Manter; mover pra **último** dentro da tx |
| `conversations` | YES (summary, mood) | HARD_DELETE | HARD_DELETE | — | Manter |
| `messages` | YES (content) | HARD_DELETE | HARD_DELETE | — | Manter; ordem #1 ok |
| `mood_checkins` | YES | HARD_DELETE | HARD_DELETE | — | Manter |
| `crisis_events` | YES | HARD_DELETE | **PSEUDO (tombstone)** | Art. 16, II + Art. 11, II, "f" (proteção da vida — comprovação que sistema executou protocolo) | **MUDAR pra UPDATE → tombstoneId**, strip PII em `classifier_output.message_excerpt` se houver |
| `emergency_contacts` | YES (PII terceiro) | HARD_DELETE | HARD_DELETE | — | Manter; **emitir alerta no audit** que terceiro foi excluído sem notificação |
| `granular_consents` | YES (ip, ua) | **NÃO COBERTO** | PSEUDO (tombstone + strip PII) | Art. 16, II (comprovação consentimento) | **ADD step** análogo a `consents` |
| `consents` | YES (ip, ua) | PSEUDO (tombstone + strip ip/ua) ✓ | PSEUDO | Art. 16, II | Manter; **validar que `revoked_at` é setado** no momento da deletion |
| `nps_responses` | YES | HARD_DELETE | HARD_DELETE | — | Manter (cascade já existe — mas ser explícito) |
| `beta_feedback` | YES (msg, contact_email) | HARD_DELETE | HARD_DELETE | — | Manter |
| `assessment_results` | YES (responses PHQ-9/GAD-7) | HARD_DELETE | HARD_DELETE | — | Manter |
| `exercises` | YES (data jsonb) | HARD_DELETE | HARD_DELETE | — | Manter |
| `journal_entries` | YES (content RISCO MÁX) | **NÃO COBERTO** | HARD_DELETE | — | **ADD step** — risco crítico, é diário íntimo |
| `professional_patient_links` | YES (relação) | **NÃO COBERTO** | HARD_DELETE (linha do user) | — | **ADD step** — deletar onde `patientId = userId` |
| `professional_ai_configs` | YES (config p/ paciente) | **NÃO COBERTO** | HARD_DELETE | — | **ADD step** — cascade já existe via `link_id`, mas ser explícito |
| `dependency_tracking` | YES (métricas comportamentais) | **NÃO COBERTO** | HARD_DELETE | — | **ADD step** |
| `pii_audit_log` | NO (apenas tipo+contagem) | N/A | RETAIN 90d | Art. 16, II + design já anônimo | Documentar — **não tocar** |
| `audit_events` | YES (`user_id` cru) | **KEPT como está** | **PSEUDO (tombstone)** + manter hash chain | Art. 16, II (5 anos algorithmic liability) | **ADD step** UPDATE → tombstoneId; **NÃO recalcular hashes** (chain íntegra é maior valor); registrar evento de pseudonimização *como novo evento* na cadeia |
| `deletion_requests` | YES (userId) | HARD_DELETE | **PSEUDO (tombstone)** | Art. 16, II (provar que ciclo de exclusão executou) | **MUDAR de DELETE pra UPDATE** → tombstoneId; preservar timestamps + status |
| `knowledge_chunks`, `exercise_catalog`, `crisis_responses`, `beta_invites` | NO (sistema) | N/A | N/A | — | Documentar como sistema |
| **`auth.users` (Supabase)** | YES (e-mail, JWT, sessions) | **NÃO TOCADO** | HARD_DELETE via Supabase Admin API | — | **CRÍTICO — ADD step na route handler** com `supabase.auth.admin.deleteUser(userId)` |
| **Sentry events (US)** | E (metadados, PII filtrada) | N/A | DISCLOSE | Art. 16, II + impossibilidade técnica | Documentar em Privacy Policy: "Sentry retém 90d, sem PII bruta" |
| **OpenAI / Anthropic logs (US)** | B (mensagens stripped) | N/A | DISCLOSE + best-effort | Zero Data Retention contratual | Documentar: "Chamadas usam ZDR; subprocessador não retém. Sem capacidade técnica de purgar histórico do provider" |

---

## 3. Implementation Sequence (deletion saga)

```
Pre-flight:
  1. Acquire advisory_lock(userId) — evita race condition de double-deletion
  2. Snapshot do estado: SELECT COUNT(*) por tabela WHERE user_id = userId
  3. Compute tombstoneId determinístico (sha256(userId) → UUID v4-like) — JÁ EXISTE
  4. AUDIT EVENT: eventType='deletion_started' (entra no hash chain)

TX atômica (ordem FK-aware):
  5. DELETE messages
  6. DELETE journal_entries          ← NOVO
  7. DELETE conversations
  8. DELETE mood_checkins
  9. UPDATE crisis_events SET user_id=tombstone, classifier_output=jsonb_strip_pii(classifier_output)  ← MUDADO de DELETE
 10. DELETE emergency_contacts
 11. DELETE exercises
 12. DELETE assessment_results
 13. DELETE beta_feedback
 14. DELETE nps_responses
 15. DELETE dependency_tracking      ← NOVO
 16. DELETE professional_ai_configs WHERE patient_id=userId  ← NOVO
 17. DELETE professional_patient_links WHERE patient_id=userId  ← NOVO
 18. INSERT tombstone profile (idempotente, ON CONFLICT DO NOTHING) — JÁ EXISTE
 19. UPDATE consents SET user_id=tombstone, ip=NULL, ua=NULL, revoked_at=NOW() — JÁ EXISTE; ADD revoked_at
 20. UPDATE granular_consents SET user_id=tombstone, ip=NULL, ua=NULL, revoked_at=NOW()  ← NOVO
 21. UPDATE audit_events SET user_id=tombstone WHERE user_id=userId  ← NOVO (hash chain intocado)
 22. UPDATE deletion_requests SET user_id=tombstone  ← MUDADO de DELETE
 23. DELETE profiles WHERE id=userId

Post-TX (route handler, fora da DB tx):
 24. Supabase Admin: await supabase.auth.admin.deleteUser(userId)
       — em caso de falha: registra audit, marca deletion_request como 'failed_auth_cleanup',
         dispara retry job. Dado de aplicação já foi limpo; auth tem que cair em até 24h.
 25. Cache invalidation: Upstash Redis DEL keys matching userId pattern
 26. In-memory audit buffer (audit-trail.ts): force flush + scan-and-replace userId→tombstone
 27. AUDIT EVENT final: eventType='deletion_completed', context inclui
       sha256(snapshot pré-state) + tombstoneId + counts por tabela

Subprocessador disclosure (mostrar à usuária ANTES do duplo-clique de confirmação):
  "Seus dados nos sistemas Anipis serão excluídos em até 30 dias.
   Alguns parceiros nos EUA (OpenAI, Anthropic, Sentry) podem reter
   metadados ou logs por períodos contratuais que não controlamos.
   Nenhum desses parceiros tem acesso ao seu nome, e-mail ou identidade —
   apenas a conteúdos de mensagem com PII removida.
   Você pode consultar a Política de Privacidade § 7 para detalhes."
```

> *Lucia note:* "**Honesty is the best policy.** A usuária precisa ver essa caixa de texto **antes** de confirmar a exclusão — não enterrada na Privacy Policy. É a diferença entre transparência e teatro."

---

## 4. Export Completeness (Art. 18 II portabilidade)

`exportUserData()` deve incluir **todas** as tabelas que contêm PII da usuária, em JSON estruturado com chaves em pt-BR. Tabelas faltando hoje:

- `journal_entries` → `diario`
- `granular_consents` → `consentimentosGranulares`
- `professional_patient_links` (where patientId) → `vinculosProfissionais`
- `professional_ai_configs` (where patientId) → `configuracoesIaProfissional`
- `nps_responses` (já está? validar) → `respostasNps`
- `beta_feedback` → `feedbackBeta`
- `audit_events` (where user_id) → `historicoDecisoesIa` (resumido: eventType + decision + rationale + timestamp; SEM `prev_hash`/`current_hash` que são internos)
- `crisis_events` → `eventosDeCrise` (já está? validar)
- `dependency_tracking` → `padroesDeUso`

**Subprocessador flag:** export deve incluir bloco final:

```json
"avisoSubprocessadores": {
  "openai_anthropic": "Mensagens foram enviadas a estes parceiros nos EUA com PII removida antes do envio. Não temos acesso aos logs deles. Política Zero Data Retention contratada.",
  "supabase": "Toda a base está hospedada nos EUA. SCCs Res. ANPD 19/2024 assinadas.",
  "sentry": "Logs de erro retidos por 90 dias, sem conteúdo de mensagens."
}
```

Formato: **JSON único** (não CSV — preserva tipos/aninhamento). UTF-8, indentação 2 espaços, content-type `application/json`, download-as `meus-dados-anipis-{YYYY-MM-DD}.json`.

---

## 5. Edge Cases

| Cenário | Decisão |
|---|---|
| **Crisis_events RED em curso (resolved_at IS NULL nas últimas 72h)** | **BLOQUEAR** hard delete; ofertar contato com clinical advisor antes; soft anonimização imediata do `profiles` ok, mas hard delete só após `resolved_at` ou +7d. Justificativa LGPD Art. 11, II, "f" (proteção da vida) > Art. 18 prazo. **DPO sign-off requerido.** |
| **B2B2C — paciente vinculado a profissional ativo** | Notificar profissional **antes** (e-mail automatizado): "Paciente X solicitou exclusão. Vínculo será encerrado em 30d." Não propagar dados pra tenant admin — só notificar fim de vínculo. |
| **Backup Supabase PITR (7d)** | Aceitar gap de 7 dias. **Documentar em Privacy Policy:** "Dados podem permanecer em backups de recuperação por até 7 dias após a exclusão completa, sem acesso operacional." |
| **Cache Redis Upstash + audit buffer in-memory** | Flush forçado no step 25-26. Audit buffer deve scan-and-replace userId→tombstone (não apenas flush — alguns eventos podem estar no buffer ainda referenciando o user). |
| **Re-tentativa idempotente (cron re-roda em registro já 'failed')** | `executeHardDelete()` é idempotente — checa `if (!profileRow[0]) return`. Validar que UPDATE de audit_events e UPDATE de granular_consents também são idempotentes (WHERE user_id = userId, se já é tombstone, no-op). |
| **Pedido de Art. 18 mas usuária tem dívida B2B futura** | N/A no Beta — sem cobrança. Pós-monetização: doc separado, NÃO pode bloquear Art. 18. |

---

## 6. SLA + Audit Trail

| Item | Spec |
|---|---|
| LGPD Art. 19 — prazo resposta | 15 dias úteis |
| Anipis target | ≤7 dias úteis (compromisso na Privacy Policy) |
| Grace period (soft → hard) | 30 dias corridos — já implementado |
| Audit events obrigatórios | `deletion_requested`, `deletion_anonymized` (soft), `deletion_restored` (cancel), `deletion_hard_started`, `deletion_hard_completed` OR `deletion_hard_failed`, `auth_user_purged` |
| DPO sign-off obrigatório | Quando user tem `crisis_events` nos últimos 90d **OU** account ≥ 12 meses **OU** vínculo profissional ativo. Sign-off = audit event com `decision='dpo_approved_deletion'` + `confidence=1.0` |
| Hash chain | Cada audit event continua na chain. Pseudonimização do `user_id` em `audit_events` **NÃO** recalcula `current_hash` — preserva integridade. Spec: documentar em comentário SQL que tombstone é semanticamente equivalente pro hash. |

---

## 7. Test Suite Priorities (Vitest)

**Core (6):**
1. `executeHardDelete_removes_all_PII_tables` — assert COUNT=0 em 13 tabelas pós-execução
2. `executeHardDelete_pseudonymizes_audit_tables` — assert `user_id=tombstone` em audit_events, consents, granular_consents, crisis_events, deletion_requests
3. `executeHardDelete_idempotent_rerun` — chama 2x, segunda é no-op, sem exception
4. `executeHardDelete_preserves_audit_hash_chain` — `verify_audit_chain()` retorna verified=true pós-deletion
5. `exportUserData_includes_all_PII_tables_with_pt_br_keys` — schema validation no JSON
6. `processPendingDeletions_marks_failed_on_exception` — mock falha em step 9, assert `status='failed'`

**Edge (3):**
7. `executeHardDelete_blocks_when_crisis_red_unresolved_recent` — throw `CrisisOngoingError`
8. `executeHardDelete_b2b2c_notifies_professional` — assert e-mail mock chamado
9. `executeHardDelete_handles_partial_redis_failure` — Redis down, DB tx ok, marca `cache_purge_pending`

**Negative (2):**
10. `executeHardDelete_nonexistent_user_noop` — sem throw
11. `requestDeletion_idempotent_double_call` — retorna mesma `scheduledDeletionAt`

---

## 8. Orion Action Items (Implementation Checklist)

1. **`src/db/schema.ts`** — adicionar `revokedAt` opcional em `consents` se ainda não tem (validar). DoD: tipo TypeScript reflete.
2. **`src/services/account-deletion-service.ts`** — adicionar imports: `journalEntries`, `granularConsents`, `dependencyTracking`, `professionalPatientLinks`, `professionalAiConfigs`, `auditEvents`. DoD: TS compila.
3. **`src/services/account-deletion-service.ts:executeHardDelete()`** — inserir steps 6 (journal), 15 (dependency), 16 (ai_configs), 17 (links), 20 (granular_consents), 21 (audit_events UPDATE), modificar 9 (crisis_events PSEUDO), 22 (deletion_requests PSEUDO). DoD: testes 1-4 passam.
4. **`src/services/account-deletion-service.ts`** — adicionar pre-flight `advisory_lock` via `SELECT pg_advisory_xact_lock(hashtext($1))`. DoD: race condition test passa.
5. **`src/services/account-deletion-service.ts:exportUserData()`** — adicionar queries pra `journal_entries`, `granular_consents`, `audit_events` (resumido), `dependency_tracking`, `professional_patient_links`, `professional_ai_configs`. DoD: test 5 passa.
6. **`src/services/account-deletion-service.ts:exportUserData()`** — adicionar bloco `avisoSubprocessadores` no return. DoD: schema validation passa.
7. **`src/services/crisis-deletion-guard.ts`** (NOVO) — função `assertSafeToDelete(userId): Promise<void>` que checa crisis_events RED unresolved <72h. DoD: test 7 passa.
8. **`src/routes/v1/me-account.ts`** (ou equivalente) — adicionar chamada `supabase.auth.admin.deleteUser(userId)` pós-`executeHardDelete()`. DoD: integração local com Supabase test instance.
9. **`src/routes/v1/me-account.ts`** — adicionar bloco confirmation UI returning subprocessor disclosure text na resposta de `requestDeletion`. DoD: response JSON inclui campo `aviso`.
10. **`src/services/audit-trail.ts`** — adicionar `scanAndReplaceUserId(oldId, newId)` no in-memory buffer. DoD: test cobre buffer pós-deletion.
11. **`src/services/cache-purge.ts`** (NOVO) — função `purgeUserCache(userId)` deletando keys Redis com pattern `*:${userId}:*` e `${userId}:*`. DoD: integration test com Upstash mock.
12. **`src/services/notification-service.ts`** — método `notifyProfessionalOfPatientDeletion(linkId)`. DoD: test 8 passa.
13. **`src/db/migrations/`** (nova migration) — comentário SQL em `audit_events` explicando semântica do tombstone preservando hash chain. DoD: migration aplicada.
14. **`src/services/account-deletion-service.ts`** — adicionar emissão de 5 audit events (requested, started, completed/failed, auth_purged, dpo_signoff se aplicável). DoD: query `SELECT eventType FROM audit_events WHERE context->>'deletion_id'=...` retorna 5 rows.
15. **`tests/services/account-deletion-service.test.ts`** — implementar 11 testes da Seção 7. DoD: `npm test -- account-deletion` 11/11 verde.
16. **`docs/privacy-policy.md`** — atualizar §7 (direitos do titular) e §9 (subprocessadores) refletindo disclosure de Sentry/OpenAI/Anthropic + backup PITR 7d. DoD: Lucia review checklist.
17. **`docs/projects/anipis/squad-16mai/11-security-audit/runbook-art18-deletion.md`** (NOVO) — runbook operacional pra DPO em caso de pedido manual. DoD: 1 página, lista todas as 17 tabelas.
18. **CI/CD** — adicionar gate "Art. 18 completeness check" que roda script comparando `Object.keys(schema)` contra lista de tabelas tratadas em `account-deletion-service.ts`. Falha CI se nova tabela for adicionada sem entrar na deletion saga. DoD: PR de exemplo dispara o gate.
19. **`src/services/account-deletion-service.ts`** — JSDoc do método explicitando que isso é spec Lucia P0 #13 + link pra este arquivo. DoD: comentário presente.
20. **Smoke test manual pré-Beta (30/Mai)** — criar usuária fake, popular as 17 tabelas, executar full flow `requestDeletion → forçar cron → executeHardDelete → validar`. DoD: relatório markdown em `docs/projects/anipis/squad-16mai/11-security-audit/smoke-test-art18-result.md`.

---

> **Encerramento:** Anipis está construindo no regime boundary mais delicado que existe — dados sensíveis de saúde mental atravessando fronteiras de soberania com IA conversacional. *I've never not found an answer about how to do this right.* A spec acima é como faço — não é teoria, é o que eu defenderia em uma sala com a ANPD ou com um clinical ethics committee. Fechem esses 20 itens, e o P0 #13 fica defensável. **Honesty is non-negotiable. Once it's out there, it's pretty hard to get it back.**
>
> — Lucia, navigating the regulatory landscape with pragmatic confidence ⚖️
