// Gate de aceite do squad LLM (Noyce) — SINGLE SOURCE OF TRUTH dos critérios objetivos
// de PASS/FAIL. Função PURA (sem I/O, sem API) para ser testável na suíte e reusada pelo
// runner `scripts/eval-gate.mjs`. Os limiares vêm dos evals reais de 25/Jun (triagem 83%
// concordância / 0 fallback; análise 0 número inventado; workflow 4/4 no LLM) com folga.
//
// Filosofia: o gate NÃO mede "o LLM concorda 100% com o regex" — em vários casos o LLM
// ACERTOU e o baseline errou (ex.: calçado escolar triado como obra). Por isso a triagem
// tolera divergências SUAVES (vai↔olha, olha↔pula) e só penaliza divergências DURAS
// (vai↔pula, vereditos opostos) e erros de execução. Qualidade da análise é medida por
// guardrail + anti-alucinação (zero número fabricado sem dado de mercado), não por opinião.

export type TriageVerdict = "vai" | "olha" | "pula";

// Ordenação para medir "distância" entre vereditos: pula(0) < olha(1) < vai(2).
const VERDICT_RANK: Record<TriageVerdict, number> = { pula: 0, olha: 1, vai: 2 };

/** Divergência DURA = vereditos opostos (vai vs pula). Suave = adjacentes. */
export function isHardDivergence(a: TriageVerdict, b: TriageVerdict): boolean {
  return Math.abs(VERDICT_RANK[a] - VERDICT_RANK[b]) >= 2;
}

export const GATE_CRITERIA = {
  triage: {
    minAgreementPct: 80, // concordância de veredito LLM × baseline determinístico
    maxFallbackPct: 10, // % de itens que caíram em fallback (não vieram do LLM)
    maxErrors: 0, // chamadas que estouraram (verdict "ERRO")
    maxHardDivergences: 1, // vai↔pula não explicado; >1 exige revisão antes de confiar
  },
  analysis: {
    minGuardrailPassPct: 100, // Prisma + Forja devem passar TODOS os guardrails
    maxInventedNumbers: 0, // anti-alucinação: zero preço fabricado sem dado de mercado
    minLlmPct: 80, // maioria esmagadora deve vir do LLM, não de fallback
  },
  workflow: {
    requireAllStagesLlm: true, // Faro→Prisma→Forja→Escriba: 4/4 no LLM
    requirePackageComplete: true, // pacote = planilha + ≥1 declaração com fonte
  },
} as const;

export type Check = { name: string; pass: boolean; actual: string; limit: string };
export type DimensionResult = { dimension: string; pass: boolean; checks: Check[] };

const pct = (num: number, den: number) => (den === 0 ? 0 : (num / den) * 100);
const fmtPct = (n: number) => `${n.toFixed(0)}%`;

export type TriageMetrics = {
  total: number;
  agree: number;
  llmCount: number;
  errors: number;
  hardDivergences: number;
};

export function evaluateTriage(m: TriageMetrics): DimensionResult {
  const c = GATE_CRITERIA.triage;
  const agreementPct = pct(m.agree, m.total);
  const fallbackPct = pct(m.total - m.llmCount, m.total);
  const checks: Check[] = [
    {
      name: "concordância com baseline",
      pass: agreementPct >= c.minAgreementPct,
      actual: `${fmtPct(agreementPct)} (${m.agree}/${m.total})`,
      limit: `≥ ${c.minAgreementPct}%`,
    },
    {
      name: "taxa de fallback",
      pass: fallbackPct <= c.maxFallbackPct,
      actual: `${fmtPct(fallbackPct)} (${m.total - m.llmCount}/${m.total})`,
      limit: `≤ ${c.maxFallbackPct}%`,
    },
    {
      name: "erros de execução",
      pass: m.errors <= c.maxErrors,
      actual: String(m.errors),
      limit: `≤ ${c.maxErrors}`,
    },
    {
      name: "divergências duras (vai↔pula)",
      pass: m.hardDivergences <= c.maxHardDivergences,
      actual: String(m.hardDivergences),
      limit: `≤ ${c.maxHardDivergences}`,
    },
  ];
  return { dimension: "triagem (Faro)", pass: checks.every((x) => x.pass), checks };
}

// Juiz GOLDEN: compara o LLM contra rótulos HUMANOS (golden-triage.json), não contra o
// regex-baseline. É o juiz correto p/ acurácia de triagem — o baseline é cru, não é verdade.
export const GOLDEN_CRITERIA = {
  minReviewed: 15, // golden precisa de rótulos confirmados suficientes p/ certificar
  minAccuracyPct: 85, // LLM == rótulo humano
  maxHardWrong: 1, // LLM oposto ao humano (vai↔pula)
  maxFallbackPct: 10,
};

export type GoldenMetrics = {
  total: number; // itens golden revisados avaliados
  correct: number; // LLM == label humano
  hardWrong: number; // LLM oposto ao label (vai↔pula)
  fallback: number; // não veio do LLM
  reviewedAvailable: number; // quantos golden têm needsReview:false
};

