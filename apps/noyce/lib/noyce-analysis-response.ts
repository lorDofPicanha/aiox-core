import {
  exportAnalysisRuns,
  validateAnalysisRunExport,
} from "@/lib/noyce-analysis-export";
import { opportunities } from "@/lib/noyce-data";

export function buildAnalysisRunsResponse() {
  const appAnalysisRuns = exportAnalysisRuns(opportunities);
  const validationErrors = validateAnalysisRunExport(appAnalysisRuns);

  return {
    generatedFrom: "apps/noyce fixture data",
    validation: {
      ok: validationErrors.length === 0,
      errors: validationErrors,
    },
    analysisRuns: appAnalysisRuns,
    sprint0AnalysisRuns: [],
    notes: ["Sprint 0 dry-run outputs permanecem no monorepo e não são incluídos no deploy privado."],
  };
}
