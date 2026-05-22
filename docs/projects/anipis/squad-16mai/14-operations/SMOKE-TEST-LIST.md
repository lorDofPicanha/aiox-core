# Anipis — Smoke Test List (Production Endpoints)

**Data:** 2026-05-18
**Auditor:** Orion (aios-master) coordenando @chris-sanders + @georgia-weidman
**Escopo:** Lista executável de smoke tests para validar API + Web em qualquer deploy (staging + prod)
**Pré-requisito:** Setup `TEST_TOKEN` (JWT válido de test user) + `INTERNAL_API_KEY` + `BASE_URL`

---

## Setup variáveis

```bash
export BASE_URL="https://api.anipis.com.br"  # ou staging URL
export TEST_TOKEN="eyJhbGc..."                # JWT Supabase de test user
export INTERNAL_KEY="sk_internal_..."          # INTERNAL_API_KEY do env
export TEST_USER_ID="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
export TEST_CRISIS_EVENT_ID="..."              # criar via fluxo de teste
```

**Sucesso esperado para CADA smoke:** HTTP 2xx OU expected 4xx, JSON parseable, **sem PII em logs**.

---

## Tier 0 — Liveness (1 teste, <1s)

```bash
# Smoke 0.1 — health check
curl -sS -o /dev/null -w "%{http_code}\n" "$BASE_URL/health"
# Expected: 200
```

---

## Tier 1 — Auth + identity (3 testes)

```bash
# Smoke 1.1 — protected route sem auth → 401
curl -sS -w "\nstatus:%{http_code}\n" "$BASE_URL/chat/conversations"
# Expected: 401 "Unauthorized"

# Smoke 1.2 — protected route com auth → 200
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/chat/conversations" | jq '.'
# Expected: 200, JSON array

# Smoke 1.3 — JWT malformado → 401
curl -sS -w "\nstatus:%{http_code}\n" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  "$BASE_URL/chat/conversations"
# Expected: 401
```

---

## Tier 2 — Onboarding flow (4 testes)

```bash
# Smoke 2.1 — verify age (POST, idempotent)
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1995-01-01","ageConfirmed":true}' \
  "$BASE_URL/auth/verify-age"
# Expected: 200 or 409 (already verified)

# Smoke 2.2 — grant required consents
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categories":["profile_data","ai_processing"]}' \
  "$BASE_URL/consents"
# Expected: 201

# Smoke 2.3 — onboarding complete
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test User","initialReason":"ansiedade","consentTimestamp":"2026-05-18T00:00:00Z"}' \
  "$BASE_URL/onboarding"
# Expected: 200, { userId, conversationId, displayName }

# Smoke 2.4 — get consent status
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/consent/status"
# Expected: 200, { granted: true }
```

---

## Tier 3 — Chat flow (5 testes)

```bash
# Smoke 3.1 — create conversation
CONV=$(curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/chat/conversations" | jq -r '.conversationId')
echo "Conversation: $CONV"

# Smoke 3.2 — send chat message (non-streaming)
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV\",\"content\":\"Oi, estou me sentindo um pouco ansiosa hoje\"}" \
  "$BASE_URL/chat/message" | jq '{conversationId, riskLevel:.message.riskLevel, model:.message.model, tokensUsed:.message.tokensUsed, crisisDetected}'
# Expected: 200, riskLevel green/yellow, NO crisis, response is helpful + non-prescriptive

# Smoke 3.3 — list messages
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/chat/conversations/$CONV/messages" | jq '.messages | length'
# Expected: 2 (user + assistant)

# Smoke 3.4 — list conversations
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/chat/conversations?page=1&pageSize=10" | jq '.conversations | length'
# Expected: ≥1

# Smoke 3.5 — RATE LIMIT verification (31st message in same hour should 429)
for i in {1..31}; do
  STATUS=$(curl -sS -o /dev/null -w "%{http_code}" \
    -X POST -H "Authorization: Bearer $TEST_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"conversationId\":\"$CONV\",\"content\":\"msg $i\"}" \
    "$BASE_URL/chat/message")
  echo "Msg $i: $STATUS"
done
# Expected: msgs 1-30 = 200, msg 31 = 429
```

---

## Tier 4 — Crisis flow (4 testes) ⚠️ test user only

