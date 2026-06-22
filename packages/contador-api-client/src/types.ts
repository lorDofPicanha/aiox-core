/**
 * Domain types for the Contador core (contexto APURAÇÃO/CORE).
 *
 * These mirror the SQL contracts in packages/contador-db/migrations
 * (001_foundation.sql, 002_decision_evidence.sql, 003_secure_decision_rpc.sql,
 * 004_closeout_lote.sql). Field names follow the published RPC language
 * (core_api_v1 / schema `core`), translated to camelCase for the TS surface.
 *
 * G6 (linguagem segura): nada aqui afirma "crédito garantido", "apuração correta",
 * "elimina multa" ou "prova jurídica plena". Apontamentos são INDÍCIOS sujeitos a
 * revisão humana (contador com CRC ativo). A trilha é uma EVIDÊNCIA verificável.
 */

// ---------------------------------------------------------------------------
// Enums (espelham os CHECK constraints das migrations)
// ---------------------------------------------------------------------------

/** core.usuario.papel */
export type PapelUsuario = "admin" | "gestor" | "contador" | "analista" | "leitura";

/** core.usuario.crc_situacao */
export type SituacaoCrc = "ativo" | "suspenso" | "baixado" | "sem_registro";

/** core.nota.tipo */
export type TipoNota = "nfe" | "nfce" | "nfse" | "cte" | "mdfe";

/** core.nota.direcao */
export type DirecaoNota = "compra" | "venda";

/** core.nota.origem */
export type OrigemNota = "upload" | "provider_ocr" | "provider" | "manual";

/** core.nota.status_auditoria */
export type StatusAuditoriaNota =
  | "nao_analisada"
  | "em_analise"
  | "analisada"
  | "sem_divergencia";

/** core.apontamento_auditoria.tipo_inferencia */
export type TipoInferencia = "humano_concierge" | "regra_deterministica" | "rag";

/** Classe do insumo de prova (DESIGN §1 princípio 6): XML = 1ª, OCR = 2ª. */
export type ClasseInsumo = "xml" | "ocr";

/** core.apontamento_auditoria.tipo_divergencia */
export type TipoDivergencia =
  | "cclasstrib_divergente"
  | "ncm_suspeito"
  | "monofasico_tributado"
  | "aliquota_divergente"
  | "cst_divergente"
  | "credito_potencial"
  | "outro";

/** core.apontamento_auditoria.banda_confianca */
export type BandaConfianca = "alta" | "media" | "baixa" | "disputado";

/** core.apontamento_auditoria.status */
export type StatusApontamento =
  | "pendente"
  | "aprovado"
  | "rejeitado"
  | "retificado"
  | "regularizado"
  | "superado";

/** core.evento_boa_fe.tipo_evento */
export type TipoEvento =
  | "nota_recebida"
  | "analise_executada"
  | "apontamento_gerado"
  | "apontamento_aprovado"
  | "apontamento_rejeitado"
  | "apontamento_retificado"
  | "apontamento_regularizado"
  | "apontamento_escalado"
  | "apontamento_superado"
  | "decisao_lote"
  | "laudo_emitido"
  | "laudo_substituido"
  | "ajuste_exportado"
  | "base_referencia_atualizada"
  | "ancora_temporal"
  | "restauracao_sistema"
  | "xml_expurgado";

/** core.evento_boa_fe.ator_tipo */
export type AtorTipo = "usuario" | "motor" | "sistema";

/** core.evento_boa_fe.referente_tipo */
export type ReferenteTipo =
  | "nota"
  | "apontamento"
  | "laudo"
  | "base"
  | "analise"
  | "sistema";

/** core.closeout_lote.tipo */
export type TipoCloseout = "diario" | "mensal" | "corretivo";

/** core.closeout_lote.resultado */
export type ResultadoCloseout = "pass" | "fail" | "superseded";

/** core.closeout_lote.time_stamp_provider */
export type CarimboTempoProvider = "none" | "act_icp_brasil";

// ---------------------------------------------------------------------------
// Entidades de domínio
// ---------------------------------------------------------------------------

/** core.escritorio (tenant) */
export interface Escritorio {
  id: string;
  nome: string;
  plano: string | null;
  createdAt: string;
}

/** core.cliente */
export interface Cliente {
  id: string;
  escritorioId: string;
  nome: string;
  /** CNPJ/CPF do cliente final (sintético na Fase 1). */
  documento: string;
}

/** core.usuario — inclui o snapshot de CRC que as RPCs de decisão exigem. */
export interface Usuario {
  id: string;
  escritorioId: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  /** CPF (11 dígitos) — sintético na Fase 1. */
  cpf: string | null;
  crc: string | null;
  crcUf: string | null;
  crcSituacao: SituacaoCrc | null;
  ativo: boolean;
}

/** core.nota */
export interface Nota {
  id: string;
  escritorioId: string;
  clienteId: string;
  competencia: string; // YYYY-MM-01
  tipo: TipoNota;
  direcao: DirecaoNota;
  numero: string | null;
  serie: string | null;
  emitidaEm: string; // YYYY-MM-DD
  emitenteCnpj: string;
  destinatarioDoc: string | null;
  valorTotal: number;
  origem: OrigemNota;
  /** Classe do insumo de prova: derivada de origem (upload/manual = xml, *_ocr = ocr). */
  classeInsumo: ClasseInsumo;
  statusAuditoria: StatusAuditoriaNota;
}

