# SCCs ANPD Res. 19/2024 — Subprocessor Compliance Checklist

**P0 #16 (Lucia Savage spec)** — Standard Contractual Clauses para transferência internacional de dados pessoais sob LGPD Art. 33 + Resolução ANPD 19/2024.

**Status global:** 🔴 PENDING — requer assinatura founder + revisão OAB SP/RJ
**Deadline:** 28/Mai/2026 (bloqueio Closed Beta 30/Mai/2026)
**Owner code-side:** ✅ Disclosure técnico completo (export user data, privacy policy stub)
**Owner legal:** Founder + escritório OAB ainda a contratar (anipis-cofounder-search pendente clinical+legal)

---

## 1. Resumo regulatório

**LGPD Art. 33** — Transferência internacional só permitida quando o país destinatário oferece grau de proteção equiparável OU há cláusulas-padrão contratuais aprovadas pela ANPD.

**Resolução ANPD 19/2024** — Aprovou as Cláusulas-Padrão Contratuais (SCCs) brasileiras com 3 módulos:
- **Módulo 1:** Controlador-controlador (C2C)
- **Módulo 2:** Controlador-operador (C2P) ← **APLICÁVEL** em todos os 6 subprocessadores Anipis
- **Módulo 3:** Operador-suboperador (P2P)

**Sanção Art. 52:** Até 2% do faturamento, R$ 50MM teto por infração. Para B2C de saúde mental: dano reputacional é existencial mesmo com sanção financeira nominal.

---

## 2. Matriz de 6 Subprocessadores

| # | Subprocessador | SDK / Endpoint | Jurisdição | Dado tratado | Retenção | Status SCC | Action item |
|---|---|---|---|---|---|---|---|
| 1 | **Supabase** | `@supabase/supabase-js` 2.47 | US (AWS us-east-1) | Toda a base de dados Anipis (PII completa: nome, email, mensagens, mood, crises, journal) | Indefinida + PITR 7d | 🟡 DPA pública + SCC EU disponível, ANPD-specific pending | **Founder:** confirmar tier (Pro mínimo p/ SCC), assinar BAA + DPA, anexar SCC Módulo 2 ANPD |
| 2 | **Anthropic** | `@anthropic-ai/sdk` 0.32 | US | Mensagens de usuária com PII *removida via output-filter* antes do envio | ZDR contratual (zero retention) | 🟡 ZDR enterprise contract disponível, ANPD-SCC ainda não publicado pela vendor | **Founder:** subscrever Anthropic Enterprise com Zero Data Retention; anexar SCC Módulo 2 ANPD em adendo bilateral |
| 3 | **OpenAI** | `openai` 4.73 | US | Embeddings + LLM calls com PII pre-stripped | ZDR via API enterprise; default API retém 30d | 🟡 ZDR DPA disponível, ANPD-SCC pendente vendor | **Founder:** ativar OpenAI Zero Retention via dashboard + assinar DPA; anexar SCC Módulo 2 ANPD em adendo |
| 4 | **Sentry** | `@sentry/node` 8.40 | US (saas-us.sentry.io) | Stack traces + metadata (PII filtrada via `beforeSend` hook configurado) | 90d default | 🟡 Sentry DPA + EU SCCs disponíveis | **Founder:** assinar Sentry DPA + anexar SCC Módulo 2 ANPD; **DevOps:** verificar `beforeSend` filtra emails/userIds (audit code) |
| 5 | **Upstash Redis** | `@upstash/redis` 1.34 | Global edge (AWS regions, default us-east-1) | Rate-limit counters + cache PII *temporária* (TTLs ≤ 15min: tokens, session state) | TTL-bounded (≤ 24h em qualquer caso) | 🟡 Upstash GDPR DPA disponível, ANPD-SCC pendente | **Founder:** assinar Upstash DPA + anexar SCC Módulo 2 ANPD; **DevOps:** pinned region eu-west-1 ou aws-sa-east-1 para reduzir cross-border |
| 6 | **Langfuse** | `langfuse` 3.38 | EU (cloud.langfuse.com Frankfurt) — preferred | Traces de chamadas LLM com prompt completo (pre-stripped antes de chegar aqui) | Configurável (default 60d, redução para 14d via tier) | 🟢 EU jurisdiction reduz exposure ANPD; SCC bilateral via Langfuse Pro | **Founder:** confirmar tier Pro (não free com no-DPA), reduzir retention para 14d, assinar DPA |

