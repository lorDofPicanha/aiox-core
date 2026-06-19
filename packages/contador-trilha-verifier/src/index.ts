import { createHash } from "node:crypto";

export interface EventoBoaFeDump {
  id?: number | null;
  escritorio_id: string;
  seq_tenant: number;
  hash_ver: number;
  tipo_evento: string;
  ator_tipo: string;
  ator_id?: string | null;
  referente_tipo?: string | null;
  referente_id?: string | null;
  nota_id?: string | null;
  apontamento_id?: string | null;
  laudo_id?: string | null;
  payload: Record<string, unknown>;
  ocorrido_em: string;
  hash_anterior: string;
  hash_evento: string;
}

export interface VerificacaoResultado {
  ok: boolean;
  checked: number;
  headHash?: string;
  failures: VerificacaoFalha[];
}

export interface VerificacaoFalha {
  seq: number;
  code: "UNSUPPORTED_HASH_VER" | "SEQ_GAP" | "PREVIOUS_HASH_MISMATCH" | "EVENT_HASH_MISMATCH";
  message: string;
}

export interface CloseoutManifestInput {
  closeout_id: string;
  tipo: "diario" | "mensal" | "corretivo";
  escritorio_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  executado_por?: string | null;
  executado_em: string;
  verifier_version: string;
  schema_version: string;
}

export interface CloseoutManifest {
  manifest_schema_version: "closeout.v1";
  closeout_id: string;
  tipo: "diario" | "mensal" | "corretivo";
  escritorio_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  evento_primeiro_seq: number | null;
  evento_ultimo_seq: number | null;
  evento_primeiro_id: number | null;
  evento_ultimo_id: number | null;
  evento_count: number;
  hash_primeiro: string | null;
  hash_ultimo: string | null;
  merkle_root: string | null;
  verifier_version: string;
  schema_version: string;
  hash_ver: number;
  executado_por?: string | null;
  executado_em: string;
  resultado: "pass" | "fail";
  time_stamp_provider: "none";
  time_stamp_token_ref: null;
  failures: VerificacaoFalha[];
  manifesto_hash: string;
}

const GENESIS_HASH = "00";
const SEP = String.fromCharCode(31);

export function verificarCadeia(eventos: EventoBoaFeDump[]): VerificacaoResultado {
  const sorted = [...eventos].sort((a, b) => a.seq_tenant - b.seq_tenant);
  const failures: VerificacaoFalha[] = [];
  let previousHash = GENESIS_HASH;

  for (let index = 0; index < sorted.length; index += 1) {
    const evento = sorted[index];
    const expectedSeq = index + 1;

    if (evento.hash_ver !== 1) {
      failures.push({
        seq: evento.seq_tenant,
        code: "UNSUPPORTED_HASH_VER",
        message: `Unsupported hash_ver ${evento.hash_ver}`
      });
      continue;
    }

    if (evento.seq_tenant !== expectedSeq) {
      failures.push({
        seq: evento.seq_tenant,
        code: "SEQ_GAP",
        message: `Expected seq ${expectedSeq}, got ${evento.seq_tenant}`
      });
    }

    if (normalizarHash(evento.hash_anterior) !== normalizarHash(previousHash)) {
      failures.push({
        seq: evento.seq_tenant,
        code: "PREVIOUS_HASH_MISMATCH",
        message: `Expected previous hash ${previousHash}, got ${evento.hash_anterior}`
      });
    }

    const recomputed = calcularHashEventoV1(evento);
    if (normalizarHash(evento.hash_evento) !== recomputed) {
      failures.push({
        seq: evento.seq_tenant,
        code: "EVENT_HASH_MISMATCH",
        message: `Expected event hash ${recomputed}, got ${evento.hash_evento}`
      });
    }

    previousHash = evento.hash_evento;
  }

  return {
    ok: failures.length === 0,
    checked: sorted.length,
    headHash: sorted.at(-1)?.hash_evento,
    failures
  };
}

