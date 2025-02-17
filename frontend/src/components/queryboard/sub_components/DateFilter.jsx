import React from 'react';

const DateFilter = ({ onDateChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      // The HTML5 date input returns a value in "YYYY-MM-DD" format.
      const selectedDate = new Date(value);
      onDateChange(selectedDate);
    } else {
      onDateChange(null);
    }
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Date</label>
      <input
        type="date"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
  );
};

export default DateFilter;
