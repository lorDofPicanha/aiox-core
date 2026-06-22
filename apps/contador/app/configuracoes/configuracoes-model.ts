/**
 * Read model da tela CONFIGURAÇÕES (#admin · "o painel do escritório").
 *
 * AUTO-CONTIDO de propósito (espelha o padrão de app/captura/): este módulo NÃO
 * consome lib/api.ts nem o core (@synkra/contador-api-client). A administração real
 * (gestão de equipe, billing, versionamento da régua) é Fase 2+ — aqui é uma
 * DEMONSTRAÇÃO navegável com base sintética co-localizada em configuracoes-data.ts.
 * Reaproveita apenas os tipos de apresentação globais (StatusView) e os formatadores
 * (lib/format), como o resto das telas, sem tocar em nada fora de app/configuracoes/.
 *
 * G6 (linguagem segura, doc 45 §5): nada aqui afirma "crédito garantido", "apuração
 * correta", "elimina multa" nem "prova jurídica plena". A régua cClassTrib é um
 * RASCUNHO (DRAFT) pendente de validação por tributarista (gate Fase 3, CONTEXT §5.4);
 * só o contador com CRC ativo aprova apuração (CONTEXT §5.1 — humano no loop é DESIGN).
 * Base SINTÉTICA (Fase 1).
 */
import type { StatusView } from "@/lib/status";

/* ──────────────────────────────────────────────────────────────────────────
   1. Perfil do escritório
   ────────────────────────────────────────────────────────────────────────── */

export interface PerfilEscritorio {
  nome: string;
  documento: string; // CNPJ (mascarado na view via cnpjMasked).
  /** Responsável técnico: contador com CRC ativo (ato privativo, CONTEXT §5.1). */
  responsavelTecnico: string;
  crcResponsavel: string;
  crcUf: string;
  endereco: string;
  cidadeUf: string;
  regimeTributario: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   2. Equipe / usuários
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Papel do usuário no escritório. Só `contador` (CRC ativo) pode APROVAR apuração —
 * é ato privativo (CONTEXT §5.1 / D8: humano no loop é design). `analista` prepara e
 * triagem; `admin` administra o tenant mas não assina apuração sem CRC.
 */
export type PapelUsuario = "contador" | "analista" | "admin";

/** O que o papel pode fazer na cerimônia de aprovação (reflete o ato privativo CRC). */
export interface PapelView {
  label: string;
  /** True só para o contador com CRC ativo — único que carimba a aprovação. */
  podeAprovar: boolean;
  badge: StatusView;
}

export const PAPEL_VIEW: Record<PapelUsuario, PapelView> = {
  contador: {
    label: "Contador (CRC ativo)",
    podeAprovar: true,
    badge: { variant: "success", glyph: "✓", label: "Aprova apuração" },
  },
  analista: {
    label: "Analista fiscal",
    podeAprovar: false,
    badge: { variant: "neutral", glyph: "◷", label: "Prepara e triagem" },
  },
  admin: {
    label: "Administrador",
    podeAprovar: false,
    badge: { variant: "neutral", glyph: "⚙", label: "Administra o tenant" },
  },
};

export interface UsuarioEquipe {
  id: string;
  nome: string;
  papel: PapelUsuario;
  /** CRC (só faz sentido para contador); null para analista/admin sem registro. */
  crc: string | null;
  crcUf: string | null;
  email: string;
  ativo: boolean;
}

/* ──────────────────────────────────────────────────────────────────────────
   3. Base de referência — régua cClassTrib
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Estado de validação da régua. DRAFT = autorada pelos clones, ainda NÃO validada por
 * tributarista habilitado (gate Fase 3, CONTEXT §5.4). Honesto por design: a régua
 * orienta a triagem, nunca substitui o juízo do contador (humano no loop).
 */
export type EstadoRegua = "draft" | "em_validacao" | "validada";

export const ESTADO_REGUA_VIEW: Record<EstadoRegua, StatusView> = {
  draft: { variant: "warning", glyph: "✎", label: "Rascunho — pendente validação" },
  em_validacao: { variant: "info", glyph: "◷", label: "Em validação (tributarista)" },
  validada: { variant: "success", glyph: "✓", label: "Validada por tributarista" },
};

export interface ReguaReferencia {
  versao: string;
  estado: EstadoRegua;
  dataPublicacaoIso: string;
  numeroRegras: number;
  numeroNcmCobertos: number;
  /** Origem da autoria (clones fiscais) — transparência sobre a procedência. */
  autoria: string;
  /** O que ainda falta para sair do rascunho (gate Fase 3). */
  pendencias: string[];
}

/* ──────────────────────────────────────────────────────────────────────────
   4. Captura por cliente (espelha o conceito do módulo Captura; default OFF = D2)
   ────────────────────────────────────────────────────────────────────────── */

export interface CapturaClienteConfig {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Toggle de captura automática. Default OFF (D2: captura seletiva por design). */
  capturaAtiva: boolean;
  /** Modo configurado: upload/XML (◆ 1ª classe) ou provider/OCR (◇ 2ª classe). */
  modo: "upload" | "provider";
}

export const MODO_CAPTURA_VIEW: Record<CapturaClienteConfig["modo"], StatusView> = {
  upload: { variant: "neutral", glyph: "↥", label: "Upload / XML" },
  provider: { variant: "warning", glyph: "⤓", label: "Provider / OCR" },
};

/* ──────────────────────────────────────────────────────────────────────────
   5. Plano & cobrança (corredor CONTEXT §10 / doc 05 — value metric = nota auditada, D7)
   ────────────────────────────────────────────────────────────────────────── */

export interface PlanoTier {
  id: string;
  nome: string;
  /** Mensalidade base (R$). O preço transparente é decisão D7. */
  mensalidade: number;
  /** Faixa de volume de NOTA AUDITADA por mês (value metric = nota, NÃO faixa de CNPJ). */
  faixaNotas: string;
  /** Itens inclusos no pacote empacotado (entrada barata via valor, não desconto). */
  inclui: string[];
  /** True para o tier atualmente contratado pelo escritório (na demo). */
  atual: boolean;
}

export interface CobrancaResumo {
  /** Implantação (fee único — cobre CAC, CONTEXT §10). */
  implantacao: number;
  /** Fidelidade: sem lock-in, só aviso prévio (CONTEXT §10 / doc 05). */
  fidelidade: string;
  /** Success-fee da recuperação (overlay, em linha separada — D6). */
  successFeeRecuperacao: string;
  /** Modelo do emissor revendido (paga a própria assinatura — doc 05). */
  emissorRevenda: string;
}
