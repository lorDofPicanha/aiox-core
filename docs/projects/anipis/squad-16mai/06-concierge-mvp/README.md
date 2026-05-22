# Concierge MVP — Sprint -1 (Anipis)

**Pacote operacional Sprint -1 Concierge MVP humano** — validação comportamental Eric Ries via WhatsApp Business + 3 facilitadoras psi supervisionadas + 20 Júlias 18-29 recrutadas via CAPS + universidade pública.

**Janela operacional:** 30/Mai/2026 → 13/Jun/2026 (14 dias)
**Setup:** 23/Mai/2026 → 29/Mai/2026 (D-7 a D-1)
**Decision:** 13/Jun/2026 EOD (D+14)
**Post-analysis:** 14-20/Jun/2026 (interviews + wrap PDF)
**Data destruction deadline:** 29/Jun/2026 (D+30)

**Decisão originária:** D-02 (`../99-synthesis/01-decisions-needed.md` linhas 41-61) — fechada 2026-05-16 via bulk trigger `aceito recomendações orion p0a`.

**Cash burn budgeted:** R$3.430

---

## 1. Arquivos deste pacote

| # | Arquivo | Conteúdo | Status | Data criação |
|---|---------|----------|--------|--------------|
| 1 | [`SAI-CON-001-concierge-mvp.md`](./SAI-CON-001-concierge-mvp.md) | Story formal AIOS template (SAI-XXX) com 17 ACs sequenciais + 9 tasks operacionais + Dev Notes + Testing + File List + Status changelog | Ready | 2026-05-16 |
| 2 | [`concierge-script-pt-br.md`](./concierge-script-pt-br.md) | Script PT-BR clínico: welcome message D0 + 14 daily touchpoints + 5 mood check-in formats + 8 IF/THEN trees + 3 crisis phrases canônicas + 5 do/don't language patterns + closing D+14 | Ready | 2026-05-16 |
| 3 | [`concierge-runbook-14d.md`](./concierge-runbook-14d.md) | Runbook operacional D-7 → D+14: roles + setup D-7 a D-1 + execução D0-D+13 + GATE D+7 + wrap D+14 + decision GO/PIVOT/KILL + crisis escalation runbook + bandwidth budget + risk register | Ready | 2026-05-16 |
| 4 | [`concierge-recruitment-plan.md`](./concierge-recruitment-plan.md) | Recrutamento 20 Júlias via 3 vias paralelas (CAPS + univ pública + advisor indicação), 3 templates cold outreach (CAPS/univ/advisor), screening pipeline 4-step, consent form LGPD-compliant template, post-interview script | Ready | 2026-05-16 |
| 5 | [`concierge-kpi-dashboard.md`](./concierge-kpi-dashboard.md) | KPI dashboard Innovation Accounting: north star (D+7 unprompted return ≥35%) + 3 drivers (sessions/week, vulnerability latency, PHQ-9 delta) + 3 guardrails (safety, NPS, complaint rate) + vanity metrics PROIBIDAS + daily report + D+7 gate report + D+14 wrap-up templates | Ready | 2026-05-16 |
| 6 | [`README.md`](./README.md) | Este índice | Ready | 2026-05-16 |

---

## 2. Ordem de leitura sugerida

Para founder antes de kick-off D-7 (23/Mai):

1. **README.md (este arquivo)** — overview 5min
2. **SAI-CON-001-concierge-mvp.md** — story formal + ACs 15min
3. **concierge-runbook-14d.md** — operacional macro 30min
4. **concierge-recruitment-plan.md** — pipeline recrutamento 20min
5. **concierge-script-pt-br.md** — script (memorizar com facilitadoras) 30min
6. **concierge-kpi-dashboard.md** — dashboards + decision criteria 20min

**Total:** ~2h leitura pré-kick-off.

---

## 3. Quick reference — Critérios GO/PIVOT/KILL D+14

| Outcome | Critério (ALL must apply para GO) | Trigger user |
|---------|------------------------------------|---------------|
| **GO** | D+7 unprompted ≥35% + sessions/wk ≥2.5 + PHQ-9 delta ≥3pts + 0 RED não-resolvidos + NPS ≥8 + ≥10 desejam continuar | `vai com sprint 1 anipis` |
| **PIVOT** | 1-2 dimensões abaixo + tendência positiva + qualitative friction acionável | `pivot anipis para [X]` ou `extend concierge +7d` |
| **KILL** | ≥3 dimensões abaixo + qualitative friction estrutural não-acionável | `kill anipis volta 2027` |

---

## 4. Quick reference — Crisis SLAs

