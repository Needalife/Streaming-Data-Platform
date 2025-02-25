import React, { useState, useEffect } from 'react';
import { useDashboard } from './DashboardContext';
import TotalTransactionsChart from './sub_components/TotalTransactionChart';
import SuccessTransactionsChart from './sub_components/SuccessTransactionChart';
import PendingTransactionsChart from './sub_components/PendingTransactionChart';
import FailedTransactionsChart from './sub_components/FailedTransactionChart';
import GradientSummaryCard from './sub_components/GradientSummaryCard';
import { formatDate } from './utils/dateFormatter';

// Helper to calculate the available height for the second row of charts.
const calculateChartsHeight = () => {
  const reservedSpace = 670;
  const availableHeight = window.innerHeight - reservedSpace;
  return availableHeight;
};

const Dashboard = () => {
  const { summaryData, windowStart, windowEnd, cumulativeTotal } = useDashboard();
  const [chartsHeight, setChartsHeight] = useState(() => calculateChartsHeight());
  const currentDate = formatDate(new Date());
  const domain = [windowStart, windowEnd];

  useEffect(() => {
    const updateChartsHeight = () => {
      setChartsHeight(calculateChartsHeight());
    };
    window.addEventListener('resize', updateChartsHeight);
    return () => window.removeEventListener('resize', updateChartsHeight);
  }, []);

  return (
    <div className="h-screen overflow-y-scroll">
      <h1 className="text-3xl font-bold mt-6 mb-6">Dashboard</h1>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 h-[450px]">
        <div className="flex-1 mr-4">
          <TotalTransactionsChart data={summaryData} domain={domain} />
        </div>
        <div className="w-full sm:w-auto max-w-sm mt-4 sm:mt-0">
          <GradientSummaryCard totalTransactions={cumulativeTotal} date={currentDate} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: chartsHeight }}>
        <SuccessTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
        <PendingTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
        <FailedTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
      </div>
    </div>
  );
};

export default Dashboard;
