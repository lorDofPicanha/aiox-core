/**
 * Constantes/tipos da decisão de aprovação (F1.4) — módulo NEUTRO (sem "use server").
 *
 * Separado de actions.ts porque um arquivo "use server" só pode exportar funções
 * async. Aqui ficam o vocabulário fechado de motivos (ck_rejeicao_motivada), o tipo
 * de estado da ação e o estado inicial — consumidos tanto pelo Server Action quanto
 * pela UI (AprovacaoForm) e pela página de detalhe.
 */

/** Estado retornado para a UI (useActionState). */
export interface AcaoState {
  ok: boolean;
  /** Mensagem de erro (quando ok=false) ou confirmação (quando ok=true). */
  message: string | null;
  /** Carimbo da decisão para feedback imediato (quando ok=true). */
  carimbo: {
    decisao: "aprovado" | "rejeitado";
    nome: string;
    crc: string;
    crcUf: string | null;
    habilitacao: string;
    quando: string;
    motivoCodigo: string | null;
  } | null;
}

export const ACAO_INICIAL: AcaoState = { ok: false, message: null, carimbo: null };

/**
 * Motivos curados de rejeição (ck_rejeicao_motivada). Um código de um vocabulário
 * fechado — texto livre é só complemento opcional. Espelha a curadoria fiscal.
 */
export const MOTIVOS_REJEICAO: ReadonlyArray<{ codigo: string; label: string }> = [
  { codigo: "ref_sintetica_insuficiente", label: "Referência sintética insuficiente para decidir" },
  { codigo: "evidencia_pendente", label: "Falta evidência documental (XML/laudo) para sustentar" },
  { codigo: "ncm_correto_origem", label: "NCM/classificação está correto na origem" },
  { codigo: "regime_nao_aplicavel", label: "Regime tributário apontado não se aplica ao caso" },
  { codigo: "valor_imaterial", label: "Materialidade irrelevante — não justifica ajuste" },
  { codigo: "controversia_juridica", label: "Matéria em controvérsia jurídica — abster por ora" },
  { codigo: "outro_motivado", label: "Outro motivo (detalhar no texto)" },
];

export const MOTIVOS_VALIDOS = new Set(MOTIVOS_REJEICAO.map((m) => m.codigo));
