# #11 — Detox Coach

**Tier:** C
**Status:** ⚪ pending (side-project saúde mental do builder)

---

## DSPC

**D — Dor cara:**
Builder fica viciado em criar (Alan declarou: "comecei AIOS em outubro, levei 6 meses pra conseguir ficar 1 dia sem mexer"). Vira a noite, esposa chama, filho chama, perde sono, ganha ansiedade, eventualmente burnout. Custo: relacionamentos + saúde + criatividade tóxica.

**Custo semanal visível:** burnout = builder ofline 1-4 semanas + relacionamento desgastado = R$50-200k em projetos atrasados + custo emocional incalculável.

**S — Squad (simplificado):**
- `agent-usage-monitor` — tracking de horas no terminal/AIOS (via hook simples)
- `agent-pattern-detector` — identifica padrão de uso tóxico (>12h/dia, >5 dias consecutivos sem pausa, login pós 02h AM)
- `agent-coach-prompter` — envia mensagens Telegram com base no padrão
- `agent-suggestion-engine` — sugere atividades offline contextualizadas
- `agent-calendar-blocker` — bloqueia tempo no Google Calendar pra família/exercício
- `agent-accountability-partner` — mensageria com pessoa de confiança (esposa, sócio) com permissão

**P — Pitch:**
> "Eu ajudo builders AIOS a manter saúde mental e relacionamentos enquanto constroem coisas grandes, usando squad coach que detecta padrões tóxicos e impõe pausas estratégicas para alcançar criatividade sustentável em vez de burnout"

**C — Modelo:**
- **Free** pra alunos AIOS / membros comunidade (diferencial "ecosystem care")
- **Premium R$47/mês** standalone se algum builder quiser fora do AIOS ecosystem

---

## Vertical inicial sugerido

Comunidade AIOS internamente. Não fazer sentido vender externamente.

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `bj-fogg` (clone behavior design) | Mecânica do coaching |
| `nir-eyal` (clone hooked) | Anti-padrão de habits tóxicos |
| `acacia-parks` (clone positive psychology) | Sugestões positive |
| `rafael-calvo` (clone wellbeing-tech) | Ethical tech design |

---

## Stack proposto

- Telegram bot
- Hooks Claude Code (já tem `user_prompt_submit.py` infra)
- Google Calendar API
- Activity log local

---

## Quando começar

Quando builder principal (founder) sentir necessidade. Não tem urgência mercado. É auto-cuidado meta-tool.

Trigger: `kickoff detox-coach`
