# Doc 33 — Auditoria de Bugs + Hardening (Fase B.1 → pré-scheduler)

**Data:** 2026-06-20
**Gatilho:** caça adversarial a bugs (3 caçadores QA paralelos + verificação contra a referência oficial da Claude API) após entrega da Fase B.1 (Sentinela runtime).
**Escopo auditado:** motor de prazo preclusivo (`noyce-deadline.ts`, `noyce-dates.ts`, `maestro-runtime.ts`), máquina de estados (`orchestrator.ts`, `maestro-types.ts`, `guardrails.ts`), fiação do cliente LLM (`claude-client.ts`, agentes, `smoke-agents.mjs`).
**Veredito de entrada:** NEEDS_WORK — engine puro sólido (240 testes verdes), mas a camada nova `maestro-runtime.ts` tinha **zero testes** e escondia os 2 piores defeitos.

---

## 1. Achados (consolidado, com dedup)

Severidade: 🔴 crítico (bloqueia deploy) · 🟠 alto · 🟡 médio · 🔵 baixo.

| ID | Sev | Título | Arquivo | Status |
|----|-----|--------|---------|--------|
| C1 | 🔴 | Fuso naive em `proposalDeadline`/`eventTime` (classe Fortaleza×SP) | `maestro-runtime.ts` + dados | corrigir |
| C2 | 🔴 | Prazo nunca reavaliado nas transições (I12/A4 ausente) | `orchestrator.ts` | corrigir |
| C3 | 🔴 | `enforceHumanActs` furado por sinônimo (fura I1) | `guardrails.ts` | corrigir |
| A1 | 🟠 | `effort`/`thinking` quebram o Faro (Haiku 4.5 → 400) | `claude-client.ts` | corrigir |
| A2 | 🟠 | Clock fatal armado para eventos `cancelled`/`missed` | `maestro-runtime.ts` | corrigir |
| A3 | 🟠 | Veto de protocolo apagado por `startsWith` em slot compartilhado | `orchestrator.ts` | corrigir |
| M1 | 🟡 | Calendário de feriados acaba em 2026-12-25 (sem guard) | `feriados-nacionais.json` | corrigir (guard) |
| M2 | 🟡 | `calendarDaysDeadline` não prorroga em dia não-útil | `noyce-deadline.ts` | **DECISÃO FOUNDER** |
| M3 | 🟡 | `claude-client.ts` sem timeout/retry | `claude-client.ts` | corrigir |
| M5 | 🟡 | `daysToDeadline` confiado da LLM (deveria recalcular) | `triage-agent.ts` | corrigir |
| M6 | 🟡 | casts `as T[]` fora do try → TypeError | `claude-client.ts` | corrigir |
| M7 | 🟡 | `smoke-agents.mjs` não verifica `source==="llm"` | `smoke-agents.mjs` | corrigir |
| B1 | 🔵 | dead code; `markClock`/`findClock` divergem | `maestro-runtime.ts` | backlog |

### Detalhe dos críticos

**C1 — Fuso naive.** Datas no fixture são `"2026-06-25T10:00:00"` (sem `Z`, sem `-03:00`). `new Date()` parseia como hora **local do servidor**. Em produção (Vercel/Railway = UTC) → prazo 3h adiantado; após meia-noite o **dia civil inteiro desloca** → preclusão silenciosa. Os testes mascaravam (usavam `-03:00` explícito). Mesma classe de bug que já mordeu noutro projeto (Fortaleza×SP). **Fix:** normalizar na fronteira (anexar `-03:00` a datetime sem fuso), nunca dentro do engine puro; teste forçando `TZ=UTC`.

**C2 — Prazo não reavaliado.** `isDeadlinePassed`/`dueAt` não era checado em transição nenhuma; o engine só reagia ao evento explícito `prazo_venceu`. Probe: `entregando→pronto-protocolo` passava com clock vencido → **proposta protocolada fora do prazo**. É o "sinal único" que o doc 32 §10 (I9) proíbe. **Fix:** guarda de prazo reavaliada em toda transição que custa tempo; clock fatal vencido → estado de prazo-perdido registrado, não avanço silencioso.

