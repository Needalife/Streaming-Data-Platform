import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import TotalTransactionsChart from './sub_components/TotalTransactionChart';
import SuccessTransactionsChart from './sub_components/SuccessTransactionChart';
import PendingTransactionsChart from './sub_components/PendingTransactionChart';
import FailedTransactionsChart from './sub_components/FailedTransactionChart';
import GradientSummaryCard from './sub_components/GradientSummaryCard';

const X_MINUTES = 5 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

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
          updatedStart += ONE_MINUTE;
          updatedEnd += ONE_MINUTE;
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
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="p-4">
      {/* Top row: Total Transactions Chart and Gradient Summary Card side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Transactions Chart spans 2 columns */}
        <div className="lg:col-span-2">
          <TotalTransactionsChart data={summaryData} domain={domain} />
        </div>
        {/* Gradient Summary Card takes up 1 column and is smaller in width */}
        <div>
          <GradientSummaryCard totalTransactions={cumulativeTotal} date={currentDate} />
        </div>
      </div>
      
      {/* Second row: Three charts in a single row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SuccessTransactionsChart data={summaryData} domain={domain} />
        <PendingTransactionsChart data={summaryData} domain={domain} />
        <FailedTransactionsChart data={summaryData} domain={domain} />
      </div>
    </div>
  );
};

export default Dashboard;
