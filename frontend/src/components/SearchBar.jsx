import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

const SearchBar = ({ placeholder, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="p-8">
            <form
                onSubmit={handleSubmit}
                className="relative flex items-center justify-center mt-5 w-64"
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="pl-4 pr-12 py-2 w-full bg-gray-300 rounded-full focus:outline-none focus:border-green-500"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none flex justify-center items-center"
                >
                    <IoSearchOutline size={35} />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
