# Noyce - Execution roadmap and agent ownership

Data: 2026-05-23
Status: active orchestration plan
Owner: `@aios-master` / Orion
Fonte: C-level council (`@ceo`, `@coo`, `@cfo`, `@cmo`, `@cro`, `@cco`) + planning council (`@pm`, `@po`, `@architect`, `@qa`)

## Objetivo

Transformar a matriz C-level de agentes/clones em uma fila operacional para levar o Noyce do Sprint 0 ate piloto e producao, sem criar agentes novos.

Regras de governanca:

- `@aios-master` governa a orquestracao.
- Cada area tem um unico dono primario.
- Councils apoiam decisao, mas nao substituem o dono.
- Codex executa ferramentas e codigo somente apos a delegacao do agente dono.
- Nenhuma credencial real, login automatico, banco de producao, push ou acao externa sem gate humano, seguranca e `@devops`.

## Matriz de ownership

| Area | Dono primario | Council de apoio | Gate principal |
|---|---|---|---|
| Governanca geral | `@aios-master` | `@ceo`, `@coo`, `@pm`, `@po` | plano versionado, donos claros, sem agente novo |
| Produto/MVP | `@marty-cagan` | `@teresa-torres`, `@april-dunford`, `@pm` | tese, escopo e tradeoffs aprovados |
| Backlog/story | `@pm` | `@po`, `@sm`, `@aios-master` | stories pequenas com AC e dono |
| Arquitetura | `@architect` | `@martin-fowler`, `@martin-kleppmann`, `@will-larson` | arquitetura sem fonte principal e sem vazamento cross-tenant |
| Backend/adapters | `@data-engineer` | `@dev`, `@joe-reis`, `@architect` | contrato unico, fixtures e dry-run passando |
| Dados/score | `@cassie-kozyrkov` | `@data-engineer`, `@chip-huyen`, `@nate-silver` | score explicavel separado de confidence |
| UX operacional | `@ux-design-expert` | `@don-norman`, `@julie-zhuo`, `@edward-tufte`, `@ui-designer` | fluxo operacional usavel, sem landing page |
| Juridico/licitacoes | `@joel-de-menezes-niebuhr` | `@marcal-justen-filho`, `@patricia-peck`, `@richard-susskind` | atos externos bloqueados e revisao humana obrigatoria |
| Seguranca/LGPD/vault | `@cyber-chief` | `@omar-santos`, `@ann-cavoukian`, `@bruce-schneier`, `@patricia-peck` | vault, ToS, auditoria e feature flags antes de credenciais |
| DevOps/producao | `@devops` | `@charity-majors`, `@jez-humble`, `@gene-kim`, `@mitchell-hashimoto` | pre-push, observabilidade, rollback e deploy gates |
| QA/gates | `@qa` | `@stephen-hahn`, `@kent-c-dodds`, `@martin-fowler` | regressao, contrato, build e riscos documentados |
| Onboarding ENIAC | `@customer-success-manager` | `@cco`, `@onboarding-specialist`, `@voice-of-customer`, `@lincoln-murphy` | cliente fornece dados reais sem segredo em docs/chat/git |
| GTM/revenue | `@jason-lemkin` | `@cro`, `@april-dunford`, `@pricing-strategist`, `@alex-hormozi` | ICP, oferta, pricing e narrativa vendavel |
| Financas/pricing | `@cfo` | `@patrick-campbell`, `@aswath-damodaran`, `@warren-buffett` | unit economics e preco coerentes com ROI |
| Operacao do cliente | `@pedro-valerio` | `@coo`, `@sop-extractor`, `@eliyahu-goldratt`, `@joel-de-menezes-niebuhr` | SOP operacional do cliente validado |
| Conteudo/narrativa | `@ann-handley` | `@donald-miller`, `@robert-mckee`, `@joanna-wiebe` | mensagem clara sem promessa indevida |

## Roadmap por fases

### Fase 0 - Orquestracao e backlog

Owner: `@aios-master`

Council: `@pm`, `@po`, `@sm`, `@qa`

Entradas:

- `STORY-NOYCE-S0-MVP-WORKFLOW.md`
- `13-sprint0-council-routing-22mai.md`
- este roadmap

Entregaveis:

- backlog sequenciado por fases;
- owners e gates por story;
- lista de bloqueios humanos;
- criterio de "pronto para Codex executar".

Gate:

- cada story tem dono primario, AC, dependencia, gate e bloqueio explicito;
- nenhuma tarefa fica sem agente responsavel.

