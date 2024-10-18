import React, { useState } from 'react';

const FilterByStatus = () => {
    const [status, setStatus] = useState('Success');

    return (

        <div className="max-w-md mx-auto rounded-lg mb-8">
            <div className="border-b w-full">
                <h2 className="text-lg font-bold text-gray-700 m-4">
                    Filter by Status
                </h2>
            </div>

            <div className="space-y-4 m-6">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="success"
                        name="status"
                        value="Success"
                        checked={status === 'Success'}
                        onChange={() => setStatus('Success')}
                        className="hidden"
                    />
                    <label htmlFor="success" className="flex items-center cursor-pointer">
                        <span
                            className={`w-4 h-4 inline-block mr-2 border border-gray-400 rounded-sm ${status === 'Success' ? 'bg-blue-500' : 'bg-white'
                                }`}
                        ></span>
                        <span className="text-gray-600">Success</span>
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="radio"
                        id="ongoing"
                        name="status"
                        value="Ongoing"
                        checked={status === 'Ongoing'}
                        onChange={() => setStatus('Ongoing')}
                        className="hidden"
                    />
                    <label htmlFor="ongoing" className="flex items-center cursor-pointer">
                        <span
                            className={`w-4 h-4 inline-block mr-2 border border-gray-400 rounded-sm ${status === 'Ongoing' ? 'bg-blue-500' : 'bg-white'
                                }`}
                        ></span>
                        <span className="text-gray-600">Ongoing</span>
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="radio"
                        id="error"
                        name="status"
                        value="Error"
                        checked={status === 'Error'}
                        onChange={() => setStatus('Error')}
                        className="hidden"
                    />
                    <label htmlFor="error" className="flex items-center cursor-pointer">
                        <span
                            className={`w-4 h-4 inline-block mr-2 border border-gray-400 rounded-sm ${status === 'Error' ? 'bg-blue-500' : 'bg-white'
                                }`}
                        ></span>
                        <span className="text-gray-600">Error</span>
                    </label>
                </div>
            </div>
        </div>

    );
};

export default FilterByStatus;
