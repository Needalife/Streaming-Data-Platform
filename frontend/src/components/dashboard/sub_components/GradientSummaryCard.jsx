import React from 'react';

const GradientSummaryCard = ({ totalTransactions, date }) => (
  <div className="flex flex-col items-center justify-center bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md h-full">
    <div className="text-lg font-bold">{date}</div>
    <div className="mt-4 text-center">
      <div className="text-base">We have recorded a total of</div>
      <div className="text-4xl font-bold my-2">{totalTransactions}</div>
      <div className="text-base">Transactions.</div>
    </div>
  </div>
);

export default GradientSummaryCard;