Status: este documento inicia a fase.

### Fase 1 - Consolidar nucleo Sprint 0

Owner: `@architect`

Council: `@data-engineer`, `@qa`, `@dev`, `@martin-kleppmann`, `@martin-fowler`

Stories:

1. `NOYCE-S0-01` - Revisar schema canonico multi-fonte.
2. `NOYCE-S0-02` - Revisar contrato unico de adapter.
3. `NOYCE-S0-03` - Validar fixtures anonimizadas multi-fonte.
4. `NOYCE-S0-04` - Rodar dry-run e congelar output v0 como baseline.

Gate:

- `validate-fixtures.mjs` passa;
- `sprint0-dry-run.mjs` passa;
- dedupe conflitante nao faz merge destrutivo;
- `source_candidates` continua suportado;
- nenhuma dependencia em fonte principal.

Status atual:

- fixtures e dry-run ja passaram em 2026-05-23;
- proxima acao e formalizar baseline e registrar gaps.

### Fase 2 - Corrigir base executavel do app

Owner: `@dev`

Council: `@qa`, `@architect`, `@frontend`

Stories:

1. `NOYCE-APP-01` - Corrigir sintaxe quebrada em `apps/noyce`.
2. `NOYCE-APP-02` - Garantir import/export e dados fixture-based sem segredo.
3. `NOYCE-APP-03` - Rodar `npm test`, `npm run typecheck`, `npm run build`.

Gate:

- testes verdes;
- typecheck verde;
- build verde;
- nenhum segredo ou credencial real no app;
- nenhuma automacao autenticada.

Bloqueio:

- nao adicionar feature nova antes da base compilar.

### Fase 3 - Superficie operacional

Owner: `@ux-design-expert`

Council: `@frontend`, `@don-norman`, `@julie-zhuo`, `@edward-tufte`, `@ui-designer`, `@qa`

Stories:

1. `NOYCE-UX-01` - Inbox operacional de oportunidades priorizadas.
2. `NOYCE-UX-02` - Detalhe com fato, inferencia, lacuna e evidencia.
3. `NOYCE-UX-03` - Timeline do processo e prazos criticos.
4. `NOYCE-UX-04` - Checklist de habilitacao.
5. `NOYCE-UX-05` - Matriz de portais e status de acesso/vault.

Gate:

- primeira tela e experiencia operacional, nao landing page;
- score e confidence aparecem separados;
- fato/inferencia/lacuna nao se misturam;
- texto cabe nos containers em desktop e mobile;
- Playwright/screenshot quando houver servidor local.

### Fase 4 - Dados, score e inteligencia

Owner: `@cassie-kozyrkov`

Council: `@data-engineer`, `@chip-huyen`, `@nate-silver`, `@joe-reis`, `@qa`

Stories:

1. `NOYCE-DATA-01` - Implementar score v0 deterministico.
2. `NOYCE-DATA-02` - Separar `opportunity_score` e `confidence_score`.
3. `NOYCE-DATA-03` - Registrar componentes, motivos, lacunas e inputs em `analysis_runs`.
4. `NOYCE-DATA-04` - Classificar concorrencia como `confirmed`, `probable`, `possible`, `no_evidence`.
5. `NOYCE-DATA-05` - Representar preco como faixa, amostra e confianca.

Gate:

- score nunca vira caixa-preta;
- score alto com confidence baixa gera alerta de incompletude;
- toda recomendacao tem evidencia ou lacuna.

### Fase 5 - Juridico/licitacoes e processo operacional

Owner: `@joel-de-menezes-niebuhr`

Council: `@marcal-justen-filho`, `@patricia-peck`, `@richard-susskind`, `@qa`, `@pedro-valerio`

Stories:

1. `NOYCE-LEGAL-01` - Modelar habilitacao por tipo de requisito.
2. `NOYCE-LEGAL-02` - Modelar sessao, lances, diligencia, saneamento e preclusao.
3. `NOYCE-LEGAL-03` - Modelar intencao de recurso versus razoes recursais.
4. `NOYCE-LEGAL-04` - Definir linguagem de aviso para risco e revisao humana.

Gate:

- nenhum recurso, lance, protocolo, assinatura ou mensagem externa e automatico;
- Noyce e copiloto, nao agente autonomo;
- revisao humana obrigatoria em atos juridicos.

### Fase 6 - Onboarding ENIAC e dados reais

Owner: `@customer-success-manager`

Council: `@cco`, `@onboarding-specialist`, `@voice-of-customer`, `@pm`, `@cyber-chief`, `@devops`

