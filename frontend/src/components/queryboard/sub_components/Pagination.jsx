// Pagination.js
import React from 'react';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Pagination = ({ currentPage, hasNextPage, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
      >
        <MdOutlineKeyboardArrowLeft />
      </button>
      <span>Page {currentPage}</span>
      <button
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded ${!hasNextPage ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
      >
        <MdOutlineKeyboardArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
