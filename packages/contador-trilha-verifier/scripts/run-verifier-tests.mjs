import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { appendEventoForTest, gerarManifestoCloseout, verificarCadeia } = require("../dist/index.js");

const eventos = [];
appendEventoForTest(eventos, {
  escritorio_id: "11111111-1111-4111-8111-111111111111",
  hash_ver: 1,
  tipo_evento: "analise_executada",
  ator_tipo: "motor",
  ator_id: null,
  referente_tipo: "analise",
  referente_id: "22222222-2222-4222-8222-222222222222",
  nota_id: null,
  apontamento_id: "33333333-3333-4333-8333-333333333333",
  laudo_id: null,
  payload: {
    analise_execucao_id: "22222222-2222-4222-8222-222222222222",
    motor_versao_id: "44444444-4444-4444-8444-444444444444"
  },
  ocorrido_em: "2026-06-15T12:00:00.000Z"
});
appendEventoForTest(eventos, {
  escritorio_id: "11111111-1111-4111-8111-111111111111",
  hash_ver: 1,
  tipo_evento: "apontamento_aprovado",
  ator_tipo: "usuario",
  ator_id: "55555555-5555-4555-8555-555555555555",
  referente_tipo: "apontamento",
  referente_id: "33333333-3333-4333-8333-333333333333",
  nota_id: null,
  apontamento_id: "33333333-3333-4333-8333-333333333333",
  laudo_id: null,
  payload: {
    decisao_individualizada: true,
    motivo_codigo: "aprovado"
  },
  ocorrido_em: "2026-06-15T12:01:00.000Z"
});

const valid = verificarCadeia(eventos);
if (!valid.ok || valid.checked !== 2) {
  console.error("FAIL valid chain should pass");
  console.error(JSON.stringify(valid, null, 2));
  process.exit(1);
}
console.log("PASS valid chain");

const expectedHeadHash = "cd464ff18ae86a3b249d229e3993b7a259d3a4f8d17d30d0cebe4acb7830fbe0";
if (valid.headHash !== expectedHeadHash) {
  console.error(`FAIL golden head hash changed: expected ${expectedHeadHash}, got ${valid.headHash}`);
  process.exit(1);
}
console.log("PASS golden head hash");

const manifest = gerarManifestoCloseout(eventos, {
  closeout_id: "66666666-6666-4666-8666-666666666666",
  tipo: "diario",
  escritorio_id: "11111111-1111-4111-8111-111111111111",
  periodo_inicio: "2026-06-15T00:00:00.000Z",
  periodo_fim: "2026-06-16T00:00:00.000Z",
  executado_por: "55555555-5555-4555-8555-555555555555",
  executado_em: "2026-06-16T03:00:00.000Z",
  verifier_version: "contador-trilha-verifier@0.1.0",
  schema_version: "004_closeout_lote"
});

if (
  manifest.resultado !== "pass" ||
  manifest.evento_count !== 2 ||
  manifest.hash_ultimo !== expectedHeadHash ||
  manifest.time_stamp_provider !== "none" ||
  manifest.time_stamp_token_ref !== null
) {
  console.error("FAIL closeout manifest should summarize valid chain without timestamp promise");
  console.error(JSON.stringify(manifest, null, 2));
  process.exit(1);
}
console.log("PASS closeout manifest");

const expectedManifestHash = "e2a2aa866f6f15183629c1d46c47a22319234f87035108729364ecb44d6ce81d";
if (manifest.manifesto_hash !== expectedManifestHash) {
  console.error(`FAIL closeout manifest hash changed: expected ${expectedManifestHash}, got ${manifest.manifesto_hash}`);
  process.exit(1);
}
console.log("PASS closeout manifest hash");

const tampered = structuredClone(eventos);
tampered[1].payload.motivo_codigo = "alterado";
const tamperedResult = verificarCadeia(tampered);
if (tamperedResult.ok || !tamperedResult.failures.some((failure) => failure.code === "EVENT_HASH_MISMATCH")) {
  console.error("FAIL tampered chain should fail with EVENT_HASH_MISMATCH");
  console.error(JSON.stringify(tamperedResult, null, 2));
  process.exit(1);
}
console.log("PASS tamper detection");