Stories:

1. `NOYCE-CS-01` - Coletar CNPJ/razao social e papeis de usuarios.
2. `NOYCE-CS-02` - Confirmar fontes usadas, frequencia e prioridades operacionais.
3. `NOYCE-CS-03` - Coletar URLs, tipo de acesso, 2FA e certificado sem registrar segredo em docs/chat/git.
4. `NOYCE-CS-04` - Criar success plan do piloto com criterio de valor.

Gate:

- dados sensiveis entram apenas via vault;
- founder/cliente aprova automacao autenticada antes de qualquer uso;
- lista de fontes e papeis fica documentada sem segredo.

### Fase 7 - Seguranca, LGPD, ToS e vault

Owner: `@cyber-chief`

Council: `@omar-santos`, `@ann-cavoukian`, `@bruce-schneier`, `@patricia-peck`, `@devops`, `@qa`

Stories:

1. `NOYCE-SEC-01` - Matriz ToS por portal.
2. `NOYCE-SEC-02` - Vault e politica de segredo.
3. `NOYCE-SEC-03` - Feature flags por tenant/fonte.
4. `NOYCE-SEC-04` - Auditoria de uso de credenciais.
5. `NOYCE-SEC-05` - Log redaction e proibicao de raw payload sensivel em logs.

Gate:

- 0 segredo em git/docs/chat/logs;
- automacao autenticada bloqueada por default;
- RLS e isolamento tenant validados;
- DPIA/LGPD proporcional ao uso real.

### Fase 8 - Adapters reais e ingestion

Owner: `@data-engineer`

Council: `@dev`, `@architect`, `@joe-reis`, `@qa`, `@cyber-chief`

Stories:

1. `NOYCE-ADAPT-01` - Adapter PNCP publico.
2. `NOYCE-ADAPT-02` - Adapter/manual import para PCP.
3. `NOYCE-ADAPT-03` - Adapter/manual import para BLL.
4. `NOYCE-ADAPT-04` - Adapter/manual import para BNC.
5. `NOYCE-ADAPT-05` - Adapter/manual import para ComprasGov.
6. `NOYCE-ADAPT-06` - Adapter/manual import para SISLOG.
7. `NOYCE-ADAPT-07` - Backlog de `source_candidates`.

Gate:

- cada adapter emite `SourceRecord` e `CanonicalCandidate`;
- adapter nao calcula score final;
- adapter nao decide merge final;
- fonte autenticada so roda com vault, ToS, consentimento e feature flag.

### Fase 9 - Jobs, observabilidade e operacao tecnica

Owner: `@devops`

Council: `@charity-majors`, `@jez-humble`, `@gene-kim`, `@mitchell-hashimoto`, `@qa`, `@cyber-chief`

Stories:

1. `NOYCE-OPS-01` - Jobs idempotentes: discover, fetch_document, parse, normalize, score, deadline.
2. `NOYCE-OPS-02` - Retry, timeout, rate limit e dry-run mode.
3. `NOYCE-OPS-03` - Observabilidade minima: traces, job status, error budget, alertas.
4. `NOYCE-OPS-04` - Pre-push e release checklist.

Gate:

- jobs podem reexecutar sem duplicar dados;
- logs nao contem segredo;
- rollback definido;
- push/deploy somente por `@devops`.

### Fase 10 - Piloto operacional ENIAC

Owner: `@aios-master`

Council: `@pm`, `@customer-success-manager`, `@qa`, `@ux-design-expert`, `@devops`, `@joel-de-menezes-niebuhr`

Stories:

1. `NOYCE-PILOT-01` - Rodar fluxo com oportunidades reais/permitidas.
2. `NOYCE-PILOT-02` - Medir se usuario entende decisao, risco, prazo e proximo movimento.
3. `NOYCE-PILOT-03` - Registrar gaps de dados, UX, adapter e processo.
4. `NOYCE-PILOT-04` - Decidir go/no-go para producao controlada.

Gate:

- ENIAC consegue decidir: olhar, preparar, acompanhar, recorrer ou ignorar;
- nenhum ato externo sem aprovacao humana;
- incidentes e lacunas documentados.

### Fase 11 - Producao controlada

Owner: `@devops`

Council: `@ceo`, `@coo`, `@qa`, `@cyber-chief`, `@customer-success-manager`, `@cfo`

Stories:

