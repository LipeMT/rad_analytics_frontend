import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    label: string;
    icon?: React.ReactNode;
}

export const MultiSelect = ({ options, value, onChange, label, icon = <SlidersHorizontal className="h-4 w-4" /> }: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const [tempSelected, setTempSelected] = useState<string[]>(value);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setTempSelected(value);
    }, [value]);

    function handleToggle(key: string) {
        setTempSelected(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    }

    function handleApply() {
        onChange(tempSelected);
        setOpen(false);
    }

    function handleCancel() {
        setTempSelected(value);
        setOpen(false);
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
                {icon} {label}
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                >
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
                            <p className="text-xs text-gray-500">Escolha quais {label.toLowerCase()} exibir no gráfico.</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 hover:bg-gray-100"
                            aria-label="Fechar"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={tempSelected.includes(option.value)}
                                    onChange={() => handleToggle(option.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};