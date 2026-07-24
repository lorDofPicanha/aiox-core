# `@synkra/contador-nfse-client`

Cliente tipado para os contratos oficiais da NFS-e Nacional/SEFIN.

## Segurança

O modo padrão é `dry-run`: nenhuma chamada de rede é feita. O modo `restricted` é destinado à produção restrita e exige um `transport` que saiba lidar com o certificado/mTLS aprovado. O modo `production` exige `environment: "production"` e `confirmProduction: true`.

```ts
import { NfseNationalClient } from "@synkra/contador-nfse-client";

const client = new NfseNationalClient({
  baseUrl: process.env.NFSE_API_URL!,
  environment: "production-restricted",
  mode: "dry-run",
  transport: certificadoTransport,
});

const resultado = await client.emitir(xmlDps);
```

O pacote cobre `POST /nfse`, consulta de NFS-e, `GET/HEAD /dps/{id}` e eventos. A assinatura XML e o transporte de certificado permanecem na fronteira `NfseTransport`, para não colocar chaves privadas no app web.

```bash
npm test --workspace @synkra/contador-nfse-client
```

Os testes são contratuais e usam transport mock; não transmitem dados ao governo.
