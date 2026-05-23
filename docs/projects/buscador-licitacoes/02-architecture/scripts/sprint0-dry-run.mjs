import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const architectureDir = path.resolve(dirname, "..");
const fixturesDir = path.join(architectureDir, "fixtures");
const outputDir = path.join(architectureDir, "outputs", "sprint0-dry-run");

const sourceRecords = readJson(path.join(fixturesDir, "source-records.v0.json"));
const candidates = readJson(path.join(fixturesDir, "canonical-candidates.v0.json"));

const criticalFields = [
  "object",
  "buyer_cnpj",
  "buyer_name",
  "city_ibge_code",
  "modality",
  "process_number",
  "estimated_value",
  "proposal_deadline",
  "dispute_date",
  "items",
  "technical_requirements",
  "winner_supplier",
  "final_value",
  "contract_reference",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toSnake(fieldName) {
  return fieldName.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function hasOpportunityValue(candidate, snakeField) {
  const camelField = snakeField.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  return candidate.opportunity?.[camelField] !== undefined && candidate.opportunity?.[camelField] !== null;
}

function hasIssue(candidate, fieldName) {
  const camelField = fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  return candidate.qualityIssues.some((issue) => issue.fieldName === fieldName || issue.fieldName === camelField);
}

function hasEvidence(candidate, fieldName) {
  const camelField = fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  return candidate.fieldEvidence.some((evidence) => evidence.fieldName === fieldName || evidence.fieldName === camelField);
}

function confidenceFor(candidate, fieldName) {
  if (hasIssue(candidate, fieldName)) {
    const issue = candidate.qualityIssues.find((item) => item.fieldName === fieldName || item.fieldName === fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()));
    if (issue?.code?.includes("CONFLICT")) return { level: "conflicting", score: 30, reason: issue.message };
    if (issue?.code?.includes("MISSING")) return { level: "missing", score: 0, reason: issue.message };
    return { level: "weak", score: 40, reason: issue?.message ?? "Quality issue present" };
  }
  if (hasEvidence(candidate, fieldName)) return { level: "strong", score: 80, reason: "Field has fixture evidence" };
  if (hasOpportunityValue(candidate, fieldName)) return { level: "inferred", score: 60, reason: "Field present in normalized candidate" };
  return { level: "missing", score: 0, reason: "No value, evidence or issue declared" };
}

function buildFieldConfidence(candidate) {
  return criticalFields.map((fieldName) => ({
    caseId: candidate.caseId,
    sourceCode: candidate.sourceCode,
    entityLocalKey: candidate.opportunity.canonicalKey,
    fieldName,
    ...confidenceFor(candidate, fieldName),
  }));
}

function dedupeScore(left, right) {
  if (left.opportunity.canonicalKey && left.opportunity.canonicalKey === right.opportunity.canonicalKey) {
    return 82;
  }

  let score = 0;
  if (left.buyer?.cnpj && left.buyer.cnpj === right.buyer?.cnpj) score += 30;
  if (left.opportunity.cityIbgeCode && left.opportunity.cityIbgeCode === right.opportunity.cityIbgeCode) score += 15;
  if (left.opportunity.modality && left.opportunity.modality === right.opportunity.modality) score += 15;
  if (left.opportunity.proposalDeadline && left.opportunity.proposalDeadline === right.opportunity.proposalDeadline) score += 15;

  const leftObject = left.opportunity.object.toLowerCase();
  const rightObject = right.opportunity.object.toLowerCase();
  for (const term of ["obra", "reforma", "manutencao", "unidade", "publica"]) {
    if (leftObject.includes(term) && rightObject.includes(term)) score += 5;
  }

  return Math.min(score, 100);
}

function dedupeDecision(score, hasConflict) {
  if (hasConflict && score >= 80) return "candidate_link";
  if (score >= 80) return "auto_merge";
  if (score >= 60) return "candidate_link";
  return "keep_separate";
}

function buildDedupeLinks() {
  const links = [];
  for (let i = 0; i < candidates.length; i += 1) {
    for (let j = i + 1; j < candidates.length; j += 1) {
      const left = candidates[i];
      const right = candidates[j];
      const score = dedupeScore(left, right);
      if (score < 40) continue;
      const hasConflict = [...left.qualityIssues, ...right.qualityIssues].some((issue) => issue.code.includes("CONFLICT"));
      links.push({
        leftCaseId: left.caseId,
        rightCaseId: right.caseId,
        leftCanonicalKey: left.opportunity.canonicalKey,
        rightCanonicalKey: right.opportunity.canonicalKey,
        score,
        decision: dedupeDecision(score, hasConflict),
        hasConflict,
      });
    }
  }
  return links;
}

function mean(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function scoreCandidate(candidate, fieldConfidence) {
  const confidenceValues = fieldConfidence
    .filter((item) => item.caseId === candidate.caseId)
    .map((item) => item.score);
  const confidenceTotal = Math.round(mean(confidenceValues));

  const fitCompany = candidate.opportunity.object.toLowerCase().match(/obra|engenharia|reforma|manutencao/) ? 80 : 45;
  const financialAttractiveness = candidate.opportunity.estimatedValue
    ? Math.min(100, Math.round(candidate.opportunity.estimatedValue / 15000))
    : 20;
  const expectedCompetition = candidate.sourceCode === "pncp" || candidate.sourceCode === "pcp" ? 60 : 50;
  const operationalRisk = candidate.qualityIssues.length > 0 ? 45 : 70;
  const urgency = candidate.opportunity.proposalDeadline ? 65 : 25;
  const evidenceQuality = confidenceTotal;
  const manualStrategy = candidate.sourceCode.startsWith("candidate:") ? 55 : 50;

  const opportunityScore = Math.round(
    fitCompany * 0.25 +
      financialAttractiveness * 0.2 +
      expectedCompetition * 0.15 +
      operationalRisk * 0.15 +
      urgency * 0.1 +
      evidenceQuality * 0.1 +
      manualStrategy * 0.05,
  );

  return {
    caseId: candidate.caseId,
    sourceCode: candidate.sourceCode,
    canonicalKey: candidate.opportunity.canonicalKey,
    opportunityScore,
    confidenceTotal,
    label: productLabel(opportunityScore, confidenceTotal, candidate),
    components: {
      fitCompany,
      financialAttractiveness,
      expectedCompetition,
      operationalRisk,
      urgency,
      evidenceQuality,
      manualStrategy,
    },
    missingData: fieldConfidence
      .filter((item) => item.caseId === candidate.caseId && item.level === "missing")
      .map((item) => item.fieldName),
    topReasons: topReasons(candidate),
  };
}

function productLabel(opportunityScore, confidenceTotal, candidate) {
  if (candidate.qualityIssues.some((issue) => issue.code.includes("CONFLICT"))) return "revisao obrigatoria";
  if (opportunityScore >= 70 && confidenceTotal >= 70) return "priorizar agora";
  if (opportunityScore >= 70 && confidenceTotal < 70) return "promissora, mas incompleta";
  if (opportunityScore >= 55 && candidate.opportunity.proposalDeadline) return "avaliar rapido";
  return "ignorar ou revisar manualmente";
}

function topReasons(candidate) {
  const reasons = [];
  if (candidate.opportunity.estimatedValue) reasons.push(`Valor estimado BRL ${candidate.opportunity.estimatedValue}`);
  if (candidate.opportunity.proposalDeadline) reasons.push(`Prazo de proposta ${candidate.opportunity.proposalDeadline}`);
  if (candidate.sourceCode.startsWith("candidate:")) reasons.push("Fonte candidata dentro do raio operacional");
  for (const issue of candidate.qualityIssues) reasons.push(issue.message);
  return reasons.slice(0, 4);
}

const fieldConfidence = candidates.flatMap(buildFieldConfidence);
const dedupeLinks = buildDedupeLinks();
const analysisRuns = candidates.map((candidate) => scoreCandidate(candidate, fieldConfidence));

const summary = {
  generatedAt: new Date().toISOString(),
  sourceRecords: sourceRecords.length,
  candidates: candidates.length,
  sources: [...new Set(sourceRecords.map((record) => record.sourceCode))],
  fieldConfidenceRows: fieldConfidence.length,
  dedupeLinks: dedupeLinks.length,
  analysisRuns: analysisRuns.length,
  gate: {
    fixturesValid: true,
    hasCandidateSource: sourceRecords.some((record) => record.sourceCode.startsWith("candidate:")),
    hasConflict: candidates.some((candidate) => candidate.qualityIssues.some((issue) => issue.code.includes("CONFLICT"))),
    hasMissingField: fieldConfidence.some((item) => item.level === "missing"),
    hasAuthenticatedAutomation: false,
  },
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "field-confidence.v0.json"), `${JSON.stringify(fieldConfidence, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "dedupe-links.v0.json"), `${JSON.stringify(dedupeLinks, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "analysis-runs.v0.json"), `${JSON.stringify(analysisRuns, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "summary.v0.json"), `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "README.md"), renderMarkdown(summary, analysisRuns, dedupeLinks));

console.log(`sprint0 dry-run ok: ${summary.candidates} candidates, ${summary.dedupeLinks} dedupe links, ${summary.analysisRuns} analysis runs`);

function renderMarkdown(runSummary, runs, links) {
  const lines = [
    "# Noyce Sprint 0 dry-run output",
    "",
    `Generated at: ${runSummary.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Source records: ${runSummary.sourceRecords}`,
    `- Candidates: ${runSummary.candidates}`,
    `- Sources: ${runSummary.sources.join(", ")}`,
    `- Field confidence rows: ${runSummary.fieldConfidenceRows}`,
    `- Dedupe links: ${runSummary.dedupeLinks}`,
    `- Analysis runs: ${runSummary.analysisRuns}`,
    "",
    "## Analysis",
    "",
    "| Case | Source | Opportunity | Confidence | Label |",
    "|---|---:|---:|---:|---|",
    ...runs.map((run) => `| ${run.caseId} | ${run.sourceCode} | ${run.opportunityScore} | ${run.confidenceTotal} | ${run.label} |`),
    "",
    "## Dedupe Links",
    "",
    "| Left | Right | Score | Decision | Conflict |",
    "|---|---|---:|---|---|",
    ...links.map((link) => `| ${link.leftCaseId} | ${link.rightCaseId} | ${link.score} | ${link.decision} | ${link.hasConflict} |`),
    "",
  ];
  return `${lines.join("\n")}\n`;
}