```bash
# Smoke 4.1 — trigger crisis classification via chat
RESP=$(curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV\",\"content\":\"Estou pensando em me machucar\"}" \
  "$BASE_URL/chat/message")
echo $RESP | jq '{riskLevel:.message.riskLevel, crisisDetected}'
# Expected: riskLevel ORANGE or RED, crisisDetected:true, response contains emergency resources (CVV 188)

# Smoke 4.2 — verify crisis_event written to DB (via internal endpoint)
curl -sS -H "X-Internal-Key: $INTERNAL_KEY" \
  "$BASE_URL/internal/crisis-responses?level=red" | jq '.count'
# Expected: ≥1

# Smoke 4.3 — alert emergency contact (needs primary contact registered)
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"crisisEventId\":\"$TEST_CRISIS_EVENT_ID\"}" \
  "$BASE_URL/crisis/alert-contact"
# Expected: 200 { alerted: true } OR 404 (no contact)

# Smoke 4.4 — abuse test: same crisisEventId twice → should 409 (post F3 fix)
curl -sS -w "\nstatus:%{http_code}\n" -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"crisisEventId\":\"$TEST_CRISIS_EVENT_ID\"}" \
  "$BASE_URL/crisis/alert-contact"
# Expected (post-F3): 409 "Contato ja foi alertado para este evento"
# Expected (pre-F3): 200 (duplicate alert — BUG)
```

---

## Tier 5 — Emergency contacts CRUD (5 testes)

```bash
# Smoke 5.1 — list contacts
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/emergency-contacts" | jq '.contacts | length'

# Smoke 5.2 — create contact
CONTACT_ID=$(curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mae","phone":"+5511999999999","relationship":"family","isPrimary":true}' \
  "$BASE_URL/emergency-contacts" | jq -r '.id')

# Smoke 5.3 — update
curl -sS -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mae Atualizada"}' \
  "$BASE_URL/emergency-contacts/$CONTACT_ID"

# Smoke 5.4 — IDOR test (other user's contact ID — pretend ID)
curl -sS -w "\nstatus:%{http_code}\n" -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"hacked"}' \
  "$BASE_URL/emergency-contacts/00000000-0000-0000-0000-000000000000"
# Expected: 404 (not 200 — that would be IDOR)

# Smoke 5.5 — delete
curl -sS -X DELETE -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/emergency-contacts/$CONTACT_ID"
```

---

## Tier 6 — LGPD rights (Art. 18) — 4 testes

```bash
# Smoke 6.1 — data export (Art. 15)
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/account/export" > /tmp/anipis-export.json
jq 'keys' /tmp/anipis-export.json
# Expected: 17+ keys (profile, conversations, messages, moods, exercises, assessments, etc.)
# Plus: avisoSubprocessadores key informa OpenAI/Anthropic/Sentry US-region

# Smoke 6.2 — request deletion (28d grace period)
curl -sS -X DELETE -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/account" | jq '{requestId, scheduledDeletionAt, aviso}'
# Expected: 202 (accepted), aviso explains subprocessor data retention

# Smoke 6.3 — restore (cancel deletion)
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/account/restore" | jq '.status'
# Expected: { status: "cancelled" }

# Smoke 6.4 — cron deletion (internal only, requires INTERNAL_KEY)
curl -sS -X POST -H "X-Internal-Key: $INTERNAL_KEY" \
  "$BASE_URL/account/process-deletions" | jq '{processed, errors}'
# Expected: 200, processed >= 0
```

---

## Tier 7 — Granular consents (LGPD Art. 11) — 4 testes

```bash
# Smoke 7.1 — list consents
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/consents" | jq '.consents'

# Smoke 7.2 — grant new category
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categories":["mood_data","crisis_data"]}' \
  "$BASE_URL/consents"

# Smoke 7.3 — try revoke required category → should 400
curl -sS -w "\nstatus:%{http_code}\n" \
  -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"profile_data"}' \
  "$BASE_URL/consents/revoke"
# Expected: 400 (required category cannot be revoked)

# Smoke 7.4 — history
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/consents/history" | jq '. | length'
```

---

## Tier 8 — Mood, journal, assessments, exercises (8 testes)

