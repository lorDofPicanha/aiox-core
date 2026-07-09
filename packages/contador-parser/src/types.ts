/**
 * Tipos do Motor A — parser determinístico de XML fiscal (NF-e / NFC-e).
 *
 * Contrato da camada de ingestão (FF-1 / bounded context): o parser entrega
 * ENTIDADES TIPADAS para o core; não vaza dialeto de fornecedor nem o XML cru.
 *
 * Referências: doc 09 §2.2 (campos-chave) e §2.3 (validação de schema).
 */

/** Modelo do documento fiscal eletrônico de MERCADORIA (NF-e/NFC-e). */
export type ModeloDocumento =
  | "55" // NF-e
  | "65"; // NFC-e

/**
 * Tipo do insumo fiscal reconhecido pelo roteador (R4).
 * Distingue os três contratos de saída do parser — cada um tem semântica
 * própria e NÃO é forçado num molde comum (FF-1 / bounded context):
 *  - "mercadoria" -> {@link DocumentoFiscal} (NF-e mod. 55 / NFC-e mod. 65, tem itens com NCM)
 *  - "transporte" -> {@link DocumentoTransporte} (CT-e mod. 57, serviço de frete; ICMS no nível do doc)
 *  - "servico"    -> {@link DocumentoServico} (NFS-e Nacional, serviço com grupos IBS/CBS)
 */
export type TipoInsumoFiscal = "mercadoria" | "transporte" | "servico";

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

