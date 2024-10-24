import React, { useState } from 'react';

const StatusFilter = ({ onStatusChange }) => {
    const [selectedStatuses, setSelectedStatuses] = useState(['All']);

    const statuses = ['All', 'ongoing', 'success', 'error'];

    const handleStatusChange = (status) => {
        let updatedStatuses;

        if (status === 'All') {
            updatedStatuses = ['All'];
        } else {
            if (selectedStatuses.includes(status)) {
                updatedStatuses = selectedStatuses.filter((s) => s !== status);
            } else {
                updatedStatuses = [...selectedStatuses, status].filter((s) => s !== 'All');
            }
        }

        setSelectedStatuses(updatedStatuses);
        onStatusChange(updatedStatuses.length === 0 ? ['All'] : updatedStatuses);
    };

    // Helper function to capitalize the first letter
    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="bg-white shadow-md rounded-lg h-full">
            <h2 className="text-lg font-bold text-gray-700 mb-4 border-b p-4">Filter by Status</h2>
            <div className="pr-6 pl-6 pb-10">
                <div className="flex flex-col space-y-2">
                    {statuses.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-500 h-5 w-5"
                                checked={selectedStatuses.includes(status)}
                                onChange={() => handleStatusChange(status)}
                            />
                            <span className="ml-2 text-gray-700">{capitalizeFirstLetter(status)}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusFilter;