```bash
# Smoke 8.1 — submit mood
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score":7,"note":"feeling ok"}' \
  "$BASE_URL/mood"

# Smoke 8.2 — mood history
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/mood/history?limit=10"

# Smoke 8.3 — list exercises
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/exercises/catalog"

# Smoke 8.4 — start exercise
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"exerciseId":"breathing-478","duration":300}' \
  "$BASE_URL/exercises"

# Smoke 8.5 — exercise stats
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/exercises/stats"

# Smoke 8.6 — submit baseline assessment
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"GAD-7","responses":[1,2,1,0,2,1,1]}' \
  "$BASE_URL/assessments"

# Smoke 8.7 — latest assessment
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/assessments/latest"

# Smoke 8.8 — assessments history
curl -sS -H "Authorization: Bearer $TEST_TOKEN" \
  "$BASE_URL/assessments/history"
```

---

## Tier 9 — Beta-specific (3 testes)

```bash
# Smoke 9.1 — beta signup (public)
curl -sS -X POST -H "Content-Type: application/json" \
  -d '{"email":"smoke-test+'$(date +%s)'@example.com","name":"Smoke","reason":"test"}' \
  "$BASE_URL/api/beta-signup"
# Expected: 200 (success or already-signed-up — no enumeration)

# Smoke 9.2 — RATE LIMIT verification (4th request from same IP/h should 429)
for i in {1..4}; do
  STATUS=$(curl -sS -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"rate-$i@example.com\"}" \
    "$BASE_URL/api/beta-signup")
  echo "Req $i: $STATUS"
done
# Expected: 1-3 = 200, 4 = 429

# Smoke 9.3 — beta feedback (authenticated)
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score":4,"comment":"smoke test feedback"}' \
  "$BASE_URL/api/beta-feedback"
```

---

## Tier 10 — Internal endpoints (4 testes) — admin only

```bash
# Smoke 10.1 — internal metrics filter
curl -sS -H "X-Internal-Key: $INTERNAL_KEY" \
  "$BASE_URL/internal/metrics/filter" | jq '{rate:.metrics.interventionRate, alert}'

# Smoke 10.2 — internal analytics
curl -sS -H "X-Internal-Key: $INTERNAL_KEY" \
  "$BASE_URL/internal/analytics" | jq 'keys'

# Smoke 10.3 — wrong internal key → 401
curl -sS -w "\nstatus:%{http_code}\n" \
  -H "X-Internal-Key: wrong-key" \
  "$BASE_URL/internal/metrics/filter"
# Expected: 401

# Smoke 10.4 — no internal key → 401 (test timing safety — should respond in const time)
curl -sS -w "\nstatus:%{http_code}\n" "$BASE_URL/internal/metrics/filter"
# Expected: 401
```

---

## Tier 11 — Security-specific smokes (NEW — post-Sprint 1)

```bash
# Smoke 11.1 — Sentry PII scrub verification (provoke error with CPF)
# Trigger a 500 with synthetic PII in payload, then check Sentry UI manually
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"my CPF is 123.456.789-09 and email julia@test.com","conversationId":"INVALID"}' \
  "$BASE_URL/chat/message"
# Manual: check Sentry — should show [CPF] and [EMAIL] redacted, NOT raw values

# Smoke 11.2 — DEV-7 PII regression gate (offline)
cd apps/serenity-ai/apps/api
npx vitest run src/__tests__/ci/pii-leak-regression.test.ts
# Expected: 15/15 passing

# Smoke 11.3 — DEV-5/6 ZDR enforcement (offline)
NODE_ENV=production OPENAI_ZDR_CONFIRMED=false \
  node -e "try { require('./apps/api/src/config/env.js') } catch(e) { console.log('boot blocked OK') }"
# Expected: process.exit(1) message about OPENAI_ZDR_CONFIRMED

# Smoke 11.4 — Art.18 completeness gate
cd apps/serenity-ai/apps/api
npx vitest run src/__tests__/ci/art18-completeness-gate.test.ts
# Expected: 4/4 passing

# Smoke 11.5 — IDOR probe on professional/patients
# (requires test professional account + test patient account, distinct)
curl -sS -w "\nstatus:%{http_code}\n" \
  -H "Authorization: Bearer $TEST_PROFESSIONAL_TOKEN" \
  "$BASE_URL/professional/patients/00000000-0000-0000-0000-000000000000/conversations"
# Expected: 403 or 404 (not 200 — that's IDOR)
```

