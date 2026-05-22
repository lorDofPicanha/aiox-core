# Legitimate Interest Assessment (LIA) — Langfuse

**Controladora:** ANIPIS — `[Razão Social a definir]`, CNPJ `[______________]`
**Operadora:** Langfuse GmbH — Köpenicker Str. 126, 10179 Berlin, Alemanha (Tier Pro EU Frankfurt)
**Base legal LGPD:** Art. 7º, IX — interesse legítimo (Art. 10 LGPD detalha critérios)
**Data:** 18/Mai/2026
**Versão:** 1.0
**Próxima revisão:** Anualmente ou a cada alteração material do tratamento

---

## A. PURPOSE TEST (Teste de Finalidade)

**Finalidade:** Observabilidade técnica de chamadas a Large Language Models (LLMs) — captura de prompts, completions, latência, tokens consumidos, custos, e métricas de qualidade (eval scores) — para fins de (i) debug de regressões em pipelines de IA, (ii) análise de drift de modelo, (iii) tuning de prompts, (iv) detecção de uso anômalo (jailbreaks, prompt injection, hallucination), (v) controle de custo operacional.

### Perguntas-teste

| Pergunta | Resposta | Detalhe |
|----------|----------|---------|
| A finalidade é específica? | ✅ SIM | Observabilidade de LLM stack — sem propósito comercial secundário, sem treino de modelo Langfuse, sem decisão automatizada afetando o titular |
| A finalidade é legítima? | ✅ SIM | Art. 6º, II LGPD (adequação) + Art. 6º, VI (transparência) + necessidade técnica de IA generativa segura. Em apps de saúde mental, observabilidade de LLM é dever de cuidado (Bruce Schneier threat model) |
| A finalidade é lícita? | ✅ SIM | Não viola direitos fundamentais; tratamento técnico estabelecido em state-of-the-art ML ops |
| Há outra base legal aplicável? | ❌ NÃO | (i) Não é execução de contrato (titular contrata serviço Anipis, não observabilidade interna); (ii) Não é consentimento — coleta é parte intrínseca da operação responsável de LLM; (iii) Não é obrigação legal stricto sensu; (iv) **Interesse legítimo é a base apropriada** |

### Conclusão Purpose Test

Finalidade legítima, específica, lícita. Interesse legítimo (Art. 7º IX) é a base legal apropriada.

---

## B. NECESSITY TEST (Teste de Necessidade)

### Dados tratados pelo Langfuse

| Categoria | Detalhe | Sensível? |
|-----------|---------|-----------|
| Prompts (system/user) | Texto enviado ao LLM (Anthropic Claude / OpenAI GPT) | ⚠️ Pode conter dado sensível |
| Completions | Texto retornado pelo LLM | ⚠️ Pode conter conteúdo terapêutico |
| Trace ID | UUID da sessão de chat | ❌ Não |
| User ID (hash) | UUID do usuário Anipis (pseudoidentifier) | ⚠️ Pseudoidentifier |
| Metadata model | Nome do modelo, versão, parâmetros (temperature, max_tokens) | ❌ Não |
| Latência + tokens + cost | Métricas operacionais | ❌ Não |
| Eval scores | Scores de qualidade (safety, hallucination, sentiment) | ❌ Não |

### Filtros e salvaguardas técnicas implementadas

Conforme `apps/serenity-ai/apps/api/src/services/observability/langfuse-client.ts` (auditado em SPIKE-2 16/Mai/2026; **reforçado em DEV-7 18/Mai/2026 com CI gate regression** `pii-leak-regression.test.ts` 15 testes static-analysis cobrindo `redactForObservability` import + uso + fail-closed para `[REDACTION_FAILED]` em caso de exception):

```typescript
// Pre-flush filter — strips PII from prompt/completion before sending
function scrubLangfusePayload(payload: LangfuseTrace): LangfuseTrace {
  return {
    ...payload,
    input: scrubFreeText(payload.input),    // PII redactor: CPF, email, phone
    output: scrubFreeText(payload.output),
    metadata: {
      ...payload.metadata,
      // Hash user_id, never plain UUID
      userId: hashUserId(payload.metadata?.userId),
    },
  };
}
```

### Perguntas-teste

