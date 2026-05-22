# DPIA v1 — Anipis Closed Beta AI

**Documento:** Relatório de Impacto à Proteção de Dados Pessoais (RIPD/DPIA)
**Versão:** v1.0 — 2026-05-17
**Status:** DRAFT EXECUTIVO — pendente revisão e assinatura advogado OAB-SP/RJ antes do release de Closed Beta em 2026-05-30
**Autora do draft:** Lucia Savage (Health Privacy & Regulatory Strategy, ex-Omada Health, ex-ONC/HHS) — convidada como senior advisor pré-Beta
**Próxima revisão obrigatória:** 2026-06-13 (gate pós-Closed Beta) ou imediatamente após qualquer incidente reportável

---

> "It all goes back to a fundamental question — *how does this app make money?* Anipis says: subscription, no data monetization, no advertising. That's the right answer. Now we have to prove the data architecture matches the promise, because **honesty is non-negotiable** and once it's out there, it's pretty hard to get it back."
> — Lucia Savage, opening note

---

## 1. Identificação (LGPD Art. 38; Res. ANPD nº 4/2023, art. 4º, II)

| Campo | Conteúdo |
|---|---|
| **Controlador (Controller)** | [PLACEHOLDER — completar com advogado] Pessoa física: **Breno de Cerqueira**, CPF [PLACEHOLDER]. Operando enquanto MEI/ME [PLACEHOLDER razão social, CNPJ]. Endereço de notificação: [PLACEHOLDER]. |
| **Encarregado de Proteção de Dados (DPO / Data Protection Officer)** | **DPO interim:** founder (Breno de Cerqueira). E-mail de contato: `dpo@anipis.com.br` (a provisionar). **LIMITE TEMPORAL DESTA SOLUÇÃO:** até o primeiro de — (a) 100 usuários ativos mensais; (b) primeiro contrato corporativo (B2B / NR-1 / convênio); (c) primeiro incidente reportável; (d) 12 meses pós-Beta. Após qualquer um desses gatilhos, **transição mandatória** para DPO externo fracionário. |
| **Operadores (Operators / Processors) — subprocessadores em escopo** | **Supabase Inc.** (Auth + Postgres + Storage; infraestrutura US, multi-region). **OpenAI, L.L.C.** (LLM inference; US). **Anthropic PBC** (LLM inference; US). **Vercel Inc.** (frontend/API hosting; edge global). **Functional Software, Inc. d/b/a Sentry** (error monitoring; US). **Upstash Inc.** (Redis cache; multi-region). |
| **Versão do DPIA** | v1.0 — pré-release Closed Beta AI |
| **Validade declarada** | Válido até o primeiro de: (a) primeiro contrato corporativo, (b) 1.000 MAU, (c) mudança material no data flow (novo subprocessador, nova categoria de dado, expansão geográfica), (d) decisão judicial/regulatória da ANPD impactando IA em saúde mental. |
| **Categoria do tratamento** | **Tratamento de dados pessoais sensíveis de saúde mental por sistema de IA conversacional, sem facilitadora humana on-loop durante o Closed Beta de 14 dias** (20 participantes — "Júlias"). Clinical advisor pro-bono (CRP ativo) monitora logs somente para *post-hoc review*, sem intervenção em tempo real. |
| **Janela regulatória relevante** | CFM 2.454/2026 entra em enforcement em ago/2026 — DPIA v2 deverá refletir requisitos finais. Janela útil pré-enforcement de aproximadamente 90 dias. |

---

## 2. Descrição do Tratamento (Art. 6, X e Art. 38 LGPD)

### 2.1 Finalidade (Art. 6, I — Finalidade Legítima)

O Anipis Closed Beta AI tem como **finalidade legítima específica** o oferecimento de suporte conversacional psicoeducacional baseado em IA — modulado por técnicas de TCC (Terapia Cognitivo-Comportamental), DBT (Terapia Comportamental Dialética) e ACT (Terapia de Aceitação e Compromisso) — para 20 usuárias selecionadas ("Júlias"), durante 14 dias, com o objetivo de:

(a) validar segurança clínica das salvaguardas (crisis protocol, output filter de 7 estágios, age gate, hash chain do audit trail);
(b) coletar evidência empírica para o gate de decisão **Beta-aberto vs. pivot**;
(c) gerar dados estruturados para *post-hoc clinical review* pelo clinical advisor CRP.

**Não-finalidades — explicitamente vedadas neste tratamento:**
- Monetização direta ou indireta de dados de saúde mental;
- Publicidade comportamental;
- Compartilhamento com seguradoras, planos de saúde, RH corporativo, plataformas de redes sociais ou data brokers;
- Treinamento de modelos de terceiros (OpenAI, Anthropic) com conteúdo das conversas — **toda chamada API deve usar endpoints com `data retention = zero` / opt-out de treinamento** (verificar BAA / DPA específico antes do Beta).

> *Lucia note:* "There's no rule that says you can't sell sensitive health data to a malevolent actor once it's out there. The fact that *we* won't doesn't matter to the consumer — what matters is the data architecture and the contracts. Get the OpenAI Zero Data Retention and Anthropic equivalent DPA signed **before** the first Júlia logs in."

### 2.2 Base Legal

