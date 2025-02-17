import React from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiDownload } from 'react-icons/fi';
import { formatTimestamp, formatStatus } from '../../../utils/helpers';

const Table = ({ data, refreshData }) => {
  const handleDelete = (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete transaction: ${item.name}?`
    );
    if (confirmDelete) {
      alert('Delete functionality is not implemented.');
      // Optionally, refresh data after deletion:
      // refreshData();
    }
  };

  const handleDownload = (item) => {
    alert('Download functionality is not implemented.');
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full bg-white border border-gray-200 table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center w-1/5">Name</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Time & Date</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Status</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Type</th>
            <th className="py-2 px-4 border-b text-center w-1/5">Actions</th>
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
                    item.status === 'success'
                      ? 'bg-green-200 text-green-700'
                      : item.status === 'failed'
                      ? 'bg-red-200 text-red-700'
                      : 'bg-yellow-200 text-yellow-700'
                  }`}
                >
                  {formatStatus(item.status)}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-center w-1/5">{item.type}</td>
              <td className="py-2 px-4 border-b text-center w-1/5">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    <RiDeleteBin6Line />
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    <FiDownload />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
