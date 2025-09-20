import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getErrorMessage } from '../../utils/getErrorMessage';

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

export type PerformanceData = {
  metric: string;     // rótulo no eixo X (usaremos o período)
  current: number;    // valor atual (usaremos a MEDIANA homologada)
  target: number;     // meta para coloração
};

interface PerformanceChartProps {
  /** Meta (target) para comparação visual. Ex: 120 horas */
  target?: number;
  /** Filtro opcional por campus (query param repetido) */
  campus?: string[];
  /** Endpoint base (permite trocar em testes) */
  endpoint?: string; // default: "/analytics/describe-totais-por-periodo"
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  target = 100,
  campus,
  endpoint = 'http://localhost:8000/rad/describe_by_period',
}) => {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColor = (current: number, tgt: number) => {
    const percentage = tgt > 0 ? (current / tgt) * 100 : 0;
    if (percentage >= 90) return '#10B981'; // verde
    if (percentage >= 70) return '#F59E0B'; // amarelo
    return '#EF4444';                        // vermelho
  };

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (campus?.length) {
      campus.forEach((c) => qs.append('campus', c));
    }
    return qs.toString();
  }, [campus]);

  useEffect(() => {
    const ctrl = new AbortController();

    async function fetchResults() {
      try {
        setLoading(true);
        setError(null);

        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        // Espera-se uma lista de objetos por período
        const payload: ApiPeriodoResumo[] = await res.json();

        const normalized: PerformanceData[] = (payload || [])
          .filter((row) => row && typeof row.periodo === 'string')
          .map((row) => ({
            metric: row.periodo,
            current: Number(row.mediana ?? 0),
            target: Number(target),
          }))
          // ordena por período como string; se quiser ordenar por ano/semestre, adapte aqui
          .sort((a, b) => a.metric.localeCompare(b.metric, 'pt-BR'));

        setData(normalized);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    return () => ctrl.abort();
  }, [endpoint, queryString, target]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="animate-pulse h-4 w-72 bg-gray-200 rounded mb-6" />
        <div className="h-[300px] flex items-center justify-center text-gray-500">Carregando…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Falha ao carregar</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mediana Totais Homologados</h3>
        <p className="text-gray-600 text-sm mb-6">Sem dados para os filtros atuais.</p>
        <div className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mediana Totais Homologados</h3>
        <p className="text-gray-600 text-sm">
          Desempenho por período
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="metric"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Bar dataKey="current" name="Mediana" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.current, entry.target)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
