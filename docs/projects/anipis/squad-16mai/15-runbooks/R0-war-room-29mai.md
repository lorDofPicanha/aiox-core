# R0 - War Room Anipis D-1

**Data:** 29/Mai/2026  
**Objetivo:** fechar GO/NO-GO do Closed Beta Anipis.  
**Regra:** nada vira DONE sem evidencia verificavel.

## Legenda

- `DONE` - executado e evidenciado.
- `DOING` - em execucao agora.
- `BLOCKED` - depende de decisao, terceiro, acesso ou falha tecnica.
- `UNKNOWN` - ainda nao verificado hoje.
- `N/A` - nao se aplica ao Closed Beta.

## Gate Final

| Gate | Status | Evidencia minima |
|---|---:|---|
| Privacy Policy publica | UNKNOWN | URL abre sem "draft" visivel |
| Termos Beta publicos | UNKNOWN | URL abre sem "draft" visivel |
| DPO/canal publico | UNKNOWN | email/canal publicado e testado |
| OpenAI ZRT/ZDR confirmado | UNKNOWN | confirmacao + env prod setada |
| Railway BR prod live | UNKNOWN | healthcheck prod PASS |
| Supabase migration 011 aplicada | UNKNOWN | coluna `ai_features_enabled` existe em prod |
| Sentry scrub configurado | UNKNOWN | evento teste sem PII |
| Invite-only ativo | UNKNOWN | usuario sem convite bloqueado |
| Smoke E2E completo | UNKNOWN | roteiro fase 04 PASS |
| Art.18 hard delete PASS | UNKNOWN | usuario fake exportado/excluido/validado |
| Crisis routing PASS | UNKNOWN | recursos CVV/SAMU/CAPS exibidos |
| Kill-switch PASS | UNKNOWN | chat desliga/liga via flag |

**Decisao:** `NO-GO ate todos os gates acima estarem DONE`.

## 00 - Painel De Controle

| Bloco | Item | Owner | Status | Evidencia / link / observacao |
|---|---|---|---:|---|
| Legal | Entidade definida: MEI/CNPJ/PF controlador | Founder | UNKNOWN |  |
| Legal | DPO interim definido | Founder | UNKNOWN |  |
| Legal | Canal DPO provisionado | Founder | UNKNOWN |  |
| Legal | Privacy Policy publicada | Founder | UNKNOWN |  |
| Legal | Termos Beta publicados | Founder | UNKNOWN |  |
| Legal | SCC v2 final no bundle | Founder/OAB | UNKNOWN | `12-compliance/SCCs-ANPD-19-2024-v2-FINAL.md` |
| Legal | DPIA v2 final no bundle | Founder/OAB | UNKNOWN | `12-compliance/anipis-RIPD-DPIA-v2.md` |
| Legal | LIA Sentry no bundle | Founder/OAB | UNKNOWN | `12-compliance/LIA-Sentry.md` |
| Legal | LIA Langfuse no bundle | Founder/OAB | UNKNOWN | `12-compliance/LIA-Langfuse.md` |
| Infra | Railway BR app/API criado | Founder/DevOps | UNKNOWN | `R1-railway-br-setup.md` |
| Infra | Dominio prod apontado | Founder/DevOps | UNKNOWN |  |
| Infra | Healthcheck prod PASS | Founder/DevOps | UNKNOWN |  |
| Infra | Migration 011 aplicada | Founder/DevOps | UNKNOWN |  |
| Infra | OpenAI ZRT/ZDR confirmado | Founder | UNKNOWN | `R2-openai-zdr-enrollment.md` |
| Infra | Env `OPENAI_ZDR_CONFIRMED=true` prod | Founder/DevOps | UNKNOWN |  |
| Infra | Anthropic mantida deferida ou DPA validado | Founder | UNKNOWN | `R3-anthropic-deferred-verification.md` |
| Infra | Upstash decisao registrada | Founder | UNKNOWN | `R5-upstash-sao-paulo-cutover.md` |
| Observability | Sentry projeto prod ativo | Founder/DevOps | UNKNOWN |  |
| Observability | Sentry server-side scrub ativo | Founder/DevOps | UNKNOWN |  |
| Observability | Logs prod acessiveis | Founder/DevOps | UNKNOWN |  |
| Beta | Lista 20 Julias final | Founder | UNKNOWN |  |
| Beta | 20 invite codes gerados | Founder/DevOps | UNKNOWN |  |
| Beta | Invite-only validado | Founder/DevOps | UNKNOWN |  |
| Beta | Email/template aprovado | Founder | UNKNOWN | `R4-email-template-julias-rede-pessoal.md` |
| Beta | Links Privacy/Termos nos emails | Founder | UNKNOWN |  |
| Smoke | Usuario fake criado via convite | Founder/DevOps | UNKNOWN |  |
| Smoke | Onboarding + consent PASS | Founder/DevOps | UNKNOWN |  |
| Smoke | Chat normal PASS | Founder/DevOps | UNKNOWN |  |
| Smoke | Crisis routing PASS | Founder/DevOps | UNKNOWN |  |
| Smoke | Exportacao de dados PASS | Founder/DevOps | UNKNOWN |  |
| Smoke | Hard delete Art.18 PASS | Founder/DevOps | UNKNOWN |  |
| Smoke | Sentry/logs sem PII | Founder/DevOps | UNKNOWN |  |
| Smoke | Kill-switch PASS | Founder/DevOps | UNKNOWN |  |
| Launch | GO/NO-GO registrado | Founder | UNKNOWN |  |
| Launch | Convites enviados manualmente | Founder | UNKNOWN |  |
| Launch | Monitoramento 60min pos-envio | Founder/DevOps | UNKNOWN |  |

