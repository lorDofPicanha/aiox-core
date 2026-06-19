# YOLO Execution Board - Programa dos Contadores

> Data: 2026-06-16
> Status: ativo
> Escopo permitido: docs, migrations locais, testes locais, squads, gates.
> Escopo bloqueado: push, deploy, gasto, envio externo, dados reais, UI/captura/RAG/e-CAC.

---

## 1. Estado atual

| Frente | Status | Evidencia |
|---|---|---|
| F1 Foundation | PASS tecnico | `29-qa-final-f1-foundation.md` |
| F1.1 Decision Evidence | PASS tecnico | `002_decision_evidence.sql` + contrato runtime |
| F1.2 Secure Decision RPC | PASS tecnico | `003_secure_decision_rpc.sql` + contrato runtime |
| F1.3 Closeout CLI | PASS tecnico/runtime descartavel | `38-story-f1-3-closeout.md`; `004_closeout_lote.sql`; `registrar_closeout`; `contador-closeout-manifest`; `smoke:psql` PASS |
| QA/Security Gate F1 | CONCERNS | `40-qa-security-gate-f1.md`; G1-G3 PASS tecnico; XML real bloqueado |
| Rollback F1.2 | PASS tecnico | `003_secure_decision_rpc.rollback.sql` + static gate |
| Fiscal/Juridico | CONCERNS | `30-signoff-fiscal-juridico-f1.md`; `45-safe-fiscal-language-claims-v1.md` |
| Fecho/carimbo | CONCERNS | `35-time-stamp-closeout-runbook.md`; sem ICP-Brasil/PAdES ainda |
| LGPD | CONCERNS | `31-data-map-lgpd-f1.md`; `36-lgpd-operational-pack-f1.md`; `42`; `43`; `44` prontos para revisao juridica |
| Golden-set real | PLANO PRONTO / BLOQUEADO por humano externo | `32-tributarista-labeling-brief.md`; `46-golden-set-real-plan-v1.md`; `47-golden-set-real-fixture-contract-v1.md` |
| Concierge | Pronto para demo sem dados reais | `37-concierge-demo-kit-f1.md`; `45-safe-fiscal-language-claims-v1.md`; dados reais seguem bloqueados |

## 2. Proximas tarefas por squad

| ID | Squad | Dono | Tarefa | Saida | Gate |
|---|---|---|---|---|---|
| Y-01 | Data Core | `@data-engineer` | Revisar F1.1 contra RLS/SECURITY DEFINER/grants | parecer tecnico | PASS/CONCERNS |
| Y-02 | Legal/Fiscal | `@legal-chief` | Consolidar respostas Heleno/Roberto/Patricia | parecer de sign-off | PASS/CONCERNS/FAIL |
| Y-03 | LGPD | `@legal-chief` + Patricia | Revisar `31-data-map-lgpd-f1.md` | data map v1 | DONE artefato; revisao juridica pendente |
| Y-03b | LGPD | `@legal-chief` + Patricia | Revisar `36`, `42`, `43`, `44` | DPA/retencao/suboperadores v1 | DONE artefato; revisao juridica pendente |
| Y-04 | Golden-set | `@pm` + Renan | Recrutar tributarista rotulador | candidato + orcamento | BLOQUEADO ate Founder aprovar gasto |
| Y-05 | Golden-set | `@data-engineer` | Definir formato final de fixture real | `47-golden-set-real-fixture-contract-v1.md` | DONE contrato sem dados reais |
| Y-06 | Seguranca | `@cyber-chief` | Threat model F1 para dados fiscais | threat model | obrigatorio antes de XML real |
| Y-07 | Produto | `@pm` | Oferta Concierge com linguagem permitida | `37-concierge-demo-kit-f1.md` + `45-safe-fiscal-language-claims-v1.md` | DONE artefato; legal review antes de envio |
| Y-08 | QA | `@qa` | Gate integrado F1/F1.1/F1.2 + docs 30-37 | decisao gate | PASS/CONCERNS |
| Y-09 | DevOps | `@devops` | Preparar checkpoint/branch quando autorizado | commit plan | sem push sem Founder |
| Y-10 | Orquestracao | `@aios-master` | Fechar versao do operating model | docs 33/34 | Founder aware |
| Y-11 | Data Core | `@data-engineer` | Implementar/verificar rollback granular F1.2 | `003_secure_decision_rpc.rollback.sql` | PASS static/runtime |
| Y-12 | Legal/Fiscal | `@legal-chief` | Revisar runbook de fecho/carimbo | `35-time-stamp-closeout-runbook.md` | bloqueia promessa de prova |
| Y-13 | Data Core + QA | `@data-engineer`/`@qa` | Smoke Postgres da F1.3 em banco descartavel | `smoke:preflight` + `smoke:psql` | DONE - PASS runtime |
| Y-14 | Seguranca | `@cyber-chief` | Threat model F1 para closeout/export de eventos | `39-threat-model-f1.md` + `41-export-retention-policy-f1.md` | DONE - PASS tecnico, juridico pendente para dado real |
| Y-15 | QA/Security | `@qa`/`@cyber-chief` | Validar G1-G8 do gate integrado | `40-qa-security-gate-f1.md` | CONCERNS - G1-G3 PASS, G4-G6 artefato v1, G7 PASS, G8 plano pronto/execucao bloqueada |

