// QueryBoard.js
import React, { useEffect, useState } from 'react';
import Filters from '../queryboard/sub_components/Filters';
import DataTable from '../queryboard/sub_components/DataTable';
import SearchBar from '../queryboard/sub_components/SearchBar';
import { getTransactions } from './api/transaction';

const QueryBoard = () => {
  // State for paginated data and next-page flag
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/search states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // desired items per page

  // Build filter parameters for the backend query.
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
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      params.date = `${year}-${month}-${day}`;
    }
    if (selectedType !== 'All') {
      params.type = selectedType;
    }
    return params;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    // Request one extra record to check for a next page
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

      // If we have more items than our page size, there is a next page.
      if (fetchedData.length > rowsPerPage) {
        setHasNextPage(true);
        // Remove the extra item
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

  // Re-fetch data when currentPage or any filter/search parameter changes.
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedDate, selectedStatuses, selectedType, searchTerm]);

  // Handlers that update filters/search and reset to page 1
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', textAlign: 'center'
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
