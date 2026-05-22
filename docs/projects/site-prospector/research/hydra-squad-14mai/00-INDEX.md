# Hydra-Squad Research — Site-Prospector v1 Validation

**Disparado:** 2026-05-14
**Pattern:** Squad HYDRA-style (fallback proven 08/Mai — HYDRA pipeline broken)
**Tema:** Validar com evidência empírica as hipóteses do Site-Prospector v1 (atualmente baseado APENAS em 4 conclaves de mind clones + 1 consulta legal — zero validação de campo)

---

## Por que esta pesquisa existe

O Site-Prospector v1 foi desenhado em 12/Mai/2026 via 4 squad conclaves (12 mind clones) + Patricia Peck CDC consultation. Toda a fundação é **pesquisa simulada**, não empírica:

- ZERO entrevistas com padeiros reais
- ZERO validação de WTP R$ 3.497
- LTV math é **calculado** (premissas 7% churn / 9mo tenure / R$ 60/h cost), não testado
- 5 pre-mortems com **confidence ≤70%** já admitem fragilidade da tese

User request: rodar pesquisa massiva via HYDRA para cross-check empírico ANTES do prospect #1 (especialmente as 2 hipóteses mais frágeis: WTP R$3.497 e AIOS faz 80%).

---

## Hipóteses sob teste (pre-mortems)

| # | Hipótese | Confidence pre-pilot | Agent responsável |
|---|---|---|---|
| H1 | Padaria Tier S BR paga R$ 3.497 | **50%** 🔴 | A2 (WTP) + A7 (concorrência) |
| H2 | Recurring R$ 247 sem churn 90d | 70% | A6 (LTV/churn) |
| H3 | AIOS faz 80% do trabalho | **40%** 🔴 | A4 (one-man mortality) |
| H4 | Build cabe ≤16h c/ AIOS 60% | 60% | A4 |
| H5 | Zero litígio em 4 semanas | 90% | A5 (PROCON/CDC) |

**Unknown unknowns mapeados:**
- Sazonalidade real maio Blumenau (A1)
- Refs visuais locais reais (A3)
- Outreach presencial close rate cidade pequena BR (A8)

---

## 8 Agentes disparados (paralelo, background)

| # | Agent | Tema | Hipótese alvo | Output target |
|---|---|---|---|---|
| A1 | aios-analyst | Mercado padaria/confeitaria SC/Blumenau (CNAE, qty, ticket, faturamento, sazonalidade) | Sample feasibility | `01-market-padaria-sc.md` |
| A2 | general-purpose | WTP digital SMB padaria BR — R$ 3.497 é realista? | H1 | `02-wtp-digital-smb-padaria-br.md` |
| A3 | general-purpose | Refs visuais padaria artesanal SC/PR/RS (não Tartine global) | Quality gate refs locais | `03-refs-visuais-padaria-sul-br.md` |
| A4 | aios-architect | Agência one-man mortality BR + AIOS contribution thesis | H3, H4 | `04-agencia-one-man-mortality-br.md` |
| A5 | general-purpose | PROCON/CDC casos garantia condicional digital BR | H5 | `05-procon-cdc-garantia-digital.md` |
| A6 | general-purpose | LTV/churn SMB local BR recurring R$100-300/mo | H2 | `06-ltv-churn-smb-local-br.md` |
| A7 | general-purpose | Pricing landscape SC: sobrinho/freelancer/agência | H1 cross-check | `07-pricing-landscape-sc.md` |
| A8 | general-purpose | Close rate outreach presencial D2D cidades pequenas BR | Outreach feasibility | `08-outreach-presencial-d2d-br.md` |

**Synthesis (próximo passo após 8 deliverables):** `99-synthesis-master-report.md` + `99-decisions-needed.md`

---

## Anti-bias instructions broadcast pra todos os 8 agents

1. **Procurar contra-evidência** — não confirmar tese; refutar
2. **Citar fontes** com URLs (Sebrae, IBGE, ABIP, ConfirmInd, Reclame Aqui, Procon, etc)
3. **Distinguir** dados primários (research empírico) vs opinião especialista vs case study isolado
4. **Cobertura mínima:** 1.5-2k palavras por deliverable
5. **Não fabricar números** — se não achou, escrever "DADO NÃO ENCONTRADO" explicitamente
6. **Window temporal:** priorizar 2023-2026

---

## Status execution

- [x] Workspace criado
- [x] ~~8 agents disparados em paralelo~~ ABORTADO — user rejeitou subagentes, pediu HYDRA real
- [x] HYDRA pipeline configurado (10 RSS BR + 10 web URLs + 63 keywords domains)
- [x] HYDRA pipeline rodado (`hydra run --sources rss,web --verbose` — 41min, exit 0)
- [x] 144 items ingested no KB (`D:/jarvis/mega brain/knowledge/{negocios,marketing,legal}/`)
- [x] 12 evidências extraídas → `99-synthesis-master-report.md`
- [x] **8 feeds manuais escritos** (workaround distribution bug):
  - `alex-hormozi/2026-05-15-hydra-feed-site-prospector.md` (Grand Slam lens, 7 items)
  - `seth-godin/2026-05-15-hydra-feed-site-prospector.md` (permission/tribe lens, 5 items)
  - `patricia-peck/2026-05-15-hydra-feed-site-prospector.md` (CDC/PROCON lens, 3 items)
  - `lincoln-murphy/2026-05-15-hydra-feed-site-prospector.md` (churn/Success Vector lens, 5 items)
  - `eric-ries/2026-05-15-hydra-feed-site-prospector.md` (validated learning lens, 4 items)
  - `eliyahu-goldratt/2026-05-15-hydra-feed-site-prospector.md` (TOC/throughput lens, 3 items)
  - `april-dunford/2026-05-15-hydra-feed-site-prospector.md` (positioning lens, 4 items)
  - `matt-dixon/2026-05-15-hydra-feed-site-prospector.md` (Challenger Sale lens, 4 items)
- [ ] Distribution bug fix + re-run (D4 decision pendente user)
- [ ] Audit dos feeds entregues para feedback loop