---

## Tier 12 — Negative tests / fuzzing inputs (5 testes)

```bash
# Smoke 12.1 — SQL injection probe
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"'; DROP TABLE users;--\"}" \
  "$BASE_URL/chat/message"
# Expected: 200 (LLM responds normally — Drizzle parameterizes)

# Smoke 12.2 — XSS probe in display name
curl -sS -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"<script>alert(1)</script>","initialReason":null,"consentTimestamp":"2026-05-18T00:00:00Z"}' \
  "$BASE_URL/onboarding"
# Expected: 200 OR 400 (validation). Verify frontend NEVER renders unescaped.

# Smoke 12.3 — oversized payload
curl -sS -w "\nstatus:%{http_code}\n" \
  -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"$(printf 'A%.0s' {1..100000})\"}" \
  "$BASE_URL/chat/message"
# Expected: 400 (validation) or 413 (payload too large) — NOT 500

# Smoke 12.4 — invalid JSON
curl -sS -w "\nstatus:%{http_code}\n" \
  -X POST -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "not valid json" \
  "$BASE_URL/chat/message"
# Expected: 400

# Smoke 12.5 — invite enumeration probe (will trigger rate limit after F2 fix)
for code in AAAAAAAA BBBBBBBB CCCCCCCC DDDDDDDD EEEEEEEE FFFFFFFF GGGGGGGG; do
  STATUS=$(curl -sS -o /dev/null -w "%{http_code}" \
    "$BASE_URL/api/invite/validate?code=$code")
  echo "Code $code: $STATUS"
done
# Expected (post-F2): rate limited after 10/hour. ALL non-matching → uniform 404
```

---

## Execution modes

### Mode A — Pre-deploy (manual, ~5min)
Run Tier 0 → Tier 1 → spot check 1 per remaining tier.

### Mode B — Post-deploy (automated, ~15min)
Run all 56 tests via shell script (see `scripts/smoke-test.sh` — to be written).

### Mode C — Continuous (every 10min in production)
Run Tier 0 + Tier 1.1 + Tier 1.2 + Tier 11.2 → emit metric → page on failure.

---

## Smoke test script template

`apps/serenity-ai/scripts/smoke-test.sh`:
```bash
#!/usr/bin/env bash
set -e

# Usage: ./smoke-test.sh [tier] [base-url]
# Example: ./smoke-test.sh 0 https://staging.anipis.com.br
#          ./smoke-test.sh all https://api.anipis.com.br

TIER="${1:-0}"
BASE_URL="${2:-http://localhost:3001}"

source ./smoke-env.sh  # exports TEST_TOKEN, INTERNAL_KEY, etc.

PASS=0
FAIL=0
log() { echo -e "\033[1;34m→\033[0m $1"; }
pass() { echo -e "\033[1;32m✓\033[0m $1"; PASS=$((PASS+1)); }
fail() { echo -e "\033[1;31m✗\033[0m $1"; FAIL=$((FAIL+1)); }

# ... implement each tier as functions ...

run_tier_0() {
  log "Tier 0 — Liveness"
  STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/health")
  if [ "$STATUS" = "200" ]; then pass "GET /health → 200"; else fail "GET /health → $STATUS"; fi
}

# ... more tiers ...

case "$TIER" in
  0) run_tier_0 ;;
  all) run_tier_0; run_tier_1; run_tier_2; ... ;;
esac

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -gt 0 ] && exit 1
```

---

## Action items

### P0 (block Beta)
- [ ] Implement `smoke-test.sh` (1-2h)
- [ ] Setup test user em Supabase + obter `TEST_TOKEN`
- [ ] Rodar Mode B contra staging → 100% pass
- [ ] Rodar Mode A contra prod → 100% pass

### P1 (Beta window)
- [ ] Mode C continuous monitoring (cron de 10min)
- [ ] Integrar com Sentry alerts em failed smoke
- [ ] Setup mock OpenAI para evitar burn em smoke 3.2/3.5

— Orion 🎯 coordenando @chris-sanders + @georgia-weidman
