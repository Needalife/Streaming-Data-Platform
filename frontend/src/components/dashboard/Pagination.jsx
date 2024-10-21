import React from 'react';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handleFirstPage = () => onPageChange(1);
    const handleLastPage = () => onPageChange(totalPages);
    const handleNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));
    const handlePreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));

    const getPageNumbers = () => {
        const pageNumbers = [];

        if (currentPage <= 4) {
            for (let i = 1; i <= Math.min(7, totalPages); i++) {
                pageNumbers.push(i);
            }
            if (totalPages > 7) {
                // pageNumbers.push('dots-right');
            }
        } else if (currentPage > totalPages - 4) {
            if (totalPages > 7) {
                // pageNumbers.push('dots-left');
            }
            for (let i = totalPages - 6; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // pageNumbers.push('dots-left');
            for (let i = currentPage - 3; i <= currentPage + 3; i++) {
                pageNumbers.push(i);
            }
            // pageNumbers.push('dots-right');
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
                {/* First page btn */}
                <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-3 ${currentPage === 1 ? 'bg-gray-500' : 'bg-red-500'} text-white rounded-full focus:outline-none`}
                >
                    <MdOutlineKeyboardDoubleArrowLeft />
                </button>
                {/* Previous page btn */}
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-3 ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-full focus:outline-none`}
                >
                    <MdOutlineKeyboardArrowLeft />
                </button>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Pagination */}
            <div className="flex space-x-2">
                <div className="flex items-center">
                    <BsThreeDots
                        className={`${(currentPage <= 4) ? 'opacity-0' : 'opacity-100'}`} />
                </div>
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`w-12 h-12 flex justify-center items-center ${page === currentPage ? 'border-2 border-blue-500' : ''} rounded-full focus:outline-none`}
                        >
                            {page}
                        </button>
                    </React.Fragment>
                ))}
                <div className="flex items-center">
                    <BsThreeDots
                        className={`${(currentPage > totalPages - 4) ? 'opacity-0' : 'opacity-100'}`} />
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            <div className="flex space-x-2">
                {/* Next page btn */}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-3 ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-full focus:outline-none`}
                >
                    <MdOutlineKeyboardArrowRight />
                </button>
                {/* Last page btn */}
                <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-3 ${currentPage === totalPages ? 'bg-gray-500' : 'bg-red-500'} text-white rounded-full focus:outline-none`}
                >
                    <MdOutlineKeyboardDoubleArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