| Categoria de dado | Base legal LGPD | Justificativa |
|---|---|---|
| Dados pessoais (e-mail, nome de exibição, IP) | **Art. 7, I — Consentimento** | Coletado via fluxo de onboarding com versionamento (`consents` table, imutável). |
| Dados pessoais sensíveis de saúde (conteúdo das conversas, mood, crisis events, assessments PHQ-9/GAD-7) | **Art. 11, I — Consentimento específico e em destaque, para finalidades específicas** | Consentimento granular por categoria (`granular_consents` table, append-only). 5 categorias: `profile_data`, `conversation_content`, `mood_data`, `crisis_data`, `ai_processing`. Categorias `profile_data` e `ai_processing` são obrigatórias — sem elas o serviço não funciona; categorias `conversation_content`, `mood_data`, `crisis_data` são revogáveis. |
| Dados de menores | **NÃO APLICÁVEL** no Beta | Age gate 18+ enforced via `profiles.birth_date` + `age_verified_at` (Story SAI-201). Beta exclui menores explicitamente. |
| Dados de terceiros (contatos de emergência) | Art. 7, IX (legítimo interesse para proteção da vida) + Art. 11, II, "f" (proteção da vida ou incolumidade física do titular) | Documentar em Privacy Policy. |
| Audit trail (`audit_events`, `crisis_events`, `consents`) | **Art. 7, II — Cumprimento de obrigação legal/regulatória** + **Art. 16, II — Comprovação de cumprimento de obrigações** | Retenção 5 anos justificada pelas normas de saúde + LGPD Art. 16, II (comprovação de cumprimento). |

> *Lucia note — sobre base legal dupla:* "I've never not found an answer about how to do this right. The LGPD gives you Art. 11 §2º, 'a' (consentimento) and 'f' (proteção da vida ou incolumidade física). Use both — consent for the routine flow, protection-of-life for the crisis flow. This is the *road sign* that tells you crisis routing doesn't need consent to fire, but routine conversation does."

### 2.3 Categorias de Dados Tratados (6 categorias detalhadas)

**Categoria A — Dados de identificação e autenticação**
Campos: `auth.users.id` (UUID Supabase), `auth.users.email`, `profiles.display_name`, `profiles.birth_date`, `profiles.age_verified_at`, `consents.ip_address`, `consents.user_agent`. *Volume estimado Beta:* 20 registros únicos.

**Categoria B — Dados sensíveis de saúde mental — conteúdo conversacional**
Campos: `messages.content` (texto livre — RISCO MÁXIMO), `messages.inferred_mood`, `messages.depression_signal`, `conversations.summary`, `conversations.mood_start/end`, `conversations.risk_level`. *Volume estimado Beta:* 20 usuárias × ~14 dias × ~3-5 sessões/semana × ~15-30 mensagens/sessão = **~12.000-30.000 mensagens** contendo conteúdo sensível.

**Categoria C — Dados sensíveis de avaliação clínica estruturada**
Campos: `assessment_results.score`, `severity`, `responses` (PHQ-9, GAD-7, WEMWBS), `mood_checkins.*`, `exercises.data`, `journal_entries.content`. Estes são equivalentes funcionais de instrumentos clínicos padronizados — tratamento merece o mesmo cuidado que registro em prontuário.

**Categoria D — Dados sensíveis de detecção e resposta a crise**
Campos: `crisis_events.classifier_output`, `responseGiven`, `interventions`, `contributingFactors` (XAI factors — Story SAI-406), `riskLevel`. **Imutáveis por design** — append-only, nunca deletados, mesmo em pedido de exclusão (anonimizados via tombstone UUID).

**Categoria E — Dados de auditoria algorítmica (algorithmic liability)**
Campos: `audit_events.*` incluindo SPIKE-1 hash chain (`prev_hash`, `current_hash`, `hash_algorithm`) e SPIKE-3 model metadata (`model_card_version`, `prompt_hash`, `embedding_model_id`, `data_quality_flag`). Esta categoria é a evidência de que o sistema decidiu *o que decidiu, por quê, com qual modelo, e que não foi adulterada*. Crítica para defesa regulatória futura.

**Categoria F — Dados de terceiros**
Campos: `emergency_contacts.name`, `phone`, `relationship`. **PII de terceiros** que não consentiram diretamente — base legal Art. 7, IX e Art. 11, II, "f". Notificação ao terceiro deve ocorrer no momento em que for efetivamente acionado, com registro no audit trail.

> *Lucia note — sobre categoria E:* "This is where Anipis is doing something genuinely sophisticated. The SPIKE-1 hash chain means that if anyone — including the founder — ever modifies a row in `audit_events`, the chain breaks and `verify_audit_chain()` will catch it. That's not just good engineering; it's **algorithmic liability infrastructure**. When the ANPD or a CFM ethics committee asks 'how do we know what your AI actually told a patient on May 30th at 11:47 PM?', you can prove it cryptographically. Most digital health companies in the US can't do that. Document it prominently in your DPIA — it's a material mitigation."

---

## 3. Data Flow Map (LGPD Art. 37; Res. ANPD 19/2024)

