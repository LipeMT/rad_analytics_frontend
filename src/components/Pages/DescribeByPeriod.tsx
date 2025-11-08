import { useEffect, useMemo, useState } from "react";
import { StatCardType, Trend } from "../../types";
import { Filters, FiltersType } from "../Filters";
import { StatCard } from "../StatCard";
import { PerformanceTable } from "../tables/PerformanceTable";
import { BarData, StackedBarChart } from "../charts/StackedBarChart";
import { ChartBox } from "../ChartBox";
import { getErrorMessage } from "../../utils/getErrorMessage";

type ApiPeriodoResumo = {
  periodo: string;
  media?: number;
  mediana?: number;
  desvio_padrao?: number;
  minimo?: number;
  maximo?: number;
  soma?: number;
  n_registros?: number;
  n_docentes?: number;
};

type DescribeByPeriodResponse = {
  homologado: ApiPeriodoResumo[],
  nao_homologado: ApiPeriodoResumo[]
}

export type PerformanceData = {
  metric: string;
  current: number;
  target: number;
};

export const DescribeByPeriod = () => {
  const [statCards, setStatCards] = useState<StatCardType[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    campus: "",
    startPeriod: "",
    endPeriod: "",
  });

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<BarData[]>([] as BarData[])

  const [data, setData] = useState<BarData[]>([] as BarData[])

  const base = import.meta.env.VITE_BASE_URL;

  async function fetchData(active: FiltersType) {
    const params = new URLSearchParams();

    if (active?.campus) params.set("campus", active.campus);
    if (active?.startPeriod && active.endPeriod) {
      params.set("start_period", active.startPeriod);
      params.set("end_period", active.endPeriod);
    }

    const url = `${base}/rad/trend${params.toString() ? `?${params}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const response: Trend[] = await res.json();

    const totalRecordsByPeriod = response.map(record => {
      return {
        name: record.periodo_letivo,
        values: {
          total: record.total_somado
        }
      }
    })

    setTotalRecords(totalRecordsByPeriod)

    const total_records = response.reduce(
      (sum: number, p: Trend) => sum + (p?.n_registros ?? 0),
      0
    );

    setStatCards([
      {
        title: "Total de Registros",
        value: total_records,
        changeType: "increase",
      },
    ]);
  }

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (filters?.campus) {
      qs.append('campus', filters?.campus);
    }
    if (filters?.startPeriod && filters?.endPeriod) {
      qs.append('start_period', filters?.startPeriod);
      qs.append('end_period', filters?.endPeriod);
    }
    return qs.toString();
  }, [filters]);

  const ctrl = new AbortController();


  async function fetchResults() {
    try {
      setLoading(true);
      setError(null);

      let url = `${base}/rad/describe_by_period`
      if (queryString) url += '?' + queryString

      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const response: DescribeByPeriodResponse = await res.json();

      const formatado = response.homologado.map(h => ({
        name: h.periodo,
        values: {
          approved: h.mediana ?? 0,
          // notApproved: response.nao_homologado.find(n => n.periodo === h.periodo)?.mediana ?? 0
        }
      }));

      setData(formatado);

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleApplyFilters(data: FiltersType) {
    setFilters(data);
  }

  useEffect(() => {
    fetchData(filters).catch(console.error);
    fetchResults()
  }, [filters]);

  const keysDescription = {
    approved: {
      label: "Homologado", color: "#10B981"
    },
    notApproved: {
      label: "Não Homologado", color: "#EF4444"
    }
  }

  const keysDescriptionTotalRecords = {
    total: {
      label: "Total", color: "#1086b9"
    },
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      Top bar
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Visão Geral</h2>
        <Filters onApply={handleApplyFilters} />
      </div>

      {/* Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} data={stat} />
        ))}
      </div>

      <ChartBox title="Totais por Período" subtitle="Confira a quantidade total de horas dispostas em atividades" loading={loading} error={error}>
        <StackedBarChart data={totalRecords} keysDescription={keysDescriptionTotalRecords}></StackedBarChart>
      </ChartBox>

      <ChartBox title="Mediana por Período" subtitle="Confira as medianas do total homologado e não homologado" loading={loading} error={error}>
        <StackedBarChart data={data} keysDescription={keysDescription}></StackedBarChart>
      </ChartBox>

      {/* Tabela abaixo do gráfico */}
      <div className="grid grid-cols-1 gap-4 mt-10">
        <h3 className="text-base font-semibold text-gray-900">Detalhamento por período</h3>
        <PerformanceTable filters={filters} />
      </div>
    </div>
  );
};
