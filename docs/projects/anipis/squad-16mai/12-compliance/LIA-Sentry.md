# Legitimate Interest Assessment (LIA) — Sentry

**Controladora:** ANIPIS — `[Razão Social a definir]`, CNPJ `[______________]`
**Operadora:** Sentry, Inc. — 45 Fremont St, 8th Floor, San Francisco, CA 94105, US
**Base legal LGPD:** Art. 7º, IX — interesse legítimo (Art. 10 LGPD detalha critérios)
**Data:** 18/Mai/2026
**Versão:** 1.0
**Próxima revisão:** Anualmente ou a cada alteração material do tratamento

---

## A. PURPOSE TEST (Teste de Finalidade)

**Finalidade:** Monitoramento de erros, exceções runtime, performance de funções/spans e alertas de degradação operacional da Plataforma Anipis (apps/api Node.js + apps/web Next.js PWA), com objetivo de garantir disponibilidade, segurança e qualidade da experiência das titulares ("Júlias").

### Perguntas-teste

| Pergunta | Resposta | Detalhe |
|----------|----------|---------|
| A finalidade é específica? | ✅ SIM | Observabilidade técnica de runtime (erros + spans + métricas), sem propósito comercial secundário, sem marketing, sem decisão automatizada afetando o titular |
| A finalidade é legítima? | ✅ SIM | Art. 6º, II LGPD (adequação ao serviço contratado) + Art. 6º, VI (transparência) + necessidade operacional inerente a plataforma SaaS de saúde mental |
| A finalidade é lícita? | ✅ SIM | Não viola direitos fundamentais nem expõe titulares; tratamento técnico inerente a software contemporâneo |
| Há outra base legal aplicável? | ❌ NÃO | (i) Não é execução de contrato (titular contrata o serviço Anipis, não a observabilidade); (ii) Não é consentimento — coleta de telemetria é parte intrínseca de operação SaaS, sem opção realista de opt-out individual sem inviabilizar entrega do serviço; (iii) Não é obrigação legal stricto sensu; (iv) **Interesse legítimo é a base apropriada** |

### Conclusão Purpose Test

Finalidade legítima, específica, lícita. Interesse legítimo (Art. 7º IX) é a base legal apropriada.

---

## B. NECESSITY TEST (Teste de Necessidade)

### Dados tratados pelo Sentry

| Categoria | Detalhe | Sensível? |
|-----------|---------|-----------|
| Stack traces | Linhas de código, nome de função, módulo, error class | ❌ Não |
| Metadados de request | URL path (path-only, sem query params), HTTP method, status code | ❌ Não |
| User ID (hash) | UUID do usuário Anipis (não-PII se isolado; pseudoidentifier se cruzado com base interna) | ⚠️ Pseudoidentifier |
| Breadcrumbs | Eventos UI/network anteriores ao erro (com filtro `beforeBreadcrumb`) | ⚠️ Depende filtro |
| Browser/OS metadata | Navegador, versão OS, viewport | ❌ Não |
| IP address | IP parcial ou hash, conforme configuração | ⚠️ Pseudoidentifier |

### Filtros e salvaguardas técnicas implementadas

Conforme `apps/serenity-ai/apps/api/src/config/sentry-config.ts` (auditado em **DEV-3, 18/Mai/2026 — 25 testes passing**) com **6-layer hardening**: (i) `event.message` redacted, (ii) `event.user` reduzido a `{id: hashedUUID}` ou `{}`, (iii) `event.request.data/cookies/headers.authorization` strip, (iv) `event.extra` PII scrub, (v) `event.breadcrumbs` filter de categories interactivas, (vi) `event.exception` value strip. Cobertura validada por **CI gate DEV-7 `pii-leak-regression.test.ts`** (15 testes static-analysis) que previne remoção acidental do hardening em PRs futuros.