export function evaluateTriageGolden(m: GoldenMetrics): DimensionResult {
  const c = GOLDEN_CRITERIA;
  const accuracyPct = pct(m.correct, m.total);
  const fallbackPct = pct(m.fallback, m.total);
  const checks: Check[] = [
    {
      name: "rótulos humanos confirmados disponíveis",
      pass: m.reviewedAvailable >= c.minReviewed,
      actual: String(m.reviewedAvailable),
      limit: `≥ ${c.minReviewed}`,
    },
    {
      name: "acurácia vs rótulo humano",
      pass: accuracyPct >= c.minAccuracyPct,
      actual: `${fmtPct(accuracyPct)} (${m.correct}/${m.total})`,
      limit: `≥ ${c.minAccuracyPct}%`,
    },
    {
      name: "erros duros (LLM oposto ao humano: vai↔pula)",
      pass: m.hardWrong <= c.maxHardWrong,
      actual: String(m.hardWrong),
      limit: `≤ ${c.maxHardWrong}`,
    },
    {
      name: "taxa de fallback",
      pass: fallbackPct <= c.maxFallbackPct,
      actual: `${fmtPct(fallbackPct)} (${m.fallback}/${m.total})`,
      limit: `≤ ${c.maxFallbackPct}%`,
    },
  ];
  return { dimension: "triagem vs golden (juiz humano)", pass: checks.every((x) => x.pass), checks };
}

export type AnalysisMetrics = {
  n: number;
  prismaPass: number;
  forjaPass: number;
  prismaLlm: number;
  forjaLlm: number;
  inventedNumbers: number;
};

export function evaluateAnalysis(m: AnalysisMetrics): DimensionResult {
  const c = GATE_CRITERIA.analysis;
  const guardrailPassPct = pct(m.prismaPass + m.forjaPass, m.n * 2);
  const llmPct = pct(m.prismaLlm + m.forjaLlm, m.n * 2);
  const checks: Check[] = [
    {
      name: "guardrail PASS (Prisma+Forja)",
      pass: guardrailPassPct >= c.minGuardrailPassPct,
      actual: `${fmtPct(guardrailPassPct)} (${m.prismaPass + m.forjaPass}/${m.n * 2})`,
      limit: `≥ ${c.minGuardrailPassPct}%`,
    },
    {
      name: "números inventados (anti-alucinação)",
      pass: m.inventedNumbers <= c.maxInventedNumbers,
      actual: String(m.inventedNumbers),
      limit: `≤ ${c.maxInventedNumbers}`,
    },
    {
      name: "veio do LLM (não fallback)",
      pass: llmPct >= c.minLlmPct,
      actual: `${fmtPct(llmPct)} (${m.prismaLlm + m.forjaLlm}/${m.n * 2})`,
      limit: `≥ ${c.minLlmPct}%`,
    },
  ];
  return { dimension: "análise (Prisma/Forja)", pass: checks.every((x) => x.pass), checks };
}

export type WorkflowMetrics = {
  stagesLlm: { faro: boolean; prisma: boolean; forja: boolean; escriba: boolean };
  packageComplete: boolean;
};

export function evaluateWorkflow(m: WorkflowMetrics): DimensionResult {
  const c = GATE_CRITERIA.workflow;
  const stages = Object.entries(m.stagesLlm);
  const stagesOk = stages.filter(([, v]) => v).length;
  const checks: Check[] = [
    {
      name: "4 etapas no LLM (Faro→Prisma→Forja→Escriba)",
      pass: !c.requireAllStagesLlm || stagesOk === stages.length,
      actual: `${stagesOk}/${stages.length}`,
      limit: `${stages.length}/${stages.length}`,
    },
    {
      name: "pacote completo (planilha + declarações c/ fonte)",
      pass: !c.requirePackageComplete || m.packageComplete,
      actual: m.packageComplete ? "sim" : "não",
      limit: "sim",
    },
  ];
  return { dimension: "workflow E2E", pass: checks.every((x) => x.pass), checks };
}

export type GateInput = {
  triage?: TriageMetrics; // juiz = baseline regex (cru)
  goldenTriage?: GoldenMetrics; // juiz = rótulo humano (preferido); substitui `triage`
  analysis?: AnalysisMetrics;
  workflow?: WorkflowMetrics;
};

export type GateResult = {
  pass: boolean;
  partial: boolean; // true se alguma dimensão foi pulada (não rodada)
  dimensions: DimensionResult[];
  skipped: string[];
};

/**
 * Veredito consolidado. Só dimensões PRESENTES contam; as ausentes ficam em `skipped` e
 * marcam o resultado como `partial` (não dá para certificar o gate inteiro com dimensão
 * faltando). PASS = todas as dimensões presentes passaram E nenhuma foi pulada.
 */
export function evaluateGate(input: GateInput): GateResult {
  const dimensions: DimensionResult[] = [];
  const skipped: string[] = [];

  // Golden (juiz humano) tem prioridade sobre o baseline regex p/ a triagem.
  if (input.goldenTriage) dimensions.push(evaluateTriageGolden(input.goldenTriage));
  else if (input.triage) dimensions.push(evaluateTriage(input.triage));
  else skipped.push("triagem (Faro)");

  if (input.analysis) dimensions.push(evaluateAnalysis(input.analysis));
  else skipped.push("análise (Prisma/Forja)");

  if (input.workflow) dimensions.push(evaluateWorkflow(input.workflow));
  else skipped.push("workflow E2E");

  const allDimsPass = dimensions.length > 0 && dimensions.every((d) => d.pass);
  const partial = skipped.length > 0;
  return { pass: allDimsPass && !partial, partial, dimensions, skipped };
}
