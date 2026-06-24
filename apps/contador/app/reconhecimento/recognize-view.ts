/**
 * View-model do Reconhecimento (módulo #5 — pipeline REAL end-to-end).
 *
 * Tipos PUROS, sem `server-only` nem imports de pacote: podem cruzar a fronteira
 * Server Action -> Client Component (são o payload serializável que volta do
 * servidor). O parsing/classificação rodam SÓ no servidor (recognize.ts +
 * actions.ts) — LGPD: o XML fiscal cru não é enviado nem re-processado no browser.
 *
 * G6 (CONTEXT §5 #4; doc 45 §5): nada aqui é "crédito garantido" nem "apuração
 * correta". Apontamento = INDÍCIO; baixa confiança = revisar antes de aprovar;
 * decisão e assinatura são humanas (contador com CRC). A captura automática de
 * documentos é Fase B — aqui é motor real sobre AMOSTRA.
 */

/** Banda de confiança calibrada (espelha BandaConfianca do motor). */
export type BandaConfiancaView = "alta" | "media" | "baixa";

/** Tipo de divergência (espelha TipoDivergencia do motor, subconjunto exibido). */
export type TipoDivergenciaView = string;

/** Classe de insumo / proveniência (base do moat + trilha de boa-fé). */
export interface ProvenienciaView {
  /** "xml" = evidência estruturada e assinada (forte); "documento_extraido" = OCR (mais fraca). */
  classeInsumo: "xml" | "documento_extraido";
  /** Chave de acesso (44 díg) do documento de origem. */
  chaveAcesso: string;
  /** XML traz bloco de assinatura XMLDSig (presença, NÃO validação ICP-Brasil). */
  assinado: boolean;
}

/** Cabeçalho do documento fiscal parseado (o que o usuário confere primeiro). */
export interface DocumentoView {
  chaveAcesso: string;
  modelo: "55" | "65";
  modeloRotulo: string;
  serie: string;
  numero: string;
  dataEmissao: string;
  emitenteNome: string;
  emitenteDoc: string | null;
  destinatarioNome: string;
  destinatarioDoc: string | null;
  valorTotal: number;
  qtdItens: number;
  temAssinatura: boolean;
}

/** Linha de item parseado (NCM/CFOP/CST PIS-COFINS/vProd). */
export interface ItemView {
  id: string;
  numero: number;
  descricao: string;
  ncm: string | null;
  cfop: string | null;
  cstIcms: string | null;
  cstPis: string | null;
  cstCofins: string | null;
  valor: number;
}

/** Contribuição explícita de cada fator à confiança (A3 — explicabilidade). */
export interface FatorView {
  rotulo: string;
  valor: number;
  /** Texto curto explicando o sinal do fator (por que sobe/desce). */
  explica: string;
}

/** Apontamento do motor (indício) — o coração da prova. */
export interface ApontamentoView {
  itemId: string;
  itemDescricao: string;
  tipoDivergencia: TipoDivergenciaView;
  tipoDivergenciaRotulo: string;
  /** "cClassTrib divergente" vs "crédito potencial monofásico" — origem do indício. */
  origem: "classificacao" | "monofasico";
  cclasstribReferencia: string;
  descricao: string;
  valorEnvolvido: number;
  confianca: number;
  bandaConfianca: BandaConfiancaView;
  /** true = abaixo do threshold: BLOQUEIA auto-aprovação -> fila humana (CRC). */
  bloqueiaAutoAprovacao: boolean;
  fatores: FatorView[];
  fundamento: string[];
  baseVersaoId: string;
  motorVersaoId: string;
}

/** Erro tipado de parsing (G1) — amigável, não quebra a tela. */
export interface ErroView {
  codigo: string;
  mensagem: string;
  campo: string | null;
}

/** Resultado completo do reconhecimento (payload da Server Action). */
export interface ReconhecimentoView {
  ok: boolean;
  /** Rótulo da amostra reconhecida (fixture) ou "XML colado". */
  origem: string;
  documento: DocumentoView | null;
  itens: ItemView[];
  apontamentos: ApontamentoView[];
  proveniencia: ProvenienciaView | null;
  /** Soma do valor envolvido nos apontamentos (estimativa ilustrativa). */
  valorEnvolvidoTotal: number;
  erro: ErroView | null;
}

/** Estado inicial (nada reconhecido ainda) — usado pelo useActionState. */
export const RECONHECIMENTO_VAZIO: ReconhecimentoView = {
  ok: false,
  origem: "",
  documento: null,
  itens: [],
  apontamentos: [],
  proveniencia: null,
  valorEnvolvidoTotal: 0,
  erro: null,
};

/** Rótulo legível do modelo do documento. */
export function rotuloModelo(modelo: "55" | "65"): string {
  return modelo === "55" ? "NF-e (modelo 55)" : "NFC-e (modelo 65)";
}

/** Rótulo legível do tipo de divergência (PT-BR, sem jargão de código). */
export function rotuloDivergencia(tipo: TipoDivergenciaView): string {
  const mapa: Record<string, string> = {
    credito_potencial: "Crédito potencialmente recuperável (monofásico)",
    monofasico_tributado: "Monofásico tributado como normal",
    cclasstrib_divergente: "cClassTrib divergente da referência",
    ncm_suspeito: "NCM residual / suspeito",
    aliquota_divergente: "Alíquota divergente",
    cst_divergente: "CST divergente",
    outro: "Divergência (outra)",
  };
  return mapa[tipo] ?? "Divergência";
}

/** Variante de badge para a banda de confiança (cor + label redundantes — DESIGN §3). */
export function bandaBadge(banda: BandaConfiancaView): {
  variant: "success" | "warning" | "info";
  glyph: string;
  label: string;
} {
  if (banda === "alta") return { variant: "success", glyph: "●", label: "Confiança alta" };
  if (banda === "media") return { variant: "info", glyph: "◐", label: "Confiança média" };
  return { variant: "warning", glyph: "○", label: "Confiança baixa — revisar" };
}