```typescript
Sentry.init({
  beforeSend(event, hint) {
    // Strip free-text message content
    if (event.message) event.message = '[REDACTED]';
    // Strip user PII keeping only hashed UUID
    if (event.user) {
      event.user = { id: hashSync(event.user.id) };
    }
    // Strip request body (potential PII)
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    // Strip breadcrumbs containing message content
    event.breadcrumbs = event.breadcrumbs?.filter(b =>
      !['ui.input', 'ui.click', 'console'].includes(b.category)
    );
    return event;
  },
  sendDefaultPii: false,
  attachStacktrace: true,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});
```

### Perguntas-teste

| Pergunta | Resposta | Detalhe |
|----------|----------|---------|
| Os dados são adequados à finalidade? | ✅ SIM | Stack traces + metadados técnicos são exatamente o necessário para diagnóstico |
| Os dados são proporcionais? | ✅ SIM | Apenas erros (não logs verbose) + sample 10% spans (não 100%) |
| Existe meio menos invasivo? | ⚠️ Sim, mas trade-off material | (i) Self-hosted GlitchTip (fork OSS) — exige infra adicional, perde APM features, **considerado em Plan B se Sentry recusa SCC**; (ii) Console-only logging — inviabiliza diagnóstico produção remota |
| Volume é proporcional? | ✅ SIM | Sampling 10% + filtros agressivos → estimativa <1MB/dia/usuário em telemetria |
| Há minimização? | ✅ SIM | `beforeSend` filtra free-text, user PII bruta, request body, cookies, breadcrumbs interativos |

### Conclusão Necessity Test

Tratamento minimizado ao essencial. Meios menos invasivos existem mas têm trade-offs materiais (GlitchTip = perda APM; console-only = inviabiliza prod). **Necessidade confirmada.**

---

## C. BALANCING TEST (Teste de Ponderação)

### Expectativa razoável do titular

**ALTA.** Usuárias de SaaS contemporâneo (incluindo apps de saúde mental como 7 Cups, Hume AI, Headspace) **esperam** que problemas técnicos sejam diagnosticados pelo fornecedor. Privacy Policy v1 explicitará uso de Sentry e direito de oposição.

### Impacto sobre o titular

**BAIXO.** Análise detalhada:

| Dimensão | Análise |
|----------|---------|
| Direito à privacidade | Mitigado por `beforeSend` filter — sem PII bruta; sem conteúdo de mensagens com IA; sem journal entries |
| Liberdade de expressão | Não afetada — Sentry não acessa conteúdo dos diálogos |
| Não-discriminação | Não há decisão automatizada baseada em telemetria afetando o titular |
| Direito de revogação | Garantido (Art. 18 §2 LGPD) — opt-out de telemetria não impede uso do serviço, com degradação documentada de qualidade de diagnóstico |
| Riscos de segurança | Mitigado: DPA assinado + SCC ANPD Res. 19/2024 em assinatura + dados em trânsito TLS 1.2+ + at-rest encryption Sentry SOC 2 Type II |
| Riscos de re-identificação | Pseudoidentifier UUID hash; sem combinação com fontes externas; baixa probabilidade re-identificação isolada |

### Salvaguardas listadas

