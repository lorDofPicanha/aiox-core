import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type BridgeEnv = Record<string, string | undefined>;

export interface BridgeEnvLoadResult {
  env: BridgeEnv;
  envLocalFound: boolean;
}

export function readEnvLocal(cwd = process.cwd()): Record<string, string> {
  const path = resolve(cwd, '.env.local');
  if (!existsSync(path)) return {};

  const raw = readFileSync(path, 'utf8');
  const env: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) env[key] = value;
  }

  return env;
}

export function loadBridgeEnv(cwd = process.cwd()): BridgeEnvLoadResult {
  const envLocal = readEnvLocal(cwd);

  return {
    env: {
      ...envLocal,
      ...process.env,
    },
    envLocalFound: existsSync(resolve(cwd, '.env.local')),
  };
}
