export interface Trend {
  periodo_letivo: string;
  total_somado: number;
  total_médio: number;
  n_registros: number;
  "variação_%_soma": number;
  "variação_%_média": number;
}

export interface StatCardType {
  title: string;
  value: string;
  change?: number;
  changeType: 'increase' | 'decrease';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface UserData {
  name: string;
  users: number;
  newUsers: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface PerformanceData {
  metric: string;
  current: number;
  target: number;
}