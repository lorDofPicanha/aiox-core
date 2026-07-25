import type { Metadata } from 'next'
import { Heading } from '@/components/atoms/heading'
import { Text } from '@/components/atoms/text'
import { Button } from '@/components/atoms/button'

export const metadata: Metadata = {
  title: 'Pagamento confirmado — Tocks Custom',
  robots: { index: false },
}

export default function CheckoutSuccessPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container-custom max-w-2xl text-center">
        <Text variant="label" className="mb-3">
          Pagamento confirmado
        </Text>
        <Heading as="h1" className="!text-4xl md:!text-5xl mb-6">
          Recebemos seu pedido
        </Heading>
        <div className="gold-separator mx-auto my-6" />
        <Text className="mb-10">
          Obrigado. Seu pagamento foi aprovado e nosso atelier já foi avisado. Em breve
          entramos em contato para alinhar os detalhes da sua mesa sob medida.
        </Text>
        <Button href="/colecao" size="lg" variant="secondary">
          Voltar à coleção
        </Button>
      </div>
    </main>
  )
}
