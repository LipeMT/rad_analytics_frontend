import { useEffect, useMemo, useState } from "react";
import { Trend } from "../../types";

export type PerformanceTableProps = {
  filters: {
    campus: string;
    startPeriod: string;
    endPeriod: string;
  };
};

export function PerformanceTable({ filters }: PerformanceTableProps) {
  const [rows, setRows] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const base = import.meta.env.VITE_BASE_URL;
        const params = new URLSearchParams();
        if (filters?.campus) params.set("campus", filters.campus);
        if (filters?.startPeriod && filters?.endPeriod) {
          params.set("start_period", filters.startPeriod);
          params.set("end_period", filters.endPeriod);
        }

        const url = `${base}/rad/trend${params.toString() ? `?${params}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const data: Trend[] = await res.json();
        if (!abort) setRows(data);
      } catch (e: unknown) {
        if (!abort) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError("Erro ao carregar dados.");
          }
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [filters]);

  const total = useMemo(
    () => rows.reduce((acc, r) => acc + (r?.n_registros ?? 0), 0),
    [rows]
  );

  if (loading) {
    return (
      <div className="text-sm text-gray-600">Carregando tabela…</div>
    );
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

  /** 
   * OBS: Ajuste as colunas conforme o seu tipo Trend.
   * Abaixo assumo campos comuns como "periodo" e "n_registros".
   * Se o seu Trend tiver outro nome (ex.: period_label, periodo_inicio, etc.),
   * troque no render.
   */
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Período
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Registros
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {/** ajuste aqui se o campo for outro */}
                {"periodo_letivo" in r ? (r as Trend).periodo_letivo : "-"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {r?.n_registros ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
              Total
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
              {total}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