**C3 — `enforceHumanActs` furado.** Blocklist de ~6 frases; ≥8 de 10 atos vinculantes passavam por sinônimo. Fura I1 (ato vinculante = responsabilidade humana/criminal). **Fix:** detecção robusta de verbos de ato vinculante; `MAESTRO_BINDING_ACTS` alinhado ao enforcement (fonte única).

### Falsos positivos refutados (importante para o registro)

Um dos caçadores (modelo com cutoff de API anterior) alegou 3 "críticos" no `claude-client.ts` ("`output_config`/`effort` não existem", "`thinking: adaptive` é inválido", "parser ignora tool_use"). **Todos refutados** contra a referência oficial da Claude API (skill `claude-api`): `output_config.format`/`effort` são GA, `adaptive` é o modo recomendado em Opus 4.8, e structured outputs voltam como bloco `text` (parser correto). O defeito real do cliente é só o **A1** (específico de Haiku 4.5). **Lição:** harness verde não prova o caminho real da API; e achado de LLM sobre a própria API exige verificação contra a referência viva.

---

## 2. Áreas verificadas e SÓLIDAS (sem bug — não mexer)

- Contagem de dias úteis (off-by-one): correta, coberta por testes de fronteira.
- Conversão de fuso **dentro** do engine (`brCivilMidnightUtc`/`toBrIso`): correta (usa `Date.UTC`/`getUTC*`, premissa −03:00 fixo válida sem DST desde 2019). O perigo não é o engine — é alimentá-lo com string sem fuso (C1).
- Hora-cheia / borda de meia-noite: correto (Fronteira 4-5 cobrem 17:59→t-0, 18:00→vencido).
- Eventos sem data (`eventTime: null`): pulam clock — conservador correto (I2/I5).
- Os 7 caminhos proibidos do §13.1 (terminais, congelado→re-triagem, C2/C3, gates humanos, I6 scheduler-read-only): travados com teste negativo forte.

---

## 3. Decisão pendente do founder

### M2 — Prorrogação de prazo CORRIDO em dia não-útil
**Pergunta:** quando um prazo *material* corrido (`basis: "corridos"`) vence em sábado/domingo/feriado, ele **prorroga** para o próximo dia útil (CC art. 132 §1º / regra geral) ou vence no próprio dia?
**Estado atual:** o código assume "NÃO prorroga" (com comentário pedindo validação). **Risco contido:** hoje TODOS os clocks em `maestro-runtime.ts` usam `basis: "uteis_horacheia"` — nada usa `corridos` em produção ainda. É bomba-relógio para quando alguém armar um clock corrido.
**Ação:** founder/jurídico decide a regra → vira teste travado. Marcado no código com `// FOUNDER-DECISION:`.

---

## 4. Pendências técnicas de médio prazo (backlog)

- **M1 (longo prazo):** job anual que estenda `feriados-nacionais.json` (ou Computus para móveis). O guard de validade (lança se cruzar ano não coberto) é o paliativo aplicado agora — converte preclusão silenciosa em erro alto.
- **A1 (verificar):** confirmar via Models API se `claude-haiku-4-5` aceita `thinking: {type:"adaptive"}`. O fix atual omite `effort` e `thinking` para a família Haiku por segurança.
- **B1:** limpar dead code e reconciliar `markClock`/`findClock`.
- **Cobertura:** `maestro-runtime.ts` saiu de 0 → coberto. Manter a disciplina: toda camada que dirige relógio preclusivo precisa de teste com `TZ=UTC`.

---

## 5. Critério de liberação (gate)

NÃO ligar o scheduler real nem os agentes LLM ao vivo até: **C1, C2, C3, A1, A2, A3 corrigidos e cobertos por teste**, suíte 100% verde (incluindo casos `TZ=UTC` e Haiku), e typecheck limpo.
