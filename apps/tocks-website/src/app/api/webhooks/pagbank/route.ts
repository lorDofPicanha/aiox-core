import { getOrderStore } from '@/lib/orders/store'
import { getPagBankCheckoutPayments } from '@/lib/pagbank/checkout'
import { verifyPagBankAuthenticity } from '@/lib/pagbank/verify-authenticity'

interface PagBankWebhook {
  reference_id?: string
}

/** Verifica a assinatura e confirma o pagamento consultando a API do PagBank. */
export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text()
  if (!verifyPagBankAuthenticity({
    rawBody,
    receivedToken: request.headers.get('x-authenticity-token'),
    accountToken: process.env.PAGBANK_WEBHOOK_TOKEN,
  })) {
    return new Response('invalid authenticity token', { status: 401 })
  }

  let body: PagBankWebhook
  try {
    body = JSON.parse(rawBody) as PagBankWebhook
  } catch {
    return new Response('invalid payload', { status: 400 })
  }
  if (!body.reference_id) return new Response(null, { status: 200 })

  try {
    const store = getOrderStore()
    const order = await store.getById(body.reference_id)
    if (!order?.checkoutId || order.status === 'approved') return new Response(null, { status: 200 })

    const payment = (await getPagBankCheckoutPayments(order.checkoutId)).find((item) => item.status === 'PAID')
    if (!payment) return new Response(null, { status: 200 })

    await store.updateStatus(order.id, 'approved', payment.id)
    // Gate do founder: não enviar mensagens nem acionar sistemas externos aqui.
    console.info(`[pagbank webhook] pedido ${order.id} APROVADO (payment ${payment.id})`)
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('[pagbank webhook] erro ao processar pagamento:', error)
    return new Response('processing error', { status: 500 })
  }
}
