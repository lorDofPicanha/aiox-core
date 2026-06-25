/**
 * Motor A (R4) — parser determinístico de CT-e (Conhecimento de Transporte
 * eletrônico, modelo 57; MOC CT-e / XSD SVRS).
 *
 * CT-e é o documento do FRETE — relevante para crédito de transporte. Difere
 * estruturalmente da NF-e: não tem itens com NCM/CFOP por produto; tem UM serviço
 * (vTPrest) e o ICMS no NÍVEL DO DOCUMENTO. Por isso entrega `DocumentoTransporte`
 * (tipo próprio), não `DocumentoFiscal` (FF-1: não forçar semântica falsa).
 *
 * R2/G1 idênticos à NF-e: assinatura detectada (sem validar ICP), erros tipados.
 * Reusa os helpers de coerção de `./helpers`.
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
  paraNumeroOpcionalEstrito
} from "./helpers";
import {
  DocumentoTransporte,
  ParseError,
  TributoIcmsTransporte
} from "./types";

const parser = criarXmlParser(new Set());

/**
 * Parseia um CT-e (modelo 57) e retorna o documento de transporte normalizado.
 * @throws {ParseError} para XML malformado, estrutura inválida, campo obrigatório
 *         ausente, modelo diferente de 57 ou chave de acesso inválida.
 */
export function parseCTe(xml: string): DocumentoTransporte {
  const raiz = parseXmlBruto(parser, xml);

  const infCte = localizarInfCte(raiz);

  const ide = obj(infCte.ide, "ide");
  validarModeloCte(asString(ide.mod), "ide/mod");

  const chaveAcesso = extrairChaveAcessoCte(infCte);

  const serie = asStringObrigatorio(ide.serie, "ide/serie");
  const numero = asStringObrigatorio(ide.nCT, "ide/nCT");
  const dataEmissao = asStringObrigatorio(ide.dhEmi, "ide/dhEmi");

  // Partes: emitente (transportadora) obrigatório; tomador/rem/dest conforme o
  // tipo de tomador. Não-obrigatórios são extraídos quando presentes.
  const emitente = extrairParte(infCte.emit, "emit", true);
  const remetente = extrairParte(infCte.rem, "rem", false);
  const destinatario = extrairParte(infCte.dest, "dest", false);
  const tomador = extrairTomador(infCte, remetente, destinatario);

  const valorTotalPrestacao = extrairValorPrestacao(infCte);
  const icms = extrairIcmsCte(infCte);

  const temAssinatura = detectarAssinaturaCte(raiz, infCte);

  return {
    tipo: "transporte",
    chaveAcesso,
    modelo: "57",
    serie,
    numero,
    dataEmissao,
    emitente,
    tomador,
    remetente,
    destinatario,
    valorTotalPrestacao,
    icms,
    temAssinatura
  };
}

// ---------------------------------------------------------------------------
// Localização de nós
// ---------------------------------------------------------------------------

/** Encontra infCte sob CTe (com ou sem wrapper cteProc). */
function localizarInfCte(raiz: Record<string, unknown>): Record<string, unknown> {
  const proc = raiz.cteProc as Record<string, unknown> | undefined;
  const cteContainer = (proc?.CTe ?? raiz.CTe) as Record<string, unknown> | undefined;

  if (!cteContainer) {
    throw new ParseError(
      "ESTRUTURA_INVALIDA",
      "Elemento CTe nao encontrado (esperado CTe ou cteProc/CTe).",
      "CTe"
    );
  }

  const infCte = cteContainer.infCte as Record<string, unknown> | undefined;
  if (!infCte || typeof infCte !== "object") {
    throw new ParseError(
      "ESTRUTURA_INVALIDA",
      "Elemento infCte ausente ou invalido.",
      "infCte"
    );
  }
  return infCte;
}

/** Extrai e valida a chave de acesso (infCte/@Id sem prefixo "CTe", 44 dígitos). */
function extrairChaveAcessoCte(infCte: Record<string, unknown>): string {
  const id = asString(infCte["@_Id"]);
  if (!id) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Atributo infCte/@Id (chave de acesso) ausente.",
      "infCte/@Id"
    );
  }
  const chave = id.replace(/^CTe/i, "").replace(/\D/g, "");
  if (chave.length !== 44) {
    throw new ParseError(
      "CHAVE_ACESSO_INVALIDA",
      `Chave de acesso deve ter 44 digitos, encontrado ${chave.length}.`,
      "infCte/@Id"
    );
  }
  return chave;
}

