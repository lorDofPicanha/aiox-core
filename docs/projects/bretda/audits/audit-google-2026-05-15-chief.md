# Google Audit — Bretda — Chief Synthesis (Tier 1 wrap)

> **Companion to:** `audit-google-2026-05-15-kasim.md` (Kasim Aslam specialist deliverable)
> **Run mode:** DOCUMENTARY — Google OAuth `UNAUTHENTICATED 401` confirmed Tier 0 chief 15/Mai 14:04 UTC. Live `ads_full_audit` Google branch impossível esta sessão.
> **Sister audits:** Tier 0 `audit-2026-05-15-chief.md` (Meta + Google) + `meta-campaigns-report-2026-05-15.md` (Meta full) + `execute-plan-C-2026-05-15-chief.md` (Plan C swap forms ran ~earlier today).
> **Verdict:** `HOLD — OAuth Reauth user-side é blocker 100%. Kasim deliverable encontra 3 pendências canon (F6 codeless + bid floor + PRIMARY count) que sem live read não validamos.`

---

## 1. TL;DR (Chief)

Tier 1 Google audit confirma o que Tier 0 já sinalizou: **Bretda Google está em estado-cego há 8d**. Documental, arquitetura Aslam textbook (4 Campaign Types + Golden Ratio + greenfield Manual CPC 21d) está intacta. MAS três pendências críticas não validáveis:

1. **F6 codeless zumbi** — `[AGD] Lead 7138711130` com `default_value=R$100 + always_use=true` — playbook diz cleanup feito, audit chief 15/Mai diz PENDING. **Memory drift.** Live read resolve.
2. **PRIMARY count** — playbook diz 2 PRIMARY (max Aslam), memory diz 4 ENABLED. Discrepância.
3. **Bid floor violation** — MesaBilhar max CPC R$8 vs Aslam 2-4 floor R$525-1050 pra CAC R$2.100. **Canon-violation grave** mas operacional ("aceita perder leilão competitivo até bump pós-D+21 baseline").

Plus um risk silencioso: Brand Defense delivery liveness desconhecida há +8d. Se concorrente está bidando "bretda" e nosso Brand Defense está offline por OAuth fail, **estamos perdendo client searches já comprometidos via Meta funnel-upstream**.

**Verdict: HOLD com hard-block em OAuth.** Sem reauth (30s user), zero progresso.

---

## 2. Cross-reference com Meta state pós Plan C (hoje cedo)

| Plataforma | Estado | Notas |
|---|---|---|
| **Meta** | LIVE, Plan C executou: CP1 R$30/d reativado + AD05+AD04 swap forms | Tier 1 Meta hoje cedo |
| **Google** | OAuth 401 documentary mode | Tier 1 Google (este audit) |
| **CAPI** | Caminho A LIVE 30/Abr ✅ + Caminho B code-ready, deploy pendente | 14d sem deploy. System User Token Meta pendente user-side |
| **Sales feedback spreadsheet** | NÃO existe | Neil clone S8 pattern prometida 08/Mai, never delivered |

**Integration findings:**

### Funnel-aware integrity (Bretda full funnel)

```
Awareness (Meta CJ8v2 R$60 + CP1 R$30 = R$90/d Sudeste+Sul)
         ↓
Demand capture (Google Brand Defense R$10/d) ← ❓ liveness UNKNOWN >8d
         ↓
High-intent intercept (Google Bilhar R$25-60/d, Jantar R$15/d) ← ❓ delivery UNKNOWN
         ↓
LP form OR Instant Form ← AD05/04 Plan C just swapped (today), Plan B 14/Mai ainda não executado pra Google leads
         ↓
RTG re-engage (Google PAUSED até audience >1k + Meta zero RTG active)
```

**Gap análise:**

- **Funnel-cego no D2 (demand capture)**: Meta gera N leads "vimos um ad", arquiteto/designer abre Google, busca "bretda mesas bilhar", entra em ad de concorrente porque Brand Defense possivelmente offline. **Custo invisível.** Não medível sem reauth.
- **Funnel-cego no D3 (high-intent intercept)**: bid R$8 max CPC pode estar perdendo leilão pra qualquer ad com bid R$15+. Bilhar/Jantar talvez estão delivering 0 impressions sem nós saber.
- **Funnel-cego no D5 (RTG)**: PAUSED corretamente (audience <1k), mas isso significa que TODO re-engage Bretda depende de Meta RTG (que também está ATIVO zero hoje). **Re-engage pipeline = zero.**

**Conclusão funnel-aware:** Plan C Meta hoje cedo melhorou D1 (awareness). D2-D5 estão variavelmente degradados. **Google é o multiplier do Meta**, e nossa multiplier está offline.

---

## 3. D+7 Gate Impact (19/Mai conclave round 2)

Tier 0 chief audit listou Step 6 = D+7 gate 19/Mai conclave round 2 (Neil/Larry/Peep) pra decidir Meta scaling/maintain/kill.

**Google data influencia essa decisão?** **SIM, criticamente:**

