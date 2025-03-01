import React, { useState, useEffect } from 'react';
import Filters from './sub_components/filters/Filters';
import DataTable from './sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';
import { getTransactions, getTransactionById, searchTransactions } from './hooks/useTransaction';

// Helper to calculate rows per page based on window height
const calculateRowsPerPage = () => {
  const reservedSpace = 400; // space for header, filters, etc.
  const availableHeight = window.innerHeight - reservedSpace;
  const estimatedRowHeight = 70;
  const calculatedRows = Math.floor(availableHeight / estimatedRowHeight);
  return calculatedRows > 0 ? calculatedRows : 1;
};

const QueryBoard = () => {
  // Data & loading states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination state using lazy initialization for dynamic row count
  const [rowsPerPage, setRowsPerPage] = useState(() => calculateRowsPerPage());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Update rows per page on window resize
  useEffect(() => {
    const updateRowsPerPage = () => {
      setRowsPerPage(calculateRowsPerPage());
    };

    window.addEventListener('resize', updateRowsPerPage);
    return () => window.removeEventListener('resize', updateRowsPerPage);
  }, []);

  // Build filter parameters for the backend query
  const buildFilterParams = () => {
    const params = { all: false };
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
      setError("No Data");
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedStatuses, minAmount, maxAmount, rowsPerPage]);

  const handleSearch = async (term) => {
    if (term.trim() === '') {
      fetchData();
      return;
    }
    setLoading(true);
    setError(null);
    const trimmedTerm = term.trim();

    if (/^[0-9a-fA-F]{24}$/.test(trimmedTerm)) {
      try {
        const result = await getTransactionById(trimmedTerm);
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
    } else {
      try {
        const result = await searchTransactions(trimmedTerm);
        if (result && result.length > 0) {
          setData(result);
          setError(null);
        } else {
          setData([]);
          setError("No transactions found for the given keyword");
        }
      } catch (err) {
        setError("Error searching transactions by keyword");
        setData([]);
      }
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

  return (
    <div className="h-screen overflow-y-scroll">
      <div className={`transition-all duration-300 ${loading ? 'blur-sm' : 'blur-0'}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Queryboard</h1>
          <SearchBar placeholder="Search by ID or keyword" onSearch={handleSearch} />
        </div>
        <Filters
          onStatusChange={handleStatusChange}
          onAmountChange={handleAmountChange}
          selectedStatuses={selectedStatuses}
          selectedMinAmount={minAmount}
          selectedMaxAmount={maxAmount}
        />

        {error && (
          <p className="text-red-500 text-center my-4">
            {error}
          </p>
        )}

        <div className="p-6 rounded-lg shadow-md mt-6 bg-white">
          {data && data.length > 0 ? (
            <DataTable
              data={data}
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
            />
          ) : (
            !loading && !error && (
              <div className="text-center p-4">
                <p>No transactions found</p>
              </div>
            )
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </div>
  );
};

export default QueryBoard;
