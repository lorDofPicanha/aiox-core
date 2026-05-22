# #08 — Cohort OS (estilo LX Fundamentals)

**Tier:** B
**Status:** ⚪ pending (depende de decisão founder sobre tornar AIOS público)

---

## DSPC

**D — Dor cara:**
Founder/instrutor que tem framework próprio (igual Alan tem o LX/IOEX) precisa rodar cohort com 50-100 alunos. Tools atuais (Notion + Teachable + Zoom + Discord) são frágeis, não integradas, exigem 20-30h/sem do instrutor em operação. Cada turma é reinvenção. Onboarding manual. Distribuição de bônus/skills é caótica.

**Custo semanal visível (founder):** 25h/sem × R$500/h tempo founder em ops cohort = R$12.5k/sem desperdício em coordenação. + alunos desistem por má experiência.

**S — Squad:**
- `agent-cohort-builder` — cria turma com 8-16 encontros, calendário, alunos
- `agent-skill-distributor` — distribui skills/squads/bônus aos alunos conforme progresso
- `agent-ps-scheduler` — agenda PS (peer sessions) 2x/sem
- `agent-onboarding-bot` — onboard novo aluno em 30min (vs 8h manual)
- `agent-progress-tracker` — track checkpoints, certificações, cashback elegibilidade
- `agent-cashback-handler` — cashback automático na elegibilidade (LX-style)
- `agent-community-conector` — match alunos com problemas similares
- `agent-instructor-dashboard` — visão founder do cohort em tempo real

**P — Pitch:**
> "Eu ajudo founders de comunidades de aprendizado a operar cohorts de 50-200 alunos em 5h/sem em vez de 25h/sem, usando squad operacional integrado para alcançar 3x retenção e cashback automático que move alunos pro tier premium"

**C — Modelo:**
- Para Alan-esque founders: setup R$30-80k + R$5-10k/mês manutenção + rev-share opcional
- Para nós internamente: AIOS Cohort programa para monetizar AIOS publicamente

---

## Vertical inicial sugerido

**Founders de comunidades AI / dev / business** que rodam cohorts e querem profissionalizar operação.

**Internamente:** se decisão for monetizar AIOS publicamente, é nossa própria infra para AIOS Cohort.

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `oalanicolas` | Mind clone architect (criação de clones se vendermos cohorts focados em clonagem) |
| `squad-creator` | Squads são entregues como bônus pros alunos |
| `sop-extractor` | Conteúdo do curso vira SOPs reusáveis |
| `entity-registry` | Skills/bônus distribuídos rastreados |

---

## Stack proposto

- **Backend:** Next.js + Supabase + Inngest (filas)
- **Comunicação:** Discord/Slack/WhatsApp integrações
- **Calendário:** Cal.com / Zapier
- **Pagamento + Cashback:** Stripe + lógica custom

---

## Quando começar

- Anipis launched (30/Mai → 7/Jun)
- 3+ squads IOX-Services em produção
- Decisão founder: monetizar AIOS publicamente OU rodar internamente como diferencial

Trigger: `kickoff cohort-os`
