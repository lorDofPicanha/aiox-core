# SCCs ANPD Res. 19/2024 — Módulo 2 (Controlador-Operador)

**Projeto:** Anipis · Versão 1.0 · Maio 2026
**Origem:** Patricia Peck Advocacia (OAB)
**Recebido em:** 17/Mai/2026
**Status:** 🟡 Draft v1 — aguardando squad legal review + founder action (preencher CNPJ/endereço)

> Documento fonte: `anipis-SCCs-ANPD-19-2024.docx` (recebido do escritório)
> Este MD é conversão fiel do conteúdo para review pelo squad legal AIOS.

---

## OBSERVAÇÕES PRELIMINARES

O presente documento consolida, em um único instrumento, o conjunto de Cláusulas-Padrão Contratuais (SCCs) e Anexos Vendor-Específicos destinados a regular as transferências internacionais de dados pessoais realizadas pela Anipis a seus operadores estrangeiros, em conformidade com o **art. 33, inciso II, da Lei nº 13.709/2018 (LGPD)** e a **Resolução CD/ANPD nº 19, de 23 de agosto de 2024**.

**Premissas (a confirmar):**
- (a) Anipis em fase Closed Beta, ~20 titulares iniciais
- (b) Anipis = Controladora
- (c) 6 operadores listados na Parte II
- (d) Dados sensíveis (art. 5º, II, LGPD) — saúde mental
- (e) Anipis NÃO se enquadra como Pequeno Agente (Res. ANPD 2/2022) — critério qualitativo dados sensíveis em potencial larga escala

**Estrutura:** Parte I (18 cláusulas master) + Parte II (6 anexos vendor)

---

# PARTE I — MASTER TEMPLATE SCC MÓDULO 2

## PREÂMBULO

CLÁUSULAS-PADRÃO CONTRATUAIS PARA TRANSFERÊNCIA INTERNACIONAL DE DADOS PESSOAIS — Módulo 2 (Controlador-Operador), nos termos da Res. CD/ANPD nº 19/2024.

**Partes:**

**CONTROLADORA:** `[ANIPIS — Razão Social a definir]`, CNPJ `[______________]`, sede em `[endereço completo]`, doravante **CONTROLADORA** ou **EXPORTADORA**.

**OPERADORA:** `[Razão Social do Vendor]`, inscrita no registro fiscal sob `[______________]`, sede em `[endereço completo no exterior]`, doravante **OPERADORA** ou **IMPORTADORA**.

## CLÁUSULA 1ª — DEFINIÇÕES

Aplicam-se art. 5º LGPD + art. 3º Res. ANPD 19/2024:
- (a) Dados pessoais
- (b) Dados sensíveis (art. 5º, II — saúde, vida sexual, genéticos, biométricos)
- (c) Titular
- (d) Controladora
- (e) Operadora
- (f) Transferência internacional
- (g) Suboperadora
- (h) Incidente de segurança
- (i) ANPD
- (j) Acordo Principal (DPA + ToS)

## CLÁUSULA 2ª — OBJETO E ÂMBITO

- 2.1 SCCs aplicam-se à transferência descrita no Anexo I
- 2.2 Constituem garantia específica (art. 33, II, LGPD + Res. ANPD 19/2024)
- 2.3 **Em conflito, prevalecem estas SCCs** sobre Acordo Principal ou termos padrão vendor, exceto se vendor terms forem mais protetivos

## CLÁUSULA 3ª — NATUREZA E FINALIDADE

- 3.1 OPERADORA trata exclusivamente:
  - (a) para finalidades do Anexo I
  - (b) conforme instruções documentadas CONTROLADORA
  - (c) em observância LGPD + Res. 19/2024
- 3.2 **VEDADO** uso próprio: comercial, treinamento de IA, análise agregada, ou qualquer outro fora do Anexo I
- 3.3 Alteração de finalidade requer aditivo escrito

## CLÁUSULA 4ª — CATEGORIAS DE DADOS E TITULARES

- 4.1 Descritos no Anexo I
- 4.2 **Dados sensíveis (saúde mental, genéticos, biométricos) → medidas reforçadas:**
  - (a) Criptografia em repouso e trânsito por padrão
  - (b) Segregação lógica de outros clientes
  - (c) Least privilege com registro auditável
  - (d) Pseudonimização/anonimização sempre que viável