const tamperedManifest = gerarManifestoCloseout(tampered, {
  closeout_id: "77777777-7777-4777-8777-777777777777",
  tipo: "diario",
  escritorio_id: "11111111-1111-4111-8111-111111111111",
  periodo_inicio: "2026-06-15T00:00:00.000Z",
  periodo_fim: "2026-06-16T00:00:00.000Z",
  executado_em: "2026-06-16T03:00:00.000Z",
  verifier_version: "contador-trilha-verifier@0.1.0",
  schema_version: "004_closeout_lote"
});

if (tamperedManifest.resultado !== "fail" || !tamperedManifest.failures.some((failure) => failure.code === "EVENT_HASH_MISMATCH")) {
  console.error("FAIL tampered closeout manifest should fail");
  console.error(JSON.stringify(tamperedManifest, null, 2));
  process.exit(1);
}
console.log("PASS tampered closeout manifest");

const unsupported = structuredClone(eventos);
unsupported[0].hash_ver = 99;
const unsupportedResult = verificarCadeia(unsupported);
if (unsupportedResult.ok || !unsupportedResult.failures.some((failure) => failure.code === "UNSUPPORTED_HASH_VER")) {
  console.error("FAIL unsupported hash_ver should fail");
  console.error(JSON.stringify(unsupportedResult, null, 2));
  process.exit(1);
}
console.log("PASS hash_ver guard");

const postgresFixture = JSON.parse(readFileSync("tests/postgres-chain.fixture.json", "utf8"));
const postgresFixtureResult = verificarCadeia(postgresFixture);
if (!postgresFixtureResult.ok || postgresFixtureResult.checked !== 2) {
  console.error("FAIL Postgres-generated hash-chain fixture should pass");
  console.error(JSON.stringify(postgresFixtureResult, null, 2));
  process.exit(1);
}
console.log("PASS Postgres-generated hash-chain fixture");

const postgresMicrosecondsFixture = JSON.parse(readFileSync("tests/postgres-chain-microseconds.fixture.json", "utf8"));
const postgresMicrosecondsFixtureResult = verificarCadeia(postgresMicrosecondsFixture);
if (!postgresMicrosecondsFixtureResult.ok || postgresMicrosecondsFixtureResult.checked !== 2) {
  console.error("FAIL Postgres-generated microsecond hash-chain fixture should pass");
  console.error(JSON.stringify(postgresMicrosecondsFixtureResult, null, 2));
  process.exit(1);
}
console.log("PASS Postgres-generated microsecond hash-chain fixture");

const closeoutCli = spawnSync(
  process.execPath,
  [
    "dist/closeout-cli.js",
    "--input",
    "tests/postgres-chain-with-ids.fixture.json",
    "--escritorio",
    "11111111-1111-4111-8111-111111111111",
    "--inicio",
    "2026-06-15T00:00:00Z",
    "--fim",
    "2026-06-16T00:00:00Z",
    "--tipo",
    "diario",
    "--format",
    "sql"
  ],
  { encoding: "utf8" }
);

if (
  closeoutCli.status !== 0 ||
  !closeoutCli.stdout.includes("core_api_v1.registrar_closeout") ||
  !closeoutCli.stdout.includes("$manifest$") ||
  !closeoutCli.stdout.includes("101,") ||
  !closeoutCli.stdout.includes("102,")
) {
  console.error("FAIL closeout CLI should render registrar_closeout SQL");
  console.error(closeoutCli.stdout);
  console.error(closeoutCli.stderr);
  process.exit(1);
}
console.log("PASS closeout CLI SQL output");

const closeoutCliMissingIds = spawnSync(
  process.execPath,
  [
    "dist/closeout-cli.js",
    "--input",
    "tests/postgres-chain.fixture.json",
    "--escritorio",
    "11111111-1111-4111-8111-111111111111",
    "--inicio",
    "2026-06-15T00:00:00Z",
    "--fim",
    "2026-06-16T00:00:00Z",
    "--tipo",
    "diario",
    "--format",
    "sql"
  ],
  { encoding: "utf8" }
);

if (closeoutCliMissingIds.status !== 2 || !closeoutCliMissingIds.stderr.includes("events export must include numeric id")) {
  console.error("FAIL closeout CLI SQL should reject exports without event ids");
  console.error(closeoutCliMissingIds.stdout);
  console.error(closeoutCliMissingIds.stderr);
  process.exit(1);
}
console.log("PASS closeout CLI SQL id guard");

console.log(`PASS head hash ${valid.headHash}`);
