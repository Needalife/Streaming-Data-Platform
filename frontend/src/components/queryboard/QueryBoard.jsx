import React, { useState, useEffect } from 'react';
import Filters from './sub_components/filters/Filters';
import DataTable from './sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';
import { getTransactions, getTransactionById } from './api/transaction';

const QueryBoard = () => {
  // Data & loading states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [hasNextPage, setHasNextPage] = useState(false);

  // Build filter parameters for the backend query
  const buildFilterParams = () => {
    const params = {};
    params.all = false;
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
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedStatuses, minAmount, maxAmount]);

  // Search by transaction id.
  const handleSearch = async (term) => {
    if (term.trim() === '') {
      // If empty, re-run fetchData with current filters.
      fetchData();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactionById(term.trim());
      if (result) {
        setData([result]);
        setError(null);
      } else {
        setData([]);
        setError("Transaction not found");
      }
    } catch (err) {
      setError("Error fetching transaction by id");
      setData([]);
    }
    setLoading(false);
  };

  const handleStatusChange = statuses => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const handleAmountChange = ({ min, max }) => {
    setMinAmount(min);
    setMaxAmount(max);
    setCurrentPage(1);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
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
        <SearchBar placeholder="Search by ID" onSearch={handleSearch} />
      </div>
      <div className="p-6 rounded-lg shadow-md">
        <Filters
          onStatusChange={handleStatusChange}
          onAmountChange={handleAmountChange}
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
