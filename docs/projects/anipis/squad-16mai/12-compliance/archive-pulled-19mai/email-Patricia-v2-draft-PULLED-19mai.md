# Email Patricia v2 — Draft

**De:** Breno Cerqueira <[founder@anipis.com.br]> (interim DPO)
**Para:** Patricia Peck <[patricia@patriciapeck.com.br]> (cc: equipe Patricia Peck Advocacia)
**Assunto:** Anipis · SCC ANPD Res. 19/2024 + RIPD/DPIA · Edições propostas v2 — 4 gaps SCC + 4 inconsistências DPIA + 6 negociações vendor
**Data:** 19/Mai/2026 (atualizado com revisão DPIA v2)

---

Patricia, bom dia.

Recebi seu draft v1 das SCCs ANPD Res. 19/2024 (17/Mai) e também o RIPD/DPIA v1.0 (recebido 19/Mai). Obrigado pela velocidade e pelo cuidado — ambos os documentos substantivamente fortes:

- **SCC:** cláusulas 9.3 terceiros beneficiários, 10.3 24h dados sensíveis, 13.3 carve-out e 17 renúncia de relatividade contratual foram exatamente o que precisava.
- **DPIA:** matriz qualitativa probabilidade×impacto com 3 níveis e 2 colunas (inerente vs residual), tratamento separado de R3/R4 (falso negativo vs positivo de crise) e R2 nomeando FISA/EO 12333/CLOUD Act são raros em RIPDs brasileiros pré-fiscalização — ANPD vai gostar.

Rodei revisão técnica interna no fim de semana com nosso conselho consultivo (advogados ad hoc + threat model + privacy by design). Consolidamos:

- **4 edições materiais ao SCC**;
- **4 inconsistências materiais ao DPIA** (alinhamento DPIA→realidade pós decisões founder 18/Mai);
- **3 gaps técnicos DPIA** (documentação de operacionalização);
- **6 pontos de negociação bilateral** com vendors US que vamos enfrentar.

**Documentos de edições propostas em anexo** (texto completo pronto pra colar):
- `SCCs-v2-proposed-edits.md` — edições SCC
- `DPIA-squad-legal-review.md` — review completo DPIA (395 linhas)
- `anipis-RIPD-DPIA-v2.md` — DPIA v2 já com caminhos A aplicados, **pendente sua aprovação dos caminhos e preenchimento da Tabela 1 (CNPJ + DPO + emails)**

---

## Resumo executivo das 4 edições

### Edição 1 — Cláusula 10.1(a) prazo notificação vazio

Item (a) ficou em branco no draft v1. Propomos:

> "em até 24 (vinte e quatro) horas a contar do momento em que tomar ciência inequívoca do incidente, podendo ser prorrogado por escrito por CONTROLADORA quando justificadamente necessário para preservar evidências forenses, sem prejuízo do prazo máximo absoluto de 48 (quarenta e oito) horas para notificação substantiva"

Mantém coerência com 10.3 (24h dados sensíveis). Cap absoluto 48h evita uso indevido da exceção forense.

### Edição 2 — Anexo I (Supabase) §F retenção crisis_events

Aqui temos um descompasso entre o draft e a realidade do código auditado. O draft promete **"5 anos arquivo segregado crisis_events"**, mas auditando `account-deletion-service.ts` confirmamos que **pseudoanonimizamos imediatamente** (substituição de `user_id` por tombstone + limpeza de `matchedKeywords`). Não existe tabela archive segregada.

Manter a promessa atual nos exporia a breach de SCC no primeiro audit ANPD.

**Decisão squad: Caminho A — alinhar contrato à realidade.** Texto proposto descreve fielmente (i) pseudoanonimização imediata de `crisis_events`, (ii) preservação 5 anos da cadeia `audit_events` (hash chain íntegra, sem PII bruta via `scrubFreeText`) para defesa Art. 7º §3 CPC e Art. 16 II LGPD.

Caminho B alternativo (criar tabela archive + trigger + retention cron) seria 1 dev-day mas é over-engineering 13 dias antes do launch.

Sua opinião aqui é especialmente valiosa.

### Edição 3 — Cláusula 12ª FISA/CLOUD Act/EO 12333

Cláusula 12 ficou genérica e silenciosa sobre os regimes US específicos. Como sabemos pós-Schrems II (CJEU C-311/18), a ANPD provavelmente vai cobrar referência explícita a FISA §702, EO 12333 e CLOUD Act em audit de adequação (Art. 33 I LGPD).

Propomos adicionar item **(f)** que (i) nomeia explicitamente os regimes, (ii) exige contestação pelos meios legais disponíveis e proporcionais, (iii) **exige transparency report semestral** com número agregado de requisições (proporcionado à Anipis) anexado às reportagens da Cláusula 15ª.

Anthropic, OpenAI e Sentry já publicam transparency reports — exigir o agregado no SCC dá rastreabilidade defensável sem criar obrigação operacional nova.

**Antecipo:** Anthropic e OpenAI vão pushar (f) na negociação bilateral. Plan B: aceitar redação suavizada mantendo (a)-(e). Linha vermelha: não aceitar corte de 12.1(a) (notificação prompt mesmo com *gag order*).