| D+7 input | Sem Google live | Com Google live (pós reauth) |
|---|---|---|
| Close rate dos 27+ Meta leads | Só via sales feedback spreadsheet (que não existe) | Mesmo + cross-attribution via Google ECL (Sales AI deployed 05/Mai) |
| CPL real funnel-wide | Meta CPL apenas (R$23,04 hoje) | Meta CPL + Google CPL composite |
| Brand cannibalization risk | Desconhecida | Detectável via `google_ads_search_terms` (volume "bretda" branded queries) |
| Bid scaling decision Meta | Cega à demand-side data | Informada por demand-volume Google (se "bretda" searches crescendo +20% sem nada do nosso, é market demand growth real, não só nosso Meta entregando) |

**Conclusão D+7:** Sem OAuth Google reauth **antes** de 19/Mai, conclave round 2 vai ter contexto degradado e **só Meta-side data**. Recomendação: target **OAuth reauth até 17/Mai latest** pra ter 2 dias de Google data live antes conclave.

---

## 4. Top 3 findings (com F-codes + G-codes + severities)

| Rank | Finding | Code | Severity | Action |
|---|---|---|---|---|
| 1 | OAuth 401 cascade — Bretda Google blackbox há +8d, possível silent offline | F2 / G-002 | 🔴 CRITICAL | Step 0 user reauth 30s |
| 2 | F6 codeless conv zumbi `default_value=R$100 + always_use=true` documental persistente — playbook canon vs memory drift | F6 / G-006 | 🔴 CRITICAL | Step 2 cleanup pós-reauth |
| 3 | Bid floor violation MesaBilhar R$8 max CPC vs Aslam 2-4 floor R$525-1050 (CAC R$2.100) | — Aslam doctrine | 🟡 HIGH | Step 4 decision-only today, D+21 bump pós baseline |

**Secondary findings:**
4. PRIMARY count ambiguity (2 per playbook vs 4 per memory) — resolve in Step 1.3 live read
5. Brand Defense delivery liveness unknown — Step 5 incognito test (user-side, 1min)
6. GCP Production verification pendente 10d — possible support ticket if not resolved by D+21

---

## 5. Open Questions for Breno (max 3)

1. **OAuth reauth timing** — você consegue rodar 30s reauth hoje, ou agendamos para D+1 (16/Mai)? Se >17/Mai, conclave round 2 D+7 vai sair com dados degradados.
2. **GCP Production verification** — quer que abrimos suporte GCP em paralelo (parallel-execute enquanto reauth normal acontece), ou aguarda mais 7d natural queue? Já estamos em 10d sem resposta.
3. **F6 cleanup authority** — você OK que Kasim execute Step 2 (set `default_value=0` em `[AGD] Lead 7138711130`) auto pós-reauth se confirmar zumbi vivo, ou prefere review-then-execute? Aslam doctrine + canon playbook tudo aponta pra cleanup.

---

## 6. Deliverables (paths)

| Path | Owner | Status |
|---|---|---|
| `D:\AIOS\docs\projects\bretda\audits\audit-google-2026-05-15-kasim.md` | Kasim (Tier 1 specialist) | ✅ written |
| `D:\AIOS\docs\projects\bretda\audits\audit-google-2026-05-15-chief.md` | Chief (this synthesis) | ✅ written |
| `D:\AIOS\docs\projects\bretda\audits\audit-2026-05-15-chief.md` | Chief (Tier 0 earlier today) | ✅ pre-existing |
| `D:\AIOS\docs\projects\bretda\actions\execute-plan-C-2026-05-15-chief.md` | Chief (Plan C Meta earlier today) | ✅ pre-existing |

---

## 7. USER ACTION REQUIRED — Consolidated Priority List

| # | Priority | Action | Time | Unblocks |
|---|---|---|---|---|
| 1 | 🔴 P0 | OAuth Google reauth `contato@tockscustom.com.br` | 30s | Steps 1-6 of Kasim plan |
| 2 | 🔴 P0 | Validar saldo Google UI (ads.google.com → Billing) | 2min | Decide "is Bretda Google actually spending?" |
| 3 | 🟡 P1 | Generate Meta System User Token (BM Bretda → Pixel 3348133485496539) | 3min | CAPI Caminho B deploy (sister-Meta), funnel-aware full circle |
| 4 | 🟢 P2 | Incognito Brand Defense test (busca "bretda" BR) | 1min | Validate delivery |
| 5 | 🟢 P2 | GCP Production verification status check (cloud.google.com OAuth consent screen) | 5min | Decide if support ticket needed |

**Total Breno time:** ~11min for ALL actions. P0 alone = 2.5min.

---

## 8. Verdict

**`HOLD METHODICAL` — read-only audit complete. Zero writes. Block on user OAuth reauth (Action #1, 30s).**

Pós-reauth: Kasim plan Steps 1-6 ~20min full execution.
Pós Step 1.3 live read: F6 cleanup decision + PRIMARY count fix may surface as fast follow-ups.

---

## 9. Time Taken (Chief total)

- Context load + Kasim audit write: 18min (delegated logic)
- Chief synthesis write: 8min
- Cross-reference Meta state + funnel-aware analysis: 5min
- **Total Chief delivery: ~31min** (vs target 20min Kasim alone; +11min for cross-platform synthesis is acceptable for monthly audit)

---

*Foundation First. Brand-Defense LAST to pause but FIRST to validate. Funnel-Aware Traffic. Brasil 2076 PRESENCE. Mesa real intocável.*
