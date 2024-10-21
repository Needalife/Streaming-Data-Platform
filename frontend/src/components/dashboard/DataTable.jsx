import React, { useState, useEffect } from 'react';
import Table from './Table';
import Pagination from './Pagination';

const DataTable = ({ data = [], selectedDate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        if (selectedDate) {
            const filtered = data.filter((item) => {
                const itemDate = new Date(item.timestamp);
                return (
                    itemDate.getDate() === selectedDate.getDate() &&
                    itemDate.getMonth() === selectedDate.getMonth() &&
                    itemDate.getFullYear() === selectedDate.getFullYear()
                );
            });
            setFilteredData(filtered);
            setCurrentPage(1);
        } else {
            setFilteredData(data);
        }
    }, [selectedDate, data]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
                <div className="text-center p-6 text-gray-500">No data</div>
            ) : (
                <>
                    <Table data={currentData} />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default DataTable;