### 3.1 Descrição Narrativa do Fluxo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ JÚLIA (titular) — Brasil, ambiente residencial, dispositivo pessoal         │
│   ↓ HTTPS / TLS 1.3                                                          │
│                                                                              │
│ [1] App PWA (Next.js / Vercel Edge — POPs globais, possíveis nos EUA)        │
│   ↓                                                                          │
│                                                                              │
│ [2] Supabase Auth (US-East / US-West, sessão JWT)                            │
│   ↓                                                                          │
│                                                                              │
│ [3] Backend Fastify (Node.js, Vercel Functions ou container)                 │
│   │                                                                          │
│   ├─ [3a] consent-check middleware → consulta granular_consents (Supabase)   │
│   │       FAIL-CLOSED em erro: 503 (LGPD Art. 11 enforcement)                │
│   │                                                                          │
│   ├─ [3b] safety classifier pré-LLM → audit_events (record + hash chain)     │
│   │                                                                          │
│   ├─ [3c] pii-stripper.ts → substitui CPF/EMAIL/TELEFONE/ENDERECO/NOME/      │
│   │       DATA_NASCIMENTO por tokens descritivos ANTES da chamada LLM         │
│   │                                                                          │
│   ├─ [3d] LLM call (HTTPS) ─────────────► OpenAI L.L.C. (US-East)            │
│   │                                       OR Anthropic PBC (US-East)         │
│   │                                       *Endpoint: Zero Data Retention*    │
│   │                                       *Bandeira: opt-out training*       │
│   │                                                                          │
│   ├─ [3e] output filter (7 estágios) → intercepta hallucination clínica,     │
│   │       prompt injection, claims diagnósticos, conteúdo nocivo             │
│   │                                                                          │
│   ├─ [3f] crisis detection → crisis_events (immutable) +                     │
│   │       crisis-protocol-service.ts (bypassa autonomy dial — Art. 11 II,f) │
│   │                                                                          │
│   └─ [3g] audit_events flush (a cada 10 eventos OR 5s) — hash chain          │
│       SPIKE-1 sha256(prev_hash || canonical_repr) — verificável              │
│   ↓                                                                          │
│                                                                              │
│ [4] Supabase Postgres (US, multi-AZ, encryption at rest AES-256)             │
│   │  Tabelas em jogo: profiles, conversations, messages, mood_checkins,      │
│   │  assessment_results, exercises, journal_entries, crisis_events,          │
│   │  audit_events, consents, granular_consents, deletion_requests,           │
│   │  emergency_contacts, knowledge_chunks                                    │
│   ↓                                                                          │
│                                                                              │
│ [5] Response back to App PWA (resposta filtrada + safe)                      │
│                                                                              │
│ [6] Sentry (US) — error logs sem PII (PII keys redacted em sanitizeContext)  │
│ [7] Upstash Redis (US/multi-region) — cache de sessão/rate limit, TTL curto  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Mapa Tabular de Transferências Internacionais (Cross-Border Transfers)

| # | Operador | País destino | Categorias de dado transferidas | Volume estimado Beta (14d) | Base legal de transferência | Status SCC ANPD Res. 19/2024 |
|---|---|---|---|---|---|---|
| 1 | Supabase Inc. | USA (Oregon / Virginia) | A, B, C, D, E, F (todas) | ~30.000 registros | Art. 33, I (cláusulas-padrão contratuais — SCCs) | **PENDENTE — verificar DPA Supabase + assinar SCC ANPD Res. 19/2024 antes do Beta** |
| 2 | OpenAI L.L.C. | USA | B (conteúdo de mensagem) **APÓS pii-stripping** | ~30.000 chamadas API | Art. 33, I (SCCs) + Art. 33, V (consentimento específico do titular) | **PENDENTE — assinar OpenAI DPA + Zero Data Retention agreement** |
| 3 | Anthropic PBC | USA | B (conteúdo de mensagem) **APÓS pii-stripping** | (se fallback) | Art. 33, I + Art. 33, V | **PENDENTE — assinar Anthropic DPA + opt-out training** |
| 4 | Vercel Inc. | USA + edge global (incl. Brasil) | A (sessão/IP), B (em trânsito apenas) | Volátil | Art. 33, I | **PENDENTE — verificar Vercel DPA** |
| 5 | Functional Software (Sentry) | USA | E (metadados de erro — PII filtrada) | Baixo | Art. 33, I | **PENDENTE** |
| 6 | Upstash Inc. | USA / multi-region | Cache volátil (sem persistência longa) | Volátil | Art. 33, I | **PENDENTE** |

> *Lucia note — sobre **regime boundary** crítico:* "Esta é a fronteira mais delicada do Anipis. Os dados de saúde mental de cidadãs brasileiras saem do Brasil em centenas de milhares de chamadas API. Sob LGPD Art. 33, a transferência internacional precisa de **base legal específica** — não é coberta automaticamente pelo consentimento Art. 11. A Res. ANPD 19/2024 (cláusulas-padrão contratuais) entrou em vigor para preencher exatamente este buraco. **Assinatura das SCCs com cada um dos 6 subprocessadores é pré-condição para o Beta**. Se não estiver assinado em 30/Mai, ou o Beta atrasa, ou o tratamento é ilegal. *Não há um terceiro caminho.*"

### 3.3 Patchwork Gap Analysis (regime boundary check)

**Boundary 1 — Júlia → App PWA → Backend (Brasil → US):** atravessa fronteira de soberania. Mitigação: TLS 1.3, JWT curto, age gate.

**Boundary 2 — Backend → LLM provider (US → US, mas com dados de cidadã brasileira):** atravessa fronteira de *controle do controlador*. Mitigação: pii-stripper.ts antes da chamada + Zero Data Retention contractual.

**Boundary 3 — Backend → Sentry (telemetria):** historicamente vetor de vazamento acidental de PII via stack traces. Mitigação: `sanitizeContext()` em audit-trail.ts redacta 9 chaves PII conhecidas.

**Boundary 4 — Backend → Upstash Redis (cache):** dados voláteis mas potencialmente sensíveis. Mitigação: TTL curto + encryption in transit, **TODO verificar encryption at rest**.

