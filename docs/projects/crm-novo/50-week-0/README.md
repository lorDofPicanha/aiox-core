# Week 0 — Concierge MVP Pack

**Status:** 🟢 Materiais prontos · Execução pendente (Breno faz as ações humanas)
**Data:** 2026-05-19
**Owner:** Breno
**Bloqueio:** Sprint 1 não começa antes de Gate 0 fechar verde.

---

## O que tem aqui

| Arquivo | Para que serve | Tempo de uso |
|---------|----------------|--------------|
| `01-entrevista-script-vendedor-tocks.md` | Roteiro 30min × 5 entrevistas. Validação Customer Need princípio Ries. | ~2h30 conversa + 50min análise |
| `02-dogfooding-playbook.md` | 1 dia operando Tocks sem CRM com Bridge standalone. Validação founder Moubeche. | 1 dia operacional + 30min debrief |
| `03-gate-0-review-checklist.md` | Framework de decisão Day 7: continua / amarelo / pivot / kill. | 90min review |
| `README.md` | Este arquivo. | — |

---

## Fluxo de Week 0 (7 dias)

```
Day 1 ──► 2 entrevistas (Marcus + Cristina)
Day 2 ──► Pitch doc revisado + 1 entrevista (Breno self)
Day 3 ──► Bridge standalone deploy + test events
Day 4 ──► 2 entrevistas (externos)
Day 5 ──► Dogfooding 1 dia
Day 6 ──► Reserva (recovery + análise)
Day 7 ──► Gate 0 review + decisão documentada
```

---

## O que falta (Breno faz)

- [ ] Agendar 5 entrevistas (templates de mensagem em script §Setup)
- [ ] Confirmar pitch doc 90s pra leitura interna (já existe em `99-architecture/PITCH-WEEK-0-TOCKS.md`)
- [ ] Setup Inngest + Vercel staging com env Meta + Google OAuth
- [ ] Reservar 1 dia inteiro pro dogfooding (calendário bloqueado)
- [ ] Reservar 90min Day 7 pra Gate 0 review

---

## O que NÃO falta (já entregue)

- ✅ Roteiro de entrevista pronto (8 perguntas + regras + scorecard)
- ✅ Playbook dogfooding (setup + protocolo durante + debrief)
- ✅ Checklist Gate 0 (4 caminhos: verde/amarelo/vermelho/preto)
- ✅ Pitch doc 90s (`99-architecture/PITCH-WEEK-0-TOCKS.md`)
- ✅ ARCHITECTURE + FEATURES + ROADMAP (`99-architecture/`)
- ✅ Mega research HYDRA 24 clones (`10-research/` + outputs)
- ✅ Conclave 5 experts (`40-conclave/01-conclave-synthesis.md`)

---

## Próximas pastas (criar conforme execução)

- `02-entrevistas-resultados/` — output de cada entrevista (5 arquivos `.md`)
- `04-gate-0-decision-{data}.md` — decisão final documentada

---

## Decisão Day 7 → próxima ação

| Verdict | Próxima pasta a criar | Próxima ação |
|---------|----------------------|--------------|
| 🟢 Verde | `60-sprint-1-alpha/` | Story CRM-1.1 (Foundation + Auth + Multi-tenant RLS) |
| 🟡 Amarelo | `45-re-conclave/` | Re-Conclave 60min com 3 experts diferentes (Blank/Campbell/Dunford) |
| 🔴 Pivot | `40-pivot-bridge-only/` | Move escopo full CRM, redesenha como Bridge-only product |
| ⚫ Kill | `99-synthesis/POST-MORTEM-CRM-NOVO.md` | Documenta lições, reabsorve tempo Tocks/Bretda |

---

*Concierge MVP Pack baseado em: Ries (Lean Startup) + Moubeche (founder dogfooding) + Buffett (margin of safety) + Rob Fitzpatrick (The Mom Test). Conclave 15/Mai modification #1 enforced.*
