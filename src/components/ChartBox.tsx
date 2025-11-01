import { ReactNode } from "react"

export interface ChartBoxProps {
    title: string
    subtitle?: string
    children: ReactNode
    loading: boolean
    error: string | null
}

export const ChartBox = ({ title, subtitle, children, loading, error  }: ChartBoxProps) => {

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                {
                    subtitle && <p className="text-gray-600 text-sm">
                        {subtitle}
                    </p>
                }
            </div>
            {children}
        </div>

    )
}