**Boundary 5 — Audit log → exportação para advogado / autoridade:** quando o audit_events sair do Brasil pelo founder enviando export por e-mail, atravessa boundary. Mitigação: pseudonimização do userId em exports externos (já documentado em audit-trail.ts comments).

---

## 4. Avaliação de Necessidade e Proporcionalidade (Art. 6, III — Necessidade; Art. 6, IV — Livre Acesso; Art. 6, VI — Transparência)

### 4.1 Por que dados sensíveis de saúde são necessários

A finalidade do serviço *é* o suporte psicoeducacional em saúde mental. **Sem o tratamento de dados sensíveis de saúde, não há serviço.** O tratamento é portanto *intrínseco* à finalidade, não acessório. A questão relevante não é "se" tratar, mas "como minimizar dentro da necessidade".

### 4.2 Princípio da Minimização (Art. 6, III)

| Medida | Implementação | Localização técnica |
|---|---|---|
| Stripping de PII antes da chamada LLM | 6 tipos de PII brasileira detectados/substituídos por tokens descritivos | `pii-stripper.ts` |
| Audit log nunca armazena PII bruta | `sanitizeContext()` redacta 9 chaves conhecidas | `audit-trail.ts:700-718` |
| Crisis_events armazena `classifier_output` mas não a mensagem original | Design da tabela (Story SAI-013) | `schema.ts:172-186` |
| pii_audit_log armazena tipo+contagem, nunca valor | Retenção 90 dias | `schema.ts:328-336` |
| Embedding model id explicitamente rastreado | SPIKE-3 Atul — permite drift detection | `schema.ts:389-390` |

### 4.3 Justificativa da Retenção de 5 Anos para Audit Trail

A retenção de 5 anos do `audit_events` (vs. 2 anos recomendados em `data-map.md` para `messages`) baseia-se em:

- **CFM 2.454/2026** (quando entrar em enforcement) — equivalência com retenção de prontuário psicoterápico (Res. CFM/CFP equivalente: 20 anos para prontuário clínico formal; 5 anos é piso prudente para sistema não-clínico que pode ser reclassificado);
- **LGPD Art. 16, II** — comprovação de cumprimento de obrigações legais ou regulatórias;
- **Algorithmic liability** — em caso de litígio futuro (autoridade regulatória, processo cível, processo do titular), o controlador precisa demonstrar **o que o sistema fez e por quê**, não apenas que tinha consentimento.

> *Lucia note:* "Five years is the right floor for AI-mediated mental health interaction. It survives the typical statute of limitations for consumer civil claims in Brazil (Código de Defesa do Consumidor, Art. 27 — 5 anos para reparação de danos), gives you margin for ANPD investigations (sem prazo fixo, mas tipicamente <3 anos), and aligns with how I'd argue this in a US enforcement action under FTC §5. *Don't go below 5.* You can extend per-row later if a CFM ruling requires it."

---

## 5. Identificação de Riscos (Res. ANPD 4/2023, art. 4º, IV)

Escala: **Probabilidade** (BAIXA / MED / ALTA) × **Impacto** (BAIXO / MED / ALTO) → **Risco Residual** após mitigação.

| # | Risco | Prob. | Impacto | Mitigação atual | Risco residual |
|---|---|---|---|---|---|
| **R-01** | **Alucinação clínica do LLM** — IA fornece informação clinicamente incorreta (ex.: dosagem de medicamento, diagnóstico, contraindicação) que causa dano físico ou psicológico à Júlia | MED | ALTO | Output filter 7 estágios; system prompt explícito anti-diagnóstico; clinical advisor pro-bono review pós-hoc; modelCardVersion + promptHash rastreáveis (SPIKE-3) | **MED** |
| **R-02** | **Prompt injection** — Júlia (ou ator malicioso usando conta de Júlia) consegue fazer o LLM ignorar safety guardrails e produzir conteúdo nocivo | MED | ALTO | Output filter pós-LLM (independente do input); audit_events grava decisão; rate limiting via Upstash | **MED** |
| **R-03** | **Tampering do audit trail** — modificação retroativa de `audit_events` para encobrir incidente, decisão errada do LLM, ou falha de crise | BAIXA | ALTO | SPIKE-1 hash chain sha256(prev_hash ‖ canonical_repr); `verify_audit_chain()` SQL function; cron semanal de verificação (a implementar) | **BAIXA** |
| **R-04** | **Falha do crisis routing** — sistema classifica risco como `green` quando real risco é `red`; Júlia em ideação suicida não recebe protocolo | MED | ALTO (vida) | Classifier pré-LLM + pós-LLM (double check); `escalate_crisis` action NUNCA gateada por autonomy dial (intent-preview.ts:152); crisis_events imutável; clinical advisor revisa semanalmente | **MED-BAIXA** |
| **R-05** | **Deletion incompleteness** — pedido de exclusão Art. 18 falha silenciosamente; dado permanece em backup, em audit_events com PII, ou em cache de LLM provider | MED | ALTO | account-deletion-service.ts com tx atômica; tombstone UUID determinístico; consents anonimizados (não deletados); SAI-SEC-03 HIGH-12 fix em order-of-operations; **GAP: backups Supabase precisam ter retenção alinhada** | **MED** |
| **R-06** | **Consent bypass** — usuária acessa funcionalidades sem consentimento granular válido | BAIXA | MED | consent-check middleware fail-CLOSED (403/503); TTL cache 5 min; required categories `profile_data` + `ai_processing` não podem ser revogadas (consent-service.ts:60-65) | **BAIXA** |
| **R-07** | **Cross-border transfer sem base legal** — dados enviados a OpenAI/Anthropic/Supabase US **antes** das SCCs Res. ANPD 19/2024 estarem assinadas | **ALTA hoje** | ALTO | **NENHUMA ainda** — risco aberto. Mitigação pendente: assinar 6 DPAs+SCCs antes de 2026-05-30 | **ALTO até resolvido — HARD BLOCKER do Beta** |
| **R-08** | **Founder solo DPO conflict of interest** — founder é controlador *e* DPO; em caso de incidente, decisão de notificar ANPD em 48h tem conflito estrutural | ALTA | MED | Cap temporal explícito (100 MAU / primeiro contrato / 12 meses); incident response plan documentado nesta DPIA (Seção 9); compromisso de transição para DPO externo Sprint 3 | **MED** |
| **R-09** | **Age gate bypass — menor de 18 acessa o serviço** | MED | ALTO (legal + reputacional) | `profiles.birth_date` + `age_verified_at` + `age_verification_method='date_of_birth_self_declared'` (Story SAI-201); Beta com seleção curada de 20 Júlias reduz risco drasticamente; **GAP: auto-declaração é fraca, considerar verification adicional pós-Beta** | **MED** |
| **R-10** | **Vazamento via Sentry / logs** — stack trace acidentalmente contém PII de mensagem | MED | MED | sanitizeContext() redacta 9 chaves; **GAP: validar com smoke test que stack traces de exceptions em LLM call não contêm o `messages.content` cru** | **MED** |
| **R-11** | **LLM provider retém dados para treinamento** apesar de Zero Data Retention contratual — risco contratual residual | BAIXA | ALTO | DPA específico + auditoria de chamadas API (header inspection); fallback Anthropic se OpenAI mudar políticas | **MED-BAIXA** |
| **R-12** | **Falha de notificação ao titular em incidente** — Art. 48 LGPD obriga comunicação à ANPD e ao titular em prazo razoável | BAIXA | ALTO | Incident Response Plan (Seção 9); 20 Júlias no Beta = listagem manual viável; e-mails de contato pré-validados | **BAIXA** |

