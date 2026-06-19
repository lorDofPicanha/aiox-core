import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const databaseUrl = process.env.DATABASE_URL;
const psql = process.env.PSQL_PATH || "psql";

const files = [
  "migrations/001_foundation.sql",
  "migrations/002_decision_evidence.sql",
  "migrations/003_secure_decision_rpc.sql",
  "migrations/004_closeout_lote.sql",
  "tests/sql/001_foundation_contract.sql",
  "tests/sql/002_decision_evidence_contract.sql",
  "tests/sql/003_secure_decision_rpc_contract.sql",
  "tests/sql/004_closeout_lote_contract.sql",
  "tests/sql/005_rls_export_runtime_contract.sql"
];

let failed = false;

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

if (!databaseUrl) {
  fail("DATABASE_URL is not set");
} else {
  pass("DATABASE_URL is set");
}

const psqlProbe = spawnSync(psql, ["--version"], { encoding: "utf8" });
if (psqlProbe.status !== 0) {
  fail(`psql is not executable (${psql}). Set PSQL_PATH if psql is installed outside PATH.`);
} else {
  pass(`psql is executable: ${psqlProbe.stdout.trim()}`);
}

for (const file of files) {
  if (!existsSync(file)) {
    fail(`missing smoke file: ${file}`);
  }
}

if (!failed) {
  pass("all smoke files exist");
}

if (databaseUrl && psqlProbe.status === 0) {
  const connectionProbe = spawnSync(psql, ["-w", "-v", "ON_ERROR_STOP=1", "-c", "select 1", databaseUrl], {
    encoding: "utf8"
  });
  if (connectionProbe.status !== 0) {
    fail(`database connection failed without interactive password: ${connectionProbe.stderr.trim()}`);
  } else {
    pass("database connection works without interactive password");
  }
}

if (failed) {
  process.exit(1);
}
