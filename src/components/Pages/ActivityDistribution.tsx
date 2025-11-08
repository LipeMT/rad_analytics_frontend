import { useEffect, useMemo, useState } from "react"
import { Filters, FiltersType } from "../Filters"
import { ChartBox } from "../ChartBox";
import { GenericRadarChart } from "../charts/RadarChart";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const ActivityDistribution = () => {
    const [data, setData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FiltersType>({
        campus: "",
        startPeriod: "",
        endPeriod: "",
    })

    const base = import.meta.env.VITE_BASE_URL;

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

    function handleApplyFilters(data: FiltersType) {
        setFilters(data);
    }

    async function fetchResults() {
        try {
            setLoading(true);
            setError(null);

            let url = `${base}/rad/activities_distribution`;
            if (queryString) url += "?" + queryString;

            const res = await fetch(url, { signal: ctrl.signal });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} - ${res.statusText}`);
            }

            const response = await res.json(); // ex: { aula: 10, ensino: 20, ... }

            // Garante que tudo é número e trata null/undefined
            const formatted: Record<string, number> = Object.fromEntries(
                Object.entries(response ?? {}).map(([key, value]) => [
                    key,
                    typeof value === "number" ? value : 0
                ])
            );

            setData(formatted);
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchResults()
    }, [filters]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            Top bar
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral</h2>
                <Filters onApply={handleApplyFilters} />
            </div>

            <ChartBox title="Distribuição de Atividades" subtitle={filters.campus ? filters.campus : "Geral"} loading={loading} error={error}>
                <GenericRadarChart values={data} labels={{
                    aula: "Aula",
                    ensino: "Ensino",
                    capacitacao: "Capacitação",
                    pesquisa: "Pesquisa",
                    extensao: "Extensão",
                    administracao_r: "Administração"
                }}
                    color="#4f46e5"></GenericRadarChart>
            </ChartBox>

            {/* Tabela abaixo do gráfico */}
            {/* <div className="grid grid-cols-1 gap-4 mt-10">
                <h3 className="text-base font-semibold text-gray-900">Detalhamento por período</h3>
                <PerformanceTable filters={filters} />
            </div> */}
        </div>
    )
}