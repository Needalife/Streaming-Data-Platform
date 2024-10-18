import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchTimeDate = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            <div className="bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-bold text-gray-700 mb-4 border-b p-4">Time and Date Search</h2>

                <div className="pr-6 pl-6 pb-10">
                    <label htmlFor="date" className="block text-gray-600 text-sm font-bold mb-2 ">
                        Select Date
                    </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="w-full mb-8 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholderText="dd/mm/yyyy"
                        showTimeSelect={false}
                        showTimeInput={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchTimeDate

