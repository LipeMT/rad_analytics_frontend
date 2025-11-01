import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type StackedBarChartProps = {
    data: BarData[]
    keysDescription: { [key: string]: KeyDescription }
}

type KeyDescription = {
    label: string
    color: string
}

export type BarData = {
    name: string
    values: { [key: string]: number }
}

export const StackedBarChart = ({ data, keysDescription }: StackedBarChartProps) => {
    const chartData = data.map(d => ({ name: d.name, ...d.values }));
    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                        height={80} />
                    <YAxis stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false} />
                    <Tooltip contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                        formatter={(value: number, name: string) => {
                            const label = keysDescription[name]?.label ?? name
                            return [value.toFixed(2), label]
                        }}
                    />
                    {
                        Object.entries(keysDescription).map(([key, description]) =>
                            <Bar key={key} dataKey={key} stackId="a" fill={description.color} radius={[4, 4, 0, 0]} />
                        )
                    }
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
