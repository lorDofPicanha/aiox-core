# Eval-gate (seed) — Triagem Faro: OpenAI × determinístico

> Primeira rodada do eval-gate que o conclave marcou como pré-requisito antes de confiar
> na saída LLM em volume. Roda real, provider OpenAI. Data: 2026-06-25.
> Reproduzir: `cd apps/noyce && OPENAI_API_KEY=… node --experimental-strip-types scripts/eval-triage.mjs [N]`

## Setup
- **Baseline confiável:** `buildTriage` (lógica determinística, mesma usada como fallback).
- **Sob teste:** `runTriage` via provider OpenAI → **gpt-5-mini** (tier de triagem), `reasoning_effort` low.
- **Amostra:** 12 de 282 editais reais do `discovery-snapshot.json` (amostragem espaçada — cobre o snapshot inteiro, não só o começo).
- **Data de referência:** `2026-05-29` (== `TRIAGE_TODAY` do baseline) para comparação justa do prazo.

## Resultado
- **Concordância de veredito: 10/12 (83%).**
- **12/12 vieram do LLM** (zero fallback determinístico, zero recusa, todos passaram nos guardrails).

## Divergências (as 2)
| Determinístico | LLM | Edital | Leitura |
|---|---|---|---|
| `vai` (100) | `olha` (85) | Reforço Estrutural Casa de Máquinas | LLM mais cauteloso — julgamento defensável, não erro. |
| `vai` (100) | `pula` (10) | **Aquisição de calçados escolares ("tênis calce fácil")** | 🟢 **LLM CORRETO, baseline ERRADO:** é compra de bens, não obra. O regex `OBRAS_RE` deu falso-positivo; o gpt-5-mini identificou que não é engenharia. |

## Achados
1. **Concordância alta (83%) e path LLM estável** (sem fallback) já com gpt-5-mini.
2. **Divergência ≠ erro do LLM.** Num dos 2 casos o LLM superou o baseline — pegou um falso-positivo do `OBRAS_RE` (aquisição de calçados classificada como obra). → **Bug do determinístico a corrigir:** `OBRAS_RE` casa títulos que não são obra/engenharia.
3. **Correção de produto aplicada nesta sessão:** o prompt de triagem agora informa a **DATA DE REFERÊNCIA ("hoje")** ao modelo — sem ela, o LLM não tinha como julgar se o prazo estava aberto (o `daysToDeadline` já era recalculado de forma determinística, mas o *veredito* dependia disso).

## Rodada 2 — pós-fix `OBRAS_RE` (30 editais)
Após corrigir o `OBRAS_RE` (gate negativo de aquisição) e ampliar a amostra para 30:
- **Concordância: 25/30 (83%)** · **28/30 do LLM** (2 caíram em guardrail_fallback — output fora do schema; o fallback protegeu o baseline).
- 🟢 **Falso-positivo dos calçados (`01067479000146-1-00014`) agora bate `pula`/`pula`** — fix validado.
- As 5 divergências viraram majoritariamente **casos de fronteira legítimos** (não erro óbvio): contratação integrada/semi-integrada (projeto+obra), manutenção predial continuada, "substituição de carpete/refazimento". É o cinza de "isto é obra para a ENIAC?" — material para calibrar o critério com o founder, não bug.
- Sinais secundários: 1-2 possíveis falsos-positivos remanescentes do regex + lacunas de recall ("manutenção", "carpete/refazimento" não estão no `OBRAS_RE`).

### Fix aplicado (`lib/noyce-operational.ts`)
`obrasRelevant = OBRAS_RE.test(title) && !ACQUISITION_RE.test(title)`. `ACQUISITION_RE` casa
aquisição de bens (aquisição, merenda, gênero alimentício, uniforme, calçado, mobiliário,
combustível, medicamento, material escolar/expediente/limpeza, insumo) — **NÃO** inclui "registro
de preços" (método neutro). Verificado: obras reais (reforma/construção/cobertura de quadra/UBS)
seguem `vai`; aquisições (calçados/merenda) viram `pula`. 264 testes verdes, typecheck limpo.

## Rodada 3 — eval de QUALIDADE: Prisma (análise) + Forja (habilitação)
`scripts/eval-analysis.mjs`. Sem baseline de veredito → critério = **qualidade**: guardrail PASS,
veio do LLM (não fallback), e — teste-chave — **NÃO inventa número** (rodamos SEM dados de mercado;
um modelo honesto deve nular faixaPreco/concorrência com "PENDENTE_DADO"). Tier de análise = **gpt-5.5**.

