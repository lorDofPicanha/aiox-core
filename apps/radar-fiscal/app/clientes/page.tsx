import { CLIENTES, TAREFAS, hojeISO, usuarioPorId } from "@/lib/data";
import { estaVencida } from "@/lib/domain";
import { obrigacoesDoRegime } from "@/lib/obligations";

export default function ClientesPage() {
  const hoje = hojeISO();

  const linhas = CLIENTES.map((c) => {
    const minhas = TAREFAS.filter((t) => t.clienteId === c.id);
    const abertas = minhas.filter((t) => t.status !== "entregue").length;
    const vencidas = minhas.filter((t) => estaVencida(t, hoje)).length;
    return { cliente: c, abertas, vencidas };
  });

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Carteira de clientes</h1>
        <p className="page-sub">
          {CLIENTES.length} CNPJs ativos · obrigações de MEI e Simples Nacional rastreadas.
        </p>
      </div>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CNPJ</th>
              <th>Regime</th>
              <th>Responsável</th>
              <th>Obrigações</th>
              <th>Abertas</th>
              <th>Vencidas</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ cliente: c, abertas, vencidas }) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.razaoSocial}</strong>
                </td>
                <td className="mono">{c.cnpj}</td>
                <td>
                  <span className="pill-regime">{c.regime}</span>
                </td>
                <td>{usuarioPorId(c.responsavelId)?.nome ?? "—"}</td>
                <td className="mono">
                  {obrigacoesDoRegime(c.regime).map((o) => o.codigo).join(", ")}
                </td>
                <td className="mono">{abertas}</td>
                <td className="mono atraso">{vencidas || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
