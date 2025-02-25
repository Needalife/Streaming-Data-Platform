import React from 'react';
import { formatTimestamp, formatStatus } from '../../../utils/helpers';

const Table = ({ data }) => {
  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full bg-white border border-gray-200 table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center w-1/5">Name</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Time & Date</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Status</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Type</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 px-4 border-b text-center w-1/5">{item.name}</td>
              <td className="py-4 px-4 border-b text-center w-1/5">
                {formatTimestamp(item.createdAt)}
              </td>
              <td className="py-4 px-4 border-b text-center w-1/5">
                <span
                  className={`inline-block px-3 py-1 rounded-full font-bold ${
                    item.status === 'completed'
                      ? 'bg-blue-200 text-blue-700'     // Success (Blue Purple)
                      : item.status === 'failed'
                      ? 'bg-red-200 text-red-700'       // Failed (Red)
                      : 'bg-pink-200 text-pink-700'     // Pending (Pink Red)
                  }`}
                >
                  {formatStatus(item.status)}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-center w-1/5">{item.type}</td>
              <td className="py-2 px-4 border-b text-center w-1/5">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
