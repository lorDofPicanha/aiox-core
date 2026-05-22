# SCC ANPD Res. 19/2024 — Squad Legal Review

**Documento revisado:** `SCCs-ANPD-19-2024-draft-v1-PatriciaPeck.md` (Patricia Peck Advocacia, draft v1, 17/Mai/2026)
**Squad legal AIOS:** Patricia Peck clone (segunda-opinião) + Lucia Savage (autora spec) + Bruce Schneier (threat model) + Ann Cavoukian (Privacy by Design) + Heather Meeker (contracts/IP) + @tributarista (CNPJ) + @societarista (LIA forma)
**Review date:** 17/Mai/2026
**Deadline duro:** Closed Beta 30/Mai/2026 (D-13)
**Status:** **NEEDS_CHANGES** — minuta substantivamente forte, mas 4 gaps materiais + 6 negociações vendor + 2 dev-tasks pendentes antes da assinatura

---

## 1. Verdict consolidado

**NEEDS_CHANGES** — não é RED_FLAGS, mas também não é GREENLIGHT. A minuta da Patricia é tecnicamente competente (cobre 90% do exigido pela Res. ANPD 19/2024 Anexo II), porém:

- **2 gaps materiais** que, se mantidos, expõem Anipis a sanção Art. 52 LGPD ou recusa de adequação pela ANPD em audit eventual;
- **6 pontos de negociação** com vendors US (Anthropic/OpenAI/Sentry) sabidamente difíceis — Cláusula 12 (autoridades estrangeiras) e Cláusula 13.3 (carve-out responsabilidade) são onde a paz contratual quebra;
- **2 commitments técnicos** assumidos no Anexo I que **ainda não existem em código** (arquivo segregado 5y crisis_events) ou **ainda não estão validados** (output-filter pré-API);
- **3 cosmetic issues** já flagged (10.1(a) vazio, `[object Object]` 2x, founder fields).

Closed Beta 30/Mai **é viável**, mas com risco residual médio se o founder optar pelo caminho "launch com SCCs em assinatura + ZDR ativo + disclosure transparente" — ver §10.

---

## 2. Strengths (o que está acima da média)

1. **Cláusula 9.3 (terceiros beneficiários explícitos)** — vai além do template ANPD Anexo II. Titulares podem exigir direto da OPERADORA. Materialmente importante quando a CONTROLADORA é uma startup que pode insolver — protege as Júlias. Patricia caprichou.
2. **Cláusula 10.3 (notificação 24h para dados sensíveis vs 72h padrão Res. 15/2024)** — endurece o gatilho de forma compatível com a natureza dos dados. Quando uma usuária de saúde mental tem dados vazados, 72h é uma eternidade. Ann Cavoukian endossa.
3. **Cláusula 13.3 (carve-out das limitações de responsabilidade do Acordo Principal)** — corretamente isola dados sensíveis, dolo/culpa grave, arts. 46-49. Bom drafting — mas ver §6 sobre vendors que vão recusar.
4. **Cláusula 4.2 (medidas reforçadas para dados sensíveis)** — alinhado com Art. 11 §3 LGPD e doutrina ANPD. Lista as 4 medidas certas (criptografia, segregação, least privilege, pseudonimização).
5. **Cláusula 17 (renúncia de relatividade contratual)** — reforça 9.3. Inviabilizaria defesa vendor de "contrato é coisa entre partes" se titular processasse diretamente. Heather Meeker nota: é um stipulatio en faveur d'autrui clássico, defensável no civil law brasileiro.
6. **Cláusula 18.3 (revisão em 60d se ANPD emitir norma posterior)** — future-proof inteligente, especialmente útil dado que a Res. 19/2024 ainda terá interpretações de enforcement a serem firmadas.
7. **Anexo VI Langfuse migrado para EU Frankfurt** — Lucia confirma: regime equivalente GDPR/LGPD reduz materialmente o risk profile vs vendor US. Mantém-se assim mesmo no draft, bom.

---

## 3. Gaps materiais (CRÍTICOS)

### GAP-1 — Cláusula 10.1(a) com prazo de notificação de incidente VAZIO

**Impacto:** ALTO. É o gatilho operacional do art. 48 LGPD. Se ficar em branco no instrumento assinado, em caso de incidente real a OPERADORA pode alegar "prazo não pactuado" e atrasar a notificação ao titular para além das 24h prometidas em 10.3.

