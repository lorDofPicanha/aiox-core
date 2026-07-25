/**
 * Webhook do Mercado Pago (Checkout Pro).
 *
 * Fluxo à prova de fraude (padrão 2026):
 *   1. Valida o header `x-signature` (HMAC-SHA256) — sem isto qualquer um forja "aprovado".
 *   2. Busca o pagamento na API (NUNCA confia no corpo da notificação).
 *   3. Só marca `approved` se o status real do pagamento for "approved".
 *   4. Idempotente — pedido já aprovado não reprocessa (webhooks repetem).
 *
 * ⚠️ A concessão/side-effect (avisar o atelier, e-mail) fica marcada como TODO.
 *    A IA NUNCA envia mensagem ao cliente sozinha — gate do founder.
 */

import { Payment } from 'mercadopago'
import { getMercadoPagoClient } from '@/lib/mercadopago/client'
import { verifyWebhookSignature } from '@/lib/mercadopago/verify-signature'
import { getOrderStore } from '@/lib/orders/store'
import type { OrderStatus } from '@/lib/orders/types'

function mapPaymentStatus(mpStatus: string | undefined): OrderStatus {
  switch (mpStatus) {
    case 'approved':
      return 'approved'
    case 'rejected':
      return 'rejected'
    case 'cancelled':
    case 'refunded':
    case 'charged_back':
      return 'cancelled'
    default:
      return 'pending'
  }
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url)

  // Ler o corpo uma única vez (evita "body already read").
  const rawBody = await request.text()
  let body: { type?: string; data?: { id?: string } } | null = null
  try {
    body = rawBody ? JSON.parse(rawBody) : null
  } catch {
    body = null
  }

  const dataId =
    url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? body?.data?.id ?? null

  // 1) validar assinatura
  const validSignature = verifyWebhookSignature({
    xSignature: request.headers.get('x-signature'),
    xRequestId: request.headers.get('x-request-id'),
    dataId,
    secret: process.env.MP_WEBHOOK_SECRET,
  })
  if (!validSignature) {
    return new Response('invalid signature', { status: 401 })
  }

  // Só tratamos notificações de pagamento.
  const type = url.searchParams.get('type') ?? url.searchParams.get('topic') ?? body?.type
  if (type && type !== 'payment') {
    return new Response(null, { status: 200 })
  }
  if (!dataId) {
    return new Response(null, { status: 200 })
  }

  try {
    // 2) buscar o pagamento real na API
    const payment = await new Payment(getMercadoPagoClient()).get({ id: dataId })
    const orderId = payment.external_reference
    if (!orderId) {
      return new Response(null, { status: 200 })
    }

    const store = getOrderStore()
    const order = await store.getById(orderId)
    if (!order) {
      return new Response(null, { status: 200 })
    }

    // 4) idempotência
    if (order.status === 'approved') {
      return new Response(null, { status: 200 })
    }

    // 3) mapear e persistir status real
    const status = mapPaymentStatus(payment.status)
    await store.updateStatus(orderId, status, String(payment.id))

    if (status === 'approved') {
      // TODO(founder gate): notificar atelier / CRM / e-mail interno.
      // IA nunca dispara mensagem ao cliente automaticamente.
      console.info(`[webhook] pedido ${orderId} APROVADO (payment ${payment.id})`)
    }

    return new Response(null, { status: 200 })
  } catch (err) {
    console.error('[webhook] erro ao processar pagamento:', err)
    // 500 → Mercado Pago reenvia (backoff). Erros transitórios não perdem a baixa.
    return new Response('processing error', { status: 500 })
  }
}