> *Lucia note — R-07 é o show-stopper:* "Todo o resto eu posso defender em uma sala com advogado da ANPD. R-07 não. Sem as cláusulas-padrão Res. ANPD 19/2024 assinadas com cada subprocessador americano, o tratamento de dados sensíveis de cidadãs brasileiras nos EUA **não tem base legal**. Isso é Art. 33 sem o filtro do Art. 11. O Beta tem que esperar — ou as SCCs precisam ser assinadas. Não dá pra empurrar."

---

## 6. Medidas de Mitigação (Técnicas + Organizacionais)

### 6.1 Medidas Técnicas

| # | Medida | Localização | Status |
|---|---|---|---|
| MT-01 | PII stripping pré-LLM (6 tipos brasileiros) | `pii-stripper.ts` | IMPLEMENTADO |
| MT-02 | Output filter 7 estágios pós-LLM | `output-filter.ts` (referência) | IMPLEMENTADO |
| MT-03 | Audit hash chain SPIKE-1 (sha256, verificável) | `audit-trail.ts` + migration 20260516 | IMPLEMENTADO |
| MT-04 | Model metadata SPIKE-3 (model_card, prompt_hash, embedding_id, data_quality_flag) | `audit-trail.ts:172-225` + schema | IMPLEMENTADO |
| MT-05 | Consent check middleware fail-CLOSED (403/503) | `consent-check.ts` | IMPLEMENTADO |
| MT-06 | Granular consent append-only (5 categorias, 2 obrigatórias) | `consent-service.ts` + `granular_consents` | IMPLEMENTADO |
| MT-07 | Account deletion atomic tx + tombstone UUID determinístico | `account-deletion-service.ts` | IMPLEMENTADO |
| MT-08 | Age gate 18+ (date_of_birth + verified_at) | Story SAI-201 fields | IMPLEMENTADO |
| MT-09 | Crisis routing bypass de autonomy dial | `intent-preview.ts:152-160` | IMPLEMENTADO |
| MT-10 | Crisis events imutáveis (append-only) | `crisis_events` schema | IMPLEMENTADO |
| MT-11 | TLS 1.3 in transit + encryption at rest (Supabase default) | infraestrutura | A VALIDAR no DPA |
| MT-12 | Rate limiting + intent expiration | `intent-preview.ts:283-296` (cryptographically secure tokens) | IMPLEMENTADO |
| MT-13 | sanitizeContext() em audit logs (9 chaves PII) | `audit-trail.ts:700-718` | IMPLEMENTADO |
| MT-14 | verify_audit_chain() SQL function + plano de cron semanal | migration 20260516 | IMPLEMENTADO (cron PENDENTE) |
| MT-15 | Zero Data Retention contractual com OpenAI/Anthropic | DPA assinatura | **PENDENTE — P0 pré-Beta** |

### 6.2 Medidas Organizacionais