**Recomendação:** Inserir prazo concreto. Sugestão Bruce + Lucia:
> "(a) **em até 24 (vinte e quatro) horas a contar do momento em que tomar ciência inequívoca do incidente**, podendo ser prorrogado por escrito por CONTROLADORA quando justificadamente necessário para preservar evidências forenses;"

**Coerência:** 10.3 já cita 24h para dados sensíveis. 10.1(a) deve repetir o mesmo prazo (ou estipular 48h cap absoluto, alinhando com Res. ANPD 15/2024 art. 6 §2).

### GAP-2 — Anexo I Supabase §F: "5 anos arquivo segregado crisis_events" promete infraestrutura que NÃO EXISTE no código

**Impacto:** ALTO. Compromisso contratual sem suporte técnico = breach de SCC no primeiro audit ANPD ou no primeiro pedido Art. 18 envolvendo crisis_events. Atualmente:
- `account-deletion-service.ts:499-511` **PSEUDONIMIZA** crisis_events (UPDATE user_id → tombstone + strip `matchedKeywords`) — não arquiva por 5 anos
- Não existe tabela `crisis_events_archive` segregada
- Não existe partitioning ou trigger de movimentação periódica
- Schema `crisis_events` está no main schema (`schema.ts:172`), na mesma tabela viva

A minuta promete "5 anos arquivo segregado" como exceção à retenção de 30d, mas o código pseudonimiza imediatamente. **Há descompasso entre contrato e implementação.**

**Decisão necessária — caminho A ou B:**

- **Caminho A (alinha contrato à realidade):** Trocar "5 anos arquivo segregado" por "pseudonimização imediata com user_id tombstonizado + preservação de hash chain do audit_events; retenção de audit_events por 5 anos para defesa em demanda judicial Art. 7º §3 CPC e Art. 16, II LGPD". **Defensável e veraz.**
- **Caminho B (alinha código ao contrato):** Implementar migration nova com tabela `crisis_events_archive` particionada por ano + trigger ON DELETE/UPDATE em crisis_events que copia o row pseudonimizado pra archive + retenção 5y + purge cron. Custo: 1 dev-day + smoke test E2E.

Lucia favorece **A** (mais simples, igualmente defensável, evita over-engineering 13 dias antes do launch). Bruce concorda — segregação física é nice-to-have, não obrigação Art. 16 II.

**Action:** Founder + Patricia decidem A ou B em D-12 (18/Mai). Recomendação squad = A.

### GAP-3 — Cláusula 12 (autoridades estrangeiras) silenciosa sobre FISA §702 e EO 12333

**Impacto:** MÉDIO-ALTO. A cláusula é genérica ("requisição administrativa/judicial/inteligência"). Não menciona explicitamente:
- **FISA §702** (Foreign Intelligence Surveillance Act, Section 702) — base jurídica da NSA para coleta de comunicações de não-cidadãos US
- **Executive Order 12333** (EO 12333) — coleta extraterritorial sem aviso ao indivíduo
- **CLOUD Act** (Clarifying Lawful Overseas Use of Data Act, 2018) — DOJ pode requisitar dados em servidor US mesmo de não-cidadãos

Por que importa: a Schrems II (CJEU C-311/18) anulou Privacy Shield exatamente porque essas leis US permitem acesso governamental que afasta a "essência da proteção". A doutrina ANPD em formação (ainda não há decisão de adequação publicada — Art. 33 I LGPD) provavelmente seguirá raciocínio análogo.

**Bruce nota:** o draft Patricia tem `(d) Busca suspender via medidas legais quando houver fundamento` — mas FISA §702 ordens vêm com **gag order** (proibição de notificar a parte exportadora). A cláusula 12(a) "notifica CONTROLADORA prontamente (salvo impedimento legal)" cobre a hipótese mas **não exige** que o vendor produza um "transparency report" semestral ou que opte por contestar via TRAP procedure.

**Recomendação:**
> "(f) Quando aplicável regime legal de gag order (e.g., FISA §702, NSL — National Security Letter), OPERADORA compromete-se a contestar a ordem pelos meios legais disponíveis (TRAP procedure, motion to quash) e a divulgar **número agregado** de requisições recebidas em relatório semestral público (transparency report), a ser anexado às reportagens de auditoria desta cláusula 15ª."

