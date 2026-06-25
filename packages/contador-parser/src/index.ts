/**
 * @synkra/contador-parser — Motor A (parser determinístico de XML fiscal).
 *
 * Camada de ingestão do reconhecimento (doc 59, R1–R4). Entrega entidades
 * tipadas ao core; não vaza dialeto de fornecedor; sem rede/efeitos colaterais.
 *
 *  - R1: parseNFe(xml) -> DocumentoFiscal (NF-e mod. 55 / NFC-e mod. 65, 4.00)
 *  - R2: temAssinatura (proveniência leve, sem validação ICP)
 *  - R3: paraItensFiscais(doc) -> ItemFiscalRecuperacao[] (contrato do motor)
 *  - R4: parseCTe (CT-e mod. 57) + parseNFSeNacional (NFS-e Nacional, IBS/CBS) +
 *        roteador parseDocumentoFiscal(xml) que despacha pelo tipo detectado
 *  - G1: ParseError tipado para XML inválido / campo obrigatório ausente / tipo
 *        ou modelo não suportado
 */

// Parsers
export { parseNFe } from "./parser";
export { parseCTe } from "./parser-cte";
export { parseNFSeNacional } from "./parser-nfse";

// Roteador (R4)
export {
  parseDocumentoFiscal,
  detectarTipoInsumo
} from "./router";
export type { DocumentoReconhecido } from "./router";

// Mappers -> contrato do motor
export {
  paraItensFiscais,
  paraItensFiscaisCTe,
  paraItensFiscaisNFSe
} from "./mapper";
export type {
  ItemFiscal,
  ItemFiscalRecuperacao,
  Proveniencia,
  TributoMonofasico
} from "./mapper";

// Tipos de entidade
export type {
  DocumentoFiscal,
  DocumentoTransporte,
  DocumentoServico,
  ItemDocumento,
  ItemServico,
  ParteDocumento,
  ModeloDocumento,
  TipoInsumoFiscal,
  TributoIcms,
  TributoIcmsTransporte,
  TributoPisCofins,
  TributoIbsCbs,
  CodigoParseError
} from "./types";
export { ParseError } from "./types";
