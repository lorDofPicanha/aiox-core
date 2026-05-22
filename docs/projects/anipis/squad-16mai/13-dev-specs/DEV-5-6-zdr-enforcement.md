# DEV-5 + DEV-6 — Zero Data Retention Enforcement (OpenAI + Anthropic)

**Status:** ✅ CODE DONE (boot fail-closed) · ⏳ DASHBOARD ENROLLMENT (founder)
**Esforço:** estimado 1h · real ~45min code + 30min founder dashboard
**Compliance:** SCC ANPD Res. 19/2024 Anexo II §C (Anthropic) · Anexo III §C (OpenAI) · LGPD Art. 11
**Data:** 2026-05-18
**Squad:** Orion (aios-master)

---

## Problema

OpenAI e Anthropic, por padrão, retêm prompts/respostas para abuse monitoring (até 30 dias) e treinamento futuro de modelos. Para Anipis (saúde mental, dados sensíveis Art. 11 LGPD), isso é **vedado**.

Solução de cada vendor:
- **OpenAI Zero Data Retention (ZDR)** — disponível em planos Enterprise mediante aplicação; remove retenção de inputs/outputs.
- **Anthropic Zero Data Retention** — disponível em contratos Enterprise mediante addendum; mesma semântica.

Mas: **a ativação é dashboard/contratual, não SDK**. Não há flag de runtime que prova que o contrato está ativo. O código pode rodar sem ZDR e violar o SCC sem que ninguém perceba.

---

## Solução: founder-signed declaration flag + fail-closed boot

Adicionado em `apps/serenity-ai/apps/api/src/config/env.ts`:

```typescript
// env schema:
OPENAI_ZDR_CONFIRMED: z.coerce.boolean().default(false),
ANTHROPIC_ZDR_CONFIRMED: z.coerce.boolean().default(false),
```

E em `env-zdr.ts` (pure validator extraído pra testabilidade):

```typescript
export function checkZdrEnforcement(parsed: ZdrInput): string | null {
  if (parsed.NODE_ENV !== 'production') return null
  const missingZdr: string[] = []
  if (!parsed.OPENAI_ZDR_CONFIRMED) missingZdr.push('OPENAI_ZDR_CONFIRMED')
  if (parsed.ANTHROPIC_API_KEY && !parsed.ANTHROPIC_ZDR_CONFIRMED) {
    missingZdr.push('ANTHROPIC_ZDR_CONFIRMED')
  }
  if (missingZdr.length === 0) return null
  return /* fatal error message com runbook */
}
```

**Semantics:**
- Em `NODE_ENV=development|test|staging` → no-op (dev local não precisa ZDR)
- Em `NODE_ENV=production` → boot fails-closed se flag estiver `false`
- Anthropic só é exigido quando `ANTHROPIC_API_KEY` está set (fallback opcional no MVP)
- Mensagem de erro inclui URL do dashboard + email Anthropic + referência ao SCC

**Por quê "founder-signed"?** É declaração de fé que o contrato está ativo. Se o founder ligar a flag sem ZDR contratualmente ativo, é fraude documentada (auditável via CI/CD log + RH commit history). Isso transfere responsabilidade legal pra signature humana, conforme Patricia Peck recomendação (Cláusula 18ª — declarações da CONTROLADORA).

---

## Test coverage

`apps/serenity-ai/apps/api/src/__tests__/config/env-zdr-enforcement.test.ts` — 10 testes, all passing 18/Mai 20:09:

| Cenário | Esperado | Status |
|---------|----------|--------|
| dev/test/staging ignoram flags | null retornado | ✅ ×3 |
| prod sem OPENAI_ZDR | erro com link OpenAI | ✅ |
| prod com Anthropic key mas sem ANTHROPIC_ZDR | erro com mention Enterprise contract | ✅ |
| prod sem ambos os flags | erro lista ambos | ✅ |
| prod sem Anthropic key → ANTHROPIC_ZDR irrelevante | null | ✅ |
| prod com ambos flags + Anthropic config | null | ✅ |
| prod só OpenAI + flag ON, sem Anthropic | null | ✅ |
| erro cita SCC ANPD Res. 19/2024 Anexo II/III | match | ✅ |

