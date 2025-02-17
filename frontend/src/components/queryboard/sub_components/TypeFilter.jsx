import React from 'react';

const TypeFilter = ({ onTypeChange }) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onTypeChange(selectedValue);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Type</label>
      <select
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="All">All</option>
        <option value="withdraw">Withdraw</option>
        <option value="deposit">Deposit</option>
      </select>
    </div>
  );
};

export default TypeFilter;
