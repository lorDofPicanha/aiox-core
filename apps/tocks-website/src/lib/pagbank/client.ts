import 'server-only'

const SANDBOX_API_URL = 'https://sandbox.api.pagseguro.com'
const PRODUCTION_API_URL = 'https://api.pagseguro.com'

export function getPagBankApiUrl(): string {
  const baseUrl = process.env.PAGBANK_API_BASE_URL ?? SANDBOX_API_URL
  if (baseUrl !== SANDBOX_API_URL && baseUrl !== PRODUCTION_API_URL) {
    throw new Error('PAGBANK_API_BASE_URL inválida.')
  }
  return baseUrl
}

export function getPagBankAccessToken(): string {
  const token = process.env.PAGBANK_ACCESS_TOKEN
  if (!token) throw new Error('PAGBANK_ACCESS_TOKEN ausente.')
  return token
}

export async function pagBankFetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${getPagBankApiUrl()}${path}`, {
    ...init,
    headers: { Accept: 'application/json', Authorization: `Bearer ${getPagBankAccessToken()}`, ...init.headers },
    cache: 'no-store',
  })
}
