import { useEffect, useMemo, useRef, useState } from "react";
import { StatCardType, Trend } from "../../types";
import { approvedKeysDescription, totalRecordsKeysDescription } from "../../utils/chartKeys";
import { exportarHTML } from "../../utils/exportToHtml";
import { buildFilterSubtitle } from "../../utils/filterSummary";
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
    const tableRef = useRef<HTMLDivElement | null>(null);

    const base = import.meta.env.VITE_BASE_URL;

    const formattedData = useMemo(() => {
        return describeByPeriodHomologed.map(h => ({
            name: h.periodo,
            values: {
                approved: h[selectedMetric] ?? 0,
            }
        }));
    }, [describeByPeriodHomologed, selectedMetric]);

    function periodToIndex(period: string) {
        const [year, semester] = period.split("/");
        return Number(year) * 2 + (semester === "2" ? 1 : 0);
    }

    function filterByPeriodRange(records: BarData[], startPeriod: string, endPeriod: string) {
        if (!startPeriod || !endPeriod) return records;

        const startIndex = periodToIndex(startPeriod);
        const endIndex = periodToIndex(endPeriod);
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);

        return records.filter((record) => {
            const periodIndex = periodToIndex(record.name);
            return periodIndex >= minIndex && periodIndex <= maxIndex;
        });
    }

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

        const totalRecordsByPeriod = response.map(record => ({
            name: record.periodo_letivo,
            values: {
                total: record.total_somado
            }
        }));

        const filteredRecords = active.startPeriod && active.endPeriod
            ? filterByPeriodRange(totalRecordsByPeriod, active.startPeriod, active.endPeriod)
            : totalRecordsByPeriod;

        setTotalRecords(filteredRecords);

        const total_records = filteredRecords.reduce(
            (sum: number, record: BarData) => sum + (record.values.total ?? 0),
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

    const keysDescription = approvedKeysDescription;
    const keysDescriptionTotalRecords = totalRecordsKeysDescription;

    const filterSummary = useMemo(() => buildFilterSubtitle(filters), [filters]);

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

            <ChartBox title="Totais por Período" subtitle={filterSummary} loading={loading} error={error}>
                <BarChart data={totalRecords} keysDescription={keysDescriptionTotalRecords} showLegend={false}></BarChart>
            </ChartBox>

            <div className="mt-10">
                <ChartBox title={`${selectedMetric === 'media' ? 'Média' : selectedMetric === 'mediana' ? 'Mediana' : 'Desvio Padrão'} por Período`} subtitle={filterSummary} loading={loading} error={error} controls={controls} >
                    <BarChart data={formattedData} keysDescription={keysDescription} showLegend={false}></BarChart>
                </ChartBox>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Detalhamento por período</h3>
                    <button
                        type="button"
                        onClick={() => exportarHTML(tableRef, "detalhamento-por-periodo.html")}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Exportar tabela HTML
                    </button>
                </div>
                <div ref={tableRef}>
                    <Table
                        columnsNames={{ periodo: "Período", mediana: "Mediana", media: "Média", desvio_padrao: "Desvio Padrão", minimo: "Mínimo", maximo: "Máximo", soma: "Soma" }}
                        error={error}
                        rows={describeByPeriodHomologed} loading={loading}
                        showTotals
                        totalsLabelColumn="periodo"
                    />
                </div>
            </div>
        </div>
    );
};
