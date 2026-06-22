import { StatusBadge } from "@/components/StatusBadge";
import { brl } from "@/lib/format";
import {
  BUCKET_LABEL,
  BUCKET_ORDER,
  type CarteiraLinha,
  type SemaforoBucket,
} from "@/lib/fila-model";

/**
 * Carteira (semáforo) — F1.3. Visão consolidada por cliente: cada cliente com o
 * semáforo-resumo (pior bucket presente) + contagem de indícios por status.
 * Semáforo SEMPRE redundante (cor + ícone + label — DESIGN §3), nunca só matiz.
 *
 * Reusa StatusBadge (cor+ícone+label) e os tokens .badge-* do globals.css.
 */

const BUCKET_VARIANT: Record<SemaforoBucket, "danger" | "warning" | "info" | "success"> = {
  risco: "danger",
  requer_revisao: "warning",
  em_analise: "info",
  defensavel: "success",
};

function ContagemPills({ linha }: { linha: CarteiraLinha }) {
  const ativos = BUCKET_ORDER.filter((b) => linha.porBucket[b] > 0);
  if (ativos.length === 0) {
    return <span className="muted">— sem indícios pendentes</span>;
  }
  return (
    <span className="semaforo-counts">
      {ativos.map((b) => (
        <span key={b} className={`badge badge-${BUCKET_VARIANT[b]}`}>
          <span className="num">{linha.porBucket[b]}</span>
          {BUCKET_LABEL[b]}
        </span>
      ))}
    </span>
  );
}

export function SemaforoCarteira({ linhas }: { linhas: CarteiraLinha[] }) {
  return (
    <ul className="semaforo-list" aria-label="Carteira por cliente (semáforo)">
      {linhas.map((l) => (
        <li key={l.clienteId} className="semaforo-row">
          <span className={`semaforo-dot dot-${l.semaforoResumo.bucket}`} aria-hidden="true" />
          <div className="semaforo-main">
            <div className="semaforo-head">
              <strong>{l.clienteNome}</strong>
              <StatusBadge view={l.semaforoResumo} />
            </div>
            <div className="semaforo-meta">
              <ContagemPills linha={l} />
            </div>
          </div>
          <div className="semaforo-right">
            <span className="num semaforo-valor">{brl(l.materialidadeTotal)}</span>
            <span className="kpi-label">{l.total} indício(s) · valor envolvido</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