Anthropic, OpenAI e Sentry mantêm transparency reports públicos — exigir o número agregado no SCC dá rastreabilidade defensável sob audit ANPD. **Bruce + Heather endossam.**

### GAP-4 — Cláusula 7.1(b) e (c) não amarra UI/UX do consent

**Impacto:** MÉDIO. A cláusula obriga a CONTROLADORA a obter "bases legais + consentimentos (art. 11 LGPD)" e a "informar previamente titulares sobre transferência internacional (art. 9º, VI + art. 33, IV)". Mas o **Art. 11 LGPD exige que o consentimento para dados sensíveis seja "específico" e "destacado"** — não apenas presente.

Onde isso aparece no produto Anipis? Spec Lucia §3 (entrega `requestDeletion` com bloco de confirmação) trata da DELETION, não da COLETA inicial. **O onboarding precisa expor a transferência internacional como prompt destacado, separado dos Termos de Uso genéricos.** Hoje, no código atual, não há essa tela específica documentada na onboarding flow.

**Recomendação:** Adicionar à Cláusula 7.1:
> "(c.bis) Implementar, na jornada de onboarding e antes da primeira coleta de dado sensível, **prompt de consentimento específico e destacado** (Art. 11, I LGPD) que informe: (i) lista de subprocessadores e suas jurisdições; (ii) que dados sensíveis serão tratados; (iii) direito de revogação livre; (iv) que a recusa não impede o uso da Plataforma com funcionalidades limitadas, quando aplicável."

E criar **action item dev** correlato — ver §8 abaixo.

---

## 4. Risco por cláusula

| Cláusula | Risk Level | Issue | Recommendation |
|---|---|---|---|
| 1ª — Definições | 🟢 LOW | Completa, alinhada art. 5º LGPD + art. 3º Res. 19/2024 | Manter |
| 2ª — Objeto | 🟢 LOW | 2.3 "exceto se vendor terms forem mais protetivos" é elegante — preserva ZDR contratual Anthropic | Manter |
| 3ª — Finalidade | 🟢 LOW | 3.2 VEDADO uso próprio bem amarrado | Considerar reforçar com "incluindo melhoria de modelo, RLHF, eval datasets" |
| 4ª — Categorias + 4.2 reforço sensível | 🟢 LOW | Boa | Cavoukian sugere acrescentar "(e) Differential privacy ou k-anonymity quando aplicável a métricas agregadas" |
| 5ª — Duração | 🟢 LOW | OK | — |
| 6ª — Obrigações OPERADORA | 🟡 MEDIUM | 6.1(d) exige ISO 27001 OU SOC 2 Type II — Upstash pode não ter ambos | Verificar Upstash compliance page; se faltar, exigir "ou roadmap documentado com data" |
| 7ª — Obrigações CONTROLADORA | 🟡 MEDIUM | Ver GAP-4 (consentimento destacado faltando UI hook) | Inserir 7.1(c.bis) |
| 8ª — Suboperadoras | 🟢 LOW | 30d aviso + direito oposição é forte | Manter; criar repositório `subprocessor-changes.log` para registrar avisos |
| 9ª — Direitos titulares | 🟢 LOW | 9.3 terceiros beneficiários explícito — caprichou Patricia | Manter |
| 10ª — Incidentes | 🔴 HIGH | **GAP-1: 10.1(a) prazo vazio**; 10.3 24h sensíveis OK | Inserir "24h" em 10.1(a) ou cap 48h |
| 11ª — Onward transfers | 🟡 MEDIUM | OK textualmente, mas vendors US frequentemente já têm onward transfers a AWS/Azure/GCP — Cláusula 8 e 11 podem ser interpretadas conflitantemente | Adicionar parágrafo "Cláusulas 8ª e 11ª complementam-se: alteração de suboperadora também é onward transfer e segue ambos os procedimentos" |
| 12ª — Autoridades estrangeiras | 🔴 HIGH | **GAP-3: FISA/EO 12333/CLOUD Act não nomeados; transparency report não exigido** | Inserir (f) — ver GAP-3 |
| 13ª — Responsabilidade + 13.3 carve-out | 🟡 MEDIUM-HIGH | Heather nota: enforceável no BR (foro 16.2 SP); difícil contra OpenAI/Anthropic — eles vão tentar cortar | Manter como referência; aceitar que negociação reduza para "dolo apenas" (não culpa grave) com vendors recalcitrantes — ver §6 |
| 14ª — Devolução/eliminação | 🟡 MEDIUM | 90d alinha confortavelmente com nosso 30d grace + execução; **mas** 14.3 "retenção legal jurisdição vendor com aviso natureza/prazo + arquivo segregado" repete promessa não-cumprida do Anexo I §F (GAP-2) | Resolver coerência com GAP-2 |
| 15ª — Auditoria | 🟡 MEDIUM | 15.1(c) auditoria in loco — vendors US recusam quase sempre. SOC 2 Type II (15.1(b)) é fallback viável | Aceitar relatórios SOC 2 + ISO 27001 como cumprimento; in loco "salvo justificativa documentada vendor" |
| 16ª — Lei + foro | 🟢 LOW | SP/Capital + CIESP/FIESP arbitragem alternativa é padrão | Manter |
| 17ª — Terceiros beneficiários | 🟢 LOW | Reforça 9.3 | Manter |
| 18ª — Vigência | 🟢 LOW | 60d revisão pós-norma ANPD é proativo | Manter |

