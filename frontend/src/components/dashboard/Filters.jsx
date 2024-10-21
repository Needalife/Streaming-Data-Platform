import React from 'react';
import DateFilter from './DateFilter';
import StatusFilter from './StatusFilter';
import TypeFilter from './TypeFilter';  // Import TypeFilter

const Filters = ({ onDateChange, onStatusChange, onTypeChange }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex space-x-6">
            {/* Date Filter */}
            <div className="flex-1">
                <DateFilter onDateChange={onDateChange} />
            </div>

            {/* Status Filter */}
            <div className="flex-1">
                <StatusFilter onStatusChange={onStatusChange} />
            </div>

            {/* Type Filter */}
            <div className="flex-1">
                <TypeFilter onTypeChange={onTypeChange} />
            </div>
        </div>
    );
};

export default Filters;
