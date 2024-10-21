import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdOutlineClear } from "react-icons/md";

const DateFilter = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    const handleClearDate = () => {
        setSelectedDate(null);
        onDateChange(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg h-full">
            <h2 className="text-lg font-bold text-gray-700 mb-4 border-b p-4">Filters by Date</h2>
            <div className="pr-6 pl-6 pb-10">
                <label htmlFor="date" className="block text-gray-600 text-sm font-bold mb-2">
                    Select date
                </label>

                <div className="relative flex items-center">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholderText="dd/MM/yyyy"
                    />

                    {selectedDate && (
                        <button
                            onClick={handleClearDate}
                            className="absolute right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                            <MdOutlineClear size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DateFilter;
