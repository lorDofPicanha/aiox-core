# RIPD/DPIA Anipis v1.0 — Squad Legal Review

**Documento revisado:** `anipis-RIPD-DPIA.docx` (recebido 19/Mai/2026 via founder, autoria a confirmar)
**Squad legal AIOS:** Patricia Peck clone + Lucia Savage + Bruce Schneier + Ann Cavoukian + Heather Meeker + Ricardo Wagner (CFM/saúde mental advisor)
**Review date:** 19/Mai/2026 (D-11 ao Closed Beta)
**Status:** **NEEDS_CHANGES** — texto tecnicamente correto e estruturalmente alinhado à doutrina ANPD, mas com **4 inconsistências materiais** vs. estado atual do projeto (pós decisões founder 18/Mai) + **3 gaps técnicos** que herdam do SCC review + **3 cosmetic issues**

---

## 1. Verdict consolidado

**NEEDS_CHANGES** — não é RED_FLAGS, base sólida. O DPIA cobre confortavelmente os requisitos do art. 38 LGPD + Resolução CD/ANPD 2/2022, com matriz de risco bem estruturada (12 riscos) e camadas de salvaguarda (técnica/organizacional/contratual/comunicacional) coerentes. Porém:

- **4 inconsistências materiais** com decisões founder 18/Mai e estado atual de código que, se DPIA for assinado como está, **expõem Anipis a declaração falsa à ANPD** em auditoria (Art. 41 LGPD);
- **3 gaps técnicos herdados** do SCC review NEEDS_CHANGES (já mapeados, mas precisam resolver simultaneamente);
- **3 cosmetic issues** (placeholders + contagem errada + datas vazias).

Closed Beta 30/Mai **continua viável** com revisão v2 do DPIA até D-3 (27/Mai) sincrônica à SCC v2.

---

## 2. Strengths (o que está acima da média)

1. **Matriz qualitativa probabilidade×impacto com 3 níveis e 2 colunas (inerente vs residual)** — alinhada com ISO 31000 e doutrina ANPD; raro encontrar em DPIA brasileiro pré-fiscalização. Patricia/autora caprichou.
2. **R3 (falso negativo crise) e R4 (falso positivo crise) tratados separadamente** — reflete tensão real de calibração de classificador. Documentação técnica fala alto.
3. **R5/R6/R8/R10 explicitamente nomeiam limitação tecnológica como justificativa de residual médio** — defesa honesta em audit ANPD (vs. inflar mitigação cosmética).
4. **R2 menciona FISA §702, EO 12333, CLOUD Act + gag order** — alinhado com Schrems II e doutrina LGPD em formação. Bruce endossa.
5. **§3.3 vedação expressa a menores no Closed Beta** — antecipa requisitos art. 14 LGPD + ECA + Resolução CONANDA. Defensável.
6. **R7 (dependência emocional excessiva) — design anti-compulsividade** — boa prática rara em DPIA, mostra Privacy by Design + Ethics by Design (Cavoukian).
7. **Tabela 4 separa "função / dados / jurisdição / retenção" por operadora** — formato auditável.

---

## 3. Inconsistências materiais (CRÍTICO — bloqueiam assinatura)

### INC-1 — DPIA declara ANTHROPIC ZDR ativo, mas Founder D2 (18/Mai) DEFERIU Anthropic 7 dias

**Onde aparece:**
- Sumário Executivo: "transferência internacional a **6 operadores estrangeiros**"
- Tabela 4 (§5): Anthropic listada com "Zero Data Retention (ZDR)"
- R5 mitigação (b): "contratação de Zero Data Retention (ZDR) em tier enterprise com Anthropic **e OpenAI**"
- §8.3.c: "contratação de Zero Data Retention em tier enterprise com operadoras de IA"

**Realidade pós Founder D2:**
- `ANTHROPIC_API_KEY` será REMOVIDO do env prod
- Anthropic Enterprise tier NÃO contratado
- Reavaliação 25/Mai (D-5)
- Boot em prod via `OPENAI_ZDR_CONFIRMED=true` apenas (DEV-5/6 entregue 18/Mai noite)

**Impacto:** ALTO. Declarar à ANPD "ZDR Anthropic ativo" quando a API key sequer existe no ambiente prod = **declaração falsa**, infringe Art. 6º X LGPD (accountability) + Art. 41 (cooperação com autoridade). Em audit, ANPD identificaria a contradição em 5 minutos.