| Pergunta | Resposta | Detalhe |
|----------|----------|---------|
| Os dados são adequados à finalidade? | ✅ SIM | Prompts + completions são exatamente o necessário para debug e drift detection |
| Os dados são proporcionais? | ✅ SIM | Sampling 100% inicial (Closed Beta 20 usuárias = volume baixo); ajustar para 10-20% em scale |
| Existe meio menos invasivo? | ⚠️ Limitado | (i) Self-hosted Langfuse — Anipis já considerou; rejeitado por overhead operacional; (ii) Console-only logging — inviabiliza drift detection e quality eval |
| Volume é proporcional? | ✅ SIM | Closed Beta 20 usuárias × ~50 turns/dia = ~1000 traces/dia |
| Há minimização? | ✅ SIM | `scrubFreeText` redactor PII pré-flush; sem CPF/email/phone bruto; user_id hashed |

### Conclusão Necessity Test

Tratamento minimizado ao essencial. Meios alternativos têm trade-offs operacionais inaceitáveis (perda de drift detection é risk material em app de saúde mental). **Necessidade confirmada.**

---

## C. BALANCING TEST (Teste de Ponderação)

### Expectativa razoável do titular

**ALTA** quanto a observabilidade técnica em geral; **MÉDIA-BAIXA** especificamente sobre captura de prompts/completions terapêuticos.

**Mitigantes da expectativa:**
- Privacy Policy v1 declarará explicitamente uso de Langfuse e propósito
- Consent UI destacado no onboarding (Art. 11 I + Cláusula 7.1 c.bis SCC)
- Direito de oposição garantido (Art. 18 §2 LGPD)

### Impacto sobre o titular

**BAIXO-MÉDIO.** Análise detalhada:

| Dimensão | Análise |
|----------|---------|
| Direito à privacidade | Mitigado por `scrubFreeText` filter (CPF/email/phone removidos antes de flush) + `hashUserId` + retenção 14d Tier Pro |
| Sensibilidade do conteúdo | **CONTEÚDO TERAPÊUTICO PRESERVADO** — prompts/completions sobre saúde mental podem conter dor emocional, ideação, traumas. Mitigação: EU hosting (Frankfurt) + GDPR-equivalent regime + retention 14d (acima do mínimo necessário para drift detection mas abaixo de default 60d) |
| Liberdade de expressão | Não afetada — observabilidade não impede o que a usuária diz ao LLM |
| Não-discriminação | Não há decisão automatizada baseada em traces Langfuse afetando o titular individualmente. Eval scores são agregados estatísticos para tuning de prompts |
| Direito de revogação | Garantido — opt-out de observabilidade granular (chat individual) tecnicamente possível via flag `metadata.langfuse_disabled` no contexto |
| Riscos de segurança | Mitigado: TLS 1.2+ em trânsito; AES-256 at-rest Langfuse Cloud Pro; SOC 2 Type II Langfuse; DPA GDPR-compliant assinado; SCC ANPD Res. 19/2024 em assinatura |
| Riscos de re-identificação | Pseudoidentifier UUID hash; sem PII bruta nos textos via filter; **risco residual:** correlação inferencial (e.g., conteúdo terapêutico altamente específico pode permitir re-identificação por adversário com acesso ao banco) — mitigado por retenção 14d + access controls Langfuse |

### Salvaguardas listadas

1. **Filtro técnico `redactForObservability`** auditado SPIKE-2 e reforçado DEV-7 com regression CI gate (15 testes)
2. **`hashUserId`** — UUID nunca enviado em plaintext
3. **EU hosting Frankfurt** — regime equivalente GDPR/LGPD (vs vendor US, materialmente menor risco Schrems II / FISA / CLOUD Act)
4. **Retenção 14 dias** (configurada Tier Pro, abaixo do default 60 dias)
5. **DPA GDPR-compliant** assinado
6. **SCC ANPD Res. 19/2024 v2** em assinatura (deadline 30/Mai/2026) — para Langfuse a Cláusula 12 (autoridades estrangeiras) é menos crítica porque jurisdição é UE (não US), mas mantida por completude
7. **Direito de oposição operacionalizado** — opt-out granular via `security@anipis.com.br` ou Configurações » Privacidade (categoria `international_transfer` no Settings cobre Langfuse automaticamente)
8. **Política de Privacidade v2** (`Privacy-Policy-v2-draft.md` §7) + **consent UI destacado** (`InternationalTransferConsent` componente DEV-2) declaram uso de Langfuse e EU jurisdiction
9. **Auditoria SOC 2 Type II** Langfuse — relatório anual arquivado em `12-compliance/evidence/langfuse-soc2/`
10. **Não há venda nem compartilhamento comercial** dos dados pelo Langfuse (DPA proibe explicitamente)
11. **No-PII guarantee técnica** validada por testes automatizados em cada release; CI gate DEV-7 bloqueia merge se filter for removido acidentalmente
12. **Fail-closed em redaction error** — se `redactForObservability` lançar exceção, payload é substituído por `[REDACTION_FAILED]` em vez de enviado raw (testado em CI)

