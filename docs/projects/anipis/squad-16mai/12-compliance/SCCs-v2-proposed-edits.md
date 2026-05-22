# SCCs ANPD Res. 19/2024 — Edições Propostas para Draft v2

**Documento fonte:** `SCCs-ANPD-19-2024-draft-v1-PatriciaPeck.md` (Patricia Peck Advocacia, 17/Mai/2026)
**Squad legal AIOS review:** `SCC-squad-legal-review.md` (17/Mai/2026, verdict NEEDS_CHANGES)
**Autor edições:** Squad legal AIOS (Patricia Peck clone + Lucia Savage + Bruce Schneier + Ann Cavoukian + Heather Meeker)
**Destino:** Patricia Peck Advocacia (incorporação em draft v2)
**Data:** 18/Mai/2026

---

## Resumo executivo

Patricia, segue o conjunto consolidado de 4 edições materiais que o squad legal AIOS propõe para incorporação no draft v2. Todas são **text-only** (zero novo dev side controladora além do DEV-2 consent UI que já está em sprint).

| # | Cláusula | Tipo | Bloqueador |
|---|----------|------|------------|
| 1 | 10.1(a) — prazo notificação | Inserir 24h | Closed Beta 30/Mai |
| 2 | Anexo I (Supabase) §F retenção | Trocar "5y arquivo segregado" → realidade do código | Closed Beta 30/Mai |
| 3 | 12ª — autoridades estrangeiras | Adicionar (f) transparency report + FISA/CLOUD Act/EO 12333 | Closed Beta 30/Mai |
| 4 | 7.1 — obrigações controladora | Adicionar (c.bis) consent UI destacado Art. 11 I | Closed Beta 30/Mai |

---

## EDIÇÃO 1 — GAP-1: Cláusula 10.1(a) prazo notificação

### Texto atual (draft v1, linha ~120)

> 10.1 Em caso de incidente, OPERADORA notifica CONTROLADORA:
>   - (a) `[ITEM VAZIO NO DRAFT — prazo padrão faltando]`
>   - (b) Por canal pré-estabelecido (e-mail dedicado com confirmação)
>   - (c) Fornecendo: natureza, categorias afetadas, número aproximado titulares, consequências prováveis, medidas mitigadoras

### Texto proposto v2

> 10.1 Em caso de incidente, OPERADORA notifica CONTROLADORA:
>   - **(a) em até 24 (vinte e quatro) horas a contar do momento em que tomar ciência inequívoca do incidente, podendo ser prorrogado por escrito por CONTROLADORA quando justificadamente necessário para preservar evidências forenses, sem prejuízo do prazo máximo absoluto de 48 (quarenta e oito) horas para notificação substantiva;**
>   - (b) Por canal pré-estabelecido (e-mail dedicado com confirmação)
>   - (c) Fornecendo: natureza, categorias afetadas, número aproximado titulares, consequências prováveis, medidas mitigadoras

### Justificativa

Art. 48 LGPD exige prazo "razoável". Res. ANPD 15/2024 art. 6º §2 admite até 72h em casos gerais; 10.3 já endurece para 24h em dados sensíveis. Manter coerência interna entre 10.1(a) e 10.3 evita defesa vendor de "prazo não pactuado". O cap absoluto 48h (mesmo com prorrogação forense) evita uso indevido da exceção.

---

## EDIÇÃO 2 — GAP-2 (Caminho A): Anexo I Supabase §F retenção

### Texto atual (draft v1, linha ~204-209)

> **F. Retenção:**
> - Conta ativa + 30d processamento exclusão
> - PITR backup 7d
> - Pós-exclusão: total em até 30d (inclusive backups)
> - **Exceção:** crisis_events com encaminhamento emergência → 5 anos arquivo segregado (defesa processual)

### Texto proposto v2

> **F. Retenção:**
> - Conta ativa + 30 (trinta) dias para processamento de pedido de exclusão (Art. 18, VI, LGPD)
> - PITR backup janela de 7 (sete) dias
> - Pós-exclusão: hard delete total (inclusive backups operacionais) em até 30 (trinta) dias, exceto pelas duas exceções abaixo
> - **Exceção 1 — `crisis_events`:** pseudoanonimização imediata mediante (i) substituição irreversível do `user_id` por tombstone (hash não-reversível); (ii) preservação dos campos não-PII (timestamp, bucket de classificação, fluxo de encaminhamento) para análise estatística agregada (Art. 6º, V, LGPD); (iii) limpeza explícita do campo `classifier_output.matchedKeywords` (eliminação de quasi-identificadores textuais). O tombstone constitui dado anonimizado nos termos do art. 5º, III LGPD.
> - **Exceção 2 — `audit_events`:** retenção de **5 (cinco) anos** da cadeia íntegra de eventos de auditoria (hash chain blockchain-style), com `user_id` substituído por tombstone no momento da exclusão da conta (via `scanAndReplaceUserId` operação programática), preservando integridade criptográfica para defesa em demanda judicial Art. 7º §3 CPC e cumprimento Art. 16, II LGPD. O conteúdo dos eventos de auditoria não contém PII bruta (campos livres passam por filtro `scrubFreeText` antes da persistência).