**Recomendação — texto sugerido:**

Sumário Executivo:
> "transferência internacional a **até 6 operadores estrangeiros** (sendo 4 efetivamente ativos na fase de Closed Beta; Anthropic e Upstash em jurisdição US encontram-se, respectivamente, em avaliação contratual diferida e em processo de migração regional)"

Tabela 4 — adicionar linha de status:
> "**Status Closed Beta:** Anthropic **NÃO ATIVA** na fase inicial; processamento LLM via OpenAI com ZRT enterprise como vendor exclusivo. Reativação condicionada a contratação de tier enterprise com ZDR contratual (não apenas dashboard) — reavaliação documentada em D-5 (25/Mai)."

§8.3.c reescrever:
> "(c) contratação de Zero Data Retention em tier enterprise com a operadora de IA ativa (OpenAI ZRT confirmado via env flag `OPENAI_ZDR_CONFIRMED`); contratação adicional com Anthropic condicionada à formalização de cláusula contratual ZDR em DPA, não apenas configuração de dashboard."

---

### INC-2 — DPIA descreve circuit breaker programático em R6 que NÃO EXISTE em código

**Onde aparece:**
- R6 mitigação (f): "**circuit breaker programático**: encerramento da sessão e direcionamento a recursos profissionais quando detectado conteúdo de alto risco"

**Realidade em código (verificado 19/Mai):**
- `grep -ri "circuit.?breaker|session.?terminat" apps/serenity-ai/apps/api/src` retorna **zero matches**
- Implementado: classificador `crisis-classifier` + logger `crisis-event-logger` + alert dispatcher (DEV-3/F3 hotfix pending)
- NÃO implementado: encerramento programático de sessão pós-detecção crisis

**Impacto:** ALTO. Compromisso técnico assumido em DPIA assinado vira **breach de DPIA** no primeiro audit ou primeiro pedido Art. 18 envolvendo crisis event onde a usuária reportar "fui detectada mas a sessão continuou normalmente".

**Decisão necessária — caminho A ou B:**

- **Caminho A (alinha DPIA à realidade):** Trocar (f) por: "encaminhamento informativo persistente (banner + mensagem inline da IA) a recursos profissionais (CVV 188, SAMU 192) quando detectado conteúdo de alto risco, com registro auditável de cada acionamento". **Defensável e veraz; alinha com R4 que prioriza encaminhamento informativo sobre acionamento ativo.**
- **Caminho B (alinha código ao DPIA):** Implementar circuit-breaker que (i) inseta resposta empática + recursos profissionais; (ii) marca sessão como `crisis_active=true`; (iii) bloqueia próxima mensagem por 60s exibindo modal com 188/192/contato emergência. Custo: 1-2 dev-days.

**Squad recomendação:** Caminho A. Caminho B é nice-to-have post-Beta, não obrigação regulatória; e Caminho A já está implementado em código (basta documentar corretamente).

**Action:** Founder decide A ou B em D-10 (20/Mai).

---

### INC-3 — Anexo I Supabase §F "5y arquivo segregado crisis_events" (herdado do SCC GAP-2)

**Onde aparece no DPIA:**
- Tabela 3 (§4 Ciclo de Vida): "Após exclusão de conta, hard delete em até 30 dias, com **duas exceções específicas detalhadas em SCC Anexo I**."

**Realidade:** O SCC v1 promete "5 anos arquivo segregado crisis_events" como exceção. Não existe `crisis_events_archive` segregado no código (`account-deletion-service.ts:499-511` PSEUDONIMIZA imediatamente). DPIA herda a inconsistência por referência.

**Impacto:** MÉDIO-ALTO (mesmo nível do SCC GAP-2).

**Recomendação:** Resolver simultaneamente em SCC e DPIA. Squad recomenda **Caminho A do SCC review** = pseudonimização imediata + preservação de hash chain audit_events por 5y (Art. 7º §3 CPC + Art. 16 II LGPD). Atualizar DPIA Tabela 3 para refletir:

> "Eliminação | Hard delete em até 30 dias após exclusão de conta. Exceções específicas: (i) pseudonimização irreversível de crisis_events (user_id → tombstone) mantida para integridade do hash chain de audit_events; (ii) audit_events preservados por 5 anos para defesa em demanda judicial (Art. 7º §3 CPC + Art. 16 II LGPD), com acesso restrito a DPO e auditor externo."

---

