// Filters.jsx
import React from 'react';
import DateFilter from './DateFilter';
import StatusFilter from './StatusFilter';

const Filters = ({ 
    onDateChange, 
    onStatusChange, 
    onTypeChange, 
    selectedDate, 
    selectedStatuses, 
    selectedType 
}) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex space-x-6">
            {/* Date Filter */}
            <div className="flex-1">
                <DateFilter onDateChange={onDateChange} selectedDate={selectedDate} />
            </div>

            {/* Status Filter */}
            <div className="flex-1">
                {/* For the select, we display the first value in the array */}
                <StatusFilter onStatusChange={onStatusChange} selectedStatus={selectedStatuses[0]} />
            </div>
        </div>
    );
};

export default Filters;
