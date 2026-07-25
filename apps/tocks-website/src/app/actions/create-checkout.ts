'use server'

/**
 * Server Action — inicia o checkout (Mercado Pago Checkout Pro).
 *
 * Recebe APENAS o slug do produto. O preço é resolvido no servidor a partir
 * de PRODUCTS — NUNCA confiar em valor vindo do client.
 * Retorna o `initPoint` para o Client Component redirecionar o comprador.
 */

import { getProductBySlug } from '@/data/products'
import { getOrderStore } from '@/lib/orders/store'
import { createCheckoutPreference } from '@/lib/mercadopago/preference'

export interface CheckoutResult {
  ok: boolean
  initPoint?: string
  error?: string
}

export async function createCheckout(productSlug: string): Promise<CheckoutResult> {
  const product = getProductBySlug(productSlug)
  if (!product) {
    return { ok: false, error: 'Produto não encontrado.' }
  }

  try {
    const store = getOrderStore()
    const order = await store.create({
      productSlug: product.slug,
      productName: product.name,
      amount: product.price, // integral — preço do servidor
    })

    const { preferenceId, initPoint } = await createCheckoutPreference(order)
    await store.setPreference(order.id, preferenceId)

    return { ok: true, initPoint }
  } catch (err) {
    console.error('[checkout] falha ao criar preference:', err)
    return { ok: false, error: 'Não foi possível iniciar o pagamento. Tente novamente.' }
  }
}