### Edição 4 — Cláusula 7.1 consent UI destacado

Art. 11 I LGPD exige consentimento "específico **e destacado**" — não basta presença em ToS genérico. Onboarding atual da Anipis precisa expor a transferência internacional como prompt separado.

Propomos adicionar **7.1(c.bis)** detalhando os 5 elementos mínimos do prompt: (i) lista de subprocessadores + jurisdições, (ii) clareza sobre tratamento de dados sensíveis, (iii) direito de revogação, (iv) não-discriminação no caso de recusa, (v) link direto Política + SCC.

Dev correlato (DEV-2): 4-6h frontend + 2h API. Em sprint, deadline D-7 (23/Mai). Especificação técnica em documento separado se precisar revisar.

---

---

## Resumo executivo das 4 inconsistências DPIA (todas resolvidas via caminho A)

> **Contexto:** apliquei as 4 inconsistências como **caminho A** (alinhamento DPIA→realidade) no `anipis-RIPD-DPIA-v2.md` em anexo. O squad recomendou caminho A em todas (vs. caminho B = implementar código novo) porque (i) já temos o suficiente em produção, (ii) caminho A é igualmente defensável sob ANPD, (iii) 13 dias é prazo apertado pra over-engineering. Pedindo seu sign-off em todas.

### INC-1 — Anthropic ZDR declarado ativo, mas decidi DEFERIR

Decisão founder 18/Mai: removo `ANTHROPIC_API_KEY` do env de produção e reavalio em 25/Mai. Razão: ZDR contratual (DPA enterprise) não fechado, e Anthropic via dashboard-only não dá garantia auditável. OpenAI ZRT está sólido como vendor LLM exclusivo no Beta.

DPIA v2 reflete: Anthropic "NÃO ATIVA" no Closed Beta; Tabela 5 (§5) marca o status; §8.3(c) condiciona reativação a DPA enterprise.

### INC-2 — Circuit breaker programático prometido em R6(f) não existe em código

Grep confirmou: zero implementação. Mantemos **encaminhamento informativo persistente** (banner + mensagem inline com CVV 188 / SAMU 192) com registro auditável no hash chain de `audit_events`. Circuit breaker bloqueante de sessão fica como roadmap pós-Beta.

DPIA v2 R6(f) reescrito honesto.

### INC-3 — Anexo I Supabase "5y arquivo segregado" (mesmo gap do SCC Edição 2)

Caminho A: documentar fielmente — pseudonimização imediata + audit_events 5y. Tabela 3 (§4) do DPIA v2 + nova §4.1 detalham o fluxo.

### INC-4 — R2(d) exige transparency report semestral que SCC v1 não tem

Resolvido cruzando: DPIA v2 R2(d) menciona transparency report; SCC v2 Edição 3 cria cláusula 12.1(f) que respalda. Consistência cruzada.

---

## 3 gaps técnicos DPIA resolvidos

### GAP-A — Vedação a menores (§3.3) sem operacionalização técnica

Auditei o código: já temos migration `005_age_gate.sql` + `AgeGateStep.tsx` + middleware `age-gate.ts` + `minor-indicators-detector.ts`. DPIA v2 §3.3 documenta os 5 mecanismos com referência à migration.

### GAP-B — R8 cita CFM 2.314/2022 sem mencionar 2.454/2026

Resolução CFM 2.454/2026 sobre assistentes de IA em saúde mental tem previsão de vigência agosto/2026. DPIA v2 R8(e) cita ambas + §10(f) cria gatilho de revisão imediata pós-vigência.

### GAP-C — Direito de portabilidade sem endpoint vivo

Para Closed Beta, formalizei: **processo manual via Encarregado** (`privacidade@anipis.com.br` → query SQL pre-aprovada → JSON estruturado em 15 dias). Endpoint self-service `GET /me/export` fica no roadmap pós-Beta. R12(c) + §9(V) atualizados.

---

## 6 pontos de negociação bilateral com vendors (heads-up)

Anticipo onde os vendors US vão pushar — alinhei Plan B com squad consultivo para cada cenário:

| # | Cláusula | Vendor(es) | Plan B aceitável | Linha vermelha |
|---|----------|-----------|------------------|----------------|
| 1 | 12.1(f) transparency report | Anthropic, OpenAI, Sentry | Redação suavizada mantendo (a)-(e) | Corte de 12.1(a) |
| 2 | 13.3 carve-out sem cap | Todos US | Cap 12× monthly OU USD 5MM (o maior) para "culpa grave"; dolo + arts. 46-49 sem cap | Cap em dolo ou violação intencional |
| 3 | 15.1(c) auditoria in loco | Todos US | SOC 2 Type II + ISO 27001 com NDA como cumprimento padrão; in loco only em incidente confirmado | — |
| 4 | 14.1(b) eliminação 90d backups | Supabase, Sentry | Eliminação operacional 30d + total inclusive backups em até 180d, com janela documentada | — |
| 5 | 16.2 foro SP | Todos US | Arbitragem CIESP/FIESP (16.3) como compromisso | Foro Delaware ou US |
| 6 | 9.3 terceiros beneficiários | Anthropic, OpenAI | **Manter como está** (mesmo se vendor recusa, Art. 42 LGPD garante solidariedade) | Eliminação total de 9.1 |