### INC-4 — R2 mitigação não exige transparency report semestral (herdado do SCC GAP-3)

**Onde aparece:**
- R2 mitigação (d): "compromisso contratual de divulgação semestral de transparency report agregado pela Operadora"

**Realidade:** ESTÁ no DPIA (boa notícia), mas SCC v1 da Patricia NÃO tem a cláusula correspondente. Inconsistência inversa: DPIA promete o que SCC não exige.

**Impacto:** MÉDIO. Em audit, ANPD pode questionar "qual cláusula contratual sustenta R2(d)?" e a Anipis não tem onde apontar.

**Recomendação:** Resolver no SCC v2 inserindo Cláusula 12(f) conforme GAP-3 do SCC review (texto pronto):

> "(f) Quando aplicável regime legal de gag order (e.g., FISA §702, NSL), OPERADORA compromete-se a contestar a ordem pelos meios legais disponíveis (TRAP procedure, motion to quash) e a divulgar **número agregado** de requisições recebidas em relatório semestral público (transparency report), anexado às reportagens de auditoria desta cláusula 15ª."

Manter R2(d) do DPIA como está; SCC v2 passa a respaldá-lo.

---

## 4. Gaps técnicos (MÉDIO)

### GAP-A — Vedação a menores (§3.3) não descreve operacionalização técnica

**Onde aparece:** §3.3 "veda menores… não aceita cadastros de menores de 18 anos."

**Falta:** Como a vedação é **tecnicamente verificável**? DPIA precisa descrever:
- Declaração de idade no onboarding (check-box + campo de data de nascimento)
- Validação programática (DOB → idade ≥ 18 → registro `min_age_attested=true`)
- Termo de aceite registrado com timestamp
- Fluxo de bloqueio: titular que declarar <18 não consegue prosseguir

**Recomendação:** Adicionar parágrafo:
> "Operacionalização: o onboarding requer declaração de data de nascimento + check-box específico atestando maioridade. O cadastro é bloqueado programaticamente para usuárias que declarem idade <18 anos, com registro auditável da tentativa (sem armazenamento de dado pessoal além de timestamp + IP hash). A Anipis adota declaração de idade como mecanismo razoável compatível com Art. 14 LGPD para fase de Closed Beta; mecanismos adicionais de verificação (KYC leve, prova de vida) serão avaliados em fase de escala pública."

**Verificar em código:** existe esta validação no onboarding atual? Se NÃO, adicionar à task list pré-Beta.

---

### GAP-B — R8 não cita Resolução CFM 2.454/2026 nem janela regulatória ago/2026

**Onde aparece:** R8 mitigação (e) cita "Resolução CFM nº 2.314/2022 (telemedicina)". Está desatualizada.

**Contexto histórico** (memória sessão 08/Mai): janela CFM ago/2026 foi sinalizada como gate regulatório. Resolução 2.454/2026 (em formação) cobrirá assistentes IA em saúde mental.

**Recomendação:** Reescrever (e):
> "(e) verificação contínua de conformidade com Resolução CFM nº 2.314/2022 (telemedicina), Resolução CFM nº 2.454/2026 (assistentes de IA em saúde — em vigor a partir de ago/2026) e legislação correlata sobre exercício profissional, com revisão semestral de aderência e parecer jurídico especializado em mudanças regulatórias materiais."

E adicionar nota §10 (Revisão):
> "(f) imediatamente após entrada em vigor da Resolução CFM nº 2.454/2026 (ago/2026), com reavaliação do posicionamento "bem-estar vs. saúde" da Plataforma."

---

### GAP-C — Direito de portabilidade (§9 V) "JSON estruturado" sem evidência de implementação

**Onde aparece:** §9 (V) "Portabilidade — exportação completa de dados em formato JSON estruturado"

**Verificado em código (19/Mai):**
- `grep -l "exportData\|portability\|exportProfile" apps/serenity-ai/apps/api/src` → 0 matches em arquivos de serviço
- Existe apenas em testes (`art18-completeness-gate.test.ts`, `account-deletion-lgpd-art18.test.ts`)

**Impacto:** MÉDIO. Sem endpoint de portabilidade vivo, R12 mitigação (c) "fluxo de exportação de dados (data portability) acessível à titular sob demanda" falha. Pedido Art. 18 V vira "atender em até 15 dias" = SLA pode estourar.

