import { useEffect, useMemo, useState } from "react";
import { StatCardType, Trend } from "../../types";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ChartBox } from "../ChartBox";
import { BarChart, BarData } from "../Charts/BarChart";
import { Filters, FiltersType } from "../Filters";
import { StatCard } from "../StatCard";
import { Table } from "../Tables/Table";

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

    const [selectedMetric, setSelectedMetric] = useState<'media' | 'mediana' | 'desvio_padrao'>('mediana');
    const [describeByPeriodHomologed, setDescribeByPeriodHomologed] = useState<ApiPeriodoResumo[]>([])

    const base = import.meta.env.VITE_BASE_URL;

    const formattedData = useMemo(() => {
        return describeByPeriodHomologed.map(h => ({
            name: h.periodo,
            values: {
                approved: h[selectedMetric] ?? 0,
            }
        }));
    }, [describeByPeriodHomologed, selectedMetric]);

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


    async function fetchDescribeByPeriod() {
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

            setDescribeByPeriodHomologed(response.homologado)

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
        fetchDescribeByPeriod()
    }, [filters]);

    const keysDescription = {
        approved: {
            label: "Homologado", color: "#10B981"
        }
    }

    const keysDescriptionTotalRecords = {
        total: {
            label: "Total", color: "#1086b9"
        },
    }

    const controls = (
        <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'media' | 'mediana' | 'desvio_padrao')}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
            <option value="media">Média</option>
            <option value="mediana">Mediana</option>
            <option value="desvio_padrao">Desvio Padrão</option>
        </select>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral</h2>
                <Filters onApply={handleApplyFilters} />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <StatCard key={index} data={stat} />
                ))}
            </div>

            <ChartBox title="Totais por Período" subtitle="Confira a quantidade total de horas dispostas em atividades" loading={loading} error={error}>
                <BarChart data={totalRecords} keysDescription={keysDescriptionTotalRecords} showLegend={false}></BarChart>
            </ChartBox>

            <div className="mt-10">
                <ChartBox title={`${selectedMetric === 'media' ? 'Média' : selectedMetric === 'mediana' ? 'Mediana' : 'Desvio Padrão'} por Período`} subtitle="Confira as métricas do total homologado" loading={loading} error={error} controls={controls} >
                    <BarChart data={formattedData} keysDescription={keysDescription} showLegend={false}></BarChart>
                </ChartBox>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-10">
                <h3 className="text-base font-semibold text-gray-900">Detalhamento por período</h3>
                <Table
                    columnsNames={{ periodo: "Período", mediana: "Mediana", media: "Média", desvio_padrao: "Desvio Padrão", minimo: "Mínimo", maximo: "Máximo", soma: "Soma" }}
                    error={error}
                    rows={describeByPeriodHomologed} loading={loading}
                    showTotals
                    totalsLabelColumn="periodo"
                />
            </div>
        </div>
    );
};