## CLÁUSULA 5ª — DURAÇÃO

- 5.1 Inicia na 1ª transferência, perdura até cessada finalidade
- 5.2 Encerramento → Cláusula 14ª (devolução/eliminação)

## CLÁUSULA 6ª — OBRIGAÇÕES DA OPERADORA

- 6.1 OPERADORA obriga-se a:
  - (a) Tratar conforme instruções documentadas + Anexo I apenas
  - (b) Confidencialidade — compromisso escrito de empregados/agentes
  - (c) Medidas de segurança art. 46 LGPD
  - (d) **Certificações ISO/IEC 27001 ou SOC 2 Type II** + evidências mediante solicitação
  - (e) Auxiliar atendimento de direitos titulares (Cap. III LGPD)
  - (f) Auxiliar segurança/sigilo arts. 46-49 LGPD
  - (g) Cooperar ANPD em auditorias/fiscalizações
  - (h) Manter registro operações (art. 37 LGPD)
- 6.2 OPERADORA notifica CONTROLADORA **em até 5 dias úteis** se identificar instrução violadora de LGPD

## CLÁUSULA 7ª — OBRIGAÇÕES DA CONTROLADORA

- 7.1 CONTROLADORA obriga-se a:
  - (a) Instruções claras + documentadas
  - (b) Obter bases legais + consentimentos (art. 11 LGPD)
  - (c) Informar previamente titulares sobre transferência internacional (art. 9º, VI + art. 33, IV)
  - (d) Atender requisições titulares em 1ª instância (arts. 17-22)

## CLÁUSULA 8ª — SUBOPERADORAS

- 8.1 OPERADORA pode contratar SUBOPERADORA se:
  - (a) Autorização escrita prévia (geral ou específica)
  - (b) Contrato com mesmas obrigações destas SCCs
  - (c) Aviso **mínimo 30 dias antes** sobre alteração + direito oposição motivada
- 8.2 OPERADORA permanece integralmente responsável por SUBOPERADORA
- 8.3 Lista atual no Anexo II

## CLÁUSULA 9ª — DIREITOS DOS TITULARES

- 9.1 Direitos art. 18 LGPD: confirmação, acesso, correção, anonimização/bloqueio/eliminação, portabilidade, eliminação, info compartilhamento, info consentimento, revogação consentimento, oposição
- 9.2 OPERADORA assiste razoável CONTROLADORA no prazo de **15 dias** (art. 19, §3º LGPD)
- 9.3 **Titulares podem exigir cumprimento DIRETAMENTE da OPERADORA** quando CONTROLADORA impossibilitada (art. 13, §2º Res. ANPD 19/2024) — *terceiros beneficiários explícito*

## CLÁUSULA 10ª — INCIDENTES DE SEGURANÇA

- 10.1 Em caso de incidente, OPERADORA notifica CONTROLADORA:
  - (a) `[ITEM VAZIO NO DRAFT — prazo padrão faltando]`
  - (b) Por canal pré-estabelecido (e-mail dedicado com confirmação)
  - (c) Fornecendo: natureza, categorias afetadas, número aproximado titulares, consequências prováveis, medidas mitigadoras
- 10.2 Assistência integral para comunicação ANPD/titulares (art. 48 LGPD + Res. ANPD 15/2024)
- 10.3 **Dados sensíveis → notificação em até 24 horas** (vs 72h padrão Res. 15/2024)

## CLÁUSULA 11ª — TRANSFERÊNCIAS POSTERIORES (Onward Transfers)

- 11.1 OPERADORA não transfere a 3os em jurisdição diversa salvo:
  - (a) Autorização escrita prévia
  - (b) Contrato com nível de proteção equivalente
  - (c) Aviso jurisdição/finalidade/categorias

## CLÁUSULA 12ª — REQUISIÇÕES DE AUTORIDADES ESTRANGEIRAS

- 12.1 Em caso de requisição (administrativa/judicial/inteligência estrangeira), OPERADORA:
  - (a) Notifica CONTROLADORA prontamente (salvo impedimento legal)
  - (b) Examina legalidade segundo padrões internacionais devido processo
  - (c) Limita ao estritamente necessário + proporcional
  - (d) Busca suspender via medidas legais quando houver fundamento
  - (e) Mantém registro de todas requisições, disponível à CONTROLADORA

