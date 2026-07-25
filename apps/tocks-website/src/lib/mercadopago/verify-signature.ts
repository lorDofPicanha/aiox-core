/**
 * Mercado Pago — validação do header `x-signature` (HMAC-SHA256).
 *
 * SEM isto qualquer um pode forjar uma notificação de "pagamento aprovado".
 * Manifest oficial: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * (se data.id for alfanumérico, usar minúsculas). Segredo = MP_WEBHOOK_SECRET.
 */

import crypto from 'node:crypto'

interface SignatureParts {
  ts: string
  v1: string
}

function parseSignatureHeader(header: string): SignatureParts | null {
  const parts: Record<string, string> = {}
  for (const segment of header.split(',')) {
    const idx = segment.indexOf('=')
    if (idx === -1) continue
    const key = segment.slice(0, idx).trim()
    const value = segment.slice(idx + 1).trim()
    if (key) parts[key] = value
  }
  if (!parts.ts || !parts.v1) return null
  return { ts: parts.ts, v1: parts.v1 }
}

export function verifyWebhookSignature(args: {
  xSignature: string | null
  xRequestId: string | null
  dataId: string | null
  secret: string | undefined
}): boolean {
  const { xSignature, xRequestId, dataId, secret } = args
  if (!secret || !xSignature || !dataId) return false

  const parts = parseSignatureHeader(xSignature)
  if (!parts) return false

  const normalizedId = /[a-z]/i.test(dataId) ? dataId.toLowerCase() : dataId
  const manifest = `id:${normalizedId};request-id:${xRequestId ?? ''};ts:${parts.ts};`
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(parts.v1)
  if (expectedBuf.length !== receivedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