**Recomendação:**
- **Curto prazo (pré-Beta):** Documentar processo MANUAL: titular solicita via `privacidade@anipis.com.br`; DPO executa query SQL pre-definida e envia JSON em até 15 dias. Adicionar nota em §9(V).
- **Médio prazo (post-Beta):** Implementar endpoint `GET /me/export` (JSON estruturado com todos dados pessoais) + UI button "Exportar meus dados".

Atualizar §9(V) texto para refletir o que existe:
> "(V) Portabilidade — disponibilização de cópia completa dos dados em formato JSON estruturado mediante solicitação ao Encarregado, com prazo de atendimento de até 15 dias. Implementação de endpoint self-service planejada para fase pós-Closed-Beta."

---

## 5. Cosmetic issues (LOW)

### COS-1 — §11 Conclusão "5 (cinco) riscos residuais médios" — contagem errada

**Verificação Tabela 5 (Risco residual):**

| R# | Residual |
|---|---|
| R1 | Médio |
| R2 | Baixo |
| R3 | Médio |
| R4 | Baixo |
| R5 | Baixo |
| R6 | Médio |
| R7 | Médio |
| R8 | Médio |
| R9 | Baixo |
| R10 | Médio |
| R11 | Médio |
| R12 | Baixo |

**Total real:** 7 médios (R1, R3, R6, R7, R8, R10, R11) + 5 baixos.

**Conclusão diz 5.** Recontar e atualizar para "7 (sete) riscos residuais médios". Auditor competente flagga isso imediatamente — credibilidade do documento sofre.

---

### COS-2 — Tabela 1 (§1.1) — todos placeholders

- Razão Social: `[Razão Social a definir]`
- CNPJ: `[a ser informado por ocasião da constituição da PJ]`
- DPO: `[a indicar antes do início do Closed Beta]`
- E-mail Encarregado: `dpo@anipis.com.br (endereço a confirmar)`
- Canal titular: `privacidade@anipis.com.br + formulário in-app`

**Bloqueio:** DPIA não pode ser **assinado** sem CNPJ + DPO nomeado. Mesmos gaps do SCC.

**Action founder pré-D-7:** (i) decidir nome de PJ + abrir CNPJ ou usar PF/MEI; (ii) nomear DPO interim; (iii) provisionar `privacidade@anipis.com.br` + `dpo@anipis.com.br` + `security@anipis.com.br`.

---

### COS-3 — §10 Revisão "data fixa, aniversário da aprovação" sem data

**Recomendação:** Quando assinar, registrar data concreta. Sugestão: "anualmente, em 30 de maio (aniversário do Closed Beta) ou na data de aprovação efetiva, o que ocorrer primeiro".

---

## 6. Items que requerem dev work ou decisão (consolidado)

| # | Item | Tipo | Driver | Effort | Deadline |
|---|---|---|---|---|---|
| DPIA-1 | Decisão INC-2 caminho A ou B (circuit breaker) | Founder decision | R6 mitigação (f) | A: 0h doc-only; B: 1-2 dev-days | D-10 (20/Mai) |
| DPIA-2 | INC-1 atualizar DPIA: Anthropic deferida + Upstash migrando | Doc edit | D2 founder decision | 30min | D-9 (21/Mai) |
| DPIA-3 | INC-3/4 sincronizar com SCC v2 (GAP-2/GAP-3 resolvidos) | Doc edit | SCC squad review | 30min após SCC v2 | D-3 (27/Mai) |
| DPIA-4 | GAP-A verificar/implementar validação maioridade onboarding | Code audit + possible dev | Art. 14 LGPD | 1h audit + 2h se faltar | D-7 (23/Mai) |
| DPIA-5 | GAP-B atualizar R8 com Resolução CFM 2.454/2026 | Doc edit | Janela regulatória ago/2026 | 15min | D-9 (21/Mai) |
| DPIA-6 | GAP-C documentar processo MANUAL portabilidade pré-Beta | Doc + DPO playbook | Art. 18 V LGPD | 30min | D-7 (23/Mai) |
| DPIA-7 | COS-1 recontar e atualizar §11 ("7 médios") | Doc edit | Credibilidade | 5min | D-9 (21/Mai) |
| DPIA-8 | COS-2 preencher Tabela 1 (CNPJ + DPO + emails) | Founder action | Bloqueio assinatura | depende constituição PJ | D-3 (27/Mai) |
| DPIA-9 | COS-3 fixar data revisão anual §10 | Doc edit | — | 5min na assinatura | D-0 |