## CLÁUSULA 13ª — RESPONSABILIDADE

- 13.1 OPERADORA responde perante CONTROLADORA e titulares por danos
- 13.2 CONTROLADORA responde perante titulares pelo tratamento da OPERADORA em seu nome, com direito de regresso
- 13.3 **Limitações de responsabilidade do Acordo Principal NÃO se aplicam a:**
  - Dados pessoais sensíveis
  - Violação dolosa ou culpa grave
  - Descumprimento arts. 46-49 LGPD

## CLÁUSULA 14ª — DEVOLUÇÃO E ELIMINAÇÃO

- 14.1 Encerrada relação, à escolha CONTROLADORA:
  - (a) Devolução em formato estruturado/máquina-legível, ou
  - (b) Eliminação total (inclusive backups) em **até 90 dias**
- 14.2 OPERADORA fornece atestado escrito (data + método)
- 14.3 Retenção legal jurisdição vendor permitida (com aviso natureza/prazo + arquivo segregado)

## CLÁUSULA 15ª — AUDITORIA

- 15.1 CONTROLADORA tem direito a:
  - (a) Relatórios periódicos (mínimo anual)
  - (b) Acesso a SOC 2 Type II / ISO 27001 (NDA permitida)
  - (c) Auditoria in loco/remota com aviso **mínimo 30 dias**, custo CONTROLADORA, salvo se incidente confirmado (custo OPERADORA)
- 15.2 Cooperação com ANPD (art. 24 Res. 19/2024)

## CLÁUSULA 16ª — LEI APLICÁVEL E FORO

- 16.1 Leis Brasil + LGPD + Res. 19/2024
- 16.2 Foro `[São Paulo/Capital]`, sem prejuízo competência ANPD
- 16.3 Alternativa arbitragem: **CIESP/FIESP** com sede Brasil, idioma português

## CLÁUSULA 17ª — TERCEIROS BENEFICIÁRIOS

- 17.1 Titulares são **terceiros beneficiários** explícitos — podem exercer direitos arts. 18 + cláusulas 9ª/10ª diretamente contra qualquer das Partes
- 17.2 Partes renunciam invocar relatividade contratual contra titulares

## CLÁUSULA 18ª — VIGÊNCIA E ALTERAÇÕES

- 18.1 Vigência = prazo Acordo Principal, renovação automática
- 18.2 Alterações via aditivo escrito + representantes legais ambas partes
- 18.3 Nova norma ANPD posterior → revisão em até 60 dias
- 18.4 Assinatura eletrônica (MP 2.200-2/2001 + Lei 14.063/2020)

**Local + data:** `[Local], ___ de _________________ de 20___.`

**Assinaturas:** CONTROLADORA — Anipis · OPERADORA — `[Vendor]`

---

# PARTE II — ANEXOS VENDOR-ESPECÍFICOS

## ANEXO I — SUPABASE

| Campo | Valor |
|---|---|
| Razão Social | Supabase |
| SDK | `@supabase/supabase-js` v2.47.x+ |
| Jurisdição | US — AWS us-east-1 (Virginia) |
| Status DPA | DPA padrão disponível; SCC ANPD bilateral pendente |
| Tier requerido | **Pro** (mínimo para DPA assinável) |

**B. Base legal:** Execução contrato (art. 7º, V) + consentimento sensível destacado (art. 11, I)

**C. Finalidades:**
- Armazenamento DB primário (PostgreSQL)
- Persistência mensagens, perfis, mood, crisis, journal
- PITR janela 7d
- Auth (Supabase Auth)

**D. Categorias dados:**
- Identificação: nome/pseudônimo, email, UUID
- **Sensíveis (art. 5º II):** mensagens IA, mood, crisis markers, journal
- Técnicos: timestamps, IP (parcial/hash), versão app

**E. Titulares:** ≥18 anos, Closed Beta ~20 "Júlias"

**F. Retenção:**
- Conta ativa + 30d processamento exclusão
- PITR backup 7d
- Pós-exclusão: total em até 30d (inclusive backups)
- **Exceção:** crisis_events com encaminhamento emergência → 5 anos arquivo segregado (defesa processual)