| Level | First response SLA | Advisor SLA | Action |
|-------|---------------------|-------------|--------|
| GREEN | ≤2h (janela 18-22h) | — | Log only |
| YELLOW | ≤30min | ≤4h read-only | Validate + presence |
| ORANGE | ≤10min | ≤30min consult | Phrase 2 (script §5) + plan |
| RED | ≤90s | ≤30min | Phrase 1 (script §5) + Mr Walker + outcome documented |

---

## 5. Quick reference — Cash burn budgeted

| Item | Cash |
|------|------|
| 3 facilitadoras psi × 14d × R$800 | R$2.400 |
| 20 vouchers PIX × R$50 | R$1.000 |
| SIM card dedicado WABA | R$30 |
| **Total** | **R$3.430** |

(Adherence: `../99-synthesis/master-report.md` §9 banda R$1.2-2.5k Concierge + R$2.4k facilitadoras.)

---

## 6. Cross-references chave

### Mind clones conclave

- **Eric Ries** (`../04-clone-conclave/c-gtm-beta/eric-ries.md`) — Concierge MVP rationale + Innovation Accounting + Five Whys
- **Alison Darcy** (`../04-clone-conclave/a-samd-vs-wellness/alison-darcy.md`) — Recrutamento CAPS + univ + 5 crisis traps + Mr Walker
- **Sean Duffy** (`../04-clone-conclave/c-gtm-beta/sean-duffy.md`) — Cohort design + welcome call humano + 2 push/dia max + behavioral activation

### AIOS deliverables

- **UX Design (Uma)** (`../02-deliverables/08-ux-design-expert.md`) — Persona Júlia P1 (24, Recife, TAG, escitalopram, CLT R$3.2k) + 5 design principles + crisis UX
- **Voice v2** (`../03-rebrand-v2/07-VOICE-REFINED.md`) — Voice canon PT-BR (1ª pessoa Anipis, "você" sempre, anti-positividade tóxica, 7 do/don't, 10 commandments Ethical UX Calvo)

### Síntese cross-agent

- **Master Report** (`../99-synthesis/master-report.md`) — Insight 4 (Sprint -1 não-codificado = Ries + Sean + Alison combinados) linhas 201-204; §6 Revised Roadmap linhas 213-227
- **Decisions** (`../99-synthesis/01-decisions-needed.md`) — D-02 Concierge MVP rationale linhas 41-61 (decisão originária deste pacote)

---

## 7. Non-goals deste pacote (escopo explícito)

- ❌ **Zero código produto Anipis** — esta story NÃO toca `apps/serenity-ai/`, NÃO cria PR, NÃO deploya
- ❌ **Zero design renders / PNGs** — design system v2 está separado em `../03-rebrand-v2/` + `../05-design/`
- ❌ **Zero recrutamento via Instagram / Meta Ads** — exclusivamente CAPS + univ pública + advisor indicação (Alison Darcy linha 30 + Eric Ries linha 16)
- ❌ **Zero LLM chamadas no piloto** — operação 100% humana via WhatsApp Business (Alison Darcy linha 27 ponto 4)
- ❌ **Zero adolescentes** — 18-29 only; <18 e ≥30 excluídos do cohort (D-04 squad 08/Mai + Alison concorda)
- ❌ **Zero claims de eficácia** — wellness positioning, sem propaganda de outcomes (CFM 2.454/2026)

---

## 8. Decisão originária + bulk trigger usado

**D-02:** `../99-synthesis/01-decisions-needed.md` linhas 41-61
**Trigger:** `aceito recomendações orion p0a` (bulk D-01 a D-05) — fechado 2026-05-16
**Outras decisões P0a aceitas no mesmo bulk:**
- D-01 SaMD híbrido Bakul-arquitetura + Alison-execução
- D-03 Stack atual + Langfuse (Demis wins, rejeita LangGraph/Mem0)
- D-04 Clinical co-founder CRP 8-15% equity (Halle insight)
- D-05 Bulk Uma rebrand v2 (D3 + multi-theme B + 3 fonts + Caixinha roadmap + 3 renders)

---

## 9. Versão + assinatura

**v1.0** — pacote inicial completo, 5 arquivos + README.
**Autor:** Orion (Master Orchestrator AIOS) — squad anipis/squad-16mai
**Data:** 2026-05-16
**Status:** Ready (aguardando founder kick-off D-7 = 23/Mai/2026)

**Próximo passo founder:**
1. Ler em ordem §2 (~2h)
2. Trigger setup D-7 (sáb 23/Mai): T1.1 SIM card + T2.1 outreach facilitadoras + T3.1 cold email CAPS + T3.2 cold email univ públicas
3. Pause Sprint 0 técnico em paralelo durante D-7 a D+14 (bandwidth)

---

*Orion — Master Orchestrator AIOS · Squad Anipis 16/Mai*
*"A Júlia decide se Anipis existe ou não — e ela decide pelo dedo no telefone, não pela nossa fé no backend."*
