import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type SimpleRadarChartProps = {
  values: Record<string, number>;
  labels: Record<string, string>;        
  color: string;        
  height?: number;
  outerRadius?: number | string;
  domain?: [number | 'auto', number | 'auto'];
};

export const GenericRadarChart = ({
  values,
  labels,
  color,
  height = 340,
  outerRadius = '75%',
  domain = [0, 'auto']
}: SimpleRadarChartProps) => {
  const data = Object.entries(values).map(([key, value]) => ({
    axis: labels[key] ?? key,
    key,
    value
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart
          data={data}
          outerRadius={outerRadius}
          margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis domain={domain} />
          <Tooltip
            formatter={(value: number, _name: string, payload: any) => {
              const label = payload?.payload?.axis ?? '';
              return [value.toLocaleString('pt-BR'), label];
            }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.5}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