**Legenda status:**
- 🔴 Sem DPA assinado
- 🟡 DPA vendor disponível mas Anipis ainda não assinou + SCC ANPD-específico pendente
- 🟢 SCC + DPA assinados e arquivados

---

## 3. Modelo de SCC Módulo 2 (Controlador-Operador) — Estrutura mínima ANPD

Conforme Resolução ANPD 19/2024 Anexo II, o contrato deve conter pelo menos:

1. **Definições** (titular, controlador, operador, transferência internacional, dados pessoais sensíveis)
2. **Objeto e finalidade** específica da transferência
3. **Categorias de dados pessoais e categorias de titulares**
4. **Obrigações do operador no destinatário:**
   - Tratar apenas conforme instruções do controlador
   - Garantir confidencialidade
   - Implementar medidas técnicas e organizacionais (Art. 46 LGPD)
   - Não recorrer a suboperador sem autorização (escrita ou geral)
   - Cooperar com ANPD em qualquer auditoria
5. **Direitos dos titulares** — possibilidade de exercer Art. 18 (acesso, correção, exclusão, portabilidade, oposição)
6. **Notificação de incidente** — operador notifica controlador em prazo razoável (recomenda-se 24-48h)
7. **Subprocessadores autorizados** — lista anexa atualizável
8. **Rescisão e devolução/eliminação** dos dados ao término do contrato
9. **Lei aplicável** — LGPD + lei brasileira; foro Brasil ou arbitragem com sede no Brasil
10. **Cooperação com ANPD** — autoridade controladora pode ser informada/auditar

---

## 4. Checklist Founder + OAB

### 4.1 Pré-assinatura (founder + advogado OAB)

- [ ] **Founder:** contratar advogado OAB SP ou RJ com experiência LGPD + cross-border (sugestões: Patricia Peck, BMA Compliance, Mattos Filho). Custo estimado R$ 5-15k para review do pacote completo.
- [ ] **OAB:** revisar este checklist + matriz §2 contra estado atual dos 6 contratos.
- [ ] **OAB:** redigir SCC Módulo 2 ANPD-template em PT-BR para anexar a cada vendor DPA existente.
- [ ] **OAB:** redigir adendo de "subprocessor agreement" para usar com cada vendor.

### 4.2 Por subprocessador (execução)

#### Supabase
- [ ] Confirmar tier Pro (Free não tem DPA assinável)
- [ ] Solicitar DPA via support@supabase.io
- [ ] Anexar SCC Módulo 2 ANPD em adendo bilateral
- [ ] Habilitar 2FA na conta + audit logs
- [ ] Arquivar PDF assinado em Google Drive `Anipis > Legal > SCCs`

#### Anthropic
- [ ] Solicitar Enterprise tier com Zero Data Retention
- [ ] Receber + assinar Anthropic DPA + BAA (BAA não aplicável LGPD mas alinha)
- [ ] Adicionar adendo bilateral com SCC Módulo 2 ANPD em PT-BR (negociar via Anthropic legal)

#### OpenAI
- [ ] Ativar "Zero Retention" no painel OpenAI API
- [ ] Solicitar DPA via privacy@openai.com
- [ ] Adendo bilateral SCC ANPD

#### Sentry
- [ ] Assinar DPA Sentry (disponível download direto sentry.io/legal)
- [ ] Adendo SCC ANPD
- [ ] **DevOps audit:** confirmar `Sentry.init({ beforeSend: ... })` redige PII (procurar por userId, email, message content)

#### Upstash
- [ ] Assinar Upstash DPA (download direto upstash.com/legal)
- [ ] Considerar redeploy em região eu-west-1 ou aws-sa-east-1 para minimizar transferência internacional (custo ~$0)
- [ ] Adendo SCC ANPD

#### Langfuse
- [ ] Upgrade tier Pro (free não tem DPA)
- [ ] Reduzir retention para 14d (custo similar)
- [ ] Assinar Langfuse DPA (jurisdição EU — facilita)
- [ ] SCC ANPD bilateral

### 4.3 Pós-assinatura (founder + DPO interim)

- [ ] Manter inventário atualizado em planilha `Anipis-Subprocessors-Inventory.xlsx` (Google Drive)
- [ ] Atualizar `privacy-policy.md` §9 (subprocessadores) com:
  - Lista dos 6 com jurisdição
  - Link público para DPA de cada vendor
  - Declaração SCC Módulo 2 ANPD em vigor
  - Direito do titular de objetar a transferência internacional (Art. 33 §IV LGPD)
