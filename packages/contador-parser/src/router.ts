/**
 * Roteador de insumo XML (R4) — identifica o tipo de DF-e e despacha para o
 * parser certo. Ponto de entrada único da camada de ingestão.
 *
 *  - NF-e / NFC-e (mod. 55/65)  -> parseNFe          -> DocumentoFiscal
 *  - CT-e         (mod. 57)     -> parseCTe          -> DocumentoTransporte
 *  - NFS-e Nacional (CGNFS-e)   -> parseNFSeNacional -> DocumentoServico
 *
 * A identificação é estrutural (elemento-raiz / wrapper de processamento), sem
 * precisar parsear o documento inteiro duas vezes. Tipo não suportado -> erro
 * tipado `TIPO_NAO_SUPORTADO` (G1).
 */
import { criarXmlParser, parseXmlBruto } from "./helpers";
import { parseCTe } from "./parser-cte";
import { parseNFe } from "./parser";
import { parseNFSeNacional } from "./parser-nfse";
import {
  DocumentoFiscal,
  DocumentoServico,
  DocumentoTransporte,
  ParseError,
  TipoInsumoFiscal
} from "./types";

/** União discriminada da saída do roteador (campo `tipo`). */
export type DocumentoReconhecido =
  | DocumentoFiscal
  | DocumentoTransporte
  | DocumentoServico;

// Parser leve só para farejar o elemento-raiz (não materializa itens).
const sniffer = criarXmlParser(new Set());

/**
 * Detecta o tipo de insumo fiscal a partir da raiz do XML.
 * @throws {ParseError} XML_MALFORMADO se ilegível; TIPO_NAO_SUPORTADO se a raiz
 *         não corresponder a nenhum DF-e suportado.
 */
export function detectarTipoInsumo(xml: string): TipoInsumoFiscal {
  const raiz = parseXmlBruto(sniffer, xml);

  if (temNo(raiz, ["nfeProc", "NFe"])) {
    return "mercadoria";
  }
  if (temNo(raiz, ["cteProc", "CTe"])) {
    return "transporte";
  }
  if (temNo(raiz, ["NFSe", "infNFSe", "DPS", "infDPS"])) {
    return "servico";
  }

  const raizes = Object.keys(raiz).filter((k) => k !== "?xml");
  throw new ParseError(
    "TIPO_NAO_SUPORTADO",
    `Tipo de documento nao suportado (raiz: ${raizes.join(", ") || "vazia"}). ` +
      "Suportados: NF-e/NFC-e (55/65), CT-e (57), NFS-e Nacional.",
    raizes[0]
  );
}

/**
 * Parseia QUALQUER DF-e suportado, despachando pelo tipo detectado.
 * Retorna uma união discriminada por `tipo` (mercadoria/transporte/servico).
 *
 * Nota: NF-e/NFC-e (`DocumentoFiscal`) não carrega o discriminador `tipo` por
 * compatibilidade com o contrato R1 existente; identifique-a por exclusão ou
 * pelo campo `modelo` ("55"/"65"). CT-e e NFS-e têm `tipo` literal.
 */
export function parseDocumentoFiscal(xml: string): DocumentoReconhecido {
  const tipo = detectarTipoInsumo(xml);
  switch (tipo) {
    case "mercadoria":
      return parseNFe(xml);
    case "transporte":
      return parseCTe(xml);
    case "servico":
      return parseNFSeNacional(xml);
  }
}

function temNo(raiz: Record<string, unknown>, nomes: string[]): boolean {
  return nomes.some((n) => raiz[n] !== undefined && raiz[n] !== null);
}
