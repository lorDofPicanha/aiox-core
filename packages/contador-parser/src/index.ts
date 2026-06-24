/**
 * @synkra/contador-parser — Motor A (parser determinístico de XML fiscal).
 *
 * Camada de ingestão do reconhecimento (doc 59, R1/R2/R3). Entrega entidades
 * tipadas ao core; não vaza dialeto de fornecedor; sem rede/efeitos colaterais.
 *
 *  - R1: parseNFe(xml) -> DocumentoFiscal (NF-e mod. 55 / NFC-e mod. 65, 4.00)
 *  - R2: DocumentoFiscal.temAssinatura (proveniência leve, sem validação ICP)
 *  - R3: paraItensFiscais(doc) -> ItemFiscalRecuperacao[] (contrato do motor)
 *  - G1: ParseError tipado para XML inválido / campo obrigatório ausente
 */
export { parseNFe } from "./parser";
export { paraItensFiscais } from "./mapper";
export type {
  ItemFiscal,
  ItemFiscalRecuperacao,
  Proveniencia,
  TributoMonofasico
} from "./mapper";
export type {
  DocumentoFiscal,
  ItemDocumento,
  ParteDocumento,
  ModeloDocumento,
  TributoIcms,
  TributoPisCofins,
  CodigoParseError
} from "./types";
export { ParseError } from "./types";
