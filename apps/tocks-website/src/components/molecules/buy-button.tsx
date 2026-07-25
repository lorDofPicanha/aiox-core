'use client'

/**
 * BuyButton — CTA de compra (Checkout Pro).
 *
 * Chama a server action createCheckout e redireciona para o init_point do
 * Mercado Pago. Estilo = variante "primary" (gold sólido) do átomo Button,
 * com estado de loading/erro que o átomo não cobre.
 */

import { useState, useTransition } from 'react'
import { createCheckout } from '@/app/actions/create-checkout'

interface BuyButtonProps {
  productSlug: string
  label?: string
}

export function BuyButton({ productSlug, label = 'Comprar agora' }: BuyButtonProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckout(productSlug)
      if (result.ok && result.initPoint) {
        window.location.href = result.initPoint
      } else {
        setError(result.error ?? 'Erro ao iniciar o pagamento.')
      }
    })
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full inline-flex items-center justify-center font-display font-medium uppercase tracking-[0.1em] rounded-[4px] bg-[var(--accent-gold)] text-[var(--background)] px-8 py-4 text-sm transition-all duration-300 cursor-pointer hover:bg-[var(--accent-gold-hover)] active:bg-[var(--accent-gold-deep)] disabled:opacity-50 disabled:cursor-wait"
      >
        {pending ? 'Redirecionando…' : label}
      </button>
      {error && (
        <p role="alert" aria-live="polite" className="mt-2 font-body text-sm text-[var(--accent-gold-hover)]">
          {error}
        </p>
      )}
    </div>
  )
}
