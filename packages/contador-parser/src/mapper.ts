/**
 * R3 — Mapper XML -> entidades de apuração.
 *
 * Converte o `DocumentoFiscal` parseado (Motor A) em itens compatíveis com o
 * contrato do motor de classificação (`ItemFiscal` de @synkra/contador-motor-fiscal),
 * preservando os campos extras (PIS/COFINS + proveniência) numa EXTENSÃO TIPADA
 * para a Recuperação identificar o monofásico.
 *
 * O contrato base do motor é replicado aqui (estruturalmente) para não criar
 * dependência de build entre pacotes; `ItemFiscalRecuperacao` é atribuível a
 * `ItemFiscal` por subtipagem estrutural — pode ser passado direto a
 * `classificarLote` sem adaptação.
 */
import { DocumentoFiscal, ItemDocumento, TributoPisCofins } from "./types";

/**
 * Contrato base aceito pelo motor de classificação.
 * Espelha `ItemFiscal` de @synkra/contador-motor-fiscal (subtipagem estrutural).
 */
export interface ItemFiscal {
  id: string;
  descricao: string;
  ncm?: string;
  cfop?: string;
  cst?: string;
  cclasstribInformado?: string;
  valor: number;
}

/**
 * CSTs de PIS/COFINS que indicam tributação MONOFÁSICA / por substituição,
 * onde o revendedor pode ter crédito/recuperação a apurar.
 * 04 = monofásica (alíquota zero na revenda); 05 = ST; 06 = alíquota zero.
 * Fonte: tabela CST PIS/COFINS (doc 09 §2.2).
 */
const CST_MONOFASICO = new Set(["04", "05", "06"]);

/** Proveniência do item (classe de insumo — base do moat / trilha de boa-fé). */
export interface Proveniencia {
  /** Classe da evidência: XML estruturado vs documento extraído (OCR). */
  classeInsumo: "xml" | "documento_extraido";
  /** Chave de acesso do documento de origem (44 díg). */
  chaveAcesso: string;
  /** XML traz assinatura XMLDSig (presença, não validação ICP). */
  assinado: boolean;
}

/** Bloco de tributo monofásico preservado para a Recuperação. */
export interface TributoMonofasico {
  pis: TributoPisCofins;
  cofins: TributoPisCofins;
  /** true se CST PIS ou COFINS indica monofásico/ST/alíq. zero. */
  ehMonofasico: boolean;
}

/**
 * Item fiscal estendido — compatível com `ItemFiscal` do motor (subtipagem),
 * com campos extras para a Recuperação e a trilha de proveniência.
 */
export interface ItemFiscalRecuperacao extends ItemFiscal {
  recuperacao: TributoMonofasico;
  proveniencia: Proveniencia;
  cest?: string;
}

/**
 * Mapeia um documento fiscal parseado para itens de apuração.
 * O `id` é determinístico: `{chaveAcesso}-{nItem}` (rastreável à trilha).
 */
export function paraItensFiscais(doc: DocumentoFiscal): ItemFiscalRecuperacao[] {
  return doc.itens.map((item) => mapearItem(doc, item));
}

function mapearItem(doc: DocumentoFiscal, item: ItemDocumento): ItemFiscalRecuperacao {
  const ehMonofasico =
    (item.pis.cst !== undefined && CST_MONOFASICO.has(item.pis.cst)) ||
    (item.cofins.cst !== undefined && CST_MONOFASICO.has(item.cofins.cst));

  return {
    id: `${doc.chaveAcesso}-${item.numeroItem}`,
    descricao: item.descricao,
    ...(item.ncm ? { ncm: item.ncm } : {}),
    ...(item.cfop ? { cfop: item.cfop } : {}),
    // CST relevante para a classificação ICMS (CST ou CSOSN no Simples).
    ...(item.icms.cst ? { cst: item.icms.cst } : {}),
    ...(item.cClassTrib ? { cclasstribInformado: item.cClassTrib } : {}),
    valor: item.valorProduto,
    ...(item.cest ? { cest: item.cest } : {}),
    recuperacao: {
      pis: item.pis,
      cofins: item.cofins,
      ehMonofasico
    },
    proveniencia: {
      classeInsumo: "xml",
      chaveAcesso: doc.chaveAcesso,
      assinado: doc.temAssinatura
    }
  };
}
