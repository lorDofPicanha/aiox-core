# R3 — Anthropic Deferred Verification + Production Smoke Test

**Quem executa:** Founder (após R1 Railway deploy)
**Tempo estimado:** 15min
**Deadline:** D-11 (19/Mai)
**Decisão referenciada:** D2 Founder Decision 18/Mai — Anthropic DEFERIR 7d
**Status DEV-side:** ✅ **CÓDIGO PRONTO** (DEV-5/6 entregue 18/Mai noite + sessão de hoje verificou)

---

## TL;DR

A refatoração para aceitar `ANTHROPIC_API_KEY=undefined` **já está em produção via DEV-5/6** (Sprint 18/Mai). Este runbook só **verifica** que o comportamento está correto e descreve smoke test pré-Beta.

**O que já existe no código:**

- `env.ts:26` → `ANTHROPIC_API_KEY: z.string().min(1).optional()` (aceita undefined)
- `env.ts:35` → `ANTHROPIC_ZDR_CONFIRMED: z.coerce.boolean().default(false)` (não exige se key não existir)
- `env-zdr.ts:28` → boot **só exige `ANTHROPIC_ZDR_CONFIRMED`** se `ANTHROPIC_API_KEY` estiver setada
- **Coverage:** 10 tests em `env-zdr-enforcement.test.ts` cobrem todos os cenários (dev/test/staging skip, prod block/allow combinations)

---

## Smoke Test em Railway (pós-R1 deploy)

### Cenário esperado pós Founder D2

| Env Var | Valor Beta |
|---|---|
| `OPENAI_API_KEY` | (set, valor real) |
| `OPENAI_ZDR_CONFIRMED` | `true` (após R2) |
| `ANTHROPIC_API_KEY` | **NÃO SETAR** (deixar undefined) |
| `ANTHROPIC_ZDR_CONFIRMED` | **NÃO SETAR** (vai para default `false`, ok) |

### Passo 1 — Verificar env vars (3min)

1. Railway dashboard → projeto `anipis-api-beta` → **Variables**
2. Confirmar:
   - ✅ `OPENAI_API_KEY` presente
   - ✅ `OPENAI_ZDR_CONFIRMED=true` presente
   - ❌ `ANTHROPIC_API_KEY` **AUSENTE** (não tem a row)
   - ❌ `ANTHROPIC_ZDR_CONFIRMED` **AUSENTE** ou `false`
3. Se `ANTHROPIC_API_KEY` ainda estiver setada de testes anteriores: **clicar no X para remover** e redeploy

### Passo 2 — Trigger redeploy (1min)

1. **Deployments** tab → **"Redeploy"** no último deployment
2. Aguardar build completar (~2min)

### Passo 3 — Observar logs de boot (2min)

Em **View Logs** procurar pelas linhas:

✅ **Boot SUCESSO esperado:**
```
[Anipis API] Environment validated
[Anipis API] ZDR enforcement OK
[Anipis API] Server listening on 0.0.0.0:3000
```

❌ **Se boot falhar com:**
```
[FATAL] Production boot requires ZDR declaration flags set to true:
  - OPENAI_ZDR_CONFIRMED=true
```
→ R2 não está completo. Voltar pra R2 + setar `OPENAI_ZDR_CONFIRMED=true`.

❌ **Se boot falhar com:**
```
[FATAL] Production boot requires ZDR declaration flags set to true:
  - ANTHROPIC_ZDR_CONFIRMED=true
```
→ `ANTHROPIC_API_KEY` ainda está setada (por engano). **Remover do Railway** e redeploy.

❌ **Se boot falhar com qualquer outra:**
→ Não é problema do D2/R3. Diagnóstico geral Railway logs (R1 troubleshooting).

### Passo 4 — Funcional smoke test (5min)

```bash
# 1. Health check
curl https://api.anipis.com.br/health
# Espera: {"status":"ok","timestamp":"..."}

# 2. Chat endpoint (com JWT válido da sua conta Supabase teste)
JWT=$(supabase-jwt-helper-of-choice)  # adapte
curl -X POST https://api.anipis.com.br/chat \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"message":"oi, esse é um teste de smoke pre-Beta","conversationId":"smoke-test-2026-05-19"}'

# Espera: stream response do OpenAI (não Anthropic)
# Falha aceitavel: 401/403 se JWT invalido — confirma só que servidor está vivo
```

### Passo 5 — Confirmar provider em uso (3min)

Em Langfuse (https://cloud.langfuse.com → projeto Anipis):

1. **Traces** tab → ver últimas chamadas
2. Cada trace deve mostrar **`model: "gpt-4o-mini"`** (ou modelo OpenAI configurado)
3. **NÃO** deve aparecer `model: "claude-*"` (Anthropic seria fallback inexistente agora)
4. Se aparecer Anthropic call → `llm-router.ts` está routando errado, abrir bug

---

## Reavaliação 25/Mai (D-5)

Conforme D2: revalidar se vale reabilitar Anthropic. Checklist decisão:

- [ ] OpenAI ZRT está estável após 5d? (sem erros 5xx, sem retention surprises)
- [ ] Anthropic Enterprise contract negociado? (sales conversation iniciou em D-9?)
- [ ] DPA Anthropic assinado com cláusula ZDR explícita (não só dashboard)?
- [ ] Risk model atualizado: fallback resilience vale o vendor extra?

**Se SIM em todas:**
→ Setar `ANTHROPIC_API_KEY` + `ANTHROPIC_ZDR_CONFIRMED=true` no Railway
→ Smoke test repetir
→ DPIA v3 atualizar Tabela 4 (Anthropic "ATIVA")
→ SCC Anexo II ativo

**Se NÃO em qualquer:**
→ Manter deferida até D-0 (30/Mai)
→ Adicionar item no roadmap pós-Beta: "Reavaliar Anthropic pós-launch + 30d"

---

## Checklist final

- [ ] Railway env vars: `OPENAI_API_KEY` ✅, `OPENAI_ZDR_CONFIRMED=true` ✅
- [ ] Railway env vars: `ANTHROPIC_API_KEY` AUSENTE ✅
- [ ] Boot prod logs: "ZDR enforcement OK" ✅
- [ ] `/health` retorna 200 ✅
- [ ] Chat smoke test usa OpenAI (Langfuse confirma) ✅
- [ ] Calendário: reavaliação Anthropic agendada 25/Mai ✅
- [ ] DPIA v2 Tabela 4 reflete status "NÃO ATIVA" ✅ (feito sessão 19/Mai)

---

## Por que R3 ficou trivial

Sprint DEV-5/6 (18/Mai noite) já implementou e testou:
- 10 tests em `env-zdr-enforcement.test.ts`
- `ANTHROPIC_API_KEY` é tratada como optional desde sempre (`env.ts:26`)
- `env-zdr.ts:28` só exige flag se key estiver setada
- DEV-7 PII regression CI gate (15 tests) garante que se Anthropic for reativada, filtros estão íntegros

**Risco residual:** zero código pendente. Único risco operacional = founder esquecer de **remover** `ANTHROPIC_API_KEY` se ela já estava no Railway de testes anteriores.

---

## Próximo passo

Após R3 verificado:
→ **R4** — template email 20 Júlias (rede pessoal pré-selecionada)
→ Smoke test broader: ver `SMOKE-TEST-LIST.md` (56 testes em 12 tiers) — agendar D-4 (26/Mai)

**Trigger Orion:** `r3 anthropic verificado` → atualiza Closed-Beta-Checklist
