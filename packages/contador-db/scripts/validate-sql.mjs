import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const migrationPath = resolve(root, "migrations/001_foundation.sql");
const migration002Path = resolve(root, "migrations/002_decision_evidence.sql");
const migration003Path = resolve(root, "migrations/003_secure_decision_rpc.sql");
const migration004Path = resolve(root, "migrations/004_closeout_lote.sql");
const rollbackPath = resolve(root, "rollbacks/001_foundation.rollback.sql");
const rollback003Path = resolve(root, "rollbacks/003_secure_decision_rpc.rollback.sql");
const rollback004Path = resolve(root, "rollbacks/004_closeout_lote.rollback.sql");
const contractPath = resolve(root, "tests/sql/001_foundation_contract.sql");
const contract002Path = resolve(root, "tests/sql/002_decision_evidence_contract.sql");
const contract003Path = resolve(root, "tests/sql/003_secure_decision_rpc_contract.sql");
const contract004Path = resolve(root, "tests/sql/004_closeout_lote_contract.sql");
const contract005Path = resolve(root, "tests/sql/005_rls_export_runtime_contract.sql");
const closeoutExportQueryPath = resolve(root, "queries/export-closeout-events.sql");

const migration = readFileSync(migrationPath, "utf8");
const migration002 = readFileSync(migration002Path, "utf8");
const migration003 = readFileSync(migration003Path, "utf8");
const migration004 = readFileSync(migration004Path, "utf8");
const rollback = readFileSync(rollbackPath, "utf8");
const rollback003 = readFileSync(rollback003Path, "utf8");
const rollback004 = readFileSync(rollback004Path, "utf8");
const contract = readFileSync(contractPath, "utf8");
const contract002 = readFileSync(contract002Path, "utf8");
const contract003 = readFileSync(contract003Path, "utf8");
const contract004 = readFileSync(contract004Path, "utf8");
const contract005 = readFileSync(contract005Path, "utf8");
const closeoutExportQuery = readFileSync(closeoutExportQueryPath, "utf8");

