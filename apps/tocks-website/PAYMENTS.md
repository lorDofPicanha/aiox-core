# Pagamentos — PagBank / PagSeguro Checkout

Integração sandbox da Tocks com checkout hospedado pelo PagBank.

- Pagamento integral por Pix ou cartão de crédito, até 12 parcelas.
- Preço e produto são resolvidos no servidor.
- O cliente é redirecionado ao ambiente seguro do PagBank.

## Arquitetura

```text
BuyButton -> Server Action -> POST /checkouts -> URL PAY
PagBank -> POST /api/webhooks/pagbank -> valida assinatura SHA-256
                                      -> consulta checkout -> aprova somente PAID
```

O arquivo `.data/orders.json` é exclusivo de desenvolvimento. Produção exige
Supabase, homologação PagBank, credenciais de produção e aprovação do founder.

## Sandbox

Configure `.env.local` com:

```env
PAGBANK_ACCESS_TOKEN=
PAGBANK_WEBHOOK_TOKEN=
APP_BASE_URL=https://seu-tunel-publico.example
```

`PAGBANK_WEBHOOK_TOKEN` é o token da conta usado para validar o header
`x-authenticity-token` contra o corpo bruto. Nenhum segredo é enviado ao cliente.

Antes de produção, valide as dimensões e pesos de embalagem do catálogo, exponha
um webhook HTTPS público e execute os testes de pagamento do PagBank.
