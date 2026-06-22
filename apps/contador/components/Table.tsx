import type { ReactNode } from "react";

/**
 * Table base data-dense (DESIGN §6.5): cabeçalho fixo, zebra sutil via hover,
 * valores numéricos à direita (use align="num" + classe .num na célula).
 */
export interface Column<Row> {
  key: string;
  header: ReactNode;
  /** "num" alinha à direita e ativa tabular-nums. */
  align?: "left" | "num";
  render: (row: Row) => ReactNode;
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  rowClassName,
  empty,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  rowClassName?: (row: Row) => string | undefined;
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return <p className="muted">{empty ?? "Nada a exibir."}</p>;
  }
  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "num" ? "num" : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className={rowClassName?.(row)}>
              {columns.map((c) => (
                <td key={c.key} className={c.align === "num" ? "num" : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
