/**
 * Mapa de apresentação de status (DESIGN §3): SEMPRE redundante — cor + ícone + label.
 * Nunca só matiz (a11y + a trilha de boa-fé não pode ser ambígua em P&B/daltônico).
 */
import type { BandaConfianca, StatusApontamento, TipoEvento } from "@synkra/contador-api-client";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusView {
  variant: BadgeVariant;
  glyph: string;
  label: string;
}

export const STATUS_APONTAMENTO: Record<StatusApontamento, StatusView> = {
  pendente: { variant: "warning", glyph: "●", label: "Pendente" },
  aprovado: { variant: "success", glyph: "✓", label: "Aprovado" },
  rejeitado: { variant: "neutral", glyph: "✕", label: "Rejeitado" },
  retificado: { variant: "info", glyph: "↻", label: "Retificado" },
  regularizado: { variant: "success", glyph: "✓", label: "Regularizado" },
  superado: { variant: "neutral", glyph: "⊖", label: "Superado" },
};

export const BANDA_CONFIANCA: Record<BandaConfianca, StatusView> = {
  alta: { variant: "success", glyph: "▲", label: "Confiança alta" },
  media: { variant: "warning", glyph: "◆", label: "Confiança média" },
  baixa: { variant: "danger", glyph: "▼", label: "Revisar antes de aprovar" },
  disputado: { variant: "neutral", glyph: "?", label: "Em disputa" },
};

const EVENTO_GLYPH: Partial<Record<TipoEvento, string>> = {
  nota_recebida: "↧",
  analise_executada: "⚙",
  apontamento_gerado: "!",
  apontamento_aprovado: "✓",
  apontamento_rejeitado: "✕",
  apontamento_superado: "⊖",
  laudo_emitido: "▤",
  ancora_temporal: "⧗",
};

export function eventoGlyph(tipo: TipoEvento): string {
  return EVENTO_GLYPH[tipo] ?? "•";
}

export function eventoLabel(tipo: TipoEvento): string {
  return tipo.replace(/_/g, " ");
}
