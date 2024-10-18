import React from 'react'
import SearchTimeDate from '../components/dashboard/SearchTimeDate'
import FilterByStatus from '../components/dashboard/FilterByStatus'
import FilterByPrice from '../components/dashboard/FilterByPrice'
import DataTable from '../components/dashboard/DataTable'
import SearchBar from '../components/dashboard/SearchBar'

import { useEffect, useState } from 'react';

const DashBoard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/confluent_messages_test.json')
            .then((response) => response.json())
            .then((jsonData) => setData(jsonData))
            .catch((error) => console.error('Error loading data:', error));
    }, []);

    return (
        <div className="space-y-6 bg-gray-100">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-3xl p-8">Query Dashboard</h1>
                <SearchBar />
            </div>

            <div className="flex space-x-4 p-6">
                <div className="flex-1">
                    <SearchTimeDate className="w-full" />
                </div>

                <div className="bg-white rounded-lg shadow-md w-1/3">
                    <div className="flex items-start justify-between ">
                        <div className="flex-1">
                            <FilterByStatus />
                        </div>
                        <div className="flex-1">
                            <FilterByPrice />
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-6 rounded-lg shadow-md">
                <DataTable data={data} />
            </div>
        </div>

    )
}

export default DashBoard
