import type { Metadata } from 'next'
import { Heading } from '@/components/atoms/heading'
import { Text } from '@/components/atoms/text'
import { Button } from '@/components/atoms/button'
import { WHATSAPP_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Pagamento não concluído — Tocks Custom',
  robots: { index: false },
}

export default function CheckoutErrorPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container-custom max-w-2xl text-center">
        <Text variant="label" className="mb-3">
          Pagamento não concluído
        </Text>
        <Heading as="h1" className="!text-4xl md:!text-5xl mb-6">
          Algo não saiu como esperado
        </Heading>
        <div className="gold-separator mx-auto my-6" />
        <Text className="mb-10">
          Não conseguimos concluir seu pagamento. Nenhum valor foi cobrado. Você pode tentar
          novamente ou falar direto com nosso atelier pelo WhatsApp.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/colecao" size="lg" variant="secondary">
            Voltar à coleção
          </Button>
          <Button href={WHATSAPP_URL} size="lg" external>
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </main>
  )
}
