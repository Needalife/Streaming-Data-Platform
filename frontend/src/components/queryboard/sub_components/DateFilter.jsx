// DateFilter.jsx
import React from 'react';

const DateFilter = ({ onDateChange, selectedDate }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      // value is in "YYYY-MM-DD" format; create a Date object.
      onDateChange(new Date(value));
    } else {
      onDateChange(null);
    }
  };

  // Format the selected date as "YYYY-MM-DD" for the input value.
  const formattedDate = selectedDate
    ? selectedDate.toISOString().substring(0, 10)
    : '';

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Date</label>
      <input
        type="date"
        value={formattedDate}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
  );
};

export default DateFilter;