**G. Medidas:**
- AES-256 + TLS 1.2+
- RLS ativo em todas tabelas PII
- 2FA conta admin Anipis
- Audit logs (Supabase Logs + Postgres pg_audit)
- Least privilege service roles
- SOC 2 Type II vendor

**H. Suboperadoras:** AWS us-east-1 (Virginia, EUA) — SUBOPERADORA sujeita Cláusula 8ª

---

## ANEXO II — ANTHROPIC

| Campo | Valor |
|---|---|
| Razão Social | Anthropic |
| SDK | `@anthropic-ai/sdk` v0.32.x+ |
| Jurisdição | US — AWS multi-região |
| Status DPA | DPA disponível; ZDR Enterprise contratual |
| Tier requerido | **Enterprise com ZDR garantido contratualmente** |

**B. Base legal:** Execução contrato + consentimento específico IA generativa saúde mental

**C. Finalidades:**
- Inferência LLM para IA companheira Anipis
- Classificadores conteúdo (crise, autolesão, proibido)
- **VEDADO:** treinamento modelos Anthropic, análise agregada própria, qualquer outra finalidade

**D. Categorias dados:**
- Mensagens com PII estruturada **REMOVIDA via output-filter Anipis** antes API
- Contexto conversa também PII-stripped
- Metadados: model version, request ID, tokens

**E. Titulares:** ≥18 anos, Closed Beta ~20 "Júlias"

**F. Retenção:** **Zero Data Retention** via Enterprise — sem persistência. Exigir cláusula expressa DPA + atestado anual cumprimento.

**G. Medidas:**
- ZDR contratual
- TLS 1.3
- Constitutional AI guardrails default
- Output-filter pré-API (controladora)
- Logs API mínimos para faturamento

**H. Suboperadoras:** AWS + GCP multi-região (Trust Center)

---

## ANEXO III — OPENAI

| Campo | Valor |
|---|---|
| Razão Social | OpenAI |
| SDK | `openai` (Node.js) v4.73.x+ |
| Jurisdição | US — Microsoft Azure |
| Status DPA | DPA disponível; ZDR via API Enterprise + dashboard activation |
| Tier requerido | **API Zero Retention + DPA assinado** |

**B. Base legal:** Execução contrato + consentimento específico

**C. Finalidades:**
- Embeddings vetoriais (RAG)
- Eventual LLM fallback/secundário
- **VEDADO:** treinamento, fine-tuning não autorizado, análise agregada própria

**D. Categorias:** Texto PII-stripped + metadados técnicos mínimos

**E. Titulares:** ≥18 anos Closed Beta

**F. Retenção:** **Zero Retention via API Enterprise** — default 30d INACEITÁVEL. ATIVAR ZRT no dashboard antes go-live.

**G. Medidas:**
- Zero Retention org-level
- Output-filter pré-API
- TLS 1.3
- Monitoramento quota/rate-limit anti-exfiltração

**H. Suboperadoras:** Microsoft Azure (primário)

---

## ANEXO IV — SENTRY

| Campo | Valor |
|---|---|
| Razão Social | Sentry |
| SDK | `@sentry/node` v8.40.x+ |
| Jurisdição | US — saas-us.sentry.io |
| Status DPA | DPA download direto sentry.io/legal |
| Tier requerido | Team ou Business |

**B. Base legal:** **Legítimo interesse (art. 7º, IX)** + LIA documentado (Legitimate Interest Assessment)

**C. Finalidades:**
- Monitoramento erros/exceções
- APM performance
- Reprodução incidentes técnicos (PII filtrada via beforeSend)

**D. Categorias:**
- Stack traces, mensagens erro, metadados execução
- IDs técnicos (request ID, UUID interno — **NUNCA** email/nome/conteúdo)
- Performance metrics agregadas

**E. Titulares:** ≥18 anos Closed Beta

**F. Retenção:** Padrão 90d; **recomenda-se reduzir para 30d** se tier permitir

**G. Medidas:**
- `[VALOR FALTANDO: hook beforeSend filtrando emails/telefones/conteúdo/IDs gov]`
- PII scrubbing ativo nas configs projeto Sentry
- Acesso painel restrito a devs autorizados + 2FA
- Auditoria trimestral código beforeSend hook

