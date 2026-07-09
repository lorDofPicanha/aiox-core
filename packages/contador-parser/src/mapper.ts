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
import {
  DocumentoFiscal,
  DocumentoServico,
  DocumentoTransporte,
  ItemDocumento,
  ItemServico,
  TributoIcms,
  TributoPisCofins
} from "./types";

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
  /**
   * ICMS extraído do documento (🟡-D): na NF-e é o do item; no CT-e é o do
   * documento (frete). Portador do crédito de ICMS-frete e da conferência
   * valor-declarado × valor-esperado. Ausente em serviço (NFS-e não tem ICMS).
   */
  icms?: TributoIcms;
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
    // 🟡-D: ICMS do item preservado (base/alíquota/valor quando destacados).
    icms: item.icms,
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

// ---------------------------------------------------------------------------
// R4 — Mappers de CT-e e NFS-e Nacional para o contrato do motor.
//
// Onde a semântica casa (valor + tributos + proveniência) mapeamos; onde NÃO
// casa, deixamos EXPLÍCITO e não forçamos (FF-1):
//  - CT-e (frete) e NFS-e (serviço) NÃO têm NCM -> campo `ncm` fica ausente.
//  - o monofásico (NCM + CST PIS/COFINS) é conceito de MERCADORIA; para serviço
//    `recuperacao.ehMonofasico` é sempre false (não se aplica), mas PIS/COFINS
//    retido é preservado para a apuração.
// ---------------------------------------------------------------------------

/**
 * Mapeia um CT-e (frete) para UM `ItemFiscalRecuperacao`.
 * Sem NCM (transporte não tem); o CST relevante é o do ICMS do documento.
 * Não há tributação monofásica de PIS/COFINS por item -> ehMonofasico=false.
 * 🟡-D: o ICMS do frete (base/alíquota/valor) sobrevive ao mapper — é o
 * portador do crédito de ICMS-frete na trilha.
 */
export function paraItensFiscaisCTe(doc: DocumentoTransporte): ItemFiscalRecuperacao[] {
  const pisVazio: TributoPisCofins = {};
  const cofinsVazio: TributoPisCofins = {};
  return [
    {
      id: `${doc.chaveAcesso}-1`,
      descricao: "SERVICO DE TRANSPORTE (CT-e)",
      // ncm ausente: frete não tem NCM (semântica não casa — não forçar).
      ...(doc.icms.cst ? { cst: doc.icms.cst } : {}),
      valor: doc.valorTotalPrestacao,
      icms: doc.icms,
      recuperacao: {
        pis: pisVazio,
        cofins: cofinsVazio,
        ehMonofasico: false
      },
      proveniencia: {
        classeInsumo: "xml",
        chaveAcesso: doc.chaveAcesso,
        assinado: doc.temAssinatura
      }
    }
  ];
}

/**
 * Mapeia os itens de serviço de uma NFS-e Nacional para `ItemFiscalRecuperacao[]`.
 * Sem NCM (serviço não tem); o `cClassTrib` do grupo IBS/CBS vira
 * `cclasstribInformado` (base da Auditoria da Reforma). PIS/COFINS RETIDO é
 * preservado em `recuperacao` para a apuração; monofásico não se aplica a serviço
 * -> ehMonofasico=false.
 */
export function paraItensFiscaisNFSe(doc: DocumentoServico): ItemFiscalRecuperacao[] {
  return doc.itens.map((item, indice) => mapearItemServico(doc, item, indice));
}

function mapearItemServico(
  doc: DocumentoServico,
  item: ItemServico,
  indice: number
): ItemFiscalRecuperacao {
  const cclasstrib = item.ibsCbs?.cClassTrib;
  // CST aqui é o da Reforma (IBS/CBS), quando informado.
  const cst = item.ibsCbs?.cst;
  return {
    id: `${doc.chaveAcesso}-${indice + 1}`,
    descricao: item.descricao,
    // ncm ausente: serviço usa código de tributação nacional/municipal, não NCM.
    ...(cst ? { cst } : {}),
    ...(cclasstrib ? { cclasstribInformado: cclasstrib } : {}),
    valor: item.valorServico,
    recuperacao: {
      pis: item.pis,
      cofins: item.cofins,
      ehMonofasico: false
    },
    proveniencia: {
      classeInsumo: "xml",
      chaveAcesso: doc.chaveAcesso,
      assinado: doc.temAssinatura
    }
  };
}