| # | Medida | Responsável | Status |
|---|---|---|---|
| MO-01 | DPO interim com cap temporal explícito + plano de sucessão (Seção 8) | Founder | DOCUMENTADO |
| MO-02 | Clinical advisor pro-bono CRP — post-hoc review semanal de crisis_events + amostragem aleatória de conversations | Clinical advisor + founder | A FORMALIZAR via convênio simples antes do Beta |
| MO-03 | Privacy Policy + Termos de Uso + Cookies Policy + DPA — review OAB-SP/RJ | Advogado externo | PENDENTE |
| MO-04 | SCCs Res. ANPD 19/2024 assinadas com 6 subprocessadores | Founder + jurídico | **PENDENTE — HARD BLOCKER** |
| MO-05 | Beta participants — termo de consentimento informado específico para pesquisa-piloto + opt-in para post-hoc review | Founder + clinical advisor | A REDIGIR |
| MO-06 | Incident response runbook + e-mail dpo@anipis.com.br + canal ANPD <https://www.gov.br/anpd/pt-br/canais_atendimento/> | Founder | A DOCUMENTAR (Seção 9) |
| MO-07 | Plano de submissão a CEP / Plataforma Brasil para a fase pós-Beta (RCT formal) | Clinical advisor + founder | PREVIEW (Seção 11) |
| MO-08 | Treinamento founder em LGPD básico (curso ANPD gratuito) | Founder | RECOMENDADO antes de Beta |
| MO-09 | Backup retention policy alinhada com deletion policy (gap R-05) | Founder + Supabase config | PENDENTE |
| MO-10 | Smoke test pré-Beta — gerar exceção em LLM call e verificar que Sentry não captura `messages.content` | QA | PENDENTE |

---

## 7. Direitos do Titular — Workflow Art. 18 LGPD

| Direito (Art. 18) | Endpoint API | SLA | UI Flow | Audit log |
|---|---|---|---|---|
| **I — Confirmação da existência de tratamento** | `GET /api/v1/me/data-processing-status` | <48h | Settings → Privacidade → "Meus dados sendo tratados" | `audit_events.eventType='data_exported'` (subtipo) |
| **II — Acesso aos dados** | `GET /api/v1/me/export` (chama `exportUserData`) | <15 dias (recomendado <72h) | Settings → Privacidade → "Baixar meus dados" | `audit_events.eventType='data_exported'` |
| **III — Correção de dados** | `PATCH /api/v1/me/profile` | imediato | Settings → Perfil | `audit_events` registra antes/depois (diff em `context`) |
| **IV — Anonimização, bloqueio ou eliminação de dados desnecessários** | `POST /api/v1/me/data-categories/:cat/revoke` | imediato (com exceção das 2 obrigatórias) | Settings → Privacidade → toggle granular | `granular_consents` append-only |
| **V — Portabilidade** | `GET /api/v1/me/export?format=json` (JSON pt-BR labels — já implementado) | <15 dias | Mesmo botão "Baixar meus dados" | logged |
| **VI — Eliminação dos dados pessoais tratados com consentimento** | `DELETE /api/v1/me/account` (chama `requestDeletion`) | 30d grace + hard delete | Settings → "Excluir minha conta" + double confirmation | `audit_events.eventType='data_deleted'` + `deletion_requests` tabela |
| **VII — Informação sobre compartilhamento** | `GET /api/v1/me/data-sharing` (listar subprocessadores ativos com finalidade) | imediato | Settings → Privacidade → "Com quem meus dados são compartilhados" | static — atualizar quando subprocessadores mudarem |
| **VIII — Informação sobre não-consentimento e consequências** | Privacy Policy + onboarding screen | n/a | Onboarding step 2/3 | versão de policy registrada em `profiles.bio_data.terms_version` |
| **IX — Revogação do consentimento** | `POST /api/v1/me/consent/revoke` | imediato (categorias não-obrigatórias) | Settings → Privacidade → "Revogar consentimento" | `granular_consents` row com `granted=false` + `revokedAt` |

> *Lucia note:* "**Honesty is the best policy.** The fact that revoking `ai_processing` consent means the service stops working should be communicated up front in the consent flow — not buried in fine print. Consumers deserve to see the trade-off clearly. We've got to be communicating in the way people actually communicate."

---

## 8. DPO Succession Plan (extensão da Seção 8 que cobri na consulta anterior — referencio aqui para integridade do documento)

### Fase A — Founder solo (HOJE → primeiro de: 100 MAU / 1º contrato corporativo / 12 meses pós-Beta)
- Cap aplicável **somente para Closed Beta B2C de 20 usuárias**.
- Conflict of interest mitigado por: (a) cap explícito; (b) clinical advisor CRP externo como segundo par-de-olhos clínico; (c) compromisso documentado de notificação ANPD em 48h sem filtro do controlador.

### Fase B — DPO Externo Fracionário (Sprint 3, target 2026-Q3)
- Candidatos: **Opice Blum**, **Baptista Luz**, **Demarest** (todos com practice ativa em healthtech + LGPD).
- Engagement 8-12h/mês inicial; expandível.
- Trigger forçado: qualquer um dos 4 caps da Fase A.

### Fase C — DPO Interno OU Clinical Co-Founder Dual-Role (pós-Series A ou pós-1.000 MAU)
- Senioridade C-level reportando ao board ou conselho consultivo.
- Independência funcional via reporte direto.

---

## 9. Incident Response Plan (LGPD Art. 48)

### 9.1 Trigger de Incidente Reportável
- Vazamento confirmado ou suspeitado de dados pessoais sensíveis;
- Falha de crisis routing em caso real (independente de dano materializado);
- Quebra do hash chain (`verify_audit_chain()` retorna `verified=false`);
- Pedido de exclusão Art. 18 falha permanentemente;
- Subprocessador notifica vazamento upstream (OpenAI, Anthropic, Supabase, etc.).

### 9.2 Workflow ANPD em 48h

