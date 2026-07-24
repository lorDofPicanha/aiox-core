import {
  buildDataManagerOfflineConversionRequest,
  probeGoogleConversionRoute,
} from '../src/lib/google-conversion-route.js';
import { loadBridgeEnv } from '../src/lib/local-env.js';

const { env } = loadBridgeEnv();
const probe = probeGoogleConversionRoute(env);

console.log(JSON.stringify({ probe }, null, 2));

if (probe.preferredRoute === 'data-manager') {
  const sample = buildDataManagerOfflineConversionRequest({
    operatingAccountId: env.DATA_MANAGER_OPERATING_ACCOUNT_ID || '1234567890',
    loginAccountId: env.DATA_MANAGER_LOGIN_ACCOUNT_ID || undefined,
    conversionActionId: env.DATA_MANAGER_CONVERSION_ACTION_ID || '123456789',
    transactionId: 'crm-probe-transaction',
    eventTimestamp: new Date('2026-07-10T12:00:00-03:00').toISOString(),
    conversionValue: 1,
    currency: 'BRL',
    gclid: 'TEST_GCLID',
    email: 'lead@example.com',
    phoneE164: '+5511999999999',
  });

  console.log(JSON.stringify({ dataManagerSampleRequest: sample }, null, 2));
}

if (probe.classification === 'blocked') {
  process.exitCode = 1;
}