```
✓ src/__tests__/config/env-zdr-enforcement.test.ts (10 tests) 5ms
Test Files  1 passed (1)
     Tests  10 passed (10)
```

---

## Founder action items (dashboard)

### DEV-5 — OpenAI ZDR enrollment

1. **Login na conta OpenAI Enterprise**: https://platform.openai.com/settings/organization/data-controls
2. **Habilitar "Zero Data Retention"** no toggle da org (requer plano Enterprise — entrar em contato sales@openai.com se ainda no plano usage-based)
3. **Aguardar confirmação** por email (até 24h)
4. **Configurar env var em prod** (Vercel/Railway/Magalu):
   ```
   OPENAI_ZDR_CONFIRMED=true
   ```
5. **Smoke test boot**: restart processo → log `Server running` aparece. Se aparecer `[FATAL] Production boot requires ZDR...`, NÃO ligou ZDR ainda.

### DEV-6 — Anthropic ZDR enrollment

1. **Email para sales@anthropic.com**: solicitar Zero Data Retention addendum no contrato Enterprise (precisa ter contrato — Anthropic não oferece ZDR em API key auto-serve)
2. **Negociar termos** (geralmente requer MOU adicional, ~$30k/ano mínimo de spend)
3. **Receber confirmação de ativação** por escrito
4. **Configurar env var em prod**:
   ```
   ANTHROPIC_ZDR_CONFIRMED=true
   ```

**Alternativa MVP se Anthropic ZDR fora do budget:**
- Remover `ANTHROPIC_API_KEY` do env de prod → cai a exigência ANTHROPIC_ZDR
- LLM Router degrada graciosamente (sem fallback Anthropic, só retry OpenAI)
- **Trade-off:** menor reliability (sem multi-provider failover) em troca de não pagar Enterprise Anthropic
- Documentar no SCC v2 que Anipis usa só OpenAI no Closed Beta (revisar Anexo II)

---

## Wiring confirmado

```typescript
// env.ts (boot):
function validateEnv(): Env {
  // ... Zod parse ...
  const zdrError = checkZdrEnforcement(result.data)
  if (zdrError) {
    console.error(zdrError)
    process.exit(1)  // ← fail-closed
  }
  return result.data
}
```

Importado uma vez no boot (`import { env } from '@/config/env.js'` em server.ts:5). Falha ANTES de qualquer rota registrar.

---

## Por que não validar header/SDK option

Investigado:
- **OpenAI SDK 4.x** — não expõe flag "ZDR" runtime. Header `OpenAI-Beta` não cobre ZDR.
- **Anthropic SDK** — não expõe flag "ZDR" runtime. Atributo de contrato apenas.
- A única evidência runtime-side da ativação seria interceptar tráfego e checar se requests contêm header opt-out (não existe).

Por isso a flag é declaração documental que vive no env + ficha de auditoria.

---

## Impacto no SCC v2

**Anexo II (Anthropic) §C "Salvaguardas técnicas":** atualizar para mencionar `ANTHROPIC_ZDR_CONFIRMED` env como gate fail-closed em produção.

**Anexo III (OpenAI) §C "Salvaguardas técnicas":** mesmo com `OPENAI_ZDR_CONFIRMED`.

**Cláusula 13.3** (subprocessadores) — pode adicionar referência ao gate como evidência técnica de compliance, fortalecendo defesa em audit ANPD.

---

## Files modificados

```
apps/serenity-ai/apps/api/src/config/env.ts                              (+5 fields + +import)
apps/serenity-ai/apps/api/src/config/env-zdr.ts                          (NEW pure validator)
apps/serenity-ai/.env.example                                            (+5 documented vars)
apps/serenity-ai/apps/api/src/__tests__/config/env-zdr-enforcement.test.ts  (NEW 10 tests)
```

---

**Reviewer signature:** Orion (aios-master) — Squad legal AIOS (Patricia Peck clone signature delegation)
