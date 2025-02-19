import React from 'react';
import DateFilter from './DateFilter';
import StatusFilter from './StatusFilter';
import AmountFilter from './AmountFilter';

const Filters = ({ 
  onDateChange, 
  onStatusChange, 
  onTypeChange, 
  onAmountChange,
  selectedDate, 
  selectedStatuses, 
  selectedMinAmount,
  selectedMaxAmount
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap gap-6">
      {/* Date Filter */}
      <div className="flex-1 min-w-[200px]">
        <DateFilter onDateChange={onDateChange} selectedDate={selectedDate} />
      </div>
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
