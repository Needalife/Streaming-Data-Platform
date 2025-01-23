import React, { useEffect, useState } from 'react';
import Filters from '../queryboard/sub_components/Filters';
import DataTable from '../queryboard/sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';

import { getAllTransactions } from '../../api/transaction';
import { getTransactionsByName } from '../../api/transaction';

const QueryBoard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState(['All']);
    const [selectedType, setSelectedType] = useState('All');

    const fetchData = async () => {
        setLoading(true);
        const response = await getAllTransactions();

        if (response.success) {
            setData(response.data);
            setFilteredData(response.data);
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateFilter = () => {
        let filtered = data;

        if (selectedDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.timestamp);
                return (
                    itemDate.getDate() === selectedDate.getDate() &&
                    itemDate.getMonth() === selectedDate.getMonth() &&
                    itemDate.getFullYear() === selectedDate.getFullYear()
                );
            });
        }

        if (!selectedStatuses.includes('All')) {
            filtered = filtered.filter((item) => selectedStatuses.includes(item.status));
        }

        if (selectedType !== 'All') {
            filtered = filtered.filter((item) => item.type === selectedType);
        }

        setFilteredData(filtered);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleStatusChange = (statuses) => {
        setSelectedStatuses(statuses);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const handleSearch = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            await fetchData();
        } else {
            const response = await getTransactionsByName(searchTerm);
            if (response.success) {
                setFilteredData(response.data);
            } else {
                setFilteredData([]);
                setError(response.message);
            }
        }
    };

    useEffect(() => {
        handleDateFilter();
    }, [selectedDate, selectedStatuses, selectedType, data]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                <p>Loading query...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-gray-100">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl p-8">Queryboard</h1>
                <SearchBar placeholder="Search by name" onSearch={handleSearch} />
            </div>

            <div className="p-6 rounded-lg shadow-md">
                <Filters
                    onDateChange={handleDateChange}
                    onStatusChange={handleStatusChange}
                    onTypeChange={handleTypeChange}
                />
            </div>

            <div className="p-6 rounded-lg shadow-md">
                <DataTable data={filteredData} refreshData={fetchData} />
            </div>
        </div>
    );
};

export default QueryBoard;