# DEV-2 — International Transfer Consent UI Spec (Art. 11 I LGPD)

**Status:** ⏳ SPEC READY · ⏳ IMPLEMENTATION pending (4-6h frontend + 2h API)
**Esforço:** estimado 4-6h frontend + 2h API · real do spec 1h
**Deadline:** D-7 (23/Mai/2026) — antes do Closed Beta 30/Mai
**Compliance:** LGPD Art. 11 I (consentimento específico e destacado) · Art. 8 §5 (revogação) · Art. 6 IX (não-discriminação) · Art. 33 IV (transferência internacional) · SCC v2 Cláusula 7.1(c.bis)
**Data:** 2026-05-18
**Squad:** Orion (aios-master) + Ann Cavoukian clone (Privacy by Design)

---

## Princípio guia

> "Consentimento específico **E** destacado" — Art. 11 I LGPD.

Patricia Peck + Lucia Savage + Ann Cavoukian convergem: **prompt separado dos Termos de Uso**, com língua clara e direito de recusa visível. Hume AI / Ease Health / 7 Cups são state-of-the-art em consent layering pra apps de saúde mental — esta spec adota o mesmo padrão adaptado pra Anipis.

---

## Quando aparece no onboarding

Após o user completar:
1. ✅ Age verification (18+ no Closed Beta)
2. ✅ Email/magic-link auth
3. ✅ Aceite Termos de Uso + Privacy Policy gerais

E **ANTES** de:
- Primeira coleta de dado sensível (`profile_data` com idade, gênero, condições psiquiátricas, medicações)
- Primeira mensagem de chat com Anipis (LLM)
- Primeiro mood entry

Posição na navegação: `/onboarding/international-transfer-consent` — quarto step do onboarding, depois de age + consent básico + ToS, antes do primeiro chat.

---

## UI spec (frontend)

### Componente: `<InternationalTransferConsent />`

Fullscreen modal (não dismissible por click fora — força decisão consciente). Mobile-first responsive.

### Anatomia visual

