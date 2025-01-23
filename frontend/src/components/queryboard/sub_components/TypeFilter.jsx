import React, { useState } from 'react';

const TypeFilter = ({ onTypeChange }) => {
    const [selectedType, setSelectedType] = useState('All');

    const types = [
        'All',
        'Currency Conversions',
        'Deposits',
        'Direct Debits',
        'Investments',
        'Refunds',
        'Standing Orders',
        'Transfers',
        'Wire Transfers',
        'Withdrawals',
        'Others'
    ];

    const handleTypeChange = (event) => {
        const selected = event.target.value;
        setSelectedType(selected);
        onTypeChange(selected);
    };

    return (
        <div className="bg-white shadow-md rounded-lg h-full">
            <h2 className="text-lg font-bold text-gray-700 mb-4 border-b p-4">Filter by Types</h2>
            <div className="pr-6 pl-6 pb-10">
                <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TypeFilter;
