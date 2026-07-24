import { createClient } from '@supabase/supabase-js';
import { smokeBridgeEnv } from '../src/lib/env-smoke.js';
import { probeGoogleConversionRoute } from '../src/lib/google-conversion-route.js';
import { type BridgeEnv, loadBridgeEnv } from '../src/lib/local-env.js';

type SmokeStatus = 'ready' | 'needs-config' | 'failed';

interface LiveSmokeResult {
  status: SmokeStatus;
  env: ReturnType<typeof smokeBridgeEnv>;
  googleRoute: ReturnType<typeof probeGoogleConversionRoute>;
  supabaseReadOnly: {
    status: SmokeStatus;
    checked: boolean;
    message: string;
  };
}

async function smokeSupabaseReadOnly(
  bridgeEnv: BridgeEnv
): Promise<LiveSmokeResult['supabaseReadOnly']> {
  const url = bridgeEnv.SUPABASE_URL;
  const key = bridgeEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return {
      status: 'needs-config',
      checked: false,
      message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for live read-only smoke.',
    };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
  });

  const { error } = await supabase.from('bridge_summary_24h').select('*').limit(1);

  if (error) {
    return {
      status: 'failed',
      checked: true,
      message: `Read-only bridge_summary_24h smoke failed: ${error.message}`,
    };
  }

  return {
    status: 'ready',
    checked: true,
    message: 'Read-only bridge_summary_24h smoke passed.',
  };
}

async function main(): Promise<void> {
  const { env: bridgeEnv } = loadBridgeEnv();
  const env = smokeBridgeEnv();
  const googleRoute = probeGoogleConversionRoute(bridgeEnv);
  const supabaseReadOnly = await smokeSupabaseReadOnly(bridgeEnv);

  const status: SmokeStatus =
    supabaseReadOnly.status === 'failed'
      ? 'failed'
      : env.supabase.status === 'ready' &&
          env.meta.status === 'ready' &&
          env.manualTrigger.status === 'ready' &&
          (googleRoute.canRunDataManager || googleRoute.canRunUploadClick)
        ? 'ready'
        : 'needs-config';

  const result: LiveSmokeResult = {
    status,
    env,
    googleRoute,
    supabaseReadOnly,
  };

  console.log(JSON.stringify(result, null, 2));

  if (status === 'failed') {
    process.exitCode = 1;
  }
}

void main();
