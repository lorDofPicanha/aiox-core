import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const contractPath = resolve(repoRoot, "packages/contador-db/tests/sql/001_foundation_contract.sql");
const contract = readFileSync(contractPath, "utf8");

const checks = [
  ["FF-2 schema boundary", /forbidden FK from core to outer schema/i.test(contract)],
  ["FF-3 RLS coverage seed", /core\.trilha_cabeca must have RLS enabled/i.test(contract)],
  ["FF-6 ledger immutability", /ledger immutability trigger missing/i.test(contract)]
];

const failures = checks.filter(([, pass]) => !pass);
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}

if (failures.length > 0) {
  process.exit(1);
}
