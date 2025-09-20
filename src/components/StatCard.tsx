import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';
import { StatCard as StatCardType } from '../types';

interface StatCardProps {
  data: StatCardType;
  icon?: LucideIcon; // ou: React.ElementType
}

export const StatCard: React.FC<StatCardProps> = ({ data, icon: Icon = TrendingUp }) => {
  const isPositive = data.changeType === 'increase';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{data.title}</p>
          <p className="text-2xl font-bold text-gray-900">{data.value}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {data.change && <div className="flex items-center mt-4">
        {isPositive ? (
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(data.change)}%
        </span>
        <span className="text-gray-600 text-sm ml-2">vs last month</span>
      </div>}
    </div>
  );
};
