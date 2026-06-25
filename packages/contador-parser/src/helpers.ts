/**
 * Helpers PUROS compartilhados pelos parsers do Motor A (NF-e/NFC-e, CT-e, NFS-e).
 *
 * Extraídos de `parser.ts` (R1) para serem reusados por `parser-cte.ts` (R4) e
 * `parser-nfse.ts` (R4) sem duplicação — mantém UMA fonte de coerção/validação.
 *
 * Constraints: sem rede, sem filesystem, sem Date.now(). XML via fast-xml-parser.
 */
import { XMLParser } from "fast-xml-parser";
import { ParseError, ParteDocumento } from "./types";

/**
 * Configuração canônica do XMLParser (idêntica para todos os DF-e).
 * `removeNSPrefix` é obrigatório: documentos que passam por ERPs/assinadores
 * chegam prefixados (ex.: <nfe:NFe>, <cte:CTe>); sem isto XML válido seria
 * rejeitado, violando G1.
 *
 * @param tagsArray nomes de tags que devem SEMPRE virar array (ex.: "det", "Comp").
 */
export function criarXmlParser(tagsArray: ReadonlySet<string>): XMLParser {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false, // valores como string; conversão numérica controlada.
    parseAttributeValue: false,
    trimValues: true,
    removeNSPrefix: true,
    isArray: (name) => tagsArray.has(name)
  });
}

/** Faz o parse bruto do XML, normalizando falhas para `ParseError` tipado. */
export function parseXmlBruto(parser: XMLParser, xml: string): Record<string, unknown> {
  if (typeof xml !== "string" || xml.trim().length === 0) {
    throw new ParseError("XML_MALFORMADO", "XML vazio ou nao textual.");
  }
  try {
    return parser.parse(xml) as Record<string, unknown>;
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    throw new ParseError("XML_MALFORMADO", `Falha ao ler o XML: ${detalhe}`);
  }
}

// ---------------------------------------------------------------------------
// Coerção / validação (puros)
// ---------------------------------------------------------------------------

export function obj(valor: unknown, caminho: string): Record<string, unknown> {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    throw new ParseError("ESTRUTURA_INVALIDA", `Bloco ${caminho} ausente ou invalido.`, caminho);
  }
  return valor as Record<string, unknown>;
}

export function asString(valor: unknown): string | undefined {
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

export function asStringObrigatorio(valor: unknown, caminho: string): string {
  const s = asString(valor);
  if (s === undefined) {
    throw new ParseError("CAMPO_OBRIGATORIO_AUSENTE", `Campo ${caminho} ausente.`, caminho);
  }
  return s;
}

export function somenteDigitos(valor: string | undefined): string | undefined {
  if (valor === undefined) {
    return undefined;
  }
  const d = valor.replace(/\D/g, "");
  return d.length > 0 ? d : undefined;
}

export function paraNumero(valor: string, caminho: string): number {
  const n = Number(valor);
  if (!Number.isFinite(n)) {
    throw new ParseError("ESTRUTURA_INVALIDA", `Campo ${caminho} nao numerico: "${valor}".`, caminho);
  }
  return n;
}

export function paraNumeroOpcional(valor: string | undefined): number | undefined {
  if (valor === undefined) {
    return undefined;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Extrai uma parte (emitente/destinatário/tomador/remetente/prestador).
 * Aceita CNPJ ou CPF; quando `obrigatorio`, exige bloco presente com ao menos
 * um identificador. Reusado por todos os DF-e.
 */
export function extrairParte(
  no: unknown,
  caminho: string,
  obrigatorio: boolean
): ParteDocumento {
  if (no === undefined || no === null) {
    if (obrigatorio) {
      throw new ParseError("CAMPO_OBRIGATORIO_AUSENTE", `Bloco ${caminho} ausente.`, caminho);
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

/**
 * Detecta presença do bloco de assinatura XMLDSig (R2 — proveniência leve).
 * Procura `Signature`/`SignedInfo` em qualquer um dos nós candidatos.
 * NÃO valida a cadeia ICP — apenas presença.
 */
export function detectarAssinatura(
  candidatos: Array<Record<string, unknown> | undefined>
): boolean {
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
        const sigObj = sig as Record<string, unknown>;
        return Object.keys(sigObj).some((k) => {
          const ln = k.includes(":") ? k.split(":").pop() : k;
          return ln === "SignedInfo";
        });
      }
    }
  }
  return false;
}