- [ ] Atualizar exportUserData — bloco `avisoSubprocessadores` já está implementado (P0 #14), mas validar texto após SCCs assinadas
- [ ] Notificar usuárias Closed Beta (20 Júlias) via email + in-app prompt sobre transferência internacional ANTES do primeiro uso (consent explícito Art. 33 + Art. 8 §1)

---

## 5. Quick-wins até 28/Mai (founder solo, sem OAB)

Se o advogado não estiver contratado a tempo (alto risco de slip), o founder pode minimizar exposure assim:

1. **Habilitar Zero Data Retention em todos os 6** (Anthropic Enterprise, OpenAI ZRT, Sentry beforeSend, Upstash TTL-only, Langfuse 14d, Supabase Pro)
2. **Assinar todos os DPAs públicos pré-existentes** (Supabase, Sentry, Upstash, Langfuse, OpenAI standard) — não substituem SCC ANPD mas reduzem exposure
3. **Migrar Upstash para região São Paulo** (`aws-sa-east-1` se disponível, senão `eu-west-1`) — elimina cross-border para o cache mais barulhento
4. **Atualizar privacy-policy stub** com disclosure honesto: *"Estamos em processo de assinatura de SCCs ANPD Res. 19/2024 com os 6 subprocessadores listados. Até a conclusão (target 30/Jun/2026), aplicamos os DPAs vendor-padrão + Zero Data Retention onde disponível."*
5. **Notification email pré-Beta:** "Antes de você começar a usar a Anipis, queremos te contar que algumas das ferramentas que usamos para te atender melhor (IA, monitoramento de erros) rodam nos EUA. Estamos no processo de formalizar contratos brasileiros (SCCs) com cada uma delas. Você pode ler mais em [link]. Topa começar?"

Razão: postpone Closed Beta launch por 30 dias é PIOR que launch com SCCs em progresso + transparência total. *Honesty is the best policy* (Lucia, mantra deste P0).

---

## 6. Riscos residuais documentados

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| ANPD audit no Closed Beta | Baixa (sem reclamação trigger) | Alto (suspensão operação) | Quick-wins §5 + transparency disclosure |
| Reclamação titular sobre transferência | Média | Médio | exportUserData inclui `avisoSubprocessadores` (P0 #14 já implementado) |
| Vendor recusa SCC ANPD bilateral | Média (Anthropic/OpenAI são US) | Baixo | DPA vendor + ZDR ainda atende Art. 33 II "garantias específicas" |
| OAB cobrar > orçamento | Média | Baixo | Patricia Peck cobra ~R$ 10k para review pacote completo; aceitável |
| Founder esquecer renovação DPAs | Alta a 12m | Médio | Calendar reminder 30d antes vencimento + agente AIOS check |

---

## 7. Próximos passos imediatos (próximas 72h)

1. **18-19/Mai:** Founder contata 2-3 advogados OAB, obtém orçamentos. Patricia Peck primeira escolha (LGPD reputation).
2. **20/Mai:** Founder + advogado kickoff. Compartilha este checklist como brief.
3. **21-23/Mai:** Iniciar processos vendor (DPA + Enterprise tiers Anthropic/OpenAI + Supabase Pro confirmation).
4. **24-26/Mai:** OAB redige SCC Módulo 2 ANPD-template + adendos bilaterais.
5. **27-28/Mai:** Assinaturas. Arquivo Drive. Atualizar privacy-policy.md.
6. **29/Mai:** Smoke test pré-Beta com toda configuração final.
7. **30/Mai:** Closed Beta launch.

Se slip:
- **Alt A (recomendado):** Launch dia 30/Mai com disclosure transparente "SCCs em finalização" + ZDR ativo. Honestidade compatível com Lucia spec.
- **Alt B:** Adiar Closed Beta para 7/Jun. Custo: 1 semana de feedback Júlias perdido.

---

**Resolution status code-side:** ✅ COMPLETO (este doc + exportUserData disclosure + privacy-policy stub apontando aqui)
**Resolution status legal-side:** 🔴 Bloqueado em founder action (contratar OAB)

> *— Orion, com base na spec de Lucia Savage (P0 #13/16) ⚖️*
