import { type BridgeEnv, loadBridgeEnv } from './local-env.js';

export type EnvStatus = 'ready' | 'needs-config';

export interface EnvGroupReport {
  status: EnvStatus;
  required: string[];
  present: string[];
  missing: string[];
  optional: string[];
  optionalPresent: string[];
}

export interface BridgeEnvSmokeReport {
  supabase: EnvGroupReport;
  meta: EnvGroupReport;
  googleUploadClick: EnvGroupReport;
  googleDataManager: EnvGroupReport;
  inngest: EnvGroupReport;
  manualTrigger: EnvGroupReport;
  files: {
    envLocalFound: boolean;
  };
}

function hasValue(name: string, env: BridgeEnv): boolean {
  return Boolean(env[name]);
}

function group(
  env: BridgeEnv,
  required: string[],
  optional: string[] = []
): EnvGroupReport {
  const present = required.filter((name) => hasValue(name, env));
  const missing = required.filter((name) => !hasValue(name, env));
  const optionalPresent = optional.filter((name) => hasValue(name, env));

  return {
    status: missing.length === 0 ? 'ready' : 'needs-config',
    required,
    present,
    missing,
    optional,
    optionalPresent,
  };
}

export function smokeBridgeEnv(): BridgeEnvSmokeReport {
  const { env, envLocalFound } = loadBridgeEnv();

  return {
    supabase: group(env, [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_DB_URL',
    ]),
    meta: group(env, ['META_PIXEL_ID', 'META_ACCESS_TOKEN'], [
      'META_TEST_EVENT_CODE',
      'META_API_VERSION',
    ]),
    googleUploadClick: group(env, [
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'GOOGLE_ADS_CLIENT_ID',
      'GOOGLE_ADS_CLIENT_SECRET',
      'GOOGLE_ADS_REFRESH_TOKEN',
      'GOOGLE_ADS_CUSTOMER_ID',
      'GOOGLE_ADS_CONVERSION_ACTION_LEAD_QUALIFIED',
    ], ['GOOGLE_ADS_LOGIN_CUSTOMER_ID', 'GOOGLE_ADS_CONVERSION_ACTION_DEAL_WON']),
    googleDataManager: group(env, [
      'DATA_MANAGER_ACCESS_TOKEN',
      'DATA_MANAGER_OPERATING_ACCOUNT_ID',
      'DATA_MANAGER_CONVERSION_ACTION_ID',
    ], ['DATA_MANAGER_LOGIN_ACCOUNT_ID']),
    inngest: group(env, [], ['INNGEST_EVENT_KEY', 'INNGEST_SIGNING_KEY']),
    manualTrigger: group(env, ['MANUAL_TRIGGER_TOKEN']),
    files: {
      envLocalFound,
    },
  };
}
