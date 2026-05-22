# R2 — OpenAI Zero Data Retention (ZRT) Enrollment

**Quem executa:** Founder
**Tempo estimado:** 30min + 24-48h vendor response
**Deadline:** D-10 (20/Mai) para enviar; D-3 (27/Mai) para ter confirmação
**Decisão referenciada:** SCC v2 Edição 3 + DPIA v2 §5 e §8.3(c)

---

## Por que importa

Sem ZRT, a OpenAI **retém prompts e completions por 30 dias** (padrão API). Para Anipis isso significa:

1. **Dados sensíveis** (saúde mental) ficam em servidor OpenAI 30d — janela ampla para subpoena/breach
2. **DPIA R5 (uso indevido para treinamento)** sai de "Baixo" para "Médio-Alto"
3. **SCC Cláusula 3.2 (vedação ao treinamento)** vira promessa não-tecnicamente-garantida
4. **Founder fica exposto a Art. 41 LGPD** (cooperação ANPD) em audit eventual

Com ZRT enterprise:
- ✅ Zero retenção: dados deletados imediatamente após response
- ✅ Cláusula contratual auditável (DPA enterprise)
- ✅ Cobertura para fine-tuning vedado
- ✅ Habilita `OPENAI_ZDR_CONFIRMED=true` no Railway → boot prod passa

---

## Pré-requisitos

- [ ] Conta OpenAI com billing ativo (plataforma `platform.openai.com`)
- [ ] Volume de uso justificável (Beta = baixo, mas explicar caso de uso ajuda)
- [ ] Acesso ao email da org (vão pedir corporate email — `founder@anipis.com.br` ou similar)

---

## Caminho A — Self-service (recomendado, mais rápido)

OpenAI tem self-service ZDR pra Tier 2+ enterprise (~$100+ histórico mensal). Verifique seu tier:

1. https://platform.openai.com/account/limits → ver "Tier"
2. Se **Tier 2+**: pula pro Caminho A
3. Se **Tier 1** ou Free: pula pro Caminho B (precisa contatar sales)

### Passo 1 — Acessar Data Controls (5min)

1. https://platform.openai.com/account/data-controls
2. Procurar seção **"Zero Data Retention"** (ZDR) ou **"Data retention period"**
3. Atual default: **30 days**

### Passo 2 — Solicitar ZDR (3min)

1. Click **"Request Zero Data Retention"** (botão pode variar)
2. Preencher form:
   - **Use case:** "Mental health AI companion. Processes sensitive health data of Brazilian users. LGPD compliance requires Zero Data Retention for international transfer under Resolução ANPD 19/2024."
   - **Estimated monthly volume:** seu volume Beta (~$50-200/mês inicial)
   - **Affected models:** `gpt-4o`, `gpt-4o-mini`, `text-embedding-3-small` (ou o que estiver usando)
3. Submit

### Passo 3 — Aguardar email confirmation (24-48h)

OpenAI vai responder com:
- ✅ ZDR aprovado: cliente é movido para "Zero Retention" tier no backend (transparente, mesma API key)
- 📄 DPA addendum link: assinar via DocuSign confirmando termos enterprise
- ⚠️ Confirmation email + dashboard flag "ZDR Active"

### Passo 4 — Validar em prod (5min)

1. https://platform.openai.com/account/data-controls → confirmar **"Zero Data Retention: Enabled"**
2. Screenshot da tela (vai pra Patricia como evidência SCC)
3. Em Railway env vars: **setar `OPENAI_ZDR_CONFIRMED=true`** e redeploy
4. Smoke test:
   ```bash
   curl https://api.anipis.com.br/health
   # ENV check via /health/env (se exposto) — caso contrário ver logs Railway "[Anipis API] ZDR enforcement OK"
   ```

---

## Caminho B — Sales contact (se Tier 1 ou Free)

OpenAI só dá ZDR pra contratos enterprise customizados em volumes pequenos. Caminho:

### Passo 1 — Contato (5min)

Email para `sales@openai.com` ou usar form em https://openai.com/enterprise

**Template:**

