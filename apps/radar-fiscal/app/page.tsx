import {
  clientesEmRisco,
  dashboardKpis,
  hojeISO,
  slaPorResponsavel,
} from "@/lib/data";
import { getObrigacao } from "@/lib/obligations";

function fmtData(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function PainelPage() {
  const hoje = hojeISO();
  const kpi = dashboardKpis(hoje);
  const risco = clientesEmRisco(hoje);
  const sla = slaPorResponsavel(hoje);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Painel operacional</h1>
        <p className="page-sub">
          O que está pendente, com quem e até quando — antes de virar multa. Hoje: {fmtData(hoje)}.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Clientes ativos</div>
          <div className="kpi-value">{kpi.totalClientes}</div>
          <div className="kpi-foot">na carteira</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pendências vencidas</div>
          <div className={`kpi-value ${kpi.pendenciasVencidas ? "danger" : ""}`}>
            {kpi.pendenciasVencidas}
          </div>
          <div className="kpi-foot">prazo já passou, não entregue</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Clientes em risco</div>
          <div className={`kpi-value ${kpi.clientesEmRisco ? "danger" : ""}`}>
            {kpi.clientesEmRisco}
          </div>
          <div className="kpi-foot">com pendência vencida ou marcada risco</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Documentos faltantes</div>
          <div className={`kpi-value ${kpi.documentosFaltantes ? "warn" : ""}`}>
            {kpi.documentosFaltantes}
          </div>
          <div className="kpi-foot">cliente ainda não enviou</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ciclo atual (mai/26)</div>
          <div className="kpi-value">
            {kpi.entreguesNoCiclo}/{kpi.totalCiclo}
          </div>
          <div className="kpi-foot">obrigações entregues</div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <span className="panel-title">Clientes em risco</span>
          <span className="panel-hint">ordenado por dias de atraso</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Obrigação</th>
              <th>Competência</th>
              <th>Vencimento</th>
              <th>Atraso</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {risco.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: "var(--text-faint)" }}>
                  Nenhum cliente em risco. 🎉
                </td>
              </tr>
            )}
            {risco.map((l) => (
              <tr key={l.tarefa.id}>
                <td>
                  <strong>{l.cliente.razaoSocial}</strong>{" "}
                  <span className="pill-regime">{l.cliente.regime}</span>
                </td>
                <td>{getObrigacao(l.tarefa.obrigacaoCodigo)?.nome ?? l.tarefa.obrigacaoCodigo}</td>
                <td className="mono">{l.tarefa.competencia}</td>
                <td className="mono">{fmtData(l.tarefa.vencimento)}</td>
                <td className="atraso">{l.diasAtraso > 0 ? `${l.diasAtraso}d` : "—"}</td>
                <td>{l.responsavel?.nome ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="panel-title">SLA por responsável</span>
          <span className="panel-hint">carga e entregas do time</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Responsável</th>
              <th>Total</th>
              <th>Entregues</th>
              <th>Vencidas</th>
              <th>Em risco</th>
            </tr>
          </thead>
          <tbody>
            {sla.map((s) => (
              <tr key={s.usuario.id}>
                <td>
                  <strong>{s.usuario.nome}</strong>
                </td>
                <td className="mono">{s.total}</td>
                <td className="mono">{s.entregues}</td>
                <td className="mono atraso">{s.vencidas || "—"}</td>
                <td className="mono atraso">{s.emRisco || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="trust">
        ⚠️ Radar Fiscal rastreia <strong>existência e prazo</strong> de obrigações — visibilidade e
        controle. Não calcula imposto, apuração, crédito ou enquadramento, nem envia nada a órgão
        público. (Linha vermelha Trust C3.)
      </p>
    </>
  );
}
