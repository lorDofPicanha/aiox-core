/**
 * Motor A — parser determinístico de NF-e / NFC-e (layout 4.00).
 *
 * R1: parseia o XML e extrai os campos-chave (doc 09 §2.2).
 * R2: detecta presença de assinatura XMLDSig (proveniência leve).
 * G1: rejeita XML malformado ou sem campos obrigatórios com `ParseError` tipado.
 *
 * Constraints: pacote PURO — sem rede, sem efeitos colaterais, sem Date.now()
 * embutido em lógica. NÃO parsear XML com regex: usa fast-xml-parser.
 *
 * Helpers de coerção/validação são compartilhados em `./helpers` (reusados por
 * CT-e e NFS-e no R4).
 */
import {
  asString,
  asStringObrigatorio,
  criarXmlParser,
  detectarAssinatura,
  extrairParte,
  obj,
  parseXmlBruto,
  paraNumero,
  paraNumeroOpcionalEstrito,
  somenteDigitos
} from "./helpers";
import {
  DocumentoFiscal,
  ItemDocumento,
  ModeloDocumento,
  ParseError,
  TributoIcms,
  TributoPisCofins
} from "./types";

// Garante que o grupo de itens (det) seja SEMPRE array, mesmo com 1 item.
const parser = criarXmlParser(new Set(["det"]));

/**
 * Parseia uma NF-e ou NFC-e (layout 4.00) e retorna o documento normalizado.
 * @throws {ParseError} para XML malformado, estrutura inválida, campo obrigatório
 *         ausente, modelo não suportado ou chave de acesso inválida.
 */
export function parseNFe(xml: string): DocumentoFiscal {
  const raiz = parseXmlBruto(parser, xml);

  const infNFe = localizarInfNFe(raiz);

  const ide = obj(infNFe.ide, "ide");
  const modelo = normalizarModelo(asString(ide.mod), "ide/mod");

  const chaveAcesso = extrairChaveAcesso(infNFe);

  const serie = asStringObrigatorio(ide.serie, "ide/serie");
  const numero = asStringObrigatorio(ide.nNF, "ide/nNF");
  const dataEmissao = asStringObrigatorio(ide.dhEmi, "ide/dhEmi");

  const emitente = extrairParte(infNFe.emit, "emit", true);
  const destinatario = extrairParte(infNFe.dest, "dest", false);

  const valorTotal = extrairValorTotal(infNFe);

  const itens = extrairItens(infNFe);

  const temAssinatura = detectarAssinaturaNFe(raiz, infNFe);

  return {
    chaveAcesso,
    modelo,
    serie,
    numero,
    dataEmissao,
    emitente,
    destinatario,
    valorTotal,
    itens,
    temAssinatura
  };
}

// ---------------------------------------------------------------------------
// Localização de nós
// ---------------------------------------------------------------------------

/** Encontra infNFe sob NFe (com ou sem wrapper nfeProc). */
function localizarInfNFe(raiz: Record<string, unknown>): Record<string, unknown> {
  const proc = raiz.nfeProc as Record<string, unknown> | undefined;
  const nfeContainer = (proc?.NFe ?? raiz.NFe) as Record<string, unknown> | undefined;

  if (!nfeContainer) {
    throw new ParseError(
      "ESTRUTURA_INVALIDA",
      "Elemento NFe nao encontrado (esperado NFe ou nfeProc/NFe).",
      "NFe"
    );
  }

  const infNFe = nfeContainer.infNFe as Record<string, unknown> | undefined;
  if (!infNFe || typeof infNFe !== "object") {
    throw new ParseError(
      "ESTRUTURA_INVALIDA",
      "Elemento infNFe ausente ou invalido.",
      "infNFe"
    );
  }
  return infNFe;
}

/** Extrai e valida a chave de acesso (infNFe/@Id sem prefixo "NFe", 44 dígitos). */
function extrairChaveAcesso(infNFe: Record<string, unknown>): string {
  const id = asString(infNFe["@_Id"]);
  if (!id) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Atributo infNFe/@Id (chave de acesso) ausente.",
      "infNFe/@Id"
    );
  }
  const chave = id.replace(/^NFe/i, "").replace(/\D/g, "");
  if (chave.length !== 44) {
    throw new ParseError(
      "CHAVE_ACESSO_INVALIDA",
      `Chave de acesso deve ter 44 digitos, encontrado ${chave.length}.`,
      "infNFe/@Id"
    );
  }
  return chave;
}

function extrairValorTotal(infNFe: Record<string, unknown>): number {
  const total = infNFe.total as Record<string, unknown> | undefined;
  const icmsTot = total?.ICMSTot as Record<string, unknown> | undefined;
  const vNF = asString(icmsTot?.vNF);
  if (vNF === undefined) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "total/ICMSTot/vNF ausente.",
      "total/ICMSTot/vNF"
    );
  }
  return paraNumero(vNF, "total/ICMSTot/vNF");
}

function extrairItens(infNFe: Record<string, unknown>): ItemDocumento[] {
  const dets = infNFe.det as unknown;
  if (!Array.isArray(dets) || dets.length === 0) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Nenhum item (det) encontrado no documento.",
      "det"
    );
  }
  return dets.map((det, indice) => extrairItem(det, indice));
}