**H. Suboperadoras:** Infra própria + GCP (sentry.io/subprocessors)

---

## ANEXO V — UPSTASH REDIS

| Campo | Valor |
|---|---|
| Razão Social | Upstash Redis |
| SDK | `@upstash/redis` v1.34.x+ |
| Jurisdição | US default; suporta `eu-west-1` e **`aws-sa-east-1` (SP)** |
| Status DPA | Upstash GDPR DPA disponível |
| Tier requerido | Pay-as-you-go ou Pro |

**B. Base legal:** Execução contrato — cache transitório

**C. Finalidades:**
- Cache tokens sessão (TTL ≤15min)
- Rate-limiting API por usuária
- Cache temp state machine

**D. Categorias:**
- Tokens sessão (hashed, não-PII)
- UUID interno para contadores rate-limit
- Excepcional: fragmentos payload TTL ≤15min

**E. Titulares:** ≥18 anos Closed Beta

**F. Retenção:** TTL-bounded — máximo 24h em qualquer hipótese; padrão ≤15min

**G. Medidas:**
- TTL obrigatório em todas chaves
- TLS criptografia trânsito
- Audit logs ativos
- `[VALOR FALTANDO: hook ou pattern de purge]` **AÇÃO RECOMENDADA — migrar para `aws-sa-east-1` (São Paulo) para ELIMINAR transferência internacional. Custo ~zero.**

**H. Suboperadoras:** AWS ou GCP dependendo região cliente

---

## ANEXO VI — LANGFUSE

| Campo | Valor |
|---|---|
| Razão Social | Langfuse |
| SDK | `langfuse` v3.38.x+ |
| Jurisdição | **União Europeia — Frankfurt** (cloud.langfuse.com) |
| Status DPA | DPA via tier Pro; SCC ANPD bilateral pendente |
| Tier requerido | **Pro** (mínimo para DPA + retenção configurável) |

**B. Base legal:** Legítimo interesse (art. 7º, IX) + LIA documentado

**C. Finalidades:**
- Logging/observabilidade chamadas LLM (traces)
- Métricas qualidade (latência, custo, fallbacks)
- Avaliação humana respostas para fine-tuning de prompts (não modelos vendor)

**D. Categorias:**
- Prompts LLM com PII JÁ STRIPPED (mesmo filtro Anthropic/OpenAI)
- Completions geradas
- Metadados (modelo, tokens, custo, latência, traces)

**E. Titulares:** ≥18 anos Closed Beta

**F. Retenção:** Configurável; **recomenda-se 14d** (vs default 60d)

**G. Medidas:**
- Criptografia repouso + trânsito
- PII stripping pré-Langfuse (filtro idêntico)
- Hospedagem UE Frankfurt — regime equivalente LGPD (GDPR)
- Retenção 14d limita janela exposure

**H. Suboperadoras:** AWS Frankfurt eu-central-1

---

## REVIEW STATUS

| Reviewer | Status | Data |
|---|---|---|
| Patricia Peck Advocacia | ✅ Draft v1 emitido | 17/Mai/2026 |
| Squad Legal AIOS | 🟡 Em review | 17/Mai/2026 |
| Founder Anipis | 🔴 Pending CNPJ + endereço | 18/Mai/2026 |
| OAB Final Review | 🔴 Pending Patricia v2 pós-feedback | 19-20/Mai/2026 |

## Cosmetic issues conhecidos (já flagged)

1. **Cláusula 10.1(a) — letra vazia** (esqueceram prazo padrão notificação)
2. **`[object Object]` 2x** (Sentry §G + Upstash §G) — bullet quebrado em conversão
3. **Preâmbulo:** `[Razão Social]`, `[CNPJ]`, `[endereço]` em branco — founder action

## Substantivos pendentes founder

1. Decidir nome jurídico CONTROLADORA Anipis (CNPJ ME ativa ou criar PJ)
2. Local de assinatura (provavelmente São Paulo)
3. Para Sentry/Langfuse — redigir LIA documentado separado
4. Endereço email dedicado a incidentes (`security@anipis.com.br`?)
