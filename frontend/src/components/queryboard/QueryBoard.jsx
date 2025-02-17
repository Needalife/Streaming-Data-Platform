// QueryBoard.jsx
import React, { useState, useEffect } from 'react';
import Filters from '../queryboard/sub_components/Filters';
import DataTable from '../queryboard/sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';
import { getTransactions } from './api/transaction';

const QueryBoard = () => {
  // State declarations for data, filters, pagination, etc.
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']); // <-- Make sure this is declared!
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state (using "limit+1" strategy for backend pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [hasNextPage, setHasNextPage] = useState(false);

  // Build filter parameters to send to the backend.
  const buildFilterParams = () => {
    const params = {};

    // Search filter
    if (searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
      params.all = false;
    } else {
      params.all = false;
    }

    // Status filter: if not "All", join the statuses (e.g., "pending", "completed", etc.)
    if (!selectedStatuses.includes('All') && selectedStatuses.length > 0) {
      params.status = selectedStatuses.join(',');
    }

    // Date filter: convert the selected date to YYYY-MM-DD format
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      params.date = `${year}-${month}-${day}`;
    }

    // Type filter: only send if not "All"
    if (selectedType !== 'All') {
      params.type = selectedType;
    }

    return params;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    // Calculate offset based on current page
    const skip = (currentPage - 1) * rowsPerPage;
    const filterParams = buildFilterParams();

    // Request one extra record to check if there is a next page.
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
      // If we fetched more records than rowsPerPage, we have a next page.
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
  }, [currentPage, selectedDate, selectedStatuses, selectedType, searchTerm]);

  // Handlers to update filters/search and reset the page to 1 when changed.
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleStatusChange = (statuses) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
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
          onTypeChange={handleTypeChange}
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