### Quadro de ponderação

| Lado | Peso |
|------|------|
| **Interesse Anipis** (observabilidade de LLM = segurança das Júlias = dever de cuidado em saúde mental) | ALTO |
| **Direito do titular** (privacidade de conteúdo terapêutico) | **ALTO** |
| **Mitigação técnica + EU hosting + retenção 14d + DPA + SCC + opt-out + consent destacado** | ALTO |
| **Risco residual ao titular** | BAIXO-MÉDIO |

### Conclusão Balancing Test

Interesse legítimo da Anipis **prevalece** sobre o risco residual ao titular, **CONDICIONADO** ao conjunto robusto de salvaguardas técnicas (filter PII pré-flush, EU hosting, retenção curta) e contratuais (DPA + SCC + consent destacado + opt-out).

**Atenção:** Esta LIA é mais delicada que a do Sentry porque o conteúdo terapêutico é por natureza sensível. Caso `scrubFreeText` regrida ou EU hosting mude, **LIA deve ser revisada antes da próxima release.**

---

## D. CONCLUSÃO

O tratamento de dados via Langfuse para fins de observabilidade de LLM da Plataforma Anipis **se justifica sob Art. 7º, IX LGPD**, **condicionado** à manutenção de:

1. Filter `scrubFreeText` ativo e testado
2. `hashUserId` ativo
3. EU hosting (não migrar para US)
4. Retenção máxima 14d Tier Pro
5. Consent UI destacado no onboarding
6. Opt-out operacionalizado

- **Purpose Test:** ✅ Aprovado
- **Necessity Test:** ✅ Aprovado
- **Balancing Test:** ✅ Aprovado **condicional** — risco residual baixo-médio dado salvaguardas

Esta LIA será revisada **anualmente** ou a cada **alteração material** no produto (especialmente: mudança em sampling, em retenção, em hosting region, em filter PII, em modelo LLM, em volume de traces).

Em caso de qualquer mudança nos itens 1-6 acima (condicionantes), **executar nova LIA antes** de aplicar a alteração em produção.

---

## E. Direito de Informação ao Titular

Conforme Art. 9º LGPD, o titular será informado antes da primeira coleta (Cláusula 7.1 c.bis SCC ANPD Res. 19/2024):

- (i) Identidade do operador (Langfuse GmbH, Berlin, Alemanha — Tier Pro EU Frankfurt)
- (ii) Finalidade (observabilidade técnica de LLM)
- (iii) Base legal (interesse legítimo Art. 7º IX)
- (iv) Categorias de dados (prompts/completions filtrados, métricas técnicas)
- (v) Retenção (14 dias)
- (vi) Jurisdição (Alemanha, regime equivalente GDPR/LGPD)
- (vii) Direito de oposição (Art. 18 §2 LGPD)
- (viii) Canal: `security@anipis.com.br`

---

## F. Histórico de revisões

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 18/Mai/2026 | Squad legal AIOS (draft) + DPO interim (assinatura) | Versão inicial |
| 1.1 | 19/Mai/2026 | Squad legal AIOS (review) | Reforçada referência a `redactForObservability` (filter real, não `scrubFreeText` legado); CI gate DEV-7 fail-closed mencionado; alinhada com consent UI DEV-2 (categoria `international_transfer`) + Privacy Policy v2 draft; SCC v2 referenciado. Pendente assinatura DPO interim. |

---

**Assinatura DPO interim:**

Breno Cerqueira — DPO interim ANIPIS
Data: ____/____/2026
Assinatura: ________________________________

**Disclaimer:** Documento orientativo redigido pelo squad legal AIOS (Lucia Savage + Ann Cavoukian + Bruce Schneier). Não substitui revisão pelo escritório Patricia Peck Advocacia antes da assinatura final pelo DPO interim. Documento sujeito à apreciação ANPD em eventual audit (Art. 23 §2 LGPD).
