import React, { useState, useEffect } from 'react';
import { getAvailableDates } from '../api/transaction';

const DateFilter = ({ onDateChange, selectedDate }) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    async function fetchDates() {
      try {
        const dates = await getAvailableDates();
        // dates is an array like: ["collection_2025-02-19", "collection_2025-02-18"]
        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    }
    fetchDates();
  }, []);

  const handleChange = (e) => {
    onDateChange(e.target.value);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Date</label>
      <select
        value={selectedDate}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="All">All</option>
        {availableDates.map((dateStr) => (
          <option key={dateStr} value={dateStr}>
            {/* Display a friendlier date (e.g., remove "collection_") */}
            {dateStr.replace("collection_", "")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateFilter;
