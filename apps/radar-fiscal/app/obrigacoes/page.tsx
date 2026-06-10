import { KANBAN_ORDER, STATUS_LABEL, type StatusTarefa } from "@/lib/domain";
import { TAREFAS, clientePorId, usuarioPorId } from "@/lib/data";
import { getObrigacao } from "@/lib/obligations";

function fmtData(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export default function ObrigacoesPage() {
  // só o ciclo atual no board (competência mais recente)
  const tarefas = TAREFAS.filter((t) => t.competencia === "2026-05");
  const porStatus = (s: StatusTarefa) => tarefas.filter((t) => t.status === s);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Obrigações — Kanban</h1>
        <p className="page-sub">
          Ciclo de maio/2026 · {tarefas.length} obrigações · arraste e solte chega na próxima
          iteração.
        </p>
      </div>

      <div className="kanban">
        {KANBAN_ORDER.map((status) => {
          const cards = porStatus(status);
          return (
            <div className="kcol" key={status}>
              <div className="kcol-head">
                <span className="kcol-title" style={{ color: `var(--s-${status})` }}>
                  {STATUS_LABEL[status]}
                </span>
                <span className="kcol-count">{cards.length}</span>
              </div>
              {cards.map((t) => {
                const cli = clientePorId(t.clienteId);
                const resp = usuarioPorId(t.responsavelId);
                return (
                  <div className="kcard" key={t.id}>
                    <div className="kcard-top">
                      <span className="kcard-cli">{cli?.razaoSocial}</span>
                      <span className="pill-regime">{cli?.regime}</span>
                    </div>
                    <div className="kcard-ob">
                      {getObrigacao(t.obrigacaoCodigo)?.nome ?? t.obrigacaoCodigo}
                    </div>
                    <div className="kcard-meta">
                      <span>{resp?.nome}</span>
                      <span>vence {fmtData(t.vencimento)}</span>
                    </div>
                  </div>
                );
              })}
              {cards.length === 0 && (
                <p className="note" style={{ margin: "4px 6px" }}>
                  vazio
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
