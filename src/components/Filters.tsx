import { SlidersHorizontal, X } from "lucide-react";
import { AutocompleteCampus } from "./AutocompleteCampus";
import { useEffect, useRef, useState } from "react";

export type FiltersType = {
    campus: string;
    startPeriod: string;
    endPeriod: string;
};

const MIN_PERIOD = "2018/1";
const MAX_PERIOD = "2024/2";

function periodToIndex(p: string) {
    const [y, s] = p.split("/");
    return (parseInt(y, 10) * 2) + (s === "2" ? 1 : 0);
}

function indexToPeriod(i: number) {
    const y = Math.floor(i / 2);
    const s = i % 2 === 0 ? 1 : 2;
    return `${y}/${s}`;
}

function getAllPeriods(min = MIN_PERIOD, max = MAX_PERIOD) {
    const a = periodToIndex(min);
    const b = periodToIndex(max);
    const out: string[] = [];
    for (let i = a; i <= b; i++) out.push(indexToPeriod(i));
    return out;
}

const PERIOD_OPTIONS = getAllPeriods();

function getRange(start: string, end: string) {
    let a = periodToIndex(start);
    let b = periodToIndex(end);
    if (a > b) [a, b] = [b, a]; // garante ordem
    const out: string[] = [];
    for (let i = a; i <= b; i++) out.push(indexToPeriod(i));
    return out;
}

interface FiltersProps {
    onApply: (value: FiltersType) => void
}

export const Filters = ({ onApply }: FiltersProps) => {

    const [filters, setFilters] = useState<FiltersType>({
        campus: "",
        startPeriod: MIN_PERIOD,
        endPeriod: MAX_PERIOD,
    });

    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    function onApplyFilters() {
        onApply(filters)
        setOpen(false);
    }

    function clearFilters() {
        const cleared: FiltersType = {
            campus: "",
            startPeriod: MIN_PERIOD,
            endPeriod: MAX_PERIOD,
        };
        setFilters(cleared);
        // fetchData(cleared).catch(console.error);
    }

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (!open) return;
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                >
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Filtrar resultados</h4>
                            <p className="text-xs text-gray-500">Refine por campus e período letivo.</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 hover:bg-gray-100"
                            aria-label="Fechar filtros"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Campus */}
                        <AutocompleteCampus
                            value={filters.campus}
                            onChange={(sigla) => setFilters(f => ({
                                ...f,
                                campus: sigla
                            }))} />

                        {/* Período letivo (início/fim) */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Início
                                </label>
                                <select
                                    value={filters.startPeriod}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, startPeriod: e.target.value }))
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                >
                                    {PERIOD_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Fim
                                </label>
                                <select
                                    value={filters.endPeriod}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, endPeriod: e.target.value }))
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                >
                                    {PERIOD_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* dica de UX: mostra quantos períodos serão filtrados */}
                        <p className="mt-1 text-xs text-gray-500">
                            Intervalo selecionado:{" "}
                            {getRange(filters.startPeriod, filters.endPeriod).length} períodos
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-800"
                        >
                            Limpar
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={onApplyFilters}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}