---

## 5. Risco por vendor

| Vendor | Top 3 Issues | Mitigation |
|---|---|---|
| **Supabase** | (1) **GAP-2**: 5y arquivo segregado crisis_events não existe; (2) Pro tier obrigatório para DPA — confirmar contratação; (3) AWS us-east-1 → Cláusula 12 ativa (Caminho A: pseudonimização imediata) | Decidir caminho A; confirmar Pro; arquivar DPA + SCC em Drive |
| **Anthropic** | (1) ZDR Enterprise precisa **cláusula contratual explícita** — não basta dashboard setting; (2) Cláusula 13.3 (sem cap responsabilidade dados sensíveis) será resistida; (3) Suboperadoras AWS+GCP multi-região — onward transfer Cláusula 11 a documentar | Exigir DPA com Enterprise + ZDR como cláusula expressa; aceitar fallback 13.3 limitado a dolo (não culpa grave); ler Anthropic Trust Center subprocessor list e anexar como Anexo II.bis |
| **OpenAI** | (1) ZRT precisa estar **ativado no dashboard** AND **mencionado no DPA assinado**; (2) Default API retém 30d — janela aberta se ZRT não ativo; (3) Microsoft Azure subprocessor — afeta análise FISA/CLOUD Act | Ativar ZRT antes da primeira chamada; obter Zero Retention DPA via privacy@openai.com; documentar Azure no Anexo III §H |
| **Sentry** | (1) `[VALOR FALTANDO: hook beforeSend]` no §G é literal gap no draft — repor; (2) LIA documentada faltando; (3) 90d retention default — pode reduzir a 30d no tier Business | Devops audit do `Sentry.init({ beforeSend })` confirmando filtra `userId/email/messageContent`; redigir LIA (modelo abaixo); habilitar 30d retention |
| **Upstash Redis** | (1) `[VALOR FALTANDO: hook ou pattern de purge]` no §G — repor; (2) **Quick-win recomendado**: migrar `aws-sa-east-1` (São Paulo) — elimina cross-border, custo ~zero; (3) TLS sim, mas validar at-rest encryption no Pro | Migrar São Paulo em D-10 a D-7; documentar pattern purge: `userId:*` e `*:userId:*` (já existe em `cache-purge.ts`); arquivar DPA público |
| **Langfuse** | (1) EU Frankfurt = regime equivalente, low risk; (2) Tier Pro necessário (free sem DPA); (3) Retention 14d vs default 60d — exige configuração no painel | Upgrade Pro (custo modesto), retention=14d, assinar DPA EU |

---

## 6. Pontos de negociação prováveis (onde vendors vão tentar cortar)

Tier Patricia + Heather Meeker pre-mortem do que vendors US tipicamente recusam:

### 6.1 Cláusula 12 (autoridades estrangeiras) — **Anthropic + OpenAI + Sentry vão pushar**

**Razão:** Eles têm obrigações legais sob FISA/CLOUD Act que conflitam com 12(d) "busca suspender via medidas legais". Não podem prometer suspender uma ordem secreta.

**Plan B:**
- Aceitar redação suavizada: "(d) Busca contestar via medidas legais disponíveis e proporcionais, sem prejuízo de obrigações legais imperativas da jurisdição da OPERADORA"
- Compensar exigindo transparency report semestral (GAP-3) como evidência alternativa
- **Não aceitar** corte total da 12(a) — notificação prompt é o mínimo defensável

