import { Bar, BarChart as BarChartRecharts, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type BarChartProps = {
    data: BarData[]
    keysDescription: { [key: string]: KeyDescription }
    stacked?: boolean
    showLegend?: boolean
    showAxisDescription?: boolean
    xAxisLabel?: string
    yAxisLabel?: string
    selectedKeys?: string[]
}

type KeyDescription = {
    label: string
    color: string
}

export type BarData = {
    name: string
    values: { [key: string]: number }
}

export const BarChart = ({ data, keysDescription, stacked = true, showLegend = true, showAxisDescription = true, xAxisLabel, yAxisLabel, selectedKeys }: BarChartProps) => {
    const chartData = data.map(d => ({ name: d.name, ...d.values }));

    const filteredKeysDescription = selectedKeys && selectedKeys.length > 0
        ? Object.fromEntries(Object.entries(keysDescription).filter(([key]) => selectedKeys.includes(key)))
        : keysDescription;

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <ul style={{ listStyle: 'none', padding:0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 20, marginBottom: 5 }}>
                        <span style={{ backgroundColor: entry.color, width: 12, height: 12, marginRight: 8, borderRadius: 2 }}></span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{keysDescription[entry.value]?.label || entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChartRecharts
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        label={showAxisDescription && xAxisLabel ? { value: xAxisLabel, position: 'insideBottom' } : undefined} />
                    <YAxis stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={showAxisDescription && yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
                    <Tooltip contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                        formatter={(value: number, name: string) => {
                            const label = keysDescription[name]?.label ?? name
                            return [value.toLocaleString('pt-BR'), label]
                        }}
                    />
                    {showLegend && <Legend content={renderLegend} />}
                    {
                        Object.entries(filteredKeysDescription).map(([key, description]) => {
                            const barProps: any = { dataKey: key, fill: description.color, radius: [4, 4, 0, 0] };
                            if (stacked) barProps.stackId = 'a';
                            return <Bar key={key} {...barProps} />;
                        })
                    }
                </BarChartRecharts>
            </ResponsiveContainer>
        </div>
    );
};
