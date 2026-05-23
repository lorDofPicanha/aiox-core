import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRecordsPath = path.join(dirname, "source-records.v0.json");
const candidatesPath = path.join(dirname, "canonical-candidates.v0.json");

const sourceRecords = JSON.parse(fs.readFileSync(sourceRecordsPath, "utf8"));
const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));

const requiredSources = ["pncp", "pcp", "bll", "bnc", "comprasgov", "sislog"];
const bannedSecrets = ["password", "senha", "token", "cookie", "secret", "cert", "private_key"];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function jsonIncludesBannedSecret(value) {
  const serialized = JSON.stringify(value).toLowerCase();
  return bannedSecrets.find((term) => serialized.includes(term));
}

const sourceCodes = new Set(sourceRecords.map((record) => record.sourceCode));
for (const source of requiredSources) {
  assert(sourceCodes.has(source), `Missing required source fixture: ${source}`);
}
assert([...sourceCodes].some((source) => source.startsWith("candidate:")), "Missing candidate source fixture");

const rawHashes = new Set();
for (const record of sourceRecords) {
  assert(record.orgId, `SourceRecord ${record.caseId} missing orgId`);
  assert(record.sourceCode, `SourceRecord ${record.caseId} missing sourceCode`);
  assert(record.rawPayload && typeof record.rawPayload === "object", `SourceRecord ${record.caseId} missing object rawPayload`);
  assert(record.rawHash, `SourceRecord ${record.caseId} missing rawHash`);
  assert(record.fetchedAt, `SourceRecord ${record.caseId} missing fetchedAt`);
  assert(record.adapterVersion, `SourceRecord ${record.caseId} missing adapterVersion`);
  assert(Array.isArray(record.normalizationWarnings), `SourceRecord ${record.caseId} missing normalizationWarnings array`);
  assert(!jsonIncludesBannedSecret(record), `SourceRecord ${record.caseId} contains banned secret-like term`);
  rawHashes.add(record.rawHash);
}

for (const candidate of candidates) {
  assert(candidate.orgId, `CanonicalCandidate ${candidate.caseId} missing orgId`);
  assert(candidate.sourceCode, `CanonicalCandidate ${candidate.caseId} missing sourceCode`);
  assert(rawHashes.has(candidate.sourceRecordHash), `CanonicalCandidate ${candidate.caseId} has unknown sourceRecordHash`);
  assert(candidate.opportunity?.object, `CanonicalCandidate ${candidate.caseId} missing opportunity.object`);
  assert(Array.isArray(candidate.fieldEvidence), `CanonicalCandidate ${candidate.caseId} missing fieldEvidence array`);
  assert(Array.isArray(candidate.qualityIssues), `CanonicalCandidate ${candidate.caseId} missing qualityIssues array`);
  assert(Array.isArray(candidate.sourceLinks), `CanonicalCandidate ${candidate.caseId} missing sourceLinks array`);
  assert(candidate.adapterMeta?.rawHash === candidate.sourceRecordHash, `CanonicalCandidate ${candidate.caseId} adapterMeta.rawHash mismatch`);
  assert(candidate.adapterMeta?.authContext !== "user_credential", `CanonicalCandidate ${candidate.caseId} uses user credential`);
  assert(!jsonIncludesBannedSecret(candidate), `CanonicalCandidate ${candidate.caseId} contains banned secret-like term`);
}

const missingValue = candidates.find((candidate) => candidate.caseId === "missing-estimated-value");
assert(missingValue, "Missing missing-estimated-value case");
assert(missingValue.qualityIssues.some((issue) => issue.fieldName === "estimatedValue"), "missing-estimated-value must declare estimatedValue issue");

const conflict = candidates.find((candidate) => candidate.caseId === "same-opportunity-private-conflict");
assert(conflict, "Missing same-opportunity-private-conflict case");
assert(conflict.qualityIssues.some((issue) => issue.code.includes("CONFLICT")), "conflict case must declare conflict quality issue");

const sourceCandidate = candidates.find((candidate) => candidate.caseId === "new-source-candidate");
assert(sourceCandidate, "Missing new-source-candidate case");
assert(sourceCandidate.sourceCode.startsWith("candidate:"), "new-source-candidate must use candidate:* sourceCode");
assert(sourceCandidate.adapterMeta.authContext === "fixture", "new-source-candidate must remain fixture-only");

console.log(`fixture validation ok: ${sourceRecords.length} source records, ${candidates.length} candidates`);