### 6.2 Cláusula 13.3 (carve-out limitação responsabilidade) — **Todos vendors US vão pushar**

**Razão:** Limitation of liability é commercial standard. Cap usual: 12× monthly fees, ou USD 1MM, o que for menor. Cláusula 13.3 sem cap para dados sensíveis é asymmetric vs negócio do vendor.

**Plan B (em ordem de preferência squad):**
1. Manter como está e tentar empurrar
2. Aceitar cap **somente** para "culpa grave" mantendo "dolo" e "violação arts. 46-49 LGPD" sem cap
3. Aceitar cap de 24× monthly fees ou USD 5MM (o maior) — ainda é >10× cap padrão
4. **Linha vermelha:** Não aceitar cap em dolo deliberado nem em violação intencional arts. 46-49 — se vendor recusar, escalar

### 6.3 Cláusula 15.1(c) (auditoria in loco/remota) — **Todos vão pushar**

**Razão:** Open audit right é riscoso para vendors multi-tenant. SOC 2 Type II + ISO 27001 são substitutos padrão.

**Plan B:** Aceitar 15.1(b) (SOC 2 + ISO 27001 reports com NDA) como cumprimento PADRÃO. In loco only em caso de incidente confirmado (já textualmente previsto).

### 6.4 Cláusula 14.1(b) (eliminação em 90d inclusive backups) — **Supabase + Sentry podem pushar**

**Razão:** Backups têm rotational policies próprias (90-365d em alguns vendors).

**Plan B:** Aceitar "eliminação operacional em até 30d e eliminação total inclusive backups em até 180d, com aviso de janela em backup-only não-acessível". Documentar em Privacy Policy.

### 6.5 Cláusula 16.2 (foro SP) — **Vendors podem pushar para foro próprio**

**Razão:** Vendors prefer Delaware/SF jurisdiction.

**Plan B:** Aceitar arbitragem CIESP/FIESP (16.3) como compromisso. Subsidiariamente, foro SP. **Não aceitar** Delaware ou outro foro US — destruiria efetividade prática.

### 6.6 Cláusula 9.3 (terceiros beneficiários direto contra OPERADORA) — **Anthropic + OpenAI vão pushar**

**Razão:** Direct enforceability por titulares brasileiros é exposure inusual para vendors US.

**Plan B:** **Manter como está** — é o coração da proteção das Júlias. Se vendor recusar absolutamente, isso é red flag e devemos considerar vendor alternativo (Mistral, Cohere — ver §9).

---

## 7. Items que requerem dev work (antes da assinatura do SCC)

| # | Item | Driver | Effort | Deadline |
|---|---|---|---|---|
| DEV-1 | **Decisão GAP-2 caminho A ou B**: se B, criar migration `crisis_events_archive` + trigger + retention cron 5y | Anexo I Supabase §F | A: 0h doc-only; B: 1 dev-day | D-12 (18/Mai) |
| DEV-2 | **Consent UI específico+destacado para transferência internacional** (GAP-4) — antes da primeira coleta de dado sensível no onboarding | Cláusula 7.1 + Art. 11 I LGPD | 4-6h frontend + 2h API | D-7 (23/Mai) |
| DEV-3 | **Validar `Sentry.init({ beforeSend })` filtra `userId/email/content`** — Anexo IV §G placeholder | SCC Anexo IV | 1h audit | D-10 (20/Mai) |
| DEV-4 | **Migrar Upstash para `aws-sa-east-1` (São Paulo)** — Anexo V quick-win | Anexo V §G | 1-2h | D-7 (23/Mai) |
| DEV-5 | **Ativar OpenAI ZRT no dashboard** + screenshot evidência | Anexo III §F | 30min | D-10 (20/Mai) |
| DEV-6 | **Verificar Anthropic Enterprise tier + ZDR cláusula DPA** vs apenas dashboard | Anexo II §F | 30min review | D-10 (20/Mai) |
| DEV-7 | Snapshot output-filter pré-API (Anexo II §D, Anexo III §D) — testes regressivos garantindo PII strip funcional | Cláusula 4.2 + Anexos | já existe? validar | D-7 (23/Mai) |

**Total:** 1 decisão (DEV-1A recomendada = 0h) + ~10-12 dev-hours distribuídas em 13 dias. **Viável.**

---

## 8. Founder action items (ordenados por urgência)

