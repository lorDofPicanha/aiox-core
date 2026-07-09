/**
 * S7 — GERAÇÃO DE GUIAS-Receita (e-CAC · add-on premium, D9) — contrato + regra PURA.
 *
 * Modela o resultado de "gerar guia" via Integra Contador (handoff 58 §4, S7): DAS do Simples
 * (PGDASD), DARF avulso (SICALC), DARF de DCTFWeb (DCTFWEB) e DAS de parcela de parcelamento
 * (PARCSN). Este arquivo tem SÓ o contrato (`GuiaGerada`/`PedidoGuia`) e helpers PUROS
 * (validação do pedido, código de barras/linha digitável SINTÉTICOS, apresentação). O DIALETO
 * SERPRO e o transporte ficam no adapter (guias-adapter.ts) — bounded context FF-1.
 *
 * ┌─ 🔴 HUMAN-IN-LOOP (CONTEXT §5 #1; handoff 58 §5, §6) ───────────────────────────────────┐
 * │ Gerar guia é AÇÃO EXPLÍCITA do contador. A API do módulo expõe `gerarGuia(...)` (adapter),│
 * │ chamada por DECISÃO HUMANA — NUNCA por scheduler que emite sozinho. E gerar ≠ pagar ≠     │
 * │ transmitir: pagamento é do cliente; entrega (S10/S11) é gated e NÃO faz parte desta fatia.│
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * G6 (handoff 58 §5): no modo fixture a linha digitável/código de barras são SINTÉTICOS (não é
 * boleto real). Nada aqui afirma "pago"/"quitado"/"regularizado" — a guia é PREPARADA; emitir,
 * pagar e transmitir são atos do contador/cliente.
 */
import type { StatusView } from "@/lib/status";

/** Tipos de guia cobertos por esta fatia (mapeiam serviços do Integra Contador). */
export type TipoGuia = "DAS-PGDASD" | "DARF-SICALC" | "DARF-DCTFWEB" | "DAS-parcela";

export interface TipoGuiaView extends StatusView {
  tipo: TipoGuia;
  /** Serviço do catálogo Integra Contador que gera esta guia (idSistema/idServico). */
  servico: string;
  descricao: string;
}

export const TIPO_GUIA: Record<TipoGuia, TipoGuiaView> = {
  "DAS-PGDASD": {
    tipo: "DAS-PGDASD",
    variant: "info",
    glyph: "▤",
    label: "DAS — Simples (PGDASD)",
    servico: "PGDASD / GERARDAS12",
    descricao: "Documento de Arrecadação do Simples Nacional gerado a partir do PGDASD.",
  },
  "DARF-SICALC": {
    tipo: "DARF-SICALC",
    variant: "info",
    glyph: "▤",
    label: "DARF avulso (SICALC)",
    servico: "SICALC / CONSOLIDARGERARDARF01",
    descricao: "DARF calculado e consolidado no SICALC (principal + multa + juros).",
  },
  "DARF-DCTFWEB": {
    tipo: "DARF-DCTFWEB",
    variant: "info",
    glyph: "▤",
    label: "DARF de DCTFWeb",
    servico: "DCTFWEB / GERARGUIA31",
    descricao: "Guia de pagamento da DCTFWeb (contribuições previdenciárias/terceiros).",
  },
  "DAS-parcela": {
    tipo: "DAS-parcela",
    variant: "info",
    glyph: "▤",
    label: "DAS de parcela (parcelamento)",
    servico: "PARCSN / GERARDAS166",
    descricao: "DAS de uma parcela de parcelamento do Simples Nacional.",
  },
};

/** Pedido de geração de guia (a ENTRADA da ação human-in-loop). */
export interface PedidoGuia {
  tipo: TipoGuia;
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Competência "MM/AAAA". */
  competencia: string;
  /** Vencimento da guia (ISO). */
  vencimentoIso: string;
  /** Valor da guia em reais (> 0). */
  valor: number;
}

