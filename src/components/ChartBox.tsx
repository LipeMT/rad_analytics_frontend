import { Download } from "lucide-react"
import { ReactNode, RefObject, useRef } from "react"
import { exportarPNG } from "../utils/exportToPng"

export interface ChartBoxProps {
    title: string
    subtitle?: string
    children: ReactNode
    loading: boolean
    error: string | null
    controls?: ReactNode
    chartExport?: RefObject<HTMLElement>
}

export const ChartBox = ({ title, subtitle, children, loading, error, controls, chartExport }: ChartBoxProps) => {
    const boxRef = useRef<HTMLDivElement | null>(null)
    const exportRef = chartExport ?? boxRef

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

    return (
        <div ref={boxRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    {
                        subtitle && <p className="text-gray-600 text-sm">
                            {subtitle}
                        </p>
                    }
                </div>
                <div className="flex items-center gap-3">
                    {controls && controls}
                    <button
                        type="button"
                        onClick={() => exportarPNG(exportRef, "image.png")}
                        className="inline-flex h-9 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                        title="Exportar PNG"
                        aria-label="Exportar PNG"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>
            {children}
        </div>

    )
}