### D-13 a D-11 (17-19/Mai) — esta semana

1. **CNPJ + endereço CONTROLADORA**: decidir se ME ativa atual ou criar PJ específica para Anipis. **@tributarista nota:** ME atual já basta no Closed Beta; criação de PJ pode ser pós-launch. Action: preencher Preâmbulo + Anexos.
2. **Confirmar Patricia Peck contratada** + brief inicial → fechar honorários (R$ 5-15k esperado)
3. **Endereço email dedicado a incidentes:** criar `security@anipis.com.br` ou equivalente — Cláusula 10.1(b)
4. **Decidir GAP-2 caminho A vs B** com Patricia (recomendação squad: A)
5. **Decidir GAP-4** prompt onboarding destacado — fechar UX com design squad

### D-10 a D-7 (20-23/Mai)

6. **LIA Sentry**: redigir Legitimate Interest Assessment (modelo abaixo em §11). Mesma estrutura LIA Langfuse.
7. **LIA Langfuse**: idem (justificativa: traces de qualidade técnica, sem PII bruta, EU-hosted = baixo risco titular)
8. **Ativar OpenAI ZRT no dashboard** (DEV-5) — irreversível pré-launch
9. **Confirmar Anthropic Enterprise + ZDR** (DEV-6) ou abrir negociação tier
10. **Sign Supabase Pro DPA + Sentry DPA + Upstash DPA + Langfuse DPA** (todos download direto)

### D-6 a D-3 (24-27/Mai)

11. **Receber draft SCC v2 da Patricia** (com correções squad incorporadas)
12. **Negociar SCC bilateral com Anthropic** — provavelmente requer email back-and-forth com legal team deles (Patricia conduz)
13. **Negociar SCC bilateral com OpenAI** (idem)
14. **DPO sign-off interim** — founder formaliza como DPO interim (Art. 41 LGPD não exige certificação; experiência suficiente). Documento curto em PDF arquivado Drive.

### D-2 a D-1 (28-29/Mai)

15. **Final review SCCs assinadas** — checar 6 anexos, sem placeholders
16. **Privacy Policy + Termo Beta v1 (Patricia)** publicados em `anipis.com.br/legal/`
17. **Notification email pré-Beta** às 20 Júlias com disclosure
18. **Smoke test E2E Art. 18** (item operacional)

### D-Day (30/Mai)

19. **Launch Closed Beta** com SCCs assinadas + disclosure transparente

---

## 9. Plan B — vendor recusa cláusula crítica

Cenários e workarounds, ordenados por probabilidade:

### Cenário A — Anthropic recusa Cláusula 9.3 (terceiros beneficiários)

**Probabilidade:** Média (Anthropic geralmente coopera, mas pode pushar)

**Workarounds:**
1. **Reforço unilateral:** Anipis assume responsabilidade objetiva perante titular pelo descumprimento da Anthropic (Art. 42 LGPD já garante isso por solidariedade). Cláusula 9.3 vira declarativa, não constitutiva — funciona mesmo se Anthropic não assinar essa parte.
2. **Vendor alternativo:** Mistral (FR) tem footprint EU + boa cobertura PT. Cohere (CA) tem ZDR contratual. Migration cost ~2-3 dev-days.
3. **Linha vermelha:** **Não aceitar** Anthropic se eles eliminarem 9.1 (responde por danos) inteiramente — sem isso a SCC vira teatro.

### Cenário B — OpenAI recusa Zero Retention contratual (mantém apenas dashboard setting)

**Probabilidade:** Baixa-Média (OpenAI tem Zero Retention DPA padrão)

**Workarounds:**
1. **Documentar dashboard setting** via screenshot + atestado anual de cumprimento (Cláusula 6.1(d))
2. **Vendor alternativo:** Mistral, Cohere (idem cenário A); Anthropic ZDR é vendor-substituto natural
3. **Linha vermelha:** Não usar API sem ZRT garantido. Default 30d para dados sensíveis = violação prática de Cláusula 14.

### Cenário C — Sentry recusa carve-out 13.3 totalmente

**Probabilidade:** Alta (Sentry é US, B2B SaaS standard)

