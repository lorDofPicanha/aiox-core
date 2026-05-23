import fs from "node:fs";
import path from "node:path";

import {
  exportAnalysisRuns,
  exportSprint0AnalysisRuns,
  type Sprint0AnalysisRun,
  type Sprint0Candidate,
  validateAnalysisRunExport,
} from "@/lib/noyce-analysis-export";
import { opportunities } from "@/lib/noyce-data";

export function buildAnalysisRunsResponse(projectRoot: string) {
  const appAnalysisRuns = exportAnalysisRuns(opportunities);
  const sprint0AnalysisRuns = exportSprint0AnalysisRuns(
    readJson<Sprint0AnalysisRun[]>(projectRoot, "outputs/sprint0-dry-run/analysis-runs.v0.json"),
    readJson<Sprint0Candidate[]>(projectRoot, "fixtures/canonical-candidates.v0.json"),
  );
  const validationErrors = [
    ...validateAnalysisRunExport(appAnalysisRuns),
    ...validateAnalysisRunExport(sprint0AnalysisRuns, 7).map((error) => `sprint0: ${error}`),
  ];

  return {
    generatedFrom: "apps/noyce fixture data + Sprint 0 dry-run outputs",
    validation: {
      ok: validationErrors.length === 0,
      errors: validationErrors,
    },
    analysisRuns: appAnalysisRuns,
    sprint0AnalysisRuns,
  };
}

function readJson<T>(projectRoot: string, relativePath: string): T {
  const filePath = path.join(
    projectRoot,
    "..",
    "..",
    "docs",
    "projects",
    "buscador-licitacoes",
    "02-architecture",
    relativePath,
  );

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}