```
┌─────────────────────────────────────────────────┐
│  [Pergaminho Clinico] ícone (não emoji)         │
│                                                  │
│  ## Antes de começar                            │
│                                                  │
│  ### Onde seus dados são processados            │
│                                                  │
│  Para te oferecer Anipis, seus dados de         │
│  conversa, humor e perfil são enviados a estes  │
│  parceiros tecnológicos:                        │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ 🇧🇷 Supabase (Brasil)                   │   │
│  │    Armazenamento de banco de dados      │   │
│  │                                          │   │
│  │ 🇺🇸 OpenAI (Estados Unidos)            │   │
│  │    Modelo de linguagem GPT-4o-mini      │   │
│  │    Contrato: Zero Data Retention ativo  │   │
│  │                                          │   │
│  │ 🇺🇸 Anthropic (Estados Unidos)         │   │
│  │    Modelo fallback Claude Haiku         │   │
│  │    Contrato: Zero Data Retention ativo  │   │
│  │                                          │   │
│  │ 🇺🇸 Sentry (Estados Unidos)            │   │
│  │    Monitoramento de erros (sem PII)     │   │
│  │                                          │   │
│  │ 🇧🇷 Upstash (Brasil) [migrando]        │   │
│  │    Cache de rate limiting                │   │
│  │                                          │   │
│  │ 🇧🇷 Langfuse (Brasil — self-host)      │   │
│  │    Observabilidade interna               │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ### O que isso significa pra você              │
│                                                  │
│  • Seus dados sensíveis (mensagens, humor,      │
│    avaliações psicológicas) podem ser           │
│    processados em servidores nos EUA, sob       │
│    contratos rigorosos (SCCs ANPD Res. 19/2024).│
│                                                  │
│  • Você pode revogar este consentimento a       │
│    qualquer momento, gratuitamente, em          │
│    Configurações → Privacidade.                 │
│                                                  │
│  • Se você recusar, Anipis ainda funciona       │
│    com funcionalidades limitadas (sem chat AI,  │
│    apenas mood tracking + exercises).           │
│    Sua recusa NÃO te exclui da Plataforma.      │
│                                                  │
│  📄 [Ver Política de Privacidade completa]      │
│  📄 [Ver Standard Contractual Clauses (SCC)]    │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Recusar         │  │  Aceito e          │   │
│  │  transferência   │  │  prosseguir        │   │
│  │  internacional   │  │                    │   │
│  └──────────────────┘  └──────────────────┘   │
│   (secundário cinza)    (primário pergaminho)  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Estados

| Estado | Comportamento |
|--------|---------------|
| **Inicial** | Modal abre cobrindo viewport. Botões só ficam habilitados após scroll completo (`useScrollPosition()` hook detecta `scrollTop + clientHeight >= scrollHeight - 8px`). |
| **Loading** | Após click "Aceito", spinner pergaminho 1-2s enquanto API persiste. |
| **Aceito** | Redirect pra `/onboarding/next-step` (chat ou mood — primeiro engagement). Toast confirma "Consentimento registrado". |
| **Recusado** | Modal segundário pergunta "Tem certeza? Você pode usar Anipis sem AI, mas vamos te explicar as limitações." Confirma → modo limited. |
| **Modo limited (post-recusa)** | Flag `consents.international_transfer = false` ativa. UI esconde "Conversar com Anipis", mantém mood + exercises + journal local. Banner permanente: "Você pode habilitar AI a qualquer momento em Configurações → Privacidade." |

### Acessibilidade

- WCAG 2.1 AA (mínimo)
- `<dialog>` HTML5 com `aria-labelledby` + `aria-describedby`
- `Tab` + `Shift+Tab` navegação completa entre links/botões
- `Escape` NÃO fecha (decisão obrigatória) — show toast "Por favor, escolha aceitar ou recusar"
- Screen reader announce: "Modal de consentimento para transferência internacional de dados. Por favor, leia atentamente antes de decidir."
- Botões 48x48px mínimo touch target
- Contrast ratio ≥ 4.5:1 para texto, ≥ 3:1 para componentes interativos

### Design tokens (Pergaminho Clínico)

Reutilizar tokens existentes em `apps/serenity-ai/apps/web/src/styles/tokens.css` (squad-16mai/10-design-v3):

```css
--bg-base: var(--pergaminho-base);           /* tom marfim aged */
--accent-primary: var(--pergaminho-accent);   /* dourado discreto */
--text-primary: var(--ink-deep);              /* sépia escura */
--button-primary-bg: var(--pergaminho-accent);
--button-secondary-bg: transparent;
--button-secondary-border: var(--ink-faded);
```

Tipografia: Crimson Pro (corpo) + Cormorant Garamond (heading) — tokens v3.

---

## Backend spec (API)

### Endpoint novo: `POST /consents/international-transfer`

**Autenticação:** Requer JWT (gates `verifyAuth` + `requireAgeVerification`).

**Request body:**
```typescript
{
  granted: boolean,           // true = aceito, false = recusou
  scrollCompleted: boolean,   // anti-pattern check (gating UX)
}
```

**Response 201 (success):**
```typescript
{
  consentId: string,          // uuid
  category: 'international_transfer',
  granted: boolean,
  grantedAt: string,          // ISO 8601
  scopeMode: 'full' | 'limited',  // full = AI + chat, limited = no AI
  message: string,            // pt-BR confirmação
}
```

**Response 400 (scroll bypass attempt):**
```json
{ "error": "Voce precisa ler o conteudo completo antes de decidir." }
```

**Side effects:**
1. Insert em `granular_consents` com `category='international_transfer'`, `granted=<body>`, `ip_address`, `user_agent`
2. Audit event `consent_changed` em `audit_events` com `decision: 'international_transfer_<granted|denied>'`
3. Update `profiles.onboarding_step` para `'first_chat'` ou `'limited_mode'`
4. (Se `granted=false`) Update flag `profiles.ai_features_enabled = false`

### Database changes

**1. Add new category to enum/types (no migration needed se for TEXT field):**

`packages/shared/src/granular-consents.ts`:
```typescript
export const GRANULAR_CONSENT_CATEGORIES = [
  'profile_data',
  'conversation_content',
  'mood_data',
  'crisis_data',
  'ai_processing',
  'international_transfer',  // ← NEW DEV-2
] as const

