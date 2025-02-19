// DataTable.js
import React from 'react';
import Table from '../Table';
import Pagination from '../Pagination';

const DataTable = ({ data = [], currentPage, hasNextPage, onPageChange }) => {
  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="text-center p-6 text-gray-500">No data</div>
      ) : (
        <>
          <Table data={data} />
          <Pagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default DataTable;
