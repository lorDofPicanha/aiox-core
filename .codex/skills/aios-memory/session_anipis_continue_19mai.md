---
name: Anipis Continue Batch 19/Mai Tarde
description: User disse "continue" pós batch anterior. Orion entregou Privacy Policy v2 draft + Termos Beta v2 draft + /transferencia-internacional Next.js page + R5 Upstash São Paulo cutover runbook + LIA Sentry/Langfuse v1.1 updates. Settings UI revocation já funcional via DEV-2 phase 1 (transparente).
type: project
originSessionId: anipis-continue-batch-19mai-tarde
---

## Sessão 19/Mai/2026 ~16h — "continue" autônomo

### Trigger
User: "continue" após session_anipis_execution_19mai entregar 10 itens. Orion priorizou: legal docs → DEV-4 runbook → Settings audit → LIA updates.

### Entregas (5 frentes)

**Privacy Policy v2 draft** (`12-compliance/Privacy-Policy-v2-draft.md`):
- 17 seções alinhadas a DPIA v2 + SCC v2
- Operadoras atualizadas (Anthropic NÃO ATIVA, Upstash MIGRANDO, Langfuse EU)
- Resolução CFM 2.454/2026 mencionada
- Processo manual portabilidade documentado
- Hash chain audit_events 5y conforme §4.1 DPIA
- Vedação operacional menores §3.3
- Pendente: Tabela §2 (CNPJ + DPO + endereço) + revisão Patricia

**Termos Beta v2 draft** (`12-compliance/Termos-Beta-v2-draft.md`):
- 14 seções específicas Closed Beta
- §2.2 limitações ("Não é serviço médico/psicológico/emergência") em destaque
- §5 protocolo de crise alinhado com R6 caminho A do DPIA (encaminhamento informativo, não circuit breaker)
- §6 disposições Beta (gratuidade, sem garantia continuidade, feedback voluntário)
- Anti-abuso crisis-alert mencionado §4.1(g) [referencia F3 hotfix]
- Pendente: §1 (CNPJ + Razão Social + endereço) + §12.2 (foro) + revisão Patricia

**Next.js page `/transferencia-internacional`** (`apps/web/src/app/(legal)/transferencia-internacional/page.tsx`):
- Página pública com 6 subprocessadores + status (ATIVA/NÃO ATIVA/MIGRANDO badges)
- 5 seções: resumo, subprocessadores, salvaguardas, consent/revogação, contato
- Link corrigido na consent UI DEV-2 (de `/legal/privacy` → `/privacidade`, de `/legal/scc` → `/transferencia-internacional`)
- TS clean (after Link route fix /settings/privacy → /settings)

**R5 Upstash São Paulo Cutover** (`15-runbooks/R5-upstash-sao-paulo-cutover.md`):
- 10 passos founder + dev
- Pré-req Pro tier upgrade (~$10/mês)
- Cutover via 2 env vars (URL + TOKEN) + redeploy
- Smoke test local + janela manutenção 3-5h madrugada
- Hold 7d instância antiga (rollback safety)
- Auto-update docs pós-cutover (DPIA v2 + Privacy Policy + page transferencia-internacional)
- Reduz operadoras estrangeiras 5→4
- Trigger Orion `r5 upstash cutover feito` automatiza updates

**LIA Sentry + Langfuse v1.1 updates** (`12-compliance/LIA-Sentry.md` + `LIA-Langfuse.md`):
- Sentry: ref corrigida (`sentry-config.ts` não `config/sentry.ts`); 6-layer hardening detalhado; CI gate DEV-7 mencionado; SCC v2 12.1(f); 12 salvaguardas (era 10)
- Langfuse: filter real `redactForObservability` (não legado `scrubFreeText`); CI gate DEV-7 fail-closed mencionado; consent UI DEV-2 categoria `international_transfer` referenciada; 12 salvaguardas

**Settings UI revocation (DEV-2 phase 2):**
- Investigação: `ConsentSettings.tsx` itera `GRANULAR_CONSENT_INFO` (6 categorias agora). 
- `/consents/revoke` route handler já routeia `international_transfer` pra `setInternationalTransferConsent` (DEV-2 phase 1)
- **Já funcional transparente — zero código adicional necessário**
- Polish futuro (opcional): warning modal específico para revocation de `international_transfer` explicando consequência "AI chat desabilitado"

### Status type-check / suite
- Web app: 0 erros nos arquivos criados (após Link fix)
- API suite: **881/882** (38 files; 1 pre-existing flake `crisis-protocol-service.alertEmergencyContact` mesmo do registro anterior — timing parallel load; passes isolado)

### Action items founder pendentes (resumo)

**Imediato (hoje/amanhã):**
1. `/mcp` autenticar `claude.ai Gmail` OU copy/paste email Patricia
2. Aplicar migration 011 ai_features_enabled no Supabase prod
3. Decidir Patricia review SCC v2 + DPIA v2 + Privacy Policy v2 + Termos Beta v2 + LIA Sentry v1.1 + LIA Langfuse v1.1 (1 bundle para advogada)

**Esta semana:**
4. R1 Railway BR setup (~45min)
5. R2 OpenAI ZRT enrollment (5min submit + 24-48h vendor)
6. R5 Upstash cutover São Paulo (1-2h + janela manutenção)
7. Sentry server-side scrub config (DEV-3 ops)

**D-3 (27/Mai) HARD GATE:**
8. CNPJ + Razão Social PJ
9. DPO interim nomeado
10. Emails dpo@/privacidade@/security@anipis.com.br
11. Patricia retorna SCC v2 + DPIA v2 sign-off + parecer 1pg

### Triggers próxima sessão
- `email patricia bundle` — Orion ajusta email v2 ready-to-send pra incluir LIA v1.1 + Privacy Policy v2 + Termos Beta v2 (7 anexos ao invés de 5)
- `r5 upstash cutover feito` — atualiza DPIA + Privacy Policy + page automaticamente
- `aplicou migration 011` — confirma + smoke test
- `next sprint qa playwright` — Playwright e2e tests onboarding international transfer
- `corrige flake crisis-protocol` — refactor pra remover timing dependency
- `dpia v3` — incorpora correções de Patricia após retorno

**Why:** "continue" interpretado como executar autônomo as 4 frentes que ficaram pendentes no session_anipis_execution_19mai. Settings UI surpreendentemente já estava coberto por DEV-2 phase 1 (data-driven via GRANULAR_CONSENT_INFO + route handler já especializa para `international_transfer`).

**How to apply:** próxima sessão pode (a) atualizar email Patricia com 7 anexos consolidados, (b) começar Playwright e2e, (c) endereçar pre-existing flake crisis-protocol, ou (d) executar qualquer runbook founder pela parte autônoma do Orion.
