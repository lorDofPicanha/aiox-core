# IOX-Services — Roadmap de Execução

**Princípio:** todos os 11 squads são entregues COMO SERVIÇO premium. Não vamos hospedar SaaS B2B. Vamos cobrar setup + manutenção mensal/trimestral. Ver [00-context/CONTEXT.md](./00-context/CONTEXT.md) para princípios completos.

**Ordem:** seguir tier (S → A → B → C). Dentro do tier, seguir a ordem #N.

---

## Status atual (2026-05-18)

| # | Nome | Tier | Status | Próxima ação |
|---|---|---|---|---|
| 00 | Slide Creator | S | ✅ **DONE** | (skill adicionada, ver `session_slide_creator_skill_18mai.md`) |
| 01 | Contract-on-Call Generator | S | 🟢 **NEXT** | Kickoff PRD + brainstorm + spike técnico |
| 02 | NF Emitter Multi-Município | S | ⚪ pending | Aguarda #01 ou paralelizar |
| 03 | Workflow Mapper | S | ⚪ pending | Aguarda #01 |
| 04 | Research Dashboard | A | ⚪ pending | Depende de #03 + UI |
| 05 | Anonymizer/Sanitizer LGPD | A | ⚪ pending | Componente de #01 (jurídico) |
| 06 | Tangibilização Engine | A | ⚪ pending | Meta-tool (orquestra 04+05+09 + slide-creator) |
| 07 | Squad Marketplace | B | ⚪ pending | Aguarda 3-4 squads validados |
| 08 | Cohort OS | B | ⚪ pending | Aguarda decisão monetização AIOS pública |
| 09 | Vitrine Builder | B | ⚪ pending | Compõe #06 |
| 10 | LLM Cost Optimizer | C | ⚪ pending | Trojan horse — fazer eventualmente |
| 11 | Detox Coach | C | ⚪ pending | Side-project saúde mental |

---

## Por que essa ordem

**Tier S primeiro (#01, #02, #03):**
- Cada um tem **case real validado na live** com receita comprovada (Rodrigo Lins +60%, Lucas R$70k, Lígia R$30k/mentoria)
- Esforço técnico baixo (3-5 dias cada usando AIOS atual)
- Pode rodar em paralelo se 2-3 pessoas disponíveis

**Tier A depois (#04, #05, #06):**
- Constroem em cima do Tier S (#06 orquestra os anteriores)
- Margem alta, mas exige UI + arquitetura mais cuidadosa
- #04 e #05 podem ser **componentes plug-in** dentro de #01 e #03 antes de virar produto standalone

**Tier B (#07, #08, #09):**
- Long-tail estratégico
- Só fazem sentido depois de 3-4 squads Tier S/A validados em cliente real
- #08 (Cohort OS) depende de decisão founder sobre tornar AIOS público

**Tier C (#10, #11):**
- Defensivos / trojan horse
- Sem urgência

---

## Hipóteses a validar antes de avançar

Para cada squad, antes de construir, validar:

1. **DSPC fecha?** A dor é cara, o squad é mínimo, o pitch tem 1 frase, o contrato tem continuidade?
2. **Vertical específico?** Não vamos construir "ferramenta de contratos genéricos". Vamos construir "squad de contratos para advocacia bancária litígio" OU "para escritórios fiscais EC" etc.
3. **Regra 10x está clara?** Quanto o cliente vai economizar/ganhar em 12 meses? Podemos cobrar 10% disso?
4. **Quem é o primeiro cliente?** Sem cliente em pipeline, não construir.

**Regra:** se 2+ das 4 hipóteses estão falhas, parar e refazer o PRD antes de codar.

---

## Cronograma estimado (otimista)

| Semana | Foco |
|---|---|
| 18-25/Mai | #01 Contract-on-Call MVP + primeiro cliente teste (idealmente Rodrigo Lins parceria, ou advogado próximo) |
| 25/Mai-01/Jun | #02 NF Emitter MVP + parceria contador-Lucas-style |
| 01-08/Jun | #03 Workflow Mapper MVP (usar pipeline whisper já testado) |
| 08-22/Jun | Tier A (#04, #05, #06) em paralelo conforme demanda real |
| Jul/Ago | Reavaliar Tier B/C conforme aprendizados |

⚠️ **Cronograma é conservador.** Anipis Closed Beta 30/Mai tem precedência (founder action items DEV-1..7 + SCC Patricia v2). IOX-Services rola em paralelo se houver banda mental.

---

## Triggers de pivot/kill

- `kill tool {N}` — se DSPC não fecha após 2 tentativas
- `pivot tool {N} para {vertical}` — se mercado mostra outro nicho mais quente
- `pausa iox-services` — se Anipis / clientes Bretda/Tocks demandam 100% atenção
- `acelera iox-services` — se um cliente fechar contrato premium de R$50k+ com base em squad #1-6

---

## Métricas de sucesso

**Por squad:**
- Pipeline: pelo menos 3 conversas iniciadas em 30d
- Setup: primeiro contrato fechado em 60d desde MVP
- ROI: setup ≥ R$15k (vale-da-morte boundary)

**Programa como todo (90d):**
- 3+ squads em produção
- Receita acumulada IOX-Services ≥ R$50k (3 contratos médios)
- 0 squads abandonados (todos viáveis ou pivoted para vertical melhor)

---

## Próxima ação imediata

➡️ **Abrir #01 Contract-on-Call Generator** — escrever PRD detalhado, decidir vertical inicial (recomendado: **advocacia bancária litígio** seguindo o caso Rodrigo Lins, OU **advocacia previdenciária** que tem volume alto Brasil), prospectar primeiro cliente.

Trigger: `vai com tool 01`
