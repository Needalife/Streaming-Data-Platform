import React from 'react';

const StatusFilter = ({ onStatusChange }) => {
  const handleChange = (e) => {
    // Send the selected value in an array.
    const selectedValue = e.target.value;
    onStatusChange([selectedValue]);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Status</label>
      <select
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="All">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  );
};

export default StatusFilter;
