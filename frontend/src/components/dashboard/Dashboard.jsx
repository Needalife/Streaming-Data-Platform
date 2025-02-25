import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import TotalTransactionsChart from './sub_components/TotalTransactionChart';
import SuccessTransactionsChart from './sub_components/SuccessTransactionChart';
import PendingTransactionsChart from './sub_components/PendingTransactionChart';
import FailedTransactionsChart from './sub_components/FailedTransactionChart';
import GradientSummaryCard from './sub_components/GradientSummaryCard';
import { formatDate } from './utils/dateFormatter';

const MAX_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to calculate the available height for the second row of charts.
const calculateChartsHeight = () => {
  const reservedSpace = 670; // For header, TotalTransactionsChart, and GradientSummaryCard
  const availableHeight = window.innerHeight - reservedSpace;
  return availableHeight
};

const Dashboard = () => {
  // Timestamp of the first data point using a ref.
  const initialTimestampRef = useRef(null);

  // State for the x-axis window boundaries.
  const [windowStart, setWindowStart] = useState(Date.now());
  const [windowEnd, setWindowEnd] = useState(Date.now());
  const [summaryData, setSummaryData] = useState([]);
  const [cumulativeTotal, setCumulativeTotal] = useState(0);

  // Calculate and store the dynamic height for the second row (charts).
  const [chartsHeight, setChartsHeight] = useState(() => calculateChartsHeight());

  useWebSocket(
    (rawData) => {
      // No need for now
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

        // If this is the first data point, store its timestamp.
        if (initialTimestampRef.current === null) {
          initialTimestampRef.current = newSummary.timestamp;
        }
        const initialTimestamp = initialTimestampRef.current;

        // Update the cumulative total.
        setCumulativeTotal(prev => prev + newSummary.totalTransactions);

        let newWindowStart, newWindowEnd;
        const elapsed = newSummary.timestamp - initialTimestamp;
        if (elapsed < MAX_WINDOW) {
          // Before reaching 5 minutes, the window grows gradually.
          newWindowStart = initialTimestamp;
          newWindowEnd = newSummary.timestamp;
        } else {
          // Once 5 minutes have passed, keep a fixed 5-minute window.
          newWindowStart = newSummary.timestamp - MAX_WINDOW;
          newWindowEnd = newSummary.timestamp;
        }

        // Update the window boundaries.
        setWindowStart(newWindowStart);
        setWindowEnd(newWindowEnd);

        // Add the new summary and keep only points within the current window.
        setSummaryData(prevData =>
          [...prevData.filter(item => item.timestamp >= newWindowStart), newSummary]
        );
      }
    }
  );

  // The x-axis domain for the charts.
  const domain = [windowStart, windowEnd];
  const currentDate = formatDate(new Date());

  // Update chartsHeight on window resize.
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
      {/* Second row: Three charts in a grid that fills the remaining screen height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: chartsHeight }}>
        <SuccessTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
        <PendingTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
        <FailedTransactionsChart data={summaryData} domain={domain} chartHeight={chartsHeight} />
      </div>
    </div>
  );
};

export default Dashboard;
