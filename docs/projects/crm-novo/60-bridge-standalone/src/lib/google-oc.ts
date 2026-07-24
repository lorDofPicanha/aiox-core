import { GoogleAdsApi } from 'google-ads-api';
import { z } from 'zod';
import { hashPII } from './idempotency.js';

const ClickConversionSchema = z.object({
  conversion_action: z.string().min(1), // customers/X/conversionActions/Y
  conversion_date_time: z.string(), // "2026-05-19 10:42:00-03:00"
  conversion_value: z.number().nonnegative(),
  currency_code: z.string().length(3),
  gclid: z.string().optional(),
  user_identifiers: z
    .array(
      z.object({
        hashed_email: z.string().optional(),
        hashed_phone_number: z.string().optional(),
      })
    )
    .optional(),
  order_id: z.string().optional(),
});

export type ClickConversion = z.infer<typeof ClickConversionSchema>;

export interface OCResponse {
  results_count: number;
  partial_failure?: unknown;
  customer_id: string;
}

let cachedClient: GoogleAdsApi | null = null;

function getClient(): GoogleAdsApi {
  if (cachedClient) return cachedClient;

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

  if (!developerToken || !clientId || !clientSecret) {
    throw new Error('GOOGLE_ADS_DEVELOPER_TOKEN, CLIENT_ID, CLIENT_SECRET required');
  }

  cachedClient = new GoogleAdsApi({
    developer_token: developerToken,
    client_id: clientId,
    client_secret: clientSecret,
  });
  return cachedClient;
}

/**
 * Faz upload de offline conversion via Google Ads API.
 * Usa uploadClickConversions (API v20+).
 */
export async function uploadClickConversion(args: {
  customerId: string;
  loginCustomerId?: string;
  refreshToken: string;
  conversion: ClickConversion;
}): Promise<OCResponse> {
  const validated = ClickConversionSchema.parse(args.conversion);
  const client = getClient();

  const customer = client.Customer({
    customer_id: args.customerId,
    refresh_token: args.refreshToken,
    login_customer_id: args.loginCustomerId,
  });

  type UploadClickConversionsRequest = Parameters<
    typeof customer.conversionUploads.uploadClickConversions
  >[0];

  const request = {
    customer_id: args.customerId,
    conversions: [validated as unknown as never],
    partial_failure: true,
    validate_only: false,
  } as unknown as UploadClickConversionsRequest;

  const result = await customer.conversionUploads.uploadClickConversions(request);

  return {
    results_count: (result.results?.length as number) ?? 0,
    partial_failure: result.partial_failure_error,
    customer_id: args.customerId,
  };
}

/**
 * Helper: builda ClickConversion pra lead.qualified com PII hash.
 * Aceita gclid OU user-provided-data (mas Google prefere gclid se disponível).
 */
export function buildLeadConversion(args: {
  conversionActionResource: string;
  whatsappE164: string;
  email?: string;
  valueBRL: number;
  gclid?: string;
  orderId: string;
}): ClickConversion {
  const conversionDateTime = formatGoogleDateTime(new Date());

  const conversion: ClickConversion = {
    conversion_action: args.conversionActionResource,
    conversion_date_time: conversionDateTime,
    conversion_value: args.valueBRL,
    currency_code: 'BRL',
    order_id: args.orderId,
  };

  if (args.gclid) {
    conversion.gclid = args.gclid;
  } else {
    // Enhanced conversion fallback via user-provided data
    const identifiers: NonNullable<ClickConversion['user_identifiers']> = [];

    if (args.email) {
      identifiers.push({ hashed_email: hashPII(args.email) });
    }
    identifiers.push({ hashed_phone_number: hashPII(args.whatsappE164.replace(/\D/g, '')) });

    if (identifiers.length > 0) {
      conversion.user_identifiers = identifiers;
    }
  }

  return conversion;
}

/**
 * Helper: builda ClickConversion pra deal.won (Purchase).
 */
export function buildPurchaseConversion(args: {
  conversionActionResource: string;
  whatsappE164: string;
  email?: string;
  valueBRL: number;
  gclid?: string;
  orderId: string;
}): ClickConversion {
  return buildLeadConversion(args); // Mesma estrutura, conversion_action diferente.
}

/**
 * Formato esperado pelo Google: "yyyy-MM-dd HH:mm:ss±HH:mm"
 */
function formatGoogleDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const tzOffsetMin = -date.getTimezoneOffset();
  const tzSign = tzOffsetMin >= 0 ? '+' : '-';
  const tzAbs = Math.abs(tzOffsetMin);
  const tz = `${tzSign}${pad(Math.floor(tzAbs / 60))}:${pad(tzAbs % 60)}`;

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${tz}`
  );
}
