# Runbook DPO — LGPD Art. 18 Manual Deletion

**P0 #14 (Lucia §8 item 17)** — Operacional para DPO interim Anipis.
**Audiência:** DPO / Founder agindo como DPO / Clinical advisor responsável por compliance LGPD.
**Quando usar:** quando o fluxo automático (`POST /account/process-deletions` cron) não é suficiente — pedido ANPD, crisis block prolongado, falha repetida, vendor cooperation request.

---

## 1. Visão geral do fluxo automático (pra entender quando ele falha)

```
Usuária clica "Excluir conta" no app
    ↓
DELETE /account → requestDeletion()
    ↓
  ├─ deletion_requested (audit)
  ├─ Profile soft-anonymized (displayName=anon_XYZ, bioData={}, deletedAt=NOW)
  ├─ deletion_requests row criada (status='anonymized', scheduledDeletionAt=+30d)
  └─ deletion_anonymized (audit)
    ↓
[Aguarda 30 dias — usuária pode cancelar via POST /account/restore]
    ↓
Cron diário: POST /account/process-deletions
    ↓
processPendingDeletions() itera rows com scheduledDeletionAt < NOW
    ↓
    ├─ assertSafeToDelete() — crisis guard (Art. 11,II,"f")
    │    Se RED unresolved <72h → CrisisOngoingError → SKIP (não marca failed,
    │    deixa em 'anonymized' pra próximo cron)
    │
    ├─ executeHardDelete()
    │    ├─ deletion_hard_started (audit)
    │    ├─ DB TX: 13 HARD DELETE + 5 PSEUDO + advisory_lock
    │    ├─ scanAndReplaceUserId(buffer) — rewrites pending audit events
    │    └─ deletion_hard_completed (audit com tombstoneId)
    │
    ├─ UPDATE deletion_requests SET status='completed'
    │
    └─ postDeleteHook(userId)
         ├─ purgeUserCache() — Upstash Redis (7 patterns)
         ├─ supabase.auth.admin.deleteUser() — auth.users purge
         └─ auth_user_purged (audit)
```

---

## 2. Quando intervir manualmente

| Sinal | Causa provável | Ação |
|---|---|---|
| `errors[]` no cron response menciona `postDeleteHook` repetidamente | Supabase/Upstash API down ou rate-limited | §3 — re-trigger cron após cooldown; se persistir 24h, §5 manual auth purge |
| Usuária em `status='anonymized'` há > 35 dias sem ir pra `completed` | Crisis guard travando OU cron parado | §4 — investigar crisis block; OU §6 verificar cron |
| ANPD ou OAB pediu prova de deleção concluída | Auditoria externa | §7 |
| Vendor (Supabase/Anthropic/OpenAI) pediu purge manual de dados de subprocessor | Cooperation request | §8 |
| Smoke test pré-Beta falhou | Bug de regressão | §9 |
| Falha repetida `status='failed'` | Bug de código ou dado corrupto | §10 |

---

## 3. Re-trigger cron manual

```bash
curl -X POST https://api.anipis.com.br/account/process-deletions \
  -H "X-Internal-Auth: $INTERNAL_API_KEY" \
  -H "Content-Type: application/json"
```

Resposta:
```json
{
  "processed": 3,
  "errors": [],
  "processedAt": "2026-05-30T03:00:00.000Z"
}
```

`errors[]` não-vazio: copiar pra ticket. Se mencionar `postDeleteHook user=X`: §5.

---

## 4. Investigar crisis block

```sql
SELECT id, user_id, risk_level, resolved_at, created_at,
       AGE(NOW(), created_at) AS age
FROM crisis_events
WHERE user_id = $1::uuid
  AND risk_level = 'red'
  AND resolved_at IS NULL
ORDER BY created_at DESC;
```

Se houver row:
- **age < 72h:** guard correto. Esperar resolved_at ser preenchido OU 72h passarem.
- **age ≥ 72h:** o cron já deveria ter pegado. Investigar: o crisis_event tem mesmo userId? Há cron rodando? §6.
- **resolved_at IS NULL E age > 7d (Lucia spec edge case):** DPO sign-off pode forçar resolved_at via:
  ```sql
  UPDATE crisis_events
  SET resolved_at = NOW(), resolved_by = 'dpo_override'
  WHERE id = $1::uuid;
  ```
  **Emitir audit event manualmente:**
  ```sql
  INSERT INTO audit_events (id, timestamp, event_type, user_id, decision, rationale, ...)
  VALUES (gen_random_uuid(), NOW(), 'dpo_approved_deletion', $userId,
          'DPO override: crisis_event N resolved_at forced',
          'Risk has been clinically assessed offline; deletion proceeds per Art. 18 + Art. 11 balancing', ...);
  ```

---

## 5. Manual Supabase auth purge

Quando `auth.users` ficou pra trás (postDeleteHook falhou repetidamente, profile já deletado do PG):

```javascript
// One-off node script com SERVICE_ROLE_KEY
import { createClient } from '@supabase/supabase-js'
const admin = createClient(URL, SERVICE_ROLE_KEY)
const { error } = await admin.auth.admin.deleteUser('USER_UUID_HERE')
if (error) throw error
console.log('auth.users row removed')
```

Audit manual:
```sql
INSERT INTO audit_events (...)
VALUES (..., 'auth_user_purged', 'DPO manual purge', ...);
```

---

## 6. Verificar saúde do cron