1. `NOYCE-PROD-01` - Hardening de seguranca e observabilidade.
2. `NOYCE-PROD-02` - Playbooks de suporte e incidente.
3. `NOYCE-PROD-03` - SLA/SLO operacional.
4. `NOYCE-PROD-04` - Revisao financeira, preco e custo operacional.

Gate:

- `@devops` aprova release;
- `@qa` aprova regressao;
- `@cyber-chief` aprova seguranca;
- `@ceo` decide go/no-go.

## Bloqueios humanos

Estes itens nao devem ser executados por Codex sem aprovacao explicita:

- usar credencial real;
- salvar login, senha, token, cookie ou certificado;
- acessar portal autenticado;
- protocolar documento;
- manifestar intencao de recurso;
- enviar mensagem em sessao;
- assinar qualquer documento;
- executar contra banco de producao;
- fazer push/deploy.

## Ordem imediata

1. `@po` valida este roadmap como backlog de referencia. Status: done, consultation `a70d8c66-a957-4226-805e-63e45d3d0766`.
2. `@pm` quebra Fase 1 e Fase 2 em stories ativas. Status: done, consultation `5af45d73-9af2-4c98-a53e-d386aa3a17fd`.
3. `@architect` valida que Fase 2 nao altera decisoes de modelo. Status: done, consultation `5e7b5174-ab29-4f9d-ad70-57f1d5849107`.
4. `@qa` define gate operacional para Fase 2. Status: done, consultation `63f82431-b4a7-43eb-97bb-ae5eabe38526`.
5. `@dev` corrige `apps/noyce` ate `test/typecheck/build` passarem. Status: gate passed; no code edit required in this pass because inspected files were already valid.
6. `@ux-design-expert` inicia Fase 3 - superficie operacional. Status: first iteration passed, consultation `90952f0e-c6e7-415f-8507-3d42d000082b`.
7. `@aios-master` decide continuidade: nova iteracao UX ou Fase 4 com `@cassie-kozyrkov`. Status: done, consultation `4fb3712e-9df6-4fa9-adb5-b61cd51e2649`.
8. `@cassie-kozyrkov` inicia Fase 4 - score deterministico e explicavel. Status: first iteration passed, consultation `dbf22225-5f0c-4a29-a280-9a2e3e218391`.
9. `@qa` registra gate da Fase 4. Status: PASS, consultation `ae3c74b7-c964-4f4a-ad56-2f5201e11db1`.
10. `@aios-master` decide proxima fatia: calibracao de score ou alinhamento de outputs com `@data-engineer`. Status: done, consultation `d3acbaff-ecd8-47a6-8eae-046669c87b8d`.
11. `@data-engineer` alinha contrato local de `analysis_run` e export JSON. Status: PASS, consultation `95882bab-4229-4e94-8108-2d7223812715`.
12. `@qa` registra gate do contrato de dados. Status: PASS, consultation `a34286c3-9158-40be-8ffe-54f077d84536`.
13. `@aios-master` decide proxima fatia: paridade completa com dry-run Sprint 0 ou Fase 5 juridico/processo. Status: done, consultation `6f614982-f04a-4b6f-b222-45b6114ac610`.
14. `@data-engineer` implementa paridade completa com 7 `analysis_runs` do dry-run Sprint 0. Status: PASS, consultation `ae9b0d0b-0efc-43f2-9e62-22461726bd23`.
15. `@qa` registra gate de paridade Sprint 0. Status: PASS, consultation `5c4b306d-df0f-4d77-8225-825ed0087da0`.
16. `@aios-master` decide proxima fatia: calibracao futura com outcomes reais ou Fase 5 juridico/processo. Status: done, Fase 5 selected because real ENIAC outcomes remain unavailable.
17. `@joel-de-menezes-niebuhr` inicia Fase 5 - modelagem juridico/processual. Status: PASS, artifact `19-fase5-legal-process-model-28mai.md`, conclave `16332252-be48-430b-bcc4-a0079a149ef4`.
18. `@dev` implementa `NOYCE-LEGAL-01` em `apps/noyce`. Status: PASS.
19. `@qa` registra gate Fase 5. Status: PASS, 8 tests, typecheck/build/browser QA passed.
20. `@pm`, `@cyber-chief`, `@data-engineer`, `@devops` e `@aios-master` executam pacote offline Fases 6-10. Status: PASS offline, artifact `20-fases6-10-execution-pack-28mai.md`, conclave `78abaf54-5035-43b1-ab41-979508a835e1`.
21. `@devops` prepara gate de Fase 11 producao controlada. Status: prepared/blocked, artifact `21-fase11-production-control-gate-28mai.md`.
22. Founder informa onboarding ENIAC: CNPJ `36.819.268/0001-05` alinhado ao acervo real, nome ENIAC, 4 usuarios operacionais, Stafani admin/owner ToS, URLs BLL/BNC/PCP e autorizacao para dry-run publico PNCP. Status: Fase 6 liberada para dry-run publico; Fase 7 continua bloqueada para vault/ToS; automacao autenticada segue bloqueada.
23. `@cyber-chief` recomenda vault pragmatico para piloto. Status: usar 1Password ou Bitwarden/Vaultwarden com MFA, item por portal, minimo privilegio e auditoria; conclave `88e5afb9-02b2-4331-b6ce-b94a9ebc8b69`.
24. `@data-engineer` executa dry-run publico PNCP e normaliza registros para candidatos canonicos. Status: PASS, 40 registros PNCP -> 40 `CanonicalCandidate`, 40 com prazo, 34 com valor estimado positivo, 22 com URL de origem; outputs em `outputs/pncp-public-dry-run/`.
25. Founder define direcao automation-first para todos os buscadores. Status: aprovado com gates; automatizar descoberta/normalizacao/score/alerta interno/fila, bloquear atos externos e login sem vault/ToS; artifact `23-automation-first-roadmap-29mai.md`, conclave `35cd914e-7468-4e04-806a-1cf435d2598c`.