```
T+0h      INCIDENTE DETECTADO (pelo founder, clinical advisor, ou alerta automático)
T+1h      Triagem inicial — confirma se é reportável (Art. 48, §1º)
T+2-6h    Forensics via:
            (a) verify_audit_chain() — confirma se audit trail íntegro
            (b) query audit_events para reconstruir sequência de decisões
            (c) export crisis_events e safety classifier outputs do período
T+12h     Comunicação interna — clinical advisor + DPO interim alinham resposta
T+24h     DRAFT notificação ANPD (template Res. ANPD 15/2024)
T+36h     Notificação aos titulares afetados via e-mail (max 20 Júlias no Beta = trivial)
T+48h     SUBMISSÃO ANPD via https://www.gov.br/anpd/pt-br/canais_atendimento/
          + cópia para advogado OAB
T+5d      Relatório completo + plano de remediação publicado internamente
T+30d     Post-mortem + DPIA update + lessons learned
```

### 9.3 Contato e Escalation
- **Founder/DPO interim:** Breno de Cerqueira — `dpo@anipis.com.br` (a provisionar) — telefone [PLACEHOLDER]
- **Clinical advisor (CRP ativo):** [PLACEHOLDER nome + CRP número + contato]
- **Advogado OAB:** [PLACEHOLDER nome + OAB número + contato] — *contratar antes do Beta*
- **ANPD canal:** <https://www.gov.br/anpd/pt-br/canais_atendimento/>

### 9.4 Forensics Toolkit
1. `SELECT verify_audit_chain(NULL, '<from>'::timestamptz, '<to>'::timestamptz);` — confirma integridade
2. `SELECT * FROM audit_events WHERE timestamp BETWEEN ... ORDER BY timestamp ASC` — sequência de decisões
3. `SELECT * FROM crisis_events WHERE user_id = '<uuid>' AND created_at > '<incident_time>'` — contexto de crise
4. Export do `exportUserData(userId)` em `account-deletion-service.ts` — dados completos da titular afetada
5. Hash log de modelCardVersion + promptHash do período — confirma qual configuração do sistema estava ativa

---

## 10. Review Cycle + Versionamento

| Trigger | Ação |
|---|---|
| **Programado:** 2026-06-13 (D+14 do Beta) | DPIA v2 — incorporar lições do Beta, dados empíricos de incidentes, revisão CFM 2.454/2026 (status enforcement) |
| **Programado:** 2026-08-XX (data de enforcement CFM 2.454/2026) | DPIA v3 — alinhamento final com CFM, possível submissão a CEP |
| **Forçado:** Incidente reportável | DPIA atualizada em até 30d pós-incidente |
| **Forçado:** Primeiro contrato corporativo / 100 MAU / 1.000 MAU | Re-baseline completo + transição DPO Fase B |
| **Forçado:** Novo subprocessador OU nova categoria de dado OU expansão geográfica | DPIA delta (Annex) em até 15d |
| **Forçado:** Decisão judicial / regulamentação ANPD impactando IA em saúde | Análise em até 7d, DPIA update em até 30d |

**Versionamento:** v1.0 (este doc) → v1.x (deltas/correções) → v2.0 (pós-Beta). Arquivar todas as versões em `docs/projects/anipis/squad-16mai/11-security-audit/dpia-history/` (immutable).

---

## 11. Comitê de Ética em Pesquisa (CEP) / Plataforma Brasil — Preview

### 11.1 Status atual: Closed Beta NÃO é pesquisa formal
O Closed Beta de 14 dias com 20 Júlias é **product validation** (uso real do produto sob termos de uso), **não Randomized Controlled Trial (RCT)**. Não cai sob a Res. CNS 466/2012 e 510/2016 enquanto:
- Não houver alocação randomizada a braços de tratamento;
- Não houver hipótese científica testável publicada;
- Não houver intenção de publicação acadêmica dos resultados.

### 11.2 Por que considerar registro em Plataforma Brasil mesmo assim
- **Sinaliza maturidade ética** para parceiros institucionais futuros (universidades, SUS, planos);
- **Cria trilha de auditoria adicional** independente do controlador;
- **Reduz risco regulatório** se a ANPD ou CFM reclassificarem o uso como pesquisa retroativamente;
- **Habilita publicação acadêmica futura** dos resultados do Beta (citável, peer-reviewed).

### 11.3 Timing Recomendado
- **Closed Beta (atual):** NÃO submeter — usar termo de consentimento informado robusto suficiente;
- **Beta-aberto pós-gate (se "go"):** considerar submissão CEP **antes** do recrutamento de 100+ usuárias;
- **Fase de eficácia clínica (futuro):** OBRIGATÓRIO submeter à Plataforma Brasil + registrar em <https://ensaiosclinicos.gov.br/>.

> *Lucia note:* "There's a road sign in your near future called 'CEP submission'. You don't have to take that exit now, but you should know it's coming and start building toward it. **Find the creative lawyer** — and find the creative clinical researcher — who can help you use the existing framework (CNS 466) to launch your real evidence work without getting stuck for 8 months in committee review."

---

## 12. Sign-off Pendente — Pré-Beta 30/Mai (HARD BLOCKERS)

### 12.1 Cinco itens que precisam de revisão e assinatura OAB-SP/RJ **antes** do Beta

