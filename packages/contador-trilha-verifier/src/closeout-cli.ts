#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { gerarManifestoCloseout, type EventoBoaFeDump } from "./index";

interface CliOptions {
  input?: string;
  tipo: "diario" | "mensal" | "corretivo";
  format: "json" | "sql";
  escritorio?: string;
  inicio?: string;
  fim?: string;
  executadoPor?: string;
  schemaVersion: string;
  verifierVersion: string;
}

const options = parseArgs(process.argv.slice(2));

if (!options.input || !options.escritorio || !options.inicio || !options.fim) {
  console.error(
    "Usage: contador-closeout-manifest --input events.json --escritorio <uuid> --inicio <iso> --fim <iso> [--tipo diario|mensal|corretivo]"
  );
  process.exit(2);
}

const eventos = JSON.parse(readFileSync(options.input, "utf8")) as EventoBoaFeDump[];
const manifest = gerarManifestoCloseout(eventos, {
  closeout_id: randomUUID(),
  tipo: options.tipo,
  escritorio_id: options.escritorio,
  periodo_inicio: options.inicio,
  periodo_fim: options.fim,
  executado_por: options.executadoPor,
  executado_em: new Date().toISOString(),
  verifier_version: options.verifierVersion,
  schema_version: options.schemaVersion
});

if (
  options.format === "sql" &&
  manifest.evento_count > 0 &&
  (manifest.evento_primeiro_id === null || manifest.evento_ultimo_id === null)
) {
  console.error(
    "Cannot render SQL: events export must include numeric id for evento_primeiro_id/evento_ultimo_id when evento_count > 0"
  );
  process.exit(2);
}

console.log(options.format === "sql" ? toRegistrarCloseoutSql(manifest) : JSON.stringify(manifest, null, 2));

if (manifest.resultado !== "pass") {
  process.exit(1);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    tipo: "diario",
    format: "json",
    schemaVersion: "004_closeout_lote",
    verifierVersion: "contador-trilha-verifier@0.1.0"
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];
    if (arg === "--input") {
      options.input = value;
      index += 1;
    } else if (arg === "--tipo" && isTipo(value)) {
      options.tipo = value;
      index += 1;
    } else if (arg === "--format" && isFormat(value)) {
      options.format = value;
      index += 1;
    } else if (arg === "--escritorio") {
      options.escritorio = value;
      index += 1;
    } else if (arg === "--inicio") {
      options.inicio = value;
      index += 1;
    } else if (arg === "--fim") {
      options.fim = value;
      index += 1;
    } else if (arg === "--executado-por") {
      options.executadoPor = value;
      index += 1;
    } else if (arg === "--schema-version") {
      options.schemaVersion = value;
      index += 1;
    } else if (arg === "--verifier-version") {
      options.verifierVersion = value;
      index += 1;
    }
  }

  return options;
}

function isTipo(value: string | undefined): value is CliOptions["tipo"] {
  return value === "diario" || value === "mensal" || value === "corretivo";
}

function isFormat(value: string | undefined): value is CliOptions["format"] {
  return value === "json" || value === "sql";
}

function toRegistrarCloseoutSql(manifest: ReturnType<typeof gerarManifestoCloseout>): string {
  return [
    "select core_api_v1.registrar_closeout(",
    `  ${sqlUuid(manifest.escritorio_id)},`,
    `  ${sqlText(manifest.tipo)},`,
    `  ${sqlTimestamptz(manifest.periodo_inicio)},`,
    `  ${sqlTimestamptz(manifest.periodo_fim)},`,
    `  ${sqlNumberOrNull(manifest.evento_primeiro_seq)},`,
    `  ${sqlNumberOrNull(manifest.evento_ultimo_seq)},`,
    `  ${sqlNumberOrNull(manifest.evento_primeiro_id)},`,
    `  ${sqlNumberOrNull(manifest.evento_ultimo_id)},`,
    `  ${manifest.evento_count},`,
    `  ${sqlByteaOrNull(manifest.hash_primeiro)},`,
    `  ${sqlByteaOrNull(manifest.hash_ultimo)},`,
    `  ${sqlByteaOrNull(manifest.merkle_root)},`,
    `  ${sqlText(manifest.verifier_version)},`,
    `  ${manifest.hash_ver},`,
    `  ${sqlText(manifest.resultado)},`,
    `  ${sqlJsonb(manifest)},`,
    `  ${sqlByteaOrNull(manifest.manifesto_hash)},`,
    `  ${sqlUuidOrNull(manifest.executado_por ?? null)},`,
    `  ${sqlText(manifest.time_stamp_provider)},`,
    "  null",
    ");"
  ].join("\n");
}

function sqlText(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlUuid(value: string): string {
  return `${sqlText(value)}::uuid`;
}

function sqlUuidOrNull(value: string | null): string {
  return value ? sqlUuid(value) : "null";
}

function sqlTimestamptz(value: string): string {
  return `${sqlText(value)}::timestamptz`;
}

function sqlNumberOrNull(value: number | null): string {
  return value === null ? "null" : String(value);
}

function sqlByteaOrNull(value: string | null): string {
  return value ? `decode('${value}', 'hex')` : "null";
}

function sqlJsonb(value: unknown): string {
  return `$manifest$${JSON.stringify(value)}$manifest$::jsonb`;
}
