import React, { useState, useEffect } from 'react';

const AmountFilter = ({ onAmountChange, selectedMinAmount, selectedMaxAmount }) => {
  // Local state for the amount inputs
  const [localMin, setLocalMin] = useState(selectedMinAmount);
  const [localMax, setLocalMax] = useState(selectedMaxAmount);

  // Update local state if parent values change
  useEffect(() => {
    setLocalMin(selectedMinAmount);
  }, [selectedMinAmount]);

  useEffect(() => {
    setLocalMax(selectedMaxAmount);
  }, [selectedMaxAmount]);

  const handleMinChange = (e) => {
    setLocalMin(e.target.value);
  };

  const handleMaxChange = (e) => {
    setLocalMax(e.target.value);
  };

  const handleApply = () => {
    console.log("AmountFilter: Applying filter with values:", localMin, localMax);
    // Pass the current local state values to the parent handler
    onAmountChange({ min: localMin, max: localMax });
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Amount</label>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min Amount"
          value={localMin}
          onChange={handleMinChange}
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={localMax}
          onChange={handleMaxChange}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleApply}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded p-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default AmountFilter;
