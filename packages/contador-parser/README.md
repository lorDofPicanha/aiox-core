# Contador Parser — Motor A (XML fiscal determinístico)

Parser determinístico de NF-e (mod. 55) e NFC-e (mod. 65), layout 4.00.
Camada de ingestão do reconhecimento (doc 59). Destrava Auditoria e Recuperação
com dado REAL (sai do seed sintético).

Cobre as stories:

- **R1** — `parseNFe(xml)` → `DocumentoFiscal`: extrai chave de acesso (44 díg),
  modelo, série/número, dhEmi, emitente/destinatário, vNF e, por item (`det`),
  NCM/CEST/CFOP/CST(ou CSOSN)/vProd + tributos PIS/COFINS (CST, vBC, alíquota,
  valor) e `cClassTrib` quando presente.
- **R2** — proveniência leve: `DocumentoFiscal.temAssinatura` detecta o bloco
  XMLDSig (`Signature`/`SignedInfo`). NÃO valida a cadeia ICP-Brasil (story futura).
- **R3** — `paraItensFiscais(doc)` → `ItemFiscalRecuperacao[]`: mapeia para o
  contrato do motor (`@synkra/contador-motor-fiscal` `ItemFiscal`) por subtipagem
  estrutural, preservando PIS/COFINS e marcando `recuperacao.ehMonofasico`
  (CST PIS/COFINS 04/05/06) para a Recuperação.
- **G1** — validação de schema: XML malformado ou sem campo obrigatório é
  rejeitado com `ParseError` tipado (`codigo` + `campo`), nunca silenciosamente.

## Regras (constraints)

- TypeScript estrito. Pacote **PURO**: sem rede, sem filesystem em `src/`,
  sem `Date.now()` na lógica.
- XML parseado com `fast-xml-parser` (não regex).
- Bounded context (FF-1): entrega entidades tipadas; não vaza dialeto de
  fornecedor nem o XML cru; não exporta dado para fora.
- Fora de escopo (follow-up): CT-e/MDF-e/NFS-e (R4), Document AI/OCR (R5+),
  validação da cadeia ICP da assinatura.

## Comandos

```powershell
npm test --workspace @synkra/contador-parser
npm run typecheck --workspace @synkra/contador-parser
```

## Uso

```ts
import { parseNFe, paraItensFiscais } from "@synkra/contador-parser";
import { classificarLote } from "@synkra/contador-motor-fiscal";

const doc = parseNFe(xmlString);          // R1 + R2
const itens = paraItensFiscais(doc);      // R3 → ItemFiscal compatível
const apontamentos = classificarLote(itens, base, contexto); // alimenta Auditoria
```

Fixtures sintéticos em `src/__fixtures__/` (NF-e 55, NFC-e 65, item monofásico,
NF-e com namespace prefixado, inválido sem chave, malformado).

## Limitações conhecidas / follow-ups (gate QA 24/Jun — doc 59)

- **🔴 Precisão monetária:** valores monetários são `number`. Para um campo isolado é
  fiel, mas **somatórios a jusante** (materialidade do laudo, total de crédito) sofrem
  erro de ponto flutuante. Antes de escalar a Recuperação: somar com arredondamento a
  2 casas (ou migrar campos monetários para centavos-inteiros/`string`).
- **🟡 Monofásico por quantidade:** o parser lê PIS/COFINS ad valorem (`pPIS`/`pCOFINS`).
  Combustível e afins usam alíquota **por quantidade** (`qBCProd`/`vAliqProd`) — ainda
  não extraídos. Necessário para calcular o crédito recuperável real desses itens.
- **🟡 Unicidade de `id`:** o `id` do item (`{chave}-{nItem}`) assume `nItem` único.
  Validar/garantir unicidade para preservar a rastreabilidade (G5).
- **🟡 Validação XSD oficial:** G1 hoje valida o schema-de-domínio (campos §2.2 + rejeição
  tipada), não o XSD oficial do Portal NF-e. Hardening em R4/produção.
- **type-fence:** o `ItemFiscal` é replicado estruturalmente (desacopla build). Adicionar
  um teste compile-time que atribua `ItemFiscalRecuperacao` ao `ItemFiscal` real para
  pegar divergência de contrato futura.
