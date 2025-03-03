import React from 'react';
import StatusFilter from './StatusFilter';
import AmountFilter from './AmountFilter';

const Filters = ({ 
  onStatusChange, 
  onAmountChange,
  selectedStatuses, 
  selectedMinAmount,
  selectedMaxAmount
}) => {
  return (
    <div className="h-[150px] bg-white shadow-md rounded-lg p-6 flex flex-wrap gap-6">
      {/* Status Filter */}
      <div className="flex-1 min-w-[200px]">
        <StatusFilter onStatusChange={onStatusChange} selectedStatus={selectedStatuses[0]} />
      </div>
      {/* Amount Filter */}
      <div className="flex-1 min-w-[300px]">
        <AmountFilter 
          onAmountChange={onAmountChange} 
          selectedMinAmount={selectedMinAmount} 
          selectedMaxAmount={selectedMaxAmount} 
        />
      </div>
    </div>
  );
};

export default Filters;