**Workarounds:**
1. **Aceitar cap de responsabilidade padrão** (12× monthly fees ou USD 1MM) APENAS para Sentry — justificável porque Sentry recebe **apenas** PII filtrada por hook (Anexo IV §D), não conteúdo sensível bruto. Risk profile lower que LLM providers.
2. **Mitigation técnica:** dobrar agressividade do `beforeSend` filter — assegurar zero PII via testes regressivos
3. **Vendor alternativo:** GlitchTip (self-hosted Sentry fork, OSS) — elimina cross-border. Custo: 1-2 dev-days + infra. Trade-off: perde APM features.

### Cenário D — Patricia recomenda slip para 7/Jun ou 14/Jun

**Probabilidade:** Média (depende de quanto tempo negociação vendors leva)

**Workarounds:**
1. **Slip soft (7/Jun):** 8 dias é absorvível, baixo custo de feedback Júlias perdido. Squad endossa.
2. **Slip duro (14/Jun ou Q2):** colide com D-04 clinical co-founder LOI 13/Jun — sem clinical co-founder e sem launch o projeto vira limbo regulatório. Squad **vetaria** slip além de 7/Jun.
3. **Launch híbrido:** lançar com 5 Júlias (não 20) em 30/Mai como soft validation, full 20 quando SCCs assinadas. Reduz exposure proporcionalmente.

---

## 10. Verdict pra Closed Beta 30/Mai launch

**Squad consenso: VIÁVEL com risco residual médio — slip para 7/Jun é mais seguro mas não obrigatório.**

### Cenário GO-30/Mai (recomendação primária se itens abaixo fecharem)

**Pré-condições inegociáveis (TODOS devem estar verdes em D-1 29/Mai):**

- [ ] Patricia draft v2 incorporando squad review (GAP-1, 2, 3, 4) assinada por todos os vendors **ou** em status "negociação ativa documentada" com evidência email com legal teams
- [ ] DPAs públicos vendor (Supabase, Sentry, Upstash, Langfuse) **assinados** — esses não dependem de bilateral
- [ ] OpenAI ZRT ativado no dashboard (screenshot)
- [ ] Anthropic Enterprise tier confirmado (mesmo que SCC bilateral ainda em negociação, ZDR contratual é o crítico)
- [ ] DEV-1 (caminho A) executado (alinhamento documental contrato↔código)
- [ ] DEV-2 (consent UI destacado) live em production
- [ ] DEV-3 (Sentry beforeSend) auditado
- [ ] DEV-4 (Upstash São Paulo) migrado
- [ ] DPO sign-off interim formal (founder)
- [ ] Privacy Policy v1 + Termo Beta v1 publicados
- [ ] Notification email pré-Beta enviado às 20 Júlias 24h antes (29/Mai)
- [ ] Suite tests 100% green (já está — 827/827)

**Disclosure obrigatório no email pré-Beta + no app onboarding:**

> "Antes de você começar a usar a Anipis, queremos te contar com transparência: algumas das ferramentas que usamos para te atender melhor rodam em outros países (EUA, Europa). Já temos contratos de proteção de dados (DPAs) assinados e estamos finalizando contratos brasileiros adicionais (SCCs ANPD) com cada um deles — em conformidade com a Lei Geral de Proteção de Dados (LGPD). Você pode ler a lista completa e nossa Política de Privacidade em [link]. Topa começar?"

### Cenário GO-7/Jun (recomendação secundária se 30/Mai não fechar 100%)

Trade-off: 8 dias = oportunidade para 1 ronda completa de negociação com Anthropic/OpenAI bilateral. Sem custo material — 7/Jun ainda preserva D-04 13/Jun como gate clinical co-founder.

### Cenário SLIP > 7/Jun

**Squad veta.** Colisão com D-04 + risco de paralisia regulatória. Se algo bloqueia além de 7/Jun, escalar para revisão de scope (lançar com 5 Júlias em vez de 20, etc).

---

## 11. Apêndice — Modelo LIA Sentry/Langfuse (para founder usar)

