---
name: Tocks v4 Fantastic Overnight Run 05/Mai
description: Sessão overnight 05/Mai 22h+. User rejeitou v3 ("caiu no mesmo problema, era pra fazer um design totalmente novo"). Pediu 10/10 e foi dormir. Orion rodou autônomo — manifesto 10/10 + 3 squads paralelos (Editorial / Dark Gallery / Underground Biennale) + 5 ferramentas novas + handoff doc.
type: project
originSessionId: 7a29767b-6737-425a-9815-77f2c37071de
---
# Tocks v4 Fantastic — Overnight Autonomous Run

**Branch:** `feat/redesign-foundation-tokens`
**Status:** [a preencher quando squads terminarem]

## Trigger original

User mensagem 05/Mai noite: *"gostei [da v3], mas caiu no mesmo problema da outra, era para fazer um desing totalmente novo, sem aproveitar nada do que foi feito anteriormente, quero um site 10/10 os clones e squads tem total libertade para fazer como quiserem, mas quero algo fantastico, se achar nessesario criar algum ferramneta ou fazer algo que ajudaria no processo, voce tem esta liberdade, vou dormir resolva como quiser"*

## Diagnóstico Orion (por que v3 também foi 8/10)

V1 (4/10), V2 (8/10 técnico mas user "ainda simples"), V3 (8/10 self-score user "mesmo problema"). Padrão: squads sabem executar bem, **teto é o brief**. Briefs anteriores codificaram "luxo discreto" Cassina/B&O ou "luxo cinematográfico contido" Aston comportado. Resultado: bonito profissional **mas safe**.

10/10 não é "mais polido". É RADICAL.

## 7 vícios "ainda simples" identificados (manifesto)

1. Headlines tímidos (≤120px sem vídeo carregando o palco)
2. Preservation tax (cada regra herdada = corte 0.5 ponto)
3. Section gaps 48-81px (B&O canon ok pra catálogo de TVs, tímido pra 3 mesas)
4. Foto produto como hero subject (10/10 é autoridade primeiro, produto scroll 2-3)
5. Stack convencional safe (headline + subhead + CTA + image SaaS pattern)
6. Asymmetric balance ≠ asymmetric layout (mirror 50/50 não conta)
7. Color palette safe (black + cream + gold = cliché luxo)

## 5 atributos 10/10 (manifesto)

A. Atitude editorial (afirma, não vende)
B. Densidade narrativa (8+ movimentos cinematográficos com transições fortes)
C. Decisões corajosas visíveis (1+ decisão que designer médio NÃO faria)
D. Tipografia como protagonista (2+ seções onde tipografia É o conteúdo visual)
E. Detalhes invisíveis-mas-sentidos (letter-spacing por scale, line-height por rhythm musical)

## 3 teses dispatched (background, paralelo)

| Thesis | Vibe | Decisão corajosa | Squad agent |
|---|---|---|---|
| **A — Editorial Magazine** | Apartamento + Wallpaper + Phaidon. Light canvas warm, headline 240px+ display light, full-bleed brutal | SEM hero CTA — autoridade pura | aios-ux (Uma) |
| **B — Dark Gallery Theater** | MoMA after-hours + Aman + B&O flagship. Dark void radical 2-cor disciplina absoluta | Página inteira #0a0a0c, ZERO accent saturado | design-chief |
| **C — Underground Biennale** | Berlin Biennale + Documenta + Hatje Cantz. Catálogo cultural max-1069 architectural grotesque | Iconografia integrada nos headlines + container 1069px | aios-ux (Uma) |

Cada squad recebeu manifesto + freedom charter + thesis brief específico + DESIGN.md de 2-3 references via Refero MCP.

## 5 ferramentas novas criadas

1. `apps/tocks-website/src/app/preview/v4-compare/page.tsx` — Comparison page interativa Next.js (3 modes: side-by-side / single-zoom × desktop/mobile)
2. `docs/projects/tocks/v4-fantastic/tools/capture-all-theses.mjs` — Playwright capture uniforme em 4 viewports
3. `docs/projects/tocks/v4-fantastic/tools/score-against-manifesto.mjs` — Scorer automático contra checklist manifesto
4. `docs/projects/tocks/v4-fantastic/tools/extract-brand-book.mjs` — Pipeline reusável Refero MCP → brand book sintetizado
5. `docs/projects/tocks/v4-fantastic/tools/build-static-comparison.mjs` — HTML standalone (sem Next.js) com todas as capturas

## DESIGN.md puxados via Refero MCP (5 references)

- `docs/projects/tocks/v4-fantastic/research/studio-tumulte.md` — editorial canvas warm + Art Blue accent + 71px gap + ghost buttons
- `docs/projects/tocks/v4-fantastic/research/exhibition-magazine.md` — full-bleed images + DIN display + section gaps 60px+
- `docs/projects/tocks/v4-fantastic/research/andreas-antonsson.md` — Shadow Gallery Spotlit Art (Dahlia 144px, 2-color radical)
- `docs/projects/tocks/v4-fantastic/research/berlin-biennale.md` — architectural grotesque + violet punctuation + max-1069px
- `docs/projects/tocks/v4-fantastic/research/elva.md` — typographic brutalism + 240px+ headlines + iconografia integrada

## Triggers pós-acordada user

| User diz | O que disparar |
|---|---|
| `vai com thesis a/b/c` | Squad full-build site inteiro baseado na thesis escolhida (rotas reais, todas pages) |
| `frankenstein a+b` (ou variantes) | Mix elementos das teses escolhidas em quarta versão |
| `nenhuma serve, recomeça` | 3 novas teses com manifesto refinado baseado no feedback |
| `melhora thesis x` | Refinement cirúrgico da thesis específica |
| `licencia fonts thesis x` | Research licensing + custo das fonts proposed |
| `agenda fotógrafo` | Brief Itajaí R$3-5k atelier-grade product photography |

## Caveats / pendências

- ZERO commits — tudo working tree
- Dev server pode ou não estar rodando — squads usaram seus próprios builds
- Refero MCP estava deferred no toolset dos subagents — eles precisaram ToolSearch antes de chamar
- Fontes proposed (Söhne, ABC Monument Grotesk, Druk Wide) são placeholder licensing — user decide se vai licenciar depois de escolher direção

## Outros frentes ativos NÃO TOCADOS hoje à noite

- Tocks D++ CAPI Activation SLA 07/Mai (Railway domain bug user fix manual)
- OAuth Production Migration token Bretda expira ~06/Mai
- Polymarket weather-only LIVE PID 1488
- Bretda CAPI + LFS bug pra preview Vercel

## Path canônico do projeto

`docs/projects/tocks/v4-fantastic/`
- `manifesto/` — 10-10-manifesto.md + freedom-charter.md + tocks-brand-book.md (futuro)
- `theses/` — 3 thesis briefs + 3 thesis reports
- `research/` — 5+ DESIGN.md de luxury references
- `tools/` — 4 scripts + comparison page (na app)
- `captures/comparison/` — Playwright PNGs (gerados quando squads finished)
- `comparison/` — index.html standalone + score JSONs
- `handoff/BOM-DIA-BRENO.md` — primeiro doc pra ler ao acordar
