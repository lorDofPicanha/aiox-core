// Explicit block for authenticated sources without validated vault + ToS + human
// authorization (squad decision 2026-06-08). This guard is the constitutional
// tripwire: it refuses any payload that smells like a credential and blocks
// automation for sources whose registry entry is not allowedNow.

import type { SourceCode } from "../noyce-model";
import { getSourceDefinition } from "../noyce-source-registry.ts";

// Keys that must NEVER reach a source adapter, a log, a fixture, or git.
export const FORBIDDEN_CREDENTIAL_KEYS = [
  "password",
  "passwd",
  "senha",
  "token",
  "access_token",
  "refresh_token",
  "cookie",
  "session",
  "sessionid",
  "authorization",
  "auth",
  "apikey",
  "api_key",
  "certificate",
  "certificado",
  "cert",
  "pfx",
  "p12",
  "2fa",
  "otp",
  "mfa",
] as const;

export interface GuardVerdict {
  allowed: boolean;
  status: "allowed" | "blocked_until_vault";
  reason: string;
}

function findForbiddenKey(payload: unknown, depth = 0): string | null {
  if (payload === null || typeof payload !== "object" || depth > 4) return null;
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (FORBIDDEN_CREDENTIAL_KEYS.some((forbidden) => normalized.includes(forbidden.replace(/[^a-z0-9]/g, "")))) {
      return key;
    }
    const nested = findForbiddenKey(value, depth + 1);
    if (nested) return nested;
  }
  return null;
}

// Throws if the payload contains anything credential-shaped. Use before any source run.
export function assertNoSecrets(payload: unknown, context = "payload"): void {
  const offending = findForbiddenKey(payload);
  if (offending) {
    throw new Error(
      `assertNoSecrets: credential-shaped key "${offending}" rejected in ${context}. ` +
        "Secrets must never reach a source adapter, log, fixture, or git.",
    );
  }
}

// Redacts credential-shaped values for safe logging.
export function redactSecrets<T>(payload: T): T {
  if (payload === null || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) return payload.map((item) => redactSecrets(item)) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (FORBIDDEN_CREDENTIAL_KEYS.some((forbidden) => normalized.includes(forbidden.replace(/[^a-z0-9]/g, "")))) {
      out[key] = "[REDACTED]";
    } else {
      out[key] = redactSecrets(value);
    }
  }
  return out as T;
}

// Gate automation for a source by its registry permission.
export function guardSource(source: SourceCode): GuardVerdict {
  const def = getSourceDefinition(source);
  if (!def) {
    return {
      allowed: false,
      status: "blocked_until_vault",
      reason: `Fonte desconhecida "${source}" — sem definicao no registry.`,
    };
  }
  if (def.allowedNow) {
    return { allowed: true, status: "allowed", reason: `${def.label} liberada (${def.accessMode}).` };
  }
  return {
    allowed: false,
    status: "blocked_until_vault",
    reason: `${def.label} bloqueada: ${def.nextHumanInput}`,
  };
}

// Hard stop for any attempt to automate an authenticated source.
export function assertAutomationAllowed(source: SourceCode): void {
  const verdict = guardSource(source);
  if (!verdict.allowed) {
    throw new Error(`blocked_until_vault: ${verdict.reason}`);
  }
}

// Path sanitizer: only relative human-drop paths (e.g. Downloads/<file>); never
// absolute Windows/Unix paths that would leak a user's home dir into git.
export function sanitizeImportPath(rawPath: string): string {
  const cleaned = rawPath.replace(/\\/g, "/").trim();
  if (/^[a-zA-Z]:\//.test(cleaned) || cleaned.startsWith("/") || cleaned.includes("..")) {
    throw new Error(
      `sanitizeImportPath: caminho absoluto/inseguro rejeitado ("${rawPath}"). Use "Downloads/<arquivo>".`,
    );
  }
  const base = cleaned.split("/").pop() ?? cleaned;
  return `Downloads/${base}`;
}