> Subject: ZDR + DPA enterprise request — Brazilian mental health startup
>
> Hi OpenAI Sales,
>
> I'm the founder of Anipis (anipis.com.br), a Brazilian AI mental-health companion in Closed Beta launch (May 30, 2026, 20 users initial).
>
> We process sensitive health data of Brazilian citizens. Under Brazil's LGPD (Law 13.709/2018) and Resolução ANPD 19/2024 (international data transfer), we need:
>
> 1. **Zero Data Retention (ZDR)** for all API calls
> 2. **Enterprise DPA** with explicit no-training clause
> 3. **SOC 2 Type II + ISO 27001 reports** for audit evidence
>
> Estimated initial volume: $100-500/month (will grow with launch). We use `gpt-4o-mini` for inference and `text-embedding-3-small` for embeddings.
>
> Can we set up a 15min call this week to enroll the account?
>
> Thanks,
> Breno Cerqueira
> Founder, Anipis
> +55 [phone]

### Passo 2 — Aguardar response

Tipicamente 3-5 business days. Pode pedir minimum spend commitment (~$500/mês). Se aprovado, segue caminho A do passo 3 em diante.

---

## Passo 5 — Documentar evidência (10min, importante!)

Após ZDR confirmado, criar arquivo evidência:

`docs/projects/anipis/squad-16mai/12-compliance/evidence/openai-zdr-confirmation.md`

```markdown
# OpenAI Zero Data Retention — Evidence

**Account:** [email]
**Tier:** [Tier X]
**ZDR enrolled date:** YYYY-MM-DD
**DPA signed date:** YYYY-MM-DD
**DPA reference:** [DocuSign envelope ID ou link]

**Screenshot dashboard:** [PATH ou link]

**Email confirmation:** [forward para esta pasta como `openai-zdr-email.eml`]

**Affected models confirmados ZDR:**
- gpt-4o-mini ✅
- text-embedding-3-small ✅
- [outros que usar]

**Validação prod:**
- `OPENAI_ZDR_CONFIRMED=true` no Railway: YYYY-MM-DD
- Boot prod sem erro: ver logs Railway [DATE]
- Smoke test ZRT: enviar prompt teste → verificar dashboard OpenAI mostra "0 retention" no log

**Patricia notificada:** YYYY-MM-DD (incluído na evidence pack do SCC v2)
```

---

## Checklist final

- [ ] Tier OpenAI verificado (≥Tier 2 = caminho A)
- [ ] ZDR request submitted via dashboard ou sales
- [ ] Email confirmation recebido
- [ ] DPA enterprise assinado (DocuSign)
- [ ] Screenshot dashboard "ZDR Active"
- [ ] Railway env `OPENAI_ZDR_CONFIRMED=true` redeployado
- [ ] Smoke test pós-deploy: boot prod sem erro
- [ ] Evidence file criado em `12-compliance/evidence/`
- [ ] Patricia notificada (anexar a próximo email pra ela)

---

## Troubleshooting

**Sales não responde em 3 dias:**
→ Follow-up email + procurar @OpenAIDevs no Twitter (sales engineer responde DM normalmente).

**Pedem minimum spend:**
→ Negociar prorate ou commit anual mínimo (~$500-1000). Justificar com health-data sensitivity.

**ZDR aprovado mas dashboard ainda mostra "30 days":**
→ Backend ainda não migrou conta. Email account-manager.openai.com solicitando flag.

**Boot prod falha após `OPENAI_ZDR_CONFIRMED=true`:**
→ Erro provavelmente em `env-zdr.ts`. Verificar: env não pode ser string `"false"`. Aceito apenas `"true"` ou unset.

---

## Custo esperado

ZDR enterprise é **gratuito** — não adiciona custo à API. Só pode adicionar minimum spend (~$100-500/mês) se Tier 1.

---

## Próximo passo

Após R2 completo:
→ **R3** — verificar env.ts graceful sem ANTHROPIC_API_KEY (já implementado DEV-5/6, só smoke test)
→ Enviar evidence pra Patricia anexar ao SCC v2 (cláusula 12 transparency requirements)

**Trigger Orion:** `r2 openai zdr feito` → atualiza Closed-Beta-Checklist + sync com Patricia email