/** Tributo ICMS (subconjunto relevante para classificação + valores destacados). */
export interface TributoIcms {
  /** Origem da mercadoria (orig). */
  origem?: string;
  /** CST (regime normal) ou CSOSN (Simples Nacional). */
  cst?: string;
  /** true quando o código veio de CSOSN (Simples), não de CST. */
  simplesNacional: boolean;
  /** Base de cálculo do ICMS (vBC), quando destacada (🟡-C). */
  baseCalculo?: number;
  /** Alíquota do ICMS (pICMS), quando destacada (🟡-C). */
  aliquota?: number;
  /** Valor do ICMS (vICMS), quando destacado (🟡-C). */
  valor?: number;
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

/**
 * Tributo IBS/CBS de um item de serviço (Reforma Tributária, LC 214/2025).
 * Introduzido pela NFS-e Nacional NT 007/2026 (grupo `IBSCBS`). É o diferencial
 * tempestivo: a Auditoria da Reforma fica cega em serviços sem estes campos.
 * Subgrupos federais (CBS) e do ente subnacional (IBS — UF + Município).
 */
export interface TributoIbsCbs {
  /** Classificação tributária da Reforma (cClassTrib) — base da Auditoria. */
  cClassTrib?: string;
  /** Código de Situação Tributária do IBS/CBS (CST), quando informado. */
  cst?: string;
  /** Base de cálculo do IBS/CBS (gIBSCBS/vBC). */
  baseCalculo?: number;
  /** Alíquota da CBS (federal). */
  aliquotaCbs?: number;
  /** Valor da CBS (gCBS/vCBS). */
  valorCbs?: number;
  /** Alíquota do IBS (UF + Município somadas, quando informado). */
  aliquotaIbs?: number;
  /** Valor do IBS (gIBSUF/vIBSUF + gIBSMun/vIBSMun, ou gIBS único). */
  valorIbs?: number;
  /**
   * Sinaliza que o IBS não pôde ser determinado: há tributação CBS mas nenhum
   * layout conhecido de IBS foi lido (split UF/Mun nem gIBS único), OU o CST
   * indica tributação integral e o IBS veio ausente/zerado. NÃO é "IBS zero" —
   * é "IBS indeterminado", e a auditoria deve mandar para revisão humana em vez
   * de tratar como ausência (trilha de boa-fé). Ver QA 🔴-2 / 🟡-B.
   */
  ibsIndeterminado?: boolean;
  /**
   * Simétrico do `ibsIndeterminado` para a CBS federal (🟡-B): há IBS mas a CBS
   * não foi lida de nenhum layout conhecido, OU o CST indica tributação integral
   * e a CBS veio ausente/zerada. Nunca reportar CBS-zero mudo sob CST tributado.
   */
  cbsIndeterminado?: boolean;
}

/**
 * Documento de transporte parseado — CT-e modelo 57 (`parseCTe`).
 *
 * TIPO PRÓPRIO (não `DocumentoFiscal`): o CT-e não tem itens com NCM/CFOP por
 * produto; tem UM serviço de transporte (vTPrest) e ICMS no nível do documento.
 * Forçá-lo em `DocumentoFiscal.itens[]` com NCM vazaria semântica falsa (FF-1).
 * Reaproveita `ParteDocumento`, `TributoIcms` e os helpers de coerção.
 */
export interface DocumentoTransporte {
  /** Discriminador do tipo de insumo (= "transporte"). */
  tipo: "transporte";
  /** Chave de acesso do CT-e, 44 dígitos (infCte/@Id sem prefixo "CTe"). */
  chaveAcesso: string;
  /** Modelo do documento (sempre "57" para CT-e). */
  modelo: "57";
  /** Série (ide/serie). */
  serie: string;
  /** Número do documento (ide/nCT). */
  numero: string;
  /** Data/hora de emissão (ide/dhEmi), como string ISO original do XML. */
  dataEmissao: string;
  /** Emitente do CT-e (transportadora). */
  emitente: ParteDocumento;
  /** Tomador do serviço de transporte (quem paga o frete; gancho de crédito). */
  tomador: ParteDocumento;
  /** Remetente da carga (rem), quando informado. */
  remetente: ParteDocumento;
  /** Destinatário da carga, quando informado. */
  destinatario: ParteDocumento;
  /** Valor total da prestação do serviço de transporte (vPrest/vTPrest). */
  valorTotalPrestacao: number;
  /** ICMS do CT-e (no nível do documento — CST/CSOSN, base, alíquota, valor). */
  icms: TributoIcmsTransporte;
  /** Proveniência leve (R2): presença do bloco XMLDSig. NÃO valida cadeia ICP. */
  temAssinatura: boolean;
}

/**
 * ICMS do CT-e. Desde o 🟡-C, `TributoIcms` já carrega base/alíquota/valor
 * (a NF-e de mercadoria também os extrai) — o alias permanece pela semântica
 * do CT-e (ICMS no nível do documento, não por item) e por compatibilidade.
 */
export type TributoIcmsTransporte = TributoIcms;

/**
 * Item de serviço de uma NFS-e Nacional já normalizado.
 * Diferente de `ItemDocumento`: serviço NÃO tem NCM — usa códigos de tributação
 * nacional/municipal — e carrega o grupo IBS/CBS da Reforma.
 */
export interface ItemServico {
  /** Descrição do serviço prestado (serv/xDescServ ou cServ/xDescServ). */
  descricao: string;
  /** Código de tributação NACIONAL do serviço (cTribNac / cServ). */
  codigoTributacaoNacional?: string;
  /** Código de tributação MUNICIPAL do serviço (cTribMun), quando informado. */
  codigoTributacaoMunicipal?: string;
  /** Valor do serviço (valores/vServ ou vServPrest/vServ). */
  valorServico: number;
  /** PIS retido sobre o serviço (corrigido pela NT 007/2026). */
  pis: TributoPisCofins;
  /** COFINS retido sobre o serviço (corrigido pela NT 007/2026). */
  cofins: TributoPisCofins;
  /** Grupo IBS/CBS da Reforma (NT 007/2026), quando presente. */
  ibsCbs?: TributoIbsCbs;
}

/**
 * Documento de serviço parseado — NFS-e Nacional (`parseNFSeNacional`),
 * leiaute do CGNFS-e (NT 007/2026).
 *
 * TIPO PRÓPRIO (não `DocumentoFiscal`): serviço não tem itens com NCM; o tributo
 * relevante é o grupo IBS/CBS + PIS/COFINS retido, não ICMS. Reaproveita
 * `ParteDocumento`, `TributoPisCofins` e os helpers de coerção.
 */
export interface DocumentoServico {
  /** Discriminador do tipo de insumo (= "servico"). */
  tipo: "servico";
  /** Chave de acesso da NFS-e Nacional, 50 dígitos (infNFSe/@Id / chNFSe). */
  chaveAcesso: string;
  /** Modelo lógico (NFS-e Nacional não usa "mod"; fixamos "NFSe"). */
  modelo: "NFSe";
  /** Número da NFS-e (infNFSe/nNFSe). */
  numero: string;
  /** Data/hora de emissão (infNFSe/dhProc ou DPS/infDPS/dhEmi). */
  dataEmissao: string;
  /** Prestador do serviço (emitente). */
  prestador: ParteDocumento;
  /** Tomador do serviço (destinatário). */
  tomador: ParteDocumento;
  /** Valor total do serviço (vServ). */
  valorServico: number;
  /** Itens de serviço (NFS-e Nacional normalmente tem 1; modelado como lista). */
  itens: ItemServico[];
  /** Proveniência leve (R2): presença do bloco XMLDSig. NÃO valida cadeia ICP. */
  temAssinatura: boolean;
}

/** Códigos de erro do parser (tipados, nunca silenciosos). */
export type CodigoParseError =
  | "XML_MALFORMADO"
  | "ESTRUTURA_INVALIDA"
  | "CAMPO_OBRIGATORIO_AUSENTE"
  | "MODELO_NAO_SUPORTADO"
  | "TIPO_NAO_SUPORTADO"
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