function validarModeloCte(valor: string | undefined, caminho: string): void {
  if (valor === undefined) {
    throw new ParseError("CAMPO_OBRIGATORIO_AUSENTE", `Campo ${caminho} ausente.`, caminho);
  }
  if (valor !== "57") {
    throw new ParseError(
      "MODELO_NAO_SUPORTADO",
      `Modelo ${valor} nao suportado por parseCTe (apenas 57 CT-e).`,
      caminho
    );
  }
}

/**
 * Tomador do serviço. No CT-e o tomador costuma ser indicado por `ide/toma3/toma`
 * (0=Remetente,1=Expedidor,2=Recebedor,3=Destinatário) ou pelo grupo `ide/toma4`
 * (terceiro, com CNPJ/CPF próprio). Resolve o tomador para crédito do frete.
 */
function extrairTomador(
  infCte: Record<string, unknown>,
  remetente: ReturnType<typeof extrairParte>,
  destinatario: ReturnType<typeof extrairParte>
): ReturnType<typeof extrairParte> {
  const ide = infCte.ide as Record<string, unknown> | undefined;

  // toma4: tomador é um terceiro, com identificação própria.
  const toma4 = ide?.toma4 as Record<string, unknown> | undefined;
  if (toma4) {
    return extrairParte(toma4, "ide/toma4", false);
  }

  // toma3/toma: índice que aponta para uma das partes já extraídas.
  const toma3 = ide?.toma3 as Record<string, unknown> | undefined;
  const indice = asString(toma3?.toma);
  switch (indice) {
    case "0": // remetente
      return remetente;
    case "3": // destinatário
      return destinatario;
    default:
      // Expedidor (1) / Recebedor (2) não são modelados como partes próprias
      // neste contrato mínimo; retorna vazio (rastreável via remetente/dest).
      return {};
  }
}

function extrairValorPrestacao(infCte: Record<string, unknown>): number {
  const vPrest = infCte.vPrest as Record<string, unknown> | undefined;
  const vTPrest = asString(vPrest?.vTPrest);
  if (vTPrest === undefined) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "vPrest/vTPrest (valor total da prestacao) ausente.",
      "vPrest/vTPrest"
    );
  }
  return paraNumero(vTPrest, "vPrest/vTPrest");
}

/**
 * ICMS do CT-e: `imp/ICMS/<subgrupo>` (ICMS00, ICMS20, ICMSSN, ICMSOutraUF...).
 * No CT-e o ICMS é do documento (não por item). CSOSN sinaliza Simples Nacional.
 */
function extrairIcmsCte(infCte: Record<string, unknown>): TributoIcmsTransporte {
  const imp = infCte.imp as Record<string, unknown> | undefined;
  const icmsNode = imp?.ICMS;
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
  const baseCalculo = paraNumeroOpcionalEstrito(asString(grupo.vBC), "ICMS/vBC");
  const aliquota = paraNumeroOpcionalEstrito(asString(grupo.pICMS), "ICMS/pICMS");
  const valor = paraNumeroOpcionalEstrito(asString(grupo.vICMS), "ICMS/vICMS");
  return {
    ...(origem ? { origem } : {}),
    ...(csosn ?? cst ? { cst: csosn ?? cst } : {}),
    simplesNacional: csosn !== undefined,
    ...(baseCalculo !== undefined ? { baseCalculo } : {}),
    ...(aliquota !== undefined ? { aliquota } : {}),
    ...(valor !== undefined ? { valor } : {})
  };
}

function detectarAssinaturaCte(
  raiz: Record<string, unknown>,
  infCte: Record<string, unknown>
): boolean {
  const proc = raiz.cteProc as Record<string, unknown> | undefined;
  const cteContainer = (proc?.CTe ?? raiz.CTe) as Record<string, unknown> | undefined;
  return detectarAssinatura([cteContainer, proc, raiz, infCte]);
}
