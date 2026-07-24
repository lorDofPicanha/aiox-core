import { z } from 'zod';
import { hashPII } from './idempotency.js';
import type { BridgeEnv } from './local-env.js';

export type GoogleRouteClassification =
  | 'upload-click-ready'
  | 'data-manager-needed'
  | 'blocked';

export interface GoogleRouteProbe {
  classification: GoogleRouteClassification;
  preferredRoute: 'upload-click' | 'data-manager';
  canRunUploadClick: boolean;
  canRunDataManager: boolean;
  missingUploadClickEnv: string[];
  missingDataManagerEnv: string[];
  reasons: string[];
}

const DataManagerEventInputSchema = z.object({
  operatingAccountId: z.string().min(1),
  loginAccountId: z.string().min(1).optional(),
  conversionActionId: z.string().min(1),
  transactionId: z.string().min(1),
  eventTimestamp: z.string().min(1),
  conversionValue: z.number().nonnegative(),
  currency: z.string().length(3),
  gclid: z.string().optional(),
  email: z.string().email().optional(),
  phoneE164: z.string().optional(),
});

export type DataManagerEventInput = z.infer<typeof DataManagerEventInputSchema>;

function missing(env: BridgeEnv, names: string[]): string[] {
  return names.filter((name) => !env[name]);
}

export function probeGoogleConversionRoute(
  env: BridgeEnv = process.env
): GoogleRouteProbe {
  const uploadClickRequired = [
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN',
    'GOOGLE_ADS_CUSTOMER_ID',
    'GOOGLE_ADS_CONVERSION_ACTION_LEAD_QUALIFIED',
  ];
  const dataManagerRequired = [
    'DATA_MANAGER_ACCESS_TOKEN',
    'DATA_MANAGER_OPERATING_ACCOUNT_ID',
    'DATA_MANAGER_CONVERSION_ACTION_ID',
  ];

  const missingUploadClickEnv = missing(env, uploadClickRequired);
  const missingDataManagerEnv = missing(env, dataManagerRequired);
  const preCutoverToken = env.GOOGLE_ADS_UPLOAD_CLICK_PRE_2026_06_15 === 'true';
  const canRunUploadClick = preCutoverToken && missingUploadClickEnv.length === 0;
  const canRunDataManager = missingDataManagerEnv.length === 0;

  const reasons: string[] = [];

  if (!preCutoverToken) {
    reasons.push(
      'UploadClickConversion is not eligible unless the developer token had successful offline/enhanced lead uploads before 2026-06-15.'
    );
  }
  if (missingUploadClickEnv.length > 0) {
    reasons.push(`UploadClickConversion env missing: ${missingUploadClickEnv.join(', ')}`);
  }
  if (missingDataManagerEnv.length > 0) {
    reasons.push(`Data Manager env missing: ${missingDataManagerEnv.join(', ')}`);
  }

  if (canRunUploadClick) {
    return {
      classification: 'upload-click-ready',
      preferredRoute: 'upload-click',
      canRunUploadClick,
      canRunDataManager,
      missingUploadClickEnv,
      missingDataManagerEnv,
      reasons,
    };
  }

  return {
    classification: 'data-manager-needed',
    preferredRoute: 'data-manager',
    canRunUploadClick,
    canRunDataManager,
    missingUploadClickEnv,
    missingDataManagerEnv,
    reasons,
  };
}

export function buildDataManagerOfflineConversionRequest(input: DataManagerEventInput) {
  const parsed = DataManagerEventInputSchema.parse(input);
  const destination = {
    operatingAccount: {
      accountType: 'GOOGLE_ADS',
      accountId: parsed.operatingAccountId,
    },
    loginAccount: parsed.loginAccountId
      ? {
          accountType: 'GOOGLE_ADS',
          accountId: parsed.loginAccountId,
        }
      : undefined,
    productDestinationId: parsed.conversionActionId,
    reference: 'google_ads_offline_conversion',
  };

  return {
    destinations: [destination],
    events: [
      {
        adIdentifiers: parsed.gclid ? { gclid: parsed.gclid } : undefined,
        userData: {
          userIdentifiers: [
            ...(parsed.email ? [{ emailAddress: hashPII(parsed.email) }] : []),
            ...(parsed.phoneE164
              ? [{ phoneNumber: hashPII(parsed.phoneE164.replace(/\D/g, '')) }]
              : []),
          ],
        },
        conversionValue: parsed.conversionValue,
        currency: parsed.currency,
        eventTimestamp: parsed.eventTimestamp,
        transactionId: parsed.transactionId,
        eventSource: 'WEB',
        destinationReferences: ['google_ads_offline_conversion'],
      },
    ],
    validateOnly: true,
  };
}
