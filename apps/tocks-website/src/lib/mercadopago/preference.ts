/**
 * Mercado Pago — criação da preference (Checkout Pro).
 *
 * Decisões do founder (24/Jul/2026):
 *   - Pagamento INTEGRAL, cartão de crédito até 12x.
 *   - Métodos: Pix + cartão de crédito. Sem boleto ("ticket") e sem débito.
 *
 * O valor (`order.amount`) vem SEMPRE do servidor — nunca do client.
 */

import { Preference } from 'mercadopago'
import { getMercadoPagoClient } from './client'
import { SITE_URL } from '@/lib/constants'
import type { Order } from '@/lib/orders/types'

/**
 * Base absoluta para back_urls e notification_url.
 * Em dev/sandbox use a URL pública do túnel (cloudflared/ngrok) em APP_BASE_URL,
 * senão o Mercado Pago não consegue chamar o webhook nem o auto_return.
 */
const BASE_URL = process.env.APP_BASE_URL || SITE_URL

export interface PreferenceResult {
  preferenceId: string
  initPoint: string
}

export async function createCheckoutPreference(order: Order): Promise<PreferenceResult> {
  const client = getMercadoPagoClient()

  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: order.productSlug,
          title: order.productName,
          description: `${order.productName} — mesa sob medida Tocks Custom`,
          category_id: 'home',
          quantity: 1,
          // Integral, em reais (BRL). É o preço "a partir de"; ajustar aqui
          // quando a customização alterar o valor final.
          unit_price: order.amount,
          currency_id: 'BRL',
        },
      ],
      payment_methods: {
        // Sem boleto e sem débito → sobra Pix + cartão de crédito.
        excluded_payment_types: [{ id: 'ticket' }, { id: 'debit_card' }],
        installments: 12, // teto de 12x no cartão
      },
      back_urls: {
        success: `${BASE_URL}/checkout/sucesso`,
        pending: `${BASE_URL}/checkout/pendente`,
        failure: `${BASE_URL}/checkout/erro`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'TOCKS CUSTOM',
      metadata: { order_id: order.id, product_slug: order.productSlug },
    },
  })

  const initPoint = preference.init_point ?? preference.sandbox_init_point
  if (!preference.id || !initPoint) {
    throw new Error('Mercado Pago não retornou init_point.')
  }

  return { preferenceId: preference.id, initPoint }
}
