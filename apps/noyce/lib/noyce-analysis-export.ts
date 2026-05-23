import type { Opportunity, ScoreComponent, SourceCode } from "@/lib/noyce-model";

export interface AnalysisRunExport {
  schemaVersion: "noyce.analysis_run.v0";
  runId: string;
  opportunityId: string;
  sourceCode: SourceCode;
  model: "deterministic-v0";
  opportunityScore: number;
  confidenceScore: number;
  action: Opportunity["action"];
  blockers: string[];
  components: {
    opportunity: ScoreComponent[];
    confidence: ScoreComponent[];
  };
  inputs: {
    city: string;
    uf: string;
    distanceKm: number;
    estimatedValue: number | null;
    proposalDeadline: string | null;
    missingData: string[];
  };
}

export function exportAnalysisRuns(opportunities: readonly Opportunity[]): AnalysisRunExport[] {
  return opportunities.map((opportunity) => ({
    schemaVersion: "noyce.analysis_run.v0",
    runId: `analysis:${opportunity.id}:${opportunity.analysisRun.model}`,
    opportunityId: opportunity.id,
    sourceCode: opportunity.source,
    model: opportunity.analysisRun.model,
    opportunityScore: opportunity.opportunityScore,
    confidenceScore: opportunity.confidenceScore,
    action: opportunity.action,
    blockers: opportunity.analysisRun.blockers,
    components: {
      opportunity: opportunity.analysisRun.opportunity.components,
      confidence: opportunity.analysisRun.confidence.components,
    },
    inputs: {
      city: opportunity.city,
      uf: opportunity.uf,
      distanceKm: opportunity.distanceKm,
      estimatedValue: opportunity.estimatedValue,
      proposalDeadline: opportunity.proposalDeadline,
      missingData: opportunity.missingData,
    },
  }));
}

export interface Sprint0AnalysisRun {
  caseId: string;
  sourceCode: SourceCode;
  canonicalKey: string;
  opportunityScore: number;
  confidenceTotal: number;
  label: Opportunity["action"];
  components: Record<string, number>;
  missingData: string[];
  topReasons: string[];
}

export interface Sprint0Candidate {
  caseId: string;
  sourceCode: SourceCode;
  opportunity: {
    canonicalKey?: string;
    cityName?: string;
    uf?: string;
    estimatedValue?: number;
    proposalDeadline?: string;
  };
}

export function exportSprint0AnalysisRuns(
  dryRunRuns: readonly Sprint0AnalysisRun[],
  candidates: readonly Sprint0Candidate[],
): AnalysisRunExport[] {
  const candidatesByCaseId = new Map(candidates.map((candidate) => [candidate.caseId, candidate]));

  return dryRunRuns.map((run) => {
    const candidate = candidatesByCaseId.get(run.caseId);

    return {
      schemaVersion: "noyce.analysis_run.v0",
      runId: `analysis:${run.caseId}:sprint0-dry-run-v0`,
      opportunityId: run.canonicalKey || run.caseId,
      sourceCode: run.sourceCode,
      model: "deterministic-v0",
      opportunityScore: run.opportunityScore,
      confidenceScore: run.confidenceTotal,
      action: run.label,
      blockers: [...run.missingData.map((item) => `lacuna: ${item}`), ...run.topReasons.filter(isRiskReason)],
      components: {
        opportunity: Object.entries(run.components).map(([label, value]) => ({
          label,
          value,
          max: 100,
          reason: `Sprint 0 dry-run component ${label}.`,
        })),
        confidence: [
          {
            label: "confidenceTotal",
            value: run.confidenceTotal,
            max: 100,
            reason: "Mean field confidence from Sprint 0 dry-run.",
          },
          {
            label: "missingData",
            value: Math.max(0, 100 - run.missingData.length * 10),
            max: 100,
            reason: `${run.missingData.length} missing field(s) in Sprint 0 dry-run.`,
          },
        ],
      },
      inputs: {
        city: candidate?.opportunity.cityName ?? "cidade ausente",
        uf: candidate?.opportunity.uf ?? "UF",
        distanceKm: 0,
        estimatedValue: candidate?.opportunity.estimatedValue ?? null,
        proposalDeadline: candidate?.opportunity.proposalDeadline ?? null,
        missingData: run.missingData,
      },
    };
  });
}

export function validateAnalysisRunExport(runs: readonly AnalysisRunExport[], expectedCount?: number): string[] {
  const errors: string[] = [];

  if (expectedCount !== undefined && runs.length !== expectedCount) {
    errors.push(`expected ${expectedCount} analysis runs, found ${runs.length}`);
  }

  for (const run of runs) {
    if (run.schemaVersion !== "noyce.analysis_run.v0") errors.push(`${run.runId}: invalid schemaVersion`);
    if (!run.runId.startsWith("analysis:")) errors.push(`${run.runId}: invalid runId`);
    if (run.model !== "deterministic-v0") errors.push(`${run.runId}: invalid model`);
    if (!isScore(run.opportunityScore)) errors.push(`${run.runId}: invalid opportunityScore`);
    if (!isScore(run.confidenceScore)) errors.push(`${run.runId}: invalid confidenceScore`);
    if (run.components.opportunity.length === 0) errors.push(`${run.runId}: missing opportunity components`);
    if (run.components.confidence.length === 0) errors.push(`${run.runId}: missing confidence components`);
    if (!run.inputs.city || !run.inputs.uf) errors.push(`${run.runId}: missing location input`);
    if (!Array.isArray(run.inputs.missingData)) errors.push(`${run.runId}: missing missingData input`);
  }

  return errors;
}

function isRiskReason(reason: string): boolean {
  return /conflito|diverge|missing|ausente|nao|não|risco|ToS/i.test(reason);
}

function isScore(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}
