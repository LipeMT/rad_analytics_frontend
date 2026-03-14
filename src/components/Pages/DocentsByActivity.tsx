import { useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ChartBox } from "../ChartBox";
import { BarChart, BarData } from "../Charts/BarChart";
import { Filters, FiltersType } from "../Filters";
import { MultiSelect } from "../MultiSelect";
import { Filter } from "lucide-react";

type ApiResponse = Record<string, Record<string, number>>;

export const DocentsByActivity = () => {
    const [data, setData] = useState<BarData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [intersectionData, setIntersectionData] = useState<BarData[]>([]);
    const [intersectionLoading, setIntersectionLoading] = useState(false);
    const [intersectionError, setIntersectionError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FiltersType>({
        campus: "",
        startPeriod: "",
        endPeriod: "",
    });

    const chartRef = useRef<HTMLDivElement>(null);
    const intersectionChartRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const ctrl = new AbortController();

        async function fetchDocentsByActivity() {
            try {
                setLoading(true);
                setError(null);

                let url = `${base}/rad/docents_by_activity`;
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

        fetchDocentsByActivity();

        return () => ctrl.abort();
    }, [base, queryString]);

    function handleApplyFilters(data: FiltersType) {
        setFilters(data);
    }

    const keysDescription = useMemo(() => {
        const desc: { [key: string]: { label: string; color: string } } = {
            "aula": { label: "Aula", color: "#3B82F6" },
            "administracao_representacao": { label: "Administração/Representação", color: "#6B7280" },
            "ensino": { label: "Ensino", color: "#10B981" },
            "capacitacao": { label: "Capacitação", color: "#F59E0B" },
            "extensao": { label: "Extensão", color: "#EF4444" },
            "pesquisa": { label: "Pesquisa", color: "#8B5CF6" },
        };
        return desc;
    }, [data]);

    const intersectionKey = "intersection";

    const intersectionKeysDescription = useMemo(() => ({
        [intersectionKey]: { label: "Intersecção", color: "#9333EA" }
    }), []);

    const [selectedKeys, setSelectedKeys] = useState<string[]>(Object.keys(keysDescription));

    const intersectionQueryString = useMemo(() => {
        const qs = new URLSearchParams();
        if (filters.campus) qs.append("campus", filters.campus);
        if (filters.startPeriod && filters.endPeriod) {
            qs.append("start_period", filters.startPeriod);
            qs.append("end_period", filters.endPeriod);
        }

        selectedKeys.forEach((activity) => {
            qs.append("activities", activity);
        });

        return qs.toString();
    }, [filters, selectedKeys]);

    useEffect(() => {
        const ctrl = new AbortController();

        async function fetchDocentsByActivitiesIntersection() {
            try {
                if (selectedKeys.length === 0) {
                    setIntersectionData([]);
                    setIntersectionError(null);
                    return;
                }

                setIntersectionLoading(true);
                setIntersectionError(null);

                let url = `${base}/rad/docents_by_activities_intersection`;
                if (intersectionQueryString) url += `?${intersectionQueryString}`;

                const res = await fetch(url, { signal: ctrl.signal });
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
                }

                const response: Record<string, number> = await res.json();

                const formatted: BarData[] = Object.entries(response).map(
                    ([period, value]) => ({ name: period, values: { [intersectionKey]: value } })
                );

                setIntersectionData(formatted);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setIntersectionError(getErrorMessage(err));
            } finally {
                setIntersectionLoading(false);
            }
        }

        fetchDocentsByActivitiesIntersection();

        return () => ctrl.abort();
    }, [base, intersectionQueryString, selectedKeys]);

    const selectedActivitiesLabel = selectedKeys.length > 0
        ? selectedKeys.map((key) => keysDescription[key]?.label ?? key).join(" · ")
        : "Nenhuma atividade selecionada";

    const selectedCampusLabel = filters.campus || "Todos os campi";
    const selectedPeriodLabel = filters.startPeriod && filters.endPeriod
        ? `${filters.startPeriod} até ${filters.endPeriod}`
        : "Todos os períodos";

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Docentes por Atividade</h2>
                    <p className="text-sm text-gray-600">Filtros aplicados: campus/período + atividades.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Filters onApply={handleApplyFilters} />
                    <MultiSelect
                        options={Object.entries(keysDescription).map(([key, desc]) => ({
                            value: key,
                            label: desc.label,
                        }))}
                        value={selectedKeys}
                        onChange={setSelectedKeys}
                        label="Atividades"
                        icon={<Filter className="h-4 w-4" />}
                    />
                </div>
            </div>

            <div className="mt-10">
                <ChartBox
                    title="Horas totais por docente"
                    subtitle={`Exibe eixos selecionados: ${selectedActivitiesLabel}. Campus: ${selectedCampusLabel}. Período: ${selectedPeriodLabel}.`}
                    loading={loading}
                    error={error}
                    chartExport={chartRef}
                >
                    <div
                        ref={chartRef}
                        className="rounded-lg bg-white p-4"
                    >
                        <BarChart
                            xAxisLabel="Período"
                            data={data}
                            keysDescription={keysDescription}
                            selectedKeys={selectedKeys}
                            stacked={false}
                        />
                    </div>
                </ChartBox>
            </div>

            <div className="mt-10">
                <ChartBox
                    title="Docentes em intersecção de atividades"
                    subtitle={`Intersecção de atividades selecionadas: ${selectedActivitiesLabel}. Campus: ${selectedCampusLabel}.`}
                    loading={intersectionLoading}
                    error={intersectionError}
                    chartExport={intersectionChartRef}
                >
                    <div
                        ref={intersectionChartRef}
                        className="rounded-lg bg-white p-4"
                    >
                        <BarChart
                            xAxisLabel="Período"
                            data={intersectionData}
                            keysDescription={intersectionKeysDescription}
                            selectedKeys={[intersectionKey]}
                            stacked={false}
                        />
                    </div>
                </ChartBox>
            </div>
        </div>
    );
};