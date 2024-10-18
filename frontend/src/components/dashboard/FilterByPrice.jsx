import React, { useState } from 'react';

const FilterByPrice = () => {
    const [minPrice, setMinPrice] = useState(10);
    const [maxPrice, setMaxPrice] = useState(90);

    const handleMinPriceChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= maxPrice) {
            setMinPrice(value);
        }
    };

    const handleMaxPriceChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= minPrice) {
            setMaxPrice(value);
        }
    };

    return (
        <div className="max-w-md mx-auto rounded-lg">
            <div className="border-b w-full">
                <h2 className="text-lg font-bold text-gray-700 m-4">Price Range</h2>
            </div>

            <div className="pt-10 p-4">
                <div className="relative h-10">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="absolute w-full appearance-none pointer-events-none h-1 bg-transparent z-20"
                        style={{
                            pointerEvents: 'auto',
                        }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="absolute w-full appearance-none pointer-events-none h-1 bg-transparent z-10"
                        style={{
                            pointerEvents: 'auto',
                        }}
                    />
                    <div className="absolute w-full h-1 bg-gray-300 rounded-full" />
                    <div
                        className="absolute h-1 bg-blue-500 rounded-full"
                        style={{
                            left: `${(minPrice / 100) * 100}%`,
                            width: `${((maxPrice - minPrice) / 100) * 100}%`,
                        }}
                    />
                </div>

                <div className="flex justify-between text-gray-600 mt-2">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterByPrice;