```bash
# Se Vercel: vercel cron list
# Se Railway: check schedule on dashboard
# Se interno: ver logs do serviço que dispara POST /account/process-deletions
```

Validar:
- Endpoint responde 200
- INTERNAL_API_KEY válida (rotacionada nos últimos 90 dias)
- Última execução < 25h

---

## 7. Prova pra ANPD/OAB

```sql
-- 1. Comprovar deleção completada
SELECT id, user_id, status, scheduled_deletion_at, completed_at
FROM deletion_requests
WHERE id = $request_id::uuid;
-- ↑ status='completed', completed_at preenchido, user_id já é tombstone

-- 2. Verificar 0 PII residual nas 13 tabelas hard-delete
SELECT 'messages' AS tbl, COUNT(*) FROM messages WHERE user_id = $original_user_id
UNION ALL SELECT 'journal_entries', COUNT(*) FROM journal_entries WHERE user_id = $original_user_id
-- ... (rep. pra todas 13)
-- ↑ todos devem ser 0

-- 3. Verificar tombstone nas 5 tabelas pseudo
SELECT 'consents' AS tbl, COUNT(*) AS rows_with_original_id
FROM consents WHERE user_id = $original_user_id;
-- ↑ deve ser 0 (movido para tombstoneId = sha256(original_user_id))

-- 4. Hash chain íntegra
SELECT * FROM verify_audit_chain();
-- ↑ verified=true

-- 5. Audit trail de lifecycle
SELECT timestamp, event_type, decision, rationale
FROM audit_events
WHERE user_id IN ($original_user_id::uuid, $tombstoneId::uuid)
ORDER BY timestamp ASC;
-- ↑ deve mostrar: deletion_requested → deletion_anonymized → deletion_hard_started
--   → deletion_hard_completed (tombstone) → auth_user_purged
```

Exportar resultado dessas queries em PDF/HTML como prova. Anexar à resposta ANPD.

---

## 8. Vendor cooperation request (subprocessor)

Se OpenAI/Anthropic/Sentry/Supabase/Upstash/Langfuse pedirem purge específico:

1. Verificar email do solicitante (anti-phishing). Vendor support deve usar domínio oficial.
2. Confirmar via canal alternativo (chat do dashboard, não responder ao email diretamente).
3. Coletar referência interna do ticket no vendor.
4. Executar purge no lado Anipis (geralmente nada — vendor faz internamente).
5. Audit:
   ```sql
   INSERT INTO audit_events (..., event_type='vendor_cooperation_purge', ...,
     decision='Purge confirmado por <vendor>', rationale='Ticket #XYZ');
   ```
6. Atualizar `docs/projects/anipis/squad-16mai/12-compliance/SCCs-ANPD-19-2024-checklist.md` com entry no histórico.

---

## 9. Smoke test pré-Beta (30/Mai)

```bash
# 1. Criar usuária fake com email descartável (mailinator.com)
# 2. Popular 17 tabelas via API normal: register, consent, mood checkin,
#    1 conversation, 1 journal entry, 1 emergency contact, 1 exercise
# 3. (Opcional) trigger 1 crisis_event resolved=true
# 4. POST /account/export — salvar JSON
# 5. DELETE /account — checar resposta 202 inclui `aviso`
# 6. Force scheduledDeletionAt = NOW (manual UPDATE no DB)
# 7. POST /account/process-deletions — checar processed=1, errors=[]
# 8. Verificar §7 queries (todos 0 / tombstoneados)
# 9. Tentar login com a usuária fake — deve falhar (auth.users purged)
# 10. Salvar log de cada step em smoke-test-art18-result.md
```

Smoke test PASS = greenlight pra Closed Beta launch.
Smoke test FAIL = NÃO launch. Bug fix + re-run.

---

## 10. Falha repetida `status='failed'`

```sql
SELECT id, user_id, status, scheduled_deletion_at
FROM deletion_requests
WHERE status = 'failed';
```

Para cada row:
1. Verificar logs do cron run que falhou — qual exception?
2. Se erro transitório (rede, lock): reset status:
   ```sql
   UPDATE deletion_requests SET status='anonymized' WHERE id = $id::uuid;
   ```
   Próximo cron tenta de novo.
3. Se erro de schema/código (FK violation, constraint): NÃO mascarar — escalar bug pra dev team. Anipis NÃO pode silenciar falhas de deletion (responsabilidade Art. 18).
4. Sempre audit:
   ```sql
   INSERT INTO audit_events (..., event_type='deletion_retry_initiated', ...);
   ```

---

## 11. Contatos de escalação

| Situação | Quem | Canal |
|---|---|---|
| Bug bloqueante deletion | Engineering Lead | Slack #anipis-eng |
| Pedido ANPD | Founder + advogado OAB (Patricia Peck preferred) | Email + WhatsApp |
| Vendor cooperation | Founder | Email vendor support |
| Decisão clínica (crisis override) | Clinical advisor (CRP) | WhatsApp |
| Emergency (usuária em crise iminente bloqueando deletion) | Clinical advisor + Founder | Phone — SLA 1h |

---

## 12. Histórico de execuções manuais

| Data | Quem | Caso | Resultado | Audit row ID |
|---|---|---|---|---|
| (a preencher na primeira execução manual) | | | | |

---

**Última revisão:** 17/Mai/2026 (criação inicial — Lucia spec §8 item 17 closure)
**Próxima revisão:** após 1ª execução manual OU 30/Jun/2026, o que vier primeiro
**Owner:** DPO interim Anipis
