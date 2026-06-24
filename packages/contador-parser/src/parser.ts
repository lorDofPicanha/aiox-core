/**
 * Motor A — parser determinístico de NF-e / NFC-e (layout 4.00).
 *
 * R1: parseia o XML e extrai os campos-chave (doc 09 §2.2).
 * R2: detecta presença de assinatura XMLDSig (proveniência leve).
 * G1: rejeita XML malformado ou sem campos obrigatórios com `ParseError` tipado.
 *
 * Constraints: pacote PURO — sem rede, sem efeitos colaterais, sem Date.now()
 * embutido em lógica. NÃO parsear XML com regex: usa fast-xml-parser.
 */
import { XMLParser } from "fast-xml-parser";
import {
  DocumentoFiscal,
  ItemDocumento,
  ModeloDocumento,
  ParseError,
  ParteDocumento,
  TributoIcms,
  TributoPisCofins
} from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false, // mantém valores como string; conversão numérica controlada por nós.
  parseAttributeValue: false,
  trimValues: true,
  // Remove prefixo de namespace (ex.: <nfe:NFe> -> NFe). NF-e/NFC-e válidas que passam
  // por ERPs/assinadores frequentemente chegam prefixadas; sem isto o XML válido seria
  // rejeitado, violando o gate G1 (QA 24/Jun, finding 🔴-1).
  removeNSPrefix: true,
  // Garante que o grupo de itens (det) seja SEMPRE array, mesmo com 1 item.
  isArray: (name) => name === "det"
});

/**
 * Parseia uma NF-e ou NFC-e (layout 4.00) e retorna o documento normalizado.
 * @throws {ParseError} para XML malformado, estrutura inválida, campo obrigatório
 *         ausente, modelo não suportado ou chave de acesso inválida.
 */
export function parseNFe(xml: string): DocumentoFiscal {
  if (typeof xml !== "string" || xml.trim().length === 0) {
    throw new ParseError("XML_MALFORMADO", "XML vazio ou nao textual.");
  }

  let raiz: Record<string, unknown>;
  try {
    raiz = parser.parse(xml) as Record<string, unknown>;
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    throw new ParseError("XML_MALFORMADO", `Falha ao ler o XML: ${detalhe}`);
  }

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

  const temAssinatura = detectarAssinatura(raiz, infNFe);

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

function extrairParte(
  no: unknown,
  caminho: string,
  obrigatorio: boolean
): ParteDocumento {
  if (no === undefined || no === null) {
    if (obrigatorio) {
      throw new ParseError(
        "CAMPO_OBRIGATORIO_AUSENTE",
        `Bloco ${caminho} ausente.`,
        caminho
      );
    }
    return {};
  }
  const parte = obj(no, caminho);
  const cnpj = somenteDigitos(asString(parte.CNPJ));
  const cpf = somenteDigitos(asString(parte.CPF));
  const nome = asString(parte.xNome);

  if (obrigatorio && !cnpj && !cpf) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      `${caminho} sem CNPJ nem CPF.`,
      `${caminho}/CNPJ`
    );
  }

  return {
    ...(cnpj ? { cnpj } : {}),
    ...(cpf ? { cpf } : {}),
    ...(nome ? { nome } : {})
  };
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
  const baseCalculo = paraNumeroOpcional(asString(grupo.vBC));
  // pPIS/pCOFINS quando aliquota; qPIS/vAliqProd em casos de aliquota por quantidade.
  const aliquota = paraNumeroOpcional(asString(grupo.pPIS) ?? asString(grupo.pCOFINS));
  const valor = paraNumeroOpcional(asString(grupo.vPIS) ?? asString(grupo.vCOFINS));
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
function detectarAssinatura(
  raiz: Record<string, unknown>,
  infNFe: Record<string, unknown>
): boolean {
  const proc = raiz.nfeProc as Record<string, unknown> | undefined;
  const nfeContainer = (proc?.NFe ?? raiz.NFe) as Record<string, unknown> | undefined;
  const candidatos: Array<Record<string, unknown> | undefined> = [
    nfeContainer,
    proc,
    raiz,
    infNFe
  ];
  for (const candidato of candidatos) {
    if (candidato && contemAssinatura(candidato)) {
      return true;
    }
  }
  return false;
}

function contemAssinatura(no: Record<string, unknown>): boolean {
  for (const chave of Object.keys(no)) {
    const local = chave.includes(":") ? chave.split(":").pop() : chave;
    if (local === "Signature") {
      const sig = no[chave];
      if (sig && typeof sig === "object") {
        // Confirma SignedInfo dentro para reduzir falso-positivo.
        const sigObj = sig as Record<string, unknown>;
        const temSignedInfo = Object.keys(sigObj).some((k) => {
          const ln = k.includes(":") ? k.split(":").pop() : k;
          return ln === "SignedInfo";
        });
        return temSignedInfo;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Helpers de coerção/validação (puros)
// ---------------------------------------------------------------------------

function obj(valor: unknown, caminho: string): Record<string, unknown> {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    throw new ParseError("ESTRUTURA_INVALIDA", `Bloco ${caminho} ausente ou invalido.`, caminho);
  }
  return valor as Record<string, unknown>;
}

function asString(valor: unknown): string | undefined {
  if (valor === undefined || valor === null) {
    return undefined;
  }
  if (typeof valor === "string") {
    const t = valor.trim();
    return t.length > 0 ? t : undefined;
  }
  if (typeof valor === "number" || typeof valor === "boolean") {
    return String(valor);
  }
  return undefined;
}

function asStringObrigatorio(valor: unknown, caminho: string): string {
  const s = asString(valor);
  if (s === undefined) {
    throw new ParseError("CAMPO_OBRIGATORIO_AUSENTE", `Campo ${caminho} ausente.`, caminho);
  }
  return s;
}

function somenteDigitos(valor: string | undefined): string | undefined {
  if (valor === undefined) {
    return undefined;
  }
  const d = valor.replace(/\D/g, "");
  return d.length > 0 ? d : undefined;
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
    `Modelo ${valor} nao suportado (apenas 55 NF-e e 65 NFC-e).`,
    caminho
  );
}

function paraNumero(valor: string, caminho: string): number {
  const n = Number(valor);
  if (!Number.isFinite(n)) {
    throw new ParseError("ESTRUTURA_INVALIDA", `Campo ${caminho} nao numerico: "${valor}".`, caminho);
  }
  return n;
}

function paraNumeroOpcional(valor: string | undefined): number | undefined {
  if (valor === undefined) {
    return undefined;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : undefined;
}
