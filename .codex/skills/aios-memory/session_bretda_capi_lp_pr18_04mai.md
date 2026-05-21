---
name: Bretda CAPI LIVE + LP Fix #1 PR #18 + LFS Bug 04/Mai
description: Sessão completa Orion 04/Mai — CAPI Bretda foi de BLOCKED → LIVE (3 iterações Upstash), 4 ads mortos pausados, Fix #1 lazy videos PR #18 aberto + renders Coleção atualizados, bug Git LFS bloqueando preview, 5 decisões pendentes user.
type: project
originSessionId: 3dba5b26-b348-48a0-a283-5a53536bc382
---
# Sessão Bretda CAPI + LP PR #18 + LFS — 04/Mai/2026

## Estado final

| Item | Status | Detalhe |
|---|---|---|
| **CAPI Bretda** | 🎉 **LIVE** | fbtrace IDs `Ap7JyDhstdl3Tjd91ShSwfC` (smoke 007 agent) + `A9ay5tj69UyuIENbEXWbpAb` (smoke validation Orion) |
| Pixel canônico | `3348133485496539` | Confirmado MCP + `apps/bretda-lp/src/lib/constants.ts:5`. Memória anterior `1130704285486234` ERRADA (era pixel do site antigo, em backups). Playbook `03-env-vars-needed.md:29` diz `1014260166903168` — também ERRADO, fix aplicado e revertido pelo user. |
| Pixel `last_fired_time` API | 03/Mai 20:39 | Esse campo só rastreia client-side fires, NÃO atualiza com CAPI server. Comportamento Meta esperado. |
| 4 ads zerados pausados | ✅ | AD03 (`120237168468400737`), AD04 (`120244164992490737`), AD11 AMBAR Carousel (`120245285464550737`), AD13 ZURITA Carousel (`120245285477490737`) |
| LP audit completo | ✅ | `D:\AIOS\docs\projects\bretda-redesign\22-lp-view-rate-audit\` (4 docs, root cause: 22.99 MB de 5 vídeos auto-play em mobile 4G = 13.3s load) |
| Plano estrutural 14d | ✅ | `D:\AIOS\docs\projects\bretda-redesign\21-structural-plan-may2026\` (6 docs, conclave Hormozi/Brunson/Kim simulado por chief — `self-consultation.js` quebrado) |
| Fix #1 lazy videos | ✅ commit `754481e` | LazyVideo IntersectionObserver, hero preservado. 22.99 MB → 0.97 MB local. Branch `fix/bretda-lp-lazy-videos-PR1`. |
| Renders Coleção | ✅ commit `8329c74` | 6 mesas finais (Ambar/Aurora/Citrino/Espinela/Opal/Zurita) PNG sem fundo + 4 placeholders temp (Pebolim x2, Ping Pong, Shuffleboard). Sharp comp 31.7→1.98 MB. Layout/CSS intocados. |
| **PR #18** | OPEN | https://github.com/lorDofPicanha/bretda-lp/pull/18 |
| **Preview Vercel** | 🔴 IMAGES BROKEN | Bug Git LFS — Vercel GitHub integration clona repo SEM resolver LFS. Todas imagens servem 130 bytes de texto LFS pointer. Auth Vercel já desabilitada. |

## CAPI Activation timeline (3 iterações)

1. **Iter 1:** User passou System User Token Meta (`EAARpmt8Llm4...`). Agent plugou `METAAPI_ACCESS_TOKEN` + `METAAPI_PIXEL_ID=3348133485496539` Production+Preview. Health check OK. POST Lead → 500 (bug Upstash URL).
2. **Iter 2:** Descobriu `UPSTASH_REDIS_REST_URL` tinha `\n` trailing literal (setado 3d antes). Re-add via `printf` (não `echo`). Deploy. POST Lead ainda 500 — novo erro `NOPERM evalsha` no token Upstash.
3. **Iter 3:** User mandou redis-cli URL com password embutida (`gQAAAAAAAXcjAA...`). Agent rotacionou `UPSTASH_REDIS_REST_TOKEN` (full ACL). Smoke 007 → 200 OK. CAPI LIVE.

## Vercel webhook drift

- GitHub App **NUNCA conectada** ao repo `lorDofPicanha/bretda-lp` (não era drift, era ausência total). User connectou via dashboard (Settings → Git → Connect).
- Empty commit `5a6eeb1` triggerou primeiro preview deploy.
- Auth Vercel inicialmente bloqueava preview (only Pro plan tem "Only Production Deployments" granular). User desligou Vercel Authentication inteira no Hobby plan.

## 🚨 Bug Git LFS bloqueando preview (CRITICAL)

**Root cause real** (descoberto na 4ª iteração, depois de hipóteses falsas sobre sharp/Turbopack/quota):

- Repo tem `*.png filter=lfs` em `.gitattributes` desde commit inicial
- Vercel GitHub integration clona repo mas **NÃO resolve LFS** sem token
- No build container, imagens são 130 bytes de texto LFS pointer:
  ```
  version https://git-lfs.github.com/spec/v1
  oid sha256:8e4c...
  size 86688
  ```
- Next Image rejeita 400 "not a valid image". Direct asset URLs servem texto LFS labeled `image/png`.
- **Production funciona** porque `vercel --prod` é CLI direct upload (working tree local já tem LFS hidratado)

3 paths forward (D14 pendente):
- **A** (recomendado): Generate GitHub PAT (`repo` scope) → `vercel env add GITHUB_LFS_TOKEN production preview` → resolve permanente
- **B**: Migrar do LFS (`git lfs untrack` + force-push). Repo bloat 1.3GB+ por causa dos vídeos
- **C**: Status quo (deploy CLI prod, previews broken)

## Achados Events Manager (CSV vazio + screenshot user)

- CSV export user vazio = filtro errado, não bug CAPI
- Smoke validation Orion (fbtrace `A9ay5tj69UyuIENbEXWbpAb`) confirmou Meta aceita 200 OK
- Overview tab visual: Lead • Ativo • EMQ 5.0/10 • Recebido há 1h ✅
- **Dedup CAPI↔Browser QUEBRADO** — pixel browser dispara `meta_a_lead` (custom), CAPI server dispara `Lead` (standard). Meta não dedupa eventos com names diferentes. Avisa explicitamente: "pixel browser <25% volume CAPI".
- 4 eventos custom com warnings (Engaged60/120, meta_a_lead, Entrar em contato 7d sem atividade)

## Spend cap = falso alarme

Conta Bretda é **prepaid** (paga por PIX/saldo). Em conta prepaid, `spend_cap` API field não é enforced — Meta usa saldo como cap natural. Chief reportou "99,04%" como urgência mas ratio era lifetime. Memória anterior `feedback_meta_prepaid_spend_cap.md` já documentava confusão. User resolveu via PIX (D1=A).

## LP audit findings (Fix #2 + #3 ainda pending)

| Fix | Esforço | Impact LP view rate | LP view rate projetada |
|---|---|---|---|
| #1 lazy videos ✅ FEITO | 2h | +15-20pts | 7% → 22-28% |
| #2 hero crop mobile | 30min | +3-5pts | +25-33% |
| #3 scripts Meta+Google `lazyOnload` + drop GTM duplicado | 1h | +2-4pts | +27-37% |

User escolheu **D8 = B** (Fix #1 isolado primeiro, mede 48h, decide #2 #3 baseado em uplift real).

Other findings:
- TBT 1.83s (9× pior que Good) — 387 KB Meta+Google scripts blocking main
- CLS 0.164 POOR
- LCP element é `<p>` não foto Opal (hero shifted layout)
- Hero mobile recorta 70% da mesa Opal mostrando água azul
- 5 vídeos auto-play (ignoram `preload="metadata"` em Chrome Android + Safari iOS)

## Decisões pendentes (próxima sessão)

| # | Decisão | Default Orion |
|---|---|---|
| **D14** | Como destravar preview LFS | A (PAT + GITHUB_LFS_TOKEN) |
| D11 | Test Event Code Meta (otional) | aguardando user gerar |
| D12 | Dual-fire `Lead` (browser + server matching event_id) | B (depois Fix #1 mergear) |
| Pós-merge | Fix #2 + #3 | esperar 48h Meta data |
| Pendente | Comparar LP view rate prod 7% vs preview pós-fix | medição em 48h |
| Pendente | `meta_a_lead` custom → standard `Lead` (renomear ou dual) | parte de D12 |

## Memórias criadas/atualizadas

- `project_bretda_capi_activation_LIVE_04mai.md` (criada por agent, em outra dir)
- `feedback_vercel_env_use_printf_not_echo.md` (criada por agent)
- `feedback_vercel_webhook_repo_drift.md` (criada por agent)
- `feedback_vercel_lfs_image_400.md` (criada por agent — em `.claude/agent-memory/aios-dev/`)
- `session_bretda_capi_lp_pr18_04mai.md` (este arquivo)

## Triggers pra próxima sessão

- `"libera preview bretda"` / `"resolve lfs bretda"` → D14 path A (gerar PAT + plugar)
- `"merge pr 18"` → mergear PR #18 sem preview validation (path C)
- `"valida preview bretda"` → testar imagens carregadas pós-LFS fix
- `"sobe fix 2 bretda"` / `"sobe fix 3 bretda"` → após 48h confirmar uplift
- `"dual-fire bretda"` → D12 — implementar matching event_id browser+server
- `"renomeia meta_a_lead"` → unificar com standard `Lead` event
- `"test event code bretda"` → user manda code, eu plugo via `vercel env add`

## File paths chave

- PR #18 branch: `fix/bretda-lp-lazy-videos-PR1` em `D:\AIOS\apps\bretda-lp` (repo separado, remote `lorDofPicanha/bretda-lp`)
- Preview URL: `https://bretda-lp-git-fix-bretda-4ec8d3-brenodecerqueira-4418s-projects.vercel.app`
- Production URL: `https://www.bretda.com.br` (canônico www, apex 307)
- LP audit: `D:\AIOS\docs\projects\bretda-redesign\22-lp-view-rate-audit\`
- Plano 14d: `D:\AIOS\docs\projects\bretda-redesign\21-structural-plan-may2026\`
- CAPI route: `D:\AIOS\apps\bretda-lp\src\app\api\meta-conversion\route.ts`
- Pixel constants: `D:\AIOS\apps\bretda-lp\src\lib\constants.ts:5`
- LazyVideo: `D:\AIOS\apps\bretda-lp\src\components\molecules\lazy-video.tsx`
- Vercel project: `brenodecerqueira-4418s-projects/bretda-lp` (`prj_zy9...`)

## Estrutura ativa Meta CJ8v2 (após pauses)

| Ad | Spend 7d | Leads | CTR | LP view | Status |
|---|---|---|---|---|---|
| AD10 AURORA | R$ 338 | **32** 🏆 | 2,48% | 6,9% | ACTIVE (winner) |
| AD05 | R$ 106 | 9 | 3,11% | 4,9% | ACTIVE |
| AD09 OPAL Carousel | R$ 152 | 9 | 1,75% | 5,2% | ACTIVE under review |
| AD12 CITRINO | R$ 51 | 1 | 2,33% | 1,9% | ACTIVE under review |
| AD03/AD04/AD11/AD13 | — | 0 | — | — | PAUSED hoje |

Adset `120237168468370737` budget R$120/d, advantage_audience: 0 (alavanca grátis OFF), iOS only, LOWEST_COST_WITHOUT_CAP.

## Plano estrutural pendente (não-aplicado, plano 14d)

- D+3 (07/Mai): batch CJ8v2 advantage_audience: 0→1 + remover iOS only (reset learning aceito 48-72h)
- D+5 (09/Mai): se LP view rate <20% → audit técnico LP — JÁ FEITO ANTECIPADAMENTE neste sprint
- D+7 (11/Mai): reativar CP-RTG-WARM se CPL <R$15 e leads/d ≥10
- D+10 (14/Mai): reativar CJ7v2 Luxury behavioral
- D+12-14: review consolidado, decisão bump R$200 condicional CPL <R$12 sustentado 7d

## Constraint memória

User EXPLICITAMENTE escolheu D6.Q1=skip (CTRL adset), D6.Q3=sim regra condicional, D8=B (Fix #1 isolado), D9=C (delegar webhook), D14 ainda pending.
