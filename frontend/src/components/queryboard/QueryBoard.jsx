// QueryBoard.jsx
import React, { useState, useEffect } from 'react';
import Filters from '../queryboard/sub_components/Filters';
import DataTable from '../queryboard/sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';
import { getTransactions } from './api/transaction';

const QueryBoard = () => {
  // Data & loading states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [hasNextPage, setHasNextPage] = useState(false);

  // Build filter parameters for the backend query
  const buildFilterParams = () => {
    const params = {};
    if (searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
      params.all = false;
    } else {
      params.all = false;
    }
    if (!selectedStatuses.includes('All') && selectedStatuses.length > 0) {
      params.status = selectedStatuses.join(',');
    }
    if (minAmount !== '') {
      params.minAmount = Number(minAmount);
    }
    if (maxAmount !== '') {
      params.maxAmount = Number(maxAmount);
    }
    return params;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (selectedDate === "All") {
      // Use backend pagination when no specific date filter is applied.
      const skip = (currentPage - 1) * rowsPerPage;
      const filterParams = buildFilterParams();
      const response = await getTransactions({ ...filterParams, limit: rowsPerPage + 1, skip });
      if (response) {
        let fetchedData;
        if (Array.isArray(response)) {
          fetchedData = response;
        } else if (response.data) {
          fetchedData = response.data;
        } else {
          setError("Unexpected response format");
          setLoading(false);
          return;
        }
        if (fetchedData.length > rowsPerPage) {
          setHasNextPage(true);
          fetchedData = fetchedData.slice(0, rowsPerPage);
        } else {
          setHasNextPage(false);
        }
        setData(fetchedData);
      } else {
        setError("Error fetching data");
      }
    } else {
      // When a specific date is selected, fetch all transactions and filter on the frontend.
      const filterParams = buildFilterParams();
      const response = await getTransactions({ ...filterParams, all: true, limit: 10000 });
      if (response) {
        let allData;
        if (Array.isArray(response)) {
          allData = response;
        } else if (response.data) {
          allData = response.data;
        } else {
          setError("Unexpected response format");
          setLoading(false);
          return;
        }
        
        // Format the selected date for comparison by removing "collection_" prefix.
        const formattedSelectedDate = selectedDate.replace("collection_", "").trim();
        
        // Filter transactions by comparing the date extracted from createdAt.
        let filteredData = allData.filter(item => {
          if (!item.createdAt) return false;
          // Extract the date portion from createdAt (YYYY-MM-DD)
          const itemDate = new Date(item.createdAt).toISOString().substring(0, 10);
          return itemDate === formattedSelectedDate;
        });

        // Filter by amount
        if (minAmount !== '') {
          filteredData = filteredData.filter(item => item.amount >= Number(minAmount));
        }
        if (maxAmount !== '') {
          filteredData = filteredData.filter(item => item.amount <= Number(maxAmount));
        }
        console.log("Transactions after amount filtering:", filteredData.length);

        // Apply client-side pagination.
        const total = filteredData.length;
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        setData(paginatedData);
        setHasNextPage(endIndex < total);
      } else {
        setError("Error fetching data");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedDate, selectedStatuses, searchTerm, minAmount, maxAmount]);

  // Handlers for filter changes (reset currentPage to 1 when filters change)
  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateChange = dateStr => {
    setSelectedDate(dateStr);
    setCurrentPage(1);
  };

  const handleStatusChange = statuses => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const handleAmountChange = ({ min, max }) => {
    console.log("QueryBoard: Received amount filter:", min, max);
    setMinAmount(min);
    setMaxAmount(max);
    setCurrentPage(1);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center'}}>
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
          onAmountChange={handleAmountChange}
          selectedDate={selectedDate}
          selectedStatuses={selectedStatuses}
          selectedMinAmount={minAmount}
          selectedMaxAmount={maxAmount}
        />
      </div>
      <div className="p-6 rounded-lg shadow-md">
        <DataTable
          data={data}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default QueryBoard;
