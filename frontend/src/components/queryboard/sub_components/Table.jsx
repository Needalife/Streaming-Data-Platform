import React from 'react';
import { formatTimestamp, formatStatus } from '../../../utils/helpers';

const Table = ({ data }) => {
  return (
    <div className="max-h overflow-y-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 h-[60px]">
            <th className="py-2 px-4 text-center w-1/6">Name</th>
            <th className="py-2 px-4 text-center w-1/6">Time & Date</th>
            <th className="py-2 px-4 text-center w-1/6">Status</th>
            <th className="py-2 px-4 text-center w-1/6">Type</th>
            <th className="py-2 px-4 text-center w-1/6">Amount</th>
            <th className="py-2 px-4 text-center w-1/6">Currency</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-4 px-4 text-center w-1/6">{item.name}</td>
              <td className="py-4 px-4 text-center w-1/6">
                {formatTimestamp(item.createdAt)}
              </td>
              <td className="py-4 px-4 text-center w-1/6">
                <span
                  className={`inline-block px-3 py-1 rounded-full font-bold ${
                    item.status === 'completed'
                      ? 'bg-green-200 text-green-700'     // Success (Green)
                      : item.status === 'failed'
                      ? 'bg-red-200 text-red-700'       // Failed (Red)
                      : 'bg-yellow-200 text-yellow-700'     // Pending (Yellow)
                  }`}
                >
                  {formatStatus(item.status)}
                </span>
              </td>
              <td className="py-2 px-4 text-center w-1/6">{item.type}</td>
              <td className="py-2 px-4 text-center w-1/6">{item.amount}</td>
              <td className="py-2 px-4 text-center w-1/6">{item.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
