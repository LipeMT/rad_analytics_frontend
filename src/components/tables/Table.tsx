import { useMemo } from "react";

export type Row = {
  [key: string]: any
}

export type TableProps = {
  loading: boolean
  error: string | null,
  rows: Row[],
  columnsNames: Record<string, string>
  /**
   * Whether a total row should be shown at the bottom of the table.
   * The total for each column is the sum of all numeric values in that
   * column. Non‑numeric entries are ignored.
   * Defaults to `false` if not provided.
   */
  showTotals?: boolean
  totalsLabelColumn?: string // Optional: specify which column should display the "Total" label in the totals row
};

export function Table({ loading, error, rows, columnsNames, showTotals = false, totalsLabelColumn }: TableProps) {
  const columns = Object.keys(columnsNames);

  const totals = useMemo(() => {
    if (!showTotals) return {}; // no computation if not needed

    const accum: Record<string, number> = {};
    columns.forEach((col) => {
      accum[col] = 0;
    });

    rows.forEach((row) => {
      columns.forEach((col) => {
        const val = row[col];
        if (typeof val === "number" && !isNaN(val)) {
          accum[col] += val;
        }
      });
    });

    return accum;
  }, [rows, columns, showTotals]);


  if (loading) {
    return <div className="text-sm text-gray-600">Carregando tabela…</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Falha ao carregar a tabela: {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="text-sm text-gray-600">
        Nenhum dado para os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {columnsNames[column]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, indexRow) => (
            <tr key={indexRow}>
              {columns.map((column) => {
                const value = row[column];
                const displayValue =
                  typeof value === "number"
                    ? value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
                    : value ?? "";

                return (
                  <td
                    key={column}
                    className="whitespace-nowrap px-4 py-3 text-sm text-gray-900"
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {showTotals && (
          <tfoot className="bg-gray-50">
            <tr>
              {columns.map((column) => {
                const totalValue = totals[column];
                const displayTotal = column === totalsLabelColumn ? "Total" :
                  typeof totalValue === "number" ? totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : "";
                return (
                  <td
                    key={column}
                    className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold"
                  >
                    {displayTotal}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

