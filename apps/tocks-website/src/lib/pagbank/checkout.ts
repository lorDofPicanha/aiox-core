import { SITE_URL } from '@/lib/constants'
import { pagBankFetch } from './client'
import type { Product } from '@/data/products'
import type { Order } from '@/lib/orders/types'

const BASE_URL = process.env.APP_BASE_URL || SITE_URL

interface CheckoutResponse {
  id?: string
  links?: Array<{ rel?: string; href?: string }>
  payments?: Array<{ id?: string; status?: string }>
  charges?: Array<{ id?: string; status?: string }>
}

function toCents(amount: number): number {
  const cents = Math.round(amount * 100)
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('Valor do pedido inválido.')
  return cents
}

function dimensions(specification: string): { length: number; width: number; height: number } {
  const values = specification.match(/[\d.]+/g)?.map(Number)
  if (!values || values.length !== 3 || values.some((value) => !Number.isFinite(value))) throw new Error('Dimensões inválidas.')
  const [length, width, height] = values.map((value) => Math.round(value * 100))
  return { length, width, height }
}

async function readCheckout(response: Response): Promise<CheckoutResponse> {
  const body = (await response.json()) as CheckoutResponse
  if (!response.ok) throw new Error('PagBank recusou a solicitação.')
  return body
}

export async function createPagBankCheckout(order: Order, product: Product): Promise<{ checkoutId: string; checkoutUrl: string }> {
  const response = await pagBankFetch('/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference_id: order.id,
      items: [{ reference_id: product.id, name: product.name, quantity: 1, unit_amount: toCents(order.amount), dimensions: dimensions(product.specs.dimensions), weight: Number.parseInt(product.specs.weight, 10) }],
      payment_methods: [{ type: 'PIX' }, { type: 'CREDIT_CARD' }],
      payment_methods_configs: [{ type: 'CREDIT_CARD', config_options: [{ option: 'INSTALLMENTS_LIMIT', value: '12' }] }],
      redirect_url: `${BASE_URL}/checkout/sucesso`,
      return_url: `${BASE_URL}/checkout/pendente`,
      payment_notification_urls: [`${BASE_URL}/api/webhooks/pagbank`],
      soft_descriptor: 'TOCKS CUSTOM',
    }),
  })
  const checkout = await readCheckout(response)
  const checkoutUrl = checkout.links?.find((link) => link.rel === 'PAY')?.href
  if (!checkout.id || !checkoutUrl) throw new Error('PagBank não retornou checkout válido.')
  return { checkoutId: checkout.id, checkoutUrl }
}

export async function getPagBankCheckoutPayments(checkoutId: string): Promise<Array<{ id: string; status: string }>> {
  const checkout = await readCheckout(await pagBankFetch(`/checkouts/${encodeURIComponent(checkoutId)}`, { method: 'GET' }))
  return [...(checkout.payments ?? []), ...(checkout.charges ?? [])].flatMap((payment) =>
    typeof payment.id === 'string' && typeof payment.status === 'string' ? [{ id: payment.id, status: payment.status }] : [],
  )
}

export const __testables__ = { toCents, dimensions }