function extrairItem(det: unknown, indice: number): ItemDocumento {
  const detObj = obj(det, `det[${indice}]`);
  const numeroItem = parseInt(asString(detObj["@_nItem"]) ?? String(indice + 1), 10);

  const prod = obj(detObj.prod, `det[${indice}]/prod`);
  const codigoProduto = asStringObrigatorio(prod.cProd, `det[${indice}]/prod/cProd`);
  const descricao = asStringObrigatorio(prod.xProd, `det[${indice}]/prod/xProd`);
  const ncm = somenteDigitos(asString(prod.NCM));
  const cest = somenteDigitos(asString(prod.CEST));
  const cfop = asString(prod.CFOP);
  const valorProduto = paraNumero(
    asStringObrigatorio(prod.vProd, `det[${indice}]/prod/vProd`),
    `det[${indice}]/prod/vProd`
  );

  const imposto = obj(detObj.imposto, `det[${indice}]/imposto`);
  const icms = extrairIcms(imposto.ICMS);
  const pis = extrairPisCofins(imposto.PIS);
  const cofins = extrairPisCofins(imposto.COFINS);

  const cClassTrib = asString(prod.cClassTrib) ?? asString(imposto.cClassTrib);

  return {
    numeroItem,
    codigoProduto,
    descricao,
    ...(ncm ? { ncm } : {}),
    ...(cest ? { cest } : {}),
    ...(cfop ? { cfop } : {}),
    valorProduto,
    icms,
    pis,
    cofins,
    ...(cClassTrib ? { cClassTrib } : {})
  };
}

/**
 * ICMS vem encapsulado em um subgrupo variável (ICMS00, ICMS40, ICMSSN102...).
 * Pegamos o primeiro subgrupo presente. CSOSN sinaliza Simples Nacional.
 */
function extrairIcms(icmsNode: unknown): TributoIcms {
  if (!icmsNode || typeof icmsNode !== "object") {
    return { simplesNacional: false };
  }
  const grupos = icmsNode as Record<string, unknown>;
  const primeiroNome = Object.keys(grupos)[0];
  const grupo = primeiroNome ? (grupos[primeiroNome] as Record<string, unknown>) : undefined;
  if (!grupo) {
    return { simplesNacional: false };
  }
  const origem = asString(grupo.orig);
  const csosn = asString(grupo.CSOSN);
  const cst = asString(grupo.CST);
  return {
    ...(origem ? { origem } : {}),
    ...(csosn ?? cst ? { cst: csosn ?? cst } : {}),
    simplesNacional: csosn !== undefined
  };
}

/** PIS/COFINS também são encapsulados em subgrupos (PISAliq, PISNT, PISOutr...). */
function extrairPisCofins(node: unknown): TributoPisCofins {
  if (!node || typeof node !== "object") {
    return {};
  }
  const grupos = node as Record<string, unknown>;
  const primeiroNome = Object.keys(grupos)[0];
  const grupo = primeiroNome ? (grupos[primeiroNome] as Record<string, unknown>) : undefined;
  if (!grupo) {
    return {};
  }
  const cst = asString(grupo.CST);
  // QA 🔴-A: estrito — tributo presente porém ilegível é CORRUPÇÃO, não ausência.
  // Deixá-lo virar undefined faz o crédito (vPIS+vCOFINS) evaporar silenciosamente
  // no caminho da Recuperação monofásica. Mesma guarda já aplicada em NFS-e/CT-e.
  const baseCalculo = paraNumeroOpcionalEstrito(asString(grupo.vBC), "PISCOFINS/vBC");
  // pPIS/pCOFINS quando aliquota; qPIS/vAliqProd em casos de aliquota por quantidade.
  const aliquota = paraNumeroOpcionalEstrito(
    asString(grupo.pPIS) ?? asString(grupo.pCOFINS),
    "PISCOFINS/pPIS_pCOFINS"
  );
  const valor = paraNumeroOpcionalEstrito(
    asString(grupo.vPIS) ?? asString(grupo.vCOFINS),
    "PISCOFINS/vPIS_vCOFINS"
  );
  return {
    ...(cst ? { cst } : {}),
    ...(baseCalculo !== undefined ? { baseCalculo } : {}),
    ...(aliquota !== undefined ? { aliquota } : {}),
    ...(valor !== undefined ? { valor } : {})
  };
}

/**
 * R2 — proveniência leve: detecta o bloco de assinatura XMLDSig.
 * Procura Signature/SignedInfo sob NFe ou na raiz (com ou sem prefixo de namespace).
 * NÃO valida a cadeia ICP — apenas presença.
 */
function detectarAssinaturaNFe(
  raiz: Record<string, unknown>,
  infNFe: Record<string, unknown>
): boolean {
  const proc = raiz.nfeProc as Record<string, unknown> | undefined;
  const nfeContainer = (proc?.NFe ?? raiz.NFe) as Record<string, unknown> | undefined;
  return detectarAssinatura([nfeContainer, proc, raiz, infNFe]);
}

function normalizarModelo(valor: string | undefined, caminho: string): ModeloDocumento {
  if (valor === undefined) {
    throw new ParseError("CAMPO_OBRIGATORIO_AUSENTE", `Campo ${caminho} ausente.`, caminho);
  }
  if (valor === "55" || valor === "65") {
    return valor;
  }
  throw new ParseError(
    "MODELO_NAO_SUPORTADO",
    `Modelo ${valor} nao suportado por parseNFe (apenas 55 NF-e e 65 NFC-e).`,
    caminho
  );
}
