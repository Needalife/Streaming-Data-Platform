// src/dashboard/sub-components/GradientSummaryCard.jsx
import React, { useState, useEffect } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import { getArchivedData } from '../hooks/useArchivedData';
const GradientSummaryCard = ({ totalTransactions, date }) => {
  // Format today's date as yyyy-mm-dd.
  const todayFormatted = new Date().toISOString().split('T')[0];
  
  // Initialize with today's date and the provided current transactions.
  const [selectedDate, setSelectedDate] = useState(todayFormatted);
  const [transactions, setTransactions] = useState(totalTransactions);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    // If the selected date is today, use the provided totalTransactions.
    if (date === todayFormatted) {
      setTransactions(totalTransactions);
    } else {
      // Otherwise, call the Archived Data API.
      const data = await getArchivedData(date);
      // Extract archivedCount if available, else show 0.
      setTransactions(data?.archivedCount || 0);
    }
  };

  // Update today's transaction count if the prop changes.
  useEffect(() => {
    if (selectedDate === todayFormatted) {
      setTransactions(totalTransactions);
    }
  }, [totalTransactions, selectedDate, todayFormatted]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md h-full">
      <div className="text-lg font-bold">{selectedDate}</div>
      <div className="mt-4 text-center">
        <div className="text-base">
          {selectedDate === todayFormatted ? "Today, we have" : "On this day, we had"}
        </div>
        <div className="text-4xl font-bold my-2">{transactions}</div>
        <div className="text-base">Transactions.</div>
      </div>
      {/* Pass the callback to the MonthlyCalendar */}
      <MonthlyCalendar onDateSelect={handleDateSelect} />
    </div>
  );
};

export default GradientSummaryCard;