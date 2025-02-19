import React from 'react';

const StatusFilter = ({ onStatusChange, selectedStatus }) => {
  const handleChange = (e) => {
    // Wrap the selected value in an array for consistency.
    onStatusChange([e.target.value]);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Status</label>
      <select
        value={selectedStatus}
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
