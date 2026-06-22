import type { StatusView } from "@/lib/status";

/**
 * Badge de status redundante (cor + ícone + label) — DESIGN §3.
 * Reutilizado por Carteira, Fila, Aprovação, Trilha (F1.3–F1.6).
 */
export function StatusBadge({ view }: { view: StatusView }) {
  return (
    <span className={`badge badge-${view.variant}`}>
      <span className="badge-glyph" aria-hidden="true">
        {view.glyph}
      </span>
      {view.label}
    </span>
  );
}
