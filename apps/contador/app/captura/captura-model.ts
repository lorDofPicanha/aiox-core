/**
 * Read model do módulo CAPTURA (#1 · "porta de entrada" do ciclo da nota fiscal).
 *
 * AUTO-CONTIDO de propósito: este módulo NÃO consome lib/api.ts nem o core
 * (@synkra/contador-api-client). A Captura real (varredura via provider com A1
 * custodiado pelo provider + DPA, D2) é Fase 5 — aqui é uma DEMONSTRAÇÃO navegável
 * com base sintética co-localizada em captura-data.ts. Reaproveita apenas os tipos
 * de apresentação globais (StatusView) e os formatadores (lib/format), como o resto
 * das telas, sem tocar em nada fora de app/captura/.
 *
 * G6 (linguagem segura, doc 45 §5): nada aqui afirma "crédito garantido", "apuração
 * correta", "elimina multa" nem "prova jurídica plena". A Captura só COLETA e ARMAZENA
 * o documento fiscal (insumo); a análise/indício vive nos módulos seguintes, sempre
 * sob revisão humana (contador com CRC ativo). Base SINTÉTICA (Fase 1).
 */
import type { StatusView } from "@/lib/status";

/** Classe de insumo de prova (DESIGN §1 princípio 6): ◆ XML 1ª · ◇ OCR 2ª. */
export type ClasseInsumo = "xml" | "ocr";

/** Modo de captura por cliente (D2: captura comprada de provider; OFF é o default). */
export type ModoCaptura = "upload" | "provider";

/** Tipo de documento fiscal capturado. */
export type TipoDocumento = "nfe" | "cte";

/** Natureza derivada de emitente/destinatário (o sistema lê quem emitiu/recebeu). */
export type NaturezaNota = "compra" | "venda";

/**
 * Estágio do documento DENTRO da captura. A Captura entrega "capturada"; "processada"
 * = leitura concluída (insumo pronto para os módulos seguintes). NÃO há juízo fiscal
 * aqui — nenhum estágio afirma que a tributação está correta (isso é a Auditoria, #3).
 */
export type EstagioCaptura = "capturada" | "processada";

/** View redundante (cor + ícone + label — DESIGN §3) do estágio de captura. */
export const ESTAGIO_VIEW: Record<EstagioCaptura, StatusView> = {
  capturada: { variant: "info", glyph: "↧", label: "Capturada" },
  processada: { variant: "success", glyph: "⚙", label: "Processada" },
};

/** View redundante do modo de captura (◆ XML 1ª classe via upload · ◇ provider/OCR 2ª). */
export const MODO_VIEW: Record<ModoCaptura, StatusView> = {
  upload: { variant: "neutral", glyph: "↥", label: "Upload / XML" },
  provider: { variant: "warning", glyph: "⤓", label: "Provider / OCR" },
};

/** Rótulo humano do tipo de documento. */
export const TIPO_LABEL: Record<TipoDocumento, string> = {
  nfe: "NF-e",
  cte: "CT-e",
};

/** Rótulo humano da natureza (compra/venda). */
export const NATUREZA_LABEL: Record<NaturezaNota, string> = {
  compra: "Compra (entrada)",
  venda: "Venda (saída)",
};

/** Glyph + label da classe de insumo (espelha o padrão do laudo). */
export function classeInsumoView(c: ClasseInsumo): { glyph: string; label: string } {
  return c === "xml"
    ? { glyph: "◆", label: "XML (1ª classe)" }
    : { glyph: "◇", label: "OCR (2ª classe)" };
}

/** Uma linha de status de captura por cliente (cabeçalho da varredura). */
export interface CapturaClienteLinha {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Modo de captura configurado para o cliente (D2). */
  modo: ModoCaptura;
  /**
   * Toggle de captura automática. DEFAULT OFF é decisão D2 (COGS ~R$6,35/CNPJ se
   * indiscriminada → captura é seletiva por design). Aqui é VISUAL: a captura
   * automática real chega na Fase 5 (precisa provider + DPA, Art. 39 LGPD).
   */
  capturaAtiva: boolean;
  /** Nº de notas já capturadas do cliente (na base sintética). */
  notasCapturadas: number;
  /** Última captura (ISO) — null se nunca capturou (toggle OFF, sem provider). */
  ultimaCapturaIso: string | null;
  /** Classe de insumo predominante das notas do cliente (◆ XML · ◇ OCR). */
  classePredominante: ClasseInsumo;
}

/** Uma linha da lista de notas capturadas (tabela data-dense). */
export interface NotaCapturadaLinha {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipo: TipoDocumento;
  natureza: NaturezaNota;
  /** Número/série do documento (mono, tabular). */
  numeroSerie: string;
  valor: number;
  dataIso: string;
  classeInsumo: ClasseInsumo;
  estagio: EstagioCaptura;
}