/** core.nota_item */
export interface NotaItem {
  id: string;
  escritorioId: string;
  notaId: string;
  competencia: string;
  numeroItem: number;
  descricao: string;
  ncm: string | null;
  cfop: string | null;
  cst: string | null;
  cclasstribInformado: string | null;
  quantidade: number | null;
  valorItem: number;
}

/** ref.base_versao */
export interface BaseVersao {
  id: string;
  rotulo: string;
  fonte: string;
  vigenteDesde: string;
  /** Sinaliza base SINTÉTICA na Fase 1 (DESIGN: nunca performar prova que não existe). */
  sintetica: boolean;
}

/** ref.motor_versao (subset relevante para o app). */
export interface MotorVersao {
  id: string;
  rotulo: string;
  codigoVersao: string;
  tipoInferencia: TipoInferencia;
  status: "rascunho" | "vigente" | "superado";
}

/** core.apontamento_auditoria — o INDÍCIO (sujeito a revisão humana). */
export interface Apontamento {
  id: string;
  escritorioId: string;
  clienteId: string;
  itemId: string;
  baseVersaoId: string;
  motorVersaoId: string;
  analiseExecucaoId: string | null;
  tipoInferencia: TipoInferencia;
  origem: "manual" | "motor";
  tipoDivergencia: TipoDivergencia;
  cclasstribReferencia: string | null;
  descricao: string;
  valorEnvolvido: number | null;
  /** Confiança calibrada [0..1] — nunca um selo binário "correto". */
  confianca: number | null;
  bandaConfianca: BandaConfianca;
  fundamento: string[];
  status: StatusApontamento;
  revisorId: string | null;
  revisadoEm: string | null;
  motivoCodigo: string | null;
  motivoTexto: string | null;
}

/**
 * core.evento_boa_fe — nó da trilha de boa-fé (append-only, hash-chain).
 * Espelha o formato consumido por @synkra/contador-trilha-verifier (EventoBoaFeDump).
 */
export interface EventoBoaFe {
  id: number;
  escritorioId: string;
  seqTenant: number;
  hashVer: number;
  tipoEvento: TipoEvento;
  atorTipo: AtorTipo;
  atorId: string | null;
  referenteTipo: ReferenteTipo | null;
  referenteId: string | null;
  notaId: string | null;
  apontamentoId: string | null;
  laudoId: string | null;
  payload: Record<string, unknown>;
  ocorridoEm: string;
  hashAnterior: string;
  hashEvento: string;
}

/** core.closeout_lote (manifesto técnico — sem promessa ICP-Brasil/PAdES na Fase 1). */
export interface CloseoutLote {
  id: string;
  escritorioId: string;
  tipo: TipoCloseout;
  periodoInicio: string;
  periodoFim: string;
  eventoCount: number;
  merkleRoot: string | null;
  verifierVersion: string;
  resultado: ResultadoCloseout;
  /** Fase 1: sempre "none" — carimbo de tempo formal é Fase 4 (placeholder honesto). */
  carimboTempoProvider: CarimboTempoProvider;
  executadoEm: string;
}

// ---------------------------------------------------------------------------
// Argumentos das RPCs (espelham as assinaturas SQL)
// ---------------------------------------------------------------------------

/** core_api_v1.registrar_analise (parâmetros essenciais — defaults aplicados na impl). */
export interface RegistrarAnaliseArgs {
  escritorioId: string;
  clienteId: string;
  itemId: string;
  motorVersaoId: string;
  baseVersaoId: string;
  tipoDivergencia: TipoDivergencia;
  descricao: string;
  confianca?: number | null;
  fundamento?: string[];
  cclasstribReferencia?: string | null;
  valorEnvolvido?: number | null;
  regraId?: string | null;
  /** 'regra_deterministica' (default) ou 'rag'. NUNCA 'humano_concierge' (P15). */
  tipoInferencia?: Extract<TipoInferencia, "regra_deterministica" | "rag">;
}

/** core_api_v1.aprovar_apontamento */
export interface AprovarApontamentoArgs {
  apontamentoId: string;
  revisorId: string;
  motivoCodigo?: string;
  motivoTexto?: string | null;
}

/** core_api_v1.rejeitar_apontamento (motivoCodigo é obrigatório — ck_rejeicao_motivada). */
export interface RejeitarApontamentoArgs {
  apontamentoId: string;
  revisorId: string;
  motivoCodigo: string;
  motivoTexto?: string | null;
}

/** core_api_v1.superar_apontamento (bitemporal). */
export interface SuperarApontamentoArgs {
  apontamentoId: string;
  revisorId: string;
  conhecidaEm: string;
  /** daterange como string Postgres, ex.: "[2026-01-01,2026-12-31)". */
  vigencia: string;
}

/** core_api_v1.registrar_closeout (subset — manifesto vem do trilha-verifier). */
export interface RegistrarCloseoutArgs {
  escritorioId: string;
  tipo: TipoCloseout;
  periodoInicio: string;
  periodoFim: string;
  eventoCount: number;
  merkleRoot: string | null;
  verifierVersion: string;
  resultado: ResultadoCloseout;
  manifesto: Record<string, unknown>;
  executadoPor?: string | null;
  /** Fase 1: deve ser "none". O token formal é Fase 4. */
  carimboTempoProvider?: CarimboTempoProvider;
}

// ---------------------------------------------------------------------------
// Filtros de leitura (read models do app)
// ---------------------------------------------------------------------------

export interface ListarApontamentosFiltro {
  escritorioId: string;
  clienteId?: string;
  status?: StatusApontamento;
}

export interface ListarEventosFiltro {
  escritorioId: string;
  referenteTipo?: ReferenteTipo;
  referenteId?: string;
}
