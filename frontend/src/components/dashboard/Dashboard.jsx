import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import TotalTransactionsChart from './sub_components/TotalTransactionChart';
import SuccessTransactionsChart from './sub_components/SuccessTransactionChart';
import PendingTransactionsChart from './sub_components/PendingTransactionChart';
import FailedTransactionsChart from './sub_components/FailedTransactionChart';
import GradientSummaryCard from './sub_components/GradientSummaryCard';
import { formatDate } from './utils/dateFormatter';

const X_MINUTES = 5 * 60 * 1000;
const FIVE_SEC = 5 * 1000;

const Dashboard = () => {
  // Initialize the x-axis window to be from "now" to "now + 10 minutes"
  const initialStart = Date.now();
  const [windowStart, setWindowStart] = useState(initialStart);
  const [windowEnd, setWindowEnd] = useState(initialStart + X_MINUTES);
  const [summaryData, setSummaryData] = useState([]);
  const [cumulativeTotal, setCumulativeTotal] = useState(0);

  useWebSocket(
    (rawData) => {
      // Raw data here.
    },
    (structuredData) => {
      if (structuredData.summary) {
        const newSummary = {
          // Convert Unix seconds to milliseconds.
          timestamp: structuredData.summary.timestamp * 1000,
          totalTransactions: structuredData.summary.totalTransactions,
          successTransactions: structuredData.summary.successTransactions,
          ongoingTransactions: structuredData.summary.ongoingTransactions,
          failedTransactions: structuredData.summary.failedTransactions,
        };

        // Cumulative total
        setCumulativeTotal(prev => prev + newSummary.totalTransactions);

        // Shift the window forward if the new data reaches/exceeds the current windowEnd.
        let updatedStart = windowStart;
        let updatedEnd = windowEnd;
        while (newSummary.timestamp >= updatedEnd) {
          updatedStart += FIVE_SEC;
          updatedEnd += FIVE_SEC;
        }
        if (updatedEnd !== windowEnd) {
          setWindowStart(updatedStart);
          setWindowEnd(updatedEnd);
          // Remove any summary points that now fall outside the new window.
          setSummaryData((prevData) => prevData.filter(item => item.timestamp >= updatedStart));
        }

        // Add the new summary and keep only data points that fall within the current window.
        setSummaryData((prevData) =>
          [...prevData, newSummary].filter(item => item.timestamp >= updatedStart)
        );
      }
    }
  );

  // Domain for x-axis for all charts.
  const domain = [windowStart, windowEnd];
  const currentDate = formatDate(new Date());

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
      {/* Top row using flex */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
        {/* Total Transactions Chart fills available space */}
        <div className="flex-1 mr-4">
          <TotalTransactionsChart data={summaryData} domain={domain} />
        </div>
        {/* Summary Card container with max width */}
        <div className="w-full sm:w-auto max-w-sm mt-4 sm:mt-0">
          <GradientSummaryCard totalTransactions={cumulativeTotal} date={currentDate} />
        </div>
      </div>
      
      {/* Second row: Three charts in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SuccessTransactionsChart data={summaryData} domain={domain} />
        <PendingTransactionsChart data={summaryData} domain={domain} />
        <FailedTransactionsChart data={summaryData} domain={domain} />
      </div>
    </div>
  );
};

export default Dashboard;
