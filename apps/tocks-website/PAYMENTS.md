# Pagamentos — Mercado Pago (Checkout Pro)

Integração de pagamento do site Tocks Custom. **Configuração acordada (24/Jul/2026):**

- **Checkout Pro** (o comprador é redirecionado para o ambiente seguro do Mercado Pago).
- **Pagamento integral**, cartão de crédito **até 12x**.
- Métodos: **Pix + cartão de crédito** (sem boleto, sem débito).

> ⚠️ **Gate do founder:** subir para produção exige (1) credenciais de produção do MP,
> (2) revisão do fluxo e dos textos e (3) troca do store de pedidos por Supabase.
> Nada vai ao ar sem esse aval. Em dev roda 100% em **sandbox**.

---

## Arquitetura

```
Produto (/colecao/[slug])
   └─ BuyButton (client)  ──►  createCheckout (server action)
                                   ├─ cria Order (store)               ◄─ preço vem do servidor
                                   └─ createCheckoutPreference (SDK)   ──► init_point
   └─ redirect do browser ──►  Checkout Pro (Mercado Pago)
                                   └─ paga ──► back_urls (/checkout/sucesso|pendente|erro)

Mercado Pago ──► POST /api/webhooks/mercadopago
                    1. valida x-signature (HMAC)
                    2. busca o pagamento na API (não confia no corpo)
                    3. marca 'approved' só se status real == approved
                    4. idempotente (não reprocessa pedido já aprovado)
```

**Arquivos:**

| Caminho | Papel |
|---|---|
| `src/lib/mercadopago/client.ts` | Config do SDK (server-only) |
| `src/lib/mercadopago/preference.ts` | Cria a preference (12x, Pix+crédito) |
| `src/lib/mercadopago/verify-signature.ts` | Valida `x-signature` (HMAC-SHA256) |
| `src/lib/orders/{types,store}.ts` | Modelo + persistência de pedidos (dev: JSON) |
| `src/app/actions/create-checkout.ts` | Server action do botão comprar |
| `src/components/molecules/buy-button.tsx` | CTA de compra (client) |
| `src/app/api/webhooks/mercadopago/route.ts` | Webhook |
| `src/app/checkout/{sucesso,pendente,erro}/page.tsx` | Páginas de retorno |

---

## Setup em desenvolvimento (sandbox)

1. **Instalar dependências** (na raiz do monorepo ou no app):
   ```bash
   pnpm install
   ```

2. **Credenciais de TESTE** — painel do Mercado Pago > *Suas integrações* > crie/abra um app >
   *Credenciais de teste*. Copie o **Access Token** (`TEST-...`).

3. **Túnel HTTPS** (o MP precisa alcançar seu webhook e o auto_return):
   ```bash
   cloudflared tunnel --url http://localhost:3000
   # ou: ngrok http 3000
   ```
   Copie a URL pública (ex.: `https://xxxx.trycloudflare.com`).

4. **Webhook + segredo** — painel MP > *Webhooks* > configure a URL
   `https://<sua-url-tunel>/api/webhooks/mercadopago`, evento **Pagamentos**, e copie a
   **Assinatura secreta**.

5. **`.env.local`** (copie de `.env.example`):
   ```env
   MP_ACCESS_TOKEN=TEST-xxxxxxxx...
   MP_WEBHOOK_SECRET=xxxxxxxx...
   APP_BASE_URL=https://xxxx.trycloudflare.com
   ```

6. **Rodar:**
   ```bash
   pnpm dev
   ```

## Testar

- Abra um produto em `/colecao/<slug>`, clique **Comprar agora**.
- Use os [cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards)
  (ex.: aprovado use o nome do titular `APRO`; recusado `OTHE`).
- Pix de teste gera QR sandbox — o pagamento fica `pending` até simular a aprovação.
- Confira o `.data/orders.json` e os logs `[webhook]` no terminal.

## Ir para produção (checklist)

- [ ] Trocar `FileOrderStore` por Supabase (`src/lib/orders/store.ts` — schema no topo do arquivo).
- [ ] Credenciais de **produção** (`APP_USR-...`) em `MP_ACCESS_TOKEN` + `MP_WEBHOOK_SECRET` de produção.
- [ ] `APP_BASE_URL=https://tockscustom.com.br` (ou remover e deixar cair no `SITE_URL`).
- [ ] Implementar o side-effect de `approved` no webhook (avisar atelier/CRM) — a IA **não**
      envia mensagem ao cliente sozinha.
- [ ] Ajustar `unit_price` se a customização alterar o preço final (hoje usa o "a partir de").
- [ ] Revisão do founder no fluxo e nos textos.