export const REQUIRED_CONSENT_CATEGORIES = [
  'profile_data',
  'ai_processing',
  // international_transfer NÃO é required (Art. 6 IX — não-discriminação)
] as const
```

**2. Add `profiles.ai_features_enabled` column:**

`apps/serenity-ai/supabase/migrations/20260520_profiles_ai_features_flag.sql`:
```sql
ALTER TABLE profiles
  ADD COLUMN ai_features_enabled BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN profiles.ai_features_enabled IS
  'DEV-2: false when user recused international transfer consent. Gates LLM chat + Anipis AI features. Mood/journal/exercises remain available offline-first.';
```

### Middleware integration

Adicionar middleware `requireAiConsent` que protege rotas LLM:

`apps/serenity-ai/apps/api/src/middleware/ai-consent-gate.ts`:
```typescript
export async function requireAiConsent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const profile = await loadProfile(request.user.supabaseId)
  if (!profile.aiFeaturesEnabled) {
    return reply.code(403).send({
      error: 'AI features desabilitadas. Habilite em Configuracoes > Privacidade para conversar com Anipis.',
      code: 'INTERNATIONAL_TRANSFER_CONSENT_REQUIRED',
    })
  }
}
```

Aplicar em `/chat` route (chat.ts).

---

## Revocation flow

User vai em **Settings → Privacidade → Consentimentos Internacionais**:

1. Toggle "Habilitar transferência internacional para AI" mostra estado atual
2. Click "Desabilitar" abre modal "Tem certeza? Você perderá acesso ao chat AI imediatamente."
3. Confirma → `POST /consents/revoke` com `category=international_transfer`
4. Backend:
   - Insert revocation em `granular_consents` (revokedAt timestamp)
   - Update `profiles.ai_features_enabled = false`
   - Audit event `consent_changed` com `decision: 'international_transfer_revoked'`
5. UI mostra toast "Consentimento revogado. AI desabilitada."

Revogação NÃO apaga dados antigos do chat (estes seguem em LGPD Art. 18 fluxo separado — `/account/delete`).

---

## Acceptance criteria

### A. Frontend (4-6h)
- [ ] AC-1: Modal aparece após Termos/Privacy básicos + age verification, antes de qualquer chat
- [ ] AC-2: Modal NÃO é dismissible por click fora ou ESC
- [ ] AC-3: Botões só habilitados após scroll completo (anti-pattern check)
- [ ] AC-4: Lista 6 subprocessadores com bandeira, jurisdição e finalidade (ver tabela mockup)
- [ ] AC-5: Link "Recusar" entra em modo limited (chat AI desabilitado, mood/exercises OK)
- [ ] AC-6: Link "Política de Privacidade" abre em nova aba apontando para `/legal/privacy`
- [ ] AC-7: Link "SCC" abre em nova aba apontando para `/legal/scc`
- [ ] AC-8: WCAG 2.1 AA — testado com axe-core no CI
- [ ] AC-9: Mobile responsive (320px+) sem scroll horizontal
- [ ] AC-10: Tokens Pergaminho Clínico v3 aplicados

### B. Backend (2h)
- [ ] AC-11: `POST /consents/international-transfer` aceita `granted: boolean`
- [ ] AC-12: Insert em `granular_consents` com IP + user-agent + timestamp
- [ ] AC-13: Audit event `consent_changed` emitido
- [ ] AC-14: Se `granted=false`, `profiles.ai_features_enabled=false`
- [ ] AC-15: Middleware `requireAiConsent` bloqueia `/chat` se flag false (403 com mensagem PT-BR)
- [ ] AC-16: Endpoint `POST /consents/revoke` aceita `category='international_transfer'`
- [ ] AC-17: Revocation flow re-bloqueia chat imediato

### C. Test coverage
- [ ] AC-18: 5+ tests para `requireAiConsent` middleware (passa quando flag true, bloqueia false, missing profile)
- [ ] AC-19: 3+ tests para route handler (grant success, refuse mode-limited, revoke flow)
- [ ] AC-20: Static gate test em `art18-completeness-gate.test.ts` adiciona `international_transfer` à allowlist (já é categoria genérica)
- [ ] AC-21: E2E Playwright: full onboarding → aceito → chat funciona / recusa → chat bloqueia 403

---

## Anti-patterns vetados

🚫 **Não fazer:**
1. Pre-check default `granted=true` (viola "específico e destacado")
2. Esconder "Recusar" em fonte menor ou cor menos contrastante (viola "destacado")
3. Tornar funcionalidade core (mood, journal) inacessível na recusa (viola Art. 6 IX)
4. Adicionar consent UI dentro do mesmo modal/scroll de Termos de Uso (viola "específico")
5. Cobrar plano diferenciado por aceitar/recusar (viola Art. 6 IX)
6. Re-prompt pop-up dia-sim-dia-não tentando reverter recusa (dark pattern, viola Art. 8 §5 "livre")

✅ **Fazer:**
1. Layout simétrico entre botões "Aceito" e "Recusar" (mesma fonte, mesmo peso)
2. Mensagem clara que recusa NÃO exclui da Plataforma
3. Explicar que ZDR contracts protegem dados nos US
4. Permitir mudança a qualquer momento via Settings (no friction)
5. Audit log forense de decisão (IP + timestamp + scroll-completed flag) — provas defensáveis

---

## Files a modificar/criar

**Frontend (apps/serenity-ai/apps/web):**
```
NEW src/components/onboarding/InternationalTransferConsent.tsx
NEW src/components/onboarding/SubprocessorList.tsx (sub-component)
NEW src/hooks/useScrollPosition.ts
NEW src/lib/api/consents.ts (axios wrapper)
MOD src/app/onboarding/page.tsx (insert step 4)
MOD src/app/settings/privacy/page.tsx (revocation UI)
NEW src/__tests__/components/onboarding/InternationalTransferConsent.test.tsx
NEW e2e/international-transfer-consent.spec.ts (Playwright)
```

**Backend (apps/serenity-ai/apps/api):**
```
NEW src/middleware/ai-consent-gate.ts
MOD src/routes/granular-consents.ts (+POST /international-transfer)
MOD src/routes/chat.ts (apply requireAiConsent middleware)
MOD src/services/consent-service.ts (handle new category)
NEW supabase/migrations/20260520_profiles_ai_features_flag.sql
NEW src/__tests__/middleware/ai-consent-gate.test.ts
MOD src/__tests__/routes/granular-consents.test.ts (+3 tests)
```

**Shared:**
```
MOD packages/shared/src/granular-consents.ts (+1 category)
```

**Legal pages:**
```
NEW apps/web/src/app/legal/privacy/page.tsx (Privacy Policy renderer)
NEW apps/web/src/app/legal/scc/page.tsx (SCC renderer)
```

---

## Por que isso vale a 4-6h de UX

1. **Defesa ANPD audit**: prova específica e destacada = sem ônus probatório de "viciamento do consentimento"
2. **Defesa CFM 2.454/2026**: app de saúde mental que respeita Art. 11 LGPD ≠ teleconsulta = enquadra wellness
3. **Defesa em demanda judicial**: SCC v2 cita esta UI como salvaguarda técnica → contrato fica honest com a realidade
4. **Diferenciador competitivo**: 7 Cups + Talkspace BR + Calm não fazem isso → Anipis vira benchmark
5. **Reduz churn pós-Beta**: usuárias que recusam têm experiência decente (mood + journal) → não sumem; pode reativar consent depois

---

**Reviewer signature:** Orion (aios-master) — Ann Cavoukian clone (Privacy by Design) + Patricia Peck clone (signed SCC v2)
