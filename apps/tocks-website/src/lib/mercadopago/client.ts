/**
 * Mercado Pago — client server-side (SDK Node v2).
 *
 * NUNCA importar em Client Component. Usa MP_ACCESS_TOKEN (server-only).
 * Em desenvolvimento use as credenciais de TESTE do painel do Mercado Pago.
 */

import { MercadoPagoConfig } from 'mercadopago'

function getAccessToken(): string {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'MP_ACCESS_TOKEN ausente. Configure em .env.local com as credenciais de TESTE do Mercado Pago.',
    )
  }
  return token
}

/** Cria um client MP por request (barato; evita segurar token em módulo). */
export function getMercadoPagoClient(): MercadoPagoConfig {
  return new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: { timeout: 8000 },
  })
}