## 2-bis. Achados incorporados

| Achado | Origem | Status |
|---|---|---|
| RPC humana permitia caller aprovar como outro contador via `p_revisor_id` | `@data-engineer` | Corrigido em F1.2 |
| RPC humana aceitava tenant claim ausente | `@data-engineer` | Corrigido em F1.2 |
| Evento precisava snapshot/hash fiscal material | `@data-engineer` | Mitigado com `fiscal_snapshot` + `evidencia_hash` |
| Verifier truncava microsegundos | `@qa` | Corrigido + fixture Postgres com microsegundos |
| Rollback incremental da 003 estava ausente | `@qa` | Corrigido com rollback F1.2 |
| Funcoes `core_api_v1` reabriam execute para `PUBLIC` apos migrations posteriores | `@cyber-chief`/Bruce Schneier | Corrigido com revokes explicitos em 003/004 + smoke Postgres PASS |
| `closeout_lote` tinha policy RLS de select mas sem `GRANT SELECT` para `authenticated` | `@qa`/G2 | Corrigido em 004; contrato 005 prova isolamento por tenant |
| G4/G5 estavam pendentes sem artefatos revisaveis | `@legal-chief`/conclave G4-G5 | Criados DPA v1, registro de suboperadores e matriz de retencao; XML real ainda bloqueado |
| Linguagem fiscal estava parcial e espalhada | `@legal-chief`/conclave G6 | Criada matriz de claims G6; demo sem dados reais liberada com disclaimer |
| Golden-set real tinha protocolo mas nao plano executavel/fixture contract | `@data-engineer`/conclave G8 | Criados plano G8 e contrato de formato; sem coleta real |
| Producao bloqueada por fecho/carimbo, LGPD e golden-set real | `@legal-chief` | Mantido como gate |

## 3. Comandos de gate

```powershell
npm run smoke:psql --workspace @synkra/contador-db
npm test --workspace @synkra/contador-db
npm test --workspace @synkra/contador-motor-fiscal
npm test --workspace @synkra/contador-trilha-verifier
npm test --workspace @synkra/contador-fitness
```

## 4. Decisoes pendentes do founder

1. Autorizar ou nao contato/contratacao de tributarista rotulador.
2. Autorizar ou nao uso de dados reais em ambiente controlado apos LGPD/security PASS.
3. F1.3 closeout CLI foi escolhido em 2026-06-18; G2-G8 agora tem artefatos tecnicos/juridicos revisaveis; proximo corte recomendado: runbook de incidente/expurgo testavel.
4. Confirmar se `@devops` deve checkpointar/commitar a F1/F1.1/F1.2 quando os gates dos agentes retornarem.

## 5. Definicao de pronto para piloto pago

- Fiscal/juridico PASS ou CONCERNS explicitamente aceitos.
- LGPD v1 revisado.
- Threat model F1 aprovado.
- DPA/termos de operador prontos.
- Golden-set real minimo iniciado ou promessa comercial limitada sem claim de acuracia.
- Oferta Concierge com linguagem permitida.
- Fecho/carimbo com escopo aceito; sem promessa de ICP-Brasil/PAdES ate implementacao real.