**Causa-raiz encontrada e corrigida (importante):** Prisma/Forja caíam em `guardrail_fallback`
intermitentemente. O eval com erro propagado revelou: **`AbortError: This operation was aborted`** —
o timeout do `openai-client` era **60s**, e o gpt-5.5 em high effort leva **2-3 min**. Chamadas que
passavam de 60s eram abortadas → fallback. Fix: **timeout por classe de modelo** (raciocínio → 300s,
rápidos → 60s) + `finish_reason:"length"` agora vira falha explícita + folga de raciocínio 6000→12000.

**Resultado pós-fix (2 editais):**
- **Prisma: 2/2 guardrail PASS, 2/2 do LLM**, faixaPreco nulo (0 números inventados ✓).
- **Forja: 2/2 guardrail PASS, 2/2 do LLM** (decisao CONSORCIO, 4-5 fontes) — antes era 0/2.
- **Anti-alucinação: 0/2 inventados** em todas as rodadas (comportamento honesto consistente).

Reproduzir: `OPENAI_API_KEY=… node --experimental-strip-types scripts/eval-analysis.mjs [N]` (N pequeno; ~2-3 min/edital).

## Rodada 4 — WORKFLOW END-TO-END (participar de uma licitação)
`scripts/eval-workflow.mjs`. Roda a cadeia inteira sobre 1 edital real: Faro (triagem) → Prisma
(análise) → Forja (habilitação) → Escriba (pacote documental). Trecho de edital simulado (habilitação +
orçamento de referência + declarações + prazos); em produção vem do PDF real.

**Resultado:** as 4 etapas rodaram no LLM e produziram um **pacote de participação completo**:
- **Faro:** `PULA` — edital sorteado era pavimentação de vias (infra rodoviária), fora do nicho ENIAC
  (edificações/reformas). 🟢 **Outro caso LLM > regex:** o determinístico triou "vai" (casou
  "pavimenta/infraestrutura"); o LLM aplicou o perfil e recusou. → sinal p/ decidir se ENIAC faz infra/rodovia.
- **Prisma:** ✓ LLM — opportunityScore + 8 riscos + 3 pontos de impugnação, com fontes.
- **Forja:** ✓ LLM — decisão **CONSÓRCIO**, 4 atestados casados, 10 lacunas mapeadas, perfil de parceiro.
- **Escriba:** ✓ LLM — **proposta (validade 60d / prazo 180d) + planilha (6 itens, BDI 22%, total
  R$ 331k, números recomputados em código) + 11 declarações todas com fonte** (incl. consórcio).

**Veredito:** o sistema **PREPARA tudo para participar** (triagem → análise → habilitação → proposta +
planilha + declarações) deixando para o humano **decidir, assinar e submeter** (ato humano — nunca
automatizado, por design). Limites: (a) qualidade depende do **edital integral** (aqui simulado; falta o
parser de PDF p/ extrair orçamento/exigências reais); (b) preços da planilha vêm do orçamento de
referência do edital — a precificação competitiva final é decisão humana.

> Nota de harness: o relatório inicial mostrou Escriba "guardrail ✗" — era bug do script (revalidava o
> pacote já computado com o validador da saída crua). `source=llm` já implica guardrail interno OK.
> Corrigido no script.

## Próximos passos sugeridos
- [ ] Ampliar a amostra (ex.: 30–50, estratificada por veredito determinístico) para uma taxa de concordância mais robusta.
- [ ] Revisar/apertar o `OBRAS_RE` (o eval expôs falso-positivo de obras em aquisição).
- [ ] Estender o eval para Prisma/Forja (análise/habilitação) — lá não há baseline determinístico de veredito, então usar critérios de qualidade (fonte presente, zero número inventado, schema válido) em vez de concordância.
- [ ] Definir o gate de aceite (ex.: concordância ≥ X% + zero divergência onde o determinístico está comprovadamente certo) antes de soltar o LLM em volume.

## Notas
- gpt-5-mini na triagem: ~11s/edital (raciocínio). Aceitável para batch; pesado para interativo.
- Custo da rodada: 12 chamadas gpt-5-mini (baixo).
