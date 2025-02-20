import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebsocket';
import TotalTransactionsChart from './sub_components/TotalTransactionChart';
import SuccessTransactionsChart from './sub_components/SuccessTransactionChart';
import PendingTransactionsChart from './sub_components/PendingTransactionChart';
import FailedTransactionsChart from './sub_components/FailedTransactionChart';

const Dashboard = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  // Set up WebSocket connections with our custom hook.
  useWebSocket(
    (rawData) => {
      // Handle raw data (for individual transaction events)
      if (rawData.fullDocument) {
        const newData = {
          timestamp: new Date(rawData.fullDocument.createdAt).toLocaleTimeString(),
          status: rawData.fullDocument.status,
        };
        setTransactionsData((prevData) => [...prevData, newData]);
      }
    },
    (structuredData) => {
      // Handle structured summary data.
      if (structuredData.summary) {
        const newSummary = {
          timestamp: new Date(structuredData.summary.timestamp * 1000).toLocaleTimeString(),
          totalTransactions: structuredData.summary.totalTransactions,
          successTransactions: structuredData.summary.successTransactions,
          ongoingTransactions: structuredData.summary.ongoingTransactions,
          failedTransactions: structuredData.summary.failedTransactions,
        };
        setSummaryData((prevData) => [...prevData, newSummary]);
      }
    }
  );

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TotalTransactionsChart data={summaryData} />
      <SuccessTransactionsChart data={summaryData} />
      <PendingTransactionsChart data={summaryData} />
      <FailedTransactionsChart data={summaryData} />
    </div>
  );
};

export default Dashboard;