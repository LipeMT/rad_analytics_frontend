import { useEffect, useMemo, useState } from "react";
import { activityRadarLabels } from "../../utils/chartKeys";
import { buildFilterSubtitle } from "../../utils/filterSummary";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ChartBox } from "../ChartBox";
import { GenericRadarChart } from "../Charts/RadarChart";
import { Filters, FiltersType } from "../Filters";

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

            const response = await res.json();

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

    const subtitle = useMemo(() => buildFilterSubtitle(filters), [filters]);

    useEffect(() => {
        fetchResults()
    }, [filters]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral</h2>
                <Filters onApply={handleApplyFilters} />
            </div>

            <ChartBox title="Distribuição de Horas por Atividade" subtitle={subtitle} loading={loading} error={error}>
                <GenericRadarChart values={data} labels={activityRadarLabels} color="#4f46e5"></GenericRadarChart>
            </ChartBox>
        </div>
    )
}