| # | Item | Responsável | Deadline |
|---|---|---|---|
| **SB-01** | Revisão final desta DPIA v1.0 + assinatura formal do controlador | Advogado OAB + founder | 2026-05-26 |
| **SB-02** | Assinatura das SCCs Res. ANPD 19/2024 com **6 subprocessadores** (Supabase, OpenAI, Anthropic, Vercel, Sentry, Upstash) | Advogado OAB + founder | 2026-05-28 (HARD) |
| **SB-03** | Privacy Policy + Termos de Uso + Cookies Policy + Política de Retenção — review e versionamento (registrar `terms_version` em `profiles.bio_data`) | Advogado OAB | 2026-05-26 |
| **SB-04** | Termo de Consentimento Informado específico do Closed Beta — inclui post-hoc review por clinical advisor + consentimento granular Art. 11 | Advogado OAB + clinical advisor | 2026-05-28 |
| **SB-05** | Convênio simples (pro-bono) com clinical advisor CRP — define escopo de review, confidencialidade, e isenção de responsabilidade clínica direta (advisor não atende, apenas revisa logs) | Advogado OAB + clinical advisor | 2026-05-28 |

### 12.2 Documentos Anexos a Produzir (referência para advogado)

| Anexo | Documento | Status |
|---|---|---|
| Anexo A | **Privacy Policy v1.0** (Português brasileiro, linguagem acessível, baseline LGPD Art. 9º) | A REDIGIR |
| Anexo B | **Termos de Uso v1.0** com cláusula de não-substituição de tratamento clínico | A REDIGIR |
| Anexo C | **Cookies Policy v1.0** (PWA — minimal cookies, justificativa Art. 7º) | A REDIGIR |
| Anexo D | **DPA modelo** (Data Processing Agreement) com cláusulas-padrão para subprocessadores | A REDIGIR (template SCCs Res. ANPD 19/2024) |
| Anexo E | **ROPA (Records of Processing Activities)** — Art. 37 — registro detalhado de cada operação | EM CURSO (este DPIA é input principal) |
| Anexo F | **Termo de Consentimento Informado do Closed Beta** (específico, separado do consentimento do produto) | A REDIGIR |
| Anexo G | **Convênio com clinical advisor** (pro-bono, escopo limitado, sem vínculo trabalhista, sem responsabilidade clínica direta) | A REDIGIR |
| Anexo H | **Incident Response Runbook completo** (operacional, com templates de notificação ANPD) | A REDIGIR |

---

## Anexo Cross-Reference: LGPD ↔ EN Parallel (para benchmark Omada / HHS guidance)

| LGPD (Brasil) | Análogo internacional | Observação |
|---|---|---|
| Art. 5º, II — dado pessoal sensível | HIPAA PHI (Protected Health Information) | Anipis trata o equivalente brasileiro de PHI; não é uma covered entity HIPAA, mas opera no mesmo *regime boundary* conceitual |
| Art. 7, I — Consentimento | GDPR Art. 6(1)(a) | Praticamente equivalentes |
| Art. 11, I — Consentimento específico Art. 11 | GDPR Art. 9(2)(a) + HHS health research consent | Equivalência forte |
| Art. 16, II — Comprovação de cumprimento | HIPAA §164.530(j) — accountability docs | Justifica a retenção de 5 anos do audit_events |
| Art. 18 — Direitos do titular | GDPR Art. 15-22; CCPA §1798.100 | Implementação Anipis cobre I-IX |
| Art. 33 — Transferência internacional | GDPR Chapter V (SCCs, adequacy) | Res. ANPD 19/2024 = funcional equivalente das SCCs europeias |
| Art. 38 — DPIA | GDPR Art. 35 DPIA | Este documento |
| Art. 41 — Encarregado (DPO) | GDPR Art. 37 DPO | Cap temporal proposto na Seção 8 |
| Art. 48 — Comunicação de incidente | GDPR Art. 33-34 breach notification | Workflow ANPD 48h descrito na Seção 9 |
| Art. 52 — Sanções administrativas | FTC §5 unfair/deceptive (US) | Risco máximo: 2% faturamento, R$50MM por infração — material mesmo para startup |

---

## Encerramento

> "Anipis está fazendo três coisas que a maioria dos digital mental health apps brasileiros e americanos *não* faz: (1) hash chain criptográfico no audit trail — algorithmic liability infrastructure de verdade; (2) consentimento granular append-only com fail-CLOSED middleware — Art. 11 enforcement de verdade; (3) crisis routing que bypassa autonomy dial — *patient safety overrides consent flow*, que é exatamente o que CFM 2.454/2026 vai exigir. Esses são road signs que mostram que o controlador entendeu o problema antes de a regulação chegar.
>
> Os três gaps materiais para o Beta de 30/Mai são: (1) SCCs Res. ANPD 19/2024 não assinadas — **HARD BLOCKER**; (2) DPO solo sem plano formalizado em contrato com sucessor — mitigado pelo cap temporal mas precisa documentação; (3) backup retention não alinhada com deletion policy — gap operacional, não bloqueia o Beta mas precisa fechar em Sprint 3.
>
> **Honesty is non-negotiable. Once it's out there, it's pretty hard to get it back.** Mantenham o que vocês construíram — está bom. Fechem os três gaps. E **encontrem o advogado criativo** que vai assinar essas SCCs antes de 28/Mai, porque ele existe e ele é a diferença entre um Beta legal e um Beta ilegal."

— Lucia, navigating the regulatory landscape with pragmatic confidence ⚖️

---

**Fim do documento DPIA v1.0**

*Documento gerado como draft executivo. Não substitui revisão jurídica formal por advogado OAB. Não constitui parecer legal vinculante. Próxima revisão obrigatória: 2026-06-13.*
