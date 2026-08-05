export class HttpInputError extends Error {
  readonly status: 400 | 413 | 415;

  constructor(status: 400 | 413 | 415) {
    super("invalid request");
    this.name = "HttpInputError";
    this.status = status;
  }
}

export interface JsonLimits {
  maxDepth?: number;
  maxArrayLength?: number;
  maxObjectKeys?: number;
  maxStringLength?: number;
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") throw new HttpInputError(415);

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const declared = Number(contentLength);
    if (!Number.isSafeInteger(declared) || declared < 0) throw new HttpInputError(400);
    if (declared > maxBytes) throw new HttpInputError(413);
  }

  if (!request.body) throw new HttpInputError(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new HttpInputError(413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } catch {
    throw new HttpInputError(400);
  }
}

export function expectObject(value: unknown, allowedKeys?: readonly string[]): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new HttpInputError(400);
  const record = value as Record<string, unknown>;
  if (allowedKeys) {
    const allowed = new Set(allowedKeys);
    if (Object.keys(record).some((key) => !allowed.has(key))) throw new HttpInputError(400);
  }
  return record;
}

export function optionalString(
  record: Record<string, unknown>,
  key: string,
  options: { maxLength: number; minLength?: number; pattern?: RegExp; trim?: boolean },
): string | undefined {
  const raw = record[key];
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "string") throw new HttpInputError(400);
  const value = options.trim === false ? raw : raw.trim();
  if (value.length < (options.minLength ?? 0) || value.length > options.maxLength) throw new HttpInputError(400);
  if (options.pattern && !options.pattern.test(value)) throw new HttpInputError(400);
  return value;
}

export function optionalBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") throw new HttpInputError(400);
  return value;
}

export function optionalNumber(
  record: Record<string, unknown>,
  key: string,
  options: { min?: number; max?: number } = {},
): number | undefined {
  const value = record[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) throw new HttpInputError(400);
  if (options.min !== undefined && value < options.min) throw new HttpInputError(400);
  if (options.max !== undefined && value > options.max) throw new HttpInputError(400);
  return value;
}

export function assertJsonLimits(value: unknown, limits: JsonLimits = {}, depth = 0): void {
  const maxDepth = limits.maxDepth ?? 8;
  const maxArrayLength = limits.maxArrayLength ?? 100;
  const maxObjectKeys = limits.maxObjectKeys ?? 100;
  const maxStringLength = limits.maxStringLength ?? 50_000;
  if (depth > maxDepth) throw new HttpInputError(400);
  if (typeof value === "string" && value.length > maxStringLength) throw new HttpInputError(400);
  if (Array.isArray(value)) {
    if (value.length > maxArrayLength) throw new HttpInputError(400);
    for (const item of value) assertJsonLimits(item, limits, depth + 1);
  } else if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > maxObjectKeys) throw new HttpInputError(400);
    for (const [, item] of entries) assertJsonLimits(item, limits, depth + 1);
  }
}
