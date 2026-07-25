import type { Metadata } from 'next'
import { Heading } from '@/components/atoms/heading'
import { Text } from '@/components/atoms/text'
import { Button } from '@/components/atoms/button'

export const metadata: Metadata = {
  title: 'Pagamento em processamento — Tocks Custom',
  robots: { index: false },
}

export default function CheckoutPendingPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container-custom max-w-2xl text-center">
        <Text variant="label" className="mb-3">
          Pagamento em processamento
        </Text>
        <Heading as="h1" className="!text-4xl md:!text-5xl mb-6">
          Estamos confirmando
        </Heading>
        <div className="gold-separator mx-auto my-6" />
        <Text className="mb-10">
          Seu pagamento está sendo processado (Pix ou análise do cartão podem levar
          alguns minutos). Assim que for confirmado, avisaremos e daremos início ao seu projeto.
        </Text>
        <Button href="/colecao" size="lg" variant="secondary">
          Voltar à coleção
        </Button>
      </div>
    </main>
  )
}