---

## Status pré-condições Closed Beta 30/Mai/2026

Code-side, fechamos **14 de 18 P0s de segurança** (suite 827/827 passing) levantados por nosso audit interno (Bruce Schneier threat model + Alison Darcy red-team + Lucia Savage DPIA). Ainda em sprint:
- DEV-1 Caminho A (Edição 2 acima) — pendente sua aprovação
- DEV-2 Consent UI (Edição 4 acima) — 4-6h, sprint D-7
- DEV-3 Sentry beforeSend audit — 1h, sprint D-10
- DEV-4 Upstash migração São Paulo — 1-2h, sprint D-7
- DEV-7 Output filter regression tests

Founder action items paralelos:
- CNPJ + endereço CONTROLADORA (Preâmbulo + Anexos) → me passo essa semana
- `security@anipis.com.br` criado e configurado
- OpenAI ZRT ativação dashboard + screenshot evidência
- Anthropic Enterprise tier + ZDR contratual confirmação
- LIA Sentry + LIA Langfuse (drafts squad, founder revisa e assina)
- DPO sign-off interim (founder formaliza)

---

## Pedido formal

Patricia, pode incorporar:

(a) as **4 edições no SCC v2**;
(b) **sign-off ou contraproposta nos 4 caminhos A do DPIA v2** (já redigidos no anexo `anipis-RIPD-DPIA-v2.md`);
(c) **parecer formal de 1 página** atestando aderência do DPIA v2 ao art. 38 LGPD + Res. CD/ANPD 2/2022 (mesmo sumário) antes do D-0?

Estimando:

- **D-9 a D-7 (21-23/Mai):** v2 SCC + sign-off DPIA + parecer
- **D-6 a D-3 (24-27/Mai):** negociação bilateral simultânea Anthropic + OpenAI (você conduz, eu acompanho); preenchimento Tabela 1 DPIA pelo founder
- **D-2 a D-1 (28-29/Mai):** review final 6 anexos assinados (ou em "negociação ativa documentada") + Privacy Policy + Termo Beta
- **D-Day (30/Mai):** Launch Closed Beta com SCCs + DPIA assinados ou status documentado

Disponível pra call quando puder fechar:

- caminho A vs B na **Edição 2 do SCC** (única SCC que ainda precisa decisão);
- caminhos A no **DPIA v2** (todas 4 inconsistências — se preferir caminho B em alguma, me avise pra ajustar timeline);
- parecer formal DPIA (sumário ou aprofundado).

Honorários adicional para SCC v2 + DPIA v2 sign-off + parecer + negociação bilateral: aceito proposta sua. Squad estimou R$ 7-20k cobrindo até assinatura — confirma se está dentro?

Obrigado novamente. Sua minuta v1 economizou semanas e me deu base sólida para o squad técnico atacar gaps específicos sem reinventar a roda.

Abraço,
**Breno Cerqueira**
Founder & DPO interim
Anipis · [anipis.com.br](https://anipis.com.br)

---

**Anexos:**
1. `SCCs-v2-proposed-edits.md` — texto integral das 4 edições SCC
2. `SCC-squad-legal-review.md` — review completo squad legal AIOS SCC (395 linhas, opcional)
3. `SCCs-ANPD-19-2024-checklist.md` — checklist 6 subprocessadores
4. `DPIA-squad-legal-review.md` — review completo squad legal AIOS DPIA (NEW)
5. `anipis-RIPD-DPIA-v2.md` — DPIA v2 com caminhos A aplicados, aguardando sign-off (NEW)

---

## Notas internas (não enviar)

**Tom:** Respeitoso, técnico, colaborativo. Patricia é OAB sênior — não cabe condescendência mas também não cabe deferência absoluta. Postura: founder técnico que validou o trabalho dela e traz feedback substantivo.

**Pontos enfatizados de propósito:**
1. Reconhecimento do que está bom (Cláusulas 9.3, 10.3, 13.3, 17) — abre canal para receber feedback adverso bem
2. Decisão de Edição 2 (Caminho A) é colocada como pedido de opinião, não imposição — Patricia pode discordar
3. Vendors push é apresentado com Plan B alinhado — mostra preparação, não improviso
4. Pedido formal explícito com timeline realista
5. Honorários abertos para negociação — não fixar valor antes da resposta dela

**Riscos:**
- Patricia pode discordar do Caminho A → preparar contraproposta Caminho B mas só apresentar se ela puxar
- Patricia pode pedir mais tempo (slip para 7/Jun) → squad endossa, mas só confirmar se Patricia formalizar via email
- Vendors negociação pode estender além de 29/Mai → Plan B documentado em §10 do squad review (lançar com SCCs em "negociação ativa documentada")

**Quando enviar:** Após founder revisar e confirmar Caminho A (Edição 2). Ideal **18/Mai noite ou 19/Mai manhã** para dar Patricia 3-4 dias úteis até D-9.
