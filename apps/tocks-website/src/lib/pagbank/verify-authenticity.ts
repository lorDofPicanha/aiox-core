import 'server-only'
import crypto from 'node:crypto'

export function verifyPagBankAuthenticity(args: { rawBody: string; receivedToken: string | null; accountToken: string | undefined }): boolean {
  const { rawBody, receivedToken, accountToken } = args
  if (!receivedToken || !accountToken) return false
  const expected = crypto.createHash('sha256').update(`${accountToken}-${rawBody}`, 'utf8').digest('hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  const receivedBuffer = Buffer.from(receivedToken, 'hex')
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}
