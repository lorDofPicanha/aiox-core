# Gate de Aceite — Squad LLM do Noyce (Faro / Prisma / Forja / Escriba)

**Status:** 🟢 implementado 26/Jun/2026
**Código:** `apps/noyce/lib/eval/gate-criteria.ts` (critérios + função pura) · `apps/noyce/scripts/eval-gate.mjs` (runner) · `apps/noyce/tests/noyce-eval-gate.test.mjs` (15 testes)

## Por que existe

Os evals de 25/Jun (`eval-triage.mjs`, `eval-analysis.mjs`, `eval-workflow.mjs`) imprimiam relatórios legíveis, mas **não tinham critério objetivo de aprovação** — ficava por interpretação humana se o squad estava "bom o suficiente". Este gate fecha esse follow-up: define limiares, roda as 3 dimensões e emite **PASS / FAIL** com exit code (0/1), utilizável como gate de CI ou pré-promoção de provider/modelo.

## Filosofia

- **A triagem NÃO é medida por "concordar 100% com o regex".** Em vários casos o LLM **acertou** e o baseline determinístico errou (ex.: aquisição de calçado escolar classificada como "obra" pelo `OBRAS_RE`). Por isso o gate tolera **divergências suaves** (vereditos adjacentes: vai↔olha, olha↔pula) e só penaliza **divergências duras** (vereditos opostos: vai↔pula) e erros de execução.
- **A qualidade da análise é medida por guardrail + anti-alucinação**, não por opinião. O critério-chave é: sem dados de mercado, o modelo devolve preço **nulo** (`PENDENTE_DADO`), nunca um número fabricado.
- **Honestidade > completude.** Um `FORJA: INDETERMINADO` quando o edital não traz a habilitação econômica é comportamento correto, não falha.

## Critérios objetivos

| Dimensão | Métrica | Limiar | Observado (25/Jun) |
|---|---|---|---|
| **Triagem (Faro)** | concordância com baseline | ≥ 80% | 83% |
| | taxa de fallback | ≤ 10% | 0% (28-30/30 LLM) |
| | erros de execução | 0 | 0 |
| | divergências duras (vai↔pula) | ≤ 1 | 0 |
| **Análise (Prisma/Forja)** | guardrail PASS | 100% | 4/4 |
| | números inventados (anti-alucinação) | 0 | 0 |
| | veio do LLM (não fallback) | ≥ 80% | 100% |
| **Workflow E2E** | etapas no LLM (Faro→Prisma→Forja→Escriba) | 4/4 | 4/4 |
| | pacote completo (planilha + declarações c/ fonte) | sim | sim |

**Veredito consolidado:** `PASS` exige **todas as dimensões presentes E aprovadas**. Se alguma dimensão não foi rodada, o resultado é `PARCIAL` (não certifica o gate inteiro). Qualquer dimensão presente reprovada → `FAIL`.

## Como rodar

```bash
cd apps/noyce
# gate completo (~10-12 min, usa tier de raciocínio gpt-5.5):
OPENAI_API_KEY=sk-... node --experimental-strip-types scripts/eval-gate.mjs

# check rápido e barato (só triagem):
OPENAI_API_KEY=sk-... node --experimental-strip-types scripts/eval-gate.mjs --dim=triage --triage-n=20

# dimensão isolada:
node --experimental-strip-types scripts/eval-gate.mjs --dim=analysis --analysis-n=3
```

Opções: `--dim=all|triage|analysis|workflow` · `--triage-n=N` · `--analysis-n=N` · `--no-write`.

Saída: relatório no terminal (✓/✗ por check) + JSON em `apps/noyce/lib/data/eval-gate-report.json` + **exit code** (0=PASS, 1=FAIL/PARCIAL).

## A lógica de critérios está coberta por testes

`tests/noyce-eval-gate.test.mjs` (15 testes, na suíte) valida os limiares, a classificação dura×suave e o veredito consolidado **sem fazer chamadas de API** — então o contrato do gate não regride silenciosamente. O runner (`eval-gate.mjs`) é o único que toca a rede e fica fora da suíte (consome crédito).

## Juiz da triagem: GOLDEN SET (humano), não o regex-baseline

> Atualização 26/Jun: rodar o gate ao vivo mostrou que comparar a triagem do LLM contra o **regex-baseline** é um juiz fraco — o regex é cru, o LLM é mais nuançado, e eles divergem ~20-25% em casos genuinamente ambíguos ("registro de preços / fornecimento de material para obra"). A concordância balançava 80/85/75% conforme a amostra. Aplicando o princípio *"suspeite do juiz, não do alvo"*, o juiz da triagem passou a ser um **golden set rotulado à mão**.

- **Arquivo:** `apps/noyce/lib/eval/golden-triage.json` — ~21 editais reais **congelados** (campos copiados, independem do snapshot vivo) + `asOf` fixo (rótulos de prazo determinísticos) + `label` humano (vai/olha/pula) + `rationale` + `needsReview`.
- **Seed:** `scripts/build-golden-triage.mjs` (one-shot) propõe rótulos provisórios com `needsReview:true`. O **owner revisa**: corrige `label` e zera `needsReview`. Só itens com `needsReview:false` contam.
- **Rodar:** `node --env-file=.env.local --experimental-strip-types scripts/eval-gate.mjs --dim=triage --judge=golden` (default já é `--judge=golden`; `--judge=baseline` = modo regex legado/diagnóstico).
- **Critérios golden** (`GOLDEN_CRITERIA`): ≥15 rótulos confirmados · acurácia vs humano ≥85% · erros duros (LLM oposto ao humano) ≤1 · fallback ≤10%.

Enquanto o golden não for revisado, o gate **FAIL** honestamente em "rótulos confirmados disponíveis" — não há como certificar acurácia sem verdade humana.

## Calibração

Os limiares são `const` em `GATE_CRITERIA` (`lib/eval/gate-criteria.ts`) — ponto único de ajuste. Reapertar conforme acumular casos de fronteira (contratação integrada, manutenção predial, recall de "manutenção" fora do regex de obras). Quando trocar de modelo/provider, rode o gate ANTES de promover.