```
LEGITIMATE INTEREST ASSESSMENT (LIA)
====================================
Controladora: ANIPIS [CNPJ]
Operadora: Sentry [Razão Social, US]
Base legal: Art. 7º, IX LGPD — interesse legítimo
Data: __/Mai/2026

A. PURPOSE TEST
---------------
Finalidade: Monitoramento de erros, exceções e performance da aplicação
Anipis para garantir disponibilidade, segurança e qualidade da experiência
das usuárias.

A finalidade é específica? SIM (observabilidade técnica)
A finalidade é legítima? SIM (Art. 6º, II LGPD — adequação; Art. 6º, VI —
transparência; necessidade operacional de plataforma SaaS)
Há outra base legal aplicável? NÃO (não é execução de contrato,
não é consentimento — é processamento técnico inerente ao serviço)

B. NECESSITY TEST
-----------------
Os dados tratados são adequados à finalidade? SIM (stack traces +
metadados — sem PII bruta via beforeSend filter)
Existe meio menos invasivo? Self-hosted Sentry (GlitchTip) seria
alternativa, mas exige infra adicional + impossibilita observabilidade
em produção remota. Trade-off operacional substantivo.
Volume é proporcional? SIM (apenas erros + spans amostrados)

C. BALANCING TEST
-----------------
Expectativa razoável do titular: ALTA — usuárias de SaaS esperam que
problemas técnicos sejam diagnosticados pelo fornecedor
Impacto sobre o titular: BAIXO — sem PII bruta (filtrada); sem decisão
automatizada afetando o titular; sem perfil comportamental
Salvaguardas:
  - beforeSend hook filtra emails, IDs gov, conteúdo de mensagens
  - Retenção 30-90d (configurada)
  - DPA assinado + SCC ANPD Res. 19/2024 anexado
  - Direito de oposição garantido (Art. 18, §2 — não impede operação;
    titular pode pedir opt-out de telemetria)

D. CONCLUSÃO
-----------
O tratamento se justifica sob Art. 7º, IX LGPD. Risco residual baixo.
LIA será revisada anualmente ou a cada alteração material no produto.

Assinatura DPO interim: ________________
Data: ____/____/2026
```

(Mesmo modelo para Langfuse, ajustando finalidade para "logging/observabilidade chamadas LLM, métricas de qualidade".)

---

## 12. Sumário executivo (1-pager para founder)

| Pergunta | Resposta |
|---|---|
| Draft Patricia é boa? | **Sim, 90%.** Acima da média do mercado. Cláusulas 9.3, 10.3, 13.3 são fortes. |
| Posso assinar como está? | **Não.** 4 gaps materiais (10.1(a) prazo vazio, Anexo I 5y crisis_events sem código, Cláusula 12 sem FISA, Cláusula 7 sem UI hook). |
| Quanto custa fechar gaps? | **0 dinheiro novo.** 1 decisão founder (caminho A GAP-2) + 10-12 dev-hours + 1 ronda Patricia v2. |
| Vendors vão recusar coisas? | **Sim, esperado.** Plan B em §9 cobre Anthropic/OpenAI/Sentry. |
| Closed Beta 30/Mai dá? | **Sim, viável.** Com 11 pré-condições em §10. Slip para 7/Jun é mais seguro mas não obrigatório. |
| Risco se eu lançar 30/Mai mesmo com SCCs em assinatura? | **Médio.** Disclosure transparente + ZDR ativado + DPAs públicos assinados mitigam para baixo-médio. ANPD audit improvável em Closed Beta 20 usuárias sem reclamação. |
| Se eu pular o SCC totalmente (só DPA público)? | **Alto risco.** Art. 33 II LGPD exige garantia específica. ANPD pode interpretar DPA-only como insuficiente para dados sensíveis. |
| Preciso de mais especialistas? | **Não para SCC.** Para Privacy Policy + Termo Beta — Patricia já cobre. Para DPO efetivo (não interim) — eventual contratação Q3. |

---

## 13. Disclaimer

> Este parecer é análise técnica do squad legal AIOS sobre minuta de SCC elaborada por escritório OAB externo. **Não substitui** assinatura da advogada Patricia Peck no instrumento final, nem dispensa o founder de DPO interim revisar pessoalmente. Reflete state-of-the-art ANPD Res. 19/2024 conhecido em **17/Mai/2026** — alterações regulatórias posteriores podem afetar conclusões. Para questões específicas de jurisdição estrangeira (FISA, CLOUD Act, GDPR Schrems II), consulte advogado de jurisdição relevante.
>
> ⚠️ Esta análise é orientativa e não substitui consulta com advogado.

---

**Reviewer signature:** Squad legal AIOS — Patricia Peck (segunda-opinião) + Lucia Savage (autora spec) + Bruce Schneier (threat model) + Ann Cavoukian (Privacy by Design) + Heather Meeker (contracts)
**Coordenação:** legal-chief
**Próximo update:** Pós-Patricia v2 (estimado D-9 a D-7, 21-23/Mai)