export function calcularHashEventoV1(evento: Omit<EventoBoaFeDump, "hash_evento">): string {
  const canonical = [
    normalizarHash(evento.hash_anterior),
    `escritorio=${evento.escritorio_id}`,
    `seq=${evento.seq_tenant}`,
    `hash_ver=${evento.hash_ver}`,
    `tipo=${evento.tipo_evento}`,
    `ator_tipo=${evento.ator_tipo}`,
    `ator_id=${evento.ator_id ?? ""}`,
    `ref_tipo=${evento.referente_tipo ?? ""}`,
    `ref_id=${evento.referente_id ?? ""}`,
    `nota=${evento.nota_id ?? ""}`,
    `apontamento=${evento.apontamento_id ?? ""}`,
    `laudo=${evento.laudo_id ?? ""}`,
    `payload=${stringifyPayload(evento.payload)}`,
    `ocorrido=${normalizarTimestamp(evento.ocorrido_em)}`
  ].join(SEP);

  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function appendEventoForTest(
  eventos: EventoBoaFeDump[],
  evento: Omit<EventoBoaFeDump, "seq_tenant" | "hash_anterior" | "hash_evento">
): EventoBoaFeDump {
  const previous = eventos.at(-1);
  const seq = (previous?.seq_tenant ?? 0) + 1;
  const hashAnterior = previous?.hash_evento ?? GENESIS_HASH;
  const draft = {
    ...evento,
    seq_tenant: seq,
    hash_anterior: hashAnterior
  };
  const hashEvento = calcularHashEventoV1(draft);
  const completed: EventoBoaFeDump = {
    ...draft,
    hash_evento: hashEvento
  };
  eventos.push(completed);
  return completed;
}

export function gerarManifestoCloseout(eventos: EventoBoaFeDump[], input: CloseoutManifestInput): CloseoutManifest {
  const sorted = [...eventos].sort((a, b) => a.seq_tenant - b.seq_tenant);
  const verification = verificarCadeia(sorted);
  const hashVer = sorted[0]?.hash_ver ?? 1;
  const manifestWithoutHash = {
    manifest_schema_version: "closeout.v1" as const,
    closeout_id: input.closeout_id,
    tipo: input.tipo,
    escritorio_id: input.escritorio_id,
    periodo_inicio: normalizarTimestamp(input.periodo_inicio),
    periodo_fim: normalizarTimestamp(input.periodo_fim),
    evento_primeiro_seq: sorted[0]?.seq_tenant ?? null,
    evento_ultimo_seq: sorted.at(-1)?.seq_tenant ?? null,
    evento_primeiro_id: sorted[0]?.id ?? null,
    evento_ultimo_id: sorted.at(-1)?.id ?? null,
    evento_count: sorted.length,
    hash_primeiro: sorted[0]?.hash_evento ? normalizarHash(sorted[0].hash_evento) : null,
    hash_ultimo: verification.headHash ? normalizarHash(verification.headHash) : null,
    merkle_root: calcularMerkleRoot(sorted.map((evento) => evento.hash_evento)),
    verifier_version: input.verifier_version,
    schema_version: input.schema_version,
    hash_ver: hashVer,
    executado_por: input.executado_por ?? null,
    executado_em: normalizarTimestamp(input.executado_em),
    resultado: verification.ok ? ("pass" as const) : ("fail" as const),
    time_stamp_provider: "none" as const,
    time_stamp_token_ref: null,
    failures: verification.failures
  };

  return {
    ...manifestWithoutHash,
    manifesto_hash: hashObjeto(manifestWithoutHash)
  };
}

function calcularMerkleRoot(hashes: string[]): string | null {
  if (hashes.length === 0) {
    return null;
  }

  let level = hashes.map(normalizarHash);
  while (level.length > 1) {
    const next: string[] = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(createHash("sha256").update(`${left}${right}`, "utf8").digest("hex"));
    }
    level = next;
  }

  return level[0];
}

function hashObjeto(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(sortObject(value)), "utf8").digest("hex");
}

function stringifyPayload(payload: Record<string, unknown>): string {
  return stringifyPostgresJsonb(sortObject(payload));
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    return Object.keys(input)
      .sort(compareJsonbKeys)
      .reduce<Record<string, unknown>>((acc, key) => {
        const child = input[key];
        if (child !== null && child !== undefined) {
          acc[key] = sortObject(child);
        }
        return acc;
      }, {});
  }

  return value;
}

function compareJsonbKeys(a: string, b: string): number {
  return a.length - b.length || a.localeCompare(b);
}

function normalizarTimestamp(value: string): string {
  const normalized = value.trim().replace(" ", "T");
  const postgresUtc = normalized.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(?:Z|\+00(?::?00)?)$/
  );

  if (postgresUtc) {
    const [, seconds, fraction = ""] = postgresUtc;
    return `${seconds}.${fraction.padEnd(6, "0")}Z`;
  }

  return new Date(value).toISOString().replace("Z", "000Z");
}

function normalizarHash(value: string): string {
  return value.toLowerCase().replace(/^\\x/, "").replace(/^0x/, "");
}

function stringifyPostgresJsonb(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stringifyPostgresJsonb).join(", ")}]`;
  }

  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const entries = Object.entries(input);
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}: ${stringifyPostgresJsonb(child)}`).join(", ")}}`;
  }

  return JSON.stringify(value);
}