## Ordem De Execucao

1. Marcar todos os `UNKNOWN` que ja estao comprovadamente `DONE`.
2. Resolver primeiro qualquer `BLOCKED` em Legal ou Infra.
3. Rodar smoke completo somente depois de Legal + Infra estarem `DONE`.
4. Enviar convites somente depois de Gate Final `DONE`.
5. Se qualquer gate final continuar `BLOCKED` ate o fim do dia, registrar `NO-GO` e mover launch para 7/Jun/2026.

## Log De Hoje

| Hora BRT | Evento | Decisao / evidencia |
|---|---|---|
| 29/Mai | R0 criado | Painel de controle D-1 salvo com todos os gates em `UNKNOWN` ate verificacao por evidencia |
| 01/Jun | Auditoria local passo 1 | Evidencias locais abaixo registradas. Nenhum gate final vira `DONE` sem URL/prod/screenshot/log verificavel. |

## Auditoria Local 01/Jun/2026

### Evidencia local verificada

| Item | Status local | Evidencia |
|---|---:|---|
| Privacy Policy route existe | CODE-READY | `apps/serenity-ai/apps/web/src/app/(legal)/privacidade/page.tsx` |
| Termos route existe | CODE-READY | `apps/serenity-ai/apps/web/src/app/(legal)/termos/page.tsx` |
| Transferencia internacional route existe | CODE-READY | `apps/serenity-ai/apps/web/src/app/(legal)/transferencia-internacional/page.tsx` |
| DPO interim no app | CODE-READY | `apps/serenity-ai/apps/web/src/data/legal-data.ts` atualizado para `Breno Cerqueira (DPO interim)` + `dpo@anipis.com.br` |
| DEV-2 consent UI | CODE-READY | `InternationalTransferConsent.tsx`, `ai-consent-gate.ts`, `dev2-international-transfer-flow.test.ts` |
| Migration 011 existe | CODE-READY | `apps/serenity-ai/apps/api/src/db/migrations/011_ai_features_enabled.sql` |
| F1 journal auth bypass | CODE-READY | `journal-routes.ts` nao existe no checkout atual |
| F2 invite enumeration | CODE-READY | `routes/invite.ts` com rate limit 10/h por IP hash + 404 uniforme |
| F3 crisis alert abuse | CODE-READY | `routes/crisis.ts` com Redis dedup por evento + cap 3/24h por usuario |
| ZDR boot enforcement | CODE-READY | `config/env-zdr.ts` + `env-zdr-enforcement.test.ts` |
| Sentry/Langfuse PII redaction code | CODE-READY | `services/observability/sentry-config.ts`, `langfuse-client.ts`, tests correspondentes |
| Typecheck monorepo serenity-ai | PASS | `npm run typecheck` em `apps/serenity-ai` PASS em 01/Jun |
| API test suite | PASS | `npm test` em `apps/serenity-ai/apps/api` PASS: 39 files, 889 tests |

### Ainda bloqueia GO

| Bloqueio | Por que nao esta DONE | Proxima acao |
|---|---|---|
| Privacy/Termos publicos | Rotas existem, mas prod URL nao foi verificada; razao social/CNPJ/endereco ainda sao placeholders | Founder define entidade controladora; publicar e abrir URL sem placeholder |
| Canal DPO publico | Email esta no codigo, mas provisionamento/teste do mailbox nao foi evidenciado | Enviar email teste para `dpo@anipis.com.br` e registrar recebimento |
| Railway BR prod live | Sem healthcheck prod registrado neste runbook | Rodar `curl https://api.anipis.com.br/health` e anexar status/data |
| Migration 011 aplicada em prod | SQL existe localmente, mas prod DB nao foi verificado | Rodar query prod confirmando coluna `profiles.ai_features_enabled` |
| OpenAI ZDR real | Enforcement existe, mas confirmacao dashboard/email nao esta anexada | Anexar screenshot/email e env prod `OPENAI_ZDR_CONFIRMED=true` |
| Sentry scrub server-side | Hardening existe no codigo, mas evento prod sem PII nao esta evidenciado | Disparar erro sintetico e anexar print/event payload redigido |
| Invite-only prod | Codigo existe, mas fluxo prod sem convite nao foi testado | Testar usuario sem convite bloqueado + invite code valido |
| Smoke E2E | Nenhum resultado PASS registrado | Rodar roteiro `14-operations/SMOKE-TEST-LIST.md` contra prod |
| Kill-switch | Nao encontrei implementacao/evidencia local clara | Implementar ou documentar flag operacional e testar off/on |
| CI completo | CI atual so roda lint/typecheck/build | Adicionar jobs test, npm audit, gitleaks, pii-regression-gate |
| Safety observability P0 | Safety SLO/shadow judge/heartbeat/safe mode aparecem em pesquisa, nao no codigo | Decidir se bloqueiam 7/Jun; se sim, criar story e implementar |

### Resultado do passo 1

Estado atual: **NO-GO operacional**. O codigo tem varios itens prontos e o typecheck/testes API estao verdes, mas os gates finais ainda precisam de evidencia de producao e ha pelo menos dois gaps de codigo/processo antes de um GO defensavel: **CI completo** e **kill-switch/safety control definido**.
