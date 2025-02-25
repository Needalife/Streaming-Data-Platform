import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

const MAX_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

export const DashboardProvider = ({ children }) => {
  const initialTimestampRef = useRef(null);
  const [windowStart, setWindowStart] = useState(Date.now());
  const [windowEnd, setWindowEnd] = useState(Date.now());
  const [summaryData, setSummaryData] = useState([]);
  const [cumulativeTotal, setCumulativeTotal] = useState(0);

  useWebSocket(
    (rawData) => {
      // No need for now
    },
    (structuredData) => {
      if (structuredData.summary) {
        const newSummary = {
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
          newWindowStart = initialTimestamp;
          newWindowEnd = newSummary.timestamp;
        } else {
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

  return (
    <DashboardContext.Provider value={{ summaryData, windowStart, windowEnd, cumulativeTotal }}>
      {children}
    </DashboardContext.Provider>
  );
};