1. **Filtro técnico `beforeSend` 6-layer** auditado (DEV-3) e testado (25 testes em `sentry-hardening.test.ts`)
2. **CI gate regression DEV-7** (`pii-leak-regression.test.ts` 15 testes) impede remoção acidental do hardening em PRs
3. **Retenção 30 dias** (configurada em painel Sentry Business tier, abaixo do default 90 dias)
4. **DPA padrão Sentry** assinado
5. **SCC ANPD Res. 19/2024 v2** em assinatura (deadline 30/Mai/2026), incluindo Cláusula 12.1(f) sobre transparency report agregado para requisições governamentais estrangeiras (FISA §702, EO 12333, CLOUD Act)
6. **Direito de oposição operacionalizado** — usuária pede opt-out via `security@anipis.com.br` ou Configurações » Privacidade (Cláusula 9 SCC + Art. 18 §2 LGPD)
7. **Política de Privacidade v2** (`Privacy-Policy-v2-draft.md`) declara uso de Sentry, finalidade, base legal Art. 7º IX, retenção 30d, direito de oposição
8. **Transparency report semestral Sentry** publicado em https://sentry.io/trust/ (vendor já publica; SCC v2 12.1(f) exige número agregado de requisições especificamente atribuídas à conta Anipis)
9. **Auditoria SOC 2 Type II + ISO 27001** Sentry — relatórios anuais arquivados em `12-compliance/evidence/sentry-soc2/`
10. **Não há venda nem compartilhamento comercial** dos dados pelo Sentry (DPA proibe explicitamente)
11. **No-PII guarantee** validado por testes automatizados em cada release (CI gate DEV-7 bloqueia merge se PII filter removido)
12. **Server-side scrub adicional** configurado no painel Sentry SaaS (defense-in-depth — founder action item DEV-3 ops pré-Beta)

### Quadro de ponderação

| Lado | Peso |
|------|------|
| **Interesse Anipis** (diagnóstico de erro = disponibilidade do serviço = saúde digital das Júlias) | ALTO |
| **Direito do titular** (privacidade da telemetria técnica) | MÉDIO |
| **Mitigação técnica + DPA + SCC + opt-out garantido** | ALTO |
| **Risco residual ao titular** | BAIXO |

### Conclusão Balancing Test

Interesse legítimo da Anipis **prevalece** sobre o risco residual ao titular, dado o conjunto robusto de salvaguardas técnicas e contratuais.

---

## D. CONCLUSÃO

O tratamento de dados técnicos via Sentry para fins de observabilidade da Plataforma Anipis **se justifica sob Art. 7º, IX LGPD**.

- **Purpose Test:** ✅ Aprovado
- **Necessity Test:** ✅ Aprovado
- **Balancing Test:** ✅ Aprovado — risco residual baixo

Esta LIA será revisada **anualmente** ou a cada **alteração material** no produto (e.g., novo subprocessador, mudança em sampling, expansão de campos coletados, alteração em `beforeSend` filter).

Em caso de mudança em qualquer um dos elementos acima, executar nova LIA antes de aplicar a alteração em produção.

---

## E. Direito de Informação ao Titular

Conforme Art. 9º LGPD, o titular será informado dos seguintes elementos antes da primeira coleta (Cláusula 7.1 c.bis SCC ANPD Res. 19/2024):

- (i) Identidade do operador (Sentry, Inc., San Francisco, US)
- (ii) Finalidade (observabilidade técnica)
- (iii) Base legal (interesse legítimo Art. 7º IX)
- (iv) Categorias de dados (técnicos, pseudonimizados)
- (v) Retenção (30 dias)
- (vi) Compartilhamento (subprocessadores Sentry — AWS US conforme DPA)
- (vii) Direito de oposição (Art. 18 §2)
- (viii) Canal: `security@anipis.com.br`

---

## F. Histórico de revisões

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 18/Mai/2026 | Squad legal AIOS (draft) + DPO interim (assinatura) | Versão inicial |
| 1.1 | 19/Mai/2026 | Squad legal AIOS (review) | Atualizada referência a `sentry-config.ts` (não `config/sentry.ts`); 6-layer hardening detalhado; CI gate DEV-7 mencionado; SCC v2 Cláusula 12.1(f) transparency report; alinhada com Privacy Policy v2 draft. Pendente assinatura DPO interim. |

---

**Assinatura DPO interim:**

Breno Cerqueira — DPO interim ANIPIS
Data: ____/____/2026
Assinatura: ________________________________

**Disclaimer:** Documento orientativo redigido pelo squad legal AIOS (Lucia Savage + Ann Cavoukian + Bruce Schneier). Não substitui revisão pelo escritório Patricia Peck Advocacia antes da assinatura final pelo DPO interim. Documento sujeito à apreciação ANPD em eventual audit (Art. 23 §2 LGPD).