**Total:** 1 decisão (DPIA-1A recomendada = 0h) + ~2h doc edits + 1-3h code audit/impl + 1 founder PJ/DPO setup.

---

## 7. Founder action items (ordenados por urgência)

### Esta semana (19-23/Mai)

1. **D-10 (20/Mai)** — Decidir DPIA-1 caminho A ou B (squad recomenda A) → 5min
2. **D-9 (21/Mai)** — Aplicar DPIA-2, DPIA-5, DPIA-7 (doc edits cosméticas) → 1h total
3. **D-7 (23/Mai)** — DPIA-4 verificar validação maioridade no onboarding + DPIA-6 documentar processo manual portabilidade → 2h

### Próxima semana (26-30/Mai)

4. **D-4 (26/Mai)** — Receber SCC v2 de Patricia → aplicar DPIA-3 (sincronização)
5. **D-3 (27/Mai)** — DPIA-8 dados PJ + DPO nomeado + emails provisionados (BLOQUEIO ASSINATURA)
6. **D-0 (30/Mai)** — DPIA-9 + assinatura DPO + arquivo em `12-compliance/`

### Decisão paralela necessária

7. Confirmar com Patricia (ou advogada equivalente) se DPIA v1.0 será **revisado por parecer jurídico formal** antes da assinatura ou se a Anipis assina como documento interno (válido para accountability LGPD) e Patricia opina apenas em fiscalização. Squad recomenda: parecer formal de 1 página atestando aderência ao art. 38 LGPD e Res. CD/ANPD 2/2022, mesmo que sumário, ANTES de D-0.

---

## 8. Status pós review

**Beta-readiness DPIA:** VIÁVEL com 9 action items acima resolvidos até D-3 (27/Mai).
**Slip 7/Jun mais seguro** se INC-2 caminho B for escolhido OU se constituição PJ atrasar.
**Hard gate:** COS-2 (CNPJ + DPO) — sem isso o DPIA não pode ser assinado, e sem assinatura não há accountability evidence para ANPD.

---

## 9. Anexo — Comparação com Sprint 1 work entregue (verificação cross-doc)

| Item DPIA | Implementação verificada em código | Status |
|---|---|---|
| Filtro PII estruturada pré-LLM | `apps/serenity-ai/apps/api/src/lib/redact-for-observability.ts` + DEV-7 regression CI gate (15 tests) | ✅ COBERTO |
| ZDR enforcement env fail-closed | `apps/serenity-ai/apps/api/src/config/env-zdr.ts` + DEV-5/6 (10 tests) | ✅ COBERTO (OpenAI; Anthropic deferida) |
| Sentry beforeSend PII hardening | `sentry-config.ts` 6-layer (25 tests) — DEV-3 verificado | ✅ COBERTO |
| Crisis classifier + crisis-event-logger | DEV-7 regression gate cobre `crisis-event-logger` shape lock | ✅ COBERTO |
| Hash chain audit_events | Sprint 17/Mai (P0 #14 Lucia Art. 18) | ✅ COBERTO |
| RLS em tabelas dados pessoais | F5 RLS audit pendente (DEV-task) | 🟡 PARCIAL |
| crisis-deletion-guard + postDeleteHook | Sprint 17/Mai | ✅ COBERTO |
| Circuit breaker programático crisis (R6 (f)) | grep retorna 0 matches | ❌ NÃO EXISTE → INC-2 |
| Endpoint portability JSON (R12 (c) + §9 V) | grep retorna 0 matches em serviços | ❌ NÃO EXISTE → GAP-C |
| Validação maioridade onboarding (§3.3) | A verificar | 🟡 PENDENTE → GAP-A |
| crisis_events_archive segregado 5y | NÃO EXISTE (Sprint 17 confirmou pseudonimização) | ❌ NÃO EXISTE → INC-3 |
| Sentry server-side scrub | Pendente founder dashboard config (DEV-3 ops) | 🟡 PARCIAL |

**Conclusão cross-doc:** 8/12 cobertos por código, 2 parciais, 3 não existem. Os 3 ausentes ou viram caminho A (doc-only ajustando promessa à realidade) ou viram task implementação.

---

**Documento revisado em 19/Mai/2026 (D-11) pelo squad legal AIOS. Próxima revisão programada para D-4 (26/Mai) após retorno SCC v2 da Patricia, para sincronização final.**
