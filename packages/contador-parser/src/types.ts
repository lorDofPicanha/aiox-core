/**
 * Tipos do Motor A — parser determinístico de XML fiscal (NF-e / NFC-e).
 *
 * Contrato da camada de ingestão (FF-1 / bounded context): o parser entrega
 * ENTIDADES TIPADAS para o core; não vaza dialeto de fornecedor nem o XML cru.
 *
 * Referências: doc 09 §2.2 (campos-chave) e §2.3 (validação de schema).
 */

/** Modelo do documento fiscal eletrônico. */
export type ModeloDocumento =
  | "55" // NF-e
  | "65"; // NFC-e

/**
 * Tributos PIS/COFINS de um item — gancho da Recuperação (monofásico).
 * CST PIS/COFINS 04/05/06 (e correlatos) sinalizam tributação monofásica:
 * o adquirente revendedor pode ter crédito/recuperação a apurar.
 */
export interface TributoPisCofins {
  /** CST do PIS (ex.: "01", "04", "06"). */
  cst?: string;
  /** Base de cálculo. */
  baseCalculo?: number;
  /** Alíquota percentual (pPIS / pCOFINS). */
  aliquota?: number;
  /** Valor do tributo (vPIS / vCOFINS). */
  valor?: number;
}

/** Tributo ICMS (subconjunto relevante para classificação). */
export interface TributoIcms {
  /** Origem da mercadoria (orig). */
  origem?: string;
  /** CST (regime normal) ou CSOSN (Simples Nacional). */
  cst?: string;
  /** true quando o código veio de CSOSN (Simples), não de CST. */
  simplesNacional: boolean;
}

/** Item (det) do documento fiscal já normalizado. */
export interface ItemDocumento {
  /** Número do item na nota (det/@nItem). */
  numeroItem: number;
  /** Código do produto (prod/cProd). */
  codigoProduto: string;
  /** Descrição (prod/xProd). */
  descricao: string;
  /** NCM (prod/NCM). */
  ncm?: string;
  /** CEST (prod/CEST), quando informado. */
  cest?: string;
  /** CFOP (prod/CFOP). */
  cfop?: string;
  /** Valor do produto (prod/vProd). */
  valorProduto: number;
  /** ICMS do item. */
  icms: TributoIcms;
  /** PIS do item. */
  pis: TributoPisCofins;
  /** COFINS do item. */
  cofins: TributoPisCofins;
  /** cClassTrib informado (grupos IBS/CBS, NT 2025/2026), quando presente. */
  cClassTrib?: string;
}

/** Identificação de uma parte (emitente / destinatário). */
export interface ParteDocumento {
  /** CNPJ (apenas dígitos) — pode estar ausente em consumidor final NFC-e. */
  cnpj?: string;
  /** CPF (apenas dígitos), quando aplicável (destinatário pessoa física). */
  cpf?: string;
  /** Nome / razão social (xNome). */
  nome?: string;
}

/**
 * Documento fiscal parseado (saída de `parseNFe`).
 * Identidade rastreável (chave de acesso) + partes + itens + totais.
 */
export interface DocumentoFiscal {
  /** Chave de acesso, 44 dígitos (infNFe/@Id sem prefixo "NFe"). */
  chaveAcesso: string;
  /** Modelo: "55" (NF-e) ou "65" (NFC-e). */
  modelo: ModeloDocumento;
  /** Série (ide/serie). */
  serie: string;
  /** Número do documento (ide/nNF). */
  numero: string;
  /** Data/hora de emissão (ide/dhEmi), como string ISO original do XML. */
  dataEmissao: string;
  /** Emitente. */
  emitente: ParteDocumento;
  /** Destinatário (pode ser ausente/anônimo em NFC-e). */
  destinatario: ParteDocumento;
  /** Valor total da NF (total/ICMSTot/vNF). */
  valorTotal: number;
  /** Itens da nota. */
  itens: ItemDocumento[];
  /**
   * Proveniência leve (R2): presença do bloco de assinatura XMLDSig.
   * NÃO valida a cadeia ICP-Brasil ainda (story futura) — apenas detecta.
   */
  temAssinatura: boolean;
}

/** Códigos de erro do parser (tipados, nunca silenciosos). */
export type CodigoParseError =
  | "XML_MALFORMADO"
  | "ESTRUTURA_INVALIDA"
  | "CAMPO_OBRIGATORIO_AUSENTE"
  | "MODELO_NAO_SUPORTADO"
  | "CHAVE_ACESSO_INVALIDA";

/**
 * Erro tipado de parsing / validação de schema (G1).
 * `campo` aponta o campo faltante/ inválido quando aplicável.
 */
export class ParseError extends Error {
  readonly codigo: CodigoParseError;
  readonly campo?: string;

  constructor(codigo: CodigoParseError, message: string, campo?: string) {
    super(message);
    this.name = "ParseError";
    this.codigo = codigo;
    this.campo = campo;
    // Mantém a cadeia de protótipo correta sob target CommonJS.
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}
