import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const databaseUrl = process.env.DATABASE_URL;
const psql = process.env.PSQL_PATH || "psql";

if (!databaseUrl) {
  console.error("DATABASE_URL is required for smoke:psql. Run npm run smoke:preflight --workspace @synkra/contador-db for diagnostics.");
  process.exit(2);
}

const files = [
  "migrations/001_foundation.sql",
  "migrations/002_decision_evidence.sql",
  "migrations/003_secure_decision_rpc.sql",
  "migrations/004_closeout_lote.sql",
  "tests/sql/001_foundation_contract.sql",
  "tests/sql/002_decision_evidence_contract.sql",
  "tests/sql/003_secure_decision_rpc_contract.sql",
  "tests/sql/004_closeout_lote_contract.sql",
  "tests/sql/005_rls_export_runtime_contract.sql",
  "tests/sql/006_incident_expurgo_runtime_contract.sql"
];

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`Missing smoke file: ${file}`);
    process.exit(2);
  }

  const result = spawnSync(psql, ["-v", "ON_ERROR_STOP=1", "-f", file, databaseUrl], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    console.error(`smoke:psql failed while running ${file}`);
    process.exit(result.status ?? 1);
  }
}