### Justificativa

Realidade do código auditada em `account-deletion-service.ts:499-511` (pseudoanonimização) e `audit-trail.ts` (hash chain integral + scrubFreeText). Não existe tabela `crisis_events_archive` segregada. Promessa v1 expunha a Anipis a breach contratual no primeiro audit ANPD. Esta redação é **veraz, defensável e suficiente** (Lucia Savage spec §3 + Bruce Schneier threat model). Custo dev: zero — alinha contrato à realidade.

**Caminho B alternativo** (criar migration `crisis_events_archive` particionada): 1 dev-day + smoke E2E. Squad recomenda **Caminho A**. Decisão founder pendente em D-12 (18/Mai/2026).

---

## EDIÇÃO 3 — GAP-3: Cláusula 12 transparency report FISA/CLOUD Act/EO 12333

### Texto atual (draft v1, linha ~138-145)

> ## CLÁUSULA 12ª — REQUISIÇÕES DE AUTORIDADES ESTRANGEIRAS
>
> - 12.1 Em caso de requisição (administrativa/judicial/inteligência estrangeira), OPERADORA:
>   - (a) Notifica CONTROLADORA prontamente (salvo impedimento legal)
>   - (b) Examina legalidade segundo padrões internacionais devido processo
>   - (c) Limita ao estritamente necessário + proporcional
>   - (d) Busca suspender via medidas legais quando houver fundamento
>   - (e) Mantém registro de todas requisições, disponível à CONTROLADORA

### Texto proposto v2

> ## CLÁUSULA 12ª — REQUISIÇÕES DE AUTORIDADES ESTRANGEIRAS
>
> - 12.1 Em caso de requisição (administrativa, judicial ou de inteligência estrangeira), OPERADORA:
>   - (a) Notifica CONTROLADORA prontamente (salvo impedimento legal, incluindo *gag orders* sob FISA §702, NSL ou figura equivalente)
>   - (b) Examina legalidade segundo padrões internacionais de devido processo legal e proteção de dados (incluindo princípios Schrems II CJEU C-311/18)
>   - (c) Limita o cumprimento ao estritamente necessário e proporcional ao escopo da requisição
>   - (d) Busca contestar e suspender via medidas legais disponíveis e proporcionais (incluindo, quando aplicável, *TRAP procedure*, *motion to quash*, intervenção amicus), sem prejuízo de obrigações legais imperativas da jurisdição da OPERADORA
>   - (e) Mantém registro auditável de todas requisições recebidas, disponível à CONTROLADORA mediante solicitação razoável
>   - **(f) Quando aplicável regime legal de** *gag order* **ou sigilo imperativo (incluindo, exemplificativamente: FISA §702 — Foreign Intelligence Surveillance Act Section 702; Executive Order 12333; CLOUD Act — Clarifying Lawful Overseas Use of Data Act 18 U.S.C. §2713; National Security Letters 18 U.S.C. §2709), OPERADORA compromete-se a (i) contestar a ordem pelos meios legais disponíveis e proporcionais; (ii) divulgar o número agregado de requisições recebidas semestralmente em relatório público de transparência (transparency report); (iii) anexar referido relatório, na proporção que diga respeito à CONTROLADORA, às reportagens de auditoria desta Cláusula 15ª.**

### Justificativa

Bruce Schneier nota que cláusulas genéricas falham no teste Schrems II — a CJEU C-311/18 anulou Privacy Shield exatamente porque leis US (FISA §702, EO 12333) permitem acesso governamental que afasta a "essência da proteção". A doutrina ANPD em formação (Art. 33 I LGPD) provavelmente seguirá raciocínio análogo. Vendors US recalcitrantes (Anthropic/OpenAI/Sentry) já publicam transparency reports — exigir o agregado no SCC dá rastreabilidade defensável sob audit ANPD sem criar obrigação operacional nova para o vendor.

