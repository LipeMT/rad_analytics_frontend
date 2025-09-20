import { StatCard, RevenueData, UserData, CategoryData, PerformanceData } from '../types';

export const statCards: StatCard[] = [
  {
    title: 'Total Revenue',
    value: '$2,345,678',
    change: 12.5,
    changeType: 'increase',
    icon: 'DollarSign'
  },
  {
    title: 'Active Users',
    value: '45,892',
    change: 8.2,
    changeType: 'increase',
    icon: 'Users'
  },
  {
    title: 'Orders',
    value: '12,456',
    change: -3.1,
    changeType: 'decrease',
    icon: 'ShoppingCart'
  },
  {
    title: 'Conversion Rate',
    value: '3.42%',
    change: 15.7,
    changeType: 'increase',
    icon: 'TrendingUp'
  }
];

export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 245000, profit: 45000, expenses: 200000 },
  { month: 'Feb', revenue: 289000, profit: 62000, expenses: 227000 },
  { month: 'Mar', revenue: 356000, profit: 89000, expenses: 267000 },
  { month: 'Apr', revenue: 412000, profit: 125000, expenses: 287000 },
  { month: 'May', revenue: 478000, profit: 156000, expenses: 322000 },
  { month: 'Jun', revenue: 523000, profit: 189000, expenses: 334000 },
  { month: 'Jul', revenue: 589000, profit: 234000, expenses: 355000 },
  { month: 'Aug', revenue: 634000, profit: 267000, expenses: 367000 },
  { month: 'Sep', revenue: 698000, profit: 298000, expenses: 400000 },
  { month: 'Oct', revenue: 745000, profit: 334000, expenses: 411000 },
  { month: 'Nov', revenue: 812000, profit: 378000, expenses: 434000 },
  { month: 'Dec', revenue: 867000, profit: 423000, expenses: 444000 }
];

export const userData: UserData[] = [
  { name: 'Mon', users: 1200, newUsers: 180 },
  { name: 'Tue', users: 1890, newUsers: 245 },
  { name: 'Wed', users: 2340, newUsers: 320 },
  { name: 'Thu', users: 1980, newUsers: 210 },
  { name: 'Fri', users: 2890, newUsers: 400 },
  { name: 'Sat', users: 3200, newUsers: 450 },
  { name: 'Sun', users: 2100, newUsers: 280 }
];

export const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 35, color: '#3B82F6' },
  { name: 'Clothing', value: 25, color: '#6366F1' },
  { name: 'Home & Garden', value: 20, color: '#10B981' },
  { name: 'Books', value: 12, color: '#F59E0B' },
  { name: 'Sports', value: 8, color: '#EF4444' }
];

export const performanceData: PerformanceData[] = [
  { metric: 'Sales Target', current: 78, target: 100 },
  { metric: 'Customer Satisfaction', current: 92, target: 100 },
  { metric: 'Market Share', current: 64, target: 100 },
  { metric: 'Brand Awareness', current: 85, target: 100 }
];