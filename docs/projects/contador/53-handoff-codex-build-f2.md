# 53 — Handoff Codex: Build Fase 2 ("Deploy real + multi-tenant + auth")

> **Autor:** Orion (Claude) · **Data:** 2026-06-22 · **Para:** Codex (motorista de execução)
> **Precede:** este doc é o briefing que o Codex consome para construir a Fase 2. Mesmo papel que o `21-handoff-codex-build-f1.md` teve para a F1.
> **Fontes de verdade:** `20-arquitetura-core-v1.1.md` (técnica) · `52-build-roadmap-sistema-completo.md` §3 (Fase 2) · `00-context/CONTEXT.md` (§5 constraints, D-decisions) · migrations em `packages/contador-db/`.
> **Divisão de trabalho (Constituição Art. VII):** Claude planeja/revisa (este doc + review do resultado + parte legal); **Codex executa o build**.

---

## 0. Estado atual (o que já existe — não reconstruir)

- **App `apps/contador`** (Next 15, :3008) — 10 rotas, todas HTTP 200. Core: Carteira, Fila, Aprovação (CRC), Trilha, Laudo. Add-ons sintéticos: Captura, e-CAC, Emissor, Recuperação. Commits `bec51701` + `5761b779`.
- **`packages/contador-db`** — migrations **001–006** (foundation → decision_evidence → secure_decision_rpc → closeout_lote → smoke/contract → incident/expurgo). `npm test` PASS.
- **`packages/contador-api-client`** — cliente TIPADO sobre `core_api_v1`. Hoje só `mode:"mock"` (in-memory, populado pelo motor real). **O gancho `createApiClient({mode:"supabase"})` já existe e lança erro honesto** (`src/index.ts:48`).
- **Ponto único de swap:** `apps/contador/lib/api.ts` → `getApi()`. Trocar o backend = mudar SÓ esta factory. As telas não mudam.
- **Motor/trilha/verificador** — reais e verdes (packages `contador-motor-fiscal`, `contador-trilha-verifier`).

## 1. Objetivo da Fase 2

Sair do **mock in-memory** → **Supabase real, multi-tenant, com auth e RLS runtime**. Ao fim: o CORE (Carteira/Fila/Aprovação/Trilha/Laudo) roda contra Postgres real, acessível por login, isolado por `escritorio_id` via RLS, com as fitness functions rodando como gate de CI.

> **Escopo:** F2 liga **só o CORE** ao Supabase. Os 4 add-ons (Captura/e-CAC/Emissor/Recuperação) **continuam sintéticos/co-localizados** nesta fase — eles ligam de verdade nas fases deles (5 e 7), que dependem de contratos externos. Não tentar ligá-los agora.

## 2. 🔴 PRÉ-REQUISITO BLOQUEANTE (insumo do founder — sem isto, não começa)

1. **Projeto Supabase** + as 3 chaves: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. (Founder já usa Supabase em Noyce/Anipis — caminho conhecido.)
2. **Decisão de hosting** — o monorepo já usa Vercel; default = Vercel para o app + Supabase gerenciado.
3. **CI:** quem mexe em GitHub Actions = @devops (governança MCP/infra).

## 3. Stories (ordem de ataque)

| Ordem | Story | Descrição | DoD |
|---|---|---|---|
| **F2.1** | **Provisionar + migrations + seed** | Aplicar migrations 001–006 (`contador-db`) no Supabase real; rodar o seed do motor (`seedFromMotor`) gravando via **RPCs reais** `core_api_v1.registrar_analise` (não INSERT direto) | Schema no Supabase; `smoke:psql` PASS contra o projeto; seed produz fila+trilha reais |
| **F2.2** | **Auth multi-tenant (P18)** | Supabase Auth; `app.current_escritorio()` / `app.current_ator()` lendo claims do JWT real; RLS default-deny confirmada | Login real; sessão carrega `escritorio_id`; nenhuma query sem tenant passa |
| **F2.3** | **`SupabaseApiClient` (S-F2.4 do roadmap)** | Implementar `createApiClient({mode:"supabase"})` batendo nas RPCs `core_api_v1` (registrar_analise, aprovar/rejeitar/superar_apontamento, listar*, registrar_closeout). `lib/api.ts:getApi()` usa supabase quando env presente, **mantém fallback mock** sem env | App roda contra Supabase; as 5 telas core funcionam idênticas; mock ainda roda em dev sem env |
| **F2.4** | **FF como gate de CI** | GitHub Actions: typecheck + `banlist:g6` (FF-10) + FF-1 (import boundary via dependency-cruiser) + FF-2/3/6 (contract SQL via `smoke:psql` contra Supabase descartável/branch). Hard-fail | CI verde no PR; viola qualquer FF → vermelho |
| **F2.5** | **Isolamento cross-tenant (FF-3)** | Teste com 2 tenants reais provando que tenant A nunca lê dado de B (RLS runtime, não filtro JS) | Teste generativo PASS; tentativa cross-tenant bloqueada pelo banco |

## 4. Constraints que NÃO mudam (§5 CONTEXT — valem na F2)

- **Human-in-loop:** as RPCs `aprovar/rejeitar` já exigem `ator`=contador-CRC + evidência individualizada (migr. 002/003). Não afrouxar ao ligar o Supabase. Aprovação em lote silenciosa = proibida.
- **LGPD/sem XML real:** F2 usa **seed sintético** ainda. XML real só pós-revisão jurídica (Fase 3) + DPA (Fase 5). RLS default-deny + `app.*` como único leitor do JWT (P18).
- **G6:** banlist (FF-10) sobre todo template — já é prebuild; vira gate de CI nesta fase.
- **Bounded contexts (FF-1):** o app importa só do `core_api_v1` (api-client). Não criar atalho do app pro schema cru. Add-ons sintéticos ficam isolados em `app/{modulo}/` (não os ligar ao core agora).
- **Re-verificação ≠ re-execução (P3):** verificador re-verifica integridade; nunca replay de LLM.

## 5. Portões — o que NÃO construir na F2

- ❌ Captura via provider (Fase 5 — precisa provider + DPA).
- ❌ e-CAC/Emissor/Recuperação reais (Fase 7 — contratos SERPRO/ADN/jurídico).
- ❌ Camada RAG do motor (fora; regras determinísticas bastam até golden-set real — Fase 3).
- ❌ Motor "real" com regras cClassTrib reais (Fase 3 — bloqueado por tributarista rotulador).

## 6. Como o Codex deve trabalhar

1. Ler `20-arquitetura-core-v1.1.md` (esp. P18 auth, core.api_v1, FF), `52` §3, este doc, e as migrations `contador-db/migrations/`.
2. TDD onde fizer sentido (o `SupabaseApiClient` deve passar nos mesmos testes de contrato que o mock).
3. Não tocar nas telas (a interface do api-client é o contrato; só a implementação muda).
4. Ao terminar: abrir PR na branch `migration/codex-cutover`; **review crítico = Claude** (este handoff vira checklist de aceite). Push/deploy = @devops/founder.

## 7. Caminho crítico paralelo (founder — não é build)

A Fase 3 (motor real) depende de **tributarista rotulando o golden-set** — esse é o long-pole mais demorado de conseguir (não é código, é recrutamento via Renan). **Começar a caçar o tributarista AGORA**, em paralelo à F2, senão a F3 trava mesmo com o código pronto.

---

*— Orion, handoff para o motorista 🎯*