Artefato de execucao:

- `18-po-validation-and-phase12-story-slice-23mai.md`
- `19-fase5-legal-process-model-28mai.md`

Validacao mais recente:

- `npm test`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- Browser local `http://localhost:3100`: PASS
- Playwright desktop/mobile: PASS, sem overflow horizontal em 390px.
- Fase 4 score `deterministic-v0`: PASS, com opportunity score e confidence score separados e breakdown visivel na UI.
- Export local `http://localhost:3100/analysis-runs.json`: PASS, `validation.ok=true`.
- Paridade Sprint 0 `http://localhost:3103/api/analysis-runs`: PASS, `validation.ok=true`, `sprint0Count=7`.
- Fase 5 legal/process model: PASS, with external acts blocked, appeal intent separated from appeal reasons, fixture-only data and browser QA at `http://localhost:3100`.
- Fases 6-11 offline readiness: PASS, `/api/readiness` exposes blockers, source governance, dry-run jobs, pilot steps and production control gate. Human/ENIAC inputs remain queued for morning.
- Fase 11 production gate: prepared but BLOCKED pending QA/security/devops/founder go-no-go.
- Onboarding ENIAC 2026-05-29: PASS partial. CNPJ/nome, Stafani admin/ToS owner, priority portal URLs and PNCP public dry-run authorization recorded. BLL/BNC/PCP authenticated automation remains BLOCKED pending vault and ToS by portal.
- PNCP public dry-run 2026-05-29: PASS. `pncp-public-dry-run.mjs` captured 40 public records with 0 errors; `pncp-records-to-canonical.mjs` produced 40 canonical candidates with evidence, source links, deadlines and quality issues. No login, credentials, database write or external message.
- Automation-first direction 2026-05-29: PASS as product/architecture direction. Full read-side automation is allowed by gates; external acts remain human-only.

## Definition of ready para execucao Codex

Uma tarefa so entra em execucao quando tiver:

- dono primario;
- council de apoio, se for decisao significativa;
- arquivos de entrada;
- entregavel esperado;
- gate de saida;
- bloqueios explicitos;
- comando de validacao.

## Definition of done por fase

Uma fase so fecha quando:

- gates passaram;
- evidencias de validacao foram registradas;
- pendencias humanas foram separadas de pendencias tecnicas;
- nenhum bloqueio de seguranca foi contornado;
- `@qa` registrou o resultado;
- `@aios-master` atualizou a proxima delegacao.

## Proxima delegacao - 2026-05-29

Owner: `@data-engineer`

Council: `@cyber-chief`, `@qa`, `@aios-master`

Tarefa:

- usar os 40 candidatos canonicos PNCP para triagem ENIAC;
- priorizar oportunidades com objeto de obra/engenharia, prazo aberto e valor estimado positivo;
- manter BLL/BNC/PCP como fonte de confirmacao manual ate vault/ToS;
- decidir se a proxima automacao e ranking fixture-only ou enriquecimento PNCP publico de documentos/anexos.

Gate:

- 0 segredo em log/output;
- 0 login/portal autenticado;
- output marcado como dry-run;
- `@qa` valida regressao antes de qualquer proxima fonte.