const checks = [
  ["migration uses 001 foundation", /Migration:\s*001_foundation\.sql/i.test(migration)],
  ["core_api_v1 schema exists", /create schema if not exists core_api_v1/i.test(migration)],
  ["registrar_analise RPC exists", /function core_api_v1\.registrar_analise/i.test(migration)],
  ["aprovar_apontamento RPC exists", /function core_api_v1\.aprovar_apontamento/i.test(migration)],
  ["nota is partitioned", /create table if not exists core\.nota[\s\S]*partition by range \(competencia\)/i.test(migration)],
  ["nota_item is not partitioned", !/create table if not exists core\.nota_item[\s\S]{0,1200}partition by/i.test(migration)],
  ["nota_item carries competencia", /create table if not exists core\.nota_item[\s\S]*competencia date not null/i.test(migration)],
  ["motor role direct writes revoked", /revoke insert, update, delete on all tables in schema core from motor/i.test(migration)],
  ["public execute revoked", /revoke all on all functions in schema core_api_v1 from public/i.test(migration)],
  ["motor only gets registrar_analise", /grant execute on function core_api_v1\.registrar_analise/i.test(migration) && !/grant execute on all functions in schema core_api_v1 to motor/i.test(migration)],
  ["decision RPC validates contador CRC", /crc_situacao = 'ativo'/i.test(migration) && /papel = 'contador'/i.test(migration)],
  ["P20 constraint trigger exists", /create constraint trigger tg_apont_exige_evento/i.test(migration)],
  ["base_versao_id is required", /base_versao_id uuid not null references ref\.base_versao/i.test(migration)],
  ["ledger has hash_ver", /create table if not exists core\.evento_boa_fe[\s\S]*hash_ver smallint not null default 1/i.test(migration)],
  ["trilha_cabeca exists", /create table if not exists core\.trilha_cabeca/i.test(migration)],
  ["superado bitemporal check exists", /ck_superado_bitemporal/i.test(migration)],
  ["golden set version exists", /create table if not exists ref\.golden_set_versao/i.test(migration)],
  ["billing view excludes superado", /where a\.status in \('aprovado', 'rejeitado', 'regularizado'\)/i.test(migration)],
  ["rollback drops core_api_v1", /drop schema if exists core_api_v1 cascade/i.test(rollback)],
  ["contract checks forbidden FK", /forbidden FK from core to outer schema/i.test(contract)],
  ["contract checks nota_item partition", /nota_item must not be physically partitioned in D0/i.test(contract)],
  ["contract checks motor RPC boundary", /motor role must not execute human decision RPCs/i.test(contract)],
  ["contract checks public RPC boundary", /core_api_v1 functions must not be executable by PUBLIC/i.test(contract)],
  ["002 decision evidence migration exists", /Migration:\s*002_decision_evidence\.sql/i.test(migration002)],
  ["002 snapshots reviewer CRC", /revisor_snapshot/i.test(migration002) && /'crc',\s*v_revisor\.crc/i.test(migration002) && /'crc_situacao',\s*v_revisor\.crc_situacao/i.test(migration002)],
  ["002 references fiscal evidence", /evidencia_ref/i.test(migration002) && /'base_versao_id',\s*v_apont\.base_versao_id/i.test(migration002) && /'motor_versao_id',\s*v_apont\.motor_versao_id/i.test(migration002)],
  ["002 contract checks decision evidence", /decision event must persist reviewer CRC snapshot/i.test(contract002) && /decision event must persist base version evidence reference/i.test(contract002)],
  ["003 secure decision RPC migration exists", /Migration:\s*003_secure_decision_rpc\.sql/i.test(migration003)],
  ["003 requires caller reviewer binding", /caller must be the reviewer/i.test(migration003) && /app\.current_user_id\(\) <> p_revisor_id/i.test(migration003)],
  ["003 requires tenant claim", /tenant claim required/i.test(migration003) && /app\.current_escritorio_id\(\) is null/i.test(migration003)],
  ["003 adds fiscal evidence hash", /fiscal_snapshot/i.test(migration003) && /evidencia_hash/i.test(migration003) && /public\.digest\(v_fiscal_snapshot::text/i.test(migration003)],
  ["003 revokes helper function execute", /revoke all on function core_api_v1\.assert_human_decision_context/i.test(migration003) && /revoke all on function core_api_v1\.decision_evidence_payload/i.test(migration003)],
  ["003 revokes public decision RPC execute", /revoke all on function core_api_v1\.aprovar_apontamento\(uuid, uuid, text, text\) from public, anon, motor/i.test(migration003) && /revoke all on function core_api_v1\.rejeitar_apontamento\(uuid, uuid, text, text\) from public, anon, motor/i.test(migration003) && /revoke all on function core_api_v1\.superar_apontamento\(uuid, uuid, timestamptz, daterange\) from public, anon, motor/i.test(migration003)],
  ["003 contract checks authorization and evidence hash", /approval without tenant\/user claims must fail/i.test(contract003) && /caller must not approve as another contador/i.test(contract003) && /must persist evidence hash/i.test(contract003)],
  ["003 rollback exists", /Rollback for 003_secure_decision_rpc\.sql/i.test(rollback003)],
  ["003 rollback restores F1.1 decision comments", /\[P17\]\[F1\.1\]/i.test(rollback003) && /\[P22\]\[F1\.1\]/i.test(rollback003)],
  ["003 rollback removes F1.2 helper functions", /drop function if exists core_api_v1\.assert_human_decision_context/i.test(rollback003) && /drop function if exists core_api_v1\.decision_evidence_payload/i.test(rollback003) && /drop function if exists app\.current_user_id/i.test(rollback003)],
  ["004 closeout migration exists", /Migration:\s*004_closeout_lote\.sql/i.test(migration004)],
  ["004 closeout_lote table exists", /create table if not exists core\.closeout_lote/i.test(migration004)],
  ["004 stores manifesto hash", /manifesto_hash bytea not null/i.test(migration004)],
  ["004 keeps timestamp provider none honest", /time_stamp_provider text not null default 'none'/i.test(migration004) && /ck_closeout_timestamp_none/i.test(migration004)],
  ["004 closeout immutable trigger exists", /create trigger tg_closeout_lote_immutable/i.test(migration004)],
  ["004 closeout RLS exists", /alter table core\.closeout_lote enable row level security/i.test(migration004) && /p_core_closeout_select/i.test(migration004)],
  ["004 closeout RPC exists", /function core_api_v1\.registrar_closeout/i.test(migration004) && /tenant claim required/i.test(migration004)],
  ["004 closeout direct writes revoked", /revoke insert, update, delete on core\.closeout_lote from authenticated, anon, service_role/i.test(migration004)],
  ["004 closeout select granted for RLS", /grant select on core\.closeout_lote to authenticated/i.test(migration004)],
  ["004 closeout RPC public execute revoked", /revoke all on function core_api_v1\.registrar_closeout\(/i.test(migration004) && /from public, anon, motor/i.test(migration004)],
  ["004 rollback exists", /Rollback for 004_closeout_lote\.sql/i.test(rollback004) && /drop table if exists core\.closeout_lote cascade/i.test(rollback004)],
  ["004 contract checks closeout table", /core\.closeout_lote must exist/i.test(contract004) && /closeout_lote must persist manifesto_hash/i.test(contract004)],
  ["004 contract checks RPC boundary", /authenticated must not insert closeout_lote directly/i.test(contract004) && /authenticated must execute registrar_closeout RPC/i.test(contract004)],
  ["004 contract exercises registrar_closeout", /registrar_closeout must persist technical closeout without timestamp promise/i.test(contract004) && /must reject timestamp token when provider is none/i.test(contract004)],
  ["004 closeout export includes event ids and hex hashes", /'id', e\.id/i.test(closeoutExportQuery) && /encode\(e\.hash_evento, 'hex'\)/i.test(closeoutExportQuery) && /to_char\(e\.ocorrido_em at time zone 'UTC'/i.test(closeoutExportQuery)],
  ["005 RLS export runtime contract exists", /runtime RLS and export boundaries/i.test(contract005)],
  ["005 checks authenticated tenant event isolation", /must not see tenant B events/i.test(contract005) && /set local role authenticated/i.test(contract005)],
  ["005 checks authenticated closeout isolation", /must not see tenant B closeouts/i.test(contract005)],
  ["005 checks missing tenant claim closed", /without tenant claim must not see events/i.test(contract005) && /without tenant claim must not see closeouts/i.test(contract005)]
];

const failures = checks.filter(([, pass]) => !pass);

for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} static SQL validation check(s) failed.`);
  process.exit(1);
}
