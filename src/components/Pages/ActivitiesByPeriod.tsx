import { Eye } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ChartBox } from "../ChartBox";
import { BarChart, BarData } from "../Charts/BarChart";
import { Filters, FiltersType } from "../Filters";
import { MultiSelect } from "../MultiSelect";


type ApiResponse = Record<string, Record<string, number>>;

export const ActivitiesByPeriod = () => {
    const [data, setData] = useState<BarData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FiltersType>({
        campus: "",
        startPeriod: "",
        endPeriod: "",
    });

    const chartRef = useRef<HTMLDivElement>(null);

    const base = import.meta.env.VITE_BASE_URL;

    const queryString = useMemo(() => {
        const qs = new URLSearchParams();
        if (filters.campus) qs.append("campus", filters.campus);
        if (filters.startPeriod && filters.endPeriod) {
            qs.append("start_period", filters.startPeriod);
            qs.append("end_period", filters.endPeriod);
        }
        return qs.toString();
    }, [filters]);

    const ctrl = new AbortController();

    async function fetchActivities() {
        try {
            setLoading(true);
            setError(null);

            let url = `${base}/rad/activities_by_period`;
            if (queryString) url += `?${queryString}`;

            const res = await fetch(url, { signal: ctrl.signal });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} - ${res.statusText}`);
            }
            const response: ApiResponse = await res.json();

            const formatted: BarData[] = Object.entries(response).map(
                ([period, activities]) => ({ name: period, values: activities })
            );

            setData(formatted);

        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    function handleApplyFilters(data: FiltersType) {
        setFilters(data);
    }

    useEffect(() => {
        fetchActivities();
    }, [filters]);

    const keysDescription = useMemo(() => {
        const desc: { [key: string]: { label: string; color: string } } = {
            "aula": { label: "Aula", color: "#3B82F6" },
            "ensino": { label: "Ensino", color: "#10B981" },
            "capacitacao": { label: "Capacitação", color: "#F59E0B" },
            "extensao": { label: "Extensão", color: "#EF4444" },
            "pesquisa": { label: "Pesquisa", color: "#8B5CF6" },
        };
        return desc;
    }, [data]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>(Object.keys(keysDescription));

    const controls = (
        <MultiSelect
            options={Object.entries(keysDescription).map(([key, desc]) => ({ value: key, label: desc.label }))}
            value={selectedKeys}
            onChange={setSelectedKeys}
            label="Atividades"
            icon={<Eye className="h-4 w-4" />}
        />
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Atividades por Período</h2>
                <Filters onApply={handleApplyFilters} />
            </div>

            <ChartBox
                title="Horas totais por período"
                subtitle="Soma das horas de cada atividade"
                loading={loading}
                error={error}
                controls={controls}
                chartExport={chartRef}
            >
                <div
                    ref={chartRef}
                    className="rounded-lg bg-white p-4"
                >
                    <BarChart
                        data={data}
                        keysDescription={keysDescription}
                        selectedKeys={selectedKeys}
                        stacked={false} />
                </div>
            </ChartBox>
        </div>
    );
};