import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
// import { RevenueChart } from './charts/RevenueChart';
// import { UserChart } from './charts/UserChart';
// import { CategoryChart } from './charts/CategoryChart';
import { PerformanceChart } from './charts/PerformanceChart';
import { StatCardType, Trend } from '../types';
// import {
//   statCards,
//   // revenueData, 
//   // userData, 
//   // categoryData 
// } from '../data/mockData';

export const Dashboard: React.FC = () => {
  // const [data, setData] = useState<Trend[]>([])
  const [statCards, setStatCards] = useState<StatCardType[]>([])

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/rad/trend`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }
      const payload = await res.json()

      // setData(payload)

      const total_records = payload.reduce((sum: number, p: Trend) => sum + p.n_registros, 0)

      const totalRecordsStatCard: StatCardType = {
        title: "Total de Registros",
        value: total_records,
        changeType: "increase"
      }

      setStatCards([totalRecordsStatCard])
    }
    loadData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} data={stat} />
        ))}
      </div>

      {/* Charts Grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <UserChart data={userData} />
        <CategoryChart data={categoryData} />
      </div> */}

      <div className="grid grid-cols-1 gap-8">
        <PerformanceChart target={120} />
      </div>
    </div>
  );
};