/** Uma guia GERADA (o resultado, preparado — não pago/transmitido). */
export interface GuiaGerada {
  id: string;
  tipo: TipoGuia;
  clienteId: string;
  clienteNome: string;
  documento: string;
  competencia: string;
  vencimentoIso: string;
  valor: number;
  /** Linha digitável (SINTÉTICA no modo fixture). */
  linhaDigitavel: string;
  /** Código de barras (SINTÉTICO no modo fixture). */
  codigoBarras: string;
  /** Serviço do Integra Contador que originou a guia (idSistema/idServico). */
  origem: string;
  /** Quando a guia foi preparada (ISO). */
  geradaEmIso: string;
  /** true = linha digitável sintética (modo fixture); false = boleto real (modo gated). */
  sintetica: boolean;
  /** Nota G6-safe: a guia é PREPARADA; emitir/pagar/transmitir é ato do contador/cliente. */
  observacao: string;
}

/** Regex de competência "MM/AAAA". */
const COMPETENCIA_RE = /^(\d{2})\/(\d{4})$/;

/** True se a competência é "MM/AAAA" com mês 01–12. Puro. */
export function competenciaValida(competencia: string): boolean {
  const m = COMPETENCIA_RE.exec(competencia.trim());
  if (!m) return false;
  const mes = Number(m[1]);
  return mes >= 1 && mes <= 12;
}

/**
 * Valida um pedido de guia (PURO). Devolve a lista de problemas (vazia = pedido ok). Não lança —
 * o adapter decide o que fazer. Regras mínimas honestas: tipo conhecido, cliente/documento
 * presentes, competência "MM/AAAA", vencimento legível, valor > 0.
 */
export function validarPedidoGuia(p: PedidoGuia): string[] {
  const problemas: string[] = [];
  if (!TIPO_GUIA[p.tipo]) problemas.push(`tipo de guia desconhecido: ${p.tipo}`);
  if (!p.clienteId) problemas.push("clienteId ausente");
  if (!p.documento) problemas.push("documento ausente");
  if (!competenciaValida(p.competencia)) problemas.push(`competência inválida: ${p.competencia}`);
  if (Number.isNaN(new Date(p.vencimentoIso).getTime())) problemas.push("vencimento ilegível");
  if (!(p.valor > 0)) problemas.push("valor deve ser maior que zero");
  return problemas;
}

/** Hash determinístico simples (djb2-like) de uma string → uint32. Puro. */
function hash32(base: string): number {
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/** String de N dígitos determinística a partir de uma semente. Puro. */
function digitos(seed: string, n: number): string {
  let out = "";
  let h = hash32(seed);
  while (out.length < n) {
    out += String(h % 10);
    h = (h * 1103515245 + 12345) >>> 0;
  }
  return out.slice(0, n);
}

/**
 * Código de barras SINTÉTICO (44 dígitos, como um boleto de arrecadação) — determinístico a
 * partir do pedido. NÃO é um código real; é demonstração (modo fixture).
 */
export function codigoBarrasSintetico(p: PedidoGuia): string {
  return digitos(`${p.tipo}|${p.documento}|${p.competencia}|${p.valor}`, 44);
}

/**
 * Linha digitável SINTÉTICA (47 dígitos agrupados) — determinística a partir do pedido. NÃO é
 * uma linha real; é demonstração (modo fixture).
 */
export function linhaDigitavelSintetica(p: PedidoGuia): string {
  const d = digitos(`linha|${p.tipo}|${p.documento}|${p.competencia}|${p.valor}`, 47);
  return `${d.slice(0, 11)}.${d.slice(11, 22)} ${d.slice(22, 33)}.${d.slice(33, 44)} ${d.slice(44, 47)}`;
}

/** Descrição/serviço de um tipo de guia (para UI/logs). Puro. */
export function descreverGuia(tipo: TipoGuia): TipoGuiaView {
  return TIPO_GUIA[tipo];
}
