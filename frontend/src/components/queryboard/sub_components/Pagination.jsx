import React from 'react';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Pagination = ({ currentPage, hasNextPage, onPageChange }) => {
  let startPage, endPage;

  if (hasNextPage) {
    // When there's a next page, use a range centered on the current page if possible.
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  } else {
    // No next page means currentPage is the last page.
    endPage = currentPage;
    startPage = Math.max(1, endPage - 4);
  }

  // Create an array of page numbers to display.
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* Previous Button */}
      <button 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
      >
        <MdOutlineKeyboardArrowLeft />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded ${page === currentPage ? 'border-2 border-blue-500' : 'bg-gray-200'}`}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis if there is a next page beyond the range */}
      {hasNextPage && <span>...</span>}

      {/* Next Button */}
      <button 
        onClick={handleNext} 
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded ${!hasNextPage ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
      >
        <MdOutlineKeyboardArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
