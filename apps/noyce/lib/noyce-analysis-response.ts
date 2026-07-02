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
  // Sprint 0 dry-run fixtures live in the monorepo docs tree (../../docs/...). If the app is
  // deployed/relocated without them, degrade honestly instead of 500ing the whole route.
  const sprint0Runs = readJson<Sprint0AnalysisRun[]>(projectRoot, "outputs/sprint0-dry-run/analysis-runs.v0.json");
  const sprint0Candidates = readJson<Sprint0Candidate[]>(projectRoot, "fixtures/canonical-candidates.v0.json");
  const sprint0Available = sprint0Runs !== null && sprint0Candidates !== null;
  const sprint0AnalysisRuns = sprint0Available
    ? exportSprint0AnalysisRuns(sprint0Runs, sprint0Candidates)
    : [];
  const validationErrors = [
    ...validateAnalysisRunExport(appAnalysisRuns),
    ...(sprint0Available
      ? validateAnalysisRunExport(sprint0AnalysisRuns, 7).map((error) => `sprint0: ${error}`)
      : ["sprint0: fixtures indisponíveis (docs/projects/buscador-licitacoes fora do deploy) — export omitido"]),
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

function readJson<T>(projectRoot: string, relativePath: string): T | null {
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

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}