**Plan B se vendor recusa (f):** Aceitar redação suavizada mantendo (a)-(e) — Patricia conduz negociação bilateral. Linha vermelha: não aceitar corte de 12.1(a) (notificação prompt) — sem isso a cláusula vira teatro.

---

## EDIÇÃO 4 — GAP-4: Cláusula 7.1 consent UI destacado Art. 11 I

### Texto atual (draft v1)

> ## CLÁUSULA 7ª — OBRIGAÇÕES DA CONTROLADORA
>
> - 7.1 CONTROLADORA compromete-se a:
>   - (a) Obter bases legais adequadas (art. 7º + art. 11 LGPD)
>   - (b) Obter consentimentos específicos quando aplicáveis (art. 11 LGPD)
>   - (c) Informar previamente titulares sobre transferência internacional (art. 9º, VI + art. 33, IV LGPD)
>   - (d) Definir e documentar finalidades

### Texto proposto v2

> ## CLÁUSULA 7ª — OBRIGAÇÕES DA CONTROLADORA
>
> - 7.1 CONTROLADORA compromete-se a:
>   - (a) Obter bases legais adequadas (art. 7º + art. 11 LGPD)
>   - (b) Obter consentimentos específicos quando aplicáveis (art. 11 LGPD)
>   - (c) Informar previamente titulares sobre transferência internacional (art. 9º, VI + art. 33, IV LGPD)
>   - **(c.bis) Implementar, na jornada de** *onboarding* **e antes da primeira coleta de dado sensível, prompt de consentimento específico e destacado nos termos do art. 11, I LGPD, contendo no mínimo: (i) lista de subprocessadores estrangeiros e respectivas jurisdições; (ii) informação clara de que dados sensíveis (art. 5º, II LGPD) serão objeto de tratamento; (iii) direito de revogação livre, gratuita e a qualquer tempo (art. 8º §5 LGPD); (iv) informação de que a recusa do consentimento à transferência internacional não impede o uso da Plataforma com funcionalidades limitadas (quando aplicável tecnicamente), sem efeitos discriminatórios contra o titular (art. 6º, IX LGPD); (v) link direto para a Política de Privacidade e este instrumento de SCC.**
>   - (d) Definir e documentar finalidades

### Justificativa

Art. 11 LGPD exige consentimento "específico" E "destacado" — não basta presença em Termo de Uso genérico. O onboarding atual da Anipis (Closed Beta) precisa expor a transferência internacional como **prompt separado dos ToS**. Ann Cavoukian (Privacy by Design) endossa: "consent layering" reduz risco de viciamento (Art. 8º §1 LGPD) e é state-of-the-art em apps de saúde mental (referências: 7 Cups, Hume AI, Ease Health).

**Dev correlato (controladora-side):** DEV-2 — 4-6h frontend + 2h API. Em sprint, deadline D-7 (23/Mai/2026). Especificação detalhada em `docs/projects/anipis/squad-16mai/13-dev-specs/DEV-2-consent-ui-spec.md`.

---

## Status checklist por edição

| # | GAP | Edição proposta | Status founder | Status Patricia v2 |
|---|-----|-----------------|----------------|--------------------|
| 1 | 10.1(a) prazo | 24h + cap 48h | ✅ Aprovado em squad review | ⏳ Aguardando |
| 2 | Anexo I §F | Caminho A (pseudoanon + audit 5y) | ⏳ Founder decide D-12 | ⏳ Aguardando |
| 3 | Cláusula 12 (f) | FISA/CLOUD Act + transparency report | ✅ Aprovado em squad review | ⏳ Aguardando |
| 4 | Cláusula 7.1 (c.bis) | Consent UI destacado | ⏳ Dev em sprint | ⏳ Aguardando |

---

## Próximos passos

1. **Founder confirma Caminho A** para Edição 2 (recomendação squad)
2. **Email Patricia v2** consolidando as 4 edições (draft em `12-compliance/email-Patricia-v2.md`)
3. **Patricia incorpora em draft v2** → reenviar squad para nova review
4. **Squad valida v2** → libera assinatura (founder + 6 vendors)
5. **Negociação bilateral** Anthropic/OpenAI/Sentry sobre Cláusula 12.1(f) e 13.3 (Plan B em `SCC-squad-legal-review.md` §6)

---

**Reviewer signature:** Squad legal AIOS — Lucia Savage + Bruce Schneier + Ann Cavoukian + Heather Meeker + Patricia Peck clone
**Coordenação:** legal-chief
**Disclaimer:** Análise técnica orientativa. Não substitui consulta com advogada Patricia Peck (OAB) responsável pela minuta final.
